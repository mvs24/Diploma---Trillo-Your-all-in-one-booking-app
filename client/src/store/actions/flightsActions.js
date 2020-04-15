import axios from 'axios';
import {
  LOADING_FLIGHTS,
  ERROR_FLIGHTS,
  GET_FLIGHTS,
  DELETE_ERROR_FLIGHTS,
} from '../types/flightsTypes';

export const getRequestedFlights = (data) => async (dispatch) => {
  try {
    dispatch({ type: LOADING_FLIGHTS });
    const res = await axios.get(
      `/api/v1/flights/searchedFlights?variety=${data.variety}&from=${data.from}&to=${data.to}&depart=${data.depart}&package=${data.package}&returnDate=${data.returnDate}`
    );
    dispatch({ type: GET_FLIGHTS, payload: res.data.data });
  } catch (err) {
    dispatch({ type: ERROR_FLIGHTS, errormsg: err.response.data.message });
  }
};

export const deleteError = () => (dispatch) => {
  dispatch({ type: DELETE_ERROR_FLIGHTS });
};
