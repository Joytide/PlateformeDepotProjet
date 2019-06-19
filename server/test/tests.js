process.env.NODE_ENV = "test";

const jwt = require('jsonwebtoken');
let mongoose = require('mongoose');
let Year = require('../api/models/Year');
let Specialization = require('../api/models/Specialization');
let { Person, Student, Partner, Administration } = require('../api/models/Person');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

const config = require('../config.json');

chai.use(chaiHttp);
let requester = chai.request(server).keepOpen();

describe('Testing things related to years', () => {
    let tokens = {};

    before(done => {
        Helper
            .emptyUserDb()
            .then(() => {
                Helper
                    .createAdministration()
                    .then(user => Helper.generateToken(user))
                    .then(token => {
                        tokens['administration'] = token;
                        if (Object.keys(tokens).length === 4) done();
                    })
                    .catch(err => console.error(err));

                Helper
                    .createAdministrator()
                    .then(user => Helper.generateToken(user))
                    .then(token => {
                        tokens['administrator'] = token;
                        if (Object.keys(tokens).length === 4) done();
                    })
                    .catch(err => console.error(err));

                Helper
                    .createEPGE()
                    .then(user => Helper.generateToken(user))
                    .then(token => {
                        tokens['EPGE'] = token;
                        if (Object.keys(tokens).length === 4) done();
                    })
                    .catch(err => console.error(err));

                Helper
                    .createPartner()
                    .then(user => Helper.generateToken(user))
                    .then(token => {
                        tokens['partner'] = token;
                        if (Object.keys(tokens).length === 4) done();
                    })
                    .catch(err => console.error(err));
            })
            .catch(err => console.error(err));
    });

    beforeEach(done => {
        Year.deleteMany({}, err => {
            done();
        });
    });

    describe("/GET /api/year", () => {
        it('it should GET 0 years', done => {
            requester
                .get('/api/year')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });

        it('it should GET 1 year', done => {
            let year = new Year();
            year.abbreviation = "A1";
            year.name.en = "1st Year";
            year.name.fr = "Année 1";

            year.save((err, yearCreated) => {
                requester
                    .get('/api/year')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(1);
                        res.body[0].should.have.property('abbreviation', yearCreated.abbreviation);
                        res.body[0].should.have.property('_id', yearCreated._id.toString());
                        res.body[0].should.have.deep.property('name', { fr: yearCreated.name.fr, en: yearCreated.name.en });

                        done();
                    });
            });
        });
    });

    describe("/GET /api/year/:id", () => {
        it('it should GET 0 years because _id is invalid', done => {
            requester
                .get('/api/year/aaa')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });

        it('it should GET 1 year', done => {
            let year = new Year();
            year.abbreviation = "A1";
            year.name.en = "1st Year";
            year.name.fr = "Année 1";

            year.save((err, yearCreated) => {
                requester
                    .get('/api/year/' + yearCreated._id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('abbreviation', yearCreated.abbreviation);
                        res.body.should.have.property('_id', yearCreated._id.toString());
                        res.body.should.have.deep.property('name', { fr: yearCreated.name.fr, en: yearCreated.name.en });

                        done();
                    });
            });
        });

        it("it should get an empty object because _id doesn't exist in db", done => {
            requester
                .get('/api/year/5c56e3bf2e73c7233048a6aa')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.be.eql({});

                    done();
                });
        });
    });

    describe("/PUT /api/year", () => {
        it('it should create a new year with administrator token', done => {
            let data = {
                abbreviation: "A1",
                nameFr: "Année 1",
                nameEn: "1st Year"
            }
            requester
                .put('/api/year')
                .set("authorization", tokens['administrator'])
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('abbreviation', data.abbreviation);
                    done();
                });
        });

        it("it shouldn't create a new year because abbreviation field is missing", done => {
            let data = {
                nameFr: "Année 1",
                nameEn: "1st Year"
            }
            requester
                .put('/api/year')
                .send(data)
                .end((err, res) => {
                    res.should.not.have.status(200);
                    res.body.should.not.have.property('_id');
                    done();
                });
        });

        it("it shouldn't create a new year because nameFr field is missing", done => {
            let data = {
                abbreviation: "A1",
                nameEn: "1st Year"
            }
            requester
                .put('/api/year')
                .send(data)
                .end((err, res) => {
                    res.should.not.have.status(200);
                    res.body.should.not.have.property('_id');
                    done();
                });
        });

        it("it shouldn't create a new year because nameEn field is missing", done => {
            let data = {
                abbreviation: "A1",
                nameFr: "Année 1",
            }
            requester
                .put('/api/year')
                .send(data)
                .end((err, res) => {
                    res.should.not.have.status(200);
                    res.body.should.not.have.property('_id');
                    done();
                });
        });

        it("it shouldn't create a new year because the user isn't administrator (partner)", done => {
            let data = {
                abbreviation: "A1",
                nameFr: "Année 1",
                nameEn: "1st Year"
            }
            requester
                .put('/api/year')
                .set("authorization", tokens['partner'])
                .send(data)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });

        it("it shouldn't create a new year because the user isn't administrator (EGPE)", done => {
            let data = {
                abbreviation: "A1",
                nameFr: "Année 1",
                nameEn: "1st Year"
            }
            requester
                .put('/api/year')
                .set("authorization", tokens['EPGE'])
                .send(data)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });

        it("it shouldn't create a new year because the user isn't administrator (administration)", done => {
            let data = {
                abbreviation: "A1",
                nameFr: "Année 1",
                nameEn: "1st Year"
            }
            requester
                .put('/api/year')
                .set("authorization", tokens['administration'])
                .send(data)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });

    describe("/DELETE /api/year", () => {
        let year_db;

        beforeEach(done => {
            Year.deleteMany({}, err => {
                let year = new Year();
                year.abbreviation = "A1";
                year.name.en = "1st Year";
                year.name.fr = "Année 1";

                year.save((err, yearCreated) => {
                    year_db = yearCreated;
                    done();
                });
            });
        });

        it('it should delete a year and get the deleted year(s) in return', done => {
            requester
                .delete('/api/year')
                .set("authorization", tokens['administrator'])
                .send({ _id: year_db._id })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id', year_db._id.toString());
                    Year.findById(year_db._id, (err, res) => {
                        if (res) done(new Error("Year not deleted correctly"));
                        else done();
                    });
                });
        });

        it("it shouldn't delete a year cause _id field isn't an ObjectId", done => {
            requester
                .delete('/api/year')
                .set("authorization", tokens['administrator'])
                .send({ _id: "test" })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name', "CastError");
                    done();
                });
        });

        it("it shouldn't delete a year cause _id doesn't exist in db", done => {
            requester
                .delete('/api/year')
                .set("authorization", tokens['administrator'])
                .send({ _id: "5c56e3bf2e73c7233048a6aa" })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.be.eql({})
                    done();
                });
        });

        it("it shouldn't delete a year cause _id field is empty", done => {
            requester
                .delete('/api/year')
                .set("authorization", tokens['administrator'])
                .send()
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name', "MissingId");
                    done();
                });
        });

        it("it shouldn't delete a year because the user isn't administrator (partner)", done => {
            requester
                .delete('/api/year')
                .set("authorization", tokens['partner'])
                .send()
                .end((err, res) => {
                    res.should.have.status(401);
                    Year.estimatedDocumentCount((err, count) => {
                        if (count == 1) done();
                        else done(new Error("Year shouldn't by deleted when access is refused"));
                    });
                });
        });

        it("it shouldn't delete a year because the user isn't administrator (EGPE)", done => {
            requester
                .delete('/api/year')
                .set("authorization", tokens['EPGE'])
                .send()
                .end((err, res) => {
                    res.should.have.status(401);
                    Year.estimatedDocumentCount((err, count) => {
                        if (count == 1) done();
                        else done(new Error("Year shouldn't by deleted when access is refused"));
                    });
                });
        });

        it("it shouldn't delete a year because the user isn't administrator (administration)", done => {
            requester
                .delete('/api/year')
                .set("authorization", tokens['administration'])
                .send()
                .end((err, res) => {
                    res.should.have.status(401);
                    Year.estimatedDocumentCount((err, count) => {
                        if (count == 1) done();
                        else done(new Error("Year shouldn't by deleted when access is refused"));
                    });
                });
        });
    });

    describe("/POST /api/year", () => {
        let year_db;

        beforeEach(done => {
            Year.deleteMany({}, err => {
                let year = new Year();
                year.abbreviation = "A1";
                year.name.en = "1st Year";
                year.name.fr = "Année 1";

                year.save((err, yearCreated) => {
                    year_db = yearCreated;
                    done();
                });
            });
        });

        it("it should update abbreviation without breaking other fields", done => {
            let update = {
                _id: year_db._id,
                abbreviation: "A2"
            }

            requester
                .post('/api/year')
                .set("authorization", tokens['administrator'])
                .send(update)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id', year_db._id.toString());
                    res.body.should.have.property('abbreviation', update.abbreviation);
                    res.body.name.should.have.property('en', year_db.name.en);
                    res.body.name.should.have.property('fr', year_db.name.fr);
                    done();
                });
        });

        it("it should update name fr without breaking other fields", done => {
            let update = {
                _id: year_db._id,
                nameFr: "Année 2"
            }

            requester
                .post('/api/year')
                .set("authorization", tokens['administrator'])
                .send(update)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id', year_db._id.toString());
                    res.body.should.have.property('abbreviation', year_db.abbreviation);
                    res.body.should.have.property('name');
                    res.body.name.should.have.property('en', year_db.name.en);
                    res.body.name.should.have.property('fr', update.nameFr);
                    done();
                });
        });

        it("it should update name en without breaking other fields", done => {
            let update = {
                _id: year_db._id,
                nameEn: "2nd Year"
            }

            requester
                .post('/api/year')
                .set("authorization", tokens['administrator'])
                .send(update)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id', year_db._id.toString());
                    res.body.should.have.property('abbreviation', year_db.abbreviation);
                    res.body.should.have.property('name');
                    res.body.name.should.have.property('en', update.nameEn);
                    res.body.name.should.have.property('fr', year_db.name.fr);
                    done();
                });
        });

        it("it should return an error because _id isn't an ObjectId", done => {
            let update = {
                _id: "aaa",
                nameEn: "2nd Year"
            }

            requester
                .post('/api/year')
                .set("authorization", tokens['administrator'])
                .send(update)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name', "CastError");
                    done();
                });
        });

        it("it should return an error because _id is missing", done => {
            let update = {
                nameEn: "2nd Year"
            }

            requester
                .post('/api/year')
                .set("authorization", tokens['administrator'])
                .send(update)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name', "MissingId");
                    done();
                });
        });

        it("it should return an error because there are no field to update", done => {
            let update = {
                _id: year_db._id
            }

            requester
                .post('/api/year')
                .set("authorization", tokens['administrator'])
                .send(update)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name', "MissingParameter");
                    done();
                });
        });

        it("it shouldn't update a year because the user isn't administrator (partner)", done => {
            let update = {
                _id: year_db._id,
                abbreviation: "A2"
            }

            requester
                .post('/api/year')
                .set("authorization", tokens['partner'])
                .send(update)
                .end((err, res) => {
                    res.should.have.status(401);
                    Year.findById(year_db._id, (err, year) => {
                        year.should.have.property('abbreviation', 'A1');
                        done();
                    });
                });
        });

        it("it shouldn't update a year because the user isn't administrator (EGPE)", done => {
            let update = {
                _id: year_db._id,
                abbreviation: "A2"
            }

            requester
                .post('/api/year')
                .set("authorization", tokens['EPGE'])
                .send(update)
                .end((err, res) => {
                    res.should.have.status(401);
                    Year.findById(year_db._id, (err, year) => {
                        year.should.have.property('abbreviation', 'A1');
                        done();
                    });
                });
        });

        it("it shouldn't update a year because the user isn't administrator (administration)", done => {
            let update = {
                _id: year_db._id,
                abbreviation: "A2"
            }

            requester
                .post('/api/year')
                .set("authorization", tokens['administration'])
                .send(update)
                .end((err, res) => {
                    res.should.have.status(401);
                    Year.findById(year_db._id, (err, year) => {
                        year.should.have.property('abbreviation', 'A1');
                        done();
                    });
                });
        });
    });
});


