import React, { useState } from 'react';
import axios from 'axios';
import MapWithAutocomplete from '../components/MapWithAutocomplete';

function PetResources() {
  const [type, setType] = useState('veterinary_care');
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async (location) => {
    if (!location) return;

    try {
      const response = await axios.get('/api/places', {
        params: {
          location,
          type,
          radius: 5000,
        },
      });

      setPlaces(response.data.results || []);
    } catch (error) {
      console.error('Error fetching places:', error);
      setError('Failed to fetch places. Please try again.');
    }
  };

  return (
      <MapWithAutocomplete onSearch={handleSearch} places={places} />
  );
}

export default PetResources;
