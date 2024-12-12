function getLabel(key, defaultText) {
	return (tranSearchLabelsMap && !Ext.isEmpty(tranSearchLabelsMap[key]))
			? tranSearchLabelsMap[key]
			: defaultText
}
var accountLabel = "";
var mapService = {
		'SUBFAC0101' : 'BR_STDVIEW_SUBFAC_SAVING',
		'SUBFAC0102' : 'BR_STDVIEW_SUBFAC_CURRENT',
		'SUBFAC0103' : 'BR_STDVIEW_SUBFAC_CRDCARD',
		'SUBFAC0104' : 'BR_STDVIEW_SUBFAC_CALL',
		'SUBFAC0105' : 'BR_STDVIEW_SUBFAC_ESCROW',
		'SUBFAC0106' : 'BR_STDVIEW_SUBFAC_COLLECTION',
		'SUBFAC0107' : 'BR_STDVIEW_SUBFAC_MONEY',
		'SUBFAC0108' : 'BR_STDVIEW_SUBFAC_CHECKING',
		'SUBFAC0301' : 'BR_STDVIEW_SUBFAC_LOAN',
		'SUBFAC0303' : 'BR_STDVIEW_SUBFAC_TERMLOAN',
		'SUBFAC0404' : 'BR_STDVIEW_SUBFAC_TERMDEPOSITS',
		'SUBFAC0405' : 'BR_STDVIEW_SUBFAC_DEPOSIT',
		'SUBFAC0406' : 'BR_STDVIEW_SUBFAC_CERTIFICATEDEPOSITS',
		'SUBFAC0801' : 'BR_STDVIEW_SUBFAC_FUND',
		'CURRENCY' : 'BR_STDVIEW_CURRENCY',
		'BANK' : 'BR_STDVIEW_BANK',
		'GROUP' : 'BR_STDVIEW_GROUP',
		'TXNCAT' : 'BR_GRIDVIEW_GENERIC',
		'GENERIC' : 'BR_GRIDVIEW_GENERIC',
		'SUMMARYRIBBON' : 'BR_SUMMARY_RIBBON',
		'SERVICE_ACTIVITY' : 'BR_ACTIVITY',
		'SERVICE_HISTORY' : 'BR_HISTORY',
		'BR_STD_SUMM_GRID' : 'BR_STD_SUMM_GRID',
		'BR_GRIDVIEW_GENERIC' : 'BR_GRIDVIEW_GENERIC',
		'BR_STD_ACT_GRID' : 'BR_STD_ACT_GRID',
		'BR_STD_ACT_RIBBON' : 'BR_STD_ACT_RIBBON',
		'BR_STD_BAL_GRID' : 'BR_STD_BAL_GRID',
		'BR_STD_BAL_RIBBON' : 'BR_STD_BAL_RIBBON',
		'BR_RIBBON_GENERIC' : 'BR_RIBBON_GENERIC',
		'loanSubFacility' : 'SUBFAC0306',
		'BR_TXN_SRC_GRID' : 'BR_TXN_SRC_GRID'
};

var arrDownloadReportColumn = {
		'accountNo' : 'accountNo',
		'accountName' : 'accountName',
		'postingDate' : 'postingDate',
		'typeCodeDesc' : 'typeCodeDesc',
		'customerRefNo' : 'customerRefNo',
		'creditUnit' : 'creditUnit',
		'debitUnit' : 'debitUnit',
		'valueDate' : 'valueDate',
		'text' : 'text',
		'noteText' : 'noteText',
		'typeCode' : 'typeCode',
		'dataSource' : 'dataSource',
		'runningLegBalance' : 'runningLegBalance',
		'bankRef' : 'bankRef'
	};

var accountId = null;
var posting_date_opt = null;
var value_date_opt = null;
var allAccountsSelected = true;
var allAccountTypesSelected = true;

/*Advance Filter Popup handling:start*/
function showTransAdvanceFilterPopup() {
	$('#advFilterPopup').dialog({
		autoOpen : false,
		maxHeight: 650,
		minHeight:(screen.width) > 1024 ? 156 : 0,
		width : 840,
		modal : true,
		resizable: false,
		draggable: false,
		dialogClass : 'ft-dialog',
		title : getLabel('advancedFilter', 'Advanced Filter'),
	/*	buttons : [{
			id : 'advFltrSearch',
			text : 'Search',
			click : function() {
				hideErrorPanel('#advancedFltrErrorDiv');
				$(document).trigger("searchActionClicked");
				$(this).dialog("close");
			}
		},{
			id : 'advFltrSaveAndSearch',
			text : 'Save And Search',
			click : function() {
				hideErrorPanel('#advancedFltrErrorDiv');
				$(document).trigger("saveAndSearchActionClicked");
			}
		 }, {
			id : 'advFltrCancel',
			text : 'Cancel',
			click : function() {
				$(this).dialog("close");
			}
		}],*/
		/*open : function() {
		//	$('#advFilterList').empty();
			$('#amountDropDown').empty();
			$('#postingDateDropDown').empty();
			$('#valueDateDropDown').empty();
			$('#accountTypeDropDown').empty();
			//$('#accountRadio').empty();
			$('#typeCodeSet').empty();
			$('#msSortBy1').empty();
			$('#msSortBy2').empty();
			$('#msSortBy3').empty();
				$("#advFltrtabs").tabs({
					select : function(event, tab) {
						if (tab.index == 0) {
							if (!$('#advancedFltrErrorDiv')
									.hasClass('ui-helper-hidden')) {
								$('#advancedFltrErrorDiv')
										.addClass('ui-helper-hidden');
							}
							$('#advFltrSearch').hide();
							//$('#advFltrSaveAndSearch').hide();
							$('#advFltrCancel').hide();
							$('#btnClear').hide();
							//$('#advFltrClose').show();
							$('#advFilterPopup').dialog('option','position','center');
						} else {
							$('#advFltrSearch').show();
							//$('#advFltrSaveAndSearch').show();
							$('#advFltrCancel').show();
							$('#btnClear').show();
							//$('#advFltrClose').hide();
							$('#advFilterPopup').dialog('option','position','center');
						}
					},
					show : function(e, ui) {
						if('undefined'!=filterGrid && !isEmpty(filterGrid))
							filterGrid.getView().refresh();
						$('#advFilterPopup').dialog('option','position','center');
					}
				});
				$("#advFltrtabs").barTabs();
				setAmountDropDown("amountDropDown");
				setProcessingDateDropDownMenu("postingDateDropDown");
				setValueDateDropDownMenu("valueDateDropDown");
				setSavedFilterComboItems('#msSavedFilter');
				$("#typeCodeSet").append($('<option />', {
					value : "",
					text : "All"
					}));
				setTypeCodeSetValues("typeCodeSet");
				setSortByMenuItems("#msSortBy1",arrSortByFields);
				$("#msSortBy2").append($('<option />', {
					value : "None",
					text : "None"
					}));
				$("#msSortBy3").append($('<option />', {
					value : "None",
					text : "None"
					}));
				$('#msSortBy2').attr('disabled',true);
				$('#msSortBy3').attr('disabled',true);
				setRadioGroupValues("#accountRadio");				
				addAccountType("#accTyp");
				$(document).trigger("resetAllFieldsEvent");			
				//filterGrid = createTranSearchAdvFilterGrid();
			//	var tabIndexForSelection = filterGrid.store.count() > 0 ? 0 : 1;
			//	changeAdvancedFltrTab(tabIndexForSelection);
				advancedFilterFieldsDataAdded = true;
				$('#advFilterPopup').dialog('option','position','center');
		}*/
		open:function(){
      	  hideErrorPanel('#advancedFilterErrorDiv');
      	  $('#saveFilterChkBox').prop('checked', false);
		  $('#savedFilterlbl').removeClass('required');
		  $('#filterCode').removeClass('requiredField');
      	  $('#amountOperator').niceSelect();
      	  $('#amountOperator').niceSelect('update');
	  makeNiceSelect('msSortBy1');
          makeNiceSelect('msSortBy2');
          makeNiceSelect('msSortBy3');
      	 	 $('#advFilterPopup').dialog('option', 'position', 'center');
     	 },
		  focus :function(){
			/* if(!isEmpty(selectedClient))
				$("#msClient").val(selectedClient); */
	 	 },
	  		close : function(){
	 	 }
	});
	$('#advFilterPopup').dialog("open");
}

function populateAdvancedFilterFieldValue(){
				setSavedFilterComboItems('#msSavedFilter');
				/*$("#typeCodeSet").append($('<option />', {
					value : "",
					text : "All"
					}));*/
				setTypeCodeSetValues('#typeCodeSet');
				setProcessingDateDropDownMenu("postingDateDropDown");
				//setValueDateDropDownMenu("valueDateDropDown");
				//setAmountDropDown("amountDropDown");
				setSortByMenuItems("#msSortBy1",arrSortByFields);
				$("#msSortBy2").append($('<option />', {
					value : "None",
					text : getLabel("none", "None")
					}));
				$("#msSortBy3").append($('<option />', {
					value : "None",
					text : getLabel("none", "None")
					}));
				$('#msSortBy2').attr('disabled',true);
				$('#msSortBy3').attr('disabled',true);
				makeNiceSelect('msSortBy1');
				makeNiceSelect('msSortBy2');
				makeNiceSelect('msSortBy3');
				addAccountType("#accTyp");
				setDataToAutoComp();
}

