import axios from 'axios';
import setAuthToken from '../api/setAuthToken';
import { enqueueSnackbar } from 'notistack';

const url = process.env.REACT_APP_URL;
const API_BASE: string = `http://${url}/map`;

export const addLocation = (id: string, data: any) => (dispatch) => {
  axios
    .post(`${API_BASE}/add-locations/${id}`, data)
    .then(res => {
      enqueueSnackbar('You added new farming area successfully.')
      dispatch({
        type: 'GET_FARMING_AREA',
        payload: res.data.data
      })
    })
    .catch(err => {
      console.log(err.response.data)
    })
}

export const getActiveArea = (id: string) => (dispatch) => {
  axios
    .get(`${API_BASE}/get-active-area/${id}`)
    .then(res => {
      dispatch({
        type: 'GET_FARMING_AREA',
        payload: res.data.data
      })
    })
    .catch(err => {
      console.log(err.response.data)
    })
}

export const getAllAgents = () => dispatch => {
  axios
    .get(`${API_BASE}/get-all-agents/`)
    .then(res => {
      dispatch({
        type: 'GET_ALL_AGENT',
        payload: res.data.data
      })
    })
    .catch(err => {
      console.log(err.response.data)
    })
}

export const deleteActiveArea = (data) => dispatch => {
  axios
    .post(`${API_BASE}/delete-active-area`, data)
    .then(res => {
      dispatch({
        type: 'GET_FARMING_AREA',
        payload: res.data.data
      })
    })
    .catch(err => {
      console.log(err.response.data)
    })
}