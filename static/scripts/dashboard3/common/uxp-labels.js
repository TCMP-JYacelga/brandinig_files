/*jslint browser: true*/
/*global window, document, Widget, $ */
(function($){
	if (window.dashLabels !== undefined)
	{
		window.console.log("Labels script is already loaded!");
		return ;
	}
	
	window.dashLabels = {
		"labelsLoaded": false
	};
	
	/**
	 * FCM-40503 - decoding of labels into text/html to fix rendering issue in SELECT field
	 */
	var htmlDecode = function(input) {
		if (window.DOMParser === undefined) {
			return input;
		}
		var doc = new DOMParser().parseFromString(input, "text/html");
		return doc.documentElement.textContent;
	}
	
	window.getDashLabelWithParameters = function(key, parameters)
	{
		ensureLabelsLoaded("", {});
		if(dashLabels[key] === undefined)
		{
			return "!" + key;
		}
		var label = dashLabels[key];
		if (parameters !== undefined && parameters.length > 0)
		{
			for (var i = 0; i < parameters.length; i++)
			{
				label = label.replace("{" + i + "}", parameters[i]);
			}
		}
		return label;
	}
   
	window.getDashLabel = function(key, defaultValue)
	{
		ensureLabelsLoaded("", {});
		if(dashLabels[key] === undefined)
		{
			return defaultValue ? defaultValue : ("!" + key);
		}
		var label = dashLabels[key];
		return label;
	}

	window.ensureLabelsLoaded = function(module, config, forced) 
	{
		if (forced && Object.keys(dashLabels).length < 10) 
		{
			dashLabels.labelsLoaded = false;
		}
		if (dashLabels.labelsLoaded === true)
		{
			return ;
		}
		if (config.rootUrl === undefined && window.rootUrl === undefined && window.WidgetBaseUrlMap && window.WidgetBaseUrlMap.widgetBaseUrl) 
		{
			config.rootUrl = window.WidgetBaseUrlMap.widgetBaseUrl;
		}
		var labelRootUrl = config.rootUrl || window.rootUrl;
		if (labelRootUrl.indexOf('/', labelRootUrl.length - 1) === -1) {
			labelRootUrl = labelRootUrl + "/";
		}
		$.ajax({
			type     : "GET",
			url      : labelRootUrl + "services/getLabels.json?module=" + module + (config.ssoToken ? ("&SEC_TKN=" + config.ssoToken) : ""),
			data     : "",
			datatype : "json",
			async	 : false
		})
		.done (function(labels, textStatus, jqXHR) { 
			if(labels === undefined)
			{
				window.console.log("No labels found for : " + JSON.stringify(jqXHR));
				return ;
			}
			for (var key in labels) 
			{
				dashLabels[key] = htmlDecode(labels[key]);
			}
		})
		.fail (function(jqXHR, textStatus, errorThrown) { 
			window.console.log("Failed to get labels : " + JSON.stringify(jqXHR));
		});
		dashLabels.labelsLoaded = true;
	}
	
})(jQuery);