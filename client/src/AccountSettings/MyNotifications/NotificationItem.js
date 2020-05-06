import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'
import { useHistory } from 'react-router-dom';
import { markNotificationsAsRead } from '../../store/actions/userActions';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
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
    if (agency.category === 'flights') {
      props.markNotificationAsRead(
        notification._id,
        history,
        notification.flight,
        'flight'
      );
    } else if (agency.category === 'tours') {
      props.markNotificationAsRead(
        notification._id,
        history,
        notification.tour,
        'tour'
      );
    }
  };

  if (!agency) return <LoadingSpinner asOverlay />;

  const splittedDate = notification.createdAt.split('T');

  return (
    <div onClick={notificationHandler} className="notification__item">
      {loading && <LoadingSpinner asOverlay />}
      {notification.read === false ? (
        <div className="center__not__item">
          <div className="not__read">&nbsp;</div>
          <img src={`http://localhost:5000/${agency.image}`} />
          <p>{notification.message}</p>
          <p>
             <strong>{moment(notification.createdAt).format('MMMM Do YYYY')}</strong>
            
          </p>
        </div>
      ) : (
        <div className="center__not__item">
          <img src={`http://localhost:5000/${agency.image}`} />
          <p>{notification.message}</p>
          <p>
             <strong>{moment(notification.createdAt).format('MMMM Do YYYY')}</strong>
          </p>
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
