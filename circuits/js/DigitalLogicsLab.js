function DigitalLogicsLab(containerNum, exerNum) {
	this.saveExercise = saveExercise;
	
	var setup = new SB_Setup("sandbox" + containerNum, containerNum, exerNum);
	
	function saveExercise() {
		setup.saveExercise();
	}
}