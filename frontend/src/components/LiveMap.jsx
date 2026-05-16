import React, { useEffect, useRef, useState } from 'react';

// Geocode an address string using Nominatim (free, no API key)
const geocode = async (address) => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    const data = await res.json();
    if (data.length > 0) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    // fall through to null
  }
  return null;
};

// Simulated driver position that moves toward destination over time
const simulateDriverPos = (dest, status) => {
  if (!dest) return null;
  if (status === 'delivered') return dest;
  // Start ~1km north, drift toward dest based on status
  const offset = status === 'on_the_way' ? 0.004 : 0.009;
  return { lat: dest.lat + offset, lng: dest.lng + offset * 0.6 };
};

const LiveMap = ({ deliveryAddress, status }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const [geocoded, setGeocoded] = useState(null);
  const [geoError, setGeoError] = useState(false);

  // Geocode on mount / address change
  useEffect(() => {
    if (!deliveryAddress) return;
    geocode(deliveryAddress).then((coords) => {
      if (coords) setGeocoded(coords);
      else setGeoError(true);
    });
  }, [deliveryAddress]);

  // Init map once we have coords
  useEffect(() => {
    if (!geocoded || !mapRef.current) return;
    if (mapInstanceRef.current) return; // already initialised

    // Dynamically import Leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      // Fix default icon paths broken by bundlers
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current, {
        center: [geocoded.lat, geocoded.lng],
        zoom: 15,
        zoomControl: false,
        attributionControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Zoom control bottom-right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Destination marker (green pin)
      const destIcon = L.divIcon({
        className: '',
        html: `<div style="width:36px;height:36px;background:#789070;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      });
      destMarkerRef.current = L.marker([geocoded.lat, geocoded.lng], { icon: destIcon })
        .addTo(map)
        .bindPopup('<b>Delivery Address</b>');

      // Driver marker (blue pulse dot)
      const driverPos = simulateDriverPos(geocoded, status);
      if (driverPos) {
        const driverIcon = L.divIcon({
          className: '',
          html: `<div style="position:relative;width:20px;height:20px">
            <div style="width:20px;height:20px;background:#3b82f6;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>
            <div style="position:absolute;inset:-6px;border-radius:50%;background:rgba(59,130,246,0.25);animation:pulse-ring 1.5s ease-out infinite"></div>
          </div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });
        driverMarkerRef.current = L.marker([driverPos.lat, driverPos.lng], { icon: driverIcon })
          .addTo(map)
          .bindPopup('<b>Your Rider</b>');

        // Draw route line
        if (status !== 'delivered') {
          L.polyline(
            [[driverPos.lat, driverPos.lng], [geocoded.lat, geocoded.lng]],
            { color: '#789070', weight: 3, dashArray: '6 8', opacity: 0.8 }
          ).addTo(map);
        }

        // Fit both markers
        map.fitBounds(
          [[geocoded.lat, geocoded.lng], [driverPos.lat, driverPos.lng]],
          { padding: [50, 50] }
        );
      }

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [geocoded]);

  // Update driver marker when status changes
  useEffect(() => {
    if (!geocoded || !mapInstanceRef.current || !driverMarkerRef.current) return;
    const driverPos = simulateDriverPos(geocoded, status);
    if (driverPos) {
      driverMarkerRef.current.setLatLng([driverPos.lat, driverPos.lng]);
    }
  }, [status, geocoded]);

  if (geoError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-grey-light gap-2 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span className="text-sm opacity-60">Map unavailable for this address</span>
      </div>
    );
  }

  if (!geocoded) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-grey-light gap-3 text-gray-400">
        <div className="w-8 h-8 rounded-full border-3 border-primary border-t-transparent animate-spin" style={{ borderWidth: 3 }}></div>
        <span className="text-sm opacity-60">Loading map...</span>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-full" />;
};

export default LiveMap;