function setSavedFilterComboItems(element){
	$.ajax({
		url : 'services/userfilterslist/tranSearchSummary.json',
		 async : false,
		success : function(responseText) {
			if(responseText && responseText.d && responseText.d.filters){
				 var responseData=responseText.d.filters;
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

function addAccountType(elementId){
		var me = this;
		
			Ext.Ajax.request({
						url : 'services/userseek/accountTypeSeek.json',
						method : 'POST',
						async : false,
						success : function(response) {
							var responseData = Ext
									.decode(response.responseText);
							var data = responseData.d.preferences;
							$(elementId+' option').remove();
							var el = $(elementId).multiselect();
							    el.attr('multiple',true);
							for (var index = 0; index < data.length; index++) {
								var opt = $('<option />', {
											value : data[index].SUB_FACILITY_CODE,
											text : getLabel(data[index].SUB_FACILITY_CODE,data[index].SUB_FACILITY_DESC)
										});
									opt.attr('selected','selected');
									opt.appendTo( el );	
							}
							el.multiselect('refresh');
							filterAccTypeCount=data.length
						},
						failure : function() {
							// console.log("Error Occured - Addition Failed");

						}

					});
			setDataToAutoComp();
	}
	
function setDataToAutoComp(){

	var url = 'services/transcationSearch/btruseraccounts.json';
	var elementId = '#accAutoComp';
	var tranAccount = 0;
		
	Ext.Ajax.request({
		url :url,
		params : {$subFaciltyCodes:$("#accTyp").getMultiSelectValueString()},
		method : 'POST',
		async : false,
		success : function(response) {
			var responseData = Ext.decode(response.responseText);
			var data = responseData.d.btruseraccount;
			$(elementId+' option').remove();
			var el = $(elementId).multiselect();
			el.attr('multiple',true);
			for (var index = 0; index < data.length; index++) {
			var brGranularFlag = data[index].brGranularFlag;	
				var	txnSearchGranularFlag = data[index].txnSearchGranularFlag;
				if(brGranularFlag == 'Y'){
					if(txnSearchGranularFlag === 'Y'){
						tranAccount = tranAccount + 1;
						var opt = $('<option />', {
							value : data[index].accountId,
							text : data[index].accountName +" | "+data[index].accountNumber
						});
						opt.attr('selected','selected');
						opt.appendTo( el );	
					}
				}else{
						tranAccount = tranAccount + 1;
						var opt = $('<option />', {
							value : data[index].accountId,
							text : data[index].accountName +" | "+data[index].accountNumber
						});
						opt.attr('selected','selected');
						opt.appendTo( el );	
					}
			}
			el.multiselect('refresh');
			filterAccNoCount = tranAccount;
			if(!Ext.isEmpty(widgetFilterUrl) && !Ext.isEmpty(strWidgetAccounts)){
				$(document).trigger("triggercheckUnCheckMenuItems",
							['account',strWidgetAccounts]);
				$(document).trigger("triggerSetDataForFilter");
			}
			
		},
		failure : function() {
			// console.log("Error Occured - Addition Failed");

		}

	});
}
function changeAdvancedFltrTab(index) {
	if (index == 0) {
		$('#advFltrSearch').hide();
		$('#advFltrSaveAndSearch').hide();
		$('#advFltrCancel').hide();
		$('#btnClear').hide();
	} else {
		$('#advFltrSearch').show();
		$('#advFltrSaveAndSearch').show();
		$('#advFltrCancel').show();
		$('#btnClear').show();
	}
	$('#advFltrtabs').tabs("option", "selected", index);
}

function showFilterSeqAsPerPref(originalFilterOrder,filterGridStore) {
	var records = [];
	Ext.Ajax.request({
		url : 'services/userpreferences/btrSummaryActNewUX/advanceFilterPrefsOrder.json',
		async : false,
		method : "GET",
		success : function(response) {
			if (!Ext.isEmpty(response.responseText)) {
				var responseData = Ext.decode(response.responseText);
				
				if (responseData && responseData.preference) {
					var filtersObj = JSON.parse(responseData.preference);
					var filterNames = filtersObj.filters;
					if(Ext.isEmpty(filterNames)&&originalFilterOrder.length>0){
						filterNames=originalFilterOrder;
						for(var i=0;i<filterNames.length;i++){
							records.push({
								'filterName' : filterNames[i]
							});
						}
						filterGridStore.loadData(records);
					}
					else if (!Ext.isEmpty(filterNames)) {
						for (var i = 0; i < filterNames.length; i++) {
							var recPosition = $.inArray(filterNames[i], originalFilterOrder);
							if (recPosition > -1) {
								records.push({
									'filterName' : filterNames[i]
									});
								originalFilterOrder.splice(recPosition,1);		
							}
							
						}
						for (var i = 0; i < originalFilterOrder.length; i++) {
							records.push({
										'filterName' : originalFilterOrder[i]
									});
						}	
						filterGridStore.loadData(records);
					}
				}
			}
			else{
				for (var i = 0; i < originalFilterOrder.length; i++) {
							records.push({
										'filterName' : originalFilterOrder[i]
									});
						}	
						filterGridStore.loadData(records);
			}
		},
		failure : function(response) {
			// console.log('Error Occured');
		}
	});
}
function tranSearchAdvFilterGridStore() {
	var myNewStore = Ext.create('Ext.data.Store', {
							fields : ['filterName'],
							data:[]
						});
	Ext.Ajax.request({
				url : 'services/userfilterslist/tranSearchSummary.json',
				async : false,
				method : "GET",
				success : function(response) {
					if (!Ext.isEmpty(response.responseText)) {
						var responseData = Ext.decode(response.responseText);
						if (responseData && responseData.d.filters) {
							var arrRecords = responseData.d.filters;
							showFilterSeqAsPerPref(arrRecords,myNewStore);
						}
					}
				}
			});
	return myNewStore;
}
function getAdvancedFilterSortByJson(){
	var objJson = null;
	var jsonArray = [];

	// Sort By
	var sortByCombo = $("select[id='msSortBy1']").val();
	var sortByOption = getSortByAscendingDescendingText('#sortBy1AscDescLabel');
	if (!Ext.isEmpty(sortByCombo) && sortByCombo !== "None") {
		jsonArray.push({
					field : 'SortBy',
					operator : 'st',
					value1 : sortByCombo,
					value2 : sortByOption,
					dataType : 0,
					displayType : 6
				});
	}

	// First Then Sort By
	var firstThenSortByCombo = $("select[id='msSortBy2']").val();
	var firstThenSortByOption = getSortByAscendingDescendingText('#sortBy2AscDescLabel');
	if (!Ext.isEmpty(firstThenSortByCombo)
			&& firstThenSortByCombo !== "None") {
		jsonArray.push({
					field : 'FirstThenSortBy',
					operator : 'st',
					value1 : firstThenSortByCombo,
					value2 : firstThenSortByOption,
					dataType : 0,
					displayType : 6
				});
	}

	// Second Then Sort By
	var secondThenSortByCombo = $("select[id='msSortBy3']").val();
	var secondThenSortByOption =getSortByAscendingDescendingText('#sortBy3AscDescLabel'); 
	if (!Ext.isEmpty(secondThenSortByCombo)
			&& secondThenSortByCombo !== "None") {
		jsonArray.push({
					field : 'SecondThenSortBy',
					operator : 'st',
					value1 : secondThenSortByCombo,
					value2 : secondThenSortByOption,
					dataType : 0,
					displayType : 6
				});
	}
	
	objJson = jsonArray;
	return objJson;
}
function getSortByAscendingDescendingText(elementId){
	var labelText=$(elementId).text().trim();
	if(labelText==getLabel("ascending", "Ascending")){
		return 'asc';
	}else if(labelText==getLabel("descending","Descending")){
		return 'desc';
	}
}
function getAdvancedFilterQueryJson()
{
	var objJson = null;
	var jsonArray = [];
	
	// Debit Flag
	var debitCreditCheckedVal = '';
	var debitCreditCheckedDesc ='';
	var debitChecked  = $("input[type='checkbox'][id='debitCheckBox']").is(':checked');
	var creditChecked = $("input[type='checkbox'][id='creditCheckBox']").is(':checked');

	if(debitChecked === true && creditChecked === true)
	{
		debitCreditCheckedVal = 'D,C';
		debitCreditCheckedDesc = getLabel('debit', 'Debit')+" , "+getLabel('credit', 'Credit');
		jsonArray.push({
            field : 'debitCreditFlag',
            operator : 'in',
            value1 : debitCreditCheckedVal,
            value2 : '',
            dataType : 0,
            paramFieldLable : getLabel('transType', 'Transaction Type'),
            displayType : 5,
            displayValue1 : debitCreditCheckedDesc,
            displayValue2 : ''
        });
	}
	else if(debitChecked === true)
	{
		debitCreditCheckedVal = 'D';
		debitCreditCheckedDesc =  getLabel('debit', 'Debit');
		jsonArray.push({
            field : 'debitFlag',
            operator : 'eq',
            value1 : debitCreditCheckedVal,
            value2 : '',
            dataType : 0,
            paramFieldLable : getLabel('transType', 'Transaction Type'),
            displayType : 5,
            displayValue1 : debitCreditCheckedDesc,
            displayValue2 : ''
        });
		
	}
	else if(creditChecked === true)
	{
		debitCreditCheckedVal = 'C';
		debitCreditCheckedDesc = getLabel('credit', 'Credit');
		jsonArray.push({
            field : 'creditFlag',
            operator : 'eq',
            value1 : debitCreditCheckedVal,
            value2 : '',
            dataType : 0,
            paramFieldLable : getLabel('transType', 'Transaction Type'),
            displayType : 5,
            displayValue1 : debitCreditCheckedDesc,
            displayValue2 : ''
        });
		
	}
	
	//Account Type 
		var accountTypeValue=$("select[id='accTyp']").getMultiSelectValue();
		var accountTypeValueDesc = [];
		$('#accTyp :selected').each(function(i, selected){
			accountTypeValueDesc[i] = $(selected).text();
		});
		accountTypeValueDesc = accountTypeValueDesc.join(',');
		var accountTypeValueString = accountTypeValue.join(',');
			if (!Ext.isEmpty(accountTypeValueString)) {
				if(!Ext.isEmpty(filterAccTypeCount)){
					var accTypeValueArray=accountTypeValueString.split(',');
					if(filterAccTypeCount==accTypeValueArray.length){
						accountTypeValueString='All';
						allAccountTypesSelected = true;
					}else{
						allAccountTypesSelected = false;
					}	
				}
			if(!(accountTypeValueString=='All')){
				jsonArray.push({
							field : 'subFacilityCode',
							operator : 'in',
							value1 : encodeURIComponent(accountTypeValueString.replace(new RegExp("'", 'g'), "\''")),
							value2 : '',
							dataType : 0,
							displayType : 4,
							paramFieldLable : getLabel('accountType', 'Account Type'),
							displayValue1 : accountTypeValueDesc.toString(),
							displayValue2 : ''
						});
			}
		}
	// Posted/Expected Txns Flag
		var expectedPostedCheckedVal = '';
		var expectedPostedCheckedDesc = '';
		var postedChecked  = $("input[type='checkbox'][id='postedTxnsCheckBox']").is(':checked');
		var expectedChecked = $("input[type='checkbox'][id='expectedTxnsCheckBox']").is(':checked');

		if(postedChecked === true && expectedChecked === true)
		{
			expectedPostedCheckedVal = 'P,E';
			expectedPostedCheckedDesc = getLabel('postedtxn', 'Posted Transactions')+' , '
			+getLabel('expectedtxn', 'Expected Transactions');
		}
		else if(postedChecked === true)
		{
			expectedPostedCheckedVal = 'P';
			expectedPostedCheckedDesc = getLabel('postedtxn', 'Posted Transactions');
	
		}
		else if(expectedChecked === true)
		{
			expectedPostedCheckedVal = 'E';
			expectedPostedCheckedDesc = getLabel('expectedtxn', 'Expected Transactions');
	
		}
		if (!Ext.isEmpty(expectedPostedCheckedVal)) {
				jsonArray.push({
							field : 'postedExpectedFlag',
							operator : 'in',
							value1 : expectedPostedCheckedVal,
							value2 : '',
							dataType : 0,
							displayType : 6,
							paramFieldLable : getLabel('trans', 'Transactions'),
							displayValue1 : expectedPostedCheckedDesc
						});
			}
		
	
	// PostingDate
	if(!jQuery.isEmptyObject(selectedPostingDate)){
		jsonArray.push({
					field : 'postingDate',
					operator : selectedPostingDate.operator,
					paramIsMandatory : true,
					value1 : Ext.Date.format(new Date(Ext.Date.parse(selectedPostingDate.fromDate, strExtApplicationDateFormat)), 'Y-m-d'),
					value2 : (!Ext.isEmpty( selectedPostingDate.toDate))? Ext.Date.format(new Date(Ext.Date.parse(selectedPostingDate.toDate, strExtApplicationDateFormat)), 'Y-m-d'): '',
					dataType : 1,
					displayType : 5,
					displayValue1 : selectedPostingDate.fromDate,
					paramFieldLable : getLabel('postingDate', 'Posting Date'),
					dropdownLabel : selectedPostingDate.dateLabel,
					dateIndex : selectedPostingDate.dateIndex
				});
		}
	
	// Value Date	
	if(!jQuery.isEmptyObject(selectedValueDate)){
			jsonArray.push({
						field : 'valueDate',
						operator : selectedValueDate.operator,
						value1 : Ext.Date.format(new Date(Ext.Date.parse(selectedValueDate.fromDate, strExtApplicationDateFormat)), 'Y-m-d'),
						value2 : (!Ext.isEmpty( selectedValueDate.toDate))? Ext.Date.format(new Date(Ext.Date.parse(selectedValueDate.toDate, strExtApplicationDateFormat)), 'Y-m-d'): '',
						dataType : 1,
						displayType : 5,
						displayValue1 : selectedValueDate.fromDate,
						paramFieldLable : getLabel('valueDate', 'Value Date'),
						dropdownLabel : selectedValueDate.dateLabel
					});
	}
	
	// Type Code
	var typeCode = $("input[type='text'][id='typeCode']").val();
		if (!Ext.isEmpty(typeCode) && typeCode !== 'Select') {
		jsonArray.push({
						field : 'typeCode',
						operator : 'eq',
						value1 : encodeURIComponent(typeCode.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0,
						paramFieldLable : getLabel('typeCode', 'Type Code'),
						displayType : 5,
						displayValue1 : typeCode
					});
	}
	// account number
	var accNumbers = $("select[id='accAutoComp']").getMultiSelectValue();
	var accNumberDesc =[];
	var accNumberDescArr = [];
	var accNumberArr =[];
	$('#accAutoComp :selected').each(function(i, selected){
		accNumberDesc[i] = $(selected).text();
		accNumberDescArr = accNumberDesc[i].split('|');
		accNumberArr[i] = accNumberDescArr[1];
	});
	accNumberArr = accNumberArr.join(',');
	var accountNoValueString=accNumbers.join(',');
	if (!Ext.isEmpty(accountNoValueString)) {
		if(!Ext.isEmpty(filterAccNoCount)){
			var tempAccountNumbersValue = "";
			var accountNoValueArray=accountNoValueString.split(',');
			tempAccountNumbersValue=accountNoValueString;
			if(filterAccNoCount == accountNoValueArray.length){
				allAccountsSelected = true;
			}else {
				allAccountsSelected = false;
			}
			
		}
		if (!Ext.isEmpty(tempAccountNumbersValue) && !Ext.isEmpty(accNumberArr) && !allAccountsSelected) {
			
			jsonArray.push({
							field : 'accountId',
							operator : 'in',
							value1 : tempAccountNumbersValue,
							value2 : '',
							dataType : 0,
							displayType : 6,
							paramFieldLable : getLabel('accountNo', 'Account'),
							displayValue1 : accNumberArr.toString()
							
						});
		}
	}
	// Type Code Set
	var typeCodeSet = $("select[id='typeCodeSet']").getMultiSelectValueString();
    var typeCodeSetText = $("#typeCodeSet option:selected").text();
    if (!Ext.isEmpty(typeCodeSet) && !Ext.isEmpty(typeCodeSetText) && typeCodeSetText !== 'all' && typeCodeSet !== 'all') {
        jsonArray.push({
            field : 'typeCodeSet',
            operator : 'eq',
            value1 : encodeURIComponent(typeCodeSet.replace(new RegExp("'", 'g'), "\''")),
            value2 : typeCodeSetText,
            dataType : 'S',
            displayType : 6,
            fieldLabel : getLabel('typeCodeset', 'Saved Type Code Set'),
            displayValue1 : encodeURIComponent(typeCodeSet.replace(new RegExp("'", 'g'), "\''")),
            displayValue2 : ''
        });
    }
	
	// Bank Reference
	var bankReference = $("input[type='text'][id='bankReference']").val();
		if (!Ext.isEmpty(bankReference)) {
			jsonArray.push({
						field : 'bankReference',
						operator : 'lk',
						value1 : encodeURIComponent(bankReference.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0,
						displayType : 5,
						 paramFieldLable : getLabel('bankReference', 'Bank Reference'),
						 displayValue1 : bankReference
						
					});
		}
		
	// Customer Reference
	var customerReference = $("input[type='text'][id='customerReference']").val();
		if (!Ext.isEmpty(customerReference)) {
			jsonArray.push({
						field : 'customerReference',
						operator : 'lk',
						value1 : encodeURIComponent(customerReference.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0,
						displayType : 5,
						 paramFieldLable :getLabel('customerReference', 'Customer Reference'),
						 displayValue1 : customerReference
						
					});
		}
	// Notes
	var notes = $("input[type='text'][id='notes']").val();
		if (!Ext.isEmpty(notes)) {
		jsonArray.push({
						field : 'noteText',
						operator : 'lk',
						value1 : encodeURIComponent(notes.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0,
						displayType : 5,
						 paramFieldLable : getLabel('notes', 'Notes'),
						 displayValue1 : notes
					});
	}
	
	// Amount
	var amount = $("input[type='text'][id='amountField']").val();
	var amountTo = $("input[type='text'][id='amountFieldTo']").val();
	if(!jQuery.isEmptyObject(amount))
		amount = amount.split(',').join('');
	
	if(!jQuery.isEmptyObject(amountTo))
		amountTo = amountTo.split(',').join('');
	
	if(!jQuery.isEmptyObject(amount)){
	     if (!Ext.isEmpty(amount)) {
			jsonArray.push({
						field : 'amount',
						operator : jQuery.isEmptyObject(selectedAmountType) ? 'eq' : selectedAmountType.operator,
						value1 : amount,
						value2 : amountTo,
						dataType : 2,
						displayType : 3,
						paramFieldLable :getLabel('amount', 'Amount'),
						displayValue1 : amount
					});
		}
	}
	
	// Has Image Flag
	var hasImageCheckedVal = '';
	var hasImageDesc ='';
	var hasImageChecked = $("input[type='checkbox'][id='hasImageCheckBox']").is(':checked');
	if (hasImageChecked === true){
		hasImageCheckedVal = 'Y';
		hasImageDesc ='True';
	}
	else{
		hasImageCheckedVal = 'N';
		hasImageDesc ='False';
	}
	if (!Ext.isEmpty(hasImageCheckedVal) && hasImageCheckedVal == 'Y') {
		jsonArray.push({
					field : 'hasImageFlag',
					operator : 'eq',
					value1 : hasImageCheckedVal,
					value2 : '',
					dataType : 0,
					displayType : 12,
					paramFieldLable : getLabel('hasImage', 'Has Image'),
					displayValue1 : hasImageDesc
				});
	}
	
	// has Attachment Flag
	var hasAttachmentCheckedVal = '';
	var hasAttachmentDesc ='';
	var hasAttachmentChecked = $("input[type='checkbox'][id='hasAttachmentCheckBox']").is(':checked');
	if (hasAttachmentChecked){
		hasAttachmentCheckedVal = 'Y';
		hasAttachmentDesc ='True';
	}
	else{
		hasAttachmentCheckedVal = 'N';
	}
	if (!Ext.isEmpty(hasAttachmentCheckedVal) && hasAttachmentCheckedVal == 'Y') {
		jsonArray.push({
					field : 'hasAttachmentFlag',
					operator : 'eq',
					value1 : hasAttachmentCheckedVal,
					value2 : '',
					dataType : 0,
					displayType : 12,
					paramFieldLable :getLabel('hasAttachment', 'Has Attachment'),
						 displayValue1 : hasAttachmentDesc
				});
	}
	
	objJson = jsonArray;
	return objJson;


}
function getAdvancedFilterValueJson(FilterCodeVal){
		var jsonArray = [];
		var typeCodeVal = $("input[type='text'][id='typeCode']").val();
		if (!Ext.isEmpty(typeCodeVal) && typeCodeVal !== 'Select') {
			jsonArray.push({
						field : 'typeCode',
						operator : 'eq',
						value1 : encodeURIComponent(typeCodeVal.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0,
						paramFieldLable : getLabel('typeCode', 'Type Code'),
						displayType : 5,
						displayValue1 : typeCodeVal
					});
		}
		var bankRefVal = $("input[type='text'][id='bankReference']").val();
		if (!Ext.isEmpty(bankRefVal)) {
			jsonArray.push({
						field : 'bankReference',
						operator : 'lk',
						value1 : encodeURIComponent(bankRefVal.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0,
						displayType : 5,
						 paramFieldLable : getLabel('bankReference', 'Bank Reference'),
						 displayValue1 : bankRefVal
					});
		}
		var clientRefVal = $("input[type='text'][id='customerReference']").val();
		if (!Ext.isEmpty(clientRefVal)) {
			jsonArray.push({
						field : 'customerReference',
						operator : 'lk',
						value1 : encodeURIComponent(clientRefVal.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0,
						displayType : 5,
						 paramFieldLable :getLabel('customerReference', 'Customer Reference'),
						 displayValue1 : clientRefVal
					});
		}
		var notesVal = $("input[type='text'][id='notes']").val();
		if (!Ext.isEmpty(notesVal)) {
			jsonArray.push({
						field : 'noteText',
						operator : 'lk',
						value1 : encodeURIComponent(notesVal.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0,
						displayType : 5,
						 paramFieldLable : getLabel('notes', 'Notes'),
						 displayValue1 : notesVal
					});
		}
		//Account Type 
		var accountTypeValue=$("select[id='accTyp']").getMultiSelectValue();
		var accountTypeValueDesc = [];
		$('#accTyp :selected').each(function(i, selected){
			accountTypeValueDesc[i] = $(selected).text();
		});
		accountTypeValueDesc = accountTypeValueDesc.join(',');
		var accountTypeValueString = accountTypeValue.join(',');
			if (!Ext.isEmpty(accountTypeValueString)) {
				if(!Ext.isEmpty(filterAccTypeCount)){
					var accTypeValueArray=accountTypeValueString.split(',');
					if(filterAccTypeCount==accTypeValueArray.length){
						accountTypeValueString='All';
						allAccountTypesSelected = true;
					}else{
						allAccountTypesSelected = false;
					}	
				}
			if(!(accountTypeValueString=='All')){
				jsonArray.push({
							field : 'subFacilityCode',
							operator : 'in',
							value1 : encodeURIComponent(accountTypeValueString.replace(new RegExp("'", 'g'), "\''")),
							value2 : '',
							dataType : 0,
							displayType : 4,
							paramFieldLable : getLabel('accountType', 'Account Type'),
							displayValue1 : accountTypeValueDesc.toString(),
							displayValue2 : ''
						});
			}
		}
		// PostingDate
		if(!jQuery.isEmptyObject(selectedPostingDate)){
			jsonArray.push({
						field : 'postingDate',
						operator : selectedPostingDate.operator,
						value1 : Ext.Date.format(new Date(Ext.Date.parse(selectedPostingDate.fromDate, strExtApplicationDateFormat)), 'Y-m-d'),
						value2 : (!Ext.isEmpty( selectedPostingDate.toDate))? Ext.Date.format(new Date(Ext.Date.parse(selectedPostingDate.toDate, strExtApplicationDateFormat)), 'Y-m-d'): '',
						dataType : 1,
						displayType : 5,
						displayValue1 :selectedPostingDate.fromDate,
						paramFieldLable : getLabel('postingDate', 'Posting Date'),
						dropdownLabel : selectedPostingDate.dateLabel,
						dateIndex : selectedPostingDate.dateIndex
					});
			}
		// ValueDate
		if(!jQuery.isEmptyObject(selectedValueDate)){
			jsonArray.push({
						field : 'selectedValueDate',
						operator : selectedValueDate.operator,
						value1 : Ext.Date.format(new Date(Ext.Date.parse(selectedValueDate.fromDate, strExtApplicationDateFormat)), 'Y-m-d'),
						value2 : (!Ext.isEmpty( selectedValueDate.toDate))? Ext.Date.format(new Date(Ext.Date.parse(selectedValueDate.toDate, strExtApplicationDateFormat)), 'Y-m-d'): '',
						dataType : 1,
						displayType : 5,
						displayValue1 : selectedValueDate.fromDate,
						paramFieldLable : getLabel('valueDate', 'Value Date'),
						dropdownLabel : selectedValueDate.dateLabel
					});
		}
	
	//account number
	var accNumbers = $("select[id='accAutoComp']").getMultiSelectValue();
	var accNumberDesc =[];
	$('#accAutoComp :selected').each(function(i, selected){
		accNumberDesc[i] = $(selected).text();
	});
	accNumberDesc = accNumberDesc.join(',');
	var accountNoValueString=accNumbers.join(',');
	if (!Ext.isEmpty(accountNoValueString)) {
		if(!Ext.isEmpty(filterAccNoCount)){
			var tempAccountNumbersValue = "";
			var accountNoValueArray=accountNoValueString.split(',');
			tempAccountNumbersValue=accountNoValueString;
			if(filterAccNoCount == accountNoValueArray.length){
				allAccountsSelected = true;
			}else {
				allAccountsSelected = false;
			}
		}
		if (!Ext.isEmpty(tempAccountNumbersValue) && !Ext.isEmpty(accNumberDesc) && !allAccountsSelected) {
			jsonArray.push({
							field : 'accountId',
							operator : 'in',
							value1 : tempAccountNumbersValue,
							value2 : '',
							dataType : 0,
							displayType : 6,
							paramFieldLable : getLabel('accountNo', 'Account'),
							displayValue1 : accNumberDesc.toString()
							
						});
		}
	}
	// Type Code Set
	var typeCodeSet = $("select[id='typeCodeSet']").getMultiSelectValueString();
    var typeCodeSetText = $("#typeCodeSet option:selected").text();
    if (!Ext.isEmpty(typeCodeSet) && !Ext.isEmpty(typeCodeSetText) && typeCodeSetText !== 'all' && typeCodeSet !== 'all') {
        jsonArray.push({
            field : 'typeCode',
            operator : 'eq',
            value1 : encodeURIComponent(typeCodeSet.replace(new RegExp("'", 'g'), "\''")),
            value2 : typeCodeSetText,
            dataType : 'S',
            displayType : 6,
            fieldLabel : getLabel('typecodeset', 'Saved Type Code Set'),
            displayValue1 : encodeURIComponent(typeCodeSet.replace(new RegExp("'", 'g'), "\''")),
            displayValue2 : ''
        });
    }
		// sortBySortOption
		var sortByCombo = $("select[id='msSortBy1']").val();
		var sortByOption = getSortByAscendingDescendingText('#sortBy1AscDescLabel');
		if (!Ext.isEmpty(sortByCombo) && sortByCombo !== "None") {
			jsonArray.push({
						field : 'SortBy',
						operator : 'st',
						value1 : sortByCombo,
						value2 : sortByOption,
						dataType : 0,
						displayType : 6,
						paramFieldLable : getLabel("sortBy", "Sort By"),
						displayValue1 : sortByCombo
					});
		}
		
		// First Then Sort By
		var firstThenSortByCombo = $("select[id='msSortBy2']").val();
		var firstThenSortByOption = getSortByAscendingDescendingText('#sortBy2AscDescLabel');
		if (!Ext.isEmpty(firstThenSortByCombo)
				&& firstThenSortByCombo !== "None") {
			jsonArray.push({
						field : 'FirstThenSortBy',
						operator : 'st',
						value1 : firstThenSortByCombo,
						value2 : firstThenSortByOption,
						dataType : 0,
						displayType : 6,
						paramFieldLable : getLabel("sortBy", " Then Sort By2 "),
						displayValue1 : firstThenSortByCombo
					});
		}
		// Second Then Sort By
		var secondThenSortByCombo = $("select[id='msSortBy3']").val();
		var secondThenSortByOption =getSortByAscendingDescendingText('#sortBy3AscDescLabel'); 
		if (!Ext.isEmpty(secondThenSortByCombo)
				&& secondThenSortByCombo !== "None") {
			jsonArray.push({
						field : 'SecondThenSortBy',
						operator : 'st',
						value1 : secondThenSortByCombo,
						value2 : secondThenSortByOption,
						dataType : 0,
						displayType : 6,
						paramFieldLable : getLabel("sortBy", " Then Sort By3"),
						displayValue1 : secondThenSortByCombo
					});
		}
		// Debit Flag
		var debitCreditCheckedVal = '';
		var debitCreditCheckedDesc ='';
		var debitChecked  = $("input[type='checkbox'][id='debitCheckBox']").is(':checked');
		var creditChecked = $("input[type='checkbox'][id='creditCheckBox']").is(':checked');

		if(debitChecked === true && creditChecked === true)
		{
			debitCreditCheckedVal = 'D,C';
			debitCreditCheckedDesc = 'Debit,Credit';
			jsonArray.push({
				field : 'debitCreditFlag',
				operator : 'in',
				value1 : debitCreditCheckedVal,
				value2 : '',
				dataType : 0,
				paramFieldLable : getLabel('transType', 'Transaction Type') ,
				displayType : 5,
				displayValue1 : debitCreditCheckedDesc
				
			});
		}
		else if(debitChecked === true)
		{
			debitCreditCheckedVal = 'D';
			debitCreditCheckedDesc = 'Debit';
			jsonArray.push({
				field : 'debitFlag',
				operator : 'eq',
				value1 : debitCreditCheckedVal,
				value2 : '',
				dataType : 0,
				paramFieldLable : getLabel('transType', 'Transaction Type') ,
				displayType : 5,
				displayValue1 : debitCreditCheckedDesc
				
			});
			
		}
		else if(creditChecked === true)
		{
			debitCreditCheckedVal = 'C';
			debitCreditCheckedDesc = 'Credit';
			jsonArray.push({
				field : 'creditFlag',
				operator : 'eq',
				value1 : debitCreditCheckedVal,
				value2 : '',
				dataType : 0,
				paramFieldLable : getLabel('transType', 'Transaction Type') ,
				displayType : 5,
				displayValue1 : debitCreditCheckedDesc
				
			});	
		}

		/*// Posted Txns Flag
		var postedTxnsCheckedVal = '';
		var postedTxnsChecked = $("input[type='checkbox'][id='postedTxnsCheckBox']").is(':checked');
		if (postedTxnsChecked === true)
			postedTxnsCheckedVal = 'Y';
		else
			postedTxnsCheckedVal = 'N';
		if (!Ext.isEmpty(postedTxnsCheckedVal)) {
			jsonArray.push({
						field : 'postedTxnsFlag',
						operator : 'eq',
						value1 : postedTxnsCheckedVal,
						value2 : '',
						dataType : 0,
						displayType : 6
						
					});
		}

		// Expected Txns Flag
		var expectedTxnsCheckedVal = '';
		var expectedTxnsChecked = $("input[type='checkbox'][id='expectedTxnsCheckBox']").is(':checked');	
		if (expectedTxnsChecked === true)
			expectedTxnsCheckedVal = 'Y';
		else
			expectedTxnsCheckedVal = 'N';
		if (!Ext.isEmpty(expectedTxnsCheckedVal)) {
			jsonArray.push({
						field : 'expectedTxnsFlag',
						operator : 'eq',
						value1 : expectedTxnsCheckedVal,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}
		*/
		// Has Image Flag
		var hasImageCheckedVal = '';
		var hasImageDesc ='';
		var hasImageChecked = $("input[type='checkbox'][id='hasImageCheckBox']").is(':checked');
		if (hasImageChecked === true){
			hasImageCheckedVal = 'Y';
			hasImageDesc ='True';
		}
		else{
			hasImageCheckedVal = 'N';
			hasImageDesc ='False';
		}	
		if (!Ext.isEmpty(hasImageCheckedVal) && hasImageCheckedVal == 'Y') {
			jsonArray.push({
						field : 'hasImageFlag',
						operator : 'eq',
						value1 : hasImageCheckedVal,
						value2 : '',
						dataType : 0,
						displayType : 12,
						paramFieldLable : getLabel('hasImage', 'Has Image'),
						displayValue1 : hasImageDesc
					});
		}

		// has Attachment Flag
		var hasAttachmentCheckedVal = '';
		var hasAttachmentDesc='';
		var hasAttachmentChecked = $("input[type='checkbox'][id='hasAttachmentCheckBox']").is(':checked');
		if (hasAttachmentChecked){
			hasAttachmentCheckedVal = 'Y';
			hasAttachmentDesc='True';
		}
		else
			hasAttachmentCheckedVal = 'N';
		if (!Ext.isEmpty(hasAttachmentCheckedVal) && hasAttachmentCheckedVal == 'Y') {
			jsonArray.push({
						field : 'hasAttachmentFlag',
						operator : 'eq',
						value1 : hasAttachmentCheckedVal,
						value2 : '',
						dataType : 0,
						displayType : 12,
						paramFieldLable : getLabel('hasAttachment', 'Has Attachment'),
						displayValue1 : hasAttachmentDesc
					});
		}
		// Amount
		var amount = $("input[type='text'][id='amountField']").val();
		var amountTo = $("input[type='text'][id='amountFieldTo']").val();
		if(!jQuery.isEmptyObject(amount))
			amount = amount.split(',').join('');
		if(!jQuery.isEmptyObject(amountTo))
			amountTo = amountTo.split(',').join('');
		if(!jQuery.isEmptyObject(amount)){
			 if (!Ext.isEmpty(amount)) {
				jsonArray.push({
							field : 'amount',
							operator : jQuery.isEmptyObject(selectedAmountType) ? 'eq' : selectedAmountType.operator,
							value1 : amount,
							value2 : amountTo,
							dataType : 2,
							displayType : 3,
							paramFieldLable :getLabel('amount', 'Amount'),
							displayValue1 : amount
						});
			}
		}

		objJson = {};
		objJson.filterBy = jsonArray;
		if (FilterCodeVal && !Ext.isEmpty(FilterCodeVal))
			objJson.filterCode = FilterCodeVal;

		return objJson;
}
/*
function setAmountDropDown(renderToElementId){
	var dropDownContainer=Ext.create('Ext.Container', {
			itemId : 'AmountContainer',
			renderTo:renderToElementId,
			items : [{
							xtype : 'label',
							forId : "AmountLabel",
							text:getLabel('amount', 'Amount') + ' ('+ getLabel('eqTo','Equal To') + ')'
						},{
							xtype : 'button',
							border : 0,
							itemId : 'amountTypeBtn',
							cls : 'ui-caret-dropdown',
							listeners : {
								click:function(event){
										var menus=getAmountDropDownItems("amountField",this);
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
function getAmountDropDownItems(filterType,buttonIns){
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
					text : getLabel('lessThanEqTo','Less Than Equal To'),
					btnId : 'btnLtEqTo',
					btnValue : 'lte',
					handler : function(btn, opts) {
						$(document).trigger("amountTypeChange",[filterType,btn,opts]);
					}
				}, {
					text : getLabel('greaterThanEqTo','Greater Than Equal To'),
					btnId : 'btnGtEqTo',
					btnValue : 'gte',
					handler : function(btn, opts) {
						$(document).trigger("amountTypeChange",[filterType,btn,opts]);
					}
				}, {
					text : getLabel('eqTo','Equal To'),
					btnId : 'btnEqTo',
					btnValue : 'eq',
					handler : function(btn, opts) {
						$(document).trigger("amountTypeChange",[filterType,btn,opts]);
					}
				}, {
					text : getLabel('amtRange','Amount Range'),
					btnId : 'btnAmtRange',
					btnValue : 'range',
					handler : function(btn, opts) {
						$(document).trigger("amountTypeChange",[filterType,btn,opts]);
					}
				}]
	});
	return dropdownMenu;
}*/
function setProcessingDateDropDownMenu(renderToElementId){
	var dropDownContainer=Ext.create('Ext.Container', {
			itemId : 'PostingDateContainer',
			renderTo:renderToElementId,
			items : [{
							xtype : 'label',
							forId : "PostingDateLabel",
							text:getLabel('postingDate', 'Posting Date'),
							cls : 'required',
							listeners: {
							       render: function(c) {
							    	   			var tip = Ext.create('Ext.tip.ToolTip', {
							    	   							xtype : 'tooltip',
											            	    target: c.getEl(),
											            	    listeners:{
											            	    	beforeshow:function(tip){
											            	    		if(posting_date_opt === null)
												            	    		tip.update(getLabel('postingDate', 'Posting Date'));
												            	    	else
												            	    		tip.update(getLabel('postingDate', 'Posting Date')+ posting_date_opt);

											            	    	}
											            	    }
							        			});
							       	}	
							}
						},{
							xtype : 'button',
							border : 0,
							itemId : 'postingDateBtn',
							cls : 'ui-caret-dropdown',
							listeners : {
								click:function(event){
										var menus=getDateDropDownItems("postingDate",this);
										var xy=event.getXY();
										menus.showAt(xy[0],xy[1]+16);
										event.menu=menus;
										//event.removeCls('ui-caret-dropdown'),
										//event.addCls('action-down-hover');
								}
							}
						}
					]	
		});
		return dropDownContainer;
}
function setValueDateDropDownMenu(renderToElementId){
	var dropDownContainer=Ext.create('Ext.Container', {
			itemId : 'ValueDateContainer',
			renderTo:renderToElementId,
			items : [{
							xtype : 'label',
							forId : "ValueDateLabel",
							text:getLabel('valueDate', 'Value Date'),
							listeners: {
							       render: function(c) {
							    	   			var tip = Ext.create('Ext.tip.ToolTip', {
							    	   							xtype : 'tooltip',
											            	    target: c.getEl(),
											            	    listeners:{
											            	    	beforeshow:function(tip){
											            	    		if(value_date_opt === null)
												            	    		tip.update(getLabel('valueDate', 'Value Date'));
												            	    	else
												            	    		tip.update(getLabel('valueDate', 'Value Date') + value_date_opt);

											            	    	}
											            	    }
							        			});
							       	}	
							}
						},{
							xtype : 'button',
							border : 0,
							itemId : 'valueDateBtn',
							cls : 'ui-caret-dropdown',
							listeners : {
								click:function(event){
										var menus=getDateDropDownItems("valueDate",this);
										var xy=event.getXY();
										menus.showAt(xy[0],xy[1]+16);
										event.menu=menus;
										//event.removeCls('ui-caret-dropdown'),
										//event.addCls('action-down-hover');
								}
							}
						}
					]	
		});
		return dropDownContainer;
}
function getDateDropDownItems(filterType,buttonIns){
	var intFilterDays = objClientParameters
				&& !Ext.isEmpty(objClientParameters['filterDays'])
				? parseInt(objClientParameters['filterDays'],10)
				: '';
		var arrMenuItem = [];
		if ( filterType == "valueDate" || filterType == "postingDate")
			arrMenuItem.push({
					text : getLabel('latest', 'Latest'),
					btnId : 'latest',
					btnValue : '12',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," ("+getLabel('latest', 'Latest')+")");
					}
				});
		if ( filterType == "valueDate" && (intFilterDays >= 1 || Ext.isEmpty(intFilterDays)))
			arrMenuItem.push({
					text : getLabel('today', 'Today'),
					btnId : 'btnToday',
					btnValue : '1',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," ("+getLabel('today', 'Today')+")");
					}
				});
		if (intFilterDays >= 2 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
					text : getLabel('yesterday', 'Yesterday'),
					btnId : 'btnYesterday',
					btnValue : '2',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," ("+getLabel('yesterday', 'Yesterday')+")");
					}
				});

		if (intFilterDays >= 7 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
					text : getLabel('thisweek', 'This Week'),
					btnId : 'btnThisweek',
					btnValue : '3',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," ("+getLabel('thisweek', 'This Week')+")");
					}
				});
		if (intFilterDays >= 14 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
					text : filterType == "valueDate" 
							? getLabel('lastweektodate', 'Last Week To Today') : 'Last Week To Yesterday',
					btnId : 'btnLastweek',
					btnValue : '4',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," ("+getLabel('lastweektodate', 'Last Week To Date')+")");
					}
				});
		if (intFilterDays >= 30 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
					text : getLabel('thismonth', 'This Month'),
					btnId : 'btnThismonth',
					btnValue : '5',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," ("+getLabel('thismonth', 'This Month')+")");
					}
			});
		if (intFilterDays >= 60 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
					text : filterType == "valueDate" 
							? getLabel('lastMonthToDate', 'Last Month To Today') : 'Last Month To Yesterday',					
					btnId : 'btnLastmonth',
					btnValue : '6',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," ("+getLabel('lastMonthToDate', 'Last Month To Date')+")");
					}
				});
		if (lastMonthOnlyFilter === true|| Ext.isEmpty(intFilterDays) )
			arrMenuItem.push({
						text : getLabel('lastmonthonly', 'Last Month Only'),
						btnId : 'btnLastmonthonly',
						btnValue : '14',
						parent : this,
						handler : function(btn, opts) {
							$(document).trigger("filterDateChange",[filterType,btn,opts]);
							updateToolTip(filterType," ("+getLabel('lastmonthonly', 'Last Month Only')+")");
						}
					});
		if (intFilterDays >= 90 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
					text : getLabel('thisquarter', 'This Quarter'),
					btnId : 'btnLastMonthToDate',
					btnValue : '8',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," ("+getLabel('thisquarter', 'This Quarter')+")");
					}
				});
		if (intFilterDays >= 180 || Ext.isEmpty(intFilterDays))			
				arrMenuItem.push({
					text : filterType == "valueDate" 
							? getLabel('lastQuarterToDate','Last Quarter To Today') : 'Last Quarter To Yesterday',					
					btnId : 'btnQuarterToDate',
					btnValue : '9',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," ("+getLabel('lastQuarterToDate',
						'Last Quarter To Date')+")");
					}
				});
		if (intFilterDays >= 365 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
					text : getLabel('thisyear', 'This Year'),
					btnId : 'btnLastQuarterToDate',
					btnValue : '10',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," ("+getLabel('thisyear', 'This Year')+")");
					}
				});
		if (intFilterDays >= 730 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
					text : filterType == "valueDate" 
						? getLabel('lastyeartodate', 'Last Year To Today') : 'Last Year To Yesterday',					
					btnId : 'btnYearToDate',
					btnValue : '11',
					handler : function(btn, opts) {
						var dtlbl=filterType == "valueDate" 
							? getLabel('lastyeartodate', 'Last Year To Today') : 'Last Year To Yesterday';
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," ("+ dtlbl +")");
					}
				});
	var dropdownMenu = Ext.create('Ext.menu.Menu', {
		itemId : 'DateMenu',
		cls : 'ext-dropdown-menu',
		listeners : {
				hide:function(event) {
					buttonIns.addCls('ui-caret-dropdown');
					buttonIns.removeCls('action-down-hover');
				}
			},	
		items : arrMenuItem
	});
	return dropdownMenu;
}

