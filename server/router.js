'use strict';

const auth = require('./common/auth').authenticate('jwt');
const express = require('express');
const course = require('./course');
const enrollment = require('./enrollment');
const program = require('./program');
const programLevel = require('./program-level');
const user = require('./user');

const router = express.Router();
// TODO: Remove this demo route!
router.use('/ping', (_, res) => res.jsend.success(null));
router.use(user.path, user.router);
router.use(course.path, auth, course.router);
router.use(program.path, auth, program.router);
router.use(programLevel.path, auth, programLevel.router);
router.use(enrollment.path, auth, enrollment.router);

module.exports = router;
