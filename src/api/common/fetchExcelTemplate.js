import apiClient from '@src/services/apiClient'
import * as paths from '@src/configs/pathConfig'
import { commonUtil } from '@src/utils'

export const fetchExcelTemplate = (type) => {
  const headers = commonUtil.getAuthHeaders()
  headers.responseType = 'blob'
  return apiClient.get(
    paths.fetchExcelTemplate(type),
    headers
  )
}
