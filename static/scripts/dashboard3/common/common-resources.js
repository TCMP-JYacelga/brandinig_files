/*jslint browser: true*/
/*global window, document, Widget, $ */
(function($){
    window.FCM= {};
	window.initializeStaticData = function(config) {
		var commonResource = {};
		$.ajax({
			type     : "GET",
			url      : (window.rootUrl) + "/services/getStaticData.json",
			data     : "",
			datatype : "json",
			async	 : false
		})
		.done (function(res, textStatus, jqXHR) { 
			// TODO: Add error handling for widget
			if(res)
			{
				commonResource = res;
			}
		})
		.fail (function(jqXHR, textStatus, errorThrown) { 
			// TODO: Add error handling for widget
			window.widgetUnauthorized = true;
		});
		window.FCM.CurrencyList = commonResource.CurrencyList || '';
	}
	// below should come in the form of a js file
	
	window.initializeStaticData();
})(jQuery);
