# Textos de caja — que un texto encoja en vez de salirse

Un texto de Lottie puede ser **de punto** (lo que exporta casi siempre After Effects: crece
hacia un lado sin límite) o **de caja** (tiene ancho y alto). Si es de caja y el texto no
entra, Lottie le baja el cuerpo de 1 en 1 hasta que entra.

Sirve para cualquier capa que el data puede mandar **más larga que el ejemplo del diseño**:
una fecha, un número de sorteo, un nombre. No hace falta en todas — es seguridad extra para
las que pueden crecer.

⚠ **`index.js` ya lo tiene activado.** Llama a `canResizeFont(true)` antes de cada
`updateDocumentData`, tanto en el handler de `data` como en el reloj. Basta con que la capa
sea de caja: no hay que tocar JS.

Se hace **a mano en el JSON**. El Lottie Layer Editor no tiene herramienta para esto, pero
tampoco lo pisa: conserva `sz` y `ps` al guardar (comprobado el 2026-09-12).

---

## La receta

En el documento de texto de la capa —`layer.t.d.k[i].s`, **en cada keyframe** si hay más de
uno— se agregan dos claves:

```json
"sz": [W, H],
"ps": [X, -ascent]
```

| Clave | Valor | De dónde sale |
|---|---|---|
| `ascent` | `fonts.list[<f>].ascent × s / 100` | La fuente de la capa (`f`) y su cuerpo (`s`). Ubuntu a 19 → `77.5986 × 19 / 100 = 14.7437…` |
| `ps[1]` | `-ascent` | Lottie pone la línea base en `ps[1] + ascent`: así queda en 0, donde estaba. |
| `ps[0]` | `0` si `j: 0` (izquierda) · `-W` si `j: 1` (derecha) · `-W/2` si `j: 2` (centro) | Compensa el justificado. **`j` no se toca.** |
| `sz[0]` = `W` | El ancho disponible, **en unidades de la capa** | Píxeles de pantalla ÷ la escala con la que se ve la capa (padres incluidos). |
| `sz[1]` = `H` | Entre `ascent` y `lh + ascent` | Tiene que entrar **una** línea y **no dos**. Con `s 19` y `lh 43`: entre 14,75 y 57,7. |

⚠ **`W` tiene que ser al menos el ancho del texto más largo normal.** Si el texto del diseño
no entra en `W`, parte línea y encoge — y ya no queda igual que antes.

⚠ **Copiá `ascent` con todos los decimales** (`-14.743728637695323`, no `-14.74`). Con eso
la matriz de cada letra sale idéntica, no «casi».

### Variante: un texto que el diseño centró a ojo

Si el diseñador lo centró a mano con `j: 0`, un texto más corto queda corrido a la izquierda. Se
pasa a `j: 2` con `ps[0] = (Lw − W) / 2`, donde `Lw` es el ancho de línea del texto del diseño
medido con la fuente cargada (`textProperty.currentData.lineWidths[0]`). Con eso el texto del
diseño queda en el mismo píxel y cualquier otro se centra sobre el mismo eje. `W` se elige para
que la caja quede dentro de la placa con el margen de siempre. Usado en
`lanzador/informacionbarranegra`.

### Variante: casilleros intercambiables

Cuando cualquier texto puede ir en cualquier casillero (las estadísticas genéricas `etiquetaN` /
`valorN`), todas las cajas del mismo tipo pasan al ancho de la más ancha. Para que el texto del
diseño no se mueva, el borde de anclaje queda fijo: con `j: 0` no se toca `ps[0]`; con `j: 1`,
`ps[0] += Wviejo − Wnuevo`; con `j: 2`, la mitad de eso. Usado en `lanzador` y `bateador`.

### Por qué queda igual — `lottie.js` 5.13.0

- `TextAnimatorProperty.getMeasures` y `ITextElement.applyTextPropertiesToMatrix`: con `ps`,
  cada letra se traslada `(ps[0], ps[1] + ascent)`; sin `ps`, nada. Con `ps[1] = -ascent`
  las dos dan 0.
- `TextProperty.completeTextData`: de punto, el justificado desplaza `-anchoLínea` (derecha)
  o `-anchoLínea/2` (centro); de caja, `ps[0] + W - anchoLínea` o `ps[0] + (W - anchoLínea)/2`.
  Con `ps[0] = -W` o `-W/2` coinciden. Con `j: 0` ninguno desplaza.
- `SVGTextLottieElement.buildNewText`: una capa sin `singleShape` (lo normal en un export)
  se pinta **letra a letra**, un `<text>` por carácter, y ese camino es el mismo para punto
  y para caja. Sólo cambia la matriz.

### Cómo encoge

`completeTextData` recorre el texto y, si una letra se pasa de `W`, **parte línea** (por el
último espacio, o por la letra si no hay: un número largo también parte). Si con eso la
altura supera `H`, baja `finalSize` en 1 y vuelve a probar, hasta que entra en una línea.

---

## ⚠ Lo que hay que saber

