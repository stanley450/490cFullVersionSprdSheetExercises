/*
 *
 *  Contains code for creating new shape objects
 * 
 */

function Shapes() {
    //Declare all variables
    var codeSep = 0; //Used for naming div elements that separate code lines
    var codeText = new Array();
    var variables;
    var canvas;
    
    //public functions
    this.point = point;
    this.line = line;
    this.circle = circle;
    this.polygon = polygon;
    this.getObjects = getObjects;
    
    /* point - This is the structure for points (Which is stored in the toDraw array)
     * @param  {Number} startX - X position of point to make
     * @param  {Number} startY - Y position of point to make
     */
    function point(startX, startY) {
        this.startX = startX;
        this.startY = startY;
        this.type = 'point';
        this.color = "#FF0000";
        this.varNum = variables.getPointVars().length; //Index of this object in pointVariables
        this.drawNum = canvas.getToDraw().length; //Index of this object in toDraw
        this.active = true; //Boolean to control if shape needs to be drawn or not
        this.assigned = true; //Boolean to control whether variable has been assigned or not
    }
    /* line - This is the structure for lines (Which is stored in the toDraw array)
     * @param  {Number} startX - The starting X position for this line
     * @param  {Number} startY - The starting Y position for this line
     * @param  {Number} endX   - The ending X position for this line
     * @param  {Number} endY   - The ending Y position for this line
     * @param  {String} type   - Defines whether or not this is a line temporarily drawn for visualizing
     *                           polygon being drawn ("temp") or if this is to be stored ("line")
     */
    function line(startX, startY, endX, endY, type) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.type = type;
        this.color = "#FF0000";
        this.varNum = variables.getLineVars().length; //Index of this object in lineVariables
        this.drawNum = canvas.getToDraw().length; //Index of this object in toDraw
        this.active = true; //Boolean to control if shape needs to be drawn or not
        this.assigned = true; //Boolean to control whether variable has been assigned or not 
    }
    /* circle - This is the structure for circles (Which is stored in the toDraw array)
     * @param  {Number} startX   - Defines X position of center of circle
     * @param  {Number} startY   - Defines Y position of center of circle
     * @param  {Number} diameter - Defines the length of the radius of the circle
     */
    function circle(startX, startY, diameter) {
        this.startX = startX;
        this.startY = startY;
        this.diameter = diameter;
        this.type = 'circle';
        this.color = "#FF0000";
        this.varNum = variables.getCircleVars().length;
        this.drawNum = canvas.getToDraw().length;
        this.active = true;
        this.assigned = true;
    }
    /* polygon - This is the structure for circles (Which is stored in the toDraw array)
     * @param  {Array} angles - holds all the lines that make up a polygon
     */
    function polygon(angles) {
        this.angles = angles;
        this.type = 'polygon';
        this.color = "#FF0000";
        this.varNum = variables.getPolyVars().length;
        this.drawNum = canvas.getToDraw().length;
        this.active = true;
        this.assigned = true;
    }
    
    //Gets all needed objects for shapes.js
    function getObjects(variablesObj, canvasObj) {
        variables = variablesObj;
        canvas = canvasObj;
    }
}








