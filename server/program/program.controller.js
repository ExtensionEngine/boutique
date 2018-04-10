'use strict';

const { Program } = require('../common/database');
const pick = require('lodash/pick');

const processInput = input => pick(input, ['name', 'description']);

function list(req, res) {
  return Program.findAll().then(programs => res.jsend.success(programs));
}

function create({ body }, res) {
  return Program.create(processInput(body))
    .then(program => res.jsend.success({ program }));
}

function patch({ body, program }, res) {
  return program.update(processInput(body))
    .then(program => res.jsend.success({ program }));
}

module.exports = {
  list,
  create,
  patch
};
