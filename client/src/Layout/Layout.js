import React from 'react';
import Header from './Header';
import Footer from '../components/Footer/Footer';

const Layout = (props) => {
  return (
    <>
      <div className="layout">
        <Header />
        {props.children}
        <div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Layout;
