import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const signup = async (userData) => {
    return await axios.post(`${API_URL}signup/`, userData);
};

export const login = async (credentials) => {
    return await axios.post(`${API_URL}login/`, credentials);
};

export const googleLogin = (token) => 
    axios.post(`${API_URL}google/`, { access_token: token });
