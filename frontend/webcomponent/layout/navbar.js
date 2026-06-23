import { avatarHTML } from '../ui/avatar.js';
import { getMe } from '../../services/users.js';

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./navbar.css', import.meta.url);
document.head.appendChild(link);

class NavBar extends HTMLElement {
  async connectedCallback() {
    this._render('', '', '');
    try {
      const me = await getMe();
      this._render(me.display_name || me.username, me.username, me.avatar_url || '');
    } catch {
      // não autenticado — mostra avatar vazio
    }
  }

  _render(displayName, username, avatar) {
    const currentPath = window.location.pathname;

    this.innerHTML = `
      <nav class="navbar">
        <a class="navbar__logo" href="/pages/feed.html">
          <span class="navbar__logo-icon">🐾</span>
          <span class="navbar__logo-text">Insta<strong>Pet</strong></span>
        </a>

        <div class="navbar__actions">
          <a class="navbar__action-btn ${currentPath.includes('search') ? 'navbar__action-btn--active' : ''}" href="/pages/search.html" title="Explorar">
            <svg class="navbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </a>

          <div class="navbar__user">
            <button class="navbar__avatar-btn" aria-label="Menu do utilizador">
              ${avatarHTML(displayName, avatar, 'navbar__avatar')}
            </button>
            <div class="navbar__dropdown" hidden>
              ${displayName ? `
                <div class="navbar__dropdown-header">
                  ${avatarHTML(displayName, avatar, 'navbar__dropdown-avatar')}
                  <div class="navbar__dropdown-info">
                    <span class="navbar__dropdown-name">${displayName}</span>
                    <span class="navbar__dropdown-handle">@${username}</span>
                  </div>
                </div>
                <div class="navbar__dropdown-divider"></div>
              ` : ''}
              <a class="navbar__dropdown-item" href="/pages/profile.html">
                <span class="material-symbols-outlined">person</span> Perfil
              </a>
              <a class="navbar__dropdown-item" href="/pages/profile.html?tab=saved">
                <span class="material-symbols-outlined">bookmark</span> Guardados
              </a>
              <div class="navbar__dropdown-divider"></div>
              <button class="navbar__dropdown-item navbar__logout-btn">
                <span class="material-symbols-outlined">logout</span> Sair
              </button>
            </div>
          </div>
        </div>
      </nav>
    `;

    this.querySelector('.navbar__avatar-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const dd = this.querySelector('.navbar__dropdown');
      dd.hidden = !dd.hidden;
    });

    this.querySelector('.navbar__logout-btn').addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = '/pages/login.html';
    });

    document.addEventListener('click', (e) => {
      if (!this.contains(e.target)) {
        const dd = this.querySelector('.navbar__dropdown');
        if (dd) dd.hidden = true;
      }
    }, { capture: true });
  }
}

customElements.define('nav-bar', NavBar);
