# data

> **For AI control agents** — This file describes the controllable interface of a Lottie animation
> prepared for CasparCG. Use it to understand **what data to send** from a control client.
> Do not use this file to modify the animation itself.
>
> **Text layers** — send the target text string using the layer's CSS class name. The graphic shows
> it in capitals, whatever the case you send.
> **Markers** — `play` and `stop` control playback.

## Example payload

A control client sends a flat JSON object. Any subset of these keys is valid — omit what you don't need to change.

**Umpires:** the four umpires of the game, one row each: home plate, first, second and third base.
The keys are the ones of IVC's umpires graphic (`UMPIREHOME`, `UMPIREPRIMERA`, `UMPIRESEGUNDA`,
`UMPIRETERCERA`), so a controller can send both the same data. IVC also has `UMPIRE5` / `UMPIRE6`
(left and right field, six-man crews): this graphic has four rows and ignores them.

**Send all four names:** a name not sent stays as the design's `FRANCISCO RODRIGUEZ`. Send `""` to
leave a row empty.

**Placement:** bottom right (x 1350–1727, y 667–882), a panel with a black tab on top.

```json
{
  "UMPIREHOME": "JORGE TERAN",
  "UMPIREPRIMERA": "ALFONSO MARQUEZ",
  "UMPIRESEGUNDA": "RAMON COVA",
  "UMPIRETERCERA": "LUIS HERNANDEZ"
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

The names are box text: a longer string shrinks to fit instead of overflowing. At the design size
a name fits about 20 characters (`FRANCISCO RODRIGUEZ` is 19); longer goes smaller, in one line, and
stays at the top of its row. The position labels are fixed (centered in their column, about 6
characters); `titulo` and `titulo_entrada` are the ARBITROS texts.

| Class | Default text |
|-------|-------------|
| `UMPIREHOME` | FRANCISCO RODRIGUEZ (row 1, home plate) |
| `UMPIREPRIMERA` | FRANCISCO RODRIGUEZ (row 2, first base) |
| `UMPIRESEGUNDA` | FRANCISCO RODRIGUEZ (row 3, second base) |
| `UMPIRETERCERA` | FRANCISCO RODRIGUEZ (row 4, third base) |
| `rotulohome` | HOME |
| `rotuloprimera` | 1B |
| `rotulosegunda` | 2B |
| `rotulotercera` | 3B |
| `titulo` | ARBITROS (the black tab) |
| `titulo_entrada` | ARBITROS (the spaced-out card, only visible during the entry, frames 3–20) |

## Markers

| Name | Start (tm) | Duration (dr) | Payload |
|------|-----------|--------------|---------|
| `play` | 0 | 41 | stage `pause`, order 1, `stop: "salida"` |
| `salida` | 41 | -41 | — (the entry played backwards) |
| `stop` | 60.0000024438501 | 1 | — |

`play` enters and pauses on frame 40, when the tab finishes rising. A black card with ARBITROS rises
and uncovers the panel, the names fade in and the tab rises on top. No update animation: data sent
while on air replaces silently. The exit is the entry in reverse: `stop` plays `salida` (frame 41 →
0, 1.4 s) and releases the layer when it ends. The `play` stage is active from frame 0, so a `stop`
that arrives mid-entry also plays `salida`: it jumps to the full graphic and exits from there.
