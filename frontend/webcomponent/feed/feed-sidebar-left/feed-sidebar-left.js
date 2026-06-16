import { avatarHTML } from '../../ui/avatar.js';

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./feed-sidebar-left.css', import.meta.url);
document.head.appendChild(link);

export class FeedSidebarLeft extends HTMLElement {
  connectedCallback() {
    const username    = this.getAttribute('username') || '';
    const displayName = this.getAttribute('display-name') || username;
    const avatar      = this.getAttribute('avatar') || '';
    const likes       = this.getAttribute('likes') || '0';
    const followers   = this.getAttribute('followers') || '0';
    const following   = this.getAttribute('following') || '0';

    this.innerHTML = `
      <div class="feed-sidebar-left">
        <div class="feed-sidebar-left__profile">
          ${avatarHTML(displayName, avatar, 'feed-sidebar-left__avatar')}
          <div class="feed-sidebar-left__info">
            <span class="feed-sidebar-left__name">${displayName}</span>
            <span class="feed-sidebar-left__username">@${username}</span>
          </div>
        </div>

        <div class="feed-sidebar-left__stats">
          <div class="feed-sidebar-left__stat">
            <strong class="feed-sidebar-left__stat-value">${likes}</strong>
            <span class="feed-sidebar-left__stat-label">Likes</span>
          </div>
          <div class="feed-sidebar-left__stat">
            <strong class="feed-sidebar-left__stat-value">${followers}</strong>
            <span class="feed-sidebar-left__stat-label">Followers</span>
          </div>
          <div class="feed-sidebar-left__stat">
            <strong class="feed-sidebar-left__stat-value">${following}</strong>
            <span class="feed-sidebar-left__stat-label">Following</span>
          </div>
        </div>

        <nav class="feed-sidebar-left__nav">
          <a class="feed-sidebar-left__nav-link" href="/pages/feed.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            EXPLORE
          </a>
          <a class="feed-sidebar-left__nav-link" href="/pages/notifications.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            ACTIVITY
          </a>
          <a class="feed-sidebar-left__nav-link" href="/pages/saved.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            SAVED
          </a>
          <a class="feed-sidebar-left__nav-link feed-sidebar-left__nav-link--premium" href="/pages/premium.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            GET PREMIUM
          </a>
        </nav>
      </div>
    `;
  }
}

customElements.define('feed-sidebar-left', FeedSidebarLeft);
