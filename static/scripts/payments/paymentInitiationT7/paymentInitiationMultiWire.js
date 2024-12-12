var paymentResponseHeaderData = null;
var entryGridRowData = null;
var strIdentifier = null;
var chrAllowGridLayoutEntry = 'Y';
var paymentResponseInstrumentData = null;

function loadPaymentHeaderFields(arrIdentifiers) {
	if (!isEmpty(arrIdentifiers)) {
		// var url = _mapUrl['createTransactions_dummy'] + ".json";
		var url = _mapUrl['createTransactions'] + ".json";
		$.ajax({
			type : "POST",
			url : url + '?' + csrfTokenName + '=' + csrfTokenValue,
			async : false,
			contentType : "application/json",
			data : arrIdentifiers,
			complete : function(XMLHttpRequest, textStatus) {
				if ("error" == textStatus) {
					var arrError = new Array();
					arrError.push({
								"errorCode" : "Message",
								"errorMessage" : mapLbl['unknownErr']
							});
					paintErrors(arrError);
					doHandleUnknownErrorForBatch();
					blockPaymentUI(false);
				}
			},
			success : function(data) {
				if (data != null) {
					if (data.d
							&& data.d.message
							&& (data.d.message.errors && data.d.message.success === 'FAILED')) {
						doHandleEmptyScreenErrorForPaymentHeader(data.d.message.errors);
						blockPaymentUI(false);
					} else {
						paymentResponseHeaderData = data;
						strIdentifier = data && data.d && data.d
								&& data.d.identifier ? data.d.identifier : null;
						$('#paymentInstrumentInitActionDiv')
								.removeClass('hidden');
						paintPaymentHeaderActions('EDITNEXT');
						toggleGridLayoutEntryAddRow(true);
						doHandleEntryGridLoading(false, true);
						blockPaymentUI(false);
					}
				}
			}
		});
	} else {
		doHandleUnknownErrorForBatch();
		blockPaymentUI(false);
	}
}
function doSubmitPaymentHeader() {
	var strUrl = _mapUrl['batchHeaderActionUrl'] + '/submit.json'
	if (isEmpty(strUrl))
		return false;
	var arrayJson = new Array();
	arrayJson.push({
				serialNo : 1,
				identifier : strIdentifier,
				userMessage : ''
			});
	blockPaymentUI(true);
	$.ajax({
		url : strUrl,
		type : 'POST',
		async : false,
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
			blockPaymentUI(false);
			if (data && data.d && data.d.instrumentActions) {
				var arrResult = data.d.instrumentActions;
				var isError = false;
				if (arrResult && arrResult.length == 1) {
					if (arrResult[0].success === 'Y') {
						blockPaymentUI(false);
						goToPage(_mapUrl['cancelBatchUrl'], 'frmMain');
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
													&& (errCode.toUpperCase()
															.indexOf("WARN") >= 0)
													|| errCode === 'GD0002') {
												isProductCutOff = true;
											}
										});
							}
							// TODO : To be handled
							if (false && isProductCutOff) {
								var strIsRollover = 'N', strIsDiscard = 'N', strTitle = mapLbl['warnMsg'], args = {};
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
							"errorMessage" : getLabel('paymentSubmitMsg',
									'Payment submitted. Warning limit exceeded!')
						});
						paintErrors(arrError);
						blockPaymentUI(false);
					}
				}
			}
		}
	});

}
function doHandlePaymentHeaderActions(strAction, strRemarks, strBackUrl) {
	var arrayJson = new Array(), strMsg = '';
	var strUrl = _mapUrl['batchHeaderActionUrl'] + '/' + strAction + '.json';
	arrayJson.push({
				serialNo : 0,
				identifier : strIdentifier,
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
				var isError = false;
				if (arrResult && arrResult.length == 1) {
					if (arrResult[0].success === 'Y') {
						goToPage(_mapUrl[strBackUrl || 'cancelBatchUrl'],
								'frmMain');
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
							// TODO : To be handled
							if (false && isProductCutOff) {
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
								showPaymentEntryCutoffAlert(
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

function toggleGridLayoutEntryAddRow(canBind) {
	if (canBind) {
		$('#btnAddRow').unbind('click');
		$('#btnAddRow').bind('click', function() {
					$(document).trigger("addGridRow");
				});
		$('#btnSaveRec').unbind('click');
		$('#btnSaveRec').bind('click', function() {
					if (objEntryGrid
							&& objEntryGrid.isRecordInEditMode()) {
						objEntryGrid.doHandleRecordSaveOnFocusOut(
								refreshEditableGrid, null);
					}
				
		});		
	} else
	{
		$('#btnAddRow').unbind('click');
		$('#btnSaveRec').unbind('click');
}
}
function refreshEditableGrid()
{
	objEntryGrid.refreshData();
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
		if (!isEmpty(intSavedTotalNo))
			intRemained = intSavedTotalNo - intGridRecordCnt;
		if (intGridRecordCnt === 0 && intSavedTotalNo <= intMaxApplicableCount) {
			intInstCnt = intSavedTotalNo;
		} else if (intGridRecordCnt > 0 && (intGridRecordCnt < intSavedTotalNo)) {
			intInstCnt = intMaxApplicableCount <= intRemained
					? intMaxApplicableCount
					: (intMaxApplicableCount - intRemained);
		}
	}
	return intInstCnt;
}
function doHandleEntryGridLoading(isViewOnly, isGridActionEnabled) {
	if (typeof objEntryGrid != 'undefined' && objEntryGrid) {
		objEntryGrid.refreshData();
	} else {
		doCreateEntryGrid(paymentResponseHeaderData, chrAllowGridLayoutEntry,
				isViewOnly, strIdentifier, isGridActionEnabled);
	}
}

function createHeaderBackButton() {
	var btnBack = null, blnDiscardAllowed = false;
	btnBack = createButton('btnBack', 'S');
	btnBack.click(function() {
				navigateToPage(_mapUrl['cancelBatchUrl'], 'frmMain');
			});
	/**
	 * This is used to navigate back to 1st step from 2nd step in add mode.
	 * Currently handled for payment,template only, will be handled for
	 * SI/TEmplate in next sprint sprint 4
	 */
	if ((strEntryType === 'PAYMENT') && (strAction === 'ADD')) {
		btnBack.unbind("click");
		blnDiscardAllowed = isHeaderDiscardAllowed();
		if (blnDiscardAllowed) {
			btnBack.click(function() {
						getHeaderBackConfirmationPopup();
					});

		} else {
			btnBack.click(function() {
						navigateToPage(_mapUrl['backHeaderUrl'], 'frmMain');
					});
		}
	}
	return btnBack;
}
function paintPaymentHeaderActions(strAction) {
	var elt = null, btnBack = null, btnCancel = null, btnClose = null;
	$(' #paymentHdrActionButtonListLB, #paymentHdrActionButtonListRB').empty();// #paymentHdrActionButtonListLT,#paymentHdrActionButtonListRT,
	var strBtnLTLB = '#paymentHdrActionButtonListLB';// #paymentHdrActionButtonListLT
	var strBtnRTRB = '#paymentHdrActionButtonListRB';// #paymentHdrActionButtonListRT
	btnBack = createButton('btnBack', 'S');
	btnBack.click(function() {
				navigateToPage(_mapUrl['cancelBatchUrl'], 'frmMain');
			});

	btnCancel = createButton('btnCancel', 'S');
	btnCancel.click(function() {
				doCancelEditPaymentHeader();
			});

	if (strAction === 'SUBMIT') {
		elt = createButton('btnSubmit', 'P');
		elt.click(function(e) {
			doSubmitPaymentHeader();
				// navigateToPage(_mapUrl['cancelBatchUrl'], 'frmMain');
			});
		elt.appendTo($(strBtnRTRB));

		btnBack.unbind("click");
		btnBack.click(function() {
					doBackPaymentVerification();
				});
		btnBack.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");

		btnClose = createButton('btnClose', 'S');
		btnClose.click(function() {
					navigateToPage(_mapUrl['cancelBatchUrl'], 'frmMain');
				});

		btnClose.appendTo($(strBtnLTLB));
	} else if (strAction === 'EDITNEXT') {
		elt = createButton('btnVerify', 'P');
		elt.click(function() {
			// TODO: Click handling to be done
			if (objEntryGrid && objEntryGrid.isRecordInEditMode()) {
				var grid = objEntryGrid.getGrid(), record = grid.rowEditor.context
						&& grid.rowEditor.context.record
						? grid.rowEditor.context.record
						: null;
				var isNew = isEmpty((record && record.get('__metadata')
						&& isEmpty((record.get('__metadata'))._detailId)));
				if (!isNew){
					objEntryGrid.doHandleRecordSaveOnFocusOut(doHandleVerify,
							null);
				} else doHandleVerify(); 
			} else
				doHandleVerify();
		});
		elt.appendTo($(strBtnRTRB));

		btnBack.unbind("click");
		btnBack = createHeaderBackButton();
		btnBack.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");

		elt = createButton('btnDiscard', 'S');
		elt.click(function() {
					getDiscardConfirmationPopup('B');
				});
		elt.appendTo($(strBtnLTLB));

	}
}

function getDiscardConfirmationPopup(strPmtType) {
	var _objDialog = $('#discardConfirmationPopup');
	_objDialog.dialog({
				bgiframe : true,
				autoOpen : false,
				modal : true,
				resizable : false,
				width : "320px",
				buttons :[
					{
						text:getLabel('btnOk','Ok'),
						click: function() {
							$(this).dialog("close");
							doHandlePaymentHeaderActions('ignore', '',
							'cancelBatchUrl');
						}
					},
					{
						text:getLabel('btncancel','Cancel'),
						click: function() {
							$(this).dialog('destroy');
						}
					},
					]});
	_objDialog.dialog('open');
};
function doHandleVerify() {
	var errors = [];
	if (objEntryGrid.getGrid()
			&& objEntryGrid.getGrid().store.data.items.length > 0) {
		objEntryGrid.getGrid().store.each(function(rec) {
			if (rec.data.__errors.length > 0){
				errors[0] = {"errorCode": getLabel('P22.Message', 'P22'),"errorMessage": getLabel('errorAtBatch' , 'Errors exists at batch/transaction level')};
				paintErrors(errors);
				scrollWindowToTop();
				return false;
			}
		});
	} else {
		errors[0] = {"errorCode": "REQ","errorMessage": getLabel('noTransactions' , 'No transactions found for multi wire payment')};
		paintErrors(errors);
		scrollWindowToTop();
	}
	if (errors.length <= 0) {
	blockPaymentUI(false);
	doClearMessageSection();
	$('#txnStep1,#txnStep2').removeClass('ft-status-bar-li-active')
			.addClass('ft-status-bar-li-done');
		$('#txnStep3').addClass('ft-status-bar-li-active').removeClass(
				'ft-status-bar-li-done');
	$('.instActionsDiv,#messageContentDiv').addClass('hidden');
	$('.instGridTitle').removeClass('hidden');
	$('#verificationStepDiv').removeClass('hidden');
	paintPaymentHeaderActions('SUBMIT');
	if (objEntryGrid) {
		objEntryGrid.removeAll(true);
		objEntryGrid.destroy(true);
		objEntryGrid = null;
	}
	doHandleEntryGridLoading(true, false);
	blockPaymentUI(false);
	}
}

function scrollWindowToTop() {
	$("html, body").animate({
				scrollTop : 0
			}, "slow");
}

function doBackPaymentVerification() {
	blockPaymentUI(true);
	$('#txnStep1').removeClass('ft-status-bar-li-active')
			.addClass('ft-status-bar-li-done');
	$('#txnStep3').removeClass('ft-status-bar-li-active');
	$('#txnStep2').addClass('ft-status-bar-li-active')
			.removeClass('ft-status-bar-li-done');
	paintPaymentHeaderActions('EDITNEXT');
	blockPaymentUI(false);
	if (objEntryGrid) {
		objEntryGrid.removeAll(true);
		objEntryGrid.destroy(true);
	}
	objEntryGrid = null;
	$('.instActionsDiv').removeClass('hidden');
	$('.instGridTitle').addClass('hidden');
	doHandleEntryGridLoading(false, true);
}

function doHandleEmptyScreenErrorForPaymentHeader(arrError) {
	isScreenBroken = true;
	paintErrors(arrError);
	$('#paymentInstrumentInitActionDiv').addClass('hidden');
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

function paintPaymentHeaderActionsForView(strAction) {
	var elt = null, btnBack = null, btnDiscard = null, btnSubmit = null, btnDisable = null, btnEnable = null;
	$('#paymentHdrActionButtonListLB, #paymentHdrActionButtonListRB').empty();// #paymentHdrActionButtonListLT,#paymentHdrActionButtonListRT
	var strBtnLTLB = '#paymentHdrActionButtonListLB';// #paymentHdrActionButtonListLT
	var strBtnRTRB = '#paymentHdrActionButtonListRB';// #paymentHdrActionButtonListRT,
	btnBack = createHeaderBackButton();
	if (strAction === 'CANCELONLY') {
		btnBack.appendTo($(strBtnLTLB));
	}
}
function doHandleBackClick() {
	getHeaderBackConfirmationPopup();
}
function isHeaderDiscardAllowed() {
	blnRetValue = false;
	if (paymentResponseHeaderData
			&& paymentResponseHeaderData.d
			&& paymentResponseHeaderData.d.paymentEntry
			&& paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo
			&& (paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.hdrActionStatus === '0'
					|| paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.hdrActionStatus === '101'
					|| paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.hdrActionStatus === '4' || paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.hdrActionStatus === '9'))
		blnRetValue = true;
	return blnRetValue;

}
function getHeaderBackConfirmationPopup() {
	var _objDialog = $('#backConfirmationPopup');
	_objDialog.dialog({
		bgiframe : true,
		autoOpen : false,
		modal : true,
		resizable : false,
		width : "320px",
		buttons :[
			{
				text:getLabel('btnOk','Ok'),
				click : function() {
					$(this).dialog("close");
					doHandlePaymentHeaderActions('ignore', '',
					'backHeaderUrl');
					// goToPage(_mapUrl['backHeaderUrl'], 'frmMain');
				}
			},
			{
				text:getLabel('btncancel','Cancel'),
				click : function() {
					$(this).dialog('destroy');
				}
			}
			]
	});
	_objDialog.dialog('open');
}

/*------------- Transaction View Handling starts here---------------------------*/

function doShowAddedInstrument(strIde, strAction, strActionMask) {
	blockPaymentInstrumentUI(true);
	if (strAction === 'VIEW') {
		viewPaymentBatchInstrument(strIde, strAction, strActionMask);
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
}

function handleInstrumentPagination(intCount, strMode) {
	var classSuffix = (strMode === 'UPDATE') ? 'Update' : '';
	var intCurrentInst = parseInt($($('.currentPage' + classSuffix)[0]).text(),10);
	var grid = getInstrumentGrid();
	var intPgSize = 0;
	var intTotalRecords = 0, intMoveTo = 0, intRecordIndex = 0, intCurrentPage, record, strInstIdentifier, strActionMask = null;
	if (grid) {
		intMoveTo = intCurrentInst + intCount;
		record = grid.getRecord(intMoveTo);

		if (record) {
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
				if (strMode === 'UPDATE') {
					editPaymentBatchInstrument(strInstIdentifier, 'UPDATE');
					updatePagingParamsEdit(intMoveTo, grid.store.getCount());
				} else if (strMode === 'VIEW') {
					viewPaymentBatchInstrument(strInstIdentifier, 'VIEW',
							strActionMask);
					updatePagingParamsView(intMoveTo, grid.store.getCount());
				}
			}
		}

	}
}
function getInstrumentGrid() {
	var grid = null;
	if (typeof objEntryGrid != 'undefined' && objEntryGrid) {
		grid = objEntryGrid.getGrid();
	}
	return grid;
}
function handleEntryGridRowAction(grid, rowIndex, columnIndex, action, event,
		record) {
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
		strPaymentInstrumentIde = '';
		if (strAction === 'btnView') {
			strDivId = 'transactionWizardViewPopup';
			strPaintAction = 'VIEW';
		} else if (strAction === 'btnError') {
			strPaintAction = 'ERROR';
		}

		if (strPaintAction === 'VIEW') {
			var instGrid = getInstrumentGrid();
			if (instGrid) {
				toggleInstrumentPagination(strPaintAction);
				updatePagingParamsView(instGrid.getRowNumber(rowIndex + 1),
						instGrid.store.getCount());
			}
			showTransactionWizardPopup(strInstIdentifier, strPaintAction,
					strDivId, strActionMask);
		}
	}
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
			doClearMessageSection();
			$(this).data['strTxnWizardAction'] = strAction;
			if (strAction === 'VIEW')
				doShowAddedInstrument(strIde, strAction, strActionMask);
			$('.transaction-wizard :input:not(:checkbox):not(:radio):not([readonly]):visible:enabled:first')
					.focus();
			blockPaymentInstrumentUI(false);
		},
		close : function(event, ui) {
			$('#messageContentDiv').appendTo($('#messageContentHeaderDiv'));
			toggleReceiver('A', true);
			paymentResponseInstrumentData = null;
			strPaymentInstrumentIde = null;
		}
	});
	$("#" + strDivId).dialog('option', 'position', 'center');
}
function closeViewTransactionWizardPopup() {
	// To hide Receiver Section Additional Details : Start
	$('#registeredReceiverDetailsLinkInstView').trigger('click');
	// To hide Receiver Section Additional Details : End
	$('#transactionWizardViewPopup').dialog('close');
}
function viewPaymentBatchInstrument(strIde, strAction, strActionMask) {
	// TODO: URL to be changed
	var url = _mapUrl['readSavedBatchInstrumentUrl'] + ".json";
	$.ajax({
		type : "POST",
		url : url,
		async : false,
		data : JSON.stringify({					
					'$id' : strIde,
					'_mode' : 'VIEW'
				}),
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
					resetPaymentInstrumentViewOnlyUI();
					paintPaymentInstrumentViewOnlyUI(data,
							paymentResponseHeaderData);
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

					paintPaymentBatchInstrumentActions('CLOSE', false);
					toggleContainerVisibility('transactionWizardViewPopup');
					toggleContainerVisibility('paymentInstrumentViewExtraFieldsDiv');
					blockPaymentInstrumentUI(false);
					handleEmptyEnrichmentDivs();
				}
			}
		}
	});
}
function resetPaymentInstrumentViewOnlyUI() {
	$(".transactionWizardInnerDiv").find(".canClear").html('');
	$(".transactionWizardInnerDiv").find(".canCollapse").addClass('hidden');
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
	intNonEmptyDivHeight = 0;
	$('.smallEnrichDiv').each(function() {
		if (intNonEmptyDivHeight !== 0)
			$(this).attr('style', 'height:' + intNonEmptyDivHeight);
		else {
			var objNonEmptyDivId = $(this).prev().attr('id');
			if (objNonEmptyDivId) {
				intNonEmptyDivHeight = $('#' + objNonEmptyDivId).height();
				$(this).attr('style', 'height:' + intNonEmptyDivHeight);
			} else {
				objNonEmptyDivId = $(this).next().attr('id');
				intNonEmptyDivHeight = $('#' + objNonEmptyDivId).height();
				$(this).attr('style', 'height:' + intNonEmptyDivHeight);
			}
		}
		if (!$(this).prev().children() || $(this).prev().children().length == 0) {
			$(this).prev().remove();
			// $(this).remove();
		}
	});
}
function paintPaymentBatchInstrumentActions(strAction, isBtnVisible) {
	var elt = null, eltCancel = null, eltDiscard = null;
	$('#paymentDtlActionButtonListLT,#paymentDtlActionButtonListRT, #paymentDtlActionButtonListLB, #paymentDtlActionButtonListRB')
			.empty();
	var strBtnLTLB = '#paymentDtlActionButtonListLT,#paymentDtlActionButtonListLB';
	var strBtnRTRB = '#paymentDtlActionButtonListRT,#paymentDtlActionButtonListRB';
	var canShow = true;

	// This is used to handle the control total validation
	if (!isEmpty(isBtnVisible))
		canShow = isBtnVisible;

	eltCancel = createButton('btnClose', 'P');
	eltCancel.click(function() {
				doCancelViewBatchInstrument();
			});
	eltCancel.appendTo($(strBtnRTRB));
}
function doCancelViewBatchInstrument(strAction) {
	closeViewTransactionWizardPopup();
	blockPaymentUI(true);
	doClearMessageSection();
	blockPaymentUI(false);
}
function paintPaymentInstrumentViewOnlyUI(objInstData, objHdrData) {
	var arrStdFields = null, clsHide = 'hidden';
	var strFieldName = null, strValue = null, mapFields = {}, strPostFix = null, arrFields = null, ctrl = null;
	var objHdrInfo = null, objMetaData = null, paymentEntry = null, beneficiary = null, canShowEnrichmentSection = false, canShowAdditionalInfoSection = false;

	/* ...........Paint Batch Instrument Fields Start.......... */
	if (objInstData && objInstData.d && objInstData.d.paymentEntry) {
		$('#addendaSectionDiv_InstView').addClass(clsHide);
		paymentEntry = objInstData.d.paymentEntry;
		arrStdFields = paymentEntry.standardField
				? paymentEntry.standardField
				: null;
		paintPaymentInstrumentViewOnlyFields(arrStdFields, '_InfoSpan');
		if (paymentEntry.beneficiary) {
			paintReceiverViewOnlyDetails(paymentEntry.beneficiary, objHdrInfo
							? objHdrInfo
							: null);
		}
		if (paymentEntry.enrichments) {
			canShowEnrichmentSection = paintPaymentEnrichmentsViewOnlyFields(paymentEntry.enrichments);
		}
		if (paymentEntry.additionalInfo) {
			canShowAdditionalInfoSection = paintPaymentAdditionalInformationViewOnly(
					paymentEntry.additionalInfo, true);
		}
		showHideAddendaViewOnlySection(canShowEnrichmentSection,
				canShowAdditionalInfoSection);
		// paintFXForDetailViewOnlySection();
	}
	/* ...........Paint Batch Instrument Fields End.......... */

}

