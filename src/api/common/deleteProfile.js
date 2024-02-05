import apiClient from '@src/services/apiClient'
import * as paths from '@src/configs/pathConfig'
import { commonUtil } from '@src/utils'

export const deleteProfile = (profileName) => {
  const headers = commonUtil.getAuthHeaders()
  return apiClient.delete(
    paths.deleteProfile(profileName),
    headers
  )
}
