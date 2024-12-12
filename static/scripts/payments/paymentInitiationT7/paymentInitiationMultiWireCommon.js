/* Utility functions starts here */

function getPaymentUrlMap(entryType) {
	var objUrl = {
		'PAYMENT' : {
			'backHeaderUrl' : 'createPaymentEntry.form',
			'cancelBatchUrl' : 'paymentSummary.form',
			'createTransactions' : 'services/multitemplatepayment/create',
			'createTransactions_dummy' : 'static/scripts/payments/paymentInitiationT7/data/createTransactions',
			'gridLayoutDataUrl' : 'services/multitemplatepayment/grid',
			'gridLayoutDataUrl_dummy' : 'static/scripts/payments/paymentInitiationT7/data/gridData.json',
			'readSavedBatchInstrumentUrl' : 'services/paymententry',
			'readSavedBatchInstrumentUrl_dummy' : 'static/scripts/payments/paymentInitiationT7/data/paymentEntry.json',
			'saveInstrumentUrl' : 'services/multitemplatepayment/update',
			'createInstrument' : 'services/multitemplatepayment/add.json',
			'gridGroupActionUrl' : 'services/multitemplatepayment',
			'batchHeaderActionUrl' : 'services/multitemplatepayment'
		}
	}
	return objUrl[entryType];
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
}

function paintErrors(arrError) {
	doHandlePaintErrors(arrError, 'CASHWEB');
}

