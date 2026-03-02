# Dungeon Crawler

A 2D adventure game built with Phaser 3 and TypeScript. Explore dungeons, fight enemies, and collect treasure.

## Features

- Playable character with animations (Faune)
- Enemies with AI (Lizard)
- Chest and item collection system
- Health system with UI
- Tile-based dungeon maps
- Keyboard controls

## Controls

| Key | Action |
|-----|--------|
| ↑ ↓ ← → | Move |
| Space | Attack / Open chest |

## Setup

```bash
# Install dependencies
npm install

# Development server
npm start

# Production build
npm run build

# Preview build
npm run preview
```

Development server runs at `http://localhost:8000`.

## Project Structure

```
dungeonGame/
├── public/
│   ├── assets/         # Backgrounds and UI icons
│   ├── character/      # Faune sprites and atlas
│   ├── dungeons/       # Dungeon maps (Tiled)
│   ├── enemies/        # Enemy sprites
│   ├── items/          # Item and chest sprites
│   ├── tiles/          # Tilesets
│   ├── ui/             # Hearts and UI elements
│   ├── weapons/        # Weapon sprites
│   └── favicon.svg
├── src/
│   ├── anims/          # Animation definitions
│   ├── characters/     # Faune class (player)
│   ├── enemies/        # Lizard class
│   ├── events/         # EventsCenter (event bus)
│   ├── items/          # Chest class
│   ├── scenes/         # Game, GameUI, Preloader
│   └── utils/          # Utilities (debug)
├── index.html
└── vite.config.js
```

## Stack

- [Phaser 3](https://phaser.io/) — game framework
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — bundler

## Credits

- **Brian Jaén** — Developer
- **[Ourcade](https://www.youtube.com/@ourcadetv)** — Tutorial and guidance

