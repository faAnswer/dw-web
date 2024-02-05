
const singleStockPageData = {
  id: 1,
  profilePickerOptionList: [],
  lastUsedProfile: '',
  profileDataList: [],
  profileData: null,
  layout: [],
  uploadedExcelDataList: [],
  uploadedExcelData: {},
  apiResponse: {
    info: null,
    analyticData: null,
    optimizedParamsRawData: null,
    volumeCurveRawData: null,
    spreadCurveRawData: null,
    volatilityCurveRawData: null,
    marketConditionRawData: null,
    optimizedParamsReponseErrorMsg: null
  },
  processData: {
    optimizedParamsData: null,
    marketConditionData: null,
    tradeSchedueData: null,
    tradeSchedueDayOptionList: [],
    volumeCurveData: null,
    spreadCurveData: null,
    volatilityCurveData: null,
  },
  marketCondition: {
    input: {
      marketConditionType: 'accum'
    }
  },
  tradeScheduleEstimate: {
    input: {
      time: '15',
      startTime: null
    }
  },
  params: {
    intraday: {
      activeCurve: 'VOLUME',
      time: '15'
    },
    tradeEstimate: {
      time: '15',
      day: '',
      startTime: ''
    },
    pageReady: {
      isSinglePageReady: false,
      isSingleStockOptimizedGridShow: false
    }
  }
}

export default singleStockPageData