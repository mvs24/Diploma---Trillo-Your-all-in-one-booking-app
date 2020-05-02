import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import axios from 'axios';
import TourItem from '../../components/TourItem/TourItem';
import './MyBookings.css';

const MyBookings = (props) => {
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
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

  if (myBookings.length === 0)
    return (
      <div className="wish__data">
        <h1>You have not booked a tour yet!</h1>
      </div>
    );

  return (
    <div className="my__bookings">
      {error && <ErrorModal>{error}</ErrorModal>}
      {myBookings.map((booking) => (
        <TourItem tour={booking.tour} booked />
      ))}
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
  reviews: state.user.reviews,
});

export default connect(mapStateToProps)(MyBookings);
