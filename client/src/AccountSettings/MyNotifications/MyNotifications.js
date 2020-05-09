import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';

import { markNotificationsAsRead } from '../../store/actions/userActions';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import Button from '../../shared/components/Button/Button';
import NotificationItem from './NotificationItem';
import './MyNotifications.css';

const MyNotifications = (props) => {
  const [end, setEnd] = useState(5);
  const start = 0;
  const notificationsContainer = useRef();
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
  const updatedNotifications = notifications.sort().slice(start, end);

  const showMoreNotificationHandler = () => {
    setEnd((prevEnd) => prevEnd + 5);
  };

  return (
    <div
      id="notificationsCnt"
      ref={notificationsContainer}
      className="notifications--container"
    >
      <div onClick={markAllReadHandler} className="notifications__header">
        <h1>Unread Notifications ({unReadLength})</h1>
        <p>Mark all read</p>
      </div>
      <div className="notification__items">
        <div className="circle">&nbsp;</div>
        {updatedNotifications.map((notification) => (
          <NotificationItem notification={notification} />
        ))}
      </div>
      <div className="showMoreNotification__btn--1">
        <Button
          disabled={end >= props.notifications.length}
          type="pink"
          clicked={showMoreNotificationHandler}
        >
          Show More
        </Button>
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
