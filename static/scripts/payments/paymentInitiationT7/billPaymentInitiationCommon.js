function paintBillPaymentEnrichmentsHelper(arrPrdEnr, intCounter, strTargetId, apiCallOn) {
	var field = null, targetDiv = $('#' + strTargetId), label = null, div = null, rowDiv = null, wrappingDiv = null, intCnt = 0, sortArrPrdEnr, minCounter, maxCounter, arrLength;
	var colCls = 'col-sm-4';
	var rowCnt = 1;
	if (!isEmpty(intCounter)) intCnt = intCounter;
	targetDiv.empty();
	if (arrPrdEnr) {
		sortArrPrdEnr = generateSortArrPrdEnr(arrPrdEnr);
		arrLength = sortArrPrdEnr.length;
		minCounter = sortArrPrdEnr[0].sequenceNmbr;
		maxCounter = sortArrPrdEnr[arrLength - 1].sequenceNmbr;
		rowDiv = $('<div>').attr({
			'class' : 'row',
			'id' : rowCnt + '_rowDiv'
		});
		for (var i = minCounter; i <= maxCounter; i++) {
			var enrField = null;
			enrField = getEnrField(arrPrdEnr, i);
			if (!isEmpty(enrField) && enrField != null && !isEmpty(enrField.description)) {
				if (enrField.enrichmentType == 'S' || enrField.enrichmentType == 'M') {
					var strAdditionalHelperCls = (!isEmpty(enrField.displayType) && (enrField.displayType === 10 || enrField.displayType === 11)) ? 'smallEnrichDiv'
							: '';

					wrappingDiv = $('<div>').attr({
						'class' : colCls + ' ' + strAdditionalHelperCls,
						'id' : enrField.code + '_wrappDiv'
					});
					div = $('<div>').attr({
						'class' : 'form-group',
						'id' : enrField.code + '_Div'
					});
					label = $('<label>').attr('class', 'payment-font-bold');

					if (!isEmpty(enrField.displayType) && enrField.displayType != 10)
						label.text(enrField.description);
					else
						label.text("");

					field = createEnrichMentField(enrField);
					if (field) {
						label.attr('for', enrField.code);
						if (enrField.mandatory == true) label.addClass('required');
						label.appendTo(div);

						if (enrField.enrichmentType === 'S' && !isEmpty(enrField.apiName)
								&& (!isEmpty(enrField.apiCallOn) && ('R' === enrField.apiCallOn || 'B' === enrField.apiCallOn))) {
							if (enrField.showButton === true) {
								// TODO : label to be populated from .properties file
								var btnFetchBill = createApiCallButton(enrField.apiCallOn,
										enrField.buttonLabel );
								btnFetchBill.unbind('click');
								btnFetchBill.bind('click', {
									fld : field.clone()
								}, function(event) {
									blockPaymentInstrumentUI(true);
									setTimeout(function(){
										refreshPaymentFieldsOnFetchBills();
										blockPaymentInstrumentUI(false);
									}, 50);
									
								});
								$('#aggRequestBtnDiv').empty();
								btnFetchBill.appendTo($('#aggRequestBtnDiv'));

							}
							else {
								field.on('blur', function() {
									if (charPaymentType === 'Q'){
										refreshPaymentFieldsOnFetchBills();
									}
								});
							}
							
						} 
						if (!isEmpty(enrField.displayType) && enrField.displayType != 10 && enrField.displayType != 11) {
							field.addClass('form-control')
						}
						else {
							if (true === enrField.readOnly) {
								field.find('input').each(function(index) {
									$(this).attr('disabled', 'disabled');
								});
							}
						}

						if (enrField.displayType === 6)// DATEBOX
						{
							field.addClass('form-control ft-datepicker hasDatepicker');
							var dateDiv = $('<div>').attr({
								'class' : 'input-daterange'
							});
							field.attr('style', 'width:90%');
							field.appendTo(dateDiv);
							$('<div class="dtPickerIconDiv input-group-addon has-icon"><i class="fa fa-calendar"></i></div>')
									.appendTo(dateDiv);
							dateDiv.appendTo(div);
						}
						else {
							field.appendTo(div);
						}
						if (enrField.allowAdhocValue) {
							if (field.hasClass('jq-editable-combo')) {
								field.editablecombobox("destroy");
							}

							$(field).editablecombobox({
								emptyText : 'Select ' + enrField.description,
								maxLength : 5,
								adhocValueAllowed : enrField.allowAdhocValue,
								adhocEnteredValue : enrField.value,
								title : mapLbl['lblAdhocFieldDisclaimer']
							});
							$(field).editablecombobox('refresh');
							var spanIndicator = $('<span>').attr({
								'style' : 'color:red'
							});
							spanIndicator.text(' ' + mapLbl['lblAdhocFieldIndicator']);
							spanIndicator.appendTo(label);
						}

						div.appendTo(wrappingDiv);

						if (intCnt % 3 === 0) {
							rowDiv = $('<div>').attr({
								'class' : 'row',
								'id' : rowCnt + '_rowDiv'
							});
							rowCnt++;
						}
						wrappingDiv.appendTo(rowDiv);
						rowDiv.appendTo(targetDiv);
						if (true === enrField.readOnly) {
							field.attr('readonly', 'readonly');
							field.attr('disabled', 'disabled');
							$('.dtPickerIconDiv').addClass('disabled');
						}
						intCnt++;
					}
				}
			}
		}
	}
	return intCnt;
}

