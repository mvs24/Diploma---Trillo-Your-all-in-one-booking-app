import React from 'react';
import { useHistory } from 'react-router-dom';
// import Nature from '../../assets/tour-3-6.jpg';
import './AboutUs.css';
// import logo from '../../assets/logo.png';

export default (props) => {
  const history = useHistory();

  return (
    <div className="about__container">
      <div className="aboutImg__container">
        {/* // <img src={Nature} /> */}
        <h4 className="heading--about">
          <span className="heading-span--about ">
            Improving Lives Through Nature
          </span>
        </h4>
      </div>
      <div className="center__about">
        <div className="aboutLogo">
          {/* // <img
          //   onClick={() => history.push('/')}
          //   style={{ cursor: 'pointer' }}
          //   className="logo"
          //   src={logo}
          //   alt="Logo"
          // /> */}
          <h2 onClick={() => history.push('/')} className="heading__trillo">
            Trillo
          </h2>
        </div>
      </div>
      <h1 className="our__mission">
        Our mission is to connect the world through Nature and make people
        genuinely happy.
      </h1>
      <p className="about__paragraph">
        Exciting tours for adventurous people. We believe that by connecting the
        people all over the world, we will make them happy. You're going to fall
        in love with nature!
      </p>
    </div>
  );
};
