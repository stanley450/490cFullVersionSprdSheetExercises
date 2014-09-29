/*
	A unified JavaScript engine for JavaScript figures and exercises.
*/

function Engine(divID, chapterName, exerciseNum, editor){
	var interpreter = null;
	var thisObj = this;
	var programArray;
	var selectedRow = 1;
	var outputTable = document.getElementById("fig" + divID + "OutputTable");
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
	var varBox = document.getElementById("fig" + divID + "VarBox");
	var varTable = document.getElementById("fig" + divID + "VarTable");
	var showScope = false;
	var slidDown = false;
	var showVarBox = true;
	var outputBox = document.getElementById("fig" + divID + "OutputBox");
	var runButtonObj = document.getElementById("fig" + divID + "Run");
	var walkButtonObj = document.getElementById("fig" + divID + "Walk");
	var lastRowSelected = -1;

	this.walkButton = walkButton;
	this.runButton = runButton;
	this.updateVariables = updateVariables;
	
	var green = "#5CB85C";
	var greenHover = "#47A447";
	var orange = "#F0AD4E";
	var orangeHover = "#F09C28";
	var red = "#D9534F";
	var redHover = "#D2322D";
	
	function walkButton() {
		if (interpreter === null) initInterpreter();
		
		if (runMode == true) {
			clearInterval(intervalID);
			runMode = false;
			interpreter = null;
			reset();
			editor.selectAndHighlightRowByIndex(editor.getRowCount() - 1);
			finishedExec = false;
			slideVarBox("up");
			outputTable.innerHTML = "";
			varTable.innerHTML = "";
			selectedRow = 1;
			updateButtons();
		}
		else {
			slideVarBox("down");
			updateButtons();
			walk();
		}
		
		ga("send", "event", "javascript", "walk", "exercise" + exerciseNum);
	}
	
	function runButton() {
		if (interpreter === null) initInterpreter();

		if (runMode == true) {
			runMode = false;
			slideVarBox("down");
			clearInterval(intervalID);
			updateButtons();
		}
		else {
			runMode = true;
			updateButtons();
			slideVarBox("up");
			intervalID = setInterval(walk, 100);
		}
		
		ga("send", "event", "javascript", "run", "exercise" + exerciseNum);
	}
	
	function updateButtons() {
		if (runMode == true) {
			runButtonObj.textContent = "Pause";
			runButtonObj.style.backgroundColor = orange;
			walkButtonObj.textContent = "Stop";
			walkButtonObj.style.backgroundColor = red;
		}
		else {
			runButtonObj.textContent = "Run";
			runButtonObj.style.backgroundColor = green;
			walkButtonObj.textContent = "Walk";
			walkButtonObj.style.backgroundColor = orange;
		}
	}
	
	function walk() {
		if (runMode == true && finishedExec == true) {
			clearInterval(intervalID);
			editor.selectAndHighlightRowByIndex(editor.getRowCount() - 1);
			runMode = false;
			interpreter = null;
			finishedExec = false;
			slideVarBox("down");
			updateButtons();
			return;
		}
		else {
			if (finishedExec == true) {
				editor.selectAndHighlightRowByIndex(editor.getRowCount() - 1);
				finishedExec = false;
				interpreter = null;
				var outputTableRow = outputTable.insertRow(0);
				outputTableRow.insertCell(0);
				
				return;
			}
		}
		getRowToSelect();
	}
	
	function initInterpreter() {
		var rowCount = editor.getRowCount();
		var programStr = "";
		programArray = new Array();
		
		var length = 0;
		
		outputTable.innerHTML = "";
		var outputTableRow = outputTable.insertRow(0);
		var outputTableCell = outputTableRow.insertCell(0);
		
		for (var i = 0; i < rowCount; i++) {
		
			var rowArr = editor.rowToArray(i);

			var rowStr = "";
			
			for (var j = 0; j < rowArr.length; j++) {
				if (rowArr[0].match("//")) {
					break;
				}
				rowStr += rowArr[j];
			}
			
			if (rowStr.indexOf("document") >= 0) {
				var tempRow = "document1";
				tempRow += rowStr.substring(rowStr.indexOf(".") + 1, rowStr.length);
				rowStr = tempRow;
			}
			
			programStr += rowStr;
			
			if ((rowArr.length >= 1 && rowArr[0].indexOf("var") >= 0) || (rowArr.length >= 2 && rowArr[1].indexOf("var") >= 0))  {
				var start = rowStr.indexOf("/*");
				var end = rowStr.indexOf("*/");
				
				//var varName = rowStr.substring(rowStr.indexOf("var") + 4, rowStr.lastIndexOf(";"));
				var varName = rowArr[rowArr.indexOf("var") + 2];
				var dataType = rowStr.substring(start + 2, end);
				
				console.log("Var name: " + varName + " :: DataType: " + dataType);
				dataTypeArray[varName] = dataType;
				programArray.push([ length, length + rowStr.length ]);
			}
			else programArray.push([ length, length + rowStr.length ]);
			length = length + rowStr.length;
		}
		
		//console.log(programStr);
		//console.log("Program String Length: " + programStr.length);
		//console.log(programArray);
		//console.log(thisObj);
		
		interpreter = new Interpreter(programStr, init, thisObj);
	}
	
	function getRowToSelect() {
		var result = interpreter.step();
		var state = interpreter.stateStack[0].node;
		var done = false;
		var count = 0;
		var jump = 2;
		var lastInd;
		
		while (!done) {
			var i;
			for (i = 0; i < programArray.length; i++) {
				if (state.start >= programArray[i][0] && state.end <= programArray[i][1]) {
					break;
				}
			}
			
			if (promptInterrupt == false && promptCheck(selectedRow) == true) {
				//console.log("got here");
				promptInterrupt = true;
				editor.selectAndHighlightRowByIndex(selectedRow);
				//console.log("selectedRow " + selectedRow);
				currI = i;
				break;
			}
			
			if (i != selectedRow && i != editor.getRowCount()) {
				done = true;
				var rowArr = editor.rowToArray(selectedRow);
				//if (rowArr[0].match("//")) {
				//	editor.selectAndHighlightRowByIndex(selectedRow+1);
				//}
				editor.selectAndHighlightRowByIndex(selectedRow);
				//console.log("selected row is "+ selectedRow);
				selectedRow = i;
				//console.log("the value of i is " + i);
				return i;
			}
			else {
				var result = interpreter.step();
				pollVariables();
				
				outputBox.scrollTop = outputBox.scrollHeight;
				varBox.scrollTop = varBox.scrollHeight;
				
				if (!interpreter.stateStack[0]) { reset(); break; }
				else state = interpreter.stateStack[0].node;
			}
			lastInd = i;
			
		}
	}
	
	function reset() {
		finishedExec = true;
		dataTypeArray = [];
		scopeArr = [];
		varArr = [];
		editor.selectAndHighlightRowByIndex(selectedRow);
		//editor.clearHighlighting();
		selectedRow = 1;
	}
	
	function jumpTo(num, curr) {
		var result = interpreter.step();
		if (!result) return;
		var state = interpreter.stateStack[0].node;
		
		var count = 0;
		var globCount = 0;
		
		while (true) {
			var i;
			for (i = 0; i < programArray.length; i++) {
				if (state.start >= programArray[i][0] && state.end <= programArray[i][1]){console.log("here1"); break;}
			}
			console.log(num, curr, i, count);
			if (i != curr) {
				count++;
				//if (count == num - 1) editor.selectRowByIndex(i);
				if (count == num) { selectedRow = i; console.log("here2"); break; }
				curr = i;
			}
			
			interpreter.step();
			//if(typeof interpreter.stateStack[0] != 'undefined'){
				console.log(interpreter.stateStack[0]);
				state = interpreter.stateStack[0].node;
			//}
			
			if (globCount++ == 20) {
				console.log("Something went wrong.");
				break;
			}
		}
	}
	
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
	
	function promptCheck(index) {
		var rowArr = editor.rowToArray(index);
		var rowStr = "";
		var promptType;
		var prompt;
		var defaultValue;
		
		for (var i = 0; i < rowArr.length; i++) {
			rowStr += rowArr[i];
		}
		
		var promptInd = rowStr.indexOf("prompt");
		if (promptInd >= 0) {
			var beginInd = rowStr.indexOf("parseFloat");
			if (beginInd >= 0) {
				promptType = "numeric";
				prompt = rowStr.substring(beginInd + 18, rowStr.lastIndexOf(","));
				defaultValue = rowStr.substring(rowStr.lastIndexOf(",") + 2, rowStr.lastIndexOf(")") - 1);
			}
			else {
				promptType = "text";
				prompt = rowStr.substring(promptInd + 7, rowStr.lastIndexOf(","));
				defaultValue = rowStr.substring(rowStr.lastIndexOf(",") + 2, rowStr.lastIndexOf(")"));
			}
			
			if (prompt.charAt(0) == '"') {
				if (prompt.length == 2) prompt = "";
				else prompt = prompt.slice(1, prompt.length - 1);
			}
			
			if (defaultValue.charAt(0) == '"') {
				if (defaultValue.length == 2) defaultValue = "";
				else defaultValue = defaultValue.slice(1, defaultValue.length - 1);
			}
			
			console.log("Prompt: " + prompt);
			console.log("Default Value: " + defaultValue);
			
			defaultPrompt = defaultValue;
			
			promptFunc(promptType, prompt);
			
			return true;
		}
		
		return false;
	}
	
	function promptFunc(promptType, promptStr) {
		var cell = outputTable.rows[outputTable.rows.length - 1].cells[0];
		cell.setAttribute("style", "height:1em");
		cell.textContent += promptStr;
		var row = outputTable.insertRow(outputTable.rows.length);
		row.insertCell(0);
		cell.contentEditable = false;
		
		cell = outputTable.rows[outputTable.rows.length - 1].cells[0];
		cell.style.color = "red";
		cell.contentEditable = true;

		activePromptCellID = "fig" + divID + "TD" + (outputTable.rows.length - 1);
		cell.setAttribute("id", activePromptCellID);
		
		if (promptType == "numeric") setupNumericPrompt(promptStr);
		else setupStringPrompt(promptStr);
		
		row = outputTable.insertRow(outputTable.rows.length);
		row.insertCell(0);
		
		return promptInput;
	}
	
	function setupStringPrompt(prompt) {
		var stringPad = new StringPad();
		stringPad.open("String entry", prompt, stringPromptCallback, document.getElementById("fig" + divID + "Editor"));
		if (runMode == true) clearInterval(intervalID);
	}
	
	function stringPromptCallback(result) {
		var cell = document.getElementById(activePromptCellID);	
		
		if (result === null) {
			promptInput = defaultPrompt;
			cell.textContent = defaultPrompt;
		}
		else {
			promptInput = result;
			cell.textContent = result;
		}
			
		cell.contentEditable = false;
		
		jumpTo(2, currI);
		
		promptInterrupt = false;
		
		if (runMode == true) { runMode = false; runButton(); }
		else walkButton();
	}
	
	function setupNumericPrompt(prompt) {
		var numPad = new NumberPad();
		numPad.open(null, null, "Numeric Entry", prompt, true, 10, numericPromptCallback, document.getElementById("fig" + divID + "Editor"));
		if (runMode == true) clearInterval(intervalID);
	}
	
	function numericPromptCallback(result) {
		var cell = document.getElementById(activePromptCellID);	
		
		if (result === null) {
			promptInput = defaultPrompt;
			cell.textContent = defaultPrompt;
		}
		else {
			promptInput = parseFloat(result);
			cell.textContent = result;
		}
			
		cell.contentEditable = false;
		
		jumpTo(2, currI);
		
		promptInterrupt = false;
		
		if (runMode == true) { runMode = false; runButton(); }
		else walkButton();
	}
	
	function stopPrompt() {
		console.log("Stop Prompt.");
		var temp = promptInput;
		promptInput = "";
		return temp;
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
	
	function slideVarBox(dir) {
		if (showVarBox == false) return;
		
		if (!slidDown && dir == "down") {
			$("#fig" + divID + "OutVarBox").slideDown("medium", function() {
				varBox.scrollTop = varBox.scrollHeight;
				slidDown = true;
			});
		}
		else if (slidDown && dir == "up") {
			$("#fig" + divID + "OutVarBox").slideUp("medium");
			slidDown = false;
		}
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
				
				var dataType;
				if (dataTypeArray[leftValue]) dataType = dataTypeArray[leftValue].toLowerCase();
				
				if(!dataType) dataType = (isString(rightValue)) ? "text" : "numeric";
				
				if (leftValue.data && rightValue.data) {
					varArr.push([scope, leftValue.data, dataType, rightValue.data]);
				}
				else if (leftValue.data) {
					varArr.push([scope, leftValue.data, dataType, rightValue]);
				}
				else if (rightValue.data) {
					varArr.push([scope, leftValue, dataType, rightValue.data]);
				}
				else {
					varArr.push([scope, leftValue, dataType, rightValue]);
				}
				
				if (!scopeExists(scope)) scopeArr.push(scope);
			}
		}
		else {
			for (var i = 0; i < varArr.length; i++) {
				if (scope == varArr[i][0] && (varArr[i][1] == leftValue || varArr[i][1].data == leftValue)) {
					scope = varArr[i][0];
					varArr.splice(i, 1);
				}
			}
		}
		
		updateTable();
	}
	
	function pollVariables() {
		var scopeNum;
		try {
			scopeNum = getScopeNum(interpreter.getScope());
		}
		catch (err) {
			return;
		}
		
		var count = 0;
		if (scopeNum < 0)
			return;
		
		for (var i = 0; i < varArr.length; i++) {
			if (getScopeNum(varArr[i][0]) > scopeNum) {
				console.log("scoping");
				updateVariables("del", varArr[i][0], varArr[i][1]); haltFlag = true;
			}
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
					else {
						if (!varArr[i][3]) cell.textContent = "undefined";
						else cell.textContent = varArr[i][3];
					}
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