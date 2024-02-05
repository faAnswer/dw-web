import { useEffect, useState, memo } from 'react'
import ProgressBar from '@src/components/inputs/progressBar'
import CustomButton from '@src/components/inputs/CustomButton'
import CustomPicker from '@src/components/inputs/CustomPicker'
import useStores from '@src/utils/hooks/useStores'
import { marketConditionTypeConfig } from '@src/configs/commonConfig'
import CommonStore from '@src/stores/CommonStore'

const ResponsiveAppBar = ({ data, tabValue, marketConditionType, setMarketConditionType, stockOptionList }) => {
  const [stock, setStock] = useState(stockOptionList.length > 0 ? stockOptionList[0].value : 'ALL')
  const { commonStore } = useStores()

  useEffect(() => {
    if (tabValue === '2') {
      commonStore.setMarketConditionStock(stock)
    }
  }, [stock])

  return (
    <div className='market-condition-indicators'>
      <div className='grid-subtitle'>Percentile rank</div>
      <div className='button-wrapper'>
        <div>
          <CustomButton
            variant='outlined'
            onClick={() => { setMarketConditionType(marketConditionTypeConfig.cumulative) }}
            active={marketConditionType === marketConditionTypeConfig.cumulative}
          >
            Cumulative
          </CustomButton>
        </div>
        <div>
          <CustomButton
            variant='outlined'
            onClick={() => { setMarketConditionType(marketConditionTypeConfig.thirtyMin) }}
            active={marketConditionType === marketConditionTypeConfig.thirtyMin}
          >
            Last 30 mins</CustomButton>
        </div>
      </div>
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
      <div className='data-wrapper'>
        <div>
          <div>Volume</div>
          <ProgressBar bgcolor={"#D8A500"} completed={`${Math.round(data.volume * 100)}`} />
          {(data.volume * 100 <= 100 && data.volume * 100 >= 80) && <div>Very High</div>}
          {(data.volume * 100 < 80 && data.volume * 100 >= 60) && <div>High</div>}
          {(data.volume * 100 < 60 && data.volume * 100 >= 40) && <div>Normal</div>}
          {(data.volume * 100 < 40 && data.volume * 100 >= 20) && <div>Low</div>}
          {(data.volume * 100 < 20) && <div>Very Low</div>}
        </div>
        <div>
          <div>Spread</div>
          <ProgressBar bgcolor={"#D8A500"} completed={`${Math.round(data.spread * 100)}`} />
          {(data.spread * 100 <= 100 && data.spread * 100 >= 80) && <div>Very Wide</div>}
          {(data.spread * 100 < 80 && data.spread * 100 >= 60) && <div>Wide</div>}
          {(data.spread * 100 < 60 && data.spread * 100 >= 40) && <div>Normal</div>}
          {(data.spread * 100 < 40 && data.spread * 100 >= 20) && <div>Tight</div>}
          {(data.spread * 100 < 20) && <div>Very Tight</div>}
        </div>
        <div>
          <div>Volatility</div>
          <ProgressBar bgcolor={"#D8A500"} completed={`${Math.round(data.volatility * 100)}`} />
          {(data.volatility * 100 <= 100 && data.volatility * 100 >= 80) && <div>Very High</div>}
          {(data.volatility * 100 < 80 && data.volatility * 100 >= 60) && <div>High</div>}
          {(data.volatility * 100 < 60 && data.volatility * 100 >= 40) && <div>Normal</div>}
          {(data.volatility * 100 < 40 && data.volatility * 100 >= 20) && <div>Low</div>}
          {(data.volatility * 100 < 20) && <div>Very Low</div>}
        </div>
      </div>
    </div>
  )
}
export default memo(ResponsiveAppBar)
