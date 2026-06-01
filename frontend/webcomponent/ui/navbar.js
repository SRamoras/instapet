class NavBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav class="navbar">
        <div class="logo">InstaPet</div>

        <ul class="links">
          <li>Home</li>
          <li>Search</li>
          <li>Profile</li>
        </ul>

        <ui-button text="Post"></ui-button>
      </nav>
    `;
  }
}

customElements.define('nav-bar', NavBar);