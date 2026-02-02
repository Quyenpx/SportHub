'use client';

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';

interface VenueMapViewerProps {
    location: { lat: number; lng: number };
    venueName: string;
}

const mapContainerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '0.75rem'
};

export function VenueMapViewer({ location, venueName }: VenueMapViewerProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

    if (!apiKey) {
        return (
            <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center p-6 text-center">
                <div>
                    <MapPin className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Bản đồ chưa được cấu hình</p>
                </div>
            </div>
        );
    }

    return (
        <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={location}
                zoom={15}
                options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                    zoomControl: true,
                }}
            >
                <Marker
                    position={location}
                    title={venueName}
                />
            </GoogleMap>
        </LoadScript>
    );
}
