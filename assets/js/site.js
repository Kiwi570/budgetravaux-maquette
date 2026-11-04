/* Budgetravaux · effets propres au client (direction « Derrière le mur »).
   Le socle gère l'ouverture, le voile, l'en-tête, le menu, le mode calme, les boucles, les mesures et la bibliothèque
   d'effets (lignes, mots, cascade, rideau, parallaxe, zoom, trace, galerie, onde, magnétique, incline).
   Effets du plan : lampe, reseau, ticket, disjoncteurs, compteur-eau, ricochet, thermique, horloge.
   En plus : planches (rénovation), vannes (plomberie), formulaires en étapes et estimateur. */
import { demarrer, boucle, etat, quand, rafraichir } from './socle/index.js?v=1';

const gsap = window.gsap;
const ST = window.ScrollTrigger;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const souris = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const petit = () => window.matchMedia('(max-width: 760px)').matches;
const NB = ' ';
const euros = (n) => `${new Intl.NumberFormat('fr-FR').format(n).replace(/ /g, NB)}${NB}€`;

/* ---------- 1. Lampe : WebGL, le carrelage s'efface dans le faisceau et laisse voir le réseau derrière le mur ---------- */
const VERT = 'attribute vec2 p; varying vec2 v; void main(){ v = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }';
const FRAG = `precision mediump float;
uniform sampler2D tMur; uniform sampler2D tDerriere; uniform vec2 uRes; uniform vec2 uImg;
uniform vec2 uLum; uniform float uRayon; uniform float uAmb; uniform float uRevele; uniform float uTemps;
varying vec2 v;
vec2 couvre(vec2 q){ float rs = uRes.x / uRes.y, ri = uImg.x / uImg.y; vec2 e = rs < ri ? vec2(rs / ri, 1.) : vec2(1., ri / rs); return (q - .5) * e + .5; }
float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main(){
  vec2 frag = v * uRes;
  vec3 mur = texture2D(tMur, vec2(couvre(v).x, 1. - couvre(v).y)).rgb;
  vec3 der = texture2D(tDerriere, vec2(v.x, 1. - v.y)).rgb;
  float d = length(frag - uLum) / uRayon;
  float faisceau = (1. - smoothstep(.8, 1., d)) * (.72 + .28 * exp(-d * d * 3.5));
  float halo = exp(-d * d * .45) * .16;
  float trou = uRevele * (1. - smoothstep(.5, .86, d));
  // Bord du trou : un liseré de plâtre cassé, irrégulier.
  float bord = uRevele * smoothstep(.62, .86, d) * (1. - smoothstep(.86, .98, d)) * (.75 + .25 * h(floor(frag)));
  vec3 base = mix(mur, der, trou);
  base = mix(base, vec3(.78, .74, .68), bord * .28);
  vec3 chaud = vec3(1., .86, .66);
  vec3 col = base * (uAmb + faisceau * 1.45 * chaud) + halo * chaud * .25;
  // Poussière dans le faisceau.
  float g = h(floor(frag / 2.));
  col += step(.9993, g) * faisceau * .9;
  col *= 1. - smoothstep(.35, 1.6, length((v - .5) * vec2(1.25, 1.)));
  gl_FragColor = vec4(col, 1.);
}`;

