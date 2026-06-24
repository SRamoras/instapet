const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./terms-content.css', import.meta.url);
document.head.appendChild(link);

export class TermsContent extends HTMLElement {
  connectedCallback() {
    const lastUpdated = this.getAttribute('last-updated') || '24 de maio de 2026';

    const sections = [
      {
        number: '1',
        title: 'Aceitação dos Termos',
        text: 'Ao acederes e utilizares a plataforma InstaPet, concordas com estes Termos e Condições. Se não concordares, deves deixar de utilizar o serviço.',
      },
      {
        number: '2',
        title: 'O que é o InstaPet',
        text: 'O InstaPet é uma rede social dedicada a animais de estimação, onde os utilizadores podem partilhar fotos, seguir outros donos de animais e interagir com a comunidade.',
      },
      {
        number: '3',
        title: 'Registo e Conta',
        text: 'Deves ter pelo menos 13 anos para criar uma conta. És responsável pela confidencialidade da tua senha. Não podes criar contas falsas nem fazer-te passar por outra pessoa. O InstaPet reserva-se o direito de suspender ou eliminar contas que violem estes termos.',
      },
      {
        number: '4',
        title: 'Conteúdo Publicado',
        text: 'Ao publicares conteúdo, concedes ao InstaPet uma licença para o exibir na plataforma. És responsável pelo conteúdo que publicas. É proibido publicar conteúdo que mostre crueldade ou maus-tratos a animais, bem como conteúdo ofensivo, discriminatório ou ilegal. O InstaPet pode remover qualquer conteúdo sem aviso prévio.',
      },
      {
        number: '5',
        title: 'Privacidade',
        text: 'A recolha e utilização dos teus dados pessoais são regidas pela nossa Política de Privacidade. Ao utilizares o InstaPet, concordas com essa política.',
      },
      {
        number: '6',
        title: 'Propriedade Intelectual',
        text: 'Todo o design, logotipos e código da plataforma InstaPet são propriedade da empresa. Não podes copiar, reproduzir ou distribuir qualquer parte da plataforma sem autorização.',
      },
      {
        number: '7',
        title: 'Comportamento na Plataforma',
        text: 'São estritamente proibidos: spam ou publicidade não solicitada, assédio, intimidação ou ameaças a outros utilizadores, e tentativas de aceder a contas alheias.',
      },
      {
        number: '8',
        title: 'Limitação de Responsabilidade',
        text: 'O InstaPet não é responsável por perdas ou danos resultantes do uso da plataforma, conteúdos publicados por terceiros ou interrupções temporárias do serviço.',
      },
      {
        number: '9',
        title: 'Alterações aos Termos',
        text: 'O InstaPet pode atualizar estes termos a qualquer momento. Quando tal acontecer, serás notificado através da plataforma. A utilização continuada do serviço após as alterações implica a tua aceitação.',
      },
    ];

    this.innerHTML = `
      <div class="terms-content">
        <div class="terms-content__header">
          <div class="terms-content__header-icon">
            <span class="material-symbols-outlined">description</span>
          </div>
          <div>
            <h1 class="terms-content__title">Termos e Condições</h1>
            <p class="terms-content__date">Última atualização: ${lastUpdated}</p>
          </div>
        </div>

        <p class="terms-content__intro">
          Bem-vindo ao InstaPet. Lê atentamente estes termos antes de utilizares a plataforma.
        </p>

        <div class="terms-content__divider"></div>

        ${sections.map(s => `
          <section class="terms-content__section">
            <div class="terms-content__section-header">
              <span class="terms-content__section-num">${s.number}</span>
              <h2 class="terms-content__section-title">${s.title}</h2>
            </div>
            <p class="terms-content__section-text">${s.text}</p>
          </section>
        `).join('')}
      </div>
    `;
  }
}

customElements.define('terms-content', TermsContent);
