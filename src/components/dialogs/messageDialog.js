import React from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  Container,
  Typography,
  Box
} from '@mui/material'
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone'
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone'
import SystemMessageIcon from '@src/components/icons/systemMessageIcon'

const getMessage = (messageType) => {
  let message = {
    header: 'Congratulations',
    body: '',
    type: 'SUCCESS'
  }
  switch (messageType) {
    case 'NO_PROFILE':
      message.header = 'Warning'
      message.type = 'WARNING'
      message.body = 'Please create a profile first!'
      break;
    case 'MISSING_INPUT':
      message.header = 'Warning'
      message.type = 'WARNING'
      message.body = 'Please input data first!'
      break;
    case 'MISSING_FORM_CONFIRM':
      message.header = 'Warning'
      message.type = 'WARNING'
      message.body = 'Please click confirm to save form!'
      break;
    case 'SAVE_LAYOUT':
      message.body = 'Your changes have been successfully saved!'
      break;
    case 'MISS_OPTIMIZED_INPUT':
      message.header = 'Warning'
      message.type = 'WARNING'
      message.body = 'Additional parameter/ client config setting is detected. Please input Order Type, Side and Strategy in order to generate Optimized Parameters.'
      break;
    case 'MISS_EXCEL_OPTIMIZED_INPUT':
      message.header = 'Warning'
      message.type = 'WARNING'
      message.body = 'Please input valid side, strategy, order type and limit price if optimized params data is required'
      break;
    case 'MISSING_MANDATORY_EXCEL_VALUE':
      message.header = 'Invalid Formart'
      message.type = 'WARNING'
      message.body = 'Value of column "Symbol" and "OrderQty" are mandatory. Please upload again!'
      break;
    case 'INVALID_EXCEL_INPUT':
      message.header = 'Invalid Excel Invalid'
      message.type = 'WARNING'
      message.body = 'Invalid value is detected and filted.'
      break;
    case 'MISSING_MANDATORY_EXCEL_COLUMN':
      message.header = 'Invalid Formart'
      message.type = 'WARNING'
      message.body = 'Column of "Symbol" and "OrderQty" are mandatory. Please upload again!'
      break;
    case 'MISSING_PARAM_FIELD':
      message.header = 'Warning'
      message.type = 'WARNING'
      message.body = 'Please input/select value for the selected parameter.'
      break;
    case 'MISSING_PARAM_VALUE':
      message.header = 'Warning'
      message.type = 'WARNING'
      message.body = 'Please input param value!'
      break;
    case 'INCORRECT_SINGLE_STOCK_FILE':
      message.header = 'Warning'
      message.type = 'WARNING'
      message.body = 'Please upload input file in portfolio page!'
      break;
    case 'INCORRECT_PORTFOLIO_FILE':
      message.header = 'Warning'
      message.type = 'WARNING'
      message.body = 'Please upload input file in single stock page!'
      break;
    case 'INVALID_FILE_EXTENSION':
      message.header = 'Warning'
      message.type = 'WARNING'
      message.body = 'Please upload input file in csv or xlsx format!'
      break;
    case 'INVALID_ADDITIONAL_PARAMS_FIELD':
      message.header = 'Warning'
      message.type = 'WARNING'
      message.body = 'Please input/select value for the selected parameter.'
      break;
    case 'INVALID_ADDITIONAL_PARAMS_FORM_FIELD':
      message.header = 'Warning'
      message.type = 'WARNING'
      message.body = 'Invalid field is detected!'
      break;
    case 'INVALID_PROFILE_NAME':
      message.header = 'Warning'
      message.type = 'WARNING'
      message.body = 'Invalid profile name is detected!'
      break;
    case 'INVALID_SYMBOL':
      message.header = 'Warning'
      message.type = 'WARNING'
      message.body = 'Invalid Symbol!'
      break;
    case 'DUPLICATE_PROFILE_NAME':
      message.header = 'Warning'
      message.type = 'WARNING'
      message.body = 'Duplicate profile name!'
      break;
    case 'DUPLICATE_SYMBOL':
      message.header = 'Warning'
      message.type = 'WARNING'
      message.body = 'Response data with duplicate symbols has been found!'
      break;
    case 'EMPTY_GRID':
      message.header = 'Warning'
      message.type = 'WARNING'
      message.body = 'Please ensure that at least one grid is enabled.'
      break;
    case 'FETCH_API_ERROR':
      message.header = 'Warning'
      message.type = 'WARNING'
      message.body = 'Fetch api error!'
      break;
    default:
      break;
  }
  return message
}

export default function messageDialog (props) {
  const { setMessageDialog, isMessageDialogOpened, messageType } = props
  const message = getMessage(messageType)

  return (
    <>
      <Dialog
        PaperProps={{ sx: { width: 1000 } }}
        fullWidth={true}
        maxWidth={'sm'}
        open={isMessageDialogOpened}
        onClose={() => setMessageDialog(false)}
      >
        <DialogContent className='center'>
          <Box mt={2} />
          <SystemMessageIcon
            messageType={message.type}
          />
          <Box mt={3} />
          <Typography component="h6" variant="h6">
            {message.header}
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line', textAlign: 'left', marginLeft: '30px', marginRight: '30px', maxHeight: '300px', overflow: 'auto' }}>
            {message.body}
          </Typography>
          <Box mt={3} />
          <Container>
            <Button onClick={() => setMessageDialog(false)} variant="contained" color="primary" >OK</Button>
          </Container>
          <Box mt={3} />
        </DialogContent>
      </Dialog>
    </>
  )
}
