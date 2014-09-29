var numArr;					// an array used to keep track of what number each section should be
var textArr;				// an array used to keep track of the path that leads to a section such as "1.3.4"
var lastDepth;			// depth refers to how many levels the recursion is within the TOC; each sub-section tacks on one depth level; lastDepth is the depth of the last recursive call

/* Returns the chapter number that corresponds to the unique chapter ID */
function getChapterNumberById(chapID) {
	var chapters = json["chapters"];
	
	for (var i = 0; i < chapters.chapter.length; i++) {
		var chapter = chapters.chapter[i];
		if (chapter.id == chapID) return (i+1);
	}
	
	return -1;
}

/* Returns the path of the chapter TOC that corresponds to the unqiue chapter ID */
function getPathOfChapterTOC(chapID) {
	var chapters = json["chapters"];
	
	for (var i = 0; i < chapters.chapter.length; i++) {
		var chapter = chapters.chapter[i];
		if (chapter.id == chapID) return chapter.path;
	}
	
	return null;
}

function populateSpans(){
	var figSpans = document.getElementsByClassName("figNum");		// get the span elements on this page associated with references a figure
	if (figSpans !== null) populateFigureSpans(figSpans);						// pass spans to populateFigureSpans() to be populated with appropriate text
	
	var chapSpans = document.getElementsByClassName("contentNum");	// get the span elements on this page associated with referencing content (chapter/section/sub-section)
	if (chapSpans !== null) populateContentSpans(chapSpans);							// pass spans to populateContentSpans() to be populated with appropriate text
}

/*
 * populateFigureSpans()
 *
 * This function populates span objects passed to it according to the unique ID they hold as a class name.
 *
 * @param spans: A span with two classes: 'figNum' and a unique figure ID
 */

function populateFigureSpans(spans) {  
	var figs = getFigureDictionary();							// call getFigureNumbers()
	for (var i = 0; i < spans.length; i++) {					// for all the spans elements
		var id = spans[i].className.replace("figNum ", "").replace(" false", "").replace(" true", "");		// get the unique figure ID which is the second class name

		if (spans[i].parentNode.className.indexOf("Figure") >= 0) spans[i].textContent = "Figure " + figs[id] + ":";
		else {
			if (spans[i].className.indexOf("false") >= 0) spans[i].textContent = "" + figs[id] + "";	// if 'false' is a class name, don't include "Figure"
			else spans[i].textContent = "Figure " + figs[id] + "";								// set the spans text to its associated figure number by using the dictionary lookup
		}
	}
}

/*
 * populateContentSpans()
 *
 * This function takes an array of spans used to reference content (chapters/sections/sub-section/etc).
 * These spans should have two classes: 'content' and a unique chapter/section/sub-section ID. If the
 * span is a child of an element of class "Section", the content number and title for that content
 * is included in the span (ex: 1.3  Four important questions). If the span is NOT a child of an
 * element of class 'Section', only the content number is included (ex: 1.3).
 *
 * @param spans: The array of spans.
 */ 
function populateContentSpans(spans) { 
	for (var i = 0; i < spans.length; i++) {
		var id = spans[i].className.replace("contentNum ", "").replace(" false", "").replace(" true", "");	// nomenclature: 'contentNum uniqueID (false|true)'
		var content = getContentByID(id);
		if (!content) {
			spans[i].textContent = "## REFERENCE ERROR! ##";
			continue;
		}
		
		if (spans[i].parentNode.className.indexOf("Section") >= 0) {
			content = content.replace("Chapter ", "");
			content = content.replace("Section ", "");
		}
		else {
			if (spans[i].className.indexOf("false") >= 0) {
				content = content.replace("Chapter ", "");
				content = content.replace("Section ", "");
				content = content.substring(0, content.indexOf(" "));
			}
			else {
				content = content.substring(0, findSecondSpace(content));
			}
		}
		
		spans[i].textContent = "" + content + "";
	}
}

/*
 * getFigureDictionary()
 *
 * This function obtains a dictionary of all figures in the book by using the master JSON.
 * The key will be the unique ID. The value will be the figure number such as "1.3" or "8.9".
 *
 * @return figs: A dictionary with figure IDs as the keys and the figure numbers as the values.
 */
function getFigureDictionary() {
	var chapters = json["chapters"];
	var figs = [];

	for (var i = 0; i < chapters.chapter.length; i++) {
		var chapter = chapters.chapter[i];
		for (var j = 0; j < chapter.figures.figure.length; j++) {
			var figID = chapter.figures.figure[j].id;
			figs[figID] = (i + 1) + "." + (j + 1);
		}
	}
	
	return figs;
}

