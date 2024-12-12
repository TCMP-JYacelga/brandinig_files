/**
 * The strPaymentInstrumentIde is used to hold the instrument identifier
 */
var strPaymentInstrumentIde = null;
var isControlTotalMandatory = false;
var paymentResponseInstrumentData = null;
var strReceiverType = null, strOrderingPartyType = 'R', isAdhocReceiverAllowed = false, isAdhocOrderingPartyAllowed = false;
var strPaymentAdditionalInfoData = null;
var strAccountBalanceData = null;
var arrTemplateUsersInst = [];
var debitAccountLvl = 'I';
var paymentApprovalStructureData = {};


function saveReceivableInstrument(jsonData, fnCallback, args) {
	var strUrl = _mapUrl['saveInstrumentUrl'];
	blockPaymentInstrumentUI(true);
	$.ajax({
				url : strUrl,
				type : 'POST',
				contentType : "application/json",
				data : JSON.stringify(jsonData),
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
					blockPaymentInstrumentUI(false);
					fnCallback(data, args);
				}
			});
	autoFocusFirstElement();
}

function paintReceivableInstrumentUI(objData, strPmtType) {
	var data = objData, arrStdFields = [];
	var canShowEnrichmentSection = false, canShowAdditionalInfoSection = false;
	if (data && data.d && data.d.receivableEntry) {

		if (data.d.receivableEntry.standardField) {
			arrStdFields = data.d.receivableEntry.standardField;
			paintPaymentStandardFields(arrStdFields);
		}

		// TODO : To be handled
		if (false && data.d.receivableEntry.adminFields && strEntityType === '0')
			paintPaymentAdminFields(data.d.receivableEntry.adminFields);

		if (data.d.receivableEntry.beneficiary) {
			paintPaymentReceiverFields(data.d.receivableEntry.beneficiary,
					data.d.receivableEntry.receivableHeaderInfo,
					data.d.__metadata._pirMode);
		}

		if (data.d.receivableEntry.enrichments)
			canShowEnrichmentSection = paintPaymentEnrichments(data.d.receivableEntry.enrichments);
		else {
			resetEnrichmentSection();
			canShowEnrichmentSection= false;
		}	
		
		if (data.d.receivableEntry.additionalInfo)
			canShowAdditionalInfoSection = paintPaymentAdditionalInformation(
					data.d.receivableEntry.additionalInfo);
		else{
			resetAdditionalInfoSection();
			canShowAdditionalInfoSection=false;
		}			

		showHideAddendaSection(canShowEnrichmentSection,
				canShowAdditionalInfoSection);

		if (data.d.receivableEntry.paymentCompanyInfo) {
			var objInfo = data.d.receivableEntry.paymentCompanyInfo;
			var strText = !isEmpty(objInfo.company) ? objInfo.company : '';
			strText += '<br/>'
					+ (!isEmpty(objInfo.companyAddress)
							? objInfo.companyAddress
							: '');
			$('.companyInfo').html(strText);
		}

		if (data.d.receivableEntry.receivableHeaderInfo) {
			var objInfo = data.d.receivableEntry.receivableHeaderInfo, strCssClass = null;
			if (objInfo.singleOrBatch && 'B' === objInfo.singleOrBatch) {
				if (!isEmpty(objInfo.hdrDrCrFlag)) {

					if ((strPaymentType === 'QUICKPAY' || strPaymentType === 'QUICKPAYSTI')
							|| (strPaymentType === 'BATCHPAY' && strLayoutType === 'TAXLAYOUT'))
						strCssClass = 'col-sm-12';

					if (objInfo.hdrDrCrFlag != 'B') {
						var strDrCrLabel = !isEmpty(mapDrCrReadonlyLabel[strPaymentType][objInfo.hdrDrCrFlag][strLayoutType])
								? mapDrCrReadonlyLabel[strPaymentType][objInfo.hdrDrCrFlag][strLayoutType]
								: objInfo.hdrDrCrFlag === 'D'
										? 'Debit Trnsaction'
										: 'Credit Transaction';
						$('#txnInfoLink').remove();
						$('<i class="fa fa-check"></i>&nbsp;<span>'
								+ strDrCrLabel + '</span>')
								.appendTo($('<div id="txnInfoLink" class="'
										+ strCssClass + '">')
										.prependTo($('#drCrFlagDiv')));
						$("#drCrFlagDiv .col-sm-6,#drCrFlagDiv .radio-inline")
								.addClass('hidden');
					} else {
						$('#txnInfoLink').remove();
						$("#drCrFlagDiv .col-sm-6,#drCrFlagDiv .radio-inline")
								.removeClass('hidden');
					}

					if (strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT') {
						toggleAccountTransferAccountLabel(objInfo.hdrDrCrFlag);
						var strSellerCcy = $('#txnCurrency').val();// Transaction
						// Currency
						toggleCurrencyLabel(strSellerCcy);
					}
				}
			}

			$('.hdrMyProductDescriptionTitle')
					.html(objInfo.hdrMyProductDescription || '');
			$('#productCuttOffInfoSpan').html(objInfo.hdrCutOffTime || '');

			$('.lastUpdateDateTimeText').html("You saved on "
					+ objInfo.lastUpdateTime || '');
					
			if (!isEmpty(objInfo.hdrTemplateNoOfExec)) {
				$('#templateNoOfExecSpan')
						.html(objInfo.hdrTemplateNoOfExec);
			} else {
				$('#templateNoOfExecSpan').html('0');
			}		
			// if (strEntryType === 'PAYMENT' || strEntryType === 'SI')
			// $('.batchStatusText').html("Batch Status : " + objInfo.hdrStatus
			// || '');

			if (strAction === 'ADD' && isEmpty($('#referenceNo').val())) {
				$('#referenceNo').val(objInfo.hdrMyProductDescription || '');
			}

			if (objInfo.hdrSource) {
				$('.hdrSourceInfoSpan').text(objInfo.hdrSource || '');
			}
			//FTMNTBANK-1334
			if (strEntryType === 'PAYMENT' || strEntryType === 'SI') {
				if(!isEmpty(objInfo.hdrTemplateName) && !isEmpty(objInfo.hdrClonnedFromTxn)){
					handleHoldZeroDollarFlag('Q',true);
					handleHoldUntilFlag('Q');
				}else {
					handleHoldZeroDollarFlag('Q',false);
					handleHoldUntilFlag('Q');
				}
			}

			if (strPaymentType === 'BATCHPAY') {
				var chrDebitAccountLevel = objInfo.accountLevel
						? objInfo.accountLevel
						: 'B';
				var chrDateLevel = objInfo.dateLevel ? objInfo.dateLevel : 'B';
				var chrProductLevel = objInfo.productLevel
						? objInfo.productLevel
						: 'B';
				handleDebitLevelAtInstrumentFields(chrDebitAccountLevel,
						chrDateLevel, chrProductLevel, 'Q');
			}
			
			if (!isEmpty(objInfo.minPaymentDate)) {
				handleOffsetDays(objInfo.minPaymentDate, 'Q')
			}
		}
	}
	if (strEntryType === 'TEMPLATE') {
		onChangeHoldUntil();
		if (strPmtType === 'Q' /*&& strPaymentType==='QUICKPAY'*/) {
			var strTemplateType = getInstrumentTemplateType(arrStdFields);
			if (isEmpty(strPaymentInstrumentIde)) {
				handleDefaultLockFieldValues(data, 'Q');
			} else {
				if (strTemplateType === '1')
					toggleAccountFieldBehaviour(true, 'Q');
				else
					toggleAccountFieldBehaviour(false, 'Q');
			}
			doDisableDefaultLockFields('Q');
		}
	}
	if (strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT') {
		var strDebitPaymentAmntFlag = $('input[name="accTrfType"]:radio:checked')
				.val();
		strDebitPaymentAmntFlag = strDebitPaymentAmntFlag
				? strDebitPaymentAmntFlag
				: 'A';
		if (!isEmpty(strDebitPaymentAmntFlag))
			toggleAmountLabel(strDebitPaymentAmntFlag);
		$('#drawerAccountNo').editablecombobox('refresh');
	}
	
	createTemplateCheckBoxGroup('#holdUntilFlag,#prenote');
	togglePrenoteValue();
	handleLayoutBasedScreenRendering('Q',data);
	toggleContainerVisibility('transactionWizardPopup');
	toggleContainerVisibility('paymentInstrumentEntryExtraFieldsDiv');
	// TODO : We kept this call as it is, added by FT, need more understanding
	// on this
	postHandleClientEnrichments();
	if (data.d && data.d.__metadata && data.d.__metadata._detailId) {
	// jsonObj.d.__metadata._headerId = strPaymentHeaderIde;
		strPaymentInstrumentIde = data.d.__metadata._detailId;
	}

}

function showHideAddendaSection(isEnrichAvailable, isAdditionalInfoAvailable,
		strPostFix) {
		
	if (isEnrichAvailable )
		$("#addendaSectionDivNew").removeClass('hidden');
	else
		$("#addendaSectionDivNew").addClass('hidden');
	
}
function showHideAddendaViewOnlySection(isEnrichAvailable,
		isAdditionalInfoAvailable, strPostFix) {
	
	if (isEnrichAvailable)
		$("#addendaSectionDivNew_InstView").removeClass('hidden');
	else 
		$("#addendaSectionDivNew_InstView").addClass('hidden');
}
function repaintPaymentInstrumentFields() {
	var strBankProduct = $('#bankProduct').val();
	var strUrl = _mapUrl['loadInstrumentFieldsUrl'] + "/" + strMyProduct
			+ ".json";
	var jsonObj = null;

	if (!isEmpty(strBankProduct))
		strUrl += '/' + strBankProduct;
	strUrl += '.json';
	blockPaymentInstrumentUI(true);
	arrFields = [];
	jsonObj = generatePaymentInstrumentJson();
	if (jsonObj.d.receivableEntry.standardField) {
		arrFields = jsonObj.d.receivableEntry.standardField;
		$.each(arrFields, function(index, cfg) {
					if (cfg.fieldName == 'txnDate') {
						cfg.value = null;
					}
				});

	}
	if (jsonObj.d && jsonObj.d.__metadata && strPaymentInstrumentIde) {
		// jsonObj.d.__metadata._headerId = strPaymentHeaderIde;
		jsonObj.d.__metadata._detailId = strPaymentInstrumentIde;
	}
	$.ajax({
				type : "POST",
				url : strUrl,
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
						doRemoveStaticText("transactionWizardPopup");
						paintReceivableInstrumentUI(data, 'Q');
						initateValidation();

						blockPaymentInstrumentUI(false);
					}
				}
			});
}
function refreshPaymentFieldsOnBeneChange(productCode, bankProductCode,
		beneCode) {
	if (!isEmpty(productCode) && !isEmpty(bankProductCode)
			&& !isEmpty(beneCode)) {
		blockPaymentInstrumentUI(true);
		var url = _mapUrl['loadInstrumentFieldsUrl'] + "/" + productCode + "/"
				+ bankProductCode + "/" + beneCode + ".json";
		var jsonObj = generatePaymentInstrumentJson();
		if (jsonObj.d && jsonObj.d.__metadata && strPaymentInstrumentIde)
			jsonObj.d.__metadata._detailId = strPaymentInstrumentIde;
		$.ajax({
					type : "POST",
					url : url,
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
							doRemoveStaticText("transactionWizardPopup");
							paintReceivableInstrumentUI(data, 'Q');
							initateValidation();
							blockPaymentInstrumentUI(false);
							handleEmptyEnrichmentDivs();
						}
					}
				});
	}
}
// TODO: To be tested
function refreshPaymentFieldsOnEnrichChange(obj, strEnrichType, fnPointer,
		argsData) {
	return;
	if (!isEmpty(obj)) {
		var enrichId = obj.attr('id');
		var url = _mapUrl['refreshEnrichmentsUrl'];
		if (!isEmpty(strPaymentInstrumentIde))
			url += +'/(' + strPaymentInstrumentIde + ')';
		url += '/' + enrichId + '.json';
		var strEnriTyp = argsData.strEnrichType;
		var jsonObj = generatePaymentInstrumentJson();
		if (jsonObj.d && jsonObj.d.__metadata && strDetailId)
			jsonObj.d.__metadata._detailId = strPaymentInstrumentIde;

		if (strEnrichType === 'M') {
			var obj = generateJsonForDepenentField(argsData);
			if (!isEmpty(strEnriTyp) && strEnriTyp === 'BANKPRDMSE') {
				if (jsonObj.d
						&& jsonObj.d.receivableEntry
						&& jsonObj.d.receivableEntry.enrichments
						&& jsonObj.d.receivableEntry.enrichments.bankProductMultiSet)
					jsonObj.d.receivableEntry.enrichments['bankProductMultiSet'] = obj;
			} else if (!isEmpty(strEnriTyp) && strEnriTyp === 'CLIPRDMSE') {
				if (jsonObj.d && jsonObj.d.receivableEntry
						&& jsonObj.d.receivableEntry.enrichments
						&& jsonObj.d.receivableEntry.enrichments.clientMultiSet)
					jsonObj.d.receivableEntry.enrichments['clientMultiSet'] = obj;
			} else if (!isEmpty(strEnriTyp) && strEnriTyp === 'MYPPRDMSE') {
				if (jsonObj.d && jsonObj.d.receivableEntry
						&& jsonObj.d.receivableEntry.enrichments
						&& jsonObj.d.receivableEntry.enrichments.myProductMultiSet)
					jsonObj.d.receivableEntry.enrichments['myProductMultiSet'] = obj;
			}
		}
		blockPaymentInstrumentUI(true);
		$.ajax({
			type : "POST",
			url : url,
			async : false,
			contentType : "application/json",
			data : JSON.stringify(jsonObj),
			complete : function(XMLHttpRequest, textStatus) {
				if ("error" == textStatus) {
					// TODO : Error handling to be done.
					// alert("Unable to complete your request!");
				}
			},
			success : function(data) {
				if (data != null) {
					if (data.d
							&& data.d.message
							&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
						paintErrors(data.d.message.errors);
						blockPaymentInstrumentUI(false);

					} else {
						if (!isEmpty(strEnrichType) && strEnrichType === 'M') {
							paymentResponseInstrumentData = data;
							// This will call the repaint enrich popup function
							// i.e paymentInitiationMultiSetEnrichments.js >
							// refreshMultiSetEnrichmentPopUp
							if (!isEmpty(fnPointer)
									&& typeof fnPointer === 'function') {
								fnPointer(data, argsData);
							}
							blockPaymentInstrumentUI(false);
						} else {
							paymentResponseInstrumentData = data;
							doRemoveStaticText("transactionWizardPopup");
							paintReceivableInstrumentUI(data, 'Q');
							initateValidation();
							blockPaymentInstrumentUI(false);
						}
					}
				}
			}
		});
	}
}

function paintPaymentInstrumentVerifyScreen(data, charBatch) {
	var canShowEnrichmentSection = false, canShowAdditionalInfoSection = false, ctrlDiv = null;
	var cfgAmount = null, cfgDebitCcyAmount = null;
	var canShowDenominationSection = false;
	var arrStdFields = data && data.d && data.d.receivableEntry
			&& data.d.receivableEntry.standardField
			? data.d.receivableEntry.standardField
			: null;
	var strFieldName = null, strValue = null, strPostFix = charBatch === 'Y'
			? '_HdrInfo'
			: '_InfoSpan', ctrl = null; 
	var strHdrTotalNo = '', strTotalAmount = '';
	if (arrStdFields) {
		$.each(arrStdFields, function(index, cfg) {
			strFieldName = cfg.fieldName;
			strValue = getValueToDispayed(cfg);
			strValue = !isEmpty(strValue) ? strValue : '';
			ctrlDiv = $('.' + strFieldName + strPostFix + 'Div');
			if (ctrlDiv && ctrlDiv.hasClass('hidden'))
				ctrlDiv.removeClass('hidden');
			ctrl = $('.' + strFieldName + strPostFix);
			if (strFieldName === 'accountNo') {
				if (cfg.values && cfg.values.length > 1) {
					strValue = strValue.replace(/,/g, '<br/>');
					ctrl.html(cfg.values.length + '&nbsp;Selected');
					$('.' + cfg.fieldName + 'Title' + strPostFix)
							.html(cfg.values.length + '&nbsp;Selected');
					$('.' + cfg.fieldName + strPostFix).each(function(i, obj) {
								$(this).addClass('t7-anchor');
								showToolTip($(this), strValue);
							});
					$('.' + cfg.fieldName + 'Title' + strPostFix + 'Div')
							.hasClass('hidden')
					$('.' + cfg.fieldName + 'Title' + strPostFix + 'Div')
							.removeClass('hidden');
					$('.' + cfg.fieldName + 'Title' + strPostFix).each(
							function(i, obj) {
								$(this).addClass('t7-anchor');
								showToolTip($(this), strValue);
							});
				} else {
					$('.' + cfg.fieldName + strPostFix).each(function(i, obj) {
								$(this).removeClass('t7-anchor');
								destroyToolTip($(this));
							});
					$('.' + cfg.fieldName + 'Title' + strPostFix).each(
							function(i, obj) {
								$(this).removeClass('t7-anchor');
								destroyToolTip($(this));
							});
					$('.' + cfg.fieldName + 'Title' + strPostFix)
							.html(strValue);
					$('.' + cfg.fieldName + 'Title' + strPostFix + 'Div')
							.hasClass('hidden')
					$('.' + cfg.fieldName + 'Title' + strPostFix + 'Div')
							.removeClass('hidden');
					ctrl.html(splitAccountSting(strValue));
				}
				
			} else if (strFieldName === 'drawerAccountNo' && strLayoutType
					&& (strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT')) {
				ctrl.html(strValue || '');
				handleDrawerAccountInfoPopulation(strValue);
			} else if (strFieldName === 'txnDate') {
				$(".txnDateInfoDiv").removeClass('hidden');
				ctrl.html(strValue || '');
			} else if (strFieldName === 'amount') {
				cfgAmount = cfg;
				strValue = cfg.formattedValue ? cfg.formattedValue : strValue;
				ctrl.html(strValue || '');
			} else if (strFieldName === 'debitCcyAmount') {
				cfgDebitCcyAmount = cfg;
				strValue = cfg.formattedValue ? cfg.formattedValue : strValue;
				ctrl.html(strValue || '');
			}  else if ((strFieldName === 'bankProduct')
					&& !isEmpty(strValue)) {
				var posOfCurrency = strValue.indexOf('(');
				var strCurrency = strValue.substr(posOfCurrency+1,3);
				strValue = strValue.substr(0,posOfCurrency-1);
				ctrl.attr('title',strCurrency);
				ctrl.html(strValue || '&nbsp;');
			} else {
				ctrl.html(strValue || '&nbsp;');
			}
		});
	}
	
	if (data && data.d && data.d.receivableEntry
			&& data.d.receivableEntry.receivableHeaderInfo) {
		var objHdrInfo = data.d.receivableEntry.receivableHeaderInfo;
		if (objHdrInfo) {
			strHdrTotalNo = objHdrInfo.hdrTotalNo;
			strTotalAmount = objHdrInfo.totalAmount;
		}
	}

    if (data.d.receivableEntry.additionalInfo) {
		if (data.d.receivableEntry.additionalInfo.orderingParty) {
			canShowAdditionalInfoSection = paintPaymentAdditionalInformationViewOnly(data.d.receivableEntry.additionalInfo);
		}
	}

	if (data.d && data.d.receivableEntry && data.d.receivableEntry.enrichments) {
		canShowEnrichmentSection = paintPaymentEnrichmentsViewOnlyFields(data.d.receivableEntry.enrichments);
	}
	
    if (data.d && data.d.receivableEntry && data.d.receivableEntry.denominations) {
		canShowDenominationSection = paintReceivableDenominationsViewOnlyFields(data.d.receivableEntry.denominations);
	}
	
	showHideAddendaViewOnlySection(canShowEnrichmentSection,
			canShowAdditionalInfoSection);
	showHideDenominationViewSection(canShowDenominationSection);

	toggleContainerVisibility('verificationStepDiv');
	toggleContainerVisibility('paymentVerifyExtraDiv');
}

function paintReceivableDenominationsViewOnlyFields(objData)
{
  var isVisible = false;
  var noOfDenoms = 0;
 /*if (data.parameters) {
		paintReceivablesDenominationInfoGrid(data.parameters);
		isVisible = true;
	}*/
  if(objData){
	  noOfDenoms = paintReceivableDenominationsViewOnly(objData.parameters,'');
	  if(noOfDenoms > 0)
	  isVisible = true;
  }
 return isVisible;
}

function paintReceivableDenominationsViewOnly(data, intCounter) {
	var sortArrPrdEnr = null,intCnt = 0,renderToDiv = 'cashDenominationDiv', div = [], wrappingDiv = [], rowDiv = null, targetDiv = $('#' + renderToDiv),
	colCls = 'col-sm-4';
	if (!isEmpty(intCounter))
		intCnt = intCounter;
	$('#'+renderToDiv).empty();
	
	sortArrPrdEnr = generateSortArrDenominations(data);
	
	for(var i=0;i<sortArrPrdEnr.length;i++){
		if(data[i].count != 0){
		rowDiv = $('<div>').attr({
			'class' : 'row '
		});
		for(var j=0; j<3; j++){
		wrappingDiv[j] = $('<div>').attr({
			'class' : colCls,
			'id' : data[i].code +'_'+ '_wrappDiv'
		});
		div[j] = $('<div>').attr({
			'class' : 'form-group',
			'id' : data[i].code +'_'+ '_Div'
		});
		
		}
		var amount = data[i].formattedValue.substr(data[i].formattedValue.indexOf(' ')+1);
		div[0].append('<input type="text" class="form-control" disabled="disabled" readonly="readonly" value="' + data[i].denomValue + '">' + '</input>');
		div[1].append('<input type="text" class="form-control" disabled="disabled" readonly="readonly" value="' + data[i].count + '">'  + '</input>');
		div[2].append('<input type="text" class="form-control" disabled="disabled" readonly="readonly" denomAmount" value="' + amount + '">' + '</input>');
		
		div[0].appendTo(wrappingDiv[0]);
		div[1].appendTo(wrappingDiv[1]);
		div[2].appendTo(wrappingDiv[2]);
		wrappingDiv[0].appendTo(rowDiv);
		wrappingDiv[1].appendTo(rowDiv);
		wrappingDiv[2].appendTo(rowDiv);
		
		intCnt++;
		rowDiv.appendTo(targetDiv);
		var totalAmount = data[i].formattedGrandTotalValue.substr(data[i].formattedGrandTotalValue.indexOf(' ')+1);
		var ccy = data[i].formattedGrandTotalValue.substr(0,data[i].formattedGrandTotalValue.indexOf(' '));
		$("#totalDenomAmount").val(totalAmount);
		$('.totalDenomCcy_View').text(' ('+ccy+') ');
		}
	}
	return intCnt;
}

function generateSortArrDenominations(arrPrdEnr) {
	var arrRet = new Array();
	if (arrPrdEnr)
		arrRet = arrPrdEnr.sort(function(valA, valB) {
					return valB.denomValue - valA.denomValue
				});
	return arrRet;
}

function showHideDenominationViewSection(isDenominationsExist)
{
	if (isDenominationsExist)
		$("#denominationInfoHdrDiv").removeClass('hidden');
	else 
		$("#denominationInfoHdrDiv").addClass('hidden');
}

function paintPaymentInstrumentViewOnlyFields(arrStdFields, strPostFix) {
	var ctrlDiv = null, isExtraInfoAvailable = false,cfgAmount = null, cfgDebitCcyAmount = null, chrDebitPaymentAmntFlag='';
	var strRateType = $('#rateType').val();
	if (arrStdFields) {
		$.each(arrStdFields, function(index, cfg) {
			strFieldName = cfg.fieldName;
			strValue = getValueToDispayed(cfg);
			strValue = !isEmpty(strValue) ? strValue : '';
            if(strFieldName === 'payerAccountType')
                strValue = getLabel("payerAccountType."+cfg.value, strValue);
            if(strFieldName === 'beneficiaryBankIDType')
                strValue = getLabel("beneficiaryBankIDType."+cfg.value, strValue);
			ctrl = $('.' + strFieldName + strPostFix);
			ctrlDiv = $('.' + strFieldName + strPostFix + 'Div');
			if (ctrlDiv && ctrlDiv.hasClass('hidden') && !isEmpty(cfg.displayMode) && '1' !=cfg.displayMode)
				ctrlDiv.removeClass('hidden');
			if (strFieldName === 'prenote'
					|| strFieldName === 'confidentialFlag'
					|| strFieldName === 'hold'
					|| strFieldName === 'holdUntilFlag') {
				if (strValue === 'Y')
					ctrl.removeClass('hidden');
				else
					ctrl.addClass('hidden');

			} else if (strFieldName === 'drCrFlag') {
				handleDrCrFlagOnViewPaymentInstrument(cfg, strPostFix, strValue);
			} else if (strFieldName === 'accountNo') {
				/*
				 * if (cfg.values && cfg.values.length > 1) {
				 * ctrl.html(cfg.values.length + '&nbsp;Selected')
				 * .attr('title', strValue); } else ctrl.html(strValue ||
				 * '').attr('title', '');
				 */

				if (cfg.values && cfg.values.length > 1) {
					strValue = strValue.replace(/,/g, '<br/>');
					ctrl.html(cfg.values.length + '&nbsp;Selected');
					$('.' + cfg.fieldName + strPostFix).each(function(i, obj) {
								$(this).addClass('t7-anchor');
								showToolTip($(this), strValue);
							});
					$('.' + cfg.fieldName + 'Title' + strPostFix)
							.html(cfg.values.length + '&nbsp;Selected');
					$('.' + cfg.fieldName + 'Title' + strPostFix).each(
							function(i, obj) {
								$(this).addClass('t7-anchor');
								showToolTip($(this), strValue);
							});
					if (strEntryType === 'PAYMENT' || strEntryType === 'SI')
						handleAccountNoRefreshLink(cfg);
				} else {
					$('.' + cfg.fieldName + strPostFix).each(function(i, obj) {
								$(this).removeClass('t7-anchor');
								destroyToolTip($(this));
							});
					ctrl.html(splitAccountSting(strValue));
					$('.' + cfg.fieldName + 'Title' + strPostFix).each(
							function(i, obj) {
								$(this).removeClass('t7-anchor');
								destroyToolTip($(this));
							});
					if ($('.' + cfg.fieldName + 'Title' + strPostFix + 'Div')
							.hasClass('hidden'))
						$('.' + cfg.fieldName + 'Title' + strPostFix + 'Div')
								.removeClass('hidden');
					$('.' + cfg.fieldName + 'Title' + strPostFix)
							.html(splitAccountStingForAccountName(strValue));
					if (strEntryType === 'PAYMENT' || strEntryType === 'SI')
						handleAccountNoRefreshLink(cfg);
				}

			} else if (strFieldName === 'lockFieldsMask') {
				var arrDispVal = strValue.split(',');
				if (arrDispVal && arrDispVal.length > 1) {
					strValue = strValue.replace(/,/g, '<br/>');
					ctrl.html(arrDispVal.length + '&nbsp;Selected');

					$('.' + cfg.fieldName + strPostFix).each(function(i, obj) {
								$(this).addClass('t7-anchor');
								showToolTip($(this), strValue);
							});
				} else {
					$('.' + cfg.fieldName + strPostFix).each(function(i, obj) {
								$(this).removeClass('t7-anchor');
								destroyToolTip($(this));
							});

					ctrl.html(strValue);
				}

			} else if (strFieldName === 'drawerAccountNo'
					&& (strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT')) {
				ctrl.html(strValue || '');
				if (cfg.value) {
					var data = getAccountAsReceiverMoreDetails(strValue);
					if (data) {
						if (data.DESCRIPTION) {
							$('.drawerAccountNoName_InstView')
									.html(data.DESCRIPTION || '');
						}
						if (data.ACCOUNTCCY)
							$('.drawerAccountNoCcy_InstView')
									.html(data.ACCOUNTCCY || '');
					}
				}
			} else if ((strFieldName === 'phdNotes' || strFieldName === 'phdAlerts')
					&& !isEmpty(strValue)) {
				isExtraInfoAvailable = true;
			} else if (strFieldName === 'debitPaymentAmntFlag') {
				if(strLayoutType
						&& (strLayoutType === 'WIRELAYOUT'
								|| strLayoutType === 'ACCTRFLAYOUT'
								|| strLayoutType === 'MIXEDLAYOUT' || strLayoutType === 'CHECKSLAYOUT')
						&& getCurrencyMissMatchValueForViewOnly())
					chrDebitPaymentAmntFlag = cfg.value;	
				$('.debitPaymentAmntFlag' + strPostFix).text('(' + strValue
						+ ')');
			} else if (strFieldName === 'amount') {
				cfgAmount = cfg;
				strValue = cfg.formattedValue ? cfg.formattedValue : strValue;
				ctrl.html(strValue || '');
			} else if (strFieldName === 'debitCcyAmount') {
				cfgDebitCcyAmount = cfg;
				strValue = cfg.formattedValue ? cfg.formattedValue : strValue;
				ctrl.html(strValue || '');
			} else if (strFieldName === 'discountAmount') {
				strValue = cfg.formattedValue ? cfg.formattedValue : strValue;
				ctrl.html(strValue || '');
			} else if (strFieldName === 'rateType' || strFieldName ==='contractRefNo') {
				if (getCurrencyMissMatchValueForViewOnly()) {
					if (strFieldName === 'rateType') {
						$(".rateType" + strPostFix + 'Div')
								.removeClass('hidden');
									$(".rateType" + strPostFix + 'Div')
											.removeClass('hidden');
							if (cfg.value && "1" === cfg.value){
								$(".contractRefNo" + strPostFix + 'Div')
										.removeClass('hidden');
								$(".fxRate" + strPostFix + 'Div')
										.addClass('hidden');
							}
							else if(cfg.value && "3" === cfg.value){
								$(".contractRefNo" + strPostFix + 'Div')
										.addClass('hidden');
								$(".fxRate" + strPostFix + 'Div')
										.removeClass('hidden');
							}
							else {
								$(".contractRefNo" + strPostFix + 'Div')
										.addClass('hidden');
								$(".fxRate" + strPostFix + 'Div')
										.addClass('hidden');
							}
						strRateType = strValue;	
					}
					if (strFieldName === 'contractRefNo') {
						if (strRateType && "1" === strRateType)
							$(".contractRefNo" + strPostFix + 'Div')
									.removeClass('hidden');
						else			
							$(".contractRefNo" + strPostFix + 'Div')
									.addClass('hidden');
					}
					ctrl.html(strValue || ' ');			
				} else {
					$(".rateType" + strPostFix + 'Div').addClass('hidden');
					$(".contractRefNo" + strPostFix + 'Div').addClass('hidden');
				}
			} else if ((strFieldName === 'bankProduct')
					&& !isEmpty(strValue)) {
				var posOfCurrency = strValue.indexOf('(');
				var strCurrency = strValue.substr(posOfCurrency+1,3);
				strValue = strValue.substr(0,posOfCurrency-1);
				ctrl.attr('title',strCurrency);
				ctrl.html(strValue || '&nbsp;');
			}else if ('chkImgUploadFileName1' === strFieldName
						|| 'chkImgUploadFileName2' === strFieldName
						|| 'chkImgUploadFileName3' === strFieldName
						|| 'chkImgUploadFileName4' === strFieldName) {
				var fieldIndex = cfg.fieldName.replace("chkImgUploadFileName","");	
				if(cfg.value != undefined && cfg.value != '')
				{							
					$('#checkImageFileViewLink'+fieldIndex+"_InstView").removeClass('hidden');
					$('#checkImageFileViewLink'+fieldIndex+"_InstView")
						.attr('onclick',"viewUploadedImage('"+cfg.value+"')");
				}else{
					$('#checkImageFileViewLink'+fieldIndex+"_InstView").addClass('hidden');
					$('#checkImageFileViewLink'+fieldIndex+"_InstView").removeAttr('onclick');
				}
			} else {
				ctrl.html(strValue || '&nbsp;');
			}
		});

		if(!isEmpty(chrDebitPaymentAmntFlag))
			paintDebitCcyAmount(cfgAmount,cfgDebitCcyAmount,chrDebitPaymentAmntFlag,strPostFix);
			
		// Handle Verification Page Extra Info Label
		if (isExtraInfoAvailable) {
			$('.extraInfoAvailable_InfoSpan').removeClass('hidden');
			$('.noExtraInfoAvailable_InfoSpan').addClass('hidden');
		}
	}
}
function paintPaymentInstrumentReceiverViewOnlyFields(arrStdFields, strPostFix) {
	var strBankAccountInfo = '', strCurrency = '', strAccountType = '';
	if (arrStdFields) {
		$.each(arrStdFields, function(index, cfg) {
			strFieldName = cfg.fieldName;
			strValue = getValueToDispayed(cfg);
			strValue = isEmpty(strValue)
					? (cfg.value ? cfg.value : '')
					: strValue;
			// strValue = !isEmpty(strValue) ? strValue : '';
			ctrl = $('.' + strFieldName + strPostFix);
			
			paintRegisteredReceiverInfoFields(strFieldName, strPostFix, cfg);
			
			if (strFieldName === 'drawerAccountNo'
					&& (strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT')) {
				ctrl.html(strValue || '');
				if (cfg.value) {
					var data = getAccountAsReceiverMoreDetails(strValue);
					if (data) {
						if (data.DESCRIPTION) {
							$('.drawerAccountNoName_InstView')
									.html(data.DESCRIPTION || '');
						}
						if (data.ACCOUNTCCY)
							$('.drawerAccountNoCcy_InstView')
									.html(data.ACCOUNTCCY || '');
					}
				}
			} else if ((strFieldName === 'beneAccountType')
					&& !isEmpty(strLayoutType)
					&& (strLayoutType !== 'WIRELAYOUT' && strLayoutType !== 'WIRESIMPLELAYOUT')) {
				strAccountType = strValue;
			} else if (strFieldName === 'drawerCurrency') {
				strCurrency = strValue;
			} else if (strFieldName === 'beneficiaryBankIDType') {
				ctrl.html('(' + strValue + ')');
			}/* else if ((strFieldName === 'tag57Type'
					|| strFieldName === 'tag54Type' || strFieldName === 'tag56Type')
					&& strValue) {
				handleReceiverTagDetailsSectionForRegisteredReceiver(
						strPostFix, cfg, clsHide);
				if(strFieldName === 'tag57Type') strTag57Type=strValue;
				if(strFieldName === 'tag54Type') strTag54Type=strValue;
				if(strFieldName === 'tag56Type') strTag56Type=strValue;
				
			}*/ else {
				ctrl.html(strValue || '');
			}
		});
		if (strAccountType && strCurrency)
			strBankAccountInfo = '(' + strAccountType + ' ,' + strCurrency
					+ ')';
		else if (strAccountType)
			strBankAccountInfo = '(' + strAccountType + ')';
		else if (strCurrency)
			strBankAccountInfo = '(' + strCurrency + ')';

		$('.beneAccountInfo' + strPostFix).html(strBankAccountInfo);
		if (!isEmpty($('.beneficiaryBankDescriptionR_InstView').val())
				&& !isEmpty($('.beneficiaryBranchDescriptionR_InstView').val()))
			$('.beneficiaryBankDescriptionR_InstView')
					.text($('.beneficiaryBankDescriptionR_InstView').val()
							+ ' ,');
		//handleTagFieldValueSectionShowHide(strTag57Type,strTag54Type,strTag56Type);				
	}
}
function paintPaymentAdditionalInformation(data) {
	var clsHide = 'hidden', canShow = false, isExist = true;
	$('#additionalRefInfoDiv, #bankToBankInfoDiv, #orderingPartyInfoDiv, #additionlInfoSectionDiv')
			.addClass(clsHide);
	$('#AddRefInfo, #AddOrdInfo').addClass(clsHide); // Removed #AddBankInfo
	$('#AddRefInfoInnerDiv, #AddBankInfoInnerDiv').empty();

	if (data) {
		// if (data.additionalReferenceInfo) {
		// paintPaymentAdditionalInformationField(
		// data.additionalReferenceInfo, $('#AddRefInfoInnerDiv'));
		// $('#additionalRefInfoDiv').removeClass(clsHide);
		// canShow = true;
		// if (isExist) {
		// $('#additionalRefInfo').attr('checked', true);
		// $('#AddRefInfo').removeClass(clsHide);
		// }
		//
		// }
		// // Bank To Bank Information Reference
		// if (data.bankToBankInfo) {
		// if (data.bankToBankInfo.length > 0) {
		// paintPaymentAdditionalInformationField(data.bankToBankInfo,
		// $('#AddBankInfoInnerDiv'));
		// $('#bankToBankInfoDiv').removeClass(clsHide);
		// canShow = true;
		// if (isExist) {
		// $('#bankToBankInfo').attr('checked', true);
		// $('#AddBankInfo').removeClass(clsHide);
		// }
		// }
		// }
		// Ordering Party
		if (data.orderingParty) {
			$('#orderingPartyInfoDiv, .adhocOrderingParty, .registeredOrderingParty')
					.addClass(clsHide);
			paintPaymentAdditionalInfoOrderingPartyFields(data.orderingParty);
			$('#orderingPartyInfoDiv').removeClass(clsHide);
			if (strLayoutType === 'WIRELAYOUT' || strLayoutType === 'WIRESIMPLELAYOUT' || strLayoutType === 'MIXEDLAYOUT')
				canShow = true;// Ordering Party section should be visible to
			// only WIRELAYOUT
			if (isExist) {
				$('#orderingPartyInfo').attr('checked', true);
				$('#AddOrdInfo').removeClass(clsHide);
			}
		}
		if (strLayoutType === 'TAXLAYOUT' || strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT')
			canShow = false;// Additional Info section should be hidden for

		if (canShow) {
			$('#additionlInfoSectionDiv').removeClass(clsHide);
		}
		return canShow;
	}
}
function resetAdditionalInfoSection(){
	$('#AddRefInfoInnerDiv, #AddBankInfoInnerDiv').empty();
}
function paintPaymentAdditionalInformationViewOnly(data, isViewOnly) {
	var canShowOrderingParty = false, canShowAdditionalRefInfo = false, canShowBankToBankInfo = false, canShow = false;
	if (data.orderingParty) {
		canShowOrderingParty = paintPaymentAdditionalInfoOrderingPartyViewOnlyFields(data.orderingParty);
	}
	// Additional Info
	// if (data.additionalReferenceInfo && data.additionalReferenceInfo.length >
	// 0)
	// {
	// paintPaymentAdditionalInformationViewOnlyField(
	// data.additionalReferenceInfo, $('#AddRefInfoInnerDiv_InstView'));
	// $('#additionalRefInfoDiv_InstView').removeClass(clsHide);
	// canShowAdditionalRefInfo = true;
	// $('#additionalRefInfo_InstView').attr('checked', true);
	// $('#AddRefInfo_InstView').removeClass(clsHide);
	//
	// }
	// // Bank To Bank Information Reference
	// if (data.bankToBankInfo && data.bankToBankInfo.length > 0) {
	// paintPaymentAdditionalInformationViewOnlyField(data.bankToBankInfo,
	// $('#AddBankInfoInnerDiv_InstView'));
	// $('#bankToBankInfoDiv_InstView').removeClass(clsHide);
	// canShowBankToBankInfo = true;
	// $('#bankToBankInfo_InstView').attr('checked', true);
	// $('#AddBankInfo_InstView').removeClass(clsHide);
	// }

	if (strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT') {
		canShowOrderingParty = false;
		canShowAdditionalRefInfo = false;
		canShowBankToBankInfo = false;
	}
	if (canShowOrderingParty || canShowAdditionalRefInfo
			|| canShowBankToBankInfo)
		canShow = true;

	if (canShow)
		$('#additionlInfoSectionDiv_InstView').removeClass('hidden');

	return canShow;
}
function paintPaymentAdditionalInfoOrderingPartyFields(data) {
	var arrFields = [];
	var strDisplayMode = null, fieldId = null, lblId = null;
	var blnOnlyRegisteredOrderingParty = false;
	var adhSuffix = '_OA';
	var mainDivId = 'registeredOrderingPartyDetails';
	var linkIdSuffix = 'Link';
	if (data) {
		if (data.registeredOrderingParty) {
			arrFields = data.registeredOrderingParty;
			if (arrFields && arrFields.length > 0) {

				$.each(arrFields, function(index, cfg) {
					fieldId = cfg.fieldName;
					strDisplayMode = cfg.displayMode;
					handleDisplayMode(strDisplayMode, fieldId);
					handleFieldPopulation(cfg, cfg.fieldName);
					if (fieldId === 'emailIdNmbr') {
						if ($("#" + lblId).length != 0) {
							$("#" + lblId).text(cfg.value);
						}
					}
					if (fieldId === 'orderingParty') {
						$('#orderingPartyMoreDetails' + linkIdSuffix)
								.unbind('click');
						$('#orderingPartyMoreDetails' + linkIdSuffix).bind(
								'click', function() {
									doPaintMoreDetailsForRegisteredOrderingParty(
											cfg.value, mainDivId);
								});
					}
						// TODO : Ordering Party Email to be set
				});
			}
		}
		arrFields = [];
		if (data.adhocOrderingParty) {
			isAdhocOrderingPartyAllowed = true;
			arrFields = data.adhocOrderingParty;
			if (arrFields && arrFields.length > 0) {
				$.each(arrFields, function(index, cfg) {
							fieldId = cfg.fieldName;
							handleDisplayMode(cfg.displayMode, fieldId
											+ adhSuffix);
							handleFieldPopulation(cfg, cfg.fieldName
											+ adhSuffix);
						});
			}
		} else {
			blnOnlyRegisteredOrderingParty = true;
		}
		if (!isEmpty(data.orderingPartyRegisteredFlag)) {
			if (data.orderingPartyRegisteredFlag == 'N'
					|| data.orderingPartyRegisteredFlag == 'A'
					|| 'S' === data.orderingPartyRegisteredFlag) {
				$("#cbRegristeredOrderingParty").attr("checked", false);
				$("#cbAdhocOrderingParty").attr("checked", true);
				toggleOrderingParty('A', false);
			} else if (data.orderingPartyRegisteredFlag == 'Y'
					|| data.orderingPartyRegisteredFlag == 'R') {
				$("#cbRegristeredOrderingParty").attr("checked", true);
				$("#cbAdhocOrderingParty").attr("checked", false);
				toggleOrderingParty('R', false);
				if (blnOnlyRegisteredOrderingParty) {
					$('#switchToAdhocOrderingPartyLink').addClass('hidden');
				}
			}
		} else {
			if (blnOnlyRegisteredOrderingParty) {
				$('.adhocOrderingParty, #switchToAdhocOrderingPartyLink')
						.empty();
				toggleOrderingParty('R', false);
			} else
				toggleOrderingParty('A', false);
		}
	}
}
function paintPaymentAdditionalInfoOrderingPartyViewOnlyFields(data) {
	var arrFields = [];
	var strDisplayMode = null, divId = null, fieldId = null, lblId = null, canShow = false;
	var clsHide = 'hidden';
	var DivSuffix = '_OVInfoDiv';
	var LblSuffix = '_OVInfoLbl';
	var mainDivId = 'viewOrderingPartyMoreDetailsDiv';
	var linkIdSuffix = 'ViewOnlyLink';
	if (data && data.orderingPartyRegisteredFlag) {

		if ('R' === data.orderingPartyRegisteredFlag
				&& data.registeredOrderingParty) {
			arrFields = data.registeredOrderingParty;
		}
		if (('A' === data.orderingPartyRegisteredFlag || 'S' === data.orderingPartyRegisteredFlag)
				&& data.registeredOrderingParty) {
			arrFields = data.adhocOrderingParty;
		}

		if (arrFields && arrFields.length > 0)
			$.each(arrFields, function(index, cfg) {
						fieldId = cfg.fieldName;
						strDisplayMode = cfg.displayMode;
						divId = fieldId + DivSuffix;
						lblId = fieldId + LblSuffix;
						if ($("#" + lblId).length != 0) {
							$("#" + lblId).text(cfg.value);
						}

						if (fieldId === 'orderingParty' && !isEmpty(cfg.value)) {
							canShow = true;
							$('#orderingPartyMoreDetails' + linkIdSuffix)
									.unbind('click');
							$('#orderingPartyMoreDetails' + linkIdSuffix).bind(
									'click', function() {
										doPaintMoreDetailsForRegisteredOrderingParty(
												cfg.value, mainDivId, true);
									});
						}
					});

	}
	if (canShow)
		$('#orderingPartyInfoDiv_InstView').removeClass(clsHide);
	return canShow;
}
function paintPaymentAdditionalInformationField(arrFields, targetDiv) {
	var field = null, label = null,  div = null, innerDiv = null;
	if (arrFields) {
		$.each(arrFields, function(index, cfg) {
					div = $('<div>').attr({
								'class' : 'col-sm-4 ',
								'id' : cfg.fieldName + 'Div'
							});
					innerDiv = $('<div>').attr({
								'class' : 'form-group ',
								'id' : cfg.fieldName + '_InnerDiv'
							});
					label = $('<label>').attr({
								'class' : 'fieldLabel',
								'id' : cfg.fieldName + 'Lbl',
								'for' : cfg.fieldName
							});
					label.text(cfg.label);
					field = createAdditionalInfoField(cfg);
					if (field) {
						field.attr('class', 'form-control');
						if (cfg.displayMode == '3')
							label.addClass('required');
						label.attr('for', field.id);
						label.appendTo(innerDiv);
						if (cfg && !isEmpty(cfg.value))
							field.val(cfg.value);
						field.appendTo(innerDiv);
						innerDiv.appendTo(div);
						div.appendTo(targetDiv);
					}
				});
	}
}
function paintPaymentAdditionalInformationViewOnlyField(arrFields, targetDiv) {
	var label = null, div = null, innerDiv = null, strValue = null, valueSpan = null;
	if (arrFields) {
		$(targetDiv).empty();
		$.each(arrFields, function(index, cfg) {
					div = $('<div>').attr({
								'class' : 'col-sm-4 ',
								'id' : cfg.fieldName + 'Div_InstView'
							});
					innerDiv = $('<div>').attr({
								'class' : 'form-group ',
								'id' : cfg.fieldName + '_InnerDiv_InstView'
							});
					label = $('<label>').attr({
								'class' : 'fieldLabel',
								'id' : cfg.fieldName + 'Lbl',
								'for' : cfg.fieldName
							});
					label.text(cfg.label + ' : ');
					strValue = getValueToDispayed(cfg);
					// TODO : ellipsis
					valueSpan = $('<span>').html(!isEmpty(strValue)
							? strValue
							: '');
					$(valueSpan).attr('id', cfg.fieldName);
					// valueSpan = createAdditionalInfoField(cfg);
					if (valueSpan) {
						// field.attr('class', 'form-control');
						if (cfg.displayMode == '3')
							label.addClass('required');
						label.attr('for', valueSpan.id);
						label.appendTo(innerDiv);
						valueSpan.appendTo(innerDiv);
						innerDiv.appendTo(div);
						div.appendTo(targetDiv);
					}
				});
	}
}
function paintPaymentEnrichmentsViewOnlyFields(objData) {
	var data = objData;
	var isVisible = false, isVisibleTransAddenda = false, clsHide = 'hidden', intConterForTransAddenda = 1, intCounter = 1, strTargetId = 'addendaInfoEnrichDiv_InstView', strTransAddendaTargetId = 'addendaInfoEnrichInTransctionDiv_InstView';
	// Edit Instrument Enrichments Cleared here
	$('#addendaInfoEnrichDiv, #bankProductMultiSetEnrichDiv, #myProductMultiSetEnrichDiv, #clientMultiSetEnrichDiv , #addendaInfoEnrichInTransctionDiv')
			.empty();
	$('#addendaInfoEnrichDiv_InstView, #bankProductMultiSetEnrichDiv_InstView, #myProductMultiSetEnrichDiv_InstView, #clientMultiSetEnrichDiv_InstView , #addendaInfoEnrichInTransctionDiv_InstView')
			.empty();
	mapEnrichSet = {};
	if (data.udeEnrichment && data.udeEnrichment.parameters) {
		paintPaymentEnrichmentAsSetNameViewOnly(mapEnrichSet,
				data.udeEnrichment.parameters, strTargetId);
		isVisible = true;
	}

	if (data.productEnrichment && data.productEnrichment.parameters) {
		paintPaymentEnrichmentAsSetNameViewOnly(mapEnrichSet,
				data.productEnrichment.parameters, strTargetId);
		isVisible = true;
	}

	if (data.myproductEnrichment && data.myproductEnrichment.parameters) {
		paintPaymentEnrichmentAsSetNameViewOnly(mapEnrichSet,
				data.myproductEnrichment.parameters, strTargetId);
		isVisible = true;
	}
	if (data.clientEnrichment && data.clientEnrichment.parameters) {
		paintPaymentEnrichmentAsSetNameViewOnly(mapEnrichSet,
				data.clientEnrichment.parameters, strTargetId);
		isVisible = true;
	}
	if (data.productEnrichmentStdFields
			&& data.productEnrichmentStdFields.parameters) {
		intConterForTransAddenda = paintPaymentEnrichmentsHelperViewOnly(
				data.productEnrichmentStdFields.parameters,
				intConterForTransAddenda, strTransAddendaTargetId, 'Q');
		isVisibleTransAddenda = false;
	}
	if (data.myproductEnrichmentStdFields
			&& data.myproductEnrichmentStdFields.parameters) {
		intConterForTransAddenda = paintPaymentEnrichmentsHelperViewOnly(
				data.myproductEnrichmentStdFields.parameters,
				intConterForTransAddenda, strTransAddendaTargetId, 'Q');
		isVisibleTransAddenda = false;
	}
	if (data.clientEnrichmentStdFields
			&& data.clientEnrichmentStdFields.parameters) {
		intConterForTransAddenda = paintPaymentEnrichmentsHelperViewOnly(
				data.clientEnrichmentStdFields.parameters,
				intConterForTransAddenda, strTransAddendaTargetId, 'Q');
		isVisibleTransAddenda = false;
	}
	resetMultiSetEnrichVariable();
	if (data.myProductMultiSet && data.myProductMultiSetMetadata) {
		paintPaymentMyProductMultiSetEnrichments(
				data.myProductMultiSet,data.myProductMultiSetMetadata, intCounter,
				'myProductMultiSetEnrichDiv_InstView', 'Q', true);
		isVisible = true;
	}
	if (data.bankProductMultiSet && data.bankProductMultiSetMetadata) {
		paintPaymentBankProductMultiSetEnrichments(
				data.bankProductMultiSet,data.bankProductMultiSetMetadata, intCounter,
				'bankProductMultiSetEnrichDiv_InstView', 'Q', true);
		isVisible = true;
	}
	if (data.clientMultiSet && data.clientMultiSetMetadata) {
		paintPaymentClientProductMultiSetEnrichments(
				data.clientMultiSet,data.clientMultiSetMetadata, intCounter,
				'clientMultiSetEnrichDiv_InstView', 'Q', true);
		isVisible = true;
	}
	if (isVisibleTransAddenda) {
		$('#addendaInfoEnrichInTransctionDiv_InstView').removeClass(clsHide);
	}
	if (isVisible) {
		$('#AddBankInfo_InstView').removeClass(clsHide);// addendaSectionDiv_InstView
	}

	if ((isVisibleTransAddenda || isVisible) && strLayoutType != 'ACCTRFLAYOUT' && strLayoutType !== 'SIMPLEACCTRFLAYOUT')
		$('#addendaInfoDiv_InstView').removeClass(clsHide);

	return (isVisibleTransAddenda || isVisible);
}
function paintPaymentEnrichmentAsSetNameViewOnly(setNameMap, arrPrdEnr,
		strTargetId) {
	if (strLayoutType === 'WIRELAYOUT' || strLayoutType === 'WIRESIMPLELAYOUT') {
		var arrWireEnrichments = new Array(), arrPrdEnrDummy = new Array();
		if (arrPrdEnr) {
			$.each(arrPrdEnr, function(index, cfg) {
				if (cfg.enrichmentSetName
						&& (cfg.enrichmentSetName === 'BANK TO BANK INFO' || cfg.enrichmentSetName === 'INSTRUCTION CODE'))
					arrWireEnrichments.push(arrPrdEnr[index]);
				else
					arrPrdEnrDummy.push(arrPrdEnr[index]);
			});
		}
		paintPaymentEnrichmentAsSetNameNonWireLayoutViewOnly(setNameMap,
				arrPrdEnrDummy, strTargetId);
		paintPaymentEnrichmentAsSetNameWireLayoutViewOnly(setNameMap,
				arrWireEnrichments, strTargetId);
	} else
		paintPaymentEnrichmentAsSetNameNonWireLayoutViewOnly(setNameMap,
				arrPrdEnr, strTargetId);
}
function paintPaymentEnrichmentAsSetNameNonWireLayoutViewOnly(setNameMap,
		arrPrdEnr, strTargetId) {
	var valueSpan = null, targetDiv = $('#' + strTargetId), label = null, div = null, innerDiv = null, intCnt, tempObj, mainDiv = null, fieldSetDiv = null;
	var strSetName = null, enrField = null, enrFieldSeqNo = 0;
	var colCls = 'col-sm-6';
	var chkBoxDiv = null, chkBoxLbl = null, wrapperDiv = null, strValue = null, internalWrapperDiv = null, internalShadedDiv = null;
	// if (strLayoutType === 'WIRELAYOUT') {
	// paintPaymentEnrichmentAsSetNameWireLayoutViewOnly(setNameMap,
	// arrPrdEnr, strTargetId);
	// } else {
	if (arrPrdEnr && !isEmpty(targetDiv) && targetDiv.length > 0) {
		$.each(arrPrdEnr, function(index, cfg) {
			if (cfg.enrichmentSetName) {
				strSetName = (cfg.enrichmentSetName).replace(/ /g, '_');
				if (setNameMap[strSetName]) {
					tempObj = setNameMap[strSetName];
				} else {
					wrapperDiv = $('<div>').attr({
								'id' : strSetName + '_WrapperDiv'
							}).appendTo(targetDiv);

					fieldSetDiv = $('<div>').attr({
								'class' : 'col-sm-12 ',
								'id' : strSetName + '_FieldSetDiv'
							}).appendTo(wrapperDiv);

					chkBoxDiv = $('<div>').attr({
								'id' : strSetName + '_ChkBoxDiv'
							}).appendTo(fieldSetDiv);

					chkBoxLbl = $('<label>').attr({
								'style' : 'font-style:italic'
							}).appendTo(chkBoxDiv);

					if (strLayoutType === 'WIRELAYOUT' || strLayoutType === 'WIRESIMPLELAYOUT')
						$('<i>').attr({
									'class' : 'fa fa-check'
								}).appendTo(chkBoxLbl);

					/*
					 * $('<input>').attr({ 'type' : 'checkbox', 'id' :
					 * strSetName + '_ChkBox', 'checked' : true }).on('click',
					 * function() { // $('#' + strSetName).toggle('hidden'); var
					 * strId = $(this).attr('id'); if (strId) { strId =
					 * strId.replace('_ChkBox', ''); $('#' +
					 * strId).toggleClass('hidden'); } }).appendTo(chkBoxLbl);
					 */

					chkBoxLbl.append(' ' + cfg.enrichmentSetName);

					internalWrapperDiv = $('<div>').attr({
								'id' : strSetName
										+ '_InternalWrapperViewOnlyDiv',
								'class' : 'col-sm-12 '
							}).appendTo(wrapperDiv);

					internalShadedDiv = $('<div>').attr({
								'id' : strSetName + '_shadedViewOnlyDiv',
								'class' : 'well'
							}).appendTo(internalWrapperDiv);

					mainDiv = $('<div>').attr({
								'id' : strSetName,
								'class' : 'row'
							}).appendTo(internalShadedDiv);

					tempObj = {};
					tempObj['mainDiv' + strSetName] = mainDiv;
					tempObj['fieldSetDiv' + strSetName] = fieldSetDiv;
					tempObj[strSetName + 'Counter'] = 1;
					setNameMap[strSetName] = tempObj;
				}
				if (!isEmpty(tempObj)) {
					intCnt = tempObj[strSetName + 'Counter'];
					if (cfg.enrichmentType == 'S' || cfg.enrichmentType == 'M') {
						div = $('<div>').attr({
									'class' : colCls,
									'id' : cfg.code + 'Div'
								});
						innerDiv = $('<div>').attr({
									'class' : 'form-group',
									'id' : cfg.code + '_InnerDiv'
								});
						label = $('<label>').html(cfg.description + ' : ');

						strValue = getEnrichValueToDispayed(cfg);
						strValue = !isEmpty(strValue) ? strValue : '';

						valueSpan = $('<span>').html(' ' + strValue);

						if (valueSpan) {
							label.attr('for', cfg.code);
							// if (cfg.mandatory == true)
							// label.addClass('required');
							label.appendTo(innerDiv);

							valueSpan.appendTo(innerDiv);
							innerDiv.appendTo(div);
							if (!isEmpty(cfg.sequenceNmbr)) {
								var seqno = cfg.sequenceNmbr;
								if (seqno % 2 != 0) {
									if (cfg.displayType === 9)// LONGTEXTBOX
									{
										div.addClass('col-sm-12');
										div.removeClass('col-sm-6');
										div
												.attr('style',
														'overflow:visible;overflow-wrap:break-word;');
									} else
										div.addClass(colCls);
									div
											.appendTo(tempObj['mainDiv'
													+ strSetName]);
									if (arrPrdEnr.length > 1) {
										enrField = arrPrdEnr[index + 1];
										enrFieldSeqNo = enrField
												? enrField.sequenceNmbr
												: 1; // 1 if index is 1;

										if (enrFieldSeqNo % 2 != 0) {
											if (cfg.displayType !== 9)// LONGTEXTBOX
												$('<div>')
														.attr({
																	'class' : colCls
																})
														.appendTo(tempObj['mainDiv'
																+ strSetName]);
										}
									} else {
										if (cfg.displayType !== 9)// LONGTEXTBOX
											$('<div>').attr({
														'class' : 'col-sm-12'
													})
													.appendTo(tempObj['mainDiv'
															+ strSetName]);
									}

								} else if (seqno % 2 == 0) {
									if (arrPrdEnr.length > 1) {
										enrField = arrPrdEnr[index - 1];
										enrFieldSeqNo = enrField
												? enrField.sequenceNmbr
												: 2; // 2 if index is 1
										if (enrFieldSeqNo % 2 == 0) {
											$('<div>').attr({
														'class' : colCls
													})
													.appendTo(tempObj['mainDiv'
															+ strSetName]);
										}

									} else {
										$('<div>').attr({
													'class' : colCls
												}).appendTo(tempObj['mainDiv'
												+ strSetName]);
									}

									div
											.appendTo(tempObj['mainDiv'
													+ strSetName]);
								}
							}
						}
					}
				}
				tempObj[strSetName + 'Counter'] = intCnt;
			}
		});
	}
	// }
}
function paintPaymentEnrichmentAsSetNameWireLayoutViewOnly(setNameMap,
		arrPrdEnr, strTargetId) {
	var field = null, dependentField = null, targetDiv = $('#' + strTargetId), label = null, div = null, innerDiv = null, inlineDiv = null, intCnt, tempObj, mainDiv = null, fieldSetDiv = null;
	var strSetName = null, enrField = null, enrFieldSeqNo = 0, strValue = null, strDependentFldValue = null;
	var colCls = 'col-sm-6';
	var chkBoxDiv = null, chkBoxLbl = null, wrapperDiv = null, internalWrapperDiv = null, internalShadedDiv = null;

	if (arrPrdEnr) {
		for (var i = 0; i < arrPrdEnr.length; i = i + 2) {
			cfg = arrPrdEnr[i];
			if (cfg.enrichmentSetName) {
				strSetName = (cfg.enrichmentSetName).replace(/ /g, '_');
				if (setNameMap[strSetName]) {
					tempObj = setNameMap[strSetName];
				} else {
					wrapperDiv = $('<div>').attr({
								'id' : strSetName + '_WrapperDiv'
							}).appendTo(targetDiv);

					fieldSetDiv = $('<div>').attr({
								'class' : 'col-sm-12 ',
								'id' : strSetName + '_FieldSetDiv'
							}).appendTo(wrapperDiv);

					chkBoxDiv = $('<div>').attr({
								'id' : strSetName + '_ChkBoxDiv'
							}).appendTo(fieldSetDiv);

					chkBoxLbl = $('<label>').attr({
								'style' : 'font-style:italic;font-weight: bold;'
							}).appendTo(chkBoxDiv);

					$('<i>').attr({
								'class' : 'fa fa-check'
							}).appendTo(chkBoxLbl);

					/*
					 * $('<input>').attr({ 'type' : 'checkbox', 'id' :
					 * strSetName + '_ChkBox', 'checked' : true }).on('click',
					 * function() { // $('#' + strSetName).toggle('hidden'); var
					 * strId = $(this).attr('id'); if (strId) { strId =
					 * strId.replace('_ChkBox', ''); $('#' +
					 * strId).toggleClass('hidden'); } }).appendTo(chkBoxLbl);
					 */

					chkBoxLbl.append(' ' + cfg.enrichmentSetName);

					internalWrapperDiv = $('<div>').attr({
								'id' : strSetName + '_InternalWrapperDiv',
								'class' : 'col-sm-12 '
							}).appendTo(wrapperDiv);

					internalShadedDiv = $('<div>').attr({
								'id' : strSetName + '_shadedDiv',
								'class' : 'well'
							}).appendTo(internalWrapperDiv);

					mainDiv = $('<div>').attr({
								'id' : strSetName,
								'class' : 'row'
							}).appendTo(internalShadedDiv);

					tempObj = {};
					tempObj['mainDiv' + strSetName] = mainDiv;
					tempObj['fieldSetDiv' + strSetName] = fieldSetDiv;
					tempObj[strSetName + 'Counter'] = 1;
					setNameMap[strSetName] = tempObj;
				}
				if (!isEmpty(tempObj)) {
					intCnt = tempObj[strSetName + 'Counter'];
					if (cfg.enrichmentType == 'S' || cfg.enrichmentType == 'M') {
						div = $('<div>').attr({
									'class' : colCls,
									'id' : cfg.code + 'Div'
								});
						innerDiv = $('<div>').attr({
									'class' : 'form-group',
									'id' : cfg.code + '_InnerDiv'
								});
						label = $('<label>').html(cfg.description + ' : ');
						inlineDiv = $('<div>').attr({
									'class' : 'form-inline'
								});
						field = $('<span>').attr({
									'class' : '',
									'id' : cfg.code + '_EnrichInfoSpan'
								});; // createEnrichMentField(cfg);
						/*
						 * if (cfg.enableDisable != null) { if
						 * (cfg.enableDisable == 'disable') {
						 * field.attr('disabled', true); } else if
						 * (cfg.enableDisable == 'enable') {
						 * field.attr('disabled', false); } }
						 */
						if (field) {
							label.attr('for', cfg.code);
							if (cfg.mandatory == true)
								label.addClass('required');
							label.appendTo(innerDiv);
							// $('<br/>').appendTo(div);
							if (cfg.enrichmentType === 'S') {
								if ('A' === cfg.includeInTotal
										|| 'S' === cfg.includeInTotal) {
									handleAmmountCalculationOnSingleSetEnrichment(
											field, cfg);
								}
								if (!isEmpty(cfg.apiName))
									handlePageRefreshOnSingleSetEnrichmentChange(
											field, cfg);
								/*
								 * else if (strLayoutType === 'TAXLAYOUT')
								 * handleAmmountCalculationOnSingleSetEnrichment(
								 * field, cfg);
								 */
							} else if (cfg.enrichmentType === 'M'
									&& !isEmpty(cfg.apiName))
								handlePageRefreshOnMultiSetEnrichmentChange(
										field, cfg, argsData);
							field.appendTo(inlineDiv);
							if (cfg.value) {
								strValue = getEnrichValueToDispayed(cfg);
								field.html(' ' + strValue);
							}
							// field.attr('class', 'form-control');
							field.attr('style', 'width:29%;margin-right:5px;');
							if (i + 1 < arrPrdEnr.length) {
								dependentFieldObj = arrPrdEnr[i + 1];
								if (dependentFieldObj) {
									var dependentField = $('<span>').attr({
										'id' : dependentFieldObj.code
												+ '_EnrichInfoSpan'
									});// createEnrichMentField(dependentFieldObj);
									if (dependentFieldObj.enableDisable != null) {
										if (dependentFieldObj.enableDisable == 'disable') {
											dependentField.attr('disabled',
													true);
										} else if (dependentFieldObj.enableDisable == 'enable') {
											dependentField.attr('disabled',
													false);
										}
									}
									if (dependentFieldObj.value) {
										strDependentFldValue = getEnrichValueToDispayed(dependentFieldObj);
										dependentField
												.html(strDependentFldValue);
									}
									// dependentField.attr('class',
									// 'form-control');
									dependentField.attr('style', 'width:68%');
									dependentField.appendTo(inlineDiv);
								}
							}
							inlineDiv.appendTo(innerDiv);
							innerDiv.appendTo(div);
							if (!isEmpty(cfg.sequenceNmbr)) {
								var seqno = cfg.sequenceNmbr;
								if (seqno % 2 != 0) {
									if (cfg.displayType === 9) // LONGTEXTBOX
									{
										div.addClass('col-sm-12');
										div.removeClass('col-sm-6');
										div
												.attr('style',
														'overflow:visible;overflow-wrap:break-word');
									} else
										div.addClass(colCls);
									div
											.appendTo(tempObj['mainDiv'
													+ strSetName]);
									if (arrPrdEnr.length > 1) {
										enrField = arrPrdEnr[i + 1];
										enrFieldSeqNo = enrField
												? enrField.sequenceNmbr
												: 1; // 1 if index is 1;

										if (enrFieldSeqNo % 2 != 0) {
											if (cfg.displayType !== 9) // LONGTEXTBOX
												$('<div>')
														.attr({
																	'class' : colCls
																})
														.appendTo(tempObj['mainDiv'
																+ strSetName]);
										}
									} else {
										if (cfg.displayType !== 9) // LONGTEXTBOX
											$('<div>').attr({
														'class' : 'col-sm-12'
													})
													.appendTo(tempObj['mainDiv'
															+ strSetName]);
									}

								} else if (seqno % 2 == 0) {
									if (arrPrdEnr.length > 1) {
										enrField = arrPrdEnr[i - 1];
										enrFieldSeqNo = enrField
												? enrField.sequenceNmbr
												: 2; // 2 if index is 1
										if (enrFieldSeqNo % 2 == 0) {
											$('<div>').attr({
														'class' : colCls
													});
											// .appendTo(tempObj['mainDiv'
											// + strSetName]);
										}

									} else {
										$('<div>').attr({
													'class' : colCls
												});// .appendTo(tempObj['mainDiv'
										// + strSetName]);
									}

									// div.appendTo(tempObj['mainDiv'
									// + strSetName]);
								}
							}
						}
					}
				}
				tempObj[strSetName + 'Counter'] = intCnt;
			}
		};
		$('<div>').attr({
					'class' : 'clear',
					'id' : 'clearDiv'
				}).appendTo(targetDiv);
	}
}
function paintPaymentEnrichmentsHelperViewOnly(arrPrdEnr, intCounter,
		strTargetId, strPmtType, argsData) {
	var targetDiv = $('#' + strTargetId), label = null, div = null, wrappingDiv = null, intCnt = 1, sortArrPrdEnr, minCounter, maxCounter, arrLength;
	var colCls = (strLayoutType === 'WIRELAYOUT') ? 'col-sm-3' : 'col-sm-6';
	var strValue = null, valueSpan = null;
	if (!isEmpty(intCounter))
		intCnt = intCounter;
	if (arrPrdEnr) {
		sortArrPrdEnr = generateSortArrPrdEnr(arrPrdEnr);
		arrLength = sortArrPrdEnr.length;
		minCounter = sortArrPrdEnr[0].sequenceNmbr;
		maxCounter = sortArrPrdEnr[arrLength - 1].sequenceNmbr;
		for (var i = minCounter; i <= maxCounter; i++) {
			var enrField = null;
			enrField = getEnrField(arrPrdEnr, i);
			if (!isEmpty(enrField) && enrField != null) {
				if (enrField.enrichmentType == 'S'
						|| enrField.enrichmentType == 'M') {
					wrappingDiv = $('<div>').attr({
								'class' : colCls + ' ',
								'id' : enrField.code + 'wrappDiv'
							});
					div = $('<div>').attr({
								'class' : 'form-group',
								'id' : enrField.code + 'Div'
							});
					// label = $('<label>').attr('class', 'fieldLabel');
					label = $('<label>').attr('class', 'payment-font-bold');
					strValue = getEnrichValueToDispayed(enrField);
					strValue = !isEmpty(strValue) ? strValue : '';

					valueSpan = $('<span>').html(strValue);
					label.html(enrField.description + ' : ');
					label.appendTo(div);
					valueSpan.appendTo(div);
					div.appendTo(wrappingDiv);
					wrappingDiv.appendTo(targetDiv);
					intCnt++;
				}
			} else {
				div = $('<div>').attr({
							'class' : colCls
						});
				div.appendTo(targetDiv);
				intCnt++;
			}
		}
	}
	return intCnt;
}
function paintPaymentInstrumentActions(strAction, isBtnVisible) {
	var elt = null, btnBack = null, btnClose = null, btnNext = null, canShow = true;
	$('#paymentDtlActionButtonListLT,#paymentDtlActionButtonListRT, #paymentDtlActionButtonListLB, #paymentDtlActionButtonListRB')
			.empty();
	var strBtnLTLB = '#paymentDtlActionButtonListLT,#paymentDtlActionButtonListLB';
	var strBtnRTRB = '#paymentDtlActionButtonListRT,#paymentDtlActionButtonListRB';
	btnBack = createButton('btnBack', 'S');
	btnBack.click(function() {
				goToPage(_mapUrl['cancelInstrumentUrl'], 'frmMain');
			});

	if (strAction === 'VIEW') {
		btnBack.appendTo($(strBtnLTLB));
	}
	if (strAction === 'ADD') {
		elt = createButton('btnNext', 'P');
		elt.click(function() {
					//doSavePaymentInstrument();
					doSaveAndNextPaymentInstrument();
				});
		elt.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
		btnBack.appendTo($(strBtnLTLB));
	} else if (strAction === 'EDIT') {
		//elt = createButton('btnUpdate', 'P');
		//elt.click(function() {
		//			doUpdatePaymentInstrument();
		//		});
		//elt.appendTo($(strBtnRTRB));
		//$(strBtnRTRB).append("&nbsp;");
		btnNext = createButton('btnNext', 'P');
		btnNext.click(function() {
					doUpdateAndNextPaymentInstrument();
				});
		btnNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");

		btnBack.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
		eltDiscard = createButton('btnDiscard', 'S');
		eltDiscard.click(function() {
					// doHandlePaymentInstrumentAction('discard');
					getDiscardConfirmationPopup();
				});
		eltDiscard.appendTo($(strBtnLTLB));

	} else if (strAction === 'SUBMIT') {
		elt = createButton('btnSubmit', 'P');
		elt.click(function() {
					elt.unbind();
					doHandlePaymentInstrumentAction('submit', true);
				});
		elt.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");

		btnBack.unbind("click");
		btnBack.click(function() {
					togglePaymentInstrumentEditScreen(false);
				});

		btnBack.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");

		btnClose = createButton('btnClose', 'S');
		btnClose.click(function() {
					goToPage(_mapUrl['cancelBatchUrl'], 'frmMain');
				});

		btnClose.appendTo($(strBtnLTLB));

	} else if (strAction === 'UPDATE' || strAction === 'UPDATEWITHERROR') {
		//elt = createButton('btnUpdate', 'P');
		//elt.click(function() {
		//			doUpdatePaymentInstrument();
		//		});
		//elt.appendTo($(strBtnRTRB));
		//$(strBtnRTRB).append("&nbsp;");

		btnNext = createButton('btnNext', 'P');
		btnNext.click(function() {
					doUpdateAndNextPaymentInstrument();
				});
		btnNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");

		if (canShow === true) {
			// TODO: Remove after not required confirmation
			// elt = createButton('btnUpdateAndAdd', 'P');
			// elt.click(function() {
			// // doUpdateAndAddPaymentInstrument();
			// });
			// elt.appendTo($(strBtnRTRB));
			// $(strBtnRTRB).append("&nbsp;");
			// Kept false as we are showing pop-up on SAVEWITHERROR
			if (false && strAction === 'UPDATEWITHERROR') {
				elt = createButton('btnIgonreErrorAndAdd', 'P');
				elt.click(function() {
							// doIgnoreErrorAndAddPaymentInstrument();
						});
				elt.appendTo($(strBtnRTRB));
				$(strBtnRTRB).append("&nbsp;");
			}
		}
		btnBack.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
		eltDiscard = createButton('btnDiscard', 'S');
		eltDiscard.click(function() {
					// doHandlePaymentInstrumentAction('discard');
					getDiscardConfirmationPopup();
				});
		eltDiscard.appendTo($(strBtnLTLB));
	}
	autoFocusFirstElement();
}
function paintPaymentInstrumentActionsForView(strAction) {
	var btnBack = null, btnDiscard = null, btnSubmit = null, btnDisable = null, btnEnable = null;
	$('#paymentDtlActionButtonListLT,#paymentDtlActionButtonListRT, #paymentDtlActionButtonListLB, #paymentDtlActionButtonListRB')
			.empty();
	var strBtnLTLB = '#paymentDtlActionButtonListLT,#paymentDtlActionButtonListLB';
	var strBtnRTRB = '#paymentDtlActionButtonListRT,#paymentDtlActionButtonListRB';
	btnBack = createButton('btnBack', 'S');
	btnBack.click(function() {
				goToPage(_mapUrl['cancelBatchUrl'], 'frmMain');
			});

	btnDiscard = createButton('btnDiscard', 'S');
	btnDiscard.click(function() {
				// doHandlePaymentInstrumentAction('discard');
				getDiscardConfirmationPopup();
			});

	if (strAction === 'SUBMIT') {
		btnDiscard.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");

		btnSubmit = createButton('btnSubmit', 'S');
		btnSubmit.click(function() {
					btnSubmit.unbind();
					doHandlePaymentInstrumentAction('submit', true);
				});
		btnSubmit.appendTo($(strBtnRTRB));

		btnBack.appendTo($(strBtnLTLB));
	} else if (strAction === 'CANCELANDDISCARD') {
		btnDiscard.appendTo($(strBtnRTRB));
		btnBack.appendTo($(strBtnLTLB));
	} else if (strAction === 'CANCELDISABLE') {
		btnDisable = createButton('btnDisable', 'S');
		btnDisable.click(function() {
					doHandlePaymentInstrumentAction('disable', true);
				});
		btnDisable.appendTo($(strBtnRTRB));

		btnBack.appendTo($(strBtnLTLB));
	} else if (strAction === 'CANCELENABLE') {
		btnEnable = createButton('btnEnable', 'S');
		btnEnable.click(function() {
					doHandlePaymentInstrumentAction('enable', true);
				});
		btnEnable.appendTo($(strBtnRTRB));

		btnBack.appendTo($(strBtnLTLB));
	} else if (strAction === 'CANCELONLY') {
		btnBack.appendTo($(strBtnLTLB));
	}
}
function paintPaymentInstrumentGroupActions(strMask, strAction, strAuthLevel,
		strParentId, strDetailId, strShowAdvice) {
	if (!isEmpty(strMask)) {
		var elt = null;
		var isAuth = isActionEnabled(strMask, 0);
		var isReject = isActionEnabled(strMask, 1);
		var isSend = isActionEnabled(strMask, 2);
		var isHold = isActionEnabled(strMask, 3);
		var isRelease = isActionEnabled(strMask, 4);
		var isStop = isActionEnabled(strMask, 5);
		var isVerify = isActionEnabled(strMask, 6);
		var isDiscard = isActionEnabled(strMask, 7);
		var strBtnRTRB = '#paymentDtlActionButtonListRT,#paymentDtlActionButtonListRB';

		if (isAuth === true) {
			$(strBtnRTRB).empty();
			elt = createButton('btnApprove', 'P');
			elt.click(function() {
						doHandlePaymentInstrumentAction('auth', true);
					});
			elt.appendTo($(strBtnRTRB));
			$(strBtnRTRB).append("&nbsp;");

		}
		if (isReject === true) {
			if (!isAuth)
				$(strBtnRTRB).empty();

			elt = createButton('btnReject', 'P');
			elt.click(function() {
						doHandleRejectAction('reject', 'Q', true);
					});
			elt.appendTo($(strBtnRTRB));

		}
		if (isSend === true) {
			$(strBtnRTRB).empty();
			elt = createButton('btnSend', 'P');
			elt.click(function() {
						doHandlePaymentInstrumentAction('send', true);
					});
			elt.appendTo($(strBtnRTRB));
			$(strBtnRTRB).append("&nbsp;");
		}

		if (isHold === true) {
			elt = createButton('btnHold', 'P');
			elt.click(function() {
						doHandlePaymentInstrumentAction('hold', true);
					});
			$(strBtnRTRB).append("&nbsp;");
			elt.appendTo($(strBtnRTRB));
		}

		if (isRelease === true) {
			elt = createButton('btnRelease', 'P');
			elt.click(function() {
						doHandlePaymentInstrumentAction('release', true);
					});
			$(strBtnRTRB).append("&nbsp;");
			elt.appendTo($(strBtnRTRB));
		}

		if (isStop === true) {
			elt = createButton('btnStop', 'P');
			elt.click(function() {
						doHandlePaymentInstrumentAction('cancel', true);
					});
			$(strBtnRTRB).append("&nbsp;");
			elt.appendTo($(strBtnRTRB));
		}

		if (isVerify === true) {
			elt = createButton('btnVerify', 'P');
			elt.click(function() {
						doHandlePaymentInstrumentAction('verify', true);
					});
			$(strBtnRTRB).append("&nbsp;");
			elt.appendTo($(strBtnRTRB));
		}

		if (isDiscard === true) {
			elt = createButton('btnDiscard', 'P');
			elt.click(function() {
						// doHandlePaymentInstrumentAction('discard');
						getDiscardConfirmationPopup();
					});
			$(strBtnRTRB).append("&nbsp;");
			elt.appendTo($(strBtnRTRB));
		}
		/*if(strShowAdvice === 'Y'){
			elt = createButton('btnPaymentAdvice', 'S');
			$(strBtnRTRB).append("&nbsp;");
			elt.appendTo($(strBtnRTRB));
			elt.click(function() {
				var arrayJson = new Array()
				arrayJson.push({
							serialNo : 0,
							identifier : strPaymentInstrumentIde
						});
						$.download(_mapUrl['paymentAdvice'], arrayJson);
				});
		}*/

	}

}
function isActionEnabled(arrInputMask, bitPosition) {
	var retValue = false;
	if (arrInputMask.charAt(bitPosition)
			&& arrInputMask.charAt(bitPosition) * 1 === 1)
		retValue = true;
	return retValue;
}
function getEnrichValueToDispayed(cfg) {
	var displayType = cfg.displayType;
	var strReturnValue = '', defValue = cfg.value;
	if (isEmpty(displayType))
		displayType = 0;
	switch (displayType) {

		case 4 : // COMBOBOX
			if (!isEmpty(cfg.value)) {
				strReturnValue = getObjectFormJsonKeyValueArray(cfg.value,
						cfg.lookupValues);
				strReturnValue = strReturnValue && strReturnValue.value
						? strReturnValue.value
						: '';
			}
			break;
		case 5 : // SELECTBOX
			break;
		case 8 : // SEEKBOX
			break;
		case 1 : // TEXTAREA
		case 2 : // AMOUNTBOX
		case 3 : // NUMBERBOX
		case 6 : // DATEBOX
		case 7 : // TIMEBOX
		case 9 : // LONGTEXTBOX
		case 0 : // TEXTBOX
		default :
			strReturnValue = defValue;
			break;
	}
	return strReturnValue;
}
function getObjectFormJsonKeyValueArray(strKey, arrValues) {
	var retValue = null;
	if (arrValues)
		$.each(arrValues, function(index, opt) {
					if (strKey === opt.key) {
						retValue = opt;
						return false;
					}
				});
	return retValue;
}
function paintPaymentStandardFields(data, filter) {
	var arrFields = [];
	var strDisplayMode = null, divId = null, fieldId = null, lblId = null, cfgAccountNo = {};
	if (strEntryType && 'TEMPLATE' === strEntryType)
		handleContractRateInTemplate(data, 'Q');
	if (data) {
		arrFields = data;
		if (arrFields && arrFields.length > 0) {
			$.each(arrFields, function(index, cfg) {
						fieldId = cfg.fieldName;
						strDisplayMode = cfg.displayMode;
						divId = fieldId + 'Div';
						lblId = fieldId + 'Lbl';
						if(false && cfg.fieldName ==='drawerAccountNo' && strLayoutType === 'ACCTRFLAYOUT'){
							var isSuggestionBox = cfg.availableValues && cfg.availableValues.length>10 ? true : false;
							toggleDrawerAccountFieldBehaviour(isSuggestionBox);
						}
						if (fieldId === 'beneficiaryBankIDCode') {
							fieldId = 'beneficiaryBankIDCodeAutoCompleter';
						}
						handleDisplayMode(strDisplayMode, fieldId, 'Q');
						if (fieldId === 'accountNo') {
							cfgAccountNo = cfg;
							// if(strEntryType==='PAYMENT' || strEntryType
							// ==='SI')
							// handleAccountNoRefreshLink(cfg);
						}
						handleFieldPopulation(cfg, cfg.fieldName);

						if (cfg.fieldName === 'templateType') {
							var arrOfAvalVal = cfg.availableValues;
							if (arrOfAvalVal && arrOfAvalVal.length > 0) {
								$.each(arrOfAvalVal, function(idx, opt) {
											if (opt.code === '1') {
												$('#divNonRepetative')
														.removeClass('hidden');
											} else if (opt.code === '2') {
												$('#divRepetative')
														.removeClass('hidden');
											} else if (opt.code === '3') {
												$('#divSemiRepetative')
														.removeClass('hidden');
											}
										});
							}
						} else if ('drCrFlag' === cfg.fieldName) {
							handleDrCrFlagPaymentInstrument(cfg);
						} else if ('debitPaymentAmntFlag' === cfg.fieldName) {
							handleDebitPaymentAmntFlagPopulation(cfg);
						}
					});
			if ((strEntryType === 'PAYMENT' || strEntryType === 'SI')
					&& strPaymentType != 'BATCHPAY') {
				var Freq = null, gstrPeriod = null, gstrRef = null;
				if (arrFields) {
					var stdFieldData = arrFields;
					if (stdFieldData && stdFieldData.length > 0) {
						$.each(stdFieldData, function(index, cfg) {
									fieldId = cfg.fieldName;
									if (fieldId === 'period') {
										if (!isEmpty(cfg.value))
											gstrPeriod = cfg.value;
									}
									if (fieldId === 'refDay') {
										if (!isEmpty(cfg.value))
											gstrRef = cfg.value;
									}
									if (fieldId === 'siFrequencyCode') {
										if (!isEmpty(cfg.value))
											Freq = cfg.value;
									}
								});
					}
				}
				populateSIProcessing('Q', Freq, gstrPeriod, gstrRef);
				toggleRecurringPaymentParameterDtlFieldsSectionVisibility();
			} else if (strEntryType === 'TEMPLATE') {
				if (strPaymentType === 'QUICKPAY') {
					var strTemplateType = getInstrumentTemplateType(arrFields);
					if (strTemplateType === '1')
						toggleAccountFieldBehaviour(true, 'Q');
					else
						toggleAccountFieldBehaviour(false, 'Q');
					handleFieldPopulation(cfgAccountNo, cfgAccountNo.fieldName);
					applyControlFieldsValidation(strPaymentType);
				}
				// Receiver Fields mandatory on change of receiver
				$('#prenote').unbind('click');
				$('#prenote').bind('click', function() {
							toggleCheckBoxValue("prenote");
							handleReceiverFieldsOnPrenoteChange();
						});
			}
			//FTMNTBANK-841 handleCompanyIdChange(false);
		}
		//doHandleForex();
	}
}
function paintPaymentReceiverFields(data, headerInfo, pirmode) {
	var fieldId = null, cfgBeneDetails = null, cfgBeneRegistered = null, cfgBeneAdhoc = null, blnRegisteredOnly = false;
	var strPostFix = 'R_InstView';
	if (data) {
		cfgBeneDetails = data;
		blnRegisteredOnly = cfgBeneDetails.adhocBene ? false : true;
		clearReceiver('B', true);
		if (cfgBeneDetails.registeredBene) {
			cfgBeneRegistered = cfgBeneDetails.registeredBene;
			if (cfgBeneRegistered && cfgBeneRegistered.length > 0) {
				$.each(cfgBeneRegistered, function(index, cfg) {
					fieldId = cfg.fieldName;
					if (fieldId === 'drawerCode'
							&& (!isEmpty(cfg.value) || ('Q' === strPaymentType
									&& 'B' === strPayUsing && !isEmpty(strSelectedReceiver)))) {
						if (fieldId === 'drawerCode' && cfg.readOnly === 'true') {
							$('#drawerDescriptionA').attr("disabled",
									cfg.readOnly);
							$('#drawerDescriptionA').addClass("disabled");
						}
						var _strSelectedReceiverCode = cfg.value == null
								? strSelectedReceiver
								: cfg.value;
						toggleRegisteredReceiverMoreDetails(_strSelectedReceiverCode);
					} /*else if ((fieldId === 'tag57Type'
							|| fieldId === 'tag54Type' || fieldId === 'tag56Type')) {
								handleReceiverTagDetailsSectionForRegisteredReceiver(strPostFix,cfg,clsHide);
					}*/
					paintRegisteredReceiverInfoFields(fieldId, strPostFix, cfg);
					handleDisplayMode(cfg.displayMode, fieldId + 'R');
					handleFieldPopulation(cfg, cfg.fieldName + 'R');
				});
			}
			handleReceiverTagDetailsSection(true);
		}
		if (cfgBeneDetails.adhocBene) {
			isAdhocReceiverAllowed = true;
			cfgAdhocBeneBank = null, cfgAdhocBank = null, cfgAdhocBeneBankID = null;
			cfgBeneAdhoc = cfgBeneDetails.adhocBene;
			if (cfgBeneAdhoc && cfgBeneAdhoc.length > 0) {
				$.each(cfgBeneAdhoc, function(index, cfg) {
							fieldId = cfg.fieldName;
							if (fieldId === 'beneficiaryBankDescription') {
								cfgAdhocBeneBank = cfg;
							} else if (fieldId === 'beneficiaryAdhocbankFlag') {
								cfgAdhocBank = cfg;
							} else if (fieldId === 'beneficiaryBankIDCode') {
								cfgAdhocBeneBankID = cfg;
							}
							handleDisplayMode(cfg.displayMode, fieldId + 'A');
							handleFieldPopulation(cfg, cfg.fieldName + 'A');
						});
					
				//if (strLayoutType && strLayoutType === 'ACHLAYOUT')
				//	$("#beneficiaryBankIDTypeA").val("FED");

				if (cfgAdhocBank && cfgAdhocBank.value) {
					if (cfgAdhocBank.value == 'A') {
						$('#beneficiaryAdhocbankFlagA').val('A');
					}
				}
				
				if (cfgAdhocBeneBankID) {
					if (cfgAdhocBeneBankID.value)
						$("#beneficiaryBankIDCodeAutoCompleter")
								.val(cfgAdhocBeneBankID.value);
					if (cfgAdhocBeneBankID.displayMode
							&& cfgAdhocBeneBankID.displayMode === "3")
						$("#beneficiaryBankIDCodeAutoCompleterLbl").addClass('required');				}
				
			}
			handleReceiverTagDetailsSection(false);
		}
		
		if (!isEmpty(cfgBeneDetails.drawerRegistedFlag) && strLayoutType
		/* && strLayoutType != 'TAXLAYOUT' */) {
			if (cfgBeneDetails.drawerRegistedFlag == 'N'
					|| cfgBeneDetails.drawerRegistedFlag == 'A') {
				toggleReceiver('A', false);
			} else if (cfgBeneDetails.drawerRegistedFlag == 'Y'
					|| cfgBeneDetails.drawerRegistedFlag == 'R') {
				toggleReceiver('R', false);
			}
		} else if (isEmpty(cfgBeneDetails.drawerRegistedFlag) && strLayoutType
				&& strLayoutType != 'TAXLAYOUT' && !blnRegisteredOnly) {
			toggleReceiver('A', false);
		}
		if (blnRegisteredOnly) {
			$('.adhocReceiver,.adhocReceiverR,.adhocReceiverR, #switchToAdhocReceiverDiv')
					.empty();
			$('#drawerDescriptionR').attr({
						'readonly' : false,
						'placeholder' : 'Enter Keyword or %'
					});
			toggleReceiver('R', false);
		}
		toggleReceiverCodeNecessity();
		/**
		 * Note : This is handled for payment using template
		 */
		if (!isEmpty(headerInfo.hdrTemplateName) && headerInfo.templateType ==='3'
				&& strEntryType === 'PAYMENT' ) {
			$('#switchToAdhocReceiverDiv').empty();
		}
	}
}
function paintPaymentEnrichments(objData) {
	var data = objData;
	var isVisible = false, isVisibleTransAddenda = false, clsHide = 'hidden', intConterForTransAddenda = 1, intCounter = 1, strTargetId = 'addendaInfoEnrichDiv', strTransAddendaTargetId = 'addendaInfoEnrichInTransctionDiv';
	$('#addendaInfoEnrichDiv, #bankProductMultiSetEnrichDiv, #myProductMultiSetEnrichDiv, #clientMultiSetEnrichDiv , #addendaInfoEnrichInTransctionDiv')
			.empty();
	mapEnrichSet = {};
	if (data.udeEnrichment && data.udeEnrichment.parameters) {
		paintPaymentEnrichmentAsSetName(mapEnrichSet,
				data.udeEnrichment.parameters, strTargetId);
		isVisible = true;
	}
	if (data.productEnrichment && data.productEnrichment.parameters) {
		paintPaymentEnrichmentAsSetName(mapEnrichSet,
				data.productEnrichment.parameters, strTargetId);
		isVisible = true;
	}
	if (data.myproductEnrichment && data.myproductEnrichment.parameters) {
		paintPaymentEnrichmentAsSetName(mapEnrichSet,
				data.myproductEnrichment.parameters, strTargetId);
		isVisible = true;
	}
	if (data.clientEnrichment && data.clientEnrichment.parameters) {
		paintPaymentEnrichmentAsSetName(mapEnrichSet,
				data.clientEnrichment.parameters, strTargetId);
		isVisible = true;
	}
	if (data.productEnrichmentStdFields
			&& data.productEnrichmentStdFields.parameters) {
		intConterForTransAddenda = paintPaymentEnrichmentsHelper(
				data.productEnrichmentStdFields.parameters,
				intConterForTransAddenda, strTransAddendaTargetId, 'Q');
		isVisibleTransAddenda = true;
	}
	if (data.myproductEnrichmentStdFields
			&& data.myproductEnrichmentStdFields.parameters) {
		intConterForTransAddenda = paintPaymentEnrichmentsHelper(
				data.myproductEnrichmentStdFields.parameters,
				intConterForTransAddenda, strTransAddendaTargetId, 'Q');
		isVisibleTransAddenda = true;
	}
	if (data.clientEnrichmentStdFields
			&& data.clientEnrichmentStdFields.parameters) {
		intConterForTransAddenda = paintPaymentEnrichmentsHelper(
				data.clientEnrichmentStdFields.parameters,
				intConterForTransAddenda, strTransAddendaTargetId, 'Q');
		isVisibleTransAddenda = true;
	}
	if (data.udeEnrichmentStdFields && data.udeEnrichmentStdFields.parameters) {
		intConterForTransAddenda = paintPaymentEnrichmentsHelper(
				data.udeEnrichmentStdFields.parameters,
				intConterForTransAddenda, strTransAddendaTargetId, 'Q');
		isVisibleTransAddenda = true;
	}
	resetMultiSetEnrichVariable();
	if (data.myProductMultiSet && data.myProductMultiSetMetadata) {
		paintPaymentMyProductMultiSetEnrichments(data.myProductMultiSet,
				data.myProductMultiSetMetadata, intCounter,
				'myProductMultiSetEnrichDiv', 'Q');
		isVisible = true;
	}
	if (data.bankProductMultiSet && data.bankProductMultiSetMetadata) {
		paintPaymentBankProductMultiSetEnrichments(data.bankProductMultiSet,
				data.bankProductMultiSetMetadata, intCounter,
				'bankProductMultiSetEnrichDiv', 'Q');
		isVisible = true;
	}
	if (data.clientMultiSet && data.clientMultiSetMetadata) {
		paintPaymentClientProductMultiSetEnrichments(data.clientMultiSet,
				data.clientMultiSetMetadata, intCounter,
				'clientMultiSetEnrichDiv', 'Q');
		isVisible = true;
	}

	if (isVisibleTransAddenda) {
		$('#addendaInfoEnrichInTransctionDiv').removeClass(clsHide);
	}
	if (isVisible) {
		$('#AddBankInfo').removeClass(clsHide);
	}

	return (isVisible);

}
function resetEnrichmentSection(){
	$('#addendaInfoEnrichDiv, #bankProductMultiSetEnrichDiv, #myProductMultiSetEnrichDiv, #clientMultiSetEnrichDiv , #addendaInfoEnrichInTransctionDiv')
			.empty();
}
function handleEmptyEnrichmentDivs() {
	var intNonEmptyDivHeight = 0;
	$('.emptyEnrichDiv').each(function() {
		if (intNonEmptyDivHeight != 0)
			$(this).attr('style', 'height:' + intNonEmptyDivHeight);
		else {
			var objNonEmptyDivId = $(this).prev().attr('id');
			if (objNonEmptyDivId) {
				intNonEmptyDivHeight = $('#' + objNonEmptyDivId).height();
				$(this).attr('style', 'height:' + intNonEmptyDivHeight);
			}
		}
		if (!$(this).prev().children() || $(this).prev().children().length == 0) {
			$(this).prev().remove();
			$(this).remove();
		}
	});
}
function paintPaymentEnrichmentAsSetName(setNameMap, arrPrdEnr, strTargetId) {
	if (strLayoutType === 'WIRELAYOUT') {
		var arrWireEnrichments = new Array(), arrPrdEnrDummy = new Array();
		if (arrPrdEnr) {
			$.each(arrPrdEnr, function(index, cfg) {
				if (cfg.enrichmentSetName
						&& (cfg.enrichmentSetName === 'BANK TO BANK INFO' || cfg.enrichmentSetName === 'INSTRUCTION CODE'))
					arrWireEnrichments.push(arrPrdEnr[index]);
				else
					arrPrdEnrDummy.push(arrPrdEnr[index]);
			});
		}
		paintPaymentEnrichmentAsSetNameNonWireLayout(setNameMap,
				arrPrdEnrDummy, strTargetId);
		paintPaymentEnrichmentAsSetNameWireLayout(setNameMap,
				arrWireEnrichments, strTargetId);
	} else
		paintPaymentEnrichmentAsSetNameNonWireLayout(setNameMap, arrPrdEnr,
				strTargetId);
}
function paintPaymentEnrichmentAsSetNameNonWireLayout(setNameMap, arrPrdEnr,
		strTargetId) {
	var field = null, targetDiv = $('#' + strTargetId), label = null, div = null, innerDiv = null, intCnt, tempObj, mainDiv = null, fieldSetDiv = null;
	var strSetName = null, enrField = null, enrFieldSeqNo = 0;
	var colCls = 'col-sm-6';
	var chkBoxDiv = null, chkBoxLbl = null, wrapperDiv = null, internalWrapperDiv = null, internalShadedDiv = null, rowDiv = null;

	if (arrPrdEnr) {
		$.each(arrPrdEnr, function(index, cfg) {
			if (cfg.enrichmentSetName) {
				strSetName = (cfg.enrichmentSetName).replace(/ /g, '_');
				if (setNameMap[strSetName]) {
					tempObj = setNameMap[strSetName];
				} else {
					wrapperDiv = $('<div>').attr({
								'id' : strSetName + '_WrapperDiv'
							}).appendTo(targetDiv);
					rowDiv = $('<div>').attr({
								'class' : 'row '
							});
					fieldSetDiv = $('<div>').attr({
								'class' : 'col-sm-12 ',
								'id' : strSetName + '_FieldSetDiv'
							}).appendTo(rowDiv);
					rowDiv.appendTo(wrapperDiv);

					chkBoxDiv = $('<div>').attr({
								'id' : strSetName + '_ChkBoxDiv'
							}).appendTo(fieldSetDiv);

					chkBoxLbl = $('<label>').attr({
								'style' : 'font-style:italic;font-weight: bold;'
							}).appendTo(chkBoxDiv);

					if (strLayoutType === 'WIRELAYOUT' || strLayoutType === 'WIRESIMPLELAYOUT') {
						chkBoxLbl = $('<label>').attr({
									'class' : 'checkbox-inline',
									'style' : 'font-style:italic;font-weight: bold;'
								}).appendTo(chkBoxDiv);

						$('<input>').attr({
									'type' : 'checkbox',
									'id' : strSetName + '_ChkBox',
									'checked' : true
								}).on('click', function() {
									// $('#' + strSetName).toggle('hidden');
									var strId = $(this).attr('id');
									if (strId) {
										strId = strId.replace('_ChkBox', '_InternalWrapperDiv');
										$('#' + strId).toggleClass('hidden');
									}
								}).appendTo(chkBoxLbl);

						chkBoxLbl.append(cfg.enrichmentSetName);
					}
					rowDiv = $('<div>').attr({
								'class' : 'row '
							});
					internalWrapperDiv = $('<div>').attr({
								'id' : strSetName + '_InternalWrapperDiv',
								'class' : 'col-sm-12 '
							}).appendTo(rowDiv);
					rowDiv.appendTo(wrapperDiv);
					if (strLayoutType === 'WIRELAYOUT' || strLayoutType === 'WIRESIMPLELAYOUT') {
						internalShadedDiv = $('<div>').attr({
									'id' : strSetName + '_shadedDiv',
									'class' : 'well'
								}).appendTo(internalWrapperDiv);

						mainDiv = $('<div>').attr({
									'id' : strSetName,
									'class' : 'row'
								}).appendTo(internalShadedDiv);
					} else {
						mainDiv = $('<div>').attr({
									'id' : strSetName,
									'class' : 'row'
								}).appendTo(internalWrapperDiv);
					}

					tempObj = {};
					tempObj['mainDiv' + strSetName] = mainDiv;
					tempObj['fieldSetDiv' + strSetName] = fieldSetDiv;
					tempObj[strSetName + 'Counter'] = 1;
					setNameMap[strSetName] = tempObj;
				}
				if (!isEmpty(tempObj)) {
					intCnt = tempObj[strSetName + 'Counter'];
					if (cfg.enrichmentType == 'S' || cfg.enrichmentType == 'M') {
						div = $('<div>').attr({
									'class' : colCls,
									'id' : cfg.code + 'Div'
								});
						innerDiv = $('<div>').attr({
									'class' : 'form-group',
									'id' : cfg.code + '_InnerDiv'
								});
						label = $('<label>').html(cfg.description);

						field = createEnrichMentField(cfg);
						if (cfg.enableDisable != null) {
							if (cfg.enableDisable == 'disable') {
								field.attr('disabled', true);
							} else if (cfg.enableDisable == 'enable') {
								field.attr('disabled', false);
							}
						}
						if (field) {
							label.attr('for', cfg.code);
							if (cfg.mandatory == true)
								label.addClass('required');
							label.appendTo(innerDiv);
							// $('<br/>').appendTo(div);
							if (cfg.enrichmentType === 'S') {
								if ('A' === cfg.includeInTotal
										|| 'S' === cfg.includeInTotal) {
									handleAmmountCalculationOnSingleSetEnrichment(
											field, cfg);
								}
								if (!isEmpty(cfg.apiName))
									handlePageRefreshOnSingleSetEnrichmentChange(
											field, cfg);
								else if (strLayoutType === 'TAXLAYOUT')
									handleAmmountCalculationOnSingleSetEnrichment(
											field, cfg);
							} else if (cfg.enrichmentType === 'M'
									&& !isEmpty(cfg.apiName))
								handlePageRefreshOnMultiSetEnrichmentChange(
										field, cfg, argsData)
							field.appendTo(innerDiv);
							field.addClass('form-control');
							innerDiv.appendTo(div);
							if (!isEmpty(cfg.sequenceNmbr)) {
								var seqno = cfg.sequenceNmbr;
								if (seqno % 2 != 0) {
									if (cfg.displayType === 9)// LONGTEXTBOX
									{
										div.addClass('col-sm-12');
										div.removeClass('col-sm-6');
									} else
										div.addClass(colCls);
									div
											.appendTo(tempObj['mainDiv'
													+ strSetName]);
									if (arrPrdEnr.length > 1) {
										enrField = arrPrdEnr[index + 1];
										enrFieldSeqNo = enrField
												? enrField.sequenceNmbr
												: 1; // 1 if
										// index
										// is
										// 1;

										if (enrFieldSeqNo % 2 != 0) {
											if (cfg.displayType !== 9)// LONGTEXTBOX
												$('<div>')
														.attr({
																	'class' : colCls +' emptyEnrichDiv'
																})
														.appendTo(tempObj['mainDiv'
																+ strSetName]);
										}
									} else {
										if (cfg.displayType !== 9)// LONGTEXTBOX
											$('<div>').attr({
														'class' : 'col-sm-12'
													})
													.appendTo(tempObj['mainDiv'
															+ strSetName]);
									}

								} else if (seqno % 2 == 0) {
									if (arrPrdEnr.length > 1) {
										enrField = arrPrdEnr[index - 1];
										enrFieldSeqNo = enrField
												? enrField.sequenceNmbr
												: 2; // 2 if
										// index
										// is 1
										if (enrFieldSeqNo % 2 == 0) {
											$('<div>').attr({
														'class' : colCls 
													})
													.appendTo(tempObj['mainDiv'
															+ strSetName]);
										}

									} else {
										$('<div>').attr({
													'class' : colCls
												}).appendTo(tempObj['mainDiv'
												+ strSetName]);
									}

									div
											.appendTo(tempObj['mainDiv'
													+ strSetName]);
								}
							}
						}
					}
				}
				tempObj[strSetName + 'Counter'] = intCnt;
			}
		});
		$('<div>').attr({
					'class' : 'clear',
					'id' : 'clearDiv'
				}).appendTo(targetDiv);
	}
	// }

}
function paintPaymentEnrichmentAsSetNameWireLayout(setNameMap, arrPrdEnr,
		strTargetId) {
	var field = null, dependentField = null, targetDiv = $('#' + strTargetId), label = null, div = null, innerDiv = null, inlineDiv = null, intCnt, tempObj, mainDiv = null, fieldSetDiv = null;
	var strSetName = null, enrField = null, enrFieldSeqNo = 0;
	var colCls = 'col-sm-6';
	var chkBoxDiv = null, chkBoxLbl = null, wrapperDiv = null, internalWrapperDiv = null, internalShadedDiv = null,rowDiv = null;

	if (arrPrdEnr) {
		for (var i = 0; i < arrPrdEnr.length; i = i + 2) {
			cfg = arrPrdEnr[i];
			if (cfg.enrichmentSetName) {
				strSetName = (cfg.enrichmentSetName).replace(/ /g, '_');
				if (setNameMap[strSetName]) {
					tempObj = setNameMap[strSetName];
				} else {
					wrapperDiv = $('<div>').attr({
								'id' : strSetName + '_WrapperDiv'
							}).appendTo(targetDiv);
					rowDiv = $('<div>').attr({
						'class' : 'row '
					});
					fieldSetDiv = $('<div>').attr({
								'class' : 'col-sm-12 ',
								'id' : strSetName + '_FieldSetDiv'
							}).appendTo(rowDiv);
					rowDiv.appendTo(wrapperDiv);

					chkBoxDiv = $('<div>').attr({
								'class' : 'checkbox ',
								'id' : strSetName + '_ChkBoxDiv'
							}).appendTo(fieldSetDiv);

					chkBoxLbl = $('<label>').attr({
								'class' : 'checkbox-inline',
								'style' : 'font-style:italic;font-weight: bold;'
							}).appendTo(chkBoxDiv);

					$('<input>').attr({
								'type' : 'checkbox',
								'id' : strSetName + '_ChkBox',
								'checked' : true
							}).on('click', function() {
								// $('#' + strSetName).toggle('hidden');
								var strId = $(this).attr('id');
								if (strId) {
									strId = strId.replace('_ChkBox', '_InternalWrapperDiv');
									$('#' + strId).toggleClass('hidden');
								}
							}).appendTo(chkBoxLbl);

					chkBoxLbl.append(cfg.enrichmentSetName);

					rowDiv = $('<div>').attr({
						'class' : 'row '
					});
					internalWrapperDiv = $('<div>').attr({
								'id' : strSetName + '_InternalWrapperDiv',
								'class' : 'col-sm-12 '
							}).appendTo(rowDiv);
					rowDiv.appendTo(wrapperDiv);

					internalShadedDiv = $('<div>').attr({
								'id' : strSetName + '_shadedDiv',
								'class' : 'well'
							}).appendTo(internalWrapperDiv);

					mainDiv = $('<div>').attr({
								'id' : strSetName,
								'class' : 'row'
							}).appendTo(internalShadedDiv);

					tempObj = {};
					tempObj['mainDiv' + strSetName] = mainDiv;
					tempObj['fieldSetDiv' + strSetName] = fieldSetDiv;
					tempObj[strSetName + 'Counter'] = 1;
					setNameMap[strSetName] = tempObj;
				}
				if (!isEmpty(tempObj)) {
					intCnt = tempObj[strSetName + 'Counter'];
					if (cfg.enrichmentType == 'S' || cfg.enrichmentType == 'M') {
						div = $('<div>').attr({
									'class' : colCls,
									'id' : cfg.code + 'Div'
								});
						innerDiv = $('<div>').attr({
									'class' : 'form-group',
									'id' : cfg.code + '_InnerDiv'
								});
						label = $('<label>').html(cfg.description);
						inlineDiv = $('<div>').attr({
									'class' : 'form-inline'
								});
						field = createEnrichMentField(cfg);
						if (cfg.enableDisable != null) {
							if (cfg.enableDisable == 'disable') {
								field.attr('disabled', true);
							} else if (cfg.enableDisable == 'enable') {
								field.attr('disabled', false);
							}
						}
						if (field) {
							label.attr('for', cfg.code);
							if (cfg.mandatory == true)
								label.addClass('required');
							label.appendTo(innerDiv);
							// $('<br/>').appendTo(div);
							if (cfg.enrichmentType === 'S') {
								if ('A' === cfg.includeInTotal
										|| 'S' === cfg.includeInTotal) {
									handleAmmountCalculationOnSingleSetEnrichment(
											field, cfg);
								}
								if (!isEmpty(cfg.apiName))
									handlePageRefreshOnSingleSetEnrichmentChange(
											field, cfg);
								/*
								 * else if (strLayoutType === 'TAXLAYOUT')
								 * handleAmmountCalculationOnSingleSetEnrichment(
								 * field, cfg);
								 */
							} else if (cfg.enrichmentType === 'M'
									&& !isEmpty(cfg.apiName))
								handlePageRefreshOnMultiSetEnrichmentChange(
										field, cfg, argsData);
							field.appendTo(inlineDiv);
							field.attr('class', 'form-control');
							field.attr('style', 'width:29%;margin-right:5px;');
							if (i + 1 < arrPrdEnr.length) {
								dependentFieldObj = arrPrdEnr[i + 1];
								if (dependentFieldObj) {
									var dependentField = createEnrichMentField(dependentFieldObj);
									if (dependentFieldObj.enableDisable != null) {
										if (dependentFieldObj.enableDisable == 'disable') {
											dependentField.attr('disabled',
													true);
										} else if (dependentFieldObj.enableDisable == 'enable') {
											dependentField.attr('disabled',
													false);
										}
									}
									dependentField
											.attr('class', 'form-control');
									dependentField.attr('style', 'width:68%');
									dependentField.appendTo(inlineDiv);
								}
							}
							inlineDiv.appendTo(innerDiv);
							innerDiv.appendTo(div);
							if (!isEmpty(cfg.sequenceNmbr)) {
								var seqno = cfg.sequenceNmbr;
								if (seqno % 2 != 0) {
									if (cfg.displayType === 9) // LONGTEXTBOX
									{
										div.addClass('col-sm-12');
										div.removeClass('col-sm-6');
									} else
										div.addClass(colCls);
									div
											.appendTo(tempObj['mainDiv'
													+ strSetName]);
									if (arrPrdEnr.length > 1) {
										enrField = arrPrdEnr[i + 1];
										enrFieldSeqNo = enrField
												? enrField.sequenceNmbr
												: 1; // 1 if index is 1;

										if (enrFieldSeqNo % 2 != 0) {
											if (cfg.displayType !== 9) // LONGTEXTBOX
												$('<div>')
														.attr({
																	'class' : colCls
																})
														.appendTo(tempObj['mainDiv'
																+ strSetName]);
										}
									} else {
										if (cfg.displayType !== 9) // LONGTEXTBOX
											$('<div>').attr({
														'class' : 'col-sm-12'
													})
													.appendTo(tempObj['mainDiv'
															+ strSetName]);
									}

								} else if (seqno % 2 == 0) {
									if (arrPrdEnr.length > 1) {
										enrField = arrPrdEnr[i - 1];
										enrFieldSeqNo = enrField
												? enrField.sequenceNmbr
												: 2; // 2 if index is 1
										if (enrFieldSeqNo % 2 == 0) {
											$('<div>').attr({
														'class' : colCls
													})
													.appendTo(tempObj['mainDiv'
															+ strSetName]);
										}

									} else {
										$('<div>').attr({
													'class' : colCls
												}).appendTo(tempObj['mainDiv'
												+ strSetName]);
									}

									div
											.appendTo(tempObj['mainDiv'
													+ strSetName]);
								}
							}
						}
					}
				}
				tempObj[strSetName + 'Counter'] = intCnt;
			}
		};
		$('<div>').attr({
					'class' : 'clear',
					'id' : 'clearDiv'
				}).appendTo(targetDiv);
	}
}

function paintPaymentEnrichmentsHelper(arrPrdEnr, intCounter, strTargetId,
		strPmtType, argsData, isMultiset) {
	var field = null, targetDiv = $('#' + strTargetId), label = null, div = null, wrappingDiv = null, intCnt = 1, sortArrPrdEnr, minCounter, maxCounter, arrLength;
	var colCls = (!isMultiset && (strLayoutType === 'WIRELAYOUT' || strLayoutType === 'WIRESIMPLELAYOUT')) ? 'col-sm-3' : 'col-sm-6';
	if (!isEmpty(intCounter))
		intCnt = intCounter;

	if (arrPrdEnr) {
		sortArrPrdEnr = generateSortArrPrdEnr(arrPrdEnr);
		arrLength = sortArrPrdEnr.length;
		minCounter = sortArrPrdEnr[0].sequenceNmbr;
		maxCounter = sortArrPrdEnr[arrLength - 1].sequenceNmbr;
		for (var i = minCounter; i <= maxCounter; i++) {
			var enrField = null;
			enrField = getEnrField(arrPrdEnr, i);
			if (!isEmpty(enrField) && enrField != null) {
				if (enrField.enrichmentType == 'S'
						|| enrField.enrichmentType == 'M') {
					wrappingDiv = $('<div>').attr({
								'class' : colCls + ' ',
								'id' : enrField.code + 'wrappDiv'
							});
					div = $('<div>').attr({
								'class' : 'form-group',
								'id' : enrField.code + 'Div'
							});
					// label = $('<label>').attr('class', 'fieldLabel');
					label = $('<label>').attr('class', 'payment-font-bold');

					label.text(enrField.description);
					field = createEnrichMentField(enrField);
					if (field) {
						label.attr('for', enrField.code);
						if (enrField.mandatory == true)
							label.addClass('required');
						label.appendTo(div);
						// $('<br/>').appendTo(div);
						// TODO : To be handled
						if (false) {
							if (enrField.enrichmentType === 'S'
									&& !isEmpty(enrField.apiName))
								handlePageRefreshOnSingleSetEnrichmentChange(
										field, enrField);
							else if (enrField.enrichmentType === 'M'
									&& !isEmpty(enrField.apiName))
								handlePageRefreshOnMultiSetEnrichmentChange(
										field, enrField, argsData)
						}
						field.addClass('form-control')
						if (enrField.displayType === 6)
							field
									.addClass('form-control ft-datepicker hasDatepicker')
						field.appendTo(div);
						div.appendTo(wrappingDiv);
						wrappingDiv.appendTo(targetDiv);
						intCnt++;
					}
				}
			} else {
				div = $('<div>').attr({
							'class' : colCls + ' emptyEnrichDiv'
						});
				div.appendTo(targetDiv);
				intCnt++;
			}
		}
	}
	return intCnt;
}
function createEnrichMentField(cfg) {
	var displayType = cfg.displayType;
	var field = null, value = null;
	if (isEmpty(displayType))
		displayType = 0;
	value = cfg.value;
	switch (displayType) {
		case 1 : // TEXTAREA
			field = createTextArea(cfg.code, cfg.code, value, false,
					cfg.maxLength, 3, 50);
			field.addClass('w14_8 ml12');
			break;
		case 2 : // AMOUNTBOX
			field = createAmountBox(cfg.code, cfg.code, value, false,
					cfg.maxLength);
			field.addClass('w14_8 ml12');
			break;
		case 3 : // NUMBERBOX
			field = createNumberBox(cfg.code, cfg.code, value, false,
					cfg.maxLength);
			field.addClass('w14_8 ml12');
			break;
		case 4 : // COMBOBOX
			value = value || cfg.defaultValue;
			field = createComboBox(cfg.code, cfg.code, value, false,
					cfg.lookupValues);
			field.addClass('w15_7 ml12');
			break;
		case 5 : // SELECTBOX
			break;
		case 6 : // DATEBOX
			var dateFormat = strApplicationDateFormat
					? strApplicationDateFormat
					: 'mm/dd/yyyy';
			field = createEnrichmentDateBox(cfg.code, cfg.code, value, true,
					cfg.maxLength, dateFormat);
			field.addClass('w14_8 ml12');
			break;
		case 7 : // TIMEBOX
			break;
		case 8 : // SEEKBOX
			// field = createSeekBox(cfg.code, cfg.code, null, cfg.maxLength,
			// 'services/recieverseek.json?&$top=-1', 'd.receivers',
			// 'receiverCode', 'receiverName');
			// field.addClass('w14 ml12');
			break;
		case 9 : // LONGTEXTBOX
			field = createTextBox(cfg.code, cfg.code, value, false,
					cfg.maxLength);
			field.addClass('w46 ml12');
			//field.ForceNoSpecialSymbol();
			break;
		case 0 : // TEXTBOX
		default :
			field = createTextBox(cfg.code, cfg.code, value, false,
					cfg.maxLength);
			field.addClass('w14_8 ml12');
			//field.ForceNoSpecialSymbol();
			break;
	}
	return field;
}

function handleEnrichFieldPopulation(cfg, fieldId) {
	var displayType = cfg.displayType, defValue = cfg.value;
	var field = null;
	if (isEmpty(displayType))
		displayType = 0;
	switch (displayType) {
		case 1 : // TEXTAREA
			break;
		case 2 : // AMOUNTBOX
			populateTextFieldValue(fieldId, defValue);
			break;
		case 3 : // NUMBERBOX
			populateTextFieldValue(fieldId, defValue);
			break;
		case 4 : // COMBOBOX
			break;
		case 5 : // SELECTBOX
			populateSelectFieldValue(fieldId, cfg.lookupValues, defValue);
			break;
		case 6 : // DATEBOX
			populateDateFieldValue(fieldId, defValue);
			break;
		case 7 : // TIMEBOX
			break;
		case 8 : // SEEKBOX
			populateSeekFieldValue(fieldId, defValue);
			break;
		case 0 : // TEXTBOX
			populateTextFieldValue(fieldId, defValue);
		default :
			populateTextFieldValue(fieldId, defValue);
			break;
	}
	return field;
}

/**
 * The generic function handleFieldPopulation used to handle the field value
 * population and editable/non-editable of the UI field based on the response
 * JSON.
 * 
 * @param {JSON}
 *            cfg The JSON node from response
 * 
 * @param {Stirng}
 *            fieldId The JSON node name of the field. Should be same on UI,
 *            only string postfix will appended based on single/multiple payment
 * 
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
 * The logic is as below : If readOnly is true/false in response JSON and
 * dataType is 'select' or 'checkBox' or 'radio' then the field's disabled
 * attribute will set to true/false If readOnly is true/false in response JSON
 * and dataType is 'text' or 'mask' or 'multiselect' or 'seek' or 'date' or
 * 'amount' then the field's readonly attribute will set to true/false
 * 
 */
function handleFieldPopulation(cfg, fieldId) {
	var dataType = cfg.dataType, defValue = cfg.value, blnReadOnly = cfg.readOnly;
	var field = $('#' + fieldId);	
	var isReadonly = (!isEmpty(blnReadOnly) && blnReadOnly == 'true')
			? true
			: false;

	if (dataType) {
		switch (dataType) {
			case 'text' :
				populateTextFieldValue(fieldId, defValue);
				break;
			case 'select' :
			case 'mask' :
				if (fieldId === 'lockFieldsMask')
					populateLockFieldValue(fieldId, cfg.availableValues,
							defValue);
				else if (fieldId === 'bankProduct' && charPaymentType === 'B') {
					populateSelectFieldValue(fieldId, cfg.availableValues,
							defValue, true);
				} else
					populateSelectFieldValue(fieldId, cfg.availableValues,
							defValue);
				if(fieldId=== 'txnCurrency')
				{
					toggleCurrencyLabel(cfg.value);					
				}
				break;
			case 'multiselect' :
				if (!isEmpty(strEntryType)
						&& strEntryType === 'TEMPLATE'
						&& (fieldId === 'accountNo'
								|| fieldId === 'templateRoles' || fieldId === 'templateUsers')) {
					populateMultiSelectFieldValue(fieldId, cfg.availableValues,
							cfg.values);
					if (fieldId === 'templateUsers')
						arrTemplateUsersInst = cfg.values || [];
				}
				break;
			case 'seek' :
				populateSeekFieldValue(fieldId, defValue);
				break;
			case 'date' :
				populateDateFieldValue(fieldId, defValue);
				break;
			case 'amount' :
				populateAmountFieldValue(fieldId, cfg.availableValues,
						defValue, cfg.txnCurrency, 'txnCurrency');
				//toggleCurrencyLabel(cfg.txnCurrency);
				break;
			case 'radio' :
				populateRadioFieldValue(fieldId, defValue);
				if (fieldId === 'drCrFlag') {
					if (strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT') {
						toggleAccountLabel(null, defValue);
					}
					if ((defValue === 'C' || defValue === 'D')
							&& charPaymentType === 'B') {
						// $('#drCrFlagDiv').addClass('hidden');
						$('#drCrFlagD, #drCrFlagC').attr("checked", false);
						populateRadioFieldValue(fieldId, defValue);
						// $('#drCrFlagD, #drCrFlagC').attr('disabled', true);
					} else if ((defValue === 'C' || defValue === 'D')
							&& charPaymentType === 'Q') {
						$('#drCrFlagD, #drCrFlagC').attr("checked", false);
						populateRadioFieldValue(fieldId, defValue);
					} else if (defValue === 'B') {
						$('#drCrFlagD').attr("checked", false);
						$('#drCrFlagC').attr("checked", true);
						if (strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT') {
							toggleAccountLabel(null, 'C');
						}
					}
				} else if (fieldId === 'templateType') {
					$('input:radio[name="templateType"]').attr('disabled',
							isReadonly);
				}
				if (!isEmpty(cfg.value)) {
					var fldRadio = $("input[name='" + fieldId + "'][value='"
							+ cfg.value + "']");
					if (fldRadio && fldRadio.length != 0
							&& !isEmpty(blnReadOnly) && blnReadOnly == 'true'
							&& !isEmpty(cfg.value)) {
						fldRadio.attr("disabled", true);
						fldRadio.val(cfg.value);
					}
				}
				break;
			case 'checkBox' :
				populateCheckBoxFieldValue(fieldId, defValue);
				if (field && field.length != 0) {
					if (defValue === 'Y') {
						field.attr('checked', true);
					} else {
						field.attr('checked', false);
					}
					if (isReadonly === true)
						field.attr('disabled', true);
				}
				var fldCheckbox = $('input[name="' + fieldId + '"]:checkbox');
				if (fldCheckbox && fldCheckbox.length != 0
						&& !isEmpty(blnReadOnly) && blnReadOnly == 'true'
						&& !isEmpty(cfg.value)) {
					fldCheckbox.attr("disabled", true);
					fldCheckbox.val(cfg.value);
				}
				break;
		}
	}
	if(fieldId === 'beneficiaryBankIDCode')
	{	
		$('#beneficiaryBankIDCodeAutoCompleter').val(cfg.value);
	}
	
	if (field && field.length != 0 && !isEmpty(blnReadOnly)
			&& blnReadOnly == 'true' ) {
		if (dataType === 'select' ) {
			field.attr("disabled", "disabled");
			field.attr('readonly', 'readonly');
			field.addClass('disabled');
			field.val(cfg.value);
		} else {
			if (fieldId === 'beneficiaryBankIDCode') {
				$('#beneficiaryBankIDCodeAutoCompleter').attr({
							'readonly' : 'readonly'
						}, {
							"disabled" : "disabled"
						});
			}
			field.attr('readonly', 'readonly');
			//field.attr("disabled", "disabled");
			field.val(cfg.value);
		}
	}
	else{
		if (fieldId !== 'product' && fieldId !== 'purposeCodeDes' && fieldId !== 'productDescription')
		{
			field.attr('readonly', false);
			field.attr("disabled", false);
			if(fieldId === 'beneficiaryBankIDCode')
				$('#beneficiaryBankIDCodeAutoCompleter').attr('readonly', false);
				
		}
	}
}
function handleAmmountCalculationOnSingleSetEnrichment(field, cfg) {
	var displayType = cfg.displayType;
	var strEventName = 'focusout';
	if (isEmpty(displayType))
		displayType = 0;
	strEventName = getEnrichFieldEventName(displayType);
	if (!isEmpty(strEventName))
		field.on(strEventName, function() {
					doHandleAmountSummation();
				});
}
function handlePageRefreshOnSingleSetEnrichmentChange(field, cfg) {
	var displayType = cfg.displayType;
	var strApiName = cfg.apiName;
	var strEventName = '';
	var copyFlag = "copy";
	var checkDigitVal = "ChkDigitVal";
	if (isEmpty(displayType))
		displayType = 0;
	if (!isEmpty(strApiName)
			&& (strApiName.substr(0, copyFlag.length) != copyFlag)
			&& (strApiName != checkDigitVal)) {
		strEventName = getEnrichFieldEventName(displayType);
		if (!isEmpty(strEventName))
			field.on(strEventName, function() {
						if (strLayoutType === 'TAXLAYOUT')
							doHandleAmountSummation();
						if (charPaymentType === 'Q')
							doHandelRefreshBatchInstrumentFieldsOnEnrichChange(
									$(this), null, null, null, charPaymentType);
						else if (charPaymentType === 'B') {
							// doHandelRefreshPaymentFieldsOnEnrichChange($(this));
							doHandelRefreshBatchInstrumentFieldsOnEnrichChange(
									$(this), null, null, null, charPaymentType);
						}
					});
	}

}

function handlePageRefreshOnMultiSetEnrichmentChange(field, cfg, argsData) {
	var displayType = cfg.displayType;
	var strApiName = cfg.apiName;
	var strEventName = '';
	var copyFlag = "copy";
	var checkDigitVal = "ChkDigitVal";
	if (isEmpty(displayType))
		displayType = 0;
	if (!isEmpty(strApiName)
			&& (strApiName.substr(0, copyFlag.length) != copyFlag)
			&& (strApiName != checkDigitVal)) {
		strEventName = getEnrichFieldEventName(displayType);
		if (!isEmpty(strEventName))
			field.on(strEventName, function() {
						if (strLayoutType === 'TAXLAYOUT')
							doHandleAmountSummation();
						if (charPaymentType === 'Q')
							doHandelRefreshBatchInstrumentFieldsOnEnrichChange(
									$(this), null, null, null, charPaymentType);
						else if (charPaymentType === 'B') {
							// doHandelRefreshPaymentFieldsOnEnrichChange($(this));
							doHandelRefreshBatchInstrumentFieldsOnEnrichChange(
									$(this), null, null, null, charPaymentType);
						}
					});
	}

}

function doHandelRefreshBatchInstrumentFieldsOnEnrichChange(obj, strEnrichType,
		fnPointer, argsData, charPaymentType) {
	refreshBatchInstrumentFieldsOnEnrichChange(obj, strEnrichType, fnPointer,
			argsData, charPaymentType);
}
function refreshBatchInstrumentFieldsOnEnrichChange(obj, strEnrichType,
		fnPointer, argsData, charPaymentType) {
	if (!isEmpty(obj)) {
		var enrichId = obj.attr('id');
		var enrichValue = obj.attr('value');
		var addendOffset = $(window).scrollTop();
		var strEnriTyp = (!isEmpty(argsData) && !isEmpty(argsData.strEnrichType))
				? argsData.strEnrichType
				: '';
		var url = _mapUrl['refreshEnrichmentsUrl'];
		if (!isEmpty(strPaymentInstrumentIde))
			url = url + "/(" + strPaymentInstrumentIde + ")";
		url += '/' + enrichId;
		url += '/' + enrichValue + '.json';
		var jsonObj = generatePaymentInstrumentJson();
		if (jsonObj.d && jsonObj.d.__metadata && strPaymentInstrumentIde) {
			jsonObj.d.__metadata._detailId = strPaymentInstrumentIde;
		}
		if (charPaymentType == 'B' && jsonObj.d && jsonObj.d.__metadata
				&& strPaymentHeaderIde) {
			jsonObj.d.__metadata._headerId = strPaymentHeaderIde;
		}
		jsonObj.d.__metadata._pirMode = strEntryType;

		if (strEnrichType === 'M') {
			var obj = generateJsonForDepenentField(argsData);
			if (!isEmpty(strEnriTyp) && strEnriTyp === 'BANKPRDMSE') {
				if (jsonObj.d
						&& jsonObj.d.receivableEntry
						&& jsonObj.d.receivableEntry.enrichments
						&& jsonObj.d.receivableEntry.enrichments.bankProductMultiSet)
					jsonObj.d.receivableEntry.enrichments['bankProductMultiSet'] = obj;
			} else if (!isEmpty(strEnriTyp) && strEnriTyp === 'CLIPRDMSE') {
				if (jsonObj.d && jsonObj.d.receivableEntry
						&& jsonObj.d.receivableEntry.enrichments
						&& jsonObj.d.receivableEntry.enrichments.clientMultiSet)
					jsonObj.d.receivableEntry.enrichments['clientMultiSet'] = obj;
			} else if (!isEmpty(strEnriTyp) && strEnriTyp === 'MYPPRDMSE') {
				if (jsonObj.d && jsonObj.d.receivableEntry
						&& jsonObj.d.receivableEntry.enrichments
						&& jsonObj.d.receivableEntry.enrichments.myProductMultiSet)
					jsonObj.d.receivableEntry.enrichments['myProductMultiSet'] = obj;
			}
		}
		// blockPaymentUI(true);
		$.ajax({
			type : "POST",
			url : url,
			async : false,
			contentType : "application/json",
			data : JSON.stringify(jsonObj),
			complete : function(XMLHttpRequest, textStatus) {
				if ("error" == textStatus) {
					// TODO : Error handling to be done.
					// alert("Unable to complete your request!");
				}
			},
			success : function(data) {
				if (data.d
						&& data.d.message
						&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
					paintErrors(data.d.message.errors);
					blockPaymentInstrumentUI(false);

				} else if (data != null) {
					if (data.d
							&& data.d.message
							&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
						paintErrors(data.d.message.errors);
						blockPaymentInstrumentUI(false);

					} else {
						if (!isEmpty(strEnrichType) && strEnrichType === 'M') {
							paymentResponseInstrumentData = data;
							// This will call the repaint enrich popup function
							// i.e paymentInitiationMultiSetEnrichments.js >
							// refreshMultiSetEnrichmentPopUp
							if (!isEmpty(fnPointer)
									&& typeof fnPointer === 'function') {
								fnPointer(data, argsData);
							}
							blockPaymentInstrumentUI(false);
						} else {
							paymentResponseInstrumentData = data;
							paintReceivableInstrumentUI(data, 'Q');
							initateValidation();
							blockPaymentInstrumentUI(false);
							handleEmptyEnrichmentDivs();
						}
					}
				}
			}
		});
		$('#'+enrichId).focus();
		$(document).scrollTop(addendOffset);
	}
}
function getEnrichFieldEventName(strDisplayType) {
	var strEventName = null
	switch (strDisplayType) {
		case 1 : // TEXTAREA
			strEventName = 'blur';
			break;
		case 2 : // AMOUNTBOX
			strEventName = 'blur';
			break;
		case 3 : // NUMBERBOX
			strEventName = 'blur';
			break;
		case 4 : // COMBOBOX
			strEventName = 'change';
			break;
		case 5 : // SELECTBOX
			break;
		case 6 : // DATEBOX
			strEventName = 'blur';
			break;
		case 7 : // TIMEBOX
			break;
		case 8 : // SEEKBOX
			break;
		case 0 : // TEXTBOX
		default :
			strEventName = 'blur';
			break;
	}
	return strEventName;
}
function postHandleClientEnrichments() {
	var data = paymentResponseInstrumentData;
	var displaySequenceNo = null;
	var parentCode = null;
	if (data && data.d && data.d.receivableEntry
			&& data.d.receivableEntry.enrichments
			&& data.d.receivableEntry.enrichments.clientEnrichment
			&& data.d.receivableEntry.enrichments.clientEnrichment.parameters) {
		var param = data.d.receivableEntry.enrichments.clientEnrichment.parameters;
		$.each(param, function(index, cfg) {
			if (cfg.amountType == 'AmtTypeNone') {
				$('#' + cfg.code).on('change',
						function(field, newValue, oldValue) {
							var code = $('#' + this.id).data('nextEnrichment');
							if (null != this.value && this.value != ''
									&& this.value != 'NONE') {
								$('#' + code).attr('disabled', false);
							} else {
								$('#' + code).attr('disabled', true);
								$('#' + code).val('');
							}
						});
				displaySequenceNo = (cfg.sequenceNmbr + 1);
				parentCode = cfg.code;
				if (null != displaySequenceNo
						&& cfg.sequenceNmbr == displaySequenceNo) {
					$('#' + parentCode).data('nextEnrichment', cfg.code);
					$('#' + cfg.code).attr('disabled', true);
					displaySequenceNo = null;
					parentCode = null;
				}
			} else if (cfg.amountType == 'AmtTypeDiscount') {
				if (cfg.mandatory) {
					$('#' + cfg.code).on('change',
							function(field, newValue, oldValue) {
								doHandleAmountSummation();
							});
				} else if (!cfg.mandatory) {
					$('#' + cfg.code).on('change',
							function(field, newValue, oldValue) {
								var code = $('#' + this.id)
										.data('nextEnrichment');
								if (null != this.value && this.value != ''
										&& this.value != 'NONE') {
									$('#' + code).attr('disabled', false);
									doHandleAmountSummation();
								} else {
									$('#' + code).attr('disabled', true);
									$('#' + code).val('');
									doHandleAmountSummation();
								}
							});
					displaySequenceNo = (cfg.sequenceNmbr + 1);
					parentCode = cfg.code;

				}
			}
			if (null != displaySequenceNo
					&& cfg.sequenceNmbr == displaySequenceNo) {
				$('#' + parentCode).data('nextEnrichment', cfg.code);
				if ('' == cfg.value || null == cfg.value || 'NONE' == cfg.value) {
					$('#' + cfg.code).attr('disabled', true);
				} else {
					$('#' + cfg.code).attr('disabled', false);
				}
				displaySequenceNo = null;
				parentCode = null;
				parentValue = null;
			}
		});
	}
}

function createAdditionalInfoField(cfg) {
	var displayType = cfg.dataType;
	var field = null;
	if (isEmpty(displayType))
		displayType = 'text';
	switch (displayType) {
		case 'amount' : // AMOUNTBOX
			field = createAmountBox(cfg.fieldName, cfg.fieldName, null, false,
					cfg.maxLength);
			field.addClass('w14_8 ml12');
			break;
		case 'select' : // COMBOBOX
			field = createComboBox(cfg.fieldName, cfg.fieldName, null, false,
					cfg.availableValues, cfg.mandatory);
			field.addClass('w15_7 ml12');
			break;
		case 'radio' : // RADIO
			break;
		case 'date' : // DATEBOX
			var dateFormat = strApplicationDateFormat
					? strApplicationDateFormat
					: 'mm/dd/yyyy';
			field = createDateBox(cfg.fieldName, cfg.fieldName, null, true,
					cfg.maxLength, dateFormat);
			field.addClass('w14_8 ml12');
			break;
		case 'seek' : // SEEKBOX
			field = createSeekBox(cfg.code, cfg.code, null, cfg.maxLength,
					'services/' + seekId + '.json?&$top=-1', '', 'code',
					'description');
			field.addClass('w14 ml12');
			break;
		case 'text' : // TEXTBOX
		default :
			field = createTextBox(cfg.fieldName, cfg.fieldName, null, false,
					cfg.maxLength);
			field.addClass('w14_8 ml12');
			break;
	}
	return field;
}
function isDebitCcyAmountValid() {
	if (strLayoutType
			&& (strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT'
					|| strLayoutType === 'WIRELAYOUT' || strLayoutType === 'WIRESIMPLELAYOUT' || strLayoutType === 'CHECKSLAYOUT' || strLayoutType === 'MIXEDLAYOUT')) {
		var strAmntCcyType = $('input[name=debitPaymentAmntFlag]:checked')
				.val();
		var data = paymentResponseInstrumentData;
		if ((strAmntCcyType && strAmntCcyType === 'D') && data && data.d
				&& data.d.receivableEntry && data.d.receivableEntry.receivableHeaderInfo
				&& data.d.receivableEntry.receivableHeaderInfo.crossCcy
				&& data.d.receivableEntry.receivableHeaderInfo.crossCcy === 'Y') {
			return true;
		} else
			return false;
	} else
		return false;
}
function paintDebitCcyAmount(cfgAmount, cfgDebitCcyAmount,
		chrDebitPaymentAmntFlag, strPostFix) {
	var strFieldName = 'amount', strFormattedValue = '';
	if (chrDebitPaymentAmntFlag == 'D') {
		strFormattedValue = cfgDebitCcyAmount.formattedValue
				? cfgDebitCcyAmount.formattedValue
				: cfgDebitCcyAmount.value;
	} else {
		strFormattedValue = cfgAmount.formattedValue
				? cfgAmount.formattedValue
				: cfgAmount.value;
	}
	$('.' + strFieldName + strPostFix).text(strFormattedValue);
}
function generateReceivableInstrumentJson() {
	var jsonPost = {}, jsonArrStdFields = [], data = cloneObject(paymentResponseInstrumentData), field = null, canAdd = false, objVal = null, blnAutoNumeric = true;
	var arrFields = [];
	var isCcyMismatch = isCurrencyMissMatch(), blnForexAtInstLevel = isForexAtInstrumentLevel();
	var arrRegisteredReceiverFields = [], arrAdhocReceiverFields = [], jsonArrRegisteredReceiverFields = [], jsonArrAdhocReceiverFields = [];
	var beneType = strReceiverType && strReceiverType === 'A' ? 'A' : 'R';
	if (data) {
		jsonPost.d = {};
		jsonPost.d.receivableEntry = {};
		jsonPost.d.__metadata = {
			_myproduct : data.d.__metadata._myproduct
		};
		if (data && data.d && data.d.receivableEntry) {
			jsonPost.d.receivableEntry.paymentCompanyInfo = data.d.receivableEntry.paymentCompanyInfo
					|| {};
			jsonPost.d.receivableEntry.receivableHeaderInfo = data.d.receivableEntry.receivableHeaderInfo
					|| {};
			if (data.d.receivableEntry.standardField)
				arrFields = cloneObject(data.d.receivableEntry.standardField);
			// ============= Standard Field Node population =============
			$.each(arrFields, function(index, cfg) {
				canAdd = true;
				if (cfg.dataType === 'radio') {
					// if (cfg.fieldName === 'drCrFlag')
					// field = $('input[name=' + cfg.fieldName + ']:checkbox');
					// else
					field = $('input[name=' + cfg.fieldName + ']:radio');
				} else
					field = $('#' + cfg.fieldName);

				if (field && field.length != 0) {
					if ((cfg.fieldName === 'rateType' || (cfg.fieldName === "contractRefNo" && $('#rateType')
							.val() == '1'))) {
						canAdd = (isCcyMismatch && blnForexAtInstLevel)
								? true
								: false;
					}
					else if ((cfg.fieldName === 'fxRate' || ($('#rateType')
							.val() == '3'))) {
						canAdd = (isCcyMismatch && blnForexAtInstLevel)
								? true
								: false;
					} else if (cfg.fieldName === 'amount') {
						canAdd = true;
						//NOTE : txnCurrency node to be used from standarField instead of amount.txnCurrency node
						/*jsonArrStdFields.push({
									fieldName : 'txnCurrency',
									value : $('#txnCurrency').val()
								});*/

					} else if (cfg.displayMode === '1')
						canAdd = false;

					if (canAdd) {
						objVal = null;
						if (cfg.dataType === 'radio') {
							if (cfg.fieldName === 'drCrFlag') {
								var isCrChecked = $('#drCrFlagC')
										.is(':checked');
								var isDrChecked = $('#drCrFlagD')
										.is(':checked');
								if (isCrChecked && isDrChecked)
									objVal = 'B';
								else if (isCrChecked)
									objVal = 'C';
								else if (isDrChecked)
									objVal = 'D';
							} else
								objVal = $('input[name=' + cfg.fieldName
										+ ']:radio:checked').val();
						} else if (cfg.dataType === 'checkBox') {
							objVal = 'N';
							var c = $('input[name=' + cfg.fieldName + ']')
									.is(':checked');
							if (c) {
								objVal = field.val();
							}
						} else {
							objVal = field.val();
						}
						/**
						 * The bbelow code block will be used for single payment
						 * template entry. Comment to be removed.
						 */
						if (cfg.fieldName === 'lockFieldsMask') {
							var arrObj = generateSortAvalValArray(cfg.availableValues);
							$('#lockFieldsMask option').attr('disabled', false);
							objVal = generateControFiledMask(arrObj, field
											.val());
							doDisableDefaultLockFields('Q');
						}
						if (strEntryType === 'TEMPLATE') {
							if (cfg.fieldName === 'accountNo') {
								var strTempType = $('input[name="templateType"]:radio:checked')
										.val();
								if (strTempType === '1') {
									jsonField = cloneObject(cfg);
									jsonField.values = $('#accountNo').val();
									jsonField.value = "";
									jsonField.dataType = 'multiselect';
									jsonArrStdFields.push(jsonField);
								} else {
									jsonField = cloneObject(cfg);
									jsonField.value = $('#accountNo').val();
									jsonField.values = [];
									jsonField.dataType = 'select';
									jsonArrStdFields.push(jsonField);
								}

							} else if ((cfg.fieldName === 'templateRoles'
									|| cfg.fieldName === 'templateUsers') && charPaymentType === 'Q') {
								jsonField = cloneObject(cfg);
								jsonField.values = $('#' + cfg.fieldName).val()
										|| [];
								jsonArrStdFields.push(jsonField);
							} else if (cfg.fieldName === 'amount'
									&& !isDebitCcyAmountValid()) {
								jsonField = cloneObject(cfg);
								// jquery autoNumeric formatting
								blnAutoNumeric = isAutoNumericApplied(cfg.fieldName);
								if (blnAutoNumeric)
									objVal = $("#amount").autoNumeric('get');
								else
									objVal = $("#amount").val();
								// jquery autoNumeric formatting
								jsonField.value = objVal;
								jsonArrStdFields.push(jsonField);
							}

							/*
							 * Commented for FTGCPBDB-4445 else if
							 * (cfg.fieldName == 'holdUntilFlag') { var
							 * isHoldChecked = $('#holdUntilFlag')
							 * .is(':checked'); if (isHoldChecked) {
							 * jsonArrStdFields.push({ fieldName :
							 * cfg.fieldName, value : 'Y' }); } }
							 */
							else {
								jsonField = cloneObject(cfg);
								jsonField.value = objVal;
								jsonArrStdFields.push(jsonField);
							}
						} else if (cfg.fieldName === 'amount'
								&& !isDebitCcyAmountValid()) {
							jsonField = cloneObject(cfg);
							// jquery autoNumeric formatting
							blnAutoNumeric = isAutoNumericApplied(cfg.fieldName);
								if (blnAutoNumeric)
									objVal = $("#amount").autoNumeric('get');
								else
									objVal = $("#amount").val();
							// jquery autoNumeric formatting
							jsonField.value = objVal;
							jsonArrStdFields.push(jsonField);
						} else {
							jsonField = cloneObject(cfg);
							jsonField.value = objVal;
							jsonArrStdFields.push(jsonField);
						}
					}
				}

					/*
				 * if (strEntryType === 'PAYMENT' || strEntryType === 'SI') {
				 * jsonPost.d.receivableEntry.multipartFile =
				 * document.getElementById('paymentImageFile').files[0]; }
				 */

			});
			jsonPost.d.receivableEntry.standardField = jsonArrStdFields;
			// ============= Beneficiary Node population =============
			if (data.d.receivableEntry.beneficiary) {
				jsonPost.d.receivableEntry.beneficiary = {};
				if (data.d.receivableEntry.beneficiary.registeredBene) {
					arrRegisteredReceiverFields = data.d.receivableEntry.beneficiary.registeredBene
							? data.d.receivableEntry.beneficiary.registeredBene
							: [];
					jsonArrRegisteredReceiverFields = getRegisteredReceiverFieldJsonArray(arrRegisteredReceiverFields);
					jsonPost.d.receivableEntry.beneficiary.registeredBene = jsonArrRegisteredReceiverFields;
				}

				if (data.d.receivableEntry.beneficiary.adhocBene) {
					arrAdhocReceiverFields = data.d.receivableEntry.beneficiary.adhocBene
							? data.d.receivableEntry.beneficiary.adhocBene
							: [];
					jsonArrAdhocReceiverFields = getAdhocReceiverFieldJsonArray(arrAdhocReceiverFields);
					jsonPost.d.receivableEntry.beneficiary.adhocBene = jsonArrAdhocReceiverFields;
				}

				if (beneType === 'R') {
					jsonPost.d.receivableEntry.beneficiary.drawerRegistedFlag = 'R';
				} else {
					jsonPost.d.receivableEntry.beneficiary.drawerRegistedFlag = 'A';
				}
			}
			// ============= Additional Info Node population =============
			if (data.d.receivableEntry.additionalInfo) {
				arrFields = [];
				jsonPost.d.receivableEntry.additionalInfo = {};
				$.each(data.d.receivableEntry.additionalInfo,
						function(key, value) {
							if (key === 'additionalReferenceInfo'
									|| key === 'bankToBankInfo') {
								if (data.d.receivableEntry.additionalInfo[key]) {
									arrFields = data.d.receivableEntry.additionalInfo[key];
									jsonPost.d.receivableEntry.additionalInfo[key] = getFieldJsonArray(arrFields);
								}
							}
							if (key === 'orderingParty') {
								arrFields = [];
								var orderingPartyType = strOrderingPartyType
										&& strOrderingPartyType === 'A'
										? 'A'
										: 'R';
								jsonPost.d.receivableEntry.additionalInfo.orderingParty = {};
								if (data.d.receivableEntry.additionalInfo.orderingParty.registeredOrderingParty) {
									arrFields = data.d.receivableEntry.additionalInfo.orderingParty.registeredOrderingParty;
									jsonPost.d.receivableEntry.additionalInfo.orderingParty.registeredOrderingParty = getFieldJsonArray(arrFields);
								}
								if (data.d.receivableEntry.additionalInfo.orderingParty.adhocOrderingParty) {
									arrFields = data.d.receivableEntry.additionalInfo.orderingParty.adhocOrderingParty
											? data.d.receivableEntry.additionalInfo.orderingParty.adhocOrderingParty
											: [];
									jsonPost.d.receivableEntry.additionalInfo.orderingParty.adhocOrderingParty = getAdhocOrderingPartyFieldJsonArray(arrFields);
								}
								jsonPost.d.receivableEntry.additionalInfo.orderingParty.orderingPartyRegisteredFlag = orderingPartyType;
							}
						});
			}

			// ============= Enrichment Info Node population =============
			if (data.d.receivableEntry.enrichments) {
				jsonPost.d.receivableEntry.enrichments = {};
				$.each(data.d.receivableEntry.enrichments, function(key, value) {
					if ((key === 'udeEnrichment' || key === 'productEnrichment'
							|| key === 'myproductEnrichment'
							|| key === 'clientEnrichment'
							|| key === 'productEnrichmentStdFields'
							|| key === 'myproductEnrichmentStdFields'
							|| key === 'clientEnrichmentStdFields' || key === 'udeEnrichmentStdFields')
							&& value.parameters) {
						arrFields = cloneObject(value.parameters);
						jsonPost.d.receivableEntry.enrichments[key] = {
							parameters : getEnrichFieldJsonArray(arrFields)
						};
					}
					if (key === 'myProductMultiSet')
						jsonPost.d.receivableEntry.enrichments[key] = getMyProductMultiSetEnrichmentJsonArray();
					if (key === 'myProductMultiSetMetadata')
						jsonPost.d.receivableEntry.enrichments[key] = getMyProductMultiSetEnrichmentJsonArrayMetaData();
					if (key === 'bankProductMultiSet')
						jsonPost.d.receivableEntry.enrichments[key] = getBankProductMultiSetEnrichmentJsonArray();
					if (key === 'bankProductMultiSetMetadata')
						jsonPost.d.receivableEntry.enrichments[key] = getBankProductMultiSetEnrichmentJsonArrayForMetaData();
					if (key === 'clientMultiSet')
						jsonPost.d.receivableEntry.enrichments[key] = getClientProductMultiSetEnrichmentJsonArray();
					if (key === 'clientMultiSetMetadata')
						jsonPost.d.receivableEntry.enrichments[key] = getClientProductMultiSetEnrichmentJsonArrayForMetaData();
				});

			}
		}
	}
	return jsonPost;
}
function getFieldJsonArray(arrFields) {
	var field = null, canAdd = false, fieldName = null;
	var arrRet = new Array();
	if (arrFields && arrFields.length > 0) {
		var arrItems = cloneObject(arrFields);
		$.each(arrItems, function(index, cfg) {
					canAdd = true;
					fieldName = cfg.fieldName || cfg.code;
					field = $('#' + fieldName);
					if (field && field.length != 0) {
						if (cfg.displayMode === '1')
							canAdd = false;

						if (canAdd && !isEmpty(cfg.code)) {
							cfg.value = field.val()
							arrRet.push(cfg);
						} else if (canAdd) {
							cfg.value = field.val()
							arrRet.push(cfg);
						}
					}
				});
	}
	return arrRet;

}
function getRegisteredReceiverFieldJsonArray(arrFields) {
	var field = null, canAdd = false, fieldName = null;
	var arrRet = new Array();
	if (arrFields && arrFields.length > 0) {
		var arrItems = cloneObject(arrFields);
		$.each(arrItems, function(index, cfg) {
					canAdd = true;
					fieldName = cfg.fieldName || cfg.code;
					field = $('#' + fieldName + 'R');
					if (field && field.length != 0) {
						if (cfg.displayMode === '1')
							canAdd = false;
						if (canAdd) {
							cfg.value = field.val()
							arrRet.push(cfg);
						}
					}
				});
	}
	return arrRet;
}

function getAdhocReceiverFieldJsonArray(arrFields) {
	var field = null, canAdd = false, fieldName = null;
	var arrRet = new Array();
	if (arrFields && arrFields.length > 0) {
		var arrItems = cloneObject(arrFields);
		$.each(arrItems, function(index, cfg) {
					canAdd = true;
					fieldName = cfg.fieldName || cfg.code;
					field = $('#' + fieldName + 'A');
					if (field && field.length != 0) {
						if (cfg.displayMode === '1')
							canAdd = false;

						if (canAdd && !isEmpty(cfg.code)) {
							cfg.value = field.val();
							arrRet.push(cfg);
						} /*else if(canAdd && fieldName ==='draweePayDetail'){
						 	cfg.value =getTagFieldLine1Value(cfg,'draweePayDetailTag57TypeD','draweePayDetailA','tag57Type');
						 	arrRet.push(cfg);
						}  else if(canAdd && fieldName ==='corrBankDetails1'){
						 	cfg.value =getTagFieldLine1Value(cfg,'corrBankDetails1ATtag54TypeD','corrBankDetails1A','tag54Type');
						 	arrRet.push(cfg);
						}  else if(canAdd && fieldName ==='intBankDetails1'){
						 	cfg.value =getTagFieldLine1Value(cfg,'intBankDetails1ATag56TypeD','intBankDetails1A','tag56Type');
						 	arrRet.push(cfg);
						}  */else if (canAdd) {
							cfg.value = field.val();
							arrRet.push(cfg);
						}
					}
				});
	}
	return arrRet;

}
function getTagFieldLine1Value(cfg,textFieldId,selectFieldId,tagType){
	var strRetValue = '',strTag57Val = $('input[name="'+tagType+'A"]:radio:checked').val();
	
	strTag57Val = strTag57Val ? strTag57Val : 'A';
	if(strTag57Val=='A')
		strRetValue = $('#'+selectFieldId).val();
	else if(strTag57Val=='D')
		strRetValue = $('#'+textFieldId).val();
	return 	strRetValue;
}
function getAdhocOrderingPartyFieldJsonArray(arrFields) {
	var field = null, canAdd = false, fieldName = null;
	var arrRet = new Array();
	if (arrFields && arrFields.length > 0) {
		var arrItems = cloneObject(arrFields);
		$.each(arrItems, function(index, cfg) {
					canAdd = true;
					fieldName = cfg.fieldName || cfg.code;
					field = $('#' + fieldName + '_OA');
					if (field && field.length != 0) {
						if (cfg.displayMode === '1')
							canAdd = false;

						if (canAdd && !isEmpty(cfg.code)) {
							cfg.value = field.val()
							arrRet.push(cfg);
						} else if (canAdd) {
							cfg.value = field.val()
							arrRet.push(cfg);
						}
					}
				});
	}
	return arrRet;

}
function getEnrichFieldJsonArray(arrFields) {
	var field = null, canAdd = false, fieldName = null;
	var arrRet = new Array();
	if (arrFields && arrFields.length > 0)
		$.each(arrFields, function(index, cfg) {
					canAdd = true;
					fieldName = cfg.fieldName || cfg.code;
					field = $('#' + fieldName);
					if (field && field.length != 0) {
						if (cfg.displayMode === '1')
							canAdd = false;
						if (canAdd) {
							cfg.value = field.val();
							cfg.string = field.val();
							arrRet.push(cfg);
						}

					}
				});
	return arrRet;
}
/*---------- Helper Function Starts --------------------*/
// FTGCPBDB-4321 : To be removed Contract Rate on Template
function handleContractRateInTemplate(data, strPmtType) {
	var arrFields = [];
	if (data) {
		arrFields = data;
		if (arrFields && arrFields.length > 0) {
			$.each(arrFields, function(index, cfg) {
						if (cfg.fieldName === 'rateType') {
							var arrAvailableValues = cfg.availableValues;
							var indexContractRate = null;
							if (arrAvailableValues
									&& arrAvailableValues.length > 0) {
								$.each(arrAvailableValues,
										function(index, item) {
											if ('1' === item.code)
												indexContractRate = item.code;
										});
								arrAvailableValues.splice($.inArray(
												indexContractRate,
												arrAvailableValues), 1);
							}
							if (strPmtType === 'Q') {
								$('#rateType1').parent().remove();
							}
						}
					});
		}
	}
}
function toggleAmountLabel(strAmountType) {
	var clsHide = 'hidden';
	if (strAmountType === 'P') {
		$('#thresholdAmountLabel').removeClass(clsHide);
		$('#amountLabel').addClass(clsHide);
	} else {
		$('#thresholdAmountLabel').addClass(clsHide);
		$('#amountLabel').removeClass(clsHide);
	}
}

function toggleAccountLabel(cntrl, crDrFlag, isViewOnly) {
	var clsHide = 'hidden';
	var isCrChecked = $('#drCrFlagC').is(':checked');
	var isDrChecked = $('#drCrFlagD').is(':checked');
	if (crDrFlag === 'B' || (isCrChecked && isDrChecked) && !isViewOnly) {
		$('#accountNo_credit').addClass(clsHide);
		$('#accountNo_debit').removeClass(clsHide);

		$('#receivingaccountNo_credit').addClass(clsHide);
		$('#receivingaccountNo_debit').removeClass(clsHide);

	} else if (crDrFlag === 'C' && !isDrChecked && !isViewOnly) {
		$(".accountcreditLbl").removeClass(clsHide);//rvcng accnt
		$(".accountdebitLbl").addClass(clsHide);

	} else if (crDrFlag === 'D' && !isCrChecked && !isViewOnly) {
		$(".accountcreditLbl").addClass(clsHide);//rvcng accnt
		$(".accountdebitLbl").removeClass(clsHide);
	} else if (isViewOnly) {
		if (crDrFlag === 'C') {
			$(".accountcreditLbl").removeClass(clsHide);//rvcng accnt
			$(".accountdebitLbl").addClass(clsHide);
		} else if (crDrFlag === 'D') {
			$(".accountcreditLbl,.accountcreditHdrLbl").addClass(clsHide);//rvcng accnt
			$(".accountdebitLbl,.accountdebitHdrLbl").removeClass(clsHide);
		}
	}
}
function toggleAdvancedSettingVerifyScreen() {
	$("#advancedSettingVerifyScreePopup").toggleClass('hidden');
}
function handleTemplateTypeChangeQ(strTemplateType) {
	handleTemplateTypeChange(strTemplateType, 'Q');
	applyControlFieldsValidation();
}
function applyControlFieldsValidation(strPayType,blnIsPrenoteChecked) {
	var data = paymentResponseInstrumentData, arrJSON = null, field = null, label = null;
	var mapCtrlFields = {}, key = '', isSelected = false;
	var strPostFix = strPaymentType && "BATCHPAY" === strPaymentType ? 'Hdr' : '';
	var arrSelected = $('#lockFieldsMask' + strPostFix).multiselect("getChecked") || [];
	var arrValues = [];
	$.each(arrSelected, function(index, item) {
				arrValues.push(item.value);
			});
	if ($('#lockFieldsMask'+strPostFix).has('option').length > 0) {
		$('#lockFieldsMask'+ strPostFix + ' option').each(function() {
					key = $(this).attr('value');
					isSelected = jQuery.inArray(key, arrValues) != -1
							? true
							: false;
					if (!isEmpty(key)) {
						mapCtrlFields[key] = {};
						mapCtrlFields[key]['isSelected'] = isSelected;
						
						if(key==="drawerCode" && blnIsPrenoteChecked===true)
							pushReceiverFieldsIntoArray(mapCtrlFields,data,true,true);
						else if(key==="drawerCode" && blnIsPrenoteChecked===false)
							pushReceiverFieldsIntoArray(mapCtrlFields,data,isSelected || false,false);
						else if(key==="drawerCode")
							pushReceiverFieldsIntoArray(mapCtrlFields,data,isSelected || isPrenoteChecked(),true);
					}
				});
	}
	if (data && data.d && data.d.receivableEntry) {
		arrJSON = data.d.receivableEntry.standardField;
		if (arrJSON && arrJSON.length > 0) {
			$.each(arrJSON, function(index, cfg) {
				if (mapCtrlFields[cfg.fieldName] && cfg.fieldName!=="drawerAccountNo") {
					mapCtrlFields[cfg.fieldName]['isRequiredDefault'] = (cfg.displayMode === '3' || false);
				}
			});
		}
	}
	$.each(mapCtrlFields, function(key, value) {
		key =  getMapCtrlKeyName(key);
		field =$('#' + key);
		label = $('#' + key + "Lbl");
		
		if (key !== 'accountNo')
			updateFieldDisplayMode(field, label, value);
			/*
		 * if (key === 'accountNo')
		 * updateFieldDisplayMode($('#companyIdHdr'), $('#companyIdHdrLbl'),
		 * value);
		 */
		});
	initateValidation();
}
// TODO : To be verified
function getAccountAsReceiverMoreDetails(strDrawerAccountNo) {
	var accountDetails = null;
	$.ajax({
				type : "GET",
				url : "services/userseek/clientAccountSeek.json?code1"
						+ strDrawerAccountNo,
				complete : function(XMLHttpRequest, textStatus) {
					if ("error" == textStatus) {
						arrError.push({
									"errorCode" : "Message",
									"errorMessage" : mapLbl['unknownErr']
								});
						paintErrors(arrError);
					}
				},
				async : false,
				data : null,
				success : function(data) {
					if (data && data.d && data.d.preferences) {
						accountDetails = data.d.preferences[0];
					}
				}
			});
	return accountDetails;
}

function toggleAccountTransferAccountLabel(crDrFlag) {
	var clsHide = 'hidden';
	if (crDrFlag === 'C') {
		$(".accountcreditLbl").removeClass(clsHide);
		$(".accountdebitLbl").addClass(clsHide);

	} else if (crDrFlag === 'D') {
		$(".accountcreditLbl").addClass(clsHide);
		$(".accountdebitLbl").removeClass(clsHide);
	}
}
function advanceSettingPopupOpen() {
	$("#advancedSettingPopup").toggleClass('hidden');
	if ($("#plusIcon").hasClass('fa-plus')) {
		$("#plusIcon").removeClass('fa-plus');
		$("#plusIcon").addClass('fa-minus');
	} else {
		$("#plusIcon").removeClass('fa-minus');
		$("#plusIcon").addClass('fa-plus');
	}
}
function createTemplateCheckBoxGroup(strCheckBoxIds) {
	$(strCheckBoxIds).on('click', {
				ids : strCheckBoxIds
			}, function(e) {
				var me = $(this), strId = me.attr('id');
				var intCount = 0;
				// #hold,#holdUntilFlag,#prenote
				if (!$('#holdDiv').hasClass('hidden')
						&& $('#holdDiv').length != 0)
					intCount++;
				if (!$('#holdUntilFlagDiv').hasClass('hidden')
						&& $('#holdUntilFlagDiv').length != 0)
					intCount++;
				if (!$('#prenoteDiv').hasClass('hidden')
						&& $('#prenoteDiv').length != 0)
					intCount++;
				// This condition will work even only one checkbox is there
				if (me.is(':checked') && intCount > 1)
					$('#holdUntilFlag,#prenote').not($(this)).prop({
								'checked' : false,
								'value' : 'N'
							});
				// TODO: Added the comment
				if (false) {
					if (strId === 'hold') {
						toggleHoldZeroDollerValue();
					} else if (strId === 'holdUntilFlag') {
						onChangeHoldUntil();
					} else if (strId === 'prenote') {
						togglePrenoteValue();
					}
				}
				toggleHoldZeroDollerValue();
				onChangeHoldUntil();
				togglePrenoteValue();
			});
}
function handleCurrencyMissmatch() { 
	var buyerCcy = null;
	var sellerCcy = $('#txnCurrency').val();// Transaction Currency
	var clsHide = 'hidden', clsReq = 'required';
	var isCcyMissMatch = false, blnForexAtInstLevel = isForexAtInstrumentLevel();
	$('#accountNoCcy').text('');
	buyerCcy = getBuyerCcyForInstrument();
	toggleCurrencyLabel(sellerCcy);
	isCcyMissMatch = isCurrencyMissMatch();
	if (isCcyMissMatch
			&& (strEntryType === 'PAYMENT' || strEntryType === 'SI' || (strEntryType === 'TEMPLATE' && (strLayoutType === 'WIRELAYOUT' || strLayoutType ==='MIXEDLAYOUT')))) {
		getFXForDetail(buyerCcy, sellerCcy);
		$('#amount').blur(function() {
			var sellerCcy = $('#txnCurrency').val();// Transaction
			// Currency
			var buyerCcy = getBuyerCcyForInstrument();
			if (strEntryType === 'PAYMENT'
					|| strEntryType === 'SI'
					|| (strEntryType === 'TEMPLATE' && (strLayoutType === 'WIRELAYOUT' || strLayoutType ==='MIXEDLAYOUT')))
				getFXForDetail(buyerCcy, sellerCcy);
		});
		if(strLayoutType 
			&& (strLayoutType==='ACCTRFLAYOUT' || strLayoutType==='WIRELAYOUT'
		|| strLayoutType ==='CHECKSLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT' || strLayoutType === 'WIRESIMPLELAYOUT' || strLayoutType ==='MIXEDLAYOUT'))
		$('#debitCcyAmount').blur(function() {
			var sellerCcy = $('#txnCurrency').val();// Transaction
			// Currency
			var buyerCcy = getBuyerCcyForInstrument();
			if (strEntryType === 'PAYMENT'
					|| strEntryType === 'SI'
					|| (strEntryType === 'TEMPLATE' && (strLayoutType === 'WIRELAYOUT' || strLayoutType ==='MIXEDLAYOUT')))
				getFXForDetail(buyerCcy, sellerCcy);
			if (!isEmpty($('#debitCcyAmount').val())) {
				var txnAmount = $('#debitCcyAmount').val();
				txnAmount = parseFloat(txnAmount);
				$('#debitCcyAmount').val(txnAmount.toFixed(2));
			}
		});
	}
	else{
		if(strEntryType === 'PAYMENT' || strEntryType === 'SI' || (strEntryType === 'TEMPLATE' && (strLayoutType === 'WIRELAYOUT' || strLayoutType ==='MIXEDLAYOUT'))){
			$('#amount').removeClass('hidden');
			$('#debitCcyAmount').addClass('hidden');
			if (!isEmpty($('#debitCcyAmount').val())) {
				var txnAmount = $('#debitCcyAmount').val();
				txnAmount = parseFloat(txnAmount);
				$('#debitCcyAmount').val(txnAmount.toFixed(2));
			}
		}
	}
	if (isCcyMissMatch && blnForexAtInstLevel && isFxContractAvlbl() ) {
		$('#rateTypeDiv').removeClass(clsHide);
		$('#rateTypeLbl').addClass(clsReq);
		$('#contractRefNo').ContractRefNoAutoComplete(buyerCcy, sellerCcy);
		$('#rateType').blur(function mark() {
					markRequired($(this));
				});
	} else {
		$("#rateType").val('0');
		$('#rateTypeDiv, #contractRefNoDiv').addClass(clsHide);
		$('#rateTypeLbl, #contractRefNoLbl').removeClass(clsReq);
		$('#contractRefNo').attr('disabled', true);
		$('#contractRefNo').addClass('disabled');
		$('#rateType').unbind('blur');
		$('#rateType').removeClass('requiredField');
		$('#fxSpan').remove();
	}
	toggleAmountCcyField();
}
function isFxContractAvlbl() {
	var blnRet = false;
	var data = paymentResponseInstrumentData;
	if (data && data.d && data.d.receivableEntry
			&& data.d.receivableEntry.receivableHeaderInfo
			&& !isEmpty(data.d.receivableEntry.receivableHeaderInfo.allowContractFX)
			&& data.d.receivableEntry.receivableHeaderInfo.allowContractFX == true)
		blnRet = true;
	return blnRet;
}
function toggleAmountCcyField() {
	var data = cloneObject(paymentResponseInstrumentData || {}), objStdField, isFieldPresent = false, isCcyMissMatch = isCurrencyMissMatch();
	if (data && data.d.receivableEntry && data.d.receivableEntry.standardField) {
		objStdField = data.d.receivableEntry.standardField;
		$.each(objStdField, function(index, cfg) {
					fieldId = cfg.fieldName;
					if (fieldId === 'debitPaymentAmntFlag') {
						isFieldPresent = true;
						return false;
					}
				});
	}
	if (isFieldPresent) {
		if (isCcyMissMatch)
			$('#debitPaymentAmntFlagDiv').removeClass('hidden');
		else
			$('#debitPaymentAmntFlagDiv').addClass('hidden');
	}
}
function getBuyerCcyForInstrument() {
	var regExp = /\(([^)]+)\)$/;
	var matches = null, strBuyerCcy = null;
	var chrDebitAccountlevel = 'B';
	var data = paymentResponseInstrumentData;
	if (data && data.d && data.d.receivableEntry
			&& data.d.receivableEntry.receivableHeaderInfo
			&& data.d.receivableEntry.receivableHeaderInfo.accountLevel)
		chrDebitAccountlevel = data.d.receivableEntry.receivableHeaderInfo.accountLevel;
	var strAccount = $('#accountNo :selected').text();
	if (/* strEntryType === 'TEMPLATE' && */charPaymentType === 'B' && chrDebitAccountlevel==='B')
		strAccount = $('#accountNoHdr :selected').text();
	if (strAccount) {
		matches = regExp.exec(strAccount)
		if (matches && matches[0]) {
			strBuyerCcy = matches[0].replace(/[()]/g, '');
		}
	}
	return strBuyerCcy;
}
function getFxRateTypeForInstrument(chrFxRateLevel) {
	var strFxRateType = '';
	if (strPaymentType && strPaymentType == 'BATCHPAY') {
		var data = paymentResponseHeaderData;
		if (data && data.d && data.d.receivableEntry
				&& data.d.receivableEntry.standardField) {
			var arrFields = data.d.receivableEntry.standardField;
			if (arrFields.length > 0) {
				$.each(arrFields, function(index, cfg) {
							if (cfg.fieldName == 'rateType') {
								strFxRateType = cfg.value;
							}
						});
				return strFxRateType;
			}
		}
	} else {
		strFxRateType = $("#rateType").val();
		return strFxRateType;
	}
}
//TODO : call to this service should be changed, existing logic is as expected, but call to this function is getFXForDetail(buyccy,sellccy), which creates confusion
function getFXForDetail(sellccy, buyccy) {
	if('AUTH' === showFxRateLevel) return;
	var data = paymentResponseInstrumentData;
	var strFromCcy = null, strToCcy = null, strAmountLabel = 'Transaction Amount',strAmntCcyType ='amount';
	var fxLevel = 'B';
	if (Ext.isDefined(data) && Ext.isDefined(data.d)
			&& Ext.isDefined(data.d.receivableEntry.receivableHeaderInfo)
			&& Ext.isDefined(data.d.receivableEntry.receivableHeaderInfo.fxLevel)) {
		fxLevel = data.d.receivableEntry.receivableHeaderInfo.fxLevel;
	}
	if (Ext.isDefined(data)
			&& Ext.isDefined(data.d)
			&& Ext.isDefined(data.d.receivableEntry.receivableHeaderInfo)
			&& Ext
					.isDefined(data.d.receivableEntry.receivableHeaderInfo.singleOrBatch)) {
		if (fxLevel != 'I' && charPaymentType === 'B') {
			// return;
		}
	}
	strAmntCcyType = $('input[name=debitPaymentAmntFlag]:checked').val();
	var strAmountFieldName = (strLayoutType && strLayoutType === 'ACCTRFLAYOUT'
			|| strLayoutType === 'WIRELAYOUT' || strLayoutType === 'CHECKSLAYOUT' || strLayoutType === 'MIXEDLAYOUT')
			? (strAmntCcyType && strAmntCcyType === 'P'
					? 'amount'
					: 'debitCcyAmount')
			: 'amount';
	var strBuySellFlag = (strAmntCcyType && strAmntCcyType ==='P') ? 'S' : 'B';
	var txnAmount = $('#'+strAmountFieldName).val();
	var contractRef = $('#contractRefNo').val();
	if (!contractRef) {
		contractRef = "";
	}
	if (txnAmount && txnAmount > 0) {
		txnAmount = parseFloat(txnAmount);
	}
	var fxRateType = getFxRateTypeForInstrument(fxLevel);

	if ($("#fxSpan").length > 0) {
		$('#fxSpan').remove();
	}

	if (buyccy != sellccy) {
		
		if (strAmntCcyType && strAmntCcyType === 'D') {
			strFromCcy = sellccy;
			strToCcy = buyccy;
			strAmountLabel = 'Transaction Amount';
		} else {
			strFromCcy = buyccy;
			strToCcy = sellccy;
			strAmountLabel = 'Debit Amount';
		}
		var urlSeek = "services/fxrate/" + strFromCcy + "/" + strToCcy + "/" + strBuySellFlag
				+ ".json";
				
		var sendData = {"$ratetype" : fxRateType};
		if(!isEmpty(txnAmount))
			sendData['$amount'] = txnAmount;
		else
			sendData['$qfilter'] = contractRef;
			
		// FTMNTBANK-2399
		if (!isEmpty(strPaymentInstrumentIde) && fxRateType=="2") {
			sendData['$detailId'] = strPaymentInstrumentIde;
		}	
		// blockPaymentInstrumentUI(true);
		$.ajax({
					type : 'POST',
					url : urlSeek,
					complete : function(XMLHttpRequest, textStatus) {
						$.unblockUI();
						if ("error" == textStatus){
							var arrError = new Array();
							arrError.push({
										"errorCode" : "Message",
										"errorMessage" : mapLbl['unknownErr']
									});
							//doHandleUnknownError();
							//blockPaymentInstrumentUI(false);
						}
					},
					data : sendData,
					success : function(data) {
						$('.fxSpan').remove();
						if (data && data.d && data.d.error) {
							$("<span>").attr({
										'id' : 'fxSpan'
									}).html(strFromCcy + " - " + strToCcy
									+ ": " + data.d.error)
									.insertAfter('#amount');
						} else if (data && data.d && data.d.fxRate) {
							var htmlFx = null;
							
							if (strEntryType === 'TEMPLATE') {
								htmlFx = "Fx Rate(Indicative) : "
										+ data.d.fxRate;
							} else {
								htmlFx = "Indicative Rate (" + data.d.currencyPair + ") : "
										+ data.d.fxRate;

								if (data.d.debitAmount) {
//									if (strAmntCcyType && strAmntCcyType === 'D') {
//										$('#amount').val(data.d.debitAmount);
//									}else{
//										$('#debitCcyAmount').val(data.d.debitAmount);
//									}
									htmlFx += "<br />" + strAmountLabel + ' : '
											+ " " + data.d.debitAmount + " "
											+ strToCcy;
								}
							}
							$("<span>").attr({
										'class' : 'fxSpan'
									}).html(htmlFx).insertAfter('#amount');
							paintChangedFxDetails(data,'fxSpan');
						}
						// blockPaymentInstrumentUI(false);
					}
				});
	}
}

function paintFXForDetailViewOnlySection() {
	var data = paymentResponseInstrumentData, fieldId = null, isCcyMissMatch = false, strAmntCcyType = '', strFromCcy='', strToCcy = '';
	var txnAmount = null, contractRef = null, regExp = /\(([^)]+)\)$/, matches = null, buyerCcy = null, sellerCcy = null, debitAmount = null;
	var fxRateType = '0', strAccount = '', tempAccountObj = '', arrAccounts = null, strAccountList = null, strAmountLabel = 'Transaction Amount';
	var clsHide = 'hidden';

	if (data && data.d && data.d.receivableEntry
			&& data.d.receivableEntry.standardField) {
		var arrStdFields = data.d.receivableEntry.standardField;
		if (arrStdFields && arrStdFields.length > 0) {
			$.each(arrStdFields, function(index, cfg) {
						fieldId = cfg.fieldName;
						switch (fieldId) {
							case 'amount' :
								txnAmount = cfg.value;
								break;
							case 'debitCcyAmount':
								debitAmount = cfg.value;
								break;
							case 'contractRefNo' :
								contractRef = cfg.value;
								break;
							case 'rateType' :
								fxRateType = cfg.value;
								break;
							case 'txnCurrency' :
								sellerCcy = cfg.value;
								break;
							case 'accountNo' :
								if (cfg.values && cfg.values.length > 0)
									arrAccounts = cfg.values;
								else
									strAccount = cfg.value;
								strAccountList = cfg.availableValues;
								break;
							case 'debitPaymentAmntFlag'	:
								strAmntCcyType = cfg.value;
								break;
						}
					});
		}
	}

	var fxLevel = 'B';
	if (Ext.isDefined(data) && Ext.isDefined(data.d)
			&& Ext.isDefined(data.d.receivableEntry.receivableHeaderInfo)
			&& Ext.isDefined(data.d.receivableEntry.receivableHeaderInfo.fxLevel)) {
		fxLevel = data.d.receivableEntry.receivableHeaderInfo.fxLevel;
	}
	if (Ext.isDefined(data)
			&& Ext.isDefined(data.d)
			&& Ext.isDefined(data.d.receivableEntry.receivableHeaderInfo)
			&& Ext
					.isDefined(data.d.receivableEntry.receivableHeaderInfo.singleOrBatch)) {
		if (fxLevel != 'I' && charPaymentType === 'B') {
			// return;
		}
	}
	
	var strBuySellFlag = (strAmntCcyType && strAmntCcyType ==='P') ? 'S' : 'B';
	
	var strAmountFieldValue = (strLayoutType && strLayoutType === 'ACCTRFLAYOUT'
			|| strLayoutType === 'WIRELAYOUT' || strLayoutType === 'CHECKSLAYOUT' || strLayoutType === 'MIXEDLAYOUT')
			? (strAmntCcyType && strAmntCcyType === 'P'
					? txnAmount
					: debitAmount)
			: txnAmount;
	if ((arrAccounts && arrAccounts.length > 0) || strAccount) {
		if (arrAccounts && arrAccounts.length) {
			$.each(arrAccounts, function(index) {
						tempAccountObj = getObjectFormJsonArray(
								arrAccounts[index], strAccountList);
						if (tempAccountObj && tempAccountObj.description)
							strAccount += tempAccountObj.description;
					});
		} else {
			strAccount = getObjectFormJsonArray(strAccount, strAccountList);
			if (strAccount)
				strAccount = strAccount.description
		}
		matches = regExp.exec(strAccount);
		if (matches && matches[0]) {
			buyerCcy = matches[0].replace(/[()]/g, '');
			isCcyMissMatch = isCurrencyMissMatchForViewOnly(sellerCcy, buyerCcy);
		}
	}

	if (isCcyMissMatch) {
		if (strAmountFieldValue && strAmountFieldValue > 0) {
			strAmountFieldValue = parseFloat(strAmountFieldValue);
		}

		if ($(".fxInfo_InstView").length > 0) {
			$(".fxInfo_InstView").empty();
		}
		
		if(fxLevel=='B') fxRateType = getFxRateTypeForInstrument(fxLevel);
		
		if (strAmntCcyType && strAmntCcyType === 'D') {
			strFromCcy = buyerCcy;
			strToCcy = sellerCcy;
			strAmountLabel = 'Transaction Amount';
		} else {
			strFromCcy =sellerCcy;
			strToCcy =buyerCcy ;
			strAmountLabel = 'Debit Amount';
		}
		var urlSeek = "services/fxrate/" +  strFromCcy + "/" + strToCcy + "/"+strBuySellFlag+".json";
		/*var sendData = "$ratetype=" + fxRateType + !isEmpty(txnAmount)
				? ("&$amount=" + txnAmount)
				: '' + "&$qfilter=" + contractRef;*/
		var sendData = {"$ratetype" : fxRateType};
		if(!isEmpty(strAmountFieldValue))
			sendData['$amount'] = strAmountFieldValue;
		else
			sendData['$qfilter'] = contractRef;
			
		// FTMNTBANK-2399
		if (!isEmpty(strPaymentInstrumentIde)) {
			sendData['$detailId'] = strPaymentInstrumentIde;
		}	
		$.ajax({
			type : 'POST',
			url : urlSeek,
			complete : function(XMLHttpRequest, textStatus) {
				$.unblockUI();
				if ("error" == textStatus){
						var arrError = new Array();
						arrError.push({
									"errorCode" : "Message",
									"errorMessage" : mapLbl['unknownErr']
								});
						//doHandleUnknownError();
						//blockPaymentInstrumentUI(false);
				}
			},
			data : sendData,
			success : function(data) {
				  if (data && data.d && data.d.fxRate) {
					if (strEntryType
							&& (strEntryType === 'PAYMENT' || strEntryType === 'SI')) {
						var htmlFx = "Indicative Rate (" + data.d.currencyPair
								+ ") : " + data.d.fxRate;
						if (data.d.debitAmount) {
							htmlFx += "<br />" + strAmountLabel + " : "
									+ data.d.debitAmount + " " + strToCcy;
						}
						$("<span>").html(htmlFx).appendTo('.fxInfo_InstView');
						$(".fxInfo_InstView").removeClass(clsHide);
					} else if (strEntryType
							&& (strEntryType === 'TEMPLATE' && strLayoutType === 'WIRELAYOUT')) {
						var htmlFx = "FX Rate (Indicative) : " + data.d.fxRate;

						$("<span>").html(htmlFx).appendTo('.fxInfo_InstView');
						$(".fxInfo_InstView").removeClass(clsHide);
					} else {
						$(".sheetRateInfoDiv").removeClass(clsHide);
						$(".sheetRateInfo").html(data.d.fxRate);
					}
					paintChangedFxDetails(data,'fxInfo_InstView');
				}
				// blockPaymentInstrumentUI(false);
			}
		});
	}
}
function getChangeRateTypeInfo() {
	var strRateType = $('#rateType').val();
	if (strRateType === '1') {
		$('#contractRefNo').attr('disabled', false);
		$('#contractRefNo').removeClass('disabled');
		$('#contractRefNoLbl').addClass('required');
		$('#contractRefNoDiv').removeClass('hidden');
		$('#contractRefNo').blur(function mark() {
					markRequired($(this));
				});
		$('#fxRateDiv').addClass('hidden');
		$('#fxRateLbl').removeClass('required');
		$('#fxRate').attr('disabled', 'disabled');
	} else if(strRateType === '3'){ 
		$('#contractRefNo').attr('disabled', true);
		$('#contractRefNo').addClass('disabled');
		$('#contractRefNo').removeClass('requiredField');
		$('#contractRefNo').val('');
		$('#contractRefNo').unbind('blur');
		$('#contractRefNoLbl').removeClass('required');
		$('#contractRefNoDiv').addClass('hidden');
		$('#fxRateDiv').removeClass('hidden');
		$('#fxRateLbl').addClass('required');
		$('#fxRate').removeAttr('disabled');
	}else {
		$('#contractRefNo').attr('disabled', true);
		$('#contractRefNo').addClass('disabled');
		$('#contractRefNo').removeClass('requiredField');
		$('#contractRefNo').val('');
		$('#contractRefNo').unbind('blur');
		$('#contractRefNoLbl').removeClass('required');
		$('#contractRefNoDiv').addClass('hidden');
		$('#fxRateDiv').addClass('hidden');
		$('#fxRateLbl').removeClass('required');
		$('#fxRate').attr('disabled', 'disabled');
	}
	handleCurrencyMissmatch();
}
function handleForex() {
	// var strRateTypeVal = $('input[name="rateType"]:radio:checked').val();
	getChangeRateTypeInfo();
}
function isCurrencyMissMatch() {
	var buyerCcy = null, retvalue = false;
	var sellerCcy = $('#txnCurrency').val();// Transaction Currency
	buyerCcy = getBuyerCcyForInstrument();
	if (!isEmpty(buyerCcy) && !isEmpty(sellerCcy) && (buyerCcy != sellerCcy))
		retvalue = true;
	return retvalue;
}
function getCurrencyMissMatchValueForViewOnly() {
	var data = paymentResponseInstrumentData, fieldId = null, isCcyMissMatch = false;
	var regExp = /\(([^)]+)\)$/, matches = null, buyerCcy = null, sellerCcy = null;
	var strAccount = '', tempAccountObj = '', arrAccounts = null, strAccountList = null;

	if (data && data.d && data.d.receivableEntry
			&& data.d.receivableEntry.standardField) {
		var arrStdFields = data.d.receivableEntry.standardField;
		if (arrStdFields && arrStdFields.length > 0) {
			$.each(arrStdFields, function(index, cfg) {
						fieldId = cfg.fieldName;
						switch (fieldId) {
							case 'txnCurrency' :
								sellerCcy = cfg.value;
								break;
							case 'accountNo' :
								if (cfg.values && cfg.values.length > 0)
									arrAccounts = cfg.values;
								else
									strAccount = cfg.value;
								strAccountList = cfg.availableValues;
								break;
						}
					});
		}
	}

	if ((arrAccounts && arrAccounts.length > 0) || strAccount) {
		if (arrAccounts && arrAccounts.length) {
			$.each(arrAccounts, function(index) {
						tempAccountObj = getObjectFormJsonArray(
								arrAccounts[index], strAccountList);
						if (tempAccountObj && tempAccountObj.description)
							strAccount += tempAccountObj.description;
					});
		} else {
			strAccount = getObjectFormJsonArray(strAccount, strAccountList);
			if (strAccount)
				strAccount = strAccount.description
		}
		matches = regExp.exec(strAccount);
		if (matches && matches[0]) {
			buyerCcy = matches[0].replace(/[()]/g, '');
			isCcyMissMatch = isCurrencyMissMatchForViewOnly(sellerCcy, buyerCcy);
		}
	}
	return isCcyMissMatch;
}	
function isCurrencyMissMatchForViewOnly(sellerCcy, buyerCcy) {
	var retvalue = false;
	if (!isEmpty(buyerCcy) && !isEmpty(sellerCcy) && (buyerCcy != sellerCcy))
		retvalue = true;
	return retvalue;
}
function isForexAtInstrumentLevel() {
	var blnRet = false;
	var data = paymentResponseInstrumentData;
	if (data && data.d && data.d.receivableEntry
			&& data.d.receivableEntry.receivableHeaderInfo
			&& data.d.receivableEntry.receivableHeaderInfo.fxLevel
			&& data.d.receivableEntry.receivableHeaderInfo.fxLevel === 'I')
		blnRet = true;
	return blnRet;
}
function togglePrenoteValue() {
	if ($('#prenote').is(':checked')) {
		$('#prenote').val('Y');
		$('#holdUntilDiv').addClass('hidden');
		// $('#amount').val('0.0');
		// $('#amount').attr('disabled', true);
	} else {
		$('#prenote').val('N');
		// $('#amount').attr('disabled', false);
	}
}
function onChangeHoldUntil() {
	var clsHide = 'hidden';
	if ($('#holdUntilFlag').is(':checked')) {
		$('#holdUntilFlag').val('Y');
		$('#holdUntilDiv').removeClass(clsHide);
	} else {
		$('#holdUntilDiv').addClass(clsHide);
		$('#holdUntil').val('');
		$('#holdUntilFlag').val('N');
	}
}
function toggleHoldZeroDollerValue() {
	if ($('#hold').is(':checked')) {
		$('#hold').val('Y');
	} else
		$('#hold').val('N');
}
function toggleReceiverCodeNecessity() {
	var clsReq = 'required';
	if ($('#saveBeneFlagA').is(':checked')) {
		$('#drawerCodeALbl').addClass(clsReq);
		$('#drawerCodeA').attr('readonly',false);
		$('#saveBeneFlagA').val('Y');
		$('#drawerCodeA').blur(function mark() {
					markRequired($(this));
				});
	} else {
		$('#drawerCodeALbl').removeClass(clsReq);
		$('#saveBeneFlagA').val('N');
		$('#drawerCodeA').val('');
		$('#drawerCodeA').attr('readonly',true);
		$('#drawerCodeA').unbind('blur');
		$('#drawerCodeA').removeClass('requiredField');
	}
}
function doHandleForex() {
	//var strRateTypeVal = $('input[name=rateType]:radio:checked').val();
	getChangeRateTypeInfo();
}
// TODO : TO be verified WIRE, Account Transfer, Checks Layout
function handleAmountCcyChange() {
	var strCurrency = $('#txnCurrency').val();
	var strBuyerCurrency = getBuyerCcyForInstrument();
	var strAmntCcyType = $('input[name=debitPaymentAmntFlag]:checked').val();
	if (!isEmpty(strCurrency)) {
		var strPostFix = isEmpty(strAmntCcyType) || isEmpty(strBuyerCurrency)
				? strCurrency
				: ((strAmntCcyType === 'P') ? strCurrency : strBuyerCurrency);
		$('#txnCurrencySpan').html('(' + (strPostFix ? strPostFix : '') + ')');
	} else
		$('#txnCurrencySpan').html('');

	if ((!isEmpty(strBuyerCurrency) && !isEmpty(strCurrency) && (strBuyerCurrency != strCurrency))
			&& (strEntryType === 'PAYMENT' || strEntryType === 'SI' || (strEntryType === 'TEMPLATE' && strLayoutType === 'WIRELAYOUT')))
		getFXForDetail(strBuyerCurrency, strCurrency);
		
	if(strAmntCcyType && strAmntCcyType==='D'){
		$('#amount').addClass('hidden');
		//$('#amount').val('0.00');
		$('#debitCcyAmount').removeClass('hidden');
	} else{
		$('#amount').removeClass('hidden');
		$('#debitCcyAmount').val('0.00');
		$('#debitCcyAmount').addClass('hidden');
	} 	
}
function handleDebitPaymentAmntFlagPopulation(cfg)
{
	if(cfg && cfg.value && cfg.value==='D'){
		$('#amount').addClass('hidden');
		//$('#amount').val('0.00');
		$('#debitCcyAmount').removeClass('hidden');
	} else{
		$('#amount').removeClass('hidden');
		$('#debitCcyAmount').val('0.00');
		$('#debitCcyAmount').addClass('hidden');
	}
}
//FTMNTBANK-841
//function handleCompanyIdInstrumentChange() {
//	var strTempType = $('input[name="templateType"]:radio:checked').val();
//	var strCompanyId = $('#companyId').val();
//	//var strOldAccountNo = $("#accountNo").val();
//	var data = paymentResponseInstrumentData;
//	if (strEntryType
//			&& ((strEntryType != 'TEMPLATE') || (strEntryType === 'TEMPLATE'
//					&& strTempType && strTempType !== '1'))) {
//		if (data && data.d && data.d.receivableEntry
//				&& data.d.receivableEntry.standardField) {
//			var arrFields = [];
//			var lstAvailableValues = [];
//			arrFields = data.d.receivableEntry.standardField;
//			$("#accountNo").val("");
//			if (arrFields && arrFields.length > 0) {
//				$.each(arrFields, function(index, cfg) {
//							if ('companyId' === cfg.fieldName) {
//								lstAvailableValues = cfg.availableValues
//							}
//						});
//			}
//			if (lstAvailableValues && lstAvailableValues.length > 0)
//				$.each(lstAvailableValues, function(index, cfg) {
//					if (cfg && strCompanyId === cfg.code && cfg.defaultAccount) {
//						$("#accountNo").val(cfg.defaultAccount);
//					}
//				});
//			//if (isEmpty($("#accountNo").val()))
//				//$("#accountNo").val(strOldAccountNo);
//		}
//	}
//}
function handleDebitAccountInstrumentChange() {
	var strTempType = $('input[name="templateType"]:radio:checked').val();
	//var strCompanyId = $('#companyIdHdr').val();
	var strAccountNo = $('#accountNo').val();
	//var strOldAccountNo = $("#accountNoHdr").val();
	//var strOldCompanyId = $("#companyId").val();
	var data = paymentResponseInstrumentData;
	if ((strEntryType && strEntryType != 'TEMPLATE')
			|| (strEntryType && strEntryType === 'TEMPLATE'
					&& !isEmpty(strTempType) && strTempType !== '1')) {
		if (data && data.d && data.d.receivableEntry
				&& data.d.receivableEntry.standardField) {
			var arrFields = [];
			var lstAvailableValues = [];
			arrFields = data.d.receivableEntry.standardField;

			if (arrFields && arrFields.length > 0) {
				$.each(arrFields, function(index, cfg) {
							if ('companyId' === cfg.fieldName) {
								lstAvailableValues = cfg.availableValues
							}
						});
			}
			if (lstAvailableValues && lstAvailableValues.length > 0)
				if (lstAvailableValues.length > 1)
					$("#companyId").val("");
			$.each(lstAvailableValues, function(index, cfg) {
						if (cfg /*&& strCompanyId === cfg.code */
								&& cfg.defaultAccount
								&& cfg.defaultAccount === strAccountNo) {
							$("#companyId").val(cfg.code);
						}else{
							$("#companyId").removeAttr('disabled');
							$("#companyId").removeAttr('readonly');
						}
					});
			//if(isEmpty($("#companyId").val()))
			//	$("#companyId").val(strOldCompanyId);
		}
	}
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
				if(fieldId === 'accountNo' || fieldId === 'drawerAccountNo'){
					field = $('#' + fieldId+'_jq');
					if (field && field.length != 0) {
					field.on('blur', function mark() {
								markRequired($(this));
							});
				}
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
// Function for field validation
function getValueToDispayed(cfg) {
	var dataType = cfg.dataType, defValue = cfg.value, fieldId = cfg.fieldName;
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
					if(fieldId == 'payerCurrency'){
						strReturnValue = strReturnValue
						&& strReturnValue.description
						? strReturnValue.code
						: '';
					}
					else
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
function getMaskObjectFormJsonArray(strKey, arrValues) {
	var retValue = null;
	if (arrValues)
		$.each(arrValues, function(index, opt) {
					if (strKey === opt.seq) {
						retValue = opt;
						return retValue;
					}
				});
	return retValue;
}
function doRemoveStaticText(parentDivId) {
	$("#" + parentDivId + " .canRemove").remove();
	
}
function toggleReceiver(charReceiverType, clearFields) {
	if (!isEmpty(charReceiverType)) {
		if (charReceiverType === 'A') {
			strReceiverType = 'A';
			$('.adhocReceiver').removeClass('hidden');
			$('#registeredReceiverDiv').addClass('hidden');
			$("#switchToAdhocReceiverDiv").addClass("hidden");
			$('#beneficiaryBankIDTypeA').change(function(){
				resetAdhocReceiverBankDetails();
			});
		} else if (charReceiverType === 'R') {
			strReceiverType = 'R';
			$('.adhocReceiver').addClass('hidden');
			$('#registeredReceiverDiv').removeClass('hidden');
			if ($("#switchToAdhocReceiverDiv"))
				$("#switchToAdhocReceiverDiv").removeClass("hidden")
		}
		clearReceiver(charReceiverType, clearFields);
	}
}

function clearReceiver(charReceiverType, clearFields) {
	if (clearFields === true) {
		if (charReceiverType === 'B' || charReceiverType === 'A')
			$('#drawerDescriptionA,#drawerCodeA,#receiverIDA,#drawerMailA,#drawerAccountNoA,#beneficiaryBankIDCodeA,#beneficiaryBankIDCodeAutoCompleter')
					.val('');
		if (charReceiverType === 'B' || charReceiverType === 'R') {
			$('#drawerMail_RInfoLbl,#drawerAccountNo_RInfoLbl,#drawerBankCode_RInfoLbl')
					.html('');
			$('#drawerDescriptionR,#drawerCodeR,#receiverIDR,#drawerAccountNoR,#drawerMailR,#beneficiaryBankIDCodeR')
					.val('');
		}
	}
	$("#beneficiaryBankIDCodeAInfoMessage").empty();
}
function resetAdhocReceiverBankDetails() {
	$('#beneficiaryBankIDCodeA,#beneficiaryBankIDCodeAutoCompleter,#drawerBankCodeA,#drawerBranchCodeA,#beneficiaryBranchDescriptionA,#beneficiaryBankDescriptionA,#drawerBankAddressA')
	.val('');
	$('#beneficiaryAdhocbankFlagA').val('R');
	$("#beneficiaryBankIDCodeAInfoMessage").empty();
	doBankIDValidation();
}
function toggleDirtyBit(blnApplyDirtyBit) {
	var field = null;
	dirtyBit = 0;
	$('#transactionWizardPopup :text, #transactionWizardPopup :file, #transactionWizardPopup :checkbox, #transactionWizardPopup :radio, #transactionWizardPopup select, #transactionWizardPopup textarea')
			.each(function() {
						field = $(this);
						if (field && field.length != 0) {
							if (blnApplyDirtyBit)
								field.focus(function dirtyBitFocus() {
									dirtyBit++;
										// console.log(dirtyBit);
									});
							else
								field.unbind('focus');
						}
					});
}
function toggleCurrencyLabel(strCcy) {
//|| strLayoutType ==='MIXEDLAYOUT'
	if ('WIRELAYOUT' === strLayoutType
			|| ('ACCTRFLAYOUT' === strLayoutType && strEntryType === 'TEMPLATE')
			|| 'CHECKSLAYOUT' === strLayoutType || strLayoutType === 'SIMPLEACCTRFLAYOUT' || strLayoutType === 'WIRESIMPLELAYOUT' ) {
		handleAmountCcyChange();
	} else {
		if (!isEmpty(strCcy))
		{
			$('#txnCurrencySpan').html('(' + strCcy + ')');			
		}
		else
			$('#txnCurrencySpan').html('');
	}
}
function createCrDrCheckBoxGroup(strCheckBoxIds) {
	$(strCheckBoxIds).on('click', function() {
		var me = $(this), name = me.prop('name');
		if (me.is(':checked')
				&& $(':checkbox[name="' + name + '"]:checked').length > 0)
			$(':checkbox[name="' + name + '"]').not($(this)).prop('checked',
					false);
		else
			me.attr('checked', true);
		if (strLayoutType && (strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT'))
			toggleAccountLabel(me, me.val());
		populateBankProductFieldDetail();
	});
}
/*
 * function toggleCurrencyLabel(strCcy) { if (!isEmpty(strCcy))
 * $('#txnCurrencySpan').html('(' + strCcy + ')'); else
 * $('#txnCurrencySpan').html(''); }
 */
function createCrDrCheckBoxGroup(strCheckBoxIds) {
	$(strCheckBoxIds).on('click', function() {
		var me = $(this), name = me.prop('name');
		if (me.is(':checked')
				&& $(':checkbox[name="' + name + '"]:checked').length > 0)
			$(':checkbox[name="' + name + '"]').not($(this)).prop('checked',
					false);
		else
			me.attr('checked', true);
		if (strLayoutType && (strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT'))
			toggleAccountLabel(me, me.val());
		populateBankProductFieldDetail();
	});
}
function handleBankBranchToggleForAdhocReceiver(strCheckBoxIds) {
	$(strCheckBoxIds).on('click', function() {
		if ($(this).attr('id') === 'cbBankRoutingCodeA') {
			$('#beneficiaryBankIDCodeALbl').html('Routing Number');
			$('#beneficiaryBankIDCodeAutoCompleter').autocomplete("destroy");
			$('#beneficiaryBankIDCodeAutoCompleter').BankIdAutoComplete();
		} else if ($(this).attr('id') === 'cbBankAndBranchNameA') {
			$('#beneficiaryBankIDCodeALbl').html('Search Bank and Branch Name');
			$('#beneficiaryBankIDCodeAutoCompleter').autocomplete("destroy");
			$('#beneficiaryBankIDCodeAutoCompleter').BankBranchAutoComplete();
		}
		$('#drawerBankCodeA, #drawerBranchCodeA, #beneficiaryBankIDCodeA')
				.val('');
	});
	if(!isScreenBroken && strLayoutType && strLayoutType !='TAXLAYOUT')
		doBankIDValidation();
}
function showHideSection(sectionId) {
	$('#' + sectionId).toggleClass("ui-helper-hidden");
}
function advanceSettingInstrumentPopupOpen() {
	$("#advancedSettingInstrumentPopup").toggleClass('hidden');
	if ($("#plusIcon").hasClass('fa-plus')) {
		$("#plusIcon").removeClass('fa-plus');
		$("#plusIcon").addClass('fa-minus');
	} else {
		$("#plusIcon").removeClass('fa-minus');
		$("#plusIcon").addClass('fa-plus');
	}
}
function handleForexForPaymentInstrument() {
	handleChangeRateType();
}
function handleChangeRateTypeForInstrument() {
	var strRateType = $('#rateType').val();
	if (strRateType === '1') {
		$('#fxRateDiv').addClass('hidden');
		$('#contractRefNo').attr('disabled', false);
		$('#contractRefNo').removeClass('disabled');
		$('#contractRefNoLbl').addClass('required');
		$('#contractRefNoDiv').removeClass('hidden');
		$('#contractRefNo').blur(function mark() {
					markRequired($(this));
				});
	} 
	else if (strRateType === '3') {
		$('#contractRefNo').attr('disabled', 'disabled');
		$('#contractRefNo').addClass('disabled');
		$('#contractRefNoDiv').addClass('hidden');
		
		$('#fxRate').removeAttr('disabled');
		$('#fxRateLbl').addClass('required');
		$('#fxRateDiv').removeClass('hidden');
		$('#fxRate').blur(function mark() {
					markRequired($(this));
				});
		
	} 
	else {
		$('#contractRefNo').attr('disabled', true);
		$('#contractRefNo').addClass('disabled');
		$('#contractRefNo').removeClass('requiredField');
		$('#contractRefNo').val('');
		$('#contractRefNo').unbind('blur');
		$('#contractRefNoLbl').removeClass('required');
		$('#contractRefNoDiv').addClass('hidden');
		$('#fxRateDiv').addClass('hidden');
	}
	handleCurrencyMissmatch();
}
function repopulateBankProductField() {
	var _strMyProduct = strMyProduct;
	var _strCcy = $('#txnCurrency').val();
	var _strdrCrFlag = 'B';
	var isCrChecked = $('#drCrFlagC').is(':checked');
	var isDrChecked = $('#drCrFlagD').is(':checked');
	var strUrl = 'services/bankproduct/'
	if (isCrChecked && isDrChecked)
		_strdrCrFlag = 'B';
	else if (isCrChecked)
		_strdrCrFlag = 'C';
	else if (isDrChecked)
		_strdrCrFlag = 'D';
	if (!isEmpty(_strMyProduct) && !isEmpty(_strCcy) && !isEmpty(_strdrCrFlag)) {
		strUrl += _strMyProduct + '/' + _strCcy + '/' + _strdrCrFlag + '.json';
		blockPaymentInstrumentUI(true);
		doClearMessageSection();
		$.ajax({
					type : "POST",
					url : strUrl,
					async : false,
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
							if (data && data.d && data.d && data.d.seek) {
								var obj = data.d.seek;
								var arrData = new Array();
								if ($.isArray(obj)) {
									arrData = obj[0];
									if (arrData) {
										populateSelectFieldValue('bankProduct',
												arrData, '');
										blockPaymentInstrumentUI(false);
										if (arrData.length === 1) {
											repaintPaymentInstrumentFields();
											$('#drCrFlagD, #drCrFlagC').attr(
													"checked", false);
											if (_strdrCrFlag === 'B') {
												$('#drCrFlagD, #drCrFlagC')
														.attr("checked", true);
											} else
												populateRadioFieldValue(
														'drCrFlag',
														_strdrCrFlag);
										} else {
											$('#bankProduct').show();
											// $('#bankProductHdrSpan').hide();
											$('#bankProduct').attr('disabled',
													false);
											handleLayoutBasedScreenRendering('Q',paymentResponseInstrumentData);		
										}
									}

								} else if (obj.error) {
									var errObj = [{
										errorMessage : mapLbl['drCrFlagError_'
												+ _strdrCrFlag],
										errorCode : 'ERR'
									}];
									paintErrors(errObj);
									blockPaymentInstrumentUI(false);
								}
							}

						}
					}
				});
	}
}
function togglePaymentInstrumentEditScreen(showVerifyScreen) {
	if (showVerifyScreen) {
		// TODO: Verify whether Update and Next or only Next
		doClearMessageSection();
		$('#txnStep1,#txnStep2').removeClass('ft-status-bar-li-active')
				.addClass('ft-status-bar-li-done');
		$('#txnStep3').addClass('ft-status-bar-li-active');
		$('#transactionWizardPopup').addClass('hidden');
		$('#verificationStepDiv').removeClass('hidden');
		paintPaymentInstrumentActions('SUBMIT');
		paintPaymentInstrumentVerifyScreen(paymentResponseInstrumentData, 'N');
	} else {
		doClearMessageSection();
		$('#txnStep3,#txnStep1').removeClass('ft-status-bar-li-active')
				.addClass('ft-status-bar-li-done');
		$('#txnStep2').addClass('ft-status-bar-li-active');
		$('#transactionWizardPopup').removeClass('hidden');
		$('#verificationStepDiv').addClass('hidden');
		doRemoveStaticText("transactionWizardPopup");
		paintReceivableInstrumentUI(paymentResponseInstrumentData, 'Q');
		paintPaymentInstrumentActions('EDIT');

	}
}
function doViewPaymentInstrument() {
	doClearMessageSection();
	// $('#txnStep1,#txnStep2').removeClass('ft-status-bar-li-active')
	// .addClass('ft-status-bar-li-done');
	// $('#txnStep3').addClass('ft-status-bar-li-active');
	$('#txnStep1,#txnStep2,#txnStep3').addClass('hidden');
	$('#transactionWizardPopup').addClass('hidden');
	$('#verificationStepDiv').removeClass('hidden');
	paintPaymentInstrumentVerifyScreen(paymentResponseInstrumentData, 'N');
}
// TODO: To be verified
function loadPaymentInstrumentBankProductFields() {
	var strProductCode = strMyProduct;
	var strBankProduct = $('#bankProduct').val();
	var strUrl = _mapUrl['loadInstrumentFieldsUrl'] + "/" + strProductCode;
	var jsonObj = null;

	if (!isEmpty(strBankProduct))
		strUrl += '/' + strBankProduct;
	strUrl += '.json';
	// TODO : To be handled
	/*
	 * $('#regDrawerCode').autocomplete("destroy");
	 * $("#regDrawerCode").ReceiverAutoComplete(strMyProduct, strBankProduct,
	 * 'Q'); $('#receiverDtlDiv').addClass('ui-helper-hidden');
	 */
	blockPaymentInstrumentUI(true);
	jsonObj = generatePaymentInstrumentJson();
	if (jsonObj.d && jsonObj.d.__metadata && strPaymentInstrumentIde)
		jsonObj.d.__metadata._detailId = strPaymentInstrumentIde;
	$.ajax({
				type : "POST",
				url : strUrl,
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
						doRemoveStaticText("transactionWizardPopup");
						paintReceivableInstrumentUI(data, 'Q');
						initateValidation();
						blockPaymentInstrumentUI(false);
						handleEmptyEnrichmentDivs();
					}
				}
			});
}

function getInstrumentTemplateType(arrStdFields) {
	var strRetValue = null;
	var arrFields = arrStdFields || [];
	if (arrFields && arrFields.length > 0) {
		$.each(arrFields, function(index, cfg) {
					if (cfg.fieldName === 'templateType') {
						strRetValue = cfg.value;
						return false;
					}
				});
	}
	return strRetValue;
}

function setSelectedReceiver(record) {
	$('#drawerCodeR, #regDrawerCode').val(record['code']);
	$('#drawerDescriptionR').val(record['receiverName']);
	$('#receiverIDR').val(record['code']);
	$('#drawerCodeR, #drawerDescriptionR,#receiverIDR')
			.removeClass('requiredField');
	toggleReceiver('R', false);
	// FIXME: Following fields to be populated
	// $('#drawerMail_RInfoLbl').html(receiverDetails.beneEmailId || '');
	// $('#drawerAccountNo_RInfoLbl').html(ui.item.details.accountNumber);
	// $('#drawerBankCode_RInfoLbl').html(ui.item.details.bankCode);
}
function setBankIDValue(bankIdSelected, bankIdElement, data) {
	if ('BIC' === bankIdSelected) {
		$(bankIdElement).val(data.BIC);
	}
	if ('CHIPS' === bankIdSelected) {
		$(bankIdElement).val(data.CHIPS);
	}
	if ('FED' === bankIdSelected) {
		$(bankIdElement).val(data.FEDABA);
	}
	if ('NCC' === bankIdSelected) {
		$(bankIdElement).val(data.NCC);
	}
	if ('SORT' === bankIdSelected) {
		$(bankIdElement).val(data.SORT);
	}
}
function doPopulateADhocReceiverSwiftMsg57(code) {
	var beneBranchCode = $('#drawerBranchCodeA');
	var add1 = $('#drawerBankAddressA');
	var benCountry = $('#beneficiaryCountryA');
	var line4;
	if (!isEmpty(beneBranchCode))
		$('#swift57aline1A').val(beneBranchCode.val().substring(0, 35));
	if (!isEmpty(add1)) {
		line4 = add1.val().substring(70, 95);
		$('#swift57aline2A').val(add1.val().substring(0, 35));
		$('#swift57aline3A').val(add1.val().substring(35, 70));
	}
	if (!isEmpty(benCountry))
		line4 = line4 + benCountry.val().substring(0, 10);
	if (!isEmpty(line4))
		$('#swift57aline4A').val(line4.substring(0, 35));
}

jQuery.fn.initiateCheckBankIDListener = function(bankIdTypeElement, infoMessageElement, infoType) 
{
	var isBankIDSelected = null;
	$(this).focusout(function() {
		if (!isBankIDSelected) {
		//	$(this).checkInfoFoundForBankID(bankIdTypeElement, infoMessageElement, infoType);
		}
	}).blur(function() {
				if (!isBankIDSelected) {
					// $('#bankSearchText').validateBankID();
				}
			});
	$(this).keydown(function(event) {});
};
function getAdhocBankWarningMessage() {
	/* Need to Remove inline Styles */
	var warningMsgHtmlText = '<span class="ux_info-icon floatLeft noInfoFound" style="float:left !important;padding:1px 0px 0px 0px !important;color:#FFBE23 !important">&nbsp;</span> <span style="color:#FFBE23 !important" class="noInfoFound"> Information not found in library</span>';
	return warningMsgHtmlText;
}

var checkBankIDInLibraryURL = "services/userseek/checkDrawerbank.json?$top=20&$filtercode2=";
jQuery.fn.checkInfoFoundForBankID = function(bankIdTypeElement,
		infoMessageElement, infoType) {
	var textVal = this.val();
	if (textVal == '' || textVal == '%') {
		return;
	}
	$.ajax({
		url : checkBankIDInLibraryURL,
		dataType : "json",
		data : {
			$filtercode4 : textVal,
			$filtercode1 : (infoType == 'RECEIVER_BANK_INFO'
					? getDisabledFieldValue(bankIdTypeElement)
					: 'BIC')
		},
		success : function(bankData) {
			var data = bankData.d.preferences[0];
			if (data == null || (data != null && data.length == 0)) {
				$('#' + infoMessageElement).empty();
				$('#' + infoMessageElement).html(getAdhocBankWarningMessage());
				/* Clears the Bank Details if Already Set */
				clearBankDetails(infoType);
				if (infoType == 'RECEIVER_BANK_INFO') {
					$('#beneficiaryAdhocbankFlagA').val('A');
					$('#beneficiaryBranchDescriptionALbl').addClass("required");
				}/*
				 * else if (infoType == 'RECEIVER_CORR_BANK_INFO') {
				 * $('#corrBankTypeA').val('A');
				 * $('#corrBankDetails1ALbl').addClass("required"); } if
				 * (infoType == 'RECEIVER_INT_BANK_INFO') {
				 * $('#intBankTypeA').val('A');
				 * $('#intBankDetails1ALbl').addClass("required"); }
				 */
				enableDisableBankDetailsFields(false, infoType);
			} else {
				enableDisableBankDetailsFields(true, infoType);
				if (data) {
					if (infoType == 'RECEIVER_BANK_INFO'
							&& !isEmpty(strLayoutType)
							&& (strLayoutType === 'ACHLAYOUT' || strLayoutType === 'MIXEDLAYOUT')) {
						setAdhocReceiverBankInfo(data, infoMessageElement);
						$('#beneficiaryBranchDescriptionALbl')
								.removeClass("required");
					} /*
					 * else if (infoType == 'RECEIVER_CORR_BANK_INFO') {
					 * setAdhocReceiverCorrBankInfo(data,
					 * infoMessageElement); $('#corrBankDetails1ALbl')
					 * .removeClass("required"); } if (infoType ==
					 * 'RECEIVER_INT_BANK_INFO') {
					 * setAdhocReceiverIntBankInfo(data,
					 * infoMessageElement); $('#intBankDetails1ALbl')
					 * .removeClass("required"); }
					 */
				}
				// Populate other Information
			}
		}
	});
};
function enableDisableBankDetailsFields(blnReadOnly, strInfoType) {
	if (strInfoType == 'RECEIVER_BANK_INFO') {
		enableDisableField($('#drawerBankCodeA'), blnReadOnly);
		enableDisableField($('#drawerBranchCodeA'), blnReadOnly);
		enableDisableField($('#drawerBankAddressA'), blnReadOnly);
	}
	// else if(strInfoType == 'RECEIVER_CORR_BANK_INFO'){
	// enableDisableField($('#corrBankDetails1A'),blnReadOnly);
	// enableDisableField($('#corrBankDetails3A'),blnReadOnly);
	// }
	// if(strInfoType == 'RECEIVER_INT_BANK_INFO'){
	// enableDisableField($('#intBankDetails1A'),blnReadOnly);
	// enableDisableField($('#intBankDetails3A'),blnReadOnly);
	// }
}
function clearBankDetails(infoType) {
	if (infoType == 'RECEIVER_BANK_INFO') {
		$('#drawerBankCodeA').val('');
		$('#drawerBranchCodeA').val('');
		$('#drawerBankAddressA').val('');
		$('#beneficiaryBankDescriptionA').val('');
		$('#beneficiaryBranchDescriptionA').val('');
	}
	// else if(infoType == 'RECEIVER_CORR_BANK_INFO'){
	// $('#corrBankDetails1ARM').val('');
	// $('#corrBankDetails3ARM').val('');
	// }
	// if(infoType == 'RECEIVER_INT_BANK_INFO'){
	// $('#intBankDetails1ARM').val('');
	// $('#intBankDetails3ARM').val('');
	// }
}

function setAdhocReceiverBankInfo(objData, infoMessageElement) {
	$('#beneficiaryAdhocbankFlagA').val('R');
	if (!isEmpty(objData.ROUTINGNUMBER))
		$('#beneficiaryBankIDCodeA').val(objData.ROUTINGNUMBER);
	if (!isEmpty(objData.BANKCODE))
		$('#drawerBankCodeA').val(objData.BANKCODE);
	if (!isEmpty(objData.BRANCHCODE))
		$('#drawerBranchCodeA').val(objData.BRANCHCODE);
	if (!isEmpty(objData.BANKDESCRIPTION)) {
		strText = objData.BANKDESCRIPTION;
		$('#beneficiaryBankDescriptionA').val(objData.BANKDESCRIPTION);
	}
	if (!isEmpty(objData.BRANCHDESCRIPTION)) {
		strText += ',&nbsp;' + objData.BRANCHDESCRIPTION;
		$('#beneficiaryBranchDescriptionA').val(objData.BRANCHDESCRIPTION);
	}
	if (!isEmpty(objData.ROUTINGNUMBER))
		strText += ',&nbsp;' + objData.ROUTINGNUMBER;
	$('#' + infoMessageElement).empty();
	$('#' + infoMessageElement).html(strText);
	if (!isEmpty(objData.ADDRESS))
		$('#drawerBankAddressA').val(objData.ADDRESS);

}

function displayFiInfoForRecevingAccount(data, isViewOnly) {
	var strAccountInfo = null;
	var fieldPostFix = isViewOnly ? '_InstView' : 'InfoSpan';
	var fieldDivID = isViewOnly
			? 'receivingaccountViewDivInfo'
			: 'receivingaccountDivInfo';
	// $("#drawerAccountNoStatic" + fieldPostFix).text("");
	if (data) {
		$("#drawerAccountNoStatic" + fieldPostFix).removeClass('hidden');
		strAccountInfo = (data.ACCOUNTCCY) ? data.ACCOUNTCCY : '';
		strAccountInfo += strAccountInfo ? ', ' : '';
		strAccountInfo += (data.SELLER) ? data.SELLER : '';
		strAccountInfo += strAccountInfo ? ', ' : '';
		strAccountInfo += (data.CORPORATION) ? data.CORPORATION : '';
		strAccountInfo += strAccountInfo ? ', ' : '';
		strAccountInfo += (data.CLIENT) ? data.CLIENT : '';
		// var parentWidth = $("#drawerAccountNoStatic" + fieldPostFix).width();
		$("#drawerAccountNoStatic" + fieldPostFix).text(strAccountInfo);
		$("#" + fieldDivID).css({
					"overflow" : "hidden",
					"text-overflow" : "ellipsis",
					"white-space" : "nowrap"
				});
		$("#drawerAccountNoStatic" + fieldPostFix)
				.attr("title", strAccountInfo);
	}
}
function toggleRecurringPaymentParameterDtlFieldsSectionVisibility() {
	var isChecked = $('#paymentSaveWithSI').is(':checked');
	if (isChecked === true) {
		$('#siProcessingParameterInfoDiv').removeClass('ui-helper-hidden');
	} else {
		$('#siProcessingParameterInfoDiv').addClass('ui-helper-hidden');
	}
}
function toggleRecurringPaymentParameterDtlFieldsViewOnlySectionVisibility(
		strPostFix) {
	var isChecked = $('#paymentSaveWithSI' + strPostFix).is(':checked');
	if (isChecked === true || strEntryType === 'SI') {
		$('#siProcessingParameterInfoDiv').removeClass('ui-helper-hidden');
	} else {
		$('#siProcessingParameterInfoDiv').addClass('ui-helper-hidden');
	}
}
function toggleSaveSIDtlCheckBoxValue(id) {
	var isChecked = $('#' + id).attr('checked') ? true : false;
	if (isChecked)
		$('#' + id).val('Y');
	else
		$('#' + id).val('N');
	toggleRecurringPaymentParameterDtlFieldsSectionVisibility();
}
function handleDrCrFlagPaymentInstrument(cfg) {
	var strCssClass = '';
	if ((strPaymentType === 'QUICKPAY' || strPaymentType === 'QUICKPAYSTI')
			|| (strPaymentType === 'BATCHPAY' && strLayoutType === 'TAXLAYOUT'))
		strCssClass = 'col-sm-12';
	if ('true' === cfg.readOnly && cfg.value) {
		var strDrCrLabel = !isEmpty(mapDrCrReadonlyLabel[strPaymentType][cfg.value][strLayoutType])
				? mapDrCrReadonlyLabel[strPaymentType][cfg.value][strLayoutType]
				: cfg.value === 'D' ? 'Debit Trnsaction' : 'Credit Transaction';
		$('#txnInfoLink').remove();
		var objTxnInfoLink = $('<div>').attr({
					'class' : strCssClass,
					'id' : 'txnInfoLink'
				});
		$('<i class="fa fa-check"></i>&nbsp;<span>' + strDrCrLabel + '</span>')
				.appendTo(objTxnInfoLink);
		objTxnInfoLink.prependTo($('#drCrFlagDiv'));
		$("#drCrFlagDiv .col-sm-6, #drCrFlagDiv .radio-inline,#drCrFlagDiv .checkbox-inline, #drCrFlagDiv .checkboxLbl")
				.addClass('hidden');
	} else if (cfg.value) {
		$('#drCrFlagDiv').removeClass('hidden');
	}
}
function handleDrCrFlagOnViewPaymentInstrument(cfg, strPostFix, strValue) {
	if (cfg && cfg.value && cfg.readOnly && 'true' === cfg.readOnly) {
		var strDrCrLabel = cfg.value!=='B' && !isEmpty(mapDrCrReadonlyLabel[strPaymentType][cfg.value][strLayoutType])
				? mapDrCrReadonlyLabel[strPaymentType][cfg.value][strLayoutType]
				: cfg.value === 'D' ? 'Debit Trnsaction' : 'Credit Transaction';
		if ('D' === cfg.value) {
			$('.drCrFlagD' + strPostFix).empty();
			$('.drCrFlagC' + strPostFix).remove();
			$('.drCrFlagD' + strPostFix).removeClass('col-sm-6');
			$('.drCrFlagD' + strPostFix).addClass('col-sm-12');
			$('.drCrFlagD' + strPostFix).removeClass('hidden');
			$('<div class="form-group"><span><i class="fa fa-check"></i> '
					+ strDrCrLabel + '</span></div>').appendTo($('.drCrFlagD'
					+ strPostFix));
		} else if ('C' === cfg.value) {
			$('.drCrFlagC' + strPostFix).empty();
			$('.drCrFlagD' + strPostFix).remove();
			$('.drCrFlagC' + strPostFix).removeClass('col-sm-6');
			$('.drCrFlagC' + strPostFix).addClass('col-sm-12');
			$('.drCrFlagC' + strPostFix).removeClass('hidden');
			$('<div class="form-group"><span><i class="fa fa-check"></i> '
					+ strDrCrLabel + '</span></div>').appendTo($('.drCrFlagC'
					+ strPostFix));
		} else if ('B' === cfg.value) {
			$('.drCrFlagC' + strPostFix).removeClass('hidden');
			$('.drCrFlagD' + strPostFix).removeClass('hidden');
		}

	} else {
		if (cfg.value && 'B' !== cfg.value) {
			$('.drCrFlagD' + strPostFix).addClass('hidden');
			$('.drCrFlagC' + strPostFix).addClass('hidden');
		}
		if (strValue === 'Debit')
			$('.drCrFlagD' + strPostFix).removeClass('hidden');
		if (strValue === 'Credit')
			$('.drCrFlagC' + strPostFix).removeClass('hidden');
	}
	$('.drCrFlag' + strPostFix).text('(' + strValue + ')');
	if (strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT')
		toggleAccountTransferAccountLabel(cfg.value);
}
function fetchClientAccountData(strDrawerAccountNo) {
	var jsonData = null;
	$.ajax({
				async : false,
				url : "services/userseek/clientAccountSeek.json",
				dataType : "json",
				data : {
					$autofilter : strDrawerAccountNo
				},
				success : function(data) {
					jsonData = data.d.preferences[0];
				}
			});
	return jsonData;
}
function handleDrawerAccountInfoPopulation(strDrawerAccountNo) {
	var drawerAccountData = fetchClientAccountData(strDrawerAccountNo);
	displayFiInfoForRecevingAccount(drawerAccountData, true);
}
function handleAccountNoRefreshLink(cfg) {
	if (cfg && cfg.values && cfg.values.length > 1) {
		$('.accountNoBalanceRefreshLink, .accountNoBalanceInfoSpan')
				.addClass('hidden');
		$('.accountNoLinkLabel').removeClass('hidden');
	} else if (cfg && cfg.values && cfg.values.length == 1) {
		var ctrl = $('.accountNoBalanceRefreshLink');
		if (ctrl) {
			ctrl.unbind('click');
			ctrl.bind('click', function() {
				if (strPaymentType === 'BATCHPAY' && !isEmpty(cfg.values[0]))
					paintPaymentAccountBalance(cfg.values[0],
							strPaymentHeaderIde, true);
				if (strPaymentType === 'QUICKPAY' && !isEmpty(cfg.values[0]))
					paintPaymentAccountBalance(cfg.values[0],
							strPaymentInstrumentIde, true);
				if (strPaymentType === 'QUICKPAYSTI' && !isEmpty(cfg.values[0]))
					paintPaymentAccountBalance(cfg.values[0],
							strPaymentInstrumentIde, true);
			});
			if (strPaymentType === 'BATCHPAY' && !isEmpty(cfg.values[0]))
				paintPaymentAccountBalance(cfg.values[0], strPaymentHeaderIde);
			if (strPaymentType === 'QUICKPAY' && !isEmpty(cfg.values[0]))
				paintPaymentAccountBalance(cfg.values[0],
						strPaymentInstrumentIde);
			if (strPaymentType === 'QUICKPAYSTI' && !isEmpty(cfg.values[0]))
				paintPaymentAccountBalance(cfg.values[0],
						strPaymentInstrumentIde);
			$('.accountNoLinkLabel').addClass('hidden');
			$('.accountNoBalanceRefreshLink').removeClass('hidden');
		}
	} else if (cfg && cfg.value) {
		var ctrl = $('.accountNoBalanceRefreshLink');
		if (ctrl) {
			ctrl.unbind('click');
			ctrl.bind('click', function() {
						if (strPaymentType === 'BATCHPAY'
								&& !isEmpty(cfg.value))
							paintPaymentAccountBalance(cfg.value,
									strPaymentHeaderIde, true);
						if (strPaymentType === 'QUICKPAY'
								&& !isEmpty(cfg.value))
							paintPaymentAccountBalance(cfg.value,
									strPaymentInstrumentIde, true);
						if (strPaymentType === 'QUICKPAYSTI'
								&& !isEmpty(cfg.value))
							paintPaymentAccountBalance(cfg.value,
									strPaymentInstrumentIde, true);
					});
			if (strPaymentType === 'BATCHPAY' && !isEmpty(cfg.value))
				paintPaymentAccountBalance(cfg.value, strPaymentHeaderIde);
			if (strPaymentType === 'QUICKPAY' && !isEmpty(cfg.value))
				paintPaymentAccountBalance(cfg.value, strPaymentInstrumentIde);
			if (strPaymentType === 'QUICKPAYSTI' && !isEmpty(cfg.value))
				paintPaymentAccountBalance(cfg.value, strPaymentInstrumentIde);
			$('.accountNoLinkLabel').addClass('hidden');
			$('.accountNoBalanceRefreshLink').removeClass('hidden');
		}
	}
}
function getPaymentAccountBalance(strAccountNo, strIdentifier) {
	var jsonData = null;
	if (!isEmpty(strIdentifier)) {
		$.ajax({
					type : "POST",
					url : 'services/getBalance/(' + strIdentifier + ')/('
							+ strAccountNo + ').json',
					async : false,
					complete : function(XMLHttpRequest, textStatus) {
						// $.unblockUI();
						// if ("error" == textStatus)
						// alert("Unable to complete your request!");
					},
					success : function(data) {
						if (data && data.d && data.d.SUCCESS
								&& data.d.SUCCESS === 'SUCCESS') {
							jsonData = data.d.value;
						}
					}
				});
		return jsonData;
	}
}
function paintPaymentAccountBalance(strAccountNo, strIdentifier, isRefresh) {
	if (isEmpty(strAccountBalanceData) || isRefresh)
		strAccountBalanceData = getPaymentAccountBalance(strAccountNo,
				strIdentifier);

	if ($(".accountNoBalanceInfoSpan").hasClass('hidden'))
		$(".accountNoBalanceInfoSpan").removeClass('hidden');
	$(".accountNoBalanceInfoSpan").text('Balance : ' + strAccountBalanceData);
}
/**
 * To be shown for Template and Payment using Template if checked
 */
function handleHoldZeroDollarFlag(strPmtType, isPaymentUsingTemplate) {
	var fieldDiv = strPmtType === 'B' ? 'holdHdrDiv' : 'holdDiv';
	if (!isEmpty(strPmtType)) {
		if (strPmtType === 'Q')
			var chrHoldZeroDollar = $('input[name="hold"]:checkbox:checked')
					.val()
		if (isPaymentUsingTemplate
				&& ((isEmpty(chrHoldZeroDollar) || chrHoldZeroDollar === 'N')
				|| (chrHoldZeroDollar === 'Y' && isEmpty(strPaymentInstrumentIde)))) {
			var ctrlDiv = $('#' + fieldDiv);
			if (ctrlDiv)
				$(ctrlDiv).addClass('hidden');
		} else if (!isPaymentUsingTemplate) {
			var ctrlDiv = $('#' + fieldDiv);
			if (ctrlDiv)
				$(ctrlDiv).empty();
		} else if (strPmtType === 'B') {
			var ctrlDiv = $('#' + fieldDiv);
			if (ctrlDiv)
				$(ctrlDiv).empty();
		}
	}
}
/**
 * To be shown for Template and Payment using Template if checked
 */
function handleHoldUntilFlag(strPmtType) {
	var fieldDiv = strPmtType === 'B'
			? 'holdUntilFlagHdrDiv'
			: 'holdUntilFlagDiv';
	var ctrlDiv = $('#' + fieldDiv);
	if (ctrlDiv)
		$(ctrlDiv).empty();
}
function handleDebitLevelAtInstrumentFields(chrDebitAccountLevel,
		chrValueDateLevel, chrProductLevel, strPmtType) {
	var strPostFix = strPmtType === 'B' ? 'HdrDiv' : 'Div';
	if (strEntryType === 'PAYMENT' || strEntryType === 'SI') {
		if (chrDebitAccountLevel === 'B' && strPmtType === 'Q') {
			$('#accountNo' + strPostFix).addClass('hidden');
			$('#companyId' + strPostFix).addClass('hidden');
		}
		if (chrDebitAccountLevel === 'I') {
			$('#accountNo').bind("click", function() {
						handleDebitAccountChange(false);
					});
			if (!isEmpty($('#accountNo').val()))
				$('#accountNo').trigger('click');
		}
		if (chrValueDateLevel === 'B' && strPmtType === 'Q')
			$('#txnDate' + strPostFix).addClass('hidden');

	} else {
		if (chrDebitAccountLevel === 'B' && strPmtType === 'Q') {
			$('#accountNo' + strPostFix).addClass('hidden');
			$('#companyId' + strPostFix).addClass('hidden');
		}
		if (chrValueDateLevel === 'B' && strPmtType === 'Q')
			$('#txnDate' + strPostFix).addClass('hidden');
		//else if(chrValueDateLevel ==='I')
		//	$('#txnDate'+postFix).removeClass('hidden');

	}
	//if(chrDebitAccountLevel ==='I' || chrValueDateLevel==='I')
	//	$('.batchHeaderSectionLbl').text('Sender Details');
	if (chrProductLevel && chrProductLevel === 'I' && strPaymentType
			&& strPaymentType === 'BATCHPAY' && strPaymentHeaderIde
			&& !isEmpty(strPaymentHeaderIde)) {
		$('#txnCurrencyHdr').attr('disabled', 'disabled');

	}
}
function paintChangedFxDetails(data, strClassName) {
	var objOnHoverInfo = [];
	if (data.d.changedFxRate) {
		var objInfo = new Object();
		objInfo['label'] = getLabel('lblChangedFxRate', "Original FX Rate");
		objInfo['value'] = data.d.changedFxRate;
		objOnHoverInfo.push(objInfo);
	}
	if (data.d.changedPaymentAmount) {
		var objInfo = new Object();
		objInfo['label'] = getLabel('lblChangedPaymentAmnt',
				"Original Payment Amount");
		objInfo['value'] = data.d.changedPaymentAmount;
		objOnHoverInfo.push(objInfo);
	}
	if (data.d.changedDebitAmount) {
		var objInfo = new Object();
		objInfo['label'] = getLabel('lblChangedDebitAmnt',
				"Original Debit Amount");
		objInfo['value'] = data.d.changedDebitAmount;
		objOnHoverInfo.push(objInfo);
	}
	if (objOnHoverInfo && objOnHoverInfo.length > 0)
		paintChangedFxDetailsOnHover(objOnHoverInfo, strClassName);
}
function paintChangedFxDetailsOnHover(data, strClassName) {
	
	var strHtml = $('<div id="changedFxDetails">');
	if (data) {
		$.each(data, function(index, objInfo) {
					if (objInfo) {
						// var strClassName = objInfo.colSize ?
						// 'col-sm-'+objInfo.colSize : 'col-sm-6';
						var strLabel = objInfo.label ? objInfo.label : '';
						var strValue = objInfo.value ? objInfo.value : '';
						// var blnOnSameRow = objInfo.onSameRow
						var objInfoDiv = $('<div>').attr('class', 'row');
						var objColumnDiv = $('<div>')
								.attr('class', 'col-sm-12');
						var objInternalDiv = $('<div>').attr('class',
								'form-group');
						var objLabel = $('<label>').text(strLabel + ' :');
						var objValue = $('<span>').text(' ' +strValue);
						$(objLabel).appendTo($(objInternalDiv));
						$(objValue).appendTo($(objInternalDiv));
						$(objInternalDiv).appendTo($(objColumnDiv));
						$(objColumnDiv).appendTo($(objInfoDiv));
						$(objInfoDiv).appendTo($(strHtml));
					}
				});
	}

	$('.' + strClassName).bind('mouseover', function(e) {
				$(strHtml).css({
							'position' : 'absolute',
							'border' : '1px solid #868686',
							'min-height' : '37px',
							'overflow' : 'auto',
							'min-width' : '250px',
							'z-index' : '1000',
							'padding' : '6px 12px 0 12px',
							'color' : '#333333',
							'background-color' : '#F1F1F1',
							'width' : 'auto'
						}).appendTo($('.' + strClassName));
			});

	$('.' + strClassName).bind('mouseout', function(e) {
				$('#changedFxDetails').remove();
			});
}
function pushReceiverFieldsIntoArray(mapCtrlFields, objData, blnIsSelected,blnDefaultSelected) {
	var data = objData, arrRcvrFlds = {}, fieldId = '';
	var chrBeneType = strReceiverType && strReceiverType === 'A' ? 'A' : 'R';
	if (data && data.d && data.d.receivableEntry
			&& data.d.receivableEntry.beneficiary)
		arrRcvrFlds = data.d.receivableEntry.beneficiary;

	if (arrRcvrFlds) {
		if ("R" === chrBeneType && arrRcvrFlds.registeredBene) {
			if (arrRcvrFlds.registeredBene
					&& arrRcvrFlds.registeredBene.length > 0) {
				$.each(arrRcvrFlds.registeredBene, function(index, cfg) {
					fieldId = cfg.fieldName;
					if (fieldId === 'drawerCode'
							|| fieldId === 'drawerDescription') {
						mapCtrlFields[fieldId] = {};
						mapCtrlFields[fieldId]['isSelected'] = blnIsSelected;
						mapCtrlFields[fieldId]['isRequiredDefault'] = (cfg.displayMode === '3' && blnDefaultSelected==true || false);
					}
				});
			}
		}
		if ("A" === chrBeneType && arrRcvrFlds.adhocBene) {
			if (arrRcvrFlds.adhocBene && arrRcvrFlds.adhocBene.length > 0) {
				$.each(arrRcvrFlds.adhocBene, function(index, cfg) {
					fieldId = cfg.fieldName;
					if (fieldId === 'drawerCode'
							|| fieldId === 'drawerDescription'
							|| fieldId === 'drawerAccountNo'
							|| fieldId === 'beneficiaryBankIDType'
							|| fieldId === 'beneAccountType'
							|| ((strLayoutType === 'ACHLAYOUT'
									|| strLayoutType === 'ACHIATLAYOUT' || strLayoutType === 'MIXEDLAYOUT') && (fieldId === 'receiverID' || fieldId === 'beneficiaryBankIDCode'))) {
						mapCtrlFields[fieldId] = {};
						mapCtrlFields[fieldId]['isSelected'] = blnIsSelected;
						mapCtrlFields[fieldId]['isRequiredDefault'] = (blnDefaultSelected==true && (cfg.displayMode === '3' || false));
					}
				});
			}
		}
	}
}
function isPrenoteChecked(chrPayType) {
	var blnPrenoteChecked = $('input[name="prenote"]').is(':checked');
	return blnPrenoteChecked
}
function getMapCtrlKeyName(key) {
	var strPostFix = strReceiverType && strReceiverType === 'A' ? 'A' : 'R';
	switch (key) {
		case 'drawerCode' :
			key = '';
			break;
		case 'drawerDescription' :
		case 'drawerAccountNo' :
		case 'beneficiaryBankIDType' :
		case 'beneAccountType' :
		case 'receiverID' : 
			key = key + strPostFix;
			break;
		case 'beneficiaryBankIDCode' :
			key = 'beneficiaryBankIDCodeAutoCompleter';
			break;
	}
	return key;
}
function handleReceiverFieldsOnPrenoteChange() {
	applyControlFieldsValidation(strPaymentType, isPrenoteChecked());
}
/*---------- Helper Function Ends --------------------*/

/*---------- Registered Receiver More Details Starts --------------------*/
function toggleRegisteredReceiverMoreDetails(strBeneCode) {
	var ctrl = $('#regReceiverMoreDetailsLink')
	ctrl.unbind('click');
	ctrl.bind('click', function() {
				var ctrl = $('.registeredReceiverdetails')
				var isHidden = ctrl.hasClass('hidden');
				//var receiverDetails = getRegisteredReceiverMoreDetails(strBeneCode);
				if (isHidden) {
					//doClearMoreDetailsForRegisteredReceiver();
					$("#plusIconR").removeClass('fa-plus');
					$("#plusIconR").addClass('fa-minus');
					$("#regReceiverMoreDetailsLink").text("View less details");
				} else {
					$("#regReceiverMoreDetailsLink")
							.text("View Additional details");
					$("#plusIconR").removeClass('fa-minus');
					$("#plusIconR").addClass('fa-plus');
				}
				//if (receiverDetails)
				//	$.each(receiverDetails, function(index, value) {
//								var divId = index + "_RInfoDiv";
//								var fieldId = index + "_RInfoLbl";
//								if ($("#" + fieldId).length != 0) {
//									// TODO : Hiding divs which are not present
//									// Division into Sections
//									// $("#" + divId).removeClass("hidden");
//									$("#" + fieldId).text(value);
//								}
//							});
				ctrl.toggleClass('hidden');
			});
}

function getRegisteredReceiverMoreDetails(strBeneCode) {
	var receiverDetails = null;
	$.ajax({
				type : "POST",
				url : "services/reciverdetailseek/" + strBeneCode + ".json",
				complete : function(XMLHttpRequest, textStatus) {
					if ("error" == textStatus) {
						var arrError = new Array();
						arrError.push({
									"errorCode" : "Message",
									"errorMessage" : mapLbl['unknownErr']
								});
						paintErrors(arrError);
					}
				},
				async : false,
				data : null,
				success : function(data) {
					receiverDetails = data;
				}
			});
	return receiverDetails;
}

function doClearMoreDetailsForRegisteredReceiver() {
	$('#registeredReceiverdetails').find('span').each(function() {
				$(this).val('');
			});
}
function toggleRegisteredReceiverInstViewMoreDetails(strBeneCode) {
	var ctrl = $('#registeredReceiverDetailsLinkInstView');
	if (ctrl) {
		ctrl.unbind('click');
		$('.registeredReceiverDetailsInstView').addClass('hidden');
		ctrl.bind('click', function() {
			var ctrl1 = $('.registeredReceiverDetailsInstView')
			var isHidden = ctrl1.hasClass('hidden');
			if (isHidden) {
				// Data being painted with receivableEntry json
				//var receiverDetails = getRegisteredReceiverMoreDetails(strBeneCode);
				//if (receiverDetails)
				//	$.each(receiverDetails, function(key, value) {
				//				$("." + key + 'R_InstView').html(value);
				//			});
				$("#registeredReceiverDetailsLinkInstView")
						.text("View Less Details");
			} else {
				$("#registeredReceiverDetailsLinkInstView")
						.text("View Additional Details");
			}
			ctrl1.toggleClass('hidden');
		});
	}
}

// TODO: To be implemented
function handleDrawerAccountNo() {
	var accNoVal = $('#drawerAccountNo').val();
	if (isEmpty(accNoVal)) {
		$('#receivingAccfiInfSpan').text('');
	}
}
/*---------- Registered Receiver More Details Ends --------------------*/

/*---------- Registered Odering Party More Details Starts --------------------*/
function toggleRegisteredOrderingPartyMoreDetails() {
	var ctrl = $('#registeredOrderingPartyDetails')
	ctrl.toggleClass('hidden');
}

function doPaintMoreDetailsForRegisteredOrderingParty(code, elementId,
		isViewMode) {
	var ctrl = $('#' + elementId);
	var isHidden = ctrl.hasClass('hidden');
	var divPostFix = isViewMode ? '_OVInfoDiv' : '_ORInfoDiv';
	var lblPostFix = isViewMode ? '_OVInfoLbl' : '_ORInfoLbl';
	var linkId = isViewMode
			? 'orderingPartyMoreDetailsViewOnlyLink'
			: 'orderingPartyMoreDetailsLink';
	togglePlusIcon(isHidden, code, linkId, divPostFix, lblPostFix, isViewMode);
	ctrl.toggleClass('hidden');
}
function togglePlusIcon(isHidden, code, linkId, divPostFix, lblPostFix,
		isViewMode) {
	if (isHidden) {
		doClearMoreDetailsForRegisteredOrderingParty();
		if (!isEmpty(code)) {
			var orderingPartyDetails = getRegisteredOrderingPartyDetails(code);
			var line4 = null;
			if(orderingPartyDetails){
			$.each(orderingPartyDetails, function(index, value) {
						var fieldId = index + lblPostFix;
						if ($("#" + fieldId).length != 0) {
							$("#" + fieldId).text(value);
						}
					});		
			$("#line1" + lblPostFix).text(orderingPartyDetails.orderDescription);
			$("#line2" + lblPostFix).text(orderingPartyDetails.addr1.substring(0,35));
			$("#line3" + lblPostFix).text(orderingPartyDetails.addr1.substring(35,70));
			if (!isEmpty(orderingPartyDetails.benCountry))
				line4 = orderingPartyDetails.benCountry.substring(0,10);
			if (!isEmpty(orderingPartyDetails.benState)  && orderingPartyDetails.benState != 'NONE')
				line4 = line4 + orderingPartyDetails.benState.substring(0,10);
			if (!isEmpty(orderingPartyDetails.benCity))
				line4 = line4 + orderingPartyDetails.benCity.substring(0,10);
			if (!isEmpty(orderingPartyDetails.benPostCode))
				line4 = line4 + orderingPartyDetails.benPostCode;
			if (!isEmpty(line4))
				$("#line4" + lblPostFix).text(line4.substring(0,35)); 
			}
		}
		$("#" + linkId).text("View Less Details");
		if (isViewMode) {
			$("#plusIconOV").removeClass('fa-plus');
			$("#plusIconOV").addClass('fa-minus');
		} else {
			$("#plusIconA").removeClass('fa-plus');
			$("#plusIconA").addClass('fa-minus');
		}
	} else {
		$("#" + linkId).text("View Additional Details");
		if (isViewMode) {
			$("#plusIconOV").removeClass('fa-minus');
			$("#plusIconOV").addClass('fa-plus');
		} else {
			$("#plusIconA").removeClass('fa-minus');
			$("#plusIconA").addClass('fa-plus');
		}
	}
}

function getRegisteredOrderingPartyDetails(code) {
	var orderingPartyDetails = null;
	$.ajax({
				type : "POST",
				url : "services/ordpartydetailseek/" + code + ".json",
				complete : function(XMLHttpRequest, textStatus) {
					if ("error" == textStatus) {
						arrError.push({
									"errorCode" : "Message",
									"errorMessage" : mapLbl['unknownErr']
								});
						paintErrors(arrError);
					}
				},
				async : false,
				data : null,
				success : function(data) {
					orderingPartyDetails = data;

				}
			});
	return orderingPartyDetails;
}

function doClearMoreDetailsForRegisteredOrderingParty() {
	$('#registeredOrderingPartyDetails').find('span').each(function() {
				$(this).val('');
			});
}

/*---------- Adhoc Ordering Party Details Starts -----------------------*/
function toggleOrderingParty(charOrderingPartyType, clearFields) {
	var clsHide = 'hidden';
	if (!isEmpty(charOrderingPartyType)) {
		if (charOrderingPartyType === 'A') {
			strOrderingPartyType = 'A';
			$('.adhocOrderingParty').removeClass(clsHide);
			$('.registeredOrderingParty').addClass(clsHide);
			// populateCountryValuesInDropdown('benCountry_OA');

			$('#benCountry_OA').unbind('change');
			// $('#benCountry_OA').bind('change', function() {
			// populateStateValuesInDropdown('benState_OA',
			// 'benCountry_OA');
			// });
		} else if (charOrderingPartyType === 'R') {
			strOrderingPartyType = 'R';
			$('.adhocOrderingParty').addClass(clsHide);
			$('.registeredOrderingParty').removeClass(clsHide);
		}
		clearOrderingParty(charOrderingPartyType, clearFields);
	}
}

function clearOrderingParty(charOrderingPartyType, clearFields) {
	if (clearFields === true) {
		if (charOrderingPartyType === 'B' || charOrderingPartyType === 'A')
			$('#orderingParty,#orderingPartyEmail_R').val('');
		if (charOrderingPartyType === 'B' || charOrderingPartyType === 'R') {
			$('#orderingPartyDescription_OA,#orderingParty_OA,#emailIdNmbr_OA,#benCountry_OA,#benState_OA,#benCity_OA,#benPostCode_OA')
					.val('');
		}
	}

}

function toggleOrderingPartyCodeNecessity() {
	var clsReq = 'required';
	if ($('#saveOrderingParty_OA').is(':checked')) {
		$('#orderingPartyDescription_OA,#orderingParty_OA,#benCountry_OA,#benState_OA,#benCity_OA,#benPostCode_OA')
				.addClass(clsReq);
		$('#saveOrderingParty_OA').val('Y');
		$('#orderingPartyDescription_OA,#orderingParty_OA,#benCountry_OA,#benState_OA,#benCity_OA,#benPostCode_OA')
				.blur(function mark() {
							markRequired($(this));
						});
	} else {
		$('#orderingPartyDescription_OALbl').removeClass(clsReq);
		$('#saveOrderingParty_OA').val('N');
		$('#orderingPartyDescriptionAOP').unbind('blur');
		$('#orderingPartyDescriptionAOP').removeClass('requiredField');
	}
}

function refreshSwiftMsg() {
	var modelOrderCode = $("#orderingParty_OA").val();
		var orderCode = document.getElementById("orderingPartyDescription_OA");
		var add1 = document.getElementById("addr1_OA");
		var benCountry = document.getElementById("benCountry_OA");
		var benState = document.getElementById("benState_OA");
		var benCity = document.getElementById("benCity_OA");
		var benPostCode = document.getElementById("benPostCode_OA");
		var line4;
		if (orderCode != null)
			document.getElementById("line1_OA").value = orderCode.value;
		else
			document.getElementById("line1_OA").value = modelOrderCode;
		if (add1 != null) {
			document.getElementById("line2_OA").value = add1.value.substring(0,
					35);;
			document.getElementById("line3_OA").value = add1.value.substring(
					35, 70);;
		}
		if (benCountry != null)
			line4 = benCountry.value.substring(0, 10);
		if (benState != null && benState.value != 'NONE')
			line4 = line4 + benState.value.substring(0, 10);
		if (benCity != null)
			line4 = line4 + benCity.value.substring(0, 10);
		if (benPostCode != null)
			line4 = line4 + benPostCode.value.substring(0, 6);
		if (line4 != null)
			document.getElementById("line4_OA").value = line4.substring(0, 35);
}

/*---------- Adhoc Ordering Party Details Ends ------------------------*/

/*---------- Single Instruments Handling Starts Here-------------------*/
function loadPaymentInstrument(strMyProduct) {
	var _intCountBankProduct = 1;
	if (!isEmpty(strMyProduct)) {
		var url = _mapUrl['loadInstrumentFieldsUrl'] + "/" + strMyProduct
				+ ".json";
		$.ajax({
			type : "POST",
			url : url,
			async : false,
			complete : function(XMLHttpRequest, textStatus) {
				if ("error" == textStatus) {
					var arrError = new Array();
					arrError.push({
								"errorCode" : "Message",
								"errorMessage" : mapLbl['unknownErr']
							});
					doHandleUnknownError()
					blockPaymentInstrumentUI(false);
				}
			},
			success : function(data) {
				if (data != null) {
					if (data.d
							&& data.d.message
							&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
						doHandleEmptyScreenErrorForInstrument(data.d.message.errors);
						blockPaymentInstrumentUI(false);
					} else {
						// Checks for Bank Product, if single bank product is
						// found, then fetches product and receiver specific
						// data
						paymentResponseInstrumentData = data;
						if ('B' === strPayUsing && data.d
								&& data.d.receivableEntry
								&& data.d.receivableEntry.standardField) {
							var arrFields = [];
							var _strBankProduct = null;
							arrFields = data.d.receivableEntry.standardField;
							if (arrFields && arrFields.length > 0) {
								$.each(arrFields, function(index, cfg) {
									if ('bankProduct' === cfg.fieldName) {
										_intCountBankProduct = cfg.availableValues
												? cfg.availableValues.length
												: 0;
										if (_intCountBankProduct == 1)
											_strBankProduct = cfg.value;
									}
								});
							}
							if (!isEmpty(_strBankProduct)) {
								refreshPaymentFieldsOnBeneChange(strMyProduct,
										_strBankProduct, strSelectedReceiver);
							} else {
								doRemoveStaticText("transactionWizardPopup");
								paintReceivableInstrumentUI(data, 'Q');
								initateValidation();
								blockPaymentInstrumentUI(false);
								handleEmptyEnrichmentDivs();
							}
						} else {
							doRemoveStaticText("transactionWizardPopup");
							paintReceivableInstrumentUI(data, 'Q');
							initateValidation();
							blockPaymentInstrumentUI(false);
							handleEmptyEnrichmentDivs();
						}
					}
				}
			}
		});
	} else {
		doHandleUnknownError();
		blockPaymentInstrumentUI(false);
	}
}
function readPaymentInstrumentForEdit(strIde, strPhdNumber, strAction) {
	if (strIde) {
		var url = _mapUrl['readSavedBatchInstrumentUrl'];
		var jsondata = {'_mode' : 'EDIT','id':strIde};
		$.ajax({
			type : "POST",
			url : url,
			async : false,
			data : jsondata,
			complete : function(XMLHttpRequest, textStatus) {
				if ("error" == textStatus) {
					doHandleUnknownError();
					blockPaymentInstrumentUI(false);
				}
			},
			success : function(data) {
				if (data != null) {
					if (data.d
							&& data.d.message
							&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
						doHandleEmptyScreenErrorForInstrument(data.d.message.errors);
						blockPaymentInstrumentUI(false);
					} else {
						paymentResponseInstrumentData = data;
						doRemoveStaticText("transactionWizardPopup");
						paintReceivableInstrumentUI(data, 'Q');
						paintPaymentInstrumentActions('EDIT');
						initateValidation();
						if (data.d
								&& data.d.receivableEntry
								&& data.d.receivableEntry.message
								&& (data.d.receivableEntry.message.errors || data.d.receivableEntry.message.success === 'SAVEWITHERROR')) {
							paintErrors(data.d.receivableEntry.message.errors);
						}
						// Paint CashIn Errors
						if (data.d && data.d.receivableEntry
								&& data.d.receivableEntry.adminMessage
								&& data.d.receivableEntry.adminMessage.errors) {
							paintCashInErrors(data.d.adminMessage.errors)
						}
						blockPaymentInstrumentUI(false);
						handleEmptyEnrichmentDivs();
					}
				}
			}
		});
	} else {
		doHandleUnknownError();
		blockPaymentInstrumentUI(false);
	}
	autoFocusFirstElement();
}
function readPaymentInstrumentForView(strIde, strPhdNumber, strAction) {
	if (strIde) {
		var url = _mapUrl['readSavedBatchInstrumentUrl'] ;
		var jsonData = {'id' :strIde ,'_mode' : 'VIEW'};
		$.ajax({
			type : "POST",
			url : url,
			async : false,
			data : jsonData,
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
					if (data.d
							&& data.d.message
							&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
						doHandleEmptyScreenErrorForInstrument(data.d.message.errors);
						blockPaymentInstrumentUI(false);
					} else {
						paymentResponseInstrumentData = data;
						if (data.d && data.d.__metadata
								&& data.d.__metadata._detailId) {
							strPaymentInstrumentIde = data.d.__metadata._detailId;
						}
						doViewPaymentInstrument();

						if (strEntityType == data.d.receivableEntry.receivableHeaderInfo.hdrModule
								&& (strActionStatus === 'Draft'
										|| strActionStatus === 'Pending Submit' || strActionStatus === 'Modification Pending For Submit')) {
							paintPaymentInstrumentActionsForView('SUBMIT');

							toggleBreadCrumbs('tab_3');
						} else {
							//TODO : This is to handled through data.d.receivableEntry.receivableHeaderInfo.hdrActionsMask
							if (strEntityType == data.d.receivableEntry.receivableHeaderInfo.hdrModule
									&& data.d.receivableEntry.receivableHeaderInfo.hdrActionStatus) {
								var hdrActionState = data.d.receivableEntry.receivableHeaderInfo.hdrActionStatus;
								if (hdrActionState == '0'
										|| hdrActionState == '1'
										|| hdrActionState == '2'
										|| (hdrActionState == '4' &&  data.d.receivableEntry.receivableHeaderInfo.pirMode == 'TP')
										|| hdrActionState == '5')
									paintPaymentInstrumentActionsForView('CANCELANDDISCARD');
								else if (hdrActionState == '33' || (hdrActionState == '4' &&  data.d.receivableEntry.receivableHeaderInfo.pirMode == 'SI'))
									paintPaymentInstrumentActionsForView('CANCELDISABLE');
								else if (hdrActionState == '82')
									paintPaymentInstrumentActionsForView('CANCELENABLE');
								else if (hdrActionState == '83'
										|| hdrActionState == '87'
										|| hdrActionState == '86'
										|| hdrActionState == '94'
										|| hdrActionState == '95'
										|| hdrActionState == '79'
										|| hdrActionState == '80'
										|| hdrActionState == '73')
									paintPaymentInstrumentActionsForView('CANCELANDDISCARD');
								else
									paintPaymentInstrumentActionsForView('CANCELONLY');
							} else
								paintPaymentInstrumentActionsForView('CANCELONLY');
							toggleBreadCrumbs('tab_3');

							if (data.d.receivableEntry.receivableHeaderInfo.hdrActionsMask) {
								var strAuthLevel = data.d.receivableEntry.receivableHeaderInfo.authLevel;
								var strDetailId = data.d.__metadata._detailId;
								var strParentId = data.d.receivableEntry.receivableHeaderInfo.hdrIdentifier
								paintPaymentInstrumentGroupActions(
										data.d.receivableEntry.receivableHeaderInfo.hdrActionsMask,
										'VIEW', strAuthLevel, strParentId,
										strDetailId, data.d.receivableEntry.receivableHeaderInfo.showPaymentAdvice);
							}
						}
						if (data.d
								&& data.d.receivableEntry
								&& data.d.receivableEntry.message
								&& (data.d.receivableEntry.message.errors || data.d.receivableEntry.message.success === 'SAVEWITHERROR')) {
							paintErrors(data.d.receivableEntry.message.errors);
						}
						// Paint CashIn Errors
						if (data.d && data.d.receivableEntry
								&& data.d.receivableEntry.adminMessage
								&& data.d.receivableEntry.adminMessage.errors) {
							paintCashInErrors(data.d.adminMessage.errors)
						}
						blockPaymentInstrumentUI(false);
					}
				}
			}
		});
	} else {
		doHandleUnknownError();
		blockPaymentInstrumentUI(false);
	}
}

function doHandleUnknownError() {
	isScreenBroken = true;
	var arrError = [{
				errorMessage : mapLbl['unknownErr'],
				errorCode : 'ERR'
			}];
	doHandleEmptyScreenErrorForInstrument(arrError);
}
function doHandleEmptyScreenErrorForInstrument(arrError) {
	// TODO : Error Handling to be done here
	isScreenBroken = true;
	paintErrors(arrError);
	$('#transactionWizardPopup').addClass('hidden');
	$('#messageContentHeaderDiv').appendTo($('#emptyScreenErrorInstDiv'));
	$('#emptyScreenErrorInstDiv').toggleClass("ui-helper-hidden");
	paintPaymentInstrumentActionsForView('CANCELONLY');
}
function doSavePaymentInstrument(blnPrdCutOff) {
	if (!doValidateAccounts())
		return false;
	var jsonData = generatePaymentInstrumentJson(), jsonArgs = {};
	var canSave = validateRequiredFields();
	if (blnPrdCutOff === true) {
		jsonData.d.receivableEntry.standardField.push({
					fieldName : 'prdCutoffFlag',
					value : 'Y'
				});
	}
	jsonArgs.action = 'SAVE';
	jsonArgs.jsonData = jsonData;
	doClearMessageSection();
	savePaymentInstrument(jsonData, postHandleSavePaymentInstrument, jsonArgs);
}
function doSaveAndNextPaymentInstrument(blnPrdCutOff) {
	if (!doValidateAccounts())
		return false;
	var jsonData = generatePaymentInstrumentJson(), jsonArgs = {};
	var canSave = validateRequiredFields();
	if (blnPrdCutOff === true) {
		jsonData.d.receivableEntry.standardField.push({
					fieldName : 'prdCutoffFlag',
					value : 'Y'
				});
	}
	jsonArgs.action = 'SAVEANDNEXT';
	jsonArgs.jsonData = jsonData;
	doClearMessageSection();
	savePaymentInstrument(jsonData, postHandleSavePaymentInstrument, jsonArgs);
}
function doUpdatePaymentInstrument(blnPrdCutOff) {
	if (!doValidateAccounts())
		return false;
	var jsonData = generatePaymentInstrumentJson(), jsonArgs = {};
	var canSave = validateRequiredFields();
	// jsonData.d.__metadata._headerId = strPaymentHeaderIde;
	jsonData.d.__metadata._detailId = strPaymentInstrumentIde;
	if (blnPrdCutOff === true) {
		jsonData.d.receivableEntry.standardField.push({
					fieldName : 'prdCutoffFlag',
					value : 'Y'
				});
	}
	jsonArgs.action = 'UPDATE';
	jsonArgs.jsonData = jsonData;
	doClearMessageSection();
	savePaymentInstrument(jsonData, postHandleSavePaymentInstrument, jsonArgs);
	// doSavePaymentInstrument(blnPrdCutOff);
}
function doUpdateAndNextPaymentInstrument(blnPrdCutOff) {
	if (!doValidateAccounts())
		return false;
	var jsonData = generatePaymentInstrumentJson(), jsonArgs = {};
	var canSave = validateRequiredFields();
	// jsonData.d.__metadata._headerId = strPaymentHeaderIde;
	jsonData.d.__metadata._detailId = strPaymentInstrumentIde;
	if (blnPrdCutOff === true) {
		jsonData.d.receivableEntry.standardField.push({
					fieldName : 'prdCutoffFlag',
					value : 'Y'
				});
	}
	jsonArgs.action = 'UPDATEANDNEXT';
	jsonArgs.jsonData = jsonData;
	doClearMessageSection();
	savePaymentInstrument(jsonData, postHandleSavePaymentInstrument, jsonArgs);
	// doSavePaymentInstrument(blnPrdCutOff);
}
function getDiscardConfirmationPopup(strPmtType) {
	_objDialog = $('#discardConfirmationPopup');
	_objDialog.dialog({
				bgiframe : true,
				autoOpen : false,
				modal : true,
				resizable : false,
				width : "320px",
				buttons : {
					"Ok" : function() {
						$(this).dialog("close");
						if (strPaymentType === 'BATCHPAY') {
							if ('Q' === strPmtType)
								doDiscardBatchInstrumentFromTxnWizard();
							else
								doHandlePaymentHeaderActions('discard', true);
						} else {
							doHandlePaymentInstrumentAction('discard', true);
						}
					},
					Cancel : function() {
						$(this).dialog('destroy');
					}
				}
			});
	_objDialog.dialog('open');
};
function doHandleRejectAction(strAction, strPmtType, blnRedirectToSummary) {
	doClearMessageSection();
	showRejectVerifyPopUp(strAction, strPmtType, blnRedirectToSummary);
}

function showRejectVerifyPopUp(strAction, strPmtType, blnRedirectToSummary) {
	var titleMsg = '', fieldLbl = '';
	/*
	 * if (strAction === 'verify') { titleMsg =
	 * getLabel('instrumentVerifyRemarkPopUpTitle', 'Please enter verify
	 * remark'); fieldLbl = getLabel('instrumentVerifyRemarkPopUpFldLbl',
	 * 'Verify Remark'); } else
	 */
	if (strAction === 'reject') {
		titleMsg = getLabel('instrumentReturnRemarkPopUpTitle',
				'Please enter return remark');
		fieldLbl = getLabel('instrumentReturnRemarkPopUpFldLbl',
				'Return Remark');
	}
	getRemarksPopup(270, titleMsg, fieldLbl, strPmtType, blnRedirectToSummary);
}

function getRemarksPopup(intHeight, strTitle, lblTitle, strPmtType,
		blnRedirectToSummary) {
	var fld = document.getElementById('taRemarks');
	if (fld) {
		fld.value = "";
	}
	_objDialog = $('#rrDialog');
	$('#rrField').text(lblTitle);
	_objDialog.dialog({
				bgiframe : true,
				autoOpen : false,
				height : intHeight,
				modal : true,
				resizable : false,
				width : "320px",
				title : strTitle,
				open : function() {
					document.getElementById('taRemarks').focus();
				},
				buttons : {
					"Ok" : function() {
						$(this).dialog("close");
						_setRemarksDetail(document.getElementById('taRemarks'),
								strPmtType, blnRedirectToSummary);
					},
					Cancel : function() {
						$(this).dialog('destroy');
					}
				}
			});
	_objDialog.dialog('open');
};

function _setRemarksDetail(ctrl, strPmtType, blnRedirectToSummary) {
	var _strRemarks = null;
	if (ctrl) {
		_strRemarks = ctrl.value;
	}
	_objDialog.dialog('destroy');
	if (strPmtType === 'B') {
		doHandlePaymentHeaderActions('reject', _strRemarks);
	} else if (strPmtType === 'Q') {
		doHandlePaymentInstrumentAction('reject', blnRedirectToSummary,
				_strRemarks);
	}
};

function doHandlePaymentInstrumentAction(strAction, blnRedirectToSummary,
		strRemarks) {
	if (strAction) {
		switch (strAction) {
			case 'discard' :
				doDiscardPaymentInstrument(strAction, strRemarks);
				break;
			case 'submit' :
				doSubmitPaymentInstrument(strAction, strRemarks);
				break;
			default :
				doHandlePaymentInstrumentGroupAction(strAction, strRemarks,
						blnRedirectToSummary);
		}
	}
}
function doHandlePaymentInstrumentGroupAction(strAction, strRemarks,
		blnRedirectToSummary) {
	var arrayJson = new Array();
	var strIdentifier = null, strMsg = '';
	if (paymentResponseInstrumentData
			&& paymentResponseInstrumentData.d
			&& paymentResponseInstrumentData.d.receivableEntry
			&& paymentResponseInstrumentData.d.receivableEntry.receivableHeaderInfo
			&& paymentResponseInstrumentData.d.receivableEntry.receivableHeaderInfo.hdrIdentifier) {
		strIdentifier = paymentResponseInstrumentData.d.receivableEntry.receivableHeaderInfo.hdrIdentifier;
	}
	if (strIdentifier) {
		if (isEmpty(strRemarks)) {
			arrayJson.push({
						serialNo : 0,
						identifier : strIdentifier,
						userMessage : ''
					});
		} else {
			arrayJson.push({
						serialNo : 0,
						identifier : strIdentifier,
						userMessage : strRemarks
					});
		}
		$.ajax({
			url : _mapUrl['batchHeaderActionUrl'] + '/' + strAction + '.json',
			contentType : "application/json",
			data : JSON.stringify(arrayJson),
			type : 'POST',
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
			success : function(jsonRes) {
				if (jsonRes && jsonRes.d && jsonRes.d.instrumentActions) {
					var arrResult = jsonRes.d.instrumentActions;
					if (arrResult && arrResult.length == 1) {
						if (arrResult[0].success === 'Y'
								&& blnRedirectToSummary) {
							goToPage(_mapUrl['cancelInstrumentUrl'], 'frmMain');
						} else if (arrResult[0].success === 'N') {
							if (arrResult[0].errors) {
								var arrError = arrResult[0].errors, isProductCutOff = false, errCode = null;
								if (arrError && arrError.length > 0) {
									$.each(arrError, function(index, error) {
												strMsg = strMsg + error.code + ' : ' + error.errorMessage;
												//strMsg = error.errorMessage;
												errCode = error.code;
												if (errCode
														&& (errCode
																.toUpperCase()
																.indexOf("WARN") >= 0)
														|| errCode === 'GD0002') {
													isProductCutOff = true;
												}
											});
								}

								if (isProductCutOff) {
									var strIsRollover = 'N', strIsReject = 'N', strIsDiscard = 'N';
									strMsg = strMsg
											|| mapLbl['instrumentProductCutoffMsg'];
									if (strAction === 'auth'
											|| strAction === 'release') {
										if (!Ext.isEmpty(errCode)
												&& errCode.substr(0, 4) === 'WARN') {
											strIsRollover = 'Y';
											strIsReject = 'Y';
											strIsDiscard = 'Y';
										} else if (!Ext.isEmpty(errCode)
												&& errCode === 'GD0002') {
											strIsReject = 'Y';
											strIsDiscard = 'Y';
										}
									} else if (strAction === 'save'
											|| strAction === 'send'
											|| strAction === 'submit') {
										if (!Ext.isEmpty(errCode)
												&& errCode.substr(0, 4) === 'WARN') {
											strIsRollover = 'Y';
											strIsDiscard = 'Y';
										} else if (!Ext.isEmpty(errCode)
												&& errCode === 'GD0002') {
											strIsDiscard = 'Y';
											strMsg = mapLbl['lblErrMsgCutOffDiscard'];
										}
									}
									doClearMessageSection();
									var strTitle = mapLbl['warnMsg'];
									blockPaymentUI(false);
									var args = {};
									args.action = strAction;
									args.isRollover = strIsRollover;
									args.isReject = strIsReject;
									args.isDiscard = strIsDiscard;
									args.strRemarks = 'Y';
									showreceivableEntryCutoffAlert(
											160,
											350,
											strTitle,
											strMsg,
											postHandlePaymentInstrumentActionsProductCutOff,
											args);
								} else {
									doClearMessageSection();
									// paintErrors(arrError);
									paintErrors(arrResult[0].errors);
									blockPaymentInstrumentUI(false);
								}
							}
						}else if(arrResult[0].success === 'FX'){
						if (arrResult[0].errors) {
							var arrError = arrResult[0].errors, isFxRateError = false, errCode = null;
							if (arrError && arrError.length > 0) {
								$.each(arrError, function(index, error) {
											strMsg = strMsg + error.code
													+ ' : '
													+ error.errorMessage;
											errCode = error.code;
											if (errCode && errCode.indexOf( 'SHOWPOPUP') != -1) {
													isFxRateError = true;
											}
										});
							}
							if (isFxRateError) {
								if(isNaN(fxTimer))  fxTimer = 10;
								countdown_number = 60*fxTimer;
								countdownTriggerOnEntry(arrResult[0].paymentFxInfo,
										strAction, errCode);
							}
							 else {
								doClearMessageSection();
								paintErrors(arrResult[0].errors);
								blockPaymentInstrumentUI(false);
							}
						}
					}
						
					}
				}
			},
			failure : function() {
				var arrError = new Array();
				arrError.push({
							"errorCode" : "Message",
							"errorMessage" : mapLbl['unknownErr']
						});
				paintErrors(arrError);
			}
		});
	}
}

function countdownTriggerOnEntry(paymentFxInfo, strAction, errorCode) {
		var mins = Math.floor(countdown_number / 60);
		var sec = countdown_number % 60;
		if (mins <= 9) {
			mins = "0" + mins;
		}
		if (sec <= 9) {
			sec = "0" + sec;
		}
		if (mins < 1) {
			mins = "00";
		}
		var fxRateVal = paymentFxInfo.fxInfoRate;
		var debitAmntVal = paymentFxInfo.debitAmount;
		if (typeof fxRateVal == "undefined") {
			fxRateVal = '';
		}
		if (typeof debitAmntVal == "undefined") {
			debitAmntVal = '';
		}

		$('#fxPopupDiv').dialog({
					title : "Approve transaction in " + mins + ":" + sec,
					autoOpen : false,
					maxHeight : 550,
					minHeight : 156,
					width : 735,
					modal : true,
					resizable : false,
					draggable : false
				});
		$('#fxPopupDiv').dialog("open");
		 $('#fxPopupDiv').on('dialogclose', function(event) {
				clearTimeout(countdown);
		 });
		$('#cancelFxBtn').unbind('click');
		$('#cancelFxBtn').bind('click', function() {
					clearTimeout(countdown);
					$('#fxPopupDiv').dialog("close");
				});
		$('#okFxBtn').unbind('click');
		$('#okFxBtn').bind('click', function() {
			if(strPaymentType==="BATCHPAY"){
				doHandlePaymentHeaderActions(strAction,
					paymentFxInfo.encryptedFxInfo);
			}else if(strPaymentType==="QUICKPAY"){
				doHandlePaymentInstrumentAction(strAction,true,
					paymentFxInfo.encryptedFxInfo);}
			$('#fxPopupDiv').dialog("close");
		});
		$('#discardBtn').unbind('click');
		$('#discardBtn').bind('click', function() {
			if(strPaymentType==="BATCHPAY"){
				doHandlePaymentHeaderActions('discard',
					paymentFxInfo.encryptedFxInfo);
			}else if(strPaymentType==="QUICKPAY"){
				doHandlePaymentInstrumentAction('discard',true,
					paymentFxInfo.encryptedFxInfo);}
			$('#fxPopupDiv').dialog("close");
		});
		$('#rolloverBtn').unbind('click');
		$('#rolloverBtn').bind('click', function() {
			if(strPaymentType==="BATCHPAY"){
				doHandlePaymentHeaderActions(strAction,
					paymentFxInfo.encryptedFxInfo);
			}else if(strPaymentType==="QUICKPAY"){
				doHandlePaymentInstrumentAction(strAction,true,
					paymentFxInfo.encryptedFxInfo);}
			$('#fxPopupDiv').dialog("close");
		});
		$('#rejectBtn').unbind('click');
		$('#rejectBtn').bind('click', function() {
			if(strPaymentType==="BATCHPAY"){
				doHandlePaymentHeaderActions('reject',
					paymentFxInfo.encryptedFxInfo);
			}else if(strPaymentType==="QUICKPAY"){
				doHandlePaymentInstrumentAction('reject',true,
					paymentFxInfo.encryptedFxInfo);}
			$('#fxPopupDiv').dialog("close");
		});
		if('auth' === strAction && (errorCode == 'SHOWPOPUP,CUTOFF,ROLLOVER' || errorCode == 'SHOWPOPUP,FX,CUTOFF,ROLLOVER')){
			$('#cutoffAuthRLButtonsUl').removeClass('hidden');
			$('#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl,#fxButonsUl').addClass('hidden');
		}
		else if('auth' === strAction && (errorCode == 'SHOWPOPUP,CUTOFF,DISCARD' || errorCode == 'SHOWPOPUP,FX,CUTOFF,DISCARD')){
			$('#cutoffAuthNRButtonsUl').removeClass('hidden');
			$('#cutoffAuthRLButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl,#fxButonsUl').addClass('hidden');
		}
		else if(errorCode == 'SHOWPOPUP,CUTOFF,ROLLOVER' || errorCode == 'SHOWPOPUP,FX,CUTOFF,ROLLOVER'){
			$('#cutoffRLButtonsUl').removeClass('hidden');
			$('#cutoffAuthRLButtonsUl,#cutoffAuthNRButtonsUl,#cutoffNRButtonsUl,#fxButonsUl').addClass('hidden');
		}
		else if(errorCode == 'SHOWPOPUP,CUTOFF,DISCARD' || errorCode == 'SHOWPOPUP,FX,CUTOFF,DISCARD'){
			$('#cutoffNRButtonsUl').removeClass('hidden');
			$('#cutoffAuthRLButtonsUl,#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#fxButonsUl').addClass('hidden');
		}
		else if(errorCode == 'SHOWPOPUP,FX'){
			$('#fxButonsUl').removeClass('hidden');
			$('#cutoffAuthRLButtonsUl,#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl').addClass('hidden');
		}
		if(errorCode.indexOf('FX') != -1 && errorCode.indexOf('CUTOFF') != -1){
			$('#disclaimerTextcutoffFXDivView').removeClass('hidden');
			$('#disclaimerTextcutoffDivView, #disclaimerTextFXDivView').addClass('hidden');
			$('#fxDiscalimer').removeClass('hidden');
		}
		else if(errorCode.indexOf('CUTOFF') != -1){
			$('#disclaimerTextcutoffDivView').removeClass('hidden');
			$('#disclaimerTextcutoffFXDivView, #disclaimerTextFXDivView').addClass('hidden');
			$('#fxDiscalimer').addClass('hidden');
		}
		else if(errorCode.indexOf('FX') != -1){
			$('#disclaimerTextFXDivView').removeClass('hidden');
			$('#disclaimerTextcutoffDivView, #disclaimerTextcutoffFXDivView').addClass('hidden');
			$('#fxDiscalimer').removeClass('hidden');
		}
		var debitAmtRef = document.getElementById("debitAmt");
		debitAmtRef.innerText = debitAmntVal;
		var debitCcyRef = document.getElementById("debitCcy");
		debitCcyRef.innerText = paymentFxInfo.debitCurrency;
		var paymentAmtRef = document.getElementById("paymentAmt");
		paymentAmtRef.innerText = paymentFxInfo.paymentAmount;
		var paymentCcyRef = document.getElementById("paymentCcy");
		paymentCcyRef.innerText = paymentFxInfo.paymentCurrency;
		var fxRateRef = document.getElementById("fxRateInfo");
		fxRateRef.innerText = fxRateVal;
		var valueDateRef = document.getElementById("valueDate");
		valueDateRef.innerText = paymentFxInfo.valueDate;
		var paymentRef = document.getElementById("paymentRef");
		paymentRef.innerText = paymentFxInfo.paymentRef;
		if (countdown_number > 0) {
			countdown_number--;
			if (countdown_number > 0) {
				countdown = setTimeout(function() {
						countdownTriggerOnEntry(paymentFxInfo, strAction, errorCode);
						}, 1000);
			} else {
				$('#fxPopupDiv').dialog("close");
				clearTimeout(countdown);
			}
		}
		
}

function countdownClear() {
	clearTimeout(countdown);
}

function doSubmitPaymentInstrument(strAction, strRemarks) {
	var arrayJson = new Array();
	if (strPaymentInstrumentIde) {
		if (isEmpty(strRemarks)) {
			arrayJson.push({
						serialNo : 0,
						identifier : strPaymentInstrumentIde,
						userMessage : ''
					});
		} else {
			arrayJson.push({
						serialNo : 0,
						identifier : strPaymentInstrumentIde,
						userMessage : strRemarks
					});
		}
		$.ajax({
			url : _mapUrl['submitInstrumentUrl'] + '.json',
			contentType : "application/json",
			data : JSON.stringify(arrayJson),
			type : 'POST',
			complete : function(XMLHttpRequest, textStatus) {
				if ("error" == textStatus) {
					var arrError = new Array();
					arrError.push({
								"errorCode" : "Message",
								"errorMessage" : mapLbl['unknownErr']
							});
					paintErrors(arrError);
					blockPaymentInstrumentUI(false);
				}
			},
			success : function(jsonRes) {
				if (jsonRes && jsonRes.d && jsonRes.d.instrumentActions) {
					var arrResult = jsonRes.d.instrumentActions;
					if (arrResult && arrResult.length == 1) {
						if (arrResult[0].success === 'Y') {
							var result = arrResult[0];
							if(result.updatedStatusCode === '7' && strPayProductCategoryType === 'R')
							{
								 var pirsFound = processRealTimePirs(data,'','instEntrySubmit');
								 if(!pirsFound)
									goToPage(_mapUrl['cancelInstrumentUrl'], 'frmMain');
							}
							else
							{
								goToPage(_mapUrl['cancelInstrumentUrl'], 'frmMain');
							}
						} else if (arrResult[0].success === 'N') {
							if (arrResult[0].errors) {
								doClearMessageSection();
								blockPaymentInstrumentUI(false);
								var arrError = arrResult[0].errors, isProductCutOff = false, errCode = null;
								if (arrError && arrError.length > 0) {
									$.each(arrError, function(index, error) {
												strMsg = error.errorMessage;
												errCode = error.code;
												if (errCode
														&& (errCode
																.toUpperCase()
																.indexOf("WARN") >= 0)
														|| errCode === 'GD0002') {
													isProductCutOff = true;
												}
												
											});
								}

								if (isProductCutOff) {
									var strIsRollover = 'N', strIsReject = 'N', strIsDiscard = 'N',strTitle = mapLbl['warnMsg'],args = {};;
									var strMsg = mapLbl['instrumentProductCutoffMsg'];
									if (!Ext.isEmpty(errCode)
											&& errCode.substr(0, 4) === 'WARN') {
										strIsRollover = 'Y';
										strIsDiscard = 'Y';
									} else if (!Ext.isEmpty(errCode)
											&& errCode === 'GD0002') {
										strIsDiscard = 'Y';
										strMsg = mapLbl['lblErrMsgCutOffDiscard'];
									}
									args.action = strAction;
									args.isRollover = strIsRollover;
									args.isReject = strIsReject;
									args.isDiscard = strIsDiscard;
									showreceivableEntryCutoffAlert(
											160,
											350,
											strTitle,
											strMsg,
											postHandlePaymentInstrumentActionsProductCutOff,
											args);
								}
								else {
									doClearMessageSection();
									// paintErrors(arrError);
									paintErrors(arrResult[0].errors);
									blockPaymentInstrumentUI(false);
								}
							}
						}
						else if(arrResult[0].success === 'FX'){
								var arrError = arrResult[0].errors , errCode = null;
								if (arrError && arrError.length > 0) {
									$.each(arrError, function(index, error) {
											errCode = error.code;
									});
								}
							if(isNaN(fxTimer))  fxTimer = 10;
							countdown_number = 60*fxTimer;
							countdownTriggerOnEntry(arrResult[0].paymentFxInfo,
									strAction,errCode);
						}
					}
				}
			},
			failure : function() {
				var arrError = new Array();
				arrError.push({
							"errorCode" : "Message",
							"errorMessage" : mapLbl['unknownErr']
						});
				paintErrors(arrError);
			}
		});
	}
}
function doDiscardPaymentInstrument(strAction, strRemarks) {
	var arrayJson = new Array();
	if (strPaymentInstrumentIde) {
		if (isEmpty(strRemarks)) {
			arrayJson.push({
						serialNo : 0,
						identifier : strPaymentInstrumentIde,
						userMessage : ''
					});
		} else {
			arrayJson.push({
						serialNo : 0,
						identifier : strPaymentInstrumentIde,
						userMessage : strRemarks
					});
		}
		$.ajax({
			url : _mapUrl['batchHeaderActionUrl'] + '/' + strAction + '.json',
			contentType : "application/json",
			data : JSON.stringify(arrayJson),
			type : 'POST',
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
			success : function(jsonRes) {
				if (jsonRes && jsonRes.d && jsonRes.d.instrumentActions) {
					var arrResult = jsonRes.d.instrumentActions;
					if (arrResult && arrResult.length == 1) {
						if (arrResult[0].success === 'Y') {
							goToPage(_mapUrl['cancelInstrumentUrl'], 'frmMain');
						} else if (arrResult[0].success === 'N') {
							doClearMessageSection();
							paintErrors(arrResult[0].errors);
						}
					}
				}
			},
			failure : function() {
				var arrError = new Array();
				arrError.push({
							"errorCode" : "Message",
							"errorMessage" : mapLbl['unknownErr']
						});
				paintErrors(arrError);
			}
		});
	}
}
function postHandleSavePaymentInstrument(data, args) {
	var status = null, isBtnVisible = true;
	var action = args.action;
	if (data && data.d) {
		paymentResponseInstrumentData = data;
		if (data.d.receivableEntry && data.d.receivableEntry.message
				&& data.d.receivableEntry.message.success)
			status = data.d.receivableEntry.message.success;
		// This is used to handle the control total validation
		// var blnFlag = doValidationForControlTotal();
		// isBtnVisible = blnFlag ? isAddAnotherTxnButtonVisible(data) : true;

		if (status === 'SUCCESS' || status === 'SAVEWITHERROR') {
			if (data.d.receivableEntry && data.d.__metadata
					&& data.d.__metadata._detailId) {
				strPaymentInstrumentIde = data.d.__metadata._detailId;
			}
			toggleDirtyBit(true);
			// TODO: To be verified
			// if (data.d.receivableEntry && data.d.receivableEntry.receivableHeaderInfo)
			// {
			// populatePaymentHeaderViewOnlySection(null,
			// data.d.receivableEntry.receivableHeaderInfo, 'Y');
			// //
			// updatePaymentSummaryHeaderInfo(data.d.receivableEntry.receivableHeaderInfo);
			// }

			if (!isEmpty(data.d.receivableEntry.message.pirNo)) {
				var msgDtls = {
					'pirNo' : data.d.receivableEntry.message.pirNo,
					'uniqueRef' : data.d.receivableEntry.message.uniqueRef,
					'txnReference' : $('#referenceNo').val()
				};
				// paintSuccessMsg(msgDtls, 'Q');
			}
			if (status === 'SUCCESS' || status === 'SAVEWITHERROR'
					|| status === 'UPDATEWITHERROR') {
				switch (action) {
					case 'SAVE' :
						paintPaymentInstrumentActions('UPDATE', isBtnVisible);
						doClearMessageSection();
						break;
					case 'UPDATE' :
						paintPaymentInstrumentActions('UPDATE', isBtnVisible);
						doClearMessageSection();
						break;
					case 'SAVEANDADD' :
					case 'UPDATEANDADD' :
						if (status !== 'SAVEWITHERROR') {
							postHandleSaveAndAddPaymentInstrument();
						}
						break;
					case 'UPDATEANDNEXT' :
						if (status != 'UPDATEWITHERROR' && status != 'SAVEWITHERROR') {
							togglePaymentInstrumentEditScreen(true);
						}
						break;
					case 'SAVEANDNEXT' :
						if (status != 'UPDATEWITHERROR' && status != 'SAVEWITHERROR') {
							togglePaymentInstrumentEditScreen(true);
						}
						break;
					default :
						break;
				}
				if (action === 'SAVE' || action === 'UPDATE'
						|| action === 'SAVEANDADD' || action === 'UPDATEANDADD'
						|| action === 'SAVEANDEXIT'
						|| action === 'UPDATEANDEXIT') {
					// if (!isEmpty(data.d.receivableEntry.receivableHeaderInfo)) {
					// var payHeaderInfo =
					// data.d.receivableEntry.receivableHeaderInfo;
					// var flagControlTotal = doValidationForControlTotal();
					// // Update control total amount and number of instruments
					// // if control total validation is not set.
					// if ((!isEmpty(payHeaderInfo.hdrTotalNo))
					// && (!isEmpty(payHeaderInfo.totalAmount))
					// && !flagControlTotal) {
					// $('#totalNoHdr').val(payHeaderInfo.hdrTotalNo);
					// $('#amountHdr').val(payHeaderInfo.totalAmount);
					// }
					// }
				}
				if (status === 'SAVEWITHERROR') {
					if (data.d.receivableEntry.message.errors)
						paintErrors(data.d.receivableEntry.message.errors);
					if (action === 'SAVEANDADD' || action === 'UPDATEANDADD'
							|| action === 'SAVEANDEXIT'
							|| action === 'UPDATEANDEXIT') {
						paintPaymentInstrumentActions('UPDATEWITHERROR',
								isBtnVisible);
						// doShowSaveWithErrorConfirmationDialog(action);
					}
					if(!isEmpty(strPaymentInstrumentIde))
					{
						paintPaymentInstrumentActions('EDIT',
								isBtnVisible);
					}
					var arrError = data.d.receivableEntry.message.errors;
					var isProductCutOff = false;
					var strMsg = getLabel('instrumentProductCutoffMsg',
							'Cut Off time Exceeded, Do you want to Proceed ?'), errCode = null;
					if (arrError && arrError.length > 0) {
						$.each(arrError, function(index, error) {
							// strMsg = error.errorMessage;
							errCode = error.errorCode;
							if (errCode
									&& (errCode.toUpperCase().indexOf("WARN") >= 0)) {
								isProductCutOff = true;
							}
						});
					}
					if (isProductCutOff) {
						doClearMessageSection();
						var strTitle = mapLbl['warnMsg'];
						showAlert(160, 350, strTitle, strMsg,
								handleProductCutOffForInstrument, args);
					} else {
						if (data.d.receivableEntry.message.errors)
							paintErrors(data.d.receivableEntry.message.errors);
						// paintErrors(data.d.receivableEntry.message.errors);
					}

				}
			}
		} else if (status === 'FAILED') {
			if (data.d.receivableEntry.message) {
				var arrError = data.d.receivableEntry.message.errors;
				var isProductCutOff = false;
				var strMsg = mapLbl['instrumentProductCutoffMsg'], errCode = null;
				if (arrError && arrError.length > 0) {
					$.each(arrError, function(index, error) {
						// strMsg = error.errorMessage;
						errCode = error.errorCode;
						if (errCode
								&& (errCode.toUpperCase().indexOf("WARN") >= 0)) {
							isProductCutOff = true;
						}
					});
				}
				if (isProductCutOff) {
					doClearMessageSection();
					var strTitle = mapLbl['warnMsg'];
					showAlert(130, 300, strTitle, strMsg,
							handleProductCutOffForInstrument, args);
				} else {
					paintErrors(data.d.receivableEntry.message.errors);
				}
			}
		} else if (isEmpty(status) && data.d.receivableEntry.message.errors) {
			// $('#successMessageArea').addClass('hidden');
			paintErrors(data.d.receivableEntry.message.errors);
		}
	}
}

function handleProductCutOffForInstrument(blnCanContinue, args) {
	var strAction = args.action;
	if (strAction && blnCanContinue) {
		switch (strAction) {
			case 'SAVE' :
				doSavePaymentInstrument(true);
				break;
			case 'UPDATE' :
				doUpdatePaymentInstrument(true);
				break;
			case 'UPDATEANDNEXT' :
				doUpdateAndNextPaymentInstrument(true);
				break;
		}
	}
}

// TODO: To be verified
function populateBankProductFieldDetail() {
	var _strMyProduct = strMyProduct;
	var _strCcy = $('#txnCurrency').val();
	var _strdrCrFlag = 'B';
	var isCrChecked = $('#drCrFlagC').is(':checked');
	var isDrChecked = $('#drCrFlagD').is(':checked');
	var strUrl = 'services/bankproduct/'
	if (isCrChecked && isDrChecked)
		_strdrCrFlag = 'B';
	else if (isCrChecked)
		_strdrCrFlag = 'C';
	else if (isDrChecked)
		_strdrCrFlag = 'D';
	if (!isEmpty(_strMyProduct) && !isEmpty(_strCcy) && !isEmpty(_strdrCrFlag)) {
		strUrl += _strMyProduct + '/' + _strCcy + '/' + _strdrCrFlag + '.json';
		blockPaymentInstrumentUI(true);
		doClearMessageSection();
		$.ajax({
			type : "POST",
			url : strUrl,
			async : false,
			complete : function(XMLHttpRequest, textStatus) {
				if ("error" == textStatus) {
					blockPaymentInstrumentUI(false);
					var arrError = new Array();
					arrError.push({
								"errorCode" : "Message",
								"errorMessage" : mapLbl['unknownErr']
							});
					paintErrors(arrError);
				}
			},
			success : function(data) {
				if (data != null) {
					if (data && data.d && data.d && data.d.seek) {
						var obj = data.d.seek;
						var arrData = new Array();
						if ($.isArray(obj)) {
							arrData = obj[0];
							if (arrData) {
								populateSelectFieldValue('bankProduct',
										arrData, '');
								if (arrData.length === 1) {
									loadPaymentInstrumentBankProductFields();
									$('#drCrFlagD, #drCrFlagC').attr("checked",
											false);
									populateRadioFieldValue('drCrFlag',
											_strdrCrFlag);
									if (strLayoutType
											&& (strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT'))
										toggleAccountLabel(null, _strdrCrFlag);
									//blockPaymentInstrumentUI(false);	
								}
								blockPaymentInstrumentUI(false);
							}

						} else if (obj.error) {
							var errObj = [{
								errorMessage : mapLbl['drCrFlagError_'
										+ _strdrCrFlag],
								errorCode : 'ERR'
							}];
							paintErrors(errObj);
							blockPaymentInstrumentUI(false);
						}
					}

				}
			}
		});
	}
}

function paintPaymentDtlAdditionalInformationSection(strIdentifier, strPmtType, strMode) {
	var blnCollapsed = false;
	$('#paymentInstrumentTrasanctionSummaryDiv .canClear').empty();
	$('#paymentInstrumentTrasanctionSummaryDiv').removeClass('hidden');
	if ($('#paymentInstrumentTrasanctionSummaryDiv .vertical-collapsible-contents')
			.hasClass('content-display-none')) {
		$('#paymentInstrumentTrasanctionSummaryDiv span.expand-vertical')
				.trigger('click');
		blnCollapsed = true;
	}
	//paintPaymentInformation(strPostFix, strIdentifier, strPmtType, blnCollapsed, strMode);
}

/** Additional Information Section handling starts here * */

function paintPaymentInformation(strPostFix, strIdentifier, strPmtType, blnCollapsed, strMode) {
	var strPostFix = '_InfoSpan', strValueToBeDisplayed = null, intMaxFieldLength = 20, strAuthLevel = 'B',strhdrActionStatus ='';
	// if (isEmpty(strPaymentAdditionalInfoData))

	strPaymentAdditionalInfoData = getPaymentAddtionInformationData(strIdentifier);

	if (strPaymentAdditionalInfoData) {
		if (strPmtType === 'Q'
				&& paymentResponseInstrumentData
				&& paymentResponseInstrumentData.d
				&& paymentResponseInstrumentData.d.receivableEntry
				&& paymentResponseInstrumentData.d.receivableEntry.receivableHeaderInfo
				&& paymentResponseInstrumentData.d.receivableEntry.receivableHeaderInfo.authLevel)
			strAuthLevel = paymentResponseInstrumentData.d.receivableEntry.receivableHeaderInfo.authLevel;
		else if (paymentResponseHeaderData
				&& paymentResponseHeaderData.d
				&& paymentResponseHeaderData.d.receivableEntry
				&& paymentResponseHeaderData.d.receivableEntry.receivableHeaderInfo
				&& paymentResponseHeaderData.d.receivableEntry.receivableHeaderInfo.authLevel)
			strAuthLevel = paymentResponseHeaderData.d.receivableEntry.receivableHeaderInfo.authLevel;
		if (strPmtType === 'Q'
				&& paymentResponseInstrumentData
				&& paymentResponseInstrumentData.d
				&& paymentResponseInstrumentData.d.receivableEntry
				&& paymentResponseInstrumentData.d.receivableEntry.receivableHeaderInfo
				&& paymentResponseInstrumentData.d.receivableEntry.receivableHeaderInfo.hdrActionStatus)
			strhdrActionStatus = paymentResponseInstrumentData.d.receivableEntry.receivableHeaderInfo.hdrActionStatus;
		else if (paymentResponseHeaderData
				&& paymentResponseHeaderData.d
				&& paymentResponseHeaderData.d.receivableEntry
				&& paymentResponseHeaderData.d.receivableEntry.receivableHeaderInfo
				&& paymentResponseHeaderData.d.receivableEntry.receivableHeaderInfo.hdrActionStatus)
			strhdrActionStatus = paymentResponseHeaderData.d.receivableEntry.receivableHeaderInfo.hdrActionStatus;

		$.each(strPaymentAdditionalInfoData, function(fieldName, fieldValue) {
			intMaxFieldLength = strPmtType && strPmtType ==='Q' ? 20 : 25;
			if (fieldName === 'importedFilesCount' && fieldValue != "0") {
				$("." + fieldName + strPostFix).unbind('click');
				$("." + fieldName + strPostFix).bind('click', function() {
							openFilesImportedPopup(strIdentifier);
						});
			}
			
			if (fieldName === 'hostMessage') {
				intMaxFieldLength = 60;
			}
			if (fieldName === 'enrichmentProfile') {
				intMaxFieldLength = strPmtType && strPmtType ==='Q' ? 17 : intMaxFieldLength;
			}
			
			
			strValueToBeDisplayed = fieldValue || 'None';
			strValueToBeDisplayed = fieldValue
					&& fieldValue.length > intMaxFieldLength
					? getTruncatedStringByLengthWithTooltip("." + fieldName
									+ strPostFix, fieldValue, intMaxFieldLength)
					: fieldValue;
			$("." + fieldName + strPostFix).text(strValueToBeDisplayed);
		});
		$(".importedFilesCount_InfoSpan").addClass('t7-anchor');
		if (isEmpty(strPaymentAdditionalInfoData.importedFilesCount)) {
			$(".importedFilesCount_InfoSpan").text('None')
					.removeClass('t7-anchor');
		}
		if (!isEmpty(strPaymentAdditionalInfoData.instrumentStatus)) {
			$('.instrumentStatus_HdrInfoSpan')
					.text(strPaymentAdditionalInfoData.instrumentStatus);
		}
	}
}
function handleAdditionalInfoSectionCollapsed(strPmtType) {
	if (strPaymentType && strPaymentType === 'QUICKPAY')
		$('#paymentInstrumentTrasanctionSummaryDiv span.expand-vertical')
				.trigger('click');
	else if (strPmtType === 'B')
		$('#paymentHeadeerTrasanctionSummaryDiv span.expand-vertical')
				.trigger('click');
	else
		$('#paymentInstrumentTrasanctionSummaryDiv span.expand-vertical')
				.trigger('click');
}
function getPaymentAddtionInformationData(strIdentifier) {
	var objResponseData = null;
    if (!isEmpty(strIdentifier)) {
		var strUrl = 'services/recAdditionalInfo/id.json';
		var jsonData = {'id' : strIdentifier};
		$.ajax({
					url : strUrl,
					type : 'POST',
					async : false,
					data : jsonData,
					complete : function(XMLHttpRequest, textStatus) {
						if ("error" == textStatus) {
							// TODO : Error handling to be done.
							// alert("Unable to complete your request!");
							// blockPaymentUI(true);
						}
					},
					success : function(data) {
						if (data && data.d)
							objResponseData = data.d;
					}
				});
	}
	/*
	 * Remove comments to test with Dummay data if (isEmpty(objResponseData)) {
	 * objResponseData = dummayAdditionalInfoJson; }
	 */
	return objResponseData;
}
function paintApprovalStructureInformation(strPostFix, strIdentifier) {
	var data = null, ctrl = null;
	data = getApprovalStructureData(strIdentifier);
	var ctrl = $('.approvalName' + strPostFix);
	if (data) {
		if (data.matrixType) {
			var chrMatrixType = data.matrixType;
			if (chrMatrixType) {
				switch (chrMatrixType) {
					case 'M' :
						paintApprovalStructureMakerCheckerPopup(data, ctrl);
						break;
					case 'S' :
						paintApprovalStructureSVMPopup(data, ctrl);
						break;
					case 'A' :
						paintApprovalStructureAVMPopup(data, ctrl);
						break;
					default :
						paintApprovalStructureMakerCheckerPopup(data, ctrl);
						break;
				}
			} else {
				paintApprovalStructureMakerCheckerPopup(data, ctrl);
			}
		}
	}
}
function getApprovalStructureData(strIdentifier) {
	if (!isEmpty(strIdentifier)
			&& (isEmpty(paymentApprovalStructureData[strIdentifier]))) {

		$.ajax({
					url : 'services/authStructure/(' + strIdentifier + ').json',
					type : 'POST',
					async : false,
					complete : function(XMLHttpRequest, textStatus) {
						// $.unblockUI();
						// if ("error" == textStatus)
						// alert("Unable to complete your request!");
					},
					success : function(data) {
						if (data && data.d)
						paymentApprovalStructureData[strIdentifier] = data.d;
					}
				});
	}
	/*
	 * if (isEmpty(jsonData)) jsonData = dummyApprovalInfoJson.d;
	 */
	return paymentApprovalStructureData[strIdentifier];
}
function paintApprovalStructureMakerCheckerPopup(data, ctrl) {
	ctrl.bind('mouseover', function(e) {
		var strHtml = '<div class="row"><div class="col-sm-9"><div class="form-group"><label>Matrix Name : </label><span> '
				+ data.rule
				+ '</span></div></div><div class="col-sm-3"><div class="form-group"><label>No. of Users : </label><span> '
				+ (!isEmpty(data.approvers) ? data.approvers : '')
				+ '</span></div></div></div>';
		$('<div>').html(strHtml).css({
					'position' : 'absolute',
					'border' : '1px solid #868686',
					'min-height' : '37px',
					'overflow' : 'auto',
					'min-width' : '500px',
					'z-index' : '1000',
					'padding' : '6px 12px',
					'color' : '#333333',
					'background-color' : '#F1F1F1',
					'width' : 'auto'
				}).appendTo(ctrl);
	});

	ctrl.bind('mouseout', function(e) {
				$(this).find('div').remove();
			});
}
function paintApprovalStructureSVMPopup(data, ctrl) {
	ctrl.bind('mouseover', function(e) {
		var rule = ShowRuleDesc((data.rule || '').split(','));
		var strHtml = '<div class="row"><div class="col-sm-12"><div class="form-group"><label> Matrix Name : </label><span>'
				+ ' '
				+ data.name
				+ '</span></div></div></div>'
				+ '<div class="row"><div class="col-sm-12"><div class="form-group"><label>Signatory Matrix Rule : </label><div>'
				+ ' ' + rule + '</div></div></div></div>';
		$('<div>').html(strHtml).css({
					'position' : 'absolute',
					'border' : '1px solid #868686',
					'max-height' : '100px',
					'overflow' : 'visible',
					'min-width' : '400px',
					'z-index' : '1000',
					'padding' : '6px 12px',
					'color' : '#333333',
					'background-color' : '#F1F1F1'
				}).appendTo(ctrl);
	});
	ctrl.bind('mouseout', function(e) {
				$(this).find('div').remove();
			});
}
function paintApprovalStructureAVMPopup(data, ctrl) {
	ctrl.unbind('click');
	ctrl.bind('click', function() {
				openApprovalStructureAVMPopup(data.slabs);
			});
}
function openApprovalStructureAVMPopup(data) {
	var matrixNameGrid = null;
	$("#paymentAdditionalInfo_ApprovalMatrixPopup").dialog({
				resizable : false,
				modal : true,
				width : 400,
				height : 300,
				title : mapLbl['txnMatrixName'],
				// dialogClass : "hide-title-bar",
				open : function(event, ui) {
					// if (!matrixNameGrid) {
					matrixNameGrid = createApprovalStructureAVMDataGrid(data);
					// }
				},
				close : function(event, ui) {
				},
				buttons : {
					'Cancel' : function() {
						$(this).dialog("close");
						$("#matrixNameGrid").empty();
					}
				}
			});
}
function createApprovalStructureAVMDataGrid(data) {
	var store = createApprovalStructureGridStore(data);
	$('#matrixNameGrid').empty();
	var grid = Ext.create('Ext.grid.Panel', {
				store : store,
				popup : true,
				columns : [{
							text : '#',
							dataIndex : 'TYPE',
							width : 30,
							draggable : false,
							resizable : false,
							hideable : false
						}, {
							text : mapLbl['txnLevel'],
							dataIndex : 'level',
							width : 60,
							draggable : false,
							resizable : false,
							hideable : false
						}, {
							text : mapLbl['txnNoodCheckers'],
							dataIndex : 'checkers',
							width : 120,
							draggable : false,
							resizable : false,
							hideable : false
						}, {
							text : mapLbl['txnName'],
							dataIndex : 'users',
							flex : 1,
							draggable : false,
							resizable : false,
							hideable : false

						}],
				renderTo : 'matrixNameGrid'
			});
	return grid;
}
function createApprovalStructureGridStore(jsonData) {
	var myStore = Ext.create('Ext.data.Store', {
				id : 'matrixStore',
				fields : ['TYPE', 'level', 'checkers', 'users'],
				data : jsonData,
				autoLoad : true
			});
	return myStore;
}

function paintPaymentTransactionAuditInfoGrid(data, strPmtType, strMode) {
	var renderToDiv = null;
	if (strPmtType && strPmtType === 'B') {
		renderToDiv = 'auditInfoGridDiv';
		$(".auditInformationInfoHdrDiv").removeClass('hidden');
	} else if (strPaymentType && strPaymentType === 'QUICKPAY') {
		renderToDiv = 'auditInfoInstrumentGridDiv';
		$(".auditInformationInfoDtlDiv").removeClass('hidden');
	} else {
		renderToDiv = 'auditInfoInstrumentGridDiv';
		$(".auditInformationInfoDtlDiv").removeClass('hidden');
	}
	
	if (!isEmpty(renderToDiv)) {
		$('#'+renderToDiv).empty();
		var store = createAuditInfoGridStore(data);
		var grid = Ext.create('Ext.grid.Panel', {
			store : store,
			popup : true,
			columns : [{
						dataIndex : 'userCode',
						text : mapLbl['txnUser'],
						width : 200,
						draggable : false,
						resizable : false,
						hideable : false
					}, {
						dataIndex : 'logDate',
						text : mapLbl['txnDateTime'],
						width : 220,
						draggable : false,
						resizable : false,
						hideable : false
					}, {
						dataIndex : 'action',
						text : mapLbl['txnAction'],
						width : 150,
						draggable : false,
						resizable : false,
						hideable : false
					}, {
						dataIndex : 'remarks',
						text : mapLbl['txnRemarks'],
						flex : 1,
						draggable : false,
						resizable : false,
						hideable : false
					}],
			renderTo : renderToDiv
				/*
			 * , afterRender : function() { if(strPmtType==='Q')
			 * $('#paymentInstrumentTrasanctionSummaryDiv
			 * span.expand-vertical').trigger('click'); else
			 * if(strPmtType==='B') $('#paymentHeadeerTrasanctionSummaryDiv
			 * span.expand-vertical').trigger('click'); }
			 */
			});
		grid.on('afterlayout', function() {
			if (strMode && strMode !== 'VERIFY') {
				if (strPaymentType
						&& (strPaymentType === 'QUICKPAY' || strPaymentType === 'QUICKPAYSTI'))
					$('#paymentInstrumentTrasanctionSummaryDiv span.expand-vertical')
							.trigger('click');
				else if (strPmtType === 'B')
					$('#paymentHeadeerTrasanctionSummaryDiv span.expand-vertical')
							.trigger('click');
				else
					$('#paymentInstrumentTrasanctionSummaryDiv span.expand-vertical')
							.trigger('click');
			}			
		});
		return grid;
	}
}/**/

function createAuditInfoGridStore(jsonData) {
	var myStore = Ext.create('Ext.data.Store', {
				fields : ['zone', 'version', 'recordKeyNo', 'userCode',
						'logDate', 'requestState', 'phdClient', 'logNumber',
						'pirNumber', 'pirSerial', 'avmLevel', 'remarks',
						'__metadata', 'action'],
				data : jsonData,
				autoLoad : true
			});
	return myStore;
}

function openFilesImportedPopup(strIdentifier) {
	var matrixNameGrid;
	$("#importedTxnDetailsPopup").dialog({
		resizable : false,
		modal : true,
		width : 700,
		height : 300,
		title : mapLbl['txnImportedTxnDetails'] + ' : ',
		// dialogClass : "hide-title-bar",
		open : function(event, ui) {
			if (!matrixNameGrid) {
				matrixNameGrid = createTxnDetailsGrid('importedTxnDetailsGrid',
						strIdentifier);
			}
		},
		close : function(event, ui) {
		},
		buttons : {
			'Cancel' : function() {
				$(this).dialog("close");
				$("#importedTxnDetailsGrid").empty();
			}
		}
	});
}
function createTxnDetailsGrid(divId, strIdentifier) {
	var renderToDiv = !isEmpty(divId) ? divId : 'txnDetailsGridDiv';
	var store = createTxnDetailsGridStore(strIdentifier);
	var grid = Ext.create('Ext.grid.Panel', {
				store : store,
				maxHeight : 200,
				scroll : 'vertical',
				cls : 't7-grid',
				popup : true,
				listeners: {
					cellclick: function(view, td, cellIndex, record,tr, rowIndex, e, eOpts) {
						if(record.data.statusCode === 'E' || record.data.statusCode === 'T'){
				    		showUploadErrorReport(record.data);;
						}

					}
				},
				columns : [{
							text : getLabel('lblAction', 'Action'),
							width : 50,
							draggable : false,
							resizable : false,
							hideable : false,
							colType : 'action',
							renderer: function(value, metaData, record, rowIndex, colIndex, store){
								if(record.data.statusCode === 'E' || record.data.statusCode === 'T'){
						    		//return '<i class="fa fa-exclamation-circle" style="color:#F78181"></i>';
									return '<a class="grey cursor_pointer action-link-align grid-row-action-icon icon-error" name="btnViewError" title="'+getLabel('lblViewReport', 'View Report')+'">&nbsp;&nbsp;</a>';
								}
								if(record.data.statusCode === 'Q' || record.data.statusCode === 'R'){
						    		return '<i class="fa fa-spinner"></i>';
								}
								else{
									 return '<a class="grey cursor_pointer action-link-align grid-row-action-icon icon-completed" name="btnViewOk" title="'+getLabel('lblCompleted', 'Completed')+'">&nbsp;&nbsp;</a>';
								}
							 }
							
						},{
							text : getLabel('lblFileName', 'File Name'),
							dataIndex : 'fileName',
							width : 140,
							draggable : false,
							resizable : true,
							hideable : false,
							sortable : false
						}, {
							text : getLabel('lblCreatedOn', 'Import DateTime'),
							dataIndex : 'createdOn',
							width : 120,
							draggable : false,
							resizable : true,
							hideable : false,
							sortable : false
						}, {
							text : getLabel('lblTotalinstruments', 'Transaction#'),
							dataIndex : 'totalinstruments',
							width : 60,
							draggable : false,
							resizable : true,
							hideable : false,
							sortable : false
						}, {
							text : getLabel('lblTotalAmount', 'Total Amount'),
							dataIndex : 'totalAmount',
							width : 80,
							draggable : false,
							resizable : true,
							hideable : false,
							sortable : false
						}, {
							text : getLabel('lblTotalrejected', 'Rejected Txn'),
							dataIndex : 'totalrejected',
							width : 80,
							draggable : false,
							resizable : true,
							hideable : false,
							sortable : false
						}, {
							text : getLabel('lblRemarks', 'Status'),
							dataIndex : 'remarks',
							flex : 1,
							draggable : false,
							resizable : true,
							hideable : false,
							sortable : false
						}],
				renderTo : renderToDiv
			});
	return grid;
}
function createTxnDetailsGridStore(strIdentifier) {
	var jsonData = null;
	if (!isEmpty(strIdentifier)) {
		$.ajax({
					url : 'services/ach/transactionStatus(' + strIdentifier
							+ ').json',
					type : 'POST',
					async: false,
					complete : function(XMLHttpRequest, textStatus) {
					},
					success : function(data) {
						if (data && data.d)
							jsonData = data.d.status;
					}
				});
	}
	var myStore = Ext.create('Ext.data.Store', {
				id : 'matrixStore',
				fields : ['fileName', 'createdOn', 'totalinstruments',
						'totalAmount', 'totalrejected', 'totalAmountRejected',
						'totaluploaded', 'remarks', 'statusCode', 'ahtskdata', 'ahtskclient'],
				data : jsonData,
				autoLoad : true
			});
	return myStore;
}
/** Additional Information Section handling ends here * */
function getreceivableHeaderInfo(strIdentifier) {
	var jsonData = null;
	if (!isEmpty(strIdentifier)) {
		$.ajax({
					url : 'services/receivableheaderinfo/id.json',
					type : 'POST',
					async : false,
					complete : function(XMLHttpRequest, textStatus) {
						// $.unblockUI();
						// if ("error" == textStatus)
						// alert("Unable to complete your request!");
					},
					success : function(data) {
						if (data && data.d)
							jsonData = data.d;
					}
				});
	}

	return jsonData;
}
/* Image Upload Handling starts here */
function showFileUploadDialog() {
	$('#paymentImageFile').trigger('click');
}
function updateFileName() {
	if ($("#paymentImageFile") && $("#paymentImageFile")[0]
			&& $("#paymentImageFile")[0].files) {
		var strUploadedImageName = $("#paymentImageFile")[0].files[0].name;
		$(".fileName_InfoSpan").text(strUploadedImageName);
		$('#paymentImageFileRemoveLink').removeClass('hidden');
		$('#paymentImageFileLink').addClass('hidden');
	}
}
function removeUploadedImage() {
	var control = $("#paymentImageFile");
	control.replaceWith(control = control.clone(true));
	$('#paymentImageFileRemoveLink').addClass('hidden');
	$('#paymentImageFileLink').removeClass('hidden');
	$(".fileName_InfoSpan").text('No File Uploaded');
}
/* Image Upload Handling ends here */
/* Limits pop up Handling starts here */
function showLimitsPopup(strPmtType) {
	$('#paymentAdditionalInfolimitsPopup').dialog({
				autoOpen : false,
				maxHeight : 620,
				width : 690,
				modal : true,
				dialogClass : 'ft-tab-bar',
				open : function() {
					$("#limitTabs").barTabs();
					paintLimitPopup(strPmtType);
				},
				close : function() {
				},
				buttons : {
					'Close' : function() {
						$(this).dialog("close");
					}
				}
			});
	$('#paymentAdditionalInfolimitsPopup').dialog("open");
}
function paintLimitPopup(strPmtType) {
	var clsHide = 'hidden', data = null;
	data = getLimitsPopupInfo(strPmtType);
	// Remove following comment for unit testing.
	// data = dummyLimitsPopupData;
	$('#limitTabs .canClear').text('');
	if (data && data.d) {
		$.each(data.d, function(key, sectionData) {
			if (key != "metadata") {
				$("." + key + "Tab").removeClass(clsHide);
				$('#tabs-' + key).removeClass(clsHide);
				// var sectionLimitData = sectionData;
				$.each(sectionData, function(sectionDataPtr, sectionDataObj) {
					if (sectionDataPtr != 'sectionLabel' && sectionDataObj) {
						$(".section" + key + "_" + sectionDataPtr)
								.removeClass(clsHide);
						if (sectionDataObj.label) {
							$(".section" + key + "_" + sectionDataPtr
									+ "_label").text(sectionDataObj.label);
						}
						if (sectionDataObj.transaction) {
							$(".section" + key + "_" + sectionDataPtr
									+ "_TransactionDiv").removeClass(clsHide);
							if (sectionDataObj.transaction.credit)
								$(".section" + key + "_" + sectionDataPtr
										+ "_txnCreditLimit")
										.text(sectionDataObj.transaction.credit);
							if (sectionDataObj.transaction.debit)
								$(".section" + key + "_" + sectionDataPtr
										+ "_txnDebitLimit")
										.text(sectionDataObj.transaction.debit);
						}

						if (sectionDataObj.cumulative) {
							$(".section" + key + "_" + sectionDataPtr
									+ "_CumulativeDiv").removeClass(clsHide);
							if (sectionDataObj.cumulative.header)
								$(".section" + key + "_" + sectionDataPtr
										+ "_cumulativeheader")
										.text(sectionDataObj.cumulative.header);
							if (sectionDataObj.cumulative.transferCreditLimit
									&& sectionDataObj.cumulative.transferCreditOS) {
								$(".section" + key + "_" + sectionDataPtr
										+ "_transferCreditDiv")
										.removeClass(clsHide);
								$(".section" + key + "_" + sectionDataPtr
										+ "_transferCreditLimit")
										.text(sectionDataObj.cumulative.transferCreditLimit);
								$(".section" + key + "_" + sectionDataPtr
										+ "_transferCreditOS")
										.text(sectionDataObj.cumulative.transferCreditOS);
								if (sectionDataObj.cumulative.markTransferCreditLimit
										&& sectionDataObj.cumulative.markTransferCreditLimit === 'Y')
									$(".section" + key + "_" + sectionDataPtr
											+ "_transferCreditLimit").attr(
											'style', 'color:red');
							}

							if (sectionDataObj.cumulative.warningCreditLimit
									&& sectionDataObj.cumulative.warningCreditOS) {
								$(".section" + key + "_" + sectionDataPtr
										+ "_warningCreditDiv")
										.removeClass(clsHide);
								$(".section" + key + "_" + sectionDataPtr
										+ "_warningCreditLimit")
										.text(sectionDataObj.cumulative.warningCreditLimit);
								$(".section" + key + "_" + sectionDataPtr
										+ "_warningCreditOS")
										.text(sectionDataObj.cumulative.warningCreditOS);
								if (sectionDataObj.cumulative.markWarningCreditLimit
										&& sectionDataObj.cumulative.markWarningCreditLimit === 'Y')
									$(".section" + key + "_" + sectionDataPtr
											+ "_warningCreditLimit").attr(
											'style', 'color:red');
							}

							if (sectionDataObj.cumulative.transferDebitLimit
									&& sectionDataObj.cumulative.transferDebitOS) {
								$(".section" + key + "_" + sectionDataPtr
										+ "_transferDebitDiv")
										.removeClass(clsHide);
								$(".section" + key + "_" + sectionDataPtr
										+ "_transferDebitLimit")
										.text(sectionDataObj.cumulative.transferDebitLimit);
								$(".section" + key + "_" + sectionDataPtr
										+ "_transferDebitOS")
										.text(sectionDataObj.cumulative.transferDebitOS);
								if (sectionDataObj.cumulative.markTransferDebitLimit
										&& sectionDataObj.cumulative.markTransferDebitLimit === 'Y')
									$(".section" + key + "_" + sectionDataPtr
											+ "_transferDebitLimit").attr(
											'style', 'color:red');
							}

							if (sectionDataObj.cumulative.warningDebitLimit
									&& sectionDataObj.cumulative.transferDebitOS) {
								$(".section" + key + "_" + sectionDataPtr
										+ "_warningDebitDiv")
										.removeClass(clsHide);
								$(".section" + key + "_" + sectionDataPtr
										+ "_warningDebitLimit")
										.text(sectionDataObj.cumulative.warningDebitLimit);
								$(".section" + key + "_" + sectionDataPtr
										+ "_warningDebitOS")
										.text(sectionDataObj.cumulative.warningDebitOS);
								if (sectionDataObj.cumulative.markWarningDebitLimit
										&& sectionDataObj.cumulative.markWarningDebitLimit === 'Y')
									$(".section" + key + "_" + sectionDataPtr
											+ "_warningDebitOS").attr(
											'style', 'color:red');
							}

							if (sectionDataObj.cumulative.transferCountLimit
									&& sectionDataObj.cumulative.transferCountOS) {
								$(".section" + key + "_" + sectionDataPtr
										+ "_transferCountDiv")
										.removeClass(clsHide);
								$(".section" + key + "_" + sectionDataPtr
										+ "_transferCountLimit")
										.text(sectionDataObj.cumulative.transferCountLimit);
								$(".section" + key + "_" + sectionDataPtr
										+ "_transferCountOS")
										.text(sectionDataObj.cumulative.transferCountOS);
								if (sectionDataObj.cumulative.markTransferCountLimit
										&& sectionDataObj.cumulative.markTransferCountLimit === 'Y')
									$(".section" + key + "_" + sectionDataPtr
											+ "_transferCountLimit").attr(
											'style', 'color:red');
							}
						}
					}
				});
			}

		});

	}
}
function getLimitsPopupInfo(strPmtType) {
	var jsonData = null, strIdentifier = null;

	if (strPmtType) {
		if (strPmtType === 'Q')
			strIdentifier = strPaymentInstrumentIde;
		if (strPmtType === 'B')
			strIdentifier = strPaymentHeaderIde;
		if (!isEmpty(strIdentifier)) {
			$.ajax({
						url : 'services/limits/fetch(' + strIdentifier
								+ ').json',
						type : 'POST',
						async : false,
						complete : function(XMLHttpRequest, textStatus) {
							// $.unblockUI();
							// if ("error" == textStatus)
							// alert("Unable to complete your request!");
						},
						success : function(data) {
							if (data && data.d)
								jsonData = data;
							else {
								var arrError = new Array();
								arrError.push({
											"errorCode" : "Message",
											"errorMessage" : mapLbl['unknownErr']
										});
								paintErrors(arrError);
							}
						}
					});
		}
	}
	if (isEmpty(jsonData)) {
		$('#paymentAdditionalInfolimitsPopup').dialog("close");
	}
	return jsonData;
}

/* Limits pop up Handling ends here */

/* Templates Roles/Users handling starts here */
function populateUsers() {
	var field = $('#templateRoles' + (charPaymentType === 'B' ? 'Hdr' : ''));
	var strVal = field.val();
	if (strVal && $.isArray(strVal))
		strVal = strVal.toString();
	$.ajax({
				url : "services/userseek/categoryUserList.json?$top=-1&$filtercode1="
						+ strMyProduct + '&$filtercode2=' + strVal,
				dataType : "json",
				success : function(data) {
					populateTemplateUserValues(data.d.preferences, []);
				}
			});
}

function populateTemplateUserValues(arrAvilableValues, strSelectedValues) {
	var field = $('#templateUsers' + (charPaymentType === 'B' ? 'Hdr' : '')), opt = null, isSelected = false;
	var arrUser = charPaymentType === 'B'
			? arrTemplateUsersHdr
			: arrTemplateUsersInst;
	field.empty();
	if (arrAvilableValues && arrAvilableValues.length > 0)
		$.each(arrAvilableValues, function(index, cfg) {
			isSelected = jQuery.inArray(cfg.CODE, arrUser) != -1 ? true : false;
			opt = $('<option />', {
						value : cfg.CODE,
						text : cfg.DESCRIPTION
					});
			if (isSelected)
				opt.attr('selected', true);
			opt.appendTo(field);
		});
	else {
		charPaymentType === 'B'
				? arrTemplateUsersHdr = []
				: arrTemplateUsersInst = [];
	}
	field.multiselect("refresh");
}
function persistTemplateUsers() {
	var field = $('#templateUsers' + (charPaymentType === 'B' ? 'Hdr' : ''));
	charPaymentType === 'B'
			? arrTemplateUsersHdr = (field.val() || [])
			: arrTemplateUsersInst = (field.val() || []);
}
/* Templates Roles/Users handling ends here */

/* Receiver AccountInstitution, IntermidiaryBank, ReceiverCorrespondent handling starts here */
function paintReceiverViewOnlyDetails(data) {
	var beneficiary = data, strPostFix ='R_InstView',clsHide='hidden', fieldId =null;;
	if (beneficiary.drawerRegistedFlag == 'Y'
			|| beneficiary.drawerRegistedFlag == 'R') {
		arrStdFields = beneficiary.registeredBene
				? beneficiary.registeredBene
				: null;
		paintPaymentInstrumentReceiverViewOnlyFields(arrStdFields, strPostFix);
		if (arrStdFields) {
			$.each(arrStdFields, function(index, cfg) {
				fieldId=cfg.fieldName;
				if (cfg.fieldName === 'drawerCode' && !isEmpty(cfg.value)) {
					 toggleRegisteredReceiverInstViewMoreDetails(cfg.value);
				} /*else if ((cfg.fieldName === 'tag57Type'
						|| cfg.fieldName === 'tag54Type' || cfg.fieldName === 'tag56Type')) {
					handleReceiverTagDetailsSectionForRegisteredReceiver(
							 strPostFix, cfg, clsHide);
				}*/
				//paintRegisteredReceiverInfoFields(fieldId, strPostFix, cfg);
			});
		}
	} else {
		arrStdFields = beneficiary.adhocBene ? beneficiary.adhocBene : null;
		ctrl = $('#registeredReceiverDetailsLinkInstView');
		ctrl.unbind('click');
		ctrl.bind('click', function() {
			$('.adhocReceiverDetailsInstView').toggleClass(clsHide);
			var isHidden = $('.adhocReceiverDetailsInstView').hasClass(clsHide);
			if (isHidden)
				$("#registeredReceiverDetailsLinkInstView")
						.text("View Additional Details");
			else
				$("#registeredReceiverDetailsLinkInstView")
						.text("View Less Details");
		});
		paintPaymentInstrumentReceiverViewOnlyFields(arrStdFields, 'R_InstView');
	}
	handleReceiverTagDetailsSection(true);

}
function handleReceiverTagDetailsSection(isViewOnly) {
	var data = paymentResponseInstrumentData, objHdrInfo = null, strClsHidden = 'hidden';
	if (data && data.d && data.d.receivableEntry
			&& data.d.receivableEntry.receivableHeaderInfo)
		objHdrInfo = data.d.receivableEntry.receivableHeaderInfo;

	
	if (!isEmpty(objHdrInfo.receiverAccountWithInst)
			&& (objHdrInfo.receiverAccountWithInst == 'Y')) {
		$('.accWithInsMainADiv').removeClass(strClsHidden);
	} else
		$('.accWithInsMainADiv').addClass(strClsHidden);
	if (!isEmpty(objHdrInfo.receiverCorrBank)
			&& (objHdrInfo.receiverCorrBank == 'Y')) {
		$('.recCorrMainADiv').removeClass(strClsHidden);
	} else
		$('.recCorrMainADiv').addClass(strClsHidden);
	if (!isEmpty(objHdrInfo.receiverIntBank)
			&& (objHdrInfo.receiverIntBank == 'Y')) {
		$('.interBankMainADiv').removeClass(strClsHidden);
	} else
		$('.interBankMainADiv').addClass(strClsHidden);

}

function handleReceiverTagDetailsSectionForRegisteredReceiver(
		strPostFix, cfg, clsHide) {
	if (cfg && !isEmpty(cfg.value)) {
		var strFieldId = cfg.fieldName;
		$('.' + strFieldId + strPostFix + 'Div').removeClass(clsHide);
		$('.' + strFieldId + strValue + strPostFix + 'Div').removeClass(clsHide);
		var strValue = cfg.value;
		if (strValue == 'A') {
			$('.' + strFieldId + 'A' + strPostFix).removeClass(clsHide);
			$('.' + strFieldId + 'D' + strPostFix).addClass(clsHide);
			$('.' + strFieldId + 'A').removeClass(clsHide);
			$('.' + strFieldId + 'D').addClass(clsHide);
		} else if (strValue == 'D') {
			$('.' + strFieldId + 'D' + strPostFix).removeClass(clsHide);
			$('.' + strFieldId + 'A' + strPostFix).addClass(clsHide);
			$('.' + strFieldId + 'D').removeClass(clsHide);
			$('.' + strFieldId + 'A').addClass(clsHide);
		}
		handleTagMsgTypeChange(strFieldId, strValue);
	}
}
function paintRegisteredReceiverInfoFields(fieldId, strPostFix, cfg) {
	var strFieldId = cfg.fieldName;
	var strValue = getValueToDispayed(cfg);
	strValue = isEmpty(strValue) ? (cfg.value ? cfg.value : '') : strValue;
	ctrlLbl = $('.' + strFieldId + strPostFix);

	if (ctrlLbl.length != 0) {
		ctrlLbl.text(strValue);
	}
	var ctrl = $('.' + strFieldId + strPostFix);
	if ((cfg && !isEmpty(cfg.displayMode)
			&& (cfg.displayMode === "2" || cfg.displayMode === "3") && ctrl && ctrl.length > 0)
			|| (ctrl && ctrl.length > 0)) {
		var ctrlClassSelector = $('.' + strFieldId + strPostFix + 'Div');
		if (ctrlClassSelector && ctrlClassSelector.hasClass('hidden'))
			ctrlClassSelector.removeClass('hidden');
	}
}
//function handleTagFieldValueSectionShowHide(strTag57Type,strTag54Type,strTag56Type)
//{
//	handleTagMsgTypeChange('tag57Type', strTag57Type);
//	handleTagMsgTypeChange('tag54Type', strTag54Type);
//	handleTagMsgTypeChange('tag56Type', strTag56Type);
//}
/*
 * Receiver AccountInstitution, IntermidiaryBank, ReceiverCorrespondent handling
 * ends here
 */
/* Payment Entry Cutoff handling for group actions starts here */
function showreceivableEntryCutoffAlert(intHeight, intWidth, strTitle, strMsg,
		fptrCallback, arrData) {
	_objCutOffDialog = $("#receivableEntryCutOffMessageDialog");
	_objCutOffDialog.text(strMsg);
	_objCutOffDialog.dialog({
				bgiframe : true,
				autoOpen : false,
				height : intHeight,
				modal : true,
				resizable : false,
				width : intWidth,
				title : strTitle,
				buttons : $
						.extend(
								(arrData && arrData.isRollover && arrData.isRollover == 'Y')
										? {
											"Roll Over" : function() {
												$(this).dialog("close");
												_cutOffAlertResult(
														arrData.action,
														fptrCallback, arrData);
											}
										}
										: {},
								(arrData && arrData.isReject && arrData.isReject == 'Y')
										? {
											"Reject" : function() {
												$(this).dialog("close");
												_cutOffAlertResult('reject',
														fptrCallback, arrData);
											}
										}
										: {},
								(arrData && arrData.isReject && arrData.isDiscard == 'Y' && arrData.isRollover == 'N' && arrData.isReject == 'N')
										? {
											//FTMNTBANK-1780 Only Discard action is available
											"Ok" : function() {
												$(this).dialog("close");
												_cutOffAlertResult('discard',
														fptrCallback, arrData);
											}
										}
										: {},		
								(arrData && arrData.isDiscard && arrData.isDiscard == 'Y' && !(arrData.isRollover == 'N' && arrData.isReject == 'N'))
										? {
											"Discard" : function() {
												$(this).dialog("close");
												_cutOffAlertResult('discard',
														fptrCallback, arrData);
											}
										}
										: {})
			});

	_objCutOffDialog.dialog('open');
}
function _cutOffAlertResult(strAction, fptrCallback, arrData) {
	_objCutOffDialog.dialog('destroy');
	fptrCallback(strAction, arrData);
};
function postHandlePaymentInstrumentActionsProductCutOff(strAction, args,strRemarks) {
	doHandlePaymentInstrumentAction(strAction, true, 'Y');
}
/* Payment Entry Cutoff handling for group actions ends here */
/* MIXED Layout handling starts here*/
function handleLayoutBasedScreenRendering(strPayType, objPaymentResponseData) {
	if (strLayoutType === 'MIXEDLAYOUT') {
		var strPostFix = strPayType == 'B' ? 'Hdr' : '';
		var strDivPostFix = strPayType == 'B' ? 'HdrDiv' : 'Div';
		var strBankProdVal = $('#bankProduct' + strPostFix).val();
		var chrProductLevel = 'B';
		toggleContainerVisibility('paymentHeaderEntryStep2A');

		if (objPaymentResponseData && objPaymentResponseData.d
				&& objPaymentResponseData.d.receivableEntry
				&& objPaymentResponseData.d.receivableEntry.receivableHeaderInfo.productLevel) {
			chrProductLevel = objPaymentResponseData.d.receivableEntry.receivableHeaderInfo.productLevel;
		}
		
		if (chrProductLevel == 'B') {
			if (isEmpty(strBankProdVal)) {
				handleVerticalPanelCollapse(true, 'paymentInformation'
								+ strDivPostFix);
				if (strPayType == 'Q') {
					handleVerticalPanelCollapse(true, 'senderDetails'
									+ strDivPostFix);
					handleVerticalPanelCollapse(true, 'paymentDetails'
									+ strDivPostFix);
					handleVerticalPanelCollapse(true, 'addendaSection'
									+ strDivPostFix);
					if(strEntryType == 'SI')				
					handleVerticalPanelCollapse(true, 'siParametersSection');				
				}else{
					shiftDrCrSectionForBatchLevelParameters();
				}
			} else {
				handleVerticalPanelCollapse(false, 'paymentInformation'
								+ strDivPostFix);
				if (strPayType == 'Q') {
					handleVerticalPanelCollapse(false, 'senderDetails'
									+ strDivPostFix);
					handleVerticalPanelCollapse(false, 'paymentDetails'
									+ strDivPostFix);
					handleVerticalPanelCollapse(false, 'addendaSection'
									+ strDivPostFix);
					if(strEntryType == 'SI')				
						handleVerticalPanelCollapse(false, 'siParametersSection');				
				}else{
					shiftDrCrSectionForBatchLevelParameters();
				}
			}
		} else if (chrProductLevel == 'I') {
			if (isEmpty(strBankProdVal)) {
				if (strPayType == 'Q') {
					handleVerticalPanelCollapse(true, 'senderDetails'
									+ strDivPostFix);
					handleVerticalPanelCollapse(true, 'paymentDetails'
									+ strDivPostFix);
					handleVerticalPanelCollapse(true, 'addendaSection'
									+ strDivPostFix);
									
					if(strEntryType == 'SI')				
					handleVerticalPanelCollapse(true, 'siParametersSection');				
				}
			} else {
				if (strPayType == 'Q') {
					handleVerticalPanelCollapse(false, 'senderDetails'
									+ strDivPostFix);
					handleVerticalPanelCollapse(false, 'paymentDetails'
									+ strDivPostFix);
					handleVerticalPanelCollapse(false, 'addendaSection'
									+ strDivPostFix);
									
					if(strEntryType == 'SI')				
						handleVerticalPanelCollapse(false, 'siParametersSection');				
				}
			}
		}
	}
	else if (strLayoutType === 'WIRESWIFTLAYOUT'){
		$('#additionalInfoValue').attr('checked',true);
		$('#swiftInfoValue').attr('checked',true);
		$('#swiftInstructionValue').attr('checked',true);
		$('#regulatoryInfoValue').attr('checked',true);
		$('#referInfoValue').attr('checked',true);
	}
}
function shiftDrCrSectionForBatchLevelParameters() {
	if ($('#DrCrSectionColumn').length == 0) {
		var objDrCrColumn = $('<div id="DrCrSectionColumn" class="col-sm-4"></div>');
		$('#drCrFlagDiv,#prenoteDiv,#confidentialFlagDiv,#holdDiv,#holdUntilFlagDiv')
				.appendTo(objDrCrColumn);
		objDrCrColumn.insertBefore($('#txnWizardProductColumn'));
	}
}
function handleVerticalPanelCollapse(collpse, divId) {
	// collapse if currently expanded
	if (collpse
			&& !isEmpty(divId)
			&& !$('#' + divId + ' .vertical-collapsible-contents')
					.hasClass('content-display-none')) {
		$('#' + divId + ' span.expand-vertical').trigger('click');
	}
	//expand if currently collapsed
	else if (!collpse
			&& !isEmpty(divId)
			&& $('#' + divId + ' .vertical-collapsible-contents')
					.hasClass('content-display-none')) {
		$('#' + divId + ' span.expand-vertical').trigger('click');
	}
}
/* MIXED Layout handling ends here*/

function getReportPaymentDetail(screenType){
	var strUrl = '';
	strUrl = 'services/getReceivableQueryViewRecordDetailReport.pdf';
	form = document.createElement( 'FORM' );
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$Recordkey', strRecKey ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$screenType', screenType ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$PaymentCategory', strMyProduct ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$LayoutType', strLayoutType ) );
	form.action = strUrl;
	document.body.appendChild( form );
	form.submit();
	document.body.removeChild( form );	
}

function getReportPaymentTxnDetail(screenType, actionName){
	if(screenType != 'BatchPayment' && screenType !== 'PreliqSinglePayment')
		screenType = 'ViewTransaction';
	var arrExtension = {
			downloadXls : 'xls',
			downloadCsv : 'csv',
			downloadPdf : 'pdf',
			downloadTsv : 'tsv'
		};
	var strExtension = arrExtension[actionName];
	var withHeaderFlag = $("#headerCheckBox").is(':checked');
	var intCurrentInst = parseInt($($('.currentPage')[0]).text(),10);
	var strUrl = '';
	if(screenType == 'ViewTransaction')
		strUrl = 'services/getReceivableQueryViewRecordDetailReport.pdf';
	else
		strUrl = 'services/getReceivableQueryViewRecordDetailReport.' + strExtension;
	form = document.createElement( 'FORM' );
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );
	if(screenType == 'ViewTransaction')
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$Recordkey', strPaymentInstrumentIde ) );
	else	
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$Recordkey', strRecKey ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$screenType', screenType ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$PaymentCategory', strMyProduct ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$InstNumber', intCurrentInst ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$txtCSVFlag',withHeaderFlag) );
	form.action = strUrl;
	document.body.appendChild( form );
	form.submit();
	document.body.removeChild( form );	
}

function createFormField(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
}

function showUploadErrorReport(record) {
		var me = this;
		var strUrl = 'services/getFileUploadCenterList/getUploadErrorReport.pdf'
		form = document.createElement( 'FORM' );
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName,  csrfTokenValue ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'taskid', record.ahtskdata ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'isImportReport', 'Y' ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'client', record.ahtskclient) );
		form.action = strUrl;
		document.body.appendChild( form );
		form.submit();
		document.body.removeChild( form );
	}
	
function paintReceivablesDenominationInfoGrid(data) {
	var renderToDiv = null;
	
		renderToDiv = 'bankProductDenominationDiv_InstView';
		$(".denominationSectionDivNew_InstView").removeClass('hidden');
	if (!isEmpty(renderToDiv)) {
		$('#'+renderToDiv).empty();
		var store = createDenominationInfoGridStore(data);
		var grid = Ext.create('Ext.grid.Panel', {
			store : store,
			popup : true,
			features: [{
							ftype: 'summary'
					  }],
			columns : [{
						dataIndex : 'denomLabel',
						text : mapLbl['denominations'],
						width : 250,
						draggable : false,
						resizable : true,
						hideable : false,
						summaryType: function(records){
							return mapLbl['denomGrandTotal'];
						}
					}, {
						dataIndex : 'count',
						text : mapLbl['pieces'],
						width : 150,
						draggable : false,
						resizable : true,
						hideable : false
					}, {
						dataIndex : 'formattedValue',
						text : mapLbl['value'],
						flex : 1,
						draggable : false,
						resizable : true,
						hideable : false,
						summaryType: function(records){
									return records[0].get('formattedGrandTotalValue') ;
								}
					}],
			renderTo : renderToDiv				
			});
		grid.on('afterlayout', function() {	
			//$('#denominationSectionDivNew_InstView span.expand-vertical')
						//	.trigger('click');
		});
		
		return grid;
	}
}

function createDenominationInfoGridStore(jsonData) {
	var myStore = Ext.create('Ext.data.Store', {
				fields : ['denomLabel', 'count', 'denomValue','formattedValue','formattedGrandTotalValue'],
				data : jsonData,
				autoLoad : true
			});
	return myStore;
}

function showBatchInformationPopup(){
	$('#batchInstrumentSummaryDiv').dialog({
		autoOpen : false,
		maxHeight : 620,
		width : 690,
		modal : true,
		dialogClass : 'ft-dialog',
		resizable : false,
		draggable : false,
		title:mapLbl['txnInformationTitle'],
		open : function(){
			$('#batchInstrumentSummaryDiv').removeClass('hidden');
			getAddtionInformationData(strPaymentHeaderIde);
		},
		close : function(){
			$('#batchInstrumentSummaryDiv').dialog('close');
		}
	});
	
	$('#batchInstrumentSummaryDiv').dialog('open');
	$('#batchInstrumentSummaryDiv').dialog('option','position','center');
}

function closeBatchInformationPopup(){
	$('#batchInstrumentSummaryDiv').dialog('close');
}

var enteredByMap = {
	"AUTOMANDATE" : "Admin",
	"BANKENTRY" : "Admin",
	"BANKUPLOAD" : "Admin",
	"CLIENTENTRY" : "Client",
	"CLIENTUPLOAD" : "Client",
	"CWPHYBNKENTRY" : "Admin",
	"CWPHYBNKUPLD" : "Admin",
	"CWPHYCLTENTRY" : "Client",
	"CWPHYCLTUPLD" : "Client"
};

function paintReceivableInstrumentInfo(objHdrData) {
	var strPostFix = "Hdr_InstView";
	if (objHdrData && objHdrData.d) {
		var arrStdFields = objHdrData.d;
		$.each(arrStdFields, function(index, val) {
			if(index == "dataEntry")
				$('.'+index+strPostFix).text(getLabel(val,enteredByMap[val]));
			else
				$('.'+index+strPostFix).text(val);
		});
		/*if("dataEntry" in arrStdFields){
			$('.' + "dataEntry" + strPostFix).html(enteredByMap[arrStdFields.dataEntry]);
		}*/
	}
}

function getAddtionInformationData(strPaymentHeaderIde) {
	var objResponseData = null;
	if (strIdentifier && strIdentifier != '') {
		var strUrl = _mapUrl['recQueryAdditionalInfo'];;
		var jsonData = {'id' :strPaymentHeaderIde};
		$.ajax({
					url : strUrl,
					type : 'POST',
					async : false,
					data : jsonData,
					complete : function(XMLHttpRequest, textStatus) {
						if ("error" == textStatus) {
							// TODO : Error handling to be done.
							// alert("Unable to complete your request!");
							// blockPaymentUI(true);
						}
					},
					success : function(data) {
						if (data != null){
							paintReceivableInstrumentInfo(data);
						}
					}
				});
	}
	/*
	 * Remove comments to test with Dummay data if (isEmpty(objResponseData)) {
	 * objResponseData = dummayAdditionalInfoJson; }
	 */
	return objResponseData;
}

function showAdditionalInfoPopup(){
	
	$('#batchHeaderTrasanctionSummaryDiv').dialog({
		autoOpen : false,
		maxHeight : 620,
		width : 690,
		modal : true,
		resizable : false,
		draggable : false,
		dialogClass : 'ft-dialog',
		title : (recProductCategory !== "PRELIQ") ? mapLbl['lblBatchInfoTitle']: mapLbl['txnInformationTitle'],
		open : function(){
			if(!isEmpty(recProductCategory ) && recProductCategory !== "PRELIQ"){
				paintReceivableInformation('_InfoSpan', strPaymentHeaderIde,'B', false, 'VERIFY');
			}
			else
				paintPreliqInformation('_InfoSpan', strPaymentHeaderIde,'B', false, 'VERIFY');
		},
		close : function(){
			$(this).dialog("close");
		}
	});
	//opening the transaction n=info pop up and positioning it to center
	$('#batchHeaderTrasanctionSummaryDiv').dialog("open");
	$('#batchHeaderTrasanctionSummaryDiv').dialog('option','position','center');
}

function closeAdditionalInfoPopup(){
	$('#batchHeaderTrasanctionSummaryDiv').dialog("close");
}

function paintReceivableInformation(strPostFix, strIdentifier, strPmtType, blnCollapsed, strMode) {
	var strPostFix = '_InfoSpan', strValueToBeDisplayed = null, intMaxFieldLength = 20, blnHistoryExists = false, strAuthLevel = 'B',strhdrActionStatus ='';
	// if (isEmpty(strPaymentAdditionalInfoData))

	strPaymentAdditionalInfoData = getReceivableAddtionInformationData(strIdentifier);

	if (strPaymentAdditionalInfoData) {
		if (strPmtType === 'Q'
				&& paymentResponseInstrumentData
				&& paymentResponseInstrumentData.d
				&& paymentResponseInstrumentData.d.receivableEntry
				&& paymentResponseInstrumentData.d.receivableEntry.receivableHeaderInfo
				&& paymentResponseInstrumentData.d.receivableEntry.receivableHeaderInfo.authLevel)
			strAuthLevel = paymentResponseInstrumentData.d.receivableEntry.receivableHeaderInfo.authLevel;
		else if (paymentResponseHeaderData
				&& paymentResponseHeaderData.d
				&& paymentResponseHeaderData.d.receivableEntry
				&& paymentResponseHeaderData.d.receivableEntry.receivableHeaderInfo
				&& paymentResponseHeaderData.d.receivableEntry.receivableHeaderInfo.authLevel)
			strAuthLevel = paymentResponseHeaderData.d.receivableEntry.receivableHeaderInfo.authLevel;
		if (strPmtType === 'Q'
				&& paymentResponseInstrumentData
				&& paymentResponseInstrumentData.d
				&& paymentResponseInstrumentData.d.receivableEntry
				&& paymentResponseInstrumentData.d.receivableEntry.receivableHeaderInfo
				&& paymentResponseInstrumentData.d.receivableEntry.receivableHeaderInfo.hdrActionStatus)
			strhdrActionStatus = paymentResponseInstrumentData.d.receivableEntry.receivableHeaderInfo.hdrActionStatus;
		else if (paymentResponseHeaderData
				&& paymentResponseHeaderData.d
				&& paymentResponseHeaderData.d.receivableEntry
				&& paymentResponseHeaderData.d.receivableEntry.receivableHeaderInfo
				&& paymentResponseHeaderData.d.receivableEntry.receivableHeaderInfo.hdrActionStatus)
			strhdrActionStatus = paymentResponseHeaderData.d.receivableEntry.receivableHeaderInfo.hdrActionStatus;

		$.each(strPaymentAdditionalInfoData, function(fieldName, fieldValue) {
			intMaxFieldLength = strPmtType && strPmtType ==='Q' ? 20 : 25;
			if (fieldName === 'importedFilesCount' && fieldValue != "0") {
				$("." + fieldName + strPostFix).unbind('click');
				$("." + fieldName + strPostFix).bind('click', function() {
							openFilesImportedPopup(strIdentifier);
						});
			} 
			if (fieldName === 'history' && !isEmpty(fieldValue) 
			&& (strPmtType === 'B') ) {
				blnHistoryExists = true;
				paintReceivableTransactionAuditInfoGrid(fieldValue, strPmtType, strMode);
			}
			if (fieldName === 'hostMessage') {
				intMaxFieldLength = 60;
			}
			if (fieldName === 'enrichmentProfile') {
				intMaxFieldLength = strPmtType && strPmtType ==='Q' ? 17 : intMaxFieldLength;
			}
			if (fieldName === 'approvalName' && !isEmpty(fieldValue)) {
				paintApprovalStructureInformation(strPostFix, strIdentifier);
			}
			if(fieldName === 'dataEntry'){
				$('.'+fieldName+strPostFix).html(getLabel(fieldValue,enteredByMap[fieldValue]));
			}
			else{
				strValueToBeDisplayed = fieldValue || 'None';
				strValueToBeDisplayed = fieldValue
						&& fieldValue.length > intMaxFieldLength
						? getTruncatedStringByLengthWithTooltip("." + fieldName
										+ strPostFix, fieldValue, intMaxFieldLength)
						: fieldValue;
				$("." + fieldName + strPostFix).text(strValueToBeDisplayed);
			}
		});
		/*$(".importedFilesCount_InfoSpan").addClass('t7-anchor');
		if (isEmpty(strPaymentAdditionalInfoData.importedFilesCount)) {
			$(".importedFilesCount_InfoSpan").text('None')
					.removeClass('t7-anchor');
		}*/
		if (!isEmpty(strPaymentAdditionalInfoData.instrumentStatus)) {
			$('.instrumentStatus_HdrInfoSpan')
					.text(strPaymentAdditionalInfoData.instrumentStatus);
		}
	}
	if (strAuthLevel === 'B' && strPmtType === 'B') {
		$(".approvalName" + strPostFix + 'Div').addClass('hidden');
		$(".pendingApprovals" + strPostFix + 'Div').addClass('hidden');
	}

	if (!blnHistoryExists && blnCollapsed && strMode && strMode !=='VERIFY')
		handleAdditionalInfoSectionCollapsed(strPmtType);
	if(strhdrActionStatus ==='0' || strhdrActionStatus ==='1' || strhdrActionStatus ==='9'){
		$('.approvalName'+ strPostFix +'Div').addClass('hidden');
		$('.pendingApprovals'+ strPostFix +'Div').addClass('hidden');
	}
	else{
		$('.approvalName'+ strPostFix +'Div').removeClass('hidden');
		$('.pendingApprovals'+ strPostFix +'Div').removeClass('hidden');
	}
	
	if (paymentResponseHeaderData
			&& paymentResponseHeaderData.d
			&& paymentResponseHeaderData.d.receivableEntry
			&& paymentResponseHeaderData.d.receivableEntry.receivableHeaderInfo) {
		var objAdditionalInfo = paymentResponseHeaderData.d.receivableEntry.receivableHeaderInfo;
		var strHdrActionStatus = objAdditionalInfo.hdrActionStatus
				? objAdditionalInfo.hdrActionStatus
				: null;
		
		if(strHdrActionStatus == null){
			$('.forPendingApproval , .forDraft, .forPendingSubmit').addClass('hidden');
			$('.forNew').removeClass('hidden');
		}else if (strHdrActionStatus === '0') {//Draft
			$(".forPendingApproval,.forPendingSubmit, .forNew").addClass('hidden');
			$(".forDraft").removeClass('hidden');
			paintReceivableHeaderAmountInfo(strPostFix,objAdditionalInfo,null);
		} else if (strHdrActionStatus === '101' || strHdrActionStatus === '9') {// Pending Submit
			$(".forPendingApproval,.forDraft, .forNew").addClass('hidden');
			$(".forPendingSubmit").removeClass('hidden');
			paintReceivableHeaderAmountInfo(strPostFix,objAdditionalInfo,null);
		}
		else if (strHdrActionStatus === '1') {// Pending Approval
			$(".forDraft, .forPendingSubmit, .forNew").addClass('hidden');
			$(".forPendingApproval").removeClass('hidden');
			paintReceivableHeaderAmountInfo(strPostFix,objAdditionalInfo,'PENDINGAPPROVAL');
		}
		else { //Post Approval
			$(".forDraft, .forPendingSubmit, .forNew").addClass('hidden');
			$(".forPendingApproval").removeClass('hidden');
			paintReceivableHeaderAmountInfo(strPostFix,objAdditionalInfo,null);	
		}
			
		$('.hdrReference'+strPostFix).text(objAdditionalInfo.hdrReference ? objAdditionalInfo.hdrReference : '');
		$('.hdrSource'+strPostFix).text(objAdditionalInfo.hdrSource ? objAdditionalInfo.hdrSource : '');
		if($('.hdrSource'+strPostFix).text().length > 20)
		$('.hdrSource'+strPostFix).prop('title',objAdditionalInfo.hdrSource ? objAdditionalInfo.hdrSource : '');
		$('.hdrMyProductDescription'+strPostFix).text(objAdditionalInfo.hdrMyProductDescription ? objAdditionalInfo.hdrMyProductDescription : '');
		$('.totalAmountFormatted'+strPostFix).text(objAdditionalInfo.totalAmountFormatted ? objAdditionalInfo.totalAmountFormatted : '');
		$('.hdrTotalNo'+strPostFix).text(objAdditionalInfo.hdrTotalNo ? objAdditionalInfo.hdrTotalNo : '');
	}
	
	if(paymentResponseHeaderData
			&& paymentResponseHeaderData.d
			&& paymentResponseHeaderData.d.receivableEntry
			&& paymentResponseHeaderData.d.receivableEntry.standardField){
		$.each(paymentResponseHeaderData.d.receivableEntry.standardField, function(index, cfg) {
			if('value' in cfg){
					if(cfg.fieldName === 'totalOpenAmount'){
					var strFormattedValue = '';
					strFormattedValue = cfg.formattedValue
						? cfg.formattedValue.substring(4)
						: cfg.value;
					$('.'+cfg.fieldName+strPostFix).text(strFormattedValue);
				}
				else if(cfg.fieldName === 'totalPaidAmount' || cfg.fieldName === 'totalReturnAmount'){
					$('.'+cfg.fieldName+strPostFix).text(cfg.formattedValue);
				}
				else
					$('.'+cfg.fieldName+strPostFix).text(cfg.value);
			}
		});
	}
				
}

function handleAdditionalInfoSectionCollapsed(strPmtType) {
	if (strPaymentType && strPaymentType === 'QUICKPAY')
		$('#batchInstrumentTrasanctionSummaryDiv span.expand-vertical')
				.trigger('click');
	else if (strPmtType === 'B')
		$('#batchHeaderTrasanctionSummaryDiv span.expand-vertical')
				.trigger('click');
	else
		$('#batchInstrumentTrasanctionSummaryDiv span.expand-vertical')
				.trigger('click');
}

function getReceivableAddtionInformationData(strIdentifier) {
	var objResponseData = null;
	if (strIdentifier && strIdentifier != '') {
		var strUrl = _mapUrl['recQueryAdditionalInfo'];
		var jsonData = {'id' :strIdentifier };
		$.ajax({
					url : strUrl,
					type : 'POST',
					async : false,
					 data : jsonData,
					complete : function(XMLHttpRequest, textStatus) {
						if ("error" == textStatus) {
							// TODO : Error handling to be done.
							// alert("Unable to complete your request!");
							// blockPaymentUI(true);
						}
					},
					success : function(data) {
						if (data && data.d)
							objResponseData = data.d;
					}
				});
	}
	/*
	 * Remove comments to test with Dummay data if (isEmpty(objResponseData)) {
	 * objResponseData = dummayAdditionalInfoJson; }
	 */
	return objResponseData;
}

function paintReceivableTransactionAuditInfoGrid(data, strPmtType, strMode) {
	var renderToDiv = null;
	if (strPmtType && strPmtType === 'B') {
		renderToDiv = 'auditInfoGridDiv';
		$(".auditInformationInfoHdrDiv").removeClass('hidden');
	} else if (strPaymentType && strPaymentType === 'QUICKPAY') {
		renderToDiv = 'auditInfoInstrumentGridDiv';
		$(".auditInformationInfoDtlDiv").removeClass('hidden');
	} else {
		renderToDiv = 'auditInfoInstrumentGridDiv';
		$(".auditInformationInfoDtlDiv").removeClass('hidden');
	}
	
	if (!isEmpty(renderToDiv)) {
		$('#'+renderToDiv).empty();
		var store = createAuditInfoGridStore(data);
		var grid = Ext.create('Ext.grid.Panel', {
			store : store,
			popup : true,
			columns : [{
						dataIndex : 'userCode',
						text : mapLbl['txnUser'],
						width : 180,
						draggable : false,
						resizable : false,
						hideable : false
					}, {
						dataIndex : 'logDate',
						text : mapLbl['txnDateTime'],
						width : 220,
						draggable : false,
						resizable : false,
						hideable : false
					}, {
						dataIndex : 'action',
						text : mapLbl['txnAction'],
						width : 150,
						draggable : false,
						resizable : false,
						hideable : false
					}, {
						dataIndex : 'remarks',
						text : mapLbl['txnRemarks'],
						flex : 1,
						draggable : false,
						resizable : false,
						hideable : false
					}],
			renderTo : renderToDiv
				/*
			 * , afterRender : function() { if(strPmtType==='Q')
			 * $('#paymentInstrumentTrasanctionSummaryDiv
			 * span.expand-vertical').trigger('click'); else
			 * if(strPmtType==='B') $('#paymentHeadeerTrasanctionSummaryDiv
			 * span.expand-vertical').trigger('click'); }
			 */
			});
		grid.on('afterlayout', function() {
			if (strMode && strMode !== 'VERIFY') {
				if (strPaymentType
						&& (strPaymentType === 'QUICKPAY' || strPaymentType === 'QUICKPAYSTI'))
					$('#batchInstrumentTrasanctionSummaryDiv span.expand-vertical')
							.trigger('click');
				else if (strPmtType === 'B')
					$('#batchHeaderTrasanctionSummaryDiv span.expand-vertical')
							.trigger('click');
				else
					$('#batchInstrumentTrasanctionSummaryDiv span.expand-vertical')
							.trigger('click');
			}			
		});
		return grid;
	}
}

function createAuditInfoGridStore(jsonData) {
	var myStore = Ext.create('Ext.data.Store', {
				fields : ['zone', 'version', 'recordKeyNo', 'userCode',
						'logDate', 'requestState', 'phdClient', 'logNumber',
						'pirNumber', 'pirSerial', 'avmLevel', 'remarks',
						'__metadata', 'action'],
				data : jsonData,
				autoLoad : true
			});
	return myStore;
}

function paintReceivableHeaderAmountInfo(strPostFix, objHdrInfo, strBatchMode) {
	var strHdrEnteredNo = objHdrInfo.hdrEnteredNo;
	var strHdrEnteredAmount = objHdrInfo.hdrEnteredAmountFormatted;
	var strHdrTotalNo = objHdrInfo.hdrTotalNo;
	if (jQuery.isNumeric(strHdrTotalNo) && jQuery.isNumeric(strHdrEnteredNo)
			&& (strHdrTotalNo - strHdrEnteredNo >= 0))
		strHdrTotalNo = strHdrTotalNo - strHdrEnteredNo;
	strTotalAmount = objHdrInfo.balanceAmountFormatted;
	$('.hdrEnteredAmountFormatted' + strPostFix).html(strHdrEnteredAmount);
	$('.balanceAmountFormatted' + strPostFix).html(strTotalAmount);
	$('.enteredInstCount' + strPostFix).html(strHdrEnteredNo);
	$('.totalInstCount' + strPostFix).html(strHdrTotalNo);
	if (strBatchMode === 'PENDINGAPPROVAL') {
		$(".hdrPendingAuth" + strPostFix).text(strHdrEnteredAmount);
		$(".hdrAuth" + strPostFix).text("0.00");
		$('.enteredInstCount' + strPostFix).html(strHdrTotalNo);
		$('.totalInstCount' + strPostFix).html(strHdrEnteredNo);
	}
}

function paintPreliqInformation(strPostFix, strIdentifier, strPmtType, blnCollapsed, strMode) {
	var strPostFix = '_InfoSpan', strValueToBeDisplayed = null, intMaxFieldLength = 20, blnHistoryExists = false, strAuthLevel = 'B',strhdrActionStatus ='';
	// if (isEmpty(strPaymentAdditionalInfoData))

	strPaymentAdditionalInfoData = getReceivableAddtionInformationData(strIdentifier);

	if (strPaymentAdditionalInfoData) {
		if (strPmtType === 'Q'
				&& paymentResponseInstrumentData
				&& paymentResponseInstrumentData.d
				&& paymentResponseInstrumentData.d.instruments[0]
				&& paymentResponseInstrumentData.d.instruments[0].receivableHeaderInfo
				&& paymentResponseInstrumentData.d.instruments[0].receivableHeaderInfo.authLevel)
			strAuthLevel = paymentResponseInstrumentData.d.instruments[0].receivableHeaderInfo.authLevel;
		else if (paymentResponseHeaderData
				&& paymentResponseHeaderData.d
				&& paymentResponseHeaderData.d.instruments[0]
				&& paymentResponseHeaderData.d.instruments[0].receivableHeaderInfo
				&& paymentResponseHeaderData.d.instruments[0].receivableHeaderInfo.authLevel)
			strAuthLevel = paymentResponseHeaderData.d.instruments[0].receivableHeaderInfo.authLevel;
		if (strPmtType === 'Q'
				&& paymentResponseInstrumentData
				&& paymentResponseInstrumentData.d
				&& paymentResponseInstrumentData.d.instruments[0]
				&& paymentResponseInstrumentData.d.instruments[0].receivableHeaderInfo
				&& paymentResponseInstrumentData.d.instruments[0].receivableHeaderInfo.hdrActionStatus)
			strhdrActionStatus = paymentResponseInstrumentData.d.instruments[0].receivableHeaderInfo.hdrActionStatus;
		else if (paymentResponseHeaderData
				&& paymentResponseHeaderData.d
				&& paymentResponseHeaderData.d.instruments[0]
				&& paymentResponseHeaderData.d.instruments[0].receivableHeaderInfo
				&& paymentResponseHeaderData.d.instruments[0].receivableHeaderInfo.hdrActionStatus)
			strhdrActionStatus = paymentResponseHeaderData.d.instruments[0].receivableHeaderInfo.hdrActionStatus;

		$.each(strPaymentAdditionalInfoData, function(fieldName, fieldValue) {
			intMaxFieldLength = strPmtType && strPmtType ==='Q' ? 20 : 25;
			if (fieldName === 'importedFilesCount' && fieldValue != "0") {
				$("." + fieldName + strPostFix).unbind('click');
				$("." + fieldName + strPostFix).bind('click', function() {
							openFilesImportedPopup(strIdentifier);
						});
			} 
			if (fieldName === 'hostMessage') {
				intMaxFieldLength = 60;
			}
			if (fieldName === 'enrichmentProfile') {
				intMaxFieldLength = strPmtType && strPmtType ==='Q' ? 17 : intMaxFieldLength;
			}
			if (fieldName === 'approvalName' && !isEmpty(fieldValue)) {
				paintApprovalStructureInformation(strPostFix, strIdentifier);
			}
			if(fieldName === 'dataEntry'){
				$('.'+fieldName+strPostFix).html(getLabel(fieldValue,enteredByMap[fieldValue]));
			}
			else{
				strValueToBeDisplayed = fieldValue || 'None';
				strValueToBeDisplayed = fieldValue
						&& fieldValue.length > intMaxFieldLength
						? getTruncatedStringByLengthWithTooltip("." + fieldName
										+ strPostFix, fieldValue, intMaxFieldLength)
						: fieldValue;
				$("." + fieldName + strPostFix).text(strValueToBeDisplayed);
			}
		});

		if (!isEmpty(strPaymentAdditionalInfoData.instrumentStatus)) {
			$('.instrumentStatus_HdrInfoSpan')
					.text(strPaymentAdditionalInfoData.instrumentStatus);
		}
	}
	if (strAuthLevel === 'B' && strPmtType === 'B') {
		$(".approvalName" + strPostFix + 'Div').addClass('hidden');
		$(".pendingApprovals" + strPostFix + 'Div').addClass('hidden');
	}

	if (!blnHistoryExists && blnCollapsed && strMode && strMode !=='VERIFY')
		handleAdditionalInfoSectionCollapsed(strPmtType);
	if(strhdrActionStatus ==='0' || strhdrActionStatus ==='1' || strhdrActionStatus ==='9'){
		$('.approvalName'+ strPostFix +'Div').addClass('hidden');
		$('.pendingApprovals'+ strPostFix +'Div').addClass('hidden');
	}
	else{
		$('.approvalName'+ strPostFix +'Div').removeClass('hidden');
		$('.pendingApprovals'+ strPostFix +'Div').removeClass('hidden');
	}
	
	if (paymentResponseHeaderData
			&& paymentResponseHeaderData.d
			&& paymentResponseHeaderData.d.instruments[0]
			&& paymentResponseHeaderData.d.instruments[0].receivableHeaderInfo) {
		var objAdditionalInfo = paymentResponseHeaderData.d.instruments[0].receivableHeaderInfo;
		var strHdrActionStatus = objAdditionalInfo.hdrActionStatus
				? objAdditionalInfo.hdrActionStatus
				: null;
		
		if(strHdrActionStatus == null){
			$('.forPendingApproval , .forDraft, .forPendingSubmit').addClass('hidden');
			$('.forNew').removeClass('hidden');
		}else if (strHdrActionStatus === '0') {//Draft
			$(".forPendingApproval,.forPendingSubmit, .forNew").addClass('hidden');
			$(".forDraft").removeClass('hidden');
			paintReceivableHeaderAmountInfo(strPostFix,objAdditionalInfo,null);
		} else if (strHdrActionStatus === '101' || strHdrActionStatus === '9') {// Pending Submit
			$(".forPendingApproval,.forDraft, .forNew").addClass('hidden');
			$(".forPendingSubmit").removeClass('hidden');
			paintReceivableHeaderAmountInfo(strPostFix,objAdditionalInfo,null);
		}
		else if (strHdrActionStatus === '1') {// Pending Approval
			$(".forDraft, .forPendingSubmit, .forNew").addClass('hidden');
			$(".forPendingApproval").removeClass('hidden');
			paintReceivableHeaderAmountInfo(strPostFix,objAdditionalInfo,'PENDINGAPPROVAL');
		}
		else { //Post Approval
			$(".forDraft, .forPendingSubmit, .forNew").addClass('hidden');
			$(".forPendingApproval").removeClass('hidden');
			paintReceivableHeaderAmountInfo(strPostFix,objAdditionalInfo,null);	
		}
			
		$('.hdrReference'+strPostFix).text(objAdditionalInfo.hdrReference ? objAdditionalInfo.hdrReference : '');
		$('.hdrSource'+strPostFix).text(objAdditionalInfo.hdrSource ? objAdditionalInfo.hdrSource : '');
		if($('.hdrSource'+strPostFix).text().length > 20)
		$('.hdrSource'+strPostFix).prop('title',objAdditionalInfo.hdrSource ? objAdditionalInfo.hdrSource : '');
		$('.hdrMyProductDescription'+strPostFix).text(objAdditionalInfo.hdrMyProductDescription ? objAdditionalInfo.hdrMyProductDescription : '');
		$('.totalAmountFormatted'+strPostFix).text(objAdditionalInfo.totalAmountFormatted ? objAdditionalInfo.totalAmountFormatted : '');
		$('.hdrTotalNo'+strPostFix).text(objAdditionalInfo.hdrTotalNo ? objAdditionalInfo.hdrTotalNo : '');
	}
	
	if(paymentResponseHeaderData
			&& paymentResponseHeaderData.d
			&& paymentResponseHeaderData.d.instruments[0]
			&& paymentResponseHeaderData.d.instruments[0].standardField){
		$.each(paymentResponseHeaderData.d.instruments[0].standardField, function(index, cfg) {
			if('value' in cfg){
				if(cfg.fieldName === 'totalOpenAmount'){
					var strFormattedValue = '';
					strFormattedValue = cfg.formattedValue
						? cfg.formattedValue.substring(4)
						: cfg.value;
					$('.'+cfg.fieldName+strPostFix).text(strFormattedValue);
				}
				else
					$('.'+cfg.fieldName+strPostFix).text(cfg.value);
			}
		});
	}
				
}

function viewUploadedImage(fileName){
	if (!isEmpty(fileName)) {
		blockPaymentInstrumentUI(true);
		$.ajax({
			url : 'services/receivabledetail/chkimage/'+fileName+'.json',
			data : {},
			type : 'POST',
			success : function(responseData) {
				blockPaymentInstrumentUI(false);
				var popupHeight, popupWidth;
				if(responseData.success && responseData.returnMessage){
					$( '#checkImage' ).attr('src','data:image/jpeg;base64,'+responseData.returnMessage+'');
					popupHeight = '400';
					popupWidth = '800';
				}
				else{
					$( '#checkImage' ).attr('src','./static/images/misc/no_image.jpg');
					popupHeight = '400';
					popupWidth = '300';
				}				
				$('#checkImageDiv').css('overflow','auto');
				$( '#checkImageDiv' ).dialog(
				{
					autoOpen : false,
					height : popupHeight,
					modal : true,
					resizable : true,
					width : popupWidth,
					title : 'Check Image',
					position: 'center',
					buttons :
					{
						"Close" : function()
						{
							$( this ).dialog( "close" );
						}
					}
				} );
				$( '#checkImageDiv' ).dialog( 'open' );					
				
			},
			error : function( request, status, error )
			{
				$( '#checkImage' ).attr('src','./static/images/misc/no_image.jpg');
				$('#checkImageDiv').css('overflow','auto');
				$( '#checkImageDiv' ).dialog(
				{
					autoOpen : false,
					height : "400",
					modal : true,
					resizable : true,
					width : "300",
					zIndex: '29001',
					title : 'Check Image',
					position: 'center',
					buttons :
					{
						"Close" : function()
						{
							$( this ).dialog( "close" );
						}
					}
				} );
				$( '#checkImageDiv' ).dialog( 'open' );	
			}
		});
	}
}