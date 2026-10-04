// Prepara los exports del diseñador para CasparCG: la receta de "Cuando llega un export nuevo"
// de CLAUDE.md, ejecutable. Escrito sobre los exports del 2026-10-03/04: si el diseñador cambia
// nombres de capas, falla diciendo cuál no encuentra (no adivina).
//
// Uso, desde la raíz del repo:
//   1. Descomprimir los zips del diseñador en una carpeta (EXPORTS): score/, defensiva/,
//      "tabla lanzador"/, "lowbar bateador"/, "lowbar bateador informacion"/.
//   2. Los JSON publicados, de donde se trasplantan las capas que el export no trae:
//        mkdir -p $PUB && for g in score lanzador; do git show HEAD:$g/data.json > $PUB/$g.json; done
//   3. node herramientas/prep.js $EXPORTS $PUB .
//   4. git diff, herramientas/lint.py y QA con el runtime real (CLAUDE.md).
// Las fuentes, las imágenes y los index.html no los toca: se copian a mano la primera vez.
const fs = require('fs');
const path = require('path');

const [SRC, CUR, REPO] = process.argv.slice(2);
const load = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const save = (p, d) => fs.writeFileSync(p, JSON.stringify(d, null, 2)); // igual que lottie_save
const clone = o => JSON.parse(JSON.stringify(o));

function layer(d, nm) {
    const hits = d.layers.filter(l => (l.nm || '').trim() === nm);
    if (hits.length !== 1) throw new Error(`capa "${nm}": ${hits.length} coincidencias`);
    return hits[0];
}
// Convención del editor: nm ".<nombre>", cl "<nombre>"
function rename(d, nm, name) {
    const l = layer(d, nm);
    l.nm = '.' + name;
    l.cl = name;
    return l;
}
function insertAfter(d, nm, ...layers) {
    d.layers.splice(d.layers.indexOf(layer(d, nm)) + 1, 0, ...layers);
}
function freeInd(d, ind) {
    if (d.layers.some(l => l.ind === ind)) throw new Error(`ind ${ind} ocupado`);
    return ind;
}
const FONT = 'font/LeagueGothic-Regular.otf';

// Último keyframe visible de la animación: el de cada capa dentro de su [ip, op], con los
// precomps corridos por su st. Sirve para avisar si un export trae una entrada más larga que
// el play (pasó en defensiva: el start del diseñador quedó en 90 y la entrada terminaba en 103).
function ultimoKeyframe(d) {
    const comps = Object.fromEntries(d.assets.filter(a => a.layers).map(a => [a.id, a]));
    const times = (o, acc) => {
        if (Array.isArray(o)) o.forEach(v => times(v, acc));
        else if (o && typeof o === 'object') {
            if (o.a === 1 && Array.isArray(o.k)) o.k.forEach(k => k && k.t !== undefined && acc.push(k.t));
            Object.values(o).forEach(v => times(v, acc));
        }
        return acc;
    };
    let max = 0;
    for (const l of d.layers) {
        let ts = times([l.ks, l.shapes, l.t], []);
        if (l.ty === 0) ts = ts.concat(times(comps[l.refId].layers, []).map(t => t + l.st));
        for (const t of ts) if (t >= l.ip && t <= l.op) max = Math.max(max, t);
    }
    return max;
}
function avisarEntrada(d, nombre) {
    const play = d.markers.find(m => m.cm === 'play');
    const ultimo = ultimoKeyframe(d);
    if (ultimo > play.tm + play.dr - 0.5) {
        console.warn(`⚠ ${nombre}: la entrada termina en el frame ${ultimo.toFixed(1)}, después de la pausa del play (${play.tm + play.dr}). Mover play y salida.`);
    }
}

