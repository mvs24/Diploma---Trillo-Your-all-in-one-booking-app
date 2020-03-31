import axios from 'axios';
import {
  SIGNUP_LOADING,
  SIGNUP_SUCCESS,
  SIGNUP_ERROR,
  DELETE_ERROR,
  LOGIN_ERROR,
  LOGIN_SUCCESS,
  LOGIN_LOADING,
  SET_CURRENT_USER_LOADING,
  SET_CURRENT_USER,
  SET_CURRENT_USER_ERROR
} from '../types/userTypes';

export const setHeaders = token => {
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

export const setCurrentUser = () => async dispatch => {
  try {
    dispatch({ type: SET_CURRENT_USER_LOADING });
    const response = await axios.get('/api/v1/users/loggedInUser');

    dispatch({ type: SET_CURRENT_USER, payload: response.data.data });
  } catch (err) {
    dispatch({ type: SET_CURRENT_USER_ERROR, errormsg: err.message });
  }
};

export const deleteError = () => dispatch => {
  dispatch({ type: DELETE_ERROR });
};

export const getMyBookings = () => async dispatch => {
  // axios.post('/')
};
