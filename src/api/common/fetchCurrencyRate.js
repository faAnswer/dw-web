import apiClient from '@src/services/apiClient'
import * as paths from '@src/configs/pathConfig'
import { commonUtil } from '@src/utils'

export const fetchCurrencyRate = () => {
  const headers = commonUtil.getAuthHeaders()
  return apiClient.get(
    paths.fetchCurrencyRate(),
    headers
  )
}
