import apiClient from '@src/services/apiClient'
import * as paths from '@src/configs/pathConfig'
import { commonUtil } from '@src/utils'

export const uploadFile = async ({ file, type }) => {
  const headers = commonUtil.getUploadHeaders()
  const formData = new window.FormData()
  formData.append('file', file)
  return await apiClient.post(
    paths.uploadFile(type),
    formData,
    headers
  )
}
