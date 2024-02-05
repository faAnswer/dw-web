
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
    color: '#8B8B8B',
    paddingBottom: '2px'
  },
  '&.MuiTextField-root': {
    height: '100%',
    '.MuiInputBase-root': {
      height: '100%'
    },
    '.Mui-error': {
      color: props.disableErrorColor ? '#707070' : 'red',
      '.MuiOutlinedInput-notchedOutline': {
        borderColor: props.disableErrorColor ? '#707070' : 'red',
      },
    },
  }
}))

export default function CustomTimePicker ({ form, field, initValue, label, placeholder, disableMinute = false, disableOpenPicker = false, includeSecond = false, removeTimezoneIndicate = false, disableErrorColor = false }) {
  useEffect(() => {
    if (field.value === undefined) {
      if (initValue) {
        const time = removeTimezoneIndicate ? moment(newValue).tz('Asia/Hong_Kong').format().replace('+08:00', '') : moment(newValue).tz('Asia/Hong_Kong').format()
        form.setFieldValue(field.name, time)
      } else {
        form.setFieldValue(field.name, null)
      }
    }
  }, [])

  const handleChange = (newValue) => {
    const time = removeTimezoneIndicate ? moment(newValue).tz('Asia/Hong_Kong').format().replace('+08:00', '') : moment(newValue).tz('Asia/Hong_Kong').format()
    form.setFieldValue(field.name, time)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={3}>
        <StyledTimePicker
          disableErrorColor={disableErrorColor}
          label={label}
          value={field.value}
          onChange={handleChange}
          inputFormat={disableMinute ? 'HH:00' : includeSecond ? 'HH:mm:ss' : 'HH:mm'}
          minutesStep={disableMinute ? 60 : 1}
          renderInput={(params) => <TextField {...params} />}
          ampm={false}
          disableOpenPicker={disableOpenPicker}
          inputProps={{
            placeholder: placeholder
          }}
        />
      </Stack>
    </LocalizationProvider>
  );
}

