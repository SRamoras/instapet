const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./login-form.css', import.meta.url);
document.head.appendChild(link);

export class LoginForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="login-form">

        <div class="login-form__image">
        <img src="https://static.vecteezy.com/ti/fotos-gratis/t2/72227979-uma-dourado-retriever-cachorro-e-uma-gengibre-gato-estao-aconchegado-acima-dormindo-juntos-em-uma-de-madeira-superficie-foto.jpg" alt="Cachorro e gato dormindo juntos">
        </div>

        <div class="login-form__content">

        <div class="login-form__header">
          <h2 class="login-form__title">Entrar</h2>
          <p class="login-form__subtitle">Bem-vindo de volta ao Instapet</p>
        </div>

        <form class="login-form__body" id="login-form">
          <ui-input
            name="email"
            type="email"
            label="E-mail"
            placeholder="seu@email.com"
          ></ui-input>

          <ui-input
            name="password"
            type="password"
            label="Senha"
            placeholder="••••••••"
          ></ui-input>

          <ui-button text="Entrar" class="login-form__submit"></ui-button>
        </form>

        <p class="login-form__footer">
          Não tem uma conta? <a class="login-form__link" href="/pages/register.html">Cadastre-se</a>
        </p>

        </div>

        </div>
    `;

    this._formData = { email: '', password: '' };

    this.addEventListener('ui-input', (e) => {
      this._formData[e.detail.name] = e.detail.value;
    });

    this.querySelector('#login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this._handleSubmit();
    });

    this.querySelector('.login-form__submit').addEventListener('click', () => {
      this._handleSubmit();
    });
  }

  _handleSubmit() {
    this.dispatchEvent(new CustomEvent('login-submit', {
      detail: { ...this._formData },
      bubbles: true,
      composed: true,
    }));
  }
}

customElements.define('login-form', LoginForm);