// ---------------------------------------------------------------- score
{
    const d = load(path.join(SRC, 'score/data.json'));
    const cur = load(path.join(CUR, 'score.json')); // versión publicada

    rename(d, '.nlanxamientos', 'lanzamientos');
    rename(d, 'outs', 'outs');
    rename(d, '.INININGabajo', 'INNINGabajo_opacidad');
    rename(d, '.INININGarriba', 'INNINGarriba_opacidad');
    rename(d, '.SEGUNDOOUT_opacidad', 'SEGUNDOOUT_opacidad'); // traía un \n al final del nm
    rename(d, '2024-Logo-MeridianoTV-original (6).png', 'logomeridiano');
    rename(d, 'lvbp', 'lvbp');
    rename(d, 'meridiano televisión', 'meridianotv');

    layer(d, '.TIGRESLOCAL_opacidad').op = layer(d, '.TIBUSLOCAL_opacidad').op;

    // El export no trae TIBUSVISITA ni su máscara (ind 64 y 65 vacíos: ocultas en AE).
    // Se traen de la versión publicada; los logos de visita no cambiaron.
    const mask = clone(layer(cur, 'MASCARA VISITA 8'));
    const tibus = clone(layer(cur, '.TIBUSVISITA_opacidad'));
    mask.ind = freeInd(d, 64);
    tibus.ind = freeInd(d, 65);
    insertAfter(d, '.MAGAVISITA_opacidad', mask, tibus);

    d.markers = clone(cur.markers);
    d.fonts.list[0].fPath = FONT;
    save(path.join(REPO, 'score/data.json'), d);
}

const CRESTS = { TIGRES: 'TIGRES', TIBU: 'TIBUS', MAGA: 'MAGA', CARD: 'CARD', BRAVOS: 'BRAVOS', ANZ: 'ANZ', AGUI: 'AGUI', LEO: 'LEO' };
// Casilleros de estadísticas genéricos: etiquetaN (rótulo) y valorN (número), en el orden del
// diseño. Todas las cajas de un mismo tipo pasan al ancho de la más ancha, para que cualquier
// rótulo o valor entre en cualquier casillero; con el borde de anclaje fijo (izquierdo en j:0,
// derecho en j:1) el texto del diseño no se mueve.
function statSlots(d, pairs) {
    const widen = layers => {
        const docs = layers.flatMap(l => l.t.d.k.map(k => k.s));
        const W = Math.max(...docs.map(s => s.sz[0]));
        for (const s of docs) {
            if (s.j === 1) s.ps[0] += s.sz[0] - W;
            else if (s.j === 2) s.ps[0] += (s.sz[0] - W) / 2;
            s.sz[0] = W;
        }
    };
    const labels = [], values = [];
    pairs.forEach(([label, value], i) => {
        labels.push(rename(d, '.' + label, `etiqueta${i + 1}`));
        values.push(rename(d, '.' + value, `valor${i + 1}`));
    });
    widen(labels);
    widen(values);
}

function renameCrests(d) {
    for (const l of d.layers) {
        const m = (l.nm || '').match(/^\.(TIGRES|TIBU|MAGA|CARD|BRAVOS|ANZ|AGUI|LEO)[A-Z]*_opacidad$/);
        if (m) rename(d, l.nm, CRESTS[m[1]] + '_opacidad');
    }
}

// ---------------------------------------------------------------- defensiva
const ENTRADA_DEF = 104; // la última animación de la entrada (barra del catcher) termina en el 103
{
    const d = load(path.join(SRC, 'defensiva/data.json'));

    rename(d, '.lanzador 2', 'catcher');
    rename(d, '.equiponombre_opacidad', 'equipo');
    rename(d, 'DEFENSIVA', 'titulo');
    rename(d, 'DEFENSIVA 2', 'titulo_entrada');
    rename(d, '2024-Logo-MeridianoTV-original (6).png', 'logomeridiano');
    renameCrests(d);

    // El export corrió 26 frames todo lo de los jugadores menos esta barra, que quedó en el
    // 30 y entraba sola. Va 3 frames antes que la de CF (59), como en la versión anterior.
    const lf = layer(d, 'BARRAPLAYER)leftfield');
    const cf = layer(d, 'BARRAPLAYER_centerfield');
    lf.ip = lf.st = Math.round(cf.st) - 3;
    lf.op = cf.op;

    d.markers = [
        { tm: 0, cm: 'play', dr: ENTRADA_DEF, payload: { name: 'play', type: 'pause', order: 1, stop: 'salida' } },
        { tm: 120.0000048877, cm: 'stop', dr: 1 },
        { tm: ENTRADA_DEF, cm: 'salida', dr: -ENTRADA_DEF }
    ];
    d.fonts.list[0].fPath = FONT;
    avisarEntrada(d, 'defensiva');
    save(path.join(REPO, 'defensiva/data.json'), d);
}

