import axios from 'axios'
import envConfig from '@src/configs/envConfig'

const apiClient = axios.create({
  baseURL: envConfig.baseURL,
  timeoutErrorMessage: 'API Timeout',
  timeout: 90000
})

apiClient.interceptors.response.use(
  response => {
    return response.data
  },
  (error) => {

    if(error.message === 'API Timeout'){

      throw error.message
    }

    if (error.response) {
      throw error.response.data.message
    } else {
      throw 'Node API Call Fail'
    }
  }
)

export default apiClient
