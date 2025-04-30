// import React, { useState, useEffect } from "react";
// import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from "react-leaflet";
// import axios from "axios";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// const graphhopperKey = "6938c1a9-4599-466e-9be6-38541a31ba8b";
// const tomtomKey = "frmw852om9p5lntJtIxJGl7Ii18IM8gf";

// const customIcon = new L.Icon({
//   iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// const ClickHandler = ({ setPoints }) => {
//   useMapEvents({
//     click(e) {
//       setPoints((prev) => (prev.length < 2 ? [...prev, e.latlng] : []));
//     },
//   });
//   return null;
// };

// const App = () => {
//   const [points, setPoints] = useState([]);
//   const [route, setRoute] = useState([]);
//   const [trafficTilesUrl, setTrafficTilesUrl] = useState("");

//   useEffect(() => {
//     if (points.length === 2) {
//       const getRoute = async () => {
//         const url = `https://graphhopper.com/api/1/route?point=${points[0].lat},${points[0].lng}&point=${points[1].lat},${points[1].lng}&vehicle=car&locale=en&calc_points=true&key=${graphhopperKey}&points_encoded=false`;

//         const res = await axios.get(url);
//         const coords = res.data.paths[0].points.coordinates.map(([lng, lat]) => [lat, lng]);
//         setRoute(coords);
//       };

//       getRoute();

//       // TomTom Traffic Flow Tiles (for overlay)
//       const z = 14;
//       const x = Math.floor((points[0].lng + 180) / 360 * Math.pow(2, z));
//       const y = Math.floor(
//         (1 - Math.log(Math.tan(points[0].lat * Math.PI / 180) + 1 / Math.cos(points[0].lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, z)
//       );
//       setTrafficTilesUrl(
//         `https://api.tomtom.com/traffic/map/4/tile/flow/relative0/${z}/${x}/${y}.png?key=${tomtomKey}`
//       );
//     }
//   }, [points]);

//   return (
//     <MapContainer center={[28.6139, 77.2090]} zoom={13} style={{ height: "100vh", width: "100%" }}>
//       {/* Base Map */}
//       <TileLayer
//         attribution='&copy; OpenStreetMap contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />

//       {/* Traffic overlay */}
//       {trafficTilesUrl && (
//         <TileLayer
//           url={`https://api.tomtom.com/traffic/map/4/tile/flow/relative0/{z}/{x}/{y}.png?key=${tomtomKey}`}
//           opacity={0.5}
//         />
//       )}

//       <ClickHandler setPoints={setPoints} />

//       {/* Markers */}
//       {points.map((pt, idx) => (
//         <Marker key={idx} position={pt} icon={customIcon} />
//       ))}

//       {/* Route */}
//       {route.length > 0 && <Polyline positions={route} color="blue" />}
//     </MapContainer>
//   );
// };

// export default App;


// import React, { useState, useEffect } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Polyline,
//   useMap,
// } from "react-leaflet";
// import axios from "axios";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// // Replace with your API keys
// const graphhopperKey = "6938c1a9-4599-466e-9be6-38541a31ba8b";
// const tomtomKey = "eBXfQnGsEtybJGPcFdG1VKTSBk8LCqIE";

// const customIcon = new L.Icon({
//   iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// const FlyTo = ({ position }) => {
//   const map = useMap();
//   useEffect(() => {
//     if (position) {
//       map.flyTo(position, 14);
//     }
//   }, [position]);
//   return null;
// };

// // Geocoding using OpenStreetMap Nominatim
// const nominatimGeocode = async (query) => {
//   const res = await axios.get("https://nominatim.openstreetmap.org/search", {
//     params: {
//       q: query,
//       format: "json",
//       limit: 1,
//     },
//   });

//   if (res.data.length > 0) {
//     const { lat, lon } = res.data[0];
//     return { lat: parseFloat(lat), lng: parseFloat(lon) };
//   }

//   return null;
// };

// const App = () => {
//   const [startQuery, setStartQuery] = useState("");
//   const [endQuery, setEndQuery] = useState("");
//   const [startPoint, setStartPoint] = useState(null);
//   const [endPoint, setEndPoint] = useState(null);
//   const [route, setRoute] = useState([]);
//   const [trafficTilesUrl, setTrafficTilesUrl] = useState("");

