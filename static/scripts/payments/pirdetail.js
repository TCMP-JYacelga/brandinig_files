/*START:Delete multienrichments*/

function deleteDetailEnrichment(index, strUrl, serialNbr)
{	
	var frm = document.forms["frmMain"]; 
	frm.target = "";
	frm.submit();
}

function showDelete(index, strUrl, serialNbr){
	$('#DeleteDialog').dialog( {autoOpen: false, width : 400,title : 'About To Delete',modal : true,position: 'center'});
	$('#dialogMode').val('1');
	$('#DeleteDialog').dialog('open');
	document.getElementById("txtIndex").value = index;
	document.getElementById("serialNumber").value = serialNbr;
	$('#addendanumber').val(parseInt(index,10)+1);
	$('#addendanumber').text(parseInt(index,10)+1);
	
	var frm = document.forms["frmMain"]; 
	frm.target = "";
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
}

function cancelDelete(){
	$('#DeleteDialog').dialog('close');
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = "";
	frm.target = "";
	frm.action = "";
}
/*END:Delete multienrichments*/

// Function for  text field validation
function validateRequiredFields () {
	var failedFields = 0;
	$('label.required').each(function(){
		var objid = $(this).attr('for');
		var inputField = $('#' + objid);
		var tmpValid = markRequired(inputField);
		if (tmpValid == false) failedFields++;
	}); 
	return (failedFields == 0);
}
// Function for text field validation
// Ajax call functions start here
//Function to get Prenote.
function getPrenoteUntil(strUrl, obj)
{
    $.blockUI({
        overlayCSS: {
            opacity: 0
        }
    });
    var strData = {};
    strData[_CSRFTOK_NAME] = $('#' + _CSRFTOK_NAME).val();
     isPrenoted = obj.checked;
     if(isPrenoted){
        jQuery(obj).val('Y');
    }else{
         jQuery(obj).val('N');
    }
    strData["prenote"] = jQuery(obj).val();
    $.post(strUrl, strData, paintChangePrenoteUntil, "json");
    
    return false;
}
function toggleLockInstr(){
	if($('#templateType').val() == 2 || $('#templateType').val()== 3 )
	{
		$('#lockInstr').html('');
	   
	}
	else
	{
		 $('#lockInstr').html('<a class="hyperLink link_color font_bold rightAlign" href="#" onclick="javascript:showLockInstructions(saveLockInstructions);">Lock Instructions</a>') ;
	}
}
function showLockInstructions(fptrCallback)
{
	
	var dlg = $('#lockInstructions');
	if(_mode == 'VIEW')
	{
		dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:350,title : 'Lock Instructions',
						buttons: {Cancel: function() {$(this).dialog('close'); }}});
	}else
		{
			dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:350,title : 'Lock Instructions',
			buttons: {"Save": function() {$(this).dialog("close"); fptrCallback.call();},
			Cancel: function() {$(this).dialog('close'); }}});
		}
	dlg.dialog('open');
}
/* On change of hold until disable and enable the prenote flag*/
function onChangeHoldUntil()
{
	if($('#holdUntilFlag1').is(":checked"))
	{	
		 $("#prenote1").attr('checked',false);
		 $("#prenote1").attr("disabled","disabled" );
		 $("#holdUntil").attr("disabled",false );
	}
    else
	{
		$("#prenote1").attr("disabled",false );
		$("#holdUntil").val('');		
		$("#holdUntil").attr("disabled",true );		
	}
    $.unblockUI();
}
//Function to render PrenoteUntil
function paintChangePrenoteUntil(data)
{
    tokenValue = data.OWASPCSRFTOKEN;
    $('#' + _CSRFTOK_NAME).val(tokenValue);
    prenoteUntil = data.prenoteUntil;
    $('#lbl_prenoteUntil').text(prenoteUntil);
    if($('#prenote1').val()=='Y')
	{	
		 $("#holdUntil").val('');
		 $("#holdUntil").attr("disabled","disabled" );
		 $("#holdUntilFlag1").attr('checked',false);
		 $("#holdUntilFlag1").attr("disabled","disabled" );
	}
    else
	{
		$("#holdUntil").attr("disabled",false );
		$("#holdUntilFlag1").attr("disabled",false );
	}
    $.unblockUI();
}

//Function to get account info using an ajax call whenever user selects a account in instrument entry screen.
function getChangeDebitAccountInfo(strUrl, obj)
{
	$.blockUI({ overlayCSS: {opacity: 0 }});
	var strData = {};
	strData["accountNumber"] = $('#accountNo').val();
	strData[_CSRFTOK_NAME] = $('#' + _CSRFTOK_NAME).val();
	$.post(strUrl, strData, paintChangeDebitAccountInfo, "json");
	return false;
}
function saveLockInstructions()
{
	$('#lockFieldsMask').val(_lockFieldMask);
}

function ValidateDecimal()
{
	var DigitsAfterDecimal = 2;

	var val = $("#amount").val();
	if(val.indexOf(".") != -1)
	 if(val.length - (val.indexOf(".")) > DigitsAfterDecimal)                          

	  {                        
	          return false;                

       }

}
function ValidateDecimalDebit()
{
	var DigitsAfterDecimal = 2;

	var val = $("#debitCcyAmount").val();
	if(val.indexOf(".") != -1)
	 if(val.length - (val.indexOf(".")) > DigitsAfterDecimal)                          

	  {                        
	          return false;                

       }

}

function lockUnlockFieldEditing(ctrl, index)
{
	var arrLockFieldMask = _lockFieldMask.split("");
	if (arrLockFieldMask[index] == 0)
	{
		arrLockFieldMask[index] = 1;
		ctrl.className = "linkbox acceptedlink rightAlign";
	}
	else
	{
		arrLockFieldMask[index] = 0;
		ctrl.className = "linkbox acceptlink rightAlign";
	}
	_lockFieldMask = arrLockFieldMask.join("");
	//_lockFieldMask = _lockFieldMask.replace(/,/gi, "");
}
//Function to render response of the ajax call to get account info
function paintChangeDebitAccountInfo(data)
{	
	$.unblockUI();
	document.body.style.cursor = 'default';
	var prdCurr;
	var strAccountCCY
	var element;
	var option;
	var tokenValue;
	tokenValue = data.OWASPCSRFTOKEN;
	$('#' + _CSRFTOK_NAME).val(tokenValue);

	//get product currency
	if (!isEmpty($('#txnCurrency').val()))
		prdCurr = $('#txnCurrency option:selected').val();
	else
		prdCurr = $('#lbl_txnCurrency').text();

	//Empty all div elements related to fcy and amount before repopulating them
	$('#fcyFields').children().remove();
	$('#indicativeRateDiv').children().remove();
	$('#contractReference').children().remove();
	$('#accCurrDiv').children().remove();

	if (data['accInfo'] && data.accInfo['accountCCY'])
	{	strAccountCCY = data.accInfo['accountCCY'];
		$('#accountCurrency').val(strAccountCCY);
		$('#accCurrDiv').append("<b>" + strAccountCCY + "</b>");
	}
	else
		$('#accCurrDiv').append('&nbsp;');

	//Create fcy related fields if product currency & account currency are different
	if (!isEmpty(strAccountCCY) && prdCurr != strAccountCCY)
	{
		
		CONTRACTREFNOSEEKPARAMS.buyCCY=strAccountCCY;
		
		//Adding label element  for #rateType
		element = document.createElement("label");
		$(element).attr("for", "rateType");
		$(element).text(payLabels.LBL_RATETYPE + ' ');
		$(element).addClass("required frmLabel");
		$(element).appendTo('#fcyFields');

		//Adding select element for #rateType
		element = document.createElement("select");
		$(element).attr("id", "rateType");
		$(element).attr("name", "rateType");
		$(element).attr("tabindex", "3");
		$(element).addClass("comboBox roundedCombo");
		$(element).change(function(){
			getChangeRateTypeInfo(this)
		});

		//Adding options for #rateType
		option = document.createElement("option");
		$(option).val('0').text('Counter Rate'); 
		$(element).append(option);
		//show contract rate if it is not a SI transaction
		if (_pirMode != 'SI')
		{
			option = document.createElement("option");
			$(option).val('1').text('Contract Rate');
			$(element).append(option);
		}
		$(element).appendTo('#fcyFields');
		$("<br/>").appendTo('#fcyFields');
		element = document.createElement("div");
		$(element).attr("id", "indicativeRateDiv");
		$(element).appendTo('#fcyFields');

		//Adding label element  for #amount
		element = document.createElement("label");
		$(element).attr("for", "amount");
		$(element).text(payLabels.LBL_PAYAMOUNT + ' ');
		$(element).addClass("frmLabel required");
		$(element).appendTo('#fcyFields');
		
		//Adding radio element for Payment Amount
		element = document.createElement("input");
		$(element).attr("id", "debitPaymentAmntFlag1");
		$(element).attr("name", "debitPaymentAmntFlag");
		$(element).attr("tabindex", "127");
		$(element).attr("type", "radio");
		$(element).addClass("radio");
		$(element).attr("value", "P");
		$(element).attr('checked',true);
		$(element).click(function(){
			getChangeDrEquivalentInfo(this)
		});
		$(element).appendTo('#fcyFields');
		
		element = document.createElement("span");
		$(element).attr("id", "payAmnt");
		$(element).appendTo('#fcyFields');
		
		//Adding input element for #amount
		element = document.createElement("input");
		$(element).attr("id", "amount");
		$(element).attr("name", "amount");
		$(element).attr("tabindex", "128");
		$(element).attr("maxLength", "14");
		$(element).attr("size", "10");
		$(element).attr("title", payToolTips.TT_PAYAMOUNT);
		$(element).attr("type", "text");
		$(element).addClass("amountBox rounded");
		$(element).change(function(){
			getChangePayAmntInfo('getChangePayAmntInfo.formx',this)
		});
		
		$(element).appendTo('#payAmnt');

		//Adding span element for transaction currency
		element = document.createElement("span");
		$(element).attr("id", "amountCurrency");
		$(element).text("  " + prdCurr);
		$(element).appendTo('#fcyFields');
		$("<br/>").appendTo('#fcyFields');
		
		//Adding label element  for #debitCcyAmount
		element = document.createElement("label");
		$(element).attr("for", "debitCcyAmount");
		$(element).text(payLabels.LBL_DR_EQUIVALENT + ' ');
		$(element).addClass("frmLabel");
		$(element).appendTo('#fcyFields');

		//Adding radio element for Debit Equivalent
		element = document.createElement("input");
		$(element).attr("id", "debitPaymentAmntFlag2");
		$(element).attr("name", "debitPaymentAmntFlag");
		$(element).attr("tabindex", "131");
		$(element).attr("type", "radio");
		$(element).addClass("radio");
		$(element).attr("value", "D");
		$(element).click(function(){
			getChangeDrEquivalentInfo(this)
		});
		$(element).appendTo('#fcyFields');
		
		element = document.createElement("span");
		$(element).attr("id", "drEquivalentAmnt");
		$(element).appendTo('#fcyFields');
		
		element = document.createElement("span");
		$(element).attr("id", "lbl_debitCcyAmount");
		$(element).text("0");
		$(element).addClass("amountBox rounded inline_block disabled");
		$(element).appendTo('#drEquivalentAmnt');

		$("<br/>").appendTo('#fcyFields');
	}
	else
	{
		//Adding label element  for #amount
		element = document.createElement("label");
		$(element).attr("for", "amount");
		$(element).text(payLabels.LBL_PAYAMOUNT + ' ');
		$(element).addClass("frmLabel required");
		$(element).appendTo('#fcyFields');

		//Adding input element for #amount
		element = document.createElement("input");
		$(element).attr("id", "amount");
		$(element).attr("name", "amount");
		$(element).attr("tabindex", "129");
		$(element).attr("maxLength", "14");
		$(element).attr("size", "10");
		$(element).attr("title", payToolTips.TT_PAYAMOUNT);
		$(element).attr("type", "text");
		$(element).addClass("amountBox rounded");
		$(element).change(function(){
			setCurrency(prdCurr, _mode)
		});
		
		$(element).appendTo('#fcyFields');

		//Adding span element for transaction currency
		element = document.createElement("span");
		$(element).attr("id", "amountCurrency");
		$(element).text("  " + prdCurr);
		$(element).appendTo('#fcyFields');
		$("<br/>").appendTo('#fcyFields');
	}
}
//Function to change the GUI of the payment entry detail screen as per the selection of the rate type field.
function getChangeRateTypeInfo(obj)
{
	if (document.getElementById("debitPaymentAmntFlag1").checked)
		CONTRACTREFNOSEEKPARAMS.ccyAmount = $('#amount').val();
	else
		CONTRACTREFNOSEEKPARAMS.ccyAmount = $('#debitCcyAmount').val();

	CONTRACTREFNOSEEKPARAMS.accountNumber = $('#accountNo').val();
	$("#lbl_debitCcyAmount").text('');
	$('#indicativeRateDiv').children().remove();

	//if contract rate is selected add contract ref field and remove indicative rate
	if ($('#rateType').val() == 1)
	{
		if ($("label[for='fxRate']"))
			$("label[for='fxRate']").remove();
		$('#lbl_fxRate').remove();
		$('#contractReference').children().remove();

		//Adding label for #contractRefNo
		element = document.createElement("label");
		$(element).attr("for", "contractRefNo");
		$(element).text(payLabels.LBL_CONTRACTREFNO + " ");
		$(element).addClass("frmLabel required");
		$(element).appendTo('#contractReference');

		//Adding input box for #contractRefNo
		element = document.createElement("input");
		$(element).attr("id", "contractRefNo");
		$(element).attr("name", "contractRefNo");
		$(element).attr("tabindex", "125");
		$(element).attr("maxLength", "20");
		$(element).attr("title", payToolTips.TT_CONTRACTREFNO);
		$(element).attr("type", "text");
		$(element).addClass("textBox w20 rounded");
		$(element).appendTo('#contractReference');
		
		//Adding seek anchor for #contractRefNo
		element = document.createElement("a");
		$(element).attr("id", "hrefid_contractRefNo");
		$(element).addClass("linkbox seeklink");
		$(element).click(function(){
			//getHostData('contractRefNo|dealRefId|hostRate|hostConvertedFromAmount|hostConvertedToAmount|dealClientId|hostSystem|groupCode',HOSTCONTRACTREFRENCE, 'fetchHostFX_seek_first.seek',CONTRACTREFNOSEEKPARAMS,callerIdBene,'fetchHostFX', '', 'updateHostDataInfo')
		
		getSeekJson('contractRefNo',CONTRACTREFNOSEEKID, 'contractReferenceNo_seek_first.seek', 
							CONTRACTREFNOSEEKPARAMS,callerIdBene,'contractRefNo');
		
		});
		
		$(element).appendTo('#contractReference');
	}
	else
	{ 
	    //Removing  #contractRefNo and calling the function to recalculate FX rate details.
		$('#contractReference').children().remove();
		getChangePayAmntInfo('getChangePayAmntInfo.formx', obj)
	}
}
 