function paintBillPaymentEnrichmentsHelperViewOnly(arrPrdEnr, intCounter, strTargetId) {
	var targetDiv = $('#' + strTargetId), label = null, div = null, rowDiv = null, wrappingDiv = null, rowCnt = 0, intCnt = 0, sortArrPrdEnr, minCounter, maxCounter, arrLength;
	var colCls = 'col-sm-4';
	var strValue = null, valueSpan = null;
	targetDiv.empty()
	if (!isEmpty(intCounter)) {
		intCnt = intCounter;
	}
	if (arrPrdEnr) {
		sortArrPrdEnr = generateSortArrPrdEnr(arrPrdEnr);
		arrLength = sortArrPrdEnr.length;
		minCounter = sortArrPrdEnr[0].sequenceNmbr;
		maxCounter = sortArrPrdEnr[arrLength - 1].sequenceNmbr;
		rowDiv = $('<div>').attr({
			'class' : 'row',
			'id' : rowCnt + '_rowDiv'
		});
		for (var i = minCounter; i <= maxCounter; i++) {
			var enrField = null;
			enrField = getEnrField(arrPrdEnr, i);
			if (!isEmpty(enrField) && enrField != null) {
				if (enrField.enrichmentType == 'S' || enrField.enrichmentType == 'M') {
					var strAdditionalHelperCls = (!isEmpty(enrField.displayType) && (enrField.displayType === 10 || enrField.displayType === 11)) ? 'smallEnrichDiv'
							: '';
					wrappingDiv = $('<div>').attr({
						'class' : colCls + ' ' + strAdditionalHelperCls,
						'id' : enrField.code + '_wrappDiv'
					});
					div = $('<div>').attr({
						'class' : 'form-group',
						'id' : enrField.code + '_Div'
					});
					label = $('<label>').attr('class', 'payment-font-bold');
					strValue = getEnrichValueToDispayed(enrField);
					strValue = !isEmpty(strValue) ? strValue : '';

					valueSpan = $('<span>').html(strValue).attr({
						'style' : 'word-wrap : break-word;',
						'class' : 'center-block'
					});

					if (enrField.displayType == '2') {
						if (! isNaN(strValue)) {
							valueSpan.autoNumeric("init", {
								aSep : strGroupSeparator,
								dGroup: strAmountDigitGroup,
								aDec : strDecimalSeparator,
								mDec : strAmountMinFraction
							});
							valueSpan.autoNumeric("set", strValue);
						}
					}
					if (!isEmpty(enrField.displayType) && enrField.displayType != 10) label.html(enrField.description);
					label.appendTo(div);
					valueSpan.appendTo(div);
					div.appendTo(wrappingDiv);

					if (intCnt % 3 === 0) {
						rowDiv = $('<div>').attr({
							'class' : 'row',
							'id' : rowCnt + '_rowDiv'
						});
						rowCnt++;
					}
					wrappingDiv.appendTo(rowDiv);
					rowDiv.appendTo(targetDiv);
					intCnt++;
				}
			}
		}
	}
	return intCnt;
}

