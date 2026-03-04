"use client";

import { LatLngTuple } from "leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Polygon, TileLayer, Tooltip, useMap, Marker } from "react-leaflet";

const territory: LatLngTuple[] = [
  [23.2599, 77.4126],
  [23.262, 77.418],
  [23.256, 77.418],
];
const runnerIcon = L.divIcon({
  html: '<div class="runner-marker">🏃</div>',
  iconSize: [30, 30],
  className: "",
});

function LiveLocation(){
    const map = useMap();
    const [position, setPosition] = useState<LatLngTuple | null>(null);

    useEffect(()=>{
        if(!navigator.geolocation){
            return ;
        }

        const watchId = navigator.geolocation.watchPosition((pos)=>{
            const coords: LatLngTuple = [pos.coords.latitude, pos.coords.longitude];
            setPosition(coords);
            map.setView(coords);
        },
        (err)=>{
            console.error("Error getting location: ", err);
        },
        {enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 5000
        });

        return ()=>{
            navigator.geolocation.clearWatch(watchId);
        }   
},[map])
if (!position) return null;

  return (
  <Marker position={position} icon={runnerIcon} />
);
}


export default function TerritoryMap() {
  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden">
      <MapContainer
        center={[23.2599, 77.4126]} // Bhopal
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LiveLocation />
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
