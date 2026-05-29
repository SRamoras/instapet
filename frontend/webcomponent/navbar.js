class NavBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <style>
                .navbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 24px;
                    background: black;
                    border-bottom: 1px solid #eee;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }
                .navbar-logo {
                    font-size: 1.2rem;
                    color: #9be622;
                }
                .navbar-icons {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .icon-btn {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                }
                .avatar {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: #ddd;
                    cursor: pointer;
                }
            </style>

            <nav class="navbar">
                <div class="navbar-logo">
                    🐾 Insta<strong>Pet</strong>
                </div>
                <div class="navbar-icons">
                    <button class="icon-btn">🔍</button>
                    <button class="icon-btn">🔔</button>
                    <div class="avatar"></div>
                </div>
            </nav>
        `;
    }
}

customElements.define('nav-bar', NavBar);