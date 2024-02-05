import customTimeoutApiClient from '@src/services/customTimeoutApiClient'
import envConfig from '@src/configs/envConfig'

import * as paths from '@src/configs/pathConfig'
import { commonUtil } from '@src/utils'

export const fetchAnalytic = ({ stockInfoList }) => {
  const timeout = stockInfoList.length * envConfig.apiTimeoutPerStock
  const apiClient = customTimeoutApiClient({ timeout })

  const headers = commonUtil.getAuthHeaders()
  return apiClient.post(
    paths.fetchAnalytic(),
    stockInfoList,
    headers
  )
}
