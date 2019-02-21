'use-strict'

const path = require('path');
var app = require('express')();

app.use(express.static('uploads'));

module.exports = (app) => {
    app.route('/files')
        .get(res.download(path.join(__dirname, req.file)), function (req,res,next) {
            if (!req.file) {
                return next(new Error('No file to download'));
            }
            console.log(req.file);
            res.send(req.file)
        })
}
