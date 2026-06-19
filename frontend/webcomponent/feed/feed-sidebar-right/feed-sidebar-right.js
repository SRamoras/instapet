import { avatarHTML } from '../../ui/avatar.js';
import { getUsers, followUser, unfollowUser } from '../../../services/users.js';
import { getPopularTags } from '../../../services/posts.js';

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./feed-sidebar-right.css', import.meta.url);
document.head.appendChild(link);

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export class FeedSidebarRight extends HTMLElement {
  async connectedCallback() {
    this.innerHTML = `
      <div class="feed-sidebar-right">
        <section class="feed-sidebar-right__section">
          <h3 class="feed-sidebar-right__title">WHO TO FOLLOW</h3>
          <ul class="feed-sidebar-right__list" id="fsr-suggestions">
            <li class="feed-sidebar-right__loading">A carregar...</li>
          </ul>
        </section>

        <section class="feed-sidebar-right__section">
          <h3 class="feed-sidebar-right__title">TRENDING TOPICS</h3>
          <ul class="feed-sidebar-right__topics" id="fsr-topics">
            <li class="feed-sidebar-right__loading">A carregar...</li>
          </ul>
        </section>
      </div>
    `;

    this._loadUsers();
    this._loadTags();
  }

  async _loadUsers() {
    const list = this.querySelector('#fsr-suggestions');
    try {
      const users = await getUsers();
      const suggestions = shuffle(users).slice(0, 3);

      if (!suggestions.length) {
        list.innerHTML = '<li class="feed-sidebar-right__loading">Nenhum utilizador ainda.</li>';
        return;
      }

      list.innerHTML = suggestions.map(u => `
        <li class="feed-sidebar-right__suggest">
          ${avatarHTML(u.display_name || u.username, u.avatar_url || '', 'feed-sidebar-right__avatar')}
          <div class="feed-sidebar-right__user-info">
            <span class="feed-sidebar-right__user-name">${u.display_name || u.username}</span>
            <span class="feed-sidebar-right__user-handle">@${u.username}</span>
          </div>
          <button
            class="feed-sidebar-right__follow-btn ${u.followed_by_me ? 'feed-sidebar-right__follow-btn--followed' : ''}"
            data-username="${u.username}"
            data-following="${u.followed_by_me ? 'true' : 'false'}"
          >${u.followed_by_me ? 'Following' : 'Follow'}</button>
        </li>
      `).join('');

      list.querySelectorAll('.feed-sidebar-right__follow-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const username  = btn.dataset.username;
          const following = btn.dataset.following === 'true';
          btn.disabled = true;
          try {
            if (following) {
              await unfollowUser(username);
              btn.dataset.following = 'false';
              btn.textContent = 'Follow';
              btn.classList.remove('feed-sidebar-right__follow-btn--followed');
            } else {
              await followUser(username);
              btn.dataset.following = 'true';
              btn.textContent = 'Following';
              btn.classList.add('feed-sidebar-right__follow-btn--followed');
            }
          } catch (err) {
            console.error('follow error', err);
          } finally {
            btn.disabled = false;
          }
        });
      });
    } catch (err) {
      console.error('suggestions error', err);
      list.innerHTML = '<li class="feed-sidebar-right__loading">Erro ao carregar.</li>';
    }
  }

  async _loadTags() {
    const list = this.querySelector('#fsr-topics');
    try {
      const tags = await getPopularTags();

      if (!tags.length) {
        list.innerHTML = '<li class="feed-sidebar-right__loading">Sem tópicos ainda.</li>';
        return;
      }

      list.innerHTML = tags.slice(0, 6).map(t => `
        <li class="feed-sidebar-right__topic">
          <a class="feed-sidebar-right__topic-link" href="/pages/search.html?q=${encodeURIComponent(t)}">${t}</a>
        </li>
      `).join('');
    } catch (err) {
      console.error('tags error', err);
      list.innerHTML = '<li class="feed-sidebar-right__loading">Erro ao carregar.</li>';
    }
  }
}

customElements.define('feed-sidebar-right', FeedSidebarRight);
