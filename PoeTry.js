function PoeTry({ lstm, seeds, debug }) {
  if (debug) {
    console.log("PoeTry instatiated", this, arguments);
  }
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  function randomSeed(index) {
    const source = seeds || [];
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
  async function run({ times = 1, length = -1 } = {}) {
    if (length === -1) {
      length = randomInt(256, 1024);
    }
    if (debug) {
      console.log("generating", { length, times });
    }
    let results = [];
    let last = randomSeed();
    for (let index = 0; index < times; index++) {
      let seed = last;
      let options = {
        seed: seed,
        length: length, // randomInt(25, 50),
        temperature: 0 // 0.7 // Math.random()
      };
      const generated = await lstm.generate(options);
      let resultLines = generated.split("\n").map((text, index, array) => {
        let length = array.length;
        let r = text;
        if (r.indexOf(" ") === 0) {
          r = "  " + r.trim();
        }
        let words = r.split(" ");
        if (words.length < 1) {
          return "";
        }
        // Remove the last word because it's usually not a complete word
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
        if (final.trim().length < 5) {
          final = "";
        }
        return final;
      });
      if (resultLines[0].length === 0) {
        resultLines.shift();
      }
      last = resultLines.join("\r\n");
      results.push(last);
    }
    if (debug) {
      console.log("run finished", { length, times, results });
    }
    return results;
  }
  this.run = run;
  return this;
}
try {
  if (exports !== undefined) {
    exports.PoeTry = PoeTry;
  }
} catch (ex) {}
