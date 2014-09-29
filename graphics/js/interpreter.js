/*
 *
 * Note: how to tokenize in javascript:
 * input.split(/[(,)\s]+/);
 * Author: Mitchell James Martin
 * Note: This is an adapted method from a previous Watson Graphics Lab rewritten
 * for javascript. 
 * 
 */

function Interpreter(figNum) {
    var d = new Array();
    var p = new Array();
    var l = new Array();
    var g = new Array();
    var c = new Array();
    var color = "red";
    var variableNumber;
    var variableType;
    var run_walk;
    var variables;
    var shapes;
    var canvas;
    var editor;
    var code;
    
    //Public functions
    this.interpret = interpret;
    this.getObjects = getObjects;
    this.getVariables = getVariables;
    this.getD = getD;
    this.getP = getP;
    this.getL = getL;
    this.getG = getG;
    this.getC = getC;


    function interpret(input)
    {
        if (run_walk.getFresh())
        {
            color = "red";
            run_walk.setFresh(false);
            canvas.setToDraw([]);
            for (var i = 0; i < variables.getDistVars().length; i++)
            {
                d[i] = 0;
            }
            for (var i = 0; i < variables.getPointVars().length; i++)
            {
                p[i] = new shapes.point(-1, 0);
            }
            for (var i = 0; i < variables.getLineVars().length; i++)
            {
                l[i] = new shapes.line(0, 0, 0, 0);
            }
            for (var i = 0; i < variables.getPolyVars().length; i++)
            {
                g[i] = new Array();
            }
            for (var i = 0; i < variables.getCircleVars().length; i++)
            {
                c[i] = new shapes.circle(0, 0, 0);
            }
        }
        //input is assumed to be some string variable with the instructions
        //to be used
        //Split input into tokens
        // Note: /s includes several different types of whitespace
        //characters.
        tokens = input.split(/[(,)\s]+/);

        // Check for valid tokens that can delimit the start of
        // statement or loop structure -- 'repeat' 'endloop'
        if (tokens[0].localeCompare("draw") == 0)
        {
            // get the next token
            if (tokens.length < 3)
            {
                handleSyntaxError(tokens);
            }
            if (isValid(tokens[1]) && (!(tokens[1].charAt(0) == 'd')))
            {
                index = parseInt(tokens[1].substring(1))-1;
                if (tokens[1].charAt(0) == 'p')
                {
                    var shape = p[index];
                    shape.color = color;
                    //color = "red"
                    canvas.getToDraw().push(shape);

                }
                else if (tokens[1].charAt(0) == 'l')
                {
                    var shape = l[index];
                    shape.color = color;
                    //color = "red"
                    canvas.getToDraw().push(shape);
                }
                else if (tokens[1].charAt(0) == 'g')
                {
                    var shape = g[index];
                    shape.color = color;
                    //color = "red"
                    canvas.getToDraw().push(shape);
                }
                //assume circle
                else
                {
                    var shape = c[index];
                    shape.color = color;
                    //color = "red"
                    var print = canvas.getToDraw();
                    canvas.getToDraw().push(shape);
                }
            }
            else if (tokens[0].localeCompare("OBJECT") == 0)
            {
                handleIncompleteProgram(tokens[0]);
                return;
            }
            else
            {
                handleSyntaxError(tokens);
                return;
            }
        }
        else if (tokens[0].localeCompare("erase") == 0)
        {
            // get the next token
            if (tokens.length < 3)
            //TODO: handle errors
            {
                handleSyntaxError(tokens);
                return;
            }

            if (isValid(tokens[1]) && (!(tokens[1].charAt(0) == 'd')))
            {
                index = parseInt(tokens[1].substr(1))-1;
                if (tokens[1].charAt(0) == 'p')
                {
                    var shape = p[index];
                    shape.color = "white";
                    canvas.getToDraw().push(shape);
                }
                else if (tokens[1].charAt(0) == 'l')
                {
                    var shape = l[index];
                    shape.color = "white";
                    canvas.getToDraw().push(shape);
                }
                else if (tokens[1].charAt(0) == 'g')
                {
                    var shape = g[index];
                    shape.color = "white";
                    canvas.getToDraw().push(shape);
                }
                //assume circle
                else
                {
                    var shape = c[index];
                    shape.color = "white";
                    canvas.getToDraw().push(shape);
                }
            }
            else if (tokens[0].localeCompare("OBJECT") == 0)
            {
                //TODO: incomplete
                handleIncompleteProgram(tokens[0]);
                return;
            }
            else
            {
                handleSyntaxError(tokens);
                return;
            }
        }
        else if (tokens[0].localeCompare("color") == 0)
        {
            // process the color command

            // get the next token
            if (tokens.length < 3)
            {
                //TODO: handle errors
            }

            if (tokens[1].localeCompare("red") == 0)
            {
                color = "red";
            }
            else if (tokens[1].localeCompare("blue") == 0)
            {
                color = "blue";
            }
            else if (tokens[1].localeCompare("green") == 0)
            {
                color = "green";
            }
            else if (tokens[1].localeCompare("yellow") == 0)
            {
                color = "yellow";
            }
            else if (tokens[1].localeCompare("orange") == 0)
            {
                color = "orange";
            }
            else if (tokens[1].localeCompare("black") == 0)
            {
                color = "black";
            }
            else if (tokens[1].localeCompare("white") == 0)
            {
                color = "white";
            }
            else
            {
                handleSyntaxError(tokens);
                return;
            }
        }
        //NOTE: deprecated. Can no longer be called by the
        //Watson Graphics lab UI.
        else if (tokens[0].localeCompare("increment") == 0 ||
            tokens[0].localeCompare("decrement") == 0)
        {
            // process the increment and decrement commands

            //string 
            var StatementType = tokens[0];

            // get the next token -- distance variable expected
            if (tokens.length < 3)
            {
                handleSyntaxError(tokens);
                return;
            }

            if (isValid(tokens[1]) && (tokens[1].charAt(0) == 'd'))
            {
                // remember the variable number
                //int
                var IDVariableNumber = parseInt(tokens[1].substr(1));

                // get the next token -- distance constant (AMOUNT) expected
                //TODO: seems redundant to check length twice. Also unexpected end of program
                if ((tokens.length < 3))
                {
                    handleSyntaxError(tokens);
                    return;
                }

                var valid = validDistanceConstant(tokens[2])
                if (valid[0])
                {
                    if (StatementType.localeCompare("increment") == 0)
                    {
                        d[IDVariableNumber - 1] = d[IDVariableNumber - 1] +
                            valid[1];
                    }
                    else // decrement
                    {
                        d[IDVariableNumber - 1] = d[IDVariableNumber - 1] -
                            valid[1];
                    }
                    if (rangeError(d[IDVariableNumber - 1]))
                    {
                        //TODO: range error
                        //handleRangeError( IDVariableNumber,
                        //                    d[IDVariableNumber-1] );
                        return;
                    }
                }
                else if (tokens[2].localeCompare("AMOUNT") == 0)
                {
                    handleIncompleteProgram(tokens[2]);
                    return;
                }
                else
                {
                    handleSyntaxError(tokens);
                    return;
                }
            }
            else if (tokens[1].equals("DISTANCE"))
            {
                handleIncompleteProgram(tokens[1]);
                return;
            }
            else
            {
                handleSyntaxError(tokens);
                return;
            }
        }
        // Check to make sure we have not encountered a placeholder
        // indicating an incomplete assignment statement.  If so,
        // display a message informing the user that the program must
        // be complete before it can be successfully run and then exit
        // the interpreter.
        else if (tokens[0].localeCompare("VARIABLE") == 0)
        {
            handleIncompleteProgram(tokens[0]);
            return;
        }
        // The only other syntactically valid token that can appear at
        // this point is a variable denoting the left hand side of an
        // assignment statement
        else if (isValid(tokens[0]))
        {
            //int
            var assignmentVariableNumber = variableNumber;
            //string
            var assignmentVariableType = variableType;
            // get the next token
            if (tokens.length < 3)
            {
                handleUnexpectedEndOfProgram(tokens);
                return;
            }

            // The assignment operator = is expected
            if (tokens[1].localeCompare("=") != 0)
            {
                handleSyntaxError(tokens);
                return;
            }

            // get the next token
            if (tokens.length < 3)
            {
                handleUnexpectedEndOfProgram(tokens);
                return;
            }

            // Handle RIGHT HAND SIDE EXPRESSIONS for each type of variable

            if (assignmentVariableType.localeCompare("distance") == 0)
            {
                
                var valid;
                valid = validDistance(tokens[2]);
                if (valid[0] && tokens.length < 4)
                {
                    d[assignmentVariableNumber - 1] = valid[1];
                }
                //new functionality for increment and decrement
                //check if right hand side of equal sign has the an increment statement.
                else if (tokens.length > 4)
                {
                    valid = validDistance(tokens[4]);
                    if(tokens[3].indexOf("+") != -1)
                    {
                        if(valid[0])
                        {
                            if(d[assignmentVariableNumber - 1] - valid[1] <= 300)
                            {
                                d[assignmentVariableNumber - 1] = d[assignmentVariableNumber-1] + valid[1];
                            }
                            else
                            {
                                handleOutOfBoundsError();
                            }
                        }
                        else
                        {
                            handleSyntaxError(tokens);
                        }
                    }
                    else if(tokens[3].indexOf("-") != -1)
                    {
                        
                        if(valid[0])
                        {
                            if(d[assignmentVariableNumber - 1] - valid[1] >= 0)
                            {
                                d[assignmentVariableNumber - 1] = d[assignmentVariableNumber-1] - valid[1];
                            }
                            else
                            {
                                handleOutOfBoundsError();
                            }
                        }
                        else
                        {
                            handleSyntaxError(tokens);
                        }
                    }
                    //Error.
                    else
                    {
                        handleSyntaxError(tokens);
                    }
                    
                }
                else
                {
                    handleSyntaxError(tokens);
                    return;
                }
            }
            else if (assignmentVariableType.localeCompare("point") == 0)
            {
                valid = validPoint(tokens.slice(2, 4));
                if (valid[0])
                {
                    p[assignmentVariableNumber - 1] = new shapes.point(valid[1], valid[2]);
                }
                else
                {
                    handleSyntaxError(tokens);
                    return;
                }
            }
            else if (assignmentVariableType.localeCompare("line") == 0)
            {
                valid = validLine(tokens.slice(2, -1));
                if (valid[0])
                {
                    l[assignmentVariableNumber-1] = new shapes.line(valid[1], valid[2], valid[3], valid[4], "line");
                }
                else
                {
                    handleSyntaxError(tokens);
                    return;
                }
            }
            else if (assignmentVariableType.localeCompare("polygon") == 0)
            {
                valid = validPolygon(tokens.slice(2));
                if (valid[0])
                {
                    var points = valid.slice(1);
                    var lines = new Array();
                    var i = 0;
                    while(i < points.length)
                    {
                        if(i+1==points.length)
                        {
                            lines[i] = new shapes.line(points[i].startX,points[i].startY,points[0].startX,points[0].startY, "line");
                        }
                        else
                        {
                            lines[i] = new shapes.line(points[i].startX,points[i].startY,points[i+1].startX,points[i+1].startY, "line");
                        }
                        i++;
                    }
                    g[assignmentVariableNumber - 1] = new shapes.polygon(lines);
                }
                else
                {
                    handleSyntaxError(tokens);
                    return;
                }
            }
            else
            {
                valid = validCircle(tokens.slice(2, -1));
                if (valid[0])
                {
                    c[assignmentVariableNumber - 1] = new shapes.circle(valid[1], valid[2], valid[3]);
                    //c[assignmentVariableNumber - 1].startX = valid[1];
                   //c[assignmentVariableNumber - 1].startY = valid[2];
                    //c[assignmentVariableNumber - 1].diameter = valid[3];
                }
                else
                {
                    handleSyntaxError(tokens);
                    return;
                }
            }
        }
        // Otherwise, something is terribly wrong.  We have encountered
        // a syntactically invalid expression.  The probable cause is
        // that an instructor mistyped the initial program string.
        // Print a (friendly) error message and exit.
        else
        {
            handleSyntaxError(tokens);
            return;
        }
    }

    function isValid(currentToken)
    {
        //string
        var type;
        //int
        var value;
        var start = currentToken.charAt(0);

        // Determine type.  Return false if not a valid variable type.
        if (start == 'd')
            type = "distance";
        else if (start == 'p')
            type = "point";
        else if (start == 'l')
            type = "line";
        else if (start == 'g')
            type = "polygon";
        else if (start == 'c')
            type = "circle";
        else
        {
            return false;
        }

        // We have detected a valid starting character for a variable.
        // Now see if we have a valid variable number to go with it.
        var IsValid = true; // assume valid until proven otherwise.
        // check if there is a valid index after the type identifier
        value = parseInt(currentToken.substr(1));
        if (isNaN(value))
        {
            // began like a variable but did not complete properly
            value = -1;
            IsValid = false;
        }

        // We have a valid variable type and a valid number.  Make sure the
        // number actually refers to a declared variable of the proper type
        // -- i.e., that it is not outside the range of declared variables.
        //TODO: variable names.
        if (IsValid && (value > 0))
        {
            tokens[2].localeCompare("repeat") == 0
            if (((type.localeCompare("distance") == 0) &&
                    (value <= d.length)) ||
                ((type.localeCompare("point") == 0) &&
                    (value <= p.length)) ||
                ((type.localeCompare("line") == 0) &&
                    (value <= l.length)) ||
                ((type.localeCompare("polygon") == 0) &&
                    (value <= g.length)) ||
                ((type.localeCompare("circle") == 0) &&
                    (value <= c.length)))
            {
                variableType = type;
                variableNumber = value;
                return true;
            }
            else
                return false;
        }
        else
        {
            return false;
        }
    }

    /*
    Returns-
    index 0: true or false, signifying that the token represents a valid distance constant
    index 1: the value of that distance. (If valid)
    */
    function validDistanceConstant(currentToken)
    {
        var returned = new Array();
        // Determine whether the input represents a valid number
        //boolean
        var IsValid = true; // assume valid until proven otherwise.
        //int
        var TokenValue = -1;
        TokenValue = parseInt(currentToken);
        if (isNaN(TokenValue))
        {
            IsValid = false;
        }

        // Perform a range check on the TokenValue to ensure it is between
        // 0 and 300 inclusive -- the range of valid Distance values.
        if ((IsValid) && (TokenValue >= 0) && (TokenValue <= 300))
        {
            returned[0] = true;
            returned[1] = TokenValue;
            return returned;
        }
        else
        {
            returned[0] = true;
            return returned;
        }
    }

    function rangeError(val)
    {
        if ((val < 0) || (val >= 300))
            return true;
        else
            return false;
    }

    /*
    Returns-
    index 0: true or false, signifying that the token represents a valid distance
    index 1: the value of that distance. (If valid)
    */
    function validDistance(token)
    {
        var returned = new Array();
        if (isValid(token) && token.charAt(0) == 'd')
        {
            if (d[variableNumber - 1] != -1)
            {
                returned[0] = true;
                returned[1] = d[variableNumber - 1];
                return returned;
            }
            else
            {
                // TODO: reference to unassigned variable
                //handleUnassignedVariable("d"+variableNumber);
                returned[0] = false
                return returned;
            }
        }
        else
        {
            returned = validDistanceConstant(token);
            if (returned[0])
            {
                return returned;
            }
            else if (token.localeCompare("DISTANCE") == 0)
            {
                returned[0] = false;
                return returned;
            }
            else if (currentToken.startsWith("X"))
            {
                returned[0] = false;
                return returned;
            }
            else
            {
                returned[0] = false;
                return returned;
            }
        }

    }

    /*
    Returns-
    index 0: true or false, signifying that the token represents a valid distance
    index 1: The point's x coordinate
    index 2: The point's y coordinate
    */
    function validPoint(tokens)
    {
        var parse = new Array();
        var returned = new Array();
        if (isValid(tokens[0]) && tokens[0].charAt(0) == 'p')
        {
            if ((p[variableNumber - 1].startX != -1) &&
                (p[variableNumber - 1].startY != -1))
            {
                returned[0] = true;
                returned[1] = p[variableNumber - 1].startX;
                returned[2] = p[variableNumber - 1].startY;
                return returned;
            }
            else
            {
                // error: reference to unassigned variable
                //handleUnassignedVariable("p"+variableNumber);
                //return false;
            }
        }
        else
        {
            parse = validDistance(tokens[0]);
            if (parse[0])
            {
                // the first distance value
                returned[1] = parse[1];

                // get the next token.  
                if (tokens.length < 5)
                {
                    //TODO:
                    //handleUnexpectedEndOfProgram();
                    //return false;
                }
                parse = validDistance(tokens[1]);

                if (parse[0])
                {
                    // the second distance value
                    returned[2] = 300 - parse[1];
                    returned[0] = true;
                    return returned;
                }
                else if (tokens[1].charAt(0) == 'Y')
                {
                    handleIncompleteProgram(tokens[0]);
                    returned[0] = false;
                    return returned;
                }
                else if (tokens[0].startsWith("X"))
                {
                    handleIncompleteProgram(tokens[0]);
                    returned[0] = false;
                    return returned;
                }
                else
                {
                    returned[0] = false;
                    return returned;
                }
            }
        }

    }
    /*
    Returns -
        index 0: true or false,
    signifying that the token represents a valid distance
    index 1: The first point's x coordinate
    index 2: The first point's y coordinate
    index 3: The second point's x coordinate
    index 4: The second point's y coordinate */
    function validLine(tokens)
    {
        var parse = new Array();
        var returned = new Array();
        if (isValid(tokens[0]) && tokens[0].charAt(0) == 'l')
        {
            if ((l[variableNumber - 1].startX != -1) &&
                (l[variableNumber - 1].startY != -1) &&
                (l[variableNumber - 1].endX != -1) &&
                (l[variableNumber - 1].endY != -1))
            {
                returned[0] = true;
                returned[1] = l[variableNumber - 1].startX;
                returned[2] = l[variableNumber - 1].startY;
                returned[3] = l[variableNumber - 1].endX;
                returned[4] = l[variableNumber - 1].endY;
                return returned;
            }
            else
            {
                / /
                TODO:
                // error: reference to unassigned variable
                //handleUnassignedVariable("l"+variableNumber);
                returned[0] = false;
                return returned;
            }
        }
        else
        {
            parse = validPoint(tokens.slice(0, 2));
            if (parse[0])
            {
                var index;
                // the first point
                returned[1] = parse[1];
                returned[2] = parse[2];
                if (tokens[0].charAt(0) == 'p')
                {
                    index = 1;
                }
                else
                {
                    index = 2;
                }
                // get the next token.  
                if (tokens.length < 2)
                {
                    //TODO:
                    //handleUnexpectedEndOfProgram();
                    returned[0] = false;
                    return returned;
                }
                parse = validPoint(tokens.splice(index, index + 2));
                if (parse[0])
                {
                    // the second point
                    returned[0] = true;
                    returned[3] = parse[1];
                    returned[4] = parse[2];
                    return returned;
                }
                else
                {
                    returned[0]
                    return returned;
                }
            }

            else
            {
                returned[0]
                return returned;
            }
        }
    }

    function validCircle(tokens)
    {
        var index;
        var parse = new Array();
        var returned = new Array();
        if (isValid(tokens[0]) && tokens[0].charAt(0) == 'c')
        {
            if ((c[variableNumber - 1].startX != -1) &&
                (c[variableNumber - 1].startY != -1) &&
                (c[variableNumber - 1].diameter != -1))
            {
                returned[0] = true;
                returned[1] = c[variableNumber - 1].startX;
                returned[2] = c[variableNumber - 1].startY;
                returned[3] = c[variableNumber - 1].diameter;
                return returned;
            }
            else
            {
                // TODO: reference to unassigned variable
                //handleUnassignedVariable("c"+variableNumber);
                returned[0] = false;
                return returned;
            }
        }
        else
        {
            parse = validPoint(tokens);
            if (parse[0])
            {
                // the center point
                returned[1] = parse[1];
                returned[2] = parse[2];
                if (tokens[0].charAt(0) == 'p')
                {
                    index = 1;
                }
                else
                {
                    index = 2;
                }

                // get the next token.  
                if (tokens.length < 2)
                {
                    //TODO:
                    //handleUnexpectedEndOfProgram();
                    returned[0] = false;
                    return returned;
                }
                parse = validDistance(tokens[index]);
                if (parse[0])
                {
                    returned[0] = true;
                    returned[3] = parse[1];
                    return returned;
                }
                else if (tokens[index].equals("RADIUS"))
                {
                
                    handleIncompleteProgram(tokens[index]);
                    returned[0] = false;
                    return returned;
                }
                else
                {
                    returned[0] = false;
                    return returned;
                }
            }
        }
    }

    function validPolygon(tokens)
    {
        var returned = new Array();
        var parse = new Array();
        var isStart = true;
        //used to put tokens into a array,
        //so that validators do not parse tokens as a string.
        var encapsulator = [];
        var i = 0, c = 1, firstX = 0, firstY = 0;
        if (isValid(tokens[0]) && tokens[0].charAt(0) == 'g')
        {
            returned[0] = true;
            returned[1] = g[variableNumber-1].angles;
            return returned;
        }
        while(i+1 < tokens.length)
        {
             // point variable
            if(isValid(tokens[i]) && tokens[i].charAt(0) == 'p')
            {
                encapsulator[0] = tokens[i];
                parse = validPoint(encapsulator);
                i++;
            }
            else // constant
            {
                parse = validPoint(tokens.slice(i, i+2));
                i += 2;
            }
            // transfer to return arrray
            if(parse[0])
            {
                    returned[c++] = new shapes.point(parse[1], parse[2]);
            }
            else // point error
            {
                // handlePointError()
                returned[0] = false;
                return returned;
            }
            // check for end of polygon
            if(isStart)
            {
                isStart = false;
                firstX = parse[1];
                firstY = parse[2];
            }
            else if(firstX == parse[1] && firstY == parse[2]) // its the end, if not continue
            {
                returned[0] = true;
                return returned;
            }
            parse = new Array();
        }
        returned[0] = true;
        return returned;
    }

    /*
    handles cases where the user was expected to provide input, but
    the default placeholder was found instead.
    */
    function handleIncompleteProgram(token)
    {
        alert("\t\t\t         ATTENTION !\n\n"                        + 
                                        "Watson could not successfully run this program "       + 
                                        "since it is incomplete.  The placeholder named "       + 
                                        token + " was encountered during execution.\n\n" + 
                                        "In order to successfully run a Watson graphics "       + 
                                        "program, all uppercase placeholders must first "       + 
                                        "be replaced with the actual code they stand for.\n\n"  + 
                                        "Click on " + token + " to replace this "        + 
                                        "placeholder. ");
    }

    /*
    handles cases where the code's syntax is incorrect
    (should never happen, for debugging purposes)
    */
    function handleSyntaxError(tokens)
    {
        alert("Abnormal Program Termination", 
                                        "\t\t\t         Program Syntactically Incorrect !\n\n"   + 
                                        "A syntax error has been detected while attempting to "  + 
                                        "execute this program.  Please bring this problem to "   + 
                                        "the immediate attention of your instructor.\n\n"        + 
                                        "Details:\n"                                             + 
                                        "The end of program was encountered prematurely while "  + 
                                        "processing a statement or structure.  The most likely " + 
                                        "cause is that the initial program for this activity "   + 
                                        "(located in the source file 'Activities.java') is"      + 
                                        "incorrect.");
    }
    /*
    */
    function handleUnexpectedEndOfProgram(token)
    {
        alert("Abnormal Program Termination" + 
                                        "\t\t\t         Program Syntactically Incorrect !\n\n"       + 
                                        "A syntax error has been detected while attempting to "      + 
                                        "execute this program. \n\n"           + 
                                        "Details:\n"                                                 + 
                                        "An unrecognized or out of place token ==> " + token  + 
                                        "<== \n was encountered.");
    }

    function handleOutOfBoundsError()
    {
        alert("You have create a number which exceeds the dimensions of the canvas.");
    }
    
    //d getter
    function getD() {
        return d;
    }
    
    //p getter
    function getP() {
        return p;
    }
    
    //l getter
    function getL() {
        return l;
    }
    
    //c getter
    function getC() {
        return c;
    }
    
    //g getter
    function getG() {
        return g;
    }

    //gets all declared variables. for use when loading a program in.
    function getVariables() {
        var i = 0;
        var distance = new Array();
        var point = new Array();
        var line = new Array();
        var circle = new Array();
        var polygon = new Array();

        while(editor.rowToArray(i).length > 0) {
            var rowString = code.rowToString(i);
            //Distance variables
            if(rowString != null && rowString.indexOf("Distance") >= 0) {
                var count = rowString.split(",").length;
                for(var j = 0; j < count; j++) distance.push(j);
            }
            else if(rowString != null && rowString.indexOf("Point") >= 0) {
                var count = rowString.split(",").length;
                for(var j = 0; j < count; j++) point.push(j);
            }
            else if(rowString != null && rowString.indexOf("Line") >= 0) {
                var count = rowString.split(",").length;
                for(var j = 0; j < count; j++) line.push(j);
            }
            else if(rowString != null && rowString.indexOf("Circle") >= 0) {
                var count = rowString.split(",").length;
                for(var j = 0; j < count; j++) circle.push(j);
            }
            else if(rowString != null && rowString.indexOf("Polygon") >= 0) {
                var count = rowString.split(",").length;
                for(var j = 0; j < count; j++) polygon.push(j);
            }
            i++;
        }
        variables.setArrays(distance, point, line, circle, polygon);
    }
    
    //Gets objects
    function getObjects(run_walkObj, variablesObj, shapesObj, canvasObj, editorObj, codeObj) {
        run_walk = run_walkObj;
        variables = variablesObj;
        shapes = shapesObj;
        canvas = canvasObj;
        editor = editorObj;
        code = codeObj;
    }
}



