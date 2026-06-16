function getInitials(name) {
  return (name || '.').trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

export function avatarHTML(name, avatarSrc, cssClass) {
  if (avatarSrc) {
    return `<img class="${cssClass}" src="${avatarSrc}" alt="${name}">`;
  }
  return `<div class="${cssClass} avatar-initials" aria-label="${name}">${getInitials(name)}</div>`;
}
