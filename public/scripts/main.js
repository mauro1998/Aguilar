var ui = (function() {
    var onNextFormInformation = function() {
        var _this = $(this);
        var dots = '<span>.</span><span>.</span><span>.</span>';
        _this.html(dots).addClass('loading');
        setTimeout(function() {
            $('#signup-form form').find('.personal-information-fields').addClass('is-hidden');
            $('#signup-form form').find('.session-information-fields').removeClass('is-hidden');
            _this.html('Continuar').removeClass('loading');
        }, 1000);
    };

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
            $('#signup-form form').on('click', '#next', onNextFormInformation);
        }
    }
})();

$(document).ready(ui.startDomInteraction);
