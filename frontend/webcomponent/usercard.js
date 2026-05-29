class UserCard extends HTMLElement {
    connectedCallback() {
        const username = this.getAttribute('username') || 'usuario';
        const petName = this.getAttribute('pet-name') || 'Pet';
        const avatar = this.getAttribute('avatar') || '';
        const posts = this.getAttribute('posts') || '0';
        const followers = this.getAttribute('followers') || '0';
        const following = this.getAttribute('following') || '0';

        this.innerHTML = `
            <style>
                .user-card {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    text-align: center;
                }
                .user-avatar {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    object-fit: cover;
                    background: #ddd;
                    margin: 0 auto 12px;
                    display: block;
                    border: 3px solid #6ae622;
                }
                .user-name {
                    font-weight: bold;
                    font-size: 1rem;
                    margin-bottom: 4px;
                }
                .user-pet {
                    color: #888;
                    font-size: 0.85rem;
                    margin-bottom: 16px;
                }
                .user-stats {
                    display: flex;
                    justify-content: space-around;
                    margin-bottom: 16px;
                }
                .stat {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .stat-num {
                    font-weight: bold;
                    font-size: 1rem;
                }
                .stat-label {
                    font-size: 0.75rem;
                    color: #888;
                }
                .follow-btn {
                    background: #9be622;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 8px 32px;
                    font-size: 0.9rem;
                    cursor: pointer;
                    font-weight: bold;
                    transition: background 0.2s;
                }
                .follow-btn:hover { background: #70cf17; }
                .follow-btn.following {
                    background: #eee;
                    color: #333;
                }
            </style>

            <div class="user-card">
                <img class="user-avatar" src="${avatar}" alt="${username}">
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

        this.querySelector('.follow-btn').addEventListener('click', (e) => {
            const btn = e.currentTarget;
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
