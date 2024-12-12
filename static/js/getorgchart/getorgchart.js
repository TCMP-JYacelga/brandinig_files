

getOrgChart = function (element, config) {
    this.config = {
        theme: "annabel",
        color: "darkred",
        editable: true,
        zoomable: true,
        searchable: true,
        movable: true,
        gridView: false,
        printable: false,
        scale: "auto",
        linkType: "M",
        orientation: getOrgChart.RO_TOP,
        nodeJustification: getOrgChart.NJ_TOP,
        primaryColumns: ["Name", "Title"],
        imageColumn: "Image",
        levelSeparation : 100,
        siblingSeparation : 30,
        subtreeSeparation: 40,
        topXAdjustment : 0,
        topYAdjustment: 0,
        removeEvent: "",
        updateEvent: "",
        renderBoxContentEvent: "",
        clickEvent: "",
        embededDefinitions: "",
        render : "AUTO",
        maxDepth: 50,
        dataSource: null,
        linkLabels: null,
        boxesColor: []
    }
    
    //urlColorScheme is used only for the demmos. It should be public way for changing the color
    var urlColorScheme = getOrgChart.util._getUrlVar("colorScheme");
    if (urlColorScheme) {
        this.config.color = urlColorScheme;
    }
    //end

    if (config) {
        for (var n in this.config) {
            if (typeof (config[n]) != "undefined") {
                this.config[n] = config[n];
            }
        }
    }

    this._attachEvents();
    
    this.version = "1.3";
	this.theme = getOrgChart.themes[this.config.theme];
	this.element = element;
	this.render = (this.config.render == "AUTO" ) ? getOrgChart._getAutoRenderMode() : this.config.render;	
	this._maxLevelHeight = [];
	this._maxLevelWidth = [];
	this._previousLevelNode = [];	
	this._rootYOffset = 0;
	this._rootXOffset = 0;	
	this._peopleNodes = [];
	this._peopleLabels = [];	
	this._root = new getOrgChart.person(-1, null, null, 2, 2);
	this._currentViewBox;
	this._pad = {};
	this._search = {found: [], showIndex: 0, oldValue: "", timer: ""};
	this._initContainers();
	this._elements = new getOrgChart._elements(this.element);

	if (this.theme.defs) {
	    this.config.embededDefinitions += this.theme.defs;
	}	

	this.load();
}

getOrgChart.prototype._initContainers = function () {
    this._wrapperWidth = get._browser().msie ? this.element.clientWidth : window.getComputedStyle(this.element, null).width;
    this._wrapperWidth = parseInt(this._wrapperWidth);
    if (this._wrapperWidth < 3) {
        this._wrapperWidth = 1024;
        this.element.style.width = "1024px";
    }

    this._wrapperHeight = get._browser().msie ? this.element.clientHeight : window.getComputedStyle(this.element, null).height;
    this._wrapperHeight = parseInt(this._wrapperHeight);

    if (this._wrapperHeight < 3) {
        this._wrapperHeight = parseInt((this._wrapperWidth * 9) / 16);
        this.element.style.height = this._wrapperHeight + "px";
    }

    this._paneWidth = this._wrapperWidth;
    this._paneHeight = this._wrapperHeight - this.theme.toolbarHeight;
    var innerHTML = getOrgChart.INNER_HTML
        .replace("[theme]", this.config.theme)
        .replace("[color]", this.config.color)
        .replace(/\[height]/g, this._paneHeight)
        .replace(/\[toolbar-height]/g, this.theme.toolbarHeight);
    if (getOrgChart._WATERMARK) {
        innerHTML = innerHTML.slice(0, -6);
        innerHTML += getOrgChart._WATERMARK;
    }

    this.element.innerHTML = innerHTML;
}

getOrgChart.prototype.changeColorScheme = function (color) {
    if (this.config.color == color) {
        return;
    }
    this._elements._wrapper.className = this._elements._wrapper.className.replace(this.config.color, color);
    this.config.color = color;
}

getOrgChart.prototype._positionTree = function () {	
	this._maxLevelHeight = [];
	this._maxLevelWidth = [];			
	this._previousLevelNode = [];		
	getOrgChart._firstWalk(this, this._root, 0);
	switch(this.config.orientation)
	{            
	    case getOrgChart.RO_TOP:
	    case getOrgChart.RO_TOP_PARENT_LEFT:
	    case getOrgChart.RO_LEFT:
	    case getOrgChart.RO_LEFT_PARENT_TOP:
	    		this._rootXOffset = this.config.topXAdjustment + this._root._XPosition;
	    		this._rootYOffset = this.config.topYAdjustment + this._root._YPosition;
	        break;    
	        
	    case getOrgChart.RO_BOTTOM:
	    case getOrgChart.RO_BOTTOM_PARENT_LEFT:
	    case getOrgChart.RO_RIGHT:
	    case getOrgChart.RO_RIGHT_PARENT_TOP:
	    		this._rootXOffset = this.config.topXAdjustment + this._root._XPosition;
	    		this._rootYOffset = this.config.topYAdjustment + this._root._YPosition;
	}	

	getOrgChart._secondWalk(this, this._root, 0, 0, 0);
}

getOrgChart.prototype._setLevelHeight = function (node, level) {	
	if (this._maxLevelHeight[level] == null) 
		this._maxLevelHeight[level] = 0;
    if(this._maxLevelHeight[level] < node.h)
        this._maxLevelHeight[level] = node.h;	
}

getOrgChart.prototype._setLevelWidth = function (node, level) {
	if (this._maxLevelWidth[level] == null) 
		this._maxLevelWidth[level] = 0;
    if(this._maxLevelWidth[level] < node.w)
        this._maxLevelWidth[level] = node.w;		
}

getOrgChart.prototype._setNeighbors = function(node, level) {
    node.leftNeighbor = this._previousLevelNode[level];
    if(node.leftNeighbor != null)
        node.leftNeighbor.rightNeighbor = node;
    this._previousLevelNode[level] = node;	
}

getOrgChart.prototype._getNodeSize = function (node) {
    switch(this.config.orientation)
    {
        case getOrgChart.RO_TOP:
        case getOrgChart.RO_TOP_PARENT_LEFT:
        case getOrgChart.RO_BOTTOM:
        case getOrgChart.RO_BOTTOM_PARENT_LEFT:
            return node.w;

        case getOrgChart.RO_RIGHT:
        case getOrgChart.RO_RIGHT_PARENT_TOP:
        case getOrgChart.RO_LEFT:
        case getOrgChart.RO_LEFT_PARENT_TOP:
            return node.h;
    }
    return 0;
}

getOrgChart.prototype._getLeftmost = function (node, level, maxlevel) {
    if(level >= maxlevel) return node;
    if(node._getChildrenCount() == 0) return null;
    
    var n = node._getChildrenCount();
    for(var i = 0; i < n; i++)
    {
        var iChild = node._getChildAt(i);
        var leftmostDescendant = this._getLeftmost(iChild, level + 1, maxlevel);
        if(leftmostDescendant != null)
            return leftmostDescendant;
    }

    return null;	
};

getOrgChart.prototype._getLinktLabelsById = function (node) {
    if (this.config.linkLabels && this.config.linkLabels.length > 0) {
        var f;
        for (f = 0; f < this.config.linkLabels.length; f++) {
            var linkLabel = this.config.linkLabels[f];
            if (node.id == linkLabel.id) {
                return linkLabel;
            }
        }
    }

    return null;
};

getOrgChart.prototype._drawTree = function () {
	var s = [];
	var node = null;
			
	for (var n = 0; n < this._peopleNodes.length; n++)
	{ 
		node = this._peopleNodes[n];				
		switch (this.render)
		{
		    case "SVG":
		        var imageUrl = node.getImageUrl();
		        var x = parseInt(node._XPosition);
		        var y = parseInt(node._YPosition);		        

		        var textPoints = imageUrl ? this.theme.textPoints : this.theme.textPointsNoImage;

		        s.push(getOrgChart.OPEN_GROUP.replace("[x]", x).replace("[y]", y).replace("[level]", node.level));
		        
		        for (themeProperty in this.theme) {
		            switch(themeProperty)
		            {
		                case "image":                            
		                    if (imageUrl) {
		                        s.push(this.theme.image.replace("[href]", imageUrl));
		                    }
		                    break;
		                case "box":
		                    s.push(this.theme.box);
		                    break;
		                case "text":
		                    var textIndex = 0;

		                    for (k = 0; k < this.config.primaryColumns.length; k++) {
		                        var point = textPoints[textIndex];
		                        var name = this.config.primaryColumns[k];

		                        if (!point || !node.data || !node.data[name]) {
		                            continue;
		                        }

		                        s.push(this.theme.text
                                    .replace("[index]", textIndex)
                                    .replace("[text]", node.data[name])
                                    .replace("[y]", point.y)
                                    .replace("[x]", point.x)
                                    .replace("[rotate]", point.rotate)
                                    .replace("[width]", point.width));

		                        textIndex++;
		                    }
		                    break;
		            }
		        }
		        this._fireEventHandlers("renderBoxContentEvent", { id: node.id, parentId: node.pid, data: node.data, boxContentElements: s });
		        s.push(getOrgChart.CLOSE_GROUP);
				break;					
		    case "VML":
                //todo:
				break;
		}	
		s.push(node._drawChildrenLinks(this));
	}	
	return s.join('');	
}

getOrgChart.prototype._render = function () {
	var s = [];
	
	this._positionTree();

	var viewBox = this._currentViewBox;

	if (!viewBox)
	    viewBox = this._getViewBoxFitToParrent();
	
	switch (this.render)
	{        
	    case "SVG":
	        s.push(getOrgChart.OPEN_SVG
                .replace("[defs]", this.config.embededDefinitions)
                .replace("[viewBox]", viewBox.toString()));
	        s.push(this._drawTree());
	        s.push(getOrgChart.CLOSE_SVG);
			break;					
	    case "VML":
            //todo:
			break;
	}
	
	return s.join('');
}

getOrgChart.prototype._getViewBoxFitToParrent = function () {    
    if (this.config.scale === "auto") {
        var maxX = 0;
        var maxY = 0;
        var minX = 0;
        var minY = 0;
        for (i = 0; i < this._peopleNodes.length; i++) {
            if (this._peopleNodes[i]._XPosition > maxX)
                maxX = this._peopleNodes[i]._XPosition;
            if (this._peopleNodes[i]._YPosition > maxY)
                maxY = this._peopleNodes[i]._YPosition;
            if (this._peopleNodes[i]._XPosition < minX)
                minX = this._peopleNodes[i]._XPosition;
            if (this._peopleNodes[i]._YPosition < minY)
                minY = this._peopleNodes[i]._YPosition;
        }

        var x = minX - (this.config.siblingSeparation / 2);
        var y = minY - (this.config.levelSeparation / 2);
        var width = Math.abs(minX) + Math.abs(maxX) + this.theme.size[0] + this.config.siblingSeparation;
        var height = Math.abs(minY) + Math.abs(maxY) + this.theme.size[1] + this.config.levelSeparation;

        this.initialViewBoxMatrix = [x, y, width, height];
    }
    else {
        var x = this.config.siblingSeparation / 2;
        var y = this.config.levelSeparation / 2;
        var width = (this._paneWidth) / this.config.scale;
        var height = (this._paneHeight) / this.config.scale;

        switch (this.config.orientation) {
            case getOrgChart.RO_TOP:
            case getOrgChart.RO_TOP_PARENT_LEFT:
                this.initialViewBoxMatrix = [-x, y, width, height];
                break;
            case getOrgChart.RO_BOTTOM:
            case getOrgChart.RO_BOTTOM_PARENT_LEFT:
                this.initialViewBoxMatrix = [-x, -y - height, width, height];
                break;

            case getOrgChart.RO_RIGHT:
            case getOrgChart.RO_RIGHT_PARENT_TOP:
                this.initialViewBoxMatrix = [-width - y, -x, width, height];
                break;
            case getOrgChart.RO_LEFT:
            case getOrgChart.RO_LEFT_PARENT_TOP:
                this.initialViewBoxMatrix = [y, -x, width, height];
                break;
        }
    }

    return this.initialViewBoxMatrix.toString();
}

