'use client';

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useState, useCallback } from 'react';

interface LocationPickerProps {
    onLocationChange: (location: { lat: number; lng: number }) => void;
    initialLocation?: { lat: number; lng: number };
}

const defaultCenter = {
    lat: 10.762622, // Ho Chi Minh City
    lng: 106.660172
};

const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.75rem'
};

export function LocationPicker({ onLocationChange, initialLocation }: LocationPickerProps) {
    const [markerPosition, setMarkerPosition] = useState(initialLocation || defaultCenter);
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

    const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            const newPosition = { lat, lng };
            setMarkerPosition(newPosition);
            onLocationChange(newPosition);
        }
    }, [onLocationChange]);

    if (!apiKey) {
        return (
            <div className="w-full h-[400px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center p-6">
                    <p className="text-red-600 dark:text-red-400 font-semibold mb-2">
                        Google Maps API Key chưa được cấu hình
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Vui lòng thêm <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> vào file <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">.env.local</code>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={markerPosition}
                zoom={15}
                onClick={handleMapClick}
                options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                }}
            >
                <Marker position={markerPosition} draggable={true} onDragEnd={handleMapClick} />
            </GoogleMap>
        </LoadScript>
    );
}
