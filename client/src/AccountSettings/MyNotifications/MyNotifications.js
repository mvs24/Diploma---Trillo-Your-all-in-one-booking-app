import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { markNotificationsAsRead } from '../../store/actions/userActions';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import NotificationItem from './NotificationItem';
import './MyNotifications.css';

const MyNotifications = (props) => {
  const { notifications, unReadNotifications } = props;

  if (!notifications || !unReadNotifications)
    return <LoadingSpinner asOverlay />;

  const markAllReadHandler = () => {
    props.markNotificationsAsRead();
  };

  let unReadLength = 0;
  notifications.forEach((el) => {
    if (el.read === false) {
      unReadLength++;
    }
  });

  return (
    <div className="notifications--container">
      <div onClick={markAllReadHandler} className="notifications__header">
        <h1>Notifications ({unReadLength})</h1>
        <p>Mark all read</p>
      </div>
      <div className="notification__items">
        <div className="circle">&nbsp;</div>
        {notifications.map((notification) => (
          <NotificationItem notification={notification} />
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  notifications: state.user.notifications,
  unReadNotifications: state.user.unReadNotifications,
});

export default connect(mapStateToProps, { markNotificationsAsRead })(
  MyNotifications
);
