import { createOptimizedPicture } from '../../scripts/aem.js';
//import { isAuthenticated, login } from '../../scripts/auth.js';
//import { apiGet } from '../../scripts/api.js';

// Fallback scopes used when the authored config row omits them.
// Replace with your actual API scope from Azure App Registration.
//const DEFAULT_SCOPES = ['api://YOUR_API_CLIENT_ID/access_as_user'];

/**
 * Authored content structure (same contract as the cards block):
 *
 *   | image   |
 *   | body text, links, etc. |
 *
 * API config structure (optional first row):
 *
 *   | https://your-api.example.com/cards | api://CLIENT_ID/scope,offline_access |
 *    ^--- API endpoint URL                 ^--- comma-separated scopes (optional)
 *
 * If the first row contains a URL in the first cell, it is treated as API config
 * and removed before rendering. All remaining rows become authored fallback content.
 *
 * Expected API response shape (array of card objects):
 * [
 *   {
 *     "image": "https://...",      // optional
 *     "imageAlt": "Photo of ...",  // optional
 *     "title": "Card title",       // optional
 *     "description": "Body text",  // optional
 *     "link": "https://...",       // optional
 *     "linkText": "Learn more"     // optional, defaults to "Learn more"
 *   }
 * ]
 */

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

/**
 * Checks whether the first row is an API config row (first cell is a URL).
 * If so, removes that row from the block and returns the parsed config.
 * Returns null if no API config row is found.
 */
/*function extractApiConfig(block) {
  const firstRow = block.firstElementChild;
  if (!firstRow) return null;

  const text = firstRow.firstElementChild?.textContent.trim() ?? '';
  if (!/^https?:\/\/|^\/api\//.test(text)) return null;

  const scopeCell = firstRow.children[1]?.textContent.trim();
  const scopes = scopeCell
    ? scopeCell.split(',').map((s) => s.trim()).filter(Boolean)
    : DEFAULT_SCOPES;

  firstRow.remove();
  return { url: text, scopes };
}*/

export default async function decorate(block) {
  //const apiConfig = extractApiConfig(block);
  const ul = document.createElement('ul');

  /*if (apiConfig) {
    if (!await isAuthenticated()) {
      await login(apiConfig.scopes);
    }

    let cards = null;
    try {
      const response = await apiGet(apiConfig.url, apiConfig.scopes);
      cards = await response.json();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Dynamiccards API fetch failed, falling back to authored content', error);
    }

    if (Array.isArray(cards) && cards.length > 0) {
      cards.forEach((card) => ul.append(buildCardFromData(card)));
    } else {
      // API returned nothing or failed — render whatever the author put in the block
      [...block.children].forEach((row) => ul.append(buildCardFromAuthored(row)));
    }
  } else {*/
    // No API config row — behave exactly like the standard cards block
    [...block.children].forEach((row) => ul.append(buildCardFromAuthored(row)));
  //}

  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.replaceChildren(ul);
}
