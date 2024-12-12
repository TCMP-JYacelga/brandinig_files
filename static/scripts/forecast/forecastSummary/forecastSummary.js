var FORECAST_SUMM_GENERIC_COLUMN_MODEL = [{
			"colId" : "glId",
			"colHeader" : getLabel('accountNo','Account Number'),
			"colSequence" : 1,
			"hidden" : false
		},
		{
			"colId" : "accDesc",
			"colHeader" : getLabel('accountName','Account Name'),
			"colSequence" : 2,
			"hidden" : false
		},
		{
			"colId" : "openingBalance",
			"colHeader" : getLabel('openingBalance','Opening Balance'),
			"colSequence" : 3,
			"hidden" : false
		},
		{
			"colId" : "inFlows",
			"colHeader" : getLabel('totalCredits','Total Credits'),
			"colSequence" : 4,
			"hidden" : false
		},
		{
			"colId" : "outFlows",
			"colHeader" : getLabel('totalDebits','Total Debits'),
			"colSequence" : 5,
			"hidden" : false
		},
		{
			"colId" : "closingBalance",
			"colHeader" : getLabel('closingBalance','Closing Balance'),
			"colSequence" : 6,
			"hidden" : false
		},
		{
			"colId" : "subFacilityDesc",
			"colHeader" : getLabel('accountType','Account Type'),
			"colSequence" : 7,
			"hidden" : false
		},
		{
			"colId" : "clientDesc",
			"colHeader" : getLabel('companyName','Company Name'),
			"colSequence" : 8,
			"hidden" : false
		},
		/*{
			"colId" : "currency",
			"colHeader" : getLabel('currency','Currency'),
			"colSequence" : 10,
			"hidden" : false
		},*/
		{
			"colId" : "bankDesc",
			"colHeader" : getLabel('bankName','Bank Name'),
			"colSequence" : 9,
			"hidden" : true
		},
		{
			"colId" : "branchName",
			"colHeader" : getLabel('branchName','Branch Name'),
			"colSequence" : 10,
			"hidden" : true
		}/*,
		{
			"colId" : "obligationId",
			"colHeader" : getLabel('obligationId','Obligation Id'),
			"colSequence" : 13,
			"hidden" : true
		}*/];

var PERIODIC_SUMM_GENERIC_COLUMN_MODEL = [{
			"colId" : "forecastDate",
			"colHeader" : "Period From",//getLabel('accountNo','Account Number'),
			"colSequence" : 1,
			"locked" : false,
			"hidden" : false,
			"hideable" : false
		},{
			"colId" : "forecastToDate",
			"colHeader" : "Period To",//getLabel('accountNo','Account Number'),
			"colSequence" : 2,
			"locked" : false,
			"hidden" : false,
			"hideable" : false
		},{
			"colId" : "openingBalance",
			"colHeader" : "Opening Balance",//getLabel('accountNo','Account Number'),
			"colSequence" : 3,
			"locked" : false,
			"colType" : "amount",
			"hidden" : false,
			"hideable" : true
		},{
			"colId" : "inFlows",
			"colHeader" : "Total Credits",//getLabel('accountNo','Account Number'),
			"colSequence" : 4,
			"locked" : false,
			"hidden" : false,
			"colType" : "amount",
			"hideable" : true
		},{
			"colId" : "outFlows",
			"colHeader" : "Total Debits",//getLabel('accountNo','Account Number'),
			"colSequence" : 5,
			"locked" : false,
			"hidden" : false,
			"colType" : "amount",
			"hideable" : true
		},{
			"colId" : "closingBalance",
			"colHeader" : "Closing Balance",//getLabel('accountNo','Account Number'),
			"colSequence" : 6,
			"locked" : false,
			"hidden" : false,
			"colType" : "amount",
			"hideable" : true
		},{
			"colId" : "period",
			"colHeader" : "Period Type",//getLabel('accountNo','Account Number'),
			"colSequence" : 7,
			"locked" : false,
			"hidden" : false,
			"hideable" : true
		},{
			"colId" : "glId",
			"colHeader" : "Account Number",//getLabel('accountNo','Account Number'),
			"colSequence" : 8,
			"locked" : false,
			"hidden" : false,
			"hideable" : true
		},{
			"colId" : "subFacilityDesc",
			"colHeader" : "Account Type",//getLabel('accountNo','Account Number'),
			"colSequence" : 9,
			"locked" : false,
			"hidden" : false,
			"hideable" : true
		}];
		
