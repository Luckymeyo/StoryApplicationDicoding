import { initMap, addMarker } from '../map';
import { fetchStories } from '../presenters/homePresenter';

export function renderHome(container) {
  const token = localStorage.getItem('token');
  if (!token) {
    location.hash = '#/login';
    return;
  }

  container.innerHTML = `
    <section class="page home-page">
      <a id="mainContent" tabindex="-1"></a>
      <h2>Semua Cerita</h2>
      <button id="logoutBtn">Logout</button>
      <div id="storiesContainer">Memuat cerita...</div>
      <div style="width: 100%;">
  <div id="map" class="map-fullwidth">
  </div>
</div>
    </section>
  `;

  document.querySelector('.skip-link')?.addEventListener('click', () => {
    const target = document.getElementById('mainContent');
    target?.focus();
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    location.hash = '#/login';
  });

  fetchStories(token).then(stories => {
    const html = stories.map(s => `
      <div class="story">
        <a href="#/story/${s.id}" class="story-link">
          <img src="${s.photoUrl}" alt="Foto oleh ${s.name}" width="200" style="view-transition-name: story-${s.id};">
        </a>
        <h4>${s.name}</h4>
        <p>${s.description}</p>
        <small>${new Date(s.createdAt).toLocaleString()}</small>
      </div>
    `).join('');    
    document.getElementById('storiesContainer').innerHTML = html || 'Tidak ada cerita.';

    const map = initMap();
    stories.forEach(s => {
      if (s.lat && s.lon) addMarker(map, s.lat, s.lon, s.name + ': ' + s.description);
    });
  }).catch(err => {
    document.getElementById('storiesContainer').innerText = 'Gagal memuat cerita.';
  });
}