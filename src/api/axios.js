import axios from 'axios';

const instance = axios.create({
  baseURL:'http://98.85.246.54:9090/api',
  // baseURL:'http://localhost:9090/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;