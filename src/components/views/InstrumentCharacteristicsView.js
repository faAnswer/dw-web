import * as React from 'react'
import { roundTo } from 'round-to'
import { NumericFormat } from 'react-number-format';

const ResponsiveAppBar = ({ info, analyticData, inputFieldForm, currencyCountry }) => {
  return (
    <div className='instrument-characteristics'>
      <div>
        <div />
        <div>Symbol</div>
        <div>{info.primaryRic}</div>
      </div>
      <div>
        <div />
        <div>Name</div>
        <div>{info.description}</div>
      </div>
      <div>
        <div />
        <div>Country</div>
        <div>{info.countryCode}</div>
      </div>
      <div>
        <div />
        <div>Exchange</div>
        <div>{info.exchCode}</div>
      </div>
      {/* <div>
          <div />
          <div>Sector</div>
          <div>Industrials</div>
        </div> */}
      {/* <div>
          <div />
          <div>Industry</div>
          <div>Diversified</div>
        </div> */}
      <div>
        <div />
        <div>Security Type</div>
        <div>{info.securityType}</div>
      </div>
      {/* <div>
          <div />
          <div>Market Cap</div>
          <div>{`${Math.round(info.marketCap)} ${currencyCountry}`}</div>
        </div> */}
      <div>
        <div />
        <div>Day Volatility</div>
        {/* <div>{`${roundTo(analyticData.CLOSE_VOLATILITY_0.data * 100, 2)} %`}</div> */}
        <div><NumericFormat value={roundTo(analyticData.CLOSE_VOLATILITY_0.data * 100, 2)} displayType='text' thousandSeparator="," /> %</div>
      </div>
      <div>
        <div />
        <div>%ADV</div>
        {/* <div>{`${roundTo(inputFieldForm.quantity * 100 / analyticData.VOLUME_0.data[0], 2)}% ADV`}</div> */}
        <div><NumericFormat value={roundTo(inputFieldForm.quantity * 100 / analyticData.VOLUME_0.data[0], 2)} displayType='text' thousandSeparator="," /> %</div>
      </div>
      <div>
        <div />
        <div>Avg Spread</div>
        {/* <div>{`${roundTo(analyticData.AVERAGE_SPREAD_0.data[0], 2)} bps`}</div> */}
        <div><NumericFormat value={roundTo(analyticData.AVERAGE_SPREAD_0.data[0], 2)} displayType='text' thousandSeparator="," /> bps</div>
      </div>
      <div>
        <div />
        <div>MOO %Vol</div>
        {/* <div>{`${roundTo((analyticData.VOLUME_60.amOpen * 100) / analyticData.VOLUME_0.data[0], 2)} %`}</div> */}
        <div><NumericFormat value={roundTo((analyticData.VOLUME_60.amOpen * 100) / analyticData.VOLUME_0.data[0], 2)} displayType='text' thousandSeparator="," /> %</div>
      </div>
      <div>
        <div />
        <div>MOC %Vol</div>
        {/* <div>{`${roundTo((analyticData.VOLUME_60.pmClose * 100) / analyticData.VOLUME_0.data[0], 2)} %`}</div> */}
        <div><NumericFormat value={roundTo((analyticData.VOLUME_60.pmClose * 100) / analyticData.VOLUME_0.data[0], 2)} displayType='text' thousandSeparator="," /> %</div>
      </div>
    </div>
  )
}
export default ResponsiveAppBar