function updateToolTip(filterType,date_option){
	if(filterType === 'postingDate')
		posting_date_opt = date_option;
	else if(filterType === 'valueDate')
		value_date_opt = date_option;	
}

function setTypeCodeSetValues(elementId){
	Ext.Ajax.request({
			url : 'services/userpreferences/tranSearchSummaryCategories/transactionCategories.json',
			method : "GET",
			async : false,
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					pref = Ext.decode(data.preference);
					addDataInMultiSelect(elementId,pref);
					filterTypeCodeSetDataCount=pref.length;	
				}
			}
		});
}
function setSortByMenuItems(elementId,columnsArray){
	var defaultOpt = $('<option />', {
		value : "None",
		text : getLabel("none", "None")
		});	
	defaultOpt.appendTo(elementId);
	for (var index = 0; index < columnsArray.length; index++) {
		 var opt=$('<option />', {
		value : columnsArray[index].colId,
		text : columnsArray[index].colDesc
		});	
		opt.appendTo(elementId);
	}	
}
function sortBy1ComboSelected(){
	var filteredRecords = [];
	var sortByColumns=arrSortByFields;
	var selectedColumnId=$('#msSortBy1').val();
	if(selectedColumnId!='None'){
		for (var index = 0; index < sortByColumns.length; index++) {
			if(selectedColumnId!==sortByColumns[index].colId){
				filteredRecords.push({
					colId:sortByColumns[index].colId,
					colDesc:sortByColumns[index].colDesc
				});
			}
		}
		$('#msSortBy2 option').remove();
		setSortByMenuItems("#msSortBy2",filteredRecords);
		$('#msSortBy2').attr('disabled',false);
	}else{	
		$('#msSortBy2').attr('disabled',true);
		$('#msSortBy3').attr('disabled',true);
		$('#msSortBy2 option').remove();
		$('#msSortBy3 option').remove();
	}
	makeNiceSelect('msSortBy2');
	makeNiceSelect('msSortBy3');
}
function sortBy2ComboSelected(){
	var filteredRecords = [];
	var sortByColumns=arrSortByFields;
	var selectedColumnIdFromSort1Combo=$('#msSortBy1').val();
	var selectedColumnId=$('#msSortBy2').val();
	if(selectedColumnId!='None'){
		for (var index = 0; index < sortByColumns.length; index++) {
			if(selectedColumnId!==sortByColumns[index].colId&&selectedColumnIdFromSort1Combo!==sortByColumns[index].colId){
				filteredRecords.push({
					colId:sortByColumns[index].colId,
					colDesc:sortByColumns[index].colDesc
				});
			}
		}
		$('#msSortBy3 option').remove();
		setSortByMenuItems("#msSortBy3",filteredRecords);	
		$('#msSortBy3').attr('disabled',false);
	}else{	
		$('#msSortBy3').attr('disabled',true);
		$('#msSortBy3 option').remove();
	}
	makeNiceSelect('msSortBy3');
}
function addDataInMultiSelect(elementId,data)
{
	for(index=0;index<data.length;index++)
	{
		/*var opt = $('<option />', {
			value: data[index].txnCategory,
			text: data[index].txnCategory
		});
		$(elementId).appendTo( opt);	
		*/
		$('#typeCodeSet option').each(function() {
		    if ( $(this).text() === data[index].txnCategory ) {
		        $(this).remove();
		    }
		});
		
		$('#typeCodeSet').append($('<option>', { 
							value: data[index].typeCodes,
							text : data[index].txnCategory
							}));
							
	}
	$('#typeCodeSet').multiselect('refresh');
}
var arrSortByFields = [{
		"colId" : "postingDate",
		"colDesc" : "Posting Date"

	}, {
		"colId" : "drAmount",
		"colDesc" : "Debit Amount"
	}, {
		"colId" : "crAmount",
		"colDesc" : "Credit Amount"
	}, {
		"colId" : "typeCode",
		"colDesc" : "Type Code"
	}];
