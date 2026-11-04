/* Morceaux partagés par les pages Budgetravaux : ticket d'intervention, prix, icônes, réseau de l'ouverture,
   carte schématique de l'Oise (ricochet) et tableau électrique des corps d'état (disjoncteurs). */
import { html, brut } from '../../outils/gabarit.mjs';

const NB = ' ';
export const prix = (n) => (n == null ? '' : `${n}${NB}€`);

const ICONES = {
  tel: '<svg class="icone" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8z" fill="currentColor"/></svg>',
  coche: '<svg class="icone icone--coche" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  fleche: '<svg class="icone" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};
export const icone = (n) => ICONES[n] || '';

/* Ticket d'intervention : lignes, prix qui comptent (data-compteur du socle), total, pied « TTC à confirmer ». */
export function ticket(c, { numero = '01', titre = '', lignes = [], total = null, classe = '', imprime = false } = {}) {
  const montant = (n) => html`<span class="ticket-prix" data-prix><span data-compteur="${n}">${String(n)}</span>${NB}€</span>`;
  return html`<div class="ticket ${classe}"${imprime ? brut(' data-imprime') : ''}>
  <div class="ticket-tete"><span class="ticket-marque">${c.site.nom}</span><span class="ticket-num">N°${NB}${numero}</span></div>
  ${titre ? html`<p class="ticket-titre">${titre}</p>` : ''}
  <ul class="ticket-lignes" role="list">${lignes.map((l) => html`<li class="ticket-ligne">
    <span class="ticket-l-texte"><span class="ticket-l-titre">${l.titre}</span>${l.detail ? html`<span class="ticket-l-detail">${l.detail}</span>` : ''}</span>
    ${l.prix != null ? montant(l.prix) : html`<span class="ticket-prix ticket-prix--devis">${c.t('devis.surDevis')}</span>`}
  </li>`)}</ul>
  ${total != null ? html`<p class="ticket-total"><span>${c.t('accueil.estimer.total')}</span>${montant(total)}</p>` : ''}
  <p class="ticket-pied">${c.t('commun.ttc')}</p>
</div>`;
}

/* Réseau de l'ouverture : mêmes tracés que la texture « derrière le mur » du WebGL (site.js lit data-trace). */
export const RESEAU = [
  { cle: 'cuivre', d: 'M1010 960 V420 Q1010 380 1050 380 H1640', l: 22 },
  { cle: 'eau', d: 'M1280 960 V470 Q1280 430 1240 430 H1020 Q980 430 980 470 V960', l: 18 },
  { cle: 'gaine', d: 'M1160 -40 V250 Q1160 290 1200 290 H1640', l: 12 },
  { cle: 'gaine2', d: 'M1160 220 Q1160 150 1100 150 H980 Q940 150 940 110 V-40', l: 9 },
];
export function reseauHero() {
  return html`<svg class="hero-reseau" viewBox="0 0 1600 900" preserveAspectRatio="xMaxYMid slice" aria-hidden="true" data-audit-ignorer>
  ${RESEAU.map((r) => brut(`<path class="tube tube--${r.cle}" d="${r.d}" data-trace="${r.cle}" data-largeur="${r.l}"/>`))}
  ${brut('<g class="raccords"><circle cx="1010" cy="380" r="15"/><circle cx="1280" cy="430" r="13"/><circle cx="980" cy="430" r="13"/><circle cx="1160" cy="150" r="10"/><rect x="1132" y="222" width="56" height="56" rx="8"/></g>')}
  <circle class="hero-goutte" cx="0" cy="0" r="9"/>
</svg>`;
}

