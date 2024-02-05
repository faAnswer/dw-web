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

export default function ShareLinkDialog (props) {
  const { setMessageDialog, isMessageDialogOpened, message, isloading } = props
  const handleCopyClick = () => {
    navigator.clipboard.writeText(message);
    setMessageDialog(false)
  };
  return (
    <>
      <Dialog
        PaperProps={{ sx: { width: 500, textAlign: 'center' } }}
        fullWidth={true}
        maxWidth={'sm'}
        open={isMessageDialogOpened}
        onClose={() => setMessageDialog(false)}
      >
        <DialogContent className='center'>
          <Box mt={2} />
          <SystemMessageIcon
            messageType={isloading ? 'LOADING' : 'SUCCESS'}
          />
          <Box mt={3} />
          {/* <Typography component="h6" variant="h6">
            {message.header}
          </Typography> */}
          <Typography variant="body2">
            {message}
          </Typography>
          <Box mt={3} />
          <Container>
            <Button onClick={handleCopyClick} variant="contained" color="primary" >COPY</Button>
          </Container>
          <Box mt={3} />
        </DialogContent>
      </Dialog>
    </>
  )
}