function getBillerEnrichmentsMapBySetName(arrPrdEnr) {
	var enrSetName = null;
	var billerEnrMap = {};
	var arrRequsetEnr = [];
	var arrResponseEnr = [];
	var arrReceiptEnr = [];

	for (var i = 0; i < arrPrdEnr.length; i++) {
		if (arrPrdEnr[i] && arrPrdEnr[i].enrichmentSetName) {
			enrSetName = arrPrdEnr[i].enrichmentSetName;
		}
		if ('REQUEST' === enrSetName) {
			arrRequsetEnr.push(arrPrdEnr[i]);
		}
		else
			if ('RESPONSE' === enrSetName) {
				arrResponseEnr.push(arrPrdEnr[i]);
			}
			else
				if ('RECEIPT' === enrSetName) {
					arrReceiptEnr.push(arrPrdEnr[i]);
				}
	}
	billerEnrMap.REQUEST = arrRequsetEnr;
	billerEnrMap.RESPONSE = arrResponseEnr;
	billerEnrMap.RECEIPT = arrReceiptEnr;
	return billerEnrMap;
}

function createApiCallButton(apiCallOn, apiBtnLbl) {
	var strCls = 'ft-button canDisable ft-button-primary';

	var btnLbl = getLabel('apiBtnLbl', 'Fetch Bill');
	if (!isEmpty(apiBtnLbl)) {
		btnLbl = apiBtnLbl;
	}

	return $('<input>').attr({
		'type' : 'button',
		'tabindex' : 1,
		'class' : strCls,
		'id' : 'btnApiCall',
		'value' : btnLbl
	});
}

function paintBillPaymentEnrichments(data) {
	var counterRequestEnr = 0;
	var counterResponseEnr = 0;
	var counterReceiptEnr = 0;
	var billerEnrichments = getBillerEnrichmentsMapBySetName(data.clientEnrichment.parameters);
	if (billerEnrichments.REQUEST && billerEnrichments.REQUEST.length > 0) {
		counterRequestEnr = paintBillPaymentEnrichmentsHelper(billerEnrichments.REQUEST, counterRequestEnr, 'billRequestDiv',
				data.clientEnrichment.apiCallOn);
	}
	if (billerEnrichments.RESPONSE && billerEnrichments.RESPONSE.length > 0) {
		counterResponseEnr = paintBillPaymentEnrichmentsHelper(billerEnrichments.RESPONSE, counterResponseEnr, 'billResponseDiv',
				data.clientEnrichment.apiCallOn);
	}
	/*if (billerEnrichments.RECEIPT && billerEnrichments.RECEIPT.length > 0) {
		counterReceiptEnr = paintBillPaymentEnrichmentsHelper(billerEnrichments.RECEIPT, counterReceiptEnr, 'billReceiptDiv',
				data.clientEnrichment.apiCallOn);
	}*/
	if ('B' === strBillerOrAggregator) {
		$('#billRequestPanelTitle').text(mapBillPayPanelLbl['BILLER_REQUEST']);
		$('#billResponsePanelTitle').text(mapBillPayPanelLbl['BILLER_RESPONSE']);
		$('#billReceiptPanelTitle').text(mapBillPayPanelLbl['BILLER_RECEIPT']);
	}
	else {
		$('#billRequestPanelTitle').text(mapBillPayPanelLbl['AGGREGATOR_REQUEST']);
		$('#billResponsePanelTitle').text(mapBillPayPanelLbl['BILLER_RESPONSE']);
		$('#billReceiptPanelTitle').text(mapBillPayPanelLbl['BILLER_RECEIPT']);
	}

	if (counterRequestEnr > 0) {
		$('#billRequestDetailsDiv').removeClass('hidden');
	}
	else {
		$('#billRequestDetailsDiv').addClass('hidden');
	}
	if (counterResponseEnr > 0) {
		$('#billResponseDetailsDiv').removeClass('hidden');
	}
	else {
		$('#billResponseDetailsDiv').addClass('hidden');
	}
	if (counterReceiptEnr > 0) {
		$('#billReceiptDetailsDiv').removeClass('hidden');
	}
	else {
		$('#billReceiptDetailsDiv').addClass('hidden');
	}
}

