/**
 * The paymentResponseHeaderData is used to hold the JSON response for
 * edit/view/add batch header
 */
var paymentResponseHeaderData = null;
var matrixNameGrid = null;
var txnDetailsGrid = null;
/**
 * The strPaymentHeaderIde is used to hold the batch hedaer identifier
 */
var strPaymentHeaderIde = null;
var strIdentifier = null;
var chrAllowGridLayoutEntry = 'N';
var objHeaderSaveResponseData = null;
var instrumentEntryGridRowData = null;
var pollForFileUpload = false;
var arrTemplateUsersHdr = [];
function loadReceivableHeaderFields(strMyProduct) {
	// blockPaymentUI(true);
	if (!isEmpty(strMyProduct)) {
		var url = _mapUrl['loadBatchHeaderFieldsUrl'] + "/" + strMyProduct
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
					paintErrors(arrError);
					blockPaymentUI(false);
				}
			},
			success : function(data) {
				if (data != null) {
					if (data.d
							&& data.d.message
							&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
						doHandleEmptyScreenErrorForPaymentHeader(data.d.message.errors);
						blockPaymentUI(false);
					} else {
						paymentResponseHeaderData = data;
						doRemoveStaticText("paymentHeaderEntryStep2");
						paintPaymentHeaderUI(data);
						initatePaymentHeaderValidation();
						blockPaymentUI(false);
						handleEmptyEnrichmentDivs();
					}
				}
			}
		});
	} else {
		doHandleUnknownErrorForBatch();
		blockPaymentUI(false);
	}
}
function readPaymentHeaderForEdit(strParentIde, strDhdDepNumber) {
	if (!isEmpty(strParentIde)) {
		var url = _mapUrl['readSavedBatchHeaderUrl'] + "(" + strParentIde
				+ ").json";
		blockPaymentUI(true);
		$.ajax({
			type : "POST",
			url : url,
			async : false,
			complete : function(XMLHttpRequest, textStatus) {
				if ("error" == textStatus) {
					doHandleUnknownErrorForBatch();
					blockPaymentUI(false);
				}
			},
			success : function(data) {
				if (data != null) {
					if (data.d
							&& data.d.message
							&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
						doHandleEmptyScreenErrorForPaymentHeader(data.d.message.errors);
						blockPaymentUI(false);

					} else {
						strIdentifier = strDhdDepNumber;
						strPaymentHeaderIde = strParentIde;
						paymentResponseHeaderData = data;
						objHeaderSaveResponseData = data;
						if (data) {
							if (data.d
									&& data.d.receivableEntry
									&& data.d.receivableEntry.receivableHeaderInfo
									&& data.d.receivableEntry.receivableHeaderInfo.dhddepnumber) {
								strIdentifier = data.d.receivableEntry.receivableHeaderInfo.dhddepnumber;
							}
							if (data.d && data.d.__metadata
									&& data.d.__metadata._headerId) {
								strPaymentHeaderIde = data.d.__metadata._headerId;
							}
						}
						doRemoveStaticText("paymentHeaderEntryStep2");
						paintPaymentHeaderUI(data);
						initatePaymentHeaderValidation();
						if (strCloneAction === 'Y'
								&& strEntryType === 'TEMPLATE') {
							togglerPaymentHederScreen(true);
						} else {
							togglerPaymentHederScreen(false);
						}
						populatePaymentHeaderViewOnlySection(
								paymentResponseHeaderData,
								data.d.receivableEntry.receivableHeaderInfo, 'Y',
								'EDIT');
						// TODO : To be handled
						/*
						 * if (data && data.d && data.d.receivableEntry &&
						 * data.d.receivableEntry.receivableHeaderInfo) { //
						 * updatePaymentSummaryInfo(data.d.receivableEntry.receivableHeaderInfo);
						 * paintPaymentMoreDetailInfo(data.d.receivableEntry.receivableHeaderInfo);
						 * if
						 * (data.d.receivableEntry.receivableHeaderInfo.fileUploadProgressFlag) {
						 * pollForFileUpload =
						 * (data.d.receivableEntry.receivableHeaderInfo.fileUploadProgressFlag
						 * === 1) } }
						 */
						// paintPaymentHeaderActions('EDITNEXT');
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
						blockPaymentUI(false);

						if (strCloneAction === 'Y'
								&& strEntryType === 'TEMPLATE') {
						} else {
							doHandleEntryGridLoading(false, true);
						}
						strCloneAction = 'N';

					}
				}
			}
		});
	} else {
		doHandleUnknownErrorForBatch();
		blockPaymentUI(false);
	}
}
function refreshPaymentHeaderDataForEdit(strParentIde, strDhdDepNumber) {
	if (!isEmpty(strParentIde)) {
		var url = _mapUrl['readSavedBatchHeaderUrl'] + "(" + strParentIde
				+ ").json";
		blockPaymentUI(true);
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
					paintErrors(arrError);
					blockPaymentUI(false);
				}
			},
			success : function(data) {
				if (data != null) {
					if (data.d
							&& data.d.message
							&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
						doHandleEmptyScreenErrorForPaymentHeader(data.d.message.errors);
						blockPaymentUI(false);

					} else {
						strIdentifier = strDhdDepNumber;
						strPaymentHeaderIde = strParentIde;
						paymentResponseHeaderData = data;
						objHeaderSaveResponseData = data;
						if (data) {
							if (data.d
									&& data.d.receivableEntry
									&& data.d.receivableEntry.receivableHeaderInfo
									&& data.d.receivableEntry.receivableHeaderInfo.dhddepnumber) {
								strIdentifier = data.d.receivableEntry.receivableHeaderInfo.dhddepnumber;
							}
							if (data.d && data.d.__metadata
									&& data.d.__metadata._headerId) {
								strPaymentHeaderIde = data.d.__metadata._headerId;
							}
						}
						doRemoveStaticText("paymentHeaderEntryStep2");
						paintPaymentHeaderUI(data);
						initatePaymentHeaderValidation();
						// togglerPaymentHederScreen(false);
						// populatePaymentHeaderViewOnlySection(
						// paymentResponseHeaderData,
						// data.d.receivableEntry.receivableHeaderInfo, 'Y');
						// TODO : To be handled
						/*
						 * if (data && data.d && data.d.receivableEntry &&
						 * data.d.receivableEntry.receivableHeaderInfo) { //
						 * updatePaymentSummaryInfo(data.d.receivableEntry.receivableHeaderInfo);
						 * paintPaymentMoreDetailInfo(data.d.receivableEntry.receivableHeaderInfo);
						 * if
						 * (data.d.receivableEntry.receivableHeaderInfo.fileUploadProgressFlag) {
						 * pollForFileUpload =
						 * (data.d.receivableEntry.receivableHeaderInfo.fileUploadProgressFlag
						 * === 1) } }
						 */
						// paintPaymentHeaderActions('EDITNEXT');
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
						blockPaymentUI(false);
						// doHandleEntryGridLoading(false, true);
					}
				}
			}
		});
	} else {
		doHandleUnknownErrorForBatch();
		blockPaymentUI(false);
	}
}
function readPaymentHeaderForView(strParentIde, strDhdDepNumber) {
	if (!isEmpty(strParentIde)) {
		if(!isEmpty(recProductCategory) && recProductCategory === "PRELIQ")
		{
		var strUrl = _mapUrl['readViewPreliqUrl'];
		var jsonData = {'id' : strParentIde};
		blockPaymentUI(true);
        $.ajax({
            url : strUrl,
            type : 'POST',
            data : jsonData,
            async : false,
			complete : function(XMLHttpRequest, textStatus) {
				if ("error" == textStatus) {
					doHandleUnknownErrorForBatch();
						blockPaymentUI(false);
					}
				},
				success : function(data) {
					if (data != null) {
						if (data.d
								&& data.d.message
								&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
							doHandleEmptyScreenErrorForPaymentHeader(data.d.message.errors);
							blockPaymentUI(false);

					} else {
							paymentResponseHeaderData = data;
							if (data.d.instruments[0].receivableHeaderInfo.hdrModule == strEntityType) {
							var hdrActionState = data.d.instruments[0].receivableHeaderInfo.hdrActionStatus;
							if (hdrActionState == '1' || hdrActionState == '80') {
								paintPaymentHeaderActionsForView('SUBMIT')
							} else if (hdrActionState == '33'
									|| (data.d.instruments[0].receivableHeaderInfo.pirMode === 'SI' && hdrActionState == '4')) {
								paintPaymentHeaderActionsForView('CANCELDISABLE')
							} else if (hdrActionState == '82'
									|| (data.d.instruments[0].receivableHeaderInfo.pirMode === 'SI' && hdrActionState == '13')) {
								paintPaymentHeaderActionsForView('CANCELENABLE')
							} else if (hdrActionState == '0'
									|| hdrActionState == '1'
									// || hdrActionState == '2'
									|| (data.d.instruments[0].receivableHeaderInfo.pirMode != 'SI' && hdrActionState == '4')
									|| (data.d.instruments[0].receivableHeaderInfo.pirMode != 'SI' && hdrActionState == '5')
									|| hdrActionState == '86'
									|| hdrActionState == '87'
									|| hdrActionState == '94'
									|| hdrActionState == '95'
									|| hdrActionState == '79'
									|| hdrActionState == '80'
									|| hdrActionState == '73'
									|| (data.d.instruments[0].receivableHeaderInfo.pirMode == 'SI' && hdrActionState == '9')
									|| (data.d.instruments[0].receivableHeaderInfo.pirMode == 'SI' && hdrActionState == '10')) {
								paintPaymentHeaderActionsForView('CANCELANDDISCARD');
							} else {
								paintPaymentHeaderActionsForView('CANCELONLY');
							}
						}
						else{
							paintPaymentHeaderActionsForView('CANCELONLY');
							}
							populatePreliqFields(data);
							blockPaymentUI(false);
							
						}
					}
				}
			});
		}
		else{
			var url = _mapUrl['readViewBatchHeaderUrl'] ;
		    var jsonData ={'id': strParentIde};
			blockPaymentUI(true);
			$.ajax({
				type : "POST",
				data :jsonData,
				url : url,
				async : false,
				complete : function(XMLHttpRequest, textStatus) {
					if ("error" == textStatus) {
						doHandleUnknownErrorForBatch();
						blockPaymentUI(false);
					}
				},
				success : function(data) {
					if (data != null) {
						if (data.d
								&& data.d.message
								&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
							doHandleEmptyScreenErrorForPaymentHeader(data.d.message.errors);
							blockPaymentUI(false);

						} else {
							strIdentifier = strDhdDepNumber;
							strPaymentHeaderIde = strParentIde;
							paymentResponseHeaderData = data;
							objHeaderSaveResponseData = data;
							if (data) {
								if (data.d
										&& data.d.receivableEntry
										&& data.d.receivableEntry.receivableHeaderInfo
										&& data.d.receivableEntry.receivableHeaderInfo.dhddepnumber) {
									strIdentifier = data.d.receivableEntry.receivableHeaderInfo.dhddepnumber;
								}
								if (data.d && data.d.__metadata
										&& data.d.__metadata._headerId) {
									strPaymentHeaderIde = data.d.__metadata._headerId;
								}
							}
							// TODO : To be verified if needs to be handled in view
							/*
							 * if (data && data.d && data.d.receivableEntry &&
							 * data.d.receivableEntry.receivableHeaderInfo) { //
							 * updatePaymentSummaryInfo(data.d.receivableEntry.receivableHeaderInfo);
							 * paintPaymentMoreDetailInfo(data.d.receivableEntry.receivableHeaderInfo);
							 * if
							 * (data.d.receivableEntry.receivableHeaderInfo.fileUploadProgressFlag) {
							 * pollForFileUpload =
							 * (data.d.receivableEntry.receivableHeaderInfo.fileUploadProgressFlag
							 * === 1) } }
							 */
							doViewPaymentHeader();
							if (data.d.receivableEntry.receivableHeaderInfo.hdrModule == strEntityType) {
								var hdrActionState = data.d.receivableEntry.receivableHeaderInfo.hdrActionStatus;
								if (hdrActionState == '1' || hdrActionState == '80') {
									paintPaymentHeaderActionsForView('SUBMIT')
								} else if (hdrActionState == '33'
										|| (data.d.receivableEntry.receivableHeaderInfo.pirMode === 'SI' && hdrActionState == '4')) {
									paintPaymentHeaderActionsForView('CANCELDISABLE')
								} else if (hdrActionState == '82'
										|| (data.d.receivableEntry.receivableHeaderInfo.pirMode === 'SI' && hdrActionState == '13')) {
									paintPaymentHeaderActionsForView('CANCELENABLE')
								} else if (hdrActionState == '0'
										|| hdrActionState == '1'
										// || hdrActionState == '2'
										|| (data.d.receivableEntry.receivableHeaderInfo.pirMode != 'SI' && hdrActionState == '4')
										|| (data.d.receivableEntry.receivableHeaderInfo.pirMode != 'SI' && hdrActionState == '5')
										|| hdrActionState == '86'
										|| hdrActionState == '87'
										|| hdrActionState == '94'
										|| hdrActionState == '95'
										|| hdrActionState == '79'
										|| hdrActionState == '80'
										|| hdrActionState == '73'
										|| (data.d.receivableEntry.receivableHeaderInfo.pirMode == 'SI' && hdrActionState == '9')
										|| (data.d.receivableEntry.receivableHeaderInfo.pirMode == 'SI' && hdrActionState == '10')) {
									paintPaymentHeaderActionsForView('CANCELANDDISCARD');
								} else {
									paintPaymentHeaderActionsForView('CANCELONLY');
								}
							} else {
								paintPaymentHeaderActionsForView('CANCELONLY');
							}
							toggleBreadCrumbs('tab_3');
							if (data.d.receivableEntry.receivableHeaderInfo.hdrActionsMask) {
								var strAuthLevel = data.d.receivableEntry.receivableHeaderInfo.authLevel;
								var strDetailId = data.d.__metadata._detailId;
								var strParentId = data.d.receivableEntry.receivableHeaderInfo.hdrIdentifier
								paintPaymentDetailGroupActions(
										data.d.receivableEntry.receivableHeaderInfo.hdrActionsMask,
										'VIEW', strAuthLevel, strParentId,
										strDetailId, data.d.receivableEntry.receivableHeaderInfo.showPaymentAdvice);
							}
							populatePaymentHeaderVerifyScreen(
									paymentResponseHeaderData,
									paymentResponseHeaderData.d.receivableEntry.receivableHeaderInfo,
									'Y', true);
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
							blockPaymentUI(false);
							doHandleEntryGridLoading(true, true);
						}
					}
				}
			});
		}
	} else {
		doHandleUnknownErrorForBatch();
		blockPaymentUI(false);
	}
}
function repaintPaymentHeaderFields() {
	var strProductCode = strMyProduct;
	var strBankProduct = $('#bankProductHdr').val();
	var strUrl = _mapUrl['loadBatchHeaderFieldsUrl'] + "/" + strProductCode;
	var jsonObj = null;

	if (!isEmpty(strBankProduct))
		strUrl += '/' + strBankProduct;
	strUrl += '.json';
	blockPaymentUI(true);
	arrFields = [];
	jsonObj = generatePaymentHeaderJson();
	if (jsonObj.d.receivableEntry.standardField) {
		arrFields = jsonObj.d.receivableEntry.standardField;
		$.each(arrFields, function(index, cfg) {
					if (cfg.fieldName == 'txnDate') {
						cfg.value = null;
					}
				});

	}
	if (jsonObj.d && jsonObj.d.__metadata && strPaymentInstrumentIde) {
		jsonObj.d.__metadata._headerId = strPaymentHeaderIde;
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
						paintErrors(arrError);
						blockPaymentUI(false);
					}
				},
				success : function(data) {
					if (data != null) {
						paymentResponseHeaderData = data;
						doRemoveStaticText("paymentHeaderEntryStep2");
						paintPaymentHeaderUI(data);
						initatePaymentHeaderValidation();
						blockPaymentUI(false);
						handleEmptyEnrichmentDivs();
					}
				}
			});
}
function repopulateBankProductFieldHeader() {
	var _strMyProduct = strMyProduct;
	var _strCcy = $('#txnCurrencyHdr').val();
	var _strdrCrFlag = 'B';
	var isCrChecked = $('#drCrFlagHdrC').is(':checked');
	var isDrChecked = $('#drCrFlagHdrD').is(':checked');
	var strUrl = 'services/bankproduct/'
	if (isCrChecked && isDrChecked)
		_strdrCrFlag = 'B';
	else if (isCrChecked)
		_strdrCrFlag = 'C';
	else if (isDrChecked)
		_strdrCrFlag = 'D';
	if (!isEmpty(_strMyProduct) && !isEmpty(_strCcy) && !isEmpty(_strdrCrFlag)) {
		strUrl += _strMyProduct + '/' + _strCcy + '/' + _strdrCrFlag + '.json';
		blockPaymentUI(true);
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
					paintErrors(arrError);
					blockPaymentUI(false);
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
								populateSelectFieldValue('bankProductHdr',
										arrData, '');
								blockPaymentUI(false);
								if (arrData.length === 1) {
									repaintPaymentHeaderFields();
									$('#drCrFlagHdrD, #drCrFlagHdrC').attr(
											"checked", false);
									if (_strdrCrFlag === 'B') {
										$('#drCrFlagHdrD, #drCrFlagHdrC').attr(
												"checked", true);
									} else
										populateRadioFieldValue('drCrFlagHdr',
												_strdrCrFlag);
								} else {
									$('#bankProductHdr').removeClass('hidden');
									// $('#bankProductHdrDiv
									// .canRemove').remove();
									// $('#bankProductHdrSpan').hide();
									$('#bankProductHdr')
											.attr('disabled', false);
									handleLayoutBasedScreenRendering('B', data);
								}
							}

						} else if (obj.error) {
							var errObj = [{
								errorMessage : mapLbl['drCrFlagError_'
										+ _strdrCrFlag],
								errorCode : 'ERR'
							}];
							paintErrors(errObj);
							blockPaymentUI(false);
						}
					}

				}
			}
		});
	}
}
function paintPaymentHeaderUI(objData) {
	var data = objData, arrStdFields = [];
	// NOTE : Comment can be removed if need to test with static JSON
	// var data = dummyHeaderJson;
	// paymentResponseHeaderData = dummyHeaderJson;
	if (data && data.d && data.d.receivableEntry) {

		if (data.d.receivableEntry.standardField) {
			arrStdFields = data.d.receivableEntry.standardField;
			paintPaymentHeaderStandardFields(data.d.receivableEntry.standardField);
		}

		if (data.d.receivableEntry.adminFields && strEntityType === '0') {
			// TODO : To be handled
			// paintPaymentAdminHdrFields(data.d.receivableEntry.adminFields);
		}

		if (data.d.receivableEntry.enrichments) {
			paintPaymentHdrEnrichments(data.d.receivableEntry.enrichments);
		}
		if (data.d.receivableEntry.paymentCompanyInfo) {
			var objInfo = data.d.receivableEntry.paymentCompanyInfo;
			var strText = !isEmpty(objInfo.company) ? objInfo.company : '';
			strText += '<br/>'
					+ (!isEmpty(objInfo.companyAddress)
							? objInfo.companyAddress
							: '');
			$('.companyInfoHdr').html(strText);
		}
	}
	if (data && data.d && data.d.receivableEntry && data.d.receivableEntry
			&& data.d.receivableEntry.receivableHeaderInfo) {
		var objInfo = data.d.receivableEntry.receivableHeaderInfo;
		var charGridEntry = data.d.receivableEntry.receivableHeaderInfo.allowGridEntry
				? data.d.receivableEntry.receivableHeaderInfo.allowGridEntry
				: 'N';
		if (strLayoutType === 'TAXLAYOUT' || strLayoutType === 'MIXEDLAYOUT'
				|| strLayoutType === 'ACHIATLAYOUT')
			charGridEntry = 'N';

		toggleGridLayoutEntryOption(charGridEntry);
		if (strLayoutType === 'TAXLAYOUT' || strLayoutType === 'MIXEDLAYOUT'
				|| strLayoutType === 'ACHIATLAYOUT')
			chrAllowGridLayoutEntry = 'N';
			
		if (!isEmpty(objInfo.minPaymentDate)) {
			handleOffsetDays(objInfo.minPaymentDate, 'B')
		}
	}

	if (data && data.d && data.d.receivableEntry) {
		var receivableEntry = data.d.receivableEntry;
		if (receivableEntry.receivableHeaderInfo) {
			if (!isEmpty(receivableEntry.receivableHeaderInfo.hdrCutOffTime)) {
				$('#productCuttOffHdrInfoSpan')
						.html(receivableEntry.receivableHeaderInfo.hdrCutOffTime);
			} else {
				$('#productCuttOffHdrInfoSpan').html('');
			}

			if (!isEmpty(receivableEntry.receivableHeaderInfo.hdrTemplateNoOfExec)) {
				$('#templateNoOfExecHdrSpan')
						.html(receivableEntry.receivableHeaderInfo.hdrTemplateNoOfExec);
			} else {
				$('#templateNoOfExecHdrSpan').html('0');
			}
			$('.hdrMyProductDescriptionTitle')
					.html(receivableEntry.receivableHeaderInfo.hdrMyProductDescription
							|| '');
			if (strPaymentHeaderIde)
				$('.lastUpdateDateTimeText').html("You saved on "
						+ receivableEntry.receivableHeaderInfo.lastUpdateTime || '');
		//	if (strAction === 'ADD' && isEmpty($('#referenceNoHdr').val())) {
		//		$('#referenceNoHdr')
		//				.val(receivableEntry.receivableHeaderInfo.hdrMyProductDescription
		//						|| '');
		//	}

			if (receivableEntry.receivableHeaderInfo.hdrSource) {
				$('.hdrSourceInfoSpan')
						.text(receivableEntry.receivableHeaderInfo.hdrSource || '');
			}

			// FTMNTBANK-1334
			if (strEntryType === 'PAYMENT' || strEntryType === 'SI') {
				handleHoldZeroDollarFlag('B');
				handleHoldUntilFlag('B');
			}

			var chrDebitAccountLevel = receivableEntry.receivableHeaderInfo.accountLevel
					? receivableEntry.receivableHeaderInfo.accountLevel
					: 'B';
			var chrDateLevel = receivableEntry.receivableHeaderInfo.dateLevel
					? receivableEntry.receivableHeaderInfo.dateLevel
					: 'B';
			var chrProductLevel = receivableEntry.receivableHeaderInfo.productLevel
					? receivableEntry.receivableHeaderInfo.productLevel
					: 'B';
			
			handleDebitLevelAtInstrumentFields(chrDebitAccountLevel,
					chrDateLevel, chrProductLevel, 'B');
		}
	}
	if (strEntryType === 'TEMPLATE') {
		var strTemplateType = getTemplateType(arrStdFields);
		if (isEmpty(strPaymentHeaderIde)) {
			handleDefaultLockFieldValues(data, 'B');
		} else {
			if (strTemplateType === '1')
				toggleAccountFieldBehaviour(true, 'B');
			else
				toggleAccountFieldBehaviour(false, 'B');
		}
		doDisableDefaultLockFields('B');
	}
	toggleControlTotalFiledDisabledValue();
	toggleInstrumentInitiationActions();
	handleLayoutBasedScreenRendering('B', data);
	
	if(data && data.d && data.d.__metadata && data.d.__metadata._txnImportEnabled){
		var chrTxnImportAllowed = data.d.__metadata._txnImportEnabled
				? data.d.__metadata._txnImportEnabled : "N";
		toggleImportEntryOption(chrTxnImportAllowed);		
	}
}
function createBatchPaymentUsingTemplate(strId) {
	if (!isEmpty(strId)) {
		var url = _mapUrl['createBatchUsingTemplateUrl'] + "(" + strId
				+ ").json?"+ csrfTokenName + "=" + csrfTokenValue;
		$.ajax({
			type : "POST",
			url : url,
			async : false,
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
						doHandleEmptyScreenErrorForPaymentHeader(data.d.message.errors);
						blockPaymentUI(false);

					} else {

						paymentResponseHeaderData = data;
						// objHeaderSaveResponseData = data;
						if (data && data.d && data.d.receivableEntry
								&& data.d.receivableEntry.receivableHeaderInfo) {
							strIdentifier = data.d.receivableEntry.receivableHeaderInfo.dhddepnumber;
							strPaymentHeaderIde = data.d.receivableEntry.receivableHeaderInfo.hdrIdentifier;
							strMyProduct = data.d.receivableEntry.receivableHeaderInfo.hdrMyProduct;
						}
						$('#orderingPartyDescription')
								.OrderingPartyAutoComplete(strMyProduct, true);
						// $('#orderingPartyDescription_OA').OrderingPartyAutoComplete(strMyProduct,false);
						// $("#drawerDescriptionA").ReceiverAutoComplete(strMyProduct,null,'B',false);
						$("#drawerDescriptionR").ReceiverAutoComplete(
								strMyProduct, null, 'B', true);
						// toggleAddTransactionAction(2);
						paintPaymentHeaderUI(data);
						if (data && data.d && data.d.receivableEntry
								&& data.d.receivableEntry.receivableHeaderInfo) {
							// paintPaymentMoreDetailInfo(data.d.receivableEntry.receivableHeaderInfo);
							// if
							// (data.d.receivableEntry.receivableHeaderInfo.fileUploadProgressFlag)
							// {
							// pollForFileUpload =
							// (data.d.receivableEntry.receivableHeaderInfo.fileUploadProgressFlag
							// === 1)
							// }
						}
						togglerPaymentHederScreen(false);
						populatePaymentHeaderViewOnlySection(
								paymentResponseHeaderData,
								data.d.receivableEntry.receivableHeaderInfo, 'Y',
								'EDIT');

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
						blockPaymentUI(false);
						doHandleEntryGridLoading(false, true);
						handleEmptyEnrichmentDivs();

						if (data && data.d && data.d.receivableEntry
								&& data.d.receivableEntry.receivableHeaderInfo) {
							var strTempType = data.d.receivableEntry.receivableHeaderInfo.templateType;
							if (strTempType === '2' || strTempType === '3') {
								$('#btnAddRow,#btnAddUsing,#btnTxnWizard,#btnImportTxn')
										.unbind('click')
										.addClass('ft-button-primary-disabled');
							}
						}

					}
				}
			}
		});
	} else {
		doHandleUnknownErrorForBatch();
		blockPaymentUI(false);
	}
}

