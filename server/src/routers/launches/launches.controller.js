const { getAllLaunches, addNewLaunch, launchExists, abortLaunch, loadLaunchesData } = require('../../models/launches.model');
const { getPagination } = require('../../services/query');

async function httpGetAllLaunches(req, res) {
	await loadLaunchesData()
	const { skip, limit } = getPagination(req.query);
	const launches = await getAllLaunches(skip, limit);
	return res.status(200).json(launches);
}

async function httpPostNewLaunch(req, res) {
	await loadLaunchesData()
	const launch = req.body;

	if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
		return res.status(400).json({
			error: "Missing required property"
		});
	}

	launch.launchDate = new Date(launch.launchDate);

	if (isNaN(launch.launchDate)) {
		return res.status(400).json({
			error: "Invalid date format"
		});
	}

	try {
		await addNewLaunch(launch);
		return res.status(201).json(launch);
	} catch (err) {
		return res.status(400).json({
			error: err.message
		});
	}
}

async function httpDeleteLaunch(req, res) {
	await loadLaunchesData()
	const id = Number(req.params.id);

	const launch = await launchExists(id)

	if (!launch) {
		return res.status(404).json({
			error: "Launch does not exist"
		})
	}

	const aborted = await abortLaunch(id);

	if (!aborted) {
		return res.status(400).json({
			error: 'Launch not aborted'
		});
	}

	return res.status(200).json(launch);
}

module.exports = {
	httpGetAllLaunches,
	httpPostNewLaunch,
	httpDeleteLaunch
};
