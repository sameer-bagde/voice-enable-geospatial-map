import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface MapViewProps {
  searchTerm: string;
}

const MapView: React.FC<MapViewProps> = ({ searchTerm }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapInstanceRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/sameer-bagde/cm00rbx5s006c01qt6kb2704o', 
      center: [79.036844, 21.464237],
      zoom: 4,
      projection: 'globe',
    });

    return () => {
      mapInstanceRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setError(null); // Reset error message

      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchTerm)}.json?access_token=${mapboxgl.accessToken}`)
        .then(response => response.json())
        .then(data => {
          if (data.features.length > 0) {
            const [longitude, latitude] = data.features[0].geometry.coordinates;
            mapInstanceRef.current?.flyTo({
              center: [longitude, latitude],
              zoom: 12,
            });
          } else {
            setError(`Location not found: ${searchTerm}`);
          }
        })
        .catch(() => {
          setError(`Error during geocoding for location: ${searchTerm}`);
        });
    }
  }, [searchTerm]);

  return (
    <div>
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
      {error && (
        <div
          style={{
            position: 'fixed',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 0, 0, 0.75)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
            color: '#FFF',
            textAlign: 'center',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default MapView;
