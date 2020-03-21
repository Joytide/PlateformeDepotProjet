const keyword = require('../controllers/keywordController');
const auth = require('../controllers/authController');


module.exports = app => {
    app.route('/api/keyword')
        .get(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("Administration"),
            (req, res, next) => {
                keyword
                    .getAll()
                    .then(result => res.json(result))
                    .catch(next);
            }
        )
        .post(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("Administration"),
            (req, res, next) => {
                if (req.body.name)
                    keyword
                        .create(req.body.name)
                        .then(result => res.json(result))
                        .catch(next);
                else
                    next(new Error('InvalidParameters'))
            }
        )
        .put(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("Administration"),
            (req, res, next) => {
                if (req.body.id && req.body.newName)
                    keyword
                        .update(req.body.id, req.body, newName)
                        .then(result => res.json(result))
                        .catch(next);
                else
                    next(new Error('InvalidParameters'));
            }
        );
};
