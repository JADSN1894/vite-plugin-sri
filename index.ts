
import { Plugin, ResolvedConfig } from 'vite'
import { readFileSync, readFile, writeFile, link } from 'fs'
import { createHash } from 'node:crypto'
import { resolve } from 'path'
import { OutputBundle } from 'rollup'

export default function vitePluginSri(): Plugin {
  let config: ResolvedConfig
  const bundle: OutputBundle = {}


  return {
    name: 'vite-plugin-sri',
    apply: 'build',
    enforce: 'post',
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },

    transformIndexHtml: {
      order: "post",
      async handler(html, _context) {
        let regex = /<link.*(\/>|">)/gim;
        return html.replace(regex, (match, _) => {
          return match.replace(/\/>$/gim, "").replace(/>$/gim, "");
        });
      },
    },

    writeBundle: {
      sequential: true,
      order: "post",
      async handler() {
        const outDir = config?.build?.outDir || 'dist'
        const buildDirectory = resolve(outDir);
        const inputFileDirectory = buildDirectory.concat("/index.html");

        const scriptsRegex = /<script.*/gim;
        const linksRegex = /<link.*/gim;

        readFile(inputFileDirectory, { encoding: 'utf8' }, function (err, data) {

          //* Add SRI to script tags
          data.match(scriptsRegex)?.forEach((innerScriptMatch) => {
            const filePathNormalized = innerScriptMatch
              .replace("crossorigin", "")
              .replace(/><\/script>$/gim, "")
              .trim()
              .split(" ")
              .filter((item) => item.startsWith("src"))
              .at(0)!
              .split("=")
              .at(-1)!
              .replace(/\"/gmi, "")

            const contentFile = readFileSync(buildDirectory.concat(filePathNormalized), {
              encoding: "utf8",
            });

            const hash = createHash("sha512")
              .update(contentFile)
              .digest("base64");

            const hashFilename = `sha512-${hash}`;

            const lineWithIntegrityHash = innerScriptMatch
              .trim()
              .replace("crossorigin", "")
              .replace(/><\/script>$/gim, "")
              .concat(
                ` integrity="${hashFilename}" crossorigin="anonymous"></script>`
              );

            const output = data.replace(innerScriptMatch, lineWithIntegrityHash);

            writeFile(inputFileDirectory, output, { encoding: 'utf8', flag: 'w' }, function (error) {
              if (error) {
                config.logger.warn(error.message)
              }
            });
          })


          //* Add SRI to link tags
          data.match(linksRegex)?.forEach((innerLinkMatch) => {
            const filePathNormalized = innerLinkMatch
              .split(" ")
              .filter((item) => item.startsWith("href"))
              .at(0)!
              .split("=")
              .at(-1)!
              .replace(/\"/gmi, "")

            const contentFile = readFileSync(buildDirectory.concat(filePathNormalized), {
              encoding: "utf8",
            });

            const hash = createHash("sha512")
              .update(contentFile)
              .digest("base64");

            const hashFilename = `sha512-${hash}`;
            const lineWithIntegrityHash = innerLinkMatch.concat(
              ` integrity="${hashFilename}" crossorigin="anonymous" />`
            );

            console.log(lineWithIntegrityHash);

            const output = data.replace(innerLinkMatch, lineWithIntegrityHash);
            // console.log("output");
            // console.log(output);


            writeFile(inputFileDirectory, output, { encoding: 'utf8', flag: 'w' }, function (error) {
              if (error) {
                config.logger.warn(error.message)
              }
            });
          })
        });
      }
    }
  }
}
