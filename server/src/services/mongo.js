const mongoose = require('mongoose');

require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL

mongoose.connection.once('open', () => {
	console.log('DB loaded!');
});

mongoose.connection.on('error', (err) => {
	console.error(err);
})

async function connectToDatabase() {
    await mongoose.connect(MONGO_URL);
}

async function disconnect() {
    await mongoose.disconnect();
}

module.exports = {
    connectToDatabase,
    disconnect
}