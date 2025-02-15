import Api from "utils/api";
import AppStorage from "utils/storage";
import {AUTH_TOKEN} from "constants/storage";

const Login = (params) => {
    return Api.Instance.post('/login', params)
        .then(res => {
            AppStorage.SetItem(AUTH_TOKEN, res.data?.data?.token);
            return res
        });
};

const Register = (params) => {
    return Api.Instance.post('/register', params)
        .then(res => {
            AppStorage.SetItem(AUTH_TOKEN, res.data?.data?.token);
            return res
        });
};

const RefreshToken = () => {
    return Api.Instance.get('/refresh-token').then(res => {
        console.log(res)
        // AppStorage.SetItem(AUTH_TOKEN, res.data?.data?.token);
        // return res
    });
};

const GetProfile = () => {
    return Api.Instance.get('/profile').then(res => res.data?.data);
};

const Logout = () => {
    return AppStorage.RemoveItem(AUTH_TOKEN);
};

const UpdatePassword = async (params) => {
    params.token = await AppStorage.GetItem(AUTH_TOKEN);
    return Api.Instance.post('/update-password', params);
};

const AuthService = {
    Login,
    Register,
    RefreshToken,
    GetProfile,
    Logout,
    UpdatePassword
}

export default AuthService;
