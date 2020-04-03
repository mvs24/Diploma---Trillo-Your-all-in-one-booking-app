import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { setHeaders, setCurrentUser } from './store/actions/userActions';
import Layout from './Layout/Layout';
import Tours from './pages/Tours/Tours';
import Home from './pages/Home/Home';
import TourDetails from './pages/TourDetails/TourDetails';
import SuccessBooking from './components/SuccessBooking/SuccessBooking';

function App(props) {
  const setUserData = async () => {
    setHeaders(localStorage.getItem('jwt'));
    await props.setCurrentUser();
  };

  if (localStorage.getItem('jwt')) {
    setUserData();
  }

  return (
    <BrowserRouter>
      <Layout>
        <Switch>
          <Route path="/tours/:tourId" exact component={TourDetails} />
          <Route path="/categories/tours" exact component={Tours} />
          <Route path="/" exact component={Home} />
        </Switch>
      </Layout>
      <Route
        path="/success/tours/:tourId/users/:userId/price/:price"
        exact
        component={SuccessBooking}
      />
    </BrowserRouter>
  );
}

export default connect(null, { setCurrentUser })(App);
