const Joi = require('joi');
const S3 = require('aws-sdk/clients/s3');
const s3blobs = require('s3-blob-store');

const API_VERSION = '2006-03-01';

const schema = Joi.object().keys({
  region: Joi.string().required(),
  bucket: Joi.string().required(),
  key: Joi.string().required(),
  secret: Joi.string().required()
});

const errors = {
  notFound(err) {
    return err.code === 'NoSuchKey';
  }
};

function createStore(config) {
  const client = new S3({
    accessKeyId: config.key,
    secretAccessKey: config.secret,
    region: config.region,
    apiVersion: API_VERSION,
    ...config
  });
  return s3blobs({ client, bucket: config.bucket });
}

module.exports = { schema, errors, createStore };
