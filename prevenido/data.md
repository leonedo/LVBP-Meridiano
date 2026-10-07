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

**On-deck batter:** one row, the player (`jugador`) and a stat value (`valor`). The value has no
label, so any stat can go there; the design shows the batting average. The same layout as
`3enlinea` with a single row.

**Player name format:** initial and surname, as in the designer's video (`V. BERICOTO`): up to
about 15 characters keep the design size. Longer shrinks to fit in one line (`EDUARDO RODRÍGUEZ`,
17 characters, goes about 12 % smaller; 24 characters, about 37 %). From about 27 characters it
can break into two small lines.

**Value:** four characters (`.300`, `2.45`) keep the design size; a wider value (`1.000`,
`10.80`) shrinks before it reaches the sponsor's box.

**Sponsor (`publicidad`):** the box on the right of the bar, 81 × 65 px. Send the path to the
sponsor's logo: relative to this graphic's folder (`images/gatorade.png` is
`prevenido/images/gatorade.png`, so the file has to be there) or a full URL. A logo of any
proportion fits whole, centered in the box; a PNG at that size or double (162 × 130) fills it. By
default the box is empty (`images/publicidad.png` is transparent): if you send nothing, no logo
shows. Send `""` to take the logo off.

**Placement:** right above the score, in the same column, as in the designer's video (1 px above
the score's panel). `ofensiva` and `3enlinea` use that same place, so they don't go on air
together; neither does the score's batter bar (`jugadores` stage), which rises into it.

```json
{
  "jugador": "V. BERICOTO",
  "valor": ".300",
  "publicidad": "images/gatorade.png",
  "titulo": "PREVENIDO",
  "titulo_entrada": "PREVENIDO"
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

`jugador` and `valor` are box text: a longer string shrinks to fit instead of overflowing. The
titles are not: `titulo` grows to the right and fits about 19 characters in the red tab
(`PRÓXIMOS BATEADORES`), and longer overflows it.

| Class | Default text |
|-------|-------------|
| `jugador` | V.BERICOTTO |
| `valor` | .300 |
| `titulo` | PREVENIDO (the red tab, fades in at the end of the entry, frames 37–47) |
| `titulo_entrada` | PREVENIDO (the spaced-out curtain, only visible during the entry, frames 8–23) |

## Image layers

| Class | Ref ID | Size | Default |
|-------|--------|------|---------|
| `publicidad` | `image_0` | 81 × 65 px | `images/publicidad.png` (transparent) |

## Markers

| Name | Start (tm) | Duration (dr) | Payload |
|------|-----------|--------------|---------|
| `play` | 0 | 48 | stage `pause`, order 1, `stop: "salida"` |
| `salida` | 48 | -48 | — (the entry played backwards) |
| `stop` | 60.0000024438501 | 1 | — |

`play` enters and pauses on frame 47, when the title finishes fading in. No update animation: data
sent while on air replaces silently, the sponsor's logo included. The exit is the entry in
reverse: `stop` plays `salida` (frame 48 → 0, 1.6 s) and releases the layer when it ends. The
`play` stage is active from frame 0, so a `stop` that arrives mid-entry also plays `salida`: it
jumps to the full graphic and exits from there.
