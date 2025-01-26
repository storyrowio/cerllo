import Api from "utils/api";
import AppStorage from "utils/storage";

const Login = (params) => {
    return Api.Instance.post('/login', params)
        .then(res => {
            AppStorage.SetItem('x-token', res.data?.data?.token);
            return res
        });
};

const Register = (params) => {
    return Api.Instance.post('/register', params)
        .then(res => {
            AppStorage.SetItem('x-token', res.data?.data?.token);
            return res
        });
};

const GetProfile = () => {
    return Api.Instance.get('/profile').then(res => res.data?.data);
};

const Logout = () => {
    return AppStorage.RemoveItem('x-token');
};

const UpdatePassword = async (params) => {
    params.token = await AppStorage.GetItem('x-token');
    return Api.Instance.post('/update-password', params);
};

const AuthService = {
    Login,
    Register,
    GetProfile,
    Logout,
    UpdatePassword
}

export default AuthService;
