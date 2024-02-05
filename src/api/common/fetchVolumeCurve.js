import customTimeoutApiClient from '@src/services/customTimeoutApiClient'
import * as paths from '@src/configs/pathConfig'
import { commonUtil } from '@src/utils'
import envConfig from '@src/configs/envConfig'

import {
  SEARCH
} from '@src/constants/values'

export const fetchVolumeCurve = ({ stockInfoList }) => {
  const timeout = stockInfoList.length * envConfig.apiTimeoutPerStock
  const apiClient = customTimeoutApiClient({ timeout })
  const headers = commonUtil.getAuthHeaders()
  return apiClient.post(
    paths.fetchVolumeCurve(),
    stockInfoList,
    headers
  )
}
