import Api from "utils/api";
import {ROLE_API} from "constants/api";

const GetRoleByQuery = (query) => {
    return Api.Instance.get(ROLE_API, {params: query})
        .then(res => res?.data?.data);
};

const GetRoleById = (id) => {
    return Api.Instance.get(`${ROLE_API}/${id}`)
        .then(res => res?.data?.data);
};

const CreateRole = (id) => {
    return Api.Instance.post(ROLE_API)
        .then(res => res?.data?.data);
};

const UpdateRole = (id, params) => {
    return Api.Instance.patch(`${ROLE_API}/${id}`, params)
        .then(res => res?.data?.data);
};

const DeleteRole = (ids) => {
    return Api.Instance.delete(`${ROLE_API}/${ids}`)
        .then(res => res?.data?.data);
};

const RoleService = {
    GetRoleByQuery,
    GetRoleById,
    CreateRole,
    UpdateRole,
    DeleteRole
};

export default RoleService;
