import '@node_modules/react-grid-layout/css/styles.css'
import '@node_modules/react-resizable/css/styles.css'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState, useRef } from 'react'
import useStores from '@src/utils/hooks/useStores'
import { Observer } from 'mobx-react'
import DataTable from '@src/components/list/dataTableView'
import MuiDataTable from '@src/components/list/muiDataTableView'
import html2canvas from 'html2canvas'
import Logo from '@public/images/logo.png'
import Image from 'next/image'
import JsPDF from 'jspdf'
import * as R from 'ramda'
import { toJS } from 'mobx'

import SingleStockGrid from '@src/components/grids/singleStockGrid'
import PortfolioGrid from '@src/components/grids/portfolioGrid'
import { portfolioApiParamsMap, defaultSaveLayoutValue, defaultMarketConditionType } from '@src/configs/commonConfig'
import MessageDialog from '@src/components/dialogs/messageDialog'
import ExcelInputErrorDialog from '@src/components/dialogs/excelInputErrorDialog'
import ProcessingDialog from '@src/components/dialogs/processingDialog'
import DeleteConfirmationDialog from '@src/components/dialogs/deleteConfirmationDialog'
import { defaultViewVisbleConfig } from '@src/configs/gridViewConfig'
import FormDialog from '@src/components/dialogs/customFormDialog'
import AdditionalParameterForm from '@src/components/form/additionalParameterForm'
import ClientConfigSettingsForm from '@src/components/form/ClientConfigSettingsForm'
import InputBar from '@src/components/layouts/inputBar'
import AppBar from '@src/components/layouts/appBar'
import ActionBar from '@src/components/layouts/actionBar'
import Footer from '@src/components/layouts/footer'
import { SINGLE_STOCK, PORTFOLIO, TRADE_DETAIL, ALL_PORTFOLIO } from '@src/constants/values'
import SaveProfileDialog from '@src/components/dialogs/saveProfileDialog'
import LoginAuthLayout from '@src/components/layouts/loginAuthLayout'
import CloseFormConfirmationDialog from '@src/components/dialogs/closeFormConfirmationDialog'
import { setLocalStorage, getLocalStorage } from '@src/utils/commonUtil'
import envConfig from '@src/configs/envConfig'
import CircularProgress from '@mui/material/CircularProgress'
import dayjs from "dayjs"
import { saveLayoutOptionList } from '@src/configs/commonConfig'
import ErrorDialog from '@src/components/dialogs/errorDialog'
import EditProfileNameDialog from '@src/components/dialogs/editProfileNameDialog'
import moment from 'moment/moment'
import { createActionLoggerRecord } from '@src/api/common/createActionLoggerRecord'
import { ConvertInputForm } from '@src/utils/convertInputForm'
import { ExcelDataComparer } from '@src/utils/excelDataComparer'