//Function to get Bank product details through an ajax call.
function getChangeTxnCCYInfo(strUrl, obj)
{
	$.blockUI({ overlayCSS: {opacity: 0 }});
	var strData = {};
	strData["myProduct"] = $('#hProduct').val();
	strData["drCrFlag"] = $('#hDrCrFlag').val();
	strData["txnCurrency"] = $('#txnCurrency').val();
	strData[_CSRFTOK_NAME] = $('#' + _CSRFTOK_NAME).val();
	$.post(strUrl, strData, paintChangeTxnCCYInfo, "json");
	return false;
}
//Function to render the response of the ajax call and re-populate the bank product dropdown.
function paintChangeTxnCCYInfo(data)
{
	$.unblockUI();
	document.body.style.cursor = 'default';
	var tokenValue;
	tokenValue = data.OWASPCSRFTOKEN;
	$('#' + _CSRFTOK_NAME).val(tokenValue);

	if (data['bankProducts'])
	{
		var	myOptions = data.bankProducts;
		$("#bankProduct").empty();	
		$('#bankProduct').append('<option value="">Select Payment Product</option>'); 
		$(myOptions.rows).each(function(){
	        $('#bankProduct').append($('<option></option>').val(this.columns[0].value).html(this.columns[1].value));
		});   
	}
	if (!isEmpty($('#accCurrDiv').text()))
		getChangeDebitAccountInfo('getChangeDebitAccountInfo.formx', document.getElementById("txnCurrency"));
}
//Function to get indicative Rate and converted amount through an ajax call.
function getChangePayAmntInfo(strUrl, obj)
{
	var objId = obj.id;
	//only digits and period characters are allowed in amount field
	if (!isAmount(obj.value))
	{
		$(obj).val('');
		$(obj).focus();
		return false;
	}
	else
	{		
		var strData = {};
		var prdCurr;
		if (!isEmpty($('#txnCurrency').val()))
		{
			prdCurr = $('#txnCurrency option:selected').val();
		}
		else
		{
			prdCurr = $('#lbl_txnCurrency').text();
		}
	
		$('#amountCurrency').text('  ' + prdCurr);
		strData["rateType"] = $('#rateType').val();
		strData["debitPaymentAmntFlag"] = $('input[name=debitPaymentAmntFlag]:checked', '#frmMain').val();
		strData["txnCurrency"] = prdCurr;
		strData["accountCurrency"] = $('#accCurrDiv').text();
		strData["amount"] = $('#amount').val();
		strData["debitCcyAmount"] = $('#debitCcyAmount').val();
		strData["contractRefNo"] = $('#contractRefNo').val();
		strData["hostConvertedFromAmount"] = !isEmpty($('#hostConvertedFromAmount').val())
																				? $('#hostConvertedFromAmount').val() : 0;
		strData["hostRate"] = $('#hostRate').val();
		strData["dealClientId"] = $('#dealClientId').val();
		strData["hostSystem"] = $('#hostSystem').val();
		strData["groupCode"] = $('#groupCode').val();
		strData["fxRate"] = $('#fxRate').val();
		strData["hostConvertedToAmount"] = !isEmpty($('#hostConvertedToAmount').val())
																					? $('#hostConvertedToAmount').val() : 0;
		CONTRACTREFNOSEEKPARAMS.ccyAmount = $('#amount').val();
		strData[_CSRFTOK_NAME] = $('#' + _CSRFTOK_NAME).val();
		//if pay amount and debit equivalent fields are empty and not counter rate then do not give ajax call
		if ($('#rateType').val() == '0' && (!isEmpty($('#amount').val()) || !isEmpty($('#debitCcyAmount').val())))
		{
			$.blockUI({ overlayCSS: {opacity: 0 }});
			$.post(strUrl, strData, paintChangePayAmntInfo, "json");
		}
		else if ($('#rateType').val() == '1' && (!isEmpty($('#amount').val()) || !isEmpty($('#debitCcyAmount').val())))
			{
			$.blockUI({ overlayCSS: {opacity: 0 }});
			$.post(strUrl, strData, paintChangePayAmntInfo, "json");
			}
		else
		{
			$.unblockUI();
			document.body.style.cursor = 'default';
		}	
		return false;
	}	
}
//Function to render the response of the ajax call to get the indicative rate and converted amount if rate type is counter rate.
function paintChangePayAmntInfo(data)
{

	$.unblockUI();
	document.body.style.cursor = 'default';
	var tokenValue;
	tokenValue = data.OWASPCSRFTOKEN;
	$('#' + _CSRFTOK_NAME).val(tokenValue);

	if ($('#rateType').val() == "0" && data['fxInfo'])
	{
		if (data.fxInfo.fxRate)
		{
			$('#indicativeRateDiv').children().remove();

			//Adding label for #fxRate
			element = document.createElement("label");
			$(element).attr("for", "fxRate");
			$(element).text(payLabels.LBL_INDICATIVERATE + " ");
			$(element).addClass("frmLabel");
			$(element).appendTo('#indicativeRateDiv');

			//Adding span for #fxRate
			element = document.createElement("span");
			$(element).attr("id", "lbl_fxRate");
			$(element).text("");
			$(element).addClass("w16 rounded inline_block disabled");
			$(element).css("font-weight", "bold");
			$(element).appendTo('#indicativeRateDiv');

			$('#lbl_fxRate').text(data.fxInfo.fxRate); 
			if	($('input[name=debitPaymentAmntFlag]:checked').val() == "P")
				$('#lbl_debitCcyAmount').text(data.fxInfo.toAmount); 
			else
				$('#lbl_amount').text(data.fxInfo.toAmount); 
		}	
    }
	//in case of errors pop them up
	if (data['errors'])
		showErrors(data['errors']);
}
//Function to render the payment details entry screen as per selection of payment amount / debit equivalent radio button.
function getChangeDrEquivalentInfo(obj)
{
	var currentId = obj.id;
	var prdCurr;
	var element;
	if (!isEmpty($('#txnCurrency').val()))
		prdCurr = $('#txnCurrency option:selected').val();
	else
		prdCurr = $('#lbl_txnCurrency').text();

	$('#indicativeRateDiv').children().remove();
	if (currentId == 'debitPaymentAmntFlag2')
	{
		$('#drEquivalentAmnt').children().remove();
		$('#payAmnt').children().remove();

		//Making Debit Equivalent editable
		element = document.createElement("input");
		$(element).attr("id", "debitCcyAmount");
		$(element).attr("name", "debitCcyAmount");
		$(element).attr("tabindex", "132");
		$(element).attr("maxLength", "14");
		$(element).attr("size", "10");
		$(element).attr("title", payToolTips.TT_DR_EQUIVALENT);
		$(element).attr("type", "text");
		$(element).addClass("amountBox rounded");
		$(element).change(function(){
			getChangePayAmntInfo('getChangePayAmntInfo.formx', this)
		});
	
		$(element).appendTo('#drEquivalentAmnt');
		
		//Making Payment Amount readonly
		element = document.createElement("span");
		$(element).attr("id", "lbl_amount");
		$(element).text("0");
		$(element).addClass("amountBox rounded inline_block disabled");
		$(element).appendTo('#payAmnt');
	}
	else
	{
		$('#drEquivalentAmnt').children().remove();
		$('#payAmnt').children().remove();

		//Making Payment Amount editable
		element = document.createElement("input");
		$(element).attr("id", "amount");
		$(element).attr("name", "amount");
		$(element).attr("tabindex", "128");
		$(element).attr("maxLength", "14");
		$(element).attr("size", "10");
		$(element).attr("title", payToolTips.TT_PAYAMOUNT);
		$(element).attr("type", "text");
		$(element).addClass("amountBox rounded");
		$(element).change(function(){
			getChangePayAmntInfo('getChangePayAmntInfo.formx', this)
		});
		
		$(element).appendTo('#payAmnt');

		//Making Debit Equivalent readonly
		element = document.createElement("span");
		$(element).attr("id", "lbl_debitCcyAmount");
		$(element).text("0");
		$(element).addClass("amountBox rounded inline_block disabled");
		$(element).appendTo('#drEquivalentAmnt');
	}
 }