getOrgChart.prototype.draw = function () {    
    this._elements._preInit();

    this._elements._canvasContainer.innerHTML = this._render();

    this._elements._postInit();

    if (this.config.searchable) {
        this._elements._searchTextBox.style.display = "inherit";
        this._elements._nextButton.style.display = "inherit";
        this._elements._prevButton.style.display = "inherit";
    }

    if (this.config.zoomable) {
        this._elements._zoomOutButton.style.display = "inherit";
        this._elements._zoomInButton.style.display = "inherit";
    }    

    if (this.config.editable) {
        this._elements._createPersonButton.style.display = "inherit";
        this._elements._savePersonButton.style.display = "inherit";
        this._elements._removePersonButton.style.display = "inherit";
    }

    if (this.config.gridView) {
        this._elements._gridViewButton.style.display = "inherit";
    }

    if (this.config.printable) {
        this._elements._printButton.style.display = "inherit";
    }

    if (this.config.movable) {
        this._elements._rightButton.style.display = "inherit";
        this._elements._leftButton.style.display = "inherit";
        this._elements._downButton.style.display = "inherit"; 
        this._elements._upButton.style.display = "inherit";
    }

    getOrgChart._truncateText(this._elements);

    getOrgChart._adjustLinkLabels(this._elements._linkLabels, this.config.orientation);

    this._attachEventHandlers();

    var p;
    for (p = 0; p < this.config.boxesColor.length; p++) {
        this._setBoxColor(this.config.boxesColor[p].id, this.config.boxesColor[p].color);
    }

    this.showMainView();

    return this;
}

getOrgChart.prototype.setBoxColor = function (id, color) {
    this.config.boxesColor.push({ id: id, color: color });
    this._setBoxColor(id, color);
}

getOrgChart.prototype._setBoxColor = function (id, color) {
    var i;
    for (i = 0; i < this._peopleNodes.length; i++) {
        if (this._peopleNodes[i].id === id) {            
            var boxElement = this._elements._getElementBoxByPosition(this._peopleNodes[i]._XPosition, this._peopleNodes[i]._YPosition);
            boxElement.setAttribute("class", boxElement.getAttribute("class") + " get-" + color);
            break;
        }
    }
}

getOrgChart.prototype._moveClickHandler = function (sender, args) {
    switch(sender)
    {
        case this._elements._rightButton:
            this.move("right");
            break;
        case this._elements._leftButton:            
            this.move("left");
            break;
        case this._elements._downButton:
            this.move("up");
            break;
        case this._elements._upButton:
            this.move("down");
            break;
    }
}


getOrgChart.prototype.move = function (position) {
    if (this._moving) {
        return;
    }

    this._moving = true;

    var viewBox = getOrgChart.util._getViewBox(this._elements);
    var newViewBox = viewBox.slice(0); //clone

    var factorX = this.theme.size[0];
    var factorY = this.theme.size[1];
    switch (position) {
        case "left":
            newViewBox[0] -= factorX;
            break;
        case "down":
            newViewBox[1] -= factorY;
            break;
        case "right":
            newViewBox[0] += factorX;
            break;
        case "up":
            newViewBox[1] += factorY;
            break;
    }

    var that = this;

    get._animate(this._elements._canvas,
        { viewBox: viewBox },
        { viewBox: newViewBox },
        100, get._animate._inOutSin, function () { that._moving = false; });
}



getOrgChart.prototype._attachEventHandlers = function () {    
    //grid view
    if (this.config.gridView) {
        this._addEvent(this._elements._gridViewButton, "click", this._showGridViewHandler);
        this._addEvent(this._elements._gridViewPrevPageButton, "click", this._showMainViewHandler);
    }

    //print
    if (this.config.printable) {
        this._addEvent(this._elements._printButton, "click", this._printHandler);
    }

    //movable view
    if (this.config.movable) {
        this._addEvent(this._elements._rightButton, "click", this._moveClickHandler);
        this._addEvent(this._elements._leftButton, "click", this._moveClickHandler);
        this._addEvent(this._elements._downButton, "click", this._moveClickHandler);
        this._addEvent(this._elements._upButton, "click", this._moveClickHandler);
    }

    //key events
    this._addEvent(window, "keydown", this._keydownHandler);

    //details view
    for (i = 0; i < this._elements._peopleBoxes.length; i++) {
        this._addEvent(this._elements._peopleBoxes[i], "mouseup", this._showDetailsViewHandler);
    }
    this._addEvent(this._elements._detaisViewPrevPageButton, "click", this._showMainViewHandler);
    if (this.config.editable) {
        this._addEvent(this._elements._createPersonButton, "click", this._showDetailsViewHandler);
        this._addEvent(this._elements._savePersonButton, "click", this._savePersonClickHandler);
        this._addEvent(this._elements._removePersonButton, "click", this._removePersonClickHandler);
    }

    //zoom
    if (this.config.zoomable) {
        this._addEvent(this._elements._zoomInButton, "click", this._zoomInClickHandler);
        this._addEvent(this._elements._zoomOutButton, "click", this._zoomOutClickHandler);
        this._addEvent(this._elements._canvasContainer, "DOMMouseScroll", this._scrollHandler);
        this._addEvent(this._elements._canvasContainer, "mousewheel", this._scrollHandler);
        this._addEvent(this._elements._canvasContainer, "mousemove", this._mouseMoveHandler);
        this._addEvent(this._elements._canvasContainer, "mousedown", this._mouseDownHandler);
        this._addEvent(this._elements._canvasContainer, "mouseup", this._mouseUpHandler);
    }

    //search
    if (this.config.searchable) {
        this._addEvent(this._elements._nextButton, "click", this._nextButtonClickHandler);
        this._addEvent(this._elements._prevButton, "click", this._prevButtonClickHandler);
        this._addEvent(this._elements._searchTextBox, "keyup", this._searchTextBoxKeyUpHandler);
        this._addEvent(this._elements._searchTextBox, "paste", this._searchTextBoxPasteHandler);
    }
}

// add event cross browser
getOrgChart.prototype._addEvent = function(elem, event, fn) {
    // avoid memory overhead of new anonymous functions for every event handler that's installed
    // by using local functions

    if (!elem.getListenerList) {
        elem.getListenerList = [];
    }

    if (getOrgChart.util._arrayContains(elem.getListenerList, event)) {
        //already registered for that event
        return;
    }

    function runHandlerInContextOf(context, handler) {
        return function () {
            return handler.apply(context, [this, arguments]);
        }
    }

    fn = runHandlerInContextOf(this, fn);

    function listenHandler(e) {
        var ret = fn.apply(this, arguments);
        if (ret === false) {
            e.stopPropagation();
            e.preventDefault();
        }
        return (ret);
    }

    function attachHandler() {
        // set the this pointer same as addEventListener when fn is called
        // and make sure the event is passed to the fn also so that works the same too
        var ret = fn.call(elem, window.event);
        if (ret === false) {
            window.event.returnValue = false;
            window.event.cancelBubble = true;
        }
        return (ret);
    }

    if (elem.addEventListener) {
        elem.addEventListener(event, listenHandler, false);
    } else {
        elem.attachEvent("on" + event, attachHandler);
    }


    elem.getListenerList.push(event);
}



getOrgChart.prototype._attachEvent = function (eventName, eventHandler) {
    if (!this._events) {
        this._events = {};
    }

    if (!this._events[eventName]) {
        this._events[eventName] = new Array();
    }

    this._events[eventName].push(eventHandler);
}

getOrgChart.prototype._attachEvents = function () {
    if (this.config.removeEvent) {
        this._attachEvent("removeEvent", this.config.removeEvent);
    }

    if (this.config.updateEvent) {
        this._attachEvent("updateEvent", this.config.updateEvent);
    }

    if (this.config.clickEvent) {
        this._attachEvent("clickEvent", this.config.clickEvent);
    }

    if (this.config.renderBoxContentEvent) {
        this._attachEvent("renderBoxContentEvent", this.config.renderBoxContentEvent);
    }
}

getOrgChart.prototype._fireEventHandlers = function (eventName, args) {
    if (!this._events) {
        return;
    }

    if (!this._events[eventName]) {
        return;
    }
    
    var returnValue = true;
    if (this._events[eventName]) {
        var q;
        for (q = 0; q < this._events[eventName].length; q++) {
            if (this._events[eventName][q](this, args) === false) {
                returnValue = false;
            }
        }
    }
    return returnValue;
}
getOrgChart._elements = function (element) {
    this.element = element;
    this._currentFocusedPerson;
}

getOrgChart._elements.prototype._preInit = function () {
    this._wrapper = this.element.getElementsByTagName("div")[0];
    var divs = this._wrapper.children;
    this._toolbar = divs[0];
    this._canvasContainer = divs[1];
    this._detailsView = divs[2];
    this._gridView = divs[3];
}

getOrgChart._elements.prototype._postInit = function () {
    this._canvas = this._canvasContainer.getElementsByTagName("svg")[0];
    this._plot = this._canvas.getElementsByTagName("g")[0];

    this._toolboxWrapper = this._toolbar.getElementsByTagName("div")[0];

    var mainViewToolbar = this._toolboxWrapper.getElementsByTagName("div")[0];
    var detaisViewToolbar = this._toolboxWrapper.getElementsByTagName("div")[1];
    var gridViewToolbar = this._toolboxWrapper.getElementsByTagName("div")[2];
    this._searchTextBox = mainViewToolbar.getElementsByTagName("input")[0];
    var hrefs = mainViewToolbar.getElementsByTagName("a");
    this._nextButton = hrefs[1];
    this._prevButton = hrefs[0];
    this._zoomOutButton = hrefs[2];
    this._zoomInButton = hrefs[3];
    this._rightButton = hrefs[4];
    this._leftButton = hrefs[5];
    this._downButton = hrefs[6];
    this._upButton = hrefs[7];
    this._createPersonButton = hrefs[8];
    this._gridViewButton = hrefs[9];
    this._printButton = hrefs[10];

    this._detailsViewLeftPane = this._detailsView.getElementsByTagName("div")[0];
    this._detailsViewRightPane = this._detailsView.getElementsByTagName("div")[1];
    this._peopleBoxes = this._plot.getElementsByTagName("g");

    hrefs = detaisViewToolbar.getElementsByTagName("a");
    this._detaisViewPrevPageButton = hrefs[0];
    this._removePersonButton = hrefs[1];
    this._savePersonButton = hrefs[2];

    hrefs = gridViewToolbar.getElementsByTagName("a");
    this._gridViewPrevPageButton = hrefs[0];

    this._texts = this._canvas.getElementsByTagName("text");

	//this._linkLabels = this._canvas.getElementsByClassName("get-link-label");
    this._linkLabels = this._canvas.querySelectorAll(".get-link-label");
}

getOrgChart._elements.prototype._getDetailsViewId = function () {
    return this._detailsViewRightPane.getElementsByTagName("input")[0];
}

getOrgChart._elements.prototype._getDetailsViewData = function () {
    var inputs = this._detailsViewRightPane.getElementsByTagName("input");
    var newData = {};
    for (i = 1; i < inputs.length; i++) {
        var value = inputs[i].value;
        var name = inputs[i].parentNode.previousSibling.innerHTML;
        newData[name] = value;
    }
    return newData;
}

getOrgChart._elements.prototype._getDetailsViewInputs = function () {
    return this._detailsViewRightPane.getElementsByTagName("input");
}

getOrgChart._elements.prototype._getDetailsViewDataLabelsDropDown = function () {
    var selects = this._detailsViewRightPane.getElementsByTagName("select");
    for (i = 0; i < selects.length; i++) {
        if (selects[i].className == "get-oc-labels")
        {
            return selects[i];
        }
    }
    return null;
}

getOrgChart._elements.prototype._getDetailsViewParentDropDown = function () {
    var selects = this._detailsViewRightPane.getElementsByTagName("select");
    for (i = 0; i < selects.length; i++) {
        if (selects[i].className == "get-oc-select-parent") {
            return selects[i];
        }
    }
    return null;
}

getOrgChart._elements.prototype._getElementBoxByPosition = function (x, y) {
    x = parseInt(x);
    y = parseInt(y);

    for (p = 0; p < this._peopleBoxes.length; p++){
        var transform = getOrgChart.util._getTransform(this._peopleBoxes[p]);
        var boxX = transform[4];
        var boxY = transform[5];

        if (boxX == x && boxY == y) {
            return this._peopleBoxes[p];
        }
    }
    return null;
}


getOrgChart.SCALE_FACTOR = 1.2;

