# Svelte SRI plugin: `plugin-sri`

The plugin implementation is inside the `plugin-sri` folder.

## Before
![Before build](<misc/BeforeBuild.png>)


## After
![After build](<misc/AfterBuild.png>)

## Usage

1. Move the `plugin-sri` folder to the root of your project
1. Execute `npm i -D @types/node`
1. Execute `npm i -D replace-in-file`
1. Add the paths to your include files in your `tsconfig.node.json` file with value `plugin-sri`
1. At `vite.config.ts` file add, like the image below:
    1. `import subresourceIntegrity from "plugin-sri";`
    1. In plugins: `subresourceIntegrity(),` 

![Vite config ts](<misc/ViteConfigTs.png>)

## Alternatives

[**rollup-plugin-sri**](https://github.com/JonasKruckenberg/rollup-plugin-sri/tree/master)

[**@small-tech/vite-plugin-sri**](https://github.com/small-tech/vite-plugin-sri)

## References

[**Rollup - Build Hooks**](https://rollupjs.org/plugin-development/#build-hooks)

[**gatsby-plugin-sri**](https://github.com/ovhemert/gatsby-plugin-sri/tree/master)

## Discord

[**How can I add Subresource Integrity(SRI) for Svelte/Svelte Kit after build**](https://discord.com/channels/457912077277855764/1133746772947259502)
