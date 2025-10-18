import Map, { Marker, NavigationControl, ViewStateChangeEvent } from 'react-map-gl';
import { MapPin, Star, Navigation } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Task } from '@/Pages/Portal/Index';

interface MapProps {
  tasks: Task[];
  userLocation: { lat: number; lng: number } | null;
  viewState: any;
  onViewStateChange: (state: any) => void;
  onTaskSelect: (task: Task) => void;
}

export default function MapComponent({ tasks, userLocation, viewState, onViewStateChange, onTaskSelect }: MapProps) {
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

  const goToUserLocation = () => {
    if (userLocation) {
      onViewStateChange({ ...viewState, longitude: userLocation.lng, latitude: userLocation.lat, zoom: 14 });
    }
  };

  return (
    <>
      <Map
        {...viewState}
        onMove={(evt: ViewStateChangeEvent) => onViewStateChange(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <NavigationControl position="top-right" />

        {userLocation && (
          <Marker longitude={userLocation.lng} latitude={userLocation.lat}>
            <div className="relative">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
              <div className="absolute inset-0 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-75" />
            </div>
          </Marker>
        )}

        {tasks.map(task => (
          <Marker key={task.id_question} longitude={task.longitude} latitude={task.latitude}>
            <button
              onClick={(e) => { e.stopPropagation(); onTaskSelect(task); }}
              className="transform transition-transform hover:scale-125 relative"
            >
              <MapPin className="w-8 h-8 text-blue-800 fill-blue-600 drop-shadow-lg" strokeWidth={1.5} />
              {task.is_favorite && (
                <Star size={12} className="absolute -top-1 -right-1 fill-primary text-primary" />
              )}
            </button>
          </Marker>
        ))}
      </Map>

      {userLocation && (
        <button
          onClick={goToUserLocation}
          className="absolute bottom-4 right-4 md:bottom-6 md:right-6 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all hover:scale-110 z-10"
          title="Kembali ke lokasi saya"
        >
          <Navigation size={20} className="text-primary" />
        </button>
      )}
    </>
  );
}
