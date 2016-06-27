var config = require('../../server/config.json');
var path = require('path');

module.exports = function (user) {
    //send verification email after registration
    user.afterRemote('create', function (context, user, next) {
        console.log('> user.afterRemote triggered');

        var options = {
            type: 'email',
            to: user.email,
            from: 'noreply@loopback.com',
            subject: 'Thanks for registering.',
            // text: "Please verify your email address: {href}",
            template: path.resolve(__dirname, '../../server/views/verify.ejs'),
            redirect: '/verified',
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

    user.afterRemote('login', function (ctx, userInstance, next) {
        let userId = userInstance.userId.toString();
        let userDb = user.findById(userId, function (err, userObject) {
            if (!err) {
                ctx.result = userObject;
                next();
            }
        });        
    });
};