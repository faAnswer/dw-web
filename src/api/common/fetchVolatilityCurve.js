import apiClient from '@src/services/apiClient'
import * as paths from '@src/configs/pathConfig'
import { commonUtil } from '@src/utils'
import {
  SEARCH
} from '@src/constants/values'

export const fetchVolatilityCurve = ({ stockInfoList }) => {
  const headers = commonUtil.getAuthHeaders()
  return apiClient.post(
    paths.fetchVolatilityCurve(),
    stockInfoList,
    headers
  )
}
