import React from 'react';
import { connect } from 'react-redux';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import WishlistItem from './WishlistItem';

import './MyWishlist.css';

const MyWishlist = (props) => {
  const { wishlist, isAuthenticated } = props;

  if (!isAuthenticated) return null;

  if (!wishlist) return <LoadingSpinner asOverlay />;

  const wishlistData = wishlist.data;

  return (
    <>
      <h1 className="my__wishlist--heading">MY WISHLIST</h1>
      <div className="wishlist__container">
        {wishlistData.map((wishData) => (
          <WishlistItem tourId={wishData.tour} />
        ))}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  wishlist: state.user.wishlist,
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps)(MyWishlist);
