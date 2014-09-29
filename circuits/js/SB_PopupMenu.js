/*
  popupmenu.js - simple JavaScript popup menu library.

  Copyright (C) 2006 Jiro Nishiguchi <jiro@cpan.org> All rights reserved.
  This is free software with ABSOLUTELY NO WARRANTY.

  You can redistribute it and/or modify it under the modified BSD license.

  Usage:
    var popup = new PopupMenu();
    popup.add(menuText, function(target){ ... });
    popup.addSeparator();
    popup.bind('targetElement');
    popup.bind(); // target is document;
*/
var SB_PopupMenu = function() {
    this.init();
}
SB_PopupMenu.SEPARATOR = 'SB_PopupMenu.SEPARATOR';
SB_PopupMenu.current = null;
SB_PopupMenu.addEventListener = function(element, name, observer, capture) {
    if (typeof element == 'string') {
        element = document.getElementById(element);
    }
    if (element.addEventListener) {
        element.addEventListener(name, observer, capture);
    } else if (element.attachEvent) {
        element.attachEvent('on' + name, observer);
    }
};
SB_PopupMenu.prototype = {
    init: function() {
        this.items  = [];
        this.width  = 0;
        this.height = 0;
    },
    setSize: function(width, height) {
        this.width  = width;
        this.height = height;
        if (this.element) {
            var self = this;
            with (this.element.style) {
                if (self.width)  width  = self.width  + 'px';
                if (self.height) height = self.height + 'px';
            }
        }
    },
    bind: function(element) {
        var self = this;
        if (!element) {
            element = document;
        } else if (typeof element == 'string') {
            element = document.getElementById(element);
        }
        this.target = element;
        this.target.oncontextmenu = function(e) {
            self.show.call(self, e);
            return false;
        };
        var listener = function() { self.hide.call(self) };
        SB_PopupMenu.addEventListener(document, 'click', listener, true);
    },
    add: function(text, callback) {
        this.items.push({ text: text, callback: callback });
    },
    addSeparator: function() {
        this.items.push(SB_PopupMenu.SEPARATOR);
    },
    setPos: function(e) {
        if (!this.element) return;
        if (!e) e = window.event;
		
        var x, y;
        if (window.opera) {
            x = e.evt.clientX;
            y = e.evt.clientY;
        } else if (document.all) {
            x = document.body.scrollLeft + e.clientX;
            y = document.body.scrollTop + e.clientY;
		} else if (e.evt.changedTouches) {
			x = e.evt.changedTouches[0].pageX;
			y = e.evt.changedTouches[0].pageY;
        } else if (document.layers || document.getElementById) {
            x = e.evt.pageX;
            y = e.evt.pageY;
       }
        this.element.style.top  = y + 'px';
        this.element.style.left = x + 'px';
		
		console.log(x + ", " + y);
    },
	setManPos: function(e) {
        if (!this.element) return;
        if (!e) e = window.event;
		
        var x, y;
        if (window.opera) {
            x = e.evt.clientX;
            y = e.evt.clientY;
        } else if (document.all) {
            x = document.body.scrollLeft + e.clientX;
            y = document.body.scrollTop + e.clientY;
		} else if (e.evt.changedTouches) {
			x = e.evt.changedTouches[0].pageX;
			y = e.evt.changedTouches[0].pageY;
        } else if (document.layers || document.getElementById) {
            x = e.evt.pageX;
            y = e.evt.pageY;
       }
        //this.element.style.top  = y + 'px';
        //this.element.style.left = x + 'px';
        this.element.style.top  = (y + 5) + 'px';
        this.element.style.left = (x - 135) + 'px';
		
		console.log(x + ", " + y);
    },
	showMenu: function(e) {
        if (SB_PopupMenu.current && SB_PopupMenu.current != this) return;
		if (!e) e = window.event;
        SB_PopupMenu.current = this;
        if (this.element) {
            this.setManPos(e);
            this.element.style.display = '';
        } else {
            this.element = this.createMenu(this.items);
            this.setManPos(e);
            document.body.appendChild(this.element);
        }
    },
    show: function(e) {
        if (SB_PopupMenu.current && SB_PopupMenu.current != this) return;
		if (!e) e = window.event;
        SB_PopupMenu.current = this;
        if (this.element) {
            this.setPos(e);
            this.element.style.display = '';
        } else {
            this.element = this.createMenu(this.items);
            this.setPos(e);
            document.body.appendChild(this.element);
        }
    },
    hide: function() {
        SB_PopupMenu.current = null;
        if (this.element) this.element.style.display = 'none';
    },
    createMenu: function(items) {
        var self = this;
        var menu = document.createElement('div');
        with (menu.style) {
            if (self.width)  width  = self.width  + 'px';
            if (self.height) height = self.height + 'px';
            border     = "1px solid gray";
            background = '#FFFFFF';
            color      = '#000000';
            position   = 'absolute';
            display    = 'block';
            padding    = '2px';
            cursor     = 'default';
        }
        for (var i = 0; i < items.length; i++) {
            var item;
            if (items[i] == SB_PopupMenu.SEPARATOR) {
                item = this.createSeparator();
            } else {
                item = this.createItem(items[i]);
            }
            menu.appendChild(item);
        }
        return menu;
    },
    createItem: function(item) {
        var self = this;
        var elem = document.createElement('div');
		var disabled = false;
		if (item.text.charAt(0) == ".") {
			elem.style.color = "grey";
			item.text = item.text.slice(1, item.text.length);
			disabled = true;
		}
		elem.style.padding = '4px';
        var callback = item.callback;
		if (!disabled) {
			SB_PopupMenu.addEventListener(elem, 'click', function(_callback) {
				return function() {
					self.hide();
					_callback(self.target);
				};
			}(callback), true);
			SB_PopupMenu.addEventListener(elem, 'mouseover', function(e) {
				elem.style.background = '#B6BDD2';
			}, true);
			SB_PopupMenu.addEventListener(elem, 'mouseout', function(e) {
				elem.style.background = '#FFFFFF';
			}, true);
		}
		var textNode = document.createTextNode(item.text);
        elem.appendChild(textNode);
        return elem;
    },
    createSeparator: function() {
        var sep = document.createElement('div');
        with (sep.style) {
            borderTop = '1px dotted #CCCCCC';
            fontSize  = '0px';
            height    = '0px';
        }
        return sep;
    }
};
