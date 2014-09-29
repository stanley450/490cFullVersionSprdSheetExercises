function SB_Serializer(curExercise) {
	var compArray;
	var tokArray;
	var nextToken = 0;
	
	this.serialize = serialize;
	this.deserialize = deserialize;
	
	function serialize(compArr, inputs, outputs) {
		var str = "";
		
		str += inputs.length + "\n";
		str += outputs.length + "\n";
		str += (compArr.length - inputs.length - outputs.length) + "\n";
		
		for (var i = 0; i < compArr.length; i++) {
			if (compArr[i].getFunc() != "node") {
				var compStr = compArr[i].getSerialStringDeclaration();
				if (compStr !== null) str += compStr + "\n";
			}
		}
		
		for (var i = 0; i < compArr.length; i++) {
			if (compArr[i].getType() != "output") {
				var compStr = compArr[i].getSerialStringConnections();
				if (compStr !== null) str += compStr + "\n";
			}
		}
		
		//localStorage.setItem("DL_SB_" + curExercise, str);
		var dataStore = new DataStore();

		dataStore.saveExerciseData("circuits", curExercise, str);
		
		return str;
	}
	
	function deserialize(controller, str) {
		nextToken = 0;

		compArray = new Array();
		tokenizeString(str);
		
		var numInputs = parseInt(getNextToken());
		var numOutputs = parseInt(getNextToken());
		var inputs = controller.updateNumberOfInputs(numInputs);
		var outputs = controller.updateNumberOfOutputs(numOutputs);
		for (var i = 0; i < inputs.length; i++) compArray[inputs[i].getID()] = inputs[i];
		for (var i = 0; i < outputs.length; i++) compArray[outputs[i].getID()] = outputs[i];
		
		var arr;
		var comp1;
		var comp2;
		var tok;
		
		var numComps = parseInt(getNextToken());
		
		for (var i = 0; i < numComps; i++) {
			tok = getNextToken();
			arr = tok.split(",");
			comp1 = controller.addComponent(arr[0], parseFloat(arr[1]), parseFloat(arr[2]), parseFloat(arr[3]));
			compArray[arr[3]] = comp1;
		}

		tok = getNextToken();
		while (tok !== null) {
			arr = tok.split(",");
			comp1 = compArray[arr[0]];
			comp2 = compArray[arr[1]];
			
			if (arr.length == 2) controller.connectComponents(comp1, comp2);
			else if (arr.length == 3) controller.connectComponents(comp1, comp2, [ parseFloat(arr[2]) ]);
			else if (arr.length == 4) controller.connectComponents(comp1, comp2, [ parseFloat(arr[2]), parseFloat(arr[3]) ]);
			
			tok = getNextToken();
		}
		
		controller.evaluateCircuit();
	}
	
	function tokenizeString(string) {
		tokArray = string.split("\n");
	}
	
	function getNextToken() {
		if (nextToken >= tokArray.length) return null;
		else return tokArray[nextToken++];
	}
}