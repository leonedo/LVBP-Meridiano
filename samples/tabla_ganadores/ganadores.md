# ganadores
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
| Frames | 0 – 452.000018410337 |
| Duration | 15.08 s |

## Text layers

| Class | nm | Default text |
|-------|----|-------------|
| `titulo_tabla` | `.titulo_tabla` | TABLA DE GANADORES |
| `etapa` | `.etapa` | STAGE 20 |
| `pos1` | `.pos1` | 1 |
| `nombre1` | `.nombre1` |   |
| `dato1` | `.dato1` |   |
| `tiempo1` | `.tiempo1` |   |
| `pos2` | `.pos2` | 2 |
| `nombre2` | `.nombre2` |   |
| `dato2` | `.dato2` |   |
| `tiempo2` | `.tiempo2` |   |
| `pos3` | `.pos3` | 3 |
| `nombre3` | `.nombre3` |   |
| `dato3` | `.dato3` |   |
| `tiempo3` | `.tiempo3` |   |
| `pos4` | `.pos4` | 4 |
| `nombre4` | `.nombre4` |   |
| `dato4` | `.dato4` |   |
| `tiempo4` | `.tiempo4` |   |
| `pos5` | `.pos5` | 5 |
| `nombre5` | `.nombre5` |   |
| `dato5` | `.dato5` |   |
| `tiempo5` | `.tiempo5` |   |
| `pos6` | `.pos6` | 6 |
| `nombre6` | `.nombre6` |   |
| `dato6` | `.dato6` |   |
| `tiempo6` | `.tiempo6` |   |
| `pos7` | `.pos7` | 7 |
| `nombre7` | `.nombre7` |   |
| `dato7` | `.dato7` |   |
| `tiempo7` | `.tiempo7` |   |
| `pos8` | `.pos8` | 8 |
| `nombre8` | `.nombre8` |   |
| `dato8` | `.dato8` |   |
| `tiempo8` | `.tiempo8` |   |
| `pos9` | `.pos9` | 9 |
| `nombre9` | `.nombre9` |   |
| `dato9` | `.dato9` |   |
| `tiempo9` | `.tiempo9` |   |
| `pos10` | `.pos10` | 10 |
| `nombre10` | `.nombre10` |   |
| `dato10` | `.dato10` |   |
| `tiempo10` | `.tiempo10` |   |

## Image layers

| Class | nm | Ref ID |
|-------|----|--------|
| `logo` | `.logo` | `image_0` |

## Markers

| Name | Start (tm) | Duration (dr) | Comment |
|------|-----------|--------------|---------|
| `play` | 0 | 100 | play |
| `stop` | 440 | 50 | stop |
| `update` | 221 | 30 | update |

## Payload

Flat JSON object — one key per text layer, string values.

```json
{
  "titulo_tabla": "TABLA DE GANADORES",
  "etapa": "ELITE",
  "pos1": "1",
  "nombre1": "APELLIDO NOMBRE",
  "dato1": "100",
  "tiempo1": "1:23:45",
  "pos2": "2",
  "nombre2": "APELLIDO NOMBRE",
  "dato2": "85",
  "tiempo2": "1:24:10"
}
```

- `dato` → puntos del corredor
- `nombre` → formato `APELLIDO NOMBRE` en mayúsculas
- Repetir el patrón hasta `pos10` / `nombre10` / `dato10` / `tiempo10`
- Campos sin corredor: enviar `""`

## Workflow

```
// Entrada (primera vez o al cambiar categoría)
cg.add(cgLayer, 'zfx-ciclismo/tabla_ganadores/ganadores', payload, true)

// Actualizar datos en vivo (dispara animación de transición)
cg.update(cgLayer, payload)
cg.invoke(cgLayer, 'update')

// Salida
cg.stop(cgLayer)
```
