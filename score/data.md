# data

> **For AI control agents** — This file describes the controllable interface of a Lottie animation
> prepared for CasparCG. Use it to understand **what data to send** from a control client.
> Do not use this file to modify the animation itself.
>
> **Text layers** — send the target text string using the layer's CSS class name.
> **Color fill layers** — send a hex color string (e.g. `#FF0000`) to change the fill color.
> **Opacity layers** — send a number from `0` (transparent) to `1` (fully opaque).
> **Image layers** — send a web-accessible path to swap the displayed image. Accepted formats:
> a full URL (`https://...`) or a relative path from the template's web root (`images/logo.png`).
> Local filesystem paths (e.g. `C:/...`) will not work — the path must be resolvable by the browser rendering the template.
> **Markers** — `play` and `stop` control playback; any other marker name can be triggered
> via `invoke` to drive timeline-based animations (e.g. animate-in, animate-out, transitions).

## Example payload

A control client sends a flat JSON object. Any subset of these keys is valid — omit what you don't need to change.

```json
{
  "lanzamientos": "40L",
  "average": ".300",
  "lanzador": "FRANCISCO RODRIGUEZ",
  "bateador": "FRANCISCO RODRIGUEZ",
  "outs": "OUTS",
  "inning": "2",
  "conteobolasystrikes": "1-2",
  "CARRERASLOCAL": "20",
  "CARRERASVISITA": "20",
  "lvbp": "LVBP",
  "meridianotv": "MERIDIANO TELEVISIÓN",
  "INNINGabajo_opacidad": 100,
  "INNINGarriba_opacidad": 100,
  "TERCERALLENA_opacidad": 100,
  "SEGUNDALLENA_opacidad": 100,
  "PRIMERALLENA_opacidad": 100,
  "SEGUNDOOUT_opacidad": 100,
  "PRIMEROUT_opacidad": 100,
  "AGUILOCAL_opacidad": 100,
  "ANZLOCAL_opacidad": 100,
  "BRAVOSLOCAL_opacidad": 100,
  "CARDLOCAL_opacidad": 100,
  "TIGRESLOCAL_opacidad": 100,
  "TIBUSLOCAL_opacidad": 100,
  "LEOLOCAL_opacidad": 100,
  "MAGALOCAL_opacidad": 100,
  "LEOVISITA_opacidad": 100,
  "AGUIVISITA_opacidad": 100,
  "ANZVISITA_opacidad": 100,
  "BRAVOSVISITA_opacidad": 100,
  "CARDVISITA_opacidad": 100,
  "MAGAVISITA_opacidad": 100,
  "TIBUSVISITA_opacidad": 100,
  "TIGRESVISITA_opacidad": 100,
  "logomeridiano": "<https://... or relative/path/from/web-root>"
}
```

## Animation

| Property | Value |
|----------|-------|
| Size | 1920 × 1080 px |
| Frame rate | 29.9700012207031 fps |
| Frames | 0 – 272.000011078787 |
| Duration | 9.08 s |

## Text layers

| Class | nm | Default text |
|-------|----|-------------|
| `lanzamientos` | `.lanzamientos` | 40L |
| `average` | `.average` | .300 |
| `lanzador` | `.lanzador` | FRANCISCO RODRIGUEZ |
| `bateador` | `.bateador` | FRANCISCO RODRIGUEZ |
| `outs` | `.outs` | OUTS |
| `inning` | `.inning` | 2 |
| `conteobolasystrikes` | `.conteobolasystrikes` | 1-2 |
| `CARRERASLOCAL` | `.CARRERASLOCAL` | 20 |
| `CARRERASVISITA` | `.CARRERASVISITA` | 20 |
| `lvbp` | `.lvbp` | LVBP |
| `meridianotv` | `.meridianotv` | MERIDIANO TELEVISIÓN |

## Opacity layers

| Class | nm | Default opacity |
|-------|----|----------------|
| `INNINGabajo_opacidad` | `.INNINGabajo_opacidad` | 100 |
| `INNINGarriba_opacidad` | `.INNINGarriba_opacidad` | 100 |
| `TERCERALLENA_opacidad` | `.TERCERALLENA_opacidad` | 100 |
| `SEGUNDALLENA_opacidad` | `.SEGUNDALLENA_opacidad` | 100 |
| `PRIMERALLENA_opacidad` | `.PRIMERALLENA_opacidad` | 100 |
| `SEGUNDOOUT_opacidad` | `.SEGUNDOOUT_opacidad` | 100 |
| `PRIMEROUT_opacidad` | `.PRIMEROUT_opacidad` | 100 |
| `AGUILOCAL_opacidad` | `.AGUILOCAL_opacidad` | 100 |
| `ANZLOCAL_opacidad` | `.ANZLOCAL_opacidad` | 100 |
| `BRAVOSLOCAL_opacidad` | `.BRAVOSLOCAL_opacidad` | 100 |
| `CARDLOCAL_opacidad` | `.CARDLOCAL_opacidad` | 100 |
| `TIGRESLOCAL_opacidad` | `.TIGRESLOCAL_opacidad` | 100 |
| `TIBUSLOCAL_opacidad` | `.TIBUSLOCAL_opacidad` | 100 |
| `LEOLOCAL_opacidad` | `.LEOLOCAL_opacidad` | 100 |
| `MAGALOCAL_opacidad` | `.MAGALOCAL_opacidad` | 100 |
| `LEOVISITA_opacidad` | `.LEOVISITA_opacidad` | 100 |
| `AGUIVISITA_opacidad` | `.AGUIVISITA_opacidad` | 100 |
| `ANZVISITA_opacidad` | `.ANZVISITA_opacidad` | 100 |
| `BRAVOSVISITA_opacidad` | `.BRAVOSVISITA_opacidad` | 100 |
| `CARDVISITA_opacidad` | `.CARDVISITA_opacidad` | 100 |
| `MAGAVISITA_opacidad` | `.MAGAVISITA_opacidad` | 100 |
| `TIBUSVISITA_opacidad` | `.TIBUSVISITA_opacidad` | 100 |
| `TIGRESVISITA_opacidad` | `.TIGRESVISITA_opacidad` | 100 |

## Image layers

| Class | nm | Ref ID |
|-------|----|--------|
| `logomeridiano` | `.logomeridiano` | `image_0` |

## Markers

| Name | Start (tm) | Duration (dr) | Comment |
|------|-----------|--------------|---------|
| `play` | 0 | 106 | play |
| `stop` | 240.0000097754 | 32.0000013033867 | stop |
| `stopjugadores` | 213 | 59 | stopjugadores |
| `marcador` | 100 | 6 | marcador |
| `jugadores` | 120 | 16 | jugadores |
| `sinjugadores` | 213 | 19 | sinjugadores |

## Invocación directa desde CasparCG

Sintaxis: `CG <channel>-<videoLayer> INVOKE <cg_layer> "<method>"` (en este setup `cg_layer` siempre es `1`).

Cada stage se puede invocar directo en vez de pasar por `goto`:

| Stage | Comando CasparCG |
|-------|------------------|
| `marcador` | `CG 1-10 INVOKE 1 "marcador()"` |
| `jugadores` | `CG 1-10 INVOKE 1 "jugadores()"` |
| `sinjugadores` | `CG 1-10 INVOKE 1 "sinjugadores()"` |

Los `()` son obligatorios. `1-10` es ejemplo (`<channel>-<videoLayer>`), sustituir por el setup real.
