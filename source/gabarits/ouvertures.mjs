/* Ouvertures des pages intérieures : une composition propre à chaque page (l'accueil a la lampe).
   bon (Dépannage), chantier (Rénovation), trappe (Plomberie), metre (Devis), numero (Contact).
   Chacune garde : un seul h1, l'action principale et l'information clé dans le premier écran, son image en priorité. */
import { html, brut } from '../../outils/gabarit.mjs';
import { icone, prix } from './morceaux.mjs';

const NB = ' ';
const appeler = (c, attrs = 'data-action-principale') => html`<a class="bouton bouton--appel" href="tel:${c.site.contact.telephoneLien}" ${brut(attrs)} data-survol="magnetique">${brut(icone('tel'))}${c.t('commun.appelerNumero')}</a>`;

/* Dépannage : texte à gauche, photo encadrée à droite, bon d'intervention des 3 tarifs clés qui s'imprime par-dessus. */
export function ouvertureBon(c) {
  const f = (k) => c.donnees.forfaits.find((x) => x.cle === k);
  const lignes = [['fuite', 'l1', 'd1'], ['thermique', 'l2', 'd2'], ['soir', 'l3', 'd3']];
  return html`<section class="ov ov-bon" id="debut" data-tete="bon">
  <div class="conteneur ov-bon-grille">
    <div class="ov-texte">
      <p class="surtitre ov-anim" data-anime="gsap">${c.t('depannage.surtitre')}</p>
      <h1 class="ov-anim ov-titre" data-anime="gsap">${c.t('depannage.titre')}</h1>
      <p class="ov-anim ov-intro" data-anime="gsap">${c.t('depannage.texte')}</p>
      <p class="hero-actions ov-anim" data-anime="gsap">${appeler(c)}</p>
      <p class="hero-info ov-anim" data-info-cle data-anime="gsap">${c.t('depannage.info')}</p>
    </div>
    <div class="ov-bon-visuel" data-effet="bon">
      ${c.media({ nom: 'grok/depannage-bon', alt: c.s('depannage.alt'), cadrage: '55% 58%', priorite: true, classe: 'ov-bon-photo', sizes: '(max-width: 860px) 92vw, 40vw' })}
      <div class="ticket ticket--bon" data-superpose>
        <div class="ticket-tete"><span class="ticket-marque">${c.site.nom}</span><span class="ticket-num">${c.t('depannage.bon.titre')}</span></div>
        <ul class="ticket-lignes" role="list">${lignes.map(([k, l, d]) => html`<li class="ticket-ligne ov-ligne" data-anime="gsap">
          <span class="ticket-l-texte"><span class="ticket-l-titre">${c.t('depannage.bon.' + l)}</span><span class="ticket-l-detail">${c.t('depannage.bon.' + d)}</span></span>
          <span class="ticket-prix" data-prix>${prix(f(k).prix)}</span>
        </li>`)}</ul>
        <p class="ticket-pied">${c.t('commun.ttc')} · <a href="#forfaits">${c.t('depannage.bon.pied')}</a></p>
      </div>
    </div>
  </div>
</section>`;
}

/* Rénovation : fond carrelé clair, grand titre, bandeau photo recouvert d'un calque de plan qui s'efface au défilement. */
export function ouvertureChantier(c, { action }) {
  const traits = [
    'M640 60 V440', 'M640 60 H1060 V440 H640', 'M700 60 V200 H900', 'M960 120 h60 v60 h-60 z', 'M700 300 h150 v80 h-150 z',
    'M1060 260 h-40 a40 40 0 0 0 -40 40', 'M640 380 h40', 'M120 120 H560', 'M120 200 H480', 'M120 280 H520',
  ];
  return html`<section class="ov ov-chantier clair" id="debut" data-tete="chantier">
  <div class="conteneur ov-chantier-tete">
    <p class="surtitre ov-anim" data-anime="gsap">${c.t('renovation.surtitre')}</p>
    <h1 class="ov-anim ov-titre" data-anime="gsap">${c.t('renovation.titre')}</h1>
    <div class="ov-chantier-rangee">
      <p class="ov-anim ov-intro" data-anime="gsap">${c.t('renovation.texte')}</p>
      <div class="ov-anim" data-anime="gsap">
        <p class="hero-actions">${action}</p>
        <p class="hero-info" data-info-cle>${c.t('renovation.info')}</p>
      </div>
    </div>
  </div>
  <div class="ov-chantier-bande" data-effet="chantier">
    ${c.media({ nom: 'grok/renovation-bande', alt: c.s('renovation.alt'), cadrage: '55% 55%', cadrageMobile: '72% 55%', priorite: true, classe: 'ov-chantier-photo', sizes: '100vw' })}
    <div class="ov-calque" aria-hidden="true" data-audit-ignorer>
      <svg viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice">${brut(traits.map((d) => `<path d="${d}"/>`).join(''))}<g class="cotes"><path d="M640 470 H1060"/><path d="M640 462 v16 M1060 462 v16"/></g></svg>
      <p class="ov-calque-legende">${c.t('renovation.plan.coupe')}</p>
    </div>
    <span class="ov-calque-bord" aria-hidden="true" data-audit-ignorer></span>
  </div>
</section>`;
}

