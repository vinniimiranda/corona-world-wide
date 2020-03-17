import axios from 'axios';

const api = axios.create({
  baseURL: 'https://thevirustracker.com/free-api',
});

export default api;
