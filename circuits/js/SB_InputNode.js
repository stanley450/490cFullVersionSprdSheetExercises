function SB_InputNode(initX, initY, setText, initValue, setName, id, setup) {

	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; VARIABLE DECLARATIONS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	
	var value = initValue;
	var plugout = null;
	var plugoutComp = null;
	var plugoutWire = null;
	
	var name = setName;				// the name of the connector
	var ID = id;					// the ID of the connector
	var compShape;					// the shape of the connector (square)
	var outputBox;
	var text;
	var group;						// the group that will be composed of the connector's components
	var transFg;					// the transparent foreground that makes it easy for users to click the connector
	
	var mainLayer = setup.getMainLayer();
	var stage = setup.getStage();
	var thisObj = this;
	var mouseOver = 'pointer';
	var scale = 0.75;
	
	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; FUNCTION DECLARATIONS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	
	this.getPlugout = getPlugout;
	this.getPlugoutComp = getPlugoutComp;
	this.setPlugoutComp = setPlugoutComp;
	this.setPlugoutWire = setPlugoutWire;
	this.getPlugoutWire = getPlugoutWire;
	this.setPlugoutWireColor = setPlugoutWireColor;
	this.setValue = setValue;
	this.getValue = getValue;
	
	this.draw = draw;
	this.drawBoxes = drawBoxes;
	this.getOutputBox = getOutputBox;
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
	this.deleteOutputConnection = deleteOutputConnection;
	this.setMouseOver = setMouseOver;
	this.toggleDeleteIcon = toggleDeleteIcon;
	this.toggleOutputValue = toggleOutputValue;
	this.getOutputValue = getOutputValue;
	this.deleteSelf = deleteSelf;
	this.getInputBoxCoords = getInputBoxCoords;
	this.getOutputBoxCoords = getOutputBoxCoords;
	this.loopCheckBackward = loopCheckBackward;
	this.loopCheckForward = loopCheckForward;
	this.getSerialStringConnections = getSerialStringConnections;
	this.toggleHitBoxes = toggleHitBoxes;
	
	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; VARIABLE ASSIGNMENTS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

	// make the rectangle
    compShape = new Kinetic.Rect({
        x: scale * 15,
        y: scale * 20,
        width: scale * 20,
        height: scale * 10,
        fill: 'blue',
        stroke: 'black',
        strokeWidth: 1
      });
	  
	if (setText.length == 1) {
		text = new Kinetic.Text({
			x:  0,
			y: scale * 14,
			text: setText,
			fontSize: scale * 20,
			fontFamily: 'Calibri',
			fill: 'black'
		});
	}
	else {
		text = new Kinetic.Text({
			x:  (scale * -5 * setText.length),
			y:  scale * 14,
			text: setText,
			fontSize: scale * 20,
			fontFamily: 'Calibri',
			fill: 'black'
		});
	}

	// create the first plugout line
	plugout = new Kinetic.Line({
		points : [scale * 35, scale * 25, scale * 50, scale * 25],
		stroke : 'blue',
		strokeWidth : 1,
		lineCap : 'round',
		lineJoin : 'round'
	});

	// create the transparent rectangle
	transFg = new Kinetic.Rect({
		x: scale * 14,
		y: 0,
		width: scale * 20,
		height: scale * 50
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
		group.add(plugout);		// ... the plugin line
		group.add(transFg);		// and finally the transparent foreground
		mainLayer.add(group);	// add the group to the main layer
		stage.draw();			// call draw on the stage to redraw its components
		drawBoxes();
	}
	
	function getInputBoxCoords() {
		// return null, no input box
		return null;
	}
	
	function getOutputBoxCoords() {
		var pos = outputBox.getAbsolutePosition();
		var corners = [];
		
		return { x1: pos.x, x2: pos.x + outputBox.getWidth(), y1: pos.y, y2: pos.y + outputBox.getHeight() };
	}
	
	function drawBoxes() {
		var plug;
		if (outputBox) {
			plug = getPlugout();
			outputBox.setPosition({ x: plug.points()[0] + scale * 7, y: plug.points()[1] - scale * 20 });
		}
		else {
			plug = getPlugout();
			
			outputBox = new Kinetic.Rect({
				x: plug.points()[0] + scale * 3,
				y: plug.points()[1] - scale * 20,
				width: (plug.points()[2] - plug.points()[0]) + 5,
				height: scale * 40
			});
			
			
			mainLayer.add(outputBox);
			stage.draw();
		}
	}
	
	function toggleHitBoxes(bool) {
		if (bool == true) {
			outputBox.setStroke("green");
			outputBox.setStrokeWidth(1);
		}
		else {
			outputBox.setStroke('rgba(0,0,0,0)');
		}
	}
	
	function setMouseOver(str) { mouseOver = str; }
	
	function getOutputBox() {
		return outputBox;
	}
	
	function deleteSelf() {
		group.remove();
		outputBox.remove();
	}
	
	
	function toggleDeleteIcon() {
		
	}
	
	function getName() { return name; }
	
	function getID() { return ID; }
	
	function getType() { return "input"; }
	
	function getText() { return setText; }
	
	function getFunc() { return "node"; }
	
	function getID() { return ID; }
	
	function getGroup() { return group; }
	
	function getPlugout() {
		var line;
		
		//points: [group.getX() + plugout.getPoints()[0].x, group.getY() + plugout.getPoints()[0].y, group.getX() + plugout.getPoints()[1].x, group.getY() + plugout.getPoints()[1].y]
		line = new Kinetic.Line({
			points: [group.position().x + plugout.points()[0], group.position().y + plugout.points()[1], group.position().x + plugout.points()[2], group.position().y + plugout.points()[3]]
		});
		return line;
	}
	
	function setValue(val) { 
		value = val;
	}
	
	function getValue() { return value; }
	
	function getPlugoutComp() { return plugoutComp; }
	
	function setPlugoutComp(comp) { plugoutComp = comp; evaluate(); }
	
	function getPlugoutWire() { return plugoutWire; }
	
	function setPlugoutWire(line) { plugoutWire = line; }
	
	function setPlugoutWireColor(color) {
		if (color != "default") plugoutWire.setStroke(color);
		else evaluate();
	}
	
	function toggleOutputValue(bool) {
		var color = "blue";
		if (value == 0) {
			value = 1;
			color = "red";
		}
		else value = 0;
		
		compShape.setFill(color);
		setPlugColor("plugout", color);
		if (plugoutComp !== null) {
			plugoutWire.setStroke(color);
			plugoutComp.setPluginColor(thisObj, color);
		}
		if (!bool) {
			evaluate();
		}
	}
	
	function evaluate() {
		var color = "blue";
		if (value == 1) color = "red";
		
		if (plugoutComp !== null) {
			plugoutComp.setPluginVal(thisObj, value);
			plugoutComp.setPluginColor(thisObj, color);
			setPlugColor("plugout", color);
			plugoutWire.setStroke(color);
		}
		else {
			setPlugColor("plugout", color);
		}
	}
	
	function probe() {
		var str = setText;
		return str;
	}
	
	function setPlugColor(plugStr, color) {
		if (plugStr == "plugout") {
			if (color == "default") evaluate();
			else plugout.setStroke(color);
		}
	}
	
	function deleteOutputConnection() {
		plugoutComp.setPluginCompNull(thisObj);
		plugoutWire.stroke(null);
		plugoutComp = null;
		plugoutWire = null;
	}
	
	function getOutputValue() {
		return value;
	}
	
	function loopCheckForward() {
		return false;
	}
	
	function loopCheckBackward() {
		return false;
	}
	
	function getSerialStringConnections() {
		if (plugoutComp !== null) {
			var str = ID + "," + plugoutComp.getID();
			if (plugoutComp.getType() == "and" || plugoutComp.getType() == "or") {
				str += ", " + plugoutComp.getPluginNumber(thisObj);
			}
			
			return str;
		}
		
		return null;
	}
}