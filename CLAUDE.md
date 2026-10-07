# CLAUDE.md

Base de templates HTML para gráficos Lottie en CasparCG (webcg-framework).

## Este repo: LVBP para Meridiano TV

Nueve gráficos en League Gothic (cada carpeta trae su `font/`; `fPath` = `font/LeagueGothic-Regular.otf`).
Las keys del UPDATE de cada uno están en su `data.md`.

| Carpeta | Qué es | Flujo | Salida |
|---|---|---|---|
| `score/` | Pizarra: escudos, carreras, inning, conteo, outs, bases y barra de bateador/lanzador | `play` (0–106) → stages `marcador` → `jugadores` → `sinjugadores`, los tres `pause` | `salida`: la entrada al revés (3,5 s); desde `jugadores`, `salida_jugadores` baja antes la barra (4,5 s) |
| `defensiva/` | Campo con las 9 posiciones, escudo y nombre del equipo, línea de información. Grande, al centro: el cambio que pidió el canal | stage `play` pause (0–104) | `salida`: la entrada al revés (3,5 s) |
| `defensiva_lateral/` | La defensiva original: el mismo gráfico, más chico y a la derecha. El canal quiere tener las dos; mismas claves que `defensiva` | stage `play` pause (0–78) | `salida`: la entrada al revés (2,6 s) |
| `lanzador/` | Tabla del lanzador: escudo, nombre, mano, temporada y 6 estadísticas | stage `play` pause (0–35) | `salida`: la entrada al revés (1,2 s) |
| `bateador/` | Barra baja del bateador: escudo, número, posición, nombre, 4 estadísticas y temporada | stage `play` pause (0–36) | `salida`: la entrada al revés (1,2 s) |
| `bateador_informacion/` | La misma barra con una línea de texto libre (`texto`) en lugar de las estadísticas; el uso todavía no está definido | stage `play` pause (0–36) | `salida`: la entrada al revés (1,2 s) |
| `ofensiva/` | Lineup: escudo y nombre del equipo, 9 filas (posición, jugador, valor) y línea de información. Va arriba del score, en la misma columna | stage `play` pause (0–41) | `salida`: la entrada al revés (1,4 s) |
| `3enlinea/` | Los próximos tres bateadores (nombre y valor) y la publicidad a la derecha (`publicidad`, una imagen). Va arriba del score, en el mismo lugar que `ofensiva` | stage `play` pause (0–59) | `salida`: la entrada al revés (2 s) |
| `parcial/` | Score de fin de inning: escudos, C H E de los dos equipos, inning con su flecha, los tres bateadores del próximo inning y la publicidad (`publicidad`, una imagen). Abajo al centro, a la izquierda del score | stage `play` pause (0–32) | `salida`: la entrada al revés (1,1 s) |

Cómo se ve cada uno, en [capturas/](capturas/): `<gráfico>.png` es la pantalla completa con data de
ejemplo (muestra dónde cae en el cuadro) y `<gráfico>_equipos.png`, todos los equipos (en `score`,
los 56 cruces `visita_vs_local`, igual que en `parcial`; `3enlinea` no tiene equipos: `3enlinea_publicidad.png` muestra la
publicidad vacía, con logos de distintas proporciones y con una ruta que no carga). Son de v0.0.7
(las de `ofensiva`, de v0.0.9; las de `defensiva_lateral` y `3enlinea`, del 2026-10-06; las de
`parcial`, del 2026-10-07): si un
gráfico cambia, hay que regenerarlas. No entran al zip (`.gitattributes`).

Textos: salen en mayúsculas aunque lleguen en minúsculas (ver *Mayúsculas* en Convenciones del
Lottie). En `ofensiva` los nombres van como `NOMBRE APELLIDO` hasta 18 caracteres y como
`N. APELLIDO` si pasan de eso: más largos encogen a la vista (21 caracteres, un 20 %). En
`3enlinea` el mismo formato entra siempre al tamaño del diseño (el lugar alcanza para unos 25).

Video de referencia del diseñador: `GRAPHICS FINAL LISTO.mp4` (2026-10-04, 23,976 fps, en Descargas
del usuario), con todos los gráficos al aire. Ahí score y defensiva son la versión **original**: una
diferencia con lo nuestro puede ser un cambio decidido después, no un error. Lo que confirmó: todas las
salidas son la entrada al revés (score incluido). Muestra tres gráficos que todavía no llegaron:
JUEGO DE HOY, PREVENIDO y LINESCORE / SCORE FINAL (los dos últimos con logo de Gatorade, como
`3enlinea` y `parcial`). El PARCIAL del video es una versión anterior: sin la columna de los
próximos bateadores y con la flecha del inning amarilla. Pendiente con el diseñador: en lanzador y bateador el video es otra revisión
(encabezado del lanzador corrido, "TEMPORADA" espaciado, nombre del bateador más grande y sin el
triángulo amarillo). En `ofensiva` la línea de información va centrada, como en el video.

Escudos: en las dos defensivas, `ofensiva`, `lanzador` y las dos barras de bateador son
`AGUI/ANZ/BRAVOS/CARD/LEO/MAGA/TIBUS/TIGRES_opacidad` y arrancan ocultos por CSS en `index.html`
(en `ofensiva` cada escudo trae el color del encabezado); en `score` y `parcial` son
`<SIGLAS>LOCAL_opacidad` y `<SIGLAS>VISITA_opacidad`, arrancan visibles y el controlador apaga los
que no van. `parcial` usa a propósito las mismas claves que `score` (escudos, `inning`, flechas y
carreras), y arranca igual: el controlador puede mandarle la misma data.