export default function Home (props) {
  const router = useRouter()
  const { commonStore, authStore } = useStores()
  const [isReady, setReady] = useState(false)
  const [portfolioPageStatus, setPortfolioStatus] = useState(PORTFOLIO)
  const [isSinglePageReady, setSinglePageReady] = useState(false)
  const [isPortfolioPageReady, setPortfolioPageReady] = useState(false)
  const [currencyCountry, setCurrencyCountry] = useState('HKD')
  const [marketConditionType, setMarketConditionType] = useState(defaultMarketConditionType)
  const [isHistoryBoxOpened, setHistoryBoxOpen] = useState(false)
  const [saveMode, setSaveMode] = useState(defaultSaveLayoutValue)
  const [messageType, setMessageType] = useState('')
  const [isMessageDialogOpened, setMessageDialog] = useState(false)
  const [isConfirmDeleteFileDialog, setConfirmDeleteFileDialog] = useState(false)
  const [isConfirmDeleteProfileDialog, setConfirmDeleteProfileDialog] = useState(false)
  const [isExcelErrorDialog, setExcelErrorDialog] = useState(false)
  const [excelErrorMessage, setExcelErrorMessage] = useState('')
  const [isProcessDialogOpened, setProcessDialog] = useState(false)
  const [isSaveProfileDialogOpened, setSaveProfileDialog] = useState(false)
  const [tabValue, setTabValue] = useState(router.query.tab ? router.query.tab : '1')
  const [additionalFormDialogOpened, setAdditionalFormDialog] = useState(false)
  const [clientConfigFormDialogOpened, setClientConfigFormDialog] = useState(false)
  const [additionalConfirmParamsDialogOpened, setConfirmAdditionalParamsDialog] = useState(false)
  const [clientConfigConfirmDialogOpened, setConfirmClientConfigParamsDialog] = useState(false)
  const [singleStockProfile, setSingleStockProfile] = useState('')
  const [portfolioProfile, setPortfolioProfile] = useState('')
  const [sinlgeStockViewVisble, setSingleStockViewVisble] = useState(defaultViewVisbleConfig)
  const [portfolioViewVisble, setPortfolioViewVisble] = useState(defaultViewVisbleConfig)
  const [saveProfileName, setSaveProfileName] = useState('')
  const [isDraggable, setDraggable] = useState(false)
  const [isPrintPortfolioPdf, setPrintPortfolioPdf] = useState(false)
  const [isPdfTitleShow, setPdfTitleShow] = useState(false)
  const [isSingleStockOptimizedGridShow, setSingleStockOptimizedGridShow] = useState(false)
  const [isPortfolioOptimizedGridShow, setPortfolioOptimizedGridShow] = useState(false)
  const [exportFileMode, setExportFileMode] = useState(PORTFOLIO)
  const [isPorfolioOptimizedDataReady, setPortfolioOptimizedDataReady] = useState(false)
  const [singleStockLayout, setSingleStockLayout] = useState([])
  const [portfolioLayout, setPortfolioLayout] = useState([])
  const [singleStockProfileOptionList, setSingleStockProfileOptionList] = useState([])
  const [portfolioProfileOptionList, setPortfolioProfileOptionList] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [isLoadShareLink, setLoadShareLink] = useState(props.sharedLinkId ? true : false)
  const [isErrorDialogOpened, setErrorDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [errorMessageType, setErrorMessageType] = useState('')
  const [isEditProfileNameDialogOpened, setEditProfileNameDialog] = useState(false)

  let additionalParamsFormikProps = null
  let clientConfigFormikProps = null
  let inputFieldFormikProps = null
  let widgetSinglePrevRef = useRef(defaultViewVisbleConfig);
  let widgetPortfolioPrevRef = useRef(defaultViewVisbleConfig);

  // useEffect(() => {
  //
  //   if(widgetPortfolioPrevRef.current.INSTRUMENT_CHARACTERISTICS !== portfolioViewVisble.INSTRUMENT_CHARACTERISTICS){
  //
  //     let widget = portfolioViewVisble.INSTRUMENT_CHARACTERISTICS? 'ON': 'OFF'
  //
  //     createActionLoggerRecord({
  //       action: 'ToggleWidget',
  //       msg: 'Instrument Characteristics=' + widget
  //     })
  //   }
  //
  //   if(widgetPortfolioPrevRef.current.HISTORICAL_INTRADAY_PROFILES !== portfolioViewVisble.HISTORICAL_INTRADAY_PROFILES){
  //
  //     let widget = portfolioViewVisble.HISTORICAL_INTRADAY_PROFILES? 'ON': 'OFF'
  //
  //     createActionLoggerRecord({
  //       action: 'ToggleWidget',
  //       msg: 'Historical Intraday Profiles=' + widget
  //     })
  //   }
  //
  //   if(widgetPortfolioPrevRef.current.TRADE_SCHEDULE_ESTIMATE !== portfolioViewVisble.TRADE_SCHEDULE_ESTIMATE){
  //
  //     let widget = portfolioViewVisble.TRADE_SCHEDULE_ESTIMATE? 'ON': 'OFF'
  //
  //     createActionLoggerRecord({
  //       action: 'ToggleWidget',
  //       msg: 'Trade Schedule Estimate=' + widget
  //     })
  //   }
  //
  //   if(widgetPortfolioPrevRef.current.OPTIMIZED_PARAMETERS !== portfolioViewVisble.OPTIMIZED_PARAMETERS){
  //
  //     let widget = portfolioViewVisble.OPTIMIZED_PARAMETERS? 'ON': 'OFF'
  //
  //     createActionLoggerRecord({
  //       action: 'ToggleWidget',
  //       msg: 'Optimized Parameters=' + widget
  //     })
  //   }
  //
  //   if(widgetPortfolioPrevRef.current.PORTFOLIO_BREAKDOWN !== portfolioViewVisble.PORTFOLIO_BREAKDOWN){
  //
  //     let widget = portfolioViewVisble.PORTFOLIO_BREAKDOWN? 'ON': 'OFF'
  //
  //     createActionLoggerRecord({
  //       action: 'ToggleWidget',
  //       msg: 'Portfolio Breakdown=' + widget
  //     })
  //   }
  //
  //   if(widgetPortfolioPrevRef.current.PORTFOLIO_SUMMARY !== portfolioViewVisble.PORTFOLIO_SUMMARY){
  //
  //     let widget = portfolioViewVisble.PORTFOLIO_SUMMARY? 'ON': 'OFF'
  //
  //     createActionLoggerRecord({
  //       action: 'ToggleWidget',
  //       msg: 'Portfolio Summary=' + widget
  //     })
  //   }
  //
  //   if(widgetPortfolioPrevRef.current.MARKET_CONDITION_INDICATORS !== portfolioViewVisble.MARKET_CONDITION_INDICATORS){
  //
  //     let widget = portfolioViewVisble.MARKET_CONDITION_INDICATORS? 'ON': 'OFF'
  //
  //     createActionLoggerRecord({
  //       action: 'ToggleWidget',
  //       msg: 'Market Condition Indicators=' + widget
  //     })
  //   }
  //
  //   widgetPortfolioPrevRef.current = portfolioViewVisble;
  // }, [portfolioViewVisble]);
  //
  // useEffect(() => {
  //
  //   if(portfolioPageStatus === 'TRADE_DETAIL'){
  //
  //     createActionLoggerRecord({
  //       action: 'TradeDetails',
  //       msg: commonStore.portfolioPageData.uploadedExcelData.excel_filename
  //     })
  //   }
  //
  // }, [portfolioPageStatus])
  //
  // useEffect(() => {
  //
  //   if(widgetSinglePrevRef.current.INSTRUMENT_CHARACTERISTICS !== sinlgeStockViewVisble.INSTRUMENT_CHARACTERISTICS){
  //
  //     let widget = sinlgeStockViewVisble.INSTRUMENT_CHARACTERISTICS? 'ON': 'OFF'
  //
  //     createActionLoggerRecord({
  //       action: 'ToggleWidget',
  //       msg: 'Instrument Characteristics=' + widget
  //     })
  //   }
  //
  //   if(widgetSinglePrevRef.current.HISTORICAL_INTRADAY_PROFILES !== sinlgeStockViewVisble.HISTORICAL_INTRADAY_PROFILES){
  //
  //     let widget = sinlgeStockViewVisble.HISTORICAL_INTRADAY_PROFILES? 'ON': 'OFF'
  //
  //     createActionLoggerRecord({
  //       action: 'ToggleWidget',
  //       msg: 'Historical Intraday Profiles=' + widget
  //     })
  //   }
  //
  //   if(widgetSinglePrevRef.current.TRADE_SCHEDULE_ESTIMATE !== sinlgeStockViewVisble.TRADE_SCHEDULE_ESTIMATE){
  //
  //     let widget = sinlgeStockViewVisble.TRADE_SCHEDULE_ESTIMATE? 'ON': 'OFF'
  //
  //     createActionLoggerRecord({
  //       action: 'ToggleWidget',
  //       msg: 'Trade Schedule Estimate=' + widget
  //     })
  //   }
  //
  //   if(widgetSinglePrevRef.current.OPTIMIZED_PARAMETERS !== sinlgeStockViewVisble.OPTIMIZED_PARAMETERS){
  //
  //     let widget = sinlgeStockViewVisble.OPTIMIZED_PARAMETERS? 'ON': 'OFF'
  //
  //     createActionLoggerRecord({
  //       action: 'ToggleWidget',
  //       msg: 'Optimized Parameters=' + widget
  //     })
  //   }
  //
  //   if(widgetSinglePrevRef.current.PORTFOLIO_BREAKDOWN !== sinlgeStockViewVisble.PORTFOLIO_BREAKDOWN){
  //
  //     let widget = sinlgeStockViewVisble.PORTFOLIO_BREAKDOWN? 'ON': 'OFF'
  //
  //     createActionLoggerRecord({
  //       action: 'ToggleWidget',
  //       msg: 'Portfolio Breakdown=' + widget
  //     })
  //   }
  //
  //   if(widgetSinglePrevRef.current.PORTFOLIO_SUMMARY !== sinlgeStockViewVisble.PORTFOLIO_SUMMARY){
  //
  //     let widget = sinlgeStockViewVisble.PORTFOLIO_SUMMARY? 'ON': 'OFF'
  //
  //     createActionLoggerRecord({
  //       action: 'ToggleWidget',
  //       msg: 'Portfolio Summary=' + widget
  //     })
  //   }
  //
  //   if(widgetSinglePrevRef.current.MARKET_CONDITION_INDICATORS !== sinlgeStockViewVisble.MARKET_CONDITION_INDICATORS){
  //
  //     let widget = sinlgeStockViewVisble.MARKET_CONDITION_INDICATORS? 'ON': 'OFF'
  //
  //     createActionLoggerRecord({
  //       action: 'ToggleWidget',
  //       msg: 'Market Condition Indicators=' + widget
  //     })
  //   }
  //
  //   widgetSinglePrevRef.current = sinlgeStockViewVisble;
  // }, [sinlgeStockViewVisble]);

  useEffect(() => {
    window.scrollTo(0, 0)
    window.addEventListener("click", function (event) {
      setLocalStorage('userId', getLocalStorage('userId'), envConfig.authenticationTimeout)
    })
    window.addEventListener("scroll", function (event) {
      setLocalStorage('userId', getLocalStorage('userId'), envConfig.authenticationTimeout)
    })
    setInterval(function () {
      if (window.location.pathname !== '/login') {
        if (!getLocalStorage('userId')) {
          authStore.logout()
        }
      }
    }, 60000)
  }, [])

  const handleCloseErrorDialog = useCallback(() => {
    switch (errorMessageType) {
      case 'SHARE_LINK':
        commonStore.clearShareLinkError()
        router.push('/')
        break;
      case 'DELETE_PROFILE':
        commonStore.clearError('layout')
        break;
      default:
        break;
    }

  }, [errorMessageType])

  useEffect(() => {
    if (props.sharedLinkId && !isLoading && isLoadShareLink) {
      initShareLinkData(props.sharedLinkId)
    }
  }, [props.sharedLinkId, isLoading])

  const initShareLinkData = useCallback(async (id) => {
    await commonStore.fetchShareLinkData(id)
    if (commonStore.error['shareLink']) {
      setErrorMessage(commonStore.error['shareLink'])
      setErrorMessageType('SHARE_LINK')
      setErrorDialog(true)
      return
    }
    await setAdditionalForm()
    setTabValue(commonStore.currentPage === SINGLE_STOCK ? '1' : '2')
    setPortfolioViewVisble(commonStore.portfolioPageData.viewVisble)
    setSingleStockViewVisble(commonStore.singleStockPageData.viewVisble)

    setSingleStockOptimizedGridShow(commonStore.singleStockPageData.params.pageReady.isSingleStockOptimizedGridShow)
    setPortfolioOptimizedGridShow(commonStore.portfolioPageData.params.pageReady.isPortfolioOptimizedGridShow)
    setPortfolioOptimizedDataReady(commonStore.portfolioPageData.params.pageReady.isPorfolioOptimizedDataReady)
    setSingleStockLayout(commonStore.singleStockPageData.layout)
    setPortfolioLayout(commonStore.portfolioPageData.layout)
    setSinglePageReady(commonStore.singleStockPageData.params.pageReady.isSinglePageReady)
    setPortfolioPageReady(commonStore.portfolioPageData.params.pageReady.isPortfolioPageReady)
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoadShareLink(false)
  }, [])

  const initPickerState = useCallback(async () => {
    if (commonStore.singleStockPageData.profilePickerOptionList.length === 0 || commonStore.portfolioPageData.profilePickerOptionList.length === 0) {
      setLoading(false)
    }
    if (commonStore.singleStockPageData.profilePickerOptionList.length) {
      setSingleStockProfileOptionList(commonStore.singleStockPageData.profilePickerOptionList)
      setSingleStockProfile(commonStore.singleStockPageData.lastUsedProfile)
    }
    if (commonStore.portfolioPageData.profilePickerOptionList.length) {
      setPortfolioProfileOptionList(commonStore.portfolioPageData.profilePickerOptionList)
      setPortfolioProfile(commonStore.portfolioPageData.lastUsedProfile)
    }
  }, [])

  const init = useCallback(async () => {
    await commonStore.fetchInputData()
    await commonStore.getUserProfileLayout()
    await initPickerState()
    if (!isLoadShareLink) {
      const singleStockLastUsedProfile = commonStore.singleStockPageData.lastUsedProfile
      const portfolioLastUsedProfile = commonStore.portfolioPageData.lastUsedProfile
      handleSingleProfileChange(singleStockLastUsedProfile)
      handlePortfolioProfileChange(portfolioLastUsedProfile)
    }
    setReady(true)
  }, [isLoadShareLink])

  const resetAdditionalForm = useCallback(async () => {
    await commonStore.clearSelectedAdditionalParams()
    await commonStore.clearSelectedAdditionParamsInitValue()
    await commonStore.toadditionalParamsOptionList()
    await commonStore.resetAdditionalPreviewForm()
    await commonStore.resetAdditionalForm()
  }, [])

  const setAdditionalForm = useCallback(async () => {
    const additionalForm = commonStore.singleStockPageData.additionalForm
    commonStore.setTempSaveAdditionalParamsPeviewForm(additionalForm)
    for (const key in additionalForm) {
      await commonStore.setAdditionalParamsSelectedList(key, additionalForm[key])
      await commonStore.removeAdditionParamsOptionListItem(key)
    }
    commonStore.setAdditionalForm(additionalForm)
  }, [])

  const readInputFormFieldData = useCallback(async () => {
    if (commonStore.singleStockPageData.profileInput && Object.keys(commonStore.singleStockPageData.profileInput).length > 0) {
      await resetAdditionalForm()
      await setAdditionalForm()
      const inputForm = {
        stock: commonStore.singleStockPageData.profileInput.ric,
        quantity: commonStore.singleStockPageData.profileInput.qty,
      }
      const optimizedForm = commonStore.singleStockPageData.optimizedForm
      const clientConfigFormData = commonStore.singleStockPageData.clientConfigFormData
      await commonStore.setInputFieldForm(inputForm)
      await commonStore.setOptimizedParamsForm(optimizedForm)
      if (commonStore.optimizedInputParamsFormikProps) {
        await commonStore.optimizedInputParamsFormikProps.resetForm()
      }
      if (clientConfigFormData) {
        await commonStore.setClientConfigForm(clientConfigFormData)
      }
    }
  }, [])

  useEffect(() => {
    init()
    setLoading(false)
  }, [])

  useEffect(() => {
    commonStore.setSinglePageReadyParams({ isSinglePageReady, isSingleStockOptimizedGridShow })
  }, [isSinglePageReady, isSingleStockOptimizedGridShow])

  useEffect(() => {
    commonStore.setPortfoliReadyParams({ isPortfolioPageReady, isPortfolioOptimizedGridShow, isPorfolioOptimizedDataReady })
  }, [isPortfolioPageReady, isPortfolioOptimizedGridShow, isPorfolioOptimizedDataReady])

  const handleSingleProfileChange = useCallback(async (singleStockProfile) => {
    if (tabValue === '2') {
      return
    }
    if (singleStockProfile) {
      await commonStore.setSingleProfileData(singleStockProfile)
      setSingleStockLayout(commonStore.singleStockPageData.layout)
      await readInputFormFieldData()
      setSingleStockViewVisble(commonStore.singleStockPageData.viewVisble)
    } else {
      commonStore.setSingleStockTemplateProfileData({ isSingleStockOptimizedGridShow })
      setSingleStockLayout(commonStore.singleStockPageData.layout)
      return
    }

    const inputForm = commonStore.inputFieldForm
    if (inputForm) {
      const { quantity, stock } = inputForm
      if (quantity && stock) {
        handleSubmitSingleStockAction({ quantity, stock })
      } else {
        handleClearSingleStockAction()
      }
    }
  }, [tabValue])

  const handlePortfolioProfileChange = useCallback((portfolioProfile) => {
    if (portfolioProfile) {
      commonStore.setPortfolioProfileData(portfolioProfile)
      setPortfolioLayout(commonStore.portfolioPageData.layout)
      setPortfolioViewVisble(commonStore.portfolioPageData.viewVisble)
    } else {
      commonStore.setPortfolioTemplateProfileData()
      setPortfolioLayout(commonStore.portfolioPageData.layout)
      return
    }
    if (tabValue === '1') {
      return
    }
    const excelInputData = commonStore.portfolioPageData.uploadedExcelData
    if (!excelInputData || Object.keys(excelInputData).length === 0) {
      handleClearPortfolioAction()
    }
    if (excelInputData && Object.keys(excelInputData).length > 0) {
      handlePortfolioRunClick()
    }
  }, [portfolioProfile, tabValue])

  useEffect(() => {
    // if (isLoadShareLink) {
    //   return
    // }
    // handlePortfolioProfileChange()
  }, [portfolioProfile])

  useEffect(() => {
    commonStore.setCurrentPage(tabValue === '1' ? SINGLE_STOCK : PORTFOLIO)
  }, [tabValue])

  const checkIsValidOptimizedParamsForm = useCallback((values) => {
    const { orderType, price, strategy, side } = values
    if (!orderType || !strategy || !side) {
      return false
    }
    if (orderType === 'LIMIT' && !price) {
      return false
    }
    return true
  }, [])

  const checkIsRequiredSingleOptimizedParamsForm = useCallback((values) => {
    const { orderType, strategy, side } = values
    return orderType || strategy || side
  })

  const checkIsOptimizedFormEmpty = useCallback((values) => {
    const { orderType, price, side, strategy } = values
    if (!orderType && !price && !side && !strategy) {
      return true
    }
    return false
  }, [])

  const checkIsClientConfigFormEmpty = useCallback((values) => {
    const { CustomerId, SpectrumUrgency, Text } = values
    if (!CustomerId && !SpectrumUrgency && !Text) {
      return true
    }
    return false
  }, [])

  const handleSubmitSingleStockAction = useCallback(
    async (values) => {
      if (tabValue === '2') {
        return
      }

      await commonStore.resetSingleStockData()

      // handle optimized params grid
      const optimizedForm = commonStore.optimizedInputParamsForm
      const additionalParamsForm = commonStore.additionalParamsForm
      const clientConfigForm = commonStore.clientConfigSettingsForm
      const isRequiredOptimizedParamsForm = checkIsRequiredSingleOptimizedParamsForm(optimizedForm)
      const isValidOptimizedParamsForm = isRequiredOptimizedParamsForm ? checkIsValidOptimizedParamsForm(optimizedForm) : false
      const isAdditionalParamsFormEmpty = Object.keys(additionalParamsForm).length === 0
      const isOptimizedFormEmpty = checkIsOptimizedFormEmpty(optimizedForm)
      const isClientConfigFormEmpty = checkIsClientConfigFormEmpty(clientConfigForm)

      // check for optimized param input
      if (isRequiredOptimizedParamsForm && !isValidOptimizedParamsForm) {
        commonStore.optimizedInputParamsFormikProps.submitForm()
        return
      }

      if (!isAdditionalParamsFormEmpty && isOptimizedFormEmpty || !isClientConfigFormEmpty && isOptimizedFormEmpty) {
        setMessageDialog(true)
        setMessageType('MISS_OPTIMIZED_INPUT')
        return
      }

      const quantity = values.quantity
      const stock = `${values.stock}`
      const { orderType, strategy, side } = optimizedForm
      const price = orderType === 'MARKET' ? 0 : optimizedForm.price
      commonStore.removeSocket()
      await commonStore.setInputFieldForm(values = { stock, quantity, side, price, orderType })
      await commonStore.fetchInfo({ stockInfoList: [{ primaryRic: stock }], tabValue: '1' })
      const isExcelInputValid = commonStore.checkIsExcelInputFormatValid()

      if (isExcelInputValid) {
        setLoading(true)
        setSinglePageReady(false)
        await commonStore.clearError()
        // await commonStore.resetSingleStockData()
        await commonStore.resetSingleStockParams()

        setSingleStockOptimizedGridShow(isRequiredOptimizedParamsForm && isValidOptimizedParamsForm)
        await commonStore.fetchAnalytic({ stockInfoList: [{ symbol: stock }] })
        await commonStore.fetchMarketCondition({ stockInfoList: [{ symbol: stock, type: marketConditionType }] })
        await commonStore.fetchVolumeCurve({ stockInfoList: [{ symbol: stock }] })
        if (isRequiredOptimizedParamsForm && isValidOptimizedParamsForm) {
          await commonStore.clearSingleStockOptimizedParamsResponseError()
          const clientConfigSettingsForm = R.reject(R.equals(''))(commonStore.clientConfigSettingsForm)
          const optimizedForm = R.reject(R.equals('' || 0))({ Side: side, OrdType: orderType, Strategy: strategy, Price: price })
          commonStore.fetchOptimizedParams({ stockInfoList: [{ Symbol: stock, OrderQty: quantity, ...optimizedForm, ...commonStore.additionalParamsForm, ...clientConfigSettingsForm }], tabValue: '1' })
            .catch((error) => {

              setErrorMessage(error)
              setErrorDialog(true)
              setConfirmDeleteProfileDialog(false)
            })
        }
        await commonStore.transformVolumeCurveData({ groupTime: 15, tabValue: '1' })
        await commonStore.transformSpreadCurveData({ groupTime: 15, tabValue: '1' })
        await commonStore.transformVolatilityCurveData({ groupTime: 15, tabValue: '1' })
        await commonStore.transformTradeEstimateData({ groupTime: 15, day: 'day1', stock: null, quantity, tabValue: '1' })
        await commonStore.updateFieldWithCurrency()
        setSinglePageReady(true)

        const convertInputForm = new ConvertInputForm(commonStore.inputFieldForm)
        convertInputForm.setClientConfigSettingsForm(commonStore.clientConfigSettingsForm)
        convertInputForm.setOptimizedInputParamsForm(commonStore.optimizedInputParamsFormikProps.values)
        convertInputForm.setAdditionalParamsForm(commonStore.additionalParamsForm)

        let log = convertInputForm.getLogger()

        createActionLoggerRecord({

          action:'SingleStockRun',
          msg: log
        })
      } else {
        // handleClearSingleStockAction()
        const errorMessage = createExcelErrorMessage()
        setExcelErrorMessage(errorMessage)
        setExcelErrorDialog(true)
      }
      setLoading(false)
    }, [marketConditionType, tabValue])

  const handleClearSingleStockAction = useCallback(
    async () => {
      await commonStore.clearSingleStockSelectedExcelFile()
      await commonStore.clearSingleStockOptimizedParamsResponseError()
      await commonStore.resetSingleStockParams()
      await commonStore.setInputFieldForm(commonStore.inputFieldTempSaveForm)
      await commonStore.resetInputFieldForm()
      await commonStore.resetOptimizedParamsForm()
      if (commonStore.optimizedInputParamsFormikProps) {
        await commonStore.optimizedInputParamsFormikProps.resetForm()
      }
      // clear client config setting form & additional params form
      await commonStore.initClientConfigSettingForm()
      await resetAdditionalForm()
      // setReady(false)
      setSinglePageReady(false)
    }, [])

  const handleClearPortfolioAction = useCallback(
    async () => {
      await commonStore.resetPortfolioParams()
      await commonStore.clearPortfolioSelectedExcelFile()
      // setReady(false)
      setPortfolioPageReady(false)
      setPortfolioOptimizedDataReady(false)
    }, [])

  const handleSingleStockLayoutChange = useCallback(
    async (layout) => {
      const updatedLayout = commonStore.setSingleStockLayout(layout, isSingleStockOptimizedGridShow)
      setSingleStockLayout(updatedLayout)
    }, [isSingleStockOptimizedGridShow])

  const handlePortfolioLayoutChange = useCallback(
    async (layout) => {
      const updatedLayout = commonStore.setPortfolioLayout(layout, isPortfolioOptimizedGridShow)
      setPortfolioLayout(updatedLayout)
    }, [isPortfolioOptimizedGridShow])

  const handleCloseGridClick = useCallback(
    (value) => {
      switch (tabValue) {
        case '1':
          setSingleStockViewVisble(
            (prevViewStatus) => {
              const currentViewStatus = { ...prevViewStatus }
              currentViewStatus[value] = !currentViewStatus[value]
              commonStore.setSingleStockViewVisble(currentViewStatus)
              return currentViewStatus
            }
          )
          break
        case '2':
          setPortfolioViewVisble(
            (prevViewStatus) => {
              const currentViewStatus = { ...prevViewStatus }
              currentViewStatus[value] = !currentViewStatus[value]
              commonStore.setPortfolioViewVisible(currentViewStatus)
              return currentViewStatus
            }
          )
          break
        default:
          break
      }
    }, [tabValue])

  const handleSaveSingleStockClick = useCallback(
    async () => {
      if (!singleStockProfile) {
        setMessageDialog(true)
        setMessageType('NO_PROFILE')
        return
      }
      await commonStore.setInputFieldForm(commonStore.inputFieldTempSaveForm)
      const { stock: ric, quantity: qty } = commonStore.inputFieldForm
      const { orderType, price, side, strategy } = commonStore.optimizedInputParamsFormikProps.values

      const input = saveMode === '2' ? { ric, qty, orderType, price, side, strategy } : null
      await commonStore.updateSingleStockUserProfileLayout({ input })
      await commonStore.getUserProfileLayout()
      initPickerState()
      if (commonStore.error['layout']) {
        setMessageType('FETCH_API_ERROR')
      } else {
        setMessageType('SAVE_LAYOUT')
      }
      setMessageDialog(true)

      if(saveMode === '1'){

        createActionLoggerRecord({
          action: 'SaveProfileLayoutOnly',
          msg: singleStockProfile
        })

      } else if(saveMode === '2'){

        createActionLoggerRecord({
          action: 'SaveProfileLayoutWithData',
          msg: singleStockProfile
        })
      }

    }, [saveMode, singleStockProfile]
  )

  const handleSavePortfolioClick = useCallback(async () => {
    if (!portfolioProfile) {
      setMessageDialog(true)
      setMessageType('NO_PROFILE')
      return
    }
    const excelDataInput = commonStore.portfolioPageData.uploadedExcelData
    const input = saveMode === '2' ? excelDataInput : {}
    await commonStore.updatePortfolioUserProfileLayout({ input })
    await commonStore.getUserProfileLayout()
    initPickerState()
    if (commonStore.error['layout']) {
      setMessageType('FETCH_API_ERROR')
    } else {
      setMessageType('SAVE_LAYOUT')
    }
    setMessageDialog(true)

    if(saveMode === '1'){

      createActionLoggerRecord({
        action: 'SaveProfileLayoutOnly',
        msg: portfolioProfile
      })

    } else if(saveMode === '2'){

      createActionLoggerRecord({
        action: 'SaveProfileLayoutWithData',
        msg: portfolioProfile
      })
    }

  }, [portfolioProfile, saveMode])

  const handleSubmitAdditonalFormButtonClicked = useCallback(
    async () => {
      await additionalParamsFormikProps.submitForm()
      if (Object.keys(additionalParamsFormikProps.errors).length > 0) {
        setMessageDialog(true)
        setMessageType('INVALID_ADDITIONAL_PARAMS_FORM_FIELD')
      }
    }, [additionalParamsFormikProps])

  const handleSubmitClientConfigFormButtonClicked = useCallback(
    async () => {
      clientConfigFormikProps.submitForm()
    }, [clientConfigFormikProps]
  )

  const handleCloseAdditionalFormButtonClicked = useCallback(
    async () => {
      const previousFormValue = toJS(commonStore.additionalParamsForm)
      const currentFormValue = toJS(additionalParamsFormikProps.values)
      const isFormChange = !R.equals(previousFormValue, currentFormValue)
      if (isFormChange) {
        setConfirmAdditionalParamsDialog(true)
        return
      }
      await commonStore.setAdditionalPreviewForm(additionalParamsFormikProps.values)
      setAdditionalFormDialog(false)
    }, [additionalParamsFormikProps])

  const handleAdditionDialogCloseAction = useCallback(async () => {
    await commonStore.clearSelectedAdditionalParams()
    await commonStore.clearSelectedAdditionParamsInitValue()
    await commonStore.toadditionalParamsOptionList()

    const additionalForm = commonStore.additionalParamsForm
    commonStore.resetTempSaveAdditionalParamsPeviewForm()
    await commonStore.resetAdditionalParamsSelectedList()
    for (const key in additionalForm) {
      await commonStore.setAdditionalParamsSelectedList(key, additionalForm[key])
      await commonStore.removeAdditionParamsOptionListItem(key)
    }
    commonStore.setAdditionalPreviewForm(additionalForm)
    setAdditionalFormDialog(false)
    setConfirmAdditionalParamsDialog(false)
  }, [])

  const handleAdditionDialogConfirmAction = useCallback(async () => {
    handleSubmitAdditonalFormButtonClicked()
    // setAdditionalFormDialog(false)
    setConfirmAdditionalParamsDialog(false)
  }, [])

  const handleClientConfigDialogConfirmAction = useCallback(async () => {
    setConfirmClientConfigParamsDialog(false)
    handleSubmitClientConfigFormButtonClicked()
  }, [])

  const handleClientConfigDialogCloseAction = useCallback(async () => {
    setClientConfigFormDialog(false)
    setConfirmClientConfigParamsDialog(false)
  }, [])

  const handleCloseClientConfigFormButtonClicked = useCallback(
    async () => {
      const prevClientConfigForm = commonStore.clientConfigSettingsForm
      const currentClientConfigForm = clientConfigFormikProps.values
      const isFormChange = !R.equals(prevClientConfigForm, currentClientConfigForm)
      if (isFormChange) {
        setConfirmClientConfigParamsDialog(true)
        return
      }
      setClientConfigFormDialog(false)
    }, [])

  const handleBindAdditionParamsFormik = useCallback(
    (formikProps) => {
      // commonStore.setAdditionalParamsFormikProps(formikProps)
      commonStore.setTempSaveAdditionalParamsPeviewForm(formikProps.values)
      // commonStore.additionalParamsFormikProps = formikProps
      additionalParamsFormikProps = formikProps
    }, [])

  const handleBindClientConfigFormik = useCallback(
    (formikProps) => {
      clientConfigFormikProps = formikProps
    }, [])

  const handleBindInputFormikAction = useCallback(
    (formikProps) => {
      inputFieldFormikProps = formikProps
      commonStore.setTempInputFieldForm(inputFieldFormikProps.values)
    }, [])

  const handlebindOptimizedFormikAction = useCallback((formikProps) => {
    commonStore.setOptimizedParamsFormik(formikProps)
  }, [])

  const handleSingleStockRunClick = useCallback(
    () => {
      if (inputFieldFormikProps) {
        inputFieldFormikProps.submitForm()
        commonStore.setOptimizedParamsForm(commonStore.optimizedInputParamsFormikProps.values)
      }
    }, [inputFieldFormikProps])

  const handlePortfolioRunClick = useCallback(async () => {
    if (commonStore.portfolioPageData.uploadedExcelData === null || Object.keys(commonStore.portfolioPageData.uploadedExcelData).length === 0) {
      setMessageDialog(true)
      setMessageType('MISSING_INPUT')
      return
    }
    await handleProcessPortfolioPageData(currencyCountry)
  }, [currencyCountry])

  const handleSubmitAdditionParamsForm = async (values) => {
    commonStore.setAdditionalForm(values)
    commonStore.setAdditionalPreviewForm(values)
    setAdditionalFormDialog(false)
  }

  const handleSubmitClientConfigForm = async (values) => {
    commonStore.setClientConfigForm(values)
    setClientConfigFormDialog(false)
  }

  const handleExportSingleStockExcelClick = useCallback(async () => {
    if (!isSinglePageReady) {
      setMessageType('MISSING_INPUT')
      setMessageDialog(true)
      return
    }
    setProcessDialog(true)
    await commonStore.fetchExcelChartFile({ quantity: commonStore.inputFieldForm.quantity, tabValue: 1, page: SINGLE_STOCK, currencyCountry, viewVisble: sinlgeStockViewVisble })
    setProcessDialog(false)
    if (commonStore.error['EXPORT_EXCEL']) {
      setMessageType(commonStore.error['EXPORT_EXCEL'])
      setMessageDialog(true)
    }
    if (commonStore.error['RESPONSE']) {
      setMessageType(commonStore.error['RESPONSE'])
      setMessageDialog(true)
    }

    createActionLoggerRecord({
      action: 'ExportExcel',
      msg: 'Single stock export excel'
    })

  }, [isSinglePageReady, currencyCountry, sinlgeStockViewVisble])

  const handleExportPortfolioExcelClick = useCallback(async () => {
    if (!isPortfolioPageReady) {
      setMessageType('MISSING_INPUT')
      setMessageDialog(true)
      return
    }
    setProcessDialog(true)
    switch (exportFileMode) {
      case PORTFOLIO:
        await commonStore.fetchExcelChartFile({ quantity: null, tabValue: 2, page: PORTFOLIO, currencyCountry, viewVisble: portfolioViewVisble })
        if (commonStore.error['EXPORT_EXCEL']) {
          setMessageType(commonStore.error['EXPORT_EXCEL'])
          setMessageDialog(true)
        }
        break
      case TRADE_DETAIL:
        await commonStore.fetchExcelChartFile({ quantity: null, tabValue: 2, page: TRADE_DETAIL, currencyCountry })
        break
      case ALL_PORTFOLIO:
        await commonStore.fetchExcelChartFile({ quantity: null, tabValue: 2, page: ALL_PORTFOLIO, currencyCountry, viewVisble: portfolioViewVisble })
        if (commonStore.error['EXPORT_EXCEL']) {
          setMessageType(commonStore.error['EXPORT_EXCEL'])
          setMessageDialog(true)
        }
        break
      default:
        break
    }
    setProcessDialog(false)

    createActionLoggerRecord({
      action: 'ExportExcel',
      msg: 'Portfolio export excel'
    })

    if (commonStore.error['RESPONSE']) {
      setMessageType(commonStore.error['RESPONSE'])
      setMessageDialog(true)
    }
  }, [isPortfolioPageReady, currencyCountry, exportFileMode, portfolioViewVisble])

  const handleExportSingleStockPdfClick = useCallback(() => {
    if (!isSinglePageReady) {
      setMessageType('MISSING_INPUT')
      setMessageDialog(true)
      return
    }
    printScreenPdf({ classSelector: '.grid-view-wrapper', pngWidth: 1920 })

    let log;

    // const comparer = new ExcelDataComparer(commonStore.singleStockPageData.uploadedExcelDataList)
    //
    // if(comparer.compareInputField(commonStore.inputFieldTempSaveForm) &&
    //   comparer.compareClientConfigSettings(commonStore.clientConfigSettingsForm) &&
    //   comparer.compareOptimizedInputParams(commonStore.optimizedInputParamsFormikProps.values) &&
    //   comparer.compareAdditionalParams(commonStore.additionalParamsForm)
    // ){
    //
    //   log = comparer.excelFileName
    //
    //   createActionLoggerRecord({
    //     action: 'ExportExcel',
    //     msg: log
    //   })
    //
    // } else {
    //
    //   const convertInputForm = new ConvertInputForm(commonStore.inputFieldTempSaveForm)
    //   convertInputForm.setClientConfigSettingsForm(commonStore.clientConfigSettingsForm)
    //   convertInputForm.setOptimizedInputParamsForm(commonStore.optimizedInputParamsFormikProps.values)
    //   convertInputForm.setAdditionalParamsForm(commonStore.additionalParamsForm)
    //
    //   log = convertInputForm.getLogger()
    //
    //   createActionLoggerRecord({
    //     action: 'ExportExcel',
    //     msg: log
    //   })
    // }
    // const convertInputForm = new ConvertInputForm(commonStore.inputFieldTempSaveForm)
    // convertInputForm.setClientConfigSettingsForm(commonStore.clientConfigSettingsForm)
    // convertInputForm.setOptimizedInputParamsForm(commonStore.optimizedInputParamsFormikProps.values)
    // convertInputForm.setAdditionalParamsForm(commonStore.additionalParamsForm)
    //
    // log = convertInputForm.getLogger()
    //
    // createActionLoggerRecord({
    //   action: 'ExportPDF',
    //   msg: log
    // })
  }, [isSinglePageReady])

  const handleExportPortfolioPdfClick = useCallback(() => {
    if (!isPortfolioPageReady) {
      setMessageType('MISSING_INPUT')
      setMessageDialog(true)
      return
    }
    setPrintPortfolioPdf(true)
  }, [exportFileMode, isPortfolioPageReady])

  const printScreenPdf = useCallback(async ({ classSelector, classNameIgnore = null, pngWidth }) => {
    setPdfTitleShow(true)
    setProcessDialog(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    html2canvas(document.querySelector(classSelector), {
      width: window.outerWidth + window.innerWidth,
      windowWidth: window.outerWidth + window.innerWidth,
      ignoreElements: (element) => {
        if (element.classList.contains(classNameIgnore)) {
          return true
        }
      }
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new JsPDF('p', 'pt', 'a1', false)
      pdf.addImage(imgData, 'PNG', 0, 0, 0, pngWidth, undefined, false)
      pdf.save(`Analytics Report_${moment().format('YYYY-MM-DD HH:mm:ss')}.pdf`)
      setPrintPortfolioPdf(false)
      setProcessDialog(false)
      setPdfTitleShow(false)
    }).catch((error) => {
      console.log(error)
    })
  }, [])

  useEffect(() => {
    if (isPrintPortfolioPdf) {
      switch (exportFileMode) {
        case PORTFOLIO:
          printScreenPdf({ classSelector: '.grid-view-wrapper', classNameIgnore: 'trade-detail-table', pngWidth: 1700 })
          break
        case TRADE_DETAIL:
          printScreenPdf({ classSelector: '.grid-view-wrapper', classNameIgnore: 'portfolio-grid', pngWidth: 710 })
          break
        case ALL_PORTFOLIO:
          printScreenPdf({ classSelector: '.grid-view-wrapper', pngWidth: 2300 })
          break
        default:
          break
      }
    }
  }, [isPrintPortfolioPdf])

  const handleDownloadExcelTemplateClick = useCallback((tabValue) => {
    commonStore.fetchExcelTemplate(tabValue === '1' ? SINGLE_STOCK : PORTFOLIO)

    const excelType = tabValue === '1' ? 'singleStock': 'portfolio'

    createActionLoggerRecord({
      action: 'DownExcelTemplate',
      msg: excelType + 'InputTemplate.xls'
    })
  }, [])

  const handleCurrencyChange = useCallback((currencyCountry) => {
    setCurrencyCountry((prevCountry) => {
      commonStore.updateCurrencyRate({ prevCountry, currentCountry: currencyCountry })
      if (isReady) {
        commonStore.updateFieldWithCurrency()
      }
      return currencyCountry
    })
  }, [isReady])

  const checkIsRequirePortfolioOptimzedParams = useCallback((stockInfoList) => {
    let isOptimizedFieldExist = false
    for (let stockInfo of stockInfoList) {
      const { OrdType, Strategy, Side } = stockInfo
      isOptimizedFieldExist = OrdType && Strategy && Side
      if (isOptimizedFieldExist) {
        return true
      }
    }
    return false
  }, [])

  const handleProcessPortfolioPageData = useCallback(async (currencyCountry) => {
    await commonStore.resetError()
    await commonStore.resetPortfolioData()
    await commonStore.resetPortfolioParams()
    setPortfolioPageReady(false)

    let paramTargetList = [portfolioApiParamsMap.PRIMARY_RIC]
    let stockInfoList = await commonStore.getPortfolioApiParams(paramTargetList)
    await commonStore.fetchInfo({ stockInfoList, tabValue: '2' })
    const isExcelInputValid = commonStore.checkIsExcelInputFormatValid()
    if (!isExcelInputValid) {
      const errorMessage = createExcelErrorMessage()
      setExcelErrorMessage(errorMessage)
      setExcelErrorDialog(true)
      handleClearPortfolioAction()
      return
    }

    setLoading(true)
    commonStore.removeSocket()
    setPortfolioOptimizedDataReady(false)

    paramTargetList = [portfolioApiParamsMap.SYMBOL]
    stockInfoList = await commonStore.getPortfolioApiParams(paramTargetList)

    // fetch api with stock id list only
    await commonStore.fetchAnalytic({ stockInfoList })
    await commonStore.fetchVolumeCurve({ stockInfoList })
    // await commonStore.fetchSpreadCurve({ stockInfoList })
    // await commonStore.fetchVolatilityCurve({ stockInfoList })
    stockInfoList = stockInfoList.map((stockInfo) => {
      return {
        symbol: stockInfo.symbol,
        marketConditionType
      }
    })
    //update stock option picker list
    await commonStore.getStockOptionList()
    await commonStore.fetchMarketCondition({ stockInfoList })

    // fetch trade schedule data
    paramTargetList = [
      portfolioApiParamsMap.SYMBOL,
      portfolioApiParamsMap.QUANTITY,
      portfolioApiParamsMap.START_TIME
    ]
    stockInfoList = await commonStore.getPortfolioApiParams(paramTargetList)

    // transform curve data
    await commonStore.transformVolumeCurveData({ groupTime: 15, tabValue: '2' })
    await commonStore.transformSpreadCurveData({ groupTime: 15, tabValue: '2' })
    await commonStore.transformVolatilityCurveData({ groupTime: 15, tabValue: '2' })
    await commonStore.transformTradeEstimateData({ groupTime: 15, day: 'day1', stock: null, tabValue: '2' })
    // compute porfolio data
    await commonStore.computePortfolioData(currencyCountry)
    // fetch optimized params data
    paramTargetList = [
      portfolioApiParamsMap.Symbol,
      portfolioApiParamsMap.OrderQty,
      portfolioApiParamsMap.Side,
      portfolioApiParamsMap.OrdType,
      portfolioApiParamsMap.Price
    ]
    stockInfoList = await commonStore.getPortfolioApiParams(paramTargetList, true)
    const isRequireOptimizedGrid = checkIsRequirePortfolioOptimzedParams(stockInfoList)
    setPortfolioOptimizedGridShow(isRequireOptimizedGrid)
    setLoading(false)
    setPortfolioPageReady(true)
    if (isRequireOptimizedGrid) {
      stockInfoList = stockInfoList.filter((stockInfo) => stockInfo.OrdType && stockInfo.Strategy && stockInfo.Side)
      await commonStore.fetchOptimizedParams({ stockInfoList, tabValue: '2' })
      await commonStore.getOptimizedStockOptionList({ stockInfoList })
      setPortfolioOptimizedDataReady(true)
    }
    // await commonStore.updateFieldWithCurrency()
  }, [])

  const handleSetSingleStockExcelDataClick = useCallback(async (fileName) => {
    await commonStore.setUploadedSingleStockExcelData(fileName)
    await readInputFormFieldData()
    await new Promise(resolve => setTimeout(resolve, 100))
    handleSingleStockRunClick()
    createActionLoggerRecord({
      action: 'UploadHistorySelect',
      msg: fileName
    })
  }, [])

  const handleSetPortfolioExcelDataClick = useCallback(async (fileName, isSearchInExcelListRequired = true) => {
    if (isSearchInExcelListRequired) {
      await commonStore.resetPortfolioExcelData()
      await commonStore.setUploadedPortfolioExcelData(fileName)
    }
    await handleProcessPortfolioPageData(currencyCountry)

    createActionLoggerRecord({
      action: 'UploadHistorySelect',
      msg: fileName
    })
  }, [currencyCountry])

  const createExcelErrorMessage = useCallback(() => {
    const errorLogList = commonStore['error']['excelInput']
    let ErrorMessage = ''
    for (let errorRecord of errorLogList) {
      const { stock, errorList } = errorRecord
      if (errorList.length === 0) {
        continue
      }
      for (let errorData of errorList) {
        const { errorType, fieldName, row } = errorData
        switch (errorType) {
          case 'INVALID':
            ErrorMessage += `Invalid ${fieldName} for symbol ${stock}!\n\n`
            break;
          case 'MISSING':
            ErrorMessage += `${fieldName} is missing for symbol ${stock}!\n\n`
            break;
          case 'MISSING_QTY':
            ErrorMessage += `Mandatory field ${fieldName} is missing for symbol ${stock}!\n\n`
            break;
          case 'MISSING_OPTIMIZED_FIELD':
            ErrorMessage += `${fieldName} is missing for symbol ${stock}! (OrdType, Side and Strategy are required for Optimized Parameters.)\n\n`
            break;
          case 'MISSING_SINGLE__STOCK_SYMBOL':
            ErrorMessage += `Mandatory field Symbol is missing!\n\n`
            break;
          case 'MISSING_PORTFOLIO_SYMBOL':
            ErrorMessage += `Mandatory field Symbol is missing for row ${row}!\n\n`
            break;
          case 'EMPTY_OPTIMIZED_FORM':
            ErrorMessage += `Additional parameter/ client config setting is detected for symbol ${stock}. Please input OrdType, Side and Strategy in order to generate Optimized Parameters.\n\n`
            break;
          case 'USELESS_PRICE_INPUT':
            ErrorMessage += `Price is not required for symbol ${stock} as OrdType=MARKET.\n\n`
            break
          case 'SINGLE_SYMBOL_INVALID':
            ErrorMessage += `Invalid Symbol!\n\n`
            break
          case 'PORTFOLIO_SYMBOL_INVALID':
            ErrorMessage += `Invalid Symbol for row ${row}!\n\n`
            break
          case 'INCORRECT_FIELD_NAME':
            ErrorMessage += `Incorrect field name ${fieldName} for symbol ${stock}!\n\n`
            break
          default:
            break;
        }
      }
    }
    return ErrorMessage
  }, [])

  const handleUploadSingleStockFile = useCallback(async ({ data, fileName, file }) => {
    if (data.length > 1) {
      setMessageType('INCORRECT_SINGLE_STOCK_FILE')
      setMessageDialog(true)
      return
    }
    const newFileName = await commonStore.updateSingleStockExcelDataList({ data, fileName, file })
    if (!commonStore.isExcelInputValid) {
      const errorMessage = createExcelErrorMessage()
      setExcelErrorMessage(errorMessage)
      setExcelErrorDialog(true)
      return
    }
    handleSetSingleStockExcelDataClick(newFileName)
    createActionLoggerRecord({
      action: 'SingleStockUpload',
      msg: fileName
    })
  }, [])

  const handleCloseSingleStockExcelInputErrorDialog = useCallback(() => {
    commonStore.clearExcelInputError()
    setExcelErrorDialog(false)
    setExcelErrorMessage('')
  }, [])

  const validatePortfolioExcelRequiredField = useCallback(async ({ rowDataList }) => {
    const fieldNameList = Object.keys(rowDataList[0])
    if (!fieldNameList.includes('Symbol') || !fieldNameList.includes('OrderQty')) {
      setMessageDialog(true)
      setMessageType('MISSING_MANDATORY_EXCEL_COLUMN')
      return false
    }

    for (let rowData of rowDataList) {
      // check manadatory field
      const { Symbol, OrderQty } = rowData
      if (!Symbol || !OrderQty) {
        setMessageDialog(true)
        setMessageType('MISSING_MANDATORY_EXCEL_VALUE')
        return false
      }
    }
    return true
  }, [])

  const handleUploadPortfolioFile = useCallback(async ({ data, fileName, file }) => {
    if (data.length < 2) {
      setMessageType('INCORRECT_PORTFOLIO_FILE')
      setMessageDialog(true)
      return
    }
    // handle excel validation
    // const isValidFile = await validatePortfolioExcelRequiredField({ rowDataList: data })
    // if (!isValidFile) {
    //   return
    // }

    const newFileName = await commonStore.updatePortfolioExcelDataList({ data, fileName, file })
    if (!commonStore.isExcelInputValid) {
      const errorMessage = createExcelErrorMessage()
      setExcelErrorMessage(errorMessage)
      setExcelErrorDialog(true)
      return
    }
    handleSetPortfolioExcelDataClick(newFileName)
    createActionLoggerRecord({
      action: 'PortfolioUpload',
      msg: fileName
    })
  }, [])

  const handleClosePortfolioExcelInputErrorDialog = useCallback(() => {
    // const newFileName = commonStore.newFileName
    // commonStore.clearNewFileName()
    commonStore.clearExcelInputError()
    // handleSetPortfolioExcelDataClick(newFileName)
    setExcelErrorDialog(false)
    setExcelErrorMessage('')
    // if (commonStore.error['missingOptimizedWarning']) {
    //   setMessageDialog(true)
    //   setMessageType('MISS_EXCEL_OPTIMIZED_INPUT')
    //   commonStore.clearMissingOptimizedWarning()
    // }
  }, [])

  const handleDeleteSingleStockFileClick = useCallback(async (fileName) => {
    await commonStore.setDeleteSingleStockFileName(fileName)
    setConfirmDeleteFileDialog(true)

    // createActionLoggerRecord({
    //   action: 'UploadHistoryDelete',
    //   msg: 'fileName'
    // })

  }, [])

  const handleDeletePortfolioFileClick = useCallback(async (fileName) => {
    await commonStore.setDeletePortfolioFileName(fileName)
    setConfirmDeleteFileDialog(true)



  }, [])

  const handleConfirmDeleteSingleStockFileClick = useCallback(async () => {
    await commonStore.deleteUploadedSingleStockExcelFile()
    setConfirmDeleteFileDialog(false)
  })

  const handleConfirmDeletePortfolioFileClick = useCallback(async () => {
    await commonStore.deleteUploadedPortfolioExcelFile()
    setConfirmDeleteFileDialog(false)
  })

  const handleSaveAsSingleStockProfileClick = useCallback(async (saveMode) => {
    if (saveProfileName === '') {
      setMessageDialog(true)
      setMessageType('INVALID_PROFILE_NAME')
    } else if (commonStore.profileDataList.find((profileData) => profileData.name === saveProfileName)) {
      setMessageDialog(true)
      setMessageType('DUPLICATE_PROFILE_NAME')
    } else {
      const { stock: ric, quantity: qty } = commonStore.inputFieldTempSaveForm
      // const input = { ric, qty, side, orderType, price }
      const { orderType, price, side, strategy } = commonStore.optimizedInputParamsFormikProps.values
      const input = saveMode === '2' ? { ric, qty, orderType, price, side, strategy } : {}
      await commonStore.saveSingleStockUserProfileLayout({ input, saveProfileName })
      setSaveProfileDialog(false)
      await commonStore.getUserProfileLayout()
      initPickerState()
      // setSingleStockProfile(commonStore.singleStockPageData.profileData.name)
      setMessageDialog(true)
      setMessageType('SAVE_LAYOUT')

      if(saveMode === '1'){

        createActionLoggerRecord({
          action: 'SaveAsProfileLayoutOnly',
          msg: saveProfileName
        })

      } else if(saveMode === '2'){

        createActionLoggerRecord({
          action: 'SaveAsProfileLayoutWithData',
          msg: saveProfileName
        })
      }
    }
  }, [saveProfileName])

  const handleSaveAsPortfolioProfileClick = useCallback(async (saveMode) => {
    if (saveProfileName === '') {
      setMessageDialog(true)
      setMessageType('INVALID_PROFILE_NAME')
    } else if (commonStore.profileDataList.find((profileData) => profileData.name === saveProfileName)) {
      setMessageDialog(true)
      setMessageType('DUPLICATE_PROFILE_NAME')
    } else {
      const excelDataInput = commonStore.portfolioPageData.uploadedExcelData
      const input = saveMode === '2' ? excelDataInput : {}
      await commonStore.savePortfolioUserProfileLayout({ saveProfileName, input })
      setSaveProfileDialog(false)
      await commonStore.getUserProfileLayout()
      initPickerState()
      // setPortfolioProfile(commonStore.portfolioPageData.profileData.name)
      setMessageDialog(true)
      setMessageType('SAVE_LAYOUT')

      if(saveMode === '1'){

        createActionLoggerRecord({
          action: 'SaveAsProfileLayoutOnly',
          msg: saveProfileName
        })

      } else if(saveMode === '2'){

        createActionLoggerRecord({
          action: 'SaveAsProfileLayoutWithData',
          msg: saveProfileName
        })
      }
    }
  }, [saveProfileName])

  const handleUploadFileError = useCallback(() => {
    setMessageDialog(true)
    setMessageType('INVALID_FILE_EXTENSION')
  })

  const deleteProfileButtonClick = useCallback((clickEvent, profileName) => {
    clickEvent.stopPropagation()
    commonStore.setDeleteProfileName(profileName)
    setConfirmDeleteProfileDialog(true)
  }, [])

  const handleConfirmDeleteProfileClick = useCallback(async () => {
    const deleteProfileName = commonStore.deleteProfileName
    await commonStore.deleteProfile(deleteProfileName)
    if (commonStore.error.layout) {
      setErrorMessageType('DELETE_PROFILE')
      setErrorMessage(commonStore.error.layout)
      setErrorDialog(true)
      setConfirmDeleteProfileDialog(false)
      return
    }
    setConfirmDeleteProfileDialog(false)
    commonStore.clearDeleteProfileName()
    await commonStore.getUserProfileLayout()
    initPickerState()

    if (tabValue === '1') {
      if (commonStore.singleStockPageData.profilePickerOptionList.length === 0) {
        setSingleStockProfileOptionList([])
        handleClearSingleStockAction()
      } else if (deleteProfileName === singleStockProfile) {
        const singleStockLastUsedProfile = commonStore.singleStockPageData.lastUsedProfile
        handleSingleProfileChange(singleStockLastUsedProfile)
      }
    }

    if (tabValue === '2') {
      if (commonStore.portfolioPageData.profilePickerOptionList.length === 0) {
        setPortfolioProfileOptionList([])
        handleClearPortfolioAction()
      } else if (deleteProfileName === portfolioProfile) {
        const portfolioLastUsedProfile = commonStore.portfolioPageData.lastUsedProfile
        handlePortfolioProfileChange(portfolioLastUsedProfile)
      }
    }
  }, [tabValue, singleStockProfile, portfolioProfile])

  const handleEditProfileNameButtonClick = useCallback(async (clickEvent, profileName) => {
    clickEvent.stopPropagation()
    commonStore.setEditProfileName(profileName)
    setSaveProfileName(profileName)
    setEditProfileNameDialog(true)

    if(saveProfileName !== profileName) {

      // createActionLoggerRecord({
      //   action: 'ChooseSelect',
      //   msg: profileName
      // })
    }
  }, [])

  const handleConfirmEditProfileNameClick = useCallback(async () => {
    const originalProfileName = commonStore.editProfileName
    const newProfileName = saveProfileName
    if (newProfileName === '') {
      setMessageDialog(true)
      setMessageType('INVALID_PROFILE_NAME')
      return
    }
    if (commonStore.profileDataList.find((profileData) => profileData.name === saveProfileName)) {
      setMessageDialog(true)
      setMessageType('DUPLICATE_PROFILE_NAME')
      return
    }
    await commonStore.updateProfileName({ originalProfileName, newProfileName: saveProfileName })
    if (commonStore.error.layout) {
      setErrorMessageType('DELETE_PROFILE')
      setErrorMessage(commonStore.error.layout)
      setErrorDialog(true)
      setConfirmDeleteProfileDialog(false)
      return
    }
    setEditProfileNameDialog(false)
    setSaveProfileName('')
    setMessageType('SAVE_LAYOUT')
    setMessageDialog(true)
    await commonStore.getUserProfileLayout()
    initPickerState()
  }, [saveProfileName])

  return (
    < LoginAuthLayout>
      <Observer>
        {
          () =>
            <AppBar
              userId={authStore.userId}
              tabValue={tabValue}
              setTabValue={setTabValue}
              page={portfolioPageStatus === 'TRADE_DETAIL' ? portfolioPageStatus : 'HOME'}
              singleStockProfileOptionList={singleStockProfileOptionList}
              portfolioProfileOptionList={portfolioProfileOptionList}
              singleStockProfile={singleStockProfile}
              portfolioProfile={portfolioProfile}
              setSingleStockProfile={setSingleStockProfile}
              setPortfolioProfile={setPortfolioProfile}
              deleteProfileButtonClick={deleteProfileButtonClick}
              handleEditProfileNameButtonClick={handleEditProfileNameButtonClick}
              handleSingleProfileChange={handleSingleProfileChange}
              handlePortfolioProfileChange={handlePortfolioProfileChange}
            />
        }
      </Observer>
      <Observer>
        {
          () =>
            <ActionBar
              setPortfolioStatus={setPortfolioStatus}
              portfolioPageStatus={portfolioPageStatus}
              tabValue={tabValue}
              currencyCountry={currencyCountry}
              handleCurrencyChange={handleCurrencyChange}
              setCurrencyCountry={setCurrencyCountry}
              currencyOptionList={commonStore.currencyOptionList}
              handleSaveSingleStockClick={handleSaveSingleStockClick}
              handleSavePortfolioClick={handleSavePortfolioClick}
              sinlgeStockViewVisble={sinlgeStockViewVisble}
              portfolioViewVisble={portfolioViewVisble}
              setSaveProfileName={setSaveProfileName}
              saveMode={saveMode}
              setSaveMode={setSaveMode}
              exportFileMode={exportFileMode}
              setExportFileMode={setExportFileMode}
              setSaveProfileDialog={setSaveProfileDialog}
              handleCloseGridClick={handleCloseGridClick}
              handleExportSingleStockPdfClick={handleExportSingleStockPdfClick}
              handleExportPortfolioPdfClick={handleExportPortfolioPdfClick}
              handleExportSingleStockExcelClick={handleExportSingleStockExcelClick}
              handleExportPortfolioExcelClick={handleExportPortfolioExcelClick}
              isSinglePageReady={isSinglePageReady}
              isPortfolioPageReady={isPortfolioPageReady}
              setMessageDialog={setMessageDialog}
              setMessageType={setMessageType}
              singleStockProfile={singleStockProfile}
              portfolioProfile={portfolioProfile}
              page={
                tabValue === '1' ? SINGLE_STOCK
                  :
                  portfolioPageStatus === PORTFOLIO ? PORTFOLIO
                    :
                    TRADE_DETAIL
              }
              isSingleStockOptimizedGridShow={isSingleStockOptimizedGridShow}
              isPortfolioOptimizedGridShow={isPortfolioOptimizedGridShow}
            />
        }
      </Observer>
      <Observer>
        {
          () => {
            return (
              <>
                {
                  isReady &&
                  <InputBar
                    tabValue={tabValue}
                    bindOptimizedFormikAction={handlebindOptimizedFormikAction}
                    bindInputFormikAction={handleBindInputFormikAction}
                    inputFieldForm={commonStore.inputFieldForm}
                    optimizedInputParamsForm={commonStore.optimizedInputParamsForm}
                    isHistoryBoxOpened={isHistoryBoxOpened}
                    setHistoryBoxOpen={setHistoryBoxOpen}
                    portfolioFileList={commonStore.portfolioPageData.uploadedExcelDataList}
                    singleStockFileList={commonStore.singleStockPageData.uploadedExcelDataList}

                    sideOptionList={commonStore.singleStockPageData.processData.sidePickerOptionList || []}
                    orderOptionList={commonStore.singleStockPageData.processData.orderPickerOptionList || []}
                    strategyOptionList={commonStore.singleStockPageData.processData.strategyPickerOptionList || []}

                    handleClearSingleStockAction={handleClearSingleStockAction}
                    handleClearPortfolioAction={handleClearPortfolioAction}

                    handleSubmitSingleStockAction={handleSubmitSingleStockAction}
                    handleSingleStockRunClick={handleSingleStockRunClick}
                    handlePortfolioRunClick={handlePortfolioRunClick}

                    setAdditionalFormDialog={setAdditionalFormDialog}
                    setClientConfigFormDialog={setClientConfigFormDialog}
                    handleDownloadExcelTemplateClick={handleDownloadExcelTemplateClick}
                    handleSetSingleStockExcelDataClick={handleSetSingleStockExcelDataClick}
                    handleSetPortfolioExcelDataClick={handleSetPortfolioExcelDataClick}
                    handleUploadPortfolioFile={handleUploadPortfolioFile}
                    handleUploadSingleStockFile={handleUploadSingleStockFile}
                    handleUploadFileError={handleUploadFileError}

                    handleDeleteSingleStockFileClick={handleDeleteSingleStockFileClick}
                    handleDeletePortfolioFileClick={handleDeletePortfolioFileClick}

                    singleStockDataList={commonStore.profileDataList}
                    portfolioDataList={commonStore.profileDataList}
                    portfolioExcelInputData={commonStore.portfolioPageData.uploadedExcelData}
                    isSingleStockOptimizedGridShow={isSingleStockOptimizedGridShow}
                    isPortfolioOptimizedGridShow={isPortfolioOptimizedGridShow}
                  />
                }
              </>
            )
          }
        }
      </Observer>
      <div className='grid-view-wrapper'>
        {
          isPdfTitleShow &&
          <div className='pdf-logo-bar'>
            <div>
              <div style={{ width: 120, marginRight: '0px' }}><Image src={Logo} alt='Logo Icon' /></div>
              <div>Pre-Trade Analytics</div>
            </div>
          </div>
        }
        {
          (isSinglePageReady && tabValue === '1') &&
          <SingleStockGrid
            layout={singleStockLayout}
            isDraggable={isDraggable}
            tabValue={tabValue}
            handleSingleStockLayoutChange={handleSingleStockLayoutChange}
            viewVisble={sinlgeStockViewVisble}
            handleCloseGridClick={handleCloseGridClick}
            marketConditionType={marketConditionType}
            setMarketConditionType={setMarketConditionType}
            setDraggable={setDraggable}
            currencyCountry={currencyCountry}
            isSingleStockOptimizedGridShow={isSingleStockOptimizedGridShow}
          />
        }
        {
          (isPortfolioPageReady && tabValue === '2') &&
          <PortfolioGrid
            layout={portfolioLayout}
            portfolioPageStatus={portfolioPageStatus}
            isDraggable={isDraggable}
            tabValue={tabValue}
            handlePortfolioLayoutChange={handlePortfolioLayoutChange}
            viewVisble={portfolioViewVisble}
            handleCloseGridClick={handleCloseGridClick}
            marketConditionType={marketConditionType}
            setMarketConditionType={setMarketConditionType}
            setDraggable={setDraggable}
            currencyCountry={currencyCountry}
            isPrintPortfolioPdf={isPrintPortfolioPdf}
            isPortfolioOptimizedGridShow={isPortfolioOptimizedGridShow}
          />
        }
        {
          isLoading && <div className='grid-loading'><CircularProgress /></div>
        }
        {
          isPortfolioPageReady &&
          <div className={'trade-details-data-table-container react-grid-layout trade-detail-table'}>
            <Observer>
              {
                () => {
                  return (
                    commonStore.tradeDetailTableData.dataList.length > 0 &&
                      (
                        !isPortfolioOptimizedGridShow ||
                        (
                          isPortfolioOptimizedGridShow &&
                          isPorfolioOptimizedDataReady
                        )
                      )
                      //  &&
                      // isPortfolioOptimizedGridShow || 
                      ?

                      <MuiDataTable
                        tradeDetailTableConfig={commonStore.portfolioPageData.tradeDetailTableConfig}
                        setTradeDetailTableConfig={commonStore.setTradeDetailTableConfig}
                        allOptimizedParamsData={commonStore.portfolioPageData.processData.allOptimizedParamsData}
                        currencyCountry={currencyCountry}
                        tableData={commonStore.tradeDetailTableData.dataList}
                        aggregateData={commonStore.tradeDetailTableData.aggregateData}
                        isVisible={tabValue === '2' && (portfolioPageStatus === TRADE_DETAIL || isPrintPortfolioPdf)}
                      />
                      // <DataTable
                      //   tradeDetailTableConfig={commonStore.portfolioPageData.tradeDetailTableConfig}
                      //   setTradeDetailTableConfig={commonStore.setTradeDetailTableConfig}
                      //   allOptimizedParamsData={commonStore.portfolioPageData.processData.allOptimizedParamsData}
                      //   currencyCountry={currencyCountry}
                      //   tableData={commonStore.tradeDetailTableData.dataList}
                      //   aggregateData={commonStore.tradeDetailTableData.aggregateData}
                      //   isVisible={tabValue === '2' && (portfolioPageStatus === TRADE_DETAIL || isPrintPortfolioPdf)}
                      // />
                      : <div className='grid-loading'><CircularProgress /></div>
                  )
                }
              }
            </Observer>
          </div>
        }
      </div>

      <Footer />
      <ProcessingDialog
        setProcessDialog={setProcessDialog}
        isProcessDialogOpened={isProcessDialogOpened}
      />
      <MessageDialog
        setMessageDialog={setMessageDialog}
        isMessageDialogOpened={isMessageDialogOpened}
        messageType={messageType}
      />
      {
        tabValue === '1' &&
        <ExcelInputErrorDialog
          setMessageDialog={setExcelErrorDialog}
          closeAction={handleCloseSingleStockExcelInputErrorDialog}
          isMessageDialogOpened={isExcelErrorDialog}
          excelErrorMessage={excelErrorMessage}
        />
      }
      {
        tabValue === '2' &&
        <ExcelInputErrorDialog
          setMessageDialog={setExcelErrorDialog}
          closeAction={handleClosePortfolioExcelInputErrorDialog}
          isMessageDialogOpened={isExcelErrorDialog}
          excelErrorMessage={excelErrorMessage}
        />
      }
      <CloseFormConfirmationDialog
        setAlertDialog={setConfirmAdditionalParamsDialog}
        isAlertDialogOpened={additionalConfirmParamsDialogOpened}
        handleConfirmButtonClicked={handleAdditionDialogConfirmAction}
        handleCloseButtonClicked={handleAdditionDialogCloseAction}
      />
      <CloseFormConfirmationDialog
        setAlertDialog={setConfirmClientConfigParamsDialog}
        isAlertDialogOpened={clientConfigConfirmDialogOpened}
        handleConfirmButtonClicked={handleClientConfigDialogConfirmAction}
        handleCloseButtonClicked={handleClientConfigDialogCloseAction}
      />
      {
        tabValue === '1' &&
        <DeleteConfirmationDialog
          setAlertDialog={setConfirmDeleteFileDialog}
          isAlertDialogOpened={isConfirmDeleteFileDialog}
          handleConfirmDeleteButtonClicked={handleConfirmDeleteSingleStockFileClick}
          dialogMessage='Are you sure to delete file?'
        />
      }
      {
        tabValue === '2' &&
        <DeleteConfirmationDialog
          setAlertDialog={setConfirmDeleteFileDialog}
          isAlertDialogOpened={isConfirmDeleteFileDialog}
          handleConfirmDeleteButtonClicked={handleConfirmDeletePortfolioFileClick}
          dialogMessage='Are you sure to delete file?'
        />
      }
      {
        <DeleteConfirmationDialog
          setAlertDialog={setConfirmDeleteProfileDialog}
          isAlertDialogOpened={isConfirmDeleteProfileDialog}
          handleConfirmDeleteButtonClicked={handleConfirmDeleteProfileClick}
          dialogMessage='Are you sure to delete profile?'
        />
      }
      <FormDialog
        title={'Additional Parameter'}
        setFormDialog={setAdditionalFormDialog}
        isFormDialogOpened={additionalFormDialogOpened}
        handleCloseButtonClicked={handleCloseAdditionalFormButtonClicked}
        handleSubmitButtonClicked={handleSubmitAdditonalFormButtonClicked}
      >
        <Observer>
          {
            () =>
              <AdditionalParameterForm
                additionalParamsSelectedList={commonStore.additionalParamsSelectedList}
                additionalParamsOptionList={commonStore.additionalParamsOptionList}
                initialValues={commonStore.additionalParamsPeviewForm}
                submitAction={handleSubmitAdditionParamsForm}
                bindFormikAction={handleBindAdditionParamsFormik}
                setMessageDialog={setMessageDialog}
                setMessageType={setMessageType}
              />
          }
        </Observer>
      </FormDialog>

      <FormDialog
        title={'Client Config Settings'}
        setFormDialog={setClientConfigFormDialog}
        isFormDialogOpened={clientConfigFormDialogOpened}
        handleCloseButtonClicked={handleCloseClientConfigFormButtonClicked}
        handleSubmitButtonClicked={handleSubmitClientConfigFormButtonClicked}
      >
        <Observer>
          {
            () =>
              <ClientConfigSettingsForm
                customerIdOptionList={commonStore.singleStockPageData.processData.customerIdList}
                clientConfigFieldList={commonStore.singleStockPageData.processData.additionalClientInputFieldList}
                initialValues={commonStore.clientConfigSettingsForm}
                submitAction={handleSubmitClientConfigForm}
                bindFormikAction={handleBindClientConfigFormik}
              />
          }
        </Observer>
      </FormDialog>

      {
        tabValue === '1' &&
        <SaveProfileDialog
          setFormDialog={setSaveProfileDialog}
          isFormDialogOpened={isSaveProfileDialogOpened}
          handleSubmitButtonClicked={handleSaveAsSingleStockProfileClick}
          saveProfileName={saveProfileName}
          setSaveProfileName={setSaveProfileName}
          saveLayoutOptionList={saveLayoutOptionList}
          saveMode={saveMode}
          setSaveMode={setSaveMode}
        />
      }
      {
        tabValue === '2' &&
        <SaveProfileDialog
          setFormDialog={setSaveProfileDialog}
          isFormDialogOpened={isSaveProfileDialogOpened}
          handleSubmitButtonClicked={handleSaveAsPortfolioProfileClick}
          saveProfileName={saveProfileName}
          setSaveProfileName={setSaveProfileName}
          saveLayoutOptionList={saveLayoutOptionList}
          saveMode={saveMode}
          setSaveMode={setSaveMode}
        />
      }
      {
        <EditProfileNameDialog
          setFormDialog={setEditProfileNameDialog}
          isFormDialogOpened={isEditProfileNameDialogOpened}
          handleSubmitButtonClicked={handleConfirmEditProfileNameClick}
          saveProfileName={saveProfileName}
          setSaveProfileName={setSaveProfileName}
        />
      }
      {
        <Observer>
          {
            () =>
              <ErrorDialog
                isMessageDialogOpened={isErrorDialogOpened}
                setMessageDialog={setErrorDialog}
                messageBody={errorMessage}
                closeAction={handleCloseErrorDialog}
              />
          }
        </Observer>
      }
    </LoginAuthLayout >
  )
}
