var txnAdvancedFilterFieldsDataAdded=false;
var advPayerNameSelectedValue=null;
var productSelectedValue=null;
var payerAccountSelectedValue=null;
var selectedInstDate={};
var arrReceivableStatus = 	[
	  {
		"code": "15",
		"desc": getLabel("paid","Paid")
	  },
	  {
		"code": "41",
		"desc": getLabel("returned","Returned")
	  },
	  {
		"code": "51,52,53,54,55,56,57,62,63,64,65,66,67,68,69,70,71,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141",
		"desc": getLabel("inprocess","In Process")
	  },
	  {
		"code": "58,60,61",
		"desc": getLabel("processed","Processed")
	  },
	  {
		"code": "96",
		"desc": getLabel("cancelledbybank","Cancelled By Bank")
	  }
	];
var arrReceivableAdminStatus = 	[
	  {
		"code": "LA",
		"desc": "Liquidation Auth"
	  },
	  {
		"code": "RR",
		"desc": "Risk Manager Rejected"
	  },
	  {
		"code": "RM",
		"desc": "Pending Risk Manager"
	  },
	  {
		"code": "SG",
		"desc": "Schedule Generated"
	  },
	  {
		"code": "SM",
		"desc": "Schedule Receipt Marked"
	  },
	  {
		"code": "SA",
		"desc": "Schedule Receipt Auth"
	  },
	  {
		"code": "SR",
		"desc": "Schedule Receipt Rejected"
	  },
	  {
		"code": "RD",
		"desc": "Ready For Download"
	  },
	  {
		"code": "LP",
		"desc": "Paid"
	  },
	  {
		"code": "LR",
		"desc": "Returned"
	  },
	  {
		  "code": "RI",
		  "desc": "Data Entry Rejected"
	  }
	];
var arrReceivablePdcStatus = 	[
	  {
		"code": "I",
		"desc": "In Custody"
	  },
	  {
		"code": "O",
		"desc": "Out of Custody"
	  },
	  {
		"code": "C",
		"desc": "Cancel"
	  },
	  {
		"code": "H",
		"desc": "Hold"
	  }
	];

var  arrPaymentTxnStatus= [{
			'code' : '0',
			'desc' : 'Draft'
		}, {
			'code' : '1',
			'desc' : 'Pending Submit'
		}, {
			'code' : '2',
			'desc' : 'Pending My Auth'
		}, {
			'code' : '3',
			'desc' : 'Pending Auth'
		}, {
			'code' : '4',
			'desc' : 'Pending Send'
		}, {
			'code' : '5',
			'desc' : 'Returned'
		}, {
			'code' : '6',
			'desc' : 'Pending Release'
		}, {
			'code' : '7',
			'desc' : 'Sent To Bank'
		}, {
			'code' : '9',
			'desc' : 'Pending Repair'
		}, {
			'code' : '13',
			'desc' : 'Debit Failed'
		}, {
			'code' : '14',
			'desc' : 'Debited'
		}, {
			'code' : '15',
			'desc' : 'Processed'
		}, {
			'code' : '29',
			'desc' : 'Stop Requested'
		}, {
			'code' : '18',
			'desc' : 'Stopped'
		}, {
			'code' : '19',
			'desc' : 'For Stop Auth'
		}, {
			'code' : '75',
			'desc' : 'Reversal Pending Auth'
		}, {
			'code' : '78',
			'desc' : 'Reversal Pending My Auth'
		}, {
			'code' : '93',
			'desc' : 'Reversed'
		}];
