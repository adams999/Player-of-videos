# Simustream Strut YTPlayer

This is a monorepo containing different video player implementations.

## Components

The project is divided into three main components:

*   **`default-player`**: A video player built with webpack. It seems to be a standalone application with its own dependencies and build process.
*   **`lib`**: A shared library of components used by the other players. It also has its own build process.
*   **`rulive-player`**: A simpler video player that uses HTML, CSS, and jQuery.

## Getting Started

To build the `default-player` and `lib` components, you need to have Node.js and npm installed.

### Build `default-player`

```bash
cd default-player
npm install
npm run build
```

### Build `lib`

```bash
cd lib
npm install
npm run build
```

### `rulive-player`

This player can be run by opening the `view.html` or `Trailer.html` file in a web browser.