Estadísticas: en `lanzador` y `bateador` los casilleros son genéricos, `etiquetaN` (rótulo) y
`valorN` (número), para poner cualquier estadística en cualquiera. Todas las cajas de rótulo tienen
el mismo ancho, y las de valor también, para que cualquier texto entre en cualquier casillero. En
`ofensiva` y `3enlinea`, `valorN` es la columna sin rótulo de cada fila (el diseño muestra el
average).

Publicidad: en `3enlinea` y `parcial` el cuadro de la derecha es la capa de imagen `publicidad`
(107 × 110 y 217 × 168). El cliente manda la ruta del logo y entra entero, de cualquier proporción (ver *Reemplazo de
imágenes*). Por defecto es `images/publicidad.png`, transparente: sin logo no sale nada. El
diseñador la mandó primero como un rectángulo verde de forma y después como un PNG verde: si otro
gráfico con Gatorade llega con el rectángulo, se puede convertir en `prep.js` en una capa de imagen
como esta, sin pedírselo.

⚠ Las dos barras de bateador y `parcial` llevan la clase `titulo` en **dos capas a propósito**: son las dos mitades de la cortina
de entrada (en `parcial`, la cortina antes y después de que se abra el panel), y así una sola clave
cambia el título (`AL BATE`, `PREVENIDO`…). El audit del editor lo
marca como clase duplicada: es esperado, no "arreglarlo".

### Cuando llega un export nuevo del diseñador

Cada export de AE trae los nombres crudos y hay que repetir la preparación. Buscar las capas por
`nm` (los índices cambian) y comparar contra `git show HEAD:<carpeta>/data.json`:

- **Clases:** las de la versión publicada. El logo llega siempre como `png` (es `logomeridiano`).
  Ya se repitieron: en `score`, `nlanxamientos`, `INININGabajo/arriba` sin `_opacidad`,
  `outs`/`lvbp`/`meridiano televisión` sin punto y `SEGUNDOOUT_opacidad` con un `\n`; en
  `defensiva`, `.lanzador 2` (es `catcher`), `equiponombre_opacidad` (es `equipo`) y los escudos
  como `*VISITA`/`*EFENSIVA`. Las estadísticas llegan con nombres por estadística
  (`juegoslanzados`/`numerosjuegoslanzados`, `average`/`numeroaverage`…): pasan a
  `etiquetaN`/`valorN`. En las barras de bateador, `al bate` y `al bate 2` pasan las dos a
  `titulo`, y `leadinbarrainformacion` (el triángulo amarillo) pierde la clase: no es una clave.
  En `bateador_informacion` la línea libre llega como `numeroaverage` (quedó de la otra barra):
  pasa a `texto`. En `ofensiva`, `NOMBREEQUIPO` pasa a `equipo` (como en defensiva),
  `ofensiva 4`/`ofensiva 3` a `titulo`/`titulo_entrada`, `POSICIONn` a `posicionN` y `averagejN`
  a `valorN`; `numeros` (los turnos 1–9, fijos) llega sin clase y se le pone, como a los textos
  fijos de `score`. En `3enlinea`, `PREVENIDOn` y `AVERAGEn` pasan a `jugadorN`/`valorN` (como en
  ofensiva), `3 EN LíNEA`/`3 en linea` a `titulo`/`titulo_entrada` (la cortina llega sin la tilde
  y se le pone) y la imagen `PUBLICIDAD 3 EN LINEA.png` (clase `png`) a `publicidad`, con el asset
  en `images/publicidad.png` (transparente: el `img_0.png` del export es el relleno verde y no se
  copia) y `pr` meet. Sale el texto de la versión del video (`JOSÉ RONDÓN…`, clase `300 256 167`),
  tapado por su máscara `mask6`. En `parcial` (el zip es `score parcial`), las claves de `score`
  donde dicen lo mismo: `numeroinning` a `inning`, `inningarriba`/`inningabajo` a
  `INNINGarriba_opacidad`/`INNINGabajo_opacidad`, `carrerasvisita`/`carreraslocal` a
  `CARRERASVISITA`/`CARRERASLOCAL` (hits y errores, en el mismo estilo) y los escudos `TIBU` a
  `TIBUS`, `AGUIDEFENSIVA` a `AGUIVISITA` y `LEEO` a `LEO`. `parcial` y `parcial 2` pasan los dos a
  `titulo`; `a.monasterios`/`c.rodriguez`/`j.martinez` (clases `monasterios`…) a `jugador1–3`; y
  `3enlineaproxinning` (clase inválida) a `titulo_jugadores`, sin la tilde: el acento se sale de la
  barra. La publicidad, como en `3enlinea` (`publicidad()` en `prep.js`).
- **Colores:** en `lanzador` el export trae `BASE BLANCA` y `BASE ROJA` con el mismo degradado
  naranja. La tabla va blanca y roja para todos los equipos (confirmado por el diseñador): se les
  copia el degradado de la cortina de entrada (`Shape Layer 2` el blanco, `Shape Layer 1` el rojo).
- **All Caps:** `ca: 1` en todas las capas de texto, que es lo que `index.js` mira para pasar a
  mayúsculas. Llegó apagado en `ofensiva` (nombres, valores e información) y en el `titulo` de
  `defensiva` y `lanzador`: `prep.js` lo prende y el lint lo controla. Lottie tampoco lo aplica
  al texto por defecto: `prep.js` lo pasa a mayúsculas (`3enlinea` traía `3 EN LíNEA`) y el lint
  también lo controla.
- **Capas ocultas en AE** no se exportan (quedan `ind` salteados): `TIBUSVISITA` y su máscara en
  `score`, `AGUI` y su máscara en `lanzador`. Se trasplantan de la versión publicada.