getOrgChart.INNER_HTML = '<div class="get-[theme] get-[color] get-org-chart">'
    + '<div class="get-oc-tb"><div>'
    + '<div style="height:[toolbar-height]px;"><input placeholder="Search" type="text" />'
    + '<a title="previous" class="get-prev get-disabled" href="javascript:void(0)">&nbsp;</a>'
    + '<a title="next" class="get-next get-disabled" href="javascript:void(0)">&nbsp;</a>'
    + '<a class="get-minus" title="zoom out" href="javascript:void(0)"><i class="fa fa-search-minus"></i></a>'
    + '<a class="get-plus" title="zoom in" href="javascript:void(0)"><i class="fa fa-search-plus"></i></a>'
    + '<a class="get-right" title="move right" href="javascript:void(0)"><i class="fa fa-arrow-right"></i></a>'
    + '<a class="get-left" title="move left" href="javascript:void(0)"><i class="fa fa-arrow-left"></i></a>'
    + '<a class="get-down" title="move down" href="javascript:void(0)"><i class="fa fa-arrow-down"></i></a>'
    + '<a class="get-up" title="move up" href="javascript:void(0)"><i class="fa fa-arrow-up"></i></a>'
    + '<a class="get-add" title="add contact" href="javascript:void(0)">&nbsp;</a>'
    + '<a href="javascript:void(0)" class="get-grid-view" title="grid view">&nbsp;</a>'
    + '<a href="javascript:void(0)" class="get-print" title="print"><i class="fa fa-print"></i></a></div>'
    + '<div style="height:[toolbar-height]px;"><a title="previous page" class="get-prev-page" href="javascript:void(0)">&nbsp;</a><a title="delete" class="get-delete" href="javascript:void(0)">&nbsp;</a><a title="save" class="get-save get-disabled" href="javascript:void(0)">&nbsp;</a></div>'
    + '<div style="height:[toolbar-height]px;"><a title="previous page" class="get-prev-page" href="javascript:void(0)">&nbsp;</a></div>'
    + '</div></div>'
    + '<div class="get-oc-c" style="height:[height]px;"></div>'
    + '<div class="get-oc-v" style="height:[height]px;"><div class="get-image-pane"></div><div class="get-data-pane"></div></div>'
    + '<div class="get-oc-g" style="height:[height]px;"></div></div>';

getOrgChart.DETAILS_VIEW_INPUT_HTML = '<div data-field-name="[label]"><div class="get-label">[label]</div>'
    + '<div class="get-data"><input value="[value]"/></div></div>';

getOrgChart.DETAILS_VIEW_USER_LOGO = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 640 640" enable-background="new 0 0 420 420" xml:space="preserve" xmlns:xml="http://www.w3.org/XML/1998/namespace" class="get-user-logo"><g><path class="get-user-logo" d="M258.744,293.214c70.895,0,128.365-57.472,128.365-128.366c0-70.896-57.473-128.367-128.365-128.367 c-70.896,0-128.368,57.472-128.368,128.367C130.377,235.742,187.848,293.214,258.744,293.214z"/><path d="M371.533,322.432H140.467c-77.577,0-140.466,62.909-140.466,140.487v12.601h512v-12.601   C512,385.341,449.112,322.432,371.533,322.432z"/></g></svg>';

getOrgChart.DETAILS_VIEW_ID_INPUT = '<input value="[personId]" type="hidden"></input>';

getOrgChart.DETAILS_VIEW_ID_IMAGE = '<img src="[src]" width="420" />';

getOrgChart.HIGHLIGHT_SCALE_FACTOR = 1.5;

getOrgChart.MOVE_FACTOR = 2;

//orientation
getOrgChart.RO_TOP = 0;
getOrgChart.RO_BOTTOM = 1;
getOrgChart.RO_RIGHT = 2;
getOrgChart.RO_LEFT = 3;
getOrgChart.RO_TOP_PARENT_LEFT = 4;
getOrgChart.RO_BOTTOM_PARENT_LEFT = 5;
getOrgChart.RO_RIGHT_PARENT_TOP = 6;
getOrgChart.RO_LEFT_PARENT_TOP = 7;

//Level node alignment
getOrgChart.NJ_TOP = 0;
getOrgChart.NJ_CENTER = 1;
getOrgChart.NJ_BOTTOM = 2;


getOrgChart.OPEN_SVG = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" version="1.1" viewBox="[viewBox]"><defs>[defs]</defs><g>';
getOrgChart.CLOSE_SVG = '</svg>';
getOrgChart.OPEN_GROUP = '<g class="get-level-[level]" title="click here to see more details" transform="matrix(1,0,0,1,[x],[y])">';
getOrgChart.CLOSE_GROUP = '</g>';

getOrgChart._getAutoRenderMode = function () {
    var r = "VML";
    var is_ie6 = /msie 6\.0/i.test(navigator.userAgent);
    var is_ff = /Firefox/i.test(navigator.userAgent);
    if (is_ff) r = "SVG";
    return "SVG";
}

//Layout algorithm
getOrgChart._firstWalk = function (tree, node, level) {
    var leftSibling = null;

    node._XPosition = 0;
    node._YPosition = 0;
    node._prelim = 0;
    node._modifier = 0;
    node.level = level;
    node.leftNeighbor = null;
    node.rightNeighbor = null;
    tree._setLevelHeight(node, level);
    tree._setLevelWidth(node, level);
    tree._setNeighbors(node, level);
    if (node._getChildrenCount() == 0 || level == tree.config.maxDepth) {
        leftSibling = node._getLeftSibling();
        if (leftSibling != null)
            node._prelim = leftSibling._prelim + tree._getNodeSize(leftSibling) + tree.config.siblingSeparation;
        else
            node._prelim = 0;
    }
    else {
        var n = node._getChildrenCount();
        for (var i = 0; i < n; i++) {
            var iChild = node._getChildAt(i);
            getOrgChart._firstWalk(tree, iChild, level + 1);
        }

        var midPoint = node._getChildrenCenter(tree);
        midPoint -= tree._getNodeSize(node) / 2;
        leftSibling = node._getLeftSibling();
        if (leftSibling != null) {
            node._prelim = leftSibling._prelim + tree._getNodeSize(leftSibling) + tree.config.siblingSeparation;
            node._modifier = node._prelim - midPoint;
            getOrgChart._apportion(tree, node, level);
        }
        else if (tree.config.orientation <= 3) {//see orientation const
            node._prelim = midPoint;
        }
        else {
            node._prelim = 0;
        }
    }
}

getOrgChart._apportion = function (tree, node, level) {
    var firstChild = node._getFirstChild();
    var firstChildLeftNeighbor = firstChild.leftNeighbor;
    var j = 1;
    for (var k = tree.config.maxDepth - level; firstChild != null && firstChildLeftNeighbor != null && j <= k;) {
        var modifierSumRight = 0;
        var modifierSumLeft = 0;
        var rightAncestor = firstChild;
        var leftAncestor = firstChildLeftNeighbor;
        for (var l = 0; l < j; l++) {
            rightAncestor = rightAncestor._nodeParent;
            leftAncestor = leftAncestor._nodeParent;
            modifierSumRight += rightAncestor._modifier;
            modifierSumLeft += leftAncestor._modifier;
        }

        var totalGap = (firstChildLeftNeighbor._prelim + modifierSumLeft + tree._getNodeSize(firstChildLeftNeighbor) + tree.config.subtreeSeparation) - (firstChild._prelim + modifierSumRight);
        if (totalGap > 0) {
            var subtreeAux = node;
            var numSubtrees = 0;
            for (; subtreeAux != null && subtreeAux != leftAncestor; subtreeAux = subtreeAux._getLeftSibling())
                numSubtrees++;

            if (subtreeAux != null) {
                var subtreeMoveAux = node;
                var singleGap = totalGap / numSubtrees;
                for (; subtreeMoveAux != leftAncestor; subtreeMoveAux = subtreeMoveAux._getLeftSibling()) {
                    subtreeMoveAux._prelim += totalGap;
                    subtreeMoveAux._modifier += totalGap;
                    totalGap -= singleGap;
                }

            }
        }
        j++;
        if (firstChild._getChildrenCount() == 0)
            firstChild = tree._getLeftmost(node, 0, j);
        else
            firstChild = firstChild._getFirstChild();
        if (firstChild != null)
            firstChildLeftNeighbor = firstChild.leftNeighbor;
    }
}

getOrgChart._secondWalk = function (tree, node, level, X, Y) {
    if (level <= tree.config.maxDepth) {
        var xTmp = tree._rootXOffset + node._prelim + X;
        var yTmp = tree._rootYOffset + Y;
        var maxsizeTmp = 0;
        var nodesizeTmp = 0;
        var flag = false;

        switch (tree.config.orientation) {
            case getOrgChart.RO_TOP:
            case getOrgChart.RO_TOP_PARENT_LEFT:
            case getOrgChart.RO_BOTTOM:
            case getOrgChart.RO_BOTTOM_PARENT_LEFT:
                maxsizeTmp = tree._maxLevelHeight[level];
                nodesizeTmp = node.h;
                break;

            case getOrgChart.RO_RIGHT:
            case getOrgChart.RO_RIGHT_PARENT_TOP:
            case getOrgChart.RO_LEFT:
            case getOrgChart.RO_LEFT_PARENT_TOP:
                maxsizeTmp = tree._maxLevelWidth[level];
                flag = true;
                nodesizeTmp = node.w;
                break;
        }
        switch (tree.config.nodeJustification) {
            case getOrgChart.NJ_TOP:
                node._XPosition = xTmp;
                node._YPosition = yTmp;
                break;

            case getOrgChart.NJ_CENTER:
                node._XPosition = xTmp;
                node._YPosition = yTmp + (maxsizeTmp - nodesizeTmp) / 2;
                break;

            case getOrgChart.NJ_BOTTOM:
                node._XPosition = xTmp;
                node._YPosition = (yTmp + maxsizeTmp) - nodesizeTmp;
                break;
        }
        if (flag) {
            var swapTmp = node._XPosition;
            node._XPosition = node._YPosition;
            node._YPosition = swapTmp;
        }
        switch (tree.config.orientation) {
            case getOrgChart.RO_BOTTOM:
            case getOrgChart.RO_BOTTOM_PARENT_LEFT:
                node._YPosition = -node._YPosition - nodesizeTmp;
                break;

            case getOrgChart.RO_RIGHT:
            case getOrgChart.RO_RIGHT_PARENT_TOP:
                node._XPosition = -node._XPosition - nodesizeTmp;
                break;
        }
        if (node._getChildrenCount() != 0)
            getOrgChart._secondWalk(tree, node._getFirstChild(), level + 1, X + node._modifier, Y + maxsizeTmp + tree.config.levelSeparation);
        var rightSibling = node._getRightSibling();
        if (rightSibling != null)
            getOrgChart._secondWalk(tree, rightSibling, level, X, Y);
    }
}


getOrgChart._truncateText = function (_elements) {
    for (i = 0; i < _elements._texts.length; i++) {
        var x = _elements._texts[i].getAttribute("x");
        var width = _elements._texts[i].getAttribute("width");

        var length = _elements._texts[i].getComputedTextLength();

        while (length > width) {
            _elements._texts[i].textContent = _elements._texts[i].textContent.substring(0, _elements._texts[i].textContent.length - 4);
            _elements._texts[i].textContent += "...";
            length = _elements._texts[i].getComputedTextLength();
        }
    }
}


getOrgChart._adjustLinkLabels = function (linkLabels, orientation) {

    if (linkLabels && linkLabels.length > 0) {
        for (h = 0; h < linkLabels.length; h++) {
            var linkLabel = linkLabels[h];
            var currentX = parseInt(linkLabel.getAttribute("x"));
            var width = linkLabel.getComputedTextLength();

            switch (orientation) {
                case getOrgChart.RO_TOP:
                case getOrgChart.RO_TOP_PARENT_LEFT:
                case getOrgChart.RO_BOTTOM:
                case getOrgChart.RO_BOTTOM_PARENT_LEFT:
                    var adjustX = width;
                    var xPosition = linkLabel.getAttribute("data-position").split(",")[0];
                    if (xPosition == 0) {
                        linkLabel.setAttribute("x", currentX - adjustX - 6);
                    }
                    else {
                        linkLabel.setAttribute("x", currentX + 6);
                    }
                    break;

                case getOrgChart.RO_RIGHT:
                case getOrgChart.RO_RIGHT_PARENT_TOP:
                    linkLabel.setAttribute("x", currentX + 7);
                    break;

                case getOrgChart.RO_LEFT:
                case getOrgChart.RO_LEFT_PARENT_TOP:
                    var adjustX = width + 7;
                    linkLabel.setAttribute("x", currentX - adjustX);
                    break;
            }

            var rectSize = linkLabel.getBBox();
            var rectHTML = '<rect class="get-link-label-rect" width="[width]" height="[height]" x="[x]" y="[y]"  />';

            rectHTML = rectHTML.replace("[width]", rectSize.width + 6);
            rectHTML = rectHTML.replace("[height]", rectSize.height + 3);
            rectHTML = rectHTML.replace("[x]", rectSize.x - 3);
            rectHTML = rectHTML.replace("[y]", rectSize.y);

            //linkLabel.insertAdjacentHTML("beforebegin", rectHTML);
            $(linkLabel).before(rectHTML);
        }
    }
}




getOrgChart.person = function (id, pid, data, size, imageColumn) {
	this.id = id;
	this.pid = pid;
	this.data = data;
	this.w = size[0];
	this.h = size[1];
	this._XPosition = 0;
	this._YPosition = 0;
	this._prelim = 0;
	this._modifier = 0;
	this.leftNeighbor = null;
	this.rightNeighbor = null;
	this._nodeParent = null;	
	this._nodeChildren = [];
	this.imageColumn = imageColumn;
}

