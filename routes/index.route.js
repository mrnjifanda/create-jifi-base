const express = require('express');
const router = express.Router();
const { home } = require('../controllers/index.controller');

router.get('/', home);