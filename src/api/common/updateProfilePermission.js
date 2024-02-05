import apiClient from '@src/services/apiClient'
import * as paths from '@src/configs/pathConfig'
import { commonUtil } from '@src/utils'

export const updateProfilePermission = ({ profileName, profilePermissionStatus }) => {
  const headers = commonUtil.getAuthHeaders()
  return apiClient.patch(
    paths.updateProfilePermission(),
    { profileName, profilePermissionStatus },
    headers
  )
}