//   const geocodeAndSet = async (query, setter) => {
//     const point = await nominatimGeocode(query);
//     if (point) setter(point);
//   };

//   const getRoute = async () => {
//     const url = `https://graphhopper.com/api/1/route?point=${startPoint.lat},${startPoint.lng}&point=${endPoint.lat},${endPoint.lng}&vehicle=car&locale=en&calc_points=true&key=${graphhopperKey}&points_encoded=false`;
//     const res = await axios.get(url);
//     const coords = res.data.paths[0].points.coordinates.map(([lng, lat]) => [
//       lat,
//       lng,
//     ]);
//     setRoute(coords);

//     // Set traffic tile overlay based on start point
//     const z = 14;
//     const x = Math.floor(((startPoint.lng + 180) / 360) * Math.pow(2, z));
//     const y = Math.floor(
//       (1 -
//         Math.log(
//           Math.tan((startPoint.lat * Math.PI) / 180) +
//             1 / Math.cos((startPoint.lat * Math.PI) / 180)
//         ) /
//           Math.PI) /
//         2 *
//         Math.pow(2, z)
//     );
//     setTrafficTilesUrl(
//       `https://api.tomtom.com/traffic/map/4/tile/flow/relative0/${z}/${x}/${y}.png?key=${tomtomKey}`
//     );
//   };

//   useEffect(() => {
//     if (startPoint && endPoint) {
//       getRoute();
//     }
//   }, [startPoint, endPoint]);

//   return (
//     <>
//       {/* Input UI */}
//       <div
//         style={{
//           padding: "1rem",
//           background: "white",
//           zIndex: 1000,
//           position: "absolute",
//           top: 10,
//           left: 10,
//           borderRadius: 8,
//           boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//         }}
//       >
//         <input
//           placeholder="Start location"
//           value={startQuery}
//           onChange={(e) => setStartQuery(e.target.value)}
//           onBlur={() => geocodeAndSet(startQuery, setStartPoint)}
//           style={{
//             marginBottom: "0.5rem",
//             padding: "0.5rem",
//             width: "250px",
//           }}
//         />
//         <br />
//         <input
//           placeholder="End location"
//           value={endQuery}
//           onChange={(e) => setEndQuery(e.target.value)}
//           onBlur={() => geocodeAndSet(endQuery, setEndPoint)}
//           style={{
//             padding: "0.5rem",
//             width: "250px",
//           }}
//         />
//       </div>

//       {/* Map */}
//       <MapContainer
//         center={[28.6139, 77.209]}
//         zoom={13}
//         style={{ height: "100vh", width: "100%" }}
//       >
//         <TileLayer
//           attribution='&copy; OpenStreetMap contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         {trafficTilesUrl && (
//           <TileLayer
//             url={`https://api.tomtom.com/traffic/map/4/tile/flow/relative0/{z}/{x}/{y}.png?key=${tomtomKey}`}
//             opacity={0.5}
//           />
//         )}

//         {startPoint && <Marker position={startPoint} icon={customIcon} />}
//         {endPoint && <Marker position={endPoint} icon={customIcon} />}
//         {route.length > 0 && <Polyline positions={route} color="blue" />}
//         <FlyTo position={startPoint || endPoint} />
//       </MapContainer>
//     </>
//   );
// };

// export default App;


// import React, { useState, useEffect } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Polyline,
//   useMap,
// } from "react-leaflet";
// import axios from "axios";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// const graphhopperKey = "6938c1a9-4599-466e-9be6-38541a31ba8b";
// const tomtomKey = "frmw852om9p5lntJtIxJGl7Ii18IM8gf";

// const customIcon = new L.Icon({
//   iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// const FlyTo = ({ position }) => {
//   const map = useMap();
//   useEffect(() => {
//     if (position) map.flyTo(position, 14);
//   }, [position]);
//   return null;
// };

// const nominatimGeocode = async (query) => {
//   const res = await axios.get("https://nominatim.openstreetmap.org/search", {
//     params: { q: query, format: "json", limit: 1 },
//   });

