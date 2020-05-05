import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import { IconContext } from 'react-icons';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import './AgencyDetails.css';
import TourItem from '../../components/TourItem/TourItem';
import Agency from '../../components/Agency/Agency';

const AgencyDetails = (props) => {
  const [agency, setAgency] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [resPerPage, setResPerPage] = useState(3);
  const [shouldUpdate, setShouldUpdate] = useState();
  const [finishedTours, setFinishedTours] = useState([]);
  const [myWishlistIds, setMyWishlistIds] = useState();

  const page1 = useRef(null);

  const [startPage, setStartPage] = useState(0);
  const [endPage, setEndPage] = useState(4);

  const { location, wishlist, isAuthenticated } = props;
  const { agencyId } = props.agencyId || props.match.params;
  useEffect(() => {
    const page = props.location.search.split('=')[1];

    setStartPage(page * 1 - 1);
    setEndPage(page * 1 + 3);
  }, []);

  useEffect(() => {
    if (isAuthenticated && props.wishlist) {
      setMyWishlistIds(props.wishlist.data.map((el) => el.tour));
    }
  }, [isAuthenticated, wishlist]);

  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  useEffect(() => {
    const currentPage = props.location.search.split('=')[1] * 1;

    if (agency && currentPage > Math.ceil(agency.tours.length / resPerPage))
      return;

    setPage(currentPage);

    if (agency) {
      if (currentPage > Math.ceil(endPage - 2)) {
        if (currentPage === endPage) {
          setStartPage(
            (prevStart) => prevStart + Math.ceil((endPage - startPage) / 2)
          );
          setEndPage(
            (prevEnd) => prevEnd + Math.ceil((endPage - startPage) / 2)
          );
        } else {
          setStartPage(
            (prevStart) => prevStart + Math.ceil((endPage - startPage) / 2) - 1
          );
          setEndPage(
            (prevEnd) => prevEnd + Math.ceil((endPage - startPage) / 2) - 1
          );
        }
      } else {
        if (startPage >= 1) {
          if (currentPage === 2) {
            setStartPage((prevStart) => prevStart - 1);
            setEndPage((prevEnd) => prevEnd - 1);
          } else {
            if (currentPage === startPage + 1) {
              setStartPage((prevStart) => prevStart - 2);
              setEndPage((prevEnd) => prevEnd - 2);
            } else {
              setStartPage((prevStart) => prevStart - 1);
              setEndPage((prevEnd) => prevEnd - 1);
            }
          }
        }
      }
    }
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

  if (loading) return <LoadingSpinner asOverlay />;
  if (error)
    return (
      <ErrorModal show onClear={() => setError(false)}>
        {error}
      </ErrorModal>
    );
  if (isAuthenticated && !myWishlistIds) return <LoadingSpinner asOverlay />;
  if (!agency) return <h1>No Agency found!</h1>;

  const goToPrevPage = () => {
    if (props.location.search.split('=')[1] > 1) {
      props.history.replace(
        `${props.match.url}?page=${props.location.search.split('=')[1] * 1 - 1}`
      );
    }
  };

  const goToNextPage = () => {
    const totalPages = Math.round(agency.tours.length / resPerPage) + 1;

    if (
      props.location.search.split('=')[1] * 1 + 1 >
      Math.ceil(agency.tours.length / resPerPage)
    )
      return;

    if (props.location.search.split('=')[1] < totalPages) {
      props.history.replace(
        `${props.match.url}?page=${props.location.search.split('=')[1] * 1 + 1}`
      );
    }
  };

  let pageContent = [];
  for (let i = startPage + 1; i <= endPage; i++) {
    if (Math.round(agency.tours.length / resPerPage) <= 1) {
      pageContent.push(
        <div>
          <Link
            id={`page-${i}`}
            className={` ${
              i > Math.ceil(agency.tours.length / resPerPage) * 1
                ? 'disabledLink'
                : ''
            } ${
              props.location.search.split('=')[1] == i ? 'active' : ''
            } page__number`}
            to={`${props.match.url}?page=${i}`}
          >
            {i}
          </Link>
        </div>
      );
    } else {
      if (i === startPage + 1) {
        pageContent.push(
          <div className={`span__center`}>
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
              className={`${
                i > Math.ceil(agency.tours.length / resPerPage) * 1
                  ? 'disabledLink'
                  : ''
              } ${
                props.location.search.split('=')[1] == i ? 'active' : ''
              } page__number`}
              to={`${props.match.url}?page=${i}`}
            >
              {i}
            </Link>
          </div>
        );
      } else if (i === endPage) {
        pageContent.push(
          <div className="span__center">
            <Link
              ref={page1}
              id={`page-${i}`}
              className={` ${
                i > Math.ceil(agency.tours.length / resPerPage) * 1
                  ? 'disabledLink'
                  : ''
              } ${
                props.location.search.split('=')[1] == i ? 'active' : ''
              } page__number`}
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
              className={` ${
                i > Math.ceil(agency.tours.length / resPerPage) * 1
                  ? 'disabledLink'
                  : ''
              } ${
                props.location.search.split('=')[1] == i ? 'active' : ''
              } page__number`}
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
      {loading && <LoadingSpinner asOverlay />}
      <div className="agency__details--container">
        <Agency agency={agency} />
        <div className="agency__tours">
          {updatedAgencyTours.length !== 0 && <h1>TOURS</h1>}
          <div className="agency__tour--item">
            {updatedAgencyTours.map((tour) => (
              <TourItem
                pageChanged={page}
                isTourLiked={
                  isAuthenticated && myWishlistIds.includes(tour._id)
                }
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
    isAuthenticated: state.user.isAuthenticated,
  };
};

export default connect(mapStateToProps)(AgencyDetails);
