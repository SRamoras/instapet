class PostCard extends HTMLElement {
  connectedCallback() {
    const id = this.getAttribute('id');
    const username = this.getAttribute('username');
    const avatar = this.getAttribute('avatar');
    const caption = this.getAttribute('caption');
    const image = this.getAttribute('image');
    const likes = this.getAttribute('likes');
    const comments = this.getAttribute('comments');

    this.innerHTML = `
      <div class="post">
        <img src="${avatar}">
        <h3>${username}</h3>
        <p>${caption}</p>
        <img src="${image}">
        <span>${likes} likes</span>

        <ui-button text="Like"></ui-button>
        <ui-button text="Comment"></ui-button>
      </div>
    `;
  }
}