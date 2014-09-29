function Setup(container, figureNo, draggable, displayMode, exerID) {
	
	var ratio = 1;
	var initHeight;
	var initWidth;
	var initTableWidth;
	var initScale = 1;
	var maxWidth;
	var initOffset;
	var ratio;
	var ratioOverride = false;
	
	this.setStageDimensions = setStageDimensions;
	this.getGScale = getGScale;
	this.setGScale = setGScale;
	this.getMainLayer = getMainLayer;
	this.getStage = getStage;
	this.setStageHeight = setStageHeight;
	//this.setRatio = setRatio;
	this.setInitHeight = setInitHeight;
	this.setInitWidth = setInitWidth;
	this.setMaxWidth = setMaxWidth;
	this.setInitScale = setInitScale;
	this.retrieveUpdates = retrieveUpdates;
	this.getBG = getBG;
	this.solve = solve;
	
	var stage;
	var mainLayer;
	var timeout = false;
	var gScale = 1;
	var truthTable;
	var controller;
	var serializer;
	var figure;
	var thisObj = this;
	var bg;
	
	var width = 880;
	var height = 800;
	
	
		retrieveUpdates();
		
	function retrieveUpdates() {
		stage = new Kinetic.Stage({
			container : container,
			width : width,
			height : height
		});
		
		mainLayer = new Kinetic.Layer();

		bg = new Kinetic.Rect({
				x : 0,
				y : 0,
				width : stage.getWidth(),
				height : stage.getHeight()
		});
		
		stage.add(mainLayer);
		mainLayer.add(bg);
	
		truthTable = new TruthTable(container, figureNo);
		controller = new Controller(thisObj, truthTable, draggable, displayMode, exerID, container);
		serializer = new Serializer();
		if(typeof(Storage) !== "undefined")
		{
			//var str = localStorage.getItem("DL_SB_" + curExercise);
			//var str = localStorage.getItem("DL_SB_" + figureNo);
			
			if (displayMode == true) {
				var dataStore = new DataStore();
				var str = dataStore.loadExerciseData("circuits", figureNo);
				
				if (str) {
					serializer.deserialize(controller, str);
					//controller.evaluateCircuit();
				}
				else {
					//document.getElementById(container).innerHTML = "";
				}
				
				initWidth = 850;
				initHeight = 600;
				ratioOverride = true;
				ratio = 0.75;
				initScale = 0.75;
			}
			else {
				figure = new Figures(thisObj, controller, truthTable);
				figure.setFigure(thisObj, controller, figureNo, width, height, null);
			}
		}
		else
		{
			console.log("Web storage not supported.");
			// no web storage support
		}
		
		setStageDimensions(initWidth, initHeight);
		resizeTop();
	}

	//console.log(width + ", " + height);
	
	$(window).resize( function() {
		if (timeout == false) {
			timeout = true;
			setTimeout(resizeTop, 200);
		}
	});
	
	function setStageDimensions(width, height) {
		stage.setWidth(gScale * width);
		stage.setHeight(gScale * height);
		stage.draw();
	}
	
	function setStageHeight(height) { stage.setHeight(gScale * height); stage.draw(); }
	
	function getStageWidth() { return stage.getWidth(); }
	
	function getGScale() { return gScale; }
	
	function setGScale(num) { gScale = num; controller.refreshScale(); console.log("Setting new scale: " + num); }
	
	function getMainLayer() { return mainLayer; }
	
	function getStage() { return stage; }
	
	function resizeTop() {
		width = document.getElementById(container).offsetWidth;
		if (width == 0) width = document.getElementById("wrapper").offsetWidth;

		if (width == 0) { timeout = false; return; }
		//width = window.innerWidth;
		height = window.innerHeight;
		
		if (!ratioOverride) ratio = width / initWidth;
		else ratioOverride = false;
		
		//console.log("Ratio: " + ratio);
		if (ratio <= initScale) {
			if (displayMode == true && window.innerWidth < 350) ratio = ratio * 0.8;
			stage.setScale(ratio);
			stage.setSize(initWidth * ratio, initHeight * ratio);
			truthTable.setTruthTableScale((ratio * 1.2) * 100, 3, 0);
			truthTable.setTableOffset((width / 2) - (truthTable.getTableWidth() / 2));
		}
		else {
			stage.setScale(initScale);
			stage.setSize(initWidth * initScale, initHeight * initScale);
			if (ratio * (1.5) >= 1) truthTable.setTruthTableScale(100, 6, 0);
			else truthTable.setTruthTableScale((initScale * 1.5) * 100, 6, 0);
			truthTable.setTableOffset((width / 2) - (truthTable.getTableWidth() / 2));
		}
		
		timeout = false;
	}
	
	//initOffset = document.getElementById(container).children[0].getBoundingClientRect().left;
	//initOffset = 400;
	//initTableWidth = truthTable.getTableWidth();
	//resizeSide();
	//ratio = 1;
	
	function resizeSide() {
		width = window.innerWidth;
		//width = document.getElementById("wrapper").offsetWidth;
		height = window.innerHeight;
		
		//var leftOffset = document.getElementById(container).children[0].getBoundingClientRect().left;
		//console.log(leftOffset + maxWidth);
		
		//if (leftOffset >= initOffset) { initOffset = leftOffset; }
		
		var ratio = width / (maxWidth);
		console.log("Ratio: " + ratio);
		if (ratio <= 1) {
			stage.setScale(ratio);
			stage.setSize(initWidth * ratio, initHeight * ratio);
			truthTable.setTableOffset((initWidth * (ratio * 1.05)) - 10);
			if (width <= 400) truthTable.setTruthTableScale((ratio * 0.9) * 100, 1);
			else if (width <= 600) truthTable.setTruthTableScale((ratio * 0.9) * 100, 3);
			else if (width <= 800) truthTable.setTruthTableScale((ratio * 0.9) * 100, 4);
			else truthTable.setTruthTableScale((ratio * 0.9) * 100, 5);
		}
		else {
			stage.setScale(1);
			stage.setSize(initWidth, initHeight);
			truthTable.setTableOffset(initWidth - 10);
			truthTable.setTruthTableScale(100, 5);
		}


		timeout = false;
	}
	
	function setRatio(height, width) { ratio = height / width; }
	
	function setInitWidth(width) { initWidth = width; }
	
	function setInitHeight(height) { initHeight = height; }
	
	function setInitWidth(width) { initWidth = width; }
	
	function setInitScale(scale) { initScale = scale; }
	
	function setMaxWidth(width) { maxWidth = width; }
	
	function getBG() { return bg; }
	
	function solve() {  }
}

//stage = new Kinetic.Stage({container: container, width: width, height: height });
//mainLayer = new Kinetic.Layer({x: 0, y: 0, width: width, height: height });
//bg = new Kinetic.Rect({x: 0, y: 0, width: width, height: height });
//stage.add(mainLayer);
//mainLayer.add(bg);
//inputVals = controller.getInputValues();
//controller = new Controller(thisObj, truthTable);
//figure.setFigure(thisObj, controller, figureNo, width, height, inputVals);
//stage.setScale(ratio);
//stage.setSize(width, height);
//document.getElementById(container).setAttribute("style","height:" + height + "px");
