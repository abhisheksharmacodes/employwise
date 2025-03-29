import axios from 'axios';

// Create an axios instance with a default base URL for all API requests
const api = axios.create({
  baseURL: 'https://reqres.in/', // Reqres API endpoint
});

export default api;
