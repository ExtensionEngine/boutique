const fsBlobs = require('fs-blob-store');
const Joi = require('joi');

const schema = Joi.object().keys({
  path: Joi.string().required()
});

const errors = {
  notFound(err) {
    return err.code === 'ENOENT';
  }
};

function createStore(config) {
  return fsBlobs(config.path);
}

module.exports = { schema, errors, createStore };
