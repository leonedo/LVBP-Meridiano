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

**National anthem lowbar:** on air while the national anthem plays. The black tab says `HIMNO
NACIONAL` (`titulo`), the white bar shows the country (`texto`) and the flag on the left
(`bandera`). By default it is Venezuela's: sending nothing, the graphic is ready to go on air.

**When to use it:** in the same segment as `placa_juego` (the pre-game card), as a second option:
a lowbar instead of the full-screen card.

**Placement:** bottom left, in the place of the batter's bar (`bateador`, `bateador_informacion`):
they don't go on air together.

**Flag (`bandera`):** the box on the left of the bar, 129 × 86 px (3:2). Send the path to the
flag: relative to this graphic's folder (`images/mexico.png` is `himno_nacional/images/mexico.png`,
so the file has to be there) or a full URL. The image fills the box: a flag of another proportion
(2:1, 7:4) is cropped at the sides, centered. A 3:2 image at double size (258 × 172) fills it
exactly. Send `""` to leave the box empty (the white bar shows behind it).

```json
{
  "titulo": "HIMNO NACIONAL",
  "texto": "REPUBLICA BOLIVARIANA DE VENEZUELA",
  "bandera": "images/venezuela.jpg"
}
```

## Animation

| Property | Value |
|----------|-------|
| Size | 1920 × 1080 px |
| Frame rate | 29.9700012207031 fps |
| Frames | 0 – 90.0000036657751 |
| Duration | 3.00 s |

## Text layers

`texto` and `titulo` are box text: a longer string shrinks to fit instead of overflowing. `texto`
fits about 40 characters at the design size (`REPUBLICA BOLIVARIANA DE VENEZUELA` is 34) and
`titulo` about 40 (`HIMNO NACIONAL` is 14), centered in the black tab; longer goes smaller, in one line.

| Class | Default text |
|-------|-------------|
| `texto` | REPUBLICA BOLIVARIANA DE VENEZUELA (the white bar) |
| `titulo` | HIMNO NACIONAL (the black tab) |
| `meridianotv` | MERIDIANO TELEVISION (the spaced-out curtain, only visible during the entry, frames 0–26; two layers, one key) |

## Image layers

| Class | Ref ID | Size | Default |
|-------|--------|------|---------|
| `bandera` | `image_0` | 129 × 86 px on screen | `images/venezuela.jpg` (Venezuela, 258 × 172) |

## Markers

| Name | Start (tm) | Duration (dr) | Payload |
|------|-----------|--------------|---------|
| `play` | 0 | 31 | stage `pause`, order 1, `stop: "salida"` |
| `salida` | 31 | -31 | — (the entry played backwards) |
| `stop` | 60.0000024438501 | 1 | — |

`play` enters and pauses on frame 30, when the bar and the tab finish opening. No update
animation: data sent while on air replaces silently, the flag included. The exit is the entry in
reverse: `stop` plays `salida` (frame 31 → 0, 1.0 s) and releases the layer when it ends. The
`play` stage is active from frame 0, so a `stop` that arrives mid-entry also plays `salida`: it
jumps to the full graphic and exits from there.
