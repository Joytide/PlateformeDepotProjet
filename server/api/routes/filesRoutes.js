const express = require('express');
const fs = require('fs');
const multer = require('multer');
const router = express.Router();
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '.uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })

module.exports = (app) => {
    app.route('/api/addFile')
        .post(upload.any(), function (req, res, next) {
            if (!req.files) {
                return next(new Error('No files uploaded'));
            }
            console.log(req.files);
            /* req.files.forEach((file) => {
                fs.unlinkSync(path.join(__dirname, file.path));
             });*/
            res.send(req.files)
        });
};