getOrgChart.person.prototype.compareTo = function (obj2) {
    var obj1 = this;
    if (obj1 === undefined
        || obj2 === undefined
        || obj1._XPosition === undefined
        || obj1._YPosition === undefined
        || obj2._XPosition === undefined
        || obj2._YPosition === undefined)
        return false;
    else
        return (obj1._XPosition == obj2._XPosition && obj1._YPosition == obj2._YPosition);
}

getOrgChart.person.prototype.getImageUrl = function () {
    if (this.imageColumn
        && this.data[this.imageColumn]){
        return this.data[this.imageColumn];
    }
    
    return null;
}

getOrgChart.person.prototype._getLevel = function () {
	if (this._nodeParent.id == -1) {return 0;}
	else return this._nodeParent._getLevel() + 1;
}

getOrgChart.person.prototype._getChildrenCount = function () {
    if(this._nodeChildren == null)
        return 0;
    else
        return this._nodeChildren.length;
}

getOrgChart.person.prototype._getLeftSibling = function () {
    if(this.leftNeighbor != null && this.leftNeighbor._nodeParent == this._nodeParent)
        return this.leftNeighbor;
    else
        return null;	
}

getOrgChart.person.prototype._getRightSibling = function () {
    if(this.rightNeighbor != null && this.rightNeighbor._nodeParent == this._nodeParent)
        return this.rightNeighbor;
    else
        return null;	
}

getOrgChart.person.prototype._getChildAt = function (i) {
	return this._nodeChildren[i];
}

getOrgChart.person.prototype._getChildrenCenter = function (tree) {
    node = this._getFirstChild();
    node1 = this._getLastChild();
    return node._prelim + ((node1._prelim - node._prelim) + tree._getNodeSize(node1)) / 2;	
}

getOrgChart.person.prototype._getFirstChild = function () {
	return this._getChildAt(0);
}

getOrgChart.person.prototype._getLastChild = function () {
	return this._getChildAt(this._getChildrenCount() - 1);
}

getOrgChart.person.prototype._drawChildrenLinks = function (tree) {
	var s = [];
	var xa = 0, ya = 0, xb = 0, yb = 0, xc = 0, yc = 0, xd = 0, yd = 0;
	var node1 = null;
	var adjustLinkLabelY;
	
	switch(tree.config.orientation)
	{
	    case getOrgChart.RO_TOP:
	    case getOrgChart.RO_TOP_PARENT_LEFT:
	        xa = this._XPosition + (this.w / 2);	        
	        ya = this._YPosition + this.h;
	        adjustLinkLabelY = -25;
			break;
			
	    case getOrgChart.RO_BOTTOM:
	    case getOrgChart.RO_BOTTOM_PARENT_LEFT:
			xa = this._XPosition + (this.w / 2);
			ya = this._YPosition;
			adjustLinkLabelY = 35;
			break;
			
	    case getOrgChart.RO_RIGHT:
	    case getOrgChart.RO_RIGHT_PARENT_TOP:
			xa = this._XPosition;
			ya = this._YPosition + (this.h / 2);
			adjustLinkLabelY = -10;
			break;
			
	    case getOrgChart.RO_LEFT:
	    case getOrgChart.RO_LEFT_PARENT_TOP:
			xa = this._XPosition + this.w;
			ya = this._YPosition + (this.h / 2);
			adjustLinkLabelY = -10;
			break;		
	}
	
	for (var k = 0; k < this._nodeChildren.length; k++)
	{
		node1 = this._nodeChildren[k];
		switch(tree.config.orientation)
		{
		    case getOrgChart.RO_TOP:
		    case getOrgChart.RO_TOP_PARENT_LEFT:
		        xd = xc = node1._XPosition + (node1.w / 2);		        
				yd = node1._YPosition;
				xb = xa;
				switch (tree.config.nodeJustification)
				{
					case getOrgChart.NJ_TOP:
						yb = yc = yd - tree.config.levelSeparation / 2;
						break;
					case getOrgChart.NJ_BOTTOM:
						yb = yc = ya + tree.config.levelSeparation / 2;
						break;
					case getOrgChart.NJ_CENTER:
						yb = yc = ya + (yd - ya) / 2;
						break;
				}
				break;
				
		    case getOrgChart.RO_BOTTOM:
		    case getOrgChart.RO_BOTTOM_PARENT_LEFT:
				xd = xc = node1._XPosition + (node1.w / 2);
				yd = node1._YPosition + node1.h;
				xb = xa;
				switch (tree.config.nodeJustification)
				{
					case getOrgChart.NJ_TOP:
						yb = yc = yd + tree.config.levelSeparation / 2;
						break;
					case getOrgChart.NJ_BOTTOM:
						yb = yc = ya - tree.config.levelSeparation / 2;
						break;
					case getOrgChart.NJ_CENTER:
						yb = yc = yd + (ya - yd) / 2;
						break;
				}				
				break;

		    case getOrgChart.RO_RIGHT:
		    case getOrgChart.RO_RIGHT_PARENT_TOP:
				xd = node1._XPosition + node1.w;
				yd = yc = node1._YPosition + (node1.h / 2);	
				yb = ya;
				switch (tree.config.nodeJustification)
				{
					case getOrgChart.NJ_TOP:
						xb = xc = xd + tree.config.levelSeparation / 2;
						break;
					case getOrgChart.NJ_BOTTOM:
						xb = xc = xa - tree.config.levelSeparation / 2;
						break;
					case getOrgChart.NJ_CENTER:
						xb = xc = xd + (xa - xd) / 2;
						break;
				}								
				break;		
				
		    case getOrgChart.RO_LEFT:
		    case getOrgChart.RO_LEFT_PARENT_TOP:
				xd = node1._XPosition;
				yd = yc = node1._YPosition + (node1.h / 2);		
				yb = ya;
				switch (tree.config.nodeJustification)
				{
					case getOrgChart.NJ_TOP:
						xb = xc = xd - tree.config.levelSeparation / 2;
						break;
					case getOrgChart.NJ_BOTTOM:
						xb = xc = xa + tree.config.levelSeparation / 2;
						break;
					case getOrgChart.NJ_CENTER:
						xb = xc = xa + (xd - xa) / 2;
						break;
				}								
				break;				
		}		
		
		
		switch(tree.render)
		{
			case "SVG":
			    switch (tree.config.linkType) {
			        case "M": 
			            s.push('<path class="link"   d="M' + xa + ',' + ya + ' ' + xb + ',' + yb + ' ' + xc + ',' + yc + ' L' + xd + ',' + yd + '"/>');			            
			            break;
			        case "B":
			            s.push('<path class="link"  d="M' + xa + ',' + ya + ' C' + xb + ',' + yb + ' ' + xc + ',' + yc + ' ' + xd + ',' + yd + '"/>');
			            break;
			    }

			    var linktLabel = tree._getLinktLabelsById(node1);
			    if (linktLabel != null) {
			        s.push('<text width="200" data-position="' + k + ',' + this._getLevel() + '" " class="get-link-label" x="' + xd + '" y="' + (yd + adjustLinkLabelY) + '">' + linktLabel.text + '</text>');
			    }
				break;
											
			case "VML":
				//todo:
				break;
				
		}			
	}	
	
	return s.join('');
}


if (!getOrgChart)
    var getOrgChart = {};

getOrgChart.themes = {
    "annabel":
    {
        size: [350, 140],
        toolbarHeight: 46,
        textPoints: [
            { x: 140, y: 40, width: 210 },
            { x: 140, y: 70, width: 210 },
            { x: 140, y: 95, width: 210 },
            { x: 140, y: 120, width: 210 }
        ],
        textPointsNoImage: [
            { x: 20, y: 40, width: 330 },
            { x: 20, y: 70, width: 330 },
            { x: 20, y: 95, width: 330 },
            { x: 20, y: 120, width: 330 }
        ],
        box: '<path class="get-box" d="M0 0 L350 0 L350 140 L0 140 Z"/>',
        text: '<text width="[width]" class="get-text get-text-[index]" x="[x]" y="[y]">[text]</text>',
        image: '<image xlink:href="[href]" x="1" y="1" height="138" preserveAspectRatio="xMidYMid slice" width="128"/>'
    },

    "belinda":
    {
        size: [300, 300],
        toolbarHeight: 46,
        textPoints: [
            { x: 40, y: 70, width: 220 },
            { x: 40, y: 245, width: 220 },
            { x: 65, y: 270, width: 170 }
        ],
        textPointsNoImage: [
            { x: 30, y: 100, width: 240 },
            { x: 30, y: 140, width: 240 },
            { x: 30, y: 180, width: 240 },
            { x: 30, y: 220, width: 240 }
        ],
        box: '<circle class="get-box" cx="150" cy="150" r="150" />',
        text: '<text width="[width]" class="get-text get-text-[index]" x="[x]" y="[y]">[text]</text>',
        image: '<clipPath id="get-cut-off-bottom"><rect x="0" y="75" width="300" height="150" /></clipPath><clipPath clip-path="url(#get-cut-off-bottom)" id="cut-off-bottom"><circle cx="150" cy="150" r="150" /></clipPath><image preserveAspectRatio="xMidYMid slice"  clip-path="url(#cut-off-bottom)" xlink:href="[href]" x="1" y="1" height="300"   width="300"/>'
    },

    "cassandra":
    {
        size: [310, 140],
        toolbarHeight: 46,
        textPoints: [
            { x: 110, y: 50, width: 200 },
            { x: 110, y: 80, width: 200 },
            { x: 110, y: 105, width: 200 },
            { x: 110, y: 130, width: 200 }
        ],
        textPointsNoImage: [
            { x: 110, y: 50, width: 200 },
            { x: 110, y: 80, width: 200 },
            { x: 110, y: 105, width: 200 },
            { x: 110, y: 130, width: 200 }
        ],
        box: '<path class="get-box" d="M70 10 L70 0 L310 0 L310 10 M310 130 L310 140 L70 140 L70 130"/>',
        text: '<text width="[width]" class="get-text get-text-[index]" x="[x]" y="[y]">[text]</text>',
        image: '<image xlink:href="[href]" x="1" y="20" height="100" preserveAspectRatio="xMidYMid slice" width="100"/>'
    },

    "deborah":
    {
        size: [222, 222],
        toolbarHeight: 46,
        textPoints: [
            { x: 10, y: 40, width: 202 },
            { x: 10, y: 200, width: 202 }
        ],
        textPointsNoImage: [
            { x: 10, y: 40, width: 202 },
            { x: 10, y: 200, width: 202 }
        ],
        image: '<clipPath id="getVivaClip"><path class="get-box" d="M35 0 L187 0 Q222 0 222 35 L222 187 Q222 222 187 222 L35 222 Q0 222 0 187 L0 35 Q0 0 35 0 Z"/></clipPath><image clip-path="url(#getVivaClip)" xlink:href="[href]" x="0" y="0" height="222" preserveAspectRatio="xMidYMid slice" width="222"/>',
        box: '<path class="get-text-pane" d="M222 172 Q222 222 187 222 L35 222 Q0 222 0 187 L0 172 Z"/><path class="get-text-pane" d="M35 0 L187 0 Q222 0 222 35 L222 50 L0 50 L0 50 Q0 0 35 0 Z"/><path class="get-box" d="M35 0 L187 0 Q222 0 222 35 L222 187 Q222 222 187 222 L35 222 Q0 222 0 187 L0 35 Q0 0 35 0 Z"/>',
        text: '<text width="[width]" class="get-text get-text-[index]" x="[x]" y="[y]">[text]</text>'
    },

    "lena":
    {
        size: [481, 420],
        toolbarHeight: 46,
        textPoints: [
            { x: 40, y: 130, width: 280 },
            { x: 40, y: 325, width: 280 },
            { x: 40, y: 355, width: 280 },
            { x: 40, y: 385, width: 280 }
        ],
        textPointsNoImage: [
            { x: 40, y: 130, width: 280 },
            { x: 40, y: 190, width: 280 },
            { x: 40, y: 220, width: 280 },
            { x: 40, y: 250, width: 280 },
            { x: 40, y: 280, width: 280 },
            { x: 40, y: 310, width: 280 },
            { x: 40, y: 340, width: 280 }
        ],
        defs: '<linearGradient id="getNodeDef2"><stop class="get-def-stop-1" offset="0" /><stop class="get-def-stop-2" offset="1" /></linearGradient><linearGradient xlink:href="#getNodeDef2" id="getNodeDef1" y2="0.21591" x2="0.095527" y1="0.140963" x1="0.063497" />',
        box: '<path fill="#000000" fill-opacity="0.392157" fill-rule="nonzero" stroke-width="4" stroke-miterlimit="4" d="M15.266,67.6297 C66.2394,47.802 149.806,37.5153 149.806,37.5153 L387.9,6.06772 L413.495,199.851 C413.495,199.851 427.17,312.998 460.342,367.036 C382.729,399.222 245.307,419.23 245.307,419.23 L51.5235,444.825 L7.74078,113.339 C7.74078,113.339 0.7616,86.8934 15.266,67.6297 L15.266,67.6297 z" /><path fill="url(#getNodeDef1)" fill-rule="nonzero" stroke="#000000" stroke-width="4" stroke-miterlimit="4" d="M7.83745,60.562 C66.3108,43.7342 144.877,33.4476 144.877,33.4476 L382.972,2 L408.567,195.783 C408.567,195.783 417.334,271.777 450.506,325.814 C387.314,401.952 240.378,415.162 240.378,415.162 L46.5949,440.757 L2.81219,109.271 C2.81219,109.271 -0.98386,77.3975 7.83744,60.562 L7.83745,60.562 z" />',
        text: '<text transform="rotate(-8)" width="[width]" class="get-text get-text-[index]" x="[x]" y="[y]">[text]</text>',
        image: '<image transform="rotate(-8)" xlink:href="[href]" x="40" y="150" height="150" preserveAspectRatio="xMidYMid slice" width="280"/>'
    },

    "monica":
    {
        size: [500, 220],
        toolbarHeight: 46,
        textPoints: [
            { x: 10, y: 200, width: 490 },
            { x: 200, y: 40, width: 300 },
            { x: 210, y: 65, width: 290 },
            { x: 210, y: 90, width: 290 },
            { x: 200, y: 115, width: 300 },
            { x: 185, y: 140, width: 315 }
        ],
        textPointsNoImage: [
            { x: 10, y: 200, width: 490 },
            { x: 10, y: 40, width: 490 },
            { x: 10, y: 65, width: 490 },
            { x: 10, y: 90, width: 490 },
            { x: 10, y: 115, width: 490 },
            { x: 10, y: 140, width: 490 }
        ],
        box: '<path class="get-box" d="M0 0 L500 0 L500 220 L0 220 Z"/>',
        text: '<text width="[width]" class="get-text get-text-[index]" x="[x]" y="[y]">[text]</text>',
        image: '<clipPath id="cut-off-bottom"><circle cx="105" cy="65" r="85" /></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#cut-off-bottom)" xlink:href="[href]" x="20" y="-20" height="170" width="170"/>'
    },

    "eve":
    {
        size: [500, 220],
        toolbarHeight: 46,
        textPoints: [
            { x: 10, y: 200, width: 490 },
            { x: 210, y: 40, width: 290 },
            { x: 210, y: 65, width: 290 },
            { x: 210, y: 90, width: 290 },
            { x: 210, y: 115, width: 290 },
            { x: 210, y: 140, width: 290 }
        ],
        textPointsNoImage: [
            { x: 10, y: 200, width: 490 },
            { x: 10, y: 40, width: 490 },
            { x: 10, y: 65, width: 490 },
            { x: 10, y: 90, width: 490 },
            { x: 10, y: 115, width: 490 },
            { x: 10, y: 140, width: 490 }
        ],
        box: '<path class="get-box" d="M0 0 L500 0 L500 220 L0 220 Z"/>',
        text: '<text width="[width]" class="get-text get-text-[index]" x="[x]" y="[y]">[text]</text>',
        image: '<image xlink:href="[href]" x="20" y="-20" height="170" preserveAspectRatio="xMidYMid slice" width="170"/>'
    },
    
    "vivian":
    {
        size: [500, 220],
        toolbarHeight: 46,
        textPoints: [
            { x: 10, y: 200, width: 490 },
            { x: 240, y: 40, width: 260 },
            { x: 250, y: 65, width: 250 },
            { x: 270, y: 90, width: 230 },
            { x: 290, y: 115, width: 210 },
            { x: 310, y: 140, width: 290 }
        ],
        textPointsNoImage: [
            { x: 10, y: 200, width: 490 },
            { x: 10, y: 40, width: 490 },
            { x: 10, y: 65, width: 490 },
            { x: 10, y: 90, width: 490 },
            { x: 10, y: 115, width: 490 },
            { x: 10, y: 140, width: 490 }
        ],

        box: '<path class="get-box" d="M0 0 L500 0 L500 220 L0 220 Z"/>',
        text: '<text width="[width]" class="get-text get-text-[index]" x="[x]" y="[y]">[text]</text>',
        image: '<clipPath id="cut-off-bottom"><polygon class="get-box" points="20,70 75,-20 185,-20 240,70 185,160 75,160"/></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#cut-off-bottom)" xlink:href="[href]" x="20" y="-20" height="200" width="300"/>'
    },

    "helen":
    {
        size: [380, 190],
        toolbarHeight: 46,
        textPoints: [
            { x: 20, y: 170, width: 350, rotate: 0 },
            { x: 0, y: -380, width: 170, rotate: 90 },
            { x: 20, y: -5, width: 170, rotate: 0 }
        ],
        textPointsNoImage: [
            { x: 20, y: 170, width: 350, rotate: 0 },
            { x: 20, y: 115, width: 350, rotate: 0 },
            { x: 20, y: 85, width: 350, rotate: 0 },
            { x: 20, y: 55, width: 350, rotate: 0 },
            { x: 20, y: 25, width: 350, rotate: 0 },
            { x: 20, y: -5, width: 350, rotate: 0 }
        ],
        text: '<text transform="rotate([rotate])"  width="[width]" class="get-text get-text-[index]" x="[x]" y="[y]">[text]</text>',
        image: '<image xlink:href="[href]" x="20" y="0" height="140" preserveAspectRatio="xMidYMid slice" width="350"/>'
    }
}




