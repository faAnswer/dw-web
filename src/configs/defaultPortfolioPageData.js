const PortfolioPageData = {
  id: 2,
  layout: [],
  profilePickerOptionList: [],
  lastUsedProfile: '',
  profileDataList: [],
  profileData: null,
  profileInput: {},
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
    allOptimizedParamsData: [],
    marketConditionData: null,
    tradeSchedueData: null,
    tradeSchedueAllDaysData: null,
    tradeSchedueDayOptionList: [],
    volumeCurveData: null,
    spreadCurveData: null,
    volatilityCurveData: null,
    portfolioBreakdownData: null,
    porfolioSummaryData: null
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
  tradeDetailTableConfig: {
    columnOrderList: [],
    columnVisibility: {},
    sorting: []
  },
  params: {
    optimizedParam: {
      stock: ''
    },
    portfolioBreakdown: {
      group: 'adv'
    },
    intraday: {
      activeCurve: 'VOLUME',
      time: '15',
      stock: ''
    },
    tradeEstimate: {
      time: '15',
      day: '',
      startTime: '',
      stock: ''
    },
    pageReady: {
      isPortfolioPageReady: false,
      isPortfolioOptimizedGridShow: false
    }
  }
}

export default PortfolioPageData