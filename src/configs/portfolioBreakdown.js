const groupOptionList =
  [
    { label: '% ADV Group', value: 'adv' },
    // { label: 'Side', value: 'side' },
    { label: 'Country', value: 'country' },
    { label: 'Spread Group', value: 'spread' },
    { label: 'Volatility Group', value: 'volatility' },
    // { label: 'Market Cap Group', value: 'MARKET_CAP_GROUP' },
  ]
const groupDefaultValue = 'adv'

const advGraphConfigList = [
  {
    label: '0-0.5% ADV',
    lowestValue: '0',
    upperValue: '0.5'
  },
  {
    label: '0.5-1% ADV',
    lowestValue: '0.5',
    upperValue: '1'
  },
  {
    label: '1-3% ADV',
    lowestValue: '1',
    upperValue: '3'
  },
  {
    label: '3-5% ADV',
    lowestValue: '3',
    upperValue: '5'
  },
  {
    label: '5-10% ADV',
    lowestValue: '5',
    upperValue: '10'
  },
  {
    label: '10-15% ADV',
    lowestValue: '10',
    upperValue: '15'
  },
  {
    label: '15-30% ADV',
    lowestValue: '15',
    upperValue: '30'
  },
  {
    label: '30-70% ADV',
    lowestValue: '30',
    upperValue: '70'
  },
  {
    label: '70-100% ADV',
    lowestValue: '70',
    upperValue: '100'
  },
  {
    label: '>100% ADV',
    lowestValue: '100',
    upperValue: '9999'
  }
]

const spreadGraphConfigList = [
  {
    label: '0-5 BPS',
    lowestValue: '0',
    upperValue: '5'
  },
  {
    label: '5-10 BPS',
    lowestValue: '5',
    upperValue: '10'
  },
  {
    label: '10-25 BPS',
    lowestValue: '10',
    upperValue: '25'
  },
  {
    label: '25-50 BPS',
    lowestValue: '25',
    upperValue: '50'
  },
  {
    label: '50-100 BPS',
    lowestValue: '50',
    upperValue: '100'
  },
  {
    label: '100-250 BPS',
    lowestValue: '100',
    upperValue: '250'
  },
  {
    label: '>250 BPS',
    lowestValue: '250',
    upperValue: '9999'
  }
]

const volatilityGraphConfigList = [
  {
    label: '0-20 %',
    lowestValue: '0',
    upperValue: '20'
  },
  {
    label: '20-25 %',
    lowestValue: '20',
    upperValue: '25'
  },
  {
    label: '25-35 %',
    lowestValue: '25',
    upperValue: '35'
  },
  {
    label: '35-45 %',
    lowestValue: '35',
    upperValue: '45'
  },
  {
    label: '45-60 %',
    lowestValue: '45',
    upperValue: '60'
  },
  {
    label: '60-80 %',
    lowestValue: '60',
    upperValue: '80'
  },
  {
    label: '80-100 %',
    lowestValue: '80',
    upperValue: '100'
  },
  {
    label: '100-150 %',
    lowestValue: '100',
    upperValue: '150'
  },
  {
    label: '>150 %',
    lowestValue: '150',
    upperValue: '9999'
  }
]

const breakdownCurveTitleMapping = {
  'adv': '% ADV Group',
  'side': 'Side',
  'country': 'Country',
  'spread': 'Spread Group',
  'volatility': 'Volatility Group',
}

export { groupOptionList, groupDefaultValue, advGraphConfigList, spreadGraphConfigList, volatilityGraphConfigList, breakdownCurveTitleMapping }