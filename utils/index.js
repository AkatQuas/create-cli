const logger = require('./logger');
const download = require('./download');
const metalsmithGenerator = require('./metalsmith-generator');
const installDeps = require('./install-deps');

module.exports = {
    logger, download, metalsmithGenerator, installDeps
};