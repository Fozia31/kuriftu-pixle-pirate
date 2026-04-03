import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://kuriftu-pixle-pirate.onrender.com/api',
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
