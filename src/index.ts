
import { Plugin, ResolvedConfig } from 'vite'
import { readFileSync, writeFileSync } from 'fs'
import { createHash } from 'node:crypto'
import { resolve } from 'path'
import { OutputBundle } from 'rollup'
import { load } from 'cheerio';
export default function vitePluginSri(): Plugin {

  let config: ResolvedConfig
  const outputBundle: OutputBundle = {}

  return {
    name: 'vite-plugin-sri',
    apply: 'build',
    enforce: 'post',

    configResolved(resolvedConfig) {
      config = resolvedConfig
    },

    writeBundle: {
      sequential: true,
      order: "post",
      async handler({ dir }, bundle) {
        const outDir = config?.build?.outDir || (dir ?? 'dist')
        const buildDirectory = resolve(outDir);

        const calculateIntegrityHashes = async (element: cheerio.TagElement) => {
          let source: string | Uint8Array | undefined
          const elementAttributes = element.attribs
          const attributeName = element.attribs.src ? 'src' : 'href'
          const resourceUrl = element.attribs[attributeName]

          const resourcePath =
            resourceUrl.indexOf(config.base) === 0
              ? resourceUrl.substring(config.base.length)
              : resourceUrl

          const resourceType = Object.entries(bundle).find(([, bundleItem]) => bundleItem.fileName === resourcePath)?.[1]

          if (!resourceType) {
            config.logger.warn(`cannot find ${resourcePath} in output bundle.`)
            try {
              source = readFileSync(
                resolve(dir ?? 'Dir not found', resourcePath)
              )
            } catch (error) {
              source = void 0
            }
          } else {
            if (resourceType.type === 'asset') {
              source = resourceType.source
            } else {
              source = resourceType.code
            }
          }

          if (source)
            elementAttributes.integrity = `sha512-${createHash('sha512')
              .update(source)
              .digest('base64')
              }`

          if (elementAttributes.crossorigin === void 0) {
            elementAttributes.crossorigin = 'anonymous'
          }
        }

        Object.entries(bundle).forEach(([k, v]) => outputBundle[k] = v)

        const bundleInfo = Object.keys(outputBundle)
          .filter(filename => filename.endsWith('.html'))
          .map(filename => {
            const bundleItem = bundle[filename]
            if (bundleItem.type === 'asset') {
              return {
                name: bundleItem.fileName,
                source: bundleItem.source as string,
              }
            } else if (bundleItem.type === 'chunk') {
              return {
                name: bundleItem.fileName,
                source: bundleItem.code,
              }
            } else {
              return {
                name: 'Unkwnown file name',
                source: 'Unknown file code',
              }
            }
          }).at(0)

        if (bundleInfo) {

          let root = load(bundleInfo.source)

          const scripts = root('script').filter('[src]')
          const stylesheets = root('link').filter('[href]')

          //* Implement SRI for scripts and stylesheets.
          await Promise.all([
            ...scripts.map(async (_, script) => {
              return await calculateIntegrityHashes(script as cheerio.TagElement)
            }),
            ...stylesheets.map(async (_, cheerioElement) => {
              return await calculateIntegrityHashes(cheerioElement as cheerio.TagElement)
            }),
          ])

          const distHtml = buildDirectory.concat("/index.html");
          const outputHtml = root.html({ ignoreWhitespace: true, _useHtmlParser2: true });

          writeFileSync(distHtml, outputHtml, { encoding: 'utf-8' })
        }
      }
    }
  }
}
