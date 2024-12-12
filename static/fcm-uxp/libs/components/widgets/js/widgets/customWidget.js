
var customWidget = function() {
	   return customWidgetFunction();
};

function customWidgetFunction()
{   
	var _widgetInstance = _widget();
	var _thisWidget = {};
	
	_thisWidget.constructor = function(props)
	{
		_widgetInstance.constructor(props.widgetId, props.target, props.url, 
				props.method, props.reqData, props.resRoot);
		_thisWidget = $.extend(_thisWidget, _widgetInstance);
		_thisWidget.fields     = props.fields;
		_thisWidget.widgetType = props.widgetType;
		_thisWidget.refresh    = props.renderer;		
    };
	
    _thisWidget.initialize = function(){
		let _this = this;
		_this.refresh(_this);
	};
	
	return _thisWidget;
}