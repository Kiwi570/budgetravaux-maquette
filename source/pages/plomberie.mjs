/* Plomberie en détail : un équipement par fiche, filtres en vannes quart de tour (vannes), dépannage et pose. */
import { html, brut } from '../../outils/gabarit.mjs';
import { icone } from '../gabarits/morceaux.mjs';
import { tete, finCourte } from '../gabarits/tete.mjs';

export const page = { cle: 'plomberie', fichier: 'plomberie', imagePartage: 'grok/plomberie-ouverture-1280.webp' };

export default (c) => {
  const eq = c.donnees.equipements;
  return html`
${tete(c, { image: 'grok/plomberie-ouverture', alt: c.s('plomberie.alt'), surtitre: c.t('plomberie.surtitre'), titre: c.t('plomberie.titre'), texte: c.t('plomberie.texte'), info: c.t('plomberie.info'), cadrage: '60% 50%' })}

<section class="equipements bloc clair" id="equipements">
  <div class="conteneur">
    <fieldset class="filtres" data-effet="vannes" data-anime>
      <legend>${c.t('plomberie.filtres')}</legend>
      <button type="button" class="vanne" data-filtre="tout" aria-pressed="true"><span class="vanne-poignee" aria-hidden="true"></span>${c.t('plomberie.tout')}</button>
      ${eq.map((e) => html`<button type="button" class="vanne" data-filtre="${e.cle}" aria-pressed="false"><span class="vanne-poignee" aria-hidden="true"></span>${e.titre}</button>`)}
    </fieldset>
    <ol class="fiches-equipement" role="list">
      ${eq.map((e, i) => html`<li class="fiche-equipement" id="${e.cle}" data-equipement="${e.cle}">
        ${c.media({ nom: e.image, alt: '', cadrage: e.cadrage, classe: 'fiche-media', sizes: '(max-width: 860px) 90vw, 36vw', attrs: i % 2 ? 'data-fx="parallaxe" data-fx-force="8"' : 'data-anime="rideau"' })}
        <div class="fiche-texte">
          <p class="planche-n">${String(i + 1).padStart(2, '0')}</p>
          <h2 data-anime="lignes">${e.titre}</h2>
          <div class="fiche-colonnes">
            <div><h3>${c.t('plomberie.depannage')}</h3><ul role="list">${e.depannage.map((x) => html`<li>${x}</li>`)}</ul></div>
            <div><h3>${c.t('plomberie.renovation')}</h3><ul role="list">${e.renovation.map((x) => html`<li>${x}</li>`)}</ul></div>
          </div>
          <p>${c.lien('devis', { params: 'metier=plomberie', classe: 'lien-fleche', texte: c.t('plomberie.devis') })}</p>
        </div>
      </li>`)}
    </ol>
    <p class="petit a-completer">${c.t('plomberie.photos')}</p>
  </div>
</section>

${finCourte(c, { titre: c.t('plomberie.fin.titre'), texte: c.t('plomberie.fin.texte'), image: 'grok/metier-plomberie', cadrage: '40% 50%' })}
`;
};
