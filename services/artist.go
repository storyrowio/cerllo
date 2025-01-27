package services

import (
	"cerllo/database"
	"cerllo/models"
	"context"
	"errors"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"time"
)

const ArtistCollection = "artists"

func GetArtists(filters bson.M, opt *options.FindOptions) []models.Artist {
	results := make([]models.Artist, 0)

	cursor := database.Find(ArtistCollection, filters, opt)
	for cursor.Next(context.Background()) {
		var data models.Artist
		if cursor.Decode(&data) == nil {
			results = append(results, data)
		}
	}

	return results
}

func GetArtistsWithPagination(filters bson.M, opt *options.FindOptions, query models.Query) models.Result {
	results := GetArtists(filters, opt)

	count := database.Count(ArtistCollection, filters)
	pagination := query.GetPagination(count)

	result := models.Result{
		Data:       results,
		Pagination: pagination,
		Query:      query,
	}

	return result
}

func CreateArtist(params models.Artist) (bool, error) {
	_, err := database.InsertOne(ArtistCollection, params)
	if err != nil {
		return false, err
	}

	return true, nil
}

func GetArtist(filter bson.M, opts *options.FindOneOptions) *models.Artist {
	var data models.Artist
	err := database.FindOne(ArtistCollection, filter, opts).Decode(&data)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil
		}
		return nil
	}
	return &data
}

func UpdateArtist(id string, params interface{}) (*mongo.UpdateResult, error) {
	filters := bson.M{"id": id}

	res, err := database.UpdateOne(ArtistCollection, filters, params)

	if res == nil {
		return nil, err
	}

	return res, nil
}

func DeleteArtist(id string) (*mongo.DeleteResult, error) {
	filter := bson.M{"id": id}

	res, err := database.DeleteOne(ArtistCollection, filter)

	if res == nil {
		return nil, err
	}

	return res, nil
}

func CreateManyArtist(params []models.Artist) (bool, error) {
	data := make([]interface{}, 0)
	for _, val := range params {
		val.Id = uuid.New().String()
		val.CreatedAt = time.Now()
		val.UpdatedAt = time.Now()
		data = append(data, val)
	}

	_, err := database.InsertMany(ArtistCollection, data)
	if err != nil {
		return false, err
	}

	return true, nil
}
