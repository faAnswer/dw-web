import { createTheme } from '@mui/material/styles'
import { red, green, grey, orange, blue } from '@mui/material/colors'

// Create a theme instance.
const theme = createTheme({
  typography: {
    fontFamily: 'Segoe UI',
    fontWeightRegular: 'bold'
  },
  palette: {
    primary: {
      main: '#194174',
      contrastText: '#fff'
    },
    secondary: {
      main: '#D8A500', // #f5f5f5
      contrastText: '#000'
    },
    background: {
      default: '#fff',
    },
  },
})

export default theme
