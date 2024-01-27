const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const args = process.argv.splice(2);
const gitUrl = args[0];
const packageName = args[1];
const currDir = process.cwd();
const sourcePath = path.join(currDir, "temp");
const ignoredFiles = ["script.js", `${packageName}`, "node_modules"];

function getAllFiles() {
  const filenames = fs.readdirSync(__dirname);

  console.log("\nCurrent directory filenames:");
  return filenames;
}

function cloneGitRepo() {
  var child = exec(
    `git clone ${gitUrl} ${sourcePath}`,
    function (err, stdout, stderr) {
      if (err != null) {
        return new Error(err);
      } else if (typeof stderr != "string") {
        return new Error(stderr);
      } else {
        // createPackageBranch();
        return stdout;
      }
    }
  );
}

function getAllFiles() {
  const filenames = fs.readdirSync(sourcePath);

  console.log("\nCurrent directory filenames:");
  return filenames;
}

function createPackageBranch() {
  const files = getAllFiles();
  if (!fs.existsSync(`${sourcePath}/${packageName}`)) {
    fs.mkdirSync(`${sourcePath}/${packageName}`);
  }
  const destPath = path.join(sourcePath, `${packageName}`);

  files.forEach((file) => {
    if (!ignoredFiles.includes(file)) {
      const tempSourcePath = path.join(sourcePath, file);
      console.log(file, tempSourcePath, destPath);
      var child = exec(
        `cd ${sourcePath} && git mv ${tempSourcePath} ${destPath}`,
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

function main() {
  // cloneGitRepo();
  createPackageBranch();
}
main();
