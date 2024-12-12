widgetMetaData.accountListChart = function(widgetId, widgetType)
{
	var metadata = {		
	  "title": "Account List",
	  "desc": "Account List statistics",
	  "type": "chart",
	  "subType": "piechart", 
	  "url":  rootOrigin + "/vamapi/services/InvoiceDetails?clientId=",
	  "requestMethod":"GET",
	  "responseRoot":"invoiceDetails",
	  "widgetType" : widgetType,
	  "cloneMaxCount": 4,
	  "fields": {
		"columns": [
		  {
				"fieldName": "invoiceNumber",
				"label": getDashLabel('outstandingInvoices.invoiceNumber'),
				"type": "text",
				"group" : false,
				"render": function (data, type, row) {
					return 1;
				}
		  },
		  {
				"fieldName": "clientId",
				"label": getDashLabel('outstandingInvoices.entity'),
				"type": "text",
				"group" : true
		  },
		  {
				"fieldName": "invoiceStatus",
				"label": getDashLabel('outstandingInvoices.invoiceStatus'),
				"type": "text",
				"group" : true
		  }
		],
		"rows":{
			"buttons":[]
		}
	  },
	  "actions":{}, 
	  "chart":{
		  "xAxis" : "clientId",
		  "xAxisLable" : getDashLabel('outstandingInvoices.entity'),
		  "yAxis" : "invoiceNumber",
		  "legend" : "invoiceStatus",
		  "yAxisLable" : getDashLabel('outstandingInvoices.invoiceStatus'),
		  "charttitle": "Account List"
	  }
	};
	return metadata;
}
