const ct = require('countries-and-timezones');

export default function convertTimeZone ({ countryCode }) {
  return ct.getCountry(countryCode).timezones[0] || 'Asia/Hong_Kong'
}