import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import axios from 'axios';
import TourItem from '../../components/TourItem/TourItem';

const Search = (props) => {
  const [tours, setTours] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const { searchInput } = props.match.params;

  useEffect(() => {
    const getTours = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `/api/v1/tours/search?searchInput=${searchInput}`
        );
        setTours(res.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response.data.message);
      }
    };
    getTours();
  }, [searchInput]);

  if (tours && tours.results === 0) return <h1>No tours found</h1>;
  if (!tours) return <LoadingSpinner asOverlay />;

  return (
    <>
      {loading && <LoadingSpinner asOverlay />}
      {error && (
        <ErrorModal show onClear={() => setError(false)}>
          {error}
        </ErrorModal>
      )}
      <h1 className="my__wishlist--heading">RESULTS FOUND: {tours.length}</h1>
      <div className="wishlist__container">
        {tours.map((tour) => (
          <TourItem tour={tour} />
        ))}
      </div>
    </>
  );
};

export default Search;
