import axios from 'axios';

// Tạo instance axios
const apiClient = axios.create({
    baseURL: '/api', // Thay đổi nếu backend của bạn ở domain khác
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Thêm interceptor để tự động thêm token nếu có
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Xử lý lỗi trả về từ server
apiClient.interceptors.response.use(
    response => response.data,
    error => {
        // Có thể xử lý global lỗi tại đây, ví dụ: thông báo lỗi 401, 500
        if (error.response) {
            console.error('Lỗi API:', error.response.data);
        } else {
            console.error('Lỗi mạng:', error.message);
        }
        return Promise.reject(error);
    }
);

// Hàm gọi API
const api = {
    get: (url, params = {}) => apiClient.get(url, { params }),
    post: (url, data = {}) => apiClient.post(url, data),
    put: (url, data = {}) => apiClient.put(url, data),
    del: (url) => apiClient.delete(url),
};

export default api;
