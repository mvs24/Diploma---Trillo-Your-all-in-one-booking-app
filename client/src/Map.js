// import React, { useState, useRef, useEffect } from 'react';
// // import mapboxgl from 'mapbox-gl';
// // import { token } from './config';

// import ReactMapGL, { Marker } from 'react-map-gl';

// // mapboxgl.accessToken =
// //   'pk.eyJ1IjoibWFyaXVzMjQ5OCIsImEiOiJjazhodWprNW8wM2w0M2RxemRva2tybjhpIn0.h8tRVAkZqkvhSSnD3uEPUw';

// const Map = props => {
//   return (
//     <ReactMapGL
//       mapboxApiAccessToken={
//         'pk.eyJ1IjoibWFyaXVzMjQ5OCIsImEiOiJjazhodWprNW8wM2w0M2RxemRva2tybjhpIn0.h8tRVAkZqkvhSSnD3uEPUw'
//       }
//       latitute={37}
//       longitute={20}
//       zoom={8}
//     >
//       <Marker latitute={37} longitute={20} offsetLeft={-20} offsetTop={-10}>
//         <div>You are here</div>
//       </Marker>
//     </ReactMapGL>
//   );
// };
// //   const mapContainer = useRef(null);

// //   useEffect(() => {
// //     var map = new mapboxgl.Map({
// //       container: mapContainer.current,
// //       style: 'mapbox://styles/marius2498/ck8hvn8kd0j2u1inysr21rkpr',
// //       scrollZoom: false
// //     });

// //     const bounds = new mapboxgl.LngLatBounds();

// //     props.tour.locations.forEach(loc => {
// //       let el = document.createElement('img');
// //       el.className = 'marker';

// //       // el.style.backgroundImage = `url(${Marker})`;

// //       new mapboxgl.Marker({
// //         element: el,
// //         anchor: 'bottom'
// //       })
// //         .setLngLat(loc.coordinates)
// //         .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>here</h3>`))
// //         .addTo(map);

// //       bounds.extend(loc.coordinates);
// //     });

// //     map.fitBounds(bounds);
// //   }, []);

// //   if (!props.tour) return <LoadingSpinner />;

// //   return (
// //     <div className="map__container">
// //       <div className="map" ref={mapContainer}></div>
// //     </div>
// //   );
// // };

import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import Pin from './assets/pin.png';
import './Map.css';

const Map = (props) => {
  const [viewport, setViewport] = useState({
    width: '100%',
    height: 500,
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });
  const locIds = [];

  props.tour.locations.forEach((loc) => {
    locIds.push({ id: loc._id, showPopup: true });
  });

  const [popup, setPopup] = useState(locIds);

  useEffect(() => {
    setViewport((prevState) => {
      return {
        ...prevState,
        latitude: props.tour.startLocation.coordinates[1],
        longitude: props.tour.startLocation.coordinates[0],
      };
    });
  }, []);

  const loadDayMarkers = () => {
    return props.tour.locations.map((loc) => {
      return (
        <Marker
          key={loc.coordinates}
          latitude={parseFloat(loc.coordinates[1])}
          longitude={parseFloat(loc.coordinates[0])}
        >
          <img
            onClick={() => {
              setPopup((prevPopup) => {
                let updatedPopup = [...prevPopup];
                const index = updatedPopup.findIndex((el) => el.id === loc._id);

                updatedPopup[index] = {
                  id: loc._id,
                  showPopup: !updatedPopup[index].showPopup,
                };

                return updatedPopup;
              });
            }}
            className="marker"
            src={Pin}
          />
          {popup.find((el) => el.id === loc._id).showPopup && (
            <div className="popup">
              <span className="description">
                Day: {loc.day}: {loc.description}
              </span>
            </div>
          )}
        </Marker>
      );
    });
  };

  console.log(navigator)

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
