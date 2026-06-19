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
    const mine     = this.getAttribute('mine') === 'true';
    const time     = this.getAttribute('time') || '';
    let caption    = this.getAttribute('caption') || '';
    let likes      = this.getAttribute('likes') || '0';
    let comments   = this.getAttribute('comments') || '0';
    let liked      = this.getAttribute('liked-by-me') === 'true';
    let saved      = this.getAttribute('saved-by-me') === 'true';
    let tags = [];
    try { tags = JSON.parse(this.getAttribute('tags') || '[]'); } catch {}

    this.innerHTML = `
      <article class="post-detail">
        <header class="post-detail__header">
          ${avatarHTML(username, avatar, 'post-detail__avatar')}
          <div class="post-detail__header-info">
            <a class="post-detail__username" href="/pages/profile.html?user=${username}">@${username}</a>
            ${time ? `<span class="post-detail__time">${time}</span>` : ''}
          </div>
          ${mine ? `
            <div class="post-detail__menu-wrap">
              <button class="post-detail__more-btn" aria-label="Mais opções">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>
                </svg>
              </button>
              <div class="post-detail__dropdown" hidden>
                <button class="post-detail__dropdown-item post-detail__dropdown-item--edit">
                  <span class="material-symbols-outlined">edit</span> Editar
                </button>
                <button class="post-detail__dropdown-item post-detail__dropdown-item--delete">
                  <span class="material-symbols-outlined">delete</span> Apagar
                </button>
              </div>
            </div>
          ` : ''}
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

          <div class="post-detail__caption-wrap">
            ${caption ? `
              <p class="post-detail__caption">
                <a class="post-detail__caption-user" href="/pages/profile.html?user=${username}">@${username}</a>
                <span class="post-detail__caption-text">${caption}</span>
              </p>
            ` : ''}
            ${tags.length ? `<div class="post-detail__tags">${tags.map(t => `<a class="post-detail__tag" href="/pages/search.html?q=${encodeURIComponent(t)}">#${t}</a>`).join('')}</div>` : ''}
          </div>

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
      const countEl = e.currentTarget.querySelector('.post-detail__like-count');
      countEl.textContent = Math.max(0, parseInt(countEl.textContent || '0') + (liked ? 1 : -1));
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

    if (mine) {
      const menuWrap  = this.querySelector('.post-detail__menu-wrap');
      const moreBtn   = this.querySelector('.post-detail__more-btn');
      const dropdown  = this.querySelector('.post-detail__dropdown');
      const editBtn   = this.querySelector('.post-detail__dropdown-item--edit');
      const deleteBtn = this.querySelector('.post-detail__dropdown-item--delete');

      moreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.hidden = !dropdown.hidden;
      });

      document.addEventListener('click', () => { dropdown.hidden = true; }, { capture: true });

      deleteBtn.addEventListener('click', () => {
        dropdown.hidden = true;
        this.dispatchEvent(new CustomEvent('post-delete', { detail: { postId }, bubbles: true }));
      });

      editBtn.addEventListener('click', () => {
        dropdown.hidden = true;
        this._startEdit(caption);
      });
    }
  }

  _startEdit(currentCaption) {
    const wrap = this.querySelector('.post-detail__caption-wrap');
    wrap.innerHTML = `
      <div class="post-detail__edit-form">
        <textarea class="post-detail__edit-textarea" rows="3">${currentCaption}</textarea>
        <div class="post-detail__edit-actions">
          <button class="post-detail__edit-cancel">Cancelar</button>
          <button class="post-detail__edit-save">Guardar</button>
        </div>
      </div>
    `;

    const textarea  = wrap.querySelector('.post-detail__edit-textarea');
    const saveBtn   = wrap.querySelector('.post-detail__edit-save');
    const cancelBtn = wrap.querySelector('.post-detail__edit-cancel');
    const postId    = this.getAttribute('post-id');
    const username  = this.getAttribute('username');

    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);

    cancelBtn.addEventListener('click', () => this._renderCaption(currentCaption, username));

    saveBtn.addEventListener('click', () => {
      const newContent = textarea.value.trim();
      if (!newContent) return;
      this.dispatchEvent(new CustomEvent('post-edit', {
        detail: { postId, content: newContent },
        bubbles: true,
      }));
    });
  }

  _renderCaption(caption, username) {
    const wrap = this.querySelector('.post-detail__caption-wrap');
    wrap.innerHTML = caption ? `
      <p class="post-detail__caption">
        <a class="post-detail__caption-user" href="/pages/profile.html?user=${username}">@${username}</a>
        <span class="post-detail__caption-text">${caption}</span>
      </p>
    ` : '';
  }

  updateCaption(newCaption) {
    const username = this.getAttribute('username');
    this._renderCaption(newCaption, username);
  }
}

customElements.define('post-detail', PostDetail);
