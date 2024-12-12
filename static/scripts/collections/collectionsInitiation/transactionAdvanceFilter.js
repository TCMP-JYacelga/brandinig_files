var txnAdvancedFilterFieldsDataAdded=false;
var advPayerNameSelectedValue=null;
var productSelectedValue=null;
var payerAccountSelectedValue=null;
var advPayerCodeSelectedValue=null;
var advClrLocationSelectedValue=null;
var advClrLocationSelectedCode=null;
var advInstProductSelectedValue=null;
var advInstProductSelectedCode=null;
var advDraweeBankSelectedValue=null;
var advDraweeBankSelectedCode=null;
var advDraweeBranchSelectedValue=null;
var advDraweeBranchSelectedCode=null;
var selectedTxnProcessDate={};
var  arrPaymentTxnStatus= [
{'code' : '0','desc' :  getLabel("draft","Draft")},
{'code' : '101','desc' : getLabel("pendingsubmit","Pending Submit")},
{'code' : '1','desc' :  getLabel("pendingApproval","Pending Approval")},
{'code' : '2','desc' :  getLabel("pendingMyApproval","Pending My Approval")},
{'code' : '3','desc' : getLabel("pendingsend","Pending Send")},
{'code' : '19','desc' : getLabel("ForCancelApprove","For Cancel Approve")},
{'code' : '15','desc' :  getLabel("Paid","Paid")},
{'code' : '41','desc' :  getLabel("returned","Returned")},
{'code' : '4','desc' :  getLabel("Rejected","Rejected")},
{'code' : '7','desc' :  getLabel("senttobank","Sent To Bank")},
{'code' : '8','desc' :  getLabel("Deleted","Deleted")},
{'code' : '9','desc' : getLabel("pendingrepair","Pending Repair")},
{'code' : '18','desc' :  getLabel("Cancelled","Cancelled")},
{'code' : '58,60,61','desc' : getLabel("Processed","Processed")},
{'code' : '43','desc' :getLabel("Warehoused","Warehoused") },
{'code' : '96','desc' :  getLabel("CancelledByBank","Cancelled By Bank")},
{'code' : '51,52,53,54,55,56,57,62,63,64,65,66,67,68,69,70,71,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141','desc' :  getLabel("SentToClearing","Sent To Clearing")}];
function showTransactionAdvanceFilterPopup(){
	$('#transactionAdvancedFilterPopup').dialog({
		autoOpen : false,
		maxHeight : 550,
		minHeight :156,
		width : 735,
		resizable: false,
		draggable: false,
		modal : true,
		open : function() {
			if (!txnAdvancedFilterFieldsDataAdded) {
				settxnAdvFilterPayerNameAutoComplete("#txnAdvFilterPayerName");
				if (strLayoutType === "CHKLAYOUT"
						|| strLayoutType === "CASHLAYOUT") {
					setTxnAdvFilterPayerCodeAutoComplete("#txnAdvFilterPayerCode");
					setTxnAdvFilterClrLocationAutoComplete("#txnAdvFilterClrLocation");
					setTxnAdvFilterInstProductAutoComplete("#txnAdvFilterProduct");
					if (strLayoutType === "CHKLAYOUT") {
						setTxnAdvFilterDraweeBankAutoComplete("#txnAdvFilterDraweeBank");
						setTxnAdvFilterDraweeBranchAutoComplete("#txnAdvFilterDraweeBranch");
					}
				} else if (strLayoutType === "DDLAYOUT"
						|| strLayoutType === "SEPADDLAYOUT") {
					setTxnAdvFilterPayerAccount("#txnAdvFilterPayerAccount");
					setTxnFilterBankId("#txnFilterBankId");
				}
				setTxnStatusMenuItems("txnStatus");
				txnAdvancedFilterFieldsDataAdded = true;
			}
			$('#txnFilterAmountOperator').niceSelect("destroy");
			$('#txnFilterAmountOperator').niceSelect();
		}
	});
	$('#transactionAdvancedFilterPopup').dialog("open");
}
function setTxnStatusMenuItems(elementId) {
	var el = $("#"+elementId).multiselect();
	el.attr('multiple',true);
	if (typeof arrPaymentTxnStatus != 'undefined' && arrPaymentTxnStatus) {
		for(index=0;index<arrPaymentTxnStatus.length;index++)
		{
			var opt = $('<option />', {
				value: arrPaymentTxnStatus[index].code,
				text: arrPaymentTxnStatus[index].desc
			});
			opt.attr('selected','selected');	
			opt.appendTo(el);
		}
		el.multiselect('refresh');
		filterStatusCount=arrPaymentTxnStatus.length;
	}	
}
function settxnAdvFilterPayerNameAutoComplete(elementId){
	var selectedValue;
	$(elementId).autocomplete({
			minLength: 1,
			source: function(request, response) {
				$.ajax({
					url :'services/userseek/txnDrawerNameSeek.json?$filtercode1='+strIdentifier,  
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
				advPayerNameSelectedValue = selectedValue=ui.item.label;
			},
			change: function( event, ui ) {
				var advFilterPayerName = $('#txnAdvFilterPayerName').val();
				if(!Ext.isEmpty(advFilterPayerName)) 
					$('#txnAdvFilterPayerName').val(advFilterPayerName.replace(/[%]/g,""));
				txnFilterReceiverSelected(true);
			},
			search: function( event, ui ) {
				if(Ext.isEmpty(ui.item)){
					txnFilterReceiverSelected(true);
				}
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
			$(elementId).empty();
			defaultOpt.appendTo(elementId);
			$.each(responseData,function(index,item){
				$(elementId).append($('<option/>', { 
					value: responseData[index].CODE,
					text : responseData[index].DESCRIPTION
					}));
			});
			$(elementId).niceSelect("destroy");
			$(elementId).niceSelect();
			if(!isEmpty(payerAccountSelectedValue)){
				$(elementId).val(payerAccountSelectedValue);
				$(elementId).niceSelect("update");
			}
		}
	});	
}
function setTxnFilterBankId(elementId){
	var selectedValue;
	$(elementId).autocomplete({
			minLength: 1,
			source: function(request, response) {
				$.ajax({
					url : 'services/userseek/txnBankSeek.json?$filtercode1='+strIdentifier,
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
				//txnFilterReceiverSelected();
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
function txnFilterReceiverSelected(isSelected){
	if(isSelected)
		advPayerNameSelectedValue = $('#txnAdvFilterPayerName').val();
	else
		advPayerNameSelectedValue = null;
}
function txnFilterPayerCodeSelected(isSelected){
	if(isSelected)
		advPayerCodeSelectedValue = $('#txnAdvFilterPayerCode').val();
	else
		advPayerCodeSelectedValue = null;
}
function txnFilterClrLocationSelected(isSelected){
	if(isSelected)
	{	
		advClrLocationSelectedValue = $('#txnAdvFilterClrLocation').val();
		advClrLocationSelectedCode = $('#txnAdvFilterClrLocationCode').val();
	}
	else
	{	
		advClrLocationSelectedValue = null;
		advClrLocationSelectedCode = null;
	}
}
function txnFilterInstProductSelected(isSelected){
	if(isSelected)
	{	
		advInstProductSelectedValue = $('#txnAdvFilterProduct').val();
		advInstProductSelectedCode = $('#txnAdvFilterProductCode').val();
	}
	else
	{	
		advInstProductSelectedValue = null;
		advInstProductSelectedCode = null;
	}
}
function txnFilterDraweeBankSelected(isSelected){
	if(isSelected)
	{
		advDraweeBankSelectedValue = $('#txnAdvFilterDraweeBank').val();
		advDraweeBankSelectedCode = $('#txnAdvFilterDraweeBankCode').val();
	}
	else
	{	
		advDraweeBankSelectedValue = null;
		advDraweeBankSelectedCode = null;
	}
}
function txnFilterDraweeBranchSelected(isSelected){
	if(isSelected)
	{
		advDraweeBranchSelectedValue = $('#txnAdvFilterDraweeBranch').val();
		advDraweeBranchSelectedCode = $('#txnAdvFilterDraweeBranchCode').val();
	}
	else
	{
		advDraweeBranchSelectedValue = null;
		advDraweeBranchSelectedCode = null;
	}
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
	if($("#txnAdvFilterPayerName").val() == ""){
		advPayerNameSelectedValue = null;
	}
	
	if (!Ext.isEmpty(advPayerNameSelectedValue)) {
	jsonArray.push({
				field : 'PayerName',
				operator : 'lk',
				value1 : advPayerNameSelectedValue,
				value2 : '',
				dataType : 0,
				fieldLabel : getLabel('PayerName','Payer Name'),
				displayValue1 : advPayerNameSelectedValue,
				displayType : 5
			});
	}
	
	//Payer Code
	if($("#txnAdvFilterPayerCode").val() == ""){
		advPayerCodeSelectedValue = null;
	}
	
	if (!Ext.isEmpty(advPayerCodeSelectedValue)) {
	jsonArray.push({
				field : 'PayerCode',
				operator : 'lk',
				value1 : advPayerCodeSelectedValue,
				value2 : '',
				dataType : 0,
				fieldLabel : getLabel('PayerCode','Payer Code'),
				displayValue1 : advPayerCodeSelectedValue,
				displayType : 5
			});
	}
	
	//Drawee Bank
	if($("#txnAdvFilterDraweeBank").val() == "" ){
		advDraweeBankSelectedValue = null;
		advDraweeBankSelectedCode = null;
	}
	
	if (!Ext.isEmpty(advDraweeBankSelectedCode) || !Ext.isEmpty(advDraweeBankSelectedValue)) {
	jsonArray.push({
				field : 'DraweeBank',
				operator : 'lk',
				value1 : !Ext.isEmpty(advDraweeBankSelectedCode) ? advDraweeBankSelectedCode : advDraweeBankSelectedValue,
				value2 : '',
				dataType : 0,
				fieldLabel : getLabel('DraweeBank','Drawee Bank'),
				displayValue1 : advDraweeBankSelectedValue,
				displayType : 5
			});
	}
	
	//Clr Location
	if($("#txnAdvFilterClrLocation").val() == ""){
		advClrLocationSelectedValue = null;
		advClrLocationSelectedCode = null;
	}
	
	if (!Ext.isEmpty(advClrLocationSelectedCode) || !Ext.isEmpty(advClrLocationSelectedValue)) {
	jsonArray.push({
				field : 'ClrLocation',
				operator : 'lk',
				value1 : !Ext.isEmpty(advClrLocationSelectedCode) ? advClrLocationSelectedCode: advClrLocationSelectedValue,
				value2 : '',
				dataType : 0,
				fieldLabel : getLabel('ClrLocation','Clearing Location'),
				displayValue1 : advClrLocationSelectedValue,
				displayType : 5
			});
	}
	
	//Inst Product
	if($("#txnAdvFilterProduct").val() == ""){
		advInstProductSelectedCode = null;
		advInstProductSelectedValue = null;
	}
	
	if (!Ext.isEmpty(advInstProductSelectedCode) || !Ext.isEmpty(advInstProductSelectedValue)) {
	jsonArray.push({
				field : 'Product',
				operator : 'lk',
				value1 : !Ext.isEmpty(advInstProductSelectedCode) ? advInstProductSelectedCode: advInstProductSelectedValue,
				value2 : '',
				dataType : 0,
				fieldLabel : getLabel('ProductDescription','Product'),
				displayValue1 : advInstProductSelectedValue,
				displayType : 5
			});
	}
	
	//Drawee Bank Branch
	if($("#txnAdvFilterDraweeBranch").val() == ""){
		advDraweeBranchSelectedValue = null;
		advDraweeBranchSelectedCode = null;
	}
	
	if (!Ext.isEmpty(advDraweeBranchSelectedCode) || !Ext.isEmpty(advDraweeBranchSelectedValue)) {
	jsonArray.push({
				field : 'DraweeBankBranch',
				operator : 'lk',
				value1 : !Ext.isEmpty(advDraweeBranchSelectedCode) ? advDraweeBranchSelectedCode : advDraweeBranchSelectedValue,
				value2 : '',
				dataType : 0,
				fieldLabel : getLabel('DraweeBankBranch','Drawee Bank'),
				displayValue1 : advDraweeBranchSelectedValue,
				displayType : 5
			});
	}
	
	//Receiver Account
	var payerAccountValue = $("#txnAdvFilterPayerAccount").val();
	if (!Ext.isEmpty(payerAccountValue) && payerAccountValue!='all') {
	jsonArray.push({
				field : 'PayerAcctNo',
				operator : 'eq',
				value1 : payerAccountValue,
				value2 : '',
				dataType : 0,
				displayType : 4,
				fieldLabel: 'Payer Account',
				displayValue1 : payerAccountValue
			});
	}
	
	//Product
	var product =  $("#txnFilterProduct").val();
	if (!Ext.isEmpty(product)&& product!='all') {		
		jsonArray.push({
					field : 'ProductType',
					operator : 'eq',
					value1 : product,
					value2 : '',
					dataType : 0,
					displayType : 4
		});
	}
	
	// Receiver Id
	var receiverId = $("#txnFilterReceiverId").val();
		if (!Ext.isEmpty(receiverId)) {
		jsonArray.push({
					field : 'ReceiverId',
					operator : 'lk',
					value1 : receiverId,
					value2 : '',
					dataType : 0,
					displayType : 4
				});
	}
	
	//Bank Id
	var bandkIdValue =  $("#txnFilterBankId").val();
	if (!Ext.isEmpty(bandkIdValue)) {		
		jsonArray.push({
					field : 'PayerBankId',
					operator : 'lk',
					value1 : bandkIdValue,
					value2 : '',
					dataType : 0,
					displayType : 5,
					fieldLabel : getLabel('BankId','Bank Id'),
					displayValue1 : bandkIdValue
		});
	}
	
	//Amount
		var blnAutoNumeric = true;
	//var amountFrom=$("#txnFilterAmountFieldFrom").val();
	
	var amountFrom=$("#txnFilterAmountFieldFrom").val();
	// jquery autoNumeric formatting
	blnAutoNumeric = isAutoNumericApplied("txnFilterAmountFieldFrom");
	if (blnAutoNumeric)
		amountFrom = $("#txnFilterAmountFieldFrom").autoNumeric('get');
	else
		amountFrom = $("#txnFilterAmountFieldFrom").val();
	// jquery autoNumeric formatting
	if(!Ext.isEmpty(amountFrom)){
		var amountOperator = $("#txnFilterAmountOperator").val();
		var amountTo=$("#txnFilterAmountFieldTo").val();
		// jquery autoNumeric formatting
		blnAutoNumeric = isAutoNumericApplied("txnFilterAmountFieldTo");
		if (blnAutoNumeric)
			amountTo = $("#txnFilterAmountFieldTo").autoNumeric('get');
		else
			amountTo = $("#txnFilterAmountFieldTo").val();
		if (!Ext.isEmpty(amountOperator)) {
			jsonArray.push({
						field : 'InstAmount',
						operator : amountOperator,							
						value1 : amountFrom,
						value2 : amountTo,
						dataType : 2,
						displayType :2,
						fieldLabel : getLabel('amount','Amount')
					});
		}
	}
	
	//Ordering Party Name
	var orderingPartyValue = $("#txnFilterOrderingPartyName").val();
	if (!Ext.isEmpty(orderingPartyValue)&&orderingPartyValue!='%') {
		jsonArray.push({
					field : 'OrderingParty',  
					operator : 'eq',
					value1 : orderingPartyValue,
					value2 : '',
					dataType : 0,
					displayType : 4
				});
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
		if(tempStatusValue != "All"){
		jsonArray.push({
					field : 'ActionStatus',
					operator : 'in',
					value1 : tempStatusValue,
					value2 : '',
					dataType : 0,
					displayType :11,// 6,
					fieldLabel : getLabel('status','Status'),
					displayValue1 : statusValueDesc.toString()
				});
		}
	}
	
	// Process Date	
	if(!jQuery.isEmptyObject(selectedTxnProcessDate)){
			jsonArray.push({
						field : 'EntryDate',
						operator : selectedTxnProcessDate.operator,
						value1 : Ext.util.Format.date(selectedTxnProcessDate.fromDate, 'Y-m-d'),
						value2 : (!Ext.isEmpty( selectedTxnProcessDate.toDate))? Ext.util.Format.date(selectedTxnProcessDate.toDate, 'Y-m-d'): '',
						dataType : 1,
						displayType : 5
					});
	}
	
	// CreditDebitFlag
	var creditDebitType='';
	var debitValue=$("input[type='checkbox'][id='txtFilterDebit']").is(':checked');
	var creditValue=$("input[type='checkbox'][id='txtFilterCredit']").is(':checked');
	if(debitValue === true && creditValue === true)
	{
		creditDebitType = '';
	}
	else if(debitValue === true)
	{
		creditDebitType = 'D';
	}
	else if(creditValue === true)
	{
		creditDebitType = 'C';
	}	
	if (!Ext.isEmpty(creditDebitType)) {
		jsonArray.push({
					field : 'CreditDebitFlag',
					operator : 'eq',
					value1 : creditDebitType,
					value2 : '',
					dataType : 0,
					displayType : 4
				});
	}
	
	// Prenote
	var PrenoteValue = $("input[type='radio'][name='txtFilterPrenotes']:checked").val();		
	if ((!Ext.isEmpty(PrenoteValue))&&(PrenoteValue!='all')) {
		jsonArray.push({
					field : 'Prenote',
					operator : 'eq',
					value1 : PrenoteValue,
					value2 : '',
					dataType : 0,
					displayType : 4
				});
	}
	
	// Hold
	var holdValue = $("input[type='radio'][name='txnFilterHold']:checked").val();		
	if ((!Ext.isEmpty(holdValue))&&(holdValue!='all')) {
		jsonArray.push({
					field : 'HoldTxn',
					operator : 'eq',
					value1 : holdValue,
					value2 : '',
					dataType : 0,
					displayType : 4
				});
	}
	
	// Hold Zero Dollar
	var holdZeroValue = $("input[type='radio'][name='txnFilterHoldZeroDollar']:checked").val();		
	if ((!Ext.isEmpty(holdZeroValue))&&(holdZeroValue!='all')) {
		jsonArray.push({
					field : 'HoldZeroDollarTxn',
					operator : 'eq',
					value1 : holdZeroValue,
					value2 : '',
					dataType : 0,
					displayType : 4
				});
	}
	objJson=jsonArray;
	return objJson
}

function setTxnAdvFilterClrLocationAutoComplete(elementId){
	var selectedValue;
	var selectedCode;
	$(elementId).autocomplete({
			minLength: 1,
			source: function(request, response) {
				$.ajax({
					url :'services/userseek/txnReceivableClearinglocation.json',  
					dataType : "json",
					data :{ 
							$autofilter : request.term,
							$filtercode1 : strIdentifier
						  },
					success : function(data) {
						var rec = data.d.preferences;
						response($.map(rec, function(item) {
							return {
								value : item.CODE,
								label : item.DESCRIPTION  
								}
						}));
					}
				});
			},
			select: function( event, ui ) { 
				advClrLocationSelectedValue = selectedValue =ui.item.label;
				advClrLocationSelectedCode=ui.item.value;
				$('#txnAdvFilterClrLocationCode').val(advClrLocationSelectedCode);
			},
			change: function( event, ui ) {
				var advFilterClrLocation = $('#txnAdvFilterClrLocation').val();
				if(!Ext.isEmpty(advFilterClrLocation)) 
					$('#txnAdvFilterClrLocation').val(advFilterClrLocation.replace(/[%]/g,""));
				txnFilterClrLocationSelected(true);
			},
			search: function( event, ui ) {
				if(Ext.isEmpty(ui.item)){
					txnFilterClrLocationSelected(true);
				}
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

function setTxnAdvFilterInstProductAutoComplete(elementId){
	var selectedValue;
	var selectedCode;
	$(elementId).autocomplete({
			minLength: 1,
			source: function(request, response) {
				$.ajax({
					url :'services/userseek/receivableProductSeek.json',  
					dataType : "json",
					data :{ 
							$autofilter : request.term,
							$filtercode1 : strIdentifier
						  },
					success : function(data) {
						var rec = data.d.preferences;
						response($.map(rec, function(item) {
							return {
								value : item.CODE,
								label : item.DESCRIPTION  
								}
						}));
					}
				});
			},
			select: function( event, ui ) { 
				advInstProductSelectedValue = selectedValue=ui.item.label;
				advInstProductSelectedCode = ui.item.value;
				$('#txnAdvFilterProductCode').val(advInstProductSelectedCode);
			},
			change: function( event, ui ) {
				var advFilterProduct = $('#txnAdvFilterProduct').val();
				if(!Ext.isEmpty(advFilterProduct)) 
					$('#txnAdvFilterProduct').val(advFilterProduct.replace(/[%]/g,""));
				txnFilterInstProductSelected(true);
			},
			search: function( event, ui ) {
				if(Ext.isEmpty(ui.item)){
					txnFilterInstProductSelected(true);
				}
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
function setTxnAdvFilterPayerCodeAutoComplete(elementId){
	var selectedValue;
	$(elementId).autocomplete({
			minLength: 1,
			source: function(request, response) {
				$.ajax({
					url :'services/userseek/receivablePayerCodeSeek.json',  
					dataType : "json",
					data :{ 
							$autofilter : request.term,
							$filtercode1 : strIdentifier
						  },
					success : function(data) {
						var rec = data.d.preferences;
						response($.map(rec, function(item) {
							return {
								value : item.CODE,
								label : item.CODE  
								}
						}));
					}
				});
			},
			select: function( event, ui ) { 
				selectedValue=ui.item.value;
				},
			close: function( event, ui ) {    
					$(elementId).val(selectedValue);
					txnFilterPayerCodeSelected(true);
				},
			change: function( event, ui ) {
				if(Ext.isEmpty(ui.item)){
					txnFilterPayerCodeSelected(true);
				}
			},
			search: function( event, ui ) {
				if(Ext.isEmpty(ui.item)){
					txnFilterPayerCodeSelected(true);
				}
			}
				
		 });/*.data("autocomplete")._renderItem = function(ul, item) {
					var inner_html = '<a><ol class="t7-autocompleter"><ul>'
							+ item.label + '</ul></ol></a>';
					return $("<li></li>").data("item.autocomplete", item)
							.append(inner_html).appendTo(ul);
				};*/	
}
function setTxnAdvFilterDraweeBankAutoComplete(elementId){
	var selectedValue;
	var selectedCode;
	$(elementId).autocomplete({
			minLength: 1,
			source: function(request, response) {
				$.ajax({
					url :'services/userseek/receivableDraweeBank.json',  
					dataType : "json",
					data :{ 
							$autofilter : request.term,
							$filtercode1 : strIdentifier
						  },
					success : function(data) {
						var rec = data.d.preferences;
						response($.map(rec, function(item) {
							return {
								value : item.CODE,
								label : item.DESCRIPTION  
								}
						}));
					}
				});
			},
			select: function( event, ui ) { 
				selectedValue=ui.item.label;
				selectedCode=ui.item.value;
				},
			change: function( event, ui ) {
				var advFilterDraweeBank = $('#txnAdvFilterDraweeBank').val();
				if(!Ext.isEmpty(advFilterDraweeBank)) 
					$('#txnAdvFilterDraweeBank').val(advFilterDraweeBank.replace(/[%]/g,""));
				txnFilterDraweeBankSelected(true);
			},
			search: function( event, ui ) {
				if(Ext.isEmpty(ui.item)){
					txnFilterDraweeBankSelected(true);
				}
			}
				
		 });/*.data("autocomplete")._renderItem = function(ul, item) {
					var inner_html = '<a><ol class="t7-autocompleter"><ul>'
							+ item.label + '</ul></ol></a>';
					return $("<li></li>").data("item.autocomplete", item)
							.append(inner_html).appendTo(ul);
				};*/	
}
function setTxnAdvFilterDraweeBranchAutoComplete(elementId){
	var selectedValue;
	var selectedCode;
	$(elementId).autocomplete({
			minLength: 1,
			source: function(request, response) {
				$.ajax({
					url :'services/userseek/receivableDraweeBranch.json',  
					dataType : "json",
					data :{ 
							$autofilter : request.term,
							$filtercode1 : strIdentifier
						  },
					success : function(data) {
						var rec = data.d.preferences;
						response($.map(rec, function(item) {
							return {
								value : item.CODE,
								label : item.DESCRIPTION  
								}
						}));
					}
				});
			},
			select: function( event, ui ) { 
				selectedValue=ui.item.label;
				selectedCode=ui.item.value;
				},
			change: function( event, ui ) {
				var advFilterDraweeBranch = $('#txnAdvFilterDraweeBranch').val();
				if(!Ext.isEmpty(advFilterDraweeBranch)) 
					$('#txnAdvFilterDraweeBranch').val(advFilterDraweeBranch.replace(/[%]/g,""));
				txnFilterDraweeBranchSelected(true);
			},
			search: function( event, ui ) {
				if(Ext.isEmpty(ui.item)){
					txnFilterDraweeBranchSelected(true);
				}
			}
				
		 });/*.data("autocomplete")._renderItem = function(ul, item) {
					var inner_html = '<a><ol class="t7-autocompleter"><ul>'
							+ item.label + '</ul></ol></a>';
					return $("<li></li>").data("item.autocomplete", item)
							.append(inner_html).appendTo(ul);
				};*/	
}