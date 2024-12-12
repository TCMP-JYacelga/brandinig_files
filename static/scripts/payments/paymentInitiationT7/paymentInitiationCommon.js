var objReKeyTxnVerificationArgs = null;
var objReKeyTxnGrid = null;
var selectedCompany = '';
var selectedAccount = '';
var isFromGrid = false;
var isPageLoaded = false;
var isFromProductChange = false;

function isEmpty(strValue) {
	return (strValue == null || strValue == undefined || strValue.length == 0);
}
function cloneObject(obj) {
	return JSON.parse(JSON.stringify(obj));
}
function toggleContainerVisibility(strTargetDivId) {
	$((strTargetDivId ? '#' + strTargetDivId + ' ' : '') + '.canParentHide')
			.each(function() {
				if ($(this).find('.canHide').length === $(this)
						.find('.canHide.hidden').length && $(this).find('.canHide').length > 0) {
					$(this).addClass('hidden');
				} else
					$(this).removeClass('hidden');
			});
	$((strTargetDivId ? '#' + strTargetDivId + ' ' : '') + '.canContainerHide')
		.each(function() {
			if ($(this).find('.canParentHide').length === $(this)
					.find('.canParentHide.hidden').length) {
				$(this).addClass('hidden');
			} else
				$(this).removeClass('hidden');
		});
}

function splitAccountSting(strAccDetails) {
	if (strAccDetails) {
		
		if(strAccDetails === "--CONFIDENTIAL--")
		{
			return strAccDetails;
		}
		var splittedArray, accDescr, accNo="", ccy="";
		var str1="",str2="",lastIndex;
		lastIndex = strAccDetails.lastIndexOf("-");
		str1 = strAccDetails.substr(0, lastIndex);
		accDescr = str1.trim();
		str2 = strAccDetails.substr(lastIndex + 1);
		str2 = str2.trim();
		if (str2) {
			splittedArray = str2.split("(");
			accNo = (splittedArray[0]).trim();
		}
		if (splittedArray[1]) {
			splittedArray = splittedArray[1].split(")");
			ccy = splittedArray[0].trim();
		}
		if(!isEmpty(ccy)){			
			return accDescr + ", " + accNo + ", " + ccy;
		/*splittedArray = strAccDetails.split("-");
		accDescr = (splittedArray[0]).trim();
		if (splittedArray[1]) {
			splittedArray = splittedArray[1].split("(");
			accNo = (splittedArray[0]).trim();
		}
		if (splittedArray[1]) {
			splittedArray = splittedArray[1].split(")");
			ccy = splittedArray[0].trim();
		}
		if(!isEmpty(ccy)){			
		return accDescr + ", " + accNo + ", " + ccy;*/
		
		}else{
			return accDescr ;
		}
	} else
		return "";
}

function getTruncatedStringByLengthWithTooltip(id,strValue,length)
{
	var strValueTobeDisplayed = null;
	if (strValue && strValue.length > length) {
		strValueTobeDisplayed = strValue.substr(0, length - 1) + '...';
	}
	$(id).attr("title",strValue);
	return strValueTobeDisplayed;
}

function splitAccountStingForAccountName(strAccDetails) {
	if (strAccDetails) {
		var splittedArray, accDescr;
		var str1="",lastIndex;
		lastIndex = strAccDetails.lastIndexOf("-");
		str1 = strAccDetails.substr(0, lastIndex);
		accDescr = str1.trim();
		/*splittedArray = strAccDetails.split("-");
		accDescr = (splittedArray[0]).trim();*/
		return accDescr;
	} else
		return "";
}

function toggleIcon(iconId) {
	if ($("#" + iconId).hasClass('fa-caret-down')) {
		$("#" + iconId).removeClass('fa-caret-down');
		$("#" + iconId).addClass('fa-caret-up');
	} else {
		$("#" + iconId).removeClass('fa-caret-up');
		$("#" + iconId).addClass('fa-caret-down');
	}
}

function showErrorMsg(strErrorMsg) {
	var buttonsActionPopUpOpts = {};
	buttonsActionPopUpOpts['Cancel'] = {
		click: function(){
			$(this).dialog('close');
		},
		text: getLabel('btncancel','Cancel'),
		'class': 'ft-button-light'
	};
	$('#errorMsgSpan').text(strErrorMsg);
	$('#showErrorMsgPopUpDiv').dialog({
				title : getLabel('errorMessage', 'Error Message'),
				autoOpen : false,
				height : 200,
				width : 300,
				modal : true,
				buttons : buttonsActionPopUpOpts,
				resizable : false
			});
	$('#showErrorMsgPopUpDiv').dialog("open");
}

function doBankIDValidation(blnClearMsg) {
	var strBankIdType = null;
	var strBankID = null;
	var strValidationFlag = null;
	var arrError = new Array();
	var mapMaxLength = {
			'FED' : 9,
			'BIC' : 11,
			'ACH' : 6,
			'ACHA' : 9,
			'IBAN' : 34,
			'DEFAULT' : 35
		};
	if (strLayoutType === 'WIRESWIFTLAYOUT'|| strLayoutType === 'ACHIATLAYOUT' || strLayoutType === 'ACHLAYOUT')
		strLabel = getLabel('beneficiaryBankIDCode_WIRELAYOUT',
			'Identifier');
	else
		strLabel = getLabel('beneficiaryBankIDCode', 'Routing Number');
	
	strBankIdType = getDisabledFieldValue($('#beneficiaryBankIDTypeA'));
	strBankID = ('' + $('#beneficiaryBankIDCodeA').val()) || (''+$('#beneficiaryBankIDCodeAutoCompleter').val()) ||'';
	if(blnClearMsg === true)
		doClearMessageSection();
	// if ($('#cbBankRoutingCodeA').is(':checked')) {
	if (!isEmpty(strBankID)) {
		switch (strBankIdType) {
			case 'FED' :
				strValidationFlag = isValidFedAba(strBankID);
				if (false === strValidationFlag)
					arrError.push({
								"errorCode" : "Error",
								"errorMessage" : strLabel+getLabel('validationFailed', ' is Invalid.')
							});
				break;
			case 'BIC' :
				strValidationFlag = isValidBIC(strBankID);
				if (false === strValidationFlag)
					arrError.push({
								"errorCode" : "Error",
								"errorMessage" : strLabel+getLabel('validationFailed', ' is Invalid.')
							});
				break;
			case 'ACH' :
				strValidationFlag = isValidCHIPSUID(strBankID);
				if (false === strValidationFlag)
					arrError.push({
						"errorCode" : "Error",
						"errorMessage" : strLabel+getLabel('validationFailed', ' is Invalid.')
					});
				break;
			case 'ACHA' :
				strValidationFlag = isValidFedAba(strBankID);
				if (false === strValidationFlag)
					arrError.push({
								"errorCode" : "Error",
								"errorMessage" : strLabel+getLabel('validationFailed', ' is Invalid.')
							});
				break;
			default :
				break;
		}
		
		if (strBankID.length > (mapMaxLength[strBankIdType] || mapMaxLength['DEFAULT'])) {
				strValidationFlag = false;
				arrError = [];
				arrError.push({
					"errorCode" : "Error",
					"errorMessage" : '"'+strLabel+'" field length can not be greater than ' +(mapMaxLength[strBankIdType] || mapMaxLength['DEFAULT'])
				});
			}
	}

	// }
	if (strValidationFlag === false) {
		paintErrors(arrError,null,getLabel('warnLbl','WARNING'));
		//$('#beneficiaryBankIDCodeAutoCompleter').focus();
		$("html, body").animate({
			scrollTop : 0
		}, "slow");
	}
	// Commented following code as Errors are not being displayed on Single Edit/View
	else if (strValidationFlag === true && blnClearMsg === true) {
		doClearMessageSection();
	}
}

function isValidBIC(strRelatedID) {
	if (strRelatedID != '%') {
		var bReturnCode = false;
		var iLength = strRelatedID.length;
		if ((iLength === 8) || (iLength === 11)) {
			for (var i = 0; i < iLength; i++) {
				var iDigit = strRelatedID.substr(i, 1);
				var alnumRegex = /^[0-9a-zA-Z]+$/;
				if (alnumRegex.test(iDigit)) {
					bReturnCode = true;
				} else {
					bReturnCode = false;
					break;
				}
			}
		}
		return (bReturnCode);
	} else
		return true;
}

function isValidCHIPSUID(strRelatedID) {
	var bReturnCode = false;
	var iLength = strRelatedID.length;
	if (iLength === 6) {
		for (var i = 0; i < iLength; i++) {
			var iDigit = parseInt(strRelatedID.substr(i, 1), 10);
			var intRegex = /^\d+$/;
			if (intRegex.test(iDigit)) {
				bReturnCode = true;
			} else {
				bReturnCode = false;
				break;
			}
		}

	}

	return (bReturnCode);

}
function isValidFedAba(strRelatedID) {
	var bReturnCode = true;
	var rt9digit = new RegExp(/^\d{9}$/);
	if (strRelatedID.search(rt9digit) != -1) {
		var abaCheckDigit;

		var abaNumber = parseFloat(strRelatedID);
		abaCheckDigit = computeFedABACheckDigit(strRelatedID.substr(0, 8)) + "";
		if (bReturnCode == true) {
			if (strRelatedID.substr(8, 1) != abaCheckDigit) {
				bReturnCode = false;
			}
		}
	} else {
		bReturnCode = false;
	}

	return bReturnCode;
}

function computeFedABACheckDigit(strRelatedID) {
	var bReturnCode = true;
	var iAbaTotal = 0;
	var iAbaCheckDigit = 0;

	for (var iAbaIndex = 0; iAbaIndex < 8 && bReturnCode == true; iAbaIndex++) {
		var iDigit = parseInt(strRelatedID.substr(iAbaIndex, 1), 10);

		switch (iAbaIndex % 3) {
			case 0 :
				iAbaTotal += iDigit * 3;
				break;
			case 1 :
				iAbaTotal += iDigit * 7;
				break;
			case 2 :
				iAbaTotal += iDigit * 1;
				break;
		}
	}

	iAbaCheckDigit = iAbaTotal % 10;

	if (iAbaCheckDigit != 0) {
		iAbaCheckDigit = 10 - iAbaCheckDigit;
	}
	return iAbaCheckDigit;
}

function showHideIban(strIdType)
{
	if('IBAN'==$(strIdType).val())
	{
		$('#beneficiaryBankIDCodeAutoCompleter').val('');
		$('#beneficiaryBankIDCodeAutoCompleter').hide();
		$('#beneficiaryBankIDCodeAutoCompleterLbl').hide();
		$('#ibanLbl').attr('checked', true);
		$('#ibanLbl').attr('disabled', 'disabled');
		$('#accountIbanNoLbl').attr('disabled', 'disabled');
		//$('#ibanDivA').show();
	}	
	else
	{
		//$('#ibanA').val('');
		//$('#ibanDivA').hide();
		$('#beneficiaryBankIDCodeAutoCompleter').show();
		$('#beneficiaryBankIDCodeAutoCompleterLbl').show();
		$('#bankSearchTextLbl').show();		
		$('#ibanLbl').removeAttr('disabled');
		$('#accountIbanNoLbl').removeAttr('disabled');
	}	
}
function doValidateAccounts() {
	var retValue = true;
	if (strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT') {
		var strSendingAcc = null;
		var strReceivingAcc = null;
		strSendingAcc = $('#accountNo').val();
		strReceivingAcc = $('#drawerAccountNo').val();
		if (!isEmpty(strSendingAcc) && !isEmpty(strReceivingAcc)) {
			if (strSendingAcc === strReceivingAcc) {
				var arrError = [{
							errorMessage : mapLbl['sameAccountErrorMsg'],
							errorCode : 'ERR'
						}];
				paintErrors(arrError);
				retValue = false;
			} else {
				retValue = true;
				doClearMessageSection();
			}
		}
	}
	return retValue;
}

function doRRValidateHeader() {
	var strUrl = _mapUrl['rrValidateUrl'];
	if (isEmpty(strUrl))
		return false;
	var arrayJson = new Array();
	arrayJson.push({
				serialNo : 1,
				identifier : strPaymentHeaderIde,
				userMessage : ''
			});
	blockPaymentUI(true);
	$.ajax({
		url : strUrl,
		type : 'POST',
		contentType : "application/json",
		data : JSON.stringify(arrayJson),
		complete : function(XMLHttpRequest, textStatus) {
			if ("error" == textStatus) {
				// TODO : Error handling to be done.
				// alert("Unable to complete your request!");
				// blockPaymentUI(true);
			}
		},
		success : function(data) {
			if (data && data.d && data.d.instrumentActions) {
				var arrResult = data.d.instrumentActions;
				var isError = false;
				if (arrResult && arrResult.length == 1) {
					if (arrResult[0].success === 'Y') {
						doClearMessageSection();
						blockPaymentUI(false);
						readPaymentHeaderForEdit(arrResult[0].identifier, null);
					} else if (arrResult[0].success === 'N') {
						paintErrors(arrResult[0].errors);
						blockPaymentUI(false);
					} else if (arrResult[0].success === 'W02') {
						$('#messageArea > ul').empty();
						$('#messageArea, #messageContentDiv')
								.removeClass('ui-helper-hidden');
						element = $('<li>')
								.text(getLabel('paymentSubmitMsg', 'Payment submitted. Warning limit exceeded!'));
						element.appendTo($('#messageArea > ul'));
						blockPaymentUI(false);

					}
				}
			}
		}
	});

}
function autoFocusFirstElement(strScreen)
{
	var isFocusSet = true;
	var isNotDiv = true;
	if( isFromGrid && isPageLoaded )
	{
		isFocusSet = false;
	}
	
	if( isFromProductChange )
	{
		if( $("#paymentHeaderEntryStep2").find('[tabindex=1]:visible:not([readonly])')[0]
			&& $("#paymentHeaderEntryStep2").find('[tabindex=1]:visible:not([readonly])')[0].id !== "bankProductHdr-niceSelect"
			&& $("#paymentHeaderEntryStep2").find('[tabindex=1]:visible:not([readonly])')[0].id !== "accountNoHdr-niceSelect" )
		{
			isFocusSet = false;
		}
	}
	
	if( isFocusSet )
	{
		//console.log('strPaymentType : ' + strPaymentType + ' strScreen : ' + strScreen + ' strEntryType : ' + strEntryType);
		if( strPaymentType == "QUICKPAY" || strPaymentType == "QUICKPAYSTI" || strScreen === 'INSTRUMENT')
		{
			if( strPaymentType == "BATCHPAY" && strScreen === 'INSTRUMENT' )
			{
				var elm = $("#transactionWizardPopup").find('[tabindex=1]:visible:not([readonly])');
				if( undefined != elm && elm.length > 0 && undefined != elm[0] )
				{
					if( "DIV" === elm[0].localName || "div" === elm[0].localName )
					{
						isNotDiv = false;
						elm[0].focus();
					}
				}
			}			
			if(isNotDiv)
			{
				$('.transaction-wizard :input:not(:checkbox):not(:radio):not([readonly]):visible:enabled:first').focus();
			}
		}
		else
		{
			if( strEntryType === "TEMPLATE" )
			{
				$('#paymentHeaderEntryStep2 :input:not(:checkbox):not(:radio):not([readonly]):visible:enabled:first').focus();
				window.scrollTo(0,0);
			}
			else
			{
				$('#paymentHeaderEntryStep2 :input:not(:checkbox):not(:radio):not([readonly]):visible:enabled:first').focus();
			}
		}
		
		if( ( strEntryType === "PAYMENT" || strEntryType === "SI" ) && strScreen !== 'INSTRUMENT' )
		{
			if($("#bankProductHdr-niceSelect").is(':visible'))
			{
				$('#bankProductHdr-niceSelect').focus();
			}
			else if($("#accountNoHdr-niceSelect").is(':visible'))
			{
				$('#accountNoHdr-niceSelect').focus();
			}
			else if($("#accountNo-niceSelect").is(':visible'))
			{
				$('#accountNo-niceSelect').focus();
			}
			window.scrollTo(0,0);
			//jQuery(".jq-nice-select").attr("tabindex",-1).focus();
			//jQuery(".jq-nice-select").focus();
		}
	}
}

function blockPaymentUI(blnBlock) {
	if (blnBlock === true) {
		$("#pageContentDiv").addClass('hidden');
		$('#blockUIDiv').removeClass('hidden');
		$('#blockUIDiv').block({
			overlayCSS : {
				opacity : 0
			},
			baseZ : 2000,
			message : '<div id="loadingMsg"><img src="static/styles/Themes/t7-main/resources/images/T7/loading.gif" style="background-position: left center;"/><span style="vertical-align: text-top; margin-left: 5px;">'+getLabel('loading', 'Loading...')+'</span></div>',
			css : {
			}
		});
	} else {
		$("#pageContentDiv").removeClass('hidden');
		$('#blockUIDiv').addClass('hidden');
		$('#blockUIDiv').unblock();
	}
	//$('#paymentHeaderEntryStep2 :input:visible:enabled:first').focus();
}
function blockPaymentInstrumentUI(blnBlock) {
	if (blnBlock === true) {
		$(".transactionWizardInnerDiv").addClass('hidden');
		$('.blockInstrumnetUIDiv').removeClass('hidden');
		$('.blockInstrumnetUIDiv').block({
			overlayCSS : {
				opacity : 0
			},
			baseZ : 2000,
			message : '<div id="loadingMsg"><img src="static/styles/Themes/t7-main/resources/images/T7/loading.gif" style="background-position: left center;"/><span style="vertical-align: text-top; margin-left: 5px;">'+getLabel('loading', 'Loading...')+'</span></div>',
			css : {
			}
		});
	} else {
		$(".transactionWizardInnerDiv").removeClass('hidden');
		$('.blockInstrumnetUIDiv').addClass('hidden');
		$('.blockInstrumnetUIDiv').unblock();
	}
	//$('.transaction-wizard :input:visible:enabled:first').focus();
}

function blockUIWithLoading(blnBlock)
{
	if (blnBlock)
	{
		$('.blockInstrumnetUIDiv').removeClass('hidden');
		$('.blockInstrumnetUIDiv').block(
		{
			overlayCSS : {
				opacity : 0
			},
			baseZ : 2000,
			message : '<div id="loadingMsg"><img src="static/styles/Themes/t7-main/resources/images/T7/loading.gif" style="background-position: left center;"/><span style="vertical-align: text-top; margin-left: 5px;">Loading...</span></div>',
			css : {
			}
		});
	}
	else
	{
		$('.blockInstrumnetUIDiv').addClass('hidden');
		$('.blockInstrumnetUIDiv').unblock();
	}
}

function blockBatchHeaderUI(blnBlock) {
    if (blnBlock === true) {        
        $('#mainPageDiv').block({
            overlayCSS : {
                opacity : 0.2
            },
            baseZ : 2000,
			message : '<div id="loadingMsg" style="z-index: 1"><img src="static/styles/Themes/t7-main/resources/images/T7/loading.gif" style="background-position: left center;"/><span style="vertical-align: text-top; margin-left: 5px;">'+getLabel('loading', 'Loading...')+'</span></div>',
			css : {
			}
        });
    } else {        
        $('#mainPageDiv').unblock();
    }
}

