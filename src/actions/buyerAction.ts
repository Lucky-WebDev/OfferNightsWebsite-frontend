import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { Types } from '../actions/types';

const url = process.env.REACT_APP_URL;
const API_BASE: string = `http://${url}/buyer`;

export const addBuyerLocation = (data: any) => (dispatch) => {
  axios
    .post(`${API_BASE}/add-buyer-location`, data)
    .then(res => {
        enqueueSnackbar("You added new buyer location successfully.")
        dispatch({
            type: Types.GET_MY_BUYER_INFO,
            payload: res.data.data
        })
    })
    .catch(err => {
      console.log(err.response.data)
    })
}

export const getAllBuyers = () => dispatch => {
  axios
    .get(`${API_BASE}/get-all-buyers`)
    .then(res => {
      dispatch({
        type: Types.GET_ALL_BUYER_INFO,
        payload: res.data.data
      })
    })
    .catch(err => {
      console.log(err.response.data)
    })
}

export const deleteBuyerInfo = (data: any) => (dispatch) => {
  axios
    .post(`${API_BASE}/delete-buyer-info`, data)
    .then(res => {
        dispatch({
            type: Types.GET_MY_BUYER_INFO,
            payload: res.data.data
        })
    })
    .catch(err => {
      console.log(err.response.data)
    })
}

export const getMyBuyerLocation = (id: string) => (dispatch) => {
    axios
        .get(`${API_BASE}/get-my-buyer-location/${id}`)
        .then(res => {
            dispatch({
                type: Types.GET_MY_BUYER_INFO,
                payload: res.data.data
            })
        })
        .catch(err => {
            console.log(err.response.data)
        })
}

// export const getAllActiveShowing = () => (dispatch) => {
//     axios
//         .get(`${API_BASE}/get-all-active-showing`)
//         .then(res => {
//             dispatch({
//                 type: 'GET_ALL_ACTIVE_SHOWING',
//                 payload: res.data.data
//             })
//         })
//         .catch(err => console.log(err.response.data))
// }

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



