'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const colors = require('colors');
const fs = require('fs');

const sha256 = require('js-sha256');
const bcrypt = require('bcrypt');

var app = express();

const port = 3001;

/* ========== LOADING ALL MONGOOSE MODELS ========== */

const mongoose = require('mongoose');
const Comment = require('./api/models/Comment');
const { Person, Administration } = require('./api/models/Person');
const Project = require('./api/models/Project');
const Specialization = require('./api/models/Specialization');
const Year = require('./api/models/Year');
const Task = require('./api/models/Task');
const File = require('./api/models/File');

const config = require('./config.json');

mongoose.Promise = global.Promise;
mongoose.connect(
	`mongodb://${config.db.hostname + ":" + config.db.port}/${config.db.name}`,
	{ useNewUrlParser: true },
	(err) => {
		if (err) {
			console.error(colors.red(err.message));
			process.exit(-1);
		} else {
			initDB();
		}
	});

const auth = require('./api/controllers/authController');

fs.exists("./.uploads", exists => {
	if (!exists)
		fs.mkdirSync("./.uploads");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(auth.passport.initialize());
app.use(auth.passport.session());

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	if (req.method === 'OPTIONS')
		res.sendStatus(200);
	else
		next();

});

var auth_routes = require('./api/routes/authRoutes')
auth_routes(app);

var mail = require('./api/routes/mailsRoutes');
mail(app);

var pdf = require('./api/routes/pdfRoutes');
pdf(app);

var project_routes = require('./api/routes/projectRoutes');
project_routes(app); //register the route

var partner_routes = require('./api/routes/partnerRoutes');
partner_routes(app);

var specializationRoutes = require('./api/routes/specializationRoutes');
specializationRoutes(app);

var yearRoutes = require('./api/routes/yearRoutes');
yearRoutes(app);

var userRoutes = require('./api/routes/userRoutes');
userRoutes(app);

var commentRoutes = require('./api/routes/commentRoutes');
commentRoutes(app);

app.use('/static', express.static('./.uploads'));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

//app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.send({ message: err.message, name: err.name });
});

var server = app.listen(port, () => {
	console.log('Server running on port 3001'.green);
});

module.exports = server;

function initDB() {
	if (process.env.NODE_ENV != "test") {
		Specialization
			.find()
			.estimatedDocumentCount((err, count) => {
				if (err) throw err;
				else if (count < 4) {
					console.log("Creating specializations");

					let IBO = new Specialization();
					IBO.name.fr = "Informatique, Big Data et Objets connectés";
					IBO.name.en = "Computer science, Big Data and IoT";
					IBO.description.fr = "Informatique, Développement logiciel, Data Science, Objets Connectés & internet des objets, Cybersécurité, E-santé";
					IBO.description.en = "IT, Software Development, Data Science, Connected Objects & Internet of Things, Cybersecurity, E-Health";
					IBO.abbreviation = "IBO";
					IBO.save();

					let NE = new Specialization();
					NE.name.fr = "Nouvelles énergies";
					NE.name.en = "New Energies";
					NE.description.fr = "Transition énergétique, Objets Connectés & Internet des Objets, Mobilité Durable et Intelligente, E-santé, Smart Buildings and Cities, Smart Grid, Systèmes embarqués";
					NE.description.en = "Energy transition, Connected Objects & Internet of Things, Sustainable and Intelligent Mobility, E-Health, Smart Buildings and Cities, Smart Grid, Embedded Systems";
					NE.abbreviation = "NE";
					NE.save();

					let IF = new Specialization();
					IF.name.fr = "Ingénierie Financière";
					IF.name.en = "Financial Engineering";
					IF.description.fr = "Finance, Data Science, Actuariat, Fintech, Finance de Marché";
					IF.description.en = "Finance, Data Science, Actuarial, Fintech, Market Finance";
					IF.abbreviation = "IF";
					IF.save();

					let MNM = new Specialization();
					MNM.name.fr = "Mécanique Numérique et Modélisation";
					MNM.name.en = "Computational Mechanics and Modelling";
					MNM.description.fr = "Mécanique, CAO, Modélisation, Aéronautique, Smart Building and cities, Automobile et transports terrestres, Process Engineering";
					MNM.description.en = "Mechanics, CAD, Modelling, Aeronautics, Smart Building and cities, Automotive and land transport, Process Engineering";
					MNM.abbreviation = "MNM";
					MNM.save();
				}
			});

		Year
			.find()
			.estimatedDocumentCount((err, count) => {
				if (err) throw err;
				else if (count < 2) {
					console.log("Creating years");

					let A4 = new Year();
					A4.abbreviation = "A4";
					A4.name.fr = "Année 4";
					A4.name.en = "4th Year";
					A4.save();

					let A5 = new Year();
					A5.abbreviation = "A5";
					A5.name.fr = "Année 5";
					A5.name.en = "5th Year";
					A5.save();
				}
			});

		Administration
			.find()
			.estimatedDocumentCount((err, count) => {
				if (err) throw err;
				else if (count == 0) {
					console.log("Creating new root user");

					let root = new Administration();
					root.admin = true;
					root.email = "root@member.com";
					root.first_name = "Root";
					root.last_name = "User";

					bcrypt.hash(sha256(root.email + "azerT1234"), config.bcrypt.saltRounds, (err, hash) => {
						if (err) next(err);
						else {
							root.password = hash;

							root.save((err, ad) => {
								if (err) throw err;
							});
						}
					});
				}
			})
	}
}