function paintPaymentHeaderStandardFields(data) {
	var arrFields = [];
	var strDisplayMode = null, divId = null, fieldId = null, lblId = null, cfgAccountNo = {};
	var apply = true;
	if (strEntryType && 'TEMPLATE' === strEntryType)
		handleContractRateInTemplate(data);
	if (data) {
		arrFields = data;
		if (arrFields && arrFields.length > 0) {
			$.each(arrFields, function(index, cfg) {
				fieldId = cfg.fieldName;
				if (apply) {
					strDisplayMode = cfg.displayMode;
					divId = fieldId + 'HdrDiv';
					lblId = fieldId + 'HdrLbl';
					if (!isEmpty(strDisplayMode)) {
						handleDisplayMode(strDisplayMode, fieldId, 'B');
					}
					if (fieldId === 'accountNo') {
						cfgAccountNo = cfg;
						// if (strEntryType === 'PAYMENT' || strEntryType ===
						// 'SI')
						// handleAccountNoRefreshLink(cfg);
					}
					handlePaymentHeaderFieldPopulation(cfg);
					/**
					 * If the Payment Product has only one value then,
					 * respectinve field on UI gets hidden and the Respective
					 * Text will be displayed
					 */
					// TODO : To be handled
					if (false && fieldId === 'bankProduct') {
						var arrOfAvalVal = cfg.availableValues;
						if (arrOfAvalVal != null && arrOfAvalVal != ''
								&& arrOfAvalVal.length === 1) {
							$('#bankProductHdr').hide();
							$('#bankProductHdrSpan')
									.text(arrOfAvalVal[0].description);
						} else {
							$('#bankProductHdr').show();
							$('#bankProductHdrSpan').text('');
						}
					} else if (cfg.fieldName === 'templateType') {
						var arrOfAvalVal = cfg.availableValues;
						if (arrOfAvalVal && arrOfAvalVal.length > 0) {
							$.each(arrOfAvalVal, function(idx, opt) {
										if (opt.code === '1') {
											$('#divNonRepetativeHdr')
													.removeClass('hidden');
										} else if (opt.code === '2') {
											$('#divRepetativeHdr')
													.removeClass('hidden');
										} else if (opt.code === '3') {
											$('#divSemiRepetativeHdr')
													.removeClass('hidden');
										}
									});
						}
					} else if (cfg.fieldName === 'paymentSaveWithSI'
							&& cfg.value && cfg.value === 'Y') {
						toggleRecurringPaymentParameterHdrFieldsSectionVisibility();
					} else if (cfg.fieldName === 'drCrFlag') {
						handleDrCrFlagPaymentHeader(cfg);
					} else if (cfg.fieldName === 'amount'
							&& !isEmpty(strEntryType)
							&& strEntryType === 'PAYMENT'
							&& $('#controlTotalHdrDiv').hasClass('hidden')) {
						$('#amountHdrLbl').addClass('noLeftPadding');
					}

				}
			});

			if (strEntryType === 'PAYMENT' || strEntryType === 'SI') {
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
				populateSIProcessing('B', Freq, gstrPeriod, gstrRef);
				toggleRecurringPaymentParameterHdrFieldsSectionVisibility();
			} else if (strEntryType === 'TEMPLATE') {
				var strTemplateType = getTemplateType(arrFields);
				if (strTemplateType === '1')
					toggleAccountFieldBehaviour(true, 'B');
				else
					toggleAccountFieldBehaviour(false, 'B');
				handlePaymentHeaderFieldPopulation(cfgAccountNo);
				applyControlFieldsValidation(strPaymentType);
			}
			// FTMNTBANK-841 handleCompanyIdChange(true);
		}
	}
	handleForexForPaymentHeader();
}
function getTemplateType(arrStdFields) {
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
function paintPaymentHdrEnrichments(data) {
	var isVisible = false, clsHide = 'hidden', intCounter = 1, strTargetId = 'paymentHdrUdeEnrichDiv';
	$('#paymentHdrUdeEnrichDiv').empty();
	if (data.udeEnrichment && data.udeEnrichment.parameters) {
		intCounter = paintPaymentHeaderEnrichmentsHelper(
				data.udeEnrichment.parameters, intCounter, strTargetId, 'B');
		isVisible = true;
	}
	if (isVisible) {
		if (intCounter >= 2)
			$('<div>').attr('class', 'clear')
					.appendTo($('#paymentHdrUdeEnrichDiv'));
		$('#paymentHdrUdeEnrichDiv').removeClass(clsHide);
	}
}

function paintPaymentHeaderEnrichmentsHelper(arrPrdEnr, intCounter,
		strTargetId, strPmtType) {
	var field = null, targetDiv = $('#' + strTargetId), label = null, span = null, div = null, innerDiv = null, intCnt = 1, sortArrPrdEnr, minCounter, maxCounter, arrLength;
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
					div = $('<div>').attr({
								'class' : 'col-sm-6 ',
								'id' : enrField.code + 'Div'
							});
					innerDiv = $('<div>').attr({
								'class' : 'form-group ',
								'id' : enrField.code + '_InnerDiv'
							});
					label = $('<label>').attr('class', '');
					label.text(enrField.description);
					field = createEnrichMentField(enrField);
					if (enrField.enableDisable != null) {
						if (enrField.enableDisable == 'disable') {
							field.attr('disabled', true);
						} else if (enrField.enableDisable == 'enable') {
							field.attr('disabled', false);
						}
					}
					if (field) {
						field.attr('class', 'form-control');
						field.attr('id', 'enrude_' + enrField.code);
						label.attr('for', enrField.code);
						if (enrField.mandatory == true)
							label.addClass('required');
						// span.appendTo(div);
						label.appendTo(innerDiv);
						if (enrField.enrichmentType === 'S'
								&& !isEmpty(enrField.apiName))
							handleHeaderPageRefreshOnSingleSetEnrichmentChange(
									field, enrField);
						field.appendTo(innerDiv);
						innerDiv.appendTo(div)
						div.appendTo(targetDiv);
						/*
						 * if (intCnt % 2 == 0) {
						 * 
						 * div.addClass('col_2_2'); $('<div>').attr('class',
						 * 'clear') .appendTo(targetDiv); } else
						 * div.addClass('col_1_2');
						 */
						intCnt++;
					}
				}
			} else {
				div = $('<div>').attr({
							'class' : 'col-sm-6 emptyEnrichDiv'
						});
				div.appendTo(targetDiv);/*
										 * if (intCnt % 2 == 0) {
										 * div.addClass('col_2_2'); $('<div>').attr('class',
										 * 'clear').appendTo(targetDiv); } else
										 * div.addClass('col_1_2');
										 */
				intCnt++;
			}
		}
	}
	return intCnt;
}
function handleHeaderPageRefreshOnSingleSetEnrichmentChange(field, cfg) {
	var displayType = cfg.displayType;
	var strApiName = cfg.apiName;
	var strEventName = '';

	if (isEmpty(displayType))
		displayType = 0;
	if (!isEmpty(strApiName)) {
		strEventName = getEnrichFieldEventName(displayType);
		if (!isEmpty(strEventName))
			field.on(strEventName, function() {
						refreshBatchFieldsOnEnrichChange($(this));
					});
	}

}

function refreshBatchFieldsOnEnrichChange(obj) {
	if (!isEmpty(obj)) {
		var enrichId = obj.attr('name');
		var enrichValue = obj.attr('value');
		var url = 'services/refreshEnrichment';
		url += '/' + enrichId;
		url += '/' + enrichValue + '.json';
		var jsonObj = generatePaymentHeaderJson();// generatePaymentInstrumentJson();
		if (jsonObj.d && jsonObj.d.__metadata && strPaymentInstrumentIde) {
			jsonObj.d.__metadata._headerId = strPaymentHeaderIde;
			jsonObj.d.__metadata._detailId = strPaymentInstrumentIde;
		}
		jsonObj.d.__metadata._pirMode = strEntryType;
		blockPaymentUI(true);
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
					paintErrors(arrError);
					blockPaymentUI(false);
				}
			},
			success : function(data) {
				if (data.d
						&& data.d.message
						&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
					paintErrors(data.d.message.errors);
					blockPaymentUI(false);

				} else if (data != null) {
					if (data.d
							&& data.d.message
							&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
						paintErrors(data.d.message.errors);
						blockPaymentUI(false);
					} else {
						paymentResponseHeaderData = data;
						doRemoveStaticText("paymentHeaderEntryStep2");
						paintPaymentHeaderUI(data);
						blockPaymentUI(false);
						handleEmptyEnrichmentDivs();
					}
				}
			}
		});
	}
}
/**
 * The generic function handleHdrFieldPopulation used to handle the field value
 * population and editable/non-editable of the UI field based on the response
 * JSON.
 * 
 * @param {JSON}
 *            cfg The JSON node from response
 * 
 * @param {String}
 *            fieldId The JSON node name of the field. Should be same on UI,
 *            only string postfix will appended based on single/multiple payment
 * 
 * 
 * @example
 * The field syantax on UI should be as 
 * 		<div id="companyIdHdrDiv" class="col_1_2 hidden extrapadding_bottom">
 *				<label class="frmLabel" id="companyIdHdrLbl" for="companyIdHdr"> <spring:message code="lbl.pir.companyid" text="Company Id" /></label><br/>
 *				<select name="companyIdHdr" id="companyIdHdr" class="rounded w14 ml12">
 *					<option value="">
 *						<spring:message code="lbl.payments.selectcompany"	text="Select Company" />
 *					</option>
 *				</select>
 *		</div>
 * 
 * The field details in JSON response :
 * 	{
 *		fieldName: "companyId",
 *		label: "Company Id",
 *		displayMode: "3",
 *		readOnly: "true",
 *		availableValues: [
 * 							{
 *								code: "PAY0001",
 *								description: "PAY0001 - PAY"
 *							},
 *							{
 * 								code: "PAY0002",
 *								description: "PAY0002 - PAY"
 *							}
 *						],
 *		dataType: "select"
 *	}
 * 
 * The logic is as below :
 * If readOnly is true/false in response JSON and dataType is 'select' or 'checkBox' or 'radio' then the field's disabled attribute will set to true/false
 * If readOnly is true/false in response JSON and dataType is 'text' or 'mask' or 'multiselect' or 'seek' or 'date' or 'amount' then the field's readonly attribute will set to true/false
 * 
 */
function handlePaymentHeaderFieldPopulation(cfg) {
	var dataType = cfg.dataType, defValue = cfg.value, fieldId = cfg.fieldName, blnReadOnly = cfg.readOnly;
	fieldId += 'Hdr';
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
				if (fieldId === 'lockFieldsMaskHdr')
					populateLockFieldValue(fieldId, cfg.availableValues,
							defValue);
				else
					populateSelectFieldValue(fieldId, cfg.availableValues,
							defValue);
				/*
				 * if (!isEmpty(strEntryType) && strEntryType === 'TEMPLATE' &&
				 * fieldId === 'accountNoHdr') { }
				 */
				break;
			case 'multiselect' :
				if (!isEmpty(strEntryType)
						&& strEntryType === 'TEMPLATE'
						&& (fieldId === 'accountNoHdr'
								|| fieldId === 'templateRolesHdr' || fieldId === 'templateUsersHdr')) {
					populateMultiSelectFieldValue(fieldId, cfg.availableValues,
							cfg.values);
					if (fieldId === 'templateUsersHdr')
						arrTemplateUsersHdr = cfg.values || [];
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
						defValue, cfg.txnCurrency, 'txnCurrencyHdr');
				// NOTE : txnCurrency node to be used from standarField instead
				// of amount.txnCurrency node
				if (false) {
					if (cfg.availableValues) {
							handleDisplayMode('3', 'txnCurrency', 'B');
					} else
						handleDisplayMode('1', 'txnCurrency', 'B');
				}
				break;
			case 'radio' :
				populateRadioFieldValue(fieldId, defValue);
				if (fieldId === 'drCrFlagHdr') {
					// toggleHdrAccountLabel(null, defValue);
					if ((defValue === 'C' || defValue === 'D')) {
						// $('#drCrFlagHdrDiv').addClass('hidden');
						// $('#drCrFlagD, #drCrFlagC').attr('disabled', true);
					} else if (defValue === 'B') {
						$('#drCrFlagHdrC, #drCrFlagHdrD').attr("checked", true);
					}
					$('#drCrFlagHdrC, #drCrFlagHdrD').attr("disabled",
							isReadonly);
				} else if (fieldId === 'templateTypeHdr') {
					$('input:radio[name="templateTypeHdr"]').attr('disabled',
							isReadonly);
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
				break;
		}
	}

	if (field && field.length != 0 && !isEmpty(blnReadOnly)
			&& blnReadOnly == 'true') {
		if (dataType === 'select' && !isEmpty(defValue))
			field.attr('disabled', 'disabled');
		else
			field.attr('readonly', isReadonly);
	}

}

function savePaymentHeader(jsonData, fnCallback, args) {
	var strUrl = _mapUrl['saveBatchHeaderUrl'];
	// console.log(JSON.stringify(jsonData));
	blockPaymentUI(true);
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
						paintErrors(arrError);
						blockPaymentUI(false);
						autoFocusFirstElement();
					}
				},
				success : function(data) {
					paymentResponseHeaderData = data;
					fnCallback(data, args);
					autoFocusFirstElement();
				}
			});
}

