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
