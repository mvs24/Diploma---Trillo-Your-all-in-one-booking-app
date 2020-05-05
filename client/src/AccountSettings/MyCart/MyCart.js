import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import CartItem from './CartItem';
import './MyCart.css';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import { getToursInCart } from '../../store/actions/userActions';
import Button from '../../shared/components/Button/Button';

const MyCart = (props) => {
  const { cartTour, wishlist, isAuthenticated } = props;
  const start = 0;
  const [end, setEnd] = useState(6);
  if (!isAuthenticated) return <LoadingSpinner asOverlay />;

  if (props.loading) return <LoadingSpinner asOverlay />;
  if (cartTour.length === 0)
    return (
      <div className="wish__data__heading">
        <h1 className="noFlightHeading">No Tour found in your cart!</h1>
      </div>
    );

  const showMoreHandler = () => {
    setEnd((prev) => prev + 6);
  };

  return (
    <div className="my__cartContainer">
      <div className="cart__container">
        {cartTour.slice(start, end).map((el) => {
          return <CartItem tourId={el.tour} />;
        })}
      </div>
      <div className="searchBtn--grid">
        <Button
          type="blue"
          disabled={end >= cartTour.length}
          clicked={showMoreHandler}
        >
          Show More
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  cartTour: state.user.cartTour,
  isAuthenticated: state.user.isAuthenticated,
  wishlist: state.user.wishlist,
  loading: state.user.loading,
});

export default connect(mapStateToProps, { getToursInCart })(MyCart);
