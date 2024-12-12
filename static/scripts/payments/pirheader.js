// Function for text field validation  
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
function ValidateDecimal()
{
	var DigitsAfterDecimal = 2;
	var val = $("#amount").val();
	if(val.indexOf(".") != -1)
	{
		 if(val.length - (val.indexOf(".")) > DigitsAfterDecimal)                          
		 {                        
			 return false;                
	     }
	}
}
//Function to render PrenoteUntil
function paintChangePrenoteUntil(data)
{
    tokenValue = data.OWASPCSRFTOKEN;
    $('#' + _CSRFTOK_NAME).val(tokenValue);
    prenoteUntil = data.prenoteUntil;
    $('#lbl_prenoteUntil').text(prenoteUntil);
    $.unblockUI();
}

function showList(strUrl)
{
	var submitButton1 = document.getElementById("btnBack");
    submitButton1.disabled=true;
	var frm = document.forms["frmMain"];
	clearForm("frmMain");
	$('#myProduct').val('');
	$('#pirMode').val('');
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}

function savePir(strUrl)
{
	var submitButton1 = document.getElementById("btnSave");
    submitButton1.disabled=true;
	var frm = document.forms["frmMain"];
	if(document.getElementById("companyId"))
	{
		var companyIndex = document.getElementById("companyId").selectedIndex;
		var companyName = document.getElementById("companyId").options[companyIndex].text;
		var companyVal = document.getElementById("companyId").options[companyIndex].value;
		if(companyVal != '')
		{
			companyName = companyName.substring(companyName.indexOf("-")+2, companyName.length);
			var input = document.createElement("input");
			input.type=  "hidden";
			input.name = "companyName";
			input.id = "companyName";
			input.value =  companyName;
			frm.appendChild(input);
		}
	}
	if (frm.pirMode)
		frm.pirMode.value = _pirMode;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function closeHistory(){
	var frm = window.opener.document.forms["frmMain"];
    frm.target = "";
    window.close();
	
}

function addInstrument(strUrl)
{
	var submitButton1 = document.getElementById("btnAddInst");
    submitButton1.disabled=true;
    var frm = document.forms["frmMain"];
    var frmAddInst = document.forms["frmAddInst"];
    frmAddInst.viewState.value = frm.viewState.value; 
	frmAddInst.myProduct.value = frm.myProduct.value;
	frmAddInst.action = strUrl;
	frmAddInst.method = "POST";
	frmAddInst.target = "";
	frmAddInst.submit();
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
	$('#indicativeRate').children().remove();

	//if contract rate is selected add contract ref field and remove indicative rate
	if ($('#rateType').val() == 1)
	{
		if ($("label[for='fxRate']"))
			$("label[for='fxRate']").remove();
		$('#lbl_fxRate').remove();
		$('#contractReference').children().remove();
		$('#td_contractReference').children().remove();

		//Adding label for #contractRefNo
		element = document.createElement("label");
		$(element).attr("for", "contractReference");
		$(element).text(payLabels.LBL_CONTRACTREFNO + " ");
		$(element).addClass("frmLabel required");
		$(element).appendTo('#contractReferencediv');

		//Adding input box for #contractRefNo
		element = document.createElement("input");
		$(element).attr("id", "contractReference");
		$(element).attr("name", "contractReference");
		$(element).attr("tabindex", "125");
		$(element).attr("maxLength", "20");
		$(element).attr("title", payToolTips.TT_CONTRACTREFNO);
		$(element).attr("type", "text");
		$(element).addClass("textBox w20 rounded");
		$(element).appendTo('#contractReferencediv');
		
		//Adding seek anchor for #contractRefNo
		element = document.createElement("a");
		$(element).attr("id", "hrefid_contractRefNo");
		$(element).addClass("linkbox seeklink");
		
		$(element).click(function(){
			//getHostData('contractRefNo|dealRefId|hostRate|hostConvertedFromAmount|hostConvertedToAmount|dealClientId|hostSystem|groupCode',HOSTCONTRACTREFRENCE, 'fetchHostFX_seek_first.seek',CONTRACTREFNOSEEKPARAMS,callerIdBene,'fetchHostFX', '', 'updateHostDataInfo')
		
		getSeekJson('contractReference',CONTRACTREFNOSEEKID, 'contractReferenceNo_seek_first.seek', 
							CONTRACTREFNOSEEKPARAMS,callerIdBene,'contractReference','',updateHostDataInfo);
		
		});
	
		
		$(element).appendTo('#contractReferencediv');
	}
	else
	{ 
	    //Removing  #contractRefNo and calling the function to recalculate FX rate details.
		$('#contractReferencediv').children().remove();
		$('#td_contractReference').children().remove();
		getChangePayAmntInfo('getChangePayAmntHeader.formx', obj)
	}
}

function updateHostDataInfo(data)
{
	
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
	
		//$('#amountCurrency').text('  ' + prdCurr);
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
			$('#indicativeRate').children().remove();
			$('#td_fxRate').parent().children().remove();

			//Adding label for #fxRate
			element = document.createElement("label");
			$(element).attr("for", "fxRate");
			$(element).text(payLabels.LBL_INDICATIVERATE + " ");
			$(element).addClass("frmLabel");
			$(element).appendTo('#indicativeRate');

			//Adding span for #fxRate
			element = document.createElement("span");
			$(element).attr("id", "lbl_fxRate");
			$(element).text("");
			$(element).addClass("w16 rounded inline_block disabled");
			$(element).css("font-weight", "bold");
			$(element).appendTo('#indicativeRate');

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
function getChangeDebitAccountInfo(strUrl,fxRateFlag,payProd,DebitFlag, obj)
{
	
	if(DebitFlag == 'B' && payProd == 'B' && fxRateFlag=='B')
	{
	//$.blockUI({ overlayCSS: {opacity: 0 }});
	var strData = {};
	strData["accountNumber"] = $('#accountNo').val();
	strData[_CSRFTOK_NAME] = $('#' + _CSRFTOK_NAME).val();
	$.post(strUrl, strData, paintChangeDebitAccountInfo, "json");
	return false;
	}
}

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
	
	$('#td_amount').parent().children().remove();
	$('#td_fxRate').parent().children().remove();
	$('#td_debitCcyAmount').parent().children().remove();
	$('#td_rateType').parent().children().remove();
	
	
	
	$('#fcyFields').children().remove();
	$('#indicativeRate').children().remove();
	$('#contractReference').children().remove();
	$('#accCurrDiv').children().remove();
	/*$('#payment123').children().remove();
	$('#debitcc').children().remove();*/

	if (data['accInfo'] && data.accInfo['accountCCY'])
	{	strAccountCCY = data.accInfo['accountCCY'];
		$('#accCurrDiv').append("<b>" + strAccountCCY + "</b>");
		
		$('#accountCurrency').val(strAccountCCY);
		
	}
	else
		$('#accCurrDiv').append('&nbsp;');

	//Create fcy related fields if product currency & account currency are different
	if (!isEmpty(strAccountCCY) && prdCurr != strAccountCCY)
	{
		
		CONTRACTREFNOSEEKPARAMS.buyCCY=strAccountCCY;
		
		//Adding label element  for #rateType
		var instrDiv = $('#tblInstrumentDetails_sub');
		instrDiv.show();

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
		$(element).attr("id", "indicativeRate");
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
			getChangePayAmntInfo('getChangePayAmntHeader.formx',this)
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
		
		if(_zeroflag == 'Y')
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
		
		var instrDiv = $('#tblInstrumentDetails_sub');
		instrDiv.hide();
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

	$('#indicativeRate').children().remove();
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
			getChangePayAmntInfo('getChangePayAmntHeader.formx', this)
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
			getChangePayAmntInfo('getChangePayAmntHeader.formx', this)
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

function updatePir(strUrl)
{
	var frm = document.forms["frmMain"];
	if(document.getElementById("companyId"))
	{
		var companyIndex = document.getElementById("companyId").selectedIndex;
		var companyName = document.getElementById("companyId").options[companyIndex].text;
		var companyVal = document.getElementById("companyId").options[companyIndex].value;
		if(companyVal != '')
		{
			companyName = companyName.substring(companyName.indexOf("-")+2, companyName.length);
			var input = document.createElement("input");
			input.type=  "hidden";
			input.name = "companyName";
			input.id = "companyName";
			input.value =  companyName;
			frm.appendChild(input);
		}
	}
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}

function closePir(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}
function showAddNewForm(strUrl)
{
	
	var submitButton1 = document.getElementById("btnAdd");
    submitButton1.disabled=true;
    
    var submitButton1 = document.getElementById("btnfilter");
    submitButton1.disabled=true;
    document.getElementById("txtCurrent").value = 0;
    var frm = document.forms["frmMain"];
    frm.target = "";
    frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function reloadForm(strUrl)
{
    var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}

function showAddNewPirForm(strUrl)
{
	
    var frm = document.forms["frmMain"];
    clearForm("frmMain");
    var submitButton1 = document.getElementById("btnAdd");
    submitButton1.disabled=true;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function clear_form_elements(ele) {

    $(ele).find(':input').each(function() {
        switch(this.type) {
            case 'password':
            case 'select-multiple':
            case 'select-one':
            case 'text':
            case 'textarea':
                $(this).val('');
                break;
            case 'checkbox':
            case 'radio':
                this.checked = false;
        }
    });

}

function clearForm(formIdent) 
{ 
  var form, elements, i, elm; 
  form = document.getElementById 
    ? document.getElementById(formIdent) 
    : document.forms[formIdent]; 

    if (document.getElementsByTagName)
	{
		elements = form.getElementsByTagName('input');
		for( i=0, elm; elm=elements.item(i++); )
		{
			if (elm.getAttribute('type') == "text")
			{
				elm.value = '';
			}
		}
		elements = form.getElementsByTagName('select');
		for( i=0, elm; elm=elements.item(i++); )
		{
			elm.options.selectedIndex=0;
		}
	}

	// Actually looking through more elements here
	// but the result is the same.
	else
	{
		elements = form.elements;
		for( i=0, elm; elm=elements[i++]; )
		{
			if (elm.type == "text")
			{
				elm.value ='';
			}
		}
	}
}

function showHistoryForm(strUrl, index)
{	
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=550,height=350";

	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open ("", "hWinHistory", strAttr);
	frm.submit();
}
function doFilter(strUrl)
{
	$('#btnAddInst').attr("disabled", "disabled");
	$('#btnClear').attr("disabled", "disabled");
	$('#btnAdd').attr("disabled", "disabled");
	$('#btnClear').attr("disabled", "disabled");
    document.getElementById("txtCurrent").value = 0;
    var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showViewForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
    document.getElementById("txtCurrent").value = 0;
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}

function showEditForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
        document.getElementById("txtCurrent").value = 0;
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
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
	frm.target = "";
	frm.submit();
}

function rejectRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
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
	var frm = document.forms["frmMain"];
	document.getElementById("txtCurrent").value = intPg;
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}

function deletePirheader()
{		$('#DeleteDialog').dialog('close');
		var frm = document.forms["frmMain"]; 
		frm.target = "";
		frm.submit();
}

function showDelete(strUrl, index,internalReferenceNo){
	$('#DeleteDialog').dialog( {autoOpen: false, width : 400,title : 'About To Delete',modal : true,position: 'top'});
	$('#dialogMode').val('1');
	$('#DeleteDialog').dialog('open');
	$('#lbl_internalreferencenumber').val(internalReferenceNo);
	$('#lbl_internalreferencenumber').text(internalReferenceNo);
	$('#lbl_serial').val(index);
	$('#lbl_serial').text(index);
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
// Details

function deleteDetail()
{
	var frm = document.forms["frmMain"]; 
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
function getHelp(inputId, elementId, descriptionId, validationType)
{		

	var inputIdArray = inputId.split("|");
	var criteria;
	var inputBox;
	args = getHelp.arguments;
	if(args.length == 5)
	 salt=args[4];
	var txtSecond = document.getElementById(elementId).value;			
	if(document.getElementById(inputIdArray[0])!=null)
	{
		 inputBox= document.getElementById(inputIdArray[0]);
	     criteria = inputBox.value;
	}
	
	for(i=1; i<inputIdArray.length-1; i++)
	{
		inputBox = document.getElementById(inputIdArray[i]);
		

		if (inputBox != null)
		{
			criteria = criteria + "," + inputBox.value;
		}	
		else if((inputIdArray[i]!=null)) 
		{
			var temp1=inputIdArray[i];
			criteria = criteria + "," + document.getElementById(''+temp1[1]).value;					
		}
	}	
	
	var today = new Date();
	var winID = today.getTime();
	var bankIndicator = "";
	var strIndicator = "";
	if(txtSecond == 0) txtSecond = "";
	
	wind = "SeekNew.action?forgeryToken=" + csrfTok 
			+ "&rmDepOn=" +  intRmDepOn + "&rmweight=" 
			+  intRmWeight + "&searchCriteriaArray="  
			+ criteria + "&parent=" + elementId + "&seekId=" + salt + "&descriptionLabel=" 
			+ descriptionId + "&txtSecond=" + txtSecond + "&validationType=" + validationType;  					
	var winPopUpObj = window.open(wind,'winID','width=400,height=350,resizable=1,scrollbars=0');
	if (winPopUpObj != null)
		if (!(winPopUpObj.closed))
			winPopUpObj.focus();
}

function doOrderBy(index,sortDirection,strUrl)
{
    document.getElementById("txtCurrent").value = 0;
    var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.method = "POST";
    if (sortDirection==0)
      document.getElementById("sortDirection").value = "1";
    else
      document.getElementById("sortDirection").value = "0";
    document.getElementById("orderBy").value = index;
    frm.method = "POST";
    frm.target = "";
    frm.submit();
}

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

function acceptTerms(){
    var satisfied = $('#chkBoxUserAcceptance').is(':checked');
    if (satisfied)
    		{
    			$('#btnClose').removeAttr('disabled');
    			$('#btnClose').button("enable")
    			$("input", "#buttonbar,#buttonbar1").button();
    		}
    else 
    		{
    			$('#btnClose').attr('disabled', 'disabled');
    			$('#btnClose').button("disable")
    			$("input", "#buttonbar,#buttonbar1").button();
    		}
    	}

function refreshButtons(authLevel, actStatus, module)
{
	var strPopultedButtons;
	
	if (_module != module)
		return false;
	if (authLevel == '1')
	{
		strPopultedButtons = arrBatchPir[actStatus];
	}
	else
	{
		//strPopultedButtons = arrBatchInst[status];
		strPopultedButtons = document.getElementById("bitmapval").value;
	}
	if (!strPopultedButtons) strPopultedButtons = "000000000";
	var strActionButtons;
	// DO THE ANDING WITH SERVER BITMAP
	strActionButtons = performAnd(strPopultedButtons,_strServerBitmap);	
	var i=0;
	if (strActionButtons.length > 0)
	{
		for (i=0; i<9; i++)
		{
			switch (i)
			{
				case 0: 
					/*if (strActionButtons.charAt(i)*1 ==1)
						document.getElementById("btnClose").className ="imagelink black inline_block button-icon icon-button-submit font_bold";
					else
						document.getElementById("btnClose").className ="imagelink grey inline_block button-icon icon-button-submit-grey font-bold";
					*/
					break;

				case 1: 
					if (strActionButtons.charAt(i)*1 ==1)
						document.getElementById("btnAuth").className ="imagelink black inline_block button-icon icon-button-accept font_bold";
					else
						document.getElementById("btnAuth").className ="imagelink grey inline_block button-icon icon-button-accept-grey font-bold";
					break;					

				case 2: 
					if (strActionButtons.charAt(i)*1 ==1)
						document.getElementById("btnReject").className ="imagelink black inline_block button-icon icon-button-reject font_bold";
					else
						document.getElementById("btnReject").className ="imagelink grey inline_block button-icon icon-button-reject-grey font-bold";
					break;

				case 3: 
					if (strActionButtons.charAt(i)*1 ==1)
						document.getElementById("btnSend").className ="imagelink black inline_block button-icon icon-button-send font_bold";
					else
						document.getElementById("btnSend").className ="imagelink grey inline_block button-icon icon-button-send-grey font-bold";
					break;

				case 4: 
					if (strActionButtons.charAt(i)*1 ==1)
						document.getElementById("btnDiscard").className ="imagelink black inline_block button-icon icon-button-discard font_bold";
					else
						document.getElementById("btnDiscard").className ="imagelink grey inline_block button-icon icon-button-discard-grey font-bold";
					break;

				case 5: 
					if (strActionButtons.charAt(i)*1 ==1)
						document.getElementById("btnHold").className ="imagelink black inline_block button-icon icon-button-hold font_bold";
					else
						document.getElementById("btnHold").className ="imagelink grey inline_block button-icon icon-button-hold-grey font-bold";
					break;

				case 6: 
					if (strActionButtons.charAt(i)*1 ==1)
						document.getElementById("btnRelease").className ="imagelink black inline_block button-icon icon-button-relese font_bold";
					else
						document.getElementById("btnRelease").className ="imagelink grey inline_block button-icon icon-button-release-grey font-bold";
					break;

				case 7: 
					if (strActionButtons.charAt(i)*1 ==1)
						document.getElementById("btnStop").className ="imagelink black inline_block button-icon icon-button-stop font_bold";
					else
						document.getElementById("btnStop").className ="imagelink grey inline_block button-icon icon-button-stop-grey font-bold";
					break;

				case 8: 
					if (strActionButtons.charAt(i)*1 ==1)
						document.getElementById("btnVerify").className ="imagelink black inline_block button-icon icon-button-accept font_bold";
					else
						document.getElementById("btnVerify").className ="imagelink grey inline_block button-icon icon-button-accept-grey font-bold";
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

function selectInstGridRecord(ctrl, status, module, index)
{
	if (module != _module)
		return false;
	var strAuthIndex = document.getElementById("updateIndex").value;
	var strActionMap = document.getElementById("actionmap").value;
	var aPosition = strAuthIndex.indexOf(index);
    var mapPosition;	
	var strCurrentAction;
	var strDelimAction;
	var lenDelimAction;
	var strArrSplitAction;
	var strFinalBitmap = document.getElementById("bitmapval").value;
	var lenLooplen;

	if (index.length < 2)
	{
		index = '0' + index;
	}

	if (aPosition >= 0)
	{
		//alert('Removing');
		//alert('stractionmap' + strActionMap);
		document.getElementById("updateIndex").value = strAuthIndex.replace(strAuthIndex.substring(aPosition, aPosition + 3),"");
		mapPosition = strActionMap.indexOf(index+":");
		//alert('map position' + mapPosition);
		document.getElementById("actionmap").value = strActionMap.replace(strActionMap.substring(mapPosition, mapPosition + 13),"");
		//alert('Final Value' +  document.getElementById("actionmap").value) ;	
	}
	else
	{
		//alert('Adding');
		document.getElementById("updateIndex").value = index+ ","+document.getElementById("updateIndex").value ;
		//alert('mode ' + mode + 'Request state ' +  status);
		strCurrentAction = arrBatchInst[status];
		document.getElementById("actionmap").value = index+":"+ strCurrentAction +","+document.getElementById("actionmap").value ;
		//alert('Final Value' +  document.getElementById("actionmap").value) ;		
	}
	if (ctrl.className.indexOf("acceptlink") > -1)
	{
		ctrl.className = "linkbox acceptedlink";
	}
	else
	{
		ctrl.className = "linkbox acceptlink";
	}
	// perform the operation of bitwise anding
	//alert(mode +":"+ _strValidActions + ":" +status);
	lenDelimAction = document.getElementById("actionmap").value.length;
	if (lenDelimAction > 1)
	{
		strDelimAction = document.getElementById("actionmap").value;
		strDelimAction = strDelimAction.substring(0, lenDelimAction-1);		
		strArrSplitAction = strDelimAction.split(",");		
		for (var i=0;i<strArrSplitAction.length;i++)
		{
			strArrSplitAction[i] = strArrSplitAction[i].substring(strArrSplitAction[i].indexOf(":")+1);
		}
		//alert('Binaries :: ' + strArrSplitAction);
		
		if (strArrSplitAction.length==1)
		{
			strFinalBitmap = strArrSplitAction[0];
		}
		else
		{
				lenLooplen =strArrSplitAction.length-1;
				//alert('Loop len' + lenLooplen);
				for (var j=0; j<lenLooplen ; j++)
				{
					if (j==0)
					{
						//alert('Anding the first');
						strFinalBitmap = performAnd(strArrSplitAction[j],strArrSplitAction[j+1]);						
					}
					else
					{
						//alert('Anding the Subsequent');
						strFinalBitmap = performAnd(strFinalBitmap,strArrSplitAction[j+1]);
					}
				}
		}
		//alert('Final Bitmap ::: ' + strFinalBitmap);
		document.getElementById("bitmapval").value=	strFinalBitmap;
		refreshButtons(0, status, module);
	}
	else
	{
		strFinalBitmap = _strValidActions;
		document.getElementById("bitmapval").value=	strFinalBitmap;
		refreshButtons(0, status, module);
	}	
}

function authPirHdrRecord(me, txn_sign_appl)
{
	var actionName ;
	if (txn_sign_appl == "Y")
	{
		actionName = "acceptSignHdrPirMultiAction.form";
	}
	else
	{
		actionName = "acceptHdrPirMultiAction.form";	
	}
	if (me.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = actionName;
	frm.method = "POST";
	frm.submit();
}

function sendPirHdrRecord(me)
{
	if (me.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = "sendHdrPirMultiAction.form";
	frm.method = "POST";
	frm.submit();
}

function deletePirHdrRecord(me, scrapTitle, scrapMsg)
{
	var temp = document.getElementById("btnDiscard");
	if (temp.className.startsWith("imagelink grey"))
		return;
	getRemarks(230,scrapTitle, scrapMsg, [0], scrapPirHdrRecord);
}

function scrapPirHdrRecord(arrData, strRemarks)
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
		frm.action = "deleteHdrPirMultiAction.form";
		frm.method = "POST";
		frm.submit();
	}
}

function rejectPirHdrRecord(me, rejTitle, rejMsg)
{
	var temp = document.getElementById("btnReject");
	if (temp.className.startsWith("imagelink grey"))
		return;
	getRemarks(230, rejTitle, rejMsg, [0], rejectPirRecord);
}

function rejectPirRecord(arrData, strRemarks)
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
		frm.action = "rejectHdrPirMultiAction.form";
		frm.method = 'POST';
		frm.submit();
	}
}

function authPirDtlRecord(me,  txn_sign_appl)
{
	var actionName ;
	if (txn_sign_appl == "Y")
	{
		actionName = "acceptSignHdrInstMultiAction.form";
	}
	else
	{
		actionName = "acceptHdrInstMultiAction.form";	
	}
	if (me.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	document.getElementById("txtIndex").value = document.getElementById("updateIndex").value;
	frm.target ="";
	frm.action = actionName;
	frm.method = "POST";
	frm.submit();
}

function sendPirDtlRecord(me)
{
	if (me.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	document.getElementById("txtIndex").value = document.getElementById("updateIndex").value;
	frm.target ="";
	frm.action = "sendHdrInstMultiAction.form";
	frm.method = "POST";
	frm.submit();
}

function stopPirDtlRecord(me)
{
	var temp = document.getElementById("btnStop");
	if (temp.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	document.getElementById("txtIndex").value = document.getElementById("updateIndex").value;
	frm.target ="";
	frm.action = "stopHdrInstMultiAction.form";
	frm.method = "POST";
	frm.submit();
}

function deletePirDtlRecord(me, scrapTitle, scrapMsg)
{
	var temp = document.getElementById("btnDiscard");
	if (temp.className.startsWith("imagelink grey"))
		return;
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	getRemarks(230,scrapTitle, scrapMsg, [document.getElementById("updateIndex").value], scrapInstGridRecord);
}

function scrapInstGridRecord(arrData, strRemarks)
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
		document.getElementById("txtIndex").value = arrData;
		frm.target ="";
		frm.action = "deleteHdrInstMultiAction.form";
		frm.method = "POST";
		frm.submit();
	}
}

function rejectPirDtlRecord(me, rejTitle, rejMsg)
{
	var temp = document.getElementById("btnReject");
	if (temp.className.startsWith("imagelink grey"))
		return;
	
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	getRemarks(230,rejTitle, rejMsg, [document.getElementById("updateIndex").value], rejectInstGridRecord);
}

function rejectInstGridRecord(arrData, strRemarks)
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
		document.getElementById("txtIndex").value = arrData;
		frm.target = "";
		frm.action = "rejectHdrInstMultiAction.form";
		frm.method = 'POST';
		frm.submit();
	}
}

function getSearchInstDtl(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target ="";
	frm.method = "POST";
	frm.submit();
}

function saveExcelList(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function holdPirDtlRecord(me, holdTitle, holdMsg)
{
	var temp = document.getElementById("btnHold");
	if (temp.className.startsWith("imagelink grey"))
		return;
	
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	getRemarks(230,holdTitle, holdMsg, [document.getElementById("updateIndex").value], holdInstGridRecord);
}

function holdInstGridRecord(arrData, strRemarks)
{
	var frm = document.forms["frmMain"]; 

	if (strRemarks.length > 255  || isEmpty(strRemarks))
	{
		alert("Hold Remarks Length should be between 1 and 255 Characters!");	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		document.getElementById("txtIndex").value = arrData;
		frm.target = "";
		frm.action = "holdHdrInstMultiAction.form";
		frm.method = 'POST';
		frm.submit();
	}
}

function holdPirHdrRecord(me, holdTitle, holdMsg)
{
	var temp = document.getElementById("btnHold");
	if (temp.className.startsWith("imagelink grey"))
		return;
	getRemarks(230, holdTitle, holdMsg, [0], holdPirRecord);
}

function holdPirRecord(arrData, strRemarks)
{
	var frm = document.forms["frmMain"]; 
	if (strRemarks.length > 255 || isEmpty(strRemarks))
	{
		alert("Hold Remarks Length should be between 1 and 255 Characters!");	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		document.getElementById("txtIndex").value = arrData[0];
		frm.target = "";
		frm.action = "holdHdrPirMultiAction.form";
		frm.method = 'POST';
		frm.submit();
	}
}

function releasePirDtlRecord(me, relTitle, relMsg)
{
	var temp = document.getElementById("btnRelease");
	if (temp.className.startsWith("imagelink grey"))
		return;
	
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	getRemarks(230,relTitle, relMsg, [document.getElementById("updateIndex").value], releaseInstGridRecord);
}

function releaseInstGridRecord(arrData, strRemarks)
{
	var frm = document.forms["frmMain"]; 

	if (strRemarks.length > 255 || isEmpty(strRemarks))
	{
		alert("Release Remarks Length should be between 1 and 255 Characters!");	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		document.getElementById("txtIndex").value = arrData;
		frm.target = "";
		frm.action = "releaseHdrInstMultiAction.form";
		frm.method = 'POST';
		frm.submit();
	}
}

function releasePirHdrRecord(me, relTitle, relMsg)
{
	var temp = document.getElementById("btnRelease");
	if (temp.className.startsWith("imagelink grey"))
		return;
	getRemarks(230, relTitle, relMsg, [0], releasePirRecord);
}

function releasePirRecord(arrData, strRemarks)
{
	var frm = document.forms["frmMain"]; 
	if (strRemarks.length > 255 || isEmpty(strRemarks))
	{
		alert("Release Remarks Length should be between 1 and 255 Characters!");	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		document.getElementById("txtIndex").value = arrData[0];
		frm.target = "";
		frm.action = "releaseHdrPirMultiAction.form";
		frm.method = 'POST';
		frm.submit();
	}
}

function ProcessDetail(arrData)
{
	var frm = document.forms["frmMain"]; 
	frm.target = "";
//	/document.getElementById("txtIndex").value = index;
	document.getElementById("prdCutoffFlag").value = 'Y';
	frm.action = arrData[0];
	frm.method = "POST";
	frm.submit();
}

//for header record
function verifyRecord(me)
{
	if (me.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = "verifyHdrPirMultiAction.form";
	frm.method = "POST";
	frm.submit();
}

//for detail grid
function verifyRecords(me)
{
	if (me.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	document.getElementById("txtIndex").value = document.getElementById("updateIndex").value;
	frm.target ="";
	frm.action = "verifyHdrInstMultiAction.form";
	frm.method = "POST";
	frm.submit();
}

function showLockInstructions(fptrCallback)
{
	var dlg = $('#lockInstructions');
	if(_mode == 'VIEW')
		{
		dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:350,title : 'Lock Instructions',
			buttons: {Cancel: function() {$(this).dialog('close'); }}});
		}
	else
		{
		dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:350,title : 'Lock Instructions',
					buttons: {"Save": function() {$(this).dialog("close"); fptrCallback.call();},
					Cancel: function() {$(this).dialog('close'); }}});
		}
	dlg.dialog('open');
}

function saveLockInstructions()
{
	$('#lockFieldsMask').val(_lockFieldMask);
}

function lockUnlockFieldEditing(ctrl, index)
{
	var arrLockFieldMask = _lockFieldMask.split("");
	if (arrLockFieldMask[index] == 0)
	{
		arrLockFieldMask[index] = 1;
		ctrl.className = "linkbox acceptedlinkLock rightAlign";
	}
	else
	{
		arrLockFieldMask[index] = 0;
		ctrl.className = "linkbox acceptlinkLock rightAlign";
	}
	_lockFieldMask = arrLockFieldMask.join("");
	//_lockFieldMask = _lockFieldMask.replace(/,/gi, "");
}
function showTxnReport(url)
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = url;
	frm.method = "POST";
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
var RefWeekDay = new Array("('Sun',0)", "('Mon',1)" ,"('Tue',2)","('Wed',3)","('Thu',4)","('Fri',5)","('Sat',6)")

function GetPeriod()
{
	var i,intDay,intMonth ,intclear,intPeriod;
	var Freq = document.getElementById("siFrequencyCode").value;
	var gstrPeriod = document.getElementById("period").value;
	var gstrRef = document.getElementById("refDay").value;

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
		if ($("label[for='refDay']").hasClass("required frmLabel"))						
			$("label[for='refDay']").parent().removeClass("ui-helper-hidden");
		if ($("label[for='holidayAction']").hasClass("frmLabel"))
			$("label[for='holidayAction']").parent().removeClass("ui-helper-hidden");
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
			if ($("label[for='refDay']").hasClass("required frmLabel"))				
				$("label[for='refDay']").parent().removeClass("ui-helper-hidden");
			if ($("label[for='holidayAction']").hasClass("frmLabel"))
				$("label[for='holidayAction']").parent().removeClass("ui-helper-hidden");
		}
		if (Freq=="MONTHLY")
		{
			for (var i=0; i < RefMonArray.length ; i++)
			{
				eval("document.getElementById('refDay').options[i]=" + "new Option" + RefMonArray[i]);
				if (parseInt(i,10)+1 == gstrRef)
					document.getElementById("refDay").options[i].selected=true;
			}
			if ($("label[for='refDay']").hasClass("required frmLabel"))
				$("label[for='refDay']").parent().removeClass("ui-helper-hidden");
			if ($("label[for='holidayAction']").hasClass("frmLabel"))
				$("label[for='holidayAction']").parent().removeClass("ui-helper-hidden");
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
			if ($("label[for='refDay']").hasClass("required frmLabel"))						
				$("label[for='refDay']").parent().addClass("ui-helper-hidden");
			if ($("label[for='holidayAction']").hasClass("frmLabel"))
				$("label[for='holidayAction']").parent().addClass("ui-helper-hidden");
		}
	}
}	
function setCurrency(txnCurrency,mode)
{
	if (document.getElementById("amount") != null && document.getElementById("amount").value != "")
	{	
		if (document.getElementById("amountCurrency") != null)
			document.getElementById("amountCurrency").innerHTML = txnCurrency;
		if (document.getElementById("enteredAmountCurrency") != null)
			document.getElementById("enteredAmountCurrency").innerHTML = txnCurrency;
	}
	else
	{
		if (document.getElementById("amountCurrency") != null)
			document.getElementById("amountCurrency").innerHTML = "";
		if (document.getElementById("enteredAmountCurrency") != null)
			document.getElementById("enteredAmountCurrency").innerHTML = "";
	}
	if (mode == 'VIEW')
	{
		if (document.getElementById("amountCurrency") != null)
			document.getElementById("amountCurrency").innerHTML = txnCurrency;
		if (document.getElementById("enteredAmountCurrency") != null)
			document.getElementById("enteredAmountCurrency").innerHTML = txnCurrency;
	}
}

function getRecord(json, elementId, fptrCallback)
{   
	var myJSONObject = JSON.parse(json);
    var inputIdArray = elementId.split("|");
	   for(i=0; i<inputIdArray.length; i++)
	{
    	var field = inputIdArray[i];
    	if(document.getElementById(inputIdArray[i]))
    	{
    	var type = document.getElementById(inputIdArray[i]).type;
    	if(type=='text'){
    	 document.getElementById(inputIdArray[i]).value = JSON.parse(myJSONObject).columns[0].value;
		 }
    	else {
    		var opt = document.createElement("option");              
			document.getElementById(inputIdArray[i]).options.add(opt);  
			opt.text = JSON.parse(myJSONObject).columns[0].value;;
			opt.value = JSON.parse(myJSONObject).columns[1].value;;
			}
		}
	}
     $('#indicativeRate').children().remove();
	$('#td_fxRate').parent().children().remove();
	//Adding label for #fxRate
	element = document.createElement("label");
	$(element).attr("for", "fxRate");
	$(element).text(payLabels.LBL_INDICATIVERATE + " ");
	$(element).addClass("frmLabel");
	$(element).appendTo('#indicativeRate');
	//Adding span for #fxRate
	element = document.createElement("span");
	$(element).attr("id", "lbl_fxRate");
	$(element).text("");
	$(element).addClass("w16 rounded inline_block disabled");
	$(element).css("font-weight", "bold");
	$(element).appendTo('#indicativeRate');
	$('#lbl_fxRate').text(JSON.parse(myJSONObject).columns[2].value); 
	//$('#contracFxRate').text(JSON.parse(myJSONObject).columns[2].value);
	document.getElementById("contracFxRate").value =JSON.parse(myJSONObject).columns[2].value;
	//document.getElementById("contracFxRate").value=JSON.parse(myJSONObject).columns[2].value;
	
	if	($('input[name=debitPaymentAmntFlag]:checked').val() == "P")
		{
			
		 var  amountdebit =Number(JSON.parse(myJSONObject).columns[2].value) * Number($('#amount').val());
		$('#lbl_debitCcyAmount').text(amountdebit);
		//$('#ccyAmount').text(amountdebit);
		document.getElementById("ccyAmount").value =amountdebit
		}
	else
		{
		
		var fxrate = JSON.parse(myJSONObject).columns[2].value;
		
		var debitamount =$('#debitCcyAmount').val();
		
		var  amountdebit1 = Number(fxrate) * Number(debitamount);
		
		$('#lbl_amount').text(amountdebit1);
		document.getElementById("ccyAmount").value=amountdebit1;
		}
	
	
	if (!isEmpty(fptrCallback) && typeof window[fptrCallback] === 'function') {
		window[fptrCallback](json, elementId);
    }
}

function toggleLockInstr(){
	
	if($('#templateType').val() == 1)
	{
		 $('#lockInstr').html('<a class="hyperLink link_color font_bold rightAlign" href="#" onclick="javascript:showLockInstructions(saveLockInstructions);">Lock Instructions</a>') ;
	}else{
		$('#lockInstr').html('');
	}
	
}