function goToPage(strUrl, frmId) {
	var frm = document.getElementById(frmId), strValue = null;
	
	strValue = charAllowedPayment === 'S' ? 'createPay' : ((strPaymentType === 'QUICKPAY' || strPaymentType === 'QUICKPAYSTI') ? 'single' : 'multi');
	frm.appendChild(createFrmField('INPUT', 'HIDDEN', 'paymentType',
				strValue));	
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function createFrmField(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	}
/**
 * The generic function handleDisplayMode used to handle the hide/show and
 * mandatory/non-mandatory of the UI field based on the response JSON.
 * 
 * @param {String}
 *            displayMode The displayMode used to hide/show and
 *            mandatory/non-mandatory of the UI field. The possible values for
 *            displayMode are 1,2,3,4 These stands as : 1-Hidden(Not to post
 *            while saving the transaction), 2-Non Mandatory,
 *            3-Mandatory,4-Confidential
 * 
 * @param {String}
 *            fieldId The JSON node name of the field. Should be same on UI,
 *            only string postfix will appended based on single/multiple payment
 * 
 * @param {String}
 *            strPaymentType The identifier to identify the Single/Multiple
 *            payment. The possible values are Q and B respectively
 * 
 * @example
 * The field syantax on UI should be as <div id="companyIdDiv"
 *          class="col_1_2 hidden extrapadding_bottom"> <label class="frmLabel"
 *          id="companyIdLbl" for="companyId"> <spring:message
 *          code="lbl.pir.companyid" text="Company Id" /></label><br/> <select
 *          name="companyId" id="companyId" class="rounded w14 ml12"> <option
 *          value=""> <spring:message code="lbl.payments.selectcompany"
 *          text="Select Company" /> </option> </select> </div>
 * 
 * The field details in JSON response : { fieldName: "companyId", label:
 * "Company Id", displayMode: "3", readOnly: "true", availableValues: [ { code:
 * "PAY0001", description: "PAY0001 - PAY" }, { code: "PAY0002", description:
 * "PAY0002 - PAY" } ], dataType: "select" }
 * 
 * The logic is as below 1. The outer DIV's id should be jsonNode.fieldName +
 * 'Div' / jsonNode.fieldName + 'HdrDiv'. e.g companyIdDiv (Single Payment) and
 * companyIdHdrDiv(Multiple Payment) 2. The field label's id should be
 * jsonNode.fieldName + 'Lbl' / jsonNode.fieldName + 'HdrLbl' e.g companyIdLbl
 * (Single Payment) and companyIdHdrLbl(Multiple Payment). The label attribute
 * "for" should have the fields id value 3. The field id / name should be
 * jsonNode.fieldName/jsonNode.fieldName+'Hdr' e.g companyId(Single Payment) and
 * companyIdHdr(Multiple Payment)
 * 
 * Now ,if displayMode is 1 then css class 'hidden' will be added to the outer
 * div. if displayMode is 2 then css class 'hidden' will be removed from the
 * outer div. if displayMode is 3 then css class 'hidden' will be removed from
 * the outer div and css class 'required' will be added to the label.
 */
function handleDisplayMode(displayMode, fieldId, strPaymentType) {
	var clsHide = 'hidden';
	var divId = null, lblId = null, strDivPostFix = 'Div', strLblPostfix = 'Lbl';
	if (!isEmpty(strPaymentType) && strPaymentType === 'B') {
		strDivPostFix = 'Hdr' + strDivPostFix;
		strLblPostfix = 'Hdr' + strLblPostfix;
	}
	divId = fieldId + strDivPostFix;
	lblId = fieldId + strLblPostfix;
	if (strPaymentType === 'B' && (fieldId == 'amount' || fieldId == 'totalNo')
			&& (isControlTotalMandatory || displayMode == '3')) {
		isControlTotalMandatory = true;
		lblId = "amount" + strLblPostfix;
	}
	$('#' + divId).addClass(clsHide);
	$('#' + lblId).removeClass('required');
	if (displayMode) {
		switch (displayMode) {
			case '1' :
				$('#' + divId).addClass(clsHide);
				break;
			case '2' :
				$('#' + divId).removeClass(clsHide);
				break;
			case '3' :
				$('#' + lblId).addClass('required');
				$('#' + divId).removeClass(clsHide);
				if ("B" === strPaymentType) {
					$('#' + fieldId + 'Hdr').addClass('headerRequired');
				}else {
					$('#' + fieldId).addClass('instrumentRequired');
				}
				break;
			case '4' :
				break;

		}
		if(fieldId==='amount')
		{
			if (navigator.userAgent.match(/Edge\/(.*)\./)) {
			    $(function() {
			      $("input[placeholder]").focusin(function() {
			        var $this = $(this);
			        if ($this.css("text-align").toLowerCase() != "left") {
			          $this.attr("data-placeholder", $this.attr("placeholder"));
			          $this.attr("placeholder", "");
			        }
			      }).focusout(function() {
			        var $this = $(this),
			          tempPlaceholder = $this.attr("data-placeholder");
			        if (tempPlaceholder != "") {
			          $this.attr("placeholder", tempPlaceholder);
			          $this.attr("data-placeholder", "");
			        }
			      });
			    });
			}
		}
	}
}
function updateFieldDisplayMode(field, label, cfg) {
	if (label && label.length != 0) {
		if (cfg.isSelected === true  || cfg.isRequiredDefault)
			label.addClass('required');
		else {
			label.removeClass('required');
			if(field[0] && $(field[0]).hasClass("jq-nice-select"))
			{
				var id = $(field[0]).attr("id");
				$("#"+id+"-niceSelect").removeClass('requiredField');
				$("#"+id+"-niceSelect").unbind('blur');
			}
			else
			{
				field.removeClass('requiredField');
				field.unbind('blur');
			}
		}
	}
}

function populateTextFieldValue(fieldId, value) {
	var field = $('#' + fieldId);
	field.attr('tabindex',1);
	if (field && !isEmpty(value) && field.length != 0)
		field.val(value);

}
function populateSeekFieldValue(fieldId, value) {
	var field = $('#' + fieldId);
	field.attr('tabindex',1);
	if (field && !isEmpty(value) && field.length != 0)
		field.val(value);

}
function populateRadioFieldValue(fieldId, value) {
	if (value != undefined && value != '') {
		$("input[name='" + fieldId + "'][value='" + value + "']").attr(
				"checked", true);
	} else {
		$("input[name='" + fieldId + "'][value='" + value + "']").attr(
				"checked", false);
	}
}
function populateCheckBoxFieldValue(fieldId, value) {
	if (value != undefined && value != '') {
		if (value === 'Y' || value === 'N') {
			if (value === 'Y') {
				$("input[name='" + fieldId + "'][value='N']").attr("checked",
						true);
				$('#' + fieldId).val('Y')
			}
		} else
			$("input[name='" + fieldId + "'][value='" + value + "']").attr(
					"checked", true);
	} else {
		// Reset the fields
		$('input[name=' + fieldId + ']').each(function() {
					$(this).removeAttr('checked');
				});
	}
}
function populateAmountFieldValue(fieldId, optValues, defaultValue, ccyValue,
		ccyFieldId) {
	var field = $('#' + ccyFieldId);
	//NOTE : txnCurrency node to be used from standarField instead of amount.txnCurrency node
	if (false && field && field.length != 0) {
		field.empty();
		field.removeClass('disabled');
		if (arrDropDownTexts['txnCurrency'])
			field.append($("<option />")
					.val(arrDropDownTexts['txnCurrency'].value)
					.text(arrDropDownTexts['txnCurrency'].text));
		if (optValues && optValues.length > 0) {
			$.each(optValues, function(index, opt) {
						if ((ccyValue && ccyValue == opt.code))
							// || index == 0)
							field.append($('<option selected="true"/>')
									.val(opt.code).text(getLabel(fieldId+"."+opt.code,opt.description)));
						else
							field.append($("<option />").val(opt.code)
									.text(getLabel(fieldId+"."+opt.code,opt.description)));
					});
			if (optValues.length === 1) {
				$("#" + ccyFieldId + " option:eq(1)").attr('selected',
						'selected');
				field.attr('disabled', true);
				field.addClass('disabled');
			} else if (optValues.length > 1) {
				field.removeClass('disabled');
				field.removeAttr('disabled');
			}
		}
	}
	if (isEmpty(defaultValue))
	{
		defaultValue ="";
	}
	
	if( defaultValue == "--CONFIDENTIAL--")
	{
		$('#' + fieldId).val(defaultValue);	
	}
	else
	{
	// jquery autoNumeric formatting
	var maxAmount = 99999999999.99;
	var maxLength = $('#' + fieldId).attr("maxLength");
	var ieCheck = false;
	if (typeof maxLength !== 'undefined' && maxLength !== false) {
		if(parseInt(maxLength) != NaN){
		if (!!navigator.userAgent.match(/Trident\/7\./))
                ieCheck = true;
			if (!ieCheck) {
                maxAmount = parseFloat('9'.repeat(parseInt(maxLength)) + '.99');
            }
            else
            {
                var count1 = parseInt(maxLength);
                var count2='';
                for(var i=0;i<count1;i++)
                {
                    count2=count2 + '9';
                }
                var count3=count2 + '.99';
                maxAmount =  parseFloat(count3);
            }
		}
	}
	$('#' + fieldId).autoNumeric("init",
	{
			aSep: strGroupSeparator,
			dGroup:strAmountDigitGroup,
			aDec: strDecimalSeparator,
			mDec: strAmountMinFraction,
			vMin: 0.0000,
			vMax: maxAmount
	});
	$('#' + fieldId).autoNumeric('set', defaultValue);
	// jquery autoNumeric formatting
	}
	
	
}
function populateSeekFieldValue(fieldId, value) {
	var field = $('#' + fieldId);
	if (field && !isEmpty(value))
		field.val(value);
}
function populateDateFieldValue(fieldId, value) {
	var field = $('#' + fieldId);
	if (field && !isEmpty(value))
		field.val(value);
	if (fieldId == 'templateStartDate' && isEmpty(value))
		field.val(dtApplicationDate);
	if (fieldId == 'templateStartDateHdr' && isEmpty(value))
		field.val(dtApplicationDate);
}

function populateSelectFieldValue(fieldId, optValues, fieldValue, isInLine) {
	var field = $('#' + fieldId),selectSpan = null;
	if (field && field.length != 0) {
		field.empty();
		field.removeClass('disabled');
		if (arrDropDownTexts[fieldId])
			field.append($("<option />").val(arrDropDownTexts[fieldId].value)
					.text(arrDropDownTexts[fieldId].text));
		if (optValues && optValues.length > 0) {
			if (1 == optValues.length && fieldId != 'companyIdHdr' &&  fieldId != 'accountNoHdr' && fieldId != 'accountNo') {
				$('#' + fieldId + 'ListSpan').remove();
				if(isInLine){
					selectSpan = $('<span></span>', {
							html : optValues[0].description,
							id : fieldId + 'ListSpan',
							'class' : 'canRemove'
						});
				}else if(fieldId === 'accountNo' || fieldId === 'accountNoHdr'){
					selectSpan = $('<div></div>', {
								html : optValues[0].description,
								id : fieldId + 'ListSpan',
								ibanNo : isEmpty(optValues[0].additionalInfo.IBANNUMBER) ? '' : optValues[0].additionalInfo.IBANNUMBER,
								'class' : 'canRemove ft-padding-t ft-padding-medium-b',
								'style' : 'min-height:30px'
							});			
				}
				else {
						selectSpan = $('<div></div>', {
									html : optValues[0].description,
									id : fieldId + 'ListSpan',
									'class' : 'canRemove ft-padding-t ft-padding-medium-b',
									'style' : 'min-height:30px'
								});
				}		
				
				var fieldAttr = $(field).attr('type');
				if('hidden' !== fieldAttr){
					$(field).after($(selectSpan));
					$(field).addClass('hidden');
				}
				
				// in case of accountNoHdr field, at runtime it can render either as jquery or niceSelect 
				// hence we are applying logic for both
				if(fieldId === 'accountNoHdr' || fieldId === 'accountNo')
				{
					if($('#'+fieldId+'_jq').length)
						$('#'+fieldId+'_jq').addClass('hidden');
					if($('#'+fieldId+'-niceSelect').length)
						$('#'+fieldId+'-niceSelect').remove();
				}
				if(fieldId === 'drawerAccountNo'  || fieldId === 'drawerAccountNoHdr' || fieldId === 'purposeCode')
					$('#'+fieldId+'_jq').addClass('hidden');
				if(!isEmpty(optValues[0].additionalInfo) && !isEmpty(optValues[0].additionalInfo.IBANNUMBER)){
						$('#ibanNo').val(optValues[0].additionalInfo.IBANNUMBER);
						$('#ibanNo').attr('disabled', true);
						$('#ibanNo').addClass('disabled');
					}					
				else if(fieldId === 'accountNo' || fieldId === 'bankProduct' ||fieldId === 'bankProductHdr' ){
					$('#'+fieldId+'-niceSelect').remove();
				}
				else{
					//$('#'+fieldId+'-niceSelect').addClass('hidden');
					field.niceSelect("destroy");
					$('#'+fieldId+'-niceSelect').remove();
				}
					
			}
			else{
				if(fieldId === 'accountNoHdr' || fieldId === 'accountNo')
				{
					if($('#'+fieldId+'_jq').length)
						$('#'+fieldId+'_jq').addClass('hidden');
					if($('#'+fieldId+'-niceSelect').length)
						$('#'+fieldId+'-niceSelect').remove();
				}
			}

			if(fieldId === 'purposeCode')
			{
				field.editablecombobox({emptyText : 'Select Purpose Code'});
				field.append($("<option />").val("NONE")
						.text("Select Purpose Code"));
			}
			$.each(optValues, function(index, opt) {
				if(fieldId === 'accountNo' || fieldId === 'accountNoHdr'){
					if ((!isEmpty(fieldValue) && fieldValue == opt.code)){
						// || index == 0)
						field.append($('<option selected="true"/>')
								.val(opt.code).text(opt.description));
						if(opt.additionalInfo!=undefined && !isEmpty(opt.additionalInfo.IBANNUMBER)){
							field.append($('<option selected="true" ibanNo=' + opt.additionalInfo.IBANNUMBER + '/>').val(opt.code).text(opt.description));
							$('#ibanNo').val(opt.additionalInfo.IBANNUMBER);
							$('#ibanNo').attr('disabled', true);
							$('#ibanNo').addClass('disabled');
						}else{
							//field.append($('<option selected="true"/>').val(opt.code).text(opt.description));
							$('#ibanNo').attr('disabled', false);
							$('#ibanNo').removeClass('disabled');
						}
					}
					else{
						if(opt.additionalInfo!=undefined)
						{
							if(isEmpty(opt.additionalInfo.IBANNUMBER)){
								field.append($("<option />").val(opt.code).text(opt.description));
								$('#ibanNo').attr('disabled', false);
								$('#ibanNo').removeClass('disabled');
							}else{
								field.append($("<option ibanNo='" + opt.additionalInfo.IBANNUMBER + "'/>").val(opt.code).text(opt.description));
								$('#ibanNo').attr('disabled', true);
								$('#ibanNo').addClass('disabled');
							}
						}
					}
				}else{
					if ((!isEmpty(fieldValue) && fieldValue == opt.code)){
						// || index == 0)
						field.append($('<option selected="true"/>')
								.val(opt.code).text(opt.description));								
					}
					else{
						field.append($("<option />").val(opt.code)
													.text(opt.description));
					}	
				}				
			});
			
			if (optValues.length === 1 ) {
				if( fieldId != 'companyIdHdr' && fieldId != 'accountNoHdr' && fieldId != 'accountNo') {
					$("#" + fieldId + " option:eq(1)").attr('selected', 'selected');
					field.attr('disabled', true);
					field.addClass('disabled');
				}else if( fieldId === 'companyIdHdr' || fieldId === 'accountNoHdr' || fieldId === 'accountNo' ) {
					makeNiceSelect(fieldId,true);
				}
			} else if (optValues.length > 1) {
				field.editablecombobox("destroy");
				$(field).removeClass('hidden');
				
				if(strLayoutType === 'ACCTRFLAYOUT')
				{
					if( fieldId === 'accountNo')
					{
						//$('#accountNo').editablecombobox({emptyText : 'Select Account',dependantFieldId : 'drawerAccountNo',maxLength : 40});
					}
				}					
				if((fieldId === 'drawerAccountNoHdr' || fieldId === 'purposeCode') && field.hasClass('jq-editable-combo'))
					$('#'+fieldId+'_jq').removeClass('hidden');
				$('#' + fieldId + 'ListSpan').remove();
				field.removeClass('disabled');
				field.removeAttr('disabled');
				field.removeAttr('readonly');
				
				if(field.is("select")){
					if((fieldId === 'drawerAccountNoHdr' || fieldId === 'purposeCode') && field.hasClass('jq-editable-combo'))
							field.editablecombobox('refresh');
					else 
					{
						if( fieldId === 'drawerAccountNo' || fieldId === 'accountNo' || fieldId === 'accountNoHdr' )
						{
							makeNiceSelect(fieldId,true);			
						}else
						{
							field.niceSelect("destroy");
							field.niceSelect();
							}
					}
				}
			}
		    else if(optValues && optValues.length == 0)
		    {
                if( field.is("select") && fieldId === 'accountNoHdr' )
                {
                    field.editablecombobox("destroy");
                    $(field).removeClass('hidden');
                    $('#'+fieldId+'_jq').removeClass('hidden');
                    field.removeClass('disabled');
                    field.removeAttr('disabled');
                    field.removeAttr('readonly');
                    field.editablecombobox('refresh');
                }
            }
            else if(field.is("select")) {
                    field.niceSelect("destroy");
            }
	    }
	}
}
function populateMultiSelectFieldValue(fieldId, optValues, arrFieldValue) {
	var field = $('#' + fieldId);
	var selectSpan = null;
	var arrValues = arrFieldValue || [];
	if (field && field.length != 0) {
		field.empty();
		field.removeClass('disabled');
		if (arrDropDownTexts[fieldId])
			field.append($("<option />").val(arrDropDownTexts[fieldId].value)
					.text(arrDropDownTexts[fieldId].text));
		if (optValues && optValues.length > 0) {
			if (1 == optValues.length) {
				$('#' + fieldId + 'ListSpan').remove();
				if(fieldId === 'accountNo' || fieldId === 'accountNoHdr'){
					selectSpan = $('<div></div>', {
								html : optValues[0].description,
								id : fieldId + 'ListSpan',
								ibanNo : isEmpty(optValues[0].additionalInfo.IBANNUMBER) ? '' : optValues[0].additionalInfo.IBANNUMBER,
								'class' : 'canRemove ft-padding-t ft-padding-medium-b',
								'style' : 'min-height:30px'
							});			
				}else{
					selectSpan = $('<div></div>', {
						html : optValues[0].description,
						id : fieldId + 'ListSpan',
						'class' : 'canRemove ft-padding-t',
						'style' : 'min-height:30px'
					});
				}
				$(field).next().hide();
				$(field).after($(selectSpan));
				$(field).addClass('hidden');
			}
			$.each(optValues, function(index, opt) {
						/*
						 * if ((!isEmpty(arrValues) && $.inArray(opt.code,
						 * arrValues) > -1)) field.append($('<option
						 * selected="true"/>')
						 * .val(opt.code).text(opt.description)); else
						 */
						if(strEntryType === 'TEMPLATE' && (fieldId === 'accountNo' || fieldId === 'accountNoHdr') && !isEmpty(opt.additionalInfo.IBANNUMBER)){
							field.append($("<option ibanNo='" + opt.additionalInfo.IBANNUMBER + "'/>").val(opt.code).text(opt.description));
						}else{
							field.append($("<option />").val(opt.code).text(opt.description));
						}
						
			});
			//bind change event to check all mandatory fields are filled up
			if($(field).hasClass('headerRequired'))
			{
				$(field).change(function() {
					changeHdrButtonVisibilityOnMultiSelect();
			    });						
			}	
			field.multiselect("refresh");
			field.val(arrValues);
			field.multiselect("refresh");
			if (optValues.length === 1) {
				$("#" + fieldId + " option:eq(1)").attr('selected', 'selected');
				field.attr('disabled', true);
				field.addClass('disabled');
			} else if (optValues.length > 1) {
				field.removeClass('disabled');
				field.removeAttr('disabled');
			}
		}
		else if( fieldId === 'templateUsersHdr' && arrFieldValue)
			{
				populateUsers();
			}
	}

}

function changeHdrButtonVisibilityOnMultiSelect() {
	if (typeof changeHdrButtonVisibility == 'function') { 
		changeHdrButtonVisibility(); 
		}
	}
/**
 * @example
 * arrValues [{code : '001',description : 'Account1'},{code :
 *          '002',description : 'Account2'}]
 * 
 */
function getObjectFormJsonArray(strKey, arrValues) {
	var retValue = null;
	if (arrValues)
		$.each(arrValues, function(index, opt) {
					if (strKey == opt.code) {
						retValue = opt;
						return retValue;
					}
				});
	return retValue;
}

function populateLockFieldValue(fieldId, optValues, fieldValue) {
	var field = $('#' + fieldId);
	var objSortAvalArray = null;
	var objDefValArray = new Array();
	if (field && field.length != 0) {
		field.empty();
		field.removeClass('disabled');
		objSortAvalArray = generateSortAvalValArray(optValues);
		if (!isEmpty(objSortAvalArray)) {
			$.each(objSortAvalArray, function(index, opt) {
						if (isControlFieldPresent(fieldValue, opt.seq)) {
							objDefValArray.push(opt.code);
						}
					});
		}
		$.each(optValues, function(index, opt) {
					field.append($("<option />").val(opt.code)
							.text(opt.description));
				});
		field.val(objDefValArray);
		field.multiselect("refresh");
	}

}

function handleDefaultLockFieldValues(data, strPmtType) {
	var strPostFix = strPmtType === 'B' ? 'Hdr' : '';
	var strTempType = $('input[name="templateType' + strPostFix
			+ '"]:radio:checked').val();
	strTempType = strTempType ? strTempType : '1';
	$('input[name="templateType' + strPostFix + '"][value="' + strTempType
			+ '"]:radio').attr('checked', 'checked');
	// handleTemplateTypeChange(strTempType, 'B');
	var objData = data.d.paymentEntry.standardField;
	var arrAvalVal, objVal, fieldId, arrObj,field;
	var arrOfDefVal = new Array();
	fieldId = 'lockFieldsMask' + strPostFix;
	field = $('#'+fieldId);
	if (!isEmpty(objData)) {
		$.each(objData, function(index, cfg) {
			if (cfg.fieldName === 'lockFieldsMask') {
				arrAvalVal = cfg.availableValues;
				if (strTempType === '2') {
					arrOfDefVal.push('drawerCode');
					arrOfDefVal.push('accountNo');
				}
				if (strTempType === '3') {
					arrOfDefVal.push('accountNo');
				}
				arrObj = generateSortAvalValArray(cfg.availableValues);
				objVal = generateControFiledMask(arrObj,
						arrOfDefVal, strTempType);
				if(strTempType === '2' && cfg.value === '00000000000000000000000'){
					cfg.value = '00100000100000000000000';
				}
				else if(strTempType === '3' && cfg.value === '00000000000000000000000'){
					cfg.value = '00100000000000000000000';
				}
				populateLockFieldValue(fieldId, arrAvalVal, (cfg.value || objVal) );
			}
		});
		if (strTempType === '2' || strTempType === '3') {
			$('#lockFieldsMask' + strPostFix + ' :selected').each(
					function(i, selected) {
					if (!isEmpty(arrOfDefVal)
					&& (jQuery.inArray($(selected).val(), arrOfDefVal) !== -1))
						$("#lockFieldsMask" + strPostFix + " option[value='"
								+ $(selected).val() + "']").attr("disabled",
								true);
					});

		} else if (strTempType === '1'){
			//handleTemplateTypeChange(strTempType, strPmtType,blnCanClear);
			toggleAccountFieldBehaviour(true, strPmtType);
			if (strPmtType === 'Q')
				handleCurrencyMissmatch();
			else if (strPmtType === 'B')
				handleCurrencyMissmatchForPaymentHeader();
			field.multiselect("refresh");
			field.multiselect("widget").find(":checkbox").each(function() {
						if ($(this).val() === 'accountNo') {
							$(this).attr("disabled", true);
						}
					});
		}
	}
}
function handleTemplateTypeChange(strTemplateType, strPmtType, blnUseInMobile) {
	var strFieldId = 'lockFieldsMask';
	var strPostFix = '';
	if (strPmtType === 'B')
		strPostFix = 'Hdr'
	strFieldId += strPostFix;
	var field = $('#' + strFieldId);
	var strAccountNoFieldId ='accountNo' + (strPmtType === 'B' ? 'Hdr' : '');
	if(isGranularPermissionApplied){
		var txnCcy = $('#txnCurrency' + (strPmtType === 'B' ? 'Hdr' : '')).val();// Transaction Currency
		//reset selected values
		if($("#"+strAccountNoFieldId).length > 0)
			$("#"+strAccountNoFieldId).val('');
		if('1' === strTemplateType){
			$('#' + strAccountNoFieldId + 'ListSpan').remove();
			if($("#"+strAccountNoFieldId).length > 0)
				$("#"+strAccountNoFieldId).niceSelect("destroy");
			//multiselect true
			toggleAccountFieldBehaviour(true, 'Q');
		}
		else{
			// multiselect false
			toggleAccountFieldBehaviour(false, 'Q');
			if($("#"+strAccountNoFieldId).length > 0)
			{
				$("#"+strAccountNoFieldId).niceSelect("destroy");
				$("#"+strAccountNoFieldId).niceSelect();
		}
	}
	}
	$('#' + strFieldId + ' :selected').each(function(i, selected) {
		$("#lockFieldsMask" + strPostFix + " option[value='"
				+ $(selected).val() + "']").attr("disabled", false);
	});

	var arrOfVal = new Array();
	if (strTemplateType === '2') {
		field.multiselect("widget").find(":checkbox").each(function() {
					if ($(this).val() === 'drawerCode') {
						arrOfVal.push('drawerCode');
					}
					if ($(this).val() === 'accountNo') {
						arrOfVal.push('accountNo');
					}
				});
		field.val(arrOfVal);
		$("#lockFieldsMask" + strPostFix + " option[value='drawerCode']").attr("disabled", true);
		field.multiselect("refresh");
		field.multiselect("widget").find(":checkbox").each(function() {
			if ($(this).val() === 'drawerCode') {
				$(this).attr("disabled", true);
			}
			if ($(this).val() === 'accountNo') {
				// $(this).attr("disabled", true);
			}
		});
		$('#'+strAccountNoFieldId).bind("click",
				function() {
					handleDebitAccountChange(strPmtType === 'B' ? true : false);
				});	
		//FTMNTBANK-841 handleCompanyIdChange(strPmtType === 'B' ? true : false);
		if (strPmtType === 'Q')
			handleCurrencyMissmatch();
		else if (strPmtType === 'B')
			handleCurrencyMissmatchForPaymentHeader();
	}
	if (strTemplateType === '3') {
		field.multiselect("widget").find(":checkbox").each(function() {
			if ($(this).val() === 'accountNo') {
				field.val(['accountNo'])
				objAccountNoCheckBox = $(this);
				$("#lockFieldsMask" + strPostFix + " option[value='"
						+ $(this).val() + "']").attr("disabled", true);
			}
		});

		field.multiselect("refresh");
		field.multiselect("widget").find(":checkbox").each(function() {
					if ($(this).val() === 'accountNo') {
						$(this).attr("disabled", true);
					}
				});
		$('#'+strAccountNoFieldId).bind("click",
				function() {
					handleDebitAccountChange(strPmtType === 'B' ? true : false);
				});	
		//FTMNTBANK-841 handleCompanyIdChange(strPmtType === 'B' ? true : false);
		if (strPmtType === 'Q')
			handleCurrencyMissmatch();
		else if (strPmtType === 'B')
			handleCurrencyMissmatchForPaymentHeader();
	}
	if (strTemplateType === '1') {
		/*
		 * $('#accountNo' + strPostFix + 'Div').addClass('hidden');
		 * $('#templateAccountLinkage' + strPostFix + 'SectionDiv')
		 * .removeClass('hidden'); $('#accountNo' + strPostFix).val('');
		 */

		toggleAccountFieldBehaviour(true, strPmtType);

		if (strPmtType === 'Q')
			handleCurrencyMissmatch();
		else if (strPmtType === 'B')
			handleCurrencyMissmatchForPaymentHeader();
		field.val('');
		$("#lockFieldsMask" + strPostFix + " option[value='accountNo']").attr("disabled", true);
		field.multiselect("refresh");
		field.multiselect("widget").find(":checkbox").each(function() {
					if ($(this).val() === 'accountNo') {
						$(this).attr("disabled", true);
					}
				});

	} else {
		/*
		 * $('#accountNo' + strPostFix + 'Div').removeClass('hidden');
		 * $('#templateAccountLinkage' + strPostFix + 'SectionDiv')
		 * .addClass('hidden');
		 */
		toggleAccountFieldBehaviour(false, strPmtType);
		if ($('#accountNo' + strPostFix).find('option').length == 2) {
			$('#accountNo' + strPostFix + ' option').eq(1).attr('selected',
					true);
			$('#accountNo' + strPostFix).attr('disabled', 'disabled');
		}

	}
	if(strTemplateType === '2' && blnUseInMobile === true){
		$('#useInMobilePayments' + strPostFix+'Div').removeClass('hidden');
	}else{
		$('#useInMobilePayments' + strPostFix).val('N');
		$('#useInMobilePayments' + strPostFix).attr('checked', false);
		$('#useInMobilePayments' + strPostFix+'Div').addClass('hidden');
	}
}

function toggleAccountFieldBehaviour(isMultiselect, strPmtType) {
	var strFieldId = strPmtType === 'B' ? 'accountNoHdr' : 'accountNo';
	var selectedVal = null, strDependantFieldId = null;
	var ctrl = $('#' + strFieldId);
	if (isMultiselect) {
		if(ctrl.hasClass('jq-editable-combo')){
			ctrl.editablecombobox("destroy");
		}
		// while moving from Repetative/Semi-Repetative to Non-Repetative; destroy previously created nice-select to create multi-select
		if(ctrl.hasClass('jq-nice-select')){
			ctrl.niceSelect("destroy");
		}
		ctrl.attr('multiple', true);
		ctrl.find("option[value='']").remove();
		var el = ctrl.multiselect({
			noneSelectedText: 'Select Accounts',
			close: function(){
				var values = ctrl.val();

							if ('B' === strPmtType){
					if(values)
					{
								var strAcc = values.join();
								var objAccNo={value:strAcc};
								handleCurrencyMissmatchForPaymentHeader();
								if(strLayoutType === 'ACHLAYOUT' || strLayoutType === 'ACHIATLAYOUT' || strLayoutType === 'TAXLAYOUT')
									populateCompanyId(objAccNo);
					}
								
							}
							else if ('Q' === strPmtType){
					if(values)
					{
								var strAcc = values.join();
								var objAccNo={value:strAcc};
								handleCurrencyMissmatch();
								if(strLayoutType === 'ACHLAYOUT' || strLayoutType === 'ACHIATLAYOUT' || strLayoutType === 'TAXLAYOUT')
									populateSingleCompanyId(objAccNo);
							}
						}
			},
			checkAll: function(){
				
				var allSub = ctrl.val();
			},
			uncheckAll: function(){
				var allSub = $.map($('#' +strFieldId+' option'), function(e) { return e.value; });
			}
					});
		el.multiselect('refresh');
	} else {
		if (!isEmpty(ctrl.val())) {
			selectedVal = new Array();
			selectedVal.push(ctrl.val());
		}
		if(ctrl.hasClass('jq-editable-combo')){
			ctrl.editablecombobox("destroy");
		} else
		if (!ctrl.hasClass('jq-multiselect')) {
			// destory multiselectgrid
		//	ctrl.multiselectgrid("destroy");
			//destroy multiselect
			ctrl.multiselect("destroy");
			ctrl.attr("readOnly", false);
		} else {
			ctrl.multiselect("destroy");
			ctrl.attr("readOnly", false);
		}
		ctrl.attr('multiple', false);
		if (ctrl.find("option[value='']").length === 0) {
			ctrl.prepend($("<option />")
					.val(arrDropDownTexts[strFieldId].value)
					.text(arrDropDownTexts[strFieldId].text)).val();
		}
		if (selectedVal && selectedVal.length > 0) {
			ctrl.val(selectedVal[0]);
			selectedVal = null;
		} else
			ctrl.val(arrDropDownTexts[strFieldId].value);
		if(strLayoutType === 'ACCTRFLAYOUT' && strPmtType === 'Q')
		{
			strDependantFieldId = 'drawerAccountNo';
			ctrl.editablecombobox({emptyText : getLabel('selectAccount', 'Select Account'),dependantFieldId : strDependantFieldId,maxLength : 40});
		$('#'+strFieldId+'-niceSelect').hide();
	}
		else
		{	// while moving from non-repetative to repetative/semi-repetative; destroy and re-create nice-select
			if($('#'+strFieldId+'Lbl').hasClass('required'))
			{
				makeNiceSelect(strFieldId,true);
			}else{
				makeNiceSelect(strFieldId,false);
	}
	}
	}

}
function toggleDrawerAccountFieldBehaviour(isSuggestionBox) {
	var objField = null;
	$('#drawerAccountNoCt').empty();
	if (isSuggestionBox === true) {
		objField = $('<input>').attr({
					'type' : 'text',
					'id' : 'drawerAccountNo',
					'name' : 'drawerAccountNo',
					'tabindex' : 1,
					'class' : 'form-control',
					'placeholder' : 'Enter Keyword or %'
				});
		$('#drawerAccountNo').autocomplete("destroy");
		$('#drawerAccountNo').ReceivingAccountAutoComplete(charPaymentType);
	} else {
		objField = $('<select>').attr({
					'id' : 'drawerAccountNo',
					'name' : 'drawerAccountNo',
					'tabindex' : 1,
					'class' : 'form-control'
				});
		objField.append($("<option />").val('').text(getLabel('select','Select')));
		objField.unbind('change');
		objField.bind('change', function() {
					handleDrawerAccountNo()
				});
	}
	if (objField)
		objField.appendTo($('#drawerAccountNoCt'));
}
function getDisabledFieldValue(objElement){
	var strRetVal='';
	if(objElement.attr('disabled')){
		objElement.removeAttr('disabled');
		strRetVal =objElement.val();
		objElement.attr('disabled','disabled');
	}
	else {
		strRetVal =objElement.val();
	}
	return strRetVal;
}
//FTMNTBANK-841
//function handleCompanyIdChange(isBatch) {
//	if (isBatch)
//		handleCompanyIdHeaderChange();
//	else
//		handleCompanyIdInstrumentChange();
//}
function handleDebitAccountChange(isBatch){
	if (isBatch)
		handleDebitAccountHeaderChange();
	else
		handleDebitAccountInstrumentChange();
}
function doDisableDefaultLockFields(strPmtType, strTempType) {
	var strFieldId = 'lockFieldsMask';
	var strPostFix = '';
	if (strPmtType === 'B')
		strPostFix = 'Hdr'
	strFieldId += strPostFix;
	var field = $('#' + strFieldId);
	var strTemplateType = $('input[name="templateType' + strPostFix
			+ '"]:radio:checked').val();
	if(!strTemplateType && strTempType){
		strTemplateType = strTempType;
	}
	strTemplateType = strTemplateType ? strTemplateType : '1';
	var isDisabled = false;
	$('#' + strFieldId + ' option').attr('disabled', false);

	$('#' + strFieldId + ' option').each(function(i, option) {
		isDisabled = false;
		if (strTemplateType === '2'
				&& ($(option).val() === 'drawerCode')){
			isDisabled = true;
		}
		if (strTemplateType === '2'
			&& ($(option).val() === 'accountNo')){
		isDisabled = true;
	}
		else if (strTemplateType === '3' && ($(option).val() === 'accountNo')){
			isDisabled = true;
		}
		else if (strTemplateType === '1' && ($(option).val() === 'accountNo')){
			isDisabled = true;
		}

		$("#lockFieldsMask" + strPostFix + " option[value='" + $(option).val()
				+ "']").attr("disabled", isDisabled);
	});
	if(strTemplateType === '2'){
			field.multiselect("widget").find(":checkbox").each(function() {
						if ($(this).val() === 'accountNo') {
							$(this).attr("checked", 'checked');
							$(this).attr("disabled", 'disabled');
						}
						else if ($(this).val() === 'drawerCode') {
							$(this).attr("checked", 'checked');
							$(this).attr("disabled", 'disabled');
						}
					});
	}
	else if(strTemplateType === '3'){
			field.multiselect("widget").find(":checkbox").each(function() {
						if ($(this).val() === 'drawerCode') {
							$(this).attr("checked", 'checked');
							$(this).attr("disabled", 'disabled');
						}
					});
	}
	field.multiselect("refresh");
}

function generateSortAvalValArray(arrAvlValue) {
	var arrRet = new Array();
	if (arrAvlValue)
		arrRet = arrAvlValue.sort(function(valA, valB) {
					return valA.seq - valB.seq
				});
	return arrRet;
}
function replaceCharAtIndex(index, character, strInput) {
	return strInput.substr(0, index) + character + strInput.substr(index + 1);
}
function generateControFiledMask(objAvaVal, arrDefVal, strTempType) {
	// Size should be fix and defaulted. Currently its 15. The available array
	// sequence will always start with 0.
	var strMask = '00000000000000000000000';
	var intPosition = '';
	if (!isEmpty(objAvaVal)) {
		for (var i = 0; i < objAvaVal.length; i++) {
			intPosition = parseInt(objAvaVal[i].seq,10);
			if (!isEmpty(intPosition) && !isEmpty(arrDefVal)
					&& (jQuery.inArray(objAvaVal[i].code, arrDefVal) !== -1))
				strMask = replaceCharAtIndex(intPosition, '1', strMask);
		}
	}
	return strMask;
}

function isControlFieldPresent(inputMask, bitPosition) {
	var retValue = false;
	if (inputMask != null && inputMask.charAt(bitPosition)
			&& inputMask.charAt(bitPosition) * 1 === 1)
		retValue = true;
	return retValue;
}
function toggleCheckBoxValue(id) {
	var isChecked = $('#' + id).attr('checked') ? true : false;
	if (isChecked) {
		$('#' + id).val('Y');
		if (id === 'controlTotalHdr') {
			$('#amountHdrLbl').addClass('required');
			toggleControlTotalFiledDisabledValue();
			initatePaymentHeaderValidation();
		}
		else if(id === 'prenoteHdr' && strEntryType === "PAYMENT")
		{
			$('#confidentialFlagHdr, #paymentSaveWithSIHdr').attr("checked", false);
			$('#confidentialFlagHdr,#paymentSaveWithSIHdr').addClass("disabled");
			$('#confidentialFlagHdr,#paymentSaveWithSIHdr').attr('disabled',true);
			$('#confidentialFlagHdr,#paymentSaveWithSIHdr').val('N');
			$('#amountHdr').val('0.00');
			repaintPaymentHeaderFields();
			$('#btnImportTxn').addClass("x-btn-default-toolbar-small-disabled");
			$('#btnImportTxn').unbind( 'click' );
		}
	} else {
		$('#' + id).val('N');
		if (id === 'controlTotalHdr') {
			$('#amountHdrLbl').removeClass('required');
			toggleControlTotalFiledDisabledValue();
			initatePaymentHeaderValidation();
		}
		else if(id === 'prenoteHdr' &&  strEntryType === "PAYMENT")
		{
			$('#confidentialFlagHdr,#paymentSaveWithSIHdr').removeClass("disabled");
			$('#confidentialFlagHdr,#paymentSaveWithSIHdr').attr('disabled',false);
			$('#btnImportTxn')
			.bind('click')
			.removeClass('ft-button-dark-disabled');
			if (allowTxnAdition) {
				toggleInstrumentInitiationActions();
	}
			repaintPaymentHeaderFields();
}
	}
}
function createCheckBoxGroup(strCheckBoxIds) {
	$(strCheckBoxIds).on('click', function() {
		var me = $(this), name = me.prop('name');
		if (me.is(':checked'))
			$(':checkbox[name="' + name + '"]').not($(this)).prop('checked',
					false);
		else
			me.attr('checked', true);
	});
}
function createEnrichmentCheckBox(id, name, value, isRequired) {
	var objParentDiv = $('<div>');
	var objLabel = $('<label>').attr({
				'class' : 'checkbox-inline'
			});
	var objSpanLabel = $('<span>').text(name);
	if(isRequired)
		$(objSpanLabel).addClass('required');
	var field = $('<input>').attr({
				'id' : id,
				'checked' : value === 'Y' ? true : false,
				'type' : 'checkbox',
				'value' : 'Y'
			});
	$(field).appendTo(objLabel);
	$(objSpanLabel).appendTo(objLabel);
	$(objLabel).appendTo(objParentDiv);

	return objParentDiv;
}

function createEnrichmentRadioButton(id, defaultValue, values) {
	var objParentDiv = null, objColumnDiv = null, objSpanLbl = null;
	var objLabel = null;
	var objFieldDiv = $('<div class="row">');
	var field = null;
	if (values && values.length > 0) {
		$.each(values, function(index, opt) {

					objColumnDiv = $('<div>').attr({
								'class' : 'col-sm-6'
							});
					objParentDiv = $('<div>');
					objLabel = $('<label>').attr({
								'class' : 'radio-inline'
							});
					objSpanLbl = $('<span>').text(opt.value);
					if ((!isEmpty(defaultValue) && defaultValue === opt.key) || values.length===1)
						// || index == 0)
						field = $('<input>').attr({
									'id' : opt.key,
									'name' : id,
									'type' : 'radio',
									'value' : opt.key,
									'checked' : true
								});
					else
						field = $('<input>').attr({
									'name' : id,
									'id' : opt.key,
									'type' : 'radio',
									'value' : opt.key

								});
					$(field).appendTo(objLabel);
					$(objSpanLbl).appendTo(objLabel);
					$(objLabel).appendTo(objParentDiv);
					$(objParentDiv).appendTo(objColumnDiv);
					$(objColumnDiv).appendTo(objFieldDiv);
				});
	}
	return objFieldDiv;
}

function createTextBox(id, name, defaultValue, blnReadOnly, maxLength) {
	var field = $('<input>').attr({
				'id' : id,
				'name' : name,
				'type' : 'text',
				'tabindex':1,
				'class' : 'rounded'
			});
	if (!isEmpty(maxLength))
		field.attr('maxLength', maxLength);
	if (blnReadOnly === true)
		field.attr('readonly', true);
	if (!isEmpty(defaultValue))
		field.val(defaultValue);
	return field;
}
function createTextArea(id, name, defaultValue, blnReadOnly, maxLength, rows,
		cols) {
	var field = $('<textarea>').attr({
				'id' : id,
				'name' : name,
				'type' : 'text',
				'tabindex':1,
				'class' : 'rounded',
				'rows' : rows,
				'cols' : cols
			});
	if (!isEmpty(maxLength))
		field.attr('maxLength', maxLength);
	if (blnReadOnly === true)
		field.attr('readonly', true);
	if (!isEmpty(defaultValue))
		field.val(defaultValue);
	return field;
}

function createAmountBox(id, name, defaultValue, blnReadOnly, maxLength) {
	var field = $('<input>').attr({
				'id' : id,
				'name' : name,
				'type' : 'text',
				'tabindex':1,
				'class' : 'amountBox rounded'
			});
	if (!isEmpty(maxLength) &&  maxLength != "0")
		field.attr('maxLength', maxLength);
	if (blnReadOnly === true)
		field.attr('readonly', true);
//	if (isEmpty(defaultValue) || defaultValue=="0")
//		defaultValue="0.00";
//	field.val(defaultValue);
//  field.ForceNumericOnly(16,2);

	// jquery autoNumeric formatting
	field.autoNumeric("init",
	{
			aSep: strGroupSeparator,
			dGroup: strAmountDigitGroup,
			aDec: strDecimalSeparator,
			mDec: strAmountMinFraction			
	});
	$("#amount").focus(function(){
		this.setSelectionRange(0, this.value.length);
		});
	if(!isEmpty(defaultValue) && defaultValue!=="0" && !isNaN(defaultValue))
	field.autoNumeric('set', defaultValue);
	else
	field.val(defaultValue);
	// jquery autoNumeric formatting
	if($('#enrude_IATBATCH01').val() === 'FV' && name === 'IAT08'){
		field.autoNumeric('destroy');
		// setting value 0 for IAT FV NACHA download issue
		field.val('0');
	}
	field.attr("placeholder",strPlaceHolder);
	return field;
}
function createNumberBox(id, name, defaultValue, blnReadOnly, maxLength) {
	var field = $('<input>').attr({
				'id' : id,
				'name' : name,
				'type' : 'text',
				'tabindex':1,
				'class' : 'rounded'
			});
	if (!isEmpty(maxLength))
		field.attr('maxLength', maxLength);

	if (blnReadOnly === true)
		field.attr('readonly', true);

	if (!isEmpty(defaultValue))
		field.val(defaultValue);
	field.OnlyNumbers();
	return field;
}
function createComboBox(id, name, defaultValue, blnReadOnly, arrOptions,
		isMandatory, blnAllowAdhocValues) {
	var field = $('<select>').attr({
				'id' : id,
				'name' : name,
				'tabindex':1,
				'class' : 'form-control'
			});
	field.append($("<option />").val('').text(getLabel('select','Select')))
	if (arrOptions && arrOptions.length > 0) {
		$.each(arrOptions, function(index, opt) {
					if ((!isEmpty(defaultValue) && defaultValue == opt.key))
						// || index == 0)
						field.append($('<option selected="true"/>')
								.val(opt.key).text(opt.value));
					else
						field.append($("<option />").val(opt.key)
								.text(opt.value));
				});
		if (isMandatory) { // isMandatory is not undefined
			if (isMandatory === true) { // and its value is true
				if (arrOptions.length === 1) {
					defaultValue = arrOpions[0].value;
					field.attr('disabled', true);
					field.addClass('disabled');
				}
			}
		}
	}
	if (blnReadOnly === true)
		field.attr('readonly', true);

	if (!isEmpty(defaultValue))
		field.val(defaultValue);
		
	if(blnAllowAdhocValues)
		$(field).attr('editableValue', defaultValue);
		
	return field;
}
function createDateBox(id, name, defaultValue, blnReadOnly, maxLength,
		dateFormat) {
	var field = $('<input>').attr({
				'id' : id,
				'name' : name,
				'type' : 'text',
				'tabindex':1,
				'class' : 'rounded'
			});
	field.datepicker({
				dateFormat : dateFormat,
				changeMonth: true,
			    changeYear: true,
				appendText : '',
				minDate : new Date(),
				onClose: function(){
					$(this).trigger('blur');
				},
				onSelect: function(){
					$(this).trigger('blur');
				}
			});
	if (!isEmpty(maxLength))
		field.attr('maxLength', maxLength);

	if (blnReadOnly === true)
		field.attr('readonly', true);

	if (!isEmpty(defaultValue))
		field.val(defaultValue);
	return field;
}

function createEnrichmentDateBox(id, name, defaultValue, blnReadOnly,
		maxLength, dateFormat, mandatory, cfg) {
	var minValueDate = null ;
	var maxValueDate = null ;
	
	if(cfg) {
		minValueDate = cfg.minValueExist ? cfg.minValueDate : null ;
		maxValueDate =  cfg.maxValueExist ? cfg.maxValueDate : null ;
	}
	
	var field = $('<input>').attr({
				'id' : id,
				'name' : name,
				'type' : 'text',
				'tabindex':1,
				'class' : 'rounded'
			});
	field.datepicker({
				onClose: function(dateText) {
						var obj = $(this);
						if(mandatory)
						{
							obj.bind('blur', function mark() {
								markRequired($(this));
							});
							obj.bind('focus', function() {
								removeMarkRequired($(this));
							});
						}
						setTimeout(function(){obj.trigger('blur');}, 300);
				},				
				dateFormat : dateFormat,
				changeMonth: true,
			    changeYear: true,
				appendText : '',
				minDate: !Ext.isEmpty(minValueDate) ? new Date(minValueDate) : null,
		        maxDate: !Ext.isEmpty(maxValueDate) ? new Date(maxValueDate) : null,
			});
	if (!isEmpty(maxLength))
		field.attr('maxLength', maxLength);

	if (blnReadOnly === true)
		field.attr('readonly', true);

	if (!isEmpty(defaultValue))
		field.val(defaultValue);
	return field;
}

function createSeekBox(id, name, defaultValue, maxLength, strUrl, rootNode,
		codeNode, descNode) {
	var field = $('<input>').attr({
				'id' : id,
				'name' : name,
				'type' : 'text',
				'tabindex':1,
				'class' : 'rounded xn-suggestion-box'
			});
	if (!isEmpty(maxLength))
		field.attr('maxLength', maxLength);

	if (!isEmpty(defaultValue))
		field.val(defaultValue);
	field.autocomplete({
		source : function(request, response) {
			$.ajax({
						url : strUrl,
						dataType : "json",
						data : {
							qfilter : request.term
						},
						success : function(data) {
							var rec = {};
							if (rootNode) {
								var arrNode = rootNode.split('.');
								rec = data;
								if (arrNode) {
									$.each(arrNode, function(index, key) {
												rec = rec[key];
											});
								}
							}
							response($.map(rec, function(item) {
										return {
											label : item[descNode],
											value : item[codeNode]
										}
									}));
						}
					});
		},
		minLength : 1,
		select : function(event, ui) {
			log(ui.item ? "Selected: " + ui.item.label + " -show lbl:"
					+ ui.item.lbl : "Nothing selected, input was " + this.value);
		},
		open : function() {
			$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
		},
		close : function() {
			$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
		}
	})/*.data("autocomplete")._renderItem = function(ul, item) {
		var inner_html = '<a><ol class="t7-autocompleter"><ul>' + item.value
				+ '</ul><ul">' + item.label + '</ul></ol></a>';
		return $("<li></li>").data("item.autocomplete", item)
				.append(inner_html).appendTo(ul);
	};*/
	return field;
}
function createButton(btnKey, charIsPrimary, instAction) {
	var strCls = charIsPrimary === 'P'
			? 'ft-button canDisable ft-button-primary ft-margin-l'
			: (charIsPrimary === 'L' ? 'ft-btn-link canDisable ' : 'ft-button canDisable ft-button-light');
			
	var elt = null;
	if(btnKey == 'btnUpdate' || btnKey == 'btnSave')
	{
		elt = $('<input>').attr({
			'type' : 'button',
			'tabindex':1,
			'class' : strCls,
			'id' : 'button_' + btnKey,
			'onkeydown' :'autoFocusOnFirstElement(event, "transactionWizardPopup", false)',
			'value' : mapLbl[btnKey]
		});
	}
	else
	{
		elt = $('<input>').attr({
				'type' : 'button',
				'tabindex':1,
				'class' : strCls,
				'id' : 'button_' + btnKey,
				'onkeydown' : instAction && instAction == 'VIEW' ? 'autoFocusOnFirstElement(event, "transactionWizardViewPopup", false)' : '',
				'value' : mapLbl[btnKey]
			});
	}
	return elt;
}

function enableDisableField(objElement, blnReadOnly) {
	if (blnReadOnly) {
		$(objElement).attr("readonly", "readonly");
	} else {
		$(objElement).removeAttr("readonly");
	}
}

function paintErrors(arrError,arrFnCallbackWithArguments,strErrTitle) {
	doHandlePaintErrors(arrError, 'CASHWEB',arrFnCallbackWithArguments,strErrTitle);
}

function paintCashInErrors(arrError) {
	doHandlePaintErrors(arrError, 'CASHIN');
}

function doHandlePaintErrors(arrError, strErrorType,arrFnCallbackWithArguments,strErrTitle) {
	var element = null, strMsg = null, strTargetDivId = 'messageArea', strErrorCode = '';
	var strErrTitle = !isEmpty(strErrTitle) ? strErrTitle : getLabel('errorlbl','ERROR')
	/*
	 * if (strErrorType === 'CASHIN') strTargetDivId = 'cashinMessageArea';
	 */

	if(!isEmpty(strErrTitle)){
		$('#messageCodeSpan').empty();
		$('#messageCodeSpan').text(strErrTitle+':');
	}
	if(!Ext.isEmpty(arrError) && !Ext.isEmpty(arrError[0]) && arrError[0].errorCode && (arrError[0].errorCode.indexOf('WARN') != -1 || strErrTitle.toUpperCase().indexOf("WARN") != -1) )
	{
		$('#messageCodeSpan').empty();
		$('#messageCodeSpan').text('');
	}
	
	if (arrError && arrError.length > 0) {
		$('#' + strTargetDivId).empty();
		$.each(arrError, function(index, error) {
					strMsg = error.errorMessage;
					strErrorCode = error.errorCode || error.code;
					strMsg += (!isEmpty(strErrorCode) && strErrorCode != 'Error.Emulation' && strErrorCode != 'SI0002') ? ' (' + strErrorCode + ')' : '';
					/*if (!isEmpty(strMsg))
						strMsg += ' : ';*/
					if (!isEmpty(strErrorCode)) {
						if (strErrorCode.toUpperCase().indexOf("WARN") >= 0 || strErrTitle.toUpperCase().indexOf("WARN") >= 0) {
							var msg = mapLbl['warnMsg']
							if (!isEmpty(msg))
								msg += ' : ';
							// element = $('<li>').text(msg+strMsg);
							$('#successMessageArea').empty();
							element = $('<p>').text(msg + error.errorMessage);
							//element =$('<li>').text(msg + error.errorMessage);
							//element.appendTo($('#successMessageArea'));
							element.appendTo($('#' + strTargetDivId));
							$('#' + strTargetDivId + ', #messageContentDiv').removeClass('hidden');
							//$('#' + strTargetDivId + ', #messageContentDiv').removeClass('ft-error-message');
							$('#messageCodeSpan').addClass('hidden');
						} else {
							$('#messageCodeSpan').removeClass('hidden');
							element = $('<p>').text(strMsg);
							if (strErrorCode === 'P22') {
								$("<a id='hrefValidate' href='#'>").css({
											"display" : "none",
											"float" : "right"
										}).addClass('t7-anchor')
										.text('Validate').appendTo(element)
										.click(function() {
													doRRValidateHeader();
												});
							}
							element.appendTo($('#' + strTargetDivId));
							$('#' + strTargetDivId + ', #messageContentDiv')
									.removeClass('hidden');
						}

					}
				});

	}
}

function doClearMessageSection() {
	$('#messageArea').empty();
	$('#successMessageArea, #messageArea, #messageContentDiv')
			.addClass('hidden');
}

function paintSuccessMsg(objMsgDetails, strPaymentType) {
	var element = null;
	var msg = !isEmpty(strPaymentType) && strPaymentType === 'B'
			? mapLbl['hdrSuccessMsg']
			: mapLbl['successMsg'];
	// TODO : Not showing the success message,
	if (false && objMsgDetails) {
		$('#successMessageArea').empty();
		element = $('<li>').text(msg + objMsgDetails.txnReference);
		element.appendTo($('#successMessageArea'));
		$('#successMessageArea, #messageContentDiv').removeClass('hidden');
	}
}
function paintHeaderSuccessMsg(objMsgDetails, strPaymentType, data) {
	var element = null;
	var msg = !isEmpty(strPaymentType) && strPaymentType === 'B'
			? data.d.paymentEntry.paymentHeaderInfo.pirMode === 'TP'
					? mapLbl['hdrSuccessTemplateMsg']
					: mapLbl['hdrSuccessMsg']
			: mapLbl['successMsg'];
	if (false && objMsgDetails) {
		$('#successMessageArea').empty();
		element = $('<li>').text(msg + objMsgDetails.txnReference);
		element.appendTo($('#successMessageArea'));
		$('#successMessageArea, #messageContentDiv').removeClass('hidden');
	}
}
function toggleBreadCrumbs(activeTabId) {
	var clsActive = 'active';
	$('#tab_1 > a, #tab_2 > a, #tab_3 > a, #tab_4 > a, #tab_5 > a')
			.removeClass(clsActive);
	$('#' + activeTabId + ' > a').addClass(clsActive);
}
function getEnrField(arrPrdEnr, seqNo) {
	var retField = null;
	for (var i = 0; i < arrPrdEnr.length; i++) {
		if (arrPrdEnr[i].sequenceNmbr === seqNo)
			retField = arrPrdEnr[i];

	}
	return retField;
}
function generateSortArrPrdEnr(arrPrdEnr) {
	var arrRet = new Array();
	if (arrPrdEnr)
		arrRet = arrPrdEnr.sort(function(valA, valB) {
					return valA.sequenceNmbr - valB.sequenceNmbr
				});
	return arrRet;
}
function getDenomField(arrPrdEnr, seqNo) {
	var retField = null;
	for (var i = 0; i < arrPrdEnr.length; i++) {
		if (arrPrdEnr[i].serialNumber === seqNo)
			retField = arrPrdEnr[i].parameters;
	}
	return retField;
}
function generateSortArrDenominations(arrPrdEnr) {
	var arrRet = new Array();
	if (arrPrdEnr)
		arrRet = arrPrdEnr.sort(function(valA, valB) {
					return valA.serialNumber - valB.serialNumber
				});
	return arrRet;
}

function resetInstrumentForm() {
	$('#transactionWizardPopup')
			.find('input:text, input:hidden, textarea, select, input:checkbox, input:radio')
			.each(function() {
				if ($(this).is(':checkbox')) {
					$(this).attr("checked", false);
				} else if ($(this).is(':radio'))
					$(this).attr("checked", false);
				else if ($(this).is('select')) {
					if ($(this).find("option:contains('')"))
						$(this).val('');
					else
						$(this).find("option:first").attr('selected',
								'selected');
				} else if ($(this).attr('type') !== 'button')
					$(this).val('');
				$(this).removeClass('requiredField');
			});
	$('#transactionWizardPopup .registeredOrderingParty span').each(function() {
        $(this).html('');
    });
	$('#bankIdDtlSpan').empty();
	$('#drawerAccountNoStaticInfoSpan').empty();
	removeUploadedImage();
	/* Below flag need to be checked every time while creating payment */
	$('[name="defaultAccountFlag"]').attr("checked", true); 
}

function showToolTip(ctrl, strHtml) {
	ctrl.unbind('mouseover');
	ctrl.unbind('mouseout');
	ctrl.bind('mouseover', function(e) {
				$('<span>').html(strHtml).attr('class', 'custom-tooltip').css({
						/*
						 * 'top' : 20, 'left' : e.pageX + 10, 'position' :
						 * 'absolute', 'border' : '1px solid #868686', 'padding' :
						 * '5px', 'max-height' : '500px', 'overflow' : 'auto',
						 * 'min-width' : '250px', 'background-color' :
						 * '#FFFFFF', 'z-index' : '1000'
						 */
						}).appendTo(ctrl);
			});

	ctrl.bind('mouseout', function(e) {
				$(this).find('span:last').remove();
			});
}
function destroyToolTip(ctrl) {
	ctrl.unbind('mouseover');
	ctrl.unbind('mouseout');
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

/* SI Processing section value population starts Copied from pirheader.js */
var arrPeriodWeek = new Array("('" +getLabel('weekly1','Weekly')+"',1)", "('"+getLabel('fortnightly','Every 2nd Week')+"',2)",
		"('"+getLabel('every3rdweek','Every 3rd Week')+"',3)", "('"+getLabel('every4thweek','Every 4th Week')+"',4)");
var arrMonthlyPeriod = new Array("('"+getLabel('monthly1','Monthly')+"',1)", "('"+getLabel('every2ndmonth','Every 2nd Month')+"',2)",
		"('" +getLabel('quarterly','Quarterly')+"',3)", "('" +getLabel('every4thmonth','Every 4th Month')+"',4)",
		"('" +getLabel('every5thmonth','Every 5th Month')+"',5)", "('" +getLabel('semiannually','Semi Annually')+"',6)",
		"('" +getLabel('every7thmonth','Every 7th Month')+"',7)", "('" +getLabel('every8thmonth','Every 8th Month')+"',8)",
		"('" +getLabel('every9thmonth','Every 9th Month')+"',9)", "('" +getLabel('every10thmonth','Every 10th Month')+"',10)",
		"('" +getLabel('every11thmonth','Every 11th Month')+"',11)", "('" +getLabel('annually','Annually')+"',12)");
var arrDailyPeriod = new Array("('" +getLabel('everyday','Everyday')+"',1)", "('" +getLabel('every2ndday','Every 2nd Day')+"',2)",
		"('" +getLabel('every3rdday','Every 3rd Day')+"',3)", "('" +getLabel('every4thday','Every 4th Day')+"',4)",
		"('" +getLabel('every5thday','Every 5th Day')+"',5)", "('" +getLabel('every6thday','Every 6th Day')+"',6)",
		"('" +getLabel('every7thday','Every 7th Day')+"',7)");
var arrRefMonth = new Array("('1',1)", "('2',2)", "('3',3)", "('4',4)",
		"('5',5)", "('6',6)", "('7',7)", "('8',8)", "('9',9)", "('10',10)",
		"('11',11)", "('12',12)", "('13',13)", "('14',14)", "('15',15)",
		"('16',16)", "('17',17)", "('18',18)", "('19',19)", "('20',20)",
		"('21',21)", "('22',22)", "('23',23)", "('24',24)", "('25',25)",
		"('26',26)", "('27',27)", "('28',28)", "('29',29)", "('30',30)",
		"('31',31)");
var arrSpecificDayPeriod = new Array("('" +getLabel('sunday','Sunday')+"',1)", "('" +getLabel('monday','Monday')+"',2)",
		"('" +getLabel('tuesday','Tuesday')+"',3)", "('" +getLabel('wednesday','Wednesday')+"',4)",
		"('" +getLabel('thursday','Thursday')+"',5)", "('" +getLabel('friday','Friday')+"',6)",
		"('" +getLabel('saturday','Saturday')+"',7)");
var strRefDay = new Array("('Not Applicable',"+startDayOfWeek+")");
var strRefWeekDay = new Array("('Sunday',1)", "('Monday',2)", "('Tuesday',3)",
		"('Wednesday',4)", "('Thursday',5)", "('Friday',6)", "('Saturday',7)");

var mapPeriodWeek = {
	'1' : 'Weekly',
	'2' : 'Every 2nd Week',
	'3' : 'Every 3rd Week',
	'4' : 'Every 4th Week'
};
var mapMonthlyPeriod = {
	'1' : 'Monthly',
	'2' : 'Every 2nd Month',
	'3' : 'Quarterly',
	'4' : 'Every 4th Month',
	'5' : 'Every 5th Month',
	'6' : 'Semi Annually',
	'7' : 'Every 7th Month',
	'8' : 'Every 8th Month',
	'9' : 'Every 9th Month',
	'10' : 'Every 10th Month',
	'11' : 'Every 11th Month',
	'12' : 'Annually'
};
var mapDailyPeriod = {
	'1' : 'Everyday',
	'2' : 'Every 2nd Day',
	'3' : 'Every 3rd Day',
	'4' : 'Every 4th Day',
	'5' : 'Every 5th Day',
	'6' : 'Every 6th Day',
	'7' : 'Every 7th Day'
};
var mapPeriodSpecificDay = {
		'1' : getLabel('sunday','Sunday'),
		'2' : getLabel('monday','Monday'),
		'3' : getLabel('tuesday','Tuesday'),
		'4' : getLabel('wednesday','Wednesday'),
		'5' : getLabel('thursday','Thursday'),
		'6' : getLabel('friday','Friday'),
		'7' : getLabel('saturday','Saturday')
	};
var mapRefMonth = {
	'1' : '1',
	'2' : '2',
	'3' : '3',
	'4' : '4',
	'5' : '5',
	'6' : '6',
	'7' : '7',
	'8' : '8',
	'9' : '9',
	'10' : '10',
	'11' : '11',
	'12' : '12',
	'13' : '13',
	'14' : '14',
	'15' : '15',
	'16' : '16',
	'17' : '17',
	'18' : '18',
	'19' : '19',
	'20' : '20',
	'21' : '21',
	'22' : '22',
	'23' : '23',
	'24' : '24',
	'25' : '25',
	'26' : '26',
	'27' : '27',
	'28' : '28',
	'29' : '29',
	'30' : '30',
	'31' : '31'
};
var mapRefDay = {
	 '1':'Not Applicable'
};
var mapRefWeekDay = {
		'1' : getLabel('sunday','Sunday'),
		'2' : getLabel('monday','Monday'),
		'3' : getLabel('tuesday','Tuesday'),
		'4' : getLabel('wednesday','Wednesday'),
		'5' : getLabel('thursday','Thursday'),
		'6' : getLabel('friday','Friday'),
		'7' : getLabel('saturday','Saturday')
};
var mapRefSpecificDay = {
		'1' : 'Sunday',
		'2' : 'Monday',
		'3' : 'Tuesday',
		'4' : 'Wednesday',
		'5' : 'Thursday',
		'6' : 'Friday',
		'7' : 'Saturday'
	};
var strRefDay = new Array("('Not Applicable',"+startDayOfWeek+")");
var HolidayAction = new Array( "('N/A',3)", "('Skip',2)" )
var strRefWeekDay = new Array("('" +getLabel('sunday','Sunday')+"',1)", "('" +getLabel('monday','Monday')+"',2)", "('" +getLabel('tuesday','Tuesday')+"',3)",
		"('" +getLabel('wednesday','Wednesday')+"',4)", "('" +getLabel('thursday','Thursday')+"',5)", "('" +getLabel('friday','Friday')+"',6)", "('" +getLabel('saturday','Saturday')+"',7)");
var strRefSpecificDay = new Array("('" +getLabel('sunday','Sunday')+"',1)", "('" +getLabel('monday','Monday')+"',2)", "('" +getLabel('tuesday','Tuesday')+"',3)",
		"('" +getLabel('wednesday','Wednesday')+"',4)", "('" +getLabel('thursday','Thursday')+"',5)", "('" +getLabel('friday','Friday')+"',6)", "('" +getLabel('saturday','Saturday')+"',7)");
var arrFrequency = new Array({
			key : "DAILY",
			value : "Daily"
		}, {
			key : "WEEKLY",
			value : "Weekly"
		}, {
			key : "MONTHLY",
			value : "Monthly"
		}, {
			key : "SPECIFICDAY",
			value : "Specific Day"
		});

var weekDaysMap = {
	"SUNDAY" : "1",
	"MONDAY" : "2",
	"TUESDAY" : "3",
	"WEDNESDAY" : "4",
	"THURSDAY" : "5",
	"FRIDAY" : "6",
	"SATURDAY" : "7"
};
function populateSIProcessingViewOnlyFields(strPmtType, Freq, gstrPeriod,
		gstrRef, strPostFix) {
	if (hasSIAccess != 'true') {
		return;
	}
	var intPeriod;

	$(".period" + strPostFix).empty();
	$(".refDay" + strPostFix).empty();
	if(strPmtType === 'Q')
		$("#refDayDiv,.refDayDiv").removeClass('hidden');
	else
		$("#refDay"+strPostFix+'Div').removeClass('hidden');
	if (Freq == "")
		return false;
	if (Freq == "WEEKLY") {
		$('.period' + strPostFix).html(mapPeriodWeek[gstrPeriod]);
		$(".refDay" + strPostFix).html(mapRefWeekDay[gstrRef]);
	} else {
		intPeriod = 7;
		if (Freq == "MONTHLY") {
			$('.period' + strPostFix).html(mapMonthlyPeriod[gstrPeriod]);
			$(".refDay" + strPostFix).html(mapRefMonth[gstrRef]);
		}

		if (Freq == "DAILY") {
			$('.period' + strPostFix).html(mapDailyPeriod[gstrPeriod]);
			$(".refDay" + strPostFix).html(mapRefDay[gstrRef]);
			if (strPmtType === 'Q')
				$("#refDayDiv,.refDayDiv").addClass('hidden');
			else
				$("#refDay" + strPostFix + 'Div').addClass('hidden');
		}
		
		if (Freq == "SPECIFICDAY") {
			$('.period' + strPostFix).html(mapPeriodSpecificDay[gstrPeriod]);
			$(".refDay" + strPostFix).html(mapRefSpecificDay[gstrRef]);
			$("#periodHdrInfoSpanDiv").addClass('hidden');
			$("#periodInfoSpanDiv").addClass('hidden');
			$('#refDay'+strPostFix).prev('label').text("Specific Day :");
			
			var arrGstRef = [];
			if(!Ext.isEmpty(gstrRef))
			{
				arrGstRef = gstrRef.split(',');
			}
			var strRefDay ='';
			if(!isEmpty(arrGstRef)){
				$.each(arrGstRef, function(index, opt) {
					strRefDay  = strRefDay + ''+ mapRefSpecificDay[arrGstRef[index]];
					 if (index < arrGstRef.length - 1) {
						 strRefDay = strRefDay+", ";
					 }
				});
			}
			var strRefDayTooltip = strRefDay;
			if(strRefDay.length > 40)
				strRefDay = strRefDay.substr(0,40) +'...';
			$(".refDay" + strPostFix).html(strRefDay);
			$(".refDay" + strPostFix).attr('title',strRefDayTooltip);
		}
	}
}
function populateSIFrequencyViewOnlyField(charPaymentType,strTypeOfDateVal,strPostFix) {
	//var strPostFix = charPaymentType === 'B' ? 'Hdr' : '';
	//var strTypeOfDateVal = $('#siExecutionDate' + strPostFix).val();
	$("#siFrequencyCode" + strPostFix).empty();
	for (var i = 0; i < arrFrequency.length; i++) {
		if (!isEmpty(strTypeOfDateVal) && strTypeOfDateVal === '1'
				&& arrFrequency[i].key === 'DAILY') {
		} else
			$('#siFrequencyCode' + strPostFix).append($("<option />")
					.val(arrFrequency[i].key).text(arrFrequency[i].value));

	}
	$("#siFrequencyCode" + strPostFix + " option:first").attr('selected',
			'selected');
	populateSIProcessing(charPaymentType);
}
function populateSIFrequencyField(charPaymentType) {
	var strPostFix = charPaymentType === 'B' ? 'Hdr' : '';
	var strTypeOfDateVal = $('#siExecutionDate' + strPostFix).val();
	$("#siFrequencyCode" + strPostFix).empty();
	for (var i = 0; i < arrFrequency.length; i++) {
		if (!isEmpty(strTypeOfDateVal) && strTypeOfDateVal === '1'
				&& (arrFrequency[i].key === 'DAILY' || arrFrequency[i].key === 'SPECIFICDAY')) {
		} else
			$('#siFrequencyCode' + strPostFix).append($("<option />")
					.val(arrFrequency[i].key).text(arrFrequency[i].value));

	}
	$("#siFrequencyCode" + strPostFix + " option:first").attr('selected',
			'selected');
	//FCM-41271 Onchange of Type of date changing nice select of frequency
	$("#siFrequencyCode" + strPostFix).niceSelect('update');
	populateSIProcessing(charPaymentType);
}
function setFocus(me)
{
	var objId= $("#" + me.id);
	if(objId.hasClass('jq-nice-select'))
		objId = $("#" +me.id+"-niceSelect")
	if(objId.length > 0)
		objId.focus();
}
function populateSIProcessing(strPmtType, Freq, gstrPeriod, gstrRef) {
	if (hasSIAccess != 'true' || (strEntryType==='PAYMENT' && strLayoutType==='TAXLAYOUT')) {
		return;
	}
	var i, intPeriod, strPostFix = '', clsHide = 'hidden';
	var weeklyOfDays = [];
	if (!isEmpty(arrWeeklyOff)) {
		for (var i = 0; i < arrWeeklyOff.length; i++) {
			var temp = arrWeeklyOff[i];
			if (weekDaysMap[temp])
				weeklyOfDays.push(weekDaysMap[temp]);
		}
	}
	if (strPmtType === 'B')
		strPostFix = 'Hdr';
	if (isEmpty(Freq))
		Freq = $("#siFrequencyCode" + strPostFix).val();

	if (isEmpty(gstrPeriod))
		gstrPeriod = $("#period" + strPostFix).val();

	if (isEmpty(gstrRef)){
		if(Freq === "MONTHLY"){
			gstrRef = 1;
		}else {
			gstrRef = startDayOfWeek;
		}
	}


	var lblRefDay = $("label[for='refDay" + strPostFix + "']");
	var lblHolidayAction = $("label[for='holidayAction" + strPostFix + "']");
	var lblPeriod = $("#period" + strPostFix + "Div");

	$("#period" + strPostFix).empty();
	$("#refDay" + strPostFix).empty();
	$("#siNextExecutionDate"+ strPostFix).attr("disabled","disabled");
	$("#siNextExecutionDate"+ strPostFix).removeClass('ft-datepicker');
	if (Freq == "")
		return false;
	if (Freq == "WEEKLY") {
		$("#refDay").multiselect('destroy');
		$("#refDayHdr").multiselect('destroy');
		
		for (var i = 0; i < arrPeriodWeek.length; i++) {
			eval("document.getElementById('period" + strPostFix
					+ "').options[i]=" + "new Option" + arrPeriodWeek[i]);
			if (parseInt(i,10) + 1 == gstrPeriod) {
				$('#period ' + strPostFix + ' option:eq(' + i + ')').attr(
						'selected', true);
			}
		}
		if( $( '#holidayAction'+strPostFix ).prop( 'disabled' )==true)
			{
				$( '#holidayAction'+strPostFix ).removeAttr('disabled');
				$( '#holidayAction'+strPostFix ).removeClass( 'disabled' );
			}
	
			// code to remove the N/A option if it exist for siHolidayAction
			var temp = $( '#holidayAction'+strPostFix+' option').length;
			if( temp == 4 )
			{
				$( "#holidayAction" +strPostFix+ " option[value='3']" ).remove();
			}

		var eleId = 'refDay' + strPostFix;
		for (var i = 0; i < strRefWeekDay.length; i++) 
		{
			var refId = strRefWeekDay[i].split(",");
			if (refId != undefined && refId != "")
			{
				refId = refId[1].replace(')','');
				if (jQuery.inArray(refId, weeklyOfDays) != -1)
				{
				continue;
				}
				else
				{
				var ele = document.getElementById('refDay' + strPostFix);
				eval("document.getElementById('refDay" + strPostFix
						+ "').options[" + ele.options.length + "]="
						+ "new Option" + strRefWeekDay[i]);
			}
		}
			
		}
		$("#" + eleId + " option").each(function() {
			if ($(this).val() === gstrRef)
						$(this).attr('selected', true);
				});
		$("#period" + strPostFix).val(gstrPeriod);
		lblRefDay.parent().removeClass(clsHide);
		$('#refDay'+strPostFix+'Lbl').text("Reference Day");
		lblHolidayAction.parent().removeClass(clsHide);
		lblPeriod.removeClass(clsHide);
		$("#period" + strPostFix).niceSelect();
		$("#period" + strPostFix).niceSelect('update');		
		$("#refDay" + strPostFix).niceSelect();
		$("#refDay" + strPostFix).niceSelect('update');
		
	} else {
		intPeriod = 7;
		if (Freq == "MONTHLY") {
			$("#refDay").multiselect('destroy');
			$("#refDayHdr").multiselect('destroy');
			
			intPeriod = arrMonthlyPeriod.length;
			for (var i = 0; i < intPeriod; i++) {
				eval("document.getElementById('period" + strPostFix
						+ "').options[i]=" + "new Option" + arrMonthlyPeriod[i]);
				if (parseInt(i,10) + 1 == gstrPeriod) {
					$('#period ' + strPostFix + ' option:eq(' + i + ')').attr(
							'selected', true);
				}
			}
			lblRefDay.parent().removeClass(clsHide);
			$('#refDay'+strPostFix+'Lbl').text("Reference Day");
			lblHolidayAction.parent().removeClass(clsHide);
			lblPeriod.removeClass(clsHide);
			$('#refDay'+strPostFix).niceSelect();
			$('#refDay'+strPostFix).niceSelect('update');
			$("#period" + strPostFix).niceSelect();
			$("#period" + strPostFix).niceSelect('update');
		}
		if (Freq == "MONTHLY") {
			var eleId = 'refDay' + strPostFix;
			$("#refDay").multiselect('destroy');
			$("#refDayHdr").multiselect('destroy');
			
			for (var i = 0; i < arrRefMonth.length; i++) {
				eval("document.getElementById('refDay" + strPostFix
						+ "').options[i]=" + "new Option" + arrRefMonth[i]);
			}
			$("#" + eleId + " option").each(function() {
				if ($(this).val() === gstrRef)
					$(this).attr('selected', true);
			});
			
			if( $( '#holidayAction'+strPostFix ).prop( 'disabled' )==true)
			{
				$( '#holidayAction'+strPostFix ).removeAttr('disabled');
				$( '#holidayAction'+strPostFix ).removeClass( 'disabled' );
			}
	
			// code to remove the N/A option if it exist for siHolidayAction
			var temp = $( '#holidayAction'+strPostFix+' option').length;
			if( temp == 4 )
			{
				$( "#holidayAction" +strPostFix+ " option[value='2']" ).remove();
			}
			
			$("#period" + strPostFix).val(gstrPeriod);
			lblRefDay.parent().removeClass(clsHide);
			$('#refDay'+strPostFix+'Lbl').text("Reference Day");
			lblHolidayAction.parent().removeClass(clsHide);
			lblPeriod.removeClass(clsHide);
			$('#refDay'+strPostFix).niceSelect();
			$('#refDay'+strPostFix).niceSelect('update');
			$("#period" + strPostFix).niceSelect();
			$("#period" + strPostFix).niceSelect('update');
		}
		if (Freq == "DAILY") {
			$("#refDayHdr").multiselect('destroy');
			$("#refDay").multiselect('destroy');
			var isPeriodExist = false;
			var keyItem = 0;
			var keyMapDailyPeriod = Object.keys(mapDailyPeriod);
			for (x in keyMapDailyPeriod)
			{
				keyItem = keyItem + 1;
				if (gstrPeriod == keyItem)
				{
					isPeriodExist = true;
				}
			}
			
			for (var i = 0; i < intPeriod; i++) {
				eval("document.getElementById('period" + strPostFix
						+ "').options[i]=" + "new Option" + arrDailyPeriod[i]);
				if (parseInt(i,10) + 1 == gstrPeriod) {
					$('#period ' + strPostFix + ' option:eq(' + i + ')').attr(
							'selected', true);
				}
			}
			for (var i = 0; i < strRefDay.length; i++) {
				eval("document.getElementById('refDay" + strPostFix
						+ "').options[i]=" + "new Option" + strRefDay[i]);
				if (parseInt(i,10) + 1 == gstrRef) {
					$('#refDay ' + strPostFix + ' option:eq(' + i + ')').attr(
							'selected', true);
				}
			}
			/*eval("document.getElementById('holidayAction" + strPostFix
						+ "').options[3]=" + "new Option" + HolidayAction[0]);*/
			$('#holidayAction' + strPostFix + ' option:eq(' + 2 + ')').attr(
							'selected', true);
			
			if (isPeriodExist && gstrPeriod != '1')
			{
				$( '#holidayAction'+strPostFix ).removeAttr('disabled');
				$( '#holidayAction'+strPostFix ).removeClass( 'disabled' );
			}
			else
			{
			$('#holidayAction' + strPostFix).attr('disabled','disabled');
			}
						
			$("#period" + strPostFix).val(gstrPeriod);

			lblRefDay.parent().addClass(clsHide);
			lblPeriod.removeClass(clsHide);
			// lblHolidayAction.parent().addClass("ui-helper-hidden");
			$("#refDayHdr").niceSelect();
			$("#refDayHdr").niceSelect('update');
			$("#period" + strPostFix).niceSelect();
			$("#period" + strPostFix).niceSelect('update');
		}
		if (Freq == "SPECIFICDAY") {
			$("#refDay").niceSelect('destroy');
			$("#refDayHdr").multiselect('destroy');
			for (var i = 0; i < strRefSpecificDay.length; i++) 
			{
				var refId = strRefSpecificDay[i].split(",");
				if (refId != undefined && refId != "")
				{
					refId = refId[1].replace(')','');
					if (jQuery.inArray(refId, weeklyOfDays) != -1)
					{
						continue;
					}
					else
					{
						var ele = document.getElementById('refDay' + strPostFix);
				eval("document.getElementById('refDay" + strPostFix
								+ "').options[" + ele.options.length + "]="
								+ "new Option" + strRefSpecificDay[i]);
				}
			}
				
			}

			lblRefDay.parent().removeClass(clsHide);
			$("#refDayHdr-niceSelect").remove();
			$('#refDay'+strPostFix+'Lbl').text("Specific Day");
			lblPeriod.addClass(clsHide);
			if (strPaymentType === 'QUICKPAY' || strPaymentType === 'QUICKPAYSTI'){
				$("#refDay").multiselect();
			}else if (strPaymentType === 'BATCHPAY' || strPaymentType === 'BATCHPAYSTI'){
				$("#refDayHdr").multiselect();
			}
			if( $( '#holidayAction'+strPostFix ).prop( 'disabled' )==true)
			{
				$( '#holidayAction'+strPostFix ).removeAttr('disabled');
				$( '#holidayAction'+strPostFix ).removeClass( 'disabled' );
			}
			var eleId = 'refDay' + strPostFix;
			var arrGstRef = [];
			if(!Ext.isEmpty(gstrRef))
			{
				arrGstRef = gstrRef.split(',');
			}
			$( "#"+eleId ).attr('multiple', "multiple");
			$( "#"+eleId ).val(arrGstRef);
			$( "#"+eleId ).multiselect("refresh");
			// code to remove the N/A option if it exist for siHolidayAction
			var temp = $( '#holidayAction'+strPostFix+' option').length;
			if( temp == 4 )
			{
				$( "#holidayAction" +strPostFix+ " option[value='2']" ).remove();
			}
		}
	}
		if ($('#holidayAction'+strPostFix+'-niceSelect').length)
			$('#holidayAction'+strPostFix).niceSelect('update');
		
		showNextDateOnPaymentScreen(strPaymentType);
}
/* SI Processing section value population Ends */

/* AVM/SVM Parsing logic starts here*/
function ShowRuleDesc(arrRule) {
	var strRule, strTemp, strTempVal, strValSearch, strElement, strType;
	var intLen, intI, intJ, intPos, intLevel;
	var strOpen, strClose, strAnd, strInsideGroup;
	var Exp = /\^/;

	strOpen = " OR ( ";
	strClose = " ) OR ";
	strAnd = " AND ";
	strInsideGroup = "";
	strRule = "";
	intLen = arrRule.length;

	for (intI = 0; intI <= intLen - 1; intI++) {
		strTemp = arrRule[intI];
		intJ = 0;

		strValSearch = strTemp;
		intPos = strValSearch.search(Exp);

		while (intPos > 0) {
			strTempVal = strValSearch.substr(0, intPos);
			if (intPos + 1 < strValSearch.length)
				strValSearch = strValSearch.substr(intPos + 1);
			else
				strValSearch = "";

			switch (intJ) {
			case 0:
				strElement = strTempVal;
				intJ++;
				break;
			case 1:
				strType = strTempVal;
				intJ++;
				break;
			case 2:
				intLevel = parseInt(strTempVal,10);
				intJ++;
				break;
			}
			if (strValSearch.length > 0)
				intPos = strValSearch.search(Exp);
			else
				intPos = -1;
		}

		if (strType == "G") {
			intGrpCount = 0;
			if (strRule.length > 0) {
				if (strInsideGroup == "Y")
					strRule = strRule + " ) " + strOpen;
				else
					strRule = strRule + strOpen;
			} else
				strRule = " ( ";

			strInsideGroup = "Y";
			continue;
		} else {
			if (intLevel == 1) {
				if (strInsideGroup == "Y") {
					strRule = strRule + strClose + strElement;
					strInsideGroup = "N";
					intGrpCount = 0;
				} else {
					if (strRule.length > 0)
						strRule = strRule + " OR " + strElement;
					else
						strRule = strElement;
				}

				continue;
			} else {
				if (intLevel == 2) {
					if (strInsideGroup == "Y") {
						intGrpCount++;
						if (strRule.substr(strRule.length - 2, 1) == "(")
							strRule = strRule + strElement;
						else
							strRule = strRule + strAnd + strElement;
						continue;
					}
				}
			}
		}
	}
	if (strInsideGroup == "Y") {
		strRule = strRule + " ) ";
		strInsideGroup == "N";
	}
	if (strRule == "")
		strRule = arrRule;
	return strRule;
}
/* AVM/SVM Parsing logic ends here*/

function handleOffsetDays(strMinDate,charPaymentType){
	var strFieldId = (charPaymentType === 'Q' ? 'txnDate' : 'txnDateHdr');
	var minDate = new Date(strMinDate);
	$('#'+strFieldId).datepicker("option", "minDate", minDate);
}

/* Debit/ Credit Labels common Map*/
var mapDrCrReadonlyLabel = {
		"BATCHPAY" : {
		"D" : {
			'ACCTRFLAYOUT' : getLabel('debitmultipleaccounts','Debit Multiple Accounts'),
			'SIMPLEACCTRFLAYOUT' : getLabel('debitmultipleaccounts','Debit Multiple Accounts'),
			'ACHLAYOUT' :  getLabel('debit','Debit'),
			'ACHIATLAYOUT' :  getLabel('debit','Debit'),
			'CASHLAYOUT' :  getLabel('debit','Debit'),
			'CHECKSLAYOUT' :  getLabel('debit','Debit'),
			'BILLPAYLAYOUT' :  getLabel('debit','Debit'),
			'TAXLAYOUT' :  getLabel('debit','Debit'),
			'WIRELAYOUT' : getLabel('drawdown','Drawdown'),
			'MIXEDLAYOUT' :  getLabel('debit','Debit'),
			'WIRESWIFTLAYOUT' : (strLayoutSubType === 'DRAWDOWN' ? getLabel('drawdown','Drawdown') : getLabel('debit','Debit')) 
		},
		"C" : {
			'ACCTRFLAYOUT' : getLabel('creditmultipleaccount','Credit Multiple Account'),
			'SIMPLEACCTRFLAYOUT' :  getLabel('debit','Debit'),
			'ACHLAYOUT' :  getLabel('credit','Credit'),
			'ACHIATLAYOUT' :  getLabel('credit','Credit'),
			'CHECKSLAYOUT' :  getLabel('credit','Credit'),
			'CASHLAYOUT' :  getLabel('credit','Credit'),
			'BILLPAYLAYOUT' :  getLabel('credit','Credit'),
			'TAXLAYOUT' :  getLabel('credit','Credit'),
			'WIRELAYOUT' :  getLabel('credit','Credit'),
			'MIXEDLAYOUT' :  getLabel('credit','Credit'),
			'WIRESWIFTLAYOUT' :  getLabel('credit','Credit')
		}
	},
	"QUICKPAY" : {
		"D" : {
			'ACCTRFLAYOUT' :  getLabel('debit','Debit'),
			'SIMPLEACCTRFLAYOUT' :  getLabel('debit','Debit'),
			'ACHLAYOUT' :  getLabel('debit','Debit'),
			'ACHIATLAYOUT' :  getLabel('debit','Debit'),
			'CHECKSLAYOUT' :  getLabel('debit','Debit'),
			'CASHLAYOUT' :  getLabel('debit','Debit'),
			'BILLPAYLAYOUT' :  getLabel('debit','Debit'),
			'TAXLAYOUT' :  getLabel('debit','Debit'),
			'WIRELAYOUT' : getLabel('drawdown','Drawdown'),
			'MIXEDLAYOUT' :  getLabel('debit','Debit'),
			'WIRESWIFTLAYOUT' : (strLayoutSubType === 'DRAWDOWN' ? getLabel('drawdown','Drawdown') :  getLabel('debit','Debit'))
		},
		"C" : {
			'ACCTRFLAYOUT' :  getLabel('credit','Credit'),
			'SIMPLEACCTRFLAYOUT' :  getLabel('debit','Debit'),
			'ACHLAYOUT' :  getLabel('credit','Credit'),
			'ACHIATLAYOUT' :  getLabel('credit','Credit'),
			'CHECKSLAYOUT' :  getLabel('credit','Credit'),
			'CASHLAYOUT' :  getLabel('credit','Credit'),
			'BILLPAYLAYOUT' :  getLabel('credit','Credit'),
			'TAXLAYOUT' :  getLabel('credit','Credit'),
			'WIRELAYOUT' :  getLabel('credit','Credit'),
			'MIXEDLAYOUT' :  getLabel('credit','Credit'),
			'WIRESWIFTLAYOUT' :  getLabel('credit','Credit')
		}
	},
	"QUICKPAYSTI" : {
		"D" : {
			'ACCTRFLAYOUT' :  getLabel('debit','Debit'),
			'SIMPLEACCTRFLAYOUT' :  getLabel('debit','Debit'),
			'ACHLAYOUT' :  getLabel('debit','Debit'),
			'ACHIATLAYOUT' :  getLabel('debit','Debit'),
			'CHECKSLAYOUT' :  getLabel('debit','Debit'),
			'CASHLAYOUT' :  getLabel('debit','Debit'),
			'BILLPAYLAYOUT' :  getLabel('debit','Debit'),
			'TAXLAYOUT' :  getLabel('debit','Debit'),
			'WIRELAYOUT' : getLabel('drawdown','Drawdown'),
			'MIXEDLAYOUT' :  getLabel('debit','Debit'),
			'WIRESWIFTLAYOUT' : (strLayoutSubType === 'DRAWDOWN' ? getLabel('drawdown','Drawdown') :  getLabel('debit','Debit'))
		},
		"C" : {
			'ACCTRFLAYOUT' :  getLabel('credit','Credit'),
			'SIMPLEACCTRFLAYOUT' :  getLabel('debit','Debit'),
			'ACHLAYOUT' :  getLabel('credit','Credit'),
			'ACHIATLAYOUT' :  getLabel('credit','Credit'),
			'CHECKSLAYOUT' :  getLabel('credit','Credit'),
			'CASHLAYOUT' :  getLabel('credit','Credit'),
			'BILLPAYLAYOUT' :  getLabel('credit','Credit'),
			'TAXLAYOUT' :  getLabel('credit','Credit'),
			'WIRELAYOUT' :  getLabel('credit','Credit'),
			'MIXEDLAYOUT' :  getLabel('credit','Credit'),
			'WIRESWIFTLAYOUT' :  getLabel('credit','Credit')
		}
	}
};
/* Debit/ Credit Labels common Map */		
function getPaymentUrlMap(entryType) {
	var objUrl = {
		'PAYMENT' : {
			'loadInstrumentFieldsUrl' : 'services/paymententry',
			'readSavedInstrumentUrl' : 'services/paymententry',
			'readViewInstrumentUrl' : 'services/paymententry',
			'saveInstrumentUrl' : 'services/paymententry',
			'submitInstrumentUrl' : 'services/payments/submit',
			'cancelInstrumentUrl' : 'paymentSummary.form',
			'backInstumentUrl' : 'createPaymentEntry.form',
			'backHeaderUrl' : 'createPaymentEntry.form',
			'createInstrumentUsingTemplateUrl' : 'services/paymentclone/id',

			'loadBatchHeaderFieldsUrl' : 'services/paymentheader',
			'readSavedBatchHeaderUrl' : 'services/paymentheader',
			'readViewBatchHeaderUrl' : 'services/paymentheader',
			'createBatchUsingTemplateUrl' : 'services/paymentclone',
			'saveBatchHeaderUrl' : 'services/paymentheader',
			'discardBatchUrl' : 'services/paymentsbatch/discard',
			'submitBatchUrl' : 'services/paymentsbatch/submit',
			'verifySubmitBatchUrl' : 'services/paymentsbatch/verifySubmit',
			'batchHeaderActionUrl' : 'services/paymentsbatch',
			'batchHeaderActionUrlSend' : 'services/paymentsbatch',
			'cancelBatchUrl' : 'paymentSummary.form',
			'cancelBankProcessingUrl' : 'showBankProcessingQueue.srvc',

			'loadBatchInstrumentFieldsUrl' : 'services/paymentinstrument',
			'readSavedBatchInstrumentUrl' : 'services/paymententry',
			'copyBatchInstrumentUrl' : 'services/paymentsbatch/clone.json',
			'gridGroupActionUrl' : 'services/payments',
			'gridDataUrl' : 'services/payments.json',
			'gridLayoutDataUrl' : 'services/paymententrygrid/id.json',

			'getAllSavedFiltersUrl' : 'services/userfilterslist/pmtTxnViewFilter.json',
			'deleteSavedFilterUrl' : 'services/userfilters/pmtTxnViewFilter/{0}/remove.json',
			'readSavedFilterUrl' : 'services/userfilters/pmtTxnViewFilter/{0}.json',
			'saveFilterUrl' : 'services/userfilters/pmtTxnViewFilter/{0}.json',
			'getSavedFiltersOrderUrl' : 'services/userpreferences/paymentcenter/pmtTxnViewAdvanceFilterOrder.json',
			'fileUploadUrl' : 'services/ach/addtransactions',
			'fileUploadStatusUrl' : 'services/ach/transactionStatus',

			'refreshEnrichmentsUrl' : 'services/refreshEnrichments',
			'rrValidateUrl' : 'services/paymentsbatch/rrvalidate',
			'cloneInstrument' : 'services/paymententryclone',
			'debitAdvice' : 'services/generateDebitAdviceReport.pdf',
			'paymentAdvice' : 'services/generatePayAdviceReport.pdf'
		},
		'SI' : {
			'loadInstrumentFieldsUrl' : 'services/sientry',
			'readSavedInstrumentUrl' : 'services/sientry',
			'readViewInstrumentUrl' : 'services/sientry',
			'saveInstrumentUrl' : 'services/sientry',
			'submitInstrumentUrl' : 'services/standinginst/submit',
			'cancelInstrumentUrl' : 'SISummary.form',
			'backInstumentUrl' : 'createSIEntry.form',
			'backHeaderUrl' : 'createSIEntry.form',
			'createInstrumentUsingTemplateUrl' : 'services/siclone/id',

			'loadBatchHeaderFieldsUrl' : 'services/siheader',
			'readSavedBatchHeaderUrl' : 'services/siheader',
			'readViewBatchHeaderUrl' : 'services/siheader',
			'saveBatchHeaderUrl' : 'services/siheader',
			'discardBatchUrl' : 'services/standingInstructions/discard',
			'submitBatchUrl' : 'services/standingInstructions/submit',
			'batchHeaderActionUrl' : 'services/standingInstructions',
			'cancelBatchUrl' : 'SISummary.form',

			'loadBatchInstrumentFieldsUrl' : 'services/siinstrument',
			'readSavedBatchInstrumentUrl' : 'services/sientry',
			'copyBatchInstrumentUrl' : '',
			'gridGroupActionUrl' : 'services/siinstruments',
			'gridDataUrl' : 'services/siinstruments.json',
			'gridLayoutDataUrl' : 'services/sientrygrid/id.json',

			'getAllSavedFiltersUrl' : 'services/userfilterslist/siTxnViewFilter.json',
			'deleteSavedFilterUrl' : 'services/userfilters/siTxnViewFilter/{0}/remove.json',
			'readSavedFilterUrl' : 'services/userfilters/siTxnViewFilter/{0}.json',
			'saveFilterUrl' : 'services/userfilters/siTxnViewFilter/{0}.json',
			'getSavedFiltersOrderUrl' : 'services/userpreferences/paymentcenter/siTxnViewAdvanceFilterOrder.json',
			'fileUploadUrl' : 'services/ach/addtransactions',
			'fileUploadStatusUrl' : 'services/ach/transactionStatus',

			'refreshEnrichmentsUrl' : 'services/refreshEnrichments',
			'rrValidateUrl' : 'services/standingInstructions/rrvalidate'
		},
		'TEMPLATE' : {
			'loadInstrumentFieldsUrl' : 'services/templateentry',
			'readSavedInstrumentUrl' : 'services/templateDetailEdit',
			'readViewInstrumentUrl' : 'services/templateDetailView',
			'saveInstrumentUrl' : 'services/templateentry',
			'submitInstrumentUrl' : 'services/templates/submit',
			'cancelInstrumentUrl' : 'templateSummary.form',
			'backInstumentUrl' : 'createTemplateEntry.form',
			'backHeaderUrl' : 'createTemplateEntry.form',
			'createInstrumentUsingTemplateUrl' : 'services/templateclone/id',

			'loadBatchHeaderFieldsUrl' : 'services/templateheader',
			'readSavedBatchHeaderUrl' : 'services/templateheaderEdit',
			'readViewBatchHeaderUrl' : 'services/templateheaderView',
			'createBatchUsingTemplateUrl' : 'services/templateclone',
			'saveBatchHeaderUrl' : 'services/templateheader',
			'discardBatchUrl' : 'services/templatesbatch/discard',
			'enableBatchUrl' : 'services/templatesbatch/enable',
			'disableBatchUrl' : 'services/templatesbatch/disable',
			'submitBatchUrl' : 'services/templatesbatch/submit',
			'authBatchUrl' : 'services/templatesbatch/auth',
			'rejectBatchurl' : 'services/templatesbatch/reject',
			'batchHeaderActionUrl' : 'services/templatesbatch',
			'cancelBatchUrl' : 'templateSummary.form',
			'loadBatchInstrumentFieldsUrl' : 'services/templateinstrument',
			'readSavedBatchInstrumentUrl' : 'services/templateentry',
			'copyBatchInstrumentUrl' : 'services/templatesbatch/clone.json',
			'gridGroupActionUrl' : 'services/templates',
			'gridDataUrl' : 'services/templates.json',
			'gridLayoutDataUrl' : 'services/templateentrygrid/id.json',

			'getAllSavedFiltersUrl' : 'services/userfilterslist/tempTxnViewFilter.json',
			'deleteSavedFilterUrl' : 'services/userfilters/tempTxnViewFilter/{0}/remove.json',
			'readSavedFilterUrl' : 'services/userfilters/tempTxnViewFilter/{0}.json',
			'saveFilterUrl' : 'services/userfilters/tempTxnViewFilter/{0}.json',
			'getSavedFiltersOrderUrl' : 'services/userpreferences/paymentcenter/tempTxnViewAdvanceFilterOrder.json',
			'fileUploadUrl' : 'services/ach/addtransactions',
			'fileUploadStatusUrl' : 'services/ach/transactionStatus',

			'refreshEnrichmentsUrl' : 'services/refreshEnrichments',
			'rrValidateUrl' : 'services/templatesbatch/rrvalidate'

		}
	}
	return objUrl[entryType];
}

/**
 * This function is used to check whether Account Number fields is enabled or disabled 
 * 
 * If Disabled (Because of selected in control field at template), 
 * then do not make an AJAX call to get all accounts to update the account list else update.
 * @returns bIsAccountEnabled, 
 */
function isAccountEnabled(){
	var retVal = $('#accountNoHdr') != undefined && $('#accountNoHdr').prop('disabled') ? false : true;
	return retVal;
}

function populateAccounts(me)
{
	var strData = {};
	var strUrl = 'services/getSendingAccountData.json';
	var companyId = me.value;
	selectedCompany = me.value;
	strData[ '$companyId' ] = companyId;
	strData[ '$id' ] = strPaymentHeaderIde;
	strData[ csrfTokenName ] = csrfTokenValue;
	blockUI();
		$.ajax(
				{
					url : strUrl,
					method : 'POST',
					data : strData,
					contentType : "application/json",
					complete : function(XMLHttpRequest, textStatus) {
						if ("error" == textStatus) {
							var arrError = new Array();
							arrError.push({
										"errorCode" : "Message",
										"errorMessage" : mapLbl['unknownErr']
									});
							paintErrors(arrError);
							blockPaymentUI(false);
						}
					},
					success : function( response )
					{
						loadSendingAccountBox( response );
						if(companyId == "")
							populateCompanyId(' ');
						unblockUI();
					}
				} );
}

function populateEndDate(tempEndDate,tempStartDate, strPayType)
{
	var strTempStartDtPostFix = tempStartDate;//"#templateStartDate";
	if (!isEmpty(strPayType) && strPayType === 'B') {
		strTempStartDtPostFix = strTempStartDtPostFix + 'Hdr';
	}
	if (tempEndDate != "") {
		var endDate = $(tempEndDate).val();
		if (endDate != "") {
			var templateEndDate = new Date(Ext.Date.parse(endDate, strExtApplicationDateFormat)); 
		  //var templateEndDate = new Date(Date.parse(endDate));
			//var templateStartDate = new Date(Date.parse($(strTempStartDtPostFix).val()));
			var startDt = $(strTempStartDtPostFix).val();
			var templateStartDate = new Date(Ext.Date.parse(startDt, strExtApplicationDateFormat));
			if (  !(isNaN(endDate) && !isNaN(templateEndDate))  || (templateStartDate >   templateEndDate))
			{ 
				templateEndDate.setDate(templateStartDate.getDate()+1);
				$(tempEndDate).datepicker('setDate', templateEndDate);
			} 
		}
	}
}

function loadSendingAccountBox(accountList)
{
	$( '#accountNoHdr > option' ).remove();
	eval( "document.getElementById('accountNoHdr').options[0]=" + "new Option('" + getLabel('selectAccount','Select Account') + "','" + '' + "')" );
	
	for( var i = 0 ; i < accountList.length ; i++ )
	{
        	opt = document.createElement("option");
            document.getElementById("accountNoHdr").options.add(opt);
            opt.text = accountList[i].description;
            opt.value = accountList[i].code;
            if(accountList.length == 1)
            	opt.selected = true;
            else if(selectedAccount == opt.value)
            	opt.selected = true;
	}
	if($('#accountNoHdrLbl').hasClass('required'))
	{
		//makeNiceSelect('accountNoHdr',true);
		markRequired($('#accountNoHdr'));
	}else{
		makeNiceSelect('accountNoHdr',false);
	}
	
	if(!isEmpty(paymentResponseHeaderData)){
		if (paymentResponseHeaderData && paymentResponseHeaderData.d && paymentResponseHeaderData.d.paymentEntry) {
			if (paymentResponseHeaderData.d.paymentEntry.standardField){
				arrFields = paymentResponseHeaderData.d.paymentEntry.standardField;
					$.each(arrFields, function(index, cfg) {
						if(cfg.fieldName === 'accountNo'){
							cfg['availableValues'] = (!isEmpty(accountList)) ? accountList :[];
							return false;
						}
					});
				}
			}
		}
	changeHdrButtonVisibility();
}

function populateCompanyId(me)
{
	var strData = {};
	var strUrl = 'services/getCompanyIDData.json';
	var accountId = me.value;
	selectedAccount = me.value;
	strData[ '$accountId' ] = accountId;
	strData[ '$id' ] = strPaymentHeaderIde;
	strData[ csrfTokenName ] = csrfTokenValue;
	blockUI();
	$.ajax(
	{
		url : strUrl,
		method : 'POST',
		data : strData,
		contentType : "application/json",
		complete : function(XMLHttpRequest, textStatus) {
			if ("error" == textStatus) {
				var arrError = new Array();
				arrError.push({
							"errorCode" : "Message",
							"errorMessage" : mapLbl['unknownErr']
						});
				paintErrors(arrError);
				blockPaymentUI(false);
			}
		},
		success : function( response )
		{
			loadCompanyIDBox( response );
				if(accountId == "")
					populateAccounts(' ');
				unblockUI();
		}
	} );

}
function loadCompanyIDBox( companyList )
{
	$( '#companyIdHdr > option' ).remove();
		eval( "document.getElementById('companyIdHdr').options[0]=" + "new Option('" + getLabel('selectCompany','Select Company') + "','" + '' + "')" );
	
	for( var i = 0 ; i < companyList.length ; i++ )
	{
        	opt = document.createElement("option");
            document.getElementById("companyIdHdr").options.add(opt);
            opt.text = companyList[i].description;
            opt.value = companyList[i].code;
            if(companyList.length == 1)
            	opt.selected = true;
            else if(selectedCompany == opt.value)
            	opt.selected = true;
	}
	if($('#companyIdHdrLbl').hasClass('required'))
	{
		makeNiceSelect('companyIdHdr',true);
		markRequired($('#companyIdHdr'));
	}else{
		makeNiceSelect('companyIdHdr',false);
	}
	
	if(!isEmpty(paymentResponseHeaderData)){
		if (paymentResponseHeaderData && paymentResponseHeaderData.d && paymentResponseHeaderData.d.paymentEntry) {
			if (paymentResponseHeaderData.d.paymentEntry.standardField){
				arrFields = paymentResponseHeaderData.d.paymentEntry.standardField;
					$.each(arrFields, function(index, cfg) {
						if(cfg.fieldName === 'companyId'){
							cfg['availableValues'] = (!isEmpty(companyList)) ? companyList :[];
							return false;
						}
					});
				}
			}
		}
	changeHdrButtonVisibility();
}

function showEditableFieldDisclaimerText() {
	if (blnAddendaDisclaimerVisibiliity)
		$('#addendaDisclaimerDiv').removeClass('hidden');
	else
		$('#addendaDisclaimerDiv').addClass('hidden');

	if (blnTransDisclaimerVisibiliity)
		$('#transactionEnrichDisclaimerDiv').removeClass('hidden');
	else
		$('#transactionEnrichDisclaimerDiv').addClass('hidden');
		
		
	if (strPaymentType==='BATCHPAY' && blnUdeHeaderDisclaimerVisibiliity)
		$('#paymentUdeEnrichDisclaimerDiv').removeClass('hidden');
	else
		$('#paymentUdeEnrichDisclaimerDiv').addClass('hidden');	
}

function getArrColsOfReKeyGrid(){
	var strDrCrFlag = (paymentResponseHeaderData && paymentResponseHeaderData.d && paymentResponseHeaderData.d.paymentEntry && 
						paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo && paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.hdrDrCrFlag) ? 
						paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.hdrDrCrFlag : 'C';	
	var APPROVAL_CONFIRMATION_REKEY_COLUMN_MODEL = [{
			"colId" : "srNo",
			"colHeader" : getLabel('srNo','Sr No'),
			"hidden" : false,
			"width" : 60,
			resizable : false,
			hideable : false,
			draggable : false,
			renderer : this.rekeyGridColumnRenderer
		},{
			"colId" : "referenceNo_stdField",
			"colHeader" : getLabel('colPaymentReference','Payment Reference'),
			"hidden" : false,
			"width" : 160,
			resizable : false,
			hideable : false,
			draggable : false,
			forceFit : true,
			renderer : this.rekeyGridColumnRenderer
		}, {
			"colId" : "drawerAccountNo_stdField",
			"colHeader" : strDrCrFlag === 'C' ?
			getLabel('receivingAccNo','Receiving Account') :
			strDrCrFlag === 'D' ?
			getLabel('lblColAccountNo','Sending Account') : 
			getLabel('receivingAccNo','Receiving Account'),
			"hidden" : strLayoutType === 'ACCTRFLAYOUT' ? false : true,
			"width" : 150,
			"resizable" : false,
			"hideable" : false,
			"draggable" : false,
			"forceFit" : true,
			renderer : this.rekeyGridColumnRenderer
		},{
			"colId" : "drawerAccountNo_regBeneField",
			"colHeader" : strAuthLevelGlb === 'I' ?
			getLabel('receivingAccNo','Receiving Account') :
			getLabel('lblColAccountNo','Sending Account'),
			"hidden" : strLayoutType === 'ACCTRFLAYOUT' ? true : false,
			"width" : 150,
			"resizable" : false,
			"hideable" : false,
			"draggable" : false,
			"forceFit" : true,
			renderer : this.rekeyGridColumnRenderer
		}, {
			"colId" : "drawerDescription_regBeneField",
			"colHeader" : getLabel('lblColReceiverName', 'Receiver Name'),
			"hidden" : false,
			"width" : 160,
			"resizable" : false,
			"hideable" : false,
			"draggable" : false,
			"forceFit" : true,
			renderer : this.rekeyGridColumnRenderer
		}, {
			"colId" : "amount_stdField",
			"colType" : "amount",
			"colHeader" :  getLabel('lblColAmount','Amount'),
			"hidden" : false,
			"width" : 140,
			"resizable" : false,
			"hideable" : false,
			"draggable" : false,
			"forceFit" : true,
			"tdCls":'amountCol',
			renderer : this.rekeyGridColumnRenderer
		}, {
			"colId" : "productCategoryDesc",
			"colHeader" :  getLabel('lblColPaymentCategory','Payment Type'),
			"hidden" : false,
			"width" : 160,
			"resizable" : false,
			"hideable" : false,
			"draggable" : false,
			"forceFit" : true,
			renderer : this.rekeyGridColumnRenderer
		}, {
			"colId" : "productTypeDesc",
			"colHeader" :  getLabel('lblColPaymentMetohd', 'Payment Package'),
			"hidden" : false,
			"width" : 160,
			"resizable" : false,
			"hideable" : false,
			"draggable" : false,
			"forceFit" : true,
			renderer : this.rekeyGridColumnRenderer
		}, {
			"colId" : "txnDate_stdField",
			"colHeader" : 'Effective Date',
			"hidden" : false,
			"width" : 90,
			"flex" : 1,
			"resizable" : false,
			"hideable" : false,
			"draggable" : false,
			"forceFit" : true,
			renderer : this.rekeyGridColumnRenderer 
 }];
 return APPROVAL_CONFIRMATION_REKEY_COLUMN_MODEL;
}

function showApprovalReKeyConfirmationTxnPopup (strUrl, remark, grid,
			arrSelectedRecords, strActionType, strAction) {
		var arrColumnModel = getArrColsOfReKeyGrid();
		var storeFields = ['referenceNo_stdField', 'drawerAccountNo_regBeneField', 'drawerDescription_regBeneField',
					'drawerAccountNo_stdField','amount_stdField', 'productCategoryDesc', 'productTypeDesc',
				'txnDate_stdField','__metadata'];
		
		showApprovalConfirmationReKeyPopup(arrSelectedRecords, arrColumnModel,
				storeFields, [strUrl, remark, grid, arrSelectedRecords,
						strActionType, strAction]);
}

var lastFieldFlag = false;
function showApprovalConfirmationReKeyPopup(arrSelectedRecords, arrColumnModel,
		storeFields, objDataArgs) {
	$("#approvalConfirmationPaymentTxnReKayViewScreenPopup").dialog({
		bgiframe : true,
		resizable : false,
		draggable : false,
		modal : true,
		width :  "735px",
		title : getLabel('rekeyverification',
				'Record Key Verification'),
		open : function(event, ui) {
			objReKeyTxnVerificationArgs = objDataArgs;
			objReKeyTxnGrid = null;
			$('#approvalConfirmationReKayTxnGrid').empty();
			objReKeyTxnGrid = createApprovalConfirmationReKeyTxnGrid(
					arrSelectedRecords, arrColumnModel, storeFields);	
			$("#approvalConfirmationPaymentTxnReKayViewScreenPopup").dialog("option", "position", { my : "center", at : "center", of : window });
		},
		close : function(event, ui) {
		}
	});
}

function createApprovalConfirmationReKeyTxnGrid(arrSelectedRecords, arrColumnModel,
		storeFields) {
	var store = createReKeyTxnGridStore(arrSelectedRecords, storeFields);
	var recordCount = arrSelectedRecords.length;
	var grid = Ext.create('Ext.grid.Panel', {
				store : store,
				width : 1110,
				overflowY : false,
				columns : getColumnsOfReKeyGrid(arrColumnModel),
				renderTo : 'approvalConfirmationReKayTxnGrid',
				plugins: [
			        Ext.create('Ext.grid.plugin.CellEditing', {
			            clicksToEdit: 1,
			            listeners: {
			            beforeedit: function(e, editor){
			                /*if (editor.record.get('count') == 3)
			                    return false;*/
			            	if(editor.record.index == recordCount - 1){
			            		lastFieldFlag = true;
			            	} else {
			            		lastFieldFlag = false;
			            	}
			            }
			        }
			        })
			    ]
			});
	return grid;
}

function createReKeyTxnGridStore(arrSelectedRecords, storeFields) {
	var gridJson = {};
	var gridObjectJson = {};
	var arrData = [];
	if(!isEmpty(arrSelectedRecords)){
		$.each(arrSelectedRecords, function(index, cfg) {
				var objData = cloneObject(cfg.data);
				if(objData.amount_stdField){
					objData.amount_stdField='';
				}
				arrData.push(objData);
			});
	}
	if (arrData) {
		gridJson['selectedRecords'] = arrData;
		gridJson['totalRows'] = arrData.length;
		gridJson['SUCCESS'] = true;
	}
	gridObjectJson['d'] = gridJson;

	var objReKeyStore = Ext.create('Ext.data.Store', {
				storeId : 'reKEyTxnRecordsStore',
				fields : storeFields,
				proxy : {
					type : 'pagingmemory',
					data : gridObjectJson,
					reader : {
						type : 'json',
						root : 'd.selectedRecords',
						totalProperty : 'totalRows',
						successProperty : 'SUCCESS'

					}
				}
			});
	objReKeyStore.load();
	return objReKeyStore;
}

function getColumnsOfReKeyGrid(arrColumnModel) {
	var arrColsPref = arrColumnModel;
	var arrCols = [], objCol = null, cfgCol = null;
	if (!Ext.isEmpty(arrColsPref)) {
		for (var i = 0; i < arrColsPref.length; i++) {
			objCol = arrColsPref[i];
			cfgCol = {};
			cfgCol.dataIndex = objCol.colId;
			cfgCol.text = objCol.colHeader;
			cfgCol.width = objCol.width;
			cfgCol.colType = objCol.colType;
			cfgCol.resizable = objCol.resizable;
			cfgCol.hidden = objCol.hidden;
			cfgCol.hideable = objCol.hideable;
			cfgCol.draggable = objCol.draggable;
			cfgCol.flex = objCol.flex;
			cfgCol.renderer = objCol.renderer;
			cfgCol.itemId = objCol.colId;
			// cfgCol.forceFit = objCol.forceFit;
			if (!Ext.isEmpty(objCol.colType) && cfgCol.colType === "amount") {
				cfgCol.editor = createAmountReKeyFieldEditor('amntReKeyCol', '', '', false);
				cfgCol.editor.cls = 'amountField';
				cfgCol.align = 'right';
			}
			if(cfgCol.colType === "count")
				cfgCol.align = 'right';
				
			arrCols.push(cfgCol);
		}
	}
	return arrCols;
}

function createAmountReKeyFieldEditor(fieldId, defValue, intMaxLength, isReadOnly) {
		var fieldCfg = {
			fieldCls : 'xn-valign-middle xn-form-text amountBox grid-field',
			allowBlank : true,
			itemId : fieldId,
			name : fieldId,
			disabled : isReadOnly,
			dataIndex : fieldId,
			value : defValue ? defValue : '',
			defValue : defValue ? defValue : '',
			focusable : true,
			listeners : {
				'render' : function(cmp, e) {
					cmp.getEl().on('mousedown', function(ev) {
								ev.preventDefault();
								cmp.focus(true);

							})
				},
				'afterrender' : function(field) {
					var strId = field.getEl() && field.getEl().id ? field
							.getEl().id : null;
					var inputField = strId ? $('#' + strId + ' input') : null;
					if (inputField) {
						inputField.autoNumeric("init", {
									aSep : strGroupSeparator,
									dGroup: strAmountDigitGroup,
									aDec : strDecimalSeparator,
									mDec : strAmountMinFraction,
									vMin : 0,
									vmax : '99999999999.99'
								});
					}
				},
				'focus' : function(field, e, eOpts) {
					e.stopEvent();
					field.focus(true);
					/*var me = this;
			        var inputElements = me.el.dom.getElementsByTagName('input');
			        if (inputElements.length >= 1) {
			            var val = inputElements[0].value; //store the value of the element
			            inputElements[0].focus();
			            //inputElements[0].value = ''; //clear the value of the element - Firefox needs this.
			            //inputElements[0].value = val; //reinsert the value, will behave like you typed it manually
			        }*/
				},
				'specialkey': function(field, event, eOpts) {
	                if (event.getKey() == event.TAB) {
	                	var strId = field.getActionEl()
	                			&& field.getActionEl().id
	                			? field.getActionEl().id
	                			: null;
	                	if(null != strId
	                		&& lastFieldFlag == true
	                		&& event.shiftKey == false){
	                		event.stopEvent();
	                		$("#"+strId).trigger("blur");
	                	}
	                }
                }
			}
		};
		var field = Ext.create('Ext.form.TextField', fieldCfg);
		return field;
}

function rekeyGridColumnRenderer(value, metaData) {
	var strRetVal = value;
	if(metaData.column.itemId == 'amount_stdField') {
		metaData.tdCls = 'amountCol';
		if(!Ext.isEmpty(value)
			&& !(value.indexOf('.') > -1)) {
			value = value.replace(',', '');
			var amountObj = $('<input type="text">')
							.autoNumeric('init',
								{
									aSep : strGroupSeparator, 
									aDec : strDecimalSeparator, 
									mDec : strAmountMinFraction, 
									vMin : 0,
									wEmpty : 'zero'
								});
			amountObj.autoNumeric('set',value);
			strRetVal = amountObj.val();
			amountObj.remove();
		}
	}else if(metaData.column.itemId == 'srNo'){
		strRetVal = metaData.recordIndex+1;
	}else if(metaData.column.itemId == 'productCategoryDesc'){
		strRetVal = metaData.record.data.__metadata._myproductDescription;
	}else if(metaData.column.itemId == 'productTypeDesc'){
		strRetVal = metaData.record.data.__metadata._productCategory;
	}else if(metaData.column.itemId == 'txnDate_stdField'){
	  if (!Ext.isDate(value)) 
           value = new Date(Date.parse(value));
      strRetVal= Ext.Date.dateFormat(value, strExtApplicationDateFormat || Ext.Date.defaultFormat);
	}
	if(!Ext.isEmpty(strRetVal)) {
		metaData.tdAttr = 'title="' + strRetVal + '"';
	}
	return strRetVal;
}

function closeReKeyApprovalConfirmationPopup(objDiv) {
	objReKeyTxnGrid = null;
	$('#'+objDiv).dialog('close');
}

function approvalConfirmationReKayTxnApprove() {
	handleReKeyAmountValidation(objReKeyTxnVerificationArgs);
}

function closeReKeyViewScreenPopup(objDiv){
	$('#'+objDiv).dialog('close');
}
function handleReKeyAmountValidation(objReKeyTxnVerificationArgs){
		var arrRecordsToReject= [],arrRecordsToApprove= [],arrResponse = [],strAuthLevel='',strUrl=null,objStoreAmtVal=null,strAmtValue='',isAmountEmpty=false;
		var showRejectConf = false;
		var objTxnGrid = objReKeyTxnVerificationArgs[2];
		var arrSelectedRecords = objReKeyTxnVerificationArgs[3];
		var strCalledFrom = objReKeyTxnVerificationArgs[4];
		strUrl = 'services/paymentsbatch/validateAmount.json';
		strAuthLevel = (paymentResponseHeaderData && paymentResponseHeaderData.d && paymentResponseHeaderData.d.paymentEntry && 
						paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo && paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.authLevel) ? 
						paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.authLevel : '';
		if(strAuthLevel === 'I')
			strUrl = 'services/payments/validateAmount.json';
			
		if (!Ext.isEmpty(arrSelectedRecords)) {
			var arrayJson = new Array();
			var records = (arrSelectedRecords || []);
			for (var index = 0; index < records.length; index++) {
				objStoreAmtVal = (objReKeyTxnGrid && objReKeyTxnGrid.getStore() && objReKeyTxnGrid.getStore().getAt(index) &&
												objReKeyTxnGrid.getStore().getAt(index).get('amount_stdField')) ? 
											objReKeyTxnGrid.getStore().getAt(index).get('amount_stdField') : '';
				if(!isEmpty(objStoreAmtVal)){
					var obj = $('<input type="text">');
					obj.autoNumeric('init');
					obj.val(objStoreAmtVal);
					strAmtValue = obj.autoNumeric('get');
					obj.remove();
				}
				
				if(isEmpty(strAmtValue))
					isAmountEmpty = true;
				
				arrayJson.push({
							serialNo : !Ext.isEmpty(objTxnGrid) ? objTxnGrid.getStore()
									.indexOf(records[index])+ 1 : '',
							popupSerialNo : index+1,
							identifier : records[index].data.__metadata._detailId,
							userMessage : (!isEmpty(strAmtValue)) ? parseFloat(strAmtValue) : strAmtValue
						});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});
						
			if(isAmountEmpty){
				showAmountEmptyWarningPopup();
			}
			else{
			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(jsonData) {
						var jsonRes = Ext.JSON.decode(jsonData.responseText);
						var srNos = '', objrec = null;
							if(jsonRes && jsonRes.d && jsonRes.d.instrumentActions){
								arrResponse = jsonRes.d.instrumentActions;
								if(strCalledFrom == 'TXNWIZVIEW'){
									if(arrResponse[0].success == "Y"){
										doHandlePaymentInstrumentAction('auth', false,'',arrResponse[0].recKeyValidation);
										closeReKeyApprovalConfirmationPopup('approvalConfirmationPaymentTxnReKayViewScreenPopup');
									}else{
										showReckeyTxnRejectConfirmationPopup('','','TXNWIZVIEW',arrSelectedRecords);
										srNos+=arrResponse[0].popupSerialNo;
										$('.srNos').text(srNos);
									}
								}else{
								$.each(arrResponse, function(index, cfg) {
										if(cfg.success == 'Y' && !isEmpty(objTxnGrid)){
											objrec = objTxnGrid.getStore().getAt(cfg.serialNo-1);
											objrec.set('rekeyIdentifier',cfg.recKeyValidation);
											objrec.commit();
											arrRecordsToApprove.push(objrec); 
										}else if(cfg.success == 'N' && !isEmpty(objTxnGrid)){
											srNos+=cfg.popupSerialNo+',';
											arrRecordsToReject.push(objTxnGrid.getStore().getAt(cfg.serialNo-1)); 
											showRejectConf = true;
										}
									});
								objReKeyTxnVerificationArgs[3] = arrRecordsToApprove;
								if(showRejectConf){
									showReckeyTxnRejectConfirmationPopup(arrRecordsToReject,[objReKeyTxnVerificationArgs],'',arrSelectedRecords);
									$('.srNos').text(srNos.slice(0,-1));
								}else{
									$(document).trigger("handleTxnApporvalConfirmed", [objReKeyTxnVerificationArgs[0],objReKeyTxnVerificationArgs[1],
														objReKeyTxnVerificationArgs[2],objReKeyTxnVerificationArgs[3],objReKeyTxnVerificationArgs[4],
														objReKeyTxnVerificationArgs[5]]);
									closeReKeyApprovalConfirmationPopup('approvalConfirmationPaymentTxnReKayViewScreenPopup');
								}
							}
							}
						},
						failure : function() {
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : getLabel(
												'instrumentErrorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										cls : 't7-popup',
										icon : Ext.MessageBox.ERROR
									});
						}
					});
			}
		}
}

