import React, { useEffect, useState } from 'react'
import { getStores, StoreProvider } from '@src/stores/stores'
import { Provider } from 'mobx-react'
import '@src/styles/globals.scss'
import '@src/styles/home.scss'
import '@src/styles/dropzone.scss'
import '@src/styles/react-grid-item.scss'
import '@src/styles/trade-detail.scss'
import '@src/styles/login.scss'
import theme from '@src/components/theme'
import { ThemeProvider } from '@mui/material/styles'
import Head from 'next/head'

function MyApp ({ Component, pageProps }) {
  const mobxStore = getStores()

  return (
    <>
      <Head>
        <title>Daiwa Analytics Platform</title>
      </Head>

      <Provider {...mobxStore}>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </Provider>
    </>
  )
}

export default MyApp
