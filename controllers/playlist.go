package controllers

import (
	"cerllo/models"
	"cerllo/services"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"net/http"
	"time"
)

func GetPlaylists(c *gin.Context) {
	var query models.Query

	err := c.ShouldBindQuery(&query)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.Response{Data: err.Error()})
		return
	}

	filters := query.GetQueryFind()
	opts := query.GetOptions()

	results := services.GetPlaylistsWithPagination(filters, opts, query)

	c.JSON(http.StatusOK, models.Response{Data: results})
	return
}

func CreatePlaylist(c *gin.Context) {
	profile := services.GetCurrentUser(c.Request)

	var request models.Playlist
	request.Id = uuid.New().String()
	request.UserId = profile.Id

	err := c.ShouldBindJSON(&request)
	if err != nil {
		c.JSON(400, models.Response{Data: err.Error()})
		return
	}

	request.CreatedAt = time.Now()
	request.UpdatedAt = time.Now()

	_, err = services.CreatePlaylist(request)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.Response{Data: err.Error()})
		return
	}

	filters := bson.M{"userId": request.UserId}
	results := services.GetPlaylists(filters, nil)

	c.JSON(http.StatusOK, models.Response{Data: results})
	return
}

func GetPlaylistById(c *gin.Context) {
	id := c.Param("id")

	result := services.GetPlaylist(bson.M{"id": id}, nil, true)
	if result == nil {
		c.JSON(http.StatusNotFound, models.Result{Data: "Data Not Found"})
		return
	}

	c.JSON(http.StatusOK, models.Response{Data: result})
}

func UpdatePlaylist(c *gin.Context) {
	id := c.Param("id")

	Playlist := services.GetPlaylist(bson.M{"id": id}, nil, false)
	if Playlist == nil {
		c.JSON(http.StatusNotFound, models.Result{Data: "Data Not Found"})
		return
	}

	var request models.Playlist

	err := c.ShouldBindJSON(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.Response{Data: err.Error()})
		return
	}

	_, err = services.UpdatePlaylist(id, request)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.Response{Data: err.Error()})
		return
	}

	c.JSON(200, models.Response{Data: request})
}

func DeletePlaylist(c *gin.Context) {
	id := c.Param("id")

	_, err := services.DeletePlaylist(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.Response{Data: "Failed Delete Data"})
		return
	}

	c.JSON(http.StatusOK, models.Response{Data: "Success"})
}

func AddSongToPlaylist(c *gin.Context) {
	request := struct {
		PlaylistId string `json:"playlistId"`
		SongId     string `json:"songId"`
	}{}
	err := c.ShouldBindJSON(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.Response{Data: err.Error()})
		return
	}

	playlist := services.GetPlaylist(bson.M{"id": request.PlaylistId}, nil, false)
	if playlist == nil {
		c.JSON(http.StatusBadRequest, models.Response{Data: "Playlist Not Found"})
		return
	}

	isExist := false
	for _, val := range playlist.SongIds {
		if val == request.SongId {
			isExist = true
		}
	}

	if !isExist {
		playlist.SongIds = append(playlist.SongIds, request.SongId)
	}

	playlist.UpdatedAt = time.Now()
	services.UpdatePlaylist(playlist.Id, playlist)

	c.JSON(http.StatusOK, models.Response{Data: "Success"})
}
