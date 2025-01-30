import Api from "utils/api";
import {PLAYLIST_API} from "constants/api";

const GetPlaylistByQuery = (query) => {
    return Api.Instance.get(PLAYLIST_API, {params: query})
        .then(res => res?.data?.data);
};

const GetPlaylistById = (id) => {
    return Api.Instance.get(`${PLAYLIST_API}/${id}`)
        .then(res => res?.data?.data);
};

const CreatePlaylist = (params) => {
    return Api.Instance.post(PLAYLIST_API, params)
        .then(res => res?.data?.data);
};

const UpdatePlaylist = (id, params) => {
    return Api.Instance.patch(`${PLAYLIST_API}/${id}`, params)
        .then(res => res?.data?.data);
};

const DeletePlaylist = (ids) => {
    return Api.Instance.delete(`${PLAYLIST_API}/${ids}`)
        .then(res => res?.data?.data);
};

const AddSongToPlaylist = (params) => {
    return Api.Instance.post(`${PLAYLIST_API}/add-song`, params)
        .then(res => res?.data?.data);
};

const PlaylistService = {
    GetPlaylistByQuery,
    GetPlaylistById,
    CreatePlaylist,
    UpdatePlaylist,
    DeletePlaylist,
    AddSongToPlaylist
};

export default PlaylistService;