function showReckeyTxnRejectConfirmationPopup(arrRecordsToReject,objRejDataArgs,strCalledFrom,arrSelectedRec) {
	$("#reckeyRejectTxnConfirmationPopupDiv").dialog({
		bgiframe : true,
		resizable : false,
		draggable : false,
		modal : true,
		width :  "535px",
		title : getLabel('error',
				'Error'),
		open : function(event, ui) {
			$('#btnTxnRejectCancel').unbind('click');
			$('#btnTxnRejectCancel').bind('click',{ arrRejectRec: arrRecordsToReject, objRejectDataArgs:objRejDataArgs,arrSelectedRec:arrSelectedRec},function(event) {
				var data = event.data;
				var arrSelectedRec = data.arrSelectedRec;
				objReKeyTxnVerificationArgs[3] = arrSelectedRec;
				closeReckeyTxnRejectConfirmationPopup('reckeyRejectTxnConfirmationPopupDiv');
			});
			$('#btnTxnRejectYes').unbind('click');
			$('#btnTxnRejectYes').bind('click',{ arrRejectRec: arrRecordsToReject, objRejectDataArgs:objRejDataArgs},function(event) {
				var data = event.data;
				if(strCalledFrom == 'TXNWIZVIEW'){
					doHandlePaymentInstrumentAction('reject', false,'Record Key verification failed.');
					closeReckeyTxnRejectConfirmationPopup('reckeyRejectTxnConfirmationPopupDiv');
					closeReKeyApprovalConfirmationPopup('approvalConfirmationPaymentTxnReKayViewScreenPopup');
				}else
				rejectTxnSelectedRecords(data.arrRejectRec,data.objRejectDataArgs[0]);
			});
			$("#reckeyRejectConfirmationPopupDiv").dialog("option", "position", { my : "center", at : "center", of : window });
		},
		close : function(event, ui) {
		}
	});

}

