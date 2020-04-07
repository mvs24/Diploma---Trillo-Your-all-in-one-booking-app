import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { IoIosArrowDown, IoMdNotificationsOutline } from 'react-icons/io';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import LoadingSpinner from '../shared/components/UI/LoadingSpinner';
import Button from '../shared/components/Button/Button';

import './UserContent.css';

const UserContent = (props) => {
  const history = useHistory();
  const { wishlist, cartTour, notifications, unReadNotifications } = props;
  let cartTourLength = 0;

  let wishlistContent = <LoadingSpinner />;

  if (!notifications) {
    return <LoadingSpinner />;
  }

  const goToWishlistPage = () => {
    history.push('/my-wishlist')
  }

  if (wishlist)
    wishlistContent = (
      <div onClick={goToWishlistPage} className="wishlist__content">
        <IconContext.Provider value={{ className: 'icon heart' }}>
          <FiHeart />
          <span className="wish__length">
            {wishlist.results > 9 ? <span>9+</span> : wishlist.results}
          </span>
        </IconContext.Provider>
      </div>
    );

  if (cartTour.length !== 0) {
    cartTourLength = cartTour.length;
  }

  const myProfileHandler = () => {
    history.push('/me');
  };

  const notificationHandler = () => {
    history.push('/my-notifications');
  };

  const myBookingsHandler = () => {
    history.push('/my-bookings');
  };

  let unReadLength = 0;
  notifications.forEach((el) => {
    if (el.read === false) {
      unReadLength++;
    }
  });

  return (
    <>
      <section className="user__content">
        <div className="seperator">&nbsp;</div>

        <div onClick={myBookingsHandler} className="my__bookings__container">
          <h1>My Bookings</h1>
        </div>
        {wishlistContent}

        <div onClick={() => history.push('/my-cart')} className="shopping__container">
          <IconContext.Provider value={{ className: 'icon cart shop' }}>
            <FiShoppingCart />
            <span className="cart__length">{cartTourLength}</span>
          </IconContext.Provider>
        </div>

        <div onClick={notificationHandler} className="notifications__container">
          <IconContext.Provider value={{ className: 'icon cart notify' }}>
            <IoMdNotificationsOutline />
            <span className="notify__length">{unReadLength}</span>
          </IconContext.Provider>
        </div>

        <div onClick={myProfileHandler} className="user__profile">
          <img
            src={`http://localhost:5000/${props.userData.photo}`}
            alt="user"
          />
          <h4>
            {props.userData.name} {props.userData.lastname}
          </h4>
        </div>
      </section>
    </>
  );
};

const mapStateToProps = (state) => ({
  userData: state.user.userData,
  isAuthenticated: state.user.isAuthenticated
});

export default connect(mapStateToProps)(UserContent);