function paintBillPaymentEnrichmentsViewOnly(data) {
	var counterRequestEnr  = 0;
	var counterResponseEnr = 0;
	var counterReceiptEnr = 0; 
	var billerEnrichments = getBillerEnrichmentsMapBySetName (data.clientEnrichment.parameters);
	if(billerEnrichments.REQUEST && billerEnrichments.REQUEST.length > 0){
		counterRequestEnr = paintBillPaymentEnrichmentsHelperViewOnly(billerEnrichments.REQUEST,counterRequestEnr, 'billRequestViewDiv');
	}
	if(billerEnrichments.RESPONSE && billerEnrichments.RESPONSE.length > 0){
		counterResponseEnr = paintBillPaymentEnrichmentsHelperViewOnly(billerEnrichments.RESPONSE,counterResponseEnr, 'billResponseViewDiv');
	}
	if('Y' === strReceiptFlag &&  billerEnrichments.RECEIPT && billerEnrichments.RECEIPT.length > 0){
		counterReceiptEnr = paintBillPaymentEnrichmentsHelperViewOnly(billerEnrichments.RECEIPT,counterReceiptEnr, 'billReceiptViewDiv');	
	}
	
	if ('B' === strBillerOrAggregator) {
        $('#billRequestViewPanelTitle').text(mapBillPayPanelLbl['BILLER_REQUEST']);
        $('#billResponseViewPanelTitle').text(mapBillPayPanelLbl['BILLER_RESPONSE']);
        $('#billReceiptViewPanelTitle').text(mapBillPayPanelLbl['BILLER_RECEIPT']);
    }
    else {
        $('#billRequestViewPanelTitle').text(mapBillPayPanelLbl['AGGREGATOR_REQUEST']);
        $('#billResponseViewPanelTitle').text(mapBillPayPanelLbl['BILLER_RESPONSE']);
        $('#billReceiptViewPanelTitle').text(mapBillPayPanelLbl['BILLER_RECEIPT']);
    }
	
	if(counterRequestEnr > 0){
		$('#billRequestDetailsViewDiv').removeClass('hidden');
	}else{
		$('#billRequestDetailsViewDiv').addClass('hidden');
	}
	if(counterResponseEnr > 0){
		$('#billResponseDetailsViewDiv').removeClass('hidden');
	}else{
		$('#billResponseDetailsViewDiv').addClass('hidden');
	}
	if(counterReceiptEnr > 0){
		$('#billReceiptDetailsViewDiv').removeClass('hidden');
	}else{
		$('#billReceiptDetailsViewDiv').addClass('hidden');
	}
}



/******************* Aggregator changes mathods start ******************/

function refreshPaymentFieldsOnFetchBills(){
	var strUrl = _mapUrl['loadInstrumentFieldsUrl'] + "/billerServices/fetchBills/"+strSelectedReceiver 
	var jsonObj = null;
	strUrl += '.json';
	doClearMessageSection();
	blockPaymentInstrumentUI(true);
	jsonObj = generatePaymentInstrumentJson();
	if (jsonObj.d && jsonObj.d.__metadata && strPaymentInstrumentIde)
		jsonObj.d.__metadata._detailId = strPaymentInstrumentIde;
	$.ajax({
				type : "POST",
				url : strUrl,
				dataType: "json",
				async : false,
				contentType : "application/json",
				data : JSON.stringify(jsonObj),
				complete : function(XMLHttpRequest, textStatus) {
					if ("error" == textStatus) {
						var arrError = new Array();
						arrError.push({
									"errorCode" : "Message",
									"errorMessage" : mapLbl['unknownErr']
								});
						doHandleUnknownError();
						blockPaymentInstrumentUI(false);
					}
				},
				success : function(data) {
					if (data != null) {
						paymentResponseInstrumentData = data;
						if (data.d
								&& data.d.message
								&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
							paintErrors(data.d.message.errors);
						}
						else if (data.d
									&& data.d.paymentEntry.message
									&& (data.d.paymentEntry.message.errors || data.d.paymentEntry.message.success === 'FAILED')) {
							paintErrors(data.d.paymentEntry.message.errors);	
						}
						else{
							initateValidation();
							handleEmptyEnrichmentDivs();
						}
						paintPaymentInstrumentUI(data, 'Q');
						blockPaymentInstrumentUI(false);
					}
				}
			});
}
function handleProductDeatilsChange(){
	var data = paymentResponseInstrumentData,objProdData = null ;
	if(!isEmpty(data)){
		if(data && data.d && data.d.paymentEntry && data.d.paymentEntry.billerDetails && data.d.paymentEntry.billerDetails.billerProductFields){
			objProdData = data.d.paymentEntry.billerDetails.billerProductFields;
			$.each(objProdData, function(index, cfg) {
				var objData = cfg;
				if(!isEmpty(objData) && objData.isSelected && objData.isSelected === 'Y'){
					objData.isSelected = 'N';
				}
			});
		}
		
	}
}
function refreshPaymentFieldsOnBillerCatChange(){
	//var strBillerCat = $('#billerCategory').val();
	var strUrl = _mapUrl['loadInstrumentFieldsUrl'] + "/billerServices/" + strMyProduct + "/" + strSelectedReceiver;
	var objData = strSelectedBills;
	var jsonObj = null;
	strUrl += '.json';
	doClearMessageSection();
	blockPaymentInstrumentUI(true);
	handleClearFieldOnBillerCatChange();
	jsonObj = generatePaymentInstrumentJson();
	if (jsonObj.d && jsonObj.d.__metadata && strPaymentInstrumentIde)
		jsonObj.d.__metadata._detailId = strPaymentInstrumentIde;
	$.ajax({
				type : "POST",
				url : strUrl,
				dataType: "json",
				async : true,
				contentType : "application/json",
				data : JSON.stringify(jsonObj),
				complete : function(XMLHttpRequest, textStatus) {
					if ("error" == textStatus) {
						var arrError = new Array();
						arrError.push({
									"errorCode" : "Message",
									"errorMessage" : mapLbl['unknownErr']
								});
						doHandleUnknownError();
						blockPaymentInstrumentUI(false);
					}
				},
				success : function(data) {
					if (data != null) {
						paymentResponseInstrumentData = data;
						paintPaymentInstrumentUI(data, 'Q');
						initateValidation();
						blockPaymentInstrumentUI(false);
						handleEmptyEnrichmentDivs();
					}
				}
			});
}

