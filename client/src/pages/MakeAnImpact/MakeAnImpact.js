import React, { useState } from 'react';
import { connect } from 'react-redux';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import { IconContext } from 'react-icons';
import { MdCreateNewFolder } from 'react-icons/md';
import { GiDetour } from 'react-icons/gi';
import { FaDollarSign } from 'react-icons/fa';
import Button from '../../shared/components/Button/Button';
import './MakeAnImpact.css';

const MakeAnImpact = (props) => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState();

  if (!props.isAuthenticated) return <LoadingSpinner asOverlay />;

  return (
    <div className="makeAnImpact__container">
      <div className="create__container">
        <div className="icon__heading">
          <IconContext.Provider value={{ className: 'icon create__icon' }}>
            <MdCreateNewFolder />
            <h1>Jump into your bussiness creation.</h1>
          </IconContext.Provider>
        </div>
        <Button
          clicked={() => props.history.push('/create-agency')}
          type="pink"
        >
          Create your agency!
        </Button>
      </div>

      <div className="boxes">
        <div className="box--1">
          <IconContext.Provider value={{ className: 'icon box--1__icon' }}>
            <GiDetour />
          </IconContext.Provider>
          <div>
            <h1>Populate your agency</h1>
            <p>
              Populate your agency with tours, adding images geographical
              coordinates, number of participants, number of days. We will do
              our best to show your tours to all the clients...
            </p>
          </div>
        </div>
        <div className="box--1">
          <IconContext.Provider value={{ className: 'icon box--2__icon' }}>
            <FaDollarSign />
          </IconContext.Provider>
          <div>
            <h1>Feel free to make price discounts...</h1>
            <p>
              We promise notifications to different users for the latest
              changes. Believe in us...
            </p>
          </div>
        </div>
      </div>

      <div className="ready__container">
        <h1>Are you ready to begin?</h1>
        <Button
          clicked={() => props.history.push('/create-agency')}
          type="pink"
        >
          Create your agency!
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.user.isAuthenticated,
  };
};

export default connect(mapStateToProps)(MakeAnImpact);
