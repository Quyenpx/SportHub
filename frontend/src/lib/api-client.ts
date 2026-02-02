import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor để tự động thêm token
apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log('[API Client] Request with token:', config.url);
            } else {
                console.log('[API Client] Request without token:', config.url);
            }
        }
        return config;
    },
    (error) => {
        console.error('[API Client] Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor để log responses
apiClient.interceptors.response.use(
    (response) => {
        console.log('[API Client] Response success:', response.config.url, response.status);
        return response;
    },
    (error) => {
        console.error('[API Client] Response error:', error.config?.url, error.response?.status);

        // Không tự động redirect - để component quyết định
        // if (error.response?.status === 401) {
        //     if (typeof window !== 'undefined') {
        //         localStorage.removeItem('access_token');
        //         window.location.href = '/login';
        //     }
        // }

        return Promise.reject(error);
    }
);

export default apiClient;

