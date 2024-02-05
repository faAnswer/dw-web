import { observable, action, makeObservable, runInAction, computed, toJS, ObservableSet } from 'mobx'
import momentTz from 'moment-timezone'
import moment from 'moment/moment'
import { roundTo } from 'round-to'
var fileDownload = require('js-file-download')
import { commonUtil, numberValidator } from '@src/utils'
import convertCurrencyRate from '@src/utils/convertCurrencyRate'
import * as R from 'ramda'
import { portfolioApiParamsMap, layoutResizeButtonVisibleConfig } from 'src/configs/commonConfig'
import { breakdownCurveTitleMapping } from '@src/configs/portfolioBreakdown'
import { sideInputMapping } from '@src/configs/excelInputConfig'
import {
  fetchShareLinkData, fetchShareLink, fetchInputData, fetchInfo, fetchAnalytic, getUserProfileLayout, updateUserProfileLayout, saveUserProfileLayout, updateProfilePermission,
  fetchIntradayData, fetchVolumeCurve, fetchSpreadCurve, fetchVolatilityCurve, fetchCurrencyRate,
  fetchTradeSchedue, fetchAdditionalParams, fetchOptimizedParams, fetchProfilePermissionValidation,
  fetchExcelChartFile, fetchExcelTemplate, uploadFile, fetchUploadedExcelFileList, deleteUploadedExcelFile,
  deleteProfile, updateProfileName
} from '@src/api/common'
import defaultSingleStockTemplate, { excel } from '@src/configs/defaultSingleStockConfig'
import defaultSingleStockPageData from '@src/configs/defaultSingleStockPageData'
import defaultPortfolioTemplate from '@src/configs/defaultPortfolioConfig'
import defaultPortfolioPageData from '@src/configs/defaultPortfolioPageData'
import envConfig from '@src/configs/envConfig'
import { SINGLE_STOCK, PORTFOLIO, TRADE_DETAIL, BOTH, ALL_PORTFOLIO } from '@src/constants/values'
import { groupDefaultValue, advGraphConfigList, spreadGraphConfigList, volatilityGraphConfigList, groupOptionList } from '@src/configs/portfolioBreakdown'
import { inputFormFieldList, optimizedParamsFieldList, clientConfigFormFieldList } from '@src/configs/excelInputConfig'
import convertTimeZone from '@src/utils/convertTimeZone'
import hasDuplicateStocks from '@src/utils/hasDuplicateStocks'
import dayjs from "dayjs"
import { createActionLoggerRecord } from '@src/api/common/createActionLoggerRecord'

class CommonStore {
  @observable socket = null
  @observable tabValue = 1
  @observable currentPage = SINGLE_STOCK
  @observable inputFieldForm = {
    'stock': '',
    'quantity': ''
  }
  @observable isUpdateProfilePicker = true
  @observable inputFieldTempSaveForm = null
  @observable info = null
  @observable analyticRawData = null
  @observable analyticData = null
  @observable marketConditionData = null
  @observable marketConditionRawData = null
  @observable marketConditionStock = 'ALL'
  @observable marketConditionStockOptionList = []
  @observable error = {}

  @observable intradayRawData = null
  @observable intradayData = null
  @observable volumeCurveRawData = null
  @observable volumeCurveData = null
  @observable spreadCurveRawData = null
  @observable spreadCurveData = null
  @observable volatilityCurveRawData = null
  @observable volatilityCurveData = null

  @observable additionalParamsList = []
  @observable additionalParamsOptionList = []
  @observable portfolioAdditionalParamsOptionList = []

  @observable additionalParamsSelectedList = []
  @observable additionalParamsForm = {}
  @observable additionalParamsPeviewForm = {}
  @observable tempSaveAdditionalParamsPeviewForm = {}
  @observable additionalParamsPeviewFormikProps = null
  @observable additionalParamsSelectedOption = null
  @observable additionalParamsInitValue = ''
  @observable additionalParamsFormikProps = null
  @observable clientInputFieldList = []

  @observable optimizedInputParamsForm = {
    side: '',
    orderType: '',
    price: 0,
    strategy: ''
  }
  @observable optimizedInputParamsFormikProps = null

  @observable clientConfigSettingsForm = {}

  @observable tradeSchedueRawData = null
  @observable tradeSchedueData = null
  @observable tradeSchedueDayOptionList = []
  @observable optimizedParamsData = null
  @observable optimizedParamsRawData = null
  @observable porfolioSummaryData = null
  @observable porfolioBreakdownGroup = null
  @observable totalValueTraded = 0

  @observable uploadedExcelData = {
    dataList: [],
    fileName: null,
    excelType: null,
    createdAt: null,
    id: null
  }
  @observable uploadedExcelDataList = []
  @observable uploadedExcelType = null
  @observable uploadedExcelId = null
  @observable tempSaveExcelData = null
  @observable tempSaveExcelFileName = null
  @observable deleteFileName = null
  @observable newFileName = null

  @observable deleteProfileName = null
  @observable editProfileName = null

  @observable currencyOptionList = []
  @observable currencyRate = 1

  @observable stockOptionList = []
  @observable optimizedParamsStockOptionList = []
  @observable profileDataList = []
  @observable profileData = null
  @observable layout = []
  @observable profileInput = {}

  @observable profileOptionList = []
  @observable profileType = null
  @observable newSaveProfileName = null
  @observable portfolioBreakdownData = null
  @observable tradeDetailTableData = {
    dataList: [],
    aggregateData: {}
  }

  @observable singleStockPageData = defaultSingleStockPageData
  @observable portfolioPageData = defaultPortfolioPageData

  @observable sharedLinkId = null
  @observable portfolioExcelInputFormCheckList = [] // [{ stock:'0700.HK', isAdditionalFormEmpty: true, isClientConfigFormEmpty: true, isOptimizedFormEmpty: true} ]
  @observable singleStockExcelInputFormCheckList = [] // [{ stock:'0700.HK', isAdditionalFormEmpty: true, isClientConfigFormEmpty: true, isOptimizedFormEmpty: true} ]
  @observable isExcelInputValid = true
  @observable portfolioBreakdownPieChatSize = 350
  @observable portfolioTradeScheduleEstimateChatWidth = 350
  @observable singleStockTradeScheduleEstimateChatWidth = 350

  constructor () {
    makeObservable(this)
  }

  @action
  setPortfolioBreakdownPieChatSize = (height, width) => {

    const pieSize = Math.min(height, width) - 100

    this.portfolioBreakdownPieChatSize = Math.max(pieSize, 0)
  }

  @action
  setPortfolioTradeScheduleEstimateChatWidth = (width) => {
    const chartWidth = parseInt(width) - 100
    runInAction(() => {
      this.portfolioTradeScheduleEstimateChatWidth = chartWidth
    })
  }

  @action
  setSingleStockTradeScheduleEstimateChatWidth = (width) => {
    const chartWidth = parseInt(width) - 100
    runInAction(() => {
      this.singleStockTradeScheduleEstimateChatWidth = chartWidth
    })
  }

  setSinglePageReadyParams = (data) => {
    this.singleStockPageData.params.pageReady = data
  }

  setPortfoliReadyParams = (data) => {
    this.portfolioPageData.params.pageReady = data
  }

  @action
  setTradeDetailTableConfig = ({ columnVisibility, columnOrderList, sorting }) => {
    runInAction(() => {
      this.portfolioPageData.tradeDetailTableConfig = { columnVisibility, columnOrderList, sorting }
    })
  }

  @action
  setSingleStockTradeEstimateGridParams = (data) => {
    this.singleStockPageData.params.tradeEstimate = data
  }

  @action
  setSingleStockIntradayGridParams = (data) => {
    this.singleStockPageData.params.intraday = data
  }

  @action
  setPortfolioTradeEstimateGridParams = (data) => {
    this.portfolioPageData.params.tradeEstimate = data
  }

  @action
  setPortfolioIntradayGridParams = (data) => {
    this.portfolioPageData.params.intraday = data
  }

  @action
  setPortfolioBreakdownGridParams = (data) => {
    this.portfolioPageData.params.portfolioBreakdown = data
  }

  @action
  setPortfolioOptimizeGridParams = (data) => {
    this.portfolioPageData.params.optimizedParam = data
  }

  @action
  resetSingleStockParams = async () => {
    runInAction(() => {
      this.singleStockPageData.params = {
        ...this.singleStockPageData.params,
        intraday: {
          activeCurve: 'VOLUME',
          time: '15'
        },
        tradeEstimate: {
          time: '15',
          day: '',
          startTime: ''
        }
        // pageReady: {
        //   isSinglePageReady: false,
        //   isSingleStockOptimizedGridShow: false
        // }
      }
    })
  }

