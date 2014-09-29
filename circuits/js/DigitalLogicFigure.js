function DigitalLogicFigure(container, figureNo, draggable, displayMode, exerID) {
	this.retieveUpdates = retrieveUpdates;
	
	var setup = new Setup(container, figureNo, draggable, displayMode, exerID);
	
	function retrieveUpdates() {
		setup.retrieveUpdates();
	}
}
