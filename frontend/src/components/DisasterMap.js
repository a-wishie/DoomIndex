import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L from 'leaflet';

// Map Component
const DisasterMap = ({ country, geoJsonData }) => {
    const [mapCenter, setMapCenter] = useState([0, 0]);
    const [zoom] = useState(4);
  
    useEffect(() => {
      if (geoJsonData) {
        try {
          const bounds = L.geoJSON(geoJsonData).getBounds();
          setMapCenter([
            (bounds.getNorth() + bounds.getSouth()) / 2,
            (bounds.getEast() + bounds.getWest()) / 2
          ]);
        } catch (error) {
          console.error('Error processing GeoJSON:', error);
          setMapCenter([0, 0]);
        }
      }
    }, [geoJsonData]);
  
    return (
      <Card sx={{ height: '100%', p: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Impact Map</Typography>
          <div style={{ height: '400px', width: '100%' }}>
            <MapContainer
              center={mapCenter}
              zoom={zoom}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              {geoJsonData && (
                <GeoJSON
                  data={geoJsonData}
                  style={{
                    fillColor: '#ef233c',
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    fillOpacity: 0.7
                  }}
                />
              )}
            </MapContainer>
          </div>
        </CardContent>
      </Card>
    );
  };
export default DisasterMap;