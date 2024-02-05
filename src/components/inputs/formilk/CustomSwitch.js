import { useState, useEffect } from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';


export default function CustomSwitch ({ form, field, initValue, label = '', setFieldValue, value, defaultValue = undefined }) {

  useEffect(() => {
    if (defaultValue) {
      form.setFieldValue(field.name, defaultValue)
    }
  }, [defaultValue])

  const handleChange = (event) => {
    let value = event.target.checked
    form.setFieldValue(field.name, value)
  }
  return (
    <FormGroup>
      <FormControlLabel control={<Switch color='primary' checked={field.value === undefined ? true : field.value} onChange={handleChange} />} label={label} />
    </FormGroup>
  )
}