/*
 * 
 * This sets up new Graphics objects
 * 
 */

/* Setup - Sets up a new instance of this application.
 * @param {Number} figNum       - Defines the figure number of this lab. This number is attached to the end
 *                                of every element on the DOM for this lab
 * @param {Number} editorHeight - Sets the height in number of pixels for the code window.
 */
function Setup(figNum, editorHeight) {
    this.retrieveUpdates = retrieveUpdates;
    this.saveExercise = saveExercise;

    //Initialize all variables
    var code = new Code(figNum); //Initialize code
    var variables = new Variables(figNum); //Initialize variables
    var addElements = new AddElements(figNum, editorHeight); //Initialize addElements
    var shapes = new Shapes(figNum); //Initialize shapes
    var run_walk = new Run_walk(figNum); //Initialize run_walk
    var interpreter = new Interpreter(figNum); //Initialize interpreter
    var canvas = new Canvas(figNum); //Initialize canvas

    //Sandbox version
    if(figNum < 0) var editor = new Editor("program_code"+figNum, "graphics", Math.abs(figNum), true, true, 1, true, true, true); //Initialize editor
    //Figure mode
    else var editor = new Editor("program_code"+figNum, "graphics", Math.abs(figNum), true, true, 1, true, false, false); //Initialize editor

    //Retrieves updates made to imbedded exercise
    function retrieveUpdates() {
        editor.loadEditor("program_code-" + figNum, "program_code" + figNum, true);
        interpreter.getVariables();
    }

    //Allows users to save code when working on an embedded exercise
    function saveExercise() {
        editor.saveEditor();
    }
    
    /* ************Pass Objects to other classes*************** */
    
    //Pass needed objects to addElements
    addElements.getObjects(variables, canvas, code, run_walk);
    
    //Pass objects to variables
    variables.getObjects(code, editor);
    
    //Pass objects to code
    code.getObjects(editor, variables);
    
    //Pass objects to canvas
    canvas.getObjects(variables, shapes, code, editor);
    
    //Pass objects to shapes
    shapes.getObjects(variables, canvas);
    
    //Pass objects to run_walk
    run_walk.getObjects(editor, code, canvas, interpreter, variables);
    
    //Pass objects to interpreter
    interpreter.getObjects(run_walk, variables, shapes, canvas, editor, code);

    //To be called when document loads
    $(document).ready(function() {
        interpreter.getVariables();
    });
    
}