var TRANSACTION_SUMM_GENERIC_COLUMN_MODEL = [{
			"colId" : "forecastDate",
			"colHeader" : "Effective Date",//getLabel('accountNo','Account Number'),
			"colSequence" : 1,
			"hideable" : false,
			"hidden" : false
		},{
			"colId" : "inFlows",
			"colType" : "amount",
			"colHeader" : "Forecast Credit",//getLabel('accountNo','Account Number'),
			"colSequence" : 2,
			"hideable" : false,
			"hidden" : false
		},{
			"colId" : "outFlows",
			"colType" : "amount",
			"colHeader" : "Forecast Debit",//getLabel('accountNo','Account Number'),
			"colSequence" : 3,
			"hideable" : true,
			"hidden" : false
		},{
			"colId" : "settledAmount",
			"colType" : "amount",
			"colHeader" : "Settled Amount",//getLabel('accountNo','Account Number'),
			"colSequence" : 4,
			"hideable" : true,
			"hidden" : false
		},{
			"colId" : "forecastMyProduct",
			"colHeader" : "Package",//getLabel('accountNo','Account Number'),
			"colSequence" : 5,
			"hideable" : true,
			"hidden" : false
		},{
			"colId" : "forecastReference",
			"colHeader" : "Reference",//getLabel('accountNo','Account Number'),
			"colSequence" : 6,
			"hideable" : true,
			"hidden" : false
		},{
			"colId" : "forecastAmount",
			"colType" : "amount",
			"colHeader" : "Transaction Amount",//getLabel('accountNo','Account Number'),
			"colSequence" : 7,
			"hideable" : true,
			"hidden" : false
		},{
			"colId" : "clientDesc",
			"colHeader" : "Company name",//getLabel('accountNo','Account Number'),
			"colSequence" : 8,
			"hideable" : true,
			"hidden" : false
		},/*{
			"colId" : "forecastStatus",
			"colHeader" : "Status",//getLabel('accountNo','Account Number'),
			"colSequence" : 8,
			"hidden" : false
		},*/{
			"colId" : "forecastType",
			"colHeader" : "Forecast Type",//getLabel('accountNo','Account Number'),
			"colSequence" : 9,
			"hideable" : true,
			"hidden" : false
		}];
		
function resetValuesOnClientChange(){
	blnClientSelectionChanged=true;
	selectedClient=$("#dropdownCompany").val();
	if(!isEmpty(selectedClient) && 'all' !=selectedClient)
		selectedClientDesc=$("#dropdownCompany option:selected").text();
	else{
		selectedClient='';
		selectedClientDesc='';
	}
	$("#dropdownAccountNo  option").remove();		
	setAccountNumberItems("#dropdownAccountNo");
	
}
	
function getAdvancedFilterPopup(){
	$('#advancedFilterPopup').dialog({
		autoOpen : false,
		maxHeight: 580,
		minHeight: (screen.width) > 1024 ? 156 : 0 ,
		width : 840,
		dialogClass: 'ft-dialog',
		resizable: false,
		draggable: false,
		title : 'Advanced Filter',
		modal : true,
	open:function(){
      	  hideErrorPanel('#advancedFilterErrorDiv');
      	  $('#advancedFilterPopup').dialog('option', 'position', 'center');
		  
      },
	  focus :function(){
			
	  },
	  close : function(){
	  }
	});
	$('#advancedFilterPopup').dialog("open");
}