function doSavePaymentHeader(blnPrdCutOff) {
	var jsonData = generatePaymentHeaderJson(), jsonArgs = {};
	var canSave = validateRequiredPaymentHeaderFields();
	jsonArgs.action = 'SAVE';
	if (!isEmpty(blnPrdCutOff) && blnPrdCutOff === true) {
		jsonData.d.receivableEntry.standardField.push({
					fieldName : 'prdCutoffFlag',
					value : 'Y'
				});
	}
	savePaymentHeader(jsonData, postHandleSavePaymentHeader, jsonArgs);

}
function doUpdatePaymentHeader(blnPrdCutOff) {
	var jsonData = generatePaymentHeaderJson(), jsonArgs = {};
	var canSave = validateRequiredPaymentHeaderFields();
	jsonData.d.__metadata._headerId = strPaymentHeaderIde;
	if (blnPrdCutOff === true) {
		jsonData.d.receivableEntry.standardField.push({
					fieldName : 'prdCutoffFlag',
					value : 'Y'
				});
	}
	jsonArgs.action = 'UPDATE';
	savePaymentHeader(jsonData, postHandleSavePaymentHeader, jsonArgs);
}
function doSubmitPaymentHeader() {
	var strUrl = _mapUrl['submitBatchUrl'];
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
				var arrError = new Array();
				arrError.push({
							"errorCode" : "Message",
							"errorMessage" : mapLbl['unknownErr']
						});
				paintErrors(arrError);
				blockPaymentUI(false);
			}
		},
		success : function(data) {
			if (data && data.d && data.d.instrumentActions) {
				var arrResult = data.d.instrumentActions;
				if (arrResult && arrResult.length == 1) {
					if (arrResult[0].success === 'Y') {
						blockPaymentUI(false);
						var result = arrResult[0];
						if (result.updatedStatusCode === '7'
								&& strPayProductCategoryType === 'R') {
							var pirsFound = processRealTimePirs(data, '',
									'batchEntrysubmit');
							if (!pirsFound)
								goToPage(_mapUrl['cancelBatchUrl'], 'frmMain');
						} else {
							goToPage(_mapUrl['cancelBatchUrl'], 'frmMain');
						}
					} else if (arrResult[0].success === 'N') {
						if (arrResult[0].errors) {
								doClearMessageSection();
								blockPaymentUI(false);
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
								var strIsRollover = 'N', strIsDiscard = 'N', strTitle = mapLbl['warnMsg'], args = {};;
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
								args.action = 'submit';
								args.isRollover = strIsRollover;
								args.isReject = 'N';
								args.isDiscard = strIsDiscard;
								showreceivableEntryCutoffAlert(
										180,
										300,
										strTitle,
										strMsg,
										postHandlePaymentHeaderActionsProductCutOff,
										args);
							} else {
								doClearMessageSection();
								// paintErrors(arrError);
								paintErrors(arrResult[0].errors);
								blockPaymentUI(false);
							}
							}
					} else if (arrResult[0].success === 'W02') {
						doClearMessageSection();
						var arrError = new Array();
						arrError.push({
							"errorCode" : "",
							"errorMessage" : 'Payment submitted. Warning limit exceeded!'
						});
						paintErrors(arrError);
						blockPaymentUI(false);
					}
				}
			}
		}
	});

}
function doUpdateAndNextPaymentHeader(blnPrdCutOff) {
	var blnStatusFlag = false, blnControlTotal = false, arrError, jsonData, canSave, isTotalNo = false, isTotalAmount = false;
	var isEnteredNo = false;
	if (strPaymentHeaderIde && strPaymentHeaderIde != '') {
	    var strUrl = 'services/receivableheaderinfo/id.json';
	    var jsonData = {'id' : strPaymentHeaderIde};
		$.ajax({
			url : strUrl,
			type : 'POST',
			data : jsonData,
			async : false,
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
			success : function(data) {
				var objResponseData = data;
				if (!isEmpty(objResponseData)) {
					var strActionStatusVal = objResponseData.d.receivableHeaderInfo.hdrActionStatus;
					if (objResponseData.d.receivableHeaderInfo.hdrControlTotal == 'N') {
						blnControlTotal = false;
						if (objResponseData.d.receivableHeaderInfo.hdrEnteredNo === '0')
						{
							isEnteredNo = true;
							blnControlTotal = true;
						}
					}
					if (!isEmpty(strActionStatusVal)
							&& strActionStatusVal === '9') {
						blnStatusFlag = true;
					} else if (objResponseData.d.receivableHeaderInfo.hdrControlTotal == 'Y') {
						if (objResponseData.d.receivableHeaderInfo.hdrEnteredNo != objResponseData.d.receivableHeaderInfo.hdrTotalNo
								&& objResponseData.d.receivableHeaderInfo.hdrTotalNo != '0') {
							isTotalNo = true;
							blnControlTotal = true;
						} else if (objResponseData.d.receivableHeaderInfo.hdrEnteredAmount != objResponseData.d.receivableHeaderInfo.totalAmount
								&& objResponseData.d.receivableHeaderInfo.totalAmount != '0') {
							isTotalAmount = true;
							blnControlTotal = true;
						}
					}
					// TODO: && blnControlTotal != true : condition removed from
					// following if
					if (blnStatusFlag !== true && blnControlTotal !== true) {
						jsonData = generatePaymentHeaderJson(), jsonArgs = {};
						canSave = validateRequiredPaymentHeaderFields();
						jsonData.d.__metadata._headerId = strPaymentHeaderIde;
						if (blnPrdCutOff === true) {
							jsonData.d.receivableEntry.standardField.push({
										fieldName : 'prdCutoffFlag',
										value : 'Y'
									});
						}
						jsonData.d.receivableEntry.standardField.push({
							fieldName : 'jsonArgsAction',
							value : 'UPDATEANDNEXT'
						});
						jsonArgs.action = 'UPDATEANDNEXT';
						savePaymentHeader(jsonData,
								postHandleSavePaymentHeader, jsonArgs);
					} else if (blnStatusFlag == true) {

						if (objResponseData
								&& objResponseData.d
								&& objResponseData.d.receivableHeaderInfo.pirMode == 'LP'
								&& !isEmpty(objResponseData.d.receivableHeaderInfo.hdrTemplateName)
								&& objResponseData.d.message
								&& objResponseData.d.message.errors) {
							var arrError = data.d.message.errors;
							if (arrError && arrError.length > 0) {
								$.each(arrError, function(index, error) {
									// if(error.errorCode == 'T96'){
									arrError = new Array();
									arrError.push({
												"errorCode" : error.errorCode,
												"errorMessage" : error.errorMessage
											});
									paintErrors(arrError);
										// }
								});
							}
						} else {
							arrError = new Array();
							arrError.push({
										"errorCode" : "P22", // Modified
										// error code to
										// show validate
										// button.
										"errorMessage" : mapLbl['statusErrorMsg']
									});
							paintErrors(arrError);
						}

					} else if (blnControlTotal == true) {
						if (isTotalNo) {
						arrError = new Array();
							arrError.push({
										"errorCode" : "P22", // Modified
										// error code to
										// show validate
										// button.
										"errorMessage" : mapLbl['controlTotalNotMatchMsg']
									});
							paintErrors(arrError);
						} else if (isTotalAmount) {
						arrError = new Array();
							arrError.push({
										"errorCode" : "P22", // Modified
										// error code to
										// show validate
										// button.
										"errorMessage" : mapLbl['controlTotalAmtNotMatchMsg']
									});
							paintErrors(arrError);							
						}
						 else if (isEnteredNo) {
								arrError = new Array();
									arrError.push({
												"errorCode" : "P21", 
												"errorMessage" : mapLbl['instrumentsNotEnteredMsg']
											});
									paintErrors(arrError);							
								}
					}
					blockPaymentUI(false);
				} else if (isEmpty(objResponseData)
						&& objResponseData.d.receivableEntry.message.errors) {
					doClearMessageSection();
					paintErrors(objResponseData.d.receivableEntry.message.errors);
					blockPaymentUI(false);
				}
			}
		});
	}

}
function postHandleSavePaymentHeader(data, args) {
	var status = null;
	var action = args.action;
	if (data && data.d) {
		if (data.d.receivableEntry && data.d.receivableEntry.message
				&& data.d.receivableEntry.message.success) {
			status = data.d.receivableEntry.message.success;
			status = status.toUpperCase();
		}
		if (!isEmpty(status) && status === 'SUCCESS'
				|| status === 'SAVEWITHERROR') {
			// TODO: To be handled
			/*
			 * if (status != 'SAVEWITHERROR') { doDisablePostUpdateFields(); }
			 */
			if (status === 'SUCCESS'
					&& (action === 'SAVE' || action === 'UPDATE')) {
				arrFields = data.d.receivableEntry.standardField;
				// TODO: To be handled
				/*
				 * var filter = { 'txnDate' : { 'displayMode' : '3', 'dataType' :
				 * 'date' } }; paintPaymentHdrStandardFields(arrFields, filter);
				 */
				doClearMessageSection();

			}
			if (status === 'SAVEWITHERROR') {
				if (data.d.receivableEntry.message.errors)
					paintErrors(data.d.receivableEntry.message.errors);
			}
			if (!isEmpty(data.d.receivableEntry.message.depNo)) {
				var msgDtls = {
					'depNo' : data.d.receivableEntry.message.depNo,
					'uniqueRef' : data.d.receivableEntry.message.uniqueRef,
					'txnReference' : data.d.receivableEntry.message.uniqueRef
				};
				paintHeaderSuccessMsg(msgDtls, 'B', data);
				strIdentifier = data.d.receivableEntry.message.depNo;
			}
			if (data.d.receivableEntry && data.d.__metadata
					&& data.d.__metadata._headerId)
				strPaymentHeaderIde = data.d.__metadata._headerId;
			doHandlePaymentProrductToggle(data);
			paintPaymentHeaderActions('EDIT');
			togglerPaymentHederScreen(false);
			populatePaymentHeaderViewOnlySection(paymentResponseHeaderData,
					data.d.receivableEntry.receivableHeaderInfo, 'Y', 'EDIT');
			if (action === 'UPDATE') {
				if (objInstrumentEntryGrid) {
					objInstrumentEntryGrid.removeAll(true);
					objInstrumentEntryGrid.destroy(true);
					objInstrumentEntryGrid = null;
				}
				if (filterView) {
					filterView.destroy();
				}
				blockPaymentUI(false);
				doHandleEntryGridLoading(false, true);
			} else if (action !== 'UPDATEANDNEXT') {
				blockPaymentUI(false);
				doHandleEntryGridLoading(false, true);
			}
			if (action === 'UPDATEANDNEXT' && status !== 'SAVEWITHERROR') {
				doPostHandleUpdateAndNextPaymentHeader();
				blockPaymentUI(false);
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
										&& (errCode.toUpperCase()
												.indexOf("WARN") >= 0)
										|| errCode === 'GD0002') {
									isProductCutOff = true;
								}
							});
				}
				if (isProductCutOff) {
					doClearMessageSection();
					var strTitle = mapLbl['warnMsg'];
					blockPaymentUI(false);
					showAlert(160, 350, strTitle, strMsg,
							postHandlePaymentHeaderProductCutOff, args);
				} else {
					paintErrors(data.d.receivableEntry.message.errors);
					blockPaymentUI(false);
				}
			}
		} else if (isEmpty(status) && data.d.receivableEntry.message.errors) {
			doClearMessageSection();
			paintErrors(data.d.receivableEntry.message.errors);
			blockPaymentUI(false);
		}
	}
}
function doPostHandleUpdateAndNextPaymentHeader() {
	doClearMessageSection();
	$('#txnStep1,#txnStep2').removeClass('ft-status-bar-li-active')
			.addClass('ft-status-bar-li-done');
	$('#txnStep3').addClass('ft-status-bar-li-active');
	$('#paymentInstrumentInitActionDiv, #paymentHeaderEntryStep2, #messageContentDiv, #paymentHeaderEntryExtraFieldsDiv')
			.addClass('hidden');
	$('#verificationStepDiv').removeClass('hidden');
	paintPaymentHeaderActions('SUBMIT');
	populatePaymentHeaderVerifyScreen(paymentResponseHeaderData,
			paymentResponseHeaderData.d.receivableEntry.receivableHeaderInfo, 'Y',
			false);
}

function populatePaymentHeaderViewOnlySection(data, objHdrInfo, charBatch,
		strMode) {
	var arrStdFields = data && data.d && data.d.receivableEntry
			&& data.d.receivableEntry.standardField
			? data.d.receivableEntry.standardField
			: null;
	var strFieldName = null, strValue = null, strPostFix = charBatch === 'Y'
			? 'HdrInfoSpan'
			: 'InfoSpan', arrFields = null;
	var strHdrEnteredNo = '', strHdrEnteredAmount = '', strHdrTotalNo = '', strTotalAmount = '', strLastUpdatedTime = '', strBatchStatus = '', ctrl = null, blnIsMultiCcy = false;
	var strRateType = $('#rateTypeHdr').val();
	if (arrStdFields) {
		$.each(arrStdFields, function(index, cfg) {
					strFieldName = cfg.fieldName;
					strValue = getValueToDispayed(cfg);
					strValue = !isEmpty(strValue) ? strValue : '';
					ctrl = $('#' + cfg.fieldName + strPostFix);
					ctrlDiv = $('.' + cfg.fieldName + strPostFix + 'Div');
					if (ctrl) {
						if (ctrlDiv.hasClass('hidden'))
							ctrlDiv.removeClass('hidden');
						if (ctrl.hasClass('hidden'))
							ctrl.removeClass('hidden');
						// if (jQuery.inArray(cfg.fieldName, arrFields) !== -1)
						// {
						if (strFieldName === 'accountNo'
								|| strFieldName === 'templateUsers'
								|| strFieldName === 'templateRoles') {
							if (cfg.values && cfg.values.length > 1) {
								strValue = strValue.replace(/,/g, '<br/>');
								ctrl.html(cfg.values.length + '&nbsp;Selected');
								$('#' + cfg.fieldName + strPostFix).each(
										function(i, obj) {
											$(this).addClass('t7-anchor');
											showToolTip($(this), strValue);
										});
							} else {
								$('#' + cfg.fieldName + strPostFix).each(
										function(i, obj) {
											$(this).removeClass('t7-anchor');
											destroyToolTip($(this));
										});
								ctrl.html(splitAccountSting(strValue));
							}
							if (strEntryType === 'PAYMENT'
									|| strEntryType === 'SI')
								handleAccountNoRefreshLink(cfg);
						} else if (strFieldName === 'lockFieldsMask') {
							var arrDispVal = strValue.split(',');
							if (arrDispVal && arrDispVal.length > 1) {
								strValue = strValue.replace(/,/g, '<br/>');
								ctrl.html(arrDispVal.length + '&nbsp;Selected');

								$('.' + cfg.fieldName + strPostFix).each(
										function(i, obj) {
											$(this).addClass('t7-anchor');
											showToolTip($(this), strValue);
										});
							} else {
								$('.' + cfg.fieldName + strPostFix).each(
										function(i, obj) {
											$(this).removeClass('t7-anchor');
											destroyToolTip($(this));
										});

								ctrl.html(strValue);
							}

						} else if (strFieldName === 'rateType'
								|| strFieldName === 'contractRefNo') {
							if (getCurrencyMissMatchValueForHeaderViewOnly()) {
								if (strFieldName === 'rateType') {
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
								$(".rateType" + strPostFix + 'Div')
										.addClass('hidden');
								$(".contractRefNo" + strPostFix + 'Div')
										.addClass('hidden');
							}
						}/*
							 * else if (strFieldName === 'rateType') { if
							 * (getCurrencyMissMatchValueForHeaderViewOnly()) {
							 * $(".rateType" + strPostFix+'Div')
							 * .removeClass('hidden'); ctrl.html(strValue); if
							 * (cfg.value && "1" === cfg.value)
							 * $(".contractRefNo" + strPostFix+'Div')
							 * .removeClass('hidden'); } }
							 */else if (strFieldName === 'paymentSaveWithSI') {
							if (strValue === 'Y')
								ctrl.removeClass('hidden');
							else
								ctrl.addClass('hidden');
						} else if (strFieldName === 'txnDate') {
							$(".txnDateInfoDiv").removeClass('hidden');
							ctrl.html(strValue || '');
						} else if (strFieldName === 'controlTotal') {
							if (strValue && strValue === 'Y')
								$(".controlTotalHdrInfoDiv")
										.removeClass('hidden');
							else
								$(".controlTotalHdrInfoDiv").addClass('hidden');
						}else if (strFieldName === 'totalOpenAmount'
								|| strFieldName === 'totalAmount'
								|| strFieldName === 'totalReturnAmount'
								|| strFieldName === 'totalPaidAmount') {
								
								var strFormattedValue = '';
									strFormattedValue = cfg.formattedValue
										? cfg.formattedValue
										: cfg.value;
										ctrl.html(strFormattedValue);
								
						}else
							ctrl.html(strValue);
					}
				});
	}

	if (strEntryType === 'PAYMENT' || strEntryType === 'SI') {
		var Freq = null, gstrPeriod = null, gstrRef = null;
		if (arrStdFields) {
			var stdFieldData = arrStdFields;
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
		populateSIProcessingViewOnlyFields('B', Freq, gstrPeriod, gstrRef,
				strPostFix);
		toggleRecurringPaymentParameterHdrFieldsViewOnlySectionVisibility();
	}
	if (objHdrInfo) {
		strHdrEnteredNo = objHdrInfo.hdrEnteredNo;
		strHdrEnteredAmount = objHdrInfo.hdrEnteredAmountFormatted;
		strHdrTotalNo = objHdrInfo.hdrTotalNo;
		if (jQuery.isNumeric(strHdrTotalNo)
				&& jQuery.isNumeric(strHdrEnteredNo)
				&& (strHdrTotalNo - strHdrEnteredNo >= 0))
			strHdrTotalNo = strHdrTotalNo - strHdrEnteredNo;
		strTotalAmount = objHdrInfo.balanceAmountFormatted;
		strLastUpdatedTime = objHdrInfo.lastUpdateTime;
		strBatchStatus = objHdrInfo.hdrStatus;
		blnIsMultiCcy = objHdrInfo.isMultiCcyTxn;
	}
	if (blnIsMultiCcy) {
		$('.hdrMultiCcyEditIconSpan').remove();
		var objMultiCcyIcon = $('<span>').attr('class',
				'iconlink grdlnk-notify-icon icon-gln-fcy hdrMultiCcyEditIconSpan');
		$(objMultiCcyIcon)
				.insertBefore($("#hdrEnteredAmountFormattedHdrInfoSpan, #balanceAmountFormattedHdrInfoSpan"));
	} else
		$('.hdrMultiCcyEditIconSpan').remove();
	$('#hdrEnteredAmountFormattedHdrInfoSpan').html(strHdrEnteredAmount);
	$('#balanceAmountFormattedHdrInfoSpan').html(strTotalAmount);
	$('#enteredInstCountHdrInfoSpan').html(strHdrEnteredNo);
	$('#totalInstCountHdrInfoSpan').html(strHdrTotalNo);
	$('#productCuttOff' + strPostFix).html(objHdrInfo.hdrCutOffTime || '');
	if (strPaymentHeaderIde) {
		$('.lastUpdateDateTimeText').html("You saved on " + strLastUpdatedTime
				|| '');
		if (strEntryType === 'RECEIVABLE')
			$('.batchStatusText')
					.html("Batch Status : " + strBatchStatus || ''); 
		//$('.siStatus' + strPostFix).text(strBatchStatus || '');
	}
	if (data && data.d && data.d.receivableEntry
			&& data.d.receivableEntry.receivableHeaderInfo
			&& data.d.receivableEntry.receivableHeaderInfo.hdrDrCrFlag) {
		var drCrFlag = data.d.receivableEntry.receivableHeaderInfo.hdrDrCrFlag;
		if (strLayoutType === 'ACCTRFLAYOUT') {
			toggleAccountTransferHeaderAccountLabel(drCrFlag);
			$('.batchHeaderSectionLbl').text(drCrFlag === 'D'
					? 'Receiver Details'
					: 'Sender Details');
		}
	}
	if (data && data.d && data.d.receivableEntry
			&& data.d.receivableEntry.paymentCompanyInfo) {
		var objInfo = data.d.receivableEntry.paymentCompanyInfo;
		var strText = !isEmpty(objInfo.company) ? objInfo.company : '';
		strText += '<br/>'
				+ (!isEmpty(objInfo.companyAddress)
						? objInfo.companyAddress
						: '');
		$('.companyInfoHdr').html(strText);
	}

	if (data && data.d && data.d.receivableEntry
			&& data.d.receivableEntry.enrichments) {
		paintPaymentHdrViewOnlyEnrichments(data.d.receivableEntry.enrichments);
	}
	
	toggleContainerVisibility('paymentHeaderEntryStep2');
	toggleContainerVisibility('paymentHeaderEntryExtraFieldsDiv');
}

function paintPaymentHdrViewOnlyEnrichments(data, isViewOnly) {
	var isVisible = false, clsHide = 'hidden', intCounter = 1, strTargetId = 'paymentHdrUdeEnrichInfoDiv';
	$('.' + strTargetId).empty();
	if (data.udeEnrichment && data.udeEnrichment.parameters) {
		intCounter = paintPaymentHeaderViewOnlyEnrichmentsHelper(
				data.udeEnrichment.parameters, intCounter, strTargetId, 'B');
		isVisible = true;
	}
	if (isVisible) {
		$('.' + strTargetId).removeClass(clsHide);
		$('.paymentHdrUdeEnrichView').removeClass(clsHide);
	}
}

function paintPaymentHeaderViewOnlyEnrichmentsHelper(arrPrdEnr, intCounter,
		strTargetId, strPmtType) {
	var field = null, targetDiv = $('.' + strTargetId), label = null, div = null, formGroup = null, intCnt = 1, sortArrPrdEnr, minCounter, maxCounter, arrLength;
	var row = $('<div>').attr({
				'class' : 'row'
			});
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
					formGroup = $('<div>').attr({
								'class' : 'form-group'
							});
					div = $('<div>').attr({
								'class' : 'col-sm-4',
								'id' : enrField.code + 'Div'
							});
					label = $('<label>').attr('class', '')
					label.text(enrField.description + ': ').append("&nbsp;");
					field = $('<div>').attr({
								'id' : 'enrUdeInfo_' + enrField.code,
								'style' : 'height:20px;'
							});
					if (enrField.value)
						$(field).text(getEnrichValueToDispayed(enrField));
					label.attr('for', enrField.code);
					label.appendTo(formGroup);
					field.appendTo(formGroup);
					formGroup.appendTo(div);
					div.appendTo(targetDiv);
					intCnt++;
				}
			} else {
				/*
				 * div = $('<div>').attr({ 'class' : 'col-sm-12' });
				 * div.appendTo(targetDiv);
				 */
				intCnt++;
			}
		}

		/*
		 * var children = $("#" + strTargetId + " .col-sm-4"); if (children &&
		 * children.length > 3) { var row = $('<div>').attr({ 'class' : 'row'
		 * }); $.each(children, function(index, cfg) { if (index % 3 === 0) {
		 * row.appendTo(targetDiv); row = $('<div>').attr({ 'class' : 'row' }); }
		 * cfg.appendTo(row); }); }
		 */
	}
	return intCnt;
}
function populatePaymentHeaderVerifyScreen(data, objHdrInfo, charBatch,
		isEnableGridAction) {
	var arrStdFields = data && data.d && data.d.receivableEntry
			&& data.d.receivableEntry.standardField
			? data.d.receivableEntry.standardField
			: null;
	var strFieldName = null, strValue = null, strPostFix = charBatch === 'Y'
			? '_HdrInfo'
			: '_InfoSpan', ctrl = null, ctrlDiv = null, isExtraInfoAvailable = false;
	var strHdrEnteredNo = '', strHdrEnteredAmount = '', strHdrTotalNo = '', strTotalAmount = '', blnIsMultiCcy = false;
	var strRateType = $('#rateTypeHdr').val();
	if (arrStdFields) {
		$.each(arrStdFields, function(index, cfg) {
			strFieldName = cfg.fieldName;
			strValue = getValueToDispayed(cfg);
			strValue = !isEmpty(strValue) ? strValue : '';
			ctrl = $('.' + strFieldName + strPostFix);
			ctrlDiv = $('.' + strFieldName + strPostFix + 'Div');
			if (ctrl && ctrlDiv && ctrlDiv.hasClass('hidden'))
				ctrlDiv.removeClass('hidden');
			if (strFieldName === 'prenote'
					|| strFieldName === 'confidentialFlag'
					|| strFieldName === 'hold') {
				if (strValue === 'Y')
					ctrl.removeClass('hidden');
				else
					ctrl.addClass('hidden');

			} else if (strFieldName === 'accountNo'
					|| strFieldName === 'templateUsers'
					|| strFieldName === 'templateRoles') {
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
				if (strEntryType === 'PAYMENT' || strEntryType === 'SI')
					handleAccountNoRefreshLink(cfg);
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

			} else if (strFieldName === 'rateType'
					|| strFieldName === 'contractRefNo') {
				if (getCurrencyMissMatchValueForHeaderViewOnly()) {
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
			} else if (strEntryType && strEntryType === 'PAYMENT'
					&& strFieldName === 'paymentSaveWithSI') {
				if (strValue === 'Y')
					ctrl.removeClass('hidden');
				else
					ctrl.addClass('hidden');
			} else if (strFieldName === 'drCrFlag') {
				handleDrCrFlagOnViewPaymentHeader(cfg, strPostFix, strValue);
			} else if (strFieldName === 'txnDate') {
				$(".txnDateInfoDiv").removeClass('hidden');
				ctrl.html(strValue || '');
			} else if (strFieldName === 'controlTotal') {
				if (strValue && strValue === 'Y')
					$(".controlTotal" + strPostFix + "Div")
							.removeClass('hidden');
				else
					$(".controlTotal" + strPostFix + "Div").addClass('hidden');
			} else if ((strFieldName === 'phdNotes' || strFieldName === 'phdAlerts')
					&& !isEmpty(strValue)) {
				isExtraInfoAvailable = true;
				ctrl.html(strValue || '');
			} else if (strFieldName === 'totalOpenAmount'
								|| strFieldName === 'totalAmount'
								|| strFieldName === 'totalReturnAmount'
								|| strFieldName === 'totalPaidAmount') {
								
								var strFormattedValue = '';
									strFormattedValue = cfg.formattedValue
										? cfg.formattedValue
										: cfg.value;
										ctrl.html(strFormattedValue || '');
								
						}else {
				ctrl.html(strValue || '');
			}
		});
	}

	if (strEntryType === 'PAYMENT' || strEntryType === 'SI') {
		var Freq = null, gstrPeriod = null, gstrRef = null, strExecutionDate;
		if (arrStdFields) {
			var stdFieldData = arrStdFields;
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
							if (fieldId === 'siExecutionDate') {
								if (!isEmpty(cfg.value))
									strExecutionDate = cfg.value;
							}
						});
			}
		}
		populateSIProcessingViewOnlyFields('B', Freq, gstrPeriod, gstrRef,
				strPostFix);
		if (strEntryType === 'PAYMENT')
			toggleRecurringPaymentParameterHdrFieldsViewOnlySectionVisibility();
	}

	if (objHdrInfo) {
		strHdrEnteredNo = objHdrInfo.hdrEnteredNo;
		strHdrEnteredAmount = objHdrInfo.hdrEnteredAmountFormatted;
		strHdrTotalNo = objHdrInfo.hdrTotalNo;
		if (jQuery.isNumeric(strHdrTotalNo)
				&& jQuery.isNumeric(strHdrEnteredNo)
				&& (strHdrTotalNo - strHdrEnteredNo >= 0))
			strHdrTotalNo = strHdrTotalNo - strHdrEnteredNo;
		strTotalAmount = objHdrInfo.balanceAmountFormatted;
		blnIsMultiCcy = objHdrInfo.isMultiCcyTxn;
	}
	if (blnIsMultiCcy) {
		$('.hdrMultiCcyIconSpan').remove();
		var objMultiCcyIcon = $('<span>').attr('class',
				'iconlink grdlnk-notify-icon icon-gln-fcy hdrMultiCcyIconSpan');
		$(objMultiCcyIcon)
				.insertBefore($(".hdrEnteredAmountFormatted_HdrInfo, .balanceAmountFormatted_HdrInfo"));
	} else
		$('.hdrMultiCcyIconSpan').remove();

	$('.enteredInstCount_HdrInfo').html(strHdrEnteredNo);
	$('.hdrEnteredAmountFormatted_HdrInfo').html(strHdrEnteredAmount);
	$('.totalInstCount_HdrInfo').html(strHdrTotalNo);
	$('.balanceAmountFormatted_HdrInfo').html(strTotalAmount);
	if (objHdrInfo) {
		/*
		 * $('.bankProduct_HdrInfo') .html(objHdrInfo.hdrMyProductDescription ||
		 * '');
		 */
		$('.productCuttOff_HdrInfo').html(objHdrInfo.hdrCutOffTime || '');
		$('.templateName_HdrInfo').html(objHdrInfo.hdrTemplateName || '');
		$('.templateType_HdrInfo').html(objHdrInfo.hdrTemplateType || '');
		$('.hdrMyProductDescriptionTitle')
				.html(objHdrInfo.hdrMyProductDescription || '');
		if (objHdrInfo.hdrDrCrFlag) {
			var drCrFlag = objHdrInfo.hdrDrCrFlag;
			if (strLayoutType === 'ACCTRFLAYOUT') {
				toggleAccountTransferHeaderAccountLabel(drCrFlag);
				$('.batchHeaderSectionLbl').text(drCrFlag === 'D'
						? 'Receiver Details'
						: 'Sender Details');
			}
		}
		/*
		 * if (objHdrInfo.hdrDrCrFlag === 'B' && strEntryType ==='TEMPLATE') {
		 * $('.drCrFlagC_HdrInfo,.drCrFlagD_HdrInfo').removeClass('hidden'); }
		 * else if (objHdrInfo.hdrDrCrFlag === 'C' || objHdrInfo.hdrDrCrFlag ===
		 * 'D') { $('.drCrFlag' + objHdrInfo.hdrDrCrFlag + '_HdrInfo')
		 * .removeClass('hidden'); } else {
		 * $('.drCrFlagC_HdrInfo,.drCrFlagD_HdrInfo').addClass('hidden'); }
		 */
		$('.lastUpdateDateTimeText').html("You saved on "
				+ objHdrInfo.lastUpdateTime || '');
		if (strEntryType === 'RECEIVABLE')
			$('.batchStatusText').html("Batch Status : " + objHdrInfo.hdrStatus
					|| '');
		//$('.siStatus' + strPostFix).text(objHdrInfo.hdrStatus || '');

		if (objHdrInfo.hdrSource) {
			$('.hdrSource_HdrInfo').text(objHdrInfo.hdrSource || '');
		}
	}
	if (data.d && data.d.receivableEntry && data.d.receivableEntry.paymentCompanyInfo) {
		var objInfo = data.d.receivableEntry.paymentCompanyInfo;
		var strText = !isEmpty(objInfo.company) ? objInfo.company : '';
		strText += '<br/>'
				+ (!isEmpty(objInfo.companyAddress)
						? objInfo.companyAddress
						: '');
		$('.companyInfoHdr').html(strText);
	}

	if (data.d && data.d.receivableHeaderInfo
			&& data.d.receivableHeaderInfo.hdrDrCrFlag && !isEmpty(strLayoutType)
			&& strLayoutType === 'ACCTRFLAYOUT') {
		toggleAccountTransferHeaderAccountLabel(data.d.receivableHeaderInfo.hdrDrCrFlag);
	}

	if (data && data.d && data.d.receivableEntry
			&& data.d.receivableEntry.enrichments) {
		paintPaymentHdrViewOnlyEnrichments(data.d.receivableEntry.enrichments,
				true);
	}
	
	// Handle Verification Page Extra Info Label
	if (isExtraInfoAvailable) {
		$('.extraInfoAvailable_InfoSpan').removeClass('hidden');
		$('.noExtraInfoAvailable_InfoSpan').addClass('hidden');
	}
	toggleContainerVisibility('verificationStepDiv');
	toggleContainerVisibility('paymentVerifyExtraDiv');

	if (objInstrumentEntryGrid) {
		objInstrumentEntryGrid.removeAll(true);
		objInstrumentEntryGrid.destroy(true);
		// $('#instrumentVerifyGridDiv').empty();
	}
	if (filterView) {
		filterView.destroy();
	}
	$('#instrumentEditGridParentDiv').children("*")
			.appendTo($('#instrumentVerifyGridDiv'));
	if (objInstrumentEntryGrid) {
		objInstrumentEntryGrid.removeAll(true);
		objInstrumentEntryGrid.destroy(true);
	}
	objInstrumentEntryGrid = null;
	doHandleEntryGridLoading(true, isEnableGridAction);
}

