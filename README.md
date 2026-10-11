# RAILWAY SIMULATOR 3D
**MADE BY RAILWAYOP** — Japan × Indonesia Rail Experience

A mobile-first, procedural Three.js railway driving prototype. This is a playable foundation, not a finished commercial-grade simulator. The 12-car train, traction/braking, wheel rotation, livery changes, camera presets, doors, headlights, route scenery, menu flow, and persistent settings are implemented. Several advanced settings are UI/configuration prototypes and do not yet alter rendering or physics.

## Run on Android
Because the project uses JavaScript modules, do not open `index.html` directly using `file://`.

1. Extract `RAILWAY_SIMULATOR_3D.zip` into a folder.
2. Open the folder in a phone-friendly editor that offers a local web server, or run a local server in Termux:
   ```sh
   pkg install python
   cd /path/to/RAILWAY_SIMULATOR_3D
   python -m http.server 8080
   ```
3. Open `http://127.0.0.1:8080` in Chrome. If serving from a different app, use the local URL it provides.
4. Landscape orientation is recommended. The Three.js module is loaded from jsDelivr, so the first launch needs internet access.

## Controls
- **POWER +**: increase traction notch (P0–P5).
- **BRAKE −**: increase brake notch (B0–B5).
- **NEUTRAL**: set power and brake to zero.
- **DOORS OPEN/CLOSE**: doors are locked while moving.
- **HORN**: hold to sound a synthesized horn.
- **HEADLIGHTS**: toggle front lights.
- **CAMERA**: cycle through six camera presets.
- Keyboard: Arrow Up = power, Arrow Down = brake, Space = brake, C = camera, H = hold horn.
- Pause freezes simulation progression.

## Notes and limitations
- All train and environment models are procedural approximations, not exact reproductions of real rolling stock.
- Three selectable routes use different path curves, but the scenery and track infrastructure are shared. Track switches, timetable scoring, realistic rail signaling, full passenger interiors, real recorded sounds, and sophisticated station dwell logic are not yet implemented.
- The horn is synthesized using Web Audio; there are no external audio files.
- Browser performance varies by device. Low-power graphics and a stable 30 FPS are goals, not guarantees.
- The Settings screen lists 130+ identifiable options. Core settings persistence, sliders, toggles, select values, export/import and several utility actions work; advanced graphics and simulation settings are not all connected to engine behavior yet.
- Three.js 0.160.0 is loaded from jsDelivr. Offline operation requires downloading the library and adjusting the import map.
