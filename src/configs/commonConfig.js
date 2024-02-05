const portfolioApiParamsMap = {
  PRIMARY_RIC: 'PRIMARY_RIC',
  SYMBOL: 'SYMBOL',
  Symbol: 'Symbol',
  QUANTITY: 'QUANTITY',
  OrderQty: 'OrderQty',
  SIDE: 'SIDE',
  Side : 'Side',
  ORDER_TYPE: 'ORDER_TYPE',
  OrdType: 'OrdType',
  PRICE: 'PRICE',
  Price: 'Price',
  AGGRESSIVE_FV_OPTION: 'AGGRESSIVE_FV_OPTION',
  ARRIVAL_SCALER_CAP: 'ARRIVAL_SCALER_CAP',
  FV_OFFSET_BP: 'FV_OFFSET_BP',
  START_TIME: 'START_TIME'
}

const saveLayoutOptionList = [
  { label: 'Layout Only', value: '1' },
  { label: 'Layout including input data', value: '2' }
]

const defaultSaveLayoutValue = '1'

const marketConditionTypeConfig = {
  cumulative: 'accum',
  thirtyMin: '30min'
}

const defaultMarketConditionType = 'accum'

const sideOptionList = [
  {
    label: 'Buy',
    value: 'Buy'
  },
  {
    label: 'Sell',
    value: 'Sell'
  }
]

const defaultSideValue = 'Buy'

const orderTypeOptionList = [
  {
    label: 'Market',
    value: 'Market'
  },
  {
    label: 'Limit',
    value: 'Limit'
  }
]

const defaultOrderTypeValue = 'Market'

const countryTimeZoneConfig = {
  'HKD': 'Asia/Hong_Kong',
  'JPY': 'Japan',
  'USD': 'America/New_York'
}

const layoutResizeButtonVisibleConfig = ['s', 'e', 'se']

export {
  portfolioApiParamsMap,
  saveLayoutOptionList,
  defaultSaveLayoutValue,
  marketConditionTypeConfig,
  defaultMarketConditionType,
  layoutResizeButtonVisibleConfig,
  sideOptionList,
  orderTypeOptionList,
  defaultSideValue,
  defaultOrderTypeValue,
  countryTimeZoneConfig
}