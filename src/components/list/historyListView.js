import CustomButton from '@src/components/inputs/CustomButton';
import Paper from '@mui/material/Paper';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import IconButton from '@mui/material/IconButton';
import moment from 'moment';
import { Observer } from 'mobx-react'
import { toJS } from 'mobx';
import { commonUtil } from '@src/utils'

export default function historyListView (props) {
  const { historyList = [], setHistoryBoxOpen, handleDeleteFileClick, handleSetUploadedExcelDataClick, dataList, tabValue } = props
  let excelList = []
  if (dataList) {
    if (tabValue === '1') {
      excelList = dataList.find((profileData) => profileData.name === 'single-stock-template').excel
    }
    if (tabValue === '2') {
      excelList = dataList.find((profileData) => profileData.name === 'portfolio-template').excel
    }
    excelList = commonUtil.sortByDateDesc(excelList, 'createdDate')
  }
  return (
    <Paper elevation={3}>
      <div className='upload-history-container'>
        <div>
          <IconButton
            onClick={() => { setHistoryBoxOpen(false) }}
            color="primary"
          >
            <CloseRoundedIcon
              id='upload-history-btn'
              fontSize='medium'
            />
          </IconButton>
        </div>
        <div>
          <div>File Name</div>
          <div>Uploaded Date & Time</div>
          <div />
        </div>
        <div className='history-list-container'>
          {
            excelList.map((excel, key) => {
              return (
                <div className='history-list-row' key={key}>
                  <div>{excel.excel_filename}</div>
                  <div>{moment(excel.createdDate).format('YYYY-MM-DD HH:mm')}</div>
                  <div className='button-container'>
                    <div className='button-wrapper'>
                      <CustomButton variant='text' color='inherit' active={excel.isActive} onClick={() => {
                        handleSetUploadedExcelDataClick(excel.excel_filename)
                        // setHistoryBoxOpen(false)
                      }}>Select</CustomButton>
                    </div>
                    <div className='button-wrapper'>
                      <CustomButton variant='text' color='inherit' onClick={() => {
                        handleDeleteFileClick(excel.excel_filename)
                        // setHistoryBoxOpen(false)
                      }}>Delete</CustomButton>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </Paper>
  )
}