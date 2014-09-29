var html;							// global HTML array: the recursive functions build on this
var numArr;						// an array used to keep track of what number each section should be
var textArr;					// an array used to keep track of the path that leads to a section such as "1.3.4"
var lastDepth;				// depth refers to how many levels the recursion is within the TOC; each sub-section tacks on one depth level; lastDepth is the depth of the last recursive call
var chapterNum;				// used in local TOC generation
var isGlobal;					// boolean value that determines if we are loading the global TOC or local TOC (local is for a particular chapter)
var mode;

/*
 * loadGlobalTableOfConents()
 *
 * This function sets up the HTML for the global TOC (the TOC for the whole book)
 */
function loadGlobalTableOfContents() {
	/* initialize all variables to blank */
	html = new Array();
	numArr = new Array();
	textArr = new Array();
	lastDepth = 0;
	//isGlobal = true;		// loading global TOC
	mode = 0;
	
	html.push('<ul class="archive_year">');
	traverse(json, 0);		// begin traversing the JSON from the top level
	html.push('</ul>');
	
	$("#ContentAreaSections").append( html.join("") );	// fill the content area with the html
}

/*
 * loadLocalTableOfContents()
 *
 * This function is very similar to loadGlobalTableOfContents(). The chapter ID of the particular
 * chapter to build a TOC for is passed as parameter. We must first locate that chapter in the JSON,
 * and then give the traverse() method the reference to that chapter within the JSON
 *
 * @param chapterID:	The ID of the chapter to build a table of contents for.
 */
function loadLocalTableOfContents(chapterID) {
	/* initialize all variables to blank */
	html = [];
	numArr = new Array();
	textArr = new Array();
	lastDepth = 0;
	//isGlobal = false;
	mode = 1;
	
	var chapters = json["chapters"];							// grab all chapters from JSON in an array
	var chapInd;												// a variable to store chapter index once we find it

	for (var i = 0; i < chapters.chapter.length; i++) {			// iterate throughout chapter array to find the matching ID
		var currChapID = chapters.chapter[i].id;				// grab the ID of the current chapter
		if (currChapID == chapterID) { chapInd = i; break; }	// if the current ID matches the ID we are looking for, break
	}
	
	chapterNum = chapInd + 1;									// set the chapter number to chapInd + 1 (started at 0)
	
	html.push('<ul class="archive_year">');
	traverse(json["chapters"].chapter[chapInd], 0);				// pass this chapter reference to traverse
	html.push('</ul>');
	
	$("#ContentAreaSections").append( html.join("") );	// fill the content area with the html
}

/*
 * loadChaptersTableOfConents()
 *
 * This function sets up the HTML for the Chapter TOC (the TOC for just the chapters book)
 */
function loadChaptersTableOfContents() {
	/* initialize all variables to blank */
	html = [];
	numArr = new Array();
	textArr = new Array();
	lastDepth = 0;
	//isGlobal = false;
	mode = 2;
	

	html.push('<ul class="archive_year">');
	traverse(json, 0);				// pass this chapter reference to traverse
	html.push('</ul>');
	
	$("#ContentAreaChapters").append( html.join("") );	// fill the content area with the html
}


/*
 * traverse()
 *
 * This function recursively calls on the JSON. Once a text node is reached (such as a section name or path),
 * it will call the appropriate applyHTML function depending on whether we are populating a global/local TOC.
 */
function traverse(o, depth) {
	if (o.figure) return;	// ignore the figure nodes for TOC generation

    for (var i in o) {		// iterate throughout the objects at this node
		if (o[i] !== null && typeof(o[i]) == "string") {						// if we find a string node ...
			if (i == "name") {													// and if that object contains a name field ...
				if (mode == 0) applyGlobalHTML(depth, o["name"], o["path"]);		// then we know a name and a path both exists within it; pass those to applyGlobalHTML()
				else if (mode == 1) applyLocalHTML(depth, o["name"], o["path"]);				// ... pass the same parameters to applyLocalHTML if isGlobal == false
				else applyGlobalWithoutSectionsHTML(depth, o["name"], o["path"].substring(3, o["path"].length));
			}
		}

        if (o[i] !== null && typeof(o[i])=="object") {							// if we haven't reached a text node, keep going deeper
            traverse(o[i], depth + 1);											// notice we pass depth + 1 here
        }
    }
}

/*
 * applyGlobalHTML()
 *
 * This function applies the HTML for the actual table of contents.
 *
 * @param depth: 	The depth this chapter/section was found at.
 * @param name:		The name of this chapter/section.
 * @param path:		The path to this chapter/section.
 */
