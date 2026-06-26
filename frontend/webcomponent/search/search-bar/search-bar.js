import { avatarHTML } from '../../ui/avatar.js';

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./search-bar.css', import.meta.url);
document.head.appendChild(link);

export class SearchBar extends HTMLElement {
  #mode = 'tags';
  #allUsers = [];
  #allTags = [];
  #activeIdx = -1;

  connectedCallback() {
    this.innerHTML = `
      <div class="search-bar__wrap">
        <form class="search-bar__form" autocomplete="off">
          <svg class="search-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input class="search-bar__input" type="search" autocomplete="off" placeholder="Pesquisar por tag...">
        </form>
        <ul class="search-bar__autocomplete" hidden></ul>
      </div>
      <div class="search-bar__modes">
        <button class="search-bar__mode search-bar__mode--active" data-mode="tags">Tags</button>
        <button class="search-bar__mode" data-mode="users">Pessoas</button>
      </div>
    `;
    this._bindEvents();
  }

  setUsers(users) { this.#allUsers = users; }
  setTags(tags)   { this.#allTags  = tags;  }

  setValue(q) {
    const input = this._input();
    if (input) input.value = q;
  }

  setMode(mode) {
    this.#mode = mode;
    this._updateModeBtns();
    const input = this._input();
    if (input) input.placeholder = mode === 'tags' ? 'Pesquisar por tag...' : 'Pesquisar pessoas...';
  }

  get currentMode() { return this.#mode; }

  _input()  { return this.querySelector('.search-bar__input'); }
  _acList() { return this.querySelector('.search-bar__autocomplete'); }

  _bindEvents() {
    const input  = this._input();
    const acList = this._acList();

    this.querySelectorAll('.search-bar__mode').forEach(btn => {
      btn.addEventListener('click', () => {
        this.#mode = btn.dataset.mode;
        this._updateModeBtns();
        input.placeholder = this.#mode === 'tags' ? 'Pesquisar por tag...' : 'Pesquisar pessoas...';
        input.focus();
        this._hideAC();
        const q = input.value.trim();
        if (q) this._emit('search-submit', { query: q, mode: this.#mode });
      });
    });

    this.querySelector('.search-bar__form').addEventListener('submit', (e) => {
      e.preventDefault();
      const q = input.value.trim();
      this._hideAC();
      if (q) this._emit('search-submit', { query: q, mode: this.#mode });
    });

    input.addEventListener('input', () => {
      const q = input.value.trim();
      if (!q) { this._hideAC(); return; }
      this._showAC(this._buildSuggestions(q));
      this._emit('search-input', { query: q, mode: this.#mode });
    });

    input.addEventListener('keydown', (e) => {
      const items = acList.querySelectorAll('.search-bar__ac-item');
      if (!items.length || acList.hidden) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.#activeIdx = Math.min(this.#activeIdx + 1, items.length - 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.#activeIdx = Math.max(this.#activeIdx - 1, 0);
      } else if (e.key === 'Escape') {
        this._hideAC(); return;
      } else return;
      items.forEach((el, i) => el.classList.toggle('search-bar__ac-item--active', i === this.#activeIdx));
      const suggestions = this._buildSuggestions(input.value.trim());
      if (suggestions[this.#activeIdx]) input.value = suggestions[this.#activeIdx].value;
    });

    input.addEventListener('blur',  () => setTimeout(() => this._hideAC(), 150));
    input.addEventListener('focus', () => {
      const q = input.value.trim();
      if (q) this._showAC(this._buildSuggestions(q));
    });
  }

  _updateModeBtns() {
    this.querySelectorAll('.search-bar__mode').forEach(b =>
      b.classList.toggle('search-bar__mode--active', b.dataset.mode === this.#mode)
    );
  }

  _highlight(text, query) {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return text.slice(0, idx)
      + `<mark>${text.slice(idx, idx + query.length)}</mark>`
      + text.slice(idx + query.length);
  }

  _buildSuggestions(q) {
    const lower = q.toLowerCase().replace(/^#/, '');
    if (this.#mode === 'tags') {
      return this.#allTags
        .filter(t => t.replace(/^#/, '').includes(lower))
        .slice(0, 6)
        .map(t => ({
          value: t.replace(/^#/, ''),
          html: `<li class="search-bar__ac-item">
            <div class="search-bar__ac-tag-icon">#</div>
            <span>${this._highlight(t, q.startsWith('#') ? q : '#' + lower)}</span>
          </li>`,
        }));
    }
    return this.#allUsers
      .filter(u =>
        u.username.toLowerCase().includes(lower) ||
        (u.display_name || '').toLowerCase().includes(lower)
      )
      .slice(0, 6)
      .map(u => ({
        value: u.username,
        html: `<li class="search-bar__ac-item">
          ${avatarHTML(u.display_name || u.username, u.avatar_url || '', 'search-bar__ac-avatar')}
          <div class="search-bar__ac-user-info">
            <span class="search-bar__ac-user-name">${this._highlight(u.display_name || u.username, q)}</span>
            <span class="search-bar__ac-user-handle">@${this._highlight(u.username, lower)}</span>
          </div>
        </li>`,
      }));
  }

  _showAC(items) {
    this.#activeIdx = -1;
    const acList = this._acList();
    if (!items.length) { this._hideAC(); return; }
    acList.innerHTML = items.map(item => item.html).join('');
    acList.hidden = false;
    acList.querySelectorAll('.search-bar__ac-item').forEach((el, i) => {
      el.addEventListener('mousedown', (e) => {
        e.preventDefault();
        this._input().value = items[i].value;
        this._hideAC();
        this._emit('search-submit', { query: items[i].value, mode: this.#mode });
      });
    });
  }

  _hideAC() {
    this._acList().hidden = true;
    this.#activeIdx = -1;
  }

  _emit(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
  }
}

customElements.define('search-bar', SearchBar);
