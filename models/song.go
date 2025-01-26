package models

type Artist struct {
	Id        string `json:"id"`
	Name      string `json:"name"`
	Image     string `json:"image"`
	BasicDate `bson:",inline"`
}

type Album struct {
	Id          string `json:"id"`
	Title       string `json:"title"`
	ArtistId    string `json:"artistId" bson:"artistId"`
	ReleaseDate string `json:"releaseDate" bson:"releaseDate"`
	Image       string `json:"image"`
	BasicDate   `bson:",inline"`
}

type Song struct {
	Id        string `json:"id"`
	Title     string `json:"title"`
	ArtistId  string `json:"artistId" bson:"artistId"`
	AlbumId   string `json:"albumId" bson:"albumId"`
	Url       string `json:"url" bson:"url"`
	Artist    Artist `json:"artist" bson:"-"`
	Album     Album  `json:"album" bson:"-"`
	BasicDate `bson:",inline"`
}

type Playlist struct {
	Id        string   `json:"id"`
	UserId    string   `json:"userId" bson:"userId"`
	Name      string   `json:"name"`
	SongIds   []string `json:"songIds" bson:"songIds"`
	Songs     []Song   `json:"songs" bson:"-"`
	BasicDate `bson:",inline"`
}

type Favorite struct {
	Id        string   `json:"id"`
	UserId    string   `json:"userId"`
	SongIds   []string `json:"songIds" bson:"songIds"`
	Songs     []Song   `json:"songs" bson:"-"`
	BasicDate `bson:",inline"`
}
