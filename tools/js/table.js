/*
 * This handles the functionality of the table and all touch/click/keypresses not handled
 * by the handsontable library.
 * */
 
 function Table(figNum) {

 	/*******************Public Methods***********************/
 	this.setMEditorManager = setMEditorManager;
 	this.getMEditorManager = getMEditorManager;

	 //Note by Mitchell Martin- I'm including the functionality of the input
	 //box in here too. Input/function boxes are an integral part of spreadsheet
	 //programs, and they are heavily intertwined.
	 var ib = $("#functionBox" + figNum);
	 this.ib = ib;
	 //handles google analytics mneumonics
	 this.gaid = "";
	 this.WDS = new DataStore();
	 //for performance purposes, tracks when user has made input so that
	 //certain update functions can be skipped.
	 var recentChanges = false; 
	 //Creates a 4-dimensional table which stores data for which other cells use a certain cell.
	 //The way this is used is that the first two dimensions locate the cell which is depended on.
	 //The second two dimensions are for the dependant cells.
	 this.usedBy = [];
	//Creates a 4-dimensional table which stores data for which cells are used by the specified cell.
	//The first two dimensions locate the dependant cell. The last two represent cells which are
	//dependencies.
	this.dependantOn = [];
	//Note: for all dependencies, undefined is equivalent to false.
	//stores data for format
	this.formatArray = [];
	//This keeps track of which cells are fully updated after changing the value of a cell on which
	//others are dependant
	this.updateTable = [];
  //When a cell is a numeric value or an expression, store the value here.
	this.pushTable = [];
	//keeps track of whether cells are updating and which cell initiated the update cycle
	var updateState = [false, 0, 0];
	this.updateState = updateState;
	//handles touch events for scrolling at the top and left of the table.
	var timevert;
	var timehor;
	var scrollInterval = 120;
	
	var T, ht, AE, CF, FP;
	T = this;
	//enumerator for the six types of string formatting
	formatOption = {
	  ZERO:0,
	  ONE:1,
	  TWO:2,
	  THREE:3,
	  DOLLARS:4,
	  FNONE:5
	};
	this.formatOption = formatOption;
	formatOption = this.formatOption;
	//enumerator for the undo/redo tracking array.
	URTypes = 
	{
	  NORMAL:0,
	  FUNCTION:1,
	  UNDO:2,
	  REDO:3,
	  PUSHUPDATES:4
	};
	this.URTypes = URTypes;
	this.URArray = [];
	this.URIndex = 0;
	this.URFlag = URTypes.NORMAL;
	 
	 ib.bind('input', function(event)
	 {
	  recentChanges = true;
		var selected = ht.getSelected();
		editor = meditorManager;
		editor.openEditorWithoutFocus();
		editor.getActiveEditor().setValue(ib.val());
		editor.getActiveEditor().refreshDimensions();
		//obsolete after using the editor
		//ht.setDataAtCell(selected[0],selected[1], ib.val());
	 });
	 
	 ib.keypress(function(event)
	 {
		if(event.which==13)
		{
			var selected = ht.getSelected();
			var temp = ib.val();
			pressEnter(event);
			//obsolete after updating cells on selection change
			//ht.setDataAtCell(selected[0],selected[1], temp);
		}
	 });

	//global variables
	var currSelect = [0,0,0,0];
	//var funcTracker = new Array();
	//this.funcTracker = funcTracker;
	this.funcTracker = new Array();
	var meditorManager;
	var currentEditor;
	var horDragDealer = 0;
	var vertDragDealer = 0;
	
	var minRow, maxRow, minCol, maxCol, tableHeight;
	var DEFAULTHEIGHT = 500;
	switch(figNum)
	{
    case 3:
      T.gaid = "simplespreadsheet";
      minRow = 8;
      maxRow = 8;
      minCol = 3;
      maxCol = 3;
    case 4:
      T.gaid = "ctofspreadsheet";
      minRow = 8;
      maxRow = 8;
      minCol = 4;
      maxCol = 4;
      tableHeight = 300;
      break;
    case 81:
    case 82:
      T.gaid = "gradespreadsheet";
      minRow = 7;
      maxRow = 7;
      minCol = 6;
      maxCol = 6;
      tableHeight = 350;
      break;
    case 91:
      T.gaid = "cellpremove";
      minRow = 3;
      maxRow = 3;
      minCol = 3;
      maxCol = 3;
      break;
    case 92:
      T.gaid = "valpremove";
      minRow = 3;
      maxRow = 3;
      minCol = 3;
      maxCol = 3;
      break;
    case 93:
      T.gaid = "cellpremove";
      minRow = 3;
      maxRow = 3;
      minCol = 3;
      maxCol = 3;
      break;
    case 94:
      T.gaid = "valpostmove";
      minRow = 3;
      maxRow = 3;
      minCol = 3;
      maxCol = 3;
      break;
    case 131:
      T.gaid = "actualcontents";
      minRow = 7;
      maxRow = 7;
      minCol = 4;
      maxCol = 4;
      break;
    case 132:
      T.gaid = "displayvalues";
      minRow = 7;
      maxRow = 7;
      minCol = 4;
      maxCol = 4;
      break;
    case 141:
      T.gaid = "avgactualcontents";
      minRow = 12;
      maxRow = 12;
      minCol = 5;
      maxCol = 5;
      break;
    case 142:
      T.gaid = "avgdisplaycontents";
      minRow = 12;
      maxRow = 12;
      minCol = 5;
      maxCol = 5;
      break;
    case 211:
      T.gaid = "avgdisplaycontents";
      minRow = 3;
      maxRow = 3;
      minCol = 3;
      maxCol = 3;
      tableHeight = 200;
      break;
	case 212:
      T.gaid = "avgdisplaycontents";
      minRow = 30;
      maxRow = 30;
      minCol = 30;
      maxCol = 30;
      tableHeight = DEFAULTHEIGHT;
      break;
	case 213:
      T.gaid = "avgdisplaycontents";
      minRow = 30;
      maxRow = 30;
      minCol = 30;
      maxCol = 30;
      tableHeight = DEFAULTHEIGHT;
      break;
	case 214:
      T.gaid = "avgdisplaycontents";
      minRow = 30;
      maxRow = 30;
      minCol = 30;
      maxCol = 30;
      tableHeight = DEFAULTHEIGHT;
      break;
	case 215:
      T.gaid = "avgdisplaycontents";
      minRow = 30;
      maxRow = 30;
      minCol = 30;
      maxCol = 30;
      tableHeight = DEFAULTHEIGHT;
      break;
	case 216:
      T.gaid = "avgdisplaycontents";
      minRow = 30;
      maxRow = 30;
      minCol = 30;
      maxCol = 30;
      tableHeight = DEFAULTHEIGHT;
      break;
    default:
      //sandbox mode
      minRow = 30;
      minCol = 20;
      maxRow = 30;
      maxCol = 20;
      tableHeight = DEFAULTHEIGHT;
      break;
	}

	$("#WatsonTable" + figNum).handsontable({
	  minSpareRows: minRow,
	  minSpareCols: minCol,
	  maxRows: maxRow,
	  maxCols: maxCol,
	  height: tableHeight,
	  rowHeaders: true,
	  colHeaders: true,
	  outsideClickDeselects: false,
	}, T);
	
	//Procedure for evaluating a cell's content.
	//Given a value objects which includes the row,
	//column, and function string of the cell, it changes the
	//value object's .value attribute to the display value of the cell.
	//also tracks related cells by updating tracking tables.
		cellRoutine = function(value)
		{
	      var selected = {};
	      selected[0] =value.row;
	      selected[1] = value.prop;
	      selected[2] = value.value;
	      //when a cell is going through cellRoutine, it is being updated.
	      //this puts all the cells that depend on it into question.
	      //This cell in particular is in limbo until the value is acquired.
	        T.updateTable[selected[0]*ht.countRows()+selected[1]] = null;
	        if(T.usedBy[selected[0]]!==undefined && T.usedBy[selected[0]][selected[1]]!==undefined)
	        {
	        for(var i = 0; i<=T.usedBy[selected[0]][selected[1]].length; i++)
	         {
	          if(T.usedBy[selected[0]][selected[1]][i]!==undefined)
	          {
	              for(var k = 0; k<=T.usedBy[selected[0]][selected[1]][i].length; k++)
	              {
	                if(T.usedBy[selected[0]][selected[1]][i][k])
	                    CF.setUpdateTable(i,k);
	              }
	          }
	         }
	        }
	      if(T.URFlag == T.URTypes.NORMAL)
	      {
          fillFuncTracker(selected);
          var func = T.funcTracker[selected[0]*ht.countRows()+selected[1]];
          if(func!=undefined)
            func.funcString = value.value;
	      }
	      //Using the cell editor does not set a cell's value until
	      //the selected cell changes. While using the text box, I use the setData
	      //method to change the display value of a cell. So this test prevents any
	      //sort of function string handling while cells are being edited.
				if(!(ib.is(":focus")))
				{
	        //Since the function string has changed, begin by discarding all cells this cell
	        //previously depended on.
	        CF.clearAssociations(selected[0],selected[1]);
					var details = FP.functionParse(value.value);
					if(details.function==FP.functionCall.SUM) //deprecated
					{
	          var cell = {};
	          cell.row = value.row;
	          cell.col = value.prop;
						value.value = functionSUM(details);
						var error = updateDependencyByDetails(details, cell);
						if(error)
	            value.value = "#ERROR";
					}
					else if(details.function==FP.functionCall.AVG) //deprecated
					{
	          var cell = {};
	          cell.row = value.row;
	          cell.col = value.prop;
						value.value = functionAVG(details);
						var error = updateDependencyByDetails(details, cell);
						if(error)
	            value.value = "#ERROR";
					}
					else if(details.function==FP.functionCall.EXPRESSION)
					{
	          var cell = {};
	          cell.row = value.row;
	          cell.col = value.prop;
	          value.value = CF.evaluateTableExpression(details.row, cell);
					}
	        else if(details.function==FP.functionCall.ERROR)
	        {
	          value.value = "#ERROR";
	        }
          //insert the proper value into the update table.
          //it is okay to ignore a single dollar sign in front because undo and redo
          //may put values directly into the table in this format.
          value2 = value.value;
          if(typeof value2 == 'string' && value2.charAt(0)=='$')
            value2 = value2.slice(1);
          if(+value2 !== NaN)
            T.updateTable[ht.countRows()*value.row+value.prop] = +value2;
          else
            T.updateTable[ht.countRows()*value.row+value.prop] = undefined;
          //After a cell is changed, it needs to notify any cell that depends on it.
          if(T.URFlag == T.URTypes.NORMAL)
            CF.notifyDependants(value.row, value.prop);
	        //check for format specified
	        if(T.formatArray[selected[0]]!=undefined &&
	        T.formatArray[selected[0]][selected[1]]!=undefined &&
	        T.formatArray[selected[0]][selected[1]].type[T.formatArray[selected[0]][selected[1]].index]!=formatOption.FNONE &&
	        !isNaN(parseFloat(value.value)))
	        {
	          var index = value.value.indexOf('.');
	          if(index>=0)
	          {
	            value.value =value.value+"000";
	          }
	          else
	          {
	            index = value.value.length;
	            value.value =value.value+".000";
	          }
	          var format = T.formatArray[selected[0]][selected[1]];
	          switch(format.type[format.index])
	          {
	            case formatOption.ZERO:
	              value.value = value.value.substr(0,index);
	              break;
	            case formatOption.ONE:
	              value.value = value.value.substr(0,index+2);
	              break;
	            case formatOption.TWO:
	              value.value = value.value.substr(0,index+3);
	              break;
	            case formatOption.THREE:
	              value.value = value.value.substr(0,index+4);
	              break;
	            case formatOption.DOLLARS:
	              value.value = "$"+value.value.substr(0, index+3);
	              break;
	          }
	        }
				}
		}
		this.cellRoutine = cellRoutine;
		
		//pushes the updates stored in pushTable to the cells.
		function pushUpdates()
		{
      T.URFlag = T.URTypes.PUSHUPDATES;
      var fillerArray = [];
      var largest = 0;
      for(var i = 0; i<=T.pushTable.length; i++)
      {
        fillerArray[i] = [];
        if(T.pushTable[i]===undefined)
          ; //just need an empty array if undefined
        else
        {
          if(T.pushTable[i].length>largest)
            largest = T.pushTable[i].length;
          for(var k = 0; k<=T.pushTable[i].length; k++)
          {
            if(T.pushTable[i][k]===undefined)
              ; //do nothing
            else
              fillerArray[i][k] = T.pushTable[i][k];
          }
        }
      }
      T.pushTable = [];
      ht.populateFromArray(0,0, fillerArray, i, largest);
		}
	//On page load..
	$(document).ready(function() {
	  //Default selected cell to 0,0
	  ht.selectCell(0,0);
		//set offset for buttons
		var offset = $("#" + AE.buttonDiv.id).offset();
		$("#" + AE.buttonDiv.id).offset({top: offset.top+55, left : offset.left});
		
		//button listeners
		$("#" + AE.undoButton.id).click(function() { CF.undo(); });
		$("#" + AE.redoButton.id).click(function() { CF.redo(); });
		$("#" + AE.sumButton.id).click(function() { CF.sum(); });
		$("#" + AE.cutButton.id).click(function() { CF.cut(); });
		$("#" + AE.copyButton.id).click(function() { CF.copy(); });
		$("#" + AE.pasteButton.id).click(function() { CF.paste(); });
		$("#" + AE.clearButton.id).click(function() { CF.clear(); });
		$("#" + AE.averageButton.id).click(function() { CF.average(); });
		$("#" + AE.formatButton.id).click(function() { CF.format(); });
		
		//Listen for any changes to cells.
		$("#" + AE.tableDiv.id).handsontable({
			afterChange: function(changes, source) {
//        ga("send", "event", "tools", "edit", "figure-"+T.gaid); 
	      if(T.URFlag == T.URTypes.NORMAL)
	      {
	        T.URArray[T.URIndex] = {};
	        T.URArray[T.URIndex].type = T.URTypes.NORMAL;
	        T.URIndex++;
	        T.URArray = T.URArray.slice(0,T.URIndex);
	      }
	      if(T.URFlag == T.URTypes.PUSHUPDATES)
	      {
          T.URArray[T.URIndex] = {};
	        T.URArray[T.URIndex].type = T.URTypes.PUSHUPDATES;
	        T.URIndex++;
	        T.URArray = T.URArray.slice(0,T.URIndex);
	      }
	      if(T.URFlag!=T.URTypes.UNDO && T.URFlag!=T.URTypes.REDO)
          T.URFlag = T.URTypes.NORMAL;
				var selected = ht.getSelected();
				var isFunction = false
				var func = T.funcTracker[selected[0]*ht.countRows()+selected[1]];
				if(func!= undefined)
	        isFunction = true;
				/*for(var i = 0; i < funcTracker.length; i++) {
					if(funcTracker[i] !== undefined && funcTracker[i].row == selected[0] && funcTracker[i].col == selected[1]) {
	          CF.changeInput(funcTracker[i].funcString);
						isFunction = true;
						break;
					}*/
				/*if(updateState[0] && updateState[1] == changes[0][0] && updateState[2] == changes[0][1])
				{
	        updateState[0] = false;
				}
				else
	        updateTable[changes[0][0]*ht.countRows()+changes[0][1]] = true;*/
				if(isFunction)
	        CF.changeInput(func.funcString);
				if(!isFunction)
				 CF.changeInput(ht.getDataAtCell(selected[0], selected[1]));
				if(T.pushTable.length > 0)
          pushUpdates();
			}
		});
		
		//Listens for enter key. When detected, prevent the default action (edit cell) and move to a new one
		//while passing data from function tracking or input.
		//Mitchell's note- also looking for backspace and delete
		$("#" + AE.tableDiv.id).handsontable({
			beforeKeyDown: function(event) {
	      recentChanges = true;
	      editor = meditorManager.getActiveEditor();
	      //enter key
				if(event.which == 13) {
					pressEnter(event)
				}
				//backspace key
				if(event.which == 8)
				{
					ib.val(editor.TEXTAREA.value+String.fromCharCode(event.which));
					var caretPosition=editor.wtDom.getCaretPosition(editor.TEXTAREA);
					//This creates substrings of the textbox's text, up to but not including the
	        //caret (which is deleted) and everything after the caret.
					ib.val(ib.val().substr(0,caretPosition-1)+ib.val().substr(caretPosition));
				}
				//delete key
				if(event.which == 46)
				{
	        ib.val(editor.TEXTAREA.value+String.fromCharCode(event.which));
					var caretPosition=editor.wtDom.getCaretPosition(editor.TEXTAREA);
					//This creates substrings of the textbox's text, up to but not including the
	        //caret (which is deleted) and everything after the caret.
					ib.val(ib.val().substr(0,caretPosition)+ib.val().substr(caretPosition+1));
				}
			}
		});

		//handles ASCII keypresses. Specifically, I'm aiming to mirror the cell editor in
		//the input box.
		$("#" + AE.tableDiv.id).keypress(function(event)
		{
			//IMPORTANT NOTE BY MITCHELL-
			//The handsontable has no implemented method to access properties of editors.
			//To make this work, I created a reference to a previously private variable by editing the handsontable.js
			//file itself. I made a note of where the edit occured- ctrl+f MITCHELLSNOTE
			var editor = meditorManager.getActiveEditor();
			ib.val(editor.TEXTAREA.value);
			var caretPosition=editor.wtDom.getCaretPosition(editor.TEXTAREA);
			//copies everything up to and including the caret, adds the character to input box,
			//then continues along.
			ib.val(ib.val().substr(0,caretPosition)+String.fromCharCode(event.which)+ib.val().substr(caretPosition));
		});
		
			$("#" + AE.tableDiv.id).handsontable({
			onValidate: function()
			{
	    var selected = ht.getSelected();
	    ib.val(ht.getDataAtCell(selected[0], selected[1]));
	    }
	    });
		
		//Listens for selection changing
		$("#" + AE.tableDiv.id).handsontable({
			afterSelection: function(r, c, r2, c2) 
			{
	      if(ib.recentlyChanged)
	      {
	        func = T.funcTracker[currSelect[0]*ht.countRows()+currSelect[1]];
	        if(func!=undefined)
	          ht.setDataAtCell(currSelect[0], currSelect[1], func.funcString);
	        ib.recentlyChanged = false;
	      }
				var selected = ht.getSelected();
	      var isFunction = false;
				var func = T.funcTracker[selected[0]*ht.countRows()+selected[1]];
				if(func!= undefined)
	        isFunction = true;
				/*for(var i = 0; i < funcTracker.length; i++) {
					if(funcTracker[i] !== undefined && funcTracker[i].row == selected[0] && funcTracker[i].col == selected[1]) {
						CF.changeInput(funcTracker[i].funcString);
						isFunction = true;
						break;
					}
				}*/
	        if(isFunction)
	          CF.changeInput(func.funcString);
	        else
	          CF.changeInput(ht.getDataAtCell(selected[0], selected[1]));
	    }
		});

		//Instructions before setting value into a cell.
		$("#" + AE.tableDiv.id).handsontable(
		{
			beforeSet: function e(value)
			{
        if(T.URFlag!=T.URTypes.PUSHUPDATES)
        {
          T.cellRoutine(value);
        }
        //if the display value is a number, put it into the value table.
		 }
		});
		
		//Listens for double click MITCHELL'S NOTE
		//Editor works just as well as typing into the cell itself.
		//Giving all clicks with cells as the target makes mobile easier to handle.
		//$('#' + tableDiv.id).on('click', function(evt) {
	    //$('td').click(function(evt) {
	    $("#WatsonTable" + figNum +" td").click(function(evt){
			var selected = ht.getSelected();
			if(currSelect!==undefined && selected[0]==selected[2] && selected[1]==selected[3] &&
			selected[0]==currSelect[0] && selected[1]==currSelect[1])
	      meditorManager.openEditor();
			var func = T.funcTracker[selected[0]*ht.countRows()+selected[1]];
			if(func!=undefined)
			{
	      meditorManager.getActiveEditor().setValue(func.funcString);
	    }
			//Deprecated? Need to check during refactoring.
			currSelect = selected;
			/* obsolete with the introduction of function strings.
			if(selected != undefined) {
				var data = ht.getDataAtCell(selected[0], selected[1]);
				if(data != null) CF.changeInput(data);
			}*/
		});
		//Some mobile devices do not register mouseup events. Suffice to say, when
	  //there is a mousedown event, there must have been a preceding mouseup. This
	  //makes sure things are in their correct state.
	  $("#" + AE.tableDiv.id).on("mousedown", function(e)
	  {
	    horDragDealer.dragging = false;
	    vertDragDealer.dragging = false;
	  });
	  
	  var fillerArray = [];
	  var data = T.WDS.loadExerciseData(2, figNum);
	  var reload = false;
	  if(data != null)
	  {
      reload = true;
      data = JSON.parse(data);
	  }
	  switch(figNum)
	  {
      case 3:
        CF.fillFormatArray(0,0,7,4, formatOption.ZERO);
        fillerArray[0] = []; fillerArray[4] = [];
        fillerArray[1] = [];
        fillerArray[1][1] = "Grades";
        fillerArray[1][2] = "50";
        fillerArray[2] = []; fillerArray[2][2] = "100";
        fillerArray[3] = []; fillerArray[3][2] = "75";
        fillerArray[5] = []; fillerArray[5][1] = "Average";
        ht.populateFromArray(0,0, fillerArray,5,2);
        ht.setDataAtCell(5,2,"=AVG(C2:C4)");
        break;
      case 4:
        fillerArray[0] = [];
        fillerArray[1] = []; fillerArray[1][1] = "0"; fillerArray[1][2] = "Celsius";
        fillerArray[2] = []; fillerArray[2][2] = "Fahrenheit";
        ht.populateFromArray(0,0, fillerArray, 3,3);
        ht.setDataAtCell(2,1,"=(9/5)*B2+32");
        break;
      case 81:
        fillerArray[0] = [];
        fillerArray[1] = []; fillerArray[1][1] = "Exam 1"; fillerArray[1][2] = "50"; fillerArray[1][4] = "Homework"; fillerArray[1][5] = "65";
        fillerArray[2] = []; fillerArray[2][2] = "Exam 2"; fillerArray[2][2] = "100"; fillerArray[2][5] = "70";
        fillerArray[3] = []; fillerArray[3][1] = "Hwk Avg."; fillerArray[3][2] = " =(F2+F3+F4+F5)/4"; fillerArray[3][5] = "80";
        fillerArray[4] = []; fillerArray[4][5] = "85";
        fillerArray[5] = []; fillerArray[5][1] = "Final grade"; fillerArray[5][2] = " =(C2+C3+C4)/3";
        ht.populateFromArray(0,0, fillerArray, 5, 5);
        break;
      case 82:
        fillerArray[0] = [];
        fillerArray[1] = []; fillerArray[1][1] = "Exam 1"; fillerArray[1][2] = "50"; fillerArray[1][4] = "Homework"; fillerArray[1][5] = "65";
        fillerArray[2] = []; fillerArray[2][2] = "Exam 2"; fillerArray[2][2] = "100"; fillerArray[2][5] = "70";
        fillerArray[3] = []; fillerArray[3][1] = "Hwk Avg."; fillerArray[3][5] = "80";
        fillerArray[4] = []; fillerArray[4][5] = "85";
        ht.populateFromArray(0,0, fillerArray, 4, 5);
        ht.setDataAtCell(3,2,"=(F2+F3+F4+F5)/4");
        ht.setDataAtCell(5,2, "=(C2+C3+C4)/3");
        ht.setDataAtCell(5,1,"Final grade");
        break;
      case 91:
        fillerArray[0] = [];
        fillerArray[1] = []; fillerArray[1][1] = "0"; fillerArray[1][2] = "Celsius";
        fillerArray[2] = []; fillerArray[2][1] = " =(9/5)*B2+32"; fillerArray[2][2] = "Fahrenheit";
        ht.populateFromArray(0,0, fillerArray, 2, 2);
        break;
      case 92:
        fillerArray[0] = [];
        fillerArray[1] = []; fillerArray[1][1] = "0"; fillerArray[1][2] = "Celsius";
        fillerArray[2] = []; fillerArray[2][1] = "=(9/5)*B2+32"; fillerArray[2][2] = "Fahrenheit";
        ht.populateFromArray(0,0, fillerArray, 2, 2);
        break;
      case 93:
        fillerArray[0] = [];
        fillerArray[1] = []; fillerArray[0][0] = "0"; fillerArray[0][1] = "Celsius";
        fillerArray[2] = []; fillerArray[1][0] = " =(9/5)*A1+32"; fillerArray[1][1] = "Fahrenheit";
        ht.populateFromArray(0,0, fillerArray, 1, 1);
        break;
      case 94:
        fillerArray[0] = [];
        fillerArray[1] = []; fillerArray[0][0] = "0"; fillerArray[0][1] = "Celsius";
        fillerArray[2] = []; fillerArray[1][0] = "=(9/5)*A1+32"; fillerArray[1][1] = "Fahrenheit";
        ht.populateFromArray(0,0, fillerArray, 1, 1);
        break;
      case 131:
        
        CF.fillFormatArray(0,0,6,3, formatOption.TWO);
        fillerArray[0] = []; fillerArray[0][0] = "Name"; fillerArray[0][1] = "2215";
        fillerArray[1] = []; fillerArray[1][0] = "April, R."; fillerArray[1][1] = "50000.00";
        fillerArray[2] = []; fillerArray[2][0] = "Pike, C."; fillerArray[2][1] = "55432.10";
        fillerArray[3] = []; fillerArray[3][0] = "Kirk, J. T."; fillerArray[3][1] = "69666.42";
        fillerArray[4] = []; fillerArray[4][0] = "Picard, J."; fillerArray[4][1] = "72123.45";
        fillerArray[5] = []; fillerArray[5][0] = "Janeway, K."; fillerArray[5][1] = "888888.00";
        ht.populateFromArray(0,0, fillerArray, 5, 2);
        ht.setDataAtCell(0,2, " =B1*1.1");
        ht.setDataAtCell(1,2, " =B2*1.1");
        ht.setDataAtCell(2,2, " =B3*1.1");
        ht.setDataAtCell(3,2, " =B4*1.1");
        ht.setDataAtCell(4,2, " =B5*1.1");
        ht.setDataAtCell(5,2, " =B6*1.1");
        break;
      case 132:
        CF.fillFormatArray(0,0,6,3, formatOption.TWO);
        fillerArray[0] = []; fillerArray[0][0] = "Name"; fillerArray[0][1] = "2215";
        fillerArray[1] = []; fillerArray[1][0] = "April, R."; fillerArray[1][1] = "50000.00";
        fillerArray[2] = []; fillerArray[2][0] = "Pike, C."; fillerArray[2][1] = "55432.10";
        fillerArray[3] = []; fillerArray[3][0] = "Kirk, J. T."; fillerArray[3][1] = "69666.42";
        fillerArray[4] = []; fillerArray[4][0] = "Picard, J."; fillerArray[4][1] = "72123.45";
        fillerArray[5] = []; fillerArray[5][0] = "Janeway, K."; fillerArray[5][1] = "888888.00";
        ht.populateFromArray(0,0, fillerArray, 5, 2);
        ht.setDataAtCell(0,2, "=B1+1");
        ht.setDataAtCell(1,2, "=B2*1.1");
        ht.setDataAtCell(2,2, "=B3*1.1");
        ht.setDataAtCell(3,2, "=B4*1.1");
        ht.setDataAtCell(4,2, "=B5*1.1");
        ht.setDataAtCell(5,2, "=B6*1.1");
        break;
      case 141:
      CF.fillFormatArray(0,0,6,3, formatOption.TWO);
      fillerArray[0] = []; fillerArray[2] = []; fillerArray[7] = []; fillerArray[10] = [];
      fillerArray[1] = []; fillerArray[1][1] = "Homework"; fillerArray[1][3] = "Exams";
      fillerArray[3] = []; fillerArray[3][1] = "20"; fillerArray[3][3] = "100";
      fillerArray[4] = []; fillerArray[4][1] = "20"; fillerArray[4][3] = "100";
      fillerArray[5] = []; fillerArray[5][1] = "20"; fillerArray[5][3] = "100";
      fillerArray[6] = []; fillerArray[6][1] = "20";
      fillerArray[8] = []; fillerArray[8][0] = "Averages"; fillerArray[8][1] = " =AVG(B4:B7)"; fillerArray[8][3] = "/20"; fillerArray[8][4] = " =(.2*D4+.2*D5+.3*D6)/.7";
      fillerArray[9] = []; fillerArray[9][0] = "Points earned"; fillerArray[9][1] = " =B9/20*30"; fillerArray[9][3] = " =D9/100*70";
      fillerArray[11] = []; fillerArray[11][0] = "Final Score"; fillerArray[11][1] = " =B10+D10";
      ht.populateFromArray(0,0, fillerArray, 11, 4);
      ht.setDataAtCell(6,3, "");
        break;
      case 142:
      CF.fillFormatArray(7,0,11,3, formatOption.ZERO);
      fillerArray[0] = []; fillerArray[2] = []; fillerArray[7] = []; fillerArray[10] = [];
      fillerArray[1] = []; fillerArray[1][1] = "Homework"; fillerArray[1][3] = "Exams";
      fillerArray[3] = []; fillerArray[3][1] = "20"; fillerArray[3][3] = "100";
      fillerArray[4] = []; fillerArray[4][1] = "20"; fillerArray[4][3] = "100";
      fillerArray[5] = []; fillerArray[5][1] = "20"; fillerArray[5][3] = "100";
      fillerArray[6] = []; fillerArray[6][1] = "20";
      fillerArray[8] = []; fillerArray[8][0] = "Averages"; fillerArray[8][1] = "=AVG(B4:B7)"; fillerArray[8][2] = "/20"; fillerArray[8][3] = "=(.2*D4+.2*D5+.3*D6)/.7"; fillerArray[8][4] = "/100";
      fillerArray[9] = []; fillerArray[9][0] = "Points earned"; fillerArray[9][1] = "=B9/20*30"; fillerArray[9][3] = "=D9/100*70";
      fillerArray[11] = []; fillerArray[11][0] = "Final Score"; fillerArray[11][1] = "=B10+D10";
      ht.populateFromArray(0,0, fillerArray, 11, 4);
      ht.populateFromArray(0,0, fillerArray, 11, 4);
      ht.populateFromArray(0,0, fillerArray, 11, 4);
      ht.populateFromArray(0,0, fillerArray, 11, 4);
      ht.setDataAtCell(6,3, "");
        break;
      case 211:
    	  fillerArray[0] = [];
          fillerArray[1] = []; fillerArray[0][0] = "10";
          fillerArray[2] = []; fillerArray[1][0] = "5";
          ht.populateFromArray(0,0, fillerArray, 1, 1);
          break;
	case 212:
    	  fillerArray[0] = [];
          fillerArray[1] = []; fillerArray[0][0] = "Year";
          fillerArray[2] = []; fillerArray[0][1] = "Memory(Meg)";
		  fillerArray[3] = []; fillerArray[0][2] = "Speed(Ghz)";
          ht.populateFromArray(0,0, fillerArray, 1, 3);
          break;
	case 213:
    	  fillerArray[0] = [];
          fillerArray[1] = []; fillerArray[1][0] = "MPH";
          fillerArray[2] = []; fillerArray[1][1] = "KPH";
          ht.populateFromArray(0,0, fillerArray, 1, 2);
          break;
	case 214:
    	  fillerArray[0] = [];
          fillerArray[1] = []; fillerArray[1][0] = "Celsius";
          fillerArray[2] = []; fillerArray[1][1] = "Fahrenheit";
          ht.populateFromArray(0,0, fillerArray, 1, 2);
          break;
	case 215:
    	  fillerArray[0] = [];
          fillerArray[1] = []; fillerArray[1][0] = "Radius (feet)";
          fillerArray[2] = []; fillerArray[1][1] = "Seconds per Rotation";
          ht.populateFromArray(0,0, fillerArray, 1, 2);
          break;
	case 216:
    	  fillerArray[0] = [];
          fillerArray[1] = []; fillerArray[1][0] = "Launch Attempt";
          fillerArray[2] = []; fillerArray[1][1] = "Success";
		  fillerArray[2] = []; fillerArray[1][2] = "Failure";
          ht.populateFromArray(0,0, fillerArray, 1, 3);
          break;
      default:
        if(reload)
        {
        T.funcTracker = data.funcTracker;
        T.formatArray = data.formTracker;
        var rows = data.rows;
        var cols = data.cols;
        if(T.funcTracker.length!=0 && rows!=undefined && cols)
        {
        for(var i=0; i<=rows; i++)
        {
          fillerArray[i] = [];
          for(var k=0; k<=cols; k++)
          {
            if(T.funcTracker[i*ht.countRows()+k]!=null)
              fillerArray[i][k] = T.funcTracker[i*ht.countRows()+k].funcString;
          }
        }
        ht.populateFromArray(0,0,fillerArray,rows,cols);
        }
        }
        break;
	  }
    var p = ht.$table;
	});

	//Handles functionality of whenever the enter key is pressed. This should be the
	//same regardless of whether the input field or table is focused.
	function pressEnter(event)
	{
		ib.blur();
		var selected = ht.getSelected();
		if(!event.shiftKey)
		{
			event.stopImmediatePropagation();
			ht.selectCell(selected[0]+1, selected[1], selected[0]+1, selected[1], true);
		}
		else
		{
			event.stopImmediatePropagation();
			ht.selectCell(selected[0]-1, selected[1], selected[0]-1, selected[1], true);
		}
		currSelect = ht.getSelected();
	}

	function fillFuncTracker(selected)
	{
	  if(T.funcTracker[selected[0]*ht.countRows()+selected[1]] === undefined)
		{
	    T.funcTracker[selected[0]*ht.countRows()+selected[1]] = {};
	    var func = T.funcTracker[selected[0]*ht.countRows()+selected[1]];
	    func.row=selected[0];
	    func.col=selected[1];
		}
	}

	//Sets the meditormanager global variable
	function setMEditorManager(editor) {
		meditorManager = editor;
	}

	//Gets the meditormanager global variable
	this.getCurrentEditor = function() {
		return currentEditor;
	}
	
	this.setCurrentEditor = function(editor) {
		currentEditor = editor;
	}

	//Gets the meditormanager global variable
	function getMEditorManager() {
		return meditorManager;
	}
	
	this.getObjects = function(cellFunctions, addElements, functionParse)
	{
    if(ht===undefined)
      ht = cellFunctions.ht;
    CF = cellFunctions;
    AE = addElements;
    FP = functionParse;
	}
	
	$(window).on("beforeunload", function()
	{
    T.WDS.eraseExerciseData(2,figNum);
    var dataPayload = {};
    dataPayload.funcTracker = T.funcTracker;
    dataPayload.formTracker = T.formatArray;
    dataPayload.rows = ht.countRows();
    dataPayload.cols = ht.countRows();
    var dataString = JSON.stringify(dataPayload);
    console.log(dataString);
    T.WDS.saveExerciseData(2, figNum, dataString);
  });
	
}