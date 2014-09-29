/**************************************************************************************
*	Author:		Neil Vosburg
*	Class:		OrGate3.js
*
*	Behavior:	This class represents the functionality of an OR gate. The class contains
*				variables for "plugins", "plugout", "plugoutWire", and "plugoutComp".
*				Plugins for the OR gate are the two input lines. The OR gate has one plugout
*				which is the one line associated with its output. The plugout wire is
*				associated with the line that runs to the component it is connected to
*				from its plugout. The "plugoutComp" stands for plugout component, which is
*				the components the OR gate outputs to.
***************************************************************************************/

function OrGate3(initX, initY, setName, id, setup) {
	
	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; VARIABLE DECLARATIONS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	
	var plugin1 = null;				// the first (top) input line
	var plugin1Val = -1;
	var connectorPlugin1;			// if this gate's plugin1 is connected to a connector, this keeps track of the plugout number of the connector it is connected to
	var plugin1Comp = null;			// the component that is connected to plugin1
	
	var plugin2 = null;				// the second (bottom) input line
	var plugin2Val = -1;
	var connectorPlugin2;			// if this gate's plugin2 is connected to a connector, this keeps track of the plugout number of the connector it is connected to
	var plugin2Comp = null;			// the component that is connected to plugin2
	
	var plugin3 = null;				// the third input line
	var plugin3Val = -1;
	var connectorPlugin3;			// if this gate's plugin3 is connected to a connector, this keeps track of the plugout number of the connector it is connected to
	var plugin3Comp = null;			// the component that is connected to plugin2

	var plugout = null;				// the output line
	var plugoutWire = null;			// the wire the connects the output to the input of another gate
	var plugoutComp = null;			// the component this gate's output is connected to
	
	var name = setName;				// the name of this gate
	var ID = id;					// the ID of this gate
	
	var group;						// the group that all of the OR gate's components are added to
	var gateShape;					// the custom shape for the OR gate
	var transFg;					// a transparent foreground for the OR gate
	
	var gScale = setup.getGScale();
	var mainLayer = setup.getMainLayer();
	var stage = setup.getStage();
	var thisObj = this;
	
	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; FUNCTION DECLARATIONS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	
	this.draw = draw;
	this.getType = getType;
	this.getFunc = getFunc;
	this.getName = getName;
	this.getGroup = getGroup;
	this.getID = getID;
	this.getPlugin = getPlugin;
	this.getPluginComp = getPluginComp;
	this.setPluginComp = setPluginComp;
	this.getConnectorPlugin = getConnectorPlugin;
	this.setConnectorPlugin = setConnectorPlugin;
	this.getPlugout = getPlugout;
	this.getPlugoutComp = getPlugoutComp;
	this.setPlugoutComp = setPlugoutComp;
	this.getPlugoutWire = getPlugoutWire;
	this.setPlugoutWire = setPlugoutWire;
	this.setPluginCompNull = setPluginCompNull;
	this.setPluginVal = setPluginVal;
	this.evaluate = evaluate;
	this.probe = probe;
	
	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; VARIABLE ASSIGNMENTS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	
	// a custom shape to draw the or gate; composed of three quadratic curves
	gateShape = new Kinetic.Shape({
			drawFunc : function (context) {
				// begin custom shape
				//context.beginPath();
				//context.moveTo(gScale * 50, gScale * 0);
				//context.quadraticCurveTo(gScale * 75, gScale * 0, gScale * 100, gScale * 25);
				//context.quadraticCurveTo(gScale * 75, gScale * 50, gScale * 50, gScale * 50);
				//context.quadraticCurveTo(gScale * 75, gScale * 25, gScale * 50, gScale * 0);
				context.beginPath();
				context.moveTo(50, 0);
				context.lineTo(70, 0);
				context.quadraticCurveTo(95, 0, 110, 25);
				context.quadraticCurveTo(95, 50, 70, 50);
				context.lineTo(50, 50);
				context.quadraticCurveTo(75, 25, 50, 0);
				// complete custom shape
				context.closePath();
				// KineticJS specific context method
				context.fillStrokeShape(this);
			},
			stroke : 'black',
			strokeWidth : 1
		});

	// the line for the first plugin
	plugin1 = new Kinetic.Line({
			points : [gScale * 28, gScale * 10, gScale * 58, gScale * 10],
			stroke : 'black',
			strokeWidth : 1,
			lineCap : 'round',
			lineJoin : 'round'
		});

	// the line for the second plugin
	plugin2 = new Kinetic.Line({
			points : [gScale * 28, gScale * 25, gScale * 61, gScale * 25],
			stroke : 'black',
			strokeWidth : 1,
			lineCap : 'round',
			lineJoin : 'round'
		});

	// the line for the second plugin
	plugin3 = new Kinetic.Line({
			points : [gScale * 28, gScale * 40, gScale * 61, gScale * 40],
			stroke : 'black',
			strokeWidth : 1,
			lineCap : 'round',
			lineJoin : 'round'
		});
		
	// the line for the plugout
	plugout = new Kinetic.Line({
			points : [gScale * 100, gScale * 25, gScale * 132, gScale * 25],
			stroke : 'black',
			strokeWidth : 1,
			lineCap : 'round',
			lineJoin : 'round'
		});
	
	// create the transparent rectangle that makes it easy to click the OR gate
	transFg = new Kinetic.Rect({
		x: gScale * 28,
		y: gScale * 0,
		width: plugout.getPoints()[1].x - plugin1.getPoints()[0].x,
		height: (plugin2.getPoints()[0].y + 10)
	});

	// create the group for the components that make up the OR gate; place it at the x,y coords passed to the object
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
	
	// draw the OR gate
	function draw() {
		// add each component to the group
		group.add(gateShape);	// the custom shape
		group.add(plugin1);		// ... the first plugin line
		group.add(plugin2);		// ... the secong plugin line
		group.add(plugin3);		// ... the third plugin line
		group.add(plugout);		// ... the plugout line
		group.add(transFg);		// and finally the transparent foreground
		mainLayer.add(group);	// add the group to the main layer
		stage.draw();					// call draw on the stage to redraw its components
	}
	
	// accessor for the gate type
	function getType() { return "or3"; }
	
	function getID() { return ID; }
	
	// accessor for the gate function (returns "gate" for OR, AND, and NOT; returns "connection" for CONNECTOR)
	function getFunc() { return "gate"; }
	
	// accessor for the gate name
	function getName() { return name; }
	
	// accessor for the group (used in controller for setting events on this object)
	function getGroup() { return group; }
	
	// returns the line for a plugin in GLOBAL coordinates; used in the controller for drawing wires (the controller functions in global coordinates; which makes sense)
	function getPlugin(num) {	// num is the plugin number to return
		var line;
		
		if (num == 1) {
			line = new Kinetic.Line({
				// make a new line and transform the line's coordinates to global coordinates; we do this by adding the group's coordinates to the line's coordinates
				points: [group.getX() + plugin1.getPoints()[0].x, group.getY() + plugin1.getPoints()[0].y, group.getX() + plugin1.getPoints()[1].x, group.getY() + plugin1.getPoints()[1].y]
			});
		}
		else if (num == 2) {
			line = new Kinetic.Line({
				// same concept as above; must transform coordinates to global coordinates
				points: [group.getX() + plugin2.getPoints()[0].x, group.getY() + plugin2.getPoints()[0].y, group.getX() + plugin2.getPoints()[1].x, group.getY() + plugin2.getPoints()[1].y]
			});
		}
		else {
			line = new Kinetic.Line({
				// same concept as above; must transform coordinates to global coordinates
				points: [group.getX() + plugin3.getPoints()[0].x, group.getY() + plugin3.getPoints()[0].y, group.getX() + plugin3.getPoints()[1].x, group.getY() + plugin3.getPoints()[1].y]
			});
		}
		
		return line;
	}
	
	// accessor for a connector plugin number (recall that connectorPlugin# is for when a plugin is connected to a connector)
	function getConnectorPlugin(num) {
		if (num == 1) return connectorPlugin1;
		else if (num == 2) return connectorPlugin2;
		else if (num == 3) return connectorPlugin3;
	}
	
	// mutator for a connector plugin (this is called when the OR gate's input is connected to a connector)
	function setConnectorPlugin(pluginNum, plugoutNum) {
		if (pluginNum == 1) connectorPlugin1 = plugoutNum;
		else if (pluginNum == 2) connectorPlugin2 = plugoutNum;
		else if (pluginNum == 3) connectorPlugin3 = plugoutNum;
	}
	
	// accessor for the component connected to the OR gate's input (the component before the OR gate)
	function getPluginComp(num) {
		if (num == 1) return plugin1Comp;
		else if (num == 2) return plugin2Comp;
		else if (num == 3) return plugin3Comp;
	}
	
	// return the line for the plugout in GLOBAL coordinates; same concept as plugin lines
	function getPlugout() {
		var line = new Kinetic.Line({
			points: [group.getX() + plugout.getPoints()[0].x, group.getY() + plugout.getPoints()[0].x, group.getX() + plugout.getPoints()[1].x, group.getY() + plugout.getPoints()[1].y]
		});
				
		return line;
	}
	
	// accessor for the wire (line) that connects the plugout to a component for output
	function getPlugoutWire() { return plugoutWire;	}
	
	// mutator for the wire (line) that connects the plugout to a component for output
	function setPlugoutWire(line) {
		plugoutWire = line;
		if (plugin1Val == 1 || plugin2Val == 1 || plugin3Val == 1) plugoutWire.setStroke("red");
		else plugoutWire.setStroke("blue");
	}
	
	// accessor for the component connected to the OR gate's output
	function getPlugoutComp() { return plugoutComp; }
	
	// sets the component that the OR gate is connected to
	function setPlugoutComp(comp) { plugoutComp = comp; evaluate(); }
	
	// set a plugin to NULL that equals the given component passed as parameter (used in disconnection)
	function setPluginCompNull(comp)
	{
		if (plugin1Comp == comp) {
			plugin1Comp = null;
			plugin1Val = -1;
		}
		
		if (plugin2Comp == comp) {
			plugin2Comp = null;
			plugin2Val = -1;
		}
		
		if (plugin3Comp == comp) {
			plugin3Comp = null;
			plugin3Val = -1;
		}
		
		evaluate();
	}
	
	// set the component that the OR gate's input is connected to
	function setPluginComp(num, comp) {
		if (num == 1) plugin1Comp = comp;
		else if (num == 2) plugin2Comp = comp;
		else if (num == 3) plugin3Comp = comp;

		comp.evaluate();
	}
	
	// add a value to this AND gate's input values (used in computing the output of the circuit); these two values will be OR'ed together
	function setPluginVal(comp, val) {
		if (comp == plugin1Comp && comp == plugin2Comp && comp == plugin3Comp) { 
			plugin1Val = val; plugin2Val = val; plugin3Val = val; plugin4Val = val;
			if (val == -1 || val == 0) { plugin1.setStroke("blue"); plugin2.setStroke("blue"); plugin3.setStroke("blue"); }
			else { plugin1.setStroke("red"); plugin2.setStroke("red"); plugin3.setStroke("red"); }
			
		}
		else if (comp == plugin1Comp) {
			plugin1Val = val;
			if (val == -1 || val == 0) plugin1.setStroke("blue");
			else plugin1.setStroke("red");
		}
		else if (comp == plugin2Comp) {
			plugin2Val = val;
			if (val == -1 || val == 0) plugin2.setStroke("blue");
			else plugin2.setStroke("red");
		}
		else if (comp == plugin3Comp) {
			plugin3Val = val;
			if (val == -1 || val == 0) plugin3.setStroke("blue");
			else plugin3.setStroke("red");
		}
		
		evaluate();
	}
	
	// evaluate this gate; AND the two values in pluginVals, and send the output to the next component
	function evaluate() {
		if (plugin1Val != -1 && plugin2Val != -1 && plugin3Val != -1) {
			var res = 0;
			if (plugin1Val == 1 || plugin2Val == 1 || plugin3Val == 1) {
				res = 1;
			}
			
			if (plugoutComp !== null) {
				plugoutComp.setPluginVal(thisObj, res);
				setPlugoutWireColor();
			}
		}
		else {
			if (plugoutComp !== null) plugoutComp.setPluginVal(thisObj, -1);
		}
	}
	
	function probe() {
	var str = "(";
	if (plugin1Comp !== null && plugin2Comp !== null) {
		str += plugin1Comp.probe();
		str += " + ";
		str += plugin2Comp.probe();
		str += " + ";
		str += plugin3Comp.probe();
		str += ")";
		return str;
	}
		else return null;
	}
	
	function setPlugoutWireColor() {
		if (plugin1Val == 1 || plugin2Val == 1 || plugin3Val == 1) { plugout.setStroke("red"); plugoutWire.setStroke("red"); gateShape.setFill("red"); }
		else { plugout.setStroke("blue"); plugoutWire.setStroke("blue"); gateShape.setFill("blue"); }
	}
}