//   if (res.data.length > 0) {
//     const { lat, lon } = res.data[0];
//     return { lat: parseFloat(lat), lng: parseFloat(lon) };
//   }
//   return null;
// };

// const App = () => {
//   const [startQuery, setStartQuery] = useState("");
//   const [endQuery, setEndQuery] = useState("");
//   const [startPoint, setStartPoint] = useState(null);
//   const [endPoint, setEndPoint] = useState(null);
//   const [route, setRoute] = useState([]);
//   const [trafficTilesUrl, setTrafficTilesUrl] = useState("");
//   const [vehicle, setVehicle] = useState("car");
//   const [distance, setDistance] = useState(null);
//   const [duration, setDuration] = useState(null);

//   const geocodeAndSet = async (query, setter) => {
//     const point = await nominatimGeocode(query);
//     if (point) setter(point);
//   };

//   const getRoute = async () => {
//     const url = `https://graphhopper.com/api/1/route?point=${startPoint.lat},${startPoint.lng}&point=${endPoint.lat},${endPoint.lng}&vehicle=${vehicle}&locale=en&calc_points=true&key=${graphhopperKey}&points_encoded=false`;
//     const res = await axios.get(url);
//     const path = res.data.paths[0];

//     const coords = path.points.coordinates.map(([lng, lat]) => [lat, lng]);
//     setRoute(coords);
//     setDistance((path.distance / 1000).toFixed(2)); // km
//     setDuration((path.time / 60000).toFixed(1)); // minutes

//     // TomTom traffic tile (still centered on startPoint)
//     const z = 14;
//     const x = Math.floor(((startPoint.lng + 180) / 360) * Math.pow(2, z));
//     const y = Math.floor(
//       (1 -
//         Math.log(
//           Math.tan((startPoint.lat * Math.PI) / 180) +
//             1 / Math.cos((startPoint.lat * Math.PI) / 180)
//         ) /
//           Math.PI) /
//         2 *
//         Math.pow(2, z)
//     );
//     setTrafficTilesUrl(
//       `https://api.tomtom.com/traffic/map/4/tile/flow/relative0/${z}/${x}/${y}.png?key=${tomtomKey}`
//     );
//   };

//   useEffect(() => {
//     if (startPoint && endPoint) {
//       getRoute();
//     }
//   }, [startPoint, endPoint, vehicle]);

//   return (
//     <>
//       {/* Inputs UI */}
//       <div
//         style={{
//           padding: "1rem",
//           background: "white",
//           zIndex: 1000,
//           position: "absolute",
//           top: 10,
//           left: 10,
//           borderRadius: 8,
//           boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//           maxWidth: 300,
//         }}
//       >
//         <input
//           placeholder="Start location"
//           value={startQuery}
//           onChange={(e) => setStartQuery(e.target.value)}
//           onBlur={() => geocodeAndSet(startQuery, setStartPoint)}
//           style={{
//             marginBottom: "0.5rem",
//             padding: "0.5rem",
//             width: "100%",
//           }}
//         />
//         <input
//           placeholder="End location"
//           value={endQuery}
//           onChange={(e) => setEndQuery(e.target.value)}
//           onBlur={() => geocodeAndSet(endQuery, setEndPoint)}
//           style={{
//             marginBottom: "0.5rem",
//             padding: "0.5rem",
//             width: "100%",
//           }}
//         />

//         <select
//           value={vehicle}
//           onChange={(e) => setVehicle(e.target.value)}
//           style={{ marginBottom: "0.5rem", padding: "0.5rem", width: "100%" }}
//         >
//           <option value="car">Car</option>
//           <option value="bike">Bike</option>
//           <option value="foot">Walking</option>
//         </select>

//         {distance && duration && (
//           <div style={{ marginTop: "0.5rem" }}>
//             <strong>Distance:</strong> {distance} km<br />
//             <strong>Time:</strong> {duration} min
//           </div>
//         )}
//       </div>

