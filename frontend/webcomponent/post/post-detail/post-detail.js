import { avatarHTML } from '../../ui/avatar.js';

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./post-detail.css', import.meta.url);
document.head.appendChild(link);

export class PostDetail extends HTMLElement {
  connectedCallback() {
    const postId   = this.getAttribute('post-id') || '';
    const username = this.getAttribute('username') || '';
    const avatar   = this.getAttribute('avatar') || '';
    const image    = this.getAttribute('image') || '';
    const caption  = this.getAttribute('caption') || '';
    const likes    = this.getAttribute('likes') || '0';
    const comments = this.getAttribute('comments') || '0';
    const time     = this.getAttribute('time') || '';
    let liked = this.getAttribute('liked-by-me') === 'true';
    let saved = this.getAttribute('saved-by-me') === 'true';

    this.innerHTML = `
      <article class="post-detail">
        <header class="post-detail__header">
          ${avatarHTML(username, avatar, 'post-detail__avatar')}
          <div class="post-detail__header-info">
            <a class="post-detail__username" href="/pages/profile.html?user=${username}">@${username}</a>
            ${time ? `<span class="post-detail__time">${time}</span>` : ''}
          </div>
          <button class="post-detail__more-btn" aria-label="Mais opções">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>
            </svg>
          </button>
        </header>

        ${image ? `<img class="post-detail__image" src="${image}" alt="post de ${username}">` : ''}

        <div class="post-detail__body">
          <div class="post-detail__actions">
            <button class="post-detail__action-btn post-detail__action-btn--like" data-id="${postId}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span class="post-detail__like-count">${likes}</span>
            </button>

            <button class="post-detail__action-btn post-detail__action-btn--comment">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span>${comments}</span>
            </button>

            <button class="post-detail__action-btn post-detail__action-btn--share">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"/>
              </svg>
            </button>

            <button class="post-detail__action-btn post-detail__action-btn--save" data-id="${postId}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
          </div>

          ${caption ? `
            <p class="post-detail__caption">
              <a class="post-detail__caption-user" href="/pages/profile.html?user=${username}">@${username}</a>
              ${caption}
            </p>
          ` : ''}

          <div class="post-detail__comments-section">
            <slot></slot>
          </div>
        </div>
      </article>
    `;

    const likeBtn = this.querySelector('.post-detail__action-btn--like');
    const saveBtn = this.querySelector('.post-detail__action-btn--save');

    if (liked) likeBtn.classList.add('post-detail__action-btn--liked');
    if (saved) saveBtn.classList.add('post-detail__action-btn--saved');

    likeBtn.addEventListener('click', (e) => {
      liked = !liked;
      e.currentTarget.classList.toggle('post-detail__action-btn--liked');
      this.dispatchEvent(new CustomEvent('post-like', { detail: { postId, liked }, bubbles: true, composed: true }));
    });

    saveBtn.addEventListener('click', (e) => {
      saved = !saved;
      e.currentTarget.classList.toggle('post-detail__action-btn--saved');
      this.dispatchEvent(new CustomEvent('post-save', { detail: { postId, saved }, bubbles: true, composed: true }));
    });

    this.querySelector('.post-detail__action-btn--share').addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({ url: window.location.href });
      } else {
        navigator.clipboard?.writeText(window.location.href);
      }
    });
  }
}

customElements.define('post-detail', PostDetail);
