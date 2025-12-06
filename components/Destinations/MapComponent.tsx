import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Destination } from '../../types';
import { createRoot } from 'react-dom/client';
import { Star, MapPin, ArrowRight } from 'lucide-react';

interface MapComponentProps {
  destinations: Destination[];
  selectedDestination: Destination | null;
  onSelectDestination: (dest: Destination) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ destinations, selectedDestination, onSelectDestination }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Fix Default Icons
    const DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([30.0444, 31.2357], 3);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Markers & Destinations
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old markers
    Object.values(markersRef.current).forEach((marker) => {
        (marker as any).remove();
    });
    markersRef.current = {};

    destinations.forEach(dest => {
      const marker = L.marker([dest.latitude, dest.longitude]);
      
      marker.addTo(map);
      markersRef.current[dest.id] = marker;

      // Custom Popup using React Portal/Root
      const popupContent = document.createElement('div');
      const root = createRoot(popupContent);
      
      root.render(
        <div className="w-full font-sans text-right" dir="rtl">
            <div className="h-24 w-full overflow-hidden rounded-t-lg relative bg-stone-200">
                <img 
                    src={dest.thumbnailUrl} 
                    alt={dest.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80';
                    }}
                />
                <div className="absolute top-2 right-2 bg-white/90 px-2 py-0.5 rounded text-xs font-bold text-stone-800 shadow-sm">
                    {dest.priceLevel}
                </div>
            </div>
            <div className="p-3">
                <h3 className="font-bold text-stone-900 text-base mb-1">{dest.name}</h3>
                <div className="flex items-center gap-1 text-xs text-stone-500 mb-2">
                    <MapPin className="w-3 h-3" />
                    <span>{dest.city}، {dest.country}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-bold text-stone-800">{dest.averageRating}</span>
                        <span className="text-[10px] text-stone-400">({dest.reviewsCount})</span>
                        </div>
                </div>
                <button 
                    id={`btn-${dest.id}`}
                    className="w-full flex items-center justify-center gap-2 bg-stone-900 text-white py-2 rounded-lg text-xs font-bold hover:bg-black transition-colors"
                >
                    <span>عرض التفاصيل</span>
                    <ArrowRight className="w-3 h-3 rotate-180" />
                </button>
            </div>
        </div>
      );

      marker.bindPopup(popupContent);

      // Handle popup open/close to manage events inside React tree in popup
      marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-${dest.id}`);
          if(btn) {
              btn.onclick = () => {
                  onSelectDestination(dest);
                  map.closePopup();
              }
          }
      });
    });

  }, [destinations, onSelectDestination]);

  // Handle Selected Destination Change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedDestination) return;

    map.flyTo(
        [selectedDestination.latitude, selectedDestination.longitude], 
        13, 
        { duration: 1.5 }
    );
    
    // Open popup for selected
    const marker = markersRef.current[selectedDestination.id];
    if (marker) {
        marker.openPopup();
    }

  }, [selectedDestination]);

  return <div ref={mapContainerRef} className="w-full h-full bg-[#e5e5e5]" />;
};

export default MapComponent;