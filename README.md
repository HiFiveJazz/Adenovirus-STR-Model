# 🧬 Adenovirus STR Calculator — Build & Release (vite-electron-builder)

This app uses the **vite-electron-builder** boilerplate by @cawa-93.  
The same commands from that template work here.

---

## 📦 Where build artifacts go

After packaging, **installers / bundles** are written to:

```
dist/
```

(That’s electron-builder’s default output used by the template.)

---

## 🖼️ Where app images/icons live

Place app icons and build resources in:

```
buildResources/
```

This is the folder the template ships with for packaging assets (e.g., `.ico`, `.icns`, PNGs).  
Electron Builder also supports the conventional `build/icons` layout, but in this template you should use **`buildResources/`**.

---

## ▶️ Development

```bash
npm start
```

Starts the app in dev mode with hot reload.

---

## 🚀 Packaging (Creates files in `dist/`)

The template’s one-stop packaging script:

```bash
npm run compile
```

This runs the build across workspaces and then calls **electron-builder** to produce installers/bundles.  
You can also pass electron-builder flags after `--` to target specific OS/CPU combos.

### Per-platform commands

> Note: build **macOS targets on macOS**. Windows ARM/x64 on Windows, Linux on Linux (or matching container).

#### Windows
- **Windows x86 (32-bit / ia32)**
  ```bash
  npm run compile -- --win ia32
  ```
- **Windows x64**
  ```bash
  npm run compile -- --win x64
  ```
- **Windows ARM64**
  ```bash
  npm run compile -- --win arm64
  ```

#### Linux (x86_64)
- **AppImage (x64)**  
  ```bash
  npm run compile -- --linux AppImage -a x64
  ```
  *(Optionally add `deb,rpm`: `--linux AppImage,deb,rpm -a x64`)*

#### macOS
- **macOS (Intel x64)**
  ```bash
  npm run compile -- --mac x64
  ```
- **macOS (Apple Silicon arm64)**
  ```bash
  npm run compile -- --mac arm64
  ```
- **Universal (single app for x64+arm64)**
  ```bash
  npm run compile -- --mac universal
  ```

These commands are standard **electron-builder** targets/architectures and are passed through the template’s `compile` script.

---

## 🗂️ Typical artifacts you’ll see in `dist/`

- Windows: `Adenovirus-STR-Calculator-Setup-x64.exe`, `...-arm64.exe`, or `...-ia32.exe`
- macOS: `Adenovirus STR Calculator-x64.dmg`, `...-arm64.dmg`, or `...-universal.dmg`
- Linux: `adenovirus-str-calculator-x86_64.AppImage` (plus `.deb`/`.rpm` if enabled)

*(Exact names depend on your electron-builder config: `productName`, `artifactName`, targets, code signing, etc.)*

---

## 🧰 Quick checklist

- Icons in **`buildResources/`** (`.ico` for Windows, `.icns` for macOS, or high-res PNGs)
- Version updated in `package.json`
- Run platform builds on their native OS
- Verify output in **`dist/`** and smoke-test installers

---

## Reference

- vite-electron-builder README (scripts & packaging flow)
- Repo’s `buildResources/` directory (icons/resources)
- electron-builder icons docs (formats & conventions)
