widgetMetaData.payerMntChart = function(widgetId, widgetType)
{
	var metadata = {		
	  "title": "Payer Maintenance",
	  "desc": "Payer Maintenance statistics",
	  "type": "chart",
	  "subType": "piechart", 
	  "url":rootOrigin + "/vamapi/services/InvoiceDetails?clientId=",
	  "requestMethod":"GET",
	  "responseRoot":"invoiceDetails",
	  "widgetType" : widgetType,
	  "cloneMaxCount": 4,
	  "fields": {
		"columns": [
		  {
				"fieldName": "invoiceNumber",
				"label": getDashLabel('outstandingInvoices.invoiceNumber','Invoice Number'),
				"type": "text",
				"group" : false,
				"render": function (data, type, row) {
					return 1;
				}
				
		  },
		  {
				"fieldName": "payerCode",
				"label": getDashLabel('outstandingInvoices.payerCode','Payer Code'),
				"type": "text",
				"group" : true
		  },
		  {
				"fieldName": "invoiceStatus",
				"label": getDashLabel('outstandingInvoices.invoiceStatus','Status'),
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
		  "xAxis" : "payerCode",
		  "xAxisLable" : getDashLabel('outstandingInvoices.payerCode','Payer Code'),
		  "yAxis" : "invoiceNumber",
		  "legend" : "invoiceStatus",
		  "yAxisLable" : getDashLabel('outstandingInvoices.invoiceStatus','Status'),
		  "charttitle": "Payer Maintenance"
	  }
	};
	return metadata;
}
