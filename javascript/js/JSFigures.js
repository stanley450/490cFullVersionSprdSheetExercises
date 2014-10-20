/*************************************************
 * Entity:		JSFigures.js
 * Author:		Neil Vosburg
 *
 * 	This is a modified version of the JavaScript figures to work with
 *	the Watson Editor.
 *************************************************/
function Figure(figID, uniqueFigID, chapterName, exerciseNum) {
	//set defaults for chapterName and exerciseNum, both default to null
	if(typeof chapterName == 'undefined'){
		chapterName = null;
	}
	if(typeof exerciseNum == 'undefined'){
		exerciseNum = null;
	}
	//this.updateVariables = editor.updateVariables;

	var figDiv = document.getElementById("JSFigure-" + figID);
	
	figDiv.innerHTML = '<div class="leftcontent" readonly> \
							<h4>&nbsp;Program definition</h4> \
								<div id="fig' + figID + 'Editor"></table> \
							</div> \
						<div class="rightbuttons" style="height:100%;"> \
							<button type="button" style="margin-left:5%; margin-top:5px; color:#FFFFFF; background-color:#5CB85C" id="fig' + figID + 'Run">Run</button> \
							<button type="button" style="margin-right:5%; margin-top:5px; color:#FFFFFF; background-color:#F0AD4E" id="fig' + figID + 'Walk">Walk</button> \
						</div> \
						<div class="bottomrightcontent" id="fig'+ figID + 'OutVarBox"style="clear: left;"> \
							<h4>&nbsp;&nbsp;&nbsp;Internal Variables</h4> \
							<div id="fig' + figID + 'VarBox" class="bottomrighttxtarea"> \
								<table id="fig' + figID + 'VarTable" class="normal"></table> \
							</div> \
						</div> \
						<div class="toprightcontent" style="clear: left; "> \
							<h4>&nbsp;&nbsp;&nbsp;Program input/output behavior</h4> \
							<div id="fig' + figID + 'OutputBox" class="bottomrighttxtarea"> \
								<table id="fig' + figID + 'OutputTable" class="righttxtarea" style="white-space:nowrap;"></table> \
							</div> \
						</div> ';

	//function Editor(divID, chapterName, exerciseNum, lineNumBool, syntaxHighlightingBool, lineNumStart, insertBetweenRowsBool, editable, autoSave){

	var interpreter = null;
	var thisObj = this;
	var programArray;
	var selectedRow = 1;
	var outputTable = document.getElementById("fig" + figID + "OutputTable");
	var finishedExec = false;
	var promptInput = "";
	var promptInterrupt = false;
	var activePromptCellID;
	var currI;
	var runMode = false;
	var intervalID;
	var defaultPrompt;
	var varArr = [];
	var scopeArr = [];
	var dataTypeArray = [];
	var varBox = document.getElementById("fig" + figID + "VarBox");
	var varTable = document.getElementById("fig" + figID + "VarTable");
	var showScope = false;
	var slidDown = false;
	var showVarBox = true;
	var outputBox = document.getElementById("fig" + figID + "OutputBox");
	var runButtonObj = document.getElementById("fig" + figID + "Run");
	var walkButtonObj = document.getElementById("fig" + figID + "Walk");
	var lastRowSelected = -1;
	
	var editor = new Editor("fig" + figID + "Editor", chapterName, exerciseNum, true, true, 1, true, false, false);
	var engine = new Engine(figID, chapterName, exerciseNum, editor);
	
	var green = "#5CB85C";
	var greenHover = "#47A447";
	var orange = "#F0AD4E";
	var orangeHover = "#F09C28";
	var red = "#D9534F";
	var redHover = "#D2322D";
	
	// depending on the figure ID, load the appropriate code into the editor
	
	if (figID == "5") {
		addComment(0, "Main Program");
		addWrite  (1, [ '"There are "' ], 0);
		addWrite  (2, [ '12 + 1' ], 0);
		addWriteln(3, [ '" cookies in a baker\'s dozen."' ], 0);
		
		showVarBox = false;
	}
	else if (figID == "6") {
		addComment(0, "Variables");
		addVariable(1, "firstName", "TEXT", 0);
		addBlankLine(2);
		addComment(3, "Main Program");
		addStringPrompt(4, "firstName", '"Please enter your first name."', '""');
		addWrite  (5, [ '"Hello "' ], 0);
		addWrite  (6, [ 'firstName' ], 0);
		addWriteln(7, [ '". Nice to meet you."' ], 0);
	
		showScope = true;
	}
	else if (figID == "7") {
		addComment(0, "Variables");
		addVariable(1, "firstNum", "NUMERIC", 0);
		addVariable(2, "secondNum", "NUMERIC", 0);
		addBlankLine(3);
		addComment(4, "Main Program");
		addNumericPrompt(5, "firstNum", '"Enter a number. "', '0');
		addNumericPrompt(6, "secondNum", '"Enter another number. "', '0');
		addWrite(7, [ '"Guess what? The sum of "' ], 0);
		addWrite(8, [ 'firstNum' ], 0);
		addWrite(9, [ '" and "' ], 0);
		addWrite(10, [ 'secondNum' ], 0);
		addWrite(11, [ '" is "' ], 0);
		addWrite(12, [ 'firstNum + secondNum' ], 0);
		addWriteln(13, [ '"."' ], 0);
		showScope = true;
	}
	else if (figID == "10") {
		addComment(0, "Variables");
		addVariable(1, "x", "NUMERIC", 0);
		addVariable(2, "y", "NUMERIC", 0);
		addVariable(3, "z", "NUMERIC", 0);
		addBlankLine(4);
		addComment(5, "Main Program");
		addAssignment(6, "x", "5", "", "", 0);
		addAssignment(7, "x", "x", "+", "1", 0);
		addAssignment(8, "y", "3", "", "", 0);
		addAssignment(9, "z", "x", "+", "y", 0);
		addAssignment(10, "y", "y", "-", "2", 0);
		addWriteln(11, [ 'x+y+z' ], 0);
		showScope = true;
	}
	else if (figID == "12") {
		addComment(0, "Variables");
		addVariable(1, "age", "NUMERIC", 0);
		addBlankLine(2);
		addComment(3, "Main Program");
		addNumericPrompt(4, "age", '"Enter your age."', '0');
		addIfElse(5, "age", "<", "21");
		addWriteln(7, [ '"No beer for you."' ], 2);
		addWriteln(11, [ '"Here, have a cold one!"' ], 2);
		showScope = true;
	}
	else if (figID == "13") {
		addComment(0, "Variables");
		addVariable(1, "num", "NUMERIC", 0);
		addBlankLine(2);
		addComment(3, "Main Program");
		addNumericPrompt(4, "num", '"Enter a number."', "0");
		addWrite(5, [ '"The absolute value of the "' ], 0);
		addIfElse(6, "num", "<", "0");
		addWrite(8, [ '"negative number, "'], 2);
		addWrite(9, [ 'num'], 2);
		addWrite(10, [ '", is "'], 2);
		addWrite(11, [ '0-num'], 2);
		addWrite(15, [ '"nonnegative number, "'], 2);
		addWrite(16, [ 'num'], 2);
		addWrite(17, [ '", is "'], 2);
		addWrite(18, [ 'num'], 2);
		addWrite(20, [ '"."'], 0);
		showScope = true;
	}
	else if (figID == "14") {
		addComment(0, "Variables");
		addVariable(1, "age", "NUMERIC", 0);
		addVariable(2, "income", "NUMERIC", 0);
		addBlankLine(3);
		addComment(4, "Main Program");
		addNumericPrompt(5, "age", '"Enter your age."', '0');
		addNumericPrompt(6, "income", '"Now, enter your income."', '0');
		addIfElse(7, "age", "<", "25", 0);
		addIfElse(9, "income", ">=", "50000", 2);
		addIfElse(18, "income", ">=", "50000", 2);
		addWriteln(11, [ '"You\'re a baller!"' ], 4);
		addWriteln(15, [ '"You\'re too poor to be a baller."' ], 4);
		addWriteln(22, [ '"You\'re too old to be a baller."' ], 4);
		addWriteln(26, [ '"You\'re too old and poor."' ], 4);
		showScope = true;
	}
	else if (figID == "16") {
		addComment(0, "Variables");
		addVariable(1, "age", "NUMERIC", 0);
		addBlankLine(2);
		addComment(3, "Main Program");
		addNumericPrompt(4, "age", '"Enter your age."', '0', 0);
		addWrite(5, [ '"You are "' ], 0);
		addIfThen(6, "age", ">=", "18");
		addWrite(8, [ '"not "' ], 2);
		addWriteln(10, [ '"a minor."'], 0);
		showScope = true;
	}
	else if (figID == "18") {
		addComment(0, "Variables");
		addVariable(1, "total", "NUMERIC", 0);
		addVariable(2, "newvalue", "NUMERIC", 0);
		addBlankLine(3);
		addComment(4, "Main Program");
		addAssignment(5, "total", "0", "", "", 0);
		addNumericPrompt(6, "newvalue", '"Enter a positive number, or a -1 to quit."', "0", 0);
		addWhile(7, "newvalue", ">=", "0", 0);
		addAssignment(9, "total", "total", "+", "newvalue", 2);
		addWrite(10, [ '"The total so far is... "'], 2);
		addWriteln(11, ['total'], 2);
		addNumericPrompt(12, "newvalue", '"Enter a number to add to the total, or a -1 to quit."', "0", 2);
		addWrite(14, [ '"The final total is "'], 0);
		addWriteln(15, ['total'], 0);
		showScope = true;
	}
	else if (figID == "19") {
		addComment(0, "Variables");
		addVariable(1, "n", "NUMERIC", 0);
		addVariable(2, "total", "NUMERIC", 0);
		addVariable(3, "counter", "NUMERIC", 0);
		addVariable(4, "newvalue", "NUMERIC", 0);
		addBlankLine(5);
		addComment(6, "Main Program");
		addNumericPrompt(7, "n", '"How many numbers are to be added together?"', "0", 0);
		addAssignment(8, "total", "0", "", "", 0);
		addAssignment(9, "counter", "1", "", "", 0);
		addWhile(10, "counter", "<=", "n", 0);
		addWrite(12, [ '"The total so far is... "' ], 2);
		addWriteln(13, [ 'total' ], 2);
		addNumericPrompt(14, "newvalue", '"Enter a number to add to the total."', "0", 2);
		addAssignment(15, "total", "total", "+", "newvalue", 2);
		addAssignment(16, "counter", "counter", "+", "1", 2);
		addWrite(18, [ '"The final total is... "' ], 0);
		addWriteln(19, [ 'total' ], 0);
		showScope = true;
	}
	else if (figID == "21") {
		addComment(0, "Variables");
		addVariable(1, "n", "NUMERIC", 0);
		addVariable(2, "total", "NUMERIC", 0);
		addVariable(3, "counter", "NUMERIC", 0);
		addVariable(4, "newvalue", "NUMERIC", 0);
		addBlankLine(5);
		addComment(6, "Main Program");
		addNumericPrompt(7, "n", '"How many numbers are to be added together?"', "0", 0);
		addAssignment(8, "total", "0", "", "", 0);
		addFor(9, "counter", "1", "<=", "n", "++", 0);
		addWrite(11, [ '"The total so far is... "' ], 2);
		addWriteln(12, [ 'total' ], 2);
		addNumericPrompt(13, "newvalue", '"Enter a number to add to the total."', "0", 2);
		addAssignment(14, "total", "total", "+", "newvalue", 2);
		addWrite(16, [ '"The final total is... "' ], 0);
		addWriteln(17, [ 'total' ], 0);
		showScope = true;
	}
	else if (figID == "22") {
		addComment(0, "Variables");
		addVariable(1, "numberOfGrades", "NUMERIC", 0);
		addVariable(2, "total", "NUMERIC", 0);
		addVariable(3, "i", "NUMERIC", 0);
		addVariable(4, "grade", "NUMERIC", 0);
		addVariable(5, "average", "NUMERIC", 0);
		addBlankLine(6);
		addComment(7, "Main Program");
		addNumericPrompt(8, "numberOfGrades", '"Enter the number of grades."', "0", 0);
		addAssignment(9, "total", "0", 0);
		addFor(10, "i", "1", "<=", "numberOfGrades", "++", 0);
		addNumericPrompt(12, "grade", '"Enter a grade."', "0", 2);
		addWrite(13, [ '"Grade "' ], 2);
		addWrite(14, [ 'i' ], 2);
		addWrite(15, [ '": "' ], 2);
		addWriteln(16, [ 'grade' ], 2);
		addAssignment(17, "total", "total", "+", "grade", 2);
		addWrite(19, [ '"The average of the grades is "' ], 0);
		addIfElse(20, "numberOfGrades", ">", "0", 0);
		addAssignment(22, "average", "total", "/", "numberOfGrades", 2);
		addWrite(23, [ 'average' ], 2);
		addWriteln(27, [ '"undefined"' ], 2);
		showScope = true;
	}
	else if (figID == "23") {
		addComment(0, "Variables");
		addVariable(1, "i", "NUMERIC", "0");
		addVariable(2, "j", "NUMERIC", "0");
		addVariable(3, "product", "NUMERIC", "0");
		addBlankLine(4);
		addComment(5, "Main Program");
		addFor(6, "i", "1", "<=", "12", "++", 0);
		addWriteln(8, [ '""' ], 2);
		addFor(9, "j", "1", "<=", "12", "++", 2);
		addAssignment(11, "product", "i", "*", "j", 4);
		addWrite(12, [ 'i' ], 4);
		addWrite(13, [ '" times "' ], 4);
		addWrite(14, [ 'j' ], 4);
		addWrite(15, [ '" equals "' ], 4);
		addWriteln(16, [ 'product' ], 4);
		showScope = true;
	}
	else if (figID == "24") {
		addComment(0, "Variables");
		addVariable(1, "count", "NUMERIC", 0);
		addBlankLine(2);
		addComment(3, "Main Program");
		addNumericPrompt(4, "count", '"How many bottles?"', 0);
		addWhile(5, "count", ">", "0");
		addWrite(7, [ 'count' ], 2);
		addWriteln(8, [ '" bottles of beer on the wall,"' ], 2);
		addWrite(9, [ 'count' ], 2);
		addWriteln(10, [ '" bottles of beer."' ], 2);
		addWriteln(11, [ '"Take one down. Pass it around."' ], 2);
		addAssignment(12, "count", "count", "-", "1", 2);
		addWrite(13, [ 'count' ], 2);
		addWriteln(14, [ '" bottles of beer on the wall."' ], 2);
		addWriteln(15, [ '" "' ], 2);
		showScope = true;
	}
	else if (figID == "27") {
		addComment(0, "Variables");
		addVariable(1, "a", "NUMERIC", 0);
		addVariable(2, "b", "NUMERIC", 0);
		addBlankLine(3);
		addComment(4, "Functions");
		addFunction(5, "power", [ {name: "x", type: "Numeric"}, {name: "y", type: "Numeric"} ], "Returns Numeric");
		addVariable(7, "i", "NUMERIC", 2);
		addVariable(8, "z", "NUMERIC", 2);
		addAssignment(9, "z", "1", "", "", 2);
		addFor(10, "i", "1", "<=", "y", "++", 2);
		addAssignment(12, "z", "z", "*", "x", 4);
		addReturn(14, "z", 2);
		addBlankLine(16);
		addComment(17, "Main Program");
		addNumericPrompt(18, "a", '"Enter a value."', "0", 0);
		addAssignFunction(19, "b", "power", [{param: "a"}, {param: "3"}], 0);
		addWrite(20, ["a"], 0);
		addWrite(21, ['" raised to the third power is "'], 0);
		addWrite(22, ["b"], 0);
		showScope = true;
	}
	else if (figID == "28") {
		addComment(0, "Variables");
		addVariable(1, "a", "NUMERIC", 0);
		addVariable(2, "b", "NUMERIC", 0);
		addVariable(3, "c", "NUMERIC", 0);
		addVariable(4, "d", "NUMERIC", 0);
		addVariable(5, "x", "NUMERIC", 0);
		addVariable(6, "y", "NUMERIC", 0);
		addBlankLine(7);
		addComment(8, "Functions");
		addFunction(9, "power", [ {name: "x", type: "Numeric"}, {name: "y", type: "Numeric"} ], "Returns Numeric");
		addVariable(11, "i", "NUMERIC", 2);
		addVariable(12, "z", "NUMERIC", 2);
		addAssignment(13, "z", "1", "", "", 2);
		addFor(14, "i", "1", "<=", "y", "++", 2);
		addAssignment(16, "z", "z", "*", "x", 4);
		addReturn(18, "z", 2);
		addBlankLine(20);
		addComment(21, "Main Program");
		addNumericPrompt(22, "x", '"Enter a value."', "0", 0);
		addNumericPrompt(23, "a", '"Enter a value."', "0", 0);
		addNumericPrompt(24, "b", '"Enter a value."', "0", 0);
		addNumericPrompt(25, "c", '"Enter a value."', "0", 0);
		addNumericPrompt(26, "d", '"enter a value."', "0", 0);
		addAssignExpr(27, "y", ["a", "*", "power(x,3)", "+", "b", "*", "power(x,2)", "+", "c", "*", "x", "+", "d"], 0);
		addWrite(28, ['"A*X**3 + B*X**2 + C*X + D = "'], 0);
		addWrite(29, ['y'], 0);
		showScope = true;
	}
	else if (figID == "29") {
		addComment(0, "Variables");
		addVariable      (1, "count", "NUMERIC", 0);
		addBlankLine     (2);
		addComment(3, "Functions");
		addFunction      (4, "singsong", [ { name: "beers", type: "NUMERIC" } ], "Returns Nothing");
		addWhile        (6, "beers", ">", "0", 2);
		addWrite         (8, [ 'beers' ], 4);
		addWriteln       (9, [ '" bottles of beer on the wall,"' ], 4);
		addWrite         (10, [ 'beers' ], 4);
		addWriteln       (11, [ '" bottles of beer."' ], 4);
		addWriteln       (12, [ '"Take one down. Pass it around."' ], 4);
		addAssignment    (13, "beers", "beers", "-", "1", 4);
		addWrite         (14, [ 'beers' ], 4);
		addWriteln       (15, [ '" bottles of beer on the wall."' ], 4);
		addWriteln			 (16, [ '" "' ], 4);
		addBlankLine     (19);
		addComment(20, "Main Program")
		addNumericPrompt (21, "count", '"How many bottles?"', 0);
		addFunctionCall  (22, "singsong", [ { param: "count" } ], 0);
		addWriteln       (23, [ '"Later..."' ], 0);
		
		showScope = true;
	}
	else if (figID == "30") {
		addComment(0, "Variables");
		addVariable      (1, "count", "NUMERIC", 0);
		addBlankLine     (2);
		addComment(3, "Functions");
		addFunction      (4, "singsong", [ { name: "beers", type: "NUMERIC" } ], "Returns Nothing");
		addIfThen        (6, "beers", ">", "0", 1);
		addWrite         (8, [ 'beers' ], 2);
		addWriteln       (9, [ '" bottles of beer on the wall,"' ], 2);
		addWrite         (10, [ 'beers' ], 2);
		addWriteln       (11, [ '" bottles of beer."' ], 2);
		addWriteln       (12, [ '"Take one down. Pass it around."' ], 2);
		addAssignment    (13, "beers", "beers", "-", "1", 2);
		addWrite         (14, [ 'beers' ], 2);
		addWriteln       (15, [ '" bottles of beer on the wall."' ], 2);
		addFunctionCall  (16, "singsong", [ { param: "beers" } ], 2);
		addBlankLine     (19);
		addComment(20, "Main Program")
		addNumericPrompt (21, "count", '"How many bottles?"', 0);
		addFunctionCall  (22, "singsong", [ { param: "count" } ], 0);
		addWriteln       (23, [ '"Later..."' ], 0);
		
		showScope = true;
	}
	else if (figID == "32") {
		addComment(0, "Variables");
		addVariable  (1, "count", "NUMERIC", 0);
		addBlankLine (2);
		addComment(3, "Functions");
		addFunction  (4, "singsong", [ { name: "beers", type: "NUMERIC" } ], "Returns Nothing");
		addIfElse    (6, "beers", ">", "0", 2);
		addWrite     (8, [ 'beers' ], 4);
		addWriteln   (9, [ '" bottles of beer on the wall,"' ], 4);
		addWrite     (10, [ 'beers' ], 4);
		addWriteln   (11, [ '" bottles of beer."' ], 4);
		addWriteln   (12, [ '"Take one down. Pass it around."' ], 4);
		addAssignment(13, "beers", "beers", "-", "1", 4);
		addWrite     (14, [ 'beers' ], 4);
		addWriteln   (15, [ '" bottles of beer on the wall."' ], 4);
		addFunctionCall(16, "singsong", [ { param: "beers" } ], 4);
		addWriteln   (17, [ '"Hic."' ], 4);
		addWriteln	 (21, [ '"We\'re out of beer."' ], 4);
		addBlankLine (24);
		addComment(25, "Main Program");
		addNumericPrompt(26, "count", '"How many bottles?"', 0);
		addFunctionCall(27, "singsong", [ { param: "count" } ], 0);
		addWriteln       (28, [ '"Later..."' ], 0);
		
		showScope = true;
	}
	else if (figID == "38") {
		addComment(0, "Variables");
		addVariable(1, "TOP", "NUMERIC", 0);
		addArray(2, "STACK", "100", "NUMERIC", 0);
		addBlankLine(3);
		addComment(4, "Functions");
		addFunction(5, "push", [{name: "item", type: "NUMERIC"}], "Returns Nothing");
		addIfThen(7, "TOP", "<", "99", 2);
		addAssignment(9, "TOP", "TOP", "+", "1", 4);
		addAssignment(10, "STACK[TOP]", "item", "", "", 4);
		addBlankLine(13);
		addFunction(14, "pop", [], "Returns Numeric");
		addVariable(16, "item", "NUMERIC", 2);
		addIfElse(17, "TOP", ">=", "0", 2);
		addAssignment(19, "item", "STACK[TOP]", "", "", 4);
		addAssignment(20, "TOP", "TOP", "-", "1", 4);
		addReturn(21, "item", 4);
		addReturn(25, "0", 4);
		addBlankLine(28);
		addComment(29, "Main Program");
		addAssignment(30, "TOP", "-1", "", "", 0);
		addFunctionCall(31, "push", [{param: "10"}], 0);
		addFunctionCall(32, "push", [{param: "20"}], 0);
		addFunctionCall(33, "push", [{param: "30"}], 0);
		addWriteln(34, ['pop()'], 0);
		addWriteln(35, ['pop()'], 0);
		addWriteln(36, ['pop()'], 0);
		showScope = true;
	}
	else{
		if(editor.checkEditorData()){
			retrieveUpdates();
		}/*
		else{
			//insert standard comments
			addComment(0, "JavaScript Program");
			addBlankLine(1);
			addComment(2, "Main Program");
		}*/
	}
		
	
	//;;;;;;;;;;;;; Editor Add Functions ;;;;;;;;;;;;;;;;;;;;;
	
	/*
	 * The level parameter corresponds to the level of indention. I do it manually here.
	 * This can be done automatically. Feel free to throw that in here. Other than that,
	 * this section should be self explanatory using the Watson Editor API.
	 */
	 
	function addBlankLine(index) {
		editor.addRow(index, [ { text: " " } ]); 
	}
	
	function addVariable(index, name, type, level) {
		var indent = getIndent(level);
		
		editor.addRow(index, [ { text: indent }, { text: "var", type: "keyword" }, { text: "&nbsp" }, { text: name }, { text: ";" }, { text: "&nbsp" }, { text: "/*" + type + "*/", type: "datatype" } ]);
	}
	
	function addStringPrompt(index, varName, prompt, defaultValue) {
		editor.addRow(index, [ { text: varName }, { text: "&nbsp=&nbsp" }, { text: "prompt", type: "keyword" }, { text: "(", type: "openParen" },
								{ text: prompt, type: "literal" }, { text: ",&nbsp;" }, { text: defaultValue, type: "literal" },
								{ text: ")", type: "closeParen" }, { text: ";" } ]);
	}
	
	function addNumericPrompt(index, varName, prompt, defaultValue, level) {
		var indent = getIndent(level);
		editor.addRow(index, [ {text: indent }, { text: varName }, { text: "&nbsp=&nbsp" }, { text: "parseFloat", type: "keyword" }, { text: "(", type: "openParen" },
								{ text: "prompt", type: "keyword" }, { text: "(", type: "openParen" }, { text: prompt, type: "literal" },
								{ text: ",&nbsp;" }, { text: defaultValue, type: "literal" }, { text: ")", type: "closeParen" },
								{ text: ")", type: "closeParen" }, { text: ";" } ]);
	}
	
	// The write function can potentially have multiple things to write concatenated by a plus sign.
	// I didn't add the functionality, but I kind of set up the framework for that.
	function addWrite(index, str, level) {
		var indent = getIndent(level);
		
		if (str.length == 1) {
			if (str[0].charAt(0) == '"') {
				editor.addRow(index, [ { text: indent }, { text: "document.write", type: "keyword" }, { text: "(", type: "openParen" }, { text: str[0], type: "literal" },
									{ text: ")", type: "closeParen" }, { text: ";" } ]);
			}
			else {
				editor.addRow(index, [ { text: indent }, { text: "document.write", type: "keyword" }, { text: "(", type: "openParen" }, { text: str[0] },
									{ text: ")", type: "closeParen" }, { text: ";" } ]);
			}
		}
	}
	
	function addWriteln(index, str, level) {
		var indent = getIndent(level);
		if (str.length == 1) {
			if (str[0].charAt(0) == '"') {
				editor.addRow(index, [ { text: indent }, { text: "document.writeln", type: "keyword" }, { text: "(", type: "openParen" }, { text: str[0], type: "literal" },
									{ text: ")", type: "closeParen" }, { text: ";" } ]);
			}
			else {
				editor.addRow(index, [ { text: indent }, { text: "document.writeln", type: "keyword" }, { text: "(", type: "openParen" }, { text: str },
									{ text: ")", type: "closeParen" }, { text: ";" } ]);
			}
		}
	}
	
	function addAssignExpr(index, leftSide, params, level) {
		var indent = getIndent(level);
		var arr = [];

		arr.push({text: indent});
		arr.push({text: leftSide});
		arr.push({text: "&nbsp;=&nbsp;"});
		for (var i = 0; i < params.length; i++) {
			if (i == params.length - 1)
				arr.push({text: params[i]+";"});
			else
				arr.push({ text: params[i]+"&nbsp;" });
		}
		
		editor.addRow(index, arr);
	}
	
	function addAssignment(index, leftSide, operand1, operator, operand2, level) {
		var indent = getIndent(level);
		
		if (!operator || (operator == "" && operand2 == "")) {
			editor.addRow(index, [ { text: indent }, { text: leftSide }, { text: "&nbsp;=&nbsp;" }, { text: operand1 }, { text: ";" } ]);
		} else 
		editor.addRow(index, [ { text: indent }, { text: leftSide }, { text: "&nbsp;=&nbsp;" }, { text: operand1 }, { text: "&nbsp;" + operator + "&nbsp;" }, {text: operand2 }, { text: ";" } ]);
	}
	
	function addAssignFunction(index, leftside, funcName, values, level) {
		var indent = getIndent(level);
		var arr = [];

		for (var i = 0; i < values.length; i++) {
			arr.push( { text: values[i].param } );
			if (i != values.length - 1)
				arr.push( { text: "," }, { text: "&nbsp;" } );
		}
		
		var arr2 = [];
		arr2.push({text: indent});
		arr2.push({text: leftside});
		arr2.push({text: "&nbsp;=&nbsp;"});
		arr2.push({text: funcName});
		arr2.push( { text: "(", type: "openParen" } );
		for (var i = 0; i < arr.length; i++) {
			arr2.push(arr[i]);
		}
		arr2.push( { text: ")", type: "closeParen" } );
		arr2.push( { text: ";" } );
		
		editor.addRow(index, arr2);
	}
	
	function addFunctionCall(index, funcName, values, level) {
		var arr = [];
		var indent = getIndent(level);
		
		// variable amount of parameters must be taken into consideration
		for (var i = 0; i < values.length; i++) {
			arr.push( { text: values[i].param } );
			if (i != values.length - 1)
				arr.push( { text: "," }, { text: "&nbsp;" } );
		}
		
		var arr2 = [];
		arr2.push( { text: indent } );
		arr2.push( { text: funcName } );
		arr2.push( { text: "(", type: "openParen" } );
		for (var i = 0; i < arr.length; i++) { arr2.push(arr[i]); }
		arr2.push( { text: ")", type: "closeParen" } );
		arr2.push( { text: ";" } );
		
		editor.addRow(index, arr2);
	}
	
	function addIfThen(index, leftSide, boolSym, rightSide, level) {
		var indent = getIndent(level);
		
		editor.addRow(index, [ { text: indent }, { text: "if ", type: "keyword" }, { text: "(", type: "openParen" }, { text: leftSide }, { text: "&nbsp;" + boolSym + "&nbsp;" },
								{ text: rightSide }, { text: ")", type: "keyword" }, { text: " " } ]);
		editor.addRow(index + 1, [ { text: indent }, { text: "{", type: "openBrack" } ]);
		editor.addRow(index + 2, [ { text: indent }, { text: "}", type: "closeBrack" } ]);
	}
	
	function addIfElse(index, leftSide, boolSym, rightSide, level) {
		var indent = getIndent(level);
		
		editor.addRow(index, [ { text: indent }, { text: "if ", type: "keyword" }, { text: "(", type: "openParen" }, { text: leftSide }, { text: "&nbsp;" + boolSym + "&nbsp;" },
								{ text: rightSide }, { text: ")", type: "keyword" }, { text: " " } ]);
		editor.addRow(index + 1, [ { text: indent }, { text: "{", type: "openBrack" } ]);
		editor.addRow(index + 2, [ { text: indent }, { text: "}", type: "closeBrack" } ]);
		editor.addRow(index + 3, [ { text: indent }, { text: "else ", type: "keyword" } ]);
		editor.addRow(index + 4, [ { text: indent }, { text: "{", type: "openBrack" } ]);
		editor.addRow(index + 5, [ { text: indent }, { text: "}", type: "closeBrack" } ]);
	}
	
	function addFor(index, var1, operand1, operator1, operand2, operator2, level) {
		var indent = getIndent(level);
		
		editor.addRow(index,
			[{text: indent},
			 {text: "for", type: "keyword"},
			 {text: "(", type: "openParen"},
			 {text: var1},
			 {text: "&nbsp;=&nbsp;"},
			 {text: operand1+";"},
			 {text: "&nbsp;"+var1+"&nbsp;"},
			 {text: operator1},
			 {text: "&nbsp;"+operand2+";&nbsp;"},
			 {text: var1+operator2},
			 {text: ")", type: "closeParen"}]);
		
		editor.addRow(index + 1, [ { text: indent }, { text: "{", type: "openBrack" } ]);
		editor.addRow(index + 2, [ { text: indent }, { text: "}", type: "closeBrack" } ]);
	}
	
	function addWhile(index, param1, param2, param3, level) {
		var indent = getIndent(level);
		
		editor.addRow(index,
			[{text: indent+"while", type: "keyword"},
			 {text: "(", type: "openParen"},
			 {text: param1},
			 {text: "&nbsp;"+param2+"&nbsp;"},
			 {text: param3},
			 {text: ")", type: "closeParen"}]);
		
		editor.addRow(index + 1, [ { text: indent }, { text: "{", type: "openBrack" } ]);
		editor.addRow(index + 2, [ { text: indent }, { text: "}", type: "closeBrack" } ]);
	}
	
	function addArray(index, left, num, type, level) {
		var indent = getIndent(level);
		
		editor.addRow(index,
			[{ text: indent },
			 { text: "var", type: "keyword"},
			 { text: "&nbsp" },
			 { text: left },
			 { text: "&nbsp;=&nbsp;"},
			 { text: "new", type: "keyword"},
			 { text: "&nbsp;Array("},
			 { text: num },
			 { text: ");&nbsp;"},
			 { text: "/*" + type + "*/", type: "datatype" } ]);
	}
	
	function addReturn(index, value, level) {
		var indent = getIndent(level);
		
		editor.addRow(index,
			[{text: indent},
			 {text: "return", type: "keyword"},
			 {text: "&nbsp;"+value},
			 {text: ";"}]);
	}
	
	function addFunction(index, funcName, values, commentType) {
		var arr = [];
		
		// variable amount of parameters must be taken into consideration
		for (var i = 0; i < values.length; i++) {
			arr.push( { text: values[i].name } );
			arr.push( { text: "&nbsp;" } );
			arr.push( { text: "/*" + values[i].type + "*/", type: "keyword" } );
			if (i != values.length - 1) arr.push( { text: "," }, { text: "&nbsp;" } );
		}
		
		var arr2 = [];
		arr2.push( { text: "function", type: "keyword" } );
		arr2.push( { text: "&nbsp;" } );
		arr2.push( { text: funcName } );
		arr2.push( { text: "(", type: "openParen" } );
		for (var i = 0; i < arr.length; i++) { arr2.push(arr[i]); }
		arr2.push( { text: ")", type: "closeParen" } );
		arr2.push({text: "&nbsp;"+"/*", type: "keyword"});
		arr2.push({text: commentType, type: "keyword"});
		arr2.push({text: "*/", type: "keyword"});
		
		editor.addRow(index, arr2);
		editor.addRow(index + 1, [ { text: "{", type: "openBrack" } ]);
		editor.addRow(index + 2, [ { text: "}", type: "closeBrack" } ]);
	}
	
	function getIndent(level) {
		var indent = "";
		for (var i = 0; i < level; i++) indent += "&nbsp;";
		return indent;
	}
	
	function addComment(row, param) {
		editor.addRow(row, [{ text: "//&nbsp;"+param, type: "comment" }]);
	}
	
	//end editor stuff-------------------------------------
	
	// Walk button listener
	$("#fig" + figID + "Walk").click(function() {
		engine.walkButton();
	});
	
	// Run button listener
	$("#fig" + figID + "Run").click(function() {
		$("#fig" + figID + "OutVarBox").slideUp(function() {
			engine.runButton();
			slidDown = false;
		});
	});
	
	$("#fig" + figID + "OutVarBox").slideUp("medium");
	
	// Mouse events for buttons
	$("#fig" + figID + "Run").mousemove(function() {
		var button = document.getElementById("fig" + figID + "Run");
		
		if (button.textContent == "Run") button.style.backgroundColor = greenHover;
		else button.style.backgroundColor = orangeHover;
	});
	
	$("#fig" + figID + "Run").mouseout(function() {
		var button = document.getElementById("fig" + figID + "Run");
		if (button.textContent == "Run") button.style.backgroundColor = green;
		else button.style.backgroundColor = orange;
	});

	$("#fig" + figID + "Walk").mousemove(function() {
		var button = document.getElementById("fig" + figID + "Walk");
		if (button.textContent == "Walk") button.style.backgroundColor = orangeHover;
		else button.style.backgroundColor = redHover;
	});
	
	$("#fig" + figID + "Walk").mouseout(function() {
		var button = document.getElementById("fig" + figID + "Walk");
		if (button.textContent == "Walk") button.style.backgroundColor = orange;
		else button.style.backgroundColor = red;
	});
	
	this.retrieveUpdates = retrieveUpdates;
	function retrieveUpdates(){
		editor.loadEditor("figJSSandboxEditor", "fig" + figID + "Editor", true);
	}
	
	this.saveEditor = saveEditor;
	function saveEditor(){
		if(editor.checkEditorData(true))
			editor.saveEditor(true);
	}
	
	this.clearEditor = clearEditor;
	function clearEditor(){
		console.log("here2");
		editor.clearEditor();
		editor = new Editor("fig" + figID + "Editor", chapterName, exerciseNum, true, true, 1, true, false, false);
	}
}