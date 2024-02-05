import GridLayout from 'react-grid-layout'
import '@node_modules/react-grid-layout/css/styles.css'
import '@node_modules/react-resizable/css/styles.css'
import IconButton from '@mui/material/IconButton'
import useStores from '@src/utils/hooks/useStores'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Observer } from 'mobx-react'
import CircularProgress from '@mui/material/CircularProgress'
import CloseIcon from '@mui/icons-material/Close';
import { toJS } from 'mobx'

import InstrumentCharacteristicsView from '@src/components/views/InstrumentCharacteristicsView'
import MarketConditionIndicatorsView from '@src/components/views/MarketConditionIndicatorsView'
import OptimizedParametersView from '@src/components/views/OptimizedParametersView'
import HistoricalIntradayProfilesView from '@src/components/views/HistoricalIntradayProfilesView'
import TradeScheduleEstimateView from '@src/components/views/TradeScheduleEstimateView'
import GridView from '@src/components/layouts/gridView'

export default function SingleStockGrid (props) {
  const { commonStore } = useStores()
  const { tabValue, isDraggable, isSingleStockOptimizedGridShow, handleSingleStockLayoutChange, viewVisble, handleCloseGridClick, marketConditionType, setMarketConditionType, setDraggable, currencyCountry, disableDataTransform = false, layout } = props
  const tradeScheduleEstimateRef = useRef();
  
  useEffect(()=>{
    if (tradeScheduleEstimateRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {

        for (const entry of entries) {
          commonStore.setSingleStockTradeScheduleEstimateChatWidth(entry.contentRect.width)
        }
      });

      resizeObserver.observe(tradeScheduleEstimateRef.current);
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [])
  
  return (
    <div className={'grid-view single-stock-grid' + `${tabValue === '1' ? '' : ' hidden'}`} >
      <GridLayout
        margin={[35, 35]}
        className='layout'
        layout={layout}
        cols={20}
        rowHeight={10}
        width={1600}
        onLayoutChange={handleSingleStockLayoutChange}
        isDraggable={isDraggable}
      >
        <div className={`grid-wrapper ${viewVisble.INSTRUMENT_CHARACTERISTICS && tabValue === '1' ? '' : 'hidden'}`} key='INSTRUMENT_CHARACTERISTICS'>
          <div className='close-btn'><IconButton color="primary" onClick={() => { handleCloseGridClick('INSTRUMENT_CHARACTERISTICS') }}><CloseIcon /></IconButton></div>
          <Observer>
            {
              () => (commonStore.singleStockPageData.apiResponse.analyticData && commonStore.singleStockPageData.apiResponse.info) ?
                <GridView
                  id={'instrument-characteristics-title'}
                  title={'Instrument Characteristics'}
                  setDraggable={setDraggable}
                >
                  <InstrumentCharacteristicsView
                    currencyCountry={currencyCountry}
                    info={commonStore.singleStockPageData.apiResponse.info[0]}
                    analyticData={commonStore.singleStockPageData.apiResponse.analyticData[0]}
                    inputFieldForm={commonStore.inputFieldForm}
                  />
                </GridView>
                :
                (
                  commonStore.error['info'] ?
                    <div className='error-message-grid'>{commonStore.error['info']}</div>
                    :
                    <div className='grid-loading'><CircularProgress /></div>
                )
            }
          </Observer>
        </div>
        {
          viewVisble.MARKET_CONDITION_INDICATORS &&
          <div className={`grid-wrapper ${viewVisble.MARKET_CONDITION_INDICATORS ? '' : 'hidden'}`} key='MARKET_CONDITION_INDICATORS'>
            <div className='close-btn'><IconButton color="primary" onClick={() => { handleCloseGridClick('MARKET_CONDITION_INDICATORS') }}><CloseIcon /></IconButton></div>
            <Observer>
              {
                () =>
                  commonStore.singleStockPageData.processData.marketConditionData ?
                    <GridView
                      title={'Market Condition Indicators'}
                      setDraggable={setDraggable}
                      id={'market-condition-title'}
                    >
                      <MarketConditionIndicatorsView
                        data={commonStore.singleStockPageData.processData.marketConditionData}
                        tabValue={'1'}
                        marketConditionType={marketConditionType}
                        setMarketConditionType={setMarketConditionType}
                        stockOptionList={commonStore.marketConditionStockOptionList}
                      />
                    </GridView>
                    : <div className='grid-loading'><CircularProgress /></div>
              }
            </Observer>
          </div>
        }

        {
          // viewVisble.OPTIMIZED_PARAMETERS && isSingleStockOptimizedGridShow &&
          <div className={`grid-wrapper ${viewVisble.OPTIMIZED_PARAMETERS && isSingleStockOptimizedGridShow ? '' : 'hidden'}`} key='OPTIMIZED_PARAMETERS'>
            <div className='close-btn'><IconButton color="primary" onClick={() => { handleCloseGridClick('OPTIMIZED_PARAMETERS') }}><CloseIcon /></IconButton></div>
            <Observer>
              {
                () => commonStore.singleStockPageData.processData.optimizedParamsData || commonStore.singleStockPageData.apiResponse.optimizedParamsReponseErrorMsg ?
                  <GridView
                    title={'Optimized Parameters'}
                    setDraggable={setDraggable}
                    id={'optimized-parameters-title'}
                  >
                    <OptimizedParametersView
                      info={commonStore.singleStockPageData.processData.optimizedParamsData}
                      tabValue={'1'}
                      stockOptionList={commonStore.stockOptionList}
                      responseErrorMsg={commonStore.singleStockPageData.apiResponse.optimizedParamsReponseErrorMsg}
                      disableDataTransform={disableDataTransform}
                    />
                  </GridView>
                  :
                  (
                    commonStore.error['optimizedParams'] ?
                      <div className='error-message-grid'>{commonStore.error['optimizedParams']}</div>
                      :
                      <div className='grid-loading'><CircularProgress /></div>
                  )
              }
            </Observer>
            <div />
          </div>
        }

        <div className={`grid-wrapper ${viewVisble.TRADE_SCHEDULE_ESTIMATE ? '' : 'hidden'}`} key='TRADE_SCHEDULE_ESTIMATE'>
          <div className='close-btn'><IconButton color="primary" onClick={() => { handleCloseGridClick('TRADE_SCHEDULE_ESTIMATE') }}><CloseIcon /></IconButton></div>
          <Observer>
            {
              () => commonStore.singleStockPageData.processData.tradeSchedueData ?
                <GridView
                  title={'Trade Schedule Estimate'}
                  setDraggable={setDraggable}
                  id={'trade-schedule-estimate-title'}
                  ref={tradeScheduleEstimateRef}
                >
                  <TradeScheduleEstimateView
                    info={commonStore.singleStockPageData.processData.tradeSchedueData}
                    tabValue={'1'}
                    stockOptionList={commonStore.stockOptionList}
                    dayOptionList={commonStore.singleStockPageData.processData.tradeSchedueDayOptionList}
                    inputFieldForm={commonStore.inputFieldForm}
                    currencyCountry={currencyCountry}
                    disableDataTransform={disableDataTransform}
                    params={commonStore.singleStockPageData.params.tradeEstimate}
                    chartWidth={commonStore.singleStockTradeScheduleEstimateChatWidth}
                  />
                </GridView>
                :
                (
                  commonStore.error['tradeSchedule'] ?
                    <div className='error-message-grid'>{commonStore.error['tradeSchedule']}</div>
                    :
                    <div className='grid-loading'><CircularProgress /></div>
                )
            }
          </Observer>
        </div>

        <div className={`grid-wrapper ${(viewVisble.HISTORICAL_INTRADAY_PROFILES) ? '' : 'hidden'}`} key='HISTORICAL_INTRADAY_PROFILES'>
          <div className='close-btn'><IconButton color="primary" onClick={() => { handleCloseGridClick('HISTORICAL_INTRADAY_PROFILES') }}><CloseIcon /></IconButton></div>
          <Observer>
            {
              () => commonStore.singleStockPageData.processData.volumeCurveData
                && commonStore.singleStockPageData.processData.spreadCurveData
                && commonStore.singleStockPageData.processData.volatilityCurveData
                ?
                <GridView
                  title={'Historical Intraday Profiles'}
                  setDraggable={setDraggable}
                  id={'historical-intraday-title'}
                >
                  <HistoricalIntradayProfilesView
                    spreadCurveData={commonStore.singleStockPageData.processData.spreadCurveData}
                    volumeCurveData={commonStore.singleStockPageData.processData.volumeCurveData}
                    volatilityCurveData={commonStore.singleStockPageData.processData.volatilityCurveData}
                    tabValue={'1'}
                    stockOptionList={commonStore.stockOptionList}
                    currencyCountry={currencyCountry}
                    params={commonStore.singleStockPageData.params.intraday}
                  />
                </GridView>
                :
                (
                  commonStore.error['tradeSchedule'] ?
                    <div className='error-message-grid'>{commonStore.error['tradeSchedule']}</div>
                    :
                    <div className='grid-loading'><CircularProgress /></div>
                )

            }
          </Observer>
        </div>
      </GridLayout>
    </div>
  )
}