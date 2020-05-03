import React, { useState } from 'react';
import { connect } from 'react-redux';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import WishlistItem from './WishlistItem';
import Button from '../../shared/components/Button/Button';

import './MyWishlist.css';

const MyWishlist = (props) => {
  const { wishlist, isAuthenticated } = props;
  const start = 0;
  const [end, setEnd] = useState(6);

  if (!isAuthenticated) return null;

  if (!wishlist) return <LoadingSpinner asOverlay />;

  const wishlistData = wishlist.data;
  if (wishlistData.length === 0)
    return (
      <div className="wish__data">
        <h1>No Tour found in your wishlist!</h1>
      </div>
    );

  const showMoreHandler = () => {
    setEnd((prev) => prev + 6);
  };

  return (
    <>
      <h1 className="my__wishlist--heading">MY WISHLIST</h1>
      <div className="wishlist__container">
        {wishlistData.slice(start, end).map((wishData) => (
          <WishlistItem tourId={wishData.tour} />
        ))}
      </div>
      <div className="searchBtn--grid">
        {' '}
        <Button
          type="pink"
          disabled={end >= wishlistData.length}
          clicked={showMoreHandler}
        >
          Show More
        </Button>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  wishlist: state.user.wishlist,
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps)(MyWishlist);
