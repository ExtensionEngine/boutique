'use strict';

const auth = require('./common/auth').authenticate('jwt');
const express = require('express');
const studentApi = require('./studentApi');

const router = express.Router();
router.use(studentApi.path, auth, studentApi.router);

module.exports = router;
