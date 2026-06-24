import { login } from '../../services/auth.js';

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./login-form.css', import.meta.url);
document.head.appendChild(link);

const inputCSS = document.createElement('link');
inputCSS.rel = 'stylesheet';
inputCSS.href = new URL('../ui/input.css', import.meta.url);
document.head.appendChild(inputCSS);

export class LoginForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="login-form">

        <div class="login-form__image">
          <img src="https://static.vecteezy.com/ti/fotos-gratis/t2/72227979-uma-dourado-retriever-cachorro-e-uma-gengibre-gato-estao-aconchegado-acima-dormindo-juntos-em-uma-de-madeira-superficie-foto.jpg" alt="Cão e gato a dormir juntos">
        </div>

        <div class="login-form__content">

          <div class="login-form__header">
            <h2 class="login-form__title">Entrar</h2>
            <p class="login-form__subtitle">Bem-vindo de volta ao Instapet</p>
          </div>

          <form class="login-form__body" id="login-form" novalidate>

            <div class="ui-input" id="lf-field-email">
              <label class="ui-input__label" for="lf-email">E-mail</label>
              <input class="ui-input__field" id="lf-email" name="email" type="email" placeholder="seu@email.com" autocomplete="email">
              <span class="ui-input__error" hidden></span>
            </div>

            <div class="ui-input" id="lf-field-password">
              <label class="ui-input__label" for="lf-password">Senha</label>
              <div class="ui-input__password-wrap">
                <input class="ui-input__field" id="lf-password" name="password" type="password" placeholder="••••••••" autocomplete="current-password">
                <button type="button" class="ui-input__toggle-pw" aria-label="Mostrar/ocultar senha" data-target="lf-password">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
              <span class="ui-input__error" hidden></span>
            </div>

            <p class="login-form__error" id="lf-error" hidden></p>

            <button type="submit" class="lf-submit-btn">Entrar</button>

          </form>

          <p class="login-form__footer">
            Não tem uma conta? <a class="login-form__link" href="/pages/register.html">Cadastre-se</a>
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

    this.querySelector('#login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this._handleSubmit();
    });
  }

  _setError(name, msg) {
    const field = this.querySelector(`#lf-field-${name}`);
    const input = this.querySelector(`#lf-${name}`);
    if (!field || !input) return;
    field.classList.add('ui-input--error');
    input.style.borderColor = '#c0392b';
    input.style.background = '#fff5f5';
    const span = field.querySelector('.ui-input__error');
    if (span) { span.textContent = msg; span.hidden = false; }
  }

  _clearFieldError(name) {
    const field = this.querySelector(`#lf-field-${name}`);
    const input = this.querySelector(`#lf-${name}`);
    if (!field || !input) return;
    field.classList.remove('ui-input--error');
    input.style.borderColor = '';
    input.style.background = '';
    const span = field.querySelector('.ui-input__error');
    if (span) { span.textContent = ''; span.hidden = true; }
  }

  _clearAllErrors() {
    ['email', 'password'].forEach(n => this._clearFieldError(n));
    const el = this.querySelector('#lf-error');
    if (el) { el.textContent = ''; el.hidden = true; }
  }

  _showFormError(msg) {
    const el = this.querySelector('#lf-error');
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
  }

  async _handleSubmit() {
    if (this._submitting) return;
    this._clearAllErrors();

    const email    = this.querySelector('#lf-email')?.value.trim() ?? '';
    const password = this.querySelector('#lf-password')?.value ?? '';

    if (!email) { this._setError('email', 'Campo obrigatório'); return; }
    if (!password) { this._setError('password', 'Campo obrigatório'); return; }

    this._submitting = true;
    const btn = this.querySelector('.lf-submit-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'A entrar...'; }

    try {
      const data = await login({ email, password });
      localStorage.setItem('token', data.access_token);
      window.location.href = '/pages/feed.html';
    } catch (err) {
      if (err.status === 401) {
        this._setError('email', 'Email ou senha incorrectos');
        this._setError('password', 'Email ou senha incorrectos');
      } else {
        this._showFormError('Erro ao entrar. Tenta novamente.');
      }
    } finally {
      this._submitting = false;
      if (btn) { btn.disabled = false; btn.textContent = 'Entrar'; }
    }
  }
}

customElements.define('login-form', LoginForm);
