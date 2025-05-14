import React, { useState, useEffect, useRef } from "react";
import {
  LoadScript,
  GoogleMap,
  Autocomplete,
  DirectionsRenderer,
  Marker,
  MarkerClusterer,
  InfoWindow,
} from "@react-google-maps/api";
import Navbar from "./Navbar";
import Footer from "./Footer";

import MapCentering from "./MapCentering";
import ResultsList from "./ResultsList";
import RecentSearches from "./RecentSearches";
import CategoryTabs from "./CategoryTabs";

import useMap from "../hooks/useMap";
import useMapControl from "../hooks/useMapControls";
import useSearch from "../hooks/useSearch";
import useDirections from "../hooks/useDirections";
import useUserLocation from "../hooks/useUserLocationStorage";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const libraries = ["places"];
const CLUSTER_ZOOM_THRESHOLD = 15;

const MapWithAutocomplete = () => {
  // --- Map hooks ---
  const {
    map,
    setMap,
    center,
    setCenter,
    searchBox,
    setSearchBox,
    selectedPlace,
    setSelectedPlace,
  } = useMap();

  const {
    type,
    setType,
    markers,
    setMarkers,
    allMarkers,
    setAllMarkers,
    hoveredIndex,
    setHoveredIndex,
  } = useMapControl();

  const {
    lastSearch,
    setLastSearch,
    recentSearches,
    setRecentSearches,
  } = useUserLocation();

  const {
    fetchPlaces,
    handleRefetchSearch,
    handlePlaceChanged,
    deleteRecentSearch,
    refreshRecentSearches,
    loading,
  } = useSearch(
    setMarkers,
    setAllMarkers,
    type,
    setLastSearch,
    setRecentSearches,
    setCenter
  );

  const {
    directionsRaw,
    directionsParsed,
    stepMarkers,
    clearDirections,
    getDirections,
  } = useDirections(setMarkers, allMarkers, setRecentSearches);

  // --- Local UI state ---
  const [activeStepIndex, setActiveStepIndex] = useState(null);
  const [activeResultIndex, setActiveResultIndex] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [zoom, setZoom] = useState(12);

  // ref for the search input
  const searchInputRef = useRef(null);
  // **NEW** ref for the right panel so it can be focused/glow
  const rightPanelRef = useRef(null);

  // --- Navbar handlers ---
  const handleNavSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleNavMap = () => {
    if (map && center) {
      map.panTo(center);
      // **NEW** focus the right panel to trigger its focus ring
      if (rightPanelRef.current) {
        rightPanelRef.current.focus();
      }
    }
  };

  // ← clears markers, routes, and selection
  const handleNavClear = () => {
    // 1️⃣ Remove all fetched markers
    setMarkers([]);
    // 2️⃣ Clear current route
    clearDirections();
    // 3️⃣ Reset active indices
    setActiveStepIndex(null);
    setActiveResultIndex(null);
    // 4️⃣ Deselect any place
    setSelectedPlace(null);
  };

  // Only shows places that have ratings
  const ratedMarkers = markers.filter((place) => place.rating != null);

  // Track map zoom
  const handleMapLoad = (mapInstance) => {
    setMap(mapInstance);
    setZoom(mapInstance.getZoom());
    mapInstance.addListener("zoom_changed", () =>
      setZoom(mapInstance.getZoom())
    );
  };

  const fetchPlaceDetails = (placeId, location, index) => {
    const svc = new window.google.maps.places.PlacesService(map);
    svc.getDetails(
      { placeId, fields: ["name","geometry","vicinity","formatted_phone_number","rating","opening_hours"] },
      (result, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setSelectedPlace(result);
          setCenter(location);
          setActiveResultIndex(index);
        }
      }
    );
  };

  // Hover handler for results list
  const handleResultHover = (index) => setHoveredIndex(index);

  // Click handler for route steps
  const handleStepClick = (index) => {
    const step = stepMarkers[index];
    if (step) {
      const loc = { lat: step.lat, lng: step.lng };
      setCenter(loc);
      map.panTo(loc);
      map.setZoom(15);
      setActiveStepIndex(index);
    }
  };

  // Clear the active route (used in ResultsList)
  const handleClearRoute = () => {
    clearDirections(() => setMarkers(allMarkers));
    setActiveStepIndex(null);
    setActiveResultIndex(null);
  };

  // Derives the origin & destination points for the route
  const routeLeg = directionsRaw?.routes?.[0]?.legs?.[0];
  const routeOrigin = routeLeg?.start_location;
  const routeDestination = routeLeg?.end_location;

  return (
    <>
      {/* Navbar  */}
      <Navbar
        onSearch={handleNavSearch}
        onMap={handleNavMap}
        onClear={handleNavClear}
      />

      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}>
        <div className="mt-16 flex flex-col h-[calc(100vh-4rem)] w-full bg-gradient-to-br from-green-300 via-yellow-300 to-orange-400 p-8">
          <div className="flex flex-grow justify-center items-start gap-6">

            {/* Left Panel */}
            <div className="w-[48%] h-[75vh] bg-white p-6 rounded-2xl shadow-lg flex flex-col relative">
              <RecentSearches
                searches={recentSearches}
                onRefetch={refreshRecentSearches}
                onDelete={deleteRecentSearch}
                onRevisit={(orig, dest) => getDirections(orig, dest, type)}
              />

              <div className="border-t border-gray-300 my-4" />

              <ResultsList
                markers={ratedMarkers}
                loading={loading}
                lastSearch={lastSearch}
                onGetDirections={(orig, dest) =>
                  getDirections(orig, dest, type)
                }
                onResultSelect={(place, idx) =>
                  fetchPlaceDetails(place.place_id, place.geometry.location, idx)
                }
                onResultHover={handleResultHover}
                hoveredIndex={hoveredIndex}
                activeResultIndex={activeResultIndex}
                setActiveResultIndex={setActiveResultIndex}
                directionsParsed={directionsParsed}
                onStepHover={handleStepClick}
                activeStepIndex={activeStepIndex}
                onStepClick={handleStepClick}
                clearParsedDirections={handleClearRoute}
              />
            </div>

            {/* Right Panel */}
            <div
              ref={rightPanelRef}                      // **NEW** attach ref
              tabIndex={0}                             // **NEW** make focusable
              className="
                w-[48%] h-[75vh] bg-white p-6 rounded-2xl shadow-lg flex flex-col relative
                focus:outline-none focus:ring-4 focus:ring-green-400 transition
              "
            >
              <Autocomplete
                onLoad={setSearchBox}
                onPlaceChanged={() => handlePlaceChanged(searchBox)}
              >
                <input
                  ref={searchInputRef}  // ← attach the ref for Search
                  type="text"
                  placeholder="Enter a location"
                  className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                />
              </Autocomplete>

              <div className="flex justify-center mt-3">
                <CategoryTabs
                  categories={[
                    { label: "Veterinary Care", value: "veterinary_care" },
                    { label: "Pet Store", value: "pet_store" },
                    { label: "Dog Park", value: "dog_park" },
                  ]}
                  selectedCategory={type}
                  onSelect={setType}
                />
              </div>

              <div className="flex-grow rounded-xl overflow-hidden shadow-lg border border-gray-300 mt-4 relative focus-within:ring-4 focus-within:ring-green-200 outline-none">
                <GoogleMap
                  center={center}
                  zoom={zoom}
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  onLoad={handleMapLoad}
                >
                  <MapCentering center={center} />

                   {/* Clustered markers (zoom < threshold) */}
                {!directionsRaw && zoom < CLUSTER_ZOOM_THRESHOLD && (
                  <MarkerClusterer options={{ minimumClusterSize: 2 }}>
                    {(clusterer) =>
                      ratedMarkers.map((place, idx) => (
                        <Marker
                          key={place.place_id || idx}
                          position={place.geometry.location}
                          clusterer={clusterer}
                          label={`${idx + 1}`}
                          onMouseOver={() => setHoveredIndex(idx)}
                          onMouseOut={() => setHoveredIndex(null)}      
                          onClick={() =>
                            fetchPlaceDetails(
                              place.place_id,
                              place.geometry.location,
                              idx
                            )
                          }
                        />
                      ))
                    }
                  </MarkerClusterer>
                )}

                {/* Individual markers (zoom ≥ threshold) */}
                {!directionsRaw &&
                  zoom >= CLUSTER_ZOOM_THRESHOLD &&
                  ratedMarkers.map((place, idx) => (
                    <Marker
                      key={place.place_id || idx}
                      position={place.geometry.location}
                      label={`${idx + 1}`}
                      onMouseOver={() => setHoveredIndex(idx)}
                      onMouseOut={() => setHoveredIndex(null)}      
                      onClick={() =>
                        fetchPlaceDetails(
                          place.place_id,
                          place.geometry.location,
                          idx
                        )
                      }
                    />
                  ))}

                  {/* InfoWindow for selectedPlace */}
                  {selectedPlace?.geometry?.location && (
                    <InfoWindow
                      position={selectedPlace.geometry.location}
                      onCloseClick={() => setSelectedPlace(null)}
                    >
                      <div className="p-2">
                        <strong>{selectedPlace.name}</strong>
                        {selectedPlace.formatted_phone_number && (
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>Phone:</strong>{" "}
                            {selectedPlace.formatted_phone_number}
                          </p>
                        )}
                        {selectedPlace.rating && (
                          <p className="text-sm text-yellow-600 mt-1">
                            <strong>Rating:</strong> {selectedPlace.rating} ⭐
                          </p>
                        )}
                        {selectedPlace.vicinity && (
                          <p className="text-sm text-gray-600">
                            {selectedPlace.vicinity}
                          </p>
                        )}
                      </div>
                    </InfoWindow>
                  )}

                  {/* Route origin & destination markers */}
                  {directionsRaw && (
                    <>
                      {routeOrigin && (
                        <Marker position={routeOrigin} label="A" />
                      )}
                      {routeDestination && (
                        <Marker position={routeDestination} label="B" />
                      )}
                      <DirectionsRenderer
                        directions={directionsRaw}
                        options={{ suppressMarkers: true }}
                      />
                    </>
                  )}

                  {/* Step markers */}
                  {stepMarkers.map((step, idx) => (
                    <Marker
                      key={`step-${idx}`}
                      position={{ lat: step.lat, lng: step.lng }}
                      label={`${idx + 1}`}
                      onClick={() => handleStepClick(idx)}
                    />
                  ))}
                </GoogleMap>
              </div>
            </div>
          </div>
        </div>
      </LoadScript>
      <Footer />
    </>
  );
};

export default MapWithAutocomplete;
