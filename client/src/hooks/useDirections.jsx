import { useState } from "react";
import axios from "axios";
import { saveSearchQuery, fetchRecentSearches } from "../utils/searchHandler";

const useDirections = (
  setMarkers,
  allMarkers,
  setRecentSearches = () => {}
) => {
  const [directionsRaw, setDirectionsRaw] = useState(null);
  const [directionsParsed, setDirectionsParsed] = useState(null);
  const [stepMarkers, setStepMarkers] = useState([]);
  const [hoveredStep, setHoveredStep] = useState(null);

  const clearDirections = (restoreMarkers = () => {}) => {
    setDirectionsRaw(null);
    setDirectionsParsed(null);
    setStepMarkers([]);
    setHoveredStep(null);
    restoreMarkers();
  };

  const getDirections = async (origin, destination, type = "veterinary_care") => {
    try {
      const geocodeResponse = await axios.get("/api/directions/coordinates", {
        params: { origin, destination },
      });

      const {
        origin: originCoords,
        destination: destinationCoords,
      } = geocodeResponse.data;

      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: originCoords,
          destination: destinationCoords,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        async (result, status) => {
          if (status === "OK") {
            setDirectionsRaw(result);

            const parsed = {
              legs: result.routes[0].legs.map((leg) => ({
                startAddress: leg.start_address,
                endAddress: leg.end_address,
                distance: leg.distance.text,
                duration: leg.duration.text,
                steps: leg.steps.map((step) =>
                  step.instructions.replace(/<[^>]*>/g, "")
                ),
              })),
            };
            setDirectionsParsed(parsed);

            const routeSteps = result.routes[0].legs[0].steps.map((step) => ({
              lat: step.start_location.lat(),
              lng: step.start_location.lng(),
            }));
            setStepMarkers(routeSteps);

            if (setRecentSearches) {
              setRecentSearches(await fetchRecentSearches());
            }

            const location = {
              origin: originCoords,
              destination: destinationCoords,
              string: { from: origin, to: destination },
            };

            await saveSearchQuery(
              type,
              result.routes[0].legs,
              location,
              window.location.href,
              origin,
              destination
            );
          } else {
            console.error("❌ Google Maps routing failed:", status);
          }
        }
      );
    } catch (error) {
      console.error("❌ Error in getDirections:", error);
    }
  };

  return {
    directionsRaw,
    setDirectionsRaw,
    directionsParsed,
    setDirectionsParsed,
    stepMarkers,
    setStepMarkers,
    hoveredStep,
    setHoveredStep,
    clearDirections,
    getDirections, 
  };
};

export default useDirections;
