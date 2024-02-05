
import { DataGrid } from '@mui/x-data-grid';
import { styled } from "@mui/material/styles"
import { roundTo } from 'round-to'
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import { NumericFormat, numericFormatter } from 'react-number-format';
import { textColumnFilterModeOptions, numberColumnFilterModeOptions, equals, contains, lessThan, lessThanOrEqualTo, greaterThan, greaterThanOrEqualTo, between } from '@src/configs/defaultTradeDetailTableConfig'
const thousands = require('thousands')
const R = require('ramda')

// new material ui
import React, { useEffect, useMemo, useRef, useState } from 'react';

//MRT Imports
import MaterialReactTable from 'material-react-table';
import { useMrtState } from 'material-react-table';

//Material-UI Imports
import {
  Box,
  Button,
  ListItemIcon,
  MenuItem,
  Typography,
  TextField,
} from '@mui/material';
//Date Picker Imports
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { toJS } from 'mobx';


function CustomDataGridFooter ({ aggregateData, currencyCountry }) {
  return (
    <div className='data-grid-footer'>
      <div className='data-grid-footer-table-head-row'>
        <div className='table-head-spacing'></div>
        <div className='table-head-cell'>Shares</div>
        <div className='table-head-cell'>Value Traded{` (${currencyCountry})`}</div>
        <div className='table-head-cell adv-cell'>% ADV</div>
        <div className='table-head-cell spread-cell'>Spread (bps)</div>
        <div className='table-head-cell'>Volatility (%)</div>
        <div className='table-head-cell moo-cell'>% MOO</div>
        <div className='table-head-cell moc-cell'>% MOC</div>
        <div className='table-head-cell'>Est. Duration (Day)</div>
        {/* <div className='table-head-cell config-manager-cell'>Config Manager Performance Estimate</div>
        <div className='table-head-cell performance-estimate-cell'>Performance Estimate</div> */}
      </div>
      <div className='data-grid-footer-table-body-row'>
        <div className='footer-title'>Total</div>
        <div className='footer-data'>
          <div className='table-cell'>{aggregateData && aggregateData.totalShares ? <NumericFormat value={String(aggregateData.totalShares)} displayType='text' thousandSeparator="," /> : ''}</div>
          <div className='table-cell'>{aggregateData && aggregateData.totalValueTraded ? <NumericFormat value={String(roundTo(aggregateData.totalValueTraded, 0))} displayType='text' thousandSeparator="," /> : ''}</div>
          <div className='table-cell adv-cell'>{aggregateData && aggregateData.avgAdv ? <NumericFormat value={String(aggregateData.avgAdv)} displayType='text' thousandSeparator="," suffix=' %' /> : ''}</div>
          <div className='table-cell spread-cell'>{aggregateData && aggregateData.avgSpread ? <NumericFormat value={String(aggregateData.avgSpread)} displayType='text' thousandSeparator="," suffix=' bps' /> : ''}</div>
          <div className='table-cell'>{aggregateData && aggregateData.avgVoatility ? <NumericFormat value={String(aggregateData.avgVoatility)} displayType='text' thousandSeparator="," suffix=' %' /> : ''}</div>
          <div className='table-cell moo-cell'>{aggregateData && aggregateData.avgMoo ? <NumericFormat value={String(aggregateData.avgMoo)} displayType='text' thousandSeparator="," suffix=' %' /> : ''}</div>
          <div className='table-cell moc-cell'>{aggregateData && aggregateData.avgMoc ? <NumericFormat value={String(aggregateData.avgMoc)} displayType='text' thousandSeparator="," suffix=' %' /> : ''}</div>
          <div className='table-cell'>{aggregateData && aggregateData.maxEstimateDuration ? aggregateData.maxEstimateDuration : ''}</div>
          {/* <div className='table-cell config-manager-cell'>{(aggregateData && (aggregateData.beforeOptimizedPerformance && !isNaN(aggregateData.beforeOptimizedPerformance))) ? <NumericFormat value={String(roundTo(aggregateData.beforeOptimizedPerformance, 2))} displayType='text' thousandSeparator="," /> : '-'}</div>
          <div className='table-cell performance-estimate-cell'>{(aggregateData && (aggregateData.optimizedPerformance && !isNaN(aggregateData.optimizedPerformance))) ? <NumericFormat value={String(roundTo(aggregateData.optimizedPerformance, 2))} displayType='text' thousandSeparator="," /> : '-'}</div> */}
        </div>
      </div>

    </div>
  )
}

