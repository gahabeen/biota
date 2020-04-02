const browserify = require("browserify");
const tsify = require("tsify");
const pathmodify = require("pathmodify");
const tinyify = require("tinyify");
const uglifyify = require("uglifyify");
const fs = require("fs");
const path = require("path");

const tsConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../tsconfig.json")));

const sourcePath = path.resolve(__dirname, "../src/browser.ts");
const libWriteStream = fs.createWriteStream(path.resolve(__dirname, "../browser/biota.js"));
const minLibWriteStream = fs.createWriteStream(path.resolve(__dirname, "../browser/biota.min.js"));

// normal
browserify({ entries: [sourcePath] })
  .plugin(pathmodify, {
    mods: [pathmodify.mod.re(/~\/(.+)/, path.resolve(__dirname, "../src/$1"))]
  })
  .plugin(tsify, tsConfig.compilerOptions)
  .bundle()
  .pipe(libWriteStream);

// min
browserify({ entries: [sourcePath] })
  .plugin(pathmodify, {
    mods: [pathmodify.mod.re(/~\/(.+)/, path.resolve(__dirname, "../src/$1"))]
  })
  .plugin(tsify, tsConfig.compilerOptions)
  .plugin(uglifyify)
  .plugin(tinyify)
  .bundle()
  .pipe(minLibWriteStream);