function createTranSearchAdvFilterGrid() {
	var store = tranSearchAdvFilterGridStore();
	var grid = Ext.create('Ext.grid.Panel', {
				store : store,
				maxHeight : 430,
				overFlowY:'auto',
				width:710,
				forceFit:true,
				popup : true,
				margin: '0 0 12 0',
				cls : 't7-grid',	
				listeners: {
					cellclick: function(view, td, cellIndex, record,tr, rowIndex, e, eOpts) {
						 var IconLinkClicked = (e.target.tagName == 'A');	
	         		     if(IconLinkClicked){
					        var clickedId = e.target.id;
							if(clickedId=='advFilterEdit'){
								$(document).trigger("editActivityFilterEvent",[view, rowIndex]);
							}else if(clickedId=='advFilterView'){
								$(document).trigger("viewActivityFilterEvent",[view, rowIndex]);
							}else if(clickedId=='advFilterDelete'){
								$(document).trigger("deleteActivityFilterEvent",[view, rowIndex]);
							}
						}
					}
				},
				columns : [{
					text: '#',
					width : 50,
					align :'center',
					sortable : false,
					menuDisabled : true,
					renderer: function(value, metaData, record, rowIndex, colIndex, store){ 
					    return rowIndex+1;
				 }
				},
					{
					xtype : 'actioncolumn',
					align : 'center',
					header : getLabel('actions', 'Actions'),
					sortable:false,
					flex:1,
					menuDisabled : true,
					renderer: function(value, metaData, record, rowIndex, colIndex, store){ 
						    return '<a id="advFilterView" class="grid-row-action-icon  icon-view" href="#" title='+getLabel('view', 'View')+'></a>'
						          +'<a id="advFilterEdit" class="grid-row-action-icon icon-edit" href="#" title='+getLabel('edit', 'Edit')+'></a>' 
						          +'<a id="advFilterDelete" class="grid-row-action-icon  icon-delete" href="#" title='+getLabel('delete', 'Delete')+'></a>' ;
					 }
				}, {
					text : 'Filter Name',
					dataIndex : 'filterName',
					flex : 3,
					sortable:false,
					menuDisabled : true
				}, /*{
					xtype : 'actioncolumn',
					align : 'center',
					flex:1,
					header : getLabel('deleteFilter', 'Delete Filter'),
					sortable:false,
					menuDisabled : true,
					renderer: function(value, metaData, record, rowIndex, colIndex, store){ 
						    return '<a id="advFilterDelete" class="grid-row-action-icon  icon-delete" href="#" title='+getLabel('delete', 'Delete')+'></a>';
						         		
					}
				},*/ {
					xtype : 'actioncolumn',
					align : 'center',
					flex:1,
					header : getLabel('order', 'Order'),
					sortable:false,
					menuDisabled : true,
					items : [{
						iconCls : 'grid-row-up-icon',
						tooltip : getLabel('up', 'Up'),
						handler : function(grid, rowIndex, colIndex) {
							$(document).trigger('orderUpGridEvent',
									[grid, rowIndex, -1]);
						}
					}, {
						iconCls : 'grid-row-down-icon',
						tooltip : getLabel('down', 'Down'),
						handler : function(grid, rowIndex, colIndex) {
							$(document).trigger('orderUpGridEvent',
									[grid, rowIndex, 1]);
						}
					}]
				}],
			renderTo : 'advFilterList'
			});
	grid.on('resize', function() {
				grid.doLayout();
			});

	return grid;
}
function activityFilterGridStore(){
	var myStore = new Ext.data.ArrayStore({
		autoLoad : true,
		fields : ['filterName'],
		proxy : {
			type : 'ajax',
			url : 'services/userfilterslist/btrSummaryActNewUX.json',
			reader : {
				type : 'json',
				root : 'd.filters'
			}
		},
		listeners : {
			load : function(store, records, success, opts) {
				store.each(function(record) {
							record.set('filterName', record.raw);
						});
			}
		}
	})
	return myStore;
}

