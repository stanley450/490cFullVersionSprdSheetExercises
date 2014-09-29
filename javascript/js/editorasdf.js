/***********************************************************************************
* Author:	Neil Vosburg
* File:		editor.js
*
*			This is the beginnings of an editor for the JavaScript lab. Its purpose
*			is to mimic Watson as it is now.
************************************************************************************/

function Editor(codeTable, prefix) {
	var selRow = 0;											// the current selected row
	var blank = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";			// blank template for unselected row
	var arrow = "&nbsp;&#8594;&nbsp;&nbsp;&nbsp;";			// arrow template for selected row
	var indent = "&nbsp;&nbsp;&nbsp;"						// indention used for inside brackets
	var variableCount = 0;									// keeps count of the amount of variables
	var funcCount = 0;										// keeps count of number of functions
	var programStart = 0;									// the line the main program starts
	var firstMove = false;									// keeps track if the user has added something to the main program
	var innerTableTemplate = "<table class='innerTable" + prefix + "'><tr><td class='codeTd'>&nbsp;&nbsp;</td><td class='codeTd'>" + blank + "</td></tr></table>";	// template used for a newly added row in the codeTable
	var innerTableArrowTemplate = "<table class='innerTable" + prefix + "'><tr><td class='codeTd'>&nbsp;&nbsp;</td><td class='codeTd'>" + arrow + "</td></tr></table>"; // template used for a newly selected row
	var green = "#007500";
	var blue = "#0000FF";
	var black = "#000000";
	var funcList = [];									// an array of currently declared functions
	var rowType = [];
	var curLine;
	var nextLine;
	var terminate = false;
	var promptFlag = false;
	var insideFunction = false;
	
	this.addVariable = addVariable;
	this.addOneLineElement = addOneLineElement;
	this.addFunction = addFunction;
	this.addIfThen = addIfThen;
	this.addIfElse = addIfElse;
	this.addWhile = addWhile;
	this.addFor = addFor;
	this.selectNextLine = selectNextLine;
	this.incSelRow = incSelRow;
	this.decSelRow = decSelRow;

	init();					// initialize some important stuff

	// init() .... it initializes some important stuff .. o_0
	function init() {
		var row;
		var cell;
		var innerTable;
		
		// make a blank row where the program starts (this could have been in the for loops above)
		row = codeTable.insertRow(0);	// make a new row
		cell = row.insertCell(0);		// make a new cell here
		cell.innerHTML = innerTableArrowTemplate;	// set the cell with arrow template
		programStart = 0;				// increate the program start to 2
		selRow = 0;						// selected row is line 2
		refreshLineCount();				// refresh the line count along the left margin
	}

	// all this does is initialize the jQuery UI dialog 
	$("#selectDialog").dialog({
				modal: false,
				autoOpen: false,
				height: 200,
				width: 175,
				position:[300,20],
				open: function (event, ui) {
					$('#selectDialog').css('overflow', 'hidden'); //this line does the actual hiding
				}
		});
		
	toggleEvents(); // initialize events

	// we must refresh the events upon each change within the tables... toggleEvents() is called each time something is altered
	function toggleEvents() {
		$('.innerTable' + prefix).off('mouseover');						// turn off mouseover event
		
		$('.innerTable' + prefix).on('mouseover', 'td', function(){		// turn it back on
			cellVal = $(this).text();							// grab the hovered cell's value
			colNum = ($(this).index());							// grab the hovered cell's index
			var rowNum = ($(this).parent().parent().parent().parent().parent().index());	// grab the row number from codeTable (this is a silly way of doing it, but it works)
			
			// depending on what cell the mouse if over, highlight accordingly
			// go look at the functions getting called here to understand what is going on
			// we pass rowNum and colNum to tell the function where start highlighting
			if (cellVal.indexOf("while") >= 0) highlightControlStructure(rowNum, colNum);
			else if (cellVal.indexOf("if") >= 0) highlightControlStructure(rowNum, colNum);
			else if (cellVal.indexOf("function") >= 0) highlightControlStructure(rowNum, colNum);
			else if (cellVal.indexOf("for") >= 0) highlightControlStructure(rowNum, colNum);
			else if (cellVal.indexOf('{') >= 0) highlightControlStructure(rowNum - 1, 0); 	// start highlighting a line before the '{'
			else if (cellVal.indexOf('(') >= 0) highlightParenthesis('(', ')', rowNum, colNum);	// must highlight backwards if we land on a '}'
			else if (cellVal.indexOf('}') >= 0) highlightControlStructureBackwards(rowNum, colNum);
			else if (cellVal.indexOf(')') >= 0)	highlightParenthesisBackwards('(', ')', rowNum, colNum);
			else if(cellVal.indexOf('var') >= 0 || cellVal.indexOf(';') >= 0 || cellVal.indexOf('//') >= 0) highlightLine(rowNum, colNum);
			else highlightCell(rowNum, colNum);
		});
		
		$('.innerTable' + prefix).off('mouseout');					// toggle mouseout event
		
		// we must put the cells we highlight red back to their normal state after we mouseout of them
		$('.innerTable' + prefix).on('mouseout', 'td', function(){
			returnToNormalColor();
			codeTable.style.cursor = 'default';
		});
		
		
	}
	
	function returnToNormalColor() {
		for (var i = 0; i < codeTable.rows.length; i++) {
			var innerTable = codeTable.rows[i].cells[0].children[0];										// grab the inner table for this table data object
			var numCells = innerTable.rows[0].cells.length													// grab the number of cells in this inner table
			
			// we must look for special characters/keywords that let us now we need to re-color cells in that row
			if (numCells >= 3 && innerTable.rows[0].cells[2].innerHTML.indexOf("//") >= 0) {				// a comment? it needs to be green
				for (var j = 0; j < 2; j++) innerTable.rows[0].cells[j].style.color = black;				// first two cells are number and blank space (or possibly an arrow)
				for (var j = 2; j < numCells; j++) innerTable.rows[0].cells[j].style.color = green;			// last cells are the comment, make it green
			}
			else if (numCells >= 3 && innerTable.rows[0].cells[2].innerHTML.indexOf("function") >= 0) {		// a function declaration? function needs to be blue
				for (var j = 0; j < numCells; j++) {														
					if (j == 2) innerTable.rows[0].cells[j].style.color = blue;								// color "function" blue
					else if (j == numCells - 2 || j == numCells - 1) innerTable.rows[0].cells[j].style.color = green;				// the comment at the end of function needs to be green
					else innerTable.rows[0].cells[j].style.color = black;									// the rest black
				}
			}
			else if (numCells == 7 && innerTable.rows[0].cells[2].innerHTML.indexOf("var") >= 0) {			// a variable declaration? (num cells = 7) var needs to be blue
				for (var j = 0; j < numCells; j++) {
					if (j == 2) innerTable.rows[0].cells[j].style.color = blue;								// make var blue
					else if (j == 5 || j == 6) innerTable.rows[0].cells[j].style.color = green;				// the comment needs to be green
					else innerTable.rows[0].cells[j].style.color = black;									// the rest black
				}
			}
			else if (numCells > 7 && innerTable.rows[0].cells[2].innerHTML.indexOf("var") >= 0) {			// an array declaration? (num cells > 7) var needs to be blue, new needs to be blue
				for (var j = 0; j < numCells; j++) {
					if (j == 2 || j == 5) innerTable.rows[0].cells[j].style.color = blue;					// make var and new blue
					else if (j == 11 || j == 12) innerTable.rows[0].cells[j].style.color = green;			// make comment green
					else innerTable.rows[0].cells[j].style.color = black;									// the rest black
				}
			}
			else if (numCells >= 3 && cellContainsKeyword(innerTable, 2)) {									// any keywords? (if, while, else, for, etc) ?
				for (var j = 0; j < numCells; j++) {
					if (j == 2) innerTable.rows[0].cells[j].style.color = blue;								// make the keyword blue
					else innerTable.rows[0].cells[j].style.color = black;									// the rest black
				}
			}
			else {
				for (var j = 0; j < numCells; j++) {														// the rest is black
					innerTable.rows[0].cells[j].style.color = "#000000";
				}
			}
		}
		
		/*
		$('.innerTable').off('click');						// toggle click event
			
		$(".innerTable").on('click','td',function(e) {		// the click event on a table data object
			var cellVal = $(this).text();					// grab the cell value of clicked cell
			var cellNum = $(this).index();					// grab the cell number of clicked cell
			var rowNum = ($(this).parent().parent().parent().parent().parent().index());	// grab row number in codeTable of clicked cell
			
			// if we click the number of the line (very left cell in each row), we try to delete something
			if (colNum == 0) {
				deleteFunction(rowNum, colNum);
				return;
			}
			
			if (selRow == rowNum) return;			// the selected row was clicked? do nothing
			if (rowNum < variableCount) return;		// we don't allow users to move into variables section
			
			// if the cell value is a blank (5 non-breaking spaces '\xA0'), we try to move to that location
			if (cellVal == '\xA0\xA0\xA0\xA0\xA0') {
				var innerTable = codeTable.rows[rowNum].cells[0].children[0];		// grab the inner table of this row
				if (checkValidRow(innerTable.rows[0], rowNum) == false) return;		// check to see if this is a valid position
				moveToLine(rowNum);												// move to line if we make it here
			}
			else $("#selectDialog").dialog('open');									// if its not a blank space, we clicked a cell, open selection dialog
		});
		*/
	}

	// check to see if a specific cell contains a keywords; return true if so
	function cellContainsKeyword(table, cellNo) {
		if (table.rows[0].cells[cellNo].innerHTML.indexOf("while") >= 0) return true;
		if (table.rows[0].cells[cellNo].innerHTML.indexOf("if") >= 0) return true;
		if (table.rows[0].cells[cellNo].innerHTML.indexOf("else") >= 0) return true;
		if (table.rows[0].cells[cellNo].innerHTML.indexOf("for") >= 0) return true;
		if (table.rows[0].cells[cellNo].innerHTML.indexOf("return") >= 0) return true;
		
		return false;
	}

	// move to a specified row
	function moveToLine(rowNum) {
		var newRow;
		var cell;

		codeTable.deleteRow(selRow);				// delete the current selected row
		newRow = codeTable.insertRow(rowNum);		// insert a new row at row number specified
		cell = newRow.insertCell(0);				// insert a new cell in new row just created
		cell.innerHTML = innerTableArrowTemplate;	// insert the innerTable template with array
		selectRow(rowNum);	// make this the new selected row
			
		refreshLineCount();							// refresh the line count along the side
	}

	// highlight one cell red at a specific row and column
	function highlightCell(rowInd, colInd) {
		var innerTable = codeTable.rows[rowInd].cells[0].children[0];	// grab the inner table at the specified row
		innerTable.rows[0].cells[colInd].style.color = "#FF0000";		// color the cell red at specific column
	}

	// highlightControlStructure() looks for matching braces '{' and '}'. Once the braces match up. it stops highlighting
	function highlightControlStructure(rowInd, colInd) {
		var bracket = 1;			// bracket found initialized to 1 so the while loops executes
		var numCells;				// number of cells in the current row
		var firstBrack = false;		// first bracket found flag; since bracket is initialized to one, the first bracket doesn't count
		
		for (var i = rowInd; i < codeTable.rows.length; i++) {								// iterate throughout rows starting at the specified index
			var innerTable = codeTable.rows[i].cells[0].children[0];						// grab the inner table of this row
			var numCells = innerTable.rows[0].cells.length									// grab the number of cells in this row
			for (var j = 0; j < numCells; j++) {											// iterate throughout these cells
				if (innerTable.rows[0].cells[j].textContent.indexOf("{") >= 0) {				// if we found a '{'
					if (!firstBrack) firstBrack = true;										// if this is the first bracket, skip it
					else bracket++;															// otherwise, count it
				}
				else if (innerTable.rows[0].cells[j].textContent.indexOf("}") >= 0) {			// if we found a '}'
					bracket--;																// subtract from bracket
				}
				
				innerTable.rows[0].cells[j].style.color = "#FF0000";						// color the current cell red as we go
			}
			if (bracket == 0) break;														// if we found matching brackets, brackets will be 0, break
		}
	}

	// highlightControlStructureBackwards() looks for match braces '{' and '}' backwards: the same as function above (almost)
	function highlightControlStructureBackwards(rowInd, colInd) {
		var bracket = 1;
		var numCells;
		var firstBrack = false;
		var firstLoop = true;			// a flag to see if we are on the first loop
		var i;
		var innerTable;
		
		for (i = rowInd; i >= 0; i--) {													// iterate starting at the specified row index
			innerTable = codeTable.rows[i].cells[0].children[0];						// grab the inner table for this row
			numCells = innerTable.rows[0].cells.length									// get the number of cells in this row
			for (var j = numCells - 1; j >= 0; j--) {									// start at num cells - 1
				if (firstLoop == true) { j = colInd; firstLoop = false; }				// if its the first loop, start at the specified column index

				if (innerTable.rows[0].cells[j].textContent.indexOf('{') >= 0) {			// if the cell contains '{', subtract from bracket
					bracket--;
				}
				else if (innerTable.rows[0].cells[j].textContent.indexOf('}') >= 0) {		// if the cell contains '}'
					if (!firstBrack) firstBrak = true;									// if its the first bracket, don't count it
					else bracket++;														// otherwise, count it
				}
				
				innerTable.rows[0].cells[j].style.color = "#FF0000";					// color the cells along the way
			}
			
			if (bracket == 0) break;													// break if bracket reaches 0
		}
		
		// we need to color the row right above where we started as this line contains the actual control structure
		innerTable = codeTable.rows[i - 1].cells[0].children[0];									// grab the row right before where we stopped
		numCells = innerTable.rows[0].cells.length;													// grab the number of cells in that row
		for (var k = 0; k < numCells; k++) innerTable.rows[0].cells[k].style.color = "#FF0000";		// color the row red
	}

	// highlightParenthesis() functions similarly to highlightControlStructure(); highlights parenthesis passed to it '(' and ')'
	function highlightParenthesis(openBracket, closeBracket, rowInd, colInd) {
		var bracket = 1;
		var numCells;
		var firstBrack = false;
		var firstLoop = true;
		var innerTable;
		
		while (bracket != 0) {
			for (var i = 0; i < codeTable.rows.length; i++) {
				if (firstLoop == true) i = rowInd;
				innerTable = codeTable.rows[i].cells[0].children[0];
				numCells = innerTable.rows[0].cells.length
				for (var j = 0; j < numCells; j++) {
					if (firstLoop == true) { j = colInd; firstLoop = false; }
					
					if (innerTable.rows[0].cells[j].textContent.indexOf(openBracket) >= 0) {
						if (!firstBrack) firstBrack = true;
						else bracket++;
					}
					else if (innerTable.rows[0].cells[j].textContent.indexOf(closeBracket) >= 0) {
						bracket--;
					}
					
					innerTable.rows[0].cells[j].style.color = "#FF0000";
					
					if (bracket == 0) break;
				}
				
				if (bracket == 0) break;
			}
		}
	}

	// highlightParenthesisBackwards() functions similarly to highlightControlStructureBackwards()
	function highlightParenthesisBackwards(openBracket, closeBracket, rowInd, colInd) {
		var bracket = 1;
		var numCells;
		var firstBrack = false;
		var firstLoop = true;
		var innerTable;
		
		while (bracket != 0) {
			for (var i = codeTable.rows.length - 1; i >= 0; i--) {
				if (firstLoop == true) i = rowInd;
				innerTable = codeTable.rows[i].cells[0].children[0];
				numCells = innerTable.rows[0].cells.length
				for (var j = numCells - 1; j >= 0; j--) {
					if (firstLoop == true) { j = colInd; firstLoop = false; }
					
					if (innerTable.rows[0].cells[j].textContent.indexOf(openBracket) >= 0) {
						bracket--;
					}
					else if (innerTable.rows[0].cells[j].textContent.indexOf(closeBracket) >= 0) {
						if (!firstBrack) firstBrack = true;
						else bracket++;
					}
					
					innerTable.rows[0].cells[j].style.color = "#FF0000";
					
					if (bracket == 0) break;
				}
				
				if (bracket == 0) break;
			}
		}
	}

	// highlightLine() simply highlights the row with the row index passed to it
	function highlightLine(rowInd) {
		var innerTable = codeTable.rows[rowInd].cells[0].children[0];	// grab the inner table at this index
		var numCells = innerTable.rows[0].cells.length;					// grab the number of cells for this row
		for (var i = 0; i < numCells; i++) {							// iterate throughout the cells
			innerTable.rows[0].cells[i].style.color = '#FF0000';		// highlight all cells red
		}
	}

	// addVariable() is responsible for adding a variable/array declaration
	function addVariable(element, params) {
		var row;
		var cell;
		var innerTable;
		
		var insideFunctionTest = isInsideFunction();
		if (insideFunctionTest[0] == true) {
			var rowToInsert = insideFunctionTest[1] + 2;
			var indentStr = findIndentation(rowToInsert);
			row = codeTable.insertRow(rowToInsert);
			cell = row.insertCell(0);
			cell.innerHTML = innerTableTemplate;
			innerTable = codeTable.rows[rowToInsert].cells[0].children[0];
			
			// if the element is a variable
			if (element == "variable") {
				addRow(innerTable, [ indentStr + "<b>var</b>&nbsp;", params[0], ";&nbsp;", "&nbsp;//", "&nbsp;" + params[1] ], 2);	// add the row
				addRowStyle(innerTable, [ blue, black, black, green, green ], 2);							// style the row accordingly
			}
			else if (element == "array") {	// if its an array
				addRow(innerTable, [ indentStr + "<b>var</b>&nbsp;", params[0], "&nbsp;=&nbsp;", "<b>new</b>&nbsp;", "Array", "(", params[1], ")", ";", "&nbsp;//&nbsp", params[2]], 2);	// add the row
				addRowStyle(innerTable, [ blue, black, black, blue, black, black, black, black, black, green, green ], 2);											// style it accordingly
			}
		}
		else {
			if (variableCount == 0) {															// if there are no variables initialized yet
				for (var i = 0; i < 2; i++) {													// iterate twice
					row = codeTable.insertRow(variableCount + i);							// insert a new row at variableCount + 2 + i (two lines for '// Scratch Pad' and blank line following)
					cell = row.insertCell(0);													// insert a new cell here
					cell.innerHTML = innerTableTemplate;										// put the innerTableTemplate in the new cell
					innerTable = codeTable.rows[variableCount + i].cells[0].children[0];	// grab the innerTable object we just created
					
					if (i == 0) { addRow(innerTable, [ "//&nbsp;", "Variables" ], 2); addRowStyle(innerTable, [ green, green ], 2); }				// the first iteration: add '// Variables'
					else if (i == 1) { addRow(innerTable, [ "&nbsp;" ], 2); }						// the second iteration: add a blank line
				
					programStart++;	// increase the program start line
					selRow++;		// increase the selected row
				}
			}

			row = codeTable.insertRow(variableCount + 1);							// insert a new row for the actual declaration; (variableCount + 3) because of '// Scratch Pad', blank line, and '//Variables'
			cell = row.insertCell(0);												// insert a new cell at the row
			cell.innerHTML = innerTableTemplate;										// insert our inner table template
			innerTable = codeTable.rows[variableCount + 1].cells[0].children[0];	// grab the inner table object we just created
			
			// if the element is a variable
			if (element == "variable") {
				addRow(innerTable, ["<b>var</b>&nbsp;", params[0], ";&nbsp;", "&nbsp;//", "&nbsp;" + params[1] ], 2);	// add the row
				addRowStyle(innerTable, [ blue, black, black, green, green ], 2);							// style the row accordingly
			}
			else if (element == "array") {	// if its an array
				addRow(innerTable, ["<b>var</b>&nbsp;", params[0], "&nbsp;=&nbsp;", "<b>new</b>&nbsp;", "Array", "(", params[1], ")", ";", "&nbsp;//&nbsp", params[2]], 2);	// add the row
				addRowStyle(innerTable, [ blue, black, black, blue, black, black, black, black, black, green, green ], 2);											// style it accordingly
			}
		
			variableCount++;	// increase the variable count
		}
		
		selRow++;			// increase the selected row
		programStart++;		// increase the program start line
		toggleEvents();		// toggle events to refresh the newly created row
		refreshLineCount();	// refresh the line count
	}

	function addBlankLine() {
		var row = codeTable.insertRow(selRow);
		var cell = row.insertCell(0);
		cell.innerHTML = innerTableTemplate;
		selRow++;
		toggleEvents();
		refreshLineCount();
	}

	// addOneLineElement() is responsible for adding elements that only require one line (excluding variable and array declarations)
	function addOneLineElement(element, params) {
		//if this is the very first move to add to the main program, add the main program comment
		if (!firstMove) {
			addMainProgramComment();
			firstMove = true;
		}
		
		var indentStr = findIndentation(selRow);	// get the correct indentation
		
		var row = codeTable.insertRow(selRow);		// get the selected row from the main codeTable
		var cell = row.insertCell(0);				// make a new cell here
		cell.setAttribute("class", "codeTableTd");
		cell.innerHTML = innerTableTemplate;		// put our inner table template in the new cell
		var innerTable = codeTable.rows[selRow].cells[0].children[0];	// grab the inner table over we just created
		
		// depending on which element it is, format the row correspondingly
		if (element == "assignment") {
			if (params.length == 2) addRow(innerTable, [ indentStr + params[0] + "&nbsp;", "=&nbsp", params[1], ";"], 2);
			else if (params.length == 3) addRow(innerTable, [ indentStr + params[0] + "&nbsp;", "=&nbsp;", params[1], "[", params[2], "]", ";"], 2);
			else if (params.length == 4) addRow(innerTable, [ indentStr + params[0] + "&nbsp;", "=&nbsp", params[1] + "&nbsp;", params[2] + "&nbsp;", params[3], ';' ], 2);
		}
		else if (element == "write") { addRow(innerTable, [ indentStr + "document.write(", params[0], ")", ";" ], 2); }
		else if (element == "writeln") { addRow(innerTable, [ indentStr + "document.writeln(", params[0], ")", ";" ], 2); }
		else if (element == "stringPrompt") { addRow(innerTable, [ indentStr + params[0] + "&nbsp;", "=&nbsp;", "prompt(", params[1], ",&nbsp;", params[2], ")", ";" ], 2); }
		else if (element == "numericPrompt") { addRow(innerTable, [ indentStr + params[0] + "&nbsp;", "=&nbsp;", "parseFloat(", "prompt(", params[1], ",", params[2], ")", ")", ";" ], 2); }
		else if (element == "functionCall") { 
			if (params.length == 1)	addRow(innerTable, [ indentStr + params[0] + "(", ")", ";" ], 2);
			else {
				addRow(innerTable, [ indentStr + params[0] + "(" ], 2);
				addRowStyle(innerTable, [ black ], 2);
				
				var i;
				for (i = 1; i < params.length; i++) {
					if (i != params.length - 1) {
						addRow(innerTable, [ params[i] + ",&nbsp;" ], i+2);
						addRowStyle(innerTable, [ black ], i+2);
					}
					else {
						addRow(innerTable, [ params[i] ], i+2);
						addRowStyle(innerTable, [ black ], i+2);
					}
				}
				
				addRow(innerTable, [ ")", ";" ], i+2);
				addRowStyle(innerTable, [ black, black ], i+2);
			}
		}
		else if (element == 'assignmentFuncCall') {
			if (params.length == 2) addRow(innerTable, [ indentStr + params[0], "&nbsp;=&nbsp;", params[1] + "(", ")", ";" ], 2);
			else {
				addRow(innerTable, [ indentStr + params[0], "&nbsp;=&nbsp;", params[1] + "(" ], 2);
				addRowStyle(innerTable, [ black, black, black ], 2);
				
				var i;
				for (i = 2; i < params.length; i++) {
					if (i != params.length - 1) {
						addRow(innerTable, [ params[i] + ",&nbsp;" ], i+3);
						addRowStyle(innerTable, [ black ], i+3);
					}
					else {
						addRow(innerTable, [ params[i] ], i+3);
						addRowStyle(innerTable, [ black ], i+3);
					}
				}
				
				addRow(innerTable, [ ")", ";" ], i+3);
				addRowStyle(innerTable, [ black, black ], i+3);
			}
		}
		else if (element == "return") {
			addRow(innerTable, [ indentStr + "<b>return</b>&nbsp;", params[0], ";" ], 2);
			addRowStyle(innerTable, [ "blue", "black", "black" ], 2);
		}
		else if (element == 'arrayAssignment') {
			addRow(innerTable, [ indentStr + params[0], '[', params[1], ']', '&nbsp;=&nbsp;', params[2] ], 2);
			addRowStyle(innerTable, [ black, black, black ], 2);
		}
		else if (element == "freeExpression") {
			for (var i = 0; i < params.length; i++) {
				if (i == 0) addRow(innerTable, [ indentStr + params[i] ], i+2);
				else addRow(innerTable, [ params[i] ], i+2);
				
				addRowStyle(innerTable, [ black ], i+2);
			}
		}
		
		selectRow(selRow+1);				// increase the selected row by one
		
		if (selRow < programStart) programStart++;		// if the selected row is less than the program start line (editing a function), increase program start
		toggleEvents();									// toggle events to refresh them
		refreshLineCount();								// and also refresh line count
	}

	// addIfThen() is responsible for adding an If/Then control structure
	function addIfThen(params) {
		// if this is the first move the user has made toward the main program, put the main program comment
		if (!firstMove) {
			addMainProgramComment();
			firstMove = true;
		}
		var indentStr = findIndentation(selRow);	// get the correct indentation
		var row;
		var cell;
		var innerTable;
		
		for (var i = 0; i < 3; i++) {											// iterate three times
			row = codeTable.insertRow(selRow + i);								// create a new row at selRow + i
			cell = row.insertCell(0);											// create a new cell in the newly created row
			cell.innerHTML = innerTableTemplate;								// put our inner table template here
			innerTable = codeTable.rows[selRow + i].cells[0].children[0];		// get the newly created inner table object
			
			// add the row on one line, a '{' on the second line, and '}' on the third
			if (i == 0) {
				addRow(innerTable, [ indentStr + "<b>if</b>&nbsp;", "(", params[0] + "&nbsp;", params[1]  + "&nbsp;", params[2], ")" ], 2);
				addRowStyle(innerTable, [ "blue", "black", "black", "black" ], 2);
			}
			else if (i == 1) { addRow(innerTable, [ indentStr + "{" ], 2); }
			else if (i == 2) { addRow(innerTable, [ indentStr + "}" ], 2); }
		}
		
		if (selRow < programStart) programStart += 3;		// if the selected row is less than the program start (editing a function), increase program start by 3
		selectRow(selRow + 3);								// increase the selected row by 3 (added three items)
		toggleEvents();										// toggle events
		refreshLineCount();									// refresh the line count
	}

	// addIfElse() is very similar to addIfThen() except we add the 'else'
	function addIfElse(params) {
		if (!firstMove) {
			addMainProgramComment();
			firstMove = true;
		}
		var indentStr = findIndentation(selRow);
		var row;
		var cell;
		var innerTable;
		
		for (var i = 0; i < 6; i++) {
			row = codeTable.insertRow(selRow + i);
			cell = row.insertCell(0);
			cell.innerHTML = innerTableTemplate;
			innerTable = codeTable.rows[selRow + i].cells[0].children[0];
			
			if (i == 0) {
				addRow(innerTable, [ indentStr + "<b>if</b>&nbsp;", "(", params[0] + "&nbsp;", params[1] + "&nbsp;", params[2], ")" ], 2);
				addRowStyle(innerTable, [ "blue", "black", "black", "black" ], 2);
			}
			else if (i == 1) { addRow(innerTable, [ indentStr + "{" ], 2); }
			else if (i == 2) { addRow(innerTable, [ indentStr + "}" ], 2); }
			else if (i == 3) { addRow(innerTable, [ indentStr + "<b>else</b>" ], 2); addRowStyle(innerTable, [ "blue", ], 2); }
			else if (i == 4) { addRow(innerTable, [ indentStr + "{" ], 2); }
			else if (i == 5) { addRow(innerTable, [ indentStr + "}" ], 2); }
		}
		
		selectRow(selRow + 6);
		
		if (selRow < programStart) programStart += 6;
		toggleEvents();
		refreshLineCount();
	}

	// addWhile() is very similar to adding any other structure
	function addWhile(params) {
		if (!firstMove) {
			addMainProgramComment();
			firstMove = true;
		}
		var indentStr = findIndentation(selRow);
		var row;
		var cell;
		var innerTable;
		
		for (var i = 0; i < 3; i++) {
			row = codeTable.insertRow(selRow + i);
			cell = row.insertCell(0);
			cell.innerHTML = innerTableTemplate;
			innerTable = codeTable.rows[selRow + i].cells[0].children[0];
			
			if (i == 0) {
				addRow(innerTable, [ indentStr + "<b>while</b>&nbsp;", "(", params[0] + "&nbsp;", params[1] + "&nbsp;", params[2], ")" ], 2);
				addRowStyle(innerTable, [ "blue", "black", "black", "black" ], 2);
			}
			else if (i == 1) { addRow(innerTable, [ indentStr + "{" ], 2); }
			else if (i == 2) { addRow(innerTable, [ indentStr + "}" ], 2); }
		}
		
		selectRow(selRow + 3);
		
		if (selRow < programStart) programStart += 3;
		toggleEvents();
		refreshLineCount();
	}

	// addFor() adds a for loop to the current selected line just like addWhile()
	function addFor(params) {
		if (!firstMove) {
			addMainProgramComment();
			firstMove = true;
		}
		var indentStr = findIndentation(selRow);
		var row;
		var cell;
		var innerTable;
		
		for (var i = 0; i < 3; i++) {
			row = codeTable.insertRow(selRow + i);
			cell = row.insertCell(0);
			cell.innerHTML = innerTableTemplate;
			innerTable = codeTable.rows[selRow + i].cells[0].children[0];
			
			if (i == 0) {
				addRow(innerTable, [ indentStr + "<b>for</b>&nbsp;", "(", params[0] + "&nbsp;", "=&nbsp;", params[1], ";&nbsp;", params[2] + "&nbsp;", params[3] + "&nbsp;", params[4], ";&nbsp;", params[5], params[6], ")" ], 2);
				addRowStyle(innerTable, [ "blue", "black", "black", "black", "black", "black", "black", "black", "black", "black", "black", "black", "black" ], 2);
			}
			else if (i == 1) { addRow(innerTable, [ indentStr + "{" ], 2); }
			else if (i == 2) { addRow(innerTable, [ indentStr + "}" ], 2); }
		}
		
		selectRow(selRow + 3);
		
		if (selRow < programStart) programStart += 3;
		toggleEvents();
		refreshLineCount();
	}

	// addFunction() adds a new function declaration before the program start and after the variables declarations
	function addFunction(params) {
		var row;
		var cell;
		var innerTable;
		var beginRow;
		
		// if the user hasn't edited the main program OR selected row is less than program start, we begin at the program start line
		//if (!firstMove || selRow < programStart) beginRow = programStart;
		//else beginRow = programStart - 1;	// otherwise, we begin at programStart - 1
		if (!firstMove) beginRow = programStart;
		else beginRow = programStart - 1;
		
		// if we haven't added a function yet, we must insert the '// Functions' comment
		if (funcCount == 0) {
				row = codeTable.insertRow(beginRow);							// add the row at the 'beginRow' index
				cell = row.insertCell(0);
				cell.innerHTML = innerTableTemplate;
				innerTable = codeTable.rows[beginRow].cells[0].children[0];
				
				if (selRow >= beginRow) selRow++;								// increase selected row if it is greater or equal to beginRow
				
				addRow(innerTable, [ "//&nbsp;", "Functions" ], 2);
				addRowStyle(innerTable, [ green, green, ], 2);
				beginRow++;
				
				programStart++;	// increase program start line
		}
		
		// add a blank line at begin row (this creates a blank line after the function declaration)
		row = codeTable.insertRow(beginRow);
		cell = row.insertCell(0);
		cell.innerHTML = innerTableTemplate;
		innerTable = codeTable.rows[beginRow].cells[0].children[0];
		addRow(innerTable, [ "&nbsp;" ], 2);
		programStart++;
		if (selRow >= beginRow) selRow++;
		
		funcList.push([params[0], params.length - 2]);
		
		for (var i = 0; i < 3; i++) {											// iterate three times
			row = codeTable.insertRow(beginRow + i);							// create a row at beginRow
			cell = row.insertCell(0);											// insert a new cell in the row
			cell.innerHTML = innerTableTemplate;								// put our inner table template here
			innerTable = codeTable.rows[beginRow + i].cells[0].children[0];		// grab the innerTable object we just created
			
			// add the row on the first iteration, a '{' on second iteration, and a '}' on third iteration
			if (i == 0) {
				if (params.length > 3) {
					addRow(innerTable, [ "<b>function</b>&nbsp;", params[0] + "(" ], 2);
					addRowStyle(innerTable, [ blue, black ], 2);
					for (var j = 1; j < params.length - 1; j++) {
						if (j != params.length - 2) {
							addRow(innerTable, [ params[j], ",&nbsp;" ], 2 + (j * 2));
							addRowStyle(innerTable, [ black, black ], 2 + (j * 2));	
						}
						else {
							addRow(innerTable, [ params[j] ], 2 + (j * 2));
							addRowStyle(innerTable, [ black ], 2 + (j * 2));
						}
					}
					addRow(innerTable, [ ")&nbsp;", "//&nbsp;", params[params.length - 1] ], innerTable.rows[0].cells.length);
					addRowStyle(innerTable, [ black, green, green ], innerTable.rows[0].cells.length - 3);
				}
				else if (params.length == 3) {
					addRow(innerTable, [ "<b>function</b>&nbsp;", params[0] + "(", params[1], ")&nbsp;", "//&nbsp;", params[2] ], 2);
					addRowStyle(innerTable, [ blue, black, black, black, green, green ], 2);
				}
				else if (params.length == 2) {
					addRow(innerTable, [ "<b>function</b>&nbsp;", params[0] + "(", ")&nbsp;", "//&nbsp;", params[1] ], 2);
					addRowStyle(innerTable, [ blue, black, black, green, green ], 2);
				}	
			}
			else if (i == 1) { addRow(innerTable, [ "{" ], 2); }
			else if (i == 2) { addRow(innerTable, [ "}" ], 2); }
			
			if (selRow >= beginRow + i) selRow++;	// if the selected row is greater than or equal to the current row, increase selected row
		}
		
		selectRow(selRow);							// make sure the 'selRow' row is selected
		
		programStart += 3;							// increase the program start by 3
		funcCount++;								// increase the function count
		//funList.push("FUNCTION");				// push FUNCTION to the function list
		toggleEvents();								// refresh events
		refreshLineCount();							// refresh the line count
	}

	// addRow() takes an innerTable, a string of cell values, and a start index and populates the innerTable with these values
	function addRow(table, values, startInd) {
		var cell;
		for (var i = 0; i < values.length; i++) {			// for all cells in the table
			cell = table.rows[0].insertCell(startInd++);	// insert a cell at startInd
			cell.innerHTML = values[i];						// make the innerHTML of the cell cells[i]
		}
	}

	// addRowStyle() takes an innerTable, a string of colors, and a start index and styles the innerTable cells with these colors
	function addRowStyle(table, colors, startInd) {
		var cell;
		for (var i = 0; i < colors.length; i++) {			// for all cells in the table
			cell = table.rows[0].cells[startInd++];			// get the cell at the current index
			cell.style.color = colors[i];					// change its style to cells[i]
		}
	}
	
	function isInsideFunction() {
		if (selRow >= programStart) return false;
		
		var innerTable;
		var cellText;
		var bracketCount = 1;
		var firstBracket = false;
		var done = false;
		var start;
		if (firstMove) start = programStart - 3;
		else start = programStart - 2;
		var end;
		var i;
		
		while (!done) {
			for (i = start; i >= 0; i--) {
				innerTable = codeTable.rows[i].cells[0].children[0];
				if (innerTable.rows[0].cells.length == 3) {
					cellText = innerTable.rows[0].cells[2].textContent;
					if (cellText.indexOf("}") >= 0) {
						if (firstBracket == false) firstBracket = true;
						else bracketCount++;
					}
					else if (cellText.indexOf("{") >= 0) bracketCount--;
				}
				
				if (bracketCount == 0) break;
			}
			
			end = i - 1;

			if (selRow > end && selRow <= start) return [ true, end ];
			else { firstBracket = false; bracketCount = 1; start = end - 2; }
			
			if (start <= 0) done = true;
		}
		
		return [ false ];
	}
	
	// deleteFunction() checks to see what the element is that is requested to be deleted, and deletes that element
	function deleteFunction(rowNum, colNum) {
		var innerTable = codeTable.rows[rowNum].cells[0].children[0];			// grab the inner table that needs to be deleted
		
		if (isOneLineElement(innerTable.rows[0])) deleteOneLineElement(rowNum);	// if its a one line element, delete it
	}

	// deleteOneLineElement() is responsible for appropriately deleting an element that takes up one line
	function deleteOneLineElement(rowNum) {
		if (selRow > rowNum) selRow--;
		if (programStart > rowNum) programStart--;
		
		codeTable.deleteRow(rowNum);
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

	// selectRow() selects a row with the specified rowNum
	function selectRow(rowNum) {
		if (selRow != -1) {														// if there is a selected row
			var innerTable = codeTable.rows[selRow].cells[0].children[0];		// grab the innerTable for the currently selected row
			innerTable.rows[0].cells[0].innerHTML = blank;						// make its arrow go away (it is no longer selected)
		}
		
		selRow = rowNum;														// make the new selected row to be rowNum
		//var innerTable = codeTable.rows[selRow].cells[0].children[0];			// grab its inner table
		//innerTable.rows[0].cells[1].innerHTML = arrow;							// make it have an arrow (it is now selected)
	}

	// findIndentation() returns a string with the appropriate spacing depending on the row number passed to it
	// Starting from the top of the code, it finds how many mismatching brackets '{' '}' there are when the row
	// is reached. The number of opened brackets without a matching close parenthesis is how many tabs this row
	// will need
	function findIndentation(row) {
		var bracket = 0;	// number of brackets opened
		for (var i = 0; i < codeTable.rows.length; i++) {								// iterate throughout the code table
			if (i == row) break;														// when the iteration equals the row, stop
			var innerTable = codeTable.rows[i].cells[0].children[0];					// grab the inner table for this row in the code table
			var numCells = innerTable.rows[0].cells.length;								// grab the number of cells in this inner table
			for (var j = 0; j < numCells; j++) {										// iterate throughout the cells
				if (innerTable.rows[0].cells[j].textContent.indexOf('{') >= 0) {			// if an open bracket, add one to bracket
					bracket++;
				}
				else if (innerTable.rows[0].cells[j].textContent.indexOf('}') >= 0) {		// if a close bracket, subtract one from bracket
					bracket--;
				}
			}
		}
		
		// the bracket variable is how many indents we need
		var indents = "";
		for (var i = 0; i < bracket; i++) indents += indent;
		
		return indents;
	}

	// checkValidRow() makes sure the program doesn't move somewhere that it shouldn't
	// For example, we don't want the user moving into the variable sections
	function checkValidRow(row, rowNum) {

		if (row.cells[2].textContent.indexOf("//") >= 0) return false;								// don't let the user edit a comment
		if (row.cells[2].textContent == '\xA0') return false;											// don't let the user edit a blank line
		if (row.cells[2].textContent.indexOf("{") >= 0 && rowNum >= programStart) return false;		// don't let the user edit before a '{'
		if (rowNum < variableCount + 3) return false;												// don't let the user edit in the variable space
		
		// the following if statements ensure that a user doesn't edit before the program start (in the variable or function space.. unless its inside a function)
		if ((selRow < programStart && rowNum < programStart + 1) || (rowNum < programStart)) {
			if (row.cells[2].textContent.indexOf("{") >= 0 && selRow > rowNum) return false;
			if (row.cells[2].textContent.indexOf("}") >= 0 && selRow < rowNum) return false;
			if (row.cells[2].textContent.indexOf("function") >= 0) return false;
		}
		return true;
	}

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

	// refreshLineCount() refreshes the line count in the first cell of every inner table
	function refreshLineCount() {
		var innerTable;
		for (var i = 0; i < codeTable.rows.length; i++) {
			innerTable = codeTable.rows[i].cells[0].children[0];
			if (i <= 9) innerTable.rows[0].cells[0].innerHTML = i + "&nbsp;";
			else innerTable.rows[0].cells[0].textContent = i;
		}
	}

	// selectDialogConfirm() has to do with the selecting of options from the jQuery UI (not implemented)
	function selectDialogConfirm(result) {
		console.log(result);
	}

	function selectNextLine(line) {
		var numRows = codeTable.rows.length;
		var innerTable;
		var numCells;
		var execLines = 0;
		var found = false;
		
		for (var i = 0; i < numRows; i++) {
			innerTable = codeTable.rows[i].cells[0].children[0];
			if (innerTable.rows[0].cells.length > 3 && innerTable.rows[0].cells[2].innerHTML.indexOf("//") < 0) {
				execLines++;
			}
			
			if (execLines == line) {
				var oldInnerTable = codeTable.rows[selRow].cells[0].children[0];
				oldInnerTable.rows[0].cells[1].innerHTML = blank;
				innerTable.rows[0].cells[1].innerHTML = arrow;
				selRow = i;
				found = true;
				break;
			}
		}
		
		if (found == false) {
			var oldInnerTable = codeTable.rows[selRow].cells[0].children[0];
			oldInnerTable.rows[0].cells[1].innerHTML = blank;
			innerTable = codeTable.rows[numRows - 1].cells[0].children[0];
			innerTable.rows[0].cells[1].innerHTML = arrow;
			selRow = numRows - 1;
		}
	}
	
	function incSelRow() { selRow++; }
	function decSelRow() { selRow--; }
	
	var lineNums = [];
	var charCountStart = [ ];
	var charCountEnd = [ ];
	var codeStrLen;
	var rowNum = -1;
	
	this.getEditorText = getEditorText;
	function getEditorText() {
		var codeStr = "";
		var innerTable;
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
		
		for (var i = 0; i < codeTable.rows.length; i++) {
			innerTable = codeTable.rows[i].cells[0].children[0];
			numCells = innerTable.rows[0].cells.length;
			if (numCells == 2) { continue; }
			cellText = innerTable.rows[0].cells[2].textContent;
			
			if (numCells == 3) {
				if (cellText.indexOf("}") < 0 && cellText.indexOf("{") < 0 && cellText.indexOf("else") < 0) { rowType.push("blankLine"); continue; }
				else bracketFlag = true;
			}
			
			if (cellText.indexOf("function") >= 0) rowType.push("functionDeclaration");
			else if(cellText.indexOf("if") >= 0) rowType.push("if");
			else if(cellText.indexOf("else") >= 0) rowType.push("else");
			else if(cellText.indexOf("while") >= 0) rowType.push("while");
			else if(cellText.indexOf("return") >= 0) rowType.push("return");
			else if(cellText.indexOf("for") >= 0) rowType.push("for");
			else if(cellText.indexOf("//") >= 0) rowType.push("comment");
			else if(cellText.indexOf("writeln") >= 0) rowType.push("writeln");
			else if(cellText.indexOf("write") >= 0) rowType.push("write");
			else if(cellText.indexOf("var") >= 0) rowType.push("variable");
			else if(cellText.indexOf("{") >= 0) rowType.push("closeBracket");
			else if(cellText.indexOf("}") >= 0) rowType.push("openBracket");
			else if(innerTable.rows[0].cells[4].textContent.indexOf("parse") >= 0) rowType.push("prompt");
			else if(innerTable.rows[0].cells[4].textContent.indexOf("prompt") >= 0) rowType.push("prompt");
			else if(innerTable.rows[0].cells[3].textContent.indexOf("=") >= 0) rowType.push("assignment");
			else { rowType.push("functionCall"); funcCall = true; }
			
			for (var j = 2; j < numCells; j++) {
				cellText = innerTable.rows[0].cells[j].textContent;
				if (cellText.indexOf("//") >= 0) break;
				if (cellText.indexOf("document.writeln") >= 0) {
					if (firstChar == false) { firstChar = true; charCountStart.push(charCount + 1); lineNums.push(i); }
					if (!firstLine) firstLine = true;
					codeStr += "document1writeln(";
					charCount += 17;
				}
				else if (cellText.indexOf("document.write") >= 0) {
					if (firstChar == false) { firstChar = true; charCountStart.push(charCount + 1); lineNums.push(i); }
					if (!firstLine) firstLine = true;
					codeStr += "document1write(";
					charCount += 15;
				}
				else {
					if (cellText.indexOf(";") >= 0) {
						semi = cellText.indexOf(";");
						for (var k = 0; k < semi + 1; k++) tempText += cellText.charAt(k);
						cellText = tempText;
						firstLine = true;
					}
					
					codeStr += cellText;
					if (firstChar == false && bracketFlag == false) { firstChar = true; charCountStart.push(charCount + 1); lineNums.push(i); }
					if (!firstLine) firstLine = true;
					charCount += cellText.length;
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
		selRow = rowNum;
		
		codeStr = codeStr.replace("\xA0", " ");
		codeStr = codeStr.replace("\x1E", " ");
		var tCodeStr = "";
		for (var i = 0; i < codeStr.length; i++) {
			if (codeStr[i] != "\xA0") tCodeStr += codeStr[i];
			else tCodeStr += " ";
		}
		codeStrLen = tCodeStr.length;
		
		return tCodeStr;
	}
	
	this.selectLine = selectLine;
	this.isNewLine = isNewLine;
	this.checkPromptFlag = checkPromptFlag;
	
	function isNewLine(start, end) {
		if (start == -1 && end == -1) {

			return [ true, rowNum ];
		}
		for (var i = 0; i < charCountStart.length; i++) {
			if (start >= charCountStart[i] && end <= charCountEnd[i] + 1) { 
				if (lineNums[i] == rowNum) { return [ false, rowNum ]; }
				else {
					rowNum = lineNums[i];
					if (rowType[rowNum] == 'prompt') { promptFlag = true; }
					return [true, selRow];
				}
			}
		}
		return [ false, rowNum ];
	}
	
	function checkPromptFlag() {
		if (promptFlag) {
			promptFlag = false;
			selectLine(rowNum);
		}
	}
	
	function selectLine(row) {
		var innerTable;
		returnToNormalColor();
		for (var i = 0; i < codeTable.rows.length; i++) {
			innerTable = codeTable.rows[i].cells[0].children[0];
			innerTable.rows[0].cells[1].innerHTML = blank;
		}	
		highlightLine(row);
		innerTable = codeTable.rows[row].cells[0].children[0];
		innerTable.rows[0].cells[1].innerHTML = arrow;
		selRow = rowNum;
	}

	function selectLine3(start, end, varCount, haltFlag) {
		if (rowNum == -1 && nextLine == -1) return false;
		
		if (start == -1 && end == -1) {
			if (rowNum != nextLine && terminate == false) {
				returnToNormalColor();
				highlightLine(nextLine);
			
				var innerTable;
				innerTable = codeTable.rows[selRow].cells[0].children[0];
				innerTable.rows[0].cells[1].innerHTML = blank;
				
				innerTable = codeTable.rows[nextLine].cells[0].children[0];
				innerTable.rows[0].cells[1].innerHTML = arrow;
				selRow = nextLine;
				terminate = true;
				return true;
			}
			else {
				terminate = false;
				returnToNormalColor();
				highlightLine(codeTable.rows.length - 1);
			
				var innerTable;
				innerTable = codeTable.rows[selRow].cells[0].children[0];
				innerTable.rows[0].cells[1].innerHTML = blank;
				
				innerTable = codeTable.rows[codeTable.rows.length - 1].cells[0].children[0];
				innerTable.rows[0].cells[1].innerHTML = arrow;
				selRow = codeTable.rows.length - 1;
				nextLine = lineNums[0];
				return false;
			}
		}
		if (start == 0 && end == codeStrLen) return false;

		
		for (var i = 0; i < charCountStart.length; i++) {
			if (rowNum == lineNums[lineNums.length - 2] && nextLine == lineNums[lineNums.length - 1]) {
				rowNum = nextLine;
				nextLine = -1;
				break;
			}
			if (start >= charCountStart[i] && end <= charCountEnd[i]) { 
				rowNum = nextLine;
				if (nextLine != -1) nextLine = lineNums[i];
				break;
			}
		}
		
		if (rowNum == selRow) {
			if (haltFlag == true) { return true; }
			else return false;
		}
		
		if (rowNum == nextLine) {
			if (haltFlag == true) {
				returnToNormalColor();
				highlightLine(nextLine);
			
				var innerTable;
				innerTable = codeTable.rows[selRow].cells[0].children[0];
				innerTable.rows[0].cells[1].innerHTML = blank;
				
				innerTable = codeTable.rows[nextLine].cells[0].children[0];
				innerTable.rows[0].cells[1].innerHTML = arrow;
				
				selRow = nextLine;
				return true;
			}
			else return false;
		}
		

		if (rowNum == -1) { return false; }
	
		returnToNormalColor();
		highlightLine(rowNum);
		
		var innerTable;
		innerTable = codeTable.rows[selRow].cells[0].children[0];
		innerTable.rows[0].cells[1].innerHTML = blank;
		
		innerTable = codeTable.rows[rowNum].cells[0].children[0];
		innerTable.rows[0].cells[1].innerHTML = arrow;
		selRow = rowNum;
		
		if (nextLine == -1) return false;
		else return true;
	}
	
	this.reset = reset;
	function reset() {
		selectLine(codeTable.rows.length - 1);
		rowNum = lineNums[0];
		selRow = rowNum;
	}
	
	function selectLine2(start, end, varCount, haltFlag) {
		if (start == -1 && end == -1) {
			returnToNormalColor();
			highlightLine(codeTable.rows.length - 1);
		
			var innerTable;
			innerTable = codeTable.rows[selRow].cells[0].children[0];
			innerTable.rows[0].cells[1].innerHTML = blank;
			
			innerTable = codeTable.rows[codeTable.rows.length - 1].cells[0].children[0];
			innerTable.rows[0].cells[1].innerHTML = arrow;
			selRow = codeTable.rows.length - 1;
		}
		if (start == 0 && end == codeStrLen) return false;

		var rowNum = -1;
		var fallBack = -1;
		var flag = false;
		for (var i = 0; i < charCountStart.length; i++) {
			if (start == charCountStart[i] && end == charCountEnd[i]) { rowNum = lineNums[i]; nextLine = lineNums[i]; break; }
			if (start == charCountStart[i]) fallBack = lineNums[i];
		}
		
		if (start != -1) {
			if (rowNum == -1) rowNum = fallBack;
			if (rowNum == -1) { return false; }
		}
		else rowNum = codeTable.rows.length - 1;
		
		if (rowNum == selRow) {
			if (haltFlag == true) { return true; }
			else return false;
		}
		
		returnToNormalColor();
		highlightLine(rowNum);
		
		var innerTable;
		innerTable = codeTable.rows[selRow].cells[0].children[0];
		innerTable.rows[0].cells[1].innerHTML = blank;
		
		innerTable = codeTable.rows[rowNum].cells[0].children[0];
		innerTable.rows[0].cells[1].innerHTML = arrow;
		selRow = rowNum;
		
		return true;
	}
}