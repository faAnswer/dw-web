import { observable, action, runInAction, computed, toJS, makeObservable, reaction } from 'mobx'
import { login, updateLoginLog } from '@src/api/auth'
import { setLocalStorage, removeLocalStorage } from '@src/utils/commonUtil'
import envConfig from '@src/configs/envConfig'

class AuthStore {
  @observable userId = null
  @observable error = null
  @observable loginForm = {
    userId: '',
    password: ''
  }

  constructor (rootStore) {
    makeObservable(this)
    runInAction(() => {
      this.rootStore = rootStore
    })
  }

  @action
  login = async ({ userId, password }) => {
    try {
      const data = await login({ userId, password })
      if (data.login === 0) {
        throw data.msg
      }
      runInAction(() => {
        this.userId = userId
      })
      setLocalStorage('userId', this.userId, envConfig.authenticationTimeout)
    } catch (error) {
      runInAction(() => {
        this.error = error
      })
    }
  }

  @action
  logout = async () => {
    if (window.location.pathname !== '/login') {
      removeLocalStorage('userId')
      window.location.replace("/login");
    }
  }

  @action
  clearError = async () => {
    runInAction(() => {
      this.error = null
    })
  }

  @computed get isAuthenticated () {
    return !!this.userId
  }
}

export default AuthStore