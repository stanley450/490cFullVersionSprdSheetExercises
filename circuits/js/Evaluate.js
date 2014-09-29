function EvaluateCircuit() {
	this.evaluate = evaluate;
	function evaluate() {
		console.log("Here.");
		var done = false;
		
		var compArr = [].concat(components);
		console.log("CompArr: " + compArr.length);

		var res = false;
		while (compArr.length > 0) {
			for (var i = 0; i < compArr.length; i++) {
				res = compArr[i].evaluate();
				if (res == true) { compArr.splice(i,1); break; }
			}
		}
		
		console.log("Components: " + components.length);
		
		for (var i = 0; i < components.length; i++) {
			console.log("Fixing in line values.");
			components[i].clearInLineVals();
		}
	}
}