// ---------------------------------------------------------------- lanzador
{
    const d = load(path.join(SRC, 'tabla lanzador/data.json'));
    const pub = load(path.join(CUR, 'lanzador.json')); // versión publicada

    rename(d, 'LANZADOR', 'titulo');
    rename(d, '2024-Logo-MeridianoTV-original (6).png', 'logomeridiano');
    rename(d, '.inforacionbarranegra', 'informacionbarranegra');
    renameCrests(d);
    // de arriba a abajo: JL, G-P, IL, K-BB, WHIP, ERA
    statSlots(d, [
        ['juegoslanzados', 'numerosjuegoslanzados'], ['ganadosyperdidos', 'numerosganadosyperdidos'],
        ['inninglanzados', 'numerosinninglanzados'], ['ponchesybasesxbolas', 'numerosponchesybolas'],
        ['whip', 'numeroswhip'], ['efectividad', 'numerosefectivdad']
    ]);
    // 222 y no 230: un nombre largo quedaba a 6-7 px de la línea divisoria antes de LD/LZ
    layer(d, '.nombrelanzador').t.d.k[0].s.sz[0] = 222;

    // La tabla va blanca y roja para todos los equipos (confirmado por el diseñador), pero el
    // export trae BASE BLANCA y BASE ROJA con el mismo degradado naranja. Se les pone el blanco y
    // el rojo de la cortina de entrada (Shape Layer 2 y 1), que es la paleta del diseño.
    const gradient = nm => {
        const find = shapes => {
            for (const s of shapes) {
                if (s.ty === 'gf') return s;
                if (s.ty === 'gr') { const g = find(s.it); if (g) return g; }
            }
        };
        return find(layer(d, nm).shapes);
    };
    gradient('BASE BLANCA Outlines').g.k.k = gradient('Shape Layer 2').g.k.k.slice();
    gradient('BASE ROJA Outlines').g.k.k = gradient('Shape Layer 1').g.k.k.slice();

    // TIBUS venía colgado de "mascara logos 3", que el export dejó como null y sin matte:
    // aparecía de golpe en el frame 20 en vez de subir con los demás. Se cuelga del
    // Null 3 como el resto (mismo lugar final) y la máscara pasa a ser copia de las otras.
    const null3 = layer(d, 'Null 3');
    const tibus = layer(d, '.TIBUS_opacidad');
    const m3 = layer(d, 'mascara logos 3');
    const m3Parent = m3.ks.p.k, n3End = null3.ks.p.k.at(-1).s, n3a = null3.ks.a.k;
    tibus.parent = null3.ind;
    tibus.ks.p.k = [
        +(m3Parent[0] + tibus.ks.p.k[0] - (n3End[0] - n3a[0])).toFixed(3),
        +(m3Parent[1] + tibus.ks.p.k[1] - (n3End[1] - n3a[1])).toFixed(3),
        0
    ];
    tibus.tt = 1;
    const m2 = layer(d, 'mascara logos 2');
    d.layers[d.layers.indexOf(m3)] = Object.assign(clone(m2), { nm: m3.nm, ind: m3.ind });

    // AGUI no viene (ind 42 y 43 vacíos: oculto en AE). Se trae de la versión publicada con su
    // máscara. Ahí lo armamos con el escudo de la defensiva vieja (fondo al 100 %, como los demás
    // de esta tabla), en la misma posición relativa a BRAVOS que tenía allá: (-82.021, 40.634).
    const agui = Object.assign(clone(layer(pub, '.AGUI_opacidad')), { ind: freeInd(d, 43), parent: null3.ind });
    const aguiMask = Object.assign(clone(layer(pub, 'mascara logos')), { ind: freeInd(d, 42) });
    insertAfter(d, '.CARD_opacidad', aguiMask, agui);

    // Línea de la barra negra → texto de caja centrado (textos-de-caja.md). El diseño la
    // centró a ojo con j:0; con j:2 y ps[0] = (Lw − W)/2 el texto del diseño queda en el
    // mismo píxel (Lw = 178.1015625, medido con League Gothic) y cualquier otro se centra
    // en el mismo eje y encoge si no entra. W deja ≥10 px a cada lado dentro de la barra.
    const info = layer(d, '.informacionbarranegra').t.d.k[0].s;
    const W = 344, Lw = 178.1015625;
    info.j = 2;
    info.sz = [W, 36];
    info.ps = [(Lw - W) / 2, -(d.fonts.list[0].ascent * info.s / 100)];

    d.markers = [
        { tm: 0, cm: 'play', dr: 35.0000014255792, payload: { name: 'play', type: 'pause', order: 1, stop: 'salida' } },
        { tm: 60.0000024438501, cm: 'stop', dr: 1 },
        { tm: 35.0000014255792, cm: 'salida', dr: -35.0000014255792 }
    ];
    d.fonts.list[0].fPath = FONT;
    avisarEntrada(d, 'lanzador');
    save(path.join(REPO, 'lanzador/data.json'), d);
}

