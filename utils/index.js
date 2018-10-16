const logger = require('./logger');
const download = require('./download');
const metalsmithGenerator = require('./metalsmith-generator');
const installDeps = require('./install-deps');
const $http = require('./axios-instance');
const { getData, postData } = $http;

module.exports = {
    logger, download, metalsmithGenerator, installDeps, $http, getData, postData
};