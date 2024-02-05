import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx'

import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';

export default function UploadCsv (props) {
  const { handleUploadFile, handleUploadFileError } = props

  const onDrop = useCallback(async (acceptedFiles) => {
    try {
      var reader = new FileReader();
      reader.onload = function (e) {
        var data = e.target.result;
        let readedData = XLSX.read(data, { type: 'binary' });
        const wsname = readedData.SheetNames[0];
        const ws = readedData.Sheets[wsname];

        /* Convert array to json*/
        const dataParse = XLSX.utils.sheet_to_json(ws);
        handleUploadFile({ data: dataParse, fileName: acceptedFiles[0].name, file: acceptedFiles[0] })
      };
      reader.readAsBinaryString(acceptedFiles[0]);
    } catch (error) {
      handleUploadFileError()
    }
  }, [handleUploadFile])

  const { setHistoryBoxOpen } = props
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'text/xlsx': ['.xlsx']
    },
    multiple: false
  });

  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} id='drop-zone' />
      <div className='dropzone-content-wrapper'>
        <div
          onClick={(event) => {
            setHistoryBoxOpen(true)
            event.stopPropagation()
          }}
        >
          <HistoryRoundedIcon fontSize='large' />
          Upload History
        </div>
        <div><FileUploadRoundedIcon fontSize='large' /></div>
        <div>Drag and drop,<br />or click to upload</div>
      </div>
    </div>
  );
}