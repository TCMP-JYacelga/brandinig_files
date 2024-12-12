widgetMap.btrAccountSummary = {
  "title": "Account Summary",
  "desc": "Account Summary",
  "type": "datatable",
  "subType": "",  
  "url": rootUrl + "/services/getPaymentRecords",
  "requestMethod":"POST",
  "responseRoot":"root",
  "fields": {
	"columns": [
	  {
		"fieldName": "clientReference",
		"label": "Reference",
		"type": "text"
	  },
	  {
		"fieldName": "entryDate",
		"label": "Entry Date",
		"type": "date"
	  },
	  {
		"fieldName": "valueDate",
		"label": "Processing Date",
		"type": "date"
	  },
	  {
		"fieldName": "productCategoryDesc",
		"label": "Payment Type",
		"type": "text"
	  },
	  {
		"fieldName": "productTypeDesc",
		"label": "Payment Package",
		"type": "text"
	  },
	  {
		"fieldName": "amount",
		"label": "Amount",
		"type": "amount"
	  },
	  {
		"fieldName": "actionStatus",
		"label": "Status",
		"type": "text"
	  }
	],
	"rows":{
		"buttons":[
			{
				"id":"viewRecord",
				"label":"View",
				"callbacks":{
					"onclick" : function(){
						alert('View Record');
					}
				}
			},
			{
				"id":"editRecord",
				"label":"Edit",
				"callbacks":{
					"onclick" : function(){
						alert('Edit Record');
					}
				}
			}
		 ]
	}	
  },
  "actions":{}
}