function closeReckeyTxnRejectConfirmationPopup(objDiv){
	$('#'+objDiv).dialog('close');
}

function rejectTxnSelectedRecords(arrRejectRec, objRejectDataArgs){
	var rejectSuccess = true;
	var summTxnGrd =objRejectDataArgs[2];
	var strGrpActionUrl = _mapUrl['gridGroupActionUrl'] + '/{0}.json';
	var strUrl = Ext.String.format(strGrpActionUrl,'reject');
	
			var arrayJson = new Array();
			var records = (arrRejectRec || []);
			for (var index = 0; index < records.length; index++) {
				arrayJson.push({
							serialNo : '',
							identifier : records[index].data.__metadata._detailId,
							userMessage : 'Record Key verification failed.'
						});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});
			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(jsonData) {
						var jsonRes = Ext.JSON.decode(jsonData.responseText);
						if(jsonRes && jsonRes.d && jsonRes.d.instrumentActions){
						var arrResp = jsonRes.d.instrumentActions;
								$.each(arrResp, function(index, cfg) {
										if(cfg.success == 'N'){
											rejectSuccess = false;
										}
									});
								if(rejectSuccess){
									closeReckeyTxnRejectConfirmationPopup('reckeyRejectTxnConfirmationPopupDiv');
									summTxnGrd.refreshData();
									if(!isEmpty(objReKeyTxnVerificationArgs[3]) && objReKeyTxnVerificationArgs[3].length > 0)
										$(document).trigger("handleTxnApporvalConfirmed", [objReKeyTxnVerificationArgs[0],objReKeyTxnVerificationArgs[1],
															objReKeyTxnVerificationArgs[2],objReKeyTxnVerificationArgs[3],objReKeyTxnVerificationArgs[4],
															objReKeyTxnVerificationArgs[5]]);
									closeReKeyApprovalConfirmationPopup('approvalConfirmationPaymentTxnReKayViewScreenPopup');
								}
							}
						},
						failure : function() {
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : getLabel(
												'instrumentErrorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										cls : 't7-popup',
										icon : Ext.MessageBox.ERROR
									});
						}
					});
}
/* rekey changes for single payment view starts*/
function getArrColsOfReKeyViewGrid(){
	var APPROVAL_CONFIRM_VIEW_REKEY_COLUMN_MODEL = [{
			"colId" : "srNo",
			"colHeader" : getLabel('srNo','Sr No'),
			"hidden" : false,
			"width" : 60,
			resizable : false,
			hideable : false,
			draggable : false,
			renderer : this.rekeyViewGridColumnRenderer
		},{
			"colId" : "referenceNo",
			"colHeader" : getLabel('colPaymentReference','Payment Reference'),
			"hidden" : false,
			"width" : 160,
			resizable : false,
			hideable : false,
			draggable : false,
			forceFit : true,
			renderer : this.rekeyViewGridColumnRenderer
		}, {
			"colId" : "accountNo",
			"colHeader" : getLabel('lblColAccountNo','Sending Account'),
			"hidden" : false,
			"width" : 140,
			"resizable" : false,
			"hideable" : false,
			"draggable" : false,
			"forceFit" : true,
			renderer : this.rekeyViewGridColumnRenderer
		}, {
			"colId" : "drawerDescription",
			"colHeader" : getLabel('lblColReceiverName', 'Receiver Name'),
			"hidden" : strPaymentType === 'BATCHPAY' ? true : false,
			"width" : 160,
			"resizable" : false,
			"hideable" : false,
			"draggable" : false,
			"forceFit" : true,
			renderer : this.rekeyViewGridColumnRenderer
		}, {
			"colId" : "amount",
			"colType" : "amount",
			"colHeader" :  getLabel('lblColAmount','Amount'),
			"hidden" : false,
			"width" : 140,
			"resizable" : false,
			"hideable" : false,
			"draggable" : false,
			"forceFit" : true,
			"colType" :"amount",
			"tdCls":'amountCol',
			renderer : this.rekeyViewGridColumnRenderer
		}, {
			"colId" : "enteredNo",
			"colType" : "count",
			"colHeader" :  getLabel('count','Count'),
			"hidden" : strPaymentType === 'BATCHPAY' ? false : true,
			"width" : 140,
			"resizable" : false,
			"hideable" : false,
			"draggable" : false,
			"forceFit" : true,
			renderer : this.rekeyViewGridColumnRenderer
		},{
			"colId" : "_productCategory",
			"colHeader" :  getLabel('lblColPaymentCategory','Payment Type'),
			"hidden" : false,
			"width" : 160,
			"resizable" : false,
			"hideable" : false,
			"draggable" : false,
			"forceFit" : true,
			renderer : this.rekeyViewGridColumnRenderer
		}, {
			"colId" : "_myproductDescription",
			"colHeader" :  getLabel('lblColPaymentMetohd', 'Payment Package'),
			"hidden" : false,
			"width" : 160,
			"resizable" : false,
			"hideable" : false,
			"draggable" : false,
			"forceFit" : true,
			renderer : this.rekeyViewGridColumnRenderer
		}, {
			"colId" : "txnDate",
			"colHeader" : 'Effective Date',
			"hidden" : false,
			"width" : 90,
			"flex" : 1,
			"resizable" : false,
			"hideable" : false,
			"draggable" : false,
			"forceFit" : true,
			renderer : Ext.util.Format.dateRenderer(strExtApplicationDateFormat)
 }];
 return APPROVAL_CONFIRM_VIEW_REKEY_COLUMN_MODEL;
}

