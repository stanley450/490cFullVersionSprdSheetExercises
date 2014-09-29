/** {{{
 * DatabaseApp.js
 *
 * The logic behind the Watson Database Lab. Defines the DatabaseApp angularjs
 * module, and its primary controller DatabaseController, which provides the
 * interface for the webpage.
 *
 * @author Tommy Bozeman
 * @version (2014,04,04)
}}} */

define(['angular', 'relations', 'statements', 'ui-bootstrap'],
  function (angular, relations_import) {
    // var app = angular.module('DatabaseApp', ['ui.bootstrap'])
    var app = angular.module('DatabaseApp')

    app.controller('DatabaseController', function ($scope, statementService, Page) {
      $scope.relations = {};
      $scope.history = [];
      var hist_index = 0;

      $scope.error = function () { // {{{
        document.write('<h1>SOMETHING is WRONG.</h1>');
        throw new Error("something went wrong...");
      } // }}}

      // declaring these at app-level, so we can load up in init and still
      // have them when we go exploring
      var statements,
          fig_id,
          page_id,
          question;

      $scope.init = function (div_id) { // {{{
        $scope.relations = relations_import;

        // figure out where the data is coming from
        if (sessionStorage.importing != undefined && JSON.parse(sessionStorage.place).figure == div_id) {
          $scope.importing = true;
          statements = JSON.parse(sessionStorage.importing);
          sessionStorage[div_id] = sessionStorage.importing;
        } else if (sessionStorage[div_id] != undefined) {
          $scope.importing = true;
          statements = json.parse(sessionStorage[div_id]);
        } else {
          $scope.importing = false;
          statements = statementService[div_id];
        }

        $scope.explore_text = 'Explore!';

        // semi-hack: bringing in exercise information through the
        // statementService; relies on exercises being named such
        if (/exercise/.test(div_id)) {
          if ($scope.importing) {
            holding = statementService[div_id][0];
          } else {
            holding = statements[0];
            statements = [];
          }
          question = holding.question;
          $scope.explore_text = 'Solve!';
        }

        delete sessionStorage.exploring;
        delete sessionStorage.question;

        fig_id = div_id;
        page_id = Page.value;

        for (var i = 0; i < statements.length; i++){
          hist_insert(statements[i]);
          $scope.next();
        }
      }; // }}}

      $scope.explore = function () { // {{{
        // We still need a name for this mapping. 'exploring' works for now, lol
        sessionStorage.exploring = JSON.stringify(statements);
        sessionStorage.place = JSON.stringify({figure: fig_id, page: page_id});

        if (question != undefined) {
          sessionStorage.question = question;
        }

        window.location.href = 'editor';
      }; // }}}

      $scope.next = function () { // {{{
        if (hist_index < $scope.history.length) {
          item = $scope.history[hist_index];
          hist_index += 1;
          // Process the statement!
          actions[item.stmt.action](item.stmt);
          item.processed = true;
          $scope.active = item.stmt.text;
        } else {
          hist_index = 0;
          $scope.active = null;
          $scope.relation = null;
          for (var i=0; i < $scope.history.length; i++) {
            $scope.history[i].processed = false;
          }
        }
        // feed the google
        ga('send', 'event', 'information', 'walk', 'figure-' + getNeilAndBurtsNameThing(fig_id));
        // ga('send', 'event', 'information', 'walk', 'figure-' + fig_id);
      } // }}}

      var hist_insert = function (stmt) { // {{{

        switch (stmt.action){
          case 'select':
            stmt.text = stmt.name + ' <- SELECT FROM ' + stmt.relation +
              ' WHERE ' + stmt.attribute + ' ' + stmt.condition + ' ' +
              stmt.value + ';';
            break;
          case 'project':
            stmt.text = stmt.name + ' <- PROJECT ' + stmt.attributes.join(', ') +
              ' FROM ' + stmt.relation + ';';
            break;
          case 'join':
            stmt.text = stmt.name + ' <- JOIN ' + stmt.relation1 + ' AND ' +
              stmt.relation2 + ' OVER ' + stmt.attribute + ';';
            break;
          default:
            $scope.error();
            break;
        }
        $scope.history.push({stmt: stmt, processed: false});

      } // }}}

      var getNeilAndBurtsNameThing = function(myname) { // {{{
        switch (myname) {
          case 'select1':
            return 'selectcsmajors'; break;
          case 'project1':
            return 'projectfaculty'; break;
          case 'project2':
            return 'projectcourses'; break;
          case 'select_project1':
            return 'nameofcsmajors'; break;
          case 'select_project2':
            return 'cs100fall2012instructors'; break;
          case 'all1':
            return 'rel4expressions'; break;
          case 'all2':
            return 'relationr3'; break;
          case 'all3':
            return 'relationr4'; break;
          default:
            return myname;
        }
      } // }}}

      var actions = {
        select: function (stmt) { // {{{

          // declare some stuff
          var rel = $scope.relations[stmt.relation],
              r_name = stmt.name,
              index = rel.head.indexOf(stmt.attribute),
              r_out = {
                name: r_name,
                statement: r_name + ' <- SELECT FROM ' + rel.name +
                    ' WHERE ' + stmt.attribute + ' ' + stmt.condition + ' ' +
                    stmt.value + ';',
                head: rel.head.slice(),
                rows: []
              };

          // pull out our comparison operator
          var filter;
          if (stmt.condition == '<') {
            filter = function (val1, val2) { return (val1 < val2); }
          } else if (stmt.condition == '<=') {
            filter = function (val1, val2) { return (val1 <= val2); }
          } else if (stmt.condition == '>') {
            filter = function (val1, val2) { return (val1 > val2); }
          } else if (stmt.condition == '>=') {
            filter = function (val1, val2) { return (val1 >= val2); }
          } else if (stmt.condition == '==') {
            filter = function (val1, val2) { return (val1 == val2); }
          } else if (stmt.condition == '!=') {
            filter = function (val1, val2) { return (val1 != val2); }
          }

          // and filter it across our relation
          for (var i = 0; i < rel.rows.length; i++) {
            if (filter(rel.rows[i][index], stmt.value)) {
              r_out.rows.push(rel.rows[i]);
            }
          }

          // add this nice relation we've made to our list of relations
          $scope.relations[r_out.name] = r_out;
          // display it
          $scope.relation = r_out;
        }, // }}}

        project: function (stmt) { // {{{

          // declare some stuff
          var rel = $scope.relations[stmt.relation],
              r_name = stmt.name,
              indices = [],
              r_out = {
                name: r_name,
                statement: r_name + ' <- PROJECT ' + stmt.attributes.join(', ') +
                    ' FROM ' + rel.name + ';',
                head: stmt.attributes,
                rows: []
              };

          // grab the indices of the attributes we're projecting
          for (var i = 0; i < stmt.attributes.length; i++) {
            indices.push(rel.head.indexOf(stmt.attributes[i]));
          }

          for (var i = 0; i < rel.rows.length; i++) {
            var row = [];
            for (var j = 0; j < indices.length; j++) {
              row.push(rel.rows[i][indices[j]]);
            }
            r_out.rows.push(row);
          }

          $scope.relations[r_out.name] = r_out;
          $scope.relation = r_out;
        }, // }}}

        join: function (stmt) { // {{{

          // a name for our resulting relation
          var r_name = stmt.name,
              // our input relations
              relA = $scope.relations[stmt.relation1],
              relB = $scope.relations[stmt.relation2],
              // the indices of the attribute we're joining over
              indexA = relA.head.indexOf(stmt.attribute),
              indexB = relB.head.indexOf(stmt.attribute),
              // a list of duplicated attributes to ignore when merging tuples
              ignore = [],
              // the attributes from both input tables
              both = relA.head.concat(relB.head),
              // the relation itself
              r_out = {
                name: r_name,
                statement: r_name + ' <- JOIN ' + relA.name + ' AND ' +
                    relB.name + ' OVER ' + stmt.attribute + ';',
                head: [],
                rows: []
              }

          // for each attr in 'both', if not in the resultant head, add it
          for (var i = 0; i < both.length; i++) {
            if (r_out.head.indexOf(both[i]) == -1) {
              r_out.head.push(both[i]);
            } else {
              ignore.push(i);
            }
          }

          // for each combination of tuples:
          for (var i = 0; i < relA.rows.length; i++) {
            for (var j = 0; j < relB.rows.length; j++) {
              // if the entries for our attribute-in-question are the same:
              if (relA.rows[i][indexA] == relB.rows[j][indexB]) {
                // join the tuples!
                // 'k' keeps track through the individual tuples, 'p' keeps track
                // of them together (keeps us in sync w/ 'both')
                var p = 0,
                    row = [];
                for (var k = 0; k < relA.rows[i].length; k++, p++) {
                  if (ignore.indexOf(p) == -1) {
                    row.push(relA.rows[i][k]);
                  }
                }
                for (var k = 0; k < relB.rows[j].length; k++, p++) {
                  if (ignore.indexOf(p) == -1) {
                    row.push(relB.rows[j][k]);
                  }
                }
                r_out.rows.push(row)
              }
            }
          }

          $scope.relation = r_out;
          $scope.relations[r_out.name] = r_out;
        }, // }}}

        exercise: function (stmt) { // {{{
          $scope.error();
          console.log('used the exercise function!');
        } // }}}
      }

    });
  }
);
/* vim: set fdm=marker : */
