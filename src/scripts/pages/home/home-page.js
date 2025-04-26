// src/scripts/pages/home/home-page.js

import {
  saveStoriesToIDB,
  getStoriesFromIDB,
} from '../../db.js';

function renderStoryList(stories) {
  if (!stories || stories.length === 0) {
    return '<p>Tidak ada cerita.</p>';
  }
  return stories
    .map(story => `
      <article class="story-card">
        <img
          src="${story.photoUrl || story.photo || '#'}"
          alt="${story.description || 'Story image'}"
          class="story-image"
        />
        <div class="story-content">
          <p class="story-desc">${story.description || ''}</p>
          <time class="story-time">${new Date(story.createdAt).toLocaleString()}</time>
        </div>
      </article>
    `)
    .join('');
}

export default class HomePage {
  async render() {
    return `
      <section class="container">
        <h1>Semua Cerita</h1>
        <div id="stories" class="stories-list"></div>
      </section>
    `;
  }

  async afterRender() {
    const container = document.getElementById('stories');
    let stories = [];
    const token = localStorage.getItem('token');

    try {
      // include the Bearer token so the API will actually return a 200
      const res = await fetch('https://story-api.dicoding.dev/v1/stories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // if the token is invalid or missing, it'll still 401
      if (!res.ok) throw new Error(`API returned ${res.status}`);

      const { list } = await res.json();
      stories = list;

      // save into IndexedDB for offline fallback
      await saveStoriesToIDB(stories);
    } catch (err) {
      console.warn('⚠️ Fetch gagal, ambil cerita dari IndexedDB:', err);
      stories = await getStoriesFromIDB();
    }

    container.innerHTML = renderStoryList(stories);
  }
}
