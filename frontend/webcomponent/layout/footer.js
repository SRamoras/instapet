export class AppFooter extends HTMLElement {
  connectedCallback() {
    const brand = this.getAttribute('brand') || 'Instapet';
    const year = this.getAttribute('year') || new Date().getFullYear();

    this.innerHTML = `
      <footer class="footer">

        <div class="footer__grid">

          <div class="footer__col">
            <div class="footer__title footer__brand">
              <span class="footer__brand-icon" aria-hidden="true">🐾</span>
              <span class="footer__brand-name">${brand}</span>
            </div>
            <p class="footer__desc">A melhor plataforma para partilhar momentos com o teu animal de estimação.</p>
          </div>

          <div class="footer__col">
            <div class="footer__title">
              Links
            </div>
            <ul class="footer__list">
              <li><a href="#">Home</a></li>
              <li><a href="#">Explorar</a></li>
              <li><a href="#">Sobre</a></li>
            </ul>
          </div>

          <div class="footer__col">
            <div class="footer__title">
              Contacto
            </div>
            <ul class="footer__list">
              <li>hello@instapet.com</li>
              <li>@instapet</li>
              <li>@instapet_support</li>
            </ul>
          </div>

        </div>

        <div class="footer__bottom">
          <p>© ${year} ${brand}. All rights reserved.</p>
        </div>

      </footer>
    `;
  }
}

customElements.define('app-footer', AppFooter);