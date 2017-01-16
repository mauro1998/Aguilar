define(['backbone', 'underscore', 'jquery'], function(Backbone, _, $) {
  var Router = Backbone.Router.extend({
    initialize: function() {
      this.container = $('#main');
      _.bindAll(this, 'render');
    },

    routes: {
      ''          : 'root',
      'signin'    : 'signin',
      'projects'  : 'projects',
      'galery'    : 'galery'
    },

    render: function(view) {
      if (this.currentView !== undefined) {
        this.currentView.close();
      }

      this.currentView = view;
      var content = this.currentView.render().$el;
      this.container.html(content);
    }
  });

  return Router;
});
