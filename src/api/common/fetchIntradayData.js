import apiClient from '@src/services/apiClient'
import * as paths from '@src/configs/pathConfig'
import { commonUtil } from '@src/utils'
import {
  SEARCH
} from '@src/constants/values'

export const fetchIntradayData = ({ stock, curve }) => {
  const headers = commonUtil.getAuthHeaders({ curve })
  return apiClient.post(
    paths.fetchIntradayData(stock),
    headers
  )
}
