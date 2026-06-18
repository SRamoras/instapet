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
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            FEED
          </a>
          <a class="feed-sidebar-left__nav-link" href="/pages/search.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
            </svg>
            EXPLORE
          </a>
          <a class="feed-sidebar-left__nav-link" href="/pages/notifications.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            ACTIVITY
          </a>
          <a class="feed-sidebar-left__nav-link" href="/pages/saved.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            SAVED
          </a>
          <a class="feed-sidebar-left__nav-link" href="/pages/profile.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            SETTINGS
          </a>
        </nav>
      </div>
    `;

    this.querySelectorAll('.feed-sidebar-left__nav-link').forEach((navLink) => {
      if (new URL(navLink.href).pathname === window.location.pathname) {
        navLink.classList.add('feed-sidebar-left__nav-link--active');
      }
    });
  }
}

customElements.define('feed-sidebar-left', FeedSidebarLeft);
