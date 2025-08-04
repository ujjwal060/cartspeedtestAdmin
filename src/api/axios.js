import axios from 'axios';

const instance = axios.create({
  baseURL:'http://44.217.145.210:9090/api',
  // baseURL:'http://localhost:9090/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;