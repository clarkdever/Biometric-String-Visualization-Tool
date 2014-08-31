(function () {
  'use strict';

  /*Clark Dever (clarkdever@gmail.com) - 20140830*/

  // create the angular app
  angular.module('myApp', [
    'myApp.controllers',
    'myApp.directives',
    'myApp.services'
    ]);

  // setup dependency injection
  angular.module('d3', []);
  angular.module('myApp.services', []);
  angular.module('myApp.controllers', []);
  angular.module('myApp.directives', ['d3']);


}());