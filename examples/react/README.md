# MuPDF with React, TypeScript, Vite

## Notable files
- `src/workers/mupdf.worker.ts`: imports the worker script, exposes functionality from it.
- `src/hooks/useMupdf.hook.ts`: enables and initializes the worker, exposes hooks to interact with it.
- `src/App.tsx`: calls the hook, and uses some demo functionality.

## Setup

Before running the development server or building the project, make sure to install the dependencies:
`npm i`

## Development server

Run `npm run dev` for a dev server. Navigate to `http://localhost:5173/`. The application will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Preview production build

After building the project, you can preview the production build locally using:  `npm run preview` 
This command will serve the contents of the `dist` directory, allowing you to check the production version of your application before deployment. By default, it will be available at `http://localhost:4173/`.