- **Markers:** los del diseñador (`start`, `loop`, `hold`…) se reemplazan por los de la tabla de
  arriba. Si cambia la duración de la entrada, `play` y `salida` van al último keyframe real, no
  al `start` del diseñador.
- **Textos de caja propios** ([textos-de-caja.md](textos-de-caja.md)): en `lanzador`,
  `informacionbarranegra` (centrada en la barra), el ancho de `nombrelanzador` (222, no 230) y las
  cajas de estadísticas igualadas (rótulos 71.75, valores 87.5); en las dos barras de bateador,
  el ancho de `nombrejugador` (260, no 275.4); en `ofensiva`, `informacion` centrada en la barra y
  con `lh` 26.4 (el export trae 0.01), `jugadorN` a 183 y `valorN` a 40.6 (el export trae 222 en
  las dos columnas, una encima de la otra); en `3enlinea`, las cajas del export tal cual, con `lh`
  30 (traen 0.01); en `parcial`, `jugadorN` a 191 (no 202) y el `inning` sin tracking (traía el
  1600 del "C H E": un 10 se abría en dos). Los anchos de nombre dejan el mismo aire a los dos lados.
- **`defensiva_lateral`** no está en `prep.js`: es el export del 2026-09-26 ya preparado
  (`git show 0fd3d66:defensiva/`), con el All Caps prendido y `play`/`salida` en el 78 (ahí termina
  la entrada; el export la pausaba en el 90). Si el diseñador la vuelve a exportar, es la receta
  de `defensiva` tal cual (mismas clases; el arreglo de la barra de LF ahí no cambia nada) con
  `play`/`salida` al último keyframe real.

### QA

- Juzgar con el runtime real y la fuente cargada (`<carpeta>/index.html` en el browser o con
  Playwright). `lottie_render` del editor usa una fuente de reemplazo: los textos parten en dos y
  se separan, no sirve para revisar textos.
- Todos los equipos (en `score`, los 56 cruces visita × local), entrada frame a frame, data al
  aire con el gráfico pausado, `next` y `stop` desde cada stage, y que el layer se suelte.
- Textos: nombres largos (que encojan dentro de su lugar) y textos en minúsculas (que salgan en
  mayúsculas).
- Imágenes: logos de otra proporción, `""` y una ruta que no existe (que quede vacía, sin el ícono
  de imagen rota).

### Herramientas

En [herramientas/](herramientas/), fuera del zip. Los scripts de render necesitan un server estático
en la raíz del repo (`python3 -m http.server 5510`) y el Playwright del Lottie Layer Editor (o
`PLAYWRIGHT=<ruta a index.mjs>`).

| Script | Para qué |
|---|---|
| `prep.js` | La receta de arriba, ejecutable: prepara los exports del diseñador. Instrucciones en su encabezado |
| `shot.mjs` | Frames de un gráfico con data: `node herramientas/shot.mjs <url> <salida> '<json>' <frames> [x,y,w,h]`; `JSON=<archivo>` sirve otro data.json para comparar versiones |
| `matrix.mjs` | Muchas variantes de data en una carga (todos los equipos…), con reporte de textos y consola |
| `onair.mjs` | Un flujo al aire (update, play, next, stop) con capturas en cada paso |
| `lifecycle.mjs` | Tiempos de play → pausa → stop → salida, y que el layer se suelte |
| `sheet.py` | Hojas de contacto con etiqueta (así se arman las de `capturas/`) |
| `lint.py` | Chequeo estructural de todos los gráficos |
| `dump.py`, `kf.py`, `deepdiff.py` | Analizar un export: capas, keyframes y diferencias contra lo publicado |

Para comparar con un video del diseñador: `ffmpeg -i video.mp4 -vf fps=29.97 frames/%05d.png` y
renderizar los mismos momentos con `shot.mjs`.

## Modelo del proyecto

El root contiene los **archivos compartidos** que todos los gráficos consumen vía `../`:

- [index.js](index.js) — lógica principal de todos los gráficos (NO se modifica salvo bug fix general)
- [lottie.js](lottie.js) — librería Lottie
- [webcg-framework.umd.js](webcg-framework.umd.js) — runtime de CasparCG webcg
- [webcg-devtools.umd.js](webcg-devtools.umd.js) — devtools para testear localmente con UI gráfica
- [index.html](index.html) — plantilla de referencia, se copia en cada gráfico
- [.gitattributes](.gitattributes) — qué NO entra al zip del release. Viaja a cada repo derivado, ver "Deploy"

Cada gráfico vive en una **subcarpeta hermana** con su `MiAnim.json` y un `index.html` propio que apunta a `../index.js`, `../lottie.js`, `../webcg-framework.umd.js`. Si un gráfico necesita lógica muy particular, se copia el `index.js` localmente y se edita ahí.

## Convenciones del Lottie

El nombre de la capa en AE → clase CSS del SVG renderizado. Es el contrato entre el Lottie y el `index.js`.

**Capas de texto reemplazables:** la key del data de CasparCG debe matchear el nombre de la capa.

**Texto que puede no entrar** (una fecha, un número, un nombre): pasarlo a **texto de caja**
—`sz` + `ps` en `t.d.k[i].s`— para que encoja en vez de salirse. `index.js` ya llama a
`canResizeFont(true)`. Se hace a mano en el JSON y, siguiendo la receta, queda idéntico al
píxel con el texto del diseño: [textos-de-caja.md](textos-de-caja.md).

**Mayúsculas:** Lottie no aplica el All Caps de After Effects (`ca: 1` en `t.d.k[i].s`): un texto
que llega en minúsculas saldría en minúsculas aunque en AE la capa se vea en mayúsculas.
`index.js` pasa a mayúsculas el texto del UPDATE en las capas que lo tienen; en las que no, lo deja
como llega.

