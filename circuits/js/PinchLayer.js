(function() {
	Kinetic.PinchLayer = function(config) {
		self = this;
		Kinetic.Layer.call(self, config);
		config.container.add(self);
		self.setDragBoundFunc(self.checkBounds);
		// set minScale so that the layer will always cover the whole screen if possible
		if (self.getWidth() / self.getParent().getWidth() < self.getHeight() / self.getParent().getHeight()) {
	   	 self.minScale = self.getParent().getWidth() / self.getWidth();
	    } else {
	   	 self.minScale = self.getParent().getHeight() / self.getHeight();
	    }
	    self.maxScale = config.maxScale || 3;
	    self.maxSpeed = config.maxSpeed || 10;
	    self.durationCoeff = config.durationCoeff || 0.05;
	    
		self.on('dragstart', self.dragStarted);
		self.on('dragmove', self.dragMoved);
		self.on('dragend', self.dragEnded);
	    self.dStage = self.getParent().getContent();
		config.container.on("touchmove", self.layerTouchMove, false);
		config.container.on("touchend", self.layerTouchEnd, false);	
		//document.addEventListener("mousewheel", self.mouseScroll, true);
		//document.addEventListener("DOMMouseScroll", self.mouseScroll, true);
		self.setDraggable(true);
	    
		self.startDistance = undefined;
		self.startScale = 1;
		self.lastPosition = { x: 0, y: 0 }
		self.touchPosition = { x: 0, y: 0 }
		self.layerPosition = { x: 0, y: 0 }
		self.panDelta = { x: 0, y: 0 }
	}

	Kinetic.PinchLayer.prototype = new Kinetic.Layer();

	Kinetic.PinchLayer.prototype.checkBounds = function(pos) {
			var boundX, boundY, posX, posY;
			var picDimensionX = (-self.getWidth() * self.scale().x) + self.getParent().getWidth();
			var picDimensionY = (-self.getHeight() * self.scale().y) + self.getParent().getHeight();
			
			if (self.scale().x == 1) {
				return { x: 0, y: 0 };
			}
			
			if (pos.x > 0) {
				boundX = 0;
			}
			else if (pos.x < picDimensionX) {
				boundX = picDimensionX;
			}
			else {
				boundX = pos.x;
			}
			
			if (pos.y > 0) {
				boundY = 0;
			}
			else if (pos.y < picDimensionY) {
				boundY = picDimensionY;
			}
			else {
				boundY = pos.y;
			}
			return { x: boundX, y: boundY }
	}

	Kinetic.PinchLayer.prototype.mouseScroll = function(e) {
	  	  var wheelData = e.detail ? e.detail * -1 : e.wheelDelta / 40;
		  var zoomAmount = wheelData * 0.04;
		  if (zoomAmount) {
			  var newScale = self.scale().x + zoomAmount;
			  if (newScale < self.minScale) { newScale = self.minScale; }
			  if (newScale > self.maxScale) { newScale = self.maxScale; }
			  self.scale({x: newScale, y: newScale});
			  var pos = self.checkBounds({ x: self.getX(), y: self.getY() });
			  self.position({x: pos.x, y: pos.y});
			  self.draw();
		  }
		  // cancel scrollwheel
		  if(e.stopPropagation) {
	   		 e.stopPropagation();
		  }
	  	  if(e.preventDefault) {
	    	e.preventDefault();
	  	  }
	  	  e.cancelBubble = true;
	  	  e.cancel = true;
	  	  e.returnValue = false;
	  return false;
	}

	Kinetic.PinchLayer.prototype.dragStarted = function(event) {
	 	if (!event.evt.touches || event.evt.touches.length <= 1) {
		 	self.lastPosition.x = (event.evt.clientX || self.getParent().getPointerPosition().x);
		 	self.lastPosition.y = (event.evt.clientY || self.getParent().getPointerPosition().y);
		}
	}

	Kinetic.PinchLayer.prototype.dragMoved = function(event) {
	 	if (!event.evt.touches || event.evt.touches.length <= 1) {
		 	var calcDeltaX = (event.evt.clientX || self.getParent().getPointerPosition().x) - self.lastPosition.x;
		 	var calcDeltaY = (event.evt.clientY || self.getParent().getPointerPosition().y) - self.lastPosition.y;
		 	self.lastPosition.x = (event.evt.clientX || self.getParent().getPointerPosition().x);
		 	self.lastPosition.y = (event.evt.clientY || self.getParent().getPointerPosition().y);
		 	self.panDelta.x = event.evt.webkitMovementX || calcDeltaX;
		 	self.panDelta.y = event.evt.webkitMovementY || calcDeltaY;
	 	}
	 }

	Kinetic.PinchLayer.prototype.dragEnded = function(event) {
	 	if (!event.evt.touches || event.evt.touches.length <= 1) {
	 		var speed = (Math.abs(self.panDelta.x) + Math.abs(self.panDelta.y)) / 2;
	 		if (speed > self.maxSpeed) { speed = self.maxSpeed; }
	 		if (speed < -self.maxSpeed) { speed = -self.maxSpeed; } 	 		
	 		var dur = self.durationCoeff * speed;
	 		var newX = self.position().x + (self.panDelta.x * speed);
			var newY = self.position().y + (self.panDelta.y * speed);
			var pos = self.checkBounds({ x: newX, y: newY });
			self.trans = new Kinetic.Tween({
				node: self,
				x: pos.x,
				y: pos.y,
				easing: Kinetic.Easings.StrongEaseOut,
				duration: Math.abs(dur)
			}).play();
	 	}
	 }

	Kinetic.PinchLayer.prototype.getDistance = function(touch1, touch2) {
		var x1 = touch1.clientX;
	    var x2 = touch2.clientX;
	    var y1 = touch1.clientY;
	    var y2 = touch2.clientY;
	    return Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
	  }

	Kinetic.PinchLayer.prototype.layerTouchMove = function(event) {
	   var touch1 = event.evt.touches[0];
	   var touch2 = event.evt.touches[1];
		
	    if (touch1 && touch2) {
	    	self.draggable(false);
	    	//if (self.trans != undefined) { self.trans.reset(); }
	        if (self.startDistance === undefined) {
	            self.startDistance = self.getDistance(touch1, touch2);
	            self.touchPosition.x = (touch1.clientX + touch2.clientX) / 2;
	            self.touchPosition.y = (touch1.clientY + touch2.clientY) / 2;
	            self.layerPosition.x = (Math.abs(self.position().x) + self.touchPosition.x) / self.startScale;
	            self.layerPosition.y = (Math.abs(self.position().y) + self.touchPosition.y) / self.startScale;
	        }
	        else {
	            var dist = self.getDistance(touch1, touch2);
	            var scale = (dist / self.startDistance) * self.startScale;
	            if (scale < self.minScale) { scale = self.minScale; }
	            if (scale > self.maxScale) { scale  = self.maxScale; }
	            self.scale({x: scale, y: scale});
		        var x = (self.layerPosition.x * scale) - self.touchPosition.x;
		        var y = (self.layerPosition.y * scale) - self.touchPosition.y;
		        var pos = self.checkBounds({ x: -x, y: -y });
	            self.position({x: pos.x, y: pos.y});
	            self.draw();
			}
		}
	}
			
	Kinetic.PinchLayer.prototype.layerTouchEnd = function(event) {
	   	self.draggable(true);
	    self.startDistance = undefined;
	    self.startScale = self.scale().x;
	}
})()