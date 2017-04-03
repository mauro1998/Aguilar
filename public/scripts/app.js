var app = {};
app.ui = {};
app.util = {};
app.init = function() {
    this.ui.startListening();
    this.ui.forms.signIn.startListening();
    this.ui.forms.signUp.startListening();
};

$(document).ready(this.app.init.bind(app));

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

(function() {
    app.util.Tea = (function() {
        var Tea = {};

        Tea.encrypt = function(plaintext, password) {
            if (plaintext.length == 0) return ('');
            var v = Tea.strToLongs(Utf8.encode(plaintext));
            if (v.length <= 1) v[1] = 0;
            var k = Tea.strToLongs(Utf8.encode(password).slice(0, 16));
            var n = v.length;
            var z = v[n - 1],
            y = v[0],
            delta = 0x9E3779B9;
            var mx, e, q = Math.floor(6 + 52 / n),
            sum = 0;

            while (q-- > 0) {
                sum += delta;
                e = sum >>> 2 & 3;
                for (var p = 0; p < n; p++) {
                    y = v[(p + 1) % n];
                    mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
                    z = v[p] += mx;
                }
            }

            var ciphertext = Tea.longsToStr(v);

            return Base64.encode(ciphertext);
        }

        Tea.decrypt = function(ciphertext, password) {
            if (ciphertext.length == 0) return ('');
            var v = Tea.strToLongs(Base64.decode(ciphertext));
            var k = Tea.strToLongs(Utf8.encode(password).slice(0, 16));
            var n = v.length;
            var z = v[n - 1], y = v[0], delta = 0x9E3779B9;
            var mx, e, q = Math.floor(6 + 52 / n), sum = q * delta;

            while (sum != 0) {
                e = sum >>> 2 & 3;
                for (var p = n - 1; p >= 0; p--) {
                    z = v[p > 0 ? p - 1 : n - 1];
                    mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
                    y = v[p] -= mx;
                }
                sum -= delta;
            }

            var plaintext = Tea.longsToStr(v);
            plaintext = plaintext.replace(/\0+$/, '');

            return Utf8.decode(plaintext);
        }

        Tea.strToLongs = function(s) {
            var l = new Array(Math.ceil(s.length / 4));

            for (var i = 0; i < l.length; i++) {
                l[i] = s.charCodeAt(i * 4) + (s.charCodeAt(i * 4 + 1) << 8) + (s.charCodeAt(i * 4 + 2) << 16) + (s.charCodeAt(i * 4 + 3) << 24);
            }

            return l;
        }

        Tea.longsToStr = function(l) {
            var a = new Array(l.length);

            for (var i = 0; i < l.length; i++) {
                a[i] = String.fromCharCode(l[i] & 0xFF, l[i] >>> 8 & 0xFF, l[i] >>> 16 & 0xFF, l[i] >>> 24 & 0xFF);
            }

            return a.join('');
        }

        var Base64 = {};
        Base64.code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

        Base64.encode = function(str, utf8encode) {
            utf8encode = (typeof utf8encode == 'undefined') ? false : utf8encode;
            var o1, o2, o3, bits, h1, h2, h3, h4, e = [],
            pad = '',
            c, plain, coded;
            var b64 = Base64.code;

            plain = utf8encode ? Utf8.encode(str) : str;

            c = plain.length % 3;
            if (c > 0) {
                while (c++ < 3) {
                    pad += '=';
                    plain += '\0';
                }
            }

            for (c = 0; c < plain.length; c += 3) {
                o1 = plain.charCodeAt(c);
                o2 = plain.charCodeAt(c + 1);
                o3 = plain.charCodeAt(c + 2);

                bits = o1 << 16 | o2 << 8 | o3;

                h1 = bits >> 18 & 0x3f;
                h2 = bits >> 12 & 0x3f;
                h3 = bits >> 6 & 0x3f;
                h4 = bits & 0x3f;

                e[c / 3] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
            }

            coded = e.join('');
            coded = coded.slice(0, coded.length - pad.length) + pad;

            return coded;
        }

        Base64.decode = function(str, utf8decode) {
            utf8decode = (typeof utf8decode == 'undefined') ? false : utf8decode;
            var o1, o2, o3, h1, h2, h3, h4, bits, d = [], plain, coded;
            var b64 = Base64.code;
            coded = utf8decode ? Utf8.decode(str) : str;

            for (var c = 0; c < coded.length; c += 4) {
                h1 = b64.indexOf(coded.charAt(c));
                h2 = b64.indexOf(coded.charAt(c + 1));
                h3 = b64.indexOf(coded.charAt(c + 2));
                h4 = b64.indexOf(coded.charAt(c + 3));

                bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

                o1 = bits >>> 16 & 0xff;
                o2 = bits >>> 8 & 0xff;
                o3 = bits & 0xff;

                d[c / 4] = String.fromCharCode(o1, o2, o3);
                if (h4 == 0x40) d[c / 4] = String.fromCharCode(o1, o2);
                if (h3 == 0x40) d[c / 4] = String.fromCharCode(o1);
            }

            plain = d.join('');
            return utf8decode ? Utf8.decode(plain) : plain;
        }

        var Utf8 = {};

        Utf8.encode = function(strUni) {
            var strUtf = strUni.replace(/[\u0080-\u07ff]/g, function(c) {
                var cc = c.charCodeAt(0);
                return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
            });

            strUtf = strUtf.replace(/[\u0800-\uffff]/g, function(c) {
                var cc = c.charCodeAt(0);
                return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
            });

            return strUtf;
        };

        Utf8.decode = function(strUtf) {
            var strUni = strUtf.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, function(c) {
                var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
                return String.fromCharCode(cc);
            });

            strUni = strUni.replace(/[\u00c0-\u00df][\u0080-\u00bf]/g, function(c) {
                var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
                return String.fromCharCode(cc);
            });

            return strUni;
        };

        return Tea;
    })();
})();

(function() {
    app.ui.startListening = (function() {
        var displayFieldHint = function() {
            var parent = $(this).parent().parent();
            var hintField = parent.find('.field__hint');
            if (hintField.hasClass('is-hidden')) hintField.removeClass('is-hidden');
            else hintField.addClass('is-hidden');
        };

        var showPassInPlaneText = function() {
            var _this = $(this);
            var parent = _this.parents('article.field');
            var passwordInput = parent.find('input.field__input');
            if (_this.prop('checked')) passwordInput.attr('type', 'text');
            else passwordInput.attr('type', 'password');
        };

        return function() {
            $('form').on('click', 'a.ui-interaction.hint', displayFieldHint);
            $('#showPassword').on('change', showPassInPlaneText);
        }
    })();

    app.ui.createAlert = (function() {
        return function(msg, type) {
            var alertType = 'alert--' + type;
            var closeAnchor = $('<a>').addClass('ui-interaction btn__close').html('&times;');
            var text = $('<p>').text(msg);
            return $('<div>').addClass('alert ' + alertType)
                .append(closeAnchor)
                .append(text)
                .on('click', 'a.btn__close', function() {
                    $(this).parent().remove();
                });
        };
    })();
})();

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
