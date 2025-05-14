import React, { useState } from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const MarkersWithInfo = ({
  markers = [],
  selectedPlace,
  setSelectedPlace,
  setCenter,
  onGetDirections,
  lastSearch,
  category,
  hoveredIndex,
  activeResultIndex,
  setActiveResultIndex,
}) => {
  const [infoPosition, setInfoPosition] = useState(null);

  return (
    <>
      {markers.map((place, index) => {
        const location = place.geometry?.location;
        if (!location) return null;

        const isActive = hoveredIndex === index || activeResultIndex === index;

        return (
          <Marker
            key={place.place_id || index}
            position={location}
            label={{
              text: `${index + 1}`,
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: "bold",
            }}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: isActive ? "#34D399" : "#10B981",
              fillOpacity: 1,
              strokeColor: "#065F46",
              strokeWeight: 1,
              scale: 10,
            }}
            onClick={() => {
              setSelectedPlace(place);
              setCenter(location);
              setActiveResultIndex(index);
              setInfoPosition(location);
            }}
            onMouseOver={() => setActiveResultIndex(index)}
            onMouseOut={() => setActiveResultIndex(null)}
          />
        );
      })}

      {selectedPlace && infoPosition && (
        <InfoWindow
          position={infoPosition}
          onCloseClick={() => setSelectedPlace(null)}
        >
          <div className="p-3 w-60">
            {/* Photo */}
            {selectedPlace.photos?.[0]?.photo_reference ? (
              <img
                src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=150&photoreference=${selectedPlace.photos[0].photo_reference}&key=${GOOGLE_MAPS_API_KEY}`}
                alt={selectedPlace.name}
                className="w-full h-24 object-cover rounded-md mb-2"
              />
            ) : (
              <div className="w-full h-24 bg-gray-200 rounded-md mb-2 animate-pulse"></div>
            )}

            {/* Details */}
            <h5 className="font-semibold text-sm truncate mb-1">{selectedPlace.name}</h5>
            {selectedPlace.formatted_phone_number && (
              <p className="text-xs text-gray-600 mb-1">📞 {selectedPlace.formatted_phone_number}</p>
            )}
            {selectedPlace.rating && (
              <p className="text-xs text-yellow-600 mb-1">⭐ {selectedPlace.rating}</p>
            )}
            <p className="text-xs text-gray-600 truncate mb-2">
              {selectedPlace.vicinity}
            </p>

            {/* Get Directions Button */}
            <button
              onClick={() => {
                onGetDirections(lastSearch, selectedPlace.vicinity, category);
                setSelectedPlace(null);
              }}
              className="w-full py-1 text-xs font-medium text-white rounded-md bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600"
            >
              Get Directions
            </button>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export default MarkersWithInfo;
