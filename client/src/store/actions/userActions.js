import axios from 'axios';
import {
  SIGNUP_LOADING,
  SIGNUP_SUCCESS,
  SIGNUP_ERROR,
  DELETE_ERROR,
  LOGIN_ERROR,
  LOGIN_SUCCESS,
  LOGIN_LOADING
} from '../types/userTypes';

const setHeaders = token => {
  if (token) {
    // apply to every request
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  } else {
    // delete auth header
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const signupUser = userData => async dispatch => {
  try {
    dispatch({ type: SIGNUP_LOADING });
    const response = await axios.post('/api/v1/users/signup', userData);
    const resData = response.data;

    dispatch({
      type: SIGNUP_SUCCESS,
      payload: resData.data
    });

    localStorage.setItem('jwt', resData.token);
    setHeaders(resData.token);

    return true;
  } catch (err) {
    dispatch({
      type: SIGNUP_ERROR,
      errormsg: err.response.data.message
    });
    return false;
  }
};

export const loginUser = userData => async dispatch => {
  try {
    dispatch({ type: LOGIN_LOADING });
    const response = await axios.post('/api/v1/users/login', userData);
    const resData = response.data;

    dispatch({
      type: LOGIN_SUCCESS,
      payload: resData.data
    });

    localStorage.setItem('jwt', resData.token);
    setHeaders(resData.token);

    return true;
  } catch (err) {
    dispatch({
      type: LOGIN_ERROR,
      errormsg: err.response.data.message
    });
    return false;
  }
};

export const deleteError = () => dispatch => {
  dispatch({ type: DELETE_ERROR });
};
