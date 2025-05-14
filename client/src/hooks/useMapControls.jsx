import { useState, useEffect } from "react";

const useMapControls = () => {
  const [type, setType] = useState("veterinary_care");
  const [markers, setMarkers] = useState([]);
  const [allMarkers, setAllMarkers] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return {
    type,
    setType,
    markers,
    setMarkers,
    allMarkers,
    setAllMarkers,
    hoveredIndex,
    setHoveredIndex,
  };
};

export default useMapControls;
