function InputNode(initX, initY, setText, initValue, setName, id, setup) {

	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; VARIABLE DECLARATIONS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	
	var value = initValue;
	var plugout = null;
	var plugoutComp = null;
	var plugoutWire = null;
	
	var name = setName;				// the name of the connector
	var ID = id;					// the ID of the connector
	var compShape;					// the shape of the connector (square)
	var text;
	var group;						// the group that will be composed of the connector's components
	var transFg;					// the transparent foreground that makes it easy for users to click the connector
	
	var gScale = setup.getGScale();
	var mainLayer = setup.getMainLayer();
	var stage = setup.getStage();
	var thisObj = this;
	
	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; FUNCTION DECLARATIONS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	
	this.getPlugout = getPlugout;
	this.getPlugoutComp = getPlugoutComp;
	this.setPlugoutComp = setPlugoutComp;
	this.setPlugoutWire = setPlugoutWire;
	this.getPlugoutWire = getPlugoutWire;
	this.toggleValue = toggleValue;
	this.setValue = setValue;
	this.getValue = getValue;
	
	this.draw = draw;
	this.getID = getID;
	this.getName = getName;
	this.getType = getType;
	this.getText = getText;
	this.getFunc = getFunc;
	this.getID = getID;
	this.getGroup = getGroup;
	this.evaluate = evaluate;
	this.probe = probe;
	
	//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; VARIABLE ASSIGNMENTS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

	// make the rectangle
    compShape = new Kinetic.Rect({
        x: gScale * 15,
        y: gScale * 20,
        width: gScale * 20,
        height: gScale * 10,
        fill: 'black',
        stroke: 'black',
        strokeWidth: 1
      });
	  
	if (setText.length == 1) {
		text = new Kinetic.Text({
			x: gScale * 0,
			y: gScale * 14,
			text: setText,
			fontSize: gScale * 20,
			fontFamily: 'Calibri',
			fill: 'black'
		});
	}
	else {
		text = new Kinetic.Text({
			x: gScale * -6,
			y: gScale * 14,
			text: setText,
			fontSize: gScale * 18,
			fontFamily: 'Calibri',
			fill: 'black'
		});
	}
	
	// create the first plugout line
	plugout = new Kinetic.Line({
		points : [gScale * 25, gScale * 25, gScale * 40, gScale * 25],
		stroke : 'black',
		strokeWidth : 1,
		lineCap : 'round',
		lineJoin : 'round'
	});

	// create the transparent rectangle
	transFg = new Kinetic.Rect({
		x: gScale * 0,
		y: gScale * 5,
		width: gScale * 50,
		height: gScale * 50
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
		group.add(text);
		group.add(plugout);		// ... the plugin line
		group.add(transFg);		// and finally the transparent foreground
		mainLayer.add(group);	// add the group to the main layer
		stage.draw();			// call draw on the stage to redraw its components
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
		line = new Kinetic.Line({
			points: [group.getX() + plugout.getPoints()[0].x, group.getY() + plugout.getPoints()[0].y, group.getX() + plugout.getPoints()[1].x, group.getY() + plugout.getPoints()[1].y]
		});
		return line;
	}
	
	function setValue(val) { value = val; evaluate(); }
	function getValue() { return value; }
	function toggleValue() { value = (value == 0) ? 1 : 0; evaluate(); }
	
	function getPlugoutComp() { return plugoutComp; }
	
	function setPlugoutComp(comp) { plugoutComp = comp; evaluate(); }
	
	function getPlugoutWire() { return plugoutWire; }
	
	function setPlugoutWire(line) { plugoutWire = line; }
	
	function evaluate() {
		if (plugoutComp !== null) {
			plugoutComp.setPluginVal(thisObj, value);
			if (value == 0) { plugout.setStroke("blue"); compShape.setFill("blue"); plugoutWire.setStroke("blue"); }
			else { plugout.setStroke("red"); compShape.setFill("red"); plugoutWire.setStroke("red"); }
		}
	}
	
	function probe() {
		var str = setText;
		return str;
	}
}