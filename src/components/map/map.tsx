import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./map.scss"
import L from "leaflet";

interface MapProps {
  latitude: number; // Latitude de l'adresse
  longitude: number; // Longitude de l'adresse
  address: string; // Adresse complète
}

// Icône personnalisée pour le marqueur
const markerIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const Map: React.FC<MapProps> = ({ latitude, longitude, address }) => {
    return (
        <MapContainer
        className="map-container"
          center={[latitude, longitude]}
          zoom={15}
          style={{ width: "100%", height: "400px", borderRadius: "10px" }} // Hauteur augmentée
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[latitude, longitude]} icon={markerIcon}>
            <Popup>
              <div>
                {address}
                <br />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "red", textDecoration: "underline" }}
                >
                  Ouvrir dans Google Maps
                </a>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      );
    };      

export default Map;
