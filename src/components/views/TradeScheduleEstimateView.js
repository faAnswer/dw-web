import React, { useState, useEffect, memo, useRef } from 'react'
import dynamic from 'next/dynamic'
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false })
import useStores from '@src/utils/hooks/useStores'
import moment from 'moment'
import momentTz from 'moment-timezone'
import { observable, action, makeObservable, runInAction, computed, toJS } from 'mobx'
const thousands = require('thousands')

import { countryTimeZoneConfig } from '@src/configs/commonConfig';
import { timeOptionList, timeDefaultValue } from '@src/configs/graphConfig';
import RowRadioButtonsGroup from '@src/components/inputs/CustomRowRadioButtonGroup'
import CustomTimePicker from '@src/components/inputs/CustomTimePicker'
import CustomPicker from '@src/components/inputs/CustomPicker'
import { createActionLoggerRecord } from '@src/api/common/createActionLoggerRecord'

const ResponsiveAppBar = ({ info, tabValue, stockOptionList = [], dayOptionList, currencyCountry, inputFieldForm, disableDataTransform, params = {}, chartWidth }) => {
  const { commonStore } = useStores()
  const [time, setTime] = useState(params.time ? params.time : timeDefaultValue)
  const [isScaleDown, setScaleDown] = useState(false)
  const [disableDayPickerChange, setDisableDayPickerChange] = useState(true)
  const [day, setDay] = useState(
    dayOptionList.length ?
      params.day ?
        params.day : dayOptionList[0].value
      : '')
  const [startTime, setStartTime] = useState(params.startTime ? params.startTime : moment().format())

  const [stock, setStock] = useState(
    stockOptionList.length > 0 ?
      params.stock ?
        params.stock : stockOptionList[0].value
      : '')

  const prevTimeRef = useRef(startTime)

  useEffect(() => {

    if(startTime !== prevTimeRef.current){

      // createActionLoggerRecord({
      //   action: 'TradeScheduleStartTime',
      //   msg: moment(startTime).format('HH:mm')
      // })
    }
    prevTimeRef.current = startTime

  }, [startTime])



  useEffect(() => {
    if (disableDataTransform) {
      return
    }
    if (startTime === 'Invalid date') {
      return
    }
    const stockQuantity = tabValue === '1' ? inputFieldForm.quantity : stockOptionList.find(data => data.value === stock).quantity
    commonStore.transformTradeEstimateData(
      {
        groupTime: parseInt(time),
        day,
        stock: tabValue === '1' ? null : stock,
        quantity: stockQuantity,
        startTime: moment(startTime).format('HH:mm'),
        // timeZone: countryTimeZoneConfig[currencyCountry],
        tabValue
      }
    )
  }, [time, day, stock, startTime, inputFieldForm.quantity])

  useEffect(() => {
    if (startTime === 'Invalid date') {
      return
    }
    if (tabValue === '2') {
      commonStore.computeEstimateDuration(moment(startTime).format('HH:mm'))
    }
  }, [startTime])

  useEffect(() => {
    if (tabValue === '1') {
      commonStore.setSingleStockTradeEstimateGridParams({ time, day, startTime })
    }
    if (tabValue === '2') {
      commonStore.setPortfolioTradeEstimateGridParams({ time, day, startTime, stock })
    }
  }, [time, day, startTime, stock])

  useEffect(() => {
    setScaleDown(info.barDataList.every(yAsixValue => yAsixValue < 1))
  }, [info.barDataList])

  const timeZoneFormattor =
    // useCallback(
    (value) => {
      if (['amOpen', 'amClose', 'pmOpen', 'pmClose'].includes(value)) {
        return value
      }
      return momentTz(value, 'HH:mm').tz(countryTimeZoneConfig[currencyCountry]).format('HH:mm')
    }
  // , [currencyCountry])

  useEffect(() => {
    if (disableDayPickerChange) {
      setDisableDayPickerChange(false)
      return
    }
    setDay(dayOptionList[0].value)
  }, [dayOptionList.length, stock])

  useEffect(() => {
    if (tabValue === '1') {
      commonStore.tempSaveSingleStockTradeScheduleTime(time)
    }
    if (tabValue === '2') {
      commonStore.tempSavePortfolioTradeScheduleTime(time)
    }
  }, [time])

  useEffect(() => {
    if (tabValue === '1') {
      commonStore.tempSaveSingleStockTradeScheduleStartTime(moment(startTime).format('HH:mm'))
    }
    if (tabValue === '2') {
      commonStore.tempSavePortfolioTradeScheduleStartTime(moment(startTime).format('HH:mm'))
    }
  }, [startTime])

  // useEffect(() => {
  //   if (tabValue === '2') {
  //     commonStore.tempSavePortfolioTradeScheduleStock(stock)
  //   }
  // }, [stock])

  const chartData = {
    series: [{
      name: 'Estimated Shares',
      type: 'column',
      data: toJS(info.barDataList)
    }, {
      name: 'Culmulative %',
      type: 'line',
      data: toJS(info.accumulatedDataList),
    }],
    options: {
      colors: ['#194174', '#e5c456'],
      chart: {
        height: 350,
        width: '100%',
        type: 'line',
        toolbar: {
          show: false,
        }
      },
      stroke: {
        width: [0, 4]
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: []
      },
      labels: info.times,
      // labels: ['pmClose'],
      xaxis: {
        rotate: -45,
        formatter: timeZoneFormattor,
        rotateAlways: false,
        labels: {
          style: {
            fontSize: '10px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 400,
            cssClass: 'apexcharts-xaxis-label',
          },
        }
        // type: 'datetime'
      },
      yaxis: [
        // estimate value
        {
          forceNiceScale: true,
          min: 0,
          labels: {
            formatter: (value) => {
              return thousands(value)
              // return isScaleDown ? value.toPrecision(2) : value.toFixed(0)
            },
            style: {
              fontSize: '10px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 400,
              cssClass: 'apexcharts-xaxis-label',
            },
          }
        },
        // culmulative value
        {
          opposite: true,
          forceNiceScale: false,
          // max: 100,
          // max: Math.max(...info.accumulatedDataList),
          min: Math.min(...info.accumulatedDataList) === 100 ? 0 : Math.min(...info.accumulatedDataList),
          labels: {
            formatter: (value) => {
              return value.toFixed(1)
            },
            style: {
              fontSize: '10px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 400,
              cssClass: 'apexcharts-xaxis-label',
            },
          }
        }]
    }
  }

  return (
    <>
      <div className='local-exchage-time-subtitle'>Local Exchange Time</div>
      <div className='picker-container'>
        <div className='time-picker-container'>
          <div>
            <CustomTimePicker
              disableOpenPicker={true}
              label='Start Time'
              field={{ value: startTime }}
              form={{ setFieldValue: (name, newValue) => { setStartTime(newValue) } }}
            />
          </div>
        </div>
        {
          tabValue === '2' &&
          <div className='selector-container'>
            <CustomPicker
              optionList={stockOptionList}
              setFieldValue={setStock}
              value={stock}
            />
          </div>
        }
      </div>

      <div className='checkbox-wrapper'>
        <div>
          <RowRadioButtonsGroup
            optionList={timeOptionList}
            setFieldValue={setTime}
            value={time}
          />
        </div>
        <div>
          <CustomPicker
            optionList={dayOptionList}
            setFieldValue={setDay}
            value={day}
          />
        </div>
      </div>
      <div className='grid-chart'>
        <div id='chart'>
          <div className='chart-title'>Estimated Shares and Culmulative %</div>
          <ApexCharts
            options={chartData.options}
            series={chartData.series}
            type='line'
            height={350}
            // width={1000}
            width={chartWidth}
          />
        </div>
      </div>
    </>
  )
}
export default memo(ResponsiveAppBar)
