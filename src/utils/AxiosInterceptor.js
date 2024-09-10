import axios from 'axios';
import { useSession } from 'next-auth/react';

const useAxios = () => {
  const { data: session } = useSession();

  const axiosInstance = axios.create({
    baseURL: process.env.API_URL,
  });

  // Add a request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      // If the user is authenticated, add the token to the request headers
      if (session?.token) {
        config.headers.Authorization = `Bearer ${session.token}`;
      }
      return config;
    },
    (error) => {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  // You can also add response interceptors if needed
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle errors like token expiration, etc.
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxios;
