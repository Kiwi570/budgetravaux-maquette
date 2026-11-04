/* Dépannage & tarifs : forfaits (ticket), caméra thermique (thermique), horloge des tarifs (horloge), pannes courantes, FAQ. */
import { html, brut } from '../../outils/gabarit.mjs';
import { ticket, prix, icone } from '../gabarits/morceaux.mjs';
import { finCourte } from '../gabarits/tete.mjs';
import { ouvertureBon } from '../gabarits/ouvertures.mjs';

export const page = { cle: 'depannage', fichier: 'depannage', imagePartage: 'grok/depannage-ouverture-1280.webp' };

const PANNES = ['douche', 'baignoire', 'lavabo', 'wc', 'chauffeEau', 'cuisine', 'electricite'];
const IMAGES = { douche: 'grok/equip-douche', baignoire: 'grok/equip-baignoire', lavabo: 'grok/equip-lavabo', wc: 'grok/equip-wc', chauffeEau: 'grok/urgence-chauffe-eau', cuisine: 'grok/equip-cuisine', electricite: 'grok/urgence-electricite' };

export default (c) => {
  const f = c.donnees.forfaits;
  const fo = (k) => f.find((x) => x.cle === k);
  return html`
${ouvertureBon(c)}

<section class="forfaits clair" id="forfaits">
  <div class="conteneur">
    <header class="tete-section tete-section--large">
      <p class="surtitre" data-anime>${c.t('depannage.forfaitsSurtitre')}</p>
      <h2 data-anime="lignes">${c.t('depannage.forfaits.titre')}</h2>
      <p data-anime>${c.t('depannage.forfaits.texte')} <span class="a-completer">${c.t('commun.ttc')}</span></p>
    </header>
    <ul class="tickets" role="list" data-effet="ticket" data-visuel>
      ${f.map((x, i) => html`<li id="forfait-${x.cle}">${ticket(c, { numero: String(i + 1).padStart(2, '0'), lignes: [{ titre: x.titre, detail: x.detail, prix: x.prix }], classe: 'ticket--grille', imprime: true })}</li>`)}
    </ul>
  </div>
</section>

<section class="thermique bloc sombre" id="thermique">
  <div class="conteneur bloc-grille">
    <div>
      <p class="surtitre" data-anime>${c.t('depannage.thermique.surtitre')}</p>
      <h2 data-anime="lignes">${c.t('depannage.thermique.titre')}</h2>
      <p data-anime>${c.t('depannage.thermique.texte')}</p>
      <div data-anime>${ticket(c, { numero: '02', lignes: [{ titre: fo('thermique').titre, detail: fo('thermique').detail, prix: fo('thermique').prix }] })}</div>
    </div>
    <figure class="thermique-figure" data-anime>
      <div class="thermique-scene" data-effet="thermique" data-souris role="img" aria-label="${c.s('depannage.thermique.region')}">
        ${c.media({ nom: 'grok/depannage-mur', alt: c.s('depannage.thermique.alt'), classe: 'thermique-mur', sizes: '(max-width: 860px) 100vw, 50vw' })}
        <canvas class="thermique-canvas" aria-hidden="true" data-audit-ignorer></canvas>
        <span class="thermique-viseur" aria-hidden="true" data-audit-ignorer></span>
        <p class="thermique-statut" aria-live="polite" data-trouve="${c.s('depannage.thermique.trouve')}">${c.t('commun.illustratif')}</p>
      </div>
      <figcaption class="thermique-legende petit"><span><span class="indice-souris">${c.t('depannage.thermique.indiceSouris')}</span><span class="indice-doigt">${c.t('depannage.thermique.indiceDoigt')}</span></span><span>15 °C<span class="thermique-echelle" aria-hidden="true"></span>30 °C</span></figcaption>
    </figure>
  </div>
</section>

<section class="horloge-section bloc" id="soir-week-end">
  ${c.media({ nom: 'grok/depannage-nuit', alt: '', classe: 'horloge-fond', sizes: '100vw', attrs: 'data-fx="parallaxe" data-fx-force="8"' })}
  <div class="conteneur horloge-grille" data-effet="horloge" data-lib-jour="${c.s('depannage.horloge.jour')}" data-lib-soir="${c.s('depannage.horloge.soir')}" data-lib-nuit="${c.s('depannage.horloge.nuit')}">
    <div>
      <p class="surtitre" data-anime>${c.t('depannage.horloge.surtitre')}</p>
      <h2 data-anime="lignes">${c.t('depannage.horloge.titre')}</h2>
      <p data-anime>${c.t('depannage.horloge.texte')}</p>
      <div class="horloge-reglages" data-anime>
        <fieldset class="choix-jours">
          <legend>${c.t('depannage.horloge.jourLegende')}</legend>
          ${['semaine', 'weekend', 'ferie'].map((k, i) => html`<label class="puce"><input type="radio" name="jour-tarif" value="${k}"${i === 0 ? brut(' checked') : ''}><span>${c.t('depannage.horloge.' + k)}</span></label>`)}
        </fieldset>
        <label for="heure-tarif">${c.t('depannage.horloge.heure')}&nbsp;: <span class="horloge-heure" data-heure>14 h 00</span></label>
        <input id="heure-tarif" type="range" min="0" max="23.75" step="0.25" value="14">
        <p class="petit a-completer">${c.t('depannage.horloge.horaires')}</p>
      </div>
    </div>
    <div class="horloge" aria-hidden="true" data-anime>
      <svg viewBox="0 0 300 300">
        <circle class="horloge-cadran" cx="150" cy="150" r="140"/>
        ${brut(`<path class="horloge-soir" d="${arc(150, 150, 118, 20, 24)}"/><path class="horloge-nuit" d="${arc(150, 150, 118, 0.02, 8)}"/>`)}
        <g class="horloge-heures">${[...Array(12)].map((_, i) => { const h = i * 2; const a = (h / 24) * Math.PI * 2 - Math.PI / 2; return brut(`<text x="${(150 + Math.cos(a) * 104).toFixed(1)}" y="${(150 + Math.sin(a) * 104).toFixed(1)}">${h}</text>`); })}</g>
        <g class="horloge-minutes"><path d="M150 150 L150 80"/></g><g class="horloge-aiguille"><path d="M150 150 L150 90"/><circle cx="150" cy="150" r="11"/></g>
      </svg>
    </div>
    <div class="horloge-ticket" aria-live="polite">
      ${ticket(c, { numero: '01', lignes: [{ titre: fo('fuite').titre, detail: c.s('depannage.horloge.jour'), prix: fo('fuite').prix }], classe: 'ticket--horloge' })}
    </div>
  </div>
</section>

<section class="pannes bloc clair" id="pannes">
  <div class="conteneur">
    <header class="tete-section">
      <h2 data-anime="lignes">${c.t('depannage.pannes.titre')}</h2>
      <p data-anime>${c.t('depannage.pannes.texte')}</p>
    </header>
    <ul class="pannes-liste" role="list" data-anime="cascade">
      ${PANNES.map((k) => html`<li class="panne">
        ${c.media({ nom: IMAGES[k], alt: '', classe: 'panne-media', sizes: '(max-width: 760px) 90vw, 280px' })}
        <div><h3>${c.t('pannes.' + k + '.titre')}</h3><p>${c.t('pannes.' + k + '.texte')}</p></div>
      </li>`)}
    </ul>
  </div>
</section>

<section class="faq bloc sombre" id="faq">
  <div class="conteneur faq-grille">
    <div>
      <h2 data-anime="lignes">${c.t('depannage.faq.titre')}</h2>
      ${c.donnees.faq.map((q) => html`<details class="faq-item" data-anime><summary>${q.q}</summary><p>${q.r}</p></details>`)}
    </div>
    ${c.media({ nom: 'grok/urgence-robinet', alt: '', classe: 'faq-media', sizes: '(max-width: 860px) 100vw, 35vw', attrs: 'data-fx="parallaxe"' })}
  </div>
</section>

${finCourte(c, { titre: c.t('depannage.fin.titre'), texte: c.t('depannage.fin.texte'), classe: 'clair', image: 'grok/urgence-canalisation' })}
`;
};

function arc(cx, cy, r, h1, h2) {
  const a = (h) => (h / 24) * Math.PI * 2 - Math.PI / 2;
  const p = (h) => [cx + Math.cos(a(h)) * r, cy + Math.sin(a(h)) * r].map((v) => v.toFixed(1)).join(' ');
  return `M${p(h1)} A${r} ${r} 0 0 1 ${p(h2 - 0.001)}`;
}
