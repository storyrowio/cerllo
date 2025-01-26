import Api from "utils/api";
import {SONG_API} from "constants/api";

const GetSongByQuery = (query) => {
    return Api.Instance.get(SONG_API, {params: query})
        .then(res => res?.data?.data);
};

const GetSongById = (id) => {
    return Api.Instance.get(`${SONG_API}/${id}`)
        .then(res => res?.data?.data);
};

const CreateSong = (id) => {
    return Api.Instance.post(SONG_API)
        .then(res => res?.data?.data);
};

const UpdateSong = (id, params) => {
    return Api.Instance.patch(`${SONG_API}/${id}`, params)
        .then(res => res?.data?.data);
};

const DeleteSong = (ids) => {
    return Api.Instance.delete(`${SONG_API}/${ids}`)
        .then(res => res?.data?.data);
};

const SongService = {
    GetSongByQuery,
    GetSongById,
    CreateSong,
    UpdateSong,
    DeleteSong
};

export default SongService;
