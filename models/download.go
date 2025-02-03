package models

type ConvertYoutubeRequest struct {
	Url    string `json:"url"`
	Format string `json:"format"`
}
