import { renderHome } from './views/home';
import { renderAbout } from './views/about';
import { renderAdd } from './views/add';
import { renderLogin } from './views/login';
import { renderRegister } from './views/register';
import { renderStoryDetail } from './views/story-detail';

const routes = {
  '/': renderHome,
  '/home': renderHome,
  '/about': renderAbout,
  '/add': renderAdd,
  '/login': renderLogin,
  '/register': renderRegister,
};

function loadPage() {
  const app = document.getElementById('app');
  app.setAttribute('view-transition-name', 'page-content');

  const hash = location.hash || '#/';
  let routePath = hash.slice(1); // Remove '#'

  if (routePath === '') routePath = '/'; // fallback

  // Handle dynamic route: /story/:id
  const storyMatch = routePath.match(/^\/?story\/(.+)/);
  if (storyMatch) {
    const storyId = storyMatch[1];
    const render = () => renderStoryDetail(app, storyId);

    if (document.startViewTransition) {
      document.startViewTransition(render);
    } else {
      render();
    }
    return;
  }

  const render = routes[routePath] || routes[`/${routePath}`];
  if (!render) {
    app.innerHTML = '<p>Halaman tidak ditemukan</p>';
    return;
  }

  const doRender = () => render(app);

  if (document.startViewTransition) {
    document.startViewTransition(doRender);
  } else {
    doRender();
  }
}

export function initRouter() {
  window.addEventListener('hashchange', loadPage);
  window.addEventListener('load', loadPage);
}
