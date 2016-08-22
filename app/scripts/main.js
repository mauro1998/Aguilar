/**
 * @file main.js
 * @description Main script - Loads the script components of the application.
 * @author Mauro Aguilar Bustamante
 * @version 1.0.0
 */
requirejs.config({
  baseUrl: 'scripts',
  paths: {
    jquery: 'lib/jquery'
  }
});

require(['index']);
