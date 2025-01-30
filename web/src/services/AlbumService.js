import Api from "utils/api";
import {ALBUM_API} from "constants/api";

const GetAlbumByQuery = (query) => {
    return Api.Instance.get(ALBUM_API, {params: query})
        .then(res => res?.data?.data);
};

const GetAlbumById = (id) => {
    return Api.Instance.get(`${ALBUM_API}/${id}`)
        .then(res => res?.data?.data);
};

const CreateAlbum = (id) => {
    return Api.Instance.post(ALBUM_API)
        .then(res => res?.data?.data);
};

const UpdateAlbum = (id, params) => {
    return Api.Instance.patch(`${ALBUM_API}/${id}`, params)
        .then(res => res?.data?.data);
};

const DeleteAlbum = (ids) => {
    return Api.Instance.delete(`${ALBUM_API}/${ids}`)
        .then(res => res?.data?.data);
};

const AlbumService = {
    GetAlbumByQuery,
    GetAlbumById,
    CreateAlbum,
    UpdateAlbum,
    DeleteAlbum
};

export default AlbumService;
