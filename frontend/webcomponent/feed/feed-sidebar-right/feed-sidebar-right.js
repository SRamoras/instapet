import { avatarHTML } from '../../ui/avatar.js';

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./feed-sidebar-right.css', import.meta.url);
document.head.appendChild(link);

export class FeedSidebarRight extends HTMLElement {
  connectedCallback() {
    const suggestionsAttr = this.getAttribute('suggestions') || '[]';
    const topicsAttr      = this.getAttribute('topics') || '[]';

    let suggestions = [];
    let topics = [];

    try { suggestions = JSON.parse(suggestionsAttr); } catch {}
    try { topics = JSON.parse(topicsAttr); } catch {}


    this.innerHTML = `
      <div class="feed-sidebar-right">
        <section class="feed-sidebar-right__section">
          <h3 class="feed-sidebar-right__title">WHO TO FOLLOW</h3>
          <ul class="feed-sidebar-right__list">
            ${suggestions.map(u => `
              <li class="feed-sidebar-right__suggest">
                ${avatarHTML(u.displayName, u.avatar || '', 'feed-sidebar-right__avatar')}
                <div class="feed-sidebar-right__user-info">
                  <span class="feed-sidebar-right__user-name">${u.displayName}</span>
                  <span class="feed-sidebar-right__user-handle">@${u.username}</span>
                </div>
                <button class="feed-sidebar-right__follow-btn" data-username="${u.username}">+</button>
              </li>
            `).join('')}
          </ul>
          <a class="feed-sidebar-right__see-more" href="/pages/search.html">SEE MORE</a>
        </section>

        <section class="feed-sidebar-right__section">
          <h3 class="feed-sidebar-right__title">TRENDING TOPICS</h3>
          <ul class="feed-sidebar-right__topics">
            ${topics.map(t => `
              <li class="feed-sidebar-right__topic">
                <a class="feed-sidebar-right__topic-link" href="/pages/search.html?q=${encodeURIComponent(t)}">${t}</a>
              </li>
            `).join('')}
          </ul>
          <a class="feed-sidebar-right__see-more" href="/pages/search.html">SEE MORE</a>
        </section>
      </div>
    `;

    this.querySelectorAll('.feed-sidebar-right__follow-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const followed = btn.classList.toggle('feed-sidebar-right__follow-btn--followed');
        btn.textContent = followed ? '✓' : '+';
        this.dispatchEvent(new CustomEvent('follow-user', {
          detail: { username: btn.dataset.username },
          bubbles: true,
          composed: true,
        }));
      });
    });
  }
}

customElements.define('feed-sidebar-right', FeedSidebarRight);
