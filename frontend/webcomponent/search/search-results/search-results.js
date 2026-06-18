import { avatarHTML } from '../../ui/avatar.js';

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./search-results.css', import.meta.url);
document.head.appendChild(link);

export class SearchResults extends HTMLElement {
  connectedCallback() {
    const usersAttr = this.getAttribute('users') || '[]';

    let users = [];
    try { users = JSON.parse(usersAttr); } catch {}

    this.innerHTML = `
      <div class="search-results">
        <ul class="search-results__grid">
          ${users.length
            ? users.map(u => `
                <li class="search-results__item">
                  <a class="search-results__user-link" href="/pages/profile.html?user=${u.username}">
                    ${avatarHTML(u.displayName || u.username, u.avatar || '', 'search-results__avatar')}
                    <div class="search-results__user-info">
                      <span class="search-results__user-name">${u.displayName || u.username}</span>
                      <span class="search-results__user-handle">@${u.username} · ${u.postCount ?? 0} posts</span>
                    </div>
                  </a>
                  <ui-button class="search-results__follow-btn" variant="primary" text="Seguir" data-username="${u.username}"></ui-button>
                </li>
              `).join('')
            : `<li class="search-results__empty">Nenhum resultado encontrado.</li>`
          }
        </ul>
      </div>
    `;

    this.querySelectorAll('.search-results__follow-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const innerBtn = btn.querySelector('.ui-button');
        const textEl   = btn.querySelector('.ui-button__text');
        const following = innerBtn.classList.toggle('ui-button--ghost');
        innerBtn.classList.toggle('ui-button--primary', !following);
        textEl.textContent = following ? 'Seguindo' : 'Seguir';
        this.dispatchEvent(new CustomEvent('follow-user', {
          detail: { username: btn.dataset.username },
          bubbles: true,
          composed: true,
        }));
      });
    });
  }
}

customElements.define('search-results', SearchResults);
