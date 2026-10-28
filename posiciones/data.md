# data

> **For AI control agents** — This file describes the controllable interface of a Lottie animation
> prepared for CasparCG. Use it to understand **what data to send** from a control client.
> Do not use this file to modify the animation itself.
>
> **Text layers** — send the target text string using the layer's CSS class name. The graphic shows
> it in capitals, whatever the case you send.
> **Opacity keys** (`*_opacidad`) — send `1` to show the layer, `0` to hide it.
> **Markers** — `play` and `stop` control playback.

## Example payload

A control client sends a flat JSON object. Any subset of these keys is valid — omit what you don't need to change.

**Standings:** full screen, centered. A red box with POSICIONES opens, a white one with Meridiano's
logo wipes it and slides up uncovering the table: eight rows, top to bottom, each with the team's
bar (its crest and colors), its name and JJ, JG, JP and DIF. The header (TABLA DE POSICIONES and
the column labels) and the row numbers (1–8, with 5–6 in yellow and 7–8 in red) are fixed.

**Same keys as the standings of LVBP-Venevision** (`posiciones`, which are those of the IVC
standings in LVBP-Stats), without `AVEequipo<n>`: this design has no AVE column (a controller can
send it anyway; it is ignored). `equipo<n>`, `JJequipo<n>`, `JGequipo<n>`, `JPequipo<n>` and
`DIFequipo<n>`, with `<n>` the row, 1 (top) to 8.

- **Team name:** the short name (`LEONES`, the `nombre_equipo` column). Every short name keeps the
  design size; a longer one shrinks within the bar (`NAVEGANTES DEL MAGALLANES` fits, smaller).
- **Team bar:** each row stacks the bars of the 8 teams, one key each: `<SIGLAS><n>_opacidad`, with
  the crest abbreviations of the score (`AGUI`, `ANZ` Caribes, `BRAVOS`, `CARD`, `LEO`, `MAGA`,
  `TIBUS`, `TIGRES`). Send `1` to the team in that row and `0` to the other seven, **in every row**:
  all 64 start visible, and a row that only gets its `1` keeps the design's team on top (Águilas,
  Bravos, Cardenales, Caribes, Leones, Magallanes, Tiburones, Tigres, rows 1 to 8).
- **Numbers:** centered in their column. JJ, JG and JP take 3 digits and DIF `10.5` or `--` (the
  leader) at the design size; longer ones shrink.
- **Fewer than 8 teams:** send `""` to the texts of the rows left over and `0` to their 8 bars.

