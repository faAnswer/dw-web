import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import { styled } from "@mui/material/styles"

const CustomTextField = styled(TextField)((props) => ({
  '.MuiFormLabel-root': {
    // color: '#707070',
    // opacity: '50%'
    marginLeft: '10px',
    color: '#8B8B8B',
  },
  '.MuiInputBase-input': {
    // color: '#707070',
    // opacity: '100%'
    color: '#8B8B8B',
    marginLeft: '10px'
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
    id,
    autoComplete,
    isFormik = true, fieldValue, setFieldValue, variant = 'standard',
    form, field, type, label, placeholder, disabled, rows, multiline, className = '', error = false, errorText = '', withStyledRequiredSymbol = false
  } = props
  const params = { id, label, placeholder, disabled, rows, multiline }

  const handleChange = (event) => {
    let value = event.target.value
    if (type === 'number' && value) {
      value = Number(value)
    }
    if (isFormik) {
      form.setFieldValue(field.name, value)
    } else {
      setFieldValue(value)
    }
  }

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
            value={field.value || ''}
            variant={variant}
            // defaultValue={isFormik ? field.value : fieldValue}
            onChange={handleChange}
            fullWidth
            InputProps={{ disableUnderline: false }}
            {...params} />
          :
          <CustomTextField
            autoComplete={autoComplete}
            disabled={disabled}
            error={error}
            label="Error"
            helperText={errorText}
            type={type}
            value={field.value || ''}
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
