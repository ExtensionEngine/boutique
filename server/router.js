'use strict';

const auth = require('./common/auth').authenticate('jwt');
const express = require('express');
const course = require('./course');
const program = require('./program');
const user = require('./user');

const router = express.Router();
// TODO: Remove this demo route!
router.use('/ping', (_, res) => res.jsend.success(null));
router.use(user.path, user.router);
router.use(course.path, auth, course.router);
router.use(program.path, auth, program.router);

module.exports = router;
