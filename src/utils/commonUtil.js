import dayjs from "dayjs"

export const getHeaders = (params) => {
  let headers
  headers = {
    params: params,
    headers: {
      // userId
    }
  }
  return headers
}

export const getAuthHeaders = (params) => {
  const userId = getLocalStorage('userId')
  let headers
  headers = {
    params: params,
    headers: {
      userId
    }
  }
  return headers
}

export const getUploadHeaders = () => {
  // const token = getTokens()
  return {
    headers: {
      // Authorization: `Bearer ${token.accessToken}`,
      'content-type': 'multipart/form-data'
    }
  }
}

export const getNumberWithCommaSeparator = (_str) => {
  if (!_str) {
    return ''
  }
  var arr = _str.split('');
  var out = new Array();
  for (var cnt = 0; cnt < arr.length; cnt++) {
    if (isNaN(arr[cnt]) == false) {
      out.push(arr[cnt]);
    }
  }
  var number = Number(out.join(''))
  if (number === 0) {
    return ''
  }
  return number.toLocaleString()
}

export const setLocalStorage = (key, value, ttl) => {
  const now = new Date()

  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  }
  localStorage.setItem(key, JSON.stringify(item))
}

export const getLocalStorage = (key) => {
  const itemStr = localStorage.getItem(key)
  if (!itemStr) {
    return null
  }
  const item = JSON.parse(itemStr)
  const now = new Date()
  if (now.getTime() > item.expiry) {
    removeLocalStorage(key)
    return null
  }
  return item.value
}

export const removeLocalStorage = (key) => {
  localStorage.removeItem(key)
}

export const sortByDateDesc = (array, key) => {
  const result = [...array]
  return result.sort(function (a, b) {
    return dayjs(b[key]).diff(dayjs(a[key]))
  });
}