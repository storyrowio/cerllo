package main

import (
	"cerllo/config"
	"cerllo/controllers"
	"cerllo/database"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
	"net/http"
	"os"
	"time"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file, will use system environment")
	}

	log.Println("Version: ", os.Getenv("VERSION"))

	if !database.Init() {
		log.Printf("Connected to MongoDB URI: Failure")
		return
	}

	router := gin.New()
	router.Use(gin.Logger())

	router.Use(static.Serve("/", static.LocalFile("./web/dist", true)))

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true
	corsConfig.AllowMethods = []string{"POST", "GET", "PATCH", "OPTIONS", "DELETE"}
	corsConfig.AllowHeaders = []string{"Origin", "Content-Type", "Authorization", "Accept", "User-Agent", "Cache-Control", "Pragma"}
	corsConfig.ExposeHeaders = []string{"Content-Length"}
	corsConfig.AllowCredentials = true
	corsConfig.MaxAge = 12 * time.Hour
	router.Use(cors.New(corsConfig))

	api := router.Group("/api")
	{
		api.GET("/version", func(c *gin.Context) {
			c.JSON(http.StatusOK, "Cerllo v1.0.0")
			return
		})

		api.GET("/default", controllers.CreateDefaultData)

		api.GET("/env/:key", controllers.GetServerEnv)
		api.POST("/register", controllers.SignUp)
		api.POST("/login", controllers.SignIn)
		api.GET("/refresh-token", controllers.RefreshToken)
		api.POST("/activate", controllers.Activate)
		api.POST("/forgot-password", controllers.ForgotPassword)
		api.PATCH("/update-password", controllers.UpdatePassword)

		api.GET("/artist", controllers.GetArtists)
		api.GET("/artist/:id", controllers.GetArtistById)
		api.GET("/album", controllers.GetAlbums)
		api.GET("/album/:id", controllers.GetAlbumById)
		api.GET("/song", controllers.GetSongs)
		api.GET("/song/:id", controllers.GetSongById)

		protected := api.Group("/", config.AuthMiddleware())
		{
			protected.GET("/profile", controllers.GetProfile)
			protected.PATCH("/profile", controllers.UpdateProfile)

			protected.POST("/upload", controllers.UploadFile)
			protected.DELETE("/destroy/:ids", controllers.DestroyFile)

			protected.POST("/artist", controllers.CreateArtist)
			protected.POST("/artist/multiple", controllers.CreateManyArtist)
			protected.PATCH("/artist/:id", controllers.UpdateArtist)
			protected.DELETE("/artist/:id", controllers.DeleteArtist)

			protected.POST("/album", controllers.CreateAlbum)
			protected.POST("/album/multiple", controllers.CreateManyAlbum)
			protected.PATCH("/album/:id", controllers.UpdateAlbum)
			protected.DELETE("/album/:id", controllers.DeleteAlbum)

			protected.GET("/favorite", controllers.GetFavorites)
			protected.POST("/favorite", controllers.CreateFavorite)
			protected.GET("/favorite/:id", controllers.GetFavoriteById)
			protected.PATCH("/favorite/:id", controllers.UpdateFavorite)
			protected.DELETE("/favorite/:id", controllers.DeleteFavorite)

			protected.GET("/playlist", controllers.GetPlaylists)
			protected.POST("/playlist", controllers.CreatePlaylist)
			protected.GET("/playlist/:id", controllers.GetPlaylistById)
			protected.PATCH("/playlist/:id", controllers.UpdatePlaylist)
			protected.DELETE("/playlist/:id", controllers.DeletePlaylist)

			protected.GET("/role", controllers.GetRoles)
			protected.POST("/role", controllers.CreateRole)
			protected.GET("/role/:id", controllers.GetRoleById)
			protected.PATCH("/role/:id", controllers.UpdateRole)
			protected.DELETE("/role/:id", controllers.DeleteRole)
			protected.POST("/role/attach-permission", controllers.AttachPermissionsToRole)

			protected.POST("/song", controllers.CreateSong)
			protected.POST("/song/multiple", controllers.CreateManySong)
			protected.PATCH("/song/:id", controllers.UpdateSong)
			protected.DELETE("/song/:id", controllers.DeleteSong)

			protected.GET("/user", controllers.GetUsers)
			protected.POST("/user", controllers.CreateUser)
			protected.GET("/user/:id", controllers.GetUserById)
			protected.PATCH("/user/:id", controllers.UpdateUser)
			protected.DELETE("/user/:id", controllers.DeleteUser)
		}
	}

	port := "8000"
	if os.Getenv("PORT") != "" {
		port = os.Getenv("PORT")
	}

	err = router.Run(":" + port)
	if err != nil {
		return
	}
}
