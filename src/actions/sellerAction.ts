import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { Types } from './types';

const url = process.env.REACT_APP_URL;
const API_BASE: string = `http://${url}/seller`;

export const addSellerLocation = (data: any) => (dispatch) => {
  axios
    .post(`${API_BASE}/add-seller-location`, data)
    .then(res => {
        enqueueSnackbar("You added new seller location successfully.")
        dispatch({
            type: Types.GET_MY_SELLER_INFO,
            payload: res.data.data
        })
    })
    .catch(err => {
      console.log(err.response.data)
    })
}

export const deleteSellerInfo = (data: any) => (dispatch) => {
  axios
    .post(`${API_BASE}/delete-seller-location`, data)
    .then(res => {
        dispatch({
            type: Types.GET_MY_SELLER_INFO,
            payload: res.data.data
        })
    })
    .catch(err => {
      console.log(err.response.data)
    })
}

export const getMySellerLocation = (id: string) => (dispatch) => {
    axios
        .get(`${API_BASE}/get-my-seller-location/${id}`)
        .then(res => {
            dispatch({
                type: Types.GET_MY_SELLER_INFO,
                payload: res.data.data
            })
        })
        .catch(err => {
            console.log(err.response.data)
        })
}

export const getAllSeller = () => (dispatch) => {
    axios
        .get(`${API_BASE}/get-all-sellers`)
        .then(res => {
            dispatch({
                type: Types.GET_ALL_SELLER_INFO,
                payload: res.data.data
            })
        })
        .catch(err => console.log(err.response.data))
}

// export const getActiveArea = (id: string) => (dispatch) => {
//   axios
//     .get(`${API_BASE}/get-active-area/${id}`)
//     .then(res => {
//       dispatch({
//         type: 'GET_FARMING_AREA',
//         payload: res.data.data
//       })
//     })
//     .catch(err => {
//       console.log(err.response.data)
//     })
// }

// export const getAllAgents = () => dispatch => {
//   axios
//     .get(`${API_BASE}/get-all-agents/`)
//     .then(res => {
//       dispatch({
//         type: 'GET_ALL_AGENT',
//         payload: res.data.data
//       })
//     })
//     .catch(err => {
//       console.log(err.response.data)
//     })
// }