function peindreDerriere(cv, W, H, svg) {
  const ctx = cv.getContext('2d');
  cv.width = W; cv.height = H;
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#26292d'); g.addColorStop(1, '#17191c');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  /* Plâtre : grain et briques plâtrières. */
  ctx.globalAlpha = .18; ctx.strokeStyle = '#3a3e44'; ctx.lineWidth = 2;
  const bh = Math.max(26, H / 22), bw = bh * 2.6;
  for (let y = 0, r = 0; y < H; y += bh, r++) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    for (let x = (r % 2) * bw / 2; x < W; x += bw) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + bh); ctx.stroke(); }
  }
  ctx.globalAlpha = 1;
  /* Les tuyaux, exactement là où le SVG les dessine (matrice réelle du SVG, transformations CSS comprises). */
  const m = svg.getScreenCTM(), r = svg.closest('.hero-scene').getBoundingClientRect(), dpr = W / Math.max(1, r.width);
  if (m) ctx.setTransform(m.a * dpr, m.b * dpr, m.c * dpr, m.d * dpr, (m.e - r.left) * dpr, (m.f - r.top) * dpr);
  else { const k = Math.max(W / 1600, H / 900); ctx.setTransform(k, 0, 0, k, W - 1600 * k, (H - 900 * k) / 2); }
  const couleurs = { cuivre: ['#7a3e1a', '#c8733a', '#f2b88a'], eau: ['#16325e', '#2f6fd0', '#9cc6ff'], gaine: ['#6b5200', '#e0ac00', '#fff0b0'], gaine2: ['#6b5200', '#e0ac00', '#fff0b0'] };
  svg.querySelectorAll('[data-trace]').forEach((p) => {
    const chemin = new Path2D(p.getAttribute('d'));
    const l = +p.dataset.largeur || 14, [fonce, moyen, clair] = couleurs[p.dataset.trace] || couleurs.cuivre;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(0,0,0,.55)'; ctx.lineWidth = l + 10; ctx.save(); ctx.translate(4, 6); ctx.stroke(chemin); ctx.restore();
    ctx.strokeStyle = fonce; ctx.lineWidth = l; ctx.stroke(chemin);
    ctx.strokeStyle = moyen; ctx.lineWidth = l * .62; ctx.stroke(chemin);
    ctx.strokeStyle = clair; ctx.lineWidth = Math.max(1.5, l * .16); ctx.save(); ctx.translate(-l * .14, -l * .14); ctx.stroke(chemin); ctx.restore();
  });
  /* Colliers de fixation. */
  ctx.fillStyle = '#9aa0a8';
  [[1010, 760], [980, 640], [1280, 700], [1120, 430], [1420, 380], [1160, 120], [1380, 250]].forEach(([x, y]) => { ctx.fillRect(x - 5, y - 20, 10, 40); });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function initLampe() {
  const scene = $('.hero-scene[data-effet="lampe"]');
  if (!scene) return null;
  const cv = $('.hero-lampe', scene), img = $('.hero-photo img', scene), svg = $('.hero-reseau', scene);
  const ctl = { intro: { amb: .06, rayon: .17, revele: 0, x: .2, y: .78 }, dessiner: () => {} };
  scene.__lampe = ctl;
  if (etat.calme || !cv || !img) return null;
  let gl = null;
  try { gl = cv.getContext('webgl', { antialias: false, premultipliedAlpha: false, powerPreference: 'low-power' }); } catch {}
  if (!gl) return null;
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
  let prog;
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(prog);
  } catch (err) { console.warn('[lampe]', err); return null; }
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n) => gl.getUniformLocation(prog, n);
  const u = { mur: U('tMur'), der: U('tDerriere'), res: U('uRes'), img: U('uImg'), lum: U('uLum'), rayon: U('uRayon'), amb: U('uAmb'), revele: U('uRevele'), temps: U('uTemps') };
  const texture = (unite) => { const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unite); gl.bindTexture(gl.TEXTURE_2D, t);
    [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach((w) => gl.texParameteri(gl.TEXTURE_2D, w, gl.CLAMP_TO_EDGE));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); return t; };
  const tMur = texture(0), tDer = texture(1);
  const derriere = document.createElement('canvas');
  let W = 0, H = 0, dpr = 1, pret = false;
  const pos = { x: 0, y: 0, cx: 0, cy: 0, actif: false, dernier: 0 };

  function taille(echelle = 1) {
    dpr = Math.min(window.devicePixelRatio || 1, petit() ? 1 : 1.25) * echelle;
    const w = scene.clientWidth, h = scene.clientHeight;
    W = Math.max(2, Math.round(w * dpr)); H = Math.max(2, Math.round(h * dpr));
    cv.width = W; cv.height = H; gl.viewport(0, 0, W, H);
    peindreDerriere(derriere, W, H, svg);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, tDer);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, derriere);
  }
  function chargerMur() {
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tMur);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    pret = true;
  }
  ctl.dessiner = (t = 0) => {
    if (!pret) return;
    const i = ctl.intro;
    const lx = pos.actif || ctl.libre ? pos.cx : i.x * W, ly = pos.actif || ctl.libre ? pos.cy : i.y * H;
    gl.uniform1i(u.mur, 0); gl.uniform1i(u.der, 1);
    gl.uniform2f(u.res, W, H); gl.uniform2f(u.img, img.naturalWidth || 16, img.naturalHeight || 9);
    gl.uniform2f(u.lum, lx, H - ly); gl.uniform1f(u.rayon, i.rayon * Math.max(W, H) * (petit() ? 1.45 : 1));
    gl.uniform1f(u.amb, i.amb); gl.uniform1f(u.revele, i.revele); gl.uniform1f(u.temps, t);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
  const pretPromesse = (img.decode ? img.decode() : Promise.resolve()).then(() => {
    taille(etat.arrivee === 'intro' ? .6 : 1); chargerMur(); ctl.dessiner(0);
    scene.classList.add('lampe-active');
  }).catch((err) => console.warn('[lampe] image', err));

  /* Suivi : souris, doigt ; promenade lente au repos, autour du réseau. */
  const viser = (e) => {
    const r = scene.getBoundingClientRect();
    pos.x = (e.clientX - r.left) * dpr; pos.y = (e.clientY - r.top) * dpr; pos.actif = true; pos.dernier = performance.now();
  };
  const zone = scene.closest('.hero-mur') || scene;
  zone.addEventListener('pointermove', viser, { passive: true });
  zone.addEventListener('pointerdown', viser, { passive: true });
  zone.addEventListener('pointerleave', () => { pos.actif = false; }, { passive: true });
  let resizeT = 0;
  new ResizeObserver(() => { clearTimeout(resizeT); resizeT = setTimeout(() => { if (pret) { taille(ctl.echelle || 1); ctl.dessiner(); } }, 120); }).observe(scene);

  /* Qualité qui baisse d'elle-même si les images prennent trop de temps (médiane sur 40 images). */
  const durees = []; let echelle = 1;
  boucle(scene, (dt, t) => {
    if (!pret) return;
    if (dt > 0) { durees.push(dt); if (durees.length > 40) durees.shift(); }
    if (durees.length === 40 && echelle > .55) {
      const med = [...durees].sort((a, b) => a - b)[20];
      if (med > .034) { echelle = Math.max(.55, echelle * .75); ctl.echelle = echelle; durees.length = 0; taille(echelle); }
    }
    if (ctl.libre) {
      const repos = !pos.actif;
      if (repos) { const pt = W < H; pos.x = W * ((pt ? .74 : .64) + .1 * Math.sin(t * .35)); pos.y = H * ((pt ? .64 : .48) + .12 * Math.sin(t * .23 + 1.3)); }
      const k = 1 - Math.pow(repos ? .985 : .82, dt * 60);
      pos.cx += (pos.x - pos.cx) * k; pos.cy += (pos.y - pos.cy) * k;
    }
    ctl.dessiner(t);
  }, { lourde: true });
  ctl.libre = false;
  ctl.liberer = () => { if (pret) taille(ctl.echelle || 1); pos.cx = ctl.intro.x * W; pos.cy = ctl.intro.y * H; pos.x = pos.cx; pos.y = pos.cy; ctl.libre = true; };
  return pretPromesse;
}

