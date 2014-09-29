function SB_TruthTable(containerNum) {
	var expectedTruthTable;
	var numIn;
	var numOut;
	var header;
	//var title;
	var tableName = "truthTable" + containerNum;
	var divName = "truthTableDiv" + containerNum;
	var innerDiv;
	var tableDiv;
	var img;
	var tableArray;
	var dialogID = 1;
	var id;
	var correctFlag = true;
	
	this.setExpectedTruthTable = setExpectedTruthTable;
	this.checkTruthTable = checkTruthTable;
	this.createTable = createTable;
	this.setTable = setTable;
	this.getTableWidth = getTableWidth;
	//this.setLeftOffset = setLeftOffset;
	this.toggleVisible = toggleVisible;
	this.setDeleteIcon = setDeleteIcon;
	this.setTableOffset = setTableOffset;
	this.resetTruthTable = resetTruthTable;
	this.setupTable = setupTable;
	this.setTableArray = setTableArray;
	this.isOpen = isOpen;
	this.close = close;
	
	function resetTruthTable2(_numIn, _numOut, _header) {
		var table = document.getElementById(tableName);
		if (table) {
			table.id = "";
			try {
				var deleteIcon = document.getElementById("tableDeleteIcon" + containerNum);
				tableDiv.removeChild(deleteIcon);
			}
			catch (err) { }
			//tableDiv.removeChild(table);
			tableDiv.removeChild(innerDiv);
			tableDiv.innnerHTML = '';
			//createTable(_numIn, _numOut, _header);
			//toggleVisible();	// toggle truth table to re-initialize things
			//toggleVisible();	// toggle once again to put back to initial state
		}
	}
	
	function resetTruthTable(_numIn, _numOut, _header) {
		if (isOpen() == true) {
			$("#" + id).dialog("close");
			setupTable(_numIn, _numOut, _header);
			createTable();
		}
		else {
			setupTable(_numIn, _numOut, _header);
		}
	}
	
	function checkTruthTable(resultTruthTable) {
		if (expectedTruthTable.length == 0) return 0; // no truth table set; scratch pad mode
		var correct = true;
		for (var i = 0; i < resultTruthTable.length; i++) {
			for (var j = 0; j < resultTruthTable[i].length; j++) {
				if (resultTruthTable[i][j] != expectedTruthTable[i][j]) { correct = false; break; }
			}
			if (correct === false) break;
		}
		
		if (correct) {
			if (correctFlag == true) return 1;
			
			//alert("You circuit functions properly.");
			var alert = new Alert();
			alert.open("Success!", "Your circuit functions properly", true, (function() { }), document.getElementById("sandbox" + containerNum));
			correctFlag = true;
			return 1;
		}
		else correctFlag = false;
		
		return 0;
	}

	function setExpectedTruthTable(truthTable) {
		expectedTruthTable = truthTable;
	}
	
	function setupTable(_numIn, _numOut, _header) {
		numIn = _numIn;
		numOut = _numOut;
		header = _header;
	}

	function createTable() {
		// set global variables so setTable() can use them
		var div = document.createElement("div");
		id = "truthDialog" + (dialogID);
		div.id = id;
		div.innerHTML = '<div id="truthTableDiv' + dialogID + '" class="ui-widget-content" style="position: relative;"></div>';
		document.body.appendChild(div);
		divName = "truthTableDiv" + dialogID;
		//div.setAttribute("title", "Truth Table");									// give it the associated title
		
		tableDiv = document.getElementById(divName);
	
		var rows = Math.pow(2, numIn);											// set number of rows
		var cols = numIn+numOut;												// set number of columns
		var body = tableDiv;
		//var body = document.getElementById('tableDiv');
		var tbl = document.createElement('table');								// create a table element
		tableName = "truthTable" + dialogID;
		tbl.id = tableName;														// set its ID
		tbl.style.maxWidth= 'none';
		tbl.style.position='absolute';	
		tbl.style.display = 'block'; // block is visible, none is invisible

		/*
		img = document.createElement('img');
		img.id = "tableDeleteIcon" + containerNum;
		img.src = "images/delete.ico";
		img.style.height = '20px';
		img.style.width = '29px';
		img.style.visibility = 'hidden';
		img.style.paddingLeft = "10px";
		img.style.marginTop = "-10px";
		body.appendChild(img);
		*/
			
		innerDiv = document.createElement("div");
		innerDiv.id = "innerDiv" + dialogID;
		innerDiv.style.position = "absolute";
		innerDiv.style.overflowY = "auto";
		//innerDiv.style.marginRight = "10px";
		
		if (numIn == 1) innerDiv.style.height = "70px";
		else if (numIn == 2) innerDiv.style.height = "120px";
		else if (numIn == 3) innerDiv.style.height = "200px";
		else innerDiv.style.height = "250px";
		body.appendChild(innerDiv);
		
		var tbdy = document.createElement('tbody');
		
		//set up table rows
		for (var i = 0; i < rows; i++) {
		var tr = document.createElement('tr');
			for (var j = 0; j < cols; j++) {
				var td = document.createElement('td');
				td.style.backgroundColor='rgba(255, 255, 255, 0.5)';
				td.className += " ttTD";
				td.style.border='2px';
				td.style.paddingLeft = "5px";
 				td.style.paddingRight = "5px";
				if(j===(cols-numOut)){
					td.style.borderLeft='2px solid blue';
				}
				td.appendChild(document.createTextNode('-1'));
				tr.appendChild(td);
			}
			tbdy.appendChild(tr);
		}
		tbl.appendChild(tbdy);
		innerDiv.appendChild(tbl);
		
		tableDiv.style.backgroundColor='rgba(255, 255, 255, 0.5)';
		
		var thead = document.createElement('thead');							// create element for header
		tbl.appendChild(thead);													// append head to table

		for(var k=0;k<header.length;k++){										// append elements to header
			var th = document.createElement('th');
			th.style.border='2px';
			th.className += " ttTD";
			th.style.backgroundColor='rgba(255, 255, 255, 0.5)';
			th.style.borderBottom='2px solid blue';
			th.style.paddingLeft = "5px";
 			th.style.paddingRight = "5px";
			if(k===(cols-numOut)){
				th.style.borderLeft='2px solid blue';
			}
			th.appendChild(document.createTextNode(header[k]));
			thead.appendChild(th);
		}
		tbl.style.borderSpacing = '0px';
		tbl.className += " truthTable";
		//initTableValues(rows, cols);
		setTable();
		//img.style.marginLeft = tbl.offsetWidth + "px";

		var tableWidth;
		if (numIn < 3) tableWidth = innerDiv.offsetWidth + 30;
		else if (numIn == 3) tableWidth = 130;
		else if (numIn == 4) tableWidth = 150;

		$( "#" + id ).dialog({ minWidth: 0, width: tableWidth, maxHeight: 250, modal: false, resizable: false });
		dialogID++;
	}
	
	function isOpen() {
		if ($( "#" + id ).dialog("isOpen") == true) return true;
		else return false;
	}
	
	function close() {
		if ($( "#" + id ).dialog("isOpen") == true) $( "#" + id ).dialog("close");
	}

	/*
	*	initTableValues()
	*
	*	Counts from 0 to numRows - 1 in binary, adding input values for table. All output values
	*	are zeros.
	*/
	function initTableValues(numRows, numCols) {
		var initTable = [];													// set up an array for the table
		for (var i = 0; i < numRows; i++) {									// iterate numRow times
			var num = i.toString(2);										// get the binary string representation of the current number
			var str = "";							
			var j;
			if (num.length != numIn) {										// we need zeros to fill in before the binary number begins; e.g. 101 would need to be 00101
				for (var j = 0; j < numIn - num.length; j++) str += "0";
			}
			str += num;
			var row = [];
			for (j = 0; j < numCols - numOut; j++) {
				row.push(str[j]);											// append each character to a cell
			}
			for (j = 0; j < numOut; j++) row.push("0");					// push a 0 for the output column
			initTable.push(row);											// push the row into the table
		}
		tableArray = initTable;
		setTable();												// set the table with these values
	}

	function setTableArray(values) {
		tableArray = values;
		
		//tableArray = initTable;
		if (isOpen()) setTable();												// set the table with these values
	}
	
	/*
	*	setTable()
	*
	*	Sets the truth table to the 2-D array passed to it.
	*/
	function setTable(){
		var rows = Math.pow(2, numIn);									// compute number of rows
		var cols = numIn+numOut;										// computer number of columns

		var myTable = document.getElementById(tableName);				// grab the table by ID
		for (var i = 0; i < rows; i++) {								// for all rows
			for (var j = 0; j < cols; j++) {							// for all columns
				//set table values
				myTable.rows[i].cells[j].innerHTML = tableArray[i][j];		// make the cell value equal to 2-D array value
				//set alignment
				myTable.rows[i].cells[j].align='center';				// center the text
			}
		}
		
		if (!innerDiv) return;
		
		//15,40
		innerDiv.style.overflowY = 'visible';
		innerDiv.style.width = (document.getElementById(tableName).offsetWidth + 5) + "px";
		innerDiv.style.height = (document.getElementById(tableName).offsetHeight) + "px";
		
		tableDiv.style.width = (document.getElementById(tableName).offsetWidth + 10) + "px";
		tableDiv.style.height = (document.getElementById(tableName).offsetHeight) + "px";
		tableDiv.style.marginLeft = "-10px";
	}
	
	function getTableWidth() { return tableDiv.offsetWidth; }
	
	function setTableOffset(x, y) {
		if (tableDiv !== null) {
			//tableDiv.style.left = x + "px";
			//tableDiv.style.top = -y + "px";
			//tableDiv.style.width=document.getElementById(tableName).offsetWidth + "px";
			//tableDiv.style.width = (document.getElementById(tableName).offsetWidth + 45) + "px";
		}
	}
	
	function setDeleteIcon(bool) {
		return;
		
		if (bool && tableDiv.style.visibility == 'visible') {
			var tHeight = tableDiv.style.offsetHeight;
			img = document.createElement('img');
			img.id = "tableDeleteIcon" + containerNum;
			img.src = "images/delete.ico";
			img.style.height = '20px';
			img.style.width = '20px';
			img.style.visibility = 'visible';
			img.style.marginTop = "-43px";
			tableDiv.appendChild(img);
			img.style.marginLeft = (document.getElementById(tableName).offsetWidth + 10) + "px";
			//tableDiv.style.height = 0;
		}
		else {
			try {
				var deleteIcon = document.getElementById("tableDeleteIcon" + containerNum);
				tableDiv.removeChild(deleteIcon);
			}
			catch(err) { }
			
			if (img) img.style.visibility = 'hidden';
		}
	}

	function toggleVisible(){
		return;
		
		if(tableDiv.style.visibility == 'hidden'){
			//tableDiv.style.display = 'block';
			tableDiv.style.visibility = 'visible';
			innerDiv.style.overflowY = "auto";
		}else{
			//tableDiv.style.display = 'none';
			tableDiv.style.visibility = 'hidden';
			innerDiv.style.overflowY = "hidden";
		}
	}
}