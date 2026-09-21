# ScoreB1

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
| Frames | 0 – 322.000013115329 |
| Duration | 10.74 s |

## Text layers

| Class | nm | Default text |
|-------|----|-------------|
| `titulo1` | `.titulo1` | (1) LIDERES CARRERA |
| `titulo2` | `.titulo2` | (2) G PERSEGUIDOR |
| `titulo3` | `.titulo3` | (3) G MAGLIA ROSA |
| `dato1` | `.dato1` | 50.9 |
| `texto1` | `.texto1` | KM TO GO |
| `dato2` | `.dato2` | 1’09” |
| `dato3` | `.dato3` | 1’09” |
| `tiempo` | `.tiempo` | 03:30:40 |

## Image layers

| Class | nm | Ref ID |
|-------|----|--------|
| `logo` | `.logo` | `image_0` |
| `bandera` | `.bandera` | `image_1` |

## Markers

| Name | Start (tm) | Duration (dr) | Comment |
|------|-----------|--------------|---------|
| `play` | 0 | 107 | play |
| `stop` | 272.000013115329 | 50 | stop |
| `entrada_tiempo` | 110 | 30 | entrada_tiempo |
| `update` | 140 | 30 | update |
