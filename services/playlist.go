package services

import (
	"cerllo/database"
	"cerllo/models"
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"time"
)

const PlaylistCollection = "playlists"

func GetPlaylists(filters bson.M, opt *options.FindOptions) []models.Playlist {
	results := make([]models.Playlist, 0)

	cursor := database.Find(PlaylistCollection, filters, opt)
	for cursor.Next(context.Background()) {
		var data models.Playlist
		if cursor.Decode(&data) == nil {
			results = append(results, data)
		}
	}

	return results
}

func GetPlaylistsWithPagination(filters bson.M, opt *options.FindOptions, query models.Query) models.Result {
	results := GetPlaylists(filters, opt)

	count := database.Count(PlaylistCollection, filters)
	pagination := query.GetPagination(count)

	result := models.Result{
		Data:       results,
		Pagination: pagination,
		Query:      query,
	}

	return result
}

func CreatePlaylist(params models.Playlist) (bool, error) {
	_, err := database.InsertOne(PlaylistCollection, params)
	if err != nil {
		return false, err
	}

	return true, nil
}

func GetPlaylist(filter bson.M, opts *options.FindOneOptions, withDetails bool) *models.Playlist {
	var data models.Playlist
	err := database.FindOne(PlaylistCollection, filter, opts).Decode(&data)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil
		}
		return nil
	}

	songs := make([]models.Song, 0)
	if data.SongIds != nil {
		songs = GetSongs(bson.M{"id": bson.M{
			"$in": data.SongIds,
		}}, nil, true)
	}

	data.Songs = songs

	return &data
}

func UpdatePlaylist(id string, params interface{}) (*mongo.UpdateResult, error) {
	filters := bson.M{"id": id}

	res, err := database.UpdateOne(PlaylistCollection, filters, params)

	if res == nil {
		return nil, err
	}

	return res, nil
}

func DeletePlaylist(id string) (*mongo.DeleteResult, error) {
	filter := bson.M{"id": id}

	res, err := database.DeleteOne(PlaylistCollection, filter)

	if res == nil {
		return nil, err
	}

	return res, nil
}

func CreateManyPlaylist(params []models.Playlist) (bool, error) {
	data := make([]interface{}, 0)
	for _, val := range params {
		val.CreatedAt = time.Now()
		val.UpdatedAt = time.Now()
		data = append(data, val)
	}

	_, err := database.InsertMany(PlaylistCollection, data)
	if err != nil {
		return false, err
	}

	return true, nil
}