function applyGlobalHTML(depth, name, path) {
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
	
	if (depth != 3 && depth > lastDepth) {
		html.push('<ul class="archive_month">');
	}
	
	if (depth < lastDepth) {
		var numDepths = (lastDepth - depth) / 3;
		for (var i = 0; i < numDepths; i++) { html.push('</ul></li>'); }
	}
	
	if (depth == 3) html.push('<a href="' + path + '"><li>' + "Chapter " + textArr[depth] + ": " + name + '</a>');
	else html.push('<a href="' + path + '"><li>' + textArr[depth] + ": " + name + '</a>')

	lastDepth = depth;
}

function applyLocalHTML(depth, name, path) {
	if (!numArr[depth]) {
		if (depth == 0) numArr[depth] = chapterNum;
		else numArr[depth] = 0;
		textArr[depth] = "";
	}
	
	if (depth < lastDepth) {
		for (var i in numArr) {
			if (i > depth) {
				numArr[i] = 0;
				textArr[i] = "";
			}
		}
	}
	
	if (depth != 0) numArr[depth] = numArr[depth] + 1;

	if (depth < 3) textArr[depth] = "" + numArr[depth];
	else textArr[depth] = textArr[depth - 3] + "." + numArr[depth];
	
	if (depth != 0 && depth > lastDepth) {
		html.push('<ul class="archive_month">');
	}
	
	if (depth < lastDepth) {
		var numDepths = (lastDepth - depth) / 3;
		for (var i = 0; i < numDepths; i++) { html.push('</ul></li>'); }
	}
	
	if (depth == 0) html.push('<a href="' + path + '"><li>' + "Chapter " + textArr[depth] + ": " + name + '</a>');
	else html.push('<a href="' + path + '"><li>' + textArr[depth] + ": " + name + '</a>')

	lastDepth = depth;
}

var chapCount = 1;

function applyGlobalWithoutSectionsHTML(depth, name, path) {
	if (depth != 3) return;
	
	html.push('<a href="' + path + '"><li>' + "Chapter " + chapCount++ + ": " + name + '</a>');

	lastDepth = depth;
}


//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; UNUSED XML FUNCTIONS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;


/*
$.ajax({											// ajax request
	url: 'everypage2.xml',							// name of xml document
	type: 'GET',									// we are requesting to view the XML document
	dataType: 'text',								// raw text format
	timeout: 1000,									// a timeout value (though we are pulling from a local XML file)
	error: function(){								// on error display an alery
		alert('Error loading XML document');
	},
	success: function(xml) {						// on success....
		html.push('<ul class="archive_year">');		// push the outter must unorder list element
		var arr = $(xml).children();				// grab the children of the xml file (this is the chapters)
		for (var i = 0; i < arr.length; i++) {		// iterate throughout the chapters
			getItem(arr.eq(i), 0, (i + 1), "");		// getItem() will recursively make its way through all the subsections of this chapter
		}
		html.push('</ul>');							// closing for outter the unordered list

		$("#ContentAreaSections").append( html.join("") );	// fill the content area with the html
	}
});
*/
	
/*
 * getItem
 *
 * This function is called recursively to get all the sections/sub-sections of a chapter.
 *
 * @param obj:		The jQuery object/node
 * @param dept:		The depth (of sections) we currently are at (i.e.: chapter level is depth 0, section level is 1, sub-section level is 3, sub-sub-section is 4)
 * @param ind:		The index of the element we are currently visiting (restarts at 1 upon each new depth level
 * @param path:		The 'path' of the node; i.e. 1.2.1 for the first sub-section in Chapter 1, Section 2
 */