/* Plomberie : trappe de visite vissée qui s'ouvre sur la photo ; sommaire des équipements en liens directs. */
export function ouvertureTrappe(c) {
  const eq = c.donnees.equipements;
  return html`<section class="ov ov-trappe" id="debut" data-tete="trappe">
  <div class="conteneur ov-trappe-grille">
    <div class="ov-texte">
      <p class="surtitre ov-anim" data-anime="gsap">${c.t('plomberie.surtitre')}</p>
      <h1 class="ov-anim ov-titre" data-anime="gsap">${c.t('plomberie.titre')}</h1>
      <p class="ov-anim ov-intro" data-anime="gsap">${c.t('plomberie.texte')}</p>
      <p class="hero-actions ov-anim" data-anime="gsap">${appeler(c)}</p>
      <p class="hero-info ov-anim" data-info-cle data-anime="gsap">${c.t('plomberie.info')}</p>
      <nav class="ov-sommaire ov-anim" data-anime="gsap" aria-label="${c.s('plomberie.sommaire')}">
        <p>${c.t('plomberie.sommaire')}</p>
        <ol role="list">${eq.map((e, i) => html`<li data-anime="gsap"><a href="#${e.cle}" data-sans-transition><span>${String(i + 1).padStart(2, '0')}</span>${e.titre}</a></li>`)}</ol>
      </nav>
    </div>
    <div class="ov-trappe-cadre" data-effet="trappe">
      ${c.media({ nom: 'grok/plomberie-trappe', alt: c.s('plomberie.alt'), cadrage: '50% 52%', priorite: true, classe: 'ov-trappe-photo', sizes: '(max-width: 860px) 88vw, 42vw' })}
      <span class="ov-trappe-porte" aria-hidden="true" data-audit-ignorer></span>
      ${['hg', 'hd', 'bg', 'bd'].map((v) => brut(`<span class="vis vis--${v}" aria-hidden="true" data-audit-ignorer></span>`))}
    </div>
  </div>
</section>`;
}

/* Devis : fond quadrillé, ouverture compacte, mètre ruban jaune qui se déroule et porte les quatre étapes. */
export function ouvertureMetre(c) {
  const etapes = ['e1', 'e2', 'e3', 'e4'];
  const graduations = [];
  for (let i = 0; i <= 240; i++) {
    const x = i * 10, h = i % 10 === 0 ? 30 : i % 5 === 0 ? 20 : 12;
    graduations.push(`<path d="M${x} 0 v${h}"/>`);
    if (i % 10 === 0) graduations.push(`<text x="${x + 4}" y="46">${i / 10}</text>`);
  }
  return html`<section class="ov ov-metre clair" id="debut" data-tete="metre">
  <div class="conteneur ov-metre-grille">
    <div class="ov-texte">
      <p class="surtitre ov-anim" data-anime="gsap">${c.t('devis.surtitre')}</p>
      <h1 class="ov-anim ov-titre" data-anime="gsap">${c.t('devis.titre')}</h1>
      <p class="ov-anim ov-intro" data-anime="gsap">${c.t('devis.texte')}</p>
      <p class="hero-actions ov-anim" data-anime="gsap"><a class="bouton bouton--sombre" href="#estimateur" data-action-principale data-survol="magnetique">${c.t('accueil.estimer.action')}</a></p>
      <p class="hero-info ov-anim" data-info-cle data-anime="gsap">${c.t('devis.info')}</p>
    </div>
    ${c.media({ nom: 'grok/devis-cadre', alt: c.s('devis.alt'), cadrage: '62% 50%', priorite: true, classe: 'ov-metre-photo ov-anim', sizes: '(max-width: 860px) 92vw, 36vw', attrs: 'data-anime="gsap"' })}
  </div>
  <div class="ov-metre-ruban" data-effet="metre" role="img" aria-label="${c.s('devis.metre')}">
    <div class="ov-metre-bande">
      <div class="ov-metre-reglet"><svg class="ov-metre-graduations" viewBox="0 0 2400 56" preserveAspectRatio="xMinYMin meet" aria-hidden="true">${brut(graduations.join(''))}</svg></div>
      <ol class="ov-metre-etapes" role="list">${etapes.map((k, i) => html`<li data-anime="gsap"><span>${i + 1}</span>${c.t('devis.' + k)}</li>`)}</ol>
    </div>
    <span class="ov-metre-boitier" aria-hidden="true"></span>
  </div>
</section>`;
}

/* Contact : le numéro est l'ouverture, en très grand ; la rue au crépuscule en bandeau panoramique dessous. */
export function ouvertureNumero(c) {
  const chiffres = c.site.contact.telephone.split(' ');
  return html`<section class="ov ov-numero" id="debut" data-tete="numero">
  <div class="conteneur ov-numero-centre">
    <p class="surtitre ov-anim" data-anime="gsap">${c.t('contact.surtitre')}</p>
    <h1 class="ov-anim ov-numero-titre" data-anime="gsap">${c.t('contact.titre')}</h1>
    <p class="ov-numero-legende ov-anim" data-anime="gsap">${c.t('contact.numeroTitre')}</p>
    <a class="ov-numero-tel" href="tel:${c.site.contact.telephoneLien}" data-action-principale aria-label="${c.s('commun.appelerNumero')}">${chiffres.map((p) => html`<span class="paire"><span class="paire-in">${p}</span></span>`)}</a>
    <p class="ov-numero-actions ov-anim" data-anime="gsap">${c.lien('contact', { ancre: 'rendez-vous', classe: 'bouton bouton--contour', texte: c.t('contact.rdv'), attrs: 'data-survol="magnetique"' })}</p>
    <p class="hero-info ov-anim" data-info-cle data-anime="gsap">${c.t('commun.sansObligation')} · ${c.site.contact.adresse}</p>
  </div>
  ${c.media({ nom: 'grok/contact-bande', alt: c.s('contact.alt'), cadrage: '50% 60%', cadrageMobile: '72% 60%', priorite: true, classe: 'ov-numero-bande', sizes: '100vw', attrs: 'data-fx="parallaxe" data-fx-force="14"' })}
</section>`;
}
