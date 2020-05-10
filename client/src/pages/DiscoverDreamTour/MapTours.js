import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import Pin from './pin.png';
import './MapTours.css';
import Button from '../../shared/components/Button/Button';

const MapTours = (props) => {
  const [viewport, setViewport] = useState({
    width: '100%',
    height: 500,
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 3,
  });
  const [userLocation, setUserLocation] = useState();
  const [zoomUpdated, setZoomUpdated] = useState();
  const { tours } = props;

  useEffect(() => {
    setViewport((prevState) => {
      return {
        ...prevState,
        latitude: tours[0].startLocation.coordinates[1],
        longitude: tours[0].startLocation.coordinates[0],
      };
    });
  }, []);
  if (!tours) return null;

  const loadDayMarkers = () => {
    return tours.map((tour) => {
      return (
        <Marker
          key={tour.startLocation.coordinates}
          latitude={parseFloat(tour.startLocation.coordinates[1])}
          longitude={parseFloat(tour.startLocation.coordinates[0])}
        >
          <img className="marker" src={Pin} />
          <div className="popup">
            <span className="description">{tour.name}</span>
          </div>
        </Marker>
      );
    });
  };

  const showLocationHandler = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      let newViewport = {
        height: '100vh',
        width: '100vw',
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        zoom: 14,
      };
      setViewport(newViewport);
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  };

  const zoomOut = () => {
    if (!zoomUpdated) {
      setViewport((prevState) => {
        return {
          ...prevState,
          zoom: 1.5,
        };
      });
      setZoomUpdated(true);
    }
  };

  return (
    <div className="map__tours">
      {props.cancelBtn && zoomOut()}
      {userLocation && (
        <div className="totalToursLength">
          {' '}
          <h1>Total Tours found: {props.totalToursLength}</h1>{' '}
          <Button
            className="discover__button discover__button--within"
            type="success"
            clicked={() => props.getToursWithinHandler(userLocation)}
          >
            Get Tours Within a distance
          </Button>
        </div>
      )}
      <ReactMapGL
        mapboxApiAccessToken={'pk.eyJ1IjoibWFyaXVzMjQ5OCIsImEiOiJjazhodWprNW8wM2w0M2RxemRva2tybjhpIn0.h8tRVAkZqkvhSSnD3uEPUw'}
        {...viewport}
        onViewportChange={setViewport}
      >
        {loadDayMarkers()}
      </ReactMapGL>

      {props.cancelBtn ? null : (
        <div>
          {' '}
          <Button
            className="discover__button"
            type="success"
            clicked={showLocationHandler}
          >
            Show my location
          </Button>
        </div>
      )}
    </div>
  );
};
export default MapTours;