//Function to modify payment detail entry screen GUI as per the delivery mode selection.
function getDeliveryDetailsInfo(obj)
{
	$('#deliveryDetailsDiv').children().remove();
	if ($("label[for='coAuthPersonIC']").hasClass("required"))
		$("label[for='coAuthPersonIC']").removeClass("required");
	$("label[for='coAuthPersonName']").addClass("required");

	if (!obj.value)
	{
		if ($("label[for='coAuthPersonIC']").hasClass("required"))
			$("label[for='coAuthPersonIC']").removeClass("required");
		if ($("label[for='coAuthPersonName']").hasClass("required"))
			$("label[for='coAuthPersonName']").removeClass("required");
	}

	switch(obj.value)
	{
		case '0':
			if ($("label[for='coAuthPersonIC']").hasClass("required"))
				$("label[for='coAuthPersonIC']").removeClass("required");
			if ($("label[for='coAuthPersonName']").hasClass("required"))
				$("label[for='coAuthPersonName']").removeClass("required");
			break;

		case '6':
			if (!blnIsCashProduct)
				$("label[for='coAuthPersonIC']").addClass("required");
			break;
	}
	if (blnIsCashProduct)
		$("label[for='coAuthPersonIC']").addClass("required");

	if (blnIsCashProduct && (obj.value == '6' || obj.value == '8'))
	{
		if (obj.value == '8')
			DELIVERYBRANCHSEEKID  = nonSystemCashPickupBrSeekId;
		else
			DELIVERYBRANCHSEEKID  = systemCashPickupBrSeekId;
		//Adding label for #coDraweeBranch
		element = document.createElement("label");
		$(element).attr("for", "coCollBranch");
		$(element).text(payLabels.LBL_DRAWEEBRANCH + " ");
		$(element).addClass("frmLabel required");
		$(element).appendTo('#deliveryDetailsDiv');

		//Adding input box for #coDraweeBranch
		element = document.createElement("input");
		$(element).attr("id", "coCollBranch");
		$(element).attr("name", "coCollBranch");
		$(element).attr("tabindex", "142");
		$(element).attr("maxLength", "10");
		$(element).attr("title", payToolTips.TT_DRAWEEBRANCH);
		$(element).attr("type", "text");
		$(element).addClass("codeBox rounded");
		$(element).appendTo('#deliveryDetailsDiv');
		
		//Adding seek anchor for #coDraweeBranch
		element = document.createElement("a");
		$(element).attr("id", "hrefid_coCollBranch");
		$(element).addClass("linkbox seeklink");
		$(element).click(function(){
			getHelp('coCollBranch|coCollDraweeBranchDescSpan',DELIVERYBRANCHSEEKID, 'cashPickupbranch_seek_first.seek', '',callerIdBene,'cashPickupbranch','','getRecordWithoutSubmit')
		});
		$(element).appendTo('#deliveryDetailsDiv');

		//Adding span for Drawee Branch description
		element = document.createElement("span");
		$(element).attr("id", "coCollDraweeBranchDescSpan");
		$(element).text(" ");
		$(element).addClass("textbox inline rounded w24 disabled");
		$(element).appendTo('#deliveryDetailsDiv');
		$("<br/>").appendTo('#deliveryDetailsDiv');
	}
}
//Function to get Beneficiary information through an ajax call.
function getChangeBeneInfo(objJson, elementId)
{
	
	$.blockUI({ overlayCSS: {opacity: 0 }});
	var strData = {};
	if (objJson)
		getRecordWithoutSubmit(objJson, elementId);
	strData["drawerCode"] = $('#drawerCode').val();
	strData["drawerRegisteredFlag"] = $('#drawerRegisteredFlag').val();
	strData[_CSRFTOK_NAME] = $('#' + _CSRFTOK_NAME).val();
	$.post("getChangeBeneInfo.formx", strData, paintChangeBeneInfo, "json")
	 	.error(function() {$.unblockUI();});
	return false;
}
//Function to render the response of the ajax call to populate beneficiary information.
function paintChangeBeneInfo(data)
{

	if (! (data.elements && data.elements.beneData)) {
		cleanupBene();
		$.unblockUI();
		return;
	}
	
	$.unblockUI();
	document.body.style.cursor = 'default';
	var beneData;
	var tokenValue;
	tokenValue = data.OWASPCSRFTOKEN;
	$('#' + _CSRFTOK_NAME).val(tokenValue);
	//populate more details popup with bene details
	if (data.elements && data.elements.beneData)
	{
		beneData = data.elements.beneData;
		for (key in beneData)
		{
			if($('#lbl_beneficiary\\.' + key))
			{
				$('#lbl_beneficiary\\.' + key).text(beneData[key]);
			}
		}
		$('#lbl_drawerDescription').text(beneData["drawerDesc"]);
	
		//email flag is check then copy bene email to drawer email field in data entry screen
		if ($('#drawerMail'))
		{
			if (isEmpty($('#drawerMail').val()) && $('#emailFlag1').val() == 'Y')
				$('#drawerMail').val(beneData["beneEmailId"]);
		}
		if ($('#payLocation'))
		{
			if (isEmpty($('#payLocation').val()) && (strInstrument == 'PO' || strInstrument == 'DD' || isEmpty(strInstrument)))
				$('#payLocation').val(beneData["beneDefaultPayLoc"]);
		}
	}
}

function showErrors(errors)
{
	var element;
	//$('#pageTitle').after("<div id=\"messageArea\" class=\"errors\"><ul></ul></div><br/>");
	$('#errorMsg').children().remove();
	dlg = $('#errorDialog');
	$.each(errors, function(i, strErrMsg) {
		element = document.createElement("li");
		$(element).append(strErrMsg);
		$(dlg).children('ul').append(element);
	 });

	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:480, title:labels.errorsTitle,
					buttons: {Ok: function() {$(this).dialog('destroy');}}});
	dlg.dialog('open');
}

//Function to get Beneficiary information through an ajax call.
function updateHostDataInfo(objJson, elementId)
{
	if (objJson)
		getRecordWithoutSubmit(objJson, elementId);
	if (document.getElementById("debitPaymentAmntFlag1").checked)
	{
		$('#debitCcyAmount').val($('#hostConvertedFromAmount').val());
		$('#lbl_debitCcyAmount').text($('#hostConvertedFromAmount').val());
		
	}
	else
	{
		$('#amount').val($('#hostConvertedToAmount').val());
		$('#lbl_amount').text($('#hostConvertedFromAmount').val());
	}
	$('#fxRate').val() = $('#hostRate').val();
	return false;
}

//Ajax Call functions end here
function showBackPage(strUrl)
{
	var strUrl;
	var frm = document.forms["frmMain"];
	
	frm.target ="";
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
	return true;
}

