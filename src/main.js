var app = {};
app.ui = {};
app.util = {};
app.init = function() {
    this.ui.startListening();
    this.ui.forms.signIn.startListening();
    this.ui.forms.signUp.startListening();
};

$(document).ready(this.app.init.bind(app));
