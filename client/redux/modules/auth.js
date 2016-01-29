import { handleActions } from 'redux-actions'
import { routeActions } from 'react-router-redux'
import { checkHttpStatus, parseJSON } from '../../utils/webUtils'
import { actions as sidebarActions } from './sidebar'
import jwtDecode from 'jwt-decode'

// ------------------------------------
// Constants
// ------------------------------------
export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST'
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE'
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS'
export const LOGOUT_USER = 'LOGOUT_USER'
export const FETCH_PROTECTED_DATA_REQUEST = 'FETCH_PROTECTED_DATA_REQUEST'
export const RECEIVE_PROTECTED_DATA = 'RECEIVE_PROTECTED_DATA'

// ------------------------------------
// Actions
// ------------------------------------

export const loginUserSuccess = (token) => {
  localStorage.setItem('token', token)
  return {
    type: LOGIN_USER_SUCCESS,
    payload: {
      token: token
    }
  }
}

export const loginUserFailure = (error) => {
  localStorage.removeItem('token')
  return {
    type: LOGIN_USER_FAILURE,
    payload: {
      status: error.response.status,
      statusText: error.response.statusText
    }
  }
}

export const loginUserRequest = () => {
  return {
    type: LOGIN_USER_REQUEST
  }
}

export const loginUser = (email, password, redirect='/') => {
  return function(dispatch, getState) {
    dispatch(loginUserRequest())
    let state = getState()

    return fetch('http://localhost:3000/api/auth/getToken', {
      method: 'post',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: email, password: password})
    })
      .then(checkHttpStatus)
      .then(parseJSON)
      .then((response) => {
        try {
          dispatch(loginUserSuccess(response.token))
          let toLocation = state.router.location.query.fromLoc
          if (toLocation) {
            dispatch(routeActions.push(`${toLocation}`))
          }
        } catch (e) {
          dispatch(loginUserFailure({
            response: {
              status: 403,
              statusText: 'Invalid token'
            }
          }))
        }
      })
      .catch((error) => {
        dispatch(loginUserFailure(error))
      })
  }
}

export const logout = () => {
  localStorage.removeItem('token')
  return {
    type: LOGOUT_USER
  }
}

export const logoutAndRedirect = () => {
  return (dispatch, state) => {
    dispatch(logout())
    dispatch(routeActions.push('/'))
    dispatch(sidebarActions.showSidebar())
  }
}

export const receiveProtectedData = (data) => {
  return {
    type: RECEIVE_PROTECTED_DATA,
    payload: {
      data: data
    }
  }
}

export const fetchProtectedDataRequest = () => {
  return {
    type: FETCH_PROTECTED_DATA_REQUEST
  }
}

export const fetchProtectedData = (token) => {
  return (dispatch, state) => {
    dispatch(fetchProtectedDataRequest())
    return fetch('http://localhost:3000/api/auth/getData', {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(checkHttpStatus)
      .then(parseJSON)
      .then((response) => {
        console.log(response)
        dispatch(receiveProtectedData(response.data))
      })
      .catch((error) => {
        if(error.response.status === 401) {
          dispatch(loginUserFailure(error));
          dispatch(routeActions.push('/login'))
        }
      })
  }
}

export const isLoggedIn = () => {
  return (dispatch, getState) => {
    let state = getState()
    let token = localStorage.getItem('token')
    let curLocation = state.router.location.pathname
    if (state.auth.isAuthenticated && token) {
      fetch('http://localhost:3000/api/auth/getData', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(checkHttpStatus)
        .then(parseJSON)
        .then((response) => {
          let toLocation = state.router.location.query.fromLoc
          if (toLocation) {
            dispatch(routeActions.push(`/${toLocation}`))
          }
        })
        .catch((error) => {
          dispatch(loginUserFailure({
            response: {
              status: 403,
              statusText: 'Authenticated Token has expired, please login again!'
            }
          }))
          dispatch(routeActions.push(`/?fromLoc=${curLocation}`))
          dispatch(sidebarActions.showSidebar())
        })
    } else {
      dispatch(loginUserFailure({
        response: {
          status: 403,
          statusText: 'Please login to access the protected content'
        }
      }))
      dispatch(routeActions.push(`/?fromLoc=${curLocation}`))
      dispatch(sidebarActions.showSidebar())
    }
  }
}

export const actions = {
  loginUserSuccess,
  loginUserFailure,
  loginUserRequest,
  logout,
  logoutAndRedirect,
  loginUser,
  receiveProtectedData,
  fetchProtectedDataRequest,
  fetchProtectedData,
  isLoggedIn
}


// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  token: '',
  userName: '',
  isAuthenticated: false,
  isAuthenticating: false,
  statusText: 'Chen Before Auth'
}

export default handleActions({
  [LOGIN_USER_REQUEST]: (state, action) => {
    return Object.assign({}, state, {
      'isAuthenticating': true,
      'statusText': 'Chen is authenticating'
    })
  },
  [LOGIN_USER_SUCCESS]: (state, { payload }) => {
    return Object.assign({}, state, {
      'isAuthenticating': false,
      'isAuthenticated': true,
      'token': payload.token,
      'userName': jwtDecode(payload.token).userName,
      'statusText': 'You have been successfully logged in.'
    })
  },
  [LOGIN_USER_FAILURE]: (state, { payload }) => {
    return Object.assign({}, state, {
      'isAuthenticating': false,
      'isAuthenticated': false,
      'token': null,
      'userName': null,
      'statusText': `Login Status: (${payload.status}) ${payload.statusText}`
    })
  },
  [LOGOUT_USER]: (state, action) => {
    return Object.assign({}, state, {
      'isAuthenticated': false,
      'token': null,
      'userName': null,
      'statusText': 'You have been successfully logged out.'
    })
  }
}, initialState)