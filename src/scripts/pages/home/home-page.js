import {
  saveStoriesToIDB,
  getStoriesFromIDB,
} from '../db.js';

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
    console.log('🏁 HomePage.afterRender triggered');
    console.log('🗃️ IndexedDB opened');   // this will fire once openDB() is called internally
    const container = document.getElementById('stories');
    let stories = [];

    try {
      const res = await fetch('https://story-api.dicoding.dev/v1/stories');
      const { list } = await res.json();
      console.log('📥 Stories fetched from API:', list);
      stories = list;

      await saveStoriesToIDB(stories);
      console.log('💾 Stories saved to IndexedDB');
    } catch (err) {
      console.warn('⚠️ Fetch gagal, ambil cerita dari IndexedDB:', err);
      stories = await getStoriesFromIDB();
      console.log('📤 Stories loaded from IndexedDB:', stories);
    }

    container.innerHTML = renderStoryList(stories);
  }
}