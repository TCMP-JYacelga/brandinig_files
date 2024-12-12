widgetMetaData.collectionsSummary = function(widgetId, widgetType)
{
	//as this is banner widget, it is not available for clone and hence using widgetType as key 
	btrBannerWidgetMap.set(widgetType, widgetId); 
	return {
		  'title': getDashLabel('collectionsSummary.title','Collections Summary') ,
		  'desc' : getDashLabel('collectionsSummary.desc','Collections Summary'),
		  'type': 'card',
		  "widgetType" : widgetType,
		  'subType': '', 
		  "cloneMaxCount": 1,
		  'fields': {
			'columns': [],
			'rows':{}	
		  },
		  'actions' : {
			  'lastUpdatedTime' : {
				  'callbacks' : {
					  'init' : function(response, metaData){
						  response(response, metaData);
					  }
				  }
			  },
			  'refresh' : {
				  'callbacks' : {
					  'init' : function(addData, metaData){
							$('#'+metaData.target).empty().html('<div class="loading-indicator"></div>');
							if(usrDashboardPref.widgets[widgetType] && usrDashboardPref.widgets[widgetType].defaultCompanyCode){
							   vamCompanyCode = usrDashboardPref.widgets[widgetType].defaultCompanyCode;
							}

							$.ajax({
							   type : "GET",
							   url : rootOrigin + "/vamapi/services/InvoiceDetails?clientId=" + vamCompanyCode,
							   data : [],
							   accept   : "application/json;charset=UTF-8",
							   contentType: "application/json;charset=UTF-8",
							   dataType : "json"
							})
							.done (function(res, textStatus, jqXHR) { 
								if(res)
								{
								   var totalCount = 0;
								   var totalAmount = 0.00;
								   var outstandingCount = 0;
								   var outstandingAmount = 0.00;
								   var reconciledCount = 0;
								   var reconciledAmount = 0.00;

								   if(res.invoiceDetails !=undefined)
								   totalCount = res.invoiceDetails.length;
								   $.each(res.invoiceDetails, function(index,invoice){
										if(invoice.invoiceStatus!=undefined && invoice.invoiceStatus.toLowerCase() === 'paid' )
										{
										   reconciledCount = reconciledCount + 1;
										   reconciledAmount = reconciledAmount + invoice.invoiceAmount.value;
										}
										else // other than PAID are outstanding // Girish to check how partial paid can be handled!
										{								   
										   outstandingCount = outstandingCount +1;
										   outstandingAmount = outstandingAmount + invoice.invoiceAmount.value;
										}
										});
										totalAmount = outstandingAmount + reconciledAmount;

										totalAmount = DataRender.amountFormatter(totalAmount, {
											groupSeparator    : _strGroupSeparator, 
											decimalSeparator  : _strDecimalSeparator, 
											amountMinFraction : _strAmountMinFraction, 
										});
										reconciledAmount = DataRender.amountFormatter(reconciledAmount, {
											groupSeparator    : _strGroupSeparator, 
											decimalSeparator  : _strDecimalSeparator, 
											amountMinFraction : _strAmountMinFraction, 
										});
										outstandingAmount = DataRender.amountFormatter(outstandingAmount, {
											groupSeparator    : _strGroupSeparator, 
											decimalSeparator  : _strDecimalSeparator, 
											amountMinFraction : _strAmountMinFraction, 
										});


										var contenthtml = "<div class='container'>" +
														" <div class='row'>" +
														" <div class='col-sm text-left'>" +
														"   <fieldset class='border p-2' style='background-image: url(\"static/images/uxp-images/bg-left-bottom.png\"); background-repeat: no-repeat;'>" +
														"       <legend class='w-auto text-secondary'><h4><small>Total</small></h4></legend>" +
														"       <div class='text-right'>" +
														"           <div class='text-muted'>Amount</div>" +
														"           <div><h2 class='text-secondary font-weight-bolder'>$"+totalAmount +"</h2></div>" +
														"           <div class='text-muted'>Invoices</div>" +
														"           <div><h2 class='text-primary font-weight-bolder'>"+ totalCount +"</h2></div>" +
														"       </div>" +
														"   </fieldset>" +
														" </div>" +
														" <div class='col-sm text-left'>" +
														"   <fieldset class='border p-2' style='background-image: url(\"static/images/uxp-images/bg-left-bottom.png\"); background-repeat: no-repeat;'>" +
														"       <legend class='w-auto text-secondary'><h4><small>Outstanding</small></h4></legend>" +
														"       <div class='text-right'>" +
														"           <div class='text-muted'>Amount</div>" +
														"           <div><h2 class='text-secondary font-weight-bolder'>$"+outstandingAmount+"</h2></div>" +
														"           <div class='text-muted'>Invoices</div>" +
														"           <div><h2 class='text-primary font-weight-bolder'>"+ outstandingCount +"</h2></div>" +
														"       </div>" +
														"   </fieldset>" +
														" </div>" +
														" <div class='col-sm text-left'>" +
														"   <fieldset class='border p-2' style='background-image: url(\"static/images/uxp-images/bg-left-bottom.png\"); background-repeat: no-repeat;'>" +
														"       <legend class='w-auto text-secondary'><h4><small>Reconciled</small></h4></legend>" +
														"       <div class='text-right'>" +
														"           <div class='text-muted'>Amount</div>" +
														"           <div><h2 class='text-secondary font-weight-bolder'>$"+reconciledAmount+"</h2></div>" +
														"           <div class='text-muted'>Invoices</div>" +
														"           <div><h2 class='text-primary font-weight-bolder'>"+ reconciledCount +"</h2></div>" +
														"       </div>" +
														"   </fieldset>" +
														" </div>" +
														"  </div>" +
														"</div>";
										$("#widget-body-" + metaData.widgetId).html(contenthtml);
  						   						   	
								}					   
							})
							.fail (function(jqXHR, textStatus, errorThrown) { 
								
							})
							.always (function(jqXHROrData, textStatus, jqXHROrErrorThrown) {
								VAMUtils.companyFilter(addData, metaData, widgetId, widgetType);
							});
					  }
				  }
			  }
		  },
		  "filter" : {
			  "fields": [
				  {
						"fieldName": "clientId",			
						"label":  getDashLabel('outstandingInvoices.entity','Entity'),
						"type": "multibox",
						"filterSubType": "detail"
				  },
				  {
						"fieldName": "linkedVirtualAccountNumber",
						"label": getDashLabel('outstandingInvoices.virtualAccountNumber','Account'),
					    "type": "text",
						"filterSubType": "detail"
				  },		  
				  {
						"fieldName": "invoiceDate",			
						"label": getDashLabel('outstandingInvoices.invoiceDate','Date'),
						"type": "date",
						"filterSubType": "detail"
				  },		  
				  {
						"fieldName": "payerCode",
						"label": getDashLabel('outstandingInvoices.payerCode','Payer Code'),
						"type": "text",
						"filterSubType": "detail"
				  }
			]
		  }  
		}
}