**Capas reservadas (clase obligatoria):**
- `time` → reloj automático
- `date` → fecha automática

**Keys reservadas en data (matching por substring, case-insensitive):**
- cualquier key que contenga `color` → cambia el `fill` CSS de `.{key}`
- cualquier key que contenga `opacidad` → cambia el `opacity` CSS de `.{key}`

⚠ **El nombre de la capa tiene que ser un identificador CSS válido.** Se interpola en un
selector de clase, así que no puede tener espacios ni arrancar con dígito. `Logo induveca 4`
no funciona: Lottie escribe `cl` al atributo `class` y eso son en realidad tres clases
sueltas (`Logo`, `induveca`, `4`), con lo cual ningún selector la alcanza. Peor: sin la
guarda de `classSelector()` el selector inválido tira `DOMException` y —como color y opacidad
corren sincrónicos dentro del handler de `data`— se lleva puesto el **UPDATE entero**, no sólo
esa capa. `classSelector()` degrada eso a "no encontrado", pero el arreglo de fondo es
renombrar. El audit del Lottie Layer Editor lo reporta como `invalid-class`.

## Markers

Los markers se generan a mano o con una tool externa, no desde AE.

`index.js` pre-procesa el JSON antes de pasárselo a Lottie: si un marker tiene un campo `payload` que es **objeto**, lo serializa a `cm` por debajo (`m.cm = JSON.stringify(m.payload)`). Esto permite **dos formas equivalentes** de declarar markers:

- **Forma limpia (recomendada):** `payload` como objeto, `cm` opcional (puede llevar el nombre o ser ignorado).
- **Forma compacta:** todo va serializado dentro de `cm` (la usaba la versión anterior).

Lottie en runtime siempre reconstruye `marker.payload` parseando el `cm` final — primero intenta `JSON.parse(cm)`, después `key:value\r\nkey:value`, y como fallback `{name: cm}`. Lo que recibe `index.js` desde `anim.markers` es siempre `payload` ya armado.

### Markers básicos (regulares)

`cm` es solo el nombre. Lottie produce `payload = {name: cm}`.

```json
{ "tm": 0, "dr": 300, "cm": "play" }
```

Markers reservados por nombre (invocados desde CasparCG o usados internamente):
- `play` — entrada (CALL `play`)
- `stop` — salida (CALL `stop`)
- `bola1`..`bola6` — usados por handlers custom `entrada1`..`entrada6` (gráfico de bingo/lotería)

Cualquier otro marker regular puede invocarse vía `playAnimation <name>` o referenciarse desde un stage como su `update`.

### Stage markers

Definen segmentos del flujo donde el operador puede pausar/loopear y avanzar.

**Forma limpia (recomendada):**

```json
{ "tm": 0, "dr": 300, "cm": "play", "payload": { "name": "play", "type": "pause", "order": 1, "update": "update" } }
```

**Forma compacta (equivalente, retrocompatible):**

```json
{ "tm": 0, "dr": 300, "cm": "{\"name\":\"play\",\"type\":\"pause\",\"order\":1,\"update\":\"update\"}" }
```

Las dos formas producen el mismo `marker.payload` en runtime.

| Campo del payload | Valores | Notas |
|---|---|---|
| `name` | string libre | Identificador. Usado para `goto <name>` desde CasparCG y para `goToAndPlay` interno |
| `type` | `"loop"` o `"pause"` | Comportamiento al final del segmento |
| `order` | `1`, `2`, `3`, ... | Orden secuencial para el evento `next`. Único entre stages |
| `update` | `"<markerName>"` (opcional) | Marker que se reproduce cuando llega data en este stage. Si no está, fallback al marker global `update` (si existe). Si tampoco, silent replacement |
| `updateDelay` | número (opcional) | Frames a esperar dentro del update segment antes de aplicar text replacement. Default `0` |
| `stop` | `"<markerName>"` (opcional) | Marker que se reproduce cuando llega `stop` mientras este stage está activo. Self-contained (`playSegments` sobre `tm → tm+dr`). Si no está o el marker no existe, fallback al marker global `stop` |

**Comportamiento de stages:**

Ambos tipos usan el segmento `tm → tm + dr` simétricamente. Lo que cambia es qué pasa al final:
- `loop`: salta de vuelta a `tm` (loopea)
- `pause`: ejecuta `anim.pause()` y queda detenido. Para pausar exacto en `tm`, `dr: 0`

Pauses y loops se pueden mezclar libremente en el mismo gráfico.

**Comportamiento del `update`:**

El update marker solo se dispara si **la animación está pausada** cuando llega la data. Si está reproduciéndose (loop, transición entre stages, o un update ya en curso), se hace silent replacement — el próximo frame ya muestra el cambio.

Cuando llega data y `anim.isPaused === true`, `index.js` resuelve el update marker en este orden:
1. **Dentro de un stage:** stage.update si existe, else marker global `update` como fallback. Reproducción con `goToAndPlay` — la pause action del stage corta al final del segmento del stage
2. **Sin stage activo (gráfico sin stages, o pausado entre stages):** marker global `update`. Reproducción con `playSegments([tm, tm+dr])` — aislado al segmento del marker, no continúa al resto del timeline
3. **Si no hay update aplicable:** silent replacement + `renderFrame()` para repintar el frame congelado

Cuando hay update marker resuelto, text/color/image replacement se aplica a `framesMilliseconds * updateDelay` (el delay viene del stage; en modo sin stage, default 0).

Implicación práctica: un loop nunca se interrumpe por data, aunque tenga `update` definido en el payload (el campo se ignora silenciosamente porque el loop está siempre playing). Si querés interrumpir un loop visualmente al cambiar data, usá un stage `pause` en su lugar.

