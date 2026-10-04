# data

> **For AI control agents** — This file describes the controllable interface of a Lottie animation
> prepared for CasparCG. Use it to understand **what data to send** from a control client.
> Do not use this file to modify the animation itself.
>
> **Text layers** — send the target text string using the layer's CSS class name.
> **Opacity layers** — send a number from `0` (transparent) to `1` (fully opaque).
> **Image layers** — send a web-accessible path to swap the displayed image. Accepted formats:
> a full URL (`https://...`) or a relative path from the template's web root (`images/logo.png`).
> Local filesystem paths (e.g. `C:/...`) will not work — the path must be resolvable by the browser rendering the template.
> **Markers** — `play` and `stop` control playback.

## Example payload

A control client sends a flat JSON object. Any subset of these keys is valid — omit what you don't need to change.

**Team crest:** all 8 crests start hidden (`opacity: 0` in `index.html`). Send `1` for the
pitcher's team and `0` for the others. The crests overlap, so if you switch teams you have to
turn off the previous one. Same keys as `defensiva`.

```json
{
  "nombrelanzador": "JOHAN SANTANA",
  "manodelanzar": "LD",
  "LEO_opacidad": 1,
  "AGUI_opacidad": 0,
  "ANZ_opacidad": 0,
  "BRAVOS_opacidad": 0,
  "CARD_opacidad": 0,
  "MAGA_opacidad": 0,
  "TIBUS_opacidad": 0,
  "TIGRES_opacidad": 0,
  "informacionbarranegra": "TEMPORADA 2025-26",
  "numerosjuegoslanzados": "23",
  "numerosganadosyperdidos": "10-2",
  "numerosinninglanzados": "30.2",
  "numerosponchesybolas": "10-20",
  "numeroswhip": "1.23",
  "numerosefectividad": "5.00",
  "titulo": "LANZADOR",
  "logomeridiano": "<https://... or relative/path/from/web-root>"
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

The name, the stat values (`numeros…`) and `informacionbarranegra` are box text: a longer string
shrinks to fit instead of overflowing. `informacionbarranegra` is centered on the black bar.

| Class | Default text |
|-------|-------------|
| `nombrelanzador` | JOHAN SANTANA |
| `manodelanzar` | LD |
| `informacionbarranegra` | TEMPORADA 2025-26 |
| `titulo` | LANZADOR (only visible during the entry, frames 1–19) |
| `juegoslanzados` / `numerosjuegoslanzados` | JL / 23 |
| `ganadosyperdidos` / `numerosganadosyperdidos` | G-P / 10-2 |
| `inninglanzados` / `numerosinninglanzados` | IL / 30.2 |
| `ponchesybasesxbolas` / `numerosponchesybolas` | K-BB / 10-20 |
| `whip` / `numeroswhip` | WHIP / 1.23 |
| `efectividad` / `numerosefectividad` | ERA / 5.00 |

The six labels (`juegoslanzados` … `efectividad`) are fixed in the design; they are exposed but
there is normally no need to send them.

## Opacity layers

| Class | Team | Default opacity |
|-------|------|----------------|
| `AGUI_opacidad` | Águilas del Zulia | 0 |
| `ANZ_opacidad` | Caribes de Anzoátegui | 0 |
| `BRAVOS_opacidad` | Bravos de Margarita | 0 |
| `CARD_opacidad` | Cardenales de Lara | 0 |
| `LEO_opacidad` | Leones del Caracas | 0 |
| `MAGA_opacidad` | Navegantes del Magallanes | 0 |
| `TIBUS_opacidad` | Tiburones de La Guaira | 0 |
| `TIGRES_opacidad` | Tigres de Aragua | 0 |

## Image layers

| Class | Ref ID |
|-------|--------|
| `logomeridiano` | `image_0` |

## Markers

| Name | Start (tm) | Duration (dr) | Payload |
|------|-----------|--------------|---------|
| `play` | 0 | 35 | stage `pause`, order 1, `stop: "salida"` |
| `salida` | 35 | -35 | — (the entry played backwards) |
| `stop` | 60.0000024438501 | 1 | — |

`play` enters and pauses on frame 35. No update animation: data sent while on air replaces
silently. The exit is the entry in reverse: `stop` plays `salida` (frame 35 → 0, 1.2 s) and
releases the layer when it ends. The `play` stage is active from frame 0, so a `stop` that
arrives mid-entry also plays `salida`: it jumps to the full graphic and exits from there.
