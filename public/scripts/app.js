define(['underscore', 'backbone'], function(_, Backbone) {
  var app = {
    events  : _.extend({}, Backbone.Events),
    api     : '/api',
    root    : '/'
  };

  app.getHTMLFromTemplate = function(template, data) {
    var getTemplate = _.template(template);
    return getTemplate(data);
  };

  Backbone.View.prototype.close = function () {
    this.remove();
    this.unbind();
    if (this.onClose && typeof this.onClose === 'function') {
      this.onClose();
    }
  };

  return app;
});
