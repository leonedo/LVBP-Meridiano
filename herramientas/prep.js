// Prepara los exports del diseñador para CasparCG: la receta de "Cuando llega un export nuevo"
// de CLAUDE.md, ejecutable. Escrito sobre los exports del 2026-10-03/04: si el diseñador cambia
// nombres de capas, falla diciendo cuál no encuentra (no adivina).
//
// Uso, desde la raíz del repo:
//   1. Descomprimir los zips del diseñador en una carpeta (EXPORTS): score/, defensiva/,
//      "tabla lanzador"/, "lowbar bateador"/, "lowbar bateador informacion"/, ofensiva/,
//      "3 en linea"/, "score parcial"/, prevenido/, "score final"/, "placa de juego"/,
//      "duelo de lanzadores"/, "himno nacional"/, "TABLA DE POSICIONES"/. Los que no estén se saltean: alcanza con el zip
//      que llegó.
//   2. Los JSON publicados, de donde se trasplantan las capas que el export no trae:
//        mkdir -p $PUB && for g in score lanzador; do git show HEAD:$g/data.json > $PUB/$g.json; done
//   3. node herramientas/prep.js $EXPORTS $PUB .
//   4. git diff, herramientas/lint.py y QA con el runtime real (CLAUDE.md).
// Las fuentes, las imágenes y los index.html no los toca: se copian a mano la primera vez. Los
// escudos de la placa de juego llegan aparte y los prepara herramientas/mediaplaca.py.
const fs = require('fs');
const path = require('path');

