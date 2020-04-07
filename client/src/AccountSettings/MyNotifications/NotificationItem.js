import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { markNotificationsAsRead } from '../../store/actions/userActions';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import NotificationItem from './NotificationItem';
import { markNotificationAsRead } from '../../store/actions/userActions';
import axios from 'axios';

const MyNotifications = (props) => {
  const [agency, setAgency] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const history = useHistory();
  const { notification } = props;

  useEffect(() => {
    const getAgency = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/v1/agencies/' + notification.agency);
        setAgency(res.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response.data.message);
      }
    };

    getAgency();
  }, []);

  const notificationHandler = async () => {
    props.markNotificationAsRead(notification._id, history, notification.tour);
  };

  if (!agency) return <LoadingSpinner asOverlay />;

  return (
    <div onClick={notificationHandler} className="notification__item">
      {loading && <LoadingSpinner asOverlay />}
      {notification.read === false ? (
        <div className="center__not__item">
          <div className="not__read">&nbsp;</div>
          <img
            src={`http://localhost:5000/public/img/agencies/${agency.image}`}
          />
          <p>{notification.message}</p>
          <p>9:43</p>
        </div>
      ) : (
        <div className="center__not__item">
          <img
            src={`http://localhost:5000/public/img/agencies/${agency.image}`}
          />
          <p>{notification.message}</p>
          <p>9:43</p>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  notifications: state.user.notifications,
  unReadNotifications: state.user.unReadNotifications,
});

export default connect(mapStateToProps, {
  markNotificationsAsRead,
  markNotificationAsRead,
})(MyNotifications);