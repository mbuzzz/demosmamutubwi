import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;
if (!baseURL) {
  throw new Error('VITE_API_URL environment variable is required. Set it in .env file (e.g., http://localhost:8000/api)');
}

export const api = axios.create({
  baseURL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
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
