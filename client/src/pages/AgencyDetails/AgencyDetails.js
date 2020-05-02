import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
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
  const [finishedTours, setFinishedTours] = useState([]);
  const [myWishlistIds, setMyWishlistIds] = useState();

  const { location, wishlist } = props;
  const { agencyId } = props.agencyId || props.match.params;

  useEffect(() => {
    if (props.wishlist) {
      setMyWishlistIds(props.wishlist.data.map((el) => el.tour));
    }
  }, [wishlist]);

  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  useEffect(() => {
    setPage(props.location.search.split('=')[1] * 1);
  }, [location]);

  useEffect(() => {
    const getAgency = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/v1/agencies/${agencyId}`);
        const finishedRes = await axios.get(
          `/api/v1/agencies/${agencyId}/tours/finishedTours`
        );
        let finishedTours = finishedRes.data.data.map((el) => el._id);
        setFinishedTours(finishedTours);
        setAgency(res.data.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.response.data.message);
      }
    };

    getAgency();
  }, []);

  if (!myWishlistIds) return <LoadingSpinner asOverlay />;
  if (!agency) return <LoadingSpinner asOverlay />;

  const goToPrevPage = () => {
    if (props.location.search.split('=')[1] > 1) {
      Array.from(document.querySelectorAll('.active')).forEach((el) =>
        el.classList.remove('active')
      );
      document
        .querySelector(`#page-${props.location.search.split('=')[1] - 1}`)
        .classList.add('active');
      props.history.replace(
        `${props.match.url}?page=${props.location.search.split('=')[1] * 1 - 1}`
      );
    }
  };

  const goToNextPage = () => {
    const totalPages = Math.round(agency.tours.length / resPerPage) + 1;

    if (props.location.search.split('=')[1] < totalPages) {
      Array.from(document.querySelectorAll('.active')).forEach((el) =>
        el.classList.remove('active')
      );
      document
        .querySelector(`#page-${props.location.search.split('=')[1] * 1 + 1}`)
        .classList.add('active');
      props.history.replace(
        `${props.match.url}?page=${props.location.search.split('=')[1] * 1 + 1}`
      );
    }
  };

  const linkHandler = (e) => {
    Array.from(document.querySelectorAll('.active')).forEach((el) =>
      el.classList.remove('active')
    );
    e.target.classList.add('active');
    // setPage(props.location.search.split('=')[1] * 1);
  };

  let pageContent = [];
  for (let i = 1; i <= Math.round(agency.tours.length / resPerPage) + 1; i++) {
    if (Math.round(agency.tours.length / resPerPage) <= 1) {
      pageContent.push(
        <div>
          <Link
            id={`page-${i}`}
            onClick={linkHandler}
            className={`page__number`}
            to={`${props.match.url}?page=${i}`}
          >
            {i}
          </Link>
        </div>
      );
    } else {
      if (i === 1) {
        pageContent.push(
          <div className="span__center">
            <span
              style={{ cursor: 'pointer' }}
              onClick={goToPrevPage}
              className="span__center"
            >
              <IconContext.Provider
                value={{ className: 'blue__review tour__info--icon full star' }}
              >
                <IoIosArrowBack />
              </IconContext.Provider>
            </span>
            <Link
              id={`page-${i}`}
              onClick={linkHandler}
              className={`page__number`}
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
              id={`page-${i}`}
              onClick={linkHandler}
              className={`page__number`}
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
                value={{ className: 'blue__review tour__info--icon full star' }}
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
              id={`page-${i}`}
              onClick={linkHandler}
              className={`page__number page-${i}`}
              to={`${props.match.url}?page=${i}`}
            >
              {i}
            </Link>
          </div>
        );
      }
    }
  }

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
              <TourItem
                pageChanged={page}
                isTourLiked={myWishlistIds.includes(tour._id)}
                finished={finishedTours.includes(tour._id)}
                shouldUpdate={shouldUpdate}
                tour={tour}
              />
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

const mapStateToProps = (state) => {
  return {
    wishlist: state.user.wishlist,
  };
};

export default connect(mapStateToProps)(AgencyDetails);
