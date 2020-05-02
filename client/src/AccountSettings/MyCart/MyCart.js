import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import CartItem from './CartItem';
import './MyCart.css';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import { getToursInCart } from '../../store/actions/userActions';

const MyCart = (props) => {
  const { cartTour, wishlist, isAuthenticated } = props;
  if (!isAuthenticated) return null;

  if (cartTour.length === 0)
    return (
      <div className="wish__data">
        <h1>No Tour found in your cart!</h1>
      </div>
    );

  return (
    <div className="my__cartContainer">
      <div className="cart__container">
        {cartTour.map((el) => {
          return <CartItem tourId={el.tour} />;
        })}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  cartTour: state.user.cartTour,
  isAuthenticated: state.user.isAuthenticated,
  wishlist: state.user.wishlist,
});

export default connect(mapStateToProps, { getToursInCart })(MyCart);
