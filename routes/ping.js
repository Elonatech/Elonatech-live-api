const express = require('express');

const route = express.Router();

const {
  KeepRenderApiAlive
} = require('../controller/ping');

route.get('/ping', KeepRenderApiAlive);

module.exports = route;