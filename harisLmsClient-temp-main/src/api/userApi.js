// staffApi.js or userApi.js

import axiosInstance from '../axiosInstance'; // Assuming you have a configured axios instance

export const getLoggedInUserData = async () => {
    try {
        const response = await axiosInstance.get('/user/me'); // Adjust the endpoint to match your API
        return response.data;
    } catch (error) {
        console.error('Error fetching logged-in user data:', error);
        throw error;
    }
};
