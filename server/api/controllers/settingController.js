const redis = require("redis");
const client = redis.createClient();
const { isValidType, areValidTypes } = require('../../helpers/Errors');

client.on("error", function (err) {
    console.error(err);
});

/**
 * Change the state of the platform (open /close)
 * @param {boolean} open State of the platform
 */
exports.changeState = ({ open }) =>
    new Promise((resolve, reject) => {
        isValidType(open, "open", "boolean")
            .then(() => {
                client.set("open", open);
                resolve();
            })
            .catch(reject);
    });

exports.changeText = ({ description }) =>
    new Promise((resolve, reject) => {
        console.log("desc : ",description);
        isValidType(description, "description", "string")
            .then(() => {
                console.log(description);
                client.set("description", description, (err, reply) => {
                    if (err) return reject(err);
                    resolve();
                });
            })
            .catch(reject);
    });

exports.getState = () =>
    new Promise((resolve, reject) => {
        client.mget("open", "description", (err, values) => {
            if (err)
                return reject(err);

            if (values[0] === null) {
                client.set("open", true);
                resolve({ open: true })
            }
            else
                resolve({
                    open: JSON.parse(values[0]),
                    description: values[1]
                });
        });
    });

exports.getHomeText = () =>
    new Promise((resolve, reject) => {
        client.mget("homeTextFr", "homeTextEn", (err, values) => {
            if (err)
                return reject(err);

            resolve({ homeTextFr: values[0] || "", homeTextEn: values[1] || "" })
        })
    });


exports.changeHomeText = ({ homeTextFr, homeTextEn }) =>
    new Promise((resolve, reject) => {
        areValidTypes(
            [homeTextFr, homeTextEn],
            ["homeTextFr", "homeTextEn"],
            ["string", "string"]
        )
            .then(() => {
                client.mset("homeTextFr", homeTextFr, "homeTextEn", homeTextEn, (err, reply) => {
                    if (err)
                        return reject(err);
                    resolve();
                })
            })
            .catch(reject);
    });