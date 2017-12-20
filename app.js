const express       = require('express');
const path          = require('path');
const logger        = require('morgan');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');

const sync          = require('./routes/sync/sync');

const app = express();

function ensureSecure(req, res, next){
	if(req.secure){
		return next();
	};
	res.redirect('https://' + req.hostname + ":" + (process.env.HTTPS_PORT || 443) + req.url);
}

app.all('*', ensureSecure);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/sync', sync);

module.exports = app;