function postHandlePaymentHeaderProductCutOff(blnCanContinue, args) {
	var strAction = args.action;
	if (strAction && blnCanContinue) {
		switch (strAction) {
			case 'SAVE' :
				doSavePaymentHeader(true);
				break;
			case 'UPDATE' :
				doUpdatePaymentHeader(true);
				break;
			case 'UPDATEANDNEXT' :
				doUpdateAndNextPaymentHeader(true);
				break;
		}
	}
}

function paintPaymentHeaderActions(strAction) {
	var elt = null, btnBack = null, btnCancel = null, btnClose = null;
	$('#paymentHdrActionButtonListLT,#paymentHdrActionButtonListRT, #paymentHdrActionButtonListLB, #paymentHdrActionButtonListRB')
			.empty();
	var strBtnLTLB = '#paymentHdrActionButtonListLT,#paymentHdrActionButtonListLB';
	var strBtnRTRB = '#paymentHdrActionButtonListRT,#paymentHdrActionButtonListRB';
	btnBack = createButton('btnBack', 'S');
	btnBack.click(function() {
				goToPage(_mapUrl['cancelBatchUrl'], 'frmMain');
			});

	btnCancel = createButton('btnCancel', 'S');
	btnCancel.click(function() {
				doCancelEditPaymentHeader();
			});

	if (strAction === 'VIEW') {
		btnBack.appendTo($(strBtnLTLB));
	} else if (strAction === 'CONFIRM') {
	} else if (strAction === 'SUBMIT') {
		elt = createButton('btnSubmit', 'P');
		elt.click(function(e) {
					e.stopImmediatePropagation();
					doSubmitPaymentHeader();
				});
		elt.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");

		btnBack.unbind("click");
		btnBack.click(function() {
					doBackPaymentVerification();
				});
		btnBack.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");

		btnClose = createButton('btnClose', 'S');
		btnClose.click(function() {
					goToPage(_mapUrl['cancelBatchUrl'], 'frmMain');
				});

		btnClose.appendTo($(strBtnLTLB));
	} else if (strAction === 'EDIT') {
		elt = createButton('btnUpdate', 'P');
		elt.click(function() {
					doUpdatePaymentHeader();
				});
		elt.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
		btnBack.unbind("click");
		btnBack.click(function() {
					if (objInstrumentEntryGrid
							&& objInstrumentEntryGrid.isRecordInEditMode()) {
						objInstrumentEntryGrid.doHandleRecordSaveOnFocusOut(
								goToPage,
								[_mapUrl['cancelBatchUrl'], 'frmMain']);
					} else
						goToPage(_mapUrl['cancelBatchUrl'], 'frmMain');
				});
		btnBack.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
		btnCancel.appendTo($(strBtnLTLB));

	} else if (strAction === 'EDITNEXT') {
		elt = createButton('btnNext', 'P');
		elt.click(function() {
					if (objInstrumentEntryGrid
							&& objInstrumentEntryGrid.isRecordInEditMode()) {
						objInstrumentEntryGrid.doHandleRecordSaveOnFocusOut(
								doUpdateAndNextPaymentHeader, null);
					} else
						doUpdateAndNextPaymentHeader();
				});
		elt.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");

		btnBack.unbind("click");
		btnBack.click(function() {
					if (objInstrumentEntryGrid
							&& objInstrumentEntryGrid.isRecordInEditMode()) {
						objInstrumentEntryGrid.doHandleRecordSaveOnFocusOut(
								goToPage,
								[_mapUrl['cancelBatchUrl'], 'frmMain']);
					} else
						goToPage(_mapUrl['cancelBatchUrl'], 'frmMain');
				});
		btnBack.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");

		elt = createButton('btnDiscard', 'S');
		elt.click(function() {
					// doHandlePaymentHeaderActions('discard');
					if (objInstrumentEntryGrid
							&& objInstrumentEntryGrid.isRecordInEditMode()) {
						objInstrumentEntryGrid.doHandleRecordSaveOnFocusOut(
								getDiscardConfirmationPopup, ['B']);
					} else
						getDiscardConfirmationPopup('B');
				});
		elt.appendTo($(strBtnLTLB));
	} else if (strAction === 'CANCELONLY') {
		btnBack.appendTo($(strBtnLTLB));
	} else if (strAction === 'ADD') {
		elt = createButton('btnSave', 'P');
		elt.click(function() {
					doSavePaymentHeader();
				});
		elt.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
		btnBack.appendTo($(strBtnLTLB));
	}
	autoFocusFirstElement();
}
function paintPaymentHeaderActionsForView(strAction) {
	var btnBack = null, btnDiscard = null, btnSubmit = null, btnDisable = null, btnEnable = null;
	$('#paymentHdrActionButtonListLT,#paymentHdrActionButtonListRT, #paymentHdrActionButtonListLB, #paymentHdrActionButtonListRB')
			.empty();
	var strBtnLTLB = '#paymentHdrActionButtonListLT,#paymentHdrActionButtonListLB';
	var strBtnRTRB = '#paymentHdrActionButtonListRT,#paymentHdrActionButtonListRB';
	btnBack = createButton('btnBack', '');
	btnBack.click(function() {
				goToPage(_mapUrl['cancelBatchUrl'], 'frmMain');
			});

	btnDiscard = createButton('btnDiscard', 'P');
	btnDiscard.click(function() {
				// doHandlePaymentHeaderActions('discard');
				getDiscardConfirmationPopup('B');
			});

	if (strAction === 'SUBMIT') {
		btnDiscard.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");

		btnSubmit = createButton('btnSubmit', 'P');
		btnSubmit.click(function(e) {
					e.stopImmediatePropagation();
					doHandlePaymentHeaderActions('submit');
				});
		btnSubmit.appendTo($(strBtnRTRB));

		btnBack.appendTo($(strBtnLTLB));
	} else if (strAction === 'CANCELANDDISCARD') {
		btnDiscard.appendTo($(strBtnRTRB));
		btnBack.appendTo($(strBtnLTLB));
	} else if (strAction === 'CANCELDISABLE') {
		btnDisable = createButton('btnDisable', 'P');
		btnDisable.click(function() {
					doHandlePaymentHeaderActions('disable');
				});
		btnDisable.appendTo($(strBtnRTRB));

		btnBack.appendTo($(strBtnLTLB));
	} else if (strAction === 'CANCELENABLE') {
		btnEnable = createButton('btnEnable', 'P');
		btnEnable.click(function() {
					doHandlePaymentHeaderActions('enable');
				});
		btnEnable.appendTo($(strBtnRTRB));

		btnBack.appendTo($(strBtnLTLB));
	} else if (strAction === 'CANCELONLY') {
		btnBack.appendTo($(strBtnLTLB));
	}
}
function paintPaymentHeaderInstrumentLevelGroupActions(strMask, strAction,
		strAuthLevel, strParentId, strDetailId, strShowAdvice) {
	if (!isEmpty(strMask)) {
		var elt = null;
		var isAuth = isInstrumentActionEnabled(strMask, 6);
		var isReject = isInstrumentActionEnabled(strMask, 7);
		var strBtnRTRB = '#paymentDtlActionButtonListRT,#paymentDtlActionButtonListRB';

		if (isAuth === true && strAuthLevel === 'I') {
			$(strBtnRTRB).empty();
			elt = createButton('btnApprove', 'P');
			elt.click(function() {
						doHandlePaymentInstrumentAction('auth', false);
					});
			elt.appendTo($(strBtnRTRB));
			$(strBtnRTRB).append("&nbsp;");

		}
		if (isReject === true && strAuthLevel === 'I') {
			if (!isAuth)
				$(strBtnRTRB).empty();
			elt = createButton('btnReject', 'P');
			elt.click(function() {
						doHandleRejectAction('reject', 'Q', false);
					});
			elt.appendTo($(strBtnRTRB));
		}
		/*if(strShowAdvice === 'Y'){
			elt = createButton('btnPaymentAdvice', 'S');
			$(strBtnRTRB).append("&nbsp;");
			elt.unbind('click');
			elt.click(function(){
				var arrayJson = new Array()
				arrayJson.push({
							serialNo : 0,
							identifier : strPaymentInstrumentIde
						});
						$.download(_mapUrl['paymentAdvice'], arrayJson);
				});
			elt.appendTo($(strBtnRTRB));
				
		}*/
		
	}
}
function isInstrumentActionEnabled(arrInputMask, bitPosition) {
	var retValue = false;
	if (arrInputMask.charAt(bitPosition - 1)
			&& arrInputMask.charAt(bitPosition - 1) * 1 === 1)
		retValue = true;
	return retValue;
}
function repaintPaymentDetailGroupActions(payHeaderInfo) {
	var data = payHeaderInfo;
	if (data.hdrActionsMask) {
		var strAuthLevel = data.authLevel ? data.authLevel : 'B';
		var strParentId = data.hdrIdentifier ? data.hdrIdentifier : '';
		if (strParentId) {
			paintPaymentDetailGroupActions(data.hdrActionsMask, null,
					strAuthLevel, strParentId, null, data.showPaymentAdvice);
		} else
			doHandleUnknownErrorForBatch();
	}
}
function paintPaymentDetailGroupActions(strMask, strAction, strAuthLevel,
		strParentId, strDetailId, strShowAdvice) {
	// TODO : strAction, strDetailId to be removed, not being used
	if (!isEmpty(strMask)) {
		var elt = null;
		var isAuth = isActionEnabled(strMask, 0);
		var isReject = isActionEnabled(strMask, 1);
		var isSend = isActionEnabled(strMask, 2);
		var isHold = isActionEnabled(strMask, 3);
		var isRelease = isActionEnabled(strMask, 4);
		var isStop = isActionEnabled(strMask, 5);
		var isVerify = isActionEnabled(strMask, 6);
		// var isDiscard = isActionEnabled(strMask, 7);
		var strBtnRTRB = '#paymentHdrActionButtonListRT,#paymentHdrActionButtonListRB';
		$(strBtnRTRB).empty();
		if (isAuth === true) {
			$(strBtnRTRB).empty();
			if (null != strAuthLevel && "I" === strAuthLevel) {
				elt = createButton('btnAuthorizeAll', 'P');
			} else {
				elt = createButton('btnApprove', 'P');
			}
			elt.click(function() {
						doHandlePaymentHeaderActions('auth');
					});
			elt.appendTo($(strBtnRTRB));
			$(strBtnRTRB).append("&nbsp;");

		}
		if (isReject === true) {
			if (!isAuth)
				$(strBtnRTRB).empty();
			elt = createButton('btnReject', 'P');
			elt.click(function() {
						doHandleRejectAction('reject', 'B');
					});
			elt.appendTo($(strBtnRTRB));
		}

		if (isSend === true && !isAuth) {
			elt = createButton('btnSend', 'P');
			elt.click(function() {
						doHandlePaymentHeaderActions('send');
					});
			$(strBtnRTRB).append("&nbsp;");
			elt.appendTo($(strBtnRTRB));
		}

		if (isHold === true && !isAuth) {
			elt = createButton('btnHold', 'P');
			elt.click(function() {
						doHandlePaymentHeaderActions('hold');
					});
			$(strBtnRTRB).append("&nbsp;");
			elt.appendTo($(strBtnRTRB));
		}

		if (isRelease === true && !isAuth) {
			elt = createButton('btnRelease', 'P');
			elt.click(function() {
						doHandlePaymentHeaderActions('release');
					});
			$(strBtnRTRB).append("&nbsp;");
			elt.appendTo($(strBtnRTRB));
		}

		if (isStop === true && !isAuth) {
			elt = createButton('btnStop', 'P');
			elt.click(function() {
						doHandlePaymentHeaderActions('cancel');
					});
			$(strBtnRTRB).append("&nbsp;");
			elt.appendTo($(strBtnRTRB));
		}

		if (isVerify === true && !isAuth) {
			elt = createButton('btnVerify', 'P');
			elt.click(function() {
						doHandlePaymentHeaderActions('verify');
					});
			$(strBtnRTRB).append("&nbsp;");
			elt.appendTo($(strBtnRTRB));
		}
		/*if(strShowAdvice === 'Y'){
			elt = createButton('btnDebitAdvice', 'S');
			$(strBtnRTRB).append("&nbsp;");
			elt.appendTo($(strBtnRTRB));
			elt.click(function() {
				var arrayJson = new Array()
				arrayJson.push({
							serialNo : 0,
							identifier : strPaymentHeaderIde
						});
						$.download(_mapUrl['debitAdvice'], arrayJson);
				});
		} */
		/*
		 * if (isDiscard === true) { elt = createButton('btnDiscard', 'P');
		 * elt.click(function() { doHandlePaymentHeaderActions('discard'); });
		 * $(strBtnRTRB).append("&nbsp;"); elt.appendTo($(strBtnRTRB)); }
		 */
	}

}
function doHandleEmptyScreenErrorForPaymentHeader(arrError) {
	isScreenBroken = true;
	paintErrors(arrError);
	$('#paymentHeaderEntryStep2,#paymentInstrumentInitActionDiv,#paymentHeaderEntryExtraFieldsDiv,#paymentHeadeerTrasanctionSummaryDiv')
			.addClass('hidden');
	$('#messageContentHeaderDiv').appendTo($('#emptyScreenErrorBatchDiv'));
	$('#emptyScreenErrorBatchDiv').toggleClass("ui-helper-hidden");
	paintPaymentHeaderActionsForView('CANCELONLY');
}
function doHandleUnknownErrorForBatch() {
	var arrError = [{
				errorMessage : mapLbl['unknownErr'],
				errorCode : 'ERR'
			}];
	doHandleEmptyScreenErrorForPaymentHeader(arrError);
}
function generatePaymentHeaderJson() {
	var jsonPost = {}, jsonArrStdFields = [], jsonField = null;
	data = cloneObject(paymentResponseHeaderData), field = null, canAdd = false, objVal = null, isLinkageAdded = false, blnAutoNumeric=true ;
	var arrFields = [], strFieldName = null;
	var isCcyMismatch = isCurrencyMissMatchForHeader(), blnForexAtHeaderLevel = isForexAtHeaderLevel();

	if (data) {
		jsonPost = cloneObject(data);
		delete jsonPost['d']['receivableEntry']['message'];
		if (data && data.d && data.d.receivableEntry) {
			if (data.d.receivableEntry.standardField)
				arrFields = data.d.receivableEntry.standardField;
			// ============= Standard Field Node population =============
			$.each(arrFields, function(index, cfg) {
				canAdd = true;
				strFieldName = cfg.fieldName + 'Hdr';
				if (cfg.dataType === 'radio') {
					if (cfg.fieldName === 'drCrFlag') {
						if (strLayoutType === 'WIRELAYOUT'
								|| strLayoutType === 'ACCTRFLAYOUT')
							field = $('input[name=' + strFieldName + ']:radio');
						else
							field = $('input[name=' + strFieldName
									+ ']:checkbox');
					} else
						field = $('input[name=' + strFieldName + ']:radio');
				} else
					field = $('#' + strFieldName);

				if (field && field.length != 0) {
					if ((strFieldName === 'rateTypeHdr' || (strFieldName === "contractRefNoHdr" && $('#rateTypeHdr')
							.val() == '1'))) {
						canAdd = (isCcyMismatch && blnForexAtHeaderLevel)
								? true
								: false;
					} else if (strFieldName === 'amountHdr') {
						canAdd = true;
						// NOTE : txnCurrency node to be used from standarField
						// instead of amoun.txnCyrrency node
						if (false)
							jsonArrStdFields.push({
										fieldName : 'txnCurrency',
										value : $('#txnCurrencyHdr').val()
									});

					} else if (cfg.displayMode === '1')
						canAdd = false;

					if (canAdd) {
						objVal = null;
						if (cfg.dataType === 'radio') {
							if (cfg.fieldName === 'drCrFlag') {
								var isCrChecked = $('#drCrFlagHdrC')
										.is(':checked');
								var isDrChecked = $('#drCrFlagHdrD')
										.is(':checked');
								if (isCrChecked && isDrChecked)
									objVal = 'B';
								else if (isCrChecked)
									objVal = 'C';
								else if (isDrChecked)
									objVal = 'D';
							} else
								objVal = $('input[name=' + strFieldName
										+ ']:radio:checked').val();
						}
						else
						{
							// jquery autoNumeric formatting
							if( strFieldName === 'amountHdr' )
							{
								blnAutoNumeric = isAutoNumericApplied(strFieldName);
								if (blnAutoNumeric)
									objVal = $("#amountHdr").autoNumeric('get');
								else
									objVal = $("#amountHdr").val();
							}
							else
							{
								objVal = field.val();
							}
							// jquery autoNumeric formatting
						}

						if (strFieldName === 'lockFieldsMaskHdr') {
							var arrObj = generateSortAvalValArray(cfg.availableValues);
							$('#lockFieldsMaskHdr option').attr('disabled',
									false);
							objVal = generateControFiledMask(arrObj, field
											.val());
							doDisableDefaultLockFields('B');
						}
						if (strEntryType === 'TEMPLATE') {
							if (cfg.fieldName === 'accountNo') {
								var strTempType = $('input[name="templateTypeHdr"]:radio:checked')
										.val();
								if (strTempType === '1') {
									jsonField = cloneObject(cfg);
									jsonField.dataType = 'multiselect';
									jsonField.values = $('#accountNoHdr').val();
									jsonArrStdFields.push(jsonField);
								} else {
									jsonField = cloneObject(cfg);
									jsonField.value = $('#accountNoHdr').val();
									jsonField.values = [];
									jsonField.dataType = 'select';
									jsonArrStdFields.push(jsonField);
								}

							} else if (strFieldName === 'templateRolesHdr'
									|| strFieldName === 'templateUsersHdr') {
								jsonField = cloneObject(cfg);
								jsonField.values = $('#' + strFieldName).val()
										|| [];
								jsonArrStdFields.push(jsonField);
							} else {
								jsonField = cloneObject(cfg);
								jsonField.value = objVal;
								jsonArrStdFields.push(jsonField);
							}
						} else {
							jsonField = cloneObject(cfg);
							jsonField.value = objVal;
							jsonArrStdFields.push(jsonField);
						}
					}
				}
			});
			jsonPost.d.receivableEntry.standardField = jsonArrStdFields;
			// ============= Enrichment Info Node population =============
			if (data.d.receivableEntry.enrichments) {
				arrFields = [];
				if (data.d.receivableEntry.enrichments.udeEnrichment) {
					arrFields = data.d.receivableEntry.enrichments.udeEnrichment.parameters;
					jsonPost.d.receivableEntry.enrichments.udeEnrichment.parameters = getHeaderEnrichFieldJsonArray(
							arrFields, 'enrude_');
				}

			}
		}
	}
	return jsonPost;
}

