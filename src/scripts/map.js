
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export function initMap() {
  const map = L.map('map').setView([-2.5489, 118.0149], 5);

  L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=EjgIQQJl93uRBUQIPRGe', {
    attribution: '&copy; <a href="https://www.maptiler.com">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    tileSize: 512,
    zoomOffset: -1
  }).addTo(map);

  return map;
}

export function addMarker(map, lat, lon, description) {
  if (!map || !lat || !lon) return;
  const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });

  const marker = L.marker([lat, lon], { icon }).addTo(map);
  marker.bindPopup(description || 'No description');
}
