/* Page 404 : « Cette page a fui. » */
import { html, brut } from '../../outils/gabarit.mjs';
import { icone } from '../gabarits/morceaux.mjs';

export const page = { cle: '404', fichier: '404', partage: false };

export default (c) => html`
<section class="page-tete introuvable" id="debut">
  ${c.media({ nom: 'grok/page-404', alt: c.s('introuvable.alt'), cadrage: '60% 55%', priorite: true, classe: 'page-tete-fond', sizes: '100vw' })}
  <div class="conteneur page-tete-texte">
    <p class="surtitre pt-anim" data-anime="gsap">404</p>
    <h1 class="pt-anim pt-titre" data-anime="gsap">${c.t('introuvable.titre')}</h1>
    <p class="pt-anim" data-anime="gsap">${c.t('introuvable.texte')}</p>
    <p class="hero-actions pt-anim" data-anime="gsap">${c.lien('accueil', { classe: 'bouton bouton--appel', texte: c.t('introuvable.retour'), attrs: 'data-action-principale' })} <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${brut(icone('tel'))}${c.site.contact.telephone}</a></p>
  </div>
</section>
`;
