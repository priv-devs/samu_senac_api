const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const routeLogger = require('../middlewares/routeLogger');

app.use(express.json());
app.use(routeLogger());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static('public'));



module.exports = app;
