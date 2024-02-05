// import Head from 'next/head'
import GridLayout from 'react-grid-layout'
import '@node_modules/react-grid-layout/css/styles.css'
import '@node_modules/react-resizable/css/styles.css'
import IconButton from '@mui/material/IconButton'
import { useCallback, useEffect, useRef, useState } from 'react'
import useStores from '@src/utils/hooks/useStores'
import { Observer } from 'mobx-react'
import CircularProgress from '@mui/material/CircularProgress'
import CloseIcon from '@mui/icons-material/Close';
import { toJS } from 'mobx'

import MarketConditionIndicatorsView from '@src/components/views/MarketConditionIndicatorsView'
import OptimizedParametersView from '@src/components/views/OptimizedParametersView'
import PortfolioBreakdownView from '@src/components/views/PortfolioBreakdownView'
import HistoricalIntradayProfilesView from '@src/components/views/HistoricalIntradayProfilesView'
import TradeScheduleEstimateView from '@src/components/views/TradeScheduleEstimateView'
import PortfolioSummaryView from '@src/components/views/PortfolioSummaryView'
import GridView from '@src/components/layouts/gridView'
import { PORTFOLIO } from '@src/constants/values'

export default function PortfolioGrid (props) {
  const { commonStore } = useStores()
  const { isPortfolioOptimizedGridShow, isPrintPortfolioPdf, tabValue, isDraggable, handlePortfolioLayoutChange, viewVisble, handleCloseGridClick, marketConditionType, setMarketConditionType, setDraggable, currencyCountry, portfolioPageStatus, layout } = props
  const portfolioBreakdownRef = useRef();
  const tradeScheduleEstimateRef = useRef();

  useEffect(() => {
    if (portfolioBreakdownRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {

        for (const entry of entries) {
          commonStore.setPortfolioBreakdownPieChatSize(entry.contentRect.height, entry.contentRect.width)
        }
      });

      resizeObserver.observe(portfolioBreakdownRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  useEffect(()=>{
    if (tradeScheduleEstimateRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {

        for (const entry of entries) {
          commonStore.setPortfolioTradeScheduleEstimateChatWidth(entry.contentRect.width)
        }
      });

      resizeObserver.observe(tradeScheduleEstimateRef.current);
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [])

  return (
    <div className={'grid-view portfolio-grid' + `${tabValue === '2' && (portfolioPageStatus === PORTFOLIO || isPrintPortfolioPdf) ? '' : ' hidden'}`}>
      <GridLayout
        margin={[35, 35]}
        className='layout'
        layout={layout}
        cols={20}
        rowHeight={10}
        width={1600}
        onLayoutChange={handlePortfolioLayoutChange}
        isDraggable={isDraggable}
      >
        {
          viewVisble.MARKET_CONDITION_INDICATORS &&
          <div className={`grid-wrapper ${viewVisble.MARKET_CONDITION_INDICATORS ? '' : 'hidden'}`} key='MARKET_CONDITION_INDICATORS'>
            <div className='close-btn'><IconButton color="primary" onClick={() => { handleCloseGridClick('MARKET_CONDITION_INDICATORS') }}><CloseIcon /></IconButton></div>
            <Observer>
              {
                () =>
                  commonStore.portfolioPageData.processData.marketConditionData ?
                    <GridView
                      title={'Market Condition Indicators'}
                      id={'market-condition-title'}
                      setDraggable={setDraggable}
                    >
                      <MarketConditionIndicatorsView
                        data={commonStore.portfolioPageData.processData.marketConditionData}
                        tabValue={'2'}
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
        <div className={`grid-wrapper ${viewVisble.OPTIMIZED_PARAMETERS && isPortfolioOptimizedGridShow ? '' : 'hidden'}`} key='OPTIMIZED_PARAMETERS'>
          <div className='close-btn'><IconButton color="primary" onClick={() => { handleCloseGridClick('OPTIMIZED_PARAMETERS') }}><CloseIcon /></IconButton></div>
          <Observer>
            {
              () =>
              (
                commonStore.error['optimizedParams'] ?
                  <div className='error-message-grid'>{commonStore.error['optimizedParams']}</div>
                  :
                  commonStore.portfolioPageData.processData.optimizedParamsData || commonStore.portfolioPageData.apiResponse.optimizedParamsReponseErrorMsg ?
                    <GridView
                      title={'Optimized Parameters'}
                      id={'optimized-parameters-title'}
                      setDraggable={setDraggable}
                    >
                      <OptimizedParametersView
                        info={commonStore.portfolioPageData.processData.optimizedParamsData}
                        tabValue={'2'}
                        params={commonStore.portfolioPageData.params.optimizedParam}
                        stockOptionList={commonStore.optimizedParamsStockOptionList}
                        responseErrorMsg={commonStore.portfolioPageData.apiResponse.optimizedParamsReponseErrorMsg}
                      />
                    </GridView> :
                    <div className='grid-loading'><CircularProgress /></div>
              )
            }
          </Observer>
          <div />
        </div>
        {
          <div className={`grid-wrapper ${tabValue === '2' && viewVisble.PORTFOLIO_BREAKDOWN ? '' : 'hidden'}`} key='PORTFOLIO_BREAKDOWN' >
            <div className='close-btn'><IconButton color="primary" onClick={() => { handleCloseGridClick('PORTFOLIO_BREAKDOWN') }}><CloseIcon /></IconButton></div>
            <Observer>
              {
                () =>
                (
                  commonStore.error['portfolio'] ?
                    <div className='error-message-grid'>{commonStore.error['portfolio']}</div>
                    :
                    commonStore.portfolioPageData.processData.portfolioBreakdownData ?
                      <GridView
                        title={'Portfolio Breakdown'}
                        id={'portfolio-breakdown-title'}
                        setDraggable={setDraggable}
                        ref={portfolioBreakdownRef}
                      >
                        <PortfolioBreakdownView
                          info={commonStore.portfolioPageData.processData.portfolioBreakdownData}
                          params={commonStore.portfolioPageData.params.portfolioBreakdown}
                        />
                      </GridView>
                      :
                      <div className='grid-loading'><CircularProgress /></div>
                )
              }
            </Observer>
          </div>
        }
        <div className={`grid-wrapper ${viewVisble.TRADE_SCHEDULE_ESTIMATE ? '' : 'hidden'}`} key='TRADE_SCHEDULE_ESTIMATE'>
          <div className='close-btn'><IconButton color="primary" onClick={() => { handleCloseGridClick('TRADE_SCHEDULE_ESTIMATE') }}><CloseIcon /></IconButton></div>
          <Observer>
            {
              () => commonStore.portfolioPageData.processData.tradeSchedueData ?
                <GridView
                  title={'Trade Schedule Estimate'}
                  id={'trade-schedule-estimate-title'}
                  setDraggable={setDraggable}
                  ref={tradeScheduleEstimateRef}
                >
                  <TradeScheduleEstimateView
                    info={commonStore.portfolioPageData.processData.tradeSchedueData}
                    tabValue={'2'}
                    stockOptionList={commonStore.stockOptionList}
                    dayOptionList={commonStore.portfolioPageData.processData.tradeSchedueDayOptionList}
                    inputFieldForm={commonStore.inputFieldForm}
                    currencyCountry={currencyCountry}
                    params={commonStore.portfolioPageData.params.tradeEstimate}
                    chartWidth={commonStore.portfolioTradeScheduleEstimateChatWidth}
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
              () => commonStore.portfolioPageData.processData.volumeCurveData
                && commonStore.portfolioPageData.processData.spreadCurveData
                && commonStore.portfolioPageData.processData.volatilityCurveData
                ?
                <GridView
                  title={'Historical Intraday Profiles'}
                  setDraggable={setDraggable}
                  id={'historical-intraday-title'}
                >
                  <HistoricalIntradayProfilesView
                    spreadCurveData={commonStore.portfolioPageData.processData.spreadCurveData}
                    volumeCurveData={commonStore.portfolioPageData.processData.volumeCurveData}
                    volatilityCurveData={commonStore.portfolioPageData.processData.volatilityCurveData}
                    tabValue={'2'}
                    stockOptionList={commonStore.stockOptionList}
                    currencyCountry={currencyCountry}
                    params={commonStore.portfolioPageData.params.intraday}
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

        <div className={`grid-wrapper ${viewVisble.PORTFOLIO_SUMMARY && tabValue === '2' ? '' : 'hidden'}`} key='PORTFOLIO_SUMMARY'>
          <div className='close-btn'><IconButton color="primary" onClick={() => { handleCloseGridClick('PORTFOLIO_SUMMARY') }}><CloseIcon /></IconButton></div>
          <Observer>
            {
              () =>
              (
                commonStore.error['portfolio'] ?
                  <div className='error-message-grid'>{commonStore.error['portfolio']}</div>
                  :
                  (commonStore.portfolioPageData.processData.porfolioSummaryData) ?
                    <GridView
                      title={'Portfolio Summary'}
                      setDraggable={setDraggable}
                      id='portfolio-summary-title'
                    >
                      <PortfolioSummaryView info={commonStore.portfolioPageData.processData.porfolioSummaryData} currencyCountry={currencyCountry} />
                    </GridView>
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
