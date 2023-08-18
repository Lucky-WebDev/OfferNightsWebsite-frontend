import axios from 'axios';
import setAuthToken from '../api/setAuthToken';
import { useSelector } from 'react-redux';
import { StateType } from '../reducer/dataType';
import { enqueueSnackbar } from 'notistack';

const url = process.env.REACT_APP_URL;
const API_BASE: string = `http://${url}/user`;
const API_VERIFY: string = `http://${url}/verify`;

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
      if(res.data.data.double == true) {
        enqueueSnackbar('Email is already verified.')
      }
      console.log('Successfully token generate!')
    })
    .catch(err => {
      console.log(err.response)
    })
}

export const resendVerificationCode = (data: string) => {
  axios
    .post(`${API_VERIFY}/token`, data)
    .then(res => {
      enqueueSnackbar('successfully resend token')
    })
    .catch(err => {
      console.log(err.response.data)
    })
}

export const checkToken = (data: any) => async dispatch => {
  try {
    const token: any = {
      token: data.token,
      email: data.email
    }
    const res = await axios.post(`${API_VERIFY}/check-token`, token);

    if(res.data.data.flag == true) {
      console.log(data)
      enqueueSnackbar('Email Verify Success')
      let signUpInfo = {
        type: data.type,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        cell: data.cell,
        password: data.password,
        email: data.email,
        termAgree: data.termAgree,
      }
      let res = await axios.post(`${API_BASE}/sign-up`, signUpInfo)
      if(res.data.data.double == true) {
        enqueueSnackbar('Double Email Error')
        return;
      }
      window.location.href = '/user/sign-in'
    } else {
      enqueueSnackbar('Email Verify Failure')
      return
    }
  } catch (err) {
    dispatch({
      type: 'GET_ERROR',
      payload: 'Verify failure'
    });
  }
};

export const generatePhoneToken = (data: any) => dispatch => {
  axios
    .post(`${API_VERIFY}/SendOtp`, data)
    .then(res => {
      console.log(res)
      return true;
    })
    .catch(err => {
      dispatch({
        type: 'GET_ERROR',
        payload: 'Phone number is not correct.'
      })
    })
}

export const verifyPhone = (id: string, data: any) => async dispatch => {
  try {
    const res = await axios.post(`${API_VERIFY}/VerifyOtp`, data);

    if(res.data.msg == 'approved') {
      enqueueSnackbar('Cell Phone Verify Success!')
      
      let res = await axios.post(`${API_BASE}/add-phone/${id}`, data)
      dispatch({
        type: 'UPDATE_PHONE', payload: res.data.profile
      })
    } else {
      enqueueSnackbar('Cell Phone Verify Failure')
      return
    }
  } catch (err) {
    dispatch({
      type: 'GET_ERROR',
      payload: 'Verify failure'
    });
  }
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
      enqueueSnackbar(res.data.message)
    })
    .catch(err => {
      console.log(err.response)
    })
}

export const signIn = (data: any) => (dispatch) => {
  axios
    .post(`${API_BASE}/sign-in`, data)
    .then(res => {
      console.log(res)
      enqueueSnackbar("Successfully sign in")
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
      enqueueSnackbar(res.data)
    })
    .catch(err => {
      enqueueSnackbar(err.response.data.error)
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
