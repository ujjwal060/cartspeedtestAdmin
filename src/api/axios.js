import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:9090/api',
  // baseURL:'http://3.223.253.106:9090/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;