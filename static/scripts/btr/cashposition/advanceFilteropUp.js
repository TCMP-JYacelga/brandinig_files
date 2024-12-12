var accountId = null;
var txnPopupCategory=null;
function showTransactionAdvanceFilterPopup(advFilterCodeApplied) {

	$('#activityAdvFilterPopup').dialog({
		autoOpen : false,
		maxHeight: 560,
		minHeight: 450,
		width : 810,
		margin : '45px',
		tapPanelWidth : 670,
		modal : true,
		resizable: false,
		draggable: false,
		position    : "center",
		dialogClass : 'adv-filter-tabPanel-height'
	});
	$('#activityAdvFilterPopup').dialog("open");
		if( txnCategoryValue != null && txnCategoryValue != '' && txnCategoryFlag )
		{
			$('#category').val(txnCategoryValue);
			txnCategoryFlag = false;
		}
		if (quickAccountName != null && quickAccountName != '' && quickAccountFlag)
		{
			$('#accAutoComp').val(quickAccountName);
			quickAccountFlag = false;
		}
	 
}
function resetMenuItems(elementId){
	$("#"+elementId+"  option").remove();
}
function setPoupPostedDate(){
	var strAppDate = dtSellerDate;
	var strSqlDateFormat = 'Y-m-d';
	
	var date = Ext.util.Format.date(strAppDate,
					strExtApplicationDateFormat);
	$('#postingDate').val(date);
	selectedPostingDate={
					operator:"eq",
					fromDate:date,
					toDate:''
				};

}
function addAccountType(elementId){
		var me = this;
		
			Ext.Ajax.request({
						url : 'services/userseek/accountTypeSeek.json',
						method : 'POST',
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
											text : data[index].SUB_FACILITY_DESC
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
	}
function setRadioGroupValues (elementId) {
		var me = this;
		var url;
		var accountChecked  = $("input[type='radio'][id='accountRadio']").is(':checked');
		var fieldName = $('input:radio[name=accountRadio]').filter(":checked").val();
		if (!Ext.isEmpty(fieldName)) {
			
			if (fieldName === 'Account') {
				url = 'services/cashpositionsummary/cashPositionAccount.json?$screenType=details';	
				 //url : 'services/cashpositionsummary/cashPositionAccount?$screenType=details'		
			}
			else if(fieldName === 'AccountSet'){
				url = "services/transcationSearch/accountSet.json";
			}
		}
		setDataToAutoComp('#accAutoComp',url,fieldName);
	}
	function setDataToAutoComp(elementId,url,fieldName){
	$(elementId).autocomplete({
			minLength: 1,
			source: function(request, response) {
				var strUrl = url; var rec;
				$.ajax({
					url :strUrl,  
					type:'POST',
					data : {$autofilter : request.term},
					success : function(data) {
						if(!isEmpty(data)&&!(isEmpty(data.d))){
							if(fieldName == 'Account')
								{
									rec = data.d.btruseraccount;
									response($.map(rec, function(item) {
										//accountId = item.accountId;
										var brGranularFlag = item.brGranularFlag;	
										var	cashDeatilFlag = item.cashDeatilFlag;
										if(brGranularFlag == 'Y' && cashDeatilFlag === 'Y'){
												return {
													value : item.accountName+" "+item.accountNumber,
													label : item.accountName+" "+item.accountNumber,
													accountVal : item.accountId
												}
										} else{
											return {
												value : item.accountName+" "+item.accountNumber,
												label : item.accountName+" "+item.accountNumber,
												accountVal : item.accountId
											}
										}
							}));	
								}
							 else if(fieldName == 'AccountSet')
								{
									rec = data.d.userAccount;
									response($.map(rec, function(item) {
										//accountId = item.accounts;
										return {
											value : item.accountSetName+" "+item.accounts,
											label : item.accountSetName+" "+item.accounts,
											accountVal : item.accounts
										}
							}));	
								}
							
						}
					}
				});
			},
			select : function(event, ui) {
				var data = ui.item.accountVal;
				if (data)
					accountId = data;

			}
		 });/*.data("autocomplete")._renderItem = function(ul, item) {
					var inner_html = '<a><ol class="t7-autocompleter"><ul>'
							+ item.label + '</ul></ol></a>';
					return $("<li></li>").data("item.autocomplete", item)
							.append(inner_html).appendTo(ul);
		};*/
}
var arrSortByFields = [{
		"colId" : "transactionDate",
		"colDesc" : "Posting Date"
	},/* {
		"colId" : "valueDate",
		"colDesc" : "Value Date"
	},*/ {
		"colId" : "amount",
		"colDesc" : "Amount"
	}, {
		"colId" : "typeCode",
		"colDesc" : "Type Code"
	}];
function setSortByMenuItems(elementId,columnsArray){
	var defaultOpt = $('<option />', {
		value : "None",
		text : "None"
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
function setAccountDropDown(renderToElementId){
	var dropDownContainer=Ext.create('Ext.Container', {
			itemId : 'accountContainer',
			renderTo:renderToElementId,
			items : [{
							xtype : 'label',
							forId : "AmountLabel",
							text:getLabel('Account', 'Account')
						
				}]	
		});
		return dropDownContainer;
	
}

function addTxnCategoryMenuItemsToPopup()  {
		$.ajax({
					url : 'services/cashpositionsummary/cashPositionCategory',
					type : 'POST',
					async : false,
					success : function(response) {
						var responseData = response;
						loadTxnCategory(responseData);
						$("#category").val(txnPopupCategory);
					},
					failure : function() {
						console.log("Error Occured - Addition Failed");
					}
				});
}
function loadTxnCategory(data) {
var elementId='category';
var el =  $("#"+elementId);

	for(index=0;index<data.length;index++)
	{
		var opt = $('<option />', {
			value: data[index].CATEGORY_ID,
			text: data[index].CATEGORY_NAME 
		});
		
		//opt.attr('selected','selected');
		opt.appendTo( el );		
	}
		
}

function setAmountDropDown(renderToElementId){
	var dropDownContainer=Ext.create('Ext.Container', {
			itemId : 'AmountContainer',
			renderTo:renderToElementId,
			items : [{
							xtype : 'label',
							forId : "AmountLabel",
							text:getLabel('amount', 'Amount')+' ('+getLabel('equalTo','Equal To')+")"
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
					btnValue : 'lteqto',
					handler : function(btn, opts) {
						$(document).trigger("amountTypeChange",[filterType,btn,opts]);
					}
				}, {
					text : getLabel('greaterThanEqTo','Greater Than Equal To'),
					btnId : 'btnGtEqTo',
					btnValue : 'gteqto',
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
				}/*, {
					text : getLabel('amtRange','Amount Range'),
					btnId : 'btnAmtRange',
					btnValue : 'range',
					handler : function(btn, opts) {
						$(document).trigger("amountTypeChange",[filterType,btn,opts]);
					}
				}*/]
	});
	return dropdownMenu;
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
					}
				}, {
					text : getLabel('today', 'Today'),
					btnId : 'btnToday',
					btnValue : '1',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				}, {
					text : getLabel('yesterday', 'Yesterday'),
					btnId : 'btnYesterday',
					btnValue : '2',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				}, {
					text : getLabel('thisweek', 'This Week'),
					btnId : 'btnThisweek',
					btnValue : '3',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				}, {
					text : getLabel('lastweektodate', 'Last Week To Date'),
					btnId : 'btnLastweek',
					btnValue : '4',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				}, {
					text : getLabel('thismonth', 'This Month'),
					btnId : 'btnThismonth',
					btnValue : '5',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				}, {
					text : getLabel('lastMonthToDate', 'Last Month To Date'),
					btnId : 'btnLastmonth',
					btnValue : '6',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				}, {
					text : getLabel('thisquarter', 'This Quarter'),
					btnId : 'btnLastMonthToDate',
					btnValue : '8',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				}, {
					text : getLabel('lastQuarterToDate',
							'Last Quarter To Date'),
					btnId : 'btnQuarterToDate',
					btnValue : '9',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				}, {
					text : getLabel('thisyear', 'This Year'),
					btnId : 'btnLastQuarterToDate',
					btnValue : '10',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				}, {
					text : getLabel('lastyeartodate', 'Last Year To Date'),
					btnId : 'btnYearToDate',
					btnValue : '11',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
					}
				}]
	});
	return dropdownMenu;
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
/*function setRadioGroupValues (elementId) {
		var me = this;
		
		var accountChecked  = $("input[type='radio'][id='accountRadio']").is(':checked');
		var fieldName = $('input:radio[name=accountRadio]').filter(":checked").val();
		if (!Ext.isEmpty(fieldName)) {
			
			if (fieldName === 'Account') {
				url = 'services/balancesummary/btruseraccounts.json';				
			}
			else if(fieldName === 'AccountSet'){
				url = "services/transcationSearch/accountSet.json";
			}
		}
		setDataToAutoComp('#accAutoComp',url,fieldName);
	}*/
