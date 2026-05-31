class NavBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; }
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
                    color: #91e622;
                }

                .navbar-icons {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .icon-btn {
                    background: none;
                    border: none;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                    padding: 6px;
                    cursor: pointer;
                    color: #fff;
                    border-radius: 8px;
                    transition: background 0.15s, transform 0.08s;
                }

                .icon-btn:hover { background: rgba(255,255,255,0.04); transform: translateY(-1px); }
                .icon-btn:active { transform: translateY(0); }
                .icon-btn svg { width: 20px; height: 20px; display: block; }

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
                    <button class="icon-btn" aria-label="Pesquisar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <circle cx="11" cy="11" r="7"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                    <button class="icon-btn" aria-label="Notificações">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                    </button>
                    <div class="avatar" role="img" aria-label="Avatar"></div>
                </div>
            </nav>
        `;
    }
}

customElements.define('nav-bar', NavBar);