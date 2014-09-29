/*
 * This handles the functions for the cells
 * */

function CellFunctions(figNum) {
  var ht = $("#WatsonTable" + figNum).handsontable('getInstance');
  this.ht = ht;
  
  //Related code
  var AE, T, FP;

  var tempCopy;
  var tempSelected;
  var offset;
  var debug = true;
  var absolute = /[^~]\$[A-Z]\$\d+/;
  var absoluteCol = /[^~]\$[A-Z]\d+/;
  //note: [^\$]? prevents a dollar sign from appearing before the remaining regex.
  var absoluteRow = /[^~\$][A-Z]\$\d+/;
  var nonabsolute = /[^~\$][A-Z]\d+/;

  //Redoes the last undone operation
  this.undo = function() {
    T.URFlag = T.URTypes.UNDO;
    if(T.URIndex<0)
      T.URIndex = 0;
    else if(T.URArray[T.URIndex-1]!==undefined){
    switch(T.URArray[T.URIndex-1].type)
    {
      case T.URTypes.NORMAL:
        ht.undo();
        break;
      case T.URTypes.FUNCTION:
        var selection = T.URArray[T.URIndex-1].selection;
        //var fillerArray = [];
        for(var i = selection[0]; i<=selection[2]; i++)
        {
          //fillerArray[i-selection[0]] = [];
          for(var k = selection[1]; k<=selection[3]; k++)
          {
              //if(T.funcTracker[i*ht.countRows()+k]!==undefined)
              //  fillerArray[i-selection[0]][k-selection[1]] = T.funcTracker[i*ht.countRows()+k].funcString;
              T.formatArray[i][k].index--;
              if(T.formatArray[i][k].index<0)
                T.formatArray[i][k].index = 0;
              if(T.formatArray[i][k].type[T.formatArray[i][k].index]===undefined)
                T.formatArray[i][k].type[T.formatArray[i][k].index] = 0;
          }
        }
        ht.undo();
        break;
      case T.URTypes.PUSHUPDATES:
        ht.undo();
        ht.undo();
        T.URIndex--;
        break;
    }
    T.URIndex--;
    T.URFlag = T.URTypes.NORMAL;
    }
  }

  //Undoes the last operation
  this.redo = function() {
    T.URFlag = T.URTypes.REDO;
    if(T.URArray.length>T.URIndex)
    {
    switch(T.URArray[T.URIndex].type)
    {
        case T.URTypes.NORMAL:
          ht.redo();
          //look at next inde, if push updates, then push updates.
          if(T.URArray[T.URIndex+1].type!==undefined && T.URArray[T.URIndex+1].type==T.URTypes.PUSHUPDATES)
          {
            ht.redo();
            T.URIndex++;
          }
        break;
        case T.URTypes.FUNCTION:
          var selection = T.URArray[T.URIndex].selection;
          var fillerArray = [];
          for(var i = selection[0]; i<=selection[2]; i++)
          {
            //fillerArray[i-selection[0]] = [];
            for(var k = selection[1]; k<=selection[3]; k++)
            {
                //if(T.funcTracker[i*ht.countRows()+k]!==undefined)
                //  fillerArray[i-selection[0]][k-selection[1]] = T.funcTracker[i*ht.countRows()+k].funcString;
                T.formatArray[i][k].index++;
            }
          }
          ht.redo();
          break;
        case T.URTypes.PUSHUPDATES:
          ht.redo();
          ht.redo();
          T.URIndex++;
        break;
      }
      T.URIndex++;
    }
    T.URFlag = T.URTypes.NORMAL;
  }

  //Handles the sum operation
  this.sum = function() {
  	var selected = ht.getSelected();
  	if(selected != undefined) {
  		var sum = 0;
  		var cells = ht.getData(selected[0], selected[1], selected[2], selected[3]);
  		
  		//Adds all selected cells
  		for(var i = 0; i < cells.length; i++) {
  			for(var y = 0; y < cells[i].length; y++) {
  				if(cells[i][y] != null) sum += Number(cells[i][y]);
  			}
  		}
  		
  		//Deselect selection
  		ht.deselectCell();
  		
  		//Inserts sum in cell (if it's below the original selection)
                  //note by Mitchell: robust checking has made the previous condition
                  //obsolete.
  		$("#" + AE.tableDiv.id).on('click', function() {
  			var clicked = ht.getSelected();
  				var string = "=SUM(" + funcStrCreator(selected) + ")";
  				ht.setDataAtCell(clicked[0], clicked[1], string);
  				$(this).off('click');
  		});
  	}
  }

  //Handles the average operation
  this.average = function() {
  	var selected = ht.getSelected();
  	if (selected != undefined) {
  	var cells = ht.getData(selected[0], selected[1], selected[2], selected[3]);
  		var sum = 0;
  		var count = 0;
  		//Adds all selected cells
  		for(var i = 0; i < cells.length; i++) {
  			for(var y = 0; y < cells[i].length; y++) {
  				if(cells[i][y] != null) {
  					sum += Number(cells[i][y]);
  					if (cells[i][y].length > 0) count++;
  				}
  			}
  		}
  		
  		//Deselect selection
  		ht.deselectCell();
  		
  		//Inserts average in cell if it's below the original selection
  		$("#" + AE.tableDiv.id).on('click', function() {
  			var clicked = ht.getSelected();
  				var string = "=AVG(" + funcStrCreator(selected) + ")";
  				ht.setDataAtCell(clicked[0], clicked[1], string);
  				$(this).off('click');
  		});
  	}
  }

  this.format = function()
  {
    var selected = ht.getSelected();
    T.URFlag = T.URTypes.FUNCTION;
    T.URArray[T.URIndex] = {};
    T.URArray[T.URIndex].type = T.URTypes.FUNCTION;
  	if (selected != undefined)
  	{
        if(selected[0]<selected[2])
        {
            var row = selected[0];
            var endRow = selected[2];
        }    
        else
        {
            var endRow = selected[0];
            var row = selected[2];
        }
        if(selected[1]<selected[3])
        {
            var col = selected[1];
            var endCol = selected[3];
        }    
        else
        {
            var endCol = selected[1];
            var col = selected[3];
        }
  	}
  	T.URArray[T.URIndex].selection = [row, col, endRow, endCol];
  	T.URIndex++;
  	var options = ["No Format", "1", "1.0", "1.00", "1.000", "$1.00"];
  	var choice;
  	var div = document.getElementById("container"+figNum);
  	var sel = new Selector();
  	sel.open("Format Number", options, function(selection)
  {
      var fillerArray = [];
      if(selection!==null)
      {
        if (selection.indexOf("$1.00")>=0)
          choice = T.formatOption.DOLLARS;
        else if(selection.indexOf("1.000")>=0)
          choice = T.formatOption.THREE;
        else if(selection.indexOf("1.00")>=0)
          choice = T.formatOption.TWO;
        else if(selection.indexOf("1.0")>=0)
          choice = T.formatOption.ONE;
        else if(selection.indexOf("1")>=0)
          choice = T.formatOption.ZERO;
        else if(selection.indexOf("No Format")>=0)
          choice = T.formatOption.FNONE;
        for(var i = row; i <= endRow; i++)
        {
          if(T.formatArray[i]==undefined)
            T.formatArray[i] = [];
          fillerArray[i-row] = [];
          for(var k = col; k <= endCol; k++)
          {
            if(T.formatArray[i][k]==undefined)
            {
              T.formatArray[i][k] ={};
              T.formatArray[i][k].index =0;
              T.formatArray[i][k].type = [0];
              
            }
            T.formatArray[i][k].index++;
            var index = T.formatArray[i][k].index;
            T.formatArray[i][k].type[index] = choice;
            
            if(T.funcTracker[i*ht.countRows()+k]!=undefined)
            {
              fillerArray[i-row][k-col] = T.funcTracker[i*ht.countRows()+k].funcString;
              //ht.setDataAtCell(i, k, T.funcTracker[i*ht.countRows()+k].funcString);
            }
          }
        }
        ht.populateFromArray(row, col, fillerArray, endRow, endCol);
      }
  }, div);
  }
  
  //allows programmatical editing of the format array/
  this.fillFormatArray = function(row, col, endRow, endCol, option)
  {
    var temp;
    if(endCol < col)
    {
  			temp = endCol;
  			endCol = col;
  			col = temp;
  	}
  	if(endRow < row)
  	{
  			temp = endRow;
  			endRow = row;
  			row = temp;
  	}
    for(i=row; i<=endRow; i++)
    {
      if(T.formatArray[i]==undefined)
        T.formatArray[i] = [];
        for(k=col; k<=endCol; k++)
        {
          if(T.formatArray[i][k]==undefined)
            {
              T.formatArray[i][k] ={};
              T.formatArray[i][k].index =0;
              T.formatArray[i][k].type = [0];
              
            }
            T.formatArray[i][k].index++;
            T.formatArray[i][k].type[T.formatArray[i][k].index] = option;
        }
    }
    
  }
  fillFormatArray = this.fillFormatArray;


  //Handles the cut operation
  this.cut = function()
  {
  		fillTempCopy();
      var selected = topLeft(ht.getSelected());
  		var allZero = emptyArray(selected[0], selected[1], selected[2], selected[3]);
  		ht.populateFromArray(selected[0],selected[1], allZero, selected[2], selected[3]);
  }

  //Handles the copy operation
  this.copy = function()
  {
      //fill tempCopy with an array of the functionStrings of the selected index.
  		fillTempCopy();
  }

  //Handles the paste operation
  this.paste = function() {
  	var selected = ht.getSelected();
  	if(tempCopy!== undefined)
  	{
        var fillerArray = generateFillerArray(tempSelected, selected);
        ht.populateFromArray(selected[0],selected[1], fillerArray, selected[0]+fillerArray.length-1, selected[1]+fillerArray[0].length-1);
  	}
  	else if(tempCopy != undefined && selected != undefined) {
  		ht.populateFromArray(selected[0], selected[1], tempCopy, selected[0]+tempCopy.length-1, selected[1]+tempCopy[0].length-1);
  		/**
  		for(var i = selected[0]; i < tempCopy.length + selected[0]; i++) {
  			for(var y = selected[1]; y < tempCopy[0].length + selected[1]; y++) {
  				if(i < 30) ht.setDataAtCell(i, y, tempCopy[i-selected[0]][y-selected[1]], true);
  			}
  		}
  		*/
  	}
  }

  //Handles the clear operation
  this.clear =  function() {
  	var selected = topLeft(ht.getSelected());
  	var data = ht.getData(selected[0], selected[1], selected[2], selected[3]);
  	if(selected != undefined)
  	{
      var allZero = emptyArray(selected[0], selected[1], selected[2], selected[3])
      ht.populateFromArray(selected[0],selected[1], allZero, selected[2], selected[3]);
  	}
  }

  //Returns a selection in format [top, left, bottom, right]
  this.topLeft = function(selected) {
  	if(selected != undefined) {
  		var newSelect = [0,0,0,0];
  		if(selected[0] < selected[2]) {
  			newSelect[0] = selected[0];
  			newSelect[2] = selected[2];
  		}
  		else {
  			newSelect[0] = selected[2];
  			newSelect[2] = selected[0];
  		}
  		if(selected[1] < selected[3]) {
  			newSelect[1] = selected[1];
  			newSelect[3] = selected[3];
  		}
  		else {
  			newSelect[1] = selected[3];
  			newSelect[3] = selected[1];
  		}
  		return newSelect;
  	}
  }
  topLeft = this.topLeft;

  //Changes text in intput bar
  this.changeInput = function(text) {
    if(!(T.ib.is(":focus")))
    {
      $("#" + AE.functionBox.id).val(text);
    }
  }

  //Keeps track of all function cells (Cells with =SUM() or =AVG())
  this.cellFunction = function(row, col, funcString) {
  	this.row = row;
  	this.col = col;
  	this.funcString = funcString;
  }

  this.setUpdateTable = function(row, col)
  {
    T.updateTable[ht.countRows()*row+col] = false;
    if(T.usedBy[row]!==undefined && T.usedBy[row][col]!==undefined)
    {
      for(var i = 0; i<=T.usedBy[row][col].length; i++)
      {
        if(T.usedBy[row][col][i]!==undefined)
        {
          for(var k = 0; k<=T.usedBy[row][col][i].length; k++)
          {
            //only update if the value is not exactly false.
            //if the value is false, then we've got a recursive statement.
            //if the value is undefined, se it.
            if(T.updateTable[ht.countRows()*i+k]!==false)
              setUpdateTable(i, k);
          }
        }
      }
    }
  }
  setUpdateTable = this.setUpdateTable;

  //takes coordinates for a selection and a specified cell, and marks all
  //cells within the range specified in details as used by cell
  function updateDependencyArrays(row, col, endRow, endCol, cellRow, cellCol)
  {
    var error = false;
    for (var i=row; i<=endRow; i++)
    {
      if(T.usedBy[i]===undefined)
        T.usedBy[i] = [];
      if(T.dependantOn[cellRow]===undefined)
        T.dependantOn[cellRow] = [];
      for(var k=col; k<=endCol; k++)
      {
        if(T.usedBy[i][k]===undefined)
          T.usedBy[i][k] = [];
        if(T.dependantOn[cellRow][cellCol]===undefined)
          T.dependantOn[cellRow][cellCol] = [];
        if(T.usedBy[i][k][cellRow]===undefined)
          T.usedBy[i][k][cellRow] = [];
        if(T.dependantOn[cellRow][cellCol][i]===undefined)
          T.dependantOn[cellRow][cellCol][i] = [];
        T.usedBy[i][k][cellRow][cellCol] = true;
        T.dependantOn[cellRow][cellCol][i][k] = true;
        //check for circular dependency. T.dependantOn[cellRow][cellCol][i][k]
        //is known to be true. If T.dependantOn[i][k][cellCol][cellRow] is also true,
        //then a circular dependancy has been found.
        if(T.dependantOn[i]!==undefined && T.dependantOn[i][k]!==undefined && 
        T.dependantOn[i][k][cellRow]!==undefined &&
        T.dependantOn[i][k][cellRow][cellCol]!==undefined && T.dependantOn[i][k][cellRow][cellCol])
        {
          error = true;
        }
      }
    }
    return error;
  }
  this.updateDependencyArrays = updateDependencyArrays;

  //Convenience function that allows for a much smaller signature of updateDependencyArrays()
  function updateDependencyByDetails(details, cell)
  {
    return updateDependencyArrays(details.row, details.col, details.endRow, details.endCol, cell.row, cell.col);
  }
  this.updateDependencyByDetails = updateDependencyByDetails;

  //sets the value of all dependant cells
  this.notifyDependants = function(row, col)
  {
    //Cycle through cells and search for dependant cells.
    if(T.usedBy[row]!== undefined && T.usedBy[row][col]!==undefined)
    {
      for(var i=0; i<=T.usedBy[row][col].length; i++)
      {
        if(T.usedBy[row][col][i]!==undefined)
        {
          for(var k=0; k<=T.usedBy[row][col][i].length; k++)
          {
            //if T.updateTable[index] is a value then the cell is completely up-to-date.
            //if false then update it.
            //if it is null, then there is a circular reference.
            if(T.usedBy[row][col][i][k] && T.updateTable[i*ht.countRows()+k]!==null)
            {
              T.updateTable[i*ht.countRows()+k] = null;
              if(T.usedBy[i]===undefined || T.usedBy[i][k]===undefined ||
              T.usedBy[i][k][row]===undefined || !T.usedBy[i][k][row][col])
              {
                var value = {};
                value.row = i;
                value.prop = k;
                var func = T.funcTracker[i*ht.countRows()+k]
                if(func.funcString!=undefined)
                  value.value = func.funcString;
                else
                  value.value = "";
                T.cellRoutine(value);
                if(T.pushTable[i]===undefined)
                  T.pushTable[i] = [];
                T.pushTable[i][k] = value.value;
                
              }
            }
            //outdated after the introduction of updated cell tracking
            /*else if(T.usedBy[row][col][i][k] && !debug)
            {
              if(T.usedBy[i]===undefined || T.usedBy[i][k]===undefined ||
              T.usedBy[i][k][row]===undefined || !T.usedBy[i][k][row][col])
                ht.setDataAtCell(i, k, T.funcTracker[i*ht.countRows()+k].funcString);
            }*/
          }
        }
      }
    }
  }

  //Called whenever the function string of a cell is reevaluated.
  //Removes references to cells that the specified cell is dependant on.
  //Does not clear references by cells that are dependant on the specified cell.
  this.clearAssociations = function(row, col)
  {
    //check to see if cell is dependant on anything
    if(T.dependantOn[row]!== undefined && T.dependantOn[row][col]!==undefined)
    {
      //cycle through and remove dependancies
      for(var i= 0; i<T.dependantOn[row][col].length; i++)
      {
        if(T.dependantOn[row][col][i]!==undefined)
        {
          for(var k=0; k<T.dependantOn[row][col][i].length; k++)
          {
            if(T.dependantOn[row][col][i][k]==true)
            {
              T.dependantOn[row][col][i][k] = false;
              T.usedBy[i][k][row][col] = false;
            }
          }
        }
      }
    }
  }
  clearAssociations = this.clearAssociations;

  function functionSUM(details)
  {
    var sum = 0;
    var temp = 0;
    if (details.row>details.endRow)
    {
      var temp = details.row;
      details.row = details.endRow;
      details.endRow=temp;
    }
    if (details.col>details.endCol)
    {
      var temp = details.col;
      details.col = details.endCol;
      details.endCol=temp;
    }
    for(var i = details.row;i<=details.endRow;i++)
    {
      for(var k =details.col;k<=details.endCol;k++)
      {
        //Method deprecated after update table.
        /*
        temp=ht.getDataAtCell(i, k);
        if(temp!=null && temp!=undefined)
        {
          temp = temp.replace(/\$/g,'');
          temp = parseInt(temp);
          if(!isNaN(temp))
          {
            sum+=temp;
          }
        }
        else if(temp===undefined)
        {
          sum = "#REF";
          break;  
        }
        */
        if(T.updateTable[ht.countRows()*i+k]!=undefined && !isNaN(T.updateTable[ht.countRows()*i+k]))
        {
          sum = sum+T.updateTable[ht.countRows()*i+k];
        }
        else
        {
          temp = ht.getDataAtCell(i,k);
          if(temp==null)
            temp = 0;
          else
            temp = "#ERROR";
          sum = sum+temp;
        }
      }
    }
    return sum;
  }
  this.functionSUM = functionSUM;

  function functionAVG(details)
  {
    var sum =0;
    var temp =0;
    var count =0;
    if (details.row>details.endRow)
    {
      var temp = details.row;
      details.row = details.endRow;
      details.endRow=temp;
    }
    if (details.col>details.endCol)
    {
      var temp = details.col;
      details.col = details.endCol;
      details.endCol=temp;
    }
    for(var i = details.row;i<=details.endRow;i++)
    {
      for(var k =details.col;k<=details.endCol;k++)
      {
        /*
        temp=ht.getDataAtCell(i, k);
        if(temp!==null)
        {
          temp = temp.replace(/\$/g,'');
          temp = parseInt(temp);
          if(!isNaN(temp))
          {
    
            sum+=temp;
          }
        count++;
        }*/
        //if the cell has a value, all is dandy.
        if(T.updateTable[ht.countRows()*i+k]!==undefined)
        {
          sum = sum+T.updateTable[ht.countRows()*i+k];
        }
        else
        {
          temp = ht.getDataAtCell(i,k);
          //if the cell is empty, the value is zero
          if(temp==null)
            //don't count this one.
            count--;
            //if the cell has a string value, however, an error is thrown.
          else
            temp = "#ERROR";
          sum = sum+temp;
        }
        count++;
      }
    }
    if(count==0)
      return 0;
    return sum/count;
  }
  this.functionAVG = functionAVG;

  function evaluateTableExpression(expression, selectedCell)
  {
        //replace all cell names with the values of those cells.
        //And replace SUM and AVG operations with their values.
        var selected = [];
        selected[0] = selectedCell.row;
        selected[1] = selectedCell.col;
        //ignore dollar signs
        expression = expression.replace(/\$/g,'');
        //expression = expression.replace(/ /g,'');
        expression = expression.toUpperCase();
        var SUMAVG = expression.match(FP.SUMAVGRE);
        var saGet = false;
        if(SUMAVG!==null)
          var saGet= true;
        //cycle through occurences of SUM or AVG functions
        while(saGet)
        {
          var expressionStart;
          var expressionEnd;
          var insert;
          //remember portion of expression before cell name.
          expressionStart = expression.substr(0,SUMAVG.index);
          //remember portion after.
          expressionEnd = expression.substr(SUMAVG.index+SUMAVG[0].length);
          //Get beginning of cell range from SUM or AVG function
          cellNames = SUMAVG[0].match(FP.cellRE);
          var cellRow = FP.getRowFromNumber(cellNames[0].substr(1));
          var cellCol = FP.getColFromChar(cellNames[0].charAt(0));
          //Get end of cell range
          cellNames = SUMAVG[0].substr(SUMAVG[0].indexOf(":")).match(FP.cellRE);
          var cellRow2 = FP.getRowFromNumber(cellNames[0].substr(1));
          var cellCol2 = FP.getColFromChar(cellNames[0].charAt(0));
          //before performing the final sum, loop through the sum/average
          //range and update cells that are not updated already.
          var temp;
          if(cellRow>cellRow2)
          {
              temp = cellRow;
              cellRow = cellRow2;
              cellRow2 = temp;
          }
          if(cellCol>cellCol2)
          {
              temp = cellCol;
              cellCol = cellCol2;
              cellCol2 = temp;
          }
          for(var i = cellRow; i<=cellRow2; i++)
          {
            for(var k = cellCol; k<=cellCol2; k++)
            {
              if(T.updateTable[i*ht.countRows()+k]===false)
              {
                T.updateTable[i*ht.countRows()+k] = null;
                var value = {};
                value.row = i;
                value.prop = k;
                value.value = T.funcTracker[i*ht.countRows()+k].funcString;
                T.cellRoutine(value);
                if(T.pushTable[i] === undefined)
                  T.pushTable[i] = [];
                T.pushTable[i][k] = value.value;
              }
              
            }
          }
          var details = {};
          details.row = cellRow;
          details.col = cellCol;
          details.endRow = cellRow2;
          details.endCol = cellCol2;
          if(SUMAVG[0].indexOf("SUM")==0)
            insert = functionSUM(details);
          else
            insert = functionAVG(details);
          expression = expressionStart+insert+expressionEnd;
          SUMAVG = null;
          //error returned as true
          saGet = false;
          if(updateDependencyByDetails(details, selectedCell))
          {
            return "#ERROR";
          }
          else
          {
              SUMAVG = expression.match(FP.SUMAVGRE);
              if(SUMAVG!==null)
                var saGet= true;
          }
        }
        var cellNames = expression.match(FP.cellRE);
        var cellGet = false;
        if(cellNames!==null)
          cellGet = true;
        //cycle through occurences of cell names.
        while(cellGet)
        {
            var expressionStart;
            var expressionEnd;
            var insert;
            var cellRow = FP.getRowFromNumber(cellNames[0].substr(1));
            var cellCol = FP.getColFromChar(cellNames[0].charAt(0));
            //remember portion of expression before cell name.
            expressionStart = expression.substr(0,cellNames.index);
            //remember portion after.
            expressionEnd = expression.substr(cellNames.index+cellNames[0].length);
            //get value of cell
            //deprecated method after update table was implemented
            //insert=ht.getDataAtCell(cellRow, cellCol);
            //insert=convertCellTextToNumber(insert);
            var updatedValue = T.updateTable[ht.countRows()*cellRow+cellCol];
            if(updatedValue===undefined)
              insert = 0;
            else
              insert = T.updateTable[ht.countRows()*cellRow+cellCol];
            if(insert===null)
              insert=0;
            //reform the expression string
            expression = expressionStart+insert+expressionEnd;
            //update dependency table
            fillUsedBy(cellRow, cellCol, selected[0], selected[1], true);
            fillDependantOn(selected[0],selected[1],cellRow,cellCol, true);
            //A note on the nature of javascript: if a variable is defined as null
            //within a scope, it will be reinstantiated after leaving the scope.
            //I want to set cellNames to null (similar to if a expression match
            //failed) but cannot do so within a block. Thus, the default behavior
            //is to set cellNames to null and define it if there are no errors.
            cellGet = false;
            if(T.updateTable[cellRow*ht.countRows()+cellCol]===false)
            {
                  T.updateTable[cellRow*ht.countRows()+cellCol] = null;
                  T.updateTable[i*ht.countRows()+k] = null;
                  var value = {};
                  value.row = i;
                  value.prop = k;
                  value.value = T.funcTracker[i*ht.countRows()+k].funcString;
                  T.cellRoutine(value);
                  if(T.pushTable[i] === undefined)
                  T.pushTable[i] = [];
                  T.pushTable[i][k] = value.value;
            }
            //circular dependancy
            if(T.dependantOn[cellRow]!==undefined && T.dependantOn[cellRow][cellCol]!==undefined && 
            T.dependantOn[cellRow][cellCol][selected[0]]!==undefined &&
            T.dependantOn[cellRow][cellCol][selected[0]][selected[1]]!==undefined &&
            T.dependantOn[cellRow][cellCol][selected[0]][selected[1]])
            {
              return "#ERROR";
            }
            else if((cellRow==selected[0])&&(cellCol==selected[1]))
            {
              //cell dependant on itself
              return "#ERROR";
            }
            else
            {
                //no circular dependencies
                cellNames = expression.match(FP.cellRE);
                if(cellNames!==null)
                  cellGet = true;
            }
        }
        if(expression.indexOf("#ERROR")>=0 || expression.indexOf("#REF")>=0)
        {
          return "#ERROR";
        }
        else
        {
          return eval(expression).toString();
        }
  }
  this.evaluateTableExpression = evaluateTableExpression;


  function funcStrCreator(selection) {
  	selection = topLeft(selection);
  	var start = String.fromCharCode(selection[1]+65) + Number(selection[0]+1);
  	var end = String.fromCharCode(selection[3]+65) + Number(selection[2]+1);
  	var final = start + ":" + end;
  	return final;
  }

  /**
  	Creates an empty array for the given start and end metrics
  	of a table.
  */
  function emptyArray(row, col, endRow, endCol)
  {
  	if((row>endRow)||(col>endCol))
  		return -1;
  	//Normalize all to start at 0.
  	endRow=endRow-row;
  	row=row-row;
  	endCol=endCol-col;
  	col=col-col;
  	var allNull = new Array();
  	for(var i=row; i<=endRow;i++)
  	{
  		allNull[i] = new Array();
  		for(var k=col; k<=endCol;k++)
  		{
  			allNull[i][k] = null;
  		}
  	}
  	return allNull;
  }

  //Fills an element of the table T.usedBy, ensuring that
  //each dimension of the table is defined
  function fillUsedBy(row1, col1, row2, col2, value)
  {
    if(T.usedBy[row1]===undefined)
      T.usedBy[row1] =[];
    if(T.usedBy[row1][col1]===undefined)
      T.usedBy[row1][col1] =[];
    if(T.usedBy[row1][col1][row2]===undefined)
      T.usedBy[row1][col1][row2] =[];
    T.usedBy[row1][col1][row2][col2] = value;
  }

  function fillDependantOn(row1, col1, row2, col2, value)
  {
    if(T.dependantOn[row1]===undefined)
      T.dependantOn[row1] =[];
    if(T.dependantOn[row1][col1]===undefined)
      T.dependantOn[row1][col1] =[];
    if(T.dependantOn[row1][col1][row2]===undefined)
      T.dependantOn[row1][col1][row2] =[];
    T.dependantOn[row1][col1][row2][col2] = value;
  }

  //generates the tempCopy and tempSelcted from the currently selected section of cells.
  //Always changes the selection so that it starts from the top-left corner.
  function fillTempCopy()
  {
    tempSelected = ht.getSelected();
    tempCopy = [];
    //make sure tempSelected begins at topleft corner.
    var swap;
      if(tempSelected[0]>tempSelected[2])
      {
          swap = tempSelected[2];
          tempSelected[2] = tempSelected[0];
          tempSelected[0] = swap;
      }
      if(tempSelected[1]>tempSelected[3])
      {
          swap = tempSelected[3];
          tempSelected[3] = tempSelected[1];
          tempSelected[1] = swap;
          
      }
      var counti = 0;
      var countk = 0;
      for(var i = tempSelected[0]; i<=tempSelected[2]; i++)
      {
          tempCopy[counti] = [];
          countk = 0;
          for(var k = tempSelected[1]; k<=tempSelected[3]; k++)
          {
              if(T.funcTracker[i*ht.countRows()+k]!=undefined)
              tempCopy[counti][countk] = T.funcTracker[i*ht.countRows()+k].funcString;
              //if the function string was undefined, set to empty string so
              //it will be treated as a string.
              else
                  tempCopy[counti][countk] = "";
              countk++;
          }
          counti++;
      }
        
  }

  function convertCellTextToNumber(string)
  {
    
    if(string!==undefined && string!== null)
    {
      //handle monetary values
      string = string.replace("$","");
      //checks if result is number
      if(string.length==0)
        string = 0;
      else
      {
        string = parseFloat(string);
        if(isNaN(string))
        {
          string="#ERROR";
        }
      }
    }
    return string;
  }

  //Given an input selection index and a target selection index,
  //returns a filler array. This filler array has the intended function
  //array for the target selection, with function strings modified relative to
  //the original selection.
  function generateFillerArray(copySelection, pasteSelection)
  {
      //watson labs handles copy/paste from the top left corner.
      //make sure all selections are in proper order.
      var swap;
      if(copySelection[0]>copySelection[2])
      {
          swap = copySelection[2];
          copySelection[2] = copySelection[0];
          copySelection[0] = swap;
      }
      if(copySelection[1]>copySelection[3])
      {
          swap = copySelection[3];
          copySelection[3] = copySelection[1];
          copySelection[1] = swap;
          
      }
      if(pasteSelection[0]>pasteSelection[2])
      {
          swap = pasteSelection[2];
          pasteSelection[2] = pasteSelection[0];
          pasteSelection[0] = swap;
          
      }
      if(pasteSelection[0]>pasteSelection[2])
      {
          swap = pasteSelection[3];
          pasteSelection[3] = pasteSelection[1];
          pasteSelection[1] = swap;
          
      }
      var fillerArray = [];
      //selection to be copied is exactly one cell.
      //fill selection size with the function string of the copied cell.
      if(copySelection[0] == copySelection[2] && copySelection[1] == copySelection[3])
      {
        initialRow = copySelection[0];
        initialCol = copySelection[1];
        var counti = 0;
        var countk = 0;
        for(var i = pasteSelection[0]; i<=pasteSelection[2]; i++)
        {
            fillerArray[counti] = [];
            countk=0;
            for(var k = pasteSelection[1]; k<=pasteSelection[3]; k++)
            {
                fillerArray[counti][countk] = modifiedFunctionString(initialRow, initialCol, i, k, tempCopy[0][0]);
                countk++;
            }
            counti++;
        }
      }
      else//selection is more than one cell. Watson ignores new selection size.
      {
         var counti = 0;
         var countk = 0;
         for(var i = copySelection[0]; i<=copySelection[2]; i++)
         {
            fillerArray[counti] = [];
            countk = 0;
            for(var k = copySelection[1]; k<=copySelection[3]; k++)
            {
                fillerArray[counti][countk] = modifiedFunctionString(i, k, pasteSelection[0]+counti, pasteSelection[1]+countk, tempCopy[counti][countk]);
                countk++;
            }
            counti++;
         }
      }
      return fillerArray;
  }

  //given an initial cell index and the pasted cell index, constructs the
  //appropriate function string.
  function modifiedFunctionString(initialRow, initialCol, pasteRow, pasteCol, oldFS)
  {
      //an equal sign means that the function string is attempting to be
      //a valid expression, so cell references must be parsed.
      if(oldFS!==undefined && oldFS.indexOf("=")==0)
      {
        //oldFS = oldFS.replace(/ /g,'');
        oldFS = oldFS.toUpperCase();
        //calculate differences
        var rowDif = pasteRow-initialRow;
        var colDif = pasteCol-initialCol;
        var regex = null;
        oldFS.match(absolute);
        //declare variables
        var FSStart, FSEnd, insert, modifiedRow, modifiedCol;
        while(regex!==null)
        {
          FSStart = oldFS.substr(0,regex.index);
          FSEnd = oldFS.substr(regex.index+regex[0].length);
          modifiedRow = (FP.getRowFromNumber(regex[0].substr(4))+1).toString();
          modifiedCol = String.fromCharCode(FP.getColFromChar(regex[0].substr(2,1))+65);
          insert = oldFS.charAt(regex.index)+"~"+"$"+modifiedCol+"$"+modifiedRow;
          oldFS = FSStart+insert+FSEnd;
          regex = oldFs.match(absolute);
        }
        regex = oldFS.match(absoluteRow);
        while(regex!==null)
        {
          FSStart = oldFS.substr(0,regex.index);
          FSEnd = oldFS.substr(regex.index+regex[0].length);
          modifiedRow = (FP.getRowFromNumber(regex[0].substr(3))+1).toString();
          modifiedCol = String.fromCharCode(FP.getColFromChar(regex[0].substr(1,1))+65+colDif);
          insert = oldFS.charAt(regex.index)+"~"+modifiedCol+"$"+modifiedRow;
          oldFS = FSStart+insert+FSEnd;
          regex = oldFS.match(absoluteRow);
        }
        regex = oldFS.match(absoluteCol);
        //NOTE: these next two would create false positives if
        //the regular expression did not add an extra character to check that
        //there was no "~"(my "got this one already" check) before the regex. It does not need to check for an empty string
        //because there will always be something before the desired regex due to the "=".
        //because of this, the actual regex we want starts at index 1 instead of 0.
        while(regex!==null)
        {
          FSStart = oldFS.substr(0,regex.index);
          FSEnd = oldFS.substr(regex.index+regex[0].length);
          modifiedRow = (FP.getRowFromNumber(regex[0].substr(3))+rowDif+1).toString();
          modifiedCol = String.fromCharCode(FP.getColFromChar(regex[0].substr(2,1))+65);
          insert = oldFS.charAt(regex.index)+"~"+"$"+modifiedCol+modifiedRow;
          oldFS = FSStart+insert+FSEnd;
          regex = oldFS.match(absoluteCol);
        }
        regex = oldFS.match(nonabsolute);
        while(regex!==null)
        {
          FSStart = oldFS.substr(0,regex.index);
          FSEnd = oldFS.substr(regex.index+regex[0].length);
          modifiedRow = (FP.getRowFromNumber(regex[0].substr(2))+rowDif+1).toString();
          modifiedCol = String.fromCharCode(FP.getColFromChar(regex[0].substr(1,1))+colDif+65);
          insert = oldFS.charAt(regex.index)+"~"+modifiedCol+modifiedRow;
          oldFS = FSStart+insert+FSEnd;
          regex = oldFS.match(nonabsolute);
        }
        oldFS = oldFS.replace(/~/g, '');
      }
      return oldFS;
  }
  this.getObjects = function(addElements, table, functionParse)
  {
    AE = addElements;
    T = table;
    FP = functionParse;
  }
}