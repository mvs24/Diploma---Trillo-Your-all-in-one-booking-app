import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import Pin from '../../assets/pin.png';

const Map = (props) => {
  const [viewport, setViewport] = useState({
    width: '100%',
    height: 500,
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });
  const locIds = [];

  if (props.toLocation) {
     locIds.push({
    id: props.fromLocation.description, showPopup: true,coordinates: props.fromLocation.coordinates,
        description: props.fromLocation.description,
    address: props.fromLocation.address,
    typeLocation: 'from'
  })
      locIds.push({
    id: props.toLocation.description, showPopup: true, coordinates: props.toLocation.coordinates,
        description: props.toLocation.description,
    address: props.toLocation.address,
       typeLocation: 'to'
  })
  } else {
     locIds.push({
    id: props.fromLocation.description, showPopup: true, coordinates: props.fromLocation.coordinates,
    description: props.fromLocation.description,
    address: props.fromLocation.address,
       typeLocation: 'from'
    })
  }


  useEffect(() => {
    setViewport((prevState) => {
      return {
        ...prevState,
        latitude: props.fromLocation.coordinates[1],
        longitude: props.fromLocation.coordinates[0],
      };
    });
  }, []);

  const loadDayMarkers = () => {
    return locIds.map((loc) => {
      if (loc.coordinates.length === 0) return null;
      return (
        <Marker
          key={loc.coordinates}
          latitude={parseFloat(loc.coordinates[1])}
          longitude={parseFloat(loc.coordinates[0])}
        > 
          <img
            className="marker"
            src={Pin}
          />
          <div className="popup">
              <span className="description">
               {loc.typeLocation === 'from' ? 'From: ' +loc.description : "To: " + loc.description}
              </span>
            </div>
        </Marker>
      );
    });
  };

  return (
    <ReactMapGL
      mapboxApiAccessToken={
        'pk.eyJ1IjoibWFyaXVzMjQ5OCIsImEiOiJjazhodWprNW8wM2w0M2RxemRva2tybjhpIn0.h8tRVAkZqkvhSSnD3uEPUw'
      }
      {...viewport}
      onViewportChange={setViewport}
    >
     {loadDayMarkers()}
    </ReactMapGL>
  );
};
export default Map;
