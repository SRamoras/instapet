export class UIButton extends HTMLElement {
  connectedCallback() {
    const text = this.getAttribute('text') || 'Button';
    const icon = this.getAttribute('icon') || '';
    
    this.innerHTML = `
      <button class="ui-button">
        ${icon ? `<span class="ui-button__icon">${icon}</span>` : ''}
        <span class="ui-button__text">${text}</span>
      </button>
    `;
  }
}

customElements.define('ui-button', UIButton);