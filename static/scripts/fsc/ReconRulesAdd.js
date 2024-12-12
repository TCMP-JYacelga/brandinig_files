function showRuleDetailEntryPopup() {
	resetPreviousValue();
	$('#inpMatchType').val("");
	$('#inpInvoiceField').val("T");
	$('#inpReceiptField').val("T");
	if ($('#inpInvoiceField').val() === 'E') {

		$("#inpFieldNameEnrich").removeClass('hidden');
		$('#inpFieldNameEnrich').val("");
		$("#inpFieldName").addClass('hidden');
	} else {
		$("#inpFieldName").removeClass('hidden');
		$('#inpFieldName').val("");
		$("#inpFieldNameEnrich").addClass('hidden');
		$("#inpFieldNameEnrich-niceSelect").addClass('hidden');
	}
	$('#receiptField').removeClass('hidden');
	$('#inpOperator,#inpRFieldNameText').val("");
	$('#inpPm,#txtFixedValue,#txtFactor').val("");
	if ($('#inpReceiptField').val() === 'E') {
		$('#fieldName').removeClass('hidden');
		$('#fieldNameText').addClass('hidden');
		$("#inpRFieldNameEnrich").removeClass('hidden');
		$('#inpRFieldNameEnrich').val("");
		$("#inpRFieldName").addClass('hidden');
		$('#inpRFieldNameText').addClass('hidden');
	} else {
		$('#fieldName').removeClass('hidden');
		$('#fieldNameText').addClass('hidden');
		$("#inpRFieldName").removeClass('hidden');
		$('#inpRFieldName').val("");
		$("#inpRFieldNameEnrich").addClass('hidden');
		$('#inpRFieldNameText').addClass('hidden');
	}
	$('#inpInvoiceField,#inpFieldName,#inpOperator,#inpReceiptField,#inpRFieldName').removeAttr("disabled");
	$('#inpMatchType,#inpInvoiceField,#inpFieldName,#inpOperator,#inpReceiptField,#inpRFieldName,#inpRFieldNameEnrich,#inpRFieldName').niceSelect('update');
	enableDisableTolerance();
	if ($('#inpFieldName').val() === 'Invoice Amount') {
		$('#inpOperator').attr("disabled", "true");
	} else {
		$('#inpOperator').removeAttr("disabled");
	}
	$('#messageContentDiv').addClass('hidden');
	doClearMessageSection();
	openAddRuleDetailPopup();
	$('#inpMatchType-niceSelect').get(0).focus();
}

function resetPreviousValue()
{
	$('#inpFieldName').prop('selectedIndex',0);
	$("#inpFieldName").niceSelect('update');
	$('#inpRFieldName').prop('selectedIndex',0);
	$("#inpRFieldName").niceSelect('update');
	$('#inpOperator').prop('selectedIndex',0);
	$("#inpOperator").niceSelect('update');
}

