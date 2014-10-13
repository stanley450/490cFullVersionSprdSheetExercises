/**
 * Handles setting up the spreadsheet lab
 */

function Setup(figNum) {
	var addElements = new AddElements(figNum);
	var table = new Table(figNum);
	var cellFunctions = new CellFunctions(figNum);
	var functionParse = new FunctionParse(figNum);

  table.getObjects(cellFunctions, addElements, functionParse);
  cellFunctions.getObjects(addElements, table, functionParse);
  
  dataStore = new DataStore();
  
  function saveTable(chapter, exercise, data){
	  dataStore.saveExerciseData(chapter, exercise, data);
  }
  
  function loadTable(chapter, exercise){
	  dataStore.loadExerciseData(chapter, exercise);
  }

}