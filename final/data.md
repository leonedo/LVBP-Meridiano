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

**Final score (line score):** the runs of each inning for both teams (visitor on top, home
below), runs, hits and errors, and the winning pitcher, losing pitcher and MVP in the bottom bar.

**Same keys as `score` and `parcial`** for what they share: the crests and the runs
(`CARRERASVISITA`, `CARRERASLOCAL`), and the hits and errors of `parcial` (`HITSVISITA`,
`ERRORESVISITA`, `HITSLOCAL`, `ERRORESLOCAL`). The innings follow the same style:
`INNINGVISITA1`–`INNINGVISITA9` and `INNINGLOCAL1`–`INNINGLOCAL9`.

**Team crests:** as in `score` and `parcial`, all 16 start visible and overlap, 8 per row: send `0`
to the ones that don't play (and `1` to the two that do). The visitor's row takes
`<TEAM>VISITA_opacidad`, the home row `<TEAM>LOCAL_opacidad`. Each crest carries its team's
background color.

**Innings:** columns 1 to 8 have fixed labels. Column 9 is the **last inning**: its label is
`ultimoinning` (`9` in a regular game, `10`, `12`… in extra innings) and its values are
`INNINGVISITA9` / `INNINGLOCAL9`. The default label is `X`: send it always. Each value is centered
in its column; two digits keep the design size, three shrink. Send `X` for a half inning not played
(the home team's 9th when it won) and `""` to leave a cell empty.

**Bottom bar:** `lanzadorganador`, `lanzadorperdedor` and `jugadormvp`, after their labels
`juegoganado` (`JG:`), `juegoperdido` (`JP:`) and `masvalioso` (`MVP:`). Name format: initial and
surname (`J. SANTANA`): up to about 16 characters keep the design size; longer shrinks, and its
baseline rises a little. A label stays even with no name: send `""` to the label too to leave
that place empty. `barra_opacidad` turns the whole bar off (`0`) or back on (`1`, the default),
to use the graphic mid-game: off, the panel ends right below the innings rows, with no gray strip.

**Title:** `titulo` is the label at the top left, after the ►: `FINAL`. It grows to the right and
fits about 9 characters (`FINAL (12)`; mid-game, the inning: `7 ALTA`). `titulo_entrada` is the
curtain of the entry (`SCORE FINAL`).

**Placement:** bottom center of the screen, where `parcial` goes. It overlaps the score's column
on the right: they don't go on air together (in the designer's video it goes on air alone).

```json
{
  "INNINGVISITA1": "0", "INNINGVISITA2": "0", "INNINGVISITA3": "0",
  "INNINGVISITA4": "0", "INNINGVISITA5": "0", "INNINGVISITA6": "0",
  "INNINGVISITA7": "0", "INNINGVISITA8": "0", "INNINGVISITA9": "5",
  "INNINGLOCAL1": "0", "INNINGLOCAL2": "0", "INNINGLOCAL3": "3",
  "INNINGLOCAL4": "0", "INNINGLOCAL5": "0", "INNINGLOCAL6": "0",
  "INNINGLOCAL7": "1", "INNINGLOCAL8": "0", "INNINGLOCAL9": "0",
  "ultimoinning": "9",
  "CARRERASVISITA": "5",
  "HITSVISITA": "4",
  "ERRORESVISITA": "0",
  "CARRERASLOCAL": "4",
  "HITSLOCAL": "11",
  "ERRORESLOCAL": "3",
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
  "lanzadorganador": "J. SANTANA",
  "lanzadorperdedor": "F. HERNÁNDEZ",
  "jugadormvp": "M. CABRERA",
  "titulo": "FINAL",
  "titulo_entrada": "SCORE FINAL"
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

The innings, runs, hits, errors, `ultimoinning` and the three names are box text: a longer string
shrinks to fit instead of overflowing.

| Class | Default text |
|-------|-------------|
| `titulo` | FINAL |
| `titulo_entrada` | SCORE FINAL (the curtain, only visible during the entry, frames 0–31) |
| `ultimoinning` | X (the label of column 9) |
| `innings` | 12345678 (the labels of columns 1–8: no need to send it) |
| `carrerashitserrores` | C H E (the column labels: no need to send it) |
| `juegoganado` / `lanzadorganador` | JG: / JOHAN SANTANA |
| `juegoperdido` / `lanzadorperdedor` | JP: / JOHAN SANTANA |
| `masvalioso` / `jugadormvp` | MVP: / JOHAN SANTANA |

| Team | Runs | Hits | Errors | Default |
|------|------|------|--------|---------|
| Visitor (top) | `CARRERASVISITA` | `HITSVISITA` | `ERRORESVISITA` | 20 |
| Home (bottom) | `CARRERASLOCAL` | `HITSLOCAL` | `ERRORESLOCAL` | 20 |

| Inning | Visitor (top) | Home (bottom) |
|--------|---------------|---------------|
| 1 | `INNINGVISITA1` | `INNINGLOCAL1` |
| 2 | `INNINGVISITA2` | `INNINGLOCAL2` |
| 3 | `INNINGVISITA3` | `INNINGLOCAL3` |
| 4 | `INNINGVISITA4` | `INNINGLOCAL4` |
| 5 | `INNINGVISITA5` | `INNINGLOCAL5` |
| 6 | `INNINGVISITA6` | `INNINGLOCAL6` |
| 7 | `INNINGVISITA7` | `INNINGLOCAL7` |
| 8 | `INNINGVISITA8` | `INNINGLOCAL8` |
| 9 (the last: label `ultimoinning`) | `INNINGVISITA9` | `INNINGLOCAL9` |

All innings default to 20.

## Opacity layers

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

| Layer | Class | Default opacity |
|-------|-------|----------------|
| The bottom bar (JG, JP and MVP) and the strip of the panel under it | `barra_opacidad` (two layers) | 1 |

## Markers

| Name | Start (tm) | Duration (dr) | Payload |
|------|-----------|--------------|---------|
| `play` | 0 | 33 | stage `pause`, order 1, `stop: "salida"` |
| `salida` | 33 | -33 | — (the entry played backwards) |
| `stop` | 60.0000024438501 | 1 | — |

`play` enters and pauses on frame 32, when the curtain finishes opening. No update animation: data
sent while on air replaces silently, crests included. The exit is the entry in reverse: `stop`
plays `salida` (frame 33 → 0, 1.1 s) and releases the layer when it ends. The `play` stage is
active from frame 0, so a `stop` that arrives mid-entry also plays `salida`: it jumps to the full
graphic and exits from there.
