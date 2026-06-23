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
              <img class="footer__brand-img" src="/img/logoinstapet1.png" alt="InstaPet">
            </div>
            <p class="footer__tagline">A rede social<br>para ti e o teu pet.</p>
          </div>

          <div class="footer__links-col">
            <h4 class="footer__col-title">Navegar</h4>
            <ul class="footer__links">
              <li><a href="/pages/feed.html">Feed</a></li>
              <li><a href="/pages/search.html">Explorar</a></li>
              <li><a href="/pages/profile.html">Perfil</a></li>
            </ul>
          </div>

          <div class="footer__links-col">
            <h4 class="footer__col-title">Legal</h4>
            <ul class="footer__links">
              <li><a href="/pages/terms.html">Termos de Uso</a></li>
            </ul>
          </div>

        </div>

        <div class="footer__bottom">
          <p class="footer__copyright">© ${new Date().getFullYear()} InstaPet. Todos os direitos reservados.</p>
          <nav class="footer__legal">
            <a href="/pages/terms.html">Termos de Uso</a>
          </nav>
        </div>
      </footer>
    `;
  }
}

customElements.define('app-footer', AppFooter);