```json
{
  "equipo1": "LEONES",
  "JJequipo1": "20",
  "JGequipo1": "13",
  "JPequipo1": "7",
  "DIFequipo1": "--",
  "AGUI1_opacidad": "0",
  "ANZ1_opacidad": "0",
  "BRAVOS1_opacidad": "0",
  "CARD1_opacidad": "0",
  "LEO1_opacidad": "1",
  "MAGA1_opacidad": "0",
  "TIBUS1_opacidad": "0",
  "TIGRES1_opacidad": "0",
  "equipo2": "TIBURONES",
  "JJequipo2": "20",
  "JGequipo2": "12",
  "JPequipo2": "8",
  "DIFequipo2": "1",
  "AGUI2_opacidad": "0",
  "ANZ2_opacidad": "0",
  "BRAVOS2_opacidad": "0",
  "CARD2_opacidad": "0",
  "LEO2_opacidad": "0",
  "MAGA2_opacidad": "0",
  "TIBUS2_opacidad": "1",
  "TIGRES2_opacidad": "0",
  "equipo3": "CARIBES",
  "JJequipo3": "20",
  "JGequipo3": "11",
  "JPequipo3": "9",
  "DIFequipo3": "2",
  "AGUI3_opacidad": "0",
  "ANZ3_opacidad": "1",
  "BRAVOS3_opacidad": "0",
  "CARD3_opacidad": "0",
  "LEO3_opacidad": "0",
  "MAGA3_opacidad": "0",
  "TIBUS3_opacidad": "0",
  "TIGRES3_opacidad": "0",
  "equipo4": "MAGALLANES",
  "JJequipo4": "20",
  "JGequipo4": "10",
  "JPequipo4": "10",
  "DIFequipo4": "3",
  "AGUI4_opacidad": "0",
  "ANZ4_opacidad": "0",
  "BRAVOS4_opacidad": "0",
  "CARD4_opacidad": "0",
  "LEO4_opacidad": "0",
  "MAGA4_opacidad": "1",
  "TIBUS4_opacidad": "0",
  "TIGRES4_opacidad": "0",
  "equipo5": "ÁGUILAS",
  "JJequipo5": "20",
  "JGequipo5": "10",
  "JPequipo5": "10",
  "DIFequipo5": "3",
  "AGUI5_opacidad": "1",
  "ANZ5_opacidad": "0",
  "BRAVOS5_opacidad": "0",
  "CARD5_opacidad": "0",
  "LEO5_opacidad": "0",
  "MAGA5_opacidad": "0",
  "TIBUS5_opacidad": "0",
  "TIGRES5_opacidad": "0",
  "equipo6": "CARDENALES",
  "JJequipo6": "20",
  "JGequipo6": "9",
  "JPequipo6": "11",
  "DIFequipo6": "4",
  "AGUI6_opacidad": "0",
  "ANZ6_opacidad": "0",
  "BRAVOS6_opacidad": "0",
  "CARD6_opacidad": "1",
  "LEO6_opacidad": "0",
  "MAGA6_opacidad": "0",
  "TIBUS6_opacidad": "0",
  "TIGRES6_opacidad": "0",
  "equipo7": "TIGRES",
  "JJequipo7": "20",
  "JGequipo7": "8",
  "JPequipo7": "12",
  "DIFequipo7": "5",
  "AGUI7_opacidad": "0",
  "ANZ7_opacidad": "0",
  "BRAVOS7_opacidad": "0",
  "CARD7_opacidad": "0",
  "LEO7_opacidad": "0",
  "MAGA7_opacidad": "0",
  "TIBUS7_opacidad": "0",
  "TIGRES7_opacidad": "1",
  "equipo8": "BRAVOS",
  "JJequipo8": "20",
  "JGequipo8": "7",
  "JPequipo8": "13",
  "DIFequipo8": "6",
  "AGUI8_opacidad": "0",
  "ANZ8_opacidad": "0",
  "BRAVOS8_opacidad": "1",
  "CARD8_opacidad": "0",
  "LEO8_opacidad": "0",
  "MAGA8_opacidad": "0",
  "TIBUS8_opacidad": "0",
  "TIGRES8_opacidad": "0"
}
```

## Animation

| Property | Value |
|----------|-------|
| Size | 1920 × 1080 px |
| Frame rate | 29.9700012207031 fps |
| Frames | 0 – 120.0000048877 |
| Duration | 4.00 s |

## Text layers

All are box text: a longer string shrinks to fit instead of overflowing.

| Row | Name | JJ | JG | JP | DIF | Default name |
|-----|------|----|----|----|-----|--------------|
| 1 | `equipo1` | `JJequipo1` | `JGequipo1` | `JPequipo1` | `DIFequipo1` | AGUILAS |
| 2 | `equipo2` | `JJequipo2` | `JGequipo2` | `JPequipo2` | `DIFequipo2` | BRAVOS |
| 3 | `equipo3` | `JJequipo3` | `JGequipo3` | `JPequipo3` | `DIFequipo3` | CARDENALES |
| 4 | `equipo4` | `JJequipo4` | `JGequipo4` | `JPequipo4` | `DIFequipo4` | CARIBES |
| 5 | `equipo5` | `JJequipo5` | `JGequipo5` | `JPequipo5` | `DIFequipo5` | LEONES |
| 6 | `equipo6` | `JJequipo6` | `JGequipo6` | `JPequipo6` | `DIFequipo6` | MAGALLANES |
| 7 | `equipo7` | `JJequipo7` | `JGequipo7` | `JPequipo7` | `DIFequipo7` | TIBURONES |
| 8 | `equipo8` | `JJequipo8` | `JGequipo8` | `JPequipo8` | `DIFequipo8` | TIGRES |

