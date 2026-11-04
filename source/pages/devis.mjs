/* Devis en ligne : estimateur en quatre étapes ; le ticket s'imprime ligne à ligne (ticket), total sur les prix publiés. */
import { html, brut } from '../../outils/gabarit.mjs';
import { prix } from '../gabarits/morceaux.mjs';
import { ouvertureMetre } from '../gabarits/ouvertures.mjs';

export const page = { cle: 'devis', fichier: 'devis-en-ligne', imagePartage: 'grok/devis-ouverture-1280.webp' };

const UNITE = { forfait: 'forfait', heure: 'heure', 'm²': 'm2', u: 'u', projet: 'projet' };

export default (c) => {
  const d = c.donnees.devis;
  const etapes = ['e1', 'e2', 'e3', 'e4'];
  const libellePrix = (p) => (p.prix == null ? c.s('devis.surDevis') : `${p.base ? c.s('devis.aPartir') + ' ' : ''}${prix(p.prix)}${p.unite === 'forfait' ? '' : ' / ' + c.s('devis.unites.' + UNITE[p.unite])}`);
  return html`
${ouvertureMetre(c)}

<section class="estimateur bloc clair" id="estimateur">
  <div class="conteneur devis-grille">
    <form class="devis-form" data-formulaire data-etapes data-effet="estimateur" action="#" novalidate>
      <ol class="etapes-tete" role="list">${etapes.map((k, i) => html`<li data-indicateur="${i}"${i === 0 ? brut(' aria-current="step"') : ''}>${i + 1}. ${c.t('devis.' + k)}</li>`)}</ol>
      <p class="visuellement-cache" aria-live="polite" data-annonce-etape data-modele="${c.s('devis.etapes')}"></p>
      <div class="form-hauteur">
        <fieldset class="etape-form courante" data-etape="0">
          <legend>${c.t('devis.e1')}</legend>
          <div class="cartes-choix">${d.metiers.map((m, i) => html`<label class="carte-choix"><input type="radio" name="metier" value="${m.cle}"${i === 0 ? brut(' checked') : ''}><span>${m.titre}</span></label>`)}</div>
          <p class="sous-titre-choix">${c.t('devis.sousTitre')}</p>
          ${d.metiers.map((m, i) => html`<div class="choix-precision" data-sous-de="${m.cle}"${i ? brut(' hidden') : ''}>${m.sous.map((s, j) => html`<label class="puce"><input type="radio" name="precision-${m.cle}" value="${s}"${j === 0 ? brut(' checked') : ''}><span>${s}</span></label>`)}</div>`)}
        </fieldset>
        <fieldset class="etape-form" data-etape="1">
          <legend>${c.t('devis.e2')}</legend>
          <div class="cartes-choix cartes-choix--petites">${d.pieces.map((p, i) => html`<label class="carte-choix"><input type="radio" name="piece" value="${p}"${i === 6 ? brut(' checked') : ''}><span>${p}</span></label>`)}</div>
        </fieldset>
        <fieldset class="etape-form" data-etape="2">
          <legend>${c.t('devis.e3')}</legend>
          <ul class="postes" role="list">${d.postes.map((p) => html`<li class="poste" data-poste="${p.cle}" data-metier="${p.metier}" data-prix="${p.prix ?? ''}" data-unite="${p.unite}">
            <span class="poste-texte"><span class="poste-titre">${p.titre}</span> <span class="poste-prix">${libellePrix(p)}</span></span>
            ${p.unite === 'forfait' || p.unite === 'projet' ? html`<span></span>` : html`<label class="visuellement-cache" for="qte-${p.cle}">${c.t('devis.quantite')} : ${p.titre}</label><input id="qte-${p.cle}" type="number" min="1" max="999" step="1" value="${p.unite === 'm²' ? 10 : 1}" inputmode="numeric">`}
            <button type="button" class="poste-bouton" aria-pressed="false" data-ajouter="${c.s('devis.ajouter')}" data-retirer="${c.s('devis.retirer')}">${c.t('devis.ajouter')}</button>
          </li>`)}</ul>
        </fieldset>
        <fieldset class="etape-form" data-etape="3">
          <legend>${c.t('devis.e4')}</legend>
          <div class="champs-2">
            <div class="champ"><label for="d-nom">${c.t('devis.nom')}</label><input id="d-nom" name="nom" autocomplete="family-name" required></div>
            <div class="champ"><label for="d-prenom">${c.t('devis.prenom')}</label><input id="d-prenom" name="prenom" autocomplete="given-name" required></div>
            <div class="champ"><label for="d-email">${c.t('devis.email')}</label><input id="d-email" name="email" type="email" autocomplete="email" required></div>
            <div class="champ"><label for="d-tel">${c.t('devis.tel')}</label><input id="d-tel" name="tel" type="tel" autocomplete="tel" required></div>
            <div class="champ"><label for="d-ville">${c.t('devis.ville')}</label><input id="d-ville" name="ville" autocomplete="address-level2" list="communes-oise"></div>
            <div class="champ"><label for="d-jour">${c.t('devis.jour')}</label><input id="d-jour" name="jour" type="date"></div>
          </div>
          <datalist id="communes-oise">${c.donnees.communes.communes.map((x) => html`<option value="${x.nom}">`)}</datalist>
          <div class="champ"><label for="d-message">${c.t('devis.message')}</label><textarea id="d-message" name="message" rows="4"></textarea></div>
          <p class="mention-donnees">${c.t('devis.donnees')}</p>
          <p data-message-envoi hidden tabindex="-1" data-texte="${c.s('devis.envoye')}"></p>
        </fieldset>
      </div>
      <div class="etapes-actions">
        <button type="button" class="bouton bouton--contour" data-etape-precedente hidden>${c.t('devis.precedent')}</button>
        <button type="button" class="bouton bouton--sombre" data-etape-suivante>${c.t('devis.suivant')}</button>
        <button type="submit" class="bouton bouton--sombre" data-etape-envoi hidden>${c.t('devis.envoyer')}</button>
      </div>
    </form>
    <aside class="devis-ticket" aria-label="${c.s('devis.ticketTitre')}" data-visuel>
      <div class="ticket ticket--devis" data-ticket-dynamique data-sur-devis="${c.s('devis.surDevis')}" data-unite-forfait="${c.s('devis.unites.forfait')}" data-unite-projet="${c.s('devis.unites.projet')}">
        <div class="ticket-tete"><span class="ticket-marque">${c.site.nom}</span><span class="ticket-num">${c.t('devis.ticketTitre')}</span></div>
        <p class="ticket-titre" data-ticket-contexte></p>
        <ul class="ticket-lignes" role="list" aria-live="polite" data-vide="${c.s('devis.ticketVide')}"></ul>
        <p class="ticket-total"><span>${c.t('devis.totalConnu')}</span><span class="ticket-prix" data-prix><span data-total data-vide="${c.s('devis.totalVide')}">${c.s('devis.totalVide')}</span></span></p>
        <p class="ticket-reste" data-reste-modele="${c.s('devis.resteDevis')}"></p>
        <p class="ticket-pied">${c.t('commun.ttc')}</p>
      </div>
    </aside>
  </div>
</section>
`;
};
