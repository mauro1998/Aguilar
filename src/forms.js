(function() {
    jQuery.validator.addMethod('letters&spaces', function(value, element) {
        return this.optional(element) || /^[a-zA-Z áãâäàéêëèíîïìóõôöòúûüùçñ]+$/i.test(value);
    }, 'No se permiten números ni caracteres especiales');

    jQuery.validator.addMethod('lettersonly', function(value, element) {
        return this.optional(element) || /^[a-zA-Záãâäàéêëèíîïìóõôöòúûüùçñ]+$/i.test(value);
    }, 'No se permiten números, caracteres especiales ni espacios');

    jQuery.validator.addMethod('letters&numbers', function(value, element) {
        return this.optional(element) || /^[a-zA-Z0-9áãâäàéêëèíîïìóõôöòúûüùçñ]+$/i.test(value);
    }, 'Solo se permiten letras y números');

    var signInForm = (function() {
        var validator = undefined;
        var form = $('#signin-form');
        var init = function() {
            if (!form.length) return;
            validator = form.validate({
                errorClass: 'field__feedback',

                rules: {
                    username: 'required',
                    password: 'required'
                },

                messages: {
                    username: 'Por favor ingrese su nombre de usuario',
                    password: 'Por favor ingrese su contraseña'
                },

                showErrors: function(errorMap, errorList) {
                    this.defaultShowErrors();
                    $.each(errorList, function (i, error) {
                        $(error.element).siblings('label.field__feedback')
                            .css("display", "block");
                    });
                },

                submitHandler: function(form, e) {
                    e.preventDefault();
                    var data = {};
                    $(form).find('.field__input').each(function(i, input) {
                        var name = $(input).attr('name');
                        var value = $(input).val();
                        data[name] = app.util.Tea.encrypt(value, name);
                    });

                    app.util.auth.signIn(data, function(err, res) {
                        if (err) {
                            app.ui.createAlert(app.util.defaultErrorMessage, 'error')
                                .prependTo('div.page');
                            return console.error(err);
                        }

                        if (res.loggedIn) {
                            window.location.replace(window.location.origin);
                        } else {
                            app.ui.createAlert(res.error, 'error')
                                .prependTo('div.page');
                            $('#signInPassword').val('').focus();
                        }
                    });
                }
            });
        };

        return { startListening: init };
    })();

    var signUpForm = (function() {
        var validator = undefined;
        var form = $('#signup-form');
        var firstPartIsValid = false;
        var processing = false;

        var showUserInfo = function() {
            $('#signup-form').find('.personal-information-fields').addClass('is-hidden');
            $('#signup-form').find('.session-information-fields').removeClass('is-hidden');
            $('#signUpUsername').focus();
            this.html('Continuar').removeClass('loading');
            processing = false;
        };

        var showPersonalInfo = function() {
            firstPartIsValid = false;
            $('#signup-form').find('.personal-information-fields').removeClass('is-hidden');
            $('#signup-form').find('.session-information-fields').addClass('is-hidden');
        };

        var displayNext = function() {
            processing = true;
            var _this = $(this);
            var dots = '<span>.</span><span>.</span><span>.</span>';
            _this.html(dots).addClass('loading');
            var fields = [
                validator.element('#signUpFirstName'),
                validator.element('#signUpLastName'),
                validator.element('#signUpEmail')
            ];

            firstPartIsValid = fields.every(function(fieldIsValid) { return fieldIsValid; });

            if (firstPartIsValid) {
                var before = (new Date()).getTime();
                var emailInput = $('#signUpEmail');
                var email = emailInput.val();
                app.util.auth.requestEmailValidation(email, function(err, res) {
                    if (err) {
                        app.ui.createAlert(app.util.defaultErrorMessage, 'error')
                            .prependTo('div.page');
                        processing = false;
                        _this.html('Continuar').removeClass('loading');
                        return console.error(err);
                    }
                    var now = (new Date()).getTime();
                    var time = now - before;
                    var wait = time >= 1000 ? 0 : 1000 - time;

                    if (res.valid) {
                        setTimeout(showUserInfo.bind(_this), wait);
                    } else {
                        var msg = 'Alguien más ha registrado una cuenta con este correo electrónico';
                        var label = $('<label>').addClass('field__feedback').text(msg);
                        setTimeout(function() {
                            label.appendTo(emailInput.parent()).css('display', 'block');
                            _this.html('Continuar').removeClass('loading');
                            firstPartIsValid = false;
                            processing = false;
                            setTimeout(function() {
                                label.remove();
                                label = null;
                            }, 8000);
                        }, wait);
                    }
                });
            }
        }

        var validateUsername = function() {
            var _this = $(this);
            var username = _this.val().trim();
            if (validator.element('#signUpUsername')) {
                app.util.auth.requestUsernameValidation(username, function(err, res) {
                    if (err) {
                        app.ui.createAlert(app.util.defaultErrorMessage, 'error')
                            .prependTo('div.page');
                        return console.error(err);
                    }
                    if (!res.valid) {
                        var msg = 'Alguien más ha registrado una cuenta con este nombre de usuario';
                        var label = $('<label>').addClass('field__feedback').text(msg);
                        label.appendTo(_this.parent()).css('display', 'block');
                        setTimeout(function() {
                            label.remove();
                            label = null;
                        }, 8000);
                    }
                });
            }
        };

        var init = function() {
            if (!form.length) return;
            $('.back').on('click', 'a.ui-interaction.link', showPersonalInfo);
            $('#signUpUsername').blur(validateUsername);
            validator = form.validate({
                submitHandler: function(form, e) {
                    e.preventDefault();
                    if (processing) return;
                    if (!firstPartIsValid) return displayNext.call($('#nextFormPart'));
                    var data = {};

                    $(form).find('.field__input').each(function(i, input) {
                        var name = $(input).attr('name');
                        var value = $(input).val();
                        if (name !== 'password2') data[name] = app.util.Tea.encrypt(value, name);
                    });

                    app.util.auth.signUp(data, function(err, res) {
                        if (err) {
                            app.ui.createAlert(app.util.defaultErrorMessage, 'error')
                                .prependTo('div.page');
                            return console.error(err);
                        }
                        if (res.success) {
                            $(form).find('.field__input').each(function(i, input) {
                                $(input).val('');
                            });

                            app.ui.createAlert('Usuario registrado exitosamente', 'success')
                                .prependTo('div.page');
                            showPersonalInfo();
                        } else {
                            res.error.forEach(function(msg) {
                                app.ui.createAlert(msg, 'error')
                                    .prependTo('div.page');
                            });
                        }
                    });
                },

                errorClass: 'field__feedback',

                showErrors: function(errorMap, errorList) {
                    this.defaultShowErrors();
                    $.each(errorList, function (i, error) {
                        $(error.element).siblings('label.field__feedback')
                        .css("display", "block");
                    });
                },

                rules: {
                    firstName: {
                        required: true,
                        minlength: 3,
                        maxlength: 30,
                        'letters&spaces': true
                    },

                    lastName: {
                        required: true,
                        minlength: 3,
                        maxlength: 50,
                        'letters&spaces': true
                    },

                    email: {
                        required: true,
                        email: true
                    },

                    username: {
                        required: true,
                        minlength: 6,
                        'letters&numbers': true
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
                        required: 'Por favor ingrese su apellido',
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

        return { startListening: init };
    })();

    app.ui.forms = {
        signIn: signInForm,
        signUp: signUpForm
    };
})();
