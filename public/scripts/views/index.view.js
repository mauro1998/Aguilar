define([
  'backbone',
  'underscore',
  'text!templates/index.template.html'
], function(Backbone, _, indexTemplate) {
  var IndexView = Backbone.View.extend({
    tagName   : 'div',
    className : 'index_container',

    initialize: function() {
      _.bindAll.apply(_, _.functions(this));
    },

    render: function() {
      var template = app.getHTMLFromTemplate(indexTemplate);
      this.$el.html(template);
      return this;
    }
  });

  return IndexView;
});
