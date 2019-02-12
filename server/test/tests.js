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
        it('it should create a new year', done => {
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
    });

    describe("/DELETE /api/year", () => {
        it('it should delete a year and get the deleted year(s) in return', done => {
            let year = new Year();
            year.abbreviation = "A1";
            year.name.en = "1st Year";
            year.name.fr = "Année 1";

            year.save((err, yearCreated) => {
                requester
                    .delete('/api/year')
                    .send({ _id: yearCreated._id })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('_id', yearCreated._id.toString());
                        done();
                    });
            });

        });

        it("it shouldn't delete a year cause _id field isn't an ObjectId", done => {
            requester
                .delete('/api/year')
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
                .send({ _id: "5c56e3bf2e73c7233048a6aa" })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.be.eql({})
                    done();
                });
        });

        it("it shouldn't delete a year cause _id field isn't an ObjectId", done => {
            requester
                .delete('/api/year')
                .send()
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name', "MissingId");
                    done();
                });
        });
    });

    describe("/POST /api/year", () => {
        it("it should update abbreviation without breaking other fields", done => {
            let year = new Year();
            year.abbreviation = "A1";
            year.name.en = "1st Year";
            year.name.fr = "Année 1";

            year.save((err, yearCreated) => {
                let update = {
                    _id: yearCreated._id,
                    abbreviation: "A2"
                }

                requester
                    .post('/api/year')
                    .send(update)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('_id', yearCreated._id.toString());
                        res.body.should.have.property('abbreviation', update.abbreviation);
                        res.body.name.should.have.property('en', yearCreated.name.en);
                        res.body.name.should.have.property('fr', yearCreated.name.fr);
                        done();
                    });
            });
        });

        it("it should update name fr without breaking other fields", done => {
            let year = new Year();
            year.abbreviation = "A1";
            year.name.en = "1st Year";
            year.name.fr = "Année 1";

            year.save((err, yearCreated) => {
                let update = {
                    _id: yearCreated._id,
                    nameFr: "Année 2"
                }

                requester
                    .post('/api/year')
                    .send(update)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('_id', yearCreated._id.toString());
                        res.body.should.have.property('abbreviation', yearCreated.abbreviation);
                        res.body.should.have.property('name');
                        res.body.name.should.have.property('en', yearCreated.name.en);
                        res.body.name.should.have.property('fr', update.nameFr);
                        done();
                    });
            });
        });

        it("it should update name en without breaking other fields", done => {
            let year = new Year();
            year.abbreviation = "A1";
            year.name.en = "1st Year";
            year.name.fr = "Année 1";

            year.save((err, yearCreated) => {
                let update = {
                    _id: yearCreated._id,
                    nameEn: "2nd Year"
                }

                requester
                    .post('/api/year')
                    .send(update)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('_id', yearCreated._id.toString());
                        res.body.should.have.property('abbreviation', yearCreated.abbreviation);
                        res.body.should.have.property('name');
                        res.body.name.should.have.property('en', update.nameEn);
                        res.body.name.should.have.property('fr', yearCreated.name.fr);
                        done();
                    });
            });
        });

        it("it should return an error because _id isn't an ObjectId", done => {
            let year = new Year();
            year.abbreviation = "A1";
            year.name.en = "1st Year";
            year.name.fr = "Année 1";

            year.save((err, yearCreated) => {
                let update = {
                    _id: "aaa",
                    nameEn: "2nd Year"
                }

                requester
                    .post('/api/year')
                    .send(update)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('name', "CastError");
                        done();
                    });
            });
        });

        it("it should return an error because _id is missing", done => {
            let year = new Year();
            year.abbreviation = "A1";
            year.name.en = "1st Year";
            year.name.fr = "Année 1";

            year.save((err, yearCreated) => {
                let update = {
                    nameEn: "2nd Year"
                }

                requester
                    .post('/api/year')
                    .send(update)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('name', "MissingId");
                        done();
                    });
            });
        });

        it("it should return an error because there are no field to update", done => {
            let year = new Year();
            year.abbreviation = "A1";
            year.name.en = "1st Year";
            year.name.fr = "Année 1";

            year.save((err, yearCreated) => {
                let update = {
                    _id: yearCreated._id
                }

                requester
                    .post('/api/year')
                    .send(update)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('name', "MissingParameter");
                        done();
                    });
            });
        });
    });
});


describe("Things related to specializations", () => {
    beforeEach(done => {
        Specialization.deleteMany({}, err => {
            done();
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

        it("it should return an array with 1 element", () => {
            let epge = new Administration();
            epge.first_name = "John";
            epge.last_name = "Doe";
            epge.email = "john.doe@epge.com";
            epge.epge = true;

            epge.save((err, epgeCreated) => {
                let specialization = new Specialization();
                specialization.abbreviation = "M";
                specialization.name.fr = "Majeure";
                specialization.name.en = "Specialization";

                specialization.save((err, specializationCreated) => {
                    requester
                        .get('/api/specialization')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('array');
                            res.body.length.should.be.eql(1);
                            res.body[0].should.have.property("_id", specializationCreated._id.toString());
                            res.body[0].should.have.property("abbreviation", specializationCreated.abbreviation);
                            res.body[0].name.should.have.property("fr", specializationCreated.name.fr);
                            res.body[0].name.should.have.property("en", specializationCreated.name.en);

                            res.body[0].should.have.property("referent");
                            res.body[0].referent.should.have.property("_id", epgeCreated._id.toString());
                            res.body[0].referent.should.have.property("first_name", epgeCreated.first_name);
                            res.body[0].referent.should.have.property("last_name", epgeCreated.last_name);
                            res.body[0].referent.should.have.property("email", epgeCreated.email);
                            res.body[0].referent.should.have.property("epge", true);

                            done();
                        });
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
}

Helper.emptyPersonDb = () => {
    return new Promise((resolve, reject) => {
        Person.deleteMany({}, (err) => {
            if (err) reject(err);
            else resolve();
        })
    });
}

Helper.emptyPartnerDb = () => {
    return new Promise((resolve, reject) => {
        Partner.deleteMany({}, (err) => {
            if (err) reject(err);
            else resolve();
        })
    });
}

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
        epgeMember.epeg = true;
        // password won't be used. It is set because it's required
        epgeMember.password = "a".repeat(60);

        epgeMember.save((err, created) => {
            if (err) reject(err);
            else resolve(created);
        });
    });
}

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
}

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
}

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
}