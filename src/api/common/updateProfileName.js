import apiClient from '@src/services/apiClient'
import * as paths from '@src/configs/pathConfig'
import { commonUtil } from '@src/utils'

export const updateProfileName = ({ newProfileName, originalProfileName }) => {
  const headers = commonUtil.getAuthHeaders()
  return apiClient.patch(
    paths.updateProfileName(originalProfileName),
    { newProfileName },
    headers
  )
}
