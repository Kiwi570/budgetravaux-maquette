/* Accueil Budgetravaux, direction « Derrière le mur ».
   Ordre du visiteur : vous venez chez moi ? (appel, zone) → combien ? (forfaits) → vous savez faire ? (métiers)
   → je peux vous faire confiance ? (étapes, zone, réalisations, Pedro) → devis ou rendez-vous.
   Effets propres : lampe (ouverture), reseau (urgences), ticket (forfaits, devis), disjoncteurs (métiers),
   compteur-eau (intervention), ricochet (zone). Le reste vient de la bibliothèque du socle. */
import { html, brut } from '../../outils/gabarit.mjs';
import { carteOise, prix, ticket, reseauHero, icone, tableau } from '../gabarits/morceaux.mjs';

export const page = { cle: 'accueil', fichier: 'index', imagePartage: 'grok/accueil-ouverture-1280.webp' };

export default (c) => {
  const f = c.donnees.forfaits;
  const fuite = f.find((x) => x.cle === 'fuite');
  const cuivre = f.find((x) => x.cle === 'cuivre');
  return html`
<section class="hero-mur" id="debut" data-section>
  <div class="hero-scene" data-effet="lampe" data-souris>
    ${c.media({ nom: 'grok/accueil-ouverture', alt: c.s('accueil.hero.alt'), cadrage: '50% 50%', priorite: true, classe: 'hero-photo', sizes: '100vw' })}
    <canvas class="hero-lampe" aria-hidden="true" data-audit-ignorer></canvas>
    ${reseauHero()}
    <div class="hero-nuit" aria-hidden="true" data-superpose></div>
  </div>
  <div class="hero-texte conteneur">
    <p class="surtitre hero-surtitre" data-anime="gsap">${c.t('accueil.hero.surtitre')}</p>
    <h1 class="hero-titre" data-superpose><span class="hero-mot" data-anime="gsap">${c.t('accueil.hero.mot1')}</span> <span class="hero-mot" data-anime="gsap">${c.t('accueil.hero.mot2')}</span> <span class="hero-mot hero-mot--lumiere" data-anime="gsap">${c.t('accueil.hero.mot3')}</span></h1>
    <p class="hero-intro" data-anime="gsap">${c.t('accueil.hero.texte')}</p>
    <p class="hero-actions" data-anime="gsap">
      <a class="bouton bouton--appel" href="tel:${c.site.contact.telephoneLien}" data-action-principale data-survol="magnetique">${brut(icone('tel'))}${c.t('commun.appelerNumero')}</a>
      ${c.lien('devis', { classe: 'bouton bouton--contour', texte: c.t('accueil.hero.devis'), attrs: 'data-survol="magnetique"' })}
    </p>
    <p class="hero-info" data-info-cle data-anime="gsap">${c.t('accueil.hero.info')}</p>
  </div>
  <div class="hero-ticket-place" data-anime="gsap" data-superpose>
    ${ticket(c, { numero: '01', lignes: [{ titre: fuite.titre, detail: c.s('accueil.hero.ticketDetail'), prix: fuite.prix }], classe: 'ticket--hero' })}
  </div>
  <p class="hero-indice" aria-hidden="true"><span class="indice-souris">${c.t('accueil.hero.indiceSouris')}</span><span class="indice-doigt">${c.t('accueil.hero.indiceDoigt')}</span></p>
</section>

<section class="urgences sombre" id="urgences">
  <div class="conteneur urgences-grille">
    <header class="tete-section">
      <p class="surtitre" data-anime>${c.t('accueil.urgences.surtitre')}</p>
      <h2 data-anime="lignes">${c.t('accueil.urgences.titre')}</h2>
      <p data-anime>${c.t('accueil.urgences.texte')}</p>
      <p data-anime>${c.lien('depannage', { classe: 'lien-fleche', texte: c.t('accueil.urgences.voir') })}</p>
    </header>
    <div class="urgences-reseau">
      <svg class="reseau-colonne" viewBox="0 0 60 1000" preserveAspectRatio="none" aria-hidden="true" data-effet="reseau" data-audit-ignorer>
        <path class="reseau-tube" d="M30 0 V1000" />
        <path class="reseau-eau" d="M30 0 V1000" />
      </svg>
      <span class="reseau-goutte" aria-hidden="true" data-audit-ignorer></span>
      <ol class="urgences-liste" role="list">
        ${c.donnees.urgences.map((u, i) => {
          const fo = u.forfait ? f.find((x) => x.cle === u.forfait) : null;
          return html`<li class="urgence" data-raccord="${i}">
          <span class="raccord" aria-hidden="true"></span>
          ${c.media({ nom: u.image, alt: '', classe: 'urgence-media', sizes: '(max-width: 760px) 40vw, 220px', attrs: 'data-fx="zoom"' })}
          <div class="urgence-texte">
            <h3>${u.titre}</h3>
            <p>${u.texte}</p>
            <p class="urgence-prix">${fo ? html`<span>${u.prixLibelle}</span><strong data-prix>${prix(fo.prix)}</strong>` : html`<strong>${c.t('accueil.urgences.surDevis')}</strong>`}</p>
          </div>
        </li>`;
        })}
      </ol>
    </div>
  </div>
</section>

<section class="forfaits clair" id="forfaits">
  <div class="conteneur">
    <header class="tete-section tete-section--large">
      <p class="surtitre" data-anime>${c.t('accueil.forfaits.surtitre')}</p>
      <h2 data-anime="lignes">${c.t('accueil.forfaits.titre')}</h2>
      <p data-anime>${c.t('accueil.forfaits.texte')} <span class="a-completer">${c.t('commun.ttc')}</span></p>
    </header>
    <ul class="tickets" role="list" data-effet="ticket" data-visuel>
      ${f.map((x, i) => html`<li>${ticket(c, { numero: String(i + 1).padStart(2, '0'), lignes: [{ titre: x.titre, detail: x.detail, prix: x.prix }], classe: 'ticket--grille', imprime: true })}</li>`)}
    </ul>
    <p class="forfaits-suite" data-anime>${c.lien('depannage', { ancre: 'forfaits', classe: 'bouton bouton--sombre', texte: c.t('accueil.forfaits.voir'), attrs: 'data-survol="magnetique"' })}</p>
  </div>
</section>

<section class="metiers sombre" id="metiers">
  <div class="conteneur metiers-grille">
    <header class="tete-section">
      <p class="surtitre" data-anime>${c.t('accueil.metiers.surtitre')}</p>
      <h2 data-anime="lignes">${c.t('accueil.metiers.titre')}</h2>
      <p data-anime>${c.t('accueil.metiers.texte')}</p>
      <p data-anime>${c.lien('renovation', { classe: 'lien-fleche', texte: c.t('accueil.metiers.voir') })}</p>
    </header>
    ${tableau(c, 'accueil')}
  </div>
</section>

<section class="intervention clair" id="intervention" data-effet="compteur-eau">
  <div class="conteneur intervention-grille">
    <div class="intervention-cadran">
      <p class="surtitre" data-anime>${c.t('accueil.intervention.surtitre')}</p>
      <h2 data-anime="lignes">${c.t('accueil.intervention.titre')}</h2>
      <div class="compteur" aria-hidden="true" data-audit-ignorer>
        <svg class="compteur-cadre" viewBox="0 0 320 320" data-visuel>
          <circle cx="160" cy="160" r="150" class="compteur-bague"/>
          <circle cx="160" cy="160" r="128" class="compteur-fond"/>
          ${[...Array(40)].map((_, i) => { const a = (i / 40) * Math.PI * 2; const r1 = i % 5 ? 118 : 110; return brut(`<line x1="${160 + Math.cos(a) * r1}" y1="${160 + Math.sin(a) * r1}" x2="${160 + Math.cos(a) * 124}" y2="${160 + Math.sin(a) * 124}" class="compteur-graduation"/>`); })}
          <g class="compteur-aiguille"><path d="M160 160 L160 62" /><circle cx="160" cy="160" r="10"/></g>
        </svg>
        <div class="compteur-rouleaux" data-superpose><span class="compteur-libelle">${c.t('accueil.intervention.compteur')}</span><span class="rouleau"><span class="rouleau-bande">${c.donnees.etapes.map((e) => html`<span>${e.n}</span>`)}</span></span></div>
      </div>
    </div>
    <ol class="etapes" role="list">
      ${c.donnees.etapes.map((e, i) => html`<li class="etape" data-etape="${i}">
        <span class="etape-n">${e.n}</span>
        <h3>${e.titre}</h3>
        <p>${e.texte}</p>
      </li>`)}
    </ol>
  </div>
</section>

<section class="zone sombre" id="zone">
  <div class="conteneur zone-grille">
    <header class="tete-section">
      <p class="surtitre" data-anime>${c.t('accueil.zone.surtitre')}</p>
      <h2 data-anime="lignes">${c.t('accueil.zone.titre')}</h2>
      <p data-anime>${c.t('accueil.zone.texte')}</p>
      <ul class="communes" role="list" data-anime="cascade">${c.donnees.communes.communes.map((x) => html`<li>${x.nom}</li>`)}</ul>
    </header>
    ${carteOise(c)}
  </div>
</section>

<section class="plomberie-apercu ecran epingle sombre" id="plomberie" data-entete-cache data-fx="galerie" data-plein-ecran>
  <div class="conteneur galerie-tete">
    <p class="surtitre">${c.t('accueil.plomberie.surtitre')}</p>
    <h2 data-anime="lignes">${c.t('accueil.plomberie.titre')}</h2>
    <p>${c.t('accueil.plomberie.texte')} ${c.lien('plomberie', { classe: 'lien-fleche', texte: c.t('accueil.plomberie.voir') })}</p>
  </div>
  <div class="piste galerie-piste" data-galerie tabindex="0" role="region" aria-label="${c.s('accueil.plomberie.region')}">
    ${c.donnees.equipements.map((e, i) => html`<article class="carte">
      ${c.lien('plomberie', { ancre: e.cle, classe: 'carte-lien', texte: html`${c.media({ nom: e.image, alt: '', cadrage: e.cadrage, classe: 'carte-media', sizes: '(max-width: 760px) 72vw, 30vw' })}<span class="carte-n">${String(i + 1).padStart(2, '0')}</span><span class="carte-titre">${e.titre}</span><span class="carte-detail">${e.depannage.slice(0, 2).join(' · ')}</span>` })}
    </article>`)}
  </div>
  <div class="galerie-progres" aria-hidden="true"><span></span></div>
</section>

<section class="pedro clair" id="pedro">
  <div class="conteneur pedro-grille">
    ${c.donnees.pedro && c.donnees.pedro.image ? c.media({ nom: c.donnees.pedro.image, alt: c.s('accueil.pedro.alt'), cadrage: c.donnees.pedro.cadrage || '50% 30%', classe: 'pedro-media', sizes: '(max-width: 760px) 100vw, 40vw', attrs: 'data-anime="rideau"' }) : html`<div class="pedro-cachet" data-visuel data-anime="rideau"><img src="/assets/images/logo-budgetravaux.png" alt="${c.site.nom}" width="302" height="128"><span class="a-completer">${c.t('accueil.pedro.photo')}</span></div>`}
    <div>
      <p class="surtitre" data-anime>${c.t('accueil.pedro.surtitre')}</p>
      <h2 data-anime="lignes">${c.t('accueil.pedro.nom')}</h2>
      <blockquote class="pedro-citation" data-anime="mots"><p>${c.t('accueil.pedro.citation')}</p></blockquote>
      <p data-anime>${c.t('accueil.pedro.texte')}</p>
      <ul class="engagements" role="list" data-anime="cascade">
        ${['e1', 'e2', 'e3', 'e4', 'e5', 'e6'].map((k) => html`<li>${brut(icone('coche'))}${c.t('engagements.' + k)}</li>`)}
      </ul>
      <p class="petit a-completer" data-anime>${c.t('accueil.pedro.decennale')}</p>
    </div>
  </div>
</section>

<section class="estimer sombre" id="estimer">
  <div class="conteneur estimer-grille">
    <div>
      <p class="surtitre" data-anime>${c.t('accueil.estimer.surtitre')}</p>
      <h2 data-anime="lignes">${c.t('accueil.estimer.titre')}</h2>
      <p data-anime>${c.t('accueil.estimer.texte')}</p>
      <p data-anime>${c.lien('devis', { classe: 'bouton bouton--appel', texte: c.t('accueil.estimer.action'), attrs: 'data-survol="magnetique"' })}</p>
    </div>
    <div class="estimer-ticket" data-effet="ticket" data-visuel>
      ${ticket(c, { numero: 'EX', titre: c.s('accueil.estimer.exemple'), lignes: [{ titre: fuite.titre, detail: fuite.detail, prix: fuite.prix }, { titre: cuivre.titre, detail: cuivre.detail, prix: cuivre.prix }], total: fuite.prix + cuivre.prix, imprime: true, classe: 'ticket--exemple' })}
    </div>
  </div>
</section>

<section class="fin-appel" id="fin">
  ${c.media({ nom: 'grok/accueil-appel', alt: c.s('accueil.fin.alt'), cadrage: '60% 50%', cadrageMobile: '80% 55%', classe: 'fin-appel-media', sizes: '100vw', attrs: 'data-fx="parallaxe" data-fx-force="12"' })}
  <div class="conteneur fin-appel-texte">
    <h2 data-anime="lignes">${c.t('accueil.fin.titre')}</h2>
    <p data-anime>${c.t('accueil.fin.texte')}</p>
    <p class="fin-actions" data-anime>
      <a class="bouton bouton--appel" href="tel:${c.site.contact.telephoneLien}" data-survol="magnetique">${brut(icone('tel'))}${c.t('commun.appelerNumero')}</a>
      ${c.lien('contact', { ancre: 'rendez-vous', classe: 'bouton bouton--contour', texte: c.t('accueil.fin.rdv'), attrs: 'data-survol="magnetique"' })}
    </p>
  </div>
</section>
`;
};

