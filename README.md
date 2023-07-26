# Svelte SRI plugin: `plugin-sri`

This plugin  adds **Subresource Integrity (SRI)** attributes to all resources imported by your `index.html` file.

## Before
![Before build](<misc/BeforeBuild.png>)


## After
![After build](<misc/AfterBuild.png>)

## Usage

1. Move the `plugin-sri` folder to the root of your project
1. Execute `npm i -D replace-in-file`
1. Add the paths to your include files in your `tsconfig.node.json` file with value `plugin-sri`
1. At `vite.config.ts` file add, like the image below:
    1. `import subresourceIntegrity from "plugin-sri";`
    1. In plugins: `subresourceIntegrity(),` 

![Vite config ts](<misc/ViteConfigTs.png>)

## Alternatives

[**rollup-plugin-sri**](https://github.com/JonasKruckenberg/rollup-plugin-sri/tree/master)

[**@small-tech/vite-plugin-sri**](https://github.com/small-tech/vite-plugin-sri)

## REFERENCES

[**Rollup - Build Hooks**](https://rollupjs.org/plugin-development/#build-hooks)

[**gatsby-plugin-sri**](https://github.com/ovhemert/gatsby-plugin-sri/tree/master)