/**
 * The paymentResponseHeaderData is used to hold the JSON response for
 * edit/view/add batch header
 */
var paymentResponseHeaderData = null;
var matrixNameGrid = null;
var txnDetailsGrid = null;
var txnWzErrorStatus = false ;
var txnAction = null ;
/**
 * The strPaymentHeaderIde is used to hold the batch hedaer identifier
 */
var strPaymentHeaderIde = null;
var strIdentifier = null;
var chrProductLevel = null;
var chrDateLevel = null;
var chrDebitAccountLevel = null;
var chrAllowGridLayoutEntry = 'N';
var objHeaderSaveResponseData = null;
var instrumentEntryGridRowData = null;
var pollForFileUpload = false;
var arrTemplateUsersHdr = [];
var blnUdeHeaderDisclaimerVisibiliity = false;
var intHdrDirtyBit = 0;
var gridFocusOut = false ;
var isButtonClicked = false ;
var userSelectedDestinationCurrency = null;

function loadPaymentHeaderFields(strMyProduct) {
	// blockPaymentUI(true);
	var objData = '';
	if (!isEmpty(strMyProduct)) {
		var url = _mapUrl['loadBatchHeaderFieldsUrl'] + "/" + strMyProduct
				+ ".json";
		if(!isEmpty(strSelectedReceiver) && strLayoutType === 'TAXLAYOUT'){
			url = _mapUrl['loadBatchHeaderFieldsUrl'] + "/" + strMyProduct + 
				"/" + strSelectedReceiver + "/" + strPaymentCategory + ".json"
		}
		if(strLayoutType === 'BILLPAYLAYOUT'){
			url = _mapUrl['loadBatchHeaderFieldsUrl'] + "/billPay/" + strMyProduct + "/" + strSelectedReceiver
			+ ".json";
			objData = strSelectedBills;
		}
		$.ajax({
			type : "POST",
			url : url,
			async : false,
			contentType : "application/json",
			data : objData,
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
						jsonArgs = {};
						jsonArgs.action = 'SAVE';
						doRemoveStaticText("paymentHeaderEntryStep2");
						paintPaymentHeaderUI(data);
						initatePaymentHeaderValidation();
						paymentHeaderEnrichmentValidation();
						postHandleLoadPaymentHeaderFields(data, jsonArgs);
						blockPaymentUI(false);
						handleEmptyEnrichmentDivs();
						doHandleEntryGridLoading(false, true);
						toggleHeaderDirtyBit(true);
						populateApiEnrichmentType(data);
					}
				}
			}
		});
	} else {
		doHandleUnknownErrorForBatch();
		blockPaymentUI(false);
	}
}
function postHandleLoadPaymentHeaderFields(data, args) {
	var status = 'SUCCESS', strPirNo = null, strUniqueRef = null;
	var action = args.action;
	if (data && data.d) {
		if (!isEmpty(status) && status === 'SUCCESS'
				|| status === 'SAVEWITHERROR') {
			if (status === 'SUCCESS'
					&& (action === 'SAVE' || action === 'UPDATE') && data.d.paymentEntry) {
				arrFields = data.d.paymentEntry.standardField || [];
				doClearMessageSection();

			}
			if (data.d.paymentEntry && data.d.__metadata
					&& data.d.__metadata._headerId)
				strPaymentHeaderIde = data.d.__metadata._headerId;
			if (!isEmpty(strLayoutType) && strLayoutType !== 'ACHLAYOUT'
					&& strLayoutType !== 'TAXLAYOUT')
				doHandlePaymentProrductToggle(data);
			paintPaymentHeaderActions('EDIT');
			togglerPaymentHederScreen(true);
			if(data && data.d && data.d.__metadata && data.d.__metadata._txnImportEnabled){
				var chrTxnImportAllowed = data.d.__metadata._txnImportEnabled
						? data.d.__metadata._txnImportEnabled : "N";
				if(!isEmpty(strImportTxnFlag))
					chrTxnImportAllowed = chrTxnImportAllowed === strImportTxnFlag ? 'Y' : 'N';
				toggleImportEntryOption(chrTxnImportAllowed);	
			}

		}  else if (isEmpty(status) && data.d.paymentEntry.message.errors) {
			doClearMessageSection();
			paintErrors(data.d.paymentEntry.message.errors);
			blockPaymentUI(false);
		}
	}
}
function readPaymentHeaderForEdit(strParentIde, strPhdNumber, headerSiltentUpdateRequire) {
	if (!isEmpty(strParentIde)) {
		var url = _mapUrl['readSavedBatchHeaderUrl'] + "/id.json";
		var jsonData = {'$id' : strParentIde};
		blockPaymentUI(true);
		$.ajax({
			type : "POST",
			url : url,
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
						strIdentifier = strPhdNumber;
						strPaymentHeaderIde = strParentIde;
						paymentResponseHeaderData = data;
						objHeaderSaveResponseData = data;
						if (data) {
							if (data.d
									&& data.d.paymentEntry
									&& data.d.paymentEntry.paymentHeaderInfo
									&& data.d.paymentEntry.paymentHeaderInfo.phdnumber) {
								strIdentifier = data.d.paymentEntry.paymentHeaderInfo.phdnumber;
							}
							if (data.d && data.d.__metadata
									&& data.d.__metadata._headerId) {
								strPaymentHeaderIde = data.d.__metadata._headerId;
							}
						}
						doRemoveStaticText("paymentHeaderEntryStep2");
						paintPaymentHeaderUI(data);
						initatePaymentHeaderValidation();
						paymentHeaderEnrichmentValidation();
						togglerPaymentHederScreen(null ,data);
						if(isEmpty(headerSiltentUpdateRequire) || headerSiltentUpdateRequire)
                        {
                        toggleHeaderDirtyBit(true);
                        }
						/*populatePaymentHeaderViewOnlySection(
								paymentResponseHeaderData,
								data.d.paymentEntry.paymentHeaderInfo, 'Y',
								'EDIT');*/
						// TODO : To be handled
						/*
						 * if (data && data.d && data.d.paymentEntry &&
						 * data.d.paymentEntry.paymentHeaderInfo) { //
						 * updatePaymentSummaryInfo(data.d.paymentEntry.paymentHeaderInfo);
						 * paintPaymentMoreDetailInfo(data.d.paymentEntry.paymentHeaderInfo);
						 * if
						 * (data.d.paymentEntry.paymentHeaderInfo.fileUploadProgressFlag) {
						 * pollForFileUpload =
						 * (data.d.paymentEntry.paymentHeaderInfo.fileUploadProgressFlag
						 * === 1) } }
						 */
						// paintPaymentHeaderActions('EDITNEXT');
						if (data.d
								&& data.d.paymentEntry
								&& data.d.paymentEntry.message
								&& (data.d.paymentEntry.message.errors || data.d.paymentEntry.message.success === 'SAVEWITHERROR')) {
							paintErrors(data.d.paymentEntry.message.errors);
						}
						// Paint CashIn Errors
						if (data.d && data.d.paymentEntry
								&& data.d.paymentEntry.adminMessage
								&& data.d.paymentEntry.adminMessage.errors) {
							paintCashInErrors(data.d.adminMessage.errors)
						}
						blockPaymentUI(false);
						handleEmptyEnrichmentDivs();
						window.firstTimeRenderInProgress = true;
						doHandleEntryGridLoading(false, true);
						window.firstTimeRenderInProgress = false;
						if (data.d
								&& data.d.paymentEntry
								&& data.d.paymentEntry.templateApprovalMatrix){
							if($("#defineApprovalMatrixHdr").prop('checked') == true){
								defineAVMGrid('edit', 'B')
							}
						}
						strCloneAction = 'N';

					}
				}
				autoFocusOnFirstElement(null, 'frmMain', true);
			}
		});
	} else {
		doHandleUnknownErrorForBatch();
		blockPaymentUI(false);
	}
}
function refreshPaymentHeaderDataForEdit(strParentIde, strPhdNumber) {
	if (!isEmpty(strParentIde)) {
		var url = _mapUrl['readSavedBatchHeaderUrl'] + "/id.json";
		var jsonData = {'$id' : strParentIde};
		blockPaymentUI(true);
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
						strIdentifier = strPhdNumber;
						strPaymentHeaderIde = strParentIde;
						paymentResponseHeaderData = data;
						objHeaderSaveResponseData = data;
						if (data) {
							if (data.d
									&& data.d.paymentEntry
									&& data.d.paymentEntry.paymentHeaderInfo
									&& data.d.paymentEntry.paymentHeaderInfo.phdnumber) {
								strIdentifier = data.d.paymentEntry.paymentHeaderInfo.phdnumber;
							}
							if (data.d && data.d.__metadata
									&& data.d.__metadata._headerId) {
								strPaymentHeaderIde = data.d.__metadata._headerId;
							}
						}
						doRemoveStaticText("paymentHeaderEntryStep2");
						paintPaymentHeaderUI(data);
						initatePaymentHeaderValidation();
						paymentHeaderEnrichmentValidation();
						// togglerPaymentHederScreen(false);
						// populatePaymentHeaderViewOnlySection(
						// paymentResponseHeaderData,
						// data.d.paymentEntry.paymentHeaderInfo, 'Y');
						// TODO : To be handled
						/*
						 * if (data && data.d && data.d.paymentEntry &&
						 * data.d.paymentEntry.paymentHeaderInfo) { //
						 * updatePaymentSummaryInfo(data.d.paymentEntry.paymentHeaderInfo);
						 * paintPaymentMoreDetailInfo(data.d.paymentEntry.paymentHeaderInfo);
						 * if
						 * (data.d.paymentEntry.paymentHeaderInfo.fileUploadProgressFlag) {
						 * pollForFileUpload =
						 * (data.d.paymentEntry.paymentHeaderInfo.fileUploadProgressFlag
						 * === 1) } }
						 */
						// paintPaymentHeaderActions('EDITNEXT');
						if (data.d
								&& data.d.paymentEntry
								&& data.d.paymentEntry.message
								&& (data.d.paymentEntry.message.errors || data.d.paymentEntry.message.success === 'SAVEWITHERROR')) {
							paintErrors(data.d.paymentEntry.message.errors);
						}
						// Paint CashIn Errors
						if (data.d && data.d.paymentEntry
								&& data.d.paymentEntry.adminMessage
								&& data.d.paymentEntry.adminMessage.errors) {
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
function checkIfConfidentialJSON(object)
{
	var data = JSON.stringify(object);
	
	if( data != null && data != "" && data.indexOf('--CONFIDENTIAL--') !== -1 )
	{
		if($('#downLoadNachaDiv').length > 0)
			$('#downLoadNachaDiv').addClass('hidden');
	}
}
function readPaymentHeaderForView(strParentIde, strPhdNumber) {
	if (!isEmpty(strParentIde)) {
		var url = _mapUrl['readViewBatchHeaderUrl'] + "/id.json";
		var jsonData = {'$id' : strParentIde};
		blockPaymentUI(false);
		$.ajax({
			type : "POST",
			url : url,
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
						strIdentifier = strPhdNumber;
						strPaymentHeaderIde = strParentIde;
						paymentResponseHeaderData = data;
						if(data && data.d && data.d.paymentEntry)
						{
							checkIfConfidentialJSON(data.d.paymentEntry);
						}
						objHeaderSaveResponseData = data;
						if (data) {
							if (data.d
									&& data.d.paymentEntry
									&& data.d.paymentEntry.paymentHeaderInfo
									&& data.d.paymentEntry.paymentHeaderInfo.phdnumber) {
								strIdentifier = data.d.paymentEntry.paymentHeaderInfo.phdnumber;
							}
							if (data.d && data.d.__metadata
									&& data.d.__metadata._headerId) {
								strPaymentHeaderIde = data.d.__metadata._headerId;
							}
						}
						// TODO : To be verified if needs to be handled in view
						/*
						 * if (data && data.d && data.d.paymentEntry &&
						 * data.d.paymentEntry.paymentHeaderInfo) { //
						 * updatePaymentSummaryInfo(data.d.paymentEntry.paymentHeaderInfo);
						 * paintPaymentMoreDetailInfo(data.d.paymentEntry.paymentHeaderInfo);
						 * if
						 * (data.d.paymentEntry.paymentHeaderInfo.fileUploadProgressFlag) {
						 * pollForFileUpload =
						 * (data.d.paymentEntry.paymentHeaderInfo.fileUploadProgressFlag
						 * === 1) } }
						 */
						doViewPaymentHeader();
						if (data.d.paymentEntry.paymentHeaderInfo.hdrModule == strEntityType  && canEdit == 'true') {
							var hdrActionState = data.d.paymentEntry.paymentHeaderInfo.hdrActionStatus;
							if (hdrActionState == '101' || hdrActionState == '80') {
								paintPaymentHeaderActionsForView('SUBMIT')
							} else if (hdrActionState == '33'
									|| (data.d.paymentEntry.paymentHeaderInfo.pirMode === 'SI' && hdrActionState == '4')) {
								paintPaymentHeaderActionsForView('CANCELDISABLE')
							} else if (hdrActionState == '82'
									|| (data.d.paymentEntry.paymentHeaderInfo.pirMode === 'SI' && hdrActionState == '13')) {
								paintPaymentHeaderActionsForView('CANCELENABLE')
							} else if (hdrActionState == '0'
									|| hdrActionState == '101'
									// || hdrActionState == '2'
									|| (data.d.paymentEntry.paymentHeaderInfo.pirMode != 'SI' && hdrActionState == '4')
									|| (data.d.paymentEntry.paymentHeaderInfo.pirMode != 'SI' && hdrActionState == '5')
									|| hdrActionState == '86'
									|| hdrActionState == '87'
									|| hdrActionState == '94'
									|| hdrActionState == '95'
									|| hdrActionState == '79'
									|| hdrActionState == '80'
									|| hdrActionState == '73'
									|| (data.d.paymentEntry.paymentHeaderInfo.pirMode == 'SI' && hdrActionState == '9')
									|| (data.d.paymentEntry.paymentHeaderInfo.pirMode == 'SI' && hdrActionState == '10')) {
								paintPaymentHeaderActionsForView('CANCELANDDISCARD');
							} else {
								paintPaymentHeaderActionsForView('CANCELONLY');
							}
						} else {
							paintPaymentHeaderActionsForView('CANCELONLY');
						}
						toggleBreadCrumbs('tab_3');
						if (data.d.paymentEntry.paymentHeaderInfo.hdrActionsMask) {
							var strAuthLevel = data.d.paymentEntry.paymentHeaderInfo.authLevel;
							var strDetailId = data.d.__metadata._detailId;
							var strParentId = data.d.paymentEntry.paymentHeaderInfo.hdrIdentifier
							paintPaymentDetailGroupActions(
									data.d.paymentEntry.paymentHeaderInfo.hdrActionsMask,
									'VIEW', strAuthLevel, strParentId,
									strDetailId, data.d.paymentEntry.paymentHeaderInfo.showPaymentAdvice,data.d.paymentEntry.paymentHeaderInfo.recKeyValidation
									,data.d.paymentEntry.paymentHeaderInfo);
						}
						if (data.d.paymentEntry.paymentMetaData.accTrfType) {
							gAmountTransferType = data.d.paymentEntry.paymentMetaData.accTrfType;
						}
						populatePaymentHeaderVerifyScreen(
								paymentResponseHeaderData,
								paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo,
								'Y', true,true);
						
						
						if (data.d
								&& data.d.paymentEntry
								&& data.d.paymentEntry.message
								&& (data.d.paymentEntry.message.errors || data.d.paymentEntry.message.success === 'SAVEWITHERROR' || data.d.paymentEntry.message.success === 'SUCCESS')) {
							paintErrors(data.d.paymentEntry.message.errors);
						}
						
						// Paint CashIn Errors
						if (data.d && data.d.paymentEntry
								&& data.d.paymentEntry.adminMessage
								&& data.d.paymentEntry.adminMessage.errors) {
							paintCashInErrors(data.d.adminMessage.errors)
						}
						blockPaymentUI(false);
						doHandleEntryGridLoading(true, true);
					}
				}
			}
		});
	} else {
		doHandleUnknownErrorForBatch();
		blockPaymentUI(false);
	}
}
function repaintPaymentHeaderFields() {
	var jsonData = generatePaymentHeaderJson(), jsonArgs = {}, isSuccess = false, isSilent=true;
	//To handle effective date validation
	jsonData.d.paymentEntry.standardField.push({
			fieldName : 'bankPrdChangedFlag',
			value : 'Y'
		});
	changeHdrButtonVisibility();
	jsonArgs.action = 'UPDATE';
	var strUrl = _mapUrl['saveBatchHeaderUrl'];
	$.ajax({
				url : strUrl,
				type : 'POST',
				contentType : "application/json",
				async : false,
				data : JSON.stringify(jsonData),
				complete : function(XMLHttpRequest, textStatus) {
					if ("error" == textStatus) {
						var arrError = new Array();
						arrError.push({
									"errorCode" : "Message",
									"errorMessage" : mapLbl['unknownErr']
								});
						if (!isSilent)
							paintErrors(arrError);
					}
				},
				success : function(data) {
					var status = null;
					paymentResponseHeaderData = data;
					if (data.d.paymentEntry && data.d.paymentEntry.message
							&& data.d.paymentEntry.message.success) {
						status = data.d.paymentEntry.message.success;
						status = status.toUpperCase();
					}
					if (!isEmpty(strLayoutType)
							&& strLayoutType !== 'ACHLAYOUT'
							&& strLayoutType !== 'TAXLAYOUT')
						doHandlePaymentProrductToggle(data);
					if (data.d.paymentEntry && data.d.__metadata
							&& data.d.__metadata._headerId)
						strPaymentHeaderIde = data.d.__metadata._headerId;
					if (strLayoutType === 'MIXEDLAYOUT') {
						doHandleContainerCollapseHdr();
					}
					var data = paymentResponseHeaderData;
					doRemoveStaticText("paymentHeaderEntryStep2");
					paintPaymentHeaderUI(data);
					initatePaymentHeaderValidation();
					paymentHeaderEnrichmentValidation();
					handleEmptyEnrichmentDivs();
					blockPaymentUI(false);
					toggleHeaderDirtyBit(true);
					intHdrDirtyBit = 1;
					if (objInstrumentEntryGrid) {
						$('#paymentInstActionCt').appendTo($('#paymentInstActionParentCt'))
						objInstrumentEntryGrid.removeAll(true);
						objInstrumentEntryGrid.destroy(true);
						objInstrumentEntryGrid = null;
					}
					doHandleEntryGridLoading(false, true);
					scrollToTop();
					autoFocusFirstElement();
					if( strEntryType === "TEMPLATE" )
					{
						if($("#bankProductHdr-niceSelect").is(':visible'))
						{
							$('#bankProductHdr-niceSelect').focus();
						}
					}

				}
			});
	//DHGCP441-207	
//	var strProductCode = strMyProduct;
//	var strBankProduct = $('#bankProductHdr').val();
//	var strUrl = _mapUrl['loadBatchHeaderFieldsUrl'] + "/" + strProductCode;
//	var jsonObj = null;
//
//	if (!isEmpty(strBankProduct))
//		strUrl += '/' + strBankProduct;
//	strUrl += '.json';
//	blockPaymentUI(true);
//	arrFields = [];
//	jsonObj = generatePaymentHeaderJson();
//	if (jsonObj.d.paymentEntry.standardField) {
//		arrFields = jsonObj.d.paymentEntry.standardField;
//		$.each(arrFields, function(index, cfg) {
//					if (cfg.fieldName == 'txnDate') {
//						cfg.value = null;
//					}
//				});
//
//	}
//	if (jsonObj.d && jsonObj.d.__metadata && strPaymentInstrumentIde) {
//		jsonObj.d.__metadata._headerId = strPaymentHeaderIde;
//		jsonObj.d.__metadata._detailId = strPaymentInstrumentIde;
//	}
//	$.ajax({
//				type : "POST",
//				url : strUrl,
//				async : false,
//				contentType : "application/json",
//				data : JSON.stringify(jsonObj),
//				complete : function(XMLHttpRequest, textStatus) {
//					if ("error" == textStatus) {
//						var arrError = new Array();
//						arrError.push({
//									"errorCode" : "Message",
//									"errorMessage" : mapLbl['unknownErr']
//								});
//						paintErrors(arrError);
//						blockPaymentUI(false);
//					}
//				},
//				success : function(data) {
// }
// }
// });			
}
function doHandleContainerCollapseHdr(){
	if (null != chrProductLevel && "I" == chrProductLevel) {
		var strBankHdrProduct = $('#bankProduct').val();
		if ("" == strBankHdrProduct) {
			$("#siParamToggle,#senderDetailsToggle,#paymentDetailsToggle,#additionalInfoToggle").removeAttr('style').addClass("collapseDiv");
			$("#siParamToggleCaret,#senderDetailsToggleCaret,#paymentDetailsToggleCaret,#additionalInfoToggleCaret").removeClass("fa-caret-up").addClass("fa-caret-down  avoid-clicks");

		}
		else {
			$("#siParamToggle,#paymentInformationToggle,#senderDetailsToggle,#paymentDetailsToggle,#additionalInfoToggle").removeClass("collapseDiv").removeAttr('style').css("display","block").css("overflow","hidden");
			$("#paymentInformationToggleCaret,#siParamToggleCaret,#senderDetailsToggleCaret,#paymentDetailsToggleCaret,#additionalInfoToggleCaret").removeClass("fa-caret-down  avoid-clicks").addClass("fa-caret-up");
		}
	}
	else {
		var strBankHdrProduct = $('#bankProductHdr').val();
		if ("" == strBankHdrProduct) {
			$("#siParamToggle,#paymentInformationToggle").removeAttr('style').addClass("collapseDiv");
			$("#paymentInformationToggleCaret,#siParamToggleCaret").removeClass("fa-caret-up").addClass("fa-caret-down  avoid-clicks");
			
		}
		else {
			$("#siParamToggle,#paymentInformationToggle").removeClass("collapseDiv").removeAttr('style').css("display","block").css("overflow","hidden");
			$("#paymentInformationToggleCaret,#siParamToggleCaret").removeClass("fa-caret-down  avoid-clicks").addClass("fa-caret-up");
			
		}
	}	
}
function repopulateBankProductFieldHeader() {
	var _strMyProduct = strMyProduct;
	var _strCcy = $('#txnCurrencyHdr').val();
	var _strOldBankProductVal = $('#bankProductHdr').val();
	var defaultFieldVal = (!Ext.isEmpty(_strOldBankProductVal)) ? _strOldBankProductVal : '';
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
	
	if (isEmpty(_strCcy) && paymentResponseHeaderData.d
			&& paymentResponseHeaderData.d.paymentEntry
			&& paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo
			&& paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.hdrCurrency) {
		_strCcy = paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.hdrCurrency;
	}
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
										arrData, defaultFieldVal);
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
	var data = objData, arrStdFields = [], chrPaymentReceiverLevel='I';
	// NOTE : Comment can be removed if need to test with static JSON
	// var data = dummyHeaderJson;
	// paymentResponseHeaderData = dummyHeaderJson;
	if (data && data.d && data.d.paymentEntry) {
		if(data.d.paymentEntry.paymentHeaderInfo)
			chrPaymentReceiverLevel=getPaymentMethodReceiverLevel(data.d.paymentEntry.paymentHeaderInfo);
		
		if (data.d.paymentEntry.standardField) {
			arrStdFields = data.d.paymentEntry.standardField;
			paintPaymentHeaderStandardFields(data.d.paymentEntry.standardField,chrPaymentReceiverLevel,data.d.paymentEntry.paymentHeaderInfo);
		}

		if (data.d.paymentEntry.adminFields && strEntityType === '0') {
			// TODO : To be handled
			// paintPaymentAdminHdrFields(data.d.paymentEntry.adminFields);
		}

		if (data.d.paymentEntry.enrichments) {
			paintPaymentHdrEnrichments(data.d.paymentEntry.enrichments);
		}
		if (data.d.paymentEntry.paymentCompanyInfo) {
			var objInfo = data.d.paymentEntry.paymentCompanyInfo;
			var strText = !isEmpty(objInfo.company) ? objInfo.company : '';
			strText += '<br/>'
					+ (!isEmpty(objInfo.companyAddress)
							? objInfo.companyAddress
							: '');
			$('.companyInfoHdr').html(strText);
		}
	}
	if (data && data.d && data.d.paymentEntry && data.d.paymentEntry
			&& data.d.paymentEntry.paymentHeaderInfo) {
		var objInfo = data.d.paymentEntry.paymentHeaderInfo;
		var charGridEntry = data.d.paymentEntry.paymentHeaderInfo.allowGridEntry
				? data.d.paymentEntry.paymentHeaderInfo.allowGridEntry
				: 'N';
		if (strLayoutType === 'TAXLAYOUT' || strLayoutType === 'MIXEDLAYOUT'
				|| strLayoutType === 'ACHIATLAYOUT')
			charGridEntry = 'N';
		if(!isEmpty(strTxnGridEntryFlag))
			charGridEntry = charGridEntry === strTxnGridEntryFlag ? 'Y' : 'N';
		toggleGridLayoutEntryOption(charGridEntry);
		if (strLayoutType === 'TAXLAYOUT' || strLayoutType === 'MIXEDLAYOUT'
				|| strLayoutType === 'ACHIATLAYOUT')
			chrAllowGridLayoutEntry = 'N';
			
		if (!isEmpty(objInfo.minPaymentDate)) {
			handleOffsetDays(objInfo.minPaymentDate, 'B')
		}
		
		if(!isEmpty(objInfo.phdnumber))
			strIdentifier = objInfo.phdnumber;
	}

	if (data && data.d && data.d.paymentEntry) {
		var paymentEntry = data.d.paymentEntry;
		if (paymentEntry.paymentHeaderInfo) {
			if (!isEmpty(paymentEntry.paymentHeaderInfo.hdrCutOffTime)) {
				$('#productCuttOffHdrInfoSpan')
						.html(paymentEntry.paymentHeaderInfo.hdrCutOffTime);
			} else {
				$('#productCuttOffHdrInfoSpan').html('');
			}

			if (!isEmpty(paymentEntry.paymentHeaderInfo.hdrTemplateNoOfExec)) {
				$('#templateNoOfExecHdrSpan')
						.html(paymentEntry.paymentHeaderInfo.hdrTemplateNoOfExec);
			} else {
				$('#templateNoOfExecHdrSpan').html('0');
			}
			var prodDesc = null;
			prodDesc = paymentEntry.paymentHeaderInfo.hdrMyProductDescription;
			if('BILLPAYLAYOUT' === strLayoutType){
                 $('.hdrMyProductDescriptionTitle').attr("title",paymentEntry.paymentHeaderInfo.billerDesc);
                 $('.hdrMyProductDescriptionTitle').html(paymentEntry.paymentHeaderInfo.billerDesc || '');
            }else{
		         $('.hdrMyProductDescriptionTitle').attr("title",paymentEntry.paymentHeaderInfo.hdrMyProductDescription);
			     $('.hdrMyProductDescriptionTitle').html(prodDesc || '');
            }
			//if (strPaymentHeaderIde)
			//	$('.lastUpdateDateTimeText').html("You saved on "
			//			+ paymentEntry.paymentHeaderInfo.lastUpdateTime || '');
			if (strAction === 'ADD' && isEmpty($('#referenceNoHdr').val()) && strShowPayRef === 'Y') {
				(!Ext.isEmpty(paymentEntry.paymentHeaderInfo.hdrMyProductDescription) &&  paymentEntry.paymentHeaderInfo.hdrMyProductDescription > referenceLength) ?
						$('#referenceNoHdr').val(paymentEntry.paymentHeaderInfo.hdrMyProductDescription.substr(0,referenceLength)  || '') : $('#referenceNoHdr').val(paymentEntry.paymentHeaderInfo.hdrMyProductDescription	|| ''); ;
				
			}

			if (paymentEntry.paymentHeaderInfo.hdrSource) {
				$('.hdrSourceInfoSpan')
						.text(paymentEntry.paymentHeaderInfo.hdrSource || '');
			}

			// FTMNTBANK-1334
			if (strEntryType === 'PAYMENT' || strEntryType === 'SI') {
				handleHoldZeroDollarFlag('B');
				handleHoldUntilFlag('B');
				
				if($("#siFrequencyCodeHdr").val() !== 'SPECIFICDAY')
				{
					$("#refDayHdr").niceSelect();
					$("#refDayHdr").niceSelect('update');
			}

				$("#periodHdr").niceSelect();
				$("#periodHdr").niceSelect('update');
			}

			chrDebitAccountLevel = paymentEntry.paymentHeaderInfo.accountLevel
					? paymentEntry.paymentHeaderInfo.accountLevel
					: 'B';
			chrDateLevel = paymentEntry.paymentHeaderInfo.dateLevel
					? paymentEntry.paymentHeaderInfo.dateLevel
					: 'B';
			chrProductLevel = paymentEntry.paymentHeaderInfo.productLevel
					? paymentEntry.paymentHeaderInfo.productLevel
					: 'B';
			if (chrProductLevel === 'I'	&& strLayoutType === 'MIXEDLAYOUT' 
				&& chrDateLevel === 'I'	&& chrDebitAccountLevel === 'I' ){
				$('#amountHdrDiv').insertAfter($('#paymentsourceHdrDiv'));
				//$('#senderDetailsHdrDiv').addClass('hidden');	
			}
				
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
		doDisableDefaultLockFields('B', strTemplateType);
	}
	toggleControlTotalFiledDisabledValue();
	toggleInstrumentInitiationActions();
	paintPaymentHeaderActions('EDITNEXT');
	handleLayoutBasedScreenRendering('B', data);
	
	paintPaymentHdrAdditionalInformationSection('B', 'VERIFY');
	
	if(data && data.d && data.d.__metadata && data.d.__metadata._txnImportEnabled){
		var chrTxnImportAllowed = data.d.__metadata._txnImportEnabled
				? data.d.__metadata._txnImportEnabled : "N";
		if(!isEmpty(strImportTxnFlag))
			chrTxnImportAllowed = chrTxnImportAllowed === strImportTxnFlag ? 'Y' : 'N';
		toggleImportEntryOption(chrTxnImportAllowed);	
	}

	if (data && data.d && data.d.paymentEntry
			&& data.d.paymentEntry.paymentHeaderInfo) {
		var strTempType = data.d.paymentEntry.paymentHeaderInfo.allowTxnAdd;
		// in case of Repetitive Template
		var strTemplateType = data.d.paymentEntry.paymentHeaderInfo.templateType;
		if ((strEntryType != 'TEMPLATE' && strTemplateType === '2') || strTempType === 'N') {
			allowTxnAdition = false;
			$('#btnAddRow,#btnAddUsing,#btnTxnWizard,#btnImportTxn,#btnSaveRec')
					.unbind('click')
					.addClass('ft-button-dark-disabled');
		}
	}
	if (strLayoutType === 'MIXEDLAYOUT') {
		doHandleContainerCollapseHdr();
	}
	if (data && data.d && data.d.paymentEntry && data.d.paymentEntry.paymentMetaData
			&& data.d.paymentEntry.paymentMetaData._docUploadEnabled) {
		if(data.d.paymentEntry.paymentMetaData._docUploadEnabled === 'Y')
			$("#uploadFileDiv").removeClass('hidden');
		else if(data.d.paymentEntry.paymentMetaData._docUploadEnabled === 'N')
			$("#uploadFileDiv").addClass('hidden');
	}
	
	if(strLayoutSubType === 'DRAWDOWN')
	toggleAccountLabel(null, 'D');

	if(strEntryType === 'PAYMENT' && strLayoutType !== 'TAXLAYOUT')
	{
		toggleWHTDetails();
	}

	showHideOrderbyHdrDiv('EDIT');
	$(".jq-nice-select").each(function(){
		$(this).attr('tabindex','1');
	});
}
function createBatchPaymentUsingTemplate(strId) {
	if (!isEmpty(strId)) {
		var url = _mapUrl['createBatchUsingTemplateUrl'] + "/id.json?"+ csrfTokenName + "=" + csrfTokenValue;
		$.ajax({
			type : "POST",
			url : url,
			async : false,
			data : {
				'id' : strId
			},
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
						if (data && data.d && data.d.paymentEntry
								&& data.d.paymentEntry.paymentHeaderInfo) {
							strIdentifier = data.d.paymentEntry.paymentHeaderInfo.phdnumber;
							strPaymentHeaderIde = data.d.paymentEntry.paymentHeaderInfo.hdrIdentifier;
							strMyProduct = data.d.paymentEntry.paymentHeaderInfo.hdrMyProduct;
						}
						$('#orderingPartyDescription')
								.OrderingPartyAutoComplete(strMyProduct, true);
						// $('#orderingPartyDescription_OA').OrderingPartyAutoComplete(strMyProduct,false);
						$("#drawerDescriptionA").ReceiverAutoComplete(strMyProduct,null,'B',false);
						$("#drawerDescriptionR").ReceiverAutoComplete(
								strMyProduct, null, 'B', true);
						// toggleAddTransactionAction(2);
						paintPaymentHeaderUI(data);
						initatePaymentHeaderValidation();
						paymentHeaderEnrichmentValidation();
						if (data && data.d && data.d.paymentEntry
								&& data.d.paymentEntry.paymentHeaderInfo) {
							// paintPaymentMoreDetailInfo(data.d.paymentEntry.paymentHeaderInfo);
							// if
							// (data.d.paymentEntry.paymentHeaderInfo.fileUploadProgressFlag)
							// {
							// pollForFileUpload =
							// (data.d.paymentEntry.paymentHeaderInfo.fileUploadProgressFlag
							// === 1)
							// }
						}
						togglerPaymentHederScreen(false);
						populatePaymentHeaderViewOnlySection(
								paymentResponseHeaderData,
								data.d.paymentEntry.paymentHeaderInfo, 'Y',
								'EDIT');

						if (data.d
								&& data.d.paymentEntry
								&& data.d.paymentEntry.message
								&& (data.d.paymentEntry.message.errors || data.d.paymentEntry.message.success === 'SAVEWITHERROR')) {
							paintErrors(data.d.paymentEntry.message.errors);
						}
						// Paint CashIn Errors
						if (data.d && data.d.paymentEntry
								&& data.d.paymentEntry.adminMessage
								&& data.d.paymentEntry.adminMessage.errors) {
							paintCashInErrors(data.d.adminMessage.errors)
						}
						blockPaymentUI(false);
						doHandleEntryGridLoading(false, true);
						handleEmptyEnrichmentDivs();
						toggleHeaderDirtyBit(true);
						if (data && data.d && data.d.paymentEntry
								&& data.d.paymentEntry.paymentHeaderInfo) {
							var strTempType = data.d.paymentEntry.paymentHeaderInfo.allowTxnAdd;
							if (strTempType === 'N' || ( data.d.paymentEntry.paymentHeaderInfo.templateType === '2' && 
									'ACH' === data.d.paymentEntry.paymentHeaderInfo.hdrProductCategory ))
							{
								allowTxnAdition = false;
								$('#btnAddRow,#btnAddUsing,#btnTxnWizard,#btnImportTxn,#btnSaveRec')
										.unbind('click')
										.addClass('ft-button-dark-disabled');
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

function paintPaymentHeaderStandardFields(data,chrPaymentReceiverLevel,objInfo) {
	var arrFields = [];
	var strDisplayMode = null, divId = null, fieldId = null, lblId = null, cfgAccountNo = {};
	var clsHide = 'hidden';
	var apply = true, blnUseInMobile = false;
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
					if (cfg.fieldName === 'useInMobilePayments') {
						blnUseInMobile = true;
					}
					//To handle amount calculation in case of cross currency 
					if (strLayoutType === 'CASHLAYOUT' && fieldId === 'amount') {
						$('#amountHdr').blur();
					}
					/**
					 * If the Payment Product has only one value then,
					 * respective field on UI gets hidden and the Respective
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
											$('#useInMobilePaymentsHdrDiv')
													.addClass('hidden');
										} else if (opt.code === '2') {
											$('#divRepetativeHdr').removeClass('hidden');
										} else if (opt.code === '3') {
											$('#divSemiRepetativeHdr')
													.removeClass('hidden');
											$('#useInMobilePaymentsHdrDiv')
													.addClass('hidden');
										}
									});
						}
					} else if (cfg.fieldName === 'paymentSaveWithSI'
							&& cfg.value && cfg.value === 'Y') {
						toggleRecurringPaymentParameterHdrFieldsSectionVisibility();
					} else if (cfg.fieldName === 'drCrFlag') {
						handleDrCrFlagPaymentHeader(cfg);
					}/* else if (cfg.fieldName === 'amount'
							&& !isEmpty(strEntryType)
							&& (strEntryType === 'PAYMENT' || strEntryType === 'SI')
							&& $('#controlTotalHdrDiv').hasClass('hidden')) {
						$('#amountHdrLbl').addClass('noLeftPadding');
					}*/ else if (cfg.fieldName === 'drawerCode'
							&& (strPayUsing ==='B' && chrPaymentReceiverLevel==='B')) {
						$('#drawerDescriptionHdr').attr("disabled", true);
						$('#drawerDescriptionHdr').addClass("disabled");
					} else if('activationTime' === cfg.fieldName){
						handleEffectiveTimeFieldPopulation(cfg,true);
					}else if('txnDate' === cfg.fieldName){
						if(!$('#'+divId).hasClass('hidden'))
						{
							$('#txnDateHdrWraperDiv').removeClass('hidden');
						}
					} else if('whtApplicable' === cfg.fieldName && cfg.value === 'Y'){
						$('#whtApplicableHdr').attr('checked','true');
						$('#whtApplicableHdr').val('Y');
					} else if('txnCurrency' === cfg.fieldName ){
						$('#txnCurrencyHdrSpan').text('('+cfg.value+')');
					}else if('prenote' === cfg.fieldName){
						handlePrenotePaymentHeader(cfg,objInfo);
					}

				}
				if(cfg.apiDependent)
				{
					doHandleApiCall(cfg);
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
				if(strTemplateType === '2' && blnUseInMobile === true)
						$('#useInMobilePaymentsHdrDiv').removeClass('hidden');
					else
						$('#useInMobilePaymentsHdrDiv').addClass('hidden');	
				handlePaymentHeaderFieldPopulation(cfgAccountNo);
				applyControlFieldsValidation(strPaymentType);
			}
			// FTMNTBANK-841 handleCompanyIdChange(true);
		}
	}
	if(!isEmpty(strEntryType)&& (strEntryType === 'PAYMENT' || strEntryType === 'SI')&& $('#controlTotalHdrDiv').hasClass('hidden')){
		$('#amountHdrLbl').addClass('noLeftPadding');
	}
	else{
		$('#amountHdrLbl').removeClass('noLeftPadding');
	}
	handleForexForPaymentHeader();
	toggleContainerVisibility('paymentHeaderEntryStep2A');
}
function handlePrenotePaymentHeader(cfg,objInfo)
{
	if(cfg.value === 'Y' && strEntryType === "PAYMENT")
	{
		$('#confidentialFlagHdr, #paymentSaveWithSIHdr').attr("checked", false);
		$('#confidentialFlagHdr,#paymentSaveWithSIHdr').addClass("disabled");
		$('#confidentialFlagHdr,#paymentSaveWithSIHdr').attr('disabled',true);
		$('#confidentialFlagHdr,#paymentSaveWithSIHdr').val('N');
		if (!isEmpty(objInfo.minPaymentDate))
		{
			var minDate = new Date(objInfo.minPaymentDate);
			$('#txnDateHdr').datepicker("option", "maxDate", minDate);
		}
		$('#btnImportTxn')
			.unbind('click')
			.addClass('ft-button-dark-disabled');
	}
	else
	{
		$('#confidentialFlagHdr,#paymentSaveWithSIHdr').removeClass("disabled");
		$('#confidentialFlagHdr,#paymentSaveWithSIHdr').attr('disabled',false);
		$('#txnDateHdr').datepicker("option", "maxDate", null);
		$('#btnImportTxn')
			.bind('click')
			.removeClass('ft-button-dark-disabled');
			if (allowTxnAdition) {
				toggleInstrumentInitiationActions();
			}
	}
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
		handlePayNormalEnrichSelect(data.udeEnrichment.parameters,'enrude_');
	}
	if (isVisible) {
		if (intCounter >= 2)
			$('<div>').attr('class', 'clear')
					.appendTo($('#paymentHdrUdeEnrichDiv'));
		$('#paymentHdrUdeEnrichDiv').removeClass(clsHide);
	}
}

function handlePayNormalEnrichSelect(arrPrdEnr,udeFielddPrefix){
	var sortArrPrdEnr, minCounter, maxCounter, arrLength;
	if (arrPrdEnr) {
		sortArrPrdEnr = generateSortArrPrdEnr(arrPrdEnr);
		arrLength = sortArrPrdEnr.length;
		minCounter = sortArrPrdEnr[0].sequenceNmbr;
		maxCounter = sortArrPrdEnr[arrLength - 1].sequenceNmbr;
		for (var i = minCounter; i <= maxCounter; i++) {
			var enrField = null;
			enrField = getEnrField(arrPrdEnr, i);
			if (!isEmpty(enrField) && enrField != null) {
				var objId = enrField.code;
					if(enrField.displayType === 4){
						var objFieldId = (!isEmpty(udeFielddPrefix)) ?  udeFielddPrefix+objId : objId;
						$('#'+objFieldId).niceSelect("destroy");
						$('#'+objFieldId).niceSelect();
						$('#'+objFieldId).niceSelect("update");
						$('#'+objId+'-niceSelect').bind('blur', function mark() {
								markRequired($(this));
							});
						$('#'+objId+'-niceSelect').on('focus', function () {
							removeMarkRequired($(this));
						});
					}
			}
		}
	}
}

function toggleInstrumentInitiationAction(){
	var flag = false;
	var allHdrReqFields = $(".headerRequired").map(function() {
	    return this;
	}).get();
	
	var enrichReqFields= $('#paymentHdrUdeEnrichDiv label.required').map(function() {
	    return this;
	}).get();			
			
	for (var i = 0; i < allHdrReqFields.length; i++) {
		if (allHdrReqFields[i].id && "Hdr" === allHdrReqFields[i].id.substr(allHdrReqFields[i].id.length - 3) && !($.trim($('#'+ allHdrReqFields[i].id).val()))) {
			if ((!$('#paymentSaveWithSIHdr').val()
					|| "N" == $('#paymentSaveWithSIHdr').val() || !"SI" == strEntryType)
					&& ("siEffectiveDateHdr" === allHdrReqFields[i].id
							|| "periodHdr" === allHdrReqFields[i].id || "siTerminationDateHdr" === allHdrReqFields[i].id)) {

			}
			else if("amountHdr" === allHdrReqFields[i].id)
			{
				if('Y' === $('#controlTotalHdr').val())
				flag = true ;
			}
			else {
				if (!("SPECIFICDAY" === $('#siFrequencyCodeHdr').val() && "periodHdr" === allHdrReqFields[i].id)) {
					flag = true;					
				}
			}
		}
	}
	
	var fieldId = null, field = null;
	for (var i = 0; i < enrichReqFields.length; i++) {
		fieldId = $(enrichReqFields[i]).attr('for');
		field = $('#enrude_' + fieldId);
		if (!isEmpty(field) && field.length != 0 && !($.trim(field.val())))
		{
			flag = true;
		}
		//Enrich Field - IATBATCH07 Indicates destination currency i.e each time user changes receiver currency, the variable userSelectedDestinationCurrency holds the value
		if(!isEmpty(fieldId) && fieldId === "IATBATCH07" && !isEmpty(field) && !isEmpty(field.val())){
			userSelectedDestinationCurrency = field.val();
		}
	}
	if ('Y' === $('#controlTotalHdr').val()
			&& (!$.trim($('#totalNoHdr').val())
					|| $.trim($('#totalNoHdr').val()) <= 0 || !$.trim($(
					'#amountHdr').val()))) {
		flag = true;
	}
	if (flag) {
		$('#btnAddRow ,#btnAddUsing ,#btnTxnWizard ,#btnImportTxn ,#btnSaveRec').addClass("x-btn-default-toolbar-small-disabled");
		$('#btnAddRow ,#btnAddUsing ,#btnTxnWizard ,#btnImportTxn ,#btnSaveRec').unbind( 'click' );

		if(objInstrumentEntryGrid)
			objInstrumentEntryGrid.setDisabled(true);

	}
	return flag;
}


function changeHdrButtonVisibility(){
	var flag = toggleInstrumentInitiationAction();
	
	if (!flag){
		$('#btnAddRow ,#btnAddUsing ,#btnTxnWizard ,#btnImportTxn ,#btnSaveRec').removeClass("x-btn-default-toolbar-small-disabled");
		if(objInstrumentEntryGrid)
			objInstrumentEntryGrid.setDisabled(false);
		if (allowTxnAdition) {
			toggleGridLayoutEntryAddRow(true);
			toggleInstrumentInitiationActions();
		}
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
					var strAdditionalHelperCls = (!isEmpty(enrField.displayType)
								&& (enrField.displayType === 10
								|| enrField.displayType === 11))
								? 'smallEnrichDiv'
								: '';		
					div = $('<div>').attr({
								'class' : 'col-sm-6 ' + strAdditionalHelperCls,
								'id' : enrField.code + 'Div'
							});
					innerDiv = $('<div>').attr({
								'class' : 'form-group ',
								'id' : enrField.code + '_InnerDiv'
							});
					label = $('<label>').attr('class', '');
					if(!isEmpty(enrField.displayType) && enrField.displayType != 10)
						label.text(enrField.description);
					else
						label.text("");
					if(enrField.displayType === 6 || enrField.displayType === 10 || enrField.displayType === 11){
						enrField.code='enrude_' + enrField.code;
					}
					field = createEnrichMentField(enrField);
					if (enrField.enableDisable != null) {
						if (enrField.enableDisable == 'disable') {
							field.attr('disabled', true);
						} else if (enrField.enableDisable == 'enable') {
							field.attr('disabled', false);
						}
					}
					if (field) {
						if(!isEmpty(enrField.displayType) && enrField.displayType !== 10 && enrField.displayType !== 11)
							field.attr('class', 'form-control');
						
						if(enrField.displayType === 6){
							enrField.code=enrField.code.split("enrude_")[1];
						}
						field.attr('id', 'enrude_' + enrField.code);
						if(enrField.displayType === 10 || enrField.displayType === 11){
							label.attr('for', enrField.code.split("enrude_")[1]);
						}
						else
						{
							label.attr('for', enrField.code);
						}
						
						if (enrField.mandatory == true)
							{
								label.addClass('required');
								$(field).change(function() {
									changeHdrButtonVisibilityOnMultiSelect();
							    });						
							}
							
						// span.appendTo(div);
						label.appendTo(innerDiv);
						if (enrField.enrichmentType === 'S'
								&& !isEmpty(enrField.apiName))
							handleHeaderPageRefreshOnSingleSetEnrichmentChange(
									field, enrField);
						
						if (enrField.displayType === 6)// DATEBOX
						{
							field
								.addClass('form-control ft-datepicker hasDatepicker');
							var dateDiv = $('<div>').attr({
										'class' : 'input-daterange'
									});
							field.attr('style','width:90%');
							field.appendTo(dateDiv);
							$('<div class="input-group-addon has-icon"><i class="fa fa-calendar"></i></div>').appendTo(dateDiv);
							dateDiv.appendTo(innerDiv);
						}
						else
							field.appendTo(innerDiv);
						
						if (enrField.allowAdhocValue) {
							if (field.hasClass('jq-editable-combo')) {
								field.editablecombobox("destroy");
							}

							$(field).editablecombobox({
										emptyText : 'Select '+enrField.description,
										maxLength : 5,
										adhocValueAllowed : enrField.allowAdhocValue,
										adhocEnteredValue : enrField.value,
										title : mapLbl['lblAdhocFieldDisclaimer']
									});
							$(field).editablecombobox('refresh');
							var spanIndicator = $('<span>').attr({
								'style' : 'color:red'
							});
							spanIndicator.text(' '+ mapLbl['lblAdhocFieldIndicator']);
							spanIndicator.appendTo(label);
							blnUdeHeaderDisclaimerVisibiliity = true;
						}
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
	showEditableFieldDisclaimerText();
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
						field.trigger( "focus" );
					});
	}

}

function refreshBatchFieldsOnEnrichChange(obj,strEnrichType) {
	if (!isEmpty(obj)) {
		var enrichId;
		var enrichValue;
		var udePrefix = 'enrude_';
		var url = 'services/refreshEnrichment';
		
		if(strEnrichType == 'paymentCustomization')
		{
			enrichId = obj.enrichmentCode;
			enrichValue=$('#'+obj.fieldName).val();
		}
		else
		{
			enrichId = obj.attr('id');
			enrichValue = obj.attr('value');
			
		}
		
		if(enrichId.includes(udePrefix)){
			enrichId = enrichId.split(udePrefix)[1];
		}
		if(Ext.isEmpty(enrichValue))
		{
			enrichValue=objApiEnrichmentType[enrichId]+'@empty';
		}
		url += '/' + enrichId;
		url += '/' + enrichValue;
		url += '/' + objApiEnrichmentType[enrichId] + '.json';
		
		
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
				intHdrDirtyBit = 1;
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
						populateApiEnrichmentType(data);
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
						if (cfg.availableValues.length > 1)
							handleDisplayMode('3', 'txnCurrency', 'B');
						else
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
				}else if (fieldId === 'accTrfTypeHdr') {
					$('input:radio[name="accTrfTypeHdr"]').attr('disabled',
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
		if (dataType === 'select' && !isEmpty(defValue)){
			field.attr('disabled', 'disabled');
			if('accountNoHdr' === fieldId){
				$('#accountNoHdr_jq').attr('disabled', 'disabled');
				$('#'+fieldId+'-niceSelect').attr('disabled', 'disabled');
				$('#'+fieldId+'-niceSelect').addClass('disabled');				
			}
		}
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
		jsonData.d.paymentEntry.standardField.push({
					fieldName : 'prdCutoffFlag',
					value : 'Y'
				});
	}
	savePaymentHeader(jsonData, postHandleSavePaymentHeader, jsonArgs);

}
function doUpdatePaymentHeaderSilent(blnSilent,source) {
	/**
	 * TODO: Changes made in doUpdatePaymentHeaderSilent need to be replicated in repaintPaymentHeaderFields method
	 */
	var jsonData = generatePaymentHeaderJson(), jsonArgs = {}, isSuccess = false, isSilent = isEmpty(blnSilent)
			? true
			: blnSilent;
	var canSave = validateRequiredPaymentHeaderFields();
	jsonArgs.action = 'UPDATE';
	var strUrl = _mapUrl['saveBatchHeaderUrl'];	
	
	if(source == 'TXNIMP')
		strUrl = strUrl + '?&$source='+source;
	
	blockBatchHeaderUI(true);
	$.ajax({
				url : strUrl,
				type : 'POST',
				async : !isSilent, 
				contentType : "application/json",
				data : JSON.stringify(jsonData),
				complete : function(XMLHttpRequest, textStatus) {
					if ("error" == textStatus) {
						var arrError = new Array();
						arrError.push({
									"errorCode" : "Message",
									"errorMessage" : mapLbl['unknownErr']
								});
						if (!isSilent)
							paintErrors(arrError);
						blockBatchHeaderUI(false);
					}
					
				},
				success : function(data) {
					var status = null;
					paymentResponseHeaderData = data;
					if (data.d.paymentEntry && data.d.paymentEntry.message
							&& data.d.paymentEntry.message.success) {
						status = data.d.paymentEntry.message.success;
						status = status.toUpperCase();
					}
					if (!isEmpty(strLayoutType)
							&& strLayoutType !== 'ACHLAYOUT'
							&& strLayoutType !== 'TAXLAYOUT')
						doHandlePaymentProrductToggle(data);
					if (data.d.paymentEntry && data.d.__metadata
							&& data.d.__metadata._headerId)
						strPaymentHeaderIde = data.d.__metadata._headerId;
					toggleHeaderDirtyBit(false);
					if (!isSilent) {
						if (status === 'SAVEWITHERROR' || status === 'FAILED') {
							if (data.d.paymentEntry.message.errors)
								paintErrors(data.d.paymentEntry.message.errors);
							isSuccess = false;
						}
						else {
							doClearMessageSection();
							isSuccess = true;
							doUpdateAndNextPaymentHeaderCall(isSuccess);
						}
					}
					blockBatchHeaderUI(false);
				}
			});
		return isSuccess;
}
function doUpdatePaymentHeader(blnPrdCutOff) {
	var jsonData = generatePaymentHeaderJson(), jsonArgs = {};
	var canSave = validateRequiredPaymentHeaderFields();
	jsonData.d.__metadata._headerId = strPaymentHeaderIde;
	if (blnPrdCutOff === true) {
		jsonData.d.paymentEntry.standardField.push({
					fieldName : 'prdCutoffFlag',
					value : 'Y'
				});
	}
	jsonArgs.action = 'UPDATE';
	savePaymentHeader(jsonData, postHandleSavePaymentHeader, jsonArgs);
}
function doSubmitPaymentHeader() {
	var flipFlag = 'N' ;
	var strUrl = _mapUrl['submitBatchUrl'];
	var cutOffInst =   {"instruments":[]};
	if (isEmpty(strUrl))
		return false;
	var arrayJson = new Array();
	arrayJson.push({
				serialNo : 1,
				identifier : strPaymentHeaderIde,
				userMessage : ''
			});
	blockBatchHeaderUI(true);
	$('#button_btnSubmit').attr('disabled', true);
	$('#button_btnBack').attr('disabled', true);
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
				blockBatchHeaderUI(false);
			}
		},
		success : function(data) {
			blockBatchHeaderUI(false);
			if (data && data.d && data.d.instrumentActions) {
				var arrResult = data.d.instrumentActions;
				var isError = false;
				if (arrResult && arrResult.length == 1) {
					if (arrResult[0].success === 'Y') {
						blockBatchHeaderUI(false);
						var result = arrResult[0];
						if (result.updatedStatusCode === '7'
								&& strPayProductCategoryType === 'R') {
							var pirsFound = processRealTimePirs(data, '',
									'batchEntrysubmit');
							if (!pirsFound){
								if (result.isWarning === 'Y') {
										doClearMessageSection();
										paintErrors(arrResult[0].errors,'',mapLbl['warnMsg']);
								 		$('#button_btnSubmit').unbind('click');
								 		if (result.updatedStatusCode!= '7')
								 		{
								 		$('#button_btnSubmit').attr('disabled', false);
								 		$('#button_btnBack').attr('disabled', false);
								 		$('#button_btnSubmit').bind('click', function(){
								 			goToPage(_mapUrl['cancelBatchUrl'],'frmMain');
								 		 });
								 		}
								 		if (typeof objInstrumentEntryGrid != 'undefined' && objInstrumentEntryGrid) 
								 		{
								 			objInstrumentEntryGrid.refreshData();
								 		}
									} else
								goToPage(_mapUrl['cancelBatchUrl'], 'frmMain');
							}
						} else {
							if (result.isWarning === 'Y') {
										doClearMessageSection();
										paintErrors(arrResult[0].errors,'',mapLbl['warnMsg']);
								 		$('#button_btnSubmit').unbind('click');
								 		if (result.updatedStatusCode!= '7')
								 		{
								 		$('#button_btnSubmit').attr('disabled', false);
								 		$('#button_btnBack').attr('disabled', false);
								 		$('#button_btnSubmit').bind('click', function(){
								 			goToPage(_mapUrl['cancelBatchUrl'],'frmMain');
								 		});
								 		}
								 		if (typeof objInstrumentEntryGrid != 'undefined' && objInstrumentEntryGrid) 
								 		{
								 			objInstrumentEntryGrid.refreshData();
								 		}
									} else
							goToPage(_mapUrl['cancelBatchUrl'], 'frmMain');
						}
					} else if (arrResult[0].success === 'N') {
						$('#button_btnBack').attr('disabled', false);
						if (arrResult[0].errors) {
								doClearMessageSection();
								blockBatchHeaderUI(false);
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
								showPaymentEntryCutoffAlert(
										212,
										300,
										strTitle,
										strMsg,
										postHandlePaymentHeaderActionsProductCutOff,
										args);
							} else {
								doClearMessageSection();
								// paintErrors(arrError);
								paintErrors(arrResult[0].errors);
								blockBatchHeaderUI(false);
							}
							}
					} 
					else if(arrResult[0].success === 'FX'){
						if (arrResult[0].errors) {
							var arrError = arrResult[0].errors, isFxRateError = false, errCode = null;
							if (arrError && arrError.length > 0) {
								$.each(arrError, function(index, error) {
											strMsg = strMsg + error.code
													+ ' : '
													+ error.errorMessage;
											errCode = error.code;
											if (errCode && (errCode.indexOf( 'SHOWPOPUP') != -1 || errCode.indexOf( 'WARN') != -1) || errCode.indexOf( 'GD0002') != -1 ) {
												isFxRateError = true;
												if(errCode.indexOf('SHOWPOPUP,CUTOFF,ROLLOVER,FLIP') != -1 || 'Y' == error.flag )
													{
													  flipProductList = error.productMap;
													  flipFlag = 'Y';
													  if(!isEmpty(error.disableCutoffBtn)){
														  disableCutoffBtns = error.disableCutoffBtn;  
													  }													  
													}
											}
											
										});
							}
							if (isFxRateError) {
							if(isNaN(fxTimer))  fxTimer = 10;
							cutOffInst.instruments.push({
							    "paymentFxInfo": arrResult[0].paymentFxInfo,
							    "strAction":'submit',
							    "errorCode" : errCode
							  });
							if(cutOffInst && cutOffInst.instruments && cutOffInst.instruments.length > 0)
							{
								countdownInstTimerVal = null;
								isInstCutOff=  true;
								if (isNaN(fxTimer))
									fxTimer = 10;
								var countdown_number = 60 * fxTimer;
								countdownInstTimerVal = countdown_number;
								rowAction = "B";
								takeCutOffInstrumentAction(cutOffInst,0, flipProductList,flipFlag);
								showCutOffTimer(countdownInstTimerVal);
							}
							}
							 else {
								doClearMessageSection();
								paintErrors(arrResult[0].errors);
								blockBatchHeaderUI(false);
							}
						}
					}
					else if (arrResult[0].success === 'W02') {
						doClearMessageSection();
						var arrError = new Array();
						arrError.push({
							"errorCode" : "",
							"errorMessage" : getLabel('paymentSubmitMsg', 'Payment submitted. Warning limit exceeded!')
						});
						paintErrors(arrError);
						blockBatchHeaderUI(false);
					}
				}
			}
			else if (data && data.d.auth == "AUTHREQ" )
			{
				$('#button_btnBack').attr('disabled', false);
				$('#button_btnSubmit').attr('disabled', false);
			}
		}
	});

}
function doUpdateAndNextPaymentHeader(blnPrdCutOff) {
	var isSuccess = doUpdatePaymentHeaderSilent(false);
}
function doUpdateAndNextPaymentHeaderCall(isSuccess) {
	if(isSuccess){		
	var strActionStatus, blnStatusFlag = false, blnControlTotal = true, arrError, jsonData, canSave, isTotalNo = false, isTotalAmount = false;
	if (strPaymentHeaderIde && strPaymentHeaderIde != '') {
		var strUrl = 'services/paymentheaderinfo.json';
		$.ajax({
			url : strUrl,
			type : 'POST',
			async : false,
			data : {
				'$id' : strPaymentHeaderIde,
				'csrfTokenName' : tokenValue
			},
			//contentType : "application/json",
			complete : function(XMLHttpRequest, textStatus) {
				if ("error" == textStatus) {
					var arrError = new Array();
					arrError.push({
								"errorCode" : "Message",
								"errorMessage" : mapLbl['unknownErr']
							});
					paintErrors(arrError);
					blockBatchHeaderUI(false);
				}
			},
			success : function(data) {
				var objResponseData = data;
				if (!isEmpty(objResponseData)) {
					var strActionStatusVal = objResponseData.d.paymentHeaderInfo.hdrActionStatus;
					if (objResponseData.d.paymentHeaderInfo.hdrControlTotal == 'N') {
						blnControlTotal = false;
					}
					if (!isEmpty(strActionStatusVal)
							&& strActionStatusVal === '9') {
						blnStatusFlag = true;
					} else if (objResponseData.d.paymentHeaderInfo.hdrControlTotal == 'Y') {
						if (objResponseData.d.paymentHeaderInfo.hdrEnteredNo != objResponseData.d.paymentHeaderInfo.hdrTotalNo
								&& objResponseData.d.paymentHeaderInfo.hdrTotalNo != '0') {
							isTotalNo = true;
						} else if (objResponseData.d.paymentHeaderInfo.hdrEnteredAmount != objResponseData.d.paymentHeaderInfo.totalAmount
								&& objResponseData.d.paymentHeaderInfo.totalAmount != '0') {
							isTotalAmount = true;
						}
					}
					// TODO: && blnControlTotal != true : condition removed from
					// following if
					if (blnStatusFlag !== true) {
						var jsonArgs = {};
						jsonArgs.action = 'UPDATEANDNEXT';
						//TODO : To be verify
						/*savePaymentHeader(jsonData,
								postHandleSavePaymentHeader, jsonArgs);*/
						postHandleSavePaymentHeader(paymentResponseHeaderData, jsonArgs)
					} else if (blnStatusFlag == true) {

						if (objResponseData
								&& objResponseData.d
								&& objResponseData.d.paymentHeaderInfo.pirMode == 'LP'
								&& !isEmpty(objResponseData.d.paymentHeaderInfo.hdrTemplateName)
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
							paintErrors(mapLbl['controlTotalNotMatchMsg']);
						} else if (isTotalAmount) {
							paintErrors(mapLbl['controlTotalAmtNotMatchMsg']);
						}
					}
					blockBatchHeaderUI(false);
				} else if (isEmpty(objResponseData)
						&& objResponseData.d.paymentEntry.message.errors) {
					doClearMessageSection();
					paintErrors(objResponseData.d.paymentEntry.message.errors);
					blockBatchHeaderUI(false);
				}
			}
		});
	}
	}
}
function postHandleSavePaymentHeader(data, args) {
	var status = null, strPirNo = null, strUniqueRef = null;
	var action = args.action;
	if (data && data.d) {
		if (data.d.paymentEntry && data.d.paymentEntry.message
				&& data.d.paymentEntry.message.success) {
			status = data.d.paymentEntry.message.success;
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
				arrFields = data.d.paymentEntry.standardField;
				// TODO: To be handled
				/*
				 * var filter = { 'txnDate' : { 'displayMode' : '3', 'dataType' :
				 * 'date' } }; paintPaymentHdrStandardFields(arrFields, filter);
				 */
				doClearMessageSection();

			}
			if (status === 'SAVEWITHERROR') {
				if (data.d.paymentEntry.message.errors)
					paintErrors(data.d.paymentEntry.message.errors);
			}
			if (!isEmpty(data.d.paymentEntry.message.pirNo)) {
				var msgDtls = {
					'pirNo' : data.d.paymentEntry.message.pirNo,
					'uniqueRef' : data.d.paymentEntry.message.uniqueRef,
					'txnReference' : data.d.paymentEntry.message.uniqueRef
				};
				paintHeaderSuccessMsg(msgDtls, 'B', data);
				strIdentifier = data.d.paymentEntry.message.pirNo;
			}
			if (data.d.paymentEntry && data.d.__metadata
					&& data.d.__metadata._headerId)
				strPaymentHeaderIde = data.d.__metadata._headerId;
			if (!isEmpty(strLayoutType) && strLayoutType !== 'ACHLAYOUT'
					&& strLayoutType !== 'TAXLAYOUT')
				doHandlePaymentProrductToggle(data);
			paintPaymentHeaderActions('EDIT');
			togglerPaymentHederScreen(false);
			populatePaymentHeaderViewOnlySection(paymentResponseHeaderData,
					data.d.paymentEntry.paymentHeaderInfo, 'Y', 'EDIT');
			if (action === 'UPDATE') {
				if (objInstrumentEntryGrid) {
					$('#paymentInstActionCt').appendTo($('#paymentInstActionParentCt'))
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
			if(data && data.d && data.d.__metadata && data.d.__metadata._txnImportEnabled){
				var chrTxnImportAllowed = data.d.__metadata._txnImportEnabled
						? data.d.__metadata._txnImportEnabled : "N";
				if(!isEmpty(strImportTxnFlag))
					chrTxnImportAllowed = chrTxnImportAllowed === strImportTxnFlag ? 'Y' : 'N';
				toggleImportEntryOption(chrTxnImportAllowed);	
			}
			toggleHeaderDirtyBit(false);
		} else if (status === 'FAILED') {
			if (data.d.paymentEntry.message) {
				var arrError = data.d.paymentEntry.message.errors;
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
					showAlert(200, 400, strTitle, strMsg,
							postHandlePaymentHeaderProductCutOff, args);
				} else {
					paintErrors(data.d.paymentEntry.message.errors);
					blockPaymentUI(false);
				}
			}
		} else if (isEmpty(status) && data && data.d && data.d.paymentEntry && data.d.paymentEntry.message && data.d.paymentEntry.message.errors) {
			doClearMessageSection();
			paintErrors(data.d.paymentEntry.message.errors);
			blockPaymentUI(false);
		}
	}
}
function doPostHandleUpdateAndNextPaymentHeader() {
	doClearMessageSection();
	$('#txnStep1,#txnStep2').removeClass('ft-status-bar-li-active')
			.addClass('ft-status-bar-li-done');
	$('#txnStep3').addClass('ft-status-bar-li-active').removeClass('ft-status-bar-li-done');
	$('#paymentInstrumentInitActionDiv, #paymentHeaderEntryStep2, #paymentHeaderEntryStep2B,#messageContentDiv, #paymentHeaderEntryExtraFieldsDiv')
			.addClass('hidden');
	$('#verificationStepDiv').removeClass('hidden');
	paintPaymentHeaderActions('SUBMIT');
	populatePaymentHeaderVerifyScreen(paymentResponseHeaderData,
			paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo, 'Y',
			false,false);
	if (data.d
			&& paymentResponseHeaderData.d.paymentEntry
			&& paymentResponseHeaderData.d.paymentEntry.message
			&& (paymentResponseHeaderData.d.paymentEntry.message.errors && paymentResponseHeaderData.d.paymentEntry.message.success === 'SUCCESS')) {
		paintErrors(paymentResponseHeaderData.d.paymentEntry.message.errors);
	}
}

