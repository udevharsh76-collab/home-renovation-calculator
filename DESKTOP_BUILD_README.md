# RenovateCalc Windows Desktop Build

This project remains a normal Vite/React website. The Electron wrapper is only for the Windows desktop build, so the live website can continue to work independently.

## On Windows

1. Install Node.js LTS.
2. Open Command Prompt/PowerShell in this project folder.
3. Run:

```bash
npm install
npm run desktop:build
```

The Windows installer will be created in:

`release/`

It will be an `.exe` installer named similar to `RenovateCalc Setup 0.0.0.exe`.

## Website

The existing website workflow is unchanged:

```bash
npm run build
```

The desktop wrapper loads the same Vite `dist` build, so calculation code and UI are shared.
