
export function renderRegister(container) {
  const html = `
    <section class="page register-page">
      <h2>Register</h2>
      <form id="registerForm">
        <label for="name">Nama</label>
        <input type="text" id="name" required>

        <label for="email">Email</label>
        <input type="email" id="email" required>
        
        <label for="password">Password</label>
        <input type="password" id="password" required>
        
        <button type="submit">Daftar</button>
      </form>
      <p>Sudah punya akun? <a href="#/login">Login</a></p>
    </section>
  `;

  container.innerHTML = html;

  const form = document.getElementById('registerForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const res = await fetch('https://story-api.dicoding.dev/v1/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.message);

      alert('Registrasi berhasil, silakan login.');
      location.hash = '#/login';
    } catch (err) {
      alert('Gagal registrasi: ' + err.message);
    }
  });
}
