widgetMetaData.paymentLineChart = function(widgetId, widgetType)
{
	var metadata = {
  "title": getDashLabel('payments.lineChart.title'),
  "desc": getDashLabel('payments.lineChart.desc'),
  "type": "chart",
  "subType": "linechart", 
  "url": rootUrl+"/services/getPaymentRecords?$top=50",
  "requestMethod":"POST",
  "responseRoot":"root.actionRowList",
  "widgetType" : widgetType,
  "cloneMaxCount": 4,
  "fields": {
	"columns": [	  
	  {
		"fieldName": "record.amount",
		"label": getDashLabel('payments.amount'),
		"type": "amount",
		"render": function (data, type, row) {
			return DataRender.amountFormatter(data, {
				groupSeparator    : _strGroupSeparator, 
				decimalSeparator  : _strDecimalSeparator, 
				amountMinFraction : _strAmountMinFraction, 
			});			
		}
	  },
	  {
			"fieldName": "record.productCategoryDesc",
			"label": getDashLabel('payments.productCategoryDesc'),
			"type": "text"
	  },
	  {
			"fieldName": "record.productCategory",
			"label": getDashLabel('payments.paymentType'),
			"type": "text"
	  },
	  {
		"fieldName": "record.actionStatus",
		"label": getDashLabel('payments.status'),
		"type": "text",
		"render": function (data, type, row) {
			return DataRender.dataMapper(data, {
					'0'  : getDashLabel('payments.status.draft'),
					'1'  : getDashLabel('payments.status.pendingApproval'),
					'2'  : getDashLabel('payments.status.pendingMyApproval'),
					'3'  : getDashLabel('payments.status.pendingSend'),
					'4'  : getDashLabel('payments.status.rejected'),
					'7'	 : getDashLabel('payments.status.sentToBank'),
					'8'  : getDashLabel('payments.status.deleted'),
					'9'  : getDashLabel('payments.status.pendingRepair'),
					'14' : getDashLabel('payments.status.debited'),
					'15' : getDashLabel('payments.status.processed'),
					'18' : getDashLabel('payments.status.stopped'),
					'19' : getDashLabel('payments.status.forCancelApprove'),
					'29' : getDashLabel('payments.status.cancelRequest'),
					'40' : getDashLabel('payments.status.pendingApproval2'),
					'41' : getDashLabel('payments.status.returned'),
					'43' : getDashLabel('payments.status.wareHoused'),
					'58' : getDashLabel('payments.status.processed'),
					'59' : getDashLabel('payments.status.failed'),
					'60' : getDashLabel('payments.status.processed'),
					'61' : getDashLabel('payments.status.processed'),
					'75' : getDashLabel('payments.status.reversalPendingApproval'),
					'76' : getDashLabel('payments.status.reversalApproved'),
					'77' : getDashLabel('payments.status.reversalRejected'),
					'78' : getDashLabel('payments.status.reversalPendingMyApproval'),
					'93' : getDashLabel('payments.status.reversed'),
					'101': getDashLabel('payments.status.pendingSubmit')
				});
		}
	  }
	]	
  },  
  "chart":{
	  "xAxis" : "record.actionStatus",
	  "xAxisLable" : getDashLabel('payments.status'),
	  "yAxis" : "record.amount",
	  "legendKey" : "record.productCategory",
	  "legendDesc" : "record.productCategoryDesc",
	  "yAxisLable" : getDashLabel('payments.amount')
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
            "label": getDashLabel('payments.status'),
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
                                label : getDashLabel("filter.channel."+item.CODE),
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
                        "label": getDashLabel('payments.semiRepetitive')
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
                                label : getDashLabel("filter.anyIdType."+item.CODE),
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
//    {
//          "fieldName": "receiverBranchName",          
//          "label": "Receiver Branch Name",
//          "type": "text",
//          "filterSubType": "detail"
//    }
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
