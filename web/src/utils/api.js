import axios from "axios";
import AppStorage from "utils/storage";

const Instance = axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? process.env.API_URL : '/api'
});

Instance.interceptors.request.use(
    async (config) => {
        const token = await AppStorage.GetItem('x-token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)


const Api = {
    Instance
}

export default Api;
