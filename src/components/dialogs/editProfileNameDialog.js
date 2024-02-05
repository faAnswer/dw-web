import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField'
import { styled } from "@mui/material/styles"
import ClearSharpIcon from '@mui/icons-material/ClearSharp';
import IconButton from '@mui/material/IconButton';
import Button from '@src/components/inputs/CustomButton'
import ColumnRadioButtonGroup from '@src/components/inputs/CustomColumnRadioButtonGroup'

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


export default function EditProfileNameDialog (props) {
  const { title, setFormDialog, isFormDialogOpened, handleSubmitButtonClicked, saveProfileName, setSaveProfileName } = props

  return (
    <CustomDialog
      fullWidth={true}
      maxWidth={'sm'}
      open={isFormDialogOpened}
      onClose={() => setFormDialog(false)}
    >
      <div className='close-dialog-button-wrapper'>
        <IconButton aria-label="delete" color="primary" onClick={() => setFormDialog(false)}>
          <ClearSharpIcon />
        </IconButton>
      </div>
      <div className='save-profile-dialog-container'>
        <div className='form-dialog-title-container'>
          <div>Change Profile Name</div>
        </div>
        <div className='profile-dialog-input'>
          <TextField
            label='Profile Name'
            variant='standard'
            onChange={(event) => { setSaveProfileName(event.target.value) }}
            value={saveProfileName}
          />
        </div>
      </div>
      <div className='submit-button-wrapper'>
        <div className='button-wrapper'>
          <Button onClick={() => handleSubmitButtonClicked()}>Save</Button>
        </div>
      </div>
    </CustomDialog>
  )
}