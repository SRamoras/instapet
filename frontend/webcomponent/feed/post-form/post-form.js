import { uploadImage } from '../../../services/upload.js';

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./post-form.css', import.meta.url);
document.head.appendChild(link);

const MAX_CHARS = 280;

export class PostForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="post-form">
        <h3 class="post-form__title">Criar publicação</h3>

        <div class="post-form__field">
          <label class="post-form__label">Descrição</label>
          <textarea
            class="post-form__textarea"
            placeholder="O que se passa com o teu pet? 🐾"
            maxlength="${MAX_CHARS}"
            rows="3"
          ></textarea>
          <span class="post-form__char-count">0 / ${MAX_CHARS}</span>
        </div>

        <div class="post-form__secondary">
          <div class="post-form__field">
            <label class="post-form__label">
              Foto
              <span class="post-form__required">*</span>
            </label>
            <div class="post-form__file-wrap">
              <input type="file" class="post-form__file-input" accept="image/*" hidden>
              <button type="button" class="post-form__file-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                <span>Adicionar foto</span>
              </button>
            </div>
          </div>
          <div class="post-form__field">
            <label class="post-form__label">Tags</label>
            <input
              class="post-form__tags-input"
              type="text"
              placeholder="#dogs #gato #funny #cute #pets"
            >
          </div>
        </div>

        <div class="post-form__preview-wrap" hidden>
          <img class="post-form__preview" alt="Preview">
          <button type="button" class="post-form__preview-remove" aria-label="Remover imagem">✕</button>
        </div>

        <div class="post-form__footer">
          <span class="post-form__hint">* campo obrigatório</span>
          <button class="post-form__submit" disabled>Publicar</button>
        </div>
        <span class="post-form__error" hidden></span>
      </div>
    `;

    const textarea    = this.querySelector('.post-form__textarea');
    const submitBtn   = this.querySelector('.post-form__submit');
    const charCount   = this.querySelector('.post-form__char-count');
    const errorEl     = this.querySelector('.post-form__error');
    const fileInput   = this.querySelector('.post-form__file-input');
    const fileBtn     = this.querySelector('.post-form__file-btn');
    const previewWrap = this.querySelector('.post-form__preview-wrap');
    const previewImg  = this.querySelector('.post-form__preview');
    const removeBtn   = this.querySelector('.post-form__preview-remove');
    const tagsInput   = this.querySelector('.post-form__tags-input');

    let selectedFile = null;

    const updateSubmit = () => {
      submitBtn.disabled = !textarea.value.trim() || !selectedFile;
    };

    textarea.addEventListener('input', () => {
      const len = textarea.value.length;
      charCount.textContent = `${len} / ${MAX_CHARS}`;
      charCount.classList.toggle('post-form__char-count--warn', len > MAX_CHARS * 0.85);
      updateSubmit();
    });

    fileBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;
      selectedFile = file;
      previewImg.src = URL.createObjectURL(file);
      previewWrap.hidden = false;
      const label = file.name.length > 22 ? file.name.slice(0, 20) + '…' : file.name;
      fileBtn.querySelector('span').textContent = label;
      fileBtn.classList.add('post-form__file-btn--has-file');
      errorEl.hidden = true;
      updateSubmit();
    });

    removeBtn.addEventListener('click', () => {
      selectedFile = null;
      fileInput.value = '';
      previewImg.src = '';
      previewWrap.hidden = true;
      fileBtn.querySelector('span').textContent = 'Adicionar foto';
      fileBtn.classList.remove('post-form__file-btn--has-file');
      updateSubmit();
    });

    submitBtn.addEventListener('click', async () => {
      const content = textarea.value.trim();
      if (!content) return;
      if (!selectedFile) {
        errorEl.textContent = 'É necessário adicionar uma foto para publicar.';
        errorEl.hidden = false;
        fileBtn.focus();
        return;
      }

      submitBtn.disabled = true;
      errorEl.hidden = true;

      let image_url;
      submitBtn.textContent = 'A carregar foto...';
      try {
        const result = await uploadImage(selectedFile);
        image_url = result.url;
      } catch (err) {
        errorEl.textContent = err.message || 'Erro ao carregar a foto.';
        errorEl.hidden = false;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Publicar';
        return;
      }

      submitBtn.textContent = 'A publicar...';

      const tagsRaw = tagsInput.value.trim();
      const tags    = tagsRaw
        ? tagsRaw.split(/[\s,]+/).map(t => t.replace(/^#/, '').toLowerCase()).filter(Boolean)
        : [];

      this.dispatchEvent(new CustomEvent('post-submit', {
        detail: { content, image_url, tags },
        bubbles: true,
        composed: true,
      }));
    });

    const reset = () => {
      textarea.value      = '';
      tagsInput.value     = '';
      selectedFile        = null;
      fileInput.value     = '';
      previewImg.src      = '';
      previewWrap.hidden  = true;
      fileBtn.querySelector('span').textContent = 'Adicionar foto';
      fileBtn.classList.remove('post-form__file-btn--has-file');
      charCount.textContent = `0 / ${MAX_CHARS}`;
      charCount.classList.remove('post-form__char-count--warn');
      submitBtn.disabled  = true;
      submitBtn.textContent = 'Publicar';
      errorEl.hidden = true;
    };

    document.addEventListener('post-created',      reset);
    document.addEventListener('post-create-error', () => {
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Publicar';
      errorEl.textContent   = 'Erro ao publicar. Tenta novamente.';
      errorEl.hidden        = false;
    });
  }
}

customElements.define('post-form', PostForm);
