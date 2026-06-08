const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./faq.css', import.meta.url);
document.head.appendChild(link);

export class FaqSection extends HTMLElement {
  connectedCallback() {
    const title     = this.getAttribute('title') || 'FAQ';
    const itemsAttr = this.getAttribute('items') || '[]';

    let items = [];
    try { items = JSON.parse(itemsAttr); } catch {}

    if (!items.length) {
      items = [
        {
          q: 'How do I create an account?',
          a: 'Click "Register" on the login page and fill in your details. You must be at least 13 years old.',
        },
        {
          q: 'How do I report inappropriate content?',
          a: 'Click the "..." menu on any post and select "Report". Our team will review it within 24 hours.',
        },
        {
          q: 'Can I delete my account?',
          a: 'Yes. Go to Settings → Account → Delete Account. This action is irreversible.',
        },
        {
          q: 'How does the feed work?',
          a: 'Your feed shows posts from accounts you follow, sorted by most recent.',
        },
      ];
    }

    this.innerHTML = `
      <div class="faq">
        <h2 class="faq__title">${title}</h2>
        <ul class="faq__list">
          ${items.map((item, i) => `
            <li class="faq__item">
              <button class="faq__question" data-index="${i}" aria-expanded="false">
                ${item.q}
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
