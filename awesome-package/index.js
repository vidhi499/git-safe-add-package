const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const args = process.argv.splice(2);
const gitUrl = args[0];
const packageName = args[1];
const currDir = process.cwd();
const sourcePath = path.join(currDir, "temp");
const ignoredFiles = ["script.js", `${packageName}`, "node_modules"];
let branchName, originBranchName, subOrigin;

function getAllFiles() {
  const filenames = fs.readdirSync(__dirname);
  return filenames;
}

function generateRandomString() {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomString = "";

  for (let i = 0; i < 6; i++) {
    // Generate a random index to pick a character from the 'characters' string
    const randomIndex = Math.floor(Math.random() * characters.length);

    // Append the selected character to the random string
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
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
      var child = exec(
        `cd ${sourcePath} && git mv ${tempSourcePath} ${destPath}`,
        function (err, stdout, stderr) {
          if (err != null) {
            return new Error(err);
          } else if (typeof stderr != "string") {
            return new Error(stderr);
          } else {
            // TODO: Check if all folders are copied or not
            createBranchAndPush();
            return stdout;
          }
        }
      );
    }
  });
  // TODO: Just for development
  createBranchAndPush();
}

function fetchPackage() {
  originBranchName = `${generateRandomString()}-origin-branch`;
  subOrigin = `${generateRandomString()}-origin`;
  console.log(originBranchName);
  exec(
    // TODO: Make branchName dynamic
    `git remote add ${subOrigin} ./temp && git fetch ${subOrigin} && git branch ${originBranchName} remotes/${subOrigin}/dchDsI `,
    function (err, stdout, stderr) {
      if (err != null) {
        console.log(JSON.stringify(err), "ERROR");
        return new Error(err);
      } else if (typeof stderr != "string") {
        onsole.log(JSON.stringify(stderr), "STDERR");
        return new Error(stderr);
      } else {
        // exec(`cd ${source} &&  git push origin ${branchName}`);
        return stdout;
      }
    }
  );
}

function createBranchAndPush() {
  branchName = generateRandomString();
  console.log(branchName, sourcePath);
  exec(
    `cd ${sourcePath} && git checkout -b ${branchName} && git add . && git push origin ${branchName}`,
    function (err, stdout, stderr) {
      if (err != null) {
        console.log(JSON.stringify(err), "ERRR");
        return new Error(err);
      } else if (typeof stderr != "string") {
        onsole.log(JSON.stringify(stderr), "STDERR");
        return new Error(stderr);
      } else {
        fetchPackage();
        // exec(`cd ${source} &&  git push origin ${branchName}`);
        return stdout;
      }
    }
  );
}

function main() {
  // TODO: Add error for existing changes
  // Get current branch
  // cloneGitRepo();
  // createPackageBranch();
  fetchPackage();
}
main();
