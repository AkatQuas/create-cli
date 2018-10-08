const ora = require('ora');
const spawn = require('child_process').spawn;
const logger = require('./logger');
const inquirer = require('inquirer');

function _installDeps(wd, cmd) {
    const spinner = ora(`installing dependencies in ${wd}`)
    spinner.start();
    const progress = spawn(cmd, ['install'], { cwd: wd })
    progress.on('close', s => {
        if (s !== 0) {
            spinner.fail();
            logger.error(`install process exit with status ${s}`);
        } else {
            spinner.succeed();
            logger.success('You are good to go.');
        }
    })
}

module.exports = async wd => {
    const { cmd } = await inquirer.prompt([
        {
            type: 'list',
            name: 'cmd',
            message: 'Install Dependencies?',
            choices: [
                { name: '1) run npm install', value: 'npm' },
                { name: '2) run yarn install', value: 'yarn' },
                { name: '3) no, I will handle myself', value: false },
            ]
        }
    ]);
    if (!cmd) {
        logger.success('Project created without installing dependencies.');
        logger.success('You may play now');
        process.exit(0);
    }
    _installDeps(wd, cmd)
}