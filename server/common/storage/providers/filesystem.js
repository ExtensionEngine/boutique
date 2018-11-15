const fileType = require('file-type');
const FsBlobStore = require('fs-blob-store');
const getStream = require('get-stream');
const Joi = require('joi');
const makeDir = require('make-dir');
const path = require('path');
const { promisify } = require('util');
const { storage } = require('../../../config');
const copyRecursive = promisify(require('ncp').ncp);

const schema = Joi.object().keys({
  path: Joi.string().required()
});

const errors = {
  notFound(err) {
    return err.code === 'ENOENT';
  }
};

class FsStore extends FsBlobStore {
  copyDir(src, dest) {
    const srcPath = path.join(storage.filesystem.path, src);
    const destPath = path.join(storage.filesystem.path, dest);
    return makeDir(destPath).then(() => copyRecursive(srcPath, destPath));
  }

  getFileUrl(key) {
    return getStream.buffer(FsBlobStore(this.path).createReadStream({ key }))
      .then(data => {
        const mimetype = fileType(data).mime;
        return `data:${mimetype};base64,${data.toString('base64')}`;
      });
  }
}

function createStore(config) {
  return new FsStore(config.path);
}

module.exports = { schema, errors, createStore };
