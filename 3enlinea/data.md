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

**Batters:** the next three batters, top to bottom: player (`jugadorN`) and a stat value
(`valorN`). The value column has no label, so any stat can go there; the design shows the batting
average.

**Player name format:** the same as `ofensiva`, first name and surname (`JOSÉ RONDÓN`), and the
initial and the surname above 18 characters (`A. MONASTERIOS`). Here those always keep the design
size: the row fits about 25 characters before a name starts to shrink.

**Sponsor (`publicidad`):** the square on the right of the panel, 107 × 110 px. Send the path to
the sponsor's logo: relative to this graphic's folder (`images/gatorade.png` is
`3enlinea/images/gatorade.png`, so the file has to be there) or a full URL. A logo of any
proportion fits whole, centered in the square; a PNG with a transparent background at that size
or double (214 × 220) fills it. By default the square is empty (`images/publicidad.png` is
transparent): if you send nothing, no logo shows. Send `""` to take the logo off.

**Placement:** right above the score, in the same column, as in the designer's video. `ofensiva`
uses that same place, so they don't go on air together.

```json
{
  "jugador1": "JOSÉ RONDÓN",
  "valor1": ".300",
  "jugador2": "WILFREDO TOVAR",
  "valor2": ".256",
  "jugador3": "KENNEDY CORONA",
  "valor3": ".167",
  "publicidad": "images/gatorade.png",
  "titulo": "3 EN LÍNEA",
  "titulo_entrada": "3 EN LÍNEA"
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

`jugadorN` and `valorN` are box text: a longer string shrinks to fit instead of overflowing. A
name shrinks before it reaches the divider line, a value before the sponsor's square. The titles
are not: `titulo` fits about 19 characters in the red tab (`PRÓXIMOS BATEADORES`), and longer
overflows it.

| Class | Default text |
|-------|-------------|
| `titulo` | 3 EN LÍNEA (the red tab, fades in at the end of the entry, frames 38–58) |
| `titulo_entrada` | 3 EN LÍNEA (only visible during the entry, frames 8–22) |

The three rows have different defaults in the design: `ANDREW MONASTERIOS`, `MARCOS YEPEZ` and
`CARLOS MARTINEZ`, all with `.300`.

| Row | Player | Value |
|-----|--------|-------|
| 1 | `jugador1` | `valor1` |
| 2 | `jugador2` | `valor2` |
| 3 | `jugador3` | `valor3` |

## Image layers

| Class | Ref ID | Size | Default |
|-------|--------|------|---------|
| `publicidad` | `image_0` | 107 × 110 px | `images/publicidad.png` (transparent) |

## Markers

| Name | Start (tm) | Duration (dr) | Payload |
|------|-----------|--------------|---------|
| `play` | 0 | 59 | stage `pause`, order 1, `stop: "salida"` |
| `salida` | 59 | -59 | — (the entry played backwards) |
| `stop` | 60.0000024438501 | 1 | — |

`play` enters and pauses on frame 58, when the title finishes fading in. No update animation: data
sent while on air replaces silently, the sponsor's logo included. The exit is the entry in
reverse: `stop` plays `salida` (frame 59 → 0, 2.0 s) and releases the layer when it ends. The
`play` stage is active from frame 0, so a `stop` that arrives mid-entry also plays `salida`: it
jumps to the full graphic and exits from there.
