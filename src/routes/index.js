import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useStore } from '@src/stores/stores'

export default function StaticRoutes (props) {
  const router = useRouter()

  // static site handling
  useEffect(() => {
    console.log(location.pathname)
    if (location.pathname !== '/') {
      router.push(router.asPath)
    } else {
      router.push('/login')
    }
  })

  return (
    <>{props.children}</>
  )
}
