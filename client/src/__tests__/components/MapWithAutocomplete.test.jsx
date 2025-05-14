import React from "react";
import { render, screen } from "@testing-library/react";
import MapWithAutocomplete from "../../components/MapWithAutocomplete";

jest.mock("@react-google-maps/api", () => ({
  LoadScript: ({ children }) => <div>{children}</div>,
  GoogleMap: ({ children }) => <div data-testid="google-map">{children}</div>,
  Marker: () => <div data-testid="marker" />,
  Autocomplete: ({ children }) => <div>{children}</div>,
  DirectionsRenderer: () => <div data-testid="directions-renderer" />
}));

jest.mock("../../hooks/useMap", () => () => ({
  map: {},
  setMap: jest.fn(),
  center: { lat: 0, lng: 0 },
  setCenter: jest.fn(),
  searchBox: {},
  setSearchBox: jest.fn(),
  mapSize: { width: "100%", height: "100%" },
  selectedPlace: null,
  setSelectedPlace: jest.fn(),
}));

jest.mock("../../hooks/useMapControls", () => () => ({
  type: "veterinary_care",
  setType: jest.fn(),
  markers: [],
  setMarkers: jest.fn(),
  allMarkers: [],
  setAllMarkers: jest.fn(),
  hoveredIndex: null,
  setHoveredIndex: jest.fn(),
}));

jest.mock("../../hooks/useSearch", () => () => ({
  fetchPlaces: jest.fn(),
  handleRefetchSearch: jest.fn(),
  handlePlaceChanged: jest.fn(),
  deleteRecentSearch: jest.fn(),
  refreshRecentSearches: jest.fn(),
}));

jest.mock("../../hooks/useDirections", () => () => ({
  directionsRaw: null,
  directionsParsed: null,
  setDirectionsParsed: jest.fn(),
  stepMarkers: [],
  setStepMarkers: jest.fn(),
  hoveredStep: null,
  setHoveredStep: jest.fn(),
  clearDirections: jest.fn(),
  setDirectionsRaw: jest.fn(),
  getDirections: jest.fn(),
}));

jest.mock("../../hooks/useUserLocationStorage", () => () => ({
  lastSearch: "",
  setLastSearch: jest.fn(),
  recentSearches: [],
  setRecentSearches: jest.fn(),
}));

test("renders MapWithAutocomplete component with map and sidebar", () => {
    render(<MapWithAutocomplete />);
  
    expect(screen.getByTestId("google-map")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter a location")).toBeInTheDocument();
    expect(screen.getByText("Recent Searches")).toBeInTheDocument();
  });
  
