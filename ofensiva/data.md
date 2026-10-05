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
> **Markers** — `play` and `stop` control playback.

## Example payload

A control client sends a flat JSON object. Any subset of these keys is valid — omit what you don't need to change.

**Team crest:** all 8 crests start hidden (`opacity: 0` in `index.html`). Send `1` for the team at
bat and `0` for the others. Each crest carries the team's header color, so the header changes with
it. The crests overlap: if you switch teams you have to turn off the previous one. The team name is
a separate text key (`equipo`). Same keys as `defensiva`.

**Lineup:** one row per batting slot, 1 to 9 top to bottom: position (`posicionN`), player
(`jugadorN`) and a stat value (`valorN`). The value column has no label, so any stat can go there;
the design shows the batting average. The slot numbers 1–9 are fixed in the design.

**Player name format:** first name and surname, as in the design (`ALÍ CASTILLO`). Up to 18
characters, spaces included, a name keeps the design size. A longer name shrinks to fit and sits a
little higher in its row: 19–20 characters go about 10 % smaller, 21 or more about 20 % smaller.
So above 18 characters send the initial and the surname: `ALEXANDER MONASTERIOS` (21) →
`A. MONASTERIOS`.

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
  "posicion1": "2B",
  "jugador1": "ALÍ CASTILLO",
  "valor1": ".331",
  "posicion2": "CF",
  "jugador2": "JAISON CHOURIO",
  "valor2": ".303",
  "posicion3": "BD",
  "jugador3": "AEVERSON ARTEAGA",
  "valor3": ".146",
  "posicion4": "1B",
  "jugador4": "ISAÍAS TEJEDA",
  "valor4": ".275",
  "posicion5": "3B",
  "jugador5": "ANGELO CASTELLANO",
  "valor5": ".278",
  "posicion6": "LF",
  "jugador6": "GABRIEL MARTÍNEZ",
  "valor6": ".226",
  "posicion7": "SS",
  "jugador7": "EDUARDO TORREALBA",
  "valor7": ".272",
  "posicion8": "CF",
  "jugador8": "JOSÉ GODOY",
  "valor8": ".211",
  "posicion9": "RF",
  "jugador9": "LUIS LARA",
  "valor9": ".114",
  "informacion": "TEMPORADA 25-26: 200 CI DEL 2DO AL 5TO BATE",
  "titulo": "OFENSIVA",
  "titulo_entrada": "OFENSIVA",
  "logomeridiano": "<https://... or relative/path/from/web-root>"
}
```

Team names as the design writes them: `AGUILAS DEL ZULIA`, `BRAVOS DE MARGARITA`,
`CARIBES DE ANZOÁTEGUI`, `CARDENALES DE LARA`, `LEONES DEL CARACAS`,
`NAVEGANTES DEL MAGALLANES`, `TIBURONES DE LA GUAIRA`, `TIGRES DE ARAGUA`. All of them fit.

## Animation

| Property | Value |
|----------|-------|
| Size | 1920 × 1080 px |
| Frame rate | 29.9700012207031 fps |
| Frames | 0 – 90.0000036657751 |
| Duration | 3.00 s |

## Text layers

All text layers except `titulo_entrada` are box text: a longer string shrinks to fit instead of
overflowing. A player name shrinks before it reaches the divider line, a value before the edge of
the panel. `informacion` is centered on the black bar.

| Class | Default text |
|-------|-------------|
| `equipo` | LEONES DEL CARACAS |
| `titulo` | OFENSIVA |
| `titulo_entrada` | OFENSIVA (only visible during the entry, frames 1–19) |
| `informacion` | INFORMACION INFORMACION INFORMACION INFORMACION |
| `numeros` | 1 to 9, one per line (the slot numbers: no need to send it) |

The nine rows have the same defaults in the design: position `SS`, player `ANGELO CASTELLANO`,
value `.300`.

| Slot | Position | Player | Value |
|------|----------|--------|-------|
| 1 | `posicion1` | `jugador1` | `valor1` |
| 2 | `posicion2` | `jugador2` | `valor2` |
| 3 | `posicion3` | `jugador3` | `valor3` |
| 4 | `posicion4` | `jugador4` | `valor4` |
| 5 | `posicion5` | `jugador5` | `valor5` |
| 6 | `posicion6` | `jugador6` | `valor6` |
| 7 | `posicion7` | `jugador7` | `valor7` |
| 8 | `posicion8` | `jugador8` | `valor8` |
| 9 | `posicion9` | `jugador9` | `valor9` |

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
| `play` | 0 | 41 | stage `pause`, order 1, `stop: "salida"` |
| `salida` | 41 | -41 | — (the entry played backwards) |
| `stop` | 60.0000024438501 | 1 | — |

`play` enters and pauses on frame 40, when the ninth row finishes fading in. No update animation:
data sent while on air replaces silently. The exit is the entry in reverse: `stop` plays `salida`
(frame 41 → 0, 1.4 s) and releases the layer when it ends. The `play` stage is active from frame 0,
so a `stop` that arrives mid-entry also plays `salida`: it jumps to the full graphic and exits from
there.
