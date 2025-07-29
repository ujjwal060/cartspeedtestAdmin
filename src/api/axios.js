import axios from 'axios';

const instance = axios.create({
  baseURL:'http://54.205.149.77:9090/api',
  // baseURL:'http://localhost:9090/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;