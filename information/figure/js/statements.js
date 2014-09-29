define(['angular'], function(angular) {
  var app = angular.module('DatabaseApp', ['ui.bootstrap'])

  app.service('statementService', function () {
    var self = this;

    self.select1 = [ // {{{
      {
        action: 'select',
        name: 'Relation1',
        relation: 'Students',
        attribute: 'Major',
        condition: '==',
        value: 'CS'
      }
    ]; // }}}

    self.select_exercise1 = [ // {{{
      {
        action: 'exercise',
        question: 'Generate a relation, based on the Students relation, that '
          + 'contains entries for all students under age 21.'
      }
    ]; // }}}

    self.select_exercise2 = [ // {{{
      {
        action: 'exercise',
        question: 'Generate a relation, based on the Faculty relation, that '
          + 'contains entries for all faculty members in the Math department.'
      }
    ]; // }}}

    self.select_exercise3 = [ // {{{
      {
        action: 'exercise',
        question: 'Generate a relation, based on the Students relation, that '
          + 'contains entries for all female CS students.'
      }
    ]; // }}}

    self.select_exercise4 = [ // {{{
      {
        action: 'exercise',
        question: 'Generate a relation, based on the Students relation, that '
          + 'contains entries for all male CS math majors who are between the '
          + 'ages of 19 and 23, inclusive.'
      }
    ]; // }}}

    self.project1 = [ // {{{
      {
        action: 'project',
        name: 'Relation1',
        relation: 'Faculty',
        attributes: ['FName', 'Phone']
      }
    ]; // }}}

    self.project2 = [ // {{{
      {
        action: 'project',
        name: 'Relation1',
        relation: 'Courses',
        attributes: ['Course', 'Credits']
      }
    ]; // }}}

    self.project_exercise1 = [ // {{{
      {
        action: 'exercise',
        question: 'Generate a list of the names of all students enrolled in '
          + 'the university.'
      }
    ]; // }}}

    self.project_exercise2 = [ // {{{
      {
        action: 'exercise',
        question: 'Generate a list of the names of all courses taught at the '
          + 'university.'
      }
    ]; // }}}

    self.project_exercise3 = [ // {{{
      {
        action: 'exercise',
        question: 'Generate a list of the names of all faculty employed by '
          + 'the university.'
      }
    ]; // }}}

    self.join1 = [ // {{{
      {
        action: 'join',
        name: 'Relation1',
        relation1: 'Faculty',
        relation2: 'Courses',
        attribute: 'FName'
      }
    ]; // }}}

    self.select_project1 = [ // {{{
      {
        action: 'select',
        name: 'CS_Majors',
        relation: 'Students',
        attribute: 'Major',
        condition: '==',
        value: 'CS'
      }, {
        action: 'project',
        name: 'Name_of_CS_Majors',
        relation: 'CS_Majors',
        attributes: ['SName']
      }
    ]; // }}}

    self.select_project2 = [ // {{{
      {
        action: 'select',
        name: 'CS100',
        relation: 'Courses',
        attribute: 'Course',
        condition: '==',
        value: 'CS 100'
      }, {
        action: 'select',
        name: 'CS100_2012',
        relation: 'CS100',
        attribute: 'Year',
        condition: '==',
        value: '2012'
      }, {
        action: 'select',
        name: 'CS100_Fall_2012',
        relation: 'CS100_2012',
        attribute: 'Quarter',
        condition: '==',
        value: 'FALL'
      }, {
        action: 'project',
        name: 'CS100_Fall_2012_Instructors',
        relation: 'CS100_Fall_2012',
        attributes: ['FName']
      }
    ]; // }}}

    self.select_project_exercise1 = [ // {{{
      {
        action: 'exercise',
        question: 'Where is Dr. O’Neal’s office located?'
      }
    ]; // }}}

    self.select_project_exercise2 = [ // {{{
      {
        action: 'exercise',
        question: 'What course did Dr. Kurtz teach in fall 2013?'
      }
    ]; // }}}

    self.select_project_exercise3 = [ // {{{
      {
        action: 'exercise',
        question: 'What are the names of all male math majors who are between '
          + 'the ages of 19 and 21, inclusive?'
      }
    ]; // }}}

    self.select_project_exercise4 = [ // {{{
      {
        action: 'exercise',
        question: 'What are the names and telephone numbers of faculty in the '
          + 'math department?'
      }
    ]; // }}}

    self.select_project_exercise5 = [ // {{{
      {
        action: 'exercise',
        question: 'List the student numbers (but no other information) of '
          + 'female CS students.'
      }
    ]; // }}}

    self.select_project_exercise6 = [ // {{{
      {
        action: 'exercise',
        question: 'List the salaries of computer science faculty members '
          + '(but, to protect confidentiality, don’t include any other '
          + 'information in the table).'
      }
    ]; // }}}

    self.all1 = [ // {{{
      {
        action: 'join',
        name: 'Rel1',
        relation1: 'Faculty',
        relation2: 'Courses',
        attribute: 'FName'
      }, {
        action: 'select',
        name: 'Rel2',
        relation: 'Rel1',
        attribute: 'Year',
        condition: '==',
        value: '2013'
      }, {
        action: 'select',
        name: 'Rel3',
        relation: 'Rel2',
        attribute: 'Quarter',
        condition: '==',
        value: 'SPRING'
      }, {
        action: 'project',
        name: 'Rel4',
        relation: 'Rel3',
        attributes: ['Course', 'SEQ_NO', 'FName', 'Office', 'Phone']
      }
    ]; // }}}

    self.all2 = [ // {{{
      {
        action: 'select',
        name: 'R1',
        relation: 'Courses',
        attribute: 'FName',
        condition: '==',
        value: 'Carpenter J.'
      }, {
        action: 'select',
        name: 'R2',
        relation: 'R1',
        attribute: 'Course',
        condition: '==',
        value: 'MATH 241'
      }, {
        action: 'select',
        name: 'R3',
        relation: 'R2',
        attribute: 'Quarter',
        condition: '==',
        value: 'SPRING'
      }, {
        action: 'select',
        name: 'R4',
        relation: 'R3',
        attribute: 'Year',
        condition: '==',
        value: '2013'
      }, {
        action: 'project',
        name: 'R5',
        relation: 'R4',
        attributes: ['SEQ_NO']
      }, {
        action: 'join',
        name: 'R6',
        relation1: 'R5',
        relation2: 'Grades',
        attribute: 'SEQ_NO'
      }, {
        action: 'project',
        name: 'R7',
        relation: 'R6',
        attributes: ['ID']
      }
    ]; // }}}

    self.all3 = [ // {{{
      {
        action: 'select',
        name: 'R1',
        relation: 'Courses',
        attribute: 'FName',
        condition: '==',
        value: 'Carpenter J.'
      }, {
        action: 'select',
        name: 'R2',
        relation: 'R1',
        attribute: 'Course',
        condition: '==',
        value: 'MATH 241'
      }, {
        action: 'select',
        name: 'R3',
        relation: 'R2',
        attribute: 'Quarter',
        condition: '==',
        value: 'SPRING'
      }, {
        action: 'select',
        name: 'R4',
        relation: 'R3',
        attribute: 'Year',
        condition: '==',
        value: '2013'
      }, {
        action: 'project',
        name: 'R6',
        relation: 'R5',
        attributes: ['SEQ_NO']
      }, {
        action: 'join',
        name: 'R7',
        relation1: 'R6',
        relation2: 'Grades',
        attribute: 'SEQ_NO'
      }, {
        action: 'project',
        name: 'R8',
        relation: 'R7',
        attributes: ['ID']
      }, {
        action: 'join',
        name: 'R9',
        relation1: 'R8',
        relation2: 'Students',
        attribute: 'ID'
      }, {
        action: 'project',
        name: 'R10',
        relation: 'R9',
        attributes: ['SName', 'ID']
      }
    ]; // }}}

    self.all_exercise1 = [ // {{{
      {
        action: 'exercise',
        question: 'Produce a listing of the grades given by Dr. O’Neal '
          + '(“ONeal M. B.”) in all of his courses. The relation you produce '
          + 'should contain only the student names, their grades, the name of '
          + 'the course in which they made the grade, and the quarter and '
          + 'year of offering.'
      }
    ]; // }}}

    self.all_exercise2 = [ // {{{
      {
        action: 'exercise',
        question: 'Create a relation containing only the name, office '
          + 'location, and phone number of the instructor who taught the '
          + 'course with sequence number “100004”.'
      }
    ]; // }}}

    self.all_exercise3 = [ // {{{
      {
        action: 'exercise',
        question: 'Generate the fall 2012 course schedule for student number '
          + '“55555510”. The schedule should consist of course names, '
          + 'sequence numbers, and instructors.'
      }
    ]; // }}}

    self.all_exercise4 = [ // {{{
      {
        action: 'exercise',
        question: 'Produce an academic transcript for “Walker J.”. The '
          + 'transcript should consist of the course name, quarter, year, '
          + 'and grade earned for every course taken by Mr. Walker.'
      }
    ]; // }}}

    self.all_exercise5 = [ // {{{
      {
        action: 'exercise',
        question: 'The Chair of the CS program is interested in how well his '
          + 'students are doing. Generate a table of student names, courses '
          + 'taken, and grades earned by every CS major in winter 2013.'
      }
    ]; // }}}

    self.all_exercise6 = [ // {{{
      {
        action: 'exercise',
        question: 'Produce a list of the names of students who earned one or '
          + 'more A’s in winter 2013.'
      }
    ]; // }}}

    self.all_exercise7 = [ // {{{
      {
        action: 'exercise',
        question: 'What is the SSN of the only professor who gave '
          + '“Kleinpeter J.” a B in fall 2012?'
      }
    ]; // }}}
  });
});
// vim: fdm=marker
