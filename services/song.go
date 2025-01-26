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

const SongCollection = "songs"

func GetSongs(filters bson.M, opt *options.FindOptions, withDetail bool) []models.Song {
	results := make([]models.Song, 0)

	cursor := database.Find(SongCollection, filters, opt)
	for cursor.Next(context.Background()) {
		var data models.Song

		if cursor.Decode(&data) == nil {
			if withDetail {
				if data.ArtistId != "" {
					artist := GetArtist(bson.M{"id": data.ArtistId}, nil)
					data.Artist = *artist
				}

				if data.AlbumId != "" {
					album := GetAlbum(bson.M{"id": data.AlbumId}, nil)
					data.Album = *album
				}
			}
			
			results = append(results, data)
		}
	}

	return results
}

func GetSongsWithPagination(filters bson.M, opt *options.FindOptions, query models.Query) models.Result {
	results := GetSongs(filters, opt, true)

	count := database.Count(SongCollection, filters)
	pagination := query.GetPagination(count)

	result := models.Result{
		Data:       results,
		Pagination: pagination,
		Query:      query,
	}

	return result
}

func CreateSong(params models.Song) (bool, error) {
	_, err := database.InsertOne(SongCollection, params)
	if err != nil {
		return false, err
	}

	return true, nil
}

func GetSong(filter bson.M, opts *options.FindOneOptions) *models.Song {
	var data models.Song
	err := database.FindOne(SongCollection, filter, opts).Decode(&data)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil
		}
		return nil
	}
	return &data
}

func UpdateSong(id string, params interface{}) (*mongo.UpdateResult, error) {
	filters := bson.M{"id": id}

	res, err := database.UpdateOne(SongCollection, filters, params)

	if res == nil {
		return nil, err
	}

	return res, nil
}

func DeleteSong(id string) (*mongo.DeleteResult, error) {
	filter := bson.M{"id": id}

	res, err := database.DeleteOne(SongCollection, filter)

	if res == nil {
		return nil, err
	}

	return res, nil
}

func CreateManySong(params []models.Song) (bool, error) {
	data := make([]interface{}, 0)
	for _, val := range params {
		val.CreatedAt = time.Now()
		val.UpdatedAt = time.Now()
		data = append(data, val)
	}

	_, err := database.InsertMany(SongCollection, data)
	if err != nil {
		return false, err
	}

	return true, nil
}
