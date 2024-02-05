import apiClient from '@src/services/apiClient'
import * as paths from '@src/configs/pathConfig'
import { commonUtil } from '@src/utils'

export const fetchShareLink = ({ data }) => {
  const headers = commonUtil.getAuthHeaders()
  return apiClient.post(
    paths.fetchShareLink(),
    { data: data },
    headers
  )
}
