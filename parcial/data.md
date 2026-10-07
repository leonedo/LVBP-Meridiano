# data

> **For AI control agents** — This file describes the controllable interface of a Lottie animation
> prepared for CasparCG. Use it to understand **what data to send** from a control client.
> Do not use this file to modify the animation itself.
>
> **Text layers** — send the target text string using the layer's CSS class name. The graphic shows
> it in capitals, whatever the case you send.
> **Opacity layers** — send a number from `0` (transparent) to `1` (fully opaque).
> **Image layers** — send a web-accessible path to swap the displayed image. Accepted formats:
> a full URL (`https://...`) or a relative path from the template's web root (`images/logo.png`).
> Local filesystem paths (e.g. `C:/...`) will not work — the path must be resolvable by the browser rendering the template.
> A path that doesn't load leaves the image empty instead of showing a broken-image icon.
> **Markers** — `play` and `stop` control playback.

## Example payload

A control client sends a flat JSON object. Any subset of these keys is valid — omit what you don't need to change.

**End-of-inning score:** runs, hits and errors for each team (visitor on top, home below), the
inning, and the three batters due up in the next inning.

**Same keys as `score`** for what both show: the crests, `inning`, the two arrows and the runs
(`CARRERASVISITA`, `CARRERASLOCAL`). A client can send the same values to both. Hits and errors
follow the style of the runs: `HITSVISITA`, `ERRORESVISITA`, `HITSLOCAL`, `ERRORESLOCAL`.

**Team crests:** as in `score`, all 16 start visible and overlap, 8 per row: send `0` to the ones
that don't play (and `1` to the two that do). The visitor's row takes `<TEAM>VISITA_opacidad`, the
home row `<TEAM>LOCAL_opacidad`. Each crest carries its team's background color.

**Inning:** the number (`inning`) and the arrows. Both arrows start visible: turn off the one that
doesn't apply (`INNINGarriba_opacidad` is the top of the inning, `INNINGabajo_opacidad` the
bottom). Extra innings (two digits) fit.

**Next batters:** `jugador1` to `jugador3`, top to bottom, under `titulo_jugadores`. Name format:
initial and surname, as in the design (`A. MONASTERIOS`): up to about 17 characters keep the design
size. A full name shrinks to fit (`EDUARDO RODRÍGUEZ`, 17 characters, goes about 13 % smaller).

**Sponsor (`publicidad`):** the box on the right of the panel, 217 × 168 px. Send the path to the
sponsor's logo: relative to this graphic's folder (`images/gatorade.png` is
`parcial/images/gatorade.png`, so the file has to be there) or a full URL. A logo of any proportion
fits whole, centered in the box. By default the box is empty (`images/publicidad.png` is
transparent): if you send nothing, no logo shows. Send `""` to take the logo off.

**Placement:** bottom center of the screen. Its right edge ends 1 px before the score's column:
on air together they sit side by side without overlapping (in the designer's video it goes on air
alone).

