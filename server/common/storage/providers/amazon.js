const Joi = require('joi');
const path = require('path');
const Promise = require('bluebird');
const S3 = require('aws-sdk/clients/s3');
const S3BlobStore = require('s3-blob-store');

const API_VERSION = '2006-03-01';
const DEFAULT_EXPIRATION_TIME = 3600;

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

class S3Store extends S3BlobStore {
  async copyDir(src, dest) {
    const Bucket = this.bucket;
    const opts = { Bucket, Delimiter: '/', Prefix: src };
    const { Contents } = await this.s3.listObjectsV2(opts).promise();
    return Promise.map(Contents, it => {
      const opts = {
        Bucket,
        CopySource: path.join(Bucket, it.Key),
        Key: path.join(dest, path.basename(it.Key))
      };
      return this.s3.copyObject(opts).promise();
    });
  }

  getFileUrl(key) {
    const params = {
      Bucket: this.bucket,
      Key: key,
      Expires: DEFAULT_EXPIRATION_TIME
    };
    return this._getSignedUrl('getObject', params);
  }

  _getSignedUrl(operation, params) {
    return new Promise((resolve, reject) => {
      this.s3.getSignedUrl(operation, params, (err, url) => {
        if (err) return reject(err);
        resolve(url);
      });
    });
  }
}

function createStore(config) {
  const client = new S3({
    signatureVersion: 'v4',
    accessKeyId: config.key,
    secretAccessKey: config.secret,
    region: config.region,
    apiVersion: API_VERSION,
    ...config
  });

  return new S3Store({ client, bucket: config.bucket });
}

module.exports = { schema, errors, createStore };
