import axios from 'axios';

const api = axios.create({
  // Your specific ngrok development URL
  baseURL: 'https://unesoteric-nonconversably-isabell.ngrok-free.dev', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;