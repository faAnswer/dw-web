import apiClient from '@src/services/apiClient'
import * as paths from '@src/configs/pathConfig'
import { commonUtil } from '@src/utils'

export const deleteUploadedExcelFile = (fileName) => {
  const headers = commonUtil.getAuthHeaders()
  return apiClient.delete(
    paths.deleteUploadedExcelFile(fileName),
    headers
  )
}