```json
{
  "CARRERASVISITA": "2",
  "HITSVISITA": "5",
  "ERRORESVISITA": "0",
  "CARRERASLOCAL": "4",
  "HITSLOCAL": "9",
  "ERRORESLOCAL": "1",
  "inning": "7",
  "INNINGarriba_opacidad": 1,
  "INNINGabajo_opacidad": 0,
  "CARDVISITA_opacidad": 1,
  "AGUIVISITA_opacidad": 0,
  "ANZVISITA_opacidad": 0,
  "BRAVOSVISITA_opacidad": 0,
  "LEOVISITA_opacidad": 0,
  "MAGAVISITA_opacidad": 0,
  "TIBUSVISITA_opacidad": 0,
  "TIGRESVISITA_opacidad": 0,
  "AGUILOCAL_opacidad": 1,
  "ANZLOCAL_opacidad": 0,
  "BRAVOSLOCAL_opacidad": 0,
  "CARDLOCAL_opacidad": 0,
  "LEOLOCAL_opacidad": 0,
  "MAGALOCAL_opacidad": 0,
  "TIBUSLOCAL_opacidad": 0,
  "TIGRESLOCAL_opacidad": 0,
  "jugador1": "A. MONASTERIOS",
  "jugador2": "C. RODRÍGUEZ",
  "jugador3": "J. MARTÍNEZ",
  "publicidad": "images/gatorade.png",
  "titulo": "PARCIAL",
  "titulo_jugadores": "3 EN LINEA"
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

The names and the six numbers are box text: a longer string shrinks to fit instead of
overflowing. A name shrinks before the sponsor's box, a number before the column lines.

| Class | Default text |
|-------|-------------|
| `titulo` | PARCIAL (only visible during the entry, frames 0–22) |
| `titulo_jugadores` | 3 EN LINEA |
| `inning` | 9 |
| `carrerashitserrores` | CHE (the column labels C, H, E: no need to send it) |
| `jugador1` | A.MONASTERIOS |
| `jugador2` | C.RODRIGUEZ |
| `jugador3` | J.MARTINEZ |

`titulo` is on two layers on purpose, the curtain before and after the panel opens: one key
changes both. `titulo_jugadores` sits in a red bar shorter than an accented capital: the accent of
`Í` rises 3 px above it, so the design writes `3 EN LINEA`.

| Team | Runs | Hits | Errors | Default |
|------|------|------|--------|---------|
| Visitor (top) | `CARRERASVISITA` | `HITSVISITA` | `ERRORESVISITA` | 20 |
| Home (bottom) | `CARRERASLOCAL` | `HITSLOCAL` | `ERRORESLOCAL` | 20 |

## Opacity layers

| Class | What | Default opacity |
|-------|------|----------------|
| `INNINGarriba_opacidad` | ▲ top of the inning | 1 |
| `INNINGabajo_opacidad` | ▼ bottom of the inning | 1 |

| Team | Visitor (top row) | Home (bottom row) | Default opacity |
|------|-------------------|-------------------|----------------|
| Águilas del Zulia | `AGUIVISITA_opacidad` | `AGUILOCAL_opacidad` | 1 |
| Caribes de Anzoátegui | `ANZVISITA_opacidad` | `ANZLOCAL_opacidad` | 1 |
| Bravos de Margarita | `BRAVOSVISITA_opacidad` | `BRAVOSLOCAL_opacidad` | 1 |
| Cardenales de Lara | `CARDVISITA_opacidad` | `CARDLOCAL_opacidad` | 1 |
| Leones del Caracas | `LEOVISITA_opacidad` | `LEOLOCAL_opacidad` | 1 |
| Navegantes del Magallanes | `MAGAVISITA_opacidad` | `MAGALOCAL_opacidad` | 1 |
| Tiburones de La Guaira | `TIBUSVISITA_opacidad` | `TIBUSLOCAL_opacidad` | 1 |
| Tigres de Aragua | `TIGRESVISITA_opacidad` | `TIGRESLOCAL_opacidad` | 1 |

## Image layers

| Class | Ref ID | Size | Default |
|-------|--------|------|---------|
| `publicidad` | `image_0` | 217 × 168 px | `images/publicidad.png` (transparent) |

## Markers

| Name | Start (tm) | Duration (dr) | Payload |
|------|-----------|--------------|---------|
| `play` | 0 | 32 | stage `pause`, order 1, `stop: "salida"` |
| `salida` | 32 | -32 | — (the entry played backwards) |
| `stop` | 60.0000024438501 | 1 | — |

`play` enters and pauses on frame 31, when the panel finishes opening. No update animation: data
sent while on air replaces silently, crests and sponsor included. The exit is the entry in
reverse: `stop` plays `salida` (frame 32 → 0, 1.1 s) and releases the layer when it ends. The
`play` stage is active from frame 0, so a `stop` that arrives mid-entry also plays `salida`: it
jumps to the full graphic and exits from there.