function getItem(obj, depth, ind, path) {
	if (!obj.attr('name')) return;							// if the node doesn't have a name, it's the content page; ignore it; we don't want it appearing in TOC
	
	var prefix;		// text to append on each line
	
	if (depth == 0) {										// if the depth is 0, we are on the chapter level
		prefix = "Chapter " + ind + ": ";					// append chapter number (i.e.: 'Chapter 3')
		path = ind;											// add the index to the path
	}
	else prefix = path + ": ";								// if the depth is not 0, we are on a section; append section number (i.e.: 'Section 3.4.2')
	
    html.push('<a href=' + obj.attr('path') + '>');			// add the link element to HTML using the path attribute from XML
	html.push('<li>' + prefix + obj.attr('name'));			// add prefix along with the name from XML of this node
	html.push('</a>');										// close bracket for link
	if (obj.children().length > 0) {						// if this node has children, then there are more sub-sections, so we will recursively call getItem()
		html.push('<ul class="archive_month">');			// push a new list
		var arr = obj.children();							// grab the children of this node
		for (var i = 0; i < arr.length; i++) {				// iterate throughout all children
			if (depth == 0 && i == arr.length - 1) continue;	// if the depth is 0 (on the chapter level) and we are at the last node in the list, we are at the <figures> node (IGNORE FIGURE NODE FOR TABLE OF CONTENTS GENERATION)
			else getItem(arr.eq(i), depth + 1, (i + 1), path + "." + (i+1));	// otherise, it's just a section/sub-section, so call getItem with this node, depth + 1 (as we are going one level deeper, (i + 1) for index, and the new path
		}
		html.push('</ul>');									// close the list
	}
	else {
		html.push('</li>');									// close this list item
	}
}

/* 	UNUSED CODE
 * 		This code is the iterative version of the table of contents; it is limited to only
 *		sections of depth 2 (chapters level 0, sections level 1, sub-sections level 2).
 *		I kept this here... for the very off chance we need it for something.

$(document).ready(function() {
	var xmlhttp;
	var xmlDoc;
	
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	xmlhttp.open("GET","everypage.xml",false);
	xmlhttp.send();
	xmlDoc=xmlhttp.responseXML;

	var htmlOutput = '<ul class="archive_year">';
	var chaps = xmlDoc.getElementsByTagName("chapter");
	
	for (var i = 0; i < chaps.length; i++) {
		var title = chaps[i].getElementsByTagName("cname")[0].childNodes[0].nodeValue;
		var path = chaps[i].getElementsByTagName("cpath")[0].childNodes[0].nodeValue;
		
		htmlOutput += BuildChaptersHTML(title, path, i);
		
		var sections = chaps[i].getElementsByTagName("section");
		if (sections.length != 0) htmlOutput += '<ul class="archive_month">';
		for (var j = 0; j < sections.length; j++) {
			var sectionTitle = sections[j].getElementsByTagName("sname")[0].childNodes[0].nodeValue;
			console.log(j + " Section title: " + sectionTitle);
			var sectionPath = sections[j].getElementsByTagName("spath")[0].childNodes[0].nodeValue;
			
			htmlOutput += BuildSectionsHTML(sectionTitle, sectionPath, i, j);
			
			var subSections = sections[j].getElementsByTagName("sub-section");
			if (subSections.length != 0) htmlOutput += '<ul class="archive_month">';
			for (var k = 0; k < subSections.length; k++) {
				var subSectionTitle = subSections[k].getElementsByTagName("sbname")[0].childNodes[0].nodeValue;
				var subSectionPath = subSections[k].getElementsByTagName("sbpath")[0].childNodes[0].nodeValue;
				
				htmlOutput += BuildSubSectionsHTML(subSectionTitle, subSectionPath, i, j, k);
			}
			if (subSections.length != 0) htmlOutput += '</ul>'
		}
		
		if(sections.length != 0) htmlOutput += '</ul>';
	}
	
		//var begin = '<ul class="archive_year">';
        //var end = '</ul>'
        htmlOutput = htmlOutput + '</ul>';

        // Update the DIV called Content Area with the HTML string
        $("#ContentAreaSections").append(htmlOutput);
});

// function BuildChaptersHTML(chapterName, chapterPath, totalNumFigures, i){
function BuildChaptersHTML(chapterName, chapterPath, i){
    
    // Check to see if their is a "post" attribute in the name field
    
    // Build chapters HTML string and returns it
    output = '';
    output += '<a href=' + chapterPath + '>';
    output += '<li id="years"> Chapter ' + ++i + ': ' + chapterName + '</li>';
    output += '</a>';
    return output;
}

function BuildSectionsHTML(sectionName, sectionPath, i, j) {
	output = '';
    //output += '<ul class="archive_month">';
    output += '<li id="months"><a href=' + sectionPath + '>' + ++i + '.' + ++j + ' ' + sectionName + '</li>';
    //output += '</ul>';
    return output;
}

function BuildSubSectionsHTML(subSectionName, subSectionPath, i, j, k) {
	output = '';
    //output += '<ul class="archive_day">';
    output += '<li id="days"><a href=' + subSectionPath + '>' + ++i + '.' + ++j + '.' + ++k + ' ' + subSectionName + '</li>';
    //output += '</ul>';
    return output;
}
*/


