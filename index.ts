import { Plugin, ResolvedConfig } from 'https://esm.sh/vite@4.4.8'
import { createHash } from 'node:crypto'
import { resolve } from 'node:path'
import { OutputBundle } from "https://esm.sh/rollup@3.27.1";
import { load, Element as CheerioElement } from "https://esm.sh/cheerio@1.0.0-rc.12";

export default function subresourceIntegrity(): Plugin {

    let config: ResolvedConfig
    const outputBundle: OutputBundle = {}

    return {
        name: 'vite-plugin-subresource-integrity',
        apply: 'build',
        enforce: 'post',

        configResolved(resolvedConfig) {
            config = resolvedConfig
        },

        writeBundle: {
            sequential: true,
            order: "post",
            handler({ dir }, bundle) {
                const outDir = config?.build?.outDir || (dir ?? 'dist')
                const buildDirectory = resolve(outDir);

                Object.entries(bundle).forEach(([key, value]) => outputBundle[key] = value)

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

                    const root = load(bundleInfo.source)

                    const calculateIntegrityHashes = (element: CheerioElement) => {
                        let source = "";
                        const elementAttributes = element.attribs
                        const attributeName = element.attribs.src ? 'src' : 'href'
                        const resourceUrl = element.attribs[attributeName]

                        const resourcePath =
                            resourceUrl.indexOf(config.base) === 0
                                ? resourceUrl.substring(config.base.length)
                                : resourceUrl

                        const resourceType = Object.entries(bundle).find(([, bundleItem]) => bundleItem.fileName === resourcePath)?.[1]

                        if (resourceType) {
                            if (resourceType.type === 'asset') {
                                source = resourceType.source as string
                            } else if (resourceType.type === 'chunk') {
                                source = resourceType.code
                            } else {
                                config.logger.warn(`Resource type not recognized`)
                            }
                        } else {
                            source = Deno.readFileSync(
                                resolve(dir ?? 'Directory not found', resourcePath),
                            ).toString()
                        }

                        elementAttributes.integrity = `sha512-${createHash('sha512').update(source).digest('base64')}`
                    }

                    const stylesheets = root('link').filter('[href]')
                    const scripts = root('script').filter('[src]')

                    //* Remove crossorigin attributes without value.
                    root(stylesheets).removeAttr("crossorigin").attr("crossorigin", 'anonymous')
                    root(scripts).removeAttr("crossorigin").attr("crossorigin", 'anonymous')

                    //* Implement SRI for scripts and stylesheets.
                    scripts.map((_, cheerioElement) => calculateIntegrityHashes(cheerioElement))
                    stylesheets.map((_, cheerioElement) => calculateIntegrityHashes(cheerioElement))

                    const distHtml = buildDirectory.concat("/index.html");
                    const outputHtml = root.html();

                    Deno.writeTextFileSync(distHtml, outputHtml, {})
                }
            }
        }
    }
}
