# Svelte SRI plugin

Adds subresource integrity hashes to script and stylesheet imports from your `index.html` file at build time.

<p align="center">
 <a href="https://www.npmjs.com/package/vite-plugin-subresource-integrity">
    <img src="https://img.shields.io/npm/v/vite-plugin-subresource-integrity.svg?style=for-the-badge" alt="npm version">
  </a>
  <a href="https://github.com/JADSN1894/vite-plugin-sri/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge" alt="license MIT">
  </a>
</p>

## Before
![Before build](<misc/BeforeBuild.png>)

## After
![After build](<misc/AfterBuild.png>)

## Usage

1. `npm i --save-dev vite-plugin-subresource-integrity`
1. `import subresourceIntegrity from "vite-plugin-subresource-integrity";`
1. In your `vite.config.js` file:

```ts

import { defineConfig } from 'vite'
import subresourceIntegrity from 'vite-plugin-subresource-integrity'

export default defineConfig({
  // …
  plugins: [subresourceIntegrity()]
})

``` 

## Tested in

| **Framework**    | **Version**                                                                                                          |
| ---------------- | -------------------------------------------------------------------------------------------------------------------- |
| vanilla(v5.1.6)  | <img src="https://img.shields.io/npm/v/vite-plugin-subresource-integrity.svg?style=for-the-badge" alt="npm version"> |
| vue(v3.3.4)      | <img src="https://img.shields.io/npm/v/vite-plugin-subresource-integrity.svg?style=for-the-badge" alt="npm version"> |
| react(v18.2.0)   | <img src="https://img.shields.io/npm/v/vite-plugin-subresource-integrity.svg?style=for-the-badge" alt="npm version"> |
| preact(v10.16.0) | <img src="https://img.shields.io/npm/v/vite-plugin-subresource-integrity.svg?style=for-the-badge" alt="npm version"> |
| lit(v2.8.0)      | <img src="https://img.shields.io/npm/v/vite-plugin-subresource-integrity.svg?style=for-the-badge" alt="npm version"> |
| svelte(v4.1.2)   | <img src="https://img.shields.io/npm/v/vite-plugin-subresource-integrity.svg?style=for-the-badge" alt="npm version"> |
| solid(v1.7.9)    | <img src="https://img.shields.io/npm/v/vite-plugin-subresource-integrity.svg?style=for-the-badge" alt="npm version"> |
| qwik(v1.2.6)     | <img src="https://img.shields.io/npm/v/vite-plugin-subresource-integrity.svg?style=for-the-badge" alt="npm version"> |

## Alternatives

[**rollup-plugin-sri**](https://github.com/JonasKruckenberg/rollup-plugin-sri/tree/master)

[**@small-tech/vite-plugin-sri**](https://github.com/small-tech/vite-plugin-sri)

## References

[**Rollup - Build Hooks**](https://rollupjs.org/plugin-development/#build-hooks)

[**Third Party JavaScript Management Cheat Sheet**](https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Javascript_Management_Cheat_Sheet.html#subresource-integrity)

[**Content Security Policy Cheat Sheet**](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html#defense-in-depth)

[**Ship ESM & CJS in one Package**](https://antfu.me/posts/publish-esm-and-cjs)

## Repositories

[**Fork of @small-tech/vite-plugin-sri that uses typescript**](https://github.com/JonathanLee-LX/vite-plugin-sri)

[**gatsby-plugin-sri**](https://github.com/ovhemert/gatsby-plugin-sri/tree/master)

[**vite-plugin-inspect**](https://github.com/antfu/vite-plugin-inspect)

[**DefinitelyTyped**](https://github.com/DefinitelyTyped/DefinitelyTyped)

## GitHub issues

[**How to execute a plugin after assets are fully generated?**](https://github.com/vitejs/vite/discussions/11043)

## Discord

[**How can I add Subresource Integrity(SRI) for Svelte/Svelte Kit after build**](https://discord.com/channels/457912077277855764/1133746772947259502)

## Contributing

Found a bug, have a suggestion for a new feature? [Submit an issue](https://github.com/JADSN1894/vite-plugin-sri/issues/new/choose).