function hideErrorPanel(errorDivId){
	if($(errorDivId).is(':visible')){
		$(errorDivId).addClass('ui-helper-hidden');
	}
}

function clearPopup()
{
	hideErrorPanel('#advancedFilterErrorDiv');
	$(document).trigger("resetAllFieldsEvent");
}

function populateAdvancedFilterFieldValue(){
	$("#dropdownAccountNo option").remove();
	setCompanyMenuItems("#dropdownCompany");
	setAccountNumberItems("#dropdownAccountNo");
	setSavedFilterComboItems('#msSavedFilter');
}
function setCompanyMenuItems(elementId){
	$.ajax({
		url : 'services/userseek/userclients.json&$sellerCode='+ strSeller,
		async :false,
		success : function(responseText) {
			$("#dropdownCompany  option").remove();
			responseData=responseText.d.preferences;
			var defaultOpt = $('<option />', {
				value : "all",
				text : getLabel('allCompanies', 'All companies')
				});
			defaultOpt.appendTo(elementId);
			$.each(responseData,function(index,item){
				$(elementId).append($('<option>', { 
					value: responseData[index].CODE,
					text : responseData[index].DESCR
					}));
			});
			filterClientCount=$(elementId+" option").length;
			$(elementId).niceSelect();
		}
		
	});	
}

function setSavedFilterComboItems(element){
	$.ajax({
		url : 'services/userfilterslist/forecastAccountSummary.json',
		success : function(responseText) {
			if(responseText && responseText.d && responseText.d.filters){
				 var responseData=responseText.d.filters;
				 $("#msSavedFilter option").remove();
				 $(element).append('<option value=""> Select </option>');
				 if(responseData.length > 0){
					$.each(responseData,function(index,item){
						$(element).append($('<option>', { 
							value: responseData[index],
							text : responseData[index],
							selected : false
							}));
					});
				 }
			}
			$(element).multiselect('refresh');
		}
		
	});	
}

function handleSavedFilterClick(){
	$(document).trigger("handleSavedFilterClick");
}

