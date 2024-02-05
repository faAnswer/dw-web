import React, { useState, useEffect, useCallback } from 'react'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { Observer } from 'mobx-react'
import { useRouter } from 'next/router'
import useStores from '@src/utils/hooks/useStores'

import LoginForm from '@src/components/form/loginForm'
import Box from '@src/components/layouts/box'
import ErrorDialog from '@src/components/dialogs/errorDialog'
import LoginAppBar from '@src/components/layouts/LoginAppBar'
import Footer from '@src/components/layouts/footer'

let currentFormikProps = null

export default function SignIn (props) {
  const { authStore } = useStores()
  const [isErrorDialogOpened, setErrorDialog] = useState(false)
  const router = useRouter()
  useEffect(() => {
    authStore.logout()
  }, [])

  const handleKeyPress = useCallback(async (e) => {
    if (e.key === 'Enter') {
      handleSubmitButton()
    }
  }, [])

  useEffect(() => {
    // Add the global event listener when the component mounts
    window.addEventListener('keydown', handleKeyPress);

    // Remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const handleBindFormik = (formikProps) => {
    currentFormikProps = formikProps
  }

  const handleSubmitForm = async (values) => {
    const sharedLinkId = router.query.id
    const { userId, password } = values
    await authStore.login({ userId, password })
    if (!authStore.error) {
      if (sharedLinkId) {
        router.push({
          pathname: `/share-link/${sharedLinkId}`
        })
      } else {
        router.push('/dashboard')
      }
    } else {
      setErrorDialog(true)
    }
  }

  const handleSubmitButton = () => {
    currentFormikProps.submitForm()
  }

  // const handleForgotPasswordClicked = () => {
  //   router.push('/cms/forgot-password')
  // }

  return (
    <div className='login-wrapper'>
      <LoginAppBar />
      <Container component='main' maxWidth='xs'>
        <div className='login-form-container '>
          <CssBaseline />
          <Avatar>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign In
          </Typography>
          <Box size={5} />
          <LoginForm
            initialValues={authStore.loginForm}
            submitAction={handleSubmitForm}
            bindFormikAction={handleBindFormik}
          />
          <Box size={2} />
          <Box size={2} />
          <Button
            id='submit-btn'
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            // className={classes.submit}
            onClick={handleSubmitButton}
          >
            Sign In
          </Button>
          <Box size={2} />
          {/* <div className={'link'} onClick={handleForgotPasswordClicked}>{t('common:login:forgot_password')}</div> */}
          <Observer>
            {
              () => {
                return (
                  <>
                    <ErrorDialog
                      isMessageDialogOpened={isErrorDialogOpened}
                      setMessageDialog={setErrorDialog}
                      messageBody={authStore.error}
                      closeAction={authStore.clearError}
                    />
                  </>
                )
              }
            }
          </Observer>
        </div>
      </Container>
      <Footer />
    </div>
  )
}
