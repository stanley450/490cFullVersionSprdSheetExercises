/***********************************************************************************
* Author:	Neil Vosburg
* File:		editor.js
*
*			This is the beginnings of an editor for the JavaScript lab. Its purpose
*			is to mimic Watson as it is now.
************************************************************************************/

function JSEditor(divID, chapterName, exerciseNum) {

/* begin copy from old controller.js*****************/
	var intervalID;
	var codeStr;
	var runMode = false;
	var varArr = [];
	var scopeArr = [];
	var thisObj = this;
	var lastLine = -1;
	var firstMove = true;
	var nextRowInd = 0;
	var slidDown = false;
	var editCellID;
	var shiftDown = false;
	var showVarBox = true;
	var showScope = false;
	var green = "#5CB85C";
	var greenHover = "#47A447";
	var orange = "#F0AD4E";
	var orangeHover = "#F09C28";
	var red = "#D9534F";
	var redHover = "#D2322D";
	//var figDiv = document.getElementById("fig" + sandboxNum + "Div");
	var figDiv = document.getElementById(divID);
	
	figDiv.innerHTML = '<div id="selector" style="text-align:center"></div> \
		<h4 id="codeTitle">Code Window</h4> \
		<div class="codeAndButtons"> \
			<div id="buttons"> \
				<div><button id="fig' + divID + 'AddVar"        type="button">Variable</button></div> \
				<div><button id="fig' + divID + 'AddArr"        type="button" onclick="figure.getEditor().addVariable("array")">Array</button></div> \
				<div><button id="fig' + divID + 'AddFunc"       type="button" onclick="figure.getEditor().addFunction()">Declare Function</button></div> \
				<div><button id="fig' + divID + 'Assign"        type="button" onclick="figure.getEditor().addOneLineElement("assignment")">Assign</button></div> \
				<div><button id="fig' + divID + 'Write"         type="button" onclick="figure.getEditor().addOneLineElement("write")">Write</button></div> \
				<div><button id="fig' + divID + 'Writeln"       type="button" onclick="figure.getEditor().addOneLineElement("writeln")">Writeln</button></div> \
				<div><button id="fig' + divID + 'StringPrompt"  type="button" onclick="figure.getEditor().addOneLineElement("stringPrompt")">String Prompt</button></div> \
				<div><button id="fig' + divID + 'NumericPrompt" type="button" onclick="figure.getEditor().addOneLineElement("numericPrompt")">Numeric Prompt</button></div> \
				<div><button id="fig' + divID + 'While"         type="button" onclick="figure.getEditor().addWhile()">While</button></div> \
				<div><button id="fig' + divID + 'AddFor"        type="button" onclick="figure.getEditor().addFor()">For</button></div> \
				<div><button id="fig' + divID + 'AddIfThen"     type="button" onclick="figure.getEditor().addIfThen()">If...Then</button></div> \
				<div><button id="fig' + divID + 'AddIfElse"     type="button" onclick="figure.getEditor().addIfElse()">If...Else</button></div> \
				<div><button id="fig' + divID + 'FuncCall"      type="button" onclick="figure.getEditor().addOneLineElement("functionCall")">Call Function</button></div> \
				<div><button id="fig' + divID + 'Return"        type="button" onclick="figure.getEditor().addOneLineElement("return")">Return</button></div> \
			</div> \
			<div id="fig' + divID + 'Editor" class="programCode"> </div>\
		</div> \
		<div id="fig' + divID + 'OutVarBox" class="outterDiv"> \
		  <h4 id="varTitle">Variables</h4> \
		  <div id="fig' + divID + 'VarBox" class="varDiv"> \
			<table id="fig' + divID + 'VarTable" class="normal"></table> \
		  </div> \
		</div> \
		<div class="outterDiv"> \
			<h4 id="outTitle">Output</h4> \
			<div id="fig' + divID + 'OutputBox" class="varDiv"> \
				<table id="fig' + divID + 'OutputTable"></table> \
			</div> \
		</div> \
		<div id="runWalk" align="center"> \
		  <button id="fig' + divID + 'Run" type="button" style="color:#FFFFFF;background-color:' + green + '">Run</button> \
		  <button id="fig' + divID + 'Walk" type="button" style="color:#FFFFFF;background-color:' + orange + '">Walk</button> \
		</div>';
   console.log('here50000');
	//subract 6 for the width of the border of .textArea, if the border ever changes, this will have to change too
	$('#fig' + divID + 'Editor').height($('#buttons').height() - 6);
	
	outputTable = document.getElementById("fig" + divID + "OutputTable");
	var outputBox = document.getElementById("fig" + divID + "OutputBox");
	//var outputBox = document.getElementById("fig" + sandboxNum + "OutputBox");
	var row = outputTable.insertRow(0);
	var cell = row.insertCell(0);
	nextRowInd++;
	varBox = document.getElementById("fig" + divID + "VarBox");
	varTable = document.getElementById("fig" + divID + "VarTable");
	
	var addVarButton = document.getElementById("fig" + divID + "AddVar");
	var addArrButton = document.getElementById("fig" + divID + "AddArr");
	var addFuncButton = document.getElementById("fig" + divID + "AddFunc");
	var assignButton = document.getElementById("fig" + divID + "Assign");
	var writeButton = document.getElementById("fig" + divID + "Write");
	var writelnButton = document.getElementById("fig" + divID + "Writeln");
	var stringPromptButton = document.getElementById("fig" + divID + "StringPrompt");
	var numericPromptButton = document.getElementById("fig" + divID + "NumericPrompt");
	var whileButton = document.getElementById("fig" + divID + "While");
	var forButton = document.getElementById("fig" + divID + "AddFor");
	var ifThenButton = document.getElementById("fig" + divID + "AddIfThen");
	var ifElseButton = document.getElementById("fig" + divID + "AddIfElse");
	var funcCallButton = document.getElementById("fig" + divID + "FuncCall");
	var returnButton = document.getElementById("fig" + divID + "Return");
	//var walkButtonObj = document.getElementById("fig" + divID + "Walk");
	//var runButtonObj = document.getElementById("fig" + divID + "Run");
	
	addVarButton.onclick = function () { addVariable("variable"); };
	addArrButton.onclick = function () { addVariable("array"); };
	addFuncButton.onclick = function () { addFunction(); };
	assignButton.onclick = function () { addOneLineElement("assignment"); };
	writeButton.onclick = function () { addOneLineElement("write"); };
	writelnButton.onclick = function () { addOneLineElement("writeln"); };
	stringPromptButton.onclick = function () { addOneLineElement("stringPrompt"); };
	numericPromptButton.onclick = function () { addOneLineElement("numericPrompt"); };
	whileButton.onclick = function() { addWhile(); };
	forButton.onclick = function() { addFor(); };
	ifThenButton.onclick = function() { addIfThen(); };
	ifElseButton.onclick = function() { addIfElse(); };
	funcCallButton.onclick = function () { addOneLineElement("functionCall"); };
	returnButton.onclick = function () { addOneLineElement("return"); };
	//walkButtonObj.onclick = function() { walkButton(); }
	//runButtonObj.onclick = function() { runButton(); }
	
	$(document).ready(function() {
            $("#fig" + divID + "OutVarBox").hide(); 
	 });
	 	
	// Walk button listener
	$("#fig" + divID + "Walk").click(function() {
		engine.walkButton();
	});
	
	// Run button listener
	$("#fig" + divID + "Run").click(function() {
		$("#fig" + divID + "OutVarBox").slideUp(function() {
			engine.runButton();
			slidDown = false;
		});
	});
	
	$("#fig" + divID + "OutVarBox").slideUp("medium");
	
	// Mouse events for buttons
	$("#fig" + divID + "Run").mousemove(function() {
		var button = document.getElementById("fig" + divID + "Run");
		
		if (button.textContent == "Run") button.style.backgroundColor = greenHover;
		else button.style.backgroundColor = orangeHover;
	});
	
	$("#fig" + divID + "Run").mouseout(function() {
		var button = document.getElementById("fig" + divID + "Run");
		if (button.textContent == "Run") button.style.backgroundColor = green;
		else button.style.backgroundColor = orange;
	});

	$("#fig" + divID + "Walk").mousemove(function() {
		var button = document.getElementById("fig" + divID + "Walk");
		if (button.textContent == "Walk") button.style.backgroundColor = orangeHover;
		else button.style.backgroundColor = redHover;
	});
	
	$("#fig" + divID + "Walk").mouseout(function() {
		var button = document.getElementById("fig" + divID + "Walk");
		if (button.textContent == "Walk") button.style.backgroundColor = orange;
		else button.style.backgroundColor = red;
	});
	
/* end copy from old controller.js*****************/

	var editor = new Editor("fig" + divID + "Editor", chapterName, exerciseNum, true, true, 1, true, true, true);
	editor.loadEditor('figcontainer-exer' + exerciseNum + 'Editor', divID, true);
	
	var engine = new Engine(divID, chapterName, exerciseNum, editor);
	switch(exerciseNum)
	  {
	  case 9:
	  console.log("case 9");
	  editor.addRow(0, [{ text: "//&nbsp;"+"Variables", type: "comment" }]);
	  //addComment(0, "Variables");
		addVariable(1, "numberOfGrades", "NUMERIC", 0);
		addVariable(2, "total", "NUMERIC", 0);
		addVariable(3, "i", "NUMERIC", 0);
		addVariable(4, "grade", "NUMERIC", 0);
		addVariable(5, "average", "NUMERIC", 0);
		addBlankLine(6);
		//addComment(7, "Main Program");
		editor.addRow(7, [{ text: "//&nbsp;"+"Main Program, type: "comment" }]);
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
	  break;
	  default:
	  break;
	  }
	var variableCount = 0;									// keeps count of the amount of variables
	var funcCount = 0;										// keeps count of number of functions
	var programStart = 0;									// the line the main program starts
	var programCount = 0;
	var firstMove = false;									// keeps track if the user has added something to the main program
	var indent = "&nbsp;&nbsp;&nbsp;"						// indention used for inside brackets
	
	var functionList = [];									// an array of currently declared functions
	var promptFlag = [];
	var rowNum;
	
	var rowType = [];
	var dummyRows = [];
	var lineNums = [];
	var charCountStart = [ ];
	var charCountEnd = [ ];
	var codeStrLen;
	
	/* Weston variables */
	var funcsNamed = []; //functions that have a name
//    var scopedVars = [["global"]]; //list of scopes
	var vFuns = [];
	var nFuns = [];
	var tFuns = [];
	var ftypes = ["Text", "Numeric", "Void"];
	var vtypes = ["Text", "Numeric"];
//	var nvars = [];
//	var tvars = [];
    var wtypes = ["text", "numeric"];
	var resWords = ["new", "this", "var", "ID", "list", "Array", "function", "", "while", "for", "if", "then", "else"];
	var namesUsed = []; //variables that have been name and given a type
//	var varsNamed = []; //variable that have only been given a name and do not have a type
//	var varNames = [];
	var namesRef = [];
//    var compKeys = ["while", "if"];
//    var nExpr = ["numeric constant", "numeric variable", "numeric function call", "EXPR"];
//    var tExpr = ["text constant", "text variable", "text function call", "EXPR + EXPR"];
    
//    var nExprtypes = ["EXPR + EXPR", "EXPR - EXPR", "EXPR * EXPR", "EXPR / EXPR", "EXPR % EXPR", "(EXPR)"];
    var btypes = ["EXPR == EXPR", "EXPR != EXPR", "EXPR > EXPR", "EXPR >= EXPR", "EXPR < EXPR", "EXPR <= EXPR"];
	//var innerTablet;
	var clickRow;
	var clickedCell;
    var clickedCellNum;
	var dial = document.getElementById('selector');
	var dialOKButton;
	var dialCancelButton;
	
	this.addVariable = addVariable;
	this.addFunction = addFunction;
	this.addOneLineElement = addOneLineElement;
	this.addWhile = addWhile;
	this.addFor = addFor;
	this.addIfThen = addIfThen;
	this.addIfElse = addIfElse;
	this.selectLine = selectLine;
	this.getDatatypeSelectedLine = getDatatypeSelectedLine;
	this.isNewLine = isNewLine;
	this.checkPromptFlag = checkPromptFlag;
	this.reset = reset;
	
	//call WatsonEditor's saveEditor
	this.saveEditor = editor.saveEditor;
    
    var varinx = 3;
    var insertionScope = 0;
    var scope = 0;
    var scopes = [];
    var scopeCount = 0;
    scopes.push(new Scope("global", 0));
	
	init();					// initialize some important stuff

	// init() .... it initializes some important stuff .. o_0
	function init() {
		var row;
		var cell;
		var innerTable;

			console.log("here4",!editor.checkEditorData());
		//if there is not already data for this editor, add initial stuff
		if(!editor.checkEditorData()){
			console.log("here5");
			//add initial text
			editor.addRow(0,
				[{text:"//&nbsp;", type:"comment"},
				{text:"Scratch Pad", type:"comment"}]);

			editor.addRow(1,
				[{text:"&nbsp;"}]);

			editor.addRow(2,
				[{text:"//&nbsp;", type:"comment"},
				{text:"Main Program", type:"comment"}]);

		}

		//addNewInsertRow();
		// make a blank row where the program starts (this could have been in the for loops above)
		//row = codeTable.insertRow(3);	// make a new row
		//cell = row.insertCell(0);		// make a new cell here
		//cell.innerHTML = innerTableArrowTemplate;	// set the cell with arrow template
		programStart = 3;				// increate the program start to 2
		//selRow = 3;						// selected row is line 2
		programCount = 3;
		//refreshLineCount();				// refresh the line count along the left margin
	}

	// all this does is initialize the jQuery UI dialog
    //Is this even necessary anymore? rtodo
	$("#selector").dialog({
			modal: false,
			autoOpen: false,
			height: 200,
			width: 175,
			position:[300,20],
			open: function (event, ui) {
					$('#selectDialog').css('overflow', 'hidden'); //this line does the actual hiding
			}
	});

	editor.setCellClickListener(function(event){
		event.stopPropagation();
	//console.log("remember this test? selRow is: " + selRow);
		//a few helpful variables
		var selRow = editor.getSelectedRowIndex();
		var programCount = editor.getRowCount();

		//if we clicked on the insert bar
		if($(this).hasClass("insert")){
			//console.log("in insert code");
			// Grab the the row number so as to edit the editor
			var insertRowNum = $(this).parent().index();
			// Increase the insertRowNum because we want to enter the new statement
			// in the next line in the code window.
			//insertRowNum++;
			/*
			if (selRow-1 == insertRowNum) {
					return;
			}
							
			// Move to the bottom of the editor
			if (insertRowNum > programCount) {
					//moveToLine(programCount);
					editor.selectRowByIndex(programCount);
					return;
			}
			
			// Condition to ensure the insertion is done only at the bottom of the row
			if (editor.rowToArray(insertRowNum).length == 0) {
					return;
			}
			
			// Grab the inner table from the code window
			//try {
			//		var innerTable = codeTable.rows[insertRowNum].cells[0].children[0];
			//		var cellTwoText = innerTable.rows[0].cells[2].innerText;
			//} catch(e) {
			//		console.log(e);	
			//}
			
			//Check to see if this is a valid position
			if (!(checkValidRow(editor.rowToArray(insertRowNum), insertRowNum) || checkValidRow(editor.rowToArray(insertRowNum+1), insertRowNum+1))) {		
					return;		
			}
			*/
			
			//since the editor checks to see if the insert cursor is on the line
			// we are trying to select, all of the logic we need should be taken
			// care of in the insertion bar cursor logic
                                console.log("Selected row: " + selRow);
                                console.log("insertRowNum: " + insertRowNum);
//                                if ((insertRowNum <= programStart) && (selRow >= programStart))
//                                programStart++;
//                                if ((insertRowNum >= programStart) && (selRow <= programStart))
//                                programStart--;
			editor.selectRowByIndex(insertRowNum, true);
                                console.log("selected row index after move: " + editor.getSelectedRowIndex());
                                if ((editor.getSelectedRowIndex() < programStart) && (selRow >= programStart))
                                programStart++;
                                else if ((selRow < programStart) && (editor.getSelectedRowIndex() >= (programStart - 1)))
                                programStart--;
            determineInsertionScope(insertRowNum);
            determineVarinx(insertRowNum);
                                console.log("program start: " + programStart);
			
			/*
			// If all condition is passed move to the specified line
			if (insertRowNum > selRow) {
					//moveToLine(insertRowNum-1);
					editor.selectRowByIndex(insertRowNum);
			}
			else{
					//moveToLine(insertRowNum);
					editor.selectRowByIndex(insertRowNum+1);
			}*/
		}
		//if we clicked anywhere else, probably on the code table
		else{
			var cellVal = $(this).text();					// grab the cell value of clicked cell
			var cellNum = $(this).index();					// grab the cell number of clicked cell
			var rowNum = ($(this).parent().parent().parent().parent().parent().index());	// grab row number in codeTable of clicked cell
			console.log("rowNum: " + rowNum + " cellNum: " + cellNum + " cellVal: " + cellVal);
			/* Weston variables */
			//innerTablet = codeTable.rows[rowNum].cells[0].children[0];
			//clickedCell = innerTablet.rows[0].cells[cellNum];
			clickRow = editor.rowToArrayHtml(rowNum);   //Array of html contents of cells in clickrow
            clickDrow = editor.rowToDOMArray(rowNum);   //Row of DOM objects for the same row as clickRow
			clickedCell = $(this);
			clickedCellNum = cellNum;
			
			if(clickRow.length <= 0)
				return;
			
			// if we click the number of the line (very left cell in each row), we try to delete something
			if (cellNum == 0) {
				//var innerTable = codeTable.rows[rowNum].cells[0].children[0];
				//var row = innerTable.rows[0].cells[2].innerHTML;

				// Users are not allowed to delete some specific rows
				// Example a)Empty Rows b)Comments c)Curly Braces
				
				console.log(clickRow);
				if (rowNum < 2 || clickRow[0] == '&nbsp;' || clickRow[0] == '//&nbsp;' || clickRow.indexOf('{') >= 0 || clickRow.indexOf('}') >= 0 || clickRow[1] =='else') {
					return;
				}
				// User should not be able to delete else statement because it is a part of if function
				//else if (rowContainsString(codeTable, rowNum, "else"))
				//	return;
				else {
					// If the next line has '{' then the whole block should be deleted
					if (rowNum != (editor.getRowCount() - 1) && editor.rowToArray(rowNum+1).indexOf('{') >= 0)	{
						// To determine if the selected row is inside the code block or not.
						var isSelRowInside = false;
						
						// isFunction determines if the current row being deleted is a function or not
						// to remove the trailing empty row.
						var isFunction = false;
						var funcName = "";
                        var funcScope = 1;
						// If the row contains the keyword function
						// Decrease the function count
						
						var bracketFound = 0;

						if (clickRow[0] == "function") {
							funcCount--;
							funcName = clickRow[2];
                            determineScope($(clickDrow[4])); //todo: fix this as well. part of function deletion
                            funcScope = scope;
                                console.log(funcScope);
                                printScopes();
							isFunction = true;
						}

						// Initialize the tableRowCount to 0 because
						// we are iterating starting at the rowNum.
						// This tableRowCount keeps track of the number of rows inside the code block.
						var tableRowCount = 0;

						// Iterate throughout the table, starting at rowNum
						// Exit when '}' is found
						var i = rowNum;
						for (; i < editor.getRowCount(); i++) {
							console.log("\tbrackFound: " + bracketFound);
							// Increase the tableRowCount
							tableRowCount++;
							
							var innerRow = editor.rowToArrayHtml(i);
							console.log("\t", innerRow);

							// If the selected row is inside this current function
							// set isSelRowInside to true and continue.
							if(editor.getSelectedRowIndex() == i) {
								isSelRowInside = true;
								continue;
							}
							
							// To remove the codeblock within a code block
							if (innerRow.indexOf("{") >= 0) {
								bracketFound++;
							}
							// If matching '}' is found then exit out
							else if (innerRow.indexOf("}") >= 0) {
								if (bracketFound > 0) {
									bracketFound--;

									if ((i+1) < editor.getRowCount() && editor.rowToArrayHtml(i+1)[1] == "else") {
											continue;
									}
									if (bracketFound == 0) {
										break;
									}
								}
							}
						}

						// If the selRow is inside the code block
						// move the selRow to the end of the program before deleting the rows.
						if (isSelRowInside) {
							//moveToLine(i);
							editor.selectRowByIndex(i);
							// Reduce the tableRowCount because selecting another row automatically deletes the current row.
							tableRowCount--;
							//isSelRowInside = false;
						}
						
						// Now start deleting the rows starting at rowNum
						for (var i = 1; i <= tableRowCount; i++) {
							deleteOneLineElement(rowNum);
						}

						// If we are removing a function then also delete the trailing empty row
						if (isFunction) {
							//if the selected row was inside the function, move it to the end
							if(isSelRowInside){
								editor.selectRowByIndex(editor.getRowCount()-1, false);
							}
							
							//remove from function list
							if(vFuns.indexOf(funcName) >= 0)
								vFuns.splice(vFuns.indexOf(funcName), 1);
							if(nFuns.indexOf(funcName) >= 0)
								nFuns.splice(nFuns.indexOf(funcName), 1);
							if(tFuns.indexOf(funcName) >= 0)
								tFuns.splice(tFuns.indexOf(funcName), 1);
                            for (fcount=0;fcount<scopes.length;fcount++) { //todo: fix this!
                                if (scopes[fcount].scopenum == funcScope) {
                                    scopes.splice(fcount,1);
                                    break;
                                }
                            }
                            if (scopes[0].namesUsed.indexOf(funcName) >= 0)
                                scopes[0].namesUsed.splice(namesUsed.indexOf(funcName),1);
                                
                            //if there are no more functions, delete "// Functions" and the extra line between the comment and the rest of the program
//							if(funcCount == 0){
//								deleteOneLineElement(rowNum-1);
//								deleteOneLineElement(rowNum-1);
//							}
                            if (scopes.length == 1) { //todo: fix this as well: should not be using funcCount...
                                deleteOneLineElement(rowNum-1);
                                deleteOneLineElement(rowNum-1);
                            }
                            //else, only delete the extra line between functions
                            else{
                                deleteOneLineElement(rowNum);
                            }
                            printScopes();
							isFunction = false;
						}
					}
					// This section basically removes the one one line element.
					else {
						// If the deleted row contains "var" then a variable is being removed from the table
						// subtract 1 from the variableCount
						if (clickRow.indexOf("var") >= 0) {
							//var innerTable = codeTable.rows[rowNum].cells[0].children[0];
							// Grab the variable name
							//var cellContent = innerTable.rows[0].cells[4].textContent;
							// Grab the variable type
							//var cellContentType = innerTable.rows[0].cells[7].textContent;
							
							var varName;
							var varType;
                            var arrayName = 0;
							
							//if row[0] is var, then this is a global variable
							if(clickRow[0] == "var"){

//                                console.log($(clickDrow[2]).attr('class'));
                                determineScope($(clickDrow[4]));
                                if ($(clickDrow[4]).hasClass('array'))
                                    arrayName = clickRow[2] + "[]";
								varName = clickRow[2];
								varType = clickRow[5];
                                if ($(clickDrow[4]).hasClass('array'))
                                    varType = clickRow[11];
//                                console.log(varName);
							}
							//else this is a function variable
							else{
                                determineScope($(clickDrow[5]));
                                if ($(clickDrow[5]).hasClass('array'))
                                    arrayName = clickRow[2] + "[]";
								varName = clickRow[3];
								varType = clickRow[6];
                                if ($(clickDrow[5]).hasClass('array'))
                                    varType = clickRow[12];
//                                console.log(varName);
							}

                            if (arrayName)
                                console.log(arrayName);
							//console.log("\there7 " + varName + " " + (varName !== "ID"));
							if (varName != "ID" && referenceCheck(varName, rowNum)) {
								 createAlertBox("Notice", "You must not reference this variable if you want to delete it.", true, null);
									return;
							}

							//console.log("\there8");
							// If we are removing a text variable then remove the variable from the text variable list
							if (varType === "TEXT") {
//									var index = tvars.indexOf(varName);
//									tvars.splice(index, 1);
                                if (arrayName) {
                                    var index = scopes[scope].tvars.indexOf(arrayName);
                                    scopes[scope].tvars.splice(index,1);
                                }
                                else {
                                    var index = scopes[scope].tvars.indexOf(varName);
                                    scopes[scope].tvars.splice(index,1);
                                }
							}
							// If we are removing a numeric variable then remove the variable from the numeric variable list
							if (varType === "NUMERIC") {
//									var index = nvars.indexOf(varName);
//									nvars.splice(index, 1);
                                if (arrayName) {
                                    var index = scopes[scope].nvars.indexOf(arrayName);
                                    scopes[scope].nvars.splice(index,1);
                                }
                                else {
                                    var index = scopes[scope].nvars.indexOf(varName);
                                    scopes[scope].nvars.splice(index,1);
                                }
							}
                            if (varType === "TYPE") {
                                console.log(arrayName);
                                if (arrayName) {
                                    var index = scopes[scope].unvars.indexOf(arrayName);

                                    scopes[scope].unvars.splice(index,1);
                                }
                                else {
                                    var index = scopes[scope].unvars.indexOf(varName);
                                    scopes[scope].unvars.splice(index,1);
                                }
                            }
							
							//remove the variable name from namesUsed and varsNamed
//							varsNamed.splice(varsNamed.indexOf(varName), 1);
							namesUsed.splice(namesUsed.indexOf(varName), 1);
							
                            if (scope == 0) {
                                variableCount--;
                                console.log(variableCount);
                            }
                                printScopes();
                                varinx--;
							// Delete the current row
							//deleteOneLineElement(rowNum);
							deleteOneLineElement(rowNum);
							
							//console.log("\there9 " + variableCount);
							
							// Remove the variable comment if no variable exists
							if (variableCount == 0) {
								// We have to iterate twice to remove the empty space
								// which is at the bottom of the variable section.
								for (var i = 1; i <= 2; i++) {
								//console.log("\there10");
									// Delete the second row because the variable comment if exists
									// is always at row 2.
									deleteOneLineElement(2);
								}
							}
						} else{
							// Delete the current row	
							deleteOneLineElement(rowNum);
						}
					}
				}

				// Conditions to move the selRow either in or out of the code block
				/*var innerTable = codeTable.rows[rowNum-1].cells[0].children[0];
				if (innerTable.rows[0].cells.length == 2 || innerTable.rows[0].cells[2].innerHTML == "/*&nbsp;") {
					moveToLine(programCount);
				}
				refreshLineCount();
				*/
				//editor.selectRowByIndex(rowNum-1,false);
                                determineVarinx(editor.getSelectedRowIndex());
                                determineInsertionScope(editor.getSelectedRowIndex());
				return;
			}

			if (editor.getSelectedRowIndex() == rowNum) return;			// the selected row was clicked? do nothing
			if (rowNum < variableCount) return;		// we don't allow users to move into variables section

			// if the cell value is a blank (5 non-breaking spaces '\xA0'), we try to move to that location
		/*			if (cellVal == '\xA0\xA0\xA0\xA0\xA0') {
				var innerTable = codeTable.rows[rowNum].cells[0].children[0];		// grab the inner table of this row
				if (checkValidRow(innerTable.rows[0], rowNum) == false) return;		// check to see if this is a valid position
				moveToLine(rowNum);												// move to line if we make it here
			}
		*/
			//reset the cellNum and subtract 2 to work with editor.rowToArray()
			cellNum = $(this).index() - 2;
			clickedCellNum = cellNum;
		
			/* Weston's dialogs */
                                clickHandler();
//			if (cellVal == 'TYPE' || cellVal == 'TEXT' || cellVal == 'NUMERIC' || cellVal == 'VOID')
//			{
//				if (clickRow[cellNum-7] == 'function')
//				{
//					console.log("looking at a function type");
//					if (foundIn(clickRow[cellNum-5], namesRef))
//					{
//						console.log("Can't change type. Is reffed.\n");
//					}
//					else
//					{
//						console.log("not reffed.");
//						if (foundIn(clickRow[cellNum-5], namesUsed))
//						{
//							console.log("used.");
//							delN(clickRow[cellNum-5], nFuns);
//							delN(clickRow[cellNum-5], tFuns);
//							delN(clickRow[cellNum-5], vFuns);
//							delN(clickRow[cellNum-5], namesUsed);
//							createSelector("Select Type", ftypes, ftypeConfirm);
//		//                            $("#selector").empty();
//		//                            generateSelectionHTML(ftypes, "ftype");
//		//                            $("#selector").dialog('open');
//						}
//						else
//						{
//							console.log("not used.");
//							createSelector("Select Type", ftypes, ftypeConfirm);
//		//                            $("#selector").empty();
//		//                            generateSelectionHTML(ftypes, "ftype");
//		//                            $("#selector").dialog('open');
//						}
//					}
//				}
//				else if (clickRow[cellNum-5] == 'var')
//				{
//					console.log("HERE");
//					if (foundIn(clickRow[cellNum-3], namesRef))
//					{
//						console.log("Can't change type. Is reffed.\n");
//					}
//					else
//					{
//						console.log("not reffed.");
//						if (foundIn(clickRow[cellNum-3], namesUsed))
//						{
//							console.log("used.");
//							delN(clickRow[cellNum-3], nvars);
//							delN(clickRow[cellNum-3], tvars);
//							delN(clickRow[cellNum-3], namesUsed);
//							createSelector("Select Type", vtypes, typeConfirm);
//		//                            $("#selector").empty();
//		//                            generateSelectionHTML(vtypes, "type");
//		//                            $("#selector").dialog('open');
//						}
//						else
//						{
//							console.log("not used.");
//							createSelector("Select Type", vtypes, typeConfirm);
//		//                            $("#selector").empty();
//		//                            generateSelectionHTML(vtypes, "type");
//		//                            $("#selector").dialog('open');
//						}
//						
//						if(clickRow[cellNum-3] != 'ID' && !foundIn(clickRow[cellNum-3], namesRef)){
//							namesUsed.push(clickRow[cellNum-3]);
//						}
//					}
//				}
//				else if (clickRow[cellNum-11] == 'var')
//				{
//					console.log("array?");
//					if (foundIn(clickRow[cellNum-9].concat("[]"), namesRef))
//					{
//						console.log("Can't change type. Is reffed.\n");
//					}
//					else
//					{
//						console.log("not reffed.");
//						if (foundIn(clickRow[cellNum-9].concat("[]"), namesUsed))
//						{
//							console.log("used.");
//							delN(clickRow[cellNum-9].concat("[]"), nvars);
//							delN(clickRow[cellNum-9].concat("[]"), tvars);
//							delN(clickRow[cellNum-9].concat("[]"), namesUsed);
//							createSelector("Select Type", vtypes, typeConfirm);
//		//                            $("#selector").empty();
//		//                            generateSelectionHTML(vtypes, "type");
//		//                            $("#selector").dialog('open');
//						}
//						else
//						{
//							console.log("not used.");
//							createSelector("Select Type", vtypes, typeConfirm);
//		//                            $("#selector").empty();
//		//                            generateSelectionHTML(vtypes, "type");
//		//                            $("#selector").dialog('open');
//						}
//					}
//				}
//			}
//			if (cellVal == 'EXPR')
//			{
//				switch (exprtype())
//				{
//					case ('PRINT'):
//							console.log('print');
//							createSelector("Print Type Selection", wtypes, exprConfirm);
//							//dialog openSelector("Print Types", wtypes).done(function(returned) { exprConfirm(returned); returnToNormalColor(); });
//							break;
//					case ('BOOL'):
//							console.log("bool");
//							createSelector("Comparison Type Selection", btypes, boolConfirm);
//		//                            $("#selector").empty();
//		//                            generateSelectionHTML(btypes, "bool");
//		//                            $("#selector").dialog('open');
//							break;
//					case ('TEXT ASSIGNMENT'):
//							createSelector("Text Selection", tExpr, exprSelConfirm);
//		//                            $("#selector").empty();
//		//                            generateSelectionHTML(tExpr, "expr");
//		//                            $("#selector").dialog('open');
//						break;
//					case ('NUMERIC ASSIGNMENT'):
//							createSelector("Numeric Selection", nExpr, exprSelConfirm);
//		//                            $("#selector").empty();
//		//                            generateSelectionHTML(nExpr, "expr");
//		//                            $("#selector").dialog('open');
//							break;
//					case ('PROMPTMSG'):
//							createSelector("Prompt", ["text constant", "text variable"], exprSelConfirm);
//		//                            $("#selector").empty();
//		//                            generateSelectionHTML(["text constant", "text variable"], "expr");
//		//                            $("#selector").dialog('open');
//						break;
//					case ('PROMPTDFLT'):
//							createSelector("Prompt", ["text constant", "text variable"], exprSelConfirm);
//		//                            $("#selector").empty();
//		//                            generateSelectionHTML(["text constant", "text variable"], "expr");
//		//                            $("#selector").dialog('open');
//						break;
//					case ('PARSEDFLT'):
//							createNumPad(null, null, "Default", "Enter a default value for this prompt.", true, 10, enterNum);
//							//dialog openNumPad(null,null,"Enter default value", "some text", false, 10).done(function(result) {clickedCell.textContent = result; });
//							
//						break;
//					case ('NUMERIC COMPARISON'):
//							createSelector("Comparison Type Selection?", nExpr, exprSelConfirm);
//		//                            $("#selector").empty();
//		//                            generateSelectionHTML(nExpr, "expr")
//		//                            $("#selector").dialog('open');
//						break;
//					case ('RETURN'):
//							createSelector("What type?????", wtypes, exprConfirm);
//							//dialog openSelector("What type?", wtypes).done(function(returned) { exprConfirm(returned); });
//							break;
//					default:
//						break;
//				}
////			}
//			if (cellVal == 'ID' && cellNum > 1 && foundIn(clickRow[cellNum-2],compKeys))
//			{
//				//Choosing the left side of a comparison in a while or if
//				createSelector("Choose an identifier.", namesUsed, idConfirm);
//			}
//			else if (cellVal == 'ID' && cellNum > 1 && clickRow[cellNum-2] == 'function')
//			{
//				//Assigning an identifier to a function
//				createStringPad("Function ID", "Please name the function.", fIDconfirm);
//			}
//			else if (cellVal == 'FUNCTION') {
//				//Calling a function
//				createSelector("Function Call", ftypes, fcallType);
//			}
//			else if (cellVal == 'SIZE')
//			{
//				//Choosing a size for an Array
//				createNumPad(0,null,"Array Size", "Enter a size for the array.", false, 10, enterNum);
//			}
			/*Weston edit end*/
//			else if (cellVal == 'ID' && clickRow[1] == 'for' && cellNum == 3)
//			{
////				console.log("for id");s
//				createSelector("Counter Selection", nvars, forId);
//			}
//			else if (cellVal == 'ID' && clickRow.indexOf('var') >= 0) {
//				createStringPad("Variable ID", "Please name the variable", nameDialogConfirm);
//			}
//			else if (cellVal == 'ID' && clickRow[cellNum+2] == '=')
//			{
//				createSelector("Choose a variable to assign.", namesUsed, idConfirm);
//			}
//            if (cellVal == 'index')
//            {
//                createSelector("Constant or Variable?", ["Constant", "Variable"], indexConfirm);
//            }
//			 if((clickedCell.hasClass('openParen') || clickedCell.hasClass('closeParen')) && (clickRow.indexOf('function') >= 0) && (clickRow.indexOf('ID') != 2)){
//                while(!clickedCell.hasClass('closeParen')){
//                    clickedCell = clickedCell.next();
//                }
//                clickedCell = clickedCell.prev();
//                if (clickedCell.text() == "*/") {
//                    editor.addCell(clickedCell,[{text: ",&nbsp;"}]);
//                    clickedCell = clickedCell.next();
//                }
//				console.log("add parameter?");
//                editor.addCell(clickedCell,
//                               [{text:"ID", type: "parameter"},
//                                {text:"&nbsp;/*", type: "datatype"},
//                                {text:"TYPE", type: "datatype paramType"},
//                                {text:"*/", type: "datatype"}]
//                );
//			}
//                if (clickedCell.hasClass('paramType')) {
//                    createSelector("Type options", vtypes, paramTypeConfirm);
//                }
		}
		
		return false;
	});

	editor.setInsertBarMouseEnterListener(function(event){
		event.stopPropagation();
	   /** Implementation for '>' **/
		// Grab the the row number so as to edit the editor
		var insertRowNum = $(this).parent().index();
		
		//a few helpful variables
		var selRow = editor.getSelectedRowIndex();
		var programCount = editor.getRowCount()-1;
		//console.log("insertRowNum " + insertRowNum, "programCount: " + programCount);
		
		// Increase the insertRowNum because we want to enter the new statement
		// in the next line in the code window.
		//insertRowNum++;
			
		if (selRow-1 == insertRowNum) {
				//$(this).css('cursor', 'default');
				return false;
		}
		
		// Display the cursor at the very bottom of the editor
		if (insertRowNum >= programCount) {
				//$(this).css('cursor', 'pointer');
				//$(this).html(">");
				editor.moveInsertionBarCursor(programCount);
				return false;
		}

		// For empty row
		if (editor.rowToArrayHtml(insertRowNum).length == 0) {
				//$(this).css('cursor', 'default');
				return false;
		}
		/*
		try {
				var innerTable = codeTable.rows[insertRowNum].cells[0].children[0];
				var cellTwoText = innerTable.rows[0].cells[2].innerText;
		} catch(e) {
				console.log("Error:", e.message);	
		}*/
		
		//console.log(insertRowNum);
		/*
		console.log("\t1 " + insertRowNum + " " + editor.rowToArrayHtml(insertRowNum).length,editor.rowToArrayHtml(insertRowNum));
		console.log(canInsertAfter(editor.rowToArrayHtml(insertRowNum), insertRowNum));
		console.log("\t2 " + (insertRowNum+1) + " " + editor.rowToArrayHtml(insertRowNum+1).length,editor.rowToArrayHtml(insertRowNum+1));
		console.log(canInsertBefore(editor.rowToArrayHtml(insertRowNum+1), insertRowNum+1));
		console.log("-----------------------------------------------------------------");
		*/
			/*
		// Check if the row is valid or not
		if (!(checkValidRow(editor.rowToArray(insertRowNum), insertRowNum) || checkValidRow(editor.rowToArray(insertRowNum+1), insertRowNum+1))) {		
				//$(this).css('cursor', 'default');
				return false;		
		}*/
		
		//if you can insert after the current row, continue
		if(!canInsertAfter(editor.rowToArrayHtml(insertRowNum)))
			return false;
		
		//if you can insert before the next row, continue
		if(!canInsertBefore(editor.rowToArrayHtml(insertRowNum+1)))
			return false;
		
		//so by here, we should be able to insert after the current row and before the next row
		
		// When hovered, display the cursor
		//$(this).css('cursor', 'pointer');
		//$(this).html(">");
		editor.moveInsertionBarCursor(insertRowNum);
		
		return false;
	});
	
	// checkValidRow() makes sure the program doesn't move somewhere that it shouldn't
	// For example, we don't want the user moving into the variable sections
	function checkValidRow(row, rowNum) {
		if (row.length <= 0) return false;
		if (row[0].indexOf("//") >= 0) return false;								// don't let the user edit a comment
		if (row[0] == '\xA0')  return false;											// don't let the user edit a blank line
		if (row[1] == 'if') return false;
		if (row[1] == 'else') return false;
		if (row[1].indexOf("{") >= 0) return false;
		if (row[1].indexOf("{") >= 0 && rowNum >= programStart) return false;		// don't let the user edit before a '{'
		if (rowNum < variableCount + 3) return false;												// don't let the user edit in the variable space

		// the following if statements ensure that a user doesn't edit before the program start (in the variable or function space..
		// unless its inside a function)
		if ((editor.getSelectedRowIndex() < programStart && rowNum < programStart + 1) || (rowNum < programStart)) {
				if (row[0].indexOf("{") >= 0&& editor.getSelectedRowIndex() > rowNum) return false;
				if (row[0].indexOf("function") >= 0) return false;
		}
		return true;
	}
	
	//true if yes, false if no
	function canInsertBefore(row){
		if (row.length <= 0) return false;
		if (row[0].indexOf("//") >= 0) return false;
		if (row.indexOf('var') >= 0) return false;
		if (row[0] == 'function') return false;
		if (row[0] == '&nbsp;')  return false;
		
		if(row.length > 1){
			if (row.indexOf("{") >= 0) {console.log("found{"); return false;}
			if (row[1] == 'else') return false;
		}
			
		return true;
	}
	
	function canInsertAfter(row){
		if (row.length <= 0) return false;
		if(row[0] == 'var') return false;
		if (row[0] == 'function') return false;
		if (row[0] == '&nbsp;')  return false;
		
		if(row.length > 1){
			if (row[1] == 'else') return false;
			if (row[1].indexOf("while") >= 0) return false;
			if (row[1].indexOf("for") >= 0) return false;
			if (row[1].indexOf("if") >= 0) return false;
		}
			
		return true;
	}
	
/*
	// check to see if a specific cell contains a keywords; return true if so
	function cellContainsKeyword(table, cellNo) {
		if (table.rows[0].cells[cellNo].innerHTML.indexOf("while") >= 0) return true;
		if (table.rows[0].cells[cellNo].innerHTML.indexOf("if") >= 0) return true;
		if (table.rows[0].cells[cellNo].innerHTML.indexOf("else") >= 0) return true;
		if (table.rows[0].cells[cellNo].innerHTML.indexOf("for") >= 0) return true;
		if (table.rows[0].cells[cellNo].innerHTML.indexOf("return") >= 0) return true;

		return false;
	}

	function containsControlStructure(text) {
		if (text.indexOf("while") >= 0) return true;
		if (text.indexOf("if") >= 0) return true;
		if (text.indexOf("else") >= 0) return true;
		if (text.indexOf("for") >= 0) return true;
	}

	// check to see if a specific cell contains a keywords; return true if so
	function cellContainsKeyword(table, cellNo) {
		if (table.rows[0].cells[cellNo].innerHTML.indexOf("while") >= 0) return true;
		if (table.rows[0].cells[cellNo].innerHTML.indexOf("if") >= 0) return true;
		if (table.rows[0].cells[cellNo].innerHTML.indexOf("else") >= 0) return true;
		if (table.rows[0].cells[cellNo].innerHTML.indexOf("for") >= 0) return true;
		if (table.rows[0].cells[cellNo].innerHTML.indexOf("return") >= 0) return true;

		return false;
	}*/

	// addVariable() is responsible for adding a variable/array declaration
	function addVariable(element) {
		var row;
		var cell;
		var innerTable;

		// if there are no variables initialized yet add some stuff
		if (variableCount == 0 && varinx == 3) {
			editor.addRow(variableCount + 2,
				[{text:"//&nbsp;", type:"comment"},
				{text:"Variables", type:"comment"}]);
				
			editor.addRow(variableCount + 3,
				[{text:"&nbsp;"}]);

			programStart += 2;	// increase the program start line
			//selRow++;		// increase the selected row
			programCount += 2;
		}
		
        if (insertionScope == 0) {
            // if the element is a variable
            if (element == "variable") {
			//adds "var ID; /*TYPE*/"
                editor.addRow(varinx,
                              [{text:"var", type:"keyword"},
                               {text:"&nbsp;"},
                               {text:"ID", type:"vname scope" + insertionScope}, //todo. Add this to everywhere involving variable declarations?
                               {text:";&nbsp;"},
                               {text:"&nbsp;/*", type:"datatype"},
                               {text:"TYPE", type:"datatype vtype scope" + insertionScope},
                               {text:"*/", type:"datatype"}]);
            }
            // if its an array
            else if (element == "array") {
                //add "var ID = new Array(size); /*TYPE*/"
                editor.addRow(varinx,
                          [{text:"var", type:"keyword"},
                           {text:"&nbsp;"},
                           {text:"ID", type:"vname array scope" + insertionScope},
                           {text:"&nbsp;=&nbsp;"},
                           {text:"new&nbsp;", type:"keyword"},
                           {text:"Array"},
                           {text:"(", type:"openParen"},
                           {text:"SIZE", type:"size"},
                           {text:")", type:"closeParen"},
                           {text:";"},
                           {text:"&nbsp;/*", type:"datatype"},
                           {text:"TYPE", type:"datatype vtype array scope" + insertionScope},
                           {text:"*/", type:"datatype"}]);
            }
        }
        else {
            console.log("WTF");
            // if the element is a variable
            if (element == "variable") {
                //adds "var ID; /*TYPE*/"
                editor.addRow(varinx,
                              [{text:findIndentation(editor.getSelectedRowIndex())},
                               {text:"var", type:"keyword"},
                               {text:"&nbsp;"},
                               {text:"ID", type:"vname scope" + insertionScope}, //todo. Add this to everywhere involving variable declarations?
                               {text:";&nbsp;"},
                               {text:"&nbsp;/*", type:"datatype"},
                               {text:"TYPE", type:"datatype vtype scope" + insertionScope},
                               {text:"*/", type:"datatype"}]);
            }
            // if its an array
            else if (element == "array") {
                //add "var ID = new Array(size); /*TYPE*/"
                editor.addRow(varinx,
                              [{text:findIndentation(editor.getSelectedRowIndex())},
                               {text:"var", type:"keyword"},
                               {text:"&nbsp;"},
                               {text:"ID", type:"vname array scope" + insertionScope},
                               {text:"&nbsp;=&nbsp;"},
                               {text:"new&nbsp;", type:"keyword"},
                               {text:"Array"},
                               {text:"(", type:"openParen"},
                               {text:"SIZE", type:"size"},
                               {text:")", type:"closeParen"},
                               {text:";"},
                               {text:"&nbsp;/*", type:"datatype"},
                               {text:"TYPE", type:"datatype vtype array scope" + insertionScope},
                               {text:"*/", type:"datatype"}]);
            }
        }

		//selRow++;			// increase the selected row
        if (insertionScope == 0)
            variableCount++;	// increase the variable count
		programStart++;		// increase the program start line
		programCount++;
        varinx++;
		//toggleEvents();		// toggle events to refresh the newly created row
		//refreshLineCount();	// refresh the line count
	}

	// addOneLineElement() is responsible for adding elements that only require one line (excluding variable and array declarations)
	function addOneLineElement(element) {
		//if this is the very first move to add to the main program, add the main program comment
		//if (!firstMove) {
		//	addMainProgramComment();
			firstMove = true;
		//}

		var indentStr = findIndentation(editor.getSelectedRowIndex());	// get the correct indentation
		//var indentStr = "";

		// depending on which element it is, format the row correspondingly
		if (element == "assignment"){
			//adds "ID = EXPR;
			editor.addRow(editor.getSelectedRowIndex(),
				[{text:indentStr},
                 {text:"ID", type:"aID scope" + insertionScope},
				{text:"&nbsp;"},
				{text:"="},
				{text:"&nbsp"},
                 {text:"EXPR", type:"expr scope" + insertionScope},
				{text:";"}]);
		}
		else if (element == "write") {
			//adds "document.write(EXPR);"
			editor.addRow(editor.getSelectedRowIndex(),
				[{text:indentStr},
				{text:"document.write", type:"keyword"},
				{text:"(", type:"openParen"},
                 {text:"EXPR", type:"expr write scope" + insertionScope},
				{text:")", type:"closeParen"},
				{text:";"}]);
		}
		else if (element == "writeln") {
			//adds "document.writeln(EXPR);"
			editor.addRow(editor.getSelectedRowIndex(),
				[{text:indentStr},
				{text:"document.writeln", type:"keyword"},
				{text:"(", type:"openParen"},
                 {text:"EXPR", type: "expr write scope" + insertionScope},
				{text:")", type:"closeParen"},
				{text:";"}]);
		}
		else if (element == "stringPrompt") {
			//adds "ID = prompt(EXPR, EXPR);"
			editor.addRow(editor.getSelectedRowIndex(),
				[{text:indentStr},
                 {text:"ID", type:"taID scope" + insertionScope},
				{text:"&nbsp;"},
				{text:"="},
				{text:"&nbsp;"},
				{text:"prompt", type:"keyword"},
				{text:"(", type:"openParen"},
                 {text:"EXPR", type:"expr text scope" + insertionScope},
				{text:",&nbsp;"},
                 {text:"EXPR", type:"expr text scope" + insertionScope},
				{text:")", type:"closeParen"},
				{text:";"}]);
		}
		else if (element == "numericPrompt") {
			//adds "ID = parseFloat(prompt(EXPR, EXPR));
			editor.addRow(editor.getSelectedRowIndex(),
				[{text:indentStr},
                 {text:"ID", type:"naID scope" + insertionScope},
				{text:"&nbsp;"},
				{text:"="},
				{text:"&nbsp;"},
				{text:"parseFloat", type:"keyword"},
				{text:"(", type:"openParen"},
				{text:"prompt", type:"keyword"},
				{text:"(", type:"openParen"},
                 {text:"EXPR", type: "expr text scope" + insertionScope},
				{text:","},
                 {text:"EXPR", type: "expr numeric scope" + insertionScope},
				{text:")", type:"closeParen"},
				{text:")", type:"closeParen"},
				{text:";"}]);
		}
		else if (element == "functionCall") {
			//adds "ID = FUNCTION();"
			editor.addRow(editor.getSelectedRowIndex(),
				[{text:indentStr},
                 {text:"FUNCTION", type: "fcall scope" + insertionScope},
				{text:"(", type:"openParen"},
				{text:")", type:"closeParen"},
				{text:";"}]);
		}
		else if (element == "return") {
			//adds "return EXPR;"
			editor.addRow(editor.getSelectedRowIndex(),
				[{text:indentStr},
				{text:"return", type:"keyword"},
				{text:"&nbsp;"},
                 {text:"EXPR", type:"expr return scope" + insertionScope},
				{text:";"}]);
		}

		//selectRow(selRow+1);				// increase the selected row by one

		// if the selected row is less than the program start line (editing a function), increase program start
		if (editor.getSelectedRowIndex() < programStart) programStart++;
		programCount++;
		//toggleEvents();									// toggle events to refresh them
		//refreshLineCount();								// and also refresh line count
	
	
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
	
	
	}//end of function JSEditor


	// addIfThen() is responsible for adding an If/Then control structure
	function addIfThen() {
		// if this is the first move the user has made toward the main program, put the main program comment
		//if (!firstMove) {
		//	addMainProgramComment();
			firstMove = true;
		//}
		var indentStr = findIndentation(editor.getSelectedRowIndex());	// get the correct indentation
		//var indentStr = "";
		
		//adds "if(EXPR)"
		editor.addRow(editor.getSelectedRowIndex(),
			[{text:indentStr},
			{text:"if", type:"keyword"},
			{text:"(", type:"openParen"},
             {text:"EXPR", type:"expr bool scope" + insertionScope},
			{text:")", type:"closeParen"},
			]);
		
		//adds "{"
		editor.addRow(editor.getSelectedRowIndex(),
			[{text:indentStr},
			{text:"{", type:"openBrack"}]);
			
		//adds "}"
		editor.addRow(editor.getSelectedRowIndex(),
			[{text:indentStr},
			{text:"}", type:"closeBrack"}]);
		
		//selectRow(selRow + 3);								// increase the selected row by 3 (added three items)

		if (editor.getSelectedRowIndex() <= programStart) programStart += 3;		// if the selected row is less than the program start (editing a function), increase program start by 3
		programCount+=3;
		//toggleEvents();										// toggle events
		//refreshLineCount();									// refresh the line count
	}

	// addIfElse() is very similar to addIfThen() except we add the 'else'
	function addIfElse() {
		//if (!firstMove) {
		//	addMainProgramComment();
			firstMove = true;
		//}
		var indentStr = findIndentation(editor.getSelectedRowIndex());
		//var indentStr = "";
		
		//adds "if(EXPR)"
		editor.addRow(editor.getSelectedRowIndex(),
			[{text:indentStr},
			{text:"if", type:"keyword"},
			{text:"(", type:"openParen"},
             {text:"EXPR", type:"expr bool scope" + insertionScope},
			{text:")", type:"closeParen"},
			]);
			
		//adds "{"
		editor.addRow(editor.getSelectedRowIndex(),
			[{text:indentStr},
			{text:"{", type:"openBrack"}]);
			
		//adds "}"
		editor.addRow(editor.getSelectedRowIndex(),
			[{text:indentStr},
			{text:"}", type:"closeBrack"}]);
			
		//adds "else"
		editor.addRow(editor.getSelectedRowIndex(),
			[{text:indentStr},
			{text:"else", type:"keyword"}]);
			
		//adds "{"
		editor.addRow(editor.getSelectedRowIndex(),
			[{text:indentStr},
			{text:"{", type:"openBrack"}]);
			
		//adds "}"
		editor.addRow(editor.getSelectedRowIndex(),
			[{text:indentStr},
			{text:"}", type:"closeBrack"}]);
			
		//selectRow(selRow + 6);

		if (editor.getSelectedRowIndex() <= programStart) programStart += 6;
		programCount += 6;
		//toggleEvents();
		//refreshLineCount();
	}

	// addWhile() is very similar to adding any other structure
	function addWhile() {
		//if (!firstMove) {
		//	addMainProgramComment();
			firstMove = true;
		//}
		var indentStr = findIndentation(editor.getSelectedRowIndex());
		//var indentStr = "";
		
		//adds "while(EXPR)"
		editor.addRow(editor.getSelectedRowIndex(),
			[{text:indentStr},
			{text:"while", type:"keyword"},
			{text:"(", type:"openParen"},
             {text:"EXPR", type:"expr bool scope" + insertionScope},
			{text:")", type:"closeParen"},
			]);
			
		//adds "{"
		editor.addRow(editor.getSelectedRowIndex(),
			[{text:indentStr},
			{text:"{", type:"openBrack"}]);
			
		//adds "}"
		editor.addRow(editor.getSelectedRowIndex(),
			[{text:indentStr},
			{text:"}", type:"closeBrack"}]);
			
		//selectRow(selRow + 3);

		if (editor.getSelectedRowIndex() <= programStart) programStart += 3;
		programCount += 3;
		//toggleEvents();
		//refreshLineCount();
	}

	// addFor() adds a for loop to the current selected line just like addWhile()
	function addFor() {
		//if (!firstMove) {
		//	addMainProgramComment();
			firstMove = true;
		//}
		var indentStr = findIndentation(editor.getSelectedRowIndex());
		//var indentStr = "";
		
		//adds "for(ID = EXPR; ID < EXPR; ID++)"
		editor.addRow(editor.getSelectedRowIndex(),
			[{text:indentStr},
			{text:"for", type:"keyword"},
			{text:"(", type:"openParen"},
             {text:"ID", type:"naID iforID scope" + insertionScope},
			{text:"&nbsp;"},
			{text:"="},
			{text:"&nbsp;"},
             {text:"EXPR", type:"expr numeric scope" + insertionScope},
			{text:";&nbsp;"},
             {text:"ID", type:"forID scope" + insertionScope},
			{text:"&nbsp;"},
			{text:"&lt;&nbsp;"},
             {text:"EXPR", type:"expr numeric scope" + insertionScope},
			{text:";&nbsp;"},
             {text:"ID", type:"forID scope" + insertionScope},
			{text:"++"},
			{text:")", type:"closeParen"}]);
			
		//adds "{"
		editor.addRow(editor.getSelectedRowIndex(),
			[{text:indentStr},
			{text:"{", type:"openBrack"}]);
			
		//adds "}"
		editor.addRow(editor.getSelectedRowIndex(),
			[{text:indentStr},
			{text:"}", type:"closeBrack"}]);
			
		
		//selectRow(selRow + 3);

		if (editor.getSelectedRowIndex() <= programStart) programStart += 3;
		programCount += 3;
		//toggleEvents();
		//refreshLineCount();
	}

	// addFunction() adds a new function declaration before the program start and after the variables declarations
	function addFunction() {
		var beginRow;
        var saveRow = editor.getSelectedRowIndex();
//        editor.selectRowByIndex((programStart), true);
        console.log(programStart);
        
		// if the user hasn't edited the main program OR selected row is less than program start, we begin at the program start line
		//if (firstMove) {
		if (editor.getSelectedRowIndex() < programStart) {
            editor.selectRowByIndex(editor.getRowCount()-1, false);
            programStart--;
			beginRow = programStart;
		} else {
			beginRow = programStart-1;
		}
        
		//if (!firstMove || selRow < programStart) beginRow = programStart;
		//else beginRow = programStart - 1;	// otherwise, we begin at programStart - 1
        
		// if we haven't added a function yet, we must insert the '// Functions' comment
		if (funcCount == 0) {
            /*row = codeTable.insertRow(beginRow);							// add the row at the 'beginRow' index
            cell = row.insertCell(0);
            cell.innerHTML = innerTableTemplate;
            innerTable = codeTable.rows[beginRow].cells[0].children[0];
            */
            //if (selRow >= beginRow) selRow++;								// increase selected row if it is greater or equal to beginRow
            
            //addRow(innerTable, [ "//&nbsp;", "Functions" ], 2);
            //addRowStyle(innerTable, [ green, green, ], 2);
			
			editor.addRow(beginRow,
				[{text:"//&nbsp;", type:"comment"},
				{text:"Functions", type:"comment"}]);
			
            beginRow++;
            
            programStart++;	// increase program start line
            programCount++;
		}
        
		// add a blank line at begin row (this creates a blank line after the function declaration)
		/*row = codeTable.insertRow(beginRow);
		cell = row.insertCell(0);
		cell.innerHTML = innerTableTemplate;
		innerTable = codeTable.rows[beginRow].cells[0].children[0];
		addRow(innerTable, [ "&nbsp;" ], 2);*/
		
		editor.addRow(beginRow, [{text:"&nbsp;"}]);
		
		programStart++;
		programCount++;
		//if (selRow >= beginRow) selRow++;
        /*
		for (var i = 0; i < 3; i++) {											// iterate three times
			row = codeTable.insertRow(beginRow + i);							// create a row at beginRow
			cell = row.insertCell(0);											// insert a new cell in the row
			cell.innerHTML = innerTableTemplate;								// put our inner table template here
			innerTable = codeTable.rows[beginRow + i].cells[0].children[0];		// grab the innerTable object we just created
            
			// add the row on the first iteration, a '{' on second iteration, and a '}' on third iteration
			if (i == 0) {
				addRow(innerTable, [ "function", "&nbsp;", "ID", "(", ")", "&nbsp;", "/", "VOID", "/" ], 2);
				addRowStyle(innerTable, [ blue, black, black, black, black, black, blue, blue, blue ], 2);
			}
			else if (i == 1) addRow(innerTable, [ "{" ], 2);
			else if (i == 2) addRow(innerTable, [ "}" ], 2);
            
			if (selRow >= beginRow + i) selRow++;	// if the selected row is greater than or equal to the current row, increase selected row
		}*/
		
		//adds "function ID() /*VOID*/"
        scopes.push(new Scope(++scopeCount, scopeCount));
		editor.addRow(beginRow++,
			[{text:"function", type:"keyword"},
			{text:"&nbsp;"},
             {text:"ID", type:"fname scope" + scopeCount},
			{text:"(", type:"openParen foParen scope" + scopeCount},
			{text:")", type:"closeParen fcParen scope" + scopeCount},
			{text:"&nbsp;"},
			{text:"/*", type:"datatype"},
			{text:"Void", type:"datatype ftype scope" + scopeCount},
			{text:"*/", type:"datatype"}]);
			
		//adds "{"
		editor.addRow(beginRow++,
			[{text:"{", type:"openBrack"}]);
			
		//adds "}"
		editor.addRow(beginRow++,
			[{text:"}", type:"closeBrack"}]);
		
		//selectRow(selRow);							// make sure the 'selRow' row is selected
        
		programStart += 3;							// increase the program start by 3
		programCount += 3;
		funcCount++;								// increase the function count
		functionList.push("FUNCTION");				// push FUNCTION to the function list
		//toggleEvents();								// refresh events
		//refreshLineCount();							// refresh the line count
	}
/*
	// addRow() takes an innerTable, a string of cell values, and a start index and populates the innerTable with these values
	function addRow(table, values, startInd) {
		var cell;
		for (var i = 0; i < values.length; i++) {			// for all cells in the table
			cell = table.rows[0].insertCell(startInd++);	// insert a cell at startInd
			cell.innerHTML = values[i];						// make the innerHTML of the cell cells[i]
		}
        addNewInsertRow();
	}

	// addRowStyle() takes an innerTable, a string of colors, and a start index and styles the innerTable cells with these colors
	function addRowStyle(table, colors, startInd) {
		var cell;
		for (var i = 0; i < colors.length; i++) {			// for all cells in the table
			cell = table.rows[0].cells[startInd++];			// get the cell at the current index
			cell.style.color = colors[i];					// change its style to cells[i]
		}
	}
*/
	// deleteFunction() checks to see what the element is that is requested to be deleted, and deletes that element
	function deleteFunction(rowNum, colNum) {
		var innerTable = codeTable.rows[rowNum].cells[0].children[0];			// grab the inner table that needs to be deleted

		if (isOneLineElement(innerTable.rows[0])) deleteOneLineElement(rowNum);	// if its a one line element, delete it
	}

	// deleteOneLineElement() is responsible for appropriately deleting an element that takes up one line
	function deleteOneLineElement(rowNum) {
		console.log("\tdelete:", rowNum, editor.rowToArrayHtml(rowNum));
		if (programStart > rowNum) programStart--;

		// Delete row from the editor
		editor.deleteRow(rowNum);
		programCount--;
	}

	// isOneLineElement() checks to see if the row passed is a one line element such as an assignment
	function isOneLineElement(row) {
		var rowLength = row.cells.length;

		if (rowLength == 6) {
			for (var i = 0; i < rowLength; i++) {
				if (row.cells[i].textContent.indexOf("=") >= 0) { return true; }		// check for assignment
				if (row.cells[i].textContent.indexOf("write") >= 9) { return true; }	// check for a write/writeln
			}
		}
		else if (rowLength == 10) {
			for (var i = 0; i < rowLength; i++) {
				if (row.cells[i].textContent.indexOf("prompt") >= 0) { return true; }	// check for a prompt
			}
		}
		else if (rowLength == 12) {
			for (var i = 0; i < rowLength; i++) {
				if (row.cells[i].textContent.indexOf("prompt") >= 0) { return true; }	// check for a prompt again (numeric prompt)
			}
		}
		else {
			if (row.cells[2].textContent.indexOf("return") >= 0) return true;			// check for a return
			if (row.cells[2].textContent.indexOf("FUNCTION") >= 0) return true;		// check for a function that hasn't been renamed
			if (functionExists(row.cells[2].textContent)) return true;				// check to see if the function exists that has been named
		}
	}

	// functionExists() returns true or false depending if a function is found in the function list
	function functionExists(cellText) {
		for (var i = 0; i < functionList.length; i++) {
			if (cellText.contains(functionList[i])) return true;
		}

		return false;
	}
/*
	// selectRow() selects a row with the specified rowNum
	function selectRow(rowNum) {
		if (selRow != -1) {														// if there is a selected row
			var innerTable = codeTable.rows[selRow].cells[0].children[0];		// grab the innerTable for the currently selected row
			innerTable.rows[0].cells[0].innerHTML = blank;						// make its arrow go away (it is no longer selected)
		}

		selRow = rowNum;														// make the new selected row to be rowNum
		var innerTable = codeTable.rows[selRow].cells[0].children[0];			// grab its inner table
		innerTable.rows[0].cells[0].innerHTML = arrow;							// make it have an arrow (it is now selected)
	}*/

	// findIndentation() returns a string with the appropriate spacing depending on the row number passed to it
	// Starting from the top of the code, it finds how many mismatching brackets '{' '}' there are when the row
	// is reached. The number of opened brackets without a matching close parenthesis is how many tabs this row
	// will need
	function findIndentation(row) {
		var bracket = 0;	// number of brackets opened
		for (var i = 0; i < editor.getRowCount(); i++) {								// iterate throughout the code table
			if (i == row) break;														// when the iteration equals the row, stop
			var rowArr = editor.rowToArrayHtml(i);
			
			if (rowArr.indexOf('{') >= 0) {			// if an open bracket, add one to bracket
				bracket++;
			}
			else if (rowArr.indexOf('}') >= 0) {		// if a close bracket, subtract one from bracket
				bracket--;
			}
		}

		// the bracket variable is how many indents we need
		var indents = "";
		for (var i = 0; i < bracket; i++) indents += indent;
		
		return indents;
	}

/*
	// addMainProgramComment() simply adds the main program comment '// Main Program'
	function addMainProgramComment() {
		var row = codeTable.insertRow(programStart);
		var cell = row.insertCell(0);
		cell.innerHTML = innerTableTemplate;
		innerTable = codeTable.rows[programStart].cells[0].children[0];
		addRow(innerTable, [ "//&nbsp;", "Main Program" ], 2);
		addRowStyle(innerTable, [ green, green ], 2);
		if (selRow >= programStart) selRow++;
		programStart++;
		firstMove = false;
	}
*/
	// refreshLineCount() refreshes the line count in the first cell of every inner table
	/*function refreshLineCount() {
		var innerTable;
		for (var i = 0; i < codeTable.rows.length; i++) {
			innerTable = codeTable.rows[i].cells[0].children[0];
			if (i < 9) innerTable.rows[0].cells[0].innerHTML = i + 1 + "&nbsp;";
			else innerTable.rows[0].cells[0].textContent = i+1;
		}
	}*/

	// selectDialogConfirm() has to do with the selecting of options from the jQuery UI (not implemented)
	function selectDialogConfirm(result) {
		console.log(result);
	}

	// Find specific string in a row
	// Iterate through every column to find the matching string
	function rowContainsString(row, startingRow, str) {
			// For the end of the program
			if (startingRow-1 == programCount) {
				return false;
			}
			var cellVal;
			// Length of the current row
			var length = row.rows[startingRow].cells.length;

			// Iterate through each column
			for (var i = 0; i < length; i++) {
					cellVal = row.rows[startingRow].cells[i].textContent;
					// If the column contains the string return true
					if (cellVal.match(str)) {
							return true;
					}
			}
			return false;
	}

	// Check if the variable has already been used in the code editor
	function referenceCheck(keyWord, lineNum) {
		// The length of the rows in the code editor
		//var length = codeTable.rows.length;
		var length = editor.getRowCount();

		// We are starting at line 3 because we do not need to check the first three line
		for (var i = 3; i < length; i++) {
			// Grab the inner table from the current row
			//var innerTable = codeTable.rows[i].cells[0].children[0];
			// Get the length of the current row to check for matching string
			//var colLength = innerTable.rows[0].cells.length;
			
			var row = editor.rowToArrayHtml(i);
			var colLength = row.length;

			// Skip the row from where the keyWord was obtained
			if (i == lineNum) {
				continue;
			}

			// Check all the cells in the current row for matching string
			// starting at column 3 because we do not want to check the line number, arrow, and a blank column.
			for (var j = 0; j < colLength; j++) {
				// Get the text value from each cell
				//cellVal = innerTable.rows[0].cells[j].textContent;
				// If found then return true
				if (row[j] === keyWord) {
					return true;
				}
				// Do not check the row that contains a comment
				else if (row[j] === "//") {
					continue;
				}
			}
		}
		return false;
	}

	//Weston's functions below here
    /*Weston edit start*/

    /*Weston edit end*/
    
	function typeConfirm(result) {  // For confirming variable and array types
        if (result == 'null')
            return;
        if (clickRow[clickedCellNum-5] == 'var')
        {
            if (result == 'Text') {     // If they selected test before clicking okay
                clickedCell.text('TEXT');
                if (clickRow[clickedCellNum-3] != 'ID')
                {
                    tvars.push(clickRow[clickedCellNum-3]);
                    scopes[0].tvars.push(clickRow[clickedCellNum-3]);
                }
            }
            else if (result == 'Numeric') {
                clickedCell.text('NUMERIC');
                if (clickRow[clickedCellNum-3] != 'ID')
                {
                    //console.log(innerTablet.rows[0].cells[4].textContent);
                    nvars.push(clickRow[clickedCellNum-3]);
                    scopes[0].nvars.push(clickRow[clickedCellNum-3]);
                }
            }
            if (!foundIn(clickRow[clickedCellNum-3], namesUsed) && clickRow[clickedCellNum-3] != 'ID') namesUsed.push(clickRow[clickedCellNum-3]);
        }
        else if (clickRow[clickedCellNum-11] == 'var') //for arrays
        {
            if (clickRow[clickedCellNum] == 'TYPE')
                delN(clickRow[clickedCellNum-9].concat("[]"),varsNamed);
            if (result == 'Text') {     // If they selected test before clicking okay
                clickedCell.text('TEXT');
                if (clickRow[clickedCellNum-9] != 'ID')
                {
                    tvars.push(clickRow[clickedCellNum-9].concat("[]"));
                    scopes[0].tvars.push(clickRow[clickedCellNum-9].concat("[]"));
                }
            }
            else if (result == 'Numeric') {
                clickedCell.text('NUMERIC');
                if (clickRow[clickedCellNum-9] != 'ID')
                {
                    //console.log(innerTablet.rows[0].cells[4].textContent);
                    nvars.push(clickRow[clickedCellNum-9].concat("[]"));
                    scopes[0].nvars.push(clickRow[clickedCellNum-9].concat("[]"));
                }
            }
            if (!foundIn(clickRow[clickedCellNum-9].concat("[]"), namesUsed) && clickRow[clickedCellNum-9] != 'ID') namesUsed.push(clickRow[clickedCellNum-9].concat("[]"));
        }
        console.log("nvars: " + nvars +"\ntvars: " + tvars + "\nnamesUsed: " + namesUsed + "\n" + scopes[0].tvars + "\n" + scopes[0].nvars);
//        $("#selector").dialog('close');
	}
    
  function ftypeConfirm(result) {  // For confirming types for functions
        if (result == 'Text') {     // If they selected test before clicking okay
            clickedCell.text('TEXT');
            if (clickRow[clickedCellNum-5] != 'ID')
            {
                tFuns.push(clickRow[clickedCellNum-5]);
            }
        }
        else if (result == 'Numeric') {
            clickedCell.text('NUMERIC');
            if (clickRow[clickedCellNum-5] != 'ID')
            {
                    //console.log(innerTablet.rows[0].cells[4].textContent);
                nFuns.push(clickRow[clickedCellNum-5]);
            }
        }
        else if (result == 'Void') {
            clickedCell.text('VOID');
            if (clickRow[clickedCellNum-5] != 'ID')
            {
                //console.log(innerTablet.rows[0].cells[4].textContent);
                vFuns.push(clickRow[clickedCellNum-5]);
            }
        }
        if (!foundIn(clickRow[clickedCellNum-5], namesUsed) && clickRow[clickedCellNum-5] != 'ID') namesUsed.push(clickRow[clickedCellNum-5]);
        console.log("nfuns: " + nFuns +"\ntfuns: " + tFuns + "\nvfuns: " + vFuns + "\nnamesUsed: " + namesUsed);
//        $("#selector").dialog('close');
	}
    
  function exprtype(){ //For determining the type of an EXPR in the code
        for (counter = 0; counter < clickRow.length; counter++)
        {
			//if there's some kind of assignment, and there's no point in
			// searching here after 3 because there shouldn't be any more
			// assignments
            if (clickRow[counter] == '=' && counter < 4)
            {
                if (clickRow[counter+2] == 'prompt')
                {
                    console.log(clickedCellNum + " " + counter);
                    if ((counter+4) == clickedCellNum){
                        return 'PROMPTMSG';
                    }
                    else if ((counter+6) == clickedCellNum){
                        return 'PROMPTDFLT';
                    }
                    else return 0;
                }
                else if (clickRow[counter+2] == 'parseFloat')
                {
                    if ((counter+6) == clickedCellNum){
                        return 'PROMPTMSG';
                    }
                    else if ((counter+8) == clickedCellNum){
                        return 'PARSEDFLT';
                    }
                    else return 0;
                }
                else
                {
                    if (foundIn(clickRow[counter-2],nvars)) return 'NUMERIC ASSIGNMENT';
                    else if (foundIn(clickRow[counter-2],tvars)) return 'TEXT ASSIGNMENT';
                    else return 0;
                }
            }
            else if (clickRow[counter] == '=' && counter >= 4) {
                //array assignment
                console.log("Can only be an array assignment I think?");
                if (foundIn((clickRow[counter-4].concat(']')),nvars)) return 'NUMERIC ASSIGNMENT';
                else if (foundIn((clickRow[counter-4].concat(']')),tvars)) return 'TEXT ASSIGNMENT';
                else return 0;
            }

			//if it's a while loop or an if statement
            else if (foundIn(clickRow[counter], compKeys))
            {
                if (clickRow[counter+1] == '(' && clickRow[counter+3] == ')')
                {
                    return('BOOL');
                }
                else
                {
                    console.log('not bool');
                    if (foundIn(clickRow[counter+2],nvars))
                    {
                        return ('NUMERIC COMPARISON');
                    }
                    else return 0;
                }
            }
            else if (clickRow[counter] == "document.write" || clickRow[counter] == "document.writeln")
            {
                return ('PRINT');
            }
            else if (clickRow[counter] == "return")
            {
                return ('RETURN');
            }
            console.log(clickRow[counter]);
        }
		
		//returnToNormalColor();
        return 0;
  }

	function nameDialogConfirm(result) {
		console.log(clickRow[clickedCellNum]);
		if( /^[a-zA-Z]+$/.test(result) == false)
			alert("Please use only alphabetical letters!");
			return;
		// empty string is not valid inpute
		if (result == "")
		{
			//NEED ALERT
		}
		// empty string is not valid inpute
		if (result == "")
		{
			alert("Empty String");
			$("#selector").dialog('close');
			return;
		}

		//if the result is a number (isNaN() will be false if the argument is a number), return
		if(!isNaN(result)){
			console.log("You can't name a variable with a number");
			return;
		}
		
		//if the name is in use already, abort
		if (foundIn(result,varsNamed.concat(namesUsed).concat(funcsNamed)) == 1) {
			console.log("Already exists (nameDialogconfirm)");
			return; //this will need to spawn a dialog box before returning
		}

		//if the name is a reserved word, abort
		if (foundIn(result,resWords) == 1)
		{
			console.log(result + " is a reserved word.");
			return;
		}

		//need to add functionality for changing names (removing from namesUsed)
		clickedCell.text(result);
        console.log("The result is " + result);
		
		//console.log('\t\t' + (clickRow[clickedCellNum+3] != 'TYPE') + ' ' + (clickRow[clickedCellNum+3] !== 'TYPE'));
		
		//if the variable does not have a type, add it to varsNamed
		if (clickRow[clickedCellNum+3] == 'Array') {
            if (clickRow[clickedCellNum + 8] == 'TYPE') {
                varsNamed.push(result + "[]");
            }
            else {
                varsNamed.splice(varsNamed.indexOf(result + "[]"));
                namesUsed.push(result + "[]");
            }
        }
		//if the variable does have a type, then add it to namesUsed
        else {
            if(clickRow[clickedCellNum+3] == 'TYPE'){
                varsNamed.push(result);
            }
            else{
                //remove the name from varsNamed
                varsNamed.splice(varsNamed.indexOf(result),1);
                
                //add the name to names used
                namesUsed.push(result);
            }
		}
		
//		if(clickRow[clickedCellNum+3] == 'TYPE'){
//			varsNamed.push(result);
//		}
//		//if the variable does have a type, then add it to namesUsed
//		else{
//			//remove the name from varsNamed
//			varsNamed.splice(varsNamed.indexOf(result),1);
//			
//			//add the name to names used
//			namesUsed.push(result);
//		}
//		//namesUsed.push(result);

		var lastCellindex = clickRow.length-1;
        //clickRow[lastCellindex-1]
        if (clickRow[clickedCellNum+3] == 'Array') {
            if (clickRow[lastCellindex-1] == 'NUMERIC') nvars.push(result+"[]");
            else if (clickRow[lastCellindex-1] == 'TEXT') tvars.push(result+"[]");
        }
        else {
            if (clickRow[lastCellindex-1] == 'NUMERIC') nvars.push(result);
            else if (clickRow[lastCellindex-1] == 'TEXT') tvars.push(result);
        }
//		if (clickRow[lastCellindex-1] == 'NUMERIC') nvars.push(result);
//		else if (clickRow[lastCellindex-1] == 'TEXT') tvars.push(result);
        console.log("nvars: " + nvars +"\ntvars: " + tvars + "\nnamesUsed: " + namesUsed);

	
	}

	function idConfirm(result) {	
		//if the result was null, the user clicked the cancel button, so don't do anything
		if(result == null)
			return;

        if (foundIn(result, namesUsed))
        {           
            console.log("id value: " + result);
            if (result[result.length-1] == "]") {
                var str = result.substring(0,(result.length-1));
                clickedCell.text(str);
                editor.addCell(clickedCell,
                               [{text:"index"},
                                {text:"]"}]
                               );
            }
            else {
                clickedCell.text(result);
            }
            console.log("id value: " + result);
//			clickedCell.text(result);
            console.log("\n" + result);
            namesRef.push(result);
            console.log(namesRef);
        }
//		$("#selector").dialog('close');
		
		//returnToNormalColor();
	}

//	function selectorCancel() {
//		$("#selector").dialog('close');
//
//	}

    function tConstantconfirm(result){
//        $("#selector").dialog('close');
		clickedCell.text('"' + result + '"');
		
		//returnToNormalColor();
    }
    
    function exprSelConfirm(result){
        $("#selector").dialog('close');
        switch (result)
        {
            case "numeric constant":
                createNumPad(null,null,"Number Pad", "Enter a value.", true, 10, enterNum);
                //dialog openNumPad(null, null, "Enter a value", "not sure what this string is", false, 10).done( function(result) {console.log(result);                                                                                                        clickedCell.textContent = result;                                                                                                        });
                break;
            case "EXPR":
                createSelector("Choose an Expression Format.", nExprtypes, mathExpr);
                //dialog openSelector("Expression choices", nExprtypes).done(function(returned) { mathExpr(returned); returnToNormalColor(); });
                break;
            case "text constant":
                createStringPad("Text Entry Box", "Enter a text constant", textEntry);
                
//                $("#selector").empty();
//                dial.innerHTML = "<textarea id='dial" + sandboxNum + "Text' size=\"4\" style=\"width: 100%;margin-bottom:10px\"></textarea> <div> <button id='dial" + sandboxNum + "OKButton' type=\"button\" style=\"width:4em;height:2em\">Okay</button> <button id='dial" + sandboxNum + "CancelButton' type=\"button\" style = \"width:4em;height:2em\">Cancel</button> </div>";
//                
//                dialOKButton = document.getElementById("dial" + sandboxNum + "OKButton");
//                dialOKButton.onclick = function() {
//                    console.log("Here.");
//                    var textArea = document.getElementById("dial" + sandboxNum + "Text");
//                    console.log(textArea.value);
//                    tConstantconfirm(textArea.value);
//                };
//                
//                dialCancelButton = document.getElementById("dial" + sandboxNum + "CancelButton");
//                dialCancelButton.onclick = function() {	selectorCancel(); };
//                
//                $("#selector").dialog('open');

                break;
            case "text variable":
                createSelector("Text Var Selection", tvars, idConfirm);
//                $("#selector").empty;
//                generateSelectionHTML(tvars, 'id');
//                $("#selector").dialog('open');
                break;
            case "numeric function call":
                createSelector("Function Call Selection", nFuns, funConfirm);
                break;
            case "text function call":
                createSelector("Function Call Selection", tFuns, funConfirm);
//                $("#selector").empty;
//                generateSelectionHTML(tFuns, 'fun');
//                $("#selector").dialog('open');
                break;
            case "EXPR + EXPR":
                var cell;
                var values = ["&nbsp;", "+", "&nbsp;", "EXPR"];
                clickedCell.text("EXPR");
                /*for (var i = 0; i < values.length; i++) {			// for all cells in the table
                    cell = innerTablet.rows[0].insertCell(++clickedCellNum);	// insert a cell at startInd
                    cell.innerHTML = values[i];						// make the innerHTML of the cell cells[i]
                }*/
				console.log(clickedCell.index() + " " + clickedCell.text());
				
				editor.addCell(clickedCell,
					[{text:"&nbsp;"},
					{text:"+"},
					{text:"&nbsp;"},
					{text:"EXPR"}]
				);
				console.log(clickedCell.index() + " " + clickedCell.text());
				
				//get the clickRow again, since stuff has changed
				clickRow = editor.rowToArrayHtml(clickedCell.parent().parent().parent().parent().parent().index()); //will this work?
                break;
				
			case "numeric variable":
                createSelector("Numeric Var Selection", nvars, idConfirm);
//				$("#selector").empty();
//				generateSelectionHTML(nvars, 'id');
//				$("#selector").dialog('open');
				break;

            default:
                break;
        }
		
		//returnToNormalColor();
    }
    
    function mathExpr(result){
        console.log(result);
		var values;
        switch (result)
        {
            case ("EXPR + EXPR"):
                values = ["EXPR", "&nbsp;", "+", "&nbsp;", "EXPR"];
                break;
            case ("EXPR - EXPR"):
                values = ["EXPR", "&nbsp;", "-", "&nbsp;", "EXPR"];
                break;
            case ("EXPR * EXPR"):
                values = ["EXPR", "&nbsp;", "*", "&nbsp;", "EXPR"];
                break;
            case ("EXPR / EXPR"):
                values = ["EXPR", "&nbsp;", "/", "&nbsp;", "EXPR"];
                break;
            case ("EXPR % EXPR"):
                values = ["EXPR", "&nbsp;", "%", "&nbsp;", "EXPR"];
                break;
            case ("(EXPR)"):
                values = ["(", "EXPR", ")"];
                break;
            default:
                break;
        }
		
        clickedCell.text(values[0]);
		var cell = clickedCell;
        for (i = 1; i < values.length; i++)
        {
            //cell = innerTablet.rows[0].insertCell(++clickedCellNum);
            //cell.innerHTML = values[i];
			console.log(i, values[i]);
			console.log(cell);
			
			editor.addCell(cell, [{text:values[i]}]);
			
			cell = cell.next();
        }
        
		//get the clickRow again, since stuff has changed
		clickRow = editor.rowToArrayHtml(clickedCell.parent().parent().parent().parent().parent().index()); //will this work?
		
        //returnToNormalColor();                 
    }
    
    function boolConfirm(result){	
		//if the result was null, the user clicked the cancel button, so don't do anything
		if(result == null)
			return;
			
//        $("#selector").dialog('close');
        var values = ["&nbsp;", "", "&nbsp;", "EXPR"];
        switch (result)
        {
            case ("EXPR == EXPR"):
                values[1] = "==";
                break;
            case ("EXPR != EXPR"):
                values[1] = "!=";
                break;
            case ("EXPR > EXPR"):
                values[1] = ">";
                break;
            case ("EXPR >= EXPR"):
                values[1] = ">=";
                break;
            case ("EXPR < EXPR"):
                values[1] = "<";
                break;
            case ("EXPR <= EXPR"):
                values[1] = "<=";
                break;
            default:
                break;
        }
        clickedCell.text("ID");
        /*for (var i = 0; i < values.length; i++) {			// for all cells in the table
            cell = innerTablet.rows[0].insertCell(++clickedCellNum);	// insert a cell at startInd
            cell.innerHTML = values[i];						// make the innerHTML of the cell cells[i]
        }*/
		
		var cell = clickedCell;
        for (var i = 0; i < values.length; i++)
        {
			editor.addCell(cell, [{text:values[i]}]);
			
			cell = cell.next();
        }
        
		//get the clickRow again, since stuff has changed
		clickRow = editor.rowToArrayHtml(clickedCell.parent().parent().parent().parent().parent().index()); //will this work?
		
		//returnToNormalColor();
    }

	// Weston's functions
    /*Weston edit start*/
    function funCallfinal(result){
        clickedCell.text(result);
        namesRef.push(result);
        $("#selector").dialog('close');
    }
    /*Weston edit end*/
    
    function funConfirm(result){
        if (foundIn(result, namesUsed))
        {
            console.log("id value: " + result);
            clickedCell.text(result + "()");
            console.log("\n" + result);
            namesRef.push(result);
            console.log(namesRef);
        }
		$("#selector").dialog('close');
    }
    
	function generateSelectionHTML(list, kind){
        console.log(list);
		var wstring;
        console.log(list);
		wstring = "<select id='selDrop" + divID + "' size=\"4\" style=\"width: 100%;marginbottom:10px\">\n";
		for (i = 0; i < list.length; i++)
		{
			wstring += "<option value=\"" + list[i] + "\">" + list[i] + "</option>\n";
		}
		wstring += "</select> \n<div>\n <button id='dial" + divID + "OKButton' type=\"button\" style=\"width:4em;height:2em\">Okay</button>\n <button id='dial" + divID + "CancelButton' type=\"button\" style=\"width:4em;height:2em\">Cancel</button>\n </div>";
		
		dial.innerHTML = wstring;
		
		switch (kind)
		{
                /*Weston edit start*/
            case "fcall":
                dialOKButton = document.getElementById("dial" + divID + "OKButton");
				dialOKButton.onclick = function() {
					var selectDrop = document.getElementById("selDrop" + divID);
					funCallfinal(selectDrop.value);
				};
                break;
                /*Weston edit end*/
            case "fun":
                dialOKButton = document.getElementById("dial" + divID + "OKButton");
				dialOKButton.onclick = function() {
					var selectDrop = document.getElementById("selDrop" + divID);
					funConfirm(selectDrop.value);
				};
                break;
            case "ftype":
                dialOKButton = document.getElementById("dial" + divID + "OKButton");
                dialOKButton.onclick = function() {
                    var selectDrop = document.getElementById("selDrop" + divID);
                    ftypeConfirm(selectDrop.value);
                };
                break;
            case "expr":
                dialOKButton = document.getElementById("dial" + divID + "OKButton");
                dialOKButton.onclick = function() {
                    var selectDrop = document.getElementById("selDrop" + divID);
                    exprSelConfirm(selectDrop.value);
                };
                break;
			case "id":
				dialOKButton = document.getElementById("dial" + divID + "OKButton");
				dialOKButton.onclick = function() {
					var selectDrop = document.getElementById("selDrop" + divID);
					idConfirm(selectDrop.value);
				};
				break;
			case "type":
				dialOKButton = document.getElementById("dial" + divID + "OKButton");
				dialOKButton.onclick = function() {
					var selectDrop = document.getElementById("selDrop" + divID);
					typeConfirm(selectDrop.value);
				};
				break;
            case "bool":
                console.log("bool");
				dialOKButton = document.getElementById("dial" + divID + "OKButton");
				dialOKButton.onclick = function() {
					var selectDrop = document.getElementById("selDrop" + divID);
					boolConfirm(selectDrop.value);
                    console.log(selectDrop.value);
                };
				break;
			default:
				break;
		}
		
		dialCancelButton = document.getElementById("dial" + divID + "CancelButton");
		dialCancelButton.onclick = function() { selectorCancel(); };
	}
    
    function exprConfirm(result){
        switch (result)
        {
            case ('text'):
                createSelector("Text Expressions", tExpr, exprSelConfirm);
//                generateSelectionHTML(tExpr, "expr");
//                $("#selector").dialog('open');
                //console.log(result);
                break;
            case ('numeric'):
                createSelector("Numeric Expressions", nExpr, exprSelConfirm);
//                console.log(result + "ha");
//                generateSelectionHTML(nExpr, "expr");
//                $("#selector").dialog('open');
                //openSelector("Expression choices", nExpr).done(function(returned) {  });
//                console.log(result);
                break;
            default:
                break;
        }
    }

	function delN(name,list){
		for (i = 0; i < list.length; i++)
		{
			if (list[i].toUpperCase() == name.toUpperCase())
			{
				list.splice(i,1);
				break;
			}
		}
	}

	function foundIn(name,list){
        console.log("name: " + name + "\nlist: " + list);
		for (i = 0; i < list.length; i++)
		{
			console.log(list[i].toUpperCase() + " " + name.toUpperCase());
			if (list[i].toUpperCase() == name.toUpperCase())
			{
				console.log("Match found");
				return 1;
			}
		}
		return 0;
	}
	
	function isDummyRow(rowNum) {
		for (var i = 0; i < dummyRows.length; i++) {
			if (dummyRows[i] == rowNum) return true;
		}
		return false;
	}
		
	function removeDummyRow(rowNum) {
		var i;
		for (i = 0; i < dummyRows.length; i++) {
			if (dummyRows[i] == rowNum) break;
		}
		dummyRows.splice(i, 1);
	}

	this.getEditorText = getEditorText;
	function getEditorText() {
		var codeStr = "";
		var row;
		var numCells;
		var cellText;
		var semi;
		var tempText;
		var charCount = -1;
		var lineCount = 0;
		var firstLine = false;
		var firstChar = false;
		var bracketFlag = false;
		var funcCall = false;
		
		for (var i = 0; i < editor.getRowCount(); i++) {
			if (isDummyRow(i)) {
				console.log("Dummy: " + i + " Char Count: " + charCount);
				lineNums.push(i);
				console.log("Pushing: " + (charCount + 1));
				charCountStart.push(charCount + 1);
				codeStr += "dummyFunction();"
				charCount += 16;
				console.log("Pushing: " + charCount);
				charCountEnd.push(charCount);
				removeDummyRow(i);
				i--;
				continue;
			}
		
			row = editor.rowToArray(i);
			numCells = row.length;
			if (numCells == 0) { continue; }
			
			if (numCells == 1) {
				if (row[0].indexOf("}") < 0 && row[0].indexOf("{") < 0 && row[0].indexOf("else") < 0) { rowType.push("blankLine"); continue; }
				else bracketFlag = true;
				if (row[0].indexOf("}") < 0 && row[0].indexOf("{") < 0 && row[0].indexOf("else") < 0) {
					rowType.push("blankLine"); continue; }
				else
					bracketFlag = true;
			}

			if (row[0].indexOf("function") >= 0) rowType.push("functionDeclaration");
			else if(row[0].indexOf("//") >= 0) rowType.push("comment");
			else if(row.indexOf("{") >= 0) rowType.push("closeBracket");
			else if(row.indexOf("}") >= 0) rowType.push("openBracket");
			else if(row.indexOf("var") >= 0) rowType.push("variable");
			else if(row[1].indexOf("if") >= 0) rowType.push("if");
			else if(row[1].indexOf("else") >= 0) rowType.push("else");
			else if(row[1].indexOf("while") >= 0) rowType.push("while");
			else if(row[1].indexOf("return") >= 0) rowType.push("return");
			else if(row[1].indexOf("for") >= 0) rowType.push("for");
			else if(row[1].indexOf("writeln") >= 0) rowType.push("writeln");
			else if(row[1].indexOf("write") >= 0) rowType.push("write");
			else if(foundIn(row[1],(vFuns.concat(tFuns)).concat(nFuns))) {rowType.push("functionCall"); funcCall = true; console.log("func");}
			else if(row[3].indexOf("=") >= 0) rowType.push("assignment");
			else if(row[5].indexOf("parse") >= 0) rowType.push("numericPrompt");
			else if(row[7].indexOf("prompt") >= 0) rowType.push("prompt");

            
			for (var j = 0; j < numCells; j++) {
				//cellText = innerTable.rows[0].cells[j].textContent;
				if (row[j].indexOf("//") >= 0) break;
				if (row[j].indexOf("document.writeln") >= 0) {
					if (firstChar == false) { firstChar = true; charCountStart.push(charCount + 1); lineNums.push(i); }
					if (!firstLine) firstLine = true;
					if (firstChar == false) {
						firstChar = true;
						charCountStart.push(charCount + 1);
						lineNums.push(i);
					}
					
					if (!firstLine)
						firstLine = true;
						
					codeStr += "document1writeln";
					charCount += 16;
				}
				else if (row[j].indexOf("document.write") >= 0) {
					if (firstChar == false) { firstChar = true; charCountStart.push(charCount + 1); lineNums.push(i); }
					if (!firstLine) firstLine = true;
					if (firstChar == false) {
						firstChar = true;
						charCountStart.push(charCount + 1);
						lineNums.push(i);
					}
					
					if (!firstLine)
						firstLine = true;
					
					codeStr += "document1write";
					charCount += 14;
				}
				else {
					if (row[j].indexOf(";") >= 0) {
						semi = row[j].indexOf(";");
						
						for (var k = 0; k < semi + 1; k++)
							tempText += row[j].charAt(k);
						
						row[j] = tempText;
						firstLine = true;
					}
					
					codeStr += row[j];
					if (firstChar == false && bracketFlag == false) { firstChar = true; charCountStart.push(charCount + 1); lineNums.push(i); }
					if (!firstLine) firstLine = true;
					if (firstChar == false && bracketFlag == false) {
						firstChar = true; charCountStart.push(charCount + 1);
						lineNums.push(i);
					}
					if (!firstLine)
						firstLine = true;
					
					charCount += row[j].length;
				}
				tempText = "";
			}
			if (firstChar && !bracketFlag) {
				charCountEnd.push(charCount);
			}
			firstChar = false;
			bracketFlag = false;
		}
		
		rowNum = lineNums[0];
		//selRow = rowNum;
		// console.log("rowcount " + editor.getRowCount());
		if (editor.getRowCount() == 4) {
			rowNum = 3
		}
		else
		 rowNum = lineNums[0];
		// selRow = rowNum;
		// console.log("rowNUm " + rowNum);
		editor.setSelectedRow(rowNum);
		
		codeStr = codeStr.replace("\xA0", " ");
		codeStr = codeStr.replace("\x1E", " ");
		var tCodeStr = "";
		for (var i = 0; i < codeStr.length; i++) {
			if (codeStr[i] != "\xA0") tCodeStr += codeStr[i];
			else tCodeStr += " ";
		}
		codeStrLen = tCodeStr.length;
		
		console.log(tCodeStr);
		
		// console.log(tCodeStr);
		return tCodeStr;
	}

	function isNewLine(start, end) {
		if (start == -1 && end == -1) {

			return [ true, rowNum ];
		}
		for (var i = 0; i < charCountStart.length; i++) {
			if (start >= charCountStart[i] && end <= charCountEnd[i] + 1) { 
				if (lineNums[i] == rowNum) { return [ false, rowNum ]; }
				else {
					rowNum = lineNums[i];
					if (rowType[rowNum].indexOf('numeric') >= 0) { promptFlag = [ true, "numeric" ]; }
					else if (rowType[rowNum].indexOf('prompt') >= 0) { promptFlag = [ true, "string" ]; }
					return [true, editor.getSelectedRowIndex()];
				}
			}
		}
		return [ false, rowNum ];
	}

	function checkPromptFlag() {
		if (promptFlag[0]) {
			var type = promptFlag[1];
			var promptStr;
			var defStr;
			promptFlag = [ false, "" ];
			highlightCurrentStep(rowNum);
			var promptStr;
			var firstParam = true;
			var innerTable = codeTable.rows[rowNum].cells[0].children[0];
			for (var i = 2; i < innerTable.rows[0].cells.length; i++) {
				cell = innerTable.rows[0].cells[i];
				if (cell.textContent.indexOf('"') >= 0) {
					promptStr = cell.textContent;
					defStr = innerTable.rows[0].cells[i + 2].textContent;
					return [ true, type, promptStr, defStr ];
				}
			}
		}
		return [ false, "", "", "" ];
	}

	function selectLine(row) {
		/*var innerTable;
		
		for (var i = 0; i < codeTable.rows.length; i++) {
			innerTable = codeTable.rows[i].cells[0].children[0];
			innerTable.rows[0].cells[1].innerHTML = blank;
		}	
		
		innerTable = codeTable.rows[row].cells[0].children[0];
		innerTable.rows[0].cells[1].innerHTML = arrow;
		returnToNormalColor();
		highlightCurrentStep(row);
		selRow = rowNum;*/
		console.log(row);
		if (row == 3 && programCount == 3) {
			return;
		}
		else
			editor.selectAndHighlightRowByIndex(row);
	}

	function reset() {
		var rowCount = editor.getRowCount()-1;
		selectLine(rowCount);
		/*var rowNum = lineNums[0];
		editor.selectAndHighlightRowByIndex(rowNum);*/
		editor.clearHighlighting();
	}

	function getDatatypeSelectedLine() {
		//var innerTable = codeTable.rows[selRow].cells[0].children[0];
		//var numCells = innerTable.rows[0].cells.length;
		var row = editor.rowToArrayHtml(editor.getSelectedRowIndex());
		var numCells = row.length;
		if (row[numCells - 1].indexOf("NUMERIC") >= 0) return "numeric";
		else if (row[numCells - 1].indexOf("NUMERIC") >= 0) return "text";
		
		return null;
	}
	
    /*function addNewInsertRow() {
        var row = insertTable.insertRow(-1);
        var cell = row.insertCell(0);
        cell.className = "insert";
        cell.innerHTML = blank;
    }*/
    
  function fcallType(result) {
        //Function called to allow selection of functions based on a type parameter
        switch (result)
        {
            case ('Void'):
                createSelector("Void Functions", vFuns, fChoose);
                break;
            case ('Text'):
                createSelector("Text Functions", tFuns, fChoose);
                break;
            case ('Numeric'):
                createSelector("Numeric Functions", nFuns, fChoose);
                break;
            default:
                break;
        }
    }
    
  function textEntry(result) {
        clickedCell.text('"' + result + '"');
		clickedCell.addClass("literal");
    }
    
  function fChoose(result) {
        //Function that is called when selecting a function that replaces the text of a single cell
		
		//if the result was null, the user clicked the cancel button, so don't do anything
		if(result == null)
			return;
			
        clickedCell.text(result);
    }
    
  function enterNum(result) {
		if(result == null)
			return;
		console.log(result);
        //Function called to replace a cell with a number
        clickedCell.text(result);
    }
    
  function fIDconfirm(result) {
        //Function called to assign an identifier to a function at its declaration
		
		//if the result was null, the user clicked the cancel button, so don't do anything
		if(result == null)
			return;
		
		//if the result is a number (isNaN() will be false if the argument is a number), return
		if(!isNaN(result)){
			console.log("You can't name a function with a number");
			return;
		}
		
		//if the result is the name of a variable or function, return
        if (foundIn(result,varsNamed.concat(namesUsed).concat(funcsNamed))){
			console.log("The name " + result + " has already been used");
			return;
		}
		
		//if the result is a reserved word, return
        if (foundIn(result, resWords)){
			console.log("The word " + result + " is a reserved word");
			return;
		}
		
        clickedCell.text(result);
        switch (clickRow[clickedCellNum+5])
        {
            case 'VOID':
                vFuns.push(result);
                break;
            case 'TEXT':
                tFuns.push(result);
                break;
            case 'NUMERIC':
                nFuns.push(result);
                break;
            default:
                break;
        }
		
		//push the name of this function onto funcsNamed
	funcsNamed.push(result);
		
        console.log("Names used: " + namesUsed);
        console.log("Void Functions: " + vFuns);
        console.log("Text Functions: " + tFuns);
        console.log("Num Functions: " + nFuns);
    }
    
  function forId(result) {
//        clickedCell.textContent = result;
		//if the result was null, the user clicked the cancel button, so don't do anything
		if(result == null)
			return;
			
        console.log(clickRow.length);
		/*
        for (i=0; i<clickRow.length; i++)
        {
            console.log(clickRow[i] + '\n');
            if (clickRow[i].textContent == 'ID') clickRow[i].textContent = result;
        }*/
		
		clickedCell.parent().find('td:contains("ID")').text(result);
		
		//get the clickRow again, since stuff has changed
		clickRow = editor.rowToArrayHtml(clickedCell.parent().parent().parent().parent().parent().index()); //will this work?
  }
    
    function indexConfirm(result) {
        switch(result) {
            case ("Constant"):
                createNumPad(0, null, "Number Entry", "Enter an index to reference", false, 10, enterNum);
                break;
            case ("Variable"):
                createSelector("Variable Selection", nvars, idConfirm);
                break;
            default:
                break;
        }
    }
    
    
    function paramTypeConfirm(result) {
        if (result == null)
            return;
        clickedCell.text(result);
    }
    
    function clickHandler() {
//        printScopes(); rtodo
        determineScope(clickedCell);
        console.log($(clickedCell).attr('class'));
        if (clickedCell.hasClass("vname"))
            vnameHandler(); //mostly implemented?
        else if (clickedCell.hasClass("pname"))
            pnameHandler();
        else if (clickedCell.hasClass("fname"))
            fnameHandler(); //mostly implemented?
        else if (clickedCell.hasClass("vtype"))
            vtypeHandler(); //mostly implemented?
        else if (clickedCell.hasClass("ptype"))
            ptypeHandler();
        else if (clickedCell.hasClass("ftype"))
            ftypeHandler(); //mostly implemented
        else if (clickedCell.hasClass("aID"))
            aIDHandler(); //mostly implemented
        else if (clickedCell.hasClass("taID"))
            taIDHandler(); //mostly implemented
        else if (clickedCell.hasClass("naID"))
            naIDHandler(); //mostly implemented
        else if (clickedCell.hasClass("varID"))
            varIDHandler(); //mostly implemented
        else if (clickedCell.hasClass("fcall"))
            fcallHandler();  //mostly implemented
        else if (clickedCell.hasClass("size"))
            sizeHandler(); //mostly implemented
        else if (clickedCell.hasClass("index"))
            indexHandler(); //mostly implemented
        else if (clickedCell.hasClass("expr"))
            exprHandler(); //mostly implemented
        else if (clickedCell.hasClass("foParen") || clickedCell.hasClass("fcParen"))
            parenHandler();
        else if (clickedCell.hasClass("pID"))
            pIDHandler();
    }
    
    function pIDHandler() {
        if (clickedCell.hasClass("text"))
            createSelector("Text Parameter Selection", ["Constant", "Variable"], texprCallback);
        else if (clickedCell.hasClass("numeric"))
            createSelector("Numeric Parameter Selection", ["Constant", "Variable"], nexprCallback);
    }
    
    function determineScope(cell) {
//        determine the scope of the clicked cell (todo)
//        console.log("Supposed to determine scope here"); rtodo

        console.log(cell.attr('class'));
        var j = scopeCount;
        for (i=0;i<j;i++) {
            if (cell.hasClass(("scope" + i))) {
                scope = i;
                console.log(scope); //rtodo
                return;
            }
        }
    }
    
    function vnameCallback(result) {
        determineScope(clickedCell);
        if (result == null){
            return;
		}
        else if (namesUsed.indexOf(result) >= 0) {
			createAlertBox("Invalid Character",result+" is in used!",1,dummy);
            //create alert name used todo
            return;
        }
        else if (resWords.indexOf(result) >= 0) {
			if(result == '')
				result = "Empty String";
			createAlertBox("Invalid Entry",result+" is Reserved",1,dummy);
            //create alert is reserved word todo
            return;
        }
        else {
			if( /^[a-zA-Z]+$/.test(result[0]) == true){
				if(/^[a-zA-Z0-9]+$/.test(result) == false){
					createAlertBox("Invalid Character","Please use only alphabetical letters!",1,dummy);
					return;
				}
			}else{
				createAlertBox("Invalid Character",result+" is invalid!",1,dummy);
				return;
			}
            namesUsed.push(result);
            if (clickedCell.hasClass("array")) {
                varExists(clickedCell.text().concat("[]"), scope);
            }
            else {
                varExists(clickedCell.text(), scope);
            }
            clickedCell.text(result);
            if (scopes.length > 1)
                determineScope(clickedCell);
            var tCell = clickedCell;
            while (!(tCell.hasClass("vtype")))
                tCell = tCell.next();
            if (tCell.hasClass("array")) {
                if (tCell.text() == 'TEXT')
                    scopes[scope].tvars.push(result.concat("[]"));
                else if (tCell.text() == 'NUMERIC')
                    scopes[scope].nvars.push(result.concat("[]"));
                else
                    scopes[scope].unvars.push(result.concat("[]"));
            }
            else {
                if (tCell.text() == 'TEXT')
                    scopes[scope].tvars.push(result);
                else if (tCell.text() == 'NUMERIC')
                    scopes[scope].nvars.push(result);
                else
                    scopes[scope].unvars.push(result);
            }
        }
        console.log(scopes[scope].name + ":\n\ttvars: " + scopes[scope].tvars + "\n\tnvars: " + scopes[scope].nvars + "\n\tunvars: " + scopes[scope].unvars);
        console.log("namesUsed: " + namesUsed);
		
		printScopes();
    }
    
    function fnameCallback(result) {
        determineScope(clickedCell);
        if (result == null)
            return;
        else if (namesUsed.indexOf(result) >= 0) {
			createAlertBox("Invalid Character",result+" is in used!",1,dummy);
            //create alert name used todo
            return;
        }
        else if (resWords.indexOf(result) >= 0) {
			if(result == '')
				result = "Empty String";
			createAlertBox("Invalid Entry",result+" is Reserved",1,dummy);

            //create alert is reserved word todo
            return;
        }
		
        if( /^[a-zA-Z]+$/.test(result[0]) == true){
			if(/^[a-zA-Z0-9]+$/.test(result) == false){
				createAlertBox("Invalid Character","Please use only alphabetical letters!",1,dummy);
				return;
			}
		}else{
			createAlertBox("Invalid Character",result+" is invalid!",1,dummy);
			return;
		}
        

        
        if (clickedCell.text() != 'ID') {
            console.log("namesUsed befpre: " + namesUsed);
            funExists(clickedCell.text());
            scopeAlter(clickedCell.text(), result);
            console.log("after: " + namesUsed);
        }
        else {
//            scopes.push(new Scope(result));
            scopeAlter(scope,result);
//            printScopes();
        }
        clickedCell.text(result);
        var tCell = clickedCell;
        while (!(tCell.hasClass("ftype")))
            tCell = tCell.next();
        if (tCell.text() == 'Text')
            tFuns.push(result);
        else if (tCell.text() == 'Numeric')
            nFuns.push(result);
        else if (tCell.text() == 'Void')
            vFuns.push(result);
        console.log("FunctionList: " + functionList + "\ntFuns:" + tFuns + "\nnFuns:" + nFuns + "\nvFuns: " + vFuns + "\nNamesUsed: " + namesUsed);
    }
    
    function vtypeCallback(result) {
        if (result == null)
            return;
        
        determineScope(clickedCell);
        clickedCell.text(result);
//        console.log(result); rtodo
        
//        locate cell containing variable name
        var nCell = clickedCell;
        while (!nCell.hasClass("vname"))
            nCell = nCell.prev();
            
//        console.log(nCell.text()); rtodo
//        if it has a name, remove it from the list it's in, and put it back in the proper list
        if (nCell.text() != 'ID') {
//            console.log("are we getting here"); rtodo
//            handle array case
            if (clickedCell.hasClass("array")) {
                varExists(nCell.text().concat("[]"), scope);
                if (result == 'Text')
                    scopes[scope].tvars.push(nCell.text().concat("[]"));
                else if (result == 'Numeric')
                    scopes[scope].nvars.push(nCell.text().concat("[]"));
                else
                    console.log("WHAT DID YOU DO?!?!?");
            }
//            handle standard variable case
            else {
                varExists(nCell.text(), scope);
                if (result == 'Text')
                    scopes[scope].tvars.push(nCell.text());
                else if (result == 'Numeric')
                    scopes[scope].nvars.push(nCell.text());
                else
                    console.log("WHAT DID YOU DO?!?!?");
            }
        }
//        testing log
        console.log(scopes[scope].name + ":\n\ttvars: " + scopes[scope].tvars + "\n\tnvars: " + scopes[scope].nvars + "\n\tunvars: " + scopes[scope].unvars);
    }
    
    function ftypeCallback(result) {
        if (result == null)
            return;
        
        clickedCell.text(result);
        
        //        locate the function's name
        var nCell = clickedCell;
        while (!nCell.hasClass("fname"))
            nCell = nCell.prev();
        
        //if it has a name, remove it from the list it's in, and put it back in the proper list
        if (nCell.text() != 'ID') {
            funExists(nCell.text());
            if (result == 'Text') {
                tFuns.push(nCell.text());
            }
            else if (result == 'Numeric') {
                nFuns.push(nCell.text());
            }
            else if (result == 'Void') {
                vFuns.push(nCell.text());
            }
        }
        scopes[scope].namesUsed.push(nCell.text());
        console.log("FunctionList: " + functionList + "\ntFuns:" + tFuns + "\nnFuns:" + nFuns + "\nvFuns: " + vFuns);
    }
    
    function aIDCallback(result) {
        if (result == null)
            return;
        
        if (clickedCell.text() != 'ID') {
            namesRef.splice(namesRef.indexOf(clickedCell.text()),1);
        }
        
        if (result[result.length-1] == ']') {
            var str = result.substring(0,(result.length-1));
            clickedCell.text(str);
            editor.addCell(clickedCell,[{text:"index", type:"index"}, {text:"]"}]);
        }
        else {
            clickedCell.text(result);
        }
        namesRef.push(result);
        var nlist = scopes[0].nvars;
        var tlist = scopes[0].tvars;
        if (scope != 0) {
            nlist.concat(scopes[scope].nvars);
            tlist.concat(scopes[scope].tvars);
        }
        $(clickedCell).removeClass("aID");
        
        var eCell = clickedCell;
        while (!eCell.hasClass("expr"))
            eCell = eCell.next();
        
        if (nlist.indexOf(result) >= 0) {
            $(clickedCell).addClass("naID");
            $(eCell).addClass("numeric");
        }
        else if (tlist.indexOf(result) >= 0) {
            $(clickedCell).addClass("taID");
            $(eCell).addClass("text");
        }
        else {
            console.log("problem in aIDCallback");
        }
        console.log($(clickedCell).attr('class')); //rtodo
        
    }
    
    function taIDCallback(result) {
        if (result == null)
            return;
        
        if (clickedCell.text() != 'ID') {
            namesRef.splice(namesRef.indexOf(clickedCell.text()),1);
        }
        if (result[result.length-1] == ']') {
            var str = result.substring(0,(result.length-1));
            clickedCell.text(str);
            editor.addCell(clickedCell,[{text:"index", type:"index"}, {text:"]"}]);
        }
        else {
            clickedCell.text(result);
        }
        namesRef.push(result);
    }
    
    function naIDCallback(result) {
        if (result == null)
            return;
        
        if (clickedCell.text() != 'ID') {
            namesRef.splice(namesRef.indexOf(clickedCell.text()),1);
        }
        if (result[result.length-1] == ']') {
            var str = result.substring(0,(result.length-1));
            clickedCell.text(str);
            editor.addCell(clickedCell,[{text:"index", type:"index"}, {text:"]"}]);
        }
        else {
            clickedCell.text(result);
        }
        namesRef.push(result);
        
        if (clickedCell.hasClass("iforID")) {
            var x = 2;
            var fCell = clickedCell;
            while (x > 0) {
                fCell = fCell.next();
                while (!fCell.hasClass("forID"))
                    fCell = fCell.next();
                fCell.text(result);
                x--;
            }
        }
    }
    
    function varIDCallback(result) {
        if (result == null)
            return;
        
        
        var eCell = clickedCell;
        while (!eCell.hasClass("expr"))
            eCell = eCell.next();
        
        if (clickedCell.text() != 'ID') {
            namesRef.splice(namesRef.indexOf(clickedCell.text()),1);
            if (eCell.text() == 'EXPR') {
                if (eCell.hasClass("numeric"))
                    $(eCell).removeClass("numeric");
                else if (eCell.hasClass("text"))
                    $(eCell).removeClass("text");
            }
        }
        
        clickedCell.text(result);
        namesRef.push(result);
        var nlist = scopes[0].nvars;
        var tlist = scopes[0].tvars;
        if (scope != 0) {
            nlist.concat(scopes[scope].nvars);
            tlist.concat(scopes[scope].tvars);
        }
//        $(clickedCell).removeClass("aID");
        
        
        if (nlist.indexOf(result) >= 0) {
//            $(clickedCell).addClass("naID");
            $(eCell).addClass("numeric");
        }
        else if (tlist.indexOf(result) >= 0) {
//            $(clickedCell).addClass("taID");
            $(eCell).addClass("text");
        }
        else {
            console.log("problem in varIDCallback");
        }
        console.log($(clickedCell).attr('class')); //rtodo
        
    }
    
    function fcallCallback(result) {
        printScopes();
        determineScope(clickedCell);
        if (result == null)
            return;
        
        if (clickedCell.text() != 'FUNCTION') {
            namesRef.splice(namesRef.indexOf(clickedCell.text()));
        }
        namesRef.push(result);
//        console.log(result);
        clickedCell.text(result);
        var fcalled = getFunction(result);
        console.log(fcalled.name);
//        console.log(fcalled.param);
//        console.log(fcalled.param.length);
        if (fcalled.param.length == 0)
            return;
        else {
            var pCell = clickedCell.next();
            for (i=0;i<fcalled.param.length;i++) {
                console.log(i);
                if (i > 0) {
                    editor.addCell(pCell, [{text:", "}]);
                    pCell = pCell.next();
                }
                editor.addCell(pCell, [{text:"ID", type: "pID " + fcalled.param[i] + " scope" + scope}]);
                pCell = pCell.next();
            }
        }
    }
    
    function nConstantCallback(result) {
        if (result == null)
            return;
        
        clickedCell.text(result); //todo this probably needs MORE to it
    }
    
    function indexCallback(result) {
        determineScope(clickedCell);
        if (result == null)
            return;
        else if (result == "Constant") {
            createNumPad(0, null, "Numeric Entry", "Please enter an index to reference.", 0, 10, nConstantCallback);
        }
        
        else if (result == "Variable") {
            var list = scopes[0].nvars;
            if (scope != 0)
                list = list.concat(scopes[scope].nvars);
            createSelector("Numeric Variables", list, nvarCallback);
        }
    }
    
    function wexprCallback(result) {
        if (result == null)
            return;
        else if (result == "Text") {
            $(clickedCell).removeClass("write");
            $(clickedCell.addClass("text"));
            createSelector("Text Expression", ["Constant", "Variable", "Function Call", "EXPR + EXPR"], texprCallback);
        }
        else if (result == "Numeric") {
            $(clickedCell).removeClass("write");
            $(clickedCell.addClass("numeric"));
            createSelector("Numeric Expression", ["Constant", "Variable", "Function Call", "EXPR"], nexprCallback);
        }
        else {
            console.log("Error in wexprCallback");
        }
    }
    
    function texprCallback(result) {
        determineScope(clickedCell);
        if (result == null)
            return;
        else if (result == "Constant") {
            createStringPad("Text Constant", "Please enter a string constant.", tconstCallback);
        }
        else if (result == "Variable") {
            var list = scopes[0].tvars;
            if (scope != 0)
                list = list.concat(scopes[scope].tvars);
            createSelector("Text Variables", list, tvarCallback);
        }
        else if (result == "Function Call") {
            createSelector("Text Functions", tFuns, tfunCallback);
        }
        else if (result == "EXPR + EXPR") {
            clickedCell.text("EXPR");
            editor.addCell(clickedCell, [{text:"&nbsp+&nbsp;"}, {text:"EXPR",type:"expr text scope" + scope}]);
            return;
        }
    }
    
    function tconstCallback(result) {
        if (result == null)
            return;
        else {
            clickedCell.text('"' + result + '"');
        }
    }
    
    function tvarCallback(result) {
        if (result == null)
            return;
        clickedCell.text(result);
    }
    
    function tfunCallback(result) {
        namesRef.push(result);
        //        console.log(result); rtodo
        clickedCell.text(result);
        editor.addCell(clickedCell, [{text:"(", type:"openParen"}, {text:")", type:"closeParen"}]);
        var fcalled = scopes[getFunction(result)];
        if (fcalled.param.length == 0)
            return;
        else {
            var pCell = clickedCell.next();
            for (i=0;i<fcalled.param.length;i++) {
                if (i > 0) {
                    editor.addCell(pCell, [{text:", "}]);
                    pCell = pCell.next();
                }
                editor.addCell(pCell, [{text:"ID", type: "pID " + fcalled.param[i]}]);
                pCell = pCell.next();
            }
        }
    }
    
    function nexprCallback(result) {
        determineScope(clickedCell);
        if (result == null)
            return;
        else if (result == "Constant") {
            createNumPad(null, null, "Numeric Entry", "Please enter a numeric value.", true, 10, nConstantCallback);
        }
        else if (result == "Variable") {
            var list = scopes[0].nvars;
            if (scope != 0)
                list = list.concat(scopes[scope].nvars);
            createSelector("Numeric Variables", list, nvarCallback);
        }
        else if (result == "Function Call") {
            createSelector("Numeric Functions", nFuns, nfunCallback);
        }
        else if (result == "EXPR") {
            createSelector("Expressions", ["EXPR + EXPR", "EXPR - EXPR", "EXPR * EXPR", "EXPR / EXPR", "EXPR % EXPR", "(EXPR)"], nexprCallback)
        }
        else if (result == "EXPR + EXPR") {
            editor.addCell(clickedCell, [{text:"&nbsp;+&nbsp;"}, {text:"EXPR", type:"expr numeric scope" + scope}]);
            return;
        }
        else if (result == "EXPR - EXPR") {
            editor.addCell(clickedCell, [{text:"&nbsp;-&nbsp;"}, {text:"EXPR", type:"expr numeric scope" + scope}]);
            return;
        }
        else if (result == "EXPR * EXPR") {
            editor.addCell(clickedCell, [{text:"&nbsp;*&nbsp;"}, {text:"EXPR", type:"expr numeric scope" + scope}]);
            return;
        }
        else if (result == "EXPR / EXPR") {
            editor.addCell(clickedCell, [{text:"&nbsp;/&nbsp;"}, {text:"EXPR", type:"expr numeric scope" + scope}]);
            return;
        }
        else if (result == "EXPR % EXPR") {
            editor.addCell(clickedCell, [{text:"&nbsp;%&nbsp;"}, {text:"EXPR", type:"expr numeric scope" + scope}]);
            return;
        }
    }
    
    function nvarCallback(result) {
        if (result == null)
            return;
        if (result[result.length-1] == ']') {
            var str = result.substring(0,(result.length-1));
            clickedCell.text(str);
            editor.addCell(clickedCell,[{text:"index", type:"index"}, {text:"]"}]);
        }
        else {
            clickedCell.text(result);
        }
    }
    
    function nfunCallback(result) {
        namesRef.push(result);
        //        console.log(result); rtodo
        clickedCell.text(result);
        editor.addCell(clickedCell, [{text:"(", type:"openParen"}, {text:")", type:"closeParen"}]);
        var fcalled = scopes[getFunction(result)];
        if (fcalled.param.length == 0)
            return;
        else {
            var pCell = clickedCell.next();
            for (i=0;i<fcalled.param.length;i++) {
                if (i > 0) {
                    editor.addCell(pCell, [{text:", "}]);
                    pCell = pCell.next();
                }
                editor.addCell(pCell, [{text:"ID", type: "pID " + fcalled.param[i]}]);
                pCell = pCell.next();
            }
        }
    }
    
    function bexprCallback(result) {
        determineScope(clickedCell);
        if (result == null)
            return;
        else if (result == "EXPR == EXPR") {
            $(clickedCell).removeClass("bool");
            $(clickedCell).removeClass("expr");
            clickedCell.text("ID");
            $(clickedCell).addClass("varID");
            editor.addCell(clickedCell, [{text:"&nbsp;==&nbsp;"}, {text:"EXPR", type:"expr scope " + scope}]);
        }
        else if (result == "EXPR != EXPR") {
            $(clickedCell).removeClass("bool");
            $(clickedCell).removeClass("expr");
            clickedCell.text("ID");
            $(clickedCell).addClass("varID");
            editor.addCell(clickedCell, [{text:"&nbsp;!=&nbsp;"}, {text:"EXPR", type:"expr scope " + scope}]);
        }
        else if (result == "EXPR > EXPR") {
            $(clickedCell).removeClass("bool");
            $(clickedCell).removeClass("expr");
            clickedCell.text("ID");
            $(clickedCell).addClass("varID");
            editor.addCell(clickedCell, [{text:"&nbsp;>&nbsp;"}, {text:"EXPR", type:"expr scope " + scope}]);
        }
        else if (result == "EXPR >= EXPR") {
            $(clickedCell).removeClass("bool");
            $(clickedCell).removeClass("expr");
            clickedCell.text("ID");
            $(clickedCell).addClass("varID");
            editor.addCell(clickedCell, [{text:"&nbsp;>=&nbsp;"}, {text:"EXPR", type:"expr scope " + scope}]);
        }
        else if (result == "EXPR < EXPR") {
            $(clickedCell).removeClass("bool");
            $(clickedCell).removeClass("expr");
            clickedCell.text("ID");
            $(clickedCell).addClass("varID");
            editor.addCell(clickedCell, [{text:"&nbsp;<&nbsp;"}, {text:"EXPR", type:"expr scope " + scope}]);
        }
        else if (result == "EXPR <= EXPR") {
            $(clickedCell).removeClass("bool");
            $(clickedCell).removeClass("expr");
            clickedCell.text("ID");
            $(clickedCell).addClass("varID");
            editor.addCell(clickedCell, [{text:"&nbsp;<=&nbsp;"}, {text:"EXPR", type:"expr scope " + scope}]);
        }
    }
    
    function parenCallback(result) {
        determineScope(clickedCell);
        console.log(scope);
        var pnum = getpnum(scope);
        console.log(pnum);
        if (result == null)
            return;
        else if (!result)
            return;
        while(!clickedCell.hasClass('fcParen')){
            clickedCell = clickedCell.next();
        }
        clickedCell = clickedCell.prev();
        if (clickedCell.text() == "*/") {
            editor.addCell(clickedCell,[{text: ",&nbsp;"}]);
            clickedCell = clickedCell.next();
        }
//        console.log("add parameter?");
        editor.addCell(clickedCell,
                       [{text:"ID", type: "pname scope" + scope + " p" + pnum},
                        {text:"&nbsp;/*", type: "datatype"},
                        {text:"TYPE", type: "datatype ptype scope" + scope + " p" + pnum},
                        {text:"*/", type: "datatype"}]
                       );
        scopes[scope].param.push("untyped");
    }
    
    function pnameCallback(result) {
        determineScope(clickedCell);
        if (result == null){
            return;
		}
        else if (namesUsed.indexOf(result) >= 0) {
			createAlertBox("Invalid Character",result+" is in used!",1,dummy);
            //create alert name used todo
            return;
        }
        else if (resWords.indexOf(result) >= 0) {
			if(result == '')
				result = "Empty String";
			createAlertBox("Invalid Entry",result+" is Reserved",1,dummy);
            //create alert is reserved word todo
            return;
        }
        else {
			if( /^[a-zA-Z]+$/.test(result[0]) == true){
				if(/^[a-zA-Z0-9]+$/.test(result) == false){
					createAlertBox("Invalid Character","Please use only alphabetical letters!",1,dummy);
					return;
				}
			}else{
				createAlertBox("Invalid Character",result+" is invalid!",1,dummy);
				return;
			}
            scopes[scope].namesUsed.push(result);
            varExists(clickedCell.text(), scope);
            clickedCell.text(result);
            if (scopes.length > 1)
                determineScope(clickedCell);
            var tCell = clickedCell;
            while (!(tCell.hasClass("ptype")))
                tCell = tCell.next();
            if (tCell.text() == 'Text')
                scopes[scope].tvars.push(result);
            else if (tCell.text() == 'Numeric')
                scopes[scope].nvars.push(result);
            else
                scopes[scope].unvars.push(result);
        }
//        console.log(scopes[scope].name + ":\n\ttvars: " + scopes[scope].tvars + "\n\tnvars: " + scopes[scope].nvars + "\n\tunvars: " + scopes[scope].unvars);
//        console.log("namesUsed: " + namesUsed);
        printScopes();
    }
    
    function ptypeCallback(result) {
        if (result == null)
            return;
        determineScope(clickedCell);
        var pnum = determinepnum();
        console.log(pnum);
        clickedCell.text(result);
        //        console.log(result); rtodo
        
        //        locate cell containing variable name
        var nCell = clickedCell;
        while (!nCell.hasClass("pname"))
            nCell = nCell.prev();
        
        //        console.log(nCell.text()); rtodo
        //        if it has a name, remove it from the list it's in, and put it back in the proper list
        if (nCell.text() != 'ID') {
            varExists(nCell.text(), scope);
            if (result == 'Text') {
                scopes[scope].tvars.push(nCell.text());
                scopes[scope].param[pnum] = 'text';
            }
            else if (result == 'Numeric') {
                scopes[scope].nvars.push(nCell.text());
                scopes[scope].param[pnum] = 'numeric';
            }
            else
                console.log("WHAT DID YOU DO?!?!?");
        }
        printScopes();
    }
    
//    function that handles the naming of variables and arrays
    function vnameHandler() {
        console.log("naming a var"); //rtodo
        if (clickedCell.hasClass("array")) {
//            if the cell doesn't contain 'id', the name already exists somewhere,
//            so we need to make sure it isn't referenced before attempting to change it
            if (clickedCell.text() != 'ID') {
                if (varReffed(clickedCell.text().concat("[]"))) {
                    //create alert todo
                    return;
                }
            }
            
//            if the var isn't reffed, allow the name to be entered via string entrypad
            createStringPad("Variable Name", "Please give the array a name.", vnameCallback);
        }
        else {
//            if the cell doesn't contain 'id', the name already exists somewhere,
//            so we need to make sure it isn't referenced before attempting to change it
            if (clickedCell.text() != 'ID') {
                if (varReffed(clickedCell.text())) {
                    //create alert todo
                    return;
                }
            }
            
//            if the var isn't reffed, allow the name to be entered via string entrypad
            createStringPad("Variable Name", "Please give the variable a name.", vnameCallback);
//            console.log("naming a standard variable"); rtodo
        }
    }
    
    function pnameHandler() {
        if (clickedCell.text() != 'ID')
            if (varReffed(clickedCell.text())) {
                //create alert todo
                return;
            }
        createStringPad("Parameter Name", "Please give the parameter a name.", pnameCallback);
    }
    
    function fnameHandler() {
//        console.log("Naming a function"); rtodo
//        abort if the function has already been referenced
        if (clickedCell.text() != 'ID') {
            if (varReffed(clickedCell.text())) {
                // create alert todo
                return;
            }
        }
        createStringPad("Function Name", "Please give the function a name.", fnameCallback);
    }
    
    function vtypeHandler() {
        if (clickedCell.hasClass("array")) {
//            console.log("typing an array"); rtodo
//            locate the cell containing this var's name
            var nCell = clickedCell;
            while (!nCell.hasClass("vname"))
                nCell = nCell.prev();
//            console.log(nCell.text()); rtodo
            
//            check if the variable is reffed, and abort if it is
            if (nCell.text() != 'ID') {
                if (varReffed(nCell.text().concat("[]"))) {
                    //create alert todo
                    return;
                }
            }
            
//            if the variable is not reffed, spawn the selector for setting its type
            createSelector("Variable Types", vtypes, vtypeCallback);
        }
        else {
            
//            locate the cell containing this var's name
            var nCell = clickedCell;
            while (!nCell.hasClass("vname"))
                nCell = nCell.prev();
            
//            check if the variable is reffed, and abort if it is
            if (nCell.text() != 'ID') {
                if (varReffed(nCell.text())) {
                    //create alert todo
                    return;
                }
            }
            
//            if the variable is not reffed, spawn the selector for setting its type
            createSelector("Variable Types", vtypes, vtypeCallback);
//            console.log("typing a standard var"); rtodo
        }
    }
    
    function ptypeHandler() {
//        console.log("typing a param"); rtodo
        
        
        //            locate the cell containing this var's name
        var nCell = clickedCell;
        while (!nCell.hasClass("pname"))
            nCell = nCell.prev();
        
        //            check if the variable is reffed, and abort if it is
        if (nCell.text() != 'ID') {
            if (varReffed(nCell.text())) {
                //create alert todo
                return;
            }
        }
        
        //            if the variable is not reffed, spawn the selector for setting its type
        createSelector("Parameter Types", vtypes, ptypeCallback);
    }
    
    function ftypeHandler() {
        console.log("typing a function"); // rtodo
        
//        locate the function's name
        var nCell = clickedCell;
        while (!nCell.hasClass("fname"))
            nCell = nCell.prev();
        
//        check if function is reffed
        if (nCell.text() != 'ID') {
            if (varReffed(nCell.text())) {
                //create alert todo
                return;
            }
        }
        createSelector("Function Types", ftypes, ftypeCallback);
    }
    
    function aIDHandler() {
        console.log("choosing a variable to assign"); //rtodo
        determineScope(clickedCell);
        var list = scopes[0].tvars.concat(scopes[0].nvars);
        if (scope != 0)
            list = list.concat(scopes[scope].tvars.concat(scopes[scope].nvars));
        createSelector("Variables", list, aIDCallback);
    }
    
    function taIDHandler() {
        console.log("choosing a text var to assign"); //rtodo
        determineScope(clickedCell);
        var list = scopes[0].tvars;
        if (scope != 0)
            list = list.concat(scopes[scope].tvars);
        createSelector("Variables", list, taIDCallback);
    }
    
    function naIDHandler() {
        console.log("choosing a numeric var to assign"); //rtodo
        determineScope(clickedCell);
        var list = scopes[0].nvars;
        if (scope != 0)
            list = list.concat(scopes[scope].nvars);
        createSelector("Variables", list, naIDCallback);
    }
    
    function varIDHandler() {
        console.log("choosing a var to be used in a boolean condition");
        determineScope(clickedCell);
        
        var eCell = clickedCell;
        while (!eCell.hasClass("expr"))
            eCell = eCell.next();
        
        var list;
        if (eCell.text() == "EXPR") {
            list = scopes[0].tvars.concat(scopes[0].nvars);
            if (scope != 0)
                list = list.concat(scopes[scope].tvars.concat(scopes[scope].nvars));
        }
        else {
            if (eCell.hasClass("text")) {
                list = scopes[0].tvars;
                if (scope != 0)
                    list = list.concat(scopes[scope].tvars);
            }
            else if (eCell.hasClass("numeric")) {
                list = scopes[0].nvars;
                if (scope != 0)
                    list = list.concat(scopes[scope].nvars);
            }
        }
        createSelector("Variables", list, varIDCallback);
    }
    
    function fcallHandler() {
        console.log("choosing a function to call");
        createSelector("Void Functions", vFuns, fcallCallback);
    }
    
    function sizeHandler() {
//        console.log("need to insert a numeric constant"); rtodo
        createNumPad(0, null, "Size Entry", "Set the size of your array.", 0, 10, nConstantCallback);
    }
    
    function indexHandler() {
        createSelector("Index Options", ["Constant", "Variable"], indexCallback);
    }
    
    function exprHandler() {
//        console.log("this will handle expression clicks"); rtodo
        if (clickedCell.hasClass("write"))
            createSelector("Write Expression", ["Text", "Numeric"], wexprCallback);
        else if (clickedCell.hasClass("text"))
            createSelector("Text Expression", ["Constant", "Variable", "Function Call", "EXPR + EXPR"], texprCallback);
        else if (clickedCell.hasClass("numeric"))
            createSelector("Numeric Expression", ["Constant", "Variable", "Function Call", "EXPR"], nexprCallback);
        else if (clickedCell.hasClass("bool"))
            createSelector("Boolean Expression", btypes, bexprCallback);
    }
    
    function parenHandler() {
        createAlertBox("Parameters", "Add another parameter?", 0, parenCallback);
    }
    
    function varExists(name, scope) {
        console.log(name + " " + scope);
        console.log(scopes[scope].tvars);
        console.log(scopes[scope].nvars);
        console.log(scopes[scope].unvars);
        printScopes();
        var tname = name;
        if (name[name.length-1] == "]") {
            console.log("ARRAY");
            tname = name.substring(0,(name.length-2));
            console.log(tname);
        }
        console.log(tname);
        if (scopes[scope].tvars.indexOf(name) >= 0)
            scopes[scope].tvars.splice(scopes[scope].tvars.indexOf(name), 1);
        else if (scopes[scope].nvars.indexOf(name) >= 0)
            scopes[scope].nvars.splice(scopes[scope].nvars.indexOf(name), 1);
        else if (scopes[scope].unvars.indexOf(name) >= 0)
             scopes[scope].unvars.splice(scopes[scope].unvars.indexOf(name), 1);
        if (scopes[scope].namesUsed.indexOf(tname) >= 0)
            scopes[scope].namesUsed.splice(scopes[scope].namesUsed.indexOf(tname), 1);
        
//        var j = scopes.length;
//        for (i=0;i<j;i++) {
//            if (scopes[i].tvars.indexOf(name) >= 0) {
//                console.log("text var exists"); // rtodo
//                scopes[i].tvars.splice(scopes[i].tvars.indexOf(name), 1);
//                return;
//            }
//            else if (scopes[i].nvars.indexOf(name) >= 0) {
//                console.log("numeric var exists"); //rtodo
//                scopes[i].nvars.splice(scopes[i].nvars.indexOf(name), 1);
//                return;
//            }
//            else if (scopes[i].unvars.indexOf(name) >= 0) {
//                scopes[i].unvars.splice(scopes[i].unvars.indexOf(name), 1);
//                return;
//            }
//        }
    }
    
    function determinepnum() {
        var j = getpnum(scope);
        for (i = 0; i< j+1;i++) {
            if (clickedCell.hasClass("p" + i))
                return i;
        }
    }
    
    function funExists(name) {
        if (tFuns.indexOf(name) >= 0)
            tFuns.splice(tFuns.indexOf(name),1);
        else if (nFuns.indexOf(name) >= 0)
            nFuns.splice(nFuns.indexOf(name),1);
        else if (vFuns.indexOf(name) >= 0)
            vFuns.splice(vFuns.indexOf(name),1);
//        else if (namesUsed.indexOf(name) >=1)
//            namesUsed.splice(namesUsed.indexOf(name),1);
    }
    
    function scopeAlter(oldName,newName) {
        console.log(oldName + " " + newName);
        var j = scopes.length;
        if (scopes[0].namesUsed.indexOf(oldName) >= 0)
            scopes[0].namesUsed.splice(namesUsed.indexOf(oldName),1);
        scopes[0].namesUsed.push(newName);
        for (i=1; i < j; i++) {
            if (scopes[i].name == oldName) {
                scopes[i].name = newName;
                printScopes();
                return;
            }
                
        }
    }
    
    function printScopes() {
        var j = scopes.length;
        for (i=0;i<j;i++) {
            console.log("Scope " + i + ": " + scopes[i].name);
            console.log("\tnvars: " + scopes[i].nvars);
            console.log("\ttvars: " + scopes[i].tvars);
            console.log("\tunvars: " + scopes[i].unvars);
            console.log("\tparam: " + scopes[i].param);
            console.log("\tscopenum: " + scopes[i].scopenum);
			console.log("\tnamesUsed: " + scopes[i].namesUsed);
        }
    }
    
    function varReffed(name) {
        //need to check whether var is in list of referenced variables (todo?)
        console.log("going to check if the var is reffed");
        if (namesRef.indexOf(name) >= 0)
            return true;
    }
    
    function determineInsertionScope(insertRowNum) {
        console.log(insertRowNum + "vs start at " + programStart);
        if (insertRowNum > (programStart-1)) {
            insertionScope = 0;
            console.log("insertionScope: " + insertionScope);
            return;
        }
        var row;
        var rowContents;
        for(var i = insertRowNum; i >= 0; i--){

            row = editor.rowToDOMArray(i);
            if (row.length > 3) {
                var cell = row[4];
                if($(cell).hasClass("fname")){
                    var j = scopes.length;
                    for (k = 1; k < j; k++) {
                        if ($(cell).hasClass("scope" + k)) {
                            insertionScope = k;
                            console.log("insertionScope: " + insertionScope);
                            return;
                        }
                    }
                }
            }
        }
    }
    
    function determineVarinx(insertRowNum) {
        if (insertRowNum > (programStart - 1)) {
            varinx = variableCount + 3;
            console.log("last variable row index" + varinx);
            return;
        }
        var row;
        for (i = insertRowNum; i>=0; i--) {
            console.log("for loop: " + i);
            row = editor.rowToArrayHtml(i);
            console.log(row);
            if (row.length > 3) {
                console.log(row[0]);
                if (row[0] == 'function') {
                    varinx = i + 2;
//                    if (variableCount == 0)
//                        varinx+=2;
                    console.log("last variable row index" + varinx);
                    return;
                }
                else if (row[0] == 'var') {
                    varinx = i + 1;
                    console.log("last variable row index" + varinx);
                    return;
                }
            }
        }
        
    }
    
    function getFunction(fname) {
        for (i=0;i<scopes.length;i++) {
            if (scopes[i].name == fname)
                return scopes[i];
        }
    }
    
    function getpnum(scope) {
        for (i = 0; i<scopes.length;i++) {
            if (scopes[i].scopenum == scope) {
                return (scopes[i].param.length);
            }
        }
    }
    
	function createSelector(title, optionS, callback) {
		var newSel = new Selector();
		newSel.open(title, optionS, callback, document.getElementById(divID));
	}

	function createStringPad(title, instructions, callback) {
		var newStrP = new StringPad();
		newStrP.open(title, instructions, callback, document.getElementById(divID));
	}

	function createNumPad(minValue, maxValue, titleStr, instructions, decimalAllowed, base, callback) {
		var newNumpad = new NumberPad();
		newNumpad.open(minValue, maxValue, titleStr, instructions, decimalAllowed, base, callback, document.getElementById(divID));
	}

	function createAlertBox(title, msg, bool, callback) {
		var alert = new Alert();
		alert.open(title, msg, bool, callback, document.getElementById(divID));
	}

	function dummy(result){
	return;
	}

	this.retrieveUpdates = retrieveUpdates;
	function retrieveUpdates(){
		editor.loadEditor("figJSSandboxEditor", "fig" + divID + "Editor", true);
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
		editor = new Editor("fig" + divID + "Editor", chapterName, exerciseNum, true, true, 1, true, true, true);
	}
}

function Scope(myName, s) {
    var name;       //a scope's name
    var tvars;      //list of text vars for a scope
    var nvars;      //list of numeric vars for a scope
    var unvars;     //list of untyped vars for a scope
    var param;      //list of the types of params in order
    var scopenum;
    var namesUsed;
    
    this.name = myName;
    this.tvars = [];
    this.nvars = [];
    this.unvars = [];
    this.param = [];
    this.scopenum = s;
    this.namesUsed = [];
}
