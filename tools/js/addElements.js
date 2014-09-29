/*
 * This handles adding all elements to the document body
 * */
 
/*
  Story time: jquery mobile has its own CSS which is completely anathema to
  the watson reboot. The CSS file is also required or jquery mobile or else
  it puts a perpetual loading message at the bottom of the screen. The solution?
  Don't let jquery mobile initialize the page.
*/

function AddElements(figNum) {
	jQuery(document).on("mobileinit", function() {
	    jQuery.mobile.autoInitializePage = false;
	});
	 

	//div for first row
	var row_1 = document.createElement('div');
	row_1.id = "row1" + figNum;
	row_1.className = "row";
	row_1.style.padding = "0px";
	row_1.style.margin = "0px";

	//Div to restrict with of spreadsheet
	var tableHolder = document.createElement('div');
	//Spreadsheet div
	var tableDiv = document.createElement('div');
	this.tableDiv = tableDiv;
	tableDiv.id = "WatsonTable" + figNum;

	//input for cell functions
	var functionBox = document.createElement('input');
	this.functionBox = functionBox;
	functionBox.id = "functionBox" + figNum;
	functionBox.type = "text";
	functionBox.name = "Functions";
	//functionBox.className = "input-group col-md-7 col-xs-6";

	// moves bootstrap to next row
	var cfDiv = document.createElement('div');
	cfDiv.className = "clearfix";

	//Div for buttons
	var buttonDiv = document.createElement('div');
	this.buttonDiv = buttonDiv;
	buttonDiv.id = 'buttonDiv' + figNum;

	//Buttons
	var cutButton = document.createElement('button');
	this.cutButton = cutButton;
	cutButton.id = "cut" + figNum;
	cutButton.className = "btn btn-default btn-md btn-primary"
	cutButton.style.width = "90px";
	cutButton.innerHTML = "Cut";

	var copyButton = document.createElement('button');
	this.copyButton = copyButton;
	copyButton.id = "copy" + figNum;
	copyButton.className = "btn btn-default btn-md btn-primary"
	copyButton.style.width = "90px";
	copyButton.innerHTML = "Copy";

	var pasteButton = document.createElement('button');
	this.pasteButton = pasteButton;
	pasteButton.id = "paste" + figNum;
	pasteButton.className = "btn btn-default btn-md btn-primary"
	pasteButton.style.width = "90px";
	pasteButton.innerHTML = "Paste";

	var clearButton = document.createElement('button');
	this.clearButton = clearButton;
	clearButton.id = "clear" + figNum;
	clearButton.className = "btn btn-default btn-md btn-primary"
	clearButton.style.width = "90px";
	clearButton.innerHTML = "Clear";

	var sep1 = document.createElement('div');
	sep1.style.height = "30px";
	sep1.style.width = "90px";

	var undoButton = document.createElement('button');
	this.undoButton = undoButton;
	undoButton.id = "undo" + figNum;
	undoButton.className = "btn btn-default btn-md btn-warning"
	undoButton.style.width = "90px";
	undoButton.innerHTML = "Undo";

	var redoButton = document.createElement('button');
	this.redoButton = redoButton;
	redoButton.id = "redo" + figNum;
	redoButton.className = "btn btn-default btn-md btn-warning"
	redoButton.style.width = "90px";
	redoButton.innerHTML = "Redo";

	var sep2 = document.createElement('div');
	sep2.style.height = "30px";
	sep2.style.width = "90px";

	var sumButton = document.createElement('button');
	this.sumButton = sumButton;
	sumButton.id = "sum" + figNum;
	sumButton.className = "btn btn-default btn-md btn-success"
	sumButton.style.width = "90px";
	sumButton.innerHTML = "Sum";

	var averageButton = document.createElement('button');
	this.averageButton = averageButton;
	averageButton.id = "average" + figNum;
	averageButton.className = "btn btn-default btn-md btn-success"
	averageButton.style.width = "90px";
	averageButton.innerHTML = "Average";

	var sep3 = document.createElement('div');
	sep3.style.height = "30px";
	sep3.style.width = "90px";

	var formatButton = document.createElement('button');
	this.formatButton = formatButton;
	formatButton.id = "format" + figNum;
	formatButton.className = "btn btn-default btn-md btn-danger"
	formatButton.style.width = "90px";
	formatButton.innerHTML = "Format";


	//Append everything that needs appending
	//Button appends
	buttonDiv.appendChild(cutButton);
	buttonDiv.appendChild(copyButton);
	buttonDiv.appendChild(pasteButton);
	buttonDiv.appendChild(clearButton);
	//buttonDiv.appendChild(sep1);
	buttonDiv.appendChild(undoButton);
	buttonDiv.appendChild(redoButton);
	//buttonDiv.appendChild(sep2);
	buttonDiv.appendChild(sumButton);
	buttonDiv.appendChild(averageButton);
	//buttonDiv.appendChild(sep3);			//Ask Mike if he likes these better in
	buttonDiv.appendChild(formatButton);
	tableHolder.appendChild(tableDiv);

	row_1.appendChild(tableHolder);
	row_1.appendChild(buttonDiv);

	var container = document.getElementById("container" + figNum);
	container.style.padding = "0px";
	container.appendChild(functionBox);
	container.appendChild(row_1);
	
	switch(figNum)
	{
    case 3:
    case 4:
    case 81:
    case 82:
    case 91:
    case 92:
    case 93:
    case 94:
    case 131:
    case 132:
    case 141:
    case 142:
      buttonDiv.style.display = "none";
      functionBox.style.width = "100%";
      break;
    default:
      functionBox.style.width = "71%";
      tableHolder.className = "col-md-8 col-xs-6 tableHolder";
      buttonDiv.className = "btn-group-vertical col-xs-2 col-md-2 col-md-offset-1 col-xs-offset-1";
      break;
	}
}