function populatePaymentHeaderViewOnlySection(data, objHdrInfo, charBatch,
		strMode) {
	var arrStdFields = data && data.d && data.d.paymentEntry
			&& data.d.paymentEntry.standardField
			? data.d.paymentEntry.standardField
			: null;
	var strFieldName = null, strValue = null, mapFields = {}, strPostFix = charBatch === 'Y'
			? 'HdrInfoSpan'
			: 'InfoSpan', arrFields = null;
	var strHdrEnteredNo = '', strHdrEnteredAmount = '', strHdrTotalNo = '', strTotalAmount = '', strLastUpdatedTime = '', strBatchStatus = '', ctrl = null, ctrDiv = null, blnIsMultiCcy = false
	,hdrReference ='';
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
								if(strFieldName === 'accountNo')
								ctrl.html(splitAccountSting(strValue));
								else
								ctrl.html(strValue);
							
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
						} else if(strFieldName === 'drawerDescription')	{
							!isEmpty(strValue) ? $(".drawerDescription" + strPostFix + 'Div').removeClass('hidden') :
							$(".drawerDescription" + strPostFix + 'Div').addClass('hidden');
							ctrl.html(strValue || '');
						} else if (strFieldName === 'accTrfType') {
							$('.' + cfg.fieldName + 'Field').addClass('hidden');
							if (cfg.value)
								$('.' + cfg.fieldName + cfg.value + '_HdrInfoSpan')
										.removeClass('hidden');
							gAmountTransferType = cfg.value;
						}else if(strFieldName === 'whtApplicable' ){
							if(cfg.value && cfg.value === 'Y'){
								$('.whtApplicable_HdrInfo').removeClass('hidden');
							} else{
								$('.whtApplicable_HdrInfo').addClass('hidden');
							}
						} else	ctrl.html(strValue);
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
						});
			}
		}
		populateSIProcessingViewOnlyFields('B', Freq, gstrPeriod, gstrRef,
				strPostFix);
		//toggleRecurringPaymentParameterHdrFieldsViewOnlySectionVisibility();
	}
	if (objHdrInfo) {
		strHdrEnteredNo = objHdrInfo.hdrEnteredNo;
		strHdrEnteredAmount = setDigitAmtGroupFormat(objHdrInfo.hdrEnteredAmountFormatted);
		strHdrTotalNo = objHdrInfo.hdrTotalNo;
		if (jQuery.isNumeric(strHdrTotalNo)
				&& jQuery.isNumeric(strHdrEnteredNo)
				&& (strHdrTotalNo - strHdrEnteredNo >= 0))
			strHdrTotalNo = strHdrTotalNo - strHdrEnteredNo;
		strTotalAmount = setDigitAmtGroupFormat(objHdrInfo.balanceAmountFormatted);
		strLastUpdatedTime = objHdrInfo.lastUpdateTime;
		strBatchStatus = objHdrInfo.hdrStatus;
		blnIsMultiCcy = objHdrInfo.isMultiCcyTxn;
		hdrReference = objHdrInfo.hdrReference;		
	}
	if (blnIsMultiCcy) {
		$('.hdrMultiCcyEditIconSpan').remove();
		var objMultiCcyIcon = $('<span>').attr('class',
				'iconlink grdlnk-notify-icon icon-gln-fcy hdrMultiCcyEditIconSpan');
		$(objMultiCcyIcon)
				.insertBefore($("#hdrEnteredAmountFormattedHdrInfoSpan, #balanceAmountFormattedHdrInfoSpan"));
	} else
		$('.hdrMultiCcyEditIconSpan').remove();
	$('#hdrEnteredAmountFormattedHdrInfoSpan, .hdrEnteredAmountFormatted_HdrInfo').html(strHdrEnteredAmount); 
	$('#balanceAmountFormattedHdrInfoSpan, .balanceAmountFormatted_HdrInfo').html(strTotalAmount);
	$('#enteredInstCountHdrInfoSpan, .enteredInstCount_HdrInfo').html(strHdrEnteredNo);
	$('#totalInstCountHdrInfoSpan, .totalInstCount_HdrInfo').html(strHdrTotalNo);
	$('#productCuttOff' + strPostFix+','+'#productCuttOff' + strPostFix).html(objHdrInfo.hdrCutOffTime || '');
	$('.referenceNo_HdrInfo').html(hdrReference);
	if (strPaymentHeaderIde) {
		//$('.lastUpdateDateTimeText').html("You saved on " + strLastUpdatedTime
		//		|| '');
		if (strEntryType === 'PAYMENT' || strEntryType === 'SI')
			$('.batchStatusText')
					.html(getLabel('batchStatus', 'Batch Status : ') + strBatchStatus || '');
		$('.siStatus' + strPostFix).text(strBatchStatus || '');
	}
	if (data && data.d && data.d.paymentEntry
			&& data.d.paymentEntry.paymentHeaderInfo
			&& data.d.paymentEntry.paymentHeaderInfo.hdrDrCrFlag) {
		var drCrFlag = data.d.paymentEntry.paymentHeaderInfo.hdrDrCrFlag;
		if (strLayoutType === 'ACCTRFLAYOUT') {
			toggleAccountTransferHeaderAccountLabel(drCrFlag);
			$('.batchHeaderSectionLbl').text(drCrFlag === 'D'
					? getLabel('receiverDetails', 'Receiver Details')
					: getLabel('senderDetails', 'Sender Details'));
		}
	}
	if (data && data.d && data.d.paymentEntry
			&& data.d.paymentEntry.paymentCompanyInfo) {
		var objInfo = data.d.paymentEntry.paymentCompanyInfo;
		var strText = !isEmpty(objInfo.company) ? objInfo.company : '';
		strText += '<br/>'
				+ (!isEmpty(objInfo.companyAddress)
						? objInfo.companyAddress
						: '');
		$('.companyInfoHdr').html(strText);
	}

	if (data && data.d && data.d.paymentEntry
			&& data.d.paymentEntry.enrichments) {
		paintPaymentHdrViewOnlyEnrichments(data.d.paymentEntry.enrichments);
	}
	//Performance
	/*if (charBatch === 'Y') {
		$("#paymentHeadeerTrasanctionSummaryDiv .canClear").empty();
		paintPaymentHdrAdditionalInformationSection('B', strMode);
	}*/
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
	var field = null, targetDiv = $('.' + strTargetId), label = null, span = null, div = null, formGroup = null, innerDiv = null, intCnt = 1, sortArrPrdEnr, minCounter, maxCounter, arrLength;
	var row = $('<div>').attr({
				'class' : 'row'
			}), numberOfCols = 3, intNoOfEnrichDivsAdded = 0;
	if (!isEmpty(intCounter))
		intCnt = intCounter;
	if (arrPrdEnr) {
		sortArrPrdEnr = generateSortArrPrdEnr(arrPrdEnr);
		arrLength = sortArrPrdEnr.length;
		minCounter = sortArrPrdEnr[0].sequenceNmbr;

		maxCounter = sortArrPrdEnr[arrLength - 1].sequenceNmbr;
		for (var i = minCounter; i <= maxCounter; i++) {
			var enrField = null, colCls = 'col-sm-4';
			enrField = getEnrField(arrPrdEnr, i);
			if (!isEmpty(enrField) && enrField != null) {
				if (enrField.enrichmentType == 'S'
						|| enrField.enrichmentType == 'M') {
					formGroup = $('<div>').attr({
								'class' : 'form-group'
							});
					div = $('<div>').attr({
								'id' : enrField.code + 'Div'
							});
					if (!isEmpty(enrField.displayType) && enrField.displayType != 10
							&& enrField.displayType != 11) {
						div.addClass(colCls);
					} else {
						var strAdditionalHelperCls = 'smallEnrichDiv';
						div.addClass(colCls + ' ' + strAdditionalHelperCls);
					}
					label = $('<label>').attr('class', '')
					if(enrField.displayType !== 10)
					label.text(enrField.description );
					field = $('<div>').attr({
								'id' : 'enrUdeInfo_' + enrField.code,
								'style' : 'overflow:visible;overflow-wrap:break-word;'
							});
					if (enrField.value && enrField.displayType === 10)
						$(field).html(getEnrichValueToDispayed(enrField));
					else 
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
		isEnableGridAction,isEnableRowAction) {
	var arrStdFields = data && data.d && data.d.paymentEntry
			&& data.d.paymentEntry.standardField
			? data.d.paymentEntry.standardField
			: null;
	var templateOrderbyhidden = false;
	var isEnableRowAction = !isEmpty(isEnableRowAction) ? isEnableRowAction : true;
	var strFieldName = null, strValue = null, mapFields = {}, strPostFix = charBatch === 'Y'
			? '_HdrInfo'
			: '_InfoSpan', arrFields = null, ctrl = null, ctrlDiv = null, isExtraInfoAvailable = false, blnCountrTotalFieldHidden=true;
	var strHdrEnteredNo = '', strHdrEnteredAmount = '', strHdrTotalNo = '', strTotalAmount = '', blnIsMultiCcy = false;
	var strRateType = $('#rateTypeHdr').val();
	if (arrStdFields) {
        $.each(arrStdFields, function(index, cfg) {
            strFieldName = cfg.fieldName;
            strValue = getValueToDispayed(cfg);
            if(strFieldName=="templateOrderbyColumn")
                {
                    if(isEmpty(strValue))
                     templateOrderbyhidden =true;
                }
            }
        );
    }
	if (arrStdFields) {
		$.each(arrStdFields, function(index, cfg) {
			strFieldName = cfg.fieldName;
			strValue = getValueToDispayed(cfg);
			strValue = !isEmpty(strValue) ? strValue : '';
			ctrl = $('.' + strFieldName + strPostFix);
			ctrlDiv = $('.' + strFieldName + strPostFix + 'Div');
			if (ctrl && ctrlDiv && ctrlDiv.hasClass('hidden') && strFieldName !=="templateOrderBy")
				ctrlDiv.removeClass('hidden');
			if (strFieldName === 'prenote'
					|| strFieldName === 'useInMobilePayments'
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
						$('.' + cfg.fieldName + strPostFix).each(
								function(i, obj) {
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
						$('.' + cfg.fieldName + strPostFix).each(
								function(i, obj) {
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
							if(strFieldName === 'accountNo')
						ctrl.html(splitAccountSting(strValue));
							else
								ctrl.html(strValue);
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
				else{
					$(".controlTotal" + strPostFix + "Div").addClass('hidden');
					blnCountrTotalFieldHidden=false;
				}	
			} else if ((strFieldName === 'phdNotes' || strFieldName === 'phdAlerts')
					&& !isEmpty(strValue)) {
				isExtraInfoAvailable = true;
				ctrl.html(strValue || '');
			} else if ((strFieldName === 'bankProduct') && !isEmpty(strValue)) {
				//var posOfCurrency = strValue.indexOf('(');
				//var strCurrency = strValue.substr(posOfCurrency + 1, 3);
				//strValue = strValue.substr(0, posOfCurrency - 1);
				//ctrl.attr('title', strCurrency);
				ctrl.html(strValue || '');
			} else if (strFieldName === 'drawerDescription') {
				 !isEmpty(strValue) ? ctrl.removeClass('hidden') : ctrl.addClass('hidden');
				 ctrl.html(strValue || '');
			}  else if (strFieldName === 'defineApprovalMatrix'){
				// Handling for AVM Grid Start
				if(strValue === 'Y' && strEntryType === 'TEMPLATE' && !Ext.isEmpty(data && data.d
						&& data.d.paymentEntry 
						&& data.d.paymentEntry.templateApprovalMatrix)){
					$(".templateApprovalMatrix"+strPostFix).removeClass('hidden');
					defineAVMGrid('verify', 'B');
				}else if(strValue === 'N'){
					$(".templateApprovalMatrix"+strPostFix).addClass('hidden');
				}
				// Handling for AVM Grid End
			} else if (strFieldName === 'activationTime'){
				if(cfg.value === undefined || (!Ext.isEmpty(cfg.value) && cfg.value === "00:00")){
					ctrlDiv = $('.' + strFieldName + strPostFix + 'Div');
					$(ctrlDiv).addClass('hidden');
				} else if(!Ext.isEmpty(cfg.value)){
					ctrl = $('.' + strFieldName + strPostFix);
					ctrl.html(strValue || '&nbsp;');
				}
			} else if (strFieldName === 'accTrfType') {
				$('.' + cfg.fieldName + 'Field').addClass('hidden');
				if (cfg.value)
					$('.' + cfg.fieldName + cfg.value + '_HdrInfoSpan')
							.removeClass('hidden');
			} else if(strFieldName === 'whtApplicable' ){
				if(cfg.value && cfg.value === 'Y'){
					$('.whtApplicable_HdrInfo').removeClass('hidden');
				} else{
					$('.whtApplicable_HdrInfo').addClass('hidden');
				}
			} else if ('amount' === strFieldName && 'BILLPAYLAYOUT' === strLayoutType ){
				$('#amount_HdrInfo').autoNumeric('init', {
					aSep : strGroupSeparator,
					dGroup:strAmountDigitGroup,
					aDec : strDecimalSeparator,
					mDec : strAmountMinFraction,
					vMin : 0
				});
				$('#amount_HdrInfo').autoNumeric('set', strValue);
			} else if (strFieldName === 'templateOrderby') {
			     if(templateOrderbyhidden)
				    $('.templateOrderby_HdrInfoDiv').addClass('hidden');
				    ctrl.html(strValue || '');
		     }
		     else if (strFieldName === 'templateOrderbyColumn'){
		          if(templateOrderbyhidden)
					$('.templateOrderbyColumn_HdrInfoDiv').addClass('hidden');
					ctrl.html(strValue || '');
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
		//if (strEntryType === 'PAYMENT')
			//toggleRecurringPaymentParameterHdrFieldsViewOnlySectionVisibility();
	}

	if (objHdrInfo) {
		strHdrEnteredNo = objHdrInfo.hdrEnteredNo;
		strHdrEnteredAmount = setDigitAmtGroupFormat(objHdrInfo.hdrEnteredAmountFormatted);
		strHdrTotalNo = objHdrInfo.hdrTotalNo;
		if (jQuery.isNumeric(strHdrTotalNo)
				&& jQuery.isNumeric(strHdrEnteredNo)
				&& (strHdrTotalNo - strHdrEnteredNo >= 0))
			strHdrTotalNo = strHdrTotalNo - strHdrEnteredNo;
		strTotalAmount = setDigitAmtGroupFormat(objHdrInfo.balanceAmountFormatted);
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
		var prodDesc = null;
		prodDesc = objHdrInfo.hdrMyProductDescription;
		if('BILLPAYLAYOUT' === strLayoutType){
		    $('.hdrMyProductDescriptionTitle').attr("title",objHdrInfo.billerDesc);
		    $('.hdrMyProductDescriptionTitle').html(objHdrInfo.billerDesc || '');
		    $('#amount_HdrInfo').html(strHdrEnteredAmount);
		}else{
			$('.hdrMyProductDescriptionTitle').attr("title",objHdrInfo.hdrMyProductDescription);
            $('.hdrMyProductDescriptionTitle').html(prodDesc || '');
		}
		if (objHdrInfo.hdrDrCrFlag) {
			var drCrFlag = objHdrInfo.hdrDrCrFlag;
			if (strLayoutType === 'ACCTRFLAYOUT') {
				toggleAccountTransferHeaderAccountLabel(drCrFlag);
				$('.batchHeaderSectionLbl').text(drCrFlag === 'D'
						? getLabel('receiverDetails', 'Receiver Details')
						: getLabel('senderDetails', 'Sender Details'));
			}
		}
		if(blnCountrTotalFieldHidden && !isEmpty(strTotalAmount))
			$('.controlTotal_HdrInfoDiv').removeClass('hidden');
		/*
		 * if (objHdrInfo.hdrDrCrFlag === 'B' && strEntryType ==='TEMPLATE') {
		 * $('.drCrFlagC_HdrInfo,.drCrFlagD_HdrInfo').removeClass('hidden'); }
		 * else if (objHdrInfo.hdrDrCrFlag === 'C' || objHdrInfo.hdrDrCrFlag ===
		 * 'D') { $('.drCrFlag' + objHdrInfo.hdrDrCrFlag + '_HdrInfo')
		 * .removeClass('hidden'); } else {
		 * $('.drCrFlagC_HdrInfo,.drCrFlagD_HdrInfo').addClass('hidden'); }
		 */
		//$('.lastUpdateDateTimeText').html("You saved on "
		//		+ objHdrInfo.lastUpdateTime || '');
		//if (strEntryType === 'PAYMENT' || strEntryType === 'SI')
		//	$('.batchStatusText').html("Batch Status : " + objHdrInfo.hdrStatus
		//			|| '');
		//$('.siStatus' + strPostFix).text(objHdrInfo.hdrStatus || '');

		if (objHdrInfo.hdrSource) {
		
			$('.hdrSource_HdrInfo').text(objHdrInfo.hdrSource.length>40 ? objHdrInfo.hdrSource.substring(0,40)+'...' :objHdrInfo.hdrSource || '');
			if(objHdrInfo.hdrSource.length>40)
			{
				$('.hdrSource_HdrInfo').attr('title', objHdrInfo.hdrSource);
			}
		}

		handleLayoutSpecificSettingsForVerifyScreen(objHdrInfo,strPostFix);
	}
	if (data.d && data.d.paymentEntry && data.d.paymentEntry.paymentCompanyInfo) {
		var objInfo = data.d.paymentEntry.paymentCompanyInfo;
		var strText = !isEmpty(objInfo.company) ? objInfo.company : '';
		strText += '<br/>'
				+ (!isEmpty(objInfo.companyAddress)
						? objInfo.companyAddress
						: '');
		$('.companyInfoHdr').html(strText);
	}

	if (data.d && data.d.paymentHeaderInfo
			&& data.d.paymentHeaderInfo.hdrDrCrFlag && !isEmpty(strLayoutType)
			&& strLayoutType === 'ACCTRFLAYOUT') {
		toggleAccountTransferHeaderAccountLabel(data.d.paymentHeaderInfo.hdrDrCrFlag);
	}

	if (data && data.d && data.d.paymentEntry
			&& data.d.paymentEntry.enrichments) {
		paintPaymentHdrViewOnlyEnrichments(data.d.paymentEntry.enrichments,
				true);
	}
	
	if (!isEmpty(objHdrInfo.hdrTemplateNoOfExec)) {
		$('#templateNoOfExecSpanView')
			.html(objHdrInfo.hdrTemplateNoOfExec);
	} else {
		$('#templateNoOfExecSpanView').html('0');
	}
	//Performance
	/*if (charBatch === 'Y') {
		$("#paymentHeadeerTrasanctionSummaryDiv .canClear").empty();
		paintPaymentHdrAdditionalInformationSection('B', 'VERIFY');
	}*/

	// Handle Verification Page Extra Info Label
	//if (isExtraInfoAvailable) {
	//	$('.extraInfoAvailable_InfoSpan').removeClass('hidden');
	//	$('.noExtraInfoAvailable_InfoSpan').addClass('hidden');
	//}
	toggleContainerVisibility('verificationStepDiv');
	toggleContainerVisibility('paymentVerifyExtraDiv');

	if (objInstrumentEntryGrid) {
		$('#paymentInstActionCt').appendTo($('#paymentInstActionParentCt'));
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
		$('#paymentInstActionCt').appendTo($('#paymentInstActionParentCt'));
		objInstrumentEntryGrid.removeAll(true);
		objInstrumentEntryGrid.destroy(true);
	}
	objInstrumentEntryGrid = null;
	doHandleEntryGridLoading(true, isEnableGridAction,isEnableRowAction);
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
function doHandleBackClick() {
	getHeaderBackConfirmationPopup();
}
function isHeaderDiscardAllowed() {
	var blnRetValue = false;
	if (paymentResponseHeaderData
			&& paymentResponseHeaderData.d
			&& paymentResponseHeaderData.d.paymentEntry
			&& paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo
			&& (paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.hdrActionStatus === '0'
					|| paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.hdrActionStatus === '101' || paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.hdrActionStatus === '4' || paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.hdrActionStatus === '9'))
		blnRetValue = true;
	return blnRetValue;

}
function createHeaderBackButton() {
	var btnBack = null, blnDiscardAllowed = false;
	btnBack = createButton('btnBack', 'S');
	btnBack.click(function() {
				goToPage(_mapUrl['cancelBatchUrl'], 'frmMain');
			});
	/**
	 * This is used to navigate back to 1st step from 2nd step in add mode.
	 * Currently handled for payment,template only, will be handled for SI/TEmplate in
	 * next sprint sprint 4
	 */
	if ((strEntryType === 'PAYMENT' || strEntryType === 'TEMPLATE' || strEntryType === 'SI') && (strAction === 'ADD' || strAction === 'TEMPLATE')) {
		btnBack.unbind("click");
		blnDiscardAllowed = isHeaderDiscardAllowed();
		if (blnDiscardAllowed) {
			btnBack.click(function() {
				if (objInstrumentEntryGrid
						&& objInstrumentEntryGrid.isRecordInEditMode()) {
					objInstrumentEntryGrid.doHandleRecordSaveOnFocusOut(
							doHandleBackClick, [_mapUrl['backHeaderUrl'],
									'frmMain']);
				} else {
					getHeaderBackConfirmationPopup();
				}
			});

		} else {
			btnBack.click(function() {
						goToPage(_mapUrl['backHeaderUrl'], 'frmMain');
					});
		}
	}
	return btnBack;
}
function getHeaderBackConfirmationPopup(){
	var _objDialog = $('#backConfirmationPopup');
	_objDialog.dialog({
				bgiframe : true,
				autoOpen : false,
				modal : true,
				resizable : false,
				width : "320px",
				buttons : [
					{
						text:getLabel('btnOk','Ok'),
						click : function() {
							$(this).dialog("close");
							doHandlePaymentHeaderActions('ignore', '', 'backHeaderUrl');
							goToPage(_mapUrl['backHeaderUrl'], 'frmMain');
						}
					},
					{
						text:getLabel('btncancel','Cancel'),
						click : function() {
							$(this).dialog('destroy');
						}
					}]
			});
	_objDialog.dialog('open');
}
function paintTemplateActions(strAction) {
	var elt = null, btnBack = null, btnCancel = null, btnClose = null;
	$(' #paymentHdrActionButtonListLB, #paymentHdrActionButtonListRB')
			.empty();
	var strBtnLTLB = '#paymentHdrActionButtonListLB';
	var strBtnRTRB = '#paymentHdrActionButtonListRB';
	btnBack = createButton('btnBack', 'S');
	btnBack.click(function() {
		if (objInstrumentEntryGrid
				&& objInstrumentEntryGrid.isRecordInEditMode()) {
			objInstrumentEntryGrid.doHandleRecordSaveOnFocusOut(
					getTmpBackConfirmationPopup, ['B']);
		} else
			getTmpBackConfirmationPopup('B');
		
	});

	if (strAction === 'EDITNEXT') {
		elt = createButton('btnVerify', 'P');
		elt.click(function() {
					if (objInstrumentEntryGrid
							&& objInstrumentEntryGrid.isRecordInEditMode()) {
						isButtonClicked = true ;
						objInstrumentEntryGrid.doHandleRecordSaveOnFocusOut(
								doUpdateAndNextPaymentHeader, null, null, null, true);
					} else
						doUpdateAndNextPaymentHeader();
				}
		);
		elt.bind("keydown",function(){
			autoFocusOnFirstElement(event, 'mainPageDiv',false);
				});
		elt.appendTo($(strBtnRTRB));

		btnBack.unbind("click");
		btnBack = createButton('btnBack', 'S');
		btnBack.click(function() {
					if (objInstrumentEntryGrid
							&& objInstrumentEntryGrid.isRecordInEditMode()) {
						isButtonClicked = true ;
						objInstrumentEntryGrid.doHandleRecordSaveOnFocusOut(
								getTmpBackConfirmationPopup, ['B']);
					} else
						getTmpBackConfirmationPopup('B');
					
				});

		btnBack.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
		toggleInstrumentInitiationAction();
	}
	//$("input:enabled:visible:first, select:enabled:visible:first, button:enabled:visible:first").focus();
	
	autoFocusFirstElement();
}
function paintPaymentHeaderActions(strAction) {
	var elt = null, btnBack = null, btnCancel = null, btnClose = null;
	$(' #paymentHdrActionButtonListLB, #paymentHdrActionButtonListRB')
			.empty();//#paymentHdrActionButtonListLT,#paymentHdrActionButtonListRT,
	var strBtnLTLB = '#paymentHdrActionButtonListLB';//#paymentHdrActionButtonListLT
	var strBtnRTRB = '#paymentHdrActionButtonListRB';//#paymentHdrActionButtonListRT
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
		elt.blur(function(e) {
			e.stopImmediatePropagation();
		});
		elt.bind("keydown",function(){
			autoFocusOnFirstElement(event, 'paymentHdrActionBottomContainer',false);
		});
		elt.appendTo($(strBtnRTRB));
		//$(strBtnRTRB).append("&nbsp;");

		btnBack.unbind("click");
		btnBack.click(function() {
					doBackPaymentVerification();
				});
		btnBack.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");

		btnClose = createButton('btnClose', 'L');
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
		//$(strBtnRTRB).append("&nbsp;");
		btnBack.unbind("click");
		btnBack = createHeaderBackButton();
		/*btnBack.click(function() {
					if (objInstrumentEntryGrid
							&& objInstrumentEntryGrid.isRecordInEditMode()) {
						objInstrumentEntryGrid.doHandleRecordSaveOnFocusOut(
								goToPage,
								[_mapUrl['cancelBatchUrl'], 'frmMain']);
					} else
						goToPage(_mapUrl['cancelBatchUrl'], 'frmMain');
				});*/
		btnBack.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
		btnCancel.appendTo($(strBtnLTLB));

	} else if (strAction === 'EDITNEXT') {
		elt = createButton('btnVerify', 'P');
		elt.click(function() {
					if (objInstrumentEntryGrid
							&& objInstrumentEntryGrid.isRecordInEditMode()) {
						isButtonClicked = true ;
						objInstrumentEntryGrid.doHandleRecordSaveOnFocusOut(
								doUpdateAndNextPaymentHeader, null, null, null, true);
					} else{
						var obj = $(this);
						obj.prop('disabled', true);
						doUpdateAndNextPaymentHeader();
						setTimeout(function () {obj.prop('disabled', false); }, 1000);
					}
						
				});
		elt.bind("keydown",function(){
			autoFocusOnFirstElement(event, 'mainPageDiv',false);
		});		
		elt.appendTo($(strBtnRTRB));
		//$(strBtnRTRB).append("&nbsp;");

		btnBack.unbind("click");
		btnBack = createHeaderBackButton();
		/*btnBack.click(function() {
					if (objInstrumentEntryGrid
							&& objInstrumentEntryGrid.isRecordInEditMode()) {
						objInstrumentEntryGrid.doHandleRecordSaveOnFocusOut(
								goToPage,
								[_mapUrl['cancelBatchUrl'], 'frmMain']);
					} else
						goToPage(_mapUrl['cancelBatchUrl'], 'frmMain');
				});*/
		btnBack.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");

		if(!Ext.isEmpty(user_button_mask) && isActionEnabled(user_button_mask,8)) {
			elt = createButton('btnDiscard', 'L');
			elt.click(function() {
					// doHandlePaymentHeaderActions('discard');
					if (objInstrumentEntryGrid
							&& objInstrumentEntryGrid.isRecordInEditMode()) {
						isButtonClicked = true ;
						objInstrumentEntryGrid.doHandleRecordSaveOnFocusOut(
								getDiscardConfirmationPopup, ['B']);
					} else
						getDiscardConfirmationPopup('B');
				});
			elt.appendTo($(strBtnLTLB));
		}
		toggleInstrumentInitiationAction();
	} else if (strAction === 'CANCELONLY') {
		btnBack.appendTo($(strBtnLTLB));
	} else if (strAction === 'ADD') {
		elt = createButton('btnSave', 'P');
		elt.click(function() {
					doSavePaymentHeader();
				});
		elt.appendTo($(strBtnRTRB));
		//$(strBtnRTRB).append("&nbsp;");
		btnBack.unbind("click");
		btnBack = createHeaderBackButton();
		btnBack.appendTo($(strBtnLTLB));
	}
	autoFocusFirstElement();
}
function paintPaymentHeaderActionsForView(strAction) {
	var elt = null, btnBack = null, btnDiscard = null, btnSubmit = null, btnDisable = null, btnEnable = null;
	$('#paymentHdrActionButtonListLB, #paymentHdrActionButtonListRB')
			.empty();//#paymentHdrActionButtonListLT,#paymentHdrActionButtonListRT
	var strBtnLTLB = '#paymentHdrActionButtonListLB';//#paymentHdrActionButtonListLT
	var strBtnRTRB = '#paymentHdrActionButtonListRB';//#paymentHdrActionButtonListRT,
	btnBack = createButton('btnBack', 'S');
	btnBack.click(function() {
				goToPage(_mapUrl['cancelBatchUrl'], 'frmMain');
			});
	btnBack.bind("keydown",function(){
		restrictTabKey(event);
	})		

	btnDiscard = createButton('btnDiscard', 'P');
	btnDiscard.click(function() {
				// doHandlePaymentHeaderActions('discard');
				getDiscardConfirmationPopup('B');
			});

	if (strAction === 'SUBMIT') {
		btnDiscard.appendTo($(strBtnRTRB));
		//$(strBtnRTRB).append("&nbsp;");

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
		strAuthLevel, strParentId, strDetailId, strShowAdvice,isRekeyApplicable, record) {
	if (!isEmpty(strMask)) {
		var elt = null, linkCancel = null, eltSpacer = null, eltCancel = null;
		var isAuth = isInstrumentActionEnabled(strMask, 6);
		var isReject = isInstrumentActionEnabled(strMask, 7);
		var isDiscard = isInstrumentActionEnabled(strMask, 9);
		var isSend = isInstrumentActionEnabled(strMask, 8);
		var isVerify = isInstrumentActionEnabled(strMask, 13);
		var strBtnRTRB = '#paymentDtlActionButtonListRT,#paymentDtlActionButtonListRB';
		var strBtnLTLB = '#paymentDtlActionButtonListLT,#paymentDtlActionButtonListLB';
		$(strBtnLTLB).empty();
		$(strBtnRTRB).empty();
//isRekeyApplicable = 'Y';// need to remove
		if(strEntityType == '1' && isPulledToBank == 'Y'){
				$(strBtnRTRB).empty();
		}
		else
		{
			if (isAuth === true && strAuthLevel === 'I') {
				$(strBtnRTRB).empty();
				elt = createButton('btnApprove', 'P');
				elt.click(function(){
							if('Y' === isRekeyApplicable && strEntryType==='PAYMENT' && record)
								showApprovalReKeyConfirmationTxnPopup('', '', '',[record], 'TXNWIZVIEW', '');
							else if('Y' === chrApprovalConfirmationAllowed && strEntryType==='PAYMENT')
								showApprovalConfirmationPopup('auth','Q');
							else
								doHandlePaymentInstrumentAction('auth', false);
						});
				elt.appendTo($(strBtnRTRB));
				//$(strBtnRTRB).append("&nbsp;");

			}
			
			if (isVerify === true && strAuthLevel === 'I' && !isAuth ) {
				isReject = true ;
				$(strBtnRTRB).empty();
				elt = createButton('btnVerify', 'P');
				elt.click(function(){
							doHandlePaymentInstrumentAction('verify', false);
						});
				elt.appendTo($(strBtnRTRB));
				//$(strBtnRTRB).append("&nbsp;");

			}
		
			if (isReject === true && strAuthLevel === 'I') {
				if (!isAuth && !isVerify)
					$(strBtnRTRB).empty();
				elt = createButton('btnReject', 'P');
				elt.click(function() {
							doHandleRejectAction('reject', 'Q', false);
						});
				elt.appendTo($(strBtnRTRB));
			}
			if(strShowAdvice === 'Y'){
				elt = createButton('btnPaymentAdvice', 'S');
				$(strBtnRTRB).prepend("&nbsp;");
				elt.unbind('click');
				elt.click(function(){
					var arrayJson = new Array()
					arrayJson.push({
								serialNo : 0,
								identifier : strPaymentInstrumentIde
							});
							$.download(_mapUrl['paymentAdvice'], arrayJson);
					});
				$(strBtnRTRB).prepend(elt);
					
			}
			if (isDiscard === true) {			
			elt = createButton('btnDiscard', 'P');
			elt.click(function(){						
							doHandleDiscardAction('discard', 'Q');
					});
			elt.appendTo($(strBtnLTLB));
			//$(strBtnRTRB).append("&nbsp;");

			}
			if (isInstLvlSend === 'true' && isSend === true && strAuthLevel === 'I') {
				if (!isAuth)
					$(strBtnRTRB).empty();
				elt = createButton('btnSend', 'P');
				elt.click(function() {
							doHandlePaymentInstrumentAction('InstSend', false);
						});
				elt.appendTo($(strBtnRTRB));
			}
		}
		elt = createButton('btnClose', 'S', strAction);
		elt.click(function() {
					doCancelViewBatchInstrument(strAction);
				});
		$(strBtnLTLB).append("&nbsp;");
		elt.appendTo($(strBtnLTLB));
		
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
					strAuthLevel, strParentId, null, data.showPaymentAdvice, data.recKeyValidation,data);
		} else
			doHandleUnknownErrorForBatch();
	}
}
function paintPaymentDetailGroupActions(strMask, strAction, strAuthLevel,
		strParentId, strDetailId, strShowAdvice, isRekeyApplicable,paymentHeaderInfo) {
	// TODO : strAction, strDetailId to be removed, not being used
	if (!isEmpty(strMask)) {
		var elt = null, linkCancel = null, eltSpacer = null;
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
		if(strShowAdvice === 'Y'){
			elt = createButton('btnDebitAdvice', 'S');
			//$(strBtnRTRB).append("&nbsp;");
			elt.appendTo($(strBtnRTRB));
			elt.click(function() {
				var arrayJson = new Array()
				arrayJson.push({
							serialNo : 0,
							identifier : strPaymentHeaderIde
						});
						$.download(_mapUrl['debitAdvice'], arrayJson);
				});
		}
		if (isAuth === true) {
			if(strEntityType == '1' && isPulledToBank == 'Y'){
				$(strBtnRTRB).empty();
			}
			else
			{
				$(strBtnRTRB).empty();
				if (null != strAuthLevel && "I" === strAuthLevel) {
					elt = createButton('btnAuthorizeAll', 'P');
					elt.click(function() {
							if('Y' === chrApprovalConfirmationAllowed && strEntryType==='PAYMENT'){
								$('#approveMsg').addClass('hidden');
								$('#approveAllMsg').removeClass('hidden');
								showApprovalConfirmationPopup('auth','B');
							}
								
							else 
								doHandlePaymentHeaderActions('auth');
						});
				} else {
					elt = createButton('btnApprove', 'P');
					elt.click(function() {
							if('Y' === isRekeyApplicable && strEntryType==='PAYMENT')
								showReKeyViewScreenPopup ();
							else if('Y' === chrApprovalConfirmationAllowed && strEntryType==='PAYMENT')
								showApprovalConfirmationPopup('auth','B');
							else
								doHandlePaymentHeaderActions('auth');
						});
				}
				
				elt.appendTo($(strBtnRTRB));
				//$(strBtnRTRB).append("&nbsp;");
			}
		}
		if ((isReject === true && isAuth === true) 
				|| (isReject === true && isVerify === true && !isAuth )) {
			if(strEntityType == '1' && isPulledToBank == 'Y'){
				$(strBtnRTRB).empty();
			}
			else
			{
				if (!isAuth)
					$(strBtnRTRB).empty();
					
				if (null != strAuthLevel && "I" === strAuthLevel)
				{
					elt = createButton('btnRejectAll', 'P');
					elt.click(function() {
							doHandleRejectAction('reject', 'B');
						});
				}
				else
				{
					elt = createButton('btnReject', 'P');
					elt.click(function() {
							doHandleRejectAction('reject', 'B');
						});
				}
				elt.appendTo($(strBtnRTRB));
			}
		}
		
		if (isSend === true && !isAuth) {
			if(strEntityType == '1' && isPulledToBank == 'Y'){
				$(strBtnRTRB).empty();
			}
			else
			{
			$(strBtnRTRB).empty();
			if (null != strAuthLevel && "I" === strAuthLevel && isInstLvlSend === 'true') {
				elt = createButton('btnSendAll', 'P');
				elt.click(function() {
							$('#sendAllMsg').removeClass('hidden');
							showSendAllConfirmationPopup('InstSend');
					});
			} else {
				elt = createButton('btnSend', 'P');
				elt.click(function() {
							doHandlePaymentHeaderActions('send');
						});
			}
				elt.appendTo($(strBtnRTRB));
			}
		}

		if (isHold === true && !isAuth) {
			elt = createButton('btnHold', 'P');
			elt.click(function() {
						doHandlePaymentHeaderActions('hold');
					});
			//$(strBtnRTRB).append("&nbsp;");
			elt.appendTo($(strBtnRTRB));
		}

		if (isRelease === true && !isAuth) {
			elt = createButton('btnRelease', 'P');
			elt.click(function() {
						doHandlePaymentHeaderActions('release');
					});
			//$(strBtnRTRB).append("&nbsp;");
			elt.appendTo($(strBtnRTRB));
		}

		if (isStop === true && !isAuth) {
			elt = createButton('btnStop', 'P');
			elt.click(function() {
						getTxnCancelConfirmationPopup('B');
					});
			//$(strBtnRTRB).append("&nbsp;");
			elt.appendTo($(strBtnRTRB));
		}

		if (isVerify === true && !isAuth ) {
			
			if (null != strAuthLevel && "I" === strAuthLevel) {
				elt = createButton('btnVerifyAll', 'P');
				elt.click(function() {
					$('#verifyAllMsg').removeClass('hidden');
					showVerifyConfirmationPopup('verify','B');
					});
			} else {
				elt = createButton('btnVerify', 'P');
				elt.click(function() {
					showVerifyConfirmationPopup('verify','B');
					});
			}
			
			elt.appendTo($(strBtnRTRB));
			toggleInstrumentInitiationAction();
		}
		
		if((paymentHeaderInfo.hdrVerifiedCnt > 0 || paymentHeaderInfo.hdrVerifierRejectedInst > 0) && paymentHeaderInfo.canBatchSplit == "Y")
		{
			elt = createButton('btnVerifySubmit', 'P');
			elt.click(function() {
				//doVerifySubmitPaymentHeader() ;
				if(paymentHeaderInfo.hdrActionStatus == '108' && paymentHeaderInfo.hdrDeletedInst == 0)
				{
					doVerifySubmitPaymentHeader() ;
				}
				else
				{
					showVerifySubmitConfirmationPopup();
				}
				
				});
			
			elt.appendTo($(strBtnRTRB));
		}
		
//		if(strShowAdvice === 'Y'){
//			elt = createButton('btnDebitAdvice', 'S');
//			//$(strBtnRTRB).append("&nbsp;");
//			elt.appendTo($(strBtnRTRB));
//			elt.click(function() {
//				var arrayJson = new Array()
//				arrayJson.push({
//							serialNo : 0,
//							identifier : strPaymentHeaderIde
//						});
//						$.download(_mapUrl['debitAdvice'], arrayJson);
//				});
//		}
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
	var arrFields = [], clsHide = 'hidden', strFieldName = null;
	var isCcyMismatch = isCurrencyMissMatchForHeader(), blnForexAtHeaderLevel = isForexAtHeaderLevel();

	if (data) {
		jsonPost = cloneObject(data);
		delete jsonPost['d']['paymentEntry']['message'];
		if (data && data.d && data.d.paymentEntry) {
			if (data.d.paymentEntry.standardField)
				arrFields = data.d.paymentEntry.standardField;
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
								var freq;
								freq = $("#siFrequencyCodeHdr").val();
								if (cfg.fieldName === 'refDay' && freq === 'SPECIFICDAY') {
									objVal = $("#refDayHdr").getMultiSelectValue().join(',');
								}
							}
							// jquery autoNumeric formatting
						}

						if (strFieldName === 'lockFieldsMaskHdr') {
							var arrObj = generateSortAvalValArray(cfg.availableValues);
							$('#lockFieldsMaskHdr option').attr('disabled',
									false);
							var strTempType = $('input[name="templateTypeHdr"]:radio:checked')
										.val();
							objVal = generateControFiledMask(arrObj, field
											.val(), strTempType);
							doDisableDefaultLockFields('B', strTempType);
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
							}else if (strFieldName === 'defineApprovalMatrixHdr'){
								if($("#defineApprovalMatrixHdr").prop('checked') == true)
									objVal = 'Y';
								else 
									objVal = 'N';
								jsonField = cloneObject(cfg);
								jsonField.value = objVal;
								jsonArrStdFields.push(jsonField);
							}
							else {
								jsonField = cloneObject(cfg);
								jsonField.value = objVal;
								jsonArrStdFields.push(jsonField);
							}
						} else if(cfg.fieldName === 'activationTime') {
							jsonField = cloneObject(cfg);
							var hours = $('#effectiveTimeHrHdr').val();
							var minutes = $('#effectiveTimeMinHdr').val();
							objVal = hours + ":" + minutes;
							jsonField.value = objVal;
							jsonArrStdFields.push(jsonField);
						} else {
							jsonField = cloneObject(cfg);
							jsonField.value = objVal;
							jsonArrStdFields.push(jsonField);
						}
					}
				}
			});
			jsonPost.d.paymentEntry.standardField = jsonArrStdFields;
			// ============= Enrichment Info Node population =============
			if (data.d.paymentEntry.enrichments) {
				arrFields = [];
				if (data.d.paymentEntry.enrichments.udeEnrichment) {
					arrFields = data.d.paymentEntry.enrichments.udeEnrichment.parameters;
					jsonPost.d.paymentEntry.enrichments.udeEnrichment.parameters = getHeaderEnrichFieldJsonArray(
							arrFields, 'enrude_');
				}

			}
			
			//======================== AVM definationjson population ================
			if(strEntryType === 'TEMPLATE'){
				if(data.d.paymentEntry.templateApprovalMatrix){
					if($("#defineApprovalMatrixHdr").prop('checked') == true)
						jsonPost.d.paymentEntry.templateApprovalMatrix = generateJsonForApprovalMatrix();
					else
						jsonPost.d.paymentEntry.templateApprovalMatrix = [];
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
							
						if (cfg.displayType === 11) {
							cfg.value = $('input[name=' + cfg.code
									+ ']:radio:checked').val();
							cfg.string = cfg.value;

							arrRet.push(cfg);
						} else if (cfg.displayType === 10) {
							cfg.value = 'N';
							cfg.string = cfg.value;
							var c = $('input[id=' + cfg.code + ']')
									.is(':checked');
							if (c) {
								cfg.value = 'Y';
								cfg.string = cfg.value;
							}
							arrRet.push(cfg);
						} else if (cfg.displayType === 4 && cfg.allowAdhocValue) {
							cfg.value = isEmpty($(field).val()) ? $(field)
									.attr('editableValue') : $(field).val();
							cfg.string = cfg.value;
							arrRet.push(cfg);
						} else if (canAdd) {
							var blnAutoNumeric = isAutoNumericApplied(fieldName);
							if( blnAutoNumeric ) {
								jsonField.value = field.autoNumeric('get');
								jsonField.string = field.autoNumeric('get');
							} else {
								jsonField.value = field.val();
								jsonField.string = field.val();
							}
							arrRet.push(jsonField);
						}
					}
				});
	return arrRet;
}

// ========================== Helper Function Starts ==========================
function handleDrCrFlagPaymentHeader(cfg) {
	var strType = "checkbox";
	if (strLayoutType === 'WIRELAYOUT' || strLayoutType === 'WIRESWIFTLAYOUT' || strLayoutType === 'ACCTRFLAYOUT')
		strType = "radio";
	if (cfg && cfg.value && 'D' === cfg.value && 'true' === cfg.readOnly) {
		if($('#drCrFlaglblDiv').length >0 )
			$('#drCrFlaglblDiv').addClass('hidden');
		$('#drCrFlagHdrDiv').html("");
		var strDrCrLabel = !isEmpty(mapDrCrReadonlyLabel[strPaymentType][cfg.value][strLayoutType])
				? mapDrCrReadonlyLabel[strPaymentType][cfg.value][strLayoutType]
				: getLabel('debitTransaction', 'Debit');
		$('<div class="form-group"><label>'+ getLabel('transactionType', 'Transaction Type') +'</label><br><span>' + strDrCrLabel + '</span>')
				.appendTo($('<div>', {
							//'class' : 'col-sm-12'
						}).appendTo($('#drCrFlagHdrDiv')));
		$('#drCrFlagHdrDiv').removeClass('row');
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
		if($('#drCrFlaglblDiv').length >0 )
			$('#drCrFlaglblDiv').addClass('hidden');
		var strDrCrLabel = !isEmpty(mapDrCrReadonlyLabel[strPaymentType][cfg.value][strLayoutType])
				? mapDrCrReadonlyLabel[strPaymentType][cfg.value][strLayoutType]
				: 'Credit';
		$('<div class="form-group"><label>'+ getLabel('transactionType', 'Transaction Type') +'</label><br><span>' + strDrCrLabel + '</span>')
				.appendTo($('<div>', {
							//'class' : 'col-sm-12'
						}).appendTo($('#drCrFlagHdrDiv')));
		$('#drCrFlagHdrDiv').removeClass('row');
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
						? getLabel('receiverDetails', 'Receiver Details')
						: getLabel('senderDetails', 'Sender Details'));
	}
}
function handleDrCrFlagOnViewPaymentHeader(cfg, strPostFix, strValue) {
	if (cfg && cfg.value && cfg.readOnly && 'true' === cfg.readOnly) {
		var strDrCrLabel = cfg.value !== 'B'
				&& !isEmpty(mapDrCrReadonlyLabel[strPaymentType][cfg.value][strLayoutType])
				? mapDrCrReadonlyLabel[strPaymentType][cfg.value][strLayoutType]
				: cfg.value === 'D' ? getLabel('debitTransaction', 'Debit')
						: getLabel('creditTransaction', 'Credit');

		if ('D' === cfg.value) {
			if($('#drCrFlaglblDiv').length >0 )
				$('#drCrFlaglblDiv').addClass('hidden');
			$('.drCrFlagD' + strPostFix).empty();
			$('.drCrFlagD' + strPostFix).removeClass('hidden');
			$('<div class="form-group"><label>'+ getLabel('transactionType', 'Transaction Type') +' :</label><br><span>'
					+ strDrCrLabel + '</span></div>').appendTo($('.drCrFlagD'
					+ strPostFix));
		} else if ('C' === cfg.value) {
			if($('#drCrFlaglblDiv').length >0 )
				$('#drCrFlaglblDiv').addClass('hidden');
			$('.drCrFlagC' + strPostFix).empty();
			if(cfg.displayMode == '1'){
				$('.drCrFlagC' + strPostFix).addClass('hidden');
			}
			else{
				$('.drCrFlagC' + strPostFix).removeClass('hidden');
			}
			$('<div class="form-group"><label>'+ getLabel('transactionType', 'Transaction Type') +' :</label><br><span>'
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
						? getLabel('receiverDetails', 'Receiver Details')
						: getLabel('senderDetails', 'Sender Details'));
	}
}
function handleForexForPaymentHeader() {
	handleChangeRateType();
}
function handleChangeRateType() {
	var clsHide = 'hidden', clsReq = 'required';
	var strRateType = $('#rateTypeHdr').val();
	if (strRateType === '1') {
		$('#contractRefNoHdr').attr('disabled', false);
		$('#contractRefNoHdr').removeClass('disabled');
		$('#contractRefNoHdrLbl').addClass('required');
		$('#contractRefNoHdrDiv').removeClass('hidden');
		$('#contractRefNoHdr').blur(function mark() {
					markRequired($(this));
				});
		$('#contractRefNoHdr').focus(function () {
			removeMarkRequired($(this));
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
	var txnAmount = null, contractRef = null, regExp = /\(([^)]+)\)$/, matches = null, buyerCcy = null, sellerCcy = null;
	var fxRateType = '0', strAccount = '', tempAccountObj = '', arrAccounts = null, strAccountList = null;

	if (data && data.d && data.d.paymentEntry
			&& data.d.paymentEntry.standardField) {
		var arrStdFields = data.d.paymentEntry.standardField;
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
	if(isCcyMissMatch && strLayoutType =='CASHLAYOUT'){
		getFXForHeader(buyerCcy, sellerCcy);
	}
	return isCcyMissMatch;
}
function isCurrencyMissMatchForHeaderViewOnly(sellerCcy, buyerCcy) {
	var retvalue = false;
	if (!isEmpty(buyerCcy) && !isEmpty(sellerCcy) && (buyerCcy != sellerCcy))
		retvalue = true;
	return retvalue;
}
function handleCurrencyMissmatchForPaymentHeader(isOnChange) {
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
	 $('#accountNoHdrCcy').text(!isEmpty(buyerCcy) ? '('+buyerCcy+')' : '');
	isCcyMissMatch = isCurrencyMissMatchForHeader();
	if (isCcyMissMatch && blnForexAtHeaderLevel && isFxContractAvlblForHeader()) {
		$('#rateTypeHdrDiv').removeClass(clsHide);
		$('#rateTypeHdrLbl').addClass(clsReq);
		$('#fxRateHdrDiv').addClass(clsHide);
		$('#fxRateHdrLbl').removeClass(clsReq);		
		$('#contractRefNoHdr').ContractRefNoAutoComplete(buyerCcy, sellerCcy);
		$('#rateTypeHdr').blur(function mark() {
					markRequired($(this));
				});
		$('#rateTypeHdr').focus(function () {
			removeMarkRequired($(this));
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
						$('#amountHdr').ForceNumericOnly(11, 2);
					}
					//Commenting below code as it's truncating amount after comma
					if (false && !isEmpty($('#amountHdr').val())) {
						var txnAmount = $('#amountHdr').val();
						txnAmount = parseFloat(txnAmount);
						$('#amountHdr').val(txnAmount.toFixed(2));
					}
					changeHdrButtonVisibility();
				});
	} else {
		$("#rateTypeHdr").val('0');
		$('#rateTypeHdrDiv, #contractRefNoHdrDiv').addClass(clsHide);
		$('#rateTypeHdrLbl, #contractRefNoHdrLbl').removeClass(clsReq);
		$('#fxRateHdrDiv').addClass(clsHide);
		$('#fxRateHdrLbl').removeClass(clsReq);		
		$('#contractRefNoHdr').attr('disabled', true);
		$('#contractRefNoHdr').addClass('disabled');
		$('#rateTypeHdr').unbind('blur');
		$('#rateTypeHdr').removeClass('requiredField');
		$('#fxSpanHdr').remove();
	}
	var instrumentId = strPrdID;
	if(instrumentId == '93' || instrumentId == '94' ){
		var debitAccountLevel = null;
		if(isEmpty(chrDebitAccountLevel)){
			debitAccountLevel = paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.accountLevel;
		}else{
			debitAccountLevel = chrDebitAccountLevel;
		}
		setIbanNoField(charPaymentType,debitAccountLevel,isOnChange);
	}	
}


function isFxContractAvlblForHeader() {
	var blnRet = false;
	var data = paymentResponseHeaderData;
	if (data && data.d && data.d.paymentEntry
			&& data.d.paymentEntry.paymentHeaderInfo
			&& !isEmpty(data.d.paymentEntry.paymentHeaderInfo.allowContractFX)
			&& data.d.paymentEntry.paymentHeaderInfo.allowContractFX == true)
		blnRet = true;
	return blnRet;
}
function isForexAtHeaderLevel() {
	var blnRet = false;
	var data = paymentResponseHeaderData;
	if (data && data.d && data.d.paymentEntry
			&& data.d.paymentEntry.paymentHeaderInfo
			&& data.d.paymentEntry.paymentHeaderInfo.fxLevel
			&& data.d.paymentEntry.paymentHeaderInfo.fxLevel === 'B')
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
	if(isChecked === false){
		$('#siEffectiveDateHdr,#siTerminationDateHdr,#siNextExecutionDateHdr').val('');
		$("#siFrequencyCodeHdr option:first").attr('selected','selected');
		$("#periodHdr option:first").attr('selected','selected');
		if (startDayOfWeek) {
			$('#refDayHdr').val(startDayOfWeek);
		}else {
		$("#refDayHdr option:first").attr('selected','selected');
		}
		$("#holidayActionHdr option:first").attr('selected','selected');
		$("#siFrequencyCodeHdr,#holidayActionHdr, #periodHdr, #refDayHdr").niceSelect('update');
		var arrFields = paymentResponseHeaderData
				&& paymentResponseHeaderData.d
				&& paymentResponseHeaderData.d.paymentEntry
				&& paymentResponseHeaderData.d.paymentEntry.standardField
				? paymentResponseHeaderData.d.paymentEntry.standardField
				: [];
		if (arrFields.length > 0) {
			$.each(arrFields, function(index, item) {
						if (item.fieldName === 'siEffectiveDate'
								&& !isEmpty(item.value)) {
							$('#siEffectiveDateHdr').val(item.value);
							showNextDateOnPaymentScreen(strPaymentType);
						}
					});
		}
		populateSIProcessing('B');
	}
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
	if (data && data.d && data.d.paymentEntry) {
		arrJSON = data.d.paymentEntry.standardField;
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
	paymentHeaderEnrichmentValidation();
}
/* Template : Add/Remove validations on change of control fields starts */
function handleTemplateTypeChangeB(strTemplateType) {
	var blnUseInMobile=false;
	blnUseInMobile = isUseInMobileApplicable(paymentResponseHeaderData);
	handleTemplateTypeChange(strTemplateType, 'B',blnUseInMobile);
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
	if (data && data.d && data.d.paymentEntry) {
		arrJSON = data.d.paymentEntry.standardField;
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
	paymentHeaderEnrichmentValidation();
}
/* Template : Add/Remove validations on change of control fields ends */
function initatePaymentHeaderValidation() {
	var field = null, fieldId = null;
	changeHdrButtonVisibility();
	$('#paymentHeaderEntryStep2 label.required').each(function() {
				fieldId = $(this).attr('for');
				field = $('#' + fieldId);
				if($('#' + fieldId).hasClass('jq-editable-combo'))
					field = $('#' + fieldId + "_jq");
				if($('#' + fieldId).hasClass('jq-nice-select'))
					field = $('#' + fieldId + "-niceSelect");	
				if (field && field.length != 0) {
					field.bind('blur', function () {
								markRequired($(this));
								changeHdrButtonVisibility();
							});
					field.bind('focus', function () {
						removeMarkRequired($(this));
						changeHdrButtonVisibility();
					});
				}
			});
}
function paymentHeaderEnrichmentValidation() {
	var field = null, fieldId = null;
	changeHdrButtonVisibility();
	$('#paymentHdrUdeEnrichDiv label.required').each(function() {
				fieldId = $(this).attr('for');
				field = $('#enrude_' + fieldId);
				if(field.hasClass('jq-editable-combo'))
					field = $('#enrude_' + fieldId + "_jq");
				if(field.hasClass('jq-nice-select'))
					field = $('#enrude_'+ fieldId + "-niceSelect");	
				if (field && field.length != 0) {
					field.bind('blur', function () {
								markRequired($(this));
								changeHdrButtonVisibility();
							});
					field.bind('focus', function () {
						removeMarkRequired($(this));
						changeHdrButtonVisibility();
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
						? getLabel('receiverDetails', 'Receiver Details')
						: getLabel('senderDetails', 'Sender Details'));
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
// if (data && data.d && data.d.paymentEntry
// && data.d.paymentEntry.standardField) {
// var arrFields = [];
// var lstAvailableValues = [];
// arrFields = data.d.paymentEntry.standardField;
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
		if (data && data.d && data.d.paymentEntry
				&& data.d.paymentEntry.standardField) {
			var arrFields = [];
			var lstAvailableValues = [];
			arrFields = data.d.paymentEntry.standardField;

			if (arrFields && arrFields.length > 0) {
				$.each(arrFields, function(index, cfg) {
							if ('companyId' === cfg.fieldName) {
								lstAvailableValues = cfg.availableValues
							}
						});
			}
			if (lstAvailableValues && lstAvailableValues.length > 0)
				if (lstAvailableValues.length > 1){
					$("#companyIdHdr").val("");
					$("#companyIdHdr").niceSelect('update');
				}
			$.each(lstAvailableValues, function(index, cfg) {
						if (cfg /* && strCompanyId === cfg.code */
								&& cfg.defaultAccount
								&& cfg.defaultAccount === strAccountNo) {
							$("#companyIdHdr").val(cfg.code);
							$("#companyIdHdr").niceSelect('update');
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
	$('#paymentHeaderEntryStep2 label.required').each(function() {
				tmpValid = true;
				fieldId = $(this).attr('for');
				field = $('#' + fieldId);
				if($('#' + fieldId).hasClass('jq-editable-combo'))
					field = $('#' + fieldId + "_jq");
				if($('#' + fieldId).hasClass('jq-nice-select'))
					field = $('#' + fieldId + "-niceSelect");	
				if (!isEmpty(field) && !isEmpty(fieldId) && field.length != 0) {
					tmpValid = markRequired(field);
					if (tmpValid == false)
						failedFields++;
				}
			});
	return (failedFields == 0);
}
function doHandlePaymentProrductToggle(data) {
	if (data && data.d && data.d.paymentEntry
			&& data.d.paymentEntry.standardField) {
		var arrFields = data.d.paymentEntry.standardField;
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
	if (!isEmpty(buyccy) && !isEmpty(sellccy) && buyccy != sellccy) {
		var urlSeek = "services/fxrate/" + buyccy + "/" + sellccy + ".json";
		var sendData = {"$ratetype" : fxRateType};
		
		if(!isEmpty(txnAmount) && ! isEmpty(contractRef) ){
			sendData['$amount'] = txnAmount;
			sendData['$qfilter'] = contractRef;
		}
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

						$('#fxSpanHeader,#fxAmountHeader').remove();

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
							var htmlFx = getLabel('lblFxIndicativeRate','Indicative Rate')+" (" + sellccy + " - "
									+ buyccy + ") : " + data.d.fxRate;
							// if (data.d.debitAmount) {
							// htmlFx += "<br>" + "Debit Amount:" + sellccy + "
							// "
							// + data.d.debitAmount;
							// }
							htmlFx += "<br />" +getLabel('lblIndicativeRate','');
							$("<span>").attr({
										'id' : 'fxSpanHeader'
									}).html(htmlFx).appendTo('#rateTypeHdrDiv');
							if(!isEmpty(data.d.debitAmount)){
							var htmlFxAmnt = getLabel('debitAmount','Debit Amount')+ " : " + data.d.debitAmount;
							$("<span>").attr({
								'id' : 'fxAmountHeader'
							}).html('</br>'+htmlFxAmnt).appendTo('#rateTypeHdrDiv');
							$(".fxSpanHeader_HdrInfo").html(htmlFx);
							$(".fxAmountSpan_HdrInfo").html(htmlFxAmnt);
							$("#contractFxHdrLabel").html(data.d.fxRate);
							}
						}
					}
				});
	}
}
function toggleControlTotalFiledDisabledValue() {
	var data = paymentResponseHeaderData;
	if (data && data.d && data.d.paymentEntry
			&& data.d.paymentEntry.standardField) {
		var stdFieldData = data.d.paymentEntry.standardField;
		var controlTotalVal = $('#controlTotalHdr').val();
		$.each(stdFieldData, function(index, cfg) {
					fieldId = cfg.fieldName;
					if (fieldId === 'controlTotal') {
					   $('#totalNoHdr').blur(function() {
                            markRequired($('#totalNoHdr'));
							changeHdrButtonVisibility();
                        });
						$('#totalNoHdr').focus(function() {
							removeMarkRequired($('#totalNoHdr'));
						});
                        $('#amountHdr').blur(function() {
                            markRequired($('#amountHdr'));
							changeHdrButtonVisibility();
                        });
						$('#amountHdr').focus(function() {
							removeMarkRequired($('#amountHdr'));
						});
						if (controlTotalVal === 'N') {
							$('#totalNoHdr').attr('disabled', 'disabled');
							$('#amountHdr').attr('disabled', 'disabled');
							$('#totalNoHdr').removeClass('requiredField');
                            $('#amountHdr').removeClass('requiredField');
						} else if (controlTotalVal === 'Y') {
							$('#totalNoHdr').removeAttr('disabled');
							$('#amountHdr').removeAttr('disabled');
							markRequired($('#totalNoHdr'));
                            markRequired($('#amountHdr'));
						}
					}
					if(fieldId === 'companyId' && !isEmpty(cfg.value))
					{
						$('#companyIdHdr-niceSelect').removeClass('requiredField');
					}
				});
	}
}

function togglerPaymentHederScreen(canEdit, data) {
		$('#paymentHeaderEntryStep2A,#paymentInstrumentInitActionDiv')
			.removeClass('hidden');
	$('#paymentHeaderEntryStep2B,#paymentHeaderEntryExtraFieldsDiv')
			.addClass('hidden');
	$("#paymentHeadeerTrasanctionSummaryDiv").addClass('hidden');
	if (strEntryType === 'PAYMENT' || strEntryType === 'SI') {
		if ($("#siSettingsInfo").attr('checked'))
			$('#siProcessingParameterInfoHdrDiv')
					.removeClass('ui-helper-hidden');
		else
			$('#siProcessingParameterInfoHdrDiv').addClass('ui-helper-hidden');
	}
	if( strEntryType == 'TEMPLATE' )
	{
		paintTemplateActions('EDITNEXT');
	}
	else
	{
	paintPaymentHeaderActions('EDITNEXT');
	}
	
	toggleRecurringPaymentParameterHdrFieldsSectionVisibility();
	handleEmptyEnrichmentDivs();
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
	doClearMessageSection();
	$('#verificationStepDiv').addClass('hidden');
	$('#paymentHeaderEntryStep2, #paymentHeaderEntryStep2A,#paymentInstrumentInitActionDiv, #paymentHeaderEntryExtraFieldsDiv')
			.removeClass('hidden');

	$('#txnStep1').removeClass('ft-status-bar-li-active')
			.addClass('ft-status-bar-li-done');
	$('#txnStep3').removeClass('ft-status-bar-li-active');
	$('#txnStep2').addClass('ft-status-bar-li-active').removeClass('ft-status-bar-li-done');
	// if (strEntryType === 'PAYMENT' || strEntryType === 'SI'){
	// $("#paymentHeadeerTrasanctionSummaryDiv .canClear").empty();
	//$("#paymentHeadeerTrasanctionSummaryDiv").removeClass('hidden');
	// }
	
	if( strEntryType == 'TEMPLATE' )
	{
		paintTemplateActions('EDITNEXT');
	}
	else
	{
	paintPaymentHeaderActions('EDITNEXT');
	}
	
	blockPaymentUI(false);
	if (objInstrumentEntryGrid) {
		$('#paymentInstActionCt').appendTo($('#paymentInstActionParentCt'));
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
	// Handling for AVM Grid Start
	if (strEntryType === 'TEMPLATE' && $("#defineApprovalMatrixHdr").prop('checked') == true) {
		defineAVMGrid('edit', 'B');
	}
	// Handling for AVM Grid End
}
function doViewPaymentHeader() {
	doClearMessageSection();
	$('#txnStep1,#txnStep2,#txnStep3').addClass('hidden');
	$('#paymentInstrumentInitActionDiv, #paymentHeaderEntryStep2, #messageContentDiv, #paymentHeaderEntryExtraFieldsDiv')
			.addClass('hidden');
	$('#verificationStepDiv').removeClass('hidden');
	// if (strEntryType === 'PAYMENT' || strEntryType === 'SI'){
	$("#paymentHeadeerTrasanctionSummaryDiv .canClear").empty();
	//$("#paymentHeadeerTrasanctionSummaryDiv").removeClass('hidden');
	// }
}

function showTransactionWizardPopup(strIde, strAction, strPopUpDivId,
		strActionMask, record) {
	$('#createTxn').hide();
	$('#modifyTxn').hide();
	if (strAction === "UPDATE") {
		$('#modifyTxn').show();
	} else if (strAction === "ADD" || strAction === undefined ) {
		$('#createTxn').show();
	}
	blockBatchHeaderUI(false);
	blockPaymentInstrumentUI(true);
	var strDivId = strPopUpDivId || 'transactionWizardPopup';
	$("#" + strDivId).dialog({
		resizable : false,
		modal : true,
		maxHeight : 500,
		width : 960,
		dialogClass : "hide-title-bar",
		open : function(event, ui) {
		$("#" + strDivId).dialog('option', 'position', 'center');
			var strMsgDivId = strAction === 'VIEW'
					? '#messageContentInstrumentViewDiv'
					: '#messageContentInstrumentDiv';
			$('#messageContentDiv').appendTo($(strMsgDivId));
			doClearMessageSection();
			$(this).data['strTxnWizardAction']= strAction;
			if (strAction === 'UPDATE' || strAction === 'VIEW')
				doShowAddedInstrument(strIde, strAction, strActionMask, record);
			else
				doShowInstrumentForm();
			//$('.transaction-wizard :input:not(:checkbox):not(:radio):not([readonly]):visible:enabled:first')
			//		.focus();
			var ua = window.navigator.userAgent;
			if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident/') > -1){
				setTimeout(function() { autoFocusFirstElement('INSTRUMENT');}, 500);	
			}   
			else{
				autoFocusFirstElement('INSTRUMENT');
			} 
			//blockPaymentInstrumentUI(false);
		},
		close : function(event, ui) {
			$('#messageContentDiv').appendTo($('#messageContentHeaderDiv'));
			toggleReceiver('A', true);
			paymentResponseInstrumentData = null;
			strPaymentInstrumentIde = null;
		}
	});
}
function refreshInstrumentGrid()
{
	var strTxnWizardAction =$(this).data['strTxnWizardAction'];
	if((isEmpty(strTxnWizardAction) || strTxnWizardAction=== 'ADD' || strTxnWizardAction=== 'UPDATE') && typeof objInstrumentEntryGrid != 'undefined'
			&& objInstrumentEntryGrid) {
		objInstrumentEntryGrid.refreshData();
	}
}
function closeTransactionWizardPopup() {
	// Added for Receiver Validation. Used in ECO Bank. Good to have feature in product.
	fnChkRecValPopup();
	$('#transactionWizardPopup').dialog('close');
	if (strLayoutType === 'TAXLAYOUT')
		$('#addendaSectionDiv').addClass('hidden');
}
// Added for Receiver Validation. Used in ECO Bank. Good to have feature in product.
function fnChkRecValPopup()
{
	if(document.getElementById("receiverVal") != null)
	{			
		if(document.getElementById("receiverVal").value === "W")
		{	
			document.getElementById("receiverVal").value = "";
			receiverWarningMessagePopUp();
		}	
		else if(document.getElementById("receiverVal").value === "S")
		{	
			document.getElementById("receiverVal").value = "";
			openreceiverSuccessMessagePopup();
		}
	}
}
// Added for Receiver Validation. Used in ECO Bank. Good to have feature in product.
function openreceiverSuccessMessagePopup() {
	$("#receiverSuccessMessagePopUp").removeClass('hidden');
	_objDialog = $('#receiverSuccessMessagePopUp');
	_objDialog.dialog({
				bgiframe : true,
				autoOpen : false,
				modal : true,
				resizable : false,
				draggable : false,
				width : "380px",
				buttons : [{
					text:getLabel('btnOk','Ok'),
					click : function() {
						$("#receiverSuccessMessagePopUp").addClass('hidden');
						$(this).dialog("close");
					}
				}
				]
			});
	_objDialog.dialog('open');
	$("#receiverSuccessMessagePopUp").focus();
};
// Added for Receiver Validation. Used in ECO Bank. Good to have feature in product.
function receiverWarningMessagePopUp() {
	$("#receiverWarningMessagePopUp").removeClass('hidden');
	_objDialog = $('#receiverWarningMessagePopUp');
	_objDialog.dialog({
				bgiframe : true,
				autoOpen : false,
				modal : true,
				resizable : false,
				draggable : false,
				width : "320px",
				buttons : [{
					text:getLabel('btnOk','Ok'),
					click : function() {
						$("#receiverWarningMessagePopUp").addClass('hidden');
						$(this).dialog("close");
					}
				}
				]
			});
	_objDialog.dialog('open');
	$("#receiverWarningMessagePopUp").focus();
};

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
			$('#btnAddRow, #btnAddUsing, #btnSaveRec').remove();
		else if (chrAllowGridLayout === 'Y')
			toggleGridLayoutEntryAddRow(true);
		chrAllowGridLayoutEntry = chrAllowGridLayout;
	}
}
function toggleImportEntryOption(chrAllowImport) {
	if (!isEmpty(chrAllowImport) && chrAllowImport === "N") {
		$('#btnImportTxn').addClass('hidden');
	} else{
		$('#btnImportTxn').removeClass('hidden');
	}
}
function toggleGridLayoutEntryAddRow(canBind) {
	if (canBind) {
		$('#btnAddRow').unbind('click');
		$('#btnAddRow').bind('click', function() {
					if(intHdrDirtyBit > 0)
						doUpdatePaymentHeaderSilent();
					$(document).trigger("addGridRow");
				});
		$('#btnSaveRec').unbind('click');
		$('#btnSaveRec').bind('click', function() {
			if(intHdrDirtyBit > 0)
				doUpdatePaymentHeaderSilent();
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
								refreshEditableGrid, null);
					}
				}
				else
				{
					// if control total is applicable and instrument count is matching with control total then grid refresh is required.
					refreshEditableGrid();
				}
		});		
	} 
	else
	{
		$('#btnAddRow').unbind('click');
		$('#btnSaveRec').unbind('click');
	}
	
}

function refreshEditableGrid()
{
	objInstrumentEntryGrid.refreshData();
}
function toggleInstrumentInitiationActions() {
	var layout = strLayoutType;
	var ctrl = $('#btnAddUsing');
	ctrl.unbind('click');
	if (layout === 'ACCTRFLAYOUT' || layout === 'CHECKSLAYOUT')
		ctrl.bind('click', function() {
					if(intHdrDirtyBit > 0)
						doUpdatePaymentHeaderSilent();
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
					if(intHdrDirtyBit > 0)
						doUpdatePaymentHeaderSilent();
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
					if (null != chrProductLevel && "B" == chrProductLevel 
							&& ("ACCTRFLAYOUT" == strLayoutType || "CHECKSLAYOUT" == strLayoutType || "WIRESWIFTLAYOUT" == strLayoutType )) {
						$("#productInfoHdr").addClass("hidden");
					}
				});

	ctrl = $('#btnTxnWizard');
	ctrl.unbind('click');
	ctrl.bind('click', function() {
				//blockUI();
		
				if(strLayoutType === 'TAXLAYOUT' || intHdrDirtyBit > 0)
					doUpdatePaymentHeaderSilent();
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
				blockPaymentInstrumentUI(true);
				if ("B" === charPaymentType && "B" === strPayUsing && strSelectedReceiverDesc ) {
					$(window).attr('batchUsingRec', 'Y');
					$(document).trigger("paintSelectedReceiver",strMyProduct);
				}
				if ("MIXEDLAYOUT" == strLayoutType) {
					if (null != chrProductLevel && "I" == chrProductLevel) {
						handlingForMixedLayout();
					}
					else{
						$("#productInfoHdr").addClass("hidden");
						$("#paymentDetailsToggleCaret").removeClass("fa-caret-down fa-caret-up");
					}

				}
				blockPaymentInstrumentUI(false);		
			});

	ctrl = $('#btnImportTxn');
	
	if(strEntryType === "PAYMENT" && $('#prenoteHdr').val() == 'Y')
	{
	ctrl.unbind('click');
	}
	else
	{
	ctrl.bind('click', function() {
					if(intHdrDirtyBit > 0)
					doUpdatePaymentHeaderSilent(true,"TXNIMP");
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
	
	$('#controlTotalHdr').bind('click', function() {
		changeHdrButtonVisibility();
	});
	toggleInstrumentInitiationAction();
}
// ========================== Helper Function Ends ==========================

// ================ Payment Instrument Handling Starts==========================

function doShowInstrumentForm() {
	$('.instrumentEditPaginationBar').addClass('hidden');
	blockPaymentInstrumentUI(true);
	resetInstrumentForm();
	loadPaymentBatchInstrumentFields(strPaymentHeaderIde);
	//FCM-38627 Overriding default destination currency - IAT adhoc payments
	if(!isEmpty(userSelectedDestinationCurrency)){
		$('#drawerCurrencyA').val(userSelectedDestinationCurrency);
	}
	doShowInstrumentCountOnWizard();
}
function doShowInstrumentCountOnWizard()
{
	$('.instrumentEditPaginationBar').removeClass('hidden');
	var instGrid = getInstrumentGrid();
	var controlTotalVal = $('#controlTotalHdr').val();
	var totalCount =0;
	if (controlTotalVal === 'Y' || $('#controlTotalHdrDiv').hasClass('hidden')) 
	{
		totalCount = parseInt($('#totalNoHdr').val());
	}
	else
	{
		if(instGrid)
		{
			if(instGrid.store.totalCount > instGrid.getCurrentPage()*instGrid.getPageSize())
			{
				totalCount = instGrid.getCurrentPage()*instGrid.getPageSize()
			}
			else
			{
				totalCount = instGrid.store.totalCount;
			}
		}
		totalCount = totalCount+1;
	}
	
	if (instGrid) {
		var totalGridRowCount = instGrid.store.totalCount ;
		toggleInstrumentPagination('UPDATE');
		updatePagingParamsEdit(instGrid.getRowNumber(totalGridRowCount+1),
				totalCount);
		$('.nextTxnUpdate').addClass('button-grey-effect');
	}
}

function doShowAddedInstrument(strIde, strAction, strActionMask, record) {
	blockPaymentInstrumentUI(true);
	blockPaymentInstrumentHeaderLinks(true,strAction);
	if (strAction === 'UPDATE') {
		resetInstrumentForm();
		editPaymentBatchInstrument(strIde, strAction,strActionMask);
	}
	if (strAction === 'VIEW') {
		viewPaymentBatchInstrument(strIde, strAction, strActionMask, record);
	}
}
function loadPaymentBatchInstrumentFields(strHeaderId) {
	if (!isEmpty(strHeaderId)) {
		var url = _mapUrl['loadBatchInstrumentFieldsUrl'] + "/id.json";
		$.ajax({
			type : "POST",
			url : url,
			data : {
				'$id' : strHeaderId,
				'_mode' : 'ADD'
			},
			async : false,
			complete : function(XMLHttpRequest, textStatus) {
				if ("error" == textStatus) {
					closeTransactionWizardPopup();
					refreshInstrumentGrid();
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
						refreshInstrumentGrid();
						paintErrors(data.d.message.errors);
					} else {
						if(strLayoutType && strLayoutType == 'TAXLAYOUT' )
						{
							$('#calculatedAmount').text('');
						}
						paymentResponseInstrumentData = data;
						// TODO To be verified
						doRemoveStaticText("transactionWizardPopup");
						paintPaymentInstrumentUI(data, 'Q');
						initateValidation();
						// This is used to handle the control total validation
						var blnFlag = doValidationForControlTotal();
						if (blnFlag)
							isBtnVisible = isAddAnotherTxnButtonVisible(data);
						else
							isBtnVisible = true;
						paintPaymentBatchInstrumentActions('ADD', isBtnVisible,null);
						populatePaymentHeaderViewOnlySection(
								paymentResponseHeaderData,
								data.d.paymentEntry.paymentHeaderInfo, 'N',
								'EDIT');
						toggleContainerVisibility('transactionWizardPopup');
						blockPaymentInstrumentUI(false);
						handleEmptyEnrichmentDivs();
						if ("MIXEDLAYOUT" === strLayoutType && charPaymentType === 'B') {
							doHandleContainerCollapseHdr();
						}
						chrProductLevel = data.d.paymentEntry.paymentHeaderInfo.productLevel
						? data.d.paymentEntry.paymentHeaderInfo.productLevel
						: 'B';
						if (null != chrProductLevel && "B" == chrProductLevel 
								&& ("ACCTRFLAYOUT" == strLayoutType || "CHECKSLAYOUT" == strLayoutType || "WIRESWIFTLAYOUT" == strLayoutType )) {
							$("#productInfoHdr").addClass("hidden");
							$("#productInfoInstView").addClass("hidden");
						}
						populateApiEnrichmentType(data);
						var instrumentId = data.d.paymentEntry.paymentMetaData.instrumentId;
						var chrAccountLevel = data.d.paymentEntry.paymentHeaderInfo.accountLevel
						? data.d.paymentEntry.paymentHeaderInfo.accountLevel
						: 'B';
						var chrDateLevel = data.d.paymentEntry.paymentHeaderInfo.dateLevel
						? data.d.paymentEntry.paymentHeaderInfo.dateLevel
						: 'B';
						handleBatchHeaderLevelFields(strLayoutType, instrumentId, chrAccountLevel, chrDateLevel);
					}
				}
			}
		});
	} else {
		var arrError = new Array();
		closeTransactionWizardPopup();
		refreshInstrumentGrid();
		blockPaymentInstrumentUI(false);
		if (paymentResponseHeaderData
				&& paymentResponseHeaderData.d
				&& paymentResponseHeaderData.d.paymentEntry
				&& paymentResponseHeaderData.d.paymentEntry.message
				&& paymentResponseHeaderData.d.paymentEntry.message.errors
				&& paymentResponseHeaderData.d.paymentEntry.message.errors.length > 0) {

			arrError = paymentResponseHeaderData.d.paymentEntry.message.errors;
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
	if(document.getElementById("saveandadd").value == 'SAA')
	{
		$("#drawerDescriptionA").blur();
		$("#drawerDescriptionA").removeClass('requiredField');
	}
	else
	{
		setTimeout(function() {
		autoFocusOnFirstElement(null, "transactionWizardPopup", true);}, 50);
	}
}
function editPaymentBatchInstrument(strIde, strAction,strActionMask,btnAction) {
	var url = _mapUrl['readSavedBatchInstrumentUrl'] + "/id.json";
	$.ajax({
		type : "POST",
		url : url,
		data : {
			'$id' : strIde,
			'_mode' : 'EDIT'
			},
		complete : function(XMLHttpRequest, textStatus) {
			if ("error" == textStatus) {
				closeTransactionWizardPopup();
				refreshInstrumentGrid();
				blockPaymentInstrumentUI(false);
				var arrError = new Array();
				arrError.push({
							"errorCode" : "Message",
							"errorMessage" : mapLbl['unknownErr']
						});
				paintErrors(arrError);
			}
			$("#transactionWizardPopup").dialog('option', 'position', 'center');
		},
		success : function(data) {
			if (data != null) {
				if (data.d
						&& data.d.message
						&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
					closeTransactionWizardPopup();
					refreshInstrumentGrid()
					paintErrors(data.d.message.errors);
				} else {
					paymentResponseInstrumentData = data;
					doRemoveStaticText("transactionWizardPopup");
					if (data.d.paymentEntry && data.d.__metadata
							&& data.d.__metadata._detailId) {
						strDtlIdentifierForInfo = strPaymentInstrumentIde = data.d.__metadata._detailId;
					}
					//destroy previous instrument nice select 
					if(strLayoutType === 'MIXEDLAYOUT'){
						$('#beneficiaryBankIDTypeA').niceSelect('destroy');
					}
					paintPaymentInstrumentUI(data, 'Q');
					paintLimitPopup('Q');
					initateValidation();
					// This is used to handle the control total validation
					var blnFlag = doValidationForControlTotal();
					if (blnFlag)
						isBtnVisible = isAddAnotherTxnButtonVisible(data);
					else
						isBtnVisible = true;
					paintPaymentBatchInstrumentActions(strAction, isBtnVisible,strActionMask);
					populatePaymentHeaderViewOnlySection(
							paymentResponseHeaderData,
							data.d.paymentEntry.paymentHeaderInfo, 'N', 'EDIT');

					// Paint Errors if payment is saved with error
					if (data.d
							&& data.d.paymentEntry
							&& data.d.paymentEntry.message
							&& (data.d.paymentEntry.message.errors || data.d.paymentEntry.message.success === 'SAVEWITHERROR')) {
						paintErrors(data.d.paymentEntry.message.errors);
					}
					// TODO : To be verify
					// Paint CashIn Errors
					if (false && data.d && data.d.paymentEntry
							&& data.d.paymentEntry.adminMessage
							&& data.d.paymentEntry.adminMessage.errors) {
						paintCashInErrors(data.d.paymentEntry.adminMessage.errors)
					}
					toggleContainerVisibility('transactionWizardPopup');
					if ("MIXEDLAYOUT" === strLayoutType) {
						canAnyIdProductCheck = false;
						repaintPaymentInstrumentFields(true);
						/*$("#senderDetailsToggle,#paymentDetailsToggle,#additionalInfoToggle").removeClass("collapseDiv").removeAttr('style').css("display","block").css("overflow","hidden");
						$("#senderDetailsToggleCaret,#paymentDetailsToggleCaret,#additionalInfoToggleCaret").removeClass("fa-caret-down").addClass("fa-caret-up");*/
						handlingForMixedLayout();
						doHandleContainerCollapseHdr();
					}
					chrProductLevel = data.d.paymentEntry.paymentHeaderInfo.productLevel
					? data.d.paymentEntry.paymentHeaderInfo.productLevel
					: 'B';
					if (null != chrProductLevel && "B" == chrProductLevel 
							&& ("ACCTRFLAYOUT" == strLayoutType || "CHECKSLAYOUT" == strLayoutType || "WIRESWIFTLAYOUT" == strLayoutType)) {
						$("#productInfoHdr").addClass("hidden");
					}
					handleEmptyEnrichmentDivs();
					populateApiEnrichmentType(data);
					if (strLayoutType === 'MIXEDLAYOUT' && !isEmpty($("#bankProduct").val()) && doNotShowBankProduct === 'Y')
					{
						removeBankProduct(data, true);
					}
					var instrumentId = data.d.paymentEntry.paymentMetaData.instrumentId;
					var chrAccountLevel = data.d.paymentEntry.paymentHeaderInfo.accountLevel
					? data.d.paymentEntry.paymentHeaderInfo.accountLevel
					: 'B';
					var chrDateLevel = data.d.paymentEntry.paymentHeaderInfo.dateLevel
					? data.d.paymentEntry.paymentHeaderInfo.dateLevel
					: 'B';
					handleBatchHeaderLevelFields(strLayoutType, instrumentId, chrAccountLevel, chrDateLevel);
				}
				blockPaymentInstrumentUI(false);
				if(null != btnAction && 'undefined' != btnAction){
				    btnAction.removeAttr('disabled');
				}
				blockPaymentInstrumentHeaderLinks(false,strAction);
				setTimeout(function() { autoFocusOnFirstElement(null, "drawerAccountNoCt", true); }, 50);
				
			}
		}
	});
}

function removeBankProduct(data, isEdit)
{
	if (data.d
			&& data.d.paymentEntry
			&& data.d.paymentEntry.message
			&& (data.d.paymentEntry.message.errors || data.d.paymentEntry.message.success === 'SAVEWITHERROR')) {
		var arrErr = data.d.paymentEntry.message.errors;
		if (arrErr && arrErr.length > 0) {
			$.each(arrErr, function(index, error) {
						var strErrCode = error.errorCode || error.code;
						if (!isEmpty(strErrCode) && 'I55' === strErrCode) {
							if(isEdit) {
								$("#bankProduct").val('');
								$("#bankProduct").niceSelect('update');
							}
							else {
								$('.bankProduct_InstView').html('');
							}
						}
					});

		}
	}
}
function viewPaymentBatchInstrument(strIde, strAction, strActionMask, record) {
	var url = _mapUrl['readSavedBatchInstrumentUrl'] +  "/id.json";
	$.ajax({
		type : "POST",
		url : url,
		data : {
			'$id' : strIde,
			'_mode' : 'VIEW'
			},
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
	$("#transactionWizardViewPopup").dialog('option', 'position', 'center');
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
						strDtlIdentifierForInfo = strPaymentInstrumentIde = data.d.__metadata._detailId;
					}
					resetPaymentInstrumentViewOnlyUI();
					paintPaymentInstrumentViewOnlyUI(data,
							paymentResponseHeaderData);
					var noOfDenoms = 0;
					if (data.d.paymentEntry.cashwithdrawalDetails && data.d.paymentEntry.cashwithdrawalDetails.denomination) {
						noOfDenoms = paintPaymentDenominationsHelperViewOnly(data.d.paymentEntry.cashwithdrawalDetails.denomination,'','cashwithdrawal_InstViewDiv','');
					}
					
					if(noOfDenoms > 0)
							$('#cashwihdrawaldetailsView').removeClass('hidden');
						else
							$('#cashwihdrawaldetailsView').addClass('hidden');

					if (data.d.paymentEntry && data.d.__metadata)
						strPaymentInstrumentIde = data.d.__metadata._detailId;

					// Paint Errors if payment is saved with error
					if (data.d
							&& data.d.paymentEntry
							&& data.d.paymentEntry.message
							&& (data.d.paymentEntry.message.errors || data.d.paymentEntry.message.success === 'SAVEWITHERROR')) {
						paintErrors(data.d.paymentEntry.message.errors);
					}
					// Paint CashIn Errors
					if (false && data.d && data.d.paymentEntry
							&& data.d.paymentEntry.adminMessage
							&& data.d.paymentEntry.adminMessage.errors) {
						paintCashInErrors(data.d.paymentEntry.adminMessage.errors)
					}

					if (strActionMask) {
						var strAuthLevel = data.d.paymentEntry.paymentHeaderInfo.authLevel;
						var strDetailId = data.d.__metadata._detailId;
						var strParentId = data.d.paymentEntry.paymentHeaderInfo.hdrIdentifier
						paintPaymentHeaderInstrumentLevelGroupActions(
								strActionMask, 'VIEW', strAuthLevel,
								strParentId, strDetailId, data.d.paymentEntry.paymentHeaderInfo.showPaymentAdvice,
								data.d.paymentEntry.paymentHeaderInfo.recKeyValidation,record);
					} else paintPaymentBatchInstrumentActions('CLOSE', false,strActionMask);
					toggleContainerVisibility('transactionWizardViewPopup');
					toggleContainerVisibility('paymentInstrumentViewExtraFieldsDiv');
					chrProductLevel = data.d.paymentEntry.paymentHeaderInfo.productLevel
					? data.d.paymentEntry.paymentHeaderInfo.productLevel
					: 'B';
					if (null != chrProductLevel && "B" == chrProductLevel 
							&& ("ACCTRFLAYOUT" == strLayoutType || "CHECKSLAYOUT" == strLayoutType || "WIRESWIFTLAYOUT" == strLayoutType )) {
						$("#productInfoInstView").addClass("hidden");
					}
					blockPaymentInstrumentUI(false);
					handleEmptyEnrichmentDivs();
					blockPaymentInstrumentHeaderLinks(false,strAction);
					if (strLayoutType === 'MIXEDLAYOUT' && doNotShowBankProduct === 'Y')
					{
						removeBankProduct(data,false);
					}
					var instrumentId = data.d.paymentEntry.paymentMetaData.instrumentId;
					var chrAccountLevel = data.d.paymentEntry.paymentHeaderInfo.accountLevel
					? data.d.paymentEntry.paymentHeaderInfo.accountLevel
					: 'B';
					var chrDateLevel = data.d.paymentEntry.paymentHeaderInfo.dateLevel
					? data.d.paymentEntry.paymentHeaderInfo.dateLevel
					: 'B';
					handleBatchHeaderLevelFields(strLayoutType, instrumentId, chrAccountLevel, chrDateLevel);
				}
				if(data.d.paymentEntry.paymentMetaData._docUploadEnabled){
					hideShowDownloadedFileDivForViewVerify(data.d.paymentEntry.paymentMetaData);
				}
			}
		}
	});
}
function loadPaymentBatchInstrumentFieldsForGridLayout(headerId, strUrl,isViewOnly) {
	var returnData = null;
	if (!isEmpty(headerId)) {
		var url = strUrl || _mapUrl['loadBatchInstrumentFieldsUrl'] + "/id.json";
		$.ajax({
			type : "POST",
			url : url,
			data : {
				'$id' : headerId,
				'_mode' : 'GRID'+','+isViewOnly
			},
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
						paintPaymentInstrumentUI(data, 'Q');
						handleReceiverFieldsOnPrenoteChange();
						initateValidation();
						setTimeout('blockPaymentInstrumentUI(false)', 300);
					}
				}
			});
}
function paintPaymentInstrumentViewOnlyUI(objInstData, objHdrData) {
	var arrStdFields = null, clsHide = 'hidden';
	var strFieldName = null, strValue = null, mapFields = {}, strPostFix = null, arrFields = null, ctrl = null;
	var objHdrInfo = null, objMetaData = null, paymentEntry = null, beneficiary = null, canShowEnrichmentSection = false, canShowAdditionalInfoSection = false;
	var isCheckWht, strPostFix = charPaymentType === 'B' ? 'Hdr' : '';
	/* ...........Paint Batch Header Fields Start.......... */
	if (objHdrData && objHdrData.d) {
		if (objHdrData.d.paymentEntry) {
			paymentEntry = objHdrData.d.paymentEntry;
			arrStdFields = paymentEntry.standardField
					? paymentEntry.standardField
					: null;
			objHdrInfo = paymentEntry && paymentEntry.paymentHeaderInfo
			? paymentEntry.paymentHeaderInfo
			: null;
			paintPaymentInstrumentViewOnlyFields(arrStdFields, 'Hdr_InstView');
			
			if(strLayoutType === 'MIXEDLAYOUT'){
				handleElectronicAndPhysicalInstrumentFieldsHideAndShowView(objInstData.d.paymentEntry);
			}
		}
	}
	/* ...........Paint Batch Header Fields End.......... */

	/* ...........Paint Batch Instrument Fields Start.......... */

	if (objInstData && objInstData.d && objInstData.d.paymentEntry) {
		
		/* -------------------- CutOff, Company info start here --------------------------------------------  */	
		paymentEntry = objInstData.d.paymentEntry;
		instData = paymentEntry && paymentEntry.paymentHeaderInfo
		? paymentEntry.paymentHeaderInfo
		: null;
		if (instData) {
			if (instData.hdrCutOffTime) {
				$('.productCuttOffHdr_InstView')
						.html(instData.hdrCutOffTime	|| '');
			} else
				$('.productCuttOffHdr_InstView').html('');
			
			$('.hdrStatusHdr_InstView').html(instData.hdrStatus || '');
		
			if (instData.hdrSource) {
				$('.hdrSourceHdr_InstView')
						.text(instData.hdrSource || '');
			}
		
			if (strPaymentType === 'BATCHPAY') {
				if ((instData.accountLevel && instData.accountLevel === 'I')
						|| (instData.dateLevel && instData.dateLevel === 'I')) {
					$('.batchHeaderSectionLbl').text('Sender Details');
					$('#batchheader').collapsiblePanel(true);
				}
			}
		
		} else {
			$('.bankProduct_InstView,.productCuttOff_InstView').html('');
		}
		objMetaData = paymentEntry && paymentEntry.paymentMetaData
				? paymentEntry.paymentMetaData
				: null;
		if (objMetaData) {
			$('.txnQueueHdr_InstView').html(objMetaData.txnQueue || '');
			gAmountTransferType = objMetaData.accTrfType;
		}
		if (paymentEntry.paymentCompanyInfo) {
			var objInfo = paymentEntry.paymentCompanyInfo;
			var strText = !isEmpty(objInfo.company) ? objInfo.company : '';
			strText += '<br/>'
					+ (!isEmpty(objInfo.companyAddress)
							? objInfo.companyAddress
							: '');
			$('.companyInfoHdr_InstView').html(strText);
		} else {
			$('.companyInfoHdr_InstView').html('');
		}
		/* -------------------- CutOff, Company info end here --------------------------------------------  */	
		
		$('#addendaSectionDiv_InstView').addClass(clsHide);
		arrStdFields = paymentEntry.standardField
				? paymentEntry.standardField
				: null;
		paintPaymentInstrumentViewOnlyFields(arrStdFields, '_InstView');
		// To be verified
		if (strLayoutType === 'ACCTRFLAYOUT' && objHdrInfo != null) {
			toggleAccountTransferAccountLabel(objHdrInfo.hdrDrCrFlag);
		}
		if(!isEmpty(strLayoutType) && strLayoutType==='WIRESWIFTLAYOUT')
			toggleSwiftSectionVisibility('_InstView');
		if (paymentEntry.beneficiary) {
			paintReceiverViewOnlyDetails(paymentEntry.beneficiary, objHdrInfo ? objHdrInfo : null);
		}

		if (paymentEntry.enrichments) {
			
			if ('BILLPAYLAYOUT' === strLayoutType && paymentEntry.paymentHeaderInfo) {
				strReceiptFlag = paymentEntry.paymentHeaderInfo.receiptFlag;
				strBillerOrAggregator = paymentEntry.paymentHeaderInfo.isBiller;
			}
			canShowEnrichmentSection = paintPaymentEnrichmentsViewOnlyFields(paymentEntry.enrichments);
		}
		else
		{
			if (strLayoutType === 'TAXLAYOUT')
				canShowEnrichmentSection = true;
		}
		
		if (paymentEntry.additionalInfo) {
			canShowAdditionalInfoSection = paintPaymentAdditionalInformationViewOnly(
					paymentEntry.additionalInfo, true);
		}
		
		if(paymentEntry.whtFields && paymentEntry.whtFields.whtHeader){
			paintPaymentWHTHeaderFieldsViewOnly(paymentEntry.whtFields.whtHeader);
		}
		
		if(paymentEntry.whtFields && paymentEntry.whtFields.whtDetails){
			objWhtDetails = paymentEntry.whtFields.whtDetails;
			paintPaymentWHTAdditionalDetailsGrid(objWhtDetails,true);
			isCheckWht = $('#whtApplicable'+strPostFix).attr('checked') ? true : false;
			if(isCheckWht)
				$('#whtFieldsSectionInfoViewDiv').removeClass('hidden');
		}
		
		showHideAddendaViewOnlySection(canShowEnrichmentSection,
				canShowAdditionalInfoSection);
		// if (strEntryType === 'PAYMENT' || strEntryType ==='SI') {

		if (objInstData.d && objInstData.d.__metadata
				&& objInstData.d.__metadata._detailId)
			paintPaymentDtlAdditionalInformationSection(
					objInstData.d.__metadata._detailId, 'Q');
		// }
		paintFXForDetailViewOnlySection();
	}

	/* ...........Paint Batch Instrument Fields End.......... */
	anyIdToggle(objInstData.d.__metadata.anyIdPaymentFlag,"V");
}

function resetPaymentInstrumentViewOnlyUI() {
	$(".transactionWizardInnerDiv").find(".canClear").html('');
	$(".transactionWizardInnerDiv").find(".canCollapse").addClass('hidden');
}

function doValidationForControlTotal() {
	var data, objStdField, displayModeOftotalNo, blnCtronTotalField = false, isInstCountValidationApply = false, valOfControlTotalCheckBox;
	data = paymentResponseHeaderData;
	if (data && data.d.paymentEntry && data.d.paymentEntry.standardField) {
		objStdField = data.d.paymentEntry.standardField;
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
	var success = "";
	if (data && data.d && data.d.paymentEntry) 
	{
		if (data.d.paymentEntry.message && !isEmpty(data.d.paymentEntry.message.success))
		{
			success  = 	data.d.paymentEntry.message.success ;
		}
		if(data.d.paymentEntry.paymentHeaderInfo)
		{
			if (!isEmpty(data.d.paymentEntry.paymentHeaderInfo.hdrEnteredNo))
				intEnteredNo = parseInt(data.d.paymentEntry.paymentHeaderInfo.hdrEnteredNo,10);
			if (!isEmpty(data.d.paymentEntry.paymentHeaderInfo.hdrTotalNo))
				hdrTotalNo = parseInt(data.d.paymentEntry.paymentHeaderInfo.hdrTotalNo,10);
			
			if((intEnteredNo === 1 && hdrTotalNo === 1) || intEnteredNo === hdrTotalNo - 1 )
			{
				isBtnVisible = false;
				if(success == 'SAVEWITHERROR' )
				{
					isBtnVisible = true;
				}
			}
			if(intEnteredNo == hdrTotalNo && success == 'SAVEWITHERROR')
			{
				isBtnVisible = false;
			}
			if(intEnteredNo >= hdrTotalNo)
			{
				isBtnVisible = false;
			}
		}
	}
	return isBtnVisible;
}
function validateInstrumentCount(intGridRecordCnt, blnShowError) {
	var objSaveTotalNo = null, objStandField, objValTotalNo, isValid = false, blnShowPopup = !isEmpty(blnShowError)
			? blnShowError
			: true;
	if ((!isEmpty(paymentResponseHeaderData))
			&& (!isEmpty(paymentResponseHeaderData.d.paymentEntry.standardField)))
		objStandField = paymentResponseHeaderData.d.paymentEntry.standardField;
	objValTotalNo = !isEmpty($('#totalNoHdr').val()) ? parseInt($('#totalNoHdr').val(),10) : 0;
	for (i = 0; i < objStandField.length; i++) {
		if (objStandField[i].fieldName === 'totalNo')
			objSaveTotalNo = !isEmpty(objStandField[i].value) ? objStandField[i].value : 0;
	}
	if ((intGridRecordCnt <= objSaveTotalNo)
			&& ((intGridRecordCnt == objSaveTotalNo) && (intGridRecordCnt < objValTotalNo))) {
		if (blnShowPopup && (intHdrDirtyBit > 0 || objSaveTotalNo != objValTotalNo)){
			doUpdatePaymentHeaderSilent();
			//showErrorMsg(mapLbl['controlTotalSaveHeaderMsg']);
		}
		//isValid = false;
		if(intGridRecordCnt < objValTotalNo)
		{
			isValid = true;
		}
		else
		{
			isValid = false;
		}
		
	} else if ((intGridRecordCnt == objSaveTotalNo)
			&& (intGridRecordCnt == objValTotalNo) && intGridRecordCnt !==0) {
		 (blnShowPopup)
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
				&& (!isEmpty(paymentResponseHeaderData.d.paymentEntry.standardField)))
			objStandField = paymentResponseHeaderData.d.paymentEntry.standardField;
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
function paintPaymentBatchInstrumentActions(strAction, isBtnVisible,strActionMask) {
	var elt = null, eltCancel = null, eltDiscard = null, isDiscard=true;
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
		doCloseBatchInstrument(strAction);
			});
	if (strAction === 'ADD') {
		
//		$(strBtnRTRB).append("&nbsp;");

		/*
		 * elt = createButton('btnSaveAndExit', 'P'); elt.click(function() {
		 * doSaveAndExitBatchInstrument(); });elt.appendTo($(strBtnRTRB));
		 */
		/** Commented as per requirement */
//		$(strBtnRTRB).append("&nbsp;");
		if (canShow === true) {
			elt = createButton('btnSaveAndAddAother', 'L');
			elt.click(function() {
						$('#transactionWizardPopup').data['strTxnWizardAction']= 'ADD';
						doSaveAndAddBatchInstrument();
					});
			elt.appendTo($(strBtnRTRB));
//			$(strBtnRTRB).append("&nbsp;");
		}
		eltCancel.appendTo($(strBtnLTLB));
//		$(strBtnLTLB).append("&nbsp;");
		elt = createButton('btnSave', 'P');
		elt.click(function() {
					// doSaveBatchInstrument();
					doSaveAndExitBatchInstrument();
				});
		elt.appendTo($(strBtnRTRB));
	} else if (strAction === 'UPDATE' || strAction === 'UPDATEWITHERROR') {
		if(null!=strActionMask)
		{
			isDiscard = isInstrumentActionEnabled(strActionMask, 9);
		}
		if (canShow === true && strAction === 'UPDATEWITHERROR') {
			elt = createButton('btnUpdateAndAdd', 'P');
			elt.click(function() {
						doUpdateAndAddBatchInstrument();
					});
			elt.appendTo($(strBtnRTRB));
			$(strBtnRTRB).append("&nbsp;");
		}
		elt = createButton('btnUpdate', 'P');
		elt.click(function() {
					// doUpdateBatchInstrument();
					doUpdateAndExitBatchInstrument();
				});
		elt.appendTo($(strBtnRTRB));
//		$(strBtnRTRB).append("&nbsp;");

		/*
		 * elt = createButton('btnUpdateAndExit', 'P'); elt.click(function() {
		 * doUpdateAndExitBatchInstrument(); }); elt.appendTo($(strBtnRTRB));
		 */

		eltDiscard = createButton('btnDiscard', 'L');
		eltDiscard.click(function() {
					// doDiscardBatchInstrumentFromTxnWizard();
					getDiscardConfirmationPopup('Q');
				});

//		$(strBtnRTRB).append("&nbsp;");
		/** Commented as per requirement */
			// Kept false as we are showing pop-up on SAVEWITHERROR
			if (false) {
				elt = createButton('btnIgonreErrorAndAdd', 'P');
				elt.click(function() {
							doIgnoreErrorAndAddBatchInstrument();
						});
				elt.appendTo($(strBtnRTRB));
//					$(strBtnRTRB).append("&nbsp;");
			}
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
		if(isDiscard)
			eltDiscard.appendTo($(strBtnLTLB));
	} else if (strAction === 'VIEW' || strAction === 'VIEWBATCHINST') {
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
		eltCancel.unbind('click');
		eltCancel.bind('click', function() {
					doScreenReadOnly(false);
					doCloseBatchInstrument(strAction);
				});
	} else if (strAction === 'CLOSE') {
		eltCancel = createButton('btnClose', 'P');
		eltCancel.click(function() {
					doCancelViewBatchInstrument();
				});
		eltCancel.appendTo($(strBtnRTRB));
	}
}
function doSaveBatchInstrument(blnPrdCutOff) {
	if (!doValidateAccounts())
		return false;
	var jsonData = generatePaymentInstrumentJson(), jsonArgs = {};
	var canSave = validateRequiredFields();
	jsonData.d.__metadata._headerId = strPaymentHeaderIde;
	if (blnPrdCutOff === true) {
		jsonData.d.paymentEntry.standardField.push({
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
	var jsonData = generatePaymentInstrumentJson(), jsonArgs = {};
	var canSave = validateRequiredFields();
	jsonData.d.__metadata._headerId = strPaymentHeaderIde;
	if (blnPrdCutOff === true) {
		jsonData.d.paymentEntry.standardField.push({
					fieldName : 'prdCutoffFlag',
					value : 'Y'
				});
	}
	jsonArgs.action = 'SAVEANDEXIT';
	jsonArgs.jsonData = jsonData;
	doClearMessageSection();
	savePaymentInstrument(jsonData, postHandleSaveBatchInstrument, jsonArgs);
}

function doUpdateBatchInstrument(blnPrdCutOff) {
	if (!doValidateAccounts())
		return false;
	var jsonData = generatePaymentInstrumentJson(), jsonArgs = {};
	var canSave = validateRequiredFields();
	jsonData.d.__metadata._headerId = strPaymentHeaderIde;
	jsonData.d.__metadata._detailId = strPaymentInstrumentIde;
	if (blnPrdCutOff === true) {
		jsonData.d.paymentEntry.standardField.push({
					fieldName : 'prdCutoffFlag',
					value : 'Y'
				});
	}
	jsonArgs.action = 'UPDATE';
	jsonArgs.jsonData = jsonData;
	doClearMessageSection();
	savePaymentInstrument(jsonData, postHandleSaveBatchInstrument, jsonArgs);
}

function doUpdateAndExitBatchInstrument(blnPrdCutOff,action,intCount,strMode) {
	if (!doValidateAccounts())
		return false;
	var jsonData = generatePaymentInstrumentJson(), jsonArgs = {};
	var canSave = validateRequiredFields();
	jsonData.d.__metadata._headerId = strPaymentHeaderIde;
	jsonData.d.__metadata._detailId = strPaymentInstrumentIde;
	if (blnPrdCutOff === true) {
		jsonData.d.paymentEntry.standardField.push({
					fieldName : 'prdCutoffFlag',
					value : 'Y'
				});
	}
	jsonArgs.action = 'UPDATEANDEXIT';
	jsonArgs.intCount = intCount;
	jsonArgs.strMode = strMode;
	if(action != undefined)
	{
		jsonArgs.action = action;
	}
	jsonArgs.jsonData = jsonData;
	doClearMessageSection();
	savePaymentInstrument(jsonData, postHandleSaveBatchInstrument, jsonArgs);
}

function doSaveAndAddBatchInstrument(blnPrdCutOff) {
	if (!doValidateAccounts())
		return false;
	var jsonData = generatePaymentInstrumentJson(), jsonArgs = {};
	var canSave = validateRequiredFields();
	jsonData.d.__metadata._headerId = strPaymentHeaderIde;
	if (blnPrdCutOff === true) {
		jsonData.d.paymentEntry.standardField.push({
					fieldName : 'prdCutoffFlag',
					value : 'Y'
				});
	}
	jsonArgs.action = 'SAVEANDADD';
	jsonArgs.jsonData = jsonData;
	doClearMessageSection();
	document.getElementById("saveandadd").value = "SAA";
	savePaymentInstrument(jsonData, postHandleSaveBatchInstrument, jsonArgs);
	if ("MIXEDLAYOUT" === strLayoutType) {
		//$('#transactionWizardPopup .canClear').empty();
		if (null != chrProductLevel && "I" === chrProductLevel) {
			/*$("#senderDetailsToggle,#paymentDetailsToggle,#additionalInfoToggle").removeAttr('style').addClass("collapseDiv");
			$("#senderDetailsToggleCaret,#paymentDetailsToggleCaret,#additionalInfoToggleCaret").removeClass("fa-caret-up").addClass("fa-caret-down");*/
			handlingForMixedLayout();
		}
	}
}

function doUpdateAndAddBatchInstrument(blnPrdCutOff) {
	if (!doValidateAccounts())
		return false;
	var jsonData = generatePaymentInstrumentJson(), jsonArgs = {};
	var canSave = validateRequiredFields();
	jsonData.d.__metadata._headerId = strPaymentHeaderIde;
	jsonData.d.__metadata._detailId = strPaymentInstrumentIde;
	if (blnPrdCutOff === true) {
		jsonData.d.paymentEntry.standardField.push({
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
	if (typeof objInstrumentEntryGrid != 'undefined' && objInstrumentEntryGrid) 
	{
	objInstrumentEntryGrid.refreshData();
	}
	blockPaymentUI(true);
	doClearMessageSection();
	blockPaymentUI(false);
}

function doCloseBatchInstrument(strAction) {
	closeTransactionWizardPopup();
	if (typeof objInstrumentEntryGrid != 'undefined' && objInstrumentEntryGrid) 
	{
	objInstrumentEntryGrid.refreshData();
	}
	blockPaymentUI(true);
	doClearMessageSection();
	blockPaymentUI(false);
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
						var isError = false;
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
function populateControtalTotalAdditionalInfo(objHdrInfo)
{
	var strHdrEnteredNo = '', strHdrEnteredAmount = '', strHdrTotalNo = '', strTotalAmount = '',   blnIsMultiCcy = false ;
	if (objHdrInfo) {
		strHdrEnteredNo = objHdrInfo.hdrEnteredNo;
		strHdrEnteredAmount = setDigitAmtGroupFormat(objHdrInfo.hdrEnteredAmountFormatted);
		strHdrTotalNo = objHdrInfo.hdrTotalNo;
		if (jQuery.isNumeric(strHdrTotalNo)
				&& jQuery.isNumeric(strHdrEnteredNo)
				&& (strHdrTotalNo - strHdrEnteredNo >= 0))
			strHdrTotalNo = strHdrTotalNo - strHdrEnteredNo;
		strTotalAmount = setDigitAmtGroupFormat(objHdrInfo.balanceAmountFormatted);
		blnIsMultiCcy = objHdrInfo.isMultiCcyTxn;	
		if (blnIsMultiCcy) {
			$('.hdrMultiCcyEditIconSpan').remove();
			var objMultiCcyIcon = $('<span>').attr('class',
					'iconlink grdlnk-notify-icon icon-gln-fcy hdrMultiCcyEditIconSpan');
			$(objMultiCcyIcon)
					.insertBefore($("#hdrEnteredAmountFormattedHdrInfoSpan, #balanceAmountFormattedHdrInfoSpan"));
		} 
		else
		{
			$('.hdrMultiCcyEditIconSpan').remove();
		$('#hdrEnteredAmountFormattedHdrInfoSpan, .hdrEnteredAmountFormatted_HdrInfo').html(strHdrEnteredAmount); 
		$('#balanceAmountFormattedHdrInfoSpan, .balanceAmountFormatted_HdrInfo').html(strTotalAmount);
		$('#enteredInstCountHdrInfoSpan, .enteredInstCount_HdrInfo').html(strHdrEnteredNo);
		$('#totalInstCountHdrInfoSpan, .totalInstCount_HdrInfo').html(strHdrTotalNo);
		
		}
		
		$('.hdrStatus_InfoSpanDiv').removeClass('hidden');
		$('.controlTotalHdrInfoDiv ').removeClass('hidden');
	}
}
function postHandleSaveBatchInstrument(data, args) {
	var status = null, strPirNo = null, strUniqueRef = null, isBtnVisible = true, isFileUpload = true, strButtonMask,strRightsMask, strActionMask = null;
	var action = args.action;
	if (data && data.d) {
		if (data.d.paymentEntry && data.d.paymentEntry.message
				&& data.d.paymentEntry.message.success)
			status = data.d.paymentEntry.message.success;
		// This is used to handle the control total validation
		var blnFlag = doValidationForControlTotal();
		isBtnVisible = blnFlag ? isAddAnotherTxnButtonVisible(data) : true;

		if (status === 'SUCCESS' && data.d.paymentEntry.message.errors && data.d.paymentEntry.paymentHeaderInfo 
				&& data.d.paymentEntry.paymentHeaderInfo.hdrBankProduct === 'CTX') {		
			txnWzErrorStatus = true ;
			paintErrors(data.d.paymentEntry.message.errors);
		}
		if (status === 'SUCCESS' || status === 'SAVEWITHERROR') {
			if (data.d.paymentEntry && data.d.__metadata
					&& data.d.__metadata._detailId)
				strPaymentInstrumentIde = data.d.__metadata._detailId;
			if (data.d.paymentEntry && data.d.__metadata
					&& data.d.__metadata._headerId)
				strPaymentHeaderIde = data.d.__metadata._headerId;
			toggleDirtyBit(true);
			//Performance
			/*if (data.d.paymentEntry && data.d.paymentEntry.paymentHeaderInfo)
			 {
			 populatePaymentHeaderViewOnlySection(null,
			 data.d.paymentEntry.paymentHeaderInfo, 'Y', 'EDIT');
			
			 updatePaymentSummaryHeaderInfo(data.d.paymentEntry.paymentHeaderInfo);
						}*/

			if (!isEmpty(data.d.paymentEntry.message.pirNo)) {
				var msgDtls = {
					'pirNo' : data.d.paymentEntry.message.pirNo,
					'uniqueRef' : data.d.paymentEntry.message.uniqueRef,
					'txnReference' : $('#referenceNo').val()
				};
				// paintSuccessMsg(msgDtls, 'Q');
			}
			
			if(data.d.paymentEntry.paymentMetaData._docUploadEnabled){
				if(data.d.paymentEntry.paymentMetaData._docUploadEnabled === 'Y'){
					if ($("#paymentImageFile") && $("#paymentImageFile")[0]
					&& $("#paymentImageFile")[0].files && $("#paymentImageFile")[0].files[0]) {
						isFileUpload = uploadAttachedDocumentFile(strPaymentInstrumentIde);
					}
				}
			}

			if (data.d.__metadata && data.d.__metadata._buttonMask)			
				strButtonMask = data.d.__metadata._buttonMask;


			if (data.d.__metadata && data.d.__metadata.__rightsMap)	
				strRightsMask = data.d.__metadata.__rightsMap;

			var maskArray = new Array();
			maskArray.push(strButtonMask);
			maskArray.push(strRightsMask);
			var intMaskSize = !isEmpty(strButtonMask)
					? strButtonMask.length
					: (!isEmpty(strRightsMask) ? strRightsMask.length : 0);
			strActionMask = doAndOperation(maskArray, intMaskSize);			
			
			if (status === 'SUCCESS' || status === 'SAVEWITHERROR') {
				switch (action) {
					case 'SAVE' :
						paintPaymentBatchInstrumentActions('UPDATE',
								isBtnVisible,strActionMask);
						if (status != 'SAVEWITHERROR' && status != 'UPDATEWITHERROR')
							doCancelBatchInstrument(strAction);
						break;
					case 'UPDATE' :
						paintPaymentBatchInstrumentActions('UPDATE',
								isBtnVisible,strActionMask);
						if (status != 'SAVEWITHERROR' && status != 'UPDATEWITHERROR')
							doCancelBatchInstrument(strAction);
						break;
					case 'SAVEANDADD' :
					case 'UPDATEANDADD' :
						if (status !== 'SAVEWITHERROR' && isFileUpload === true) {
							postHandleSaveAndAddInstrument();
							if (typeof objInstrumentEntryGrid != 'undefined' && objInstrumentEntryGrid) {
								txnAction = action ;
								objInstrumentEntryGrid.refreshData();
							}
						}
						break;
					case 'SAVEANDEXIT' :
					      paintPaymentBatchInstrumentActions('UPDATE',
                                isBtnVisible,strActionMask);
					      if (status != 'SAVEWITHERROR' && status != 'UPDATEWITHERROR')
								doCancelBatchInstrument(strAction);
                        break;
					case 'UPDATEANDEXIT' :
						paintPaymentBatchInstrumentActions('UPDATE',
                                isBtnVisible,strActionMask);
						 if (status != 'SAVEWITHERROR' && status != 'UPDATEWITHERROR')
								doCancelBatchInstrument(strAction);
					case 'UPDATEANDNEXT' :
						paintPaymentBatchInstrumentActions('UPDATE',
                                isBtnVisible,strActionMask);	
						break;
					default :
						break;
				}
				if (action === 'SAVE' || action === 'UPDATE'
						|| action === 'SAVEANDADD' || action === 'UPDATEANDADD'
						|| action === 'SAVEANDEXIT'
						|| action === 'UPDATEANDEXIT') {
					if (!isEmpty(data.d.paymentEntry.paymentHeaderInfo)) {
						var payHeaderInfo = data.d.paymentEntry.paymentHeaderInfo;
						var flagControlTotal = doValidationForControlTotal();
						// Update control total amount and number of instruments
						// if control total validation is not set.
						if ((!isEmpty(payHeaderInfo.hdrTotalNo))
								&& (!isEmpty(payHeaderInfo.totalAmount))
								&& !flagControlTotal) {
							$('#totalNoHdr').val(payHeaderInfo.hdrTotalNo);
							$('#amountHdr').val(payHeaderInfo.totalAmount);
							$('#amountHdr').trigger('blur');
						}
						if(flagControlTotal)
						{
							populateControtalTotalAdditionalInfo(payHeaderInfo);
						}
					}
				}
				if (status === 'SAVEWITHERROR') {
					if (data.d.paymentEntry.message.errors)
						{
							txnWzErrorStatus = true ;
							paintErrors(data.d.paymentEntry.message.errors);
						}
						
					if (action === 'SAVEANDADD' || action === 'UPDATEANDADD'
							|| action === 'SAVEANDEXIT'
							|| action === 'UPDATEANDEXIT') {
						paintPaymentBatchInstrumentActions('UPDATEWITHERROR',
								isBtnVisible,strActionMask);
						doShowSaveWithErrorConfirmationDialog(action);
						//autoFocusFirstElement('INSTRUMENT');
					}
				}
			}
			autoFocusFirstElement('INSTRUMENT');
			if(action === 'SAVEANDADD' || action === 'UPDATEANDADD')
			{
				$("#drawerDescriptionA").blur();
				$("#drawerDescriptionA").removeClass('requiredField');
				
			}
		} else if (status === 'FAILED') {
			if (data.d.paymentEntry.message) {
				var arrError = data.d.paymentEntry.message.errors;
				var isProductCutOff = false;
				var strMsg = mapLbl['instrumentProductCutoffMsg'], errCode = null;
				if (arrError && arrError.length > 0) {
					$.each(arrError, function(index, error) {
						// strMsg = error.errorMessage;
						errCode = error.errorCode;
						if (!isEmpty(errCode)
										&& errCode.toUpperCase()
												.indexOf("WARN") >= 0) {
									isProductCutOff = true;
								}
					});
				}
				if (isProductCutOff) {
					doClearMessageSection();
					var strTitle = mapLbl['warnMsg'];
					showAlert(200, 400, strTitle, strMsg,
							handleProductCutOffBatchInstrument, args);
				} else {
					txnWzErrorStatus = true ;
					paintErrors(data.d.paymentEntry.message.errors);
					autoFocusFirstElement('INSTRUMENT');
				}
			}
		} else if (isEmpty(status) && data.d.paymentEntry.message.errors) {
			// $('#successMessageArea').addClass('hidden');
			txnWzErrorStatus = true ;
			paintErrors(data.d.paymentEntry.message.errors);
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
	document.getElementById("saveandadd").value = "";
}

function postHandleSaveAndExitInstrument() {
	strPaymentInstrumentIde = '';
	//closeTransactionWizardPopup();
	if (typeof objInstrumentEntryGrid != 'undefined' && objInstrumentEntryGrid) {
		objInstrumentEntryGrid.refreshData();
	}
}
function doHandleEntryGridLoading(isViewOnly, isGridActionEnabled,isEnableRowAction) {
	if (typeof objInstrumentEntryGrid != 'undefined' && objInstrumentEntryGrid) {
		objInstrumentEntryGrid.refreshData();
	} else {
		loadPaymentBatchInstrumentFieldsForGridLayout(strPaymentHeaderIde,false,isViewOnly);
		doCreateInstrumentEntryGrid(instrumentEntryGridRowData,
				chrAllowGridLayoutEntry, isViewOnly, strIdentifier,
				isGridActionEnabled,isEnableRowAction);
	}
}
function handleBatchDetailGridRowAction(grid, rowIndex, columnIndex, action,
		event, record) {
	blockBatchHeaderUI(true);
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
		if (strAction === 'btnEdit' && intHdrDirtyBit > 0)
			doUpdatePaymentHeaderSilent();
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
			var controlTotalVal = $('#controlTotalHdr').val();
			var totalCount =0;
			if (controlTotalVal === 'Y' || ($('#controlTotalHdrDiv').hasClass('hidden') && strPaintAction === 'UPDATE')) 
			{
				totalCount = $('#totalNoHdr').val();
			}
			else
			{
				if(instGrid)
				{
					if(instGrid.store.totalCount > instGrid.getCurrentPage()*instGrid.getPageSize())
					{
						totalCount = instGrid.getCurrentPage()*instGrid.getPageSize()
					}
					else
					{
						totalCount = instGrid.store.totalCount;
					}
				}
			}
			if (strPaintAction === 'VIEW') {
				if (instGrid) {
					toggleInstrumentPagination(strPaintAction);
					updatePagingParamsView(instGrid.getRowNumber(rowIndex + 1),
							totalCount);
					if(instGrid.store.getCount() === 1){
						$('.previousTxn').addClass('button-grey-effect');
						$('.nextTxn').addClass('button-grey-effect');
					}
				}
			}
			if (strPaintAction === 'UPDATE') {
				$('.instrumentEditPaginationBar').removeClass('hidden');
				var instGrid = getInstrumentGrid();
				if (instGrid) {
					toggleInstrumentPagination(strPaintAction);
					updatePagingParamsEdit(instGrid.getRowNumber(rowIndex + 1),
							totalCount);
					if(instGrid.store.getCount() === 1){
						$('.previousTxnUpdate').addClass('button-grey-effect');
						$('.nextTxnUpdate').addClass('button-grey-effect');
					}
				}
			}
			showTransactionWizardPopup(strInstIdentifier, strPaintAction,
					strDivId, strActionMask, record);
		}
	}
}
function toggleInstrumentPagination(strMode) {
	var classSuffix = strMode === 'UPDATE' ? 'Update' : '';
	$('.previousTxn' + classSuffix).unbind('click').bind('click', function() {
        if(null!=$('#previousTxnUpdate')){
           $('#previousTxnUpdate' ).attr('disabled','disabled');
        }
		handleInstrumentPagination(-1, strMode);
    });
	$('.nextTxn' + classSuffix).unbind('click').bind('click', function() {
       if(null!=$('#nextTxnUpdate')){
           $('#nextTxnUpdate' ).attr('disabled','disabled');
        }
		handleInstrumentPagination(1, strMode);
	});
}
function updatePagingParamsEdit(intCurrentIndex, intTotalRows) {
	$('.currentPageUpdate').html(intCurrentIndex);
	$('.totalPagesUpdate').html(intTotalRows);
	if(intCurrentIndex === 1){
		$(".previousTxnUpdate").addClass('button-grey-effect');
		$(".nextTxnUpdate").removeClass('button-grey-effect');
	} else if(intCurrentIndex === intTotalRows){
		$(".previousTxnUpdate").removeClass('button-grey-effect');
		$(".nextTxnUpdate").addClass('button-grey-effect');
	} else {
		$(".previousTxnUpdate").removeClass('button-grey-effect');
		$(".nextTxnUpdate").removeClass('button-grey-effect');
	}
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
	txnWzErrorStatus = false ;
	var grid = getInstrumentGrid();
	var intPgSize = 0;
	var intTotalRecords = 0, intRecordIndex = 0, intCurrentPage;
	var controlTotalCount , gridTotalCount ;
	controlTotalCount = $('#totalNoHdr').val();
	blockPaymentInstrumentHeaderLinks(true,strMode);
	if(grid.store.totalCount > (grid.getCurrentPage() * grid.getPageSize()) )
	{
		gridTotalCount = grid.getCurrentPage() * grid.getPageSize()
	}
	else
	{
		gridTotalCount = grid.store.totalCount;
	} 
	if(strMode != "VIEW" && controlTotalCount == gridTotalCount)
	{
		doUpdateAndExitBatchInstrument(false,'UPDATEANDNEXT',intCount,strMode);
	}
	else
	{
		loadTxnWizardOnNavigation(intCount,strMode);
	}
}

function loadTxnWizardOnNavigation(intCount,strMode)
{
	var intMoveTo = 0 , record , strInstIdentifier , strActionMask = null;
	var classSuffix = (strMode === 'UPDATE') ? 'Update' : '';
	var intCurrentInst = parseInt($($('.currentPage' + classSuffix)[0]).text(),10);
	var btnAction = (intCount === -1 ) ? $('.previousTxn' + classSuffix) : $('.nextTxn' + classSuffix);
	var controlTotalVal = $('#controlTotalHdr').val();
	var controlTotalCount , gridTotalCount ;
	var grid = getInstrumentGrid();
	controlTotalCount = $('#totalNoHdr').val();
	if(grid.store.totalCount > (grid.getCurrentPage() * grid.getPageSize()) )
	{
		gridTotalCount = grid.getCurrentPage() * grid.getPageSize()
	}
	else
	{
		gridTotalCount = grid.store.totalCount;
	} 
	if (grid && txnWzErrorStatus == false) {
		intMoveTo = intCurrentInst + intCount;
		if(grid.getCurrentPage()>1)
		{
			record = grid.getRecord(intMoveTo - ((grid.getCurrentPage()-1)* grid.getPageSize()));
		}
		else
		{	
			record = grid.getRecord(intMoveTo);
		}
		if (record) {
			btnAction.attr('disabled','disabled');
			if (record && record.data && record.data.__metadata
					&& record.data.__metadata._detailId)
				strInstIdentifier = record.data.__metadata._detailId;
				
				if (record.store
					&& record.store.proxy
					&& record.store.proxy.reader
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
		
			if (strInstIdentifier) {
				strPaymentInstrumentIde = '';
				doClearMessageSection();
				blockPaymentInstrumentUI(true);
				
				var totalCount =0;
				if (controlTotalVal === 'Y' || ($('#controlTotalHdrDiv').hasClass('hidden') && strMode === 'UPDATE' )) 
				{
					totalCount = controlTotalCount;
				}
				else
				{
					totalCount = gridTotalCount ;
				}
				if (strMode === 'UPDATE') {
					setTimeout(function() { editPaymentBatchInstrument(strInstIdentifier, 'UPDATE',strActionMask,btnAction); }, 800);
					updatePagingParamsEdit(intMoveTo, totalCount);
				} else if (strMode === 'VIEW') {
					viewPaymentBatchInstrument(strInstIdentifier, 'VIEW', strActionMask);
					updatePagingParamsView(intMoveTo, totalCount);
					btnAction.removeAttr('disabled');
				}
			}
			setTimeout(function(){
					$(btnAction).focus();
			}, 400);
		} else {
			btnAction.removeAttr('disabled');
			blockPaymentInstrumentHeaderLinks(false,strMode);
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
		title : getLabel('importTransactions', 'Import Transactions'),
		/*buttons : {
			Cancel : function() {
				$(this).dialog("close");
			}*//*
				 * , Import : function() { doUploadFile(); }
				 */
		/*},*/
		open : function(event, ui) {
			//$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset button').addClass('receiverselection-footer-button import-transactions-xbtn-left');
			$("#importmessageContentDiv").addClass('ui-helper-hidden');
			populateClientMapCodeField();
			$('#transactionImportFile').unbind("change");
			$('#transactionImportFile').bind("change", function() {
			     var fullpath = document.getElementById('transactionImportFile').value;
			     if(_IsEmulationMode == true)
			     {
                    $("#importTxn_btnUpload").attr('disabled', 'disabled');
					$("#importTxn_btnCancel").attr('onkeydown','autoFocusOnFirstElement(event,"importTransactionPopup",false)');
			     } else {
					if (fullpath == "") 
					{
						$("#importTxn_btnUpload").attr('disabled', 'disabled');
						$("#importTxn_btnCancel").attr('onkeydown','autoFocusOnFirstElement(event,"importTransactionPopup",false)');
					}
					else
					{
						$("#importTxn_btnUpload").removeAttr('disabled');
						$("#importTxn_btnCancel").removeAttr('onkeydown');
					}
				}
					});
			$("#transactionImportFileName").html('');
			$("#transactionImportFileName").attr('title','');
			$('#transactionImportFile').val('');
			$('#importTxn_btnUpload').attr('disabled','disabled');
			$("#importTxn_btnCancel").attr('onkeydown','autoFocusOnFirstElement(event,"importTransactionPopup",false)');
				$('#txnDetailsGridDiv').empty();
				txnDetailsGrid = createTxnDetailsGrid('txnDetailsGridDiv',strPaymentHeaderIde);
				setTimeout(function(){
                    $('#clientMapCode-niceSelect').focus();
                    }, 400);
		},
		close : function(event, ui) {
			if (typeof objInstrumentEntryGrid != 'undefined'
					&& objInstrumentEntryGrid) {
				objInstrumentEntryGrid.refreshData();
			}
		}
	});
}

function chkImportEnabled(type,btnElm)
{
	if("CANCEL" == type)
	{
    if ($('#importTxn_btnUpload').is(':disabled'))
        {
			autoFocusOnFirstElement(event, 'importTransactionPopup', false);
    }   
        }
}
function closeImportTransactionsPopup() {
	$('#importTransactionPopup').dialog('close');
	countr = 6;
	if(objInstrumentEntryGrid != null)
		objInstrumentEntryGrid.refreshData();
}
function populateClientMapCodeField() {
	var strData = {};
	strData["instSubType"] = getProductInstrumentSecCode();
	strData["identifier"] = strPaymentHeaderIde;
    strData[csrfTokenName] = csrfTokenValue;
    $.ajax({
				url : 'services/ach/mapcodelist.json',
				data : strData,
				method : 'POST',
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
					$("#clientMapCode").niceSelect("destroy");
					$("#clientMapCode").niceSelect();
				}
			});
}
function doUploadFile() {
	var data = new FormData();
	data.append("id",strPaymentHeaderIde)
	data.append("file",
			document.getElementById('transactionImportFile').files[0]);
	data.append("clientMapCode", $('#clientMapCode').val());
	data.append("is", $('input[name=processParameterBean]:checked').val());
	$('#importmessageContentDiv').addClass('hidden');
	blockPaymentUI(true);
	$.ajax({
		url : _mapUrl['fileUploadUrl'] + "/id.json",
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
				//closeImportTransactionsPopup();
				paintImportErrors(arrError);
			}
			setTimeout(function() { autoFocusOnFirstElement(null, "importTransactionPopup", true); }, 100); 
		},
		success : function(data) {
			intervalFlag = false;
			countr = 0;
			if (data && data.d && data.d.success === 'SUCCESS') {
				//closeImportTransactionsPopup();
				readPaymentHeaderForEdit(strPaymentHeaderIde, strIdentifier);
				blockPaymentUI(false);
				refreshTxnDetailseGrid(refreshFlag);
				$('#spanHdrFileUploadRemark').text(data.d.remarks);
			} else if (data && data.d && data.d.success === 'FAILED') {
				//closeImportTransactionsPopup();
				if (data.d.message) {
					paintImportErrors(data.d.message.errors);
				}
				blockPaymentUI(false);
				refreshTxnDetailseGrid(refreshFlag);
				$('#spanHdrFileUploadRemark').text(data.d.remarks);
			} else {
				pollForFileUpload = true;
				//closeImportTransactionsPopup();
				readPaymentHeaderForView(strPaymentHeaderIde, strIdentifier);
				// doHandleFileUploadStatus();
				blockPaymentUI(false);
				refreshTxnDetailseGrid(refreshFlag);
				$('#paymentHdrActionButtonListRT,#paymentHdrActionButtonListRB')
						.empty();

			}
			$('#importTxn_btnUpload').attr('disabled','disabled');
			$("#importTxn_btnCancel").attr('onkeydown','autoFocusOnFirstElement(event,"importTransactionPopup",false)');
			$('#transactionImportFile').val('');
			$('#transactionImportFileName').html('');			
			setTimeout(function() { autoFocusOnFirstElement(null, "importTransactionPopup", true); }, 100); 
		}
	});
}

function paintImportErrors(arrError, strErrorType,arrFnCallbackWithArguments,strErrTitle) {
	var element = null, strMsg = null, strTargetDivId = 'importmessageArea', strErrorCode = '';
	var strErrTitle = !isEmpty(strErrTitle) ? strErrTitle : getLabel('errorlbl','ERROR')
	/*
	 * if (strErrorType === 'CASHIN') strTargetDivId = 'cashinMessageArea';
	 */

	if(!isEmpty(strErrTitle)){
		$('#importmessageCodeSpan').empty();
		$('#importmessageCodeSpan').text(strErrTitle+':');
	}
	if(!Ext.isEmpty(arrError) && !Ext.isEmpty(arrError[0]) && arrError[0].errorCode && arrError[0].errorCode.indexOf('WARN') != -1 )
	{
		$('#importmessageCodeSpan').empty();
		$('#importmessageCodeSpan').text('');
	}
	
	if (arrError && arrError.length > 0) {
		$('#' + strTargetDivId).empty();
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
							element = $('<p>').text(msg + error.errorMessage);
							//element.appendTo($('#successMessageArea'));
							element.appendTo($('#' + strTargetDivId));
							$('#' + strTargetDivId + ', #importmessageContentDiv')
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
							$('#' + strTargetDivId + ', #importmessageContentDiv')
									.removeClass('hidden');
						}

					}
				});

	}
	$("#importmessageContentDiv").removeClass("ui-helper-hidden");
}

function doHandleFileUploadStatus() {
	$.ajax({
		url : _mapUrl['fileUploadStatusUrl'] + "/id.json",
		type : "POST",
		data : {
			'id' : strPaymentHeaderIde			
		},
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
	$("#moreLessCriteriaCaret").toggleClass("fa-caret-up fa-caret-down");
	var textContainer = $(me).children("#moreLessCriteriaText");
	var labelText=textContainer.text().trim();
	if(labelText==getLabel("lblHideImportHeader", "Hide Import Transaction Details")) {
		textContainer.text(getLabel("lblShowImportHeader","Show Import Transaction Details"));
		
	} else if(labelText==getLabel("lblShowImportHeader","Show Import Transaction Details")) {
		textContainer.text(getLabel("lblHideImportHeader", "Hide Import Transaction Details"));
		
	}
    if($(".moreCriteria").is(":hidden"))
    {
                    $("#a_refresgGrid").hide();
    }
    else{
                    $("#a_refresgGrid").show();
    }
	/*if($('.moreCriteria').is(':visible')) {
		$(me).text(getLabel('lblHideImportHeader',
				"Hide Import Transaction Details"));
	}
	else{
		$(me).text(getLabel('lblShowImportHeader',
				"Show Import Transaction Details"));
	}*/
}

// =============Import Transactions Using File Upload Ends=================
function doHandlePaymentHeaderActions(strAction, strRemarks, strBackUrl,strRekeyIdentifier,cutoffProduct) {
	amtKeyValdation = strRekeyIdentifier;
	var cutOffInst =   {"instruments":[]};
	var arrayJson = new Array(), strMsg = '';
	var strUrl='';
	if(strAction === 'InstSend')
	{
		strUrl = _mapUrl['gridGroupActionUrl'] + '/' + strAction + '.json';
	}	
	else
	{
		strUrl = _mapUrl['batchHeaderActionUrl'] + '/' + strAction + '.json';
	}
	arrayJson.push({
				serialNo : 0,
				identifier : strPaymentHeaderIde,
				userMessage : isEmpty(strRemarks) ? '' : strRemarks,
				flipProduct	: flipProduct,	
				filterValue1 : isEmpty(strRekeyIdentifier) ? '' : strRekeyIdentifier,
				filterValue2 : isEmpty(cutoffProduct) ? '' : cutoffProduct		
			});
	blockBatchHeaderUI(true);
	Ext.Ajax.request({
		url : strUrl  + '?' + csrfTokenName + "=" + csrfTokenValue,
		type : "POST",		
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
		blockBatchHeaderUI(false);
			var jsonRes = Ext.JSON.decode(jsonData.responseText);
			var flipProductList;
			var flipFlag ='N'
			if (jsonRes && jsonRes.d && jsonRes.d.instrumentActions) {
				var arrResult = jsonRes.d.instrumentActions;
				var isError = false;
				var isInstSend = false;
				var cutoffProduct = null ,cutoffProductDesc =null;
				if(isInstLvlSend === 'true' && strAction ==='InstSend' && arrResult.length > 1)
					isInstSend = true;
				if ((arrResult && arrResult.length == 1) || isInstSend === true) {
					if (arrResult[0].success === 'Y') {
						if((strAction ==='send' || strAction ==='auth' || strAction === 'submit' || strAction ==='InstSend') && arrResult[0].isWarning === 'Y' ){
								var strBtnId = 'button_btn'+(strAction.substr(0, 1).toUpperCase() + strAction.substr(1));
								doClearMessageSection();
								paintErrors(arrResult[0].errors,'',mapLbl['warnMsg']);
								$('#'+strBtnId).unbind('click');
							 		$('#'+strBtnId).bind('click', function(){
							 			goToPage(_mapUrl[strBackUrl || 'cancelBatchUrl'], 'frmMain');
							 		});
						 		if (typeof objInstrumentEntryGrid != 'undefined' && objInstrumentEntryGrid) {
						 			objInstrumentEntryGrid.refreshData();
						 		}
							}
						else if(isInstCutOff == true)
						{
							if (typeof objInstrumentEntryGrid != 'undefined' && objInstrumentEntryGrid) {
					 			objInstrumentEntryGrid.refreshData();
					 		}
						}
						else
							goToPage(_mapUrl[strBackUrl || 'cancelBatchUrl'], 'frmMain');
					} else if (arrResult[0].success === 'N') {
						if (arrResult[0].errors) {
							var arrError = arrResult[0].errors, isProductCutOff = false, isFxRateError = false, errCode = null;
							if (arrError && arrError.length > 0) {
								$.each(arrError, function(index, error) {
											strMsg = strMsg + error.code
													+ ' : '
													+ error.errorMessage;
											errCode = error.code;
											cutoffProduct = error.errorMessage;
											cutoffProductDesc = cutoffProduct.substring(0 ,cutoffProduct.length - 3) + ' ('+ 
											cutoffProduct.substring(cutoffProduct.length - 3 ,cutoffProduct.length )+')';
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
										|| strAction === 'send'
										|| strAction === 'InstSend') {
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
								showPaymentEntryCutoffAlert(
										212,
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
											cutoffProduct = error.errorMessage;
											cutoffProductDesc = cutoffProduct.substring(0 ,cutoffProduct.length - 3) + ' ('+ 
											cutoffProduct.substring(cutoffProduct.length - 3 ,cutoffProduct.length )+')';
											if (errCode && (errCode.indexOf( 'SHOWPOPUP') != -1 || errCode.indexOf( 'WARN') != -1) || errCode.indexOf( 'GD0002') != -1 ) {
												isFxRateError = true;
												if(errCode.indexOf('SHOWPOPUP,CUTOFF,ROLLOVER,FLIP') != -1 || 'Y' == error.flag )
													{
													  flipProductList = error.productMap;
													  flipFlag = 'Y';
													  if(!isEmpty(error.disableCutoffBtn)){
														  disableCutoffBtns = error.disableCutoffBtn;  
													  }													  
													}
											}
											cutOffInst.instruments.push({
											    "paymentFxInfo": arrResult[0].paymentFxInfo,
											    "strAction":strAction,
											    "errorCode" : errCode ,
											    "cutoffProduct":cutoffProduct,
											    "cutoffProductDesc":cutoffProductDesc
											  });
										});
							}
							if (isFxRateError) {
									if(isNaN(fxTimer))  fxTimer = 10;
									if(cutOffInst && cutOffInst.instruments && cutOffInst.instruments.length > 0)
									{
										countdownInstTimerVal = null;
										isInstCutOff=  true;
										if (isNaN(fxTimer))
											fxTimer = 10;
										var countdown_number = 60 * fxTimer;
										countdownInstTimerVal = countdown_number;
										rowAction = "B";
										takeCutOffInstrumentAction(cutOffInst,0, flipProductList,flipFlag);
										showCutOffTimer(countdownInstTimerVal);
									}
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
			blockBatchHeaderUI(false);
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
function paintPaymentHdrAdditionalInformationSection(strPmtType, strMode) {
	var strPostFix = '_InfoSpan';
	var blnCollapsed = false;
	$('#paymentHeadeerTrasanctionSummaryDiv .canClear').empty();
	if ($('#paymentHeadeerTrasanctionSummaryDiv .vertical-collapsible-contents')
			.hasClass('content-display-none')) {
		$('#paymentHeadeerTrasanctionSummaryDiv span.expand-vertical')
				.trigger('click');
		blnCollapsed = true;
	}
	strIdentifierForInfo= strPaymentHeaderIde;
	isFromProductChange = true;
	if(gridFocusOut == false)
	{
	autoFocusFirstElement(null);
	}
	gridFocusOut = false ;
	isFromProductChange = false;
	paintPaymentInformation(strPostFix, strPaymentHeaderIde, strPmtType,
			blnCollapsed, strMode);
}
function setSelectedReceiverForBatchHeader(record) {
	$('#drawerCodeHdr').val(record['code']);
	$('#drawerDescriptionHdr').val(record['receiverName']);
}
function handleLayoutSpecificSettingsForVerifyScreen(objHdrInfo, strPostFix) {
	if (!isEmpty(strLayoutType) && 'MIXEDLAYOUT' === strLayoutType) {
		$('#referenceNo' + strPostFix + 'SummaryDiv').removeClass('hidden');
		$('#drawerDescription' + strPostFix + 'SummaryDiv')
				.removeClass('hidden');
	}
}
function getBatchHeaderReceiverUrl(strProduct) {
	var strUrl = 'services/recieverseek';
	if (!isEmpty(strProduct))
		strUrl += '/' + strProduct;

	if ($('#bankProductHdr').val() != '') {
		strUrl += "/" + $('#bankProductHdr').val() + ".json"
	} else {
		strUrl += ".json";
	}
	if (strLayoutType === 'TAXLAYOUT' || strLayoutType === 'MIXEDLAYOUT')
		strUrl += '?$top=-1';
	return strUrl;
}
jQuery.fn.ReceiverHeaderAutoComplete = function(strProduct, strBankProduct,
		charPaymentType, isRegistered) {
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				$.ajax({
							url : getBatchHeaderReceiverUrl(strProduct),
							dataType : "json",
							data : {
								qfilter : request.term
							},
							success : function(data) {
								if (data && data.d && data.d.receivers) {
									var rec = data.d.receivers;
									response($.map(rec, function(item) {
												return {
													label : item.receiverName,
													value : item.receiverName,
													beneCode : item.receiverCode,
													receiverId : item.receiverId,
													details : item
												}
											}));
								}
							}
						});
			},
			minLength : 1,
			select : function(event, ui) {
				if (ui.item) {
					var beneData = ui.item;
					$('#drawerCodeHdr').val(beneData.beneCode || '');
					$('#drawerDescriptionHdr').val(beneData.label || '');
					$(this).attr('oldValue', beneData.label);
				}
			},
			change : function() {
				if ($('#drawerDescriptionHdr').attr('oldValue') !== $('#drawerDescriptionHdr')
						.val()) {
					$('#drawerCodeHdr').val('');
					$('#drawerDescriptionHdr').val('');
				}
			},
			open : function() {
				$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
			},
			close : function() {
				$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
			}
		})/*.data("autocomplete")._renderItem = function(ul, item) {
			var val = item.beneCode;
			if (strLayoutType === 'TAXLAYOUT'
					|| strLayoutType === 'MIXEDLAYOUT') {
				val = '';
			}
			var inner_html = '<a><ol class="t7-autocompleter"><ul>' + val
					+ '</ul><ul">' + item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});

};

function showApprovalConfirmationTxnPopup(strUrl, remark, grid,
		arrSelectedRecords, strActionType, strAction) {
	var me = this;
	_objDialog = $('#approvalConfirmationPaymentTxnViewScreenPopup');
	_objDialog.dialog({
				bgiframe : true,
				autoOpen : false,
				modal : true,
				resizable : false,
				width : "320px",
				strUrl : strUrl,
				remark : remark,
				grid : grid,
				arrSelectedRecords : arrSelectedRecords,
				strActionType : strActionType,
				strAction : strAction
			});
	_objDialog.dialog('open');
}
function approvalConfirmationTxnApprove() {
	var strUrl = $("#approvalConfirmationPaymentTxnViewScreenPopup").dialog("option", "strUrl");
	var remark = $("#approvalConfirmationPaymentTxnViewScreenPopup").dialog("option", "remark");
	var grid = $("#approvalConfirmationPaymentTxnViewScreenPopup").dialog("option", "grid");
	var arrSelectedRecords = $("#approvalConfirmationPaymentTxnViewScreenPopup").dialog("option", "arrSelectedRecords");
	var strActionType = $("#approvalConfirmationPaymentTxnViewScreenPopup").dialog("option", "strActionType");
	var strAction = $("#approvalConfirmationPaymentTxnViewScreenPopup").dialog("option", "strAction");
	$(document)
			.trigger(
					"handleTxnApporvalConfirmed",
					[strUrl, remark, grid, arrSelectedRecords, strActionType,
							strAction]);
	$('#approvalConfirmationPaymentTxnViewScreenPopup').dialog("close");
}
function closeApprovalConfirmationTxnApprove(){
	$('#approvalConfirmationPaymentTxnViewScreenPopup').dialog("close");
}

function showVerifyConfirmationTxnPopup(strUrl, remark, grid,
		arrSelectedRecords, strActionType, strAction) {
	var me = this;
	_objDialog = $('#verifyConfirmationPaymentTxnViewScreenPopup');
	_objDialog.dialog({
				bgiframe : true,
				autoOpen : false,
				modal : true,
				resizable : false,
				width : "320px",
				strUrl : strUrl,
				remark : remark,
				grid : grid,
				arrSelectedRecords : arrSelectedRecords,
				strActionType : strActionType,
				strAction : strAction
			});
	_objDialog.dialog('open');
}
function verifySubmitConfirmationTxnApprove() {
	$('#verifyConfirmationPaymentTxnViewScreenPopup').dialog("close");
	$('#verifySubmitConfirmationPaymentScreenPopup').dialog("close");
	doVerifySubmitPaymentHeader() ;
}
function verifyConfirmationTxnApprove() {
	var strUrl = $("#verifyConfirmationPaymentTxnViewScreenPopup").dialog("option", "strUrl");
	var remark = $("#verifyConfirmationPaymentTxnViewScreenPopup").dialog("option", "remark");
	var grid = $("#verifyConfirmationPaymentTxnViewScreenPopup").dialog("option", "grid");
	var arrSelectedRecords = $("#verifyConfirmationPaymentTxnViewScreenPopup").dialog("option", "arrSelectedRecords");
	var strActionType = $("#verifyConfirmationPaymentTxnViewScreenPopup").dialog("option", "strActionType");
	var strAction = $("#verifyConfirmationPaymentTxnViewScreenPopup").dialog("option", "strAction");
	$(document)
			.trigger(
					"handleTxnVerifyConfirmed",
					[strUrl, remark, grid, arrSelectedRecords, strActionType,
							strAction]);
	$('#verifyConfirmationPaymentTxnViewScreenPopup').dialog("close");
}
function closeVerifyConfirmationTxnApprove(){
	$('#verifyConfirmationPaymentTxnViewScreenPopup').dialog("close");
}

function closeVerifySubmitConfirmationTxnApprove(){
	$('#verifySubmitConfirmationPaymentScreenPopup').dialog("close");
}

function quickUpdateApplyAll(){
	var strUrl = $("#quickUpdatePopupDiv").dialog("option", "strUrl");
	var remark = $("#quickUpdatePopupDiv").dialog("option", "remark");
	var grid = $("#quickUpdatePopupDiv").dialog("option", "grid");
	var arrSelectedRecords = $("#quickUpdatePopupDiv").dialog("option", "arrSelectedRecords");
	var strActionType = $("#quickUpdatePopupDiv").dialog("option", "strActionType");
	var strAction = $("#quickUpdatePopupDiv").dialog("option", "strAction");
	var strValue = $("#value").autoNumeric('get');    
	$(document)
			.trigger(
					"handleQuickUpdateApplyAll",
					[strUrl, remark, grid, arrSelectedRecords, strActionType,
							strAction,$("#updateBy").val(),strValue,$('input[name="operator"]:checked').val()]);
	$('#quickUpdatePopupDiv').dialog("close");
}


function quickUpdateApplySelected(){
	var strUrl = $("#quickUpdatePopupDiv").dialog("option", "strUrl");
	var remark = $("#quickUpdatePopupDiv").dialog("option", "remark");
	var grid = $("#quickUpdatePopupDiv").dialog("option", "grid");
	var arrSelectedRecords = $("#quickUpdatePopupDiv").dialog("option", "arrSelectedRecords");
	var strActionType = $("#quickUpdatePopupDiv").dialog("option", "strActionType");
	var strAction = $("#quickUpdatePopupDiv").dialog("option", "strAction");
	var strValue = $("#value").autoNumeric('get');        
	$(document)
			.trigger(
					"handleQuickUpdateApplySelected",
					[strUrl, remark, grid, arrSelectedRecords, strActionType,
							strAction,$("#updateBy").val(),strValue,$('input[name="operator"]:checked').val()]);
	$('#quickUpdatePopupDiv').dialog("close");
}

function quickUpdateCancel(){
	$('#quickUpdatePopupDiv').dialog("close");
}

function statusUpdateApplyAll(){
	var strUrl = $("#statusUpdatePopupDiv").dialog("option", "strUrl");
	var remark = $("#statusUpdatePopupDiv").dialog("option", "remark");
	var grid = $("#statusUpdatePopupDiv").dialog("option", "grid");
	var arrSelectedRecords = $("#statusUpdatePopupDiv").dialog("option", "arrSelectedRecords");
	var strActionType = $("#statusUpdatePopupDiv").dialog("option", "strActionType");
	var strAction = $("#statusUpdatePopupDiv").dialog("option", "strAction");
	
	var dholdUntilDate = Ext.util.Format.date(Ext.Date.parse(
						$("#holdUntilDate").val(),strExtApplicationDateFormat),
				 'Y-m-d');
				
	$(document)
			.trigger(
					"handleStatusUpdateApplyAll",
					[strUrl, remark, grid, arrSelectedRecords, strActionType,
							strAction,$("#statusFlag").val(),dholdUntilDate]);
	$('#statusUpdatePopupDiv').dialog("close");
}


function statusUpdateApplySelected(){
	var strUrl = $("#statusUpdatePopupDiv").dialog("option", "strUrl");
	var remark = $("#statusUpdatePopupDiv").dialog("option", "remark");
	var grid = $("#statusUpdatePopupDiv").dialog("option", "grid");
	var arrSelectedRecords = $("#statusUpdatePopupDiv").dialog("option", "arrSelectedRecords");
	var strActionType = $("#statusUpdatePopupDiv").dialog("option", "strActionType");
	var strAction = $("#statusUpdatePopupDiv").dialog("option", "strAction");
	var dholdUntilDate = Ext.util.Format.date(Ext.Date.parse(
						$("#holdUntilDate").val(),strExtApplicationDateFormat),
				 'Y-m-d');
				        
	$(document)
			.trigger(
					"handleStatusUpdateApplySelected",
					[strUrl, remark, grid, arrSelectedRecords, strActionType,
							strAction,$("#statusFlag").val(),dholdUntilDate]);
	$('#statusUpdatePopupDiv').dialog("close");
}

function statusUpdateCancel(){
	$('#statusUpdatePopupDiv').dialog("close");
}

function setValueType()
{
	if ($("#updateBy").val() === 'P')
	{
		$('#lbl_value').text(getLabel('lbl_value_per', 'Value (%)'));
		$('#value').autoNumeric('update', {vMax:'999.99'}); 
		//$('#value').autoNumeric('set', 0);
		$('#value').val('');
	}
	else
	{
		$('#lbl_value').text(getLabel('lbl_value', 'Value'));
		$('#value').autoNumeric('update', {vMax:'99999999999.99'}); 
		//$('#value').autoNumeric('set', 0);
		$('#value').val('');
	}
}

function selectStatusFlag()
{
	
	if ($("#statusFlag").val() === 'U')
	{
		$("#holdUntilDate").datepicker();
		$('#holdUntilDateDiv').removeClass('hidden');
		var minDate = Ext.Date.parse(dtApplicationDate,
									strExtApplicationDateFormat);
		if (minDate) 
			minDate = Ext.Date.add(minDate,Ext.Date.DAY, 1);	
		$("#holdUntilDate").datepicker("setDate", minDate);
		$('#holdUntilDate').datepicker("option", "minDate", minDate);
	}
	else
	{
		$('#holdUntilDateDiv').addClass('hidden');
	}
}

function toggleHeaderDirtyBit(blnApplyDirtyBit) {
	var field = null;
	intHdrDirtyBit = 0;
	if(blnApplyDirtyBit)
	$('#paymentHeaderEntryStep2A :text, #paymentHeaderEntryStep2A :file, #paymentHeaderEntryStep2A :checkbox, #paymentHeaderEntryStep2A :radio, #paymentHeaderEntryStep2A select, #paymentHeaderEntryStep2A textarea, #paymentHeaderEntryStep2A div.jq-nice-select, #paymentHeaderEntryStep2A div.jq-editable-combo')
			.each(function() {
						field = $(this);
						if (field && field.length != 0) {
							
								field.unbind('focus');
								field.bind('focus',function dirtyBitFocus() {
									intHdrDirtyBit++;
									//console.log('bit:'+intHdrDirtyBit);
									removeMarkRequired( this );
									var inputElement = $(this).parent().find('input.ft-datepicker');
									if (inputElement && inputElement.length > 0)
										openDatePicker(inputElement);
								});
						}
					});
}
function triggerPrenoteCheck() {
	if (strEntryType === 'TEMPLATE') {
		var isChecked = $('#prenoteHdr').attr('checked') ? true : false;
		$(document).trigger("prenoteChange", [isChecked]);
	}
}
function triggerHoldZeroCheck() {
	if (strEntryType === 'TEMPLATE') {
		var isChecked = $('#holdHdr').attr('checked') ? true : false;
		$(document).trigger("holdChange", [isChecked]);
	}
}
function triggerDrCrCheck() {
	
	var _strdrCrFlag = 'B';
	var isCrChecked = $('#drCrFlagHdrC').is(':checked');
	var isDrChecked = $('#drCrFlagHdrD').is(':checked');
	if (isCrChecked && isDrChecked)
		_strdrCrFlag = 'B';
	else if (isCrChecked)
		_strdrCrFlag = 'C';
	else if (isDrChecked)
		_strdrCrFlag = 'D';
	
	$(document).trigger("DrCrFlagChange", [_strdrCrFlag]);

}
function triggerHeaderAccountChange(){
		$(document).trigger("headerAccountChange", [$('#accountNoHdr').val()]);
		changeHdrButtonVisibility();
}
function toggleBatchAmountLabel(strAmountType) {
	$(document).trigger("changeAmountLbl", [strAmountType]);
}
function getProductInstrumentSecCode() {
	var data = paymentResponseHeaderData, arrStandardFields = [], objField = null, strProductSecCode = null;
	var strBankProduct = $('#bankProductHdr').val();
	if (data && data.d && data.d.paymentEntry
			&& data.d.paymentEntry.standardField) {
		arrStandardFields = data.d.paymentEntry.standardField;
	}
	arrStandardFields = data.d.paymentEntry.standardField;
	$.each(arrStandardFields, function(index, cfg) {
				if (cfg.fieldName === 'bankProduct') {
					objField = cfg;
				}
			});
	if (objField && objField.availableValues) {
		var arrAvailableValues = objField.availableValues;
		$.each(arrAvailableValues, function(index, element) {
					if (element.code === strBankProduct) {
						strProductSecCode = element && element.additionalInfo
								&& element.additionalInfo.INST_SUB_TYPE
								? element.additionalInfo.INST_SUB_TYPE
								: '';
					}
				});

	}
	return strProductSecCode;
}

function handlingForMixedLayout(){
	if($('#orderingPartyDescription').val() === ""){
		doClearMoreDetailsForRegisteredOrderingParty();
		$('#registeredOrderingPartyDetails').addClass('hidden');
	} else{
		var opVal = $('#orderingPartyDescription').val();
		doPaintMoreDetailsForRegisteredOrderingParty(opVal,'registeredOrderingPartyDetails', false);
		$('#registeredOrderingPartyDetails').addClass('hidden');
	}
}
function disableServiceFields() {
	if($('#enrude_RETBATCH01').val() != ""){
		$('#enrude_RETBATCH01').addClass('disabled');
		$('#enrude_RETBATCH01').niceSelect("update");
	}
	if($('#enrude_RETBATCH02').val() != ""){
		$('#enrude_RETBATCH02').addClass('disabled');
		$('#enrude_RETBATCH02').niceSelect("update");
	}
	if($('#enrude_NOCBATCH01').val() != ""){
		$('#enrude_NOCBATCH01').addClass('disabled');
		$('#enrude_NOCBATCH01').niceSelect("update");
	}
	if($('#enrude_NOCBATCH02').val() != ""){
		$('#enrude_NOCBATCH02').addClass('disabled');
		$('#enrude_NOCBATCH02').niceSelect("update");
	}
}
function doHandleDiscardAction(strAction,chrPaymentTypeValue)
{
	if (chrPaymentTypeValue === 'Q' && strPaymentType ==='BATCHPAY'){
		rowAction = "Q";
		doHandlePaymentInstrumentAction(strAction, false);
	}	
}

function blockPaymentInstrumentHeaderLinks(blnBlock,strMode){
    var popupInfoId = 'popUpInfoIcon';
    var navigationButtonId ='navigationButtons';
    if('VIEW' === strMode){
        popupInfoId = 'popUpInfoIconView';
        navigationButtonId ='navigationButtonsView';
    }
    $('#'+popupInfoId).show();
    $('#'+navigationButtonId).removeClass('hidden');
    if(blnBlock){
         $('#'+popupInfoId).hide();
         $('#'+navigationButtonId).addClass('hidden');
    }
}

function handleBatchHeaderLevelFields(strLayoutType, instrumentId, chrAccountLevel, chrDateLevel)
{
	if('CHECKSLAYOUT' == strLayoutType && ('01' == instrumentId || '02' == instrumentId || '07' == instrumentId))
	{
		$('.senderPanel').removeClass('hidden');
		if('B' == chrAccountLevel && 'B' == chrDateLevel)
		{
			$('.senderPanel').addClass('hidden');
		}
		else if('B' == chrAccountLevel)
		{
			$('.accountNoDiv').addClass('hidden');
		}
		else if('B' == chrDateLevel)
		{
			$('.txnDateDiv').addClass('hidden');
		}
	}
}

function doVerifySubmitPaymentHeader() {
	var flipFlag = 'N' ;
	var strUrl = _mapUrl['verifySubmitBatchUrl'];
	if (isEmpty(strUrl))
		return false;
	var arrayJson = new Array();
	arrayJson.push({
				serialNo : 1,
				identifier : strPaymentHeaderIde,
				userMessage : ''
			});
	blockBatchHeaderUI(true);
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
				blockBatchHeaderUI(false);
			}
		},
		success : function(data) {
			blockBatchHeaderUI(false);
			if (data && data.d && data.d.instrumentActions) {
				var arrResult = data.d.instrumentActions;
				var isError = false;
				if (arrResult && arrResult.length == 1) {
					if (arrResult[0].success === 'Y') {
						blockBatchHeaderUI(false);
						goToPage(_mapUrl['cancelBatchUrl'], 'frmMain');
					} else if (arrResult[0].success === 'N') {
						$('#button_btnBack').attr('disabled', false);
						closeVerifySubmitConfirmationTxnApprove();						
						if (arrResult[0].errors) {
								doClearMessageSection();
								blockBatchHeaderUI(false);
								doClearMessageSection();
							    paintErrors(arrResult[0].errors);
							}
					} 
					
				}
			}
		}
	});
}