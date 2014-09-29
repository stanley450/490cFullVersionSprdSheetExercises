/**************************************************************************************
*	Author:		Neil Vosburg
*	Class:		Controller.js
*	Date:		12/15/2013
*
*	Behavior:	This class is the main controller for the digital circuit creation. It
*				is responsible for drawing lines between connected components (the lines
*				are stored in the objects after drawing, however), setting connections
*				between components, handling mouse click events, etc. When a new component
*				is created, the new component is registered with the controller via
*				registerComponent(). A component (abbreviated 'comp') is considered to be
*				either a NOT gate, OR gate, AND gate, and a connector. A gate is considered
*				to be a NOT gate, OR gate, and an AND gate. A connector is not considered
*				a gate.
*
*				NOTES:
*				Output Wires: 	Output wires are lines that connect connected components. They
*								are set up to "zig zag" from one component to another; their
*								points array follows this structure:
*								[start.x, start.y, middle.x, start.y, middle.x, end.y, end.x, end.y]
*								The points array is composed of four points which essentially makes
*								up three lines. A midpoint is computed by simply adding start.x and
*								end.x and then diving by two. At this midpoint, the line jumps
*								vertically from the start.y position to the end.y position. This
*								prevents wires from being slanted; this zig zag looks more appealing
*								in terms of digital circuits.
***************************************************************************************/

