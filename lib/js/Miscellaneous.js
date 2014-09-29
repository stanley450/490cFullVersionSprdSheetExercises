function prevArrowPage(obj) {
	if (obj.previous == null) window.location.href = "../index.html";
	else window.location.href = obj.previous;
}

function nextArrowPage(obj) {
	if (obj.next == null) window.location.href = "../index.html";
	else window.location.href = obj.next;
}

function getArrowPathsByPage(currPage) {
	var obj = getArrowPathsPages(currPage);	// since ch01.html is usually a chapter's individual table of contents, I call getArrowPathsChapters() instead of getArrowPathsPages()

	return obj;
}

function getArrowPathsByChapter(currChapterID) {
	var obj = getArrowPathsChapters(currChapterID);
	return obj;
}

function goToChapterTOC(chapID) {
	window.location.href = getChapterTOCPathById(chapID);
}

function getArrowPathsChapters(currChapterID) {
	var chapters = json["chapters"];
	var chapInd;

	for (var i = 0; i < chapters.chapter.length; i++) {
		var currChapID = chapters.chapter[i].id;
		if (currChapID == currChapterID) chapInd = i;
	}
	
	var prevChapPath;
	var nextChapPath;
	
	if (chapInd == 0) {
		prevChapPath = null;
		nextChapPath = chapters.chapter[chapInd+1].path;
	}
	else if (chapInd == chapters.chapter.length - 1) {
		prevChapPath = chapters.chapter[chapInd-1].path;
		nextChapPath = null;
	}
	else {
		prevChapPath = chapters.chapter[chapInd-1].path;
		nextChapPath = chapters.chapter[chapInd+1].path;
	}
	
	return { previous: prevChapPath, next: nextChapPath };
}

// BT //
function getChapterTOCPathById(currChapterID) {
	console.log("Here.");
	var chapters = json["chapters"];
	var chapInd;

	for (var i = 0; i < chapters.chapter.length; i++) {
		var currChapID = chapters.chapter[i].id;
		if (currChapID == currChapterID) { 
					chapInd = i; 
		}
	}

	var currChapIndPath = chapters.chapter[chapInd].path;
	console.log(currChapIndPath);
	return currChapIndPath;

}

var lastPath = null;
var nextPath = null;
var currPageID;
var flag = false;
var done = false;

function getArrowPathsPages(_currPageID) {
	lastPath = null;
	nextPath = null;
	flag = false;
	done = false;
	
	currPageID = _currPageID;
	findPage(json);
	
	return { previous: lastPath, next: nextPath };
}

function findPage(o) {
	var name;
	var path;
	if (o.figure || done == true) return;

    for (var i in o) {
		if (o[i] !== null && typeof(o[i]) == "string") {
			if (i == "id") {
				if (flag == true) { nextPath = o["path"]; done = true; return; }
				
				if (o["id"] == currPageID) {
					flag = true;
				}
				else lastPath = o["path"];
			}
		}

        if (o[i] !== null && typeof(o[i])=="object") {
            findPage(o[i]);
        }
    }
}

//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; UNUSED XML CODE END ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

/*
var last;			// Used in obtaining previous and next page (getArrowPathsPages()) : always holds the last node visited
var forward;		// Used in obtaining previous and next page (getArrowPathsPages()) : always holds the next node to be visited
var flag = false;	// Used in obtaining previous and next page (getArrowPathsPages()) : a flag indicating if we found the requested section
var done = false;	// Used in obtaining previous and next page (getArrowPathsPages()) : a flag indicating if we are completely done
var currPageID;		// Used in obtaining previous and next page (getArrowPathsPages()) : the current page the user is currently on
*/

/*
 * getArrowPathsChapters()
 *
 * This function gets the back and forward CHAPTER paths for the navigation arrows. It
 * is called when the user is sitting on a table of contents page for a chapter. The
 * back arrow will go to the previous chapter. The forward arrow will go to the following
 * chapter.
 *
 * @param currChapterID:		The ID of the chapter in which the user is currently viewing its Table of Contents
 * @param callback:				AJAX call is being made. See the explanation in Numbering.js : getFigureNumber()
 *
 * @return:						Returns an anonymous object with two fields: back and forward
 *									Back: 		(String) Path of chapter previous the current chapter
 *									Forward: 	(String) Path of chapter after the current chapter
 */
