const R = require('ramda');

export default function hasDuplicateStocks ({array, key = 'symbol'}) {
  const uniqueStocks = R.uniqBy(R.prop(key), array);
  return array.length !== uniqueStocks.length;
}