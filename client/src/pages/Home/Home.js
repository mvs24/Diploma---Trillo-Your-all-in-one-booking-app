import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from '../../shared/components/Button/Button';
// import TourImg from '../../assets/tour-1-1.jpg';
import './Home.css';
import Tours from '../../components/Tours/Tours';

const Home = React.memo((props) => {
  const history = useHistory();

  const discoverDreamTour = () => {
    history.push('/discover-dream-tour?page=1');
  };

  return (
    <div className="home">
      <div className="bcg">
        {/* <img src={TourImg} alt="img" className="img__bcg" /> */}
        <div className="bcg__container">
          <h1> Explore your ideas</h1>
          <Button clicked={discoverDreamTour} type="success">
            Find your dream tour
          </Button>
        </div>
      </div>
      <Tours />
    </div>
  );
});

export default Home;
