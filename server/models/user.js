var config = require('../../server/config.json');
var path = require('path');
var LoopBackContext = require('loopback-context');

module.exports = function (user) {
    //send verification email after registration
    user.afterRemote('create', function (context, user, next) {
        console.log('> user.afterRemote triggered');

        var options = {
            type: 'email',
            to: user.email,
            protocol: 'https',
            port: '443',
            from: 'noreply@loopback.com',
            subject: 'Thanks for registering.',
            text: "{href}",
            host: "cerebral-api.herokuapp.com",
            template: path.resolve(__dirname, '../../server/views/verify.ejs'),
            redirect: 'https://cerebral-app.herokuapp.com/emailVerified',
            user: user
        };

        user.verify(options, function (err, response) {
            if (err) return next(err);

            console.log('> verification email sent:', response);
            context.res.send(response);
        });
    });

    //send password reset link when requested
    user.on('resetPasswordRequest', function (info) {
        var url = 'http://' + config.host + ':' + config.port + '/reset-password';
        var html = 'Click <a href="' + url + '?access_token=' +
            info.accessToken.id + '">here</a> to reset your password';

        user.app.models.Email.send({
            to: info.email,
            from: info.email,
            subject: 'Password reset',
            html: html
        }, function (err) {
            if (err) return console.log('> error sending password reset email');
            console.log('> sending password reset email to:', info.email);
        });
    });

    user.remoteMethod(
        'loadAuth',
        {
            returns: { arg: 'currentUser', type: 'Object' },
            http: { path: '/loadAuth', verb: 'get' }
        });

    user.remoteMethod(
        'validateUsername',
        {
            accepts: { arg: 'username', type: 'string' },
            returns: { arg: 'isValid', type: 'boolean' },
            http: { path: '/validateusername', verb: 'post' }
        });

    //remote method
    user.loadAuth = function (next) {
        var ctx = LoopBackContext.getCurrentContext();
        var currentUser = ctx && ctx.get('currentUser');
        next(null, currentUser);
    };

    user.validateUsername = function (username, next) {
        var userDb = user.find({
            where: { username: username }
        }, function (err, user) {
            if (err) return;
            if (user) {
                var filteredUser = user.filter(function (obj) {
                    return obj.username === username;
                });
                if (filteredUser.length > 0) {
                    next(null, false);
                } else {
                    next(null, true);
                }
            }
        });
    }

    user.afterRemote('login', function (ctx, userInstance, next) {
        var userId = userInstance.userId.toString();
        var userDb = user.findById(userId, function (err, userObject) {
            if (!err) {
                ctx.result.userDetail = userObject;
                next();
            }
        });
    });
};