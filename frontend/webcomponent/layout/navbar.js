const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./navbar.css', import.meta.url);
document.head.appendChild(link);

class NavBar extends HTMLElement {
  connectedCallback() {
    const logo = this.getAttribute('logo') || 'InstaPet';
    const avatar = this.getAttribute('avatar') || 'https://i.pravatar.cc/40';

    this.innerHTML = `
      <nav class="navbar">

        <div class="navbar__logo">${logo}</div>

        <div class="navbar__search">
          <input type="text" class="navbar__search-input" placeholder="Pesquisar...">
        </div>

        <div class="navbar__user">
          <img class="navbar__avatar" src="${avatar}" alt="avatar">
          <div class="navbar__dropdown">
            <a href="/profile.html">Perfil</a>
            <a href="/settings.html">Definições</a>
            <a href="/logout">Sair</a>
          </div>
        </div>

      </nav>
    `;

    this.querySelector('.navbar__avatar').addEventListener('click', () => {
      this.querySelector('.navbar__dropdown').classList.toggle('open');
    });
  }
}

customElements.define('nav-bar', NavBar);