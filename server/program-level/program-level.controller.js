'use strict';

const { ProgramLevel } = require('../common/database');
const pick = require('lodash/pick');

const processInput = input => pick(input, ['name', 'programId']);

function list(req, res) {
  return ProgramLevel.findAll().then(levels => res.jsend.success(levels));
}

function create({ body }, res) {
  return ProgramLevel.create(processInput(body))
    .then(programLevel => res.jsend.success(programLevel));
}

function patch({ body, programLevel }, res) {
  return programLevel.update(processInput(body))
    .then(programLevel => res.jsend.success(programLevel));
}

module.exports = {
  list,
  create,
  patch
};
