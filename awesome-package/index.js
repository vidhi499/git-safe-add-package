const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const args = process.argv.splice(2);
const gitUrl = args[0];
const packageName = args[1];
const currDir = process.cwd();
const sourcePath = path.join(currDir, "temp");
const ignoredFiles = ["script.js", `${packageName}`, "node_modules"];
let branchName, originBranchName, subOrigin, currentBranchName;

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
  console.log("Cloning repppo....")
  var child = exec(
    `git clone ${gitUrl} ${sourcePath}`,
    function (err, stdout, stderr) {
      if (err != null) {
        return new Error(err);
      } else if (typeof stderr != "string") {
        return new Error(stderr);
      } else {
        console.log("Cloning repppo.... completed!")
        createPackageBranch();
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
  console.log("Creating branch")

  const files = getAllFiles();
  if (!fs.existsSync(`${sourcePath}/${packageName}`)) {
    fs.mkdirSync(`${sourcePath}/${packageName}`);
  }
  const destPath = path.join(sourcePath, `${packageName}`);
  var child;
  files.forEach((file) => {
    if (!ignoredFiles.includes(file)) {
      const tempSourcePath = path.join(sourcePath, file);
      child = exec(
        `cd ${sourcePath} && git mv ${tempSourcePath} ${destPath}`,
        function (err, stdout, stderr) {
          if (err != null) {
            return new Error(err);
          } else if (typeof stderr != "string") {
            return new Error(stderr);
          } else {
            // TODO: Check if all folders are copied or not
            const files = getAllFiles();
            if(files.length>0){
              // TODO: Fix this
              // createPackageBranch();
              files.forEach((file) => {
                if (!ignoredFiles.includes(file)) {
                  const tempSourcePath = path.join(sourcePath, file);
                  child = exec(
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
            return stdout;
          }
        }
      );
    }
  });
  // child.on('close', (code) => {
  //   console.log(code)
  //   createBranchAndPush();
  // })
  console.log("Coping files completed..")

  // TODO: Just for development
  createBranchAndPush();
}

function getCurrentBranch() {
  exec(`git branch --show-current`, function (err, stdout, stderr) {
    if (err != null) {
      console.log(JSON.stringify(err), "ERROR");
      return new Error(err);
    } else if (typeof stderr != "string") {
      console.log(JSON.stringify(stderr), "STDERR");
      return new Error(stderr);
    } else {
      currentBranchName = `${stdout}`;
      cleanUpFiles();
      return stdout;
    }
  });
}

function cleanUpFiles() {
  exec(`git checkout ${originBranchName}`, function (err, stdout, stderr) {
    if (err != null) {
      console.log(JSON.stringify(err), "ERROR");
      return new Error(err);
    } else if (typeof stderr != "string") {
      console.log(JSON.stringify(stderr), "STDERR");
      return new Error(stderr);
    } else {
      if(fs.existsSync("node_modules")){
        fs.rmSync("node_modules", {
          recursive: true,
        });
      }
      updateBranch()
      return stdout;
    }
  });
}

function updateBranch() {
  exec(`git add . && git commit -m "changes" && git push origin ${originBranchName} && git checkout ${currentBranchName}`,
    function (err, stdout, stderr) {
      if (err != null) {
        exec(`git add . && git push origin ${originBranchName} && git checkout ${currentBranchName}`,
          function (err, stdout, stderr) {
            if (err != null) {
              console.log(JSON.stringify(err), "ERROR");
              return new Error(err);
            } else if (typeof stderr != "string") {
              console.log(JSON.stringify(stderr), "STDERR");
              return new Error(stderr);
            } else {
              return stdout;
            }
          });
        return new Error(err);
      } else if (typeof stderr != "string") {
        console.log(JSON.stringify(stderr), "STDERR");
        return new Error(stderr);
      } else {
        fetchBranch()
        return stdout;
      }
    });
}

function fetchBranch(){
  exec(`git add . && git commit -m "changes" && git push origin ${originBranchName} && git checkout ${currentBranchName}`,
  function (err, stdout, stderr) {
    if (err != null) {
      return new Error(err);
    } else if (typeof stderr != "string") {
      console.log(JSON.stringify(stderr), "STDERR");
      return new Error(stderr);
    } else {
      return stdout;
    }
  });
}

function fetchPackage() {
  originBranchName = `${generateRandomString()}-origin-branch`;
  subOrigin = `${generateRandomString()}-origin`;
  console.log(originBranchName,subOrigin,"creating new origin and branch");
  exec(
    // TODO: Make branchName dynamic
    `git remote add ${subOrigin} ./temp && git fetch ${subOrigin} && git branch ${originBranchName} remotes/${subOrigin}/aYhTfz`,
    function (err, stdout, stderr) {
      if (err != null) {
        console.log(JSON.stringify(err), "ERROR");
        return new Error(err);
      } else if (typeof stderr != "string") {
        onsole.log(JSON.stringify(stderr), "STDERR");
        return new Error(stderr);
      } else {
        getCurrentBranch();
        return stdout;
      }
    }
  );
}

function createBranchAndPush() {
  branchName = generateRandomString();
  console.log(branchName, sourcePath,"Creating branch and pusing the changes");
  exec(
    `cd ${sourcePath} && git checkout -b ${branchName} && git add . && git commit -m "feat: changes" && git push origin ${branchName}`,
    // TODO:   && git commit -m "feat: changes" 
    function (err, stdout, stderr) {
      if (err != null) {
        console.log(JSON.stringify(err), "ERRR");
        return new Error(err);
      } else if (typeof stderr != "string") {
        console.log(JSON.stringify(stderr), "STDERR");
        return new Error(stderr);
      } else {
  console.log("Completed push ")

        fetchPackage();
        // exec(`cd ${source} &&  git push origin ${branchName}`);
        return stdout;
      }
    }
  );
}

// function cleanUp(){
//   exec(
// `git remote remove ${subOrigin} && git branch -d ${branchName} && git branch -d ${originBranchName}`,
//     function (err, stdout, stderr) {
//       if (err != null) {
//         console.log(JSON.stringify(err), "ERRR");
//         return new Error(err);
//       } else if (typeof stderr != "string") {
//         onsole.log(JSON.stringify(stderr), "STDERR");
//         return new Error(stderr);
//       } else {
//         fetchPackage();
//         // exec(`cd ${source} &&  git push origin ${branchName}`);
//         return stdout;
//       }
//     }
//   );
// }

function main() {
  // TODO: Add error for existing changes
  // Get current branch
  console.log("hihih")
  // cloneGitRepo();
  // createPackageBranch();
  // cleanUp()
  fetchPackage();
}
main();
