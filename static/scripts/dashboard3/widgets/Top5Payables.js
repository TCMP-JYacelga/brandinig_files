

widgetMetaData.top5Payables = function(widgetId, widgetType)
{
	var metadata = {
		  "title": getDashLabel('payables.title'),
		  "desc": getDashLabel('payables.desc'),
		  "type": "datatable",
		  "subType": "", 
		  "url": rootUrl+"/services/getPaymentRecords",
		  "requestMethod":"POST",
		  "responseRoot":"root.actionRowList",   // this is root provided for datatable
		  "rootData" : "root",
		  "sortMethod" : 'group',
		  "widgetType" : widgetType,
		  "seeMoreUrl": "paymentSummary.form",
		  "cloneMaxCount": 4,
		  "fields": {
			"columns": [
			  {
				"fieldName": "record.clientReference", 
				"label": getDashLabel('payments.referenceNo'),
				"type": "text"
			  },
			  {
					"fieldName": "record.recieverName",
					"label": getDashLabel('payments.receiverName'),
					"type": "text",
					"group" : true
			  },
			  {
				"fieldName": "record.actionDate",
				"label": getDashLabel('payments.effectiveDate'),
				"type": "date",
				"group" : true
			  },
			  {
					"fieldName": "record.amount",
					"label": getDashLabel('payments.amount'),
					"type": "amount",
					"render": function (data, type, row) {
						let currency;
						if(type == 'sort') return data;
						if(row && row.record && row.record.currency)
						{
							currency = decodeURIComponent(row.record.currency);
						}
						if(data != null && data != '' && data.indexOf("--") < 0)
						{
							return  currency + ' '+ DataRender.amountFormatter(data, {
								groupSeparator    : _strGroupSeparator, 
								decimalSeparator  : _strDecimalSeparator, 
								amountMinFraction : _strAmountMinFraction, 
							});					
						}
						else
						{
							return getDashLabel('confidential');
						}
					}
			  },
			  {
					"fieldName": "record.sendingAccount",
					"label": getDashLabel('payments.accountNo'),
					"type": "text",
					"visible" : false,
					"group" : true
			  },
			  {
					"fieldName": "record.productCategoryDesc",
					"label":  getDashLabel('payments.paymentType'),
					"type": "multibox",
					"visible" : false
			  },
			  {   
				  "fieldName": "record.paymentCcy",
				  "label": getDashLabel('fxrate.ccy'),
				  "type": "text",
				  "group" : true,
				  "visible" : false
		     },
		     {
					"fieldName": "record.entryDate",
					"label": getDashLabel('payments.entryDate'),
					"type": "date",
					"group" : true,
					"visible" : false
			  },
			  {
					"fieldName": "record.count",
					"label": getDashLabel('payments.count'),
					"type": "text",
					"visible" : false
			  },
			  {
					"fieldName": "record.actionStatus",
					"label": getDashLabel('payments.status'),
					"type": "text",
					"group" : true,
					"visible" : false,
					"render": function (data, type, row) {
						return DataRender.dataMapper(data, {
								'99' : getDashLabel('payments.status.mixed'),
								'777' : getDashLabel('payments.status.mixed'),
								'888' : getDashLabel('payments.status.mixed'),
								'999' : getDashLabel('payments.status.mixed'),
								'0' : getDashLabel('payments.status.draft'),
								'1' : getDashLabel('payments.status.pendingApproval'),
								'2' : getDashLabel('payments.status.pendingMyApproval'),
								'3' : getDashLabel('payments.status.pendingSend'),
								'4' : getDashLabel('payments.status.rejected'),
								'5' : getDashLabel('payments.status.rejected'),
								'6' : getDashLabel('payments.status.pendingRelease'),
								'7' : getDashLabel('payments.status.sentToBank'),
								'8' : getDashLabel('payments.status.deleted'),
								'9' : getDashLabel('payments.status.pendingRepair'),
								'10': getDashLabel('payments.status.forBankSend'),
								'11' : getDashLabel('payments.status.inProcess'),
								'12' : getDashLabel('payments.status.checkIssued'),
								'13' : getDashLabel('payments.status.debitFailed'),
								'14' : getDashLabel('payments.status.debited'),
								'15' : getDashLabel('payments.status.processed'),
								'16' : getDashLabel('payments.status.paymentFailed'),
								'17' : getDashLabel('payments.status.rejected'),
								'18' : getDashLabel('payments.status.cancelled'),
								'19' : getDashLabel('payments.status.forCancelApprove'),
								'20' : getDashLabel('payments.status.cancelRequest'),
								'21' : getDashLabel('payments.status.cancelRequest'),
								'22' : getDashLabel('payments.status.cancelPaymentFailed'),
								'23' : getDashLabel('payments.status.pendingDisabledAuth'),
								'24' : getDashLabel('payments.status.submitted'),
								'25' : getDashLabel('payments.status.cancellationAuth'),
								'26' : getDashLabel('payments.status.forBankSend'),
								'27' : getDashLabel('payments.status.inProcess'),
								'28' : getDashLabel('payments.status.debited'),
								'29' : getDashLabel('payments.status.cancelRequest'),
								'30' : getDashLabel('payments.status.pendingMyVerification'),
								'31' : getDashLabel('payments.status.pendingVerification'),
								'32' : getDashLabel('payments.status.verifierRejected'),
								'33' : getDashLabel('payments.status.enabled'),
								'34' : getDashLabel('payments.status.pendingMyPartialAuth'),
								'35' : getDashLabel('payments.status.partialAuth'),
								'40' : getDashLabel('payments.status.pendingApproval2'),
								'41' : getDashLabel('payments.status.returned'),
								'43' : getDashLabel('payments.status.wareHoused'),
								'50' : getDashLabel('payments.status.returnedToMaker'),
								'105' : getDashLabel('payments.status.stale'),
								'44' : getDashLabel('payments.status.prenotePending'),
								'45' : getDashLabel('payments.status.prenoteSent'),
								'46' : getDashLabel('payments.status.prenoteVerified'),
								'47' : getDashLabel('payments.status.prenoteFailed'),
								'49' : getDashLabel('payments.status.partialPrenotePending'),
								'48' : getDashLabel('payments.status.holdUntil'),
								'73' : getDashLabel( 'payments.status.modifiedRejected'),
								'96' : getDashLabel('payments.status.cancelledByBank'),
								'97' : getDashLabel('payments.status.mixed'),
								'74' : getDashLabel('payments.status.processed'),
								'75' : getDashLabel('payments.status.reversalPendingAuth'),
								'76' : getDashLabel('payments.status.reversalApproved'),
								'77' : getDashLabel('payments.status.reversalRejected'),
								'78' : getDashLabel('payments.status.reversalPartialMyPath'),
								'90' : getDashLabel('payments.status.reversalPartialPath'),
								'93' : getDashLabel('payments.status.reversed'),
								'98' : getDashLabel('payments.status.inProcess'),
								'51' : getDashLabel('payments.status.inProcess'),
								'52' : getDashLabel('payments.status.inProcess'),
								'53' : getDashLabel('payments.status.inProcess'),
								'54' : getDashLabel('payments.status.inProcess'),
								'55' : getDashLabel('payments.status.inProcess'),
								'56' : getDashLabel('payments.status.inProcess'),
								'57' : getDashLabel('payments.status.inProcess'),
								'58' : getDashLabel('payments.status.processed'),
								'59' : getDashLabel('payments.status.failed'),
								'60' : getDashLabel('payments.status.processed'),
								'61' : getDashLabel('payments.status.processed'),
								'62' : getDashLabel('payments.status.inProcess'),
								'63' : getDashLabel('payments.status.inProcess'),
								'64' : getDashLabel('payments.status.inProcess'),
								'65' : getDashLabel('payments.status.inProcess'),
								'66' : getDashLabel('payments.status.inProcess'),
								'67' : getDashLabel('payments.status.inProcess'),
								'68' : getDashLabel('payments.status.inProcess'),
								'69' : getDashLabel('payments.status.inProcess'),
								'70' : getDashLabel('payments.status.inProcess'),
								'71' : getDashLabel('payments.status.inProcess'),
								'94' : getDashLabel('payments.status.inProcess'),
								'95' : getDashLabel('payments.status.inProcess'),
								'96' : getDashLabel('payments.status.inProcess'),
								'67' : getDashLabel('payments.status.inProcess'),
								'101' : getDashLabel('payments.status.pendingSubmit'),
								'102' : getDashLabel('payments.status.cancelled'),
								'103' : getDashLabel('payments.status.partialCancelled'),
								'104' : getDashLabel('payments.status.printed'),
							});
					}
			  },
			  {
					"fieldName": "record.productTypeDesc",
					"label": getDashLabel('payments.paymentPackage'),
					"type": "text",
					"group" : true,
					"visible" : false
			  },
			  {
					"fieldName": "record.txnType",
					"label": getDashLabel('payments.typeOfTransaction'),
					"type": "multibox",
					"visible" : false,
					"render": function (data, type, row) {
						return DataRender.dataMapper(data, {
								"WEB": getDashLabel('payments.txnType.WEB'),
                              "FILE":getDashLabel('payments.txnType.FILE'),
                              "SI": getDashLabel('payments.txnType.SI'),
							    "TEMPLATE": getDashLabel('payments.txnType.TEMPLATE')
						});
					} 
			  },
			  {
					"fieldName": "record.CompanyId",
					"label": getDashLabel('payments.companyId'),
					"type": "multibox",
					"visible" : false
			  },
			  {
					"fieldName": "record.maker",	
					"label": getDashLabel('payments.entryUser'),
					"type": "autocomplete",
					"visible" : false
			  },
			  {
					"fieldName": "record.client",	
					"label": getDashLabel('payments.corporation'),
					"type": "selectbox",
					"visible" : false
			  },
			  {
					"fieldName": "record.templateName",
					"label": getDashLabel('payments.templateName'),
					"type": "autocomplete",
					"visible" : false
			  },
			  {
				  "fieldName": "record.channelDesc",	
				  "label": getDashLabel('payments.channel'),
				  "type": "multibox",
				  "visible" : false
		      },
		      {
					"fieldName": "record.receiverCode",	
					"label": getDashLabel('payments.receiverCode'),
					"type": "autocomplete",
					"visible" : false
		      },
		      {
					"fieldName": "record.templateType",	
					"label": getDashLabel('payments.templateType'),
					"type": "selectbox",
					"visible" : false
		      },
		      {
					"fieldName": "record.file",
					"label": getDashLabel('payments.filename'),
					"type": "autocomplete",
					"visible" : false
		      },
		      {
					"fieldName": "record.anyIdType",
					"label": getDashLabel('payments.anyIDType'),
					"type": "selectbox",
					"visible" : false
		      },
		      {
					"fieldName": "record.anyIdValue",
					"label": getDashLabel('payments.anyIDValue'),
					"type": "text",
					"visible" : false
			  },
			  {
	              "fieldName": "record.isConfidential", 
	              "label": getDashLabel('payments.confidential'),
	              "type": "String",
	              "render": function (data, type, row) {
						return DataRender.dataMapper(data, {
	                    "Y": getDashLabel('payments.confidential.yes'),
	                   "N": getDashLabel('payments.confidential.no')
	               });
	              },
	              "visible" : false

			  },
			  {
	              "fieldName": "record.fxRate", 
	              "label": getDashLabel('payments.exchangeRate'),
	              "type": "checkbox",
	              "visible" : false
			  },
			  {
					"fieldName": "record.recieverAccount",
					"label": getDashLabel('payments.receivingAccount'),
					"type": "text",
					"visible" : false

			  },
			  {
					"fieldName": "record.receiverShortCode",	
					"label": getDashLabel('payments.drawerCode'),
					"type": "autocomplete",
					"visible" : false

			  },
			  {
					"fieldName": "record.templateDescription",	
					"label": getDashLabel('payments.templateDesc'),
					"type": "string",
					"visible" : false

			  },
			  {
					"fieldName": "record.rejectRemarks",	
					"label": getDashLabel('payments.rejectRemarks'),
					"type": "string",
					"visible" : false

			  },
			  {
					"fieldName": "record.paymentsSource",	
					"label": getDashLabel('payments.paymentSource'),
					"type": "string",
					"visible" : false,
					"render": function (data, type, row) {
						return DataRender.dataMapper(data, {
	                    "M": getDashLabel('payments.source.manual'),
	                    "F": getDashLabel('payments.source.fileUpload')
	               });
	              }
			  },
			  {
					"fieldName": "record.hostMessage",	
					"label": getDashLabel('payments.hostMessage'),
					"type": "string",
					"visible" : false
			  },
			  {
					"fieldName": "record.debitAmount",	
					"label": getDashLabel('payments.debitAmount'),
					"type": "amount",
					"visible" : false,
					"render": function (data, type, row) {
						let currency;
						if(type == 'sort') return data;
						if(row && row.record && row.record.currency)
						{
							currency = decodeURIComponent(row.record.currency);
						}
						if(data != null && data != '' && data.indexOf("--") < 0)
						{
							return  currency + ' '+ DataRender.amountFormatter(data, {
								groupSeparator    : _strGroupSeparator, 
								decimalSeparator  : _strDecimalSeparator, 
								amountMinFraction : _strAmountMinFraction, 
							});					
						}
						else
						{
							return getDashLabel('confidential','--CONFIDENTIAL--');
						}
					}
			  },
			  {
					"fieldName": "record.creditAmount",
					"label": getDashLabel('payments.creditAmount'),
					"type": "amount",
					"visible" : false,
					"render": function (data, type, row) {
						let currency;
						if(type == 'sort') return data;
						if(row && row.record && row.record.currency)
						{
							currency = decodeURIComponent(row.record.currency);
						}
						if(data != null && data != '' && data.indexOf("--") < 0)
						{
							return  currency + ' '+ DataRender.amountFormatter(data, {
								groupSeparator    : _strGroupSeparator, 
								decimalSeparator  : _strDecimalSeparator, 
								amountMinFraction : _strAmountMinFraction, 
							});					
						}
						else
						{
							return getDashLabel('confidential','--CONFIDENTIAL--');
						}
					}
			  },
			  {
					"fieldName": "record.PHDNumber",	
					"label": getDashLabel('payments.trackingNmbr'),
					"type": "text",
					"visible" : false
			  },
			  {
					"fieldName": "record.defaultAccount",
					"label": getDashLabel('payments.defaultAccount'),
					"type": "text",
					"visible" : false,
		            "render": function (data, type, row) {
						return DataRender.dataMapper(data, {
	                    "Y": getDashLabel('payments.confidential.yes'),
	                   "N": getDashLabel('payments.confidential.no')
	                   });
		            }		
			  },
			  {
					"fieldName": "record.beneBankDescription",	
					"label": getDashLabel('payments.receiverBankName'),
					"type": "text",
					"visible" : false
			  },
			  {
					"fieldName": "record.sendingAccountDescription",	
					"label": getDashLabel('payments.sendingAccntName'),
					"type": "text",
					"visible" : false
			  },
			  {
					"fieldName": "record.remarks",	
					"label": getDashLabel('payments.remarks'),
					"type": "text",
					"visible" : false
			  },
			  {
					"fieldName": "record.beneBranchDescription",	
					"label": getDashLabel('payments.receieverBranchName'),
					"type": "text",
					"visible" : false
			  },
			  {
					"fieldName": "record.pendingApprovalCount",	
					"label": getDashLabel('payments.userPendingForApproval'),
					"type": "text",
					"visible" : false
			  }
			],
			"rows":{
				"buttons":[
					{
						"id":"viewRecord",
						"label": getDashLabel('payments.viewRecord'),
						"hidden": function(rootData, rowData){
							let json = JSON.parse(rootData);
							return ActionButtonRenderer.buttonMaskMapper(rowData.actionMap, json.root.buttonMask, "VIEW");	
		 				},
						"callbacks":{
							"onclick" : function(data){
								PaymentHelper.handleRecordAction("VIEW", data.record, widgetId);
							}
						}
					},
					{
						"id":"editRecord",
						"label":getDashLabel('payments.action.modifyRecord'),
						"hidden": function(rootData, rowData){
							let json = JSON.parse(rootData);
							return ActionButtonRenderer.buttonMaskMapper(rowData.actionMap, json.root.buttonMask, "EDIT");
						},				
						"callbacks":{
							"onclick" : function(data){
								PaymentHelper.handleRecordAction("EDIT", data.record, widgetId);
							}
						}
					},
					{
						"id":"rejectRecord",
						"label":getDashLabel('payments.action.rejectRecord'),
						"hidden": function(rootData, rowData){
							let json = JSON.parse(rootData);
							return ActionButtonRenderer.buttonMaskMapper(rowData.actionMap, json.root.buttonMask, "REJECT");
						},				
						"callbacks":{
							"onclick" : function(data){
								PaymentHelper.handleRecordAction("reject", data.record, widgetId);
							}
						}
					},
					/*{
						"id":"Alert",
						"label":getDashLabel('payments.alert'),
						"hidden": function(rootData, rowData){
							var amntLt48k = (rowData.record.amount > 48000)

							if (typeof rowData.record.amount == 'undefined')
							{
								amntLt48k = false;
							}

							let json = JSON.parse(rootData);
							return ActionButtonRenderer.buttonMaskMapper(rowData.actionMap, json.root.buttonMask, "EDIT") && amntLt48k;	
						},				
						"callbacks":{
							"onclick" : function(data){
								PaymentHelper.handleRecordAction("sweep", data.record, widgetId);
							}
						}
					},*/
					{
						"id":"acceptRecord",
						"label":getDashLabel('payments.action.acceptRecord'),
						"hidden": function(rootData, rowData){
							let json = JSON.parse(rootData);
							return ActionButtonRenderer.buttonMaskMapper(rowData.actionMap, json.root.buttonMask, "ACCEPT");
						},				
						"callbacks":{
							"onclick" : function(data){
								PaymentHelper.handleRecordAction("auth", data.record, widgetId);
							}
						}
					},
				 ]
			}	
		  },  
		 "actions":{},
		  "filter" : {
			  "fields": [
				  {
						"fieldName": "clientReference",			
						"label":  getDashLabel('payments.referenceNo'),
						"type": "text",
						"filterSubType": "header"
				  },
				  {
						"fieldName": "AccountNo",
						"label": getDashLabel('payments.accountNo'),
						"type": "multibox",
						"filterSubType": "detail",
						"ajax": {
							url : rootUrl+'/services/userseek/debitaccounts.json?$filterCode1=' + strClient,
							dataType : "json",
							data : [],
							success : function(data, response) {
								if(data && data.d && data.d.preferences)
								{
									var res = data.d.preferences;
									response($.map(res, function(item) {
										return {
											label : item.DESCR,
											code  : item.CODE
										}
									}));									
								}
							}
						},
						"data": [],
						"defalut": "",
						"callbacks":{}
				  },		  
				  {
						"fieldName": "ReceiverNamePDT",			
						"label": getDashLabel('payments.receiverName'),
						"type": "autocomplete",
						"filterSubType": "detail",
						"minimumInputLength" : 1,
						"ajax": {
								url: rootUrl+'/services/userseek/BENEFICIARYSEEK_POPUP.json',
								dataType : "json",
								data: function (params) {
								  var query = {
									$autofilter: params
								  }
								  return query;
								},
								success: function (data) {
									return {
										results: $.map(data.d.preferences, function (item) {
											return {
												label: item.DESCRIPTION,
												value: item.DESCRIPTION  // paymentType data coming from json
											}
										})
									};
								}
							},
						"data": [],
						"callbacks":{}			
				  },		  
				  {
						"fieldName": "amount",
						"label": getDashLabel('payments.amount'),
						"type": "amount",
						"filterSubType": "header",
						"render": function (data, type, row) {
							return DataRender.amountFormatter(data, {
								groupSeparator    : _strGroupSeparator, 
								decimalSeparator  : _strDecimalSeparator, 
								amountMinFraction : _strAmountMinFraction, 
							});			
						}
				  },
				  {
						"fieldName": "InstrumentType",			
						"label":  getDashLabel('payments.paymentType'),
						"type": "multibox",
						"filterSubType": "header",
			
						"ajax": {
							url : rootUrl+'/services/paymentMethod.json',
							dataType : "json",
							data : [],
							success : function(data, response) {							
								if(data && data.d && data.d.instrumentType)
								{
									var res = data.d.instrumentType;
									response($.map(res, function(item) {
										return {
											label : getDashLabel("productCategory."+item.instTypeCode, item.instTypeDescription),
											code  : item.instTypeCode
										}
									}));
								}
							}
						},
						"data": [],
						"defalut": "checkall",
						"callbacks":{}	
				  },		  
				  {
						"fieldName": "ProductType",			
						"label": getDashLabel('payments.paymentPackage'),
						"type": "multibox",  // multiselect
						"filterSubType": "header",
						"ajax": {
							url :  rootUrl+'/services/userseek/usermyproducts.json?$top=-1&$filterCode1='+ strClient,
							dataType : "json",
							data : [],
							success : function(data, response) {							
								if(data && data.d && data.d.preferences)
								{
									var res = data.d.preferences;
									response($.map(res, function(item) {
										return {
											label : item.PRDDESCR,
											code  : item.CODE
										}
									}));									
								}
							}
						},
						"data": [],
						"defalut": "checkall",
						"callbacks":{}								
				  },
				  {
						"fieldName": "ActivationDate",			
						"label": getDashLabel('payments.effectiveDate'),
						"filterSubType": "header",
						"type": "date",  
				  },
				  {
						"fieldName": "EntryDate",			
						"label": getDashLabel('payments.entryDate'),
						"filterSubType": "header",
						"type": "date",
						"default" : {
							 "operator": "bt", 
							 "value1": from_date_payment ,
							 "value2": to_date_payment 
						},				
				  },		  
				  {
						"fieldName": "trackingNumber",			
						"label": getDashLabel('payments.trackingNmbr'),
						"type": "text",
						"filterSubType": "header"
				  },
				  {
						"fieldName": "ActionStatus",			
						"label":  getDashLabel('payments.status'),
						"type": "multibox",
						"filterSubType": "header",
						"data": [
								  {
									"code": "0",
									"label": getDashLabel('payments.status.draft')
								  },
								  {
									"code": "101",
									"label": getDashLabel('payments.status.pendingSubmit'),
								  },
								  {
									"code": "1",
									"label": getDashLabel('payments.status.pendingApproval')
								  },
								  {
									"code": "2",
									"label": getDashLabel('payments.status.pendingMyApproval')
								  },
								  {
									"code": "3",
									"label": getDashLabel('payments.status.pendingSend')
								  },
								  {
									"code": "40",
									"label": getDashLabel('payments.status.pendingApproval2')
								  },
								  {
									"code": "4",
									"label":  getDashLabel('payments.status.rejected')
								  },
								  {
									 "code": "43",
									 "label": getDashLabel('payments.status.wareHoused')
								  }
							], 
						"defalut": "checkall",
						"default" : {
							 "operator": "in", 
							 "value1": '0,101,1,2,3,40,4,43',
							 "value2": ''
						},					
						"callbacks":{}								
				  },
				  {
						"fieldName": "TransactionType",			
						"label": getDashLabel('payments.typeOfTransaction'),
						"type": "multibox",
						"filterSubType": "header",
						"data": [
								  {
									"code": "WEB",
									"label": getDashLabel('payments.txnType.WEB')
								  },
								  {
									"code": "FILE",
									"label": getDashLabel('payments.txnType.FILE')
								  },
								  {
									"code": "SI",
									"label": getDashLabel('payments.txnType.SI')
								  },
								  {
									"code": "TEMPLATE",
									"label": getDashLabel('payments.txnType.TEMPLATE')
								  }
								], 
						"defalut": "checkall",
						"callbacks":{}								
				  },
				  {
						"fieldName": "CompanyId",			
						"label": getDashLabel('payments.companyId'),
						"type": "multibox",
						"filterSubType": "header",
						"ajax": {
							url : rootUrl+'/services/userseek/companyIdSeek.json?$filterCode1='+strClient,
							dataType : "json",
							data : [],
							success : function(data, response) {							
								if(data && data.d && data.d.preferences)
								{
									var res = data.d.preferences;
									response($.map(res, function(item) {
										return {
											label : item.DESCRIPTION,
											code  : item.CODE
										}
									}));									
								}
							}
						},
						"data": [],
						"defalut": "checkall",
						"callbacks":{}								
				  },
				  {
						"fieldName": "Maker",			
						"label": getDashLabel('payments.entryUser'),
						"type": "autocomplete",
						"filterSubType": "header",
						"minimumInputLength" : 1,
						"ajax": {
								url : rootUrl+'/services/userseek/corpuser.json' + strClient,
								dataType : "json",
								data: function (params) {
								  var query = {
									$autofilter: params
								  }
								  return query;
								},
								success: function (data) {
									return {
										results: $.map(data.d.preferences, function (item) {
											return {
												label: item.DESCR,
												value: item.CODE
											}
										})
									};
								}
							},
						"data": [],
						"callbacks":{}			
				  },
				  {
						"fieldName": "Client",			
						"label": getDashLabel('payments.corporation'),
						"type": "selectbox",
						"filterSubType": "header",
						"default" : {
							 "operator": "eq", 
							 "value1": "all" ,
							 "value2": "" 
						},
						"ajax": {
							url : rootUrl+'/services/userseek/userclients.json&$sellerCode='+ _strSeller,
							dataType : "json",
							data : [],
							success : function(data, response) {							
								if(data && data.d && data.d.preferences)
								{
									var res = data.d.preferences;
									
									if(res.length > 0)
									{
										res.splice(0, 0, {
													DESCR : getDashLabel('payments.allCompany'),									
													CODE : "all"

												});
									}
										
									response($.map(res, function(item) {
										return {
											label : item.DESCR,
											code  : item.CODE
										}
									}));
								}
							}
						},
						"data": [],
						"defalut": "checkall",
						"callbacks":{}
				  },
				  {
						"fieldName": "TemplateName",			
						"label": getDashLabel('payments.templateName'),
						"type": "autocomplete",
						"filterSubType": "header",
						"minimumInputLength" : 1,
						"ajax": {
								url: rootUrl+'/services/paymenttemplates.json',
								dataType : "json",
								data: function (params) {
								  var query = {
									$autofilter: params,
									$filter: 'TemplateName lk '+ "'"+ params + "'"
								  }
								  return query;
								},
								success: function (data) {
									return {
										results: $.map(data.d.paymenttemplates, function (item) {
											return {
												label: item.clientReference,
												value: item.clientReference  // paymentType data coming from json
											}
										})
									};
								}
							},
						"data": [],
						"callbacks":{}			
				  },
				  {
						"fieldName": "Channel",			
						"label": getDashLabel('payments.channel'),
						"type": "multibox",
						"filterSubType": "header",
						"ajax": {
							url :  rootUrl+'/services/userseek/channelcodes.json$filterCode1='+ strClient,
							dataType : "json",
							data : [],
							success : function(data, response) {							
								if(data && data.d && data.d.preferences)
								{
									var res = data.d.preferences;
									response($.map(res, function(item) {
										return {
											label : getDashLabel("filter.channel."+item.CODE, item.DESCR),
											code  : item.CODE
										}
									}));									
								}
							}
						},
						"data": [],
						"defalut": "checkall",
						"callbacks":{}								
				  },
				  {
						"fieldName": "ReceiverCode",			
						"label": getDashLabel('payments.receiverCode'),
						"type": "autocomplete",
						"filterSubType": "header",
						"minimumInputLength" : 1,
						"ajax": {
							url: rootUrl+'/services/userseek/clientReceiverCodesList.json',
								dataType : "json",
								data: function (params) {
								  var query = {
									$autofilter: params
								  }
								  return query;
								},
								success: function (data) {
									return {
										results: $.map(data.d.preferences, function (item) {
											return {
												label: item.RECEIVER_CODE,
												value: item.RECEIVER_CODE
											}
										})
									};
								}
							},
						"data": [],
						"callbacks":{}			
				  },
				  {
						"fieldName": "TemplateType",			
						"label": getDashLabel('payments.templateType'),
						"type": "selectbox",
						"filterSubType": "header",
						"data": [
								  {
									"code": "2",
									"label": getDashLabel('payments.repetitive')
								  },
								  {
									"code": "3",
									"label": getDashLabel( 'payments.semiRepetitive')
								  },
								  {
									"code": "1",
									"label": getDashLabel('payments.nonRepetitive')
								  }					  
								], 
						"defalut": "checkall",
						"callbacks":{}
				  },
				  {
						"fieldName": "FileName",			
						"label": getDashLabel('payments.filename'),
						"type": "autocomplete",
						"filterSubType": "header",
						"minimumInputLength" : 1,
						"ajax": {
								url :rootUrl+'/services/userseek/fileNameNewDashboard.json',
								dataType : "json",
								data: function (params) {
								  var query = {
									$autofilter: params
								  }
								  return query;
								},
								success: function (data) {
									return {
										results: $.map(data.d.preferences, function (item) {
											return {
												label: item.DESCRIPTION,
												value: item.CODE  // paymentType data coming from json
											}
										})
									};
								}
							},
						"data": [],
						"callbacks":{}			
				  },
				  {
						"fieldName": "anyIdType",			
						"label": getDashLabel('payments.anyIDType'),
						"type": "selectbox",
						"filterSubType": "header",
						"ajax": {
							url : rootUrl+'/services/userseek/anyIdType.json',
							dataType : "json",
							data : [],
							success : function(data, response) {							
								if(data && data.d && data.d.preferences)
								{
									var res = data.d.preferences;
									response($.map(res, function(item) {
										return {
											label : getDashLabel("filter.anyIdType."+item.CODE, item.DESCR),
											code  : item.CODE
										}
									}));									
								}
							}
						},
						"data": [],
						"defalut": "checkall",
						"callbacks":{}
				  },
				  {
						"fieldName": "anyIdValue",			
						"label": getDashLabel('payments.anyIDValue'),
						"type": "text",
						"filterSubType": "header"
				  },
		          {
		              "fieldName": "Confidential",                                    
		              "label": getDashLabel('payments.confidential'),
		              "type": "checkbox",
		              "filterSubType": "header",
		              "data": 
		              [
			               {
			                    "code": "Y",
			                    "label": getDashLabel('payments.confidential')
			               }             		
		               ]
		          },
		          {
		              "fieldName": "CrossCurrency",                                    
		              "label": getDashLabel('payments.crossCurrency'),
		              "type": "checkbox",
		              "filterSubType": "detail",
		              "data": 
		              [
		                   {
		                        "code": "Y",
		                        "label": getDashLabel('payments.crossCurrency')
		                   }             		
		               ]
		          },
				  {
						"fieldName": "sortRecieverAccount",		
						"label": getDashLabel('payments.receivingAccount'),
						"type": "text",
						"filterSubType": "header"
				  },
				  {
						"fieldName": "ReceiverShortCode",			
						"label": getDashLabel('payments.drawerCode'),
						"type": "autocomplete",
						"filterSubType": "header",
						"minimumInputLength" : 1,
						"ajax": {
							url: rootUrl+'/services/userseek/clientReceiverShortCodesList.json',
								dataType : "json",
								data: function (params) {
								  var query = {
									$autofilter: params
								  }
								  return query;
								},
								success: function (data) {
									return {
										results: $.map(data.d.preferences, function (item) {
											return {
												label: item.DRAWER_CODE,
												value: item.DRAWER_CODE
											}
										})
									};
								}
							},
						"data": [],
						"callbacks":{}			
				 },
				  {
						"fieldName": "receiverBranchName",			
						"label": getDashLabel('payments.receieverBranchName'),
						"type": "selectbox",
						"filterSubType": "detail",
						"ajax": {
							url: rootUrl+'/services/userseek/clientReceiverBranchName.json',
							dataType : "json",
							data : [],
							success : function(data, response) {							
								if(data && data.d && data.d.preferences)
								{
									var res = data.d.preferences;
									response($.map(res, function(item) {
										return {
											label : item.DESCR,
											code  : item.CODE
										}
									}));									
								}
							}
						},
						"data": [],
						"defalut": "checkall",
						"callbacks":{}
				  }, 
		          {
		              "fieldName": "PayCategory",                                      
		              "label":  getDashLabel('payments.singleBatchPayment'),
		              "type": "radio",
		              "filterSubType": "header",
		              "data": [
		                  {
			                    "code": "Q",
			                    "label": getDashLabel('payments.single')
		                  },
		                  {
			                    "code": "B",
			                    "label": getDashLabel('payments.batch')
		                  }
		              ]
		          },
		          {
		              "fieldName": "CreditDebitFlag",               
		              "label": getDashLabel('payments.transactionType'),
		              "type": "radio",
		              "filterSubType": "header",
		              "data": [          	  
		                  {
			                    "code": "C",
			                    "label": getDashLabel('payments.paymentType.credit')
		                  },
		                  {
			                    "code": "D",
			                    "label": getDashLabel('payments.paymentType.debit')
		                  }
		              ]
		          }		  
			]
		  }  
		}
	return metadata;
}

$.subscribe('com.finastra.widget.filter.top5PayablesBarChart', function(obj, recFilter)
{
  if('Pending Approval' == recFilter) 
	  recFilter = 1;
  else if('Pending Submit' == recFilter) 
	  recFilter = 101;
  else if('Rejected' == recFilter) 
	  recFilter = 4;
  else if('Draft' == recFilter) 
	  recFilter = 0;
  else if('Pending My Approval'== recFilter) 
	  recFilter = 2; 
  else if('Sent To Bank'== recFilter) 
	  recFilter = 7; 
  else if('Pending Send'== recFilter) 
	  recFilter = 3; 


  let filter = {
	  'fields': [
		    {
				'fieldName': 'ActionStatus',
				'filterSubType': 'header',
				'label': 'Status',
				'operator': 'in',
				'type': 'multibox',
				'value1': recFilter,
				'value2': ''
			}		  
		  ],
		 'widgetId': "top5Payables"
  }	
  
  let changedFilter = {
	  'localSavedFilter' : {
		  'filter' : filter,
		  'selectedFilter': '-1'
	  }
  }
  
  localStorage.setItem('top5Payables', JSON.stringify(changedFilter));
  
  widgetMap.top5Payables.api.refresh();
});
