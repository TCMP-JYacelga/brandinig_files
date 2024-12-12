function addViewer() {
	var viewerId = "viewONE";
	var viewerObj = document.createElement("object");
	viewerObj.setAttribute("id", viewerId);
	viewerObj.setAttribute("class", "com.ibm.dv.client.viewer");
	viewerObj.setAttribute("width", "900px");
	viewerObj.setAttribute("height", "700px");
	// addParameter(viewerObj, "page1", 'check_sample.gif');
	addParameter(viewerObj, "fileoptions", false);
	document.getElementById("chkImageDiv").appendChild(viewerObj);
	window.com.ibm.dv.client.Viewer.init(viewerId);
	//setTimeout(setViewerStyle(viewerId), 50);
	return false;
}

function addViewer(imageDiv, imageURL) {
	var viewerId = "viewONE";
	var viewerObj = document.createElement("object");
	viewerObj.setAttribute("id", viewerId);
	viewerObj.setAttribute("class", "com.ibm.dv.client.viewer");
	viewerObj.setAttribute("width", "980px");
	viewerObj.setAttribute("height", "700px");
	addParameter(viewerObj, "filename", imageURL); //will add Dynamically
	addParameter(viewerObj, "fileoptions", false);
	addParameter(viewerObj, "viewMode", 'Thumbsleft');
	document.getElementById(imageDiv).appendChild(viewerObj);
	window.com.ibm.dv.client.Viewer.init(viewerId);
	//setTimeout(setViewerStyle(viewerId), 50);
	return viewerObj;
}

function setViewerStyle(id) {
	document.getElementById(id).style.cssFloat = "left";
}

function addParameter(target, pName, pVal) {
	var paramObj = document.createElement("param");
	paramObj.setAttribute("name", pName);
	paramObj.setAttribute("value", pVal);
	target.appendChild(paramObj);
}

function removeViewer()
{
   var viewerId = "viewONE";
   window.com.ibm.dv.client.Viewer.destroy(viewerId);
   window[viewerId] = null;
   delete window[viewerId];
   return false;
}
