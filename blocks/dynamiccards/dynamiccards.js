import { createOptimizedPicture } from '../../scripts/aem.js';

function buildCardFromAuthored(row) {
  const li = document.createElement('li');
  while (row.firstElementChild) li.append(row.firstElementChild);
  [...li.children].forEach((div) => {
    if (div.children.length === 1 && div.querySelector('picture')) div.className = 'dynamiccards-card-image';
    else div.className = 'dynamiccards-card-body';
  });
  return li;
}

function buildCardFromData(card) {
  const li = document.createElement('li');

  if (card.image) {
    const imageDiv = document.createElement('div');
    imageDiv.className = 'dynamiccards-card-image';
    imageDiv.append(createOptimizedPicture(card.image, card.imageAlt || '', false, [{ width: '750' }]));
    li.append(imageDiv);
  }

  const bodyDiv = document.createElement('div');
  bodyDiv.className = 'dynamiccards-card-body';

  if (card.title) {
    const h3 = document.createElement('h3');
    h3.textContent = card.title;
    bodyDiv.append(h3);
  }

  if (card.description) {
    const p = document.createElement('p');
    p.textContent = card.description;
    bodyDiv.append(p);
  }

  if (card.link) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = card.link;
    a.textContent = card.linkText || 'Learn more';
    p.append(a);
    bodyDiv.append(p);
  }

  li.append(bodyDiv);
  return li;
}

export default async function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => ul.append(buildCardFromAuthored(row)));
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.replaceChildren(ul);
}