function Controller(setup, truthTable, draggable, displayMode, exerID, container) {

	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; VARIABLE DECLARATIONS/DEFINITIONS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

	var connecting = false;		// keeps track if the controller is in "connecting mode" where one component is selected to be connected to another
	var components = [];
	var inputs = [];
	var outputs = [];
	var points = [];			// reused throughout the code to create points for wires (lines)
	var selectedComp = null;	// when connecting two components together, the first component that is selected will be stored here
	var tempLine = null;		// used to store points to line that follows mouse when in connecting mode
	var nextID = 0;
	var addPopup = null;
	var deletePopup = null;
	
	var gScale = setup.getGScale();
	var mainLayer = setup.getMainLayer();
	var stage = setup.getStage();
	var lastDist = 0;
	var startScale = 1;
	var bg = setup.getBG();
	
	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; FUNCTION DECLARATIONS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	
	this.registerComponent = registerComponent;								// register a new component
	

	// input & output node functions
	nodeMouseDown = nodeMouseDown;
	
	// misc functions
	setWireFromGateToGate = setWireFromGateToGate;							// set connections from a gate to gate
	setWireFromGateToConnector = setWireFromGateToConnector;				// set connections from a gate to a connector
	setWireFromConnectorToGate = setWireFromConnectorToGate;				// set connections from a connector to a gate
	setWireFromConnectorToConnector = setWireFromConnectorToConnector;		// set connections from a connector to a connector
	distance = distance;													// get distance between two points
	getWirePoints = getWirePoints;											// get the points for a wire from one component to another
	getWirePoints2 = getWirePoints2;										// get the points for a wire from one component to another (used on vertical connectors)
	
	// non-sand box functions
	this.connectComponents = connectComponents;								// programmatically set a connection from another class
	
	//add & delete functions
	this.addAndGate = addAndGate;
	this.addAndGate3 = addAndGate3;
	this.addAndGate4 = addAndGate4;
	this.addNandGate = addNandGate;
	this.addOrGate = addOrGate;
	this.addOrGate3 = addOrGate3;
	this.addOrGate4 = addOrGate4;
	this.addNorGate = addNorGate;
	this.addNotGate = addNotGate;
	this.addConnector = addConnector;
	this.addInput = addInput;
	this.addOutput = addOutput;
	
	this.refreshScale = refreshScale;
	this.getInputValues = getInputValues;
	
	this.updateNumberOfInputs = updateNumberOfInputs;
	this.updateNumberOfOutputs = updateNumberOfOutputs;
	
	this.addComponent = addComponent;
	
	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; FUNCTION IMPLEMENTATIONS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	
	var screenWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
	//console.log(screenWidth);
	
	bg.on('click tap', function() {
		if (displayMode == true) {
			setup.solve();
		}
	});
	
	if (screenWidth < 500 && draggable == true) {
		mainLayer.setDraggable("draggable");
		
		stage.getContent().addEventListener('touchmove', function(evt) {
			var touch1 = evt.touches[0];
			var touch2 = evt.touches[1];

			if(touch1 && touch2) {
			  var dist = getDistance({
				x: touch1.clientX,
				y: touch1.clientY
			  }, {
				x: touch2.clientX,
				y: touch2.clientY
			  });

			  if(!lastDist) {
				lastDist = dist;
			  }

			  var scale = stage.getScale().x * dist / lastDist;

			  stage.setScale(scale);
			  stage.draw();
			  lastDist = dist;
			}
		  }, false);

		  stage.getContent().addEventListener('touchend', function() {
			lastDist = 0;
		  }, false);
	}
	/*
	*	registerComponent()
	*
	*	This function is called to register a component with the controller. Event listeners are set accordinly.
	*/
	function registerComponent(comp)
	{
		if (comp.getType() == "input") {
			comp.getGroup().on('click tap', function(event) {
				nodeMouseDown(event, comp);
				stage.draw();
				ga("send", "event", "circuits", "walk", "figure-" + exerID);
			});
		}
		else {
			comp.getGroup().on('click tap', function (event) {
				compMouseDown(event, comp);
				ga("send", "event", "circuits", "walk", "figure-" + exerID);
				stage.draw();
			});
		}
	}
	//------------------------------------
	//--------- COMP LISTENERS -----------
	//------------------------------------
	
	function compMouseDown(event, comp) {
		var str = comp.probe();
		//alert(str);
		var alert = new Alert();
		alert.open("Boolean Probe", str, true, (function() { }), document.getElementById(container));
	}
	
	//------------------------------------
	//--------- NODE LISTENERS -----------
	//------------------------------------
	
	function nodeMouseDown(event, node) {
		if (node.getType() == "input") {
			node.toggleValue();
			inputVals = [];
			for (var i = 0; i < inputs.length; i++) inputVals.push("" + inputs[i].getValue());
			truthTable.highlightRow(inputVals);
			mainLayer.drawScene();
			stage.drawScene();
		}
	}
	
	//------------------------------------
	//------- CONNECTION FUNCTIONS -------
	//------------------------------------
	
	function setWireFrom1OutTo1In(comp, start, end, pluginNum) {
		start = start.getPoints()[1];										// the end point of the start line
		end = end.getPoints()[0];											// the start point of the end line
		points = getWirePoints(start, end);									// compute the wire points
		
		if (pluginNum == -1) comp.setPluginComp(selectedComp);				// if the plugin number is 0, the component is a NOT gate (only one input for a not gate)
		else comp.setPluginComp(selectedComp, pluginNum);
		
		// make a new line with the points computed earlier
		var line = new Kinetic.Line({points : points, stroke : "black", strokeWidth : 1, lineCap : 'round', lineJoin : 'round'});
		selectedComp.setPlugoutWire(line);	// set the plugoutWire of the selectedComp to this new line
		selectedComp.setPlugoutComp(comp);									// set the plugoutComp for the selectedComp
		
		mainLayer.add(line);			// refresh the scene
	}
	
	function setWireFromConnectorTo1In(comp, start, end, plugoutNum) {
		start = start.getPoints()[1];										// the end point of the start line
		end = end.getPoints()[0];											// the start point of the end line
		points = getWirePoints(start, end);									// compute the wire points
		
		comp.setPluginComp(selectedComp);				// if the plugin number is 0, the component is a NOT gate (only one input for a not gate)
		
		// make a new line with the points computed earlier
		var line = new Kinetic.Line({points : points, stroke : "black", strokeWidth : 1, lineCap : 'round', lineJoin : 'round'});
		selectedComp.setPlugoutWire(plugoutNum, line);	// set the plugoutWire of the selectedComp to this new line
		selectedComp.setPlugoutComp(plugoutNum, comp);									// set the plugoutComp for the selectedComp
		
		if (tempLine !== null) {		// if the tempLine does not equal null, disable it and set it null
			tempLine.disableStroke();
			tempLine = null;
		}
		
		mainLayer.add(line);			// refresh the scene
	}
	
	/*
	*	setWireFromGateToGate()
	*
	*	This function is called to set a connection for a gate to another gate. We are passed the component
	*	that will be connected to the selectedComp. In other words, it is the second component chosen in the
	*	connection process. We are also passed a start line and an end line. Our wire will go from the end point
	*	of the start line to the start points of the end line. Lastly, we are passed a plugin number which will
	*	be the number of the plugin that the wire will be connected to.
	*/
	function setWireFromGateToGate(gate, start, end, pluginNum) {
		start = start.getPoints()[1];										// the end point of the start line
		end = end.getPoints()[0];											// the start point of the end line
		points = getWirePoints(start, end);									// compute the wire points
		
		if (pluginNum == 0) gate.setPluginComp(selectedComp);				// if the plugin number is 0, the component is a NOT gate (only one input for a not gate)
		else gate.setPluginComp(pluginNum, selectedComp);					// else, call setPluginComp on the component with the plugin number provided and the selected component
		
		// make a new line with the points computed earlier
		var line = new Kinetic.Line({points : points, stroke : "black", strokeWidth : 1, lineCap : 'round', lineJoin : 'round'});
		selectedComp.setPlugoutWire(line);	// set the plugoutWire of the selectedComp to this new line
		selectedComp.setPlugoutComp(gate);									// set the plugoutComp for the selectedComp
		
		if (tempLine !== null) {		// if the tempLine does not equal null, disable it and set it null
			tempLine.disableStroke();
			tempLine = null;
		}
		
		mainLayer.add(line);			// refresh the scene
	}
	
	/*
	*	setWireFromGateToConnector()
	*
	*	This function is called to set a connection from a gate to a connector. We are passed the connector that we will be connecting
	*	the gate (selectedComp) to. We are also passed the start line and end line. We will make a wire (line) from the end point of
	*	the start line to the start point of the end line.
	*/
	function setWireFromGateToConnector(connect, start, end, pluginNum) {
		start = start.getPoints()[1];			// get the end point of the start line
		end = end.getPoints()[0];				// get the start point of the end line
		
		if (pluginNum == 1) points = getWirePoints3(start, end);
		else points = getWirePoints(start, end);		// get the wire points
		
		connect.setPluginComp(selectedComp, pluginNum);	// set the plugin component of the connector to the selected gate
		
		// make the line with the points computed earlier
		var line = new Kinetic.Line({points : points, stroke : "black", strokeWidth : 1, lineCap : 'round', lineJoin : 'round'});
		selectedComp.setPlugoutWire(line);	// set the plugout wire to this line of the selected gate
		selectedComp.setPlugoutComp(connect);	// set the plugout component of the selected gate to this connector
				
		if (tempLine !== null) {		// if temp line does not equal null, make it null and disable it
			tempLine.disableStroke();
			tempLine = null;
		}
		
		mainLayer.add(line);			// refresh the scene
	}
	
	/*
	*	setWireFromConnectorToGate()
	*
	*	This function is called to set a connection from a connector to a gate. We are passed the gate that we will be connecting
	*	the connector (selectedComp) to. We are also passed the start line and end line. We will make a wire (line) from the end
	*	point of the start line to the start point of the end line. We are also passed plugoutNum which is the plugout number of
	*	the connector being use, and also the pluginNum which is the plugin number of the gate being used.
	*/
	function setWireFromConnectorToGate(gate, start, end, plugoutNum, pluginNum) {
		start = start.getPoints()[1];										// get the end point of the start line
		end = end.getPoints()[0];											// get the start point of the end line
		
		// if the plugoutNum of the connector is 2, use getWirePoins(); else use getWirePoints2() -- see documentation
		if (plugoutNum == 2) points = getWirePoints(start, end);
		else points = getWirePoints2(start, end);
		
		// make the line with the points computed earlier
		var line = new Kinetic.Line({points : points, stroke : "black", strokeWidth : 1, lineCap : 'round', lineJoin : 'round'});
		selectedComp.setPlugoutWire(plugoutNum, line);	// set plugout wire of the connector to this line
		selectedComp.setPlugoutComp(plugoutNum, gate);						// set the plugout component of the connector to the gate
		
		if (pluginNum == 0) gate.setPluginComp(selectedComp);				// if pluginNum is 0, its a NOT gate
		else {																// else, it's an AND or OR gate
			gate.setPluginComp(pluginNum, selectedComp);					// set the plugin component of the gate
			gate.setConnectorPlugin(pluginNum, plugoutNum);					// set the connector plugin for the gate (very important)
		}
		
		mainLayer.add(line);			// refresh the scene
	}
	
	/*
	*	setWireFromConnectorToConnector()
	*
	*	This function is called to set a connection from a connector to another connector. We are passed a start line and end line.
	*	We will make a wire (line) from the end point of the start line to the start points of the end line. We are also passed
	*	the plugout number of the first connector we are using.
	*/
	function setWireFromConnectorToConnector(connect, start, end, plugoutNum, pluginNum) {
		start = start.getPoints()[1];									// get the end point of the start line
		end = end.getPoints()[0];										// get the start point of the end line
		
		// if the plugoutNum of the connector is 2, use getWirePoins(); else use getWirePoints2() -- see documentation
		if (plugoutNum == 2) points = getWirePoints(start, end);
		else points = getWirePoints2(start, end);
		
		// make a line with the points computed earlier
		var line = new Kinetic.Line({points : points, stroke : "black", strokeWidth : 1, lineCap : 'round', lineJoin : 'round'});
		selectedComp.setPlugoutWire(plugoutNum, line);		// set the plugout wire of the given plugout to the line we just created
		
		selectedComp.setPlugoutComp(plugoutNum, connect);				// set the plugout component of the selected connector
		connect.setPluginComp(selectedComp, pluginNum);							// set the plugin component of the second connector
				
		
		mainLayer.add(line);			// refresh the scene
	}
	
	/*
	*	connectComponents()
	*
	*	This function was made for the non-sand box version of this lab. It sets connections between components programmatically.
	*	From another JavaScript, components can be added to the stage and connected here. We are passed two components that will
	*	be connected and an options array. We must determine what each component is, and connect them appropriately.
	*/
	function connectComponents(comp1, comp2, opts) {
		selectedComp = comp1;					// set the selectedComp to the first component (it's like the user selected it in the sand-box)
		if (!opts) opts = [ 0 ];
					
		if (comp1.getFunc() == "gate" && comp2.getFunc() == "gate") { // if both components are gates (from gate to gate); opts = [ pluginNum ]
			setWireFromGateToGate(comp2, comp1.getPlugout(), comp2.getPlugin(opts[0]), opts[0]);	// make the connection
		}
		else if (comp1.getType() == "input" && comp2.getType() == "output") {
			setWireFrom1OutTo1In(comp2, comp1.getPlugout(), comp2.getPlugin(), -1);
		}
		else if (comp1.getType() == "input" && comp2.getFunc() == "gate") {
			if (comp2.getType() == "not") {
				setWireFrom1OutTo1In(comp2, comp1.getPlugout(), comp2.getPlugin(), -1);
			}
			else {
				setWireFromGateToGate(comp2, comp1.getPlugout(), comp2.getPlugin(opts[0]), opts[0]);
			}
		}
		else if (comp1.getType() == "input" && comp2.getType() == "connector") {
			setWireFrom1OutTo1In(comp2, comp1.getPlugout(), comp2.getPlugin(opts[0]), opts[0]);
		}
		else if (comp1.getFunc() == "gate" && comp2.getType() == "output") {
			setWireFrom1OutTo1In(comp2, comp1.getPlugout(), comp2.getPlugin(), -1);
		}
		else if (comp1.getType() == "connector" && comp2.getType() == "output") {
			setWireFromConnectorTo1In(comp2, comp1.getPlugout(opts[0]), comp2.getPlugin(), opts[0]);
		}
		else if (comp1.getFunc() == "gate" && comp2.getFunc() == "connection") { // if from gate to connector; opts = [ pluginNum ]
			setWireFromGateToConnector(comp2, comp1.getPlugout(), comp2.getPlugin(opts[0]), opts[0]);	// make the connection
		}
		else if (comp1.getFunc() == "connection" && comp2.getFunc() == "gate") { // if from connector to gate; opts = [ pluginNumOfGate, plugoutNumOfConnector ]
			if (comp2.getType() == "not") {
				comp1.setSelectedPlugout(opts[0]);
				setWireFromConnectorToGate(comp2, comp1.getPlugout(opts[0]), comp2.getPlugin(), opts[0], 0);
			}
			else {
				comp1.setSelectedPlugout(opts[1]);	// get the selectedPlugout line
				setWireFromConnectorToGate(comp2, comp1.getPlugout(opts[1]), comp2.getPlugin(opts[0]), opts[1], opts[0]); // make the connection
			}
		}
		else if (comp1.getFunc() == "connection" && comp2.getFunc() == "connection") { // if from connector to connector; opts = [ pluginInNumConnector, plugoutNumOfConnecotr ]
			comp1.setSelectedPlugout(opts[0]);	// get the selectedPlugout line
			setWireFromConnectorToConnector(comp2, comp1.getPlugout(opts[1]), comp2.getPlugin(opts[0]), opts[1], opts[0]);	// make the connection
		}
		
		mainLayer.drawScene();	// refresh the scene
	}
	
	//------------------------------------
	//----- AND & DELETE FUNCTIONS -------
	//------------------------------------
	
	function addComponent(type, x, y, id) {
		var comp;
		
		if (type == "and") comp = addAndGate(x, y, id);
		else if (type == "or") comp = addOrGate(x, y, id);
		else if (type == "not") comp = addNotGate(x, y, id);
		else if (type == "connector") comp = addConnector(x, y, id);
		
		return comp;
	}
	
	function addOrGate(initX, initY) {
		var orGate = new OrGate(gScale * initX, gScale * initY, "Or Gate", nextID++, setup, displayMode);
		components.push(orGate);
		registerComponent(orGate);
		orGate.draw();
		return orGate;
	}
	
	function addOrGate3(initX, initY) {
		var orGate3 = new OrGate3(gScale * initX, gScale * initY, "Or Gate", nextID++, setup);
		components.push(orGate3);
		registerComponent(orGate3);
		orGate3.draw();
		return orGate3;
	}
	
	function addOrGate4(initX, initY) {
		var orGate4 = new OrGate4(gScale * initX, gScale * initY, "Or Gate", nextID++, setup);
		components.push(orGate4);
		registerComponent(orGate4);
		orGate4.draw();
		return orGate4;
	}
	
	function addNorGate(initX, initY) {
		var norGate = new NorGate(gScale * initX, gScale * initY, "Or Gate", nextID++, setup);
		components.push(norGate);
		registerComponent(norGate);
		norGate.draw();
		return norGate;
	}
	
	function addAndGate(initX, initY) {
		var andGate = new AndGate(gScale * initX, gScale * initY, "And Gate", nextID++, setup, displayMode);
		components.push(andGate);
		registerComponent(andGate);
		andGate.draw();
		return andGate;
	}
	
	function addAndGate3(initX, initY) {
		var andGate3 = new AndGate3(gScale * initX, gScale * initY, "3-In And Gate", nextID++, setup);
		components.push(andGate3);
		registerComponent(andGate3);
		andGate3.draw();
		return andGate3;
	}
	
	function addAndGate4(initX, initY) {
		var andGate4 = new AndGate4(gScale * initX, gScale * initY, "3-In And Gate", nextID++, setup);
		components.push(andGate4);
		registerComponent(andGate4);
		andGate4.draw();
		return andGate4;
	}
	
	function addNandGate(initX, initY) {
		var nandGate = new NandGate(gScale * initX, gScale * initY, "3-In And Gate", nextID++, setup);
		components.push(nandGate);
		registerComponent(nandGate);
		nandGate.draw();
		return nandGate;
	}
	
	function addNotGate(initX, initY) {
		var notGate = new NotGate(gScale * initX, gScale * initY, "Not Gate", nextID++, setup, displayMode);
		components.push(notGate);
		registerComponent(notGate);
		notGate.draw();
		return notGate;
	}
	
	function addConnector(initX, initY) {
		var conn = new Connector(gScale * initX, gScale * initY, "Connector", nextID++, setup, displayMode);
		components.push(conn);
		registerComponent(conn);
		conn.draw();
		return conn;
	}

	function addInput(initX, initY, text, value) {
		input = new InputNode(gScale * initX, gScale * initY, text, value, "Input Node", text, setup);
		components.push(input);
		inputs.push(input);
		registerComponent(input);
		input.draw();
		return input;
	}
	
	function addOutput(initX, initY, text) {
		output = new OutputNode(gScale * initX, gScale * initY, text, "Output Node", text, setup);
		components.push(output);
		outputs.push(output);
		registerComponent(output);
		output.draw();
		return output;
	}
	
	//------------------------------------
	//--------- MISC FUNCTIONS -----------
	//------------------------------------
	
	/*
	*	getWirePoints()
	*
	*	This function returns an array with four points to be used in drawing a wire. The points make up a zig zag line which breaks down into
	*	three separate lines. "start" is the starting point of the line: "end" is the end point of the line. The ending points array will look
	*	like this: [ start.x, start.y, middle.x, start.y, middle.x, end.y, end.x, end.y ]; These points make a zig zag from start to end.
	*/
	function getWirePoints(start, end) {
		points = [];							// null the points array
		points.push(start.x, start.y);			// push start.x, start.y
		var xMed = (points[0] + end.x) / 2;		// comput the middle x
		points.push(xMed, start.y);				// push middle.x, start.y
		points.push(xMed, end.y);				// push middle.x, end.y
		points.push(end.x, end.y);				// push end.x, end.y
		return points;							// return the array
	}
	
	/*
	*	getWirePoints2()
	*
	*	This function returns an array with three points to be used in drawing a wire. It is called ONLY from the vertical plugout lines of a
	*	connector (plugout1 and plugout3). The first horizontal portion of the line is not necessary for the plugout lines of a connector
	*	that are already vertical. So, we simply make the poins array to look like: [ start.x, start.y, start.x, end.y, end.x, end.y ]
	*/
	function getWirePoints2(start, end) {
		points = [];						// null the points array
		points.push(start.x, start.y);		// push start.x, start.y
		points.push(start.x, end.y);		// push start.x, end.y
		points.push(end.x, end.y);			// push end.x, end.y
		return points;						// return the array
	}
	
	function getWirePoints3(start, end) {
		points = [];
		points.push(start.x, start.y);
		points.push(end.x, start.y);
		points.push(end.x, end.y);
		return points;
	}
	
	// simply compute the Euclidean distance between points p1 and p2
	function distance(p1, p2) {
		return Math.sqrt(Math.pow(p2.y - p1.y, 2) + Math.pow(p2.x - p1.x, 2));
	}
	
	function stopListeners(comp) {
		comp.getGroup().off('click');
		comp.getGroup().off('dragmove');
		comp.getGroup().off('mouseover');
		comp.getGroup().off('mouseout');
	}
	
	this.evaluateCircuit = evaluateCircuit;
	function evaluateCircuit() {
		var truthTableArr = [];
		var inputVals = [];
		for (var i = 0; i < inputs.length; i++) inputVals.push(inputs[i].getValue());
		
		var numRows;
		if (inputs.length < 8) {
			numRows = Math.pow(2, inputs.length);
			for (var i = 0; i < numRows; i++) {
				var num = i.toString(2);
				var str = "";
				if (num.length != inputs.length) {
					for (var j = 0; j < inputs.length - num.length; j++) str += "0";
				}
				str += num;
				var row = [];
				for (var j = 0; j < inputs.length; j++) {
					row.push(str[j]);
				}
				truthTableArr.push(row);
			}
		}
		else {
			numRows = inputs.length;
			for (var i = 0; i < numRows; i++) {
				var str = "";
				for (var j = numRows-1; j >= 0; j--) {
					if (j == i) str += "1";
					else str += "0";
				}
				var row = [];
				for (var j = 0; j < inputs.length; j++) row.push(str[j]);
				truthTableArr.push(row);
			}
		}

		var logStr = "";
		for (var i = 0; i < truthTableArr.length; i++) {
			for (var j = 0; j < inputs.length; j++) {
				inputs[j].setValue(truthTableArr[i][j]);
				inputs[j].evaluate();
			}
			for (var j = 0; j < outputs.length; j++) {
				if (outputs[j].getResult() == -1) truthTableArr[i].push("0");
				else truthTableArr[i].push(outputs[j].getResult());
			}
		}
		
		truthTable.setTable(truthTableArr);
		for (var i = 0; i < inputs.length; i++) inputs[i].setValue(inputVals[i]);
	}
	
	function refreshScale() { gScale = setup.getGScale(); }
	
	function getInputValues() {
		inputNodeVals = [];
		for (var i = 0; i < inputs.length; i++) inputNodeVals[i] = inputs[i].getValue();
		return inputNodeVals;
	}
	
	function getDistance(p1, p2) {
        return Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2));
	}
	
	function updateNumberOfInputs(res) {
		var alphabet = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ];
		
		var header = [ ];
		
		var numOutputs = outputs.length;
		for (var i = 0; i < res; i++) header.push(alphabet[i]);
		for (var i = 0; i < numOutputs; i++) header.push(alphabet[25 - i]);
			
		for (var i = 0; i < inputs.length; i++) {
			deleteInputNode(inputs[i]);
		}
		inputs = [];
		
		var ind = 0;
		for (var i = 0; i < res; i++) {
			addInput(5, ((600 / (res + 1)) * (i + 1)), header[ind++], 0);
		}
		
		//truthTable.resetTruthTable(res, numOutputs, header);
		numInputs = res;
		
		return inputs;
	}
	
	function updateNumberOfOutputs(res) {
		var alphabet = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ];
		
		var header = [ ];

		var numInputs = inputs.length;
		for (var i = 0; i < numInputs; i++) header.push(alphabet[i]);
		for (var i = 0; i < res; i++) header.push(alphabet[25 - i]);
			
		for (var i = 0; i < outputs.length; i++) {
			deleteOutputNode(outputs[i]);
		}
		outputs = [];
		
		var ind = numInputs;
		for (var i = 0; i < res; i++) {
			addOutput(820, ((550 / (res + 1)) * (i + 1)), header[ind++]);
		}
		
		//truthTable.resetTruthTable(numInputs, res, header);
		numOutputs = res;
		
		return outputs;
	}
}