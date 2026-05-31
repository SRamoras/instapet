class UserCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const username = this.getAttribute('username') || 'usuario';
        const petName = this.getAttribute('pet-name') || 'Pet';
        const avatar = this.getAttribute('avatar') || '';
        const posts = this.getAttribute('posts') || '0';
        const followers = this.getAttribute('followers') || '0';
        const following = this.getAttribute('following') || '0';
        const avatarMarkup = avatar
            ? `<img class="user-avatar" src="${avatar}" alt="${username}">`
            : `<div class="user-placeholder">${username.charAt(0).toUpperCase()}</div>`;

        this.shadowRoot.innerHTML = `
            <style>
                .user-card {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    padding: 20px;
                    text-align: center;
                    font-family: inherit;
                }

                .user-avatar {
                    width: 80px;
                    height: 80px;
                    display: block;
                    margin: 0 auto 12px;
                    border-radius: 50%;
                    object-fit: cover;
                }

                .user-placeholder {
                    width: 80px;
                    height: 80px;
                    display: grid;
                    place-items: center;
                    color: #666;
                    font-weight: bold;
                    background: #ddd;
                    border-radius: 50%;
                    margin: 0 auto 12px;
                    font-size: 1.25rem;
                }

                .user-name { font-size: 1rem; margin-bottom: 4px; font-weight: bold; }
                .user-pet { font-size: 0.85rem; margin-bottom: 16px; color: #888; }

                .user-stats { display: flex; justify-content: space-around; margin-bottom: 16px; }
                .stat { display: flex; flex-direction: column; align-items: center; }
                .stat-num { font-size: 1rem; font-weight: bold; }
                .stat-label { font-size: 0.75rem; color: #888; }

                .follow-btn {
                    background: #9be622;
                    color: white;
                    border-radius: 8px;
                    padding: 8px 32px;
                    font-size: 0.9rem;
                    font-weight: bold;
                    transition: background 0.2s;
                    border: none;
                    cursor: pointer;
                }

                .follow-btn:hover { background: #70cf17; }
                .follow-btn.following { background: #eee; color: #333; }
            </style>

            <div class="user-card">
                ${avatarMarkup}
                <div class="user-name">${username}</div>
                <div class="user-pet">🐾 ${petName}</div>
                <div class="user-stats">
                    <div class="stat">
                        <span class="stat-num">${posts}</span>
                        <span class="stat-label">posts</span>
                    </div>
                    <div class="stat">
                        <span class="stat-num">${followers}</span>
                        <span class="stat-label">seguidores</span>
                    </div>
                    <div class="stat">
                        <span class="stat-num">${following}</span>
                        <span class="stat-label">seguindo</span>
                    </div>
                </div>
                <button class="follow-btn">Seguir</button>
            </div>
        `;

        const btn = this.shadowRoot.querySelector('.follow-btn');
        btn.addEventListener('click', () => {
            if (btn.classList.contains('following')) {
                btn.classList.remove('following');
                btn.textContent = 'Seguir';
            } else {
                btn.classList.add('following');
                btn.textContent = 'Seguindo ✓';
            }
        });
    }
}

customElements.define('user-card', UserCard);