function getAdvancedFilterQueryJson()
{

	var objJson = null;
	var jsonArray = [];
	
	// Debit Flag
	var debitCreditCheckedVal = '';
	var debitChecked  = $("input[type='checkbox'][id='debitCheckBox']").is(':checked');
	var creditChecked = $("input[type='checkbox'][id='creditCheckBox']").is(':checked');
	
	if(debitChecked === true && creditChecked === true)
	{
		debitCreditCheckedVal = 'Debit, Credit';
	}
	else if(debitChecked === true)
	{
		debitCreditCheckedVal = 'Debit';
	}
	else if(creditChecked === true)
	{
		debitCreditCheckedVal = 'Credit';
	}
	
	// Posted Txns Flag
	var postedTxnsCheckedVal = '';
	var postedTxnsChecked = $("input[type='checkbox'][id='postedTxnsCheckBox']").is(':checked');
	var expectedTxnsCheckedVal = '';
	var expectedTxnsChecked = $("input[type='checkbox'][id='expectedTxnsCheckBox']").is(':checked');
	
	if(postedTxnsChecked === true && expectedTxnsChecked === true)
	{
		debitCreditCheckedVal=debitCreditCheckedVal+',Posted Transactions, Expected Transactions';
	}else if(postedTxnsChecked === true){
		debitCreditCheckedVal=debitCreditCheckedVal+',Posted Transactions';
	}else if(expectedTxnsChecked === true){
		debitCreditCheckedVal=debitCreditCheckedVal+',Expected Transactions';
	}
	 
	 if (!Ext.isEmpty(debitCreditCheckedVal)) {
			jsonArray.push({
						field : 'debitCreditFlag',
						operator : 'in',
						value1 : debitCreditCheckedVal,
						value2 : '',
						dataType : 0,
						displayType : 6,
						paramFieldLable : getLabel('debitCreditFlag', 'Debit Credit Flag'),
						displayValue1 : debitCreditCheckedVal
					});
		}
	
	//Account Type
	var statusFilter = $("#accTyp").getMultiSelectValue();
	var statusValueDesc = [];
	
	$('#accTyp :selected').each(function(i, selected){
		statusValueDesc[i] = $(selected).text();
	});
	
	var statusValueString=statusFilter.join("and");
	
		var accTypeValue = $("#accTyp").getMultiSelectValueString();
		var tempAccTypeValue=accTypeValue;
		if (!Ext.isEmpty(tempAccTypeValue)) {
			if(!Ext.isEmpty(filterAccTypeCount)){
				var accTypeValueArray=accTypeValue.split(',');
				if(filterAccTypeCount==accTypeValueArray.length){
					tempAccTypeValue='All';
				}	
			}
			jsonArray.push({
						field : 'subFacilityCode',
						operator : 'in',
						value1 : encodeURIComponent(tempAccTypeValue.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0,
						displayType :11,
						paramFieldLable : getLabel('accountType', 'Account Type'),
						displayValue1 : statusValueDesc.toString()
					});
		}
		 
	 // Posting Date	
	 if(!jQuery.isEmptyObject(selectedPostingDate)){
			jsonArray.push({
						field : 'postingDate',
						operator : selectedPostingDate.operator,
						value1 : Ext.util.Format.date(selectedPostingDate.fromDate, 'Y-m-d'),
						value2 : (!Ext.isEmpty( selectedPostingDate.toDate))? Ext.util.Format.date(selectedPostingDate.toDate, 'Y-m-d'): '',
						dataType : 'D',
						displayType : 6,
						paramFieldLable : getLabel('postingDate', 'Posting Date')
				});
			}
	
	// Type Code
	var typeCode = $("input[type='text'][id='typeCode']").val();
		if (!Ext.isEmpty(typeCode)) {
		jsonArray.push({
						field : 'typeCode',
						operator : 'eq',
						value1 : encodeURIComponent(typeCode.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0,
						paramFieldLable : getLabel('typeCode', 'Type Code')
					});
	}
	// autocpmpleter 
	var accAutoComp = $("input[type='text'][id='accAutoComp']").val();
	var fieldChk = $('input:radio[name=accountRadio]').filter(":checked").val();
	var dispLabel;
    $("input:radio[name=accountRadio]:checked").each(function() {
        var idVal = $(this).attr("id");
        dispLabel  = $("label[for='"+idVal+"']").text();
    });
	if (!Ext.isEmpty(accAutoComp) && !Ext.isEmpty(accountId)) {
		jsonArray.push({
						field : $('input:radio[name=accountRadio]').filter(":checked").val(),
						operator : 'eq',
						value1 : accountId,
						value2 : accAutoComp,
						dataType : 'S',
						displayType : 5,
						displayValue1 : accAutoComp,
						paramFieldLable : dispLabel.trim()
					});
	}
	
	// Type Code Set
	var category = $("select[id='category']").getMultiSelectValueString();
	if (!Ext.isEmpty(category)) {
			 jsonArray.push({
				 field : 'txnCategory',
				 operator : 'eq',
				 value1 : encodeURIComponent(category.replace(new RegExp("'", 'g'), "\''")),
				 value2 : '',
				 dataType : 0,
				 displayType : 5,
				 paramFieldLable : getLabel('transCategory', 'Transaction Category'),
				 displayValue1 : $("#category option:selected").text()
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
						paramFieldLable : getLabel('bankReference', 'Bank Reference')
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
						paramFieldLable : getLabel('customerReference', 'Customer Reference')
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
						paramFieldLable : getLabel('notes', 'Notes')
					});
	}
	
	// Amount
	var amount = $("input[type='text'][id='amountField']").val();
	var amtOperator = $("#amountOperator").val();
	if(!jQuery.isEmptyObject(amount))
		amount = amount.split(',').join('');
	if(!jQuery.isEmptyObject(amount)){
	     if (!Ext.isEmpty(amount)) {
			jsonArray.push({
						field : 'amount',
						operator : amtOperator,
						value1 : amount,
						value2 : '',
						dataType : 2,
						displayType : 2,
						paramFieldLable : getLabel('Amount', 'Amount')
					});
		}
	}
	
	objJson = jsonArray;
	return objJson;


}
function getAdvancedFilterValueJson(FilterCodeVal){
		var jsonArray = [];
		var typeCodeVal = $("input[type='text'][id='typeCode']").val();
		if (!Ext.isEmpty(typeCodeVal)) {
			jsonArray.push({
						field : 'typeCode',
						operator : 'eq',
						value1 : encodeURIComponent(typeCodeVal.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0,
						paramFieldLable : getLabel('typeCode', 'Type Code')
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
						paramFieldLable : getLabel('bankReference', 'Bank Reference')
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
						paramFieldLable : getLabel('customerReference', 'Customer Reference')
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
						paramFieldLable : getLabel('notes', 'Notes')
					});
		}
		//Account Type
		var accTypeValue = $("#accTyp").getMultiSelectValueString();
		var tempAccTypeValue=accTypeValue;
		if (!Ext.isEmpty(tempAccTypeValue)) {
			if(!Ext.isEmpty(filterAccTypeCount)){
				var accTypeValueArray=accTypeValue.split(',');
				if(filterAccTypeCount==accTypeValueArray.length){
					tempAccTypeValue='All';
				}	
			}
			jsonArray.push({
						field : 'subFacilityCode',
						operator : 'in',
						value1 : encodeURIComponent(tempAccTypeValue.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0,
						displayType : 4
					});
		}
		// PostingDate
		if(!jQuery.isEmptyObject(selectedPostingDate)){
			jsonArray.push({
						field : 'postingDate',
						operator : selectedPostingDate.operator,
						value1 : Ext.util.Format.date(selectedPostingDate.fromDate, 'Y-m-d'),
						value2 : (!Ext.isEmpty( selectedPostingDate.toDate))? Ext.util.Format.date(selectedPostingDate.toDate, 'Y-m-d'): '',
						dataType : 1,
						displayType : 5
					});
			}
		
		// autocpmpleter 
		var accAutoComp = $("input[type='text'][id='accAutoComp']").val();
		var fieldChk = $('input:radio[name=accountRadio]').filter(":checked").val();
		var dispLabel;
		$("input:radio[name=accountRadio]:checked").each(function() {
					var idVal = $(this).attr("id");
					dispLabel = $("label[for='" + idVal + "']").text();
				});
		if (!Ext.isEmpty(accAutoComp) && !Ext.isEmpty(accountId)) {
			jsonArray.push({
						field : $('input:radio[name=accountRadio]')
								.filter(":checked").val(),
						operator : 'eq',
						value1 : accountId,
						value2 : accAutoComp,
						dataType : 'S',
						displayType : 5,
						displayValue1 : accAutoComp,
						paramFieldLable : dispLabel.trim()
					});
		}
		
		// type Code Set
		var category = $("select[id='category']").val();
		if (!Ext.isEmpty(category)) 
		{
			var categoryText= $("select[id='category']").find(":selected").text();
			if(categoryText != "Select")
			{
				 jsonArray.push({
				 field : 'category',
				 operator : 'eq',
				 value1 : category,
				 value2 : categoryText,
				 dataType : 0,
				 displayType : 6
			  });
			}
			
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
		// Debit Flag
		var debitCheckedVal = '';
		var debitChecked  = $("input[type='checkbox'][id='debitCheckBox']").is(':checked');
				
		if(debitChecked === true)
			debitCheckedVal = 'Y';
		else 
			debitCheckedVal = 'N';
		if (!Ext.isEmpty(debitCheckedVal)) {
			jsonArray.push({
						field : 'debitFlag',
						operator : 'eq',
						value1 : debitCheckedVal,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// Credit Flag
		var creditCheckedVal = '';
		var creditChecked = $("input[type='checkbox'][id='creditCheckBox']").is(':checked');
		if (creditChecked === true)
			creditCheckedVal = 'Y';
		else
			creditCheckedVal = 'N';
		if (!Ext.isEmpty(creditCheckedVal)) {
			jsonArray.push({
						field : 'creditFlag',
						operator : 'eq',
						value1 : creditCheckedVal,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// Posted Txns Flag
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

		// Has Image Flag
		var hasImageCheckedVal = '';
		var hasImageChecked = $("input[type='checkbox'][id='hasImageCheckBox']").is(':checked');
		if (hasImageChecked === true)
			hasImageCheckedVal = 'Y';
		else
			hasImageCheckedVal = 'N';
		if (!Ext.isEmpty(hasImageCheckedVal)) {
			jsonArray.push({
						field : 'hasImageFlag',
						operator : 'eq',
						value1 : hasImageCheckedVal,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// has Attachment Flag
		var hasAttachmentCheckedVal = '';
		var hasAttachmentChecked = $("input[type='checkbox'][id='hasAttachmentCheckBox']").is(':checked');
		if (hasAttachmentChecked)
			hasAttachmentCheckedVal = 'Y';
		else
			hasAttachmentCheckedVal = 'N';
		if (!Ext.isEmpty(hasAttachmentCheckedVal)) {
			jsonArray.push({
						field : 'hasAttachmentFlag',
						operator : 'eq',
						value1 : hasAttachmentCheckedVal,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}
		// Amount
		var amount = $("input[type='text'][id='amountField']").val();
		var amtOperator = $("#amountOperator").val();
	if(!jQuery.isEmptyObject(amount))
		amount = amount.split(',').join('');
	if(!jQuery.isEmptyObject(amount)){
	     if (!Ext.isEmpty(amount)) {
			jsonArray.push({
						field : 'amount',
						operator : amtOperator,
						value1 : amount,
						value2 : '',
						dataType : 2,
						displayType : 3
					});
		}
	}

		objJson = {};
		objJson.filterBy = jsonArray;
		if (FilterCodeVal && !Ext.isEmpty(FilterCodeVal))
			objJson.filterCode = FilterCodeVal;

		return objJson;
}
function sortBy1ComboSelected(columnId){
	var filteredRecords = [];
	var sortByColumns=arrSortByFields;
	if(!Ext.isEmpty(columnId) && columnId != undefined)
		var selectedColumnId=columnId;
	else
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
		$('#msSortBy2').niceSelect();
	}else{	
		$('#msSortBy2').attr('disabled',true);
	}
}
function sortBy2ComboSelected(columnId){
	var filteredRecords = [];
	var sortByColumns=arrSortByFields;
	var selectedColumnIdFromSort1Combo=$('#msSortBy1').val();
	if(!Ext.isEmpty(columnId) && columnId != undefined)
		var selectedColumnId=columnId;
	else
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
		$('#msSortBy3').niceSelect();
	}else{	
		$('#msSortBy3').attr('disabled',true);
	}
}
function paintError(errorDiv,errorMsgDiv,errorMsg){
	if(!$(errorDiv).is(':visible')){
		$(errorDiv).removeClass('ui-helper-hidden');
	}
	$(errorMsgDiv).text(errorMsg);
}
function hideErrorPanel(errorDivId){
	if($(errorDivId).is(':visible')){
		$(errorDivId).addClass('ui-helper-hidden');
	}
}
function toggleAdditionalSection(me){
     var flag=$("#additionalLink").hasClass("fa fa-caret-up");
     if(flag){
      	$("#additionalLink").removeClass("fa fa-caret-up")
      	$("#additionalLink").toggleClass("fa fa-caret-down");
      }else{
      	$("#additionalLink").removeClass("fa fa-caret-down")
      	$("#additionalLink").toggleClass("fa fa-caret-up")
      }
	$(".moreCriteria").toggleClass("hidden");
}
$(function() {
	var date = Ext.util.Format.date(dtSellerDate,
					strExtApplicationDateFormat);
	$('#postingDate').datepick({
		monthsToShow: 1,
		changeMonth : false,
		rangeSeparator : '  to  ',
		minDate:'-1w',
		onClose: function(dates) {
			if(!Ext.isEmpty(dates)){
				$(document).trigger("datePickPopupSelectedDate",["dateValue",dates]);
			}
		}
	}).attr('readOnly',true);
	
});

function toggleMoreLessText(me)
{
	$(".moreCriteria").toggleClass("hidden");
	$("#moreLessCriteriaCaret").toggleClass("fa-caret-up fa-caret-down");
	var textContainer = $(me).children("#moreLessCriteriaText");
	var labelText = textContainer.text().trim();
	if(labelText === getLabel("lesscriterial", "Less Criteria")) 
	{
		textContainer.text(getLabel("morecriterial","More Criteria"));
		$('#tabs-2').removeClass('ft-content-pane-scroll');
	}
	else if(labelText === getLabel("morecriterial","More Criteria")) 
	{
		textContainer.text(getLabel("lesscriterial","Less Criteria"));
		$('#tabs-2').addClass('ft-content-pane-scroll');
	}
}
function getSavedFilter()
{
		if($('#msSavedFilter').val() != '')
			$(document).trigger('handleSavedFilterClick');
		else
			$(document).trigger("resetAllFieldsEvent");
}
function setSavedFilterComboItems(element)
{
	$.ajax({
		url : 'services/userfilterslist/cashpositiontxn.json',
		success : function(responseText) 
		{
			if(responseText && responseText.d && responseText.d.filters)
			{
				 var responseData=responseText.d.filters;
				 if(responseData.length > 0)
				 {
					$.each(responseData,function(index,item)
					{
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