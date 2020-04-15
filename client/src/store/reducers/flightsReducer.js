import {
  ERROR_FLIGHTS,
  LOADING_FLIGHTS,
  GET_FLIGHTS,
  DELETE_ERROR_FLIGHTS,
} from '../types/flightsTypes';

const initialState = {
  requestedFlights: null,
  error: null,
  loadingFlights: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ERROR_FLIGHTS:
      return {
        ...state,
        loadingFlights: false,
        error: action.errormsg,
      };
    case LOADING_FLIGHTS:
      return {
        ...state,
        loadingFlights: true,
        error: null,
      };
    case GET_FLIGHTS:
      return {
        ...state,
        requestedFlights: action.payload,
        loadingFlights: false,
        error: null,
      };
    case DELETE_ERROR_FLIGHTS:
      return {
        ...state,
        error: null,
        loadingFlights: false,
      };
    default:
      return state;
  }
};
