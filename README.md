# Proyecto de Computacion Grafica II - Hito 4: Juego 3D en Navegador

## Datos del Proyecto
- **Materia:** Computacion Grafica II
- **Evaluacion:** Hito 4 - Desarrollo de Juego 3D en Navegador
- **Tematica:** Darksiders II - El Laberinto de las Almas
- **Equipo / Integrantes:**
  - Mirkof13
  - Dylannasd312
- **Tecnologias:** React 19, Three.js, @react-three/fiber, @react-three/drei, Vite

---

## 1. Descripcion General
El proyecto consiste en una aplicacion interactiva 3D desarrollada con React Three Fiber. El jugador toma el control de Muerte (Death), personaje inspirado en el universo de Darksiders II, quien debe atravesar un laberinto gótico amurallado desde el Punto A (Santuario de Partida) hasta el Punto B (Gran Castillo del Trono).

A diferencia de un recorrido lineal, el escenario cuenta con un trazado de corredores perpendiculares con muros solidos, giros en esquina y una rampa ascendente (la cuesta) que conduce al altar del Cubo de Alma. El jugador debe resolver el puzzle recogiendo la reliquia para que el porton levadizo del castillo se abra y permita acceder a la meta.

El entorno incluye islas de basalto flotantes en el vacio con oscilacion dinamica, iluminacion direccional con proyeccion de sombras y perspectiva isometrica superior que evita oclusiones visuales.

---

## 2. Requisitos Cumplidos

1. **Objeto 3D controlado por el usuario:**
   - Modelado procedural con formas anatomicas estilizadas y suaves (capsulas, hombreras redondeadas, capa flotante, mascara de calavera de marfil, cuernos y armas gemelas con brillo espectral).
   - Movimiento fluido mediante teclado (WASD / Flechas) y controles tactiles en pantalla para celulares.
   - Camara isometrica en tercera persona elevada a 45 grados que sigue al personaje de forma amortiguada (lerp).

2. **Punto A y Punto B claramente identificados:**
   - **Punto A (Santuario):** Ubicado en `[0, 1, 34]`, delimitado con losa de piedra, columnas con braseros de fuego fatuo y letrero 3D abierto sin techos obstructivos.
   - **Punto B (Castillo del Trono):** Ubicado en `[0, 1, -47]`, compuesto por murallas perimetrales bajas, columnas, trono central y portal de victoria dorado.

3. **Obstaculos moviles y colisiones:**
   - 5 obstaculos moviles distribuidos a lo largo del mapa (cuchillas oscilantes, pendulo con puas, centinela demoniaco en la cuesta y hojas de segador).
   - Calculo de colision en tiempo real mediante distancia euclidiana en el ciclo de animacion (useFrame).
   - Al tocar un obstaculo, se incrementa el contador de muertes y el personaje reaparece en el Punto A.

4. **Sistema de colision con muros (Sliding Collision):**
   - El escenario esta delimitado por muros de piedra solidos.
   - Algoritmo de comprobacion AABB por eje que permite al personaje deslizarse suavemente contra las paredes al desplazarse en diagonal sin atravesarlas ni quedar atascado.

5. **Puzzle interactivo de la Cuesta:**
   - Una rampa lateral eleva al jugador hasta el altar superior donde flota el Cubo de Alma.
   - Al acercarse a una distancia menor a 3.2 unidades, el HUD muestra la opcion de interaccion.
   - Al presionar la tecla `[E]` o el boton tactil, la reliquia es absorbida y el porton levadizo del castillo se eleva automaticamente.

6. **Contador de muertes y mensaje de victoria:**
   - HUD superior con contador de muertes, estado de la reliquia y cronometro de partida.
   - Dialogo modal de victoria al ingresar al Punto B con resumen de estadisticas y opcion de reiniciar partida sin recargar la pagina.

7. **Compatibilidad total con dispositivos moviles:**
   - D-Pad direccional virtual y boton de accion interactivo en pantalla adaptado para pantallas tactiles con deteccion automatica segun el dispositivo.

8. **Motor de audio sintetizado (Web Audio API):**
   - Efectos de sonido generados por codigo: pisadas sobre piedra, colision/muerte, recogida de reliquia, apertura del porton, fanfarria de victoria y musica ambiental continua.

---

## 3. Arquitectura de Componentes

- `src/App.jsx`: Componente principal. Gestiona el estado de muertes, puzzle, victoria, distribucion de obstaculos y renderizado del Canvas 3D.
- `src/components/Jugador.jsx`: Logica del personaje, fisicas de desplazamiento, colisiones con muros (AABB) y deteccion de impactos con obstaculos.
- `src/components/Obstaculo.jsx`: Componente modular y reutilizable para trampas moviles con distintas trayectorias, velocidades y radios de impacto.
- `src/components/Escenario.jsx`: Construccion geometrica del laberinto (suelos de piedra, muros laterales, columnas, antorchas, cuesta, altar, castillo e islas flotantes dinamicas).
- `src/components/Marcador.jsx`: Interfaz de usuario (HUD), objetivos activos, aviso de interaccion y pantalla de victoria.
- `src/components/TouchControls.jsx`: Controles en pantalla optimizados para celulares y tablets.
- `src/utils/mapData.js`: Definicion matematica de coordenadas, limites transitables y calculo de pendientes en rampas.
- `src/utils/audio.js`: Sintetizador de audio en tiempo real basado en la API nativa de audio del navegador.

---

## 4. Controles

| Entrada | Funcion |
| :--- | :--- |
| `W`, `A`, `S`, `D` / Flechas | Movimiento en 4 direcciones |
| `E` / Barra Espaciadora | Tomar el Cubo de Alma en el altar |
| D-Pad Virtual (Movil) | Desplazamiento tactil |
| Boton ACCION [E] (Movil) | Interaccion tactil con el puzzle |
| Boton AUDIO | Silenciar o reactivar el sonido |
| Boton PAD | Mostrar u ocultar controles tactiles |

---

## 5. Estructura de Ramas en Git (Git Flow)

El repositorio sigue la organizacion por ramas especificada en la rubrica:

- `main`: Rama de integracion principal con el codigo probado y funcional.
- `feature/jugador`: Movimiento del objeto 3D, controles, camara y colision con muros (Dylannasd312).
- `feature/obstaculos`: Obstaculos moviles e islas flotantes con deteccion de choques (Mirkof13).
- `feature/marcador`: Contador de muertes, Punto A, Punto B, puzzle y pantalla de victoria (Mirkof13 y Dylannasd312).

---

## 6. Instalacion y Ejecucion Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para produccion
npm run build
```
El proyecto se servira por defecto en `http://localhost:5173/`.
