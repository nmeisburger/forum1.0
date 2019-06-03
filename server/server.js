const mongoose = require('mongoose')
const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser');
const logger = require('morgan');

const SERVER_PORT = 5000;

const app = express();
app.use(cors())

const dbRoute = "mongodb://localhost/database"
mongoose.connect(dbRoute, { useNewUrlParser: true })

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Database Connection Error:'));
db.once('open', () => console.log("DATABASE CONNECTION SUCCESSFUL"))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

const api = require('./api')
app.use('/api', api)

app.listen(SERVER_PORT, () => console.log(`LISTENING ON PORT ${SERVER_PORT}`));