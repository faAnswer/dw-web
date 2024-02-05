const textColumnFilterModeOptions = ['contains', 'equals']
const numberColumnFilterModeOptions = ['between', 'contains', 'equals', 'greaterThan', 'greaterThanOrEqualTo', 'lessThan', 'lessThanOrEqualTo']

const equals = (row, id, filterValue) => {
  return `${row.getValue(id)}` === `${filterValue}`;
}

const contains = (row, id, filterValue) => {
  return `${row.getValue(id)}`.includes(`${filterValue}`)
}

const lessThan = (row, id, filterValue) => {
  if (!row.getValue(id)) {
    return false
  }
  return row.getValue(id) < filterValue
}

const lessThanOrEqualTo = (row, id, filterValue) => {
  if (!row.getValue(id)) {
    return false
  }
  return row.getValue(id) <= filterValue
}

const greaterThan = (row, id, filterValue) => {
  if (!row.getValue(id)) {
    return false
  }
  return row.getValue(id) > filterValue
}

const greaterThanOrEqualTo = (row, id, filterValue) => {
  if (!row.getValue(id)) {
    return false
  }
  return row.getValue(id) >= filterValue
}

const between = (row, id, filterValue) => {
  const max = filterValue[1]
  const min = filterValue[0]
  if (!max && !min) {
    return true
  }
  if (max && !min) {
    return row.getValue(id) <= max
  }
  if (!max && min) {
    return row.getValue(id) >= min
  }
  return row.getValue(id) >= min && row.getValue(id) <= max
}

export { textColumnFilterModeOptions, numberColumnFilterModeOptions, equals, contains, lessThan, lessThanOrEqualTo, greaterThan, greaterThanOrEqualTo, between }