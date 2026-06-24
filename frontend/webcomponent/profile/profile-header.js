import { avatarHTML } from '../ui/avatar.js';
import { escapeHtml } from '../ui/escape.js';

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./profile-header.css', import.meta.url);
document.head.appendChild(link);

export class ProfileHeader extends HTMLElement {
  connectedCallback() {
    const username     = escapeHtml(this.getAttribute('username') || '');
    const displayName  = escapeHtml(this.getAttribute('display-name') || username);
    const avatar       = this.getAttribute('avatar') || '';
    const bio          = escapeHtml(this.getAttribute('bio') || '');
    const posts        = this.getAttribute('posts') || '0';
    const likes        = this.getAttribute('likes') || '0';
    const followers    = this.getAttribute('followers') || '0';
    const following    = this.getAttribute('following') || '0';
    const editable     = this.getAttribute('editable') === 'true';
    const followedByMe = this.getAttribute('followed-by-me') === 'true';

    this.innerHTML = `
      <div class="profile-header">
        ${avatarHTML(displayName, avatar, 'profile-header__avatar')}
        <div class="profile-header__info">
          <div class="profile-header__top-row">
            <div>
              <h2 class="profile-header__name">${displayName}</h2>
              <span class="profile-header__username">@${username}</span>
            </div>
            ${editable
              ? `<button class="profile-header__edit-btn">EDITAR</button>`
              : `<button class="profile-header__follow-btn ${followedByMe ? 'profile-header__follow-btn--following' : ''}">
                   ${followedByMe ? 'A seguir' : 'Seguir'}
                 </button>`
            }
          </div>

          <div class="profile-header__stats">
            <div class="profile-header__stat">
              <strong class="profile-header__stat-value">${posts}</strong>
              <span class="profile-header__stat-label">Posts</span>
            </div>
            <div class="profile-header__stat">
              <strong class="profile-header__stat-value">${likes}</strong>
              <span class="profile-header__stat-label">Gostos</span>
            </div>
            <button class="profile-header__stat profile-header__stat--btn" data-list="followers">
              <strong class="profile-header__stat-value">${followers}</strong>
              <span class="profile-header__stat-label">Seguidores</span>
            </button>
            <button class="profile-header__stat profile-header__stat--btn" data-list="following">
              <strong class="profile-header__stat-value">${following}</strong>
              <span class="profile-header__stat-label">A seguir</span>
            </button>
          </div>

          ${bio ? `<p class="profile-header__bio">${bio}</p>` : ''}
        </div>
      </div>
    `;

    if (editable) {
      this.querySelector('.profile-header__edit-btn').addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('profile-edit-open', {
          bubbles: true,
          detail: { displayName, bio, avatar },
        }));
      });
    }

    this.querySelectorAll('.profile-header__stat--btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('profile-stat-click', {
          bubbles: true,
          detail: { list: btn.dataset.list, username },
        }));
      });
    });

    if (!editable) {
      let followed = followedByMe;
      const btn = this.querySelector('.profile-header__follow-btn');
      const followersValueEl = this.querySelectorAll('.profile-header__stat-value')[1];
      btn.addEventListener('click', () => {
        followed = !followed;
        btn.textContent = followed ? 'A seguir' : 'Seguir';
        btn.classList.toggle('profile-header__follow-btn--following', followed);
        if (followersValueEl) {
          const current = parseInt(followersValueEl.textContent || '0');
          followersValueEl.textContent = Math.max(0, current + (followed ? 1 : -1));
        }
        this.dispatchEvent(new CustomEvent('profile-follow', {
          bubbles: true,
          detail: { username, followed },
        }));
      });
    }
  }
}

customElements.define('profile-header', ProfileHeader);
