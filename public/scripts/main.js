define([
  'scripts/app',
  'scripts/router'
], function(app, Router) {
  app.router = new Router();
  app.router.on('route:root', function() {
    console.log('root!', this);
  });
  Backbone.history.start({ pushState: true });
});
