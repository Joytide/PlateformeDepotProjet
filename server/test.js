const mongoose = require('mongoose');
const colors = require('colors');
const { Person } = require('./api/models/Person');

let person = new Person();

mongoose.connect('mongodb://localhost:27017/Tododb', (err) => {
    if (err) {
        console.error(colors.red(err.message));
        process.exit(-1);
    } else {
        console.log("Successfuly connected to database".green);

        person.last_name = "test";
        person.first_name = "test";
        person.email = "test@test.com";
        person.username = "test";
        person.password = "test";

        person.save(err => console.error(err));
    }
});