function getHeaderEnrichFieldJsonArray(arrFields, strPrefix) {
	var field = null, canAdd = false, fieldName = null, jsonField = null;
	var arrRet = new Array();
	if (arrFields && arrFields.length > 0)
		$.each(arrFields, function(index, cfg) {
					jsonField = cloneObject(cfg);
					canAdd = true;
					fieldName = strPrefix + (cfg.fieldName || cfg.code);
					field = $('#' + fieldName);
					if (field && field.length != 0) {
						if (cfg.displayMode === '1')
							canAdd = false;
						if (canAdd) {
							jsonField.value = field.val();
							jsonField.string = field.val();
							arrRet.push(jsonField);
						}
					}
				});
	return arrRet;
}

// ========================== Helper Function Starts ==========================
function handleDrCrFlagPaymentHeader(cfg) {
	var strType = "checkbox";
	if (strLayoutType === 'WIRELAYOUT' || strLayoutType === 'ACCTRFLAYOUT')
		strType = "radio";
	if (cfg && cfg.value && 'D' === cfg.value && 'true' === cfg.readOnly) {
		$('#drCrFlagHdrDiv').html("");
		var strDrCrLabel = !isEmpty(mapDrCrReadonlyLabel[strPaymentType][cfg.value][strLayoutType])
				? mapDrCrReadonlyLabel[strPaymentType][cfg.value][strLayoutType]
				: 'Debit Trnsaction';
		$('<i class="fa fa-check"></i>&nbsp;<span>' + strDrCrLabel + '</span>')
				.appendTo($('<div>', {
							'class' : 'col-sm-12'
						}).appendTo($('#drCrFlagHdrDiv')));
		$('<input>', {
					type : strType,
					value : "D",
					id : "drCrFlagHdrD",
					name : "drCrFlagHdr",
					"checked" : "checked",
					'class' : "hidden"
				}).hide().appendTo($('#drCrFlagHdrDiv'));

	} else if ('drCrFlag' === cfg.fieldName && cfg.value && 'C' === cfg.value
			&& 'true' === cfg.readOnly) {
		$('#drCrFlagHdrDiv').html("");
		var strDrCrLabel = !isEmpty(mapDrCrReadonlyLabel[strPaymentType][cfg.value][strLayoutType])
				? mapDrCrReadonlyLabel[strPaymentType][cfg.value][strLayoutType]
				: 'Credit Transaction';
		$('<i class="fa fa-check"></i>&nbsp;<span>' + strDrCrLabel + '</span>')
				.appendTo($('<div>', {
							'class' : 'col-sm-12'
						}).appendTo($('#drCrFlagHdrDiv')));
		$('<input>', {
					type : strType,
					value : "C",
					id : "drCrFlagHdrC",
					name : "drCrFlagHdr",
					"checked" : "checked",
					'class' : "hidden"
				}).appendTo($('#drCrFlagHdrDiv'));
	}
	if (strLayoutType === 'ACCTRFLAYOUT') {
		toggleAccountTransferHeaderAccountLabel(cfg.value);
		$('.batchHeaderSectionLbl')
				.text((cfg && cfg.value && cfg.value) === 'D'
						? 'Receiver Details'
						: 'Sender Details');
	}
}
function handleDrCrFlagOnViewPaymentHeader(cfg, strPostFix, strValue) {
	if (cfg && cfg.value && cfg.readOnly && 'true' === cfg.readOnly) {
		var strDrCrLabel = cfg.value !== 'B'
				&& !isEmpty(mapDrCrReadonlyLabel[strPaymentType][cfg.value][strLayoutType])
				? mapDrCrReadonlyLabel[strPaymentType][cfg.value][strLayoutType]
				: cfg.value === 'D' ? 'Debit Trnsaction' : 'Credit Transaction';

		if ('D' === cfg.value) {
			$('.drCrFlagD' + strPostFix).empty();
			$('.drCrFlagD' + strPostFix).removeClass('hidden');
			$('<div class="form-group"><span><i class="fa fa-check"></i> '
					+ strDrCrLabel + '</span></div>').appendTo($('.drCrFlagD'
					+ strPostFix));
		} else if ('C' === cfg.value) {
			$('.drCrFlagC' + strPostFix).empty();
			$('.drCrFlagC' + strPostFix).removeClass('hidden');
			$('<div class="form-group"><span><i class="fa fa-check"></i> '
					+ strDrCrLabel + '</span></div>').appendTo($('.drCrFlagC'
					+ strPostFix));
		} else if ('B' === cfg.value) {
			$('.drCrFlagC' + strPostFix).removeClass('hidden');
			$('.drCrFlagD' + strPostFix).removeClass('hidden');
		}
	} else {
		if ('B' === cfg.value) {
			$('.drCrFlagC' + strPostFix).removeClass('hidden');
			$('.drCrFlagD' + strPostFix).removeClass('hidden');
		} else if ('D' === cfg.value) {
			$('.drCrFlagD' + strPostFix).removeClass('hidden');
			$('.drCrFlagC' + strPostFix).addClass('hidden');
		} else if ('C' === cfg.value) {
			$('.drCrFlagC' + strPostFix).removeClass('hidden');
			$('.drCrFlagD' + strPostFix).addClass('hidden');
		}
	}
	$('.drCrFlag' + strPostFix).html('(' + strValue + ')' || '');
	if (strLayoutType === 'ACCTRFLAYOUT') {
		toggleAccountTransferHeaderAccountLabel(cfg.value);
		$('.batchHeaderSectionLbl')
				.text((cfg && cfg.value && cfg.value) === 'D'
						? 'Receiver Details'
						: 'Sender Details');
	}
}
function handleForexForPaymentHeader() {
	handleChangeRateType();
}
function handleChangeRateType() {
	var strRateType = $('#rateTypeHdr').val();
	if (strRateType === '1') {
		$('#contractRefNoHdr').attr('disabled', false);
		$('#contractRefNoHdr').removeClass('disabled');
		$('#contractRefNoHdrLbl').addClass('required');
		$('#contractRefNoHdrDiv').removeClass('hidden');
		$('#contractRefNoHdr').blur(function mark() {
					markRequired($(this));
				});
	} else {
		$('#contractRefNoHdr').attr('disabled', true);
		$('#contractRefNoHdr').addClass('disabled');
		$('#contractRefNoHdr').removeClass('requiredField');
		$('#contractRefNoHdr').val('');
		$('#contractRefNoHdr').unbind('blur');
		$('#contractRefNoHdrLbl').removeClass('required');
		$('#contractRefNoHdrDiv').addClass('hidden');
	}
	handleCurrencyMissmatchForPaymentHeader();
}
function isCurrencyMissMatchForHeader() {
	var regExp = /\(([^)]+)\)$/;
	var matches = null, buyerCcy = null, retvalue = false;
	var account = $('#accountNoHdr :selected').text();
	var sellerCcy = $('#txnCurrencyHdr').val();// Transaction Currency
	if (account) {
		matches = regExp.exec(account)
		if (matches && matches[0])
			buyerCcy = matches[0].replace(/[()]/g, '');
	}
	if (!isEmpty(buyerCcy) && !isEmpty(sellerCcy) && (buyerCcy != sellerCcy))
		retvalue = true;
	return retvalue;
}
function getCurrencyMissMatchValueForHeaderViewOnly() {
	var data = paymentResponseHeaderData, fieldId = null, isCcyMissMatch = false;
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
			isCcyMissMatch = isCurrencyMissMatchForHeaderViewOnly(sellerCcy,
					buyerCcy);
		}
	}
	return isCcyMissMatch;
}
function isCurrencyMissMatchForHeaderViewOnly(sellerCcy, buyerCcy) {
	var retvalue = false;
	if (!isEmpty(buyerCcy) && !isEmpty(sellerCcy) && (buyerCcy != sellerCcy))
		retvalue = true;
	return retvalue;
}
function handleCurrencyMissmatchForPaymentHeader() {
	var regExp = /\(([^)]+)\)$/;
	var matches = null, buyerCcy = null;
	var account = $('#accountNoHdr :selected').text();
	var sellerCcy = $('#txnCurrencyHdr').val();// Transaction Currency
	var clsHide = 'hidden', clsReq = 'required';
	var isCcyMissMatch = false, blnForexAtHeaderLevel = isForexAtHeaderLevel();
	$('#accountNoHdrCcy').text('');
	if (account) {
		matches = regExp.exec(account)
		if (matches && matches[0]) {
			buyerCcy = matches[0].replace(/[()]/g, '');
			// $('#accountNoHdrCcy').text(buyerCcy + ',');
		}
	}
	isCcyMissMatch = isCurrencyMissMatchForHeader();
	if (isCcyMissMatch && blnForexAtHeaderLevel && isFxContractAvlblForHeader()) {
		$('#rateTypeHdrDiv').removeClass(clsHide);
		$('#rateTypeHdrLbl').addClass(clsReq);
		$('#contractRefNoHdr').ContractRefNoAutoComplete(buyerCcy, sellerCcy);
		$('#rateTypeHdr').blur(function mark() {
					markRequired($(this));
				});
		if (strEntryType === 'PAYMENT' || strEntryType === 'SI')
			getFXForHeader(buyerCcy, sellerCcy);
		$('#amountHdr').blur(function() {
					account = $('#accountNoHdr :selected').text();
					sellerCcy = $('#txnCurrencyHdr').val();// Transaction
					// Currency
					if (account) {
						matches = regExp.exec(account)
						if (matches && matches[0]) {
							buyerCcy = matches[0].replace(/[()]/g, '');
						}
					}
					if (strEntryType === 'PAYMENT' || strEntryType === 'SI')
						getFXForHeader(buyerCcy, sellerCcy);
					if (strLayoutType === "WIRELAYOUT") {
						$('#amountHdr').ForceNumericOnly(16, 2);
					} else {
						$('#amountHdr').ForceNumericOnly(19, 2);
					}
					if (!isEmpty($('#amountHdr').val())) {
						var txnAmount = $('#amountHdr').val();
						txnAmount = parseFloat(txnAmount);
						$('#amountHdr').val(txnAmount.toFixed(2));
					}
				});
	} else {
		$("#rateTypeHdr").val('0');
		$('#rateTypeHdrDiv, #contractRefNoHdrDiv').addClass(clsHide);
		$('#rateTypeHdrLbl, #contractRefNoHdrLbl').removeClass(clsReq);
		$('#contractRefNoHdr').attr('disabled', true);
		$('#contractRefNoHdr').addClass('disabled');
		$('#rateTypeHdr').unbind('blur');
		$('#rateTypeHdr').removeClass('requiredField');
		$('#fxSpanHdr').remove();
	}
}
function isFxContractAvlblForHeader() {
	var blnRet = false;
	var data = paymentResponseHeaderData;
	if (data && data.d && data.d.receivableEntry
			&& data.d.receivableEntry.receivableHeaderInfo
			&& !isEmpty(data.d.receivableEntry.receivableHeaderInfo.allowContractFX)
			&& data.d.receivableEntry.receivableHeaderInfo.allowContractFX == true)
		blnRet = true;
	return blnRet;
}
function isForexAtHeaderLevel() {
	var blnRet = false;
	var data = paymentResponseHeaderData;
	if (data && data.d && data.d.receivableEntry
			&& data.d.receivableEntry.receivableHeaderInfo
			&& data.d.receivableEntry.receivableHeaderInfo.fxLevel
			&& data.d.receivableEntry.receivableHeaderInfo.fxLevel === 'B')
		blnRet = true;
	return blnRet;
}
function toggleRecurringPaymentParameterHdrFieldsSectionVisibility() {
	var isChecked = $('#paymentSaveWithSIHdr').is(':checked');
	if (isChecked === true || strEntryType === 'SI') {
		$('#siProcessingParameterInfoHdrDiv').removeClass('ui-helper-hidden');
	} else {
		$('#siProcessingParameterInfoHdrDiv').addClass('ui-helper-hidden');
	}
}
function toggleRecurringPaymentParameterHdrFieldsViewOnlySectionVisibility(
		strPostFix) {
	var isChecked = $('#paymentSaveWithSI' + strPostFix).is(':checked');
	if (isChecked === true) {
		$('#siProcessingParameterInfoHdrDiv').removeClass('ui-helper-hidden');
	} else {
		$('#siProcessingParameterInfoHdrDiv').addClass('ui-helper-hidden');
	}
}
function toggleSaveSIHdrCheckBoxValue(id) {
	var isChecked = $('#' + id).attr('checked') ? true : false;
	if (isChecked)
		$('#' + id).val('Y');
	else
		$('#' + id).val('N');
	toggleRecurringPaymentParameterHdrFieldsSectionVisibility();
}
function applyControlFieldsValidationHeader() {
	var data = paymentResponseHeaderData, arrJSON = null, field = null, label = null;
	var mapCtrlFields = {}, key = '', isSelected = false;
	var arrSelected = $('#lockFieldsMaskHdr').multiselect("getChecked") || [];
	var arrValues = [];
	$.each(arrSelected, function(index, item) {
				arrValues.push(item.value);
			});
	if ($('#lockFieldsMaskHdr').has('option').length > 0) {
		$('#lockFieldsMaskHdr option').each(function() {
					key = $(this).attr('value');
					isSelected = jQuery.inArray(key, arrValues) != -1
							? true
							: false;
					if (!isEmpty(key)) {
						mapCtrlFields[key] = {};
						mapCtrlFields[key]['isSelected'] = isSelected;
					}
				});
	}
	if (data && data.d && data.d.receivableEntry) {
		arrJSON = data.d.receivableEntry.standardField;
		if (arrJSON && arrJSON.length > 0) {
			$.each(arrJSON, function(index, cfg) {
				if (mapCtrlFields[cfg.fieldName]) {
					mapCtrlFields[cfg.fieldName]['isRequiredDefault'] = (cfg.displayMode === '3' || false);
				}
			});
		}
	}
	$.each(mapCtrlFields, function(key, value) {
		field = $('#' + key + 'Hdr');
		label = $('#' + key + "HdrLbl");
		if (key !== 'accountNo')
			updateFieldDisplayMode(field, label, value);
			/*
			 * if (key === 'accountNo')
			 * updateFieldDisplayMode($('#companyIdHdr'), $('#companyIdHdrLbl'),
			 * value);
			 */
		});
	initatePaymentHeaderValidation();
}
/* Template : Add/Remove validations on change of control fields starts */
function handleTemplateTypeChangeB(strTemplateType) {
	handleTemplateTypeChange(strTemplateType, 'B');
	applyControlFieldsValidationHeader();
}
function applyControlFieldsValidationHdr() {
	var data = paymentResponseHeaderData, arrJSON = null, field = null, label = null;
	var mapCtrlFields = {}, key = '', isSelected = false;
	var arrSelected = $('#lockFieldsMaskHdr').multiselect("getChecked") || [];
	var arrValues = [];
	$.each(arrSelected, function(index, item) {
				arrValues.push(item.value);
			});
	if ($('#lockFieldsMaskHdr').has('option').length > 0) {
		$('#lockFieldsMaskHdr option').each(function() {
					key = $(this).attr('value');
					isSelected = jQuery.inArray(key, arrValues) != -1
							? true
							: false;
					if (!isEmpty(key)) {
						mapCtrlFields[key] = {};
						mapCtrlFields[key]['isSelected'] = isSelected;
					}
				});
	}
	if (data && data.d && data.d.receivableEntry) {
		arrJSON = data.d.receivableEntry.standardField;
		if (arrJSON && arrJSON.length > 0) {
			$.each(arrJSON, function(index, cfg) {
				if (mapCtrlFields[cfg.fieldName]) {
					mapCtrlFields[cfg.fieldName]['isRequiredDefault'] = (cfg.displayMode === '3' || false);
				}
			});
		}
	}
	$.each(mapCtrlFields, function(key, value) {
		field = $('#' + key + 'Hdr');
		if(key == 'drawerCode')
		{
			label = $('#' + "drawerDescriptionALbl");
		}
	else
		{
		    label = $('#' + key + "HdrLbl");
		}
		if (key !== 'accountNo')
			updateFieldDisplayMode(field, label, value);
			/*
			 * if (key === 'accountNo')
			 * updateFieldDisplayMode($('#companyIdHdr'), $('#companyIdHdrLbl'),
			 * value);
			 */
		});
	initatePaymentHeaderValidation();
}
/* Template : Add/Remove validations on change of control fields ends */
function initatePaymentHeaderValidation() {
	var field = null, fieldId = null;
	$('#paymentHeaderEntryStep2 label.required').each(function() {
				fieldId = $(this).attr('for');
				field = $('#' + fieldId);
				if (field && field.length != 0) {
					field.bind('blur', function mark() {
								markRequired($(this));
							});
				}
			});
}
function createCrDrHdrRadioGroup(strCheckBoxIds) {
	$(strCheckBoxIds).on('click', function() {
		var me = $(this), name = me.prop('name');
		if (me.is(':checked'))
			$(':checkbox[name="' + name + '"]').not($(this)).prop('checked',
					false);
		else
			me.attr('checked', true);
		if ($(':checkbox[name="' + name + '"]:checked').length > 0) {
			if (strLayoutType === 'ACCTRFLAYOUT') {
				toggleAccountTransferHeaderAccountLabel(me.val());
				$('.batchHeaderSectionLbl').text(me.val() === 'D'
						? 'Receiver Details'
						: 'Sender Details');
			}
			repopulateBankProductFieldHeader();
			return true;
		} else
			return false;
	});
}

function toggleAccountTransferHeaderAccountLabel(crDrFlag) {
	var clsHide = 'hidden';
	if (crDrFlag === 'C') {
		$(".accountcreditHdrLbl").removeClass(clsHide);
		$(".accountdebitHdrLbl").addClass(clsHide);

	} else if (crDrFlag === 'D') {
		$(".accountcreditHdrLbl").addClass(clsHide);
		$(".accountdebitHdrLbl").removeClass(clsHide);
	}
}
// FTMNTBANK-841
// function handleCompanyIdHeaderChange() {
// var strTempType = $('input[name="templateTypeHdr"]:radio:checked').val();
// var strCompanyId = $('#companyIdHdr').val();
// var strOldAccountNo = $("#accountNoHdr").val();
// var data = paymentResponseHeaderData;
// if ((strEntryType && strEntryType != 'TEMPLATE')
// || (strEntryType && strEntryType === 'TEMPLATE'
// && !isEmpty(strTempType) && strTempType !== '1')) {
// if (data && data.d && data.d.receivableEntry
// && data.d.receivableEntry.standardField) {
// var arrFields = [];
// var lstAvailableValues = [];
// arrFields = data.d.receivableEntry.standardField;
// if (arrFields && arrFields.length > 0) {
// $.each(arrFields, function(index, cfg) {
// if ('companyId' === cfg.fieldName) {
// lstAvailableValues = cfg.availableValues
// }
// });
// }
// if (lstAvailableValues && lstAvailableValues.length > 0)
// $.each(lstAvailableValues, function(index, cfg) {
// if (cfg && strCompanyId === cfg.code && cfg.defaultAccount) {
// $("#accountNoHdr").val(cfg.defaultAccount);
// }
// });
// if(isEmpty($("#accountNoHdr").val()))
// $("#accountNoHdr").val(strOldAccountNo);
// }
// }
// }
function handleDebitAccountHeaderChange() {
	var strTempType = $('input[name="templateTypeHdr"]:radio:checked').val();
	var strAccountNo = $('#accountNoHdr').val();
	// var strOldCompanyId = $("#companyIdHdr").val();
	var data = paymentResponseHeaderData;
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
					$("#companyIdHdr").val("");
			$.each(lstAvailableValues, function(index, cfg) {
						if (cfg /* && strCompanyId === cfg.code */
								&& cfg.defaultAccount
								&& cfg.defaultAccount === strAccountNo) {
							$("#companyIdHdr").val(cfg.code);
						}else{
							$("#companyId").removeAttr('disabled');
							$("#companyId").removeAttr('readonly');
						}
					});
			// if(isEmpty($("#companyIdHdr").val()))
			// $("#companyIdHdr").val(strOldCompanyId);
		}
	}
}
function createCrDrHdrCheckBoxGroup(strCheckBoxIds) {
	$(strCheckBoxIds).on('click', function() {
				var me = $(this), name = me.prop('name');
				if ($(':checkbox[name="' + name + '"]:checked').length > 0) {
					if (strLayoutType === 'WIRELAYOUT') {
						me.attr('checked', 'checked');
						if (me.attr('id') === 'drCrFlagHdrD') {
							$('#drCrFlagHdrC').removeAttr('checked');
						} else if (me.attr('id') === 'drCrFlagHdrC') {
							$('#drCrFlagHdrD').removeAttr('checked');
						}
					}
					/*
					 * if ($(':checkbox[name="' + name + '"]:checked').length ==
					 * 1) { toggleHdrAccountLabel(me, $(':checkbox[name="' +
					 * name + '"]:checked').val()); } else
					 * toggleHdrAccountLabel(null, 'B');
					 */
					repopulateBankProductFieldHeader();
					return true;
				} else
					return false;
			});
}

