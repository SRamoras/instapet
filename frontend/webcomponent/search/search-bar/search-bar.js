const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./search-bar.css', import.meta.url);
document.head.appendChild(link);

export class SearchBar extends HTMLElement {
  connectedCallback() {
    const placeholder = this.getAttribute('placeholder') || 'Pesquisar...';
    const value       = this.getAttribute('value') || '';

    this.innerHTML = `
      <form class="search-bar" id="search-bar-form">
        <button class="search-bar__filter-btn" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          Filter
        </button>
        <div class="search-bar__input-wrap">
          <svg class="search-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            class="search-bar__input"
            type="search"
            name="q"
            placeholder="${placeholder}"
            value="${value}"
            autocomplete="off"
          >
        </div>
      </form>
    `;

    this.querySelector('#search-bar-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const q = this.querySelector('.search-bar__input').value.trim();
      this.dispatchEvent(new CustomEvent('search-submit', {
        detail: { query: q },
        bubbles: true,
        composed: true,
      }));
    });

    this.querySelector('.search-bar__input').addEventListener('input', (e) => {
      this.dispatchEvent(new CustomEvent('search-input', {
        detail: { query: e.target.value },
        bubbles: true,
        composed: true,
      }));
    });

    this.querySelector('.search-bar__filter-btn').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('filter-open', { bubbles: true, composed: true }));
    });
  }
}

customElements.define('search-bar', SearchBar);
