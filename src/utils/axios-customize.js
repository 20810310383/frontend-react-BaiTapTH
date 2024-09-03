import axios from "axios";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const instance = axios.create({
    baseURL: baseUrl,
    withCredentials: true,  // auto lưu cookie
});

instance.defaults.headers.common = { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }

const handleRefreshToken = async () => {
    try {
        const res = await instance.get('/api/v1/auth/refresh');
        console.log("res: ", res);
        if (res && res.data) {
            return res.data.access_token;
        }
        return null;
    } catch (error) {
        console.error("Failed to refresh token:", error);
        return null;
    }
}

export const handleLoginSuccess = (token) => {
    // Lưu token vào localStorage
    localStorage.setItem('access_token', token);
    // Cập nhật Authorization header cho axios instance
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // Tùy chọn: Refresh lại trang
    window.location.reload();
};

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

const NO_RETRY_HEADER = 'x-no-retry'

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response && response.data ? response.data : response;
}, async function (error) {
    console.log("đã vào");
    if (error.response) {
        console.log('Status:', error.response.status);
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.config && error.response
        && +error.response.status === 401
        && !error.config.headers[NO_RETRY_HEADER]
    ) {
        console.log('Received 401, attempting to refresh token...');
        const access_token = await handleRefreshToken();
        error.config.headers[NO_RETRY_HEADER] = 'true'
        if (access_token) {
            console.log('Token refreshed:', access_token);
            error.config.headers['Authorization'] = `Bearer ${access_token}`;
            localStorage.setItem('access_token', access_token);
            return instance.request(error.config);
        }
    }

    if (
        error.config && error.response
        && +error.response.status === 400
        && error.config.url === '/api/v1/auth/refresh'
    ) {
        if (window.location.pathname !== '/')
            window.location.href = '/login';

    }

    return error?.response?.data ?? Promise.reject(error);
});

export default instance;