function validateRequiredPaymentHeaderFields() {
	var failedFields = 0, field = null, fieldId = null, tmpValid = true;
	$('#paymentHeaderEntryDiv label.required').each(function() {
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
function doHandlePaymentProrductToggle(data) {
	if (data && data.d && data.d.receivableEntry
			&& data.d.receivableEntry.standardField) {
		var arrFields = data.d.receivableEntry.standardField;
		if (arrFields.length > 0) {
			for (var i = 0; i < arrFields.length; i++) {
				if (arrFields[i].fieldName === 'bankProduct'
						&& arrFields[i].readOnly === 'true') {
					$('#bankProductHdr').find('option:not(:selected)').remove()
							.end();
					/*
					 * $('#bankProductHdr').hide();
					 * $('#bankProductHdrSpan').text($('#bankProductHdr').text());
					 */
				}
			}
		}
	}
}

function getFXForHeader(sellccy, buyccy) {
	if('AUTH' === showFxRateLevel) return;
	var txnAmount = $('#amountHdr').val();
	var contractRef = $('#contractRefNoHdr').val();
	if (!contractRef) {
		contractRef = "";
	}
	if (txnAmount && txnAmount > 0) {
		txnAmount = parseFloat(txnAmount);
	}
	var fxRateType = '0';
	if (isEmpty($('#rateTypeHdr').val())) {
		$('#rateTypeHdr').val('0')
	}
	fxRateType = $('#rateTypeHdr').val();
	if (buyccy != sellccy) {
		var urlSeek = "services/fxrate/" + buyccy + "/" + sellccy + ".json";
		var sendData = "$ratetype=" + fxRateType + !isEmpty(txnAmount)
				? ("&$amount=" + txnAmount)
				: '' + "&$qfilter=" + contractRef;
		// FTMNTBANK-2399
		if (!isEmpty(strPaymentHeaderIde) && fxRateType == '2') {
			sendData += "$headerId=" + strPaymentHeaderIde;
		}
		$.ajax({
					url : urlSeek,
					complete : function(XMLHttpRequest, textStatus) {
						$.unblockUI();
						if ("error" == textStatus)
							alert("Unable to complete your request!");
					},
					data : sendData,
					success : function(data) {

						$('#fxSpanHeader').remove();

						// if (isEmpty($('#amountHdr').val())
						// || $('#amountHdr').val() == 0) {
						// return;
						// }
						if (data && data.d && data.d.error)
							$("<span>").attr({
										'id' : 'fxSpanHeader'
									}).html(sellccy + " - " + buyccy + ": "
									+ data.d.error).appendTo('#rateTypeHdrDiv');
						else if (data && data.d && data.d.fxRate) {
							var htmlFx = "Indicative Rate (" + sellccy + " - "
									+ buyccy + ") : " + data.d.fxRate;
							// if (data.d.debitAmount) {
							// htmlFx += "<br>" + "Debit Amount:" + sellccy + "
							// "
							// + data.d.debitAmount;
							// }
							$("<span>").attr({
										'id' : 'fxSpanHeader'
									}).html(htmlFx).appendTo('#rateTypeHdrDiv');
						}
					}
				});
	}
}
function toggleControlTotalFiledDisabledValue() {
	var data = paymentResponseHeaderData;
	if (data && data.d && data.d.receivableEntry
			&& data.d.receivableEntry.standardField) {
		var stdFieldData = data.d.receivableEntry.standardField;
		var controlTotalVal = $('#controlTotalHdr').val();
		$.each(stdFieldData, function(index, cfg) {
					fieldId = cfg.fieldName;
					if (fieldId === 'controlTotal') {
						if (controlTotalVal === 'N') {
							$('#totalNoHdr').attr('readonly', true);
							$('#amountHdr').attr('readonly', true);

						} else if (controlTotalVal === 'Y') {
							$('#totalNoHdr').attr('readonly', false);
							$('#amountHdr').attr('readonly', false);
						}
					}
				});
	}
}

function togglerPaymentHederScreen(canEdit) {
	if (canEdit) {
		refreshPaymentHeaderDataForEdit(strPaymentHeaderIde, strIdentifier);
		$('#paymentHeaderEntryStep2A').removeClass('hidden');
		$('#paymentHeaderEntryStep2B, #paymentInstrumentInitActionDiv, #paymentHeaderEntryExtraFieldsDiv')
				.addClass('hidden');
		$("#paymentHeadeerTrasanctionSummaryDiv").addClass('hidden');
		if (strEntryType === 'PAYMENT' || strEntryType === 'SI') {
			if ($("#siSettingsInfo").attr('checked'))
				$('#siProcessingParameterInfoHdrDiv')
						.removeClass('ui-helper-hidden');
			else
				$('#siProcessingParameterInfoHdrDiv')
						.addClass('ui-helper-hidden');
		}
		paintPaymentHeaderActions('EDIT');
		toggleRecurringPaymentParameterHdrFieldsSectionVisibility();
		handleEmptyEnrichmentDivs();
	} else {
		$('#paymentHeaderEntryStep2A').addClass('hidden');
		$('#paymentHeaderEntryStep2B, #paymentInstrumentInitActionDiv, #paymentHeaderEntryExtraFieldsDiv')
				.removeClass('hidden');

		// if (strEntryType === 'PAYMENT' || strEntryType === 'SI'){
		$("#paymentHeadeerTrasanctionSummaryDiv .canClear").empty();
		$("#paymentHeadeerTrasanctionSummaryDiv").removeClass('hidden');
		// }
		paintPaymentHeaderActions('EDITNEXT');
	}
}
function doModifyPaymentHeader() {
	if (objInstrumentEntryGrid && objInstrumentEntryGrid.isRecordInEditMode()) {
		objInstrumentEntryGrid.doHandleRecordSaveOnFocusOut(
				togglerPaymentHederScreen, [true]);
	} else
		togglerPaymentHederScreen(true);
}
function doCancelEditPaymentHeader() {
	togglerPaymentHederScreen(false);
	if (!objInstrumentEntryGrid)
		doHandleEntryGridLoading(false, true);
}
function doBackPaymentVerification() {
	blockPaymentUI(true);
	$('#verificationStepDiv').addClass('hidden');
	$('#paymentHeaderEntryStep2, #paymentHeaderEntryStep2B, #paymentInstrumentInitActionDiv, #paymentHeaderEntryExtraFieldsDiv')
			.removeClass('hidden');

	$('#txnStep1,#txnStep3').removeClass('ft-status-bar-li-active')
			.addClass('ft-status-bar-li-done');
	$('#txnStep2').addClass('ft-status-bar-li-active');
	// if (strEntryType === 'PAYMENT' || strEntryType === 'SI'){
	// $("#paymentHeadeerTrasanctionSummaryDiv .canClear").empty();
	$("#paymentHeadeerTrasanctionSummaryDiv").removeClass('hidden');
	// }
	paintPaymentHeaderActions('EDITNEXT');
	blockPaymentUI(false);
	if (objInstrumentEntryGrid) {
		objInstrumentEntryGrid.removeAll(true);
		objInstrumentEntryGrid.destroy(true);
	}
	if (filterView) {
		filterView.destroy(true);
	}
	objInstrumentEntryGrid = null;
	$('#instrumentVerifyGridDiv').children("*")
			.appendTo($('#instrumentEditGridParentDiv'));
	doHandleEntryGridLoading(false, true);
}
function doViewPaymentHeader() {
	doClearMessageSection();
	$('#txnStep1,#txnStep2,#txnStep3').addClass('hidden');
	$('#paymentInstrumentInitActionDiv, #paymentHeaderEntryStep2, #messageContentDiv, #paymentHeaderEntryExtraFieldsDiv')
			.addClass('hidden');
	$('#verificationStepDiv').removeClass('hidden');
	// if (strEntryType === 'PAYMENT' || strEntryType === 'SI'){
	$("#paymentHeadeerTrasanctionSummaryDiv .canClear").empty();
	$("#paymentHeadeerTrasanctionSummaryDiv").removeClass('hidden');
	// }
}

function showTransactionWizardPopup(strIde, strAction, strPopUpDivId,
		strActionMask) {
	blockPaymentInstrumentUI(true);
	var strDivId = strPopUpDivId || 'transactionWizardPopup';
	$("#" + strDivId).dialog({
		resizable : false,
		modal : true,
		maxHeight : 500,
		width : 869,
		dialogClass : "hide-title-bar",
		open : function(event, ui) {
			var strMsgDivId = strAction === 'VIEW'
					? '#messageContentInstrumentViewDiv'
					: '#messageContentInstrumentDiv';
			$('#messageContentDiv').appendTo($(strMsgDivId));
			$('#enrichMessageContentDiv').appendTo($(strMsgDivId));
			doClearMessageSection();
			$(this).data['strTxnWizardAction']= strAction;
			if (strAction === 'UPDATE' || strAction === 'VIEW')
				doShowAddedInstrument(strIde, strAction, strActionMask);
			else
				doShowInstrumentForm();
			$('.transaction-wizard :input:not(:checkbox):not(:radio):not([readonly]):visible:enabled:first')
					.focus();
			blockPaymentInstrumentUI(false);
		},
		close : function(event, ui) {
			$('#messageContentDiv').appendTo($('#messageContentHeaderDiv'));
			toggleReceiver('A', true);
			paymentResponseInstrumentData = null;
			strPaymentInstrumentIde = null;
			var strTxnWizardAction =$(this).data['strTxnWizardAction'];
			if((strTxnWizardAction=== 'ADD' || strTxnWizardAction=== 'UPDATE') && typeof objInstrumentEntryGrid != 'undefined'
					&& objInstrumentEntryGrid) {
				objInstrumentEntryGrid.refreshData();
			}
		}
	});
}

function closeTransactionWizardPopup() {
	$('#transactionWizardPopup').dialog('close');
	if (strLayoutType === 'TAXLAYOUT')
		$('#addendaSectionDivNew').addClass('hidden');
}
function closeViewTransactionWizardPopup() {
	// To hide Receiver Section Additional Details : Start
	$('#registeredReceiverDetailsLinkInstView').trigger('click');
	// To hide Receiver Section Additional Details : End
	$('#transactionWizardViewPopup').dialog('close');
}
function toggleGridLayoutEntryOption(chrAllowGridLayout) {
	// TODO : Enable Grid Entry by removing the comment
	// chrAllowGridLayout = 'Y';
	if (!isEmpty(chrAllowGridLayout)) {
		if (chrAllowGridLayout === 'N')
			$('#btnAddRow, #btnAddUsing').remove();
		else if (chrAllowGridLayout === 'Y')
			toggleGridLayoutEntryAddRow(true);
		chrAllowGridLayoutEntry = chrAllowGridLayout;
	}
}
function toggleImportEntryOption(chrAllowImport) {
	if (!isEmpty(chrAllowImport) && chrAllowImport === "N") {
		$('#btnImportTxn').addClass('hidden');
		$('#btnImportTxn').empty();
	} else
		$('#btnImportTxn').removeClass('hidden');
}
function toggleGridLayoutEntryAddRow(canBind) {
	if (canBind) {
		$('#btnAddRow').unbind('click');
		$('#btnAddRow').bind('click', function() {
					$(document).trigger("addGridRow");
				});
	} else
		$('#btnAddRow').unbind('click');
}
function toggleInstrumentInitiationActions() {
	var layout = strLayoutType;
	var ctrl = $('#btnAddUsing');
	ctrl.unbind('click');
	if (layout === 'ACCTRFLAYOUT' || layout === 'CHECKSLAYOUT')
		ctrl.bind('click', function() {
					var blnResult;
					var blnFlag = doValidationForControlTotal();
					if (blnFlag)
						blnResult = objInstrumentEntryGrid
								? objInstrumentEntryGrid
										.validateTotalNumberOfInstrument()
								: true;
					else
						blnResult = true;

					if (blnResult) {
						if (objInstrumentEntryGrid
								&& objInstrumentEntryGrid.isRecordInEditMode()) {
							objInstrumentEntryGrid
									.doHandleRecordSaveOnFocusOut(
											showAccountSlectionPopup, null);
						} else
							showAccountSlectionPopup();
					}
				});
	else
		ctrl.bind('click', function() {
					var blnFlag = doValidationForControlTotal();
					if (blnFlag)
						blnResult = objInstrumentEntryGrid
								? objInstrumentEntryGrid
										.validateTotalNumberOfInstrument()
								: true;
					else
						blnResult = true;

					if (blnResult) {
						if (objInstrumentEntryGrid
								&& objInstrumentEntryGrid.isRecordInEditMode()) {
							objInstrumentEntryGrid
									.doHandleRecordSaveOnFocusOut(
											showReceiverSlectionPopup, null);
						} else
							showReceiverSlectionPopup();
					}
				});

	ctrl = $('#btnTxnWizard');
	ctrl.unbind('click');
	ctrl.bind('click', function() {
				var blnFlag = doValidationForControlTotal();
				if (blnFlag)
					blnResult = objInstrumentEntryGrid ? objInstrumentEntryGrid
							.validateTotalNumberOfInstrument() : true;
				else
					blnResult = true;

				if (blnResult) {
					if (objInstrumentEntryGrid
							&& objInstrumentEntryGrid.isRecordInEditMode()) {
						objInstrumentEntryGrid.doHandleRecordSaveOnFocusOut(
								showTransactionWizardPopup, null, 'ADD');
					} else
						showTransactionWizardPopup();
				}
			});

	ctrl = $('#btnImportTxn');
	ctrl.unbind('click');
	ctrl.bind('click', function() {
				var blnFlag = doValidationForControlTotal();
				if (blnFlag)
					blnResult = objInstrumentEntryGrid ? objInstrumentEntryGrid
							.validateTotalNumberOfInstrument() : true;
				else
					blnResult = true;

				if (blnResult) {
					if (objInstrumentEntryGrid
							&& objInstrumentEntryGrid.isRecordInEditMode()) {
						objInstrumentEntryGrid.doHandleRecordSaveOnFocusOut(
								showImportTransactionsPopup, null);
					} else
						showImportTransactionsPopup();
				}
			});

}
// ========================== Helper Function Ends ==========================

// ================ Payment Instrument Handling Starts==========================

function doShowInstrumentForm() {
	blockPaymentInstrumentUI(true);
	resetInstrumentForm();
	loadPaymentBatchInstrumentFields(strPaymentHeaderIde);
}
function doShowAddedInstrument(strIde, strAction, strActionMask) {
	blockPaymentInstrumentUI(true);
	if (strAction === 'UPDATE') {
		resetInstrumentForm();
		editPaymentBatchInstrument(strIde, strAction);
	}
	if (strAction === 'VIEW') {
		viewPaymentBatchInstrument(strIde, strAction, strActionMask);
	}
}
function loadPaymentBatchInstrumentFields(strHeaderId) {
	if (!isEmpty(strHeaderId)) {
		var url = _mapUrl['loadBatchInstrumentFieldsUrl'];
		var jsondata = {'id':strHeaderId};
		$.ajax({
			type : "POST",
			url : url,
			data : jsondata,
			async : false,
			complete : function(XMLHttpRequest, textStatus) {
				if ("error" == textStatus) {
					closeTransactionWizardPopup();
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
					if (data.d
							&& data.d.message
							&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
						closeTransactionWizardPopup();
						paintErrors(data.d.message.errors);
					} else {
						paymentResponseInstrumentData = data;
						// TODO To be verified
						doRemoveStaticText("transactionWizardPopup");
						paintReceivableInstrumentUI(data, 'Q');
						initateValidation();
						// This is used to handle the control total validation
						var blnFlag = doValidationForControlTotal();
						if (blnFlag)
							isBtnVisible = isAddAnotherTxnButtonVisible(data);
						else
							isBtnVisible = true;
						paintPaymentBatchInstrumentActions('ADD', isBtnVisible);
						populatePaymentHeaderViewOnlySection(
								paymentResponseHeaderData,
								data.d.receivableEntry.receivableHeaderInfo, 'N',
								'EDIT');
						toggleContainerVisibility('transactionWizardPopup');
						blockPaymentInstrumentUI(false);
						handleEmptyEnrichmentDivs();
					}
				}
			}
		});
	} else {
		var arrError = new Array();
		closeTransactionWizardPopup();
		blockPaymentInstrumentUI(false);
		if (paymentResponseHeaderData
				&& paymentResponseHeaderData.d
				&& paymentResponseHeaderData.d.receivableEntry
				&& paymentResponseHeaderData.d.receivableEntry.message
				&& paymentResponseHeaderData.d.receivableEntry.message.errors
				&& paymentResponseHeaderData.d.receivableEntry.message.errors.length > 0) {

			arrError = paymentResponseHeaderData.d.receivableEntry.message.errors;
			// arrError.push({
			// "errorCode" : "Message",
			// "errorMessage" : mapLbl['unknownErr']
			// });
		} else {
			arrError.push({
						"errorCode" : "Message",
						"errorMessage" : mapLbl['unknownErr']
					});
		}
		paintErrors(arrError);
	}
}
function editPaymentBatchInstrument(strIde, strAction) {
	var url = _mapUrl['readSavedBatchInstrumentUrl'];
	var jsondata = {'_mode' : 'EDIT','id':strIde};
	$.ajax({
		type : "POST",
		url : url,
		async : false,
		data : jsondata,
		complete : function(XMLHttpRequest, textStatus) {
			if ("error" == textStatus) {
				closeTransactionWizardPopup();
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
				if (data.d
						&& data.d.message
						&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
					closeTransactionWizardPopup();
					paintErrors(data.d.message.errors);
				} else {
					paymentResponseInstrumentData = data;
					doRemoveStaticText("transactionWizardPopup");
					if (data.d.receivableEntry && data.d.__metadata
							&& data.d.__metadata._detailId) {
						strPaymentInstrumentIde = data.d.__metadata._detailId;
					}
					paintReceivableInstrumentUI(data, 'Q');
					initateValidation();
					// This is used to handle the control total validation
					var blnFlag = doValidationForControlTotal();
					if (blnFlag)
						isBtnVisible = isAddAnotherTxnButtonVisible(data);
					else
						isBtnVisible = true;
					paintPaymentBatchInstrumentActions(strAction, isBtnVisible);
					populatePaymentHeaderViewOnlySection(
							paymentResponseHeaderData,
							data.d.receivableEntry.receivableHeaderInfo, 'N', 'EDIT');

					// Paint Errors if payment is saved with error
					if (data.d
							&& data.d.receivableEntry
							&& data.d.receivableEntry.message
							&& (data.d.receivableEntry.message.errors || data.d.receivableEntry.message.success === 'SAVEWITHERROR')) {
						paintErrors(data.d.receivableEntry.message.errors);
					}
					// TODO : To be verify
					// Paint CashIn Errors
					if (false && data.d && data.d.receivableEntry
							&& data.d.receivableEntry.adminMessage
							&& data.d.receivableEntry.adminMessage.errors) {
						paintCashInErrors(data.d.receivableEntry.adminMessage.errors)
					}
					toggleContainerVisibility('transactionWizardPopup');
					blockPaymentInstrumentUI(false);
					handleEmptyEnrichmentDivs();
				}
			}
		}
	});
}

function viewPaymentBatchInstrument(strIde, strAction, strActionMask) {
	var url = _mapUrl['readSavedBatchInstrumentUrl'] ;
	var jsonData = {'id' :strIde ,'_mode' : 'VIEW'};
	$.ajax({
		type : "POST",
		url : url,
		async : false,
		data : jsonData,
		complete : function(XMLHttpRequest, textStatus) {
			if ("error" == textStatus) {
				closeViewTransactionWizardPopup();
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
				if (data.d
						&& data.d.message
						&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
					closeViewTransactionWizardPopup();
					paintErrors(data.d.message.errors);
				} else {
					paymentResponseInstrumentData = data;
					if (data.d && data.d.__metadata
							&& data.d.__metadata._detailId) {
						strPaymentInstrumentIde = data.d.__metadata._detailId;
					}
					resetPaymentInstrumentViewOnlyUI();
					paintPaymentInstrumentViewOnlyUI(data,
							paymentResponseHeaderData);

					if (data.d.receivableEntry && data.d.__metadata)
						strPaymentInstrumentIde = data.d.__metadata._detailId;

					// Paint Errors if payment is saved with error
					if (data.d
							&& data.d.receivableEntry
							&& data.d.receivableEntry.message
							&& (data.d.receivableEntry.message.errors || data.d.receivableEntry.message.success === 'SAVEWITHERROR')) {
						paintErrors(data.d.receivableEntry.message.errors);
					}
					// Paint CashIn Errors
					if (false && data.d && data.d.receivableEntry
							&& data.d.receivableEntry.adminMessage
							&& data.d.receivableEntry.adminMessage.errors) {
						paintCashInErrors(data.d.receivableEntry.adminMessage.errors)
					}
					paintPaymentBatchInstrumentActions('CLOSE', false);

					if (strActionMask) {
						var strAuthLevel = data.d.receivableEntry.receivableHeaderInfo.authLevel;
						var strDetailId = data.d.__metadata._detailId;
						var strParentId = data.d.receivableEntry.receivableHeaderInfo.hdrIdentifier
						paintPaymentHeaderInstrumentLevelGroupActions(
								strActionMask, 'VIEW', strAuthLevel,
								strParentId, strDetailId, data.d.receivableEntry.receivableHeaderInfo.showPaymentAdvice);
					}
					toggleContainerVisibility('transactionWizardViewPopup');
					toggleContainerVisibility('paymentInstrumentViewExtraFieldsDiv');
					blockPaymentInstrumentUI(false);
					handleEmptyEnrichmentDivs();
					if(null !== PDC_FLAG && "Y" === PDC_FLAG)
					{
						$(".pdcFields").show();
					}
					else
					{
						$(".pdcFields").hide();
					}
				}
			}
		}
	});
}
function loadPaymentBatchInstrumentFieldsForGridLayout(headerId, strUrl) {
	var returnData = null;
	if (!isEmpty(headerId)) {
		var url = strUrl || _mapUrl['loadBatchInstrumentFieldsUrl'] ;
		var jsonData = {'id' :headerId,'_mode' : 'GRID'};
		$.ajax({
			type : "POST",
			url : url,
			data : jsonData,
			async : false,
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
			success : function(data) {
				if (data != null) {
					if (data.d
							&& data.d.message
							&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
						paintErrors(data.d.message.errors);

					} else {
						instrumentEntryGridRowData = data;
						returnData = data;
					}
				}
			}
		});
	}
	return returnData;
}
function loadPaymentBatchInstrumentBankProductFields() {
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
						paymentResponseInstrumentData = data;
						doRemoveStaticText("transactionWizardPopup");
						paintReceivableInstrumentUI(data, 'Q');
						initateValidation();
						setTimeout('blockPaymentInstrumentUI(false)', 300);
					}
				}
			});
}
function paintPaymentInstrumentViewOnlyUI(objInstData, objHdrData) {
	var arrStdFields = null, clsHide = 'hidden';
	var objHdrInfo = null, objMetaData = null, receivableEntry = null, beneficiary = null, canShowEnrichmentSection = false, canShowAdditionalInfoSection = false;
	var canShowDenominationSection = false;
	/* ...........Paint Batch Header Fields Start.......... */
	if (objHdrData && objHdrData.d) {
		if (objHdrData.d.receivableEntry) {
			receivableEntry = objHdrData.d.receivableEntry;
			objHdrInfo = receivableEntry && receivableEntry.receivableHeaderInfo
					? receivableEntry.receivableHeaderInfo
					: null;
			if (objHdrInfo) {
				/*
				 * var strValueTobeDisplayed = ''; if
				 * (objHdrInfo.hdrMyProductDescription &&
				 * objHdrInfo.hdrMyProductDescription.length > 10) {
				 * strValueTobeDisplayed = objHdrInfo.hdrMyProductDescription
				 * .substr(0, 9) + '...'; } else { strValueTobeDisplayed =
				 * objHdrInfo.hdrMyProductDescription; }
				 * $('.bankProductDescHdr_InstView').attr("title",
				 * objHdrInfo.hdrMyProductDescription);
				 * $('.bankProductDescHdr_InstView').html(strValueTobeDisplayed ||
				 * '');
				 */
				if (isEmpty(objHdrInfo.hdrCutOffTime)
						&& objInstData
						&& objInstData.d
						&& objInstData.d.receivableEntry
						&& objInstData.d.receivableEntry.receivableHeaderInfo
						&& objInstData.d.receivableEntry.receivableHeaderInfo.hdrCutOffTime) {
					$('.productCuttOffHdr_InstView')
							.html(objInstData.d.receivableEntry.receivableHeaderInfo.hdrCutOffTime
									|| '');
				} else
					$('.productCuttOffHdr_InstView')
							.html(objHdrInfo.hdrCutOffTime || '');
				$('.hdrStatusHdr_InstView').html(objHdrInfo.hdrStatus || '');

				if (objHdrInfo.hdrSource) {
					$('.hdrSourceHdr_InstView')
							.text(objHdrInfo.hdrSource || '');
				}

				if (strPaymentType === 'BATCHPAY') {
					if ((objHdrInfo.accountLevel && objHdrInfo.accountLevel === 'I')
							|| (objHdrInfo.dateLevel && objHdrInfo.dateLevel === 'I')) {
						$('.batchHeaderSectionLbl').text('Sender Details');
						$('#batchheader').collapsiblePanel(true);
					}
				}

				/*
				 * if (objHdrInfo.hdrDrCrFlag === 'B') {
				 * $('.drCrFlagC_HdrInfo,.drCrFlagD_HdrInfo').removeClass('hidden'); }
				 * else if (objHdrInfo.hdrDrCrFlag === 'C' ||
				 * objHdrInfo.hdrDrCrFlag === 'D') { $('.drCrFlag' +
				 * objHdrInfo.hdrDrCrFlag + '_HdrInfo') .removeClass('hidden'); }
				 * else {
				 * $('.drCrFlagC_HdrInfo,.drCrFlagD_HdrInfo').addClass('hidden'); }
				 */
			} else {
				$('.bankProduct_InstView,.productCuttOff_InstView').html('');
				/* $('.drCrFlagC_HdrInfo,.drCrFlagD_HdrInfo').addClass('hidden'); */
			}
			objMetaData = receivableEntry && receivableEntry.paymentMetaData
					? receivableEntry.paymentMetaData
					: null;
			if (objMetaData) {
				$('.txnQueueHdr_InstView').html(objMetaData.txnQueue || '');
			}
			if (receivableEntry.paymentCompanyInfo) {
				var objInfo = receivableEntry.paymentCompanyInfo;
				var strText = !isEmpty(objInfo.company) ? objInfo.company : '';
				strText += '<br/>'
						+ (!isEmpty(objInfo.companyAddress)
								? objInfo.companyAddress
								: '');
				$('.companyInfoHdr_InstView').html(strText);
			} else {
				$('.companyInfoHdr_InstView').html('');
			}

			arrStdFields = receivableEntry.standardField
					? receivableEntry.standardField
					: null;
			paintPaymentInstrumentViewOnlyFields(arrStdFields, 'Hdr_InstView');

		}
	}
	/* ...........Paint Batch Header Fields End.......... */

	/* ...........Paint Batch Instrument Fields Start.......... */

	if (objInstData && objInstData.d && objInstData.d.receivableEntry) {
		$('#addendaSectionDivNew_InstView').addClass(clsHide);
		receivableEntry = objInstData.d.receivableEntry;

		arrStdFields = receivableEntry.standardField
				? receivableEntry.standardField
				: null;
		paintPaymentInstrumentViewOnlyFields(arrStdFields, '_InstView');
		// To be verified
		if (strLayoutType === 'ACCTRFLAYOUT') {
			toggleAccountTransferAccountLabel(objHdrInfo.hdrDrCrFlag);
		}
		if (receivableEntry.beneficiary) {
			paintReceiverViewOnlyDetails(receivableEntry.beneficiary);
		}

		if (receivableEntry.enrichments) {
			canShowEnrichmentSection = paintPaymentEnrichmentsViewOnlyFields(receivableEntry.enrichments);
		}
		if (receivableEntry.denominations) {
				canShowDenominationSection = paintReceivableDenominationsViewOnlyFields(receivableEntry.denominations);
		}
		if (receivableEntry.additionalInfo) {
			canShowAdditionalInfoSection = paintPaymentAdditionalInformationViewOnly(
					receivableEntry.additionalInfo, true);
		}
		showHideAddendaViewOnlySection(canShowEnrichmentSection,
				canShowAdditionalInfoSection);
		showHideDenominationViewSection(canShowDenominationSection);
		
		if (objInstData.d && objInstData.d.__metadata
				&& objInstData.d.__metadata._detailId)
			paintPaymentDtlAdditionalInformationSection(
					objInstData.d.__metadata._detailId, 'Q');
		paintFXForDetailViewOnlySection();
	}

	/* ...........Paint Batch Instrument Fields End.......... */

}

