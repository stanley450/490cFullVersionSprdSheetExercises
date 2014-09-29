/*
 * This file contains all code for the functions which control what
 * is drawn on the interactive drawing window. It also handles adding
 * the variables that are created to the appropriate arrays and listening
 * for user input on the canvas.
 */

function Canvas(figNum) {

    //Declare all local variables
    var toDraw = new Array();
    var message = "";
    var indent = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    var canvas = document.getElementById("drawcanvas"+figNum);
    var variables;
    var shapes;
    var code;
    var editor;
    
    //public functions
    this.clear = clear;
    this.draw = draw;
    this.drawPoint = drawPoint;
    this.drawLine = drawLine;
    this.drawCircle = drawCircle;
    this.drawPolygon = drawPolygon;
    this.getObjects = getObjects;
    this.getToDraw = getToDraw;
    this.setToDraw = setToDraw;

    //Event listener for cursor position on canvas
    $('#' + canvas.id).on('vmousemove', function(evt) {
        $(this).css('cursor', 'crosshair');
        var cursorPos = getCursorPos(evt);
        message = Math.floor(cursorPos.x) + " x " + Math.floor(cursorPos.y);
        if (isNaN(cursorPos.x) || cursorPos.x > 300 || cursorPos.x < 0 || cursorPos.y > 300 || cursorPos.y < 0)
            message = "";
        writeMessage(message);
        return false;
    });

    //Remove coordinate information if mouse leaves canvas. Also, delete any shape preview lines.
    $('#' + canvas.id).on('vmouseout', function(evt) {
        var rect = canvas.getBoundingClientRect();
        var x = evt.clientX - rect.left;
        var y = 300 - (evt.clientY - rect.top);
        if(x>300 || x<0 || y>300 || y<0) {
            $('#' + canvas.id).off('.draw');
            var x = 0;
            for (var i = 0; i < toDraw.length; i++) {
                if (toDraw[i].type == 'temp')
                    x++;
            }
            toDraw = toDraw.slice(0, toDraw.length-x);
            draw();
        }
    });

    /* writeMessage - Writes cursor position on canvas
     * @param  {string} message - string to write coordinates on the canvas (ie. 150 x 150)
     */
    function writeMessage(message) {
        draw();
        var ctx = canvas.getContext('2d');
        ctx.textAlign = 'right';
        ctx.font = '10pt Calibri';
        ctx.fillStyle = 'black';
        ctx.fillText(message, 298, 10);
    }

    /* getCursorPos - Returns the cursor position on canvas
     * @param  {object} evt - jQuery object
     * @return {object} X and Y coordinate of mouse on canvas
     */
    function getCursorPos(evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: 300 - (evt.clientY - rect.top)
        };
    }

    //Clears the canvas of all drawings
    function clear() {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    //Draws all saved objects onto the canvas
    function draw() {
        clear();
        for (var i = 0; i < toDraw.length; i++) {
            if (toDraw[i].type == 'point') {
                //This is a point
                var ctx = canvas.getContext('2d');
                ctx.fillStyle = toDraw[i].color;
                ctx.fillRect(toDraw[i].startX-2, toDraw[i].startY-2, 2, 2);
            }
            else if (toDraw[i].type == 'line' || toDraw[i].type == 'temp') {
                //This is a line
                var ctx = canvas.getContext('2d');
                ctx.beginPath();
                ctx.moveTo(toDraw[i].startX, toDraw[i].startY);
                ctx.lineTo(toDraw[i].endX, toDraw[i].endY);
                ctx.strokeStyle = toDraw[i].color;
                ctx.stroke();
            }
            else if (toDraw[i].type == 'circle') {
                //This is a circle
                var ctx = canvas.getContext('2d');
                ctx.beginPath();
                ctx.arc(toDraw[i].startX, toDraw[i].startY, toDraw[i].diameter, 0, 2*Math.PI);
                ctx.strokeStyle = toDraw[i].color;
                ctx.stroke();
            }
            else if (toDraw[i].type == 'polygon') {
                //This is a polygon
                for (var n = 0; n < toDraw[i].angles.length; n++) {
                    var ctx = canvas.getContext('2d');
                    ctx.beginPath();
                    ctx.moveTo(toDraw[i].angles[n].startX, toDraw[i].angles[n].startY);
                    ctx.lineTo(toDraw[i].angles[n].endX, toDraw[i].angles[n].endY);
                    ctx.strokeStyle = toDraw[i].color;
                    ctx.stroke();
                }
            }
        }
    }

    /* findDistance - Finds distance between two points on canvas
     * @param  {number} startX - The starting point X position
     * @param  {number} startY - The starting point Y position
     * @param  {number} endX   - The ending point X position
     * @param  {number} endY   - The ending point Y position
     * @return {number}        - This is the distance between the two points
     */
    function findDistance(startX, startY, endX, endY) {
            var distance = Math.sqrt(Math.pow((endX - startX), 2) + Math.pow((endY - startY), 2));
            return distance;
    }

    //Allows user to draw a point on canvas. Saves point in toDraw array
    function drawPoint() {
        var click = 0;
        var startX;
        var startY;
        var rect = canvas.getBoundingClientRect();
        variables.getPointVars().push('p' + (variables.getPointVars().length+1));
        variables.printVars();
        $('#' + canvas.id).off('.draw');
        if(figNum < 0) $('#' + canvas.id).on('vmouseup.draw', function(evt) {
            startX = Math.floor(evt.clientX - rect.left);
            startY = Math.floor(evt.clientY - rect.top);
            if(startX<=300 && startX>=0 && startY<=300 && startY>=0) {
                toDraw[toDraw.length] = new shapes.point(startX, startY);
                code.addNewRow(editor.getSelectedRowIndex(), [code.getIndent(editor.getSelectedRowIndex()) + variables.getPointVars()[variables.getPointVars().length-1], "&nbsp;=&nbsp;", 
                "(", startX,",", 300-startY, ")"]);
                code.addNewRow(editor.getSelectedRowIndex(), [code.getIndent(editor.getSelectedRowIndex()) + "draw", "(", variables.getPointVars()[variables.getPointVars().length-1], ")"]);
                draw();
            }

            //remove listener
            $('#' + canvas.id).off('.draw');
        });
    }

    //Allows user to draw a line on canvas. Saves line in toDraw array
    function drawLine() {
        var startX;
        var startY;
        var endX;
        var endY;
        var rect = canvas.getBoundingClientRect();
        variables.getLineVars()[variables.getLineVars().length] = 'l' + (variables.getLineVars().length+1);
        variables.printVars();
        $('#' + canvas.id).off('.draw');
        if(figNum < 0) $('#' + canvas.id).on('vmousedown.draw', function(evt) {
            
            startX = Math.floor(evt.clientX - rect.left);
            startY = Math.floor(evt.clientY - rect.top);
            
            //visualize what the line will look like as the user moves the cursor around
            $('#' + canvas.id).on('vmousemove.draw', function(evt) {
                var ctx = canvas.getContext('2d');
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(evt.clientX - rect.left, evt.clientY - rect.top);
                ctx.strokeStyle = "#FF0000";
                ctx.stroke();
            });
            
            $('#' + canvas.id).on('vmouseup.draw', function(evt) {
                //Turn mouse move listener off
                endX = Math.floor(evt.clientX - rect.left);
                endY = Math.floor(evt.clientY - rect.top);
                
                if(endX>=0 && endX<=300 & endY>=0 && endY<=300) {
                    toDraw[toDraw.length] = new shapes.line(startX, startY, endX, endY, "line");
                    
                    code.addNewRow(editor.getSelectedRowIndex(), [code.getIndent(editor.getSelectedRowIndex()) + variables.getLineVars()[variables.getLineVars().length-1], "&nbsp;=&nbsp;", 
                        "(", "(", startX, ",", 300-startY, ")", ",", "(", endX, ",", 300-endY, ")", ")"]);
                    code.addNewRow(editor.getSelectedRowIndex(), [code.getIndent(editor.getSelectedRowIndex()) + "draw", "(", variables.getLineVars()[variables.getLineVars().length-1], ")"]);
                }
                //Turn off all .draw listeners
                $('#' + canvas.id).off('.draw');
            });
        });
    }

    //Allows user to draw a circle on canvas. Saves circle in toDraw array
    function drawCircle() {
        var click = 0;
        var startX;
        var startY;
        var endX;
        var endY;
        var rect = canvas.getBoundingClientRect();
        variables.getCircleVars()[variables.getCircleVars().length] = 'c' + (variables.getCircleVars().length+1);
        variables.printVars();
        
        $('#' + canvas.id).off('.draw');
        if(figNum < 0) $('#' + canvas.id).on('vmousedown.draw', function(evt) {
            
            startX = Math.floor(evt.clientX - rect.left);
            startY = Math.floor(evt.clientY - rect.top);
            
            //visualize what the circle will look like as the user moves the cursor around
            $('#' + canvas.id).on('vmousemove.draw', function(evt) {
                var ctx = canvas.getContext('2d');
                ctx.beginPath();
                ctx.arc(startX, startY, findDistance(startX, startY, evt.clientX-rect.left, evt.clientY - rect.top), 0, 2*Math.PI);
                ctx.strokeStyle = "#FF0000";
                ctx.stroke();
            });
        });
        $('#' + canvas.id).on('vmouseup.draw', function(evt) {
            endX = Math.floor(evt.clientX - rect.left);
            endY = Math.floor(evt.clientY - rect.top);
            
            if(endX>=0 && endX<=300 & endY>=0 && endY<=300) {
                toDraw[toDraw.length] = new shapes.circle(startX, startY, Math.round(findDistance(startX, startY, endX, endY)));
                
                code.addNewRow(editor.getSelectedRowIndex(), [code.getIndent(editor.getSelectedRowIndex()) + variables.getCircleVars()[variables.getCircleVars().length-1], "&nbsp;=&nbsp;", "(", "(",  
                startX, ",", 300-startY, ")", ",", Math.round(findDistance(startX, startY, endX, endY)), ")"]);
                code.addNewRow(editor.getSelectedRowIndex(), [code.getIndent(editor.getSelectedRowIndex()) + "draw", "(", variables.getCircleVars()[variables.getCircleVars().length-1], ")"]);
            }
            //Turn off all .draw listeners
            $('#' + canvas.id).off('.draw');
        });
    }

    //Allows user to draw a polygon on canvas. Saves polygon in toDraw array
    function drawPolygon() {
        var paintbrush = 0; 
        paintbrush++; 
        var curr = paintbrush;
        var edgeCount = 0; //Keep track of which edge we're working on.
        var startX;
        var startY;
        var endX;
        var endY;
        var coor = new Array();
        var rect = canvas.getBoundingClientRect();
        var finished = false;
        variables.getPolyVars()[variables.getPolyVars().length] = 'g' + (variables.getPolyVars().length+1);
        variables.printVars();
        
        /* Defines a line object within a polygon. should really be called line not point. To lazy to fix.
         * @param  {number} startX - The starting position X coordinate
         * @param  {number} startY - The starting position Y coordinate
         * @param  {number} endX   - The ending position X coordinate
         * @param  {number} endY   - The ending position Y coordinate
         */
        function point(startX, startY, endX, endY) {
            this.startX = Math.floor(startX);
            this.startY = Math.floor(startY);
            this.endX = Math.floor(endX);
            this.endY = Math.floor(endY);
        }
        
        //Turn off all .draw listeners
        $('#' + canvas.id).off('.draw');
        if(figNum < 0) $('#' + canvas.id).on('vmousedown.draw', function(evt) {
            if(edgeCount == 0) {
                startX = evt.clientX - rect.left;
                startY = evt.clientY - rect.top;
            }
            else {
                startX = endX;
                startY = endY;
            }
            
            //visualize what the line will look like as the user moves the cursor around
            $('#' + canvas.id).on('vmousemove.draw', function(evt) {
                var ctx = canvas.getContext('2d');
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                
                //Snap into place if preview line is within 8 pixels of starting point. If mobile, the size increases to 30 pixels
                if(edgeCount >= 2) {
                    var distance = findDistance(evt.clientX - rect.left, evt.clientY - rect.top, coor[0].startX, coor[0].startY);
                    if (distance < 8) {
                        finished = true;
                        ctx.lineTo(coor[0].startX, coor[0].startY);
                        ctx.strokeStyle = "#FFFF00";
                        for(var i = 0; i < toDraw.length; i++) {
                            if(toDraw[i].type == "temp") toDraw[i].color = "#FFFF00";
                        }
                    }
                    else if($(window).width() < 1224 && distance < 30) {
                        finished = true;
                        ctx.lineTo(coor[0].startX, coor[0].startY);
                        ctx.strokeStyle = "#FFFF00";
                        for(var i = 0; i < toDraw.length; i++) {
                            if(toDraw[i].type == "temp") toDraw[i].color = "#FFFF00";
                        }
                    }
                    else {
                        finished = false;
                        ctx.lineTo(evt.clientX - rect.left, evt.clientY - rect.top);
                        ctx.strokeStyle = "#FF0000";
                        for(var i = 0; i < toDraw.length; i++) {
                            if(toDraw[i].type == "temp") toDraw[i].color = "#FF0000";
                        }
                    }
                }
                else {
                    ctx.lineTo(evt.clientX - rect.left, evt.clientY - rect.top);
                    ctx.strokeStyle = "#FF0000";
                }
                ctx.stroke();
            });
        });
        //Listen for vmouse up which means user has finished drawing an edge
        $('#' + canvas.id).on('vmouseup.draw', function(evt) {
            //Turn off vmouse move event
            $('#' + canvas.id).off('vmousemove.draw');
            endX = evt.clientX - rect.left;
            endY = evt.clientY - rect.top;
            //This is our first edge
            if(edgeCount == 0) {
                //Set this line to temporary because it's merely a preview
                toDraw[toDraw.length] = new shapes.line(startX, startY, endX, endY, "temp");
                coor[coor.length] = new point(startX, startY, endX, endY);
            }
            else if(edgeCount >= 2 && finished) {
                //Turn off all listeners
                $('#' + canvas.id).off('.draw');
                
                toDraw[toDraw.length] = new shapes.line(startX, startY, coor[0].startX, coor[0].startY, "temp");
                coor[coor.length] = new point(startX, startY, coor[0].startX, coor[0].startY);
                
                //Erase all line elements in toDraw that were used for polygon. Save polygon.
                toDraw = toDraw.slice(0, toDraw.length-coor.length);
                toDraw[toDraw.length] = new shapes.polygon(coor);

                code.addNewRow(editor.getSelectedRowIndex(), [code.getIndent(editor.getSelectedRowIndex()) + variables.getPolyVars()[variables.getPolyVars().length-1], "&nbsp;=&nbsp;", 
                    "(", "(", coor[0].startX, ",", 300-coor[0].startY, ")", ","]);
                for(var i = 1; i < coor.length; i++) {
                    if (i == coor.length-1) {
                        code.addNewRow(editor.getSelectedRowIndex(), [code.getIndent(editor.getSelectedRowIndex()) + indent, "(", coor[i].startX, ",", 300-coor[i].startY, ")", ","]);
                        code.addNewRow(editor.getSelectedRowIndex(), [code.getIndent(editor.getSelectedRowIndex()) + indent, "(", coor[0].startX, ",", 300-coor[0].startY, ")", ")"], true);
                    }
                    else
                        code.addNewRow(editor.getSelectedRowIndex(), [code.getIndent(editor.getSelectedRowIndex()) + indent, "(", coor[i].startX, ",", 300-coor[i].startY, ")", ","]);
                }
                code.addNewRow(editor.getSelectedRowIndex(), [code.getIndent(editor.getSelectedRowIndex()) + "draw", "(", variables.getPolyVars()[variables.getPolyVars().length-1], ")"]);
                draw();
            }
            else {
                toDraw[toDraw.length] = new shapes.line(startX, startY, endX, endY, "temp");
                coor[coor.length] = new point(startX, startY, endX, endY);
            }
            edgeCount++;
        });
    }
    
    /* getToDraw -Gets the toDraw array
     * @return {Array} - The array that determines what will be drawn on the canvas
     */
    function getToDraw() {
        return toDraw;
    }
    
    /* setToDraw - Sets the toDraw array
     * @param {Array} value - the value to set the toDraw array to
     */
    function setToDraw(value) {
        toDraw = value;
    }
    
    //Gets all objects needed by canvas.js
    function getObjects(variablesObj, shapesObj, codeObj, editorObj) {
        variables = variablesObj
        shapes = shapesObj;
        code = codeObj;
        editor = editorObj;
    }
}






