const axios = require('axios');

async function test() {
  const api = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
    headers: {
      'Origin': 'http://localhost:5173',
      'Referer': 'http://localhost:5173/'
    }
  });
  
  try {
    const csrf = await api.get('/sanctum/csrf-cookie');
    const rawCookies = csrf.headers['set-cookie'];
    
    let xsrfToken = '';
    let cookieStr = [];
    rawCookies.forEach(c => {
      const parts = c.split(';');
      const kv = parts[0];
      cookieStr.push(kv);
      if (kv.startsWith('XSRF-TOKEN=')) {
        xsrfToken = kv.split('=')[1];
      }
    });
    
    xsrfToken = decodeURIComponent(xsrfToken);

    const loginRes = await api.post('/api/login', {
      username: 'admin',
      password: '1234'
    }, {
      headers: {
        'Cookie': cookieStr.join('; '),
        'X-XSRF-TOKEN': xsrfToken
      }
    });
    console.log('Login Status:', loginRes.status);
    console.log('Login Data:', loginRes.data);
    
  } catch (err) {
    if (err.response) {
      console.error('Error Status:', err.response.status);
      console.error('Error Data:', err.response.data);
    } else {
      console.error(err.message);
    }
  }
}

test();
