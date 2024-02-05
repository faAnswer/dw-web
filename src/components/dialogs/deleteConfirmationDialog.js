import React from 'react'
import Box from '@src/components/layouts/box'
import Space from '@src/components/layouts/space'
import SystemMessageIcon from '@src/components/icons/systemMessageIcon'
import {
  Button,
  Dialog,
  DialogContent,
  Container,
  Typography
} from '@mui/material'
import WarningTwoToneIcon from '@mui/icons-material/WarningTwoTone'

export default function formDialog (props) {
  const { setAlertDialog, isAlertDialogOpened, handleConfirmDeleteButtonClicked, dialogMessage = '' } = props

  return (
    <>
      <Dialog
        PaperProps={{ sx: { width: 300, textAlign: 'center' } }}
        fullWidth={true}
        maxWidth={'sm'}
        open={isAlertDialogOpened}
        onClose={() => setAlertDialog(false)}
      >
        <DialogContent className='center'>
          <Box size={2} />
          <SystemMessageIcon
            messageType='WARNING'
          />
          <Box size={2} />
          <Typography component="h6" variant="h6">
            {"Are you sure?"}
          </Typography>
          <Typography variant="body2">
            {dialogMessage}
          </Typography>
          <Box size={4} />
          <Container sx={{ display: 'flex' }}>
            <Button onClick={() => setAlertDialog(false)} variant="contained" color="primary">Cancel</Button>
            <Space size={3} />
            <Button onClick={handleConfirmDeleteButtonClicked} variant="contained" color="primary">Confirm</Button>
          </Container>
          <Box size={3} />
        </DialogContent>
      </Dialog>
    </>
  )
}