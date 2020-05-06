import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment'
import ErrorModal from '../../shared/components/UI/ErrorModal';
import { IconContext } from 'react-icons';
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoMdStar,
  IoIosStarOutline,
} from 'react-icons/io';
import './ReviewFlightItem.css';

const ReviewItem = (props) => {
  const [user, setUser] = useState();
  const [error, setError] = useState();
  const { start, end } = props;
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
  }, [start, end]);

  if (!user) return null;

  let stars = [];

  for (let i = 0; i < props.review.rating; i++) {
    stars.push(
      <IconContext.Provider
        value={{ className: 'blue__review tour__info--icon full star' }}
      >
        <IoMdStar />
      </IconContext.Provider>
    );
  }

  for (let i = props.review.rating; i < 5; i++) {
    stars.push(
      <IconContext.Provider
        value={{ className: 'blue__review tour__info--icon full star' }}
      >
        <IoIosStarOutline />
      </IconContext.Provider>
    );
  }

  let reviewItem = (
    <div className="entire__review flight__review__item">
      {error && (
        <ErrorModal show onClear={() => setError(false)}>
          {error}
        </ErrorModal>
      )}
      <div className="review__info--2">
        {props.first ? (
          <button
            disabled={start === 0}
            className="arrow__left"
            onClick={props.showLess}
          >
            <IconContext.Provider
              value={{ className: 'blue__review tour__info--icon full star' }}
            >
              <IoIosArrowBack />
            </IconContext.Provider>
          </button>
        ) : null}
        <div className="user__info--2">
          <img src={`http://localhost:5000/${user.photo}`} alt="user photo" />
          <h3 className="username">
            {user.name} {user.lastname}
          </h3>
          {props.last ? (
            <button
              disabled={end >= props.totalFlights.length}
              className="arrow__right"
              onClick={props.showMore}
            >
              <IconContext.Provider
                value={{ className: 'blue__review tour__info--icon full star' }}
              >
                <IoIosArrowForward />
              </IconContext.Provider>
            </button>
          ) : null}
        </div>

        <div className="review__details">
          {stars.map((star) => star)}
          <p className="review__paragraph">{props.review.review}</p>
          <p className="review__paragraph">Reviewed: {moment(props.review.createdAt).startOf('hour').fromNow()}</p>
        </div>
      </div>
    </div>
  );

  return reviewItem;
};

export default ReviewItem;