// ---------------------------------------------------------------- bateador
// Lo común a las dos barras de bateador (con estadísticas y con texto libre).
const ENTRADA_BAT = 36; // la base roja termina de entrar en el 35
function prepBateador(d) {
    // "AL BATE" son dos capas, las dos mitades de la cortina de entrada: llevan la misma clase
    // para que una sola clave cambie el título entero. Es la única clase repetida a propósito.
    rename(d, 'al bate', 'titulo');
    rename(d, 'al bate 2', 'titulo');
    renameCrests(d);
    // 260 y no 275.4: el nombre arranca a 15 px del borde del panel y un nombre largo llegaba
    // a 5 px del panel blanco; así queda el mismo aire de los dos lados
    layer(d, '.nombrejugador').t.d.k[0].s.sz[0] = 260;
    // el triángulo amarillo de la línea de información traía clase, pero no es una clave
    const lead = layer(d, '.leadinbarrainformacion');
    lead.nm = 'leadinbarrainformacion';
    delete lead.cl;

    d.markers = [
        { tm: 0, cm: 'play', dr: ENTRADA_BAT, payload: { name: 'play', type: 'pause', order: 1, stop: 'salida' } },
        { tm: 60, cm: 'stop', dr: 1 },
        { tm: ENTRADA_BAT, cm: 'salida', dr: -ENTRADA_BAT }
    ];
    d.fonts.list[0].fPath = FONT;
    avisarEntrada(d, 'bateador');
}
{
    const d = load(path.join(SRC, 'lowbar bateador/data.json'));
    prepBateador(d);
    // de izquierda a derecha: AVG, HR, CI, OBP
    statSlots(d, [
        ['average', 'numeroaverage'], ['jonrones', 'numerojonrones'],
        ['carrerasimpulsadas', 'numerocarreras'], ['obp', 'numeroobp']
    ]);
    save(path.join(REPO, 'bateador/data.json'), d);
}
{
    // Misma barra, con una línea de texto libre en lugar de las estadísticas
    const d = load(path.join(SRC, 'lowbar bateador informacion/data.json'));
    prepBateador(d);
    rename(d, '.numeroaverage', 'texto'); // la clase quedó de la versión con estadísticas
    save(path.join(REPO, 'bateador_informacion/data.json'), d);
}
console.log('ok');
