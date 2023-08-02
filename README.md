# Svelte SRI plugin: `plugin-sri`

The plugin implementation is inside the `plugin-sri` folder.

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
import sri from '@small-tech/vite-plugin-sri'

export default defineConfig({
  // …
  plugins: [sri()]
})
``` 

![Vite config ts](<misc/ViteConfigTs.png>)

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

## Discord

[**How can I add Subresource Integrity(SRI) for Svelte/Svelte Kit after build**](https://discord.com/channels/457912077277855764/1133746772947259502)