function getAdvancedFilterValueJson(FilterCodeVal){
	var jsonArray = [];
	
	//Client code
	var clientCodesData =$("select[id='dropdownCompany']").getMultiSelectValueString(); 	
	var tempCodesData=clientCodesData;
	var selectedCurrencyLabel = $('#dropdownCompany :selected')[0].label;
	if (!Ext.isEmpty(tempCodesData)) {
		if(!Ext.isEmpty(filterClientCount)){
			var clientCodeArray=clientCodesData.split(',');
			if(filterClientCount==clientCodeArray.length)
				tempCodesData='all';
		}
		if(tempCodesData!='all' && clientCodesData != 'All companies'){
		jsonArray.push({
					field : 'clientCode',
					operator : tempCodesData.indexOf(',') === -1 ? 'eq' : 'in',
					value1 : tempCodesData,
					value2 : '',
					dataType : 0,
					displayType : tempCodesData.indexOf(',') === -1 ? 5 : 11,
					fieldLabel : getLabel('lblcompany', 'Company Name'),
					displayValue1 : selectedCurrencyLabel
				});
		}
	}
	
	
	//Currency
	var dropdownCurrencyValue=$("select[id='dropdownCurrency']").val();
	var selectedCurrencyLabel = $('#dropdownCurrency :selected')[0].label;
	var filterCurrencyCount=$("#dropdownCurrency option").length;
	if (!Ext.isEmpty(dropdownCurrencyValue) && !Ext.isEmpty(selectedCurrencyLabel)) {
		jsonArray.push({
					field : 'ccyCode',
					operator : 'eq',
					value1 : dropdownCurrencyValue,
					dataType : 0,
					displayType : 5,
					fieldLabel : getLabel('currency', 'Currency'),
					displayValue1 : dropdownCurrencyValue
				});
	}
	
	//Account Type
	var dropdownAccountTypeValue = $("select[id='dropdownAccountType']").val();
	var selectedAccountTypeLabel = $('#dropdownAccountType :selected')[0].label;
	var filterAccountTypeCount=$("#dropdownAccountType option").length;
	if (!Ext.isEmpty(dropdownAccountTypeValue) && !Ext.isEmpty(selectedAccountTypeLabel)) {
		jsonArray.push({
					field : 'accountType',
					operator : 'eq',
					value1 : dropdownAccountTypeValue,
					dataType : 0,
					displayType : 5,
					fieldLabel : getLabel('accountType', 'Account Type'),
					displayValue1 : selectedAccountTypeLabel
				});
	}
	
	
	//Account Number
	var dropdownAccountNo =$("select[id='dropdownAccountNo']").getMultiSelectValueString(); 	
	var tempAccountNo=dropdownAccountNo;
	if($('#dropdownAccountNo :selected')[0] != undefined)
		var selectedAccountNo = $('#dropdownAccountNo :selected')[0].label;
	else
		var selectedAccountNo = $('#dropdownAccountNo :selected');
	var filterAcountNoCount=$("#dropdownAccountNo option").length;
	if (!Ext.isEmpty(tempAccountNo)) {
		if(!Ext.isEmpty(filterAcountNoCount)){
			var accountNoArray=dropdownAccountNo.split(',');
			if(filterAcountNoCount==accountNoArray.length)
				tempAccountNo='select Account';
		}
		if(tempAccountNo!='select Account' && selectedAccountNo != 'Select Account'){
		jsonArray.push({
					field : 'accountNo',
					/* operator : 'in', */
					operator : tempAccountNo.indexOf(',') === -1 ? 'eq' : 'in',
					value1 : tempAccountNo,
					value2 : '',
					dataType : 0,
					/* displayType : 11,// 6, */
					displayType : tempAccountNo.indexOf(',') === -1 ? 5 : 11,
					fieldLabel : getLabel('accountnumber', 'Account Number'),
					displayValue1 : selectedAccountNo
				});
		}
	}
	
	//Amount
	var txnType = $('input[name=transType]:checked').val();
	var lblField = '', lblFieldLabel = '';
	if(txnType == 'C')
	{
		lblField = 'inFlows';
		lblFieldLabel = getLabel('totalCredits','Total Credits');
	}
	else if(txnType == 'D')
	{
		lblField = 'outFlows';
		lblFieldLabel = getLabel('totalDebits','Total Debits');
	}
	var blnAutoNumeric = true;
	var amountFrom=$("#forecastAmount").val();
	// jquery autoNumeric formatting
	blnAutoNumeric = isAutoNumericApplied("forecastAmount");
	if (blnAutoNumeric)
		amountFrom = $("#forecastAmount").autoNumeric('get');
	else
		amountFrom = $("#forecastAmount").val();
	// jquery autoNumeric formatting
	if(!Ext.isEmpty(amountFrom)){
		var amountOperator = $("#amountOperator").val();
		var amountTo=$("#amountFieldTo").val();
		// jquery autoNumeric formatting
		
		if(txnType == 'A')
		{
			if (!Ext.isEmpty(amountOperator)) {
			jsonArray.push({
						field : "AllTxnType",
						operator : amountOperator,							
						value1 : amountFrom,
						value2 : amountTo,
						dataType : 2,
						displayType :2,// 3,
						fieldLabel : "Cr/Dr Amount"
					});
			}
		}
		else
		{
			if (!Ext.isEmpty(amountOperator)) {
			jsonArray.push({
						field : lblField,
						operator : amountOperator,							
						value1 : amountFrom,
						value2 : amountTo,
						dataType : 2,
						displayType :2,// 3,
						fieldLabel : lblFieldLabel
					});
			}
		}
		
	}
	
	objJson = {};
	objJson.filterBy = jsonArray;
	if (FilterCodeVal && !Ext.isEmpty(FilterCodeVal))
		objJson.filterCode = FilterCodeVal;

	return objJson;	
	
	}

