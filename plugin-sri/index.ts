import { createHash } from "crypto";
import fs from "fs";
import replace from "replace-in-file";
import { type Plugin } from "vite";

export default function subresourceIntegrity(): Plugin {
    return {
        name: "subresource-integrity",
        //! IMPOSSIBLE TO READ THE FILES CONTENT.
        transformIndexHtml: {
            order: "post",
            async handler(html, context) {
                let regex = /<link.*(\/>|">)/gim;
                return html.replace(regex, (match, _) => {
                    return match.replace(/\/>$/gim, "").replace(/>$/gim, "");
                });
            },
        },

        writeBundle: {
            sequential: true,
            order: "post",
            async handler({ dir }) {
                const inputFile = dir.concat("/index.html");

                //* Add SRI to script tags
                const scriptsRegex = /<script.*/gim;

                replace.sync({
                    files: inputFile,
                    from: scriptsRegex,
                    to: (replaceMatch) => {
                        let filePathNormalized = replaceMatch
                            .replace("crossorigin", "")
                            .replace(/><\/script>$/gim, "")
                            .trim()
                            .split(" ")
                            .filter((item) => item.startsWith("src"))
                            .at(0)
                            .split("=")
                            .at(-1)
                            .replace('"', "")
                            .replace('"', "");

                        let contentFile = fs.readFileSync(dir.concat(filePathNormalized), {
                            encoding: "utf-8",
                        });

                        const hash = createHash("sha512")
                            .update(contentFile)
                            .digest("base64");

                        const hashFilename = `sha512-${hash}`;

                        const lineWithIntegrityHash = replaceMatch
                            .trim()
                            .replace("crossorigin", "")
                            .replace(/><\/script>$/gim, "")
                            .concat(
                                ` integrity="${hashFilename}" crossorigin="anonymous"></script>`
                            );
                        return lineWithIntegrityHash;

                    }
                })

                //* Add SRI to link tags
                const linksRegex = /<link.*/gim;

                replace.sync({
                    files: inputFile,
                    from: linksRegex,
                    to: (replaceMatch) => {
                        let filePathNormalized = replaceMatch
                            .split(" ")
                            .filter((item) => item.startsWith("href"))
                            .at(0)
                            .split("=")
                            .at(-1)
                            .replace(/\"/gmi, "")

                        let contentFile = fs.readFileSync(dir.concat(filePathNormalized), {
                            encoding: "utf8",
                        });

                        const hash = createHash("sha512")
                            .update(contentFile)
                            .digest("base64");

                        const hashFilename = `sha512-${hash}`;
                        const lineWithIntegrityHash = replaceMatch.concat(
                            ` integrity="${hashFilename}" crossorigin="anonymous" />`
                        );
                        return lineWithIntegrityHash;

                    }
                })
            },
        },
    };
}