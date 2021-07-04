const keyword = require('../controllers/keywordController');
const auth = require('../controllers/authController');
const { handleRequest } = require('../../helpers/Request');


module.exports = app => {
    app.route('/api/keyword/:id([a-zA-Z0-9]{24})')
    .get(
        handleRequest(keyword.findById)
        );

    app.route('/api/keyword')
        .get(
            handleRequest(keyword.list)
        )
        .post(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized(["Administration", "EPGE"]),
            handleRequest(keyword.create)
        )
        .put(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("EPGE"),
            handleRequest(keyword.update)
        )
        .delete(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("EPGE"),
            handleRequest(keyword.delete)
        );

    


};
