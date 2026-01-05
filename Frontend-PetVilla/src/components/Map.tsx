import React from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";

interface PetVillaMapProps {
  className?: string;
}

const PetVillaMap: React.FC<PetVillaMapProps> = ({
  className = "w-full h-96",
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gray-100 rounded-lg`}
      >
        <p className="text-gray-500">Google Maps API key no configurada</p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        className={className}
        defaultCenter={{ lat: -34.397, lng: 150.644 }} // Sydney como ejemplo
        defaultZoom={10}
        gestureHandling={"greedy"}
        disableDefaultUI={false}
      />
    </APIProvider>
  );
};

export default PetVillaMap;
