// global.window = {};
// global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// const ml5 = require("ml5");
//const modelDirectoryPath = "file://" + __dirname + "/models/training/";
const modelDirectoryPath = "models/training";
const lstm = new ml5.LSTMGenerator(modelDirectoryPath, modelLoaded);

// When the model is loaded
function modelLoaded() {
  runGeneration();
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function randomSeed(index) {
  const source = window.lines;
  const length = source.length;
  return source[randomInt(0, length)];
}
function popBadEnders(array) {
  if (!array || !array.length) return [];
  const badEnders = ["the", "and", "a", "e", "y", "s"];
  const result = [];
  const skipped = [];
  array.forEach(element => {
    const current = element.toLowerCase();
    if (badEnders.indexOf(current) > -1) {
      skipped.push(current);
    } else {
      result.push(element);
    }
  });
  return result;
}
async function runGeneration() {
  const times = 1;
  var length = randomInt(512, 2048);
  for (let index = 0; index < times; index++) {
    let options = {
      seed: randomSeed(),
      length: length, // randomInt(25, 50),
      temperature: 0 // 0.7 // Math.random()
    };
    var results = await lstm.generate(options);

    if (document) {
      let resultLines = results.split("\n").map((text, index, array) => {
        let length = array.length;
        let r = text;
        if (r.indexOf(" ") === 0) {
          r = "  " + r.trim();
        }
        if (r.trim().length < 5) {
          return "";
        }
        if (true) {
          let words = r.split(" ");
          if (words.length < 1) {
            return "";
          }
          // Remove the last word because it's usually garbage
          let popped = words.pop();
          let finalEnders = popBadEnders(words);
          if (finalEnders.length === 0) {
            return r;
          }
          let final = finalEnders.join(" ");
          final = final.replace(new RegExp("_", "g"), "");
          if (final.endsWith(",")) {
            if (final.length > 2) {
              final = final.slice(0, final.length - 1) + ".";
            } else {
              final = "";
            }
          }
          return final;
        }
        return r;
      });

      document.getElementById("put-text-here").innerText = resultLines.join(
        "\n"
      );
    }
  }
}
