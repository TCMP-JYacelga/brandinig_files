var _widget = function(){
	return widget();
};

function defaultAdaptData(res) 
{
	return res;
}

function widget()
{
	var _thisWidget = {};
	_thisWidget.constructor = function(widgetId, target, url, method, reqData, resRoot, adaptData) {
		this.widgetId = $.type(widgetId) == 'undefined'? '' : widgetId;
		this.target   = $.type(target) == 'undefined'? '' : target;
		this.url      = $.type(url) == 'undefined'? undefined : url;
		this.method   = method ? method: 'GET';
		this.reqData  = $.type(reqData) == 'undefined'? undefined : reqData;
		this.reqData  = this.reqData ? {$filter : JSON.stringify(this.reqData)} : {};
		this.resRoot  = $.type(resRoot) == 'undefined'? undefined : resRoot;
		this.adaptData = $.type(adaptData) == 'undefined'? defaultAdaptData : adaptData;
		this.rootData = {};
    };
	
    _thisWidget.callAjax = function(){
		let _this = this; 
		let ajax = new Promise(function (resolve, reject) {
			if(_this.url)
			{
				$('#'+_this.target).empty().html('<div class="loading-indicator"></div>');
				$.ajax({
					type     : _this.method,
					url      : _this.url,
					data     : _this.reqData,
					datatype : "json",
				})
				.done (function(res, textStatus, jqXHR) { 
					if(res)
					{
						_this.rootData = res;											 
						res = (_this.resRoot) ? _this.jsonPathToValue(res,_this.resRoot) : res;
						resolve(_this.adaptData(res));
					}
				})
				.fail (function(jqXHR, textStatus, errorThrown) { 
					reject('Data not found');
				})
				.always (function(jqXHROrData, textStatus, jqXHROrErrorThrown) {
					$('#'+_this.target).empty();
					if('error' == textStatus)
					{
						$('#'+_this.target).html(getDashLabel('err.noData','No data to display'));
					}
				});
			}
			else
			{
				reject('Data not found');
			}
        });
        return ajax;		
	};
	
	_thisWidget.setErrorMessage = function(target, error){
		$('#'+this.target).empty().html('<span>'+error+'</span>');
	};
	
	_thisWidget.jsonPathToValue = function(jsonData, path) {
		if(typeof (jsonData) === "string") jsonData = JSON.parse(jsonData);
		if (!(jsonData instanceof Object) || typeof (path) === "undefined") {
			throw "Not valid argument:jsonData:" + jsonData + ", path:" + path;
		}
		path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
		path = path.replace(/^\./, ''); // strip a leading dot
		var pathArray = path.split('.');
		for (var i = 0, n = pathArray.length; i < n; ++i) {
			var key = pathArray[i];
			if (key in jsonData) {
				if (jsonData[key] !== null) {
					jsonData = jsonData[key];
				} else {
					return null;
				}
			} else {
				return key;
			}
		}
		return jsonData;
	};
	return _thisWidget;
}
