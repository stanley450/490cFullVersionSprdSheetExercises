/**************************************************************************************
*	Author:		Neil Vosburg
*	Class:		NotGate.js
*
*	Behavior:	This class represents the functionality of a NOT gate. The class contains
*				variables for a "plugin", "plugout", "plugoutWire", and "plugoutComp".
*				The Plugin for the NOT gate is the one input line. The OR gate has one plugout
*				which is the one line associated with its output. The plugout wire is
*				associated with the line that runs to the component it is connected to
*				from its plugout. The "plugoutComp" stands for plugout component, which is
*				the component the OR gate outputs to.
***************************************************************************************/

function NotGate(initX, initY, setName, id, setup, displayMode) {

	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; VARIABLE DECLARATIONS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	
	var plugin = null;				// the line associated with the NOT gate's input
	var pluginVal = -1;
	var pluginComp = null;			// the component that is connected to the NOT gate's input (the component before the NOT gate)

	var plugout = null;				// the line associated with the NOT gate's output
	var plugoutComp = null;			// the component that the NOT gate's output is connected to
	var plugoutWire = null;			// the wire (line) that is drawn for the NOT gate's output to the input of another component

	var name = setName;				// the name for this gate
	var ID = id;					// the ID of this gate
	
	var group;						// the group that all of the NOT gate's components will be added to
	var gateShapeTriangle;			// the triangle that is used to draw the NOT gate
	var gateShapeCircle;			// the circle that is used to draw the NOT gate
	var transFg;					// a transparent foreground that makes the NOT gate easier to click
	
	var scale;
	var mainLayer = setup.getMainLayer();
	var stage = setup.getStage();
	var thisObj = this;
	
	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; FUNCTION DECLARATIONS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	this.getType = getType;
	this.getID = getID;
	this.getFunc = getFunc;
	this.getName = getName;
	this.getGroup = getGroup;
	this.getPlugin = getPlugin;
	this.getPluginComp = getPluginComp;
	this.setPluginComp = setPluginComp;
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
	
	if (displayMode == true) scale = 0.75;
	else scale = 1;
	
	// make a custom shape for the triangle; just three lines
	gateShapeTriangle = new Kinetic.Shape({
			drawFunc : function (context) {
				// begin custom shape
				context.beginPath();
				context.moveTo(scale * 50, scale * 0);
				context.lineTo(scale * 50, scale * 50);
				context.lineTo(scale * 100, scale * 25);
				context.lineTo(scale * 50, scale * 0);
				// complete custom shape
				context.closePath();
				// KineticJS specific context method
				context.fillStrokeShape(this);
			},
			stroke : 'black',
			strokeWidth : 1
		});
		
	 // create the circle
	 gateShapeCircle = new Kinetic.Circle({
        x: scale * 107,
        y: scale * 25,
        radius: scale * 7,
        stroke: 'black',
        strokeWidth: 1
      });

	// the line associated with the NOT gate's input
	plugin = new Kinetic.Line({
			points : [scale * 12, scale * 25, scale * 50, scale * 25],
			stroke : 'black',
			strokeWidth : 1,
			lineCap : 'round',
			lineJoin : 'round'
		});

	// the line associated with the NOT gate's output
	plugout = new Kinetic.Line({
			points : [scale * 114, scale * 25, scale * 146, scale * 25],
			stroke : 'black',
			strokeWidth : 1,
			lineCap : 'round',
			lineJoin : 'round'
		});

	// the transparent rectangle
	transFg = new Kinetic.Rect({
		x: scale * 12,
		y: scale * 0,
		width: plugout.getPoints()[1].x - plugin.getPoints()[0].x,
		height: scale * 50
	});

	// create the group at the x,y coords passed to this object
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

	// draw the NOT gate
	this.draw = draw;
	function draw() {
		// add each component to the group
		group.add(gateShapeTriangle);	// the triangle
		group.add(gateShapeCircle);		// ... the circle
		group.add(plugin);				// ... the plugin line
		group.add(plugout);				// ... the plugout line
		group.add(transFg);				// and finally the transparent foreground
		mainLayer.add(group);			// add this group to the main layer
		stage.draw();					// call draw on the stage to redraw its components
	}
	
	// accessor for this gate's type
	function getType() { return "not"; }
	
	function getID() { return ID; }
	
	// accessor for this gate's function
	function getFunc() { return "gate"; }
	
	// accessor for this gate's name
	function getName() { return name; }
	
	// accessor for this gate's group
	function getGroup() { return group; }

	// returns the line for the plugin in GLOBAL coordinates; used in the controller for drawing wires (the controller functions in global coordinates; which makes sense)
	function getPlugin() {
		var line = new Kinetic.Line({
			points: [group.getX() + plugin.getPoints()[0].x, group.getY() + plugin.getPoints()[0].y, group.getX() + plugin.getPoints()[1].x, group.getY() + plugin.getPoints()[1].y]
		});
		
		return line;
	}
	
	// accessor for the component that the NOT gate's input is connected to (the component before the NOT gate)
	function getPluginComp() { return pluginComp; }
	
	// return the line for the plugout in GLOBAL coordinates; same concept as plugin line
	function getPlugout() {
		var line = new Kinetic.Line({
			points: [group.getX() + plugout.getPoints()[0].x, group.getY() + plugout.getPoints()[0].y, group.getX() + plugout.getPoints()[1].x, group.getY() + plugout.getPoints()[1].y]
		});
		
		return line;
	}
	
	// accessor for the wire (line) that connects the plugout to a component for output
	function getPlugoutWire() { return plugoutWire;	}
	
	// mutator for the wire (line) that connects the plugout to a component for output
	function setPlugoutWire(line) { plugoutWire = line;	}
	
	// accessor for the component connected to the OR gate's output
	function getPlugoutComp() { return plugoutComp; }
	
	// sets the component that the OR gate is connected to
	function setPlugoutComp(comp) { plugoutComp = comp; evaluate();	}
	
	// set the plugin component to NULL (used in disconnection)
	function setPluginCompNull() { pluginComp = null; pluginVal = -1; evaluate(); }
	
	// set the plugin component to the component passed as parameter
	this.setPluginComp = setPluginComp;
	function setPluginComp(comp) { pluginComp = comp; comp.evaluate(); }
	
	// add a value to this AND gate's input values (used in computing the output of the circuit); these two values will be OR'ed together
	function setPluginVal(comp, val) {
		pluginVal = val;
		if (pluginVal == 1) {
			plugin.setStroke("red");
			gateShapeTriangle.setFill("blue"); gateShapeCircle.setFill("blue");
		}
		else {
			plugin.setStroke("blue");
			gateShapeTriangle.setFill("red"); gateShapeCircle.setFill("red");
		}
		evaluate();
	}
	
	// evaluate this gate; AND the two values in pluginVals, and send the output to the next component
	function evaluate() {
		var res = 0;
		if (pluginVal == 0) res = 1;
		else if(pluginVal == -1) res = -1;
		
		if (plugoutComp !== null) {
			plugoutComp.setPluginVal(thisObj, res);
			setPlugoutWireColor();
		}
	}

	function probe() {
		var str = "!";
		if (pluginComp !== null) {
			str += pluginComp.probe();
			return str;
		}
		else return null;
	}
	
	function setPlugoutWireColor() {
		if (pluginVal == 0) { plugout.setStroke("red"); plugoutWire.setStroke("red"); gateShapeTriangle.setFill("red"); gateShapeCircle.setFill("red"); }
		else { plugout.setStroke("blue"); plugoutWire.setStroke("blue"); gateShapeTriangle.setFill("blue"); gateShapeCircle.setFill("blue"); }
	}
}