const [SRC, CUR, REPO] = process.argv.slice(2);
const load = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const save = (p, d) => fs.writeFileSync(p, JSON.stringify(d, null, 2)); // igual que lottie_save
const clone = o => JSON.parse(JSON.stringify(o));
// Cada receta corre sólo si su export está en SRC: el diseñador manda los zips de a uno.
const hay = zip => {
    const ok = fs.existsSync(path.join(SRC, zip, 'data.json'));
    if (!ok) console.log(`· ${zip}: no está en ${SRC}, se saltea`);
    return ok;
};

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
// El diseño va todo en mayúsculas: All Caps (ca: 1) en todas las capas de texto, que es lo que
// index.js mira para pasar a mayúsculas el texto del UPDATE. Hay exports que lo traen apagado
// en alguna capa (en ofensiva, nombres, valores e información; en defensiva y lanzador, titulo).
// Lottie tampoco lo aplica al texto por defecto, que se pasa acá (3 en línea trae "3 EN LíNEA").
function allCaps(d) {
    for (const l of d.layers) if (l.ty === 5) for (const k of l.t.d.k) {
        k.s.ca = 1;
        k.s.t = k.s.t.toUpperCase();
    }
}

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
if (hay('score')) {
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
    allCaps(d);
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
if (hay('defensiva')) {
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
    allCaps(d);
    avisarEntrada(d, 'defensiva');
    save(path.join(REPO, 'defensiva/data.json'), d);
}

// ---------------------------------------------------------------- lanzador
if (hay('tabla lanzador')) {
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
    allCaps(d);
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
    allCaps(d);
    avisarEntrada(d, 'bateador');
}
if (hay('lowbar bateador')) {
    const d = load(path.join(SRC, 'lowbar bateador/data.json'));
    prepBateador(d);
    // de izquierda a derecha: AVG, HR, CI, OBP
    statSlots(d, [
        ['average', 'numeroaverage'], ['jonrones', 'numerojonrones'],
        ['carrerasimpulsadas', 'numerocarreras'], ['obp', 'numeroobp']
    ]);
    save(path.join(REPO, 'bateador/data.json'), d);
}
if (hay('lowbar bateador informacion')) {
    // Misma barra, con una línea de texto libre en lugar de las estadísticas
    const d = load(path.join(SRC, 'lowbar bateador informacion/data.json'));
    prepBateador(d);
    rename(d, '.numeroaverage', 'texto'); // la clase quedó de la versión con estadísticas
    save(path.join(REPO, 'bateador_informacion/data.json'), d);
}

// ---------------------------------------------------------------- ofensiva
const ENTRADA_OF = 41; // la fila del noveno bate termina de aparecer en el 40
if (hay('ofensiva')) {
    const d = load(path.join(SRC, 'ofensiva/data.json'));

    rename(d, 'ofensiva 4', 'titulo');
    rename(d, 'ofensiva 3', 'titulo_entrada');
    rename(d, '.NOMBREEQUIPO', 'equipo'); // la misma clave que en defensiva
    rename(d, 'numeros', 'numeros'); // los turnos 1–9: texto fijo, con clase como los de score
    rename(d, '2024-Logo-MeridianoTV-original (6).png', 'logomeridiano');
    renameCrests(d);
    // Una fila por turno al bate: posicionN, jugadorN y valorN. La columna del .300 no tiene
    // rótulo y sirve para cualquier estadística, como los valorN de lanzador y bateador.
    // Anchos de caja (el export trae 222 en las dos columnas, montadas una sobre la otra): el
    // nombre llega hasta la línea divisoria con el mismo aire que tiene a la izquierda (9 px)
    // y el valor hasta el borde del panel con el aire que tiene después de la línea (11 px).
    for (let i = 1; i <= 9; i++) {
        rename(d, `.POSICION${i}`, `posicion${i}`);
        layer(d, `.jugador${i}`).t.d.k[0].s.sz[0] = 183;
        rename(d, `.averagej${i}`, `valor${i}`).t.d.k[0].s.sz[0] = 40.6;
    }

    // Línea de la barra negra: el export la trae alineada a la izquierda y en el video del
    // diseñador va centrada. Caja centrada en la barra, con 10 px de aire a cada lado. El
    // export trae lh 0.01: con eso un texto largo parte en dos líneas encimadas en vez de
    // encoger (textos-de-caja.md); va el 1.2 del cuerpo, que sólo mueve la segunda línea.
    const info = layer(d, '.informacion');
    const s = info.t.d.k[0].s, W = 356;
    s.j = 2;
    s.sz[0] = W;
    s.ps[0] = layer(d, 'barra negra baja Outlines').ks.p.k[0] - info.ks.p.k[0] - W / 2;
    s.lh = s.s * 1.2;

    d.markers = [
        { tm: 0, cm: 'play', dr: ENTRADA_OF, payload: { name: 'play', type: 'pause', order: 1, stop: 'salida' } },
        { tm: 60.0000024438501, cm: 'stop', dr: 1 },
        { tm: ENTRADA_OF, cm: 'salida', dr: -ENTRADA_OF }
    ];
    d.fonts.list[0].fPath = FONT;
    allCaps(d);
    avisarEntrada(d, 'ofensiva');
    save(path.join(REPO, 'ofensiva/data.json'), d);
}

// La publicidad llega como un PNG verde de relleno. En el repo va images/publicidad.png,
// transparente y del mismo tamaño: si el cliente no manda logo no sale nada, y el verde del export
// no se usa aunque alguien copie su images/. pr meet: Lottie por defecto recorta (slice) una
// imagen de otra proporción; así el logo entra entero y centrado. p: otro default (3 en línea, Speed
// Stick; parcial, Pepsi).
function publicidad(d, nm, p = 'publicidad.png') {
    const l = rename(d, nm, 'publicidad');
    Object.assign(d.assets.find(a => a.id === l.refId), { p, pr: 'xMidYMid meet' });
}

// ---------------------------------------------------------------- 3 en línea
const ENTRADA_3L = 59; // el título de la pestaña roja termina de aparecer en el 58
if (hay('3 en linea')) {
    const d = load(path.join(SRC, '3 en linea/data.json'));

    rename(d, '3 EN L\u00edNEA', 'titulo');
    rename(d, '3 en linea', 'titulo_entrada').t.d.k[0].s.t = '3 EN LÍNEA'; // llega sin la tilde
    // Una fila por bateador: jugadorN y valorN, como en ofensiva (las capas llegan con los
    // nombres de PREVENIDO). Las cajas quedan como las trae el export: el nombre deja el mismo
    // aire a los dos lados y el valor ya llega hasta la publicidad. El export trae lh 0.01, con
    // el que un nombre largo parte en dos líneas encimadas en vez de encoger (textos-de-caja.md).
    for (let i = 1; i <= 3; i++) {
        for (const l of [rename(d, `.PREVENIDO${i}`, `jugador${i}`), rename(d, `.AVERAGE${i}`, `valor${i}`)]) {
            const s = l.t.d.k[0].s;
            s.lh = s.s * 1.2;
        }
    }

    publicidad(d, 'PUBLICIDAD 3 EN LINEA.png', 'speedstick.png'); // 107×110; por defecto sale Speed Stick

    // El texto de la versión del video (los tres nombres y sus averages en una sola capa, con la
    // clase inválida "300 256 167") quedó en la comp tapado por su máscara: no se ve. Sale con ella.
    const vieja = d.layers.filter(l => l.cl === '300 256 167');
    if (vieja.length !== 1) throw new Error(`texto viejo de 3 en línea: ${vieja.length} coincidencias`);
    const fuera = [vieja[0], layer(d, 'mask6')];
    d.layers = d.layers.filter(l => !fuera.includes(l));

    d.markers = [
        { tm: 0, cm: 'play', dr: ENTRADA_3L, payload: { name: 'play', type: 'pause', order: 1, stop: 'salida' } },
        { tm: 60.0000024438501, cm: 'stop', dr: 1 },
        { tm: ENTRADA_3L, cm: 'salida', dr: -ENTRADA_3L }
    ];
    d.fonts.list[0].fPath = FONT;
    allCaps(d);
    avisarEntrada(d, '3 en línea');
    save(path.join(REPO, '3enlinea/data.json'), d);
}

// ---------------------------------------------------------------- parcial
// Escudos con las claves de score: VISITA arriba y LOCAL abajo. Los exports de parcial y final
// traen TIBU (en score es TIBUS), AGUIDEFENSIVA, LEEO y dos nm con un espacio al final.
function escudosDeScore(d, nombre) {
    for (const [nm, cl] of [
        ['.TIBULOCAL_opacidad', 'TIBUSLOCAL_opacidad'], ['.TIBUVISITA_opacidad', 'TIBUSVISITA_opacidad'],
        ['.AGUIDEFENSIVA_opacidad', 'AGUIVISITA_opacidad'], ['.LEEOVISITA_opacidad', 'LEOVISITA_opacidad'],
        ['.AGUILOCAL_opacidad', 'AGUILOCAL_opacidad']
    ]) rename(d, nm, cl);
    const escudos = d.layers.map(l => l.cl || '').filter(c => /(LOCAL|VISITA)_opacidad$/.test(c)).sort().join();
    const deScore = ['AGUI', 'ANZ', 'BRAVOS', 'CARD', 'LEO', 'MAGA', 'TIBUS', 'TIGRES']
        .flatMap(s => [s + 'LOCAL_opacidad', s + 'VISITA_opacidad']).sort().join();
    if (escudos !== deScore) throw new Error(`${nombre}: escudos distintos a los de score: ${escudos}`);
}
const ENTRADA_PAR = 32; // el panel termina de abrirse en el 31
if (hay('score parcial')) {
    const d = load(path.join(SRC, 'score parcial/data.json'));

    // PARCIAL, la cortina de entrada, son dos capas (antes y después de que se abra el panel):
    // las dos con la clase titulo, como el "al bate" de las barras de bateador.
    rename(d, 'parcial', 'titulo');
    rename(d, 'parcial 2', 'titulo');
    // Las mismas claves que score donde dicen lo mismo (inning, flechas, carreras y escudos), para
    // que el controlador mande la misma data a los dos; hits y errores, en el estilo de CARRERAS.
    // El inning traía el tracking del "C H E" (1600): un 10 se abría en dos y el 1 caía sobre las
    // flechas. Con un dígito, sin tracking queda idéntico.
    rename(d, '.numeroinning', 'inning').t.d.k[0].s.tr = 0;
    rename(d, '.inningarriba', 'INNINGarriba_opacidad');
    rename(d, '.inningabajo', 'INNINGabajo_opacidad');
    for (const eq of ['visita', 'local']) {
        for (const dato of ['carreras', 'hits', 'errores']) rename(d, `.${dato}${eq}`, `${dato}${eq}`.toUpperCase());
    }
    escudosDeScore(d, 'parcial');

    // Los tres bateadores del próximo inning, de arriba abajo: jugadorN, como en 3enlinea. Su
    // título traía una clase inválida (empieza con un dígito). Queda sin la tilde, como llega: la
    // barra roja es más baja que el texto y el acento de la Í se sale 3 px por arriba. Cajas de
    // nombre a 191 y no 202: el nombre arranca 17 px después de la línea divisoria y uno largo
    // llegaba a 6 px de la publicidad; así queda el mismo aire de los dos lados.
    ['a.monasterios', 'c.rodriguez', 'j.martinez'].forEach((nm, i) => {
        rename(d, nm, `jugador${i + 1}`).t.d.k[0].s.sz[0] = 191;
    });
    rename(d, '.3enlineaproxinning', 'titulo_jugadores');
    publicidad(d, 'PUBLICIDAD PARCIAL.png', 'pepsi.png'); // 217×168; por defecto sale Pepsi

    d.markers = [
        { tm: 0, cm: 'play', dr: ENTRADA_PAR, payload: { name: 'play', type: 'pause', order: 1, stop: 'salida' } },
        { tm: 60.0000024438501, cm: 'stop', dr: 1 },
        { tm: ENTRADA_PAR, cm: 'salida', dr: -ENTRADA_PAR }
    ];
    d.fonts.list[0].fPath = FONT;
    allCaps(d);
    avisarEntrada(d, 'parcial');
    save(path.join(REPO, 'parcial/data.json'), d);
}

// ---------------------------------------------------------------- prevenido
const ENTRADA_PRE = 48; // el título de la pestaña roja termina de aparecer en el 47
if (hay('prevenido')) {
    const d = load(path.join(SRC, 'prevenido/data.json'));

    // El mismo armado que 3 en línea, con una sola fila. PREVENIDO llega en dos capas con el mismo
    // nombre y sin clase: la cortina de entrada (va primero) y el título de la pestaña roja (el
    // que aparece con la opacidad).
    const [entrada, titulo] = d.layers.filter(l => l.nm === 'prevenido');
    if (!titulo || titulo.ks.o.a !== 1) throw new Error('prevenido: no encuentro las dos capas del título');
    Object.assign(entrada, { nm: '.titulo_entrada', cl: 'titulo_entrada' });
    Object.assign(titulo, { nm: '.titulo', cl: 'titulo' });
    // El de la pestaña llega centrado en x 1415, no en el centro de la pestaña: uno más largo que
    // PREVENIDO se salía por la izquierda. Alineado a la izquierda donde empieza PREVENIDO (92.58 px
    // de ancho con la fuente real) queda igual y crece hacia la derecha, como en 3 en línea.
    titulo.t.d.k[0].s.j = 0;
    titulo.ks.p.k[0] -= 92.57859375 / 2;
    rename(d, '.nombreprevenido', 'jugador');
    // La caja del valor llegaba 1.6 px adentro de la publicidad: uno más ancho que .300 (1.000,
    // 10.80) tocaba el logo. A 52 termina donde termina el .300 del diseño, 4 px antes del logo.
    rename(d, '.avergaeprevenido', 'valor').t.d.k[0].s.sz[0] = 52;
    publicidad(d, 'PULBLICIDAD PREVENIDO.png'); // 81×65
    // Llegó exportado con los glifos (chars): Lottie dibuja con ellos en vez de la fuente, y sólo
    // trae las letras del diseño ("V.BERICOTTO .300 PREVENIDO"). Cualquier otra no sale.
    delete d.chars;

    // Llegó sin markers y con la comp de 32 s: queda en 3 s como los demás, con el stop global en
    // el mismo lugar (después del play no se usa: el stage manda a salida).
    d.op = 90.0000036657751;
    d.markers = [
        { tm: 0, cm: 'play', dr: ENTRADA_PRE, payload: { name: 'play', type: 'pause', order: 1, stop: 'salida' } },
        { tm: 60.0000024438501, cm: 'stop', dr: 1 },
        { tm: ENTRADA_PRE, cm: 'salida', dr: -ENTRADA_PRE }
    ];
    d.fonts.list[0].fPath = FONT;
    allCaps(d);
    avisarEntrada(d, 'prevenido');
    save(path.join(REPO, 'prevenido/data.json'), d);
}

// ---------------------------------------------------------------- final
// Un rectángulo de la cortina (capa de forma del precomp) como máscara de otra capa, en sus
// coordenadas: el mismo tamaño en cada keyframe, con la curva del ancho.
function mascaraDeRect(forma, capa, mode) {
    const it = forma.shapes[0].it, rc = it.find(i => i.ty === 'rc'), tr = it.find(i => i.ty === 'tr');
    const k = forma.ks, [sx, sy] = k.s.k.map(v => v / 100);
    if (rc.p.k.some(v => v) || tr.a.k.some(v => v) || tr.s.k.some(v => v !== 100)) throw new Error(`${forma.nm}: rectángulo inesperado`);
    const cx = k.p.k[0] + (tr.p.k[0] - k.a.k[0]) * sx - capa.ks.p.k[0] + capa.ks.a.k[0];
    const cy = k.p.k[1] + (tr.p.k[1] - k.a.k[1]) * sy - capa.ks.p.k[1] + capa.ks.a.k[1];
    const cero = [[0, 0], [0, 0], [0, 0], [0, 0]];
    const rect = ([w, h]) => {
        const [x, y] = [w * sx / 2, h * sy / 2];
        return [{ c: true, i: cero, o: cero, v: [[cx - x, cy - y], [cx + x, cy - y], [cx + x, cy + y], [cx - x, cy + y]] }];
    };
    const pt = rc.s.k.map(kf => kf.i
        ? { t: kf.t, s: rect(kf.s), i: { x: kf.i.x[0], y: kf.i.y[0] }, o: { x: kf.o.x[0], y: kf.o.y[0] } }
        : { t: kf.t, s: rect(kf.s) });
    return { inv: false, mode, pt: { a: 1, k: pt }, o: { a: 0, k: 100 }, x: { a: 0, k: 0 }, nm: forma.nm };
}
// La barra de abajo (JG, JP y MVP) se apaga con barra_opacidad, para usar el gráfico a mitad de
// juego. El fondo del panel (el rectángulo con degradado) seguía por debajo de la barra y al
// apagarla quedaba una franja gris: el rectángulo termina en el borde de arriba de la barra y la
// franja pasa a una capa propia con la misma clase, 1 px más alta para que no quede costura. Mismo
// degradado (opaco) en las mismas coordenadas: con la barra prendida se ve igual que antes.
function barraApagable(d) {
    const barra = rename(d, 'Layer 19 Outlines', 'barra_opacidad');
    const fondo = layer(d, 'Layer 6 Outlines');
    const grupo = fondo.shapes.find(g => g.it.some(i => i.ty === 'gf'));
    const rectDe = g => g.it.find(i => i.ty === 'sh').ks.k;
    const trY = g => g.it.find(i => i.ty === 'tr').p.k[1];
    const gf = grupo.it.find(i => i.ty === 'gf');
    const plano = r => r.c && r.v.length === 4 && [...r.i, ...r.o].every(([x, y]) => !x && !y);
    const forma = barra.shapes[0];
    if (!plano(rectDe(grupo)) || !plano(rectDe(forma)) || gf.g.k.k.length !== gf.g.p * 4 || gf.o.k !== 100) {
        throw new Error('final: la barra o el fondo no son los rectángulos esperados');
    }
    // Borde de arriba de la barra, en las coordenadas del rectángulo del fondo
    const arriba = barra.ks.p.k[1] - barra.ks.a.k[1] + trY(forma) + Math.min(...rectDe(forma).v.map(v => v[1]));
    const corte = arriba - (fondo.ks.p.k[1] - fondo.ks.a.k[1] + trY(grupo));
    const franja = clone(fondo);
    Object.assign(franja, { nm: '.barra_opacidad', cl: 'barra_opacidad', ind: freeInd(d, Math.max(...d.layers.map(l => l.ind)) + 1) });
    franja.shapes = [clone(grupo)];
    const yMax = Math.max(...rectDe(grupo).v.map(v => v[1])), yMin = Math.min(...rectDe(grupo).v.map(v => v[1]));
    for (const v of rectDe(grupo).v) if (v[1] === yMax) v[1] = corte;
    for (const v of rectDe(franja.shapes[0]).v) if (v[1] === yMin) v[1] = corte - 1;
    insertAfter(d, 'Layer 6 Outlines', franja);
}
// "20" con League Gothic a 53.1, medido con la fuente cargada (lineWidths[0])
const ANCHO_20 = 37.759077039957056;
const ENTRADA_FIN = 33; // la cortina termina de abrirse en el 32
if (hay('score final')) {
    const d = load(path.join(SRC, 'score final/data.json'));

    // SCORE FINAL, la cortina: el texto tiene de mate el precomp de la cortina, que adentro tiene
    // su propio mate invertido (el hueco que se abre desde el centro). Lottie no dibuja un mate
    // anidado en la fuente de otro: el texto quedaba entero encima del panel. Sale el mate y van
    // las dos formas del precomp como máscaras de la capa: suma el rojo que crece (0–16) y resta
    // el hueco (16–32). El precomp que se ve queda igual.
    const entrada = rename(d, 'score final', 'titulo_entrada');
    const mate = d.layers[d.layers.indexOf(entrada) - 1];
    const cortina = d.assets.find(a => a.id === mate.refId);
    if (!mate.td || !cortina || mate.ks.p.k.some((v, i) => v !== mate.ks.a.k[i]) || mate.ks.s.k.some(v => v !== 100)) {
        throw new Error('final: el mate de la cortina no es el esperado');
    }
    const forma = nm => cortina.layers.find(l => l.nm === nm);
    entrada.hasMask = true;
    entrada.masksProperties = [mascaraDeRect(forma('Shape Layer 1'), entrada, 'a'), mascaraDeRect(forma('Shape Layer 2'), entrada, 's')];
    delete entrada.tt;
    d.layers = d.layers.filter(l => l !== mate);

    // FINAL, arriba a la izquierda: llega centrado, y uno más largo tapaba el triángulo. Alineado a
    // la izquierda donde empieza FINAL (42.09 px con la fuente real) queda igual y crece a la derecha.
    const titulo = rename(d, 'FINAL', 'titulo');
    titulo.t.d.k[0].s.j = 0;
    titulo.ks.p.k[0] -= 42.09392246752974 / 2;
    // Los rótulos fijos, sin clase en el export: llevan una, como los de score (no hace falta mandarlos).
    rename(d, 'innnings', 'innings');
    rename(d, 'CHE', 'carrerashitserrores');
    // La columna 9 es la del último inning: su rótulo (X en el diseño) cambia con los extra innings.
    // Traía lh 0.01: un texto largo partiría en líneas encimadas en vez de encoger.
    const ultimo = rename(d, '.ultimoinning', 'ultimoinning').t.d.k[0].s;
    ultimo.lh = ultimo.s * 1.2;

    // Carreras por inning, hits y errores: las claves de score y parcial (CARRERAS…, en mayúsculas),
    // INNING… en el mismo estilo; el export trae "inninlocal". Llegan alineados a la izquierda y
    // corridos a ojo: un dígito quedaba sobre el borde izquierdo de su columna. Centrados sobre el
    // eje del "20" del diseño (receta de textos-de-caja.md), el 20 no se mueve.
    const numeros = [];
    for (let i = 1; i <= 9; i++) {
        numeros.push(rename(d, `.inningvisita${i}`, `INNINGVISITA${i}`), rename(d, `.inninlocal${i}`, `INNINGLOCAL${i}`));
    }
    for (const eq of ['visita', 'local']) {
        for (const dato of ['carreras', 'hits', 'errores']) numeros.push(rename(d, `.${dato}${eq}`, `${dato}${eq}`.toUpperCase()));
    }
    for (const l of numeros) {
        const s = l.t.d.k[0].s;
        if (s.j !== 0 || s.t !== '20' || Math.abs(s.s - 53.1) > 0.01) throw new Error(`final: ${l.cl} no es el 20 a 53.1`);
        s.j = 2;
        s.ps[0] += (ANCHO_20 - s.sz[0]) / 2;
    }
    escudosDeScore(d, 'final');

    // JG, JP y MVP: rótulo y nombre. El rótulo de JP llegó "JP:H:" en una caja para tres letras:
    // la "H:" partía a una segunda línea, debajo de la barra.
    layer(d, '.juegoperdido').t.d.k[0].s.t = 'JP:';
    barraApagable(d);

    d.markers = [
        { tm: 0, cm: 'play', dr: ENTRADA_FIN, payload: { name: 'play', type: 'pause', order: 1, stop: 'salida' } },
        { tm: 60.0000024438501, cm: 'stop', dr: 1 },
        { tm: ENTRADA_FIN, cm: 'salida', dr: -ENTRADA_FIN }
    ];
    d.fonts.list[0].fPath = FONT;
    allCaps(d);
    avisarEntrada(d, 'final');
    save(path.join(REPO, 'final/data.json'), d);
}

// ---------------------------------------------------------------- placa de juego
// Versión preliminar (2026-10-13), con MAGALLANES y TIBURONES en el diseño: los equipos del juego
// de ese día. El "VS" termina de asentarse en el 73; BASE Outlines tiene un keyframe en el 75 con
// el mismo valor que el del 38, que no mueve nada.
const ENTRADA_PLACA = 74;
// Un punto de la capa en la pantalla, subiendo por los padres (transforms fijos, sin rotación).
// alFinal: los transforms animados valen lo del último keyframe (donde termina la entrada).
function aPantalla(d, capa, [x, y], alFinal = false) {
    for (let l = capa; l; l = l.parent && d.layers.find(p => p.ind === l.parent)) {
        const { p, a, s, r } = l.ks;
        if ((!alFinal && (p.a || a.a || s.a)) || (r && (r.a || r.k))) throw new Error(`${l.nm}: transform animado`);
        const [P, A, S] = [p, a, s].map(v => v.a ? v.k.at(-1).s : v.k);
        x = P[0] + (x - A[0]) * S[0] / 100;
        y = P[1] + (y - A[1]) * S[1] / 100;
    }
    return [x, y];
}
// Una capa recortada por la caja: de mate, una copia de `mask`, el área fija del panel (la que ya
// recorta la base roja). Para las que perdieron el mate porque en AE era una capa oculta.
function enLaCaja(d, capa, ind) {
    const area = Object.assign(clone(layer(d, 'mask')), { nm: `mask ${capa.cl}`, ind: freeInd(d, ind), ip: capa.ip, op: capa.op, td: 1 });
    d.layers.splice(d.layers.indexOf(capa), 0, area);
    capa.tt = 1;
}
// El logo de Meridiano llega en dos capas (clase png). El que sube con la base (0–32) tiene de matte
// al otro, que no existe hasta el 31: no se ve nunca. Y con el otro mateado sería un mate anidado,
// que Lottie no dibuja. Sale. El que queda entra a la caja, sube y sale por arriba (36–40): sin su
// matte (oculto en AE: ind vacío justo arriba) quedaba cortado contra el borde de la pantalla
// durante toda la pausa.
function unLogo(d, nombre, ind) {
    const logos = d.layers.filter(l => l.nm === '2024-Logo-MeridianoTV-original (6).png');
    const [logo, logoBase] = logos;
    if (logos.length !== 2 || logo.ind !== ind + 1 || !logoBase.tt || d.layers[d.layers.indexOf(logoBase) - 1] !== logo) {
        throw new Error(`${nombre}: los logos de Meridiano no son los esperados`);
    }
    d.layers = d.layers.filter(l => l !== logoBase);
    Object.assign(logo, { nm: '.logomeridiano', cl: 'logomeridiano' });
    enLaCaja(d, logo, ind);
}
// En la placa y en el duelo, base animada 6 y 7 son copias de base animada (la caja roja del título)
// y llegan sin el trazado de su grupo (np 3, pero sólo el degradado y el transform): en AE
// seguramente lo toman de la original con una expresión, que el export no lleva. La 7 es la caja del
// VS (en la comp de AE del duelo se ve); la 6, el mate de base animada 5, la caja roja que sube con el
// logo (30–44): con el mate vacío no se veía. Las dos quedan con el trazado de base animada.
function trazadoDeLaCaja(d, nombre, nm) {
    const grupo = l => l.shapes.find(g => g.nm === 'Group 2');
    const fuente = grupo(layer(d, 'base animada')), g = grupo(layer(d, nm));
    const tr = gr => JSON.stringify(['p', 'a', 's'].map(k => gr.it.find(i => i.ty === 'tr')[k].k));
    if (!g || g.np !== 3 || g.it.some(i => i.ty === 'sh') || tr(g) !== tr(fuente)) throw new Error(`${nombre}: ${nm} no es la copia esperada`);
    g.it.unshift(clone(fuente.it.find(i => i.ty === 'sh')));
}
// El rectángulo (rc) de una capa de forma con un solo grupo, en la pantalla: [x0, y0, x1, y1]
function rectDeForma(capa) {
    const g = capa.shapes[0], rc = g.it.find(i => i.ty === 'rc'), tr = g.it.find(i => i.ty === 'tr');
    if (capa.shapes.length !== 1 || !rc || rc.p.a || rc.s.a || tr.a.k.some(v => v) || tr.s.k.some(v => v !== 100)) {
        throw new Error(`${capa.nm}: rectángulo inesperado`);
    }
    return { rc, tr };
}
function rectEnPantalla(d, capa) {
    const { rc, tr } = rectDeForma(capa);
    const [cx, cy] = [tr.p.k[0] + rc.p.k[0], tr.p.k[1] + rc.p.k[1]], [w, h] = rc.s.k;
    return [...aPantalla(d, capa, [cx - w / 2, cy - h / 2]), ...aPantalla(d, capa, [cx + w / 2, cy + h / 2])];
}
// Las dos mitades. Cada escudo (media placa: fondo, marca de agua y escudo) tiene de mate un
// rectángulo fijo (Shape Layer 1 y 2) más grande que la imagen, así que el borde lo hacía el PNG:
// con el marco claro de la caja disparejo (de 1,5 a 5 px) y la línea del centro sólo donde el PNG
// traía borde transparente, distinto con cada equipo. Los mates pasan a ser la caja menos un marco
// parejo y la línea del centro, como en el video del diseñador. Los PNG van opacos y más grandes
// que su mate (herramientas/mediaplaca.py).
const MARCO_PLACA = 4, LINEA_PLACA = 2; // px de pantalla
// La caja (`mask`, el área fija del panel) en la pantalla: [x0, y0, x1, y1]
function cajaEnPantalla(d, nombre) {
    const caja = layer(d, 'mask');
    const g = caja.shapes.find(g => g.it.some(i => i.ty === 'fl'));
    const sh = g.it.find(i => i.ty === 'sh').ks.k, tr = g.it.find(i => i.ty === 'tr');
    if (tr.a.k.some(v => v) || tr.s.k.some(v => v !== 100)) throw new Error(`${nombre}: la caja no es la esperada`);
    const xs = sh.v.map(v => v[0] + tr.p.k[0]), ys = sh.v.map(v => v[1] + tr.p.k[1]);
    return [...aPantalla(d, caja, [Math.min(...xs), Math.min(...ys)]), ...aPantalla(d, caja, [Math.max(...xs), Math.max(...ys)])];
}
function mitades(d) {
    const [x0, y0, x1, y1] = cajaEnPantalla(d, 'placa');
    const centro = (x0 + x1) / 2, arriba = y0 + MARCO_PLACA, abajo = y1 - MARCO_PLACA;
    const zonas = {
        escudovisita: [x0 + MARCO_PLACA, centro - LINEA_PLACA / 2],
        escudolocal: [centro + LINEA_PLACA / 2, x1 - MARCO_PLACA]
    };
    for (const [cl, [izq, der]] of Object.entries(zonas)) {
        const img = layer(d, '.' + cl), mate = d.layers[d.layers.indexOf(img) - 1];
        const rc = mate.shapes[0].it.find(i => i.ty === 'rc'), t = mate.shapes[0].it.find(i => i.ty === 'tr');
        const st = mate.shapes[0].it.find(i => i.ty === 'st');
        if (!mate.td || img.tt !== 1 || mate.parent || img.parent || rc.p.k.some(v => v) || t.a.k.some(v => v)
            || t.s.k.some(v => v !== 100) || (st && st.w.k) || aPantalla(d, mate, [0, 0]).some((v, i) => v !== mate.ks.p.k[i])) {
            throw new Error(`placa: el mate de ${cl} no es el esperado`);
        }
        // La imagen donde termina de entrar: tiene que cubrir su mitad entera
        const asset = d.assets.find(a => a.id === img.refId), sc = img.ks.s.k[0] / 100, [px, py] = img.ks.p.k.at(-1).s;
        const ix = px - img.ks.a.k[0] * sc, iy = py - img.ks.a.k[1] * sc;
        if (img.ks.s.a || ix > izq || ix + asset.w * sc < der || iy > arriba || iy + asset.h * sc < abajo) {
            throw new Error(`placa: ${cl} no cubre su mitad`);
        }
        rc.s.k = [der - izq, abajo - arriba];
        t.p.k = [(izq + der) / 2 - mate.ks.p.k[0], (arriba + abajo) / 2 - mate.ks.p.k[1]];
    }
}
if (hay('placa de juego')) {
    const d = load(path.join(SRC, 'placa de juego/data.json'));

    // Magallanes a la izquierda y Tiburones a la derecha, como visita y local en score.
    const caja = nm => {
        const s = rename(d, nm, nm === 'TIBURONES DE LA GUAIRA' ? 'equipolocal' : 'equipovisita').t.d.k[0].s;
        // Traen lh 0.01: un nombre más largo partiría en líneas encimadas en vez de encoger.
        s.lh = s.s * 1.2;
    };
    caja('NAVEGANTES DEL MAGALLANES 2');
    caja('TIBURONES DE LA GUAIRA');
    // Los escudos, en images/ con el nombre del equipo (los de LVBP-Stats): el export los trae como
    // img_0/img_1. Esos dos quedan como copia, porque los manda el LVBP-Stats de v0.0.17.
    for (const [nm, cl, archivo] of [['MAGALLANES.png', 'escudovisita', 'magallanes.png'], ['TIBURONES.png', 'escudolocal', 'tiburones.png']]) {
        const { refId } = rename(d, nm, cl);
        d.assets.find(a => a.id === refId).p = archivo;
    }
    mitades(d);
    rename(d, 'liga venezolana de beisbol profesional', 'liga');
    rename(d, 'estadio universitario -ucv, caracas', 'estadio');
    rename(d, 'vs', 'vs');

    // Al logo de Meridiano y al JUEGO DE HOY les faltan los mattes: eran capas ocultas en AE, que no
    // se exportan (ind 18 y 21 vacíos). Van recortados por la caja, como la base roja (su matte
    // `mask` es el área fija del panel): confirmado con el video del diseñador.
    unLogo(d, 'placa', 18);
    // JUEGO DE HOY sube con su caja roja (10–38): la caja sale recortada por el borde de arriba y el
    // texto seguía de largo sobre el fondo (18–30).
    enLaCaja(d, rename(d, 'juego de hoy', 'titulo'), 21);
    // La caja que sube con el logo y termina en la del VS, como en el duelo. De la placa no hay
    // captura de AE: se aplicó igual (Leon, 2026-10-24).
    trazadoDeLaCaja(d, 'placa', 'base animada 6');
    trazadoDeLaCaja(d, 'placa', 'base animada 7');

    // El export trae start (0–30) y un stop del 90 al 121 sin animación.
    d.markers = [
        { tm: 0, cm: 'play', dr: ENTRADA_PLACA, payload: { name: 'play', type: 'pause', order: 1, stop: 'salida' } },
        { tm: 90.0000036657751, cm: 'stop', dr: 1 },
        { tm: ENTRADA_PLACA, cm: 'salida', dr: -ENTRADA_PLACA }
    ];
    // Llega con la carpeta (PLACA DE JUEGO\font), no con el archivo: salía la fuente de reserva.
    d.fonts.list[0].fPath = FONT;
    allCaps(d);
    avisarEntrada(d, 'placa de juego');
    save(path.join(REPO, 'placa_juego/data.json'), d);
}

// ---------------------------------------------------------------- duelo de lanzadores
// Armado sobre la placa de juego (la caja, el título que sube, el logo y las medias placas de los
// equipos), con la foto de cada lanzador delante de su escudo, la barra de los nombres y la tabla
// de estadísticas que baja desde atrás de la caja. La entrada termina en el 74 (el tinte de los
// escudos; el VS se asienta en el 73). El aviso por el 75 es falso, como en la placa: BASE Outlines
// repite ahí el valor del 38 y no mueve nada.
const ENTRADA_DUELO = 75;
// Las fotos, cada una recortada por un rectángulo (Shape Layer 3 y 4) delante de su media placa. La
// del diseño es un recorte sin fondo de 600 × 436, y las dos capas comparten el asset. Por defecto
// va images/foto.png, transparente: sin foto queda el escudo solo. pr xMidYMax meet: una foto de
// cualquier proporción entra entera, centrada y apoyada en la barra de los nombres (Lottie por
// defecto recorta, y a un recorte vertical le cortaba la cabeza). La imagen se centra en su mitad:
// el diseño la corrió a ojo para centrar ese recorte, que no está centrado en su PNG (con otra
// foto quedaba 6–8 px a la derecha). Y el rectángulo termina en el borde de la caja: el de visita
// se salía 4,5 px por la izquierda.
function fotos(d) {
    const [cx0, cy0, cx1, cy1] = cajaEnPantalla(d, 'duelo');
    const refs = new Set();
    for (const [cl, nmMate] of [['fotolanzadorvisita', 'Shape Layer 3'], ['fotolanzadorlocal', 'Shape Layer 4']]) {
        const img = layer(d, '.' + cl), mate = d.layers[d.layers.indexOf(img) - 1];
        const { p, a, s } = mate.ks, { rc, tr } = rectDeForma(mate);
        if (mate.nm !== nmMate || !mate.td || img.tt !== 1 || mate.parent || p.a || a.a || s.a) throw new Error(`duelo: el mate de ${cl} no es el esperado`);
        const [x0, y0, x1, y1] = rectEnPantalla(d, mate);
        const r = [Math.max(x0, cx0), Math.max(y0, cy0), Math.min(x1, cx1), Math.min(y1, cy1)];
        const local = (v, i) => a.k[i] + (v - p.k[i]) * 100 / s.k[i];
        const [lx0, ly0, lx1, ly1] = r.map((v, i) => local(v, i % 2));
        rc.s.k = [lx1 - lx0, ly1 - ly0];
        tr.p.k = [(lx0 + lx1) / 2 - rc.p.k[0], (ly0 + ly1) / 2 - rc.p.k[1]];

        const asset = d.assets.find(x => x.id === img.refId), ks = img.ks, sc = ks.s.k[0] / 100;
        if (img.parent || ks.a.a || ks.s.a || ks.s.k[0] !== ks.s.k[1] || !ks.p.a || ks.p.k.some(k => k.s[0] !== ks.p.k[0].s[0])) {
            throw new Error(`duelo: ${cl} no entra como se esperaba`);
        }
        ks.a.k[0] = asset.w / 2 - ((r[0] + r[2]) / 2 - ks.p.k[0].s[0]) / sc;
        Object.assign(asset, { p: 'foto.png', pr: 'xMidYMax meet' });
        refs.add(img.refId);
    }
    if (refs.size !== 1) throw new Error('duelo: las fotos ya no comparten el asset');
}
// Los colores de la comp de AE (la captura que mandó Leon el 2026-10-24: así se tiene que ver). El
// export trae la tabla roja, con los números gris oscuro casi sin leerse, y la columna del centro y
// la barra de los nombres en un rojo oscuro vertical. En AE la tabla es la caja blanca de la placa
// de juego (medido: 254 arriba, 198 abajo), y la columna y la barra son un rojo vivo en diagonal,
// el mismo en las dos medido en el rectángulo de cada una: un plano, con error medio de 2 a 5 niveles.
const BLANCO_PLACA = [0, 1, 1, 1, 0.5, 0.886, 0.886, 0.886, 1, 0.773, 0.773, 0.773];
const ROJO_DIAGONAL = { tl: 0.921, tr: 0.771, bl: 0.675, br: 0.524 }; // las cuatro esquinas
// Lottie (y AE) aplican el degradado en las coordenadas de la forma: el plano va de la esquina de
// arriba a la izquierda en la dirección en que más baja, hasta la de abajo a la derecha.
function rojoDiagonal(capa) {
    const g = capa.shapes.find(g => g.nm === 'Group 1');
    const sh = g.it.find(i => i.ty === 'sh').ks, gf = g.it.find(i => i.ty === 'gf');
    if (sh.a || gf.s.a || gf.e.a || gf.g.k.a || gf.g.p !== 3 || gf.t !== 1) throw new Error(`duelo: el degradado de ${capa.nm} no es el esperado`);
    const xs = sh.k.v.map(v => v[0]), ys = sh.k.v.map(v => v[1]);
    const [x0, y0, x1, y1] = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
    const { tl, tr, bl, br } = ROJO_DIAGONAL;
    const gx = (tr - tl) / (x1 - x0), gy = (bl - tl) / (y1 - y0), n2 = gx * gx + gy * gy;
    gf.s.k = [x0, y0];
    gf.e.k = [x0 - gx * (tl - br) / n2, y0 - gy * (tl - br) / n2];
    gf.g.k.k = [0, tl, 0, 0, 0.5, (tl + br) / 2, 0, 0, 1, br, 0, 0];
}
// El tinte azul de los escudos: Lottie no lo dibuja como AE. AE mezcla el escudo con el color del
// tinte (el que toca a su luminancia, entre Map Black y Map White) según el Amount; el filtro de Lottie
// además le suma la luminancia en gris, y los escudos salían grises (el azul de Magallanes, 42 59 92
// en vez del 9 51 101 de la comp de AE). Va como AE, con una capa encima de cada escudo: un
// rectángulo del color del tinte, con el Amount de opacidad, colgado del escudo (entra con él) y
// recortado por una copia de su mate. El color es el del tinte a una luminancia fija (la del fondo
// de los escudos): ahí queda a pocos niveles de AE, y lo claro de cada escudo un poco más claro.
const LUMINANCIA_TINTE = 0.2;
function tinteComoAE(d, img) {
    const ef = (img.ef || []).find(e => e.mn === 'ADBE Tint'), mate = d.layers[d.layers.indexOf(img) - 1];
    if (!ef || img.ef.length !== 1 || !mate.td) throw new Error(`duelo: el tinte de ${img.cl} no es el esperado`);
    const [negro, blanco, cantidad] = ef.ef.map(e => e.v);
    if (negro.a || blanco.a) throw new Error(`duelo: el tinte de ${img.cl} tiene los colores animados`);
    const color = negro.k.map((c, i) => i < 3 ? c + LUMINANCIA_TINTE * (blanco.k[i] - c) : 1);
    const { w, h } = d.assets.find(a => a.id === img.refId);
    const fijo = k => ({ a: 0, k });
    const ind = Math.max(...d.layers.map(l => l.ind)) + 1;
    const velo = {
        ddd: 0, ind: ind + 1, ty: 4, nm: `tinte ${img.cl}`, parent: img.ind, tt: 1, sr: 1, ao: 0, bm: 0,
        ks: { o: clone(cantidad), r: fijo(0), p: fijo([0, 0, 0]), a: fijo([0, 0, 0]), s: fijo([100, 100, 100]) },
        shapes: [{
            ty: 'gr', nm: 'tinte', np: 2, it: [
                { ty: 'rc', nm: 'escudo', d: 1, s: fijo([w, h]), p: fijo([w / 2, h / 2]), r: fijo(0) },
                { ty: 'fl', nm: 'color', c: fijo(color), o: fijo(100), r: 1 },
                { ty: 'tr', nm: 'Transform', p: fijo([0, 0]), a: fijo([0, 0]), s: fijo([100, 100]), r: fijo(0), o: fijo(100), sk: fijo(0), sa: fijo(0) }
            ]
        }],
        ip: img.ip, op: img.op, st: img.st
    };
    const mateVelo = Object.assign(clone(mate), { ind, nm: `${mate.nm} tinte` });
    d.layers.splice(d.layers.indexOf(mate), 0, mateVelo, velo);
    delete img.ef;
}
if (hay('duelo de lanzadores')) {
    const d = load(path.join(SRC, 'duelo de lanzadores/data.json'));

    // La tabla (BASE Outlines 3, el panel que baja con las estadísticas) quedó entre el fondo oscuro de
    // la caja (BASE Outlines) y su mate (BASE Outlines 2). Lottie toma de mate la capa de arriba: el
    // fondo se recortaba con la tabla, que no existe hasta el 44, y no se veía nunca. La tabla pasa
    // arriba del mate: lo que se ve queda en el mismo orden.
    const fondo = layer(d, 'BASE Outlines'), i = d.layers.indexOf(fondo);
    const [mateFondo, tabla] = d.layers.slice(i - 2, i);
    if (!fondo.tt || mateFondo.nm !== 'BASE Outlines 2' || !mateFondo.td || tabla.nm !== 'BASE Outlines 3' || tabla.td || tabla.tt) {
        throw new Error('duelo: el fondo de la caja y su mate no son los esperados');
    }
    d.layers.splice(i - 2, 2, tabla, mateFondo);

    // El logo y el título (EL DUELO), como en la placa de juego: les faltan los mattes (ind 55 y 58
    // vacíos) y van recortados por la caja.
    unLogo(d, 'duelo', 55);
    enLaCaja(d, rename(d, 'el duelo', 'titulo'), 58);
    rename(d, 'vs', 'vs');

    // Los escudos son las medias placas de la placa de juego (fondo, marca de agua y escudo), con un
    // tinte azul que las oscurece detrás de las fotos. Van con las mismas claves y los mismos PNG
    // (images/<equipo>.png, de herramientas/mediaplaca.py). Acá los mates son más chicos que la
    // imagen (9–11 px por lado): el borde del PNG no se ve y no hace falta lo de mitades().
    for (const [nm, cl, archivo] of [['MAGALLANES.png', 'escudovisita', 'magallanes.png'], ['TIBURONES.png', 'escudolocal', 'tiburones.png']]) {
        const img = rename(d, nm, cl), mate = d.layers[d.layers.indexOf(img) - 1];
        const asset = d.assets.find(a => a.id === img.refId);
        asset.p = archivo;
        const [ix0, iy0] = aPantalla(d, img, [0, 0], true), [ix1, iy1] = aPantalla(d, img, [asset.w, asset.h], true);
        const [mx0, my0, mx1, my1] = rectEnPantalla(d, mate);
        if (!mate.td || img.tt !== 1 || ix0 > mx0 || iy0 > my0 || ix1 < mx1 || iy1 < my1) throw new Error(`duelo: ${cl} no cubre su mate`);
        tinteComoAE(d, img);
    }
    fotos(d);

    // Las estadísticas, de arriba abajo (RECORD, K, BB, WHIP y ERA), con casilleros genéricos como en
    // lanzador: etiquetaN, el rótulo de la columna del centro, y valorvisitaN / valorlocalN, los
    // números de cada lado. Los valores ya llegan en cajas iguales (140.79, centradas en su lado).
    // Los rótulos son de punto: pasan a caja (textos-de-caja.md), todos de 228, que deja 10 px a cada
    // lado en la columna del centro (254 px, de 831.5 a 1085.5: RECORD y K están centrados en 961.45
    // y los otros en 958.9). La capa se ve a escala 1.
    const ETIQUETA = [228, 47];
    [
        ['ganadosyperdidos', 'recordvisitante', 'recordlocal'], ['ponches', 'ponchesvisitante', 'poncheslocal'],
        ['basexbolas', 'basesxbolasvisita', 'basesxbolaslocal'], ['whip', 'whipvisita', 'whiplocal'],
        ['efectividad', 'efectividadvisita', 'efectividadlocal']
    ].forEach(([etiqueta, visita, local], n) => {
        const l = rename(d, '.' + etiqueta, `etiqueta${n + 1}`), s = l.t.d.k[0].s;
        const [ox] = aPantalla(d, l, [0, 0], true), [ux] = aPantalla(d, l, [1, 0], true);
        if (s.sz || s.j !== 2 || Math.abs(ux - ox - 1) > 1e-3) throw new Error(`duelo: el rótulo ${etiqueta} no es de punto, centrado y a escala 1`);
        s.sz = ETIQUETA.slice();
        s.ps = [-ETIQUETA[0] / 2, -(d.fonts.list[0].ascent * s.s / 100)];
        rename(d, '.' + visita, `valorvisita${n + 1}`);
        rename(d, '.' + local, `valorlocal${n + 1}`);
    });

    trazadoDeLaCaja(d, 'duelo', 'base animada 6');
    trazadoDeLaCaja(d, 'duelo', 'base animada 7');
    const blanco = tabla.shapes.find(g => g.nm === 'Group 2').it.find(i => i.ty === 'gf');
    if (blanco.g.p !== 3 || blanco.s.k[1] >= blanco.e.k[1]) throw new Error('duelo: el degradado de la tabla no va de arriba abajo');
    blanco.g.k.k = BLANCO_PLACA.slice();
    rojoDiagonal(layer(d, 'BASERED Outlines 5')); // la columna del centro
    rojoDiagonal(layer(d, 'BASERED Outlines')); // la barra de los nombres

    // El export trae start (0–30) y un stop del 90 al 121 sin animación.
    d.markers = [
        { tm: 0, cm: 'play', dr: ENTRADA_DUELO, payload: { name: 'play', type: 'pause', order: 1, stop: 'salida' } },
        { tm: 90.0000036657751, cm: 'stop', dr: 1 },
        { tm: ENTRADA_DUELO, cm: 'salida', dr: -ENTRADA_DUELO }
    ];
    // Llega con la carpeta (DUELO DE LANZADORES\font), no con el archivo
    d.fonts.list[0].fPath = FONT;
    allCaps(d);
    avisarEntrada(d, 'duelo de lanzadores');
    save(path.join(REPO, 'duelo_lanzadores/data.json'), d);
}

// ---------------------------------------------------------------- himno nacional
// Lowbar del himno: la barra del bateador con la bandera en lugar del escudo, el país en la barra
// blanca y HIMNO NACIONAL en la pestaña negra. Medidas con la fuente real, en el frame 40.
const ENTRADA_HIMNO = 31; // la barra blanca y la pestaña terminan de entrar en el 30
const ESPACIO_HIMNO = 7.234; // el espacio inicial del país, a cuerpo 47 (511.04 − 503.81)
if (hay('himno nacional')) {
    const d = load(path.join(SRC, 'himno nacional/data.json'));

    // El país llega como " REPUBLICA BOLIVARIANA DE VENEZUELA", con un espacio adelante: el
    // cliente lo va a mandar sin él. Sin el espacio y con la caja corrida ese ancho, el texto del
    // diseño queda en el mismo píxel (x 670.44). La caja termina 57 px antes del final de la barra
    // blanca, el mismo aire que deja la bandera a la izquierda (llegaba a 36).
    const pais = rename(d, '.nombrejugador', 'texto').t.d.k[0].s; // la clase quedó del bateador
    if (pais.t !== ' REPUBLICA BOLIVARIANA DE VENEZUELA' || pais.j !== 0) throw new Error('himno: el texto del país cambió');
    pais.t = pais.t.trim();
    pais.ps[0] += ESPACIO_HIMNO;
    pais.sz[0] = 613.34;
    // HIMNO NACIONAL: llegaba alineado a la izquierda desde la x 610, en una pestaña negra que va de
    // la x 479.6 a la 899.96 (un título corto quedaba corrido), y la caja pasaba 31 px el borde.
    // Va centrado en la pestaña (Leon, 2026-10-26), con la caja a 10 px de cada borde.
    const capaTitulo = rename(d, '.informacionbarranegra', 'titulo');
    const titulo = capaTitulo.t.d.k[0].s;
    if (titulo.j !== 0) throw new Error('himno: el título no está alineado a la izquierda');
    if (capaTitulo.parent || capaTitulo.ks.p.a || capaTitulo.ks.s.k[0] !== 100) throw new Error('himno: el título se movió');
    const PESTANA = [479.6, 899.96];
    titulo.j = 2;
    titulo.sz[0] = PESTANA[1] - PESTANA[0] - 20;
    titulo.ps[0] = PESTANA[0] + 10 - capaTitulo.ks.p.k[0];
    // La bandera (clase "svg webp", que no es una clase válida) pasa a ser una imagen reemplazable.
    // El export trae la bandera a 3840 × 2560 (330 KB) para dibujarla a 129 × 86: el asset sigue
    // con ese tamaño (Lottie escala cualquier archivo a esa caja) y el archivo es
    // images/venezuela.jpg, a 258 × 172, que se copia a mano. Por defecto recorta (slice): una
    // bandera de otra proporción llena la caja.
    const bandera = rename(d, 'Flag_of_Venezuela.svg.webp', 'bandera');
    Object.assign(d.assets.find(a => a.id === bandera.refId), { p: 'venezuela.jpg' });
    // MERIDIANO TELEVISION, la cortina de entrada: dos capas (antes y después de partirse), como
    // AL BATE en las barras de bateador. Llevan la misma clase que el texto del score.
    for (const nm of ['meridiano television', 'meridiano television 2']) {
        Object.assign(layer(d, nm), { nm: '.meridianotv', cl: 'meridianotv' });
    }
    // Null 7 no es padre de nada y su único keyframe (31) estiraba la entrada
    const nulo = layer(d, 'Null 7');
    if (d.layers.some(l => l.parent === nulo.ind)) throw new Error('himno: Null 7 tiene hijos');
    d.layers.splice(d.layers.indexOf(nulo), 1);

    // El export trae start (0–30) y stop (60–90) sin animación
    d.markers = [
        { tm: 0, cm: 'play', dr: ENTRADA_HIMNO, payload: { name: 'play', type: 'pause', order: 1, stop: 'salida' } },
        { tm: 60.0000024438501, cm: 'stop', dr: 1 },
        { tm: ENTRADA_HIMNO, cm: 'salida', dr: -ENTRADA_HIMNO }
    ];
    // Llega con la carpeta (himno nacional\font), no con el archivo
    d.fonts.list[0].fPath = FONT;
    allCaps(d);
    avisarEntrada(d, 'himno nacional');
    save(path.join(REPO, 'himno_nacional/data.json'), d);
}
// ---------------------------------------------------------------- tabla de posiciones
// Pantalla completa: una caja roja con POSICIONES, una blanca con el logo de Meridiano que sube y
// destapa la tabla (8 filas: la barra del equipo, el nombre, JJ, JG, JP y DIF). Las claves son las
// de la tabla de posiciones de LVBP-Venevision (las de IVC en LVBP-Stats), sin AVE, que este diseño
// no tiene: equipo<n>, JJequipo<n>, JGequipo<n>, JPequipo<n>, DIFequipo<n> y, en cada fila, las 8
// barras apiladas, <SIGLAS><n>_opacidad, para que el controlador arme las dos igual.
const ENTRADA_POS = 57; // los nombres terminan de aparecer en el 56
const POS_MARGEN = 8; // px entre el final del nombre y el de la barra
const POS_GRIS = 0.55; // el arriba de la columna de los números (el export, blanco)
const POS_DEGRADADO_EXPORT = [0, 0.294, 0.294, 0.294, 0, 0.647, 0.647, 0.647, 0, 1, 1, 1, 0.466, 0.5, 0.5, 0.5, 1, 0, 0, 0];
const POS_COLUMNAS = { JUEGOSJUGADOS: 'JJ', JUEGOSGANADOS: 'JG', JUEGOSPERDIDOS: 'JP', JUEGOSDIFERENCIA: 'DIF' };
const POS_EQUIPOS = { AGUILAS: 'AGUI', BRAVOS: 'BRAVOS', CARDENALES: 'CARD', CARIBES: 'ANZ', LEONES: 'LEO', MAGALLANES: 'MAGA', TIBURONES: 'TIBUS', TIGRES: 'TIGRES' };
if (hay('TABLA DE POSICIONES')) {
    const d = load(path.join(SRC, 'TABLA DE POSICIONES/data.json'));
    const equipos = Object.keys(POS_EQUIPOS);
    const nm = l => (l.nm || '').trim().replace(/^[.,]/, '');

    // Las barras de los equipos (imágenes) y los nombres (textos) llegan con el mismo nombre, el
    // del equipo del diseño en cada fila (Águilas arriba … Tigres abajo); la de Tigres, con coma (sin
    // clase).
    const barras = equipos.map(e => {
        const b = d.layers.filter(l => l.ty === 2 && nm(l) === e);
        if (b.length !== 1) throw new Error(`posiciones: barra de ${e}: ${b.length}`);
        return b[0];
    });
    const filas = barras.map(b => b.ks.p.k[1]);
    if (barras.some(b => b.ks.p.a || b.ks.a.a || b.ks.s.a || b.ks.p.k[0] !== barras[0].ks.p.k[0] || b.parent || b.tt || b.td)
        || filas.some((y, i) => i && y <= filas[i - 1])) throw new Error('posiciones: las barras cambiaron');
    // En cada fila van las 8, con su ancla (las imágenes miden 425 o 426 × 65 o 66) y la y de la barra
    // del diseño en esa fila. La del diseño, arriba de la pila; las filas, en el orden del diseño.
    let ind = 100;
    const pilas = filas.map((y, f) => [barras[f], ...barras.filter((_, i) => i !== f)].map(b => {
        const sigla = POS_EQUIPOS[nm(b)];
        const c = clone(b);
        c.ks.p.k[1] = y;
        return Object.assign(c, { nm: `.${sigla}${f + 1}_opacidad`, cl: `${sigla}${f + 1}_opacidad`, ind: freeInd(d, ind++) });
    }));
    const desde = d.layers.indexOf(barras[0]);
    if (barras.some((b, i) => d.layers.indexOf(b) !== desde + i)) throw new Error('posiciones: las barras no están juntas');
    d.layers.splice(desde, barras.length, ...pilas.flat());

    // Los nombres: equipo<n> por fila. La caja llegaba hasta 2 px del final de la barra: termina
    // POS_MARGEN antes.
    const nombres = equipos.map(e => {
        const t = d.layers.filter(l => l.ty === 5 && nm(l) === e);
        if (t.length !== 1) throw new Error(`posiciones: nombre de ${e}: ${t.length}`);
        return t[0];
    }).sort((a, b) => a.ks.p.k[1] - b.ks.p.k[1]);
    const finBarra = barras[0].ks.p.k[0] + Math.min(...barras.map(b => d.assets.find(a => a.id === b.refId).w - b.ks.a.k[0]));
    nombres.forEach((t, i) => {
        Object.assign(t, { nm: `.equipo${i + 1}`, cl: `equipo${i + 1}` });
        const s = t.t.d.k[0].s;
        if (s.j !== 0 || !s.sz) throw new Error('posiciones: los nombres cambiaron');
        s.sz[0] = finBarra - POS_MARGEN - (t.ks.p.k[0] + s.ps[0]);
    });

    // Los números: <columna>equipo<n>. Llegan corridos a ojo hasta 2,4 px en y (JG en la fila 1):
    // cada fila, a la mediana de sus cuatro columnas.
    const numeros = Array.from({ length: 8 }, () => []);
    for (const l of d.layers) {
        const m = nm(l).match(/^(JUEGOS[A-Z]+)POS([1-8])$/);
        if (!m || l.ty !== 5) continue;
        const col = POS_COLUMNAS[m[1]];
        if (!col) throw new Error(`posiciones: columna ${m[1]}`);
        Object.assign(l, { nm: `.${col}equipo${m[2]}`, cl: `${col}equipo${m[2]}` });
        numeros[m[2] - 1].push(l);
    }
    for (const fila of numeros) {
        if (fila.length !== 4) throw new Error('posiciones: faltan números');
        const ys = fila.map(l => l.ks.p.k[1]).sort((a, b) => a - b);
        for (const l of fila) l.ks.p.k[1] = (ys[1] + ys[2]) / 2;
    }

    // El logo de Meridiano tiene de mate la capa 42, que no está (oculta en AE): se veía entero
    // sobre la caja roja (15–28) y sobre la tabla (36–39). Su mate es la caja blanca que sube con
    // él: una copia de FONDO Outlines 4, con su mismo padre.
    const logo = layer(d, '2024-Logo-MeridianoTV-original (6).png');
    if (logo.tp !== 42 || d.layers.some(l => l.ind === 42)) throw new Error('posiciones: el mate del logo cambió');
    Object.assign(logo, { nm: '.logomeridiano', cl: 'logomeridiano' });
    const mate = Object.assign(clone(layer(d, 'FONDO Outlines 4')), { nm: 'mate logomeridiano', ind: 42, ip: logo.ip, op: logo.op, td: 1 });
    delete mate.tt;
    delete mate.tp;
    d.layers.splice(d.layers.indexOf(logo), 0, mate);

    // La columna de los números llega con un degradado de blanco (arriba) a negro, y los números
    // son blancos: en las filas 1 y 2 casi no se leían. Arranca en gris (POS_GRIS) y baja a la
    // mitad en el mismo punto del export (Leon, 2026-10-28, entre ése y 0.45).
    const columna = layer(d, 'BASE/TABLA DE POSICIONES Outlines').shapes.find(g => g.nm === 'Group 40');
    const degradado = columna && columna.it.find(i => i.ty === 'gf');
    if (!degradado || JSON.stringify(degradado.g.k.k) !== JSON.stringify(POS_DEGRADADO_EXPORT)) throw new Error('posiciones: el degradado de los números cambió');
    const g = POS_GRIS, m = POS_GRIS / 2;
    degradado.g.k.k = [0, g, g, g, 0, g, g, g, 0, g, g, g, 0.466, m, m, m, 1, 0, 0, 0];

    // Los textos fijos, con clase como los de score: POSICIONES (la caja roja de la entrada), el
    // título de la tabla y los rótulos de las columnas (un solo texto, con espacios).
    rename(d, 'POSICIONES', 'titulo_entrada');
    rename(d, 'tabla de posiciones', 'titulo');
    rename(d, 'jj                 jg                  jp                dif', 'columnas');

    // El export trae start (0–30) y stop (90–120) sin animación
    d.markers = [
        { tm: 0, cm: 'play', dr: ENTRADA_POS, payload: { name: 'play', type: 'pause', order: 1, stop: 'salida' } },
        { tm: 90.0000036657751, cm: 'stop', dr: 1 },
        { tm: ENTRADA_POS, cm: 'salida', dr: -ENTRADA_POS }
    ];
    d.fonts.list[0].fPath = FONT; // llega con la carpeta
    allCaps(d);
    avisarEntrada(d, 'posiciones');
    save(path.join(REPO, 'posiciones/data.json'), d);
}
console.log('ok');
