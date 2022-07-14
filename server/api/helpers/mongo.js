const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME || "mongo";
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || "esilv-projects-server-2022";
const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
// Construct MONGO connection URI depending on wether or not an username is passed to environment variables
const MONGO_URI = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB_NAME}`

const mongoose = require('mongoose')

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: MONGO_USERNAME || undefined,
    pass: MONGO_PASSWORD || undefined,
    auth: { authSource: "admin" }
})
    .catch(err => {
        console.error(err.message);
        process.exit(-1);
    });

module.exports = mongoose;