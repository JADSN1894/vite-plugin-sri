import { Plugin, ResolvedConfig } from 'vite'
import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs'
import { createHash } from 'node:crypto'
import { resolve } from 'path'
import { OutputBundle } from 'rollup'
import { load } from 'cheerio';

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
      async handler({ dir }, bundle) {
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

          let root = load(bundleInfo.source)

          const calculateIntegrityHashes = async (element: cheerio.TagElement) => {
            let source: string = "";
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
              source = readFileSync(
                resolve(dir ?? 'Directory not found', resourcePath),
                { encoding: 'utf8' }
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
          await Promise.all([
            ...scripts.map(async (_, cheerioElement) => {
              return await calculateIntegrityHashes(cheerioElement as cheerio.TagElement)
            }),
            ...stylesheets.map(async (_, cheerioElement) => {
              return await calculateIntegrityHashes(cheerioElement as cheerio.TagElement)
            }),
          ])

          const distHtml = buildDirectory.concat("/index.html");
          const outputHtml = root.html();

          writeFileSync(distHtml, outputHtml, { encoding: 'utf-8' })
        }
      }
    },

    closeBundle: {
      sequential: true,
      order: "post",
      async handler() {

        const outDir = config?.build?.outDir || 'build'
        const buildDirectory = resolve(outDir);
        const distHtml = 'build'.concat("/index.html");

        const calculateIntegrityHashes = async (element: cheerio.TagElement) => {
          let source: string = "";
          const elementAttributes = element.attribs
          const attributeName = element.attribs.src ? 'src' : 'href'
          const resourceUrl = element.attribs[attributeName]

          // const resourcePath =
          //   resourceUrl.indexOf(config.base) === 0
          //     ? resourceUrl.substring(config.base.length)
          //     : resourceUrl

          // const resourceType = Object.entries(bundle).find(([, bundleItem]) => bundleItem.fileName === resourcePath)?.[1]

          // if (resourceType) {
          //   if (resourceType.type === 'asset') {
          //     source = resourceType.source as string
          //   } else if (resourceType.type === 'chunk') {
          //     source = resourceType.code
          //   } else {
          //     config.logger.warn(`Resource type not recognized`)
          //   }
          // } else {
          //   source = readFileSync(
          //     resolve(dir ?? 'Directory not found', resourcePath),
          //     { encoding: 'utf8' }
          //   ).toString()
          // }

          elementAttributes.integrity = `sha512-${createHash('sha512').update(source).digest('base64')}`
        }

        // let files = getFiles('build');
        let content = readFileSync(distHtml);
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


        // glob(root_folder + '/**/index.md', (err, files) => {
        //   if (err) {
        //     console.log('Error', err)
        //   } else {
        //     console.log(files)
        //   }
        // })

        const outputHtml = root.html();
        writeFileSync(distHtml, outputHtml, { encoding: 'utf-8' })



      }
    }
  }
}


// Recursive function to get files
function getFiles(dir: string, files: string[] = []) {
  // Get an array of all files and directories in the passed directory using fs.readdirSync
  const fileList = readdirSync(dir);
  // Create the full path of the file/directory by concatenating the passed directory and file/directory name
  for (const file of fileList) {
    const name = `${dir}/${file}`;
    // Check if the current file/directory is a directory using fs.statSync
    if (statSync(name).isDirectory()) {
      // If it is a directory, recursively call the getFiles function with the directory path and the files array
      getFiles(name, files);
    } else {
      // If it is a file, push the full path to the files array
      files.push(name);
    }
  }
  return files;
}