Un mismo update marker puede ser referenciado por múltiples stages, o servir como fallback global.

**Comportamiento del `stop` custom:**

Cuando llega el evento `stop` desde CasparCG:
1. Si el stage actual tiene `stop: "<name>"` y existe ese marker → reproduce solo el segmento `tm → tm+dr` con `playSegments` (queda en el último frame, sin pasar al resto del timeline)
2. Si no → reproduce el marker global `stop` con `goToAndPlay` (comportamiento de toda la vida, plays forward hasta `op`)

Útil para gráficos donde la salida visual depende del estado actual (ej. cada stage tiene su propia animación de cierre).

## Eventos de CasparCG

| Evento | Comportamiento |
|---|---|
| `play` | Arranca, reproduce el segmento `play`, activa state machine de stages |
| `stop` | Reproduce el segmento `stop`, resetea state |
| `next` | Salta al siguiente stage por `order` usando `goToAndPlay(<nombre>)`. Si no hay siguiente, warn y no-op. Funciona igual en pause y loop |
| `goto <name>` | Salta al stage con ese nombre |
| `playAnimation <name>` | Salta a cualquier marker (no necesariamente stage) |
| `data {...}` | Reemplaza textos/colores/opacidad/imágenes; dispara update marker si el stage actual lo define |
| `entrada1..6` | Custom: salta a markers `bola1..bola6` |
| `startclock` / `stopclock` | Control manual del reloj automático |

### ⚠ El contrato de salida — `window.remove()`

**`stop` no termina cuando termina la animación: termina cuando el gráfico suelta el
layer.** Lo hace `index.js` solo, en `releaseLayer()`; ningún gráfico escribe la llamada.

Por qué hace falta, medido contra **CasparCG 2.6.0** el 2026-08-13:

- `CG STOP` es literalmente `producer->call("stop()")` — una llamada JS a una página que el
  servidor no introspecciona. **CasparCG no se entera de que el template paró.**
- Después de un `CG STOP` el layer sigue reportando `producer=html` con el mismo
  `file/path`, indefinidamente. `INFO <ch>-<layer>` devuelve un XML **idéntico byte a
  byte** antes y después, y `CG INFO` ni siquiera existe (`400 ERROR`).
- `window.remove()` —que CasparCG inyecta en toda página— cierra el navegador y vacía el
  estado del productor: el servidor **deja de publicar `foreground/file/path` a los 43 ms**.
  Esa ausencia es la única señal con la que un controlador puede saber que el layer quedó
  libre.

Consecuencia práctica: un gráfico que no suelta el layer se queda cargado aunque no se vea,
y en un controlador con **layer compartido** —varios gráficos por el mismo layer, que es el
caso de ZFX La Suerte— eso deja al operador sin saber qué hay al aire.

Cómo se cumple:

| Pieza | Qué hace |
|---|---|
| `webcg.on('stop')` | Levanta `exiting` y arma el respaldo de `EXIT_FALLBACK_MS` (5 s) |
| `completeHandler()` | Primera rama: si `exiting`, suelta el layer. Va primero a propósito |
| `releaseLayer()` | Llama a `window.remove()` si existe; fuera de CasparCG deja un `console.info` |
| `cancelExit()` | `play` / `next` / `goto` cancelan la salida: volver al aire antes de que termine la animación **no** suelta el layer |

⚠ El respaldo de 5 s existe porque **sin marcador `stop` el evento `complete` no llega
nunca**, y sin él el layer se quedaría ocupado para siempre. Es una red para un gráfico
roto, no un plazo para uno que funciona.

⚠ **`remove` es nombre global reservado.** Un gráfico que declare su propia
`function remove()` pisa la que inyecta CasparCG: deja de soltarse el layer **y** se rompe
`CG REMOVE`.

**Prueba de salida** — todo gráfico nuevo la pasa antes de publicarse: ponerlo al aire,
mandarle `stop`, y comprobar que el controlador ve el layer libre solo, sin forzar nada. Si
hay que forzarlo, el gráfico no está terminado.

### Invocación directa de stages (shortcut)

Cada stage marker queda expuesto como función global en `window`, así que desde CasparCG se puede invocar directo en vez de pasar por `goto`.

Sintaxis CasparCG: `CG <channel>-<videoLayer> INVOKE <cg_layer> "<method>"` — en este setup `cg_layer` siempre es `1`.

```
CG 1-10 INVOKE 1 "intro()"       # equivalente a INVOKE 1 "goto('intro')"
```

Reglas:
- Solo aplica a stages (markers con `type` y `order`). Markers regulares siguen vía `playAnimation`.
- No se exponen los nombres reservados: `play`, `stop`, `next`, `update`, `goto`, `playAnimation`, `startclock`, `stopclock`.
- Nombres que no son identificadores JS válidos (espacios, guiones, empieza con dígito) se saltean con warning — usar `goto('<name>')` en ese caso.
- Si el nombre colisiona con un global existente (ej. un stage llamado `anim`), se saltea con warning.
- Los `()` son obligatorios — `INVOKE 1 "intro"` solo lee la referencia, no la ejecuta.

## Reemplazo de imágenes

Si una capa con clase (`cl`) tiene `refId` que incluye `image`, `index.js` reemplaza el `href` del `<image>` SVG con el valor del data.

Si la ruta no carga (mal escrita, o el archivo no está), la imagen queda vacía: sin eso, el navegador
muestra al aire su ícono de imagen rota. `""` también la deja vacía.

Lottie dibuja la imagen en el tamaño del asset (`w` × `h`) y por defecto recorta (`xMidYMid slice`)
una de otra proporción. Para un logo que tiene que entrar entero, `"pr": "xMidYMid meet"` en el
asset: así está `publicidad` en `3enlinea`.

