import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const graphhopperKey = "6938c1a9-4599-466e-9be6-38541a31ba8b";
const tomtomKey = "eBXfQnGsEtybJGPcFdG1VKTSBk8LCqIE";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const FlyTo = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 14);
  },[position, map]);
  return null;
};

const nominatimGeocode = async (query) => {
  const res = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: { q: query, format: "json", limit: 1 },
  });

  if (res.data.length > 0) {
    const { lat, lon } = res.data[0];
    return { lat: parseFloat(lat), lng: parseFloat(lon) };
  }
  return null;
};

const Search= () => {
  const [startQuery, setStartQuery] = useState("");
  const [endQuery, setEndQuery] = useState("");
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [route, setRoute] = useState([]);
  const [vehicle, setVehicle] = useState("car");
  const [routePref, setRoutePref] = useState("fastest");
  const [trafficTilesUrl, setTrafficTilesUrl] = useState("");
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(14);

  const mapRef = useRef(); // New ref to store map instance

  const handleSubmit = async () => {
    const start = await nominatimGeocode(startQuery);
    const end = await nominatimGeocode(endQuery);
    if (!start || !end) return alert("Failed to geocode addresses.");

    setStartPoint(start);
    setEndPoint(end);

    let weighting = routePref === "shortest" ? "shortest" : "fastest";
    let params = `point=${start.lat},${start.lng}&point=${end.lat},${end.lng}&vehicle=${vehicle}&locale=en&weighting=${weighting}&calc_points=true&points_encoded=false&key=${graphhopperKey}`;

    try {
      const url = `https://graphhopper.com/api/1/route?${params}`;
      const res = await axios.get(url);
      const path = res.data.paths[0];
      const coords = path.points.coordinates.map(([lng, lat]) => [lat, lng]);
      setRoute(coords);
      setDistance((path.distance / 1000).toFixed(2));
      setDuration((path.time / 60000).toFixed(1));

      if (routePref === "least_traffic" && mapRef.current) {
        const center = mapRef.current.getCenter();
        const z = zoomLevel;
        const x = Math.floor(((center.lng + 180) / 360) * Math.pow(2, z));
        const y = Math.floor(
          (1 -
            Math.log(
              Math.tan((center.lat * Math.PI) / 180) +
              1 / Math.cos((center.lat * Math.PI) / 180)
            ) /
            Math.PI) /
          2 *
          Math.pow(2, z)
        );
        setTrafficTilesUrl(
          `https://api.tomtom.com/traffic/map/4/tile/flow/relative0/${z}/${x}/${y}.png?key=${tomtomKey}`
        );
      } else {
        setTrafficTilesUrl("");
      }
    } catch (err) {
      console.error("Routing error:", err);
      alert("Error fetching route.");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (routePref === "least_traffic" && trafficTilesUrl) {
        setTrafficTilesUrl((prevUrl) => `${prevUrl.split("&refresh")[0]}&refresh=${new Date().getTime()}`);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [routePref, trafficTilesUrl]);

  return (
  <>    <div
        style={{
          padding: "1rem",
          background: "white",
          zIndex: 1000,
          position: "absolute",
          top: 50,
          right: 10,
          borderRadius: 8,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          maxWidth: 300,
        }}
      >
        <input
          placeholder="Start location"
          value={startQuery}
          onChange={(e) => setStartQuery(e.target.value)}
          style={{ marginBottom: "0.5rem", padding: "0.5rem", width: "100%" }}
        />
        <input
          placeholder="End location"
          value={endQuery}
          onChange={(e) => setEndQuery(e.target.value)}
          style={{ marginBottom: "0.5rem", padding: "0.5rem", width: "100%" }}
        />

        <select
          value={vehicle}
          onChange={(e) => setVehicle(e.target.value)}
          style={{ marginBottom: "0.5rem", padding: "0.5rem", width: "100%" }}
        >
          <option value="car">Car</option>
          <option value="bike">Bike</option>
          <option value="foot">Walking</option>
        </select>

        <select
          value={routePref}
          onChange={(e) => setRoutePref(e.target.value)}
          style={{ marginBottom: "0.5rem", padding: "0.5rem", width: "100%" }}
        >
          <option value="fastest">Minimum Time</option>
          <option value="shortest">Minimum Distance</option>
          <option value="least_traffic">Least Traffic (Overlay)</option>
        </select>

        <button
          onClick={handleSubmit}
          style={{
            padding: "0.5rem",
            width: "100%",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Submit
        </button>

        {distance && duration && (
          <div style={{ marginTop: "0.5rem" }}>
            <strong>Distance:</strong> {distance} km<br />
            <strong>Time:</strong> {duration} min
          </div>
        )}
      </div>

      <MapContainer
        center={[28.6139, 77.209]}
        zoom={zoomLevel}
        style={{ height: "100vh", width: "100%" }}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
          mapInstance.on("zoomend", () => setZoomLevel(mapInstance.getZoom()));
        }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {trafficTilesUrl && <TileLayer url={trafficTilesUrl} opacity={0.5} />}
        {startPoint && <Marker position={startPoint} icon={customIcon} />}
        {endPoint && <Marker position={endPoint} icon={customIcon} />}
        {route.length > 0 && <Polyline positions={route} color="blue" />}
        <FlyTo position={startPoint || endPoint} />
      </MapContainer>
    </>
  );
};

export default Search;





