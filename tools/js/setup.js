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

}