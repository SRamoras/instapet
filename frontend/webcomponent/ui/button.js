export class UIButton extends HTMLElement {
  connectedCallback() {
    const text = this.getAttribute('text') || 'Button';
    this.innerHTML = `
      <button class="ui-button">
        ${text}
      </button>
    `;
  }
}
customElements.define('ui-button', UIButton);