function handleClearFieldOnBillerCatChange(){
	var objBillerNameField=null,objBillerNameSpan = null,objProdFieldDiv=null,objProdField=null,objBillerOuterDiv=null;
	var objReqFieldDiv=null,objResDiv = null,objResFieldDiv=null,objResEnrFieldDiv=null;
	
	objBillerOuterDiv = $('#billerCodeDiv');
	objBillerNameField = $('#billerCode');
	objBillerNameSpan = $('#billerCodeListSpan');
	objProdField = $('#aggProd');
	objProdFieldDiv = $('#billerProdDiv');
	objReqFieldDiv = $('#aggRequestDiv');
	objResDiv = $('#aggResponseDetailsDiv');
	objResFieldDiv = $('#aggResponseDiv');
	objResEnrFieldDiv = $('#aggResponseEnrDiv');
	$('#aggRequestBtnDiv').empty();
	if(!isEmpty(objBillerNameField) || !isEmpty(objBillerNameSpan)){
		objBillerNameField.val('');
		$("#billerCode option").remove();
		objBillerOuterDiv.addClass('hidden');
		objBillerNameField.niceSelect('destroy');
		objBillerNameField.removeClass('hidden');
		objBillerNameField.attr('disabled', false);
		objBillerNameField.removeClass('disabled');
		objBillerNameSpan.empty();
	}
	if(!isEmpty(objProdField) && !isEmpty(objProdFieldDiv)){
		objProdField.val('');
		objProdField.niceSelect('update');
		objProdFieldDiv.addClass('hidden');
	}
	objReqFieldDiv.empty();
	objResDiv.addClass('hidden');
	$("#aggResponseDetailsDiv hr[class='t7-hr hidden']").removeClass('hidden');
	objResFieldDiv.empty();
	objResEnrFieldDiv.empty();
}

