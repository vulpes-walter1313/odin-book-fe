# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```

# custom font sizes

```text
fontSize: {
  deskh1: ["3.375rem", { lineHeight: "110%", fontWeight: "700"}],
	deskh2: ["2.8125rem", { lineHeight: "110%", fontWeight: "700"}],
	deskh3: ["2.3125rem", { lineHeight: "110%", fontWeight: "700"}],
	deskh4: ["1.9375rem", { lineHeight: "110%", fontWeight: "700"}],
	deskh5: ["1.625rem", { lineHeight: "110%", fontWeight: "700"}],
	deskh6: ["1.375rem", { lineHeight: "110%", fontWeight: "700"}],
	deskp: ["1.125rem", { lineHeight: "150%", fontWeight: "400"}],
	desksmp: ["0.9375rem", { lineHeight: "150%", fontWeight: "400"}],
	deskxsp: ["0.8125rem", { lineHeight: "150%", fontWeight: "400"}],
	mobh1: ["2.25rem", { lineHeight: "110%", fontWeight: "700"}],
	mobh2: ["2rem", { lineHeight: "110%", fontWeight: "700"}],
	mobh3: ["1.8125rem", { lineHeight: "110%", fontWeight: "700"}],
	mobh4: ["1.625rem", { lineHeight: "110%", fontWeight: "700"}],
	mobh5: ["1.4375rem", { lineHeight: "110%", fontWeight: "700"}],
	mobh6: ["1.25rem", { lineHeight: "110%", fontWeight: "700"}],
	mobp: ["1.125rem", { lineHeight: "150%", fontWeight: "400"}],
	mobsmp: ["1rem", { lineHeight: "150%", fontWeight: "400"}],
	mobxsp: ["0.875rem", { lineHeight: "150%", fontWeight: "400"}],
}
```
