({
  baseUrl: 'editor',
  paths: {
    angular:        '../lib/js/angular',
    bootstrap:      '../lib/js/bootstrap',
    jquery:         '../lib/js/jquery',
    'ui-bootstrap': '../lib/js/ui-bootstrap',
    relations:      '../common/relations',
    DatabaseApp:    'js/DatabaseApp',
    pause:          '../common/pause'
  },
  shim: {
    angular: {exports: 'angular', deps: ['pause']},
    'ui-bootstrap': {deps: ['angular']},
    bootstrap: {deps: ['jquery']}
  },
  name: "js/main",
  out: "editor/js/main.built.js"
})
