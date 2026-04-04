import axios from 'axios';

const apiClient = axios.create({
    baseURL: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:3000/api'
        : 'https://kuriftu-pixle-pirate.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach token to every request
apiClient.interceptors.request.use((config) => {
    const storedUser = localStorage.getItem('kuriftu_user');
    if (storedUser) {
        const { token } = JSON.parse(storedUser);
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;