The numbers default to `20`.

Fixed texts, no need to send them (point text: a longer one overflows):

| Class | Default text |
|-------|-------------|
| `titulo_entrada` | POSICIONES (only during the entry: the red box, frames 2–28) |
| `titulo` | TABLA DE POSICIONES (the red header, left) |
| `columnas` | JJ JG JP DIF (the column labels, one text spaced to the columns) |

## Team bars

| Team | Row 1 | Row 2 | Row 3 | Row 4 | Row 5 | Row 6 | Row 7 | Row 8 |
|------|-------|-------|-------|-------|-------|-------|-------|-------|
| Águilas | `AGUI1_opacidad` | `AGUI2_opacidad` | `AGUI3_opacidad` | `AGUI4_opacidad` | `AGUI5_opacidad` | `AGUI6_opacidad` | `AGUI7_opacidad` | `AGUI8_opacidad` |
| Caribes | `ANZ1_opacidad` | `ANZ2_opacidad` | `ANZ3_opacidad` | `ANZ4_opacidad` | `ANZ5_opacidad` | `ANZ6_opacidad` | `ANZ7_opacidad` | `ANZ8_opacidad` |
| Bravos | `BRAVOS1_opacidad` | `BRAVOS2_opacidad` | `BRAVOS3_opacidad` | `BRAVOS4_opacidad` | `BRAVOS5_opacidad` | `BRAVOS6_opacidad` | `BRAVOS7_opacidad` | `BRAVOS8_opacidad` |
| Cardenales | `CARD1_opacidad` | `CARD2_opacidad` | `CARD3_opacidad` | `CARD4_opacidad` | `CARD5_opacidad` | `CARD6_opacidad` | `CARD7_opacidad` | `CARD8_opacidad` |
| Leones | `LEO1_opacidad` | `LEO2_opacidad` | `LEO3_opacidad` | `LEO4_opacidad` | `LEO5_opacidad` | `LEO6_opacidad` | `LEO7_opacidad` | `LEO8_opacidad` |
| Magallanes | `MAGA1_opacidad` | `MAGA2_opacidad` | `MAGA3_opacidad` | `MAGA4_opacidad` | `MAGA5_opacidad` | `MAGA6_opacidad` | `MAGA7_opacidad` | `MAGA8_opacidad` |
| Tiburones | `TIBUS1_opacidad` | `TIBUS2_opacidad` | `TIBUS3_opacidad` | `TIBUS4_opacidad` | `TIBUS5_opacidad` | `TIBUS6_opacidad` | `TIBUS7_opacidad` | `TIBUS8_opacidad` |
| Tigres | `TIGRES1_opacidad` | `TIGRES2_opacidad` | `TIGRES3_opacidad` | `TIGRES4_opacidad` | `TIGRES5_opacidad` | `TIGRES6_opacidad` | `TIGRES7_opacidad` | `TIGRES8_opacidad` |

## Image layers

| Class | Ref ID | Size | Default |
|-------|--------|------|---------|
| `logomeridiano` | `image_0` | 2000 × 1282 px | `images/img_0.png` (Meridiano's logo, only during the entry, frames 15–39; no need to send it) |

## Markers

| Name | Start (tm) | Duration (dr) | Payload |
|------|-----------|--------------|---------|
| `play` | 0 | 57 | stage `pause`, order 1, `stop: "salida"` |
| `salida` | 57 | -57 | — (the entry played backwards) |
| `stop` | 90.0000036657751 | 1 | — |

`play` enters and pauses on frame 56 (1.9 s): the red box grows with POSICIONES (2–15), the white
box with the logo wipes it (14–29) and slides up uncovering the table (29–44), the header drops in
(38–53), the numbers fade in (39–51) and the names (40–56). No update animation: data sent while on
air replaces silently. The exit is the entry in reverse: `stop` plays `salida` (frame 57 → 0,
1.9 s) and releases the layer when it ends. The `play` stage is active from frame 0, so a `stop`
that arrives mid-entry also plays `salida`: it jumps to the full table and exits from there.
