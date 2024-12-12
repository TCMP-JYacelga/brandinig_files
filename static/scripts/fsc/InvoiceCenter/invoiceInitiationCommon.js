/*******************************************************************************
 * Invoice Entry common code goes here
 ******************************************************************************/
function getPurchaseOrderUrlMap() {
	var objUrl = {
		'gridLayoutDataUrl' : 'services/invoiceLineitemgrid/({0}).json',
		'loadLineItemFieldsUrl' : 'services/invoiceLineitemdetail',
		//'loadLineItemFieldsUrl' : 'services/lineitemdetail({0}).json',
		//'gridGroupActionUrl' : 'services/purchaseorder',
		'saveLineItemUrl' : 'services/invoicelineitementry.json',
		'cancelPOUrl':'invoiceCenter.form',
		'entryBackUrl':'selectInvoiceCenterProduct.form',
		'entryBackPoCenURL':'purchaseOrderCenter.form',
		'loadPOHeaderUrl':'services/invoiceheader',
		'loadPOFieldsUrl':'services/poentry',
		'savePOHeaderUrl':'services/saveInvoiceheader',
		'submitPOUrl' : 'services/invoiceCenter/submit',
		'poCenterUrl' : 'invoiceCenter.form',
		'deletepolineitem':'services/deleteInvoicelineitem/({0}).json',
		'deletelineitem':'services/deleteInvoicelineitem/',
		'actionUrl':'services/invoiceCenter/'
	}
	return objUrl;
}

function paintErrors(arrError, arrFnCallbackWithArguments) {
	doHandlePaintErrors(arrError, arrFnCallbackWithArguments);
}
function paintLineItemErrors(arrError, arrFnCallbackWithArguments) {
	doHandlePaintLineItemErrors(arrError, arrFnCallbackWithArguments);
}

function paintCashInErrors(arrError) {
	doHandlePaintErrors(arrError);
}

