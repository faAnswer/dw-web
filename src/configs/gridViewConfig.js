import envConfig from "./envConfig"

const defaultViewVisbleConfig = {
  'INSTRUMENT_CHARACTERISTICS': true,
  'MARKET_CONDITION_INDICATORS': envConfig.marketConditionEnable,
  'HISTORICAL_INTRADAY_PROFILES': true,
  'TRADE_SCHEDULE_ESTIMATE': true,
  'OPTIMIZED_PARAMETERS': true,
  'PORTFOLIO_SUMMARY': true,
  'PORTFOLIO_BREAKDOWN': true
}

export { defaultViewVisbleConfig }



