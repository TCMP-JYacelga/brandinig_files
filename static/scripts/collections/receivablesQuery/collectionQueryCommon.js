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
						.find('.canHide.hidden').length) {
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
		var splittedArray, accDescr, accNo, ccy;
		splittedArray = strAccDetails.split("-");
		accDescr = (splittedArray[0]).trim();
		if (splittedArray[1]) {
			splittedArray = splittedArray[1].split("(");
			accNo = (splittedArray[0]).trim();
		}
		if (splittedArray[1]) {
			splittedArray = splittedArray[1].split(")");
			ccy = splittedArray[0].trim();
		}
		return accDescr + "<br/>" + accNo + ", " + ccy;
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
		var splittedArray, accDescr, accNo, ccy;
		splittedArray = strAccDetails.split("-");
		accDescr = (splittedArray[0]).trim();
		return accDescr;
	} else
		return "";
}

function toggleIcon(iconId) {
	if ($("#" + iconId).hasClass('fa-plus')) {
		$("#" + iconId).removeClass('fa-plus');
		$("#" + iconId).addClass('fa-minus');
	} else {
		$("#" + iconId).removeClass('fa-minus');
		$("#" + iconId).addClass('fa-plus');
	}
}

function showErrorMsg(strErrorMsg) {
	var buttonsActionPopUpOpts = {};
	buttonsActionPopUpOpts['Cancel'] = function() {
		$(this).dialog("close");
	};
	$('#errorMsgSpan').text(strErrorMsg);
	$('#showErrorMsgPopUpDiv').dialog({
				title : "Error Message",
				autoOpen : false,
				height : 150,
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
	var maxLength, mapMaxLength = {
			'FED' : 9,
			'BIC' : 11,
			'ACH' : 6,
			'ACHA' : 9,
			'IBAN' : 34,
			'DEFAULT' : 35
		};
		
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
								"errorCode" : "FED",
								"errorMessage" : "ABA Routing number validation failed"
							});
				break;
			case 'BIC' :
				strValidationFlag = isValidBIC(strBankID);
				if (false === strValidationFlag)
					arrError.push({
								"errorCode" : "BIC",
								"errorMessage" : "BIC Routing number validation failed"
							});
				break;
			case 'ACH' :
				strValidationFlag = isValidCHIPSUID(strBankID);
				if (false === strValidationFlag)
					arrError.push({
						"errorCode" : "ACH",
						"errorMessage" : "CHIPS UID Routing number validation failed"
					});
				break;
			case 'ACHA' :
				strValidationFlag = isValidFedAba(strBankID);
				if (false === strValidationFlag)
					arrError.push({
								"errorCode" : "FED ACH",
								"errorMessage" : "FED ACH Routing number validation failed"
							});
				break;
			default :
				break;
		}
		
		if (strBankID.length > (mapMaxLength[strBankIdType] || mapMaxLength['DEFAULT'])) {
				strValidationFlag = false;
				arrError = [];
				if (strLayoutType === 'WIRELAYOUT'
						|| strLayoutType === 'ACHIATLAYOUT')
					strLabel = getLabel('beneficiaryBankIDCode_WIRELAYOUT',
							'Bank ID');
				else
					strLabel = getLabel('beneficiaryBankIDCode', 'Routing Number');
				arrError.push({
					"errorCode" : "ERR",
					"errorMessage" : '"'+strLabel+'" field length can not be greater than ' +(mapMaxLength[strBankIdType] || mapMaxLength['DEFAULT'])
				});
			}
	}

	// }
	if (strValidationFlag === false) {
		paintErrors(arrError);
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
	var iAbaTotal = 0;
	var iAbaCheckDigit = 0;
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
	var abaCheckDigit = 0;

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
			} else
				retValue = true;
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
								.text("Payment submitted. Warning limit exceeded!");
						element.appendTo($('#messageArea > ul'));
						blockPaymentUI(false);

					}
				}
			}
		}
	});

}
function autoFocusFirstElement(){
	if( strPaymentType == "QUICKPAY" || strPaymentType == "QUICKPAYSTI" ){
	$('.transaction-wizard :input:not(:checkbox):not(:radio):not([readonly]):visible:enabled:first').focus();
	}else{
	$('#paymentHeaderEntryStep2 :input:not(:checkbox):not(:radio):not([readonly]):visible:enabled:first').focus();
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
			message : '<div id="loadingMsg"><img src="static/styles/Themes/t7-main/resources/images/T7/loading.gif" style="background-position: left center;"/><span style="vertical-align: text-top; margin-left: 5px;">Loading...</span></div>',
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
			message : '<div id="loadingMsg"><img src="static/styles/Themes/t7-main/resources/images/T7/loading.gif" style="background-position: left center;"/><span style="vertical-align: text-top; margin-left: 5px;">Loading...</span></div>',
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

function goToPage(strUrl, frmId) {
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
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
				break;
			case '4' :
				break;

		}
	}
}
function updateFieldDisplayMode(field, label, cfg) {
	if (label && label.length != 0) {
		if (cfg.isSelected === true  || cfg.isRequiredDefault)
			label.addClass('required');
		else {
			label.removeClass('required');
			field.removeClass('requiredField');
			field.unbind('blur');
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
									.val(opt.code).text(opt.code));
						else
							field.append($("<option />").val(opt.code)
									.text(opt.code));
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
	if (isEmpty(defaultValue) || defaultValue=="0")
		defaultValue ="0.00";
	
	// jquery autoNumeric formatting
	$('#' + fieldId).autoNumeric("init",
	{
			aSep: strGroupSeparator,
			aDec: strDecimalSeparator,
			mDec: strAmountMinFraction,
			vMin: 0.0000,
			vMax: 9999999999999999.9999
	}); 
	$('#' + fieldId).autoNumeric('set', defaultValue);
	// jquery autoNumeric formatting
	//$('#' + fieldId).ForceNumericOnly(19,2);
	
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
			if (1 == optValues.length) {
				$('#' + fieldId + 'ListSpan').remove();
				if(isInLine){
					selectSpan = $('<span></span>', {
							html : optValues[0].description,
							id : fieldId + 'ListSpan',
							'class' : 'canRemove'
						});
				}
				else {
						selectSpan = $('<div></div>', {
									html : optValues[0].description,
									id : fieldId + 'ListSpan',
									'class' : 'canRemove',
									'style' : 'min-height:30px'
								});
				}		
				$(field).after($(selectSpan));
				$(field).addClass('hidden');
				if(fieldId === 'accountNo' || fieldId === 'drawerAccountNo' || fieldId === 'accountNoHdr' || fieldId === 'drawerAccountNoHdr')
					$('#'+fieldId+'_jq').addClass('hidden');
			}
			$.each(optValues, function(index, opt) {
						if ((!isEmpty(fieldValue) && fieldValue == opt.code))
							// || index == 0)
							field.append($('<option selected="true"/>')
									.val(opt.code).text(opt.description));
						else
							field.append($("<option />").val(opt.code)
									.text(opt.description));
					});
			if (optValues.length === 1) {
				$("#" + fieldId + " option:eq(1)").attr('selected', 'selected');
				field.attr('disabled', true);
				field.addClass('disabled');
			} else if (optValues.length > 1) {
				$(field).removeClass('hidden');
				$('#' + fieldId + 'ListSpan').remove();
				field.removeClass('disabled');
				field.removeAttr('disabled');
				field.removeAttr('readonly');
			}
		if((fieldId === 'accountNo' || fieldId === 'drawerAccountNo' || fieldId === 'accountNoHdr' || fieldId === 'drawerAccountNoHdr') && field.hasClass('jq-editable-combo'))
			field.editablecombobox('refresh')
		}
	}

}
function populateMultiSelectFieldValue(fieldId, optValues, arrFieldValue) {
	var field = $('#' + fieldId);
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
				var selectSpan = $('<div></div>', {
							html : optValues[0].description,
							id : fieldId + 'ListSpan',
							'class' : 'canRemove'
						});
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
						field.append($("<option />").val(opt.code)
								.text(opt.description));
					});
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
	var objData = data.d.receivableEntry.standardField;
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
						arrOfDefVal);
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
function handleTemplateTypeChange(strTemplateType, strPmtType) {
	var strFieldId = 'lockFieldsMask';
	var strPostFix = '';
	if (strPmtType === 'B')
		strPostFix = 'Hdr'
	strFieldId += strPostFix;
	var field = $('#' + strFieldId);
	var strAccountNoFieldId ='accountNo' + (strPmtType === 'B' ? 'Hdr' : '');
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
		field.multiselect("refresh");
		field.multiselect("widget").find(":checkbox").each(function() {
					if ($(this).val() === 'drawerCode') {
						$(this).attr("disabled", true);
					}
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
	if (strTemplateType === '3') {
		field.multiselect("widget").find(":checkbox").each(function() {
					if ($(this).val() === 'accountNo') {
						field.val(['accountNo'])
						objAccountNoCheckBox = $(this);
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
}

function toggleAccountFieldBehaviour(isMultiselect, strPmtType) {
	var strFieldId = strPmtType === 'B' ? 'accountNoHdr' : 'accountNo';
	var selectedVal = null, strDependantFieldId = null;
	var ctrl = $('#' + strFieldId);
	if (isMultiselect) {
		if(ctrl.hasClass('jq-editable-combo')){
			ctrl.editablecombobox("destroy");
		}
		ctrl.attr('multiple', true);
		ctrl.find("option[value='']").remove();
		if ($('option', ctrl).length > 5) {
			// apply multiselectgrid
			ctrl.multiselectgrid({
						title : 'Account Selection',
						onSelectionChange : function(values) {
							if ('B' === strPmtType)
								handleCurrencyMissmatchForPaymentHeader();
							else if ('Q' === strPmtType)
								handleCurrencyMissmatch();
						}
					});
			ctrl.multiselectgrid("refresh");
		} else if ($('option', ctrl).length != 1) {
			ctrl.multiselect({
						selectedList : 1,
						noneSelectedText : 'Select Account'
					});
			ctrl.multiselect("refresh");
		}
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
			ctrl.multiselectgrid("destroy");
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
			strDependantFieldId = 'drawerAccountNo';
		ctrl.editablecombobox({emptyText : 'Select Account',dependantFieldId : strDependantFieldId,maxLength : 40});
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
		objField.append($("<option />").val('').text('Select'));
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
function doDisableDefaultLockFields(strPmtType) {
	var strFieldId = 'lockFieldsMask';
	var strPostFix = '';
	if (strPmtType === 'B')
		strPostFix = 'Hdr'
	strFieldId += strPostFix;
	var field = $('#' + strFieldId);
	var strTemplateType = $('input[name="templateType' + strPostFix
			+ '"]:radio:checked').val();
	strTemplateType = strTemplateType ? strTemplateType : '1';
	var isDisabled = false;
	$('#' + strFieldId + ' option').attr('disabled', false);

	$('#' + strFieldId + ' option').each(function(i, option) {
		isDisabled = false;
		if (strTemplateType === '2'
				&& ($(option).val() === 'drawerCode' || $(option).val() === 'accountNo'))
			isDisabled = true;
		else if (strTemplateType === '3' && ($(option).val() === 'accountNo'))
			isDisabled = true;
		else if (strTemplateType === '1' && ($(option).val() === 'accountNo'))
			isDisabled = true;

		$("#lockFieldsMask" + strPostFix + " option[value='" + $(option).val()
				+ "']").attr("disabled", isDisabled);
	});
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
function generateControFiledMask(objAvaVal, arrDefVal) {
	// Size should be fix and defaulted. Currently its 15. The availabe array
	// sequence will always start with 0.
	var strMask = '0000000000000000000000';
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
	if (inputMask.charAt(bitPosition)
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
	} else {
		$('#' + id).val('N');
		if (id === 'controlTotalHdr') {
			$('#amountHdrLbl').removeClass('required');
			toggleControlTotalFiledDisabledValue();
			initatePaymentHeaderValidation();
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
	if (!isEmpty(maxLength))
		field.attr('maxLength', maxLength);
	if (blnReadOnly === true)
		field.attr('readonly', true);
	if (isEmpty(defaultValue) || defaultValue=="0")
		defaultValue="0.00";
	//field.val(defaultValue);
	//field.ForceNumericOnly(11,2);
	return field;
}
function createNumberBox(id, name, defaultValue, blnReadOnly, maxLength) {
	var field = $('<input>').attr({
				'id' : id,
				'name' : name,
				'type' : 'text',
				'tabindex':1,
				'class' : 'amountBox rounded'
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
		isMandatory) {
	var field = $('<select>').attr({
				'id' : id,
				'name' : name,
				'tabindex':1,
				'class' : 'rounded'
			});
	field.append($("<option />").val('').text('Select'))
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
		maxLength, dateFormat) {
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
						obj.bind('blur', function mark() {
						markRequired($(this));
						});
						setTimeout(function(){obj.trigger('blur');}, 300);
				},				
				dateFormat : dateFormat,
				appendText : ''
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
	});/*.data("autocomplete")._renderItem = function(ul, item) {
		var inner_html = '<a><ol class="t7-autocompleter"><ul>' + item.value
				+ '</ul><ul">' + item.label + '</ul></ol></a>';
		return $("<li></li>").data("item.autocomplete", item)
				.append(inner_html).appendTo(ul);
	};*/
	return field;
}
function createButton(btnKey, charIsPrimary) {
	var strCls = charIsPrimary === 'P'
		? 'ft-button canDisable ft-button-primary ft-margin-l'
		: (charIsPrimary === 'L' ? 'ft-btn-link canDisable ' : 'ft-button canDisable ft-button-light');
		
	var elt = null;
	elt = $('<input>').attr({
				'type' : 'button',
				'tabindex':1,
				'class' : strCls,
				'id' : 'button_' + btnKey,
				'value' : mapLbl[btnKey]
			});
	return elt;
}

function enableDisableField(objElement, blnReadOnly) {
	if (blnReadOnly) {
		$(objElement).attr("readonly", "readonly");
	} else {
		$(objElement).removeAttr("readonly");
	}
}

function paintErrors(arrError) {
	doHandlePaintErrors(arrError, 'CASHWEB');
}

function paintCashInErrors(arrError) {
	doHandlePaintErrors(arrError, 'CASHIN');
}

function doHandlePaintErrors(arrError, strErrorType) {
	var element = null, strMsg = null, strTargetDivId = 'messageArea', strErrorCode = '', 
			strEnrichTargetDivId = 'enrichMessageArea';
	/*
	 * if (strErrorType === 'CASHIN') strTargetDivId = 'cashinMessageArea';
	 */
	if (arrError && arrError.length > 0) {
		$('#' + strTargetDivId).empty();
		$('#' + strEnrichTargetDivId).empty();
		$.each(arrError, function(index, error) {
					strMsg = error.errorMessage;
					strErrorCode = error.errorCode || error.code;
					strMsg += !isEmpty(strErrorCode) ? ' (' + strErrorCode + ')' : '';
					/*if (!isEmpty(strMsg))
						strMsg += ' : ';*/
					if (!isEmpty(strErrorCode)) {
						if (strErrorCode.toUpperCase().indexOf("WARN") >= 0) {
							var msg = mapLbl['warnMsg']
							if (!isEmpty(msg))
								msg += ' : ';
							// element = $('<li>').text(msg+strMsg);
							$('#successMessageArea').empty();
							element = $('<p>').text(msg + error.errorMessage);
							//element.appendTo($('#successMessageArea'));
							element.appendTo($('#' + strTargetDivId));
							$('#' + strTargetDivId + ', #messageContentDiv')
									.removeClass('hidden');
						}
						else if (!isEmpty(strErrorCode) && strErrorCode === 'ENR-00012') 
						{
							element = $('<p>').text(strMsg);
							element.appendTo($('#' + strEnrichTargetDivId));
							$('#' + strEnrichTargetDivId + ', #enrichMessageContentDiv')
									.removeClass('hidden');
						}
						else {
							element = $('<p>').text(strMsg);
							if (strErrorCode === 'P22' && isBatchViewMode === false) {
								$("<a id='hrefValidate' href='#'>").css({
											"display" : "block",
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
	$('#successMessageArea, #messageArea, #messageContentDiv, #enrichMessageContentDiv')
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
			? mapLbl['hdrSuccessMsg']
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
	$('#bankIdDtlSpan').empty();
	$('#drawerAccountNoStaticInfoSpan').empty();
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
var arrPeriodWeek = new Array("('1-Weekly',1)", "('2-Fortnightly',2)",
		"('3-Every 3rd Week',3)", "('4-Every 4th Week',4)");
var arrMonthlyPeriod = new Array("('1-Monthly',1)", "('2-Every 2nd Month',2)",
		"('3-Quartely',3)", "('4-Every 4th Month',4)",
		"('5-Every 5th Month',5)", "('6-Semi Annually',6)",
		"('7-Every 7th Month',7)", "('8-Every 8th Month',8)",
		"('9-Every 9th Month',9)", "('10-Every 10th Month',10)",
		"('11-Every 11th Month',11)", "('12-Annually',12)");
var arrDailyPeriod = new Array("('1-Everyday',1)", "('2-Every 2nd Day',2)",
		"('3-Every 3rd Day',3)", "('4-Every 4th Day',4)",
		"('5-Every 5th Day',5)", "('6-Every 6th Day',6)",
		"('7-Every 7th Day',7)");
var arrRefMonth = new Array("('1',1)", "('2',2)", "('3',3)", "('4',4)",
		"('5',5)", "('6',6)", "('7',7)", "('8',8)", "('9',9)", "('10',10)",
		"('11',11)", "('12',12)", "('13',13)", "('14',14)", "('15',15)",
		"('16',16)", "('17',17)", "('18',18)", "('19',19)", "('20',20)",
		"('21',21)", "('22',22)", "('23',23)", "('24',24)", "('25',25)",
		"('26',26)", "('27',27)", "('28',28)", "('29',29)", "('30',30)",
		"('31',31)");
var strRefDay = new Array("('N/A',1)");
var strRefWeekDay = new Array("('Sun',0)", "('Mon',1)", "('Tue',2)",
		"('Wed',3)", "('Thu',4)", "('Fri',5)", "('Sat',6)");

var mapPeriodWeek = {
	'1' : '1-Weekly',
	'2' : '2-Fortnightly',
	'3' : '3-Every 3rd Week',
	'4' : '4-Every 4th Week'
};
var mapMonthlyPeriod = {
	'1' : '1-Monthly',
	'2' : '2-Every 2nd Month',
	'3' : '3-Quartely',
	'4' : '4-Every 4th Month',
	'5' : '5-Every 5th Month',
	'6' : '6-Semi Annually',
	'7' : '7-Every 7th Month',
	'8' : '8-Every 8th Month',
	'9' : '9-Every 9th Month',
	'10' : '10-Every 10th Month',
	'11' : '11-Every 11th Month',
	'12' : '12-Annually'
};
var mapDailyPeriod = {
	'1' : '1-Everyday',
	'2' : '2-Every 2nd Day',
	'3' : '3-Every 3rd Day',
	'4' : '4-Every 4th Day',
	'5' : '5-Every 5th Day',
	'6' : '6-Every 6th Day',
	'7' : '7-Every 7th Day'
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
	 '1':'N/A'
};
var mapRefWeekDay = {
	'0' : 'Sun',
	'1' : 'Mon',
	'2' : 'Tue',
	'3' : 'Wed',
	'4' : 'Thu',
	'5' : 'Fri',
	'6' : 'Sat'
};
var strRefDay = new Array("('N/A',1)");
var strRefWeekDay = new Array("('Sun',0)", "('Mon',1)", "('Tue',2)",
		"('Wed',3)", "('Thu',4)", "('Fri',5)", "('Sat',6)");
var arrFrequency = new Array({
			key : "DAILY",
			value : "Daily"
		}, {
			key : "WEEKLY",
			value : "Weekly"
		}, {
			key : "MONTHLY",
			value : "Monthly"
		});

var weekDaysMap = {
	"SUNDAY" : "0",
	"MONDAY" : "1",
	"TUESDAY" : "2",
	"WEDNESDAY" : "3",
	"THURSDAY" : "4",
	"FRIDAY" : "5",
	"SATURDAY" : "6"
};
function populateSIProcessingViewOnlyFields(strPmtType, Freq, gstrPeriod,
		gstrRef, strPostFix) {
	if (hasSIAccess != 'true') {
		return;
	}
	var i, intDay, intMonth, intclear, intPeriod, strfreqArrStart = '0';

	$(".period" + strPostFix).empty();
	$(".refDay" + strPostFix).empty();
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
				&& arrFrequency[i].key === 'DAILY') {
		} else
			$('#siFrequencyCode' + strPostFix).append($("<option />")
					.val(arrFrequency[i].key).text(arrFrequency[i].value));

	}
	$("#siFrequencyCode" + strPostFix + " option:first").attr('selected',
			'selected');
	populateSIProcessing(charPaymentType);
}
function populateSIProcessing(strPmtType, Freq, gstrPeriod, gstrRef) {
	if (hasSIAccess != 'true' || (strEntryType==='PAYMENT' && strLayoutType==='TAXLAYOUT')) {
		return;
	}
	var i, intDay, intMonth, intclear, intPeriod, strPostFix = '', strfreqArrStart = '0', clsHide = 'hidden';
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

	if (isEmpty(gstrRef))
		gstrRef = $("#refDay" + strPostFix).val();

	var lblRefDay = $("label[for='refDay" + strPostFix + "']");
	var lblHolidayAction = $("label[for='holidayAction" + strPostFix + "']");

	$("#period" + strPostFix).empty();
	$("#refDay" + strPostFix).empty();
	$("#siNextExecutionDate"+ strPostFix).attr("readonly","readonly");
	$("#siNextExecutionDate"+ strPostFix).removeClass('ft-datepicker');
	if (Freq == "")
		return false;
	if (Freq == "WEEKLY") {
		for (var i = 0; i < arrPeriodWeek.length; i++) {
			eval("document.getElementById('period" + strPostFix
					+ "').options[i]=" + "new Option" + arrPeriodWeek[i]);
			if (parseInt(i,10) + 1 == gstrPeriod) {
				$('#period ' + strPostFix + ' option:eq(' + i + ')').attr(
						'selected', true);
			}
		}

		var flag = false;
		var eleId = 'refDay' + strPostFix;
		for (var i = 0; i < strRefWeekDay.length; i++) {
			flag = false;
			if (jQuery.inArray('' + i, weeklyOfDays) != -1)
				flag = true;
			if (flag === true)
				continue;
			else if (flag === false) {
				var ele = document.getElementById('refDay' + strPostFix);
				eval("document.getElementById('refDay" + strPostFix
						+ "').options[" + ele.options.length + "]="
						+ "new Option" + strRefWeekDay[i]);
			}
		}
		$("#" + eleId + " option").each(function() {
					if ($(this).val() === gstrRef)
						$(this).attr('selected', true);
				});
		$("#period" + strPostFix).val(gstrPeriod);
		lblRefDay.parent().removeClass(clsHide);
		lblHolidayAction.parent().removeClass(clsHide);
	} else {
		intPeriod = 7;
		if (Freq == "MONTHLY") {
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
			lblHolidayAction.parent().removeClass(clsHide);
		}
		if (Freq == "MONTHLY") {
			for (var i = 0; i < arrRefMonth.length; i++) {
				eval("document.getElementById('refDay" + strPostFix
						+ "').options[i]=" + "new Option" + arrRefMonth[i]);
				if (parseInt(i,10) + 1 == gstrRef) {
					$('#refDay ' + strPostFix + ' option:eq(' + i + ')').attr(
							'selected', true);
				}

				$("#period" + strPostFix).val(gstrPeriod);
			}
			lblRefDay.parent().removeClass(clsHide);
			lblHolidayAction.parent().removeClass(clsHide);
		}
		if (Freq == "DAILY") {
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
			$("#period" + strPostFix).val(gstrPeriod);

			lblRefDay.parent().addClass(clsHide);
			// lblHolidayAction.parent().addClass("ui-helper-hidden");
		}
	}
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
			'ACCTRFLAYOUT' : 'Debit Multiple Accounts',
			'SIMPLEACCTRFLAYOUT' : 'Debit Multiple Accounts',
			'ACHLAYOUT' : 'Debit Transaction',
			'ACHIATLAYOUT' : 'Debit Transaction',
			'CHECKSLAYOUT' : 'Debit Transaction',
			'TAXLAYOUT' : 'Debit Transaction',
			'WIRELAYOUT' : 'Drawdown',
			'MIXEDLAYOUT' : 'Debit Transaction'
		},
		"C" : {
			'ACCTRFLAYOUT' : 'Credit Multiple Account',
			'SIMPLEACCTRFLAYOUT' : 'Debit Single Account',
			'ACHLAYOUT' : 'Credit Transaction',
			'ACHIATLAYOUT' : 'Credit Transaction',
			'CHECKSLAYOUT' : 'Credit Transaction',
			'TAXLAYOUT' : 'Credit Transaction',
			'WIRELAYOUT' : 'Credit',
			'MIXEDLAYOUT' : 'Credit Transaction'
		}
	},
	"QUICKPAY" : {
		"D" : {
			'ACCTRFLAYOUT' : 'Debit Single Account',
			'SIMPLEACCTRFLAYOUT' : 'Debit Single Account',
			'ACHLAYOUT' : 'Debit Transaction',
			'ACHIATLAYOUT' : 'Debit Transaction',
			'CHECKSLAYOUT' : 'Debit Transaction',
			'TAXLAYOUT' : 'Debit Transaction',
			'WIRELAYOUT' : 'Drawdown',
			'MIXEDLAYOUT' : 'Debit Transaction'
		},
		"C" : {
			'ACCTRFLAYOUT' : 'Credit Single Account',
			'SIMPLEACCTRFLAYOUT' : 'Debit Single Account',
			'ACHLAYOUT' : 'Credit Transaction',
			'ACHIATLAYOUT' : 'Credit Transaction',
			'CHECKSLAYOUT' : 'Credit Transaction',
			'TAXLAYOUT' : 'Credit Transaction',
			'WIRELAYOUT' : 'Credit',
			'MIXEDLAYOUT' : 'Credit Transaction'
		}
	},
	"QUICKPAYSTI" : {
		"D" : {
			'ACCTRFLAYOUT' : 'Debit Single Account',
			'SIMPLEACCTRFLAYOUT' : 'Debit Single Account',
			'ACHLAYOUT' : 'Debit Transaction',
			'ACHIATLAYOUT' : 'Debit Transaction',
			'CHECKSLAYOUT' : 'Debit Transaction',
			'TAXLAYOUT' : 'Debit Transaction',
			'WIRELAYOUT' : 'Drawdown',
			'MIXEDLAYOUT' : 'Debit Transaction'
		},
		"C" : {
			'ACCTRFLAYOUT' : 'Credit Single Account',
			'SIMPLEACCTRFLAYOUT' : 'Debit Single Account',
			'ACHLAYOUT' : 'Credit Transaction',
			'ACHIATLAYOUT' : 'Credit Transaction',
			'CHECKSLAYOUT' : 'Credit Transaction',
			'TAXLAYOUT' : 'Credit Transaction',
			'WIRELAYOUT' : 'Credit',
			'MIXEDLAYOUT' : 'Credit Transaction'
		}
	}
};
/* Debit/ Credit Labels common Map */		
function getPaymentUrlMap(entryType) {
	var objUrl = {
	'RECEIVABLE' : {
			'loadInstrumentFieldsUrl' : 'services/receivableentry',
			'readSavedInstrumentUrl' : 'services/receivableentry',
			'readViewInstrumentUrl' : 'services/receivableentry',
			'saveInstrumentUrl' : 'services/receivableentry',
			'submitInstrumentUrl' : 'services/payments/submit',
			'cancelInstrumentUrl' : 'receivableSummQueryList.srvc',
			
			'loadBatchHeaderFieldsUrl' : 'services/receivableheader',
			'readSavedBatchHeaderUrl' : 'services/receivableheader',
			'readViewBatchHeaderUrl' : 'services/receivableheaderquery/id.json',
			'saveBatchHeaderUrl' : 'services/receivableheader',
			'discardBatchUrl' : 'services/receivablesbatch/discard',
			'submitBatchUrl' : 'services/receivablesbatch/submit',
			'batchHeaderActionUrl' : 'services/receivablesbatch',
			'batchHeaderActionUrlSend' : 'services/receivablebatch',
			'cancelBatchUrl' : 'receivableSummQueryList.srvc',
			'cancelBankProcessingUrl' : 'showBankProcessingQueue.srvc',

			'loadBatchInstrumentFieldsUrl' : 'services/receivablequeryinstrument/id.json',
			'readSavedBatchInstrumentUrl' : 'services/receivablequery/id.json',
			'gridGroupActionUrl' : 'services/receivables',
			'gridDataUrl' : 'services/receivables.json',
			'gridLayoutDataUrl' : 'services/receivablequerygrid/id.json',

			'getAllSavedFiltersUrl' : 'services/userfilterslist/pmtTxnViewFilter.json',
			'deleteSavedFilterUrl' : 'services/userfilters/pmtTxnViewFilter/{0}/remove.json',
			'readSavedFilterUrl' : 'services/userfilters/pmtTxnViewFilter/{0}.json',
			'saveFilterUrl' : 'services/userfilters/pmtTxnViewFilter/{0}.json',
			'getSavedFiltersOrderUrl' : 'services/userpreferences/paymentcenter/pmtTxnViewAdvanceFilterOrder.json',
			'fileUploadUrl' : 'services/ach/addtransactions',
			'fileUploadStatusUrl' : 'services/ach/transactionStatus',

			'refreshEnrichmentsUrl' : 'services/refreshEnrichments',
			'rrValidateUrl' : 'services/receivablesbatch/rrvalidate',
			'cloneInstrument' : 'services/batchentryclone',
			'debitAdvice' : 'services/generateDebitAdviceReport.pdf',
			'paymentAdvice' : 'services/generatePayAdviceReport.pdf',
			'readViewPreliqUrl' : 'services/receivablequeryheaderandinstrument.json',
			'recQueryAdditionalInfo' : 'services/recQueryAdditionalInfo/id.json'
		}
	}
	return objUrl[entryType];
}