function doHandlePaintLineItemErrors(arrError, arrFnCallbackWithArguments) {
	var element = null, strMsg = null, strTargetDivId = 'messageAreaLineItem', strErrorCode = '';
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
							$('#' + strTargetDivId + ', #messageContentLineItemDiv')
									.removeClass('hidden');
						} else {
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
							$('#' + strTargetDivId + ', #messageContentLineItemDiv')
									.removeClass('hidden');
						}

					}
				});

	}
}
function doHandlePaintErrors(arrError, arrFnCallbackWithArguments) {
	var element = null, strMsg = null, strTargetDivId = 'messageArea', strErrorCode = '';
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
function paintSuccessMsg(objMsgDetails) {
	var element = null;
	var msg =  mapLbl['successMsg'];
}

function blockPurchaseOrderUI(blnBlock) {
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
function blockPurchaseOrderLineItemUI(blnBlock) {
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
	var frm = document.getElementById(frmId), strValue = null;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	if(strUrl==='selectInvoiceCenterProduct.form'){
		 if(!isEmpty(enteredByClient))
	    frm.appendChild(createFormField('INPUT', 'HIDDEN', 'enteredByClient',enteredByClient));
	    
	    if(!isEmpty(enteredByClientDesc))
	    frm.appendChild(createFormField('INPUT', 'HIDDEN', 'enteredByClientDesc',enteredByClientDesc));
	    
	    if(!isEmpty(enteredByClientLogger))
	    frm.appendChild(createFormField('INPUT', 'HIDDEN', 'enteredByClientLogger',enteredByClientLogger));
	}
	frm.submit();
}

function generateSortArrPrdEnr(arrPrdEnr) {
	var arrRet = new Array();
	if (arrPrdEnr)
		arrRet = arrPrdEnr.sort(function(valA, valB) {
					return valA.seq - valB.seq
				});
	return arrRet;
}
function getEnrField(arrPrdEnr,seqNo){
		var retField = null;
	for (var i = 0; i < arrPrdEnr.length; i++) {
		if (arrPrdEnr[i].seq == seqNo)
			retField = arrPrdEnr[i];

	}
	return retField;
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
function cloneObject(obj) {
	return JSON.parse(JSON.stringify(obj));
}
function doRemoveStaticText(parentDivId) {
	$("#" + parentDivId + " .canRemove").remove();
	
}
function autoFocusFirstElement(){
	$('input:not(:checkbox):not(:radio):not([readonly]):visible:enabled:first').focus();
}
function handleDisplayMode(displayMode, fieldId) {
	var clsHide = 'hidden';
	var divId = null, lblId = null, strDivPostFix = 'Div', strLblPostfix = 'Lbl';
	divId = fieldId + strDivPostFix;
	lblId = fieldId + strLblPostfix;
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
function populateSeekFieldValue(fieldId, value) {
	var field = $('#' + fieldId);
	field.attr('tabindex',1);
	if (field && !isEmpty(value) && field.length != 0)
		field.val(value);

}
function populateTextFieldValue(fieldId, value) {
	var field = $('#' + fieldId);
	field.attr('tabindex',1);
	if (field && !isEmpty(value) && field.length != 0)
		field.val(value);

}
function populateAmountFieldValue(fieldId, defaultValue) {
	
	if (isEmpty(defaultValue) || defaultValue=="0")
		defaultValue ="0.00";
	$('#' + fieldId).autoNumeric("init",
	{
			aSep: strGroupSeparator,
			aDec: strDecimalSeparator,
			mDec: strAmountMinFraction,
			vMin: 0.0000,
			vMax: 9999999999999.9999
	}); 
	$('#' + fieldId).autoNumeric('set', defaultValue);	
 }
function populateDateFieldValue(fieldId, value) {
	var field = $('#' + fieldId);
	if (field && !isEmpty(value))
		field.val(value);
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
									'class' : 'canRemove ft-padding-t ft-padding-medium-b',
									'style' : 'min-height:30px'
								});
				}		
				$(field).after($(selectSpan));
				$(field).addClass('hidden');
					
			}//opt val
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
		
		}//if opt vals
	}//if field
}
function blockPOUI(blnBlock) {
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
function doClearMessageSection() {
	$('#messageArea').empty();
	$(' #messageArea, #messageContentDiv')
			.addClass('hidden');
}
function handleEnrichFieldPopulation(cfg, fieldId) {
	var displayType = cfg.dataType, defValue = cfg.value;
	var field = null;
	if (isEmpty(displayType))
		displayType = 0;
	switch (displayType) {
		case 'T' : // TEXTAREA
			break;
		case 'A' : // AMOUNTBOX
			populateTextFieldValue(fieldId, defValue);
			break;
		case 'N' : // NUMBERBOX
			populateTextFieldValue(fieldId, defValue);
			break;
		case 'S' : // SELECTBOX
			populateSelectFieldValue(fieldId, cfg.lookupValues, defValue);
			break;
		case 'D' : // DATEBOX
			populateDateFieldValue(fieldId, defValue);
			break;
		default :
			populateTextFieldValue(fieldId, defValue);
			break;
	}
	return field;
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
	field.val(defaultValue);
	//field.ForceNumericOnly(11,2);
	
	// jquery autoNumeric formatting
	field.autoNumeric("init",
	{
			aSep: strGroupSeparator,
			aDec: strDecimalSeparator,
			mDec: strAmountMinFraction
	});
	field.autoNumeric('set', defaultValue);
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
					if ((!isEmpty(defaultValue) && defaultValue == opt.code))
						// || index == 0)
						field.append($('<option selected="true"/>')
								.val(opt.code).text(opt.description));
					else
						field.append($("<option />").val(opt.code)
								.text(opt.description));
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

function createEnrichmentDateBox(id, name, defaultValue,blnReadOnly,maxLength, dateFormat,blnReadOnly,isMandatory) {
	var field = $('<input>').attr({
				'id' : id,
				'name' : name,
				'type' : 'text',
				'tabindex':1,
				'value':defaultValue,
				'class':'form-control ft-datepicker'
			});
	field.datepicker({
				onClose: function(dateText) {
						var obj = $(this);
						obj.bind('blur', function mark() {
						});
						setTimeout(function(){obj.trigger('blur');}, 300);
				},
				changeMonth: true,
 				changeYear: true,
				dateFormat : dateFormat,
				appendText : ''
			});
	if (!isEmpty(maxLength))
		field.attr('maxLength', maxLength);

	if (blnReadOnly === true)
		field.attr('readonly', true);

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

function enableDisableField(objElement, blnReadOnly) {
	if (blnReadOnly) {
		$(objElement).attr("readonly", "readonly");
	} else {
		$(objElement).removeAttr("readonly");
	}
}
function initatePOHeaderValidation() {
	var field = null, fieldId = null;
	$('#poEntryStep2A label.required').each(function() {
				fieldId = $(this).attr('for');
				field = $('#' + fieldId);
				if (field && field.length != 0) {
					field.bind('blur', function mark() {
								markRequired($(this));
							});
				}
			});
}
function blockPOUI(blnBlock) {
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
function doClearLineItemMessageSection() {
	$('#messageAreaLineItem').empty();
	$(' #messageAreaLineItem, #messageContentLineItemDiv')
			.addClass('hidden');
}
function getValueToDispayed(cfg) {
	var dataType = cfg.dataType, defValue = cfg.value, fieldId = cfg.fieldName, blnReadOnly = cfg.readOnly;
	var strReturnValue = '', strTemp = '';
	if (dataType) {
		switch (dataType) {
			case 'multiselect' :
			case 'select' :
				if (cfg.values && cfg.values.length > 0) {
					$.each(cfg.values, function(index, opt) {
								strTemp = getObjectFormJsonArray(opt,
										cfg.availableValues);
								strTemp = strTemp && strTemp.description
										? strTemp.description
										: '';
								if (strTemp) {
									strReturnValue += strTemp;
									if (index != cfg.values.length - 1)
										strReturnValue += ',';
								}
							});
				} else if (!isEmpty(cfg.value)) {
					strReturnValue = getObjectFormJsonArray(cfg.value,
							cfg.availableValues);
					strReturnValue = strReturnValue
							&& strReturnValue.description
							? strReturnValue.description
							: '';
				}
				break;
			case 'text' :
			case 'seek' :
			case 'date' :
			case 'amount' :
				strReturnValue = defValue;
				break;
			case 'radio' :
			case 'checkBox' :
				strReturnValue = getObjectFormJsonArray(cfg.value,
						cfg.availableValues);
				strReturnValue = strReturnValue && strReturnValue.description
						? strReturnValue.description
						: (defValue);
				break;
			case 'mask' :
				var availValsArr = cfg.availableValues;
				var objSortAvalArray = null;
				var objDefValArray = new Array();
				objSortAvalArray = generateSortAvalValArray(availValsArr);
				if (!isEmpty(objSortAvalArray)) {
					$.each(objSortAvalArray, function(index, opt) {
								if (isControlFieldPresent(defValue, opt.seq)) {
									objDefValArray.push(opt.seq);
								}
							});
				}
				if (objDefValArray && objDefValArray.length > 0) {

					$.each(objDefValArray, function(index, opt) {
						strTemp = getMaskObjectFormJsonArray(opt, availValsArr);
						strTemp = strTemp && strTemp.description
								? strTemp.description
								: '';
						if (strTemp) {
							strReturnValue += strTemp;
							if (index != objDefValArray.length - 1)
								strReturnValue += ',';
						}
					});
				} else if (!isEmpty(objDefValArray)) {
					strReturnValue = getObjectFormJsonArray(objDefValArray,
							availValsArr);
					strReturnValue = strReturnValue
							&& strReturnValue.description
							? strReturnValue.description
							: '';
				}
				break;
		}
	}
	return strReturnValue;
}

function getEnrichValueToDispayed(cfg) {
	var displayType = cfg.dataType;
	var strReturnValue = '', strTemp = '', defValue = cfg.value;
	if(cfg.dataType=="T" || cfg.dataType=="N" ){
		if(cfg.availableValues.length!=0)
			 displayType="S";
			 else
			 displayType=cfg.dataType;
	}
	switch (displayType) {

		case 'S' : // COMBOBOX
			if (!isEmpty(cfg.value)) {
				strReturnValue = getObjectFormJsonKeyValueArray(cfg.value,
						cfg.availableValues);
				strReturnValue = strReturnValue && strReturnValue.description
						? strReturnValue.description
						: '';
			}
		break;
		case 'C' : //CHECKBOX
			strReturnValue = cfg.value === 'Y' ? '<i class="fa fa-check"></i> ' + cfg.code : cfg.code;
			break;
		case 'R' : //RADIOBUTTON
			if (!isEmpty(cfg.value)) {
				strReturnValue = getObjectFormJsonKeyValueArray(cfg.value,
						cfg.availableValues);
				strReturnValue = strReturnValue && strReturnValue.description
						? strReturnValue.description
						: '';
			}
			break;
		case 'A' : // AMOUNTBOX
			if (!isEmpty(cfg.value)) {
				var obj = $('<input type="text">');
				obj.autoNumeric('init');
				obj.autoNumeric('set',cfg.value);
				strReturnValue = obj.val();
				obj.remove();
			}
		break;
		case 'T' : // TEXTAREA
		case 'N' : // NUMBERBOX
		case 'D' : // DATEBOX
		default :
			strReturnValue = defValue;
			break;
	}
	return strReturnValue;
}

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
function togglerPOHeaderScreen(canEdit) {
		$('#poEntryStep2A')
			.removeClass('hidden');
	paintPOHeaderActions('EDITNEXT');
	handleEmptyEnrichmentDivs();
}
function doHandleEmptyScreenErrorForPOHeader(arrError) {
	isScreenBroken = true;
	paintErrors(arrError);
	$('#poEntryStep2A')
			.addClass('hidden');
	$('#messageContentHeaderDiv').appendTo($('#emptyScreenErrorBatchDiv'));
	$('#emptyScreenErrorBatchDiv').toggleClass("ui-helper-hidden");
	paintPOHeaderActionsForView('CANCELONLY');
}
function createEnrichMentField(cfg) {
	var displayType = cfg.dataType;
	var field = null, value = null;
	var isMandatory=false;
	if(cfg.displayMode==="3")
	 isMandatory=true;
	if (isEmpty(displayType))
		displayType = 0;
	value = cfg.value;
	var arrOpt=cfg.availableValues;
	if(cfg.dataType=="T" || cfg.dataType=="N" ){
		if(arrOpt && arrOpt.length!=0)
			 displayType="S";
			 else
			 displayType=cfg.dataType;
	}
   var id="poEnr_"+cfg.code;
	switch (displayType) {
		case 'A' : // AMOUNTBOX
			field = createAmountBox(id, cfg.code, value, false,
					cfg.maxLength,isMandatory);
			field.addClass('w14_8 ml12');
			break;
		case 'N' : // NUMBERBOX
			field = createNumberBox(id, cfg.code, value, false,
					cfg.maxLength,isMandatory);
			field.addClass('w14_8 ml12');
			break;
		case 'S' : // COMBOBOX
			value = cfg.value || cfg.defaultValue;
			field = createComboBox(id, cfg.code, value, false,
					cfg.availableValues,isMandatory);
			field.addClass('w15_7 ml12');
			break;
		case 'D' : // DATEBOX
			var dateFormat = strApplicationDateFormat
					? strApplicationDateFormat
					: 'mm/dd/yy';
			value=cfg.value;
			var enrDateFormat=cfg.enrichmentFormat;
			if(enrDateFormat==="dd/mm/yyyy")
			   dateFormat="dd/mm/yy";
			if(enrDateFormat==="mm/dd/yyyy")
			   dateFormat="mm/dd/yy";
			field = createEnrichmentDateBox(id, cfg.code, value, true,
					cfg.maxLength, dateFormat,isMandatory);
			field.addClass('w14_8 ml12');
			break;
		case 'C' : // CHECKBOX
			field = createEnrichmentCheckBox(id,cfg.code,cfg.value,isMandatory);
			break;
		case 'R' : // RADIOBOX
			field = createEnrichmentRadioButton(id,cfg.availableValues,cfg.value);
			break;
		default :
			field = createTextBox(id, cfg.code,cfg.value, false,
					cfg.maxLength,isMandatory);
			field.addClass('w14_8 ml12');
			//field.ForceNoSpecialSymbol();
			break;
	}
	return field;
}
function createEnrichmentRadioButton(id, values,defaultValue) {
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
					objSpanLbl = $('<span>').text(opt.description);
					if ((!isEmpty(defaultValue) && defaultValue === opt.code) || values.length===1)
						// || index == 0)
						field = $('<input>').attr({
									'name' : id,
									'type' : 'radio',
									'value' : opt.code,
									'checked' : true
								});
					else
						field = $('<input>').attr({
									'name' : id,
									'type' : 'radio',
									'value' : opt.code

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
function createEnrichmentCheckBox(id, arrvalue, isRequired) {
	var name=arrvalue.description;
	var value=arrvalue.code;
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
function getObjectFormJsonKeyValueArray(strKey, arrValues) {
	var retValue = null;
	if (arrValues)
		$.each(arrValues, function(index, opt) {
					if (strKey === opt.code) {
						retValue = opt;
						return false;
					}
				});
	return retValue;
}
function resetLineItemForm() {
	$('#addLineItemPopup')
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
}
function doValidationForControlTotal() {
	var data, objStdField, displayModeOftotalNo, blnCtronTotalField = false, isInstCountValidationApply = false, valOfControlTotalCheckBox;
	data = purchaseOrderLineItemData;
	if (data && data.d.poEntry && data.d.poEntry.standardField) {
		objStdField = data.d.receivableEntry.standardField;
		$.each(objStdField, function(index, cfg) {
					fieldId = cfg.fieldName;
					if (fieldId === 'totalNo')
						displayModeOftotalNo = cfg.displayMode;
					if (fieldId === 'controlTotal')
						blnCtronTotalField = true;
				});
	}
	valOfControlTotalCheckBox = $('#controlTotalHdr').val();
	if ((displayModeOftotalNo === '3')
			|| (blnCtronTotalField && valOfControlTotalCheckBox === 'Y')) {
		isInstCountValidationApply = true;
	}

	return isInstCountValidationApply;
}
function initateValidation() {
	var field = null, fieldId = null;
	$('.transactionWizardInnerDiv label.required').each(function() {
				fieldId = $(this).attr('for');
				field = $('#' + fieldId);
				if (field && field.length != 0) {
					field.bind('blur', function mark() {
								markRequired($(this));
							});
				}
			});

}
// Function field validation
function validateRequiredFields() {
	var failedFields = 0, field = null, fieldId = null, tmpValid = true;
	$('label.required').each(function() {
				tmpValid = true;
				fieldId = $(this).attr('for');
				field = $('#' + fieldId);
				if (!isEmpty(field) && !isEmpty(fieldId) && field.length != 0) {
					tmpValid = markRequired(field);
					if (tmpValid == false)
						failedFields++;
				}
			});
	return (failedFields == 0);
}
function blockPOLineItemUI(blnBlock) {
	if (blnBlock === true) {
		$(".transactionWizardInnerDiv").addClass('hidden');
		$('.blockLineItemUIDiv').removeClass('hidden');
		$('.blockLineItemUIDiv').block({
			overlayCSS : {
				opacity : 0
			},
			baseZ : 2000,
			message : '<div style="z-index: 1"><h2><img src="static/images/backgrounds/busy.gif" class="middleAlign"/>&nbsp;Processing your request...</h2></div>',
			css : {
				height : '32px',
				padding : '8px 0 0 0'
			}
		});
	} else {
		$(".transactionWizardInnerDiv").removeClass('hidden');
		$('.blockLineItemUIDiv').addClass('hidden');
		$('.blockLineItemUIDiv').unblock();
	}
}