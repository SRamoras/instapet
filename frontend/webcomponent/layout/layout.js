const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./layout.css', import.meta.url);
document.head.appendChild(link);

class Layout extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${new URL('./layout.css', import.meta.url)}">
      <nav-bar></nav-bar>
      <main class="layout__content">
        <slot></slot>
      </main>
      <app-footer></app-footer>
    `;
  }
}

customElements.define('layout', Layout);