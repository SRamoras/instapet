import { avatarHTML } from '../../ui/avatar.js';

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./comment-item.css', import.meta.url);
document.head.appendChild(link);

export class CommentItem extends HTMLElement {
  connectedCallback() {
    const username    = this.getAttribute('username') || '';
    const displayName = this.getAttribute('display-name') || username;
    const avatar      = this.getAttribute('avatar') || '';
    const content     = this.getAttribute('content') || '';
    const time        = this.getAttribute('time') || '';

    this.innerHTML = `
      <div class="comment-item">
        ${avatarHTML(displayName, avatar, 'comment-item__avatar')}
        <div class="comment-item__body">
          <div class="comment-item__header">
            <a class="comment-item__username" href="/pages/profile.html?user=${username}">${displayName}</a>
            ${time ? `<span class="comment-item__time">${time}</span>` : ''}
          </div>
          <p class="comment-item__text">${content}</p>
        </div>
      </div>
    `;
  }
}

customElements.define('comment-item', CommentItem);