function showTransactionAdvanceFilterPopup(){
	$('#transactionAdvancedFilterPopup').dialog({
		autoOpen : false,
		maxHeight : 550,
		minHeight :156,
		width : 735,
		resizable: false,
		draggable: false,
		modal : true,
		open: function() {
            if(!txnAdvancedFilterFieldsDataAdded){
           		settxnAdvFilterPayerNameAutoComplete("#txnAdvFilterPayerName");
            	setTxnAdvFilterPayerAccount("#txnAdvFilterPayerAccount");
            	if("PRELIQ" === recProductCategory || "DIRECTDEBIT" === recProductCategory){
            		setTxnFilterBankId("#txnFilterBankId");
            	}
				setTxnAdvFilterClearingLocelementId("#txnAdvFilterClearingLoc");
            	//setTxnFilterProduct("#txnFilterProduct");
            	txnAdvancedFilterFieldsDataAdded=true;
            	setTxnStatusMenuItems("txnStatus");
            	$('#txnFilterAmountOperator').niceSelect("destroy");
            	$('#txnFilterAmountOperator').niceSelect();
				$('#instDate').datepick({
					monthsToShow: 1, 
					changeMonth : false,
					changeYear : false,
					dateFormat : strApplicationDateFormat,
					rangeSeparator : ' to ',	
					onClose: function(dates) {
						if(!Ext.isEmpty(dates)){
							$(document).trigger("datePickPopupSelectedDate",["instDate",dates]);
						}
					}
				}).attr('readOnly',true);
				setInstDateDropDownMenu('instDateDropDown');
				$('label[for="InstDateLabel"]').text(getLabel('instDate',
				'Instrument Date')
				+ " (" + getLabel('today','Today') + ")");
				$(document).trigger("handleSelectedDate",["instDate",'1']);
            }
            else 
            {
            	if(selectedInstDate == null || selectedInstDate =='')
            	{
            		$('label[for="InstDateLabel"]').text(getLabel('instDate',
					'Instrument Date')
					+ " (" + getLabel('today','Today') + ")");
            		$(document).trigger("handleSelectedDate",["instDate",'1']);
            	}
            	else
            	{
            		if(selectedInstDate.index == '13')
            		{
            			if(selectedInstDate.operator == 'eq')
            			{
            				$(document).trigger("datePickPopupSelectedDate",["instDate",[selectedInstDate.fromDate]]);
            			}
            			else
            			{
            				$(document).trigger("datePickPopupSelectedDate",["instDate",[selectedInstDate.fromDate,selectedInstDate.toDate]]);
            			}
            		}
            		else
            		{
            			$(document).trigger("handleSelectedDate",["instDate",selectedInstDate.index]);
            		}
            	}
            }
            if("" !== PDC_FLAG && "N" === PDC_FLAG)
            {
            	$('#pdcDiscountRadio').hide();
            } else
            {
            	$('#pdcDiscountRadio').show();
            }
        }
	});
	$('#transactionAdvancedFilterPopup').dialog("open");
}
function setTxnStatusMenuItems(elementId) {
	
	var el = $("#"+elementId).multiselect();
	el.attr('multiple',true);
	if (strEntityType == 0) {
		if(PDC_FLAG === "N")
		{
			if (typeof arrReceivableAdminStatus != 'undefined' && arrReceivableAdminStatus) {
				for(index=0;index<arrReceivableAdminStatus.length;index++)
				{
					var opt = $('<option />', {
						value: arrReceivableAdminStatus[index].code,
						text: arrReceivableAdminStatus[index].desc
					});
					opt.attr('selected','selected');	
					opt.appendTo(el);
				}
				el.multiselect('refresh');
				filterStatusCount=arrReceivableAdminStatus.length;
			}
		}
		else if(PDC_FLAG === "Y")
		{
			if (typeof arrReceivablePdcStatus != 'undefined' && arrReceivablePdcStatus) {
				for(index=0;index<arrReceivablePdcStatus.length;index++)
				{
					var opt = $('<option />', {
						value: arrReceivablePdcStatus[index].code,
						text: arrReceivablePdcStatus[index].desc
					});
					opt.attr('selected','selected');	
					opt.appendTo(el);
				}
				el.multiselect('refresh');
				filterStatusCount=arrReceivablePdcStatus.length;
			}
		}
	}
	else{
		if (typeof arrReceivableStatus != 'undefined' && arrReceivableStatus) {
			for(index=0;index<arrReceivableStatus.length;index++)
			{
				var opt = $('<option />', {
					value: arrReceivableStatus[index].code,
					text: arrReceivableStatus[index].desc
				});
				opt.attr('selected','selected');	
				opt.appendTo(el);
			}
			el.multiselect('refresh');
			filterStatusCount=arrReceivableStatus.length;
		}	
	}	
}
function settxnAdvFilterPayerNameAutoComplete(elementId){
	var selectedValue;
	$(elementId).autocomplete({
			minLength: 1,
			source: function(request, response) {
				$.ajax({
					url :'services/userseek/txnQDrawerNameSeek.json?$filtercode1='+strIdentifier,  
					dataType : "json",
					data : {$autofilter : request.term},
					success : function(data) {
						var rec = data.d.preferences;
						response($.map(rec, function(item) {
							return {
								value : item.DESCRIPTION,
								label : item.DESCRIPTION  
								}
						}));
					}
				});
			},
			select: function( event, ui ) { 
				selectedValue=ui.item.label;
				},
			close: function( event, ui ) {    
				$(elementId).val(selectedValue);
				txnFilterReceiverSelected();
				}
				
		 });/*.data("autocomplete")._renderItem = function(ul, item) {
					var inner_html = '<a><ol class="t7-autocompleter"><ul>'
							+ item.label + '</ul></ol></a>';
					return $("<li></li>").data("item.autocomplete", item)
							.append(inner_html).appendTo(ul);
				};*/	
}
function setTxnAdvFilterPayerAccount(elementId){
	$.ajax({
		url : 'services/userseek/txnDrawerAccNoSeek.json?$filtercode1='+strIdentifier,
		success : function(responseText) {
			var responseData=responseText.d.preferences;
			var defaultOpt = $('<option />', {
				value : "all",
				text : getLabel('allPayerName', 'All')
				});
			defaultOpt.appendTo(elementId);
			$.each(responseData,function(index,item){
				$(elementId).append($('<option/>', { 
					value: responseData[index].CODE,
					text : responseData[index].DESCRIPTION
					}));
			});
		}
	});	
}
function setTxnFilterBankId(elementId){
	var selectedValue;
	$(elementId).autocomplete({
			minLength: 1,
			source: function(request, response) {
				$.ajax({
					url : 'services/userseek/txnQBankSeek.json?$filtercode1='+strIdentifier,
					dataType : "json",
					data : {$autofilter : request.term},
					success : function(data) {
						var rec = data.d.preferences;
						response($.map(rec, function(item) {
							return {
								value : item.DESCRIPTION,
								label : item.DESCRIPTION  
								}
						}));
					}
				});
			},
			select: function( event, ui ) { 
				selectedValue=ui.item.label;
				},
			close: function( event, ui ) {    
				$(elementId).val(selectedValue);
				txnFilterReceiverSelected();
				}
				
		 });/*.data("autocomplete")._renderItem = function(ul, item) {
					var inner_html = '<a><ol class="t7-autocompleter"><ul>'
							+ item.label + '</ul></ol></a>';
					return $("<li></li>").data("item.autocomplete", item)
							.append(inner_html).appendTo(ul);
				};*/
}
function setTxnAdvFilterClearingLocelementId(elementId){
	var selectedValue;
	$(elementId).autocomplete({
			minLength: 1,
			source: function(request, response) {
				$.ajax({
					url : 'services/userseek/txnQClearingLocSeek.json?$filtercode1='+strIdentifier,
					dataType : "json",
					data : {$autofilter : request.term},
					success : function(data) {
						var rec = data.d.preferences;
						response($.map(rec, function(item) {
							return {
								value : item.DESCRIPTION,
								label : item.DESCRIPTION  
								}
						}));
					}
				});
			},
			select: function( event, ui ) { 
				selectedValue=ui.item.label;
				},
			close: function( event, ui ) {    
				$(elementId).val(selectedValue);
				txnFilterReceiverSelected();
				}
				
		 });/*.data("autocomplete")._renderItem = function(ul, item) {
					var inner_html = '<a><ol class="t7-autocompleter"><ul>'
							+ item.label + '</ul></ol></a>';
					return $("<li></li>").data("item.autocomplete", item)
							.append(inner_html).appendTo(ul);
				};*/
}
function setTxnFilterProduct(elementId){
	$.ajax({
		url : 'services/userseek/txnProductSeek.json?$filtercode1='+strIdentifier,
		success : function(responseText) {
			var responseData=responseText.d.preferences;
			var defaultOpt = $('<option />', {
				value : "all",
				text : getLabel('allPayerName', 'All')
				});
			defaultOpt.appendTo(elementId);
			$.each(responseData,function(index,item){
				$(elementId).append($('<option/>', { 
					value: responseData[index].CODE,
					text : responseData[index].DESCRIPTION
					}));
			});
		}
	});	
}
function setTxnFilterOrderingPartyName(elementId,strProduct){
	var selectedValue;
	$(elementId).autocomplete({
			minLength: 1,
			source: function(request, response) {
				$.ajax({
					url :'services/orderingparty/'+strProduct+'.json',    
					data : {$autofilter : request.term},
					success : function(data) {
						var rec = data;
						response($.map(rec, function(item) {
							return {
								value : item.code,
								label : item.description  
								}
						}));
					}
				});
			},
			select: function( event, ui ) { 
				selectedValue=ui.item.label;
				},
			close: function( event, ui ) {    
				$(elementId).val(selectedValue);
				}
				
		 });/*.data("autocomplete")._renderItem = function(ul, item) {
					var inner_html = '<a><ol class="t7-autocompleter"><ul>'
							+ item.label + '</ul></ol></a>';
					return $("<li></li>").data("item.autocomplete", item)
							.append(inner_html).appendTo(ul);
				};*/
}
function txnFilterReceiverSelected(){
	advPayerNameSelectedValue=$('#txnAdvFilterPayerName').val();
}
function txnFilterProductSelected(){
	var selectedProduct=$('#txnFilterProduct').val();
	productSelectedValue=selectedProduct;
	$("#txnFilterOrderingPartyName").val("");
	$("#txnFilterOrderingPartyName  option").remove();
	if(selectedProduct!='all'){
		setTxnFilterOrderingPartyName("#txnFilterOrderingPartyName",selectedProduct);
	}else{
		$("#txnFilterOrderingPartyName").autocomplete("destroy").autocomplete("refresh");
	}
}
function txnAdvFilterPayerAccountSelected(){
	payerAccountSelectedValue=$('#txnAdvFilterPayerAccount').val();
}
function handleTxnFilterAmountOperatorChange(me){
	var selectedAmountOperator=$("#txnFilterAmountOperator").val();
	if(selectedAmountOperator=='bt'){
		$(".amountTo").removeClass("hidden");
		$("#txnAmountLabel").text(getLabel("amountFrom","Amount From"));
	}else{
		$(".amountTo").addClass("hidden");
		$("#txnAmountLabel").text(getLabel("amount","Amount"));
	}
}
function getTxnAdvanceFilterQueryJson(){
	var objJson = null;
	var jsonArray = [];
	
	//Receiver Name
	var payerName = $("#txnAdvFilterPayerName").val();
	if (!Ext.isEmpty(payerName) && payerName != 'all' && payerName != '%') {
	jsonArray.push({
				field : 'PayerName',
				operator : 'lk',
				value1 : payerName,
				value2 : '',
				dataType : 0,
				displayType : 8,
				fieldLabel : getLabel('PayerName','Payer Name'),
				displayValue1 : payerName
			});
	}
	var txnRef = $("#txnAdvFilterTxnRef").val();
	txnRef = txnRef.toLowerCase();
	if (!Ext.isEmpty(txnRef) && txnRef!='all') {
		if(payCollDtl === "13" || payCollDtl === "08"){	
			jsonArray.push({
						field : 'txnRef',
						operator : 'lk',
						value1 : txnRef,
						value2 : '',
						dataType : 0,
						displayType : 8,
						fieldLabel : getLabel('colQryAdvFltTxnRefNo','Transaction Reference'),
						displayValue1 : txnRef
					});
		}
		else{
			jsonArray.push({
				field : 'txnRefNo',
				operator : 'lk',
				value1 : txnRef,
				value2 : '',
				dataType : 0,
				displayType : 8,
				fieldLabel : getLabel('colQryAdvFltTxnRefNo','Transaction Reference'),
				displayValue1 : txnRef
			});
		}
	}
	var clrLoc =  $("#txnAdvFilterClearingLoc").val();
	if (!Ext.isEmpty(clrLoc) && clrLoc != 'all' && clrLoc != '%') {		
		jsonArray.push({
					field : 'ClearingLocationDesc',
					operator : 'eq',
					value1 : clrLoc,
					value2 : '',
					dataType : 0,
					displayType : 4,
					fieldLabel : getLabel('clearingLocation','Clearing Location'),
					displayValue1 : clrLoc
		});
	}
	var instNo = $("#txnAdvFilterInstNo").val();
		if (!Ext.isEmpty(instNo)) {
		jsonArray.push({
					field : 'InstNo',
					operator : 'lk',
					value1 : instNo,
					value2 : '',
					dataType : 0,
					displayType : 4,
					fieldLabel : getLabel('colQryAdvFltInstrument','Instrument'),
					displayValue1 : instNo
				});
	}
	
	//Bank Id
	var bandkIdValue =  $("#txnFilterBankId").val();
	if (!Ext.isEmpty(bandkIdValue)&& bandkIdValue!='all' && bandkIdValue!='%') {		
		jsonArray.push({
					field : 'PayerBankId',
					operator : 'eq',
					value1 : bandkIdValue,
					value2 : '',
					dataType : 0,
					displayType : 4,
					fieldLabel : getLabel('payerBankId','Payer Bank Id'),
					displayValue1 : bandkIdValue
		});
	}
	
	//Amount
	var blnAutoNumeric = true;
	var amountFrom=$("#txnFilterAmountFieldFrom").val();
	blnAutoNumeric = isAutoNumericApplied("txnFilterAmountFieldFrom");
	if (blnAutoNumeric)
		amountFrom = $("#txnFilterAmountFieldFrom").autoNumeric('get');
	else
		amountFrom = $("#txnFilterAmountFieldFrom").val();
	if(!Ext.isEmpty(amountFrom)){
		var amountOperator = $("#txnFilterAmountOperator").val();
		var amountTo=$("#txnFilterAmountFieldTo").val();
		blnAutoNumeric = isAutoNumericApplied("txnFilterAmountFieldTo");
		if (blnAutoNumeric)
			amountTo = $("#txnFilterAmountFieldTo").autoNumeric('get');
		else
			amountTo = $("#txnFilterAmountFieldTo").val();
		if (!Ext.isEmpty(amountOperator)) {
			jsonArray.push({

						field : 'AmountDdt',
						operator : amountOperator,							
						value1 : amountFrom,
						value2 : amountTo,
						dataType : 2,
						displayType : 2,
						fieldLabel : getLabel('operator','Operator'),
						displayValue1 : amountOperator
					});
		}
	}
	
	// Status
	var statusValue=$("select[id='txnStatus']").getMultiSelectValue();
	var statusValueString=statusValue.join("and");
	var tempStatusValue;
	var statusValueDesc = [];
	$('#txnStatus :selected').each(function(i, selected){
		statusValueDesc[i] = $(selected).text();
	});
	if (!Ext.isEmpty(statusValueString)) {
		if(!Ext.isEmpty(filterStatusCount)){
			var statusValueArray=statusValueString.split("and");
			tempStatusValue=statusValueArray.join(',');
			if(filterStatusCount==statusValueArray.length)
				tempStatusValue='All';
		}
		if(tempStatusValue != 'All')
		{
		jsonArray.push({
					field : 'ActionStatusDtl',
					operator : 'in',
					value1 : tempStatusValue,
					value2 : '',
					dataType : 0,
					displayType : 11,
					fieldLabel : getLabel('status','Status'),
					displayValue1 : statusValueDesc.toString()
				});
		}
	}
	if(!jQuery.isEmptyObject(selectedInstDate)){
		jsonArray.push({
						field : 'InstDate',
						operator : selectedInstDate.operator,
						value1 : selectedInstDate.fromDate,
						value2 : selectedInstDate.toDate,
						dataType : 1,
						displayType : 6,
						fieldLabel : getLabel('colQryAdvFltInstrumentDate','Instrument Date')
						//displayValue1 : selectedInstDate.dateLabel
					});
	}
	
	// PDC Discount
	if(PDC_FLAG === "Y")
	{
		if ($("#pdcDiscountY").is(":checked")) {		
			jsonArray.push({
						field : 'DiscountedFlag',
						operator : 'eq',
						value1 : 'Y',
						value2 : '',
						dataType : 0,
						displayType : 4,
						fieldLabel : getLabel('pdcDiscount','PDC Discount'),
						displayValue1 : 'Yes'
			});
		}
		else if ($("#pdcDiscountN").is(":checked")) {		
			jsonArray.push({
				field : 'DiscountedFlag',
				operator : 'eq',
				value1 : 'N',
				value2 : '',
				dataType : 0,
				displayType : 4,
				fieldLabel : getLabel('pdcDiscount','PDC Discount'),
				displayValue1 : 'No'
			});
		}
	}
	
	objJson=jsonArray;
	return objJson
}
function setInstDateDropDownMenu(renderToElementId){
	var dropDownContainer=Ext.create('Ext.Container', {
			itemId : 'InstDateContainer',
			renderTo:renderToElementId,
			items : [{
							xtype : 'label',
							forId : "InstDateLabel",
							text:getLabel('colQryAdvFltInstrumentDate', 'Instrument Date'),
							listeners: {
							       render: function(c) {
							    	   			var tip = Ext.create('Ext.tip.ToolTip', {
											            	    target: c.getEl(),
											            	    listeners:{
											            	    	beforeshow:function(tip){
											            	    		if(inst_date_opt === null)
												            	    		tip.update(getLabel('colQryAdvFltInstrumentDate', 'Instrument Date'));
												            	    	else
												            	    		tip.update(getLabel('colQryAdvFltInstrumentDate', 'Instrument Date') + creation_date_opt);

											            	    	}
											            	    }
							        			});
							       	}	
							}
						},{
							xtype : 'button',
							border : 0,
							itemId : 'instDateButton',
							cls : 'ui-caret-dropdown',
							listeners : {
								click:function(event){
										var menus=getDateDropDownItems("instDate",this);
										var xy=event.getXY();
										menus.showAt(xy[0],xy[1]+16);
										event.menu=menus;
										event.removeCls('ui-caret-dropdown'),
										event.addCls('action-down-hover');
								}
							}
						}
					]
		});
		return dropDownContainer;
}

