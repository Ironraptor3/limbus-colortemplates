#!/usr/bin/env node
import {createReadStream} from "fs";
import {createInterface} from "readline";
import {pathToFileURL} from "url";

import {converter, formatHex} from "culori";

import yargs from "yargs";
import {hideBin} from "yargs/helpers";

async function handleColors(templateFile, replace, newName) {
  const stream = createReadStream(templateFile, {encoding: "ASCII"});
  const rl = createInterface({
    input: stream,
    crlfDelay: Infinity
  });

  const colors = [];
  for await (var line of rl) {
    line = line.replace(/^(Color:.*?#)([\dA-Fa-f]{6})/, (match, start, color) => {
      colors.push(color);
      if (replace) {
        color = replace[color] ?? color;
      }
      return start+color;
    });

    if (replace) {
      line = line.replace(/^(Full name:\s*?)(\S+.*)/, (match, start, name) => {
        return start+"Limbus Company UI Custom";
      });
      line = line.replace(/^(Short name:\s*?)(\S+.*)/, (match, start, name) => {
        return start+newName;
      });
      process.stdout.write(`${line}\n`);
    }
  }
  rl.close();

  return colors;
}

function updateValue(colors, filter, prop, value) {
  if (value == null) {
    // Noop
    return;
  }

  const filtered = filter ? colors.filter(filter) : colors;
  var setValue = value >= 0 ? value
    : filtered.reduce((sum, color) => {return sum + color[prop];}, 0) / filtered.length;

  filtered.forEach((color) => {color[prop] = setValue;});
}

// XXX: Even/Odd is strange...
async function createColorTemplate(templateFile, newName, lightnessEven, lightnessOdd, sat) {
  const toOkHsl = converter("okhsl");

  const colors = await handleColors(templateFile);
  const hslColors = colors.map((color) => {return toOkHsl(`#${color}`);});

  updateValue(hslColors, (color, index) => {return index % 2 == 0;}, "l", lightnessEven);
  updateValue(hslColors, (color, index) => {return index % 2 != 0;}, "l", lightnessOdd);
  updateValue(hslColors, null, "s", sat);

  const newColors = colors.reduce((prev, color, index) => {
      return {...prev, [color]:formatHex(hslColors[index]).replace(/#/g, "")};
  }, {});

  await handleColors(templateFile, newColors, newName);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = yargs(hideBin(process.argv))
    .option("light-even", {
      alias: "e",
      type: "number",
      description: "Specify to balance the lightness of even colors [0,1]. < 0 means to average their lightness"
    })
    .option("light-odd", {
      alias: "o",
      type: "number",
      description: "Specify to balance the lightness of odd colors [0,1]. < 0 means to average their lightness"
    })
    .option("saturation", {
      alias: "s",
      type: "number",
      description: "Specify to balance the saturation of ALL colors [0,1]. < 0 means to average their saturation"
    })
    .option("name", {
      alias: "n",
      type: "string",
      default: "limbuscustom",
      description: "The name of the new colorscheme."
    })
    .option("template", {
      alias: "t",
      type: "string",
      default: "limbus.colortemplate",
      description: "The colortemplate to modify the colors of"
    })
    .parse()

  await createColorTemplate(args.template, args.name,
    args.e,
    args.o,
    args.s);
}
