import React from 'react';
import Button from '../../shared/components/Button/Button';
import TourImg from '../../assets/tour-3-2.jpg';
import './Home.css';
import Tours from '../../components/Tours/Tours';

const Home = React.memo(props => {
  return (
    <div className="home">
      <div className="bcg">
        <img src={TourImg} alt="img" className="img__bcg" />
        <div className="bcg__container">
          <h1> Explore your ideas</h1>
          <Button type="success">Find your dream tour</Button>
        </div>
      </div>
      <Tours />
    </div>
  );
});

export default Home;
