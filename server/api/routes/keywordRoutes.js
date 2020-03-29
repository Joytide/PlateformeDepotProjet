const keyword = require('../controllers/keywordController');
const auth = require('../controllers/authController');


module.exports = app => {
    app.route('/api/keyword')
        .get(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized(["Administration", "EPGE"]),
            (req, res, next) => {
                keyword
                    .getAll()
                    .then(result => res.json(result))
                    .catch(next);
            }
        )
        .post(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized(["Administration", "EPGE"]),
            (req, res, next) => {
                keyword
                    .create(req.body)
                    .then(result => res.json(result))
                    .catch(next);
            }
        )
        .put(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized(["Administration", "EPGE"]),
            (req, res, next) => {
                keyword
                    .update(req.body)
                    .then(result => res.json(result))
                    .catch(next);
            }
        )
        .delete(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized(["Administration", "EPGE"]),
            (req, res, next) => {
                keyword
                    .delete(req.body)
                    .then(result => res.json(result))
                    .catch(next);
            }
        );
};
