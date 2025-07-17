import axios from 'axios';

const instance = axios.create({
  baseURL:'http://98.82.228.18:9090/api',
  // baseURL:'http://localhost:9090/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;