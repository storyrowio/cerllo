package controllers

import (
	"cerllo/lib"
	"cerllo/models"
	"cerllo/services"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"mime/multipart"
	"net/http"
	"strings"
	"sync"
	"time"
)

func UploadFile(c *gin.Context) {
	var request models.FileRequest
	err := c.ShouldBind(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.Response{Data: err.Error()})
		return
	}

	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid form"})
		return
	}

	files := form.File["files"]

	profile := services.GetCurrentUser(c.Request)
	if profile == nil {
		c.JSON(http.StatusBadRequest, models.Response{Data: err.Error()})
		return
	}

	// If driver is google
	googleFolder := ""
	if request.Driver == models.GoogleDriveDriver {
		folder, err := lib.GetOrCreateDefaultFolder(request.Token)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.Response{Data: err.Error()})
			return
		}
		googleFolder = *folder
	}

	var wg sync.WaitGroup
	results := make([]models.UploadResult, len(files))

	for i, file := range files {
		wg.Add(1)
		go func(i int, file *multipart.FileHeader) {
			defer wg.Done()
			if request.Driver == models.GoogleDriveDriver {
				result, err := services.UploadToGoogleDrive(file, googleFolder, request.Token)
				if err == nil {
					results[i] = *result
				}
			} else {
				result, err := services.UploadToCloudinary(file, profile.Id)
				if result != nil || err == nil {
					results[i] = *result
				}
			}
		}(i, file)
	}

	wg.Wait()

	params := make([]models.FileInfo, 0)
	for _, val := range results {
		params = append(params, models.FileInfo{
			Id:       uuid.New().String(),
			UserId:   profile.Id,
			FileName: val.FileName,
			Path:     val.Path,
			Metadata: val.Metadata,
			Url:      val.Url,
			Driver:   val.Driver,
			BasicDate: models.BasicDate{
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			},
		})
	}

	if len(params) > 0 {
		err = services.CreateFiles(params)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.Response{Data: err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, models.Response{Data: params})
}

func DestroyFile(c *gin.Context) {
	request := struct {
		Token string `json:"token"`
	}{}
	err := c.ShouldBind(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.Response{Data: err.Error()})
		return
	}

	profile := services.GetCurrentUser(c.Request)
	if profile == nil {
		c.JSON(http.StatusBadRequest, models.Response{Data: err.Error()})
		return
	}

	ids := c.Param("ids")
	splittedIds := strings.Split(ids, ",")

	err = services.DeleteFiles(splittedIds, profile.Id, request.Token)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.Response{Data: err.Error()})
		return
	}

	c.JSON(http.StatusOK, models.Response{Data: "Success"})
}
