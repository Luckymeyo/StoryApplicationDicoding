export function renderStoryDetail(container, id) {
  console.log('Loaded story detail for ID:', id); // Log untuk debug ID

  const token = localStorage.getItem('token');
  if (!token) {
    location.hash = '#/login';
    return;
  }

  container.innerHTML = '<p>Loading...</p>';

  fetch(`https://story-api.dicoding.dev/v1/stories/${id}`, {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
    .then(res => {
      if (!res.ok) throw new Error('Gagal mengambil data');
      return res.json();
    })
    .then(data => {
      const story = data.story;

      container.innerHTML = `
        <section class="page story-detail">
          <h2>${story.name}</h2>
          <img src="${story.photoUrl}" alt="Foto oleh ${story.name}" class="story-image" style="max-width: 500px; width: 100%; display: block; border-radius: 12px; margin: 20px auto;">
          <p style="margin-top: 20px;">${story.description}</p>
          <small>Dibuat pada: ${new Date(story.createdAt).toLocaleString()}</small>
          <br><br>
          <a href="#/">← Kembali ke Beranda</a>
        </section>
      `;
    })
    .catch(err => {
      console.error('Gagal memuat cerita:', err);
      container.innerHTML = '<p>Gagal memuat cerita. Silakan coba lagi.</p>';
    });
}
