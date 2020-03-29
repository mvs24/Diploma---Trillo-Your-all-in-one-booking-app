import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Layout from './Layout/Layout';
import Tours from './pages/Tours/Tours';
import Home from './pages/Home/Home';

function App() {
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

export default App;
