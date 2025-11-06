import axios from 'axios'

const apiBaseURL = import.meta.env.VITE_API_BASE_URL || '/api'

const client = axios.create({ 
  baseURL: apiBaseURL,
  withCredentials: false
})

export default client
