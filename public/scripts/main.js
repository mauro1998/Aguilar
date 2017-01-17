define([
  'scripts/app',
  'scripts/router',
  'views/index.view'
], function(app, Router, IndexView) {
  app.router = new Router();
  app.router.on('route:root', function() {
    var index = new IndexView();
    this.render(index);
  });

  Backbone.history.start({ pushState: true });
});
