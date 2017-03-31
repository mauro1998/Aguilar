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

var signUpFormValidator = (function() {
    var firstSignUpPartIsValid = false;

    var displayNextFormInfo = function() {
        var _this = $(this);
        var dots = '<span>.</span><span>.</span><span>.</span>';
        _this.html(dots).addClass('loading');
        setTimeout(function() {
            $('#signup-form').find('.personal-information-fields').addClass('is-hidden');
            $('#signup-form').find('.session-information-fields').removeClass('is-hidden');
            _this.html('Continuar').removeClass('loading');
        }, 1000);
    };

    var init = function() {
        var validator = $('#signup-form').validate({
            submitHandler: function(form) {
                if (!firstSignUpPartIsValid) {
                    var fields = [
                        validator.element('#signUpFirstName'),
                        validator.element('#signUpLastName'),
                        validator.element('#signUpEmail')
                    ];

                    firstSignUpPartIsValid = fields.every(function(fieldIsValid) {
                        return fieldIsValid;
                    });

                    if (firstSignUpPartIsValid) return displayNextFormInfo.call($('#nextFormPart'));
                }

                firstSignUpPartIsValid = false;
                var data = {};
                $(form).find('.field__input').each(function(i, input) {
                    var name = $(input).attr('name');
                    var value = $(input).val();
                    if (name !== 'password2') data[name] = value;
                });

                console.log(data);
            },
            rules: {
                firstName: {
                    required: true,
                    minlength: 3,
                    maxlength: 30
                },

                lastName: {
                    minlength: 3,
                    maxlength: 50
                },

                email: {
                    required: true,
                    email: true
                },

                username: {
                    required: true,
                    minlength: 6
                },

                password: {
                    required: true,
                    minlength: 6,
                    maxlength: 40
                },

                password2: {
                    required: true,
                    equalTo: '#signUpPassword'
                }
            },

            messages: {
                firstName: {
                    required: 'Por favor ingrese su nombre',
                    minlength: 'Este campo debe contener al menos 3 caracteres'
                },

                lastName: {
                    minlength: 'Este campo debe contener al menos 3 caracteres',
                },

                email: {
                    required: 'Ingrese su dirección de correo electrónico',
                    email: 'La dirección de correo electrónico es inválida'
                },

                username: {
                    required: 'Ingrese su nombre de usuario',
                    minlength: 'Este campo debe contener al menos 6 caracteres'
                },

                password: {
                    required: 'Ingrese su contraseña',
                    minlength: 'La contraseña debe contener 6 caracteres como mínimo',
                    maxlength: 40
                },

                password2: {
                    required: 'Por favor ingrese su contraseña nuevamente',
                    equalTo: 'Su contraseña no coincide con la anterior'
                }
            }
        });
    };

    return {
        startValidating: init
    }
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

    return {
        startDomInteraction: function() {
            $('form').on('click', 'a.ui-interaction', onShowFieldFeedback);
            $('#showPassword').on('change', onShowPassInPlaneText);
            signUpFormValidator.startValidating();
        }
    }
})();

$(document).ready(ui.startDomInteraction);