function getDateDropDownItems(filterType,buttonIns){
	var dropdownMenu = Ext.create('Ext.menu.Menu', {
		itemId : 'DateMenu',
		cls : 'ext-dropdown-menu',
		listeners : {
				hide:function(event) {
					buttonIns.addCls('ui-caret-dropdown');
					buttonIns.removeCls('action-down-hover');
				}
			},	
		items : [{
					text : getLabel('latest', 'Latest'),
					btnId : 'latest',
					btnValue : '12',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Latest)");
					}
				}, {
					text : getLabel('today', 'Today'),
					btnId : 'btnToday',
					btnValue : '1',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Today)");
					}
				}, {
					text : getLabel('yesterday', 'Yesterday'),
					btnId : 'btnYesterday',
					btnValue : '2',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Yesterday)");
					}
				}, {
					text : getLabel('thisweek', 'This Week'),
					btnId : 'btnThisweek',
					btnValue : '3',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (This Week)");
					}
				}, {
					text : getLabel('lastweektodate', 'Last Week To Date'),
					btnId : 'btnLastweek',
					btnValue : '4',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Last Week To Date)");
					}
				}, {
					text : getLabel('thismonth', 'This Month'),
					btnId : 'btnThismonth',
					btnValue : '5',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (This Month)");
					}
				}, {
					text : getLabel('lastMonthToDate', 'Last Month To Date'),
					btnId : 'btnLastmonth',
					btnValue : '6',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Last Month To Date)");
					}
				}, {
					text : getLabel('thisquarter', 'This Quarter'),
					btnId : 'btnLastMonthToDate',
					btnValue : '8',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (This Quarter)");
					}
				}, {
					text : getLabel('lastQuarterToDate',
							'Last Quarter To Date'),
					btnId : 'btnQuarterToDate',
					btnValue : '9',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Last Quarter To Date)");
					}
				}, {
					text : getLabel('thisyear', 'This Year'),
					btnId : 'btnLastQuarterToDate',
					btnValue : '10',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (This Year)");
					}
				}, {
					text : getLabel('lastyeartodate', 'Last Year To Date'),
					btnId : 'btnYearToDate',
					btnValue : '11',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Last Year To Date)");
					}
				}]
	});
	return dropdownMenu;
}
function updateToolTip(filterType,date_option){
	if(filterType === 'instDate')
		inst_date_opt = date_option;
	else if(filterType === 'valueDate')
		value_date_opt = date_option;
}
/**
		 * Note : This is handled for payment using template
		 */		
