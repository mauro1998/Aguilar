(function() {
    app.util.defaultErrorMessage = 'Ha sucedido un error inesperado al momento' +
        ' de realizar la operación. Por favor intentelo nuevamente más tarde.';
    app.util.auth = (function() {
        $.ajaxSetup({ cache: false });
        var api = '/auth';

        var post = function(endpoint, data) {
            return $.ajax({
                url: api + endpoint,
                type: 'POST',
                data: data,
                beforeSend: function(xhr) {
                    var token = $('meta[name=csrf-token]').attr('content');
                    if (token) xhr.setRequestHeader('X-CSRF-Token', token);
                }
            });
        };

        var signIn = function(data, done) {
            post('/signin', data).then(function(res) {
                done(null, res);
            }).catch(function(err) {
                if (err) done(err);
            });
        };

        var signUp = function(data, done) {
            post('/signup', data).then(function(res) {
                done(null, res);
            }).catch(function(err) {
                if (err) done(err);
            });
        };

        var validateEmail = function(email, done) {
            var data = { email: email };
            post('/email', data).then(function(res) {
                done(null, res);
            }).catch(function(err) {
                if (err) done(err);
            });
        };

        var validateUsername = function(username, done) {
            var data = { username: username };
            post('/username', data).then(function(res) {
                done(null, res);
            }).catch(function(err) {
                if (err) done(err);
            });
        };

        var logOut = function(data, done) {
            post('/logout', data).then(function(res) {
                done(null, res);
            }).catch(function(err) {
                if (err) done(err);
            });
        };

        return {
            signIn: signIn,
            signUp: signUp,
            requestEmailValidation: validateEmail,
            requestUsernameValidation: validateUsername
        };
    })();
})();
