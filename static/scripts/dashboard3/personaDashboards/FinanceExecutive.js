dashboardMap.financeExecutive = {
	"dashboardId": "financeExecutive",
	"layouts":[
	 {
		"layoutId":"dash-top-container",
		"class":"",
		"groupContainers" : [
			{
				"id":'btrAccountSummary',
				"toggleSlider" : true, 
				"position": 1,
				"colSpan": 2,
				"rowSpan": 2,
				"widgetContainers": [
					{
						"widgetId" : "btrAccountType",
						"widgetType" : "btrAccountType"
					},
					{
						"widgetId" : "btrBankName",
						"widgetType" : "btrBankName"
					},
					{
						"widgetId" : "btrCurrency",
						"widgetType" : "btrCurrency"
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
				"id":'paymentChartContainers',
				"position": 1,
				"colSpan": 1,
				"rowSpan": 1,
				"widgetContainers": [
					{
						"widgetId" : "payBarChart",
						"widgetType" : "paymentBarChart"
					},
					{
						"widgetId" : "payPieChart",
						"widgetType" : "paymentPieChart"
					},
					{
						"widgetId" : "payLineChart",
						"widgetType" : "paymentLineChart"
					}
				]
			},
			{
				"id":'quickLinkContainers',
				"position": 1,
				"colSpan": 1,
				"rowSpan": 1,
				"widgetContainers": [
					{
						"widgetId" : "quickAccess",
						"widgetType" : "quickLink"
					}
				]
			},
			{
				"id":'paymentContainers',
				"position": 1,
				"colSpan": 2,
				"rowSpan": 1,
				"widgetContainers": [
					{
						"widgetId" : "payments",
						"widgetType" : "top5Payments"
					},
					{
						"widgetId" : "payables",
						"widgetType" : "top5Payables"
					},
					{
                        "widgetId" : "invoiceList",
                        "widgetType" : "invoiceList"
                    }
				]
			}
		]		
	  }
	]
}

$(document).ready(function(){
	dashBoard.init({
		"metadata": dashboardMap.financeExecutive
	});
});