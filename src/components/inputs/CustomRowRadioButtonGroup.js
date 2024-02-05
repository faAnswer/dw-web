import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { styled } from '@mui/material/styles';

const CustomizedFormControlLabel = styled(FormControlLabel)`
  color: #707070;
`;
export default function rowRadioButtonsGroup ({ optionList = [], label = '', setFieldValue, value }) {

  const handleChange = (event) => {
    setFieldValue(event.target.value);
  };

  return (
    <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">{label}</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={value}
        onChange={handleChange}
      >
        {
          optionList.map((option, index) => {
            return (
              <CustomizedFormControlLabel value={option.value} control={<Radio />} label={option.label} key={index} />
            )
          })
        }
      </RadioGroup>
    </FormControl>
  );
}