const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const ignoredFiles = ["script.js", "next-app", "node_modules"];
const destPath = path.join(__dirname, "next-app");

function getAllFiles() {
  const filenames = fs.readdirSync(__dirname);

  console.log("\nCurrent directory filenames:");
  return filenames;
}
function main() {
  const files = getAllFiles();
  files.forEach((file) => {
    if (!ignoredFiles.includes(file)) {
      const sourcePath = path.join(__dirname, file);
      console.log(file, sourcePath);
      var child = exec(
        `git mv ${sourcePath} ${destPath}`,
        function (err, stdout, stderr) {
          if (err != null) {
            return new Error(err);
          } else if (typeof stderr != "string") {
            return new Error(stderr);
          } else {
            return stdout;
          }
        }
      );
    }
  });
}
main();
