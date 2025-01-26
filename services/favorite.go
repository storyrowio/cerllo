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

const FavoriteCollection = "favorites"

func GetFavorites(filters bson.M, opt *options.FindOptions) []models.Favorite {
	results := make([]models.Favorite, 0)

	cursor := database.Find(FavoriteCollection, filters, opt)
	for cursor.Next(context.Background()) {
		var data models.Favorite
		if cursor.Decode(&data) == nil {
			results = append(results, data)
		}
	}

	return results
}

func GetFavoritesWithPagination(filters bson.M, opt *options.FindOptions, query models.Query) models.Result {
	results := GetFavorites(filters, opt)

	count := database.Count(FavoriteCollection, filters)
	pagination := query.GetPagination(count)

	result := models.Result{
		Data:       results,
		Pagination: pagination,
		Query:      query,
	}

	return result
}

func CreateFavorite(params models.Favorite) (bool, error) {
	_, err := database.InsertOne(FavoriteCollection, params)
	if err != nil {
		return false, err
	}

	return true, nil
}

func GetFavorite(filter bson.M, opts *options.FindOneOptions) *models.Favorite {
	var data models.Favorite
	err := database.FindOne(FavoriteCollection, filter, opts).Decode(&data)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil
		}
		return nil
	}
	return &data
}

func UpdateFavorite(id string, params interface{}) (*mongo.UpdateResult, error) {
	filters := bson.M{"id": id}

	res, err := database.UpdateOne(FavoriteCollection, filters, params)

	if res == nil {
		return nil, err
	}

	return res, nil
}

func DeleteFavorite(id string) (*mongo.DeleteResult, error) {
	filter := bson.M{"id": id}

	res, err := database.DeleteOne(FavoriteCollection, filter)

	if res == nil {
		return nil, err
	}

	return res, nil
}

func CreateManyFavorite(params []models.Favorite) (bool, error) {
	data := make([]interface{}, 0)
	for _, val := range params {
		val.CreatedAt = time.Now()
		val.UpdatedAt = time.Now()
		data = append(data, val)
	}

	_, err := database.InsertMany(FavoriteCollection, data)
	if err != nil {
		return false, err
	}

	return true, nil
}
