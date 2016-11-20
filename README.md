# The Health Guide (desktop version)
Lifestyle and Wellness application implemented with Angular 2 and Electron.

## Prerequisites

Both the CLI and generated project have dependencies that require Node 4 or higher, together
with NPM 3 or higher. Download it from https://nodejs.org/en/download/

## Getting started
Make sure you have the latest versions of node and npm
Install electron globaly
`npm install -g electron`

Clone the repository, install the dependencies, and run the server
```bash
git clone -b desktop https://github.com/razvantomegea/the-health-guide.git
cd the-health-guide
npm install
```

## Running
```bash
ng build --prod
robocopy ./electron ./dist /S /E
electron ./dist
```

## Packaging
To package the application for production to specific platforms, use the electron-packager
Install the electron packager globally by `npm install -g electron-packager`, then run the follwing commands (Windows)
```bash
ng build --prod
robocopy ./electron ./dist /S /E
electron-packager ./dist --appname=thehealthguide --platform=win32 --arch=x64 --out=thehealthguide-win32-x64 --overwrite=true
```
`electron-packager . the-health-guide --platform=win32 --arch=x64` for Windows x64.
If you want to package it for other platforms, visit (Electron-packagare API Docs)[https://github.com/electron-userland/electron-packager/blob/master/docs/api.md]