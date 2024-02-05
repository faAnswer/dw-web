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

export default function AdditionalParamConfirmationDialog (props) {
  const { setAlertDialog, isAlertDialogOpened, handleConfirmButtonClicked, handleCloseButtonClicked } = props

  return (
    <>
      <Dialog
        PaperProps={{ sx: { width: 600, textAlign: 'center' } }}
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
            {"Do you want to confirm changes?"}
          </Typography>
          {/* <Typography variant="body2">
            {" Are you sure to save changes?"}
          </Typography> */}
          <Box size={4} />
          <Container sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={handleConfirmButtonClicked} variant="contained" color="primary" sx={{ width: '100px' }}>Confirm</Button>
            <Space size={3} />
            <Button onClick={handleCloseButtonClicked} variant="contained" color="primary" sx={{ width: '100px' }}>No</Button>
          </Container>
          <Box size={3} />
        </DialogContent>
      </Dialog>
    </>
  )
}