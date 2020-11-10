const express = require('express');
const router = express.Router();
const user = require('../controller/User.js');

router.post('/createuser',user);
router.post('/signin',user);

module.exports = user;