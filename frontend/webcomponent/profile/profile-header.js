import { avatarHTML } from '../ui/avatar.js';

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./profile-header.css', import.meta.url);
document.head.appendChild(link);

export class ProfileHeader extends HTMLElement {
  connectedCallback() {
    const username    = this.getAttribute('username') || '';
    const displayName = this.getAttribute('display-name') || username;
    const avatar      = this.getAttribute('avatar') || '';
    const bio         = this.getAttribute('bio') || '';
    const likes       = this.getAttribute('likes') || '0';
    const followers   = this.getAttribute('followers') || '0';
    const following   = this.getAttribute('following') || '0';
    const editable    = this.getAttribute('editable') === 'true';

    this.innerHTML = `
      <div class="profile-header">
        ${avatarHTML(displayName, avatar, 'profile-header__avatar')}
        <div class="profile-header__info">
          <div class="profile-header__top-row">
            <div>
              <h2 class="profile-header__name">${displayName}</h2>
              <span class="profile-header__username">@${username}</span>
            </div>
            ${editable ? `<button class="profile-header__edit-btn">EDIT</button>` : ''}
          </div>

          <div class="profile-header__stats">
            <div class="profile-header__stat">
              <strong class="profile-header__stat-value">${likes}</strong>
              <span class="profile-header__stat-label">Likes</span>
            </div>
            <div class="profile-header__stat">
              <strong class="profile-header__stat-value">${followers}</strong>
              <span class="profile-header__stat-label">Followers</span>
            </div>
            <div class="profile-header__stat">
              <strong class="profile-header__stat-value">${following}</strong>
              <span class="profile-header__stat-label">Following</span>
            </div>
          </div>

          ${bio ? `<p class="profile-header__bio">${bio}</p>` : ''}
        </div>
      </div>
    `;
  }
}

customElements.define('profile-header', ProfileHeader);
