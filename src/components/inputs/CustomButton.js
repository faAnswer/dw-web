import { styled } from "@mui/material/styles"
import Button from "@mui/material/Button"

const CustomButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "active"
})((props) => ({
  width: '100%',
  height: '100%',
  borderRadius: 30,
  borderColor: '#70707080',
  borderWidth: '1px',
  borderStyle: 'solid',
  color: props.active ? '#fff' : '#828282',
  backgroundColor: props.active ? props.theme.palette['primary'].main : 'none',
  ':hover': {
    color: '#fff',
    backgroundColor: props.theme.palette['primary'].main,
  },
}))

export default CustomButton
