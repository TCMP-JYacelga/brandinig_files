var arrCreditNoteStatus = [{
   		"code": "4",
   		"desc": getLabel("creditStatus.4","Rejected")
   	},{
   		"code": "2",
   		"desc": getLabel("creditStatus.2","For My Auth")
   	},{
   		"code": "1",
   		"desc": getLabel("creditStatus.1","For Auth")
   	},{
   		"code": "3",
   		"desc": getLabel("creditStatus.3","For Presentment")
   	},{
   		"code": "7",
   		"desc": getLabel("creditStatus.7","Presented")
}];

var arrSellerBuyer = [{
	"code": "SELLER",
	"desc": getLabel("seller","Seller")
  },{
	"code": "BUYER",
	"desc": getLabel("buyer","Buyer")
}];

var CREDIT_NOTE_CENTER_COLUMNS = [{
	"colId" : "reference",
	"colHeader" : getLabel('reference', 'Unique ID'),
	"sortable" : true,
	"colSequence" : 1,
	"width" : 150,
	"locked" : false,
	"hidden" : false,
	"hideable" : false
},{
	"colId" : "entryDate",
	"colHeader" : getLabel('entryDate', 'Date'),
	"sortable" : true,
	"colSequence" : 2,
	"width" : 150,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "invoiceAmount",
	"colHeader" : getLabel('invoiceAmount', 'Amount'),
	"sortable" : true,
	"colSequence" : 3,
	"width" : 100,
	"locked" : false,
	"hidden" : false,
	"hideable" : true,
	"colType" : 'amount'
}, {
	"colId" : "subsidiaryDesc",
	"colHeader" : getLabel('subsidiaryDesc', 'Company Name'),
	"sortable" : true,
	"colSequence" : 4,
	"width" : 100,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
},{
	"colId" : "buyerSellerDesc",
	"colHeader" : getLabel('buyerSellerDesc', 'Buyer'),
	"sortable" : false,
	"colSequence" : 5,
	"width" : 150,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "scmMyProductName",
	"colHeader" : getLabel('scmMyProductName', 'Package'),
	"sortable" : false,
	"colSequence" : 6,
	"width" : 100,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "requestStateDesc",
	"colHeader" : getLabel('requestStateDesc', 'Status'),
	"sortable" : false,
	"colSequence" : 7,
	"width" : 100,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}];

function changeBuyerOrSellerAndRefreshGrid(selectedLoggerCode,
		selectedLoggerDescription) {
	selectedFilterLogger = selectedLoggerCode;
	selectedFilterLoggerDesc = selectedLoggerCode;
	$(document).trigger("handleLoggerChangeInQuickFilter", false);
	saveScreenFilters();
}

function isAutoNumericApplied(strId) {
	var isAutoNumericApplied = false;
	$.each(($('#'+strId).data('events')||[]), function(i, event) {
				if (isAutoNumericApplied === true)
					return false;
				$.each(event, function(i, eventHandler) {
							if (eventHandler.namespace === 'autoNumeric')
								isAutoNumericApplied = true;
							return false;
						});
			});
	return isAutoNumericApplied;
}


