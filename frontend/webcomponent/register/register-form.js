import { register } from '../../services/auth.js';

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./register-form.css', import.meta.url);
document.head.appendChild(link);

const inputCSS = document.createElement('link');
inputCSS.rel = 'stylesheet';
inputCSS.href = new URL('../ui/input.css', import.meta.url);
document.head.appendChild(inputCSS);

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

          <form id="register-form" class="register-form__body" novalidate>

            <div class="ui-input" id="field-username">
              <label class="ui-input__label" for="rf-display_name">Nome do utilizador</label>
              <input class="ui-input__field" id="rf-username" name="username" type="text" placeholder="diogo123" autocomplete="name">
              <span class="ui-input__error" hidden></span>
            </div>

            <div class="ui-input" id="field-display_name">
              <label class="ui-input__label" for="rf-username">Nome de exibição</label>
              <input class="ui-input__field" id="rf-display_name" name="display_name" type="text" placeholder="Diogo Silva" autocomplete="username">
              <span class="ui-input__error" hidden></span>
            </div>

            <div class="ui-input" id="field-email">
              <label class="ui-input__label" for="rf-email">E-mail</label>
              <input class="ui-input__field" id="rf-email" name="email" type="email" placeholder="seu@email.com" autocomplete="email">
              <span class="ui-input__error" hidden></span>
            </div>

            <div class="ui-input" id="field-password">
              <label class="ui-input__label" for="rf-password">Senha</label>
              <div class="ui-input__password-wrap">
                <input class="ui-input__field" id="rf-password" name="password" type="password" placeholder="••••••••" autocomplete="new-password">
                <button type="button" class="ui-input__toggle-pw" aria-label="Mostrar/ocultar senha" data-target="rf-password">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
              <span class="ui-input__error" hidden></span>
            </div>

            <p class="register-form__error" id="rf-error" hidden></p>

            <button type="submit" class="rf-submit-btn">Criar conta</button>

          </form>

          <p class="register-form__footer">
            Já tem uma conta? <a class="register-form__link" href="/pages/login.html">Entrar</a>
          </p>

        </div>
      </div>`;

    this._submitting = false;

    this.querySelectorAll('.ui-input__toggle-pw').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = this.querySelector(`#${btn.dataset.target}`);
        if (!input) return;
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.innerHTML = show
          ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
          : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
      });
    });

    this.querySelectorAll('.ui-input__field').forEach(input => {
      input.addEventListener('input', () => this._clearFieldError(input.name));
    });

    this.querySelector('#register-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this._handleSubmit();
    });
  }

  _field(name) {
    return this.querySelector(`#field-${name}`);
  }

  _input(name) {
    return this.querySelector(`#rf-${name}`);
  }

  _setError(name, msg) {
    const field = this._field(name);
    const input = this._input(name);
    if (!field || !input) return;
    field.classList.add('ui-input--error');
    input.style.borderColor = '#c0392b';
    input.style.background = '#fff5f5';
    const span = field.querySelector('.ui-input__error');
    if (span) { span.textContent = msg; span.hidden = false; }
  }

  _clearFieldError(name) {
    const field = this._field(name);
    const input = this._input(name);
    if (!field || !input) return;
    field.classList.remove('ui-input--error');
    input.style.borderColor = '';
    input.style.background = '';
    const span = field.querySelector('.ui-input__error');
    if (span) { span.textContent = ''; span.hidden = true; }
  }

  _clearAllErrors() {
    ['username', 'display_name', 'email', 'password'].forEach(n => this._clearFieldError(n));
    const el = this.querySelector('#rf-error');
    if (el) { el.textContent = ''; el.hidden = true; }
  }

  _showFormError(msg) {
    const el = this.querySelector('#rf-error');
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
  }

  _validate(data) {
    const errors = {};

    if (!data.username) {
      errors.username = 'Campo obrigatório';
    } else if (data.username.length < 3) {
      errors.username = 'Mínimo 3 caracteres';
    } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
      errors.username = 'Apenas letras, números e _';
    }

    if (!data.display_name) errors.display_name = 'Campo obrigatório';

    if (!data.email) {
      errors.email = 'Campo obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Email inválido';
    }

    if (!data.password) {
      errors.password = 'Campo obrigatório';
    } else if (data.password.length < 6) {
      errors.password = 'Mínimo 6 caracteres';
    }

    return errors;
  }

  async _handleSubmit() {
    if (this._submitting) return;
    this._clearAllErrors();

    const data = {
      username:     this._input('username')?.value.trim() ?? '',
      display_name: this._input('display_name')?.value.trim() ?? '',
      email:        this._input('email')?.value.trim() ?? '',
      password:     this._input('password')?.value ?? '',
    };

    const errors = this._validate(data);
    if (Object.keys(errors).length) {
      Object.entries(errors).forEach(([name, msg]) => this._setError(name, msg));
      return;
    }

    this._submitting = true;
    const btn = this.querySelector('.rf-submit-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'A criar...'; }

    try {
      await register(data);
      window.location.href = '/pages/login.html';
    } catch (err) {
      if (err.field) {
        this._setError(err.field, err.message_detail || 'Já existe');
      } else if (err.fieldErrors && Object.keys(err.fieldErrors).length) {
        Object.entries(err.fieldErrors).forEach(([f, msg]) => this._setError(f, msg));
      } else {
        this._showFormError('Erro ao criar conta. Tenta novamente.');
      }
    } finally {
      this._submitting = false;
      if (btn) { btn.disabled = false; btn.textContent = 'Criar conta'; }
    }
  }
}

customElements.define('register-form', RegisterForm);
