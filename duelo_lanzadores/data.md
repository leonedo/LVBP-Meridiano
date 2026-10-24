# data

> **For AI control agents** — This file describes the controllable interface of a Lottie animation
> prepared for CasparCG. Use it to understand **what data to send** from a control client.
> Do not use this file to modify the animation itself.
>
> **Text layers** — send the target text string using the layer's CSS class name. The graphic shows
> it in capitals, whatever the case you send.
> **Image layers** — send a web-accessible path to swap the displayed image. Accepted formats:
> a full URL (`https://...`) or a relative path from the template's web root (`images/logo.png`).
> Local filesystem paths (e.g. `C:/...`) will not work — the path must be resolvable by the browser rendering the template.
> A path that doesn't load leaves the image empty instead of showing a broken-image icon.
> **Markers** — `play` and `stop` control playback.

## Example payload

A control client sends a flat JSON object. Any subset of these keys is valid — omit what you don't need to change.

**Pitchers' duel (EL DUELO):** the two starting pitchers face to face: each one's photo in front of
his team's crest, the names in the bar below, and a stats table with the visiting pitcher on the
left, the home pitcher on the right and the labels in the middle column.

**Teams:** the crests are the same images as `placa_juego` (`escudovisita` / `escudolocal`): each
one is the whole half of the card (the team's color background, the watermark letters and the
crest), and the graphic tints them dark blue behind the photos. The eight teams are in `images/`,
named after the team in lowercase, and any of them works on either side:

| Team | Path |
|------|------|
| Águilas del Zulia | `images/aguilas.png` |
| Bravos de Margarita | `images/bravos.png` |
| Cardenales de Lara | `images/cardenales.png` |
| Caribes de Anzoátegui | `images/caribes.png` |
| Leones del Caracas | `images/leones.png` |
| Navegantes del Magallanes | `images/magallanes.png` |
| Tiburones de La Guaira | `images/tiburones.png` |
| Tigres de Aragua | `images/tigres.png` |

With nothing sent it shows the design's teams: Magallanes (visiting) and Tiburones (home).

**Photos (`fotolanzadorvisita` / `fotolanzadorlocal`):** send the path to each pitcher's photo. A
cut-out with a transparent background, like the design's (`images/foto_ejemplo.png`, 600 × 436),
looks best: the crest shows around the player. A photo of any proportion fits whole, centered in
its half and resting on the names bar; a tall cut-out fills the height of the card (376 px). By
default there's no photo (`images/foto.png` is transparent): if you send nothing, only the crest
shows. Send `""` to take a photo off.

**Stats:** five generic rows, top to bottom. Each one is a label (`etiquetaN`, the middle column)
and the two pitchers' values (`valorvisitaN` on the left, `valorlocalN` on the right): any stat can
go in any row, the design's RECORD / K / BB / WHIP / ERA are only the default. Same scheme as
`lanzador`.

**Placement:** centered, x 540–1376 and y 141–967: the card with the photos (up to y 521), the
names bar and the stats table below it. It is a standalone graphic: nothing else goes on air with
it.

```json
{
  "lanzadorvisita": "JOHAN SANTANA",
  "lanzadorlocal": "FÉLIX HERNÁNDEZ",
  "fotolanzadorvisita": "images/foto_ejemplo.png",
  "fotolanzadorlocal": "images/foto_ejemplo.png",
  "escudovisita": "images/magallanes.png",
  "escudolocal": "images/tiburones.png",
  "etiqueta1": "RECORD",
  "valorvisita1": "4-1",
  "valorlocal1": "3-2",
  "etiqueta2": "K",
  "valorvisita2": "32",
  "valorlocal2": "28",
  "etiqueta3": "BB",
  "valorvisita3": "5",
  "valorlocal3": "9",
  "etiqueta4": "WHIP",
  "valorvisita4": "1.09",
  "valorlocal4": "1.25",
  "etiqueta5": "ERA",
  "valorvisita5": "1.80",
  "valorlocal5": "2.45",
  "titulo": "EL DUELO"
}
```

## Animation

| Property | Value |
|----------|-------|
| Size | 1920 × 1080 px |
| Frame rate | 29.9700012207031 fps |
| Frames | 0 – 121.000004928431 |
| Duration | 4.04 s |

## Text layers

The names, the labels and the values are box text: a longer string shrinks to fit instead of
overflowing. A name fits about 21 characters at the design size (`EDUARDO RODRÍGUEZ` keeps it;
`FRANCISCO RODRÍGUEZ HERNÁNDEZ`, 29, goes from 55 to 40); a label, about 12 (`EFECTIVIDAD` keeps the
design size, `INNINGS LANZADOS` goes to 43); a value, about 6 (`100-200` goes from 65 to 63).

| Class | Default text |
|-------|-------------|
| `lanzadorvisita` | JOHAN SANTANA (left half of the names bar) |
| `lanzadorlocal` | JOHAN SANTANA (right half of the names bar) |
| `etiqueta1` / `valorvisita1` / `valorlocal1` | RECORD / 4-1 / 4-1 |
| `etiqueta2` / `valorvisita2` / `valorlocal2` | K / 32 / 32 |
| `etiqueta3` / `valorvisita3` / `valorlocal3` | BB / 5 / 5 |
| `etiqueta4` / `valorvisita4` / `valorlocal4` | WHIP / 1.09 / 1.09 |
| `etiqueta5` / `valorvisita5` / `valorlocal5` | ERA / 1.80 / 1.80 |
| `titulo` | EL DUELO (only during the entry: the red box that opens the card and leaves upwards, frames 0–30) |
| `vs` | VS (in a small red box between the crests; no need to send it) |

## Image layers

| Class | Ref ID | Size | Default |
|-------|--------|------|---------|
| `escudovisita` | `image_2` | 877 × 795 px | `images/magallanes.png` |
| `escudolocal` | `image_1` | 880 × 796 px | `images/tiburones.png` |
| `fotolanzadorvisita` | `image_0` | 600 × 436 px | `images/foto.png` (transparent) |
| `fotolanzadorlocal` | `image_0` | 600 × 436 px | `images/foto.png` (transparent) |
| `logomeridiano` | `image_3` | 2000 × 1282 px | `images/img_3.png` (Meridiano's logo, only during the entry, frames 31–37; no need to send it) |

The two photos share the asset, but each class swaps its own photo.

## Markers

| Name | Start (tm) | Duration (dr) | Payload |
|------|-----------|--------------|---------|
| `play` | 0 | 75 | stage `pause`, order 1, `stop: "salida"` |
| `salida` | 75 | -75 | — (the entry played backwards) |
| `stop` | 90.0000036657751 | 1 | — |

`play` enters and pauses on frame 74, when the crests finish darkening behind the photos. No update
animation: data sent while on air replaces silently. The exit is the entry in reverse: `stop`
plays `salida` (frame 75 → 0, 2.5 s) and releases the layer when it ends. The `play` stage is
active from frame 0, so a `stop` that arrives mid-entry also plays `salida`: it jumps to the full
graphic and exits from there.
