// axiosInstance
import axios from 'axios';
import { auth } from '@strapi/helper-plugin';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

instance.interceptors.request.use(
  async config => {
    config.headers = {
      Authorization: `Bearer ${await auth.getToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default instance;