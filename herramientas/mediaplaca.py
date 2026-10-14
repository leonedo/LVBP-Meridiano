# Normaliza los escudos de placa_juego: un PNG por equipo con la media placa (fondo, marca de agua y
# escudo), como los manda el diseñador (AGUILAS.png, BRAVOS.png...).
# Uso: python3 herramientas/mediaplaca.py <carpeta con los PNG> placa_juego/images
# Necesita ImageMagick 7 (magick).
#
# Llegan con el mismo encuadre pero cada uno con su borde: de 1 a 5 px transparentes o a medias (y
# alguna raya suelta), y de 872 a 880 px de ancho. Ese borde se veía en la placa como un marco
# disparejo. Queda el área opaca, llevada a ANCHO x ALTO (recorta lo que sobre, centrado) y sin
# alfa. El marco y la línea del centro los ponen los mates de la placa (mitades() en prep.js).
import os, shutil, subprocess, sys

ANCHO, ALTO = 872, 787  # la proporción de la caja de la imagen (463 x 418), a la resolución que llegan
UMBRAL = 250            # alfa mínimo de un borde para que cuente como opaco
EQUIPOS = ['aguilas', 'bravos', 'cardenales', 'caribes', 'leones', 'magallanes', 'tiburones', 'tigres']
# Los nombres del export, que manda el LVBP-Stats de v0.0.17: quedan como copia
COPIAS = {'img_0.png': 'tiburones', 'img_1.png': 'magallanes'}


def area_opaca(ruta):
    w, h = map(int, subprocess.check_output(['magick', 'identify', '-format', '%w %h', ruta]).split())
    a = subprocess.check_output(['magick', ruta, '-alpha', 'extract', '-depth', '8', 'gray:-'])
    fila = lambda y, x0, x1: min(a[y * w + x0:y * w + x1])
    columna = lambda x, y0, y1: min(a[y * w + x] for y in range(y0, y1))
    l, t, r, b = 0, 0, w, h
    while True:
        antes = (l, t, r, b)
        if fila(t, l, r) < UMBRAL: t += 1
        if fila(b - 1, l, r) < UMBRAL: b -= 1
        if columna(l, t, b) < UMBRAL: l += 1
        if columna(r - 1, t, b) < UMBRAL: r -= 1
        if (l, t, r, b) == antes: break
    if r - l < ANCHO * 0.95 or b - t < ALTO * 0.95:
        raise SystemExit(f'{ruta}: el área opaca es {r - l}x{b - t}, mucho menos que {ANCHO}x{ALTO}')
    adentro = min(min(a[y * w + l:y * w + r]) for y in range(t, b))
    if adentro < 255:
        raise SystemExit(f'{ruta}: tiene transparencias adentro del área opaca')
    return w, h, l, t, r, b


origen, destino = sys.argv[1], sys.argv[2]
hechos = {}
for archivo in sorted(os.listdir(origen)):
    nombre, ext = os.path.splitext(archivo)
    if ext.lower() != '.png' or nombre.lower() not in EQUIPOS:
        continue
    w, h, l, t, r, b = area_opaca(os.path.join(origen, archivo))
    salida = os.path.join(destino, nombre.lower() + '.png')
    subprocess.check_call(['magick', os.path.join(origen, archivo), '-crop', f'{r - l}x{b - t}+{l}+{t}', '+repage',
                           '-filter', 'Lanczos', '-resize', f'{ANCHO}x{ALTO}^', '-gravity', 'center',
                           '-extent', f'{ANCHO}x{ALTO}', '-alpha', 'off', '-strip', 'PNG24:' + salida])
    hechos[nombre.lower()] = salida
    print(f'{archivo}: {w}x{h}, borde L{l} T{t} R{w - r} B{h - b} -> {salida}')
for copia, equipo in COPIAS.items():
    if equipo in hechos:
        shutil.copyfile(hechos[equipo], os.path.join(destino, copia))
        print(f'{copia} = {equipo}')
faltan = [e for e in EQUIPOS if e not in hechos]
if faltan:
    print('Faltan:', ', '.join(faltan))
