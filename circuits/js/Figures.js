function Figures(setup, controller, truthTable) {
	var scale = setup.getGScale();
	var highlightFlag = false;
	
	this.setFigure = setFigure;
	
	function setFigure(setup, controller, figureNum, width, height, inputVals) {
		var maxWidth;
		var maxHeight;
		
		if (figureNum == 'and') {
			var header = [ "A", "B", "Z" ];
			truthTable.showTruthTable(true);
			truthTable.createTable(2, 1, header, false);
			setup.setInitHeight(100);
			setup.setInitWidth(250);
			
			var inputA;
			var inputB;
			
			if (inputVals === null) {
				inputA = controller.addInput(5, 12, "A", 0);
				inputB = controller.addInput(5, 38, "B", 0);
			}
			else {
				inputA = controller.addInput(5, 12, "A", inputVals[0]);
				inputB = controller.addInput(5, 38, "B", inputVals[1]);
			}
			
			var and = controller.addAndGate(50, 25);
			var output = controller.addOutput(190, 25, "Z");
			
			controller.connectComponents(inputA, and, [1]);
			controller.connectComponents(inputB, and, [2]);
			controller.connectComponents(and, output);
		}
		else if (figureNum == 'andNTT') {
			truthTable.showTruthTable(false);
			setup.setInitHeight(100);
			setup.setInitWidth(250);
			
			var inputA;
			var inputB;
			
			if (inputVals === null) {
				inputA = controller.addInput(5, 12, "A", 0);
				inputB = controller.addInput(5, 38, "B", 0);
			}
			else {
				inputA = controller.addInput(5, 12, "A", inputVals[0]);
				inputB = controller.addInput(5, 38, "B", inputVals[1]);
			}
			
			var and = controller.addAndGate(50, 25);
			var output = controller.addOutput(190, 25, "Z");
			
			controller.connectComponents(inputA, and, [1]);
			controller.connectComponents(inputB, and, [2]);
			controller.connectComponents(and, output);
		}
		else if (figureNum == 'or') {
			var header = [ "A", "B", "Z" ];
			truthTable.showTruthTable(true);
			truthTable.createTable(2, 1, header, false);
			setup.setInitHeight(100);
			setup.setInitWidth(250);
			
			var inputA;
			var inputB;
			
			if (inputVals === null) {
				inputA = controller.addInput(5, 12, "A", 0);
				inputB = controller.addInput(5, 38, "B", 0);
			}
			else {
				inputA = controller.addInput(5, 12, "A", inputVals[0]);
				inputB = controller.addInput(5, 38, "B", inputVals[1]);
			}
			
			var or = controller.addOrGate(50, 25);
			var output = controller.addOutput(190, 25, "Z");
			
			controller.connectComponents(inputA, or, [1]);
			controller.connectComponents(inputB, or, [2]);
			controller.connectComponents(or, output);
		}
		else if (figureNum == 'orNTT') {
			truthTable.showTruthTable(false);
			setup.setInitHeight(100);
			setup.setInitWidth(250);
			
			var inputA;
			var inputB;
			
			if (inputVals === null) {
				inputA = controller.addInput(5, 12, "A", 0);
				inputB = controller.addInput(5, 38, "B", 0);
			}
			else {
				inputA = controller.addInput(5, 12, "A", inputVals[0]);
				inputB = controller.addInput(5, 38, "B", inputVals[1]);
			}
			
			var or = controller.addOrGate(50, 25);
			var output = controller.addOutput(190, 25, "Z");
			
			controller.connectComponents(inputA, or, [1]);
			controller.connectComponents(inputB, or, [2]);
			controller.connectComponents(or, output);
		}
		else if (figureNum == 'not') {
			var header = [ "A", "Z" ];
			truthTable.showTruthTable(true);
			truthTable.createTable(1, 1, header, false);
			setup.setInitHeight(100);
			setup.setInitWidth(250);
			
			var inputA;
			var inputB;
			
			if (inputVals === null) {
				inputA = controller.addInput(5, 25, "A", 0);
			}
			else {
				inputA = controller.addInput(5, 25, "A", inputVals[0]);
			}
			
			var not = controller.addNotGate(50, 25);
			var output = controller.addOutput(200, 25, "Z");
			
			controller.connectComponents(inputA, not);
			controller.connectComponents(not, output);
		}
		else if (figureNum == 'notNTT') {
			truthTable.showTruthTable(false);
			setup.setInitHeight(100);
			setup.setInitWidth(250);
			
			var inputA;
			var inputB;
			
			if (inputVals === null) {
				inputA = controller.addInput(5, 25, "A", 0);
			}
			else {
				inputA = controller.addInput(5, 25, "A", inputVals[0]);
			}
			
			var not = controller.addNotGate(50, 25);
			var output = controller.addOutput(200, 25, "Z");
			
			controller.connectComponents(inputA, not);
			controller.connectComponents(not, output);
		}
		else if (figureNum == 'nand0') {
			var header = [ "A", "B", "Z" ];
			truthTable.createTable(2, 1, header, false);
			truthTable.showTruthTable(true);
			setup.setInitHeight(100);
			setup.setInitWidth(376);
			setup.setInitScale(0.8);
			
			var inputA;
			var inputB;
			
			inputA = controller.addInput(5, 12, "A", 0);
			inputB = controller.addInput(5, 38, "B", 0);
			
			var and = controller.addAndGate(50, 25);
			var not = controller.addNotGate(175, 25);
			var output = controller.addOutput(350, 25, "Z");
			
			controller.connectComponents(inputA, and, [1]);
			controller.connectComponents(inputB, and, [2]);
			controller.connectComponents(and, not, [0]);
			controller.connectComponents(not, output);
		}
		else if (figureNum == 'nor') {
			var header = [ "A", "B", "Z" ];
			truthTable.createTable(2, 1, header, false);
			truthTable.showTruthTable(true);
			setup.setInitHeight(100);
			setup.setInitWidth(250);
			
			var inputA;
			var inputB;
			
			if (inputVals === null) {
				inputA = controller.addInput(5, 12, "A", 0);
				inputB = controller.addInput(5, 38, "B", 0);
			}
			else {
				inputA = controller.addInput(5, 12, "A", inputVals[0]);
				inputB = controller.addInput(5, 38, "B", inputVals[1]);
			}
			
			var nor = controller.addNorGate(30, 25);
			var output = controller.addOutput(190, 25, "Z");
			
			controller.connectComponents(inputA, nor, [1]);
			controller.connectComponents(inputB, nor, [2]);
			controller.connectComponents(nor, output);
		}
		else if (figureNum == 'nand') {
			var header = [ "A", "B", "Z" ];
			truthTable.showTruthTable(true);
			truthTable.createTable(2, 1, header, false);
			setup.setInitHeight(100);
			setup.setInitWidth(230);
			
			var inputA;
			var inputB;
			
			if (inputVals === null) {
				inputA = controller.addInput(5, 12, "A", 0);
				inputB = controller.addInput(5, 38, "B", 0);
			}
			else {
				inputA = controller.addInput(5, 12, "A", inputVals[0]);
				inputB = controller.addInput(5, 38, "B", inputVals[1]);
			}
			
			var nand = controller.addNandGate(30, 25);
			var output = controller.addOutput(185, 25, "Z");
			
			controller.connectComponents(inputA, nand, [1]);
			controller.connectComponents(inputB, nand, [2]);
			controller.connectComponents(nand, output);
		}
		else if (figureNum == 'and3') {
			truthTable.showTruthTable(false);
			setup.setInitHeight(100);
			setup.setInitWidth(230);
			
			var inputA;
			var inputB;
			
			if (inputVals === null) {
				inputA = controller.addInput(5, 0, "A", 0);
				inputB = controller.addInput(5, 25, "B", 0);
				inputC = controller.addInput(5, 50, "C", 0);
			}
			else {
				inputA = controller.addInput(5, 10, "A", inputVals[0]);
				inputB = controller.addInput(5, 25, "B", inputVals[1]);
				inputC = controller.addInput(5, 40, "C", inputVals[2]);
			}
			
			var and = controller.addAndGate3(50, 25);
			var output = controller.addOutput(185, 25, "Z");
			
			controller.connectComponents(inputA, and, [1]);
			controller.connectComponents(inputB, and, [2]);
			controller.connectComponents(inputC, and, [3]);
			controller.connectComponents(and, output);
		}
		else if (figureNum == 'or3') {
			truthTable.showTruthTable(false);
			setup.setInitHeight(100);
			setup.setInitWidth(230);
			
			var inputA;
			var inputB;
			
			if (inputVals === null) {
				inputA = controller.addInput(5, 0, "A", 0);
				inputB = controller.addInput(5, 25, "B", 0);
				inputC = controller.addInput(5, 50, "C", 0);
			}
			else {
				inputA = controller.addInput(5, 10, "A", inputVals[0]);
				inputB = controller.addInput(5, 25, "B", inputVals[1]);
				inputC = controller.addInput(5, 40, "C", inputVals[2]);
			}
			
			var or = controller.addOrGate3(50, 25);
			var output = controller.addOutput(185, 25, "Z");
			
			controller.connectComponents(inputA, or, [1]);
			controller.connectComponents(inputB, or, [2]);
			controller.connectComponents(inputC, or, [3]);
			controller.connectComponents(or, output);
		}
		else if (figureNum == 'and4') {
			truthTable.showTruthTable(false);
			setup.setInitHeight(130);
			setup.setInitWidth(230);
			
			var inputA;
			var inputB;
			var inputC;
			var inputD;
			
			if (inputVals === null) {
				inputA = controller.addInput(5, 0, "A", 0);
				inputB = controller.addInput(5, 25, "B", 0);
				inputC = controller.addInput(5, 49, "C", 0);
				inputD = controller.addInput(5, 75, "D", 0);
			}
			else {
				inputA = controller.addInput(5, 0, "A", inputVals[0]);
				inputB = controller.addInput(5, 25, "B", inputVals[1]);
				inputC = controller.addInput(5, 50, "C", inputVals[2]);
				inputD = controller.addInput(5, 75, "D", inputVals[3]);
			}
			
			var and = controller.addAndGate4(50, 37);
			var output = controller.addOutput(185, 37, "Z");
			
			controller.connectComponents(inputA, and, [1]);
			controller.connectComponents(inputB, and, [2]);
			controller.connectComponents(inputC, and, [3]);
			controller.connectComponents(inputD, and, [4]);
			controller.connectComponents(and, output);
		}
		else if (figureNum == 'or4') {
			truthTable.showTruthTable(false);
			setup.setInitHeight(130);
			setup.setInitWidth(230);
			
			var inputA;
			var inputB;
			
			if (inputVals === null) {
				inputA = controller.addInput(5, 0, "A", 0);
				inputB = controller.addInput(5, 25, "B", 0);
				inputC = controller.addInput(5, 49, "C", 0);
				inputD = controller.addInput(5, 75, "D", 0);
			}
			else {
				inputA = controller.addInput(5, 0, "A", inputVals[0]);
				inputB = controller.addInput(5, 25, "B", inputVals[1]);
				inputC = controller.addInput(5, 50, "C", inputVals[2]);
				inputD = controller.addInput(5, 75, "D", inputVals[3]);
			}
			
			var or = controller.addOrGate4(50, 37);
			var output = controller.addOutput(185, 37, "Z");
			
			controller.connectComponents(inputA, or, [1]);
			controller.connectComponents(inputB, or, [2]);
			controller.connectComponents(inputC, or, [3]);
			controller.connectComponents(inputD, or, [4]);
			controller.connectComponents(or, output);
		}
		else if (figureNum == 'a') { // pg 409
			truthTable.showTruthTable(false);
			setup.setInitHeight(130);
			setup.setInitWidth(450);
			
			var input1;
			var input2;
			var input3;
			
			if (inputVals === null) {
				input1 = controller.addInput(50, 22, "A", 0);
				input2 = controller.addInput(50, 48, "B", 0);
				input3 = controller.addInput(50, 78, "C", 0);
			}
			else {
				input1 = controller.addInput(50, 22, "A", inputVals[0]);
				input2 = controller.addInput(50, 48, "B", inputVals[1]);
				input3 = controller.addInput(50, 78, "C", inputVals[2]);
			}
			
			var output = controller.addOutput(400, 65, "Z");
			var or1 = controller.addOrGate(150, 35);
			var and = controller.addAndGate(275, 65);

			controller.connectComponents(input1, or1, [1]);
			controller.connectComponents(input2, or1, [2]);
			controller.connectComponents(or1, and, [1]);
			controller.connectComponents(input3, and, [2]);
			controller.connectComponents(and, output);
		}
		else if (figureNum == 'b') { // pg 412
			truthTable.showTruthTable(false);
			setup.setInitHeight(150);
			setup.setInitWidth(350);
			
			var inputA;
			var inputB;
			var inputC;
			var inputD;
			
			if (inputVals === null) {
				inputA = controller.addInput(5, 0, "A", 0);
				inputB = controller.addInput(5, 26, "B", 0);
				inputC = controller.addInput(5, 87, "C", 0);
				inputD = controller.addInput(5, 113, "D", 0);
			}
			else {
				inputA = controller.addInput(5, 0, "A", inputVals[0]);
				inputB = controller.addInput(5, 26, "B", inputVals[1]);
				inputC = controller.addInput(5, 87, "C", inputVals[2]);
				inputD = controller.addInput(5, 113, "D", inputVals[3]);
			}
			
			var or1 = controller.addOrGate(50, 13);
			var or2 = controller.addOrGate(50, 100);
			var or3 = controller.addOrGate(155, 57);
			var output = controller.addOutput(285, 57, "Z");
			
			controller.connectComponents(inputA, or1, [1]);
			controller.connectComponents(inputB, or1, [2]);
			controller.connectComponents(inputC, or2, [1]);
			controller.connectComponents(inputD, or2, [2]);
			controller.connectComponents(or1, or3, [1]);
			controller.connectComponents(or2, or3, [2]);
			controller.connectComponents(or3, output);
		}
		else if (figureNum == 'c') { // first circuit page 415
			truthTable.showTruthTable(false);
			setup.setInitHeight(85);
			setup.setInitWidth(400);
			
			var inputA;
			var inputB;
			
			if (inputVals === null) {
				inputA = controller.addInput(5, 0, "A", 0);
				inputB = controller.addInput(5, 39, "B", 0);
			}
			else {
				inputA = controller.addInput(5, 0, "A", inputVals[0]);
				inputB = controller.addInput(5, 39, "B", inputVals[1]);
			}
			
			var not = controller.addNotGate(100, 0);
			var and = controller.addAndGate(235, 26);
			var output = controller.addOutput(360, 26, "Z");
			
			controller.connectComponents(inputA, not);
			controller.connectComponents(not, and, [1]);
			controller.connectComponents(inputB, and, [2]);
			controller.connectComponents(and, output);
		}
		else if (figureNum == 'd') { // second circuit page 415
			truthTable.showTruthTable(false);
			setup.setInitHeight(100);
			setup.setInitWidth(400);
			
			var inputA;
			var inputB;
			
			if (inputVals === null) {
				inputA = controller.addInput(5, 0, "A", 0);
				inputB = controller.addInput(5, 39, "B", 0);
			}
			else {
				inputA = controller.addInput(5, 0, "A", inputVals[0]);
				inputB = controller.addInput(5, 39, "B", inputVals[1]);
			}
			
			var not = controller.addNotGate(100, 39);
			var and = controller.addAndGate(235, 13);
			var output = controller.addOutput(360, 13, "Z");
			
			controller.connectComponents(inputA, and, [1]);
			controller.connectComponents(not, and, [2]);
			controller.connectComponents(inputB, not);
			controller.connectComponents(and, output);
		}
		else if (figureNum == 11) { // xor
			var header = ["A", "B", "Z"];
			truthTable.showTruthTable(true);
			truthTable.createTable(2, 1, header, false);
			setup.setInitWidth(650);
			setup.setInitHeight(175);
			
			var input1;
			var input2;
			
			if (inputVals === null) {
				input1 = controller.addInput(10, 5, "A", 0);
				input2 = controller.addInput(10, 43, "B", 0);
			}
			else {
				input1 = controller.addInput(10, 5, "A", inputVals[0]);
				input2 = controller.addInput(10, 43, "B", inputVals[0]);
			}
			
			var conn1 = controller.addConnector(100, 5);
			var conn2 = controller.addConnector(150, 43);
			var not1 = controller.addNotGate(200, 43);
			var not2 = controller.addNotGate(200, 125);
			var and1 = controller.addAndGate(350, 18);
			var and2 = controller.addAndGate(350, 100);
			var or = controller.addOrGate(450, 59);
			var output = controller.addOutput(570, 59, "Z");

			controller.connectComponents(input1, conn1, [0]);
			controller.connectComponents(input2, conn2, [0]);
			controller.connectComponents(conn1, and1, [1, 2]);
			controller.connectComponents(conn1, not2, [3]);
			controller.connectComponents(conn2, and2, [1, 3]);
			controller.connectComponents(conn2, not1, [2]);
			controller.connectComponents(not1, and1, [2]);
			controller.connectComponents(not2, and2, [2]);
			controller.connectComponents(and1, or, [1]);
			controller.connectComponents(and2, or, [2]);
			controller.connectComponents(or, output);
		}
		else if (figureNum == 'e') { // circuit right before the one bit comparator
			truthTable.showTruthTable(false);
			setup.setInitWidth(370);
			setup.setInitHeight(150);
			setup.setMaxWidth(370);
			
			var inputA;
			var inputB;
			
			if (inputVals === null) {
				inputA = controller.addInput(5, 0, "A", 0);
				inputB = controller.addInput(5, 75, "B", 0); 
			}
			else {
				inputA = controller.addInput(5, 0, "A", 0);
				inputB = controller.addInput(5, 75, "B", 0);
			}
			
			var not1 = controller.addNotGate(60, 0);
			var not2 = controller.addNotGate(60, 75);
			var and = controller.addAndGate(200, 37);
			var output = controller.addOutput(325, 37, "Z");
			
			controller.connectComponents(inputA, not1);
			controller.connectComponents(inputB, not2);
			controller.connectComponents(not1, and, [1]);
			controller.connectComponents(not2, and, [2]);
			controller.connectComponents(and, output);
		}
		else if (figureNum == 12) { // one bit equality
			var header = ["A", "B", "Z"];
			truthTable.showTruthTable(true);
			truthTable.createTable(2, 1, header, false);
			setup.setInitWidth(770);
			setup.setInitHeight(250);
			setup.setMaxWidth(900);
			
			var input1;
			var input2;
			
			if (inputVals === null) {
				input1 = controller.addInput(10, 12, "A", 0);
				input2 = controller.addInput(10, 38, "B", 0);
			}
			else {
				input1 = controller.addInput(10, 12, "A", inputVals[0]);
				input2 = controller.addInput(10, 38, "B", inputVals[1]);
			}
			
			var conn1 = controller.addConnector(100, 12);
			var conn2 = controller.addConnector(150, 38);
			var not1 = controller.addNotGate(200, 100);
			var not2 = controller.addNotGate(200, 200);
			var and1 = controller.addAndGate(350, 25);
			var and2 = controller.addAndGate(350, 150);
			var or = controller.addOrGate(600, 87);
			var output = controller.addOutput(730, 87, "Z");

			controller.connectComponents(input1, conn1, [0]);
			controller.connectComponents(input2, conn2, [0]);
			controller.connectComponents(conn1, and1, [1, 2]);
			controller.connectComponents(conn1, not2, [3]);
			controller.connectComponents(conn2, not1, [3]);
			controller.connectComponents(conn2, and1, [2, 2]);
			controller.connectComponents(not1, and2, [1]);
			controller.connectComponents(not2, and2, [2]);
			controller.connectComponents(and1, or, [1]);
			controller.connectComponents(and2, or, [2]);
			controller.connectComponents(or, output);
		}
		else if (figureNum == 13) { // half adder
			var header = ["A", "B", "C", "S"];
			truthTable.showTruthTable(true);
			truthTable.createTable(2, 2, header, false);
			setup.setInitWidth(875);
			setup.setInitHeight(300);
			
			var input1;
			var input2;
			
			if (inputVals === null) {
				input1 = controller.addInput(25, 7, "A", 0);
				input2 = controller.addInput(25, 38, "B", 0);
			}
			else {
				input1 = controller.addInput(25, 7, "A", inputVals[0]);
				input2 = controller.addInput(25, 38, "B", inputVals[1]);
			}
			
			var conn1 = controller.addConnector(125, 7);
			var conn2 = controller.addConnector(175, 7);
			var conn3 = controller.addConnector(75, 38);
			var conn4 = controller.addConnector(225, 38);
			var not1 = controller.addNotGate(275, 38);
			var not2 = controller.addNotGate(275, 138);
			var and1 = controller.addAndGate(475, 20);
			var and2 = controller.addAndGate(475, 120);
			var and3 = controller.addAndGate(475, 220);
			var or = controller.addOrGate(675, 70);
			var output2 = controller.addOutput(825, 220, "C");
			var output1 = controller.addOutput(825, 70, "S");

			controller.connectComponents(input1, conn1, [0]);
			controller.connectComponents(conn1, conn2, [0, 2]);
			controller.connectComponents(conn2, and1, [1, 2]);
			controller.connectComponents(conn1, and3, [1, 3]);
			controller.connectComponents(conn2, not2, [3]);
			controller.connectComponents(input2, conn3, [0]);
			controller.connectComponents(conn3, conn4, [0, 2]);
			controller.connectComponents(conn4, not1, [2]);
			controller.connectComponents(conn3, and3, [2, 3]);
			controller.connectComponents(conn4, and2, [1, 3]);
			controller.connectComponents(not1, and1, [2]);
			controller.connectComponents(not2, and2, [2]);
			controller.connectComponents(and1, or, [1]);
			controller.connectComponents(and2, or, [2]);
			controller.connectComponents(or, output1);
			controller.connectComponents(and3, output2);
		}
		else if (figureNum == 16) { // 3-8 decoder
			var header = ["A2", "A1", "A0", "D7", "D6", "D5", "D4", "D3", "D2", "D1", "D0"];
			truthTable.showTruthTable(true);
			truthTable.createTable(3, 8, header, false);
			setup.setInitHeight(750);
			setup.setInitWidth(775);
			setup.setInitScale(0.7);
			
			var input1;
			var input2;
			var input3;
			
			if (inputVals === null) {
				input3 = controller.addInput(10, 125, "A2", 0);
				input2 = controller.addInput(10, 65, "A1", 0);
				input1 = controller.addInput(10, 5, "A0", 0);
			}
			else {
				input3 = controller.addInput(10, 125, "A2", inputVals[0]);
				input2 = controller.addInput(10, 65, "A1", inputVals[1]);
				input1 = controller.addInput(10, 5, "A0", inputVals[2]);
			}
			
			var conn1 = controller.addConnector(85, 5);
			var conn01 = controller.addConnector(85, 232);
			var conn02 = controller.addConnector(85, 376);
			var conn03 = controller.addConnector(85, 520);

			var conn2 = controller.addConnector(135, 65);
			var conn05 = controller.addConnector(135, 319);
			var conn06 = controller.addConnector(135, 391);
			var conn07 = controller.addConnector(135, 607);

			var conn3 = controller.addConnector(180, 125);
			var conn09 = controller.addConnector(180, 478);
			var conn010 = controller.addConnector(180, 550);
			var conn011 = controller.addConnector(180, 622);

			var not1 = controller.addNotGate(300, 5);

			var conn11 = controller.addConnector(440, 160);
			var conn12 = controller.addConnector(440, 304);
			var conn13 = controller.addConnector(440, 448);

			var conn21 = controller.addConnector(475, 175);
			var conn22 = controller.addConnector(475, 247);
			var conn23 = controller.addConnector(475, 463);

			var conn31 = controller.addConnector(500, 190);
			var conn32 = controller.addConnector(500, 262);
			var conn33 = controller.addConnector(500, 334);

			var not2 = controller.addNotGate(250, 65);
			var not3 = controller.addNotGate(200, 125);

			var and1 = controller.addAndGate3(550, 175);
			var and2 = controller.addAndGate3(550, 247);
			var and3 = controller.addAndGate3(550, 319);
			var and4 = controller.addAndGate3(550, 391);
			var and5 = controller.addAndGate3(550, 463);
			var and6 = controller.addAndGate3(550, 535);
			var and7 = controller.addAndGate3(550, 607);
			var and8 = controller.addAndGate3(550, 679);

			var output8 = controller.addOutput(700, 679, "D7");
			var output7 = controller.addOutput(700, 607, "D6");
			var output6 = controller.addOutput(700, 535, "D5");
			var output5 = controller.addOutput(700, 463, "D4");
			var output4 = controller.addOutput(700, 391, "D3");
			var output3 = controller.addOutput(700, 319, "D2");
			var output2 = controller.addOutput(700, 247, "D1");
			var output1 = controller.addOutput(700, 175, "D0");

			controller.connectComponents(input1, conn1, [0]);
			controller.connectComponents(conn1, not1, [2]);
			controller.connectComponents(input2, conn2, [0]);
			controller.connectComponents(conn2, not2, [2]);
			controller.connectComponents(input3, conn3, [0]);
			controller.connectComponents(conn3, not3, [2]);
			
			controller.connectComponents(conn1, conn01, [1, 3]);
			controller.connectComponents(conn01, and2, [1, 2]);
			controller.connectComponents(conn01, conn02, [1, 3]);
			controller.connectComponents(conn02, and4, [1, 2]);
			controller.connectComponents(conn02, conn03, [1, 3]);
			controller.connectComponents(conn03, and6, [1, 2]);
			controller.connectComponents(conn03, and8, [1, 3]);

			controller.connectComponents(conn2, conn05, [1, 3]);
			controller.connectComponents(conn05, and3, [2, 2]);
			controller.connectComponents(conn05, conn06, [1, 3]);
			controller.connectComponents(conn06, and4, [2, 2]);
			controller.connectComponents(conn06, conn07, [1, 3]);
			controller.connectComponents(conn07, and7, [2, 2]);
			controller.connectComponents(conn07, and8, [2, 3]);
			
			controller.connectComponents(conn3, conn09, [1, 3]);
			controller.connectComponents(conn09, and5, [3, 2]);
			controller.connectComponents(conn09, conn010, [1, 3]);
			controller.connectComponents(conn010, and6, [3, 2]);
			controller.connectComponents(conn010, conn011, [1, 3]);
			controller.connectComponents(conn011, and7, [3, 2]);
			controller.connectComponents(conn011, and8, [3, 3]);

			controller.connectComponents(not1, conn11, [1]);
			controller.connectComponents(not2, conn21, [1]);
			controller.connectComponents(not3, conn31, [1]);

			controller.connectComponents(conn11, and1, [1, 2]);
			controller.connectComponents(conn12, and3, [1, 2]);
			controller.connectComponents(conn11, conn12, [1, 3]);
			controller.connectComponents(conn12, conn13, [1, 3]);
			controller.connectComponents(conn13, and5, [1, 2]);
			controller.connectComponents(conn13, and7, [1, 3]);

			controller.connectComponents(conn21, and1, [2, 2]);
			controller.connectComponents(conn21, conn22, [1, 3]);
			controller.connectComponents(conn22, and2, [2, 2]);
			controller.connectComponents(conn22, conn23, [1, 3]);
			controller.connectComponents(conn23, and5, [2, 2]);
			controller.connectComponents(conn23, and6, [2, 3]);

			controller.connectComponents(conn31, and1, [3, 2]);
			controller.connectComponents(conn31, conn32, [1, 3]);
			controller.connectComponents(conn32, and2, [3, 2]);
			controller.connectComponents(conn32, conn33, [1, 3]);
			controller.connectComponents(conn33, and3, [3, 2]);
			controller.connectComponents(conn33, and4, [3, 3]);

			controller.connectComponents(and1, output1);
			controller.connectComponents(and2, output2);
			controller.connectComponents(and3, output3);
			controller.connectComponents(and4, output4);
			controller.connectComponents(and5, output5);
			controller.connectComponents(and6, output6);
			controller.connectComponents(and7, output7);
			controller.connectComponents(and8, output8);
		}
		else if (figureNum == 17) {	//8-3 decoder
			var header = ["D7", "D6", "D5", "D4", "D3", "D2", "D1", "D0", "A2", "A1", "A0" ];
			truthTable.showTruthTable(true);
			truthTable.createTable(8, 3, header, true);
			setup.setInitWidth(660);
			setup.setInitHeight(400);
			
			var input7;
			var input6;
			var input5;
			var input4;
			var input3;
			var input2;
			var input1;
			var input0;
			
			if (inputVals === null) {
				input7 = controller.addInput(50, 353, "D7", 0);
				input6 = controller.addInput(50, 303, "D6", 0);
				input5 = controller.addInput(50, 253, "D5", 0);
				input4 = controller.addInput(50, 203, "D4", 0);
				input3 = controller.addInput(50, 153, "D3", 0);
				input2 = controller.addInput(50, 103, "D2", 0);
				input1 = controller.addInput(50, 53, "D1", 0);
				input0 = controller.addInput(50, 3, "D0", 0);
			}
			else {
				input7 = controller.addInput(50, 423, "D7", inputVals[0]);
				input6 = controller.addInput(50, 363, "D6", inputVals[1]);
				input5 = controller.addInput(50, 303, "D5", inputVals[2]);
				input4 = controller.addInput(50, 243, "D4", inputVals[3]);
				input3 = controller.addInput(50, 183, "D3", inputVals[4]);
				input2 = controller.addInput(50, 123, "D2", inputVals[5]);
				input1 = controller.addInput(50, 63, "D1", inputVals[6]);
				input0 = controller.addInput(50, 3, "D0", inputVals[7]);
			}
			
			var or1 = controller.addOrGate4(420, 80);
			var or2 = controller.addOrGate4(420, 155);
			var or3 = controller.addOrGate4(420, 230);
			
			var conn = controller.addConnector(120, 3);
			var conn2 = controller.addConnector(120, 153);
			var conn3 = controller.addConnector(170, 253);
			var conn4 = controller.addConnector(230, 303);
			var conn5 = controller.addConnector(320, 353);
			var conn6 = controller.addConnector(320, 170);

			var output2 = controller.addOutput(555, 230, "A2");
			var output1 = controller.addOutput(555, 155, "A1");
			var output0 = controller.addOutput(555, 80, "A0");
			
			controller.connectComponents(or1, output0);
			controller.connectComponents(or2, output1);
			controller.connectComponents(or3, output2);
			
			controller.connectComponents(input0, conn, [0]);
			
			controller.connectComponents(input1, or1, [1]);
			
			controller.connectComponents(input2, or2, [1]);
			
			controller.connectComponents(input3, conn2, [0]);
			controller.connectComponents(conn2, or1, [4, 1]);
			controller.connectComponents(conn2, or2, [2, 2]);
			
			controller.connectComponents(input4, or3, [1]);
			
			controller.connectComponents(input5, conn3, [0]);
			controller.connectComponents(conn3, or1, [2, 1]);
			controller.connectComponents(conn3, or3, [3, 2]);
			
			controller.connectComponents(input6, conn4, [0]);
			controller.connectComponents(conn4, or2, [3, 1]);
			controller.connectComponents(conn4, or3, [2, 2]);
			
			controller.connectComponents(input7, conn5, [0]);
			controller.connectComponents(conn5, or3, [4, 2]);
			controller.connectComponents(conn5, conn6, [3, 1]);
			controller.connectComponents(conn6, or2, [4, 2]);
			controller.connectComponents(conn6, or1, [3, 1]);
		}
		else if (figureNum == 18) { // two-input multiplexor
			var header = [ "S", "D1", "D0", "Z" ];
			truthTable.showTruthTable(true);
			truthTable.createTable(3, 1, header, false);
			setup.setInitWidth(500);
			setup.setInitHeight(175);
			
			var input1;
			var input2;
			var input3;
			
			if (inputVals === null) {
				input1 = controller.addInput(10, 5, "S", 0);
				input2 = controller.addInput(10, 125, "D1", 0);
				input3 = controller.addInput(10, 65, "D0", 0);
			}
			else {
				input1 = controller.addInput(10, 5, "S", inputVals[0]);
				input2 = controller.addInput(10, 125, "D1", inputVals[1]);
				input3 = controller.addInput(10, 65, "D0", inputVals[2]);
			}
			
			var conn = controller.addConnector(50, 5);
			var not = controller.addNotGate(75, 5);
			var and1 = controller.addAndGate(220, 52);
			var and2 = controller.addAndGate(220, 112);
			var or = controller.addOrGate(320, 82);
			var output = controller.addOutput(440, 82, "Z");
			
			controller.connectComponents(input1, conn, [0]);
			controller.connectComponents(conn, not, [2]);
			controller.connectComponents(not, and1, [1]);
			controller.connectComponents(input3, and1, [2]);
			controller.connectComponents(conn, and2, [1, 3]);
			controller.connectComponents(input2, and2, [2]);
			controller.connectComponents(and1, or, [1]);
			controller.connectComponents(and2, or, [2]);
			controller.connectComponents(or, output);
		}
		else if (figureNum == 19) { // four-input multiplexor
			truthTable.showTruthTable(false);
			setup.setInitWidth(675);
			setup.setInitHeight(425);
			
			var inputS0;
			var inputS1;
			var inputD0;
			var inputD1;
			var inputD2;
			var inputD3;
			
			if (inputVals === null) {
				inputS0 = controller.addInput(5, 0, "S0", 0);
				inputS1 = controller.addInput(5, 75, "S1", 0);
				inputD0 = controller.addInput(5, 140, "D0", 0);
				inputD1 = controller.addInput(5, 215, "D1", 0);
				inputD2 = controller.addInput(5, 290, "D2", 0);
				inputD3 = controller.addInput(5, 365, "D3", 0);
			}
			else {
				inputS0 = controller.addInput(5, 0, "S0", inputVals[0]);
				inputS1 = controller.addInput(5, 75, "S1", inputVals[1]);
				inputD0 = controller.addInput(5, 140, "D0", inputVals[2]);
				inputD1 = controller.addInput(5, 215, "D1", inputVals[3]);
				inputD2 = controller.addInput(5, 290, "D2", inputVals[4]);
				inputD3 = controller.addInput(5, 365, "D3", inputVals[5]);
			}
			
			var not1 = controller.addNotGate(92, 0);
			var not2 = controller.addNotGate(92, 75);
			var conn0 = controller.addConnector(40, 0);
			var conn01 = controller.addConnector(40, 185);
			var conn02 = controller.addConnector(60, 75);
			var conn03 = controller.addConnector(60, 275);
			var conn1 = controller.addConnector(240, 110);
			var conn2 = controller.addConnector(270, 125);
			var and1 = controller.addAndGate3(335, 125);
			var and2 = controller.addAndGate3(325, 200);
			var and3 = controller.addAndGate3(325, 275);
			var and4 = controller.addAndGate3(335, 350);
			var or = controller.addOrGate4(475, 237);
			var output = controller.addOutput(625, 237, "Z");
			
			controller.connectComponents(inputS0, conn0, [0]);
			controller.connectComponents(conn0, not1, [2]);
			controller.connectComponents(conn0, conn01, [1, 3]);
			controller.connectComponents(conn01, and2, [1, 2]);
			controller.connectComponents(conn01, and4, [1, 3]);
			
			controller.connectComponents(inputS1, conn02, [0]);
			controller.connectComponents(conn02, not2, [2]);
			controller.connectComponents(conn02, conn03, [1, 3]);
			controller.connectComponents(conn03, and3, [2, 2]);
			controller.connectComponents(conn03, and4, [2, 3]);
			
			controller.connectComponents(not1, conn1, [1]);
			controller.connectComponents(conn1, and1, [1, 2]);
			controller.connectComponents(conn1, and3, [1, 3]);
			
			controller.connectComponents(not2, conn2, [1]);
			controller.connectComponents(conn2, and1, [2, 2]);
			controller.connectComponents(conn2, and2, [2, 3]);
			
			controller.connectComponents(inputD0, and1, [3]);
			controller.connectComponents(inputD1, and2, [3]);
			controller.connectComponents(inputD2, and3, [3]);
			controller.connectComponents(inputD3, and4, [3]);
			
			controller.connectComponents(and1, or, [1]);
			controller.connectComponents(and2, or, [2]);
			controller.connectComponents(and3, or, [3]);
			controller.connectComponents(and4, or, [4]);
			
			controller.connectComponents(or, output);
		}
		else if (figureNum == 21) { // four-output demultiplexor
			truthTable.showTruthTable(false);
			setup.setInitWidth(550);
			setup.setInitHeight(375);
			
			var inputS0;
			var inputS1;
			var inputA;
			
			if (inputVals === null) {
				inputS0 = controller.addInput(5, 0, "S0", 0);
				inputS1 = controller.addInput(5, 75, "S1", 0);
				inputA = controller.addInput(5, 320, "A", 0);
			}
			else {
				inputS0 = controller.addInput(5, 0, "S0", inputVals[0]);
				inputS1 = controller.addInput(5, 75, "S1", inputVals[1]);
				inputA = controller.addInput(5, 320, "A", inputVals[2]);
			}
			
			var conn1 = controller.addConnector(30, 0);
			var conn2 = controller.addConnector(60, 75);
			var conn3 = controller.addConnector(250, 110);
			var conn4 = controller.addConnector(270, 125);
			var conn5 = controller.addConnector(30, 170);
			var conn6 = controller.addConnector(60, 245);
			var conn7 = controller.addConnector(90, 320);
			var conn8 = controller.addConnector(90, 260);
			var conn9 = controller.addConnector(90, 200);
			var not1 = controller.addNotGate(100, 0);
			var not2 = controller.addNotGate(100, 75);
			var and1 = controller.addAndGate3(325, 125);
			var and2 = controller.addAndGate3(325, 185);
			var and3 = controller.addAndGate3(325, 245);
			var and4 = controller.addAndGate3(325, 305);
			var outputD0 = controller.addOutput(475, 125, "D0");
			var outputD1 = controller.addOutput(475, 185, "D1");
			var outputD2 = controller.addOutput(475, 245, "D2");
			var outputD3 = controller.addOutput(475, 305, "D3");
			
			controller.connectComponents(inputS0, conn1, [0]);
			controller.connectComponents(conn1, not1, [2]);
			controller.connectComponents(conn1, conn5, [1, 3]);
			controller.connectComponents(conn5, and2, [1, 2]);
			controller.connectComponents(conn5, and4, [1, 3]);
			
			controller.connectComponents(inputS1, conn2, [0]);
			controller.connectComponents(conn2, not2, [2]);
			controller.connectComponents(conn2, conn6, [1, 3]);
			controller.connectComponents(conn6, and3, [2, 2]);
			controller.connectComponents(conn6, and4, [2, 3]);
			
			controller.connectComponents(not1, conn3, [1]);
			controller.connectComponents(conn3, and1, [1, 2]);
			controller.connectComponents(conn3, and3, [1, 3]);
			
			controller.connectComponents(not2, conn4, [1]);
			controller.connectComponents(conn4, and1, [2, 2]);
			controller.connectComponents(conn4, and2, [2, 3]);
			
			controller.connectComponents(inputA, conn7, [0]);
			controller.connectComponents(conn7, and4, [3, 2]);
			controller.connectComponents(conn7, conn8, [3, 1]);
			controller.connectComponents(conn8, and3, [3, 2]);
			controller.connectComponents(conn8, conn9, [3, 1]);
			controller.connectComponents(conn9, and2, [3, 2]);
			controller.connectComponents(conn9, and1, [3, 1]);
			
			controller.connectComponents(and1, outputD0);
			controller.connectComponents(and2, outputD1);
			controller.connectComponents(and3, outputD2);
			controller.connectComponents(and4, outputD3);
		}
		
		controller.evaluateCircuit();
		if (inputVals !== null) {
			for (var i = 0; i < inputVals.length; i++) inputVals[i] = "" + inputVals[i];
			truthTable.highlightRow(inputVals);
		}
		else if (figureNum != 6) truthTable.highlightFirstRow();
	}
	
	function adjustScale(maxWidth, maxHeight, width, height) {
		var newScale = 1;
		//var curScale = setup.getGScale();
		
		var widthScale = width / maxWidth;
		if (widthScale <= 1) newScale = widthScale;
		
		//console.log("MaxHeight: " + height + " :: " + (newScale * maxHeight));
		/*
		if (height < newScale * maxHeight) {
			var heightScale = height / maxHeight;
			if (heightScale <= 1) newScale = heightScale;
		}
		*/
		//scale = newScale;
		//setup.setGScale(newScale);
	}
	
	function checkTable(maxWidth, maxHeight, width, height, thresh, numIn, numOut, header, specialCase, visibleOverride) {
		if (visibleOverride == true) { truthTable.showTruthTable(false); return; }
		
		console.log("Visible override: " + visibleOverride);
		
		if (scale >= thresh) {
			truthTable.showTruthTable(true);
			truthTable.createTable(numIn, numOut, header, specialCase);
			adjustScale(maxWidth + truthTable.getTableWidth(), maxHeight, width, height, numIn, numOut, header);
			truthTable.setTableOffset(maxWidth * scale - (60 * scale));
		}
		else truthTable.showTruthTable(false);
	}
}
