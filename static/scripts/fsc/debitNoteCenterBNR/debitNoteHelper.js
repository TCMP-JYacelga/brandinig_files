var DEBIT_NOTE_CENTER_COLUMNS = [{
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
	"colHeader" : getLabel('date', 'Date'),
	"sortable" : true,
	"colSequence" : 2,
	"width" : 150,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
},{
	"colId" : "invoiceAmount",
	"colHeader" : getLabel('amount', 'Amount'),
	"sortable" : true,
	"colSequence" : 3,
	"width" : 150,
	"locked" : false,
	"hidden" : false,
	"hideable" : true,
	"colType" : 'amount'
},{
	"colId" : "subsidiaryDesc",
	"colHeader" : getLabel('subsidiaryDesc', 'Company Name'),
	"sortable" : true,
	"colSequence" : 4,
	"width" : 150,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
},{
	"colId" : "buyerSellerDesc",
	"colHeader" : getLabel('buyerSellerDesc', 'Buyer'),
	"sortable" : true,
	"colSequence" : 5,
	"width" : 150,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
},{
	"colId" : "scmMyProductName",
	"colHeader" : getLabel('package', 'Package'),
	"sortable" : true,
	"colSequence" : 6,
	"width" : 150,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
},{
	"colId" : "requestStateDesc",
	"colHeader" : getLabel('requestStateDesc', 'Status'),
	"sortable" : true,
	"colDesc" : getLabel('status', 'Status'),
	"colSequence" : 7,
	"width" : 150,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}];

var arrDebitNoteStatus = [{
		"code": "4",
		"desc": getLabel("rejected","Rejected")
	},{
		"code": "2",
		"desc": getLabel("formyauth","For My Auth")
	},{
		"code": "1",
		"desc": getLabel("forauth","For Auth")
	},{
		"code": "3",
		"desc": getLabel("forpresentment","For Presentment")
	},{
		"code": "7",
		"desc": getLabel("presented","Presented")
	},{
		"code": "0",
		"desc": getLabel("draft","Draft")
}];

var arrSellerBuyer = [{
	"code": "SELLER",
	"desc": getLabel("seller","Seller")
},{
	"code": "BUYER",
	"desc": getLabel("buyer","Buyer")
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
					fieldLabel : getLabel('lblcompany', 'Company Name'),
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
			dateFilterLabel : selectedEntryDate.dateFilterLabel
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
						fieldLabel : selectedFilterLoggerDesc == "BUYER" ? 'Seller' : 'Buyer',
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
   	if (!Ext.isEmpty(clientCode)) {
        form.appendChild(createFormField('INPUT', 'HIDDEN', 'enteredByClientDesc',
        		clientDesc));
   	}
	form.action = strUrl;
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}

function saveScreenFilters(){
	var objJson = {"loggedInAs" : selectedFilterLoggerDesc, "client" : selectedFilterClient, "clientDesc" :selectedFilterClientDesc};
	var strUrl = 'services/userpreferences/debitNoteCenterSavedMode/screenFilters.json';
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