/*function getArrowPathsChaptersXML(currChapterID, callback) {
	var back;											// back file path
	var forward;										// forward file path
	
	$.ajax({
		url: 'masterBT.xml',							// name of xml file
		type: 'GET',									// requesting the xml file
		dataType: 'text',								// we want it as a raw text format
		timeout: 1000,									// time until we give up
		error: function(){
			alert('Error loading XML document');		// alert if there is an error
		},
		success: function(xml) {						// success!
			var arr = $(xml).children();				// grab the children of the xml document (this is an array of chapter nodes)
			for (var i = 0; i < arr.length; i++) {		// iterate throughout these chapter nodes to find the chapter node the calling function requested
				var obj = arr.eq(i);					// makes obj a jquery element that we can call jquery functions on
				
				if (obj.attr("id") == currChapterID) {			// if the ID of this node equals chapID, it's a match
					if (i != 0) back = arr.eq(i - 1).attr("path");	// if we aren't at the first chapter, get the chapter's path previous to this one
					else back = null;								// else, we are at the first chapter, there is no chapter previous to this one
					
					if (i != arr.length - 1) forward = arr.eq(i + 1).attr("path");	// if we aren't at the end of the book, get the chapter's path previous to this one
					else forward = null;											// else, we are at the last chapter, there is no chapter after this one
				}
			}
			
			callback({back: back, forward: forward});		// finally call the callback function with anonymous object
		}
	});
}

/*
 * getArrowPathsPages()
 *
 * This function gets the back and forward PAGE paths for the navigation arrows. In other words, it gets the page path
 * that is before the current page and the page path that is after the current page. This function is a bit complex
 * and involves a recursive counter part using similar logic to the function that populates the table of contents. We
 * must search the whole XML file for the requested page ID as it's possible it will not be in the same chapter all the time.
 *
 * @param currPageID:	The ID of the current page we are on
 * @param callback:		AJAX call is being made. See the explanation in Numbering.js : getFigureNumber()
 *
 * @return:						Returns an anonymous object with two fields: back and forward
 *									Back: 		(String) Path of page previous the current chapter
 *									Forward: 	(String) Path of page after the current chapter
 */
/*function getArrowPathsPagesXML(_currPageID, callback) {
	last = null;
	forward = null;
	currPageID = _currPageID;
	
	$.ajax({
		url: 'masterBT.xml',							// name of xml file
		type: 'GET',									// requesting the xml file
		dataType: 'text',								// we want it as a raw text format
		timeout: 1000,									// time until we give up
		error: function(){
			alert('Error loading XML document');		// alert if there is an error
		},
		success: function(xml) {						// success!
			var arr = $(xml).children();				// grab the children of the xml file (this is the chapters)
			for (var i = 0; i < arr.length; i++) {		// iterate throughout the chapters
				getCurrPage(arr.eq(i), 0);		// getCurrPage() will recursively make its way through all the subsections of this chapter
			}
			
			// call the callback function with anonymous object of back and forward path
			// if the value is null, be sure to return null
			callback({back: ((last === null) ? null : last.attr("path")), forward: ((forward === null) ? null : forward.attr("path")) });
		}
	});
}

/*
 * getCurrPage()
 *
 * The recursive counter-part to getArrowPathsPages(). This will recursively go throughout a chapter looking for a specific
 * page ID. Once that is found, the before and forward paths can be determined.
 *
 * @param obj:			The current jQuery XML element
 * @param depth:		The current section depth (i.e.: Chapter level is 0, section level is 1, sub-section level is 2 ... )
 */
function getCurrPage(obj, depth) {
	if (done == true) return;					// if we are done, keep returning
	
	if (flag == true) {							// flag is true if we found the currPageID in the XML
		forward = obj;							// forward will be this object (we just visited the node where we found the match)
		done = true;							// officially done
		return;
	}
	
	if (obj.attr("id") == currPageID) {			// if the current node's ID is that of the requested ID, we found a match
		flag = true;							// flag is true since we found a match
	}
	else last = obj;							// if we didn't find a match, this node now becomes the last node we visited
	
	if (obj.children().length > 0) {						// if this node has children, then there are more sub-sections, so we will recursively call getCurrPage()
		var arr = obj.children();							// grab the children of this node
		for (var i = 0; i < arr.length; i++) {				// iterate throughout all children
			if (depth == 0 && i == arr.length - 1) continue;	// if the depth is 0 (on the chapter level) and we are at the last node in the list, we are at the <figures> node (IGNORE FIGURE NODE)
			else getCurrPage(arr.eq(i), depth + 1);				// otherwise, getCurrPage again with current object, (depth + 1) since we are going deeper
		}
	}
}