## Audio

Para SFX one-shot por entrada (uno o varios clips):
1. Agregar un `<audio id="sfx_<i>" src="../audio/aud_<i>.mp3" preload="auto">` por clip en `<head>` (índice 0-based)
2. Definir `let audio_clips = [{ src: '../audio/aud_0.mp3', inframe: 5 }, ...]` antes de cargar `../index.js`

Cada clip se dispara una vez al cruzar su `inframe`; todos los flags se resetean en cada `play`. El `src` en `audio_clips` es informativo (el `<audio id="sfx_<i>">` es el que efectivamente se reproduce).

## Reloj/fecha

- `window.ENABLE_CLOCK = true` antes de cargar `../index.js` para arrancar al cargar
- `window.CLOCK_SECONDS = true` para incluir segundos (intervalo 1s vs 60s alineado al minuto)
- Control manual: CALL `startclock` / `stopclock` (stop deja los textos vacíos)
- Formato: `time` → `02:45 PM` en-US, `date` → `dd/mm/yyyy` es-DO

## Testeo local

Cada `<gráfico>/index.html` carga `../webcg-devtools.umd.js` —una UI de control en el browser— cuando se abre en el puerto 5500, el de Live Server de VSCode, o en cualquier puerto con `?debug=true` en la URL (ej. `python3 -m http.server 5510` y `http://localhost:5510/lanzador/index.html?debug=true`). El panel acepta el payload en modo JSON. Sin panel, desde la consola: `play()`, `update('{"clave":"valor"}')`, `next()`, `stop()`.

## Releases

Tags semver gestionados con [release.sh](release.sh) + `gh release create`:
- `./release.sh` → patch estable
- `./release.sh minor` / `major`
- `./release.sh patch pre` → pre-release `vX.Y.Z-pre.N`

Tasks de VSCode en [.vscode/tasks.json](.vscode/tasks.json) cubren Mac y Windows (Git Bash).

**No correr `release.sh` sin pedir confirmación** — crea release público en GitHub.

Antes de `release.sh`, `git fetch --tags`: `gh release create` crea el tag sólo en GitHub y
`release.sh` calcula la versión con los tags locales, así que sin traerlos repite una que ya existe.

## Deploy: qué entra al zip del release

El artefacto que se copia al server de playout es el **"Source code (zip)"** que GitHub genera del tag — `release.sh` no empaqueta nada, sólo taggea. Lo único que controla el contenido de ese zip es [.gitattributes](.gitattributes) con `export-ignore`. El porqué de cada línea, las cinco trampas del mecanismo y los ejemplos están en el README, sección "Qué entra al zip de un Release". Acá van las reglas de uso.

### Este repo es la plantilla: el `.gitattributes` viaja a cada paquete derivado

- El bloque genérico (`*.md` menos README, `/.vscode`, `/.claude`, `/release.sh`, `/webcg-devtools.umd.js`, `/samples`) es interno en **cualquier** repo de gráficos. No se toca ni acá ni en el derivado.
- Lo interno de UN proyecto va **sólo** en la sección marcada del final, y en el repo derivado — nunca subirlo al bloque genérico de la plantilla. Si dudás de si algo es genérico o específico, es específico.
- Al arrancar un paquete nuevo desde esta plantilla, la única línea a revisar es `/samples`: si ese repo usa `samples/` para gráficos reales y no para ejemplos, hay que borrarla. Es la única del bloque genérico que puede morder.

### Antes de agregar una exclusión

1. `git ls-files` — sólo lo trackeado puede entrar al zip. Lo que ya está en `.gitignore` no necesita línea (sería decoración).
2. Comprobar que ningún `.html`/`.js` la referencia, sin confiar en un grep literal: hay rutas armadas por concatenación en runtime (así carga `webcg-framework.umd.js` a los devtools) y puede haber diferencias de mayúsculas entre lo que pide el HTML y el nombre real del archivo.
3. Anclar con `/` inicial, y en directorios **sin** barra final. Un patrón suelto matchea en cualquier nivel y se lleva homónimos de otras carpetas.
4. Rutas con tilde o ñ: guardar el patrón en **NFC** (git usa NFC, macOS escribe NFD) o no matchea nunca.

**Nunca excluir un gráfico ni un asset de gráfico** aunque hoy no se use — otra versión del controlador puede invocarlo. Si parece que sobra, preguntar antes de sacarlo.

### Verificar antes de decir que está listo

```bash
git check-attr export-ignore -- README.md <la ruta nueva>
git archive --worktree-attributes --format=zip -o /tmp/t.zip HEAD && unzip -l /tmp/t.zip
```

- `--worktree-attributes` es obligatorio si todavía no commiteaste: `git archive HEAD` lee el `.gitattributes` **del commit**, y sin eso parece que la lista entera no sirve.
- `git check-attr` reporta `unspecified` para archivos dentro de un directorio con `export-ignore`, aunque `git archive` sí saltee el subárbol entero. **Verificar contra el archive real, no contra `check-attr`.**
- Asserts concretos, no "se ve bien": cero entradas que matcheen los patrones excluidos, `README.md` presente y el resto de los `.md` ausente, todos los HTML de entrada dentro con todo lo que cargan, y md5 idéntico worktree↔zip en los archivos CRLF (`index.html`, `webcg-framework.umd.js`) — ese último atrapa una regla `text` metida sin querer.

### Dos límites conocidos, no son bugs

- `export-ignore` sólo aplica al commit que se taggea: los releases ya publicados siguen generando el zip completo, el primero recortado es el próximo tag.
- No es seguridad: lo excluido sigue en la historia del repo y en cualquier clon.

## Cosas que NO hay que hacer