//       {/* Map */}
//       <MapContainer
//         center={[28.6139, 77.209]}
//         zoom={13}
//         style={{ height: "100vh", width: "100%" }}
//       >
//         <TileLayer
//           attribution='&copy; OpenStreetMap contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         {trafficTilesUrl && (
//           <TileLayer
//             url={`https://api.tomtom.com/traffic/map/4/tile/flow/relative0/{z}/{x}/{y}.png?key=${tomtomKey}`}
//             opacity={0.5}
//           />
//         )}

//         {startPoint && <Marker position={startPoint} icon={customIcon} />}
//         {endPoint && <Marker position={endPoint} icon={customIcon} />}
//         {route.length > 0 && <Polyline positions={route} color="blue" />}
//         <FlyTo position={startPoint || endPoint} />
//       </MapContainer>
//     </>
//   );
// };

// export default App;


// import React, { useState } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Polyline,
//   useMap,
// } from "react-leaflet";
// import axios from "axios";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// const graphhopperKey = "28f91957-fe22-487f-89f1-1930e6f984d4";
// const tomtomKey = "frmw852om9p5lntJtIxJGl7Ii18IM8gf";

// const customIcon = new L.Icon({
//   iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// const FlyTo = ({ position }) => {
//   const map = useMap();
//   React.useEffect(() => {
//     if (position) map.flyTo(position, 14);
//   }, [position]);
//   return null;
// };

// const nominatimGeocode = async (query) => {
//   const res = await axios.get("https://nominatim.openstreetmap.org/search", {
//     params: { q: query, format: "json", limit: 1 },
//   });

//   if (res.data.length > 0) {
//     const { lat, lon } = res.data[0];
//     return { lat: parseFloat(lat), lng: parseFloat(lon) };
//   }
//   return null;
// };

// const App = () => {
//   const [startQuery, setStartQuery] = useState("");
//   const [endQuery, setEndQuery] = useState("");
//   const [startPoint, setStartPoint] = useState(null);
//   const [endPoint, setEndPoint] = useState(null);
//   const [route, setRoute] = useState([]);
//   const [vehicle, setVehicle] = useState("car");
//   const [trafficTilesUrl, setTrafficTilesUrl] = useState("");
//   const [distance, setDistance] = useState(null);
//   const [duration, setDuration] = useState(null);

//   const handleSubmit = async () => {
//     // Geocode both addresses
//     const start = await nominatimGeocode(startQuery);
//     const end = await nominatimGeocode(endQuery);

//     if (!start || !end) {
//       alert("Could not geocode both addresses.");
//       return;
//     }

//     setStartPoint(start);
//     setEndPoint(end);

//     // Request route
//     const url = `https://graphhopper.com/api/1/route?point=${start.lat},${start.lng}&point=${end.lat},${end.lng}&vehicle=${vehicle}&locale=en&calc_points=true&key=${graphhopperKey}&points_encoded=false`;
//     const res = await axios.get(url);
//     const path = res.data.paths[0];

//     const coords = path.points.coordinates.map(([lng, lat]) => [lat, lng]);
//     setRoute(coords);
//     setDistance((path.distance / 1000).toFixed(2)); // km
//     setDuration((path.time / 60000).toFixed(1)); // min

//     // Traffic overlay
//     const z = 14;
//     const x = Math.floor(((start.lng + 180) / 360) * Math.pow(2, z));
//     const y = Math.floor(
//       (1 -
//         Math.log(
//           Math.tan((start.lat * Math.PI) / 180) +
//             1 / Math.cos((start.lat * Math.PI) / 180)
//         ) /
//           Math.PI) /
//         2 *
//         Math.pow(2, z)
//     );
//     setTrafficTilesUrl(
//       `https://api.tomtom.com/traffic/map/4/tile/flow/relative0/${z}/${x}/${y}.png?key=${tomtomKey}`
//     );
//   };

