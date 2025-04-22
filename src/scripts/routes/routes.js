import { renderHome } from './views/home';
import { renderAbout } from './views/about';
import { renderAdd } from './views/add';
import { renderLogin } from './views/login';
import { renderRegister } from './views/register';
import { renderStoryDetail } from './views/story-detail';

export const routes = {
  '/': renderHome,
  '/home': renderHome,
  '/about': renderAbout,
  '/add': renderAdd,
  '/login': renderLogin,
  '/register': renderRegister,
};

function loadPage() {
  const app = document.getElementById('app');
  const hash = location.hash || '#/';
  const routePath = hash.replace(/^#/, ''); // buang '#' di depan

  // Tangani rute dinamis seperti /story/:id
  const storyMatch = routePath.match(/^\/?story\/(.+)/);
  if (storyMatch) {
    const storyId = storyMatch[1];
    if (document.startViewTransition) {
      document.startViewTransition(() => renderStoryDetail(app, storyId));
    } else {
      renderStoryDetail(app, storyId);
    }
    return;
  }

  const render = routes[routePath];
  if (!render) {
    app.innerHTML = '<p>Halaman tidak ditemukan</p>';
    return;
  }

  if (document.startViewTransition) {
    document.startViewTransition(() => render(app));
  } else {
    render(app);
  }
}

export function initRouter() {
  window.addEventListener('hashchange', loadPage);
  window.addEventListener('load', loadPage);
}
