const setting = require('../controllers/settingController');
const auth = require('../controllers/authController');

module.exports = app => {
    app.route('/api/open')
        .get((req, res, next) => res.json({ open: setting.getState() }))
        .post(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("Administrator"),
            (req, res, next) => {
                const { newState } = req.body;

                if (newState == "lock" || newState == "open")
                    setting.changeState(newState)
                        .then(res.json({ ok: 1 }))
                        .catch(next);
                else
                    next(new Error('MissingParameter'));
            });
}