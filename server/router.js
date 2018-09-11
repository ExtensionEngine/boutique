'use strict';

const auth = require('./common/auth').authenticate('jwt');
const contentRepo = require('./content-repo');
const enrollment = require('./enrollment');
const express = require('express');
const cohort = require('./cohort');
const user = require('./user');

const router = express.Router();
// TODO: Remove this demo route!
router.use('/ping', (_, res) => res.jsend.success(null));
router.use(user.path, user.router);
router.use(contentRepo.path, auth, contentRepo.router);
router.use(cohort.path, auth, cohort.router);
router.use(enrollment.path, auth, enrollment.router);

module.exports = router;
