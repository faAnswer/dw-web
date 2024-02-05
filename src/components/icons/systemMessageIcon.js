import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone'
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone'
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles'

const CustomCheckCircleTwoToneIcon = styled(CheckCircleTwoToneIcon)({
  fontSize: '3.5rem !important'
});

const CustomErrorTwoToneIcon = styled(ErrorTwoToneIcon)({
  fontSize: '3.5rem !important'
});

const CustomCircularProgress = styled(CircularProgress)({
  fontSize: '3.5rem !important'
});

export default function SystemMessageIcon ({ messageType }) {
  return (
    <>
      {
        messageType === 'WARNING' &&
        <CustomErrorTwoToneIcon />
      }
      {
        messageType === 'SUCCESS' &&
        <CustomCheckCircleTwoToneIcon />
      }
      {
        messageType === 'LOADING' &&
        <CustomCircularProgress />
      }
    </>

  )
}