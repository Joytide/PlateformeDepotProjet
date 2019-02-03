process.env.NODE_ENV = "test";

let mongoose = require('mongoose');
let Year = require('../api/models/Year');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();


chai.use(chaiHttp);
let requester = chai.request(server).keepOpen();

describe('Testing things related to years', () => {
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