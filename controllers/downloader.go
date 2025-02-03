package controllers

import (
	"cerllo/models"
	"context"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/lrstanley/go-ytdlp"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

func ConvertYoutubeToMp3(c *gin.Context) {
	var req models.ConvertYoutubeRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.Response{
			Status: http.StatusBadRequest,
			Data:   err.Error(),
		})
		return
	}

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

		res, err := dl.Run(context.TODO(), req.Url)
		if err != nil {
			panic(err)
		}
		log.Println(res.Stdout)
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
		c.JSON(http.StatusBadRequest, models.Response{
			Status: http.StatusBadRequest,
			Data:   "Invalid format",
		})
		return
	}

	downloadURL := fmt.Sprintf(os.Getenv("APP_URL")+"/api/download/%s", songFile.Title+"."+req.Format)
	c.JSON(http.StatusOK, models.Response{
		Status: http.StatusOK,
		Data:   downloadURL,
	})
}

func DownloadFile(c *gin.Context) {
	fileName := c.Param("fileName")

	filePath := filepath.Join("downloads", fileName)

	// Check if file exists
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "File not found",
		})
		return
	}

	// Get file info
	file, err := os.Open(filePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Unable to access file",
		})
		return
	}
	defer file.Close()

	fileInfo, err := file.Stat()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Unable to get file info",
		})
		return
	}

	// Determine content type based on file extension
	contentType := "application/octet-stream"
	if strings.HasSuffix(fileName, ".mp3") {
		contentType = "audio/mpeg"
	} else if strings.HasSuffix(fileName, ".mp4") {
		contentType = "video/mp4"
	}

	// Ensure proper file extension is kept
	title := fileName
	ext := filepath.Ext(fileName)
	title = strings.TrimSuffix(title, ext) + ext

	// Set headers for download
	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Transfer-Encoding", "binary")
	c.Header("Content-Disposition", fmt.Sprintf(`attachment; filename="%s"`, title))
	c.Header("Content-Type", contentType)
	c.Header("Content-Length", fmt.Sprintf("%d", fileInfo.Size()))
	c.Header("Cache-Control", "no-cache")
	c.Header("Expires", "0")

	// Stream the file
	c.File(filePath)
}