- **La caja se ancla arriba.** Al encoger, la línea base **sube**: a 12 px el texto queda
  unos 5 px más alto que a 19. Lottie no tiene alineación vertical; es el precio, y sólo se
  ve en los casos que antes se salían.
- **Sólo encoge si alguien llama a `canResizeFont(true)`.** `index.js` lo hace; otro
  reproductor o un render estático (`lottie_render` del editor) no: ahí un texto que no
  entra **parte en dos líneas** en vez de encoger.
- **El ancho se mide con la fuente cargada** (`measureText`). Con la fuente embebida en el
  JSON no hay carrera; con una fuente externa que tarda en cargar, la medida puede salir mal.
- **`H` sólo impide dos líneas al cuerpo del diseño.** Al encoger, el interlineado también se
  achica: con cuerpo `f`, dos líneas entran si `f × (lh / s + ascentDeLaFuente / 100) ≤ H`. Un
  texto muy largo puede quedar en dos líneas más chicas en vez de seguir encogiendo; cuanto más
  cerca de `ascent` esté `H`, más largo tiene que ser para que pase. Visto en
  `lanzador/nombrelanzador` (caja del diseñador, `H` 43): un nombre de cuatro palabras va en dos
  líneas, uno de dos palabras queda en una.
- **Revisar `lh` en las cajas que trae el diseñador.** Con un `lh` casi 0 (llegó 0.01 en
  `ofensiva/informacion`) dos líneas miden lo mismo que una: un texto largo parte en líneas
  encimadas en vez de encoger. Va el 1.2 del cuerpo; `lh` sólo mueve las líneas que siguen a la
  primera, así que el texto del diseño no cambia.

---

## Cómo comprobar que quedó igual

1. **Medir con el motor**, en el browser: dónde empieza el texto y dónde tiene que terminar
   (el borde de su placa, el siguiente rótulo). La escala de la capa es
   `document.querySelector('g.<clase>').getBoundingClientRect().width` entre
   `anim.renderer.elements[i].textProperty.currentData.lineWidths[0]`.
2. **Aplicar la receta**, dejando un margen (10 px de pantalla va bien).
3. **Comparar píxel a píxel** el gráfico original y el de caja, con el mismo data y en el
   mismo frame —entrada, reposo y salida—. Si hay un solo píxel distinto, `W` es corto o `ps`
   está redondeado. Truco para no tocar el archivo mientras se prueba: con Playwright,
   `page.route('**/MiAnim.json', r => r.fulfill({ body: JSON.stringify(jsonConCajas) }))`.
4. **Probar lo que no entra** y mirarlo: que encoja dentro de su espacio.

## Dónde se probó

`cue-zfx-lasuerte-templates/super6` (2026-09-12): `fecha` y `sorteo`, justificados a la
izquierda. **4 textos × 8 frames, cero píxeles distintos** y la misma matriz en cada letra.
Un sorteo de 8 cifras que antes se salía de su placa pasó a 15 px y quedó adentro. El detalle
y los números están en el `textos-de-caja.md` de ese repo.

`LVBP-Meridiano/lanzador` (2026-10-04): `informacionbarranegra` con la variante centrada, cero
píxeles distintos en 5 frames. `nombrelanzador` con `W` 222 en vez del 230 del diseñador, para dejar
aire antes de la línea divisoria; el texto del diseño, idéntico en 7 frames. Casilleros de
estadísticas igualados: idéntico en 7 frames, y `WHIP` entra sin achicarse en el casillero de `JL`.

`LVBP-Meridiano/bateador` (2026-10-04): `nombrejugador` con `W` 260 en vez de 275.4, el mismo aire
(15 px) a los dos lados del panel; idéntico en 9 frames.

`LVBP-Meridiano/ofensiva` (2026-10-05): cajas del diseñador achicadas, `jugadorN` a 183 (hasta la
línea divisoria) y `valorN` a 40.6 (hasta el borde del panel), con el aire de la izquierda;
`informacion` centrada en la barra y con `lh` corregido. Idéntico en 10 frames salvo
`informacion`, que se movió a propósito. 72 nombres probados: hasta 18 caracteres quedan a 31–32
(el diseño es 32), con 21 bajan a 25.

`LVBP-Meridiano/3enlinea` (2026-10-06): las cajas del diseñador tal cual (el nombre ya deja el mismo
aire a los dos lados y el valor llega hasta la publicidad), sólo con `lh` 30 en vez de 0.01.
Idéntico en 13 frames de la entrada salvo lo que cambió a propósito (la tilde del título y la
publicidad transparente). Hasta 25 caracteres quedan al tamaño del diseño (25); con 27 bajan a 21
y con 32, a 20, en una sola línea.

`LVBP-Meridiano/parcial` (2026-10-07): `jugadorN` con `W` 191 en vez de 202, el mismo aire (17 px) a
los dos lados de la columna, entre la línea divisoria y la publicidad; idéntico en 12 frames. Con
inicial y apellido entran unos 17 caracteres al tamaño del diseño (38); `EDUARDO RODRÍGUEZ` baja a
33. El `inning` (texto de punto, centrado) sin el tracking de 1600: con un dígito queda idéntico y
un 10 queda centrado en el mismo lugar.
