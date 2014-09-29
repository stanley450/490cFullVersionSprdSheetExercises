/**********************************************************************************************
 * Authors: Mitchell Martin, James Miltenberger, Bidur Shrestha, Jonathan Teel, Neil Vosburg
 *
 * Entity: Watson Dialog Library (WatsonDialogs.js)
 *
 * This file contains the four components to the Watson Dialog Library: NumberPad, StringPad,
 * Selector, and Alert. Each component has one public method, open(), that has different
 * parameters depending on the component. Please refer to the Watson Dialog Library API document
 * for each component's functionalities and parameter specifications.
 **********************************************************************************************/

 /**********************************************
 * Class: NumberPad
 *
 * Consists of the decimal and hex number pad.
 ***********************************************/
 
function NumberPad() {
	this.open = open;						// declare the one public function: open()
	
	var thisID = NumberPad.nextDialogID;	// static field nextDialogID is this object's ID
	NumberPad.nextDialogID++;				// increase the static field nextDialogID's value for next dialog to be created
	var callback;							// a variable to hold the callback function for when "Enter" is pressed
	
	var minValue;							// the minimum value associated with this dialog
	var maxValue;							// the maximum value associated with this dialog
	var decimalAllowed;						// boolean value
	var base;								// 10 or 16
	
	var handled = false;
	
	// dialogHTML holds the HTML that populates the dialog's div
	var dialogHTML =
		 '<div id="numpadInstructDiv' + thisID + '">\
		 <font size="2">Insert some numbers.</font>\
		 </div>\
		 <input id="numpadInput' + thisID + '" class="NumpadInputBox" readonly></input>\
		 <table id="outerTable">\
			<tr>\
			<td><table id="numpadTable' + thisID + '"></table></td>\
			<td><table id="numpadFuncTable' + thisID + '"></table></td>\
			</tr>\
		</table>';
	 
	 /*
	 *	open()
	 *
	 *	Opens the decimal pad or the hex pad depending on the value of the base
	 */
	function open(_minValue, _maxValue, title, instruction, _decimalAllowed, _base, _callbackFunc, div) {
		base = _base;
		if (base == 10) openNumpad(_minValue, _maxValue, title, instruction, _decimalAllowed, _callbackFunc, div);	// open decimal pad
		else if (base == 16) openHexpad(_minValue, _maxValue, title, instruction, _callbackFunc, div);				// open hex pad
		else alert("Unsupported base.");																		// otherwise, not supported
	}
	
	/*
	*	openNumpad()
	*
	*	Opens the decimal pad
	*/
	function openNumpad(_minValue, _maxValue, title, instruction, _decimalAllowed, callbackFunc, div) {
		minValue = _minValue;
		maxValue = _maxValue;
		if (minValue !== null && maxValue !== null) {							// If both values are not null, check to make sure min isn't greater than max
			if (_minValue >= _maxValue) {
				alert("Error: Minimum value is greater than maximum value.");
				return;
			}
		}
		/*
		if (boundsCheck(0) == false) {											// If 0 isn't within bounds, throw an error, because this doesn't make sense
			alert("Error: Zero must be included within these bounds.");
			return;
		}
		*/
		callback = callbackFunc;															// assign callback variable

		var dialogDiv = document.createElement("div");										// dynamically create div for the dialog
		dialogDiv.id = "numpadDialog" + thisID;												// assign unique ID for this dialog
		dialogDiv.setAttribute("title", title);												// set the title accordingly
		dialogDiv.innerHTML = dialogHTML;													// sets the innerHTML for the dialog
		document.body.appendChild(dialogDiv);												// add the dialog to the document
		
		var input = document.getElementById("numpadInput" + thisID);						// grab the input box for the numpad
		//input.value = 0;																	// make it hold 0
			
		decimalAllowed = _decimalAllowed;
		
		var instructDiv = document.getElementById("numpadInstructDiv" + thisID);			// get the div that holds the instruction
		if (instruction == null) instructDiv.innerHTML = "";								// if instruction is null, give it the empty string
		else instructDiv.innerHTML = '<font size="2">' + instruction + '</font>';			// otherwise, assign it the instruction given by parameter		
		
		var centerAt = (div ? div : window);
		$( "#numpadDialog" + thisID ).dialog({ width: "295px", modal: true, resizable: false, position: { my: "center", at: "center", of: centerAt } });			// open the dialog
		
		var numpadTable = document.getElementById("numpadTable" + thisID);					// get the table that holds the dialog's keys
		
		/* Number Key Population */
		
		var row;
		var vals = [ [ "7", "8", "9" ], [ "4", "5", "6" ], [ "1", "2", "3", ], [ "-", "0", "." ] ];

		for (var i = 0; i < 4; i++) {																				// four rows to iterate through
			row = numpadTable.insertRow(i);																			// always insert after the last row
			for (var j = 0; j < 3; j++) {																			// 3 columns to iterate through
				cell = row.insertCell(j);																			// always insert after the last cell
				
				var id;																								// id for this particular button
				if (vals[i][j] == ".") id = "numPadNumButtonDecimal" + thisID;										// we have to treat the decimal special (can't have '.' in ID)
				else id = "numpadNumButton" + thisID + "-" + vals[i][j];											// standard ID format
				
				cell.innerHTML = "<button id='" + id + "' class='NumpadNumButton'>" + vals[i][j] + "</button>";		// populate inner HTML of cell with button
				$( "#" + id ).button();																				// this function makes jQuery make the button look pretty
				addNumpadButtonEventListener(id, vals[i][j]);														// add the listener for this button
			}
		}
		
		/* Function Key Population */
		
		var funcTable = document.getElementById("numpadFuncTable" + thisID);										// function keys are actually within a table
		var button;
		var buttonIDs = [ "numpadNumButtonEnter", "numpadNumButtonClear", "numpadNumButtonCancel" ];
		
		for (var i = 0; i < 3; i++) {																				// iterate three times for three buttons
			cell = funcTable.insertRow(i).insertCell();																// insert cell for each button
			cell.innerHTML = "<button id='" + buttonIDs[i] + thisID + "' class='WatsonLibraryFuncButton'>" + buttonIDs[i].slice(15) + "</button>";	// populate innerHTML of cell with button
			button = document.getElementById(buttonIDs[i] + thisID);
			
			if (i == 0) addEnterButtonEventListener(buttonIDs[i] + thisID);			// if i == 0, add enter button listener
			else if (i == 1) addClearButtonEventListener(buttonIDs[i] + thisID);	// if i == 1, add clear button listener
			else addCancelButtonEventListener(buttonIDs[i] + thisID);				// if i == 2, add cancel button listener
			
			$( "#" + buttonIDs[i] + thisID).button();								// make the button look pretty
		}
		
		window.onkeypress = function(e) { decimalKeyPressed(e); };					// for numkey listeners
		window.onkeydown = function(e) { backspaceDown(e); };						// for backspace (must be under 'keydown' event rather than 'keypress'
		
		$( "#numpadInput" + thisID).focus();										// to make smart phones focus on the input box
	}
	
	/*
	*	openHexpad()
	*
	*	This function opens the hex pad. Shocking, right?
	*	It works very similarly to the decimal pad.
	*/
	function openHexpad(_minValue, _maxValue, title, instruction, callbackFunc, div) {
		minValue = _minValue;
		maxValue = _maxValue;
		if (minValue !== null && maxValue !== null) {							// if both values aren't null, check to make sure min value is less than max value
			if (_minValue >= _maxValue) {
				alert("Error: Minimum value is greater than maximum value.");
				return;
			}
		}

		callback = callbackFunc;
		
		var dialogDiv = document.createElement("div");							// dynamically create div for the dialog window
		dialogDiv.id = "numpadDialog" + thisID;									// assign it unique ID
		dialogDiv.setAttribute("title", title);									// give it the associated title
		dialogDiv.innerHTML = dialogHTML;										// fill its inner HTML
		document.body.appendChild(dialogDiv);									// append the dialog to the body of the document
		
		var input = document.getElementById("numpadInput" + thisID);			// make '0' appear in the input box
		//input.value = 0;
		
		var instructDiv = document.getElementById("numpadInstructDiv" + thisID);	// if there is an instruction, set it in the instruction div
		if (instruction == null) instructDiv.innerHTML = "";
		else instructDiv.innerHTML = '<font size="2">' + instruction + '</font>';
		
		var hexpadTable = document.getElementById("numpadTable" + thisID);			// the buttons are in a table
		
		var centerAt = (div ? div : window);
		$( "#numpadDialog" + thisID ).dialog({width: "295px", modal: true, resizable: false, position: { my: "center", at: "center", of: centerAt } });	// open the dialog
		
		var row;
		var iters = [ 3, 3, 3, 3, 3, 2 ];	// this array tells the for loop how many iterations to loop through
		var vals = [ [ "D", "E", "F" ], [ "A", "B", "C" ], [ "7", "8", "9", ], ["4", "5", "6"], ["1", "2", "3" ], [ "S", "0" ] ];	// the buttons to be placed on the dialog
		
		for (var i = 0; i < 6; i++) {																				// 6 rows to loop through
			row = hexpadTable.insertRow(i);																			// always insert the row after the last one
			for (var j = 0; j < iters[i]; j++) {																	// iters[i] buttons to add to this row
				cell = row.insertCell(j);																			// always add cell after the last one
				var id = "numpadNumButton" + thisID + "-" + vals[i][j];												// standard UNIQUE button format
				cell.innerHTML = "<button id='" + id + "' class='NumpadNumButton'>" + vals[i][j] + "</button>";		// populate cell's innher HTML with button
				if (id == "numpadNumButton" + thisID + "-S") {														// the 'S' button is nothing but a place holder; we hide it
					document.getElementById("numpadNumButton" + thisID + "-S").style.visibility = "hidden";			// this makes the '0' appear in the middle column
				}
				else $( "#" + id ).button();																		// make the button look pretty
				addHexpadButtonEventListener(id, vals[i][j]);														// add the event listener to the button
			}
		}
		
		var funcTable = document.getElementById("numpadFuncTable" + thisID);										// all the function buttons are in a table
		var button;
		var buttonIDs = [ "numpadNumButtonEnter", "numpadNumButtonClear", "numpadNumButtonCancel" ];				// the function button IDs
		
		for (var i = 0; i < 3; i++) {												// 3 buttons to add
			cell = funcTable.insertRow(i).insertCell();								// always insert a row after the last one; one cell per row
			cell.innerHTML = "<button id='" + buttonIDs[i] + thisID + "' class='WatsonLibraryFuncButton'>" + buttonIDs[i].slice(15) + "</button>";	// innher HTML of button
			button = document.getElementById(buttonIDs[i] + thisID);		
			
			if (i == 0) addEnterButtonEventListener(buttonIDs[i] + thisID);			// if on iteration 0, it's the enter button; add its listener
			else if (i == 1) addClearButtonEventListener(buttonIDs[i] + thisID);	// if on iteration 1, it's the clear button; add its listener
			else { addCancelButtonEventListener(buttonIDs[i] + thisID); button.style.marginBottom = "100px"; }	// else, it's the cancel button; add it's listener
			
			$( "#" + buttonIDs[i] + thisID).button();								// make the button pretty
		}
		
		window.onkeypress = function(e) { hexKeyPressed(e); };						// for num key listeners
		window.onkeydown = function(e) { backspaceDown(e); };						// for backpace pressed (must be on the keydown event rather than keypress)
		
		$( "#numpadInput" + thisID).focus();										// to make smartphones focus on text box
	}
	
	/*
	*	addNumpadButtonEventListener()
	*
	*	The function to set up the num key listeners for decimal numpad
	*/
	function addNumpadButtonEventListener(buttonID, value) {
		var button = document.getElementById(buttonID);
		
		// make it so that mobile users have a "selected" state for the button (highlighted blue)
		$("#" + buttonID).on("touchstart", function(event) {	// on touch start
			$("#" + buttonID).focus();							// make it highlighted
			event.preventDefault();								// prevent any default actions
		});
		
		// make it so that mobile users don't have a selected button after that click a button
		$("#" + buttonID).on("touchend", function(event) {
			numberKeyClick(value);			// register number click
			handled = true;					// the touchend will fire faster than 'click' so we must set handled to true so that click won't be called
			$( "#" + buttonID).blur();		// make it so that the button doesn't stay focused
			event.preventDefault();			// prevent any default actions
		});
		
		$("#" + buttonID).on("click", function(event) {
			if (handled == true) { handled = false; event.preventDefault(); return; }	// if it has already been handled, return
			numberKeyClick(value);			// call function that will populate input box with number pressed
			$( "#" + buttonID).blur();		// unfocus the button pressed
		});
		
	}
	
	/*
	*	numberKeyClick()
	*
	*	This function is called upon every decimal numpad click: 0 - 9 , . , -
	*/
	function numberKeyClick(value) {
		var input = document.getElementById("numpadInput" + thisID);
		
		if (value == "-") {							// if it's a negative sign that was pressed (toggle it)
			if (input.value == '0') return;			// if we only have a 0 in the input box, it wouldn't make sense to have -0, return
			if (input.value == "") return;
			
			if (input.value.charAt(0) != '-') {		// if there isn't already a negative sign at the beginning of the number, put one there
				var temp = input.value;
				if (boundsCheck("-" + temp) == true) input.value = "-" + temp;
			}
			else {									// otherwise, take it away
				var temp = input.value.slice(1);
				if (boundsCheck(temp) == true) input.value = input.value.slice(1);
			}
		}
		else if (value == ".") {					// if it's a decimal that was clicked (.)
			if (input.value.indexOf(".") < 0 && decimalAllowed == true) input.value += value;	// if there isn't already a decimal, and they are allowed, add it
			if (input.value == "" && decimalAllowed == true) input.value += "0." + value;
		}
		else {										// it must be just a number, tack it on to the end, but check bounds first
			if (boundsCheck(input.value + value) == true) {
				if (input.value == "0" && value == "0") return; //input.value += value; //input.value = value;	// if just a '0' in the input box, overwrite it
				
				if (input.value == "0") input.value = value;
				else input.value += value;
			}
		}
	}
	
	/*
	*	addHexpadButtonEventListener()
	*
	*	This function sets up the event listener for each hexpad numkey click.
	*/
	function addHexpadButtonEventListener(buttonID, value) {
		var button = document.getElementById(buttonID);
		
		// make it so that mobile users see a focused button when they touch a button
		$("#" + buttonID).on("touchstart", function(event) {
			$("#" + buttonID).focus();	// focus it (make it highlighted blue)
			event.preventDefault();
		});
		
		// make it so that mobile users don't have a focused button after a touch
		$("#" + buttonID).on("touchend", function(event) {
			hexKeyClick(value);			// register click
			handled = true;				// touch end fires faster that click, so we set handled to true
			$( "#" + buttonID).blur();	// un-focus the button
			event.preventDefault();
		});
		
		$("#" + buttonID).on("click", function(event) {
			if (handled == true) { handled = false; event.preventDefault(); return; }	// if its handled already, return
			hexKeyClick(value);				// call the function that adds the number to the input box
			$( "#" + buttonID).blur();		// blur the button
		});
	}
	
	/*
	*	hexKeyClick()
	*
	*	Called every time a hexpad numkey is clicked.
	*/
	function hexKeyClick(value) {
		var input = document.getElementById("numpadInput" + thisID);
		
		if (boundsCheck(input.value + value) == true) {		// if its within bounds, add it
			if (input.value == "0") input.value = value;	// if only a zero is in the input box, overwrite it
			else input.value += value;
		}
	}
	
	/*
	*	addEnterButtonEventListener()
	*
	*	This function sets up the event listener for when the "Enter" button is clicked.
	*	It simply calls the callback function with the value in the input box.
	*/
	function addEnterButtonEventListener(buttonID) {
		var button = document.getElementById(buttonID);
		
		$("#" + buttonID).on("touchstart", function(event) {
			$("#" + buttonID).focus();
			event.preventDefault();
		});
		
		$("#" + buttonID).on("touchend", function(event) {
			enterFunc();
			handled = true;
			$( "#" + buttonID).blur();
			event.preventDefault();
		});
		
		$("#" + buttonID).on("click", function(event) {
			if (handled == true) { handled = false; event.preventDefault(); return; }
			enterFunc();				// call the function that adds the number to the input box
			$( "#" + buttonID).blur();		// blur the button
		});
	}
	
	function enterFunc() {
		var input = document.getElementById("numpadInput" + thisID);
		if (input.value == "") callback(null);
		else callback(input.value);								// call the callback function (specified by the user in the open() function call) with the input box value
		$( "#numpadDialog" + thisID).dialog('close');		// close the dialog
		window.onkeypress = null;
		window.onkeydown = null;
	}
	
	/*
	*	addClearButtonEventListener()
	*
	*	This function sets up the event listener for when the "Clear" buton is clicked.
	*	It simply puts a '0' in the input box.
	*/
	function addClearButtonEventListener(buttonID) {
		var button = document.getElementById(buttonID);
		
		$("#" + buttonID).on("touchstart", function(event) {
			$("#" + buttonID).focus();
			event.preventDefault();
		});
		
		$("#" + buttonID).on("touchend", function(event) {
			var input = document.getElementById("numpadInput" + thisID);
			input.value = "";				// simply set the input box value to '0'			
			$( "#" + buttonID).blur();
			
			handled = true;
			$( "#" + buttonID).blur();
			event.preventDefault();
		});
		
		$("#" + buttonID).on("click", function(event) {
			if (handled == true) { handled = false; event.preventDefault(); return; }
			var input = document.getElementById("numpadInput" + thisID);
			input.value = "";				// simply set the input box value to '0'			
			$( "#" + buttonID).blur();		// blur the button
		});
	}
	
	/*
	*	addCancelButtonEventListener()
	*
	*	This function sets up the event listener for when the "Cancel" button is clicked.
	*	It simply closes the dialog and calls the callback function with null.
	*/
	function addCancelButtonEventListener(buttonID) {
		var button = document.getElementById(buttonID);
		
		$("#" + buttonID).on("touchstart", function(event) {
			$("#" + buttonID).focus();
			event.preventDefault();
		});
		
		$("#" + buttonID).on("touchend", function(event) {
			clearFunc();
			
			handled = true;
			$( "#" + buttonID).blur();
			event.preventDefault();
		});
		
		$("#" + buttonID).on("click", function(event) {
			if (handled == true) { handled = false; event.preventDefault(); return; }
			clearFunc();		
			$( "#" + buttonID).blur();		// blur the button
		});
		
		button.addEventListener("click", function() {
			
		});
	}
	
	function clearFunc() {
		$( "#numpadDialog" + thisID).dialog('close');	// close the dialog
		callback(null);									// call the callback function (specified by the user in the open() function call) with null
		window.onkeypress = null;
		window.onkeydown = null;
	}
	
	/*
	*	boundsCheck()
	*
	*	This function checks to make sure the number passed to it is within the bounds
	*	that was specified by the user on the open() function call.
	*
	*	Returns true if the number is within bounds; false if not
	*/
	function boundsCheck(value) {
		if (base == 10)	value = parseFloat(value);						// value is a string, if in base 10, parseFloat() it
		else value = parseInt(value, 16);								// value is a string, if in base 16, parseInt() it with 16 as parameter (converts to base 10)
		
		if (minValue === null && maxValue === null) return true;		// if both min and max is null, there is no limit, simple return true
		else if (minValue !== null && maxValue !== null) {				// if both of the values aren't null, check both bounds
			if (value <= maxValue && value >= minValue) return true;
		}
		else if (minValue === null && maxValue !== null) {				// if only the min is null, then there is no lower bound; check the upper bound
			if (value <= maxValue) return true;
		}
		else if (minValue !== null && maxValue === null) {				// if only the max is null, then there is no upper bound; check the lower bound
			if (value >= minValue) return true;
		}
		
		return false;	// if we made it here, the number isn't valid; return false
	}
	
	/*
	*	backspaceDown()
	*
	*	This function gets called when the user presses any key when the decimal pad or hexpad is open. It only reacts when the user 
	*	presses the backspace when the dialog is open.
	*/
	function backspaceDown(event) {
		var code = event.keyCode || event.which;	// get the key code
		
		if (code == 8) {							// key code is 8 for backspace
			event.preventDefault();					// prevent the default action (back navigate in most browsers)
			var input = document.getElementById("numpadInput" + thisID);
			if (input.value != "0")	input.value = input.value.slice(0, input.value.length - 1);	// if the input value does not equal '0', take the last digit away
			
			//if (input.value.length == 0) input.value = 0;	// if the length is now 0, put a '0' in the input box
			if (input.value == "-") input.value = "";	// if we are only left with a negative sign (-), place a '0' in the input box (happens when you delete a negative number all the way)
		}
	}
	
	/*
	*	decimalKeyPressed()
	*
	*	This function is called when the user presses any key when the decimal pad is open. It only reacts when the user
	* 	presses the decimal key on his/her keyboard.
	*/
	function decimalKeyPressed(event) {
		var code = event.keyCode || event.which;		// get the key code
	
		if (code == 13) {								// if the code is 13, the "Enter" key was pressed
			var input = document.getElementById("numpadInput" + thisID);
			callback(input.value);						// call the callback with the input box value
			$( "#numpadDialog" + thisID).dialog('close');	// close the dialog
			window.onkeypress = null;
			window.onkeydown = null;
		}
		else if (code == 45) numberKeyClick("-");						// if the code is 45, it's the negative sign; call the numberKeyClick function with '-'
		else if (code == 46) numberKeyClick(".");						// if the code is 46, it's the decimal; call the numberKeyClick function with '.'
		else if (code >= 48 && code <= 57) numberKeyClick(code - 48);	// if the code is 48-57, it is a digit; call the numberKeyClick with (code - 48) (converts it to the digit)
	}
	
	/*
	*	hexKeyPressed()
	*
	*	This function is called when the user presses any key when the hexpad is open. It only reacts when the user
	*	presses a hex digit (0-9, A - F, a - f). It works for both lowercase and upper case.
	*/
	function hexKeyPressed(event) {
		var code = event.keyCode || event.which;			// grab the key code
		
		if (code == 13) {									// 13 is enter
			var input = document.getElementById("numpadInput" + thisID);
			callback(input.value);							// call the callback function with the input box value
			$( "#numpadDialog" + thisID).dialog('close');	// close the dialog
			window.onkeypress = null;
			window.onkeydown = null;
		}
		else if (code >= 97 && code <= 102) hexKeyClick(String.fromCharCode(code-32));	// if its 97 - 102, it's the lower case a - f; convert it to its upper case ASCII character representation (subtract 32)
		else if (code >= 65 && code <= 70) hexKeyClick(String.fromCharCode(code));		// if its 65 - 70, it's the upper case A - F; convert it to its ASCII character representation
		else if (code >= 48 && code <= 57) numberKeyClick(code-48);						// if its 48 - 57, it's a 0 - 9; convert it to its ASCII representation by subtracting 48
	}
}

 /**********************************************
 * Class: StringPad
 *
 * Consists of a dialog to provide a method for
 * users to insert strings.
 ***********************************************/
