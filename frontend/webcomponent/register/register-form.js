const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./register-form.css', import.meta.url);
document.head.appendChild(link);

export class RegisterForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="register-form">

        <div class="register-form__image">
        <img src="https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2025/05/gato-laranja-e1748043537291.jpg?w=1200&h=1200&crop=1" alt="Imagem de registro">
        </div>

        <div class="register-form__content">

        <div class="register-form__header">
          <h2 class="register-form__title">Criar conta</h2>
          <p class="register-form__subtitle">Junte-se ao Instapet hoje</p>
        </div>

        <form class="register-form__body" id="register-form">
          <ui-input
            name="username"
            type="text"
            label="Nome de exibição"
            placeholder="Diogo Silva"
          ></ui-input>

          <ui-input
            name="display_name"
            type="text"
            label="Nome do utilizador"
            placeholder="Diogo123"
          ></ui-input>

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

          <ui-button text="Criar conta" class="register-form__submit"></ui-button>
        </form>

        <p class="register-form__footer">
          Já tem uma conta? <a class="register-form__link" href="/pages/login.html">Entrar</a>
        </p>

        </div>


        </div>`;  


    this._formData = { username: '', display_name: '', email: '', password: '' };

    this.addEventListener('ui-input', (e) => {
      this._formData[e.detail.name] = e.detail.value;
    });

    this.querySelector('#register-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this._handleSubmit();
    });

    this.querySelector('.register-form__submit').addEventListener('click', () => {
      this._handleSubmit();
    });
  }

  _handleSubmit() {
    this.dispatchEvent(new CustomEvent('register-submit', {
      detail: { ...this._formData },
      bubbles: true,
      composed: true,
    }));
  }
}

customElements.define('register-form', RegisterForm);
