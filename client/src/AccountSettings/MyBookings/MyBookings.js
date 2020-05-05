import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import axios from 'axios';
import TourItem from '../../components/TourItem/TourItem';
import './MyBookings.css';
import Button from '../../shared/components/Button/Button';

const MyBookings = (props) => {
  const [myBookings, setMyBookings] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const start = 0;
  const [end, setEnd] = useState(6);
  const { isAuthenticated } = props;

  useEffect(() => {
    const getMyBookings = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/v1/users/my/bookings');
        setLoading(false);
        setMyBookings(res.data.data);
      } catch (err) {
        setError(err.response.data.message);
      }
    };

    if (isAuthenticated) {
      getMyBookings();
    }
  }, [isAuthenticated]);

  if (loading) return <LoadingSpinner asOverlay />;
  if (!myBookings) return <LoadingSpinner asOverlay />;

  const showMoreHandler = () => {
    setEnd((prev) => prev + 6);
  };

  if (myBookings.length === 0)
    return (
      <div className="wish__data__heading">
        <h1 className="noFlightHeading">You have not booked a tour yet!</h1>
      </div>
    );

  return (
    <>
      <h1 className="my__wishlist--heading">
        MY BOOKINGS ({myBookings.length})
      </h1>
      <div className="wishlist__container">
        {myBookings.slice(start, end).map((booking) => (
          <TourItem tour={booking.tour} booked />
        ))}
      </div>
      <div className="searchBtn--grid">
        {' '}
        <Button
          type="blue"
          disabled={end >= myBookings.length}
          clicked={showMoreHandler}
        >
          Show More
        </Button>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
  reviews: state.user.reviews,
});

export default connect(mapStateToProps)(MyBookings);
