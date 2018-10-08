const Handlebars = require('handlebars');
const fs = require('fs-extra');
const Metalsmith = require('metalsmith');
const path = require('path');

const noImgReg = new RegExp(/\.(jpe?g|png|svg|ico)/)

module.exports = ({
    metadata = {},
    downTemp: src,
    root: dest = '.'
}) => {
    return src ? (new Promise((resolve, reject) => {
        Metalsmith(process.cwd())
            .metadata(metadata)
            .clean(false)
            .source(src)
            .destination(dest)
            .use((files, metalsmith, done) => {
                const meta = metalsmith.metadata();
                Object.keys(files)
                    .filter(name => !noImgReg.test(name))
                    .forEach(fileName => {
                        const t = files[fileName].contents.toString();
                        files[fileName].contents = new Buffer(Handlebars.compile(t)(meta));
                    });
                done();
            }).build(err => {
                if (err) {
                    reject(err);
                    return;
                }
                fs.removeSync(src);
                fs.renameSync(path.resolve(dest, '.gitlab-ci.template.yml'), path.resolve(dest, '.gitlab-ci.yml'))
                resolve(dest);
            })
    })) : (Promise.reject(`Invalid source: ${src}`))
}