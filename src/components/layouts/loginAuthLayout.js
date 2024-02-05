import React, { useEffect, useState } from 'react'
import Drawer from '@src/components/layouts/drawer'
import Loading from '@src/components/layouts/loading'
import { useRouter } from 'next/router'
import useStores from '@src/utils/hooks/useStores'

const Layout = (props) => {
  const { authStore } = useStores()
  const [isReady, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (router.pathname === '/dashboard') {
      if (!authStore.isAuthenticated) {
        router.push('/login')
      } else {
        setReady(true)
      }
    }
  }, [])

  useEffect(() => {
    const id = router.query.id
    if (router.pathname === '/share-link/[id]' && id) {
      if (!authStore.isAuthenticated) {
        router.push({
          pathname: '/login',
          query: { id },
        })
      } else {
        setReady(true)
      }
    }
  }, [router.query.id])

  return (
    <>
      {
        isReady && <>{props.children}</>
      }
    </>
  )
}

export default Layout
