export function renderStoryDetail(container, id) {
  const token = localStorage.getItem('token');
  if (!token) {
    location.hash = '#/login';
    return;
  }

  fetch(`https://story-api.dicoding.dev/v1/stories/${id}`, {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
    .then(res => res.json())
    .then(data => {
      const story = data.story;
      container.innerHTML = `
        <section class="page story-detail">
          <img 
            src="${story.photoUrl}" 
            alt="Foto oleh ${story.name}" 
            style="width: 100%; view-transition-name: story-${story.id};"
          >
          <h2>${story.name}</h2>
          <p>${story.description}</p>
          <small>${new Date(story.createdAt).toLocaleString()}</small>
          <br><br>
          <button onclick="history.back()">⬅️ Kembali</button>
        </section>
      `;
    });
}
