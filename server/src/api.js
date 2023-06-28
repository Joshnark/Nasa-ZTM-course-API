const express = require('express');

const planetsRouter = require('./routers/planets/planets.router.js');
const launchesRouter = require('./routers/launches/launches.router.js');

const api = express.Router();

api.use('/planets', planetsRouter);
api.use('/launches', launchesRouter);

module.exports = api