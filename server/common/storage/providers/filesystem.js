const fileType = require('file-type');
const FsBlobStore = require('fs-blob-store');
const fse = require('fs-extra');
const getStream = require('get-stream');
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
  constructor(path) {
    super(path);
    this.path = path;
  }

  static createStore(config) {
    return new FsStore(config.path);
  }

  copyDir(src, dest) {
    return fse.copy(path.join(this.path, src), path.join(this.path, dest));
  }

  getFileUrl(key) {
    return getStream.buffer(FsBlobStore(this.path).createReadStream({ key }))
      .then(data => {
        const mimetype = fileType(data).mime;
        return `data:${mimetype};base64,${data.toString('base64')}`;
      });
  }
}

module.exports = {
  schema,
  errors,
  createStore: FsStore.createStore
};
