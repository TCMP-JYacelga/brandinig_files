dashboardMap.reconcilationSummary = {
	"dashboardId": "reconcilationSummary",
	"layouts":[
	 {
		"layoutId":"dash-top-container",
		"class":"",
		"groupContainers" : [
			{
				"id":'arrSummary',
				"toggleSlider" : true, 
				"position": 1,
				"colSpan": 2,
				"rowSpan": 2,
				"widgetContainers": [
					{
						"widgetId" : "collectionsSummary",
						"widgetType" : "collectionsSummary"
					}			
				]
			}
		]
	  },
	  {
		"layoutId":"dash-left-container",
		"class":"",
		"groupContainers" : [
			{
				"id":'fxRateContainers',
				"position": 1,
				"colSpan": 2,
				"rowSpan": 1,
				"widgetContainers": [
					{
						"widgetId" : "fxRates",
						"widgetType" : "fxRatesWidget"
					}				  
				]
			}
		]		
	  },
	  {
		"layoutId":"dash-right-container",
		"class":"",
		"groupContainers" : [
			{
				"id":'paymentContainers',
				"position": 1,
				"colSpan": 2,
				"rowSpan": 1,
				"widgetContainers": [
					{
						"widgetId" : "outstandingInvoices",
						"widgetType" : "outstandingInvoices"
					},
					{
						"widgetId" : "arrTransactions",
						"widgetType" : "arrTransactions"
					}
				]
			}
		]		
	  }
	]
}

$(document).ready(function(){
	dashBoard.init({
		"metadata": dashboardMap.reconcilationSummary
	});
});