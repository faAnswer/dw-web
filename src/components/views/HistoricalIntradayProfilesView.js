import React, { useState, useEffect, useCallback, memo } from 'react'
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import useStores from '@src/utils/hooks/useStores'
import dynamic from 'next/dynamic'
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false })
import { Observer } from 'mobx-react'
import { toJS } from 'mobx';
const thousands = require('thousands')

import RowRadioButtonsGroup from '@src/components/inputs/CustomRowRadioButtonGroup'
import CustomButton from '@src/components/inputs/CustomButton';
import momentTz from 'moment-timezone'
import CustomPicker from '@src/components/inputs/CustomPicker'
import { timeOptionList, timeDefaultValue } from '@src/configs/graphConfig';
import { countryTimeZoneConfig } from '@src/configs/commonConfig';
import { historicalCurveTitleConfig } from '@src/configs/graphConfig'

const ResponsiveAppBar = ({ volatilityCurveData, volumeCurveData, spreadCurveData, stockOptionList, tabValue, currencyCountry, params = {} }) => {
  const { commonStore } = useStores()
  const [time, setTime] = useState(params.time ? params.time : timeDefaultValue)
  const [title, setTitle] = useState()
  const [activeCurve, setActiveCurve] = useState(params.activeCurve ? params.activeCurve : 'VOLUME')
  const [stock, setStock] = useState(
    stockOptionList.length > 0 ?
      params.stock ?
        params.stock : stockOptionList[0].value
      : '')

  useEffect(() => {
    switch (activeCurve) {
      case 'VOLUME':
        commonStore.transformVolumeCurveData({
          groupTime: parseInt(time),
          stock: tabValue === '1' ? null : stock,
          // timeZone: countryTimeZoneConfig[currencyCountry],
          tabValue
        })
        break;
      case 'SPREAD':
        commonStore.transformSpreadCurveData({
          groupTime: parseInt(time),
          stock: tabValue === '1' ? null : stock,
          // timeZone: countryTimeZoneConfig[currencyCountry],
          tabValue
        })
        break;
      case 'VOLATILITY':
        commonStore.transformVolatilityCurveData({
          groupTime: parseInt(time),
          stock: tabValue === '1' ? null : stock,
          // timeZone: countryTimeZoneConfig[currencyCountry],
          tabValue
        })
        break;
      default:
        break;
    }
  }, [time, activeCurve, stock])

  useEffect(() => {
    if (tabValue === '1') {
      commonStore.setSingleStockIntradayGridParams({ activeCurve, time })
    }
    if (tabValue === '2') {
      commonStore.setPortfolioIntradayGridParams({ activeCurve, time, stock })
    }
  }, [activeCurve, time, stock])

  const chartData2 = {
    options: {
      colors: ['#194174'],
      chart: {
        id: 'basic-bar',
        animations: {
          speed: 200
        },
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          easing: 'linear',
          speed: 800,
          animateGradually: {
            enabled: false,
            delay: 150
          }
        }
      },
      xaxis: {
        labels: {
          rotate: -45,
          style: {
            fontSize: '10px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 400,
            cssClass: 'apexcharts-xaxis-label',
          },
          // formatter: timeZoneFormattor
        },
        categories: activeCurve === 'VOLUME' ? volumeCurveData.times : activeCurve === 'SPREAD' ? spreadCurveData.times : volatilityCurveData.times
      },
      yaxis: {
        forceNiceScale: true,
        max: activeCurve === 'VOLUME' ?
          undefined :
          activeCurve === 'SPREAD' ?
            Math.max(...spreadCurveData.data) + 1
            :
            Math.max(...volatilityCurveData.data),
        min: activeCurve === 'VOLUME' ?
          undefined :
          activeCurve === 'SPREAD' ?
            (Math.min(...spreadCurveData.data) - 2 < 0 ?
              undefined
              :
              Math.min(...spreadCurveData.data) - 2)
            :
            Math.min(...volatilityCurveData.data),
        labels: {
          formatter: (value) => {
            return thousands(value.toFixed(0))
          },
          style: {
            fontSize: '10px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 400,
            cssClass: 'apexcharts-xaxis-label',
          },
        }
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        y: {
          formatter: (value) => {
            return thousands(value)
          }
        }
      },
    },
    series: [
      {
        // name: 'series-1',
        data: activeCurve === 'VOLUME' ? volumeCurveData.data : activeCurve === 'SPREAD' ? spreadCurveData.data : volatilityCurveData.data
      }
    ]
  }

  return (
    <Observer>
      {
        () =>
          <>
            <div className='local-exchage-time-subtitle'>Local Exchange Time</div>
            <div className='historical-intraday-profiles'>
              <div className='button-wrapper'>
                <div><CustomButton active={activeCurve === 'VOLUME'}
                  onClick={() => setActiveCurve('VOLUME')}
                >Volume</CustomButton ></div>
                <div><CustomButton active={activeCurve === 'SPREAD'}
                  onClick={() => setActiveCurve('SPREAD')}
                >Spread</CustomButton ></div>
                <div><CustomButton active={activeCurve === 'VOLATILITY'}
                  onClick={() => setActiveCurve('VOLATILITY')}
                >Volatility</CustomButton ></div>
              </div>
              <div className='checkbox-wrapper'>
                <div>
                  <RowRadioButtonsGroup
                    optionList={timeOptionList}
                    setFieldValue={setTime}
                    value={time}
                  />
                </div>
                {
                  tabValue === '2' &&
                  <div>
                    <CustomPicker
                      optionList={stockOptionList}
                      setFieldValue={setStock}
                      value={stock}
                    />
                  </div>
                }
              </div>
              <div className='grid-chart'>
                <div className='chart-title'>{historicalCurveTitleConfig[activeCurve]}</div>
                <ApexCharts
                  options={chartData2.options}
                  series={chartData2.series}
                  type='bar'
                  height={350}
                />
              </div>
            </div>
          </>
      }
    </Observer >

  )
}
export default memo(ResponsiveAppBar)
