/*******************************************************************************
 * Author:		Neil Vosburg
 * File:		figure.js
 *
 *				This class is responsible for putting code into the editor,
 *				creating and calling on the interpreter to step through
 *				the code.
 *******************************************************************************/
 
function Figure(figureNum) {
	var myInterpreter = null;
	var done = false;
	var intervalID;
	var funcList = [];
	var codeStr;
	var runMode = false;
	var varArr = [];
	var scopeArr = [];
	var thisObj = this;
	var _runButton;
	var _walkButton;
	var figDiv;
	var outputTable;
	var varBox;
	var varTable;
	var editor;
	var editorTable;
	var haltFlag;
	var lastLine = -1;
	var firstMove = true;
	var nextRowInd = 0;
	var slidDown = false;
	var promptInput = "";
	var promptFlag = false;
	var editCellID;
	var defaultPromptInput;
	var attemptingToRun = false;
	var shiftDown = false;
	var dummyVar = 0;
	var showVarBox = true;
	var showScope = false;
	
	this.walkButton = walkButton;
	this.runButton = runButton;
	this.updateVariables = updateVariables;

	figDiv = document.getElementById("fig" + figureNum + "Div");
	figDiv.innerHTML = '<div class="leftcontent" readonly> \
							<p class="Bolded">&nbsp;Program definition</p> \
							<div class="txtarea" style="height:100%; max-height:400px; border-style:ridge;"> \
								<table id="fig' + figureNum + 'Editor" class="codeTable"></table> \
							</div> \
						</div> \
						<div class="rightbuttons" style="height:100%;"> \
								<button type="button" style="margin-left:5%; margin-right: auto; margin-top:5px;" id="fig' + figureNum + 'Run">Run</button> \
								<button type="button" style="margin-right:5%; margin-left: auto; margin-top:5px;" id="fig' + figureNum + 'Walk" onclick="figure' + figureNum + '.walkButton()">Walk</button> \
							</div> \
						<div class="bottomrightcontent" id="fig'+ figureNum + 'OutVarBox"style="clear: left;"> \
							<p class="Bolded">&nbsp;Internal Variables</p> \
							<div id="fig' + figureNum + 'VarBox" class="bottomrighttxtarea"> \
								<table id="fig' + figureNum + 'VarTable" class="normal"></table> \
							</div> \
							</div> \
						<div class="toprightcontent" style="clear: left; "> \
							<p class="Bolded">&nbsp;Program input/output behavior<p> \
							<div id="fig' + figureNum + 'OutputBox" class="bottomrighttxtarea"> \
							<table id="fig' + figureNum + 'OutputTable" class="righttxtarea" style="white-space:nowrap;"></table> \
							</div> \
						</div> ';	
													
	
	outputTable = document.getElementById("fig" + figureNum + "OutputTable");
	var outputBox = document.getElementById("fig" + figureNum + "OutputBox");
	var row = outputTable.insertRow(0);
	var cell = row.insertCell(0);
	nextRowInd++;
	varBox = document.getElementById("fig" + figureNum + "VarBox");
	varTable = document.getElementById("fig" + figureNum + "VarTable");
	editorTable = document.getElementById("fig" + figureNum + "Editor");
	editor = new Editor(editorTable, figureNum);
	codeStr = setupFigure(figureNum);
	_runButton = document.getElementById("fig" + figureNum + "Run");
	_walkButton = document.getElementById("fig" + figureNum + "Walk");
	
	$("#fig" + figureNum + "Run").click(function() {
	    $("#fig" + figureNum + "OutVarBox").slideUp(function() {
			runButton();
			slidDown = false;
	    });
	});
	
	$("#fig" + figureNum + "OutVarBox").slideUp("medium");
	
	/*
	* setupFigure()
	* Sets up the figure depending on the figure number passed to it.
	*
	* Edit the figures assigned to you, and don't worry about doing the ones that I have specified. The editor doesn't allow
	* to declare a variable in a function yet.
	*
	* Editor Interface
	*
	* Create variable declaration: 			editor.addVariable('variable', [ 'variableName', 'TYPE' ]) (TYPE doesn't mean anything really)
	* Create variable declaration (array):	editor.addVariable('array', [ 'arrayName', 'size', 'TYPE']) (again, TYPE doesn't mean anything to the execution)
	* Create assignment:					editor.addOneLineElement('assignment', [ 'varName', 'value' ]) OR editor.addOneLineElement('assignment', [ 'varName', 'varName|literal', '+|-', 'varName|literal'])
	* Write:								editor.addOneLineElement('write', [ '"TEXT"' ])
	* Writeln:								editor.addOneLineElement('writeln', [ '"TEXT"' ])
	* String Prompt:						editor.addOneLineElement('stringPrompt', [ 'varName', '"TEXT"', 'literal' ])
	* Numeric Prompt:						editor.addOneLineElement('numericPrompt', [ 'varName', '"TEXT"', 'literal' ])
	* Function Call:						editor.addOneLineElement('functionCall', [ 'functionName'(,'param1', 'param2', 'param3' ...)) (NOTE: not implemented for more than one parameter yet)
	* Return:								editor.addOneLineElement('return', ['varName|literal'])
	* While Loop:							editor.addWhile([ 'varName', '>|<|>=|<=|==|!=', 'literal|varName']) (NOTE: > must be &gt;, < must be &lt;, etc; look up codes for other symbols
	* For Loop:								editor.addForLoop([ 'varName', 'literal|varName', 'varName', '>|<|>=|<=|==|!=', 'varName|literal', 'varName', '++|--']) (the parameters go in order of the for loop)
	* If..Then:								editor.addIfThen(([ 'varName|literal', '>|<|>=|<=|==|!=', 'varName|literal'])
	* If..Else:								editor.addIfElse(([ 'varName|literal', '>|<|>=|<=|==|!=', 'varName|literal'])
	* Add Function:							editor.addFunction([ 'functionName'(, 'param1', 'param2', 'param3' ...), 'comment'])
	*
	* Increment Selected Row (by 1):		editor.incSelRow();
	* Decrement Selected Row (by 1):		editor.decSelRow();
	*
	* NOTES:	The selected row is where the editor is going to insert the next line. The selected row will always be the last line after the code you insert. Therefore, after a one line element,
	*			the next line is automatically selected. However, for an IfElse() statement, you must decrement the selected row four times to get inside the IF brackets before adding
	*			code (see figure 22). If you are unsure, just add your code and see where it pops up inside the editor and then adjust as needed. Lastly, always make sure the selected row is
	*			the last empty row when you finish implementing your figure. See the example figures to see how I always incremented the selected row at the end.
	*
	*			The variables may not show up correctly at the moment in the variables box. I'm aware of this. We will get a fix for this soon, hopefully. If there are any bugs, do what you can
	*			and let me know. The most important thing is to just make sure your code looks right in the editor. Please feel free to ask me if you have any questions, problems, or concerns.
	*/
	function setupFigure(figureNum) {
		if (figureNum == 5) {	// no bugs reported
			// figure 5 code
			editor.addOneLineElement('write', ['"There are "']);
			editor.addOneLineElement('write', ['12 + 1']);
			editor.addOneLineElement('write', ['" cookies in a baker\'s dozen."']);
			showVarBox = false;
		}
		else if (figureNum == 6) {	// no bugs reported
			// figure 6 code
			editor.addVariable('variable', ['firstName', 'TEXT']);
			editor.addOneLineElement('stringPrompt', ['firstName', '"Please enter your first name."', '""']);
			editor.addOneLineElement('write', ['"Hello "']);
			editor.addOneLineElement('write', ['firstName']);
			editor.addOneLineElement('writeln', ['". Nice to meet you."']);
		}
		else if (figureNum == 7) {
			// figure 7 code
			editor.addVariable('variable', [ 'firstNum', 'NUMERIC' ]);
			editor.addVariable('variable', [ 'secondNum', 'NUMERIC' ]);
			editor.addOneLineElement('numericPrompt', [ 'firstNum', '"Enter a number."', '0' ]);
			editor.addOneLineElement('numericPrompt', [ 'secondNum', '"Enter another number."', '0' ]);
			editor.addOneLineElement('write', ['"Guess what? The sum of "']);
			editor.addOneLineElement('write', ['firstNum']);
			editor.addOneLineElement('write', ['" and "']);
			editor.addOneLineElement('write', ['secondNum']);
			editor.addOneLineElement('write', ['" is "']);
			editor.addOneLineElement('write', ['firstNum + secondNum']);
			editor.addOneLineElement('writeln', ['"."']);
		}
		else if (figureNum == 10) {	// no bugs reported
			// figure 10 code (not sure if mike will keep this one, but let's do it anyway)
			editor.addVariable('variable', [ 'x', 'NUMERIC' ]);
			editor.addVariable('variable', [ 'y', 'NUMERIC' ]);
			editor.addVariable('variable', [ 'z', 'NUMERIC' ]);
			editor.addOneLineElement('assignment', [ 'x', '5' ]);
			editor.addOneLineElement('assignment', [ 'x', 'x', '+', '1' ]);
			editor.addOneLineElement('assignment', [ 'y', '3' ]);
			editor.addOneLineElement('assignment', [ 'z', 'x', '+', 'y' ]);
			editor.addOneLineElement('assignment', [ 'y', 'y', '-', '2' ]);
			editor.addOneLineElement('writeln', ['x + y + z']);
		}
		else if (figureNum == 12) {
            //Figure 12 code inserted by Weston Cossey
            editor.addVariable('variable', ['age', 'NUMERIC']);
            editor.addOneLineElement('numericPrompt', ['age', '"Enter your age."', '0']);
            editor.addIfElse([ 'age', '<', '21']);
            editor.decSelRow();
            editor.decSelRow();
            editor.decSelRow();
            editor.decSelRow();
            editor.addOneLineElement('writeln', ['"No beer for you."']);
            editor.incSelRow();
            editor.incSelRow();
            editor.incSelRow();
            editor.addOneLineElement('writeln', ['"Here, have a cold one!"']);
		}
		else if (figureNum == 13) {	// no bugs reported
			// figure 13 code
			editor.addVariable('variable', [ 'num', 'NUMERIC' ]);
			editor.addOneLineElement('numericPrompt', [ 'num', '"Enter a number."', '0' ]);
			editor.addOneLineElement('write', ['"The absolute value of the "']);
			editor.addIfElse(['num', '&lt;', '0']);
			for (var i = 0; i < 4; i++) editor.decSelRow();
			editor.addOneLineElement('write', ['"negative number, "']);
			editor.addOneLineElement('write', ['num']);
			editor.addOneLineElement('write', ['", is "']);
			editor.addOneLineElement('write', ['0-num']);
			for (var i = 0; i < 3; i++) editor.incSelRow();
			editor.addOneLineElement('write', ['"nonnegative number, "']);
			editor.addOneLineElement('write', ['num']);
			editor.addOneLineElement('write', ['", is "']);
			editor.addOneLineElement('write', ['num']);
			editor.incSelRow();
			editor.addOneLineElement('write', ['"."']);
		}
		else if (figureNum == 14) {	// no bugs reported
			// figure 14 code
			editor.addVariable('variable', ['age', 'NUMERIC']);
			editor.addVariable('variable', ['income', 'NUMERIC']);
			editor.addOneLineElement('numericPrompt', ['age','"Enter your age."','0']);
			editor.addOneLineElement('numericPrompt', ['income','"Now, enter your income."','0']);
			editor.addIfElse(['age', '<', '25']);
			for (var i = 0; i < 4; i++) editor.decSelRow();
			editor.addIfElse(['income', '>=', '50000']);
			for (var i = 0; i < 4; i++) editor.decSelRow();
			editor.addOneLineElement('writeln', ['"You\'re a baller!"']);
			for (var i = 0; i < 3; i++) editor.incSelRow();
			editor.addOneLineElement('writeln', ['"You\'re too poor to be a baller."']);
			for (var i = 0; i < 4; i++) editor.incSelRow();
			editor.addIfElse(['income', '>=', '50000']);
			for (var i = 0; i < 4; i++) editor.decSelRow();
			editor.addOneLineElement('writeln', ['"You\'re too old to be a baller."']);
			for (var i = 0; i < 3; i++) editor.incSelRow();
			editor.addOneLineElement('writeln', ['"You\'re too old and poor."']);
			editor.showLineCount(true);
		}
		else if (figureNum == 16) {
			// figure 16 code (not sure about this one either, but let's do it)
			editor.addVariable('variable', [ 'age', 'NUMERIC' ]);
			editor.addOneLineElement('numericPrompt', [ 'age', '"Enter your age."', '0' ]);
			editor.addOneLineElement('write', ['"You are "']);
			editor.addIfThen(['age', '>=', '18']);
			editor.decSelRow();
			editor.addOneLineElement('write', ['"not "']);
			editor.incSelRow();
			editor.addOneLineElement('writeln', ['"a minor."']);
		}
		else if (figureNum == 18) {	// no bugs reported
			// figure 18 code
			editor.addVariable('variable', ['total', 'NUMERIC']);
			editor.addVariable('variable', ['newvalue','NUMERIC']);
			editor.addOneLineElement('assignment', ['total', '0']);
			editor.addOneLineElement('numericPrompt', ['newvalue', '"Enter a positive number, or a -1 to quit."', '0']);
			editor.addWhile(['newvalue', '&gt;=', '0']);
			editor.decSelRow();
			editor.addOneLineElement('assignment', ['total', 'total', '+', 'newvalue']);
			editor.addOneLineElement('write', ['"The total so far is..."']);
			editor.addOneLineElement('writeln', ['total']);
			editor.addOneLineElement('numericPrompt', ['newvalue', '"Enter a number to add to the total, or a -1 to quit."', '0']);
			editor.incSelRow();
			editor.addOneLineElement('write', ['"The final total is... "']);
			editor.addOneLineElement('writeln', ['total']);
			editor.showLineCount(true);
		}
		else if (figureNum == 19) {
            //Figure 19 code inserted by Weston Cossey
            editor.addVariable('variable', ['n', 'NUMERIC']);
            editor.addVariable('variable', ['total', 'NUMERIC']);
            editor.addVariable('variable', ['counter', 'NUMERIC']);
            editor.addVariable('variable', ['newvalue', 'NUMERIC']);
            editor.addOneLineElement('numericPrompt', ['n', '"How many numbers are to be added together?"', '0']);
            editor.addOneLineElement('assignment', ['total', '0']);
            editor.addOneLineElement('assignment', ['counter', '1']);
            editor.addWhile(['counter', '<=', 'n']);
            editor.decSelRow();
            editor.addOneLineElement('write', ['"The total so far is... "']);
            editor.addOneLineElement('writeln', ['total']);
            editor.addOneLineElement('numericPrompt', ['newvalue', '"Enter a number to add to the total."', '0']);
            editor.addOneLineElement('assignment', ['total', 'total', '+', 'newvalue']);
            editor.addOneLineElement('assignment', ['counter', 'counter', '+', '1']);
            editor.incSelRow();
            editor.addOneLineElement('write', ['"The final total is... "']);
            editor.addOneLineElement('writeln', ['total']);
			editor.showLineCount(true);
		}
		else if (figureNum == 21) {	// fixed counter issue
			// figure 21 code
			editor.addVariable('variable', [ 'n', 'NUMERIC' ]);
			editor.addVariable('variable', [ 'total', 'NUMERIC' ]);
			editor.addVariable('variable', [ 'counter', 'NUMERIC' ]);
			editor.addVariable('variable', [ 'newValue', 'NUMERIC' ]);
			editor.addOneLineElement('numericPrompt', [ 'n', '"How many numbers are to be added together?"', '0' ]);
			editor.addOneLineElement('assignment', [ 'total', '0' ]);
			editor.addFor([ 'counter', '1', 'counter', '&lt;=', 'n', 'counter', '++' ]);
			editor.decSelRow();
			editor.addOneLineElement('write', ['"The total so far is... "']);
			editor.addOneLineElement('writeln', ['total']);
			editor.addOneLineElement('numericPrompt', [ 'newValue', '"Enter a number to add to the total."', '0' ]);
			editor.addOneLineElement('assignment', ['total', 'total', '+', 'newValue']);
			editor.incSelRow();
			editor.addOneLineElement('write', ['"The final total is... "']);
			editor.addOneLineElement('writeln', ['total']);
			editor.showLineCount(true);
		}
		else if (figureNum == 22) {	// no bugs reported
			editor.addVariable('variable', [ 'numberOfGrades', 'NUMERIC' ]);
			editor.addVariable('variable', [ 'total', 'NUMERIC' ]);
			editor.addVariable('variable', [ 'i', 'NUMERIC' ]);
			editor.addVariable('variable', [ 'grade', 'NUMERIC' ]);
			editor.addVariable('variable', [ 'average', 'NUMERIC' ]);
			editor.addOneLineElement('numericPrompt', [ 'numberOfGrades', '"Enter the number of grades."', '0' ]);
			editor.addOneLineElement('assignment', [ 'total', '0' ]);
			editor.addFor([ 'i', '1', 'i', '&lt;=', 'numberOfGrades', 'i', '++' ]);
			editor.decSelRow();
			editor.addOneLineElement('numericPrompt', [ 'grade', '"Enter a grade."', '0' ]);
			editor.addOneLineElement('write', ['"Grade "']);
			editor.addOneLineElement('write', ['i']);
			editor.addOneLineElement('write', ['": "']);
			editor.addOneLineElement('writeln', ['grade']);
			editor.addOneLineElement('assignment', ['total', 'total', '+', 'grade']);
			editor.incSelRow();
			editor.addOneLineElement('write', ['"The average of the grades is "']);
			editor.addIfElse(['numberOfGrades', '&gt;', '0']);
			for (var i = 0; i < 4; i++) editor.decSelRow();
			editor.addOneLineElement('assignment', [ 'average', 'total', '/', 'numberOfGrades']);
			editor.addOneLineElement('write', ['average']);
			for (var i = 0; i < 3; i++) editor.incSelRow();
			editor.addOneLineElement('writeln', ['"undefined"']);
			editor.incSelRow();
			editor.showLineCount(true);
		}
		else if (figureNum == 23) {	// fixed for loop counter issue
			// figure 23 code
			editor.addVariable('variable', ['i', 'NUMERIC']);
			editor.addVariable('variable', ['j', 'NUMERIC']);
			editor.addVariable('variable', ['product', 'NUMERIC']);
			editor.addFor([ 'i', '1', 'i', '&lt;=', '12', 'i', '++' ]);
			editor.decSelRow();
			editor.addOneLineElement('writeln', ['""']);
			editor.addFor([ 'j', '1', 'j', '&lt;=', '12', 'j', '++' ]);
			editor.decSelRow();
			editor.addOneLineElement('assignment', ['product','i', '*', 'j']);
			editor.addOneLineElement('write', ['i']);
			editor.addOneLineElement('write', ['" times "']);
			editor.addOneLineElement('write', ['j']);
			editor.addOneLineElement('write', ['" equals "']);
			editor.addOneLineElement('writeln', ['product']);
		}
		else if (figureNum == 24) {	// no bugs reported
			editor.addVariable('variable', ['count', 'NUMERIC']);
			editor.addOneLineElement('numericPrompt', ['count', '"How many bottles?"', '0']);
			editor.addWhile(['count', '&gt;', '0']);
			editor.decSelRow();
			editor.addOneLineElement('write', ['count']);
			editor.addOneLineElement('writeln', ['" bottles of beer on the wall,"']);
			editor.addOneLineElement('write', ['count']);
			editor.addOneLineElement('writeln', ['" bottles of beer."']);
			editor.addOneLineElement('writeln', ['"Take one down. Pass it around."']);
			editor.addOneLineElement('assignment', ['count', 'count', '-', '1']);
			editor.addOneLineElement('write', ['count']);
			editor.addOneLineElement('writeln', ['" bottles of beer on the wall."']);
			editor.addOneLineElement('writeln', ['" "']);
			editor.incSelRow();
		}
		else if (figureNum == 27) {
			editor.addVariable('variable', ['a', 'NUMERIC']);
			editor.addVariable('variable', ['b', 'NUMERIC']);
			editor.addFunction(['power', 'x', 'Numeric', 'y', 'Numeric', 'Returns numeric']);
			for (var i = 0; i < 2; i++) editor.decSelRow();
			editor.addVariable('variable', [ 'z', 'NUMERIC' ]);
			editor.addVariable('variable', [ 'i', 'NUMERIC' ]);
			//editor.addOneLineElement('blank');
			editor.addOneLineElement('assignment', [ 'z', '1' ]);
			editor.addFor([ 'i', '1', 'i', '&lt;=', 'y', 'i', '++']);
			editor.decSelRow();
			editor.addOneLineElement('assignment', [ 'z', 'z', '*', 'x' ]);
			editor.incSelRow();
			editor.addOneLineElement('return', [ 'z' ]);
			for (var i = 0; i < 3; i++) editor.incSelRow();
			editor.addOneLineElement('numericPrompt', [ 'a', '"Enter a value."', '0' ]);
			editor.addOneLineElement('assignmentFuncCall', [ 'b', 'power', 'a', '3' ]);
			editor.addOneLineElement('write', [ 'a' ]);
			editor.addOneLineElement('write', [ '" raised to the third power is "' ]);
			editor.addOneLineElement('write', [ 'b']);
			showScope = true;
			editor.showLineCount(true);
		}
		else if (figureNum == 28) {
			editor.addVariable('variable', ['a', 'NUMERIC']);
			editor.addVariable('variable', ['b', 'NUMERIC']);
			editor.addVariable('variable', ['c', 'NUMERIC']);
			editor.addVariable('variable', ['d', 'NUMERIC']);
			editor.addVariable('variable', ['x', 'NUMERIC']);
			editor.addVariable('variable', ['y', 'NUMERIC']);
			editor.addFunction(['power', 'x', 'Numeric', 'y', 'Numeric', 'Returns numeric']);
			for (var i = 0; i < 2; i++) editor.decSelRow();
			editor.addVariable('variable', [ 'z', 'NUMERIC' ]);
			editor.addVariable('variable', [ 'i', 'NUMERIC' ]);
			//editor.addOneLineElement('blank');
			editor.addOneLineElement('assignment', [ 'z', '1' ]);
			editor.addFor([ 'i', '1', 'i', '&lt;=', 'y', 'i', '++']);
			editor.decSelRow();
			editor.addOneLineElement('assignment', [ 'z', 'z', '*', 'x' ]);
			editor.incSelRow();
			editor.addOneLineElement('return', [ 'z' ]);
			for (var i = 0; i < 3; i++) editor.incSelRow();
			editor.addOneLineElement('numericPrompt', [ 'x', '"Enter a value."', '0' ]);
			editor.addOneLineElement('numericPrompt', [ 'a', '"Enter a value."', '0' ]);
			editor.addOneLineElement('numericPrompt', [ 'b', '"Enter a value."', '0' ]);
			editor.addOneLineElement('numericPrompt', [ 'c', '"Enter a value."', '0' ]);
			editor.addOneLineElement('numericPrompt', [ 'd', '"Enter a value."', '0' ]);
			editor.addOneLineElement('freeExpression', [ 'y&nbsp;', '=&nbsp;', 'a&nbsp;', '*&nbsp;', 'power(', 'x', ',', '3', ')&nbsp;',
										'+&nbsp;', 'b&nbsp;', '*&nbsp;', 'power(', 'x', ',', '2', ')&nbsp;',
										'+&nbsp;', 'c&nbsp;', '*&nbsp;', 'x&nbsp;', '+&nbsp;', 'd', ';']);
			editor.addOneLineElement('write', [ '"A*X**3 + B*X**2 + C*X + D = "']);
			editor.addOneLineElement('writeln', [ 'y' ]);
			showScope = true;
			editor.showLineCount(true);
		}
		else if (figureNum == 29) {
			// figure 29 code
			editor.addVariable('variable', [ 'count', 'NUMERIC' ]);
			editor.addFunction(['singsong', 'beers', 'Numeric', 'Returns nothing']);
			editor.decSelRow();
			editor.decSelRow();
			editor.addWhile(['beers', '>', '0']);
			editor.decSelRow();
			editor.addOneLineElement('write', ['beers']);
			editor.addOneLineElement('writeln', ['" bottles of beer on the wall,"']);
			editor.addOneLineElement('write', ['beers']);
			editor.addOneLineElement('writeln', ['" bottles of beer."']);
			editor.addOneLineElement('writeln', ['"Take one down. Pass it around."']);
			editor.addOneLineElement('assignment', [ 'beers', 'beers', '-', '1']);
			editor.addOneLineElement('write', ['beers']);
			editor.addOneLineElement('writeln', ['" bottles of beer on the wall."']);
			editor.addOneLineElement('writeln', ['" "']);
			editor.incSelRow();
			editor.addDummyLine();
			editor.incSelRow();
			editor.incSelRow();
			editor.incSelRow();
			editor.addOneLineElement('numericPrompt', ['count', '"How many bottles?"', '0']);
			editor.addOneLineElement('functionCall', ['singsong', 'count' ]);
			editor.addOneLineElement('writeln', ['"Later..."']);
			showScope = true;
			editor.showLineCount(true);
		}
		else if (figureNum == 30) {	// no bugs reported
			editor.addVariable('variable', ['count', 'NUMERIC']);
			editor.addFunction(['singsong', 'beers', 'Numeric', 'Returns nothing']);
			editor.decSelRow(); editor.decSelRow();
			editor.addIfThen(['beers', '&gt;', '0']);
			editor.decSelRow();
			editor.addOneLineElement('write', ['beers']);
			editor.addOneLineElement('writeln', ['" bottles of beer on the wall,"']);
			editor.addOneLineElement('write', ['beers']);
			editor.addOneLineElement('writeln', ['" bottles of beer."']);
			editor.addOneLineElement('writeln', ['"Take one down. Pass it around."']);
			editor.addOneLineElement('assignment', ['beers', 'beers', '-', '1']);
			editor.addOneLineElement('write', ['beers']);
			editor.addOneLineElement('writeln', ['" bottles of beer on the wall."']);
			editor.addOneLineElement('writeln', ['" "']);
			editor.addOneLineElement('functionCall', ['singsong', 'beers' ]);
			editor.incSelRow();
			editor.addDummyLine();
			//editor.addOneLineElement('writeln', ['"test"']);
			for (var i = 0; i < 3; i++) editor.incSelRow();
			editor.addOneLineElement('numericPrompt', ['count', '"How many bottles?"', '0']);
			editor.addOneLineElement('functionCall', ['singsong', 'count' ]);
			editor.addOneLineElement('writeln', ['"Later..."']);
			showScope = true;
			editor.showLineCount(true);
		}
		else if (figureNum == 32) {	// no bugs reported
			// figure 32 code
			
			editor.addVariable('variable', ['count', 'NUMERIC']);
			editor.addFunction(['singsong', 'beers', 'Numeric',	'Returns nothing']);
			editor.decSelRow(); editor.decSelRow();
			editor.addIfElse(['beers', '&gt;', '0']);
			for (var i = 0; i < 4; i++) editor.decSelRow();
			editor.addOneLineElement('write', ['beers']);
			editor.addOneLineElement('writeln', ['" bottles of beer on the wall,"']);
			editor.addOneLineElement('write', ['beers']);
			editor.addOneLineElement('writeln', ['" bottles of beer."']);
			editor.addOneLineElement('writeln', ['"Take one down. Pass it around."']);
			editor.addOneLineElement('assignment', ['beers', 'beers', '-', '1']);
			editor.addOneLineElement('write', ['beers']);
			editor.addOneLineElement('writeln', ['" bottles of beer on the wall."']);
			editor.addOneLineElement('writeln', ['" "']);
			editor.addOneLineElement('functionCall', ['singsong', 'beers' ]);
			editor.addOneLineElement('writeln', ['"Hic. "']);
			for (var i = 0; i < 3; i++) editor.incSelRow();
			editor.addOneLineElement('writeln', ['"We\'re out of beer."']);
			editor.incSelRow();
			editor.addDummyLine();
			for (var i = 0; i < 3; i++) editor.incSelRow();
			editor.addOneLineElement('numericPrompt', ['count', '"How many bottles?"', '0']);
			editor.addOneLineElement('functionCall', ['singsong', 'count' ]);
			editor.addOneLineElement('writeln', ['"Later..."']);
			showScope = true;
			editor.showLineCount(true);
		}
		else if (figureNum == 38) {
			editor.addVariable('variable', [ 'TOP', 'NUMERIC' ]);
			editor.addVariable('array', [ 'STACK', '100', 'NUMERIC']);
			editor.addFunction([ 'push', 'item', 'Numeric', 'Returns nothing' ]);
			for (var i = 0; i < 2; i++) editor.decSelRow();
			editor.addIfThen(['TOP', '&lt;', '99']);
			editor.decSelRow();
			editor.addOneLineElement('assignment', ['TOP', 'TOP', '+', '1']);
			editor.addOneLineElement('arrayAssignment', ['STACK', 'TOP', 'item']);
			for (var i = 0; i < 1; i++) editor.incSelRow();
			editor.addFunction([ 'pop', 'Returns Numeric' ]);
			for (var i = 0; i < 4; i++) editor.incSelRow();
			editor.addVariable('variable', [ 'item', 'NUMERIC' ]);
			editor.addIfElse([ 'TOP', '&gt;=', '0' ]);
			for (var i = 0; i < 4; i++) editor.decSelRow();
			editor.addOneLineElement('assignment', [ 'item', 'STACK', 'TOP' ]);
			editor.addOneLineElement('assignment', [ 'TOP', 'TOP', '-', '1']);
			editor.addOneLineElement('return', [ 'item' ]);
			for (var i = 0; i < 3; i++) editor.incSelRow();
			editor.addOneLineElement('return', [ '0' ]);
			for (var i = 0; i < 4; i++) editor.incSelRow();
			editor.addOneLineElement('assignment', [ 'TOP', '-1' ]);
			editor.addOneLineElement('functionCall', [ 'push', '10' ]);
			editor.addOneLineElement('functionCall', [ 'push', '20' ]);
			editor.addOneLineElement('functionCall', [ 'push', '30' ]);
			editor.addOneLineElement('writeln', [ 'pop()' ]);
			editor.addOneLineElement('writeln', [ 'pop()' ]);
			editor.addOneLineElement('writeln', [ 'pop()' ]);
			showScope = true;
			editor.showLineCount(true);
		}
		

		codeStr = editor.getEditorText();

		return codeStr;
	}

	function init(interpreter, scope) {

		var wrapper = function (text) {
			text = text ? text.toString() : '';
			return interpreter.createPrimitive(alert(text));
		};
		interpreter.setProperty(scope, 'alert', interpreter.createNativeFunction(wrapper));

		var wrapper2 = function (text1, text2) {
			text1 = text1 ? text1.toString() : '';
			text2 = text2 ? text2.toString() : '';
			//return interpreter.createPrimitive(promptFunc(text1, text2));
			return interpreter.createPrimitive(stopPrompt())
		}
		interpreter.setProperty(scope, 'prompt', interpreter.createNativeFunction(wrapper2));

		var wrapper3 = function (text) {
			text = text ? text.toString() : '';
			//return interpreter.createPrimitive(outputTable.value += text);
			return interpreter.createPrimitive(outputWrite(text));
		};
		interpreter.setProperty(scope, 'document1write', interpreter.createNativeFunction(wrapper3));

		var wrapper4 = function (text) {
			text = text ? text.toString() : '';
			//return interpreter.createPrimitive(outputTable.value += text + "\n");
			return interpreter.createPrimitive(outputWriteln(text));
		};
		interpreter.setProperty(scope, 'document1writeln', interpreter.createNativeFunction(wrapper4));

		var wrapper5 = function () {	
			//return interpreter.createPrimitive(outputTable.value += text + "\n");
			return interpreter.createPrimitive(dummyVar++);
		};
		interpreter.setProperty(scope, 'dummyFunction', interpreter.createNativeFunction(wrapper5));
	};
	
	function outputWrite(text) {
		var cell = outputTable.rows[outputTable.rows.length - 1].cells[0];
		cell.setAttribute("style", "height:15px");
		cell.textContent += text;
	}
	
	function outputWriteln(text) {
		if (text == " ") text = " ";
		var cell = outputTable.rows[outputTable.rows.length - 1].cells[0];
		cell.setAttribute("style", "height:1em");
		cell.textContent += text;
		var row = outputTable.insertRow(outputTable.rows.length);
		row.insertCell(0);
	}
	
	function stopPrompt() {
		var temp = promptInput;
		promptInput = "";
		return temp;
	}

	function promptFunc(promptType, promptStr, defaultStr) {
		var cell = outputTable.rows[outputTable.rows.length - 1].cells[0];
		cell.setAttribute("style", "height:1em");
		cell.textContent += promptStr.slice(1, promptStr.length - 1);
		var row = outputTable.insertRow(outputTable.rows.length);
		row.insertCell(0);
		cell.contentEditable = false;
		
		cell = outputTable.rows[outputTable.rows.length - 1].cells[0];
		cell.style.color = "red";
		cell.contentEditable = true;

		var id = "fig" + figureNum + "TD" + (outputTable.rows.length - 1);
		cell.setAttribute("id", id);
		cell.setAttribute("type", "number");
		editCellID = id;
		
		if (defaultStr.charAt(0) == '"') {
			if (defaultStr.length == 2) defaultPromptInput = "";
			else defaultPromptInput = defaultStr.slice(1, defaultStr.length - 1);
		}
		else defaultPromptInput = defaultStr;
		
		if (promptType == "numeric") setupNumericPrompt(id);
		else setupStringPrompt(id);
		
		$('#' + id).focus();
		row = outputTable.insertRow(outputTable.rows.length);
		row.insertCell(0);
		
		return promptInput;
	}
	
	function setupNumericPrompt(id) {
		$("#" + id).keyup(function (event) {
			var code = event.which || event.keyCode;
			if (code == 16) {
				shiftDown = false;	// since this is key up, shift down is now false
			}
			
			promptInput = document.getElementById(id).textContent;	// update the prompt input upon each key up
		});
	
		$("#" + id).keydown(function (event) {
			var code = event.which || event.keyCode;
			if (code == 16) {
				shiftDown = true;	// shift key, don't allow anything while this is held down
			}
			else if (code == 8 || (code >= 37 && code <= 57) || (code >= 96 && code <= 105)) {
				// allow this
			}
			else if (code == 109 || code == 189 || code == 173) {	// a dash (negative number possibility)
				if (promptInput.length != 0) { event.preventDefault(); return; } // only allow a dash at the 0 index position
			}
			else if (code == 110 || code == 190) {	// a period was pressed for a decimal point
				if (promptInput.indexOf(".") >= 0) { event.preventDefault(); return } // a decimal point already exists; there can't be another
				else { /* allow it go through; do nothing */ }
			}
			else if (code == 10 || code == 13) {
				// enter key, allow it for now (will be caught by key press)
			}
			else event.preventDefault();
		});
	
		$("#" + id).keypress(function (event) {
			var cell = document.getElementById(id);
			var code = event.which || event.keyCode;
			if (shiftDown == true) {
				event.preventDefault();	// if shift is down, ignore the key regardless of key code
				return;
			}	
			
			if (code == 10 || code == 13) {	// enter key was pressed
				event.preventDefault();
				if (cell.textContent == "" || cell.textContent.length == 0) {
					promptInput = defaultPromptInput;
					cell.textContent += defaultPromptInput;
					//alert("You should probably enter some input first!");
					//return;
				}
				
				cell.contentEditable = false;
				promptFlag = false;
				
				if (runMode == true || attemptingToRun == true) { attemptingToRun = false; runMode = false; runButton(); }
				else { walkButton(); }
			}
		});
	}
	
	function setupStringPrompt(id) {
		$("#" + id).keyup(function (event) {	
			promptInput = document.getElementById(id).textContent;	// update the prompt input upon each key up
		});
	
		$("#" + id).keydown(function (event) {
			var code = event.which || event.keyCode;
			if (code == 10 || code == 13) {
				// enter key, allow it for now (will be caught by key press)
			}
		});
	
		$("#" + id).keypress(function (event) {
			var cell = document.getElementById(id);
			var code = event.which || event.keyCode;	
			
			if (code == 10 || code == 13) {	// enter key was pressed
				event.preventDefault();
				if (cell.textContent == "" || cell.textContent.length == 0) {
					promptInput = defaultPromptInput;
					cell.textContent += defaultPromptInput;
					//alert("You should probably enter some input first!");
					//return;
				}
				
				cell.contentEditable = false;
				promptFlag = false;
				
				if (runMode == true || attemptingToRun == true) { attemptingToRun = false; runMode = false; runButton(); }
				else { walkButton(); }
			}
		});
	}
	
	function appendOutput(question, text) {
		var cell = outputTable.rows[outputTable.rows.length - 1].cells[0];
		cell.setAttribute("style", "height:1em");
		cell.textContent += question;
		var row = outputTable.insertRow(outputTable.rows.length);
		row.insertCell(0);
		
		cell = outputTable.rows[outputTable.rows.length - 1].cells[0];
		cell.setAttribute("style", "height:1em");
		cell.innerHTML += "<font color='red'><b><i>" + text + "</b></i></font>";
		row = outputTable.insertRow(outputTable.rows.length);
		row.insertCell(0);
	}

	function parseButton() {
		var code = document.getElementById('code').value
			myInterpreter = new Interpreter(code, init);
		disable('');
	}
	
	function walkButton() {
		if (done == true) { reset(); return; }
		if (attemptingToRun == true || runMode == true) {
			outputTable.innerHTML = "";
			varTable.innerHTML = "";
			slideVarBox("up");
			reset();
			return;
		}
		
		//if (checkIfPrompt(true) == true) return;
		var editCell = document.getElementById(editCellID);
		if (promptFlag == true && promptInput.length == 0) {
			promptInput = defaultPromptInput;
			if (editCell) editCell.textContent += promptInput;
			promptFlag = false;
		}
		else promptFlag = false;
		
		if (editCell) editCell.contentEditable = false;
		
		slideVarBox("down");
		
		if (myInterpreter === null) myInterpreter = new Interpreter(codeStr, init, thisObj);
		if (runMode == true) {
			clearInterval(intervalID);
			runMode = false;
			_runButton.textContent = "Run";
			slideVarBox("down");
			return;
		}
		while (walk() == false) { }
	}
	
	function runButton() {
		if (done) reset();
	
		if (runMode == true) {
			clearInterval(intervalID);
			_runButton.textContent = "Run";
			_walkButton.textContent = "Walk";
			runMode = false;
			slideVarBox("down");
			
			return;
		}
		else {
			if (attemptingToRun == false && checkIfPrompt() == true) {
				$("#" + editCellID).focus();
				attemptingToRun = true;
				_runButton.textContent = "Pause";
				_walkButton.textContent = "Reset";
				return;
			}
			else if (attemptingToRun == true && checkIfPrompt() == true) {
				attemptingToRun = false;
				_runButton.textContent = "Run";
				_walkButton.textContent = "Walk";
				slideVarBox("down");
				return;
			}
			else if (attemptingToRun == true) {
				attemptingToRun = false;
				_runButton.textContent = "Run";
				_walkButton.textContent = "Walk";
				runMode = false;
				slideVarBox("down");
				return;
			}
		}
		
		_walkButton.textContent = "Reset";
		_runButton.textContent = "Pause";
		if (myInterpreter === null) myInterpreter = new Interpreter(codeStr, init, thisObj);
		
		runMode = true;
		intervalID = setInterval(walk, 100);
	}
	
	function slideVarBox(dir) {
		if (showVarBox == false) return;
		
		if (!slidDown && dir == "down") {
			$("#fig" + figureNum + "OutVarBox").slideDown("medium", function() {
				varBox.scrollTop = varBox.scrollHeight;
				slidDown = true;
			});
		}
		else if (slidDown && dir == "up") {
			$("#fig" + figureNum + "OutVarBox").slideUp("medium");
			slidDown = false;
		}
	}
	
	function walk() {
		var res;
		var node;
		var start;
		var end;
		var flag = false;
		var status;
		
		if (done == true) {
			_runButton.textContent = "Run";
			reset();
			return true;
		}
		
		if (firstMove == true) {
			outputTable.innerHTML = "";
			var row = outputTable.insertRow(0);
			row.insertCell(0);
			
			clearTable();
			firstMove = false;
		}

		while (flag == false) {
			var promptRes = editor.checkPromptFlag();
			if (promptRes[0] == true) {
				promptFunc(promptRes[1], promptRes[2], promptRes[3]);
				haltFlag = true;
				promptFlag = true;
				if (runMode == true) clearInterval(intervalID);
			}
			
			if (myInterpreter.step() == false) {
				flag = true;
				done = true;
				start = -1;
				end = -1;
			}
			else {
				pollVariables();

				if (myInterpreter.stateStack[0]) {
					node = myInterpreter.stateStack[0].node;
					start = node.start;
					end = node.end;
				}
			}
			
			status = editor.isNewLine(start, end);
			if (haltFlag == true) {
				editor.selectLine(status[1]);
				haltFlag = false;
				break;
			}
			else {
				if (status[0] == true) {
					editor.selectLine(status[1]);
					flag = true;
				}
			}
			
		}

		outputBox.scrollTop = outputBox.scrollHeight;
		varBox.scrollTop = varBox.scrollHeight;

		return true;
	}

	function checkIfPrompt() {
		if (promptFlag == true && (promptInput == "" || promptInput.length == 0)) {
			$('#' + editCellID).focus();
			return true;
		}
		else if (promptFlag == true && promptInput != "") {
			promptFlag = false;
			return false;
		}
	}
	
	function reset() {
		_runButton.textContent = "Run";
		_walkButton.textContent = "Walk";
		promptFlag = false;
		haltFlag = false;
		attemptingToRun = false;
		done = false;
		runMode = false;
		varArr = [];
		scopeArr = [];
		clearInterval(intervalID);
		myInterpreter = null;
		editor.reset();
		firstMove = true;
	}
	
	function updateVariables(mode, scope, leftValue, rightValue) {
		var found = false;
		if (mode == "add") {
			for (var i = 0; i < varArr.length; i++) {
				if (scope == varArr[i][0] && (varArr[i][1] == leftValue || varArr[i][1].data == leftValue)) {
					if (varArr[i].length == 2) varrArr[i].push(rightValue);
					else varArr[i][3] = rightValue;
					found = true;
					break;
				}
			}
			if (!found) {
				var dataType = editor.getDatatypeSelectedLine();
				if (dataType === null) dataType = (isString(rightValue)) ? "text" : "numeric";
				
				if (leftValue.data && rightValue.data) varArr.push([scope, leftValue.data, dataType, rightValue.data]);
				else if (leftValue.data) varArr.push([scope, leftValue.data, dataType, rightValue]);
				else if (rightValue.data) varArr.push([scope, leftValue, dataType, rightValue.data]);
				else varArr.push([scope, leftValue, dataType, rightValue]);
				
				if (!scopeExists(scope)) scopeArr.push(scope);
			}
		}
		else {
			for (var i = 0; i < varArr.length; i++) {
				if (scope == varArr[i][0] && (varArr[i][1] == leftValue || varArr[i][1].data == leftValue)) {
					//var scopeNum = getScopeNum(varArr[i][0]);
					//if (scopeNum != -1) scopeArr.splice(scopeNum, 1);
					var scope = varArr[i][0];
					varArr.splice(i, 1);
				}
			}
		}
		
		updateTable();
	}
	
	function pollVariables() {
		var scopeNum;
		try {
			scopeNum = getScopeNum(myInterpreter.getScope());
		}
		catch (err) {
			return;
		}
		
		var count = 0;
		if (scopeNum < 0) return;
		
		for (var i = 0; i < varArr.length; i++) {
			if (getScopeNum(varArr[i][0]) > scopeNum) { updateVariables("del", varArr[i][0], varArr[i][1]); haltFlag = true; }
		}
	}
	
	function getScopeNum(scope) {
		for (var i = 0; i < scopeArr.length; i++) if (scopeArr[i] == scope) return i;
		return -1;
	}
	
	function scopeExists(scope) {
		for (var i = 0; i < scopeArr.length; i++) if (scopeArr[i] == scope) return true;
		return false;
	}
	
	function clearTable() {
		varTable.innerHTML = "";
		return;
	}
	
	function updateTable() { 
		varTable.innerHTML = "";
		var row;
		var cell;
		var scopeNum;
		
		if (showScope) {
			row = varTable.insertRow(0);
			for (var i = 0; i < 4; i++) {
				cell = row.insertCell(i);
				if (i == 0) cell.textContent = "level";
				else if (i == 1) cell.textContent = "variable";
				else if (i == 2) cell.textContent = "type";
				else cell.textContent = "value";
			}

			
			for (var i = 0; i < varArr.length; i++) {
				row = varTable.insertRow(i + 1);
				for (var j = 0; j < 4; j++) {
					scopeNum = getScopeNum(varArr[i][0]);
					if (scopeNum < 0) {
						varArr.splice(i, 1);
						break;
					}
					cell = row.insertCell(j);
					if (j == 0) cell.textContent = getScopeNum(varArr[i][0]);
					else if (j == 1) cell.textContent = varArr[i][1];
					else if (j == 2) cell.textContent = varArr[i][2];
					else cell.textContent = varArr[i][3];
				}
			}
		}
		else {
		
			row = varTable.insertRow(0);
			for (var i = 0; i < 3; i++) {
				cell = row.insertCell(i);
				if (i == 0) cell.textContent = "variable";
				else if (i == 1) cell.textContent = "type";
				else cell.textContent = "value";
			}
			
			for (var i = 0; i < varArr.length; i++) {
				row = varTable.insertRow(i + 1);
				for (var j = 0; j < 3; j++) {
					scopeNum = getScopeNum(varArr[i][0]);
					if (scopeNum < 0) {
						varArr.splice(i, 1);
						break;
					}
					cell = row.insertCell(j);
					if (j == 0) cell.textContent = varArr[i][1];
					else if (j == 1) cell.textContent = varArr[i][2];
					else cell.textContent = varArr[i][3];
				}
			}
		}
	}
	
	var toString = Object.prototype.toString;

	isString = function (obj) {
		return toString.call(obj) == '[object String]';
	}
	
}