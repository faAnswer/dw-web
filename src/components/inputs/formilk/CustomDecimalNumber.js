import React, { useState } from 'react'
// import TextField from '@mui/material/TextField'
import { InputAdornment, TextField } from "@mui/material";
import { styled } from "@mui/material/styles"
import { NumericFormat } from "react-number-format";

const CustomTextField = styled(TextField)((props) => ({
  '.MuiFormLabel-root': {
    // color: '#707070',
    // opacity: '50%' 
    marginLeft: '10px',
    color: '#8B8B8B',
  },
  '.MuiInput-input': {
    marginLeft: '9px'
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
    isFormik = true, fieldValue, setFieldValue, variant = 'standard', includeDecimalPoint = true,
    form, field, type, label, placeholder, disabled, rows, multiline, className = '', error = false, errorText = ''
  } = props
  const params = { label, placeholder, disabled, rows, multiline }

  const handleChange = (event) => {
    let value = event.floatValue
    if (type === 'number') {
      value = Number(value)
    }
    if (value === undefined) {
      value = ''
    }
    if (isFormik) {
      form.setFieldValue(field.name, value)
    } else {
      setFieldValue(value)
    }
  }

  return (
    // <CustomTextField
    //   autoComplete={autoComplete}
    //   disabled={disabled}
    //   error={error}
    //   label="Error"
    //   helperText={errorText}
    //   type={type}
    //   value={field.value || ''}
    //   variant={variant}
    //   // defaultValue={isFormik ? field.value : fieldValue}
    //   onChange={handleChange}
    //   fullWidth
    //   InputProps={{ disableUnderline: false }}
    //   {...params}
    // />
    <NumericFormat
      // type="number"
      value={field.value || ''}
      customInput={CustomTextField}
      onValueChange={handleChange}
      thousandSeparator=","
      decimalSeparator="."
      decimalScale={includeDecimalPoint ? undefined : 0}
      fullWidth
      variant={variant}
      {...params}
    // {...materialUiTextFieldProps}
    />
  )
}
