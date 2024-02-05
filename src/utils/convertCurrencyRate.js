export default function convertCurrencyRate ({ originCountry, originCountryRate, toCountry, toCountryRate }) {
  let currencyRate;
  if (originCountry === 'USD') {
    currencyRate = parseFloat(toCountryRate)
  } else {
    if (toCountry === 'USD') {
      currencyRate = 1 / parseFloat(originCountryRate)
    } else {
      currencyRate = parseFloat(toCountryRate) / parseFloat(originCountryRate)
    }
  }
  return currencyRate
}