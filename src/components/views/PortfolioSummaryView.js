import * as React from 'react'
import { roundTo } from 'round-to'
import { commonUtil } from '@src/utils'
import { NumericFormat } from 'react-number-format';
import { Observer } from 'mobx-react'

const ResponsiveAppBar = ({ info, currencyCountry }) => {
  return (
    <Observer>

      {
        () =>
          <div className='portfolio-summary'>
            <div>
              <div />
              <div>No. of Stock</div>
              <div>{info.totalStockNumber}</div>
            </div>
            <div>
              <div />
              <div>Total Shares</div>
              {/* <div>{`${commonUtil.getNumberWithCommaSeparator(String(info.totalQuantity))}`}</div> */}
              <div><NumericFormat value={String(info.totalQuantity)} displayType='text' thousandSeparator="," /> </div>
            </div>

            <div>
              <div />
              <div>Total Value</div>
              {/* <div>{`${commonUtil.getNumberWithCommaSeparator(String(roundTo(info.totalValueTraded, 0)))} ${currencyCountry}`}</div> */}
              <div><NumericFormat value={String(roundTo(info.totalValueTraded, 0))} displayType='text' thousandSeparator="," /> {currencyCountry} </div>
            </div>
            {/* <div>
          <div />
          <div>Market Cap</div>
          <div>{info.exchCode}</div>
        </div> */}
            <div>
              <div />
              <div>Day Volatility</div>
              {/* <div>{`${roundTo(info.avgVoatility * 100, 2)} %`}</div> */}
              <div><NumericFormat value={String(roundTo(info.avgVoatility * 100, 2))} displayType='text' thousandSeparator="," /> %</div>
            </div>
            <div>
              <div />
              <div>% ADV</div>
              {/* <div>{`${roundTo(info.avgAdv, 2)} %ADV`}</div> */}
              <div><NumericFormat value={String(roundTo(info.avgAdv, 2))} displayType='text' thousandSeparator="," />  %</div>
            </div>
            <div>
              <div />
              <div>Avg Spread</div>
              {/* <div>{`${roundTo(info.avgSpread, 2)} bps`}</div> */}
              <div><NumericFormat value={String(roundTo(info.avgSpread, 2))} displayType='text' thousandSeparator="," /> bps</div>
            </div>
          </div>
      }
    </Observer>

  )
}
export default ResponsiveAppBar
