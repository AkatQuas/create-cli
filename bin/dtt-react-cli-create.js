#!/usr/bin/env node
const program = require('commander');
const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const { logger, download, metalsmithGenerator, installDeps } = require('../utils');

program
    .usage('<project-name>')
    .parse(process.argv)

const projectName = program.args[0];
const CWD = process.cwd();

if (!projectName) {
    return program.help();
}

const preProjectPath = _ => {
    let next = void 0;
    const rootName = path.basename(CWD);

    const list = fs.readdirSync(CWD)
        .filter(name => name.includes(projectName))
        .filter(name => fs.statSync(path.resolve(CWD, name)).isDirectory());

    if (list.length) {
        next = inquirer.prompt([
            {
                name: 'override',
                message: `Already a dircetory named ${projectName} exists, override?`,
                type: 'confirm',
                default: false
            }
        ]).then(({ override }) => {
            if (override) {
                return Promise.resolve(projectName);
            } else {
                logger.error('Not override, process will end.');
                process.exit(0);
            }
        });
    } else if (rootName === projectName) {
        next = inquirer.prompt([
            {
                name: 'buildInCurrent',
                message: 'Current directory\'s name is same as the target project name, overwrite here?',
                type: 'confirm',
                default: false
            }
        ]).then(({ buildInCurrent }) => buildInCurrent ? '.' : projectName);
    } else {
        next = Promise.resolve(projectName);
    }

    return next;
}

const colloctInfo = _ => inquirer.prompt([
    {
        name: 'author',
        message: 'Author',
        default: 'FE Developer'
    },
    {
        name: 'projectName',
        message: 'Name of project',
        default: projectName
    },
    {
        name: 'projectVersion',
        message: 'Initial version',
        default: '1.0.0'
    },
    {
        name: 'projectDescription',
        message: 'Project description',
        default: `A project named ${projectName}`
    },
    {
        name: 'useRouter',
        message: 'Using react-router',
        default: false
    },
    {
        name: 'gitUrl',
        message: 'Git repository url',
        default: ''
    }
]);


async function main() {
    logger.warning('This template is only for activity and some simple projects\n For bigger ones, use other frameworks');

    const projectPathname = await preProjectPath();
    const metadata = await colloctInfo();

    const projectDir = path.resolve(CWD, projectPathname);
    fs.emptyDirSync(projectDir);
    logger.success(`Empty directory ${projectDir}`);

    const downTemp = await download(projectDir);

    const dest = await metalsmithGenerator({
        root: projectDir,
        name: projectName,
        downTemp,
        metadata
    });

    installDeps(dest);
}

main();
