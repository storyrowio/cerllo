package services

import (
	"bytes"
	"cerllo/database"
	"cerllo/models"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/lrstanley/go-ytdlp"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/oauth2"
	"io"
	"log"
	"mime/multipart"
	"os"
	"path/filepath"

	"google.golang.org/api/drive/v3"
	"google.golang.org/api/option"
)

const FileCollection = "files"

func CloudinaryInstance(config models.CloudinaryInstanceSetting) (*cloudinary.Cloudinary, error) {
	cloudInstance, err := cloudinary.NewFromParams(
		config.CloudinaryCloudName,
		config.CloudinaryKey,
		config.CloudinarySecret,
	)
	if err != nil {
		return nil, err
	}

	return cloudInstance, nil
}

func UploadToCloudinary(fileHeader *multipart.FileHeader, path string) (*models.UploadResult, error) {
	config := GetCloudinaryConfig()
	if config == nil {
		return nil, errors.New("No cloudinary config found!")
	}

	cld, err := CloudinaryInstance(*config)
	if err != nil {
		return nil, err
	}

	file, err := fileHeader.Open()
	if err != nil {
		return nil, err
	}
	defer file.Close()

	resp, err := cld.Upload.Upload(context.Background(), file, uploader.UploadParams{
		Folder:   os.Getenv("APP_NAME"),
		PublicID: fileHeader.Filename,
	})
	if err != nil {
		return nil, err
	}

	return &models.UploadResult{
		Url:      resp.SecureURL,
		FileName: fileHeader.Filename,
		Path:     resp.PublicID,
		Metadata: models.FileMetadata{
			Filename:    fileHeader.Filename,
			Size:        fileHeader.Size,
			ContentType: fileHeader.Header.Get("Content-Type"),
			Extension:   filepath.Ext(fileHeader.Filename),
		},
		Driver: models.CloudinaryDriver,
	}, nil
}

func UploadInterfaceToCloudinary(file interface{}, filename string) (*models.UploadResult, error) {
	config := GetCloudinaryConfig()
	if config == nil {
		return nil, errors.New("No cloudinary config found!")
	}

	cld, err := CloudinaryInstance(*config)
	if err != nil {
		return nil, err
	}

	resp, err := cld.Upload.Upload(context.Background(), file, uploader.UploadParams{
		Folder:       os.Getenv("APP_NAME"),
		PublicID:     filename,
		Format:       "mp3",
		ResourceType: "audio",
	})
	if err != nil {
		return nil, err
	}

	return &models.UploadResult{
		Url:      resp.SecureURL,
		FileName: filename,
		Path:     resp.PublicID,
		Driver:   models.CloudinaryDriver,
	}, nil
}

func DeleteFromCloudinary(publicId string) error {
	config := GetCloudinaryConfig()
	if config == nil {
		return errors.New("No cloudinary config found!")
	}

	cld, err := CloudinaryInstance(*config)
	if err != nil {
		return err
	}

	_, err = cld.Upload.Destroy(context.Background(), uploader.DestroyParams{
		PublicID: publicId,
	})
	if err != nil {
		log.Println("Failed delete "+publicId, err.Error())
	}

	return nil
}

func UploadToGoogleDrive(fileHeader *multipart.FileHeader, folder string, token string) (*models.UploadResult, error) {
	srv, err := drive.NewService(context.Background(), option.WithTokenSource(oauth2.StaticTokenSource(&oauth2.Token{AccessToken: token})))
	if err != nil {
		return nil, err
	}

	driveFile := &drive.File{
		Name:     fileHeader.Filename,
		Parents:  []string{folder},
		MimeType: fileHeader.Header.Get("Content-Type"), // Change this based on your file type
	}

	file, err := fileHeader.Open()
	if err != nil {
		return nil, err
	}
	defer file.Close()

	res, err := srv.Files.Create(driveFile).Media(file).Do()
	if err != nil {
		return nil, err
	}

	_, err = srv.Permissions.Create(res.Id, &drive.Permission{
		Type: "anyone",
		Role: "reader",
	}).Do()
	if err != nil {
		return nil, err
	}

	publicURL := fmt.Sprintf("https://drive.google.com/uc?id=%s", res.Id)

	return &models.UploadResult{
		Url:      publicURL,
		FileName: fileHeader.Filename,
		Path:     res.Id,
		Metadata: models.FileMetadata{
			Filename:    fileHeader.Filename,
			Size:        fileHeader.Size,
			ContentType: fileHeader.Header.Get("Content-Type"),
			Extension:   filepath.Ext(fileHeader.Filename),
		},
		Driver: models.GoogleDriveDriver,
	}, nil
}