/*
 * getContentFromID()
 *
 * Given a chapter or section ID, this function returns the associated chapter/section number and name.
 *
 * Example:
 *    getContentFromID("scienceFour2") would return "Section 1.3.2: How does computer software work?"
 *
 * @param sectionID:	A unique ID that corresponds to a particular chapter or section.
 */
 function getContentByID(sectionID) {
	numArr = new Array();
	textArr = new Array();
	lastDepth = 0;
	
	var result = findSection(json, 0, sectionID);		// begin traversing the JSON from the top level
	
	return result;
 }

function findSection(o, depth, sectionID) {
	if (o.figure) return;	// ignore the figure nodes for TOC generation
    for (var i in o) {		// iterate throughout the objects at this node
		if (o[i] !== null && typeof(o[i]) == "string") {						// if we find a string node ...
			if (i == "name") {													// and if that object contains a name field ...
				var result = buildString(depth, o["name"], o["id"], sectionID);
				if (result !== null) return result;
			}
		}

        if (o[i] !== null && typeof(o[i])=="object") {							// if we haven't reached a text node, keep going deeper
            var result = findSection(o[i], depth + 1, sectionID);											// notice we pass depth + 1 here
			if (result) {
				return result;
			}
		}
    }

	return null;
}

function buildString(depth, name, curSectionID, targetSectionID) {
	if (!numArr[depth]) {			// we use the depth as an index; if this depth isn't defined ...
		numArr[depth] = 0;			// then we initialize it
		textArr[depth] = "";		// also initialize the same index with the text array
	}
	
	if (depth < lastDepth) {		// if the current depth < lastDepth, then we need to clear all depths higher than the one we are at now
		for (var i in numArr) {		// for all indices in numArr
			if (i > depth) {		// if the index is higher than the current depth, clear it
				numArr[i] = 0;		// cleared
				textArr[i] = "";	// don't forget the text array
			}
		}
	}
	
	numArr[depth] = numArr[depth] + 1;

	if (depth < 6) textArr[depth] = "" + numArr[depth];
	else textArr[depth] = textArr[depth - 3] + "." + numArr[depth];
	
	if (curSectionID == targetSectionID) {
		if (depth == 3) return "Chapter " + textArr[depth] + " " + name;
		else return "Section " + textArr[depth] + " " + name;
	}

	lastDepth = depth;
	
	return null;
}

function findSecondSpace(string) {
	var j;
	var flag = false;
	for (j = 0; j < string.length; j++) {
		if (string.charAt(j) == " " && flag == false) flag = true;
		else if (string.charAt(j) == " " && flag == true) break;
	}
	
	return j;
}


//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; UNUSED XML FUNCTIONS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

/*
 * getFigureNumbers()
 *
 *	Gets the figure numbers of a specific chapter by parsing through the master XML file.
 *
 * @param chapID: 		Chapter ID to get figure list from.
 * @param callback: 	It turns out that the ajax call is asynchronous. This means that getFigureNumbers can't just return its result
 *						back to the calling function when it's done. This means the calling function must specify a callback function
 *						as the second parameter to be called when the ajax request has completed. In this case, when the ajax request
 *						is done, it calls the callback function with the dictionary of figures for the specified chapter where each
 *						each entry maps to a figure number.
 *
 * @return				A dictionary (key,value pair) where the key (index) is the unique figure ID and the value is the figure number (e.g. 11.4)
 */
/*function getFigureNumbersXML(chapID, callback) {
	var dict = new Array();								// new array to store results
	
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
				
				if (obj.attr("id") == chapID) {			// if the ID of this node equals chapID, it's a match
					arr = obj.children();				// grab the children of this node (this is the sections of this chapter... the last child node is the figures)
					var figures = arr.eq(arr.length - 1).children();	// grab the last node as it is the figures node
					for (var j = 0; j < figures.length; j++) {			// iterate throughout the figures
						obj = figures.eq(j);							// make the figure a jquery object so we can call jquery functions on it
						dict[obj.attr("id")] = (i+1) + "." + (j+1);		// in JavaScript, indexes can be anything, including strings... so the index is the figure ID; the value is the figure number
					}
				}
			}
			
			callback(dict);		// finally call the callback function with the dictionary we made
		}
	});
}

/* TO-DO
 * getSectionNumber()
 *
 * Given a section ID, find the associated section number.
 *
 * @param sectionID:	A unique ID that corresponds to a particular section.
 * @param callback: 	Look at callback parameter for getFigureNumber()
 */
 function getSectionNumber(sectionID, callback) {
	// to be implemented
 }
 
 /* TO-DO
 * getChapterNumber()
 *
 * Given a chapter ID, find the associated chapter number.
 *
 * @param chapterID:	A unique ID that corresponds to a particular chapter.
 * @param callback: 	Look at callback parameter for getFigureNumber()
 */
 function getChapterNumber(sectionID, callback) {
	// to be implemented
 }