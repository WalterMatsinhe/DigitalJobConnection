import axios from 'axios'

// Determine API base URL based on environment
const getApiBaseURL = () => {
  // In development (Vite), use the env variable
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'
  }
  // In production (Vercel), use the same domain's /api endpoint
  return '/api'
}

const apiBaseURL = getApiBaseURL()

const client = axios.create({ 
  baseURL: apiBaseURL,
  withCredentials: false
})

export default client
