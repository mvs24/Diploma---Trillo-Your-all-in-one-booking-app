import React from 'react';
import { useHistory } from 'react-router-dom';
import './Footer.css';
// import Logo from '../../assets/logo.png';

export default (props) => {
  const history = useHistory();
  return (
    <footer className="footer">
      <div className="copyright">
        {/* <img
          style={{ cursor: 'pointer' }}
          onClick={() => history.push('/')}
          className="logo"
          src={Logo}
          alt="Logo"
        /> */}
        <h2
          style={{ cursor: 'pointer' }}
          onClick={() => history.push('/')}
          className="heading__trillo"
        >
          Trillo
        </h2>
        <h3>Copyright &copy; 2020 by Marius Vasili.</h3>
      </div>
      <div className="about__us">
        <p onClick={() => history.push('/about-us')}>About us</p>
        <p onClick={() => history.push('/contact-us')}>Contact us</p>
      </div>
    </footer>
  );
};