//   return (
//     <>
//       {/* Input UI */}
//       <div
//         style={{
//           padding: "1rem",
//           background: "white",
//           zIndex: 1000,
//           position: "absolute",
//           top: 10,
//           left: 10,
//           borderRadius: 8,
//           boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//           maxWidth: 300,
//         }}
//       >
//         <input
//           placeholder="Start location"
//           value={startQuery}
//           onChange={(e) => setStartQuery(e.target.value)}
//           style={{
//             marginBottom: "0.5rem",
//             padding: "0.5rem",
//             width: "100%",
//           }}
//         />
//         <input
//           placeholder="End location"
//           value={endQuery}
//           onChange={(e) => setEndQuery(e.target.value)}
//           style={{
//             marginBottom: "0.5rem",
//             padding: "0.5rem",
//             width: "100%",
//           }}
//         />
//         <select
//           value={vehicle}
//           onChange={(e) => setVehicle(e.target.value)}
//           style={{ marginBottom: "0.5rem", padding: "0.5rem", width: "100%" }}
//         >
//           <option value="car">Car</option>
//           <option value="bike">Bike</option>
//           <option value="foot">Walking</option>
//         </select>

//         <button
//           onClick={handleSubmit}
//           style={{
//             padding: "0.5rem",
//             width: "100%",
//             background: "#007bff",
//             color: "white",
//             border: "none",
//             borderRadius: 4,
//             cursor: "pointer",
//           }}
//         >
//           Submit
//         </button>

//         {distance && duration && (
//           <div style={{ marginTop: "0.5rem" }}>
//             <strong>Distance:</strong> {distance} km<br />
//             <strong>Time:</strong> {duration} min
//           </div>
//         )}
//       </div>

//       {/* Map */}
//       <MapContainer
//         center={[28.6139, 77.209]}
//         zoom={13}
//         style={{ height: "100vh", width: "100%" }}
//       >
//         <TileLayer
//           attribution='&copy; OpenStreetMap contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         {trafficTilesUrl && (
//           <TileLayer
//             url={`https://api.tomtom.com/traffic/map/4/tile/flow/relative0/{z}/{x}/{y}.png?key=${tomtomKey}`}
//             opacity={0.5}
//           />
//         )}

//         {startPoint && <Marker position={startPoint} icon={customIcon} />}
//         {endPoint && <Marker position={endPoint} icon={customIcon} />}
//         {route.length > 0 && <Polyline positions={route} color="blue" />}
//         <FlyTo position={startPoint || endPoint} />
//       </MapContainer>
//     </>
//   );
// };

// export default App;

// App.jsx

// App.jsx
// import React, { useState } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Polyline,
//   useMap,
// } from "react-leaflet";
// import axios from "axios";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// const graphhopperKey = "6938c1a9-4599-466e-9be6-38541a31ba8b";
// const tomtomKey = "eBXfQnGsEtybJGPcFdG1VKTSBk8LCqIE";

// const customIcon = new L.Icon({
//   iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// const FlyTo = ({ position }) => {
//   const map = useMap();
//   React.useEffect(() => {
//     if (position) map.flyTo(position, 14);
//   }, [position]);
//   return null;
// };

// const nominatimGeocode = async (query) => {
//   const res = await axios.get("https://nominatim.openstreetmap.org/search", {
//     params: { q: query, format: "json", limit: 1 },
//   });

//   if (res.data.length > 0) {
//     const { lat, lon } = res.data[0];
//     return { lat: parseFloat(lat), lng: parseFloat(lon) };
//   }
//   return null;
// };

// const App = () => {
//   const [startQuery, setStartQuery] = useState("");
//   const [endQuery, setEndQuery] = useState("");
//   const [startPoint, setStartPoint] = useState(null);
//   const [endPoint, setEndPoint] = useState(null);
//   const [route, setRoute] = useState([]);
//   const [vehicle, setVehicle] = useState("car");
//   const [routePref, setRoutePref] = useState("fastest");
//   const [trafficTilesUrl, setTrafficTilesUrl] = useState("");
//   const [distance, setDistance] = useState(null);
//   const [duration, setDuration] = useState(null);

//   const handleSubmit = async () => {
//     const start = await nominatimGeocode(startQuery);
//     const end = await nominatimGeocode(endQuery);
//     if (!start || !end) return alert("Failed to geocode addresses.");

//     setStartPoint(start);
//     setEndPoint(end);

//     let weighting = "fastest";
//     if (routePref === "shortest") weighting = "shortest";