function showTypeCodeSetPopup() {
	$('#typeCodeSetPopup').dialog({
		autoOpen : false,
		maxHeight : 450,
		width : 520,
		modal : true,
		//dialogClass : 'ft-tab-bar',
		/*buttons : [{
			id : 'btnSave',
			text : 'Save',
			click : function() {
				var txtField = $("input[type='text'][id='typeCodeTextField']").val();
				var btnLbl = $("#btnSave span").text();
				if(btnLbl=== 'Save')
					$(document).trigger("doHandleSaveTypeCodeClick",[txtField,'ADD']);
				else 
					$(document).trigger("doHandleSaveTypeCodeClick",[txtField,'Update']);
			}
		 }, {
			id : 'btnCancel',
			text : 'Cancel',
			click : function() {
				$(this).dialog("close");
			}
		}],*/
		open : function() {
			$('#typeCodeSetList').empty();
			$('#typeCodeSetEntryList').empty();
				$("#typeCodetabs").tabs({
					select : function(event, tab) {
						if (tab.index == 0) {
							if (!$('#typeCodeSetErrorDiv')
									.hasClass('ui-helper-hidden')) {
								$('#typeCodeSetErrorDiv')
										.addClass('ui-helper-hidden');
							}
							$('#btnSave').hide();
							$('#btnCancel').hide();
						} else {
							$('#btnSave').show();
							$('#btnCancel').show();
							$('#btnTypeClose').hide();
							Ext.Ajax.request({
								url : 'services/userseek/typecodelist',
								method : 'POST',
								async : false,
								params : {
									$top : -1
								},
								success : function(response) {
									var data = Ext.decode(response.responseText);
									var arrTypeCodes = manageTypeCodeJsonObj(data.d.preferences);
									if (!Ext.isEmpty(arrTypeCodes))
										filterEntryGrid.getView().getStore().loadRawData(arrTypeCodes);
								
								},
								failure : function(response) {
									// console.log("Ajax Get account sets call failed");
								}

				});
						}
					},
					show : function(e, ui) {
						if('undefined'!=filterGrid && !isEmpty(filterGrid))
							filterGrid.getView().refresh();
					if('undefined'!=filterEntryGrid && !isEmpty(filterEntryGrid)){
							filterEntryGrid.getView().refresh();
					}
					}
				});
				$("#typeCodetabs").barTabs();
				filterGrid = createTypeCodeSetGrid();
				changeTypeCodeSetTab(0);
				//advancedFilterFieldsDataAdded = true;
		}
	});
	$('#typeCodeSetPopup').dialog("open");
}
function createTypeCodeSetGrid() {
	$('#typeCodeSetList').empty();
	$(document).trigger('loadTypeCodeSetEntryGrid');
}
function changeTypeCodeSetTab(index) {
	if (index == 0) {
		$('#btnSave').hide();
		$('#btnCancel').hide();
		$('#btnTypeCancel').hide();
	} else {
		$('#btnSave').show();
		$('#btnCancel').show();
	}
	$('#typeCodetabs').tabs("option", "selected", index);
}
function loadTypeCodeEntrySetGrid()
{
	//$('#typeCodeSetEntryList').empty();
	//$('#typeCodeErrorPanelList').empty();
	$("#typeCodeTextField").removeAttr("disabled", "disabled"); 
	$("#typeCodeTextField").attr('value', '');
	$(document).trigger('loadTypeCodeSetEntryGrid');
}
function showTypeCodePopup() {
	$("#typeCodeSetErrorDiv").addClass("ui-helper-hidden");
    $("#typeCodeSetErrorMessage").text('');
	$('#typeCodeSetPopup').dialog({
		autoOpen : false,
		minWidth : 720,
		maxWidth : 735,
		minHeight : 156,
		maxHeight : 700,
		resizable : false,
		draggable : false,
		modal : true,
		dialogClass : 'ft-dialog',
		position: {
            my: "center",
            at: "center",
            of: window
        },
		/*buttons : [{
			id : 'btnSave',
			text : 'Save',
			click : function() {
				var txtField = $("input[type='text'][id='typeCodeTextField']").val();
				var btnLbl = $("#btnSave span").text();
				if(btnLbl=== 'Save')
					$(document).trigger("doHandleSaveTypeCodeClick",[txtField,'ADD']);
				else 
					$(document).trigger("doHandleSaveTypeCodeClick",[txtField,'Update']);
			 }
		 }, {
			id : 'btnCancel',
			text : 'Cancel',
			click : function() {
				$(this).dialog("close");
			}
		}],*/
		open : function() {
			$('#typeCodeSetList').empty();
			$("#typeCodeTextField").attr('value', '');
			if(Ext.isEmpty(filterEntryGrid)) {
			loadTypeCodeEntrySetGrid();
			}
			Ext.Ajax.request({
				url : 'services/userseek/typecodelist',
				method : 'POST',
				params : {
					$top : -1
				},
				success : function(response) {
					var data = Ext.decode(response.responseText);
					var arrTypeCodes = manageTypeCodeJsonObj(data.d.preferences);
					if (!Ext.isEmpty(arrTypeCodes))
						filterEntryGrid.getView().getStore().loadRawData(arrTypeCodes);
					$('#typeCodeSetPopup').dialog('option', 'position', 'center');
				},
				failure : function(response) {
					// console.log("Ajax Get account sets call failed");
				}

});
			//$('#typeCodeSetEntryList').empty();
				/*$("#typeCodetabs").tabs({
					select : function(event, tab) {
						if (tab.index == 0) {
							if (!$('#typeCodeSetErrorDiv')
									.hasClass('ui-helper-hidden')) {
								$('#typeCodeSetErrorDiv')
										.addClass('ui-helper-hidden');
							}
							$('#btnSave').hide();
							$('#btnTypeCancel').hide();
							$('#btnClose').show();
							var btnLabel=getLabel('save', 'Save');
							 $("#btnSave button").text( btnLabel);
							 $('#typeCodeSetPopup').dialog('option', 'position', 'center');
						} else {
							$('#btnSave').show();
							$('#btnTypeCancel').show();
							$('#btnClose').hide();
							Ext.Ajax.request({
								url : 'services/userseek/typecodelist',
								method : 'POST',
								async : false,
								params : {
									$top : -1
								},
								success : function(response) {
									var data = Ext.decode(response.responseText);
									var arrTypeCodes = data.d.preferences;
									if (!Ext.isEmpty(arrTypeCodes))
										filterEntryGrid.getView().getStore().loadRawData(arrTypeCodes);
									$('#typeCodeSetPopup').dialog('option', 'position', 'center');
								},
								failure : function(response) {
									// console.log("Ajax Get account sets call failed");
								}

				});
							
						}
					},
					show : function(e, ui) {
						if('undefined'!=filterGrid && !isEmpty(filterGrid))
							filterGrid.getView().refresh();
					if('undefined'!=filterEntryGrid && !isEmpty(filterEntryGrid)){
							filterEntryGrid.getView().refresh();
					}
					$('#typeCodeSetPopup').dialog('option', 'position', 'center');
					}
				});*/
				
				Ext.Ajax.request({
					url : 'services/userpreferences/tranSearchSummaryCategories/transactionCategories.json',
					method : 'GET',
					async : false,
					success : function(response) {
						var data = Ext.decode(response.responseText);
						var responseData = Ext.decode(data.preference);
						$('#msSavedFilterTypeCode').empty();
						$('#msSavedFilterTypeCode').append($('<option>', { 
							value: '',
							text : getLabel('select', 'Select'),
							selected : false
							}));
						if(responseData.length > 0){
							$.each(responseData,function(index,item){
								$('#msSavedFilterTypeCode').append($('<option>', { 
									value: responseData[index].typeCodes,
									text : responseData[index].txnCategory,
									selected : responseData[index].txnCategory === selectedFilter ? true : false
									}));
							});
						 }
						$('#msSavedFilterTypeCode').multiselect('refresh');
						if(selectedFilter){
							$(document).trigger("handleSavedTypeCodeFilterClick",[0]);
						}
					},
					failure : function(response) {
						// console.log("Ajax Get account sets call failed");
					}

				});				
				//$("#typeCodetabs").barTabs();
				//$("#typeCodetabs").find('ul').removeClass('ui-tabs-nav');
				//$("#typeCodetabs").find('ul').removeClass('ui-bar-tabs');
				filterGrid = createTypeCodeSetGrid();
				
				$(document).trigger('changeSaveButtonlabel');
				
				//changeTypeCodeSetTab(1);
				//assignSelectedValues();
				//advancedFilterFieldsDataAdded = true;
				$('#typeCodeSetPopup').dialog('option', 'position', 'center');
		}
	});
	$("#typeCodeSetPopup").dialog( "option", "width", 730 );
	$('#typeCodeSetPopup').dialog("open");
	$("#typeCodeSetPopup").dialog( "option", "width", 730 );
}
function manageTypeCodeJsonObj(jsonObject) {
	var jsonObj ='';
	if(jsonObject  instanceof Object ==false)
		jsonObj =JSON.parse(jsonObject);
	if(jsonObject  instanceof Array)
		jsonObj =jsonObject;
	for (var i = 0; i < jsonObj.length; i++) {
		jsonObj[i].DESCR =  getLabel(jsonObj[i].CODE,jsonObj[i].DESCR);
	}
	if(jsonObject  instanceof Object ==false)
		jsonObj = JSON.stringify(jsonObj)
	return jsonObj;
}
//function assignSelectedValues(){
//	$(document).trigger("showSelectedTypeCodePopup",[selectedFilter]);
//}

function resetAllMenuItemsInMultiSelect(elementId)
{
	$(elementId+' option').prop('selected', true);
	$(elementId).multiselect("refresh");
	if(elementId === '#accTyp'){
		setDataToAutoComp();
	}
}
