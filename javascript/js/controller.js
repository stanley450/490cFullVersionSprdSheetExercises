function Controller(divID, chapterName, exerciseNum) {
	var interpreter = null;
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
   
	//subract 6 for the width of the border of .textArea, if the border ever changes, this will have to change too
	$('#fig' + divID + 'Editor').height($('#buttons').height() - 6);
	
   	//var editorTable = document.getElementById("fig" + sandboxNum + "Editor");
	var editor = new JSEditor("fig" + divID + "Editor", chapterName, exerciseNum);
	var engine = new Engine(divID, editor);
	
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
	
	addVarButton.onclick = function () { editor.addVariable("variable"); };
	addArrButton.onclick = function () { editor.addVariable("array"); };
	addFuncButton.onclick = function () { editor.addFunction(); };
	assignButton.onclick = function () { editor.addOneLineElement("assignment"); };
	writeButton.onclick = function () { editor.addOneLineElement("write"); };
	writelnButton.onclick = function () { editor.addOneLineElement("writeln"); };
	stringPromptButton.onclick = function () { editor.addOneLineElement("stringPrompt"); };
	numericPromptButton.onclick = function () { editor.addOneLineElement("numericPrompt"); };
	whileButton.onclick = function() { editor.addWhile(); };
	forButton.onclick = function() { editor.addFor(); };
	ifThenButton.onclick = function() { editor.addIfThen(); };
	ifElseButton.onclick = function() { editor.addIfElse(); };
	funcCallButton.onclick = function () { editor.addOneLineElement("functionCall"); };
	returnButton.onclick = function () { editor.addOneLineElement("return"); };
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

	this.retrieveUpdates = retrieveUpdates;
	function retrieveUpdates(){
		editor.loadEditor("figJSSandboxEditor", "fig" + divID + "Editor", true);
	}
	
	this.saveEditor = saveEditor;
	function saveEditor(){
		if(editor.checkEditorData(true))
			editor.saveEditor(true);
	}
	
	//a simple wrapper for JSeditor's saveEditor
	this.saveExercise = saveExercise;
	function saveExercise(){
		editor.saveEditor();
	}
	
	this.clearExercise = clearExercise;
	function clearExercise(){
		editor.clearEditor();
		editor = new JSEditor("fig" + divID + "Editor", chapterName, exerciseNum);
	}
}
