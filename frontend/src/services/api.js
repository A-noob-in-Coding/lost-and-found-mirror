import axios from 'axios';
import { supabase } from '../config/supabaseClient';

const API_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: API_URL,
});

API.interceptors.request.use(
  async (config) => {
    try {
      const pathname = window.location.pathname;
      const isAdminPage = pathname === '/ch3rryr3d';
      
      // Only use admin token when on admin page
      if (isAdminPage) {
        const adminToken = localStorage.getItem('adminToken');
        if (adminToken) {
          config.headers.Authorization = `Bearer ${adminToken}`;
        }
      } else {
        // Use Supabase session for regular users
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect to login if on admin page (has its own auth) or login/register pages
      const pathname = window.location.pathname;
      const isAdminPage = pathname === '/ch3rryr3d';
      const isAuthPage = pathname === '/login' || pathname === '/register';
      if (!isAdminPage && !isAuthPage) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
