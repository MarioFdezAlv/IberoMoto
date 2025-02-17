import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Mapa = () => {
  return (
    <div style={{ width: "100%", height: "96vh" }}>
      <MapContainer
        center={[40.0, -4.0]} // Centro de la Península Ibérica
        zoom={6}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
      </MapContainer>
    </div>
  );
};

export default Mapa;
