
import React, { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { styled } from "@mui/material/styles"
import moment from 'moment-timezone';

const StyledTimePicker = styled(TimePicker)((props) => ({
  '.MuiOutlinedInput-notchedOutline': {
    borderTop: '0px',
    borderLeft: '0px',
    borderRight: '0px',
    borderRadius: '0px',
    padding: '0px'
  },
  '.MuiInputBase-input': {
    paddingBottom: '2px'
  },
  '&.MuiTextField-root': {
    height: '100%',
    '.MuiInputBase-root': {
      height: '100%'
    }
  }
}))

export default function CustomTimePicker ({ form, field, initValue, label, disableMinute = false, includeSecond = false }) {
  useEffect(() => {
    if (field.value === undefined) {
      if (initValue) {
        form.setFieldValue(field.name, moment(initValue).tz('Asia/Hong_Kong').format())
      } else {
        form.setFieldValue(field.name, null)
      }
    }
  }, [])

  const handleChange = (newValue) => {
    form.setFieldValue(field.name, moment(newValue).tz('Asia/Hong_Kong').format())
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={3}>
        <StyledTimePicker
          label={label}
          value={field.value}
          onChange={handleChange}
          inputFormat={disableMinute ? 'HH:00' : includeSecond ? 'HH:mm:ss' : 'HH:mm'}
          minutesStep={disableMinute ? 60 : 1}
          renderInput={(params) => <TextField {...params} />}
          ampm={false}
        />
      </Stack>
    </LocalizationProvider>
  );
}

