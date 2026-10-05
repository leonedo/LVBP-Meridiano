# data

> **For AI control agents** — This file describes the controllable interface of a Lottie animation
> prepared for CasparCG. Use it to understand **what data to send** from a control client.
> Do not use this file to modify the animation itself.
>
> **Text layers** — send the target text string using the layer's CSS class name. The graphic shows
> it in capitals, whatever the case you send.
> **Opacity layers** — send a number from `0` (transparent) to `1` (fully opaque).
> **Markers** — `play` and `stop` control playback.

## Example payload

A control client sends a flat JSON object. Any subset of these keys is valid — omit what you don't need to change.

**Team crest:** all 8 crests start hidden (`opacity: 0` in `index.html`). Send `1` for the
batter's team and `0` for the others. The crests overlap, so if you switch teams you have to
turn off the previous one. Same keys as `defensiva` and `lanzador`.

**Stats:** four generic slots, left to right. Each one is a label (`etiquetaN`) and a value
(`valorN`): any stat can go in any slot, the design's AVG / HR / CI / OBP are only the default.

```json
{
  "nombrejugador": "ISAIAS TEJEDA",
  "numerouniforme": "1",
  "posicion": "1B",
  "MAGA_opacidad": 1,
  "AGUI_opacidad": 0,
  "ANZ_opacidad": 0,
  "BRAVOS_opacidad": 0,
  "CARD_opacidad": 0,
  "LEO_opacidad": 0,
  "TIBUS_opacidad": 0,
  "TIGRES_opacidad": 0,
  "informacionbarranegra": "TEMPORADA 2025-26",
  "etiqueta1": "AVG",
  "valor1": ".300",
  "etiqueta2": "HR",
  "valor2": "20",
  "etiqueta3": "CI",
  "valor3": "40",
  "etiqueta4": "OBP",
  "valor4": ".200",
  "titulo": "AL BATE"
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

The name, the number, the position, the stat labels and values, and `informacionbarranegra` are
box text: a longer string shrinks to fit instead of overflowing.

| Class | Default text |
|-------|-------------|
| `nombrejugador` | ISAIAS TEJEDA |
| `numerouniforme` | 1 |
| `posicion` | 1B |
| `informacionbarranegra` | TEMPORADA 2025-26 |
| `etiqueta1` / `valor1` | AVG / .300 |
| `etiqueta2` / `valor2` | HR / 20 |
| `etiqueta3` / `valor3` | CI / 40 |
| `etiqueta4` / `valor4` | OBP / .200 |
| `titulo` | AL BATE (only visible during the entry, frames 0–26) |

`titulo` is on two layers on purpose, the two halves of the entry wipe: one key changes both
(e.g. `PREVENIDO` for the on-deck batter).

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

## Markers

| Name | Start (tm) | Duration (dr) | Payload |
|------|-----------|--------------|---------|
| `play` | 0 | 36 | stage `pause`, order 1, `stop: "salida"` |
| `salida` | 36 | -36 | — (the entry played backwards) |
| `stop` | 60 | 1 | — |

`play` enters and pauses on frame 36. No update animation: data sent while on air replaces
silently. The exit is the entry in reverse: `stop` plays `salida` (frame 36 → 0, 1.2 s) and
releases the layer when it ends. The `play` stage is active from frame 0, so a `stop` that
arrives mid-entry also plays `salida`: it jumps to the full graphic and exits from there.