function getDateDropDownItems(filterType, buttonIns) {
		var me = this;
		var dropdownMenu = Ext.create('Ext.menu.Menu',{
			itemId : 'DateMenu',
			cls : 'ext-dropdown-menu',
			items : [
					{
						text : getLabel('today', 'Today'),
						btnId : 'btnToday',
						btnValue : '1',
						handler : function(btn, opts) {
							$(document).trigger(
									"filterDateChange",
									[ filterType, btn, opts ]);
							updateToolTip(filterType,
									" (Today)");
						}
					},
					{
						text : getLabel('yesterday',
								'Yesterday'),
						btnId : 'btnYesterday',
						btnValue : '2',
						handler : function(btn, opts) {
							$(document).trigger(
									"filterDateChange",
									[ filterType, btn, opts ]);
							updateToolTip(filterType,
									" (Yesterday)");
						}
					},
					{
						text : getLabel('thisweek', 'This Week'),
						btnId : 'btnThisweek',
						btnValue : '3',
						handler : function(btn, opts) {
							$(document).trigger(
									"filterDateChange",
									[ filterType, btn, opts ]);
							updateToolTip(filterType,
									" (This Week)");
						}
					},
					{
						text : getLabel('lastweektodate',
								'Last Week To Date'),
						btnId : 'btnLastweek',
						btnValue : '4',
						handler : function(btn, opts) {
							$(document).trigger(
									"filterDateChange",
									[ filterType, btn, opts ]);
							updateToolTip(filterType,
									" (Last Week To Date)");
						}
					},
					{
						text : getLabel('thismonth',
								'This Month'),
						btnId : 'btnThismonth',
						btnValue : '5',
						handler : function(btn, opts) {
							$(document).trigger(
									"filterDateChange",
									[ filterType, btn, opts ]);
							updateToolTip(filterType,
									" (This Month)");
						}
					},
					{
						text : getLabel('lastMonthToDate',
								'Last Month To Date'),
						btnId : 'btnLastmonth',
						btnValue : '6',
						handler : function(btn, opts) {
							$(document).trigger(
									"filterDateChange",
									[ filterType, btn, opts ]);
							updateToolTip(filterType,
									" (Last Month To Date)");
						}
					},
					{
						text : getLabel('lastmonthonly',
								'Last Month Only'),
						btnId : 'btnLastmonthOnly',
						btnValue : '14',
						handler : function(btn, opts) {
							$(document).trigger(
									"filterDateChange",
									[ filterType, btn, opts ]);
							updateToolTip(filterType,
									" (Last Month Only)");
						}
					},
					{
						text : getLabel('thisquarter',
								'This Quarter'),
						btnId : 'btnLastMonthToDate',
						btnValue : '8',
						handler : function(btn, opts) {
							$(document).trigger(
									"filterDateChange",
									[ filterType, btn, opts ]);
							updateToolTip(filterType,
									" (This Quarter)");
						}
					},
					{
						text : getLabel('lastQuarterToDate',
								'Last Quarter To Date'),
						btnId : 'btnQuarterToDate',
						btnValue : '9',
						handler : function(btn, opts) {
							$(document).trigger(
									"filterDateChange",
									[ filterType, btn, opts ]);
							updateToolTip(filterType,
									" (Last Quarter To Date)");
						}
					},
					{
						text : getLabel('thisyear', 'This Year'),
						btnId : 'btnLastQuarterToDate',
						btnValue : '10',
						handler : function(btn, opts) {
							$(document).trigger(
									"filterDateChange",
									[ filterType, btn, opts ]);
							updateToolTip(filterType,
									" (This Year)");
						}
					},
					{
						text : getLabel('lastyeartodate',
								'Last Year To Date'),
						btnId : 'btnYearToDate',
						btnValue : '11',
						handler : function(btn, opts) {
							$(document).trigger(
									"filterDateChange",
									[ filterType, btn, opts ]);
							updateToolTip(filterType,
									" (Last Year To Date)");
						}
					} ]
		});
		return dropdownMenu;
	}

function updateToolTip(filterType,date_option){
	if(filterType === 'entryDate')
		entry_date_opt = date_option;
}


function handleEntryAction(invoiceNoteType,userMode,clientCode,clientDesc){
	var form, inputField,strUrl='',strIdentifier = '' ,code ='';;
	if(invoiceNoteType === 'CREDIT')
		strUrl = 'creditNoteEntry.form';
	if(invoiceNoteType === 'DEBIT')
		strUrl = 'debitNoteEntry.form';

	form = document.createElement('FORM');
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.appendChild(createFormField('INPUT', 'HIDDEN',
			csrfTokenName, tokenValue));
	if (!Ext.isEmpty(invoiceNoteType)) {
	        form.appendChild(createFormField('INPUT', 'HIDDEN', 'invoiceNoteType',
	        		invoiceNoteType));
	}
    if (!Ext.isEmpty(userMode)) {
        form.appendChild(createFormField('INPUT', 'HIDDEN', 'userMode',
        		userMode));
   	}
   	if (!Ext.isEmpty(clientCode)) {
        form.appendChild(createFormField('INPUT', 'HIDDEN', 'enteredByClient',
        		clientCode));
   	}
   	if (!Ext.isEmpty(clientDesc)) {
        form.appendChild(createFormField('INPUT', 'HIDDEN', 'enteredByClientDesc',
        		clientDesc));
   	}
	form.action = strUrl;
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}