/* ---------- 2. Réseau : la goutte descend le tuyau et allume chaque raccord ---------- */
function initReseau() {
  const s = $('.urgences-reseau');
  if (!s) return;
  const goutte = $('.reseau-goutte', s), eau = $('.reseau-eau', s), items = $$('.urgence', s);
  if (etat.calme || !gsap || !ST) { items.forEach((i) => i.classList.add('allumee')); return; }
  eau.setAttribute('pathLength', '1'); eau.style.strokeDasharray = '1 1'; eau.style.strokeDashoffset = '1';
  let seuils = [], hauteur = 1;
  ST.create({
    trigger: s, start: 'top 60%', end: 'bottom 60%', scrub: .4,
    onRefresh: () => { hauteur = s.offsetHeight; seuils = items.map((i) => i.offsetTop + 46); },
    onUpdate: (st) => {
      const y = st.progress * hauteur;
      goutte.style.transform = `translate3d(0, ${y}px, 0)`;
      eau.style.strokeDashoffset = String(1 - st.progress);
      items.forEach((i, k) => i.classList.toggle('allumee', y >= seuils[k]));
    },
  });
}

/* ---------- 3. Ticket : chaque ticket sort de sa fente, ligne par ligne ---------- */
function initTickets() {
  const tickets = $$('[data-imprime]');
  if (!tickets.length || etat.calme || !gsap || !ST) return;
  tickets.forEach((t) => {
    const lignes = $$('.ticket-ligne, .ticket-total', t);
    gsap.set(lignes, { opacity: 0 });
    ST.create({
      trigger: t, start: 'top 88%', once: true,
      onEnter: () => {
        const tl = gsap.timeline();
        tl.fromTo(t, { clipPath: 'inset(0 0 100% 0)', y: -24 }, { clipPath: 'inset(0 0 0% 0)', y: 0, duration: .9, ease: 'steps(14)' })
          .to(lignes, { opacity: 1, duration: .3, stagger: .15 }, .35)
          .add(() => t.classList.add('imprime-fini'));
      },
    });
  });
}
function ticketsFinaux() { $$('[data-imprime]').forEach((t) => { t.classList.add('imprime-fini'); if (gsap) gsap.set([t, ...$$('.ticket-ligne, .ticket-total', t)], { clearProps: 'clipPath,opacity,transform' }); }); }

/* ---------- 4. Disjoncteurs : le tableau se met sous tension, chaque disjoncteur ouvre son métier ---------- */
function initTableaux() {
  $$('[data-tableau]').forEach((tab) => {
    const boutons = $$('.disjoncteur', tab), panneaux = $$('.metier-panneau', tab);
    const choisir = (cle) => {
      boutons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.metier === cle)));
      panneaux.forEach((p) => {
        const ok = p.dataset.panneau === cle;
        if (ok && p.hidden) {
          p.hidden = false;
          if (gsap && !etat.calme) gsap.fromTo(p, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .45, ease: 'power3.out', clearProps: 'transform' });
        } else if (!ok) p.hidden = true;
      });
      rafraichir && rafraichir();
    };
    boutons.forEach((b) => b.addEventListener('click', () => choisir(b.dataset.metier)));
    const p = new URLSearchParams(location.search).get('metier');
    if (p && boutons.some((b) => b.dataset.metier === p)) choisir(p);
    if (etat.calme || !ST) return;
    ST.create({ trigger: tab, start: 'top 75%', once: true, onEnter: () => { boutons.forEach((b, i) => setTimeout(() => b.classList.add('on'), 160 + i * 110)); setTimeout(() => boutons.forEach((b, i) => setTimeout(() => b.classList.remove('on'), i * 60)), 160 + boutons.length * 110 + 500); } });
  });
}

/* ---------- 5. Compteur d'eau : l'aiguille et les rouleaux avancent d'étape en étape ---------- */
function initCompteur() {
  const s = $('[data-effet="compteur-eau"]');
  if (!s) return;
  const aiguille = $('.compteur-aiguille', s), bande = $('.rouleau-bande', s), etapes = $$('.etape', s);
  const aller = (i) => {
    etapes.forEach((e, k) => e.classList.toggle('active', k === i));
    if (!gsap) return;
    gsap.to(aiguille, { rotation: i * 72 + 18, duration: .9, ease: 'back.out(1.6)', svgOrigin: '160 160', overwrite: true });
    gsap.to(bande, { yPercent: -(100 / etapes.length) * i, duration: .7, ease: 'power3.out', overwrite: true });
  };
  if (etat.calme || !ST) { etapes.forEach((e) => e.classList.add('active')); return; }
  gsap.set(aiguille, { rotation: -40, svgOrigin: '160 160' });
  etapes.forEach((e, i) => ST.create({ trigger: e, start: 'top 62%', onEnter: () => aller(i), onLeaveBack: () => aller(Math.max(0, i - 1)) }));
  ST.create({ trigger: s, start: 'top 70%', once: true, onEnter: () => aller(0) });
}

