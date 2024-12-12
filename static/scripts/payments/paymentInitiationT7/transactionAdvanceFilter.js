var txnAdvancedFilterFieldsDataAdded=false;
var receiverNameSelectedValue=null;
var receiverNameSelected=null;
var productSelectedValue=null;
var receiverAccountSelectedValue=null;
var selectedTxnProcessDate={};
var  arrPaymentTxnStatus= [{
	'code' : '0',
	'desc' : getLabel("lbl.multipay.advFilter.status.0",'Draft')
}, {
	'code' : '1',
	'desc' : getLabel("lbl.multipay.advFilter.status.1",'Pending Approval')
}, {
	'code' : '2',
	'desc' : getLabel("lbl.multipay.advFilter.status.2",'Pending My Approval')
}, {
	'code' : '3',
	'desc' : getLabel("lbl.multipay.advFilter.status.3",'Pending Send')
}, {
	'code' : '4',
	'desc' : getLabel("lbl.multipay.advFilter.status.4",'Rejected')
}, {
	'code' : '41',
	'desc' : getLabel("lbl.multipay.advFilter.status.5",'Returned')
}, {
	'code' : '6',
	'desc' : getLabel("lbl.multipay.advFilter.status.6",'Pending Release')
}, {
	'code' : '7',
	'desc' : getLabel("lbl.multipay.advFilter.status.7",'Sent To Bank')
}, {
	'code' : '8',
	'desc' : getLabel("lbl.multipay.advFilter.status.8",'Deleted')
}, {
	'code' : '9',
	'desc' : getLabel("lbl.multipay.advFilter.status.9",'Pending Repair')
}, {
	'code' : '13',
	'desc' : getLabel("lbl.multipay.advFilter.status.13",'Debit Failed')
}, {
	'code' : '14',
	'desc' : getLabel("lbl.multipay.advFilter.status.14",'Debited')
}, {
	'code' : '15',
	'desc' : getLabel("lbl.multipay.advFilter.status.15",'Processed')
}, {
	'code' : '29',
	'desc' : getLabel("lbl.multipay.advFilter.status.29",'Stop Requested')
}, {
	'code' : '18',
	'desc' : getLabel("lbl.multipay.advFilter.status.18",'Stopped')
}, {
	'code' : '19',
	'desc' : getLabel("lbl.multipay.advFilter.status.19",'For Stop Auth')
}, {
	'code' : '75',
	'desc' : getLabel("lbl.multipay.advFilter.status.75",'Reversal Pending Auth')
}, {
	'code' : '78',
	'desc' : getLabel("lbl.multipay.advFilter.status.78",'Reversal Pending My Auth')
}, {
	'code' : '93',
	'desc' : getLabel("lbl.multipay.advFilter.status.93",'Reversed')
},{
	'code' : '30',
	'desc' : getLabel("lbl.multipay.advFilter.status.30",'Pending My Verification')
},{
	'code' : '31',
	'desc' : getLabel("lbl.multipay.advFilter.status.31",'Pending Verification')
},{
	'code' : '32',
	'desc' : getLabel("lbl.multipay.advFilter.status.32",'Verifier Rejected')
},{
	'code' : '108',
	'desc' : getLabel("lbl.multipay.advFilter.status.108",'Verified')
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
		/*buttons :[{
	       	   id: 'txtAdvFilterSearch',
	       	   text: 'Search',
	       	   click: function(){
	       		if(receiverNameSelectedValue!=null){
					$(document).trigger("advFilterReceiverNameSelected",receiverNameSelectedValue);
				}
	       		if(productSelectedValue!=null){
					$(document).trigger("advFilterProductSelected",productSelectedValue);
				}
	       		if(receiverAccountSelectedValue!=null){
					$(document).trigger("advFilterReceiverAccountSelected",receiverAccountSelectedValue);
				}
				$(document).trigger("txnSearchActionClicked"); 
				$(this).dialog("close");
	       	   }
          },{
	       	   id: 'txtAdvFilterCancel',
	       	   text: 'Cancel',
	       	   click: function(){
				$(this).dialog("close");
	       	   }
         }],*/
		open: function() {
			hideErrorPanel('#advancedFilterErrorDiv');
            if(!txnAdvancedFilterFieldsDataAdded){
            	if (strLayoutType != 'ACCTRFLAYOUT') {
            		setTxnFilterReceiverNameAutoComplete("#txnFilterReceiverName");
            	}
            	//setTxnFilterReceiverAccount("#txnFilterReceiverAccount");
            	setTxnFilterBankId("#txnFilterBankId");
            	//Note : This is not needed as no such field present in advanced filter.
            	//setTxnFilterProduct("#txnFilterProduct");
            	txnAdvancedFilterFieldsDataAdded=true;
            	setTxnStatusMenuItems("txnStatus");
            }
            makeNiceSelect('txnFilterAmountOperator', false);
            handleTxnFilterHoldZeroDollarFlag();
            if(receiverAccountSelectedValue != null && receiverAccountSelectedValue != ''){
            	$('#txnFilterReceiverAccount').val(receiverAccountSelectedValue);
            	$('#txnFilterReceiverAccount').niceSelect("update");
            }
            setLabelForSendingOrReceivingAccount();
            setLabelAndPlaceholderForreceiverName();
        }
	});
	$('#transactionAdvancedFilterPopup').dialog("open");
	if($('#txnFilterAmountOperator').val()=='')
	{
		$('#txnFilterAmountOperator').val('eq');
		$('#txnFilterAmountOperator').niceSelect('update');
}
	handleTxnFilterAmountOperatorChange();
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
function setTxnFilterReceiverNameAutoComplete(elementId){
	var selectedValue;
	$(elementId).autocomplete({
			minLength: 1,
			source: function(request, response) {
				$.ajax({
					url :'services/userseek/txnReceiverSeek.json?$filtercode1='+strIdentifier,  
					dataType : "json",
					data : {$autofilter : request.term},
					success : function(data) {
						var rec = data.d.preferences;
						response($.map(rec, function(item) {
							return {
								value : item.DESCRIPTION,
								label : item.DESCRIPTION,
								name  : item.VALUE
								}
						}));
					}
				});
			},
			select: function( event, ui ) {
				selectedValue=ui.item.label;
				receiverNameSelectedValue = selectedValue;					
				receiverNameSelected = ui.item.name;
			},
			/*close: function( event, ui ) {
				$(elementId).val(selectedValue);
				txnFilterReceiverSelected(true);
			},*/
			change: function( event, ui ) {
				if(Ext.isEmpty(ui.item)){
					txnFilterReceiverSelected(true);
				}
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
function setTxnFilterReceiverAccount(elementId){
	var receiverAccountData = null;
	$.ajax({
		url : 'services/userseek/txnAccountsSeek.json?$filtercode1='+strIdentifier,
		async : false,
		success : function(responseText) {
			$(elementId).empty();
			receiverAccountData=responseText.d.preferences;
			var defaultOpt = $('<option />', {
				value : "all",
				text : getLabel('allReceiverName', 'All')
				});
			defaultOpt.appendTo(elementId);
			$.each(receiverAccountData,function(index,item){
				$(elementId).append($('<option/>', { 
					value: receiverAccountData[index].CODE,
					text : receiverAccountData[index].DESCRIPTION
					}));
			});
			$(elementId).niceSelect("destroy");
			$(elementId).niceSelect();
		}
	});	
	return receiverAccountData;
}
function setTxnFilterBankId(elementId){
	$.ajax({
		url : 'services/userseek/drawerbank.json',
		success : function(responseText) {
			var responseData=responseText.d.preferences;
			var defaultOpt = $('<option />', {
				value : "all",
				text : getLabel('allReceiverName', 'All')
				});
			defaultOpt.appendTo(elementId);
			$.each(responseData,function(index,item){
				$(elementId).append($('<option/>', { 
					value: responseData[index].BANKCODE,
					text : responseData[index].BANKDESCRIPTION
					}));
			});
		}
	});	
}
function setTxnFilterProduct(elementId){
	var txnProductData = null;
	$.ajax({
		url : 'services/userseek/txnProductSeek.json?$filtercode1='+strIdentifier,
		async : false,
		success : function(responseText) {
			txnProductData=responseText.d.preferences;
			var defaultOpt = $('<option />', {
				value : "all",
				text : getLabel('allReceiverName', 'All')
				});
			defaultOpt.appendTo(elementId);
			$.each(txnProductData,function(index,item){
				$(elementId).append($('<option/>', { 
					value: txnProductData[index].CODE,
					text : txnProductData[index].DESCRIPTION
					}));
			});
		}
	});	
	
	return txnProductData;
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
		receiverNameSelectedValue = $('#txnFilterReceiverName').val();
	else
		receiverNameSelectedValue = null;
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
function txnFilterReceiverAccountSelected(){
	receiverAccountSelectedValue = $('#txnFilterReceiverAccount').val();
}
function handleTxnFilterAmountOperatorChange(me){
	var selectedAmountOperator=$("#txnFilterAmountOperator").val();
	if(selectedAmountOperator=='bt'){
		$(".amountTo").removeClass("hidden");
		$("#txnAmountLabel").text(getLabel("amountFrom","Amount From"));
		$("#txnFilterAmountFieldFrom").removeAttr('disabled');
	}else{
	if(selectedAmountOperator == '')
	{
		$("#txnFilterAmountFieldFrom").attr('disabled','disabled');
		$("#txnFilterAmountFieldFrom").val('');

		}else{
		$("#txnFilterAmountFieldFrom").removeAttr('disabled');
		}
		$(".amountTo").addClass("hidden");
		$("#txnAmountLabel").text(getLabel("amount","Amount"));
	}
}
function getTxnAdvanceFilterQueryJson(){	
	var objJson = null;
	var jsonArray = [];
	
	//Receiver Name
	//var receiverName = $("#txnFilterReceiverName").val();
	var receiverName = receiverNameSelectedValue;
	if($("#txnFilterReceiverName").val() == ""){
		receiverName = "";
		receiverNameSelectedValue = null;
	}
	
	if (!Ext.isEmpty(receiverName)) {
	jsonArray.push({
				field : 'ReceiverNamePDT',
				operator : 'lk',
				value1 : receiverName,
				value2 : '',
				dataType : 0,
				displayType : 8,
				detailFilter : 'Y',
				fieldLabel : strLayoutType == "TAXLAYOUT"? strSystemBeneCategoryLbl : getLabel("receiverName","Receiver Name"),
				displayValue1 : receiverName
			});
	}
	
	//Receiver Account
	var receiverAccountValue = receiverAccountSelectedValue;//$("#txnFilterReceiverAccount").val();
	if (!Ext.isEmpty(receiverAccountValue) && receiverAccountValue!='all') {
	jsonArray.push({
				field : 'ReceiverAccount',
				operator : 'eq',
				value1 : receiverAccountValue,
				value2 : '',
				dataType : 'S',
				displayType : 4,
				fieldLabel: $("#lblAccountText").text(),//'Receiver Account',
				displayValue1 : receiverAccountValue
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
					displayType : 8,
					fieldLabel: 'Product Type',
					displayValue1 : product
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
					displayType : 4,
					fieldLabel: 'Receiver ID'
				});
	}
	
	//Bank Id
	var bandkIdValue =  $("#txnFilterBankId").val();
	if (!Ext.isEmpty(bandkIdValue)&& bandkIdValue!='all') {		
		jsonArray.push({
					field : 'BeneficiaryBankId',
					operator : 'eq',
					value1 : bandkIdValue,
					value2 : '',
					dataType : 0,
					displayType : 4,
					fieldLabel: 'Beneficiary Bank Id'
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
	
	//if(!Ext.isEmpty(amountFrom)){
		/*var amountOperator = $("#txnFilterAmountOperator").val();
		var amountTo=$("#txnFilterAmountFieldTo").val();*/
		if (!Ext.isEmpty(amountOperator)) {
			jsonArray.push({
						field : 'Amount',
						operator : amountOperator,							
						value1 : amountFrom,
						value2 : amountTo,
						dataType : 2,
						displayType :3,// 3,
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
					displayType : 4,
					fieldLabel: 'Ordering Party'
				});
	}
		
	// Status
	var statusValue=$("select[id='txnStatus']").getMultiSelectValue();
	var statusValueString=statusValue.join("and");
	var tempStatusValue;
	
	var statusDesc = [];
	$('#txnStatus :selected').each(function(i, selected){
		statusDesc[i] = $(selected).text();
	});
	
	if (!Ext.isEmpty(statusValueString)) {
		if(!Ext.isEmpty(filterStatusCount)){			
			var statusValueArray=statusValueString.split("and");
			tempStatusValue=statusValueArray.join(',');
			if(filterStatusCount==statusValueArray.length){
				tempStatusValue='All';
				statusDesc = 'All';
			}else{
				jsonArray.push({
					field : 'ActionStatus',
					operator : 'in',
					value1 : tempStatusValue,
					value2 : '',
					dataType : 0,
					displayType :11,// 6,
					fieldLabel : getLabel('status','Status'),
					displayValue1: statusDesc.toString() 
				});
			}
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
						displayType : 6,
						fieldLabel : getLabel('ProcessDate','Process Date')
					});
	}
	
	// CreditDebitFlag
	var creditDebitType='';
	var creditDebitTypeDesc = '';
	var debitValue=$("input[type='checkbox'][id='txtFilterDebit']").is(':checked');
	var creditValue=$("input[type='checkbox'][id='txtFilterCredit']").is(':checked');
	if(debitValue === true && creditValue === true)
	{
		creditDebitType = 'C,D';
		creditDebitTypeDesc = "Both";
	}
	else if(debitValue === true)
	{
		creditDebitType = 'D';
		creditDebitTypeDesc = "Debit";
	}
	else if(creditValue === true)
	{
		creditDebitType = 'C';
		creditDebitTypeDesc = "Credit";
	}	
	if (!Ext.isEmpty(creditDebitType)) {
		jsonArray.push({
					field : 'CreditDebitFlag',
					operator : 'eq',
					value1 : creditDebitType == 'C,D'?'':creditDebitType,
					value2 : '',
					dataType : 0,
					displayType : 12,
					fieldLabel : getLabel('CreditDebitFlag','Transaction Type'),
					displayValue1 : creditDebitTypeDesc
				});
	}
	
	// Prenote
	var PrenoteValue = $("input[type='radio'][name='txtFilterPrenotes']:checked").val();
	var prenoteDscr = '';
	if(PrenoteValue === 'Y')
		prenoteDscr = getLabel('PrenoteDesc','Only Prenote');
	
	if ((!Ext.isEmpty(PrenoteValue))&&(PrenoteValue!='all')) {
		jsonArray.push({
					field : 'TxnFilterPrenote',
					operator : 'eq',
					value1 : PrenoteValue,
					value2 : '',
					dataType : 0,
					displayType : 13,
					detailFilter : 'Y',
					fieldLabel : getLabel('Prenote','Prenote'),
					displayValue1 : prenoteDscr
				});
	}
	
	// Hold
	var holdValue = $("input[type='radio'][name='txnFilterHold']:checked").val();
	var holdDescr = '';
	if(holdValue === 'Y')
		holdDescr = getLabel('HoldDesc','Hold');
		
	if ((!Ext.isEmpty(holdValue))&&(holdValue!='all')) {
		jsonArray.push({
					field : 'HoldTxn',
					operator : 'eq',
					value1 : holdValue,
					value2 : '',
					dataType : 0,
					displayType : 13,
					detailFilter : 'Y',
					fieldLabel : getLabel('Hold','Hold'),
					displayValue1 : holdDescr
				});
	}
	
	// Hold Zero Dollar
	var holdZeroValue = $("input[type='radio'][name='txnFilterHoldZeroDollar']:checked").val();
	var holdZeroDescr = '';
	if(holdZeroValue === 'Y')
		holdZeroDescr = 'Checked';

	if ((!Ext.isEmpty(holdZeroValue))&&(holdZeroValue!='all')) {
		jsonArray.push({
					field : 'HoldZeroDollarTxn',
					operator : 'eq',
					value1 : holdZeroValue,
					value2 : '',
					dataType : 0,
					displayType : 13,
					detailFilter : 'Y',
					fieldLabel : 'Hold Zero Dollar',
					displayValue1 : holdZeroDescr
				});
	}
	objJson=jsonArray;
	return objJson
}

/**
		 * Note : This is handled for payment using template
		 */		
function handleTxnFilterHoldZeroDollarFlag() {
	var headerInfo = paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo;
	if (!isEmpty(headerInfo.hdrClonnedFromTxn)
				&& !isEmpty(headerInfo.hdrTemplateName) && strEntryType === 'PAYMENT' ) {
				if(strHoldZeroFlag=='Y' ){
					$('#txnFilterHoldZeroDollarDiv').removeClass('hidden');
				}else{
					$('#txnFilterHoldZeroDollarDiv').addClass('hidden');
				}
	}else if(strEntryType=="TEMPLATE" && strHoldZeroFlag=='Y')
				{
				$('#txnFilterHoldZeroDollarDiv').removeClass('hidden');
				}else{
				$('#txnFilterHoldZeroDollarDiv').addClass('hidden');
				}
}

function setLabelForSendingOrReceivingAccount(){
	var crDrFlag = paymentResponseHeaderData
			&& paymentResponseHeaderData.d
			&& paymentResponseHeaderData.d.paymentEntry
			&& paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo
			&& paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.hdrDrCrFlag
			? paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.hdrDrCrFlag
			: '';
	var accountText = strLayoutSubType === 'DRAWDOWN' ? getLabel("batchDebitAcc", "Debit Account") :((!isEmpty(crDrFlag) && crDrFlag === 'D')
						? getLabel("batchSendingAcc", "Sending Account")
						: (!isEmpty(crDrFlag) && crDrFlag === 'C'
							? getLabel("batchReceiverAcc","Receiving Account")
							: getLabel("batchReceiverAcc","Receiving Account")));
	$("#lblAccountText").text(accountText);
	

	var strAmountType = /*paymentResponseHeaderData
		&& paymentResponseHeaderData.d
		&& paymentResponseHeaderData.d.__metadata
		&& paymentResponseHeaderData.d.__metadata.accTrfType ? paymentResponseHeaderData.d.__metadata.accTrfType
		:*/ (gAmountTransferType ? gAmountTransferType : 'A');

	var amountText = (strAmountType === 'P' ? 'Target Amount' : 'Amount');
	$("#txnAmountLabel").text(amountText);
	
}

function setLabelAndPlaceholderForreceiverName(){
	var receiverNameText = strLayoutSubType === 'DRAWDOWN' ? getLabel("batchDebitPartyName", "Debit Party Name") : getLabel("instrumentsColumnReceiverName","Receiver Name");
	$("#lblReceiverNameText").text(receiverNameText);
	var receiverNamePlaceholder = strLayoutSubType === 'DRAWDOWN' ? getLabel("searchByDebitPartyName", "Search By Debit Party Name") : getLabel('searchByReceiverName','Search By Receiver Name');
	$("#txnFilterReceiverName").attr("placeholder", receiverNamePlaceholder);
} 