function refreshPaymentFieldsOnBillerNameChange(){
	//var strBillerCat = $('#billerCategory').val();
	//var strBillerCode = $('#billerCode').val();
	var strUrl = _mapUrl['loadInstrumentFieldsUrl'] + "/billerServices/" + strMyProduct + "/" + strSelectedReceiver;
	var objData = strSelectedBills;
	var jsonObj = null;

	strUrl += '.json';
	doClearMessageSection();
	blockPaymentInstrumentUI(true);
	handleClearFieldOnBillerNameChange();
	jsonObj = generatePaymentInstrumentJson();
	if (jsonObj.d && jsonObj.d.__metadata && strPaymentInstrumentIde)
		jsonObj.d.__metadata._detailId = strPaymentInstrumentIde;
	$.ajax({
				type : "POST",
				url : strUrl,
				async : true,
				contentType : "application/json",
				data :	JSON.stringify(jsonObj),
				complete : function(XMLHttpRequest, textStatus) {
					if ("error" == textStatus) {
						var arrError = new Array();
						arrError.push({
									"errorCode" : "Message",
									"errorMessage" : mapLbl['unknownErr']
								});
						doHandleUnknownError();
						blockPaymentInstrumentUI(false);
					}
				},
				success : function(data) {
					if (data != null) {
						paymentResponseInstrumentData = data;
						paintPaymentInstrumentUI(data, 'Q');
						initateValidation();
						blockPaymentInstrumentUI(false);
						handleEmptyEnrichmentDivs();
					}
				}
			});
	
}

function handleClearFieldOnBillerNameChange(){
	var objProdFieldDiv=null,objProdField=null;
	var objReqFieldDiv=null,objResDiv = null,objResFieldDiv=null,objResEnrFieldDiv=null;
	objReqFieldDiv = $('#aggRequestDiv');
	objResDiv = $('#aggResponseDetailsDiv');
	objResFieldDiv = $('#aggResponseDiv');
	objResEnrFieldDiv = $('#aggResponseEnrDiv');
	objProdField = $('#aggProd');
	objProdFieldDiv = $('#billerProdDiv');
	$('#aggRequestBtnDiv').empty();
	if(!isEmpty(objProdField) && !isEmpty(objProdFieldDiv)){
		objProdField.val('');
		objProdField.niceSelect('update');
		objProdFieldDiv.addClass('hidden');
	}
	objReqFieldDiv.empty();
	objResDiv.addClass('hidden');
	objResFieldDiv.empty();
	objResEnrFieldDiv.empty();
}

function paintBillerAggProductField(data){
	var arrAggProdField = data,arrLookUpSelectdata=[],objDefaultVal=null,objProdField=null;
	if(!isEmpty(data) && data.length > 0){
		$.each(data, function(index, cfg) {
			var objData = cfg;
			if(!isEmpty(objData)){
				var objDataPram = objData.parameters;
				if(!isEmpty(objDataPram) && objDataPram.length >0){
					var objOpt = {};
					$.each(objDataPram, function(index, cfg) {
						if(index == 0){
							objOpt["code"] = cfg.description;
							if(objData.isSelected === 'Y')
								objDefaultVal = cfg.description
						}
						else if(index == 1){
							objOpt["description"] = cfg.description;
						}
					});
					arrLookUpSelectdata.push(objOpt);
				}
			}
		});
		populateSelectFieldValue('aggProd',arrLookUpSelectdata,objDefaultVal);
		$('#billerProdDiv').removeClass('hidden');
	}
	else{
		$('#billerProdDiv').addClass('hidden');
	}
}

function paintBillerAggProductFieldViewMode(data) {
	var objSelectedProductDesc = null;
	if (!isEmpty(data) && data.length > 0) {
		$.each(data, function(index, cfg) {
			var objData = cfg;
			if (!isEmpty(objData)) {
				var objDataPram = objData.parameters;
				if (!isEmpty(objDataPram) && objDataPram.length > 0) {
					$.each(objDataPram, function(idx, cnfg) {
						if (idx == 1) {
							if (objData.isSelected === 'Y'){
								objSelectedProductDesc = cnfg.description;
							}
						}
					});
					$('#billerProdSelectedViewSpan').text(objSelectedProductDesc);
				}
			}
		});
	}
}

function paintAggregatorRequestField(data){
	var objAggBillerReqPrm = data.parameters;
	paintBillPaymentEnrichmentsHelper(objAggBillerReqPrm,0,'aggRequestDiv',data.apiCallOn);
}

