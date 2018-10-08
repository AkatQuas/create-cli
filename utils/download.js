const ora = require('ora');
const downloadGit = require('download-git-repo');
const path = require('path');
const url = require('./constants').REPO_URL;

module.exports = projectDir => new Promise((resolve, reject) => {
    const spinner = ora(`downloading templates: ${url}`);
    spinner.start();
    const downTemp = path.resolve(projectDir, '.download-tmp');
    downloadGit(url, downTemp, { clone: true }, err => {
        if (err) {
            spinner.fail();
            return reject(err);
        } else {
            spinner.succeed();
            return resolve(downTemp)
        }
    })
});