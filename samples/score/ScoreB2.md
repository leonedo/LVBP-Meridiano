# ScoreB2

**For AI control agents** — This file describes the controllable interface of a Lottie animation
prepared for CasparCG. Use it to understand **what data to send** from a control client.
Do not use this file to modify the animation itself.
**Text layers** — send the target text string using the layer\'s CSS class name.
**Color fill layers** — send a hex color string (e.g. `#FF0000`) to change the fill color.
**Opacity layers** — send a number from `0` (transparent) to `1` (fully opaque).
**Image layers** — send a URL or asset reference to swap the displayed image.
**Markers** — `play` and `stop` control playback; any other marker name can be triggered
via `invoke` to drive timeline-based animations (e.g. animate-in, animate-out, transitions).
The path for the animation is the same as for this file with the same name. both JSON and the html that you need to call from the control


## Animation

| Property | Value |
|----------|-------|
| Size | 1920 × 1080 px |
| Frame rate | 29.9700012207031 fps |
| Frames | 0 – 330.000013441176 |
| Duration | 11.01 s |

## Text layers

| Class | nm | Default text |
|-------|----|-------------|
| `g1` | `.g1` | G1 |
| `g2` | `.g2` | G2 |
| `g3` | `.g3` | G3 |
| `g4` | `.g4` | G4 |
| `distancia` | `.distancia` | 100KM |
| `tiempo1` | `.tiempo1` | 00’16” |
| `tiempo2` | `.tiempo2` | 00’59” |
| `tiempo3` | `.tiempo3` | 02’25” |

## Image layers

| Class | nm | Ref ID |
|-------|----|--------|
| `bandera` | `.bandera` | `image_0` |
| `logo` | `.logo` | `image_1` |

## Markers

| Name | Start (tm) | Duration (dr) | Comment |
|------|-----------|--------------|---------|
| `play` | 0 | 30 | play |
| `stop` | 310 | 50 | stop |
