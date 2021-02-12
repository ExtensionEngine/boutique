'use strict';

const auth = require('./common/auth').authenticate('jwt');
const contentRepo = require('./content-repo');
const enrollment = require('./enrollment');
const enrollmentOffering = require('./enrollment-offering');
const express = require('express');
const get = require('lodash/get');
const preview = require('./preview');
const program = require('./program');
const { Sequelize } = require('./common/database');
const user = require('./user');
const userGroup = require('./user-group');

const router = express.Router();

// Public routes:
router.use('/', parseOptions);
router.use(user.path, user.router);
router.use(preview.path, preview.router);

// Protected routes:
router.use(auth);
router.use(contentRepo.path, contentRepo.router);
router.use(program.path, program.router);
router.use(enrollment.path, enrollment.router);
router.use(enrollmentOffering.path, enrollmentOffering.router);
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
