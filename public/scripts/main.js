var auth = (function() {
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

    var signUp = function(data) {
        var response = post('/signup', data).then(function(res) {
            console.log(res);
        }).catch(function(err) {
            if (err) throw err;
        });
    };

    return {
        signIn: signIn,
        signUp: signUp
    };
})();

var ui = (function() {
    var onShowFieldFeedback = function() {
        var parent = $(this).parent().parent();
        var hintField = parent.find('.field__hint');
        if (hintField.hasClass('is-hidden')) hintField.removeClass('is-hidden');
        else hintField.addClass('is-hidden');
    };

    var onShowPassInPlaneText = function() {
        var _this = $(this);
        var parent = _this.parents('article.field');
        var passwordInput = parent.find('input.field__input');
        if (_this.prop('checked')) passwordInput.attr('type', 'text');
        else passwordInput.attr('type', 'password');
    };

    // Signup form events:
    var personalInformationFulfilled = false;

    var onNextFormInformation = function() {
        var _this = $(this);
        var dots = '<span>.</span><span>.</span><span>.</span>';
        _this.html(dots).addClass('loading');
        setTimeout(function() {
            $('#signup-form form').find('.personal-information-fields').addClass('is-hidden');
            $('#signup-form form').find('.session-information-fields').removeClass('is-hidden');
            _this.html('Continuar').removeClass('loading');
            personalInformationFulfilled = true;
        }, 1000);
    };

    var onSignUpSubmit = function(e) {
        if (!personalInformationFulfilled) {
            e.preventDefault();
            return $('#nextFormPart').click();
        }

        e.preventDefault();
        personalInformationFulfilled = false;
        var _this = $(this);
        var inputs = _this.find('input.field__input');
        var data = {};

        inputs.each(function(i, input) {
            var _input = $(input);
            data[_input.attr('name')] = _input.val().trim() || undefined;
        });

        console.log(data);
        auth.signUp(data);
    };

    return {
        startDomInteraction: function() {
            $('form').on('click', 'a.ui-interaction', onShowFieldFeedback);
            $('#showPassword').on('change', onShowPassInPlaneText);
            $('#signup-form form').on('click', '#nextFormPart', onNextFormInformation);
            $('#signup-form form').on('submit', onSignUpSubmit);
        }
    }
})();

$(document).ready(ui.startDomInteraction);
