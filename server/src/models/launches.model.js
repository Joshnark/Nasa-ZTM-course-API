const axios = require('axios');

const launches = require('./launches.schema');
const planets = require('./planets.schema');

const DEFAULT_FLIGHT_NUMBER = 100;

async function getAllLaunches(skip, limit) {
	return await launches
		.find({}, {	'__v': 0,'_id': 0})
		.sort({ flightNumber: 1 })
		.skip(skip)
		.limit(limit);
}

async function getLatestFLightNumber() {
	const latestLaunch = await launches.findOne({}).sort('-flightNumber');

	if (!latestLaunch) {
		return DEFAULT_FLIGHT_NUMBER;
	}

	return latestLaunch.flightNumber;
}

async function saveLaunch(launch) {
	await launches.findOneAndUpdate({
		flightNumber: launch.flightNumber,
	}, launch, {
		upsert: true
	})
}

async function addNewLaunch(launch) {
	const newFlightNumber = await getLatestFLightNumber() + 1;

	const newLaunch = Object.assign(launch, {
		success: true,
		upcoming: true,
		customers: ['ZTM', 'NASA'],
		flightNumber: newFlightNumber
	});

	const planet = await planets.findOne({
		keplerName: launch.target
	});

	if (!planet) {
		throw new Error('No matching planet was found');
	}

	await saveLaunch(newLaunch);
}

async function findLaunch(filter) {
	return await launches.findOne(filter);
}

async function launchExists(launchID) {
	return await findLaunch({
		flightNumber: launchID
	}, {
		'__v': 0,
		'_id': 0
	})
}


async function abortLaunch(id) {
	const aborted = await launches.updateOne({
		flightNumber: id
	}, {
		upcoming: false,
		success: false,
	});

	return aborted.matchedCount === 1 && aborted.modifiedCount === 1
}

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunchesData() {
	const response = await axios.post(SPACEX_API_URL, {
		query: {},
		options: {
			pagination: false,
			populate: [
				{
					path: 'rocket',
					select: {
						name: 1
					}
				},
				{
					path: 'payloads',
					select: {
						customers: 1
					}
				}
			]
		}
	});

	const launchDocs = response.data.docs;

	for(const launchDoc of launchDocs) {
		const payloads = launchDoc['payloads'];

		const customers = payloads.flatMap((payload) => {
			return payload['customers'];
		})

		const launch = {
			flightNumber: launchDoc['flight_number'],
			mission: launchDoc['name'],
			rocket: launchDoc['rocket']['name'],
			launchDate: launchDoc['date_local'],
			upcoming: launchDoc['upcoming'],
			success: launchDoc['success'],
			customers,
		}

		await saveLaunch(launch)
	}
}

async function loadLaunchesData() {
	const firstLaunch = await findLaunch({
		flightNumber: 1,
		rocket: 'Falcon 1',
		mission: 'FalconSat'
	});

	if (firstLaunch) {
		console.log('Launch data already loaded');
		return;
	}

	await populateLaunchesData();
}

module.exports = {
	getAllLaunches,
	addNewLaunch,
	launchExists,
	abortLaunch,
	loadLaunchesData
};
