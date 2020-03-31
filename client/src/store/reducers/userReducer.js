import {
  SIGNUP_LOADING,
  SIGNUP_ERROR,
  SIGNUP_SUCCESS,
  DELETE_ERROR,
  LOGIN_LOADING,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  SET_CURRENT_USER,
  SET_CURRENT_USER_ERROR,
  SET_CURRENT_USER_LOADING,
  SET_WISHLIST,
  SET_WISHLIST_ERROR,
  SET_WISHLIST_LOADING
} from '../types/userTypes';

const initialState = {
  isAuthenticated: false,
  userData: null,
  error: null,
  loading: false,
  wishlist: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SIGNUP_ERROR:
      return { ...state, loading: false, error: action.errormsg };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        userData: action.payload,
        isAuthenticated: true
      };
    case SIGNUP_LOADING:
      return {
        ...state,
        loading: true,
        error: null
      };
    case DELETE_ERROR:
      return {
        ...state,
        error: null
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        isAuthenticated: true,
        userData: action.payload
      };
    case LOGIN_ERROR:
      return { ...state, loading: false, error: action.errormsg };
    case LOGIN_LOADING:
      return {
        ...state,
        loading: true,
        error: null
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        userData: action.payload,
        error: null,
        loading: false,
        isAuthenticated: true
      };
    case SET_CURRENT_USER_ERROR:
      return { ...state, loading: false, error: action.errormsg };
    case SET_CURRENT_USER_LOADING:
      return {
        ...state,
        loading: true,
        error: null
      };
    case SET_WISHLIST:
      return {
        ...state,
        wishlist: action.payload,
        error: null,
        loading: false
      };
    case SET_WISHLIST_LOADING:
      return {
        ...state,
        loading: true,
        error: null
      };
    case SET_WISHLIST_ERROR:
      return { ...state, loading: false, error: action.errormsg };
    default:
      return state;
  }
};
