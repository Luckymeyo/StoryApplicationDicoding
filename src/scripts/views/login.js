import initPushNotification from '../push-notification-init.js';

export function renderLogin(container) {
  const html = `
    <section class="page login-page">
      <h2>Login</h2>
      <form id="loginForm">
        <label for="email">Email</label>
        <input type="email" id="email" required>
        
        <label for="password">Password</label>
        <input type="password" id="password" required>
        
        <button type="submit">Login</button>
      </form>
      <p>Belum punya akun? <a href="#/register">Daftar</a></p>
    </section>
  `;

  container.innerHTML = html;

  const form = document.getElementById('loginForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.email.value;
    const password = form.password.value;

    try {
      const res = await fetch('https://story-api.dicoding.dev/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.message);

      localStorage.setItem('token', data.loginResult.token);
      await initPushNotification(); // Run after token is stored
      location.hash = '#/home';
    } catch (err) {
      alert('Login gagal: ' + err.message);
    }
  });
}
