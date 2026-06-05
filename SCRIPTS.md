# Build Scripts Guide

Use these commands from the `voice-game` folder:

## `npm run build:web`

- Cleans the `www` folder (removes old files first).
- Copies:
  - `index.html`
  - `style.css`
  - `script.js`
  - `assets/` folder
- Use this when you only want to refresh web files for Capacitor.

## `npm run android`

- Runs `build:web` first.
- Then runs `npx cap sync android`.
- Use this after changing your game files before opening/running Android.

## Typical workflow

1. Edit your game files.
2. Run `npm run android`.
3. Open Android project with `npx cap open android` (if needed).
