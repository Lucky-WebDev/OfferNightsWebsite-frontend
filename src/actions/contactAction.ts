import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const API_BASE: string = 'http://localhost:5000/contact';

export const sendMessage = (data: any) => (dispatch) => {
    axios
      .put(`${API_BASE}/send-message`, data)
      .then(res => {
        dispatch({
          type: 'GET_MESSAGE', payload: data
        })
        enqueueSnackbar(res.data.message)
      })
      .catch(err => {
        console.log(err.response)
      })
  }