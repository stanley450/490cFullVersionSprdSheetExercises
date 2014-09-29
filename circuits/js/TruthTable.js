function TruthTable(container, figureNum) {
	var numOut;
	var visible = true;
	var rows;
	var cols;
	
	this.createTable = createTable;
	this.setTable = setTable;
	this.highlightRow = highlightRow;
	this.highlightFirstRow = highlightFirstRow;
	this.getTableWidth = getTableWidth;
	this.setTableOffset = setTableOffset;
	this.showTruthTable = showTruthTable;
	this.setTruthTableScale = setTruthTableScale;
	
	function createTable(numInputs, numOutputs, headerVals, flag) {
		if (!flag) {
			rows = Math.pow(2, numInputs); // set number of rows
			cols = numInputs + numOutputs; // set number of columns
		}
		else {
			rows = numInputs;
			cols = numInputs + numOutputs;
		}
		
		numOut = numOutputs;
		var body = document.getElementById(container).childNodes[0]; // grab the div element for the table
		var tbl = document.createElement('table'); // create a table element
		tbl.id = "table" + figureNum; // set its ID
		//tbl.border = '2'; // set border thickness
		tbl.style.borderCollapse='separate';
		tbl.style.borderSpacing="0";
		//tbl.style.width = "10%";
		//tbl.style.height = "10%";
		var tbdy = document.createElement('tbody');
		
		var tr = document.createElement('tr');
		for (var i = 0; i < headerVals.length; i++) {
			var td = document.createElement('td');
			td.innerHTML = "<b>" + headerVals[i] + "</b>";
			//td.style.fontSize = "10%";
			//td.width = "10%";
			//td.height = "10%";
			td.align = 'center'; // center the text
			
			//if (i != 0)	td.style.paddingLeft = "10%";
			//if (i != headerVals.length - 1) td.style.paddingRight = "10%";
			//td.style.paddingLeft = "5px";
			//td.style.paddingRight = "5px";
			
			if(i == (cols-numOutputs)){
				//left border
				td.style.borderLeft='1px solid black';
			}
			//bottom border
			td.style.borderBottom='1px solid black';
			tr.appendChild(td);
		}
		tbdy.appendChild(tr);
		
		//set up table rows
		for (var i = 0; i < rows; i++) {
			var tr = document.createElement('tr');
			for (var j = 0; j < cols; j++) {
				var td = document.createElement('td');
				td.appendChild(document.createTextNode('-1'));
				if (j == (cols - numOutputs)) td.style.borderLeft='1px solid black';
				
				//if (j != 0)	td.style.paddingLeft = "10%";
				//if (j != cols - 1) td.style.paddingRight = "10%";
				//td.style.paddingLeft = "5px";
				//td.style.paddingRight = "5px";
				
				//set alignment
				td.align = 'center'; // center the text
				//td.style.fontSize = "10%";
				//td.width = "10%";
				//td.height = "10%";
				
				tr.appendChild(td);

			}
			tbdy.appendChild(tr);
		}
		tbl.appendChild(tbdy);
		
		
		//body.appendChild(tbl);
		document.getElementById("topDiv-" + figureNum).appendChild(tbl);
		
		/*
		var thead = document.createElement('thead'); // create element for header
		//thead.style.border = 'none';
		//thead.style.borderCollapse='collapse';
		tbl.appendChild(thead); // append head to table
		for (var k = 0; k < headerVals.length; k++) { // append elements to header
			var th = document.createElement("th");
			th.style.border='2px';
			th.style.backgroundColor='#FFFFFF';
			// finding beginning of b
			if(k===(cols-numOutputs)){
				//left border
				th.style.borderLeft='2px solid black';
			}
			th.width = "10%";
			th.height = "10%";
			//bottom border
			th.style.borderBottom='2px solid black';
			//default
			var textNode = document.createTextNode(headerVals[k]);
			textNode.fontSize = "10%";
			th.appendChild(textNode);
			thead.appendChild(th);
		}
		*/
	}
	
	/*
	 *	setTable()
	 *
	 *	Sets the truth table to the 2-D array passed to it.
	 */
	function setTable(values) {
		if (visible == false) return;

		var myTable = document.getElementById("table" + figureNum); // grab the table by ID
		for (var i = 0; i < rows; i++) { // for all rows
			for (var j = 0; j < cols; j++) { // for all columns
				//set table values
				myTable.rows[i + 1].cells[j].innerHTML = values[i][j]; // make the cell value equal to 2-D array value
			}
		}
	}

	function highlightRow(row) {
		if (visible == false) return;
		var flag = true;
		var i;
		var myTable = document.getElementById("table" + figureNum);
		
		for (i = 1; i < rows + 1; i++) {
			for (var j = 0; j < cols; j++) {
				myTable.rows[i].cells[j].innerHTML = myTable.rows[i].cells[j].textContent;
			}
		}
		for (i = 1; i < rows + 1; i++) {
			flag = true;
			for (var j = 0; j < cols - numOut; j++) {
				myTable.rows[i].cells[j].innerHTML = myTable.rows[i].cells[j].textContent;
				if (myTable.rows[i].cells[j].innerHTML != row[j]) {
					flag = false;
				}
			}
			if (flag == true)
				break;
		}

		if (i == rows + 1) { return; }
		for (var j = 0; j < cols; j++) {
			myTable.rows[i].cells[j].innerHTML = "<font color = '#00FF00'>" + myTable.rows[i].cells[j].innerHTML + "</font>";
		}
	}

	function highlightFirstRow() {
		if (visible == false) return;
		
		var myTable = document.getElementById('table' + figureNum); // grab the table by ID
		for (var i = 0; i < cols; i++)
			myTable.rows[1].cells[i].innerHTML = "<font color = '#00FF00'>" + myTable.rows[1].cells[i].innerHTML + "</font>";
	}
	
	function getTableWidth() {
		var table = document.getElementById("table" + figureNum);
		if (table !== null) return table.offsetWidth;
	}
	
	function setTableOffset(num) {
		var table = document.getElementById("table" + figureNum);
		if (table !== null) table.style.marginLeft=num + "px";
	}
	
	function showTruthTable(bool) { visible = bool; }
	
	function setTruthTableScale(scale, horPadding, verPadding) {
		var table = document.getElementById("table" + figureNum);
		if (table === null) return;
		
		for (var i = 0; i < table.rows.length; i++) {
			for (var j = 0; j < table.rows[0].cells.length; j++) {
				var td = table.rows[i].cells[j];
				td.style.paddingLeft = horPadding + "px";
				td.style.paddingRight = horPadding + "px";
				td.style.paddingTop = verPadding + "px";
				td.style.paddingBottom = verPadding + "px";
				//td.style.fontSize = (scale + 15) + "%";
				td.style.fontSize = scale + "%";
				//td.width = scale + "%";
				//td.height = scale + "%";
			}
		}
	}
}
