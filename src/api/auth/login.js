import apiClient from '@src/services/apiClient'
import * as paths from '@src/configs/pathConfig'
import { commonUtil } from '@src/utils'

export const login = ({ userId, password }) => {
  const headers = commonUtil.getHeaders()
  return apiClient.post(
    paths.login(),
    { userId, password },
    headers
  )
}
