'use strict';

const auth = require('./common/auth').authenticate('jwt');
const contentRepo = require('./content-repo');
const enrollment = require('./enrollment');
const express = require('express');
const get = require('lodash/get');
const preview = require('./preview');
const program = require('./program');
const { Sequelize, User } = require('./common/database');
const user = require('./user');
const group = require('./group');

const router = express.Router();
// TODO: Remove this demo route!
router.use('/ping', (_, res) => res.jsend.success(null));
router.use('/', parseOptions);
router.use(user.path, user.router);
router.use(group.path, group.router);
router.use(contentRepo.path, auth, contentRepo.router);
router.use(program.path, auth, program.router);
router.use(enrollment.path, auth, enrollment.router);
router.use(preview.path, preview.router);

module.exports = router;

function parseOptions(req, _, next) {
  let sortBy = get(req.query, 'sortBy', 'id');
  let order = sortBy === 'groupId'
    ? [[User.associations.group, 'name', req.query.sortOrder]]
    : [[sortBy, req.query.sortOrder || 'ASC']];
  if (sortBy.includes('.')) sortBy = Sequelize.literal(sortBy);
  req.options = {
    limit: parseInt(req.query.limit, 10) || 100,
    offset: parseInt(req.query.offset, 10) || 0,
    order
  };
  next();
}
