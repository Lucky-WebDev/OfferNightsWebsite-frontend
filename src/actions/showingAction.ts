import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const url = process.env.REACT_APP_URL;
const API_BASE: string = `http://${url}/showing`;

export const addActiveShowing = (data: any) => (dispatch) => {
  axios
    .post(`${API_BASE}/add-active-showing`, data)
    .then((res) => {
      enqueueSnackbar('New active agent showing is added successfully.');
      dispatch({
        type: 'GET_ACTIVE_SHOWING',
        payload: res.data.data
      });
    })
    .catch((err) => {
      console.log(err.response.data);
    });
};

export const getMyActiveShowing = (id: string) => (dispatch) => {
  axios
    .get(`${API_BASE}/get-my-active-showing/${id}`)
    .then((res) => {
      dispatch({
        type: 'GET_ACTIVE_SHOWING',
        payload: res.data.data
      });
    })
    .catch((err) => {
      console.log(err.response.data);
    });
};

export const getAllActiveShowing = () => (dispatch) => {
  axios
    .get(`${API_BASE}/get-all-active-showing`)
    .then((res) => {
      dispatch({
        type: 'GET_ALL_ACTIVE_SHOWING',
        payload: res.data.data
      });
    })
    .catch((err) => console.log(err.response.data));
};

export const getActiveArea = (id: string) => (dispatch) => {
  axios
    .get(`${API_BASE}/get-active-area/${id}`)
    .then((res) => {
      dispatch({
        type: 'GET_FARMING_AREA',
        payload: res.data.data
      });
    })
    .catch((err) => {
      console.log(err.response.data);
    });
};

export const getAllAgents = () => (dispatch) => {
  axios
    .get(`${API_BASE}/get-all-agents/`)
    .then((res) => {
      dispatch({
        type: 'GET_ALL_AGENT',
        payload: res.data.data
      });
    })
    .catch((err) => {
      console.log(err.response.data);
    });
};

export const deleteActiveShowing = (data: any) => (dispatch) => {
  axios
    .post(`${API_BASE}/delete-active-showing`, data)
    .then((res) => {
      dispatch({
        type: 'GET_ACTIVE_SHOWING',
        payload: res.data.data
      });
    })
    .catch((err) => {
      console.log(err.response.data);
    });
};

export const doubleCheck = async (listing: any) => {
  try {
    const res = await axios.post(`${API_BASE}/listing-double-check`, listing);
    console.log(res)

    if (res.data.data.flag) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};
