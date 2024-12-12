widgetMetaData.outstandingInvoices = function(widgetId, widgetType)
{
	var rootUrl = (window.widgetConfig && window.widgetConfig[widgetId]) ? window.widgetConfig[widgetId].rootUrl : window.rootUrl;
    var endPoint = "OUTSTANDING_INVOICE_WIDGET_URL";
	var dueDateTo = new Date();
	var dueDateFrom = new Date(dueDateTo.getTime()  - 30 * 86400000)

	var metadata = {
		  "title": getDashLabel('outstandingInvoices.title'),
		  "desc": getDashLabel('outstandingInvoices.title'),
		  "type": "datatable",
		  "subType": "", 
		  "url": rootUrl + "/services/getVamApiWidgetData.rest?endPoint=" + endPoint,
		  "requestMethod":"GET",
		  "responseRoot":"invoiceDetails",   // this is root provided for datatable
		  "rootData" : "invoiceDetails",
		  "sortMethod" : 'group',
		  "widgetType" : widgetType,
		  "cloneMaxCount": 4,
		  "maxRecords": 8,
          "seeMoreUrl": "invoicegrid",
		  "fields": {
			"columns": [
			  {
				"fieldName": "clientName", 
				"label": getDashLabel('outstandingInvoices.clientName'),
				"type": "text"
			  },
			  {
					"fieldName": "invoiceNumber",
					"label": getDashLabel('outstandingInvoices.invoiceNumber'),
					"type": "text",
					"group" : false
			  },
			  {
					"fieldName": "payerName",
					"label": getDashLabel('outstandingInvoices.payerName'),
					"type": "text",
					"group" : true
			  },
			  {
					"fieldName": "invoiceAmount.value",
					"label": getDashLabel('outstandingInvoices.invoiceAmount'),
					"type": "amount",
					"render": function (data, type, row) {
						if(type == 'sort') return data;
						if(!isNaN(data))
						{
							return "$ " + DataRender.amountFormatter(data, {
								groupSeparator    : _strGroupSeparator, 
								decimalSeparator  : _strDecimalSeparator, 
								amountMinFraction : _strAmountMinFraction, 
							});					
						}
					} 
			  },
			  {
					"fieldName": "invoiceDueDate",
					"label": getDashLabel('outstandingInvoices.dueDate'),
					"type": "date",
					"group" : false,
					"render": function (data, type, row) {
						let dt;
						if(type == 'sort') return data;
						if(data != null)
						{
							return data.substring(0,10);
						}
					}
			  },
			  {
					"fieldName": "invoiceStatus",
					"label": getDashLabel('outstandingInvoices.invoiceStatus'),
					"type": "text",
					"group" : true,
					"render": function (data, type, row) {
						let dt;
						if(type == 'sort') return data;
						if(data != null)
						{
							return getDashLabel('outstandingInvoices.invoiceStatus.' +data);
						}
					}
			  },
			  {
					"fieldName": "invoiceDate",
					"label": getDashLabel('outstandingInvoices.invoiceDate'),
					"type": "date",
					"group" : false,
					"render": function (data, type, row) {
						let dt;
						if(type == 'sort') return data;
						if(data != null)
						{
							return data.substring(0,10);
						}
					}
			  },
			  {
					"fieldName": "amountDue.value",
					"label": getDashLabel('outstandingInvoices.amountDue'),
					"type": "amount",
					"render": function (data, type, row) {
						if(type == 'sort') return data;
						if(!isNaN(data))
						{
							return "$ " + DataRender.amountFormatter(data, {
								groupSeparator    : _strGroupSeparator, 
								decimalSeparator  : _strDecimalSeparator, 
								amountMinFraction : _strAmountMinFraction, 
							});					
						}
					} 
			  },
			  {
					"fieldName": "linkedVirtualAccountNumber",
					"label": getDashLabel('outstandingInvoices.virtualAccountNumber'),
					"type": "text",
					"group" : false,
					"render": function (data, type, row) {
						if(data === undefined)
						{
							return "";
						}
						if(type == 'sort') return data;
						return data;
					} 
			  },
			  
			  {
					"fieldName": "paymentReference",
					"label": getDashLabel('outstandingInvoices.paymentReference'),
					"type": "text",
					"group" : true,
					"render": function (data, type, row) {
						if (data === undefined) {
							return "";
						}
						return data;
					}
			  }
			],
			"rows":{
			}	
		  },  
		 "actions":
		 {
			"columnChooser" : {
				  "callbacks" : {
					  "enabled" : function() {
					  	return window.embedded === undefined;
					  }
				  }
			  },
			  "refresh" : {
				  "callbacks" : {
						"open" : function() {},
						"init" : function() {},
						"unsubscribe" : function() 
						{
							//$.unsubscribe('com.finastra.widget.filter.companyFilter', metadata.actions.refresh.callbacks.companyFilterChanged);
						},
						"subscribe" : function() 
						{
							//$.subscribe('com.finastra.widget.filter.companyFilter', metadata.actions.refresh.callbacks.companyFilterChanged);
						}
				  }
			  },
				"filter": 
				{
				  "text": getDashLabel('widget.filter'),
					"callbacks" : 
					{
				  	 "adaptPostData": function(filterData)
				  	 {
					 	return "";
				  	 },
				  	 "adaptSeeMoreUrl": function(filterData) 
				  	 {
						 if(filterData && filterData.filter && filterData.filter.fields && filterData.filter.fields.length > 0)
					     {
					     	var criteriaQuery = "";
					     	var fields = filterData.filter.fields;
					     	var clientFilterValue = "";
								for (var i = 0; i < fields.length; ++i) 
								{
									if (fields[i].fieldName === "Field1") 
									{
										criteriaQuery  = criteriaQuery + "&clientId=" + fields[i].value1;
									} else if (fields[i].fieldName === "Field3") 
									{
										criteriaQuery = criteriaQuery + "&invoiceDateFrom=" + fields[i].value1 + "&invoiceDateTo=" + fields[i].value2;
					     		    }else if (fields[i].fieldName === "Field4") 
									{
										criteriaQuery = criteriaQuery + "&payerCode=" + fields[i].value1;
									}
									else if (fields[i].fieldName === "Field5") 
									{
										criteriaQuery = criteriaQuery + "&invoiceStatus=" + fields[i].value1;
									}
									else if (fields[i].fieldName === "Field6") 
									{
										criteriaQuery = criteriaQuery + "&invoiceDueDateFrom=" + fields[i].value1 + "&invoiceDueDateTo=" + fields[i].value2;
									}
									else if (fields[i].fieldName === "Field7") 
									{
										criteriaQuery = criteriaQuery + "&invoiceAmount=" + fields[i].value1;
									}

					     	   }
							metadata.seeMoreUrl = encodeURI(rootUrl + "/vaARRInvoice.srvc?" +csrfTokenName +"=" + csrfTokenValue + criteriaQuery + "&sort=invoiceDueDate asc"); //clientId=&invoiceStatus=" + filterData.filter.fields[0].value1; 
						 }
						 return metadata.seeMoreUrl;
				  	 },
				  	 "adaptUrl": function(filterData)
				  	 {
						 if(filterData && filterData.filter && filterData.filter.fields && filterData.filter.fields.length > 0)
					     {
					     	var criteriaQuery = "";
					     	var fields = filterData.filter.fields;
					     	var clientFilterValue = "";
                            for (var i = 0; i < fields.length; ++i)
                            {
								 if (fields[i].type === "date") 
								 {
									fields[i].value1 =  VAMUtils.getISODate(fields[i].value1);
									fields[i].value2 = VAMUtils.getISODate(fields[i].value2);
					     		 }
					     	}
						 }
					    metadata.url = encodeURI(rootUrl + "/services/getVamApiWidgetData.rest?endPoint=" + endPoint + "&$filter=" +JSON. stringify(filterData.filter) +"&sort=Field6 asc&" +csrfTokenName +"=" + csrfTokenValue);
						return metadata.url;
				  	 }
				  }
			  }
		  },
			"filter" : 
			{
			  "fields": [
				  {
						"fieldName": "Field1",			
						"label":  getDashLabel('outstandingInvoices.clientName'),
						"type": "selectbox",
						"filterSubType": "detail",
						"data": VAMUtils.getFilterOptions(rootUrl + '/services/getVamApiSeekData.rest?seekId=PRIVILEGED_CLIENT_SEEK&seekParam2=ARR_INVOICE')
				  },
				  {
						"fieldName": "Field6",			
						"label": getDashLabel('outstandingInvoices.dueDate'),
						"type": "date",
						"filterSubType": "header" 
				  },
				  {
						"fieldName": "Field5",			
						"label":  getDashLabel('outstandingInvoices.invoiceStatus'),
						"type": "multibox",
						"filterSubType": "header",
						"default" : {
							 "operator": "in", 
							 "value1": 'OUTSTDNG,OVERDUE' ,
							 "value2": ''
						},				
				
						"data": VAMUtils.getInvoiceStatuFilterOptions()
				  },
				  {
						"fieldName": "Field3",			
						"label":  getDashLabel('outstandingInvoices.invoiceDate'),
						"type": "date",
						"filterSubType": "header",
						"default" : {
							 "operator": "bt",
							 "value1" : VAMUtils.getDefaultFormatDate(dueDateFrom),
							 "value2" : VAMUtils.getDefaultFormatDate(dueDateTo)
						}   
				  },
				  {
						"fieldName": "Field4",			
						"label":  getDashLabel('outstandingInvoices.payerName'),
						"type": "selectbox",
						"filterSubType": "header",
						"data": VAMUtils.getFilterOptions(rootUrl + '/services/getVamApiSeekData.rest?seekId=PAYER_CODE_SEEK&seekParam3=ARR_PAYER')
				  },
				  {
						"fieldName": "Field7",			
						"label":  getDashLabel('outstandingInvoices.invoiceAmount'),
						"type": "amount",
						"filterSubType": "header"
				  },
				  {
						"fieldName": "Field2",			
						"label":  getDashLabel('outstandingInvoices.invoiceCurrency'),
						"type": "multibox",
						"filterSubType": "header",
						"ajax": {
							url : rootUrl + '/services/getVamApiWidgetData.rest?endPoint=INVOICE_CURRENCIES&'+csrfTokenName +"=" + csrfTokenValue,
							dataType : "json",
							data : [],
							success : function(data, response) {
								if(data && data.dataList )
								{
									var res = data.dataList;
									response($.map(res, function(item) {
										return {
											label : item.desc,
											code  : item.code
										}
									}));									
								}
							}
						},
						"data":[]
				  }
			]
		  }  
		}
	return metadata;
}