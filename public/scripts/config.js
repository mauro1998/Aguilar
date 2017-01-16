/**
 * @file main.js
 * @description The main application configuration. Defines the paths on where
 * to look up for dependencies like external libraries, application scripts or
 * templates.
 * @author Mauro Aguilar Bustamante
 */
 require.config({
  baseUrl: '/',

  paths: {
    'models'      : 'scripts/models',
    'views'       : 'scripts/views',
    'templates'   : 'assets/templates',
    'jquery'      : 'vendor/jquery',
    'underscore'  : 'vendor/underscore',
    'backbone'    : 'vendor/backbone',
    'text'        : 'vendor/text'
  },

  shim: {
    'backbone'    : { deps: ['underscore', 'jquery'], exports: 'Backbone' }
  }
});

require(['scripts/main']);
