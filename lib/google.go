package lib

import (
	"context"
	"fmt"
	"golang.org/x/oauth2"
	"google.golang.org/api/drive/v3"
	"google.golang.org/api/option"
)

func GetOrCreateDefaultFolder(token string) (*string, error) {
	srv, err := drive.NewService(context.Background(), option.WithTokenSource(oauth2.StaticTokenSource(&oauth2.Token{AccessToken: token})))
	if err != nil {
		return nil, err
	}

	folderName := "darby"

	query := fmt.Sprintf("name = '%s' and mimeType = 'application/vnd.google-apps.folder' and trashed = false", folderName)
	r, err := srv.Files.List().Q(query).Do()
	if err != nil {
		return nil, fmt.Errorf("unable to search for folder: %v", err)
	}

	if len(r.Files) > 0 {
		return &r.Files[0].Id, nil
	}

	folderMetadata := &drive.File{
		Name:     folderName,
		MimeType: "application/vnd.google-apps.folder",
	}
	folder, err := srv.Files.Create(folderMetadata).Do()
	if err != nil {
		return nil, fmt.Errorf("unable to create folder: %v", err)
	}

	return &folder.Id, nil
}
