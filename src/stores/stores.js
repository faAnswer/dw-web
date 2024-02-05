import React from 'react'

import CommonStore from './CommonStore'
import AuthStore from './AuthStore'

let clientSideStores

export const getStores = (initialData = { postStoreInitialData: {} }) => {
  if (!clientSideStores) {
    clientSideStores = {
      commonStore: new CommonStore(),
      authStore: new AuthStore()
    }
  }
  return clientSideStores
}

const StoreContext = React.createContext()

export const StoreProvider = (props) => {
  return <StoreContext.Provider value={props.value}>{props.children}</StoreContext.Provider>
}

export const useMobxStores = () => {
  return React.useContext(StoreContext)
}
