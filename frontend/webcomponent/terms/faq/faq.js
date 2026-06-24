const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./faq.css', import.meta.url);
document.head.appendChild(link);

export class FaqSection extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') || 'FAQ';

    const items = [
      {
        q: 'Como crio uma conta?',
        a: 'Clica em "Criar conta" na página de login e preenche os teus dados. Deves ter pelo menos 13 anos.',
      },
      {
        q: 'Como funciona o feed?',
        a: 'O teu feed mostra posts de todas as contas. Podes filtrar para ver apenas publicações de quem segues usando o seletor "A seguir" no lado esquerdo.',
      },
      {
        q: 'Como posso guardar posts?',
        a: 'Clica no ícone de marcador em qualquer post para o guardar. Podes ver os teus posts guardados no teu perfil, no separador "Guardados".',
      },
      {
        q: 'Como funcionam as notificações?',
        a: 'Recebes notificações quando alguém gosta do teu post, comenta ou começa a seguir-te. O sino no topo da página mostra o número de notificações não lidas.',
      },
      {
        q: 'Como edito o meu perfil?',
        a: 'Vai ao teu perfil e clica no botão "EDITAR". Podes alterar o teu nome, bio e foto de perfil.',
      },
      {
        q: 'Posso eliminar a minha conta?',
        a: 'Para eliminar a tua conta, entra em contacto connosco através do email suporte@instapet.pt. A ação é irreversível.',
      },
    ];

    this.innerHTML = `
      <div class="faq">
        <div class="faq__header">
          <div class="faq__header-icon">
            <span class="material-symbols-outlined">help</span>
          </div>
          <h2 class="faq__title">${title}</h2>
        </div>
        <ul class="faq__list">
          ${items.map((item, i) => `
            <li class="faq__item">
              <button class="faq__question" data-index="${i}" aria-expanded="false">
                <span>${item.q}</span>
                <svg class="faq__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              <div class="faq__answer" id="faq-answer-${i}" hidden>
                <p>${item.a}</p>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>
    `;

    this.querySelectorAll('.faq__question').forEach(btn => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        const answer   = this.querySelector(`#faq-answer-${btn.dataset.index}`);
        btn.setAttribute('aria-expanded', String(!expanded));
        answer.hidden = expanded;
        btn.classList.toggle('faq__question--open', !expanded);
      });
    });
  }
}

customElements.define('faq-section', FaqSection);
