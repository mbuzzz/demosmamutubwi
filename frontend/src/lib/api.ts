import axios from 'axios';

// Get base URL from env
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create Axios instance
export const api = axios.create({
  baseURL,
  withCredentials: true, // Send cookies with requests
  withXSRFToken: true,   // Automatically read XSRF-TOKEN cookie and send as X-XSRF-TOKEN header
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Function to fetch CSRF cookie before login
export async function getCsrfCookie() {
  // Sanctum CSRF cookie is outside the /api prefix, at the root domain
  const rootURL = baseURL.replace(/\/api\/?$/, '');
  await axios.get(`${rootURL}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
}