function showReKeyViewScreenPopup () {
		var arrColumnModel = getArrColsOfReKeyViewGrid();
		var storeFields = ['referenceNo', 'drawerAccountNo','accountNo', 'drawerDescription','enteredNo',
				'amount', '_myproductDescription', '_productCategory','txnDate','detailId','headerId'];
		showReKeyApprovalViewScreenPopup(arrColumnModel,storeFields);
}

function showReKeyApprovalViewScreenPopup(arrColumnModel,storeFields) {
	$("#reKeyViewScreenPopup").dialog({
		bgiframe : true,
		resizable : false,
		draggable : false,
		modal : true,
		width :  "735px",
		title : getLabel('rekeyverification',
				'Record Key Verification'),
		open : function(event, ui) {
			objReKeyTxnGrid = null;
			$('#reKeyTxnViewGrid').empty();
			objReKeyTxnGrid = createReKeyViewGrid(arrColumnModel, storeFields);	
			$("#reKeyViewScreenPopup").dialog("option", "position", { my : "center", at : "center", of : window });
		},
		close : function(event, ui) {
		}
	});
}

function createReKeyViewGrid(arrColumnModel,storeFields) {
	var store = createReKeyViewGridStore( storeFields);
	var grid = Ext.create('Ext.grid.Panel', {
				store : store,
				width : 1100,
				overflowY : false,
				columns : getColumnsOfReKeyGrid(arrColumnModel),
				renderTo : 'reKeyTxnViewGrid',
				plugins: [
			        Ext.create('Ext.grid.plugin.CellEditing', {
			            clicksToEdit: 1,
			            listeners: {
			            beforeedit: function(e, editor){
			                //if (editor.record.get('count') == 3)
			                   return true;
			            }
			        }
			        })
			    ]
			});
	return grid;
}


