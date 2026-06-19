import { avatarHTML } from './avatar.js';

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./usercard.css', import.meta.url);
document.head.appendChild(link);

class UserCard extends HTMLElement {
  connectedCallback() {
    const username    = this.getAttribute('username') || '';
    const displayName = this.getAttribute('display-name') || username;
    const avatar      = this.getAttribute('avatar') || '';
    const posts       = this.getAttribute('posts') || '0';
    const followers   = this.getAttribute('followers') || '0';
    const following   = this.getAttribute('following') || '0';
    const isMe        = this.getAttribute('is-me') === 'true';
    let followed = this.getAttribute('followed-by-me') === 'true';

    this.innerHTML = `
      <div class="user-card">
        <div class="user-card__profile">
          ${avatarHTML(displayName, avatar, 'user-card__avatar')}
          <div class="user-card__info">
            <span class="user-card__name">${displayName}</span>
            <span class="user-card__username">@${username}</span>
          </div>
        </div>

        <div class="user-card__stats">
          <div class="user-card__stat">
            <span class="user-card__stat-value">${posts}</span>
            <span class="user-card__stat-label">Posts</span>
          </div>
          <div class="user-card__stat">
            <span class="user-card__stat-value">${followers}</span>
            <span class="user-card__stat-label">Seguidores</span>
          </div>
          <div class="user-card__stat">
            <span class="user-card__stat-value">${following}</span>
            <span class="user-card__stat-label">Seguindo</span>
          </div>
        </div>

        ${!isMe ? `<button class="user-card__follow-btn${followed ? ' user-card__follow-btn--following' : ''}">
          ${followed ? 'A seguir' : 'Seguir'}
        </button>` : ''}
      </div>
    `;

    if (isMe) return;
    const followersEl = this.querySelectorAll('.user-card__stat-value')[1];
    this.querySelector('.user-card__follow-btn').addEventListener('click', (e) => {
      followed = !followed;
      e.currentTarget.classList.toggle('user-card__follow-btn--following');
      e.currentTarget.textContent = followed ? 'A seguir' : 'Seguir';
      if (followersEl) {
        followersEl.textContent = Math.max(0, parseInt(followersEl.textContent || '0') + (followed ? 1 : -1));
      }
      this.dispatchEvent(new CustomEvent('user-follow', {
        detail: { username, followed },
        bubbles: true,
        composed: true,
      }));
    });
  }
}

customElements.define('user-card', UserCard);
