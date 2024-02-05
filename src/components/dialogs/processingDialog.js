import React from 'react'
import Box from '@src/components/layouts/box'
import Space from '@src/components/layouts/space'
import { styled } from "@mui/material/styles"
import SystemMessageIcon from '@src/components/icons/systemMessageIcon'
import {
  Button,
  Dialog,
  DialogContent,
  Container,
  Typography
} from '@mui/material'
import WarningTwoToneIcon from '@mui/icons-material/WarningTwoTone'

const CustomDialog = styled(Dialog)((props) => ({
  '&.MuiDialog-root': {
    backdropFilter: 'blur(20px)'
  },
  '.MuiDialog-paper': {
    borderRadius: '15px',
    width: '400px',
    height: '250px',
    textAlign: 'center'
  },
}))

export default function formDialog (props) {
  const { setProcessDialog, isProcessDialogOpened, handleConfirmButtonClicked } = props

  return (
    <>
      <CustomDialog
        // PaperProps={{ sx: { width: 400, textAlign: 'center', height: 200 } }}
        fullWidth={true}
        maxWidth={'md'}
        open={isProcessDialogOpened}
        onClose={() => setProcessDialog(false)}
      >
        <DialogContent className='center'>
          <Box size={2} />
          <SystemMessageIcon
            messageType='LOADING'
          />
          <Box size={2} />
          <Typography component="h6" variant="h6">
            {"Processing..."}
          </Typography>
        </DialogContent>
      </CustomDialog>
    </>
  )
}