function createReKeyViewGridStore(storeFields) {
	var gridJson = {},gridObjectJson = {},storeData = {};
	var arrFields = [];
	var paymentData = strPaymentType === 'BATCHPAY' ? paymentResponseHeaderData : paymentResponseInstrumentData;
	if(!isEmpty(paymentData)){
		if (paymentData && paymentData.d && paymentData.d.paymentEntry) {
			if (paymentData.d.paymentEntry.standardField){
				arrFields = paymentData.d.paymentEntry.standardField;
					$.each(arrFields, function(index, cfg) {
						if(cfg.fieldName === 'referenceNo'|| cfg.fieldName === 'enteredNo' ||
						cfg.fieldName === 'drawerAccountNo'||cfg.fieldName === 'drawerDescription'||
						cfg.fieldName === 'txnDate' || cfg.fieldName === 'accountNo'){
							storeData[cfg.fieldName ] = cfg.value;
						}else if(cfg.fieldName === 'amount'){
							storeData[cfg.fieldName ] = '';
						}
					});
				}
				if (paymentData.d.paymentEntry.paymentMetaData){
					storeData['detailId' ] = paymentData.d.paymentEntry.paymentMetaData._detailId;
					storeData['headerId' ] = paymentData.d.paymentEntry.paymentMetaData._headerId;	
					storeData['_productCategory' ] = paymentData.d.paymentEntry.paymentMetaData._productCategory;
					storeData['_myproductDescription' ] = paymentData.d.paymentEntry.paymentMetaData._myproductDescription;
				}
			}
		}
	arrFields = getReceiverFields(paymentData);
	if (arrFields) {
		$.each(arrFields, function(index, cfg) {
					if (cfg.fieldName === 'drawerDescription') {
						storeData[cfg.fieldName] = cfg.value;
					}
				});

	}
	if (storeData ) {
		gridJson['selectedRecords'] = [storeData];
		gridJson['totalRows'] = storeData.length;
		gridJson['SUCCESS'] = true;
	}
	gridObjectJson['d'] = gridJson;

	var objReKeyViewStore = Ext.create('Ext.data.Store', {
				storeId : 'reKEyTxnRecordsStore',
				fields : storeFields,
				proxy : {
					type : 'pagingmemory',
					data : gridObjectJson,
					reader : {
						type : 'json',
						root : 'd.selectedRecords',
						totalProperty : 'totalRows',
						successProperty : 'SUCCESS'

					}
				}
			});
	objReKeyViewStore.load();
	return objReKeyViewStore;
}

