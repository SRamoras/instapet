class PostCard extends HTMLElement {
    connectedCallback() {
        const username = this.getAttribute('username') || 'usuario';
        const petName = this.getAttribute('pet-name') || 'Pet';
        const image = this.getAttribute('image') || '';
        const caption = this.getAttribute('caption') || '';
        const likes = this.getAttribute('likes') || '0';
        const avatar = this.getAttribute('avatar') || '';

        this.innerHTML = `
            <style>
                .post-card {
                    background: white;
                    border-radius: 12px;
                    margin-bottom: 24px;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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
                    border-radius: 50%;
                    object-fit: cover;
                    background: #ddd;
                }
                .post-username {
                    font-weight: bold;
                    font-size: 0.9rem;
                }
                .post-pet {
                    font-size: 0.8rem;
                    color: #888;
                }
                .post-image {
                    width: 100%;
                    aspect-ratio: 1;
                    object-fit: cover;
                    background: #eee;
                    display: block;
                }
                .post-actions {
                    display: flex;
                    gap: 12px;
                    padding: 12px 16px 8px;
                }
                .action-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 1.4rem;
                    padding: 0;
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
                .post-caption strong {
                    margin-right: 6px;
                }
            </style>

            <div class="post-card">
                <div class="post-header">
                    <img class="post-avatar" src="${avatar}" alt="${username}">
                    <div>
                        <div class="post-username">${username}</div>
                        <div class="post-pet">${petName}</div>
                    </div>
                </div>
                <img class="post-image" src="${image}" alt="${petName}">
                <div class="post-actions">
                    <button class="action-btn like-btn">🤍</button>
                    <button class="action-btn">💬</button>
                    <button class="action-btn">📤</button>
                </div>
                <div class="post-likes"><span class="likes-count">${likes}</span> curtidas</div>
                <div class="post-caption"><strong>${username}</strong>${caption}</div>
            </div>
        `;

        this.querySelector('.like-btn').addEventListener('click', (e) => {
            const btn = e.currentTarget;
            const countEl = this.querySelector('.likes-count');
            if (btn.textContent === '🤍') {
                btn.textContent = '❤️';
                countEl.textContent = parseInt(countEl.textContent) + 1;
            } else {
                btn.textContent = '🤍';
                countEl.textContent = parseInt(countEl.textContent) - 1;
            }
        });
    }
}

customElements.define('post-card', PostCard);
