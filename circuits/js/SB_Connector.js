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

function SB_Connector(initX, initY, setName, id, setup) {
	
	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; VARIABLE DECLARATIONS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	
	var plugin = null;				// the line associated with the input
	var pluginVal = -1;
	var pluginComp = null;			// the component connected to this connector's input
	var connectorPlugin;

	var plugout1 = null;			// the line associated with the first (top) plugin
	var plugout1Wire = null;		// the wire (line) that connects the connector at the component connected to the first plugin
	var plugout1Comp = null;		// the component connected to the connector's first plugin

	var plugout2 = null;			// the line associated with the second (right) plugin
	var plugout2Wire = null;		// the wire (line) that connects the connector at the component connected to the second plugin
	var plugout2Comp = null;		// the component connected to the connector's second plugin
	
	var plugout3 = null;			// the line associated with the third (bottom) plugin
	var plugout3Wire = null;		// the wire (line) that connects the connector at the component connected to the third plugin
	var plugout3Comp = null;		// the component connected to the connector's third plugin
	
	var selectedPlugout;			// the plugout line selected by the controller when making a connection

	var name = setName;				// the name of the connector
	var ID = id;					// the ID of the connector
	var compShape;					// the shape of the connector (square)
	var group;						// the group that will be composed of the connector's components
	var transFg;					// the transparent foreground that makes it easy for users to click the connector
	var inputBox;
	var output1Box;
	var output2Box;
	var output3Box;
	
	var stage = setup.getStage();
	var mainLayer = setup.getMainLayer();
	var iconLayer = new Kinetic.Layer(); stage.add(iconLayer);
	var thisObj = this;
	var mouseOver = 'pointer';
	var deleteImg;

	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; FUNCTION DECLARATIONS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	
	this.draw = draw;
	this.drawBoxes = drawBoxes;
	this.getInputBox = getInputBox;
	this.getOutputBox = getOutputBox;
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
	this.setPlugoutCompNull = setPlugoutCompNull;
	this.getPlugoutWire = getPlugoutWire;
	this.setPlugoutWire = setPlugoutWire;
	this.getSelectedPlugout = getSelectedPlugout;
	this.setSelectedPlugout = setSelectedPlugout;
	this.setPluginComp = setPluginComp;
	this.setPluginCompNull = setPluginCompNull;
	this.setPluginVal = setPluginVal;
	this.evaluate = evaluate;
	this.probe = probe;
	this.setPlugColor = setPlugColor;
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
	this.loopCheckForward = loopCheckForward;
	this.loopCheckBackward = loopCheckBackward;
	this.getSerialStringDeclaration = getSerialStringDeclaration;
	this.getSerialStringConnections = getSerialStringConnections;
	this.getPluginNumber = getPluginNumber;
	this.toggleHitBoxes = toggleHitBoxes;
	
	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; VARIABLE ASSIGNMENTS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	
	// make the rectangle
    compShape = new Kinetic.Rect({
        x:  20,
        y:  20,
        width:  6,
        height:  6,
        stroke: 'black',
        strokeWidth: 1
      });
	   
	// create the plugin line
	plugin = new Kinetic.Line({
		points : [ 4,  23,  19,  23],
		stroke : 'black',
		strokeWidth : 1,
		lineCap : 'round',
		lineJoin : 'round'
	});

	// create the first plugout line
	plugout1 = new Kinetic.Line({
		points : [ 23,  20,  23,  5],
		stroke : 'black',
		strokeWidth : 1,
		lineCap : 'round',
		lineJoin : 'round'
	});

	// create the second plugout line
	plugout2 = new Kinetic.Line({
		points : [ 27,  23,  42,  23],
		stroke : 'black',
		strokeWidth : 1,
		lineCap : 'round',
		lineJoin : 'round'
	});
	
	// create the third plugout line
	plugout3 = new Kinetic.Line({
		points : [ 23,  27,  23,  42],
		stroke : 'black',
		strokeWidth : 1,
		lineCap : 'round',
		lineJoin : 'round'
	});

	// create the transparent rectangle
	transFg = new Kinetic.Rect({
		x:  3,
		y:  3,
		width:  41,
		height:  41
	});
	
	// create the group object
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
		console.log("Here.");
		setup.deleteComponent(thisObj);
	});

	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; FUNCTION IMPLEMENTATIONS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	
	// draw the connector
	function draw() {
		// add each of the components to the group
		group.add(compShape);	// the shape
		group.add(plugin);		// ... the plugin line
		group.add(plugout1);	// ... the first plugin line
		group.add(plugout2);	// ... the second plugin line
		group.add(plugout3);	// ... the third plugin line
		group.add(transFg);		// and finally the transparent foreground
		mainLayer.add(group);	// add the group to the main layer
		stage.draw();			// call draw on the stage to redraw its components
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
			  x: 35,
			  y: -10,
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
		output1Box.remove();
		output2Box.remove();
		output3Box.remove();
		iconLayer.remove();
		setDeleteIcon("images/empty.bmp");
	}
	

	function getInputBoxCoords() {
		var pos;
		var box;
		pos = inputBox.getAbsolutePosition();
		box = inputBox;
		
		return { x1: pos.x, x2: pos.x + box.getWidth(), y1: pos.y, y2: pos.y + box.getHeight() };
	}
	
	function getOutputBoxCoords(num) {
		var pos;
		var box;
		if (num == 1) { pos = output1Box.getAbsolutePosition(); box = output1Box; }
		else if (num == 2) { pos = output2Box.getAbsolutePosition(); box = output2Box; }
		else if (num == 3) { pos = output3Box.getAbsolutePosition(); box = output3Box; }
		
		return { x1: pos.x, x2: pos.x + box.getWidth(), y1: pos.y, y2: pos.y + box.getHeight() };
	}
	
	function drawBoxes() {
		var plug;
		if (inputBox) {
			plug = getPlugin();
			inputBox.position({ x: plug.points()[0] - 16, y: plug.points()[1] - 10 });
			plug = getPlugout(1);
			output1Box.position({ x: plug.points()[0] - 10, y: plug.points()[1] - 27 });
			plug = getPlugout(2);
			output2Box.position({ x: plug.points()[0] + 8, y: plug.points()[1] - 10 });
			plug = getPlugout(3);
			output3Box.position({ x: plug.points()[0] - 10, y: plug.points()[1] + 6 });
		}
		else {
			plug = getPlugin();
			inputBox = new Kinetic.Rect({
				x: plug.points()[0] - 16,
				y: plug.points()[1] - 10,
				width: (plug.points()[2] - plug.points()[0]) + 8,
				height: 18
			});
			
			plug = getPlugout(1);
			output1Box = new Kinetic.Rect({
				x: plug.points()[0] - 10,
				y: plug.points()[1] - 27,
				width: (plug.points()[2] - plug.points()[0]) + 20,
				height: 20
			});
			
			plug = getPlugout(2);
			output2Box = new Kinetic.Rect({
				x: plug.points()[0] + 8,
				y: plug.points()[1] - 10,
				width: (plug.points()[2] - plug.points()[0]) + 8,
				height: 18
			});
			
			plug = getPlugout(3);
			output3Box = new Kinetic.Rect({
				x: plug.points()[0] - 10,
				y: plug.points()[1] + 6,
				width: (plug.points()[2] - plug.points()[0]) + 20,
				height: 20
			});
			
			mainLayer.add(inputBox);
			mainLayer.add(output1Box);
			mainLayer.add(output2Box);
			mainLayer.add(output3Box);
			stage.draw();
		}
	}
	
	function toggleHitBoxes(bool) {
		if (bool == true) {
			inputBox.setStroke("green");
			inputBox.setStrokeWidth(1);
			output1Box.setStroke("green");
			output1Box.setStrokeWidth(1);
			output2Box.setStroke("green");
			output2Box.setStrokeWidth(1);
			output3Box.setStroke("green");
			output3Box.setStrokeWidth(1);
		}
		else {
			inputBox.setStroke('rgba(0,0,0,0)');
			outputBox1.setStroke('rgba(0,0,0,0)');
			outputBox2.setStroke('rgba(0,0,0,0)');
			outputBox3.setStroke('rgba(0,0,0,0)');
		}
	}
	
	function getInputBox() {
		return inputBox;
	}
	
	function getOutputBox(outputNum) {
		if (outputNum == 1) return output1Box;
		else if (outputNum == 2) return output2Box;
		else if (outputNum == 3) return output3Box;
	}
	
	function setMouseOver(str) { mouseOver = str; }
	
	function toggleDeleteIcon(bool) {
		if (bool) setDeleteIcon("images/delete.ico");
		else setDeleteIcon("images/empty.bmp");
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
	function getPlugin() {
		var line;
		line = new Kinetic.Line({
			points: [group.position().x + plugin.points()[0], group.position().y + plugin.points()[1], group.position().x + plugin.points()[2], group.position().y + plugin.points()[3]]
		});
		return line;
	}

	// accessor for the component that the connector's input is connected to (the component before the connector)
	function getPluginComp() { return pluginComp; }
	
	// return a line for the plugout line specified by the parameter (same concept as plugin line; convert coordinates to global coordinates)
	function getPlugout(num)
	{
		var line;
		if (num == 1) {
			line = new Kinetic.Line({
			points: [group.position().x + plugout1.points()[0], group.position().y + plugout1.points()[1], group.position().x + plugout1.points()[2], group.position().y + plugout1.points()[3]]
			});
		}
		else if (num == 2) {
			line = new Kinetic.Line({
			points: [group.position().x + plugout2.points()[0], group.position().y + plugout2.points()[1], group.position().x + plugout2.points()[2], group.position().y + plugout2.points()[3]]
			});
		}
		else {
			line = new Kinetic.Line({
			points: [group.position().x + plugout3.points()[0], group.position().y + plugout3.points()[1], group.position().x + plugout3.points()[2], group.position().y + plugout3.points()[3]]
			});
		}
		return line;
	}
	
	// return the component that is connected to the specified plugout number; we use an array here as two outputs can be connected to the same gate
	function getPlugoutToComp(comp)
	{
		var res = [];
		
		if (comp == plugout1Comp) res.push(1);
		if (comp == plugout2Comp) res.push(2);
		if (comp == plugout3Comp) res.push(3);
		
		return res;
	}
	
	// return the wire (line) that is connected to the specified plugout number that runs to the connected component for that plug
	function getPlugoutWire(num)
	{
		if (num == 1) return plugout1Wire;
		else if(num == 2) return plugout2Wire;
		else return plugout3Wire;
	}
	
	// set the wire (line) that is associated with the specified plugout number
	function setPlugoutWire(num, line)
	{
		if (num == 1) plugout1Wire = line;
		else if (num == 2) plugout2Wire = line;
		else plugout3Wire = line;
	}
	
	// get the component that is connected to the specified plugout
	function getPlugoutComp(num)
	{
		if (num == 1) return plugout1Comp;
		else if (num == 2) return plugout2Comp;
		else return plugout3Comp;
	}
	
	// set the component connected to the specified plugout
	function setPlugoutComp(num, comp)
	{
		if (num == 1) plugout1Comp = comp;
		else if (num == 2) plugout2Comp = comp;
		else plugout3Comp = comp;
		
		evaluate();
	}
	
	function setPlugoutCompNull(comp) {
		if (plugout1Comp == comp) plugout1Comp = null;
		else if (plugout2Comp == comp) plugout2Comp = null;
		else if (plugout3Comp == comp) plguout3Comp = null;
		
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
		plugin.setStroke("black");
		evaluate();
	}
	
	// set the component that is connected to the plugin
	function setPluginComp(comp)
	{
		pluginComp = comp;
		comp.evaluate();
	}
	
	// give the connector an input (only one is needed)
	// add a value to this AND gate's input values (used in computing the output of the circuit); these two values will be OR'ed together
	function setPluginVal(comp, val) {
		pluginVal = val;
		evaluate();
	}
	
	// evaluate this gate; AND the two values in pluginVals, and send the output to the next component
	function evaluate() {
		var thisComp = thisObj;
		
		var color = "blue";
		if (pluginVal == 1) color = "red";
		else if (pluginVal == -1) color = "black";
		
		if (plugout1Comp !== null) {
			plugout1Comp.setPluginVal(thisComp, pluginVal);
			setPlugColor("plugout1", color);
			plugout1Wire.setStroke(color);
			plugout1Comp.setPluginColor(thisObj, color);
		}
		else {
			setPlugColor("plugout1", color);
		}
		
		if (plugout2Comp !== null) {
			plugout2Comp.setPluginVal(thisComp, pluginVal);
			setPlugColor("plugout2", color);
			plugout2Wire.setStroke(color);
			plugout2Comp.setPluginColor(thisObj, color);
		}
		else {
			setPlugColor("plugout2", color);
		}
		
		if (plugout3Comp !== null) {
			plugout3Comp.setPluginVal(thisComp, pluginVal);
			setPlugColor("plugout3", color);
			plugout3Wire.setStroke(color);
			plugout3Comp.setPluginColor(thisObj, color);
		}
		else {
			setPlugColor("plugout3", color);
		}
		
		if (color == "black") color = "#ffffff";
		compShape.setFill(color);
	}
	
	function probe() {
		var str = "";
		if (pluginComp !== null) {
			str += pluginComp.probe();
			return str;
		}
		else return null;
	}
	
	function setPluginColor(comp, color) {
		if (comp == pluginComp) plugin.setStroke(color);
		if (comp == plugout1Comp) plugout1.setStroke(color);
		if (comp == plugout2Comp) plugout2.setStroke(color);
		if (comp == plugout3Comp) plugout3.setStroke(color);
		mainLayer.draw();
	}
	
	function setPlugoutWireColor(plugoutNum, color) {
		if (color == "default") { evaluate(); return; }
		
		if (plugoutNum == 1) plugout1Wire.setStroke(color);
		else if (plugoutNum == 2) plugout2Wire.setStroke(color);
		else if (plugoutNum == 3) plugout3Wire.setStroke(color);
	}
	
	function setPlugColor(plugStr, color) {
		if (plugStr == "plugin") {
			if (color == "default" && pluginComp !== null) pluginComp.evaluate();
			else if (color == "default" && pluginComp === null) plugin.setStroke("black");
			else plugin.setStroke(color);
		}
		else if (plugStr == "plugout1") {
			if (color == "default") evaluate();
			else plugout1.setStroke(color);
		}
		else if (plugStr == "plugout2") {
			if (color == "default") evaluate();
			else plugout2.setStroke(color);
		}
		else if (plugStr == "plugout3") {
			if (color == "default") evaluate();
			else plugout3.setStroke(color);
		}		
	}
	
	function deleteOutputConnection(plugoutNum) {
		var plugoutComp;
		var plugoutWire;
		if (plugoutNum == 1) { plugoutComp = plugout1Comp; plugout1Comp = null; plugout1Wire.stroke(null); plugout1Wire = null }
		else if (plugoutNum == 2) { plugoutComp = plugout2Comp; plugout2Comp = null; plugout2Wire.stroke(null); plugout2Wire = null }
		else if (plugoutNum == 3) { plugoutComp = plugout3Comp; plugout3Comp = null; plugout3Wire.stroke(null); plugout3Wire = null }
		
		if (plugoutComp.getType() == "not" || plugoutComp.getType() == "output" || plugoutComp.getType() == "connector") {
			if (plugoutComp.getType() != "connector") plugoutComp.setConnectorPlugin(-1);
			plugoutComp.setPluginCompNull();
		}
		else {
			var pluginNum;
			if (plugoutComp.getConnectorPlugin(1) == plugoutNum) pluginNum = 1
			else pluginNum = 2;
			console.log("Plugin Num: " + pluginNum);
			plugoutComp.setConnectorPlugin(pluginNum, -1);
			plugoutComp.setPluginComp(pluginNum, null);
		}
	}
	
	function getOutputValue() {
		return pluginVal;
	}
	
	function loopCheckForward(comp) {
		var result = false;
		
		if (plugout1Comp !== null && plugout1Comp == comp) return true;
		if (plugout2Comp !== null && plugout2Comp == comp) return true;
		if (plugout3Comp !== null && plugout3Comp == comp) return true;
		
		if (plugout1Comp !== null) result = plugout1Comp.loopCheckForward(comp);
		if (result) return true;
		
		if (plugout2Comp !== null) result = plugout2Comp.loopCheckForward(comp);
		if (result) return true;
		
		if (plugout3Comp !== null) result = plugout3Comp.loopCheckForward(comp);
		if (result) return true;
		
		return false;
	}
	
	function loopCheckBackward(comp) {
		var result = false;
		
		if (pluginComp !== null && pluginComp == comp) return true;
		
		if (pluginComp !== null) result = pluginComp.loopCheckBackward(comp);
		
		return result;
	}
	
	function getSerialStringDeclaration() {
		var str = "connector," + group.getX() + "," + group.getY() + "," + ID;
		return str;
	}
	
	function getSerialStringConnections() {
		var str = "";
		flag = false;
		
		if (plugout1Comp !== null) {
			str += ID + "," + plugout1Comp.getID() + ",1";
			if (plugout1Comp.getType() == "and" || plugout1Comp.getType() == "or") {
				str += "," + plugout1Comp.getPluginNumber(thisObj, 1);
			}
			flag = true;
		}
		
		if (plugout2Comp !== null) {
			if (flag) str += "\n";

			str += ID + "," + plugout2Comp.getID() + ",2";
			if (plugout2Comp.getType() == "and" || plugout2Comp.getType() == "or") {
				str += "," + plugout2Comp.getPluginNumber(thisObj, 2);
			}
			
			flag = true;
		}
		
		if (plugout3Comp !== null) {
			if (flag) str += "\n";
			
			str += ID + "," + plugout3Comp.getID() + ",3";
			if (plugout3Comp.getType() == "and" || plugout3Comp.getType() == "or") {
				str += "," + plugout3Comp.getPluginNumber(thisObj, 3);
			}
		}
		
		if (str == "") return null
		else return str;
	}
	
	function getPluginNumber(comp) {
		if (plugin1Comp !== null && plugin1Comp == comp) return 1;
		else if (plugin2Comp !== null && plugin2Comp == comp) return 2;
	}
}