function StringPad() {
	this.open = open;						// the only public method to open the string pad
	
	var thisID = StringPad.nextDialogID;	// grab the next ID which no other string pad will have
	StringPad.nextDialogID++;				// increase the value of this static variable
	var callback;							// a variable to hold the call back function (given by user in open function call)
	
	// the inner HTML to populate the dialog div
	var dialogHTML =
		'<table id="selectorTable">\
		<tr>\
		<td>\
		<div id="stringPadInstructDiv' + thisID + '"></div>\
		<input id="stringInput' + thisID + '" style="width:270px"></select>\
		</td>\
		<td>\
		<table id="innerTable">\
		<tr>\
		<td><button id="stringPadOkay' + thisID + '" class="WatsonLibraryFuncButton">Okay</button></td>\
		</tr>\
		<tr>\
		<td><button id="stringPadClear' + thisID + '" class="WatsonLibraryFuncButton">Clear</button></td>\
		</tr>\
		<tr>\
		<td><button id="stringPadCancel' + thisID + '" class="WatsonLibraryFuncButton">Cancel</button></td>\
		</tr>\
		</table>\
		</td>\
		</table>';
	
	/*
	 * open()
	 *
	 * This function sets up this string pad and opens it for the user to see.
	 */
	function open(title, instruction, _callback, div) {
		var dialogDiv = document.createElement("div");	// dynamically create a div for the dialog
		dialogDiv.id = "stringPadDialog" + thisID;		// give it a unique ID
		dialogDiv.setAttribute("title", title);			// give it the associated title
		dialogDiv.innerHTML = dialogHTML;				// populate it with the inner HTML
		document.body.appendChild(dialogDiv);			// append it to the document's body
		callback = _callback;
		
		var instructDiv = document.getElementById("stringPadInstructDiv" + thisID);	// grab the div that holds the instruction
		if (instruction == null) instructDiv.innerHTML = "";						// if the instruction is null, get rid of any text
		else instructDiv.innerHTML = '<font size="2">' + instruction + '</font>';	// if the instruction isn't null, populate it
	
		var centerAt = (div ? div : window);
		$( "#stringPadDialog" + thisID ).dialog({width: "400px", modal: true, resizable: false, position: { my: "center", at: "center", of: centerAt } });	// open the dialog

		var input = document.getElementById("stringInput" + thisID);
		var button;
		
		/* Assign the Okay, Clear, and Cancel button's event listeners */
		
		// the okay button closes the dialog and calls the callback function specified by the user with the input value currently entered in the input box
		button = document.getElementById("stringPadOkay" + thisID);
		button.addEventListener("click", function() { $( "#stringPadDialog" + thisID).dialog('close'); callback(input.value); window.onkeypress = null; });
		$( "#stringPadOkay" + thisID).button();		// make the button pretty
	
		// the clear button clears the input box
		button = document.getElementById("stringPadClear" + thisID);
		button.addEventListener("click", function() { input.value = ""; });
		$( "#stringPadClear" + thisID).button();	// make the button pretty
		
		// the cancel button closes the dialog and calls the call back function with null as its parameter
		button = document.getElementById("stringPadCancel" + thisID);
		button.addEventListener("click", function() { $( "#stringPadDialog" + thisID).dialog('close'); callback(null); window.onkeypress = null; });
		$( "#stringPadCancel" + thisID).button();	// make the button pretty
	
		window.onkeypress = function(e) { keyPress(e); };
	}
	
	function keyPress(e) {
		var code = event.keyCode || event.which;
		if (code == 13) {
			var input = document.getElementById("stringInput" + thisID);
			$( "#stringPadDialog" + thisID).dialog('close');
			callback(input.value);
			window.onkeypress = null;
		}
	}
}

 /**********************************************
 * Class: Selector
 *
 * Consists of a dialog to provide a method for
 * users to insert strings.
 ***********************************************/
