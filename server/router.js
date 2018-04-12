'use strict';

const auth = require('./common/auth').authenticate('jwt');
const express = require('express');
const course = require('./course');
const district = require('./district');
const program = require('./program');
const programLevel = require('./program-level');
const school = require('./school');
const user = require('./user');

const router = express.Router();
// TODO: Remove this demo route!
router.use('/ping', (_, res) => res.jsend.success(null));
router.use(user.path, user.router);
router.use(course.path, auth, course.router);
router.use(district.path, auth, district.router);
router.use(program.path, auth, program.router);
router.use(programLevel.path, auth, programLevel.router);
router.use(school.path, auth, school.router);

module.exports = router;