/* Carte schématique de l'Oise : contour simplifié, communes citées par le site, ondes depuis Longueil-Sainte-Marie. */
export function carteOise(c, { classe = '' } = {}) {
  const d = c.donnees.communes;
  const k = 587, lon0 = 1.65, lat0 = 49.8, cosl = Math.cos((49.4 * Math.PI) / 180);
  const px = (lon, lat) => [((lon - lon0) * cosl * k).toFixed(1), ((lat0 - lat) * k).toFixed(1)];
  const contour = 'M' + d.contour.map(([lo, la]) => px(lo, la).join(' ')).join(' L') + ' Z';
  const [bx, by] = px(d.base.lon, d.base.lat);
  const points = d.communes.map((x) => {
    const [x0, y0] = px(x.lon, x.lat);
    const dist = Math.hypot(x0 - bx, y0 - by);
    const ax = x.dx < 0 ? 'end' : x.dx > 0 ? 'start' : 'middle';
    const tx = +x0 + x.dx * 10, ty = +y0 + (x.dy < 0 ? -10 : x.dy > 0 ? 20 : 5);
    return brut(`<g class="commune" data-distance="${dist.toFixed(0)}"><circle cx="${x0}" cy="${y0}" r="4.5"/><text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="${ax}">${x.nom}</text></g>`);
  });
  return html`<figure class="carte-oise ${classe}" data-effet="ricochet" data-visuel>
  <svg viewBox="0 0 600 446" role="img" aria-label="${c.s('accueil.zone.carte')}">
    ${brut(`<defs><clipPath id="clip-oise"><path d="${contour}"/></clipPath></defs><path class="oise-fond" d="${contour}"/>`)}
    <g clip-path="url(#clip-oise)" class="ondes">${[0, 1, 2, 3].map((i) => brut(`<circle class="onde" cx="${bx}" cy="${by}" r="0" data-onde="${i}"/>`))}</g>
    ${brut(`<path class="oise-contour" d="${contour}"/>`)}
    ${points}
    ${brut(`<g class="base"><circle class="base-point" data-repere cx="${bx}" cy="${by}" r="7"/><text x="${+bx + 16}" y="${+by + 5}">`)}${c.s('accueil.zone.base')}${brut('</text></g>')}
  </svg>
  <figcaption class="petit"><span class="legende-base">${c.t('accueil.zone.base')}</span> ${c.t('accueil.zone.carte')}</figcaption>
</figure>`;
}
/* Tableau électrique des corps d'état, partagé avec la page Rénovation. */
export function tableau(c, ou) {
  const m = c.donnees.metiers;
  return html`<div class="tableau-elec" data-effet="disjoncteurs" data-tableau="${ou}" role="group" aria-label="${c.s('accueil.metiers.region')}">
  <div class="tableau-rangee">
    ${m.map((x, i) => html`<button type="button" class="disjoncteur" data-metier="${x.cle}" aria-pressed="${i === 0 ? 'true' : 'false'}" aria-controls="panneau-${ou}">
      <span class="disj-corps"><span class="disj-levier"></span></span>
      <span class="disj-nom">${x.etiquette || x.titre}</span>
    </button>`)}
  </div>
  <p class="tableau-indice">${c.t('accueil.metiers.indice')}</p>
  <div class="tableau-panneaux" id="panneau-${ou}" aria-live="polite">
    ${m.map((x, i) => html`<article class="metier-panneau${i === 0 ? ' actif' : ''}" data-panneau="${x.cle}"${i === 0 ? '' : brut(' hidden')}>
      ${c.media({ nom: x.image, alt: '', classe: 'metier-media', sizes: '(max-width: 760px) 90vw, 300px' })}
      <div>
        <h3>${x.titre}</h3>
        <p class="metier-court">${x.court}</p>
        <ul role="list">${(ou === 'accueil' ? x.postes.slice(0, 3) : x.postes).map((p) => html`<li>${p}</li>`)}</ul>
        ${ou === 'renovation' ? c.lien('devis', { params: `metier=${x.cle}`, classe: 'lien-fleche', texte: c.t('renovation.tableau.devis') }) : ''}
      </div>
    </article>`)}
  </div>
</div>`;
}
