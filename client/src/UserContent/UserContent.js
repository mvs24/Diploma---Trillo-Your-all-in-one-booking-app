import React from 'react';
import { connect } from 'react-redux';
import { IconContext } from 'react-icons';
import { IoIosArrowDown } from 'react-icons/io';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import LoadingSpinner from '../shared/components/UI/LoadingSpinner';

import './UserContent.css';

const UserContent = props => {
  const { wishlist } = props;
  let wishlistContent = <LoadingSpinner />;
  if (wishlist)
    wishlistContent = (
      <div className="shopping__cart">
        <span className="hidden">Shopping_cart</span>
        <IconContext.Provider value={{ className: 'icon heart' }}>
          <FiHeart />
          <span className="wish__length">{wishlist.results}</span>
        </IconContext.Provider>
      </div>
    );

  return (
    <>
      <div className="bookings__container">
        <div className="bookings__hover">
          <span>My Bookings</span>
          <IconContext.Provider value={{ className: 'icon' }}>
            <IoIosArrowDown />
          </IconContext.Provider>
        </div>

        <div className=" my__booking__items">
          <div className="my__booking_item">
            <img
              src="https://images.pexels.com/photos/9754/mountains-clouds-forest-fog.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500"
              alt="Booking Item"
            />
            <div>
              <h3>The Forest Hiker</h3>
              <h4>Agency: Marius SHPK</h4>
            </div>
          </div>{' '}
          <div className="my__booking_item">
            <img
              src="https://images.pexels.com/photos/9754/mountains-clouds-forest-fog.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500"
              alt="Booking Item"
            />
            <div>
              <h3>The Forest Hiker</h3>
              <h4>Agency: Marius SHPK</h4>
            </div>
          </div>{' '}
          <div className="my__booking_item">
            <img
              src="https://images.pexels.com/photos/9754/mountains-clouds-forest-fog.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500"
              alt="Booking Item"
            />
            <div>
              <h3>The Forest Hiker</h3>
              <h4>Agency: Marius SHPK</h4>
            </div>
          </div>{' '}
          <div className="my__booking_item">
            <img
              src="https://images.pexels.com/photos/9754/mountains-clouds-forest-fog.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500"
              alt="Booking Item"
            />
            <div>
              <h3>The Forest Hiker</h3>
              <h4>Agency: Marius SHPK</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="wishlist__container">
        {wishlistContent}
        <div className="wishlist__items">
          <div className="wishlist_item">
            <img
              src="https://images.pexels.com/photos/9754/mountains-clouds-forest-fog.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500"
              alt="Booking Item"
            />
            <div>
              <h3>The Wine Taster</h3>
              <h4>Agency: Marius SHPK</h4>
            </div>
          </div>
          <div className="wishlist_item">
            <img
              src="https://images.pexels.com/photos/9754/mountains-clouds-forest-fog.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500"
              alt="Booking Item"
            />
            <div>
              <h3>The Wine Taster</h3>
              <h4>Agency: Marius SHPK</h4>
            </div>
          </div>{' '}
          <div className="wishlist_item">
            <img
              src="https://images.pexels.com/photos/9754/mountains-clouds-forest-fog.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500"
              alt="Booking Item"
            />
            <div>
              <h3>The Wine Taster</h3>
              <h4>Agency: Marius SHPK</h4>
            </div>
          </div>{' '}
          <div className="wishlist_item">
            <img
              src="https://images.pexels.com/photos/9754/mountains-clouds-forest-fog.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500"
              alt="Booking Item"
            />
            <div>
              <h3>The Wine Taster</h3>
              <h4>Agency: Marius SHPK</h4>
            </div>
          </div>{' '}
        </div>
      </div>

      <div className="shopping__container">
        <div className="shopping__cart">
          <span className="hidden">Shopping_cart</span>
          <IconContext.Provider value={{ className: 'icon cart' }}>
            <FiShoppingCart />
            <span className="cart__length">9+</span>
          </IconContext.Provider>
        </div>

        <div className="shopping__items">
          <div className="shopping_item">
            <img
              src="https://images.pexels.com/photos/9754/mountains-clouds-forest-fog.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500"
              alt="Booking Item"
            />
            <div>
              <h3>The Wine Taster</h3>
              <h4>Agency: Marius SHPK</h4>
            </div>
          </div>
          <div className="shopping_item">
            <img
              src="https://images.pexels.com/photos/9754/mountains-clouds-forest-fog.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500"
              alt="Booking Item"
            />
            <div>
              <h3>The Wine Taster</h3>
              <h4>Agency: Marius SHPK</h4>
            </div>
          </div>
          <div className="shopping_item">
            <img
              src="https://images.pexels.com/photos/9754/mountains-clouds-forest-fog.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500"
              alt="Booking Item"
            />
            <div>
              <h3>The Wine Taster</h3>
              <h4>Agency: Marius SHPK</h4>
            </div>
          </div>
        </div>
      </div>
      <div className="user__profile">
        <img
          src="https://images.pexels.com/photos/9754/mountains-clouds-forest-fog.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500"
          alt=""
        />
        <h4>Marius Vasili</h4>
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  userData: state.user.userData
});

export default connect(mapStateToProps)(UserContent);