function Selector() {
	this.open = open;						// the only public function to open the dialog

	var thisID = Selector.nextDialogID;		// grab the next unique ID
	Selector.nextDialogID++;				// increase the value of this static variable
	var callback;							// a variable to hold the call back function given by user in open function
	
	var selectedItem = null;
	
	/*
	// the inner HTML to populate the dialog's div
	var dialogHTML =
		'<table id="selectorTable">\
		<tr>\
		<td><select id="selector' + thisID + '" size="5" style="width:200px;"></select></td>\
		<td>\
		<table id="innerTable">\
		<tr>\
		<td><button id="selectorOkay' + thisID + '" class="WatsonLibraryFuncButton">Okay</button></td>\
		</tr>\
		<tr>\
		<td><button id="selectorCancel' + thisID + '" class="WatsonLibraryFuncButton">Cancel</button></td>\
		</tr>\
		</table>\
		</td>\
		</table>';
	*/
	
	var dialogHTML =
		'<table id="selectorTable">\
		<tr>\
		<td style="width:200px;"><ol id="selector' + thisID + '" class="WatsonSelector" style="overflow-y: scroll; height: 100px;"> </ol></td>\
		<td>\
		<table id="innerTable">\
		<tr>\
		<td><button id="selectorOkay' + thisID + '" class="WatsonLibraryFuncButton">Okay</button></td>\
		</tr>\
		<tr>\
		<td><button id="selectorCancel' + thisID + '" class="WatsonLibraryFuncButton">Cancel</button></td>\
		</tr>\
		</table>\
		</td>\
		</table>';
		
	/*
	 *	open()
	 *
	 *	Opens the selector
	 */
	function open(title, options, _callback, div) {
		var dialogDiv = document.createElement("div");	// dynamically create div for the dialog
		dialogDiv.id = "selectorDialog" + thisID;		// give the div a unique id
		dialogDiv.setAttribute("title", title);			// set the title accordingly
		dialogDiv.innerHTML = dialogHTML;				// set the inner HTML of this div
		document.body.appendChild(dialogDiv);			// append the div to the body
		callback = _callback;
		
		var centerAt = (div ? div : window);
		$( "#selectorDialog" + thisID ).dialog({width: "325px", modal: true, resizable: false, position: { my: "center", at: "center", of: centerAt } });	// opens the dialog
		
		var select = document.getElementById("selector" + thisID);
		
		/* Dynamically make options and populate the select object with these options 
		var len = options.length;
		for (var i = 0; i < len; i++) {
			var option = document.createElement("option");	// create a new option object
			option.text = options[i];						// give the option the associated text
			select.add(option);								// add it to the selector
		}
		select.selectedIndex = 0;
		*/
		
		var len = options.length;
		for (var i = 0; i < len; i++) {
			var newNumberListItem = document.createElement("li");
			newNumberListItem.ondblclick = function() {
				OkayButton();
			}
			newNumberListItem.className += " ui-widget-content";
            var numberListValue = document.createTextNode(options[i]);
            newNumberListItem.appendChild(numberListValue);
            select.appendChild(newNumberListItem);
		}
		$( "#selector" + thisID).selectable({
			selected: function(event, ui) {
				selectedItem = ui.selected.textContent;
			}
		});
		
		/* Assign button listeners to Okay and Cancel buttons */
		
		var button;
		
		// Okay button closes the dialog and calls the call back function with the selected option as its parameter
		button = document.getElementById("selectorOkay" + thisID);
		button.addEventListener("click", OkayButton);
		$( "#selectorOkay" + thisID).button();		// make the button pretty
		
		// Cancel button closes the dialog and calls the call back function with null as its parameter
		button = document.getElementById("selectorCancel" + thisID);
		button.addEventListener("click", function() { $( "#selectorDialog" + thisID).dialog('close'); callback(null); });
		$( "#selectorCancel" + thisID).button();	// make the button pretty
	}
	
	function OkayButton() {
		$( "#selectorDialog" + thisID).dialog('close');
		callback(selectedItem);
	}
}

 /**********************************************
 * Class: Alert
 *
 * Consists of a dialog to display an alert message.
 ***********************************************/
