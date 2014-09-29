function SB_OutputNode(initX, initY, setText, setName, id, setup) {

	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; VARIABLE DECLARATIONS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	
	var value;
	var plugin = null;
	var pluginVal = -1;
	var pluginComp = null;
	var pluginWire = null;
	var connectorPlugin;
	
	var name = setName;				// the name of the connector
	var ID = id;					// the ID of the connector
	var compShape;					// the shape of the connector (square)
	var inputBox;
	var text;
	var group;						// the group that will be composed of the connector's components
	var transFg;					// the transparent foreground that makes it easy for users to click the connector
	
	var mainLayer = setup.getMainLayer();
	var stage = setup.getStage();
	var mouseOver = 'pointer';
	var scale = 0.75;
	
	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; FUNCTION DECLARATIONS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	
	this.getPlugin = getPlugin;
	this.getPluginComp = getPluginComp;
	this.setPluginComp = setPluginComp;
	this.setPluginVal = setPluginVal;
	this.setPluginCompNull = setPluginCompNull;
	
	this.draw = draw;
	this.drawBoxes = drawBoxes;
	this.getInputBox = getInputBox;
	this.getID = getID;
	this.getName = getName;
	this.getType = getType;
	this.getText = getText;
	this.getFunc = getFunc;
	this.getID = getID;
	this.getGroup = getGroup;
	this.evaluate = evaluate;
	this.probe = probe;
	this.setPlugColor = setPlugColor;
	this.setConnectorPlugin = setConnectorPlugin;
	this.getConnectorPlugin = getConnectorPlugin;
	this.setMouseOver = setMouseOver;
	this.toggleDeleteIcon = toggleDeleteIcon;
	this.setPluginColor = setPluginColor;
	this.deleteSelf = deleteSelf;
	this.getInputBoxCoords = getInputBoxCoords;
	this.getOutputBoxCoords = getOutputBoxCoords;
	this.loopCheckBackward = loopCheckBackward;
	this.loopCheckForward = loopCheckForward;
	this.getSerialStringDeclaration = getSerialStringDeclaration;
	this.toggleHitBoxes = toggleHitBoxes;
	
	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; VARIABLE ASSIGNMENTS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

	// make the rectangle
    compShape = new Kinetic.Rect({
        x: scale * 5,
        y: scale * 20,
        width: scale * 20,
        height: scale * 10,
        stroke: 'black',
        strokeWidth: 1
      });
	  
	text = new Kinetic.Text({
		x: scale * 15,
		y: scale * 0,
		text: setText,
		fontSize: scale * 20,
		fontFamily: 'Calibri',
		fill: 'black'
	});

	// create the first plugout line
	plugin = new Kinetic.Line({
		points : [scale * -10, scale * 25, scale * 5, scale * 25],
		stroke : 'black',
		strokeWidth : 1,
		lineCap : 'round',
		lineJoin : 'round'
	});

	// create the transparent rectangle
	transFg = new Kinetic.Rect({
		x: scale * 0,
		y: scale * 0,
		width: scale * 25,
		height: scale * 40
	});
	
	// create the group object
	group = new Kinetic.Group({
			x :  initX,
			y :  initY,
			rotationDeg : 0
			//draggable : true
		});
	
	// add cursor styling when the user mouseovers the group
	group.on('mouseover', function () {
		document.body.style.cursor = mouseOver;
	});
	group.on('mouseout', function () {
		if (mouseOver !== "crosshair") document.body.style.cursor = 'default';
	});
	
	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; FUNCTION IMPLEMENTATIONS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
		
	// draw the connector
	function draw() {
		// add each of the components to the group
		group.add(compShape);	// the shape
		group.add(text);
		group.add(plugin);		// ... the plugin line
		//group.add(transFg);		// and finally the transparent foreground
		mainLayer.add(group);	// add the group to the main layer
		stage.draw();			// call draw on the stage to redraw its components
		drawBoxes();
	}
	
	function getInputBoxCoords(num) {
		var pos;
		var box;
		pos = inputBox.getAbsolutePosition();
		box = inputBox;
		
		return { x1: pos.x, x2: pos.x + box.getWidth(), y1: pos.y, y2: pos.y + box.getHeight() };
	}
	
	function getOutputBoxCoords() {
		// return null, no output box
		return null;
	}
	
	function drawBoxes() {
		var plug;
		if (inputBox) {
			plug = getPlugin();
			inputBox.setPosition({ x: plug.getPoints()[0] - scale * 0, y: plug.getPoints()[1] - scale * 20 });
		}
		else {
			plug = getPlugin();
			inputBox = new Kinetic.Rect({
				x: plug.getPoints()[0] - scale * 0,
				y: plug.getPoints()[1] - scale * 20,
				width: (plug.getPoints()[2] - plug.getPoints()[0]) + 5,
				height: scale * 40
			});
			
			mainLayer.add(inputBox);
			stage.draw();
		}
	}
	
	function toggleHitBoxes(bool) {
		if (bool == true) {
			inputBox.setStroke("green");
			inputBox.setStrokeWidth(1);
		}
		else {
			inputBox.disableStroke("green");
		}
	}
	
	function getInputBox() {
		return inputBox;
	}
	
	function deleteSelf() {
		group.remove();
		inputBox.remove();
	}
	
	function toggleDeleteIcon() {
	
	}
	
	function setMouseOver(str) { mouseOver = str; }
	
	function getName() { return name; }
	
	function getID() { return ID; }
	
	function getType() { return "output"; }
	
	function getText() { return setText; }
	
	function getFunc() { return "node"; }
	
	function getID() { return ID; }
	
	function getGroup() { return group; }
	
	function getPlugin() {
		var line;
		line = new Kinetic.Line({
			points: [group.position().x + plugin.getPoints()[0], group.position().y + plugin.getPoints()[1], group.position().x + plugin.getPoints()[2], group.position().y + plugin.getPoints()[3]]
		});
		return line;
	}
	
	function getPluginComp() { return pluginComp; }
	
	function setPluginComp(comp) { pluginComp = comp; }
	
	function setPluginCompNull() {
		pluginComp = null;
		pluginVal = -1;
		evaluate();
	}
	
	function setPluginColor(comp, color) {
		if (comp == pluginComp) {
			if (color == "default") evaluate();
			else plugin.setStroke(color);
		}
	}
	
	function setPluginVal(comp, value) {
		pluginVal = value;
		evaluate();
	}
	
	function evaluate() {
		if (pluginVal == -1) {
			compShape.setFill("#ffffff");
			plugin.setStroke("black");
			return;
		}
		
		var color = "blue";
		if (pluginVal == 1) color = "red";
		
		compShape.setFill(color);
		plugin.setStroke(color);
	}
	
	this.getResult = getResult;
	function getResult() {
		return pluginVal;
	}
	
	function probe() {
		var str;
		if (pluginComp !== null) {
			str = pluginComp.probe();
			return str;
		}
		else return null;
	}
	
	function setPlugColor(plugStr, color) {
		if (plugStr == "plugin") {
			if (color == "default") evaluate();
			else plugin.setStroke(color);
		}
	}
	
	function setPlugColor1(plugStr, color) { 
		plugin.setStroke("black");
		if (plugStr == "plugin") plugin.setStroke("green");
	}
	
	function setConnectorPlugin(num) { connectorPlugin = num; }
	
	function getConnectorPlugin() { return connectorPlugin; }
	
	function loopCheckForward() {
		return false;
	}
	
	function loopCheckBackward() {
		return false;
	}
	
	function getSerialStringDeclaration() {
		var str = "and," + group.getX() + "," + group.getY() + "," + ID;
		return str;
	}
}