'use strict';

const auth = require('./common/auth').authenticate('jwt');
const contentRepo = require('./content-repo');
const enrollment = require('./enrollment');
const express = require('express');
const get = require('lodash/get');
const preview = require('./preview');
const program = require('./program');
const { Sequelize } = require('./common/database');
const user = require('./user');
const userGroup = require('./userGroup');

const router = express.Router();
// TODO: Remove this demo route!
router.use('/ping', (_, res) => res.jsend.success(null));
router.use('/', parseOptions);
router.use(user.path, user.router);
router.use(contentRepo.path, auth, contentRepo.router);
router.use(program.path, auth, program.router);
router.use(enrollment.path, auth, enrollment.router);
router.use(preview.path, preview.router);
router.use(userGroup.path, userGroup.router);

module.exports = router;

function parseOptions(req, _, next) {
  let sortBy = get(req.query, 'sortBy', 'id');
  if (sortBy.includes('.')) sortBy = Sequelize.literal(sortBy);
  req.options = {
    limit: parseInt(req.query.limit, 10) || 100,
    offset: parseInt(req.query.offset, 10) || 0,
    order: [[sortBy, req.query.sortOrder || 'ASC']]
  };
  next();
}
