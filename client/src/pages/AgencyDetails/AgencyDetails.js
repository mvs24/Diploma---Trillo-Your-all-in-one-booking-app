import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, Link } from 'react-router-dom';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import { IconContext } from 'react-icons';
import { GoLocation } from 'react-icons/go';
import { MdDateRange } from 'react-icons/md';
import {
  IoIosStarOutline,
  IoIosArrowBack,
  IoIosArrowForward,
} from 'react-icons/io';
import { MdPeopleOutline, MdAccessTime } from 'react-icons/md';
import { FaLevelUpAlt, FaSortNumericUp } from 'react-icons/fa';
import Button from '../../shared/components/Button/Button';
import './AgencyDetails.css';
import TourItem from '../../components/TourItem/TourItem';
import Agency from '../../components/Agency/Agency';

const AgencyDetails = (props) => {
  const [agency, setAgency] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [resPerPage, setResPerPage] = useState(3);
  const [shouldUpdate, setShouldUpdate] = useState();

  const { agencyId } = props.agencyId || props.match.params;

  useEffect(() => {
    const getAgency = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/v1/agencies/${agencyId}`);
        setAgency(res.data.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.response.data.message);
      }
    };

    getAgency();
  }, []);

  const { location } = props;

  useEffect(() => {
    setPage(props.location.search.split('=')[1]);
    setShouldUpdate((prev) => !prev);
  }, [location]);

  if (!agency) return <LoadingSpinner asOverlay />;

  const goToPrevPage = () => {
    if (props.location.search.split('=')[1] > 1) {
      props.history.replace(
        `${props.match.url}?page=${props.location.search.split('=')[1] - 1}`
      );
    }
  };

  const goToNextPage = () => {
    const totalPages = Math.round(agency.tours.length / resPerPage) + 1;
    console.log(totalPages);
    if (props.location.search.split('=')[1] < totalPages) {
      props.history.replace(
        `${props.match.url}?page=${props.location.search.split('=')[1] * 1 + 1}`
      );
    }
  };

  let pageContent = [];
  for (let i = 1; i <= Math.round(agency.tours.length / resPerPage) + 1; i++) {
    if (i === 1) {
      pageContent.push(
        <div className="span__center">
          <span
            style={{ cursor: 'pointer' }}
            onClick={goToPrevPage}
            className="span__center"
          >
            <IconContext.Provider
              value={{ className: 'icon__green tour__info--icon full star' }}
            >
              <IoIosArrowBack />
            </IconContext.Provider>
          </span>
          <Link
            className={`page__number ${location}===${i} ? active : ''`}
            to={`${props.match.url}?page=${i}`}
          >
            {i}
          </Link>
        </div>
      );
    } else if (i === Math.round(agency.tours.length / resPerPage) + 1) {
      pageContent.push(
        <div className="span__center">
          <Link
            className={`page__number ${location}===${i} ? active : ''`}
            to={`${props.match.url}?page=${i}`}
          >
            {i}
          </Link>
          <span
            style={{ cursor: 'pointer' }}
            onClick={goToNextPage}
            className="span__center"
          >
            <IconContext.Provider
              value={{ className: 'icon__green tour__info--icon full star' }}
            >
              <IoIosArrowForward />
            </IconContext.Provider>
          </span>
        </div>
      );
    } else {
      pageContent.push(
        <div>
          <Link
            className={`page__number ${location}===${i} ? active : ''`}
            to={`${props.match.url}?page=${i}`}
          >
            {i}
          </Link>
        </div>
      );
    }
  }

  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  let updatedAgencyTours = agency.tours.slice(start, end);

  return (
    <>
      {error && (
        <ErrorModal show onClear={() => setError(false)}>
          {error}
        </ErrorModal>
      )}
      <div className="agency__details--container">
        <Agency agency={agency} />
        <div className="agency__tours">
          {updatedAgencyTours.length !== 0 && <h1>TOURS</h1>}
          <div className="agency__tour--item">
            {updatedAgencyTours.map((tour) => (
              <TourItem shouldUpdate={shouldUpdate} tour={tour} />
            ))}
            {updatedAgencyTours.length === 0 && (
              <div className="u-text-center">
                <h1 className="updatedAgencyTours">
                  No tours found on this page!
                </h1>
              </div>
            )}
          </div>
          <div className="pages__content">{pageContent.map((p) => p)}</div>
        </div>
      </div>
    </>
  );
};

export default AgencyDetails;
