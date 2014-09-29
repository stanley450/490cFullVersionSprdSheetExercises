function SB_Setup(container, containerNum, exerNum) {
	var timeout = false;
	var ratio;
	
	this.getMainLayer = getMainLayer;
	this.getWrenchLayer = getWrenchLayer;
	this.getTrashLayer = getTrashLayer;
	this.getStage = getStage;
	this.getBG = getBG;
	this.resetExercise = resetExercise;
	this.deleteComponent = deleteComponent;
	this.saveExercise = saveExercise;
	
	var defaultWidth = 880;
	var width = 880;
	var height = 600;
	var thisObj = this;
	
	var stage = new Kinetic.Stage({
			container : container,
			width : width,
			height : height
		});

	//var mainLayer = new Kinetic.Layer();
	var mainLayer = new Kinetic.PinchLayer({ container: stage, width: stage.getWidth(), height: stage.getHeight() });
	//mainLayer.setDraggable("draggable");
	//stage.add(mainLayer);
	
	var wrenchLayer = new Kinetic.Layer();
	stage.add(wrenchLayer);
	
	var trashLayer = new Kinetic.Layer();
	stage.add(trashLayer);
	
	var bg = new Kinetic.Rect({
		x : 0,
		y : 0,
		width : width,
		height : height
	});
	
	mainLayer.add(bg);

	resize();
	
	var curExercise = exerNum;
	var truthTable = new SB_TruthTable(containerNum);
	var serializer = new SB_Serializer(curExercise);
	var controller = new SB_Controller(this, truthTable, serializer, containerNum);
	var exercises = new SB_Exercises(stage, this, truthTable, controller);

	exercises.setExercise(curExercise);
	
	var dataStore;
	if(typeof(Storage) !== "undefined")
	{
		//var str = localStorage.getItem("DL_SB_" + curExercise);
		dataStore = new DataStore();
		//dataStore.eraseExerciseData("circuits", curExercise);
		
		var str = dataStore.loadExerciseData("circuits", curExercise);
		if (str !== null) {
			console.log(str);
			serializer.deserialize(controller, str);
			controller.evaluateCircuit();
		}
		else controller.evaluateCircuit();
	}
	else
	{
		console.log("Web storage not supported.");
		// no web storage support
	}
	controller.initTruthTableListeners();
	
	/* Watson Dialogs would mess up the truth table unless I initialized their visibility here */
	controller.toggleTruthTableVisibility();	// toggle once for everything to initialize
	controller.toggleTruthTableVisibility();	// toggle again for it to disappear
	
	$(window).resize( function() {
		if (timeout == false) {
			timeout = true;
			setTimeout(resize, 200);
		}
	});
	
	function resize() {
		//var width = (window.innerWidth > defaultWidth) ? defaultWidth : window.innerWidth;
		// Burt, uncomment the next line (line 54) and comment the previous line (line 52)
		var width = (document.getElementById(container).offsetWidth > defaultWidth) ? defaultWidth : document.getElementById(container).offsetWidth;
		
		ratio = (width / defaultWidth);
		//console.log("Ratio: " + ratio);
		stage.scale({x: ratio, y: ratio});
		stage.size({ width: defaultWidth * ratio, height: 600 * ratio });
		//stage.setSize(defaultWidth, 600 * ratio);
		//console.log("Size: " + stage.getWidth() + ", " + stage.getHeight());
		
		timeout = false;
	}
	
	function resetExercise(numInputs, numOutputs) {
		dataStore.eraseExerciseData("circuits", curExercise);
		var table = document.getElementById("truthTable" + containerNum);
		var image = document.getElementById("tableDeleteIcon" + containerNum);
		
		if (table) {
			table.id = "";
			table.parentNode.removeChild(table);
		}
		
		if(image){
			image.id = '';
			image.parentNode.removeChild(image);
		}
		container.innerHTML = "";
		width = 880;
		height = 600;
		stage = new Kinetic.Stage({
			container : container,
			width : width,
			height : height
		});
		mainLayer = new Kinetic.Layer();
		stage.add(mainLayer);
		wrenchLayer = new Kinetic.Layer();
		stage.add(wrenchLayer);
		trashLayer = new Kinetic.Layer();
		stage.add(trashLayer);
		bg = new Kinetic.Rect({
			x : 0,
			y : 0,
			width : width,
			height : height
		});
		mainLayer.add(bg);
		resize();
		truthTable = new SB_TruthTable(containerNum);
		serializer = new SB_Serializer(curExercise);
		controller = new SB_Controller(thisObj, truthTable, serializer, numInputs, numOutputs, containerNum);
		exercises = new SB_Exercises(stage, thisObj, truthTable, controller, numInputs, numOutputs);
		exercises.setExercise(0);
		controller.initTruthTableListeners();
	}
	
	function getMainLayer() { return mainLayer; }
	
	function getTrashLayer() { return trashLayer; }
	
	function getWrenchLayer() { return wrenchLayer; }
	
	function getStage() { return stage; }
	
	function getBG() { return bg; }
	
	function deleteComponent(comp) {
		controller.deleteComponent(comp);
	}
	
	function saveExercise() {
		controller.saveExercise();
	}
	
}
