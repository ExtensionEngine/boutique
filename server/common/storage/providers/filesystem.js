const FsBlobStore = require('fs-blob-store');
const fse = require('fs-extra');
const Joi = require('joi');
const path = require('path');

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
    return fse.copy(path.join(this.path, src), path.join(this.path, dest));
  }
}

function createStore(config) {
  return new FsStore(config.path);
}

module.exports = { schema, errors, createStore };
