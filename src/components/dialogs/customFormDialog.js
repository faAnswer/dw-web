import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from "@mui/material/styles"
import ClearSharpIcon from '@mui/icons-material/ClearSharp';
import IconButton from '@mui/material/IconButton';
import Button from '@src/components/inputs/CustomButton'

const CustomDialog = styled(Dialog)((props) => ({
  '&.MuiDialog-root': {
    backdropFilter: 'blur(10px)'
  },
  '.MuiDialog-paper': {
    borderRadius: '15px',
    minWidth: '800px',
    height: '508px'
  },
}))


export default function formDialog (props) {
  const { title, setFormDialog, children, isFormDialogOpened, handleSubmitButtonClicked, handleCloseButtonClicked } = props
  return (
    <>
      <CustomDialog
        fullWidth={true}
        maxWidth={'sm'}
        open={isFormDialogOpened}
        // onClose={() => setFormDialog(false)}
      >
        <div className='close-dialog-button-wrapper'>
          <IconButton aria-label="delete" color="primary" onClick={handleCloseButtonClicked}>
            <ClearSharpIcon />
          </IconButton>
        </div>
        <div className='form-dialog-title-container'>
          <div>{title}</div>
        </div>
        <>{children}</>
        <div className='submit-button-wrapper'>
          <div className='button-wrapper'>
            <Button onClick={handleSubmitButtonClicked}>Confirm</Button>
          </div>
        </div>
      </CustomDialog>
    </>
  )
}
