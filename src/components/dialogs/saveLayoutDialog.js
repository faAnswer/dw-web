import { useCallback, useState, useEffect } from 'react'
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CustomButton from '@src/components/inputs/CustomButton'

import ColumnRadioButtonGroup from '@src/components/inputs/CustomColumnRadioButtonGroup'

export default function SaveLayoutDialog (props) {
  const { setSaveDialogOpened, saveLayout, saveLayoutOptionList, handleClose, saveMode, setSaveMode } = props

  return (
    <div className='save-layout-dialog-container'>
      <Paper elevation={3}>
        <div className='close-button-wrapper'>
          <IconButton color='inherit' onClick={() => { handleClose() }}>
            <CloseRoundedIcon fontSize='medium' />
          </IconButton>
        </div>
        <div className='radio-button-container'>
          <ColumnRadioButtonGroup
            optionList={saveLayoutOptionList}
            setFieldValue={setSaveMode}
            value={saveMode}
          />
        </div>
        <div className='button-wrapper'>
          <CustomButton variant="outlined" onClick={
            () => {
              saveLayout()
              handleClose()
            }}>Confirm</CustomButton>
        </div>
      </Paper>
    </div>
  )
}
