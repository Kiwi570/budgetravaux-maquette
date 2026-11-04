/* Rénovation : tableau à disjoncteurs complet (disjoncteurs), trois projets en planches empilées (planches), garanties. */
import { html, brut } from '../../outils/gabarit.mjs';
import { tableau, icone } from '../gabarits/morceaux.mjs';
import { finCourte } from '../gabarits/tete.mjs';
import { ouvertureChantier } from '../gabarits/ouvertures.mjs';

export const page = { cle: 'renovation', fichier: 'renovation', imagePartage: 'grok/renovation-ouverture-1280.webp' };

export default (c) => html`
${ouvertureChantier(c, { action: html`${c.lien('devis', { classe: 'bouton bouton--appel', texte: c.t('commun.actionEntete'), attrs: 'data-action-principale data-survol="magnetique"' })} <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}" data-survol="magnetique">${brut(icone('tel'))}${c.site.contact.telephone}</a>` })}

<section class="metiers sombre" id="metiers">
  <div class="conteneur metiers-grille">
    <header class="tete-section">
      <p class="surtitre" data-anime>${c.t('renovation.tableau.surtitre')}</p>
      <h2 data-anime="lignes">${c.t('renovation.tableau.titre')}</h2>
      <p data-anime>${c.t('renovation.tableau.texte')}</p>
      <p data-anime>${c.t('renovation.tableau.partenaires')}</p>
    </header>
    ${tableau(c, 'renovation')}
  </div>
</section>

<section class="projets bloc clair" id="projets">
  <div class="conteneur">
    <header class="tete-section">
      <h2 data-anime="lignes">${c.t('renovation.projets.titre')}</h2>
    </header>
    <ol class="planches" role="list" data-effet="planches">
      <li class="planche" id="amelioration">
        <div><p class="planche-n">01</p><h3>${c.t('renovation.projets.amelioration')}</h3><p>${c.t('renovation.projets.ameliorationTexte')}</p>${c.lien('devis', { classe: 'lien-fleche', texte: c.t('commun.actionEntete') })}</div>
        ${c.media({ nom: 'grok/urgence-electricite', alt: '', classe: 'planche-media', sizes: '(max-width: 760px) 90vw, 40vw' })}
      </li>
      <li class="planche" id="restructuration">
        <div><p class="planche-n">02</p><h3>${c.t('renovation.projets.restructuration')}</h3><p>${c.t('renovation.projets.restructurationTexte')}</p>${c.lien('contact', { ancre: 'rendez-vous', params: 'type=renovation', classe: 'lien-fleche', texte: c.t('contact.form.titre') })}</div>
        ${c.media({ nom: 'grok/renovation-pro', alt: c.s('renovation.projets.altPro'), classe: 'planche-media', sizes: '(max-width: 760px) 90vw, 40vw' })}
      </li>
      <li class="planche" id="pmr">
        <div><p class="planche-n">03</p><h3>${c.t('renovation.projets.pmr')}</h3><p>${c.t('renovation.projets.pmrTexte')}</p>${c.lien('devis', { params: 'metier=plomberie', classe: 'lien-fleche', texte: c.t('commun.actionEntete') })}</div>
        ${c.media({ nom: 'grok/renovation-pmr', alt: c.s('renovation.projets.altPmr'), classe: 'planche-media', sizes: '(max-width: 760px) 90vw, 40vw' })}
      </li>
    </ol>
  </div>
</section>

<section class="garanties-section bloc sombre" id="garanties">
  <div class="conteneur">
    <header class="tete-section">
      <h2 data-anime="lignes">${c.t('renovation.garanties.titre')}</h2>
    </header>
    <ul class="garanties" role="list" data-anime="cascade">
      ${['g1', 'g2', 'g3', 'g4', 'g5', 'g6'].map((k) => html`<li>${brut(icone('coche'))}<span>${c.t('renovation.garanties.' + k)}</span></li>`)}
    </ul>
    ${c.media({ nom: 'grok/texture-cuivre', alt: '', cadrage: '50% 80%', classe: 'garanties-media', sizes: '(max-width: 960px) 100vw, 900px', attrs: 'data-fx="parallaxe" data-fx-force="8"' })}
  </div>
</section>

${finCourte(c, { titre: c.t('renovation.fin.titre'), texte: c.t('renovation.fin.texte'), classe: 'clair', image: 'grok/accueil-appel', cadrage: '78% 55%' })}
`;