function rekeyViewGridColumnRenderer(value, metaData) {
	var strRetVal = value;
	if(metaData.column.itemId == 'amount') {
		metaData.tdCls = 'amountCol';
	}else if(metaData.column.itemId == 'srNo'){
		strRetVal = metaData.recordIndex+1;
	}else if(metaData.column.itemId == 'productCategoryDesc'){
		strRetVal = metaData.record.data.__metadata._myproductDescription;
	}else if(metaData.column.itemId == 'productTypeDesc'){
		strRetVal = metaData.record.data.__metadata._productCategory;
	}
	if(!Ext.isEmpty(strRetVal)) {
		metaData.tdAttr = 'title="' + strRetVal + '"';
	}
	return strRetVal;
}
function approvalConfirmReKeyViewApprove() {
	var rec = objReKeyTxnGrid.getStore().getAt(0);
	handleReKeyViewAmountValidation([rec],'QUICKPAYVIEW');
}

function showReckeyRejectConfirmationViewPopupDiv(){
$("#reckeyRejectConfirmationViewPopupDiv").dialog({
		bgiframe : true,
		resizable : false,
		draggable : false,
		modal : true,
		width :  "535px",
		title : getLabel('error',
				'Error'),
		open : function(event, ui) {
			$('#btnViewRejectCancel').unbind('click');
			$('#btnViewRejectCancel').bind('click',function(event) {
				closeReKeyViewScreenPopup('reckeyRejectConfirmationViewPopupDiv');
			});
			$('#btnViewRejectYes').unbind('click');
			$('#btnViewRejectYes').bind('click',function(event) {
				if(strPaymentType === 'BATCHPAY'){
					doHandlePaymentHeaderActions('reject','Record Key verification failed.');
				}else{
					doHandlePaymentInstrumentAction('reject', true,'Record Key verification failed.');
				}
				closeReKeyViewScreenPopup('reckeyRejectConfirmationViewPopupDiv');
				closeReKeyViewScreenPopup('reKeyViewScreenPopup');
			});
			$("#reckeyRejectConfirmationViewPopupDiv").dialog("option", "position", { my : "center", at : "center", of : window });
		},
		close : function(event, ui) {
		}
	});

}
function handleReKeyViewAmountValidation(arrSelectedRecords,strCalledFrom){
		var arrResponse = [],strUrl=null,objStoreAmtVal='',strAmtValue='',isAmountEmpty=false;
		strUrl = 'services/paymentsbatch/validateAmount.json';		
			
		if (!Ext.isEmpty(arrSelectedRecords)) {
			var arrayJson = new Array();
			var records = (arrSelectedRecords || []);
			for (var index = 0; index < records.length; index++) {
				objStoreAmtVal = (records[index].data.amount) ? records[index].data.amount : '';
				if(!isEmpty(objStoreAmtVal)){
					var obj = $('<input type="text">');
					obj.autoNumeric('init');
					obj.val(objStoreAmtVal);
					strAmtValue = obj.autoNumeric('get');
					obj.remove();
				}
				if(isEmpty(strAmtValue))
					isAmountEmpty = true;
					
				arrayJson.push({
							serialNo : '',
							popupSerialNo : index+1,
							identifier : records[index].data.headerId,
							userMessage : (!isEmpty(strAmtValue)) ? parseFloat(strAmtValue) : strAmtValue
						});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});
			if(isAmountEmpty){
				showAmountEmptyWarningPopup();
			}
			else{
				Ext.Ajax.request({
							url : strUrl,
							method : 'POST',
							jsonData : Ext.encode(arrayJson),
							success : function(jsonData) {
							var jsonRes = Ext.JSON.decode(jsonData.responseText);
							var srNos = '';
								if(jsonRes && jsonRes.d && jsonRes.d.instrumentActions){
									arrResponse = jsonRes.d.instrumentActions;
										if(arrResponse[0].success == "Y" && strPaymentType ==='QUICKPAY'){
											doHandlePaymentInstrumentAction('auth', true,'',arrResponse[0].recKeyValidation);
											closeReKeyViewScreenPopup('reKeyViewScreenPopup');
										}else if(arrResponse[0].success == "Y" && strPaymentType ==='BATCHPAY'){
											doHandlePaymentHeaderActions('auth','','',arrResponse[0].recKeyValidation);
											closeReKeyViewScreenPopup('reKeyViewScreenPopup');
										}else if(arrResponse[0].success == "N"){
											showReckeyRejectConfirmationViewPopupDiv();
											srNos+=arrResponse[0].popupSerialNo;
											$('.srNos').text(srNos);
										}
								}
							},
							failure : function() {
								var errMsg = "";
								Ext.MessageBox.show({
											title : getLabel(
													'instrumentErrorPopUpTitle',
													'Error'),
											msg : getLabel(
													'instrumentErrorPopUpMsg',
													'Error while fetching data..!'),
											buttons : Ext.MessageBox.OK,
											cls : 't7-popup',
											icon : Ext.MessageBox.ERROR
										});
							}
						});
			}
		}
}
/* rekey changes for single payment view starts*/

function showAmountEmptyWarningPopup() {
	var _objDialog = $('#amountEmptyWarningPopup');
	_objDialog.dialog({
				bgiframe : true,
				autoOpen : false,
				modal : true,
				draggable : false,
				resizable : false,
				width : "320px"
			});
	_objDialog.dialog('open');
	_objDialog.dialog('option', 'position', 'center');
}

function closeAmountWarningPopup(){
	$('#amountEmptyWarningPopup').dialog('close');
}
function getReceiverFields(data) {
	var beneData = (data && data.d && data.d.paymentEntry && data.d.paymentEntry.beneficiary)
			? data.d.paymentEntry.beneficiary
			: null;
	var strDrawerRegistedFlag = (beneData && beneData.drawerRegistedFlag)
			? beneData.drawerRegistedFlag
			: '';
	var blnAdhocAllowed = (beneData && beneData.adhocBene) ? true : false;
	var arrFields = null;

	if (!blnAdhocAllowed)
		strDrawerRegistedFlag = 'R';

	if (blnAdhocAllowed && Ext.isEmpty(strDrawerRegistedFlag))
		strDrawerRegistedFlag = 'A';

	if (strDrawerRegistedFlag === 'R')
		arrFields = (beneData && beneData.registeredBene)
				? beneData.registeredBene
				: null;
	else
		arrFields = (beneData && beneData.adhocBene)
				? beneData.adhocBene
				: null;

	return arrFields;
}

function isUseInMobileApplicable(data){
	var blnUseInMobile = false,arrFields = [];
	if(!isEmpty(data)){
		if (data && data.d && data.d.paymentEntry) {
			if (data.d.paymentEntry.standardField){
				arrFields = data.d.paymentEntry.standardField;
					$.each(arrFields, function(index, cfg) {
						if(cfg.fieldName === 'useInMobilePayments'){
							blnUseInMobile = true;
						}
					});
				}
			}
	}
	return blnUseInMobile;
}

function convertEnrichmentDateFormat(inputDateFormat) {
	// Values from enrichment profile date format dropdown 
	var validDateFormats = {
		"dd/MM/yyyy" : "dd/mm/yy",
		"MM/dd/yyyy" : "mm/dd/yy",
		"yyyy/MM/dd" : "yy/mm/dd",
		"ddMMyyyy"   : "ddmmyy",
		"MMddyyyy"   : "mmddyy"
	}
	return validDateFormats[inputDateFormat];
}

