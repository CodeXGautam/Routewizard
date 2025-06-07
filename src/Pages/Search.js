import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import toast from "react-hot-toast";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const FlyTo = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 14);
  }, [position, map]);
  return null;
};

const nominatimGeocode = async (query) => {
  const res = await fetch(`http://localhost:4000/api/geocode?q=${encodeURIComponent(query)}`);
  const data = await res.json();
  if (data.length > 0) {
    const { lat, lon } = data[0];
    return { lat: parseFloat(lat), lng: parseFloat(lon) };
  }
  return null;
};

const nominatimAutocomplete = async (query) => {
  const res = await fetch(`http://localhost:4000/api/autocomplete?q=${encodeURIComponent(query)}`);
  const data = await res.json();
  return data;
};

const fetchRouteFromBackend = async (start, end, vehicle, routePref) => {
  const res = await fetch("http://localhost:4000/api/route", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ start, end, vehicle, routePref }),
  });
  return res.json();
};

const formatDuration = (milliseconds) => {
  let minutes = Math.floor(milliseconds / 60000);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  if (hours < 24) return `${hours} hr ${minutes} min`;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return `${days} day ${remainingHours} hr ${minutes} min`;
};

const Search = (props) => {


  const user = props.user;

  const [startQuery, setStartQuery] = useState("");
  const [endQuery, setEndQuery] = useState("");
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [route, setRoute] = useState([]);
  const [vehicle, setVehicle] = useState("car");
  const [routePref, setRoutePref] = useState("fastest");
  const [trafficTilesUrl, setTrafficTilesUrl] = useState("");
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(12);
  const mapRef = useRef();

  const handleSubmit = async () => {
    const start = await nominatimGeocode(startQuery);
    const end = await nominatimGeocode(endQuery);
    if (!start || !end) return alert("Failed to geocode addresses.");

    setStartPoint(start);
    setEndPoint(end);

    try {
      const data = await fetchRouteFromBackend(start, end, vehicle, routePref);
      const path = data.paths[0];
      const coords = path.points.coordinates.map(([lng, lat]) => [lat, lng]);
      setRoute(coords);
      setDistance((path.distance / 1000).toFixed(2));
      setDuration(formatDuration(path.time));

      if (routePref === "least_traffic" && mapRef.current) {
        const center = mapRef.current.getCenter();
        const z = zoomLevel;
        const x = Math.floor(((center.lng + 180) / 360) * 2 ** z);
        const y = Math.floor(
          (1 -
            Math.log(
              Math.tan((center.lat * Math.PI) / 180) +
                1 / Math.cos((center.lat * Math.PI) / 180)
            ) /
              Math.PI) /
            2 *
            2 ** z
        );
        setTrafficTilesUrl(`http://localhost:4000/api/traffic-tile/${z}/${x}/${y}`);
      } else {
        setTrafficTilesUrl("");
      }

      const saveRes = await fetch("http://localhost:4000/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start: startQuery, end: endQuery, vehicle, routePref , user}),
      });
      const saveData = await saveRes.json();

      if (saveData.message === "All fields are required") {
        toast.error("All fields are required. Please fill in all fields.");
      } else if (saveData.message === "Search history created successfully") {
        console.log("Search history created successfully.");
      } else {
        console.error("Unexpected response:", saveData.message);
      }
    } catch (err) {
      console.error("Routing error:", err);
      alert("Error fetching route.");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (routePref === "least_traffic" && trafficTilesUrl) {
        setTrafficTilesUrl(
          (prevUrl) => `${prevUrl.split("?refresh")[0]}?refresh=${new Date().getTime()}`
        );
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [routePref, trafficTilesUrl]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (startQuery.length > 2) {
        const results = await nominatimAutocomplete(startQuery);
        setStartSuggestions(results);
      } else {
        setStartSuggestions([]);
      }

      if (endQuery.length > 2) {
        const results = await nominatimAutocomplete(endQuery);
        setEndSuggestions(results);
      } else {
        setEndSuggestions([]);
      }
    };

    const timeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeout);
  }, [startQuery, endQuery]);

  return (
    <div className="relative w-[100%] h-screen">
     
      <div className="absolute top-[20px] right-[10px] z-[1000] bg-white p-4 rounded-lg shadow-lg max-w-[300px] min-w-[180px] 
      hidden sm:w-[34%] sm:flex-col sm:flex md:w-[34%] md:flex-col md:flex lg:w-[34%] lg:flex-col lg:flex overflow-y-auto">
        <div>
          <input
            placeholder="Start location"
            value={startQuery}
            onChange={(e) => setStartQuery(e.target.value)}
            className="mb-2 p-2 w-full border border-gray-300 rounded"
          />
          {startSuggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border w-full rounded shadow">
              {startSuggestions.map((s, idx) => (
                <li
                  key={idx}
                  className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    setStartQuery(s.display_name);
                    setStartSuggestions([]);
                  }}
                >
                  {s.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative">
          <input
            placeholder="End location"
            value={endQuery}
            onChange={(e) => setEndQuery(e.target.value)}
            className="mb-2 p-2 w-full border border-gray-300 rounded"
          />
          {endSuggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border w-full rounded shadow">
              {endSuggestions.map((s, idx) => (
                <li
                  key={idx}
                  className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    setEndQuery(s.display_name);
                    setEndSuggestions([]);
                  }}
                >
                  {s.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <select
          value={vehicle}
          onChange={(e) => setVehicle(e.target.value)}
          className="mb-2 p-2 w-full border border-gray-300 rounded"
        >
          <option value="car">Car</option>
          <option value="bike">Bike</option>
          <option value="foot">Walking</option>
        </select>

        <select
          value={routePref}
          onChange={(e) => setRoutePref(e.target.value)}
          className="mb-2 p-2 w-full border border-gray-300 rounded"
        >
          <option value="fastest">Minimum Time</option>
          <option value="shortest">Minimum Distance</option>
          <option value="least_traffic">Least Traffic (Overlay)</option>
        </select>

        <button
          onClick={handleSubmit}
          className="p-2 w-full bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>

        {distance && duration && (
          <div className="mt-2 text-sm">
            <strong>Distance:</strong> {distance} km<br />
            <strong>Time:</strong> {duration}
          </div>
        )}
      </div>
      <MapContainer
        center={[28.6139, 77.209]}
        zoom={zoomLevel}
        className="w-full h-screen"
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
          mapInstance.on("zoomend", () =>
            setZoomLevel(mapInstance.getZoom())
          );
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
    </div>
  );
};

export default Search;
