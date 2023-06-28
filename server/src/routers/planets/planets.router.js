const express = require('express');
const planetsController = require('./planets.controller.js');

const planetsRouter = express.Router();

planetsRouter.get('/', planetsController.getAllPlanets);

module.exports = planetsRouter;
