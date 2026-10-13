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

**Today's game (JUEGO DE HOY):** the full-screen card before the game: the two teams' crests and
names, the league on top and the stadium below. **Preliminary version** (2026-10-13): the design
already shows MAGALLANES (left, visiting) and TIBURONES (right, home), the teams of that day's game,
so with nothing sent it goes on air as designed. The final version may change the keys.

**Teams:** `equipovisita` / `equipolocal` are the names written vertically along the left and right
edges (box text: the eight league names keep the design size). The crests are images
(`escudovisita` / `escudolocal`, 463 × 418 and 465 × 419 px), and each one is the whole half of the
card: the team's color background, the watermark letters and the crest. Only Magallanes and
Tiburones are in `images/`: another team needs its own half-card PNG from the designer, at that
size, copied there first.

**Placement:** centered, almost the full screen (x 331–1585, y 143–820). It is a standalone card:
nothing else goes on air with it.

```json
{
  "equipovisita": "NAVEGANTES DEL MAGALLANES",
  "equipolocal": "TIBURONES DE LA GUAIRA",
  "estadio": "ESTADIO UNIVERSITARIO -UCV, CARACAS",
  "liga": "LIGA VENEZOLANA DE BEISBOL PROFESIONAL",
  "titulo": "JUEGO DE HOY",
  "escudovisita": "images/img_1.png",
  "escudolocal": "images/img_0.png"
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

`equipovisita` and `equipolocal` are box text: a longer string shrinks to fit instead of
overflowing. The others are not: `estadio` and `liga` are centered and fit about twice the design
text in the width of the card; longer overflows it.

| Class | Default text |
|-------|-------------|
| `titulo` | JUEGO DE HOY (only during the entry: the red box that opens the card and leaves upwards, frames 0–30) |
| `liga` | LIGA VENEZOLANA DE BEISBOL PROFESIONAL (above the card) |
| `estadio` | ESTADIO UNIVERSITARIO -UCV, CARACAS (the red bar below the card) |
| `equipovisita` | NAVEGANTES DEL MAGALLANES (vertical, left edge) |
| `equipolocal` | TIBURONES DE LA GUAIRA (vertical, right edge) |
| `vs` | VS (between the crests; no need to send it) |

## Image layers

| Class | Ref ID | Size | Default |
|-------|--------|------|---------|
| `escudovisita` | `image_1` | 463 × 418 px | `images/img_1.png` (Magallanes) |
| `escudolocal` | `image_0` | 465 × 419 px | `images/img_0.png` (Tiburones) |
| `logomeridiano` | `image_2` | 2000 × 1282 px | `images/img_2.png` (Meridiano's logo, only during the entry, frames 31–37; no need to send it) |

## Markers

| Name | Start (tm) | Duration (dr) | Payload |
|------|-----------|--------------|---------|
| `play` | 0 | 74 | stage `pause`, order 1, `stop: "salida"` |
| `salida` | 74 | -74 | — (the entry played backwards) |
| `stop` | 90.0000036657751 | 1 | — |

`play` enters and pauses on frame 73, when the VS settles. No update animation: data sent while on
air replaces silently. The exit is the entry in reverse: `stop` plays `salida` (frame 74 → 0,
2.5 s) and releases the layer when it ends. The `play` stage is active from frame 0, so a `stop`
that arrives mid-entry also plays `salida`: it jumps to the full card and exits from there.
