import apiClient from '@src/services/apiClient'
import * as paths from '@src/configs/pathConfig'
import { commonUtil } from '@src/utils'

export const updateUserProfileLayout = ({ profileData, excelFileList }) => {
  const headers = commonUtil.getAuthHeaders()
  const formData = new window.FormData()
  
  excelFileList.forEach((fileData) => {
    formData.append('excelFileList', fileData);
  })
  formData.append('profileData',  JSON.stringify(profileData))

  return apiClient.patch(
    paths.updateUserProfileLayout(),
    formData,
    headers
  )
}
