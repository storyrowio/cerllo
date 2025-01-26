import Api from "utils/api";

const GetSettingByQuery = (query) => {
    return Api.Instance.get('/setting', {params: query})
        .then(res => {
            return res?.data?.data
        });
};

const GetSettingById = (id) => {
    return Api.Instance.get(`/setting/${id}`)
        .then(res => res?.data?.data);
};

const CreateSetting = (id) => {
    return Api.Instance.post('/setting')
        .then(res => res?.data?.data);
};

const UpdateSetting = (id, params) => {
    return Api.Instance.patch(`/setting/${id}`, params)
        .then(res => res?.data?.data);
};

const DeleteSetting = (ids) => {
    return Api.Instance.delete(`/setting/${ids}`)
        .then(res => res?.data?.data);
};

const SettingService = {
    GetSettingByQuery,
    GetSettingById,
    CreateSetting,
    UpdateSetting,
    DeleteSetting
};

export default SettingService;