function populateReceiptFieldNameView(operator)
{
	if(operator === 'F')
	{
		$('.fieldNameText').removeClass('hidden');
		$('.inpRFieldNameText').removeClass('hidden');
		$('.fieldName').addClass('hidden');
		$('.inpRFieldNameEnrichSpan').addClass('hidden');
		$('.inpRFieldName').addClass('hidden');
		$('.receiptFieldDiv').addClass('hidden');
	}
	else
	{
		$('#receiptField').removeClass('hidden');
		if($('#inpReceiptField').val() === 'T')
		{
			$('.fieldName').removeClass('hidden');
			$('.inpRFieldNameSpan').removeClass('hidden');
			$('.fieldNameText').addClass('hidden');
			$('.inpRFieldNameEnrichSpan').addClass('hidden');
			$('.inpRFieldNameText').addClass('hidden');
		}
		else
		{
			$('.fieldName').removeClass('hidden');
			$('.inpRFieldNameEnrichSpan').removeClass('hidden');
			$('.fieldNameText').addClass('hidden');
			$('.inpRFieldNameSpan').addClass('hidden');
			$('.inpRFieldNameText').addClass('hidden');
		}
	}
}
function editRuleDetail(match, field, enrich, operator, pm, fixedValue, factor,
		receiptField, rfieldName, strDetailId) {
	$('#inpMatchType').val(match);
	$('#inpInvoiceField').val(field);
	if ($('#inpInvoiceField').val() === 'E') {

		$("#inpFieldNameEnrich").removeClass('hidden');
		$('#inpFieldNameEnrich').val(enrich);
		$("#inpFieldName").addClass('hidden');
	} else {
		$("#inpFieldName").removeClass('hidden');
		$('#inpFieldName').val(enrich);
		$("#inpFieldNameEnrich").addClass('hidden');
	}
	$('#inpOperator').val(operator);
	$('#inpPm').val(pm);
	$('#txtFixedValue').val(fixedValue);
	$('#txtFactor').val(factor);
	$('#inpReceiptField').val(receiptField);
	if ($('#inpMatchType').val() === 'N') {
		$('#inpInvoiceField,#inpFieldName,#inpOperator,#inpReceiptField,#inpRFieldName')
				.attr("disabled", "disabled");
	} else {
		$('#inpInvoiceField,#inpFieldName,#inpOperator,#inpReceiptField,#inpRFieldName')
				.removeAttr("disabled");
	}
	if ($('#inpMatchType').val() == 'M') {
		if ($('#inpFieldName').val() == 'Payer') {

			$('#inpOperator').val('=');
			$('#inpReceiptField').val('T');
			$('#inpRFieldName').val('Drawer');
			$('#inpOperator,#inpReceiptField,#inpRFieldName').attr("disabled",
					"disabled");
		} else {
			$('#inpOperator,#inpReceiptField,#inpRFieldName')
					.removeAttr("disabled");
		}
	}
	if ($('#inpReceiptField').val() === 'E') {
		$('#fieldName').removeClass('hidden');
		$('#fieldNameText').addClass('hidden');
		$("#inpRFieldNameEnrich").removeClass('hidden');
		$('#inpRFieldNameEnrich').val(rfieldName);
		$("#inpRFieldName").addClass('hidden');
		$('#inpRFieldNameText').addClass('hidden');
	} else {
		$('#fieldName').removeClass('hidden');
		$('#fieldNameText').addClass('hidden');
		$("#inpRFieldName").removeClass('hidden');
		$('#inpRFieldName').val(rfieldName);
		$("#inpRFieldNameEnrich").addClass('hidden');
		$('#inpRFieldNameText').addClass('hidden');
	}
	enableDisableTolerance();
	if ($('#inpFieldName').val() == 'Invoice Amount'
			|| $('#inpFieldName').val() == 'Payer') {
		$('#inpOperator').attr("disabled", "true");
	} else {
		$('#inpOperator').removeAttr("disabled");
	}
	if ($('#inpOperator').val() === 'F') {
		$('#fieldName').addClass('hidden');
		$('#fieldNameText').removeClass('hidden');
		$('#inpRFieldNameText').removeClass('hidden');
		$('#inpRFieldNameText').val(rfieldName);
		$('#inpRFieldNameEnrich').addClass('hidden');
		$('#inpRFieldName').addClass('hidden');
		$('#receiptField').addClass('hidden');
	}
	$('#inpMatchType,#inpInvoiceField,#inpFieldName,#inpOperator,#inpReceiptField,#inpRFieldName,#inpRFieldNameEnrich,#inpRFieldName,#inpFieldNameEnrich').niceSelect('update');
	$('#btnReconRuleAdd').addClass('hidden');
	$('#btnReconRuleUpdate').removeClass('hidden');
	$('#btnReconRuleUpdate').unbind('click');
	$('#btnReconRuleUpdate').click(function() {
		updateRuleDetails('editInvReconRuleDetail.form', 'frmMain', strDetailId);
	});
	openAddRuleDetailPopup();
	$('#inpInvoiceField,#inpFieldName,#inpOperator,#inpReceiptField,#inpRFieldName').niceSelect('update');
	$('#inpMatchType-niceSelect').get(0).focus();
}
function viewRuleDetail(match, field, enrich, operator, pm, fixedValue, factor,
		receiptField, rfieldName, strDetailId) {
	$(".inpMatchTypeSpan").text($("#inpMatchType option[value='"+match+"']").text())
	$('.inpInvoiceFieldSpan').text($("#inpInvoiceField option[value='"+field+"']").text());
	if (field === 'E') {

		$(".inpFieldNameEnrichSpan").removeClass('hidden');
		$('.inpFieldNameEnrichSpan').text($("#inpFieldNameEnrich option[value='"+enrich+"']").text());
		$(".inpFieldNameSpan").addClass('hidden');
	} else {
		$(".inpFieldNameSpan").removeClass('hidden');
		$('.inpFieldNameSpan').text($("#inpFieldName option[value='"+enrich+"']").text());
		$(".inpFieldNameEnrichSpan").addClass('hidden');
	}
	$('.inpOperatorSpan').text($("#inpOperator option[value='"+operator+"']").text());
	$('.inpPmSpan').text($("#inpPm option[value='"+pm+"']").text());
	$('.txtFixedValueSpan').text(fixedValue).attr('title',fixedValue);
	$('.txtFactorSpan').text(factor);
	$('.inpReceiptFieldSpan').text($("#inpReceiptField option[value='"+receiptField+"']").text());
	

	if (receiptField === 'E') {
		$('.fieldNameSpan').removeClass('hidden');
		$('.fieldNameText').addClass('hidden');
		$(".inpRFieldNameEnrich").removeClass('hidden');
		$('.inpRFieldNameEnrichSpan').text($("#inpRFieldNameEnrich option[value='"+rfieldName+"']").text());
		$(".inpRFieldName").addClass('hidden');
		$('.inpRFieldNameText').addClass('hidden');
	} else {
		$('.fieldName').removeClass('hidden');
		$('.fieldNameText').addClass('hidden');
		$(".inpRFieldNameSpan").removeClass('hidden');
		$('.inpRFieldNameSpan').text($("#inpRFieldName option[value='"+rfieldName+"']").text());
		$(".inpRFieldNameEnrich").addClass('hidden');
		$('.inpRFieldNameText').addClass('hidden');
	}
		
	if (operator === 'F') {
		$('.fieldNameSpan').addClass('hidden');
		$('.fieldNameTextSpan').removeClass('hidden');
		$('.inpRFieldNameText').removeClass('hidden');
		$('.inpRFieldNameText').text(rfieldName);
		$('.inpRFieldNameEnrich').addClass('hidden');
		$('.inpRFieldName').addClass('hidden');
		$('.receiptFieldDiv').addClass('hidden');
	}else{
		$('.fieldNameSpan').removeClass('hidden');
		$('.inpRFieldNameEnrich').removeClass('hidden');
		$('.inpRFieldName').removeClass('hidden');
		$('.receiptFieldDiv').removeClass('hidden');
	}
	populateReceiptFieldNameView(operator);
	openViewRuleDetailPopup();
}

