import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const WorldMap = () => {
  const center = [0, 0];  // Coordinates for the center of the world
  const zoomLevel = 2;     // Zoom level for global view

  return (
    <div className='w-[100%] h-[100vh] z-[-10]'>
      <MapContainer center={center} zoom={zoomLevel} scrollWheelZoom={false} style={{ height: '100%', width: '100%' ,}} minZoom={2}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    </div>
  );
};

export default WorldMap;