function paintAggregatorResponceFields(data){
	var counterBillerResponseEnr  = 0;
	var counterBillerFormEnr = 0;
	var objBillerResPrm=null,objBillerFormResPrm=null;
	if(!isEmpty(data)){
		if(data.billerResDetails && data.billerResDetails.parameters.length > 0){
			objBillerResPrm = data.billerResDetails.parameters;
			if(data.billerResEnrDetails && data.billerResEnrDetails.parameters.length > 0){
					objBillerFormResPrm = objBillerResPrm.concat(data.billerResEnrDetails.parameters);
					counterBillerFormEnr = paintBillPaymentEnrichmentsHelper(objBillerFormResPrm,0,'aggResponseDiv',data.apiCallOn);
				}
			else
				{
					counterBillerResponseEnr = paintBillPaymentEnrichmentsHelper(objBillerResPrm,0,'aggResponseDiv',data.apiCallOn);
				}
		}
		
		if(counterBillerResponseEnr > 0 || counterBillerFormEnr > 0 || !data.fetchBillEnable){
			$('#aggResponseDetailsDiv').removeClass('hidden');
			if(!data.fetchBillApplicable){
				$("#aggResponseDetailsDiv hr[class='t7-hr']").addClass('hidden');
			}
			else{
				$("#aggResponseDetailsDiv hr[class='t7-hr hidden']").removeClass('hidden');
			}
		}else{
			$('#aggResponseDetailsDiv').addClass('hidden');
			
		}
	}
}

function paintAggrigatorPaymentEnrichmentsViewOnly(billerDetails) {
    var counterAggRequestEnr  = 0;
    var counterAggResponseEnr = 0;
    var counterAggReceiptEnr = 0; 
    var counterAggReceiptFormFields = 0;
    var aggResponseEnr = 0;
    if(billerDetails.billerReqEnrFields && billerDetails.billerReqEnrFields.parameters && billerDetails.billerReqEnrFields.parameters.length > 0){
        counterAggRequestEnr = paintBillPaymentEnrichmentsHelperViewOnly(billerDetails.billerReqEnrFields.parameters,counterAggRequestEnr, 'aggBillRequestViewDiv');
    }
    if(billerDetails.billerResDetails && billerDetails.billerResDetails.parameters && billerDetails.billerResDetails.parameters.length > 0){
        counterAggResponseEnr = paintBillPaymentEnrichmentsHelperViewOnly(billerDetails.billerResDetails.parameters,counterAggResponseEnr, 'aggBillResponseViewDiv');
    }
    // TODO : Need to check if strReceiptFlag is required
    if(billerDetails.billerReceiptDetails && billerDetails.billerReceiptDetails.parameters && billerDetails.billerReceiptDetails.parameters.length > 0){
        counterAggReceiptEnr = paintBillPaymentEnrichmentsHelperViewOnly(billerDetails.billerReceiptDetails.parameters,counterAggReceiptEnr, 'aggBillReceiptViewDiv');   
    }
    if(billerDetails.receiptFormFields && billerDetails.receiptFormFields.parameters && billerDetails.receiptFormFields.parameters.length > 0){
    	counterAggReceiptFormFields = paintBillPaymentEnrichmentsHelperViewOnly(billerDetails.receiptFormFields.parameters,counterAggResponseEnr, 'aggReceiptFromFieldViewDiv');
    }  
    if(billerDetails.billerResEnrDetails && billerDetails.billerResEnrDetails.parameters && billerDetails.billerResEnrDetails.parameters.length > 0){
        aggResponseEnr = paintBillPaymentEnrichmentsHelperViewOnly(billerDetails.billerResEnrDetails.parameters,counterAggResponseEnr, 'aggResponseEnrViewDiv');
    }     
    
    $('#AggBillRequestDetailsViewDiv').removeClass('hidden');
    
    if(aggResponseEnr > 0){
        $('#aggResponseEnrViewDiv').removeClass('hidden');
    }else{
        $('#aggResponseEnrViewDiv').addClass('hidden');
    }
    if(counterAggRequestEnr > 0){
        $('#aggBillRequestViewDiv').removeClass('hidden');
    }else{
        $('#aggBillRequestViewDiv').addClass('hidden');
    }
    if(counterAggResponseEnr > 0 || aggResponseEnr > 0 || (billerDetails && !billerDetails.fetchBillEnable)){
    	$('#aggBillResponseDetailsViewDiv').removeClass('hidden');
        $('#aggBillResponseViewDiv').removeClass('hidden');
    }else{
        $('#aggBillResponseViewDiv').addClass('hidden');
    }
    if(counterAggReceiptEnr > 0){
    	$('#aggBillReceiptDetailsViewDiv').removeClass('hidden');
        $('#aggBillReceiptViewDiv').removeClass('hidden');
    }else{
        $('#aggBillReceiptViewDiv').addClass('hidden');
    }
}