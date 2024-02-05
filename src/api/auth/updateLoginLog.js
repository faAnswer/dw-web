import apiClient from '@src/services/apiClient'
import * as paths from '@src/configs/pathConfig'
import { commonUtil } from '@src/utils'

export const updateLoginLog = ({ userId }) => {
  const headers = commonUtil.getAuthHeaders()
  return apiClient.patch(
    paths.updateLoginLog(userId),
    null,
    headers
  )
}
