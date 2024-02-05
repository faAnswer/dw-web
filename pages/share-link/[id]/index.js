import '@node_modules/react-grid-layout/css/styles.css'
import '@node_modules/react-resizable/css/styles.css'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import LoginAuthLayout from '@src/components/layouts/loginAuthLayout'
import Main from '@src/components/views/MainView'

export default function Home (props) {
  const router = useRouter()
  const [sharedLinkId, setSharedLinkId] = useState(null)
  useEffect(() => {
    const { id } = router.query
    setSharedLinkId(id)
  }, [router.query])
  return (
    <LoginAuthLayout>
      {
        sharedLinkId &&
        <Main sharedLinkId={sharedLinkId} />
      }
    </LoginAuthLayout>
  )
}