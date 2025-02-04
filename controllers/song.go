package controllers

import (
	"cerllo/models"
	"cerllo/services"
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"log"
	"net/http"
	"os"
	"time"
)

func GetSongs(c *gin.Context) {
	var query models.Query

	err := c.ShouldBindQuery(&query)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.Response{Data: err.Error()})
		return
	}

	filters := query.GetQueryFind()
	opts := query.GetOptions()

	results := services.GetSongsWithPagination(filters, opts, query)

	c.JSON(http.StatusOK, models.Response{Data: results})
	return
}

func CreateSong(c *gin.Context) {
	var request models.Song
	request.Id = uuid.New().String()

	err := c.ShouldBindJSON(&request)
	if err != nil {
		c.JSON(400, models.Response{Data: err.Error()})
		return
	}

	if request.AlbumId != "" {
		album := services.GetAlbum(bson.M{"id": request.AlbumId}, nil)
		if album != nil {
			request.ArtistId = album.ArtistId
		}
	}

	request.CreatedAt = time.Now()
	request.UpdatedAt = time.Now()

	_, err = services.CreateSong(request)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.Response{Data: err.Error()})
		return
	}

	c.JSON(http.StatusOK, models.Response{Data: request})
	return
}

func CreateManySong(c *gin.Context) {
	request := struct {
		Songs []models.Song `json:"songs"`
	}{}
	err := c.ShouldBindJSON(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.Response{Data: err.Error()})
		return
	}

	_, err = services.CreateManySong(request.Songs)
	if err != nil {
		c.JSON(http.StatusNotFound, models.Response{Data: err.Error()})
		return
	}

	c.JSON(http.StatusOK, models.Response{Status: http.StatusOK, Data: request.Songs})
}

func GetSongById(c *gin.Context) {
	id := c.Param("id")

	result := services.GetSong(bson.M{"id": id}, nil)
	if result == nil {
		c.JSON(http.StatusNotFound, models.Result{Data: "Data Not Found"})
		return
	}

	c.JSON(http.StatusOK, models.Response{Data: result})
}

func UpdateSong(c *gin.Context) {
	id := c.Param("id")

	Song := services.GetSong(bson.M{"id": id}, nil)
	if Song == nil {
		c.JSON(http.StatusNotFound, models.Result{Data: "Data Not Found"})
		return
	}

	var request models.Song

	err := c.ShouldBindJSON(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.Response{Data: err.Error()})
		return
	}

	_, err = services.UpdateSong(id, request)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.Response{Data: err.Error()})
		return
	}

	c.JSON(200, models.Response{Data: request})
}

func DeleteSong(c *gin.Context) {
	id := c.Param("id")

	_, err := services.DeleteSong(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.Response{Data: "Failed Delete Data"})
		return
	}

	c.JSON(http.StatusOK, models.Response{Data: "Success"})
}

func CreateDownloadFromProvider(c *gin.Context) {
	request := struct {
		Url      string `json:"url"`
		Provider string `json:"provider"` // youtube, etc
		Format   string `json:"format"`   // mp3, mp4
	}{}
	err := c.ShouldBindJSON(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.Response{Data: err.Error()})
		return
	}

	var songFile *models.SongFile

	if request.Provider == models.YoutubeProvider {
		file, err := services.DownloadFromYoutube(models.ConvertYoutubeRequest{
			Url:    request.Url,
			Format: request.Format,
		})
		if err != nil {
			c.JSON(http.StatusBadRequest, models.Response{Data: err.Error()})
			return
		}
		songFile = file
	}

	if songFile == nil {
		c.JSON(http.StatusBadRequest, models.Response{Data: errors.New("Failed to download song")})
		return
	}

	file, err := os.Open(songFile.Path)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.Response{Data: err.Error()})
		return
	}
	defer file.Close()

	result, err := services.UploadInterfaceToCloudinary(file, songFile.Filename)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.Response{Data: err.Error()})
		return
	}

	songFile.Url = result.Url

	isArtistExist := false
	isAlbumExist := false
	var albumId string

	// Check artist
	artist := services.GetArtist(bson.M{"name": songFile.Artist}, nil)
	if artist != nil {
		isArtistExist = true
		// Check album
		album := services.GetAlbum(bson.M{"name": songFile.Album}, nil)
		if album != nil {
			albumId = album.Id
			isAlbumExist = true
		}
	}

	if !isArtistExist {
		artist = &models.Artist{
			Id:    uuid.New().String(),
			Name:  songFile.Artist,
			Image: "",
			BasicDate: models.BasicDate{
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			},
		}
		_, err := services.CreateArtist(*artist)
		if err != nil {
			log.Println("Error create artist", err.Error())
		}
	}

	if !isAlbumExist {
		albumId = uuid.New().String()
		_, err := services.CreateAlbum(models.Album{
			Id:          albumId,
			Title:       songFile.Album,
			ArtistId:    artist.Id,
			ReleaseDate: "01-01-2001",
			Image:       "",
			BasicDate: models.BasicDate{
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			},
		})
		if err != nil {
			log.Println("Error create album", err.Error())
		}
	}

	song := models.Song{
		Id:       uuid.New().String(),
		Title:    songFile.Title,
		ArtistId: artist.Id,
		AlbumId:  albumId,
		Url:      songFile.Url,
		BasicDate: models.BasicDate{
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
	}
	_, err = services.CreateSong(song)
	if err != nil {
		log.Println("Error create album", err.Error())
	}

	c.JSON(http.StatusOK, models.Response{Data: song})
}
