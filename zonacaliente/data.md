# data

> **For AI control agents** — This file describes the controllable interface of the 3D hot zone
> graphic for CasparCG. Use it to understand **what data to send** from a control client.
> Do not use this file to modify the graphic itself: it is a compiled copy of `zonacaliente-mtv/`
> in the `leonedo/3d-gx-poc` repo, and any change goes there (see CLAUDE.md, *Zona caliente 3D*).
>
> This is **not a Lottie graphic**: it is a Three.js scene (WebGL) and it does not load `../index.js`.
> It needs a CasparCG with GPU rendering (`<html><enable-gpu>true</enable-gpu><angle-backend>d3d11</angle-backend></html>`
> in `casparcg.config`, and a 2.6.0 server: the official 2.5.1 on Windows renders transparent with
> `enable-gpu`). Without WebGL the template shows a red notice and the API still answers, so
> CasparCG gets no errors.
>
> **Text values** — sent as strings, shown in capitals whatever the case you send. Numbers are shown
> as they arrive (`32.33% `, `32.33`, `.300` or `0.300`).
> **Images** — the sponsor on the big screen comes from `publicidad.js` next to the template (see
> *Sponsor*), not from a path: under `file://` Chromium does not upload a loose image to WebGL.
> **Methods** — `update`, `play`, `stop`. `next` does nothing (a single stage). No `goto`.

## Example payload

A control client sends a flat JSON object. Any subset of these keys is valid — omit what you don't
need to change; a key that doesn't arrive keeps its last value.

The three keys of IVC's hot zone (`porcentaje1..3`, what LVBP-Stats and cue-qs-beisbol already send)
work **as they are**: left, center, right. Everything else is optional. From the API
(`/api/pelotero-zona-bateo`, one row per `zona_bateo`): `porcentajeN` is `PORTC`, `conexionesN` is
`HIT` (to be confirmed: `HIT` or `TC`), `promedioN` is `AVE`; `conexiones` is the sum of `HIT`
(**without the key, the template adds `conexiones1..3`**; `""` goes back to the sum), `promedio` the
batter's AVE in the period; `jugador` is `nombre` + `apellido`.

```json
{
  "porcentaje1": "32.33% ", "porcentaje2": "41.10% ", "porcentaje3": "26.57% ",
  "conexiones1": "12", "conexiones2": "15", "conexiones3": "10",
  "promedio1": ".300", "promedio2": ".341", "promedio3": ".278",
  "conexiones": "37", "promedio": ".308",
  "jugador": "ALÍ CASTILLO", "subtitulo": "TEMPORADA 2026-27",
  "ancho": 0.5, "inclinacion": 0
}
```

## Keys

| Key | Where it shows | Notes |
|-----|----------------|-------|
| `porcentaje1`, `porcentaje2`, `porcentaje3` | the big number of each card (left, center, right); the height, width and color of its zone | `izquierda` / `centro` / `derecha` also work. A zone without a value stays gray, with no card |
| `conexiones1..3` | the black bar of each card, CONEXIONES | a card without `conexiones` and `promedio` has no black bar (just the percentage), so the three IVC keys alone look fine |
| `promedio1..3` | the black bar of each card, PROMEDIO | |
| `conexiones` | the batter's bar, CONEXIONES | without the key, the sum of `conexiones1..3` |
| `promedio` | the batter's bar, PROMEDIO | without `conexiones` and `promedio`, the bar ends at the red name box |
| `jugador` | the batter's bar, the name | left-aligned, any length: the red box takes the width of the name (`ALEXANDER MONASTERIOS` fits at design size) and the bar stays centered |
| `subtitulo` | the black tab above the bar, e.g. the period (`TEMPORADA 2026-27`) | without `subtitulo` and `titulo` there is no tab |
| `titulo` | optional: goes in the tab, before `subtitulo` (`ZONA DE BATEO · TEMPORADA 2026-27`) | empty by default: no ZONA DE BATEO (Leon, 2026-11-03) |
| `placa` | the layout of the batter's bar: `barra` (default: the Meridiano batter lowbar, chosen by Leon), `ficha` or `tarjeta` | |
| `ancho` | 0 to 1: how much the zone's width follows its percentage | 0.5 by default |
| `inclinacion` | degrees: the camera turns around home plate, rigidly; **+** lays the field down (up to 20), **−** stands it up (down to −10); home plate stays in the same place on screen | 0 is the design shot. An operator setting sent **before `play`** (a slider in the client, −8 to +10. Measured: the big screen fits whole down to −4; from −5 its top edge leaves the frame, and at −8 the top of the logo is cut too). It changes the whole shot, the entry included; not meant to be animated on air |
| `publicidad` | overrides on air the sponsor of `publicidad.js`: `""` takes the sponsor off (the Meridiano logo shows) | an image must come as a `data:` URL (base64), not as a path (see *Sponsor*) |

## Sponsor

By default there is none: the big screen is dark with the Meridiano logo. The sponsor is an
image (PNG, JPG or WebP) in base64 in `publicidad.js`, next to the template, generated in the
`3d-gx-poc` repo with `node tools/publicidad.mjs <logo> ["#fondo"]` (`window.ZONA_PUBLICIDAD =
{ imagen: 'data:image/webp;base64,...', fondo: '#FFFFFF' }`; `null` = no sponsor). The app that
owns the sponsor setting replaces that file; the image is centered whole on the screen, over the
background color. Under `file://` (how CasparCG opens the templates) Chromium refuses to upload a
loose image file to WebGL, which is why it is not a path.

## Animation

| Property | Value |
|----------|-------|
| Size | 1920 × 1080 px, transparent |
| Entry (`play`) | 3.8 s, then it holds: the camera comes in from above (as in the VV one) and comes down to the final shot while the field unfolds, the batter's bar opens, each zone rises and sweeps left to right with its card, the wall rises and the big screen comes up from behind it |
| Exit (`stop`) | the entry in reverse, 25 % faster (3 s); at the end the graphic releases the layer (`window.remove`) |
| `update` on air | replaces silently (the next frame shows the change); the cards re-fit to the new values |
| `next` | nothing (a single stage) |

`update` and `play` sent before the scene has loaded are queued and run when it is ready, in order.
A `stop` mid-entry plays the exit from where it is.

## CasparCG

```
CG 1-20 ADD 0 "LVBP-Meridiano/zonacaliente/index" 0 "<json>"
CG 1-20 PLAY 0
CG 1-20 UPDATE 0 "{\"porcentaje2\":\"55.00% \",\"conexiones2\":\"20\"}"
CG 1-20 STOP 0
```