/* ---------- 6. Ricochet : des ondes partent de Longueil-Sainte-Marie et allument les communes ---------- */
function initRicochet() {
  $$('[data-effet="ricochet"]').forEach((fig) => {
    const ondes = $$('.onde', fig), communes = $$('.commune', fig);
    if (etat.calme || !gsap || !ST) { communes.forEach((c) => c.classList.add('touchee')); return; }
    const max = 560, duree = 2.8;
    ST.create({
      trigger: fig, start: 'top 70%', once: true,
      onEnter: () => {
        const tl = gsap.timeline();
        for (let r = 0; r < 3; r++) {
          ondes.forEach((o, i) => tl.fromTo(o, { attr: { r: 0 }, opacity: .9 }, { attr: { r: max }, opacity: 0, duration: duree, ease: 'power1.out' }, r * 2.4 + i * .5));
        }
        communes.forEach((c) => tl.call(() => c.classList.add('touchee'), null, (+c.dataset.distance / max) * duree * .62));
      },
    });
  });
}

/* ---------- 7. Caméra thermique : le viseur révèle le tuyau et la fuite en fausses couleurs ---------- */
function initThermique() {
  const scene = $('[data-effet="thermique"]');
  if (!scene) return;
  const cv = $('.thermique-canvas', scene), viseur = $('.thermique-viseur', scene), statut = $('.thermique-statut', scene);
  const ctx = cv.getContext('2d');
  /* Carte de chaleur basse résolution (démonstration) : tuyau d'eau chaude encastré, fuite au coude. */
  const CW = 192, CH = 108, carte = document.createElement('canvas'); carte.width = CW; carte.height = CH;
  const cx = carte.getContext('2d'), donnees = cx.createImageData(CW, CH);
  const fuite = { x: .63, y: .58 };
  const palette = [[18, 10, 92], [106, 27, 154], [216, 27, 96], [255, 112, 67], [255, 238, 88], [255, 255, 255]];
  const couleur = (t) => { t = Math.max(0, Math.min(.999, t)) * (palette.length - 1); const i = t | 0, f = t - i, a = palette[i], b = palette[i + 1]; return a.map((v, k) => v + (b[k] - v) * f); };
  for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
    const u = x / CW, v = y / CH;
    let t = .12 + .06 * Math.sin(u * 9 + v * 4) * .5 + v * .05;
    const dTuyauH = Math.abs(v - .58), dTuyauV = Math.abs(u - .63);
    if (u < .63) t += .42 * Math.exp(-dTuyauH * dTuyauH * 2600);
    if (v < .58) t += .42 * Math.exp(-dTuyauV * dTuyauV * 2600);
    const dx = (u - fuite.x) * 1.4, dy = v - fuite.y; t += .55 * Math.exp(-(dx * dx + dy * dy) * 60);
    const [r, g, b] = couleur(t); const k = (y * CW + x) * 4;
    donnees.data[k] = r; donnees.data[k + 1] = g; donnees.data[k + 2] = b; donnees.data[k + 3] = 255;
  }
  cx.putImageData(donnees, 0, 0);
  let W = 0, H = 0, rect = null;
  const pos = { x: .25, y: .4, cx: .25, cy: .4, actif: false, dernier: 0 };
  let trouve = false;
  const taille = () => { W = cv.width = Math.round(scene.clientWidth); H = cv.height = Math.round(scene.clientHeight); };
  const dessiner = () => {
    if (!W) taille();
    ctx.clearRect(0, 0, W, H);
    const vw = Math.max(110, W * .26), vh = vw * .75, x = pos.cx * W, y = pos.cy * H;
    ctx.save(); ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x - vw / 2, y - vh / 2, vw, vh, 8) : ctx.rect(x - vw / 2, y - vh / 2, vw, vh); ctx.clip();
    ctx.imageSmoothingEnabled = true; ctx.drawImage(carte, 0, 0, W, H); ctx.restore();
    viseur.style.transform = `translate3d(${x}px, ${y}px, 0)`; viseur.style.width = vw + 'px'; viseur.style.height = vh + 'px'; viseur.style.margin = `${-vh / 2}px 0 0 ${-vw / 2}px`;
    const proche = Math.hypot(pos.cx - fuite.x, (pos.cy - fuite.y) * .56) < .07;
    if (proche !== trouve) { trouve = proche; statut.classList.toggle('trouve', proche); statut.textContent = proche ? statut.dataset.trouve : statut.dataset.base; }
  };
  statut.dataset.base = statut.textContent;
  new ResizeObserver(() => { taille(); dessiner(); }).observe(scene);
  if (etat.calme) { pos.cx = fuite.x; pos.cy = fuite.y; requestAnimationFrame(() => { taille(); dessiner(); }); return; }
  const viser = (e) => { rect = rect || scene.getBoundingClientRect(); pos.x = (e.clientX - rect.left) / rect.width; pos.y = (e.clientY - rect.top) / rect.height; pos.actif = true; pos.dernier = performance.now(); };
  scene.addEventListener('pointerenter', () => { rect = scene.getBoundingClientRect(); });
  scene.addEventListener('pointerdown', (e) => { rect = scene.getBoundingClientRect(); viser(e); });
  scene.addEventListener('pointermove', viser, { passive: true });
  scene.addEventListener('pointerleave', () => { pos.actif = false; rect = null; });
  window.addEventListener('scroll', () => { rect = null; }, { passive: true });
  /* Sans pointeur : le viseur balaie le mur au rythme du défilement, puis tout seul. */
  let progres = 0;
  if (ST) ST.create({ trigger: scene.closest('section') || scene, start: 'top 85%', end: 'bottom 20%', onUpdate: (st) => { progres = st.progress; } });
  boucle(scene, (dt, t) => {
    if (!pos.actif) {
      const p = progres * .8 + .1;
      pos.x = .14 + p * .7 + .04 * Math.sin(t * .9); pos.y = .35 + .25 * Math.sin(p * Math.PI) + .04 * Math.sin(t * 1.3);
    }
    const k = 1 - Math.pow(.86, dt * 60);
    pos.cx += (pos.x - pos.cx) * k; pos.cy += (pos.y - pos.cy) * k;
    dessiner();
  });
}

