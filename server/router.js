const auth = require('passport').authenticate('jwt');
const express = require('express');
const course = require('./course');
const user = require('./user');

const router = express.Router();
router.use(course.path, auth, course.router);
router.use(user.path, user.router);

module.exports = router;
