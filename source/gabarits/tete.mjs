/* Ouverture plein cadre des pages intérieures : image Grok (ordinateur et téléphone), titre, action, information clé. */
import { html, brut } from '../../outils/gabarit.mjs';
import { icone } from './morceaux.mjs';

export function tete(c, { image, alt, surtitre, titre, texte, info, action, fx = 'data-fx="onde"', cadrage = '60% 50%' }) {
  return html`<section class="page-tete" id="debut">
  ${c.media({ nom: image, alt, cadrage, priorite: true, classe: 'page-tete-fond', sizes: '100vw', attrs: fx })}
  <div class="conteneur page-tete-texte">
    <p class="surtitre pt-anim" data-anime="gsap">${surtitre}</p>
    <h1 class="pt-anim pt-titre" data-anime="gsap">${titre}</h1>
    <p class="pt-anim" data-anime="gsap">${texte}</p>
    <p class="hero-actions pt-anim" data-anime="gsap">${action || html`<a class="bouton bouton--appel" href="tel:${c.site.contact.telephoneLien}" data-action-principale data-survol="magnetique">${brut(icone('tel'))}${c.t('commun.appelerNumero')}</a>`}</p>
    <p class="hero-info pt-anim" data-info-cle data-anime="gsap">${info}</p>
  </div>
</section>`;
}

export function finCourte(c, { titre, texte, classe = 'sombre', lien = 'devis', image, cadrage = '50% 50%' }) {
  return html`<section class="fin-courte ${classe}" id="fin">
  <div class="conteneur fin-courte-grille">
    <div>
      <h2 data-anime="lignes">${titre}</h2>
      <p data-anime>${texte}</p>
      <p class="fin-actions" data-anime>
        <a class="bouton bouton--appel" href="tel:${c.site.contact.telephoneLien}" data-survol="magnetique">${brut(icone('tel'))}${c.t('commun.appelerNumero')}</a>
        ${c.lien(lien, { classe: 'bouton bouton--contour', texte: c.t('commun.actionEntete'), attrs: 'data-survol="magnetique"' })}
      </p>
    </div>
    ${image ? c.media({ nom: image, alt: '', cadrage, classe: 'fin-courte-media', sizes: '(max-width: 860px) 100vw, 40vw', attrs: 'data-anime="rideau"' }) : ''}
  </div>
</section>`;
}
