import { getMe, getFollowers, getFollowing, followUser, unfollowUser } from '../../services/users.js';

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./profile-users-modal.css', import.meta.url);
document.head.appendChild(link);

export class ProfileUsersModal extends HTMLElement {
  #profileUsername = '';

  connectedCallback() {
    this.innerHTML = `
      <div class="users-modal" role="dialog" aria-modal="true" hidden>
        <div class="users-modal__backdrop"></div>
        <div class="users-modal__box">
          <div class="users-modal__header">
            <h2 class="users-modal__title"></h2>
            <button class="users-modal__close" aria-label="Fechar">✕</button>
          </div>
          <ul class="users-modal__list"></ul>
        </div>
      </div>
    `;

    this._bindEvents();
    document.addEventListener('profile-stat-click', (e) => this._open(e.detail.list, e.detail.username));
  }

  _modal() { return this.querySelector('.users-modal'); }
  _title() { return this.querySelector('.users-modal__title'); }
  _list()  { return this.querySelector('.users-modal__list'); }

  _bindEvents() {
    this.querySelector('.users-modal__close').addEventListener('click',    () => this._close());
    this.querySelector('.users-modal__backdrop').addEventListener('click', () => this._close());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this._modal().hidden) this._close();
    });
  }

  _close() {
    this._modal().hidden    = true;
    this._list().innerHTML  = '';
  }

  async _open(listType, profileUsername) {
    this.#profileUsername       = profileUsername;
    this._title().textContent   = listType === 'followers' ? 'Seguidores' : 'A seguir';
    this._modal().hidden        = false;
    this._list().innerHTML      = '<li class="users-modal__empty">A carregar...</li>';

    try {
      let loggedInUsername = null;
      if (localStorage.getItem('token')) {
        try { loggedInUsername = (await getMe()).username; } catch {}
      }
      const users = listType === 'followers'
        ? await getFollowers(profileUsername)
        : await getFollowing(profileUsername);

      this._list().innerHTML = '';
      if (!users.length) {
        this._list().innerHTML = '<li class="users-modal__empty">Nenhum utilizador.</li>';
        return;
      }
      users.forEach(u => this._list().appendChild(this._buildItem(u, loggedInUsername)));
    } catch {
      this._list().innerHTML = '<li class="users-modal__empty">Erro ao carregar.</li>';
    }
  }

  _avatarHTML(u) {
    if (u.avatar_url) {
      return `<img class="users-modal__avatar" src="${u.avatar_url}" alt="${u.username}">`;
    }
    const initials = (u.display_name || u.username).slice(0, 1).toUpperCase();
    return `<span class="users-modal__avatar--initials">${initials}</span>`;
  }

  _buildItem(u, loggedInUsername) {
    const isMe = loggedInUsername && u.username === loggedInUsername;
    const li   = document.createElement('li');
    li.className = 'users-modal__item';
    li.innerHTML = `
      ${this._avatarHTML(u)}
      <div class="users-modal__info">
        <a class="users-modal__name" href="/pages/profile.html?user=${u.username}">${u.display_name || u.username}</a>
        <span class="users-modal__handle">@${u.username}</span>
      </div>
      ${!isMe ? `<button class="users-modal__follow-btn ${u.followed_by_me ? 'users-modal__follow-btn--following' : ''}" data-username="${u.username}">
        ${u.followed_by_me ? 'A seguir' : 'Seguir'}
      </button>` : ''}
    `;

    if (!isMe) {
      let followed = u.followed_by_me;
      const btn    = li.querySelector('.users-modal__follow-btn');

      btn.addEventListener('click', async () => {
        if (btn.disabled) return;
        const wasFollowed = followed;
        followed          = !followed;
        const delta       = followed ? 1 : -1;

        btn.disabled    = true;
        btn.textContent = followed ? 'A seguir' : 'Seguir';
        btn.classList.toggle('users-modal__follow-btn--following', followed);

        this.dispatchEvent(new CustomEvent('profile-follow-change', {
          detail: { targetUsername: u.username, profileUsername: this.#profileUsername, loggedInUsername, delta },
          bubbles: true,
        }));

        try {
          if (followed) await followUser(u.username);
          else await unfollowUser(u.username);
          sessionStorage.setItem('feed-stale', '1');
        } catch {
          followed        = wasFollowed;
          btn.textContent = followed ? 'A seguir' : 'Seguir';
          btn.classList.toggle('users-modal__follow-btn--following', followed);
          this.dispatchEvent(new CustomEvent('profile-follow-change', {
            detail: { targetUsername: u.username, profileUsername: this.#profileUsername, loggedInUsername, delta: -delta },
            bubbles: true,
          }));
        } finally {
          btn.disabled = false;
        }
      });
    }
    return li;
  }
}

customElements.define('profile-users-modal', ProfileUsersModal);
