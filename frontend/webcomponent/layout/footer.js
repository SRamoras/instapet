const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./footer.css', import.meta.url);
document.head.appendChild(link);

const logoUrl = new URL('../../img/logoinstapetse.png', import.meta.url);

export class AppFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="footer">
        <div class="footer__main">

          <div class="footer__brand-col">
            <div class="footer__brand">
              <img class="footer__brand-logo" src="${logoUrl}" alt="InstaPet">
            </div>
            <p class="footer__tagline">A melhor rede social<br>para você e seu pet.</p>
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
