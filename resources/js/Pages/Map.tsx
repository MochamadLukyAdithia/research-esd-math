
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
    "pk.eyJ1IjoiY2hpZWp1d29ucyIsImEiOiJjbWdpMGlxaGUwMjVsMmxzZms0NjE1N2lhIn0.sBqjK_L7-vVst6dhJXdWrA";

interface MarkerData {
    lng: number;
    lat: number;
}

export default function Map() {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);

    useEffect(() => {
        if (!mapContainer.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [106.8456, -6.2088],
            zoom: 10,
        });

        map.current.on("click", (e) => {
            const { lng, lat } = e.lngLat;

           
            markers.forEach((m) => m.remove());
            setMarkers([]);

            const popup = new mapboxgl.Popup({ offset: 25 }).setText(
                `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`
            );

            const marker = new mapboxgl.Marker()
                .setLngLat([lng, lat])
                .setPopup(popup)
                .addTo(map.current!);

            setMarkers([marker]);
        });

        return () => {
            map.current?.remove();
        };
    }, []);

    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <h2 className="text-xl font-bold mb-4">
                    Klik di Peta untuk Tambahkan Marker
                </h2>
                <div
                    ref={mapContainer}
                    className="w-full h-[500px] rounded-lg shadow"
                />
            </div>
        </div>
    );
}