function openAddRuleDetailPopup(){
	$('#ruleDetails').dialog({
		autoOpen : false,
		modal : true,
		maxHeight : 580,
		minHeight : (screen.width) > 1024 ? 156 : 0,
		width : 840,
		dialogClass : 'ft-dialog',
		resizable : false,
		draggable : false
		});
	$('#ruleDetails').dialog("open");
	$('#ruleDetails').dialog("option","position","center");
}
function openViewRuleDetailPopup(){
	$('#ruleDetailsView').dialog({
		autoOpen : false,
		modal : true,
		maxHeight : 580,
		minHeight : (screen.width) > 1024 ? 156 : 0,
		width : 840,
		dialogClass : 'ft-dialog',
		resizable : false,
		draggable : false
		});
	$('#ruleDetailsView').dialog("open");
	//$('#ruleDetailsView').dialog("option","position","center");
}
function closeViewRuleDetailsPopup(){
	$('#ruleDetailsView').dialog("close");
}
function closeAddRulesPopup(){
	$('#ruleDetails').dialog("close");
	$('#btnAddRuleDetail').get(0).focus();
}
function enableLimitMatching(crt) {
	if (isEmpty(crt.val())) {
		$('#limitmatchAmnt').attr("disabled", "true");
	} else {
		$('#limitmatchAmnt').removeAttr("disabled");
	}
}
function generateRuleDetailJSON(strDetailIdentifier) {
	var jsonObject = {};
	jsonObject['detailIdentifier'] = strDetailIdentifier;
	jsonObject['txtMatchType'] = $('#inpMatchType').val();
	jsonObject['txtInvoiceField'] = $('#inpInvoiceField').val();
	jsonObject['txtOperator'] = $('#inpOperator').val();
	jsonObject['txtReceiptField'] = $('#inpReceiptField').val();
	jsonObject['txtPm'] = $('#inpPm').val();
	jsonObject['txtRFixedValue'] = $('#txtFixedValue').val();
	jsonObject['txtRFactor'] = $('#txtFactor').val();
	if ($('#inpInvoiceField').val() == 'E') {
		jsonObject['txtFieldName'] = $('#inpFieldNameEnrich').val();
	} else {
		jsonObject['txtFieldName'] = $('#inpFieldName').val();
	}
	if ($('#inpReceiptField').val() == 'E') {
		jsonObject['txtRFieldName'] = $('#inpRFieldNameEnrich').val();
	} else {
		jsonObject['txtRFieldName'] = $('#inpRFieldName').val();
	}
	if ($('#inpOperator').val() == 'F') {
		jsonObject['txtReceiptField'] = null;
		jsonObject['txtRFieldName'] = $('#inpRFieldNameText').val();
	}
	$('#clientCode').removeAttr("disabled");
	jsonObject['identifier'] = $('#viewState').val();
	return jsonObject;
}
function postRuleDetailData(strUrl, frmId, index) {
	// setTimeout(function() {
	var jsonObject = generateRuleDetailJSON(index);
	$.ajax({
		url : strUrl,
		type : 'POST',
		contentType : "application/json",
		data : JSON.stringify(jsonObject),
		complete : function(XMLHttpRequest, textStatus) {
			if ("error" == textStatus) {
				var arrError = new Array();
				arrError.push({
							"errorCode" : "Message",
							"errorMessage" : "Unknown Error"
							//TODO : getLabel
						});
				doHandlePaintErrors(arrError);
			}
		},
		success : function(data) {
			if (data && data.length > 0) {
				var objResponse = data[0];
				if (objResponse.success === 'Y') {
					$('#viewState').val(objResponse.successValue);
					doClearMessageSection();
					closeAddRulesPopup();
					$(document).trigger("OnSaveRestoreGrid");
				} else if (objResponse.errors && objResponse.errors.length > 0) {
					var objErrors = objResponse.errors;
					doHandlePaintErrors(objErrors);
				}
			}
		}
	});
	// }, 100);
}
function updateRuleDetails(strUrl, frmId, rowIndex) {
	postRuleDetailData('services/updateReconRuleDetail', 'frmMain', rowIndex);
}
function saveRuleDetails() {
	postRuleDetailData('services/saveReconRuleDetail', 'frmMain', null);
}
function discardRuleDetail(strDetailIdentifier){
	var jsonObject = {};
	jsonObject['detailIdentifier'] = strDetailIdentifier;
	jsonObject['identifier'] = $('#viewState').val();
	$.ajax({
		url : 'services/discardReconRuleDetail',
		type : 'POST',
		contentType : "application/json",
		data : JSON.stringify(jsonObject),
		complete : function(XMLHttpRequest, textStatus) {
			if ("error" == textStatus) {
				var arrError = new Array();
				arrError.push({
							"errorCode" : "Message",
							"errorMessage" : getLabel('lbl.reconciliation.unknownerror','Unable to process your request at this moment.Please contact Admin!')
							//TODO : getLabel
						});
				doHandlePaintErrors(arrError);
			}
		},
		success : function(data) {
			if (data && data.length > 0) {
				var objResponse = data[0];
				if (objResponse.success === 'Y') {
					$('#viewState').val(objResponse.successValue);
					//doClearMessageSection();
					//closeAddRulesPopup();
					$(document).trigger("OnSaveRestoreGrid");
				} else if (objResponse.errors && objResponse.errors.length > 0) {
					var objErrors = objResponse.errors;
					doHandlePaintErrors(objErrors);
				}
			}
		}
	});
}
/*
 * Detail Utility Functions
*/
function doHandlePaintErrors(arrError) {
	var element = null, strMsg = null, strTargetDivId = 'messageArea', strErrorCode = '';
	if (arrError && arrError.length > 0) {
		$('#' + strTargetDivId).empty();
		$.each(arrError, function(index, error) {
					strErrorCode = error.errorCode || error.code;
					if (!isEmpty(strErrorCode)) {
						var msg = error.errorMessage;
						$('#successMessageArea').empty();
						element = $('<p>').text(msg);
						element.appendTo($('#' + strTargetDivId));
						$('#' + strTargetDivId + ', #messageContentDiv')
								.removeClass('hidden');
					}
				});

	}
}
function doClearMessageSection() {
	$('#messageArea').empty();
	$('#successMessageArea, #messageArea, #messageContentDiv')
			.addClass('hidden');
}