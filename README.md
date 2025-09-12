# El Pollo Loco – Browser Jump-and-Run (Learning Project)

**El Pollo Loco** is a jump-and-run game for the browser. Collect coins, throw salsa bottles, stomp chickens, and face the end boss ("the crazy chicken"). The game runs on **HTML, CSS, and JavaScript** with a Canvas render loop, music and sound effects.

---

## About the project

**About**  
El Pollo Loco is a learning project. Make Pepe – the main character – run and jump through a desert level, collect coins and bottles, defeat chickens by stomping or throwing bottles, and finally fight the end boss. Background music and sound effects enhance the gameplay. The game works on **desktop and mobile**.

**Project structure & code quality**  
Implemented with **Canvas** and a clear **class-based architecture** for character, enemies, items, level, world, UI, and audio. The render loop uses **`requestAnimationFrame`** with delta-time updates for movement, physics, animations, and collisions. Overlay menus allow **resolution toggle (high/low)**, **fullscreen**, and **sound control**.

---

## Features

- **Core gameplay**: Run, jump, stomp enemies, and throw salsa bottles, end screen depending on loose or win
- **Boss fight**: Distance and state-based animations (alert/attack/hurt/dead) for the end boss.
- **Collectibles**: **Coins** and **bottles**; buy extra bottles with coins.
- **Status bars**: Character health, end boss health, bottles, coins (event-driven UI).
- **Audio**: Background music + SFX via **Web Audio API**; user mute preference persisted.
- **Overlays & menus**: Start, Controls, **resolution** & **fullscreen** toggles.
- **Responsive**: Desktop and mobile; on phones a simple on-screen control strip is shown, orientation handling.
- **Pause/resume**: Play/Pause button, auto-pause on tab blur.

---

## Architecture & key files

- **Entry & loader**
  - `/index.html` – canvas, status bars, UI buttons, overlay images (win/lose)
  - `/script.js` – bootstraps Keyboard events, Overlay, UI, Level, World, Game, Sound

- **Core classes (selection)** – `/models`
  - `Canvas` – canvas sizing, logical resolution & scaling (localStorage `scale`)
  - `World` – update/draw pipeline, camera, collisions, spawners
  - `Level` – background tiling, ground, entity factories (coins/bottles/enemies/end boss)
  - `Game` – game loop (`requestAnimationFrame`), pause/resume, game-over flow
  - `Character`, `Chicken`, `Chick`, `Endboss` – entities, animations, AI, physics
  - `Bottle`, `StandingBottle`, `Coin` – items & collectibles
  - `Statusbar` – event-driven UI bars (character/end boss/bottles/coins)
  - `Overlay` & `OverlayTemplates` – start, controls, legal screens; resolution toggle
  - `UI` – buttons (play/pause, fullscreen, sound), mobile controls, restart
  - `SoundManager` – Web Audio buffers, looped background, SFX, fade mute/unmute
  - `ActionTimer` – small scheduler for rate-limited actions (jumps, attacks, spawns)

- **Utilities & globals**
  - `/scripts/globals.js` – constants (canvas ratio, intervals) + inline SVG icons
  - `/scripts/utils.js` – helpers (instance factory, flattening, nested removal, defer)

- **Assets & styling**
  - `/img` – layered backgrounds, sprite sheets, UI icons
  - `/audio` – music & SFX (preloaded & buffered)
  - `/styles/*.css`, `style.css` – fonts, game layout, 16:9 aspect handling

> **Render loop note:** Movement, gravity, animations, timers, and collisions are updated with delta-time. A small minimum interval helps stabilize frame pacing.

---

## Controls

- **Move**: ← / →  
- **Jump**: Space  
- **Throw bottle**: **A**  
- **Buy bottle**: **Enter** (costs coins)  
- **Play/Pause**: **P**  
- **Fullscreen**: **F**  
- **Mute/Unmute**: **M**

On mobile, on-screen buttons appear; in portrait orientation a rotate prompt is shown.

---

## Known limitations (learning project)

- Simplified physics & **AABB** collisions (bounding boxes).
- Single level; enemies/items spawn periodically to keep the field active.
- No save/persistence; scores and progress reset on reload.
- Assets are optimized for a **16:9** canvas.

---

## Attributions

- **Background art**: Image by *brgfx* on Freepik
- **Music & SFX**: From Pixabay