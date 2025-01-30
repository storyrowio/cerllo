import Api from "utils/api";
import {ARTIST_API} from "constants/api";

const GetArtistByQuery = (query) => {
    return Api.Instance.get(ARTIST_API, {params: query})
        .then(res => res?.data?.data);
};

const GetArtistById = (id) => {
    return Api.Instance.get(`${ARTIST_API}/${id}`)
        .then(res => res?.data?.data);
};

const CreateArtist = (id) => {
    return Api.Instance.post(ARTIST_API)
        .then(res => res?.data?.data);
};

const UpdateArtist = (id, params) => {
    return Api.Instance.patch(`${ARTIST_API}/${id}`, params)
        .then(res => res?.data?.data);
};

const DeleteArtist = (ids) => {
    return Api.Instance.delete(`${ARTIST_API}/${ids}`)
        .then(res => res?.data?.data);
};

const ArtistService = {
    GetArtistByQuery,
    GetArtistById,
    CreateArtist,
    UpdateArtist,
    DeleteArtist
};

export default ArtistService;
