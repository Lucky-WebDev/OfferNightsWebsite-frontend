import axios from 'axios';
import setAuthToken from '../api/setAuthToken';
import { useSelector } from 'react-redux';
import { StateType } from '../reducer/dataType';

const API_BASE: string = 'http://localhost:5000/user';
const API_VERIFY: string = 'http://localhost:5000/verify';

export const signUp = (data: any) => (dispatch) => {
  dispatch({
    type: 'SET_SIGNUP_INFO',
    payload: data
  })
  
  let verifyEmail = {
    email: data.email
  }

  axios
    .post(`${API_VERIFY}/email-verify`, verifyEmail)
    .then(res => {
      console.log('Successfully token generate!')
    })
    .catch(err => {
      console.log(err.response.data)
    })
}

export const resendVerificationCode = (data: string) => {
  axios
    .post(`${API_VERIFY}/token`, data)
    .then(res => {
      alert("Successfully verify...")
    })
    .catch(err => {
      console.log(err.response.data)
    })
}

export const checkToken = (token: any) => dispatch => {
  axios
    .post(`${API_VERIFY}/check-token`, token)
    .then(res => {
      dispatch({
        type: 'GET_ERROR',
        payload: null
      })
      userSignUp();
      window.location.href = '/';
    })
    .catch(err => {
      dispatch({
        type: 'GET_ERROR',
        payload: 'Verify failure'
      })
    })
}

export const generatePhoneToken = (data: any) => dispatch => {
  axios
    .post(`${API_VERIFY}/SendOtp`, data)
    .then(res => {
      return true;
    })
    .catch(err => {
      dispatch({
        type: 'GET_ERROR',
        payload: 'Phone number is not correct.'
      })
    })
}

export const verifyPhone = (data: any) => dispatch => {
  axios
    .post(`${API_VERIFY}/VerifyOtp`, data)
    .then(res => {
      dispatch({
        type: 'GET_ERROR',
        payload: null
      })

      return true;
    })
    .catch(err => {
      dispatch({
        type: 'GET_ERROR',
        payload: 'Verify failure'
      })
    })
}

export const editProfile = (id: string, token: string, data: any) => (dispatch) => {
  axios
    .put(`${API_BASE}/edit-profile/${id}`, data)
    .then(res => {
      const payload = {
        token: token,
        user: res.data.profile
      }
      dispatch({
        type: 'LOGIN_SUCCESS', payload: payload
      })
      alert(res.data.message)
    })
    .catch(err => {
      console.log(err.response.data)
    })
}

export const signIn = (data: any) => (dispatch) => {
  axios
    .post(`${API_BASE}/sign-in`, data)
    .then(res => {
      console.log(res)
      alert("Successfully sign in...")
      setAuthToken(res.data.data.token)
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data.data });
      window.location.href = '/';
      // navigate('/user/profile')
    })
    .catch(err => {
      console.log(err.response);
      // Dispatch an action if needed
      // dispatch({ type: 'GET_ERROR', payload: err.response.data });
    });
};

export const signOut = () => dispatch => {
  localStorage.removeItem('token')
  dispatch({
    type: 'LOGOUT',
    payload: null
  })
}

export const changePassword = (data: any) => {
  const id: string = data.id;
  console.log(id)
  axios
    .put(`${API_BASE}/change-password/${id}`, data)
    .then(res => {
      alert(res.data)
    })
    .catch(err => {
      alert(err.response.data.error)
    })
}

export const getTypeUsers = (type: string) => dispatch => {
  axios
    .get(`${API_BASE}/get-type/${type}`)
    .then(res => {
      dispatch({
        type: 'GET_USER_TYPE',
        payload: res.data
      })
    })
    .catch(err => {
      console.log(err.response.data)
    })
}

const userSignUp = () => {
  const newUser: any = useSelector((state: StateType) => state.auth.signUpInfo);

  axios
    .post(`${API_BASE}/sign-up`, newUser)
    .then(res => {
      alert("Successfully sign up...")
      window.location.href = '/user/sign-in';
    })
    .catch(err => {
      console.log(err.response.data)
    })
}
