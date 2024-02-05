import { useState, useEffect } from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { styled } from "@mui/material/styles"

const StyledSwitch = styled(FormGroup)((props) => ({
  '&.MuiFormGroup-root': {
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  }
}))

export default function CustomSwitch ({ form, field, initValue, label = '', setFieldValue, value, defaultValue = true }) {

  useEffect(() => {
    setFieldValue(defaultValue)
  }, [defaultValue])

  const handleChange = (event) => {
    let value = event.target.checked
    setFieldValue(value)
  }
  return (
    <StyledSwitch>
      <FormControlLabel control={<Switch color='primary' checked={value} onChange={handleChange} />} label={label} />
    </StyledSwitch>
  )
}