function Alert() {
	this.open = open;					// the only public method to open the alert box
	
	var thisID = Alert.nextDialogID;	// give this alert a unique ID
	Alert.nextDialogID++;				// increment this static ID for next alert dialog
	var callback;						// call back function given by open function call
	
	// this inner HTML code is for a simple alert dialog box with only an "Okay" button
	var dialogHTML1 =
		 '<div id="alertInstructDiv' + thisID + '">\
		 <font size="2">Insert some numbers.</font>\
		 </div>\
		 <table>\
		 <tr>\
		 <td><button id="alertOKButton' + thisID + '" class="WatsonLibraryFuncButton">Okay</button></td>\
		 </tr>\
		 <table>';
		 
	// this inner HTML code is for an alert dialog box with two buttons: "Proceed" and "Cancel"
	var dialogHTML2 =
		 '<div id="alertInstructDiv' + thisID + '">\
		 <font size="2">Insert some numbers.</font>\
		 </div>\
		 <table>\
		 <tr>\
		 <td><button id="alertProceedButton' + thisID + '" class="AlertFuncButton">Proceed</button></td>\
		 <td><button id="alertCancelButton' + thisID + '" class="AlertFuncButton">Cancel</button></td>\
		 </tr>\
		 <table>';
	
	/*
	 * open()
	 *
	 * Opens the alert dialog
	 */
	function open(title, instruction, bool, _callback, div) {
		callback = _callback;								// store the call back function
		
		var dialogDiv = document.createElement("div");		// dynamically create dialog div
		dialogDiv.id = "alertDialog" + thisID;				// give this div a unique ID
		dialogDiv.setAttribute("title", title);				// give it the associated title
		if (bool) {											// if bool is true, its a simple alert dialog box; otherwise, its an alert dialog with  "Proceed" and "Cancel"
			dialogDiv.innerHTML = dialogHTML1;
		}
		else {
			dialogDiv.innerHTML = dialogHTML2;
		}
		document.body.appendChild(dialogDiv);				// append this to the document

		var instructDiv = document.getElementById("alertInstructDiv" + thisID);
		instructDiv.innerHTML = '<font size="2">' + instruction + '</font>';		// set the instruction div to the message
		
		var centerAt = (div ? div : window);
		$( "#alertDialog" + thisID ).dialog({width: "295px", modal: true, resizable: false, position: { my: "center", at: "center", of: centerAt } }); // open the alert dialog
		
		if (bool) {
			var okButton = document.getElementById("alertOKButton" + thisID);
			if (instruction.length < 30) okButton.style.marginTop = "30px";		// if this is a message < 30 chars, give a margin of 30 pixels (weird default padding with short messages)
			else okButton.style.marginTop = "10px";								// if its longer, give a margin of 10 pixels
			okButton.style.marginLeft = "85px";									// 85 pixels is centered in the dialog box ( or close enough to center for the girls I go with ;) )
			okButtonEventListener("alertOKButton" + thisID);					// add event listener
			$( "#alertOKButton" + thisID).button();								// make it pretty
		}
		else {
			var proceedButton = document.getElementById("alertProceedButton" + thisID);
			if (instruction.length < 50) proceedButton.style.marginTop = "30px";	// same deal here as in the IF section
			else proceedButton.style.marginTop = "10px";
			
			proceedButton.style.marginLeft = "25px";
			proceedButtonEventListener("alertProceedButton" + thisID);
			$( "#alertProceedButton" + thisID).button();							// make the button pretty
			
			var cancelButton = document.getElementById("alertCancelButton" + thisID);
			if (instruction.length < 50) cancelButton.style.marginTop = "30px";		// same deal here as before
			else cancelButton.style.marginTop = "10px";
			cancelButtonEventListener("alertCancelButton" + thisID);
			$( "#alertCancelButton" + thisID).button();								// make the button pretty
		}
	}
	
	/*
	 * okButtonEventListener()
	 *
	 * Sets up the event listener for the OK button.
	 * OK button always closes the dialog and calls callback with null
	 */
	function okButtonEventListener(id) {
		var button = document.getElementById(id);
		button.addEventListener("click", function() {
			$("#alertDialog" + thisID).dialog('close');	// close the dialog
			callback(null);								// always returns null
		});
	}
	
	/*
	 * proceedButtonEventListener()
	 *
	 * Sets up the event listener for the proceed button
	 * Proceed always closes dialog box and calls callback with true
	 */
	function proceedButtonEventListener(id) {
		var button = document.getElementById(id);
		button.addEventListener("click", function() {
			$("#alertDialog" + thisID).dialog('close');
			callback(true);
		});
	}
	
	/*
	* cancelButtonEventListener
	*
	* Sets up the event listener for the cancel button
	* Cancel always closes the dialog box and calls callback with false
	*/
	function cancelButtonEventListener(id) {
		var button = document.getElementById(id);
		button.addEventListener("click", function() {
			$("#alertDialog" + thisID).dialog('close');
			callback(false);
		});
	}
}

/*
 * Each class as a static 'nextDialogID'. Each time a dialog is created, the next dialog ID for that particular
 * class is used, and then incremented. This ID is appended to all the HTML object's IDs within the class
 * so that each HTML object has a unique ID. We declare them and initialize them to 0 here.
 */
NumberPad.nextDialogID = 0;
StringPad.nextDialogID = 0;
Selector.nextDialogID = 0;
Alert.nextDialogID = 0;