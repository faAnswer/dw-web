import apiClient from '@src/services/apiClient'
import * as paths from '@src/configs/pathConfig'
import { commonUtil } from '@src/utils'
import { getLocalStorage } from '@src/utils/commonUtil'

export const createActionLoggerRecord = ({ action, msg }) => {
  const headers = commonUtil.getAuthHeaders()
  const userId = getLocalStorage('userId')

  return apiClient.post(
    paths.createActionLoggerRecord(),
    { userId, action, msg },
    headers
  )
}
