import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import { IconContext } from 'react-icons';
import { MdCreateNewFolder } from 'react-icons/md';
import { GiDetour } from 'react-icons/gi';
import { FaDollarSign } from 'react-icons/fa';
import Button from '../../shared/components/Button/Button';
import './MakeAnImpact.css';
import axios from 'axios';

const MakeAnImpact = (props) => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [myAgency, setMyAgency] = useState();

  useEffect(() => {
    const getMyAgency = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/v1/users/my/agency`);
        setMyAgency(res.data.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.response.data.message);
      }
    };

    getMyAgency();
  }, []);

  if (loading) return <LoadingSpinner asOverlay />;
  if (myAgency) return <Redirect to="/my-agency" />;

  if (!props.isAuthenticated) return <LoadingSpinner asOverlay />;

  return (
    <div className="makeAnImpact__container">
      {error && (
        <ErrorModal show onClear={() => setError(false)}>
          {error ? error : 'Something went wrong'}
        </ErrorModal>
      )}
      <div className="create__container">
        <div className="icon__heading">
          <IconContext.Provider value={{ className: 'icon create__icon' }}>
            <MdCreateNewFolder />
            <h1 className="jumpIn">Jump into your bussiness creation.</h1>
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
            <h1 className="jumpIn--1">Populate your agency</h1>
            <p>
              Populate your agency with tours / flights, adding images
              geographical coordinates, number of participants, number of days.
              We will do our best to show your tours to all the clients...
            </p>
          </div>
        </div>
        <div className="box--1">
          <IconContext.Provider value={{ className: 'icon box--2__icon' }}>
            <FaDollarSign />
          </IconContext.Provider>
          <div>
            <h1 className="jumpIn--1">Feel free to make price discounts...</h1>
            <p>
              We promise notifications to different users for the latest
              changes. Believe in us...
            </p>
          </div>
        </div>
      </div>

      <div className="ready__container">
        <h1 className="jumpIn">Are you ready to begin?</h1>
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
