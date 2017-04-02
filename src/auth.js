(function() {
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

        var signIn = function(data) {
            var response = post('/signin', data).then(function(res) {
                console.log(res);
            }).catch(function(err) {
                if (err) throw err;
            });
        };

        var signUp = function(data, done) {
            var response = post('/signup', data).then(function(res) {
                done(null, res);
            }).catch(function(err) {
                if (err) done(err);
            });
        };

        return {
            signIn: signIn,
            signUp: signUp
        };
    })();
})();
