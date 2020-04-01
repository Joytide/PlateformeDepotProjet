const keyword = require('../controllers/keywordController');
const auth = require('../controllers/authController');
const { handleRequest } = require('../../helpers/Request');


module.exports = app => {
    app.route('/api/keyword')
        .get(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized(["Administration", "EPGE"]),
            handleRequest(keyword.getAll)
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