/* ---------- 8. Horloge : tournez l'aiguille, le ticket affiche le forfait qui s'applique ---------- */
function initHorloge() {
  const s = $('[data-effet="horloge"]');
  if (!s) return;
  const range = $('#heure-tarif', s), aff = $('[data-heure]', s), aiguille = $('.horloge-aiguille', s), cadran = $('.horloge svg', s);
  const ticket = $('.ticket--horloge', s), ligne = $('.ticket-l-detail', ticket), prixEl = $('.ticket-prix', ticket);
  const lib = (k) => s.dataset['lib' + k[0].toUpperCase() + k.slice(1)] || '';
  const fmt = (h) => `${Math.floor(h)}${NB}h${NB}${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;
  let dernier = null;
  const maj = (anime = true) => {
    const h = +range.value, jour = ($('input[name="jour-tarif"]:checked', s) || {}).value || 'semaine';
    aff.textContent = fmt(h);
    if (gsap) gsap.to(aiguille, { rotation: (h / 24) * 360, svgOrigin: '150 150', duration: anime ? .5 : 0, ease: 'power3.out', overwrite: true }); else aiguille.setAttribute('transform', `rotate(${(h / 24) * 360} 150 150)`);
    let cle = 'jour', prix = 149;
    if (jour !== 'semaine' || h >= 20) { cle = 'soir'; prix = 199; } else if (h < 8) { cle = 'nuit'; prix = null; }
    ligne.textContent = lib(cle);
    const num = $('.ticket-num', ticket); if (num) num.textContent = `N°${NB}${cle === 'soir' ? '03' : '01'}`;
    const txt = prix == null ? '—' : euros(prix);
    if (txt !== dernier) {
      dernier = txt;
      prixEl.textContent = txt;
      if (gsap && anime && !etat.calme) gsap.fromTo(ticket, { y: -10, clipPath: 'inset(0 0 40% 0)' }, { y: 0, clipPath: 'inset(0 0 0% 0)', duration: .45, ease: 'steps(8)', clearProps: 'clipPath' });
    }
  };
  range.addEventListener('input', () => maj());
  $$('input[name="jour-tarif"]', s).forEach((r) => r.addEventListener('change', () => maj()));
  /* Glisser l'aiguille sur le cadran. */
  let r = null;
  const angle = (e) => { const a = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) + Math.PI / 2; return ((a / (Math.PI * 2)) * 24 + 24) % 24; };
  cadran.addEventListener('pointerdown', (e) => { r = cadran.getBoundingClientRect(); cadran.setPointerCapture(e.pointerId); range.value = Math.round(angle(e) * 4) / 4; maj(); });
  cadran.addEventListener('pointermove', (e) => { if (!r) return; range.value = Math.round(angle(e) * 4) / 4; maj(false); });
  const lacher = () => { r = null; };
  cadran.addEventListener('pointerup', lacher); cadran.addEventListener('pointercancel', lacher);
  maj(false);
  /* À l'arrivée : l'aiguille fait le tour de la journée et se pose à 14 h. */
  if (etat.calme || !gsap || !ST) return;
  gsap.set(aiguille, { rotation: 0, svgOrigin: '150 150' });
  const minutes = $('.horloge-minutes', s);
  if (minutes) gsap.fromTo(minutes, { rotation: 0 }, { rotation: 720, svgOrigin: '150 150', ease: 'none', scrollTrigger: { trigger: s, start: 'top bottom', end: 'bottom top', scrub: .3 } });
  ST.create({ trigger: s, start: 'top 70%', once: true, onEnter: () => gsap.fromTo(aiguille, { rotation: -360 + 210 }, { rotation: 210, svgOrigin: '150 150', duration: 1.6, ease: 'power3.inOut' }) });
}

/* ---------- 9. Planches empilées (rénovation) : la précédente recule quand la suivante arrive ---------- */
function initPlanches() {
  const liste = $('[data-effet="planches"]');
  if (!liste || etat.calme || !gsap || !ST) return;
  const planches = $$('.planche', liste);
  gsap.matchMedia().add('(min-width: 761px)', () => {
    planches.forEach((p, i) => {
      const suivante = planches[i + 1];
      if (!suivante) return;
      gsap.fromTo(p, { scale: 1, opacity: 1 }, { scale: .93, opacity: .55, ease: 'none', scrollTrigger: { trigger: suivante, start: 'top 85%', end: 'top 30%', scrub: .4 } });
    });
  });
  planches.forEach((p) => gsap.fromTo($('.media img', p), { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: p, start: 'top bottom', end: 'top 30%', scrub: .4 } }));
}

/* ---------- 10. Vannes (plomberie) : filtres quart de tour, sélection gardée dans l'adresse ---------- */
function initVannes() {
  const filtres = $('[data-effet="vannes"]');
  if (!filtres) return;
  const vannes = $$('.vanne', filtres), fiches = $$('.fiche-equipement'), liste = $('.fiches-equipement');
  let courant = 'tout';
  const appliquer = (cle, pousser = true) => {
    if (cle === courant && pousser) return;
    courant = cle;
    vannes.forEach((v) => v.setAttribute('aria-pressed', String(v.dataset.filtre === cle)));
    const montrer = () => {
      fiches.forEach((f) => { f.hidden = cle !== 'tout' && f.dataset.equipement !== cle; });
      if (pousser) { const u = new URL(location.href); if (cle === 'tout') u.searchParams.delete('equipement'); else u.searchParams.set('equipement', cle); history.replaceState(history.state, '', u); }
      requestAnimationFrame(() => { rafraichir && rafraichir(); if (ST) ST.refresh(); });
      setTimeout(() => { if (ST) ST.refresh(); }, 450);
      const haut = filtres.getBoundingClientRect().top;
      if (haut < 0) window.scrollTo({ top: window.scrollY + haut - 90, behavior: 'instant' });
    };
    if (!gsap || etat.calme) { montrer(); return; }
    gsap.to(liste, { opacity: 0, duration: .18, onComplete: () => { montrer(); gsap.to(liste, { opacity: 1, duration: .3 }); } });
  };
  vannes.forEach((v) => v.addEventListener('click', () => appliquer(v.dataset.filtre)));
  const p = new URLSearchParams(location.search).get('equipement');
  if (p && vannes.some((v) => v.dataset.filtre === p)) appliquer(p, false);
  if (etat.calme || !gsap || !ST) return;
  /* Les poignées font un quart de tour à l'arrivée (la vanne « Tous » s'ouvre). */
  const poignees = $$('.vanne-poignee', filtres);
  ST.create({ trigger: filtres.parentElement, start: 'top 85%', once: true, onEnter: () => gsap.fromTo(poignees, { rotation: -90 }, { rotation: 0, duration: .6, stagger: .07, ease: 'back.out(2)', clearProps: 'transform' }) });
}

/* ---------- 11. Formulaires en étapes (devis, rendez-vous) ---------- */
function initEtapes() {
  $$('form[data-etapes]').forEach((f) => {
    const etapes = $$('.etape-form', f), boite = $('.form-hauteur', f);
    const prec = $('[data-etape-precedente]', f), suiv = $('[data-etape-suivante]', f), envoi = $('[data-etape-envoi]', f);
    const indic = $$('[data-indicateur]', f), annonce = $('[data-annonce-etape]', f);
    let i = 0;
    f.classList.add('etapes-actives');
    const aller = (n, focus = true) => {
      const avant = boite.offsetHeight;
      etapes.forEach((e, k) => e.classList.toggle('courante', k === n));
      i = n;
      prec.hidden = n === 0; suiv.hidden = n === etapes.length - 1; envoi.hidden = n !== etapes.length - 1;
      indic.forEach((li, k) => (k === n ? li.setAttribute('aria-current', 'step') : li.removeAttribute('aria-current')));
      if (annonce) annonce.textContent = (annonce.dataset.modele || '').replace('{n}', n + 1);
      const apres = boite.scrollHeight;
      if (gsap && !etat.calme) gsap.fromTo(boite, { height: avant }, { height: apres, duration: .45, ease: 'power3.out', clearProps: 'height', onComplete: () => rafraichir && rafraichir() });
      else rafraichir && rafraichir();
      if (focus) { const leg = $('legend', etapes[n]); if (leg) { leg.tabIndex = -1; leg.focus({ preventScroll: true }); } const h = f.getBoundingClientRect().top; if (h < 0) window.scrollTo({ top: window.scrollY + h - 100, behavior: 'instant' }); }
      f.dispatchEvent(new CustomEvent('etape', { detail: n }));
    };
    /* Entrée dans un champ avant la dernière étape : on passe à l'étape suivante (capture : avant la vérification du socle). */
    f.addEventListener('submit', (e) => {
      if (i < etapes.length - 1 && e.isTrusted) { e.preventDefault(); e.stopImmediatePropagation(); suiv.click(); }
    }, true);
    suiv.addEventListener('click', () => { if (i < etapes.length - 1) { if (!valideEtape()) return; aller(i + 1); } });
    prec.addEventListener('click', () => { if (i > 0) aller(i - 1); });
    function valideEtape() {
      let premier = null;
      $$('input, select, textarea', etapes[i]).forEach((c) => { if (c.required && !(c.value || '').trim()) { c.setAttribute('aria-invalid', 'true'); premier = premier || c; } });
      if (premier) { premier.focus(); return false; }
      return true;
    }
    aller(0, false);
    /* Un paramètre de l'adresse (?type=renovation, ?metier=plomberie) préremplit : l'étape 1 est déjà choisie. */
  });
}

/* ---------- 12. Estimateur : postes, quantités, ticket qui s'imprime, total sur les prix publiés ---------- */
function initEstimateur() {
  const f = $('[data-effet="estimateur"]');
  if (!f) return;
  const ticket = $('[data-ticket-dynamique]'), lignes = $('.ticket-lignes', ticket), totalEl = $('[data-total]', ticket), resteEl = $('.ticket-reste', ticket), ctxEl = $('[data-ticket-contexte]', ticket);
  const postes = $$('.poste', f);
  const choix = new Map();
  const metier = () => ($('input[name="metier"]:checked', f) || {}).value || 'plomberie';
  const nomMetier = () => { const r = $('input[name="metier"]:checked', f); return r ? r.nextElementSibling.textContent : ''; };
  const precision = () => { const r = $(`input[name="precision-${metier()}"]:checked`, f); return r ? r.value : ''; };
  const piece = () => ($('input[name="piece"]:checked', f) || {}).value || '';
  const filtrer = () => {
    const m = metier();
    $$('[data-sous-de]', f).forEach((g) => { g.hidden = g.dataset.sousDe !== m; });
    postes.forEach((p) => { p.hidden = !(p.dataset.metier === m || p.dataset.metier === 'tous'); });
    contexte();
  };
  const contexte = () => { ctxEl.textContent = [nomMetier(), precision(), piece()].filter(Boolean).join(' · '); };
  const rendre = (nouvelle) => {
    lignes.replaceChildren();
    let total = 0, reste = 0;
    choix.forEach((q, cle) => {
      const p = postes.find((x) => x.dataset.poste === cle);
      const prix = p.dataset.prix === '' ? null : +p.dataset.prix, unite = p.dataset.unite;
      const li = document.createElement('li'); li.className = 'ticket-ligne';
      const t = document.createElement('span'); t.className = 'ticket-l-texte';
      const a = document.createElement('span'); a.className = 'ticket-l-titre'; a.textContent = $('.poste-titre', p).textContent;
      const b = document.createElement('span'); b.className = 'ticket-l-detail'; b.textContent = unite === 'forfait' || unite === 'projet' ? (ticket.dataset['unite' + unite[0].toUpperCase() + unite.slice(1)] || '') : `${q}${NB}${unite === 'heure' ? 'h' : unite}`;
      t.append(a, b);
      const m = document.createElement('span'); m.className = 'ticket-prix' + (prix == null ? ' ticket-prix--devis' : ''); m.setAttribute('data-prix', '');
      if (prix == null) { m.textContent = ticket.dataset.surDevis; reste++; } else { const v = prix * (unite === 'forfait' ? 1 : q); total += v; m.textContent = euros(v); }
      li.append(t, m); lignes.append(li);
      if (cle === nouvelle && gsap && !etat.calme) gsap.fromTo(li, { clipPath: 'inset(0 0 100% 0)', y: -12 }, { clipPath: 'inset(0 0 0% 0)', y: 0, duration: .5, ease: 'steps(8)', clearProps: 'clipPath,transform' });
    });
    const avant = +totalEl.dataset.v || 0; totalEl.dataset.v = total;
    const ecrireTotal = (v) => { totalEl.textContent = v ? `${new Intl.NumberFormat('fr-FR').format(Math.round(v)).replace(/[\u202f\u00a0]/g, NB)}${NB}€` : (totalEl.dataset.vide || '—'); };
    if (gsap && !etat.calme && avant !== total && total) { const o = { v: avant }; gsap.to(o, { v: total, duration: .6, ease: 'power2.out', onUpdate: () => ecrireTotal(o.v) }); }
    else ecrireTotal(total);
    resteEl.textContent = reste ? `${resteEl.dataset.resteModele} : ${reste}` : '';
  };
  postes.forEach((p) => {
    const b = $('.poste-bouton', p), q = $('input[type="number"]', p), cle = p.dataset.poste;
    b.addEventListener('click', () => {
      const on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', String(on)); b.textContent = on ? b.dataset.retirer : b.dataset.ajouter;
      if (on) choix.set(cle, Math.max(1, +(q && q.value) || 1)); else choix.delete(cle);
      rendre(on ? cle : null);
    });
    if (q) q.addEventListener('input', () => { if (choix.has(cle)) { choix.set(cle, Math.max(1, Math.min(999, +q.value || 1))); rendre(); } });
  });
  f.addEventListener('change', (e) => { if (e.target.name === 'metier') filtrer(); else contexte(); });
  filtrer(); rendre();
  /* Champs cachés envoyés avec la demande simulée : le contenu du ticket. */
}

/* ---------- 13. Ouverture : faisceau de la lampe sur le panneau, puis la page ---------- */
function introPanneau(tl) {
  const p = $('.ouverture-panneau'), f = $('.ouverture-faisceau', p);
  const v = { x: 16, y: 82, r: 16 };
  const ecrire = () => { f.style.setProperty('--lx', v.x + '%'); f.style.setProperty('--ly', v.y + '%'); f.style.setProperty('--rayon-lampe', v.r + 'vmax'); };
  ecrire();
  tl.to(v, { x: 50, y: 48, r: 30, duration: .95, ease: 'power2.inOut', onUpdate: ecrire }, 0)
    .fromTo(p, { opacity: 1 }, { opacity: 0, duration: .4, ease: 'power1.in' }, 1.0);
  return tl;
}

function introAccueil(tl, t0) {
  const scene = $('.hero-scene'), lampe = scene && scene.__lampe;
  const tubes = $$('.hero-reseau .tube'), raccords = $$('.hero-reseau .raccords > *'), goutte = $('.hero-goutte'), eau = $('.hero-reseau .tube--eau');
  tubes.forEach((t) => { t.setAttribute('pathLength', '1'); t.style.strokeDasharray = '1 1.05'; });
  tl.fromTo(tubes, { strokeDashoffset: 1.02 }, { strokeDashoffset: 0, duration: .8, stagger: .08, ease: 'power2.inOut' }, t0)
    .fromTo(raccords, { opacity: 0, scale: .4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: .35, stagger: .04, ease: 'back.out(2)' }, t0 + .4);
  if (lampe) {
    const i = lampe.intro;
    const portrait = window.innerWidth < window.innerHeight;
    tl.fromTo(i, { amb: .03, rayon: .14, revele: 0, x: .22, y: .74 }, { amb: .12, rayon: .2, revele: 1, x: portrait ? .74 : .64, y: portrait ? .62 : .5, duration: .95, ease: 'power2.inOut' }, Math.max(0, t0 - .25))
      .to(i, { amb: .3, rayon: .24, duration: .5, ease: 'power1.out' }, t0 + .8)
      .add(() => lampe.liberer && lampe.liberer(), t0 + 1.3);
  }
  if (goutte && eau && eau.getTotalLength) {
    const L = eau.getTotalLength(), o = { p: 0 };
    tl.set(goutte, { opacity: 1 }, t0 + .6)
      .to(o, { p: 1, duration: .8, ease: 'power1.in', onUpdate: () => { const pt = eau.getPointAtLength(o.p * L); goutte.setAttribute('cx', pt.x); goutte.setAttribute('cy', pt.y); } }, t0 + .75)
      .to(goutte, { opacity: 0, duration: .15 }, t0 + 1.3);
  }
  tl.fromTo('.hero-surtitre', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .4 }, t0 + .2)
    .fromTo('.hero-mot', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .5, stagger: .17, ease: 'power3.out' }, t0 + .35)
    .fromTo('.hero-mot--lumiere', { color: '#6b5a22', textShadow: '0 0 0 rgba(255,207,58,0)' }, { color: '#ffcf3a', textShadow: '0 0 .32em rgba(255,207,58,.28)', duration: .35, ease: 'power2.out' }, t0 + .75)
    .fromTo(['.hero-intro', '.hero-actions', '.hero-info'], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .45, stagger: .08 }, t0 + .9)
    .fromTo('.hero-ticket-place', { opacity: 0, y: 40, rotation: 6 }, { opacity: 1, y: 0, rotation: 0, duration: .45, ease: 'back.out(1.4)' }, t0 + .85);
  return tl;
}

function introPage(tl, t0) {
  tl.fromTo('.page-tete-fond', { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: .9, ease: 'power4.inOut' }, Math.max(0, t0 - .2))
    .fromTo('.pt-anim', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .55, stagger: .09, ease: 'power3.out' }, t0 + .2);
  return tl;
}

function etatFinalProjet() {
  if (!gsap) return;
  const mettre = (sels, props) => { const els = [].concat(sels).flatMap((x) => $$(x)); if (els.length) gsap.set(els, props); };
  mettre(['.hero-surtitre', '.hero-mot', '.hero-intro', '.hero-actions', '.hero-info', '.hero-ticket-place', '.pt-anim'], { clearProps: 'opacity,transform' });
  mettre('.hero-mot--lumiere', { clearProps: 'color,textShadow' });
  mettre('.page-tete-fond', { clearProps: 'clipPath' });
  $$('.hero-reseau .tube').forEach((t) => { t.style.strokeDashoffset = '0'; });
  mettre('.hero-reseau .raccords > *', { clearProps: 'opacity,transform' });
  const scene = $('.hero-scene'), l = scene && scene.__lampe;
  if (l) { const pt = window.innerWidth < window.innerHeight; Object.assign(l.intro, { amb: .3, rayon: .24, revele: 1, x: pt ? .74 : .64, y: pt ? .62 : .5 }); l.liberer && l.liberer(); l.dessiner(); }
  ticketsFinaux();
}

demarrer({
  pret: [initLampe()].filter(Boolean),
  preparer() {
    [initReseau, initTickets, initTableaux, initCompteur, initRicochet, initThermique, initHorloge, initPlanches, initVannes, initEtapes, initEstimateur]
      .forEach((fn) => { try { fn(); } catch (err) { console.error('[site]', fn.name, err); } });
  },
  jouer() {
    if (!gsap) return null;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    introPanneau(tl);
    if ($('.hero-mur')) introAccueil(tl, .8); else introPage(tl, .9);
    return tl;
  },
  etatFinal: etatFinalProjet,
  arrivee() {
    if (!gsap) return;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: .1 });
    if ($('.hero-mur')) introAccueil(tl, 0); else introPage(tl, 0);
  },
});

quand('retour', etatFinalProjet);
