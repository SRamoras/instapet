const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./terms-content.css', import.meta.url);
document.head.appendChild(link);

export class TermsContent extends HTMLElement {
  connectedCallback() {
    const title       = this.getAttribute('title') || 'Terms and Conditions InstaPet';
    const lastUpdated = this.getAttribute('last-updated') || 'May 24, 2026';

    const sections = [
      {
        number: '1',
        title: 'Acceptance of Terms',
        text: 'By accessing and using the InstaPet platform, you agree to these Terms and Conditions. If you do not agree, you must not use the service.',
      },
      {
        number: '2',
        title: 'What is InstaPet',
        text: 'InstaPet is a social network dedicated to pets, where users can share photos, videos, stories and interact with other pet owners and animal lovers.',
      },
      {
        number: '3',
        title: 'Registration and Account',
        text: 'You must be at least 13 years old to create an account. You are responsible for keeping your password confidential. You may not create fake accounts or impersonate another person. InstaPet reserves the right to suspend or delete accounts that violate these terms.',
      },
      {
        number: '4',
        title: 'Published Content',
        text: 'By posting content, you grant InstaPet a licence to display it on the platform. You are responsible for the content you post. It is forbidden to post content showing cruelty or mistreatment of animals. It is forbidden to post offensive, discriminatory, or illegal content. InstaPet may remove any content without prior notice.',
      },
      {
        number: '5',
        title: 'Privacy',
        text: 'The collection and use of your personal data is governed by our Privacy Policy, available on the website. By using InstaPet, you agree to that policy.',
      },
      {
        number: '6',
        title: 'Intellectual Property',
        text: 'All design, logos, and code of the InstaPet platform are the property of the company. You may not copy, reproduce, or distribute any part of the platform without permission.',
      },
      {
        number: '7',
        title: 'Platform Behaviour',
        text: 'Spam or unsolicited advertising, harassing, intimidating, or threatening other users, and attempting to access other users accounts are strictly prohibited.',
      },
      {
        number: '8',
        title: 'Limitation of Liability',
        text: 'InstaPet is not responsible for losses or damages resulting from the use of the platform, content posted by third parties, or temporary service interruptions.',
      },
      {
        number: '9',
        title: 'Changes to Terms',
        text: 'InstaPet may update these terms at any time. When this happens, you will be notified by email or through the platform. Continued use of the service after changes implies your acceptance.',
      },
    ];

    this.innerHTML = `
      <div class="terms-content">
        <h1 class="terms-content__title">${title}</h1>
        <p class="terms-content__date">Last updated: ${lastUpdated}</p>

        ${sections.map(s => `
          <section class="terms-content__section">
            <h2 class="terms-content__section-title">${s.number}. ${s.title}</h2>
            <p class="terms-content__section-text">${s.text}</p>
          </section>
        `).join('')}
      </div>
    `;
  }
}

customElements.define('terms-content', TermsContent);