- No modificar `index.js` del root para resolver una necesidad de UN gráfico — copiarlo a la subcarpeta del gráfico y editar ahí.
- No cambiar nombres de markers/clases reservados (`play`, `stop`, `time`, `date`, `bola1..6`) — rompen el contrato con CasparCG y el index.js.
- **No declarar una `function remove()` global** — pisa la `window.remove()` que inyecta CasparCG y con ella el contrato de salida (ver *Eventos de CasparCG*).
- No llamar a `window.remove()` desde un gráfico: lo hace `index.js` al terminar la animación de salida. Llamarla antes corta la salida en seco.
- No reusar nombres de stages — cada `payload.name` debe ser único.
- No repetir `order` entre stages.
- No tocar `lottie.js` ni `webcg-framework.umd.js` (son vendors).
- **No usar `fetch()` para leer archivos del template** (el JSON del Lottie, etc.). CasparCG abre los templates como `file://`, y en **CasparCG 2.3.x** su Chromium rechaza `fetch` sobre ese esquema (`URL scheme "file" is not supported`, visto con LVBP-Stats). En 2.6.0 `fetch` sí funciona (el server unificado de CueCore lo carga sin errores), así que el problema solo aparece en clientes con el server viejo. `index.js` usa `loadJSON()` con `XMLHttpRequest`, que funciona en las dos versiones. Con Live Server (`http://`) los dos funcionan, así que al testear en el browser no se ve.
- No agregar al bloque genérico del `.gitattributes` una exclusión que sea específica de un proyecto — va en la sección marcada del final, y en el repo derivado.
- No meter reglas `text`, `eol` ni `* text=auto` en `.gitattributes` — `index.html` y `webcg-framework.umd.js` están en CRLF y una normalización los reescribe enteros. Ese archivo lleva sólo `export-ignore`.

## Pendiente / a futuro

- **External loops** (`loopExternal` legacy con `loop.json` separado) se eliminó en la reescritura. Si vuelve a hacer falta, se reimplementará con un diseño propio integrado al modelo de stages.
- **`loopDelay`** (frames muertos entre iteraciones de loop) tampoco se migró. Se puede emular agregando frames "muertos" al final del segmento del loop en el Lottie.

---

## Spec completa de markers (referencia para tools)

Esta sección es la fuente de verdad para cualquier tool que genere markers. Documenta exactamente qué soporta el `index.js` actual y qué NO.

### Forma base de cualquier marker

```json
{ "tm": <frame inicio>, "dr": <duración en frames>, "cm": "<string>", "payload": { ... } (opcional) }
```

| Campo | Tipo | Notas |
|---|---|---|
| `tm` | number | Frame absoluto donde arranca el segmento. Obligatorio |
| `dr` | number | Duración del segmento en frames. Obligatorio. Para "punto" usar `0` |
| `cm` | string | Comment field. Si el marker no trae `payload` objeto, este campo se parsea para producir el payload. Obligatorio |
| `payload` | object | Opcional. Si está y es objeto, `index.js` lo serializa a `cm` antes de pasárselo a Lottie. Forma recomendada para stages |

### Cómo `index.js` arma el `payload` final

1. Pre-procesa el JSON antes de cargar: si `marker.payload` es objeto, sobrescribe `marker.cm = JSON.stringify(marker.payload)`.
2. Le pasa el JSON a Lottie como `animationData`.
3. Lottie parsea `cm` para producir el `marker.payload` definitivo:
   - **`JSON.parse(cm)`** — si es JSON válido, `payload = parsed`.
   - **`key:value\r\nkey:value`** — si tiene al menos un `clave: valor` separado por `\r\n`, parsea key/value (valores quedan como strings).
   - **Fallback**: `payload = { name: cm }` — para markers simples cuyo nombre es literalmente el contenido de `cm`.

Resultado neto: emitir `payload: {...}` (forma limpia) y emitir `cm: "{...JSON...}"` (forma compacta) son **equivalentes**.

### Categoría 1: Markers regulares (no-stage)

`payload` es solo `{ name: "..." }`. Se usan para:
- Trigger desde CasparCG por nombre conocido (`play`, `stop`, etc.)
- Target de `playAnimation <name>` desde CasparCG
- Ser referenciados como `update` desde un stage marker

**Forma simple (recomendada para regulars):**
```json
{ "tm": 0, "dr": 100, "cm": "play" }
```

Lottie produce `payload = { name: "play" }`.

**Forma JSON (también válida pero innecesaria para regulars):**
```json
{ "tm": 0, "dr": 100, "cm": "{\"name\":\"play\"}" }
```

#### Nombres reservados (no reusar para otra cosa)

| Nombre | Uso |
|---|---|
| `play` | Disparado por evento `play` desde CasparCG. Puede ser stage. |
| `stop` | Disparado por evento `stop` desde CasparCG. **No** debería ser stage. |
| `bola1`, `bola2`, ..., `bola6` | Disparados por `entrada1`..`entrada6` (custom bingo). |

### Categoría 2: Stage markers

Definen el state machine multi-etapa. Llevan `name`, `type` y `order`.

**Forma limpia (recomendada para tools nuevas):**
```json
{ "tm": 0, "dr": 100, "cm": "play", "payload": { "name": "play", "type": "pause", "order": 1, "update": "update1" } }
```

**Forma compacta (equivalente, retrocompatible):**
```json
{ "tm": 0, "dr": 100, "cm": "{\"name\":\"play\",\"type\":\"pause\",\"order\":1,\"update\":\"update1\"}" }
```

`index.js` acepta cualquiera de las dos. Si `payload` es objeto, lo serializa a `cm` antes de pasárselo a Lottie.

