const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./input.css', import.meta.url);
document.head.appendChild(link);

export class UIInput extends HTMLElement {
  connectedCallback() {
    const name = this.getAttribute('name') || '';
    const type = this.getAttribute('type') || 'text';
    const label = this.getAttribute('label') || '';
    const placeholder = this.getAttribute('placeholder') || '';

    this.innerHTML = `
      <div class="ui-input">
        ${label ? `<label class="ui-input__label" for="input-${name}">${label}</label>` : ''}
        <input
          class="ui-input__field"
          id="input-${name}"
          type="${type}"
          name="${name}"
          placeholder="${placeholder}"
        >
      </div>
    `;

    this.querySelector('.ui-input__field').addEventListener('input', (e) => {
      this.dispatchEvent(new CustomEvent('ui-input', {
        detail: { name, value: e.target.value },
        bubbles: true,
        composed: true,
      }));
    });
  }
}

customElements.define('ui-input', UIInput);