describe("Things related to specializations", () => {
    let tokens = {};

    before(done => {
        Helper
            .emptyUserDb()
            .then(() => {
                Helper
                    .createAdministration()
                    .then(user => Helper.generateToken(user))
                    .then(token => {
                        tokens['administration'] = token;
                        if (Object.keys(tokens).length === 4) done();
                    })
                    .catch(err => console.error(err));

                Helper
                    .createAdministrator()
                    .then(user => Helper.generateToken(user))
                    .then(token => {
                        tokens['administrator'] = token;
                        if (Object.keys(tokens).length === 4) done();
                    })
                    .catch(err => console.error(err));

                Helper
                    .createEPGE()
                    .then(user => Helper.generateToken(user))
                    .then(token => {
                        tokens['EPGE'] = token;
                        if (Object.keys(tokens).length === 4) done();
                    })
                    .catch(err => console.error(err));

                Helper
                    .createPartner()
                    .then(user => Helper.generateToken(user))
                    .then(token => {
                        tokens['partner'] = token;
                        if (Object.keys(tokens).length === 4) done();
                    })
                    .catch(err => console.error(err));
            })
            .catch(err => console.error(err));
    });

    beforeEach(done => { Specialization.deleteMany({}, done); });

    describe("/GET /api/specialization/:id", () => {
        it("it should get an error because _id isn't a valid ObjectID", done => {
            requester
                .get("/api/specialization/a")
                .end((err, res) => {
                    res.should.have.status(404);

                    done();
                });
        });

        it("it should get an empty object because specialization doesn't exist", done => {
            requester
                .get("/api/specialization/5c646f8c5928b3401c4f89fa")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.eql({});

                    done();
                });
        });

        it("it should get 1 element with a referent. Referent must only contain first & last name & email", done => {
            Helper.createEPGE()
                .then(user => {
                    Helper
                        .createSpecialization(user)
                        .then(specialization => {
                            requester
                                .get('/api/specialization/' + specialization._id.toString())
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.be.a('object');
                                    res.body.should.have.property("_id", specialization._id.toString());
                                    res.body.should.have.property("abbreviation", specialization.abbreviation);
                                    res.body.name.should.have.property("fr", specialization.name.fr);
                                    res.body.name.should.have.property("en", specialization.name.en);

                                    res.body.referent[0].should.have.property("last_name", user.last_name);
                                    res.body.referent[0].should.have.property("first_name", user.first_name);
                                    res.body.referent[0].should.have.property("_id", user._id.toString());
                                    res.body.referent[0].should.not.have.property("password");
                                    res.body.referent[0].should.not.have.property("email");
                                    done();
                                });
                        })
                        .catch(done);
                })
                .catch(done);
        });
    });

    describe("/GET /api/specialization", () => {
        it("it should return an empty array because there are no entry in db", done => {
            requester
                .get("/api/specialization")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.eql([]);

                    done();
                });
        });

        it("it should return an array with 1 element", done => {
            Helper
                .createSpecialization()
                .then(spe => {
                    requester
                        .get('/api/specialization')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('array');
                            res.body.length.should.be.eql(1);
                            res.body[0].should.have.property("_id", spe._id.toString());
                            res.body[0].should.have.property("abbreviation", spe.abbreviation);
                            res.body[0].name.should.have.property("fr", spe.name.fr);
                            res.body[0].name.should.have.property("en", spe.name.en);

                            done();
                        });
                })
                .catch(done);
        });

        it("it should get 1 element with a referent. Referent must only contain first & last name", done => {
            Helper.createEPGE()
                .then(user => {
                    Helper
                        .createSpecialization(user)
                        .then(specialization => {
                            requester
                                .get('/api/specialization')
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.be.a('array');
                                    res.body.length.should.be.eql(1);
                                    res.body[0].should.have.property("_id", specialization._id.toString());
                                    res.body[0].should.have.property("abbreviation", specialization.abbreviation);
                                    res.body[0].name.should.have.property("fr", specialization.name.fr);
                                    res.body[0].name.should.have.property("en", specialization.name.en);

                                    res.body[0].referent[0].should.have.property("last_name", user.last_name);
                                    res.body[0].referent[0].should.have.property("first_name", user.first_name);
                                    res.body[0].referent[0].should.have.property("_id", user._id.toString());
                                    res.body[0].referent[0].should.not.have.property("password");
                                    res.body[0].referent[0].should.not.have.property("email");
                                    done();
                                });
                        })
                        .catch(done);
                })
                .catch(done);
        });
    });

    describe("/PUT /api/specialization/", () => {
        beforeEach(done => {
            Specialization.deleteMany({}, done);
        });

        describe("# with admin token", () => {
            it("it should create a new spe", done => {
                let data = {
                    abbreviation: "T",
                    nameFr: "testFr",
                    nameEn: "testEn",
                    descriptionEn: "test",
                    descriptionFr: "test",
                };

                requester
                    .put('/api/specialization')
                    .send(data)
                    .set("authorization", tokens['administrator'])
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property("_id");
                        res.body.should.have.property("abbreviation", data.abbreviation);
                        res.body.name.should.have.property("fr", data.nameFr);
                        res.body.name.should.have.property("en", data.nameEn);
                        done();
                    });
            });

            it("it shouldn't create a new spe because it's missing abbreviation", done => {
                let data = {
                    nameFr: "testFr",
                    nameEn: "testEn"
                };

                requester
                    .put('/api/specialization')
                    .send(data)
                    .set("authorization", tokens['administrator'])
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.not.have.property("_id");
                        res.body.should.have.property("name", "MissingParameter");
                        done();
                    });
            });

            it("it shouldn't create a new spe because it's missing nameFr", done => {
                let data = {
                    abbreviation: "T",
                    nameEn: "testEn"
                };

                requester
                    .put('/api/specialization')
                    .send(data)
                    .set("authorization", tokens['administrator'])
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.not.have.property("_id");
                        res.body.should.have.property("name", "MissingParameter");
                        done();
                    });
            });

            it("it shouldn't create a new spe because it's missing nameEn", done => {
                let data = {
                    abbreviation: "T",
                    nameFr: "testFr",
                };

                requester
                    .put('/api/specialization')
                    .send(data)
                    .set("authorization", tokens['administrator'])
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.not.have.property("_id");
                        res.body.should.have.property("name", "MissingParameter");
                        done();
                    });
            });
        });

        it("it shouldn't create a new spe because the user isn't an admnisistrator (partner)", done => {
            let data = {
                abbreviation: "T",
                nameFr: "testFr",
                nameEn: "testEn"
            };

            requester
                .put('/api/specialization')
                .send(data)
                .set("authorization", tokens['partner'])
                .end((err, res) => {
                    res.should.have.status(401);
                    Specialization.estimatedDocumentCount((err, count) => {
                        if (err) done(err);
                        else if (count > 0) done(new Error("Unexpected number of documents. No spe should have been created"));
                        else done();
                    });
                });
        });

        it("it shouldn't create a new spe because the user isn't an admnisistrator (EGPE)", done => {
            let data = {
                abbreviation: "T",
                nameFr: "testFr",
                nameEn: "testEn"
            };

            requester
                .put('/api/specialization')
                .send(data)
                .set("authorization", tokens['EPGE'])
                .end((err, res) => {
                    res.should.have.status(401);
                    Specialization.estimatedDocumentCount((err, count) => {
                        if (err) done(err);
                        else if (count > 0) done(new Error("Unexpected number of documents. No spe should have been created"));
                        else done();
                    });
                });
        });

        it("it shouldn't create a new spe because the user isn't an admnisistrator (administration)", done => {
            let data = {
                abbreviation: "T",
                nameFr: "testFr",
                nameEn: "testEn"
            };

            requester
                .put('/api/specialization')
                .send(data)
                .set("authorization", tokens['administration'])
                .end((err, res) => {
                    res.should.have.status(401);
                    Specialization.estimatedDocumentCount((err, count) => {
                        if (err) done(err);
                        else if (count > 0) done(new Error("Unexpected number of documents. No spe should have been created"));
                        else done();
                    });
                });
        });
    });

    describe("/DELETE /api/specialization/", () => {
        let testing_spe;

        beforeEach(done => {
            Specialization.deleteMany({}, (err) => {
                Helper
                    .createSpecialization()
                    .then(spe => {
                        testing_spe = spe;
                        done();
                    })
                    .catch(done);
            });
        });

        describe("# with admin token", () => {
            it("it should delete a spe and get it returned", done => {
                requester
                    .delete('/api/specialization')
                    .send({ _id: testing_spe._id })
                    .set("authorization", tokens['administrator'])
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property("_id", testing_spe._id.toString());
                        res.body.should.have.property("abbreviation", testing_spe.abbreviation);
                        res.body.name.should.have.property("fr", testing_spe.name.fr);
                        res.body.name.should.have.property("en", testing_spe.name.en);
                        done();
                    });
            });

            it("it shouldn't delete cause _id field isn't an ObjectID", done => {
                requester
                    .delete('/api/specialization')
                    .send({ _id: "aaaa" })
                    .set("authorization", tokens['administrator'])
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property("name", "CastError");

                        done();
                    });
            });

            it("it shouldn't delete cause _id doesn't exist in db", done => {
                requester
                    .delete('/api/specialization')
                    .send({ _id: "5c6471f12e544041e4ae5102" })
                    .set("authorization", tokens['administrator'])
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.be.eql({});

                        done();
                    });
            });

            it("it shouldn't delete cause _id is empty", done => {
                requester
                    .delete('/api/specialization')
                    .set("authorization", tokens['administrator'])
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property("name", "MissingId");

                        done();
                    });
            });
        });

        it("it shouldn't delete a spe because the user isn't an admnisistrator (partner)", done => {
            requester
                .delete('/api/specialization')
                .send({ _id: testing_spe._id })
                .set("authorization", tokens['partner'])
                .end((err, res) => {
                    res.should.have.status(401);
                    Specialization.estimatedDocumentCount((err, count) => {
                        if (err) done(err);
                        else if (count == 0) done(new Error("Document shouldn't have been deleted"));
                        else done();
                    });
                });
        });

        it("it shouldn't delete a spe because the user isn't an admnisistrator (EGPE)", done => {
            requester
                .delete('/api/specialization')
                .send({ _id: testing_spe._id })
                .set("authorization", tokens['EPGE'])
                .end((err, res) => {
                    res.should.have.status(401);
                    Specialization.estimatedDocumentCount((err, count) => {
                        if (err) done(err);
                        else if (count == 0) done(new Error("Document shouldn't have been deleted"));
                        else done();
                    });
                });
        });

        it("it shouldn't delete a spe because the user isn't an admnisistrator (administration)", done => {
            requester
                .delete('/api/specialization')
                .send({ _id: testing_spe._id })
                .set("authorization", tokens['administration'])
                .end((err, res) => {
                    res.should.have.status(401);
                    Specialization.estimatedDocumentCount((err, count) => {
                        if (err) done(err);
                        else if (count == 0) done(new Error("Document shouldn't have been deleted"));
                        else done();
                    });
                });
        });
    });

    describe("/POST /api/specialization/", () => {
        let testing_spe;

        beforeEach(done => {
            Specialization.deleteMany({}, (err) => {
                Helper
                    .createSpecialization()
                    .then(spe => {
                        testing_spe = spe;
                        done();
                    })
                    .catch(done);
            });
        });

        describe("# with admin token", () => {
            it("it should update abbreviation field without breaking other fields", done => {
                let update = {
                    _id: testing_spe._id,
                    abbreviation: "TT"
                };

                requester
                    .post('/api/specialization')
                    .send(update)
                    .set("authorization", tokens['administrator'])
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property("_id", testing_spe._id.toString());
                        res.body.should.have.property("abbreviation", update.abbreviation);
                        res.body.name.should.have.property("fr", testing_spe.name.fr);
                        res.body.name.should.have.property("en", testing_spe.name.en);

                        done();
                    });
            });

            it("it should update nameFr field withtout breaking other fields", done => {
                let update = {
                    _id: testing_spe._id,
                    nameFr: "frfr"
                };

                requester
                    .post('/api/specialization')
                    .send(update)
                    .set("authorization", tokens['administrator'])
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property("_id", testing_spe._id.toString());
                        res.body.should.have.property("abbreviation", testing_spe.abbreviation);
                        res.body.name.should.have.property("fr", update.nameFr);
                        res.body.name.should.have.property("en", testing_spe.name.en);

                        done();
                    });
            });

            it("it should update nameEn field withtout breaking other fields", done => {
                let update = {
                    _id: testing_spe._id,
                    nameEn: "enen"
                };

                requester
                    .post('/api/specialization')
                    .send(update)
                    .set("authorization", tokens['administrator'])
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property("_id", testing_spe._id.toString());
                        res.body.should.have.property("abbreviation", testing_spe.abbreviation);
                        res.body.name.should.have.property("fr", testing_spe.name.fr);
                        res.body.name.should.have.property("en", update.nameEn);

                        done();
                    });
            });

            it("it shouldn't update cause _id field isn't an ObjectID", done => {
                let update = {
                    _id: "a",
                    abbreviation: "TT"
                };

                requester
                    .post('/api/specialization')
                    .send(update)
                    .set("authorization", tokens['administrator'])
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property("name", "CastError");

                        done();
                    });
            });
            it("it shouldn't update cause _id doesn't exist in db", done => {
                let update = {
                    _id: "5c646f8c5928b3401c4f89fa",
                    abbreviation: "TT"
                };

                requester
                    .post('/api/specialization')
                    .send(update)
                    .set("authorization", tokens['administrator'])
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property("name", "SpecializationNotFound");

                        done();
                    });
            });

            it("it shouldn't update cause _id is empty", done => {
                let update = {
                    abbreviation: "TT"
                };

                requester
                    .post('/api/specialization')
                    .send(update)
                    .set("authorization", tokens['administrator'])
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property("name", "MissingId");

                        done();
                    });
            });

            it("it shouldn't update because there are no fields to update", done => {
                let update = {
                    _id: testing_spe._id
                };

                requester
                    .post('/api/specialization')
                    .send(update)
                    .set("authorization", tokens['administrator'])
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property("name", "MissingParameter");

                        done();
                    });
            });
        });

        it("it shouldn't update a spe because the user isn't an admnisistrator (partner)", done => {
            let update = {
                _id: testing_spe._id,
                abbreviation: "TT"
            };

            requester
                .post('/api/specialization')
                .send(update)
                .set("authorization", tokens['partner'])
                .end((err, res) => {
                    res.should.have.status(401);
                    Specialization.findOne({ _id: testing_spe._id }, (err, spe) => {
                        spe.abbreviation.should.not.be.eql(update.abbreviation);
                        done();
                    });
                });
        });

        it("it shouldn't update a spe because the user isn't an admnisistrator (EGPE)", done => {
            let update = {
                _id: testing_spe._id,
                abbreviation: "TT"
            };

            requester
                .post('/api/specialization')
                .send(update)
                .set("authorization", tokens['EPGE'])
                .end((err, res) => {
                    res.should.have.status(401);
                    Specialization.findOne({ _id: testing_spe._id }, (err, spe) => {
                        spe.abbreviation.should.not.be.eql(update.abbreviation);
                        done();
                    });
                });
        });

        it("it shouldn't update a spe because the user isn't an admnisistrator (administration)", done => {
            let update = {
                _id: testing_spe._id,
                abbreviation: "TT"
            };

            requester
                .post('/api/specialization')
                .send(update)
                .set("authorization", tokens['administration'])
                .end((err, res) => {
                    res.should.have.status(401);
                    Specialization.findOne({ _id: testing_spe._id }, (err, spe) => {
                        spe.abbreviation.should.not.be.eql(update.abbreviation);
                        done();
                    });
                });
        });
    });

    describe("/PUT /api/specialization/referent", () => {
        let testing_epge, testing_spe;
        beforeEach(done => {
            Helper
                .createEPGE()
                .then(epge => {
                    Helper
                        .createSpecialization()
                        .then(spe => {
                            testing_epge = epge;
                            testing_spe = spe;
                            done();
                        })
                        .catch(done);
                })
                .catch(done);
        });

        describe("# with admin token", () => {
            it("it should add an existing epge member as a referent of the specialization", done => {
                requester
                    .put('/api/specialization/referent')
                    .send({ _id: testing_spe._id, referent: testing_epge._id })
                    .set("authorization", tokens['administrator'])
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property("_id", testing_spe._id.toString());
                        res.body.should.have.property("abbreviation", testing_spe.abbreviation);
                        res.body.name.should.have.property("fr", testing_spe.name.fr);
                        res.body.name.should.have.property("en", testing_spe.name.en);

                        res.body.referent.should.be.a('array');
                        res.body.referent.length.should.be.eql(1);
                        res.body.referent[0].should.be.eql(testing_epge._id.toString());

                        done();
                    });
            });

            it("it shouldn't add twice an epge member as a specialization referent", done => {
                Helper
                    .createEPGE()
                    .then(epge => {
                        Helper
                            .createSpecialization(epge)
                            .then(spe => {
                                requester
                                    .put('/api/specialization/referent')
                                    .send({ _id: spe._id, referent: epge._id })
                                    .set("authorization", tokens['administrator'])
                                    .end((err, res) => {
                                        res.should.have.status(400);
                                        res.body.should.be.a('object');
                                        res.body.should.have.property("name", "AlreadyReferent");

                                        done();
                                    });
                            })
                            .catch(done);
                    })
                    .catch(done);
            });

            it("it should return an error if spe _id is missing", done => {
                requester
                    .put('/api/specialization/referent')
                    .send({ referent: testing_epge._id })
                    .set("authorization", tokens['administrator'])
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property("name", "MissingParameter");

                        done();
                    });
            });

            it("it should return an error if referent _id is missing", done => {
                requester
                    .put('/api/specialization/referent')
                    .send({ _id: testing_spe._id })
                    .set("authorization", tokens['administrator'])
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property("name", "MissingParameter");

                        done();
                    });
            });

            it("it should return an error if spe _id doesn't exist in db", done => {
                requester
                    .put('/api/specialization/referent')
                    .send({ _id: "5c64a2f45b1ac81fd0bac02a", referent: testing_epge._id })
                    .set("authorization", tokens['administrator'])
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property("name", "SpecializationNotFound");

                        done();
                    });
            });

            it("it should return an error if referent _id doesn't exist in db", done => {
                requester
                    .put('/api/specialization/referent')
                    .send({ referent: "5c64a2f45b1ac81fd0bac02a", _id: testing_spe._id })
                    .set("authorization", tokens['administrator'])
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property("name", "UserNotFound");

                        done();
                    });
            });

            it("it should return an error if spe _id isn't a valid ObjectID", done => {
                requester
                    .put('/api/specialization/referent')
                    .send({ _id: "aaaaa", referent: testing_epge._id, })
                    .set("authorization", tokens['administrator'])
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property("name", "CastError");

                        done();
                    });
            });

            it("it should return an error if referent _id isn't a valid ObjectID", done => {
                requester
                    .put('/api/specialization/referent')
                    .send({ referent: "aaaaa", _id: testing_spe._id, })
                    .set("authorization", tokens['administrator'])
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property("name", "CastError");

                        done();
                    });
            });
        });

        it("it shouldn't add a referent to a spe because the user isn't an admnisistrator (partner)", done => {
            requester
                .put('/api/specialization/referent')
                .send({ _id: testing_spe._id, referent: testing_epge._id })
                .set("authorization", tokens['partner'])
                .end((err, res) => {
                    res.should.have.status(401);
                    Specialization.findOne({ _id: testing_spe }, (err, spe) => {
                        if (err) done(err);
                        else {
                            spe.referent.length.should.be.eql(0);
                            done();
                        }
                    });
                });
        });

        it("it shouldn't add a referent to a spe because the user isn't an admnisistrator (EGPE)", done => {
            requester
                .put('/api/specialization/referent')
                .send({ _id: testing_spe._id, referent: testing_epge._id })
                .set("authorization", tokens['EPGE'])
                .end((err, res) => {
                    res.should.have.status(401);
                    Specialization.findOne({ _id: testing_spe }, (err, spe) => {
                        if (err) done(err);
                        else {
                            spe.referent.length.should.be.eql(0);
                            done();
                        }
                    });
                });
        });

        it("it shouldn't add a referent to a spe because the user isn't an admnisistrator (administration)", done => {
            requester
                .put('/api/specialization/referent')
                .send({ _id: testing_spe._id, referent: testing_epge._id })
                .set("authorization", tokens['administration'])
                .end((err, res) => {
                    res.should.have.status(401);
                    Specialization.findOne({ _id: testing_spe }, (err, spe) => {
                        if (err) done(err);
                        else {
                            spe.referent.length.should.be.eql(0);
                            done();
                        }
                    });
                });
        });
    });

    describe("/DELETE /api/specialization/referent", () => {
        let testing_epge, testing_spe;

        beforeEach(done => {
            Helper
                .createEPGE()
                .then(epge => {
                    Helper
                        .createSpecialization(epge)
                        .then(spe => {
                            testing_epge = epge;
                            testing_spe = spe;
                            done();
                        })
                        .catch(done);
                })
                .catch(done);
        });

        describe("# with admin token", () => {
            it("it should remove referent from referent list of the specialization", done => {
                requester
                    .delete('/api/specialization/referent')
                    .send({ _id: testing_spe._id, referent: testing_epge._id })
                    .set("authorization", tokens['administrator'])
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.referent.indexOf(testing_epge._id).should.be.eql(-1);

                        done();
                    });
            });

            it("it should return an error because referent isn't in referent list of the spe", done => {
                Helper
                    .createSpecialization()
                    .then(spe => {
                        requester
                            .delete('/api/specialization/referent')
                            .send({ _id: spe._id, referent: testing_epge._id })
                            .set("authorization", tokens['administrator'])
                            .end((err, res) => {
                                res.should.have.status(400);
                                res.body.should.have.property("name", "SpecializationNotFound");

                                done();
                            });
                    })
                    .catch(done);
            });

            it("it should return an error if spe _id is missing", done => {
                requester
                    .delete('/api/specialization/referent')
                    .send({ referent: testing_epge._id })
                    .set("authorization", tokens['administrator'])
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.have.property("name", "MissingParameter");

                        done();
                    });
            });

            it("it should return an error if referent _id is missing", done => {
                requester
                    .delete('/api/specialization/referent')
                    .send({ _id: testing_spe._id })
                    .set("authorization", tokens['administrator'])
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.have.property("name", "MissingParameter");

                        done();
                    });
            });

            it("it should return an error if spe _id isn't a valid ObjectID", done => {
                requester
                    .delete('/api/specialization/referent')
                    .send({ _id: "aaaaa", referent: testing_epge._id })
                    .set("authorization", tokens['administrator'])
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.have.property("name", "CastError");

                        done();
                    });
            });

            it("it should return an error if referent _id isn't a valid ObjectID", done => {
                requester
                    .delete('/api/specialization/referent')
                    .send({ _id: testing_spe._id, referent: "aaaaa" })
                    .set("authorization", tokens['administrator'])
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.have.property("name", "CastError");

                        done();
                    });
            });

            it("it should return an error if spe _id doesn't exist in db", done => {
                requester
                    .delete('/api/specialization/referent')
                    .send({ _id: "5c64a2f45b1ac81fd0bac02a", referent: testing_epge._id })
                    .set("authorization", tokens['administrator'])
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.have.property("name", "SpecializationNotFound");

                        done();
                    });
            });

            it("it should return an error if referent _id doesn't exist in db", done => {
                requester
                    .delete('/api/specialization/referent')
                    .send({ _id: testing_spe._id, referent: "5c64a2f45b1ac81fd0bac02a" })
                    .set("authorization", tokens['administrator'])
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.have.property("name", "UserNotFound");

                        done();
                    });
            });
        });

        it("it shouldn't remove a referent to a spe because the user isn't an admnisistrator (partner)", done => {
            requester
                .delete('/api/specialization/referent')
                .send({ _id: testing_spe._id, referent: testing_epge._id })
                .set("authorization", tokens['partner'])
                .end((err, res) => {
                    res.should.have.status(401);
                    Specialization.findOne({ _id: testing_spe }, (err, spe) => {
                        if (err) done(err);
                        else {
                            spe.referent.indexOf(testing_epge._id).should.not.be.eql(-1);
                            done();
                        }
                    });
                });
        });

        it("it shouldn't remove a referent to a spe because the user isn't an admnisistrator (EGPE)", done => {
            requester
                .delete('/api/specialization/referent')
                .send({ _id: testing_spe._id, referent: testing_epge._id })
                .set("authorization", tokens['EPGE'])
                .end((err, res) => {
                    res.should.have.status(401);
                    Specialization.findOne({ _id: testing_spe }, (err, spe) => {
                        if (err) done(err);
                        else {
                            spe.referent.indexOf(testing_epge._id).should.not.be.eql(-1);
                            done();
                        }
                    });
                });
        });

        it("it shouldn't remove a referent to a spe because the user isn't an admnisistrator (administration)", done => {
            requester
                .delete('/api/specialization/referent')
                .send({ _id: testing_spe._id, referent: testing_epge._id })
                .set("authorization", tokens['administration'])
                .end((err, res) => {
                    res.should.have.status(401);
                    Specialization.findOne({ _id: testing_spe }, (err, spe) => {
                        if (err) done(err);
                        else {
                            spe.referent.indexOf(testing_epge._id).should.not.be.eql(-1);
                            done();
                        }
                    });
                });
        });
    });
});

