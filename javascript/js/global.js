var exerciseFigsText = [];
var exerciseFigs = [];						// array to hold all digital logic figures for exercises
var section;

function setupExerciseButtons(sectID) {
	section = getContentByID(sectID).replace("Section ", "");
	section = section.substring(0, section.indexOf(" "));

	populateExerciseDivs();

	var exerciseList = document.getElementById("exerciseList").children;
	var exercises = document.getElementsByClassName("solvable");

	for (var i = 0; i < exercises.length; i++) {
		for (var j = 0; j < exerciseList.length; j++) {
			if (exerciseList[j].children.length != 0 && (exerciseList[j].children[0] == exercises[i])) {
				var textContent = exercises[i].innerHTML.replace("\n", "");
				while (textContent.charCodeAt(0) == 9) textContent = textContent.substring(1, textContent.length);
				while (textContent.charCodeAt(textContent.length - 1) == 9) textContent = textContent.substring(0, textContent.length - 2);

				var id = exercises[i].className.replace("exercise solvable ", "");
				var exer = new Figure("container-exer" + id, id, "javascript", id);
				exerciseFigs.push([id, exer]);
				//console.log(exerciseFigs.length, exer);
				exerciseFigsText[id] = [ (j + 1), textContent ];
				$("#JSFigure-container-exer" + id).slideUp();
			}
		}
	}
	
	refreshJSFigures();
}


function populateExerciseDivs() {
	var divs = document.getElementsByClassName("exerciseDiv");
	
	for (var i = 0; i < divs.length; i++) {
		var exerID = divs[i].className.replace("exerciseDiv ", "");
		divs[i].innerHTML = '<button id="solve1" class="btn btn-sm btn-primary" onclick="solveButton(' + exerID + ')">Solve</button>\
								<button id="toggle' + exerID + '" class="btn btn-sm btn-success" onclick="toggleView(\'toggle' + exerID + '\', \'JSFigure-container-exer' + exerID + '\');">View</button> \
								<div id="JSFigure-container-exer' + exerID + '" class="divness" style="margin-top:5px;"></div>\
								<br><br>';
								
		//the clear button, removed for uniformity						
		//<button id="clear" class="btn btn-sm btn-primary" onclick="clearButton(' + exerID + ')">Clear</button>
	}
}

function toggleView(buttonID, divID) {
	var div = document.getElementById(divID);
	var button = document.getElementById(buttonID);
	
	if (button.textContent == "View") { $("#" + divID).slideDown("medium"); button.textContent = "Hide"; }
	else { $("#" + divID).slideUp("medium"); button.textContent = "View"; }
}

function solveButton(exerID) {
	var exercise = exerciseFigsText[exerID];
	//console.log(exerciseFigs.length, exerID, exerciseFigsText.length);
	
	for(var i = 0; i < exerciseFigs.length; i++){
		if(exerciseFigs[i][0] == exerID){
			exerciseFigs[i][1].saveEditor(true);
		}
	}
	
	localStorage.setItem("currExerNum", exerID);
	localStorage.setItem("currExerQues", "<span class='Bolded'>Problem " + section + "." + exercise[0] + "</span><br/><br/>" + exercise[1]);

	var win = window.open("solveExer.html", '_blank');
	win.focus();
}

function clearButton(exerID){
	var exercise = exerciseFigsText[exerID];
	//console.log(exerciseFigs.length, exerID, exerciseFigsText.length);
	
	for(var i = 0; i < exerciseFigs.length; i++){
		if(exerciseFigs[i][0] == exerID){
			exerciseFigs[i][1].clearEditor();
			exerciseFigs[i][1] = new Figure("container-exer" + exerID, exerID, "javascript", exerID);
			refreshJSFigures();
		}
	}
	
	localStorage.removeItem("currExerNum", exerID);
	localStorage.removeItem("currExerQues", "<span class='Bolded'>Problem " + section + "." + exercise[0] + "</span><br/><br/>" + exercise[1]);
}

visibly.onVisible(function () {
	refreshJSFigures();
});

function refreshJSFigures() {
	for (var i = 0; i < exerciseFigs.length; i++) {
		exerciseFigs[i][1].retrieveUpdates();
	}
}