function doHandlePaintErrors(arrError, strErrorType) {
	var element = null, strMsg = null, strTargetDivId = 'messageArea', strErrorCode = '';
	/*
	 * if (strErrorType === 'CASHIN') strTargetDivId = 'cashinMessageArea';
	 */
	if (arrError && arrError.length > 0) {
		$('#' + strTargetDivId).empty();
		$.each(arrError, function(index, error) {
					strMsg = error.errorMessage;
					strErrorCode = error.errorCode || error.code;
					strMsg += !isEmpty(strErrorCode) ? ' (' + strErrorCode
							+ ')' : '';
					/*
					 * if (!isEmpty(strMsg)) strMsg += ' : ';
					 */
					if (!isEmpty(strErrorCode)) {
						if (strErrorCode.toUpperCase().indexOf("WARN") >= 0) {
							var msg = mapLbl['warnMsg']
							if (!isEmpty(msg))
								msg += ' : ';
							// element = $('<li>').text(msg+strMsg);
							$('#successMessageArea').empty();
							element = $('<p>').text(msg + error.errorMessage);
							// element.appendTo($('#successMessageArea'));
							element.appendTo($('#' + strTargetDivId));
							$('#' + strTargetDivId + ', #messageContentDiv')
									.removeClass('hidden');
						} else {
							element = $('<p>').text(strMsg);
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

function createButton(btnKey, charIsPrimary) {
	var strCls = charIsPrimary === 'P'
			? 'ft-button canDisable ft-button-primary ft-margin-l'
			: (charIsPrimary === 'L'
					? 'ft-btn-link canDisable '
					: 'ft-button canDisable ft-button-light ft-margin-r');

	var elt = null;
	elt = $('<input>').attr({
				'type' : 'button',
				'tabindex' : 1,
				'class' : strCls,
				'id' : 'button_' + btnKey,
				'value' : mapLbl[btnKey]
			});
	return elt;
}
function navigateToPage(strUrl, frmId) {
	var frm = document.getElementById(frmId), strValue = null;

	strValue = charAllowedPayment === 'S'
			? 'createPay'
			: ((strPaymentType === 'QUICKPAY' || strPaymentType === 'QUICKPAYSTI')
					? 'single'
					: 'multi');
	frm.appendChild(createFrmField('INPUT', 'HIDDEN', 'paymentType', strValue));
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
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
			message : '<div style="z-index: 1"><h2>&nbsp;Loading...</h2></div>',
			css : {
				height : '32px',
				padding : '8px 0 0 0'
			}
		});
	} else {
		$(".transactionWizardInnerDiv").removeClass('hidden');
		$('.blockInstrumnetUIDiv').addClass('hidden');
		$('.blockInstrumnetUIDiv').unblock();
	}
	// $('.transaction-wizard :input:visible:enabled:first').focus();
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
var mapDrCrReadonlyLabel = {
	"BATCHPAY" : {
		"D" : {
			'WIRESWIFTLAYOUT' : 'Debit'
		},
		"C" : {
			'WIRESWIFTLAYOUT' : 'Credit'
		}
	}
};

function toggleIcon(iconId) {
	if ($("#" + iconId).hasClass('fa-caret-down')) {
		$("#" + iconId).removeClass('fa-caret-down');
		$("#" + iconId).addClass('fa-caret-up');
	} else {
		$("#" + iconId).removeClass('fa-caret-up');
		$("#" + iconId).addClass('fa-caret-down');
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
function createFrmField(element, type, name, value) {
	var inputField;
	inputField = document.createElement(element);
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}
function createEnrichmentCheckBox(id, name, value, isRequired) {
	var objParentDiv = $('<div>');
	var objLabel = $('<label>').attr({
				'class' : 'checkbox-inline'
			});
	var objSpanLabel = $('<span>').text(name);
	if (isRequired)
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
					if ((!isEmpty(defaultValue) && defaultValue === opt.key)
							|| values.length === 1)
						// || index == 0)
						field = $('<input>').attr({
									'name' : id,
									'type' : 'radio',
									'value' : opt.key,
									'checked' : true
								});
					else
						field = $('<input>').attr({
									'name' : id,
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
				'tabindex' : 1,
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
				'tabindex' : 1,
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
				'tabindex' : 1,
				'class' : 'amountBox rounded'
			});
	if (!isEmpty(maxLength))
		field.attr('maxLength', maxLength);
	if (blnReadOnly === true)
		field.attr('readonly', true);
//	if (isEmpty(defaultValue) || defaultValue=="0")
//		defaultValue="0.00";
//	field.val(defaultValue);
//	field.ForceNumericOnly(16,2);
	// jquery autoNumeric formatting
	field.autoNumeric("init",
	{
			aSep: strGroupSeparator,
			dGroup: strAmountDigitGroup,
			aDec: strDecimalSeparator,
			mDec: strAmountMinFraction
	});
	if(!isEmpty(defaultValue) && defaultValue!=="0")
		field.autoNumeric('set', defaultValue);
	// jquery autoNumeric formatting
	/*
	 * field.autoNumeric("init", { aSep: strGroupSeparator, aDec:
	 * strDecimalSeparator, mDec: strAmountMinFraction });
	 * field.autoNumeric('set', defaultValue);
	 */
	// jquery autoNumeric formatting
	return field;
}
function createNumberBox(id, name, defaultValue, blnReadOnly, maxLength) {
	var field = $('<input>').attr({
				'id' : id,
				'name' : name,
				'type' : 'text',
				'tabindex' : 1,
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
		isMandatory, blnAllowAdhocValues) {
	var field = $('<select>').attr({
				'id' : id,
				'name' : name,
				'tabindex' : 1,
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

	if (blnAllowAdhocValues)
		$(field).attr('editableValue', defaultValue);
	return field;
}
function createDateBox(id, name, defaultValue, blnReadOnly, maxLength,
		dateFormat) {
	var field = $('<input>').attr({
				'id' : id,
				'name' : name,
				'type' : 'text',
				'tabindex' : 1,
				'class' : 'rounded'
			});
	field.datepicker({
				dateFormat : dateFormat,
				appendText : '',
				minDate : new Date(),
				onClose : function() {
					$(this).trigger('blur');
				},
				onSelect : function() {
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
		maxLength, dateFormat, mandatory) {
	var field = $('<input>').attr({
				'id' : id,
				'name' : name,
				'type' : 'text',
				'tabindex' : 1,
				'class' : 'rounded'
			});
	field.datepicker({
				onClose : function(dateText) {
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
					setTimeout(function() {
								obj.trigger('blur');
							}, 300);
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
				'tabindex' : 1,
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
function getTruncatedStringByLengthWithTooltip(id,strValue,length)
{
	var strValueTobeDisplayed = null;
	if (strValue && strValue.length > length) {
		strValueTobeDisplayed = strValue.substr(0, length - 1) + '...';
	}
	$(id).attr("title",strValue);
	return strValueTobeDisplayed;
}
/* Utility functions ends here */