const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = new URL('./notifications-list.css', import.meta.url);
document.head.appendChild(link);

const ICONS = {
  like: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>`,
  comment: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>`,
  follow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/>
    <line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
  </svg>`,
};

function formatTime(dateStr) {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return 'agora';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

function labelFor(type, actor) {
  if (type === 'like')    return `<strong>@${actor}</strong> curtiu o teu post.`;
  if (type === 'comment') return `<strong>@${actor}</strong> comentou no teu post.`;
  if (type === 'follow')  return `<strong>@${actor}</strong> começou a seguir-te.`;
  return `<strong>@${actor}</strong> interagiu contigo.`;
}

export class NotificationsList extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="notifications-list">
        <div class="notifications-list__header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <h2 class="notifications-list__title">Notificações</h2>
        </div>
        <div class="notifications-list__items" id="notif-items">
          <div class="notifications-list__empty">
            <svg class="notifications-list__empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <p class="notifications-list__empty-text">A carregar notificações...</p>
          </div>
        </div>
      </div>
    `;
  }

  setNotifications(notifications) {
    const container = this.querySelector('#notif-items');
    if (!container) return;

    if (!notifications.length) {
      container.innerHTML = `
        <div class="notifications-list__empty">
          <svg class="notifications-list__empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <p class="notifications-list__empty-text">Não tens notificações.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = '';

    notifications.forEach((notif) => {
      const isFollow = notif.type === 'follow';
      const href = isFollow
        ? `/pages/profile.html?user=${notif.actor_username}`
        : `/pages/post.html?id=${notif.post_id}`;

      const item = document.createElement('a');
      item.className = `notification-item${notif.read === false ? ' notification-item--unread' : ''}`;
      item.href = href;

      item.innerHTML = `
        <div class="notification-item__icon">${ICONS[notif.type] ?? ICONS.like}</div>
        <div class="notification-item__body">
          <p class="notification-item__text">${labelFor(notif.type, notif.actor_username)}</p>
          <span class="notification-item__time">${formatTime(notif.created_at)}</span>
        </div>
        ${notif.post_image ? `<img class="notification-item__thumb" src="${notif.post_image}" alt="">` : ''}
        ${notif.read === false ? '<span class="notification-item__dot"></span>' : ''}
      `;

      container.appendChild(item);
    });
  }

  setError() {
    const container = this.querySelector('#notif-items');
    if (!container) return;
    container.innerHTML = '<p class="notifications-list__error">Erro ao carregar notificações.</p>';
  }
}

customElements.define('notifications-list', NotificationsList);
