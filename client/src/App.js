import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { setHeaders, setCurrentUser } from './store/actions/userActions';
import Layout from './Layout/Layout';
import Tours from './pages/Tours/Tours';
import Home from './pages/Home/Home';
import TourDetails from './pages/TourDetails/TourDetails';
import SuccessBooking from './components/SuccessBooking/SuccessBooking';
import AccountSettings from './AccountSettings/AccountSettings';
import MyBookings from './AccountSettings/MyBookings/MyBookings';
import AgencyDetails from './pages/AgencyDetails/AgencyDetails';
import MyNotifications from './AccountSettings/MyNotifications/MyNotifications';
import DiscoverDreamTour from './pages/DiscoverDreamTour/DiscoverDreamTour';
import MyWishlist from './AccountSettings/MyWishlist/MyWishlist';
import MyCart from './AccountSettings/MyCart/MyCart';
import MyReviews from './AccountSettings/MyReviews/MyReviews';
import Search from './pages/Search/Search';
import MakeAnImpact from './pages/MakeAnImpact/MakeAnImpact';
import CreateAgency from './pages/CreateAgency/CreateAgency';
import MyAgency from './AccountSettings/MyAgency/MyAgency';
import Flights from './pages/Flights/Flights';
import RequestedFlights from './pages/Flights/RequestedFlights';
import SuccessFlightBooking from './components/SuccessFlightBooking/SuccessFlightBooking';
import MyFlights from './AccountSettings/MyFlights/MyFlights';
import FlightAgencyDetails from './pages/FlightAgencyDetails/FlightAgencyDetails';
import FlightDetails from './pages/Flights/FlightDetails'
import AllFlights from './pages/AllFlights/AllFlights'

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
          <Route path="/me" exact component={AccountSettings} />
          <Route path="/my-bookings" exact component={MyBookings} />
          <Route path="/agencies/:agencyId" exact component={AgencyDetails} />
          <Route path="/my-notifications" exact component={MyNotifications} />
          <Route
            path="/discover-dream-tour"
            exact
            component={DiscoverDreamTour}
          />
          <Route path="/my-wishlist" exact component={MyWishlist} />
          <Route path="/my-cart" exact component={MyCart} />
          <Route path="/my-reviews" exact component={MyReviews} />
          <Route path="/search/:searchInput" exact component={Search} />
          <Route path="/make-an-impact" exact component={MakeAnImpact} />
          <Route path="/create-agency" exact component={CreateAgency} />
          <Route path="/my-agency" exact component={MyAgency} />
          <Route path="/categories/flights" exact component={Flights} />
          <Route path="/requested/flights" exact component={RequestedFlights} />
          <Route path="/my-flights" exact component={MyFlights} />
          <Route
            path="/flights/agency/:agencyId"
            exact
            component={FlightAgencyDetails}
          />
          <Route path="/flights/:flightId" exact component={FlightDetails} />
          <Route path="/all-flights" exact component={AllFlights} />
        </Switch>
      </Layout>
      <Route 
        path="/success/tours/:tourId/users/:userId/price/:price"
        exact
        component={SuccessBooking}
      />
      <Route
        path="/success/flights/:flightId/users/:userId/price/:totalPrice/persons/:numPersons"
        exact
        component={SuccessFlightBooking}
      />
    </BrowserRouter>
  );
}

export default connect(null, { setCurrentUser })(App);
