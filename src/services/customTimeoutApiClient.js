import axios from 'axios'
import envConfig from '@src/configs/envConfig'

const customTimeoutApiClient = ({ timeout }) => {
  const apiClient = axios.create({
    timeoutErrorMessage: 'API Timeout',
    baseURL: envConfig.baseURL,
    timeout: timeout
  })

  apiClient.interceptors.response.use(
    response => {
      return response.data
    },
    error => {

      if(error.message === 'API Timeout'){

        throw error.message
      }

      if (!error.response) {
        throw 'Error: Network Error'
      } else {
        if (error.response.data.errors) {
          throw error.response.data.errors.message
        }
        throw error.response.data.message
      }
    }
  )
  return apiClient
}

export default customTimeoutApiClient
