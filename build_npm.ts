import { build, emptyDir } from "https://deno.land/x/dnt@0.38.0/mod.ts";

const DIST_FOLDER = "dist"

await emptyDir(DIST_FOLDER);

await build({
    entryPoints: ["./index.ts"],
    outDir: DIST_FOLDER,
    shims: {
        deno: true,
        crypto: true,
    },
    typeCheck: "both",
    esModule: true,
    scriptModule: "cjs",
    package: {
        name: "vite-plugin-subresource-integrity",
        private: false,
        version: "0.0.5",
        description: "Boolean function that returns whether or not parameter is the number 42",
        author: "jadsn <jadsn1894@protonmail.com>",
        license: "MIT",
        repository: {
            type: "git",
            url: "git+https://github.com/JADSN1894/vite-plugin-sri.git"
        },
        files: [
            DIST_FOLDER,
            "src"
        ],
        keywords: [
            "Vite",
            "Subresource",
            "Integrity",
            "SRI",
            "Plugin"
        ],
        bugs: {
            url: "https://github.com/JADSN1894/vite-plugin-sri/issues"
        },
    },
    postBuild() {
        Deno.copyFileSync("LICENSE", "npm/LICENSE");
        Deno.copyFileSync("README.md", "npm/README.md");
    },
});