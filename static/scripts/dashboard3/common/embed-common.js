/*jslint browser: true*/
/*global window, document, Widget, $ */
(function($){

	$.ajaxSetup({
		xhrFields: {
	        withCredentials: true
	    }
	});

	window.initializeCommonResources = function(config) {
		// ensure labels are loaded
		if (window.ensureLabelsLoaded) {
			window.ensureLabelsLoaded("", config, true);
		}
		if (window.commonResourcesInitialized) {
			return ;
		}
		window.commonResourcesInitialized = true;
		var commonResource = {};
		$.ajax({
			type     : "GET",
			url      : (config.rootUrl || window.rootUrl) + "/services/getCommonResources.json" + (config.ssoToken ? ("?SEC_TKN=" + config.ssoToken) : ""),
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
			window.console.log("Unauthorized widget: " + JSON.stringify(jqXHR));
		});
	
		window.strClient = commonResource.strClient || 'ETEST';
		window.strClientDesc = commonResource.strClientDesc || 'ETEST';
		
		/**
		 * Seller based global variables
		 */
		window._strSeller = commonResource._strSeller || 'IN';
		window._strSellerCurrency = commonResource._strSellerCurrency || 'INR';
		window.btrAccCurrency = window._strSellerCurrency;
		/**
		 * Date and Amount based global variables
		 */
		window._strUserLocale = commonResource._strUserLocale || 'en_US';
		window._strLocalAlignment = commonResource._strLocalAlignment || 'LTR';
		window._strDefaultDateFormat = commonResource._strDefaultDateFormat || 'MM/dd/yyyy';
		window._strTimeZone = commonResource._strTimeZone || 'Asia/Kolkata';
		window._strDisplayTimeZone = commonResource._strDisplayTimeZone || 'IST';
		
		window._dtCurrentDate = commonResource._dtCurrentDate || {
		    'date': '10/05/2020',
		    'datetime': '10/05/2020 11:54:5 ' + window._strDisplayTimeZone,
		    'timezone': window._strTimeZone,
		    'displayTimezone': window._strDisplayTimeZone,
		    'hour': '11',
		    'minute': '54',
		    'second': '5'
		};
		window._dtLastLoginDate = commonResource._dtLastLoginDate || {
		    'date': '10/03/2020',
		    'datetime': '10/03/2020 19:52:12 ' + window._strDisplayTimeZone,
		    'timezone': window._strTimeZone,
		    'displayTimezone': window._strDisplayTimeZone
		}
		window._strGroupSeparator = commonResource._strGroupSeparator || ',';
		window._strDecimalSeparator = commonResource._strDecimalSeparator || '.';
		window._strAmountMinFraction = commonResource._strAmountMinFraction || '2';
		/**
		 * Payment Latest Date Range
		 */
		var defaultToDate = new Date();
		var defaultFromDate = new Date(defaultToDate.getTime());
		if (defaultFromDate.getMonth() == 0) {
			defaultFromDate.setYear(defaultFromDate.getYear() - 1);
		}
		defaultFromDate.setMonth(defaultFromDate.getMonth() - 1);
		window.from_date_payment = commonResource.from_date_payment || ((defaultFromDate.getMonth() + 1) + "/" + defaultFromDate.getDate() + "/" + defaultFromDate.getFullYear());
		window.to_date_payment = commonResource.to_date_payment || ((defaultToDate.getMonth() + 1) + "/" + defaultToDate.getDate() + "/" + defaultToDate.getFullYear());
		window._chrApprovalConfirmationAllowed = commonResource.chrApprovalConfirmationAllowed || 'Y';
		window._strFxTimer = commonResource._strFxTimer || '10';
		window.FXCNTRGET = commonResource.FXCNTRGET || '';
		
		$(document).ajaxStop(function()
		{
		    // place code to be executed on completion of last outstanding ajax call here
		    window.applyTextAlign();
		});
	}
	
	window.applyTextAlign = function()
	{
	    if (window._strLocalAlignment == 'RTL')
	    {
	        $('.widget-card').css('direction', 'rtl');
	    }
	    else
	    {
	        $('.widget-card').css('direction', 'ltr');
	    }
	    $('.widget-card-header').css('direction', 'ltr');
	}
	
	if (window.dashLabels === undefined) {
		// below should come in the form of a js file
		window.dashLabels = {
			// TODO
		}
			            
		window.getDashLabel = function(key, defaultValue)
		{
			return dashLabels[key] ? dashLabels[key] : defaultValue;
		}
	}
})(jQuery);
