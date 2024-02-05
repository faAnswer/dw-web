import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { styled } from "@mui/material/styles"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

const CustomSelect = styled(Select)((props) => ({
  '.MuiSelect-select': {
    // color: '#C4C4C4',
    color: '#707070',
    opacity: '100%',
    paddingLeft: '10px',
  },
  '.MuiSelect-select:focus': {
    background: 'none'
  },
  "&:before": {
    borderColor: "#A4A4A4"
  }
}))

const CustomFormControl = styled(FormControl)((props) => ({
  '.MuiFormLabel-root': {
    marginLeft: '10px'
  },
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

export default function SelectVariants ({ id = 'demo-simple-select-standard', optionList = [], title = '', setFieldValue = () => { }, value = null, callBack = () => { }, hasDescription = false }) {
  const handleChange = (event) => {
    setFieldValue(event.target.value);
  };

  return (
    <CustomFormControl variant="standard" sx={{ width: '100%' }}>
      <InputLabel id={`${id}-label`}>{title}</InputLabel>
      <CustomSelect
        labelId={`${id}-label`}
        id={id}
        value={value}
        onChange={handleChange}
        label={title}
        IconComponent={CustomSvgIcon}
      >
        {
          hasDescription ?
            optionList.map((option, index) => {
              return (
                <CustomMenuItem value={option.value} key={index}>
                  <Tooltip title={option.description} >
                    <div style={{ width: '100%' }}>
                      {
                        option.label
                      }
                    </div>
                  </Tooltip>
                </CustomMenuItem>
              )
            })
            :
            optionList.map((option, index) => {
              return (
                <CustomMenuItem value={option.value} key={index}>{option.label}</CustomMenuItem>
              )
            })
        }
      </CustomSelect>
    </CustomFormControl >
  );
}