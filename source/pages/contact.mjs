/* Contact & RDV : formulaire de rendez-vous en trois étapes (vrais champs du site actuel), coordonnées, carte (ricochet). */
import { html, brut } from '../../outils/gabarit.mjs';
import { carteOise, icone } from '../gabarits/morceaux.mjs';
import { tete } from '../gabarits/tete.mjs';

export const page = { cle: 'contact', fichier: 'contact', imagePartage: 'grok/contact-ouverture-1280.webp' };

export default (c) => {
  const T = (k) => c.t('contact.form.' + k);
  const types = ['depannage', 'urgence', 'renovation', 'reparation', 'montage', 'pose'];
  const projets = ['plomberie', 'chauffage', 'electricite', 'platrerie', 'maconnerie', 'menuiserie', 'murs', 'sols', 'complet'];
  return html`
${tete(c, { image: 'grok/contact-ouverture', alt: c.s('contact.alt'), surtitre: c.t('contact.surtitre'), titre: c.t('contact.titre'), texte: c.t('contact.texte'), info: c.t('commun.sansObligation'), cadrage: '55% 50%', fx: 'data-fx="parallaxe" data-fx-force="8"' })}

<section class="rendez-vous bloc clair" id="rendez-vous">
  <div class="conteneur contact-grille">
    <form class="rdv-form" data-formulaire data-etapes action="#" novalidate>
      <h2 data-anime="lignes">${T('titre')}</h2>
      <p data-anime>${T('etapes')}</p>
      <ol class="etapes-tete" role="list">${['e1', 'e2', 'e3'].map((k, i) => html`<li data-indicateur="${i}"${i === 0 ? brut(' aria-current="step"') : ''}>${i + 1}. ${T(k)}</li>`)}</ol>
      <p class="visuellement-cache" aria-live="polite" data-annonce-etape data-modele="${c.s('contact.form.etapesN')}"></p>
      <div class="form-hauteur">
        <fieldset class="etape-form courante" data-etape="0">
          <legend>${T('type')}</legend>
          <div class="cartes-choix">${types.map((k, i) => html`<label class="carte-choix"><input type="radio" name="type" value="${k}"${i === 0 ? brut(' checked') : ''}><span>${c.t('types.' + k)}</span></label>`)}</div>
          <div class="champ" style="margin-top:18px"><label for="r-projet">${T('projet')}</label><select id="r-projet" name="projet">${projets.map((k) => html`<option value="${k}">${c.t('projets.' + k)}</option>`)}</select></div>
          <div class="champ"><label for="r-piece">${T('piece')}</label><select id="r-piece" name="piece"><option value="">${T('choisir')}</option>${c.donnees.devis.pieces.map((p) => html`<option>${p}</option>`)}</select></div>
        </fieldset>
        <fieldset class="etape-form" data-etape="1">
          <legend>${T('e2')}</legend>
          <div class="champ"><label for="r-ville">${T('ville')}</label><input id="r-ville" name="ville" autocomplete="address-level2" list="communes-rdv" required></div>
          <datalist id="communes-rdv">${c.donnees.communes.communes.map((x) => html`<option value="${x.nom}">`)}</datalist>
          <div class="champs-2">
            <div class="champ"><label for="r-jour">${T('jour')}</label><input id="r-jour" name="jour" type="date" required></div>
            <div class="champ"><label for="r-heure">${T('heure')}</label><input id="r-heure" name="heure" type="time"></div>
          </div>
          <p class="petit a-completer">${c.t('contact.horaires')}</p>
        </fieldset>
        <fieldset class="etape-form" data-etape="2">
          <legend>${T('e3')}</legend>
          <div class="champs-2">
            <div class="champ"><label for="r-nom">${T('nom')}</label><input id="r-nom" name="nom" autocomplete="family-name" required></div>
            <div class="champ"><label for="r-prenom">${T('prenom')}</label><input id="r-prenom" name="prenom" autocomplete="given-name" required></div>
            <div class="champ"><label for="r-email">${T('email')}</label><input id="r-email" name="email" type="email" autocomplete="email" required></div>
            <div class="champ"><label for="r-tel">${T('tel')}</label><input id="r-tel" name="tel" type="tel" autocomplete="tel" required></div>
          </div>
          <div class="champ"><label for="r-message">${T('message')}</label><textarea id="r-message" name="message" rows="4" required></textarea></div>
          <p class="mention-donnees">${T('donnees')}</p>
          <p data-message-envoi hidden tabindex="-1" data-texte="${c.s('contact.form.envoye')}"></p>
        </fieldset>
      </div>
      <div class="etapes-actions">
        <button type="button" class="bouton bouton--contour" data-etape-precedente hidden>${T('precedent')}</button>
        <button type="button" class="bouton bouton--sombre" data-etape-suivante>${T('suivant')}</button>
        <button type="submit" class="bouton bouton--sombre" data-etape-envoi hidden>${T('envoyer')}</button>
      </div>
    </form>
    <aside class="coordonnees" data-anime>
      <p class="coordonnees-marque" data-visuel><img src="/assets/images/logo-clair.svg" alt="" width="94" height="60"></p>
      <h3>${c.t('contact.telTitre')}</h3>
      <p><a class="tel-grand" href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a></p>
      <h3>${c.t('contact.adresseTitre')}</h3>
      <p>${c.site.contact.adresse}</p>
      <h3>${c.t('contact.emailTitre')}</h3>
      <p class="a-completer">${c.t('commun.aCompleter')}</p>
      <h3>${c.t('contact.horairesTitre')}</h3>
      <p class="a-completer">${c.t('contact.horaires')}</p>
    </aside>
  </div>
</section>

<section class="zone sombre" id="zone">
  <div class="conteneur zone-grille">
    <header class="tete-section">
      <p class="surtitre" data-anime>${c.t('accueil.zone.surtitre')}</p>
      <h2 data-anime="lignes">${c.t('contact.carteTitre')}</h2>
      <p data-anime>${c.t('accueil.zone.texte')}</p>
      <p data-anime><a class="bouton bouton--appel" href="tel:${c.site.contact.telephoneLien}">${brut(icone('tel'))}${c.t('commun.appelerNumero')}</a></p>
    </header>
    ${carteOise(c)}
  </div>
</section>
`;
};