if (typeof (get) == "undefined") {
    get = {};
}


get._animate = function (_elements, attrStart, attrEnd, duration, easeFunc, callback) {
    var timer;
    var delay = 10;
    var increment = 1;
    var repetitions = 1;
    var limit = duration / delay + 1;

    var g = document.getElementsByTagName("g");


    if (!_elements.length) {//check if it is not an array
        _elements = [_elements];
    }
    
    function doAction() {
        for (var n in attrEnd) {
            var pxFixDoctype = getOrgChart.util._arrayContains(["top", "left", "right", "bottom"], n.toLowerCase()) ? "px" : "";
            switch (n.toLowerCase()) {
                case "d":
                    var xVal = easeFunc(((repetitions * delay) - delay) / duration) * (attrEnd[n][0] - attrStart[n][0]) + attrStart[n][0];
                    var yVal = easeFunc(((repetitions * delay) - delay) / duration) * (attrEnd[n][1] - attrStart[n][1]) + attrStart[n][1];
                    //_elements.setAttribute("d", _elements.getAttribute("d") + " L" + repetitions + " " + yVal);
                    for (z = 0; z < _elements.length; z++) {
                        _elements[z].setAttribute("d", _elements[z].getAttribute("d") + " L" + xVal + " " + yVal);
                    }
                    break;
                case "transform":
                    if (attrEnd[n]) {
                        var matrixStart = attrStart[n];
                        var matrixEnd = attrEnd[n];
                        var matrixTemp = [0, 0, 0, 0, 0, 0];

                        for (i in matrixStart) {
                            matrixTemp[i] = easeFunc(((repetitions * delay) - delay) / duration) * (matrixEnd[i] - matrixStart[i]) + matrixStart[i];
                        }

                        for (z = 0; z < _elements.length; z++) {
                            _elements[z].setAttribute("transform", "matrix(" + matrixTemp.toString() + ")");
                        }
                    }
                    break;
                case "viewbox":
                    if (attrEnd[n]) {
                        var matrixStart = attrStart[n];
                        var matrixEnd = attrEnd[n];
                        var matrixTemp = [0, 0, 0, 0];

                        for (i in matrixStart) {
                            matrixTemp[i] = easeFunc(((repetitions * delay) - delay) / duration) * (matrixEnd[i] - matrixStart[i]) + matrixStart[i];
                        }

                        for (z = 0; z < _elements.length; z++) {
                            _elements[z].setAttribute("viewBox", matrixTemp.toString());
                        }
                    }
                    break;
                case "margin":
                    if (attrEnd[n]) {
                        var matrixStart = attrStart[n];
                        var matrixEnd = attrEnd[n];
                        var matrixTemp = [0, 0, 0, 0];

                        for (i in matrixStart)
                            matrixTemp[i] = easeFunc(((repetitions * delay) - delay) / duration) * (matrixEnd[i] - matrixStart[i]) + matrixStart[i];
                        
                        var margin = "";
                        for (i = 0; i < matrixTemp.length; i ++)
                            margin += parseInt(matrixTemp[i]) + "px ";
                        
                        
                        for (z = 0; z < _elements.length; z++) {
                            if (_elements[z] && _elements[z].style) {
                                _elements[z].style[n] = val;
                            }
                        }
                    }
                    break;
                default:
                    var val = easeFunc(((repetitions * delay) - delay) / duration) * (attrEnd[n] - attrStart[n]) + attrStart[n];
                    for (z = 0; z < _elements.length; z++) {                        
                        if (_elements[z] && _elements[z].style) {
                            _elements[z].style[n] = val + pxFixDoctype;
                        }
                    }
                    break;
            }
        }

        repetitions = repetitions + increment;
        if (repetitions > limit + 1) {
            clearInterval(timer);
            if (callback)
                callback();
        }
    }

    timer = setInterval(doAction, delay);
}

get._animate._inPow = function(x) 
{
    var p = 2;
    if(x < 0) return 0;
    if(x > 1) return 1;
    return Math.pow(x, p);
}
     
get._animate._outPow = function(x) 
{
    var p = 2;
    if(x < 0) return 0;
    if(x > 1) return 1;
    var sign = p % 2 == 0 ? -1 : 1;
    return (sign * (Math.pow(x - 1, p) + sign));
}
     
get._animate._inOutPow = function(x) 
{
    var p = 2;
    if(x < 0) return 0;
    if (x > 1) return 1;               
    x *= 2;
    if (x < 1) return get._animate._inPow(x, p) / 2;           
    var sign = p % 2 == 0 ? -1 : 1;
    return (sign / 2 * (Math.pow(x - 2, p) + sign * 2));
}

get._animate._inSin = function(x)
{
    if(x < 0) return 0;
    if(x > 1) return 1;
    return -Math.cos(x * (Math.PI / 2)) + 1;
}
     
get._animate._outSin = function(x)
{
    if(x < 0) return 0;
    if(x > 1) return 1;
    return Math.sin(x *(Math.PI / 2 ));
}
     
get._animate._inOutSin = function(x)
{
    if(x < 0) return 0;
    if(x > 1) return 1;
    return -0.5 * (Math.cos(Math.PI * x) - 1);
}
     
get._animate._inExp = function(x)
{
    if(x < 0) return 0;
    if(x > 1) return 1;
    return Math.pow(2, 10 * (x - 1));
}
     
get._animate._outExp = function(x)
{
    if(x < 0) return 0;
    if(x > 1) return 1;
    return -Math.pow(2, -10 * x) + 1;
}
     
get._animate._inOutExp = function(x)
{
    if(x < 0) return 0;
    if(x > 1) return 1;
    return x < 0.5 ? 0.5 * Math.pow(2, 10 * (2*x - 1)) :0.5 * (-Math.pow(2, 10 * (-2*x + 1)) + 2);
}
     
get._animate._inCirc = function(x)
{
    if(x < 0) return 0;
    if(x > 1) return 1;
    return -(Math.sqrt(1 - x * x) - 1);
}
     
get._animate._outCirc = function(x)
{    
    if(x < 0) return 0;
    if(x > 1) return 1;
    return Math.sqrt(1 - (x - 1) * (x - 1));
}
     
get._animate._inOutCirc = function(x)
{
    if(x < 0) return 0;
    if(x > 1) return 1;
    return x < 1 ? -0.5 * (Math.sqrt(1 - x * x) - 1) : 0.5 * (Math.sqrt(1 - ((2 * x) - 2) * ((2 * x)- 2)) + 1);
}

get._animate._rebound = function(x)
{ 
    if(x < 0) return 0;
    if(x > 1) return 1;           
    if(x < (1 / 2.75)) return 1 - 7.5625 * x * x;
    else if(x < (2 / 2.75)) return 1 - (7.5625 * (x - 1.5 / 2.75) * (x - 1.5 / 2.75) + 0.75);
    else if(x < (2.5 / 2.75)) return 1 - (7.5625 * (x - 2.25 / 2.75) * (x - 2.25 / 2.75) + 0.9375);
    else return 1 - (7.5625 * (x - 2.625 / 2.75) * (x - 2.625 / 2.75) + 0.984375);
}
     
get._animate._inBack = function(x)
{
    if(x < 0) return 0;
    if(x > 1) return 1;   
    return x * x * ((1.70158 + 1) * x - 1.70158);
}
     