function resetPaymentInstrumentViewOnlyUI() {
	$(".transactionWizardInnerDiv").find(".canClear").html('');
	$(".transactionWizardInnerDiv").find(".canCollapse").addClass('hidden');
}
function paintPaymentInstrumentViewOnlyFields(arrStdFields, strPostFix) {
	var ctrlDiv = null, isExtraInfoAvailable = false, cfgAmount = null, cfgDebitCcyAmount = null, chrDebitPaymentAmntFlag = '';
	var strRateType = $('#rateType').val();
	if (arrStdFields) {
		$.each(arrStdFields, function(index, cfg) {
			strFieldName = cfg.fieldName;
			strValue = getValueToDispayed(cfg);
			strValue = !isEmpty(strValue) ? strValue : '';
			ctrl = $('.' + strFieldName + strPostFix);
			ctrlDiv = $('.' + strFieldName + strPostFix + 'Div');
			if (ctrlDiv && ctrlDiv.hasClass('hidden')
					&& !isEmpty(cfg.displayMode) && '1' != cfg.displayMode)
				ctrlDiv.removeClass('hidden');
			
			//dynamic binding of label field
			if(cfg.label){
				$("label[for=" +cfg.fieldName+ "]").text(cfg.label);
			}
			
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
			} else if ((strFieldName === 'phdNotes' || strFieldName === 'phdAlerts')
					&& !isEmpty(strValue)) {
				isExtraInfoAvailable = true;
			} else if (strFieldName === 'debitPaymentAmntFlag') {
				if (strLayoutType
						&& (strLayoutType === 'WIRELAYOUT' || strLayoutType === 'WIRESWIFTLAYOUT')
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
			} else if (strFieldName === 'rateType'
					|| strFieldName === 'contractRefNo') {
				if (getCurrencyMissMatchValueForViewOnly()) {
					if (strFieldName === 'rateType') {
						$(".rateType" + strPostFix + 'Div')
								.removeClass('hidden');
						$(".rateType" + strPostFix + 'Div')
								.removeClass('hidden');
						if (cfg.value && "1" === cfg.value) {
							$(".contractRefNo" + strPostFix + 'Div')
									.removeClass('hidden');
							$(".fxRate" + strPostFix + 'Div')
									.addClass('hidden');
						} else if (cfg.value && "3" === cfg.value) {
							$(".contractRefNo" + strPostFix + 'Div')
									.addClass('hidden');
							$(".fxRate" + strPostFix + 'Div')
									.removeClass('hidden');
						} else {
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
			} else if ((strFieldName === 'bankProduct') && !isEmpty(strValue)) {
				var posOfCurrency = strValue.indexOf('(');
				var strCurrency = strValue.substr(posOfCurrency + 1, 3);
				strValue = strValue.substr(0, posOfCurrency - 1);
				ctrl.attr('title', strCurrency);
				ctrl.html(strValue || '&nbsp;');
			} else {
				ctrl.html(strValue || '&nbsp;');
			}
		});

		if (!isEmpty(chrDebitPaymentAmntFlag))
			paintDebitCcyAmount(cfgAmount, cfgDebitCcyAmount,
					chrDebitPaymentAmntFlag, strPostFix);

		if (paymentResponseInstrumentData
				&& paymentResponseInstrumentData.d
				&& paymentResponseInstrumentData.d.paymentEntry
				&& paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo) {
			objHdrInfo = paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo;
			if (objHdrInfo) {
				$('.productCuttOff' + strPostFix).html(objHdrInfo.hdrCutOffTime
						|| '');
				$('.templateType' + strPostFix).html(objHdrInfo.hdrTemplateType
						|| '');
				var prodDesc = null;
				if ((objHdrInfo.hdrMyProductDescription).length <= 15) {
					prodDesc = objHdrInfo.hdrMyProductDescription;
					$('.hdrMyProductDescriptionTitle').attr("title",objHdrInfo.hdrMyProductDescription);
				}else {
					prodDesc = getTruncatedStringByLengthWithTooltip('.hdrMyProductDescriptionTitle',objHdrInfo.hdrMyProductDescription,15);
				}
				$('.hdrMyProductDescriptionTitle').html(prodDesc || '');
				if (strEntryType === 'PAYMENT' || strEntryType === 'SI')
					$('.batchStatusText').html((strPaymentType === 'QUICKPAY'
							? "Status : "
							: "Batch Status : ")
							+ objHdrInfo.hdrStatus || '');
				$('.siStatus' + strPostFix).text(objHdrInfo.hdrStatus || '');

				if (objHdrInfo.hdrSource) {
					$('.hdrSource_HdrInfo').text(objHdrInfo.hdrSource || '');
				}
			}
		}
	}
}
function paintReceiverViewOnlyDetails(data, dataHdrInfo) {
	var beneficiary = data, strPostFix = 'R_InstView', clsHide = 'hidden', fieldId = null;;
	if (beneficiary.drawerRegistedFlag == 'Y'
			|| beneficiary.drawerRegistedFlag == 'R') {
		arrStdFields = beneficiary.registeredBene
				? beneficiary.registeredBene
				: null;
		paintPaymentInstrumentReceiverViewOnlyFields(arrStdFields, strPostFix);
		if (arrStdFields) {
			$.each(arrStdFields, function(index, cfg) {
						fieldId = cfg.fieldName;
						if (cfg.fieldName === 'drawerCode'
								&& !isEmpty(cfg.value)) {
							toggleRegisteredReceiverInstViewMoreDetails(cfg.value);
						}
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
	if (strLayoutType === 'WIRESWIFTLAYOUT') {
		$('#registeredReceiverDetailsLinkInstView').click();
	}

}
function handleDrCrFlagOnViewPaymentInstrument(cfg, strPostFix, strValue) {
	if (cfg && cfg.value && cfg.readOnly && 'true' === cfg.readOnly) {
		var strDrCrLabel = cfg.value !== 'B'
				&& !isEmpty(mapDrCrReadonlyLabel[strPaymentType][cfg.value][strLayoutType])
				? mapDrCrReadonlyLabel[strPaymentType][cfg.value][strLayoutType]
				: cfg.value === 'D' ? getLabel('debitTransaction',
						'Debit') : getLabel('creditTransaction',
						'Credit');
		if ('D' === cfg.value) {
			$('.drCrFlagD' + strPostFix).empty();
			$('.drCrFlagC' + strPostFix).remove();
			$('.drCrFlagD' + strPostFix).removeClass('hidden');
			$('<div class="form-group"><label>'+ getLabel('transactionType', 'Transaction Type') +' : </label><br><span> '
					+ strDrCrLabel + '</span></div>').appendTo($('.drCrFlagD'
					+ strPostFix));
		} else if ('C' === cfg.value) {
			$('.drCrFlagC' + strPostFix).empty();
			$('.drCrFlagD' + strPostFix).remove();
			$('.drCrFlagC' + strPostFix).removeClass('hidden');
			$('<div class="form-group"><label>'+ getLabel('transactionType', 'Transaction Type') +' : </label><br><span> '
					+ strDrCrLabel + '</span></div>').appendTo($('.drCrFlagD'
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
}
function getCurrencyMissMatchValueForViewOnly() {
	var data = paymentResponseInstrumentData, fieldId = null, isCcyMissMatch = false;
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
function paintDebitCcyAmount(cfgAmount, cfgDebitCcyAmount,
		chrDebitPaymentAmntFlag, strPostFix) {
	var ctrl = null, strFieldName = 'amount', strFormattedValue = '';
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

function paintPaymentInstrumentReceiverViewOnlyFields(arrStdFields, strPostFix) {
	var strBankAccountInfo = '', strCurrency = '', strAccountType = '', clsHide = 'hidden', strTag57Type = '', strTag54Type = '', strTag56Type = '';
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

			if ((strFieldName === 'beneAccountType')
					&& !isEmpty(strLayoutType)
					&& (strLayoutType !== 'WIRELAYOUT' || strLayoutType !== 'WIRESWIFTLAYOUT')) {
				strAccountType = strValue;
			} else if (strFieldName === 'drawerCurrency') {
				strCurrency = strValue;
			} else if (strFieldName === 'beneficiaryBankIDType') {
				ctrl.html('(' + strValue + ')');
			} else {
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
		// handleTagFieldValueSectionShowHide(strTag57Type,strTag54Type,strTag56Type);
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
		}
	}
	return strReturnValue;
}
function generateSortAvalValArray(arrAvlValue) {
	var arrRet = new Array();
	if (arrAvlValue)
		arrRet = arrAvlValue.sort(function(valA, valB) {
					return valA.seq - valB.seq
				});
	return arrRet;
}
function toggleRegisteredReceiverInstViewMoreDetails(strBeneCode) {
	var ctrl = $('#registeredReceiverDetailsLinkInstView');
	if (ctrl) {
		ctrl.unbind('click');
		$('.registeredReceiverDetailsInstView').addClass('hidden');
		ctrl.bind('click', function() {
					var ctrl1 = $('.registeredReceiverDetailsInstView')
					var isHidden = ctrl1.hasClass('hidden');
					ctrl1.toggleClass('hidden');
				});
	}
}
function handleReceiverTagDetailsSection(isViewOnly) {
	var data = paymentResponseInstrumentData, objHdrInfo = null, strClsHidden = 'hidden';
	if (data && data.d && data.d.paymentEntry
			&& data.d.paymentEntry.paymentHeaderInfo)
		objHdrInfo = data.d.paymentEntry.paymentHeaderInfo;
	if (!isEmpty(objHdrInfo)) {
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
}
function paintPaymentEnrichmentsViewOnlyFields(objData) {
	var data = objData;
	var setNameMap = {}, isVisible = false, isVisibleTransAddenda = false, clsHide = 'hidden', intConterForTransAddenda = 1, intCounter = 1, strTargetId = 'addendaInfoEnrichDiv_InstView', strTransAddendaTargetId = 'addendaInfoEnrichInTransctionDiv_InstView';
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
		paintPaymentMyProductMultiSetEnrichments(data.myProductMultiSet,
				data.myProductMultiSetMetadata, intCounter,
				'myProductMultiSetEnrichDiv_InstView', 'Q', true);
		isVisible = true;
	}
	if (data.bankProductMultiSet && data.bankProductMultiSetMetadata) {
		paintPaymentBankProductMultiSetEnrichments(data.bankProductMultiSet,
				data.bankProductMultiSetMetadata, intCounter,
				'bankProductMultiSetEnrichDiv_InstView', 'Q', true);
		isVisible = true;
	}
	if (data.clientMultiSet && data.clientMultiSetMetadata) {
		paintPaymentClientProductMultiSetEnrichments(data.clientMultiSet,
				data.clientMultiSetMetadata, intCounter,
				'clientMultiSetEnrichDiv_InstView', 'Q', true);
		isVisible = true;
	}
	if (isVisibleTransAddenda) {
		$('#addendaInfoEnrichInTransctionDiv_InstView').removeClass(clsHide);
	}
	if (isVisible) {
		$('#AddBankInfo_InstView').removeClass(clsHide);// addendaSectionDiv_InstView
	}

	if ((isVisibleTransAddenda || isVisible) && strLayoutType != 'ACCTRFLAYOUT'
			&& strLayoutType !== 'SIMPLEACCTRFLAYOUT')
		$('#addendaInfoDiv_InstView').removeClass(clsHide);

	return (isVisibleTransAddenda || isVisible);
}
function paintPaymentEnrichmentAsSetNameViewOnly(setNameMap, arrPrdEnr,
		strTargetId) {
	paintPaymentEnrichmentAsSetNameNonWireLayoutViewOnly(setNameMap, arrPrdEnr,
			strTargetId);
}
function paintPaymentEnrichmentAsSetNameNonWireLayoutViewOnly(setNameMap,
		arrPrdEnr, strTargetId) {
	var valueSpan = null, targetDiv = $('#' + strTargetId), label = null, div = null, innerDiv = null, intCnt, tempObj, mainDiv = null, fieldSetDiv = null, fieldset = null, legend = null, strLabel = null;
	var strSetName = null, blnNewRow = true, enrField = null, enrFieldSeqNo = 0;
	var colCls = (strLayoutType === 'WIRESWIFTLAYOUT' || strLayoutType === 'ACHIATLAYOUT')
			? 'col-sm-6'
			: 'col-sm-4';
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

					if (strLayoutType === 'WIRELAYOUT'
							|| strLayoutType === 'WIRESIMPLELAYOUT')
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

					// chkBoxLbl.append(' ' + cfg.enrichmentSetName);
					internalWrapperDiv = $('<div>').attr({
								'id' : strSetName
										+ '_InternalWrapperViewOnlyDiv',
								'class' : 'col-sm-12 '
							}).appendTo(wrapperDiv);

					// internalShadedDiv = $('<div>').attr({
					// 'id' : strSetName + '_shadedViewOnlyDiv',
					// 'class' : 'well'
					// }).appendTo(internalWrapperDiv);

					mainDiv = $('<div>').attr({
								'id' : strSetName,
								'class' : 'row'
							}).appendTo(internalWrapperDiv);

					tempObj = {};
					tempObj['mainDiv' + strSetName] = mainDiv;
					tempObj['fieldSetDiv' + strSetName] = fieldSetDiv;
					tempObj[strSetName + 'Counter'] = 1;
					setNameMap[strSetName] = tempObj;
				}
				if (!isEmpty(tempObj)) {
					intCnt = tempObj[strSetName + 'Counter'];
					if (cfg.enrichmentType == 'S' || cfg.enrichmentType == 'M') {
						var strAdditionalHelperCls = (!isEmpty(cfg.displayType) && (cfg.displayType === 10 || cfg.displayType === 11))
								? 'smallEnrichDiv'
								: '';
						div = $('<div>').attr({
									'class' : colCls + ' '
											+ strAdditionalHelperCls,
									'id' : cfg.code + 'Div'
								});
						innerDiv = $('<div>').attr({
									'class' : 'form-group',
									'id' : cfg.code + '_InnerDiv'
								});

						if (!isEmpty(cfg.displayType) && cfg.displayType != 10)
							label = $('<label>').html(cfg.description + ' : ');
						else
							label = $('<label>').html("");

						strValue = getEnrichValueToDispayed(cfg);
						strValue = !isEmpty(strValue) ? strValue : '&nbsp;';

						valueSpan = $('<div>').html(' ' + strValue);

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
									} else {
										if (!isEmpty(cfg.displayType)
												&& cfg.displayType != 10
												&& cfg.displayType != 11) {
											div.addClass(colCls);
										} else {
											var strAdditionalHelperCls = 'smallEnrichDiv';
											div.addClass(colCls + ' '
													+ strAdditionalHelperCls);
										}
									}
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
function getEnrichValueToDispayed(cfg) {
	var displayType = cfg.displayType;
	var strReturnValue = '', strTemp = '', defValue = cfg.value;
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
			if (!isEmpty(cfg.value) && isEmpty(strReturnValue)
					&& cfg.allowAdhocValue) {
				strReturnValue = cfg.value;
			}
			break;
		case 5 : // SELECTBOX
			break;
		case 8 : // SEEKBOX
			break;
		case 10 : // CHECKBOX
			strReturnValue = cfg.value === 'Y' ? '<i class="fa fa-check"></i> '
					+ cfg.description : cfg.description;
			break;
		case 11 : // RADIOBUTTON
			if (!isEmpty(cfg.value)) {
				strReturnValue = getObjectFormJsonKeyValueArray(cfg.value,
						cfg.lookupValues);
				strReturnValue = strReturnValue && strReturnValue.value
						? strReturnValue.value
						: '';
			}
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
function paintPaymentEnrichmentsHelperViewOnly(arrPrdEnr, intCounter,
		strTargetId, strPmtType, argsData) {
	var targetDiv = $('#' + strTargetId), label = null, div = null, wrappingDiv = null, intCnt = 1, sortArrPrdEnr, minCounter, maxCounter, arrLength;
	var colCls = 'col-sm-6';
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
					var strAdditionalHelperCls = (!isEmpty(enrField.displayType) && (enrField.displayType === 10 || enrField.displayType === 11))
							? 'smallEnrichDiv'
							: '';
					wrappingDiv = $('<div>').attr({
								'class' : colCls + ' ' + strAdditionalHelperCls,
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
					if (!isEmpty(enrField.displayType)
							&& enrField.displayType != 10)
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
function generateSortArrPrdEnr(arrPrdEnr) {
	var arrRet = new Array();
	if (arrPrdEnr)
		arrRet = arrPrdEnr.sort(function(valA, valB) {
					return valA.sequenceNmbr - valB.sequenceNmbr
				});
	return arrRet;
}
function getEnrField(arrPrdEnr, seqNo) {
	var retField = null;
	for (var i = 0; i < arrPrdEnr.length; i++) {
		if (arrPrdEnr[i].sequenceNmbr === seqNo)
			retField = arrPrdEnr[i];

	}
	return retField;
}
function paintPaymentAdditionalInformationViewOnly(data, isViewOnly) {
	var canShowOrderingParty = false, canShowAdditionalRefInfo = false, canShowBankToBankInfo = false, clsHide = 'hidden', canShow = false;
	if (data.orderingParty) {
		canShowOrderingParty = paintPaymentAdditionalInfoOrderingPartyViewOnlyFields(data.orderingParty);
	}
	if (strLayoutType === 'WIRESWIFTLAYOUT')
		canShowAdditionalRefInfo = true;
	if (canShowOrderingParty || canShowAdditionalRefInfo
			|| canShowBankToBankInfo)
		canShow = true;

	if (canShow)
		$('#additionlInfoSectionDiv_InstView').removeClass('hidden');

	if (strLayoutType === 'WIRESWIFTLAYOUT' && canShowOrderingParty) {
		$('#orderingPartyMoreDetailsViewOnlyLink').click();
	}

	return canShow;
}
function paintPaymentAdditionalInfoOrderingPartyViewOnlyFields(data) {
	var arrFields = [];
	var strDisplayMode = null, divId = null, fieldId = null, lblId = null, canShow = false;
	var clsHide = 'hidden';
	var blnOnlyRegisteredOrderingParty = false;
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
						$('#orderingPartyMoreDetails' + linkIdSuffix)
								.addClass('hidden');
						if (fieldId === 'orderingParty' && !isEmpty(cfg.value)) {
							canShow = true;
							$('#orderingPartyMoreDetails' + linkIdSuffix)
									.removeClass('hidden');
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
			if (orderingPartyDetails) {
				$.each(orderingPartyDetails, function(index, value) {
							var divId = index + divPostFix;
							var fieldId = index + lblPostFix;
							if ($("#" + fieldId).length != 0) {
								$("#" + fieldId).text(value);
							}
						});
				$("#line1" + lblPostFix)
						.text(orderingPartyDetails.orderDescription);
				$("#line2" + lblPostFix).text(orderingPartyDetails.addr1
						.substring(0, 35));
				$("#line3" + lblPostFix).text(orderingPartyDetails.addr1
						.substring(35, 70));
				if (!isEmpty(orderingPartyDetails.benCountry))
					line4 = orderingPartyDetails.benCountry.substring(0, 10);
				if (!isEmpty(orderingPartyDetails.benState)
						&& orderingPartyDetails.benState != 'NONE')
					line4 = line4
							+ orderingPartyDetails.benState.substring(0, 10);
				if (!isEmpty(orderingPartyDetails.benCity))
					line4 = line4
							+ orderingPartyDetails.benCity.substring(0, 10);
				if (!isEmpty(orderingPartyDetails.benPostCode))
					line4 = line4 + orderingPartyDetails.benPostCode;
				if (!isEmpty(line4))
					$("#line4" + lblPostFix).text(line4.substring(0, 35));
			}
		}
		// $("#" + linkId).text(getLabel('lessDetails', 'Contact Info'));
		if (isViewMode) {
			$("#plusIconOV").removeClass('fa-plus');
			$("#plusIconOV").addClass('fa-minus');
		} else {
			$("#plusIconA").removeClass('fa-plus');
			$("#plusIconA").addClass('fa-minus');
		}
	} else {
		// $("#" + linkId).text(getLabel('additionalDetails', 'Contact Info'));
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
function showHideAddendaViewOnlySection(isEnrichAvailable,
		isAdditionalInfoAvailable, strPostFix) {
	if (isEnrichAvailable || isAdditionalInfoAvailable)
		$("#addendaSectionDiv_InstView").removeClass('hidden');
	else
		$("#addendaSectionDiv_InstView").addClass('hidden');
}
function toggleReceiverCodeNecessity() {
	var clsHide = 'hidden', clsReq = 'required';
	if ($('#saveBeneFlagA').is(':checked')) {
		$('#drawerCodeALbl').addClass(clsReq);
		$('#drawerCodeA').attr('readonly', false);
		$('#saveBeneFlagA').val('Y');
		$('#drawerCodeA').blur(function mark() {
					markRequired($(this));
				});
		$('#drawerCodeA').focus(function() {
					removeMarkRequired($(this));
				});
	} else {
		$('#drawerCodeALbl').removeClass(clsReq);
		$('#saveBeneFlagA').val('N');
		$('#drawerCodeA').val('');
		$('#drawerCodeA').attr('readonly', true);
		$('#drawerCodeA').unbind('blur');
		$('#drawerCodeA').removeClass('requiredField');
	}
}
function paintPaymentEnrichmentsHelper(arrPrdEnr, intCounter, strTargetId,
		strPmtType, argsData, isMultiset) {
	var field = null, targetDiv = $('#' + strTargetId), label = null, div = null, wrappingDiv = null, intCnt = 1, sortArrPrdEnr, minCounter, maxCounter, arrLength;
	var colCls = 'col-sm-6';
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
					var strAdditionalHelperCls = (!isEmpty(enrField.displayType) && (enrField.displayType === 10 || enrField.displayType === 11))
							? 'smallEnrichDiv'
							: '';
					wrappingDiv = $('<div>').attr({
								'class' : colCls + ' ' + strAdditionalHelperCls,
								'id' : enrField.code + 'wrappDiv'
							});
					div = $('<div>').attr({
								'class' : 'form-group',
								'id' : enrField.code + 'Div'
							});
					// label = $('<label>').attr('class', 'fieldLabel');
					label = $('<label>').attr('class', 'payment-font-bold');

					if (!isEmpty(enrField.displayType)
							&& enrField.displayType != 10)
						label.text(enrField.description);
					else
						label.text("");

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
						if (!isEmpty(enrField.displayType)
								&& enrField.displayType != 10
								&& enrField.displayType != 11)
							field.addClass('form-control')

						if (enrField.displayType === 6)// DATEBOX
						{
							field
									.addClass('form-control ft-datepicker hasDatepicker');
							var dateDiv = $('<div>').attr({
										'class' : 'input-daterange'
									});
							field.attr('style', 'width:90%');
							field.appendTo(dateDiv);
							$('<div class="input-group-addon has-icon"><i class="fa fa-calendar"></i></div>')
									.appendTo(dateDiv);
							dateDiv.appendTo(innerDiv);
						} else
							field.appendTo(div);
						if (enrField.allowAdhocValue) {
							if (field.hasClass('jq-editable-combo')) {
								field.editablecombobox("destroy");
							}

							$(field).editablecombobox({
										emptyText : 'Select '
												+ enrField.description,
										maxLength : 5,
										adhocValueAllowed : enrField.allowAdhocValue,
										adhocEnteredValue : enrField.value,
										title : mapLbl['lblAdhocFieldDisclaimer']
									});
							$(field).editablecombobox('refresh');
							var spanIndicator = $('<span>').attr({
										'style' : 'color:red'
									});
							spanIndicator.text(' '
									+ mapLbl['lblAdhocFieldIndicator']);
							spanIndicator.appendTo(label);
							blnTransDisclaimerVisibiliity = true;
						}

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
					cfg.lookupValues, false, cfg.allowAdhocValue);
			field.addClass('w15_7 ml12');
			break;
		case 5 : // SELECTBOX
			break;
		case 6 : // DATEBOX
			var dateFormat = strApplicationDateFormat
					? strApplicationDateFormat
					: 'mm/dd/yyyy';
			field = createEnrichmentDateBox(cfg.code, cfg.code, value, true,
					cfg.maxLength, dateFormat, cfg.mandatory);
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
			// field.ForceNoSpecialSymbol();
			break;
		case 10 : // CHECKBOX
			field = createEnrichmentCheckBox(cfg.code, cfg.description,
					cfg.value, cfg.mandatory);
			break;
		case 11 : // RADIOBOX
			field = createEnrichmentRadioButton(cfg.code, value,
					cfg.lookupValues, cfg.mandatory);
			break;
		case 0 : // TEXTBOX
		default :
			field = createTextBox(cfg.code, cfg.code, value, false,
					cfg.maxLength);
			field.addClass('w14_8 ml12');
			// field.ForceNoSpecialSymbol();
			break;
	}
	return field;
}
function toggleReceiver(charReceiverType, clearFields) {
	if (!isEmpty(charReceiverType)) {
		if (charReceiverType === 'A') {
			strReceiverType = 'A';
			$('.adhocReceiver').removeClass('hidden');
			$('#registeredReceiverDiv').addClass('hidden');
			$("#switchToAdhocReceiverDiv").addClass("hidden");
			$('#beneficiaryBankIDTypeA').change(function() {
						resetAdhocReceiverBankDetails();
					});
		autoFocusOnFirstElement(null,'adhocReceiverDiv',true);
		} else if (charReceiverType === 'R') {
			strReceiverType = 'R';
			$('.adhocReceiver').addClass('hidden');
			$('#registeredReceiverDiv').removeClass('hidden');
			if ($("#switchToAdhocReceiverDiv"))
				$("#switchToAdhocReceiverDiv").removeClass("hidden")
		} else if (charReceiverType === 'T') {
			charReceiverType = 'R';
			strReceiverType = 'R';
			$("#switchToAdhocReceiverDiv").remove();
			$('.adhocReceiver').remove();
			$('#registeredReceiverDiv').remove();
			$('.systemReceiver').removeClass('hidden');
			$("#drawerDescriptionR").ReceiverAutoComplete(strMyProduct, null,
					'Q', true);
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
	$('#beneficiaryAdhocbankFlagA').val('Y');
	$("#beneficiaryBankIDCodeAInfoMessage").empty();
	// doBankIDValidation();
}
/*------------- Transaction View Handling ends here---------------------------*/