function getAdhocBankSeek(elementId, seekId, strUrl, inputId, callerId, seekUrl, maxColumns)
{
	var strValue;
	var count = 0;
	var strAttr;
	var frm = document.forms["frmMain"];
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var parentElementArray = elementId.split("|");
	if(document.getElementById("adhocBeneficiary.beneBankType2").checked)
	elementId='adhocBeneficiary.orderPartyCode|adhocBeneficiary.lowValueClearing|adhocBeneficiary.highValueClearing|draweeBankDesc|draweeBranchDesc|adhocBeneficiary.beneBankAddress|adhocBeneficiary.beneBankCountry|adhocBeneficiary.beneBankCode|adhocBeneficiary.beneBranchCode'

	if(inputId != "")
		document.getElementById("seekInputs").value = inputId;
	else
		document.getElementById("seekInputs").value = '{}';

	document.getElementById("parentElementId").value = elementId;
	document.getElementById("code").value = document.getElementById(parentElementArray[0]).value;
	document.getElementById("formName").value = seekId;
	document.getElementById("callerId").value = callerId;
	document.getElementById("seekUrl").value = seekUrl;
	if(document.getElementById("maxColumns"))
		document.getElementById("maxColumns").value = maxColumns;
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";

	strAttr = "dependent=yes,scrollbars=yes,resizable=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=350,height=350";
	window.open ("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";	
}

function getSeek(elementId,seekId,strUrl,inputId,callerId,seekUrl,maxColumns)
{
	// process dialogs
	$('#AdhocOrderingPartyDialog').appendTo('#frmMain');
	$('#AdhocOrderingPartyDialog').hide();
	//commented for GCPANZSUP-251
	//$('#AdhocBeneficiaryDialog').appendTo('#frmMain');
	//$('#AdhocBeneficiaryDialog').hide();
	$('#dialogMode').val('0');
	// end of process dialog
	var parentElementArray = elementId.split("|");
	var strValue;
	var count=0;
	var strAttr;
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var frm = document.forms["frmMain"];
	if(inputId!="")
		document.getElementById("seekInputs").value = inputId;
	else
		document.getElementById("seekInputs").value = '{}';

	document.getElementById("parentElementId").value = elementId;
	document.getElementById("code").value = document.getElementById(parentElementArray[0]).value;
	document.getElementById("formName").value = seekId;
	document.getElementById("callerId").value = callerId;
	document.getElementById("seekUrl").value = seekUrl;
	if(document.getElementById("maxColumns"))
		document.getElementById("maxColumns").value = maxColumns;
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";

	strAttr = "dependent=yes,scrollbars=yes,resizable=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=350";
	window.open ("", "hWinSeek", strAttr);
	frm.submit();
}
function getSeekJson(elementId,seekId,strUrl,inputId,callerId,seekUrl,maxColumns)
{
	// process dialogs
	$('#AdhocOrderingPartyDialog').appendTo('#frmMain');
	$('#AdhocOrderingPartyDialog').hide();
	$('#AdhocBeneficiaryDialog').appendTo('#frmMain');
	$('#AdhocBeneficiaryDialog').hide();
	$('#dialogMode').val('0');
	// end of process dialog
	var parentElementArray = elementId.split("|");
	var strValue;
	var count=0;
	var strAttr;
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var frm = document.forms["frmMain"];
	if(inputId!="")
		document.getElementById("seekInputs").value = JSON.stringify(inputId);
	else
		document.getElementById("seekInputs").value = '{}';

	document.getElementById("parentElementId").value = elementId;
	document.getElementById("code").value = document.getElementById(parentElementArray[0]).value;
	document.getElementById("formName").value = seekId;
	document.getElementById("callerId").value = callerId;
	document.getElementById("seekUrl").value = seekUrl;
	if(document.getElementById("maxColumns"))
		document.getElementById("maxColumns").value = maxColumns;
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";

	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=350";
	window.open ("", "hWinSeek", strAttr);
	frm.submit();
}

function cleanupBene() {
	// reset the section name
	$('#lblBBeneficiaryDetails').text($('#lblBeneficiaryDetails').val());
	$('#drawerRegisteredFlag').val('R');
	$('#lbl_drawerDescription').text('');	
	$('#lbl_drawerDescription').html('&nbsp;');	
	$('#drawerCode').val('');	
	$('#lbl_drawerBankCode').text('');
	$('#lbl_drawerBranchCode').text('');
	$('#lbl_drawerAccountNo').text('');
	$('#lbl_beneficiaryBankDescription').text('');
	$('#lbl_beneficiaryBranchDescription').text('');
	$('#lbl_beneAccountCurrencyDescription').text('');
	$('#btnMoreDetails').removeAttr("disabled");
	$('#btnMoreDetails').removeClass('ui-state-disabled');
}

function getHelpBeneficiary(seekId,callerId,inputId, obj)
{
	
	if (obj != null)	
		createCookie("paymentstaborder", obj, 1);	
	
	cleanupBene();
	$('#lbl_iban').text($('#adhocBeneficiary\\.beneIban').val());
	
	var elementId ='drawerCode|lbl_drawerDescription|lbl_drawerAccountNo|lbl_beneAccountCurrencyDescription|lbl_drawerBankCode|lbl_beneficiaryBankDescription|lbl_drawerBranchCode|lbl_beneficiaryBranchDescription';
	var strUrl = 'beneficiary_seek_first.seek'
	var seekUrl = 'beneficiary';
	var maxColumns= '2';
	//commented for GCPANZSUP-251  
	// process dialogs
	//$('#AdhocOrderingPartyDialog').appendTo('#frmMain');
	//$('#AdhocOrderingPartyDialog').hide();
	//$('#AdhocBeneficiaryDialog').appendTo('#frmMain');
	//$('#AdhocBeneficiaryDialog').hide();
	//$('#dialogMode').val('0');
	// end of process dialog
	getSeek(elementId,seekId,strUrl,inputId,callerId,seekUrl,maxColumns);
}


function showEditPirHeader(strUrl)
{
	var frm = document.forms["frmMain"];
	$('#txnCurrency').val('');
	$('#referenceNo').val('');
	$('#amount').val('');
	$('#rateType').val('');
	$('#contractRefNo').val('');
	$('#accountNo').val('');
	$('#txnDate').val('');
	$('#txtIndex').val('');	
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showBackUrl(txnType, strUrl)
{
	if(txnType == 'QUICKPAY' || txnType == 'QUICKPAYSTI')
	{
		var frm = document.forms["backForm"];
		if (document.getElementById("pirMode") != null)
			$('#pirmode').val('');
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
	else
	{
		var frm = document.forms["frmMain"];
		$('#txnCurrency').val('');
		$('#referenceNo').val('');
		$('#amount').val('');
		$('#rateType').val('');
		$('#contractRefNo').val('');
		$('#accountNo').val('');
		$('#txnDate').val('');
		$('#txtIndex').val('');	
		$('#bankProduct').val('');
		if (document.getElementById("myProduct") != null)
			$('#myProduct').val('');	
		if (document.getElementById("pirMode") != null)
			$('#pirmode').val('');	
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
}

function showHideSaveBeneficiaryRegisteredFlag()
{
	var frm = document.forms['frmMain'];
	if ($("#saveBeneFlagImg").attr("src").indexOf('icon_checked.gif') != -1)
	{
		 $("#saveBeneFlagImg").attr({ 
	          src: "static/images/icons/icon_unchecked.gif"
	        });
		 $("#td_adhocBeneficiary\\.drawerCode").hide("slow");
		 $("#adhocBeneficiary\\.drawerCode").val('');
		 $("#drawerRegisteredFlag").val('A');
		 $("#adBeneLabel").removeClass('required');
	}
	else
	{
		 $("#saveBeneFlagImg").attr({ 
	          src: "static/images/icons/icon_checked.gif"
	        });
		 $("#td_adhocBeneficiary\\.drawerCode").show();
		 $("#drawerRegisteredFlag").val('S');
		 $("#adBeneLabel").addClass('required');
	}
	
}

function showHideSaveAdhocOPRegisteredFlag()
{
	var frm = document.forms['frmMain'];
	if ($("#saveOrderingPartyFlagImg").attr("src").indexOf('icon_checked.gif') != -1)
	{
		 $("#saveOrderingPartyFlagImg").attr({ 
	          src: "static/images/icons/icon_unchecked.gif"
	        });
		 $("#td_adhocOrderingPartyDetail\\.orderCode").hide("slow");
		 $("#adhocOrderingPartyDetail\\.orderCode").val('');
		 $("#orderingPartyRegisteredFlag").val('A');
	}
	else
	{
		 $("#saveOrderingPartyFlagImg").attr({ 
	          src: "static/images/icons/icon_checked.gif"
	        });
		 $("#td_adhocOrderingPartyDetail\\.orderCode").show();
		 $("#orderingPartyRegisteredFlag").val('S');
	}
	
}

function showHideSaveRegisteredBeneficiaryRegisteredFlag()
{
	var frm = document.forms['frmMain'];
	
}

function showHideLookupBeneneficiaryRegisteredFlag()
{}

function validateAdhocBeneficiary()
{
	if(document.getElementById("mypOrderingParty1").checked)
	{
		document.getElementById("adhocOrderingFlag1").disabled =false;
		document.getElementById("lbladhocOrderingFlag").disabled =false;
	}
	else
	{
		document.getElementById("adhocOrderingFlag1").disabled =true;
		document.getElementById("lbladhocOrderingFlag").disabled =true
	}	
}

function showList(strUrl)
{
	if(strTxnType=='BPPQ' || strTxnType=='BPIQ')
	{
		if(strTxnType=='BPPQ')
			strUrl='pirQueryInstructionList.form';
		else
			strUrl='instrQueryInstructionList.form';
		var frm = document.forms["frmMain"];
		frm.action = strUrl;
		frm.method = "POST";
		frm.submit();
	}
	else	
	{
		var frm = document.forms["frmMain"];
		frm.action = strUrl;
		frm.method = "POST";
		frm.submit();
	}
}

function saveInstruction(strUrl)
{

		var frm = document.forms["frmMain"];
		$('#AdhocOrderingPartyDialog').appendTo('#frmMain');
		$('#AdhocOrderingPartyDialog').hide();
		$('#AdhocBeneficiaryDialog').appendTo('#frmMain');
		$('#AdhocBeneficiaryDialog').hide();
		$('#dialogMode').val('0');
		document.getElementById("dialogMode").value='0';
		if (frm.pirMode)
			frm.pirMode.value = _pirMode;			
		var beneEnrichments = JSON.stringify(g_enJson);
		beneEnrichments = beneEnrichments.slice(1,beneEnrichments.length-1);				
		$('#beneEnrichments').val(JSON.stringify(g_enJson));		
		frm.target = "";
		frm.action = strUrl;
		frm.method = "POST";
		frm.submit();
}
function updateInstruction(strUrl)
{
	var frm = document.forms["frmMain"];
	$('#AdhocOrderingPartyDialog').appendTo('#frmMain');
	$('#AdhocBeneficiaryBankDialog').appendTo('#frmMain');
	$('#AdhocBeneficiaryDialog').appendTo('#frmMain');
	var beneEnrichments = JSON.stringify(g_enJson);
	beneEnrichments = beneEnrichments.slice(1,beneEnrichments.length-1);				
	$('#beneEnrichments').val(JSON.stringify(g_enJson));
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showAddNewForm(strUrl, obj)
{
	if (obj != null)	
		createCookie("paymentstaborder", obj.name, 1);	
		
	var frm = document.forms["frmMain"];
	// process dialogs
	$('#AdhocOrderingPartyDialog').appendTo('#frmMain');
	$('#AdhocOrderingPartyDialog').hide();
	$('#AdhocBeneficiaryDialog').appendTo('#frmMain');
	$('#AdhocBeneficiaryDialog').hide();
	$('#dialogMode').val('0');
	// end of process dialog
	
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}
function showReloadBankPrdChange(strUrl, obj)
{
	if (obj != null)	
		createCookie("paymentstaborder", obj.name, 1);	
		
	var frm = document.forms["frmMain"];
	// process dialogs
	$('#AdhocOrderingPartyDialog').appendTo('#frmMain');
	$('#AdhocOrderingPartyDialog').hide();
	$('#AdhocBeneficiaryDialog').appendTo('#frmMain');
	$('#AdhocBeneficiaryDialog').hide();
	$('#dialogMode').val('0');
	// end of process dialog
	
	$('#charges').val('');
	$('#payLocation').val('');	
	
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}

function reloadDebitAmtFlag(strUrl)
{
	var frm = document.forms["frmMain"];
	$('#amount').val('');
	$('#debitCcyAmount').val('');
	
	// process dialogs
	$('#AdhocOrderingPartyDialog').appendTo('#frmMain');
	$('#AdhocOrderingPartyDialog').hide();
	$('#AdhocBeneficiaryDialog').appendTo('#frmMain');
	$('#AdhocBeneficiaryDialog').hide();
	$('#dialogMode').val('0');
	// end of process dialog
	
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}

function reloadAdhocBene(strUrl)
{
	saveAdhocBeneficiary('1');
	$('#AdhocBeneficiaryDialog').parent().appendTo($('#frmMain'));
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showAddNewFormAdhocBene(strUrl)
{
	saveAdhocBeneficiary('1');
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showHistoryForm(strUrl, index)
{
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=300";

	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open ("", "hWinHistory", strAttr);
	frm.submit();
}

function showViewForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
	
	
function showEditForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

// Enable, Disable, Accept and Reject requests
function enableRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}

function disableRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function acceptRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}

function rejectRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}

// List navigation
function prevPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtCurrent").value = intPg;
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}

function nextPage(strUrl, intPg)
{
	document.getElementById("txtCurrent").value = intPg;
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}

// Details
function deleteDetail(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}

function viewDetailForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}

function editDetailForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}



function showAdhocBeneficiary(adhocBankflag)
{
	
	$('#AdhocBeneficiaryDialog').dialog( {autoOpen:false, height:'auto', width:800, title:showReceiverDetails, modal:true});
	$('#dialogMode').val('1');
	$('#AdhocBeneficiaryDialog').dialog('open');
	var pdtBeneficiaryRegisteredFlag= $('#drawerRegisteredFlag').val();
	if(pdtBeneficiaryRegisteredFlag=='A'){
		 $("#saveBeneFlagImg").attr({ 
	          src: "static/images/icons/icon_unchecked.gif"
	        });
		 $("#td_adhocBeneficiary\\.drawerCode").hide();
		}
	else if(pdtBeneficiaryRegisteredFlag=='S') {
		 $("#saveBeneFlagImg").attr({ 
	          src: "static/images/icons/icon_checked.gif"
	        });
		 $("#td_adhocBeneficiary\\.drawerCode").show();
	}
	else {
		 $("#saveBeneFlagImg").attr({ 
	          src: "static/images/icons/icon_unchecked.gif"
	        });
		 $("#td_adhocBeneficiary\\.drawerCode").hide();
	}
	if(document.getElementById("adhocBeneficiary.beneBankType2") != null)
		loadAdhocBeneBankType();
	
	onLoad(adhocBankflag);
}
function loadAdhocBeneBankType()
{
	 if (document.getElementById("adhocBeneficiary.beneBankType2").checked == true)
	   {
		 $('#td_adhocBeneficiary\\.orderPartyCode').parent().hide(); // bankBranchSearch
		 if (document.getElementById("adhocBeneficiary.beneBankCode"))
			 document.getElementById("adhocBeneficiary.beneBankCode").readOnly = false;
		 if (document.getElementById("adhocBeneficiary.beneBranchCode"))
			 document.getElementById("adhocBeneficiary.beneBranchCode").readOnly = false;
		 if (document.getElementById("adhocBeneficiary.beneBankBic"))
			 document.getElementById("adhocBeneficiary.beneBankBic").readOnly = false;
		 $('#bankAddr').show();
		 $('#bankCountry').show();
		 $('#td_adhocBeneficiary\\.beneBankAddress').parent().show();
		 $('#td_adhocBeneficiary\\.beneBankCountry').parent().show();
		 $('#td_adhocBeneficiary\\.lowValueClearing').parent().hide('slow');
		 $('#td_adhocBeneficiary\\.highValueClearing').parent().hide('slow');	
		 $('#lowVal').hide();
		 $('#highVal').hide();
	   }
	 else{
		 $('#td_adhocBeneficiary\\.orderPartyCode').parent().show(); // bankBranchSearch
		 if (document.getElementById("adhocBeneficiary.beneBankCode"))
			 document.getElementById("adhocBeneficiary.beneBankCode").readOnly = true;
		 if (document.getElementById("adhocBeneficiary.beneBranchCode"))
			 document.getElementById("adhocBeneficiary.beneBranchCode").readOnly = true;
		 if (document.getElementById("adhocBeneficiary.beneBankBic"))
			 document.getElementById("adhocBeneficiary.beneBankBic").readOnly = true;
		 $('#td_adhocBeneficiary\\.beneBankAddress').parent().hide('slow');
		 $('#td_adhocBeneficiary\\.beneBankCountry').parent().hide('slow');
		 $('#bankAddr').hide();
		 $('#bankCountry').hide();
		 $('#lowVal').show();
		 $('#highVal').show();
		 $('#td_adhocBeneficiary\\.lowValueClearing').parent().show();
		 $('#td_adhocBeneficiary\\.highValueClearing').parent().show();
		 if (document.getElementById("adhocBeneficiary.lowValueClearing"))
			 document.getElementById("adhocBeneficiary.lowValueClearing").readOnly = true;
		 if (document.getElementById("adhocBeneficiary.highValueClearing"))
			 document.getElementById("adhocBeneficiary.highValueClearing").readOnly = true;
	 }
}
function showRegisteredBeneficiary()
{
	
	$('#RegisteredBeneficiaryDialog').dialog( {autoOpen:false, height:'auto', width:800, title:'Registered Beneficiary Details', modal:true});
	$('#dialogMode').val('1');
	$('#RegisteredBeneficiaryDialog').dialog('open');
	$('#td_beneficiary\\.drawerCode').show();
	hideRegisteredBankType($('#registereddivType').val()); 
	
}
function changeTabVal()
{
	$("input#DisplayName").val($("input##adhocBeneficiary\\.drawerDesc").val());
}

function showAdhocOrderingParty33()
{
	$('#AdhocOrderingPartyDialog').dialog( {autoOpen:false, height:'auto', width:800, title:'Adhoc Ordering Party', modal:true});
	$('#dialogMode').val('3');
	$('#AdhocOrderingPartyDialog').dialog('open');
	
	var orderingPartyRegisteredFlag = $('#orderingPartyRegisteredFlag').val();
	
	if(orderingPartyRegisteredFlag=='A')
	{
		 $("#saveOrderingPartyFlagImg").attr({ 
	          src: "static/images/icons/icon_unchecked.gif"
	        });
		 $("#td_adhocOrderingPartyDetail\\.orderCode").hide("slow");
		 $("#adhocOrderingPartyDetail\\.orderCode").val('');
		 $("#orderingPartyRegisteredFlag").val('A');
	}
	else if(orderingPartyRegisteredFlag=='S')
	{
		 $("#saveOrderingPartyFlagImg").attr({ 
	          src: "static/images/icons/icon_checked.gif"
	        });
		 $("#td_adhocOrderingPartyDetail\\.orderCode").show();
		 $("#orderingPartyRegisteredFlag").val('S');
	}
	else
	{
		 $("#saveOrderingPartyFlagImg").attr({ 
	          src: "static/images/icons/icon_unchecked.gif"
	        });
		 $("#td_adhocOrderingPartyDetail\\.orderCode").hide();
	}
			
}

function hideBankType(radioval)
{
	 if (radioval.value=='A')
	   {
		 $('#td_adhocBeneficiary\\.orderPartyCode').parent().hide(); // bankBranchSearch
		 document.getElementById("adhocBeneficiary.beneBankCode").readOnly = false;
		 document.getElementById("adhocBeneficiary.beneBranchCode").readOnly = false;
		 document.getElementById("adhocBeneficiary.beneBankBic").readOnly = false;
		// document.getElementById("TypeofRouting").style.display= "visible";
		 $('#TypeofRouting').show();
		 //document.getElementById("adhocBeneficiary.beneRoutingFlag").readOnly = false;
		// $('#adhocBeneficiary.beneRoutingFlag').show();
		 $('#bankAddr').show();
		 $('#bankCountry').show();
		 $('#td_adhocBeneficiary\\.beneBankAddress').parent().show();
		 $('#td_adhocBeneficiary\\.beneBankCountry').parent().show();
		 // start reset bank Branch details
		 $('#adhocBeneficiary\\.beneBankCode').val('');
		 $('#adhocBeneficiary\\.beneBranchCode').val('');
		 $('#adhocBeneficiary\\.orderPartyCode').val('');
		 $('#adhocBeneficiary\\.beneBankAddress').val('');
		 $('#adhocBeneficiary\\.beneBankBic').val('');
		 $('#td_adhocBeneficiary\\.lowValueClearing').parent().hide('slow');
		 $('#td_adhocBeneficiary\\.highValueClearing').parent().hide('slow');	
		 $('#lowVal').hide();
		 $('#highVal').hide();
		 
		 document.getElementById("draweeBankDesc").innerHTML = '';
		 document.getElementById("draweeBranchDesc").innerHTML = '';
	   }
	 else{
		 $('#td_adhocBeneficiary\\.orderPartyCode').parent().show(); // bankBranchSearch
		 document.getElementById("adhocBeneficiary.beneBankCode").readOnly = true;
		 document.getElementById("adhocBeneficiary.beneBranchCode").readOnly = true;
		 document.getElementById("adhocBeneficiary.beneBankBic").readOnly = true;
		 $('#td_adhocBeneficiary\\.beneBankAddress').parent().hide('slow');
		 $('#td_adhocBeneficiary\\.beneBankCountry').parent().hide('slow');
		 //$('#adhocBeneficiary.beneRoutingFlag').attr("disabled", "disabled");
		 document.getElementById("TypeofRouting").style.display= "none";
		 $('#bankAddr').hide();
		 $('#bankCountry').hide();
		 $('#adhocBeneficiary\\.beneBankCode').val('');
		 $('#adhocBeneficiary\\.beneBranchCode').val('');
		 $('#adhocBeneficiary\\.orderPartyCode').val('');
		 $('#adhocBeneficiary\\.beneBankAddress').val('');
		 $('#adhocBeneficiary\\.beneBankBic').val('');
		 $('#lowVal').show();
		 $('#highVal').show();
		 $('#td_adhocBeneficiary\\.lowValueClearing').parent().show();
		 $('#td_adhocBeneficiary\\.highValueClearing').parent().show();
		 if (document.getElementById("adhocBeneficiary.lowValueClearing"))
			 document.getElementById("adhocBeneficiary.lowValueClearing").readOnly = true;
		 if (document.getElementById("adhocBeneficiary.highValueClearing"))
			 document.getElementById("adhocBeneficiary.highValueClearing").readOnly = true;
		 $('#adhocBeneficiary\\.lowValueClearing').val('');
		 $('#adhocBeneficiary\\.highValueClearing').val('');
	 }
}
function onLoad(adhocBankflag)
{
	if (adhocBankflag == 'true')
	{
		document.getElementById("adhocBeneficiary.beneBankType2").checked=false;
		document.getElementById("adhocBeneficiary.beneBankType2").disabled=true;
	}
}
function closeRegisteredBeneficiary()
{
	$('#RegisteredBeneficiaryDialog').dialog('close');
}
function hideRegisteredBankType(radioval)
{
	 if (radioval.value=='A')
	   {
		 $('#td_beneficiary\\.orderPartyCode').parent().hide(); // bankBranchSearch
		 $('#beneficiary\\.beneBankCode').removeAttr("disabled");
		 $('#td_beneficiary\\.beneBankAddress').parent().show();
		 $('#td_beneficiary\\.beneBankCountry').parent().show();
		 $('#td_adhocBeneficiary\\.lowValueClearing').parent().hide('slow');
		 $('#td_adhocBeneficiary\\.highValueClearing').parent().hide('slow');			 
	   }
	 else{
		 $('#td_beneficiary\\.orderPartyCode').parent().show(); // bankBranchSearch
		 $('#beneficiary\\.beneBankCode').attr("disabled", "disabled"); 
		 $('#td_beneficiary\\.beneBankAddress').parent().hide('slow');
		 $('#td_beneficiary\\.beneBankCountry').parent().hide('slow');
		 $('#td_adhocBeneficiary\\.lowValueClearing').parent().show();
		 $('#td_adhocBeneficiary\\.highValueClearing').parent().show();
		 if (document.getElementById("adhocBeneficiary.lowValueClearing"))
			 document.getElementById("adhocBeneficiary.lowValueClearing").readOnly = true;
		 if (document.getElementById("adhocBeneficiary.highValueClearing"))
			 document.getElementById("adhocBeneficiary.highValueClearing").readOnly = true;
	 }
}

function saveAdhocBeneficiary(strDialogMode)
{
	$('#dialogMode').val(strDialogMode);
	//document.getElementById("dialogMode").value=strDialogMode;
	var frm = document.forms["frmMain"];
	// update section lable
	$('#lblBBeneficiaryDetails').text($('#lblAdhocBeneficiaryDetails').val());
	// start copy details to frmmain
	$('#lbl_drawerDescription').text($('#adhocBeneficiary\\.drawerDesc').val());
	$('#drawerDescription').val($('#adhocBeneficiary\\.drawerDesc').val());
	$('#drawerCode').val( $('#adhocBeneficiary\\.drawerCode').val());	
	$('#lbl_drawerBankCode').text($('#adhocBeneficiary\\.beneBankCode').val());
	$('#lbl_drawerBranchCode').text($('#adhocBeneficiary\\.beneBranchCode').val());
	$('#lbl_drawerAccountNo').text($('#adhocBeneficiary\\.beneAcctNmbr').val());
	$('#lbl_beneficiaryBankDescription').text('');
	$('#lbl_beneficiaryBranchDescription').text('');
	$('#adhocBeneficiary\\.beneBankDesc').val($.trim($('#draweeBankDesc').text()));
	$('#adhocBeneficiary\\.beneBranchDesc').val($.trim($('#draweeBranchDesc').text()));
	$('#lbl_beneAccountCurrencyDescription').text($('#adhocBeneficiary\\.beneAccountCcy').val());
	$('#btnMoreDetails').attr("disabled", "disabled");
	$('#btnMoreDetails').addClass('ui-state-disabled');
	$('#lbl_iban').text($('#adhocBeneficiary\\.beneIban').val());
	
	var pdtBeneficiaryRegisteredFlag = $('#drawerRegisteredFlag').val();
	if (pdtBeneficiaryRegisteredFlag== '' ||pdtBeneficiaryRegisteredFlag == 'R' )
		$('#drawerRegisteredFlag').val('A');
	$('#AdhocBeneficiaryDialog').dialog('close');
}
function clearAdhocBeneForm()
{
	$('#adhocBeneficiary\\.drawerCode').val('');
	$('#adhocBeneficiary\\.drawerDesc').val('');
	$('#adhocBeneficiary\\.beneMobileNmbr').val('');
	$('#adhocBeneficiary\\.beneEmailId').val('');
	$('#adhocBeneficiary\\.beneResidentFlag').val('');
	$('#adhocBeneficiary\\.beneBankType').val('R');
	$('#adhocBeneficiary\\.orderPartyCode').val('');
	$('#adhocBeneficiary\\.beneBankCode').val('');
	$('#adhocBeneficiary\\.beneBranchCode').val('');
	$('#adhocBeneficiary\\.beneBankBic').val('');
	$('#adhocBeneficiary\\.beneBankAddress').val('');
	$('#adhocBeneficiary\\.beneBankCountry').val('');
	$('#adhocBeneficiary\\.beneAcctNmbr').val('');
	$('#adhocBeneficiary\\.beneAccountCcy').val('');
	$('#adhocBeneficiary\\.beneIban').val('');
	$('#adhocBeneficiary\\.beneAddr1').val('');
	$('#adhocBeneficiary\\.beneCountry').val('');
	$('#adhocBeneficiary\\.beneState').val('');
	$('#adhocBeneficiary\\.beneCity').val('');
	$('#adhocBeneficiary\\.benePost').val('0');
	$('#adhocBeneficiary\\.beneTeleNmbr').val('');
	$('#adhocBeneficiary\\.beneFaxNmbr').val('');
	$('#adhocBeneficiary\\.ivrCode').val('');
	$('#adhocBeneficiary\\.documentType').val('N');
	$('#adhocBeneficiary\\.documentId').val('');
	$('#adhocBeneficiary\\.corrBankType').val('R');
	$('#adhocBeneficiary\\.corrBankDetails1').val('');
	$('#adhocBeneficiary\\.corrBankDetails2').val('');
	$('#adhocBeneficiary\\.corrBankDetails3').val('');
	$('#adhocBeneficiary\\.corrBankDetails4').val('');
	$('#adhocBeneficiary\\.corrBankBic').val('');
	$('#adhocBeneficiary\\.corrBankNostroAcc').val('');
	$('#adhocBeneficiary\\.intBankType').val('R');
	$('#adhocBeneficiary\\.intBankDetails1').val('');
	$('#adhocBeneficiary\\.intBankDetails2').val('');
	$('#adhocBeneficiary\\.intBankDetails3').val('');
	$('#adhocBeneficiary\\.intBankDetails4').val('');
	$('#adhocBeneficiary\\.intBankBic').val('');
	$('#adhocBeneficiary\\.intBankNostroAcc').val('');
	$('input#DisplayName').val('');
	$('#draweeBankDesc').html('&nbsp;');
	$('#draweeBranchDesc').html('&nbsp;');
	$('#adhocBeneficiary\\.beneBankDesc').val('');
	$('#adhocBeneficiary\\.beneBranchDesc').val('');
}
function clearEmail()
{
	if (!document.getElementById("emailFlag1").checked)
	{
		$('#drawerMail').val('');
	}
}
function clearFax()
{
	if (!document.getElementById("faxFlag1").checked)
	{
		$('#drawerFax').val('');
	}
}
function clearIVR()
{
	if (document.getElementById("ivrFlag1") != null && !document.getElementById("ivrFlag1").checked)
	{
		$('#draweeIVR').val('');
	}
}
function clearSMS()
{
	if (!document.getElementById("smsFlag1").checked)
	{
		$('#drawerPhoneNo').val('');
	}
}
function saveAdhocOrderingParty(strDialogMode)
{	 
	$('#dialogMode').val('0');
	$('#orderingPartyId').val($('#adhocOrderingPartyDetail\\.orderCode').val());
	$('#lbl_orderingParty').text($('#adhocOrderingPartyDetail\\.orderDescription').val());
	$('#saveOrderingPartyFlagImg').val('A');
	if($("#orderingPartyRegisteredFlag")=='' || $("#orderingPartyRegisteredFlag")=='R')
	{
		$("#orderingPartyRegisteredFlag").val('A');
	}
	$('#dialogMode').val(strDialogMode);
	$('#AdhocOrderingPartyDialog').dialog('close');
	//document.getElementById("dialogMode").value=strDialogMode;
}


function closeAdhocBeneficiary()
{
	clearAdhocBeneForm();
	$('#dialogMode').val('0');
	$('#AdhocBeneficiaryDialog').dialog('close');
}
function closeAdhocOrderingParty()
{
	clearAdhocOrderingParty();
	$('#dialogMode').val('0');
	$('#AdhocOrderingPartyDialog').dialog('close');
	
}
function clearAdhocOrderingParty()
{
	$('#adhocOrderingPartyDetail\\.orderCode').val('');
	$('#adhocOrderingPartyDetail\\.orderDescription').val('');
	$('#adhocOrderingPartyDetail\\.mobileNmbr').val('');
	$('#adhocOrderingPartyDetail\\.emailIdNmbr').val('');
	$('#adhocOrderingPartyDetail\\.orderingPartyResidentFlag').val('R');
	$('#adhocOrderingPartyDetail\\.addr1').val('');
	$('#adhocOrderingPartyDetail\\.benCountry').val('');
	
	$('#adhocOrderingPartyDetail\\.benState').val('');
	$('#adhocOrderingPartyDetail\\.benCity').val('');
	$('#adhocOrderingPartyDetail\\.benPostCode').val('0');
	$('#adhocOrderingPartyDetail\\.telNmbr').val('');
	$('#adhocOrderingPartyDetail\\.faxNmbr').val('');
	$('#adhocOrderingPartyDetail\\.ivrCode').val('');
	$('#adhocOrderingPartyDetail\\.documentType').val('N');
	$('#adhocOrderingPartyDetail\\.documentId').val('');
}


function updateDebitAccountCurrency()
{
	var selObj = document.getElementById('accountNo');
	var selIndex = selObj.selectedIndex;
	document.getElementById('lbl_accountCurrency').innerHTML= debitAccountCurrencies[selIndex-1];
	

}

/**
 * 
 * @param strMesg -
 *            The message to be displayed in alert window
 * 
 * <pre id="example">
 * &lt;a href=&quot;javascript:showAdhocBeneficiaryPrompt('Please enter Bene Details ');&quot;&gt;Prompt&lt;/a&gt;
 *    

 */
function showAdhocOrderingParty(strMesg, strData, funcPointer)
{
    var retVal = "";
    $('#AdhocOrderingParty').modal({
		close:false,
		position: ["20%"],
		overlayId:'confirmModalOverlay',
		containerId:'confirmModalContainer',
		onShow: function (dialog) {
			dialog.data.find('.message').append(strMesg);
            dialog.data.find('.btnCancel').click(function() {
                $.modal.close();
            });
			// if the user clicks "yes"
			dialog.data.find('.btnOk').click(function() {
				// close the dialog
				//document.getElementById('txtInput').value;
				retVal = jQuery().find('#txtInput').attr("value");
				$.modal.close();
                // funcPointer(strData, retVal);
			});
		}
	});
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
function getRecord(json, elementId, fptrCallback)
{		  
	if (!isEmpty(fptrCallback) && typeof window[fptrCallback] === 'function')
		window[fptrCallback](json, elementId);
	else
	{
		var myJSONObject = JSON.parse(json);
	    var inputIdArray = elementId.split("|");
	    for(i=0; i<inputIdArray.length; i++)
		{
	    	var field = inputIdArray[i];

			if(IsJsonString(myJSONObject))
			{
				myJSONObject = JSON.parse(myJSONObject);
			}

	    	
			
			if(document.getElementById(inputIdArray[i]) && myJSONObject.columns[i])
	    	{

	    	var type = document.getElementById(inputIdArray[i]).type;
	    	if(type=='text' || type=='hidden'){
	    	 document.getElementById(inputIdArray[i]).value= myJSONObject.columns[i].value;}
	    	else {
	    	 document.getElementById(inputIdArray[i]).innerHTML= myJSONObject.columns[i].value;} 
	    	}
		}
	    var reloadUrl =document.getElementById("RELOADURL").value; 
	    var frm = window.document.forms["frmMain"]; 
	    frm.method = "POST";
	    frm.action = reloadUrl;	 
	    frm.target = "";
		frm.submit();
    }
}

function getBankBranchRecord(json, elementId)
{		  
	var myJSONObject = JSON.parse(json);
    var inputIdArray = elementId.split("|");
    for(i=0; i<inputIdArray.length - 1; i++)
	{
    	var field = inputIdArray[i];		
    	if(inputIdArray[i+1] != null && document.getElementById(inputIdArray[i+1]) && myJSONObject.columns[i])
    	{
			var type = document.getElementById(inputIdArray[i+1]).type;
			if(type=='text' || type=='textarea' || type == 'hidden')
			{
				if (myJSONObject.columns[i].value != undefined)
					document.getElementById(inputIdArray[i+1]).value=myJSONObject.columns[i].value;
				if (myJSONObject.columns[i].value == undefined)
					document.getElementById(inputIdArray[i+1]).value='';
			}
			else if (type=='select-one')
			{
				var list =  document.getElementById(inputIdArray[i+1]);
				for(var j = 0; j < list.options.length; ++j)
				{
					if (list.options[j].value == myJSONObject.columns[i].value)
						list.options[j].selected = "selected";
				}
			}
			else
			{
				document.getElementById(inputIdArray[i+1]).innerHTML=myJSONObject.columns[i].value;
			} 
    	}
	}   
}

function getCityRecord(objJson, elementId)
{		  
	var myJSONObject = JSON.parse(objJson);
    var inputIdArray = elementId.split("|");
    for(i=0; i<inputIdArray.length; i++)
	{
    	var field = inputIdArray[i];
    	if (document.getElementById(inputIdArray[i]) && myJSONObject.columns[i])
    	{
    		var type = document.getElementById(inputIdArray[i]).type;
	    	if(type=='text' || type=='hidden')
	    		document.getElementById(inputIdArray[i]).value= myJSONObject.columns[i].value;
	    	else
	    		document.getElementById(inputIdArray[i]).innerHTML= myJSONObject.columns[i].value;
    	}
	}

    var frm = document.forms["frmMain"]; 
    frm.target = "";
}

function addEnrichments(strUrl)
{
	var frm = document.forms["frmMain"]; 	
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function saveEnrichment(strUrl)
{
	var frm = document.forms["frmMain"]; 	
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showInstruemntDetail(strUrl)
{
	var frm = document.forms["frmMain"]; 	
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

// to Update enrichment Details
function UpdateMultiEnrichmentDetail(index, strUrl, serialNbr)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	document.getElementById("serialNumber").value = serialNbr;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

//to Update enrichment Details
function UpdateEnrichmentDetail(index, strUrl)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;	
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function updateDrawerDeliveryMode()
{
	var drawerDeliveryMode = $("#drawerDeliveryMode").val();
	if(drawerDeliveryMode=='6' || drawerDeliveryMode=='8')
	{
		$("label[for='coAuthPersonName']").addClass("required");
		$("label[for='coAuthPersonIC']").addClass("required");
		$("label[for='coCollBranch']").addClass("required");
	}
	else
	{
		$("label[for='coAuthPersonName']").removeClass("required");
		$("label[for='coAuthPersonIC']").removeClass("required");
		$("label[for='coCollBranch']").removeClass("required");
	}
}

function setorderingPartyRegisteredFlag()
{
	$("#orderingPartyRegisteredFlag").val('R');
}

function changeLabelAndBnkPrd(strUrl, radioVal)
{
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function acceptTerms()
{
    var satisfied = $('#chkBoxUserAcceptance').is(':checked');
    if (satisfied){
    	$('#btnSaveClose').removeAttr('disabled');
    	$('#btnClose').removeAttr('disabled');
    	$('#btnSaveClose').button("enable")
    	$('#btnClose').button("enable")
    }
    else{ 
    	$('#btnSaveClose').attr('disabled', 'disabled');
    	$('#btnClose').attr('disabled', 'disabled');
    	$('#btnSaveClose').button("disable")
    	$('#btnClose').button("disable")
    	}
}

function refreshButtons(actStatus, module)
{
	if (_module != module)
		return false;
	var strPopultedButtons = arrInst[actStatus];
	var strActionButtons;
	// DO THE ANDING WITH SERVER BITMAP
	if (!strPopultedButtons) strPopultedButtons = "000000000";
	strActionButtons = performAnd(strPopultedButtons,_strServerBitmap);
	var i=0;
	if (strActionButtons.length > 0)
	{
		for (i=0; i<9; i++)
		{
			switch (i)
			{
				case 0: 
					if (strActionButtons.charAt(i)*1 ==1)
						document.getElementById("btnClose").className ="imagelink black inline_block button-icon icon-button-submit font_bold";
					else
						document.getElementById("btnClose").className ="imagelink grey inline_block button-icon icon-button-submit-grey font-bold";
					break;

				case 1: 
					if (strActionButtons.charAt(i)*1 ==1)
						document.getElementById("btnAuth").className ="imagelink black inline_block button-icon icon-button-accept font_bold";
					else
						document.getElementById("btnAuth").className ="imagelink grey inline_block button-icon icon-button-accept-grey font-bold";
					break;

				case 2: 
					if (document.getElementById("btnReject"))
					{
						if (strActionButtons.charAt(i)*1 ==1)
							document.getElementById("btnReject").className ="imagelink black inline_block button-icon icon-button-reject font_bold";
						else
							document.getElementById("btnReject").className ="imagelink grey inline_block button-icon icon-button-reject-grey font-bold";
					}
					break;

				case 3: 
					if (strActionButtons.charAt(i)*1 ==1)
						document.getElementById("btnSend").className ="imagelink black inline_block button-icon icon-button-send font_bold";
					else
						document.getElementById("btnSend").className ="imagelink grey inline_block button-icon icon-button-send-grey font-bold";
					break;

				case 4: 
					if (document.getElementById("btnDiscard"))
					{
						if (strActionButtons.charAt(i)*1 ==1)
							document.getElementById("btnDiscard").className ="imagelink black inline_block button-icon icon-button-discard font_bold";
						else
							document.getElementById("btnDiscard").className ="imagelink grey inline_block button-icon icon-button-discard-grey font-bold";
					}
					break;

				case 5: 
					if (document.getElementById("btnHold"))
					{
						if (strActionButtons.charAt(i)*1 ==1)
							document.getElementById("btnHold").className ="imagelink black inline_block button-icon icon-button-hold font_bold";
						else
							document.getElementById("btnHold").className ="imagelink grey inline_block button-icon icon-button-hold-grey font-bold";
					}
					break;

				case 6: 
					if (document.getElementById("btnRelease"))
					{
						if (strActionButtons.charAt(i)*1 ==1)
							document.getElementById("btnRelease").className ="imagelink black inline_block button-icon icon-button-relese font_bold";
						else
							document.getElementById("btnRelease").className ="imagelink grey inline_block button-icon icon-button-release-grey font-bold";
					}
					break;

				case 7: 
					if (document.getElementById("btnStop"))
					{
						if (strActionButtons.charAt(i)*1 ==1)
							document.getElementById("btnStop").className ="imagelink black inline_block button-icon icon-button-stop font_bold";
						else
							document.getElementById("btnStop").className ="imagelink grey inline_block button-icon icon-button-stop-grey font-bold";
					}
					break;

				case 8: 
					if (document.getElementById("btnVerify"))
					{
						if (strActionButtons.charAt(i)*1 ==1)
							document.getElementById("btnVerify").className ="imagelink black inline_block button-icon icon-button-accept font_bold";
						else
							document.getElementById("btnVerify").className ="imagelink grey inline_block button-icon icon-button-accept-grey font-bold";
					}
					break;
			}
		}
	}	
}

function performAnd(validAction,currentAction)
{
	var strOut="";
	var i=0;
	if (validAction.length = currentAction.length)
	{
		for (i=0; i<9; i++)
		{
			strOut = strOut +((validAction.charAt(i)*1) && (currentAction.charAt(i)*1));
		}
	}
	return strOut;
}

String.prototype.startsWith = function(str) 
{return (this.match("^"+str)==str)}

function checkTestingIndicator(chekcvalue)
{
	if (chekcvalue.value=='F')
	{
		document.getElementById("testingIndicator2").checked = false; 
	}
	else if (chekcvalue.value=='A')
	{
		document.getElementById("testingIndicator1").checked = false; 
	}
}

function authDtlRecord(me, txn_sign_appl)
{
	var actionName ;
	if (txn_sign_appl == "Y")
	{
		actionName = "acceptSignInstMultiAction.form";
	}
	else
	{
		actionName = "acceptInstMultiAction.form";	
	}
	if (me.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = actionName;
	frm.method = "POST";
	frm.submit();
}

function sendDtlRecord(me)
{
	if (me.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = "sendInstMultiAction.form";
	frm.method = "POST";
	frm.submit();
}

function stopDtlRecord(me)
{
	var temp = document.getElementById("btnStop");
	if (temp.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = "stopInstMultiAction.form";
	frm.method = "POST";
	frm.submit();
}

function deleteDtlRecord(me, scrapTitle, scrapMsg)
{
	var temp = document.getElementById("btnDiscard");
	if (temp.className.startsWith("imagelink grey"))
		return;
	getRemarks(230,scrapTitle, scrapMsg, [0], scrapInstRecord);
}

function scrapInstRecord(arrData, strRemarks)
{
	var frm = document.forms["frmMain"]; 
	if (strRemarks.length > 255 || isEmpty(strRemarks))
	{
		alert("Scrap Remarks Length should be between 1 and 255 Characters!");	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		document.getElementById("txtIndex").value = arrData[0];
		frm.target ="";
		frm.action = "deleteInstMultiAction.form";
		frm.method = "POST";
		frm.submit();
	}
}

function rejectDtlRecord(me, rejTitle, rejMsg)
{
	var temp = document.getElementById("btnReject");
	if (temp.className.startsWith("imagelink grey"))
		return;
	
	getRemarks(230,rejTitle, rejMsg, [0], rejectInstRecord);
}

function rejectInstRecord(arrData, strRemarks)
{
	var frm = document.forms["frmMain"]; 

	if (strRemarks.length > 255 || isEmpty(strRemarks))
	{
		alert("Reject Remarks Length should be between 1 and 255 Characters!");	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		document.getElementById("txtIndex").value = arrData[0];
		frm.target = "";
		frm.action = "rejectInstMultiAction.form";
		frm.method = 'POST';
		frm.submit();
	}
}

function getHostData(elementId,seekId,strUrl,inputId,callerId,seekUrl,maxColumns)
{
	// process dialogs
	$('#AdhocOrderingPartyDialog').appendTo('#frmMain');
	$('#AdhocOrderingPartyDialog').hide();
	$('#AdhocBeneficiaryDialog').appendTo('#frmMain');
	$('#AdhocBeneficiaryDialog').hide();
	$('#dialogMode').val('0');
	// end of process dialog
	var parentElementArray = elementId.split("|");
	var strValue;
	var count=0;
	var strAttr;
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var frm = document.forms["frmMain"];
	var cmsTxnId = document.getElementById("cmsTransactionId").value;
	if(inputId!="")
		document.getElementById("seekInputs").value=JSON.stringify(inputId);
	else
		document.getElementById("seekInputs").value = '{}';
	document.getElementById("parentElementId").value = elementId;
	document.getElementById("code").value = document.getElementById(parentElementArray[0]).value;
	document.getElementById("formName").value = seekId;
	document.getElementById("callerId").value = callerId;
	document.getElementById("seekUrl").value = seekUrl;
	document.getElementById("cmsTransactionId").value = cmsTxnId;
	if(document.getElementById("maxColumns"))
		document.getElementById("maxColumns").value = maxColumns;
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";

	strAttr = "dependent=yes,scrollbars=yes,resizable=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=350";
	window.open ("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";
}

function getCounterValue()
{
	document.getElementById("rateType").value = "0";
	document.getElementById("contractRefNo").value = "";
	var strUrl =  document.getElementById("RELOADURL").value ;
	showAddNewForm(strUrl);
}

function setNextFocus(cookie)
{
	//alert(document.forms["frmMain"].elements[cookie].name);
	document.forms["frmMain"].elements[cookie].focus();
}

function holdDtlRecord(me, holdTitle, holdMsg)
{
	var temp = document.getElementById("btnHold");
	if (temp.className.startsWith("imagelink grey"))
		return;
	
	getRemarks(230,holdTitle, holdMsg, [0], holdInstRecord);
}

function holdInstRecord(arrData, strRemarks)
{
	var frm = document.forms["frmMain"]; 

	if (strRemarks.length > 255 || isEmpty(strRemarks))
	{
		alert("Reject Remarks Length should be between 1 and 255 Characters!");	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		document.getElementById("txtIndex").value = arrData[0];
		frm.target = "";
		frm.action = "holdInstMultiAction.form";
		frm.method = 'POST';
		frm.submit();
	}
}

function releaseDtlRecord(me, relTitle, relMsg)
{
	var temp = document.getElementById("btnRelease");
	if (temp.className.startsWith("imagelink grey"))
		return;
	
	getRemarks(230,relTitle, relMsg, [0], releaseInstRecord);
}

function releaseInstRecord(arrData, strRemarks)
{
	var frm = document.forms["frmMain"]; 

	if (strRemarks.length > 255 || isEmpty(strRemarks))
	{
		alert("Reject Remarks Length should be between 1 and 255 Characters!");	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		document.getElementById("txtIndex").value = arrData[0];
		frm.target = "";
		frm.action = "releaseInstMultiAction.form";
		frm.method = 'POST';
		frm.submit();
	}
}

function showDenomForm(strUrl)
{
	var frm = document.forms["frmMain"]; 	
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function ProcessDetail(arrData)
{
	var frm = document.forms["frmMain"]; 
	frm.target = "";
//	document.getElementById("txtIndex").value = index;
	document.getElementById("prdCutoffFlag").value = 'Y';
	frm.action = arrData[0];
	frm.method = "POST";
	frm.submit();
}

function hideCorrBankType(radioval)
{
	 if (radioval.value=='A')
	 {
		 $('#adhocBeneficiary\\.corrBankDetails1').removeAttr("readonly");
		 $('#adhocBeneficiary\\.corrBankDetails2').removeAttr("readonly");
		 $('#adhocBeneficiary\\.corrBankDetails3').removeAttr("readonly");
		 $('#adhocBeneficiary\\.corrBankDetails4').removeAttr("readonly");
		 $('#receivercorrbankseek').hide();
		 // start reset bank Branch details
		 $('#adhocBeneficiary\\.corrBankDetails1').val('');
		 $('#adhocBeneficiary\\.corrBankDetails2').val('');
		 $('#adhocBeneficiary\\.corrBankDetails3').val('');
		 $('#adhocBeneficiary\\.corrBankDetails4').val('');
		 $('#adhocBeneficiary\\.corrBankBic').val('');
	 }
	 else
	 {
		 $('#adhocBeneficiary\\.corrBankDetails1').attr("readonly", "readonly"); 
		 $('#adhocBeneficiary\\.corrBankDetails2').attr("readonly", "readonly"); 
		 $('#adhocBeneficiary\\.corrBankDetails3').attr("readonly", "readonly");
		 $('#adhocBeneficiary\\.corrBankDetails4').attr("readonly", "readonly");
		 $('#receivercorrbankseek').show();
		 $('#adhocBeneficiary\\.corrBankDetails1').val('');
		 $('#adhocBeneficiary\\.corrBankDetails2').val('');
		 $('#adhocBeneficiary\\.corrBankDetails3').val('');
		 $('#adhocBeneficiary\\.corrBankDetails4').val('');
		 $('#adhocBeneficiary\\.corrBankBic').val('');
	 }
}

function hideIntBankType(radioval)
{
	 if (radioval.value=='A')
	 {
		 $('#adhocBeneficiary\\.intBankDetails1').removeAttr("readonly");
		 $('#adhocBeneficiary\\.intBankDetails2').removeAttr("readonly");
		 $('#adhocBeneficiary\\.intBankDetails3').removeAttr("readonly");
		 $('#adhocBeneficiary\\.intBankDetails4').removeAttr("readonly");
		 $('#intermediarybankseek').hide();
		 // start reset bank Branch details
		 $('#adhocBeneficiary\\.intBankDetails1').val('');
		 $('#adhocBeneficiary\\.intBankDetails2').val('');
		 $('#adhocBeneficiary\\.intBankDetails3').val('');
		 $('#adhocBeneficiary\\.intBankDetails4').val('');
		 $('#adhocBeneficiary\\.intBankBic').val('');
	 }
	 else
	 {
		 $('#adhocBeneficiary\\.intBankDetails1').attr("readonly", "readonly"); 
		 $('#adhocBeneficiary\\.intBankDetails2').attr("readonly", "readonly"); 
		 $('#adhocBeneficiary\\.intBankDetails3').attr("readonly", "readonly");
		 $('#adhocBeneficiary\\.intBankDetails4').attr("readonly", "readonly");
		 $('#intermediarybankseek').show();
		 $('#adhocBeneficiary\\.intBankDetails1').val('');
		 $('#adhocBeneficiary\\.intBankDetails2').val('');
		 $('#adhocBeneficiary\\.intBankDetails3').val('');
		 $('#adhocBeneficiary\\.intBankDetails4').val('');
		 $('#adhocBeneficiary\\.intBankBic').val('');
	 }
}

// Added below functions for showing swift msg popup
function clearSwiftLines()
{
	$('#line1').val('');
	$('#line2').val('');
	$('#line3').val('');
	$('#line4').val('');
}

function showSwiftMsg50(code)
{
	var dlg = $('#swiftMsgDiv');
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:500,title : 'Swift Message Info - Tag <50a>',
					buttons: {Close: function() {$(this).dialog('close'); }}});
	dlg.dialog('open');
	clearSwiftLines();
	refreshSwiftMsg50(code);
}

function refreshSwiftMsg50(code)
{
	var orderCode = document.getElementById("adhocOrderingPartyDetail.orderDescription");
	var add1 = document.getElementById("adhocOrderingPartyDetail.addr1");
	var benCountry = document.getElementById("adhocOrderingPartyDetail.benCountry");
	var benState = document.getElementById("adhocOrderingPartyDetail.benState");
	var benCity = document.getElementById("adhocOrderingPartyDetail.benCity");
	var benPostCode = document.getElementById("adhocOrderingPartyDetail.benPostCode");
	var line4;
	if (orderCode != null)
		document.getElementById("line1").value = orderCode.value;
	else
		document.getElementById("line1").value = code;
	if (add1 != null)
	{
		document.getElementById("line2").value = add1.value.substring(0,35);;
		document.getElementById("line3").value = add1.value.substring(35,70);;
	}
	if (benCountry != null)
		line4 = benCountry.value.substring(0,10);
	if (benState != null)
		line4 = line4 + benState.value.substring(0,10);
	if (benCity != null)
		line4 = line4 + benCity.value.substring(0,10);
	if (benPostCode != null)
		line4 = line4 + benPostCode.value.substring(0,6);
	if (line4 != null)
	document.getElementById("line4").value = line4.substring(0,35); 
}

function showSwiftMsg57()
{
	var dlg = $('#swiftMsgDiv');
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:500,title : 'Swift Message Info - Tag <57a>',
					buttons: {Close: function() {$(this).dialog('close'); }}});
	dlg.dialog('open');
	clearSwiftLines();
	adhocBankSwiftMsg();
}

function adhocBankSwiftMsg()
{
	var beneBranchCode = document.getElementById("adhocBeneficiary.beneBranchCode");
	var add1 = document.getElementById("adhocBeneficiary.beneBankAddress");
	var benCountry = document.getElementById("adhocBeneficiary.beneBankCountry");
	var line4;
	if (beneBranchCode != null)
		document.getElementById("line1").value = beneBranchCode.value.substring(0,35);
	if (add1 != null)
	{
		document.getElementById("line2").value = add1.value.substring(0,35);
		document.getElementById("line3").value = add1.value.substring(35,70);
		line4 = add1.value.substring(70,95);
	}
	if (benCountry != null)
		line4 = line4 + benCountry.value.substring(0,10);
	if (line4 != null)
	document.getElementById("line4").value = line4.substring(0,35); 
}

function showSwiftMsg59(code)
{
	var dlg = $('#swiftMsgDiv');
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:500,title : 'Swift Message Info - Tag <59a>',
					buttons: {Close: function() {$(this).dialog('close'); }}});
	dlg.dialog('open');
	clearSwiftLines();
	adhocPopulateSwiftMsg59(code);
}

function adhocPopulateSwiftMsg59(code)
{
	var drawerCode = document.getElementById("adhocBeneficiary.drawerDesc");
	var add1 = document.getElementById("adhocBeneficiary.beneAddr1");
	var benCountry = document.getElementById("adhocBeneficiary.beneCountry");
	var benState = document.getElementById("adhocBeneficiary.beneState");
	var benCity = document.getElementById("adhocBeneficiary.beneCity");
	var benPostCode = document.getElementById("adhocBeneficiary.benePost");
	var line4;
	if (drawerCode != null)
		document.getElementById("line1").value = drawerCode.value;
	else
		document.getElementById("line1").value = code;
	if (add1 != null)
	{
		document.getElementById("line2").value = add1.value.substring(0,35);
		document.getElementById("line3").value = add1.value.substring(35,70);
	}
	if (benCountry != null)
		line4 = benCountry.value.substring(0,10);
	if (benState != null)
		line4 = line4 + benState.value.substring(0,10);
	if (benCity != null)
		line4 = line4 + benCity.value.substring(0,10);
	if (benPostCode != null)
		line4 = line4 + benPostCode.value.substring(0,6);
	if (line4 != null)
		document.getElementById("line4").value = line4.substring(0,35); 
}

function registerBankSwiftMsg57()
{
	var dlg = $('#swiftMsgDiv');
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:500,title : 'Swift Message Info - Tag <59a>',
					buttons: {Close: function() {$(this).dialog('close'); }}});
	dlg.dialog('open');
	clearSwiftLines();
	
	var beneBranchCode = document.getElementById("lbl_beneficiary.beneBranchCode");
	var add1 = document.getElementById("lbl_beneficiary.beneBankAddress");
	var benCountry = document.getElementById("lbl_beneficiary.beneBankCountry");
	var line4;
	if (beneBranchCode != null)
		document.getElementById("line1").value = beneBranchCode.innerText.substring(0,35);
	if (add1 != null)
	{
		document.getElementById("line2").value = add1.innerText.substring(0,35);
		document.getElementById("line3").value = add1.innerText.substring(35,70);
		line4 = add1.innerText.substring(70,95);
	}
	if (benCountry != null)
		line4 = line4 + benCountry.innerText.substring(0,10);
	if (line4 != null)
		document.getElementById("line4").value = line4.substring(0,35); 
}

function registerSwiftMsg59(code)
{
	var dlg = $('#swiftMsgDiv');
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:500,title : 'Swift Message Info - Tag <59a>',
					buttons: {Close: function() {$(this).dialog('close'); }}});
	dlg.dialog('open');
	clearSwiftLines();
	
	var drawerCode = document.getElementById("lbl_beneficiary.drawerDesc");
	var add1 = document.getElementById("lbl_beneficiary.beneAddr1");
	var benCountry = document.getElementById("lbl_beneficiary.beneCountry");
	var benState = document.getElementById("lbl_beneficiary.beneState");
	var benCity = document.getElementById("lbl_beneficiary.beneCity");
	var benPostCode = document.getElementById("lbl_beneficiary.benePost");
	var line4;
	if (drawerCode != null)
		document.getElementById("line1").value = drawerCode.innerText;
	else
		document.getElementById("line1").value = code;
	if (add1 != null)
	{
		document.getElementById("line2").value = add1.innerText.substring(0,35);
		document.getElementById("line3").value = add1.innerText.substring(35,70);
	}
	if (benCountry != null)
		line4 = benCountry.innerText.substring(0,10);
	if (benState != null)
		line4 = line4 + benState.innerText.substring(0,10);
	if (benCity != null)
		line4 = line4 + benCity.innerText.substring(0,10);
	if (benPostCode != null)
		line4 = line4 + benPostCode.innerText.substring(0,6);
	if (line4 != null)
		document.getElementById("line4").value = line4.substring(0,35); 
}

function verifyRecord(me)
{
	if (me.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = "verifyInstMultiAction.form";
	frm.method = "POST";
	frm.submit();
}

function limitChars(textid, limit) 
{ 
var text = $('#'+textid).val();  
var textlength = text.length; 
 if(textlength > limit) 
 { 
	 $('#'+textid).val(text.substr(0,limit));  
	 return false; 
	 } 
	 else 
	 { 
	 return true; 
	 } 
}
function showTxnReport(url)
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = url;
	frm.method = "POST";
	frm.submit();
}
function clearCoCollBranch(strUrl,obj)
{
	if (obj != null)	
		createCookie("paymentstaborder", obj.name, 1);	
	
	var frm = document.forms["frmMain"];
	// process dialogs
	$('#AdhocOrderingPartyDialog').appendTo('#frmMain');
	$('#AdhocOrderingPartyDialog').hide();
	$('#AdhocBeneficiaryDialog').appendTo('#frmMain');
	$('#AdhocBeneficiaryDialog').hide();
	$('#dialogMode').val('0');
	// end of process dialog
	
	$('#coCollBranch').val('');
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
		
}
var gstrPeriod,gstrRef,gstrFreq;
var PeriodWeekArray =  new Array("('Weekly',1)","('Every 2nd Week',2)","('Every 3rd Week',3)","('Every 4th Week',4)");
var MonthlyPeriodArray =  new Array("('Monthly',1)","('Every 2nd Month',2)","('Quartely',3)",
		                 "('Every 4th Month',4)","('Every 5th Month',5)","('Semi Annually',6)",
		                 "('Every 7th Month',7)","('Every 8th Month',8)","('Every 9th Month',9)",
		                 "('Every 10th Month',10)","('Every 11th Month',11)","('Annually',12)");
var DailyPeriodArray = new Array("('Everyday',1)","('Every 2nd Day',2)","('Every 3rd Day',3)",
		               "('Every 4th Day',4)","('Every 5th Day',5)","('Every 6th Day',6)","('Every 7th Day',7)");
var RefMonArray =  new Array(
		"('1',1)","('2',2)","('3',3)","('4',4)","('5',5)","('6',6)","('7',7)","('8',8)","('9',9)","('10',10)","('11',11)","('12',12)","('13',13)","('14',14)","('15',15)","('16',16)",
		"('17',17)","('18',18)","('19',19)","('20',20)","('21',21)","('22',22)","('23',23)","('24',24)","('25',25)","('26',26)","('27',27)","('28',28)","('29',29)","('30',30)","('31',31)");
var RefDay = new Array("('N/A',1)");
var RefWeekDay = new Array("('Sun',0)", "('Mon',1)" ,"('Tue',2)","('Wed',3)","('Thu',4)","('Fri',5)","('Sat',6)");
var holidayActionArray = new Array("('Postpone',0)","('Prepone',1)","('Dont Execute',2)");

function GetPeriod()
{
	var i,intDay,intMonth ,intclear,intPeriod;
	var Freq = document.getElementById("siFrequencyCode").value;
	var gstrPeriod = document.getElementById("period").value;
	var gstrRef = document.getElementById("refDay").value;
	var varHolidayAction = document.getElementById("holidayAction").value;

	document.getElementById("period").length=0;
	document.getElementById("refDay").length=0;
	if (Freq =="") return false;
	if (Freq =="WEEKLY")
	{
		for (var i=0; i < PeriodWeekArray.length; i++)
		{
			eval("document.getElementById('period').options[i]=" + "new Option" + PeriodWeekArray[i]);
			if (parseInt(i,10)+1 == gstrPeriod)
			document.getElementById("period").options[i].selected=true;
		}

		for (var i=0; i < RefWeekDay.length; i++)
		{
			eval("document.getElementById('refDay').options[i]=" + "new Option" + RefWeekDay[i]);
			if (i==gstrRef)
			document.getElementById("refDay").options[i].selected=true;
		}
		$("#holidayActionContainer").toggleClass("ui-helper-hidden", false);
		$("#refDayContainer").toggleClass("ui-helper-hidden", false);
		for (var i=0; i < holidayActionArray.length ; i++)
		{
			eval("document.getElementById('holidayAction').options[i]=" + "new Option" + holidayActionArray[i]);
			if (i==varHolidayAction)
				document.getElementById("holidayAction").options[i].selected=true;
		}
	}
	else
	{
		intPeriod=7;
		
		if (Freq=="MONTHLY")
		{
		    intPeriod=MonthlyPeriodArray.length;
			for (var i=0; i < intPeriod; i++)
			{
				eval("document.getElementById('period').options[i]=" + "new Option" + MonthlyPeriodArray[i]);
				if (parseInt(i,10)+1 == gstrPeriod)
					document.getElementById("period").options[i].selected=true;
	
			}
			$("#holidayActionContainer").toggleClass("ui-helper-hidden", false);
			$("#refDayContainer").toggleClass("ui-helper-hidden", false);
			for (var i=0; i < holidayActionArray.length ; i++)
			{
				eval("document.getElementById('holidayAction').options[i]=" + "new Option" + holidayActionArray[i]);
				if (i==varHolidayAction)
					document.getElementById("holidayAction").options[i].selected=true;
			}
		}
		if (Freq=="MONTHLY")
		{
			for (var i=0; i < RefMonArray.length ; i++)
			{
				eval("document.getElementById('refDay').options[i]=" + "new Option" + RefMonArray[i]);
				if (parseInt(i,10)+1 == gstrRef)
					document.getElementById("refDay").options[i].selected=true;
			}
			$("#holidayActionContainer").toggleClass("ui-helper-hidden", false);
			$("#refDayContainer").toggleClass("ui-helper-hidden", false);
			for (var i=0; i < holidayActionArray.length ; i++)
			{
				eval("document.getElementById('holidayAction').options[i]=" + "new Option" + holidayActionArray[i]);
				if (i==varHolidayAction)
					document.getElementById("holidayAction").options[i].selected=true;
			}
		}
		if (Freq=="DAILY")
		{	
			for (var i=0; i < intPeriod; i++)
			{
				eval("document.getElementById('period').options[i]=" + "new Option" + DailyPeriodArray[i]);
				if (parseInt(i,10)+1 == gstrPeriod)
					document.getElementById("period").options[i].selected=true;
	
			}
			for (var i=0; i < RefDay.length ; i++)
			{
				eval("document.getElementById('refDay').options[i]=" + "new Option" + RefDay[i]);
				if (parseInt(i,10)+1 == gstrRef)
					document.getElementById("refDay").options[i].selected=true;
			}
			
			document.getElementById("refDay").value  = 1;
			document.getElementById("holidayAction").value  = 2;
			$("#holidayActionContainer").toggleClass("ui-helper-hidden", true);	
			$("#refDayContainer").toggleClass("ui-helper-hidden", true);
		}
	}
}	
function setCurrency(txnCurrency,mode)
{
	if (document.getElementById("amount") != null && document.getElementById("amount").value != "")
	{		
		if (document.getElementById("amountCurrency") != null)
			document.getElementById("amountCurrency").innerHTML = txnCurrency;
	}
	else
	{
		if (document.getElementById("amountCurrency") != null)
			document.getElementById("amountCurrency").innerHTML = "";
	}
	if (mode == 'VIEW')
	{
		if (document.getElementById("amountCurrency") != null)
			document.getElementById("amountCurrency").innerHTML = txnCurrency;		
	}

}

function getamountData(flag)
{
	if(flag == 'P')
	var amount =$("#amount").val();
	else
		var amount =$("#debitCcyAmount").val();	
	
	var fxrate = $("#lbl_fxRate").text();
		
	var debitCcyAmount = (amount * fxrate);
	debitCcyAmount = debitCcyAmount.toPrecision(4);
	// alert(result);
	if(flag == 'P')
		{
			$("#lbl_debitCcyAmount").text(debitCcyAmount);
			document.getElementById("amoutDebitInst").value =debitCcyAmount;
		}
	else
	{
		$("#lbl_amount").text(debitCcyAmount);
		document.getElementById("amoutDebitInst").value =debitCcyAmount;
	}
}

function changeLabel()
{
	var i =document.getElementById("adhocBeneficiary.beneRoutingFlag");
	var text1 =i.options[i.options.selectedIndex].text;
	document.getElementById("adhocBeneficiary.beneBankBic").value="";
	$('label[for="adhocBeneficiary.beneBankBic"]').text(text1);
}

function chkb(bool){
    if(bool)
        return 1;
    return 0;
}