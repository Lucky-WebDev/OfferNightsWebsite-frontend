import axios from 'axios';
import {useDispatch} from 'react-redux'

// store our JWT in LS and set axios headers if we do have a token

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = token;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

export default setAuthToken;
