import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const ChangeMapView = ({ coords }) => {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.setView(coords); // This will update the center of the map
    }
  }, [coords, map]);

  return null;
};

const Map = ({ city }) => {
  // const [data, setData] = useState([]);
  const [position, setPosition] = useState([51.5072, -0.1276]); // default to London

  useEffect(() => {
    const fetchData = async () => {
      const url = 'https://geocode.maps.co/search?';
      const apiKey = '67f54d4946420224742584krhcd6abb';
      const api_url = `${url}q=${city}&api_key=${apiKey}`;

      try {
        const response = await fetch(api_url);
        const result = await response.json();
        console.log(result);

        if (result && result.length > 0) {
          const lat = parseFloat(result[0].lat);
          const lon = parseFloat(result[0].lon);
          // setData(result);
          setPosition([lat, lon]);
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    if (city) {
      fetchData();
    }
  }, [city]);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <ChangeMapView coords={position} /> {/* This will center the map on the new position */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            You searched: {city}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
