import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        localStorage.getItem('jwt') ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

export default PrivateRoute;
