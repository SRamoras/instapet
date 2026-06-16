import { avatarHTML } from './avatar.js';

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./postcard.css', import.meta.url);
document.head.appendChild(link);

class PostCard extends HTMLElement {
  connectedCallback() {
    const postId   = this.getAttribute('post-id') || '';
    const username = this.getAttribute('username') || '';
    const avatar   = this.getAttribute('avatar') || '';
    const caption  = this.getAttribute('caption') || '';
    const image    = this.getAttribute('image') || '';
    const likes    = this.getAttribute('likes') || '0';
    const comments = this.getAttribute('comments') || '0';

    this.innerHTML = `
      <article class="post-card">
        <header class="post-card__header">
          ${avatarHTML(username, avatar, 'post-card__avatar')}
          <a class="post-card__username" href="/pages/profile.html?user=${username}">@${username}</a>
          <a class="post-card__more-link" href="/pages/post.html?id=${postId}" title="Ver post">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>
            </svg>
          </a>
        </header>

        ${image ? `
          <a class="post-card__image-wrap" href="/pages/post.html?id=${postId}">
            <img class="post-card__image" src="${image}" alt="post de ${username}">
          </a>
        ` : ''}

        <div class="post-card__body">
          ${caption ? `<p class="post-card__caption"><strong>@${username}</strong> ${caption}</p>` : ''}

          <div class="post-card__actions">
            <button class="post-card__action-btn post-card__action-btn--like" data-id="${postId}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span>${likes}</span>
            </button>

            <button class="post-card__action-btn post-card__action-btn--comment" data-id="${postId}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span>${comments}</span>
            </button>

            <button class="post-card__action-btn post-card__action-btn--save" data-id="${postId}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </article>
    `;

    this.querySelector('.post-card__action-btn--like').addEventListener('click', (e) => {
      e.currentTarget.classList.toggle('post-card__action-btn--liked');
      this.dispatchEvent(new CustomEvent('post-like', { detail: { postId }, bubbles: true, composed: true }));
    });

    this.querySelector('.post-card__action-btn--comment').addEventListener('click', () => {
      window.location.href = `/pages/post.html?id=${postId}`;
    });

    this.querySelector('.post-card__action-btn--save').addEventListener('click', (e) => {
      e.currentTarget.classList.toggle('post-card__action-btn--saved');
      this.dispatchEvent(new CustomEvent('post-save', { detail: { postId }, bubbles: true, composed: true }));
    });
  }
}

customElements.define('post-card', PostCard);
