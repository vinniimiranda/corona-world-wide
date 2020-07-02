import axios from 'axios';

const api = axios.create({
  baseURL: 'https://corona-world-wide-api.herokuapp.com/',
});

export default api;
