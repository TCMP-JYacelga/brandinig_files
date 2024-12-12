window.getNextUniqueId = function() {
  var dt = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (dt + Math.random()*16)%16 | 0;
		dt = Math.floor(dt/16);
		return (c=='x' ? r :(r&0x3|0x8)).toString(16);
	});
	return uuid;
}

var JQueryAdapter = {
	type   : 'jQuery',
	append : function (parent, node) {
		$(parent).append(node);
	},
	createElement : function(elementType, config){
		var el = $('<'+elementType+' class="' + config.class +'">'+'<'+elementType+'>');
		el.attr('id', config.id);
		return el;
	},
	createElementRaw : function(elementHtml){
		var el = $(elementHtml);
		return el;
	}
};

var JQEventBus = {
   js 	   : 'js/eventbus.js',
   subscribe: function (eventCode, callback) {
	   $.subscribe(eventCode, callback);
   },
   publish: function (eventCode, eventData) {
	   $.publish(eventCode, eventData);
   }
}

var ConnectionAdapter = {
	doGetRequest : function () {},
	doPostRequest: function () {}
};

var Layout = function (name, config)
{
	var _layout = {
		name : name,
		config : config,
		dom : null,
		widgetMap : {},
		addWidgets : function (widgets, config){
			var self = this;
			var layoutDom = config.domAdapter.createElement('div', 
				{
				'id' : 'layoutContainer', 
				'class': 'container'
				});
			
			for (wd in widgets)
			{
				var widget = widgets[wd];
				var divElem;
				if (widget.config.containerId)
				{
					divElem = document.getElementById(widget.config.containerId);
				}
				if (divElem)
				{
				}
				else
				{
					var divElem = config.domAdapter.createElement('div', {'id' : widget.id, 'class': 'panel'});
					config.domAdapter.append(layoutDom, divElem);
				}
				widget.parent = divElem;
			}

			self.dom = layoutDom;
			return layoutDom;
		}
	}
	return _layout;
};

var Dependency = function(type, js, css) {
   var _Dependency = {
		type : type,
		js : js,
		css : css
   };
   return _Dependency;
}

var Datatables = function () {
	var js = [
		"https://cdn.datatables.net/1.10.21/js/jquery.dataTables.min.js"
	];
	var css = [
		"https://cdn.datatables.net/1.10.21/css/jquery.dataTables.min.css"
	];
	return Dependency("dataTable", js, css);
}

var ChartJS = function () {
	var js = [
		"https://www.chartjs.org/samples/latest/utils.js",
		"https://www.chartjs.org/dist/2.9.3/Chart.min.js"
	];
	var css = [
		"sample.css",
	];
	return Dependency("chartJs", js, css);
}


