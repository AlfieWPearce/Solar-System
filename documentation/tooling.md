# Tooling & Build System

This project uses a lightweight Node.js toolchain to keep code quality high and prepare for future bundling (Rollup, Vite, Webpack, or others).

At present the main purposes of the toolchain are:

- Running ESLint for code coorectness
- Running Prettier for formatting
- Running Vite to run and compile
- Keeping dependencies organised
- Preparing a foundation for future bundlers

---

## Installed Tools

### 1. **ESLint**

Configuration: `eslint.config.mjs`

Used to:

- Detect unused imports
- Enforce consistent syntax
- Catch common logic mistakes
- Keep ES module structure clean

Run it with, either:

```bash
npm run lint
npm run lint:fix
```

### 2. Prettier

Configuration: `.prettierrc`

Used to:

- Format JavaScript, HTML, CSS & JSON consistently
- Provide readable diffs
- Avoid style arguments

Run it with:

```bash
npm run format
```

### 3. Vite

configuration: `vite.config.js`

Used to:

- Serve ES modules natively
- Update browser instantly on changes
- Bundle the project into an optimised `/dist` folder for deployment
- Works cleanly with libraries like p5.js & three.js

Run it with:

```bash
npm run dev
npm run build
npm run preview
```
