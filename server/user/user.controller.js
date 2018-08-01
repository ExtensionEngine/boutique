'use strict';

const { createError } = require('../common/errors');
const { Sequelize, User } = require('../common/database');
const HttpStatus = require('http-status');
const map = require('lodash/map');
const pick = require('lodash/pick');
const fs = require('fs');
const path = require('path');

const { BAD_REQUEST, NOT_FOUND } = HttpStatus;
const inputAttrs = ['email', 'role', 'firstName', 'lastName', 'avatar'];
const Op = Sequelize.Op;

function list({ query: { email, emailLike, role } }, res) {
  const cond = [];
  if (email) cond.push({ email });
  if (emailLike) cond.push({ email: { [Op.iLike]: `%${emailLike}%` } });
  if (role) cond.push({ role });
  return User.findAll({ where: { [Op.and]: cond } })
    .then(users => res.jsend.success(map(users, 'profile')));
}

function create(req, res) {
  const { body } = req;
  const origin = req.origin();
  body.avatar = getRandomDefaultAvatar();
  return User.findOne({ where: { email: body.email } })
    .then(user => !user || createError(NOT_FOUND, 'User already exists!'))
    .then(() => User.invite(pick(body, inputAttrs), { origin }))
    .then(user => res.jsend.success(user.profile));
}

function patch({ params, body }, res) {
  return User.findById(params.id, { paranoid: false })
    .then(user => user || createError(NOT_FOUND, 'User does not exist!'))
    .then(user => user.update(pick(body, inputAttrs)))
    .then(user => res.jsend.success(user.profile));
}

function login({ body }, res) {
  const { email, password } = body;
  if (!email || !password) {
    return createError(BAD_REQUEST, 'Please enter email and password!');
  }

  return User.find({ where: { email } })
    .then(user => user || createError(NOT_FOUND, 'User does not exist!'))
    .then(user => user.authenticate(password))
    .then(user => user || createError(NOT_FOUND, 'Wrong password!'))
    .then(user => {
      const token = user.createToken({ expiresIn: '5 days' });
      res.jsend.success({ token, user: user.profile });
    });
}

function forgotPassword(req, res) {
  const { email } = req.body;
  const origin = req.origin();
  return User.find({ where: { email } })
    .then(user => user || createError(NOT_FOUND, 'User not found!'))
    .then(user => user.sendResetToken({ origin }))
    .then(() => res.end());
}

function resetPassword({ body, params }, res) {
  const { password, token } = body;
  return User.find({ where: { token } })
    .then(user => user || createError(NOT_FOUND, 'Invalid token!'))
    .then(user => {
      user.password = password;
      return user.save();
    })
    .then(() => res.end());
}

function saveAvatar({ file, user }, res) {
  let destDirPath = path.join(__dirname, `./..`);
  let destSubDir = 'images';

  return saveImage(file, destDirPath, destSubDir)
    .then(newPath => {
      return deleteImage(user.avatar, destDirPath, destSubDir)
        .then(() => { return Promise.resolve(newPath); });
    })
    .then(newPath => res.send(newPath))
    .catch(err => res.sendStatus(500).send(err.message));
}

function saveImage(file, destDirPath, destSubDir) {
  return new Promise((resolve, reject) => {
    fs.rename(
      file.path,
      `${destDirPath}/${destSubDir}/${file.filename}`,
      err => {
        if (err) reject(err);
        let destDirName = destDirPath.split(path.sep).pop();
        resolve(`${destDirName}/${destSubDir}/${file.filename}`);
      }
    );
  });
}

function deleteImage(filename, destDirPath, destSubDir) {
  return new Promise((resolve, reject) => {
    if (!filename) resolve();
    fs.unlink(`${destDirPath}/${destSubDir}/${path.basename(filename)}`, err => {
      if (err && err.code !== 'ENOENT') reject(err);
      resolve();
    });
  });
}

// TODO: Replace hardcoded data with actual data
function getRandomDefaultAvatar() {
  let temporarilyHardcodedImageDirectory = 'server/images';
  let temporarilyHardcodedImageNames = [
    'blue_dark.png',
    'blue_light.png',
    'green_dark.png',
    'green_light.png',
    'orange.png',
    'pink.png',
    'purple.png',
    'red.png',
    'teal.png',
    'yellow.png'
  ];
  let randomIndex = Math.floor(
    Math.random() * temporarilyHardcodedImageNames.length
  );
  let randomImageName = temporarilyHardcodedImageNames[randomIndex];
  return `${temporarilyHardcodedImageDirectory}/icon_default_${randomImageName}`;
}

module.exports = {
  list,
  create,
  patch,
  login,
  forgotPassword,
  resetPassword,
  saveAvatar
};
