import axios from 'axios';

// Get API base URL and configure for development mode
const baseURL = import.meta.env.VITE_API_URL || '/api';
// Use the base URL for files as well, assuming it's the domain + /uploads
// We strip /api to get the root domain where uploads are hosted
const API_ROOT = baseURL.replace('/api', '');

export const api = axios.create({
  baseURL,
  withCredentials: true, // Important for cookies
});

// Helper for file URLs
export function getFileUrl(path: string | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  let normalizedPath = path;
  if (!normalizedPath.startsWith('/storage/') && !normalizedPath.startsWith('storage/')) {
    normalizedPath = normalizedPath.startsWith('/') ? `/storage${normalizedPath}` : `/storage/${normalizedPath}`;
  } else if (normalizedPath.startsWith('storage/')) {
    normalizedPath = `/${normalizedPath}`;
  }
  
  return `${API_ROOT}${normalizedPath}`;
}

// Add a request interceptor to attach the token if we store it in localStorage
// (If we use HttpOnly cookies, this isn't strictly necessary, but good practice if using local token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 419) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export async function getCsrfCookie() {
  const rootURL = baseURL.replace(/\/api\/?$/, '');
  await axios.get(`${rootURL}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
}
