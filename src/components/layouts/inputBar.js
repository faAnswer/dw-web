import { useCallback, useEffect, useState } from 'react'
// import TextField from '@mui/material/TextField'
import TextField from '@src/components/inputs/CustomTextField'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import IconButton from '@mui/material/IconButton';
import { Observer } from 'mobx-react'

import UploadCsv from '@src/components/inputs/uploadCsv'
import CustomButton from '@src/components/inputs/CustomButton'
import HistoryListView from '@src/components/list/historyListView'
import CustomPicker from '@src/components/inputs/CustomPicker'
import { SINGLE_STOCK, PORTFOLIO } from '@src/constants/values'
import { sideOptionList, defaultSideValue } from '@src/configs/commonConfig'
import InputFieldForm from 'src/components/form/inputFieldForm'
import OptimizedParamsForm from 'src/components/form/optimizedParamsForm'
import { toJS } from 'mobx';

export default function InputBar ({
  tabValue = '2', inputFieldForm, optimizedInputParamsForm, isHistoryBoxOpened,
  portfolioFileList, singleStockFileList, handleUploadPortfolioFile,
  setHistoryBoxOpen, setAdditionalFormDialog, setClientConfigFormDialog, setPortfolioStatus, portfolioPageStatus,
  handleUploadSingleStockFile,
  handleSetSingleStockExcelDataClick, handleSetPortfolioExcelDataClick,
  handleClearSingleStockAction, handleClearPortfolioAction,
  handleDownloadExcelTemplateClick, handleDeleteSingleStockFileClick, handleDeletePortfolioFileClick,
  strategyOptionList, orderOptionList, sideOptionList,
  bindInputFormikAction, bindOptimizedFormikAction,
  handleSingleStockRunClick, handleSubmitSingleStockAction, handlePortfolioRunClick,
  singleStockDataList, portfolioDataList, handleUploadFileError,
  portfolioExcelInputData
}) {
  return (
    <div className='center'>
      <div className='input-section-wrapper'>
        <div className={'input-section' + ` ${tabValue === '2' ? 'portfolio-tab-input-section' : ''}`}>
          {
            <div className={'input-form-wrapper' + `${tabValue === '1' ? '' : ' hidden'}`}>
              <InputFieldForm
                initialValues={inputFieldForm}
                submitAction={handleSubmitSingleStockAction}
                bindFormikAction={bindInputFormikAction}
                defaultSideValue={defaultSideValue}
                sideOptionList={sideOptionList}
              />
            </div>
          }
          {
            <div className={'optimized-param-section' + `${tabValue === '1' ? '' : ' hidden'}`}>
              <div className={'optimized-params-form-wrapper'}>
                <OptimizedParamsForm
                  initialValues={optimizedInputParamsForm}
                  submitAction={() => { }}
                  bindFormikAction={bindOptimizedFormikAction}
                  sideOptionList={sideOptionList}
                  orderOptionList={orderOptionList}
                  strategyOptionList={strategyOptionList}
                  setAdditionalFormDialog={setAdditionalFormDialog}
                  setClientConfigFormDialog={setClientConfigFormDialog}
                />
              </div>
            </div>
          }
          {
            (tabValue === '1') &&
            < div className={'transfer-excel-file-section'}>
              <div className={'upload-csv-section'}>
                <div className={'upload-csv-wrapper'}>
                  {
                    (tabValue === '1') &&
                    <UploadCsv
                      setHistoryBoxOpen={setHistoryBoxOpen}
                      handleUploadFile={handleUploadSingleStockFile}
                      handleUploadFileError={handleUploadFileError}
                    />
                  }
                </div>
                <div className={'upload-csv-result-container'}>
                  {
                    (tabValue === '1') &&
                    (singleStockFileList && singleStockFileList.length > 0) &&
                    singleStockFileList.map((file, key) => {
                      return (
                        <div className='inner-container' key={key}>
                          {
                            file.isActive &&
                            < div key={key} >
                              <div className='fileName-wrapper' onClick={() => handleSetSingleStockExcelDataClick(file['excel_filename'])}>
                                {file['excel_filename']}
                              </div>
                            </div>
                          }
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>
          }
          {
            tabValue === '1' &&
            <div className={'single-stock-download-excel-section'}>
              <div className={'single-stock-download-excel-wrapper'} onClick={() => handleDownloadExcelTemplateClick(tabValue)}>
                <div><DownloadRoundedIcon fontSize='large' /></div>
                <div>Download<br />Excel Template</div>
              </div>
              <div className='button-container'>
                <div className='button-wrapper'>
                  <CustomButton id='single-stock-run-btn' variant='text' onClick={handleSingleStockRunClick}>Run</CustomButton>
                </div>
                <div className='button-wrapper'>
                  <CustomButton id='single-stock-clear-btn' variant='text' onClick={handleClearSingleStockAction}>Clear</CustomButton>
                </div>
              </div>
            </div>
          }
          {
            tabValue === '2' &&
            <div className={'portfolio-transfer-excel-file-section'}>
              <div className={'portfolio-upload-csv-section'}>
                <div className={'portfolio-upload-csv-wrapper'}>
                  {
                    (tabValue === '2') &&
                    <UploadCsv
                      setHistoryBoxOpen={setHistoryBoxOpen}
                      handleUploadFile={handleUploadPortfolioFile}
                      handleUploadFileError={handleUploadFileError}
                    />
                  }
                </div>
                <div className={'portfolio-upload-csv-result-container'} >
                  {
                    (tabValue === '2') &&
                    portfolioExcelInputData &&
                    Object.keys(portfolioExcelInputData).length > 0 &&
                    <div className='inner-container'>
                      {
                        < div>
                          <div className='fileName-wrapper' onClick={() => handleSetPortfolioExcelDataClick(portfolioExcelInputData['excel_filename'], false)}>
                            {portfolioExcelInputData['excel_filename']}
                          </div>
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>
              <div className={'portfolio-download-excel-section'}>
                <div className={'portfolio-download-excel-wrapper'} onClick={() => handleDownloadExcelTemplateClick(tabValue)}>
                  <div><DownloadRoundedIcon fontSize='large' /></div>
                  <div>Download Excel Template</div>
                </div>
                <div className='button-container'>
                  {
                    tabValue === '2' &&
                    <div className='button-wrapper'>
                      <CustomButton variant='text' onClick={handlePortfolioRunClick}>Run</CustomButton>
                    </div>
                  }
                  {
                    tabValue === '2' &&
                    <div className='button-wrapper'>
                      <CustomButton id='clear-btn' variant='text' onClick={handleClearPortfolioAction}>Clear</CustomButton>
                    </div>
                  }
                </div>
              </div>
            </div>
          }
          <Observer>
            {
              () =>
                isHistoryBoxOpened &&
                <div className='upload-history-box'>
                  {
                    tabValue === '1' &&
                    <HistoryListView
                      tabValue={tabValue}
                      handleSetUploadedExcelDataClick={handleSetSingleStockExcelDataClick}
                      handleDeleteFileClick={handleDeleteSingleStockFileClick}
                      historyList={toJS(singleStockFileList)}
                      setHistoryBoxOpen={setHistoryBoxOpen}
                      dataList={singleStockDataList}
                    />
                  }
                  {
                    tabValue === '2' &&
                    <HistoryListView
                      tabValue={tabValue}
                      handleSetUploadedExcelDataClick={handleSetPortfolioExcelDataClick}
                      handleDeleteFileClick={handleDeletePortfolioFileClick}
                      historyList={toJS(portfolioFileList)}
                      setHistoryBoxOpen={setHistoryBoxOpen}
                      portfolioDataList={portfolioDataList}
                      dataList={portfolioDataList}
                    />
                  }
                </div>
            }
          </Observer>
        </div>
      </div>
    </div>
  )
}