get._animate._outBack = function(x)
{
    if(x < 0) return 0;
    if(x > 1) return 1; 
    return (x - 1) * (x - 1) * ((1.70158 + 1) * (x - 1) + 1.70158) + 1;
}
    
get._animate._inOutBack = function(x)
{
    if(x < 0) return 0;
    if(x > 1) return 1; 
    return x < 0.5 ? 0.5 * (4 * x * x * ((2.5949 + 1) * 2 * x - 2.5949)) : 0.5 * ((2 * x - 2) * (2 * x - 2) * ((2.5949 + 1) * (2 * x - 2) + 2.5949) + 2);
}

get._animate._impulse = function(x) 
{
    var k = 2;
    var h = k*x;
    return h * Math.exp(1 - h);
}
     
get._animate._expPulse = function(x) 
{
    var k = 2;
    var n = 2;
    return Math.exp(-k * Math.pow(x, n));
}
if (typeof (get) == "undefined") {
    get = {};
}


get._browser = function () {
    if (getOrgChart._browser)
        return getOrgChart._browser;
    var ua = navigator.userAgent;
    ua = ua.toLowerCase();
    var rwebkit = /(webkit)[ \/]([\w.]+)/;
    var ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/;
    var rmsie = /(msie) ([\w.]+)/;
    var rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/;
    var match = rwebkit.exec(ua) ||
    ropera.exec(ua) ||
    rmsie.exec(ua) ||
    ua.indexOf("compatible") < 0 && rmozilla.exec(ua) || [];
    var browser = { browser: match[1] || "", version: match[2] || "0" };
    getOrgChart._browser = { msie: browser.browser == "msie", webkit: browser.browser == "webkit", mozilla: browser.browser == "mozilla", opera: browser.browser == "opera" };
    return getOrgChart._browser;
}

getOrgChart.prototype._keydownHandler = function (sender, args) {
    var e = args[0];
    
    switch (e.keyCode) {
        case 37:
            this.move("left");
            break;
        case 38:
            this.move("down");
            break;
        case 39:
            this.move("right");
            break;
        case 40:
            this.move("up");
            break;
        case 107:
            this.zoom(1, true);
            break;
        case 109:
            this.zoom(-1, true);
            break;
    }
}
//LICENSE GOES BEFORE "getOrgChart.util={};", DO NOT PUT MORE LINES "
getOrgChart.util = {};

getOrgChart.util._getViewBox = function (_elements) {
    var viewBox = _elements._canvas.getAttribute("viewBox");
    viewBox = "[" + viewBox + "]";    
    return eval(viewBox.replace(/\ /g, ", "));
}

getOrgChart.util._getTransform = function (element) {
    var transform = element.getAttribute("transform");
    transform = transform.replace("matrix", "").replace("(", "").replace(")", "");
    transform = getOrgChart.util._trim(transform);
    transform = "[" + transform + "]";
    return eval(transform.replace(/\ /g, ", "));
}

getOrgChart.util._getDatabaseNodeByPosition = function (x, y, _peopleNodes) {
    for (i = 0; i < _peopleNodes.length; i++) 
        if (parseInt(_peopleNodes[i]._XPosition) == x && parseInt(_peopleNodes[i]._YPosition) == y) 
            return _peopleNodes[i];

    return null;
}

getOrgChart.util._trim = function (val) {
    return val.replace(/^\s+|\s+$/g, '');
}

getOrgChart.util._arrayContains = function (arr, obj) {
    var i = arr.length;
    while (i--) 
        if (arr[i] === obj) 
            return true;     
    return false;
}

getOrgChart.util._generateGUID = function () {
    var s4 = function()  {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}


getOrgChart.util._getUrlVar = function (parameterName) {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        if (hash && hash.length == 2 && hash[0] === parameterName) {
            var binVal1, char1;
            var regExp = /(%[^%]{2})/;
            while ((encodedChar = regExp.exec(hash[1])) != null && encodedChar.length > 1 && encodedChar[1] != '') {
                binVal1 = parseInt(encodedChar[1].substr(1), 16);
                char1 = String.fromCharCode(binVal1);
                hash[1] = hash[1].replace(encodedChar[1], char1);
            }
            return decodeURIComponent(escape(hash[1]));
        }
    }
    return null;
}

getOrgChart.util._stringtoXML = function (text) {
    if (window.ActiveXObject) {
        var doc = new ActiveXObject('Microsoft.XMLDOM');
        doc.async = 'false';
        doc.loadXML(text);
    } else {
        var parser = new DOMParser();
        var doc = parser.parseFromString(text, 'text/xml');
    }
    return doc;
}

getOrgChart.util._isRoot = function (pid) {
    if (pid == null || typeof (pid) == "undefined" || pid == "" || pid == -1) {
        return true;
    }
    return false;
}

getOrgChart.util._isNotEmpty = function (value) {
    return (typeof value !== "undefined" && value !== null);
}





getOrgChart.prototype.showDetailsView = function (id) {
    var personNode;
    for (i = 0; i < this._peopleNodes.length; i++)
        if (this._peopleNodes[i].id == id)
            personNode = this._peopleNodes[i];
    this._showDetailsView(personNode);
}

getOrgChart.prototype._showDetailsViewHandler = function (sender, args) {
    var maxAbsoluteMoveForClick = 7;
    if (this._pad._absoluteMoveInPixels > maxAbsoluteMoveForClick) {
        return;
    }
    var databaseNode;
    if (sender.nodeName.toLowerCase() != "a") {//if it is not new person
        var transform = getOrgChart.util._getTransform(sender);
        var x = transform[4];
        var y = transform[5];

        databaseNode = getOrgChart.util._getDatabaseNodeByPosition(x, y, this._peopleNodes);

        var clickEventResult = this._fireEventHandlers("clickEvent", { id: databaseNode.id, parentId: databaseNode.pid, data: databaseNode.data });
        if (!clickEventResult) {
            return;
        }
    }

    this._showDetailsView(databaseNode);
}

getOrgChart.prototype._showDetailsView = function (databaseNode) {
    var isRoot = false;
    var isNew = (typeof (databaseNode) === "undefined");
    if (isNew === false) {
        isRoot = (databaseNode._nodeParent == this._root);
    }
    var createParentSelectHTML = function (pid, _peopleNodes, primaryColumns) {
        var invisible = isRoot ? 'style="display:none;"' : "";
        var select = '<select ' + invisible + 'class="get-oc-select-parent"><option value="' + pid + '">--select parent--</option>';
        var person = null;

        for (var n = 0; n < _peopleNodes.length; n++) {
            person = _peopleNodes[n];
            if (databaseNode == person) {
                continue; //dont show the same parent
            }
            var val = "";
            for (i = 0; i < primaryColumns.length; i++) {
                var name = primaryColumns[i];
                if (!person.data || !person.data[name])
                    continue;
                if (val) {
                    val = val + ", " + person.data[name];
                }
                else {
                    val += person.data[name];
                }
            }

            if (person.id == pid) {
                select += '<option selected="selected" value="' + person.id + '">' + val + '</option>';
            }
            else {
                select += '<option value="' + person.id + '">' + val + '</option>';
            }
        }

        select += "</select>";

        return select;
    }

    var createDataLabelsSelectHTML = function (labels, _peopleLabels) {
        var select = '<select class="get-oc-labels"><option value="">--other--</option>';
        var options;

        for (i = 0; i < _peopleLabels.length; i++)
            if (!getOrgChart.util._arrayContains(labels, _peopleLabels[i]))
                options += '<option value="' + _peopleLabels[i] + '">' + _peopleLabels[i] + '</option>';

        select += options;

        select += "</select>";

        if (!options)
            select = "";

        return select;
    }

    var html = "";
    var labels = [];

    if (isNew === true) { //add person
        databaseNode = {};
        databaseNode.data = {};
        for (i = 0; i < this._peopleLabels.length; i++) {
            databaseNode.data[this._peopleLabels[i]] = "";
        }
        databaseNode.id = "";
        databaseNode.pid = "";
    }

    html += createParentSelectHTML(databaseNode.pid, this._peopleNodes, this.config.primaryColumns);


    html += getOrgChart.DETAILS_VIEW_ID_INPUT.replace("[personId]", databaseNode.id);

    for (label in databaseNode.data) {
        html += getOrgChart.DETAILS_VIEW_INPUT_HTML
            .replace(/\[label]/g, label)
            .replace("[value]", databaseNode.data[label]);
        labels.push(label);
    }

    html += createDataLabelsSelectHTML(labels, this._peopleLabels);

    this._elements._detailsViewRightPane.innerHTML = html;

    var imageUrl = databaseNode.getImageUrl ? databaseNode.getImageUrl() : "";

    if (imageUrl)
        this._elements._detailsViewLeftPane.innerHTML = getOrgChart.DETAILS_VIEW_ID_IMAGE.replace("[src]", imageUrl);
    else
        this._elements._detailsViewLeftPane.innerHTML = getOrgChart.DETAILS_VIEW_USER_LOGO;

    this._detaislViewAttachEventHandlers();

    if (isRoot || isNew) {
        this._elements._removePersonButton.className = "get-delete get-disabled";
    }
    else {
        this._elements._removePersonButton.className = "get-delete";
    }
    
    this._elements._canvasContainer.style.top = "-9999px";
    this._elements._canvasContainer.style.left = "-9999px";
    this._elements._detailsView.style.top = this.theme.toolbarHeight + "px";
    this._elements._detailsView.style.left = "0px";
    this._elements._gridView.style.top = "-9999px";
    this._elements._gridView.style.left = "-9999px";
    this._elements._gridView.innerHTML = "";

    this._elements._detailsViewRightPane.style.opacity = 0;
    this._elements._detailsViewLeftPane.style.opacity = 0;

    get._animate(this._elements._detailsViewLeftPane,
        { left: -100, opacity: 0 },
        { left: 20, opacity: 1 },
        200, get._animate._outExp);

    get._animate(this._elements._toolboxWrapper,
        { top: 0 },
        { top: -this.theme.toolbarHeight },
        200, get._animate._outSin);

    get._animate(this._elements._detailsViewRightPane,
        { opacity: 0 },
        { opacity: 1 },
        400, get._animate._outExp);
}

getOrgChart.prototype._detaislViewAttachEventHandlers = function () {
    var inputs = this._elements._getDetailsViewInputs();
    for (n = 0; n < inputs.length; n++) {
        this._addEvent(inputs[n], "keypress", this._detailsViewPasteKeypressChangeHandler)
        this._addEvent(inputs[n], "paste", this._detailsViewPasteKeypressChangeHandler)
    }

    if (this._elements._getDetailsViewParentDropDown()) {
        this._addEvent(this._elements._getDetailsViewParentDropDown(), "change", this._detailsViewPasteKeypressChangeHandler)

    }

    if (this._elements._getDetailsViewDataLabelsDropDown()) {
        this._addEvent(this._elements._getDetailsViewDataLabelsDropDown(), "change", this._detailsViewdataLabelsDropDownOnChangeHandler)
    }
}

getOrgChart.prototype._detailsViewPasteKeypressChangeHandler = function (sender, args) {
    this._elements._savePersonButton.className = this._elements._savePersonButton.className.replace("get-disabled", "");
}

getOrgChart.prototype._detailsViewdataLabelsDropDownOnChangeHandler = function (sender, args) {
    var temp = this._elements._getDetailsViewData();
    var select = this._elements._getDetailsViewDataLabelsDropDown();
    var label = select.value;

    for (var i = 0; i < select.options.length; i++)
        if (label == select.options[i].value)
            select.options[i] = null;             

    if (!label) {
        return;
    }

    var html = this._elements._detailsViewRightPane.innerHTML;
    var inputHtml = getOrgChart.DETAILS_VIEW_INPUT_HTML
                    .replace(/\[label]/g, label)
                    .replace("[value]", "");

    var index = html.indexOf('<select class="get-oc-labels">');
    this._elements._detailsViewRightPane.innerHTML = html.substring(0, index) + inputHtml + html.substring(index, html.length);

    var inputs = this._elements._getDetailsViewInputs();
    var j = 1;
    for (i in temp) {
        inputs[j].value = temp[i];
        j++;
    }

    this._detaislViewAttachEventHandlers();
}

getOrgChart.prototype._savePersonClickHandler = function (sender, args) {
    if (this._elements._savePersonButton.className.indexOf("get-disabled") != -1) {//if there is no change continue
        return;
    }

    var id = this._elements._getDetailsViewId().value;
    var pid;
    if (this._elements._getDetailsViewParentDropDown() && this._elements._getDetailsViewParentDropDown().value) {
        pid = this._elements._getDetailsViewParentDropDown().value;
    }
    var newData = this._elements._getDetailsViewData();
    this.updatePerson(id, pid, newData);
    this._elements._savePersonButton.className = this._elements._savePersonButton.className + "get-disabled";
    this.showMainView();
}

