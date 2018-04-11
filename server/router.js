'use strict';

const auth = require('passport').authenticate('jwt');
const express = require('express');
const course = require('./course');
const program = require('./program');
const programLevel = require('./program-level');
const user = require('./user');

const router = express.Router();
// TODO: Remove this demo route!
router.use('/ping', (_, res) => res.jsend.success(null));
router.use(course.path, auth, course.router);
router.use(program.path, program.router);
router.use(programLevel.path, programLevel.router);
router.use(user.path, user.router);

module.exports = router;
