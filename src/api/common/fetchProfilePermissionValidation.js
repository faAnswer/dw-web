import apiClient from '@src/services/apiClient'
import * as paths from '@src/configs/pathConfig'
import { commonUtil } from '@src/utils'

export const fetchProfilePermissionValidation = ({ userId, profileName }) => {
  const headers = commonUtil.getAuthHeaders()
  return apiClient.post(
    paths.fetchProfilePermissionValidation(),
    { userId, profileName },
    headers
  )
}
