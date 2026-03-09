"use client";

import { LatLngTuple, DivIcon } from "leaflet";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Polygon,
  TileLayer,
  Tooltip,
  useMap,
  Marker,
  Polyline,
} from "react-leaflet";

const territory: LatLngTuple[] = [
  [23.2599, 77.4126],
  [23.262, 77.418],
  [23.256, 77.418],
];
function LiveLocation({ isRunning }: { isRunning: boolean }) {
  const map = useMap();
  const [runnerIcon, setRunnerIcon] = useState<DivIcon | null>(null);
  const [position, setPosition] = useState<LatLngTuple | null>(null);
  const [runPath, setRunPath] = useState<LatLngTuple[]>([]);

  //Setting up the custom runner icon for the user
  useEffect(() => {
    import("leaflet").then((L) => {
      const icon = L.divIcon({
        html: "🏃",
        className: "",
        iconSize: [30, 30],
      });

      setRunnerIcon(icon);
    });
  }, []);

  //Actual geolocation tracking logic using the browser's Geolocation API
  useEffect(() => {
    //Check if geolocation is available in the browser
    if (!navigator.geolocation) return;

    //Start watching the user's position
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords: LatLngTuple = [pos.coords.latitude, pos.coords.longitude];
        //Update the user's position on the map and center the map on it
        setPosition(coords);
        map.setView(coords, 20, { animate: true });
        //If the user is currently running, add the new position to the run path to draw the route
        if (isRunning) {
          setRunPath((prev) => [...prev, coords]);
        }
      },
      (err) => {
        console.error("Error getting location:", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map]);

  if (!position || !runnerIcon) return null;

  return (
    <>
      <Marker position={position} icon={runnerIcon} />

      {runPath.length > 1 && (
        <Polyline
          positions={runPath}
          pathOptions={{
            color: "#00F5A0",
            weight: 4,
          }}
        />
      )}
    </>
  );
}

export default function TerritoryMap({ isRunning }: { isRunning: boolean }) {
  return (
    <div className="w-full h-100 rounded-xl overflow-hidden">
      <MapContainer
        center={[23.2599, 77.4126]}
        zoom={15}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LiveLocation isRunning={isRunning} />

        <Polygon
          positions={territory}
          pathOptions={{
            color: "#00F5A0",
            fillColor: "#00F5A0",
            fillOpacity: 0.35,
            weight: 3,
          }}
        >
          <Tooltip>
            <p className="font-bold">Your Territory</p>
          </Tooltip>
        </Polygon>
      </MapContainer>
    </div>
  );
}
