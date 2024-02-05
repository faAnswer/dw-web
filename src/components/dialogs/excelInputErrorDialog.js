import React from 'react'
import Box from '@src/components/layouts/box'
import {
  Button,
  Dialog,
  DialogContent,
  Container,
  Typography
} from '@mui/material'
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone'

import SystemMessageIcon from '@src/components/icons/systemMessageIcon'

export default function ExcelInputErrorDialog (props) {
  const { setMessageDialog, isMessageDialogOpened, excelErrorMessage = 'Invalid excel input field value is detected and filtered!', closeAction } = props

  const handleCloseAction = () => {
    setMessageDialog(false)
    closeAction()
  }
  return (
    <>
      <Dialog
        PaperProps={{ sx: { width: 1000 } }}
        fullWidth={true}
        maxWidth={'sm'}
        open={isMessageDialogOpened}
        onClose={() => handleCloseAction}
      >
        <DialogContent className='center'>
          <Box size={2} />
          <SystemMessageIcon
            messageType='WARNING'
          />
          <Box size={3} />
          <Typography component="h6" variant="h6">
            {'Warning'}
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line', textAlign: 'left', marginLeft: '30px', marginRight: '30px', maxHeight: '300px', overflow: 'auto' }}>
            {excelErrorMessage}
          </Typography>
          <Box size={3} />
          <Container>
            <Button onClick={handleCloseAction} variant="contained" color="primary" >OK</Button>
          </Container>
          <Box size={3} />
        </DialogContent>
      </Dialog>
    </>
  )
}
