const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const api = require('./api')

const app = express();

var whiteList = ["http://localhost:3000", "http://localhost:8000/index.html"];
var corsOptions = {
    origin: function (origin, callback) {
        if (whiteList.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true);
            //callback(new Error(`${origin} not allowed by CORS`));
        }
    }
};

app.use(helmet());
    
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/v1', api);

app.get('/*',(req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app
