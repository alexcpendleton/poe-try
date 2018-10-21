// actual text starts on 1029
// ends at 9289

const fs = require("fs");

let raw = fs.readFileSync("./data/raw.txt").toString();
raw = raw.replace(/\r/gi, "");
let lines = raw.split("\n");
lines.splice(0, 1029);
lines.splice(9289 - 1029);

var knownBad = [
  "We are permitted to copy (in advance of publication) from the second",
  "number of the 'American Review', the following remarkable poem by",
  "Edgar Poe. In our opinion, it is the most effective single example of",
  "'fugitive poetry' ever published in this country, and unsurpassed in",
  "English poetry for subtle conception, masterly ingenuity of",
  "versification, and consistent sustaining of imaginative lift and",
  "'pokerishness.' It is one of those 'dainties bred in a book' which we",
  "feed on. It will stick to the memory of everybody who reads it.",
  "The following lines from a correspondent--besides the deep, quaint",
  "strain of the sentiment, and the curious introduction of some",
  "ludicrous touches amidst the serious and impressive, as was doubtless",
  "intended by the author--appears to us one of the most felicitous",
  "specimens of unique rhyming which has for some time met our eye. The",
  "resources of English rhythm for varieties of melody, measure, and",
  "sound, producing corresponding diversities of effect, have been",
  "thoroughly studied, much more perceived, by very few poets in the",
  "language. While the classic tongues, especially the Greek, possess, by",
  "power of accent, several advantages for versification over our own,",
  "chiefly through greater abundance of spondaic feet, we have other and",
  "very great advantages of sound by the modern usage of rhyme.",
  "Alliteration is nearly the only effect of that kind which the ancients",
  "had in common with us. It will be seen that much of the melody of 'The",
  "Raven' arises from alliteration and the studious use of similar sounds",
  "in unusual places. In regard to its measure, it may be noted that if",
  "all the verses were like the second, they might properly be placed",
  "merely in short lines, producing a not uncommon form: but the presence",
  "in all the others of one line--mostly the second in the verse",
  "which flows continuously, with only an aspirate pause in",
  "the middle, like that before the short line in the Sapphio Adonic,",
  "while the fifth has at the middle pause no similarity of sound with",
  "any part beside, gives the versification an entirely different effect.",
  "We could wish the capacities of our noble language in prosody were",
  "better understood.",
  "ED. 'Am. Rev."
];
lines = lines.filter(function(line) {
  // remove empty lines
  if (line.trim().length === 0) {
    return false;
  }
  // remove chapter dividers
  if (line.indexOf("*       ") > -1) {
    return false;
  }
  // Remove lines that don't begin with "  ",
  // it seems like commentary sections are not indented,
  // but all the poetry is
  if (line.indexOf("  ") !== 0) {
    return false;
  }
  // Remove any all uppercase lines, which are probably titles
  if (line.toUpperCase() === line) {
    return false;
  }
  if (knownBad.some(i => line.indexOf(i) > -1)) {
    return false;
  }
  return true;
});
lines = lines.map(i => i.trimLeft());
fs.writeFileSync("./data/out.txt", lines.join("\n"));