getOrgChart.prototype._removePersonClickHandler = function (sender, args) {
    if (this._elements._removePersonButton.className.indexOf("get-disabled") != -1) {//if tis root node or new person continue
        return;
    }

    var id = this._elements._getDetailsViewId().value;
    this.removePerson(id);
    this.showMainView();
}
getOrgChart.prototype._showGridViewHandler = function () {
    this.showGridView();
}

getOrgChart.prototype.showGridView = function () {
    var html = '<table cellpadding="0" cellspacing="0" border="0">';
    html += "<tr>";
    html += "<th>ID</th><th>Parent ID</th>";

    for (i = 0; i < this._peopleLabels.length; i++) {
        var name = this._peopleLabels[i];
        html += "<th>" + name + "</th>";
    }
    html += "</tr>";
    for (i = 0; i < this._peopleNodes.length; i++) {
        var style = (i % 2 == 0) ? "get-even" : "get-odd";
        var personData = this._peopleNodes[i].data;
        html += '<tr class="' + style + '">';
        html += "<td>" + this._peopleNodes[i].id + "</td>";
        html += "<td>" + this._peopleNodes[i].pid + "</td>";
        for (j = 0; j < this._peopleLabels.length; j++) {
            var name = this._peopleLabels[j];
            var value = personData[name];
            html += "<td>";
            html += value ? value : "&nbsp;";
            html += "</td>";
        }
        html += "</tr>";
    }
    html += "</table>";
    this._elements._gridView.innerHTML = html;

    
    this._elements._canvasContainer.style.top = "-9999px";
    this._elements._canvasContainer.style.left = "-9999px";
    this._elements._detailsView.style.top = "-9999px";
    this._elements._detailsView.style.left = "-9999px";
    this._elements._gridView.style.top = this.theme.toolbarHeight + "px";
    this._elements._gridView.style.left = "0px";

    get._animate(this._elements._gridView,
        { left: 100, opacity: 0 },
        { left: 0, opacity: 1 },
        200, get._animate._outExp);


    get._animate(this._elements._toolboxWrapper,
        { top: 0 },
        { top: -this.theme.toolbarHeight * 2},
        200, get._animate._outSin);
}

getOrgChart.prototype._showMainViewHandler = function (sender, args) {
    this.showMainView();
}

getOrgChart.prototype.showMainView = function () {
    this._elements._canvasContainer.style.top = this.theme.toolbarHeight + "px";
    this._elements._canvasContainer.style.left = "0px";
    this._elements._detailsView.style.top = "-9999px";
    this._elements._detailsView.style.left = "-9999px";
    this._elements._gridView.style.top = "-9999px";
    this._elements._gridView.style.left = "-9999px";
    this._elements._gridView.innerHTML = "";

    if (this.config.searchable) {
        this._elements._searchTextBox.focus();
    }


    this._elements._canvas.style.opacity = 0;

    get._animate(this._elements._canvas,
        { opacity: 0 },
        { opacity: 1 },
        200, get._animate._inSin);

    if (this._elements._toolboxWrapper.style.top != 0 && this._elements._toolboxWrapper.style.top != "") {
        get._animate(this._elements._toolboxWrapper,
            { top: -46 },
            { top: 0 },
            200, get._animate._outSin);
    }

    //var shuffledIndexArray = new Array(this._elements._peopleBoxes.length);
    //var sliceIndex = parseInt(this._elements._peopleBoxes.length / 2);

    //for (u = 0; u < this._elements._peopleBoxes.length; u++) {
    //    this._elements._peopleBoxes[u].style.opacity = 0;
    //    shuffledIndexArray[u] = u;
    //}

    //shuffledIndexArray = getOrgChart.util.shuffle(shuffledIndexArray);

    //var array1 = shuffledIndexArray.slice(0, sliceIndex);
    //var array2 = shuffledIndexArray.slice(sliceIndex, this._elements._peopleBoxes.length);

    //var part1 = [];
    //var part2 = [];

    //for (u = 0; u < array1.length; u++) {
    //    part1.push(this._elements._peopleBoxes[array1[u]]);
    //}

    //for (u = 0; u < array2.length; u++) {
    //    part2.push(this._elements._peopleBoxes[array2[u]]);
    //}

    //get._animate(part1,
    //        { opacity: 0 },
    //        { opacity: 1 },
    //        200, get._animate._inSin,
    //        function () {
    //            get._animate(part2,
    //                    { opacity: 0 },
    //                    { opacity: 1 },
    //                    200, get._animate._inSin);
    //        });
}

getOrgChart.prototype._printHandler = function (sender, args) {
    this.print();
}


getOrgChart.prototype.print = function () {

    var chart = this,
        container = this._elements.element,
        toolbox = this._elements._toolbar,
        origDisplay = [],
        origParent = container.parentNode,
        origToolbox = toolbox.style.display,
        body = document.body,
        childNodes = body.childNodes,         
        i;


    if (chart._isPrinting) { // block the button while in printing mode
        return;
    }

    chart._isPrinting = true;

    // hide all body content
    for (i = 0; i < childNodes.length; i++) {
        var node = childNodes[i];
        if (node.nodeType === 1){            
            origDisplay[i] = node.style.display;
            node.style.display = "none";
        }
    }

    toolbox.style.display = "none";

    //// pull out the chart
    body.appendChild(container);    

    // print
    window.focus(); 
    window.print();

    // allow the browser to prepare before reverting
    setTimeout(function () {

        // put the chart back in
        origParent.appendChild(container);

        for (i = 0; i < childNodes.length; i++) {
            var node = childNodes[i];
            if (node.nodeType === 1) {
                node.style.display = origDisplay[i];
            }
        }

        toolbox.style.display = origToolbox;

        chart._isPrinting = false;

    }, 1000);
    window.location.reload();
}

getOrgChart.prototype._zoomInClickHandler = function () {
    this.zoom(1, true);
}

getOrgChart.prototype._zoomOutClickHandler = function () {
    this.zoom(-1, true);
}

getOrgChart.prototype._scrollHandler = function (sender, evt) {
    this._elements._currentFocusedPerson = undefined;
    var delta = evt[0].wheelDelta ? evt[0].wheelDelta / 40 : evt[0].detail ? -evt[0].detail : 0;
    if (delta) {
        this.zoom(delta, false);
    }
    return evt[0].preventDefault() && false;
}

getOrgChart.prototype._mouseMoveHandler = function (sender, evt) {    
    this._elements._currentFocusedPerson = undefined;
    this._pad.mouseLastX = (evt[0].pageX - this._elements._canvasContainer.offsetLeft);
    this._pad.mouseLastY = (evt[0].pageY - this._elements._canvasContainer.offsetTop);
    this._pad.dragged = true;


    if (this._pad.dragStart) {
        var absMoveX = Math.abs(this._pad.dragStart.x - this._pad.mouseLastX);
        var absMoveY = Math.abs(this._pad.dragStart.y - this._pad.mouseLastY);
        this._pad._absoluteMoveInPixels = absMoveX + absMoveY;
        this._elements._canvasContainer.style.cursor = "move";
        var viewBox = getOrgChart.util._getViewBox(this._elements);

        var widthAspectRatio = viewBox[2] / this._paneWidth;
        var heightAspectRatio = viewBox[3] / this._paneHeight;
        var aspectRatio = widthAspectRatio > heightAspectRatio ? widthAspectRatio : heightAspectRatio;
        viewBox[0] = -((this._pad.mouseLastX - this._pad.dragStart.x) * aspectRatio) + this._pad.dragStart.viewBoxLeft;
        viewBox[1] = -((this._pad.mouseLastY - this._pad.dragStart.y) * aspectRatio) + this._pad.dragStart.viewBoxTop;

        viewBox[0] = parseInt(viewBox[0]);
        viewBox[1] = parseInt(viewBox[1]);

        this._elements._canvas.setAttribute("viewBox", viewBox.toString());
    }
}

getOrgChart.prototype._mouseDownHandler = function (sender, evt) {
    document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
    this._pad.mouseLastX = (evt[0].pageX - this._elements._canvasContainer.offsetLeft);
    this._pad.mouseLastY = (evt[0].pageY - this._elements._canvasContainer.offsetTop);
    var viewBox = getOrgChart.util._getViewBox(this._elements);
    this._pad.dragStart = { x: this._pad.mouseLastX, y: this._pad.mouseLastY, viewBoxLeft: viewBox[0], viewBoxTop: viewBox[1] };
    this._pad.dragged = false;
    this._pad._absoluteMoveInPixels = 0;
}

getOrgChart.prototype._mouseUpHandler = function (sender, evt) {
    this._pad.dragStart = null;
    this._elements._canvasContainer.style.cursor = "default"; 
}

getOrgChart.prototype.zoom = function (delta, animate) {
    if (this._zoom) {
        return false;
    }

    this._zoom = true;
    var that = this;
    var viewBox = getOrgChart.util._getViewBox(this._elements);
    var tempViewBox = viewBox.slice(0); //clone

    var tempViewBoxWidth = viewBox[2];
    var tempViewBoxHeight = viewBox[3];

    if (delta > 0) {
        viewBox[2] = viewBox[2] / (getOrgChart.SCALE_FACTOR * 1.2);
        viewBox[3] = viewBox[3] / (getOrgChart.SCALE_FACTOR * 1.2);
    }
    else {
        viewBox[2] = viewBox[2] * (getOrgChart.SCALE_FACTOR * 1.2);
        viewBox[3] = viewBox[3] * (getOrgChart.SCALE_FACTOR * 1.2);
    }

    viewBox[0] = viewBox[0] - (viewBox[2] - tempViewBoxWidth) / 2;
    viewBox[1] = viewBox[1] - (viewBox[3] - tempViewBoxHeight) / 2;

    if (animate){
        get._animate(this._elements._canvas,
            { viewBox: tempViewBox },
            { viewBox: viewBox },
            500, get._animate._outBack, function () { that._zoom = false; });
    }
    else {
        this._elements._canvas.setAttribute("viewBox", viewBox.toString());
        this._zoom = false;
    }

    return false;
}


getOrgChart.prototype._nextButtonClickHandler = function (sender, args) {
    if (sender.className.indexOf("get-disabled") > -1) {
        return false;
    }

    var _this = this;

    clearTimeout(this._search.timer);
    this._search.timer = setTimeout(function () { _this._keyupPasteNextPrevHandler("next"); }, 100);
}

getOrgChart.prototype._prevButtonClickHandler = function (sender, args) {    
    if (sender.className.indexOf("get-disabled") > -1) {
        return false;
    }

    var _this = this;

    clearTimeout(this._search.timer);
    this._search.timer = setTimeout(function () { _this._keyupPasteNextPrevHandler("prev"); }, 100);
}

getOrgChart.prototype._searchTextBoxKeyUpHandler = function (sender, args) {
    var _this = this;

    clearTimeout(this._search.timer);
    this._search.timer = setTimeout(function () { _this._keyupPasteNextPrevHandler(); }, 500);
}

getOrgChart.prototype._searchTextBoxPasteHandler = function (sender, args) {
    var _this = this;

    clearTimeout(this._search.timer);
    this._search.timer = setTimeout(function () { _this._keyupPasteNextPrevHandler(); }, 100);
}


