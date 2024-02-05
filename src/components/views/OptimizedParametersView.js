import { useState, useEffect } from 'react'
import CustomPicker from '@src/components/inputs/CustomPicker'
import useStores from '@src/utils/hooks/useStores'

const dummyData =
{
  performanceEstimate: '22bps',
  optimizedParametersList: [
    {
      parameter: 'FVEnable',
      value: 'Y',
      description: 'To enable Fair Value'
    },
    {
      parameter: 'MaxPOV',
      value: '15%',
      description: 'Vol Cap'
    },
    {
      parameter: 'MarketView',
      value: 'MOME',
      description: 'Scale participation'
    },
    {
      parameter: 'Ahead Seconds',
      value: '120',
      description: 'Seconds for Ahead Band'
    }
  ]
}

const ResponsiveAppBar = ({ info, tabValue, stockOptionList, responseErrorMsg, disableDataTransform = false, params = {} }) => {
  const [stock, setStock] = useState(
    stockOptionList.length > 0 ?
      params.stock ?
        params.stock : stockOptionList[0].value
      : '')
  const { commonStore } = useStores()

  useEffect(() => {
    if (disableDataTransform) {
      return
    }
    if (tabValue === '2') {
      commonStore.clearPortfolioOptimizedParamsResponseError()
    }
    commonStore.transformOptimzedParams(tabValue === '1' ? null : stock, tabValue)
  }, [stock])

  useEffect(() => {
    if (tabValue === '2') {
      commonStore.setPortfolioOptimizeGridParams({ stock })
    }
  }, [stock])

  return (
    <>
      <div className='optimized-parameters'>
        {
          tabValue === '2' &&
          <div className='selector-wrapper'>
            <CustomPicker
              optionList={stockOptionList}
              setFieldValue={setStock}
              value={stock}
            />
          </div>
        }
        {
          responseErrorMsg ?
            <div className='optimized-params-response-error-container'>
              <div className='error-message'>
                {responseErrorMsg}
              </div>
            </div> :
            <>
              <div className='performance-estimate-container'>
                <div className='performance-estimate-label'>Performance Estimate</div>
                <div className='performance-estimate-value'>{info.optimizedPerformance}</div>
              </div>
              <div className='performance-estimate-table-head-cells'>
                <div>Parameter</div>
                <div>Value</div>
                <div>Description</div>
              </div>
              <div className='performance-estimate-table-row-container'>
                {
                  info.optimizedParameters.map((data, index) => {
                    return (
                      <div className='table-rows' key={index}>
                        <div>{data.parameter}</div>
                        <div>{data.value}</div>
                        <div>{data.description}</div>
                      </div>
                    )
                  })
                }
              </div>

              <div className='config-manager-title'>Based on config manager</div>
              <div className='config-manager-performance-estimate-container'>
                <div className='performance-estimate-label'>Performance Estimate</div>
                <div className='performance-estimate-value'>{info.beforeOptimizedPerformance}</div>
              </div>
              <div className='config-manager-table-head-cells'>
                <div>Property</div>
                <div>Value</div>
              </div>
              <div className='config-manager-table-head-rows-container'>
                {
                  info.configManager.map((data, index) => {
                    return (
                      <div className='table-rows' key={index}>
                        <div>{data.parameter}</div>
                        <div>{data.value}</div>
                      </div>
                    )
                  })
                }
              </div>
            </>
        }
      </div>

    </>
  )
}
export default ResponsiveAppBar