let Helper = {};

Helper.emptyUserDb = () => {
    return new Promise((resolve, reject) => {
        Helper
            .emptyPartnerDb()
            .then(() => {
                Helper
                    .emptyPersonDb()
                    .then(() => resolve())
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
};

Helper.emptyPersonDb = () => {
    return new Promise((resolve, reject) => {
        Person.deleteMany({}, (err) => {
            if (err) reject(err);
            else resolve();
        })
    });
};

Helper.emptyPartnerDb = () => {
    return new Promise((resolve, reject) => {
        Partner.deleteMany({}, (err) => {
            if (err) reject(err);
            else resolve();
        })
    });
};

Helper.createAdministration = () => {
    return new Promise((resolve, reject) => {
        let administrationMember = new Administration();
        administrationMember.last_name = "lastName";
        administrationMember.first_name = "firstname";
        administrationMember.email = "administration@member.com";
        // password won't be used. It is set because it's required
        administrationMember.password = "a".repeat(60);

        administrationMember.save((err, created) => {
            if (err) reject(err);
            else resolve(created);
        });
    });
}

Helper.createEPGE = () => {
    return new Promise((resolve, reject) => {
        let epgeMember = new Administration();
        epgeMember.last_name = "lastName";
        epgeMember.first_name = "firstname";
        epgeMember.email = "epge@member.com";
        epgeMember.EPGE = true;
        // password won't be used. It is set because it's required
        epgeMember.password = "a".repeat(60);

        epgeMember.save((err, created) => {
            if (err) reject(err);
            else resolve(created);
        });
    });
};

Helper.createAdministrator = () => {
    return new Promise((resolve, reject) => {
        let administrator = new Administration();
        administrator.last_name = "lastName";
        administrator.first_name = "firstname";
        administrator.email = "administrator@member.com";
        administrator.admin = true;
        // password won't be used. It is set because it's required
        administrator.password = "a".repeat(60);

        administrator.save((err, created) => {
            if (err) reject(err);
            else resolve(created);
        });
    });
};

Helper.createPartner = () => {
    return new Promise((resolve, reject) => {
        let partner = new Partner();
        partner.last_name = "lastName";
        partner.first_name = "firstname";
        partner.company = "test";
        partner.email = "partner@member.com";

        partner.save((err, created) => {
            if (err) reject(err);
            else resolve(created);
        });
    });
};

Helper.generateToken = (user) => {
    return new Promise((resolve, reject) => {
        if (user._id) {
            let token = jwt.sign(
                { id: user._id },
                config.jwt.secret,
                {
                    // 1 day
                    expiresIn: 1000 * 60 * 60 * 24
                }
            );
            resolve(token);
        } else {
            reject(Error("User must have an object field to create a token"));
        }
    });
};

Helper.createSpecialization = referent => {
    return new Promise((resolve, reject) => {
        let spe = new Specialization();
        spe.abbreviation = "T";
        spe.name.fr = "Test fr";
        spe.name.en = "Test en";
        spe.description.fr = "Test";
        spe.description.en = "Test";

        if (referent) {
            if (referent instanceof Object) {
                spe.referent[0] = referent._id;
            } else if (referent instanceof Array) {
                spe.referent = referent;
            } else {
                reject(new Error("Invalid referent type"));
                return;
            }
        }
        spe.save((err, speCreated) => {
            if (err) reject(err);
            else resolve(speCreated);
        });
    });
}