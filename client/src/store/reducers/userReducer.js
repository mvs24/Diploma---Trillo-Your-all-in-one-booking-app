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
  SET_WISHLIST_LOADING,
  ADD_TO_WISHLIST,
  ADD_TO_WISHLIST_LOADING,
  ADD_TO_WISHLIST_ERROR,
  REMOVE_FROM_WISHLIST,
  REMOVE_FROM_WISHLIST_LOADING,
  REMOVE_FROM_WISHLIST_ERROR,
  ADD_TO_CART,
  ADD_TO_CART_LOADING,
  ADD_TO_CART_ERROR,
  LOADING,
  GET_TOURS_IN_CART_ERROR,
  GET_TOURS_IN_CART,
  ERROR,
  UPDATE_USER_DATA,
  GET_MY_REVIEWS,
  GET_MY_NOTIFICATIONS,
  GET_UNREAD_NOTIFICATIONS,
  MARK_NOTIFICATIONS_AS_READ,
  MARK_NOTIFICATION_AS_READ,
  LOGOUT_USER,
  REMOVE_FROM_CART,
} from '../types/userTypes';

const initialState = {
  isAuthenticated: false,
  userData: null,
  error: null,
  loading: false,
  wishlist: null,
  cartTour: [],
  reviews: null,
  notifications: null,
  unReadNotifications: null,
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
        isAuthenticated: true,
      };
    case SIGNUP_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_ERROR:
      return {
        ...state,
        error: null,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        isAuthenticated: true,
        userData: action.payload,
      };
    case LOGIN_ERROR:
      return { ...state, loading: false, error: action.errormsg };
    case LOGIN_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        userData: action.payload,
        error: null,
        loading: false,
        isAuthenticated: true,
      };
    case SET_CURRENT_USER_ERROR:
      return { ...state, loading: false, error: action.errormsg };
    case SET_CURRENT_USER_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SET_WISHLIST:
      return {
        ...state,
        wishlist: action.payload,
        error: null,
        loading: false,
      };
    case SET_WISHLIST_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SET_WISHLIST_ERROR:
      return { ...state, loading: false, error: action.errormsg };
    case ADD_TO_WISHLIST:
      return {
        ...state,
        wishlist: {
          results: state.wishlist.results + 1,
          data: [...state.wishlist.data, { ...action.payload }],
        },
        error: null,
        loading: false,
      };
    case ADD_TO_WISHLIST_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADD_TO_WISHLIST_ERROR:
      return {
        ...state,
        loading: false,
        error: action.errormsg,
      };
    case REMOVE_FROM_WISHLIST_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case REMOVE_FROM_WISHLIST_ERROR:
      return {
        ...state,
        loading: false,
        error: action.errormsg,
      };
    case REMOVE_FROM_WISHLIST:
      return {
        ...state,
        wishlist: {
          results: state.wishlist.results - 1,
          data: state.wishlist.data.filter(
            (wishlist) => wishlist.tour !== action.tourId
          ),
        },
        loading: false,
        error: null,
      };
    case ADD_TO_CART_ERROR:
      return {
        ...state,
        loading: false,
        error: action.errormsg,
      };
    case ADD_TO_CART_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADD_TO_CART:
      return {
        ...state,
        cartTour: [...state.cartTour, action.payload],
        error: null,
        loading: false,
      };
    case LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_TOURS_IN_CART_ERROR:
      return {
        ...state,
        loading: false,
        error: action.errormsg,
      };
    case GET_TOURS_IN_CART:
      return {
        ...state,
        cartTour: action.payload,
        error: null,
        loading: false,
      };
    case ERROR:
      return {
        ...state,
        loading: false,
        error: action.errormsg,
      };
    case UPDATE_USER_DATA:
      return {
        ...state,
        userData: action.payload,
        loading: false,
        error: null,
      };
    case GET_MY_REVIEWS:
      return {
        ...state,
        loading: false,
        error: null,
        reviews: action.payload,
      };
    case GET_MY_NOTIFICATIONS:
      return {
        ...state,
        loading: false,
        error: null,
        notifications: action.payload,
      };
    case GET_UNREAD_NOTIFICATIONS:
      return {
        ...state,
        loading: false,
        error: null,
        unReadNotifications: action.payload,
      };
    case MARK_NOTIFICATIONS_AS_READ:
      return {
        ...state,
        loading: false,
        error: null,
        unReadNotifications: [],
        notifications: action.payload,
      };
    case MARK_NOTIFICATION_AS_READ:
      return {
        ...state,
        loading: false,
        error: null,
        notifications: action.payload,
      };
    case LOGOUT_USER: {
      return initialState;
    }
    case REMOVE_FROM_CART:
      const updated = state.cartTour.filter((el) => el.tour !== action.payload);
      return {
        ...state,
        loading: false,
        error: null,
        cartTour: updated,
      };
    default:
      return state;
  }
};
