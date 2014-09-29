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

function SB_NotGate(initX, initY, setName, id, setup) {

	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; VARIABLE DECLARATIONS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	
	var plugin = null;				// the line associated with the NOT gate's input
	var pluginVal = -1;
	var pluginComp = null;			// the component that is connected to the NOT gate's input (the component before the NOT gate)
	var connectorPlugin;

	var plugout = null;				// the line associated with the NOT gate's output
	var plugoutComp = null;			// the component that the NOT gate's output is connected to
	var plugoutWire = null;			// the wire (line) that is drawn for the NOT gate's output to the input of another component

	var name = setName;				// the name for this gate
	var ID = id;					// the ID of this gate
	
	var group;						// the group that all of the NOT gate's components will be added to
	var gateShapeTriangle;			// the triangle that is used to draw the NOT gate
	var gateShapeCircle;			// the circle that is used to draw the NOT gate
	var inputBox;
	var outputBox;
	var transFg;					// a transparent foreground that makes the NOT gate easier to click
	
	var stage = setup.getStage();
	var mainLayer = setup.getMainLayer();
	var iconLayer = new Kinetic.Layer(); stage.add(iconLayer);
	var thisObj = this;
	var mouseOver = 'pointer';
	var deleteImg;
	var scale = 0.75;
	
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
	this.setPlugColor = setPlugColor;
	this.getConnectorPlugin = getConnectorPlugin;
	this.setConnectorPlugin = setConnectorPlugin;
	this.drawBoxes = drawBoxes;
	this.getInputBox = getInputBox;
	this.getOutputBox = getOutputBox;
	this.deleteOutputConnection = deleteOutputConnection;
	this.setPlugoutWireColor = setPlugoutWireColor;
	this.setMouseOver = setMouseOver;
	this.toggleDeleteIcon = toggleDeleteIcon;
	this.setPluginColor = setPluginColor;
	this.deleteSelf = deleteSelf;
	this.getOutputValue = getOutputValue;
	this.setDeleteIcon = setDeleteIcon;
	this.getInputBoxCoords = getInputBoxCoords;
	this.getOutputBoxCoords = getOutputBoxCoords;
	this.loopCheckForward = loopCheckBackward;
	this.loopCheckBackward = loopCheckBackward;
	this.getSerialStringDeclaration = getSerialStringDeclaration;
	this.getSerialStringConnections = getSerialStringConnections;
	this.toggleHitBoxes = toggleHitBoxes;
	
	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; VARIABLE ASSIGNMENTS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	// make a custom shape for the triangle; just three lines
	gateShapeTriangle = new Kinetic.Shape({
			drawFunc : function (context) {
				// begin custom shape
				context.beginPath();
				context.moveTo(scale * 50,  0);
				context.lineTo(scale * 50, scale * 40);
				context.lineTo(scale * 85, scale * 20);
				context.lineTo(scale * 50,  0);
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
        x:  scale * 93,
        y:  scale * 20,
        radius:  scale * 7,
        stroke: 'black',
        strokeWidth: 1
      });

	// the line associated with the NOT gate's input
	plugin = new Kinetic.Line({
			points : [scale * 25, scale * 20, scale * 50, scale * 20],
			stroke : 'black',
			strokeWidth : 1,
			lineCap : 'round',
			lineJoin : 'round'
		});

	// the line associated with the NOT gate's output
	plugout = new Kinetic.Line({
			points : [scale * 100, scale * 20, scale * 125, scale * 20],
			stroke : 'black',
			strokeWidth : 1,
			lineCap : 'round',
			lineJoin : 'round'
		});

	// the transparent rectangle
	transFg = new Kinetic.Rect({
		x:  scale * 50,
		y:  -5,
		width: 57 - plugin.points()[0].x,
		height:  scale * 50
	});

	// create the group at the x,y coords passed to this object
	group = new Kinetic.Group({
			x : initX,
			y : initY,
			rotationDeg : 0,
			draggable : true
		});
	
	// add cursor styling when the user mouseovers the group
	group.on('mouseover', function () {
		document.body.style.cursor = mouseOver;
	});
	group.on('mouseout', function () {
		if (mouseOver !== "crosshair") document.body.style.cursor = 'default';
	});
	
	//setDeleteIcon("images/empty.bmp");
	
	iconLayer.on('mouseover', function() { document.body.style.cursor = 'pointer'; });
	iconLayer.on('mouseout', function() { document.body.style.cursor = 'default'; });
	
	iconLayer.on('click tap', function() {
		setup.deleteComponent(thisObj);
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
		drawBoxes();
	}

	function setDeleteIcon (image){
         var imageObj = new Image();
		 
		 if (deleteImg) {
			deleteImg.remove();
			deleteImg.destroy();
			mainLayer.draw();
		 }
		 
		 if (image == "images/empty.bmp" && deleteImg) {
			deleteImg = null;
			return;
		}
		
         imageObj.onload = function (){
         deleteImg = new Kinetic.Image({
			  x: scale * 90,
			  y: scale * -15,
			  image: imageObj,
			  scaleX: 0.4,
			  scaleY: 0.4
		 });

         //iconLayer.destroyChildren();
         //iconLayer.add(deleteImg);
         //iconLayer.draw();
			group.add(deleteImg);
			group.draw();
		};
		imageObj.src = image;
    }
	
	function deleteSelf() {
		group.remove();
		inputBox.remove();
		outputBox.remove();
		iconLayer.remove();
		setDeleteIcon("images/empty.bmp");
	}
	
	function getInputBoxCoords(num) {
		var pos;
		var box;
		pos = inputBox.getAbsolutePosition(); box = inputBox;
		
		return { x1: pos.x, x2: pos.x + box.getWidth(), y1: pos.y, y2: pos.y + box.getHeight() };
	}
	
	function getOutputBoxCoords() {
		var pos = outputBox.getAbsolutePosition();
		var corners = [];
		
		return { x1: pos.x, x2: pos.x + outputBox.getWidth(), y1: pos.y, y2: pos.y + outputBox.getHeight() };
	}
	
	function drawBoxes() {
		var plug;
		if (inputBox) {
			plug = getPlugin();
			inputBox.position({ x: plug.points()[0] - scale * 10, y: plug.points()[1] - scale * 20 });
			plug = getPlugout();
			outputBox.position({ x: plug.points()[0] + scale * 3, y: plug.points()[1] - scale * 20 });
		}
		else {
			plug = getPlugin();
			inputBox = new Kinetic.Rect({
				x: plug.points()[0] - scale * 10,
				y: plug.points()[1] - scale * 20,
				width: (plug.points()[2] - plug.points()[0]) + 5,
				height: scale * 40
			});
			
			plug = getPlugout();
			outputBox = new Kinetic.Rect({
				x: plug.points()[0] + scale * 3,
				y: plug.points()[1] - scale * 20,
				width: (plug.points()[2] - plug.points()[0]) + 5,
				height: scale * 40
			});
			
			
			mainLayer.add(inputBox);
			mainLayer.add(outputBox);
			stage.draw();
		}
	}
	
	function toggleHitBoxes(bool) {
		if (bool == true) {
			inputBox.setStroke("green");
			inputBox.setStrokeWidth(1);
			outputBox.setStroke("green");
			outputBox.setStrokeWidth(1);
		}
		else {
			inputBox.setStroke('rgba(0,0,0,0)');
			outputBox.setStroke('rgba(0,0,0,0)');
		}
	}
	
	function setMouseOver(str) { mouseOver = str; }
	
	function toggleDeleteIcon(bool) {
		if (bool) setDeleteIcon("images/delete.ico");
		else setDeleteIcon("images/empty.bmp");
	}
	
	function getInputBox() {
		return inputBox;
	}
	
	function getOutputBox() {
		return outputBox;
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
			points: [group.position().x + plugin.points()[0], group.position().y + plugin.points()[1], group.position().x + plugin.points()[2], group.position().y + plugin.points()[3]]
		});
		
		return line;
	}
	
	// accessor for the component that the NOT gate's input is connected to (the component before the NOT gate)
	function getPluginComp() { return pluginComp; }
	
	// return the line for the plugout in GLOBAL coordinates; same concept as plugin line
	function getPlugout() {
		var line = new Kinetic.Line({
			points: [group.position().x + plugout.points()[0], group.position().y + plugout.points()[1], group.position().x + plugout.points()[2], group.position().y + plugout.points()[3]]
		});
		
		return line;
	}
	
	// accessor for the wire (line) that connects the plugout to a component for output
	function getPlugoutWire() { return plugoutWire;	}
	
	function setPlugoutWireColor(color) {
		if (color != "default") plugoutWire.setStroke(color);
		else evaluate();
	}
	
	function setPlugColor(plugStr, color) {
		if (plugStr == "plugin") plugin.setStroke(color);
		else if (plugStr == "plugout") plugout.setStroke(color);
	}
	
	function setPlugColor(plugStr, color) {
		if (plugStr == "plugin") {
			if (color == "default" && pluginComp !== null) pluginComp.evaluate();
			else if (color == "default" && pluginComp === null) plugin.setStroke("black");
			else plugin.setStroke(color);
		}
		else if (plugStr == "plugout") {
			if (color == "default") evaluate();
			else plugout.setStroke(color);
		}	
	}
	
	// mutator for the wire (line) that connects the plugout to a component for output
	function setPlugoutWire(line) { plugoutWire = line;	}
	
	// accessor for the component connected to the OR gate's output
	function getPlugoutComp() { return plugoutComp; }
	
	// sets the component that the OR gate is connected to
	function setPlugoutComp(comp) { plugoutComp = comp; evaluate();	}
	
	// set the plugin component to NULL (used in disconnection)
	function setPluginCompNull() {
		pluginComp = null;
		pluginVal = -1;
		plugin.setStroke("black");
		evaluate();
	}
	
	// set the plugin component to the component passed as parameter
	this.setPluginComp = setPluginComp;
	function setPluginComp(comp) {
		pluginComp = comp;
		if (comp !== null) comp.evaluate();
		else { pluginVal = -1; evaluate(); }
	}
	
	// add a value to this AND gate's input values (used in computing the output of the circuit); these two values will be OR'ed together
	function setPluginVal(comp, val) {
		pluginVal = val;
		evaluate();
	}
	
	function setPluginColor(comp, color) {
		if (comp == pluginComp) plugin.setStroke(color);
		mainLayer.draw();
	}
	
	// evaluate this gate; AND the two values in pluginVals, and send the output to the next component
	function evaluate() {
		var res = 0;
		if (pluginVal == 0) {
			res = 1;
		}
		else if (pluginVal == -1) res = -1;
		
		var color = "blue";
		if (res == 1) color = "red";
		else if (res == -1) color = "black";
			
		if (plugoutComp !== null) {
			setPlugColor("plugout", color);
			plugoutWire.setStroke(color);
			plugoutComp.setPluginColor(thisObj, color);
			plugoutComp.setPluginVal(thisObj, res);
		}
		else {
			setPlugColor("plugout", color);
		}
		
		if (color == "black") color = "#ffffff";
		gateShapeTriangle.setFill(color);
		gateShapeCircle.setFill(color);
	}

	function probe() {
		var str = "!";
		if (pluginComp !== null) {
			str += pluginComp.probe();
			return str;
		}
		else return null;
	}
	
	function getConnectorPlugin() { return connectorPlugin; }
	
	function setConnectorPlugin(num) { connectorPlugin = num; }
	
	function deleteOutputConnection() {
		plugoutComp.setPluginCompNull(thisObj);
		plugoutWire.stroke(null);
		plugoutComp = null;
		plugoutWire = null;
	}
	
	function getOutputValue() {
		if (pluginVal == -1) return -1;
		else if (pluginVal == 0) return 1;
		else return 0;
	}
	
	function loopCheckForward(comp) {
		var result = false;
		
		if (plugoutComp !== null && plugoutComp == comp) return true;
		if (plugoutComp !== null) result = plugoutComp.loopCheckForward(comp);
		
		return result;
	}
	
	function loopCheckBackward(comp) {
		var result = false;
		
		if (pluginComp !== null && pluginComp == comp) return true;
		
		if (pluginComp !== null) result = pluginComp.loopCheckBackward(comp);
	
		return result;
	}
	
	function getSerialStringDeclaration() {
		var str = "not," + group.getX() + "," + group.getY() + "," + ID;
		return str;
	}
	
	function getSerialStringConnections() {
		if (plugoutComp !== null) {
			var str = ID + "," + plugoutComp.getID();
			if (plugoutComp.getType() == "and" || plugoutComp.getType() == "or") {
				str += "," + plugoutComp.getPluginNumber(thisObj);
			}
			
			return str;
		}
		
		return null;
	}
}