  @action
  resetPortfolioParams = async () => {
    runInAction(() => {
      this.portfolioPageData.params = {
        ...this.portfolioPageData.params,
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
        }
        // pageReady: {
        //   isPortfolioPageReady: false,
        //   isPortfolioOptimizedGridShow: false
        // }
      }
    })
  }

  @action
  setCurrentPage = (page) => {
    this.currentPage = page
  }

  getCurrentPageData = () => {
    switch (this.currentPage) {
      case SINGLE_STOCK:
        return this.singleStockPageData
      case PORTFOLIO:
        return this.portfolioPageData
      default:
        break;
    }
  }

  @action
  clearShareLinkError = () => {
    runInAction(() => {
      this.error['shareLink'] = null
    })
  }

  @action
  fetchShareLinkData = async (sharedLinkId) => {
    let response
    try {
      response = await fetchShareLinkData({ sharedLinkId })
    } catch (error) {
      runInAction(() => {
        this.error['shareLink'] = error
      })
    }

    try {
      const data = response.data
      //single stock 
      const singleStockData = data.singleStockData
      const inputForm = singleStockData.inputForm
      const singleStockPageData = data.singleStockData.pageData

      //portfolio 
      const portfolioData = data.portfolioData
      const portfolioPageData = portfolioData.pageData
      const tradeDetailTableData = portfolioData.tradeDetailTableData
      const stockOptionList = portfolioData.picker.stockOptionList
      const optimizedParamsStockOptionList = portfolioData.picker.optimizedParamsStockOptionList

      runInAction(async () => {
        // single stock page data
        this.inputFieldForm = inputForm.inputFieldForm
        this.optimizedInputParamsForm = inputForm.optimizedInputParamsForm
        this.clientConfigSettingsForm = inputForm.clientConfigSettingsForm
        // this.singleStockPageData.profileInput = inputForm.inputFieldForm
        this.singleStockPageData.additionalForm = inputForm.additionalParamsForm
        this.singleStockPageData = { ...this.singleStockPageData, ...singleStockPageData }
        this.singleStockPageData.layout = singleStockData.pageData.layout
        //portfolio
        this.portfolioPageData = { ...this.portfolioPageData, ...portfolioPageData }
        this.tradeDetailTableData = tradeDetailTableData
        this.stockOptionList = stockOptionList
        this.optimizedParamsStockOptionList = optimizedParamsStockOptionList
        this.currentPage = data.currentPage
      })

    } catch (error) {
      console.log('transform share link data error')
      console.log(error)
    }
  }

  @action
  resetShareLinkId = async () => {
    runInAction(() => {
      this.sharedLinkId = null
    })
  }

  @action
  fetchShareLink = async (type) => {
    let data
    try {
      const optimizedInputParamsForm = this.optimizedInputParamsFormikProps ? this.optimizedInputParamsFormikProps.values : {}
      data = {
        currentPage: type,
        singleStockData: {
          pageData: {
            layout: this.singleStockPageData.layout,
            viewVisble: this.singleStockPageData.viewVisble,
            // uploadedExcelDataList: this.singleStockPageData.uploadedExcelDataList,
            uploadedExcelData: this.singleStockPageData.uploadedExcelData,
            processData: this.singleStockPageData.processData,
            apiResponse: this.singleStockPageData.apiResponse,
            params: this.singleStockPageData.params,
            profileData: this.singleStockPageData.profileData
          },
          inputForm: {
            inputFieldForm: this.inputFieldForm,
            optimizedInputParamsForm: optimizedInputParamsForm,
            additionalParamsForm: this.additionalParamsForm,
            clientConfigSettingsForm: this.clientConfigSettingsForm
          }
        },
        portfolioData: {
          pageData: {
            layout: this.portfolioPageData.layout,
            viewVisble: this.portfolioPageData.viewVisble,
            // uploadedExcelDataList: this.portfolioPageData.uploadedExcelDataList,
            uploadedExcelData: this.portfolioPageData.uploadedExcelData,
            processData: this.portfolioPageData.processData,
            apiResponse: this.portfolioPageData.apiResponse,
            params: this.portfolioPageData.params,
            profileData: this.portfolioPageData.profileData
          },
          picker: {
            stockOptionList: this.stockOptionList,
            optimizedParamsStockOptionList: this.optimizedParamsStockOptionList
          },
          tradeDetailTableData: this.tradeDetailTableData
        }
      }
    } catch (error) {
      console.log(error)
      console.log('prepare share link data errors')
    }
    try {
      const response = await fetchShareLink({ data })
      const sharedLinkId = response.data.sharedLinkId
      runInAction(() => {
        this.sharedLinkId = sharedLinkId
      })
    } catch (error) {
      console.log('fetch share link error')
      console.log(error)
    }
  }

  @action
  resetInputFieldForm = async () => {
    runInAction(async () => {
      this.inputFieldForm = {
        'stock': '',
        'quantity': ''
      }
    })
  }

  @action
  setUpdateProfilePicker = async (isUpdateProfilePicker) => {
    runInAction(async () => {
      this.isUpdateProfilePicker = isUpdateProfilePicker
    })
  }

  @action
  setInputFieldForm = async (values) => {
    runInAction(async () => {
      this.inputFieldForm = values
    })
  }

  @action
  setOptimizedParamsFormik = (formikprops) => {
    runInAction(async () => {
      this.optimizedInputParamsFormikProps = formikprops
    })
  }

  setTempInputFieldForm = async (values) => {
    this.inputFieldTempSaveForm = values
  }

  @action
  getStockOptionList = async () => {
    try {
      runInAction(() => {
        this.stockOptionList = this.portfolioPageData.apiResponse.analyticData.map((data) => {
          const targetStockInfoExcelData = this.portfolioPageData.uploadedExcelData.params.find(excelData => (excelData.ric || excelData.Symbol) === data.symbol)
          const quantity = targetStockInfoExcelData ? (targetStockInfoExcelData.qty || targetStockInfoExcelData.OrderQty) : 1
          return {
            label: data['symbol'],
            value: data['symbol'],
            quantity
          }
        })
        this.marketConditionStockOptionList = [{ label: 'All', value: 'ALL' }, ...this.stockOptionList]
      })
    } catch (error) {
      console.log(error)
    }
  }

  @action
  getOptimizedStockOptionList = async ({ stockInfoList }) => {
    const optimizedParamsStockOptionList = []
    for (let stockInfo of stockInfoList) {
      const { OrdType, Strategy, Side, Symbol } = stockInfo
      if (OrdType && Strategy && Side) {
        const stockOption = this.stockOptionList.find(_stockOption => _stockOption.label === Symbol)
        if (!stockOption) {
          continue
        }
        optimizedParamsStockOptionList.push(stockOption)
      }
    }
    runInAction(() => {
      this.optimizedParamsStockOptionList = optimizedParamsStockOptionList
    })
  }

  @action
  checkIsSymbolValid = async ({ data, tabValue }) => {
    const stockInfoList = data.map(excelRowData => {
      return { primaryRic: `${excelRowData.Symbol}` }
    })

    const response = await fetchInfo({ stockInfoList })
    this.error['excelInput'] = []
    switch (tabValue) {
      case '1':
        const errorList = []
        const stockinfo = stockInfoList[0]
        if (response.length === 0 || !response[0]) {
          errorList.push({
            errorType: 'SINGLE_SYMBOL_INVALID',
            fieldName: 'Symbol'
          })
          this.error['excelInput'].push({ stock: stockinfo.primaryRic, errorList })
          return false
        }
        return true
      case '2':
        let isAllSymbolValid = true
        data.forEach((stockInfo) => {
          const errorList = []
          const stockDataFound = response.find((responseData) => {
            return `${responseData.primaryRic}` === `${stockInfo.Symbol}`
          })

          if (!stockDataFound) {
            errorList.push({
              errorType: 'PORTFOLIO_SYMBOL_INVALID',
              fieldName: 'Symbol',
              row: parseInt(stockInfo.__rowNum__) + 1
            })
            isAllSymbolValid = false
          }
          this.error['excelInput'].push({ stock: stockInfo.Symbol, errorList })
        })
        return isAllSymbolValid
        break;
      default:
        break;
    }
  }

  @action
  fetchInfo = async ({ stockInfoList, tabValue }) => {
    try {
      const pageData = this.getCurrentPageData()
      const response = await fetchInfo({ stockInfoList })
      this.error['excelInput'] = []
      switch (tabValue) {
        case '1':
          const errorList = []
          const stockinfo = stockInfoList[0]
          if (response.length === 0 || !response[0]) {
            errorList.push({
              errorType: 'SINGLE_SYMBOL_INVALID',
              fieldName: 'Symbol'
            })
            this.error['excelInput'].push({ stock: stockinfo.primaryRic, errorList })
            return
          }
          break
      }
      runInAction(async () => {
        this.info = response
        pageData.apiResponse.info = response
      })
    } catch (error) {
      console.log(error)
      runInAction(() => {
        this.error['info'] = {
          code: 'FETCH_API_ERROR',
          mesaage: 'Fetching info api error!',
          detail: {}
        }
      })
    }
  }

  @action
  fetchInputData = async () => {
    try {
      const response = await fetchInputData()
      runInAction(async () => {
        this.singleStockPageData.apiResponse.inputData = response
      })
      await this.transformCurrencyData()
      await this.transformInputParamData()
      await this.transformAdditionalParamData()
      await this.initClientConfigSettingForm()
    } catch (error) {
      console.log(error)
      runInAction(() => {
        this.error['inputData'] = 'Fetching Input Data Api Error!'
      })
    }
  }

  @action
  initClientConfigSettingForm = async () => {
    const clientConfigSettingsForm = {}
    clientConfigSettingsForm.CustomerId = ''
    if (this.singleStockPageData.processData.additionalClientInputFieldList) {
      this.singleStockPageData.processData.additionalClientInputFieldList.forEach((FieldName) => {
        clientConfigSettingsForm[FieldName] = ''
      })
    }
    runInAction(() => {
      this.clientConfigSettingsForm = clientConfigSettingsForm
    })
  }

  @action
  transformCurrencyData = async () => {
    try {
      const currencyData = this.singleStockPageData.apiResponse.inputData.currencyFX
      const currencyOptionList = currencyData.reduce((optionList, currrencyOption) => {
        const { _id, fx } = currrencyOption
        if (['HKD', 'USD', 'JPY'].indexOf(_id) >= 0) {
          optionList.push({ label: _id, value: _id, USDToCountryRate: fx })
        }
        return optionList
      }, [])
      runInAction(() => {
        this.currencyOptionList = currencyOptionList
      })
    } catch (error) {
      console.log(error)
    }
  }

  @action
  transformAdditionalParamData = async () => {
    let additionParamsList = this.singleStockPageData.apiResponse.inputData.additionalInputParams
    additionParamsList = additionParamsList.filter((additionParams) => {
      return additionParams.Parameter !== 'Strategy'
    })
    runInAction(async () => {
      this.additionalParamsList = additionParamsList
    })
    this.toadditionalParamsOptionList()
  }

  @action
  transformInputParamData = async () => {
    const inputList = this.singleStockPageData.apiResponse.inputData.inputList
    inputList.forEach((data) => {
      if ('OrdType' in data) {
        this.singleStockPageData.processData.orderPickerOptionList = data['OrdType'].map((orderData) => { return { label: orderData, value: orderData } })
      }
      if ('Side' in data) {
        this.singleStockPageData.processData.sidePickerOptionList = data['Side'].map((sideData) => { return { label: sideData, value: sideData } })
      }
      if ('Strategy' in data) {
        this.singleStockPageData.processData.strategyPickerOptionList = data['Strategy'].map((strategyData) => { return { label: strategyData, value: strategyData } })
      }
      if ('CustomerId' in data) {
        this.singleStockPageData.processData.customerIdList = data['CustomerId'].map((_customerId) => { return { label: _customerId, value: _customerId } }).sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()))
      }
      if ('additionalClientInput' in data) {
        this.singleStockPageData.processData.additionalClientInputFieldList = data['additionalClientInput']
        this.clientInputFieldList = data['additionalClientInput']
      }
    })
  }

  @action
  updateCurrencyRate = ({ prevCountry, currentCountry }) => {
    const currentCountryOption = this.currencyOptionList.find((currencyOption) => currencyOption.value === currentCountry)
    const prevCountryOption = this.currencyOptionList.find((currencyOption) => currencyOption.value === prevCountry)
    const currencyRate = convertCurrencyRate({
      originCountry: prevCountry,
      originCountryRate: prevCountryOption['USDToCountryRate'],
      toCountry: currentCountry,
      toCountryRate: currentCountryOption['USDToCountryRate']
    })
    runInAction(() => {
      this.currencyRate = currencyRate
    })
  }

  @action
  updateFieldWithCurrency = () => {
    const pageData = this.getCurrentPageData()
    let tradeDetailDataList = this.tradeDetailTableData['dataList']
    let tradeDetailAggregateData = this.tradeDetailTableData['aggregateData']
    tradeDetailDataList = tradeDetailDataList.map((data) => {
      data['valueTraded'] *= this.currencyRate
      return data
    })
    tradeDetailAggregateData['totalValueTraded'] *= this.currencyRate
    runInAction(async () => {
      // this.info[0]['marketCap'] *= this.currencyRate
      if (pageData.processData.porfolioSummaryData && this.tradeDetailTableData) {
        pageData.processData.porfolioSummaryData['totalValueTraded'] *= this.currencyRate
        this.tradeDetailTableData['dataList'] = tradeDetailDataList
      }
      // this.tradeDetailTableData['aggregateData'] = tradeDetailAggregateData
    })
  }

  @action
  fetchAnalytic = async ({ stockInfoList }) => {
    try {
      const response = await fetchAnalytic({ stockInfoList })
      const pageData = this.getCurrentPageData()
      runInAction(async () => {
        if (response.length === 0) {
          this.error['analytic'] = 'Invalid symbol'
        } else {
          this.analyticData = response
          pageData.apiResponse.analyticData = response
        }
      })
    } catch (error) {
      //
      console.log(error)
      runInAction(() => {
        this.error['analytic'] = 'Fetching analytic api error!'
      })
    }
  }

  @action
  fetchMarketCondition = async ({ stockInfoList }) => {
    if (!envConfig.marketConditionEnable) {
      return
    }
    runInAction(() => {
      if (!this.socket) {
        const pageData = this.getCurrentPageData()
        this.socket = new WebSocket(`${envConfig.socketHost}/marketCondition`);
        const _socket = this.socket

        _socket.onopen = function () {
          const data = JSON.stringify({
            event: 'message',
            stockInfoList: stockInfoList
          })
          _socket.send(data)
        }

        _socket.addEventListener('message', ev => {
          runInAction(async () => {
            this.marketConditionRawData = JSON.parse(ev.data)
            pageData.apiResponse.marketConditionRawData = JSON.parse(ev.data)
            this.transformMarketConditionData({ stockInfoList, pageData })
          })
        })
      }
    })
  }

  @action
  removeSocket = () => {
    if (this.socket) {
      this.socket.close()
      runInAction(() => {
        this.socket = null
      })
    }
  }

  @action
  transformMarketConditionData = async ({ stockInfoList, pageData }) => {
    if (!this.marketConditionRawData.length) {
      return
    }
    if (stockInfoList.length === 1) {
      const marketConditionRawData = this.marketConditionRawData[0]
      runInAction(() => {
        pageData.processData.marketConditionData = {
          spread: marketConditionRawData['spread'],
          volume: marketConditionRawData['volume'],
          volatility: marketConditionRawData['volatility'],
        }
        this.marketConditionData = {
          spread: marketConditionRawData['spread'],
          volume: marketConditionRawData['volume'],
          volatility: marketConditionRawData['volatility'],
        }
      })
    } else {
      if (this.marketConditionStock === 'ALL') {
        let avgVolume = 0
        let avgSpread = 0
        let avgVolatility = 0
        for (let data of pageData.apiResponse.marketConditionRawData) {
          const stock = data['symbol']
          const tempInfoData = pageData.apiResponse.info.find(infoData => infoData['primaryRic'] === stock)
          avgVolume += tempInfoData['valueTraded'] ? tempInfoData['valueTraded'] * data['volume'] : 0
          avgSpread += tempInfoData['valueTraded'] ? tempInfoData['valueTraded'] * data['spread'] : 0
          avgVolatility += tempInfoData['valueTraded'] ? tempInfoData['valueTraded'] * data['volatility'] : 0
        }
        if (this.totalValueTraded === 0) {
          avgVolume = 0
          avgSpread = 0
          avgVolatility = 0
        } else {
          avgVolume /= this.totalValueTraded
          avgSpread /= this.totalValueTraded
          avgVolatility /= this.totalValueTraded
        }
        runInAction(() => {
          pageData.processData.marketConditionData = {
            spread: avgVolume,
            volume: avgSpread,
            volatility: avgVolatility
          }
          this.marketConditionData = {
            spread: avgVolume,
            volume: avgSpread,
            volatility: avgVolatility
          }
        })
      } else {
        const marketConditionData = this.marketConditionRawData.find(data => data['symbol'] === this.marketConditionStock)
        runInAction(() => {
          pageData.processData.marketConditionData = {
            spread: marketConditionData['spread'],
            volume: marketConditionData['volume'],
            volatility: marketConditionData['volatility'],
          }
          this.marketConditionData = {
            spread: marketConditionData['spread'],
            volume: marketConditionData['volume'],
            volatility: marketConditionData['volatility'],
          }
        })
      }
    }
  }

  @action
  setMarketConditionStock = (stock) => {
    this.marketConditionStock = stock
  }

  @action
  getUserProfileLayout = async () => {
    try {
      const response = await getUserProfileLayout()
      runInAction(() => {
        const profileDataList = response.sort(function (a, b) {
          return dayjs(b.lastUpdateDate).diff(dayjs(a.lastUpdateDate))
        });
        this.profileDataList = profileDataList
      })
      await this.convertProfileDataToOptionList()
      await this.computeLastUsedProfile()
    } catch (error) {
      runInAction(() => {
        this.error['layout'] = error
      })
    }
  }

  @action
  convertProfileDataToOptionList = async () => {
    let singleStockPageProfileDataList = []
    let portfolioPageProfileDataList = []
    let singleStockPageProfileOptionList = []
    let portfolioPageProfileOptionList = []
    this.profileDataList.forEach((profileData) => {
      if (profileData.name !== 'single-stock-template' && profileData.name !== 'portfolio-template') {
        const pickerOptionData = {
          label: profileData.name,
          value: profileData.name,
          subLabel: `Updated date: ${moment(profileData.lastUpdateDate).format('YYYY-MM-DD HH:mm:ss')}`,
          lastUsedDate: profileData.lastUsedDate,
          input: profileData.input
        }
        if (profileData.type === SINGLE_STOCK) {
          singleStockPageProfileDataList.push(profileData)
          singleStockPageProfileOptionList.push(pickerOptionData)
        } else {
          portfolioPageProfileDataList.push(profileData)
          portfolioPageProfileOptionList.push(pickerOptionData)
        }
      }
      if (profileData.name === 'single-stock-template') {
        this.singleStockPageData.uploadedExcelDataList = profileData.excel
      }
      if (profileData.name === 'portfolio-template') {
        this.portfolioPageData.uploadedExcelDataList = profileData.excel
      }
    })
    runInAction(() => {
      this.singleStockPageData.profilePickerOptionList = singleStockPageProfileOptionList
      this.portfolioPageData.profilePickerOptionList = portfolioPageProfileOptionList
      this.singleStockPageData.profileDataList = singleStockPageProfileDataList
      this.portfolioPageData.profileDataList = portfolioPageProfileDataList
    })
  }

  @action
  computeLastUsedProfile = async () => {
    const singleStockProfilePickerList = [... this.singleStockPageData.profilePickerOptionList]
    const portfolioProfilePickerList = [... this.portfolioPageData.profilePickerOptionList]
    let singleStockLastUserProfile = ''
    let portfolioLastUserProfile = ''
    if (singleStockProfilePickerList.length) {
      singleStockProfilePickerList.sort(function (a, b) {
        return dayjs(b.lastUsedDate).diff(dayjs(a.lastUsedDate))
      })
      singleStockLastUserProfile = singleStockProfilePickerList[0].value
    }

    if (portfolioProfilePickerList.length) {
      portfolioProfilePickerList.sort(function (a, b) {
        return dayjs(b.lastUsedDate).diff(dayjs(a.lastUsedDate))
      })
      portfolioLastUserProfile = portfolioProfilePickerList[0].value
    }
    runInAction(async () => {
      this.singleStockPageData.lastUsedProfile = singleStockLastUserProfile
      this.portfolioPageData.lastUsedProfile = portfolioLastUserProfile
    })
  }

  @action
  combineTempSaveExcelData = async () => {
    const pageData = this.getCurrentPageData()
    const _tempSaveExcelData = this.tempSaveExcelData
    if (!_tempSaveExcelData) {
      return false
    }
    runInAction(() => {
      pageData.uploadedExcelDataList = [...pageData.uploadedExcelDataList, _tempSaveExcelData]
      this.uploadedExcelDataList = [...this.uploadedExcelDataList, _tempSaveExcelData]
    })
    this.tempSaveExcelFileName = this.tempSaveExcelData.excel_filename
    this.tempSaveExcelData = null
  }

  getTempSaveExcelFileName = () => {
    const _tempSaveExcelFile = this.uploadedExcelDataList.find(excelData => excelData.excel_filename === this.tempSaveExcelFileName)
    return _tempSaveExcelFile ? _tempSaveExcelFile.excel_filename : null
  }

  @action
  setSingleStockTemplateProfileData = async ({ isSingleStockOptimizedGridShow }) => {
    runInAction(async () => {
      this.singleStockPageData.profileData = defaultSingleStockTemplate
      this.singleStockPageData.viewVisble = defaultSingleStockTemplate.viewVisble
      this.singleStockPageData.layout = defaultSingleStockTemplate.layout
      if (!envConfig.marketConditionEnable) {
        this.singleStockPageData.layout = this.singleStockPageData.layout.filter((item) => item.i !== 'MARKET_CONDITION_INDICATORS')
      }
      // if (!isSingleStockOptimizedGridShow) {
      //   this.singleStockPageData.layout = this.singleStockPageData.layout.filter((item) => item.i !== 'OPTIMIZED_PARAMETERS')
      // }
      this.singleStockPageData.profileInput = {}
    })
  }

  @action
  setPortfolioTemplateProfileData = async () => {
    runInAction(async () => {
      this.portfolioPageData.profileData = defaultPortfolioTemplate
      this.portfolioPageData.layout = defaultPortfolioTemplate.layout
      this.portfolioPageData.viewVisble = defaultPortfolioTemplate.viewVisble

      // this.portfolioPageData.uploadedExcelDataList = defaultPortfolioTemplate.excel
      this.portfolioPageData.profilePermission = defaultPortfolioTemplate.permission === 'PUBLIC' ? 'PUBLIC' : 'PRIVATE'
      // await this.combineTempSaveExcelData()
    })
  }

  @action
  clearProfilePermissionError = async () => {
    runInAction(() => {
      this.error['profilePermission'] = null
    })
  }

  @action
  setSingleProfileData = async (profile) => {
    try {
      const profileData = this.singleStockPageData.profileDataList.find(profileData => profileData.name === profile)
      runInAction(async () => {
        // implement updateLastUsedProfile
        this.singleStockPageData.profileData = profileData
        profileData.lastUsedDate = dayjs().format()
        saveUserProfileLayout({ profileData, excelFileList: [] })
        this.singleStockPageData.layout = profileData.layout.map(gridLayoutParam => { return { ...gridLayoutParam, resizeHandles: layoutResizeButtonVisibleConfig } })
        this.singleStockPageData.viewVisble = profileData.viewVisble
        this.singleStockPageData.profileInput = profileData.input.length ? profileData.input[profileData.input.length - 1].params : {}
        this.singleStockPageData.optimizedForm = profileData.input.length && profileData.input[profileData.input.length - 1].optimizedForm ? profileData.input[profileData.input.length - 1].optimizedForm : {}
        this.singleStockPageData.additionalForm = profileData.input.length && profileData.input[profileData.input.length - 1].additionalParamsForm ? profileData.input[profileData.input.length - 1].additionalParamsForm : {}
        this.singleStockPageData.clientConfigFormData = profileData.input.length && profileData.input[profileData.input.length - 1].clientConifgForm ? profileData.input[profileData.input.length - 1].clientConifgForm : {}
        this.clearSingleStockSelectedExcelFile()
        // this.singleStockPageData.uploadedExcelDataList = profileData.excel
        this.singleStockPageData.profilePermission = profileData.permission === 'PUBLIC' ? 'PUBLIC' : 'PRIVATE'
        // await this.combineTempSaveExcelData()
      })
    } catch (error) {
      console.log('set profile data error')
      console.log(error)
    }
  }

  @action
  setPortfolioProfileData = (profile) => {
    // implement updateLastUsedProfile
    try {
      const profileData = this.portfolioPageData.profileDataList.find(profileData => profileData.name === profile)
      const excelInputData = (profileData.input && profileData.input.length > 0) ? profileData.input[profileData.input.length - 1] : this.portfolioPageData.uploadedExcelData
      runInAction(async () => {
        this.portfolioPageData.profileData = profileData
        this.portfolioPageData.uploadedExcelData = excelInputData
        this.portfolioPageData.viewVisble = profileData.viewVisble
        profileData.lastUsedDate = dayjs().format()
        saveUserProfileLayout({ profileData, excelFileList: [] })

        this.portfolioPageData.layout = profileData.layout.map(gridLayoutParam => { return { ...gridLayoutParam, resizeHandles: layoutResizeButtonVisibleConfig } })
        this.portfolioPageData.tradeDetailTableConfig = profileData.tradeDetailTableConfig ?? { columnOrderList: [], columnVisibility: {}, sorting: [] }
        // this.portfolioPageData.uploadedExcelDataList = profileData.excel
        this.portfolioPageData.profilePermission = profileData.permission === 'PUBLIC' ? 'PUBLIC' : 'PRIVATE'
        // await this.combineTempSaveExcelData()
      })
    } catch (error) {
      console.log('set profile data error')
      console.log(error)
    }
  }

  @action
  setDeleteSingleStockFileName = async (fileName) => {
    this.singleStockPageData.deleteFileName = fileName
  }

  @action
  setDeletePortfolioFileName = async (fileName) => {
    this.portfolioPageData.deleteFileName = fileName
  }

  @action
  setDeleteProfileName = async (profileName) => {
    this.deleteProfileName = profileName
  }

  @action
  setEditProfileName = async (profileName) => {
    this.editProfileName = profileName
  }

  @action
  clearEditProfileName = async () => {
    this.editProfileName = null
  }

  @action
  clearDeleteProfileName = async () => {
    this.deleteProfileName = null
  }

  @action
  deleteUploadedSingleStockExcelFile = async () => {
    try {
      const profileData = this.profileDataList.find((profileData) => profileData.name === 'single-stock-template')
      const uploadedExcelDataList = profileData.excel
      let foundIndex = uploadedExcelDataList.findIndex(excelData => excelData['excel_filename'] === this.singleStockPageData.deleteFileName)
      let fileName = this.singleStockPageData.deleteFileName
      uploadedExcelDataList.splice(foundIndex, 1)
      runInAction(() => {
        this.profileDataList.find((profileData) => profileData.name === 'single-stock-template').excel = uploadedExcelDataList
        this.singleStockPageData.deleteFileName = null
      })
      saveUserProfileLayout({ profileData, excelFileList: [] })
      createActionLoggerRecord({
        action: 'UploadHistoryDelete',
        msg: fileName
      })
    } catch (error) {
      console.log(error)
    }
  }

  @action
  deleteUploadedPortfolioExcelFile = async () => {
    try {
      const profileData = this.profileDataList.find((profileData) => profileData.name === 'portfolio-template')
      const uploadedExcelDataList = profileData.excel
      let foundIndex = uploadedExcelDataList.findIndex(excelData => excelData['excel_filename'] === this.portfolioPageData.deleteFileName)
      let fileName = this.portfolioPageData.deleteFileName

      uploadedExcelDataList.splice(foundIndex, 1)
      runInAction(() => {
        this.profileDataList.find((profileData) => profileData.name === 'portfolio-template').excel = uploadedExcelDataList
        this.portfolioPageData.deleteFileName = null
      })
      saveUserProfileLayout({ profileData, excelFileList: [] })
      createActionLoggerRecord({
        action: 'UploadHistoryDelete',
        msg: fileName
      })
    } catch (error) {
      console.log(error)
    }
  }

  @action
  deleteProfile = async (profileName) => {
    try {
      await deleteProfile(profileName)
    } catch (error) {
      this.error['layout'] = error
      console.log(error)
    }
  }

  @action
  updateProfileName = async ({ originalProfileName, newProfileName }) => {
    try {
      await updateProfileName({ newProfileName, originalProfileName })
    } catch (error) {
      console.log(error)
      this.error['layout'] = error
    }
  }

  @action
  setProfileType = async (profileType) => {
    runInAction(async () => {
      this.profileType = profileType
    })
  }

  @action
  setSingleStockLayout = (layout, isSingleStockOptimizedGridShow) => {
    let updatedLayout = layout
    // if (envConfig.marketConditionEnable) {
    //   const item = defaultSingleStockTemplate.layout.find((item) => item.i === 'MARKET_CONDITION_INDICATORS')
    //   updatedLayout.push(item)
    // }
    // if (isSingleStockOptimizedGridShow) {
    //   updatedLayout = layout.filter((item) => item.i !== 'OPTIMIZED_PARAMETERS')
    //   const item = defaultSingleStockTemplate.layout.find((item) => item.i === 'OPTIMIZED_PARAMETERS')
    //   updatedLayout.push(item)
    // }
    runInAction(() => {
      this.singleStockPageData.layout = updatedLayout
    })
    return updatedLayout
  }

  @action
  setPortfolioLayout = (layout) => {
    let updatedLayout = layout
    // if (envConfig.marketConditionEnable) {
    //   const item = defaultPortfolioTemplate.layout.find((item) => item.i === 'MARKET_CONDITION_INDICATORS')
    //   updatedLayout.push(item)
    // }
    runInAction(() => {
      this.portfolioPageData.layout = updatedLayout
    })
    return updatedLayout
  }

  processUploadProfileData = ({ input, saveProfileName = null }) => {
    const excelFileList = []
    this.uploadedExcelDataList = this.uploadedExcelDataList.map((uploadedExcelData) => {
      if (uploadedExcelData.file) {
        excelFileList.push(uploadedExcelData.file)
      }
      delete uploadedExcelData.file;
      return uploadedExcelData
    })

    this.profileData['excel'] = this.uploadedExcelDataList
    this.profileData['layout'] = this.layout

    if (Object.keys(input).length > 0 && this.profileData['input']) {
      this.profileData['input'].push(
        {
          "createdDate": new Date(),
          "params": input
        }
      )
    }
    if (saveProfileName) {
      this.profileData['name'] = saveProfileName
    }
    return { profileData: this.profileData, excelFileList }
  }

  @action
  updateUserProfileLayout = async ({ input }) => {
    const { profileData, excelFileList } = this.processUploadProfileData({ input })
    try {
      await updateUserProfileLayout({ profileData, excelFileList })
    } catch (error) {
      runInAction(() => {
        this.error['login'] = error
      })
    }
  }

  @action
  updateSingleStockUserProfileLayout = async ({ input }) => {
    const { profileData, excelFileList } = this.processUploadSingleStockProfileData({ input })
    try {
      await updateUserProfileLayout({ profileData, excelFileList })
    } catch (error) {
      runInAction(() => {
        this.error['layout'] = error
      })
    }
  }

  @action
  updatePortfolioUserProfileLayout = async ({ input }) => {
    const { profileData, excelFileList } = this.processUploadPortfolioProfileData({ input })
    try {
      await updateUserProfileLayout({ profileData, excelFileList })
    } catch (error) {
      runInAction(() => {
        this.error['layout'] = error
      })
    }
  }

  @action
  setSingleStockViewVisble = async (value) => {
    runInAction(() => {
      this.singleStockPageData.viewVisble = value
    })
  }

  @action
  setPortfolioViewVisible = async (value) => {
    runInAction(() => {
      this.portfolioPageData.viewVisble = value
    })
  }

  processUploadSingleStockProfileData = ({ input, saveProfileName = null }) => {
    const excelFileList = []
    this.singleStockPageData.uploadedExcelDataList = this.singleStockPageData.uploadedExcelDataList.map((uploadedExcelData) => {
      if (uploadedExcelData.file) {
        excelFileList.push(uploadedExcelData.file)
      }
      delete uploadedExcelData.file;
      return uploadedExcelData
    })

    this.singleStockPageData.profileData['excel'] = this.singleStockPageData.uploadedExcelDataList
    this.singleStockPageData.profileData['layout'] = this.singleStockPageData.layout
    this.singleStockPageData.profileData['viewVisble'] = this.singleStockPageData.viewVisble
    if (input && Object.keys(input).length !== 0) {
      const { ric, qty, orderType, price, side, strategy } = input
      const clientConfigForm = this.clientConfigSettingsForm
      const additionalParamsForm = this.additionalParamsForm
      this.singleStockPageData.profileData['input'].push(
        {
          "createdDate": new Date(),
          "params": { ric, qty },
          "optimizedForm": { orderType, price, side, strategy },
          "additionalParamsForm": additionalParamsForm,
          "clientConifgForm": clientConfigForm
        }
      )
    }
    else {
      if (saveProfileName) {
        this.singleStockPageData.profileData['input'] = []
      }
    }
    this.singleStockPageData.profileData['lastUpdateDate'] = dayjs().format()
    if (saveProfileName) {
      this.singleStockPageData.profileData['name'] = saveProfileName
      this.singleStockPageData.profileData['createdDate'] = dayjs().format()
    }
    return { profileData: this.singleStockPageData.profileData, excelFileList }
  }

  processUploadPortfolioProfileData = ({ saveProfileName = null, input } = {}) => {
    const excelFileList = []
    this.portfolioPageData.uploadedExcelDataList = this.portfolioPageData.uploadedExcelDataList.map((uploadedExcelData) => {
      if (uploadedExcelData.file) {
        excelFileList.push(uploadedExcelData.file)
      }
      delete uploadedExcelData.file;
      return uploadedExcelData
    })

    // this.portfolioPageData.profileData['excel'] = this.portfolioPageData.uploadedExcelDataList
    this.portfolioPageData.profileData['layout'] = this.portfolioPageData.layout
    // this.portfolioPageData.profileData['tradeDetailTableConfig'] = this.portfolioPageData.tradeDetailTableConfig
    this.portfolioPageData.profileData['viewVisble'] = this.portfolioPageData.viewVisble

    if (input && Object.keys(input).length !== 0) {
      this.portfolioPageData.profileData['input'].push(input)
    } else {
      if (saveProfileName) {
        this.portfolioPageData.profileData['input'] = []
      }
    }

    if (saveProfileName) {
      this.portfolioPageData.profileData['name'] = saveProfileName
      this.portfolioPageData.profileData['createdDate'] = dayjs().format()
    }
    this.portfolioPageData.profileData['lastUpdateDate'] = dayjs().format()
    return { profileData: this.portfolioPageData.profileData, excelFileList }
  }

  @action
  saveSingleStockUserProfileLayout = async ({ input, saveProfileName }) => {
    const { profileData, excelFileList } = this.processUploadSingleStockProfileData({ input, saveProfileName })
    try {
      await saveUserProfileLayout({ profileData, excelFileList })
    } catch (error) {
      runInAction(() => {
        console.log(error)
        console.log('save user profile layout error!')
      })
    }
  }

  @action
  savePortfolioUserProfileLayout = async ({ saveProfileName, input }) => {
    const { profileData, excelFileList } = this.processUploadPortfolioProfileData({ saveProfileName, input })
    try {
      await saveUserProfileLayout({ profileData, excelFileList })
    } catch (error) {
      runInAction(() => {
        console.log(error)
        console.log('save user profile layout error!')
      })
    }
  }

  @action
  fetchIntradayData = async ({ stock, curve }) => {
    const response = await fetchIntradayData({ stock, curve })
    runInAction(async () => {
      this.intradayRawData = response
    })
  }

  @action
  fetchVolumeCurve = async ({ stockInfoList }) => {
    try {
      const response = await fetchVolumeCurve({ stockInfoList })
      const pageData = this.getCurrentPageData()
      this.volumeCurveRawData = response
      pageData.apiResponse.volumeCurveRawData = response
    } catch (error) {
      runInAction(() => {
        // this.error = error
        this.error['intraday'] = 'Fetching intraday api error!'
      })
    }
  }

  @action
  fetchSpreadCurve = async ({ stockInfoList }) => {
    try {
      const response = await fetchSpreadCurve({ stockInfoList })
      const pageData = this.getCurrentPageData()
      this.spreadCurveRawData = response
      pageData.apiResponse.spreadCurveRawData = response
    } catch (error) {
      runInAction(() => {
        // this.error = error
        this.error['intraday'] = 'Fetching intraday api error!'
      })
    }
  }

  @action
  fetchVolatilityCurve = async ({ stockInfoList }) => {
    try {
      const response = await fetchVolatilityCurve({ stockInfoList })
      const pageData = this.getCurrentPageData()
      this.volatilityCurveRawData = response
      pageData.apiResponse.volatilityCurveRawData = response
    } catch (error) {
      runInAction(() => {
        // this.error = error
        this.error['intraday'] = 'Fetching intraday api error!'
      })
    }
  }

  @action
  setAdditionalParamsFormikProps = async (formikProps) => {
    runInAction(async () => {
      this.additionalParamsFormikProps = formikProps
    })
  }

  @action
  setAdditionalParamsSelectedList = async (additionParams, paramInitValue) => {
    const additionParamsSelectedOption = this.additionalParamsOptionList.find(additionalParamsOption => additionalParamsOption.value === additionParams)
    if (!additionParamsSelectedOption) {
      return
    }
    additionParamsSelectedOption.initValue = paramInitValue
    const additionalParamsSelectedList = [...this.additionalParamsSelectedList, additionParamsSelectedOption]
    runInAction(async () => {
      this.additionalParamsSelectedList = additionalParamsSelectedList
    })
    this.updateAdditionParamsInitPreviewForm()
  }

  @action
  removeAdditionalParamsItem = async (itemLabel) => {
    let additionalParamsOptionList = [...this.additionalParamsOptionList]
    let additionalParamsSelectedList = [...this.additionalParamsSelectedList]
    // const additionalParamsPeviewForm = { ...this.additionalParamsPeviewForm }
    const additionalParamsPeviewForm = { ...this.tempSaveAdditionalParamsPeviewForm }
    let deleteIndex
    const deletedItem = additionalParamsSelectedList.find((params, index) => {
      deleteIndex = index
      return params.label === itemLabel
    })
    delete deletedItem.initValue
    delete additionalParamsPeviewForm[itemLabel]

    additionalParamsOptionList.unshift(deletedItem)
    additionalParamsOptionList = R.sortBy(R.prop('label'), additionalParamsOptionList)
    additionalParamsSelectedList.splice(deleteIndex, 1)
    runInAction(async () => {
      this.additionalParamsOptionList = additionalParamsOptionList
      this.additionalParamsSelectedList = additionalParamsSelectedList
      this.additionalParamsPeviewForm = additionalParamsPeviewForm
    })
  }

  @action
  setSelectedAdditionalParams = (additionParams) => {
    const additionParamsSelectedOption = this.additionalParamsOptionList.find(additionalParamsOption => additionalParamsOption.value === additionParams)
    runInAction(() => {
      this.additionalParamsSelectedOption = additionParamsSelectedOption
    })
  }

  @action
  clearSelectedAdditionalParams = () => {
    runInAction(() => {
      this.additionalParamsSelectedOption = null
    })
  }

  @action
  setSelectedAdditionParamsInitValue = (initValue) => {
    runInAction(() => {
      this.additionalParamsInitValue = initValue
    })
  }

  @action
  clearSelectedAdditionParamsInitValue = () => {
    runInAction(() => {
      this.additionalParamsInitValue = ''
    })
  }

  @action
  setTempSaveAdditionalParamsPeviewForm = (values) => {
    runInAction(() => {
      this.tempSaveAdditionalParamsPeviewForm = { ...values }
    })
  }

  @action
  resetTempSaveAdditionalParamsPeviewForm = async () => {
    runInAction(() => {
      this.tempSaveAdditionalParamsPeviewForm = {}
    })
  }

  @action
  updateAdditionParamsInitPreviewForm = async () => {
    const additionalParamsForm = this.tempSaveAdditionalParamsPeviewForm
    for (let additionalParamsSelectedOption of this.additionalParamsSelectedList) {
      const isFieldExist = additionalParamsSelectedOption['label'] in additionalParamsForm
      if (!isFieldExist) {
        switch (additionalParamsSelectedOption.type) {
          case 'Categorical':
            additionalParamsForm[additionalParamsSelectedOption['label']] = additionalParamsSelectedOption.initValue ? additionalParamsSelectedOption.initValue : 'ALL'
            break;
          case 'Float':
          case 'Int':
            additionalParamsForm[additionalParamsSelectedOption['label']] = additionalParamsSelectedOption.initValue ? additionalParamsSelectedOption.initValue : 0
            break;
          case 'String':
            additionalParamsForm[additionalParamsSelectedOption['label']] = additionalParamsSelectedOption.initValue ? additionalParamsSelectedOption.initValue : ''
            break;
          default:
            additionalParamsForm[additionalParamsSelectedOption['label']] = additionalParamsSelectedOption.initValue ? additionalParamsSelectedOption.initValue : ''
            break;
        }
      }
    }
    runInAction(async () => {
      this.additionalParamsPeviewForm = additionalParamsForm
    })
  }

  toadditionalParamsOptionList = () => {
    const additionalParamsOptionList = this.additionalParamsList.map((additionalParams) => {
      return {
        label: additionalParams.Parameter,
        value: additionalParams.Parameter,
        type: additionalParams.Type,
        description: additionalParams.Description,
        options: additionalParams.Options,
        sample: additionalParams.Sample ? additionalParams.Sample : ''
      }
    })
    runInAction(async () => {
      this.additionalParamsOptionList = additionalParamsOptionList
      this.portfolioAdditionalParamsOptionList = [...additionalParamsOptionList]
    })
  }

  @action
  clearPortfolioSelectedExcelFile = async () => {
    let uploadedExcelDataList = this.portfolioPageData.uploadedExcelDataList
    uploadedExcelDataList.forEach((_uploadedExcelData) => {
      if (_uploadedExcelData['isActive']) {
        _uploadedExcelData['isActive'] = false
      }
    })
    runInAction(() => {
      this.portfolioPageData.uploadedExcelDataList = uploadedExcelDataList
      this.portfolioPageData.uploadedExcelData = null
    })
  }

  @action
  clearSingleStockSelectedExcelFile = async () => {
    let uploadedExcelDataList = this.singleStockPageData.uploadedExcelDataList
    uploadedExcelDataList.forEach((_uploadedExcelData) => {
      if (_uploadedExcelData['isActive']) {
        _uploadedExcelData['isActive'] = false
      }
    })
    runInAction(() => {
      this.singleStockPageData.uploadedExcelDataList = uploadedExcelDataList
      this.singleStockPageData.uploadedExcelData = null
    })
  }

  @action
  setUploadedSingleStockExcelData = async (fileName) => {
    let uploadedExcelData
    let uploadedExcelDataList = this.singleStockPageData.uploadedExcelDataList
    uploadedExcelDataList.forEach((_uploadedExcelData) => {
      _uploadedExcelData['isActive'] = false
      if (_uploadedExcelData['excel_filename'] === fileName) {
        uploadedExcelData = _uploadedExcelData
        _uploadedExcelData['isActive'] = true
      }
    })
    const excelData = uploadedExcelData.params.length ? uploadedExcelData.params[uploadedExcelData.params.length - 1] : {}
    const { Side, Strategy, OrdType, Price, Symbol, OrderQty } = excelData

    // handle optimized form data
    const optimizedFormData = {
      side: Side ? Side : '',
      strategy: Strategy ? Strategy : '',
      orderType: OrdType ? OrdType : '',
      price: Price ? Price : ''
    }

    // handle additional form data
    const additionalFormData = {}
    const additionalInputParamsList = this.singleStockPageData.apiResponse.inputData.additionalInputParams
    const excelColumnNameList = Object.keys(excelData)
    additionalInputParamsList.forEach((paramsOption) => {
      if (excelColumnNameList.includes(paramsOption.Parameter)) {
        additionalFormData[paramsOption.Parameter] = excelData[paramsOption.Parameter]
      }
    })

    // handle client config form data
    const clientConfigFormData = {}
    const additionalClientInputFieldList = this.singleStockPageData.processData.additionalClientInputFieldList
    additionalClientInputFieldList.forEach((fieldName) => {
      if (excelColumnNameList.includes(fieldName)) {
        clientConfigFormData[fieldName] = excelData[fieldName]
      }
    })
    let isCustomerIdValid = false
    if (excelData['CustomerId']) {
      this.singleStockPageData.processData.customerIdList.forEach((option) => {
        if (option.label === excelData['CustomerId']) {
          isCustomerIdValid = true
          excelData['CustomerId'] = option.value
        }
      })
    }
    clientConfigFormData['CustomerId'] = isCustomerIdValid ? excelData['CustomerId'] : ''
    runInAction(async () => {
      this.singleStockPageData.uploadedExcelDataList = uploadedExcelDataList
      this.singleStockPageData.uploadedExcelData = uploadedExcelData
      this.singleStockPageData.profileInput = excelData ? { ric: Symbol, qty: OrderQty } : {}
      this.singleStockPageData.optimizedForm = optimizedFormData
      this.singleStockPageData.additionalForm = additionalFormData
      this.singleStockPageData.clientConfigFormData = clientConfigFormData
    })
  }

  @action
  setUploadedPortfolioExcelData = async (fileName) => {
    let uploadedExcelData
    let uploadedExcelDataList = this.portfolioPageData.uploadedExcelDataList
    uploadedExcelDataList.forEach((_uploadedExcelData) => {
      _uploadedExcelData['isActive'] = false
      if (_uploadedExcelData['excel_filename'] === fileName) {
        uploadedExcelData = _uploadedExcelData
        _uploadedExcelData['isActive'] = true
      }
    })
    runInAction(async () => {
      this.portfolioPageData.uploadedExcelDataList = uploadedExcelDataList
      this.portfolioPageData.uploadedExcelData = uploadedExcelData
    })
  }

  @action
  removeAdditionParamsOptionListItem = async (additionParamsValue) => {
    const filteredAdditionalParamsOptionList = this.additionalParamsOptionList.filter((additionalParamsOption) => {
      return additionalParamsOption.value !== additionParamsValue
    })
    runInAction(async () => {
      this.additionalParamsOptionList = filteredAdditionalParamsOptionList
    })
  }

  @action
  fetchUploadedExcelFileList = async () => {
    const response = await fetchUploadedExcelFileList()
    runInAction(async () => {
      this.uploadedExcelDataList = response
    })
  }

  tempSaveExcelFile = ({ data, fileName, file }) => {
    this.tempSaveExcelData = {
      excel_filename: fileName,
      createdDate: new Date(),
      params: data,
      file,
      isInsert: false
    }
  }

  createNewExcelFileName = async (fileName, uploadedExcelDataList) => {
    let hasDuplicateFileName = uploadedExcelDataList.find((_uploadedExcelData) => _uploadedExcelData.excel_filename === fileName)
    let index = 1
    let newFileName = fileName
    const fileNameWithoutFileExt = fileName.split('.')[0]
    const fileExt = fileName.split('.')[1]
    if (hasDuplicateFileName) {
      // find max index
      for (let _uploadedExcelData of uploadedExcelDataList) {
        const uploadedExcelFileName = _uploadedExcelData.excel_filename
        const uploadedExcelFileNameWithoutFileExt = uploadedExcelFileName.split('.')[0]
        if (uploadedExcelFileNameWithoutFileExt.includes(fileNameWithoutFileExt)) {
          const _separatorList = uploadedExcelFileNameWithoutFileExt.split(fileNameWithoutFileExt)[1].split('_')
          if (_separatorList.length === 2 && parseInt(_separatorList[1]) >= index && !isNaN(parseInt(_separatorList[1]))) {
            index = parseInt(_separatorList[1]) + 1
          }
        }
      }
      newFileName = fileNameWithoutFileExt + '_' + index + '.' + fileExt
    }
    return newFileName
  }

  checkIsExcelInputFormatValid = () => {
    const errorLogList = this.error.excelInput
    for (let errorRecord of errorLogList) {
      if (errorRecord.errorList.length > 0) {
        return false
      }
    }
    return true
  }

  processSingleStockOptimizedFormInputData = ((data) => {
    const excelData = data[0]
    const { OrdType, Side, Strategy, Price, Symbol } = excelData
    const sideOptionList = this.singleStockPageData.processData.sidePickerOptionList
    const orderOptionList = this.singleStockPageData.processData.orderPickerOptionList
    const strategyOptionList = this.singleStockPageData.processData.strategyPickerOptionList
    const sideOptionFound = sideOptionList.find((sideOption) => sideOption.value === Side)
    const orderOptionFound = orderOptionList.find((orderOption) => orderOption.value === OrdType)
    const strategyOptionFound = strategyOptionList.find((strategyOption) => strategyOption.value === Strategy)
    const isOptimizedFormEmpty = (OrdType === undefined && Side === undefined && Strategy === undefined) ? true : false
    this.singleStockExcelInputFormCheckList.push({ stock: Symbol, isOptimizedFormEmpty, isAdditionalFormEmpty: true, isClientConfigFormEmpty: true })
    const errorList = []
    if (isOptimizedFormEmpty) {
      return
    }

    if (sideOptionFound && orderOptionFound && strategyOptionFound) {
      if (OrdType.toUpperCase() === 'LIMIT') {
        if (!Price) {
          errorList.push({
            errorType: 'MISSING',
            fieldName: 'Price'
          })
          delete excelData.Price
        } else if (isNaN(parseFloat(Price))) {
          errorList.push({
            errorType: 'INVALID',
            fieldName: 'Price'
          })
          delete excelData.Price
        }
      } else {
        if (Price !== undefined) {
          errorList.push({
            errorType: 'USELESS_PRICE_INPUT',
            fieldName: 'Price'
          })
          delete excelData.Price
        }
      }
    }

    if (!sideOptionFound) {
      errorList.push({
        errorType: Side ? 'INVALID' : 'MISSING_OPTIMIZED_FIELD',
        fieldName: 'Side'
      })
      delete excelData.Side
    }
    if (!orderOptionFound) {
      errorList.push({
        errorType: OrdType ? 'INVALID' : 'MISSING_OPTIMIZED_FIELD',
        fieldName: 'OrdType'
      })
      delete excelData.OrdType
    }
    if (!strategyOptionFound) {
      errorList.push({
        errorType: Strategy ? 'INVALID' : 'MISSING_OPTIMIZED_FIELD',
        fieldName: 'Strategy',
      })
      delete excelData.Strategy
    }
    this.error['excelInput'][0].errorList = [... this.error['excelInput'][0].errorList, ...errorList]
    return data
  })

  processSingleStockAdditionalParamsFormInputData = (data) => {
    const excelData = data[0]
    const errorList = []
    let isAdditionalFormEmpty = true
    const excelColumnNameList = Object.keys(excelData)
    const { Symbol } = excelData
    this.additionalParamsList.forEach((paramOption) => {
      if (excelColumnNameList.includes(paramOption.Parameter)) {
        switch (paramOption.Type) {
          case 'Categorical':
            const optionFound = paramOption.Options.find((option) => {
              return option.value === `${excelData[paramOption.Parameter]}`
            })
            if (optionFound) {
              isAdditionalFormEmpty = false
              excelData[paramOption.Parameter] = `${optionFound.value}`
            } else {
              errorList.push({
                errorType: 'INVALID',
                fieldName: paramOption.Parameter
              })
              delete excelData[paramOption.Parameter]
            }
            break;
          case 'Float':
            if (!numberValidator.isFloat(excelData[paramOption.Parameter])) {
              errorList.push({
                errorType: 'INVALID',
                fieldName: paramOption.Parameter
              })
              delete excelData[paramOption.Parameter]
            } else {
              isAdditionalFormEmpty = false
            }
            break;
          case 'Int':
            if (!numberValidator.isInt(excelData[paramOption.Parameter])) {
              errorList.push({
                errorType: 'INVALID',
                fieldName: paramOption.Parameter
              })
              delete excelData[paramOption.Parameter]
            } else {
              isAdditionalFormEmpty = false
            }
            break;
          case 'String':
            // if (!excelData[paramOption.Parameter]) {
            //   errorList.push({
            //     errorType: 'INVALID',
            //     fieldName: paramOption.Parameter
            //   })
            //   delete excelData[paramOption.Parameter]
            // } else {
            isAdditionalFormEmpty = false
            // }
            break;
          case 'UTC Time':
            if (isNaN(parseFloat(excelData[paramOption.Parameter])) || parseFloat(excelData[paramOption.Parameter]) >= 1) {
              errorList.push({
                errorType: 'INVALID',
                fieldName: paramOption.Parameter
              })
              delete excelData[paramOption.Parameter]
            } else {
              isAdditionalFormEmpty = false
              const totalTime = 24 * excelData[paramOption.Parameter]
              const hour = Math.floor(totalTime)
              const minute = Math.floor((totalTime - hour) * 60)
              const second = Math.round((totalTime - hour - (minute / 60)) * 3600)
              excelData[paramOption.Parameter] = momentTz(`${hour}:${minute}:${second}`, 'HH:mm:ss').tz('Asia/Hong_Kong').format().replace('+08:00', '')
            }
            break;
          default:
            break;
        }
      }
    })
    this.singleStockExcelInputFormCheckList[0].isAdditionalFormEmpty = isAdditionalFormEmpty
    this.error['excelInput'][0].errorList = [... this.error['excelInput'][0].errorList, ...errorList]
    return data
  }

  @action
  processSingleStockClientConfigFormData = (data) => {
    let isClientConfigFormEmpty = true
    const excelData = data[0]
    const { Symbol } = excelData
    const errorList = []

    if (excelData['CustomerId']) {
      const optionFound = this.singleStockPageData.processData.customerIdList.find((option) => {
        return option.value === `${excelData['CustomerId']}`
      })
      if (optionFound) {
        isClientConfigFormEmpty = false
        excelData['CustomerId'] = `${excelData['CustomerId']}`
      } else {
        errorList.push({
          errorType: 'INVALID',
          fieldName: 'CustomerId'
        })
        excelData['CustomerId'] = ''
      }
    }
    for (let excelFieldName in excelData) {
      if (this.clientInputFieldList.includes(excelFieldName)) {
        isClientConfigFormEmpty = false
      }
    }
    this.singleStockExcelInputFormCheckList[0].isClientConfigFormEmpty = isClientConfigFormEmpty
    this.error['excelInput'][0].errorList = [... this.error['excelInput'][0].errorList, ...errorList]
  }

  @action
  processSingleStockInputFormInputData = async (data) => {
    const excelData = data[0]
    const { OrderQty, Symbol } = excelData

    const errorList = []

    if (!OrderQty) {
      errorList.push({
        errorType: 'MISSING_QTY',
        fieldName: 'OrderQty'
      })
      delete excelData['OrderQty']
    }

    if (!Symbol) {
      errorList.push({
        errorType: 'MISSING_SINGLE__STOCK_SYMBOL',
        fieldName: 'Symbol'
      })
      delete excelData['Symbol']
    }

    if (OrderQty && (!numberValidator.isInt(OrderQty) || parseInt(OrderQty) < 1)) {
      errorList.push({
        errorType: 'INVALID',
        fieldName: 'OrderQty'
      })
      delete excelData['OrderQty']
    }
    this.error['excelInput'] = [{ stock: Symbol, errorList }]

  }

  @action
  validateSingleStockExcelInputFormCheckList = async () => {
    const errorList = []
    this.singleStockExcelInputFormCheckList.forEach((excelInputFormCheck) => {
      const { stock, isOptimizedFormEmpty, isClientConfigFormEmpty, isAdditionalFormEmpty } = excelInputFormCheck
      if ((!isClientConfigFormEmpty || !isAdditionalFormEmpty) && isOptimizedFormEmpty) {
        errorList.push({
          errorType: 'EMPTY_OPTIMIZED_FORM',
          fieldName: 'MISSING',
        })
      }
    })
    this.error['excelInput'][0].errorList = [... this.error['excelInput'][0].errorList, ...errorList]
  }

  @action
  updateSingleStockExcelDataList = async ({ data, fileName, file }) => {
    try {
      this.singleStockExcelInputFormCheckList = []
      this.error['excelInput'] = []
      this.processSingleStockInputFormInputData(data)
      this.processSingleStockOptimizedFormInputData(data)
      this.processSingleStockClientConfigFormData(data)
      this.validateInCorrectFieldName(data)
      const processedData = this.processSingleStockAdditionalParamsFormInputData(data)
      this.validateSingleStockExcelInputFormCheckList()

      const singleStockTemplate = this.profileDataList.find((profileData) => profileData.name === 'single-stock-template')
      const newFileName = await this.createNewExcelFileName(fileName, singleStockTemplate.excel)

      this.isExcelInputValid = this.checkIsExcelInputFormatValid()
      if (this.isExcelInputValid) {
        // check for invalid symbol
        const isSymbolValid = await this.checkIsSymbolValid({ data, tabValue: '1' })
        if (!isSymbolValid) {
          this.isExcelInputValid = this.checkIsExcelInputFormatValid()
          return
        }

        this.profileDataList.find((profileData) => profileData.name === 'single-stock-template').excel.push(
          {
            excel_filename: newFileName,
            createdDate: new Date(),
            params: processedData,
            file
          }
        )
        const profileData = this.profileDataList.find((profileData) => profileData.name === 'single-stock-template')
        const uploadedExcelDataList = profileData.excel
        const excelFileList = []
        // await upload excel
        uploadedExcelDataList.forEach((uploadedExcelData) => {
          if (uploadedExcelData.file) {
            excelFileList.push(uploadedExcelData.file)
          }
          delete uploadedExcelData.file;
          return uploadedExcelData
        })

        runInAction(() => {
          this.singleStockPageData.uploadedExcelDataList = uploadedExcelDataList
          saveUserProfileLayout({ profileData, excelFileList })
          this.newFileName = newFileName
        })
      }

      return newFileName
    } catch (error) {
      console.log(error)
    }
  }

  @action
  clearNewFileName = () => {
    runInAction(() => {
      this.newFileName = null
    })
  }

  @action
  clearExcelInputError = () => {
    runInAction(() => {
      this.error['excelInput'] = []
    })
  }

  @action
  clearMissingOptimizedWarning = () => {
    runInAction(() => {
      this.error['missingOptimizedWarning'] = null
    })
  }

  @action
  processPortfolioOptimizedFormInputData = (data) => {
    const sideOptionList = this.singleStockPageData.processData.sidePickerOptionList
    const orderOptionList = this.singleStockPageData.processData.orderPickerOptionList
    const strategyOptionList = this.singleStockPageData.processData.strategyPickerOptionList

    for (let excelData of data) {
      const errorList = []
      const { OrdType, Side, Strategy, Price, Symbol } = excelData
      const sideOptionFound = sideOptionList.find((sideOption) => sideOption.value === Side)
      const orderOptionFound = orderOptionList.find((orderOption) => orderOption.value === OrdType)
      const strategyOptionFound = strategyOptionList.find((strategyOption) => strategyOption.value === Strategy)
      const isOptimizedFormEmpty = (OrdType === undefined && Side === undefined && Strategy === undefined) ? true : false
      this.portfolioExcelInputFormCheckList.push({ stock: Symbol, isOptimizedFormEmpty, isAdditionalFormEmpty: true, isClientConfigFormEmpty: true })
      if (isOptimizedFormEmpty) {
        continue
      }

      if (sideOptionFound && orderOptionFound && strategyOptionFound) {
        if (OrdType.toUpperCase() === 'LIMIT') {
          if (!Price) {
            errorList.push({
              errorType: 'MISSING',
              fieldName: 'Price'
            })
            delete excelData.Price
          } else if (isNaN(parseFloat(Price))) {
            errorList.push({
              errorType: 'INVALID',
              fieldName: 'Price'
            })
            delete excelData.Price
          }
        } else {
          if (Price !== undefined) {
            errorList.push({
              errorType: 'USELESS_PRICE_INPUT',
              fieldName: 'Price'
            })
            delete excelData.Price
          }
        }
      }

      if (!sideOptionFound) {
        errorList.push({
          errorType: Side ? 'INVALID' : 'MISSING_OPTIMIZED_FIELD',
          fieldName: 'Side'
        })
        delete excelData.Side
      }
      if (!orderOptionFound) {
        errorList.push({
          errorType: OrdType ? 'INVALID' : 'MISSING_OPTIMIZED_FIELD',
          fieldName: 'OrdType'
        })
        delete excelData.OrdType
      }
      if (!strategyOptionFound) {
        errorList.push({
          errorType: Strategy ? 'INVALID' : 'MISSING_OPTIMIZED_FIELD',
          fieldName: 'Strategy',
        })
        delete excelData.Strategy
      }
      const errorRecord = this.error['excelInput'].find((record) => record.stock === Symbol)
      errorRecord.errorList = [...errorRecord.errorList, ...errorList]
    }
    return data
  }

  @action
  processPortfolioAdditionalParamsFormInputData = (data) => {
    for (let rowData of data) {
      let isAdditionalFormEmpty = true
      const fieldNameList = Object.keys(rowData)
      const additionalParamOptionFoundList = this.portfolioAdditionalParamsOptionList.filter((paramsOption) => fieldNameList.includes(paramsOption.label))

      const errorList = []
      //check additional params field
      const { Symbol } = rowData
      if (additionalParamOptionFoundList.length > 0) {
        for (let additionalParamOptionFound of additionalParamOptionFoundList) {
          const excelColumn = additionalParamOptionFound.value
          switch (additionalParamOptionFound.type) {
            case "Categorical":
              const optionFound = additionalParamOptionFound.options.find((option) => {
                return option.value === `${rowData[excelColumn]}`
              })
              if (optionFound) {
                isAdditionalFormEmpty = false
                rowData[excelColumn] = `${optionFound.value}`
              } else {
                errorList.push({
                  errorType: 'INVALID',
                  fieldName: excelColumn
                })
                delete rowData[excelColumn]
              }
              break;
            case 'UTC Time':
              if (isNaN(parseFloat(rowData[excelColumn])) || parseFloat(rowData[excelColumn]) >= 1) {
                errorList.push({
                  errorType: 'INVALID',
                  fieldName: excelColumn
                })
                delete rowData[excelColumn]
              } else {
                isAdditionalFormEmpty = false
                const totalTime = 24 * rowData[excelColumn]
                const hour = Math.floor(totalTime)
                const minute = Math.floor((totalTime - hour) * 60)
                const second = Math.round((totalTime - hour - (minute / 60)) * 3600)
                // rowData[excelColumn] = moment(`${hour}:${minute}:${second}`, 'HH:mm:ss')
                rowData[excelColumn] = momentTz(`${hour}:${minute}:${second}`, 'HH:mm:ss').tz('Asia/Hong_Kong').format().replace('+08:00', '')
              }
              break;
            case 'Float':
              if (!numberValidator.isFloat(rowData[excelColumn])) {
                errorList.push({
                  errorType: 'INVALID',
                  fieldName: excelColumn
                })
                delete rowData[excelColumn]
              } else {
                isAdditionalFormEmpty = false
              }
              break;
            case 'Int':
              if (!numberValidator.isInt(rowData[excelColumn])) {
                errorList.push({
                  errorType: 'INVALID',
                  fieldName: excelColumn
                })
                delete rowData[excelColumn]
              } else {
                isAdditionalFormEmpty = false
              }
              break;
            case 'String':
              // if (!rowData[excelColumn]) {
              //   if (rowData[excelColumn] !== undefined) {
              //     if (!this.error['excelInput']) {
              //       this.error['excelInput'] = {
              //         Symbol,
              //         field: excelColumn
              //       }
              //     }
              //   }
              //   delete rowData[excelColumn]
              // } else {
              isAdditionalFormEmpty = false
              // }
              break;
            default:
              break;
          }
        }
      }
      const errorRecord = this.error['excelInput'].find((record) => record.stock === Symbol)
      errorRecord.errorList = [...errorRecord.errorList, ...errorList]

      const portfolioExcelInputFormFound = this.portfolioExcelInputFormCheckList.find((formCheck) => {
        return formCheck.stock === Symbol
      })
      portfolioExcelInputFormFound.isAdditionalFormEmpty = isAdditionalFormEmpty
    }
    return data
  }

  @action
  processPortfolioClientConfigFormData = (data) => {
    for (let excelData of data) {
      let isClientConfigFormEmpty = true
      const { Symbol } = excelData
      const errorList = []

      if (excelData['CustomerId']) {
        const optionFound = this.singleStockPageData.processData.customerIdList.find((option) => {
          return option.value === `${excelData['CustomerId']}`
        })
        if (optionFound) {
          isClientConfigFormEmpty = false
          excelData['CustomerId'] = `${excelData['CustomerId']}`
        } else {
          errorList.push({
            errorType: 'INVALID',
            fieldName: 'CustomerId'
          })
          excelData['CustomerId'] = ''
        }
      }
      for (let excelFieldName in excelData) {
        if (this.clientInputFieldList.includes(excelFieldName)) {
          isClientConfigFormEmpty = false
        }
      }

      const errorRecord = this.error['excelInput'].find((record) => record.stock === Symbol)
      errorRecord.errorList = [...errorRecord.errorList, ...errorList]

      const portfolioExcelInputFormFound = this.portfolioExcelInputFormCheckList.find((formCheck) => {
        return formCheck.stock === Symbol
      })
      portfolioExcelInputFormFound.isClientConfigFormEmpty = isClientConfigFormEmpty
    }
  }

  validatePortfolioExcelInputFormCheckList = async () => {
    this.portfolioExcelInputFormCheckList.forEach((excelInputFormCheck) => {
      const errorList = []
      const { stock, isOptimizedFormEmpty, isClientConfigFormEmpty, isAdditionalFormEmpty } = excelInputFormCheck
      if ((!isClientConfigFormEmpty || !isAdditionalFormEmpty) && isOptimizedFormEmpty) {
        errorList.push({
          errorType: 'EMPTY_OPTIMIZED_FORM',
          fieldName: 'MISSING',
        })
      }
      const errorRecord = this.error['excelInput'].find((record) => record.stock === stock)
      errorRecord.errorList = [...errorRecord.errorList, ...errorList]
    })
  }

  @action
  processPortfolioInputFormInputData = async (data) => {
    for (let excelData of data) {
      const { OrderQty, Symbol, __rowNum__ } = excelData
      const errorList = []
      if (!OrderQty) {
        errorList.push({
          errorType: 'MISSING_QTY',
          fieldName: 'OrderQty'
        })
        delete excelData['OrderQty']
      }

      if (!Symbol) {
        errorList.push({
          errorType: 'MISSING_PORTFOLIO_SYMBOL',
          fieldName: 'Symbol',
          row: parseInt(__rowNum__) + 1
        })
        delete excelData['Symbol']
      }

      if (OrderQty && (!numberValidator.isInt(OrderQty) || parseInt(OrderQty) < 1)) {
        errorList.push({
          errorType: 'INVALID',
          fieldName: 'OrderQty'
        })
        delete excelData['OrderQty']
      }
      this.error['excelInput'].push({ stock: Symbol, errorList })
    }
  }

  @action
  validateInCorrectFieldName = async (data) => {
    const additionalParamsFieldNameList = this.portfolioAdditionalParamsOptionList ? this.portfolioAdditionalParamsOptionList.map((field) => field.label) : []
    const clientInputFieldNameList = this.singleStockPageData.processData.additionalClientInputFieldList ? this.singleStockPageData.processData.additionalClientInputFieldList : []
    const validFieldNameList = [...additionalParamsFieldNameList, ...clientInputFieldNameList, ...inputFormFieldList, ...optimizedParamsFieldList, ...clientConfigFormFieldList]

    for (let rowRecord of data) {
      const { Symbol } = rowRecord
      const errorList = []
      for (let excelFieldName in rowRecord) {
        let isCorrectFieldName = false
        if (validFieldNameList.includes(excelFieldName)) {
          isCorrectFieldName = true
          continue
        }
        if (!isCorrectFieldName) {
          errorList.push({
            errorType: 'INCORRECT_FIELD_NAME',
            fieldName: excelFieldName
          })
        }
      }
      this.error['excelInput'].push({ stock: Symbol, errorList })
    }
  }

  @action
  updatePortfolioExcelDataList = async ({ data, fileName, file }) => {
    try {
      this.portfolioExcelInputFormCheckList = []
      this.error['excelInput'] = []
      this.processPortfolioInputFormInputData(data)
      this.processPortfolioOptimizedFormInputData(data)
      this.processPortfolioClientConfigFormData(data)
      this.validateInCorrectFieldName(data)
      const processedData = this.processPortfolioAdditionalParamsFormInputData(data)
      this.validatePortfolioExcelInputFormCheckList()

      const portfolioTemplate = this.profileDataList.find((profileData) => profileData.name === 'portfolio-template')
      const newFileName = await this.createNewExcelFileName(fileName, portfolioTemplate.excel)

      this.isExcelInputValid = this.checkIsExcelInputFormatValid()
      if (this.isExcelInputValid) {
        // check for invalid symbol
        const isSymbolValid = await this.checkIsSymbolValid({ data, tabValue: '2' })
        if (!isSymbolValid) {
          this.isExcelInputValid = this.checkIsExcelInputFormatValid()
          return
        }

        this.profileDataList.find((profileData) => profileData.name === 'portfolio-template').excel.push(
          {
            excel_filename: newFileName,
            createdDate: new Date(),
            params: processedData,
            file
          }
        )
        const profileData = this.profileDataList.find((profileData) => profileData.name === 'portfolio-template')
        const uploadedExcelDataList = profileData.excel
        const excelFileList = []

        // await upload excel
        uploadedExcelDataList.forEach((uploadedExcelData) => {
          if (uploadedExcelData.file) {
            excelFileList.push(uploadedExcelData.file)
          }
          delete uploadedExcelData.file;
          return uploadedExcelData
        })
        runInAction(() => {
          this.portfolioPageData.uploadedExcelDataList = uploadedExcelDataList
          saveUserProfileLayout({ profileData, excelFileList })
          this.newFileName = newFileName
        })
      }
      return newFileName
    } catch (error) {
      console.log(error)
    }
  }

  @action
  resetAdditionalParamsSelectedList = async () => {
    runInAction(() => {
      this.additionalParamsSelectedList = []
    })
  }

  @action
  resetAdditionalForm = async () => {
    runInAction(async () => {
      this.additionalParamsForm = {}
      this.additionalParamsSelectedList = []
      this.additionalParamsFormikProps = null
    })
  }

  @action
  setAdditionalForm = async (values) => {
    runInAction(async () => {
      this.additionalParamsForm = { ...values }
    })
  }

  @action
  setAdditionalPreviewForm = async (values) => {
    runInAction(async () => {
      this.additionalParamsPeviewForm = values
    })
  }

  @action
  resetAdditionalPreviewForm = async () => {
    runInAction(async () => {
      this.additionalParamsPeviewForm = {}
      this.additionalParamsPeviewFormikProps = null
    })
  }

  @action
  setClientConfigForm = async (values) => {
    runInAction(async () => {
      this.clientConfigSettingsForm = values
    })
  }

  @action
  setOptimizedParamsForm = async (values) => {
    runInAction(async () => {
      this.optimizedInputParamsForm = values
    })
  }

  @action
  resetOptimizedParamsForm = async () => {
    runInAction(async () => {
      this.optimizedInputParamsForm = {
        side: '',
        orderType: '',
        price: 0,
        strategy: ''
      }
    })
  }

  @action
  setSingleStockOptimizedParamGridVisible = async (isVisible) => {
    runInAction(() => {
      this.singleStockPageData.optimizedParams.isVisible = isVisible
    })
  }

  @action
  fetchOptimizedParams = async ({ stockInfoList, tabValue }) => {

    try {
      const response = await fetchOptimizedParams({ stockInfoList })
      const pageData = tabValue === '1' ? this.singleStockPageData : this.portfolioPageData
      runInAction(async () => {
        this.optimizedParamsRawData = response
        pageData.apiResponse.optimizedParamsRawData = response
        this.transformOptimzedParams(null, tabValue)
      })
      if (tabValue === '2') {
        this.transformAllOptimzedParams()
      }
    } catch (error) {
      console.log('error', error)
      runInAction(async () => {
        this.error['optimizedParams'] = 'Fetching Optimized Parms error!'
      })

      throw error
    }
  }

  @action
  transformAllOptimzedParams = async () => {
    // filter data by stock
    const pageData = this.portfolioPageData
    if (pageData.apiResponse.optimizedParamsRawData.length === 0) {
      runInAction(() => {
        pageData.processData.allOptimizedParamsData = []
      })
      return
    }
    // loop raw data
    const allOptimizedParamsData = []
    for (let res of pageData.apiResponse.optimizedParamsRawData) {
      const optimizedParamsData = {}
      if (res['Result']['Status'] === 'ERROR') {
        continue
      }
      optimizedParamsData['symbol'] = res['Symbol']
      optimizedParamsData['optimizedPerformance'] = res['Result']['OptimizedPerformance']
      optimizedParamsData['beforeOptimizedPerformance'] = res['Result']['BeforeOptimizedPerformance']
      optimizedParamsData['configManager'] = []
      optimizedParamsData['optimizedParameters'] = []
      // transform params
      for (var key in res['Result']['OptimizedParameters']) {
        const additionalParamFound = this.additionalParamsList.find(params => params.Parameter === key)
        optimizedParamsData['optimizedParameters'].push(
          {
            parameter: key,
            value: res['Result']['OptimizedParameters'][key],
            description: '',
            type: additionalParamFound ? additionalParamFound.Type : 'String'
          }
        )
      }
      optimizedParamsData['optimizedParameters'].sort((a, b) => a.parameter.toLowerCase().localeCompare(b.parameter.toLowerCase()))

      for (var key in res['Result']['ConfigManager']) {
        optimizedParamsData['configManager'].push(
          {
            parameter: key,
            value: res['Result']['ConfigManager'][key],
            description: ''
          }
        )
      }
      optimizedParamsData['configManager'].sort((a, b) => a.parameter.toLowerCase().localeCompare(b.parameter.toLowerCase()));
      allOptimizedParamsData.push(optimizedParamsData)
    }
    runInAction(() => {
      pageData.processData.allOptimizedParamsData = allOptimizedParamsData
    })
  }

  @action
  transformOptimzedParams = async (stock = null, tabValue) => {
    let res
    // filter data by stock
    const pageData = tabValue === '1' ? this.singleStockPageData : this.portfolioPageData
    res = stock ? pageData.apiResponse.optimizedParamsRawData.find(data => data.Symbol === stock) : pageData.apiResponse.optimizedParamsRawData[0]
    const optimizedParamsData = {}

    try {
      if (!res) {
        throw new Error()
      }
    } catch (error) {
      runInAction(async () => {
        this.error['optimizedParams'] = 'Empty Response Result'
      })
      return
    }
    try {
      if (res['Result']['Status'] === 'ERROR') {
        throw new Error()
      }
    } catch (error) {
      runInAction(async () => {
        pageData.apiResponse.optimizedParamsReponseErrorMsg = res['Result']['Message'] ? res['Result']['Message'] : 'Fetch Response Status: Error'
      })
      return
    }

    try {
      optimizedParamsData['optimizedPerformance'] = res['Result']['OptimizedPerformance']
      optimizedParamsData['symbol'] = res['Symbol']
      optimizedParamsData['beforeOptimizedPerformance'] = res['Result']['BeforeOptimizedPerformance']
      optimizedParamsData['configManager'] = []
      optimizedParamsData['optimizedParameters'] = []
      // transform params
      for (var key in res['Result']['OptimizedParameters']) {
        optimizedParamsData['optimizedParameters'].push(
          {
            parameter: key,
            value: res['Result']['OptimizedParameters'][key],
            description: ''
          }
        )
      }
      optimizedParamsData['optimizedParameters'].sort((a, b) => a.parameter.toLowerCase().localeCompare(b.parameter.toLowerCase()));
      for (var key in res['Result']['ConfigManager']) {
        optimizedParamsData['configManager'].push(
          {
            parameter: key,
            value: res['Result']['ConfigManager'][key],
            description: ''
          }
        )
      }
      optimizedParamsData['configManager'].sort((a, b) => a.parameter.toLowerCase().localeCompare(b.parameter.toLowerCase()));
      runInAction(() => {
        this.optimizedParamsData = optimizedParamsData
        pageData.processData.optimizedParamsData = optimizedParamsData
      })
    } catch (error) {
      console.log(error)
      runInAction(async () => {
        this.error['optimizedParams'] = 'Transform Optimized Params Data Error!'
      })
    }
  }

  @action
  clearSingleStockOptimizedParamsResponseError = async () => {
    runInAction(() => {
      this.singleStockPageData.apiResponse.optimizedParamsReponseErrorMsg = null
    })
  }

  @action
  clearPortfolioOptimizedParamsResponseError = async () => {
    runInAction(() => {
      this.portfolioPageData.apiResponse.optimizedParamsReponseErrorMsg = null
    })
  }

  setPorfolioBreakdownGroup = (group) => {
    this.porfolioBreakdownGroup = group
  }

  handleTransformSingleStockTextFieldData = ({ quantity }) => {
    const info = this.singleStockPageData.apiResponse.info
    const analyticData = this.singleStockPageData.apiResponse.analyticData
    const _optimizedParamsData = this.singleStockPageData.processData.optimizedParamsData
    const instrumentCharacteristicsViewData = [
      { label: 'Instrument Characteristics', value: '', type: 'TITLE' },
      { label: 'Symbol', value: info[0].primaryRic, type: 'FIELD' },
      { label: 'Name', value: info[0].description, type: 'FIELD' },
      { label: 'Country', value: info[0].countryCode, type: 'FIELD' },
      { label: 'Exchange', value: info[0].exchCode, type: 'FIELD' },
      { label: 'Security Type', value: info[0].securityType, type: 'FIELD' },
      { label: 'Day Volatility', value: `${roundTo(analyticData[0].CLOSE_VOLATILITY_0.data * 100, 2)} %`, type: 'FIELD' },
      { label: '%ADV', value: `${roundTo(quantity * 100 / analyticData[0].VOLUME_0.data[0], 2)} %`, type: 'FIELD' },
      { label: 'Avg Spread', value: `${roundTo(analyticData[0].AVERAGE_SPREAD_0.data[0], 2)} bps`, type: 'FIELD' },
      { label: 'MOO %Vol', value: `${roundTo((analyticData[0].VOLUME_60.amOpen * 100) / analyticData[0].VOLUME_0.data[0], 2)} %`, type: 'FIELD' },
      { label: 'MOC %Vol', value: `${roundTo((analyticData[0].VOLUME_60.pmClose * 100) / analyticData[0].VOLUME_0.data[0], 2)} %`, type: 'FIELD' }
    ]
    return { portfolioSummaryTextFieldList: instrumentCharacteristicsViewData }
  }

  handleTransformPortfolioTextFieldData = ({ currencyCountry }) => {
    const _porfolioSummaryData = this.portfolioPageData.processData.porfolioSummaryData
    const _optimizedParamsData = this.portfolioPageData.processData.optimizedParamsData
    const porfolioSummaryData = [
      { label: 'Portfolio Summary', value: '', type: 'TITLE' },
      { label: 'No. of Stock', value: _porfolioSummaryData.totalStockNumber, type: 'FIELD' },
      { label: 'Total Shares', value: `${commonUtil.getNumberWithCommaSeparator(String(_porfolioSummaryData.totalQuantity))}`, type: 'FIELD' },
      { label: 'Total Value', value: `${commonUtil.getNumberWithCommaSeparator(String(roundTo(_porfolioSummaryData.totalValueTraded, 0)))} ${currencyCountry}`, type: 'FIELD' },
      { label: 'Day Volatility', value: `${roundTo(_porfolioSummaryData.avgVoatility * 100, 2)} %`, type: 'FIELD' },
      { label: '% ADV', value: `${roundTo(_porfolioSummaryData.avgAdv, 2)} %ADV`, type: 'FIELD' },
      { label: 'Avg Spread', value: `${roundTo(_porfolioSummaryData.avgSpread, 2)} bps`, type: 'FIELD' },
    ]
    return { portfolioSummaryTextFieldList: porfolioSummaryData }
  }

  handleTransformTradeDetailFieldData = ({ currencyCountry }) => {
    const tradeDetailHeadTitle = [
      { label: 'Trade Details', value: '', type: 'TITLE' },
      {
        label: ['Symbol', 'Name', 'Country', 'Side', 'Order Type', 'Limit Price', 'Strategy', '%Portfolio', 'Shares', `Value Traded (${currencyCountry})`, '% ADV', 'Spread (bps)', 'Volatility (%)', '% MOO', '% MOC', 'Est. Duration (Day)'],
        value: null,
        type: 'TABLE_HEAD_CELL'
      },
    ]

    const allOptimizedParamsData = this.portfolioPageData.processData.allOptimizedParamsData
    const optimizedParamsField = []
    let optimizedPerformanceSumProduct = 0
    let beforeOptimizedPerformanceSumProduct = 0
    if (allOptimizedParamsData.length > 0) {
      allOptimizedParamsData.forEach((data) => {
        //each stock
        const optimizedParamDataList = data['optimizedParameters']
        const beforeOptimizedPerformance = data.beforeOptimizedPerformance
        const optimizedPerformance = data.optimizedPerformance

        const stock = data['symbol']
        const tradeDetailFound = this.tradeDetailTableData.dataList.find((tradeDetailData) => tradeDetailData.symbol === stock)
        if (!tradeDetailFound) {
          return
        }
        const valueTraded = tradeDetailFound['valueTraded']
        optimizedPerformanceSumProduct += (valueTraded * optimizedPerformance)
        beforeOptimizedPerformanceSumProduct += (valueTraded * beforeOptimizedPerformance)

        if (optimizedParamsField.length === 0) {
          optimizedParamsField.push('Config Manager Performance Estimate')
          optimizedParamsField.push('Performance Estimate')
          tradeDetailFound.beforeOptimizedPerformance = beforeOptimizedPerformance
          tradeDetailFound.optimizedPerformance = optimizedPerformance
        }

        for (let optimizedParamData of optimizedParamDataList) {
          const fieldName = optimizedParamData.parameter
          const value = optimizedParamData.value
          const fieldFound = optimizedParamsField.find((name) => name === fieldName)
          if (tradeDetailFound) {
            tradeDetailFound[fieldName] = value
          }
          if (fieldFound) {
            continue
          }
          optimizedParamsField.push(fieldName)
        }
      })

      tradeDetailHeadTitle[1]['label'] = [...tradeDetailHeadTitle[1]['label'], ...optimizedParamsField]
    }

    this.tradeDetailTableData.aggregateData.optimizedPerformance = optimizedPerformanceSumProduct ? optimizedPerformanceSumProduct / this.tradeDetailTableData.aggregateData.totalValueTraded : ''
    this.tradeDetailTableData.aggregateData.beforeOptimizedPerformance = beforeOptimizedPerformanceSumProduct ? beforeOptimizedPerformanceSumProduct / this.tradeDetailTableData.aggregateData.totalValueTraded : ''
    const tableData = this.tradeDetailTableData.dataList.map((data) => {
      const tableDataRow = [data.symbol, data.name, data.country, data.side, data.orderType, data.price, data.strategy, `${data.portfolioPercentage} %`, data.shares, data.valueTraded, `${data.adv} %`, `${data.spread} bps`, `${data.volatility} %`, `${data.moo} %`, `${data.moc} %`, data.estimateDuration]
      for (let field of optimizedParamsField) {
        if (field === 'Performance Estimate') {
          tableDataRow.push(data.optimizedPerformance ? data.optimizedPerformance : '')
          continue
        }
        if (field === 'Config Manager Performance Estimate') {
          tableDataRow.push(data.beforeOptimizedPerformance ? data.beforeOptimizedPerformance : '')
          continue
        }
        tableDataRow.push(data[field] ? data[field] : '')
      }
      return {
        label: null, value: tableDataRow, type: 'TABLE_CELL'
      }
    })
    const tradeDetailTableData = {
      label: null,
      value: [
        'Total', '', '', '', '', '', '', '',
        this.tradeDetailTableData.aggregateData['totalShares'], this.tradeDetailTableData.aggregateData['totalValueTraded'],
        `${this.tradeDetailTableData.aggregateData['avgAdv']} %`, `${this.tradeDetailTableData.aggregateData['avgSpread']} (bps)`,
        `${this.tradeDetailTableData.aggregateData['avgVoatility']} %`,
        `${this.tradeDetailTableData.aggregateData['avgMoo']} %`,
        `${this.tradeDetailTableData.aggregateData['avgMoc']} %`,
        this.tradeDetailTableData.aggregateData['maxEstimateDuration'],
        // this.tradeDetailTableData.aggregateData['beforeOptimizedPerformance'] ? roundTo(this.tradeDetailTableData.aggregateData['beforeOptimizedPerformance'], 2) : '',
        // this.tradeDetailTableData.aggregateData['optimizedPerformance'] ? roundTo(this.tradeDetailTableData.aggregateData['optimizedPerformance'], 2) : ''
      ],
      type: 'TABLE_CELL',
      style: { fontWeight: 'bold' }
    }
    return { tradeDetailTextFieldList: [...tradeDetailHeadTitle, ...tableData, tradeDetailTableData] }
  }

  handleTransformPortfolioStockInfoList = async () => {
    let stockInfoList = []
    try {
      if (this.stockOptionList.length === 0) {
        return []
      }
      const allOptimizedParamsDataList = this.portfolioPageData.processData.allOptimizedParamsData
      for (let stockOption of this.stockOptionList) {
        const symbol = stockOption.label
        const _optimizedParamsData = allOptimizedParamsDataList.find((data) => data.symbol === symbol)
        if (!_optimizedParamsData) {
          stockInfoList.push({ symbol, optimizedParameters: [] })
          continue
        }
        const beforeOptimizedPerformance = _optimizedParamsData.beforeOptimizedPerformance
        const optimizedPerformance = _optimizedParamsData.optimizedPerformance
        // prepare table cell data
        const optimzeTableData = _optimizedParamsData.optimizedParameters.map((data) => {
          return {
            label: null, value: [data.parameter, data.value, data.description], type: 'TABLE_CELL'
          }
        })
        const configManagerTable = _optimizedParamsData.configManager.map((data) => {
          return {
            label: null, value: [data.parameter, data.value], type: 'TABLE_CELL'
          }
        })
        // combine optimized params data
        const optimizedParamsData = [
          { label: 'Optimized Parameters', value: '', type: 'TITLE' },
          { label: 'Symbol', value: symbol, type: 'FIELD' },
          { label: 'Performance Estimate', value: optimizedPerformance, type: 'FIELD' },
          { label: ['Parameter', 'Value', 'Description'], value: null, type: 'TABLE_HEAD_CELL' },
          ...optimzeTableData,
          // { label: 'Based on config manager', value: '', type: 'TITLE' },
          // { label: 'performanceEstimate', value: beforeOptimizedPerformance, type: 'FIELD' },
          // ...configManagerTable
        ]
        stockInfoList.push({ symbol, optimizedParameters: optimizedParamsData })
      }
    } catch (error) {
      console.log(error)
    }
    return stockInfoList
  }

  handleTransformSingleStockInfoList = async () => {
    let stockInfoList = []
    const infoRawDataList = this.singleStockPageData.apiResponse.info
    if (infoRawDataList.length === 0) {
      return []
    }
    const infoRawData = infoRawDataList[0]
    const symbol = infoRawData['primaryRic']
    const _optimizedParamsData = this.singleStockPageData.processData.optimizedParamsData

    if (_optimizedParamsData) {
      // const beforeOptimizedPerformance = _optimizedParamsData.beforeOptimizedPerformance
      const optimizedPerformance = _optimizedParamsData.optimizedPerformance

      // prepare table cell data
      const optimzeTableData = _optimizedParamsData.optimizedParameters.map((data) => {
        return {
          label: null, value: [data.parameter, data.value, data.description], type: 'TABLE_CELL'
        }
      })
      // const configManagerTable = _optimizedParamsData.configManager.map((data) => {
      //   return {
      //     label: null, value: [data.parameter, data.value], type: 'TABLE_CELL'
      //   }
      // })

      // combine optimized params data
      const optimizedParamsData = [
        { label: 'Optimized Parameters', value: '', type: 'TITLE' },
        { label: 'performanceEstimate', value: optimizedPerformance, type: 'FIELD' },
        { label: ['Parameter', 'Value', 'Description'], value: null, type: 'TABLE_HEAD_CELL' },
        ...optimzeTableData
      ]
      stockInfoList.push({ symbol, optimizedParameters: optimizedParamsData })
      return stockInfoList
    }
    return [{ symbol, optimizedParameters: [] }]
  }

  transformExcelChartTextFieldsData = async ({ quantity, page, currencyCountry }) => {
    let textFields = {}
    let stockInfoList = []
    switch (page) {
      case SINGLE_STOCK:
        textFields = this.handleTransformSingleStockTextFieldData({ quantity })
        stockInfoList = await this.handleTransformSingleStockInfoList()
        break
      case PORTFOLIO:
        textFields = this.handleTransformPortfolioTextFieldData({ currencyCountry })
        stockInfoList = await this.handleTransformPortfolioStockInfoList()
        break;
      case TRADE_DETAIL:
        textFields = this.handleTransformTradeDetailFieldData({ currencyCountry })
        break;
      case ALL_PORTFOLIO:
        textFields = { ...this.handleTransformPortfolioTextFieldData({ currencyCountry }), ...this.handleTransformTradeDetailFieldData({ currencyCountry }) }
        stockInfoList = await this.handleTransformPortfolioStockInfoList()
      default:
        break;
    }
    return { textFields, stockInfoList }
  }

  handleTransformSingleStockExcelData = async ({ quantity }) => {
    const groupTimeList = [15, 30]
    const chartData = []
    const volumeCurveRawDataList = this.singleStockPageData.apiResponse.volumeCurveRawData
    const analyticDataRawDataList = this.singleStockPageData.apiResponse.analyticData
    const infoRawDataList = this.singleStockPageData.apiResponse.info
    if (analyticDataRawDataList.length === 0) {
      return []
    }
    const infoRawData = infoRawDataList[0]
    const stock = infoRawData['primaryRic']
    const countryCode = infoRawData.countryCode
    const timeZone = convertTimeZone({ countryCode })

    const volumeCurveRawData = volumeCurveRawDataList[0]
    const analyticDataRawData = analyticDataRawDataList[0]
    const { data, times, amOpen, amClose, pmOpen, pmClose } = volumeCurveRawData
    for (let groupTime of groupTimeList) {
      // volume
      const volumeTranformedData = await this.processVolumeIntradayCurveData({ groupTime, data, times, amOpen, amClose, pmOpen, pmClose, timeZone })
      const volumeExcelChartData = this.getExcelFileData({ times: volumeTranformedData['times'], data: volumeTranformedData['data'] })
      // allVolumeCurveData.push(_volumeCurveData)
      chartData.push({
        symbol: stock,
        chart: 'column',
        titles: ['% of Day Volume'],
        fields: volumeTranformedData['times'],
        data: {
          '% of Day Volume': volumeExcelChartData
        },
        chartTitle: `Historical Intraday Profiles (Volume) (Symbol: ${stock}, Time Bin: ${groupTime}mins)`
      })

      // spread
      const spreadTranformedData = await this.processSpreadData({ averageData: analyticDataRawData['AVERAGE_SPREAD_60'], volumeData: analyticDataRawData['VOLUME_60'], groupTime, timeZone })
      const spreadExcelChartData = this.getExcelFileData({ times: spreadTranformedData['times'], data: spreadTranformedData['data'] })
      // allSpreadCurveData.push(_spreadCurveData)
      chartData.push({
        symbol: stock,
        chart: 'column',
        titles: ['Spread(bps)'],
        fields: spreadTranformedData['times'],
        data: {
          'Spread(bps)': spreadExcelChartData
        },
        chartTitle: `Historical Intraday Profiles (Spread) (Symbol: ${stock}, Time Bin: ${groupTime}mins)`
      })

      // volatility
      const volatilityTranformedData = await this.processVolatilityData({ valueTradedData: analyticDataRawData['VALUE_TRADED_60'], volumeData: analyticDataRawData['VOLUME_60'], groupTime, timeZone })
      const volatilityExcelChartData = this.getExcelFileData({ times: volatilityTranformedData['times'], data: volatilityTranformedData['data'] })
      // allVolatilityCurveData.push(_volatilityCurveData)
      chartData.push({
        symbol: stock,
        chart: 'column',
        titles: ['Volatility(bps)'],
        fields: volatilityTranformedData['times'],
        data: {
          'Volatility(bps)': volatilityExcelChartData
        },
        chartTitle: `Historical Intraday Profiles (Volatility) (Symbol: ${stock}, Time Bin: ${groupTime}mins)`
      })

      // tradeEstimate 
      const startTime = moment(this.singleStockPageData.params.tradeEstimate.startTime, moment.ISO_8601).format('HH:mm')
      // const startTime = moment().format('HH:mm')
      // console.log('1213avd', moment(this.singleStockPageData.params.tradeEstimate.startTime, moment.ISO_8601).format('HH:mm'))
      // const startTime = moment(this.portfolioPageData.params.tradeEstimate.startTime, moment.ISO_8601).format('HH:mm')
      const tradeEstimateVolumeData = volumeTranformedData['data']
      const tradeEstimateVolumeTimes = volumeTranformedData['times']
      const adv = quantity ? quantity * 100 / analyticDataRawData.VOLUME_0.data[0] : 1 * 100 / analyticDataRawData.VOLUME_0.data[0]
      const tradeEstimateTransformedData = await this.processTradeEstimateData({ volumeData: tradeEstimateVolumeData, times: tradeEstimateVolumeTimes, startTime, groupTime, timeZone, quantity, adv })
      for (const day in tradeEstimateTransformedData) {
        const _tradeSchedueData = tradeEstimateTransformedData[day]
        const tradeSchedueVolumeData = this.getExcelFileData({ times: _tradeSchedueData['times'], data: _tradeSchedueData['barDataList'] })
        tradeSchedueVolumeData['chart'] = 'column'
        const tradeSchedueCumulativeData = this.getExcelFileData({ times: _tradeSchedueData['times'], data: _tradeSchedueData['accumulatedDataList'] })
        tradeSchedueCumulativeData['chart'] = 'line'
        // _tradeEstimateCurveData = { symbol: stock, params: { groupTime, startTime, day }, processedData: _tradeSchedueData, excelChartData: { tradeSchedueVolumeData, tradeSchedueCumulativeData } }
        // allTradeEstimateCurveData.push(_tradeEstimateCurveData)
        chartData.push({
          symbol: stock,
          titles: [
            "Estimated Shares",
            "Cumulative %",
          ],
          fields: _tradeSchedueData['times'],
          data: {
            'Estimated Shares': tradeSchedueVolumeData,
            "Cumulative %": tradeSchedueCumulativeData
          },
          chartTitle: `Trade Schedule Estimate (Symbol: ${stock}, Time Bin: ${groupTime}mins, Start Time: ${startTime}, Day: ${day})`
        })
      }
    }
    return chartData
  }

  handleTransformPortfolioExcelData = async () => {

    // transform all data
    const volumeCurveRawDataList = this.portfolioPageData.apiResponse.volumeCurveRawData
    const analyticDataRawDataList = this.portfolioPageData.apiResponse.analyticData
    const portfolioBreakdownData = this.portfolioPageData.processData.portfolioBreakdownData
    const _profolioBreakDownData = portfolioBreakdownData[this.porfolioBreakdownGroup]
    const _profolioBreakDownFields = Object.keys(_profolioBreakDownData)

    const infoRawDataList = this.portfolioPageData.apiResponse.info
    const groupTimeList = [15, 30]
    const stockOptionList = this.stockOptionList

    const allVolumeCurveData = []
    const allSpreadCurveData = []
    const allVolatilityCurveData = []
    const allTradeEstimateCurveData = []

    if (stockOptionList.length === 0) {
      return []
    }
    const chartData = []

    for (let stockOption of stockOptionList) {
      const stock = stockOption['label']
      const infoRawData = infoRawDataList.find((rawData) => rawData['primaryRic'] === stock)
      const countryCode = infoRawData.countryCode
      const timeZone = convertTimeZone({ countryCode })

      let _volumeCurveData = {}
      let _spreadCurveData = {}
      let _volatilityCurveData = {}
      let _tradeEstimateCurveData = {}

      const volumeCurveRawData = volumeCurveRawDataList.find((rawData) => rawData['symbol'] === stock)
      const analyticDataRawData = analyticDataRawDataList.find((rawData) => rawData['symbol'] === stock)

      const { data, times, amOpen, amClose, pmOpen, pmClose } = volumeCurveRawData
      for (let groupTime of groupTimeList) {
        // volume
        const volumeTranformedData = await this.processVolumeIntradayCurveData({ groupTime, data, times, amOpen, amClose, pmOpen, pmClose, timeZone })
        const volumeExcelChartData = this.getExcelFileData({ times: volumeTranformedData['times'], data: volumeTranformedData['data'] })
        _volumeCurveData = { symbol: stock, params: { groupTime }, processedData: volumeTranformedData, excelChartData: volumeExcelChartData }
        // allVolumeCurveData.push(_volumeCurveData)
        chartData.push({
          symbol: stock,
          chart: 'column',
          titles: ['% of Day Volume'],
          fields: volumeTranformedData['times'],
          data: {
            '% of Day Volume': volumeExcelChartData
          },
          chartTitle: `Historical Intraday Profiles (Volume) (Symbol: ${stock}, Time Bin: ${groupTime}mins)`
        })

        // spread
        const spreadTranformedData = await this.processSpreadData({ averageData: analyticDataRawData['AVERAGE_SPREAD_60'], volumeData: analyticDataRawData['VOLUME_60'], groupTime, timeZone })
        const spreadExcelChartData = this.getExcelFileData({ times: spreadTranformedData['times'], data: spreadTranformedData['data'] })
        _spreadCurveData = { symbol: stock, params: { groupTime }, processedData: spreadTranformedData, excelChartData: spreadExcelChartData }
        // allSpreadCurveData.push(_spreadCurveData)
        chartData.push({
          symbol: stock,
          chart: 'column',
          titles: ['Spread(bps)'],
          fields: spreadTranformedData['times'],
          data: {
            'Spread(bps)': spreadExcelChartData
          },
          chartTitle: `Historical Intraday Profiles (Spread) (Symbol: ${stock}, Time Bin: ${groupTime}mins)`
        })

        // volatility
        const volatilityTranformedData = await this.processVolatilityData({ valueTradedData: analyticDataRawData['VALUE_TRADED_60'], volumeData: analyticDataRawData['VOLUME_60'], groupTime, timeZone })
        const volatilityExcelChartData = this.getExcelFileData({ times: volatilityTranformedData['times'], data: volatilityTranformedData['data'] })
        _volatilityCurveData = { symbol: stock, params: { groupTime }, processedData: volatilityTranformedData, excelChartData: volatilityExcelChartData }
        // allVolatilityCurveData.push(_volatilityCurveData)
        chartData.push({
          symbol: stock,
          chart: 'column',
          titles: ['Volatility(bps)'],
          fields: volatilityTranformedData['times'],
          data: {
            'Volatility(bps)': volatilityExcelChartData
          },
          chartTitle: `Historical Intraday Profiles (Volatility) (Symbol: ${stock}, Time Bin: ${groupTime}mins)`
        })
        // tradeEstimate 
        const startTime = moment(this.portfolioPageData.params.tradeEstimate.startTime, moment.ISO_8601).format('HH:mm')
        const tradeEstimateVolumeData = volumeTranformedData['data']
        const tradeEstimateVolumeTimes = volumeTranformedData['times']
        const quantity = stockOption.quantity
        const adv = quantity ? quantity * 100 / analyticDataRawData.VOLUME_0.data[0] : 1 * 100 / analyticDataRawData.VOLUME_0.data[0]
        const tradeEstimateTransformedData = await this.processTradeEstimateData({ volumeData: tradeEstimateVolumeData, times: tradeEstimateVolumeTimes, startTime, groupTime, timeZone, quantity, adv })
        for (const day in tradeEstimateTransformedData) {
          const _tradeSchedueData = tradeEstimateTransformedData[day]
          const tradeSchedueVolumeData = this.getExcelFileData({ times: _tradeSchedueData['times'], data: _tradeSchedueData['barDataList'] })
          tradeSchedueVolumeData['chart'] = 'column'
          const tradeSchedueCumulativeData = this.getExcelFileData({ times: _tradeSchedueData['times'], data: _tradeSchedueData['accumulatedDataList'] })
          tradeSchedueCumulativeData['chart'] = 'line'
          _tradeEstimateCurveData = { symbol: stock, params: { groupTime, startTime, day }, processedData: _tradeSchedueData, excelChartData: { tradeSchedueVolumeData, tradeSchedueCumulativeData } }
          // allTradeEstimateCurveData.push(_tradeEstimateCurveData)
          chartData.push({
            symbol: stock,
            titles: [
              "Estimated Shares",
              "Cumulative %",
            ],
            fields: _tradeSchedueData['times'],
            data: {
              'Estimated Shares': tradeSchedueVolumeData,
              "Cumulative %": tradeSchedueCumulativeData
            },
            chartTitle: `Trade Schedule Estimate (Symbol: ${stock}, Time Bin: ${groupTime}mins, Start Time: ${startTime}, Day: ${day})`
          })
        }
      }
    }

    for (let breakdownOption of groupOptionList) {
      const breakDownGroup = breakdownOption.value
      const _profolioBreakDownFields = Object.keys(portfolioBreakdownData[breakDownGroup])
      const _profolioBreakDownData = portfolioBreakdownData[breakDownGroup]
      chartData.push(
        {
          chart: "pie",
          titles: [
            `% Value Traded`
          ],
          fields: _profolioBreakDownFields,
          data: {
            [`% Value Traded`]: _profolioBreakDownData
          },
          chartTitle: `Portfolio Breakdown - Value Traded by ${breakdownCurveTitleMapping[breakDownGroup]}`
        }
      )
    }
    return chartData
  }

  tempSaveSingleStockTradeScheduleStartTime = (startTime) => {
    this.singleStockPageData.tradeScheduleEstimate.input.startTime = startTime
  }

  tempSaveSingleStockTradeScheduleTime = (time) => {
    this.singleStockPageData.tradeScheduleEstimate.input.time = time
  }

  tempSavePortfolioTradeScheduleStartTime = (startTime) => {
    this.portfolioPageData.tradeScheduleEstimate.input.startTime = startTime
  }

  tempSavePortfolioTradeScheduleTime = (time) => {
    this.portfolioPageData.tradeScheduleEstimate.input.startTime = time
  }

  // tempSavePortfolioTradeScheduleStock = (stock) => {
  //   this.portfolioPageData.tradeScheduleEstimate.input.stock = stock
  // }

  transformExcelChartGraphData = async ({ page, quantity }) => {
    let charts = []
    switch (page) {
      case SINGLE_STOCK:
        charts = this.handleTransformSingleStockExcelData({ quantity })
        break
      case PORTFOLIO:
      case ALL_PORTFOLIO:
        charts = this.handleTransformPortfolioExcelData()
        break
      default:
        break;
    }
    return charts
  }

  @action
  fetchExcelChartFile = async ({ quantity, currencyCountry, page, viewVisble = {} }) => {
    // check if all values in view visible is false
    const isAllFalse = R.all(R.equals(false), R.values(viewVisble))
    this.error['EXPORT_EXCEL'] = null
    if (isAllFalse && Object.keys(viewVisble).length !== 0) {
      this.error['EXPORT_EXCEL'] = 'EMPTY_GRID'
      return
    }
    const charts = await this.transformExcelChartGraphData({ page, quantity })
    const { textFields, stockInfoList } = await this.transformExcelChartTextFieldsData({ quantity, page, currencyCountry })
    this.error['RESPONSE'] = null
    if (hasDuplicateStocks({ array: stockInfoList, key: 'symbol' })) {
      this.error['RESPONSE'] = 'DUPLICATE_SYMBOL'
      return
    }
    try {
      const response = await fetchExcelChartFile({ chartData: { charts, ...textFields, stockInfoList, viewVisble } })
      await fileDownload(response, `Analytics Report_${moment().format('YYYY-MM-DD HH:mm:ss')}.xlsx`);
    } catch (error) {
      console.log(error)
    }
  }

  fetchExcelTemplate = async (type) => {
    try {
      const response = await fetchExcelTemplate(type)
      await fileDownload(response, `Template-${moment().format('YYYY-MM-DD HH:mm:ss')}.xlsx`);
    } catch (error) {
      console.log(error)
    }
  }

  getExcelFileData = ({ times, data, chartType = null }) => {
    const excelData = chartType ? { chart: chartType } : {}
    for (let i = 0; i < times.length; i++) {
      excelData[times[i]] = data[i]
    }
    return excelData
  }

  // @action
  // fetchTradeSchedue = async ({ stockInfoList }) => {
  //   try {
  //     const response = await fetchTradeSchedue({ stockInfoList })
  //     runInAction(async () => {
  //       this.tradeSchedueRawData = response
  //       // this.toTradeSchedueDayOptionList()
  //     })
  //   } catch (error) {
  //     this.error['tradeSchedule'] = 'Fetching trade Schedule api error!'
  //   }
  // }

  @action
  transformVolumeCurveData = async ({ groupTime, stock, tabValue }) => {
    try {
      const pageData = tabValue === '1' ? this.singleStockPageData : this.portfolioPageData
      const volumeCurveRawData = stock ? pageData.apiResponse.volumeCurveRawData.find(data => data.symbol === stock) : pageData.apiResponse.volumeCurveRawData[0]
      const infoRawData = stock ? pageData.apiResponse.info.find(data => data.primaryRic === stock) : pageData.apiResponse.info[0]
      const countryCode = infoRawData.countryCode
      const timeZone = convertTimeZone({ countryCode })
      const { data, times, amOpen, amClose, pmOpen, pmClose } = volumeCurveRawData
      const tranformedData = await this.processVolumeIntradayCurveData({ groupTime, data, times, amOpen, amClose, pmOpen, pmClose, timeZone })
      runInAction(async () => {
        this.volumeCurveData = tranformedData
        pageData.processData.volumeCurveData = tranformedData
      })
    } catch (error) {
      runInAction(() => {
        this.error['intraday'] = 'Transform intraday data error!'
      })
    }
  }

  @action
  transformVolatilityCurveData = async ({ groupTime, stock, tabValue }) => {
    try {
      const pageData = tabValue === '1' ? this.singleStockPageData : this.portfolioPageData
      const volatilityCurveRawData = stock ? pageData.apiResponse.analyticData.find(data => data.symbol === stock) : pageData.apiResponse.analyticData[0]
      const infoRawData = stock ? pageData.apiResponse.info.find(data => data.primaryRic === stock) : pageData.apiResponse.info[0]
      const countryCode = infoRawData.countryCode
      const timeZone = convertTimeZone({ countryCode })
      const valueTradedData = volatilityCurveRawData['VALUE_TRADED_60']
      const volumeData = volatilityCurveRawData['VOLUME_60']
      const tranformedData = await this.processVolatilityData({ valueTradedData, volumeData, groupTime, timeZone })
      runInAction(async () => {
        this.volatilityCurveData = tranformedData
        pageData.processData.volatilityCurveData = tranformedData
      })
    } catch (error) {
      console.log(error)
      this.error['intraday'] = 'Transform Volatility Data Error!'
    }
  }

  @action
  transformSpreadCurveData = async ({ groupTime, stock, tabValue }) => {
    try {
      const pageData = tabValue === '1' ? this.singleStockPageData : this.portfolioPageData
      const spreadCurveRawData = stock ? pageData.apiResponse.analyticData.find(data => data.symbol === stock) : pageData.apiResponse.analyticData[0]
      const infoRawData = stock ? pageData.apiResponse.info.find(data => data.primaryRic === stock) : pageData.apiResponse.info[0]
      const countryCode = infoRawData.countryCode
      const timeZone = convertTimeZone({ countryCode })
      const averageData = spreadCurveRawData['AVERAGE_SPREAD_60']
      const volumeData = spreadCurveRawData['VOLUME_60']
      const tranformedData = await this.processSpreadData({ averageData, volumeData, groupTime, timeZone })
      runInAction(async () => {
        this.spreadCurveData = tranformedData
        pageData.processData.spreadCurveData = tranformedData
      })
    } catch (error) {
      console.log(error)
      this.error['intraday'] = 'Transform Volatility Data Error!'
    }
  }

  handleVolumeCurveLunchBreakData = ({ amClose, pmOpen, groupTimeList, groupDataList, startTime, currentTime }) => {
    if (!amClose.filteredMean || !pmOpen.filteredMean || groupTimeList.indexOf('amClose') >= 0 || groupTimeList.indexOf('pmOpen') >= 0 || moment(currentTime, 'HH:mm').isSameOrBefore(moment(startTime, 'HH:mm'))) {
      return { groupTimeList, groupDataList }
    }
    if (Math.round(amClose.filteredMean * 100) !== 0) {
      groupTimeList.push('amClose')
      groupDataList.push(roundTo(amClose.filteredMean * 100, 2))
    }
    if (Math.round(pmOpen.filteredMean * 100) !== 0) {
      groupTimeList.push('pmOpen')
      groupDataList.push(roundTo(pmOpen.filteredMean * 100, 2))
    }
    return { groupTimeList, groupDataList }
  }

  isInsertVolumeCurveData = ({ groupTimeList, endTime, currentTime }) => {
    if (groupTimeList.indexOf('amClose') < 0 && groupTimeList.indexOf('pmOpen') < 0) {
      return true
    }
    if (moment(currentTime, 'HH:mm').isSameOrAfter(moment(endTime, 'HH:mm'))) {
      return true
    }
    return false
  }

  isInsertVolatilityCurveData = ({ groupTimeList, endTime, currentTime }) => {
    if (groupTimeList.indexOf('amClose') < 0 && groupTimeList.indexOf('pmOpen') < 0) {
      return true
    }
    if (moment(currentTime, 'HH:mm').isSameOrAfter(moment(endTime, 'HH:mm'))) {
      return true
    }
    return false
  }

  handleVolatilityCurveLunchBreakData = async ({ amCloseValueTraded, pmOpenValueTraded, amCloseVolume, pmOpenVolume, data, times, currentTime, startTime }) => {
    if (!amCloseValueTraded || !pmOpenValueTraded || !amCloseVolume || !pmOpenVolume || times.includes('amClose') || times.includes('pmOpen') || moment(currentTime, 'HH:mm').isSameOrBefore(moment(startTime, 'HH:mm'))) {
      return { data, times }
    }
    let _prevItem = { ...data[data.length - 1] }
    let _price = amCloseVolume ? amCloseValueTraded / amCloseVolume : 0
    let _volatility = _price ? Math.abs(_price - _prevItem['price']) / _price : 0
    times.push('amClose')
    data.push({
      'price': _price,
      'volume': amCloseVolume,
      'volatility': _volatility
    })
    // _prevItem = { ...data[data.length - 1] }
    _prevItem = await this.getPreviousNonZeroPriceVolatilityData(data)
    _price = pmOpenVolume ? pmOpenValueTraded / pmOpenVolume : 0
    _volatility = _price && _prevItem ? Math.abs(_price - _prevItem['price']) / _price : 0
    times.push('pmOpen')
    data.push({
      'price': _price,
      'volume': amCloseVolume,
      'volatility': _volatility
    })
    return { data, times }
  }

  isInsertVolatilityDataList = ({ times, endTime, currentTime }) => {
    if (!times.includes('amClose') && !times.includes('pmOpen')) {
      return true
    }
    if (moment(currentTime, 'HH:mm').isSameOrAfter(moment(endTime, 'HH:mm'))) {
      return true
    }
    return false
  }

  processVolumeIntradayCurveData = async ({ groupTime, data, times, amOpen, amClose, pmOpen, pmClose, timeZone }) => {
    try {
      let groupTimeList = ['amOpen']
      let groupDataList = [roundTo(amOpen['filteredMean'] * 100, 2)]
      let sumData = 0
      let endTime = moment(moment(times[0]).format("MM/DD/YYYY HH:00")).add(moment.duration(parseInt(groupTime), 'minutes'))
      for (let i = 0; i < data.length; i++) {
        let rowData = 0
        let timeMoment = moment(times[i])
        if (data[i]) {
          rowData = data[i].filteredMean
        }
        if (moment(times[i]).isAfter(endTime)) {
          const res = this.handleVolumeCurveLunchBreakData({ amClose, pmOpen, groupTimeList, groupDataList, startTime: '10:30', currentTime: endTime.format('HH:mm') })
          groupTimeList = res['groupTimeList']
          groupDataList = res['groupDataList']
          if (this.isInsertVolumeCurveData({ groupTimeList, endTime: parseInt(groupTime) === 15 ? '11:45' : '12:00', currentTime: endTime.format('HH:mm') }) && Math.round(sumData * 100) !== 0) {
            groupTimeList.push(this.timezoneFormattor(endTime.format('HH:mm'), timeZone))
            groupDataList.push(roundTo(sumData * 100, 2))
          }
          sumData = 0
          const duration = moment.duration(timeMoment.diff(endTime));
          const mins = duration.asMinutes();
          if (mins > parseInt(groupTime)) {
            const dataPoints = Math.floor(mins / parseInt(groupTime))
            for (let i = 0; i < dataPoints; i++) {
              endTime = moment(endTime).add(moment.duration(parseInt(groupTime), 'minutes'))
              const res = this.handleVolumeCurveLunchBreakData({ amClose, pmOpen, groupTimeList, groupDataList, startTime: '10:30', currentTime: endTime.format('HH:mm') })
              groupTimeList = res['groupTimeList']
              groupDataList = res['groupDataList']

              if (this.isInsertVolumeCurveData({ groupTimeList, endTime: parseInt(groupTime) === 15 ? '11:45' : '12:00', currentTime: endTime.format('HH:mm') })) {
                // groupTimeList.push(this.timezoneFormattor(endTime.format('HH:mm'), timeZone))
                // groupDataList.push(0)
              }
            }
          }
          endTime = moment(endTime).add(moment.duration(parseInt(groupTime), 'minutes'))
        }
        sumData += rowData
      }

      if (sumData !== 0) {
        groupTimeList.push(this.timezoneFormattor(moment(endTime).format('HH:mm'), timeZone))
        groupDataList.push(roundTo(sumData * 100, 2))
      }
      // handle pmClose data point
      if (Math.round(pmClose.filteredMean * 100) !== 0) {
        groupTimeList.push('pmClose')
        groupDataList.push(roundTo(pmClose.filteredMean * 100, 2))
      }
      return { data: groupDataList, times: groupTimeList }
    } catch (error) {
      console.log(error)
    }
  }

  timezoneFormattor = (time, timeZone) => {
    return momentTz(time, 'HH:mm').tz(timeZone).format('HH:mm')
  }

  processSpreadData = async ({ averageData, volumeData, groupTime, timeZone }) => {
    const groupTimeList = []
    const groupDataList = []
    const { times, data: averageDataList } = averageData
    const { data, data: volumeDataList } = volumeData
    let volumeSum = 0
    let volumeAverageProductSum = 0
    let endTime = moment(times[0]).add(moment.duration(parseInt(groupTime), 'minutes'))

    for (let i = 0; i < averageDataList.length; i++) {
      let timeMoment = moment(times[i])
      const volumeData = volumeDataList[i] ? volumeDataList[i] : 0
      const averageData = averageDataList[i] ? averageDataList[i] : 0

      if (moment(times[i]).isAfter(endTime)) {
        // groupTimeList.push(this.timezoneFormattor(endTime.format('HH:mm'), timeZone))
        // groupDataList.push(volumeSum === 0 ? 0 : Math.round(volumeAverageProductSum / volumeSum))
        if (volumeSum !== 0 && Math.round(volumeAverageProductSum / volumeSum) !== 0) {
          groupTimeList.push(this.timezoneFormattor(endTime.format('HH:mm'), timeZone))
          groupDataList.push(roundTo(volumeAverageProductSum / volumeSum, 2))
        }
        volumeSum = 0
        volumeAverageProductSum = 0

        const duration = moment.duration(timeMoment.diff(endTime));
        const mins = duration.asMinutes();
        if (mins > parseInt(groupTime)) {
          const dataPoints = Math.floor(mins / parseInt(groupTime))
          for (let i = 0; i < dataPoints; i++) {
            endTime = moment(endTime).add(moment.duration(parseInt(groupTime), 'minutes'))
            // groupTimeList.push(this.timezoneFormattor(endTime.format('HH:mm'), timeZone))
            // groupDataList.push(0)
          }
        }
        endTime = moment(endTime).add(moment.duration(parseInt(groupTime), 'minutes'))
      }

      volumeSum += volumeData
      volumeAverageProductSum += averageData * volumeData
    }

    if (volumeSum !== 0 && Math.round(volumeAverageProductSum / volumeSum) !== 0) {
      groupTimeList.push(this.timezoneFormattor(moment(times[data.length - 1]).format('HH:mm'), timeZone))
      groupDataList.push(volumeSum === 0 ? 0 : roundTo(volumeAverageProductSum / volumeSum, 2))
    }
    return { data: groupDataList, times: groupTimeList }
  }

  processVolatilityData = async ({ valueTradedData, volumeData, groupTime, timeZone }) => {
    const breakTimeList = ['amOpen', 'amClose', 'pmOpen', 'pmClose']
    const groupTimeList = []
    const groupDataList = []
    const { data, times } = await this.computeVolatilityData({ valueTradedData, volumeData })
    let volumeSum = 0
    let volatilityAverageProductSum = 0
    let endTime = moment(times[0]).add(moment.duration(parseInt(groupTime), 'minutes'))
    for (let i = 0; i < times.length; i++) {
      let timeMoment = breakTimeList.includes(times[i]) ? times[i] : moment(times[i])
      const isBreakTimeInterval = breakTimeList.includes(times[i])
      const volumeData = data[i]['volume']
      const volatility = data[i]['volatility']

      if (isBreakTimeInterval) {
        if (times[i - 1] !== 'amClose') {
          // groupTimeList.push(this.timezoneFormattor(endTime.format('HH:mm'), timeZone))
          // groupDataList.push(volumeSum === 0 ? 0 : Math.round(volatilityAverageProductSum / volumeSum))
          if (volumeSum !== 0 && Math.round(volatilityAverageProductSum / volumeSum) !== 0) {
            groupTimeList.push(this.timezoneFormattor(endTime.format('HH:mm'), timeZone))
            groupDataList.push(roundTo(volatilityAverageProductSum / volumeSum, 2))
          }
          volumeSum = 0
          volatilityAverageProductSum = 0
          endTime = moment(endTime).add(moment.duration(parseInt(groupTime), 'minutes'))
        }
        groupTimeList.push(times[i])
        groupDataList.push(roundTo(volatility * 10000, 2))
        continue
      }

      if (moment(times[i]).isAfter(endTime)) {
        if (this.isInsertVolatilityCurveData({ groupTimeList, endTime: '11:45', currentTime: endTime.format('HH:mm') })) {
          // groupTimeList.push(this.timezoneFormattor(endTime.format('HH:mm'), timeZone))
          // groupDataList.push(volumeSum === 0 ? 0 : Math.round(volatilityAverageProductSum / volumeSum))
          if (volumeSum !== 0 && Math.round(volatilityAverageProductSum / volumeSum) !== 0) {
            groupTimeList.push(this.timezoneFormattor(endTime.format('HH:mm'), timeZone))
            groupDataList.push(roundTo(volatilityAverageProductSum / volumeSum, 2))
          }
        }
        volumeSum = 0
        volatilityAverageProductSum = 0
        const duration = moment.duration(timeMoment.diff(endTime));
        const mins = duration.asMinutes();

        if (mins > parseInt(groupTime)) {
          const dataPoints = Math.floor(mins / parseInt(groupTime))
          for (let i = 0; i < dataPoints; i++) {
            endTime = moment(endTime).add(moment.duration(parseInt(groupTime), 'minutes'))
            // if (this.isInsertVolatilityCurveData({ groupTimeList, endTime: '11:45', currentTime: endTime.format('HH:mm') })) {
            //   groupTimeList.push(this.timezoneFormattor(endTime.format('HH:mm'), timeZone))
            //   groupDataList.push(0)
            // }
          }
        }
        endTime = moment(endTime).add(moment.duration(parseInt(groupTime), 'minutes'))
      }
      volumeSum += volumeData
      volatilityAverageProductSum += volatility * volumeData * 10000
    }

    if (volumeSum !== 0 && Math.round(volatilityAverageProductSum / volumeSum) !== 0) {
      groupTimeList.push(this.timezoneFormattor(moment(times[data.length - 1]).format('HH:mm'), timeZone))
      groupDataList.push(roundTo(volatilityAverageProductSum / volumeSum, 2))
    }
    return ({ data: groupDataList, times: groupTimeList })
  }

  getPreviousNonZeroPriceVolatilityData = async (data) => {
    let _prevItem
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i]['price'] !== 0) {
        _prevItem = data[i]
        break
      }
    }
    return _prevItem ? _prevItem : null
  }

  computeVolatilityData = async ({ valueTradedData, volumeData }) => {
    const rawTimes = valueTradedData['times']
    const valueTradedRawData = valueTradedData['data']
    const volumeRawData = volumeData['data']

    const amOpenValueTraded = valueTradedData['amOpen']
    const amCloseValueTraded = valueTradedData['amClose']
    const pmOpenValueTraded = valueTradedData['pmOpen']
    const pmCloseValueTraded = valueTradedData['pmClose']

    const amOpenVolume = volumeData['amOpen']
    const amCloseVolume = volumeData['amClose']
    const pmOpenVolume = volumeData['pmOpen']
    const pmCloseVolume = volumeData['pmClose']

    let data = [{
      'price': amOpenVolume ? amOpenValueTraded / amOpenVolume : 0,
      'volume': amOpenVolume,
      'volatility': null
    }]
    let times = ['amOpen']

    for (let i = 0; i < rawTimes.length; i++) {
      // const _prevItem = data[data.length - 1]
      const _prevItem = await this.getPreviousNonZeroPriceVolatilityData(data)
      const _time = rawTimes[i]
      const _valueTradedData = valueTradedRawData[i]
      const _volumeData = volumeRawData[i]
      const _price = _volumeData ? _valueTradedData / _volumeData : 0
      const _volatility = (_price && _prevItem) ? Math.abs(_price - _prevItem['price']) / _price : 0
      const res = await this.handleVolatilityCurveLunchBreakData({
        amCloseValueTraded,
        pmOpenValueTraded,
        amCloseVolume,
        pmOpenVolume,
        data,
        times,
        currentTime: moment(_time).format('HH:mm'),
        startTime: '10:30'
      })
      data = res.data
      times = res.times
      if (this.isInsertVolatilityDataList({ times, endTime: '11:30', currentTime: moment(_time).format('HH:mm') })) {
        times.push(_time)
        data.push({ price: _price, volatility: _volatility, 'volume': _volumeData })
      }
    }

    const _prevItem = await this.getPreviousNonZeroPriceVolatilityData(data)
    const _lastPrice = pmCloseVolume ? pmCloseValueTraded / pmCloseVolume : 0
    const _lastVolatility = (_lastPrice && _prevItem) ? Math.abs(_lastPrice - _prevItem['price']) / _lastPrice : 0
    times.push('pmClose')
    data.push({ price: _lastPrice, volatility: _lastVolatility, 'volume': pmCloseVolume })
    // remove amOpen
    times.splice(0, 1)
    data.splice(0, 1)
    return { times, data }
  }

  @action
  toTradeSchedueDayOptionList = ({ dayList, tabValue }) => {
    if (dayList.length === 0) {
      return
    }
    const tradeSchedueDayOptionList = dayList.map((day, index) => {
      return { label: `Day${index + 1}`, value: day }
    })
    const pageData = tabValue === '1' ? this.singleStockPageData : this.portfolioPageData
    runInAction(() => {
      this.tradeSchedueDayOptionList = tradeSchedueDayOptionList
      pageData.processData.tradeSchedueDayOptionList = tradeSchedueDayOptionList
    })
  }

  @action
  resetSingleStockData = async () => {
    runInAction(() => {
      this.singleStockPageData.processData.tradeSchedueData = null
      this.singleStockPageData.processData.marketConditionData = null
      this.singleStockPageData.processData.optimizedParamsData = null
      this.singleStockPageData.apiResponse.optimizedParamsReponseErrorMsg = null
      this.singleStockPageData.processData.tradeSchedueDayOptionList = []
      this.singleStockPageData.processData.volumeCurveData = null
      this.singleStockPageData.processData.spreadCurveData = null
      this.singleStockPageData.processData.volatilityCurveData = null
      this.singleStockPageData.apiResponse.info = null
      this.singleStockPageData.apiResponse.analyticData = null
    })
  }

  @action
  resetPortfolioData = async () => {
    runInAction(() => {
      this.portfolioPageData.processData.tradeSchedueData = null
      this.portfolioPageData.processData.marketConditionData = null
      this.portfolioPageData.processData.optimizedParamsData = null
      this.portfolioPageData.apiResponse.optimizedParamsReponseErrorMsg = null
      this.portfolioPageData.processData.tradeSchedueDayOptionList = []
      this.portfolioPageData.processData.volumeCurveData = null
      this.portfolioPageData.processData.spreadCurveData = null
      this.portfolioPageData.processData.volatilityCurveData = null
      this.portfolioPageData.processData.portfolioBreakdownData = null
      this.portfolioPageData.processData.porfolioSummaryData = null
      this.portfolioPageData.processData.allOptimizedParamsData = []
    })
  }

  @action
  resetPortfolioExcelData = async () => {
    runInAction(() => {
      this.portfolioPageData.uploadedExcelData = null
    })
  }

  @action
  resetError = async () => {
    runInAction(() => {
      this.error = {}
    })
  }

  @action
  computeEstimateDuration = async (startTime) => {
    try {
      const infoDataList = this.portfolioPageData.apiResponse.info
      if (infoDataList.length === 0) {
        return
      }
      const tradeDetailTableData = this.tradeDetailTableData
      const dataList = tradeDetailTableData.dataList
      const aggregateData = tradeDetailTableData.aggregateData
      let maxEstimateDuration = 0
      for (let info of infoDataList) {
        const { countryCode, primaryRic } = info
        const timeZone = convertTimeZone({ countryCode })
        const analyticData = this.portfolioPageData.apiResponse.analyticData.find(data => data.symbol === primaryRic)
        const volumeCurveRawData = this.portfolioPageData.apiResponse.volumeCurveRawData.find(data => data.symbol === primaryRic)
        const qty = this.stockOptionList.find(data => data.value === primaryRic).quantity
        const adv = qty ? qty * 100 / analyticData.VOLUME_0.data[0] : 1 * 100 / analyticData.VOLUME_0.data[0]

        const { data, times, amOpen, amClose, pmOpen, pmClose } = volumeCurveRawData
        const transformedData = await this.processVolumeIntradayCurveData({ groupTime: 15, data, times, amOpen, amClose, pmOpen, pmClose, timeZone })
        const volumeData = transformedData.data
        const volumeTimes = transformedData.times
        const volumeCurveTotalDataPoint = volumeTimes.length
        let estimateDuration = 0
        const res = await this.processTradeEstimateData({ volumeData, times: volumeTimes, startTime, adv, groupTime: 15, timeZone, quantity: qty })
        for (let key in res) {
          const tradeEstimateTimeList = res[key].times
          const tradeEstimateDayDataPoint = tradeEstimateTimeList.length
          estimateDuration += (tradeEstimateDayDataPoint / volumeCurveTotalDataPoint)
        }
        const tradeDetailRecordFound = dataList.find((data) => {
          return data.symbol === primaryRic
        })
        if (!tradeDetailRecordFound) {
          continue
        }
        tradeDetailRecordFound.estimateDuration = roundTo(estimateDuration, 2)
        if (estimateDuration > maxEstimateDuration) {
          maxEstimateDuration = roundTo(estimateDuration, 2)
        }
      }
      aggregateData.maxEstimateDuration = maxEstimateDuration
      runInAction(() => {
        this.tradeDetailTableData.aggregateData = aggregateData
        this.tradeDetailTableData.dataList = dataList
      })
    } catch (error) {
      console.log('compute estimate duration error!')
      console.log(error)
    }
  }

  @action
  transformTradeEstimateData = async ({ groupTime, day, stock = null, startTime = moment().format('HH:mm'), quantity = 1, tabValue }) => {
    try {
      // generate volume curve data
      const pageData = tabValue === '1' ? this.singleStockPageData : this.portfolioPageData
      const volumeCurveRawData = stock ? pageData.apiResponse.volumeCurveRawData.find(data => data.symbol === stock) : pageData.apiResponse.volumeCurveRawData[0]
      const infoRawData = stock ? pageData.apiResponse.info.find(data => data.primaryRic === stock) : pageData.apiResponse.info[0]
      const countryCode = infoRawData.countryCode
      const timeZone = convertTimeZone({ countryCode })
      const { data, times, amOpen, amClose, pmOpen, pmClose } = volumeCurveRawData
      const tranformedData = await this.processVolumeIntradayCurveData({ groupTime, data, times, amOpen, amClose, pmOpen, pmClose, timeZone })
      // process trade estimate data
      const _data = tranformedData['data']
      const _times = tranformedData['times']
      const _tempAnalyticData = stock ? pageData.apiResponse.analyticData.find(data => data.symbol === stock) : pageData.apiResponse.analyticData[0]
      let qty
      let adv
      if (tabValue === '2') {
        qty = stock ? this.stockOptionList.find(data => data.value === stock).quantity : this.stockOptionList[0].quantity
        adv = qty ? qty * 100 / _tempAnalyticData.VOLUME_0.data[0] : 1 * 100 / _tempAnalyticData.VOLUME_0.data[0]
      } else {
        qty = quantity === 0 ? 1 : quantity
        adv = qty ? qty * 100 / _tempAnalyticData.VOLUME_0.data[0] : 1 * 100 / _tempAnalyticData.VOLUME_0.data[0]
      }
      // adv = quantity === 0 ? 1 * 100 / _tempAnalyticData.VOLUME_0.data[0] : quantity * 100 / _tempAnalyticData.VOLUME_0.data[0]
      const res = await this.processTradeEstimateData({ volumeData: _data, times: _times, startTime, adv, groupTime, timeZone, quantity: qty })
      runInAction(async () => {
        this.toTradeSchedueDayOptionList({ dayList: Object.keys(res).length ? Object.keys(res) : [], tabValue })
        this.tradeSchedueData = res[day] ? res[day] : res['day1']
        pageData.processData.tradeSchedueData = res[day] ? res[day] : res['day1']
        if (tabValue === '2') {
          pageData.processData.tradeSchedueAllDaysData = res
        }
      })
    } catch (error) {
      console.log(error)
      this.error['tradeSchedule'] = 'Transform trade schedule error!'
    }
  }

  @action
  testReset = () => {
    runInAction(() => {
      this.portfolioPageData.processData.tradeSchedueData = null
    })
  }

  processTradeEstimateData = async ({ volumeData, times, adv, startTime, groupTime, timeZone, quantity }) => {
    const _data = {}
    let _barDataList = []
    let _times = []
    let _accumlatedSumData = []
    let { index, remainTimeRatio } = this.computeTradeEstimateStartDataPoint({ startTime, times, groupTime, timeZone })
    let advDistributed = volumeData[index] * remainTimeRatio
    let accumlatedSum = 0
    let dayIndex = 1
    const totalAdv = adv
    while (adv > 0) {
      const advDiff = adv - advDistributed
      const barData = advDiff >= 0 ? advDistributed : adv
      const percentOrder = barData / totalAdv
      const estimateValue = quantity * percentOrder
      accumlatedSum += percentOrder
      _accumlatedSumData.push(accumlatedSum * 100)
      _barDataList.push(roundTo(estimateValue, 0))
      _times.push(times[index])
      adv = advDiff >= 0 ? advDiff : 0
      index++
      if (index > (times.length - 1) || adv === 0) {
        _data[`day${dayIndex}`] = { barDataList: [..._barDataList], times: [..._times], accumulatedDataList: [..._accumlatedSumData] }
        _times = []
        _barDataList = []
        _accumlatedSumData = []
        dayIndex++
        index = 0
      }
      advDistributed = volumeData[index]
    }
    return _data
  }

  computeTradeEstimateStartDataPoint = ({ startTime, times, groupTime, timeZone }) => {
    let index = 0
    let remainTimeRatio = 1
    for (let time of times) {
      switch (time) {
        case 'amOpen':
          let amOpenTime = times[0] === 'amOpen' ? moment(times[1], 'HH:mm').subtract(moment.duration(parseInt(groupTime), 'minutes')) : moment(times[0], 'HH:mm').subtract(moment.duration(parseInt(groupTime), 'minutes'))
          const ampOpenEndTime = this.timezoneFormattor('16:00', timeZone)
          if (moment(startTime, 'HH:mm').isBefore(amOpenTime) || moment(startTime, 'HH:mm').isAfter(moment(ampOpenEndTime, 'HH:mm'))) {
            return { index, remainTimeRatio }
          }
          break;
        case 'amClose':
        case 'pmOpen':
          const amCloseStartTime = this.timezoneFormattor('10:30', timeZone)
          const pmOpenEndTime = this.timezoneFormattor('11:30', timeZone)
          if (moment(startTime, 'HH:mm').isAfter(moment(amCloseStartTime, 'HH:mm')) && moment(startTime, 'HH:mm').isBefore(moment(pmOpenEndTime, 'HH:mm'))) {
            return { index, remainTimeRatio }
          }
          break;
        case 'pmClose':
          const pmCloseStartTime = this.timezoneFormattor('14:00', timeZone)
          const pmCloseEndTime = this.timezoneFormattor('16:00', timeZone)
          if (
            // moment(startTime, 'HH:mm').isSameOrAfter(moment(pmCloseStartTime, 'HH:mm')) &&
            moment(startTime, 'HH:mm').isSameOrBefore(moment(pmCloseEndTime, 'HH:mm'))
          ) {
            return { index, remainTimeRatio }
          }
          break;
        default:
          if (moment(time, 'HH:mm').isAfter(moment(startTime, 'HH:mm'))) {
            const duration = moment.duration(moment(time, 'HH:mm').diff(moment(startTime, 'HH:mm')));
            remainTimeRatio = duration.asMinutes() / groupTime
            return { index, remainTimeRatio }
          }
          break;
      }
      index++;
    }
  }

  initPortfolioBreakdownData = async () => {
    const portfolioBreakdownData = {
      'adv': {},
      'spread': {},
      'volatility': {},
      'country': {},
      'side': {}
    }
    advGraphConfigList.forEach((advGraphConfig) => {
      portfolioBreakdownData['adv'][advGraphConfig.label] = 0
    })
    spreadGraphConfigList.forEach((spreadGraphConfig) => {
      portfolioBreakdownData['spread'][spreadGraphConfig.label] = 0
    })
    volatilityGraphConfigList.forEach((volatilityGraphConfig) => {
      portfolioBreakdownData['volatility'][volatilityGraphConfig.label] = 0
    })
    return portfolioBreakdownData
  }

  discardPortfolioBreakdownZeroData = async (portfolioBreakdownData) => {
    for (const key in portfolioBreakdownData['adv']) {
      if (portfolioBreakdownData['adv'][key] === 0) {
        delete portfolioBreakdownData['adv'][key]
      }
    }
    for (const key in portfolioBreakdownData['spread']) {
      if (portfolioBreakdownData['spread'][key] === 0) {
        delete portfolioBreakdownData['spread'][key]
      }
    }
    for (const key in portfolioBreakdownData['volatility']) {
      if (portfolioBreakdownData['volatility'][key] === 0) {
        delete portfolioBreakdownData['volatility'][key]
      }
    }
    return portfolioBreakdownData
  }

  convertSideExcelInput = (sideExcelInput) => {
    return sideExcelInput && sideInputMapping[sideExcelInput.toLowerCase()] ? sideInputMapping[sideExcelInput.toLowerCase()] : 'Buy'
  }

  @action
  clearTradeDetailData = async () => {
    runInAction(() => {
      this.tradeDetailTableData = {
        dataList: [],
        aggregateData: {}
      }
    })
  }

  @action
  computePortfolioData = async (currencyCountry) => {
    let totalValueTraded = 0
    let avgVoatility = 0
    let avgAdv = 0
    let avgSpread = 0
    let avgMoo = 0
    let avgMoc = 0
    let totalQuantity = 0
    const pageData = this.getCurrentPageData()
    let totalStockNumber = 0
    const tradeDetailTableData = {
      dataList: [],
      aggregateData: {}
    }

    const portfolioBreakdownRawData = []
    let portfolioBreakdownData = await this.initPortfolioBreakdownData()
    const currencyFx = this.singleStockPageData.apiResponse.inputData.currencyFX
    try {
      totalStockNumber = pageData.apiResponse.info.length
      for (let excelData of pageData.uploadedExcelData.params) {
        const tempInfoData = pageData.apiResponse.info.find((data) => data.primaryRic === (excelData.ric || excelData.Symbol))
        const tempAnalyticData = pageData.apiResponse.analyticData.find((data) => data.symbol === (excelData.ric || excelData.Symbol))
        const tradeDetailRowRecord = {}
        if (tempInfoData) {
          const originCountry = tempInfoData.currency
          const toCountry = currencyCountry
          const originCountryRate = currencyFx.find((currencyOption => currencyOption._id === originCountry)).fx
          const toCountryRate = currencyFx.find((currencyOption => currencyOption._id === toCountry)).fx
          const currencyRate = convertCurrencyRate({ originCountry, originCountryRate, toCountryRate, toCountry })
          totalValueTraded += (tempInfoData['lastTrade'] * currencyRate) * (excelData['qty'] || excelData['OrderQty'])
          tempInfoData['valueTraded'] = (tempInfoData['lastTrade'] * currencyRate) * (excelData['qty'] || excelData['OrderQty'])
          totalQuantity += (excelData['qty'] || excelData['OrderQty'])

          tradeDetailRowRecord['id'] = tradeDetailTableData.dataList.length + 1
          tradeDetailRowRecord['name'] = tempInfoData['description']
          tradeDetailRowRecord['symbol'] = tempInfoData['primaryRic']
          tradeDetailRowRecord['country'] = tempInfoData['countryCode']
          tradeDetailRowRecord['sector'] = ''
          tradeDetailRowRecord['marketCap'] = ''
          tradeDetailRowRecord['side'] = excelData['Side'] ? excelData['Side'] : '-'
          tradeDetailRowRecord['orderType'] = excelData['OrdType'] ? excelData['OrdType'] : '-'
          tradeDetailRowRecord['price'] = excelData['Price'] ? excelData['Price'] : null
          tradeDetailRowRecord['strategy'] = excelData['Strategy'] ? excelData['Strategy'] : '-'

          tradeDetailRowRecord['shares'] = (excelData['qty'] || excelData['OrderQty'])
          tradeDetailRowRecord['valueTraded'] = tempInfoData['valueTraded']
        }

        if (tempAnalyticData) {
          const volatility = tempAnalyticData.CLOSE_VOLATILITY_0.data[0]
          const adv = (excelData['qty'] || excelData['OrderQty']) * 100 / tempAnalyticData.VOLUME_0.data[0]
          const spread = tempAnalyticData.AVERAGE_SPREAD_0.data[0]
          const moo = (tempAnalyticData.VOLUME_60.amOpen * 100) / tempAnalyticData.VOLUME_0.data[0]
          const moc = (tempAnalyticData.VOLUME_60.pmClose * 100) / tempAnalyticData.VOLUME_0.data[0]
          avgAdv += (tempInfoData['valueTraded'] * adv)
          avgVoatility += (tempInfoData['valueTraded'] * volatility)
          avgSpread += (tempInfoData['valueTraded'] * spread)
          avgMoo += (tempInfoData['valueTraded'] * moo)
          avgMoc += (tempInfoData['valueTraded'] * moc)

          tradeDetailRowRecord['adv'] = `${roundTo(adv, 2)}`
          tradeDetailRowRecord['spread'] = `${roundTo(spread, 2)}`
          tradeDetailRowRecord['volatility'] = `${roundTo(volatility * 100, 2)}`
          tradeDetailRowRecord['performanceEstimate'] = ''
          tradeDetailRowRecord['moo'] = `${roundTo(moo, 2)}`
          tradeDetailRowRecord['moc'] = `${roundTo(moc, 2)}`

          portfolioBreakdownRawData.push({
            stock: tempAnalyticData['symbol'],
            country: tempInfoData['countryCode'],
            side: this.convertSideExcelInput(excelData['side'] || excelData['Side']),
            volatility,
            adv,
            spread,
            valueTraded: tempInfoData['valueTraded']
          })
        }

        if (Object.keys(tradeDetailRowRecord).length > 0) {
          tradeDetailTableData.dataList.push(tradeDetailRowRecord)
        }
      }
      if (totalValueTraded === 0) {
        avgVoatility = 0
        avgAdv = 0
        avgSpread = 0
        avgMoo = 0
        avgMoc = 0
      } else {
        avgVoatility /= totalValueTraded
        avgAdv /= totalValueTraded
        avgSpread /= totalValueTraded
        avgMoc /= totalValueTraded
        avgMoo /= totalValueTraded
      }

      for (let tradeDetailRowData of tradeDetailTableData.dataList) {
        const valueTraded = tradeDetailRowData['valueTraded']
        const portfolioPercentage = totalValueTraded > 0 ? valueTraded / totalValueTraded : 0
        tradeDetailRowData['portfolioPercentage'] = roundTo(portfolioPercentage * 100, 2)
      }

      tradeDetailTableData.aggregateData['totalShares'] = totalQuantity
      tradeDetailTableData.aggregateData['totalValueTraded'] = roundTo(totalValueTraded, 2)
      tradeDetailTableData.aggregateData['avgAdv'] = roundTo(avgAdv, 2)
      tradeDetailTableData.aggregateData['avgSpread'] = roundTo(avgSpread, 2)
      tradeDetailTableData.aggregateData['avgVoatility'] = roundTo(avgVoatility * 100, 2)
      tradeDetailTableData.aggregateData['avgMoc'] = roundTo(avgMoc, 2)
      tradeDetailTableData.aggregateData['avgMoo'] = roundTo(avgMoo, 2)
      for (const data of portfolioBreakdownRawData) {
        const percentValueTraded = data['valueTraded'] / totalValueTraded
        const advConfigFound = advGraphConfigList.find(advGraphConfig => (data['adv'] >= advGraphConfig.lowestValue && data['adv'] < advGraphConfig.upperValue))
        const spreadConfigFound = spreadGraphConfigList.find(spreadGraphConfig => (data['spread'] >= spreadGraphConfig.lowestValue && data['spread'] < spreadGraphConfig.upperValue))
        const volatilityConfigFound = volatilityGraphConfigList.find(volatilityGraphConfig => (data['volatility'] * 100 >= volatilityGraphConfig.lowestValue && data['volatility'] * 100 < volatilityGraphConfig.upperValue))

        if (!portfolioBreakdownData['country'][data['country']]) {
          portfolioBreakdownData['country'][data['country']] = 0
        }
        if (!portfolioBreakdownData['side'][data['side']]) {
          portfolioBreakdownData['side'][data['side']] = 0
        }
        portfolioBreakdownData['adv'][advConfigFound['label']] += percentValueTraded
        portfolioBreakdownData['spread'][spreadConfigFound['label']] += percentValueTraded
        portfolioBreakdownData['volatility'][volatilityConfigFound['label']] += percentValueTraded
        portfolioBreakdownData['country'][data['country']] += percentValueTraded
        portfolioBreakdownData['side'][data['side']] += percentValueTraded
      }
      portfolioBreakdownData = await this.discardPortfolioBreakdownZeroData(portfolioBreakdownData)
    } catch (error) {
      this.error['portfolio'] = 'Portfolio calculation error!'
      console.log('compute portfolio params errors!')
      console.log(error)
    }
    runInAction(() => {
      this.porfolioSummaryData = {
        totalValueTraded,
        totalStockNumber,
        totalQuantity,
        avgVoatility,
        avgAdv,
        avgSpread
      }
      pageData.processData.porfolioSummaryData = {
        totalValueTraded,
        totalStockNumber,
        totalQuantity,
        avgVoatility,
        avgAdv,
        avgSpread
      }
      this.tradeDetailTableData = tradeDetailTableData
      this.totalValueTraded = totalValueTraded
      this.portfolioBreakdownData = portfolioBreakdownData
      pageData.processData.portfolioBreakdownData = portfolioBreakdownData
    })
  }

  @action
  clearTradeDetailsData = async () => {
    runInAction(() => {
      this.tradeDetailTableData = {
        dataList: [],
        aggregateData: {}
      }
    })
  }

  @action
  getPortfolioApiParams (paramTargetList, isIncludeOptimizedParams = false) {
    const stockInfoList = this.portfolioPageData.uploadedExcelData.params.map((data) => {
      let result = {}
      if (paramTargetList.indexOf(portfolioApiParamsMap.PRIMARY_RIC) >= 0) {
        result['primaryRic'] = data['ric'] || data['Symbol']
        result['primaryRic'] = `${result['primaryRic']}`
      }
      if (paramTargetList.indexOf(portfolioApiParamsMap.SYMBOL) >= 0) {
        result['symbol'] = data['ric'] || data['Symbol']
        result['symbol'] = `${result['symbol']}`
      }
      if (paramTargetList.indexOf(portfolioApiParamsMap.Symbol) >= 0) {
        result['Symbol'] = data['ric'] || data['Symbol']
        result['symbol'] = `${result['symbol']}`
      }
      if (paramTargetList.indexOf(portfolioApiParamsMap.QUANTITY) >= 0) {
        result['qty'] = data['qty'] || data['OrderQty']
      }
      if (paramTargetList.indexOf(portfolioApiParamsMap.OrderQty) >= 0) {
        result['OrderQty'] = data['qty'] || data['OrderQty']
      }
      if (paramTargetList.indexOf(portfolioApiParamsMap.SIDE) >= 0) {
        // result['side'] = this.convertSideExcelInput(data['side']) || this.convertSideExcelInput(data['Side'])
        result['side'] = data['Side']
      }
      if (paramTargetList.indexOf(portfolioApiParamsMap.Side) >= 0) {
        result['Side'] = data['Side']
        // result['Side'] = this.convertSideExcelInput(data['side']) || this.convertSideExcelInput(data['Side'])
      }
      if (paramTargetList.indexOf(portfolioApiParamsMap.ORDER_TYPE) >= 0) {
        result['orderType'] = data['orderType'] || data['OrdType']
      }
      if (paramTargetList.indexOf(portfolioApiParamsMap.OrdType) >= 0) {
        result['OrdType'] = data['orderType'] || data['OrdType']
      }
      if (paramTargetList.indexOf(portfolioApiParamsMap.PRICE) >= 0) {
        result['price'] = data['price'] || data['Price']
      }
      if (paramTargetList.indexOf(portfolioApiParamsMap.Price) >= 0) {
        result['Price'] = data['price'] || data['Price']
      }
      if (paramTargetList.indexOf(portfolioApiParamsMap.START_TIME) >= 0) {
        result['startTime'] = '09:00'
      }

      if (isIncludeOptimizedParams) {
        for (let excelFieldName of Object.keys(data)) {
          if (data['Strategy']) {
            result['Strategy'] = data['Strategy']
          }
          let isCustomerIdValid = false
          if (data['CustomerId']) {
            this.singleStockPageData.processData.customerIdList.forEach((option) => {
              if (option.label === data['CustomerId']) {
                isCustomerIdValid = true
                data['CustomerId'] = option.value
              }
            })
          }
          result['CustomerId'] = isCustomerIdValid ? data['CustomerId'] : ''

          if (this.clientInputFieldList.includes(excelFieldName)) {
            result[excelFieldName] = data[excelFieldName]
          }
          const additionalParamFound = this.additionalParamsList.find((additionalParamsData) => {
            return additionalParamsData.Parameter === excelFieldName
          })
          if (additionalParamFound) {
            result[additionalParamFound.Parameter] = data[additionalParamFound.Parameter]
          }
        }
      }
      result = R.reject(R.equals(''))(result)
      return result
    })
    return stockInfoList
  }

  @action
  clearError = async (errorType = 'ALL') => {
    runInAction(() => {
      switch (errorType) {
        case 'ALL':
          this.error = {}
          break;
        default:
          this.error[errorType] = null
          break;
      }
    })
  }
}

export default CommonStore
