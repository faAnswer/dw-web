import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from "@mui/material/styles"
import { roundTo } from 'round-to'
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import { NumericFormat, numericFormatter } from 'react-number-format';

const CustomDataGrid = styled(DataGrid)((props) => ({
  '&.MuiDataGrid-root': {
    display: 'flex',
    justifyContent: 'center',
    border: '0px !important',
    fontWeight: 'normal',
    color: '#707070',
  },
  '.MuiDataGrid-columnHeaders': {
    minHeight: '100px !important',
    maxHeight: '100px !important',
    borderBottom: '3px solid #D8A500',
  },
  'div.MuiDataGrid-columnHeaderTitle': {
    color: '#194174',
    fontWeight: '900'
  },
  '.MuiDataGrid-iconButtonContainer': {
    position: 'absolute',
    top: -20,
    right: '50%',
    visibility: 'visible',
    width: 28,
    height: 28
  },
  '.MuiDataGrid-sortIcon': {
    opacity: '1 !important'
  },
  '.MuiDataGrid-menuIcon': {
    position: 'absolute',
    top: -20,
    visibility: 'visible',
    width: 28,
    height: 28,
    left: '50%'
  },
  '.MuiDataGrid-columnSeparator > *': {
    visibility: 'hidden',
  },
  '.MuiDataGrid-columnSeparator': {
    backgroundColor: '#F3DEA6 !important',
    width: '2px',
    minHeight: '40px !important',
    right: 0
  },
  '.MuiDataGrid-virtualScroller': {
    marginTop: '100px !important',
  },
  '.MuiDataGrid-cell': {
    display: 'flex',
    justifyContent: 'center'
  },
  '.MuiDataGrid-cellContent': {
    fontSize: '15px',
    fontWeight: 'normal',
    color: '#707070'
  },
  '.MuiDataGrid-virtualScrollerRenderZone': {
    // borderBottom: '3px solid #D8A500'
  },
  '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus': {
    outline: 'none',
  },
  '.MuiDataGrid-footerContainer': {
    display: 'none',
  }
}))

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

export default function DataTable ({ tableData, aggregateData, currencyCountry, allOptimizedParamsData, isVisible }) {
  let columns = [
    { field: 'symbol', headerName: 'Symbol', width: 90, headerAlign: 'center' },
    { field: 'name', headerName: 'Name', width: 160, headerAlign: 'center' },
    { field: 'country', headerName: 'Country', width: 90, headerAlign: 'center' },
    { field: 'side', headerName: 'Side', width: 85, headerAlign: 'center' },
    { field: 'orderType', headerName: 'Order Type', width: 85, headerAlign: 'center' },
    {
      field: 'price', headerName: 'Limit Price', width: 85, headerAlign: 'center',
      renderCell: function renderCell (params) {
        if (!params.value) {
          return '-'
        }
        return <span><NumericFormat value={params.value} displayType='text' thousandSeparator="," /></span>
      }
    },
    { field: 'strategy', headerName: 'Strategy', width: 85, headerAlign: 'center' },
    {
      field: 'portfolioPercentage', headerName: '% Portfolio', width: 85, headerAlign: 'center',
      renderCell: function renderCell (params) {
        return <span><NumericFormat value={params.value} displayType='text' thousandSeparator="," />%</span>
      }
    },
    {
      field: 'shares', headerName: 'Shares', width: 80, headerAlign: 'center',
      renderCell: function renderCell (params) {
        return <NumericFormat value={params.value} displayType='text' thousandSeparator="," />
      }
    },
    {
      field: 'valueTraded', headerName: `Value Traded (${currencyCountry})`, width: 150, headerAlign: 'center',
      renderCell: function renderCell (params) {
        if (!params.value) {
          return <NumericFormat value={params.value} displayType='text' thousandSeparator="," />
        }
        return <NumericFormat value={roundTo(params.value, 0)} displayType='text' thousandSeparator="," />
      }
    },
    { field: 'adv', headerName: '% ADV', width: 80, headerAlign: 'center' },
    {
      field: 'spread', headerName: 'Spread (bps)', width: 130, headerAlign: 'center',
      renderCell: function renderCell (params) {
        return <span> <NumericFormat value={params.value} displayType='text' thousandSeparator="," /> bps</span>
      }
    },
    { field: 'volatility', headerName: 'Volatility (%)', width: 130, headerAlign: 'center' },
    { field: 'moo', headerName: '% MOO', width: 95, headerAlign: 'center' },
    {
      field: 'moc', headerName: '% MOC', width: 90, headerAlign: 'center',
      //  headerClassName: 'hideRightSeparator'
    },
    { field: 'estimateDuration', headerName: 'Est. Duration (Day)', width: 95, headerAlign: 'center' },
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
            field: 'beforeOptimizedPerformance', headerName: 'Config Manager Performance Estimate', width: 90, headerAlign: 'center',
            renderCell: function renderCell (params) {
              return <NumericFormat value={String(params.value ? params.value : '-')} displayType='text' thousandSeparator="," />
            }
          }
        )
        optimizedParamsField.push(
          {
            field: 'optimizedPerformance', headerName: 'Performance Estimate', width: 90, headerAlign: 'center',
            renderCell: function renderCell (params) {
              return <NumericFormat value={String(params.value ? params.value : '-')} displayType='text' thousandSeparator="," />
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
      tradeDetailFound['optimizedPerformance'] = optimizedPerformance ? optimizedPerformance : '-'
      tradeDetailFound['beforeOptimizedPerformance'] = beforeOptimizedPerformance ? beforeOptimizedPerformance : '-'
      optimizedPerformanceSumProduct += (valueTraded * optimizedPerformance)
      beforeOptimizedPerformanceSumProduct += (valueTraded * beforeOptimizedPerformance)
      for (let optimizedParamData of optimizedParamDataList) {
        const fieldName = optimizedParamData.parameter
        const value = optimizedParamData.value
        const fieldFound = optimizedParamsField.find((fieldData) => fieldData.field === fieldName)
        if (tradeDetailFound) {
          tradeDetailFound[fieldName] = value
        }
        if (fieldFound) {
          continue
        }
        optimizedParamsField.push(
          {
            field: fieldName, headerName: fieldName, width: 90, headerAlign: 'center',
            renderCell: function renderCell (params) {
              return params.value ? params.value : '-'
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

  return (
    <>
      {
        isVisible &&
        <>
          <div className='trade-detail-table-view '>
            {
              <CustomDataGrid
                rows={isVisible ? tableData : []}
                columns={isVisible ? columns : []}
                pageSize={100}
                rowHeight={100}
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