//     let params = `point=${start.lat},${start.lng}&point=${end.lat},${end.lng}&vehicle=${vehicle}&locale=en&weighting=${weighting}&calc_points=true&points_encoded=false&key=${graphhopperKey}`;

//     const url = `https://graphhopper.com/api/1/route?${params}`;
//     const res = await axios.get(url);
//     const path = res.data.paths[0];
//     const coords = path.points.coordinates.map(([lng, lat]) => [lat, lng]);
//     setRoute(coords);
//     setDistance((path.distance / 1000).toFixed(2));
//     setDuration((path.time / 60000).toFixed(1));

//     const z = 14;
//     const x = Math.floor(((start.lng + 180) / 360) * Math.pow(2, z));
//     const y = Math.floor(
//       (1 -
//         Math.log(
//           Math.tan((start.lat * Math.PI) / 180) +
//             1 / Math.cos((start.lat * Math.PI) / 180)
//         ) /
//           Math.PI) /
//         2 *
//         Math.pow(2, z)
//     );
//     if (routePref === "least_traffic") {
//       setTrafficTilesUrl(
//         `https://api.tomtom.com/traffic/map/4/tile/flow/relative0/${z}/${x}/${y}.png?key=${tomtomKey}`
//       );
//     } else {
//       setTrafficTilesUrl("");
//     }
//   };

//   return (
//     <>
//       <div
//         style={{
//           padding: "1rem",
//           background: "white",
//           zIndex: 1000,
//           position: "absolute",
//           top: 10,
//           left: 10,
//           borderRadius: 8,
//           boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//           maxWidth: 300,
//         }}
//       >
//         <input
//           placeholder="Start location"
//           value={startQuery}
//           onChange={(e) => setStartQuery(e.target.value)}
//           style={{ marginBottom: "0.5rem", padding: "0.5rem", width: "100%" }}
//         />
//         <input
//           placeholder="End location"
//           value={endQuery}
//           onChange={(e) => setEndQuery(e.target.value)}
//           style={{ marginBottom: "0.5rem", padding: "0.5rem", width: "100%" }}
//         />

//         <select
//           value={vehicle}
//           onChange={(e) => setVehicle(e.target.value)}
//           style={{ marginBottom: "0.5rem", padding: "0.5rem", width: "100%" }}
//         >
//           <option value="car">Car</option>
//           <option value="bike">Bike</option>
//           <option value="foot">Walking</option>
//         </select>

//         <select
//           value={routePref}
//           onChange={(e) => setRoutePref(e.target.value)}
//           style={{ marginBottom: "0.5rem", padding: "0.5rem", width: "100%" }}
//         >
//           <option value="fastest">Fastest Time</option>
//           <option value="shortest">Minimum Distance</option>
//           <option value="least_traffic">Least Traffic (Overlay)</option>
//         </select>

//         <button
//           onClick={handleSubmit}
//           style={{
//             padding: "0.5rem",
//             width: "100%",
//             background: "#007bff",
//             color: "white",
//             border: "none",
//             borderRadius: 4,
//             cursor: "pointer",
//           }}
//         >
//           Submit
//         </button>

//         {distance && duration && (
//           <div style={{ marginTop: "0.5rem" }}>
//             <strong>Distance:</strong> {distance} km<br />
//             <strong>Time:</strong> {duration} min
//           </div>
//         )}
//       </div>

//       <MapContainer
//         center={[28.6139, 77.209]}
//         zoom={13}
//         style={{ height: "100vh", width: "100%" }}
//       >
//         <TileLayer
//           attribution='&copy; OpenStreetMap contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         {trafficTilesUrl && <TileLayer url={trafficTilesUrl} opacity={0.5} />}
//         {startPoint && <Marker position={startPoint} icon={customIcon} />}
//         {endPoint && <Marker position={endPoint} icon={customIcon} />}
//         {route.length > 0 && <Polyline positions={route} color="blue" />}
//         <FlyTo position={startPoint || endPoint} />
//       </MapContainer>
//     </>
//   );
// };

// export default App;

// App.jsx
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
  }, [position]);
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





