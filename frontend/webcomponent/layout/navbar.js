import { avatarHTML } from '../ui/avatar.js';
import { getMe } from '../../services/users.js';
import { getNotifications, markAllRead } from '../../services/notifications.js';

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./navbar.css', import.meta.url);
document.head.appendChild(link);

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)   return 'agora';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

function notifText(n) {
  if (n.type === 'like')    return `<strong>@${n.actor_username}</strong> gostou do teu post`;
  if (n.type === 'comment') return `<strong>@${n.actor_username}</strong> comentou no teu post`;
  if (n.type === 'follow')  return `<strong>@${n.actor_username}</strong> começou a seguir-te`;
  return n.actor_username;
}

function notifIcon(type) {
  if (type === 'like')    return `<span class="notif-icon notif-icon--like material-symbols-outlined">favorite</span>`;
  if (type === 'comment') return `<span class="notif-icon notif-icon--comment material-symbols-outlined">chat_bubble</span>`;
  if (type === 'follow')  return `<span class="notif-icon notif-icon--follow material-symbols-outlined">person_add</span>`;
  return '';
}

class NavBar extends HTMLElement {
  async connectedCallback() {
    this._render('', '', '');
    this._showCachedBadge();

    const [me] = await Promise.allSettled([getMe(), this._fetchNotifications()]);

    if (me.status === 'fulfilled') {
      const { display_name, username, avatar_url } = me.value;
      this._render(display_name || username, username, avatar_url || '');
      this._showCachedBadge();
      this._pollTimer = setInterval(() => this._fetchNotifications(), 30000);
    }
  }

  disconnectedCallback() {
    clearInterval(this._pollTimer);
  }

  _showCachedBadge() {
    const cached = parseInt(localStorage.getItem('notif_unread') || '0');
    const badge = this.querySelector('.navbar__notif-badge');
    if (!badge) return;
    badge.textContent = cached > 9 ? '9+' : cached;
    badge.hidden = cached === 0;
  }

  async _fetchNotifications() {
    try {
      const notifs = await getNotifications();
      const unread = notifs.filter(n => !n.read).length;
      localStorage.setItem('notif_unread', String(unread));
      this._updateBadge(notifs);
      this._updatePanel(notifs);
    } catch {
      localStorage.setItem('notif_unread', '0');
      const badge = this.querySelector('.navbar__notif-badge');
      if (badge) badge.hidden = true;
    }
  }

  _updateBadge(notifs) {
    const unread = notifs.filter(n => !n.read).length;
    const badge = this.querySelector('.navbar__notif-badge');
    if (!badge) return;
    badge.textContent = unread > 9 ? '9+' : unread;
    badge.hidden = unread === 0;
  }

  _updatePanel(notifs) {
    const list = this.querySelector('.navbar__notif-list');
    if (!list) return;
    if (!notifs.length) {
      list.innerHTML = `<p class="navbar__notif-empty">Sem notificações</p>`;
      return;
    }
    list.innerHTML = notifs.map(n => `
      <div class="navbar__notif-item ${n.read ? '' : 'navbar__notif-item--unread'}" data-post="${n.post_id || ''}">
        ${notifIcon(n.type)}
        <div class="navbar__notif-body">
          <span class="navbar__notif-text">${notifText(n)}</span>
          <span class="navbar__notif-time">${timeAgo(n.created_at)}</span>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('.navbar__notif-item[data-post]').forEach(el => {
      const postId = el.dataset.post;
      if (postId) {
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => {
          window.location.href = `/pages/post.html?id=${postId}`;
        });
      }
    });
  }

  _render(displayName, username, avatar) {
    const currentPath = window.location.pathname;

    this.innerHTML = `
      <nav class="navbar">
        <a class="navbar__logo" href="/pages/feed.html">
          <img class="navbar__logo-img" src="/img/logoinstapet1.png" alt="InstaPet">
        </a>

        <div class="navbar__actions">
          <a class="navbar__action-btn ${currentPath.includes('search') ? 'navbar__action-btn--active' : ''}" href="/pages/search.html" title="Explorar">
            <svg class="navbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </a>

          <div class="navbar__notif-wrap">
            <button class="navbar__action-btn navbar__notif-btn" title="Notificações" aria-label="Notificações">
              <span class="material-symbols-outlined navbar__icon" style="font-size:20px;width:20px;height:20px;">notifications</span>
              <span class="navbar__notif-badge" hidden>0</span>
            </button>
            <div class="navbar__notif-panel" hidden>
              <div class="navbar__notif-header">
                <span class="navbar__notif-title">Notificações</span>
                <button class="navbar__notif-read-all">Marcar todas como lidas</button>
              </div>
              <div class="navbar__notif-list">
                <p class="navbar__notif-empty">Sem notificações</p>
              </div>
            </div>
          </div>

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

    // Bell toggle
    const notifBtn   = this.querySelector('.navbar__notif-btn');
    const notifPanel = this.querySelector('.navbar__notif-panel');
    notifBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const isOpen = !notifPanel.hidden;
      notifPanel.hidden = isOpen;
      if (!isOpen) {
        await this._fetchNotifications();
        await markAllRead().catch(() => {});
        localStorage.setItem('notif_unread', '0');
        const badge = this.querySelector('.navbar__notif-badge');
        if (badge) badge.hidden = true;
        this.querySelectorAll('.navbar__notif-item--unread').forEach(el => {
          el.classList.remove('navbar__notif-item--unread');
        });
      }
    });

    this.querySelector('.navbar__notif-read-all').addEventListener('click', async (e) => {
      e.stopPropagation();
      await markAllRead().catch(() => {});
      localStorage.setItem('notif_unread', '0');
      const badge = this.querySelector('.navbar__notif-badge');
      if (badge) badge.hidden = true;
      this.querySelectorAll('.navbar__notif-item--unread').forEach(el => {
        el.classList.remove('navbar__notif-item--unread');
      });
    });

    // Avatar dropdown toggle
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
        if (notifPanel) notifPanel.hidden = true;
      }
    }, { capture: true });
  }
}

customElements.define('nav-bar', NavBar);
