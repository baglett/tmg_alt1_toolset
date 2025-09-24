# Dungeoneering Optimization Gate Engine

A tool for RuneScape 3 Dungeoneering that helps optimize gate and key placement.

## Installation

### Quick Install (Online)
Choose the appropriate branch for installation:

#### Production (Main Branch)
`alt1://addapp/https://baglett.github.io/tmg_alt1_toolset/dungeoneering-optimizer/appconfig.json`

#### Development Branch
`alt1://addapp/https://baglett.github.io/tmg_alt1_toolset/development/dungeoneering-optimizer/appconfig.json`

#### Current Feature Branch
`alt1://addapp/https://baglett.github.io/tmg_alt1_toolset/feature/claude_setup/dungeoneering-optimizer/appconfig.json`

### Development
1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

### Production
1. Build the project:
```bash
npm run build
```

2. Install in Alt1:
- **Online (Recommended)**:
  - Use one of the Quick Install links above based on your preferred branch
  - Main branch for stable releases, development for latest features, feature branches for testing

- **Local Development Install**:
  - Start dev server: `npm run dev`
  - Install locally: `alt1://addapp/http://localhost:9000/appconfig.json`
  - Or manually add via Alt1 Browser: Open Alt1 Toolkit -> Add App -> Select `dist/index.html`

## Features
- Dungeon size configuration (Small, Medium, Large)
- Screen capture and automatic map updates
- Key and gate placement optimization
- Mouse text OCR integration

## Development
This project uses:
- TypeScript
- Webpack
- Alt1 Toolkit API 