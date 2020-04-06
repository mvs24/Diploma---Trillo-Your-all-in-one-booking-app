import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import './AgencyInfo.css';
import { IconContext } from 'react-icons';
import { IoIosStarOutline } from 'react-icons/io';
import { MdPeopleOutline } from 'react-icons/md';
import { FaSortNumericUp } from 'react-icons/fa';
import Button from '../../shared/components/Button/Button';

const AgencyInfo = (props) => {
  const [agency, setAgency] = useState();
  const [error, setError] = useState();
  const history = useHistory();

  useEffect(() => {
    const getAgency = async () => {
      try {
        const res = await axios.get('/api/v1/agencies/' + props.tour.agency);
        setAgency(res.data.data);
      } catch (err) {
        setError(err.response.data.message);
      }
    };

    getAgency();
  }, []);

  if (!agency) return null;

  const visitAgency = () => {
    history.push('/agencies/' + agency._id + '?page=1');
  };

  return (
    <section className="tour__info agency__info">
      {error && (
        <ErrorModal show onClear={() => setError(false)}>
          {error}
        </ErrorModal>
      )}
      <div className="quick__facts">
        <h1 style={{ fontSize: '2rem' }}>
          PART OF {agency.name.toUpperCase()} AGENCY
        </h1>
        <ul>
          <li>
            <img
              className="agency__image"
              src={`http://localhost:5000/public/img/agencies/${agency.image}`}
            />
          </li>
          <li>
            <IconContext.Provider
              value={{ className: 'icon__green tour__info--icon' }}
            >
              <FaSortNumericUp />
            </IconContext.Provider>
            <p className="second">Number of Tours</p>
            <p className="data">{agency.numOptions}</p>
          </li>

          <li>
            <IconContext.Provider
              value={{ className: 'icon__green tour__info--icon full star' }}
            >
              <IoIosStarOutline />
            </IconContext.Provider>
            <p className="second">RATING</p>
            <p className="data">{agency.ratingsAverage.toFixed(2)}</p>
          </li>
          <li>
            <IconContext.Provider
              value={{ className: 'icon__green tour__info--icon full star' }}
            >
              <MdPeopleOutline />
            </IconContext.Provider>
            <p className="second">BOOKED BY</p>
            <p className="data">{agency.numOptionsBought}</p>
          </li>
        </ul>
      </div>
      <div className="tour__about agency__about agency__info--polygon ">
        <h1>ABOUT: {agency.name}</h1>
        <p className="agency__description">{agency.description}</p>
        <Button
          type="success"
          className="agency__about--button"
          clicked={visitAgency}
        >
          VISIT US!
        </Button>
      </div>
    </section>
  );
};

export default AgencyInfo;
