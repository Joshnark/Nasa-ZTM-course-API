const path = require('path');
const fs = require('fs');
const { parse } = require('csv-parse');

const planets = require('./planets.schema')

function isHabitablePlanet(planet) {
	return planet['koi_disposition'] === 'CONFIRMED'
	&& planet['koi_insol'] > 0.36
	&& planet['koi_insol'] < 1.11
	&& planet['koi_prad'] < 1.6;
}

async function loadPlanets() {
	const habitablePlanets = [];
	return new Promise((resolve, reject) => {
		fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
			.pipe(parse({
				comment: '#',
				columns: true
			}))
			.on('data', async (data) => {
				if (isHabitablePlanet(data)) {
					await savePlanet(data);
					habitablePlanets.push(data);
				}
			})
			.on('error', (error) => {
				reject(error);
			})
			.on('end', async () => {
				resolve(habitablePlanets);
			});
	})
}

async function savePlanet(planet) {
	try {
		await planets.updateOne({
			keplerName: planet.kepler_name,
		}, {
			keplerName: planet.kepler_name,
		}, {
			upsert: true,
		})
	} catch(err) {
		//console.error(err)
	}
}

async function getAllPlanetsInDb() {
	await loadPlanets();
	return await planets.find({}, {
		'__v': 0,
		'_id': 0
	});
}

module.exports = {
	getAllPlanetsInDb
}
