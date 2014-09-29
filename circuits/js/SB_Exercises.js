function SB_Exercises(stage, setup, truthTable, controller) {
	var stage = setup.getStage();
	var alphabet = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ];
	
	this.setExercise = setExercise;
	
	function setExercise(exerciseNum) {
		var expectedTruthTable;
		
		if (exerciseNum == 0) {	// scratch pad mode
			expectedTruthTable = [ ];
			adjustInputsAndOutputs(3, 1);
		}
		if (exerciseNum == 1) {  //3 input AND
			expectedTruthTable = [
			[0, 0, 0, 0],
			[0, 0, 1, 0],
			[0, 1, 0, 0],
			[0, 1, 1, 0],
			[1, 0, 0, 0],
			[1, 0, 1, 0],
			[1, 1, 0, 0],
			[1, 1, 1, 1] ];
			
			/*
			header = ["A","B","C","Z"];
			truthTable.createTable(3, 1, header);
			controller.addInput(5, 50, "A", 0);
			controller.addInput(5, 250, "B", 0);
			controller.addInput(5, 450, "C", 0);
			controller.addOutput(760, 250, "Z");
			*/
			
			adjustInputsAndOutputs(3, 1);
		}
		else if (exerciseNum == 2) {  //4 input AND
			expectedTruthTable = [
			[0, 0, 0, 0, 0],
			[0, 0, 0, 1, 0],
			[0, 0, 1, 0, 0],
			[0, 0, 1, 1, 0],
			[0, 1, 0, 0, 0],
			[0, 1, 0, 1, 0],
			[0, 1, 1, 0, 0],
			[0, 1, 1, 1, 0],
			[1, 0, 0, 0, 0],
			[1, 0, 0, 1, 0],
			[1, 0, 1, 0, 0],
			[1, 0, 1, 1, 0],
			[1, 1, 0, 0, 0],
			[1, 1, 0, 1, 0],
			[1, 1, 1, 0, 0],
			[1, 1, 1, 1, 1] ];
			
			/*
			header = ["A","B","C","D","Z"];
			truthTable.createTable(4, 1, header);
			controller.addInput(0, 50, "A", 0);
			controller.addInput(0, 150, "B", 0);
			controller.addInput(0, 250, "C", 0);
			controller.addInput(0, 350, "D", 0);
			controller.addOutput(1350, 200, "Z");
			*/
			
			adjustInputsAndOutputs(4, 1);
		}
		else if (exerciseNum == 3){  //3 input OR
			expectedTruthTable = [
			[0, 0, 0, 0],
			[0, 0, 1, 1],
			[0, 1, 0, 1],
			[0, 1, 1, 1],
			[1, 0, 0, 1],
			[1, 0, 1, 1],
			[1, 1, 0, 1],
			[1, 1, 1, 1] ];
			
			/*
			header = ["A","B","C","Z"];
			truthTable.createTable(3, 1, header);
			controller.addInput(50, 50, "A", 0);
			controller.addInput(50, 250, "B", 0);
			controller.addInput(50, 450, "C", 0);
			controller.addOutput(1350, 250, "Z");
			*/
			
			adjustInputsAndOutputs(3, 1);
		}
		else if (exerciseNum == 4){  //3 input NAND
			expectedTruthTable = [
			[0, 0, 0, 1],
			[0, 0, 1, 1],
			[0, 1, 0, 1],
			[0, 1, 1, 1],
			[1, 0, 0, 1],
			[1, 0, 1, 1],
			[1, 1, 0, 1],
			[1, 1, 1, 0] ];
			
			/*
			header = ["A","B","C","Z"];
			truthTable.createTable(3, 1, header);
			controller.addInput(50, 50, "A", 0);
			controller.addInput(50, 250, "B", 0);
			controller.addInput(50, 450, "C", 0);
			controller.addOutput(1350, 250, "Z");
			*/
			
			adjustInputsAndOutputs(3, 1);
		}
		else if (exerciseNum == 5) {  //4 input NAND
			expectedTruthTable = [
			[0, 0, 0, 0, 1],
			[0, 0, 0, 1, 1],
			[0, 0, 1, 0, 1],
			[0, 0, 1, 1, 1],
			[0, 1, 0, 0, 1],
			[0, 1, 0, 1, 1],
			[0, 1, 1, 0, 1],
			[0, 1, 1, 1, 1],
			[1, 0, 0, 0, 1],
			[1, 0, 0, 1, 1],
			[1, 0, 1, 0, 1],
			[1, 0, 1, 1, 1],
			[1, 1, 0, 0, 1],
			[1, 1, 0, 1, 1],
			[1, 1, 1, 0, 1],
			[1, 1, 1, 1, 0] ];
			
			/*
			header = ["A","B","C","D","Z"];
			truthTable.createTable(4, 1, header);
			controller.addInput(0, 50, "A", 0);
			controller.addInput(0, 150, "B", 0);
			controller.addInput(0, 250, "C", 0);
			controller.addInput(0, 350, "D", 0);
			controller.addOutput(1300, 200, "Z");
			*/
			
			adjustInputsAndOutputs(4, 1);
		}
		else if (exerciseNum == 6){  //3 input NOR
			expectedTruthTable = [
			[0, 0, 0, 1],
			[0, 0, 1, 0],
			[0, 1, 0, 0],
			[0, 1, 1, 0],
			[1, 0, 0, 0],
			[1, 0, 1, 0],
			[1, 1, 0, 0],
			[1, 1, 1, 0] ];
			
			/*
			header = ["A","B","C","Z"];
			truthTable.createTable(3, 1, header);
			controller.addInput(50, 50, "A", 0);
			controller.addInput(50, 250, "B", 0);
			controller.addInput(50, 450, "C", 0);
			controller.addOutput(1350, 250, "Z");
			*/
			
			adjustInputsAndOutputs(3, 1);
		}
		else if (exerciseNum == 7) {  //4 input NOR
			expectedTruthTable = [
			[0, 0, 0, 0, 1],
			[0, 0, 0, 1, 0],
			[0, 0, 1, 0, 0],
			[0, 0, 1, 1, 0],
			[0, 1, 0, 0, 0],
			[0, 1, 0, 1, 0],
			[0, 1, 1, 0, 0],
			[0, 1, 1, 1, 0],
			[1, 0, 0, 0, 0],
			[1, 0, 0, 1, 0],
			[1, 0, 1, 0, 0],
			[1, 0, 1, 1, 0],
			[1, 1, 0, 0, 0],
			[1, 1, 0, 1, 0],
			[1, 1, 1, 0, 0],
			[1, 1, 1, 1, 0] ];
			
			/*
			header = ["A","B","C","D","Z"];
			truthTable.createTable(4, 1, header);
			controller.addInput(0, 50, "A", 0);
			controller.addInput(0, 150, "B", 0);
			controller.addInput(0, 250, "C", 0);
			controller.addInput(0, 350, "D", 0);
			controller.addOutput(1300, 200, "Z");
			*/
			
			adjustInputsAndOutputs(4, 1);
		}
		
		else if(exerciseNum == 8) { //XOR
			expectedTruthTable = [
			[0, 0, 0],
			[0, 1, 1],
			[1, 0, 1],
			[1, 1, 0] ];
			
			/*
			var header = ["A","B","Z"];
			truthTable.createTable(2, 1, header);
			controller.addInput(50, 50, "A", 0);
			controller.addInput(50, 250, "B", 0);
			controller.addOutput(1350, 150, "Z");
			*/
			
			adjustInputsAndOutputs(2, 1);
		}
		else if(exerciseNum == 9) { //two-bit comparator for equality
			expectedTruthTable = [
			[0, 0, 0, 0, 1],
			[0, 0, 0, 1, 0],
			[0, 0, 1, 0, 0],
			[0, 0, 1, 1, 0],
			[0, 1, 0, 0, 0],
			[0, 1, 0, 1, 1],
			[0, 1, 1, 0, 0],
			[0, 1, 1, 1, 0],
			[1, 0, 0, 0, 0],
			[1, 0, 0, 1, 0],
			[1, 0, 1, 0, 1],
			[1, 0, 1, 1, 0],
			[1, 1, 0, 0, 0],
			[1, 1, 0, 1, 0],
			[1, 1, 1, 0, 0],
			[1, 1, 1, 1, 1] ];
			
			adjustInputsAndOutputs(4, 1);
		}
		else if(exerciseNum == 10) { //one-bit comparator for less than
			expectedTruthTable = [
			[0, 0, 0],
			[0, 1, 1],
			[1, 0, 0],
			[1, 1, 0] ];
			
			adjustInputsAndOutputs(2, 1);
		}
		else if(exerciseNum == 11) { //two-bit comparator for less than
			expectedTruthTable = [
			[0, 0, 0, 0, 0],
			[0, 0, 0, 1, 1],
			[0, 0, 1, 0, 1],
			[0, 0, 1, 1, 1],
			[0, 1, 0, 0, 0],
			[0, 1, 0, 1, 0],
			[0, 1, 1, 0, 1],
			[0, 1, 1, 1, 1],
			[1, 0, 0, 0, 0],
			[1, 0, 0, 1, 0],
			[1, 0, 1, 0, 0],
			[1, 0, 1, 1, 1],
			[1, 1, 0, 0, 0],
			[1, 1, 0, 1, 0],
			[1, 1, 1, 0, 0],
			[1, 1, 1, 1, 0] ];
			
			adjustInputsAndOutputs(4, 1);
		}
		else if(exerciseNum == 12) { //one-bit comparator for greater than
			expectedTruthTable = [
			[0, 0, 0],
			[0, 1, 0],
			[1, 0, 1],
			[1, 1, 0] ];

			adjustInputsAndOutputs(2, 1);
		}
		else if(exerciseNum == 13) { //two-bit comparator for greater than
			expectedTruthTable = [
			[0, 0, 0, 0, 0],
			[0, 0, 0, 1, 0],
			[0, 0, 1, 0, 0],
			[0, 0, 1, 1, 0],
			[0, 1, 0, 0, 1],
			[0, 1, 0, 1, 0],
			[0, 1, 1, 0, 0],
			[0, 1, 1, 1, 0],
			[1, 0, 0, 0, 1],
			[1, 0, 0, 1, 1],
			[1, 0, 1, 0, 0],
			[1, 0, 1, 1, 0],
			[1, 1, 0, 0, 1],
			[1, 1, 0, 1, 1],
			[1, 1, 1, 0, 1],
			[1, 1, 1, 1, 0] ];
			
			adjustInputsAndOutputs(4, 1);
		}
		else if(exerciseNum == 14) { //one-bit full adder
			expectedTruthTable = [
			[0, 0, 0, 0, 0],
			[0, 0, 1, 0, 1],
			[0, 1, 0, 0, 1],
			[0, 1, 1, 1, 0],
			[1, 0, 0, 0, 1],
			[1, 0, 1, 1, 0],
			[1, 1, 0, 1, 0],
			[1, 1, 1, 1, 1] ];
			
			adjustInputsAndOutputs(4, 1);
		}
		else if(exerciseNum == 15) { //four-bit adder
			expectedTruthTable = [
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 1, 0, 0, 1],
			[0, 0, 1, 0, 0, 1, 0],
			[0, 0, 1, 1, 0, 1, 1],
			[0, 1, 0, 0, 0, 0, 1],
			[0, 1, 0, 1, 0, 1, 0],
			[0, 1, 1, 0, 0, 1, 1],
			[0, 1, 1, 1, 1, 1, 1],
			[1, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 1, 0, 1, 1],
			[1, 0, 1, 0, 1, 1, 1],
			[1, 0, 1, 1, 1, 1, 1],
			[1, 1, 0, 0, 0, 1, 1],
			[1, 1, 0, 1, 1, 1, 1],
			[1, 1, 1, 0, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1] ];
			
			adjustInputsAndOutputs(4, 3);
		}
		else if(exerciseNum == 16) { //2-to-4 decoder
			expectedTruthTable = [
			[0, 0, 1, 0, 0, 0],
			[0, 1, 0, 1, 0, 0],
			[1, 0, 0, 0, 1, 0],
			[1, 1, 0, 0, 0, 1] ];
		
			adjustInputsAndOutputs(2, 4);
		}
		else if(exerciseNum == 17) { //4-to-2 encoder
			expectedTruthTable = [
			[1, 0, 0, 0, 0, 0],
			[0, 1, 0, 0, 0, 1],
			[0, 0, 1, 0, 1, 0],
			[0, 0, 0, 1, 1, 1] ];

			adjustInputsAndOutputs(4, 2);
		}
		else if(exerciseNum == 18) { //8-output demultiplexor
			expectedTruthTable = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
			[0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
			[0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0],
			[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
			[1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
			[1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
			[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0] ];
			
			adjustInputsAndOutputs(3, 8);
		}
		
		truthTable.setExpectedTruthTable(expectedTruthTable);
	}
	
	function adjustInputsAndOutputs(numInputs, numOutputs) {
		var header = [ ];
		
		for (var i = 0; i < numInputs; i++) header.push(alphabet[i]);
		for (var i = 0; i < numOutputs; i++) header.push(alphabet[25 - i]);
			
		if (numInputs <= 5) {
			truthTable.setupTable(numInputs, numOutputs, header);
		}
		
		var ind = 0;
		for (var i = 0; i < numInputs; i++) {
			controller.addInput(5, ((600 / (numInputs + 1)) * (i + 1)), header[ind++], 0);
		}
		for (var i = 0; i < numOutputs; i++) {
			controller.addOutput(820, ((550 / (numOutputs + 1)) * (i + 1)), header[ind++]);
		}
		
		return header;
	}
}
