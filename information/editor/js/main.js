require.config({
  baseUrl: '.',
  paths: {
    angular:        '../lib/js/angular',
    bootstrap:      '../lib/js/bootstrap',
    jquery:         '../lib/js/jquery',
    'ui-bootstrap': '../lib/js/ui-bootstrap',
    relations:      '../common/relations',
    DatabaseApp:    'js/DatabaseApp',
    pause:          'js/pause'
  },
  shim: {
    angular: {exports: 'angular', deps: ['pause']},
    'ui-bootstrap': {deps: ['angular']},
    bootstrap: {deps: ['jquery']}
  }
});

require(['angular', 'DatabaseApp', 'bootstrap'], function(angular, app) {
  angular.element(document).ready(function() {
    angular.resumeBootstrap(['DatabaseApp']);
  });
});
