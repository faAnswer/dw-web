import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { styled } from "@mui/material/styles"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ListItemText from '@mui/material/ListItemText';
import { ListItem } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CustomSelect = styled(Select)((props) => ({
  '.MuiSelect-select': {
    color: '#ffffff',
    paddingLeft: '10px',
    backgroundColor: 'none'
  },
  '.MuiSelect-select:focus': {
    background: 'none'
  },
  "&:before": {
    borderColor: "#A4A4A4"
  },
  '&.MuiInputBase-root': {
    backgroundColor: 'transparent',
    whiteSpace: "unset",
    wordBreak: "break-all"
  }
}))

const CustomSvgIcon = styled(KeyboardArrowDownIcon)((props) => ({
  '&.MuiSvgIcon-root': {
    color: '#D8A500'
  }
}))


const CustomMenuItem = styled(MenuItem)((props) => ({
  '&.MuiMenuItem-root': {
    color: '#8B8B8B',
    paddingLeft: '20px',
    whiteSpace: "break-spaces",
    wordBreak: "break-all",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  '&.MuiMenuItem-root > div:nth-of-type(2)': {
    fontSize: '12px'
  }
}))

export default function SelectVariants ({ optionList = [], title = '', setFieldValue = () => { }, value = null, callBack = () => { }, hideSvgIcon = false, deleteProfileButtonClick, handleEditProfileNameButtonClick, handleProfileOnChange }) {
  const handleChange = (event) => {
    setFieldValue(event.target.value);
    handleProfileOnChange(event.target.value)
  };

  const handleClick = async (clickedValue) => {
    if (value === clickedValue) {
      setFieldValue('')
      await new Promise(resolve => setTimeout(resolve, 100));
      setFieldValue(clickedValue)
      handleProfileOnChange(clickedValue)
    }
  }

  return (
    <FormControl variant="filled" sx={{ width: '100%', visibility: optionList.length === 0 ? 'hidden' : 'visible' }}>
      <InputLabel id="demo-simple-select-standard-label">{title}</InputLabel>
      <CustomSelect
        labelId="demo-simple-select-standard-label"
        id="demo-simple-select-standard"
        value={value}
        onChange={handleChange}
        label={title}
        disableUnderline={true}
        IconComponent={hideSvgIcon ? '' : CustomSvgIcon}
        renderValue={(selected) => {
          return optionList.length > 0 ? optionList.find(option => option.value === selected).label : ''
        }}
      >
        {
          optionList.map((option, index) => {
            return (
              <CustomMenuItem value={option.value} key={index} onClick={() => handleClick(option.value)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <div>{option.label}</div>
                  <div>
                    <IconButton color="primary" onClick={(clickEvent) => handleEditProfileNameButtonClick(clickEvent, option.value)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="primary" onClick={(clickEvent) => deleteProfileButtonClick(clickEvent, option.value)}>
                      <DeleteIcon />
                    </IconButton>
                  </div>

                </div>
                <div>{option.subLabel}</div>
              </CustomMenuItem>
            )
          })
        }
      </CustomSelect>
    </FormControl>
  );
}