import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface MapViewProps {
  searchTerm: string;
}

const MapView: React.FC<MapViewProps> = ({ searchTerm }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapInstanceRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/sameer-bagde/cm00rbx5s006c01qt6kb2704o', 
      center: [79.036844, 21.464237],
      zoom: 4,
      projection: 'equirectangular',
    });

    return () => {
      mapInstanceRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (searchTerm) {
      // Example logic for handling the search term and updating the map view
      // Replace with actual geocoding or search logic
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchTerm)}.json?access_token=${mapboxgl.accessToken}`)
        .then(response => response.json())
        .then(data => {
          if (data.features.length > 0) {
            const [longitude, latitude] = data.features[0].geometry.coordinates;
            mapInstanceRef.current?.flyTo({
              center: [longitude, latitude],
              zoom: 12,
            });
          }
        });
    }
  }, [searchTerm]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0,
      }}
    />
  );
};

export default MapView;
