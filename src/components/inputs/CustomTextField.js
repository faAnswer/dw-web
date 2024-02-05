import TextField from '@mui/material/TextField'
import { styled } from "@mui/material/styles"

const CustomTextField = styled(TextField)((props) => ({
  // '&.MuiTextField-root': {
  //   color: 'red !important',
  // },
  '.MuiFormLabel-root': {
    color: '#707070',
    opacity: '50%'
  },
  '.MuiInputBase-input': {
    color: '#707070',
    opacity: '100%'
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
  return (
    <CustomTextField
      {...props}
    />
  )
}