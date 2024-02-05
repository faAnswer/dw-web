import apiClient from '@src/services/apiClient'
import * as paths from '@src/configs/pathConfig'
import { commonUtil } from '@src/utils'

export const fetchExcelChartFile = ({ chartData }) => {
  const headers = commonUtil.getAuthHeaders()
  headers.responseType = 'blob'
  return apiClient.post(
    paths.fetchExcelChartFile(),
    { chartData },
    headers
  )
}

