/**************************************************************************************
*	Author:		Neil Vosburg
*	Class:		AndGate.js
*
*	Behavior:	This class represents the functionality of an AND gate. The class contains
*				variables for "plugins", "plugout", "plugoutWire", and "plugoutComp".
*				Plugins for the AND gate are the two input lines. The AND gate has one plugout
*				which is the one line associated with its output. The plugout wire is
*				associated with the line that runs to the component it is connected to
*				from its plugout. The "plugoutComp" stands for plugout component, which is
*				the components the AND gate outputs to. Note that this class and the OrGate
*				class is very similar (the only major difference is the evaluate function).
***************************************************************************************/

function SB_AndGate(initX, initY, setName, id, setup) {
	
	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; VARIABLE DECLARATIONS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	
	var plugin1 = null;				// the first (top) input line
	var plugin1Val = -1;
	var connectorPlugin1;			// if this gate's plugin1 is connected to a connector, this keeps track of the plugout number of the connector it is connected to
	var plugin1Comp = null;			// the component that is connected to plugin1
	
	var plugin2 = null;				// the second (bottom) input line
	var plugin2Val = -1;
	var connectorPlugin2;			// if this gate's plugin2 is connected to a connector, this keeps track of the plugout number of the connector it is connected to
	var plugin2Comp = null;			// the component that is connected to plugin2

	var plugout = null;				// the output line
	var plugoutWire = null;			// the wire the connects the output to the input of another gate
	var plugoutComp = null;			// the component this gate's output is connected to
	
	var name = setName;				// the name of this gate
	var ID = id;					// the ID of this gate
	
	var group;						// the group that all of the AND gate's components are added to
	var gateShape;					// the custom shape for the AND gate
	var input1Box;
	var input2Box;
	var outputBox;
	
	var transFg;					// a transparent foreground for the AND gate
	
	var deleteImg;
	
	var stage = setup.getStage();
	var mainLayer = setup.getMainLayer();
	var iconLayer = new Kinetic.Layer();
	stage.add(iconLayer);
	var thisObj = this;
	var mouseOver = 'pointer';
	var deleteImg;
	var scale = 0.75;

	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; FUNCTION DECLARATIONS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	
	this.draw = draw;
	this.getType = getType;
	this.getFunc = getFunc;
	this.getName = getName;
	this.getID = getID;
	this.getGroup = getGroup;
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
	this.setPlugColor = setPlugColor;
	this.deleteOutputConnection = deleteOutputConnection;
	this.setPlugoutWireColor = setPlugoutWireColor;
	this.drawBoxes = drawBoxes;
	this.getInputBox = getInputBox;
	this.getOutputBox = getOutputBox;
	this.setMouseOver = setMouseOver;
	this.toggleDeleteIcon = toggleDeleteIcon;
	this.setPluginColor = setPluginColor;
	this.deleteSelf = deleteSelf;
	this.getOutputValue = getOutputValue;
	this.getInputBoxCoords = getInputBoxCoords;
	this.getOutputBoxCoords = getOutputBoxCoords;
	this.setDeleteIcon = setDeleteIcon;
	this.loopCheckForward = loopCheckForward;
	this.loopCheckBackward = loopCheckBackward;
	this.getSerialStringDeclaration = getSerialStringDeclaration;
	this.getSerialStringConnections = getSerialStringConnections;
	this.getPluginNumber = getPluginNumber;
	this.toggleHitBoxes = toggleHitBoxes;
	
	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; VARIABLE ASSIGNMENTS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	
	// a custom shape to draw the AND gate; composed of one quadratic curve and a line
	gateShape = new Kinetic.Shape({
			drawFunc : function (context) {
				// begin custom shape
				context.beginPath();
				context.moveTo(scale * 50, 0);
				context.lineTo(scale * 60, 0);
				context.quadraticCurveTo(scale * 85, 0, scale * 90, scale * 20);
				context.quadraticCurveTo(scale * 85, scale * 40, scale * 60, scale * 40);
				context.lineTo(scale * 50, scale * 40);
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
			points : [scale * 25,  scale * 10,  scale * 50,  scale * 10],
			stroke : 'black',
			strokeWidth : 1,
			lineCap : 'round',
			lineJoin : 'round'
		});

	// the line for the second plugin
	plugin2 = new Kinetic.Line({
			points : [scale * 25, scale * 30, scale * 50, scale * 30],
			stroke : 'black',
			strokeWidth : 1,
			lineCap : 'round',
			lineJoin : 'round'
		});

	// the line for the plugout
	plugout = new Kinetic.Line({
			points : [scale * 90, scale * 20, scale * 115, scale * 20],
			stroke : 'black',
			strokeWidth : 1,
			lineCap : 'round',
			lineJoin : 'round'
		});

	// create the transparent rectangle that makes it easy to click the AND gate		
	transFg = new Kinetic.Rect({
		x:  scale * 50,
		y:  -3,
		width: 50 - plugin1.points()[0],
		height: scale * plugin2.points()[1] + scale * 26
	});

	// create the group for the components that make up the AND gate; place it at the x,y coords passed to the object
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
	
	//setDeleteIcon("images/delete.ico");
	//setDeleteIcon("images/empty.bmp");
	
	iconLayer.on('mouseover', function() { document.body.style.cursor = 'pointer'; });
	iconLayer.on('mouseout', function() { document.body.style.cursor = 'default'; });
	
	iconLayer.on('click tap', function() {
		setup.deleteComponent(thisObj);
	});
	
	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; FUNCTION IMPLEMENTATIONS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

	// draw the AND gate
	function draw() {
		// add each component to the group
		group.add(gateShape);	// the custom gate shape
		group.add(plugin1);		// ... the first plugin
		group.add(plugin2);		// ... the second plugin
		group.add(plugout);		// ... the plugout
		group.add(transFg);		// and finally the transparent foreground
		mainLayer.add(group);	// add the group to the main layer
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
		input1Box.remove();
		input2Box.remove();
		outputBox.remove();
		iconLayer.remove();
		setDeleteIcon("images/empty.bmp");
	}
	
	function getInputBoxCoords(num) {
		var pos;
		var box;
		if (num == 1) { pos = input1Box.getAbsolutePosition(); box = input1Box; }
		else { pos = input2Box.getAbsolutePosition(); box = input2Box; }
		
		return { x1: pos.x, x2: pos.x + box.getWidth(), y1: pos.y, y2: pos.y + box.getHeight() };
	}
	
	function getOutputBoxCoords() {
		var pos = outputBox.getAbsolutePosition();
		var corners = [];
		
		return { x1: pos.x, x2: pos.x + outputBox.getWidth(), y1: pos.y, y2: pos.y + outputBox.getHeight() };
	}
	
	function drawBoxes() {
		var plug;
		if (input1Box) {
			plug = getPlugin(1);
			input1Box.position({ x: plug.points()[0] - (scale * 10), y: plug.points()[1] - (scale * 15) });
			plug = getPlugin(2);
			input2Box.position({ x: plug.points()[0] - (scale * 10), y: plug.points()[1] - (scale * 9) });
			plug = getPlugout();
			outputBox.position({ x: plug.points()[0] - (scale * 0), y: plug.points()[1] - (scale * 20) });
		}
		else {
			plug = getPlugin(1);
			input1Box = new Kinetic.Rect({
				x: plug.points()[0] - (scale * 10),
				y: plug.points()[1] - (scale * 15),
				width: (plug.points()[2] - plug.points()[0]) + 5,
				height: scale * 24
			});
			
			plug = getPlugin(2);
			input2Box = new Kinetic.Rect({
				x: plug.points()[0] - (scale * 10),
				y: plug.points()[1] - (scale * 9),
				width: (plug.points()[2] - plug.points()[0]) + 5,
				height: scale * 24
			});
			
			plug = getPlugout();
			outputBox = new Kinetic.Rect({
				x: plug.points()[0] - (scale * 0),
				y: plug.points()[1] - (scale * 20),
				width: (plug.points()[2] - plug.points()[0]) + 5,
				height: scale * 40
			});
			
			
			mainLayer.add(input1Box);
			mainLayer.add(input2Box);
			mainLayer.add(outputBox);
			stage.draw();
		}
	}
	
	function toggleHitBoxes(bool) {
		if (bool == true) {
			input1Box.setStroke("green");
			input1Box.setStrokeWidth(1);
			input2Box.setStroke("green");
			input2Box.setStrokeWidth(1);
			outputBox.setStroke("green");
			outputBox.setStrokeWidth(1);
		}
		else {
			input1Box.setStroke('rgba(0,0,0,0)');
			input2Box.setStroke('rgba(0,0,0,0)');
			outputBox.setStroke('rgba(0,0,0,0)');
		}
	}

	function setMouseOver(str) { mouseOver = str; console.log("Mouse over: " + str); }
	
	function toggleDeleteIcon(bool) {
		if (bool) setDeleteIcon("images/delete.ico");
		else setDeleteIcon("images/empty.bmp");
	}
	
	function getInputBox(num) {
		if (num == 1) return input1Box;
		else if (num == 2) return input2Box;
	}
	
	function getOutputBox() {
		return outputBox;
	}
	
	// accessor for the gate type
	function getType() { return "and"; }
	
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
				//points: [mainLayer.getX() + group.getX() + plugin1.points()[0].x, mainLayer.getY() + group.getY() + plugin1.points()[0].y, mainLayer.getX() + group.getX() + plugin1.points()[1].x, mainLayer.getY() +  group.getY() + plugin1.points()[1].y]
				points: [group.position().x + plugin1.points()[0], group.position().y + plugin1.points()[1], group.position().x + plugin1.points()[2], group.position().y + plugin1.points()[3]]

			});
		}
		else {
			line = new Kinetic.Line({
				// same concept as above; must transform coordinates to global coordinates
				//points: [mainLayer.getX() + group.getX() + plugin2.points()[0].x, mainLayer.getY() + group.getY() + plugin2.points()[0].y, mainLayer.getX() + group.getX() + plugin2.points()[1].x, mainLayer.getY() + group.getY() + plugin2.points()[1].y]
				points: [group.position().x + plugin2.points()[0], group.position().y + plugin2.points()[1], group.position().x + plugin2.points()[2], group.position().y + plugin2.points()[3]]

			});
		}
		
		return line;
	}
	
	// accessor for a connector plugin number (recall that connectorPlugin# is for when a plugin is connected to a connector)
	function getConnectorPlugin(num) {
		if (num == 1) return connectorPlugin1;
		else if (num == 2) return connectorPlugin2;
	}
	
	// mutator for a connector plugin (this is called when the AND gate's input is connected to a connector)
	function setConnectorPlugin(pluginNum, plugoutNum) {
		if (pluginNum == 1) connectorPlugin1 = plugoutNum;
		else if (pluginNum == 2) connectorPlugin2 = plugoutNum;
	}
	
	// accessor for the component connected to the AND gate's input (the component before the AND gate)
	function getPluginComp(num) {
		if (num == 1) return plugin1Comp;
		else if (num == 2) return plugin2Comp;
	}
	
	// return the line for the plugout in GLOBAL coordinates; same concept as plugin lines
	function getPlugout() {
		var line = new Kinetic.Line({
			//points: [mainLayer.getX() * mainLayer.getScale().x + group.getX() + plugout.points()[0].x, mainLayer.getY()  * mainLayer.getScale().y + group.getY() + plugout.points()[0].y, mainLayer.getX() * mainLayer.getScale().x + group.getX() + plugout.points()[1].x, mainLayer.getY() * mainLayer.getScale().y + group.getY() + plugout.points()[1].y]
				points: [group.position().x + plugout.points()[0], group.position().y + plugout.points()[1], group.position().x + plugout.points()[2], group.position().y + plugout.points()[3]]
		});
				
		return line;
	}
	
	// accessor for the wire (line) that connects the plugout to a component for output
	function getPlugoutWire() { return plugoutWire;	}
	
	// mutator for the wire (line) that connects the plugout to a component for output
	function setPlugoutWire(line) { plugoutWire = line;	}
	
	// accessor for the component connected to the AND gate's output
	function getPlugoutComp() { return plugoutComp; }
	
	// sets the component that the AND gate is connected to
	function setPlugoutComp(comp) { plugoutComp = comp; evaluate();	}
	
	// set a plugin to NULL that equals the given component passed as parameter (used in disconnection)
	function setPluginCompNull(comp)
	{
		if (plugin1Comp == comp) {
			plugin1Comp = null;
			plugin1.setStroke("black");
			plugin1Val = -1;
		}
		
		if (plugin2Comp == comp) {
			plugin2Comp = null;
			plugin2.setStroke("black");
			plugin2Val = -1;
		}
		
		evaluate();
	}
	
	function getOutputValue() {
		if (plugin1Val == -1 || plugin2Val == -1) return -1;
		else {
			if (plugin1Val == 1 && plugin2Val == 1) return 1;
			else return 0;
		}
	}
	
	// set the component that the AND gate's input is connected to
	function setPluginComp(num, comp) {
		if (num == 1) plugin1Comp = comp;
		else if (num == 2) plugin2Comp = comp;
		
		if (comp !== null) comp.evaluate();
		else {
			if (num == 1) { plugin1.setStroke("black"); plugin1Val = -1; }
			else { plugin2.setStroke("black"); plugin2Val = -1; }
	
			evaluate();
		}
	}
	
	// add a value to this AND gate's input values (used in computing the output of the circuit); these two values will be OR'ed together
	function setPluginVal(comp, val) {
		if (comp == plugin1Comp && comp == plugin2Comp) { plugin1Val = val; plugin2Val = val; }
		else if (comp == plugin1Comp) plugin1Val = val;
		else if (comp == plugin2Comp) plugin2Val = val;
		
		evaluate();
	}
	
	function setPluginColor(comp, color) {
		if (comp == plugin1Comp) plugin1.setStroke(color);
		if (comp == plugin2Comp) plugin2.setStroke(color);
		mainLayer.draw();
	}
	
	// evaluate this gate; AND the two values in pluginVals, and send the output to the next component
	function evaluate() {
		if (plugin1Val != -1 && plugin2Val != -1) {
			var res = 0;
			if (plugin1Val == 1 && plugin2Val == 1) res = 1;
			
			var color = "blue";
			if (res == 1) color = "red";
			if (plugoutComp !== null) {
				setPlugColor("plugout", color);
				plugoutWire.setStroke(color);
				plugoutComp.setPluginColor(thisObj, color);
				plugoutComp.setPluginVal(thisObj, res);
			}
			else {
				plugout.setStroke(color);
			}
			gateShape.setFill(color);
		}
		else {
			if (plugoutComp !== null) {
				plugoutComp.setPluginVal(thisObj, -1);
				setPlugColor("plugout", "black");
				plugoutWire.setStroke("black");
				plugoutComp.setPluginColor(thisObj, "black");
			}
			else {
				setPlugColor("plugout", "black");
			}
			gateShape.setFill("#ffffff");
		}
	}
	
	function probe() {
		var str = "(";
		if (plugin1Comp !== null && plugin2Comp !== null) {
			str += plugin1Comp.probe();
			str += " * ";
			str += plugin2Comp.probe();
			str += ")";
			return str;
		}
		else return null;
	}
	
	function setPlugoutWireColor(color) {
		if (color != "default") plugoutWire.setStroke(color);
		else evaluate();
	}
	
	function setPlugColor(plugStr, color) {
		if (plugStr == "plugin1") {
			if (color == "default" && plugin1Comp !== null) plugin1Comp.evaluate();
			else if (color == "default" && plugin1Comp === null) plugin1.setStroke("black");
			else plugin1.setStroke(color);
		}
		else if (plugStr == "plugin2") {
			if (color == "default" && plugin2Comp !== null) plugin2Comp.evaluate();
			else if (color == "default" && plugin2Comp === null) plugin2.setStroke("black");
			else plugin2.setStroke(color);
		}
		else if (plugStr == "plugout") {
			if (color == "default") evaluate();
			else plugout.setStroke(color);
		}	
	}
	
	function deleteOutputConnection() {
		plugoutComp.setPluginVal(thisObj, -1);
		plugoutComp.setPluginCompNull(thisObj);
		plugoutWire.stroke(null);
		plugoutComp = null;
		plugoutWire = null;
	}
	
	function loopCheckForward(comp) {
		var result = false;
		
		if (plugoutComp !== null && plugoutComp == comp) return true;
		if (plugoutComp !== null) result = plugoutComp.loopCheckForward(comp);
		
		return result;
	}
	
	function loopCheckBackward(comp) {
		var result1, result2;
		if (plugin1Comp !== null && plugin1Comp == comp) return true;
		if (plugin2Comp !== null && plugin2Comp == comp) return true;
		
		if (plugin1Comp !== null) result1 = plugin1Comp.loopCheckBackward(comp);
		if (plugin2Comp !== null) result2 = plugin2Comp.loopCheckBackward(comp);
		
		if (result1 || result2) return true;
		else return false;
	}
	
	function getSerialStringDeclaration() {
		var str = "and," + group.getX() + "," + group.getY() + "," + ID;
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
	
	function getPluginNumber(comp, plugoutNum) {
		if (comp.getType() == "connector") {
			if (comp == plugin1Comp && connectorPlugin1 == plugoutNum) return 1;
			else if (comp == plugin2Comp && connectorPlugin2 == plugoutNum) return 2;
		}
		else {
			if (plugin1Comp !== null && plugin1Comp == comp) return 1;
			else if (plugin2Comp !== null &&plugin2Comp == comp) return 2;
		}
	}
}
