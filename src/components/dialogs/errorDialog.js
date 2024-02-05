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

export default function ErrorDialog (props) {
  const { setMessageDialog, isMessageDialogOpened, messageBody, closeAction } = props

  const handleCloseAction = () => {
    setMessageDialog(false)
    closeAction()
  }
  return (
    <>
      <Dialog
        PaperProps={{ sx: { width: 300 } }}
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
            {'Error'}
          </Typography>
          <Typography variant="body2">
            {messageBody}
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
