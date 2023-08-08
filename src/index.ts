import { Plugin, ResolvedConfig, SSROptions } from 'vite'
import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs'
import { createHash } from 'node:crypto'
import { resolve } from 'path'
import { OutputBundle } from 'rollup'
import { load } from 'cheerio';

export type Algorithm = 'sha256' | 'sha384' | 'sha512'

export interface SriOptions {
  /**
   * Which hashing algorithms to use when calculate the integrity hash for each
   * asset in the manifest.
   *
   * @default 'sha512'
   */
  algorithm: Algorithm,

  /**
   * Path of ssr dist
   *
   * @default 'dist'
   */
  ssrOutDir: string

  hasSsr: false

}

function subresourceIntegrity(options: SriOptions = { algorithm: 'sha512', ssrOutDir: 'build', hasSsr: false }): Plugin {

  let config: ResolvedConfig

  const { algorithm, ssrOutDir, hasSsr } = options
  const outputBundle: OutputBundle = {}

  return {
    name: 'vite-plugin-subresource-integrity',
    apply: 'build',
    enforce: 'post',

    configResolved(resolvedConfig) {
      config = resolvedConfig
    },

    closeBundle: {
      sequential: true,
      order: "post",
      async handler() {


        console.log(config.ssr);

        let buildDirectory = '';

        if (hasSsr) {
          buildDirectory = ssrOutDir;
        } else {
          buildDirectory = config?.build?.outDir
        }

        const distHtml = buildDirectory.concat("/index.html");

        const calculateIntegrityHashes = async (element: cheerio.TagElement) => {
          let source: string = "";
          const elementAttributes = element.attribs
          const attributeName = element.attribs.src ? 'src' : 'href'
          const resourceUrl = element.attribs[attributeName]

          source = readFileSync(resolve(buildDirectory.concat(resourceUrl)), { encoding: 'utf8' })

          elementAttributes.integrity = `${calculateIntegrityHash(source, algorithm)}`
        }

        const content = readFileSync(distHtml);
        const root = load(content);
        const stylesheets = root('link').filter('[href]')
        const scripts = root('script').filter('[src]')

        //* Remove crossorigin attributes without value.
        root(stylesheets).removeAttr("crossorigin").attr("crossorigin", 'anonymous')
        root(scripts).removeAttr("crossorigin").attr("crossorigin", 'anonymous')

        await Promise.all([
          ...scripts.map(async (_, cheerioElement) => {
            return await calculateIntegrityHashes(cheerioElement as cheerio.TagElement)
          }),
          ...stylesheets.map(async (_, cheerioElement) => {
            return await calculateIntegrityHashes(cheerioElement as cheerio.TagElement)
          }),
        ])

        const outputHtml = root.html({ _useHtmlParser2: true, ignoreWhitespace: true });
        writeFileSync(distHtml, outputHtml, { encoding: 'utf-8' })
      }
    }
  }
}

function calculateIntegrityHash(source: string, algorithm: Algorithm) {
  const hash = createHash(algorithm).update(source).digest('base64')
  return `${algorithm.toLowerCase()}-${hash}`
}

export { subresourceIntegrity as default };