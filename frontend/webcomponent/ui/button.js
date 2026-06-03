const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./button.css', import.meta.url);
document.head.appendChild(link);

export class UIButton extends HTMLElement {
  connectedCallback() {
    const text    = this.getAttribute('text') || 'Button';
    const icon    = this.getAttribute('icon') || '';
    const variant = this.getAttribute('variant') || 'primary';

    this.innerHTML = `
      <button class="ui-button ui-button--${variant}">
        ${icon ? `<span class="ui-button__icon">${icon}</span>` : ''}
        <span class="ui-button__text">${text}</span>
      </button>
    `;
  }
}

customElements.define('ui-button', UIButton);
