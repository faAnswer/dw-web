import apiClient from '@src/services/apiClient'
import * as paths from '@src/configs/pathConfig'
import { commonUtil } from '@src/utils'

export const fetchInfo = ({ stockInfoList }) => {
  const headers = commonUtil.getAuthHeaders()
  return apiClient.post(
    paths.fetchInfo(),
    stockInfoList,
    headers
  )
}
