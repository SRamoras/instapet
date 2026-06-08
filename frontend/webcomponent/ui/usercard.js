const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./usercard.css', import.meta.url);
document.head.appendChild(link);

class UserCard extends HTMLElement {
  connectedCallback() {
    const username    = this.getAttribute('username') || '';
    const displayName = this.getAttribute('display-name') || username;
    const avatar      = this.getAttribute('avatar') || `https://i.pravatar.cc/44?u=${username}`;
    const posts       = this.getAttribute('posts') || '0';
    const followers   = this.getAttribute('followers') || '0';
    const following   = this.getAttribute('following') || '0';

    this.innerHTML = `
      <div class="user-card">
        <div class="user-card__profile">
          <img class="user-card__avatar" src="${avatar}" alt="${username}">
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

        <button class="user-card__follow-btn">Seguir</button>
      </div>
    `;
  }
}

customElements.define('user-card', UserCard);
