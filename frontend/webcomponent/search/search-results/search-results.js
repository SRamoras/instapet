const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./search-results.css', import.meta.url);
document.head.appendChild(link);

export class SearchResults extends HTMLElement {
  connectedCallback() {
    const usersAttr = this.getAttribute('users') || '[]';
    const activeTab = this.getAttribute('active-tab') || 'profiles';

    let users = [];
    try { users = JSON.parse(usersAttr); } catch {}

    this.innerHTML = `
      <div class="search-results">
        <div class="search-results__tabs">
          <button class="search-results__tab ${activeTab === 'profiles' ? 'search-results__tab--active' : ''}" data-tab="profiles">Profiles</button>
          <button class="search-results__tab ${activeTab === 'tags' ? 'search-results__tab--active' : ''}" data-tab="tags">Tags</button>
        </div>

        <ul class="search-results__list">
          ${users.length
            ? users.map(u => `
                <li class="search-results__item">
                  <a class="search-results__user-link" href="/pages/profile.html?user=${u.username}">
                    <img class="search-results__avatar" src="${u.avatar || `https://i.pravatar.cc/44?u=${u.username}`}" alt="${u.displayName || u.username}">
                    <div class="search-results__user-info">
                      <span class="search-results__user-name">${u.displayName || u.username}</span>
                      <span class="search-results__user-handle">@${u.username}</span>
                    </div>
                  </a>
                  <button class="search-results__follow-btn" data-username="${u.username}">Seguir</button>
                </li>
              `).join('')
            : `<li class="search-results__empty">Nenhum resultado encontrado.</li>`
          }
        </ul>
      </div>
    `;

    this.querySelectorAll('.search-results__tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.querySelectorAll('.search-results__tab').forEach(t => t.classList.remove('search-results__tab--active'));
        tab.classList.add('search-results__tab--active');
        this.dispatchEvent(new CustomEvent('tab-change', {
          detail: { tab: tab.dataset.tab },
          bubbles: true,
          composed: true,
        }));
      });
    });

    this.querySelectorAll('.search-results__follow-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const following = btn.classList.toggle('search-results__follow-btn--following');
        btn.textContent = following ? 'Seguindo' : 'Seguir';
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