function resetPaymentInstrumentViewOnlyUI() {
	$(".transactionWizardInnerDiv").find(".canClear").html('');
	$(".transactionWizardInnerDiv").find(".canCollapse").addClass('hidden');
}

function doValidationForControlTotal() {
	var data, objStdField, displayModeOftotalNo, blnCtronTotalField = false, isInstCountValidationApply = false, valOfControlTotalCheckBox;
	data = paymentResponseHeaderData;
	if (data && data.d.receivableEntry && data.d.receivableEntry.standardField) {
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
function isAddAnotherTxnButtonVisible(data) {
	var intEnteredNo = 0;
	var hdrTotalNo = 0;
	var isBtnVisible = true;
	if (data && data.d && data.d.receivableEntry
			&& data.d.receivableEntry.receivableHeaderInfo) {
		if (!isEmpty(data.d.receivableEntry.receivableHeaderInfo.hdrEnteredNo))
			intEnteredNo = parseInt(data.d.receivableEntry.receivableHeaderInfo.hdrEnteredNo,10);
		if (!isEmpty(data.d.receivableEntry.receivableHeaderInfo.hdrTotalNo))
			hdrTotalNo = parseInt(data.d.receivableEntry.receivableHeaderInfo.hdrTotalNo,10);
		if (intEnteredNo === hdrTotalNo - 1)
			isBtnVisible = false;
	}
	return isBtnVisible;
}
function validateInstrumentCount(intGridRecordCnt, blnShowError) {
	var objSaveTotalNo = null, objStandField, objValTotalNo, isValid = false, blnShowPopup = !isEmpty(blnShowError)
			? blnShowError
			: true;
	if ((!isEmpty(paymentResponseHeaderData))
			&& (!isEmpty(paymentResponseHeaderData.d.receivableEntry.standardField)))
		objStandField = paymentResponseHeaderData.d.receivableEntry.standardField;
	objValTotalNo = $('#totalNoHdr').val();
	for (i = 0; i < objStandField.length; i++) {
		if (objStandField[i].fieldName === 'totalNo')
			objSaveTotalNo = objStandField[i].value;
	}
	if ((intGridRecordCnt <= objSaveTotalNo)
			&& ((intGridRecordCnt == objSaveTotalNo) && (intGridRecordCnt < objValTotalNo))) {
		if (blnShowPopup)
			showErrorMsg(mapLbl['controlTotalSaveHeaderMsg']);
		isValid = false;
	} else if ((intGridRecordCnt == objSaveTotalNo)
			&& (intGridRecordCnt == objValTotalNo)) {
		if (blnShowPopup)
			showErrorMsg(mapLbl['controlTotalMatchMsg']);
		isValid = false;
	} else if (intGridRecordCnt > objSaveTotalNo) {
		if (blnShowPopup)
			showErrorMsg(mapLbl['controlTotalMatchMsg']);
		isValid = false;
	} else {
		isValid = true;
	}

	return isValid;
}
function getNoOfInstrumentToBeAdded(intGridRecordCnt, intMaxApplicableCount) {
	var intSavedTotalNo = null, objStandField, intScreenTotalNo, isValid = doValidationForControlTotal(), intInstCnt = null, intRemained = 0;
	if (isValid) {
		if ((!isEmpty(paymentResponseHeaderData))
				&& (!isEmpty(paymentResponseHeaderData.d.receivableEntry.standardField)))
			objStandField = paymentResponseHeaderData.d.receivableEntry.standardField;
		intScreenTotalNo = $('#totalNoHdr').val();
		for (i = 0; i < objStandField.length; i++) {
			if (objStandField[i].fieldName === 'totalNo')
				intSavedTotalNo = objStandField[i].value;
		}
		if(!isEmpty(intSavedTotalNo))
			intRemained = intSavedTotalNo - intGridRecordCnt;
		if (intGridRecordCnt === 0 && intSavedTotalNo <= intMaxApplicableCount) {
			intInstCnt = intSavedTotalNo;
		} else if (intGridRecordCnt > 0 && (intGridRecordCnt < intSavedTotalNo)) {
			intInstCnt =  intMaxApplicableCount <= intRemained ? intMaxApplicableCount : (intMaxApplicableCount-intRemained);
		}
	}
	return intInstCnt;
}
function paintPaymentBatchInstrumentActions(strAction, isBtnVisible) {
	var elt = null, eltCancel = null, eltDiscard = null;
	$('#paymentDtlActionButtonListLT,#paymentDtlActionButtonListRT, #paymentDtlActionButtonListLB, #paymentDtlActionButtonListRB')
			.empty();
	var strBtnLTLB = '#paymentDtlActionButtonListLT,#paymentDtlActionButtonListLB';
	var strBtnRTRB = '#paymentDtlActionButtonListRT,#paymentDtlActionButtonListRB';
	var canShow = true;
	eltCancel = createButton('btnClose', 'S');

	// This is used to handle the control total validation
	if (!isEmpty(isBtnVisible))
		canShow = isBtnVisible;

	eltCancel.click(function() {
				doCancelBatchInstrument(strAction);
			});
	if (strAction === 'ADD') {
		elt = createButton('btnDone', 'P');
		elt.click(function() {
					// doSaveBatchInstrument();
					doSaveAndExitBatchInstrument();
				});
		elt.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");

		/*
		 * elt = createButton('btnSaveAndExit', 'P'); elt.click(function() {
		 * doSaveAndExitBatchInstrument(); });elt.appendTo($(strBtnRTRB));
		 */
		/** Commented as per requirement */
		$(strBtnRTRB).append("&nbsp;");	
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
	} else if (strAction === 'UPDATE' || strAction === 'UPDATEWITHERROR') {
		elt = createButton('btnUpdate', 'P');
		elt.click(function() {
					// doUpdateBatchInstrument();
					doUpdateAndExitBatchInstrument();
				});
		elt.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");

		/*
		 * elt = createButton('btnUpdateAndExit', 'P'); elt.click(function() {
		 * doUpdateAndExitBatchInstrument(); }); elt.appendTo($(strBtnRTRB));
		 */

		eltDiscard = createButton('btnDiscard', 'S');
		eltDiscard.click(function() {
					// doDiscardBatchInstrumentFromTxnWizard();
					getDiscardConfirmationPopup('Q');
				});

		$(strBtnRTRB).append("&nbsp;");
		/** Commented as per requirement */
		if (false) {
			if (canShow === true) {
				elt = createButton('btnUpdateAndAdd', 'P');
				elt.click(function() {
							doUpdateAndAddBatchInstrument();
						});
				elt.appendTo($(strBtnRTRB));
				$(strBtnRTRB).append("&nbsp;");
				// Kept false as we are showing pop-up on SAVEWITHERROR
				if (false && strAction === 'UPDATEWITHERROR') {
					elt = createButton('btnIgonreErrorAndAdd', 'P');
					elt.click(function() {
								doIgnoreErrorAndAddBatchInstrument();
							});
					elt.appendTo($(strBtnRTRB));
					$(strBtnRTRB).append("&nbsp;");
				}
			}
		}
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
		eltDiscard.appendTo($(strBtnLTLB));
	} else if (strAction === 'VIEW' || strAction === 'VIEWBATCHINST') {
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
		eltCancel.unbind('click');
		eltCancel.bind('click', function() {
					doScreenReadOnly(false);
					doCancelBatchInstrument(strAction);
				});
	} else if (strAction === 'CLOSE') {
		eltCancel = createButton('btnClose', 'S');
		eltCancel.click(function() {
					doCancelViewBatchInstrument();
				});
		eltCancel.appendTo($(strBtnLTLB));
	}
}
function doSaveBatchInstrument(blnPrdCutOff) {
	if (!doValidateAccounts())
		return false;
	var jsonData = generatePaymentInstrumentJson(), jsonArgs = {};
	var canSave = validateRequiredFields();
	jsonData.d.__metadata._headerId = strPaymentHeaderIde;
	if (blnPrdCutOff === true) {
		jsonData.d.receivableEntry.standardField.push({
					fieldName : 'prdCutoffFlag',
					value : 'Y'
				});
	}
	jsonArgs.action = 'SAVE';
	jsonArgs.jsonData = jsonData;
	doClearMessageSection();
	savePaymentInstrument(jsonData, postHandleSaveBatchInstrument, jsonArgs);
}

function doSaveAndExitBatchInstrument(blnPrdCutOff) {
	if (!doValidateAccounts())
		return false;
	var jsonData = generateReceivableInstrumentJson(), jsonArgs = {};
	var canSave = validateRequiredFields();
	jsonData.d.__metadata._headerId = strPaymentHeaderIde;
	if (blnPrdCutOff === true) {
		jsonData.d.receivableEntry.standardField.push({
					fieldName : 'prdCutoffFlag',
					value : 'Y'
				});
	}
	jsonArgs.action = 'SAVEANDEXIT';
	jsonArgs.jsonData = jsonData;
	doClearMessageSection();
	saveReceivableInstrument(jsonData, postHandleSaveBatchInstrument, jsonArgs);
}

function doUpdateBatchInstrument(blnPrdCutOff) {
	if (!doValidateAccounts())
		return false;
	var jsonData = generatePaymentInstrumentJson(), jsonArgs = {};
	var canSave = validateRequiredFields();
	jsonData.d.__metadata._headerId = strPaymentHeaderIde;
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
	savePaymentInstrument(jsonData, postHandleSaveBatchInstrument, jsonArgs);
}

function doUpdateAndExitBatchInstrument(blnPrdCutOff) {
	if (!doValidateAccounts())
		return false;
	var jsonData = generateReceivableInstrumentJson(), jsonArgs = {};
	var canSave = validateRequiredFields();
	jsonData.d.__metadata._headerId = strPaymentHeaderIde;
	jsonData.d.__metadata._detailId = strPaymentInstrumentIde;
	if (blnPrdCutOff === true) {
		jsonData.d.receivableEntry.standardField.push({
					fieldName : 'prdCutoffFlag',
					value : 'Y'
				});
	}
	jsonArgs.action = 'UPDATEANDEXIT';
	jsonArgs.jsonData = jsonData;
	doClearMessageSection();
	saveReceivableInstrument(jsonData, postHandleSaveBatchInstrument, jsonArgs);
}

function doSaveAndAddBatchInstrument(blnPrdCutOff) {
	if (!doValidateAccounts())
		return false;
	var jsonData = generatePaymentInstrumentJson(), jsonArgs = {};
	var canSave = validateRequiredFields();
	jsonData.d.__metadata._headerId = strPaymentHeaderIde;
	if (blnPrdCutOff === true) {
		jsonData.d.receivableEntry.standardField.push({
					fieldName : 'prdCutoffFlag',
					value : 'Y'
				});
	}
	jsonArgs.action = 'SAVEANDADD';
	jsonArgs.jsonData = jsonData;
	doClearMessageSection();
	savePaymentInstrument(jsonData, postHandleSaveBatchInstrument, jsonArgs);
}

function doUpdateAndAddBatchInstrument(blnPrdCutOff) {
	if (!doValidateAccounts())
		return false;
	var jsonData = generatePaymentInstrumentJson(), jsonArgs = {};
	var canSave = validateRequiredFields();
	jsonData.d.__metadata._headerId = strPaymentHeaderIde;
	jsonData.d.__metadata._detailId = strPaymentInstrumentIde;
	if (blnPrdCutOff === true) {
		jsonData.d.receivableEntry.standardField.push({
					fieldName : 'prdCutoffFlag',
					value : 'Y'
				});
	}
	jsonArgs.action = 'UPDATEANDADD';
	jsonArgs.jsonData = jsonData;
	doClearMessageSection();
	savePaymentInstrument(jsonData, postHandleSaveBatchInstrument, jsonArgs);
}
function doCancelBatchInstrument(strAction) {
	closeTransactionWizardPopup();
	blockPaymentUI(true);
	doClearMessageSection();
	blockPaymentUI(false);
	objInstrumentEntryGrid.refreshData();
}

function doCancelViewBatchInstrument(strAction) {
	closeViewTransactionWizardPopup();
	blockPaymentUI(true);
	doClearMessageSection();
	blockPaymentUI(false);
}

function doDiscardBatchInstrumentFromTxnWizard() {
	var strUrl = _mapUrl['gridGroupActionUrl'] + '/discard';
	var arrayJson = new Array();
	arrayJson.push({
				serialNo : paymentResponseInstrumentData.d.__metadata._serial,
				identifier : strPaymentInstrumentIde,
				userMessage : ''
			});
	doClearMessageSection();
	Ext.Ajax.request({
				url : strUrl,
				method : 'POST',
				jsonData : Ext.encode(arrayJson),
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
				success : function(jsonData) {
					if (jsonData && jsonData.d && jsonData.d.instrumentActions) {
						var arrResult = jsonData.d.instrumentActions;
						if (arrResult && arrResult.length == 1) {
							if (arrResult[0].success === 'Y') {

							} else if (arrResult[0].success === 'N') {
								doClearMessageSection();
								paintErrors(arrResult[0].errors);
							}
						}

					} else {
						if (typeof objInstrumentEntryGrid != 'undefined'
								&& objInstrumentEntryGrid) {
							objInstrumentEntryGrid.refreshData();
						}
						closeTransactionWizardPopup();
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
function postHandleSaveBatchInstrument(data, args) {
	var status = null, isBtnVisible = true;
	var intCounter = 1;
	var action = args.action;
	if (data && data.d) {
		if (data.d.receivableEntry && data.d.receivableEntry.message
				&& data.d.receivableEntry.message.success)
			status = data.d.receivableEntry.message.success;
		// This is used to handle the control total validation
		var blnFlag = doValidationForControlTotal();
		isBtnVisible = blnFlag ? isAddAnotherTxnButtonVisible(data) : true;

		if (status === 'SUCCESS' || status === 'SAVEWITHERROR') {
			if (data.d.receivableEntry && data.d.__metadata
					&& data.d.__metadata._detailId)
				strPaymentInstrumentIde = data.d.__metadata._detailId;
			if (data.d.receivableEntry && data.d.__metadata
					&& data.d.__metadata._headerId)
				strPaymentHeaderIde = data.d.__metadata._headerId;
			toggleDirtyBit(true);
			//Performance
			/*if (data.d.receivableEntry && data.d.receivableEntry.receivableHeaderInfo)
			 {
			 populatePaymentHeaderViewOnlySection(null,
			 data.d.receivableEntry.receivableHeaderInfo, 'Y', 'EDIT');
			
			 updatePaymentSummaryHeaderInfo(data.d.receivableEntry.receivableHeaderInfo);
						}*/

			if (!isEmpty(data.d.receivableEntry.message.pirNo)) {
				var msgDtls = {
					'pirNo' : data.d.receivableEntry.message.pirNo,
					'uniqueRef' : data.d.receivableEntry.message.uniqueRef,
					'txnReference' : $('#referenceNo').val()
				};
				// paintSuccessMsg(msgDtls, 'Q');
			}
			if (status === 'SUCCESS' || status === 'SAVEWITHERROR') {
				switch (action) {
					case 'SAVE' :
						paintPaymentBatchInstrumentActions('UPDATE',
								isBtnVisible);
						doClearMessageSection();
						break;
					case 'UPDATE' :
						paintPaymentBatchInstrumentActions('UPDATE',
								isBtnVisible);
						doClearMessageSection();
						break;
					case 'SAVEANDADD' :
					case 'UPDATEANDADD' :
						if (status !== 'SAVEWITHERROR') {
							postHandleSaveAndAddInstrument();
						}
						break;
					case 'SAVEANDEXIT' :
					case 'UPDATEANDEXIT' :
						if (status !== 'SAVEWITHERROR') {
							postHandleSaveAndExitInstrument();
						}
						var blnShowProdEnrichment = getProductEnrichmentError(data.d.receivableEntry.message.errors);
						if(blnShowProdEnrichment == true)
						{
							if (data.d.receivableEntry.enrichments.bankProductMultiSet && data.d.receivableEntry.enrichments.bankProductMultiSetMetadata) 
							{
								paintPaymentBankProductMultiSetEnrichments(data.d.receivableEntry.enrichments.bankProductMultiSet,
										data.d.receivableEntry.enrichments.bankProductMultiSetMetadata, intCounter,
										'bankProductMultiSetEnrichDiv', 'Q');
								isVisible = true;
								isEnrichAvailable = true;
								paymentResponseInstrumentData.d.receivableEntry.enrichments.bankProductMultiSet = 
																data.d.receivableEntry.enrichments.bankProductMultiSet;
								paymentResponseInstrumentData.d.receivableEntry.enrichments.bankProductMultiSetMetadata = 
																data.d.receivableEntry.enrichments.bankProductMultiSetMetadata;
							}
							if (data.d.receivableEntry.enrichments.productEnrichment && data.d.receivableEntry.enrichments.productEnrichment.parameters) 
							{
								var strTargetId = 'addendaInfoEnrichDiv';
								mapEnrichSet = {};
								paintPaymentEnrichmentAsSetName(mapEnrichSet, 
										data.d.receivableEntry.enrichments.productEnrichment.parameters, strTargetId);
								isVisible = true;
								isEnrichAvailable = true;
								paymentResponseInstrumentData.d.receivableEntry.enrichments.productEnrichment = 
																data.d.receivableEntry.enrichments.productEnrichment;
								paymentResponseInstrumentData.d.receivableEntry.enrichments.productEnrichment.parameters = 
																data.d.receivableEntry.enrichments.productEnrichment.parameters;
							}
						}
						break;
					default :
						break;
				}
				if (action === 'SAVE' || action === 'UPDATE'
						|| action === 'SAVEANDADD' || action === 'UPDATEANDADD'
						|| action === 'SAVEANDEXIT'
						|| action === 'UPDATEANDEXIT') {
					if (!isEmpty(data.d.receivableEntry.receivableHeaderInfo)) {
						var payHeaderInfo = data.d.receivableEntry.receivableHeaderInfo;
						var flagControlTotal = doValidationForControlTotal();
						// Update control total amount and number of instruments
						// if control total validation is not set.
						if ((!isEmpty(payHeaderInfo.hdrTotalNo))
								&& (!isEmpty(payHeaderInfo.totalAmount))
								&& !flagControlTotal) {
							$('#totalNoHdr').val(payHeaderInfo.hdrTotalNo);
							$('#amountHdr').val(payHeaderInfo.totalAmount);
						}
						if ((!isEmpty(payHeaderInfo.hdrStatus)))
							$('.batchStatusText').html(("Batch Status : ")
										+ payHeaderInfo.hdrStatus || '');
					}
				}
				if (status === 'SAVEWITHERROR') {
					if (data.d.receivableEntry.message.errors)
						paintErrors(data.d.receivableEntry.message.errors);
					if (action === 'SAVEANDADD' || action === 'UPDATEANDADD'
							|| action === 'SAVEANDEXIT'
							|| action === 'UPDATEANDEXIT') {
						paintPaymentBatchInstrumentActions('UPDATEWITHERROR',
								isBtnVisible);
						doShowSaveWithErrorConfirmationDialog(action);
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
					showAlert(160, 350, strTitle, strMsg,
							handleProductCutOffBatchInstrument, args);
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
function handleProductCutOffBatchInstrument(blnCanContinue, args) {
	var strAction = args.action;
	if (blnCanContinue && strAction) {
		switch (strAction) {
			case 'SAVE' :
				doSaveBatchInstrument(true);
				break;
			case 'UPDATE' :
				doUpdateBatchInstrument(true);
				break;
			case 'SAVEANDADD' :
				doSaveAndAddBatchInstrument(true);
				break;
			case 'UPDATEANDADD' :
				doUpdateAndAddBatchInstrument(true);
				break;
			case 'SAVEANDEXIT' :
				doSaveAndExitBatchInstrument(true);
				break;
			case 'UPDATEANDEXIT' :
				doUpdateAndExitBatchInstrument(true);
				break;
		}
	}
}
function doShowSaveWithErrorConfirmationDialog(action) {
	var strTitle = mapLbl['warnMsg'], strMsg = mapLbl['saveWithErrorMsg'];
	// showAlert(140, 300, strTitle, strMsg, doIgnoreErrorAndHandleNextAction,
	// action);
}
function doIgnoreErrorAndHandleNextAction(blnCanContinue, action) {
	if (blnCanContinue) {
		if (action === 'SAVEANDEXIT' || action === 'UPDATEANDEXIT') {
			postHandleSaveAndExitInstrument();
		} else if (action === 'SAVEANDADD' || action === 'UPDATEANDADD') {
			blockPaymentInstrumentUI(true);
			postHandleSaveAndAddInstrument();
		}
	}
}
function postHandleSaveAndAddInstrument() {
	strPaymentInstrumentIde = '';
	resetInstrumentForm();
	loadPaymentBatchInstrumentFields(strPaymentHeaderIde);
}

function postHandleSaveAndExitInstrument() {
	strPaymentInstrumentIde = '';
	closeTransactionWizardPopup();
	if (typeof objInstrumentEntryGrid != 'undefined' && objInstrumentEntryGrid) {
		objInstrumentEntryGrid.refreshData();
	}
}
function doHandleEntryGridLoading(isViewOnly, isGridActionEnabled) {
	if (typeof objInstrumentEntryGrid != 'undefined' && objInstrumentEntryGrid) {
		objInstrumentEntryGrid.refreshData();
	} else {
		loadPaymentBatchInstrumentFieldsForGridLayout(strPaymentHeaderIde);
		doCreateInstrumentEntryGrid(instrumentEntryGridRowData,
				chrAllowGridLayoutEntry, isViewOnly, strIdentifier,
				isGridActionEnabled);
	}
}
function handleBatchDetailGridRowAction(grid, rowIndex, columnIndex, action,
		event, record) {
	var strAction = action;
	var strInstIdentifier = null, strPaintAction = null, strDivId = null, strButtonMask = null, strRightsMask = null, strActionMask = null;
	var grid = getInstrumentGrid();

	if (record) {
		if (record.data && record.data.__metadata
				&& record.data.__metadata._detailId)
			strInstIdentifier = record.data.__metadata._detailId;
		if (record.store && record.store.proxy && record.store.proxy.reader
				&& record.store.proxy.reader.jsonData
				&& record.store.proxy.reader.jsonData.d
				&& record.store.proxy.reader.jsonData.d.__metadata
				&& record.store.proxy.reader.jsonData.d.__metadata._buttonMask)
			strButtonMask = record.store.proxy.reader.jsonData.d.__metadata._buttonMask;

		if (record.data && record.data.__metadata && record.data.__metadata
				&& record.data.__metadata.__rightsMap)
			strRightsMask = record.data.__metadata.__rightsMap;

		var maskArray = new Array();
		maskArray.push(strButtonMask);
		maskArray.push(strRightsMask);
		var intMaskSize = !isEmpty(strButtonMask)
				? strButtonMask.length
				: (!isEmpty(strRightsMask) ? strRightsMask.length : 0);
		strActionMask = doAndOperation(maskArray, intMaskSize);
	}
	if (!isEmpty(strInstIdentifier) && !isEmpty(strAction)) {
		doClearMessageSection();
		resetInstrumentForm();
		strPaymentInstrumentIde = '';
		if (strAction === 'btnEdit')
			strPaintAction = 'UPDATE';
		else if (strAction === 'btnView') {
			strDivId = 'transactionWizardViewPopup';
			strPaintAction = 'VIEW';
		} else if (strAction === 'btnError') {
			strPaintAction = 'ERROR';
		}

		if (strPaintAction === 'VIEW' || strPaintAction === 'UPDATE') {
			var instGrid = getInstrumentGrid();
			if (strPaintAction === 'VIEW') {
				if (instGrid) {
					toggleInstrumentPagination(strPaintAction);
					updatePagingParamsView(instGrid.getRowNumber(rowIndex + 1),
							instGrid.store.getCount());
					if(instGrid.store.getCount() === 1){
						$('.previousTxn').addClass('button-grey-effect');
						$('.nextTxn').addClass('button-grey-effect');
					}
				}
			}
			if (strPaintAction === 'UPDATE') {
				$('.instrumentEditPaginationBar').removeClass('hidden');
				if (instGrid) {
					toggleInstrumentPagination(strPaintAction);
					updatePagingParamsEdit(instGrid.getRowNumber(rowIndex + 1),
							instGrid.store.getCount());
					if(instGrid.store.getCount() === 1){
						$('.previousTxnUpdate').addClass('button-grey-effect');
						$('.nextTxnUpdate').addClass('button-grey-effect');
					}
				}
			}
			showTransactionWizardPopup(strInstIdentifier, strPaintAction,
					strDivId, strActionMask);
		}
	}
}
function toggleInstrumentPagination(strMode) {
	var classSuffix = strMode === 'UPDATE' ? 'Update' : '';
	$('.previousTxn' + classSuffix).unbind('click').bind('click', function() {
				handleInstrumentPagination(-1, strMode);
			});
	$('.nextTxn' + classSuffix).unbind('click').bind('click', function() {
				handleInstrumentPagination(1, strMode);
			});
}
function updatePagingParamsEdit(intCurrentIndex, intTotalRows) {
	$('.currentPageUpdate').html(intCurrentIndex);
	$('.totalPagesUpdate').html(intTotalRows);
}
function updatePagingParamsView(intCurrentIndex, intTotalRows) {
	$('.currentPage').html(intCurrentIndex);
	$('.totalPages').html(intTotalRows);
	if(intCurrentIndex === 1){
		$(".previousTxn").addClass('button-grey-effect');
		$(".nextTxn").removeClass('button-grey-effect');
	} else if(intCurrentIndex === intTotalRows){
		$(".previousTxn").removeClass('button-grey-effect');
		$(".nextTxn").addClass('button-grey-effect');
	} else {
		$(".previousTxn").removeClass('button-grey-effect');
		$(".nextTxn").removeClass('button-grey-effect');
	}
}

function handleInstrumentPagination(intCount, strMode) {
	var classSuffix = (strMode === 'UPDATE') ? 'Update' : '';
	var intCurrentInst = parseInt($($('.currentPage' + classSuffix)[0]).text(),10);
	var grid = getInstrumentGrid();
	var intMoveTo = 0, record, strInstIdentifier;
	if (grid) {
		intMoveTo = intCurrentInst + intCount;
		record = grid.getRecord(intMoveTo);
		if (record) {
			if (record && record.data && record.data.__metadata
					&& record.data.__metadata._detailId)
				strInstIdentifier = record.data.__metadata._detailId;
			if (strInstIdentifier) {
				strPaymentInstrumentIde = '';
				doClearMessageSection();
				blockPaymentInstrumentUI(true);
				if (strMode === 'UPDATE') {
					editPaymentBatchInstrument(strInstIdentifier, 'UPDATE');
					updatePagingParamsEdit(intMoveTo, grid.store.getCount());
				} else if (strMode === 'VIEW') {
					viewPaymentBatchInstrument(strInstIdentifier, 'VIEW');
					updatePagingParamsView(intMoveTo, grid.store.getCount());
				}
			}
		}

	}
}
function getInstrumentGrid() {
	var grid = null;
	if (typeof objInstrumentEntryGrid != 'undefined' && objInstrumentEntryGrid) {
		grid = objInstrumentEntryGrid.getGrid();
	}
	return grid;
}
// ========================== Payment Instrument Handling Ends =================

// ========Import Transactions Using File Upload Starts ================

function showImportTransactionsPopup() {
	$("#importTransactionPopup").dialog({
		modal : true,
		maxHeight : 550,
		width : 735,
		resizable : false,
		draggable : false,
		title : 'Import Transactions',
		/*buttons : {
			Cancel : function() {
				$(this).dialog("close");
			}*//*
				 * , Import : function() { doUploadFile(); }
				 */
		/*},*/
		open : function(event, ui) {
			//$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset button').addClass('receiverselection-footer-button import-transactions-xbtn-left');
			populateClientMapCodeField();
			$('#importTxn_btnUpload').unbind("click");
			$('#importTxn_btnUpload').bind("click", function() {
						doUploadFile();
					});
				$('#txnDetailsGridDiv').empty();
				txnDetailsGrid = createTxnDetailsGrid('txnDetailsGridDiv',strPaymentHeaderIde);
		},
		close : function(event, ui) {
			if (typeof objInstrumentEntryGrid != 'undefined'
					&& objInstrumentEntryGrid) {
			//	objInstrumentEntryGrid.refreshData();
			}
		}
	});
}
function closeImportTransactionsPopup() {
	$('#importTransactionPopup').dialog('close');
}
function populateClientMapCodeField() {
	var strData = {};
	
	strData["identifier"] = strPaymentHeaderIde;
    strData[csrfTokenName] = csrfTokenValue;
    $.ajax({
				url : 'services/ach/mapcodelist.json',
				data : strData,
				type : 'POST',
				success : function(responseData) {
					if (!isEmpty(responseData)) {
						var data = responseData;
						var el = $("#clientMapCode");
						$(el).empty();
						for (index = 0; index < data.length; index++) {
							obj = data[index];
							Object.keys(obj).forEach(function(key)
							{
								var opt = $('<option />', {
									value : key,
									text : obj[key]
								});
							opt.attr('selected', 'selected');
							opt.appendTo(el);
							});
						}
					}
				}
			});
}
function doUploadFile() {
	var data = new FormData();
	data.append("file",
			document.getElementById('transactionImportFile').files[0]);
	data.append("clientMapCode", $('#clientMapCode').val());
	data.append("is", $('input[name=processParameterBean]:checked').val());
	blockPaymentUI(true);
	$.ajax({
		url : _mapUrl['fileUploadUrl'] + "(" + strPaymentHeaderIde + ").json",
		type : "POST",
		data : data,
		processData : false,
		contentType : false,
		complete : function(XMLHttpRequest, textStatus) {
			if ("error" == textStatus) {
				var arrError = new Array();
				arrError.push({
							"errorCode" : "Message",
							"errorMessage" : mapLbl['unknownErr']
						});
				closeImportTransactionsPopup();
				paintErrors(arrError);
			}
		},
		success : function(data) {
			if (data && data.d && data.d.success === 'SUCCESS') {
				closeImportTransactionsPopup();
				readPaymentHeaderForEdit(strPaymentHeaderIde, strIdentifier);
				blockPaymentUI(false);
				$('#spanHdrFileUploadRemark').text(data.d.remarks);
			} else if (data && data.d && data.d.success === 'FAILED') {
				closeImportTransactionsPopup();
				if (data.d.message) {
					paintErrors(data.d.message.errors);
				}
				blockPaymentUI(false);
				$('#spanHdrFileUploadRemark').text(data.d.remarks);
			} else {
				pollForFileUpload = true;
				closeImportTransactionsPopup();
				readPaymentHeaderForView(strPaymentHeaderIde, strIdentifier);
				// doHandleFileUploadStatus();
				blockPaymentUI(false);
				$('#paymentHdrActionButtonListRT,#paymentHdrActionButtonListRB')
						.empty();

			}
		}
	});
}

function doHandleFileUploadStatus() {
	$.ajax({
		url : _mapUrl['fileUploadStatusUrl'] + "(" + strPaymentHeaderIde
				+ ").json",
		type : "POST",
		async : false,
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

		success : function(data) {
			if ((data && data.d && data.d.success === 'INPROGRESS')) {
				if (isBatchViewMode === false)
					closeImportTransactionsPopup();
				pollForFileUpload = true;
				readPaymentHeaderForView(strPaymentHeaderIde, strIdentifier);
				$('#paymentHdrActionButtonListRT,#paymentHdrActionButtonListRB')
						.empty();
			} else if ((data && data.d && data.d.success === 'SUCCESS')) {
				closeImportTransactionsPopup();
				if (isBatchViewMode === false)
					readPaymentHeaderForEdit(strPaymentHeaderIde, strIdentifier);
				if (isBatchViewMode === true)
					readPaymentHeaderForView(strPaymentHeaderIde, strIdentifier);
				if (data && data.d && data.d.remarks) {
					$('#spanHdrFileUploadRemark').text(data.d.remarks);
				}
			} else if ((data && data.d && data.d.success === 'FAILED')) {
				$('#spanHdrFileUploadRemark').empty();
				pollForFileUpload = false;
				closeImportTransactionsPopup();
				blockPaymentUI(false);
				if (data && data.d && data.d.remarks) {
					$('#spanHdrFileUploadRemark').text(data.d.remarks);
				}
			}
		}
	});
}

function importPopup()
{
	doUploadFile();
}

function toggleMoreLessText(me){
	$(".moreCriteria").toggleClass("hidden");
	if($('.moreCriteria').is(':visible')) {
		$(me).text(getLabel('lblHideImportHeader',
				"Hide Import Transaction Details"));
	}
	else{
		$(me).text(getLabel('lblShowImportHeader',
				"Show Import Transaction Details"));
	}
}

// =============Import Transactions Using File Upload Ends=================
function doHandlePaymentHeaderActions(strAction, strRemarks) {
	var arrayJson = new Array(), strMsg = '';
	var strUrl = _mapUrl['batchHeaderActionUrl'] + '/' + strAction + '.json';
	arrayJson.push({
				serialNo : 0,
				identifier : strPaymentHeaderIde,
				userMessage : isEmpty(strRemarks) ? '' : strRemarks
			});
	
	Ext.Ajax.request({
		url : strUrl,
		type : "POST",
		async : false,
		jsonData : Ext.encode(arrayJson),
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
		success : function(jsonData) {
			var jsonRes = Ext.JSON.decode(jsonData.responseText);
			if (jsonRes && jsonRes.d && jsonRes.d.instrumentActions) {
				var arrResult = jsonRes.d.instrumentActions;
				if (arrResult && arrResult.length == 1) {
					if (arrResult[0].success === 'Y') {
						goToPage(_mapUrl['cancelBatchUrl'], 'frmMain');
					} else if (arrResult[0].success === 'N') {
						if (arrResult[0].errors) {
							var arrError = arrResult[0].errors, isProductCutOff = false, isFxRateError = false, errCode = null;
							if (arrError && arrError.length > 0) {
								$.each(arrError, function(index, error) {
											strMsg = strMsg + error.code
													+ ' : '
													+ error.errorMessage;
											errCode = error.code;
											if (errCode
													&& (errCode.toUpperCase()
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
										|| strAction === 'submit'
										|| strAction === 'send') {
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
								showreceivableEntryCutoffAlert(
										160,
										350,
										strTitle,
										strMsg,
										postHandlePaymentHeaderActionsProductCutOff,
										args);
							} else {
								doClearMessageSection();
								// paintErrors(arrError);
								paintErrors(arrResult[0].errors);
								blockPaymentUI(false);
							}
						}
					} else if(arrResult[0].success === 'FX'){
						if (arrResult[0].errors) {
							var arrError = arrResult[0].errors, isFxRateError = false, errCode = null;
							if (arrError && arrError.length > 0) {
								$.each(arrError, function(index, error) {
											strMsg = strMsg + error.code
													+ ' : '
													+ error.errorMessage;
											errCode = error.code;
											if (errCode && errCode.indexOf('SHOWPOPUP') != -1) {
													isFxRateError = true;
											}
										});
							}
							if (isFxRateError) {
							if(isNaN(fxTimer))  fxTimer = 10;
							countdown_number = 60*fxTimer;
								countdownTriggerOnEntry(arrResult[0].paymentFxInfo,
										strAction,errCode);
							}
							 else {
								doClearMessageSection();
								paintErrors(arrResult[0].errors);
								blockPaymentUI(false);
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

function postHandlePaymentHeaderActionsProductCutOff(strAction, args,
		strRemarks) {
	doHandlePaymentHeaderActions(strAction, 'Y');
}


function getProductEnrichmentError(arrError)
{
	var strErrorCode = '';
	var blnIsProdEnrichmentVisible = false;
	if (arrError && arrError.length > 0) 
	{
		$.each(arrError, function(index, error) 
			{
				strErrorCode = error.errorCode || error.code;
				if (!isEmpty(strErrorCode)) 
				{
					if (strErrorCode == 'ENR-00012') 
					{
						blnIsProdEnrichmentVisible = true;
					} 
					else 
					{
						blnIsProdEnrichmentVisible = false;
					}
				}
			});
	}
	return blnIsProdEnrichmentVisible;
}
function populatePreliqFields(data)
{
	var objHdrInfo = data && data.d && data.d.instruments[0] 
			&& data.d.instruments[0].receivableHeaderInfo
			? data.d.instruments[0].receivableHeaderInfo
			: null;
	var arrStdFields = data && data.d && data.d.instruments[0] 
			&& data.d.instruments[0].standardField
			? data.d.instruments[0].standardField
			: null;
	var strFieldName = null, strValue = null, strPostFix = '_HdrInfo', ctrl = null, ctrlDiv = null, cfgAmount = null;
	if (arrStdFields) {
		$.each(arrStdFields, function(index, cfg) {
			strFieldName = cfg.fieldName;
			strValue = getValueToDispayed(cfg);
			strValue = !isEmpty(strValue) ? strValue : '';
			ctrl = $('.' + strFieldName + strPostFix);
			ctrlDiv = $('.' + strFieldName + strPostFix + 'Div');
			if (ctrl && ctrlDiv && ctrlDiv.hasClass('hidden'))
				ctrlDiv.removeClass('hidden');
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
				
			} else if (strFieldName === 'drCrFlag') {
				handleDrCrFlagOnViewPaymentHeader(cfg, strPostFix, strValue);
			} else if (strFieldName === 'txnDate') {
				$(".txnDateInfoDiv").removeClass('hidden');
				ctrl.html(strValue || '');
			} else if (strFieldName === 'amount') {
				cfgAmount = cfg;
				strValue = cfg.formattedValue ? cfg.formattedValue : strValue;
				ctrl.html(strValue || '');
			} else {
				ctrl.html(strValue || '');
			}
			
			toggleVirtualAccountDivs(strFieldName,strValue);
			
		});
	}
	
	$('#verificationStepDiv').hasClass('hidden')? $('#verificationStepDiv').removeClass('hidden'):"";
}
function toggleVirtualAccountDivs(strFieldName,strValue)
{
	
	if(strFieldName == 'virtualAccountNmbr')
	{
		if(strValue != "NA"){
			$(".virtualAccountNmbrDiv").removeClass('hidden');
		}else{
			$(".virtualAccountNmbrDiv").parent().remove();
		}
	}
	else if(strFieldName == 'virtualAccountRef')
	{
		if(strValue != "NA"){
			$(".virtualAccountRefDiv").removeClass('hidden');
		}else{
			$(".virtualAccountRefDiv").parent().remove();
		}
	}
	else if(strFieldName == 'virtualAccountId')
	{
		if(strValue != "NA"){
			$(".virtualAccountIdDiv").removeClass('hidden');
		}else{
			$(".virtualAccountIdDiv").parent().remove();
		}
	}
	else if(strFieldName == 'virtualAccountName')
	{
		if(strValue != "NA"){
			$(".virtualAccountNameDiv").removeClass('hidden');
		}else{
			$(".virtualAccountNameDiv").parent().remove();
		}
	}
}