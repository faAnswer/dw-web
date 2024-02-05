
import React, { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import moment from 'moment-timezone';

export default function CustomDateTimePicker ({ form, field, initValue, label, maxDateTime = null, minDateTime = null, disableFuture = false }) {
  useEffect(() => {
    if (field.value === undefined) {
      if (initValue) {
        form.setFieldValue(field.name, moment(initValue).tz('Asia/Hong_Kong'))
      } else {
        form.setFieldValue(field.name, null)
      }
    }
  }, [])

  const handleChange = (newValue) => {
    form.setFieldValue(field.name, moment(newValue).tz('Asia/Hong_Kong'))
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} dateLibInstanc={moment}>
      <Stack spacing={3}>
        <DateTimePicker
          label={label}
          inputFormat='yyyy-MM-dd HH:mm:ss'
          value={field.value}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
          ampm={false}
          disableFuture={disableFuture}
          maxDateTime={maxDateTime? new Date(maxDateTime) : null}
          minDateTime={minDateTime? new Date(minDateTime) : null}
        />
      </Stack>
    </LocalizationProvider>
  );
}
