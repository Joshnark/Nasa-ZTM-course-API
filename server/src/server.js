const fs = require('fs');
const path = require('path');
const https = require('https');
const app = require('./app');

require('dotenv').config();

const { connectToDatabase }  = require('./services/mongo');

const PORT = process.env.PORT || 8000;

const server = https.createServer({
	key: fs.readFileSync(path.join(__dirname, 'key.pem')),
	cert: fs.readFileSync(path.join(__dirname, 'cert.pem')),
}, app);

async function startServer() {
	await connectToDatabase();

	server.listen(PORT, () => {
		console.log(`Listening on ${PORT}`);
	});
}

startServer()