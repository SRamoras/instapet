class UserCard extends HTMLElement {
  connectedCallback() {
    const username = this.getAttribute('username');
    const petName = this.getAttribute('pet-name');
    const posts = this.getAttribute('posts');
    const followers = this.getAttribute('followers');
    const following = this.getAttribute('following');

    this.innerHTML = `
      <div class="user-card">
        <h3>@${username}</h3>
        <p>Pet: ${petName}</p>

        <div class="stats">
          <span>Posts: ${posts}</span>
          <span>Followers: ${followers}</span>
          <span>Following: ${following}</span>
        </div>

        <ui-button text="Follow"></ui-button>
      </div>
    `;
  }
}

customElements.define('user-card', UserCard);