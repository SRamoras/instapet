const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./saved-grid.css', import.meta.url);
document.head.appendChild(link);

export class SavedGrid extends HTMLElement {
  constructor() {
    super();
    this._posts = [];
    this._visibleCount = 12;
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="saved-grid">
        <div class="saved-grid__header">
          <h2 class="saved-grid__title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            Posts Guardados
          </h2>
        </div>
        <div class="saved-grid__photos" id="saved-photos"></div>
        <div class="saved-grid__footer" id="saved-footer" hidden>
          <button class="saved-grid__more-btn" id="saved-more">VER MAIS</button>
        </div>
      </div>
    `;

    this.querySelector('#saved-more').addEventListener('click', () => {
      this._visibleCount += 12;
      this._render();
    });
  }

  setPosts(posts) {
    this._posts = posts;
    this._visibleCount = 12;
    this._render();
  }

  setError() {
    const photosEl = this.querySelector('#saved-photos');
    if (!photosEl) return;
    photosEl.innerHTML = `
      <p class="saved-grid__empty-text" style="padding: 40px; text-align: center; color: #D05050;">
        Erro ao carregar posts guardados.
      </p>
    `;
  }

  _render() {
    const photosEl = this.querySelector('#saved-photos');
    const footerEl = this.querySelector('#saved-footer');
    if (!photosEl) return;

    const withImages = this._posts.filter(p => p.image_url);
    const visible = withImages.slice(0, this._visibleCount);

    photosEl.innerHTML = '';

    if (!visible.length) {
      photosEl.innerHTML = `
        <div class="saved-grid__empty">
          <svg class="saved-grid__empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          <p class="saved-grid__empty-text">Ainda não guardaste nenhum post.</p>
        </div>
      `;
      footerEl.hidden = true;
      return;
    }

    visible.forEach((post) => {
      const a = document.createElement('a');
      a.className = 'saved-grid__item';
      a.href = `/pages/post.html?id=${post.id}`;
      a.innerHTML = `<img class="saved-grid__img" src="${post.image_url}" alt="post guardado">`;
      photosEl.appendChild(a);
    });

    footerEl.hidden = withImages.length <= this._visibleCount;
  }
}

customElements.define('saved-grid', SavedGrid);
