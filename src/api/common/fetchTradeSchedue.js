import apiClient from '@src/services/apiClient'
import * as paths from '@src/configs/pathConfig'
import { commonUtil } from '@src/utils'
import {
  SEARCH
} from '@src/constants/values'

export const fetchTradeSchedue = ({ stockInfoList }) => {
  const headers = commonUtil.getAuthHeaders()
  return apiClient.post(
    paths.fetchTradeSchedue(),
    stockInfoList,
    headers
  )
}
