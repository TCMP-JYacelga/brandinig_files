widgetMetaData.top5Payments = function(widgetId, widgetType)
{
	var rootUrl = (window.widgetConfig && window.widgetConfig[widgetId]) ? window.widgetConfig[widgetId].rootUrl : window.rootUrl;
	var widgetConfig = (window.widgetConfig && window.widgetConfig[widgetId]) ? window.widgetConfig[widgetId] : {};
	
	function applySecurityToken(config, url) {
		if (config && config.ssoToken) {
		  	if (url.indexOf('?') > 0) {
		  		url = url + "&";
		  	} else {
		  		url = url + "?";
		  	}
	  		url = url + "SEC_TKN=" + config.ssoToken;
	  	}
	  	return url;
	};
	
	var metadata = {
		  "title": getDashLabel('payments.title','Payments'),
		  "desc": getDashLabel('payments.desc','Payments'),
		  "type": "datatable",
		  "subType": "", 
		  "url": applySecurityToken(widgetConfig, rootUrl + "/services/getPaymentRecords"),
		  "requestMethod":"POST",
		  "responseRoot":"root.actionRowList",   // this is root provided for datatable
		  "rootData" : "root",
		  "sortMethod" : ((widgetConfig && widgetConfig.sortMethod) ? widgetConfig.sortMethod : 'group'),
		  "widgetType" : widgetType,
		  "cloneMaxCount": 4,
		  "seeMoreUrl": rootUrl + "/paymentSummary.form",
		  "applyConfiguration": function(config) {
		  	metadata.config = config;
		  	metadata.rootUrl = config.rootUrl;
		  	metadata.url = applySecurityToken(widgetConfig, rootUrl + "/services/getPaymentRecords");
		  	metadata.seeMoreUrl = rootUrl + "/paymentSummary.form";
		  },
		  "applySecurityToken": function(url) {
		  	if (metadata.config && metadata.config.ssoToken) {
			  	if (url.indexOf('?') > 0) {
			  		url = url + "&";
			  	} else {
			  		url = url + "?";
			  	}
		  		url = url + "SEC_TKN=" + metadata.config.ssoToken;
		  	}
		  	return url;
		  },
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
					"fieldName": "record.entryDate",
					"label": getDashLabel('payments.entryDate'),
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
							return getDashLabel('confidential','--CONFIDENTIAL--');
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
					"fieldName": "record.actionDate",
					"label": getDashLabel('payments.effectiveDate'),
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
								"WEB": getDashLabel('payments.txnType.WEB' ,'Free Form'),
                                "FILE":getDashLabel('payments.txnType.FILE' ,'File Upload'),
                                "SI": getDashLabel('payments.txnType.SI' ,'Recurring payments'),
							    "TEMPLATE": getDashLabel('payments.txnType.TEMPLATE' ,'Template')
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
					"fieldName": "record.paymentSource",	
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
						"label":getDashLabel('payments.action.modifyRecord', 'Modify Record'),
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
						"id":"sweep",
						"label":getDashLabel('payments.sweep', 'Sweep'),
						"hidden": function(rootData, rowData){
							var amntLt100 = (rowData.record.amount > 48000)
							let json = JSON.parse(rootData);
							return ActionButtonRenderer.buttonMaskMapper(rowData.actionMap, json.root.buttonMask, "EDIT");
						},				
						"callbacks":{
							"onclick" : function(data){
								PaymentHelper.handleRecordAction("sweep", data.record, widgetId);
							}
						}
					},
//					{
//						"id":"rejectRecord",
//						"label":getDashLabel('payments.action.rejectRecord'),
//						"hidden": function(rootData, rowData){
//							let json = JSON.parse(rootData);
//							return ActionButtonRenderer.buttonMaskMapper(rowData.actionMap, json.root.buttonMask, "REJECT");
//						},				
//						"callbacks":{
//							"onclick" : function(data){
//								PaymentHelper.handleRecordAction("reject", data.record, widgetId);
//							}
//						}
//					},			
//					{
//						"id":"submitRecord",
//						"label":getDashLabel('payments.action.submitRecord'),
//						"hidden": function(rootData, rowData){
//							let json = JSON.parse(rootData);
//							return ActionButtonRenderer.buttonMaskMapper(rowData.actionMap, json.root.buttonMask, "SUBMIT");
//						},				
//						"callbacks":{
//							"onclick" : function(data){
//								PaymentHelper.handleRecordAction("submit", data.record, widgetId);
//							}
//						}
//					},			
					{
						"id":"cloneTemplateRecord",
						"label":getDashLabel('payments.action.copyToTemplate'),
						"hidden": function(rootData, rowData){
							let json = JSON.parse(rootData);
							return ActionButtonRenderer.buttonMaskMapper(rowData.actionMap, json.root.buttonMask, "CLONETOTEMPLATE");
						},				
						"callbacks":{
							"onclick" : function(data){
								PaymentHelper.handleRecordAction("CLONETEMPLATE", data.record, widgetId);
							}
						}
					},
					{
						"id":"cloneRecord",
						"label":getDashLabel('payments.action.copyRecord'),
						"hidden": function(rootData, rowData){
							let json = JSON.parse(rootData);
							return ActionButtonRenderer.buttonMaskMapper(rowData.actionMap, json.root.buttonMask, "CLONE");
						},				
						"callbacks":{
							"onclick" : function(data){
								PaymentHelper.handleRecordAction("CLONE", data.record, widgetId);
							}
						}
					},
//					{
//						"id":"historyRecord",
//						"label": getDashLabel('payments.action.viewHistory'),
//						"hidden": function(rootData, rowData){
//							let json = JSON.parse(rootData);
//							return ActionButtonRenderer.buttonMaskMapper(rowData.actionMap, json.root.buttonMask, "VIEWHISTORY");
//						},				
//						"callbacks":{
//							"onclick" : function(){
//								PaymentHelper.handleRecordAction("VIEWHISTORY", data.record);
//							}
//						}
//					},
//					{
//						"id":"verifyRecord",
//						"label": getDashLabel('payments.action.verifyRecod'),
//						"hidden": function(rootData, rowData){
//							let json = JSON.parse(rootData);
//							return ActionButtonRenderer.buttonMaskMapper(rowData.actionMap, json.root.buttonMask, "VERIFY");
//						},				
//						"callbacks":{
//							"onclick" : function(data){
//								PaymentHelper.handleRecordAction("verify", data.record, widgetId);
//							}
//						}
//					},
//					{
//						"id":"acceptRecord",
//						"label":getDashLabel('payments.action.acceptRecord'),
//						"hidden": function(rootData, rowData){
//							let json = JSON.parse(rootData);
//							return ActionButtonRenderer.buttonMaskMapper(rowData.actionMap, json.root.buttonMask, "ACCEPT");
//						},				
//						"callbacks":{
//							"onclick" : function(data){
//								PaymentHelper.handleRecordAction("auth", data.record, widgetId);
//							}
//						}
//					},
//					{
//						"id":"sendRecord",
//						"label":getDashLabel('payments.action.sendRecord'),
//						"hidden": function(rootData, rowData){
//							let json = JSON.parse(rootData);
//							return ActionButtonRenderer.buttonMaskMapper(rowData.actionMap, json.root.buttonMask, "SEND");
//						},				
//						"callbacks":{
//							"onclick" : function(data){
//								PaymentHelper.handleRecordAction("send", data.record, widgetId);
//							}
//						}
//					},
//					{
//						"id":"rejectRecord",
//						"label":getDashLabel('payments.action.rejectRecord'),
//						"hidden": function(rootData, rowData){
//							let json = JSON.parse(rootData);
//							return ActionButtonRenderer.buttonMaskMapper(rowData.actionMap, json.root.buttonMask, "REJECT");
//						},				
//						"callbacks":{
//							"onclick" : function(data){
//								PaymentHelper.handleRecordAction("reject", data.record, widgetId);
//							}
//						}
//					},
					{
						"id":"discardRecord",
						"label":getDashLabel('payments.action.discard'),
						"hidden": function(rootData, rowData){
							let json = JSON.parse(rootData);
							return ActionButtonRenderer.buttonMaskMapper(rowData.actionMap, json.root.buttonMask, "DISCARD");
						},				
						"callbacks":{
							"onclick" : function(data){
								PaymentHelper.handleRecordAction("discard", data.record, widgetId);
							}
						}
					},
//					{
//						"id":"stopRecord",
//						"label":getDashLabel('payments.action.cancel'),
//						"hidden": function(rootData, rowData){
//							let json = JSON.parse(rootData);
//							return ActionButtonRenderer.buttonMaskMapper(rowData.actionMap, json.root.buttonMask, "STOP");
//						},				
//						"callbacks":{
//							"onclick" : function(data){
//								PaymentHelper.handleRecordAction("stop", data.record, widgetId);
//							}
//						}
//					},
//					{
//						"id":"reversalRecord",
//						"label":getDashLabel('payments.action.reversalRecord'),
//						"hidden": function(rootData, rowData){
//							let json = JSON.parse(rootData);
//							return ActionButtonRenderer.buttonMaskMapper(rowData.actionMap, json.root.buttonMask, "REVERSE");
//						},				
//						"callbacks":{
//							"onclick" : function(data){
//								PaymentHelper.handleRecordAction("reversal", data.record, widgetId);
//							}
//						}
//					}			
				 ]
			}	
		  },  
		 "actions":{
		 	"columnChooser" : {
				  "callbacks" : {
					  "enabled" : function() {
					  	return window.embedded === undefined;
					  }
				  }
			  },
		 	"editTitle" : {
				  "callbacks" : {
					  "enabled" : function() {
					  	return window.embedded === undefined;
					  }
				  }
			  },
			  "filter" : {
				  "callbacks" : {
					  "enabled" : function() {
					  	return window.embedded === undefined;
					  }
				  }
			  },
			  "remove" : {
				  "callbacks" : {
					  "enabled" : function() {
					  	return window.embedded === undefined;
					  }
				  }
			  }
		 },
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
							url : applySecurityToken(widgetConfig, rootUrl + '/services/userseek/debitaccounts.json?$filterCode1=' + strClient),
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
							    url: applySecurityToken(widgetConfig, rootUrl + '/services/userseek/BENEFICIARYSEEK_POPUP.json'),
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
							url : applySecurityToken(widgetConfig, rootUrl + '/services/paymentMethod.json'),
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
							url :  applySecurityToken(widgetConfig, rootUrl + '/services/userseek/usermyproducts.json?$top=-1&$filterCode1='+ strClient),
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
						"label": getDashLabel('payments.status'),
						"type": "multibox",
						"filterSubType": "header",
						"data": [
							  	  {
									"code": "7",
									"label":  getDashLabel('payments.status.sentToBank')
								  },				
								  {
									"code": "9",
									"label":  getDashLabel('payments.status.pendingRepair')
								  },
								  {
										"code": "13",
										"label": getDashLabel('payments.status.debitFailed')
								  },
								  {
									"code": "14",
									"label":  getDashLabel('payments.status.debited'),
								  },
								  {
									"code": "41",
									"label": getDashLabel('payments.status.returned')
								  },
								  {
									"code": "18",
									"label": getDashLabel('payments.status.cancelled')
								  },
								  {
									"code": "19",
									"label": getDashLabel('payments.status.forCancelApprove')
								  },
								  {
									"code": "29",
									"label": getDashLabel('payments.status.cancelRequest')
								  },
								  {
									"code": "51,52,53,54,55,56,57,62,63,64,65,66,67,68,69,70,71,94,95,96",
									"label":  getDashLabel('payments.status.inProcess')
								  },
								  {
									"code": "15,58,60,61",
									"label": getDashLabel('payments.status.processed')
								  },
								  {
									"code": "59",
									"label":  getDashLabel('payments.status.failed')
								  },
								  {
									"code": "97,99,999,777,888",
									"label": getDashLabel('payments.status.mixed')
								  },
								  {
									"code": "104",
									"label": getDashLabel('payments.status.printed')
								  },
								  {
									"code": "105",
									"label":  getDashLabel('payments.status.stale')
								  }						  
							], 
						"defalut": "checkall",
						"default" : {
							 "operator": "in", 
							 "value1": '7,9,13,14,41,18,19,29,51,52,53,54,55,56,57,62,63,64,65,66,67,68,69,70,71,94,95,96,15,58,60,61,59,97,99,999,777,888,104,105' ,
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
							url : applySecurityToken(widgetConfig, rootUrl + '/services/userseek/companyIdSeek.json?$filterCode1='+strClient),
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
								url : applySecurityToken(widgetConfig, rootUrl + '/services/userseek/corpuser.json?$filterCode1=' + strClient),
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
							url : applySecurityToken(widgetConfig, rootUrl + '/services/userseek/userclients.json?$sellerCode='+ _strSeller),
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
								url: applySecurityToken(widgetConfig, rootUrl + '/services/paymenttemplates.json'),
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
							url :  applySecurityToken(widgetConfig, rootUrl + '/services/userseek/channelcodes.json$filterCode1='+ strClient),
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
							url: applySecurityToken(widgetConfig, rootUrl + '/services/userseek/clientReceiverCodesList.json'),
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
								url: applySecurityToken(widgetConfig, rootUrl + '/services/userseek/fileNameNewDashboard.json'),
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
							url : applySecurityToken(widgetConfig, rootUrl + '/services/userseek/anyIdType.json'),
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
							url: applySecurityToken(widgetConfig, rootUrl + '/services/userseek/clientReceiverShortCodesList.json'),
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
							url: applySecurityToken(widgetConfig, rootUrl + '/services/userseek/clientReceiverBranchName.json'),
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
//				  {
//						"fieldName": "receiverBranchName",			
//						"label": "Receiver Branch Name",
//						"type": "text",
//						"filterSubType": "detail"
//				  }
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
