require.config({
  baseUrl: '.',
  paths: {
    angular:        'lib/js/angular',
    bootstrap:      'lib/js/bootstrap',
    jquery:         'lib/js/jquery',
    'ui-bootstrap': 'lib/js/ui-bootstrap',
    relations:      'common/relations',
    load:           'figure/js/load',
    DatabaseApp:    'figure/js/DatabaseApp',
    table:          'figure/js/table',
    statements:     'figure/js/statements',
    pause:          'common/pause'
  },
  shim: {
    angular: {exports: 'angular', deps: ['pause']},
    'ui-bootstrap': {deps: ['angular']},
    bootstrap: {deps: ['jquery']}
  },
});

window.name = 'NG_DEFER_BOOTSTRAP!';

require(['angular', 'DatabaseApp', 'load', 'table', 'bootstrap'],
  function(angular, app, load) {

    var figure_page = 'figure/figure.html';
    var table_page = 'figure/table.html';

    var divs = [
        {name: 'all1', page: figure_page},
        {name: 'Grades', page: table_page},
        {name: 'all2', page: figure_page},
        {name: 'all3', page: figure_page},
        {name: 'all_exercise1', page: figure_page},
        {name: 'all_exercise2', page: figure_page},
        {name: 'all_exercise3', page: figure_page},
        {name: 'all_exercise4', page: figure_page},
        {name: 'all_exercise5', page: figure_page},
        {name: 'all_exercise6', page: figure_page},
        {name: 'all_exercise7', page: figure_page},
    ];

    angular.module('DatabaseApp').service('Page', function () {
      return {value: 'informationUser2b6.html'};
    });

    for (var i = 0, item; i < divs.length; i++) {
      item = divs[i];
      load(item.page, item.name);
    }

    angular.element(document).ready(function() {
      angular.resumeBootstrap(['DatabaseApp']);
    });
  }
);
