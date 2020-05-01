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

  const compare = (a, b) => {
    if (new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime())
      return 1;
    else return -1;
  };

  let unReadLength = 0;

  notifications.sort(compare).forEach((el) => {
    if (el.read === false) {
      unReadLength++;
    }
  });

  /////////////////////////////////
  // TODO
  // PAGINATION ON NOTIFICATIONS
  // With Show More BTN
  // const updatedNotifications = notifications.sort().slice(start,end)

  return (
    <div className="notifications--container">
      <div onClick={markAllReadHandler} className="notifications__header">
        <h1>Notifications ({unReadLength})</h1>
        <p>Mark all read</p>
      </div>
      <div className="notification__items">
        <div className="circle">&nbsp;</div>
        {notifications.sort().map((notification) => (
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
