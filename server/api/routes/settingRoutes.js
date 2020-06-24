const setting = require('../controllers/settingController');
const auth = require('../controllers/authController');
const { handleRequest } = require('../../helpers/Request');

module.exports = app => {
    app.route('/api/open')
        .get(handleRequest(setting.getState))
        .post(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("Administrator"),
            handleRequest(setting.changeState))
        .put(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("Administrator"),
            handleRequest(setting.changeText));

    app.route('/api/settings/home')
        .get(handleRequest(setting.getHomeText))
        .post(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("Administrator"),
            handleRequest(setting.changeHomeText)
        );
}