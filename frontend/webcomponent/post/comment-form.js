const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./comment-form.css', import.meta.url);
document.head.appendChild(link);

export class CommentForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <form class="comment-form" id="comment-form">
        <input
          class="comment-form__input"
          type="text"
          name="content"
          placeholder="Escreve um comentário..."
          autocomplete="off"
        >
        <button class="comment-form__btn" type="submit">Publicar</button>
      </form>
    `;

    this.querySelector('#comment-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this._handleSubmit();
    });
  }

  _handleSubmit() {
    const input = this.querySelector('.comment-form__input');
    const content = input.value.trim();
    if (!content) return;

    this.dispatchEvent(new CustomEvent('comment-submit', {
      detail: { content },
      bubbles: true,
      composed: true,
    }));

    input.value = '';
  }
}

customElements.define('comment-form', CommentForm);
