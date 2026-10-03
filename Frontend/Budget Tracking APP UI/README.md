# Budget Tracking APP UI

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Android app with Tauri

Run these commands from this folder, `Frontend/Budget Tracking APP UI`:

```sh
npm install
npm run tauri:android:init
npm run tauri:android:dev
```

To create a release Android build:

```sh
npm run tauri:android:build
```

Rust, Android Studio, the Android SDK, and Java must be installed before running the Android commands. On Windows, enable **Developer Mode** in Settings > System > For developers so Tauri can create the symbolic links required by the Android build.

The release APK will be created at:

```text
src-tauri/gen/android/app/build/outputs/apk/release/app-universal-release-unsigned.apk
```
