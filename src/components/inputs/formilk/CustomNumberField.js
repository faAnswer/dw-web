import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import { styled } from "@mui/material/styles"

const CustomTextField = styled(TextField)((props) => ({
  // '&.MuiTextField-root': {
  //   color: 'red !important',
  // },
  '.MuiFormLabel-root': {
    // color: '#707070',
    // opacity: '50%'
    color: '#8B8B8B',
  },
  '.MuiInputBase-input': {
    // color: '#707070',
    // opacity: '100%'
    color: '#8B8B8B',
  },
  '& input[type=number]': {
    'MozAppearance': 'textfield'
  },
  '& input[type=number]::-webkit-outer-spin-button': {
    'WebkitAppearance': 'none',
    margin: 0
  },
  '& input[type=number]::-webkit-inner-spin-button': {
    'WebkitAppearance': 'none',
    margin: 0
  }
}))

const CustomTextFieldWithRequiredSymbol = styled(TextField)((props) => ({
  // '&.MuiTextField-root': {
  //   color: 'red !important',
  // },
  '.MuiFormLabel-root': {
    // color: '#707070',
    // opacity: '50%'
    color: '#8B8B8B',
  },
  '.MuiFormLabel-root:before': {
    // color: '#707070',
    // opacity: '50%'
    color: 'red',
    content: '"*"'
  },
  '.MuiInputBase-input': {
    // color: '#707070',
    // opacity: '100%'
    color: '#8B8B8B',
  },
  '& input[type=number]': {
    'MozAppearance': 'textfield'
  },
  '& input[type=number]::-webkit-outer-spin-button': {
    'WebkitAppearance': 'none',
    margin: 0
  },
  '& input[type=number]::-webkit-inner-spin-button': {
    'WebkitAppearance': 'none',
    margin: 0
  }
}))

export default function VariantTextField (props) {
  const {
    autoComplete,
    isFormik = true, fieldValue, setFieldValue, variant = 'standard', id,
    form, field, type, label, placeholder, disabled, rows, multiline, className = '', error = false, errorText = '', withStyledRequiredSymbol = false
  } = props
  const params = { label, placeholder, disabled, rows, multiline, id }
  const [displayValue, setDisplayValue] = useState('')

  const getNumberWithCommaSeparator = (_str) => {
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
      return '0'
    }
    return number.toLocaleString()
  }

  const getNumber = (_str) => {
    return _str === '' || _str === '0' ? '' : parseInt(event.target.value.replaceAll(',', ''))
  }

  const handleChange = (event) => {
    const _displayValue = getNumberWithCommaSeparator(event.target.value)
    setDisplayValue(_displayValue)
    if (isFormik) {
      const value = getNumber(_displayValue)
      form.setFieldValue(field.name, value)
    } else {
      setFieldValue(value)
    }
  }

  useEffect(() => {
    if (field.value === '' || field.value === undefined) {
      setDisplayValue('')
    } else if (field.value >= 0) {
      const _displayValue = getNumberWithCommaSeparator(String(field.value))
      setDisplayValue(_displayValue)
    }
  }, [field.value])

  return (
    <>
      {
        withStyledRequiredSymbol ?
          <CustomTextFieldWithRequiredSymbol
            autoComplete={autoComplete}
            disabled={disabled}
            error={error}
            label="Error"
            helperText={errorText}
            type={type}
            value={displayValue}
            variant={variant}
            // defaultValue={isFormik ? field.value : fieldValue}
            onChange={handleChange}
            fullWidth
            InputProps={{ disableUnderline: false }}
            {...params}
          />
          :
          <CustomTextField
            autoComplete={autoComplete}
            disabled={disabled}
            error={error}
            label="Error"
            helperText={errorText}
            type={type}
            value={displayValue}
            variant={variant}
            // defaultValue={isFormik ? field.value : fieldValue}
            onChange={handleChange}
            fullWidth
            InputProps={{ disableUnderline: false }}
            {...params}
          />
      }
    </>
  )
}
