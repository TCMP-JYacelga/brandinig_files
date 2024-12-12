widgetMetaData.arrTransactions = function(widgetId, widgetType)
{
	var vamapiBaseUrl = rootOrigin + "/vamapi/";
	var vamadminBaseUrl = rootOrigin + "/vamadmin/";
	
	var metadata = {
		  "title": getDashLabel('arrTransactions.title','Transactions'),
		  "desc": getDashLabel('arrTransactions.desc','Transactions'),
		  "type": "datatable",
		  "subType": "", 
		  "url": vamapiBaseUrl + "services/rec/transactions",
		  "requestMethod":"GET",
		  "responseRoot":"receivableList",   // this is root provided for datatable
		  "rootData" : "receivableList",
		  "sortMethod" : 'group',
		  "widgetType" : widgetType,
		  "cloneMaxCount": 4,
		  "maxRecords": 8,
          "seeMoreUrl": vamadminBaseUrl + "transactiongrid",
        "fields":
        {
			"columns": [
			  {
				"fieldName": "companyName", 
				"label": getDashLabel('arrTransactions.entity','Company Name'),
				"type": "text",
                "render": function (data, type, row)
                {
				  return VAMUtils.getCompanyName(data);
				}
			  },
			  {
					"fieldName": "virtualAccountNumber",
					"label": getDashLabel('arrTransactions.virtualAccountNumberJP','Virtual Account'),
					"type": "text",
					"group" : true
			  },
			  {
					"fieldName": "amount.value",
					"label": getDashLabel('arrTransactions.amount','Transaction Amount'),
					"type": "amount",
                    "render": function (data, type, row)
                    {
						if(type == 'sort') return data;
						if(!isNaN(data))
						{
                            return "$ " + DataRender.amountFormatter(data,
                            {
								groupSeparator    : _strGroupSeparator, 
								decimalSeparator  : _strDecimalSeparator, 
								amountMinFraction : _strAmountMinFraction, 
							}) + "&nbsp;&nbsp;";					
						}
						else
						{
							return getDashLabel('confidential','--CONFIDENTIAL--');
						}
					} 
			  },
			  {
					"fieldName": "postingDate",
					"label": getDashLabel('arrTransactions.postingDate','Transaction Date'),
					"type": "date",
					"group" : true,
                    "render": function (data, type, row)
                    {
						if(data != undefined)
						{
							return data.substring(0,10);
						}
					}
			  },
			  {
					"fieldName": "payerDetails.payerName",
					"label": getDashLabel('arrTransactions.payerName','Payer Name'),
					"type": "text",
					"group" : true
			  },
			  {
					"fieldName": "paymentReference",
					"label": getDashLabel('arrTransactions.paymentReference','Payment Reference'),
					"type": "text",
					"group" : true,
					"render": function(data, type, row)
					{
                        if (data === undefined)
                        {
							return "";
						}
						return data;
					}
			  },
			  {
					"fieldName": "customerReference",
					"label": getDashLabel('arrTransactions.customerReference','Customer Reference'),
					"type": "text",
					"group" : true,
					"render": function(data, type, row) 
					{
                        if (data === undefined)
                        {
							return "";
						}
						return data;
					}
			  }
			],
            "rows":
            {}
		  },  
        "actions":
        {
            "refresh":
            {
                "callbacks":
                {
						"open" : function(){},
						"companyFilterChanged" : function(obj, companyFilter)
						{
							console.log("Event 'com.finastra.widget.filter.companyFilter' in Transactions dashboard"); 
						 	let filter = {
							  'fields': [
								    {
										'fieldName': 'companyName',
										'label': getDashLabel('arrTransactions.entity','Company Name'),
										'filterSubType': 'detail',
										'operator': 'in',
										'type': 'selectbox',
										'value1': companyFilter,
										'value2': ''
									}		  
								],
								'widgetId': widgetId
							}	
							// if a filter is selected other than Default
                        if (localStorage.getItem(widgetId))
                        {
								var localStore = JSON.parse(localStorage.getItem(widgetId));
								var localFilter = localStore.localSavedFilter;
								if (localFilter && localFilter.filter && localFilter.filter.fields.length > 0) 
								{
									var foundClientFilter = false;
									var fields = localFilter.filter.fields;
									for (var i = 0; i < fields.length; i++) 
									{
										if (fields[i].fieldName !== 'companyName') 
										{
											filter.fields.push(fields[i]);
										}
									}
								}
							}
						  
							let changedFilter = {
                            'localSavedFilter':
                            {
									'filter' : filter,
									'selectedFilter': '-1'
								}
							}
						  
							localStorage.setItem(widgetId, JSON.stringify(changedFilter));
						  
							widgetMap[widgetId].api.refresh();
						},
                    "unsubscribe": function ()
                    {
							$.unsubscribe('com.finastra.widget.filter.companyFilter', metadata.actions.refresh.callbacks.companyFilterChanged);
						},
                    "subscribe": function ()
                    {
							$.subscribe('com.finastra.widget.filter.companyFilter', metadata.actions.refresh.callbacks.companyFilterChanged);
						}
				  }
			  },
            "filter":
            {
				  "text": getDashLabel('filter','Filter'),
                "callbacks":
                {
				  	 "adaptPostData": function(filterData)
				  	 {
				  	 	return "";
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
                                if (fields[i].fieldName === "invoiceStatus")
                                {
					     			criteriaQuery = criteriaQuery + "&invoiceStatus=" + fields[i].value1;
                                }
                                else if (fields[i].fieldName === "companyName")
                                {
					     			clientFilterValue = fields[i].value1;
					     			noClientFilter = false;
                                }
                                else if (fields[i].fieldName === "postingDate")
                                {
					     			var date = VAMUtils.getFromDate(fields[i].value1);
					     			criteriaQuery = criteriaQuery + "&postingDateFrom=" + date.toISOString().slice(0, 10) + "&postingDateTo=" + new Date().toISOString().slice(0, 10);
					     		}
					     	}
							metadata.url = encodeURI(vamapiBaseUrl + "services/rec/transactions?clientId=" + clientFilterValue + criteriaQuery); //clientId=&invoiceStatus=" + filterData.filter.fields[0].value1; 
						 }
						 return metadata.url;
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
                                if (fields[i].fieldName === "invoiceStatus")
                                {
					     			criteriaQuery = criteriaQuery + "&invoiceStatus=" + fields[i].value1;
                                }
                                else if (fields[i].fieldName === "companyName")
                                {
					     			clientFilterValue = fields[i].value1;
					     			noClientFilter = false;
                                }
                                else if (fields[i].fieldName === "postingDate")
                                {
					     			var date = VAMUtils.getFromDate(fields[i].value1);
					     			criteriaQuery = criteriaQuery + "&postingDateFrom=" + date.toISOString().slice(0, 10) + "&postingDateTo=" + new Date().toISOString().slice(0, 10);
					     		}
					     	}
							metadata.seeMoreUrl = encodeURI(vamadminBaseUrl + "transactiongrid?clientId=" + clientFilterValue + criteriaQuery); //clientId=&invoiceStatus=" + filterData.filter.fields[0].value1; 
						 }
						 return metadata.seeMoreUrl;
				  	 }
				  }
			  }
		  },
        "filter":
        {
			   "fields": [
				  {
						"fieldName": "postingDate",			
						"label":  getDashLabel('arrTransactions.postingDate','Transaction Date'),
						"type": "selectbox",
						"filterSubType": "detail",
						"data": VAMUtils.getDateFilterOptions()
				  },
				  {
						"fieldName": "companyName", 
						"label": getDashLabel('arrTransactions.entity','Company Name'),
						"type": "selectbox",
						"filterSubType": "detail",
						"data": VAMUtils.getClientFilterOptions()
				  },
				  {
						"fieldName": "status", 
						"label": getDashLabel('arrTransactions.status','Status'),
						"type": "selectbox",
						"filterSubType": "detail",
						"data": [
						  	  {
								"code": "RECON",
								"label": "Reconciled"
							  },
						  	  {
								"code": "PARTRECON",
								"label": "Partially Reconciled"
							  },
						  	  {
								"code": "OUTSTDNG",
								"label": "Outstanding"
							  }
						]
				  }
			]
		  }  
		}
	return metadata;
}
