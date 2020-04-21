import React, {useState} from 'react';
import { connect } from 'react-redux';
import CartItem from './CartItem';
import './MyCart.css';

const MyCart = (props) => {
  const [removed, setRemoved] = useState()
  const { cartTour, isAuthenticated } = props;

  if (!isAuthenticated) return null;

  if (cartTour.length === 0)
    return (
      <div className="wish__data">
        <h1>No Tour found in your cart!</h1>
      </div>
    );

  const removeHandler = () => {
    setRemoved(prev => !prev)
  }

  return (
    <div className="my__cartContainer">
      <div className="cart__container">
        {cartTour.map((el) => (
          <CartItem removeTour={removed} removed={removeHandler} tourId={el.tour} />
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  cartTour: state.user.cartTour,
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps)(MyCart);
