import React from "react";
import { Marker } from "@react-google-maps/api";

const MapCentering = ({ center }) => {
  return (
    <Marker position={center} />
  );
};

export default MapCentering;