import { useState, useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { styled } from "@mui/material/styles"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const CustomSelect = styled(Select)((props) => ({
  '.MuiSelect-select': {
    // color: '#C4C4C4',
    color: '#8B8B8B',

    paddingLeft: '10px',
  },
  '.MuiSelect-select:focus': {
    background: 'none'
  },
  "&:before": {
    borderColor: "#A4A4A4"
  }
}))

const CustomSvgIcon = styled(KeyboardArrowDownIcon)((props) => ({
  '&.MuiSvgIcon-root': {
    color: '#194174'
  }
}))


const CustomMenuItem = styled(MenuItem)((props) => ({
  '&.MuiMenuItem-root': {
    color: '#8B8B8B',
    paddingLeft: '10px'
  }
}))

export default function SelectVariants ({ id, optionList, field, title, disabled = false, hasNoneOption = false, hasEmptyOption = false, form, className = '', callback = () => { }, defaultValue = '', onFocus = () => { }, onBlur = () => { } }) {

  const handleChange = (event) => {
    // const { form, field, type } = props
    let value = event.target.value
    form.setFieldValue(field.name, value)
    callback(value)
  };

  useEffect(() => {
    if (defaultValue) {
      form.setFieldValue(field.name, defaultValue)
    }
  }, [defaultValue])
  return (
    <FormControl variant="standard" sx={{ width: '100%' }}>
      <InputLabel id="demo-simple-select-standard-label">{title}</InputLabel>
      <CustomSelect
        labelId="demo-simple-select-standard-label"
        id={id}
        disabled={disabled}
        value={field.value || ''}
        onChange={handleChange}
        label={title}
        IconComponent={CustomSvgIcon}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {
          hasNoneOption &&
          <CustomMenuItem value='NONE'>
            <span>None</span>
          </CustomMenuItem>
        }
        {
          hasEmptyOption &&
          <CustomMenuItem value=''>
            <span>None</span>
          </CustomMenuItem>
        }
        {
          optionList.map((option, index) => {
            return (
              <CustomMenuItem value={option.value} id={`option-${index}`} key={index}>{option.label}</CustomMenuItem>
            )
          })
        }

      </CustomSelect>
    </FormControl>
  );
}