/***************************************************************
 * Author:		Watson Framework Team
 * Members: 	Tommy Bozeman, Jacob Burt, Andrew Duryea, James Miltenberger, Neil Vosburg
 *
 * Entity:		WatsonDataStore.js
 *
 * Description:
 *				This is the beginnings of the Watson Data Store.
 */
function DataStore() {
	var store = true;									// assume this platform is capable of storage
	
	this.saveExerciseData = saveExerciseData;
	this.loadExerciseData = loadExerciseData;
	this.eraseExerciseData = eraseExerciseData;
	this.submitExercise = submitExercise;
	
	if(typeof(Storage) === "undefined")					// test to see if session storage is available for this platform
	{
		store = false;									// session storage not available for this platform/browser
	}
	else
	{
		// session storage available
	}
	
	/*
	*	saveExerciseData()
	*
	*	Saves an exercise's data provided the chapter unqiueID, exercise number, and exercise data.
	*/
	function saveExerciseData(chapter, exercise, data) {
		if (store == false) return;											// session storage not available
		
		var key = "WatsonChapter:" + chapter + ";Exercise:" + exercise;		// Example: WatsonChapter12Exercise3
		localStorage.setItem(key, data);									// store the string with the key we just made
	}
	
	/*
	*	loadExerciseData()
	*
	*	Loads an exercise's data provided the chapter unique ID and exercise number.
	*/
	function loadExerciseData(chapter, exercise) {
		if (store == false) return null;									// session storage not available
		
		var key = "WatsonChapter:" + chapter + ";Exercise:" + exercise;		// Example: WatsonChapter12Exercise3
		
		return localStorage.getItem(key);									// return this key's contents
	}
	
	function eraseExerciseData(chapter, exercise) {
		if (store == false) return null;
		
		var key = "WatsonChapter:" + chapter + ";Exercise:" + exercise;
		localStorage.removeItem(key);
	}
	
	/*
	 * submitExercise()
	 *
	 * Brings up the default mail client using 'mailto'.
	 */
	function submitExercise(email, chapter, exercise, data) {
		window.location = "mailto:" + email + "?Subject=Watson Exercise Submission: Ch" + chapter + " Ex" + exercise + "&body=" + data;
	}
}