/*
* Contains code for the variable window.
* All variable arrays are declared and 
* the variable window is populated with
* the declared variables
*/

function Variables(figNum) {
    
    //Declare all local variables
    var pointVariables = new Array();
    var lineVariables = new Array();
    var circleVariables = new Array();
    var polygonVariables = new Array();
    var distanceVariables = new Array();
    var code;
    var editor;
    
    //Public functions
    this.printVars = printVars;
    this.newDistance = newDistance;
    this.getObjects = getObjects;
    this.getPointVars = getPointVars;
    this.getLineVars = getLineVars;
    this.getPolyVars = getPolyVars;
    this.getCircleVars = getCircleVars;
    this.getDistVars = getDistVars;
    this.resetArrays = resetArrays;
    this.setArrays = setArrays;

    //Print all declared variables into the variables window
    function printVars() {
        var point = new Array();
        var line = new Array();
        var circle = new Array();
        var polygon = new Array();
        var distance = new Array();
        
        if(code.rowToString(0).indexOf("//Variable") >= 0) {
            while(code.rowToString(0).indexOf("//Program") == -1) {
                editor.deleteRow(0);
            }
            editor.deleteRow(0);
        }
        for(var i = 0; i < distanceVariables.length; i++) {
            if(i != 0) distance[distance.length] = {text:",&nbsp;d" + Number(i+1), type:[]};
            else distance[distance.length] = {text:"d" + Number(i+1), type:[]};
        }
        for(var i = 0; i < pointVariables.length; i++) {
            if(i != 0) point[point.length] = {text:",&nbsp;p" + Number(i+1), type:[]};
            else point[point.length] = {text:"p" + Number(i+1), type:[]};
        }
        for(var i = 0; i < lineVariables.length; i++) {
            if(i != 0) line[line.length] = {text:",&nbsp;l" + Number(i+1), type:[]};
            else line[line.length] = {text:"l" + Number(i+1), type:[]};
        }
        for(var i = 0; i < polygonVariables.length; i++) {
            if(i != 0) polygon[polygon.length] = {text:",&nbsp;g" + Number(i+1), type:[]};
            else polygon[polygon.length] = {text:"g" + Number(i+1), type:[]};
        }
        for(var i = 0; i < circleVariables.length; i++) {
            if(i != 0) circle[circle.length] = {text:",&nbsp;c" + Number(i+1), type:[]};
            else circle[circle.length] = {text:"c" + Number(i+1), type:[]};
        }
        
        editor.addRow(0, [{text:"//Program Code", type:["comment"]}]);
        if(distanceVariables.length > 0) {
            editor.addRow(0, [{text:"Distance&nbsp;", type:["datatype"]}].concat(distance));
        }
        if(pointVariables.length > 0) {
            editor.addRow(0, [{text:"Point&nbsp;", type:"datatype"}].concat(point));
        }
        if(lineVariables.length > 0) {
            editor.addRow(0, [{text:"Line&nbsp;", type:"datatype"}].concat(line));
        }
        if(polygonVariables.length > 0) {
            editor.addRow(0, [{text:"Polygon&nbsp;", type:"datatype"}].concat(polygon));
        }
        if(circleVariables.length > 0) {
            editor.addRow(0, [{text:"Circle&nbsp;", type:"datatype"}].concat(circle));
        }
        editor.addRow(0, [{text:"//Variable Declarations", type:["comment"]}]); 
    }

    //New Distance variable
    function newDistance() {
        distanceVariables[distanceVariables.length] = 'd' + (distanceVariables.length+1);
        printVars();
    }
    
    /* getPointVars - gets the pointVariables variable
     * @return {Array} - All declared point variables
     */
    function getPointVars() {
        return pointVariables;
    }
    
    /* getLineVars - gets the lineVariables variable
     * @return {Array} - All declared line variables
     */
    function getLineVars() {
        return lineVariables;
    }
    
    /* getPolyVars - gets the polygonVariables variable
     * @return {Array} - All declared polygon variables
     */
    function getPolyVars() {
        return polygonVariables;
    }
    
    /* getCircleVars - gets the circleVariables variable
     * @return {Array} - All declared circle variables
     */
    function getCircleVars() {
        return circleVariables;
    }
    
    /* getDistVars - gets the distanceVariables variable
     * @return {Array} - All declared distance variables
     */
    function getDistVars() {
        return distanceVariables;
    }

    /* setArrays - Sets all the shape arrays (For use when loading a program from local storage)
     * @param {Array} distance - Sets the shape array variable.
     * @param {Array} point    - Sets the shape array variable.
     * @param {Array} line     - Sets the shape array variable.
     * @param {Array} circle   - Sets the shape array variable.
     * @param {Array} polygon  - Sets the shape array variable.
     */
    function setArrays(distance, point, line, circle, polygon) {
        distanceVariables = distance;
        pointVariables = point;
        lineVariables = line;
        circleVariables = circle;
        polygonVariables = polygon;
    }

    //resets all arrays
    function resetArrays() {
        distanceVariables = new Array();
        pointVariables = new Array();
        lineVariables = new Array();
        circleVariables = new Array();
        polygonVariables = new Array();
    }
    
    //Gets all needed objects for variables.js
    function getObjects(codeObj, editorObj) {
        code = codeObj;
        editor = editorObj

    }
}


