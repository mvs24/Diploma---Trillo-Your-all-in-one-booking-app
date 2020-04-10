import React from 'react';
import { connect } from 'react-redux';
import CartItem from './CartItem';

const MyCart = (props) => {
  const { cartTour, isAuthenticated } = props;

  if (!isAuthenticated) return null;

  if (cartTour.length === 0) return <h1>No Tours Found!</h1>;

  return (
    <>
      {cartTour.map((el) => (
        <CartItem tourId={el.tour} />
      ))}
    </>
  );
};

const mapStateToProps = (state) => ({
  cartTour: state.user.cartTour,
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps)(MyCart);