#### Schema del payload

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| `name` | string | Sí | Único entre TODOS los markers (no solo stages). Usado para `goto <name>` y para `goToAndPlay` interno |
| `type` | string | Sí | Exactamente `"loop"` o `"pause"` |
| `order` | number | Sí | Entero positivo. **Único entre stages**, secuencial recomendado (1, 2, 3, ...) |
| `update` | string | No | Nombre de otro marker (regular). Si está, se reproduce ese marker cuando llega data. Si no está, fallback al marker global `update` (si existe) |
| `updateDelay` | number | No | Frames a esperar dentro del update segment antes del text replacement. Default `0` |
| `stop` | string | No | Nombre de otro marker (regular). Si está, se reproduce ese cuando llega `stop` mientras este stage está activo (con `playSegments`, self-contained). Si no está, fallback al marker global `stop` |

#### Comportamiento al final del segmento (`tm + dr`)

- `loop`: salta a `tm` (loopea hasta `next`/`goto`).
- `pause`: ejecuta `anim.pause()` (queda detenido hasta `next`/`goto`).

Para pausar **exacto en `tm`** (sin reproducir un segmento previo), usar `dr: 0`.

#### Stage marker que también es `play`

El marker `play` puede ser un stage. Se invoca normalmente con el evento `play` desde CasparCG, y al terminar el segmento ejecuta el comportamiento de stage. Es el patrón recomendado cuando el primer stage del flujo coincide con la entrada.

```json
{ "tm": 0, "dr": 100, "cm": "play", "payload": { "name": "play", "type": "pause", "order": 1, "update": "update1" } }
```

### Categoría 3: Update markers

Son markers regulares (sin `type`/`order`) que se referencian desde un stage:

```json
{ "tm": 200, "dr": 30, "cm": "update1" }
```

- El `name` debe matchear el campo `update` de algún stage.
- Un mismo update marker puede ser referenciado por varios stages.
- Cuando termina la reproducción, la animación queda en el último frame del segmento (no vuelve al stage marker).

### Reglas de validación que el tool debería enforcear

✅ **Hacer:**
- Generar `tm`, `dr`, `cm` para todo marker
- Para regulars: `cm = "<name>"` (string simple, sin payload)
- Para stages: emitir `payload: { name, type, order, update?, updateDelay? }` como objeto (forma limpia). `cm` puede ser el nombre o irrelevante. Alternativamente `cm = JSON.stringify(payload)` sin campo `payload` (forma compacta) — `index.js` acepta ambas
- `payload.name` único en todo el set de markers
- `payload.order` único entre stages, idealmente secuencial sin huecos
- `dr >= 0` siempre
- Si un stage define `update`, el marker referenciado debe existir
- Asegurarse de incluir al menos el marker `play` y `stop` (no son obligatorios para que el index.js no crashee, pero CasparCG espera poder mandar play/stop)

❌ **NO hacer:**
- No reusar nombres entre markers
- No repetir `order` entre stages
- No usar `type` distinto de `"loop"` o `"pause"`
- No declarar `type` en update markers (los convertiría en stages, lo cual no querés)
- No declarar `update` apuntando a otro stage marker (debería apuntar a uno regular)
- No usar nombres reservados (`stop`, `bola1..6`) como name de stages
- No emitir un `payload` con `cm` también stringificado del mismo payload — usar uno o el otro

### Lo que NO está soportado (pre-eliminado o futuro)

| Feature | Estado | Workaround actual |
|---|---|---|
| `loopExternal: true` (loop en archivo separado) | Eliminado | No hay; pendiente de re-diseño |
| `loopDelay` (frames muertos entre iteraciones de loop) | Eliminado | Agregar frames "muertos" al final del segmento del loop |
| `prev` (navegación hacia atrás) | No implementado | Usar `goto <stageName>` para saltar atrás |
| Multiple updates por stage | No implementado | Un solo `update` por stage |

### Ejemplos completos

**Gráfico simple (entrada con pausa + salida) — forma limpia:**
```json
"markers": [
    { "tm": 0, "dr": 100, "cm": "play", "payload": { "name": "play", "type": "pause", "order": 1, "update": "update1" } },
    { "tm": 200, "dr": 30, "cm": "update1" },
    { "tm": 500, "dr": 100, "cm": "stop" }
]
```

**Gráfico multi-etapa (entrada → loop → pausa → salida) — forma limpia:**
```json
"markers": [
    { "tm": 0, "dr": 50, "cm": "play" },
    { "tm": 50, "dr": 60, "cm": "intro", "payload": { "name": "intro", "type": "loop", "order": 1 } },
    { "tm": 200, "dr": 100, "cm": "detalle", "payload": { "name": "detalle", "type": "pause", "order": 2, "update": "update_detalle" } },
    { "tm": 350, "dr": 40, "cm": "update_detalle" },
    { "tm": 500, "dr": 100, "cm": "stop" }
]
```

**Update marker compartido entre stages — forma limpia:**
```json
"markers": [
    { "tm": 0, "dr": 50, "cm": "play", "payload": { "name": "play", "type": "pause", "order": 1, "update": "fade" } },
    { "tm": 100, "dr": 50, "cm": "detalle", "payload": { "name": "detalle", "type": "pause", "order": 2, "update": "fade" } },
    { "tm": 200, "dr": 30, "cm": "fade" },
    { "tm": 400, "dr": 100, "cm": "stop" }
]
```

**Equivalente compacto (todo en `cm` stringificado):**
```json
"markers": [
    { "tm": 0, "dr": 100, "cm": "{\"name\":\"play\",\"type\":\"pause\",\"order\":1,\"update\":\"update1\"}" },
    { "tm": 200, "dr": 30, "cm": "update1" },
    { "tm": 500, "dr": 100, "cm": "stop" }
]
```
