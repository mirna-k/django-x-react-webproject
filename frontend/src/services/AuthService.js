import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN);

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN);

export const setAccessToken = (token) => localStorage.setItem(ACCESS_TOKEN, token);

export const refreshToken = async () => {
    const refreshToken = getRefreshToken();
    try {
        const response = await axios.post('/api/token/refresh/', { refresh: refreshToken });
        if (response.status === 200) {
            setAccessToken(response.data.access);
            return response.data.access;
        } else {
            throw new Error('Failed to refresh token');
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        return null;
    }
};

export const fetchUser = async () => {
    const accessToken = getAccessToken();
    try {
        const response = await axios.get('/api/user/', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
};
