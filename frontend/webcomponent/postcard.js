class PostCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const username = this.getAttribute('username') || 'usuario';
        const petName = this.getAttribute('pet-name') || 'Pet';
        const image = this.getAttribute('image') || '';
        const caption = this.getAttribute('caption') || '';
        const likes = this.getAttribute('likes') || '0';
        const avatar = this.getAttribute('avatar') || '';
        const avatarMarkup = avatar
            ? `<img class="post-avatar" src="${avatar}" alt="${username}">`
            : `<div class="post-placeholder">${username.charAt(0).toUpperCase()}</div>`;
        const imageMarkup = image
            ? `<img class="post-image" src="${image}" alt="${petName}">`
            : `<div class="post-image" aria-label="${petName}"></div>`;

        this.shadowRoot.innerHTML = `
            <style>
                .post-card {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    margin-bottom: 24px;
                    overflow: hidden;
                    color: #222;
                    font-family: inherit;
                }

                .post-header {
                    display: flex;
                    align-items: center;
                    padding: 12px 16px;
                    gap: 10px;
                }

                .post-avatar {
                    width: 40px;
                    height: 40px;
                    object-fit: cover;
                    background: #ddd;
                    border-radius: 50%;
                }

                .post-placeholder {
                    width: 40px;
                    height: 40px;
                    display: grid;
                    place-items: center;
                    color: #666;
                    font-weight: bold;
                    background: #ddd;
                    border-radius: 50%;
                    font-size: 0.8rem;
                }

                .post-username { font-weight: bold; font-size: 0.9rem; }
                .post-pet { color: #888; font-size: 0.8rem; }

                .post-image {
                    width: 100%;
                    aspect-ratio: 1;
                    display: block;
                    object-fit: cover;
                    background: #eee;
                }

                .post-actions {
                    display: flex;
                    gap: 12px;
                    padding: 12px 16px 8px;
                }

                .action-btn {
                    border: none;
                    cursor: pointer;
                    background: none;
                    padding: 0;
                    font-size: 1.4rem;
                }

                .post-likes {
                    padding: 0 16px 4px;
                    font-weight: bold;
                    font-size: 0.9rem;
                }

                .post-caption {
                    padding: 4px 16px 16px;
                    font-size: 0.9rem;
                }

                .post-caption strong { margin-right: 6px; }
            </style>

            <div class="post-card">
                <div class="post-header">
                    ${avatarMarkup}
                    <div>
                        <div class="post-username">${username}</div>
                        <div class="post-pet">${petName}</div>
                    </div>
                </div>
                ${imageMarkup}
                <div class="post-actions">
                    <button class="action-btn like-btn">🤍</button>
                    <button class="action-btn">💬</button>
                    <button class="action-btn">📤</button>
                </div>
                <div class="post-likes"><span class="likes-count">${likes}</span> curtidas</div>
                <div class="post-caption"><strong>${username}</strong>${caption}</div>
            </div>
        `;

        const likeBtn = this.shadowRoot.querySelector('.like-btn');
        const countEl = this.shadowRoot.querySelector('.likes-count');
        likeBtn.addEventListener('click', () => {
            if (likeBtn.textContent === '🤍') {
                likeBtn.textContent = '❤️';
                countEl.textContent = parseInt(countEl.textContent) + 1;
            } else {
                likeBtn.textContent = '🤍';
                countEl.textContent = parseInt(countEl.textContent) - 1;
            }
        });
    }
}

customElements.define('post-card', PostCard);
