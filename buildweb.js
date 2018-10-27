const fs = require("fs");
const path = require("path");
const distPath = path.join(__dirname, "./dist");
const distWebPath = path.join(__dirname, "./dist/www");
const zipPath = path.join(__dirname, "./dist/www/poe-try.zip");
const zip = new require("node-zip")();
const rmdir = require("rimraf");
console.log("🏗🏗🏗 starting 🏗🏗🏗");
if (fs.existsSync(distPath)) {
  rmdir.sync(distPath);
}
fs.mkdirSync(distPath);
fs.mkdirSync(distWebPath);
fs.mkdirSync(path.join(distWebPath, "data"));
fs.mkdirSync(path.join(distWebPath, "models"));
fs.mkdirSync(path.join(distWebPath, "models/training"));

function copyToDistWeb(filePath) {
  const to = path.join(distWebPath, filePath);
  const absolutePath = path.join(__dirname, filePath);
  console.log("copying", { to, absolutePath });
  fs.copyFileSync(absolutePath, to);
}
function addToItchZip(filePath) {
  const absolutePath = path.join(__dirname, filePath);
  zip.file(filePath, fs.readFileSync(absolutePath));
}
function package(filePath) {
  copyToDistWeb(filePath);
  addToItchZip(filePath);
}
[
  "index.html",
  "favicon.png",
  "PoeTry.js",
  "data/windowlines.js",
  "models/training/vocab.json",
  "models/training/embedding",
  "models/training/manifest.json",
  "models/training/rnnlm_multi_rnn_cell_cell_0_basic_lstm_cell_biases",
  "models/training/rnnlm_multi_rnn_cell_cell_0_basic_lstm_cell_weights",
  "models/training/rnnlm_multi_rnn_cell_cell_1_basic_lstm_cell_biases",
  "models/training/rnnlm_multi_rnn_cell_cell_1_basic_lstm_cell_weights",
  "models/training/rnnlm_softmax_b",
  "models/training/rnnlm_softmax_w",
  "models/training/Variable"
].map(package);

var data = zip.generate({ base64: false, compression: "DEFLATE" });
fs.writeFileSync(zipPath, data, "binary");
console.log("💙💙💙 done 💙💙💙");
