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

const AlbumCollection = "albums"

func GetAlbums(filters bson.M, opt *options.FindOptions) []models.Album {
	results := make([]models.Album, 0)

	cursor := database.Find(AlbumCollection, filters, opt)
	for cursor.Next(context.Background()) {
		var data models.Album
		if cursor.Decode(&data) == nil {
			results = append(results, data)
		}
	}

	return results
}

func GetAlbumsWithPagination(filters bson.M, opt *options.FindOptions, query models.Query) models.Result {
	results := GetAlbums(filters, opt)

	count := database.Count(AlbumCollection, filters)
	pagination := query.GetPagination(count)

	result := models.Result{
		Data:       results,
		Pagination: pagination,
		Query:      query,
	}

	return result
}

func CreateAlbum(params models.Album) (bool, error) {
	_, err := database.InsertOne(AlbumCollection, params)
	if err != nil {
		return false, err
	}

	return true, nil
}

func GetAlbum(filter bson.M, opts *options.FindOneOptions) *models.Album {
	var data models.Album
	err := database.FindOne(AlbumCollection, filter, opts).Decode(&data)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil
		}
		return nil
	}
	return &data
}

func UpdateAlbum(id string, params interface{}) (*mongo.UpdateResult, error) {
	filters := bson.M{"id": id}

	res, err := database.UpdateOne(AlbumCollection, filters, params)

	if res == nil {
		return nil, err
	}

	return res, nil
}

func DeleteAlbum(id string) (*mongo.DeleteResult, error) {
	filter := bson.M{"id": id}

	res, err := database.DeleteOne(AlbumCollection, filter)

	if res == nil {
		return nil, err
	}

	return res, nil
}

func CreateManyAlbum(params []models.Album) (bool, error) {
	data := make([]interface{}, 0)
	for _, val := range params {
		val.CreatedAt = time.Now()
		val.UpdatedAt = time.Now()
		data = append(data, val)
	}

	_, err := database.InsertMany(AlbumCollection, data)
	if err != nil {
		return false, err
	}

	return true, nil
}
