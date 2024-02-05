import apiClient from '@src/services/apiClient'
import * as paths from '@src/configs/pathConfig'
import { commonUtil } from '@src/utils'

export const getUserProfileLayout = () => {
  const headers = commonUtil.getAuthHeaders()
  return apiClient.get(
    paths.getUserProfileLayout(),
    headers
  )
}
