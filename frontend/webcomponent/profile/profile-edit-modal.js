import { uploadImage } from '../../services/upload.js';
import { updateMe } from '../../services/users.js';

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./profile-edit-modal.css', import.meta.url);
document.head.appendChild(link);

export class ProfileEditModal extends HTMLElement {
  #selectedFile  = null;
  #currentAvatar = '';

  connectedCallback() {
    this.innerHTML = `
      <div class="edit-modal">
        <div class="edit-modal__backdrop"></div>
        <div class="edit-modal__box">
          <div class="edit-modal__header">
            <h2 class="edit-modal__title">Editar perfil</h2>
            <button class="edit-modal__close" aria-label="Fechar">✕</button>
          </div>
          <form class="edit-form" novalidate>
            <div class="edit-form__group">
              <label class="edit-form__label" for="pem-display-name">Nome</label>
              <input class="edit-form__input" id="pem-display-name" type="text" maxlength="60" placeholder="O teu nome">
            </div>
            <div class="edit-form__group">
              <label class="edit-form__label" for="pem-bio">Bio</label>
              <textarea class="edit-form__textarea" id="pem-bio" maxlength="200" placeholder="Fala um pouco sobre ti..."></textarea>
            </div>
            <div class="edit-form__group">
              <label class="edit-form__label">Foto de perfil</label>
              <div class="edit-form__avatar-row">
                <img class="edit-form__avatar-preview" src="" alt="preview">
                <div class="edit-form__avatar-actions">
                  <button type="button" class="edit-form__avatar-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                    Alterar foto
                  </button>
                  <span class="edit-form__avatar-filename" hidden></span>
                  <input type="file" accept="image/*" hidden>
                </div>
              </div>
            </div>
            <p class="edit-form__error" hidden></p>
            <div class="edit-form__actions">
              <button type="button" class="edit-form__cancel">Cancelar</button>
              <button type="submit" class="edit-form__save">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    `;

    this._bindEvents();
    document.addEventListener('profile-edit-open', (e) => this._open(e.detail));
  }

  _modal()    { return this.querySelector('.edit-modal'); }
  _form()     { return this.querySelector('.edit-form'); }
  _nameInput(){ return this.querySelector('#pem-display-name'); }
  _bioInput() { return this.querySelector('#pem-bio'); }
  _preview()  { return this.querySelector('.edit-form__avatar-preview'); }
  _fileInput(){ return this.querySelector('input[type="file"]'); }
  _filename() { return this.querySelector('.edit-form__avatar-filename'); }
  _errorEl()  { return this.querySelector('.edit-form__error'); }
  _saveBtn()  { return this.querySelector('.edit-form__save'); }

  _bindEvents() {
    this.querySelector('.edit-modal__close').addEventListener('click',    () => this._close());
    this.querySelector('.edit-form__cancel').addEventListener('click',    () => this._close());
    this.querySelector('.edit-modal__backdrop').addEventListener('click', () => this._close());

    this.querySelector('.edit-form__avatar-btn').addEventListener('click', () => this._fileInput().click());

    this._fileInput().addEventListener('change', () => {
      const file = this._fileInput().files[0];
      if (!file) return;
      this.#selectedFile = file;
      this._preview().src = URL.createObjectURL(file);
      const label = file.name.length > 24 ? file.name.slice(0, 22) + '…' : file.name;
      this._filename().textContent = label;
      this._filename().hidden = false;
    });

    this._form().addEventListener('submit', (e) => this._submit(e));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this._modal().classList.contains('edit-modal--open')) this._close();
    });
  }

  _open(data) {
    this._nameInput().value = data.displayName || '';
    this._bioInput().value  = data.bio || '';
    this._preview().src     = data.avatar || '';
    this.#currentAvatar     = data.avatar || '';
    this.#selectedFile      = null;
    this._fileInput().value = '';
    this._filename().hidden = true;
    this._errorEl().hidden  = true;
    this._modal().classList.add('edit-modal--open');
    this._nameInput().focus();
  }

  _close() {
    this._modal().classList.remove('edit-modal--open');
    this._form().reset();
    this.#selectedFile      = null;
    this._fileInput().value = '';
    this._filename().hidden = true;
  }

  async _submit(e) {
    e.preventDefault();
    const saveBtn = this._saveBtn();
    const errorEl = this._errorEl();
    errorEl.hidden   = true;
    saveBtn.disabled = true;

    try {
      let avatar_url = this.#currentAvatar || null;

      if (this.#selectedFile) {
        saveBtn.textContent = 'A carregar foto...';
        const result = await uploadImage(this.#selectedFile);
        avatar_url = result.url;
      }

      saveBtn.textContent = 'A guardar...';
      const payload  = {};
      const nameVal  = this._nameInput().value.trim();
      if (nameVal) payload.display_name = nameVal;
      payload.bio        = this._bioInput().value.trim() || null;
      payload.avatar_url = avatar_url;

      await updateMe(payload);
      this._close();
      window.location.reload();
    } catch {
      errorEl.textContent = 'Erro ao guardar. Tenta novamente.';
      errorEl.hidden = false;
    } finally {
      saveBtn.disabled    = false;
      saveBtn.textContent = 'Guardar';
    }
  }
}

customElements.define('profile-edit-modal', ProfileEditModal);