function handleDisplayPhysicalPaymentFields(strPrdID){
	var payLocAvailableValues;
	if (paymentResponseInstrumentData
			&& paymentResponseInstrumentData.d
			&& paymentResponseInstrumentData.d.paymentEntry
			&& paymentResponseInstrumentData.d.paymentEntry.standardField){
		var data = paymentResponseInstrumentData.d.paymentEntry.standardField;
		if (data && data.length > 0) {
			$.each(data, function(index, cfg) {
				if (cfg.fieldName === 'payLocation'){
					if(cfg.availableValues)
					{
						payLocAvailableValues = cfg.availableValues;
					}
				}
			});
		}
	}
	if(($.inArray(strPrdID, ['01','02','07']) >= 0))
	{
		var length = $('#drawerDeliveryMode > option').length;
		$("label[for='drawerDeliveryMode']").addClass('required');
		if(length == 1)
		{
			$("label[for='drawerDeliveryMode']").removeClass('required');
		}
	}
	var deliveryMode = $('#drawerDeliveryMode').val();
	if(deliveryMode == "6"){
		handlePickbarchField(deliveryMode,'N');
		$("#deliveryDetails").val('').attr('disabled','disabled');
		if($('#coDraweeBranch > option').length ==2){			
			$("#coDraweeBranchListSpan").text($('#coDraweeBranch option:eq(1)').text());
			
			$("#coDraweeBranch").val($('#coDraweeBranch option:eq(1)').val());
			$("#coDraweeBranch").niceSelect('update');
		}
		$("label[for='drawerDeliveryMode'],label[for='payLocationDesc'],label[for='coAuthPersonName'],label[for='coAuthPersonIC'],label[for='coDraweeBranch'],label[for='coAuthPersonIdType']").addClass('required');
		$("#coDraweeBranch,#payLocation,#payLocationDesc").removeAttr('disabled');
		$("#coDraweeBranch").niceSelect('update');
		if(payLocAvailableValues && payLocAvailableValues.length == 1){
			$("#payLocation").val(payLocAvailableValues[0].code);
			$("#payLocationDesc").val(payLocAvailableValues[0].description);
		}
		if(strPrdID == '30')
		{
			$("#payLocation").attr('disabled','disabled');
			$("#payLocationDesc").attr('disabled','disabled');
		}
	} else if(deliveryMode == "10"){
		$("#deliveryDetails").val('').attr('disabled','disabled');
		if($('#coDraweeBranch > option').length ==2){
			$("#coDraweeBranchListSpan").text($('#coDraweeBranch option:eq(1)').text());
			$("#coDraweeBranch").val($('#coDraweeBranch option:eq(1)').val());
			$("#coDraweeBranch").niceSelect('update');
		}
		if(strPrdID != '01')
			$("label[for='payLocationDesc']").addClass('required');
		else
			$("label[for='payLocationDesc']").removeClass('required');
		$("label[for='coDraweeBranch']").addClass('required');
		$("label[for='coAuthPersonName'],label[for='coAuthPersonIC'],label[for='coAuthPersonIdType']").removeClass('required');
		$("#coDraweeBranch,#payLocation,#payLocationDesc").removeAttr('disabled');
		$("#coDraweeBranch").niceSelect('update');
	} else if (isEmpty(deliveryMode)){
		handlePickbarchField(deliveryMode,null);
		$("#coDraweeBranch").removeAttr('disabled');
		$("#coDraweeBranch").niceSelect('update');
		if($('#coDraweeBranch > option').length ==2)
			$("#coDraweeBranchListSpan").text($('#coDraweeBranch option:eq(1)').text());
		if(strPrdID != '01' && strPrdID != '30')
			$("label[for='payLocationDesc']").addClass('required');
		else
			$("label[for='payLocationDesc']").removeClass('required');
		$("label[for='coAuthPersonIC'],label[for='coDraweeBranch'],label[for='coAuthPersonName'],label[for='coAuthPersonIdType']").removeClass('required');
	} else if(deliveryMode == '8'){
		handlePickbarchField(deliveryMode,'Y');
		$("#deliveryDetails").val('').attr('disabled','disabled');
		if($('#coDraweeBranch > option').length ==2){
			$("#coDraweeBranchListSpan").text($('#coDraweeBranch option:eq(1)').text());
			$("#coDraweeBranch").val($('#coDraweeBranch option:eq(1)').val());
			$("#coDraweeBranch").niceSelect('update');
		}
		if(payLocAvailableValues && payLocAvailableValues.length == 1){
			$("#payLocation").val(payLocAvailableValues[0].code);
			$("#payLocationDesc").val(payLocAvailableValues[0].description);
		}
		$("label[for='drawerDeliveryMode'],label[for='payLocationDesc'],label[for='coAuthPersonName'],label[for='coAuthPersonIC'],label[for='coDraweeBranch'],label[for='coAuthPersonIdType']").addClass('required');
		$("#coDraweeBranch,#payLocation,#payLocationDesc").removeAttr('disabled');
		$("#coDraweeBranch").niceSelect('update');
		if(strPrdID == '30')
		{
			$("#payLocation").attr('disabled','disabled');
			$("#payLocationDesc").attr('disabled','disabled');
		}
	}else{
		$("#deliveryDetails,#coDraweeBranch").val('').attr('disabled','disabled');
		$("#coDraweeBranch").niceSelect('update');
		$("#coDraweeBranchListSpan").text('');
		if(strPrdID === '30'){
			$("label[for='payLocationDesc']").removeClass('required');
			if(payLocAvailableValues && payLocAvailableValues.length == 1){
				$("#payLocation").val('');
				$("#payLocationDesc").val('');
			}
			else{
				$("#payLocation,#payLocationDesc").val('').attr('disabled','disabled');
			}
		}
		$("label[for='coAuthPersonName'],label[for='coAuthPersonIC'],label[for='coDraweeBranch'],label[for='coAuthPersonIdType']").removeClass('required');
	}
}
function handlePickbarchField(deliveryMode, partnerBankFlag){
	var arrPickupBranchVal,defValue,data,fieldId=null,objpickBranch=null;
	objpickBranch = $('#coDraweeBranch');
	if (paymentResponseInstrumentData
			&& paymentResponseInstrumentData.d
			&& paymentResponseInstrumentData.d.paymentEntry
			&& paymentResponseInstrumentData.d.paymentEntry.standardField){
		data = paymentResponseInstrumentData.d.paymentEntry.standardField;
		if (data) {
			if (data && data.length > 0) {
				$.each(data, function(index, cfg) {
					fieldId = cfg.fieldName;
					if(fieldId === 'coDraweeBranch'){
						arrPickupBranchVal= cfg.availableValues;
						defValue = cfg.value;
					}
					});
			}
		}
	}
	if(!isEmpty(arrPickupBranchVal)){
				objpickBranch.niceSelect("destroy");
				objpickBranch.find('option').remove();
				$('#coDraweeBranchListSpan').empty();
				objpickBranch.append($("<option />").val('').text(getLabel('select','Select')));
					$.each(arrPickupBranchVal, function(index, opt) {
						if(opt.additionalValue1 === partnerBankFlag || isEmpty(partnerBankFlag))
						{
							objpickBranch.append($("<option />").val(opt.code).text(opt.description));
						}
					});
				if(!isEmpty(defValue))
					objpickBranch.val(defValue);
				objpickBranch.niceSelect();
			}
	defaultPrickupBranchExtension();
}
//custmize functionality extension point to be managed through build scripts
function defaultPrickupBranchExtension() {}
function onChangePrintBranch() {
	$('#drawerDeliveryMode').val("0");
	$("#drawerDeliveryMode").niceSelect('update');
	$("#coDraweeBranch").val("");
	$('#coAuthPersonName').val('');
	$('#coAuthPersonIdType').val('');
	$("#coAuthPersonIdType").niceSelect('update');
	$('#coAuthPersonIC').val('');
	handleDisplayPhysicalPaymentFields(strPrdID);
}
function toggleCertificatePrinting(){
	if(isEmpty($('#receiverTaxId').val())){
		$('#whtCertificatePrinting').attr('disabled','disabled');
		$('#whtCertificatePrinting').attr('checked',false);
	} else{
		$('#whtCertificatePrinting').removeAttr('disabled');		
	}
}
function toggleWHTDetails(blnFireEvent){
		var isCheckWht, strPostFix = charPaymentType === 'B' ? 'Hdr' : '';
		isCheckWht = $('#whtApplicable'+strPostFix).attr('checked') ? true : false;
		$(document).trigger("handleRowEditable", [isCheckWht]);
}

function toggleGridButtons(){
	var isCheckWht;
	var strPostFix = charPaymentType === 'B' ? 'Hdr' : '';
	isCheckWht = $('#whtApplicable'+strPostFix).attr('checked') ? true : false;
	if(isCheckWht === true){
		$('#whtApplicable'+strPostFix).val('Y');
		if(charPaymentType === 'B'){
			if(strLayoutType === 'CHECKSLAYOUT')
				$('#btnImportTxn').addClass('button-grey-effect');
			else
				$('#btnAddRow,#btnAddUsing,#btnImportTxn').addClass('button-grey-effect');
		}
		
		$('#whtFieldsSectionInfoDiv').removeClass('hidden');
		
	}
	else{
		$('#whtApplicable'+strPostFix).val('N');
		if(charPaymentType === 'B'){
			if(strLayoutType === 'CHECKSLAYOUT')
				$('#btnImportTxn').removeClass('button-grey-effect');
			else
				$('#btnAddRow,#btnAddUsing,#btnImportTxn').removeClass('button-grey-effect');
		}
		$('#whtFieldsSectionInfoDiv').addClass('hidden');
	}
}

function toggleInstrumentWHTDetails(){
	var isCheckWht;
	
	if(strLayoutType !== 'MIXEDLAYOUT'){
		isCheckWht = $('#whtApplicable').attr('checked') ? true : false;
	}else {
		isCheckWht = $('#whtReqFlag').attr('checked') ? true : false;
	}
	
	
	if(isCheckWht === true){
		if(strLayoutType !== 'MIXEDLAYOUT'){
			$('#whtApplicable').val('Y');
		}else{
			$('#whtReqFlag').val('Y');
		}
		
		$('#whtFieldsSectionInfoDiv').removeClass('hidden');
		
		if(!isEmpty(objWHTDetailGrid)){
			objWHTDetailGrid.hide();
			objWHTDetailGrid.show();
		}
	}
	else if(isCheckWht === false){
	
		if(strLayoutType !== 'MIXEDLAYOUT'){
			$('#whtApplicable').val('N');
		}else{
			$('#whtReqFlag').val('N');
		}
		$('#whtFieldsSectionInfoDiv').addClass('hidden');
	}
}

function scrollToTop(){

	$("html, body").animate({
		scrollTop : 0
	}, "slow");
}

function handleElectronicAndPhysicalInstrumentFieldsHideAndShow(data){

		 
	var paymentMetaData = data.paymentMetaData;
	var adhocBeneData = data.beneficiary.adhocBene;
	var registeredBeneData = data.beneficiary.registeredBene;
	var instrumentId = paymentMetaData.instrumentId;
	var productLevel = data.paymentHeaderInfo.productLevel;
	var isWhtApplicable = false;
	var isMicrNoApplicable = false;
	var isInstrumentDateApplicable = false;
	var displayBankToBankInformationSectionInfo = false;
	var payLocationEnable = false ;
	if (instrumentId && '00' !== instrumentId) {
	
		arrFields = data.standardField;
		$.each(arrFields, function(index, cfg) {
			
			if('whtReqFlag' === cfg.fieldName || 'whtApplicable' === cfg.fieldName){
				
				isWhtApplicable = true;
				if(('BATCHPAY' === strPaymentType && 'I'=== productLevel) || ('QUICKPAY' === strPaymentType && 'B'=== productLevel)){
					$('#whtReqFlagDiv').removeClass('hidden');
				}
				if(cfg.value === 'Y'){
					$('#whtReqFlag').attr('checked','true');
					$('#whtReqFlag').val('Y');
					$('#whtFieldsSectionInfoDiv').removeClass('hidden');
				}else{
					$('#whtReqFlag').attr('checked',false);
					$('#whtReqFlag').val('N');
					$('#whtFieldsSectionInfoDiv').addClass('hidden');
				}
				
				if("true" === cfg.readOnly){
					$("#whtReqFlag").attr("readonly", true); 
					$("#whtReqFlag").attr("disabled", true); 
				}else{
					$("#whtReqFlag").attr("readonly", false); 
					$("#whtReqFlag").attr("disabled", false); 
				}
				
			}else if('micrNo' === cfg.fieldName){
				isMicrNoApplicable = true;
				$('#micrNoDiv').removeClass('hidden');
			}else if('instrumentDate' === cfg.fieldName){
				isInstrumentDateApplicable = true;
				$('#instrumentDateDiv').removeClass('hidden');
			}else if('charges' === cfg.fieldName){
				if('1' !== cfg.displayMode){
					$('#charges').niceSelect('update');
				}
			}
			else if('swiftSenderInfo1' === cfg.fieldName || 'swiftSenderInfo2' === cfg.fieldName || 'swiftSenderInfo3' === cfg.fieldName ||'swiftSenderInfo4' === cfg.fieldName){
                if('1' !== cfg.displayMode){
                    displayBankToBankInformationSectionInfo = true ;
                }
            }
			else if('payLocation' === cfg.fieldName)
			{
				payLocationEnable = true ;
			}
		});
		
		if(!isWhtApplicable){
			$('#whtReqFlagDiv').addClass('hidden');
			$('#whtFieldsSectionInfoDiv').addClass('hidden');
		}
		if(!isMicrNoApplicable){
			$('#micrNoDiv').addClass('hidden');
		}
		if(!isInstrumentDateApplicable){
			$('#instrumentDateDiv').addClass('hidden');
		}
		
		//cash withdrawal section
		if (data.cashwithdrawalDetails && data.cashwithdrawalDetails.denomination) {
			$('#cashwihdrawaldetails').removeClass('hidden');
		}else {
			$('#cashwihdrawaldetails').addClass('hidden');
		}
		
		//payout and delivery section
		if ('01' === instrumentId || '02' === instrumentId || '07' === instrumentId ||'30' === instrumentId) {
			$('#payoutanddeliveryDetailsSectionInfoDiv').removeClass('hidden');
			$('#showBankBranchPopupDiv').addClass('hidden');
			$('#searchBankDiv').addClass('hidden');
			$('.drawerBankBranchDetailsRDiv').addClass('hidden');
			$('.drawerAccountDetailsRDiv').addClass('hidden');
			if ('01' === instrumentId && payLocationEnable == false )
			{
				$('#payLocationDiv').addClass('hidden');
			}
		}
		else {
			$('#payoutanddeliveryDetailsSectionInfoDiv').addClass('hidden');
		}
		
		if (('01' === instrumentId || '02' === instrumentId || '07' === instrumentId) && displayBankToBankInformationSectionInfo) {
            $('#bankToBankInformationSectionInfoDiv').removeClass('hidden');    
        }
		else {
			$('#bankToBankInformationSectionInfoDiv').addClass('hidden');
		}
		if ('02' === instrumentId || '07' === instrumentId)
		{
			$('#instrumentDate').attr('disabled','disabled');
			$('#instrumentDateIconDiv').addClass('disabled','disabled');
		}
		else
		{
			$('#instrumentDate').removeAttr('disabled');
			$('#instrumentDateIconDiv').removeClass('disabled');
		}
		if ('30' === instrumentId) {
			$('#chargesDiv').addClass('hidden');			
		}
		else {
			$('#chargesDiv').removeClass('hidden');
		}
		
		
		
		//for adhoc bene
		if(adhocBeneData){
			$.each(adhocBeneData, function(index, cfg) {
				 if('beneficiaryBankIDType' === cfg.fieldName){
					if(cfg.displayMode && '1' === cfg.displayMode){
						$('#showBankBranchPopupDiv').addClass('hidden');
						$('#searchBankDiv').addClass('hidden');
						$('.drawerBankBranchDetailsRDiv').addClass('hidden');
					}else{
						$('#showBankBranchPopupDiv').removeClass('hidden');
						$('#searchBankDiv').removeClass('hidden');
						$('.drawerBankBranchDetailsRDiv').removeClass('hidden');
						if(cfg.availableValues && 1 != cfg.availableValues.length){
							populateSelectFieldValue("beneficiaryBankIDTypeA", cfg.availableValues,
									cfg.value);
							$("#beneficiaryBankIDTypeA-niceSelect").removeClass('hidden');
						}
					}
				 }else if('beneficiaryBranchDescription' === cfg.fieldName){
					 if(cfg.displayMode && '1' === cfg.displayMode){
						 //$('#beneficiaryBankDescriptionADiv').addClass('hidden');
						 $('#beneficiaryBranchDescriptionADiv').addClass('hidden');						 
					 }else{
						// $('#beneficiaryBankDescriptionADiv').removeClass('hidden');
						 $('#beneficiaryBranchDescriptionADiv').removeClass('hidden');
					 }
				 }
			});
		}
		//for registered Bene
		if(registeredBeneData){
			$.each(registeredBeneData, function(index, cfg) {
				if('drawerAccountNo' === cfg.fieldName){
					if(cfg.displayMode && '1' === cfg.displayMode){
						$('.drawerAccountDetailsRDiv').addClass('hidden');
					}else{
						$('.drawerAccountDetailsRDiv').removeClass('hidden');
					}
				}else if('drawerDescription' === cfg.fieldName){
					if(cfg.value){
						$('#drawerDescriptionR').val(cfg.value);
					}
					
				}
			});
		}
	}else {
		$('#payoutanddeliveryDetailsSectionInfoDiv').addClass('hidden');
		$('#bankToBankInformationSectionInfoDiv').addClass('hidden');
		$('#whtReqFlagDiv').addClass('hidden');
		$('#whtFieldsSectionInfoDiv').addClass('hidden');
		$('#cashwihdrawaldetails').addClass('hidden');
		$('#micrNoDiv').addClass('hidden');
		$('#instrumentDateDiv').addClass('hidden');
	}
 }
 
 function handleElectronicAndPhysicalInstrumentFieldsHideAndShowView(data){
	var paymentMetaData = data.paymentMetaData;
	var beneData = null;
	var instrumentId = paymentMetaData.instrumentId;
	var productLevel = data.paymentHeaderInfo.productLevel;
	var isWhtApplicable = false;
	var isMicrNoApplicable = false;
	var isInstrumentDateApplicable = false;
	var displayBankToBankInformationSectionInfo = false;

	if (data.beneficiary.drawerRegistedFlag == 'Y' || data.beneficiary.drawerRegistedFlag == 'R') {
		beneData = data.beneficiary.registeredBene;
	}
	else {
		beneData = data.beneficiary.adhocBene;
	}
	
	if (instrumentId && '00' !== instrumentId) {
	
		arrFields = data.standardField;
		$.each(arrFields, function(index, cfg) {
			
			if('whtReqFlag' === cfg.fieldName || 'whtApplicable' === cfg.fieldName){
				
				isWhtApplicable = true;
				if(('BATCHPAY' === strPaymentType && 'I'=== productLevel) || ('QUICKPAY' === strPaymentType && 'B'=== productLevel)){
					$('#whtReqFlag_InfoSpan').removeClass('hidden');
				}
				if(cfg.value === 'Y'){
					$('#whtFieldsSectionInfoViewDiv').removeClass('hidden');
				}
				
			}else if('micrNo' === cfg.fieldName){
				isMicrNoApplicable = true;
				$('#micrNo_InstViewDiv').removeClass('hidden');
			}else if('instrumentDate' === cfg.fieldName){
				isInstrumentDateApplicable = true;
				$('#instrumentDate_InstViewDiv').removeClass('hidden');
			}
			else if('swiftSenderInfo1' === cfg.fieldName || 'swiftSenderInfo2' === cfg.fieldName || 'swiftSenderInfo3' === cfg.fieldName ||'swiftSenderInfo4' === cfg.fieldName){
                if('1' !== cfg.displayMode){
                    displayBankToBankInformationSectionInfo = true ;
                }
            }
		});
		
		if(!isWhtApplicable){
			$('#whtReqFlag_InfoSpan').addClass('hidden');
			$('#whtFieldsSectionInfoViewDiv').addClass('hidden');
		}
		if(!isMicrNoApplicable){
			$('.micrNo_InstViewDiv').addClass('hidden');
		}
		if(!isInstrumentDateApplicable){
			$('.instrumentDate_InstViewDiv').addClass('hidden');
		}
		
		//cash withdrawal section
		if (data.cashwithdrawalDetails && data.cashwithdrawalDetails.denomination) {
			$('#cashwihdrawaldetailsView').removeClass('hidden');
		}else {
			$('#cashwihdrawaldetailsView').addClass('hidden');
		}
	
		//payout and delivery location section
		if ('01' === instrumentId || '02' === instrumentId || '07' === instrumentId || '30' === instrumentId) {
			
			$('#payoutanddeliveryDetailsSectionInfoDivView').removeClass('hidden');
			$('.drawerBankBranchAndAccountDetailsViewDiv').addClass('hidden');
		}
		else {
			$('#payoutanddeliveryDetailsSectionInfoDivView').addClass('hidden');
			$('.drawerBankBranchAndAccountDetailsViewDiv').removeClass('hidden');
		}
		if ('30' === instrumentId) {
			$('.chargesViewDiv').addClass('hidden');
		}
		else {			
			$('.chargesViewDiv').removeClass('hidden');
		}
		
		if (('01' === instrumentId || '02' === instrumentId || '07' === instrumentId) && displayBankToBankInformationSectionInfo) {
            $('#bankToBankInformationSectionInfoDivView').removeClass('hidden');    
        }
        else {
            $('#bankToBankInformationSectionInfoDivView').addClass('hidden');
        }
	
	}else {
		$('#payoutanddeliveryDetailsSectionInfoDivView').addClass('hidden');
	    $('#bankToBankInformationSectionInfoDivView').addClass('hidden');
		$('.whtReqFlag_InfoSpan').addClass('hidden');
		$('#whtFieldsSectionInfoViewDiv').addClass('hidden');
		$('#cashwihdrawaldetailsView').addClass('hidden');
		$('.micrNo_InstViewDiv').addClass('hidden');
		$('.instrumentDate_InstViewDiv').addClass('hidden');
	}
}
function showrejectWarningPopup() {
	var _objDialog = $('#rejectWarningPopup');
	_objDialog.dialog({
				bgiframe : true,
				autoOpen : false,
				modal : true,
				draggable : false,
				resizable : false,
				width : "320px"
			});
	_objDialog.dialog('open');
	_objDialog.dialog('option', 'position', 'center');
}

function closerejectWarningPopup(){
	$('#rejectWarningPopup').dialog('close');
}

function handleMaxLength(me,strId)
{
	var strValue = me.value ;
	if (strId.includes('swiftInstructionCode'))
		var lengthValue = 34 - strValue.length ; 
	else
		var lengthValue = 33 - strValue.length ; 
	if(strValue != "")
	{
		if (strValue == 'CTT')
			$("#"+strId).attr('maxlength', 33);
		else
			$("#"+strId).attr('maxlength', lengthValue);
	}
	else
	{
		$("#"+strId).attr('maxlength', 35);
		$("#"+strId).val("");
	}
		
}

function onPaste(me,strId)
{
	var strValue = me.maxLength;
	if(strValue != "")
	{
		$("#"+strId).attr('maxlength', strValue);
	}
	else
	{
		$("#"+strId).attr('maxlength', 35);
		$("#"+strId).val("");
	}
		
}
function resetPayoutDeleveryFields(){
	$("#payLocation,#payLocationDesc,#coDraweeBranch,#coAuthPersonName,#coAuthPersonIdType,#coAuthPersonIC,#deliveryDetails,").val('');
	$("#deliveryDetails,#coDraweeBranch").attr('disabled','disabled');
	$("#coDraweeBranch").niceSelect('update');
	$("#coDraweeBranchListSpan").text('');
	$("#coAuthPersonIdType").niceSelect('update');
}
function handleAndResetDisplayPhysicalPaymentFields(strPrdID){
	resetPayoutDeleveryFields();
	handleDisplayPhysicalPaymentFields(strPrdID)
}