function getAdvancedFilterQueryJson() {
	var objJson = null;
	var jsonArray = [];
	
	//Client code
	var clientCodesData =$("select[id='dropdownCompany']").getMultiSelectValueString(); 	
	var tempCodesData=clientCodesData;
	var selectedCurrencyLabel = $('#dropdownCompany :selected')[0].label;
	if (!Ext.isEmpty(tempCodesData)) {
		if(!Ext.isEmpty(filterClientCount)){
			var clientCodeArray=clientCodesData.split(',');
			if(filterClientCount==clientCodeArray.length)
				tempCodesData='all';
		}
		if(tempCodesData!='all' && clientCodesData != 'All companies'){
		jsonArray.push({
					field : 'clientCode',
					operator : tempCodesData.indexOf(',') === -1 ? 'eq' : 'in',
					value1 : tempCodesData,
					value2 : '',
					dataType : 0,
					displayType : tempCodesData.indexOf(',') === -1 ? 5 : 11,
					fieldLabel : getLabel('lblcompany', 'Company Name'),
					displayValue1 : selectedCurrencyLabel
				});
		}
	}
	
	
	//Currency
	var dropdownCurrencyValue=$("select[id='dropdownCurrency']").val();
	var selectedCurrencyLabel = $('#dropdownCurrency :selected')[0].label;
	var filterCurrencyCount=$("#dropdownCurrency option").length;
	if (!Ext.isEmpty(dropdownCurrencyValue) && !Ext.isEmpty(selectedCurrencyLabel)) {
		jsonArray.push({
					field : 'ccyCode',
					operator : 'eq',
					value1 : dropdownCurrencyValue,
					dataType : 0,
					displayType : 5,
					fieldLabel : getLabel('currency', 'Currency'),
					displayValue1 : dropdownCurrencyValue
				});
	}
	
	//Account Type
	var dropdownAccountTypeValue = $("select[id='dropdownAccountType']").val();
	var selectedAccountTypeLabel = $('#dropdownAccountType :selected')[0].label;
	var filterAccountTypeCount=$("#dropdownAccountType option").length;
	if (!Ext.isEmpty(dropdownAccountTypeValue) && !Ext.isEmpty(selectedAccountTypeLabel)) {
		jsonArray.push({
					field : 'accountType',
					operator : 'eq',
					value1 : dropdownAccountTypeValue,
					dataType : 0,
					displayType : 5,
					fieldLabel : getLabel('accountType', 'Account Type'),
					displayValue1 : selectedAccountTypeLabel
				});
	}
	
	
	//Account Number
	var dropdownAccountNo =$("select[id='dropdownAccountNo']").getMultiSelectValueString(); 	
	var tempAccountNo=dropdownAccountNo;
	if($('#dropdownAccountNo :selected')[0] != undefined)
		var selectedAccountNo = $('#dropdownAccountNo :selected')[0].label;
	else
		var selectedAccountNo = $('#dropdownAccountNo :selected');
	var filterAcountNoCount=$("#dropdownAccountNo option").length;
	if (!Ext.isEmpty(tempAccountNo)) {
		if(!Ext.isEmpty(filterAcountNoCount)){
			var accountNoArray=dropdownAccountNo.split(',');
			if(filterAcountNoCount==accountNoArray.length)
				tempAccountNo='select Account';
		}
		if(tempAccountNo!='select Account' && selectedAccountNo != 'Select Account'){
		jsonArray.push({
					field : 'accountNo',
					/* operator : 'in', */
					operator : tempAccountNo.indexOf(',') === -1 ? 'eq' : 'in',
					value1 : tempAccountNo,
					value2 : '',
					dataType : 0,
					/* displayType : 11,// 6, */
					displayType : tempAccountNo.indexOf(',') === -1 ? 5 : 11,
					fieldLabel : getLabel('accountNumber', 'Account Number'),
					displayValue1 : selectedAccountNo
				});
		}
	}
	
	//Amount
	var txnType = $('input[name=transType]:checked').val();
	var lblField = '', lblFieldLabel = '';
	if(txnType == 'C')
	{
		lblField = 'inFlows';
		lblFieldLabel = getLabel('totalCredits','Total Credits');
	}
	else if(txnType == 'D')
	{
		lblField = 'outFlows';
		lblFieldLabel = getLabel('totalDebits','Total Debits');
	}
	var blnAutoNumeric = true;
	var amountFrom=$("#forecastAmount").val();
	// jquery autoNumeric formatting
	blnAutoNumeric = isAutoNumericApplied("forecastAmount");
	if (blnAutoNumeric)
		amountFrom = $("#forecastAmount").autoNumeric('get');
	else
		amountFrom = $("#forecastAmount").val();
	// jquery autoNumeric formatting
	if(!Ext.isEmpty(amountFrom)){
		var amountOperator = $("#amountOperator").val();
		var amountTo=$("#amountFieldTo").val();
		// jquery autoNumeric formatting
		
		if(txnType == 'A')
		{
			if (!Ext.isEmpty(amountOperator)) {
			jsonArray.push({
						field : "AllTxnType",
						operator : amountOperator,							
						value1 : amountFrom,
						value2 : amountTo,
						dataType : 2,
						displayType :2,// 3,
						fieldLabel : "Cr/Dr Amount"
					});
			}
		}
		else
		{
			if (!Ext.isEmpty(amountOperator)) {
			jsonArray.push({
						field : lblField,
						operator : amountOperator,							
						value1 : amountFrom,
						value2 : amountTo,
						dataType : 2,
						displayType :2,// 3,
						fieldLabel : lblFieldLabel
					});
			}
		}
		
	}
	
	
	objJson = jsonArray;
	return objJson;
}
function setAccountNumberItems(elementId){
	if (Ext.isEmpty($("#dropdownAccountType").val())) {
			selectedAccType = '%'
		}
	else
		selectedAccType = $("#dropdownAccountType").val()
	$.ajax({
		url : 'services/userseek/forecastSummAccountsSeek.json',
		data: { 
			$sellerCode: strSeller,
			$filtercode1: selectedClient,
			$filtercode2: selectedAccType 
		},
		async : false,
		success : function(responseText) {
			$("#dropdownAccountNo  option").remove();
			var responseData=responseText.d.preferences;
			var defaultOpt = $('<option />', {
				value : "",
				text : getLabel('selectAccount', 'Select Account Number')
				});
			defaultOpt.appendTo(elementId);
			$.each(responseData,function(index,item){
				$(elementId).append($('<option>', { 
					value: responseData[index].ACCT_NMBR,
					text : responseData[index].DISPLAYFIELD 
					}));
			});
			filterAccCount=$(elementId+" option").length;
			$(elementId).niceSelect();
			$('#dropdownAccountNo').niceSelect('update');
		}
		
	});	
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
function handleAmountOperatorChange(me){
	var selectedAmountOperator=$("#amountOperator").val();
	if(selectedAmountOperator=='bt'){
		$(".amountTo").removeClass("hidden");
		$("#amountFieldTo").removeClass("hidden");
		$("#amountLabel").text(getLabel("amountFrom","Amount From"));
	}else{
		$(".amountTo").addClass("hidden");
		$("#amountLabel").text(getLabel("amount","Amount"));
	}
}

function resetValuesOnAccTypeChange(){
	
	$("#dropdownAccountNo  option").remove();		
	setAccountNumberItems("#dropdownAccountNo");
	
}