export default function DataTable ({ tableData, aggregateData, currencyCountry, allOptimizedParamsData, isVisible, setTradeDetailTableConfig, tradeDetailTableConfig }) {
  let columns = [
    { accessorKey: 'symbol', header: 'Symbol', size: 100, columnFilterModeOptions: textColumnFilterModeOptions, filterFn: 'equals', },
    { accessorKey: 'name', header: 'Name', size: 100, columnFilterModeOptions: textColumnFilterModeOptions, filterFn: 'equals', },
    { accessorKey: 'country', header: 'Country', size: 80, columnFilterModeOptions: textColumnFilterModeOptions, filterFn: 'equals', },
    { accessorKey: 'side', header: 'Side', size: 85, columnFilterModeOptions: textColumnFilterModeOptions, filterFn: 'equals', },
    { accessorKey: 'orderType', header: 'Order Type', size: 85, columnFilterModeOptions: textColumnFilterModeOptions, filterFn: 'equals' },
    {
      accessorKey: 'price', header: 'Limit Price', size: 40, headerAlign: 'center', columnFilterModeOptions: numberColumnFilterModeOptions, filterFn: 'between',
      Cell: function renderCell ({ renderedCellValue, row }) {
        const value = (renderedCellValue)
        if (!value) {
          return '-'
        }
        if (value.props) {
          return thousands(value.props['aria-label'])
        }
        return thousands(value)
      }
    },
    { accessorKey: 'strategy', header: 'Strategy', size: 85, columnFilterModeOptions: textColumnFilterModeOptions, filterFn: 'equals', },
    {
      accessorKey: 'portfolioPercentage', header: '% Portfolio', size: 85, columnFilterModeOptions: numberColumnFilterModeOptions, filterFn: 'equals',
      Cell: function renderCell ({ renderedCellValue, row }) {
        const value = (renderedCellValue)
        if (!value) {
          return '-'
        }
        if (value.props) {
          return `${thousands(value.props['aria-label'])} %`
        }
        return `${thousands(value)} %`
      }
    },
    {
      accessorKey: 'shares', header: 'Shares', size: 80, columnFilterModeOptions: numberColumnFilterModeOptions, filterFn: 'equals',
      Cell: function renderCell ({ renderedCellValue, row }) {
        const value = (renderedCellValue)
        if (!value) {
          return '-'
        }
        if (value.props) {
          return thousands(value.props['aria-label'])
        }
        return thousands(value)
      }
    },
    {
      accessorKey: 'valueTraded', header: `Value Traded (${currencyCountry})`, size: 150, columnFilterModeOptions: numberColumnFilterModeOptions, filterFn: 'equals',
      Cell: function renderCell ({ renderedCellValue, row }) {
        const value = (renderedCellValue)
        if (!value) {
          return '-'
        }
        if (value.props) {
          return thousands(value.props['aria-label'])
        }
        return thousands(value)
      }
    },
    {
      accessorKey: 'adv', header: '% ADV', size: 80, columnFilterModeOptions: numberColumnFilterModeOptions, filterFn: 'equals',
      Cell: function renderCell ({ renderedCellValue, row }) {
        const value = (renderedCellValue)
        if (!value) {
          return '-'
        }
        if (value.props) {
          return `${thousands(value.props['aria-label'])} %`
        }
        return `${thousands(value)} %`
      },
    },
    {
      accessorKey: 'spread', header: 'Spread (bps)', size: 130, columnFilterModeOptions: numberColumnFilterModeOptions, filterFn: 'equals',
      Cell: function renderCell ({ renderedCellValue, row }) {
        const value = (renderedCellValue)
        if (!value) {
          return '-'
        }
        if (value.props) {
          return `${thousands(value.props['aria-label'])} bps`
        }
        return `${thousands(value)} bps`
      }
    },
    {
      accessorKey: 'volatility', header: 'Volatility (%)', size: 130, columnFilterModeOptions: numberColumnFilterModeOptions, filterFn: 'equals',
      Cell: function renderCell ({ renderedCellValue, row }) {
        const value = (renderedCellValue)
        if (!value) {
          return '-'
        }
        if (value.props) {
          return `${thousands(value.props['aria-label'])} %`
        }
        return `${thousands(value)} %`
      }
    },
    {
      accessorKey: 'moo', header: '% MOO', size: 95, headerAlign: 'center', columnFilterModeOptions: numberColumnFilterModeOptions, filterFn: 'equals',
      Cell: function renderCell ({ renderedCellValue, row }) {
        const value = (renderedCellValue)
        if (!value) {
          return '-'
        }
        if (value.props) {
          return `${thousands(value.props['aria-label'])} %`
        }
        return `${thousands(value)} %`
      }
    },
    {
      accessorKey: 'moc', header: '% MOC', size: 90, headerAlign: 'center', columnFilterModeOptions: numberColumnFilterModeOptions, filterFn: 'equals',
      Cell: function renderCell ({ renderedCellValue, row }) {
        const value = (renderedCellValue)
        if (!value) {
          return '-'
        }
        if (value.props) {
          return `${thousands(value.props['aria-label'])} %`
        }
        return `${thousands(value)} %`
      }
    },
    { accessorKey: 'estimateDuration', header: 'Est. Duration (Day)', size: 100, cellStyle: 'center', columnFilterModeOptions: numberColumnFilterModeOptions, filterFn: 'equals', }
  ];
  if (allOptimizedParamsData.length > 0) {
    const optimizedParamsField = []
    aggregateData['optimizedFieldList'] = []
    let optimizedPerformanceSumProduct = 0
    let beforeOptimizedPerformanceSumProduct = 0

    allOptimizedParamsData.forEach((optimizedParamsData) => {
      //each stock
      const optimizedParamDataList = optimizedParamsData.optimizedParameters
      const beforeOptimizedPerformance = optimizedParamsData.beforeOptimizedPerformance
      const optimizedPerformance = optimizedParamsData.optimizedPerformance

      if (optimizedParamsField.length === 0) {
        optimizedParamsField.push(
          {
            accessorKey: 'beforeOptimizedPerformance', header: 'Config Manager Performance Estimate', size: 265, columnFilterModeOptions: numberColumnFilterModeOptions, filterFn: 'equals',
            Cell: function renderCell ({ renderedCellValue, row }) {
              const value = (renderedCellValue)
              if (!value) {
                return '-'
              }
              if (value.props) {
                return thousands(value.props['aria-label'])
              }
              return thousands(value)
            }
          }
        )
        optimizedParamsField.push(
          {
            accessorKey: 'optimizedPerformance', header: 'Performance Estimate', size: 180, columnFilterModeOptions: numberColumnFilterModeOptions, filterFn: 'equals',
            Cell: function renderCell ({ renderedCellValue, row }) {
              const value = (renderedCellValue)
              if (!value) {
                return '-'
              }
              if (value.props) {
                return thousands(value.props['aria-label'])
              }
              return thousands(value)
            }
          }
        )
      }
      const stock = optimizedParamsData.symbol
      const tradeDetailFound = tableData.find((tradeDetailData) => tradeDetailData.symbol === stock)
      if (!tradeDetailFound) {
        return
      }
      const valueTraded = tradeDetailFound['valueTraded']
      // handle performance estimate
      tradeDetailFound['optimizedPerformance'] = optimizedPerformance
      tradeDetailFound['beforeOptimizedPerformance'] = beforeOptimizedPerformance
      optimizedPerformanceSumProduct += (valueTraded * optimizedPerformance)
      beforeOptimizedPerformanceSumProduct += (valueTraded * beforeOptimizedPerformance)
      for (let optimizedParamData of optimizedParamDataList) {
        const fieldName = optimizedParamData.parameter
        const value = optimizedParamData.value
        const type = optimizedParamData.type
        const fieldFound = optimizedParamsField.find((fieldData) => fieldData.accessorKey === fieldName)
        if (tradeDetailFound) {
          tradeDetailFound[fieldName] = value
        }
        if (fieldFound) {
          continue
        }
        let columnFilterModeOptions
        switch (type) {
          case 'Float':
          case 'Int':
            columnFilterModeOptions = numberColumnFilterModeOptions
            break;
          default:
            columnFilterModeOptions = textColumnFilterModeOptions
            break;
        }

        optimizedParamsField.push(
          {
            accessorKey: fieldName, header: fieldName, size: 90, columnFilterModeOptions, filterFn: 'equals',
            Cell: function renderCell ({ renderedCellValue, row }) {
              const value = (renderedCellValue)
              if (!value) {
                return '-'
              }
              if (value.props) {
                return value.props['aria-label']
              }
              return value
            }
          },
        )
        aggregateData['optimizedFieldList'].push({ fieldName, value: '-' })
      }
    })
    aggregateData['optimizedPerformance'] = optimizedPerformanceSumProduct ? optimizedPerformanceSumProduct / aggregateData['totalValueTraded'] : '-'
    aggregateData['beforeOptimizedPerformance'] = beforeOptimizedPerformanceSumProduct ? beforeOptimizedPerformanceSumProduct / aggregateData['totalValueTraded'] : '-'
    columns = [...columns, ...optimizedParamsField]
  }
  const [columnOrderList, setColumnOrderList] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [sorting, setSorting] = useState([]);

  useEffect(() => {
    const { columnOrderList, columnVisibility, sorting } = tradeDetailTableConfig
    setColumnOrderList(columnOrderList.length === 0 ? columns.map((obj) => obj.accessorKey) : columnOrderList)
    setColumnVisibility(columnVisibility)
    setSorting(sorting)
  }, [])

  useEffect(() => {
    setTradeDetailTableConfig({ columnVisibility, columnOrderList, sorting })
  }, [JSON.stringify(columnVisibility), JSON.stringify(columnOrderList), JSON.stringify(sorting)])

  return (
    <>
      {
        isVisible &&
        <>
          <div className='trade-detail-table-view'>
            {
              <MaterialReactTable
                enableGlobalFilter={false}
                data={isVisible ? tableData : []}
                columns={isVisible ? columns : []}
                enableFilterMatchHighlighting={false}
                enableColumnFilterModes
                enableStickyHeader
                enableColumnOrdering={true}
                enableFullScreenToggle={false}
                enableDensityToggle={false}
                enablePagination={true}
                state={{
                  columnVisibility,
                  columnOrder: columnOrderList,
                  sorting
                }}

                filterFns={{ equals, contains, lessThan, lessThanOrEqualTo, greaterThan, greaterThanOrEqualTo, between }}
                onColumnVisibilityChange={setColumnVisibility}
                onColumnOrderChange={setColumnOrderList}
                onSortingChange={setSorting}
                muiTableHeadCellProps={{
                  sx: {
                    color: '#194174',
                    fontWeight: 900,
                    fontSize: 14,
                    textAlign: 'center',
                    '& .Mui-TableHeadCell-Content': {
                      justifyContent: 'center',
                    }
                  },
                }}
                muiTableBodyProps={{
                  sx: {
                    '& td': {
                      height: '100px',
                      padding: '0px',
                      color: '#707070',
                      fontSize: 15,
                      fontWeight: 'normal',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden !important',
                      textOverflow: 'ellipsis',
                    },
                  }
                }}
                muiTablePaperProps={{
                  elevation: 0
                }}
                muiTableContainerProps={{ sx: { maxHeight: '350px', minHeight: '350px' } }}
                muiBottomToolbarProps={{
                  sx: {
                    display: 'none'
                  }
                }}
              />
            }
          </div>
          {
            CustomDataGridFooter({ aggregateData, currencyCountry })
          }
        </>
      }

    </>
  );
}
