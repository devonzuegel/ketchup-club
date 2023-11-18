import axios from 'axios'

const api = axios.create({
  baseURL: 'https://13fc-132-147-43-111.ngrok-free.app/api/v2',
})

export default api