getOrgChart.prototype._keyupPasteNextPrevHandler = function (nextOrPrev) {
    var _this = this;
    var initialViewBoxMatrix = this.initialViewBoxMatrix;
    var viewBox = getOrgChart.util._getViewBox(this._elements);
    var tempViewBox = viewBox.slice(0); //clone
    if (nextOrPrev) {
        nextOrPrev == "next" ? this._search.showIndex++ : this._search.showIndex--;
    }
    else if (this._elements._searchTextBox.value) {           
        if (this._search.oldValue == this._elements._searchTextBox.value) {
            return;
        }
        this._search.oldValue = this._elements._searchTextBox.value;
        this._search.found = this._filter(this._elements._searchTextBox.value);
        this._search.showIndex = 0;
    }
    else {
        this._search.oldValue = undefined;
        this._search.found = [];
        this._elements._currentFocusedPerson = undefined;
        get._animate(this._elements._canvas,
            { viewBox: tempViewBox },
            { viewBox: initialViewBoxMatrix },
            200, get._animate._outSin);
        this._disableNextPrevButtons();
        return;
    }

    this._disableNextPrevButtons();

    if (!this._search.found || !this._search.found.length) { // if the search crireria is the same as the previous one
        return;
    }

    if (this._search.found[this._search.showIndex].node.compareTo(this._elements._currentFocusedPerson)) {// if the search item is the current one 
        return;
    }

    var centerPointScreenWidth = this._paneWidth / 2;
    var centerPointScreenHeight = this._paneHeight / 2;

    var centerPointViewWidth = this.theme.size[0] / 2;
    var centerPointViewHeight = this.theme.size[1] / 2;

    this._elements._currentFocusedPerson = this._search.found[this._search.showIndex].node;
    
    if (this._search.found.length) {
        var xPosition = this._search.found[this._search.showIndex].node._XPosition;
        var yPosition = this._search.found[this._search.showIndex].node._YPosition;

        viewBox[0] = xPosition - (centerPointScreenWidth - centerPointViewWidth);
        viewBox[1] = yPosition - (centerPointScreenHeight - centerPointViewHeight);
        viewBox[2] = this._paneWidth;
        viewBox[3] = this._paneHeight;

        var boxElement = this._elements._getElementBoxByPosition(xPosition, yPosition);
        var parentElement = boxElement.parentNode;
        parentElement.removeChild(boxElement);
        parentElement.appendChild(boxElement);
        var initialTransform = getOrgChart.util._getTransform(boxElement);
        var tempTransform = initialTransform.slice(0); //clone
        tempTransform[0] = getOrgChart.HIGHLIGHT_SCALE_FACTOR;
        tempTransform[3] = getOrgChart.HIGHLIGHT_SCALE_FACTOR;
        tempTransform[4] = tempTransform[4] - ((this.theme.size[0] / 2) * (getOrgChart.HIGHLIGHT_SCALE_FACTOR - 1));        
        tempTransform[5] = tempTransform[5] - ((this.theme.size[1] / 2) * (getOrgChart.HIGHLIGHT_SCALE_FACTOR - 1));

        get._animate(this._elements._canvas,
            { viewBox: tempViewBox },
            { viewBox: viewBox },
            150, get._animate._outSin, function () {
                get._animate(boxElement,
                    { transform: initialTransform },
                    { transform: tempTransform },
                    200, get._animate._outCirc, function () {
                        get._animate(boxElement,
                            { transform: tempTransform },
                            { transform: initialTransform },
                            200, get._animate._inCirc)
                    })
            });
    }
};

getOrgChart.prototype._disableNextPrevButtons = function () {
    if ((this._search.showIndex < this._search.found.length - 1) && (this._search.found.length != 0))
        this._elements._nextButton.className = this._elements._nextButton.className.replace(" get-disabled", "");
    else if (this._elements._nextButton.className.indexOf(" get-disabled") == -1)
        this._elements._nextButton.className = this._elements._nextButton.className + " get-disabled";

    if ((this._search.showIndex != 0) && (this._search.found.length != 0))
        this._elements._prevButton.className = this._elements._prevButton.className.replace(" get-disabled", "");
    else if (this._elements._prevButton.className.indexOf(" get-disabled") == -1)
        this._elements._prevButton.className = this._elements._prevButton.className + " get-disabled";
}

getOrgChart.prototype._filter = function (val) {
    var matches = [];
    if (val.toLowerCase) {
        val = val.toLowerCase();
    }
    for (n = 0; n < this._peopleNodes.length; n++) {
        for (m in this._peopleNodes[n].data) {
            if (m == this.config.imageColumn)
                continue;

            var indexOf = -1;
            if (getOrgChart.util._isNotEmpty(this._peopleNodes[n])
                && getOrgChart.util._isNotEmpty(this._peopleNodes[n].data[m])) {
                var lowerCaseValue = this._peopleNodes[n].data[m].toString().toLowerCase();
                indexOf = lowerCaseValue.indexOf(val);
            }

            if (indexOf > -1) {
                matches.push({ indexOf: indexOf, node: this._peopleNodes[n] });
                break;
            }
        }
    }

    function compare(a, b) {
        if (a.indexOf < b.indexOf)
            return -1;
        if (a.indexOf > b.indexOf)
            return 1;
        return 0;
    }

    matches.sort(compare);

    return matches;
}

getOrgChart.prototype.removePerson = function (personId) {
    var removeEventResult = this._fireEventHandlers("removeEvent", { id: personId });
    if (!removeEventResult) {
        return;
    }
    this._removePerson(personId);
    this._currentViewBox = getOrgChart.util._getViewBox(this._elements);

    this.draw();

    this._elements._canvas.style.opacity = 0;
}

getOrgChart.prototype.updatePerson = function (id, pid, data) {
    var updateEventResult = this._fireEventHandlers("updateEvent", { id: id, parentId: pid, data: data });
    if (!updateEventResult) {
        return;
    }

    if (id == "") { //add person
        id = getOrgChart.util._generateGUID();
        this.createPerson(id, pid, data);
    }
    else {//edit person
        for (t = this._peopleNodes.length - 1; t >= 0; t--) {
            if (this._peopleNodes[t].id == id) {
                //edit first person (ceo)
                if (this._peopleNodes[t].pid == null || typeof (this._peopleNodes[t].pid) == "undefined" || this._peopleNodes[t].pid == "") {
                    this._peopleNodes[t].data = data;
                }
                else if (this._peopleNodes[t].pid == pid) {//edit person
                    this._peopleNodes[t].data = data;
                }
                else {//edit person and add another parent
                    this._removePerson(id);
                    this.createPerson(id, pid, data);
                }
                break;
            }
        }
    }

    this._currentViewBox = getOrgChart.util._getViewBox(this._elements);
    this.draw();
}

getOrgChart.prototype.createPerson = function (id, pid, data) {
    var pnode = null; 
    if (getOrgChart.util._isRoot(pid)) {
        pnode = this._root;
    }
    else {
        for (var k = 0; k < this._peopleNodes.length; k++) {
            if (this._peopleNodes[k].id == pid) {
                pnode = this._peopleNodes[k];
                break;
            }
        }
    }

    var node = new getOrgChart.person(id, pid, data, this.theme.size, this.config.imageColumn); 
    node._nodeParent = pnode;  
    var i = this._peopleNodes.length; 
    this._peopleNodes[i] = node;
    var h = pnode._nodeChildren.length; 
    pnode._nodeChildren[h] = node;

    for (label in node.data)
        if (!getOrgChart.util._arrayContains(this._peopleLabels, label))
            this._peopleLabels.push(label)

    return this;
}

getOrgChart.prototype._removePerson = function (id) {
    var tempDatabase = this._peopleNodes.slice(0);
    this._peopleNodes = [];

    for (i = tempDatabase.length - 1; i >= 0; i--) {
        if (tempDatabase[i].id == id) {
            var person = tempDatabase[i];
            for (j = 0; j < person._nodeChildren.length ; j++) {
                person._nodeChildren[j].pid = person._nodeParent.id;
            }
            tempDatabase.splice(i, 1);
            break;
        }
    }
    this._rootYOffset = 0;
    this._rootXOffset = 0;

    this._maxLevelHeight = [];
    this._maxLevelWidth = [];
    this._previousLevelNode = [];

    this._root = new getOrgChart.person(-1, null, null, 2, 2);

    for (i = 0; i < tempDatabase.length; i++)
        this.createPerson(tempDatabase[i].id, tempDatabase[i].pid, tempDatabase[i].data);
}








getOrgChart.prototype.load = function () {
    var data = this.config.dataSource;
    if (!data) {
        return;
    }

    //loadFromHTMLTable
    if (data.constructor && (data.constructor.toString().indexOf("HTML") > -1)) {        
        this.loadFromHTMLTable(data);
    }    
    else if (typeof (data) == "string") {//loadFromHTMLTable
        this.loadFromXML(data);
    }
    else {//loadFromJSON        
        this.loadFromJSON(data);
    }
}

getOrgChart.prototype.loadFromJSON = function (json) {
    //clear start
    this._peopleNodes = [];
    this._rootYOffset = 0;
    this._rootXOffset = 0;

    this._maxLevelHeight = [];
    this._maxLevelWidth = [];
    this._previousLevelNode = [];
    this._root = new getOrgChart.person(-1, null, null, 2, 2);
    //clear end
    for (var i = 0; i < json.length; i++) {
        var person = json[i]
        var id = person[Object.keys(person)[0]];
        var parentid = person[Object.keys(person)[1]];
        delete person[Object.keys(person)[0]];
        delete person[Object.keys(person)[0]];
        this.createPerson(id, parentid, person);
    }

    this.draw();
}

getOrgChart.prototype.loadFromHTMLTable = function (dataTable) {
    var header = dataTable.rows[0];

    for (var i = 1; i < dataTable.rows.length; i++) {
        var row = dataTable.rows[i]
        var id = row.cells[0].innerHTML;
        var parentid = row.cells[1].innerHTML;
        var data = {};
        for (var j = 2; j < row.cells.length; j++) {
            var cell = row.cells[j];
            data[header.cells[j].innerHTML] = cell.innerHTML;
        }
        this.createPerson(id, parentid, data);
    }

    this.draw();
}

getOrgChart.prototype.loadFromXML = function (url) {
    var _this = this;
    get._ajax._get(url, null, function (xmlDoc) {
        _this._loadFromXMLindex = 0;
        _this._loadFromXML(xmlDoc, null, true);
        _this.draw();
    }, "xml");
}

getOrgChart.prototype.loadFromXMLDocument = function (text) {
    var xmlDoc = getOrgChart.util._stringtoXML(text);
    this._loadFromXMLindex = 0;
    this._loadFromXML(xmlDoc, null, true);
    this.draw();
}

getOrgChart.prototype._loadFromXML = function (xmlDoc, pid, firstWalk) {
    var _this = this;
    if (xmlDoc.nodeType == 1) {
        if (xmlDoc.attributes.length > 0) {
            var data = {};
            for (var j = 0; j < xmlDoc.attributes.length; j++) {
                var attribute = xmlDoc.attributes.item(j);
                data[attribute.nodeName] = attribute.nodeValue;
            }
            _this._loadFromXMLindex++;
            _this.createPerson(_this._loadFromXMLindex, pid, data);


            if (firstWalk) {
                firstWalk = false;
            }

        }
    }
    if (xmlDoc.hasChildNodes()) {
        if (!firstWalk) {
            pid = _this._loadFromXMLindex;
        }
        for (var i = 0; i < xmlDoc.childNodes.length; i++) {
            var item = xmlDoc.childNodes.item(i);
            var nodeName = item.nodeName;
            if (item.nodeType == 3) {
                continue;
            }

            this._loadFromXML(item, pid, firstWalk);
        }
    }
}
if (typeof (get) == "undefined") {
    get = {};
}

get._ajax = {};

get._ajax._x = function () {    
    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        return new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
};

get._ajax._send = function (url, callback, method, dataType, data, sync) {    
    var x = get._ajax._x();

    x.open(method, url, sync);
    x.onreadystatechange = function () {        
        if (!get._browser().msie && dataType == "xml" && x.readyState == 4) {
            callback(x.responseXML);
        }
        else if (get._browser().msie && dataType == "xml" && x.readyState == 4) {
            try
            {
                var parser = new DOMParser();
                var xml = parser.parseFromString(x.responseText, "text/xml");
                callback(xml);
            }
            catch(err)
            {
                var xml = new ActiveXObject("Microsoft.XMLDOM");
                xml.loadXML(x.responseText);
                callback(xml);
            }
        }
        else if (x.readyState == 4) {
            callback(x.responseText);
        }
    };
    if (method == 'POST') {
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    x.send(data)
};

get._ajax._get = function (url, data, callback, dataType, sync) {
    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    get._ajax._send(url + '?' + query.join('&'), callback, 'GET', dataType, null, sync)
};

get._ajax._post = function (url, data, callback, dataType, sync) {
    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    get._ajax._send(url, callback, 'POST', dataType, query.join('&'), sync)
};
(function ($) {
    $.fn.getOrgChart = function (options) { 
        var isMethod = ((arguments.length > 1) || ((arguments.length == 1 ) && (typeof (arguments[0]) == "string")));

        var methodArguments;
        var methodName;

        if (isMethod) {
            methodArguments = Array.prototype.slice.call(arguments, 1);
            methodName = arguments[0];
        }
        return this.each(function () {            
            var obj = $(this).data("getOrgChart");
            if (obj && isMethod) {
                if (obj[methodName]) {
                    obj[methodName].apply(obj, methodArguments);
                }
            }
            else {
                var chart = new getOrgChart(this, options);
                var _this = this;
                chart._attachEvent("removeEvent", function (sender, args) {
                    $(_this).trigger("removeEvent", [sender, args])
                    if (args.returnValue === false) {
                        return false;
                    }
                });
                chart._attachEvent("updateEvent", function (sender, args) {
                    $(_this).trigger("updateEvent", [sender, args]);
                    if (args.returnValue === false) {
                        return false;
                    }
                });
                chart._attachEvent("clickEvent", function (sender, args) {
                    $(_this).trigger("clickEvent", [sender, args]);
                    if (args.returnValue === false) {
                        return false;
                    }
                });
                chart._attachEvent("renderBoxContentEvent", function (sender, args) {
                    $(_this).trigger("renderBoxContentEvent", [sender, args]);
                });
                $(this).data("getOrgChart", chart);
            }
        });
    };
})(jQuery);

