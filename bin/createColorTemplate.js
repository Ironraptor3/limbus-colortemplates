#!/usr/bin/env node
const fs = require("fs");
const readline = require("readline");

const culori = require("culori");

async function handleColors(templateFile, replace) {
  const stream = fs.createReadStream(templateFile, {encoding: "ASCII"});
  const rl = readline.createInterface({
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
        return start+"limbuscustom";
      });
      process.stdout.write(`${line}\n`);
    }
  }
  rl.close();

  return colors;
}

function updateValue(colors, filter, prop, value) {
  if (!value) {
    // Noop
    return;
  }

  const filtered = filter ? colors.filter(filter) : colors;
  var setValue = value > 0 ? value
    : filtered.reduce((sum, color) => {return sum + color[prop];}, 0) / filtered.length;

  filtered.forEach((color) => {color[prop] = setValue;});
}

// XXX: Even/Odd is strange...
async function createColorTemplate(templateFile, lightnessEven, lightnessOdd, sat) {
  const toOkHsl = culori.converter("okhsl");

  const colors = await handleColors(templateFile, null);
  const hslColors = colors.map((color) => {return toOkHsl(`#${color}`);});

  updateValue(hslColors, (color, index) => {return index % 2 == 0;}, "l", lightnessEven);
  updateValue(hslColors, (color, index) => {return index % 2 != 0;}, "l", lightnessOdd);
  updateValue(hslColors, null, "s", sat);

  const newColors = colors.reduce((prev, color, index) => {
      return {...prev, [color]:culori.formatHex(hslColors[index]).replace(/#/g, "")};
  }, {});

  await handleColors(templateFile, newColors);
}

if (require.main === module) {
  const argsObj = JSON.parse(process.argv[2] ?? "{}");

  createColorTemplate(argsObj.templateFile,
    argsObj.lightnessEven,
    argsObj.lightnessOdd,
    argsObj.sat);
}
