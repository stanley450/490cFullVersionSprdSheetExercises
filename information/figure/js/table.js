define(['angular', 'relations', 'statements'], function (angular, relations) {
  var app = angular.module('DatabaseApp')
  app.controller('TableController', function ($scope) {
    $scope.init = function (div_id) {
      $scope.relation = relations[div_id];
    };
  });
});
