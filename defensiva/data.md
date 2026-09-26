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

**Team crest:** all 8 crests start hidden (`opacity: 0` in `index.html`). Send `1` for the team on
defense and `0` for the others. The crests overlap, so if you switch teams you have to turn off
the previous one. The team name is a separate text key (`equipo`).

```json
{
  "equipo": "LEONES DEL CARACAS",
  "LEO_opacidad": 1,
  "AGUI_opacidad": 0,
  "ANZ_opacidad": 0,
  "BRAVOS_opacidad": 0,
  "CARD_opacidad": 0,
  "MAGA_opacidad": 0,
  "TIBUS_opacidad": 0,
  "TIGRES_opacidad": 0,
  "catcher": "C",
  "jugadorcatcher": "F.RODRIGUEZ",
  "lanzador": "L",
  "jugadorlanzador": "F.RODRIGUEZ",
  "primerabase": "1B",
  "jugadorprimerabase": "F.RODRIGUEZ",
  "segundabase": "2B",
  "jugadorsegundabase": "F.RODRIGUEZ",
  "tercerabase": "3B",
  "jugadortercerabase": "F.RODRIGUEZ",
  "shortstop": "SS",
  "jugadorshortstop": "F.RODRIGUEZ",
  "leftfield": "LF",
  "jugadorleftfield": "F.RODRIGUEZ",
  "centerfield": "CF",
  "jugadorcenterfield": "F.RODRIGUEZ",
  "rightfield": "RF",
  "jugadorrightfield": "F.RODRIGUEZ",
  "lineaparainformacion": "LINEA PARA INFORMACION",
  "logomeridiano": "<https://... or relative/path/from/web-root>"
}
```

Team names as the design writes them: `AGUILAS DEL ZULIA`, `BRAVOS DE MARGARITA`,
`CARIBES DE ANZOÁTEGUI`, `CARDENALES DE LARA`, `LEONES DEL CARACAS`,
`NAVEGANTES DEL MAGALLANES`, `TIBURONES DE LA GUAIRA`, `TIGRES DE ARAGUA`.

## Animation

| Property | Value |
|----------|-------|
| Size | 1920 × 1080 px |
| Frame rate | 29.9700012207031 fps |
| Frames | 0 – 150.000006109625 |
| Duration | 5.01 s |

## Text layers

The position labels (`catcher` … `rightfield`), the player names (`jugador…`) and `lineaparainformacion`
are box text: a longer string shrinks to fit instead of overflowing. `equipo` is point text; the
longest team name (`NAVEGANTES DEL MAGALLANES`) fits.

| Class | Default text |
|-------|-------------|
| `equipo` | LEONES DEL CARACAS |
| `titulo` | DEFENSIVA |
| `titulo_entrada` | DEFENSIVA (only visible during the first 26 frames of the entry) |
| `catcher` | C |
| `jugadorcatcher` | F.RODRIGUEZ |
| `lanzador` | L |
| `jugadorlanzador` | F.RODRIGUEZ |
| `primerabase` | 1B |
| `jugadorprimerabase` | F.RODRIGUEZ |
| `segundabase` | 2B |
| `jugadorsegundabase` | F.RODRIGUEZ |
| `tercerabase` | 3B |
| `jugadortercerabase` | F.RODRIGUEZ |
| `shortstop` | SS |
| `jugadorshortstop` | F.RODRIGUEZ |
| `leftfield` | LF |
| `jugadorleftfield` | F.RODRIGUEZ |
| `centerfield` | CF |
| `jugadorcenterfield` | F.RODRIGUEZ |
| `rightfield` | RF |
| `jugadorrightfield` | F.RODRIGUEZ |
| `lineaparainformacion` | LINEA PARA INFORMACION |

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
| `play` | 0 | 90 | stage `pause`, order 1 |
| `stop` | 120.0000048877 | 1 | — |

`play` enters and pauses on frame 90. No update animation: data sent while on air replaces
silently. There is no exit animation: `stop` cuts, and the layer is released about 10 ms later.
