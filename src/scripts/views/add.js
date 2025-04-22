import { postStory } from '../presenters/addPresenter';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';

export function renderAdd(container) {
  const token = localStorage.getItem('token');
  if (!token) {
    location.hash = '#/login';
    return;
  }

  let stream = null;
  let imageBlob = null;

  container.innerHTML = `
    <section class="page add-page">
      <h2>Tambah Cerita</h2>
      <form id="storyForm">
        <label for="description">Deskripsi</label>
        <input type="text" id="description" required>

        <label for="photo">Foto</label>
        <select id="photoMethod">
          <option value="file">Upload File</option>
          <option value="camera">Gunakan Kamera</option>
        </select>

        <div id="cameraSection" style="display: none;">
          <video id="video" width="320" height="240" autoplay></video>
          <button type="button" id="capture">Ambil Foto</button>
          <canvas id="canvas" width="320" height="240" style="display: none;"></canvas>
        </div>

        <input type="file" id="altPhoto" accept="image/*">

        <label for="lat">Latitude</label>
        <input type="text" id="lat">

        <label for="lon">Longitude</label>
        <input type="text" id="lon">

        <div id="mapForm" class="map-fullwidth" style="margin-bottom: 1rem;"></div>

        <button type="submit">Kirim Cerita</button>
      </form>
    </section>
  `;

  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const captureBtn = document.getElementById('capture');
  const altFile = document.getElementById('altPhoto');
  const photoMethod = document.getElementById('photoMethod');
  const cameraSection = document.getElementById('cameraSection');
  const context = canvas.getContext('2d');
  const form = document.getElementById('storyForm');

  photoMethod.addEventListener('change', () => {
    const useCam = photoMethod.value === 'camera';
    cameraSection.style.display = useCam ? 'block' : 'none';
    altFile.style.display = useCam ? 'none' : 'block';

    if (useCam) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(camStream => {
        stream = camStream;
        video.srcObject = stream;
      });
    } else {
      if (stream) stream.getTracks().forEach(t => t.stop());
    }
  });

  captureBtn.addEventListener('click', () => {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      imageBlob = blob;
      alert('Foto berhasil diambil!');
    }, 'image/jpeg');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const desc = form.description.value;
    const lat = form.lat.value;
    const lon = form.lon.value;

    const formData = new FormData();
    formData.append('description', desc);

    if (photoMethod.value === 'camera') {
      if (!imageBlob) {
        alert('Harap ambil foto terlebih dahulu.');
        return;
      }
      formData.append('photo', imageBlob, 'photo.jpg');
    } else {
      if (altFile.files.length === 0) {
        alert('Pilih file terlebih dahulu.');
        return;
      }
      formData.append('photo', altFile.files[0]);
    }

    if (lat) formData.append('lat', lat);
    if (lon) formData.append('lon', lon);

    try {
      await postStory(token, formData);
      alert('Cerita berhasil ditambahkan.');
      location.hash = '#/';
    } catch (err) {
      alert('Gagal mengirim cerita: ' + err.message);
    }
  });

  window.addEventListener('hashchange', () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
  }, { once: true });

  import('leaflet').then(L => {
    const map = L.map('mapForm').setView([-6.2, 106.8], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    const customIcon = L.icon({
      iconUrl: markerIcon,
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });

    let marker = L.marker([-6.2, 106.8], {
      draggable: true,
      icon: customIcon
    }).addTo(map);

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      document.getElementById('lat').value = pos.lat;
      document.getElementById('lon').value = pos.lng;
    });

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      document.getElementById('lat').value = lat;
      document.getElementById('lon').value = lng;
    });
  });
}
