import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import { IconContext } from 'react-icons';
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoMdStar,
  IoIosStarOutline
} from 'react-icons/io';

import './ReviewItem.css';

const ReviewItem = props => {
  const [user, setUser] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`/api/v1/users/${props.review.user}`);

        setUser(res.data.data);
      } catch (err) {
        setError(err.response.data.message);
      }
    };

    getUser();
  }, []);

  if (!user) return null;

  let stars = [];

  for (let i = 0; i < props.review.rating; i++) {
    stars.push(
      <IconContext.Provider
        value={{ className: 'icon__green tour__info--icon full star' }}
      >
        <IoMdStar />
      </IconContext.Provider>
    );
  }

  for (let i = props.review.rating; i < 5; i++) {
    stars.push(
      <IconContext.Provider
        value={{ className: 'icon__green tour__info--icon full star' }}
      >
        <IoIosStarOutline />
      </IconContext.Provider>
    );
  }

  let reviewItem = (
    <div className="entire__review ">
      {error && (
        <ErrorModal show onClear={() => setError(false)}>
          {error}
        </ErrorModal>
      )}
      <div className="review__info--1">
        <div className="user__info">
          <img
            src={`http://localhost:5000/public/img/users/${user.photo}`}
            alt="user photo"
          />
          <h3 className="username">
            {user.name} {user.lastname}
          </h3>
        </div>
        <div className="review__details">
          {stars.map(star => star)}
          <p className="review__paragraph">{props.review.review}</p>
        </div>
      </div>
    </div>
  );

  if (props.index === 0) {
    reviewItem = (
      <div className="entire__review">
        <div>
          {error && (
            <ErrorModal show onClear={() => setError(false)}>
              {error}
            </ErrorModal>
          )}

          <div className="review__info--1">
            <div className="user__info">
              <img
                src={`http://localhost:5000/public/img/users/${user.photo}`}
                alt="user photo"
              />
              <h3 className="username">
                {user.name} {user.lastname}
              </h3>
            </div>
            <div className="review__details">
              {stars.map(star => star)}
              <p className="review__paragraph">{props.review.review}</p>
            </div>
          </div>
        </div>
        <button
          disabled={props.page === 1}
          className="arrow__left"
          onClick={props.showLess}
        >
          <IconContext.Provider
            value={{ className: 'icon__green tour__info--icon full star' }}
          >
            <IoIosArrowBack />
          </IconContext.Provider>
        </button>
      </div>
    );
  } else if (props.index === 2) {
    reviewItem = (
      <div className="entire__review">
        <div>
          {error && (
            <ErrorModal show onClear={() => setError(false)}>
              {error}
            </ErrorModal>
          )}

          <div className="review__info--1">
            <div className="user__info">
              <img
                src={`http://localhost:5000/public/img/users/${user.photo}`}
                alt="user photo"
              />
              <h3 className="username">
                {user.name} {user.lastname}
              </h3>
            </div>
            <div className="review__details">
              {stars.map(star => star)}
              <p className="review__paragraph">{props.review.review}</p>
            </div>
          </div>
        </div>
        <button
          disabled={props.reviewLength === props.page * props.limit}
          className="arrow__right"
          onClick={props.showMore}
        >
          <IconContext.Provider
            value={{ className: 'icon__green tour__info--icon full star' }}
          >
            <IoIosArrowForward />
          </IconContext.Provider>
        </button>
      </div>
    );
  }

  return reviewItem;
};

export default ReviewItem;
