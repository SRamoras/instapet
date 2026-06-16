import { avatarHTML } from '../ui/avatar.js';

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./navbar.css', import.meta.url);
document.head.appendChild(link);

class NavBar extends HTMLElement {
  connectedCallback() {
    const displayName = this.getAttribute('display-name') || '';
    const avatar = this.getAttribute('avatar') || '';

    this.innerHTML = `
      <nav class="navbar">
        <a class="navbar__logo" href="/pages/feed.html">
          <span class="navbar__logo-icon">🐾</span>
          <span class="navbar__logo-text">Insta<strong>Pet</strong></span>
        </a>

        <div class="navbar__actions">
          <a class="navbar__action-btn" href="/pages/search.html" title="Pesquisar">
            <svg class="navbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </a>

          <button class="navbar__action-btn" title="Notificações">
            <svg class="navbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>

          <div class="navbar__user">
            ${avatarHTML(displayName, avatar, 'navbar__avatar')}
            <div class="navbar__dropdown">
              <a class="navbar__dropdown-item" href="/pages/profile.html">Perfil</a>
              <button class="navbar__dropdown-item navbar__logout-btn">Sair</button>
            </div>
          </div>
        </div>
      </nav>
    `;

    this.querySelector('.navbar__avatar').addEventListener('click', () => {
      this.querySelector('.navbar__dropdown').classList.toggle('open');
    });

    this.querySelector('.navbar__logout-btn').addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = '/pages/login.html';
    });

    document.addEventListener('click', (e) => {
      if (!this.contains(e.target)) {
        this.querySelector('.navbar__dropdown')?.classList.remove('open');
      }
    });
  }
}

customElements.define('nav-bar', NavBar);
