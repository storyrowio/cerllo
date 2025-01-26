import Api from "utils/api";

const GetUserByQuery = (query) => {
    return Api.Instance.get('/user', {params: query})
        .then(res => res?.data?.data);
};

const GetUserById = (id) => {
    return Api.Instance.get(`/user/${id}`)
        .then(res => res?.data?.data);
};

const CreateUser = (params) => {
    return Api.Instance.post('/user', params)
        .then(res => res?.data?.data);
};

const UpdateUser = (id, params) => {
    return Api.Instance.patch(`/user/${id}`, params)
        .then(res => res?.data?.data);
};

const DeleteUser = (ids) => {
    return Api.Instance.delete(`/user/${ids}`)
        .then(res => res?.data?.data);
};

const UserService = {
    GetUserByQuery,
    GetUserById,
    CreateUser,
    UpdateUser,
    DeleteUser
};

export default UserService;