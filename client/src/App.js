import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { setHeaders, setCurrentUser } from './store/actions/userActions';
import Layout from './Layout/Layout';
import Tours from './pages/Tours/Tours';
import Home from './pages/Home/Home';

function App(props) {
  if (localStorage.getItem('jwt')) {
    setHeaders(localStorage.getItem('jwt'));
    props.setCurrentUser();
  }

  return (
    <BrowserRouter>
      <Layout>
        <Switch>
          <Route path="/categories/tours" exact component={Tours} />
          <Route path="/" exact component={Home} />
        </Switch>
      </Layout>
    </BrowserRouter>
  );
}

export default connect(null, { setCurrentUser })(App);
