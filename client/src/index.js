import React from 'react';
import ReactDOM from 'react-dom';
import Favicon from 'react-favicon';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import App from './App';
import './index.css';
import userReducer from './store/reducers/userReducer';
import flightsReducer from './store/reducers/flightsReducer';

const rootReducer = combineReducers({
  user: userReducer,
  flights: flightsReducer,
});

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, compose(applyMiddleware(thunk)));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
    	<Favicon url="https://mariusfirstbucket.s3.eu-west-3.amazonaws.com/logo-1589122880629.png" />
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
