import { getSavedPosts } from '../../services/posts.js';

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./profile-grid.css', import.meta.url);
document.head.appendChild(link);

export class ProfileGrid extends HTMLElement {
  constructor() {
    super();

    this._posts = [];
    this._savedPosts = [];
    this._activeTab = 'pets';
    this._visibleCount = 12;
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="profile-grid">
        <nav class="profile-grid__tabs">
          <button class="profile-grid__tab profile-grid__tab--active" data-tab="pets">🐾 PETS</button>
          <button class="profile-grid__tab" data-tab="saved">📌 SAVED</button>
          <button class="profile-grid__tab" data-tab="tagged">↑ TAGGED</button>
        </nav>

        <div class="profile-grid__photos" id="profile-grid-photos"></div>

        <div class="profile-grid__footer" id="profile-grid-footer" hidden>
          <button class="profile-grid__more-btn" id="profile-grid-more">
            SEE MORE
          </button>
        </div>
      </div>
    `;

    this.querySelectorAll('.profile-grid__tab').forEach((tab) => {
      tab.addEventListener('click', async () => {
        this.querySelectorAll('.profile-grid__tab')
          .forEach(t => t.classList.remove('profile-grid__tab--active'));

        tab.classList.add('profile-grid__tab--active');

        this._activeTab = tab.dataset.tab;

        if (
          this._activeTab === 'saved' &&
          this._savedPosts.length === 0
        ) {
          try {
            this._savedPosts = await getSavedPosts();
          } catch (err) {
            console.error('Erro ao carregar saves', err);
            this._savedPosts = [];
          }
        }

        this._visibleCount = 12;
        this._render();
      });
    });

    this.querySelector('#profile-grid-more').addEventListener('click', () => {
      this._visibleCount += 12;
      this._render();
    });

    this._render();
  }

  setPosts(posts) {
    this._posts = posts;
    this._visibleCount = 12;
    this._render();
  }

  _render() {
    const photosEl = this.querySelector('#profile-grid-photos');
    const footerEl = this.querySelector('#profile-grid-footer');

    if (!photosEl) return;

    let posts = this._posts;

    if (this._activeTab === 'saved') {
      posts = this._savedPosts;
    }

    const withImages = posts.filter(p => p.image_url);
    const visible = withImages.slice(0, this._visibleCount);

    photosEl.innerHTML = '';

    if (!visible.length) {
      photosEl.innerHTML =
        '<p class="profile-grid__empty">Nenhuma foto ainda.</p>';

      footerEl.hidden = true;
      return;
    }

    visible.forEach((post) => {
      const a = document.createElement('a');

      a.className = 'profile-grid__item';
      a.href = `/pages/post.html?id=${post.id}`;

      a.innerHTML = `
        <img
          class="profile-grid__img"
          src="${post.image_url}"
          alt="post"
        >
      `;

      photosEl.appendChild(a);
    });

    footerEl.hidden =
      withImages.length <= this._visibleCount;
  }
}

customElements.define('profile-grid', ProfileGrid);