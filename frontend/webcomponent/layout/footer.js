const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./footer.css', import.meta.url);
document.head.appendChild(link);

export class AppFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="footer">
        <div class="footer__main">

          <div class="footer__brand-col">
            <div class="footer__brand">
              <span class="footer__brand-icon">🐾</span>
              <span class="footer__brand-name">InstaPet</span>
            </div>
            <p class="footer__tagline">A melhor rede social<br>para você e seu pet.</p>
            <div class="footer__socials">
              <a class="footer__social-btn" href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a class="footer__social-btn" href="#" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a class="footer__social-btn" href="#" aria-label="TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34l-.04-8.99a8.16 8.16 0 0 0 4.77 1.52V4.37a4.85 4.85 0 0 1-1-.68z"/>
                </svg>
              </a>
            </div>
          </div>

          <div class="footer__links-col">
            <h4 class="footer__col-title">Explore</h4>
            <ul class="footer__links">
              <li><a href="#">Raças</a></li>
              <li><a href="#">Adote</a></li>
              <li><a href="#">Dicas de Treino</a></li>
              <li><a href="#">Artigos</a></li>
            </ul>
          </div>

          <div class="footer__links-col">
            <h4 class="footer__col-title">Perfil</h4>
            <ul class="footer__links">
              <li><a href="#">Conta</a></li>
              <li><a href="#">Segurança</a></li>
              <li><a href="#">Ajuda</a></li>
              <li><a href="#">Notificações</a></li>
            </ul>
          </div>

          <div class="footer__links-col">
            <h4 class="footer__col-title">Empresa</h4>
            <ul class="footer__links">
              <li><a href="#">Sobre Nós</a></li>
              <li><a href="#">Carreiras</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contato</a></li>
            </ul>
          </div>

        </div>

        <div class="footer__bottom">
          <p class="footer__copyright">© copyright InstaPet. All rights reserved.</p>
          <nav class="footer__legal">
            <a href="#">Termos de Uso</a>
            <a href="#">Política de Privacidade</a>
            <a href="#">Cookies</a>
          </nav>
        </div>
      </footer>
    `;
  }
}

customElements.define('app-footer', AppFooter);