func DeleteFromGoogleDrive(fileId string, token string) error {
	srv, err := drive.NewService(context.Background(), option.WithTokenSource(oauth2.StaticTokenSource(&oauth2.Token{AccessToken: token})))
	if err != nil {
		return err
	}

	err = srv.Files.Delete(fileId).Do()
	if err != nil {
		return err
	}
	fmt.Printf("File with ID %s deleted successfully.\n", fileId)

	return nil
}

func GetFiles(filters bson.M, opt *options.FindOptions, query *models.Query) models.Result {
	results := make([]models.User, 0)

	cursor := database.Find(FileCollection, filters, opt)
	count := database.Count(FileCollection, filters)

	if cursor == nil {
		return models.Result{Data: results}
	}
	for cursor.Next(context.Background()) {
		var user models.User
		if cursor.Decode(&user) == nil {
			results = append(results, user)
		}
	}

	pagination := query.GetPagination(count)

	result := models.Result{
		Data:       results,
		Pagination: pagination,
		Query:      *query,
	}

	return result
}

func CreateFiles(params []models.FileInfo) error {
	data := make([]interface{}, 0)
	for _, val := range params {
		data = append(data, val)
	}

	_, err := database.InsertMany(FileCollection, data)
	if err != nil {
		return err
	}

	return nil
}

func DeleteFiles(ids []string, userId string, token string) error {
	filter := bson.M{"id": bson.M{"$in": ids}}

	cursor := database.Find(FileCollection, bson.M{"userid": userId}, nil)
	for cursor.Next(context.Background()) {
		var item models.FileInfo
		if cursor.Decode(&item) == nil {
			if item.Driver == models.CloudinaryDriver {
				err := DeleteFromCloudinary(item.Path)
				if err != nil {
					log.Println("Failed to delete items")
				}
			} else if item.Driver == models.GoogleDriveDriver {
				err := DeleteFromGoogleDrive(item.Path, token)
				if err != nil {
					log.Println("Failed to delete items")
				}
			}
		}
	}

	res, err := database.DeleteMany(FileCollection, filter)
	if res == nil {
		return err
	}

	return nil
}

func DownloadFromYoutube(req models.ConvertYoutubeRequest) (*models.SongFile, error) {
	var songFile models.SongFile

	if req.Format != "" {
		dl := ytdlp.New().PrintJSON()
		res, err := dl.Run(context.TODO(), req.Url)
		if err != nil {
			panic(err)
		}

		err = json.Unmarshal([]byte(res.Stdout), &songFile)
		if err != nil {
			panic(err)
		}
	}

	switch req.Format {
	case "mp3":
		dl := ytdlp.New().
			AudioFormat("mp3").
			Output("downloads/%(title)s.mp3").
			PrintJSON()

		_, err := dl.Run(context.TODO(), req.Url)
		if err != nil {
			panic(err)
		}
	case "mp4":
		dl := ytdlp.New().
			FormatSort("res,ext:mp4:m4a").
			RecodeVideo("mp4").
			Output("downloads/%(title)s.mp4")

		_, err := dl.Run(context.TODO(), req.Url)
		if err != nil {
			panic(err)
		}
	default:
		return nil, errors.New("Invalid format")
	}

	songFile.Path = "./downloads/" + songFile.Title + "." + req.Format

	return &songFile, nil
}

func ConvertFileToMultipartFile(path string) (*multipart.FileHeader, error) {
	file, err := os.Open(path)
	if err != nil {
		fmt.Println("Failed to open file:", err)
		return nil, err
	}
	defer file.Close()

	// Create a buffer to store the multipart file
	var buf bytes.Buffer
	writer := multipart.NewWriter(&buf)

	// Create a form file field
	formFile, err := writer.CreateFormFile("file", path)
	if err != nil {
		fmt.Println("Failed to create form file:", err)
		return nil, err
	}

	// Copy file data into form file
	_, err = io.Copy(formFile, file)
	if err != nil {
		fmt.Println("Failed to copy file:", err)
		return nil, err
	}

	// Close the multipart writer
	writer.Close()

	// Convert to multipart.FileHeader
	fileHeader := multipart.FileHeader{
		Filename: path,
		Size:     int64(buf.Len()),
	}

	return &fileHeader, nil
}