function getAdvancedFilterQueryJson(){
	var objJson = null;
	var jsonArray = [];
	
	//Client
	var clientCodesData =$("select[id='msClient']").getMultiSelectValueString(); 	
	var tempCodesData = clientCodesData;
	var selClientDesc = selectedClientDesc;
	if (!Ext.isEmpty(tempCodesData)) {
		if(!Ext.isEmpty(filterClientCount)){
			var clientCodeArray=clientCodesData.split(',');
			if(filterClientCount==clientCodeArray.length)
				tempCodesData='all';
		}
		if(tempCodesData!='all' && selClientDesc != '' && selClientDesc != 'All companies'){
		jsonArray.push({
					field : 'Client',
					operator : tempCodesData.indexOf(',') === -1 ? 'eq' : 'in',
					value1 : tempCodesData,
					value2 : '',
					dataType : 0,
					displayType : tempCodesData.indexOf(',') === -1 ? 5 : 11,
					fieldLabel : getLabel('lblcompany', 'Company'),
					displayValue1 : selClientDesc
				});
		}
	}
	
	// Unique ID
	var uniqueIDText = $("#txtUniqueID").val();
	if (!Ext.isEmpty(uniqueIDText)) {
		jsonArray.push({
					field : 'UniqueId',
					operator : 'lk',
					value1 : uniqueIDText,
					value2 : '',
					dataType : 0,
					displayType : 8,
					//detailFilter : 'Y',
					fieldLabel : getLabel('uniqueId','Unique ID'),
					displayValue1 : uniqueIDText
				});
	}
	
	// Entry Date
	if(!jQuery.isEmptyObject(selectedEntryDate)){
		jsonArray.push({
			field : 'EntryDate',
			operator : selectedEntryDate.operator,
			value1 : Ext.util.Format.date(selectedEntryDate.fromDate, 'Y-m-d'),
			value2 : (!Ext.isEmpty( selectedEntryDate.toDate))? Ext.util.Format.date(selectedEntryDate.toDate, 'Y-m-d'): '',
			dataType : 1,
			displayType : 6,
			fieldLabel : getLabel('entryDate','Entry Date'),
			dropdownLabel : selectedEntryDate.dateLabel
		});
	}
	
	//Package
	var productType =  $("select[id='msProducts']").getMultiSelectValueString();
	
	var productTypeDesc = [];
	$('#msProducts :selected').each(function(i, selected){
		productTypeDesc[i] = $(selected).text();
	});
	
	var tempProductType=productType;
	if(productType =='' && !Ext.isEmpty(selectedProductTypeList)){
	filterProductsCount =selectedProductTypeList.length-1;
	if(!Ext.isEmpty(filterProductsCount)){
			tempProductType=selectedProductTypeList.join('and').split('and').join(',');
			if(filterProductsCount==tempProductType.length)
				tempProductType='All';
		}
	}
	if (!Ext.isEmpty(tempProductType)) {
		if(!Ext.isEmpty(filterProductsCount)){
			var productTypeArray=productType.split(',');
			if(filterProductsCount==productTypeArray.length)
				tempProductType='All';
		}
		if(tempProductType != "All")
			jsonArray.push({
						field : 'Package',
						operator : 'in',
						value1 : tempProductType,
						value2 : '',
						dataType : 0,
						displayType : 11,
						fieldLabel : getLabel('package','Package'),
						displayValue1 : productTypeDesc.toString()
					});
	}
	
	//Buyer Seller
	var buyerSellerType =  $("select[id='dropdownClientCode']").getMultiSelectValueString();
	
	var productTypeDesc = [];
	$('#dropdownClientCode :selected').each(function(i, selected){
		productTypeDesc[i] = $(selected).text();
	});
	
	var tempProductType=buyerSellerType;
	if(buyerSellerType =='' && !Ext.isEmpty(selectedBuyerSellerTypeList)){
	filterBuyerSellerCount = selectedBuyerSellerTypeList.length-1;
	if(!Ext.isEmpty(filterBuyerSellerCount)){
			tempProductType=selectedBuyerSellerTypeList.join('and').split('and').join(',');
			if(filterBuyerSellerCount==tempProductType.length)
				tempProductType='All';
		}
	}
	if (!Ext.isEmpty(tempProductType)) {
		if(!Ext.isEmpty(filterBuyerSellerCount)){
			var productTypeArray=buyerSellerType.split(',');
			if(filterBuyerSellerCount==productTypeArray.length)
				tempProductType='All';
		}
		if(tempProductType != "All")
			jsonArray.push({
						field : 'BuyerSeller',
						operator : 'in',
						value1 : tempProductType,
						value2 : '',
						dataType : 0,
						displayType : 11,
						//fieldLabel : getLabel('buyerSeller','Buyer/Seller'),
						fieldLabel : selectedFilterLoggerDesc == "BUYER" ? getLabel("seller","Seller") : getLabel("buyer","Buyer"),
						displayValue1 : productTypeDesc.toString()
					});
	}
	
	// Created By
	var createdByDesc=null;
	var createdBy = $("#createdByOperator").val();
	
	if(createdBy === 'C')
		createdByDesc = 'Client';
	else if(createdBy === 'A')
		createdByDesc = 'Bank';
	
	if(!Ext.isEmpty(createdBy)){
		jsonArray.push({
			field : 'CreatedBy',
			operator : 'eq',							
			value1 : createdBy,
			value2 : '',
			dataType : 0,
			displayType : 8,
			fieldLabel : getLabel('createdBy','Created By'),
			displayValue1 : createdByDesc
		});
	}
	
	// Status
	var statusValue=$("#msStatus").getMultiSelectValue();
	
	var statusValueDesc = [];
	$('#msStatus :selected').each(function(i, selected){
		statusValueDesc[i] = $(selected).text();
	});
	
	var statusValueString=statusValue.join("and");
	var tempStatusValue;
	if (!Ext.isEmpty(statusValueString)) {
		if(!Ext.isEmpty(filterStatusCount)){
			var statusValueArray=statusValueString.split("and");
			//tempStatusValue=statusValueArray;
			tempStatusValue=statusValueArray.join(',');
			if(filterStatusCount==statusValueArray.length)
				tempStatusValue='All';
		}
		if(tempStatusValue != "All")
			jsonArray.push({
						field : 'actionStatus',
						operator : 'in',
						value1 : tempStatusValue,
						value2 : '',
						dataType : 0,
						displayType :11,
						fieldLabel : getLabel('status','Status'),
						displayValue1 : statusValueDesc.toString()
						
					});
	}
	
	// Amount
	var blnAutoNumeric = true;
	//var amountFrom=$("#loanAmountFieldFrom").val();
	
	blnAutoNumeric = isAutoNumericApplied("amountFieldFrom");
	if (blnAutoNumeric)
		amountFrom = $("#amountFieldFrom").autoNumeric('get');
	else
		amountFrom = $("#amountFieldFrom").val();
	
	if(!Ext.isEmpty(amountFrom)){
		var amountOperator = $("#amountOperator").val();
		blnAutoNumeric = isAutoNumericApplied("amountFieldTo");
		if (blnAutoNumeric)
			amountTo = $("#amountFieldTo").autoNumeric('get');
		else
			amountTo = $("#amountFieldTo").val();

		if (!Ext.isEmpty(amountOperator)) {
			jsonArray.push({
						field : 'Amount',
						operator : amountOperator,							
						value1 : amountFrom,
						value2 : amountTo,
						dataType : 2,
						displayType : 2,
						fieldLabel : getLabel('amount','Amount')
					});
		}
	}
	
	objJson = jsonArray;
	return objJson;
}

function getAdvancedFilterValueJson(FilterCodeVal){
	var jsonArray = [];
	var objJson = {};
	jsonArray = getAdvancedFilterQueryJson();
	objJson.filterBy = jsonArray;
	if (FilterCodeVal && !Ext.isEmpty(FilterCodeVal))
		objJson.filterCode = FilterCodeVal;
	
	return objJson;
}

function saveScreenFilters(){
	var objJson = {"loggedInAs" : selectedFilterLoggerDesc,
			"client" : selectedFilterClient,
			"clientDesc" :selectedFilterClientDesc};
	var strUrl = 'services/userpreferences/creditNoteCenterSavedMode/screenFilters.json';
	Ext.Ajax.request({
		url : Ext.String.format(strUrl),
		method : 'POST',
		jsonData : objJson,
		async : false,
		success : function(response) {
		},
		failure : function() {
		}
	});
}
