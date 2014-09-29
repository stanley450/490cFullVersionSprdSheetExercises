/**************************************************************************************
*	Author:		Neil Vosburg
*	Class:		Connector.js
*
*	Behavior:	This class implements the connector. The connector has one input and
*				three outputs. The input is simply sent to each of its three outputs.
*				The naming conventions are very similar to the other gates. The plugin
*				is associated with the input line. "plugout#" is associated with the
*				three output lines.
***************************************************************************************/

function Connector(initX, initY, setName, id, setup, displayMode) {
	
	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; VARIABLE DECLARATIONS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	
	var pluginPin = 0;
	
	var plugin = null;				// the line associated with the input
	var pluginVal = -1;
	var pluginComp = null;			// the component connected to this connector's input

	var pin0 = null;
	var pin0Wire = null;
	var pin0Comp = null;
	
	var pin1 = null;			// the line associated with the first (top) plugin
	var pin1Wire = null;		// the wire (line) that connects the connector at the component connected to the first plugin
	var pin1Comp = null;		// the component connected to the connector's first plugin

	var pin2 = null;			// the line associated with the second (right) plugin
	var pin2Wire = null;		// the wire (line) that connects the connector at the component connected to the second plugin
	var pin2Comp = null;		// the component connected to the connector's second plugin
	
	var pin3 = null;			// the line associated with the third (bottom) plugin
	var pin3Wire = null;		// the wire (line) that connects the connector at the component connected to the third plugin
	var pin3Comp = null;		// the component connected to the connector's third plugin
	
	var selectedPlugout;			// the plugout line selected by the controller when making a connection

	var name = setName;				// the name of the connector
	var ID = id;					// the ID of the connector
	var compShape;					// the shape of the connector (square)
	var group;						// the group that will be composed of the connector's components
	var transFg;					// the transparent foreground that makes it easy for users to click the connector
	
	var scale;
	var mainLayer = setup.getMainLayer();
	var stage = setup.getStage();
	var thisObj = this;

	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; FUNCTION DECLARATIONS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	
	this.draw = draw;
	this.getType = getType;
	this.getID = getID;
	this.getFunc = getFunc;
	this.getName = getName;
	this.getGroup = getGroup;
	this.getPlugin = getPlugin;
	this.getPluginComp = getPluginComp;
	this.getPlugout = getPlugout;
	this.getPlugoutToComp = getPlugoutToComp;
	this.getPlugoutComp = getPlugoutComp;
	this.setPlugoutComp = setPlugoutComp;
	this.getPlugoutWire = getPlugoutWire;
	this.setPlugoutWire = setPlugoutWire;
	this.getSelectedPlugout = getSelectedPlugout;
	this.setSelectedPlugout = setSelectedPlugout;
	this.setPluginComp = setPluginComp;
	this.setPluginCompNull = setPluginCompNull;
	this.setPluginVal = setPluginVal;
	this.evaluate = evaluate;
	this.probe = probe;
	
	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; VARIABLE ASSIGNMENTS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	
	if (displayMode == true) scale = 0.75;
	else scale = 1;
	
	// make the rectangle
    compShape = new Kinetic.Rect({
        x: scale * 20,
        y: scale * 20,
        width: scale * 10,
        height: scale * 10,
        fill: 'black',
        stroke: 'black',
        strokeWidth: 1
      });
	   
	// create the plugin line
	pin0 = new Kinetic.Line({
		points : [scale * 5, scale * 25, scale * 20, scale * 25],
		stroke : 'black',
		strokeWidth : 1,
		lineCap : 'round',
		lineJoin : 'round'
	});

	// create the first plugout line
	pin1 = new Kinetic.Line({
		points : [scale * 25, scale * 5, scale * 25, scale * 20],
		stroke : 'black',
		strokeWidth : 1,
		lineCap : 'round',
		lineJoin : 'round'
	});

	// create the second plugout line
	pin2 = new Kinetic.Line({
		points : [scale * 30, scale * 25, scale * 45, scale * 25],
		stroke : 'black',
		strokeWidth : 1,
		lineCap : 'round',
		lineJoin : 'round'
	});
	
	// create the third plugout line
	pin3 = new Kinetic.Line({
		points : [scale * 25, scale * 30, scale * 25, scale * 45],
		stroke : 'black',
		strokeWidth : 1,
		lineCap : 'round',
		lineJoin : 'round'
	});

	// create the transparent rectangle
	transFg = new Kinetic.Rect({
		x: scale * 5,
		y: scale * 5,
		width: scale * 40,
		height: scale * 40
	});
	
	// create the group object
	group = new Kinetic.Group({
			x : initX,
			y : initY,
			rotationDeg : 0,
			draggable : false
		});
	
	// add cursor styling when the user mouseovers the group
	group.on('mouseover', function () {
		document.body.style.cursor = 'pointer';
	});
	group.on('mouseout', function () {
		document.body.style.cursor = 'default';
	});

	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; FUNCTION IMPLEMENTATIONS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	
	// draw the connector
	function draw() {
		// add each of the components to the group
		group.add(compShape);	// the shape
		group.add(pin0);		// ... the plugin line
		group.add(pin1);	// ... the first plugin line
		group.add(pin2);	// ... the second plugin line
		group.add(pin3);	// ... the third plugin line
		group.add(transFg);		// and finally the transparent foreground
		mainLayer.add(group);	// add the group to the main layer
		
		// disable plugout lines until they are needed
		pin0.disableStroke();
		pin1.disableStroke();
		pin2.disableStroke();
		pin3.disableStroke();
		
		stage.draw();			// call draw on the stage to redraw its components
	}
	
	// accessor for this gate's type
	function getType() { return "connector"; }
	
	// accessor for this gate's function
	function getFunc() { return "connection"; }
	
	function getID() { return ID; }
	
	// accessor for this gate's name
	function getName() { return name; }
	
	// accessor for this gate's group
	function getGroup() { return group; }

	// returns the line for the plugin in GLOBAL coordinates; used in the controller for drawing wires (the controller functions in global coordinates; which makes sense)
	function getPlugin(pluginNumPin) {
		var plug;
		if (pluginNumPin == 0) plug = pin0;
		else if (pluginNumPin == 1) plug = pin1;
		else if (pluginNumPin == 2) plug = pin2;
		else if (pluginNumPin == 3) plug = pin3;
		
		var line;
		line = new Kinetic.Line({
			points: [group.getX() + plug.getPoints()[0].x, group.getY() + plug.getPoints()[0].y, group.getX() + plug.getPoints()[1].x, group.getY() + plug.getPoints()[1].y]
		});
		return line;
	}

	// accessor for the component that the connector's input is connected to (the component before the connector)
	function getPluginComp() { return pluginComp; }
	
	// return a line for the plugout line specified by the parameter (same concept as plugin line; convert coordinates to global coordinates)
	function getPlugout(num)
	{
		var line;
		if (num == 0) { 
			line = new Kinetic.Line({
				points: [group.getX() + pin0.getPoints()[0].x, group.getY() + pin0.getPoints()[0].y, group.getX() + pin0.getPoints()[1].x, group.getY() + pin0.getPoints()[1].y]
			});
		}
		if (num == 1) {
			line = new Kinetic.Line({
				points: [group.getX() + pin1.getPoints()[0].x, group.getY() + pin1.getPoints()[0].y, group.getX() + pin1.getPoints()[1].x, group.getY() + pin1.getPoints()[1].y]
			});
		}
		else if (num == 2) {
			line = new Kinetic.Line({
				points: [group.getX() + pin2.getPoints()[0].x, group.getY() + pin2.getPoints()[0].y, group.getX() + pin2.getPoints()[1].x, group.getY() + pin2.getPoints()[1].y]
			});
		}
		else {
			line = new Kinetic.Line({
				points: [group.getX() + pin3.getPoints()[0].x, group.getY() + pin3.getPoints()[0].y, group.getX() + pin3.getPoints()[1].x, group.getY() + pin3.getPoints()[1].y]
			});
		}
		return line;
	}
	
	// return the component that is connected to the specified plugout number; we use an array here as two outputs can be connected to the same gate
	function getPlugoutToComp(comp)
	{
		var res = [];
		
		if (comp == pin0Comp) res.push(0);
		if (comp == pin1Comp) res.push(1);
		if (comp == pin2Comp) res.push(2);
		if (comp == pin3Comp) res.push(3);
		
		return res;
	}
	
	// return the wire (line) that is connected to the specified plugout number that runs to the connected component for that plug
	function getPlugoutWire(num)
	{
		if (num == 0) return pin0Wire;
		else if (num == 1) return pin1Wire;
		else if(num == 2) return pin2Wire;
		else return pin3Wire;
	}
	
	// set the wire (line) that is associated with the specified plugout number
	function setPlugoutWire(num, line)
	{
		if (num == 0) pin0Wire = line;
		else if (num == 1) pin1Wire = line;
		else if (num == 2) pin2Wire = line;
		else pin3Wire = line;
	}
	
	// get the component that is connected to the specified plugout
	function getPlugoutComp(num)
	{
		if (num == 0) return pin0Comp;
		else if (num == 1) return pin1Comp;
		else if (num == 2) return pin2Comp;
		else return pin3Comp;
	}
	
	// set the component connected to the specified plugout
	function setPlugoutComp(num, comp)
	{
		if (num == 0) { pin0Comp = comp; pin0.enableStroke(); }
		else if (num == 1) { pin1Comp = comp; pin1.enableStroke(); }
		else if (num == 2) { pin2Comp = comp; pin2.enableStroke(); }
		else { pin3Comp = comp; pin3.enableStroke(); }
		
		evaluate();
	}
	
	// get the plugout that is currently selected
	function getSelectedPlugout() {
		return selectedPlugout;
	}
	
	// set the plugout that is currently selected
	function setSelectedPlugout(num) {
		selectedPlugout = num;
	}
	
	// set the component that is connected to the plugin to null
	function setPluginCompNull()
	{
		pluginComp = null;
		pluginVal = -1;
		evaluate();
	}
	
	// set the component that is connected to the plugin
	function setPluginComp(comp, pin)
	{
		pluginPin = pin;
		if (pin == 0) { plugin = pin0; pin0Comp = comp; pin0.enableStroke(); }
		else if (pin == 1) { plugin = pin1; pin1Comp = comp; pin1.enableStroke(); }
		else if (pin == 2) { plugin = pin2; pin2Comp = comp; pin2.enableStroke(); }
		else if (pin == 3) { plugin = pin3; pin3Comp = comp; pin3.enableStroke(); }
		
		pluginComp = comp;
		comp.evaluate();
	}
	
	// give the connector an input (only one is needed)
	// add a value to this AND gate's input values (used in computing the output of the circuit); these two values will be OR'ed together
	function setPluginVal(comp, val) {
		var plugin;
		if (pluginPin == 0) plugin = pin0;
		else if (pluginPin == 1) plugin = pin1;
		else if (pluginPin == 2) plugin = pin2;
		else if (pluginPin == 3) plugin = pin3;
		
		pluginVal = val;
		if (pluginVal == 1) plugin.setStroke("red");
		else if (pluginVal == 0) plugin.setStroke("blue");
		else plugin.setStroke("black");
		evaluate();
	}
	
	// evaluate this gate; AND the two values in pluginVals, and send the output to the next component
	function evaluate() {
		var thisComp = thisObj;
		var flag = false;
		if (pin0Comp !== null && pin0 != plugin) { pin0Comp.setPluginVal(thisComp, pluginVal); setPlugoutWireColor(0); flag = true; }
		if (pin1Comp !== null && pin1 != plugin) { pin1Comp.setPluginVal(thisComp, pluginVal); setPlugoutWireColor(1); flag = true; }
		if (pin2Comp !== null && pin2 != plugin) { pin2Comp.setPluginVal(thisComp, pluginVal); setPlugoutWireColor(2); flag = true; }
		if (pin3Comp !== null && pin3 != plugin) { pin3Comp.setPluginVal(thisComp, pluginVal); setPlugoutWireColor(3); flag = true; }
		
		if (flag == false && pluginVal == 0) compShape.setFill("blue");
		else if (flag == false && pluginVal == 1) compShape.setFill("red");
	}
	
	function probe() {
		var str = "";
		if (pluginComp !== null) {
			str += pluginComp.probe();
			return str;
		}
		else return null;
	}
	
	function setPlugoutWireColor(num) {
		if (pluginVal == 1) {
			if (num == 0) { pin0.setStroke("red"); pin0Wire.setStroke("red"); compShape.setFill("red"); }
			else if (num == 1) { pin1.setStroke("red"); pin1Wire.setStroke("red"); compShape.setFill("red"); }
			else if (num == 2) { pin2.setStroke("red"); pin2Wire.setStroke("red"); compShape.setFill("red"); }
			else { pin3.setStroke("red"); pin3Wire.setStroke("red"); compShape.setFill("red"); }
		}
		else if (pluginVal == 0) {
			if (num == 0) { pin0.setStroke("blue"); pin0Wire.setStroke("blue"); compShape.setFill("blue"); }
			else if (num == 1) { pin1.setStroke("blue"); pin1Wire.setStroke("blue"); compShape.setFill("blue"); }
			else if (num == 2) { pin2.setStroke("blue"); pin2Wire.setStroke("blue"); compShape.setFill("blue"); }
			else { pin3.setStroke("blue"); pin3Wire.setStroke("blue"); compShape.setFill("blue"); }
		}
		else {
			if (num == 0) { pin0.setStroke("black"); pin0Wire.setStroke("black"); compShape.setFill("black"); }
			else if (num == 1) { pin1.setStroke("black"); pin1Wire.setStroke("black"); compShape.setFill("black"); }
			else if (num == 2) { pin2.setStroke("black"); pin2Wire.setStroke("black"); compShape.setFill("black"); }
			else { pin3.setStroke("black"); pin3Wire.setStroke("black"); compShape.setFill("black"); }
		}
	}
}