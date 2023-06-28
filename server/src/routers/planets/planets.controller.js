const { 
	getAllPlanetsInDb 
} = require('../../models/planets.model.js');

async function getAllPlanets(req, res) {
	const habitablePlanets = await getAllPlanetsInDb();
	return res.status(200).json(habitablePlanets);
}

module.exports = {
	getAllPlanets
};