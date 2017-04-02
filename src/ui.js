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
